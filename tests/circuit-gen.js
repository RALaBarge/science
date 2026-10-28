const { open } = require('./helpers');
(async () => {
  const { browser, page, errors } = await open('short-circuit.html');
  await page.waitForTimeout(400);
  const out = await page.evaluate(() => {
    const rows = [];
    // physics sanity: 1 bulb = 1.0, 2 in series = 0.5 each
    for (let level = 1; level <= 10; level++) {
      const info = [];
      let maxMs = 0;
      for (const code of ['COMET-FROG-42', 'NOVA-TACO-17', 'HALO-YETI-88', 'ORBIT-GECKO-55']) {
        const t = performance.now();
        const lv = __sc.genLevel(code + '-L' + level, level);
        maxMs = Math.max(maxMs, performance.now() - t);
        if (!lv) { info.push('FAIL'); continue; }
        const solvedTiles = lv.tiles.map((t) => Object.assign({}, t, { rot: t.solRot, closed: t.kind === 'switch' ? true : t.closed }));
        const r = __sc.solveCircuit(solvedTiles);
        const cur = [...r.current.values()].map((I) => I.toFixed(2)).join('/');
        info.push('par' + lv.par + ' b' + lv.nBulbs + ' I=' + cur + (__sc.solvedBy(r) ? '' : ' NOT SOLVED'));
      }
      rows.push('L' + level + ' ' + Math.round(maxMs) + 'ms  ' + info.join(' | '));
    }
    return rows;
  });
  out.forEach((r) => console.log(r));
  console.log('errors', errors);
  await browser.close();
})();
