/* Big Sort: tap (or drag) each card into the bin where it belongs.
   One config drives one activity. Stages run in order; each stage is a set of cards and bins.
   Cards: {id, icon, label, bin, why, hint}. Bins: {id, icon, label}.
   Pure helpers (k5Validate, k5Order) are separate from the DOM code so tests can run them in Node. */

function k5Validate(cfg) {
  const errs = [];
  if (!cfg || !cfg.id) errs.push('config needs an id');
  if (!cfg.title || !cfg.intro) errs.push('config needs title and intro');
  if (!Array.isArray(cfg.stages) || !cfg.stages.length) { errs.push('config needs stages'); return errs; }
  cfg.stages.forEach((st, si) => {
    const tag = 'stage ' + (si + 1);
    const binIds = new Set((st.bins || []).map((b) => b.id));
    if (!st.prompt) errs.push(tag + ': missing prompt');
    if ((st.bins || []).length < 2) errs.push(tag + ': needs at least 2 bins');
    if (binIds.size !== (st.bins || []).length) errs.push(tag + ': duplicate bin ids');
    const seen = new Set();
    const per = {};
    (st.cards || []).forEach((c) => {
      if (seen.has(c.id)) errs.push(tag + ': duplicate card id ' + c.id);
      seen.add(c.id);
      if (!binIds.has(c.bin)) errs.push(tag + ': card ' + c.id + ' names unknown bin ' + c.bin);
      if (!c.label || !c.why || !c.hint) errs.push(tag + ': card ' + c.id + ' needs label, why and hint');
      per[c.bin] = (per[c.bin] || 0) + 1;
    });
    (st.bins || []).forEach((b) => { if ((per[b.id] || 0) < 1) errs.push(tag + ': bin ' + b.id + ' has no cards'); });
    if ((st.cards || []).length < 4) errs.push(tag + ': needs at least 4 cards');
  });
  if (!cfg.summary) errs.push('config needs a summary');
  return errs;
}

