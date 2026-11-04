// Checks every K-5 activity config (data) and, in a real browser, plays each one through.
// Run: node tests/k5-activities.test.js   (after node build.mjs)
const fs = require('fs');
const path = require('path');
const { k5Validate, k5Order } = require('../k5-activities/bigsort.js');
const { k5FairValidate, k5FairBest } = require('../k5-activities/fairtest.js');
const NEWENG = require('./k5-engines.js');   // validators, bad-config checks and browser drivers for the newer engines
const dir = path.join(__dirname, '..', 'k5-activities', 'units');
let fail = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fail = 1; };

const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
NEWENG.checkValidators(ok);
for (const f of files) {
  const cfg = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  if (NEWENG.engines[cfg.engine]) { NEWENG.checkConfig(ok, f, cfg, dir); continue; }
  const fair = cfg.engine === 'fairtest';
  const errs = fair ? k5FairValidate(cfg) : k5Validate(cfg);
  ok(errs.length === 0, f + ' config valid' + (errs.length ? ': ' + errs.join('; ') : ''));
  ok(fs.existsSync(path.join(__dirname, '..', 'k-5', f.replace('.json', '.html'))), f + ' has a lesson page');
  if (fair) {
    cfg.rounds.forEach((r, i) => {
      const best = k5FairBest(r);
      ok(best.length >= 1, f + ' round ' + (i + 1) + ' has a best option (' + best.join(',') + ')');
      // the correct claim text must name the winning option(s) when the data has a single winner
      if (best.length === 1) {
        const win = r.options.find((o) => o.id === best[0]).label.toLowerCase();
        const okTexts = r.claim.flatMap((c) => c.choices.filter((x) => x.ok).map((x) => x.label.toLowerCase())).join(' ');
        ok(okTexts.includes(win), f + ' round ' + (i + 1) + ' correct claim names the winner "' + win + '"');
      }
    });
    continue;
  }
  const ids = cfg.stages[0].cards.map((c) => c.id);
  ok(JSON.stringify(k5Order(ids, 'x')) === JSON.stringify(k5Order(ids, 'x')), f + ' order is repeatable');
  ok([...k5Order(ids, 'x')].sort().join() === [...ids].sort().join(), f + ' order keeps every card');
  // reading load: short labels for early grades
  if (/unit-(k|1|2)-/.test(f)) {
    const long = cfg.stages.flatMap((s) => s.cards).filter((c) => c.label.split(/\s+/).length > 9);
    ok(long.length === 0, f + ' card labels stay short for K-2');
  }
}

(async () => {
  let chromium;
  try { ({ chromium } = require(process.env.K5_PW || 'playwright')); } catch (e) { console.log('SKIP browser play-through (no playwright)'); process.exit(fail); }
  const browser = await chromium.launch(process.env.K5_CHROME ? { executablePath: process.env.K5_CHROME } : {});
  for (const f of files) {
    const cfg = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    const page = await browser.newPage({ viewport: { width: 420, height: 900 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('file://' + path.join(__dirname, '..', 'dist', 'k-5', f.replace('.json', '.html')));
    if (NEWENG.engines[cfg.engine]) {
      await NEWENG.play(ok, f, cfg, page, errors);
      await page.close();
      continue;
    }
    if (cfg.engine === 'fairtest') {
      const r = await page.evaluate((cfg) => {
        const root = document.getElementById('k5-activity').shadowRoot;
        const out = { wrongBlocked: true, finished: false, trials: 0 };
        const msg = () => root.querySelector('.msg').className;
        for (let ri = 0; ri < cfg.rounds.length; ri++) {
          const r = cfg.rounds[ri];
          const fb = [...root.querySelectorAll('.main .row')].pop().querySelectorAll('button');
          const wrong = r.factors.findIndex((x) => x.id !== r.change);
          fb[wrong].click();
          if (msg().indexOf('bad') < 0 || root.querySelector('.held')) out.wrongBlocked = false;
          fb[r.factors.findIndex((x) => x.id === r.change)].click();
          root.querySelectorAll('.lab').forEach((lab) => { const b = lab.querySelector('button'); for (let i = 0; i < r.options[0].trials.length; i++) { b.click(); out.trials++; } });
          const steps = [...r.reads, ...r.claim];
          for (const st of steps) {
            const row = [...root.querySelectorAll('.main .row')].pop();
            const bs = row.querySelectorAll('button');
            const bad = st.choices.findIndex((c) => !c.ok);
            bs[bad].click();
            if (msg().indexOf('bad') < 0 || bs[bad].disabled) out.wrongBlocked = false;
            bs[st.choices.findIndex((c) => c.ok)].click();
          }
          if (ri < cfg.rounds.length - 1) root.querySelector('.end .btn').click();
        }
        out.finished = !!root.querySelector('.done');
        out.summary = out.finished ? root.querySelector('.done').textContent : '';
        return out;
      }, cfg);
      ok(r.wrongBlocked, f + ' wrong choices show a reason and do not advance');
      ok(await page.evaluate(() => [...document.getElementById('k5-activity').shadowRoot.querySelectorAll('.done button')].some((b) => b.textContent === 'Copy what you found')), f + ' end screen has a Copy button');
      ok(r.finished && r.summary.includes(cfg.summary.slice(0, 30)), f + ' plays through to the summary (' + r.trials + ' trials)');
      ok(errors.length === 0, f + ' no page errors' + (errors.length ? ': ' + errors.join('; ') : ''));
      await page.close();
      continue;
    }
    const result = await page.evaluate((cfg) => {
      const root = document.getElementById('k5-activity').shadowRoot;
      const out = { wrongKeepsCard: true, finished: false };
      for (let s = 0; s < cfg.stages.length; s++) {
        const st = cfg.stages[s];
        // a wrong drop must not place the card
        const first = st.cards[0];
        const wrongBin = st.bins.find((b) => b.id !== first.bin).id;
        root.querySelector('.card[data-id="' + first.id + '"]').click();
        root.querySelector('.bin[data-bin="' + wrongBin + '"]').click();
        if (!root.querySelector('.card[data-id="' + first.id + '"]')) out.wrongKeepsCard = false;
        for (const c of st.cards) {
          root.querySelector('.card[data-id="' + c.id + '"]').click();
          root.querySelector('.bin[data-bin="' + c.bin + '"]').click();
        }
        const next = root.querySelector('.end .btn');
        if (s < cfg.stages.length - 1) next.click();
      }
      out.finished = !!root.querySelector('.done');
      out.summary = root.querySelector('.done') ? root.querySelector('.done').textContent : '';
      out.copy = !!([...root.querySelectorAll('.done button')].find((b) => b.textContent === 'Copy what you found'));
      return out;
    }, cfg);
    ok(result.copy, f + ' end screen has a Copy button');
    ok(await page.evaluate(() => { const r = document.getElementById('k5-activity').shadowRoot; return r.querySelectorAll('button .bin, button h4').length === 0; }), f + ' no heading or list inside a button');
    ok(result.wrongKeepsCard, f + ' wrong bin leaves the card in the tray');
    ok(result.finished && result.summary.includes(cfg.summary.slice(0, 30)), f + ' plays through to the summary');
    ok(errors.length === 0, f + ' no page errors' + (errors.length ? ': ' + errors.join('; ') : ''));
    await page.close();
  }
  await browser.close();
  process.exit(fail);
})();
