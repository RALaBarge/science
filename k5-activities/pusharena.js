/* pusharena.js — Push Arena: change ONE thing, predict, release, watch the replay, read the data, build a claim.
   One config drives one activity; it holds one or more rounds.
   Round: {question, change, held:[strings], predictAfter?, predict:{q, choices:[{id,label,value?}]},
           options:[{id,icon,label,hint,answer,result}], reads:[{q,choices:[{label,ok,why}]}], finding, alt?}
   `answer` names a predict choice id. `result` is a table, not a simulation; numbers come from the unit's own data:
     travel:  {kind:"travel", value, unit, max, dir?}  car moves value units (dir -1 = toward you, 1 = away, unset = from the line)
     tries:   {kind:"tries", outcomes:["stop"|"past",...]}  one run per try against a stopper at the line
     dots:    {kind:"dots", positions:[...], unit, max}  even-gap dot pattern; child predicts the next dot (needs predictAfter)
     balance: {kind:"balance", arrows:{left,right}, move}  two pushes on a box: `left` is a push toward the left, `right` a push toward the right; move: -1 left, 0 stays, 1 right
     pull:    {kind:"pull", moves}  magnet at one end; moves true = pulled without touching
   `alt` is an optional second scenario merged over the round on every other play (Play again).
   Pure helpers (k5PushArenaValidate, k5PushArenaDots, k5PushArenaMove) are separate from the DOM code so tests can run them in Node. */

/* Next dot in an even-gap pattern. */
function k5PushArenaDots(ps) { return ps[ps.length - 1] + (ps[ps.length - 1] - ps[ps.length - 2]); }
/* Which way a box moves: -1 left, 0 balanced, 1 right. */
function k5PushArenaMove(l, r) { return l === r ? 0 : (r > l ? 1 : -1); }

