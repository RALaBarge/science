/* Fair Test Lab: choose the ONE thing to change, hold the rest, run the trials, read the graph, build a claim.
   One config drives one activity; it holds one or more rounds.
   Round: {question, factors:[{id,icon,label,held,why}], change, measure, better:"low"|"high", good:[strings],
           options:[{id,icon,label,trials:[3 numbers or words]}],
           reads:[{q, choices:[{label, ok, why}]}], claim:[{lead, choices:[{label, ok, why}]}]}
   factors: the things a tester could change. `change` is the id of the one the question is about.
   `held` is the setting that stays the same when it is not the one changed; `why` is shown if a student picks it.
   Trial values are the unit's own data (numbers draw a bar, words draw a chip; `good` lists the words that count as a good result).
   Pure helpers (k5FairValidate, k5FairBest) are separate from the DOM code so tests can run them in Node. */

function k5FairValidate(cfg) {
  const errs = [];
  if (!cfg || !cfg.id) errs.push('config needs an id');
  if (!cfg.title || !cfg.intro || !cfg.summary) errs.push('config needs title, intro and summary');
  if (!Array.isArray(cfg.rounds) || !cfg.rounds.length) { errs.push('config needs rounds'); return errs; }
  const choicesOk = (list, tag) => {
    if (!Array.isArray(list) || list.length < 2) { errs.push(tag + ': needs at least 2 choices'); return; }
    if (list.filter((c) => c.ok).length !== 1) errs.push(tag + ': needs exactly one correct choice');
    list.forEach((c) => { if (!c.label || !c.why) errs.push(tag + ': every choice needs label and why'); });
  };
  cfg.rounds.forEach((r, i) => {
    const tag = 'round ' + (i + 1);
    if (!r.question || !r.measure) errs.push(tag + ': needs question and measure');
    const f = r.factors || [];
    if (f.length < 3) errs.push(tag + ': needs at least 3 factors');
    if (!f.some((x) => x.id === r.change)) errs.push(tag + ': change must name a factor');
    f.forEach((x) => { if (!x.label || (x.id !== r.change && (!x.held || !x.why))) errs.push(tag + ': factor ' + x.id + ' needs label, held and why'); });
    const o = r.options || [];
    if (o.length < 2) errs.push(tag + ': needs at least 2 options');
    o.forEach((x) => {
      if (!x.label || !Array.isArray(x.trials) || x.trials.length < 2) errs.push(tag + ': option ' + x.id + ' needs label and 2+ trials');
      if (x.trials && x.trials.length !== o[0].trials.length) errs.push(tag + ': options need the same number of trials');
    });
    if (r.better !== 'low' && r.better !== 'high') errs.push(tag + ': better must be low or high');
    const numeric = o.every((x) => (x.trials || []).every((t) => typeof t === 'number'));
    if (!numeric && !(r.good && r.good.length)) errs.push(tag + ': word results need a good list');
    (r.reads || []).forEach((x, j) => choicesOk(x.choices, tag + ' read ' + (j + 1)));
    if (!(r.reads || []).length) errs.push(tag + ': needs at least one read question');
    if ((r.claim || []).length < 3) errs.push(tag + ': claim needs 3 parts');
    (r.claim || []).forEach((x, j) => choicesOk(x.choices, tag + ' claim ' + (j + 1)));
  });
  return errs;
}

/* Typical (middle) result for an option: the median of numbers, or how many good words. */
function k5FairScore(r, o) {
  if (o.trials.every((t) => typeof t === 'number')) { const s = o.trials.slice().sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; }
  return o.trials.filter((t) => r.good.includes(t)).length;
}
/* Ids of the best option(s) by that score; a tie returns more than one. */
function k5FairBest(r) {
  const numeric = r.options.every((o) => o.trials.every((t) => typeof t === 'number'));
  const low = numeric && r.better === 'low';
  const sc = r.options.map((o) => [o.id, k5FairScore(r, o)]);
  const best = low ? Math.min(...sc.map((x) => x[1])) : Math.max(...sc.map((x) => x[1]));
  return sc.filter((x) => x[1] === best).map((x) => x[0]);
}

