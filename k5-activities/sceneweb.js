/* sceneweb.js
   Scene & Web: tap things in a scene to notice them (each tap adds a tally mark), then pick
   which questions can be TESTED by comparing. A testable question names one thing to change
   and one thing to measure.
   Config: {id, engine:"sceneweb", title, intro, note, summary,
     scene:{w, h, shapes:[{type:"rect"|"circle"|"ellipse", ...numbers, fill}],   // the picture, drawn behind the things
            items:[{id, icon, label, say, notices:{groupId: binId}}]},   // things to tap, shown as big buttons under the picture
     noticeGroups:[{id, label, bins:[{id, icon, label}]}],
     questions:[{q, choices:[{label, ok, why}]}]}  // exactly one ok per question
   Pure helpers (k5SceneWebValidate, k5SceneOrder, k5SceneTally) are separate from the DOM
   code so tests can run them in Node. */

function k5SceneWebValidate(cfg) {
  const errs = [];
  if (!cfg || typeof cfg !== 'object') return ['config missing'];
  if (!cfg.id) errs.push('config needs an id');
  if (!cfg.title || !cfg.intro) errs.push('config needs title and intro');
  if (!cfg.note) errs.push('config needs a note (this is a model; point to the real activity)');
  if (!cfg.summary) errs.push('config needs a summary');
  const sc = cfg.scene || {};
  if (typeof sc.w !== 'number' || typeof sc.h !== 'number' || sc.w <= 0 || sc.h <= 0) errs.push('scene needs numeric w and h');
  const groups = cfg.noticeGroups;
  if (!Array.isArray(groups) || !groups.length) { errs.push('config needs noticeGroups'); return errs; }
  const gids = new Set();
  groups.forEach((g) => {
    if (gids.has(g.id)) errs.push('duplicate group id ' + g.id);
    gids.add(g.id);
    if (!g.label) errs.push('group ' + g.id + ' needs a label');
    const bids = new Set((g.bins || []).map((b) => b.id));
    if ((g.bins || []).length < 2) errs.push('group ' + g.id + ': needs at least 2 bins');
    if (bids.size !== (g.bins || []).length) errs.push('group ' + g.id + ': duplicate bin ids');
    (g.bins || []).forEach((b) => { if (!b.label) errs.push('group ' + g.id + ' bin ' + b.id + ' needs a label'); });
  });
  const items = sc.items;
  if (!Array.isArray(items) || items.length < 4) errs.push('scene needs at least 4 items');
  const seen = new Set();
  (items || []).forEach((it) => {
    const tag = 'item ' + it.id;
    if (seen.has(it.id)) errs.push('duplicate item id ' + it.id);
    seen.add(it.id);
    if (!it.label || !it.say) errs.push(tag + ' needs label and say');
    const n = it.notices || {};
    groups.forEach((g) => {
      const v = n[g.id];
      if (v === undefined) errs.push(tag + ' has no notice for group ' + g.id);
      else if (!(g.bins || []).some((b) => b.id === v)) errs.push(tag + ' names unknown bin ' + v + ' in group ' + g.id);
    });
  });
  groups.forEach((g) => {
    (g.bins || []).forEach((b) => {
      if (!(items || []).some((it) => (it.notices || {})[g.id] === b.id)) errs.push('group ' + g.id + ' bin ' + b.id + ' has no items');
    });
  });
  (sc.shapes || []).forEach((s, i) => {
    const tag = 'shape ' + (i + 1);
    const need = (ks) => ks.forEach((k) => { if (typeof s[k] !== 'number') errs.push(tag + ' (' + s.type + ') needs number ' + k); });
    if (s.type === 'rect') need(['x', 'y', 'width', 'height']);
    else if (s.type === 'circle') need(['cx', 'cy', 'r']);
    else if (s.type === 'ellipse') need(['cx', 'cy', 'rx', 'ry']);
    else errs.push(tag + ': unknown type ' + s.type);
    if (!s.fill) errs.push(tag + ' needs a fill');
  });
  const qs = cfg.questions;
  if (!Array.isArray(qs) || !qs.length) { errs.push('config needs questions'); return errs; }
  qs.forEach((qu, i) => {
    const tag = 'question ' + (i + 1);
    if (!qu.q) errs.push(tag + ': missing q');
    const cs = qu.choices || [];
    if (cs.length < 2) errs.push(tag + ': needs at least 2 choices');
    if (cs.filter((c) => c.ok).length !== 1) errs.push(tag + ': needs exactly one testable choice');
    cs.forEach((c) => { if (!c.label || !c.why) errs.push(tag + ': every choice needs label and why'); });
  });
  return errs;
}

