// Measures how often generated maps pass the fairness check, per mode. Used to tune MOON_G and MAGNET_K.
const { open } = require('./helpers');
(async () => {
  const { browser, page } = await open('gravity-duel.html');
  await page.waitForTimeout(500);
  const out = await page.evaluate(async (configs) => {
    const res = [];
    for (const [mode, moon, mag] of configs) {
      __phys.tune(moon, mag);
      let fair = 0, attemptsMs = 0, pars = {};
      const N = 12;
      for (let i = 0; i < N; i++) {
        const t = performance.now();
        const m = __phys.genMap('TUNE' + i, mode);
        attemptsMs += performance.now() - t;
        const lo = m.solo ? m.hits[0] : Math.min(...m.hits), hi = m.solo ? m.hits[0] : Math.max(...m.hits);
        if (lo >= 4 && lo / hi >= 0.35) fair++;
        if (m.solo) pars[m.par] = (pars[m.par] || 0) + 1;
      }
      res.push({ mode, moon, mag, fair: fair + '/' + N, msPerMap: Math.round(attemptsMs / N), pars });
    }
    return res;
  }, JSON.parse(process.argv[2]));
  out.forEach((r) => console.log(JSON.stringify(r)));
  await browser.close();
})();
