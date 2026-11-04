/* graphsky.js — Graph & Sky: move the Sun, turn Earth, place Moon cards, daylight strips, star cards or gravity arrows.
   A log, table or graph fills from what the child does; then they read the pattern and build a claim.
   Round kinds: sunpath (day/night sky log), moon (order the phases), strips (daylight bar graph),
   shadow (Sun across the sky; shadow map + table), stars (constellation to season), gravity (down = toward the center).
   Pure helpers (k5GraphSkyValidate, k5SkyOrder) are separate from the DOM code so tests can run them in Node. */

function k5GraphSkyValidate(cfg) {
  const errs = [];
  if (!cfg || !cfg.id) errs.push('config needs an id');
  if (!cfg.title || !cfg.intro || !cfg.summary) errs.push('config needs title, intro and summary');
  if (!cfg.note) errs.push('config needs a note saying it is a model');
  if (!Array.isArray(cfg.rounds) || !cfg.rounds.length) { errs.push('config needs rounds'); return errs; }
  const KINDS = ['sunpath', 'moon', 'strips', 'shadow', 'stars', 'gravity'];
  const DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const SHAPES = ['new', 'crescent', 'half', 'gibbous', 'full'];
  const choicesOk = (list, tag) => {
    if (!Array.isArray(list) || list.length < 2) { errs.push(tag + ': needs at least 2 choices'); return; }
    if (list.filter((c) => c.ok).length !== 1) errs.push(tag + ': needs exactly one correct choice');
    list.forEach((c) => { if (!c.label || !c.why) errs.push(tag + ': every choice needs label and why'); });
  };
  cfg.rounds.forEach((r, i) => {
    const tag = 'round ' + (i + 1);
    if (!r.question) errs.push(tag + ': needs a question');
    if (!KINDS.includes(r.kind)) { errs.push(tag + ': unknown kind ' + r.kind); return; }
    (r.reads || []).forEach((x, j) => { if (!x.q) errs.push(tag + ' read ' + (j + 1) + ': needs q'); choicesOk(x.choices, tag + ' read ' + (j + 1)); });
    if (!(r.reads || []).length) errs.push(tag + ': needs at least one read question');
    if ((r.claim || []).length < 3) errs.push(tag + ': claim needs 3 parts');
    (r.claim || []).forEach((x, j) => { if (!x.lead) errs.push(tag + ' claim ' + (j + 1) + ': needs lead'); choicesOk(x.choices, tag + ' claim ' + (j + 1)); });
    if (r.kind === 'sunpath') {
      const s = r.stops || [], ids = new Set();
      if (s.length < 3) errs.push(tag + ': sunpath needs at least 3 stops');
      s.forEach((st) => {
        if (!st.id) errs.push(tag + ': every stop needs an id');
        if (ids.has(st.id)) errs.push(tag + ': duplicate stop id ' + st.id);
        ids.add(st.id);
        if (!st.label) errs.push(tag + ': stop ' + st.id + ' needs label');
        if (st.sun !== 'up' && st.sun !== 'down') errs.push(tag + ': stop ' + st.id + ' sun must be up or down');
        if (st.stars !== 'hidden' && st.stars !== 'out') errs.push(tag + ': stop ' + st.id + ' stars must be hidden or out');
        if (st.tone && !['day', 'sunset', 'night'].includes(st.tone)) errs.push(tag + ': stop ' + st.id + ' has unknown tone ' + st.tone);
      });
      if (s.length && !s.some((st) => st.sun === 'up')) errs.push(tag + ': sunpath needs a daytime stop');
      if (s.length && !s.some((st) => st.sun === 'down')) errs.push(tag + ': sunpath needs a night stop');
    }
    if (r.kind === 'moon') {
      const c = r.cards || [], ids = new Set(), ords = new Set();
      if (c.length < 3) errs.push(tag + ': moon needs at least 3 cards');
      c.forEach((x) => {
        if (!x.id) errs.push(tag + ': every card needs an id');
        if (ids.has(x.id)) errs.push(tag + ': duplicate card id ' + x.id);
        ids.add(x.id);
        if (!x.label || !x.hint) errs.push(tag + ': card ' + x.id + ' needs label and hint');
        if (!SHAPES.includes(x.shape)) errs.push(tag + ': card ' + x.id + ' has unknown shape ' + x.shape);
        if (typeof x.order !== 'number') errs.push(tag + ': card ' + x.id + ' needs a numeric order');
        if (ords.has(x.order)) errs.push(tag + ': duplicate order ' + x.order);
        ords.add(x.order);
      });
      if (c.length === ords.size) for (let k = 0; k < c.length; k++) if (!ords.has(k)) { errs.push(tag + ': order values must run 0 to ' + (c.length - 1) + ' with no gaps'); break; }
    }
    if (r.kind === 'strips') {
      const sl = r.slots || [], st = r.strips || [], sids = new Set(), tids = new Set(), per = {};
      if (sl.length < 2) errs.push(tag + ': strips needs at least 2 slots');
      sl.forEach((x) => {
        if (!x.id || !x.label) errs.push(tag + ': every slot needs id and label');
        if (sids.has(x.id)) errs.push(tag + ': duplicate slot id ' + x.id);
        sids.add(x.id);
      });
      if (st.length < 2) errs.push(tag + ': strips needs at least 2 strips');
      st.forEach((x) => {
        if (!x.id) errs.push(tag + ': every strip needs an id');
        if (tids.has(x.id)) errs.push(tag + ': duplicate strip id ' + x.id);
        tids.add(x.id);
        if (!sids.has(x.slot)) errs.push(tag + ': strip ' + x.id + ' names unknown slot ' + x.slot);
        if (!(x.squares > 0)) errs.push(tag + ': strip ' + x.id + ' needs positive squares');
        if (!x.hint) errs.push(tag + ': strip ' + x.id + ' needs a hint');
        per[x.slot] = (per[x.slot] || 0) + 1;
      });
      sl.forEach((x) => { if ((per[x.id] || 0) !== 1) errs.push(tag + ': slot ' + x.id + ' needs exactly one strip'); });
    }
    if (r.kind === 'shadow') {
      const rows = r.rows || [], ids = new Set();
      if (rows.length < 3) errs.push(tag + ': shadow needs at least 3 rows');
      let px = -1, xyOk = true;
      rows.forEach((x) => {
        if (!x.id) errs.push(tag + ': every row needs an id');
        if (ids.has(x.id)) errs.push(tag + ': duplicate row id ' + x.id);
        ids.add(x.id);
        if (!x.time) errs.push(tag + ': row ' + x.id + ' needs a time');
        if (!(x.len > 0)) errs.push(tag + ': row ' + x.id + ' needs a positive length');
        if (!DIRS.includes(x.dir)) errs.push(tag + ': row ' + x.id + ' has unknown direction ' + x.dir);
        if (!x.sun || typeof x.sun.x !== 'number' || typeof x.sun.h !== 'number' || x.sun.x < 0 || x.sun.x > 1 || x.sun.h < 0 || x.sun.h > 1) { errs.push(tag + ': row ' + x.id + ' sun needs x and h from 0 to 1'); xyOk = false; }
        else { if (x.sun.x <= px) errs.push(tag + ': the Sun must move one way across the sky (sun.x must increase)'); px = x.sun.x; }
      });
      if (rows.length >= 3 && xyOk) {
        const hi = rows.map((x) => x.sun.h).indexOf(Math.max(...rows.map((x) => x.sun.h)));
        const lo = rows.map((x) => x.len).indexOf(Math.min(...rows.map((x) => x.len)));
        if (hi !== lo) errs.push(tag + ': the highest Sun must give the shortest shadow');
      }
    }
    if (r.kind === 'stars') {
      const ss = r.seasons || [], cd = r.cards || [], sids = new Set(), cids = new Set(), per = {};
      if (ss.length < 2) errs.push(tag + ': stars needs at least 2 seasons');
      ss.forEach((x) => {
        if (!x.id || !x.label || !x.months) errs.push(tag + ': every season needs id, label and months');
        if (sids.has(x.id)) errs.push(tag + ': duplicate season id ' + x.id);
        sids.add(x.id);
      });
      if (cd.length < 3) errs.push(tag + ': stars needs at least 3 cards');
      cd.forEach((x) => {
        if (!x.id) errs.push(tag + ': every card needs an id');
        if (cids.has(x.id)) errs.push(tag + ': duplicate card id ' + x.id);
        cids.add(x.id);
        if (!x.name || !x.hint || !x.why) errs.push(tag + ': card ' + x.id + ' needs name, hint and why');
        if (!sids.has(x.season)) errs.push(tag + ': card ' + x.id + ' names unknown season ' + x.season);
        per[x.season] = (per[x.season] || 0) + 1;
      });
      ss.forEach((x) => { if ((per[x.id] || 0) < 1) errs.push(tag + ': season ' + x.id + ' has no cards'); });
    }
    if (r.kind === 'gravity') {
      const sp = r.spots || [], ids = new Set();
      if (sp.length < 3) errs.push(tag + ': gravity needs at least 3 spots');
      sp.forEach((x, j) => {
        if (!x.id || !x.label) errs.push(tag + ': every spot needs id and label');
        if (ids.has(x.id)) errs.push(tag + ': duplicate spot id ' + x.id);
        ids.add(x.id);
        if (typeof x.deg !== 'number' || x.deg < 0 || x.deg >= 360) errs.push(tag + ': spot ' + x.id + ' needs deg from 0 up to 360');
        choicesOk(x.choices, tag + ' spot ' + (j + 1));
      });
    }
  });
  return errs;
}