/* Deterministic order for a stage, from a text seed. Returns card ids. */
function k5Order(ids, seed) {
  let h = 2166136261;
  for (const ch of String(seed)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  const rnd = () => { h = (h + 0x6D2B79F5) | 0; let t = Math.imul(h ^ (h >>> 15), 1 | h); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const a = ids.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function k5BigSort(host, cfg) {
  if (!host || host.shadowRoot) return;
  const root = host.attachShadow({ mode: 'open' });
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  root.innerHTML = '<style>' +
    ':host{display:block}' +
    '.box{background:var(--surface);border:1.5px solid var(--line);border-radius:14px;padding:16px;color:var(--ink);font-family:var(--font-body,system-ui,sans-serif)}' +
    '.top{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;justify-content:space-between;margin-bottom:6px}' +
    '.top b{font-size:1.05rem}.prog{color:var(--muted);font-size:.9rem}' +
    '.prompt{margin:4px 0 12px;font-size:1.05rem}' +
    '.tray{display:flex;flex-wrap:wrap;gap:8px;min-height:56px;margin-bottom:12px;padding:10px;border-radius:10px;background:var(--surface-2)}' +
    '.card{font:inherit;color:inherit;display:flex;align-items:center;gap:8px;padding:8px 12px;min-height:44px;border-radius:10px;border:1.5px solid var(--line);background:var(--surface);cursor:grab;text-align:left}' +
    '.card .ic{font-size:1.5rem;line-height:1}' +
    '.card[aria-pressed="true"]{outline:3px solid var(--beam);outline-offset:1px}' +
    '.card.nope{border-color:var(--red)}' +
    '.card.nope:not(.still){animation:sh .3s}' +
    '@keyframes sh{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}' +
    '.bins{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}' +
    '.bin{font:inherit;color:inherit;text-align:left;border:2px dashed var(--line);border-radius:12px;padding:10px;min-height:96px;background:var(--surface);cursor:pointer}' +
    '.bin:hover,.bin.over{border-color:var(--beam);background:var(--surface-2)}' +
    '.bin h4{margin:0 0 6px;font-size:1rem}' +
    '.bin ul{margin:0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:6px}' +
    '.bin li{background:var(--surface-2);border-radius:8px;padding:3px 8px;font-size:.92rem;border:1.5px solid var(--green)}' +
    '.msg{margin-top:12px;min-height:2.6em;padding:8px 12px;border-radius:10px;background:var(--surface-2);font-size:1rem}' +
    '.msg.ok{border-left:5px solid var(--green)}.msg.bad{border-left:5px solid var(--red)}' +
    '.btn{font:inherit;font-weight:700;padding:9px 16px;min-height:44px;border-radius:10px;border:0;background:var(--beam);color:var(--beam-ink);cursor:pointer;margin-top:10px}' +
    '.done{margin-top:12px;padding:12px;border-radius:10px;border:1.5px solid var(--green)}' +
    '.done p{margin:6px 0}.note{color:var(--muted);font-size:.88rem;margin-top:10px}' +
    '@media (prefers-reduced-motion:reduce){.card.nope{animation:none}}' +
    '</style><div class="box"><div class="top"><b></b><span class="prog" aria-live="polite"></span></div>' +
    '<p class="prompt"></p><div class="tray" role="group" aria-label="Cards to sort"></div>' +
    '<div class="bins"></div><div class="msg" role="status" aria-live="polite"></div><div class="end"></div>' +
    '<p class="note"></p></div>';
  const q = (s) => root.querySelector(s);
  q('.top b').textContent = cfg.title;
  q('.note').textContent = cfg.note || '';

  let round = 0, stage = 0, picked = null, misses = {}, rec = [];
  const placed = {};

  function start(seedExtra) {
    stage = 0; picked = null; misses = {}; rec = []; round++;
    q('.end').innerHTML = '';
    begin(seedExtra);
  }
  function begin() {
    const st = cfg.stages[stage];
    for (const k in placed) delete placed[k];
    picked = null;
    q('.prog').textContent = 'Round ' + (stage + 1) + ' of ' + cfg.stages.length;
    q('.prompt').textContent = st.prompt;
    q('.msg').className = 'msg'; q('.msg').textContent = 'Tap a card, then tap its bin.';
    const order = k5Order(st.cards.map((c) => c.id), cfg.id + ':' + stage + ':' + round);
    const tray = q('.tray'); tray.innerHTML = '';
    order.forEach((id) => {
      const c = st.cards.find((x) => x.id === id);
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'card'; b.draggable = true; b.dataset.id = id;
      b.setAttribute('aria-pressed', 'false');
      b.innerHTML = '<span class="ic" aria-hidden="true">' + esc(c.icon || '') + '</span><span>' + esc(c.label) + '</span>';
      b.addEventListener('click', () => pick(id));
      b.addEventListener('dragstart', (e) => { pick(id); try { e.dataTransfer.setData('text/plain', id); } catch (x) {} });
      tray.appendChild(b);
    });
    const bins = q('.bins'); bins.innerHTML = '';
    st.bins.forEach((bn) => {
      const el = document.createElement('button');
      el.type = 'button'; el.className = 'bin'; el.dataset.bin = bn.id;
      el.innerHTML = '<h4>' + esc((bn.icon ? bn.icon + ' ' : '') + bn.label) + '</h4><ul></ul>';
      el.addEventListener('click', () => drop(bn.id));
      el.addEventListener('dragover', (e) => { e.preventDefault(); el.classList.add('over'); });
      el.addEventListener('dragleave', () => el.classList.remove('over'));
      el.addEventListener('drop', (e) => { e.preventDefault(); el.classList.remove('over'); drop(bn.id); });
      bins.appendChild(el);
    });
  }
  function pick(id) {
    picked = id;
    root.querySelectorAll('.card').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.id === id)));
  }
  function say(kind, text) { const m = q('.msg'); m.className = 'msg ' + kind; m.textContent = text; }
  function drop(binId) {
    if (!picked) { say('', 'Tap a card first.'); return; }
    const st = cfg.stages[stage];
    const c = st.cards.find((x) => x.id === picked);
    const el = root.querySelector('.card[data-id="' + picked + '"]');
    if (c.bin === binId) {
      const li = document.createElement('li'); li.textContent = (c.icon ? c.icon + ' ' : '') + c.label;
      root.querySelector('.bin[data-bin="' + binId + '"] ul').appendChild(li);
      el.remove(); placed[c.id] = binId;
      rec.push({ stage, id: c.id, tries: (misses[stage + ':' + c.id] || 0) + 1 });
      say('ok', 'Yes. ' + c.why);
      picked = null;
      if (Object.keys(placed).length === st.cards.length) finishStage();
    } else {
      misses[stage + ':' + c.id] = (misses[stage + ':' + c.id] || 0) + 1;
      el.classList.add('nope'); if (reduce) el.classList.add('still');
      setTimeout(() => el.classList.remove('nope'), 900);
      say('bad', 'Not that bin. Think about this: ' + c.hint);
    }
  }
  function finishStage() {
    if (stage + 1 < cfg.stages.length) {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.textContent = 'Next round';
      b.addEventListener('click', () => { stage++; q('.end').innerHTML = ''; begin(); });
      q('.end').innerHTML = ''; q('.end').appendChild(b);
      return;
    }
    const hard = rec.filter((r) => r.tries > 1).map((r) => cfg.stages[r.stage].cards.find((c) => c.id === r.id).label);
    const d = document.createElement('div'); d.className = 'done';
    d.innerHTML = '<b>What you found</b><p>' + esc(cfg.summary) + '</p>' +
      (hard.length ? '<p>Worth a second look: ' + esc(hard.join('; ')) + '.</p>' : '<p>Every card went in the right bin on the first try.</p>');
    const b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.textContent = 'Play again';
    b.addEventListener('click', () => start());
    d.appendChild(b);
    q('.end').innerHTML = ''; q('.end').appendChild(d);
    q('.prog').textContent = 'Done';
  }
  start();
}

if (typeof module !== 'undefined') module.exports = { k5Validate, k5Order };