/* Deterministic order from a text seed (same shuffle as Big Sort). Returns the given ids reordered. */
function k5SceneOrder(ids, seed) {
  let h = 2166136261;
  for (const ch of String(seed)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  const rnd = () => { h = (h + 0x6D2B79F5) | 0; let t = Math.imul(h ^ (h >>> 15), 1 | h); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const a = ids.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/* Full tally for a config: {groupId: {binId: count}}. Tests compare this to the unit's own data. */
function k5SceneTally(cfg) {
  const t = {};
  (cfg.noticeGroups || []).forEach((g) => { t[g.id] = {}; (g.bins || []).forEach((b) => { t[g.id][b.id] = 0; }); });
  (((cfg || {}).scene || {}).items || []).forEach((it) => {
    const n = it.notices || {};
    for (const gid in n) { if (t[gid] && t[gid][n[gid]] !== undefined) t[gid][n[gid]]++; }
  });
  return t;
}

function k5SceneWeb(host, cfg) {
  if (!host || host.shadowRoot) return;
  const root = host.attachShadow({ mode: 'open' });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const W = cfg.scene.w, H = cfg.scene.h, groups = cfg.noticeGroups, items = cfg.scene.items;
  root.innerHTML = '<style>' +
    ':host{display:block}' +
    '.box{background:var(--surface);border:1.5px solid var(--line);border-radius:14px;padding:16px;color:var(--ink);font-family:var(--font-body,system-ui,sans-serif)}' +
    '.top{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;justify-content:space-between;margin-bottom:6px}' +
    '.top b{font-size:1.05rem}.prog{color:var(--muted);font-size:.9rem}' +
    '.scene{border:1.5px solid var(--line);border-radius:12px;overflow:hidden;margin-bottom:10px}.items{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}' +
    '.scene svg{display:block;width:100%;height:auto}' +
    '.it{font:inherit;color:inherit;display:flex;flex-direction:column;align-items:center;gap:1px;padding:6px 8px;min-width:76px;min-height:60px;border-radius:12px;border:2px solid var(--line);background:var(--surface);cursor:pointer}' +
    '.it .ic{font-size:1.5rem;line-height:1.1}.it .lb{font-size:.8rem;line-height:1.15;text-align:center}' +
    '.it:hover{border-color:var(--beam)}.it.seen{border-color:var(--green);background:var(--surface-2)}' +
    '.tally{display:flex;flex-direction:column;gap:6px;margin:4px 0}' +
    '.tg{display:flex;flex-wrap:wrap;gap:6px;align-items:center}' +
    '.tgl{font-weight:700;font-size:.92rem;margin-right:2px}' +
    '.tc{border:1.5px solid var(--line);border-radius:10px;padding:5px 10px;background:var(--surface-2);font-size:.95rem}' +
    '.marks{color:var(--beam);letter-spacing:2px}' +
    '.q{margin:10px 0 6px;font-size:1.05rem;font-weight:700}' +
    '.row{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0}' +
    '.opt{font:inherit;color:inherit;padding:9px 14px;min-height:44px;border-radius:10px;border:1.5px solid var(--line);background:var(--surface);cursor:pointer;text-align:left}' +
    '.opt:hover{border-color:var(--beam)}.opt[disabled]{opacity:.65;cursor:default}.opt.right{border-color:var(--green)}' +
    '.msg{margin-top:12px;min-height:2.6em;padding:8px 12px;border-radius:10px;background:var(--surface-2);font-size:1rem}' +
    '.msg.ok{border-left:5px solid var(--green)}.msg.bad{border-left:5px solid var(--red)}' +
    '.btn{font:inherit;font-weight:700;padding:9px 16px;min-height:44px;border-radius:10px;border:0;background:var(--beam);color:var(--beam-ink);cursor:pointer;margin-top:10px}' +
    '.done{margin-top:12px;padding:12px;border-radius:10px;border:1.5px solid var(--green)}' +
    '.done p{margin:6px 0}.done ul{margin:6px 0;padding-left:1.3em}.note{color:var(--muted);font-size:.88rem;margin-top:10px}' +
    '.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}' +
    '.it:focus-visible,.opt:focus-visible,.btn:focus-visible{outline:3px solid var(--beam);outline-offset:2px}' +
    '</style><div class="box"><div class="top"><b></b><span class="prog" aria-live="polite"></span></div>' +
    '<div class="scene"></div><div class="items" role="group" aria-label="Things to notice"></div><div class="tally"></div><div class="ask"></div>' +
    '<div class="msg" role="status" aria-live="polite"></div><div class="end"></div><p class="note"></p></div>';
  const q = (s) => root.querySelector(s);
  q('.top b').textContent = cfg.title;
  q('.note').textContent = cfg.note || '';
  const say = (kind, text) => { const m = q('.msg'); m.className = 'msg ' + kind; m.textContent = text; };
  const shapeSvg = (s) => s.type === 'rect'
    ? '<rect x="' + s.x + '" y="' + s.y + '" width="' + s.width + '" height="' + s.height + '" fill="' + esc(s.fill) + '"/>'
    : s.type === 'circle'
      ? '<circle cx="' + s.cx + '" cy="' + s.cy + '" r="' + s.r + '" fill="' + esc(s.fill) + '"/>'
      : '<ellipse cx="' + s.cx + '" cy="' + s.cy + '" rx="' + s.rx + '" ry="' + s.ry + '" fill="' + esc(s.fill) + '"/>';
  const svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true" focusable="false">' + (cfg.scene.shapes || []).map(shapeSvg).join('') + '</svg>';

  let round = 0, misses = 0, noticed, counts, found, qOrder;
  const freshCounts = () => { const c = {}; groups.forEach((g) => { c[g.id] = {}; g.bins.forEach((b) => { c[g.id][b.id] = 0; }); }); return c; };

  function run() {
    round++; misses = 0; noticed = new Set(); counts = freshCounts(); found = [];
    q('.ask').innerHTML = ''; q('.end').innerHTML = '';
    q('.scene').innerHTML = svg;
    const sc = q('.items'); sc.innerHTML = '';
    items.forEach((it) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'it';
      b.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-label', 'Notice: ' + it.label);
      b.innerHTML = '<span class="ic" aria-hidden="true">' + esc(it.icon || '') + '</span><span class="lb">' + esc(it.label) + '</span>';
      b.addEventListener('click', () => notice(it, b));
      sc.appendChild(b);
    });
    buildTally();
    q('.prog').textContent = 'Notice: 0 of ' + items.length;
    say('', 'Tap things in the picture. Say what you see.');
  }

  function notice(it, btn) {
    if (!noticed.has(it.id)) {
      noticed.add(it.id);
      for (const gid in it.notices) counts[gid][it.notices[gid]]++;
      btn.classList.add('seen');
      btn.setAttribute('aria-pressed', 'true');
      buildTally();
      q('.prog').textContent = 'Notice: ' + noticed.size + ' of ' + items.length;
      if (noticed.size === items.length) { say('ok', it.say + ' You noticed all ' + items.length + '! Your tally is data. Now pick a question we can test.'); ask(); }
      else say('ok', it.say);
    } else say('', it.say);
  }

  function buildTally() {
    const t = q('.tally'); t.innerHTML = '';
    groups.forEach((g) => {
      const row = document.createElement('div'); row.className = 'tg';
      const lead = document.createElement('span'); lead.className = 'tgl'; lead.textContent = g.label; row.appendChild(lead);
      g.bins.forEach((b) => {
        const n = counts[g.id][b.id];
        const chip = document.createElement('span'); chip.className = 'tc';
        chip.innerHTML = '<span aria-hidden="true">' + esc((b.icon ? b.icon + ' ' : '') + b.label) + ' <b class="marks">' + ('|'.repeat(n) || '—') + '</b> ' + n + '</span><span class="sr">' + n + ' ' + esc(b.label) + '</span>';
        row.appendChild(chip);
      });
      t.appendChild(row);
    });
  }

  function ask() {
    qOrder = k5SceneOrder(cfg.questions.map((_, i) => String(i)), cfg.id + ':qs:' + round).map(Number);
    renderQ(0);
  }

  function renderQ(step) {
    const qu = cfg.questions[qOrder[step]];
    q('.prog').textContent = 'Question ' + (step + 1) + ' of ' + cfg.questions.length;
    const ask = q('.ask'); ask.innerHTML = '';
    const p = document.createElement('p'); p.className = 'q'; p.textContent = qu.q; ask.appendChild(p);
    const row = document.createElement('div'); row.className = 'row'; ask.appendChild(row);
    k5SceneOrder(qu.choices.map((_, i) => String(i)), cfg.id + ':q' + qOrder[step] + ':' + round).forEach((ci) => {
      const c = qu.choices[+ci];
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'opt'; b.textContent = c.label;
      b.addEventListener('click', () => {
        if (!c.ok) { misses++; say('bad', c.why); return; }
        row.querySelectorAll('button').forEach((x) => { x.disabled = true; });
        b.classList.add('right');
        found.push(c.label);
        if (step + 1 < cfg.questions.length) { say('ok', c.why); renderQ(step + 1); }
        else { say('ok', c.why); finish(); }
      });
      row.appendChild(b);
    });
  }

  function finish() {
    q('.prog').textContent = 'Done';
    q('.ask').innerHTML = '';
    const d = document.createElement('div'); d.className = 'done';
    let html = '<b>What you found</b><p>You noticed ' + items.length + ' things.</p>';
    groups.forEach((g) => {
      html += '<p>' + esc(g.label) + ' ' + g.bins.map((b) => esc(b.label) + ': ' + counts[g.id][b.id]).join(', ') + '.</p>';
    });
    html += '<p>Questions you can test:</p><ul>' + found.map((f) => '<li>' + esc(f) + '</li>').join('') + '</ul><p>' + esc(cfg.summary) + '</p>';
    html += misses ? '<p>Worth a second look: ' + misses + ' choice' + (misses > 1 ? 's' : '') + ' needed another try.</p>' : '<p>Every choice was right on the first try.</p>';
    d.innerHTML = html;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.textContent = 'Play again';
    b.addEventListener('click', run);
    d.appendChild(b);
    q('.end').appendChild(d);
  }
  run();
}

if (typeof module !== 'undefined') module.exports = { k5SceneWebValidate, k5SceneOrder, k5SceneTally };
