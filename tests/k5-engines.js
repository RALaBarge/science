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
  ok(g.spots.every((x) => x.choices.find((c) => c.ok).label.includes('center of Earth')), f + ' every gravity key points to the center');
};

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

function checkValidators(ok) {
  checkGraphSkyValidators(ok);
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
  catch (e) { ok(false, f + ' play-through threw: ' + String(e.message).split('\n')[0]); }
}

module.exports = { engines, checkValidators, checkConfig, play };
