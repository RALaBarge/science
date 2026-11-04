// Tests for the newer K-5 activity engines: pusharena, graphsky, pathsignal, sceneweb.
// Used by tests/k5-activities.test.js. Each engine has: a validator (fed bad configs on purpose),
// config checks against the unit's own data, and a browser play-through at 420px.
const fs = require('fs');
const path = require('path');
const E = (n) => require('../k5-activities/' + n + '.js');
const clone = (o) => JSON.parse(JSON.stringify(o));
const exists = (f) => fs.existsSync(path.join(__dirname, '..', 'k5-activities', f));

const engines = {};
if (exists('pusharena.js')) engines.pusharena = E('pusharena');
if (exists('graphsky.js')) engines.graphsky = E('graphsky');
if (exists('pathsignal.js')) engines.pathsignal = E('pathsignal');
if (exists('sceneweb.js')) engines.sceneweb = E('sceneweb');

const unitCfg = (f) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'k5-activities', 'units', f), 'utf8'));

/* The numbers each activity may show, copied from the unit's own backup data. */
const FACTS = {
  'unit-k-a-pushes-and-pulls.json': (cfg, ok, f) => {
    const o = (r, id) => cfg.rounds[r].options.find((x) => x.id === id).result;
    ok(o(0, 'soft').value === 2 && o(0, 'strong').value === 6, f + ' soft 2 tiles, strong 6 tiles (unit data)');
    ok(o(2, 'foam').outcomes.filter((x) => x === 'stop').length === 3 && o(2, 'card').outcomes.filter((x) => x === 'stop').length === 1, f + ' foam stops 3 of 3, cardboard 1 of 3 (unit data)');
  },
  'unit-3-1-forces-motion-and-magnets.json': (cfg, ok, f) => {
    const d = cfg.rounds[1];
    ok(JSON.stringify(d.options[0].result.positions) === '[0,10,20,30]' && JSON.stringify(d.alt.options[0].result.positions) === '[0,8,16,24]', f + ' dot sets 0-10-20-30 and 0-8-16-24 (unit data)');
    ok(d.predict.choices.find((c) => c.id === d.options[0].answer).value === 40 && d.alt.predict.choices.find((c) => c.id === d.alt.options[0].answer).value === 32, f + ' predictions 40 and 32 (unit data)');
  },
};

FACTS['unit-1-c-sky-patterns.json'] = (cfg, ok, f) => {
  const sp = cfg.rounds.find((r) => r.kind === 'sunpath'), st = cfg.rounds.find((r) => r.kind === 'strips'), mo = cfg.rounds.find((r) => r.kind === 'moon');
  ok(sp.stops.every((x) => (x.sun === 'up') === (x.stars === 'hidden')), f + ' stars hidden exactly when the Sun is up (unit: the bright sky hides them)');
  ok(st.strips.map((x) => x.slot + x.squares).join() === 'dec9,mar12,jun15', f + ' daylight strips Dec 9, Mar 12, Jun 15 (unit data)');
  ok(mo.cards.map((x) => x.shape).join() === 'crescent,half,full', f + ' Moon cards are thin curve, half, round (unit cards)');
};
FACTS['unit-5-2-gravity-stars-and-sky-patterns.json'] = (cfg, ok, f) => {
  const sh = cfg.rounds.find((r) => r.kind === 'shadow'), stars = cfg.rounds.find((r) => r.kind === 'stars'), g = cfg.rounds.find((r) => r.kind === 'gravity');
  ok(sh.rows.map((x) => x.time + ' ' + x.len + ' ' + x.dir).join('|') === '8:30 am 34 W|10:00 am 20 NW|12:00 pm 9 N|2:00 pm 18 NE|3:30 pm 30 E', f + ' shadow table matches the unit');
  ok(stars.cards.map((x) => x.name + ' ' + x.season).join() === 'Orion winter,Leo spring,Scorpius summer,Cygnus fall', f + ' constellation chart matches the unit');
  ok(g.spots.every((x) => /center|middle of the globe/.test(x.choices.find((c) => c.ok).label)), f + ' every gravity key points to the center');
};

