// Balance Duel: take turns putting weights on a seesaw. Whoever tips it loses the round.
// Science: levers and torque. Turning force = mass × distance from the pivot; the beam balances when
// the turning forces on each side cancel, and tips when the difference passes its limit.
(function () {
  'use strict';
  const A = window.Arcade;
  const { $, rngFor, randomCode, cleanCode, toast } = A;
  const dailyCode = () => A.dailyCode('balance');

  const W = 1000, H = 520;
  const SLOTS = 6;            // slots -6..6 along the beam
  const SPACING = 62;         // pixels between slots
  const BEAM_Y = 300;         // pivot height on screen
  let MAX_STACK = 1;          // weights per slot: one, so close-in spots fill up and later weights must go far out
  const PIVOT_RANGE = 3;      // the pivot can be moved to -3..3
  const COLORS = ['#ff8a5c', '#5cc8ff'];
  const TOPICS = ['Forces'];

  // ---------- rules ----------
  // Turning force of everything on the beam about the pivot. Positive tips right, negative tips left.
  const torqueOf = (beam, pivot) => beam.reduce((t, w) => t + w.m * (w.s - pivot), 0);
  const sideTorques = (beam, pivot) => {
    let l = 0, r = 0;
    for (const w of beam) { const d = w.s - pivot; if (d < 0) l += w.m * -d; else r += w.m * d; }
    return { l, r };
  };
  const stackAt = (beam, s) => beam.filter((w) => w.s === s).length;
  function legalMoves(st, p) {
    const out = [], masses = [...new Set(st.hands[p])].sort((a, b) => a - b);
    for (const m of masses) for (let s = -SLOTS; s <= SLOTS; s++) {
      if (s === st.pivot || stackAt(st.beam, s) >= MAX_STACK) continue;
      out.push({ m, s, net: st.net + m * (s - st.pivot) });
    }
    return out;
  }
  const isSafe = (st, mv) => Math.abs(mv.net) <= st.limit;
  const safeMoves = (st, p) => legalMoves(st, p).filter((mv) => isSafe(st, mv));

  // ---------- rounds from the seed ----------
  // Both players get the same hand. Some weights may start on the beam. The limit (how far the beam
  // can lean before it tips) changes each round. Who goes first alternates.
  function buildRound(key) {
    const rng = rngFor(key);
    const handSize = 4 + Math.floor(rng() * 2);
    const hand = [];
    for (let i = 0; i < handSize; i++) hand.push(1 + Math.floor(rng() * 5));
    hand.sort((a, b) => a - b);
    const limit = 8 + Math.floor(rng() * 7);
    const beam = [];
    const pre = Math.floor(rng() * 3);
    for (let i = 0; i < pre; i++) {
      const m = 1 + Math.floor(rng() * 3);
      let s = 0;
      while (s === 0) s = -SLOTS + Math.floor(rng() * (2 * SLOTS + 1));
      if (Math.abs(torqueOf(beam.concat([{ m, s }]), 0)) <= limit / 2) beam.push({ m, s, owner: -1 });
    }
    return { hands: [hand.slice(), hand.slice()], limit, beam, pivot: 0 };
  }

  // ---------- state ----------
  const state = {
    code: '', round: 1, turn: 0, wins: [0, 0], draws: 0,
    beam: [], pivot: 0, net: 0, limit: 10, hands: [[], []],
    selected: [null, null], hoverSlot: null,
    tricked: [false, false], trickLocked: [false, false], pivotPick: false,
    rescued: [false, false],
    roundOver: false, tipped: 0, angle: 0, targetAngle: 0, falling: [],
    moves: 0, closest: Infinity, cpu: true, cpuBusy: false, limitHacked: false
  };
  if (/[?&]test\b/.test(location.search)) { window.__s = state; window.__bd = { legalMoves, safeMoves, buildRound, torqueOf, setStack(n) { MAX_STACK = n; } }; }

  const game = {
    get pivot() { return state.pivot; },
    get limit() { return state.limit; },
    set limit(v) { state.limit = Math.max(1, +v || 1); state.limitHacked = true; renderHud(); },
    get net() { return state.net; },
    get beam() { return state.beam.map((w) => ({ mass: w.m, slot: w.s, distance: w.s - state.pivot, turning: w.m * (w.s - state.pivot) })); },
    get hands() { return state.hands.map((h) => h.slice()); },
    get code() { return state.code; },
    get answers() { return A.answers; }
  };

  // ---------- drawing ----------
  const cv = $('cv'), ctx = cv.getContext('2d');
  const stage = $('stage');
  let fit = { k: 1 };
  const animating = () => Math.abs(state.angle - state.targetAngle) > 0.0005 || state.falling.length > 0;
  const loop = A.loop(frame, animating);
  const wake = loop.wake;
  function resize() { fit = A.fitCanvas(cv, W, H); wake(); }
  window.addEventListener('resize', resize);
  const slotX = (s) => W / 2 + s * SPACING;
  const nameOf = (i) => ($('name-' + i).value.trim() || (i === 1 && state.cpu ? 'CPU' : 'Player ' + (i + 1)));
  const blockSize = (m) => ({ w: 26 + m * 5, h: 16 + m * 4 });

  function frame() {
    // ease the beam toward its lean; when it tips, it swings hard
    state.angle += (state.targetAngle - state.angle) * (A.reduceMotion ? 1 : 0.12);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#0c1226'; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.setTransform(fit.k, 0, 0, fit.k, 0, 0);
    // ground
    ctx.fillStyle = '#1a2340'; ctx.fillRect(0, BEAM_Y + 70, W, H - BEAM_Y - 70);
    // meter
    drawMeter();
    // fulcrum under the pivot
    const px = slotX(state.pivot);
    ctx.fillStyle = '#ffd166';
    ctx.beginPath(); ctx.moveTo(px, BEAM_Y + 6); ctx.lineTo(px - 34, BEAM_Y + 70); ctx.lineTo(px + 34, BEAM_Y + 70); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#10131f'; ctx.font = '700 12px "IBM Plex Mono", monospace'; ctx.textAlign = 'center'; ctx.fillText('pivot', px, BEAM_Y + 58);
    // the beam turns around the pivot
    ctx.save();
    ctx.translate(px, BEAM_Y);
    ctx.rotate(state.angle);
    ctx.translate(-px, -BEAM_Y);
    const x0 = slotX(-SLOTS) - 30, x1 = slotX(SLOTS) + 30;
    ctx.fillStyle = '#8a6a48'; ctx.fillRect(x0, BEAM_Y - 8, x1 - x0, 14);
    ctx.fillStyle = '#6b5136'; ctx.fillRect(x0, BEAM_Y + 4, x1 - x0, 3);
    for (let s = -SLOTS; s <= SLOTS; s++) {
      const x = slotX(s), d = s - state.pivot;
      ctx.fillStyle = s === state.pivot ? '#ffd166' : '#d6c3a5';
      ctx.fillRect(x - 1, BEAM_Y - 8, 2, 14);
      ctx.fillStyle = '#9aa3bd'; ctx.font = '600 11px "IBM Plex Mono", monospace'; ctx.textAlign = 'center';
      ctx.fillText(String(Math.abs(d)), x, BEAM_Y + 22);
    }
    // weights stacked on their slots
    const stacks = {};
    for (const w of state.beam) {
      const k = stacks[w.s] || 0; stacks[w.s] = k + 1;
      const b = blockSize(w.m);
      let y = BEAM_Y - 8;
      for (const o of state.beam) { if (o === w) break; if (o.s === w.s) y -= blockSize(o.m).h + 2; }
      drawBlock(slotX(w.s) - b.w / 2, y - b.h, b.w, b.h, w.m, w.owner < 0 ? '#8b93a8' : COLORS[w.owner]);
    }
    // ghost of the move being considered
    const p = state.turn, sel = state.selected[p];
    if (!state.roundOver && sel !== null && state.hoverSlot !== null && humanTurn()) {
      const s = state.hoverSlot;
      if (s !== state.pivot && stackAt(state.beam, s) < MAX_STACK) {
        let y = BEAM_Y - 8;
        for (const o of state.beam) if (o.s === s) y -= blockSize(o.m).h + 2;
        const b = blockSize(sel);
        ctx.globalAlpha = 0.45; drawBlock(slotX(s) - b.w / 2, y - b.h, b.w, b.h, sel, COLORS[p]); ctx.globalAlpha = 1;
      }
    }
    ctx.restore();
    // tumbling weights after a tip
    for (const f of state.falling) {
      f.vy += 0.5; f.x += f.vx; f.y += f.vy; f.rot += f.vr;
      if (f.y > BEAM_Y + 70 - f.h / 2) { f.y = BEAM_Y + 70 - f.h / 2; f.vy *= -0.3; f.vx *= 0.7; f.vr *= 0.5; f.rest++; }
      ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.rot); drawBlock(-f.w / 2, -f.h / 2, f.w, f.h, f.m, f.col); ctx.restore();
    }
    state.falling = state.falling.filter((f) => f.rest < 20);
  }

  function drawBlock(x, y, w, h, m, col) {
    ctx.fillStyle = col; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(x, y + h - 4, w, 4);
    ctx.fillStyle = '#10131f'; ctx.font = '700 ' + (11 + m) + 'px "Saira Semi Condensed", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(m + 'kg', x + w / 2, y + h / 2);
  }

  // The gauge: how hard the beam is being turned left or right, against the limit.
  function drawMeter() {
    const t = sideTorques(state.beam, state.pivot);
    const cx = W / 2, y = 52, half = 300;
    const scale = half / Math.max(state.limit * 1.6, 1);
    ctx.fillStyle = 'rgba(255,107,129,0.18)';
    ctx.fillRect(cx - half, y - 12, half - state.limit * scale, 24);
    ctx.fillRect(cx + state.limit * scale, y - 12, half - state.limit * scale, 24);
    ctx.strokeStyle = '#2a3658'; ctx.lineWidth = 2; ctx.strokeRect(cx - half, y - 12, 2 * half, 24);
    ctx.fillStyle = '#ff6b81';
    ctx.fillRect(cx - state.limit * scale - 1, y - 16, 2, 32); ctx.fillRect(cx + state.limit * scale - 1, y - 16, 2, 32);
    const nx = cx + A.clamp(state.net, -state.limit * 1.6, state.limit * 1.6) * scale;
    ctx.fillStyle = Math.abs(state.net) > state.limit ? '#ff6b81' : '#7ee0a1';
    ctx.beginPath(); ctx.moveTo(nx, y - 14); ctx.lineTo(nx - 7, y - 24); ctx.lineTo(nx + 7, y - 24); ctx.closePath(); ctx.fill();
    ctx.fillRect(nx - 2, y - 12, 4, 24);
    ctx.font = '600 13px "IBM Plex Mono", monospace'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#e7e9f3';
    ctx.textAlign = 'right'; ctx.fillText('left turning ' + t.l, cx - half - 10, y);
    ctx.textAlign = 'left'; ctx.fillText(t.r + ' right turning', cx + half + 10, y);
    ctx.textAlign = 'center'; ctx.fillStyle = '#9aa3bd';
    ctx.fillText('difference ' + Math.abs(state.net) + ' · tips past ' + state.limit, cx, y + 30);
  }

  // ---------- HUD ----------
  const humanTurn = () => !(state.cpu && state.turn === 1) && !A.demo.active;
  function renderHud() {
    document.documentElement.style.setProperty('--turn', COLORS[state.turn]);
    for (let i = 0; i < 2; i++) {
      $('wins-' + i).textContent = state.wins[i];
      $('card-' + i).classList.toggle('active', state.turn === i && !state.roundOver);
      const hand = $('hand-' + i);
      hand.innerHTML = '';
      state.hands[i].forEach((m, k) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'weight' + (state.selected[i] === m && state.turn === i ? ' selected' : '');
        b.textContent = m + 'kg';
        b.style.setProperty('--wpad', (2 + m) + 'px');
        b.disabled = state.turn !== i || state.roundOver || !humanTurnFor(i) || A.modalOpen();
        b.addEventListener('click', () => { state.selected[i] = m; renderHud(); });
        hand.appendChild(b);
      });
      if (!state.hands[i].length) hand.innerHTML = '<span class="none">Hand empty</span>';
      $('trick-' + i).textContent = state.trickLocked[i] ? 'Pivot trick locked' : state.tricked[i] ? 'Pivot trick used' : 'Pivot trick ready';
    }
    const p = state.turn, safe = state.roundOver ? 0 : safeMoves(state, p).length;
    $('turn-label').textContent = state.roundOver ? 'Round over'
      : A.quiz.isOpen ? nameOf(p) + ' answering questions'
      : state.pivotPick ? nameOf(p) + ': pick a direction for the pivot'
      : state.cpuBusy ? nameOf(p) + ' is thinking…'
      : nameOf(p) + ' to place a weight';
    $('safe-info').textContent = state.roundOver ? '' : safe ? safe + ' safe moves' : 'No safe moves!';
    const myTurn = !state.roundOver && humanTurn() && !A.modalOpen();
    $('pivot-btn').disabled = !myTurn || state.tricked[p] || state.trickLocked[p] || state.pivotPick;
    $('pivot-left').hidden = $('pivot-right').hidden = !state.pivotPick;
    $('pivot-left').disabled = state.pivot <= -PIVOT_RANGE;
    $('pivot-right').disabled = state.pivot >= PIVOT_RANGE;
    $('rescue-btn').disabled = !myTurn || state.rescued[p] || safe > 0;
    $('round-num').textContent = state.round;
    $('draws').textContent = state.draws;
    $('limit').textContent = state.limit;
    $('stage-label').textContent = (A.demo.active ? 'Demo' : state.code) + ' · round ' + state.round;
    $('practice-btn').disabled = !(A.demo.active || state.roundOver) || A.modalOpen();
    $('name-1').placeholder = state.cpu ? 'CPU' : 'Player 2';
    wake();
  }
  const humanTurnFor = (i) => !(state.cpu && i === 1) && !A.demo.active;
  A.onModal(renderHud);

  // ---------- play ----------
  function loadRound() {
    const r = buildRound(state.code + '-R' + state.round);
    Object.assign(state, {
      beam: r.beam, pivot: r.pivot, limit: r.limit, hands: r.hands, net: torqueOf(r.beam, r.pivot),
      selected: [null, null], tricked: [false, false], trickLocked: [false, false], pivotPick: false, rescued: [false, false],
      roundOver: false, tipped: 0, falling: [], moves: 0, closest: Infinity, limitHacked: false,
      turn: (state.round - 1) % 2
    });
    state.targetAngle = leanAngle();
    state.angle = state.targetAngle;
    state.hands.forEach((h, i) => (state.selected[i] = h[0] || null));
    $('banner').hidden = true;
    A.quiz.close();
    renderHud();
    afterTurnChange();
  }
  const leanAngle = () => A.clamp(state.net / Math.max(state.limit, 1), -1, 1) * 0.16;

  function setCode(code) {
    if (A.demo.active) stopDemo();
    state.code = cleanCode(code) || randomCode();
    $('seed-input').value = state.code;
    try { history.replaceState(null, '', '#' + state.code); } catch (e) { /* ignore */ }
    state.round = 1; state.wins = [0, 0]; state.draws = 0;
    loadRound();
    if (!A.store.get('balance-intro', false)) {
      A.store.set('balance-intro', true);
      A.facts.show({ kicker: 'Balance Duel', title: 'Turning force = weight × distance', sub: 'A weight far from the pivot turns the beam harder than the same weight close in. Don’t be the one who tips it!', facts: window.SCIENCE_FACTS.levers });
    }
  }

  function place(m, s) {
    if (state.roundOver || A.modalOpen() || state.pivotPick) return;
    const p = state.turn;
    const k = state.hands[p].indexOf(m);
    if (k < 0 || s === state.pivot || s < -SLOTS || s > SLOTS || stackAt(state.beam, s) >= MAX_STACK) return;
    state.hands[p].splice(k, 1);
    state.beam.push({ m, s, owner: p });
    state.net = torqueOf(state.beam, state.pivot);
    state.moves++;
    if (Math.abs(state.net) <= state.limit) state.closest = Math.min(state.closest, state.limit - Math.abs(state.net));
    state.selected[p] = state.hands[p].includes(m) ? m : state.hands[p][0] || null;
    if (Math.abs(state.net) > state.limit) { tip(p, nameOf(p) + ' put ' + m + 'kg ' + Math.abs(s - state.pivot) + ' from the pivot: turning force ' + Math.abs(m * (s - state.pivot)) + '. Over the limit!'); return; }
    state.targetAngle = leanAngle();
    nextTurn();
  }

  function nextTurn() {
    if (!state.hands[0].length && !state.hands[1].length) { endDraw(); return; }
    state.turn = 1 - state.turn;
    if (!state.hands[state.turn].length) state.turn = 1 - state.turn;
    renderHud();
    afterTurnChange();
  }

  function tip(loser, why) {
    state.roundOver = true;
    state.tipped = Math.sign(state.net);
    state.targetAngle = state.tipped * 0.5;
    // weights slide off the low end
    for (const w of state.beam) {
      const b = blockSize(w.m);
      state.falling.push({ x: slotX(w.s), y: BEAM_Y - 20, vx: state.tipped * (2 + Math.random() * 3), vy: -2 - Math.random() * 3, rot: 0, vr: (Math.random() - 0.5) * 0.2, w: b.w, h: b.h, m: w.m, col: w.owner < 0 ? '#8b93a8' : COLORS[w.owner], rest: 0 });
    }
    state.beam = [];
    const winner = 1 - loser;
    state.wins[winner]++;
    const chips = [];
    if (state.closest <= 1) { chips.push('Knife edge'); badges.award('Knife edge'); }
    if (state.limitHacked) { chips.push('Hacked limit'); badges.award('Balance hacker'); }
    showBanner(nameOf(winner) + ' wins', COLORS[winner], why, chips);
  }

  function endDraw() {
    state.roundOver = true;
    state.draws++;
    badges.award('Perfect balance');
    showBanner('Balanced!', '#7ee0a1', 'Every weight placed and the beam stayed up. Nobody tipped it, so it’s a draw.', []);
  }

  function showBanner(title, color, text, chips) {
    $('banner-title').textContent = title; $('banner-title').style.color = color;
    $('banner-text').textContent = text;
    const bc = $('banner-chips'); bc.innerHTML = '';
    chips.forEach((c) => { const sp = document.createElement('span'); sp.className = 'chip gold'; sp.textContent = c; bc.appendChild(sp); });
    $('banner').hidden = false;
    $('next-btn').focus({ preventScroll: true });
    renderHud();
    if (A.demo.active) scheduleDemoRound();
  }

  // ---------- questions ----------
  function askPivotTrick() {
    const p = state.turn;
    if (state.tricked[p] || state.trickLocked[p] || state.roundOver) return;
    A.quiz.open({
      game: 'balance-duel', player: nameOf(p), color: COLORS[p], count: 1, topics: TOPICS,
      title: nameOf(p) + ': pivot trick',
      intro: 'Answer right to slide the pivot one step left or right. Every weight’s distance changes, so be careful: it can tip the beam! Miss, and the trick locks for this round.',
      singleLabel: (right) => (right ? 'Choose a direction' : 'Back to the game'),
      onClose: (n) => { if (n) { state.tricked[p] = true; state.pivotPick = true; } else state.trickLocked[p] = true; renderHud(); }
    });
  }
  function movePivot(dir) {
    if (!state.pivotPick) return;
    const np = state.pivot + dir;
    if (np < -PIVOT_RANGE || np > PIVOT_RANGE) return;
    if (state.beam.some((w) => w.s === np)) { toast('A weight is sitting there. Pick the other way.'); return; }
    state.pivotPick = false;
    state.pivot = np;
    state.net = torqueOf(state.beam, state.pivot);
    if (Math.abs(state.net) > state.limit) { tip(state.turn, nameOf(state.turn) + ' moved the pivot and the turning forces no longer balanced. Tipped!'); return; }
    state.targetAngle = leanAngle();
    toast('Pivot moved. Turning force difference is now ' + Math.abs(state.net) + '.');
    renderHud();
  }
  function askRescue() {
    const p = state.turn;
    if (state.rescued[p] || state.roundOver || safeMoves(state, p).length) return;
    A.quiz.open({
      game: 'balance-duel', player: nameOf(p), color: COLORS[p], count: 4, topics: TOPICS,
      title: nameOf(p) + ' has no safe move',
      intro: 'Answer 4 science questions. Each right answer takes the weight doing the most damage off the beam.',
      lastLabel: 'See your rescue',
      resultScore: (n) => '−' + n,
      resultText: (n) => (n === 0 ? 'No weights removed.' : n + (n === 1 ? ' weight' : ' weights') + ' lifted off the beam.'),
      doneLabel: () => 'Back to the beam',
      onClose: (n) => {
        state.rescued[p] = true;
        for (let i = 0; i < n && state.beam.length; i++) {
          // remove the weight whose turning force points the way the beam leans, biggest first
          const lean = Math.sign(state.net) || 1;
          let best = -1, bt = 0;
          state.beam.forEach((w, k) => { const t = w.m * (w.s - state.pivot) * lean; if (t > bt) { bt = t; best = k; } });
          if (best < 0) break;
          state.beam.splice(best, 1);
          state.net = torqueOf(state.beam, state.pivot);
        }
        if (n === 4) badges.award('Science ace');
        state.targetAngle = leanAngle();
        renderHud();
      }
    });
  }

  // ---------- CPU ----------
  // Picks a safe move that leaves the other player the fewest safe moves, with a little randomness.
  function cpuChoose(p) {
    const safe = safeMoves(state, p);
    if (!safe.length) return legalMoves(state, p)[0] || null;
    if (Math.random() < 0.15) return safe[Math.floor(Math.random() * safe.length)];
    let best = [], bestScore = Infinity;
    for (const mv of safe) {
      const k = state.hands[p].indexOf(mv.m);
      const hands = state.hands.map((h) => h.slice()); hands[p].splice(k, 1);
      const sim = { beam: state.beam.concat([{ m: mv.m, s: mv.s }]), pivot: state.pivot, net: mv.net, limit: state.limit, hands };
      const opp = hands[1 - p].length ? safeMoves(sim, 1 - p).length : 99;
      const score = opp * 10 - Math.abs(mv.net) * 0.1 + Math.random();
      if (score < bestScore) { bestScore = score; best = [mv]; }
    }
    return best[0];
  }
  let cpuTimer = null;
  function afterTurnChange() {
    clearTimeout(cpuTimer);
    if (state.roundOver) return;
    const p = state.turn;
    const cpuPlays = A.demo.active || (state.cpu && p === 1);
    if (!cpuPlays) return;
    state.cpuBusy = true;
    renderHud();
    cpuTimer = setTimeout(() => {
      if (A.modalOpen()) { afterTurnChange(); return; }
      const mv = cpuChoose(p);
      state.cpuBusy = false;
      if (!mv) { nextTurn(); return; }
      state.selected[p] = mv.m;
      state.hoverSlot = mv.s;
      renderHud();
      cpuTimer = setTimeout(() => place(mv.m, mv.s), A.demo.active ? 500 : 650);
    }, A.demo.active ? 700 : 900);
  }

  // ---------- demo ----------
  let demoTimer = null;
  function startDemo() {
    A.demo.start({ stage, text: 'Demo match · click anywhere or press any key to play', onExit: () => { stopDemo(); setCode(cleanCode(location.hash.slice(1)) || dailyCode()); } });
    $('name-0').dataset.real = $('name-0').value; $('name-0').value = 'CPU Orange';
    $('name-1').dataset.real = $('name-1').value; $('name-1').value = 'CPU Blue';
    state.code = 'DEMO-' + randomCode();
    state.round = 1;
    loadRound();
  }
  function stopDemo() {
    A.demo.stop();
    clearTimeout(demoTimer); clearTimeout(cpuTimer);
    state.cpuBusy = false;
    ['name-0', 'name-1'].forEach((id) => { const n = $(id); if (n.dataset.real !== undefined) { n.value = n.dataset.real; delete n.dataset.real; } });
    A.quiz.close();
    badges.clear();
  }
  function scheduleDemoRound() {
    clearTimeout(demoTimer);
    demoTimer = setTimeout(() => {
      if (!A.demo.active) return;
      if (A.modalOpen()) { scheduleDemoRound(); return; }
      state.round++; loadRound();
    }, 2600);
  }

  // ---------- input ----------
  const slotAt = (e) => {
    const p = A.toLogical(cv, e, W, H);
    const s = Math.round((p.x - W / 2) / SPACING);
    return s < -SLOTS || s > SLOTS || p.y < BEAM_Y - 180 || p.y > BEAM_Y + 60 ? null : s;
  };
  cv.addEventListener('pointermove', (e) => { const s = slotAt(e); if (s !== state.hoverSlot) { state.hoverSlot = s; wake(); } });
  cv.addEventListener('pointerleave', () => { state.hoverSlot = null; wake(); });
  cv.addEventListener('pointerdown', (e) => {
    if (!humanTurn()) return;
    const s = slotAt(e), m = state.selected[state.turn];
    if (s !== null && m !== null) place(m, s);
  });
  window.addEventListener('keydown', (e) => {
    if (A.modalOpen()) return;
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'SELECT') return;
    if (state.roundOver && (e.key === 'Enter' || e.key === ' ')) { if (tag !== 'BUTTON') { state.round++; loadRound(); e.preventDefault(); } return; }
    if (!humanTurn()) return;
    const p = state.turn, hand = [...new Set(state.hands[p])];
    if (/^[1-9]$/.test(e.key) && hand.includes(+e.key)) { state.selected[p] = +e.key; renderHud(); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      state.hoverSlot = A.clamp((state.hoverSlot === null ? 0 : state.hoverSlot) + (e.key === 'ArrowLeft' ? -1 : 1), -SLOTS, SLOTS); wake(); e.preventDefault();
    } else if ((e.key === ' ' || e.key === 'Enter') && state.hoverSlot !== null && tag !== 'BUTTON') { place(state.selected[p], state.hoverSlot); e.preventDefault(); }
  });
  $('next-btn').addEventListener('click', () => { state.round++; loadRound(); });
  $('pivot-btn').addEventListener('click', askPivotTrick);
  $('pivot-left').addEventListener('click', () => movePivot(-1));
  $('pivot-right').addEventListener('click', () => movePivot(1));
  $('rescue-btn').addEventListener('click', askRescue);
  $('p2-select').addEventListener('change', (e) => { state.cpu = e.target.value === 'cpu'; renderHud(); afterTurnChange(); });
  $('load-btn').addEventListener('click', () => setCode($('seed-input').value));
  $('seed-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') setCode($('seed-input').value); });
  $('new-btn').addEventListener('click', () => setCode(randomCode()));
  $('daily-btn').addEventListener('click', () => { setCode(dailyCode()); toast('Daily duel for ' + A.todayKey()); });
  $('practice-btn').addEventListener('click', () => { if ((A.demo.active || state.roundOver) && !A.modalOpen()) A.quiz.practice({ game: 'balance-duel', topics: TOPICS }); });
  ['name-0', 'name-1'].forEach((id) => $(id).addEventListener('input', renderHud));
  const badges = A.makeBadges($('badges'));

  // ---------- boot ----------
  resize();
  state.cpu = $('p2-select').value === 'cpu';
  $('seed-input').value = cleanCode(location.hash.slice(1)) || dailyCode();
  startDemo();
  A.hacker('Balance Duel', game, {
    pivot: 'where the pivot is (slot number)',
    limit: 'how far the beam can lean before it tips (try changing it!)',
    net: 'turning force difference right now (+ leans right, − leans left)',
    beam: 'every weight: mass, slot, distance from pivot, turning force',
    hands: 'weights each player has left',
    code: 'the duel code',
    answers: 'every quiz answer so far'
  }, ['game.beam', 'game.limit = 100   (the game notices)']);
})();
