const { open, answer, check } = require('./helpers');
(async () => {
  const { browser, page: p, errors } = await open('gravity-duel.html');
  await p.waitForTimeout(800);
  await p.mouse.click(500, 300); // leave demo
  const ready = () => p.waitForFunction(() => document.getElementById('busy').hidden && __s.map, null, { timeout: 60000 });
  await ready();
  await p.click('#daily-btn'); await ready();
  check('Daily button works', /^[A-Z]+-[A-Z]+-\d+$/.test(await p.inputValue('#seed-input')));
  // Moon
  await p.selectOption('#mode-select', 'moon'); await ready();
  check('Moon code prefix', (await p.inputValue('#seed-input')).startsWith('MOON-'));
  check('Moon gravity is half', await p.evaluate(() => Math.abs(game.G - 0.04) < 1e-9), String(await p.evaluate(() => game.G)));
  check('Moon facts card shows', await p.evaluate(() => Arcade.facts.isOpen));
  await p.click('#facts-close');
  // Magnet
  await p.selectOption('#mode-select', 'magnet'); await ready();
  check('Magnet facts card shows', await p.evaluate(() => Arcade.facts.isOpen));
  await p.click('#facts-close');
  const poles = await p.evaluate(() => __s.map.planets.map((x) => x.pole));
  check('magnets have both poles', poles.includes(1) && poles.includes(-1), poles.join(','));
  check('pole button visible', await p.isVisible('#pole-btn'));
  await p.click('#pole-btn');
  check('pole toggles to S', /S$/.test(await p.textContent('#pole-btn')));
  await p.screenshot({ path: 'tests/shots/magnet.png' });
  await p.evaluate(() => { __s.held[__s.turn] = 'flip'; document.getElementById('name-0').dispatchEvent(new Event('input')); });
  await p.click('#items-' + await p.evaluate(() => __s.turn) + ' .item'); await answer(p, true);
  const before = await p.evaluate(() => __s.map.planets[0].pole);
  const pt = await p.evaluate(() => { const q = __s.map.planets[0], r = document.getElementById('cv').getBoundingClientRect(); return { x: r.left + q.x / 1000 * r.width, y: r.top + q.y / 600 * r.height }; });
  await p.mouse.click(pt.x, pt.y);
  check('Flip switches a magnet', (await p.evaluate(() => __s.map.planets[0].pole)) === -before);
  // Golf
  await p.selectOption('#mode-select', 'golf'); await ready();
  check('Golf code prefix', (await p.inputValue('#seed-input')).startsWith('GOLF-'));
  check('scorecard shown', await p.isVisible('#card-title-1'));
  check('par shown', /Par [345]/.test(await p.textContent('#difficulty')));
  await p.screenshot({ path: 'tests/shots/golf.png' });
  const sink = async () => {
    await p.evaluate(() => { __s.map.planets.length = 0; __s.map.pickups.length = 0; game.G = 0; __s.held[0] = 'pierce'; __s.locked[0] = false; document.getElementById('name-0').dispatchEvent(new Event('input')); });
    await p.click('#items-0 .item'); await answer(p, true);
    const ang = await p.evaluate(() => { const a = __s.map.ships[0], c = __s.map.ships[1]; return Math.round(Math.atan2(-(c.y - a.y), c.x - a.x) * 180 / Math.PI); });
    await p.fill('#angle-num', String(ang)); await p.fill('#power-num', '20');
    await p.click('#fire'); await p.click('#fire');
    await p.waitForFunction(() => !document.getElementById('banner').hidden, null, { timeout: 60000 });
  };
  await sink();
  check('hole in one', /Hole in one/.test(await p.textContent('#banner-chips')), await p.textContent('#banner-title'));
  await p.click('#next-btn'); await ready();
  check('hole 2 loads', (await p.evaluate(() => __s.round)) === 2);
  await p.evaluate(() => { __s.round = 9; });
  await sink();
  check('course finishes after hole 9', (await p.textContent('#next-btn')) === 'New course', await p.textContent('#banner-text'));
  await p.click('#next-btn'); await ready();
  check('new course starts at hole 1', (await p.evaluate(() => __s.round)) === 1 && (await p.inputValue('#seed-input')).startsWith('GOLF-'));
  check('no page errors', errors.length === 0, errors.join(' | '));
  await browser.close();
})();