/* ---- pathsignal: an independent oracle for series loops, compared with the engine's solver on every layout a child can build ---- */
function oracle(round, arr, open, flip) {
  const byId = {};
  round.pieces.forEach((p) => { byId[p.id] = p; });
  const els = arr.map((id) => (id ? byId[id] : null));
  if (!els.some((e) => e && e.kind === 'cell')) return { status: 'nocell', breaks: [], lit: [] };
  const breaks = [];
  els.forEach((e) => {
    if (!e) breaks.push('gap');
    else if (e.kind === 'insulator') breaks.push('insulator');
    else if (e.kind === 'switch' && open[e.id]) breaks.push('switch');
    else if (e.kind === 'led' && flip[e.id]) breaks.push('led');
  });
  const loads = els.filter((e) => e && (e.kind === 'led' || e.kind === 'buzzer' || e.kind === 'motor')).map((e) => e.id).sort();
  if (breaks.length) return { status: 'open', breaks, lit: [] };
  if (!loads.length) return { status: 'short', breaks: [], lit: [] };
  return { status: 'lit', breaks: [], lit: loads };
}
function checkPathSignalLogic(ok, f, cfg, ps) {
  const seenWhy = new Set();
  let mismatches = 0, cases = 0;
  cfg.rounds.forEach((r) => {
    if (r.type === 'test') return;
    const ids = r.pieces.map((p) => p.id);
    const sws = r.pieces.filter((p) => p.kind === 'switch').map((p) => p.id), leds = r.pieces.filter((p) => p.kind === 'led').map((p) => p.id);
    const states = [];
    for (let m = 0; m < (1 << sws.length); m++) for (let n = 0; n < (1 << leds.length); n++) {
      const open = {}, flip = {};
      sws.forEach((id, i) => { open[id] = !!(m & (1 << i)); });
      leds.forEach((id, i) => { flip[id] = !!(n & (1 << i)); });
      states.push([open, flip]);
    }
    const full = r.slots > 5;   /* big rounds: only completely filled loops; small rounds: every partial fill too */
    const arr = new Array(r.slots).fill(null), used = new Set();
    const rec = (i) => {
      if (i === r.slots) {
        states.forEach(([open, flip]) => {
          const a = ps.k5PathSignalCheck(r, arr.slice(), { open, flip }), b = oracle(r, arr, open, flip);
          cases++;
          const sameLit = JSON.stringify(a.lit.slice().sort()) === JSON.stringify(b.lit);
          const whyOk = a.status !== 'open' || b.breaks.includes(a.why);
          if (a.status !== b.status || !sameLit || !whyOk) mismatches++;
          if (a.status === 'open') seenWhy.add(a.why); else seenWhy.add(a.status);
        });
        return;
      }
      for (const id of full ? ids : ids.concat([null])) {
        if (id && used.has(id)) continue;
        if (id) used.add(id);
        arr[i] = id; rec(i + 1);
        if (id) used.delete(id);
      }
    };
    rec(0);
  });
  ok(cases > 1000 && mismatches === 0, f + ' solver agrees with the independent circuit oracle on ' + cases + ' layouts (' + mismatches + ' differences)');
  ['gap', 'insulator', 'switch', 'led', 'short', 'lit', 'nocell'].forEach((w) => ok(seenWhy.has(w), f + ' a child can reach the "' + w + '" state'));
  // the unit's tester data
  const t = cfg.rounds.find((r) => r.type === 'test');
  const data = { clip: true, foil: true, string: false, plastic: false, wood: false };
  ok(t.materials.length === 5 && t.materials.every((m) => data[m.id] === m.conducts), f + ' material tester matches the unit data (clip yes, foil yes, string no, plastic no, wood no)');
  const lockedIds = Object.values(t.locked);
  const results = t.materials.map((m) => {
    const arr = new Array(t.slots).fill(null);
    Object.entries(t.locked).forEach(([k, v]) => { arr[+k] = v; });
    arr[arr.findIndex((x) => x === null)] = 'mat:' + m.id;
    return ps.k5PathSignalCheck(t, arr, { open: {}, flip: {} }).status === 'lit';
  });
  ok(results.every((x, i) => x === t.materials[i].conducts) && lockedIds.length === t.slots - 1, f + ' the solver lights the LED for exactly the conductors');
}

function checkPathSignalValidators(ok) {
  const ps = engines.pathsignal;
  if (!ps) return;
  const good = unitCfg('unit-4-2-circuits-and-energy-conversion.json');
  const bad = (mut, word) => { const c = clone(good); mut(c); return ps.k5PathSignalValidate(c).some((x) => x.includes(word)); };
  ok(ps.k5PathSignalValidate(good).length === 0, 'pathsignal: good config validates');
  ok(bad((c) => { c.rounds[0].pieces = c.rounds[0].pieces.filter((p) => p.kind !== 'cell'); }, 'exactly one cell'), 'pathsignal validator catches a round with no cell');
  ok(bad((c) => { c.rounds[0].lit = ['w1']; }, 'not a load'), 'pathsignal validator catches a wire named as the load');
  ok(bad((c) => { c.rounds[0].pieces[2].id = 'cell'; }, 'duplicate piece id'), 'pathsignal validator catches a duplicate piece id');
  ok(bad((c) => { c.rounds[0].pieces = c.rounds[0].pieces.filter((p) => p.id !== 'w2'); }, 'not enough conducting'), 'pathsignal validator catches too few conducting pieces');
  ok(bad((c) => { c.rounds[2].locked['3'] = 'w1'; }, 'locked into two slots'), 'pathsignal validator catches a piece locked twice');
  ok(bad((c) => { c.rounds[2].materials.forEach((m) => { m.conducts = true; }); }, 'one conductor and one insulator'), 'pathsignal validator catches a tester with no insulator');
  ok(bad((c) => { c.rounds[0].slots = 2; }, 'slots must be'), 'pathsignal validator catches a loop that is too small');
  ok(bad((c) => { c.rounds[3].pieces.push({ id: 'mot', kind: 'motor', label: 'Motor' }); c.rounds[3].lit = ['led', 'buzz', 'mot']; c.rounds[3].slots = 3; }, 'no way'), 'pathsignal validator catches a round that cannot be solved');
  ok(bad((c) => { c.rounds[0].pieces.push({ id: 'x', kind: 'battery', label: 'x' }); }, 'unknown kind'), 'pathsignal validator catches an unknown piece kind');
  ok(bad((c) => { c.rounds[1].need = ['nope']; }, 'need names unknown'), 'pathsignal validator catches a need that names a missing piece');
  ok(bad((c) => { delete c.note; }, 'saying it is a model'), 'pathsignal validator catches a missing model note');
  checkPathSignalLogic(ok, 'pathsignal engine', good, ps);
}