/* Deterministic order for a set of ids, from a text seed (same shuffle as Big Sort). */
function k5SkyOrder(ids, seed) {
  let h = 2166136261;
  for (const ch of String(seed)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  const rnd = () => { h = (h + 0x6D2B79F5) | 0; let t = Math.imul(h ^ (h >>> 15), 1 | h); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const a = ids.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function k5GraphSky(host, cfg) {
  if (!host || host.shadowRoot) return;
  const root = host.attachShadow({ mode: 'open' });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  root.innerHTML = '<style>' +
    ':host{display:block}' +
    '.box{background:var(--surface);border:1.5px solid var(--line);border-radius:14px;padding:16px;color:var(--ink);font-family:var(--font-body,system-ui,sans-serif)}' +
    '.top{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;justify-content:space-between;margin-bottom:6px}' +
    '.top b{font-size:1.05rem}.prog{color:var(--muted);font-size:.9rem}' +
    '.q{margin:4px 0 10px;font-size:1.05rem;font-weight:700}.step{margin:10px 0 6px;font-weight:700}' +
    '.row{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0;align-items:center}' +
    '.opt{font:inherit;color:inherit;display:flex;align-items:center;gap:8px;padding:8px 12px;min-height:44px;border-radius:10px;border:1.5px solid var(--line);background:var(--surface);cursor:pointer;text-align:left}' +
    '.opt:hover{border-color:var(--beam)}.opt[disabled]{opacity:.65;cursor:default}.opt.right{border-color:var(--green)}' +
    '.opt[aria-pressed="true"]{outline:3px solid var(--beam);outline-offset:1px}.opt.nope{border-color:var(--red)}' +
    'button:focus-visible{outline:3px solid var(--beam);outline-offset:2px}' +
    '.scene{margin:8px 0}.scene svg{display:block;width:100%;max-width:360px;height:auto;border:1.5px solid var(--line);border-radius:12px;background:var(--surface-2)}' +
    '.log{border-collapse:collapse;margin:8px 0;font-size:.95rem}.log th,.log td{border:1.5px solid var(--line);padding:4px 10px;text-align:left}' +
    '.slots{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin:8px 0}' +
    '.slot{font:inherit;color:inherit;border:2px dashed var(--line);border-radius:12px;padding:10px;min-height:84px;background:var(--surface);cursor:pointer;text-align:center}' +
    '.slot:hover{border-color:var(--beam);background:var(--surface-2)}.slot.full{border-style:solid;border-color:var(--green)}' +
    '.bar{display:flex;flex-direction:column-reverse;gap:2px;align-items:center;margin:6px auto 2px;width:max-content}' +
    '.sq{width:14px;height:9px;border-radius:2px;background:var(--beam)}' +
    '.sqrow{display:flex;gap:2px;flex-wrap:wrap;max-width:120px}.sqrow i{width:9px;height:9px;border-radius:2px;background:var(--beam)}' +
    '.msg{margin-top:12px;min-height:2.6em;padding:8px 12px;border-radius:10px;background:var(--surface-2);font-size:1rem}' +
    '.msg.ok{border-left:5px solid var(--green)}.msg.bad{border-left:5px solid var(--red)}' +
    '.claim{margin:8px 0;padding:10px 12px;border-radius:10px;border:1.5px dashed var(--line);font-size:1.02rem}' +
    '.btn{font:inherit;font-weight:700;padding:9px 16px;min-height:44px;border-radius:10px;border:0;background:var(--beam);color:var(--beam-ink);cursor:pointer;margin-top:10px}' +
    '.btn[disabled]{opacity:.65;cursor:default}' +
    '.done{margin-top:12px;padding:12px;border-radius:10px;border:1.5px solid var(--green)}.done p{margin:6px 0}' +
    '.note{color:var(--muted);font-size:.88rem;margin-top:10px}' +
    '</style>' +
    '<div class="box"><div class="top"><b></b><span class="prog" aria-live="polite"></span></div>' +
    '<div class="main"></div><div class="msg" role="status" aria-live="polite"></div><div class="end"></div><p class="note"></p></div>';
  const q = (s) => root.querySelector(s);
  q('.top b').textContent = cfg.title;
  q('.note').textContent = cfg.note || '';
  const main = q('.main');
  const say = (kind, text) => { const m = q('.msg'); m.className = 'msg ' + kind; m.textContent = text; };
  const btn = (cls, html, fn) => { const b = document.createElement('button'); b.type = 'button'; b.className = cls; b.innerHTML = html; b.addEventListener('click', fn); return b; };
  const DIRV = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };
  const DIRW = { N: 'north', NE: 'northeast', E: 'east', SE: 'southeast', S: 'south', SW: 'southwest', W: 'west', NW: 'northwest' };
  const STARPTS = [[28, 18], [64, 40], [104, 14], [150, 32], [196, 16], [238, 44], [292, 20], [128, 58], [212, 64], [56, 66], [260, 84], [20, 90]];
  const SUNC = '#f2b01e', SUNS = '#c9820a', NIGHT = '#152238';

  let ri = 0, plays = 0, slips = 0;
  const found = [], arts = [];
  const seed = () => cfg.id + ':' + ri + ':' + plays;
  const sceneBox = () => { const d = document.createElement('div'); d.className = 'scene'; main.appendChild(d); return d; };

  function sunpath(r, onDone) {
    const stops = r.stops, n = stops.length, seen = new Set();
    let cur = -1;
    const box = sceneBox();
    const chips = document.createElement('div'); chips.className = 'row'; main.appendChild(chips);
    stops.forEach((st, i) => chips.appendChild(btn('opt', esc(st.label), () => show(i))));
    const turn = btn('btn', 'Turn Earth', () => show((cur + 1) % n)); main.appendChild(turn);
    const log = document.createElement('table'); log.className = 'log';
    log.innerHTML = '<caption class="step" style="text-align:left">Sky log</caption><tr><th>Time</th><th>Sun</th><th>Stars</th></tr>';
    main.appendChild(log);
    say('', 'Tap a time, or tap Turn Earth. The sky log fills as you go.');
    function show(i) {
      cur = i;
      const st = stops[i];
      const tone = st.tone || (st.sun === 'down' ? 'night' : 'day');
      const sky = tone === 'night' ? NIGHT : tone === 'sunset' ? '#eda06a' : '#8ecfe8';
      const ups = stops.map((s2, j) => (s2.sun === 'up' ? j : -1)).filter((j) => j >= 0);
      const f = ups.length > 1 ? ups.indexOf(i) / (ups.length - 1) : 0.5;
      let s = '<svg viewBox="0 0 320 170" role="img" aria-label="Sky at ' + esc(st.label) + ': the Sun is ' + st.sun + '; the stars are ' + st.stars + '.">';
      s += '<rect width="320" height="122" fill="' + sky + '"/><rect y="122" width="320" height="48" fill="var(--surface-2)"/><line x1="0" y1="122" x2="320" y2="122" stroke="var(--line)"/>';
      if (st.stars === 'out') s += STARPTS.map((p) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.6" fill="#fff"/>').join('');
      if (st.sun === 'up') s += '<circle cx="' + (50 + f * 220) + '" cy="' + (108 - Math.sin(Math.PI * f) * 78) + '" r="14" fill="' + SUNC + '" stroke="' + SUNS + '" stroke-width="2"/>';
      const rad = ((i / n) * 360 - 90) * Math.PI / 180, gx = 278, gy = 34, gr = 20;
      s += '<circle cx="' + gx + '" cy="' + gy + '" r="' + gr + '" fill="#5b93c9" stroke="var(--line)"/>' +
        '<path d="M ' + gx + ' ' + (gy - gr) + ' A ' + gr + ' ' + gr + ' 0 0 1 ' + gx + ' ' + (gy + gr) + ' Z" fill="#bcd9ef"/>' +
        '<circle cx="' + (gx + 12 * Math.cos(rad)) + '" cy="' + (gy + 12 * Math.sin(rad)) + '" r="3.4" fill="' + (tone === 'night' ? '#ffd75e' : '#c62f2f') + '"/>' +
        '<text x="' + gx + '" y="' + (gy + gr + 12) + '" font-size="9" text-anchor="middle" fill="' + (tone === 'night' ? '#dfe8f2' : '#17324a') + '">you on Earth</text>';
      box.innerHTML = s + '</svg>';
      if (seen.has(st.id)) { say('', st.label + ' is already in the log.'); return; }
      seen.add(st.id);
      const tr = document.createElement('tr');
      tr.innerHTML = '<td>' + esc(st.label) + '</td><td>Sun ' + st.sun + '</td><td>Stars ' + st.stars + '</td>';
      log.appendChild(tr);
      if (seen.size === n) {
        arts.push('Sky log - ' + stops.map((s2) => s2.label + ': Sun ' + s2.sun + ', stars ' + s2.stars).join('; ') + '.');
        say('ok', 'The log is full. Day and night repeat, and the stars are still there in the daytime.');
        turn.disabled = true;
        chips.querySelectorAll('button').forEach((b) => { b.disabled = true; });
        onDone();
      } else say('', st.label + ': Sun ' + st.sun + ', stars ' + st.stars + '. Logged.');
    }
  }

  function moonSVG(shape) {
    let over = '';
    if (shape === 'new') over = '<circle cx="12" cy="12" r="9.4" fill="var(--surface)"/>';
    if (shape === 'crescent') over = '<circle cx="7.2" cy="12" r="9" fill="var(--surface)"/>';
    if (shape === 'half') over = '<rect x="0" y="0" width="12" height="24" fill="var(--surface)"/>';
    if (shape === 'gibbous') over = '<circle cx="4.6" cy="12" r="8.8" fill="var(--surface)"/>';
    return '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#e6dfc3"/>' + over + '<circle cx="12" cy="12" r="10" fill="none" stroke="var(--line)" stroke-width="1.5"/></svg>';
  }

  function moon(r, onDone) {
    const cards = r.cards.slice().sort((a, b) => a.order - b.order);
    let next = 0;
    say('', 'Tap the Moon shapes in the order they come, from a thin curve to a round Moon.');
    const seq = document.createElement('div'); seq.className = 'row'; main.appendChild(seq);
    const tray = document.createElement('div'); tray.className = 'row'; main.appendChild(tray);
    k5SkyOrder(cards.map((c) => c.id), seed()).forEach((id) => {
      const c = cards.find((x) => x.id === id);
      tray.appendChild(btn('opt', moonSVG(c.shape) + '<span>' + esc(c.label) + '</span>', (e) => {
        const b = e.currentTarget;
        if (c.order === next) {
          b.disabled = true; b.classList.add('right');
          const sp = document.createElement('span'); sp.setAttribute('role', 'img'); sp.setAttribute('aria-label', c.label);
          sp.innerHTML = moonSVG(c.shape); seq.appendChild(sp);
          next++;
          if (next === cards.length) {
            arts.push('Moon order - ' + cards.map((x) => x.label).join(', then ') + '.');
            say('ok', 'Yes. The lit part grows night by night.');
            onDone();
          } else say('ok', 'Yes. What comes next?');
        } else {
          slips++;
          b.classList.add('nope'); setTimeout(() => b.classList.remove('nope'), 900);
          say('bad', 'Not next. ' + c.hint);
        }
      }));
    });
  }

  function matcher(r, onDone, o) {
    let picked = null;
    const left = new Set(o.items.map((x) => x.id));
    o.targets.forEach((t) => { t.placed = []; });
    const tray = document.createElement('div'); tray.className = 'row'; main.appendChild(tray);
    const grid = document.createElement('div'); grid.className = 'slots'; main.appendChild(grid);
    say('', o.start);
    k5SkyOrder(o.items.map((x) => x.id), seed()).forEach((id) => {
      const it = o.items.find((x) => x.id === id);
      const b = btn('opt', o.cardHTML(it), () => {
        picked = id;
        tray.querySelectorAll('.opt').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.id === id)));
      });
      b.dataset.id = id; b.setAttribute('aria-pressed', 'false');
      tray.appendChild(b);
    });
    o.targets.forEach((t) => {
      const el = btn('slot', o.targetHTML(t), () => {
        if (!picked) { say('', 'Tap a card first, then tap where it belongs.'); return; }
        const it = o.items.find((x) => x.id === picked);
        const cb = tray.querySelector('[data-id="' + picked + '"]');
        if (it[o.key] === t.id) {
          t.placed.push(it); left.delete(picked); cb.remove(); picked = null;
          el.classList.add('full');
          el.innerHTML = o.targetHTML(t) + t.placed.map((x) => o.fillHTML(t, x)).join('');
          say('ok', o.placedMsg(it, t));
          if (!left.size) { tray.remove(); arts.push(o.artifact()); onDone(); }
        } else {
          slips++;
          cb.classList.add('nope'); setTimeout(() => cb.classList.remove('nope'), 900);
          say('bad', o.hintMsg(it));
        }
      });
      grid.appendChild(el);
    });
  }

  function strips(r, onDone) {
    matcher(r, onDone, {
      items: r.strips, targets: r.slots, key: 'slot',
      start: 'Tap a strip, then tap the month it matches. Count the squares.',
      cardHTML: (it) => '<span class="sqrow" aria-hidden="true">' + '<i></i>'.repeat(it.squares) + '</span><span>' + it.squares + ' squares</span>',
      targetHTML: (t) => '<b>' + esc(t.label) + '</b>',
      fillHTML: (t, it) => '<span class="bar">' + '<span class="sq"></span>'.repeat(it.squares) + '</span><span>' + it.squares + ' squares of daylight</span>',
      placedMsg: (it, t) => it.fact || ('Yes. ' + t.label + ': about ' + it.squares + ' squares of daylight.'),
      hintMsg: (it) => 'Not that month. ' + it.hint,
      artifact: () => 'Daylight strips - ' + r.slots.map((s2) => { const it = r.strips.find((x) => x.slot === s2.id); return s2.label + ': about ' + it.squares + ' squares'; }).join('; ') + '.'
    });
  }

  function starSVG(dots) {
    const pts = dots || [[10, 4], [6, 10], [14, 10], [10, 16]];
    return '<svg viewBox="0 0 20 20" width="34" height="34" aria-hidden="true"><rect width="20" height="20" rx="4" fill="' + NIGHT + '"/>' +
      '<polyline points="' + pts.map((p) => p[0] + ',' + p[1]).join(' ') + '" fill="none" stroke="#7d9cc4" stroke-width=".6"/>' +
      pts.map((p) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1" fill="#fff"/>').join('') + '</svg>';
  }

  function stars(r, onDone) {
    matcher(r, onDone, {
      items: r.cards, targets: r.seasons, key: 'season',
      start: 'Tap a star card, then tap the season when it is often seen at night. The pictures are rough sketches, not star maps.',
      cardHTML: (it) => starSVG(it.dots) + '<span>' + esc(it.name) + '</span>',
      targetHTML: (t) => '<b>' + esc(t.label) + '</b><br><span>' + esc(t.months) + '</span>',
      fillHTML: (t, it) => '<div class="row" style="justify-content:center">' + starSVG(it.dots) + '<span>' + esc(it.name) + '</span></div>',
      placedMsg: (it) => 'Yes. ' + it.why,
      hintMsg: (it) => 'Not that season. ' + it.hint,
      artifact: () => 'Star chart - ' + r.seasons.map((s2) => { const it = r.cards.find((x) => x.season === s2.id); return s2.label + ' (' + s2.months + '): ' + it.name; }).join('; ') + '.'
    });
  }

  function shadow(r, onDone) {
    const rows = r.rows, seen = new Set();
    const max = Math.max(...rows.map((x) => x.len));
    const box = sceneBox();
    const chips = document.createElement('div'); chips.className = 'row'; main.appendChild(chips);
    rows.forEach((row) => chips.appendChild(btn('opt', esc(row.time), () => show(row))));
    const log = document.createElement('table'); log.className = 'log';
    log.innerHTML = '<caption class="step" style="text-align:left">' + esc(r.logTitle || 'Shadow table') + '</caption><tr><th>Time</th><th>Length</th><th>Points</th></tr>';
    main.appendChild(log);
    say('', 'Tap a time to move the Sun. Watch the stick and the shadow map.');
    function show(row) {
      const d = DIRV[row.dir] * Math.PI / 180;
      const L = 8 + (row.len / max) * 52;
      const cx = 250, cy = 80, cr = 70;
      const sd = (DIRV[row.dir] + 180) * Math.PI / 180;   /* the Sun is opposite the shadow */
      const sx = 14 + row.sun.x * 118, sy = 112 - row.sun.h * 88;
      const sw = row.sun.x < 0.45 ? 1 : row.sun.x > 0.55 ? -1 : 0;   /* side view: the shadow points away from the Sun; at midday it points at you */
      const sl = 6 + (row.len / max) * 40;
      let s = '<svg viewBox="0 0 340 170" role="img" aria-label="At ' + esc(row.time) + ' the shadow is ' + row.len + ' cm, pointing ' + DIRW[row.dir] + '.">';
      s += '<rect x="4" y="4" width="150" height="118" rx="8" fill="#8ecfe8"/><rect x="4" y="122" width="150" height="30" fill="var(--surface-2)"/>' +
        '<circle cx="' + sx + '" cy="' + sy + '" r="10" fill="' + SUNC + '" stroke="' + SUNS + '" stroke-width="2"/>' +
        '<line x1="79" y1="122" x2="79" y2="96" stroke="var(--ink)" stroke-width="3"/>' +
        '<line x1="79" y1="122" x2="' + (79 + sw * sl) + '" y2="' + (122 + (sw ? 0 : sl * 0.55)) + '" stroke="var(--ink)" stroke-width="3" opacity=".45"/>' +
        '<text x="79" y="166" font-size="9" text-anchor="middle" fill="var(--ink)">sky, looking south</text>';
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + cr + '" fill="var(--surface)" stroke="var(--line)"/>' +
        '<text x="' + cx + '" y="20" font-size="10" text-anchor="middle" fill="var(--ink)">N</text>' +
        '<text x="' + (cx + 64) + '" y="' + (cy + 4) + '" font-size="10" text-anchor="middle" fill="var(--ink)">E</text>' +
        '<text x="' + cx + '" y="' + (cy + 66) + '" font-size="10" text-anchor="middle" fill="var(--ink)">S</text>' +
        '<text x="' + (cx - 64) + '" y="' + (cy + 4) + '" font-size="10" text-anchor="middle" fill="var(--ink)">W</text>' +
        '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + L * Math.sin(d)) + '" y2="' + (cy - L * Math.cos(d)) + '" stroke="var(--ink)" stroke-width="4" opacity=".5"/>' +
        '<circle cx="' + (cx + 62 * Math.sin(sd)) + '" cy="' + (cy - 62 * Math.cos(sd)) + '" r="8" fill="' + SUNC + '" stroke="' + SUNS + '" stroke-width="2"/>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="4" fill="var(--ink)"/>' +
        '<text x="' + cx + '" y="' + (cy + 24) + '" font-size="10" text-anchor="middle" fill="var(--ink)">shadow ' + row.len + ' cm</text>' +
        '<text x="' + cx + '" y="166" font-size="9" text-anchor="middle" fill="var(--ink)">shadow map, looking down</text>';
      box.innerHTML = s + '</svg>';
      if (seen.has(row.id)) { say('', row.time + ' is already in the table.'); return; }
      seen.add(row.id);
      const tr = document.createElement('tr');
      tr.innerHTML = '<td>' + esc(row.time) + '</td><td>' + row.len + ' cm</td><td>' + DIRW[row.dir] + '</td>';
      log.appendChild(tr);
      if (seen.size === rows.length) {
        arts.push('Shadow table - ' + rows.map((x) => x.time + ': ' + x.len + ' cm ' + DIRW[x.dir]).join('; ') + '.');
        say('ok', 'All shadows are recorded. Long, shorter, shortest, longer, long - and always away from the Sun.');
        chips.querySelectorAll('button').forEach((b) => { b.disabled = true; });
        onDone();
      } else say('', row.time + ': ' + row.len + ' cm, pointing ' + DIRW[row.dir] + '. Logged.');
    }
  }

  function gravity(r, onDone) {
    const cx = 170, cy = 90, gr = 58, mr = gr + 17;
    let done = 0;
    const box = sceneBox();
    let s = '<svg viewBox="0 0 340 190" role="img" aria-label="A globe with spots on it. At each spot, pick which way down points.">';
    s += '<defs><marker id="ah" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="var(--beam)"/></marker></defs>';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + gr + '" fill="#5b93c9" stroke="var(--line)" stroke-width="2"/>' +
      '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + gr + '" ry="' + gr * 0.42 + '" fill="none" stroke="#bcd9ef" opacity=".7"/>' +
      '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + gr * 0.42 + '" ry="' + gr + '" fill="none" stroke="#bcd9ef" opacity=".7"/>';
    r.spots.forEach((sp, i) => {
      const a = sp.deg * Math.PI / 180;
      const x = cx + gr * Math.sin(a), y = cy - gr * Math.cos(a);
      s += '<circle id="sp' + i + '" cx="' + x + '" cy="' + y + '" r="5.5" fill="#ffd75e" stroke="var(--ink)" stroke-width="1.5"/>' +
        '<line id="ar' + i + '" x1="' + x + '" y1="' + y + '" x2="' + x + '" y2="' + y + '" stroke="var(--beam)" stroke-width="3" marker-end="url(#ah)" opacity="0"/>' +
        '<text x="' + (cx + mr * Math.sin(a)) + '" y="' + (cy - mr * Math.cos(a) + 4) + '" font-size="11" font-weight="700" text-anchor="middle" fill="var(--ink)">' + (i + 1) + '</text>';
    });
    box.innerHTML = s + '</svg>';
    say('', 'At each numbered spot, pick the arrow that shows down.');
    r.spots.forEach((sp, i) => {
      choose(k5SkyOrder(sp.choices.map((c, j) => j), seed()).map((j) => sp.choices[j]), 'Spot ' + (i + 1) + ' - ' + sp.label + ': which way is down?', () => {
        done++;
        const a = sp.deg * Math.PI / 180;
        const x = cx + gr * Math.sin(a), y = cy - gr * Math.cos(a);
        const inx = cx - x, iny = cy - y, il = Math.hypot(inx, iny) || 1;
        const ar = box.querySelector('#ar' + i);
        ar.setAttribute('x2', x + (inx / il) * 22);
        ar.setAttribute('y2', y + (iny / il) * 22);
        ar.setAttribute('opacity', '1');
        if (done === r.spots.length) {
          arts.push('Gravity arrows - at all ' + r.spots.length + ' spots, down points toward the center of Earth.');
          onDone();
        }
      });
    });
  }

  function choose(list, lead, onRight) {
    const s = document.createElement('p'); s.className = 'step'; s.textContent = lead; main.appendChild(s);
    const row = document.createElement('div'); row.className = 'row'; main.appendChild(row);
    list.forEach((c) => {
      row.appendChild(btn('opt', esc(c.label), (e) => {
        if (!c.ok) { slips++; say('bad', c.why); return; }
        row.querySelectorAll('button').forEach((b) => { b.disabled = true; });
        e.currentTarget.classList.add('right');
        say('ok', c.why);
        onRight(c, e);
      }));
    });
  }

  function stepRead(r, i, onDone) {
    if (i >= r.reads.length) { stepClaim(r, 0, [], onDone); return; }
    choose(k5SkyOrder(r.reads[i].choices.map((c, j) => j), seed()).map((j) => r.reads[i].choices[j]), r.reads[i].q, () => stepRead(r, i + 1, onDone));
  }

  function stepClaim(r, i, parts, onDone) {
    if (i === 0) { const s = document.createElement('p'); s.className = 'step'; s.textContent = 'Build your claim.'; main.appendChild(s); }
    if (i >= r.claim.length) { onDone(parts); return; }
    choose(k5SkyOrder(r.claim[i].choices.map((c, j) => j), seed()).map((j) => r.claim[i].choices[j]), r.claim[i].lead + ' ...', (c) => {
      parts.push(r.claim[i].lead + ' ' + c.label);
      let el = main.querySelector('.claim');
      if (!el) { el = document.createElement('div'); el.className = 'claim'; main.appendChild(el); }
      el.textContent = parts.join('. ') + (i + 1 >= r.claim.length ? '.' : '');
      stepClaim(r, i + 1, parts, onDone);
    });
  }

  function round() {
    const r = cfg.rounds[ri];
    q('.prog').textContent = 'Sky ' + (ri + 1) + ' of ' + cfg.rounds.length;
    q('.end').innerHTML = '';
    main.innerHTML = '';
    const head = document.createElement('p'); head.className = 'q'; head.textContent = r.question; main.appendChild(head);
    const after = () => stepRead(r, 0, (parts) => finishRound(parts));
    if (r.kind === 'sunpath') sunpath(r, after);
    else if (r.kind === 'moon') moon(r, after);
    else if (r.kind === 'strips') strips(r, after);
    else if (r.kind === 'shadow') shadow(r, after);
    else if (r.kind === 'stars') stars(r, after);
    else gravity(r, after);
  }

  function finishRound(parts) {
    found.push(parts.join('. ') + '.');
    if (ri + 1 < cfg.rounds.length) {
      q('.end').appendChild(btn('btn', 'Next sky', () => { ri++; round(); }));
      return;
    }
    const d = document.createElement('div'); d.className = 'done';
    d.innerHTML = '<b>What you found</b>' +
      arts.map((a) => '<p>' + esc(a) + '</p>').join('') +
      found.map((f) => '<p>' + esc(f) + '</p>').join('') +
      '<p>' + esc(cfg.summary) + '</p>' +
      (slips ? '<p>Worth a second look: ' + slips + ' choice' + (slips > 1 ? 's' : '') + ' needed another try.</p>' : '<p>Every choice was right on the first try.</p>');
    d.appendChild(btn('btn', 'Play again', () => { plays++; ri = 0; slips = 0; found.length = 0; arts.length = 0; round(); }));
    q('.end').appendChild(d);
    q('.prog').textContent = 'Done';
  }
  round();
}

if (typeof module !== 'undefined') module.exports = { k5GraphSkyValidate, k5SkyOrder };
