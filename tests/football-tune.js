// Outcome mix of CPU-quarterback plays over many seeds: how often passes are clean, contested, picked or dropped.
const { open } = require('./helpers');
(async () => {
  const { browser, page, errors } = await open('football-duel.html');
  const res = await page.evaluate(() => {
    const tally = {}, types = [0, 0, 0], depth = [], gains = [];
    for (let i = 0; i < 600; i++) {
      const r = window.__fb.autoplay('TUNE-' + (i % 60), i, 20 + (i % 50));
      const k = r.first ? r.first.type : "none";
      tally[k] = (tally[k] || 0) + 1;
      if (r.ball) { types[r.ball.type]++; depth.push(r.ball.R); }
      if (r.first && r.first.type === 'catch' && r.last) gains.push(Math.min(100, r.last.x) - (20 + (i % 50)));
    }
    depth.sort((a, b) => a - b);
    gains.sort((a, b) => a - b);
    return { tally, types, gainMedian: gains[gains.length >> 1], gainP90: gains[Math.floor(gains.length * 0.9)], medianThrow: depth[depth.length >> 1], p90: depth[Math.floor(depth.length * 0.9)] };
  });
  console.log(JSON.stringify(res), errors);
  await browser.close();
})();
