// Proves every Phase Runner level can be finished: demo bots for 1, 3, 5 and test-only bots for 2, 4, 6.
const { open, check } = require('./helpers');
(async () => {
  const { browser, page, errors } = await open('phase-runner.html');
  await page.waitForTimeout(500);
  const out = await page.evaluate(() => {
    const T = __pr.TILE;
    const toExit = (w) => { const cx = w.p.x + __pr.FORMS[w.p.form].w / 2, ex = __pr.exitX(w); return { left: cx > ex + 4, right: cx < ex - 4 }; };
    const bots = {
      1: (w, m) => { const p = w.p; // through the grate
        if (p.form === 'steam') { m.s = true; return { right: p.y < 4 * T }; }
        if (!m.s) return { right: p.x + 14 < 3.5 * T };
        return toExit(w); },
      3: (w, m) => { const p = w.p; // smash
        if (!m.cold) { if (p.T <= -40) m.cold = true; return {}; }
        if (p.form === 'ice') { const cx = p.x + 15; return cx > 15.2 * T ? { left: true } : cx < 14.6 * T ? { right: true } : {}; }
        if (p.form === 'steam') { m.s = true; return { right: p.y < 4 * T }; }
        if (!m.s) { const cx = p.x + 14; return cx > 15.2 * T ? { left: true } : cx < 14.6 * T ? { right: true } : {}; }
        return toExit(w); },
      5: (w, m) => { const p = w.p; // grand tour
        if (!m.cold) { if (p.T <= -40) m.cold = true; return {}; }
        if (!m.s) { if (p.form === 'steam') m.s = true; return p.form === 'ice' ? { right: true } : {}; }
        if (p.form === 'steam' || !p.ground && !m.c) return {};
        if (!m.c && p.form === 'water') { m.c = true; return { cold: true }; }
        return toExit(w); }
    };
    const rows = [];
    for (let i = 0; i < 6; i++) rows.push({ level: i + 1, ...__pr.run(i, false, 60 * 90, bots[i]) });
    return rows;
  });
  out.forEach((r) => { check('level ' + r.level + ' can be finished', r.won, (r.frames / 60).toFixed(1) + 's, restarts ' + r.deaths + (r.won ? '' : ' · ended ' + r.form + ' at ' + r.x + ',' + r.y + ' T' + r.T)); });
  check('no page errors', errors.length === 0, errors.join(' | '));
  await browser.close();
})();
