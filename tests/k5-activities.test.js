// Checks every K-5 activity config (data) and, in a real browser, plays each one through.
// Run: node tests/k5-activities.test.js   (after node build.mjs)
const fs = require('fs');
const path = require('path');
const { k5Validate, k5Order } = require('../k5-activities/bigsort.js');
const dir = path.join(__dirname, '..', 'k5-activities', 'units');
let fail = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fail = 1; };

const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
for (const f of files) {
  const cfg = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const errs = k5Validate(cfg);
  ok(errs.length === 0, f + ' config valid' + (errs.length ? ': ' + errs.join('; ') : ''));
  ok(fs.existsSync(path.join(__dirname, '..', 'k-5', f.replace('.json', '.html'))), f + ' has a lesson page');
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
    const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('file://' + path.join(__dirname, '..', 'dist', 'k-5', f.replace('.json', '.html')));
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
      return out;
    }, cfg);
    ok(result.wrongKeepsCard, f + ' wrong bin leaves the card in the tray');
    ok(result.finished && result.summary.includes(cfg.summary.slice(0, 30)), f + ' plays through to the summary');
    ok(errors.length === 0, f + ' no page errors' + (errors.length ? ': ' + errors.join('; ') : ''));
    await page.close();
  }
  await browser.close();
  process.exit(fail);
})();
