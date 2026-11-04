/* k5-activities/pathsignal.js
   Path & Signal: build a closed loop with a cell, wires, a switch and a load (LED, buzzer, motor).
   One config drives one activity; rounds run in order.
   Round: {id, goal, slots, pieces:[{id,kind,icon,label}], locked:{slotIndex:pieceId},
           lit:[pieceId], need?:[pieceId that must be in the loop], type:"test", materials:[{id,icon,label,conducts}], done}
   kinds: cell, wire, led, buzzer, motor, switch, insulator. The loop is one series path:
   current leaves the cell and walks the slots in order; an empty slot, an insulator, an open
   switch or a backward LED stops it; a closed loop with no load is a short circuit (a stop with
   a reason, never a punishment). Test rounds lock every slot but one gap; each material tried in
   the gap logs a row in a results table. Piece position never matters, only a complete path does.
   Pure helpers (k5PathSignalValidate, k5PathSignalCheck, k5psOrder) run in Node for tests. */

function k5PathSignalValidate(cfg) {
  const errs = [];
  if (!cfg || !cfg.id) errs.push('config needs an id');
  if (!cfg || !cfg.title || !cfg.intro || !cfg.summary) errs.push('config needs title, intro and summary');
  if (!cfg || !cfg.note) errs.push('config needs a note saying it is a model');
  if (cfg && cfg.engine && cfg.engine !== 'pathsignal') errs.push('engine must be pathsignal');
  if (!cfg || !Array.isArray(cfg.rounds) || !cfg.rounds.length) { errs.push('config needs rounds'); return errs; }
  const kinds = ['cell', 'wire', 'led', 'buzzer', 'motor', 'switch', 'insulator'];
  const loads = ['led', 'buzzer', 'motor'];
  const rids = new Set();
  cfg.rounds.forEach((r, i) => {
    const tag = 'round ' + (i + 1) + ' (' + (r.id || '?') + ')';
    if (!r.id) errs.push(tag + ': needs an id');
    else if (rids.has(r.id)) errs.push(tag + ': duplicate round id');
    rids.add(r.id);
    if (!r.goal || !r.done) errs.push(tag + ': needs goal and done');
    if (!Number.isInteger(r.slots) || r.slots < 3 || r.slots > 10) errs.push(tag + ': slots must be a whole number from 3 to 10');
    const pieces = Array.isArray(r.pieces) ? r.pieces : [];
    const ids = new Set();
    pieces.forEach((p) => {
      if (!p.id || ids.has(p.id)) errs.push(tag + ': missing or duplicate piece id ' + p.id);
      ids.add(p.id);
      if (kinds.indexOf(p.kind) < 0) errs.push(tag + ': piece ' + p.id + ' has unknown kind ' + p.kind);
      if (!p.label) errs.push(tag + ': piece ' + p.id + ' needs a label');
    });
    if (pieces.filter((p) => p.kind === 'cell').length !== 1) errs.push(tag + ': needs exactly one cell piece');
    const locked = r.locked || {};
    const lslots = Object.keys(locked);
    const lpieces = Object.values(locked);
    lslots.forEach((s) => {
      const n = +s;
      if (!Number.isInteger(n) || n < 0 || n >= r.slots) errs.push(tag + ': locked slot ' + s + ' is out of range');
      if (!ids.has(locked[s])) errs.push(tag + ': locked slot ' + s + ' names unknown piece ' + locked[s]);
    });
    if (new Set(lpieces).size !== lpieces.length) errs.push(tag + ': a piece is locked into two slots');
    if (lslots.length >= r.slots) errs.push(tag + ': every slot is locked, so there is nothing to do');
    const lockedKinds = lpieces.map((id) => { const p = pieces.find((x) => x.id === id); return p && p.kind; });
    if (lockedKinds.indexOf('insulator') >= 0) errs.push(tag + ': an insulator is locked in, so the loop can never work');
    if (r.type === 'test') {
      if (lslots.length !== r.slots - 1) errs.push(tag + ': a test round locks every slot but one gap');
      if (lslots.length !== pieces.length) errs.push(tag + ': in a test round every piece is locked in');
      if (lockedKinds.indexOf('cell') < 0 || !lockedKinds.some((k) => loads.indexOf(k) >= 0)) errs.push(tag + ': the cell and a load must be locked in');
      const mats = Array.isArray(r.materials) ? r.materials : [];
      if (mats.length < 3) errs.push(tag + ': a test round needs at least 3 materials');
      const mids = new Set(); let yes = 0;
      mats.forEach((m) => {
        if (!m.id || mids.has(m.id)) errs.push(tag + ': missing or duplicate material id ' + m.id);
        mids.add(m.id);
        if (!m.label || typeof m.conducts !== 'boolean') errs.push(tag + ': material ' + m.id + ' needs a label and conducts true/false');
        if (m.conducts) yes++;
      });
      if (!yes || yes === mats.length) errs.push(tag + ': needs at least one conductor and one insulator to compare');
    } else {
      const lit = Array.isArray(r.lit) ? r.lit : [];
      if (!lit.length) errs.push(tag + ': a build round needs lit, the load(s) that must run');
      (r.need || []).forEach((id) => { if (!ids.has(id)) errs.push(tag + ': need names unknown piece ' + id); });
      lit.forEach((id) => {
        const p = pieces.find((x) => x.id === id);
        if (!p) errs.push(tag + ': lit names unknown piece ' + id);
        else if (loads.indexOf(p.kind) < 0) errs.push(tag + ': lit piece ' + id + ' is not a load');
      });
      if (pieces.length < r.slots) errs.push(tag + ': fewer pieces than slots, so the loop can never be filled');
      if (pieces.filter((p) => p.kind !== 'insulator').length < r.slots) errs.push(tag + ': not enough conducting pieces to fill the loop, so there is no way to succeed');
      else {
        const solved = pieces.filter((p) => p.kind === 'cell').concat(pieces.filter((p) => lit.indexOf(p.id) >= 0), pieces.filter((p) => (r.need || []).indexOf(p.id) >= 0 && lit.indexOf(p.id) < 0), pieces.filter((p) => p.kind !== 'cell' && p.kind !== 'insulator' && lit.indexOf(p.id) < 0 && (r.need || []).indexOf(p.id) < 0)).slice(0, r.slots);
        const lock = {}; const sw = {};
        solved.forEach((p) => { if (p.kind === 'switch') sw[p.id] = false; });
        const res = k5PathSignalCheck(r, solved.map((p) => p.id), { open: sw, flip: {} });
        if (res.status !== 'lit' || !lit.every((id) => res.lit.indexOf(id) >= 0)) errs.push(tag + ': no way to fill the loop lights every load in lit (the cell and each lit load must fit in ' + r.slots + ' slots)');
      }
    }
  });
  return errs;
}

