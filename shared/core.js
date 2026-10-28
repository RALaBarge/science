// Science Arcade shared core.
// Every game loads questions.js, then this file, then its own script. Load it at the end of <body>.
// Exposes window.Arcade (A below). Nothing in here knows about any particular game.
(function () {
  'use strict';
  const A = (window.Arcade = {});
  const $ = (A.$ = (id) => document.getElementById(id));
  A.reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // ===================== seeded randomness =====================
  // Same text in, same numbers out, on every machine. Map codes and daily puzzles depend on it.
  function hashStr(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  }
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  A.hashStr = hashStr;
  A.rngFor = (s) => mulberry32(hashStr(s));
  A.pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
  A.int = (rng, lo, hi) => lo + Math.floor(rng() * (hi - lo + 1)); // inclusive

  const WORDS_A = ['COMET', 'NOVA', 'ORBIT', 'LUNA', 'QUARK', 'PULSAR', 'NEBULA', 'ROCKET', 'METEOR', 'ZENITH', 'SOLAR', 'CRATER', 'HALO', 'VORTEX', 'COSMIC', 'ASTRO'];
  const WORDS_B = ['FROG', 'MOOSE', 'OTTER', 'WOMBAT', 'BADGER', 'PICKLE', 'WAFFLE', 'TACO', 'NOODLE', 'LLAMA', 'GECKO', 'MUFFIN', 'PANDA', 'YETI', 'TOAST', 'NARWHAL'];
  A.codeFrom = (rng) => A.pick(rng, WORDS_A) + '-' + A.pick(rng, WORDS_B) + '-' + String(Math.floor(rng() * 90) + 10);
  A.randomCode = () => A.codeFrom(Math.random);
  A.todayKey = () => {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };
  // Each game passes its own salt so the daily puzzles differ between games.
  A.dailyCode = (salt) => A.codeFrom(A.rngFor('daily|' + (salt || '') + '|' + A.todayKey()));
  A.cleanCode = (s) => String(s || '').toUpperCase().replace(/[^A-Z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
  A.shuffled = (arr, rng) => {
    const r = rng || Math.random, a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  };

  // ===================== deterministic math =====================
  // The JavaScript spec makes + − × ÷ and Math.sqrt give identical results in every browser, but lets
  // Math.sin, Math.cos, Math.hypot and ** differ in the last digit. Anything that decides what happens
  // in a game uses these instead, so a code or a replay plays out the same on any machine.
  const HALF_PI = 1.5707963267948966;
  A.DEG = Math.PI / 180;
  const sc = (A.sc = { sin: 0, cos: 1 }); // sincos writes here instead of allocating
  A.sincos = function (x) {
    const k = Math.round(x / HALF_PI), r = x - k * HALF_PI, r2 = r * r;
    // Taylor series on [−π/4, π/4]; the next terms are below double precision.
    const s = r * (1 + r2 * (-1 / 6 + r2 * (1 / 120 + r2 * (-1 / 5040 + r2 * (1 / 362880 + r2 * (-1 / 39916800 + r2 * (1 / 6227020800 + r2 * (-1 / 1307674368000))))))));
    const c = 1 + r2 * (-1 / 2 + r2 * (1 / 24 + r2 * (-1 / 720 + r2 * (1 / 40320 + r2 * (-1 / 3628800 + r2 * (1 / 479001600 + r2 * (-1 / 87178291200 + r2 * (1 / 20922789888000))))))));
    const q = ((k % 4) + 4) % 4;
    if (q === 0) { sc.sin = s; sc.cos = c; } else if (q === 1) { sc.sin = c; sc.cos = -s; } else if (q === 2) { sc.sin = -s; sc.cos = -c; } else { sc.sin = -c; sc.cos = s; }
  };
  A.dist = (dx, dy) => Math.sqrt(dx * dx + dy * dy);
  A.clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

  // ===================== work slicing =====================
  // Heavy searches (fairness checks, solvers, CPU players) are written as generators that yield often.
  // runSliced runs them in ~12 ms slices so the page keeps drawing and answering clicks.
  // A MessageChannel hands control back immediately; setTimeout(0) adds a forced delay per slice.
  const sliceQueue = [], sliceChannel = new MessageChannel();
  sliceChannel.port1.onmessage = () => sliceQueue.shift()();
  const soon = (fn) => { sliceQueue.push(fn); sliceChannel.port2.postMessage(0); };
  A.runSliced = function (gen, done, cancelled) {
    cancelled = cancelled || (() => false);
    (function slice() {
      if (cancelled()) return;
      const t0 = performance.now();
      let r;
      while (!(r = gen.next()).done) {
        if (performance.now() - t0 > 12) { soon(slice); return; }
      }
      done(r.value);
    })();
  };
  A.runNow = (gen) => { let r; while (!(r = gen.next()).done); return r.value; }; // for tests

  // ===================== frame loop =====================
  // Draw only when something changed. Games call wake() after any change; while animating() is true
  // the loop keeps running, otherwise it sleeps and the page costs almost no CPU.
  A.loop = function (frame, animating) {
    let id = 0;
    const tick = (t) => { id = 0; frame(t); if (animating()) wake(); };
    const wake = () => { if (!id) id = requestAnimationFrame(tick); };
    return { wake };
  };
  // Size a canvas to its CSS width at device resolution (capped at 2×). Returns the scale info.
  A.fitCanvas = function (canvas, logicalW, logicalH) {
    const cssW = canvas.parentElement.clientWidth;
    const cssH = cssW * (logicalH / logicalW);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.style.height = cssH + 'px';
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    return { dpr, scale: cssW / logicalW, k: dpr * (cssW / logicalW) };
  };
  A.toLogical = function (canvas, e, logicalW, logicalH) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width * logicalW, y: (e.clientY - r.top) / r.height * logicalH };
  };

  // ===================== shared UI =====================
  document.body.insertAdjacentHTML('beforeend', `
<div id="toast" hidden></div>
<div class="quiz" id="quiz" hidden>
  <div class="quiz-card" role="dialog" aria-modal="true" aria-labelledby="quiz-q">
    <div class="quiz-head"><strong id="quiz-who"></strong><span id="quiz-count"></span></div>
    <p class="quiz-intro" id="quiz-intro"></p>
    <div class="quiz-topic" id="quiz-topic"></div>
    <div class="quiz-score" id="quiz-score" hidden></div>
    <h2 id="quiz-q"></h2>
    <div class="quiz-choices" id="quiz-choices"></div>
    <p class="quiz-explain" id="quiz-explain" hidden></p>
    <button id="quiz-next" type="button" hidden>Next question</button>
  </div>
</div>
<div class="quiz" id="facts" hidden>
  <div class="quiz-card" id="facts-card" role="dialog" aria-modal="true" aria-labelledby="facts-title">
    <div class="quiz-topic" id="facts-kicker">Science facts</div>
    <h2 id="facts-title"></h2>
    <p class="quiz-intro" id="facts-sub"></p>
    <ul class="facts-list" id="facts-list"></ul>
    <div class="facts-actions">
      <button id="facts-more" type="button">3 more facts</button>
      <button id="facts-close" type="button">Back to the game</button>
    </div>
  </div>
</div>`);

  A.quiet = () => A.demo.active; // no toasts or badges while the demo plays
  A.toast = function (msg) {
    if (A.quiet()) return;
    const t = $('toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(A.toast._t);
    A.toast._t = setTimeout(() => { t.hidden = true; }, 2600);
  };

  A.makeBadges = function (el) {
    const set = new Set();
    const render = () => {
      el.innerHTML = '';
      set.forEach((b) => { const c = document.createElement('span'); c.className = 'chip gold'; c.textContent = b; el.appendChild(c); });
    };
    return {
      award(name) { if (A.quiet() || set.has(name)) return false; set.add(name); A.toast('Badge earned: ' + name); render(); return true; },
      has: (name) => set.has(name),
      list: () => Array.from(set),
      load(names) { (names || []).forEach((n) => set.add(n)); render(); },
      clear() { set.clear(); render(); }
    };
  };

  A.modalOpen = () => A.quiz.isOpen || A.facts.isOpen;
  A.listeners = []; // games can subscribe to modal open/close to refresh their HUD
  A.onModal = (fn) => A.listeners.push(fn);
  const modalChanged = () => A.listeners.forEach((fn) => fn());

  // ===================== quiz =====================
  // Every game uses the same bank and the same quiz screen. A game opens a quiz with a few options and
  // gets the number of right answers back in onClose. Every answer is logged in A.answers, tagged with
  // the game and topic, ready for a scoreboard to store per student.
  const BANK = Array.isArray(window.QUESTION_BANK) ? window.QUESTION_BANK : [];
  A.answers = [];
  const decks = {};
  function drawFrom(key, idxs) {
    if (!decks[key] || !decks[key].length) decks[key] = A.shuffled(idxs);
    return decks[key].pop();
  }
  const allIdx = BANK.map((_, i) => i);
  function drawQuestion(topics) {
    let i;
    // When a game names topics, about half its questions come from them; the rest review everything.
    if (topics && topics.length && Math.random() < 0.5) {
      const idxs = allIdx.filter((k) => topics.includes(BANK[k][0]));
      i = idxs.length ? drawFrom('t:' + topics.join(','), idxs) : drawFrom('all', allIdx);
    } else i = drawFrom('all', allIdx);
    const [topic, q, choices, explain] = BANK[i];
    const order = A.shuffled([0, 1, 2, 3]);
    return { topic, q, explain, choices: order.map((k) => choices[k]), answer: order.indexOf(0) };
  }

  const quiz = (A.quiz = { isOpen: false });
  let qo = null, items = [], qi = 0, correct = 0, answered = false, finished = false;

  // opts: { game, player, color, title, intro, count, topics,
  //         lastLabel, resultScore(n, count), resultText(n, count), doneLabel(n), singleLabel(right), onClose(n) }
  // count 1 = a single unlock question: no results screen, singleLabel(right) names the button.
  quiz.open = function (opts) {
    qo = Object.assign({ count: 4, color: '#ffd166', title: 'Quiz', intro: '', game: '', player: '' }, opts);
    if (!BANK.length) { if (qo.onClose) qo.onClose(qo.count); return; }
    items = Array.from({ length: qo.count }, () => drawQuestion(qo.topics));
    qi = 0; correct = 0; finished = false;
    quiz.isOpen = true;
    $('quiz').querySelector('.quiz-card').style.setProperty('--qc', qo.color);
    $('quiz-who').textContent = qo.title;
    $('quiz-intro').textContent = qo.intro;
    $('quiz').hidden = false;
    renderQuestion();
    modalChanged();
  };
  // The practice quiz every game links to: four questions, nothing at stake.
  quiz.practice = function (opts) {
    quiz.open(Object.assign({
      title: 'Practice quiz',
      intro: '4 science questions for practice. Nothing is on the line.',
      player: 'practice',
      lastLabel: 'See your score',
      resultScore: (n, c) => n + '/' + c,
      resultText: (n, c) => (n === c ? 'Perfect score!' : n + ' of ' + c + ' right. Try another set any time.'),
      doneLabel: () => 'Done'
    }, opts));
  };

  function renderQuestion() {
    const it = items[qi];
    answered = false;
    $('quiz-count').textContent = qo.count === 1 ? 'One question' : 'Question ' + (qi + 1) + ' of ' + qo.count + ' · ' + correct + ' right';
    $('quiz-intro').hidden = qi > 0 || !qo.intro;
    $('quiz-topic').textContent = it.topic;
    $('quiz-topic').hidden = false;
    $('quiz-score').hidden = true;
    $('quiz-q').textContent = it.q;
    const box = $('quiz-choices');
    box.innerHTML = '';
    it.choices.forEach((c, k) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'choice';
      b.innerHTML = '<span class="k">' + (k + 1) + '</span><span></span>';
      b.lastChild.textContent = c;
      b.addEventListener('click', () => answer(k));
      box.appendChild(b);
    });
    $('quiz-explain').hidden = true;
    $('quiz-next').hidden = true;
    box.firstChild.focus({ preventScroll: true });
  }

  function answer(k) {
    if (answered || finished) return;
    answered = true;
    const it = items[qi];
    const right = k === it.answer;
    if (right) correct++;
    A.answers.push({ game: qo.game, player: qo.player, topic: it.topic, question: it.q, correct: right, at: Date.now() });
    const btns = $('quiz-choices').children;
    for (let j = 0; j < btns.length; j++) {
      btns[j].disabled = true;
      if (j === it.answer) btns[j].classList.add('right');
      else if (j === k) btns[j].classList.add('wrong');
    }
    const ex = $('quiz-explain');
    ex.innerHTML = right ? '<b>Right.</b> ' : '<b class="miss">Not quite.</b> ';
    ex.appendChild(document.createTextNode(it.explain));
    ex.hidden = false;
    const nb = $('quiz-next');
    if (qo.count === 1) {
      finished = true;
      nb.textContent = qo.singleLabel ? qo.singleLabel(right) : 'Continue';
    } else {
      $('quiz-count').textContent = 'Question ' + (qi + 1) + ' of ' + qo.count + ' · ' + correct + ' right';
      nb.textContent = qi < qo.count - 1 ? 'Next question' : (qo.lastLabel || 'See your result');
    }
    nb.hidden = false;
    nb.focus({ preventScroll: true });
  }

  function next() {
    if (finished) { close(); return; }
    if (!answered) return;
    if (qi < qo.count - 1) { qi++; renderQuestion(); return; }
    finished = true;
    $('quiz-intro').hidden = true;
    $('quiz-topic').hidden = true;
    $('quiz-count').textContent = qo.count + ' of ' + qo.count + ' answered';
    $('quiz-score').textContent = qo.resultScore ? qo.resultScore(correct, qo.count) : correct + '/' + qo.count;
    $('quiz-score').hidden = false;
    $('quiz-q').textContent = qo.resultText ? qo.resultText(correct, qo.count) : correct + ' of ' + qo.count + ' right.';
    $('quiz-choices').innerHTML = '';
    $('quiz-explain').hidden = true;
    const nb = $('quiz-next');
    nb.textContent = qo.doneLabel ? qo.doneLabel(correct) : 'Continue';
    nb.focus({ preventScroll: true });
  }

  function close() {
    $('quiz').hidden = true;
    quiz.isOpen = false;
    const cb = qo.onClose, n = correct;
    modalChanged();
    if (cb) cb(n);
  }
  quiz.close = function () { if (quiz.isOpen) { $('quiz').hidden = true; quiz.isOpen = false; modalChanged(); } }; // abandon, no callback
  $('quiz-next').addEventListener('click', next);
  quiz.answer = answer; // for keyboard and tests

  // ===================== facts pop-up =====================
  const facts = (A.facts = { isOpen: false });
  let factDeck = [], factOpts = null;
  // opts: { title, sub, kicker, facts: [...], color, onClose }
  facts.show = function (opts, more) {
    if (!more) { factOpts = opts; factDeck = []; }
    const all = factOpts.facts || [];
    if (!all.length) return;
    if (factDeck.length < 3) factDeck = A.shuffled(all);
    facts.isOpen = true;
    $('facts-card').style.setProperty('--qc', factOpts.color || '#ffd166');
    $('facts-kicker').textContent = factOpts.kicker || 'Science facts';
    $('facts-title').textContent = factOpts.title;
    $('facts-sub').textContent = factOpts.sub || '';
    $('facts-sub').hidden = !factOpts.sub;
    const list = $('facts-list');
    list.innerHTML = '';
    factDeck.splice(0, 3).forEach((f) => { const li = document.createElement('li'); li.textContent = f; list.appendChild(li); });
    $('facts-more').hidden = all.length <= 3;
    $('facts').hidden = false;
    $('facts-close').focus({ preventScroll: true });
    modalChanged();
  };
  facts.close = function () {
    if (!facts.isOpen) return;
    $('facts').hidden = true;
    facts.isOpen = false;
    modalChanged();
    if (factOpts && factOpts.onClose) factOpts.onClose();
  };
  $('facts-more').addEventListener('click', () => facts.show(null, true));
  $('facts-close').addEventListener('click', facts.close);

  // While a quiz or facts card is open, it owns the keyboard: 1–4 answer, Enter continues, Escape closes facts.
  window.addEventListener('keydown', (e) => {
    if (quiz.isOpen) {
      if (/^[1-4]$/.test(e.key)) { answer(+e.key - 1); e.preventDefault(); }
      else if (e.key === 'Enter' && !$('quiz-next').hidden && document.activeElement !== $('quiz-next')) { next(); e.preventDefault(); }
      if (e.key !== 'Tab') e.stopImmediatePropagation();
    } else if (facts.isOpen) {
      if (e.key === 'Escape') { facts.close(); e.preventDefault(); }
      if (e.key !== 'Tab') e.stopImmediatePropagation();
    }
  }, true);

  // ===================== demo mode =====================
  // On load each game plays itself. The first click or key press ends the demo and starts a real game.
  // The game supplies onExit (start a real game). Clicks on [data-demo-keep] elements (like the
  // practice quiz link) don't end the demo, and neither does anything while a quiz is open.
  const demo = (A.demo = { active: false });
  let demoOpts = null;
  demo.start = function (opts) {
    demoOpts = opts;
    demo.active = true;
    let tag = $('demo-tag');
    if (!tag) {
      tag = document.createElement('div');
      tag.id = 'demo-tag';
      tag.className = 'demo-tag';
      opts.stage.appendChild(tag);
    }
    tag.textContent = opts.text || 'Demo · click anywhere or press any key to play';
    tag.hidden = false;
  };
  demo.stop = function () {
    demo.active = false;
    const tag = $('demo-tag');
    if (tag) tag.hidden = true;
  };
  function demoInput(e) {
    if (!demo.active || A.modalOpen()) return;
    if (e.type === 'keydown' && (e.key === 'Tab' || e.altKey || e.ctrlKey || e.metaKey)) return;
    if (e.target && e.target.closest && e.target.closest('[data-demo-keep]')) return;
    const onStage = demoOpts.stage && demoOpts.stage.contains(e.target);
    if (e.type === 'keydown' || onStage) { e.preventDefault(); e.stopPropagation(); }
    demo.stop();
    demoOpts.onExit();
  }
  window.addEventListener('pointerdown', demoInput, true);
  window.addEventListener('keydown', demoInput, true);

  // ===================== hacker layer =====================
  // Each game exposes one object as window.game for curious kids to poke at in the browser console.
  // A.hacker adds game.help(), which lists every value and method with a note, and prints a
  // ready-to-paste line that lists them without help().
  A.hacker = function (title, obj, notes, tries) {
    notes = Object.assign({ help: 'shows this list' }, notes || {});
    obj.help = function () {
      for (const k in obj) console.log(k, typeof obj[k] === 'function' ? '(method)' : obj[k], notes[k] ? ' ← ' + notes[k] : '');
    };
    window.game = obj;
    try {
      console.log('%c' + title, 'font: 700 18px sans-serif; color: #ffd166');
      console.log('Psst. The whole game is in window.game. Go ahead, poke at it.');
      (tries || []).forEach((t) => console.log('Try:  ' + t));
      console.log('See everything:  game.help()');
      console.log('Or paste this to list every value and method yourself:');
      console.log("for (const k in game) console.log(k, typeof game[k] === 'function' ? '(method)' : game[k])");
    } catch (e) { /* ignore */ }
    return obj;
  };

  // Per-viewer convenience storage. Never required: every read and write tolerates failure.
  A.store = {
    get(k, d) { try { const v = localStorage.getItem('arcade:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('arcade:' + k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };
})();
