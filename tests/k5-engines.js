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

function checkValidators(ok) {
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

const PLAY = {
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
