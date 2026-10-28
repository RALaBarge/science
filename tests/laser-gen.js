const { open } = require('./helpers');
(async () => {
  const { browser, page, errors } = await open('laser-bounce.html');
  await page.waitForTimeout(500);
  const out = await page.evaluate(() => {
    const rows = [];
    for (let level = 1; level <= 9; level++) {
      const ms = [], pars = [], fails = [];
      for (const code of ['COMET-FROG-42', 'NOVA-TACO-17', 'HALO-YETI-88', 'ORBIT-GECKO-55', 'ASTRO-PANDA-31']) {
        const t = performance.now();
        const lv = __lb.genLevel(code + '-L' + level, level);
        ms.push(Math.round(performance.now() - t));
        if (!lv) { fails.push(code); continue; }
        // verify the stored solution really solves it
        const m = new Map(lv.solution);
        if (!__lb.trace(lv, m).solved) fails.push(code + ' (bad solution)');
        pars.push(lv.par + (lv.targets.length > 1 ? 'x2' : ''));
      }
      rows.push({ level, pars: pars.join(' '), maxMs: Math.max(...ms), fails });
    }
    return rows;
  });
  out.forEach((r) => console.log(JSON.stringify(r)));
  console.log('errors', errors);
  await browser.close();
})();