function k5PushArenaValidate(cfg) {
  const errs = [];
  if (!cfg || !cfg.id) errs.push('config needs an id');
  if (!cfg.title || !cfg.intro || !cfg.summary) errs.push('config needs title, intro and summary');
  if (!cfg.note) errs.push('config needs a note');
  if (!Array.isArray(cfg.rounds) || !cfg.rounds.length) { errs.push('config needs rounds'); return errs; }
  const readsCheck = (cs, tag) => {
    if (!Array.isArray(cs) || cs.length < 2) { errs.push(tag + ': needs at least 2 choices'); return; }
    if (cs.filter((c) => c.ok).length !== 1) errs.push(tag + ': needs exactly one correct choice');
    cs.forEach((c) => { if (!c.label || !c.why) errs.push(tag + ': every choice needs label and why'); });
  };
  const roundCheck = (r, tag) => {
    if (!r.question || !r.change) errs.push(tag + ': needs question and change');
    if (!Array.isArray(r.held) || !r.held.length) errs.push(tag + ': needs a held list');
    const p = r.predict || {};
    const pids = new Set();
    if (!p.q || !Array.isArray(p.choices) || p.choices.length < 2) errs.push(tag + ': predict needs q and 2+ choices');
    (p.choices || []).forEach((c) => {
      if (!c.id || !c.label) errs.push(tag + ': predict choice needs id and label');
      if (pids.has(c.id)) errs.push(tag + ': duplicate predict choice id ' + c.id);
      pids.add(c.id);
    });
    const os = r.options || [];
    if (!os.length) errs.push(tag + ': needs at least 1 option');
    const seen = new Set();
    os.forEach((o) => {
      if (seen.has(o.id)) errs.push(tag + ': duplicate option id ' + o.id);
      seen.add(o.id);
      if (!o.label || !o.hint) errs.push(tag + ': option ' + o.id + ' needs label and hint');
      if (!pids.has(o.answer)) errs.push(tag + ': option ' + o.id + ' answer names unknown choice ' + o.answer);
      const res = o.result || {};
      if (res.kind === 'travel') {
        if (typeof res.value !== 'number' || res.value < 0 || typeof res.max !== 'number' || res.max <= 0 || !res.unit) errs.push(tag + ': option ' + o.id + ' travel needs value, max and unit');
        else if (res.value > res.max) errs.push(tag + ': option ' + o.id + ' value is above max');
        if (res.dir !== undefined && res.dir !== 1 && res.dir !== -1) errs.push(tag + ': option ' + o.id + ' dir must be 1 or -1');
      } else if (res.kind === 'tries') {
        if (!Array.isArray(res.outcomes) || res.outcomes.length < 2 || !res.outcomes.every((x) => x === 'stop' || x === 'past')) errs.push(tag + ': option ' + o.id + ' tries needs 2+ stop/past outcomes');
      } else if (res.kind === 'dots') {
        const ps = res.positions || [];
        const okSeq = ps.length >= 3 && ps.every((v) => typeof v === 'number') && (ps[1] - ps[0]) > 0 &&
          ps.every((v, i) => i < 2 || Math.abs(v - ps[i - 1] - (ps[1] - ps[0])) < 1e-9);
        if (!okSeq || !res.unit) errs.push(tag + ': option ' + o.id + ' dots needs 3+ rising even-gap positions and a unit');
        else {
          const next = k5PushArenaDots(ps);
          const hit = (p.choices || []).filter((c) => c.value === next);
          if (hit.length !== 1) errs.push(tag + ': dots predict needs exactly one choice with value ' + next);
          else if (o.answer !== hit[0].id) errs.push(tag + ': option ' + o.id + ' answer key is wrong, the next dot is ' + next);
        }
      } else if (res.kind === 'balance') {
        const a = res.arrows || {};
        if (typeof a.left !== 'number' || typeof a.right !== 'number' || a.left < 1 || a.right < 1) errs.push(tag + ': option ' + o.id + ' balance needs arrows left and right 1+');
        else if (res.move !== k5PushArenaMove(a.left, a.right)) errs.push(tag + ': option ' + o.id + ' move key is wrong for arrows ' + a.left + ' against ' + a.right);
      } else if (res.kind === 'pull') {
        if (typeof res.moves !== 'boolean') errs.push(tag + ': option ' + o.id + ' pull needs moves true or false');
      } else errs.push(tag + ': option ' + o.id + ' has an unknown result kind');
    });
    if (os.some((o) => o.result && o.result.kind === 'dots') && !r.predictAfter) errs.push(tag + ': dots rounds need predictAfter');
    if (r.predictAfter && !os.some((o) => o.result && o.result.kind === 'dots')) errs.push(tag + ': predictAfter is only for dots rounds');
    if ((r.reads || []).length < 1) errs.push(tag + ': needs at least one read question');
    (r.reads || []).forEach((x, j) => readsCheck(x.choices, tag + ' read ' + (j + 1)));
    if (!r.finding) errs.push(tag + ': needs a finding');
  };
  cfg.rounds.forEach((r, i) => {
    roundCheck(r, 'round ' + (i + 1));
    if (r.alt) roundCheck(Object.assign({}, r, r.alt), 'round ' + (i + 1) + ' alt');
  });
  if ((cfg.claim || []).length < 3) errs.push('claim needs 3 parts');
  (cfg.claim || []).forEach((x, j) => readsCheck(x.choices, 'claim ' + (j + 1)));
  return errs;
}

