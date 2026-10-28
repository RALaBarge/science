// Short Circuit: rotate wire tiles to connect the battery to every bulb before time runs out.
// Science: complete circuits, conductors vs insulators, switches, series dimming, short circuits.
// The game really solves the circuit (Kirchhoff's laws), so brightness and shorts behave like real ones.
(function () {
  'use strict';
  const A = window.Arcade;
  const { $, rngFor, randomCode, cleanCode, runSliced, toast } = A;
  const dailyCode = () => A.dailyCode('circuit');

  // ---------- board ----------
  const COLS = 10, ROWS = 7, CELL = 80, W = COLS * CELL, H = ROWS * CELL, N = COLS * ROWS;
  const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]]; // sides: 0 right, 1 down, 2 left, 3 up (bit i = 1 << i)
  const SHAPE = { I: 0b0101, L: 0b0011, T: 0b0111, X: 0b1111 };
  const rotMask = (m, r) => { for (let i = 0; i < r; i++) m = ((m << 1) | (m >> 3)) & 15; return m; };
  const period = (shape) => (shape === 'X' ? 1 : shape === 'I' ? 2 : 4);
  const LIT = 0.3;  // a bulb needs at least this much current (one bulb alone gets 1.0)
  function step(c, d) {
    const x = (c % COLS) + DIRS[d][0], y = ((c / COLS) | 0) + DIRS[d][1];
    return x < 0 || y < 0 || x >= COLS || y >= ROWS ? -1 : y * COLS + x;
  }
  const maskOf = (t) => (t.kind === 'empty' ? 0 : rotMask(SHAPE[t.shape], t.rot));

  // ---------- circuit solving ----------
  // 1. Every conducting piece becomes one or two "points": a copper wire is one point; a bulb has one
  //    point at each end; an open switch has two unconnected points; the battery has + and −.
  // 2. Touching pieces join their points (union-find). Joined points are one electrical node.
  // 3. If + and − are the same node, it's a short circuit. Otherwise each bulb is a 1-ohm resistor
  //    between two nodes, the battery holds + at 1 volt and − at 0, and Kirchhoff's current law
  //    gives every node's voltage. A bulb's current is the voltage difference across it.
  function solveCircuit(tiles) {
    const parent = [];
    const point = () => { parent.push(parent.length); return parent.length - 1; };
    const find = (a) => { while (parent[a] !== a) { parent[a] = parent[parent[a]]; a = parent[a]; } return a; };
    const union = (a, b) => { a = find(a); b = find(b); if (a !== b) parent[a] = b; };
    const sidePoint = new Int32Array(N * 4).fill(-1);
    let P = -1, M = -1;
    const bulbs = [];
    for (let c = 0; c < N; c++) {
      const t = tiles[c];
      if (t.kind === 'empty' || (t.kind === 'wire' && t.plastic)) continue;
      const m = maskOf(t), sides = [0, 1, 2, 3].filter((s) => m & (1 << s));
      if (t.kind === 'wire' || (t.kind === 'switch' && t.closed)) { const p = point(); sides.forEach((s) => (sidePoint[c * 4 + s] = p)); }
      else if (t.kind === 'switch') { sides.forEach((s) => (sidePoint[c * 4 + s] = point())); }
      else if (t.kind === 'bulb') { const a = point(), b = point(); sidePoint[c * 4 + sides[0]] = a; sidePoint[c * 4 + sides[1]] = b; bulbs.push({ c, a, b }); }
      else if (t.kind === 'battery') { P = point(); M = point(); sidePoint[c * 4 + t.rot] = P; sidePoint[c * 4 + ((t.rot + 2) % 4)] = M; }
    }
    for (let c = 0; c < N; c++) {
      for (let s = 0; s < 4; s++) {
        const a = sidePoint[c * 4 + s];
        if (a < 0) continue;
        const n = step(c, s);
        if (n < 0) continue;
        const b = sidePoint[n * 4 + ((s + 2) % 4)];
        if (b >= 0) union(a, b);
      }
    }
    const current = new Map(); // bulb cell -> current
    bulbs.forEach((b) => current.set(b.c, 0));
    const res = { short: false, closed: false, current, live: new Set(), find, sidePoint, P, M };
    if (P < 0) return res;
    const rp = find(P), rm = find(M);
    if (rp === rm) { res.short = true; res.live.add(rp); return res; }
    // nodes joined by bulbs, starting from +
    const edges = bulbs.map((b) => ({ c: b.c, u: find(b.a), v: find(b.b) })).filter((e) => e.u !== e.v);
    const comp = new Set([rp]);
    let grew = true;
    while (grew) { grew = false; for (const e of edges) { if (comp.has(e.u) !== comp.has(e.v)) { comp.add(e.u); comp.add(e.v); grew = true; } } }
    if (!comp.has(rm)) return res;
    res.closed = true;
    const unknown = [...comp].filter((n) => n !== rp && n !== rm);
    const idx = new Map(unknown.map((n, i) => [n, i]));
    const k = unknown.length;
    const G = Array.from({ length: k }, () => new Float64Array(k + 1));
    const V = (n) => (n === rp ? 1 : n === rm ? 0 : null);
    for (const e of edges) {
      if (!comp.has(e.u)) continue;
      for (const [x, y] of [[e.u, e.v], [e.v, e.u]]) {
        if (!idx.has(x)) continue;
        const i = idx.get(x);
        G[i][i] += 1;
        if (idx.has(y)) G[i][idx.get(y)] -= 1; else G[i][k] += V(y);
      }
    }
    for (let col = 0; col < k; col++) { // Gaussian elimination
      let piv = col;
      for (let r = col + 1; r < k; r++) if (Math.abs(G[r][col]) > Math.abs(G[piv][col])) piv = r;
      const tmp = G[col]; G[col] = G[piv]; G[piv] = tmp;
      if (Math.abs(G[col][col]) < 1e-12) continue;
      for (let r = 0; r < k; r++) {
        if (r === col) continue;
        const f = G[r][col] / G[col][col];
        if (f) for (let j = col; j <= k; j++) G[r][j] -= f * G[col][j];
      }
    }
    const volt = new Map([[rp, 1], [rm, 0]]);
    unknown.forEach((n, i) => volt.set(n, Math.abs(G[i][i]) < 1e-12 ? 0 : G[i][k] / G[i][i]));
    for (const e of edges) {
      if (!comp.has(e.u)) continue;
      const I = Math.abs(volt.get(e.u) - volt.get(e.v));
      current.set(e.c, I);
      if (I > 1e-9) { res.live.add(e.u); res.live.add(e.v); }
    }
    return res;
  }
  const solvedBy = (r) => !r.short && r.current.size > 0 && [...r.current.values()].every((I) => I >= LIT);

  // ---------- level generation ----------
  // Pick a battery, then lay a random looping wire path from its + side back to its − side through a
  // waypoint (random-cost shortest paths make it wiggle). Bulbs and a switch go on straight stretches.
  // Decoy wires (some plastic) fill the rest. The solved layout is checked with the real circuit solver,
  // then every tile is spun to a random angle.
  function randomPath(rng, from, to, blocked) {
    const cost = new Float64Array(N);
    for (let i = 0; i < N; i++) cost[i] = 1 + rng() * 6;
    const dist = new Float64Array(N).fill(Infinity), prev = new Int32Array(N).fill(-1), done = new Uint8Array(N);
    dist[from] = 0;
    for (;;) {
      let u = -1;
      for (let i = 0; i < N; i++) if (!done[i] && dist[i] < Infinity && (u < 0 || dist[i] < dist[u])) u = i;
      if (u < 0) return null;
      if (u === to) break;
      done[u] = 1;
      for (let d = 0; d < 4; d++) {
        const v = step(u, d);
        if (v < 0 || done[v] || (blocked.has(v) && v !== to)) continue;
        if (dist[u] + cost[v] < dist[v]) { dist[v] = dist[u] + cost[v]; prev[v] = u; }
      }
    }
    const path = [];
    for (let v = to; v !== -1; v = prev[v]) path.unshift(v);
    return path;
  }
  const sideTo = (a, b) => { for (let d = 0; d < 4; d++) if (step(a, d) === b) return d; return -1; };

  function buildLevel(rng, level) {
    const tiles = Array.from({ length: N }, () => ({ kind: 'empty', shape: 'I', rot: 0, solRot: 0, plastic: false, closed: true, onPath: false }));
    const bx = 2 + Math.floor(rng() * (COLS - 4)), by = 1 + Math.floor(rng() * (ROWS - 2));
    const bat = by * COLS + bx, brot = Math.floor(rng() * 4);
    const pn = step(bat, brot), mn = step(bat, (brot + 2) % 4);
    if (pn < 0 || mn < 0) return null;
    tiles[bat] = { kind: 'battery', shape: 'I', rot: brot, solRot: brot, plastic: false, closed: true, onPath: true };
    let wp, tries = 0;
    do { wp = Math.floor(rng() * N); tries++; } while (tries < 50 && (wp === bat || A.dist((wp % COLS) - bx, ((wp / COLS) | 0) - by) < 3));
    const used = new Set([bat]);
    const p1 = randomPath(rng, pn, wp, used);
    if (!p1) return null;
    p1.forEach((c) => used.add(c));
    used.delete(wp);
    const p2 = randomPath(rng, wp, mn, new Set([...used]));
    if (!p2) return null;
    const loop = p1.concat(p2.slice(1));
    if (new Set(loop).size !== loop.length || loop.includes(bat)) return null;
    if (loop.length < 5 + level || loop.length > 8 + 2 * level) return null; // longer loops on later levels
    const straight = [];
    for (let i = 0; i < loop.length; i++) {
      const c = loop[i], prevC = i === 0 ? bat : loop[i - 1], nextC = i === loop.length - 1 ? bat : loop[i + 1];
      const want = (1 << sideTo(c, prevC)) | (1 << sideTo(c, nextC));
      let shape = 'I', rot = -1;
      for (const sh of ['I', 'L']) for (let r = 0; r < 4; r++) if (rot < 0 && rotMask(SHAPE[sh], r) === want) { shape = sh; rot = r; }
      tiles[c] = { kind: 'wire', shape, rot, solRot: rot, plastic: false, closed: true, onPath: true };
      if (shape === 'I') straight.push(c);
    }
    const order = A.shuffled(straight, rng);
    const nBulbs = Math.min(3, 1 + Math.floor((level - 1) / 3));
    if (order.length < nBulbs + (level >= 3 ? 1 : 0)) return null;
    for (let i = 0; i < nBulbs; i++) tiles[order[i]].kind = 'bulb';
    if (level >= 3) { const s = tiles[order[nBulbs]]; s.kind = 'switch'; s.closed = rng() < 0.3; }
    // decoys
    const pPlastic = level >= 2 ? 0.3 : 0;
    for (let c = 0; c < N; c++) {
      if (tiles[c].onPath) continue;
      if (rng() < 0.3) continue;
      const r = rng();
      const shape = r < 0.35 ? 'I' : r < 0.75 ? 'L' : r < 0.93 || level < 2 ? 'T' : 'X';
      const rot = Math.floor(rng() * 4);
      tiles[c] = { kind: 'wire', shape, rot, solRot: rot, plastic: rng() < pPlastic, closed: true, onPath: false };
    }
    // solved layout must really work with the decoys where they are
    for (const t of tiles) if (t.kind === 'switch') t.solClosed = true;
    const solvedTiles = tiles.map((t) => Object.assign({}, t, { closed: t.kind === 'switch' ? true : t.closed }));
    const check = solveCircuit(solvedTiles);
    if (!solvedBy(check)) return null;
    // scramble the path (decoys keep their angle; spinning them changes nothing the player needs)
    let par = 0;
    for (const c of loop) {
      const t = tiles[c];
      if (t.kind === 'switch') { if (!t.closed) par++; continue; }
      t.rot = Math.floor(rng() * 4);
      const p = period(t.shape);
      par += (((t.solRot - t.rot) % p) + p) % p;
    }
    if (par < 3 || solvedBy(solveCircuit(tiles))) return null;
    const timeLimit = 25 + par * 4 + nBulbs * 5;
    return { tiles, bat, loop, par, timeLimit, nBulbs };
  }

  function* genLevelGen(key, level) {
    for (let attempt = 0; attempt < 200; attempt++) {
      const lv = buildLevel(rngFor(key + '|' + attempt), level);
      yield;
      if (lv) return lv;
    }
    return null;
  }

  // ---------- state ----------
  const state = {
    code: '', level: 1, lv: null, circuit: null, clicks: 0,
    timeLeft: 0, lastTick: 0, bonusTime: 0, quizzed: false,
    hintUsed: false, hintLocked: false, solved: false, failed: false, wasShort: false,
    stars: 0, hover: -1, cursor: -1, sparks: [], hacked: false, seen: new Set()
  };
  if (/[?&]test\b/.test(location.search)) { window.__s = state; window.__sc = { solveCircuit, genLevel: (k, l) => A.runNow(genLevelGen(k, l)), solvedBy }; }

  const game = {
    get level() { return state.level; },
    get timeLeft() { return Math.ceil(state.timeLeft); },
    set timeLeft(v) { state.timeLeft = +v || 0; state.hacked = true; renderHud(); },
    get bulbs() { return state.circuit ? [...state.circuit.current.entries()].map(([c, I]) => ({ x: c % COLS, y: (c / COLS) | 0, current: Math.round(I * 100) / 100 })) : []; },
    get shortCircuit() { return !!(state.circuit && state.circuit.short); },
    get code() { return state.code; },
    get answers() { return A.answers; }
  };

  // ---------- drawing ----------
  const cv = $('cv'), ctx = cv.getContext('2d');
  const stage = $('stage');
  let fit = { k: 1 };
  const loop = A.loop(frame, () => state.sparks.length > 0);
  const wake = loop.wake;
  function resize() { fit = A.fitCanvas(cv, W, H); wake(); }
  window.addEventListener('resize', resize);

  function frame() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#0d1a1c'; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.setTransform(fit.k, 0, 0, fit.k, 0, 0);
    // breadboard dots
    ctx.fillStyle = 'rgba(140,200,190,0.12)';
    for (let x = 0; x < COLS; x++) for (let y = 0; y < ROWS; y++) ctx.fillRect(x * CELL + 38, y * CELL + 38, 4, 4);
    const lv = state.lv;
    if (!lv) return;
    for (const [c, col] of [[state.hover, 'rgba(255,209,102,0.12)'], [state.cursor, 'rgba(255,209,102,0.28)']]) {
      if (c < 0) continue;
      ctx.fillStyle = col; ctx.fillRect((c % COLS) * CELL + 2, ((c / COLS) | 0) * CELL + 2, CELL - 4, CELL - 4);
    }
    const r = state.circuit;
    for (let c = 0; c < N; c++) drawTile(c, lv.tiles[c], r);
    for (const s of state.sparks) { ctx.globalAlpha = Math.max(0, s.life / 30); ctx.fillStyle = s.col; ctx.fillRect(s.x - 2, s.y - 2, 4, 4); s.x += s.vx; s.y += s.vy; s.vy += 0.15; s.life--; }
    ctx.globalAlpha = 1;
    state.sparks = state.sparks.filter((s) => s.life > 0);
  }

  function liveSide(c, s, r) {
    if (!r) return 0;
    const p = r.sidePoint[c * 4 + s];
    if (p < 0) return 0;
    const root = r.find(p);
    return r.live.has(root) ? (r.short ? 2 : 1) : 0;
  }

  function drawTile(c, t, r) {
    if (t.kind === 'empty') return;
    const x = (c % COLS) * CELL, y = ((c / COLS) | 0) * CELL, mx = x + CELL / 2, my = y + CELL / 2;
    const m = maskOf(t);
    ctx.save();
    ctx.lineCap = 'round';
    // wire arms from the center to each connected side
    for (let s = 0; s < 4; s++) {
      if (!(m & (1 << s))) continue;
      const ex = mx + DIRS[s][0] * CELL / 2, ey = my + DIRS[s][1] * CELL / 2;
      const live = liveSide(c, s, r);
      if (live) { ctx.strokeStyle = live === 2 ? 'rgba(255,80,80,0.45)' : 'rgba(255,196,80,0.5)'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(ex, ey); ctx.stroke(); }
      ctx.strokeStyle = t.plastic ? '#7d8796' : '#d9893f';
      ctx.lineWidth = t.plastic ? 12 : 8;
      ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(ex, ey); ctx.stroke();
      if (t.plastic) { ctx.strokeStyle = '#a7b0bd'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(ex, ey); ctx.stroke(); }
    }
    if (t.kind === 'wire' && !t.plastic) { ctx.fillStyle = '#d9893f'; ctx.beginPath(); ctx.arc(mx, my, 6, 0, Math.PI * 2); ctx.fill(); }
    if (t.kind === 'bulb') {
      const I = r ? r.current.get(c) || 0 : 0, on = I >= LIT;
      const glow = Math.min(1, I);
      if (I > 0.01) {
        const g = ctx.createRadialGradient(mx, my, 4, mx, my, 44);
        g.addColorStop(0, 'rgba(255,225,120,' + (0.9 * glow) + ')'); g.addColorStop(1, 'rgba(255,225,120,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(mx, my, 44, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = on ? 'rgb(255,' + Math.round(200 + 40 * glow) + ',120)' : I > 0.01 ? '#7a6a3a' : '#2a3442';
      ctx.strokeStyle = '#e7e9f3'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(mx, my, 17, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = on ? '#8a5a00' : '#9aa3b5'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(mx - 8, my + 4); ctx.lineTo(mx - 4, my - 5); ctx.lineTo(mx, my + 4); ctx.lineTo(mx + 4, my - 5); ctx.lineTo(mx + 8, my + 4); ctx.stroke();
      if (I > 0.01 && !on) { ctx.fillStyle = '#e7e9f3'; ctx.font = '600 11px "IBM Plex Mono", monospace'; ctx.textAlign = 'center'; ctx.fillText('too dim', mx, y + CELL - 4); }
    } else if (t.kind === 'switch') {
      const a = t.rot % 2 === 0; // horizontal
      ctx.fillStyle = '#1e2a3a'; ctx.strokeStyle = '#9aa3b5'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.rect(mx - 20, my - 20, 40, 40); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = t.closed ? '#7ee0a1' : '#ff6b81'; ctx.lineWidth = 5;
      ctx.beginPath();
      if (a) { ctx.moveTo(mx - 14, my); ctx.lineTo(t.closed ? mx + 14 : mx + 8, t.closed ? my : my - 14); }
      else { ctx.moveTo(mx, my - 14); ctx.lineTo(t.closed ? mx : mx + 14, t.closed ? my + 14 : my + 8); }
      ctx.stroke();
      ctx.fillStyle = '#e7e9f3'; ctx.font = '600 10px "IBM Plex Mono", monospace'; ctx.textAlign = 'center';
      ctx.fillText(t.closed ? 'ON' : 'OFF', mx, y + CELL - 6);
    } else if (t.kind === 'battery') {
      const horiz = t.rot % 2 === 0;
      ctx.fillStyle = '#2b3556'; ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.rect(mx - (horiz ? 26 : 18), my - (horiz ? 18 : 26), horiz ? 52 : 36, horiz ? 36 : 52); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffd166'; ctx.font = '700 20px "Saira Semi Condensed", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const [dx, dy] = DIRS[t.rot];
      ctx.fillText('+', mx + dx * 14, my + dy * 14);
      ctx.fillText('−', mx - dx * 14, my - dy * 14);
      if (r && r.short) { ctx.fillStyle = '#ff6b81'; ctx.font = '700 12px "IBM Plex Mono", monospace'; ctx.fillText('SHORT!', mx, y + 8); }
    }
    ctx.restore();
  }

  // ---------- HUD ----------
  const fmt = (s) => { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  function starsFor() {
    const par = state.lv.par;
    let s = state.clicks <= par + 2 ? 3 : state.clicks <= Math.round(par * 1.6) + 2 ? 2 : 1;
    if (state.hintUsed) s = Math.max(1, s - 1);
    return s;
  }
  function renderHud() {
    const lv = state.lv, r = state.circuit;
    $('level-num').textContent = state.level;
    $('level-meta').textContent = state.level;
    $('stars-total').textContent = state.stars;
    $('stage-label').textContent = (A.demo.active ? 'Demo' : state.code) + ' · level ' + state.level;
    if (lv) {
      const lit = r ? [...r.current.values()].filter((I) => I >= LIT).length : 0;
      $('stats').innerHTML =
        '<span>Bulbs lit <b>' + lit + ' of ' + lv.nBulbs + '</b></span>' +
        '<span>Time left <b id="clock">' + fmt(state.timeLeft) + '</b>' + (state.bonusTime ? ' (+' + state.bonusTime + 's bonus)' : '') + '</span>' +
        '<span>Clicks <b>' + state.clicks + '</b> · par <b>' + lv.par + '</b></span>' +
        '<span>Circuit <b>' + (r && r.short ? 'SHORT CIRCUIT' : r && r.closed ? 'complete' : 'open') + '</b></span>';
      $('time-bar').style.width = Math.max(0, Math.min(100, 100 * state.timeLeft / lv.timeLimit)) + '%';
    }
    const busy = !lv || state.solved || state.failed || A.modalOpen();
    $('turn-label').textContent = !lv ? 'Building a circuit…' : state.solved ? 'All bulbs lit!' : state.failed ? 'Out of time' : r && r.short ? 'Short circuit!' : 'Light every bulb';
    $('hint-btn').disabled = busy || state.hintUsed || state.hintLocked;
    $('hint-btn').textContent = state.hintLocked ? 'Hint locked until next level' : state.hintUsed ? 'Hint used' : 'Fix one tile (answer 1 question)';
    $('practice-btn').disabled = !(A.demo.active || state.solved || state.failed) || A.modalOpen();
    wake();
  }
  A.onModal(renderHud);

  // ---------- levels ----------
  let genToken = 0;
  function loadLevel() {
    const token = ++genToken;
    Object.assign(state, { lv: null, circuit: null, clicks: 0, bonusTime: 0, quizzed: false, hintUsed: false, hintLocked: false, solved: false, failed: false, wasShort: false, hacked: false, sparks: [] });
    $('banner').hidden = true;
    $('busy').hidden = false;
    renderHud();
    const key = state.code + '-L' + state.level;
    runSliced(genLevelGen(key, state.level), (lv) => {
      if (!lv) { setCode(randomCode()); return; }
      state.lv = lv;
      state.timeLeft = lv.timeLimit;
      state.circuit = solveCircuit(lv.tiles);
      $('busy').hidden = true;
      renderHud();
      introduce();
    }, () => token !== genToken);
  }
  // facts cards the first time a switch or a plastic decoy appears
  function introduce() {
    if (A.demo.active) return;
    const facts = (window.SCIENCE_FACTS && window.SCIENCE_FACTS.electricity) || [];
    const has = (f) => state.lv.tiles.some(f);
    if (!state.seen.has('start')) {
      state.seen.add('start');
      A.facts.show({ kicker: 'Short Circuit', title: 'Electricity needs a complete loop', sub: 'Click tiles to turn them. Connect + to − through every bulb. Orange copper conducts; gray plastic does not.', facts });
    } else if (!state.seen.has('switch') && has((t) => t.kind === 'switch')) {
      state.seen.add('switch');
      A.facts.show({ kicker: 'New: switches', title: 'A switch opens a gap', sub: 'Click a switch to turn it ON (closed) or OFF (open). An open switch breaks the loop.', facts });
    } else if (!state.seen.has('series') && state.lv.nBulbs > 1) {
      state.seen.add('series');
      A.facts.show({ kicker: 'New: more bulbs', title: 'Bulbs on one loop share the push', sub: 'Two bulbs in a row each get half the current, so they glow dimmer. Three is the most that still light up.', facts });
    }
  }

  function setCode(code, keepLevel) {
    if (A.demo.active) stopDemo();
    state.code = cleanCode(code) || randomCode();
    $('seed-input').value = state.code;
    try { history.replaceState(null, '', '#' + state.code); } catch (e) { /* ignore */ }
    if (!keepLevel) { state.level = 1; state.stars = 0; }
    loadLevel();
  }

  function sparksAt(c, col, n) {
    const x = (c % COLS) * CELL + CELL / 2, y = ((c / COLS) | 0) * CELL + CELL / 2;
    const count = A.reduceMotion ? Math.ceil(n / 4) : n;
    for (let i = 0; i < count; i++) state.sparks.push({ x, y, vx: (Math.random() - 0.5) * 6, vy: -Math.random() * 5, life: 20 + Math.random() * 15, col });
  }

  function reevaluate() {
    const r = (state.circuit = solveCircuit(state.lv.tiles));
    if (r.short && !state.wasShort && !A.demo.active) {
      state.timeLeft = Math.max(0, state.timeLeft - 5);
      toast('Short circuit! The current skipped every bulb. −5 seconds.');
      sparksAt(state.lv.bat, '#ffb35c', 30);
      if (!state.seen.has('short')) {
        state.seen.add('short');
        A.facts.show({ kicker: 'Short circuit', title: 'Electricity took a shortcut', sub: 'You connected + to − with only wire, so the current skipped the bulbs. In real wiring that makes wires dangerously hot.', facts: window.SCIENCE_FACTS.electricity });
      }
    }
    state.wasShort = r.short;
    if (solvedBy(r) && !state.solved) solved();
    renderHud();
  }

  function clickTile(c, ccw) {
    if (!state.lv || state.solved || state.failed || A.modalOpen() || c < 0) return;
    const t = state.lv.tiles[c];
    if (t.kind === 'empty' || t.kind === 'battery') return;
    if (t.kind === 'switch') t.closed = !t.closed;
    else t.rot = (t.rot + (ccw ? 3 : 1)) % 4;
    state.clicks++;
    reevaluate();
  }

  function solved() {
    state.solved = true;
    const s = starsFor();
    state.stars += s;
    for (const [c] of state.circuit.current) sparksAt(c, '#ffe178', 12);
    const chips = [];
    if (state.clicks <= state.lv.par) { chips.push('Perfect wiring'); badges.award('Perfect wiring'); }
    if (state.hacked) { chips.push('Hacked clock'); badges.award('Time hacker'); }
    if (state.lv.nBulbs > 1 && s === 3) badges.award('Series master');
    $('banner-title').textContent = '★'.repeat(s) + '☆'.repeat(3 - s);
    $('banner-text').textContent = 'Level ' + state.level + ': ' + state.clicks + ' clicks (par ' + state.lv.par + ') with ' + fmt(state.timeLeft) + ' to spare.' + (state.hintUsed ? ' A hint was used, so one star off.' : '');
    const bc = $('banner-chips'); bc.innerHTML = '';
    chips.forEach((t) => { const sp = document.createElement('span'); sp.className = 'chip gold'; sp.textContent = t; bc.appendChild(sp); });
    $('next-btn').textContent = 'Next level';
    $('retry-btn').hidden = true;
    $('banner').hidden = false;
    $('next-btn').focus({ preventScroll: true });
    if (A.demo.active) scheduleDemoLevel();
    wake();
  }

  function outOfTime() {
    if (state.solved || state.failed) return;
    if (!state.quizzed && !A.demo.active) {
      A.quiz.open({
        game: 'short-circuit', player: 'player', color: '#ffd166', count: 4, topics: TOPICS,
        title: 'Out of time',
        intro: 'Answer 4 science questions. Every right answer adds 10 seconds.',
        lastLabel: 'See your bonus',
        resultScore: (n) => '+' + n * 10 + 's',
        resultText: (n) => (n === 0 ? 'No extra time this time.' : n * 10 + ' more seconds.'),
        doneLabel: (n) => (n ? 'Keep wiring' : 'Continue'),
        onClose: (n) => {
          state.quizzed = true;
          if (n) { state.timeLeft += n * 10; state.bonusTime += n * 10; if (n === 4) badges.award('Science ace'); renderHud(); }
          else fail();
        }
      });
      return;
    }
    fail();
  }
  function fail() {
    state.failed = true;
    $('banner-title').textContent = 'Out of time';
    $('banner-text').textContent = 'The bulbs stayed dark. Try the same circuit again or skip to the next one.';
    $('banner-chips').innerHTML = '';
    $('next-btn').textContent = 'Skip';
    $('retry-btn').hidden = false;
    $('banner').hidden = false;
    $('retry-btn').focus({ preventScroll: true });
    if (A.demo.active) scheduleDemoLevel();
    renderHud();
  }

  // the clock: only the text and bar update, no redraw
  setInterval(() => {
    const now = performance.now(), dt = (now - (state.lastTick || now)) / 1000;
    state.lastTick = now;
    if (!state.lv || state.solved || state.failed || A.demo.active || A.modalOpen()) return;
    state.timeLeft -= dt;
    const el = $('clock'); if (el) el.textContent = fmt(state.timeLeft);
    $('time-bar').style.width = Math.max(0, Math.min(100, 100 * state.timeLeft / state.lv.timeLimit)) + '%';
    if (state.timeLeft <= 0) outOfTime();
  }, 250);

  // ---------- questions ----------
  const TOPICS = ['Electricity'];
  function askHint() {
    if (state.hintUsed || state.hintLocked || state.solved || state.failed) return;
    A.quiz.open({
      game: 'short-circuit', player: 'player', color: '#ffd166', count: 1, topics: TOPICS,
      title: 'Fix one tile',
      intro: 'Answer right and the game turns one wrong tile into place (costs one star). Miss, and hints lock until the next level.',
      singleLabel: (right) => (right ? 'Fix a tile' : 'Back to the circuit'),
      onClose: (n) => {
        if (!n) { state.hintLocked = true; renderHud(); return; }
        state.hintUsed = true;
        const c = wrongTiles()[0];
        if (c !== undefined) { const t = state.lv.tiles[c]; if (t.kind === 'switch') t.closed = true; else t.rot = t.solRot; sparksAt(c, '#ffd166', 10); }
        reevaluate();
      }
    });
  }
  function wrongTiles() {
    return state.lv.loop.filter((c) => {
      const t = state.lv.tiles[c];
      if (t.kind === 'switch') return !t.closed;
      return maskOf(t) !== rotMask(SHAPE[t.shape], t.solRot);
    });
  }

  // ---------- demo ----------
  let demoTimer = null;
  function startDemo() {
    A.demo.start({ stage, text: 'Demo · click anywhere or press any key to play', onExit: () => { stopDemo(); setCode(cleanCode(location.hash.slice(1)) || dailyCode()); } });
    state.code = 'DEMO-' + randomCode();
    state.level = 1 + Math.floor(Math.random() * 4);
    loadLevel();
    demoTick();
  }
  function stopDemo() { A.demo.stop(); clearTimeout(demoTimer); A.quiz.close(); badges.clear(); }
  function demoTick() {
    clearTimeout(demoTimer);
    if (!A.demo.active) return;
    if (!state.lv || state.solved || state.failed || A.modalOpen()) { demoTimer = setTimeout(demoTick, 300); return; }
    const c = wrongTiles()[0];
    if (c === undefined) return;
    state.hover = c;
    clickTile(c);
    demoTimer = setTimeout(demoTick, 380);
  }
  function scheduleDemoLevel() {
    clearTimeout(demoTimer);
    demoTimer = setTimeout(() => {
      if (!A.demo.active) return;
      if (A.modalOpen()) { scheduleDemoLevel(); return; }
      state.level = state.level >= 7 ? 1 : state.level + 1;
      loadLevel(); demoTick();
    }, 2400);
  }

  // ---------- input ----------
  const cellAt = (e) => { const p = A.toLogical(cv, e, W, H); const x = Math.floor(p.x / CELL), y = Math.floor(p.y / CELL); return x >= 0 && y >= 0 && x < COLS && y < ROWS ? y * COLS + x : -1; };
  cv.addEventListener('pointerdown', (e) => { state.cursor = -1; clickTile(cellAt(e), e.button === 2 || e.shiftKey); });
  cv.addEventListener('contextmenu', (e) => e.preventDefault());
  cv.addEventListener('pointermove', (e) => { const c = cellAt(e); if (c !== state.hover) { state.hover = c; wake(); } });
  cv.addEventListener('pointerleave', () => { state.hover = -1; wake(); });
  window.addEventListener('keydown', (e) => {
    if (A.modalOpen()) return;
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT') return;
    if ((state.solved || state.failed) && (e.key === 'Enter' || e.key === ' ')) { if (tag !== 'BUTTON') { nextLevel(); e.preventDefault(); } return; }
    const moves = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: COLS, ArrowUp: -COLS };
    if (moves[e.key] !== undefined) {
      if (state.cursor < 0) state.cursor = Math.floor(ROWS / 2) * COLS + Math.floor(COLS / 2);
      const n = state.cursor + moves[e.key];
      if (n >= 0 && n < N && !(Math.abs(moves[e.key]) === 1 && Math.floor(n / COLS) !== Math.floor(state.cursor / COLS))) state.cursor = n;
      wake(); e.preventDefault();
    } else if ((e.key === ' ' || e.key === 'Enter') && state.cursor >= 0 && tag !== 'BUTTON') { clickTile(state.cursor, e.shiftKey); e.preventDefault(); }
  });
  function nextLevel() { state.level++; loadLevel(); }
  $('next-btn').addEventListener('click', nextLevel);
  $('retry-btn').addEventListener('click', loadLevel);
  $('hint-btn').addEventListener('click', askHint);
  $('load-btn').addEventListener('click', () => setCode($('seed-input').value));
  $('seed-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') setCode($('seed-input').value); });
  $('new-btn').addEventListener('click', () => setCode(randomCode()));
  $('daily-btn').addEventListener('click', () => { setCode(dailyCode()); toast('Daily circuits for ' + A.todayKey()); });
  $('practice-btn').addEventListener('click', () => { if ((A.demo.active || state.solved || state.failed) && !A.modalOpen()) A.quiz.practice({ game: 'short-circuit', topics: TOPICS }); });
  const badges = A.makeBadges($('badges'));

  // ---------- boot ----------
  resize();
  $('seed-input').value = cleanCode(location.hash.slice(1)) || dailyCode();
  startDemo();
  A.hacker('Short Circuit', game, {
    level: 'which level you are on',
    timeLeft: 'seconds left (try changing it!)',
    bulbs: 'every bulb and the current through it (1 = full brightness)',
    shortCircuit: 'true when + and − are joined by bare wire',
    code: 'the circuit code',
    answers: 'every quiz answer so far'
  }, ['game.bulbs', 'game.timeLeft = 999   (the game notices)']);
})();
