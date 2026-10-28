// CPU (main thread, % of one core) with the CPU slowed 4× to approximate a school Chromebook.
const { open, cpuMeter } = require('./helpers');
(async () => {
  for (const f of (process.argv[2] || 'gravity-duel.html,laser-bounce.html,short-circuit.html,balance-duel.html,phase-runner.html,football-duel.html').split(',')) {
    const { browser, page, errors } = await open(f, '', { dpr: 1.5 });
    const cpu = await cpuMeter(page, 4);
    await page.waitForTimeout(2500);
    const demo = await cpu.measure(5000);
    await page.mouse.click(300, 300);
    await page.waitForTimeout(2500);
    for (let i = 0; i < 3; i++) if (await page.evaluate(() => window.Arcade && Arcade.facts.isOpen)) await page.click('#facts-close');
    await page.waitForTimeout(1500);
    const idle = await cpu.measure(6000);
    const heap = await cpu.heapMB();
    console.log(f.padEnd(20), 'demo', String(demo).padStart(5) + '%', '  idle', String(idle).padStart(5) + '%', '  heap', heap + 'MB', errors.length ? 'ERRORS ' + errors.join(' | ') : '');
    await browser.close();
  }
})();