function k5PushArena(host, cfg) {
  if (!host || host.shadowRoot) return;
  const root = host.attachShadow({ mode: 'open' });
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  root.innerHTML = '<style>' +
    ':host{display:block}' +
    '.box{background:var(--surface);border:1.5px solid var(--line);border-radius:14px;padding:16px;color:var(--ink);font-family:var(--font-body,system-ui,sans-serif)}' +
    '.top{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;justify-content:space-between;margin-bottom:6px}' +
    '.top b{font-size:1.05rem}.prog{color:var(--muted);font-size:.9rem}' +
    '.q{margin:4px 0 8px;font-size:1.05rem;font-weight:700}' +
    '.held{margin:6px 0 8px;padding:8px 12px;border-radius:10px;background:var(--surface-2);font-size:.92rem}' +
    '.track{position:relative;height:74px;margin:16px 0 28px;border-bottom:3px solid var(--line)}' +
    '.obj{position:absolute;bottom:6px;transform:translateX(-50%);font-size:1.7rem;line-height:1;transition:left .8s ease-in-out}' +
    '.tick{position:absolute;bottom:-20px;transform:translateX(-50%);font-size:.72rem;color:var(--muted)}' +
    '.tick.mark{color:var(--ink);font-weight:700}' +
    '.dot{position:absolute;bottom:4px;width:9px;height:9px;border-radius:50%;background:var(--beam);transform:translateX(-50%)}' +
    '.dot.new{background:var(--green)}' +
    '.stopline{position:absolute;bottom:0;height:100%;border-left:3px dashed var(--red)}' +
    '.stopper{position:absolute;bottom:6px;transform:translateX(-50%);font-size:1.5rem}' +
    '.farrow{position:absolute;bottom:10px;color:var(--beam);font-weight:700;line-height:1}' +
    '.farrow.l{right:53%;transform:scaleX(-1)}.farrow.r{left:53%}' +
    '.row{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0}' +
    '.step{margin:10px 0 6px;font-weight:700}' +
    '.opt{font:inherit;color:inherit;display:flex;align-items:center;gap:8px;padding:8px 12px;min-height:44px;border-radius:10px;border:1.5px solid var(--line);background:var(--surface);cursor:pointer;text-align:left}' +
    '.opt:hover{border-color:var(--beam)}.opt .ic{font-size:1.4rem;line-height:1}' +
    '.opt[disabled]{opacity:.65;cursor:default}.opt.right{border-color:var(--green)}.opt[aria-pressed="true"]{outline:3px solid var(--beam);outline-offset:1px}' +
    '.data{margin:6px 0}' +
    '.row2{display:flex;align-items:center;gap:8px;margin:4px 0;padding:5px 10px;border-radius:8px;background:var(--surface-2);font-size:.95rem}' +
    '.rl{flex:1}.bar{height:14px;min-width:4px;border-radius:4px;background:var(--beam)}.val{font-weight:700}' +
    '.chips{display:flex;flex-wrap:wrap;gap:4px}' +
    '.chip{padding:1px 8px;border-radius:999px;border:1.5px solid var(--line);font-size:.85rem;font-weight:700}' +
    '.chip.g{border-color:var(--green)}.chip.x{border-color:var(--red)}' +
    '.finding{margin:8px 0;padding:8px 12px;border-left:5px solid var(--green);background:var(--surface-2);border-radius:8px;font-size:.95rem}' +
    '.msg{margin-top:12px;min-height:2.6em;padding:8px 12px;border-radius:10px;background:var(--surface-2);font-size:1rem}' +
    '.msg.ok{border-left:5px solid var(--green)}.msg.bad{border-left:5px solid var(--red)}' +
    '.btn{font:inherit;font-weight:700;padding:9px 16px;min-height:44px;border-radius:10px;border:0;background:var(--beam);color:var(--beam-ink);cursor:pointer;margin:10px 10px 0 0}' +
    '.done{margin-top:12px;padding:12px;border-radius:10px;border:1.5px solid var(--green)}' +
    '.done p{margin:6px 0}.claimline{font-weight:700}' +
    '.note{color:var(--muted);font-size:.88rem;margin-top:10px}' +
    '@media (prefers-reduced-motion:reduce){.obj{transition:none!important}}' +
    '</style><div class="box"><div class="top"><b></b><span class="prog" aria-live="polite"></span></div>' +
    '<p class="q"></p><div class="held"></div><div class="track" aria-hidden="true"></div>' +
    '<div class="data"></div><div class="main"></div>' +
    '<div class="msg" role="status" aria-live="polite"></div><div class="end"></div><p class="note"></p></div>';
  const q = (s) => root.querySelector(s);
  q('.top b').textContent = cfg.title;
  q('.note').textContent = cfg.note || '';
  const main = q('.main');
  const say = (kind, text) => { const m = q('.msg'); m.className = 'msg ' + kind; m.textContent = text; };
  const btn = (cls, html, fn) => { const b = document.createElement('button'); b.type = 'button'; b.className = cls; b.innerHTML = html; b.addEventListener('click', fn); return b; };
  const shuffle = (a, seed) => {
    let h = 2166136261;
    for (const ch of String(seed)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
    const rnd = () => { h = (h + 0x6D2B79F5) | 0; let t = Math.imul(h ^ (h >>> 15), 1 | h); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };

  let ri = 0, replay = 0, slips = 0, done = {}, busy = false;
  const found = [];

  const effRound = () => { const r = cfg.rounds[ri]; return (replay % 2 === 1 && r.alt) ? Object.assign({}, r, r.alt) : r; };
  const clearStage = () => main.querySelectorAll('.stage2,.rel').forEach((x) => x.remove());
  const trackBase = () => { const t = q('.track'); t.innerHTML = ''; return t; };
  function place(el, pct, ms, cb) {
    if (reduce || !ms) { el.style.transition = 'none'; el.style.left = pct + '%'; if (cb) cb(); return; }
    el.style.transition = 'left ' + ms + 'ms ease-in-out';
    el.style.left = pct + '%';
    setTimeout(cb || function () {}, ms + 40);
  }
  function dataRow(icon, label, val, barPct) {
    const d = document.createElement('div'); d.className = 'row2';
    d.innerHTML = '<span class="rl">' + esc((icon ? icon + ' ' : '') + label) + '</span><span class="bar" style="width:' + Math.round(Math.max(0, Math.min(100, barPct)) * 0.9) + 'px"></span><span class="val">' + esc(val) + '</span>';
    q('.data').appendChild(d);
  }

  function round() {
    const r = effRound();
    done = {}; busy = false;
    q('.prog').textContent = 'Test ' + (ri + 1) + ' of ' + cfg.rounds.length;
    q('.q').textContent = r.question;
    q('.held').innerHTML = '<b>One thing changes: ' + esc(r.change) + '.</b> Held the same: ' + r.held.map(esc).join(' · ');
    trackBase(); q('.data').innerHTML = ''; q('.end').innerHTML = ''; main.innerHTML = '';
    say('', 'Tap a test card, predict, then release. A wrong prediction costs nothing.');
    const s = document.createElement('p'); s.className = 'step'; s.textContent = 'Pick a test.'; main.appendChild(s);
    const row = document.createElement('div'); row.className = 'row'; main.appendChild(row);
    shuffle(r.options.map((o) => o.id), cfg.id + ':' + ri + ':' + replay).forEach((id) => {
      const o = r.options.find((x) => x.id === id);
      const b = btn('opt', '<span class="ic" aria-hidden="true">' + esc(o.icon || '') + '</span><span>' + esc(o.label) + '</span>', () => {
        if (done[o.id] || busy) return;
        select(r, o, b);
      });
      b.dataset.oid = o.id; b.setAttribute('aria-pressed', 'false');
      row.appendChild(b);
    });
  }

  function select(r, o, b) {
    root.querySelectorAll('.opt[data-oid]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    clearStage();
    if (r.predictAfter) { say('', o.label + ': release and watch the pattern first.'); releaseBtn(r, o); }
    else { say('', 'Predict first. ' + r.predict.q); predictStep(r, o, false); }
  }

  function predictStep(r, o, afterRun) {
    clearStage();
    const box = document.createElement('div'); box.className = 'stage2';
    const s = document.createElement('p'); s.className = 'step'; s.textContent = r.predict.q; box.appendChild(s);
    const row = document.createElement('div'); row.className = 'row'; box.appendChild(row);
    shuffle(r.predict.choices.map((c) => c.id), cfg.id + ':p:' + ri + ':' + replay + ':' + o.id).forEach((cid) => {
      const c = r.predict.choices.find((x) => x.id === cid);
      row.appendChild(btn('opt', esc(c.label), (e) => {
        if (c.id !== o.answer) { slips++; say('bad', 'Not quite. Think about this: ' + o.hint); return; }
        row.querySelectorAll('button').forEach((x) => { x.disabled = true; });
        e.currentTarget.classList.add('right');
        say('ok', afterRun ? 'Yes, that is what the pattern says. Now check it.' : 'Good prediction. Release and check it.');
        if (afterRun) {
          const rb = btn('btn rel', 'Show the next second', () => { rb.disabled = true; busy = true; revealDots(r, o, (line) => finishOption(r, o, line)); });
          box.appendChild(rb);
        } else releaseBtn(r, o);
      }));
    });
    main.appendChild(box);
  }

  function releaseBtn(r, o) {
    const b = btn('btn rel', 'Release', () => {
      b.disabled = true; busy = true;
      say('', 'Watch the track.');
      runResult(r, o, (line) => {
        if (o.result.kind === 'dots') { busy = false; say('', 'Pattern done. Now predict the next dot.'); predictStep(r, o, true); }
        else finishOption(r, o, line);
      });
    });
    (main.querySelector('.stage2') || main).appendChild(b);
  }

  function runResult(r, o, doneFn) {
    const k = o.result.kind;
    if (k === 'travel') runTravel(r, o, doneFn);
    else if (k === 'tries') runTries(r, o, doneFn);
    else if (k === 'dots') runDots(r, o, doneFn);
    else if (k === 'balance') runBalance(r, o, doneFn);
    else runPull(r, o, doneFn);
  }

  function runTravel(r, o, doneFn) {
    const res = o.result, t = trackBase();
    const centered = res.dir === 1 || res.dir === -1;
    const span = centered ? 42 : 90, start = centered ? 48 : 4;
    for (let i = 0; i <= res.max; i++) {
      [start + (i / res.max) * span, start - (i / res.max) * span].forEach((x, side) => {
        if (side === 1 && (!centered || i === 0)) return;
        const tk = document.createElement('span'); tk.className = 'tick'; tk.style.left = x + '%'; tk.textContent = i; t.appendChild(tk);
      });
    }
    const obj = document.createElement('div'); obj.className = 'obj'; obj.textContent = o.icon || '🚗'; obj.style.left = start + '%'; t.appendChild(obj);
    const target = start + (res.dir || 1) * (res.value / res.max) * span;
    setTimeout(() => place(obj, target, 900, () => {
      const m = document.createElement('span'); m.className = 'tick mark'; m.style.left = target + '%'; m.textContent = res.value + ' ' + res.unit; t.appendChild(m);
      const side = res.dir === -1 ? ' toward you' : res.dir === 1 ? ' away from you' : '';
      dataRow(o.icon, o.label, res.value + ' ' + res.unit + side, (res.value / res.max) * 100);
      doneFn(o.label + ' went ' + res.value + ' ' + res.unit + side + '.');
    }), reduce ? 0 : 150);
  }

  function runTries(r, o, doneFn) {
    const res = o.result, t = trackBase();
    const ln = document.createElement('div'); ln.className = 'stopline'; ln.style.left = '70%'; t.appendChild(ln);
    const st = document.createElement('div'); st.className = 'stopper'; st.style.left = '70%'; st.textContent = o.icon || '🧱'; t.appendChild(st);
    const obj = document.createElement('div'); obj.className = 'obj'; obj.textContent = '🚗'; obj.style.left = '4%'; t.appendChild(obj);
    const d = document.createElement('div'); d.className = 'row2';
    d.innerHTML = '<span class="rl">' + esc((o.icon ? o.icon + ' ' : '') + o.label) + '</span><span class="chips"></span><span class="val"></span>';
    q('.data').appendChild(d);
    const chips = d.querySelector('.chips'), val = d.querySelector('.val');
    let stops = 0, i = 0;
    const stepFn = () => {
      if (i >= res.outcomes.length) {
        val.textContent = 'Stopped ' + stops + ' of ' + res.outcomes.length;
        doneFn(o.label + ': stopped ' + stops + ' of ' + res.outcomes.length + ' tries.');
        return;
      }
      const out = res.outcomes[i]; i++;
      if (out === 'stop') stops++;
      place(obj, 4, 0);
      setTimeout(() => place(obj, out === 'stop' ? 62 : 94, 800, () => {
        const c = document.createElement('span'); c.className = 'chip ' + (out === 'stop' ? 'g' : 'x');
        c.textContent = 'Try ' + i + ': ' + (out === 'stop' ? 'Stopped' : 'Rolled past');
        chips.appendChild(c);
        setTimeout(stepFn, reduce ? 0 : 250);
      }), reduce ? 0 : 150);
    };
    stepFn();
  }

  const dotPct = (res, v) => 4 + (v / (res.max || k5PushArenaDots(res.positions) * 1.1)) * 90;
  function runDots(r, o, doneFn) {
    const res = o.result, t = trackBase();
    const obj = document.createElement('div'); obj.className = 'obj'; obj.textContent = o.icon || '⚪'; obj.style.left = dotPct(res, res.positions[0]) + '%'; t.appendChild(obj);
    let i = 0;
    const drop = () => {
      if (i >= res.positions.length) { doneFn(); return; }
      place(obj, dotPct(res, res.positions[i]), i ? 700 : 0, () => {
        const dd = document.createElement('span'); dd.className = 'dot'; dd.style.left = dotPct(res, res.positions[i]) + '%'; t.appendChild(dd);
        const m = document.createElement('span'); m.className = 'tick'; m.style.left = dotPct(res, res.positions[i]) + '%'; m.textContent = res.positions[i]; t.appendChild(m);
        i++; setTimeout(drop, reduce ? 0 : 200);
      });
    };
    drop();
  }
  function revealDots(r, o, doneFn) {
    const res = o.result, t = q('.track'), obj = t.querySelector('.obj');
    const next = k5PushArenaDots(res.positions);
    place(obj, dotPct(res, next), 700, () => {
      const dd = document.createElement('span'); dd.className = 'dot new'; dd.style.left = dotPct(res, next) + '%'; t.appendChild(dd);
      const m = document.createElement('span'); m.className = 'tick mark'; m.style.left = dotPct(res, next) + '%'; m.textContent = next; t.appendChild(m);
      dataRow(o.icon, o.label, res.positions.join(', ') + ' … ' + next + ' ' + res.unit, 100);
      doneFn('The next dot lands at ' + next + ' ' + res.unit + '. The gap stayed the same.');
    });
  }

  function runBalance(r, o, doneFn) {
    const res = o.result, t = trackBase();
    const box = document.createElement('div'); box.className = 'obj'; box.textContent = '📦'; box.style.left = '50%'; t.appendChild(box);
    [['l', res.arrows.left], ['r', res.arrows.right]].forEach(([side, n]) => {
      const a = document.createElement('span'); a.className = 'farrow ' + side; a.textContent = '➜';
      a.style.fontSize = (0.8 + n * 0.45) + 'rem'; a.setAttribute('aria-hidden', 'true'); t.appendChild(a);
    });
    setTimeout(() => {
      const to = res.move === 0 ? 50 : res.move > 0 ? 66 : 34;
      place(box, to, res.move === 0 ? 0 : 800, () => {
        const txt = res.move === 0 ? 'Stayed still' : 'Moved ' + (res.move > 0 ? 'right' : 'left');
        dataRow('', o.label, txt, res.move === 0 ? 0 : 100);
        doneFn(o.label + ': the box ' + txt.toLowerCase() + '.');
      });
    }, reduce ? 0 : 350);
  }

  function runPull(r, o, doneFn) {
    const t = trackBase();
    const mag = document.createElement('div'); mag.className = 'obj'; mag.textContent = '🧲'; mag.style.left = '92%'; t.appendChild(mag);
    const obj = document.createElement('div'); obj.className = 'obj'; obj.textContent = o.icon || '❔'; obj.style.left = '8%'; t.appendChild(obj);
    const fin = (moved) => {
      const txt = moved ? 'Pulled — no touching' : 'Not pulled';
      dataRow(o.icon, o.label, txt, moved ? 100 : 0);
      doneFn(o.label + ': ' + txt.toLowerCase() + '.');
    };
    setTimeout(() => { if (o.result.moves) place(obj, 84, 700, () => fin(true)); else fin(false); }, reduce ? 0 : 300);
  }

  function finishOption(r, o, line) {
    done[o.id] = true; busy = false;
    clearStage();
    const card = main.querySelector('.opt[data-oid="' + o.id + '"]');
    if (card) { card.disabled = true; card.classList.add('right'); card.setAttribute('aria-pressed', 'false'); }
    say('ok', line);
    const left = r.options.filter((x) => !done[x.id]);
    if (!left.length) { stepRead(r, 0); return; }
    const nx = main.querySelector('.opt[data-oid="' + left[0].id + '"]');
    if (nx) nx.focus();
  }

  function stepRead(r, i) {
    if (i >= r.reads.length) { endRound(r); return; }
    clearStage();
    const x = r.reads[i];
    const box = document.createElement('div'); box.className = 'stage2';
    const s = document.createElement('p'); s.className = 'step'; s.textContent = x.q; box.appendChild(s);
    const row = document.createElement('div'); row.className = 'row'; box.appendChild(row);
    x.choices.forEach((c) => row.appendChild(btn('opt', esc(c.label), (e) => {
      if (!c.ok) { slips++; say('bad', c.why); return; }
      row.querySelectorAll('button').forEach((b) => { b.disabled = true; });
      e.currentTarget.classList.add('right');
      say('ok', c.why);
      stepRead(r, i + 1);
    })));
    main.appendChild(box);
  }

  function endRound(r) {
    found.push(r.finding);
    const f = document.createElement('div'); f.className = 'finding'; f.textContent = r.finding;
    q('.data').appendChild(f);
    if (ri + 1 < cfg.rounds.length) {
      q('.end').appendChild(btn('btn', 'Next test', () => { ri++; round(); }));
      return;
    }
    main.innerHTML = '';
    const s = document.createElement('p'); s.className = 'step'; s.textContent = 'Build your claim.'; main.appendChild(s);
    claimPart(0, []);
  }

  function claimPart(i, parts) {
    if (i >= cfg.claim.length) { donePanel(parts); return; }
    const x = cfg.claim[i];
    const box = document.createElement('div'); box.className = 'stage2';
    const s = document.createElement('p'); s.className = 'step'; s.textContent = x.lead + ' ...'; box.appendChild(s);
    const row = document.createElement('div'); row.className = 'row'; box.appendChild(row);
    x.choices.forEach((c) => row.appendChild(btn('opt', esc(c.label), (e) => {
      if (!c.ok) { slips++; say('bad', c.why); return; }
      row.querySelectorAll('button').forEach((b) => { b.disabled = true; });
      e.currentTarget.classList.add('right');
      parts.push(x.lead + ' ' + c.label);
      say('ok', c.why);
      claimPart(i + 1, parts);
    })));
    main.appendChild(box);
  }

  function donePanel(parts) {
    main.innerHTML = '';
    const d = document.createElement('div'); d.className = 'done';
    d.innerHTML = '<b>What you found</b>' + found.map((f) => '<p>' + esc(f) + '</p>').join('') +
      '<p class="claimline">' + esc(parts.join('. ') + '.') + '</p><p>' + esc(cfg.summary) + '</p>' +
      (slips ? '<p>Worth a second look: ' + slips + ' choice' + (slips > 1 ? 's' : '') + ' needed another try.</p>' : '<p>Every prediction and choice was right on the first try.</p>');
    d.appendChild(btn('btn', 'Play again', () => { replay++; ri = 0; slips = 0; found.length = 0; round(); }));
    q('.end').appendChild(d);
    q('.prog').textContent = 'Done';
  }
  round();
}

if (typeof module !== 'undefined') module.exports = { k5PushArenaValidate, k5PushArenaDots, k5PushArenaMove };
