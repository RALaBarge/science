// Shared test helpers. Tests load dist/ files with ?test so games expose window.__s.
const { chromium } = require('playwright');
const path = require('path');
const NOISE = /agent-proxy|fonts\.g|Allowed domains|For details/;
async function open(file, hash = '', opts = {}) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1100, height: 1000 }, deviceScaleFactor: opts.dpr || 1 });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !NOISE.test(m.text()) && !/ERR_|net::/.test(m.text())) errors.push(m.text()); });
  await page.goto('file://' + path.join(__dirname, '..', 'dist', file) + '?test' + hash);
  return { browser, page, errors };
}
// Answer the open quiz question right (true) or wrong (false), then press its button.
async function answer(page, right) {
  await page.evaluate((right) => {
    const q = document.getElementById('quiz-q').textContent;
    const row = window.QUESTION_BANK.find((r) => r[1] === q);
    const btns = [...document.querySelectorAll('#quiz-choices .choice')];
    (right ? btns.find((b) => b.lastChild.textContent === row[2][0]) : btns.find((b) => b.lastChild.textContent !== row[2][0])).click();
  }, right);
  await page.click('#quiz-next');
}
// CPU use of the main thread over ms, with the CPU slowed `rate`× (4 ≈ a school Chromebook).
async function cpuMeter(page, rate = 4) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Performance.enable');
  await cdp.send('Emulation.setCPUThrottlingRate', { rate });
  const m = async () => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((x) => [x.name, x.value]));
  return {
    async measure(ms) { const a = await m(); await page.waitForTimeout(ms); const z = await m(); return Math.round((z.TaskDuration - a.TaskDuration) / (ms / 1000) * 1000) / 10; },
    async heapMB() { await cdp.send('HeapProfiler.collectGarbage'); return Math.round((await m()).JSHeapUsedSize / 1048576 * 100) / 100; }
  };
}
function check(label, cond, detail = '') { console.log((cond ? 'PASS ' : 'FAIL ') + label + (detail ? '  (' + detail + ')' : '')); if (!cond) process.exitCode = 1; }
module.exports = { open, answer, cpuMeter, check };