/* The whole solver: walk the loop from the cell. Returns
   {status:"nocell"|"open"|"short"|"lit", why, at, piece, lit:[loadIds]}. */
function k5PathSignalCheck(round, placed, state) {
  const byId = {};
  (round.pieces || []).forEach((p) => { byId[p.id] = p; });
  (round.materials || []).forEach((m) => { byId['mat:' + m.id] = { id: 'mat:' + m.id, kind: 'material', label: m.label, conducts: !!m.conducts }; });
  const open = (state && state.open) || {};
  const flip = (state && state.flip) || {};
  const n = round.slots;
  let cellAt = -1;
  for (let i = 0; i < n; i++) if (placed[i] && byId[placed[i]] && byId[placed[i]].kind === 'cell') cellAt = i;
  if (cellAt < 0) return { status: 'nocell', lit: [] };
  const lit = [];
  for (let s = 1; s < n; s++) {
    const i = (cellAt + s) % n;
    const id = placed[i];
    const p = id && byId[id];
    if (!p) return { status: 'open', why: 'gap', at: i, lit: [] };
    if (p.kind === 'insulator') return { status: 'open', why: 'insulator', at: i, piece: id, lit: [] };
    if (p.kind === 'material' && !p.conducts) return { status: 'open', why: 'insulator', at: i, piece: id, lit: [] };
    if (p.kind === 'switch' && open[id]) return { status: 'open', why: 'switch', at: i, piece: id, lit: [] };
    if (p.kind === 'led') {
      if (flip[id]) return { status: 'open', why: 'led', at: i, piece: id, lit: [] };
      lit.push(id);
    }
    if (p.kind === 'buzzer' || p.kind === 'motor') lit.push(id);
  }
  if (!lit.length) return { status: 'short', lit: [] };
  return { status: 'lit', lit: lit };
}