FACTS['unit-k2-0-science-noticing-and-asking.json'] = (cfg, ok, f) => {
  const t = engines.sceneweb.k5SceneTally(cfg);
  ok(t.feel.smooth === 4 && t.feel.bumpy === 5, f + ' tally is 4 smooth, 5 bumpy (unit data)');
  const all = JSON.stringify(cfg);
  ok(all.includes('Towel A held 5 drops, Towel B held 8 drops'), f + ' towel data is 5 and 8 drops (unit data)');
  ok(cfg.questions.every((q) => q.choices.filter((c) => c.ok).length === 1), f + ' each question has one testable choice');
};

function checkSceneWebValidators(ok) {
  const sw = engines.sceneweb;
  if (!sw) return;
  const good = unitCfg('unit-k2-0-science-noticing-and-asking.json');
  const bad = (mut, word) => { const c = clone(good); mut(c); return sw.k5SceneWebValidate(c).some((x) => x.includes(word)); };
  ok(sw.k5SceneWebValidate(good).length === 0, 'sceneweb: good config validates');
  ok(bad((c) => { delete c.scene.items[0].say; }, 'needs label and say'), 'sceneweb validator catches a missing observation line');
  ok(bad((c) => { c.scene.items[0].notices.feel = 'smoth'; }, 'unknown bin'), 'sceneweb validator catches a notice that names a missing bin');
  ok(bad((c) => { c.scene.items[1].id = c.scene.items[0].id; }, 'duplicate item'), 'sceneweb validator catches a duplicate item id');
  ok(bad((c) => { c.questions[0].choices[1].ok = true; }, 'exactly one testable'), 'sceneweb validator catches a question with two testable answers');
  ok(bad((c) => { c.noticeGroups = []; }, 'noticeGroups'), 'sceneweb validator catches empty notice groups');
  ok(bad((c) => { c.scene.items = c.scene.items.filter((i) => i.notices.feel !== 'bumpy'); }, 'has no items'), 'sceneweb validator catches a bin nothing falls in');
  ok(bad((c) => { delete c.note; }, 'needs a note'), 'sceneweb validator catches a missing model note');
  ok(JSON.stringify(sw.k5SceneOrder(['a', 'b', 'c'], 's:1')) === JSON.stringify(sw.k5SceneOrder(['a', 'b', 'c'], 's:1')), 'sceneweb order is repeatable');
  const wrongTally = clone(good); wrongTally.scene.items[0].notices.feel = 'bumpy';
  ok(sw.k5SceneTally(wrongTally).feel.smooth === 3, 'sceneweb tally follows the config');
}