function k5FairTest(host, cfg) {
  if (!host || host.shadowRoot) return;
  const root = host.attachShadow({ mode: 'open' });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  root.innerHTML = '<style>' +
    ':host{display:block}' +
    '.box{background:var(--surface);border:1.5px solid var(--line);border-radius:14px;padding:16px;color:var(--ink);font-family:var(--font-body,system-ui,sans-serif)}' +
    '.top{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;justify-content:space-between;margin-bottom:6px}' +
    '.top b{font-size:1.05rem}.prog{color:var(--muted);font-size:.9rem}' +
    '.q{margin:4px 0 10px;font-size:1.05rem;font-weight:700}.step{margin:10px 0 6px;font-weight:700}' +
    '.row{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0}' +
    '.opt{font:inherit;color:inherit;display:flex;align-items:center;gap:8px;padding:8px 12px;min-height:44px;border-radius:10px;border:1.5px solid var(--line);background:var(--surface);cursor:pointer;text-align:left}' +
    '.opt:hover{border-color:var(--beam)}.opt .ic{font-size:1.4rem;line-height:1}' +
    '.opt[disabled]{opacity:.6;cursor:default}.opt.right{border-color:var(--green)}' +
    '.held{margin:6px 0;padding:8px 12px;border-radius:10px;background:var(--surface-2);font-size:.95rem}' +
    '.held div{margin:2px 0}' +
    '.lab{border:1.5px solid var(--line);border-radius:10px;padding:8px 10px;margin:8px 0}' +
    '.lab h4{margin:0 0 6px;font-size:1rem}' +
    '.trial{display:flex;align-items:center;gap:8px;margin:4px 0;font-size:.92rem}' +
    '.trial .n{width:4.2em;color:var(--muted);flex:none}' +
    '.bar{height:20px;border-radius:5px;background:var(--beam);min-width:6px;transition:width .35s}' +
    '.val{font-weight:700;min-width:2em}' +
    '.chip{padding:2px 10px;border-radius:999px;border:1.5px solid var(--line);font-weight:700}' +
    '.chip.g{border-color:var(--green)}.chip.x{border-color:var(--red)}' +
    '.msg{margin-top:12px;min-height:2.6em;padding:8px 12px;border-radius:10px;background:var(--surface-2);font-size:1rem}' +
    '.msg.ok{border-left:5px solid var(--green)}.msg.bad{border-left:5px solid var(--red)}' +
    '.claim{margin:8px 0;padding:10px 12px;border-radius:10px;border:1.5px dashed var(--line);font-size:1.02rem}' +
    '.btn{font:inherit;font-weight:700;padding:9px 16px;min-height:44px;border-radius:10px;border:0;background:var(--beam);color:var(--beam-ink);cursor:pointer;margin-top:10px}' +
    '.done{margin-top:12px;padding:12px;border-radius:10px;border:1.5px solid var(--green)}' +
    '.done p{margin:6px 0}.note{color:var(--muted);font-size:.88rem;margin-top:10px}' +
    '@media (prefers-reduced-motion:reduce){.bar{transition:none}}' +
    '</style><div class="box"><div class="top"><b></b><span class="prog" aria-live="polite"></span></div>' +
    '<div class="main"></div><div class="msg" role="status" aria-live="polite"></div><div class="end"></div>' +
    '<p class="note"></p></div>';
  const q = (s) => root.querySelector(s);
  q('.top b').textContent = cfg.title;
  q('.note').textContent = cfg.note || '';
  const main = q('.main');
  const say = (kind, text) => { const m = q('.msg'); m.className = 'msg ' + kind; m.textContent = text; };
  const btn = (cls, html, fn) => { const b = document.createElement('button'); b.type = 'button'; b.className = cls; b.innerHTML = html; b.addEventListener('click', fn); return b; };

  let ri = 0, slips = 0;
  const found = [];

  function round() {
    const r = cfg.rounds[ri];
    q('.prog').textContent = 'Test ' + (ri + 1) + ' of ' + cfg.rounds.length;
    q('.end').innerHTML = '';
    main.innerHTML = '';
    const head = document.createElement('p'); head.className = 'q'; head.textContent = r.question; main.appendChild(head);
    say('', 'Step 1. A fair test changes just ONE thing.');
    stepPick(r);
  }

  function stepPick(r) {
    const s = document.createElement('p'); s.className = 'step'; s.textContent = 'Which ONE thing will you change?'; main.appendChild(s);
    const row = document.createElement('div'); row.className = 'row'; main.appendChild(row);
    r.factors.forEach((f) => {
      row.appendChild(btn('opt', '<span class="ic" aria-hidden="true">' + esc(f.icon || '') + '</span><span>' + esc(f.label) + '</span>', () => {
        if (f.id !== r.change) { slips++; say('bad', f.why); return; }
        row.querySelectorAll('button').forEach((b) => { b.disabled = true; });
        const held = document.createElement('div'); held.className = 'held';
        held.innerHTML = '<b>Held the same:</b>' + r.factors.filter((x) => x.id !== r.change).map((x) => '<div>' + esc((x.icon || '') + ' ' + x.held) + '</div>').join('');
        main.appendChild(held);
        say('ok', 'Yes. Change ' + f.label.toLowerCase() + ' and keep everything else the same, so any difference comes from that one thing.');
        stepRun(r);
      }));
    });
  }

  function stepRun(r) {
    const s = document.createElement('p'); s.className = 'step'; s.textContent = 'Run the trials. ' + r.measure; main.appendChild(s);
    const numeric = r.options.every((o) => o.trials.every((t) => typeof t === 'number'));
    const max = numeric ? Math.max(...r.options.flatMap((o) => o.trials)) || 1 : 1;
    const need = r.options.length * r.options[0].trials.length;
    let ran = 0;
    const done = {};
    r.options.forEach((o) => {
      done[o.id] = 0;
      const box = document.createElement('div'); box.className = 'lab';
      box.innerHTML = '<h4>' + esc((o.icon || '') + ' ' + o.label) + '</h4><div class="trials"></div>';
      const go = btn('opt', 'Run next trial', () => {
        const n = done[o.id]; if (n >= o.trials.length) return;
        const v = o.trials[n]; done[o.id]++; ran++;
        const t = document.createElement('div'); t.className = 'trial';
        const good = !numeric && r.good.includes(v);
        t.innerHTML = '<span class="n">Trial ' + (n + 1) + '</span>' + (numeric
          ? '<span class="bar" style="width:' + Math.round((v / max) * 60 + 1) + '%"></span><span class="val">' + esc(v) + '</span>'
          : '<span class="chip ' + (good ? 'g' : 'x') + '">' + esc(v) + '</span>');
        box.querySelector('.trials').appendChild(t);
        if (done[o.id] >= o.trials.length) { go.disabled = true; go.textContent = 'All trials done'; }
        else go.textContent = 'Run next trial (' + (done[o.id] + 1) + ' of ' + o.trials.length + ')';
        if (ran >= need) { say('ok', 'All trials are in. Same test, same way, every time.'); stepRead(r, 0); }
      });
      go.textContent = 'Run next trial (1 of ' + o.trials.length + ')';
      box.appendChild(go);
      main.appendChild(box);
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
        onRight(c);
      }));
    });
  }

  function stepRead(r, i) {
    if (i >= r.reads.length) { stepClaim(r, 0, []); return; }
    choose(r.reads[i].choices, r.reads[i].q, () => stepRead(r, i + 1));
  }

  function stepClaim(r, i, parts) {
    if (i === 0) { const s = document.createElement('p'); s.className = 'step'; s.textContent = 'Build your claim.'; main.appendChild(s); }
    if (i >= r.claim.length) { finishRound(r, parts); return; }
    choose(r.claim[i].choices, r.claim[i].lead + ' ...', (c) => {
      parts.push(r.claim[i].lead + ' ' + c.label);
      let el = main.querySelector('.claim');
      if (!el) { el = document.createElement('div'); el.className = 'claim'; main.appendChild(el); }
      el.textContent = parts.join('. ') + (i + 1 >= r.claim.length ? '.' : '');
      stepClaim(r, i + 1, parts);
    });
  }

  function finishRound(r, parts) {
    found.push(parts.join('. ') + '.');
    if (ri + 1 < cfg.rounds.length) {
      q('.end').appendChild(btn('btn', 'Next test', () => { ri++; round(); }));
      return;
    }
    const d = document.createElement('div'); d.className = 'done';
    d.innerHTML = '<b>What you found</b>' + found.map((f) => '<p>' + esc(f) + '</p>').join('') + '<p>' + esc(cfg.summary) + '</p>' +
      (slips ? '<p>Worth a second look: ' + slips + ' choice' + (slips > 1 ? 's' : '') + ' needed another try.</p>' : '<p>Every choice was right on the first try.</p>');
    d.appendChild(btn('btn', 'Play again', () => { ri = 0; slips = 0; found.length = 0; round(); }));
    q('.end').appendChild(d);
    q('.prog').textContent = 'Done';
  }
  round();
}

if (typeof module !== 'undefined') module.exports = { k5FairValidate, k5FairBest, k5FairScore };