function k5psHash(str) {
  let h = 2166136261;
  for (const ch of String(str)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
/* Deterministic order for a tray, from a text seed. */
function k5psOrder(ids, seed) {
  let h = k5psHash(seed);
  const rnd = () => { h = (h + 0x6D2B79F5) | 0; let t = Math.imul(h ^ (h >>> 15), 1 | h); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const a = ids.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function k5PathSignal(host, cfg) {
  if (!host || host.shadowRoot) return;
  const root = host.attachShadow({ mode: 'open' });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  root.innerHTML = '<style>' +
    ':host{display:block}' +
    '.box{background:var(--surface, #fff);border:1.5px solid var(--line, #bbb);border-radius:14px;padding:16px;color:var(--ink, #111);font-family:var(--font-body,system-ui,sans-serif)}' +
    '.top{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;justify-content:space-between;margin-bottom:6px}' +
    '.top b{font-size:1.05rem}.prog{color:var(--muted, #555);font-size:.9rem}' +
    '.goal{margin:4px 0 10px;font-size:1.05rem;font-weight:700}' +
    '.board{position:relative;width:100%;max-width:440px;margin:4px auto;aspect-ratio:4/3}' +
    '.loop{position:absolute;inset:13% 11%;border:3px solid var(--line, #bbb);border-radius:50%}' +
    '.loop.on{border-color:var(--green, #25904f)}.loop.hot{border-color:var(--red, #d93036);border-style:dashed}' +
    '.slot{position:absolute;width:54px;height:54px;transform:translate(-50%,-50%);border-radius:50%;border:2px solid var(--line, #bbb);background:var(--surface, #fff);color:var(--ink, #111);font:inherit;font-size:1.4rem;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0;line-height:1}' +
    '.slot.empty{border-style:dashed;background:var(--surface-2, #eef0f3);color:var(--muted, #555);font-size:.68rem}' +
    '.slot.fix{cursor:default}.slot.over{border-color:var(--beam, #f2a900)}' +
    '.slot.glow{border-color:var(--green, #25904f);box-shadow:0 0 12px 2px var(--beam, #f2a900)}' +
    '.slot.warm{border-color:var(--red, #d93036)}' +
    '.slot .bd{font-size:.58rem;color:var(--muted, #555);margin-top:2px}' +
    '.slot .bd.on{color:var(--green, #25904f)}.slot .bd.off{color:var(--red, #d93036);font-weight:700}' +
    '.state{font-size:.9rem;color:var(--muted, #555);margin:6px 0;min-height:2.4em}' +
    '.tray{display:flex;flex-wrap:wrap;gap:8px;min-height:56px;padding:10px;border-radius:10px;background:var(--surface-2, #eef0f3)}' +
    '.pc{font:inherit;color:inherit;display:flex;align-items:center;gap:8px;padding:8px 12px;min-height:44px;border-radius:10px;border:1.5px solid var(--line, #bbb);background:var(--surface, #fff);cursor:grab;text-align:left}' +
    '.pc .ic{font-size:1.4rem;line-height:1}' +
    '.pc[aria-pressed="true"]{outline:3px solid var(--beam, #f2a900);outline-offset:1px}' +
    '.mut{color:var(--muted, #555);font-size:.9rem}' +
    '.tab{border-collapse:collapse;margin:8px 0;font-size:.95rem}' +
    '.tab caption{text-align:left;margin-bottom:4px}' +
    '.tab th,.tab td{border:1.5px solid var(--line, #bbb);padding:4px 10px;text-align:left}' +
    '.tab .y{color:var(--green, #25904f);font-weight:700}.tab .n{color:var(--muted, #555);font-weight:700}' +
    '.msg{margin-top:12px;min-height:2.6em;padding:8px 12px;border-radius:10px;background:var(--surface-2, #eef0f3);font-size:1rem}' +
    '.msg.ok{border-left:5px solid var(--green, #25904f)}.msg.bad{border-left:5px solid var(--red, #d93036)}' +
    '.btn{font:inherit;font-weight:700;padding:9px 16px;min-height:44px;border-radius:10px;border:0;background:var(--beam, #f2a900);color:var(--beam-ink, #1a1400);cursor:pointer;margin-top:10px}' +
    '.donebox{margin-top:12px;padding:12px;border-radius:10px;border:1.5px solid var(--green, #25904f)}' +
    '.donebox p{margin:6px 0}.note{color:var(--muted, #555);font-size:.88rem;margin-top:10px}' +
    'button:focus-visible{outline:3px solid var(--beam, #f2a900);outline-offset:2px}' +
    '@media (prefers-reduced-motion:reduce){.slot.glow{box-shadow:none}}' +
    '</style><div class="box"><div class="top"><b></b><span class="prog" aria-live="polite"></span></div>' +
    '<p class="goal"></p><div class="board"><div class="loop"></div></div>' +
    '<p class="state"></p><div class="tray" role="group" aria-label="Pieces"></div>' +
    '<div class="tabwrap"></div><div class="msg" role="status" aria-live="polite"></div>' +
    '<div class="end"></div><p class="note"></p></div>';
  const q = (s) => root.querySelector(s);
  q('.top b').textContent = cfg.title;
  q('.note').textContent = cfg.note || '';
  const board = q('.board');
  const say = (kind, text) => { const m = q('.msg'); m.className = 'msg ' + kind; m.textContent = text; };
  const whyLine = {
    gap: 'a gap stops the current',
    insulator: 'plastic, wood and string are insulators',
    switch: 'an open switch breaks the path',
    led: 'an LED lights only one way',
    short: 'a short circuit can get hot'
  };
  const makeLine = {
    led: 'The LED lights',
    buzzer: 'The doorbell rings',
    motor: 'The motor spins'
  };
  /* "Copy what you found": puts the text on the clipboard, or shows it selected if the browser refuses. */
  function copyBtn(text) {
    const wrap = document.createElement('span');
    const b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.textContent = 'Copy what you found';
    b.addEventListener('click', () => {
      const fallback = () => { const t = document.createElement('textarea'); t.value = text; t.readOnly = true; t.setAttribute('aria-label', 'What you found, to copy'); t.style.cssText = 'display:block;width:100%;margin-top:8px;min-height:5em'; wrap.appendChild(t); t.focus(); t.select(); };
      try { navigator.clipboard.writeText(text).then(() => { b.textContent = 'Copied'; }, fallback); } catch (e) { fallback(); }
    });
    wrap.appendChild(b); return wrap;
  }
  let started = false;
  let ri = 0, play = 0, sel = null, placed = [], open = {}, flip = {}, tested = {}, results = {}, lockedMap = {};
  let attempts = 0, succeeded = false;
  const found = [], seen = [];

  function byId(id) {
    const r = cfg.rounds[ri];
    const p = r.pieces.find((x) => x.id === id);
    if (p) return p;
    const m = (r.materials || []).find((x) => 'mat:' + x.id === id);
    return m ? { id: 'mat:' + m.id, kind: 'material', conducts: m.conducts, icon: m.icon, label: m.label } : null;
  }
  function list(a) { return a.length > 1 ? a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1] : String(a[0]); }

  function setup() {
    const r = cfg.rounds[ri];
    sel = null; placed = []; open = {}; flip = {}; tested = {}; results = {}; lockedMap = {}; succeeded = false;
    for (let i = 0; i < r.slots; i++) placed.push(null);
    Object.keys(r.locked || {}).forEach((s) => { placed[+s] = r.locked[s]; lockedMap[+s] = true; });
    const seed = cfg.id + ':' + ri + ':' + play;
    r.pieces.forEach((p) => {
      if (p.kind === 'led') flip[p.id] = r.type === 'test' ? false : k5psHash(seed + ':flip:' + p.id) % 2 === 0;   /* a locked LED always points the working way */
      if (p.kind === 'switch') open[p.id] = true;
    });
    q('.prog').textContent = 'Round ' + (ri + 1) + ' of ' + cfg.rounds.length;
    q('.goal').textContent = r.goal;
    q('.end').innerHTML = ''; q('.tabwrap').innerHTML = '';
    buildSlots();
    if (r.type === 'test') buildTable();
    paint(k5PathSignalCheck(r, placed, { open: open, flip: flip }));
    say('', r.type === 'test' ? 'Tap a material to put it in the test gap.' : 'Tap a piece, then tap a slot. Fill every slot so the loop has no gaps.');
    if (started) { const f0 = root.querySelector('.tray .pc') || root.querySelector('.slot'); if (f0) f0.focus(); }
    started = true;
  }

  function buildSlots() {
    const r = cfg.rounds[ri];
    board.querySelectorAll('.slot').forEach((s) => s.remove());
    for (let i = 0; i < r.slots; i++) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'slot'; b.dataset.slot = i;
      const a = -Math.PI / 2 + (2 * Math.PI * i) / r.slots;
      b.style.left = 50 + 43 * Math.cos(a) + '%';
      b.style.top = 50 + 41 * Math.sin(a) + '%';
      b.addEventListener('click', () => onSlot(i));
      b.addEventListener('dragover', (e) => { e.preventDefault(); b.classList.add('over'); });
      b.addEventListener('dragleave', () => b.classList.remove('over'));
      b.addEventListener('drop', (e) => { e.preventDefault(); b.classList.remove('over'); onSlot(i); });
      board.appendChild(b);
    }
  }

  function badge(p, id, res) {
    if (p.kind === 'cell') return res.status === 'short' ? 'warm!' : '+ −';
    if (p.kind === 'switch') return open[id] ? 'open' : 'closed';
    if (p.kind === 'led') return flip[id] ? '←' : '→';
    return '';
  }
  function badgeCls(p, id, res) {
    if (p.kind === 'cell' && res.status === 'short') return ' off';
    if (p.kind === 'switch') return open[id] ? ' off' : ' on';
    if (p.kind === 'led') return flip[id] ? ' off' : '';
    return '';
  }

  function paint(res) {
    board.querySelectorAll('.slot').forEach((b) => {
      const i = +b.dataset.slot;
      const id = placed[i];
      const p = id ? byId(id) : null;
      let cls = 'slot';
      if (!p) cls += ' empty';
      if (lockedMap[i]) cls += ' fix';
      if (p && res.lit.indexOf(id) >= 0) cls += ' glow';
      if (p && p.kind === 'cell' && res.status === 'short') cls += ' warm';
      b.className = cls;
      const bd = p ? badge(p, id, res) : '';
      b.innerHTML = p
        ? '<span aria-hidden="true">' + esc(p.icon || '') + '</span><span class="bd' + badgeCls(p, id, res) + '">' + esc(bd) + '</span>'
        : '<span>slot ' + (i + 1) + '</span>';
      b.setAttribute('aria-label', 'Slot ' + (i + 1) + ': ' + (p ? p.label + (bd ? ', ' + bd : '') : 'empty'));
    });
    q('.loop').className = 'loop' + (res.status === 'lit' ? ' on' : res.status === 'short' ? ' hot' : '');
    q('.state').textContent = describe(res);
    renderTray();
  }

  function describe(res) {
    const r = cfg.rounds[ri];
    let cellAt = -1;
    for (let i = 0; i < r.slots; i++) { const p = placed[i] && byId(placed[i]); if (p && p.kind === 'cell') cellAt = i; }
    const parts = [];
    for (let s = 0; s < r.slots; s++) {
      const i = cellAt >= 0 ? (cellAt + s) % r.slots : s;
      const id = placed[i];
      if (!id) { parts.push('an empty slot'); continue; }
      const p = byId(id);
      let t = p.label.toLowerCase();
      if (p.kind === 'switch') t += ' (' + (open[id] ? 'open' : 'closed') + ')';
      if (p.kind === 'led') t += flip[id] ? ' (pointing against the loop)' : ' (pointing with the loop)';
      parts.push(t);
    }
    let tail;
    if (res.status === 'lit') tail = 'The path is closed and current flows: ' + res.lit.map((id) => byId(id).label.toLowerCase()).join(' and ') + ' on.';
    else if (res.status === 'short') tail = 'The path is closed with nothing using the energy: a short circuit.';
    else if (res.status === 'nocell') tail = 'The cell is not in the loop.';
    else tail = 'The path is broken at ' + (res.why === 'gap' ? 'an empty slot' : 'the ' + byId(res.piece).label.toLowerCase()) + '.';
    return 'Loop from the cell: ' + parts.join(', ') + '. ' + tail;
  }

  function reason(res) {
    const r = cfg.rounds[ri];
    if (res.status === 'nocell') return 'The cell is not in the loop. The cell provides the electrical energy.';
    if (res.status === 'short') return 'Stop — this loop joins the two ends of the cell with nothing using the energy. That is a short circuit, and it can get hot. Unhook a piece and put the ' + r.lit.map((id) => byId(id).label.toLowerCase()).join(' or ') + ' back in the path.';
    if (res.why === 'gap') return 'There is a gap in the loop. Current flows only in a complete, closed path — fill every slot.';
    if (res.why === 'insulator') return 'The ' + byId(res.piece).label.toLowerCase() + ' is an insulator — it blocks the current. Metals conduct; plastic and wood do not.';
    if (res.why === 'switch') return 'A switch is open. An open switch breaks the path — tap the switch to close it.';
    if (res.why === 'led') return 'The LED is dark. An LED lights only one way — tap the LED to flip it.';
    if (res.status === 'lit') return 'Current flows, but the goal also needs the ' + r.lit.filter((id) => res.lit.indexOf(id) < 0).map((id) => byId(id).label.toLowerCase()).join(' and ') + ' in the loop.';
    return '';
  }

  function judgeBuild(res) {
    const r = cfg.rounds[ri];
    const missing = (r.need || []).filter((id) => placed.indexOf(id) < 0);
    if (res.status === 'lit' && r.lit.every((id) => res.lit.indexOf(id) >= 0) && missing.length) {
      say('', 'It lights, but this round is about the ' + missing.map((id) => byId(id).label.toLowerCase()).join(' and ') + '. Build the loop with it in.');
      return;
    }
    if (res.status === 'lit' && r.lit.every((id) => res.lit.indexOf(id) >= 0)) {
      succeeded = true;
      found.push(r.done);
      say('ok', res.lit.map((id) => makeLine[byId(id).kind]).join('; ') + '. ' + r.done);
      nextStep();
      return;
    }
    if (placed.every(Boolean)) {
      attempts++;
      const key = res.status === 'short' ? 'short' : res.why;
      if (key && seen.indexOf(key) < 0) seen.push(key);
      say('bad', reason(res));
    } else say('', reason(res));
  }

  function onSlot(i) {
    if (succeeded) return;
    const r = cfg.rounds[ri];
    if (sel) {
      if (lockedMap[i]) { say('bad', 'That piece is fixed in place for this test.'); return; }
      placed[i] = sel; sel = null;
      const res = k5PathSignalCheck(r, placed, { open: open, flip: flip });
      paint(res); judgeBuild(res);
      return;
    }
    const cur = placed[i];
    if (!cur) { say('', r.type === 'test' ? 'That is the test gap. Tap a material below to try it in the loop.' : 'Empty slot. Tap a piece in the tray first, then tap this slot.'); return; }
    const p = byId(cur);
    if (r.type === 'test') {
      say('', lockedMap[i] ? 'Fixed in place for this test: the ' + p.label.toLowerCase() + '.' : 'The ' + p.label.toLowerCase() + ' is in the gap. Tap another material to swap it.');
      return;
    }
    if (p.kind === 'led' || p.kind === 'switch') {
      if (p.kind === 'led') flip[cur] = !flip[cur]; else open[cur] = !open[cur];
      const res = k5PathSignalCheck(r, placed, { open: open, flip: flip });
      paint(res); judgeBuild(res);
      return;
    }
    sel = cur; placed[i] = null;
    paint(k5PathSignalCheck(r, placed, { open: open, flip: flip }));
    say('', 'Picked up the ' + p.label.toLowerCase() + '. Tap a slot to place it, or tap it in the tray to put it back.');
  }

  function testMaterial(mid) {
    if (succeeded) return;
    const r = cfg.rounds[ri];
    let gi = 0;
    for (let i = 0; i < r.slots; i++) if (!lockedMap[i]) gi = i;
    placed[gi] = 'mat:' + mid;
    const res = k5PathSignalCheck(r, placed, { open: open, flip: flip });
    results[mid] = res.status === 'lit' ? 'Yes' : 'No';
    tested[mid] = true;
    paint(res); fillTable();
    const m = r.materials.find((x) => x.id === mid);
    if (res.status === 'lit') say('ok', 'The LED lights — the ' + m.label.toLowerCase() + ' is a conductor. Metal lets the current through.');
    else say('', 'No light — the ' + m.label.toLowerCase() + ' is an insulator. It blocks the current.');
    if (r.materials.every((x) => tested[x.id])) {
      succeeded = true;
      const yes = r.materials.filter((x) => x.conducts).map((x) => x.label.toLowerCase());
      const no = r.materials.filter((x) => !x.conducts).map((x) => x.label.toLowerCase());
      found.push('You tested ' + r.materials.length + ' materials in the gap: ' + list(yes) + ' conducted; ' + list(no) + ' did not.');
      say('ok', (res.status === 'lit' ? 'The LED lights - the ' + m.label.toLowerCase() + ' is a conductor. ' : 'No light - the ' + m.label.toLowerCase() + ' is an insulator. ') + r.done);
      nextStep();
    }
  }

  function buildTable() {
    const r = cfg.rounds[ri];
    const t = document.createElement('table');
    t.className = 'tab';
    t.innerHTML = '<caption class="mut">Material tester results</caption><thead><tr><th>Material</th><th>Lights?</th></tr></thead><tbody>' +
      r.materials.map((m) => '<tr data-mid="' + esc(m.id) + '"><td>' + esc((m.icon ? m.icon + ' ' : '') + m.label) + '</td><td class="r">not tested</td></tr>').join('') + '</tbody>';
    q('.tabwrap').appendChild(t);
  }
  function fillTable() {
    const r = cfg.rounds[ri];
    r.materials.forEach((m) => {
      const td = q('.tabwrap').querySelector('tr[data-mid="' + m.id + '"] .r');
      if (!td || !results[m.id]) return;
      td.textContent = results[m.id];
      td.className = 'r ' + (results[m.id] === 'Yes' ? 'y' : 'n');
    });
  }

  function renderTray() {
    const r = cfg.rounds[ri];
    const tray = q('.tray');
    tray.innerHTML = '';
    if (r.type === 'test') {
      r.materials.forEach((m) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'pc'; b.dataset.mid = m.id;
        b.innerHTML = '<span class="ic" aria-hidden="true">' + esc(m.icon || '') + '</span><span>' + esc(m.label) + (tested[m.id] ? ' ✓' : '') + '</span>';
        b.addEventListener('click', () => testMaterial(m.id));
        tray.appendChild(b);
      });
      return;
    }
    const order = k5psOrder(r.pieces.map((p) => p.id), cfg.id + ':' + ri + ':' + play);
    let n = 0;
    order.forEach((id) => {
      if (placed.indexOf(id) >= 0) return;
      n++;
      const p = byId(id);
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'pc'; b.draggable = true; b.dataset.pid = id;
      b.setAttribute('aria-pressed', String(sel === id));
      b.innerHTML = '<span class="ic" aria-hidden="true">' + esc(p.icon || '') + '</span><span>' + esc(p.label) + '</span>';
      b.addEventListener('click', () => {
        if (succeeded) return;
        sel = sel === id ? null : id;
        renderTray();
        say('', sel ? 'Picked up the ' + p.label.toLowerCase() + '. Tap a slot to place it.' : 'Put the ' + p.label.toLowerCase() + ' back.');
      });
      b.addEventListener('dragstart', (e) => { sel = id; try { e.dataTransfer.setData('text/plain', id); } catch (x) {} });
      tray.appendChild(b);
    });
    if (!n) { const s = document.createElement('span'); s.className = 'mut'; s.textContent = 'Every piece is in the loop.'; tray.appendChild(s); }
  }

  function nextStep() {
    const end = q('.end'); end.innerHTML = '';
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'btn';
    if (ri + 1 < cfg.rounds.length) {
      b.textContent = 'Next round';
      b.addEventListener('click', () => { ri++; setup(); });
    } else {
      b.textContent = 'See what you found';
      b.addEventListener('click', finishAll);
    }
    end.appendChild(b);
  }

  function finishAll() {
    q('.prog').textContent = 'Done';
    const d = document.createElement('div');
    d.className = 'donebox';
    let html = '<b>What you found</b>' + found.map((f) => '<p>' + esc(f) + '</p>').join('');
    if (seen.length) html += '<p>You saw it yourself: ' + esc(seen.map((k) => whyLine[k]).join('; ')) + '.</p>';
    html += '<p>' + esc(cfg.summary) + '</p>';
    html += attempts
      ? '<p>Your loops took ' + attempts + ' fix' + (attempts > 1 ? 'es' : '') + ' — every fix told you something about the path.</p>'
      : '<p>Every loop worked on the first try.</p>';
    d.innerHTML = html;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'btn'; b.textContent = 'Play again';
    b.addEventListener('click', () => { play++; ri = 0; attempts = 0; found.length = 0; seen.length = 0; setup(); });
    d.appendChild(b);
    d.appendChild(copyBtn(found.join(' ') + ' ' + cfg.summary));
    const end = q('.end'); end.innerHTML = ''; end.appendChild(d);
    say('ok', 'All rounds done. Read what you found below.');
  }
  setup();
}

if (typeof module !== 'undefined') module.exports = { k5PathSignalValidate, k5PathSignalCheck, k5psOrder };