function checkGraphSkyValidators(ok) {
  const g = engines.graphsky;
  if (!g) return;
  const good = unitCfg('unit-5-2-gravity-stars-and-sky-patterns.json'), one = unitCfg('unit-1-c-sky-patterns.json');
  const bad = (base, mut, word) => { const c = clone(base); mut(c); return g.k5GraphSkyValidate(c).some((x) => x.includes(word)); };
  ok(g.k5GraphSkyValidate(good).length === 0 && g.k5GraphSkyValidate(one).length === 0, 'graphsky: good configs validate');
  ok(bad(good, (c) => { c.rounds[0].rows[2].len = 34; c.rounds[0].rows[0].len = 9; }, 'highest Sun must give the shortest shadow'), 'graphsky validator catches a long midday shadow');
  ok(bad(good, (c) => { c.rounds[0].rows[1].dir = 'XX'; }, 'unknown direction'), 'graphsky validator catches a bad shadow direction');
  ok(bad(good, (c) => { c.rounds[0].rows[1].sun.x = 0.05; }, 'must move one way'), 'graphsky validator catches a Sun that jumps back');
  ok(bad(good, (c) => { c.rounds[1].cards[0].season = 'autumn'; }, 'unknown season'), 'graphsky validator catches a card with an unknown season');
  ok(bad(good, (c) => { c.rounds[2].spots[0].choices[1].ok = true; }, 'exactly one correct'), 'graphsky validator catches two right gravity answers');
  ok(bad(one, (c) => { c.rounds[0].stops.pop(); c.rounds[0].stops.pop(); }, 'at least 3 stops'), 'graphsky validator catches a sky with too few stops');
  ok(bad(one, (c) => { c.rounds[1].cards[1].order = 0; }, 'duplicate order'), 'graphsky validator catches two Moon cards with one order');
  ok(bad(one, (c) => { c.rounds[2].strips[0].slot = 'nov'; }, 'unknown slot'), 'graphsky validator catches a strip with a missing month');
  ok(bad(one, (c) => { delete c.note; }, 'saying it is a model'), 'graphsky validator catches a missing model note');
  const a = g.k5SkyOrder(['a', 'b', 'c', 'd', 'e'], 'x:1:0');
  ok(JSON.stringify(a) === JSON.stringify(g.k5SkyOrder(['a', 'b', 'c', 'd', 'e'], 'x:1:0')), 'graphsky order is repeatable');
}

function checkFairValidators(ok) {
  const F = require('../k5-activities/fairtest.js');
  const good = unitCfg('unit-2-c-land-and-water-fast-and-slow.json');
  ok(F.k5FairValidate(good).length === 0, 'fairtest: good config validates');
  const m1 = clone(good); m1.rounds[0].reads[0].choices.forEach((x) => { x.ok = x.label === 'Stones'; });
  ok(F.k5FairValidate(m1).some((e) => e.includes('data picks')), 'fairtest validator catches a read key that names the wrong winner');
  const m2 = clone(good); m2.rounds[0].claim[1].choices.forEach((x) => { x.ok = /paper barrier/.test(x.label); });
  ok(F.k5FairValidate(m2).some((e) => e.includes('data picks')), 'fairtest validator catches a claim key that names the wrong winner');
  const m3 = clone(good); m3.rounds[0].options[1].trials = [9, 9, 9];
  ok(F.k5FairValidate(m3).some((e) => e.includes('data picks') || e.includes('no correct choice')), 'fairtest validator catches data that no longer supports the key');
}

function checkValidators(ok) {
  checkFairValidators(ok);
  checkSceneWebValidators(ok);
  checkGraphSkyValidators(ok);
  checkPathSignalValidators(ok);
  const p = engines.pusharena;
  if (p) {
    const good = unitCfg('unit-3-1-forces-motion-and-magnets.json');
    const bad = (mut, word) => { const c = clone(good); mut(c); const e = p.k5PushArenaValidate(c); return e.some((x) => x.includes(word)); };
    ok(p.k5PushArenaValidate(good).length === 0, 'pusharena: good config validates');
    ok(bad((c) => { c.rounds[1].options[0].answer = 'v35'; }, 'answer key is wrong'), 'pusharena validator catches a wrong dots answer key');
    ok(bad((c) => { c.rounds[1].alt.options[0].answer = 'v28'; }, 'answer key is wrong'), 'pusharena validator catches a wrong alt dots key');
    ok(bad((c) => { c.rounds[0].options[0].result.move = 1; }, 'move key is wrong'), 'pusharena validator catches a wrong balance result');
    ok(bad((c) => { c.rounds[0].options[1].answer = 't9'; }, 'unknown choice'), 'pusharena validator catches a dangling answer');
    ok(bad((c) => { c.rounds[0].options[1].id = c.rounds[0].options[0].id; }, 'duplicate option'), 'pusharena validator catches a duplicate option id');
    ok(bad((c) => { c.rounds[2].options[0].result.moves = 'yes'; }, 'moves true or false'), 'pusharena validator catches a bad pull result');
    ok(bad((c) => { c.rounds[2].reads[0].choices[1].ok = true; }, 'exactly one correct'), 'pusharena validator catches two right read answers');
    ok(bad((c) => { c.claim.pop(); }, 'claim needs 3'), 'pusharena validator catches a short claim');
    ok(bad((c) => { delete c.note; }, 'needs a note'), 'pusharena validator catches a missing model note');
  }
}

function checkConfig(ok, f, cfg) {
  const eng = engines[cfg.engine];
  const names = { pusharena: 'k5PushArenaValidate', graphsky: 'k5GraphSkyValidate', pathsignal: 'k5PathSignalValidate', sceneweb: 'k5SceneWebValidate' };
  const errs = eng[names[cfg.engine]](cfg);
  ok(errs.length === 0, f + ' config valid' + (errs.length ? ': ' + errs.join('; ') : ''));
  ok(fs.existsSync(path.join(__dirname, '..', 'k-5', f.replace('.json', '.html'))), f + ' has a lesson page');
  ok(/model|simulat/i.test(cfg.note || ''), f + ' says it is a model');
  if (FACTS[f]) FACTS[f](cfg, ok, f);
}

/* ---- browser drivers: every driver gets the page, plays the correct path, and checks a wrong tap first ---- */
const A = '#k5-activity';
const byName = (page, name) => page.locator(A).getByRole('button', { name, exact: true });
async function msgKind(page) { return page.locator(A + ' .msg').evaluate((e) => e.className); }
async function tap(page, name) { await byName(page, name).first().click(); }
/* tap a wrong choice (its button name is `bad`), check it shows a reason and the page stays, then tap the right one */
async function wrongThenRight(page, bad, good, out, what) {
  if (bad !== null) {
    await tap(page, bad);
    const k = await msgKind(page);
    const txt = await page.locator(A + ' .msg').textContent();
    if (k.indexOf('bad') < 0 || txt.length < 8) out.push('no reason shown for a wrong ' + what);
  }
  await tap(page, good);
}

/* graphsky: every step is a real button; reads and claims are the newest row in .main */
const lastRow = (page) => page.locator(A + ' .main > .row').last();
async function rowWrongRight(page, step, out, what) {
  const row = lastRow(page);
  const bad = step.choices.find((c) => !c.ok), good = step.choices.find((c) => c.ok);
  await row.getByRole('button', { name: bad.label, exact: true }).click();
  const k = await msgKind(page), txt = await page.locator(A + ' .msg').textContent();
  if (k.indexOf('bad') < 0 || txt.length < 8) out.push('no reason shown for a wrong ' + what);
  await row.getByRole('button', { name: good.label, exact: true }).click();
}
const DIRDEG = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };

const PLAY = {
  async sceneweb(ok, f, cfg, page, errors) {
    const problems = [];
    const items = cfg.scene.items;
    for (const it of items) await byName(page, 'Notice: ' + it.label).click();
    const tally = await page.locator(A + ' .tally').textContent();
    ok(/Smooth\D*4/.test(tally) && /Bumpy\D*5/.test(tally), f + ' the on-screen tally reads 4 smooth, 5 bumpy');
    // every wrong question choice shows a reason and changes nothing; then the right one
    const left = cfg.questions.map((q, i) => i);
    for (let step = 0; step < cfg.questions.length; step++) {
      let qi = -1;
      for (const i of left) { if (await page.locator(A + ' .ask .opt', { hasText: cfg.questions[i].choices.find((c) => c.ok).label }).count()) { qi = i; break; } }
      if (qi < 0) { problems.push('no question on screen at step ' + step); break; }
      left.splice(left.indexOf(qi), 1);
      for (const c of cfg.questions[qi].choices.filter((x) => !x.ok)) {
        await page.locator(A + ' .ask .opt', { hasText: c.label }).first().click();
        const txt = await page.locator(A + ' .msg').textContent();
        if ((await msgKind(page)).indexOf('bad') < 0 || txt !== c.why) problems.push('wrong choice shows its own reason: ' + c.label);
      }
      await page.locator(A + ' .ask .opt', { hasText: cfg.questions[qi].choices.find((c) => c.ok).label }).first().click();
    }
    await page.locator(A + ' .done').waitFor();
    ok(await byName(page, 'Copy what you found').count() === 1, f + ' end screen has a Copy button');
    const txt = await page.locator(A + ' .done').textContent();
    ok(txt.includes(cfg.summary.slice(0, 30)), f + ' plays through to the summary');
    ok(/Smooth: 4/.test(txt) && /Bumpy: 5/.test(txt), f + ' the summary repeats the tally (4 smooth, 5 bumpy)');
    ok(problems.length === 0, f + ' wrong choices show their reason' + (problems.length ? ': ' + problems.join('; ') : ''));
    ok(await page.evaluate(() => document.documentElement.scrollWidth <= 420), f + ' fits 420px wide');
    // every item is a real, big-enough button at 420px
    await byName(page, 'Play again').click();
    const sizes = await page.locator(A + ' .it').evaluateAll((bs) => bs.map((b) => { const r = b.getBoundingClientRect(); return Math.min(r.width, r.height); }));
    ok(sizes.length === items.length && sizes.every((x) => x >= 44), f + ' every thing to tap is at least 44px at 420px wide');
    ok((await page.locator(A + ' .tally').textContent()).indexOf('4') < 0, f + ' play again clears the tally');
    ok(errors.length === 0, f + ' no page errors' + (errors.length ? ': ' + errors.join('; ') : ''));
  },

  async pathsignal(ok, f, cfg, page, errors) {
    const problems = [];
    const slot = (i) => page.locator(A + ' .slot[data-slot="' + i + '"]');
    const piece = (id) => page.locator(A + ' .tray .pc[data-pid="' + id + '"]');
    const next = page.locator(A + ' .end .btn');
    const msg = async () => ({ k: await msgKind(page), t: await page.locator(A + ' .msg').textContent() });
    for (let ri = 0; ri < cfg.rounds.length; ri++) {
      const r = cfg.rounds[ri];
      if (r.type === 'test') {
        for (const m of r.materials) {
          await page.locator(A + ' .tray .pc[data-mid="' + m.id + '"]').click();
          const row = await page.locator(A + ' .tab tr[data-mid="' + m.id + '"] .r').textContent();
          if (row !== (m.conducts ? 'Yes' : 'No')) problems.push('tester row for ' + m.id + ' says ' + row);
          const mm = await msg();
          const lastOne = m === r.materials[r.materials.length - 1];   // the last test shows the round's closing line instead
          if (mm.t.length < 10 || (lastOne ? !mm.t.endsWith(r.done) : (m.conducts ? mm.k.indexOf('ok') < 0 : mm.k.indexOf('ok') >= 0 || mm.k.indexOf('bad') >= 0))) problems.push('tester message for ' + m.id);
        }
      } else {
        // right pieces: the cell, then the loads that must run, then the rest that conduct
        const good = r.pieces.filter((p) => p.kind === 'cell').concat(r.pieces.filter((p) => r.lit.indexOf(p.id) >= 0), r.pieces.filter((p) => (r.need || []).indexOf(p.id) >= 0 && r.lit.indexOf(p.id) < 0), r.pieces.filter((p) => p.kind !== 'cell' && p.kind !== 'insulator' && r.lit.indexOf(p.id) < 0 && (r.need || []).indexOf(p.id) < 0)).slice(0, r.slots);
        // a wrong first try: swap one piece for something that does not belong (an insulator, or a spare wire instead of a load)
        const ins = r.pieces.find((p) => p.kind === 'insulator'), spare = r.pieces.find((p) => p.kind === 'wire' && good.indexOf(p) < 0);
        const wrongAt = good.findIndex((p) => p.kind === 'wire');
        const first = good.slice();
        if (ins && wrongAt >= 0) first[wrongAt] = ins; else if (spare) first[good.findIndex((p) => r.lit.indexOf(p.id) >= 0)] = spare;
        for (let i = 0; i < r.slots; i++) { await piece(first[i].id).click(); await slot(i).click(); }
        let mm = await msg();
        if (mm.k.indexOf('bad') < 0 || mm.t.length < 20) problems.push(r.id + ': a wrong loop shows no reason (' + mm.t + ')');
        if (await next.count()) problems.push(r.id + ': a wrong loop was accepted');
        // a closed switch with nothing to use the energy is a short circuit with its own reason
        if (!ins && spare) {
          const swAt = first.findIndex((p) => p.kind === 'switch');
          await slot(swAt).click();
          mm = await msg();
          ok(/short circuit/i.test(mm.t) && /hot/i.test(mm.t), f + ' ' + r.id + ' a closed loop with no load is called a short circuit that gets hot');
        }
        // fix it: pick up the wrong piece and put the right one in
        for (let i = 0; i < r.slots; i++) {
          if (first[i] !== good[i]) { await slot(i).click(); await piece(good[i].id).click(); await slot(i).click(); }
        }
        // close every open switch and turn every LED the working way (read from each slot's label)
        for (let i = 0; i < r.slots; i++) {
          if (good[i].kind !== 'switch' && good[i].kind !== 'led') continue;
          const lab = await slot(i).getAttribute('aria-label');
          if ((good[i].kind === 'switch' && /open/.test(lab)) || (good[i].kind === 'led' && /←/.test(lab))) await slot(i).click();
        }
      }
      ok(await next.count() === 1, f + ' ' + r.id + ' finishes with the right loop');
      await next.click();
    }
    // a loop that lights but leaves out the piece the round is about (the switch) is not accepted
    await page.evaluate((c) => { const d = document.createElement('div'); d.id = 'solo'; document.body.appendChild(d); k5PathSignal(d, c); }, Object.assign(clone(cfg), { rounds: [clone(cfg.rounds.find((r) => r.need))] }));
    const r2 = clone(cfg.rounds.find((r) => r.need));
    const S = '#solo';
    const solo = page;
    const sl = (i) => solo.locator(S + ' .slot[data-slot="' + i + '"]');
    const noSw = r2.pieces.filter((p) => r2.need.indexOf(p.id) < 0 && p.kind !== 'insulator').slice(0, r2.slots).map((p) => p.id);
    for (let i = 0; i < r2.slots; i++) { await solo.locator(S + ' .tray .pc[data-pid="' + noSw[i] + '"]').click(); await sl(i).click(); }
    const ledAt = noSw.indexOf(r2.lit[0]);
    for (let g = 0; g < 2 && /LED/.test(await solo.locator(S + ' .msg').textContent()); g++) await sl(ledAt).click();
    ok(/this round is about/i.test(await solo.locator(S + ' .msg').textContent()) && (await solo.locator(S + ' .end .btn').count()) === 0, f + ' a loop that lights without the switch is not accepted');
    await page.evaluate(() => document.getElementById('solo').remove());
    await page.locator(A + ' .donebox').waitFor();
    ok(await byName(page, 'Copy what you found').count() === 1, f + ' end screen has a Copy button');
    const txt = await page.locator(A + ' .donebox').textContent();
    ok(txt.includes(cfg.summary.slice(0, 30)), f + ' plays through to the summary');
    ok(/paper clip.*foil.*conducted/i.test(txt), f + ' summary reports which materials conducted');
    ok(problems.length === 0, f + ' wrong loops and tester rows show reasons' + (problems.length ? ': ' + problems.join('; ') : ''));
    ok(await page.evaluate(() => document.documentElement.scrollWidth <= 420), f + ' fits 420px wide');
    await byName(page, 'Play again').click();
    ok(await page.locator(A + ' .slot').count() === cfg.rounds[0].slots, f + ' play again restarts');
    ok(errors.length === 0, f + ' no page errors' + (errors.length ? ': ' + errors.join('; ') : ''));
  },

  async graphsky(ok, f, cfg, page, errors) {
    const problems = [];
    for (let ri = 0; ri < cfg.rounds.length; ri++) {
      const r = cfg.rounds[ri];
      if (r.kind === 'sunpath') {
        for (const st of r.stops) await byName(page, st.label).click();
        ok((await page.locator(A + ' table.log tr').count()) === r.stops.length + 1, f + ' sky log has a row per time');
      } else if (r.kind === 'shadow') {
        let geo = true;
        const lens = [];
        for (const row of r.rows) {
          await byName(page, row.time).click();
          const g = await page.locator(A + ' .scene svg').evaluate((svg) => {
            const ln = [...svg.querySelectorAll('line')].find((l) => l.getAttribute('stroke-width') === '4');
            const cs = [...svg.querySelectorAll('circle')].filter((c) => c.getAttribute('r') === '8');
            const sh = [+ln.getAttribute('x2') - 250, +ln.getAttribute('y2') - 80], sun = [+cs[0].getAttribute('cx') - 250, +cs[0].getAttribute('cy') - 80];
            return { sh, sun, label: svg.getAttribute('aria-label'), len: Math.hypot(sh[0], sh[1]) };
          });
          const ang = (Math.atan2(g.sh[0], -g.sh[1]) * 180 / Math.PI + 360) % 360;
          const opp = g.sh[0] * g.sun[0] + g.sh[1] * g.sun[1] < 0;
          if (!opp || Math.abs(ang - DIRDEG[row.dir]) > 1 || !g.label.includes(row.len + ' cm')) geo = false;
          lens.push(g.len);
        }
        ok(geo, f + ' every shadow points the table direction, away from the Sun, and the label has its length');
        const minLen = Math.min(...r.rows.map((x) => x.len));
        ok(r.rows.every((x, i) => x.len === minLen || lens[i] > lens[r.rows.findIndex((y) => y.len === minLen)]), f + ' the midday shadow is drawn shortest');
      } else if (r.kind === 'moon') {
        const cards = r.cards.slice().sort((a, b) => a.order - b.order);
        await byName(page, cards[cards.length - 1].label).click();
        if ((await msgKind(page)).indexOf('bad') < 0) problems.push('moon: no reason for an out-of-order card');
        for (const c of cards) await byName(page, c.label).click();
      } else if (r.kind === 'strips' || r.kind === 'stars') {
        const items = r.kind === 'strips' ? r.strips : r.cards, targets = r.kind === 'strips' ? r.slots : r.seasons;
        for (const it of items) {
          const name = r.kind === 'strips' ? it.squares + ' squares' : it.name;
          const key = r.kind === 'strips' ? 'slot' : 'season';
          const wrongT = targets.find((t) => t.id !== it[key]), rightT = targets.find((t) => t.id === it[key]);
          await page.locator(A + ' .row .opt', { hasText: name }).first().click();
          await page.locator(A + ' .slot', { hasText: wrongT.label }).first().click();
          if ((await msgKind(page)).indexOf('bad') < 0) problems.push(r.kind + ': no reason for a wrong place for ' + name);
          await page.locator(A + ' .slot', { hasText: rightT.label }).first().click();
        }
      } else if (r.kind === 'gravity') {
        const rows = page.locator(A + ' .main > .row');
        for (let i = 0; i < r.spots.length; i++) {
          const sp = r.spots[i], bad = sp.choices.find((c) => !c.ok), good = sp.choices.find((c) => c.ok);
          await rows.nth(i).getByRole('button', { name: bad.label, exact: true }).click();
          if ((await msgKind(page)).indexOf('bad') < 0) problems.push('gravity: no reason for a wrong arrow');
          await rows.nth(i).getByRole('button', { name: good.label, exact: true }).click();
        }
        const drawn = await page.locator(A + ' svg line[marker-end]').evaluateAll((ls) => ls.every((l) => l.getAttribute('opacity') === '1'));
        ok(drawn, f + ' every gravity arrow is drawn after it is answered');
      }
      for (const rd of r.reads) await rowWrongRight(page, rd, problems, 'read answer');
      for (const cl of r.claim) await rowWrongRight(page, cl, problems, 'claim part');
      if (ri + 1 < cfg.rounds.length) await byName(page, 'Next sky').click();
    }
    await page.locator(A + ' .done').waitFor();
    ok(await byName(page, 'Copy what you found').count() === 1, f + ' end screen has a Copy button');
    const txt = await page.locator(A + ' .done').textContent();
    ok(txt.includes(cfg.summary.slice(0, 30)), f + ' plays through to the summary');
    ok(cfg.rounds.every((r) => !r.rows || r.rows.every((x) => txt.includes(x.len + ' cm'))), f + ' summary shows every shadow length');
    ok(cfg.rounds.every((r) => !r.strips || r.strips.every((x) => txt.includes('about ' + x.squares + ' squares'))), f + ' summary shows every daylight strip');
    ok(problems.length === 0, f + ' wrong taps show a reason' + (problems.length ? ': ' + problems.join('; ') : ''));
    ok(await page.evaluate(() => document.documentElement.scrollWidth <= 420), f + ' fits 420px wide');
    await byName(page, 'Play again').click();
    ok(await page.locator(A + ' .main .q').count() === 1, f + ' play again restarts');
    ok(errors.length === 0, f + ' no page errors' + (errors.length ? ': ' + errors.join('; ') : ''));
  },

  async pusharena(ok, f, cfg, page, errors) {
    const problems = [];
    for (let ri = 0; ri < cfg.rounds.length; ri++) {
      const r = cfg.rounds[ri];
      for (const o of r.options) {
        await page.locator(A + ' .opt[data-oid="' + o.id + '"]').click();
        const right = r.predict.choices.find((c) => c.id === o.answer);
        const wrong = r.predict.choices.find((c) => c.id !== o.answer);
        if (r.predictAfter) {
          await byName(page, 'Release').click();
          await page.locator(A + ' .stage2 .step').waitFor();
          await wrongThenRight(page, wrong.label, right.label, problems, 'prediction');
          await byName(page, 'Show the next second').click();
        } else {
          await wrongThenRight(page, wrong.label, right.label, problems, 'prediction');
          await byName(page, 'Release').click();
        }
        await page.locator(A + ' .opt[data-oid="' + o.id + '"].right').waitFor();
      }
      for (const rd of r.reads) {
        const bad = rd.choices.find((c) => !c.ok), good = rd.choices.find((c) => c.ok);
        await wrongThenRight(page, bad.label, good.label, problems, 'read answer');
      }
      if (ri + 1 < cfg.rounds.length) await byName(page, 'Next test').click();
    }
    for (const part of cfg.claim) {
      const bad = part.choices.find((c) => !c.ok), good = part.choices.find((c) => c.ok);
      await wrongThenRight(page, bad.label, good.label, problems, 'claim part');
    }
    await page.locator(A + ' .done').waitFor();
    ok(await byName(page, 'Copy what you found').count() === 1, f + ' end screen has a Copy button');
    const txt = await page.locator(A + ' .done').textContent();
    ok(txt.includes(cfg.summary.slice(0, 30)), f + ' plays through to the summary');
    ok(cfg.rounds.every((r) => txt.includes(r.finding.slice(0, 25))), f + ' summary lists every finding');
    ok(problems.length === 0, f + ' wrong taps show a reason' + (problems.length ? ': ' + problems.join('; ') : ''));
    ok(await page.evaluate(() => document.documentElement.scrollWidth <= 420), f + ' fits 420px wide');
    // play again must start a fresh run (and a different scenario where the config has one)
    await byName(page, 'Play again').click();
    ok(await page.locator(A + ' .opt[data-oid]').count() > 0, f + ' play again restarts');
    ok(errors.length === 0, f + ' no page errors' + (errors.length ? ': ' + errors.join('; ') : ''));
  },
};

async function play(ok, f, cfg, page, errors) {
  try { await PLAY[cfg.engine](ok, f, cfg, page, errors); }
  catch (e) { ok(false, f + ' play-through threw: ' + String(e.message).split('\n')[0]); if (process.env.K5_DEBUG) console.log(e.stack); }
}

module.exports = { engines, checkValidators, checkConfig, play };
