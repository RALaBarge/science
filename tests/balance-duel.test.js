const { open, answer, check } = require('./helpers');
(async () => {
  const { browser, page: p, errors } = await open('balance-duel.html', '#COMET-FROG-42');
  await p.waitForTimeout(600);
  const rules = await p.evaluate(() => {
    const st = { beam: [{ m: 2, s: -3 }], pivot: 0, net: -6, limit: 8, hands: [[3], [1]] };
    const mv = __bd.legalMoves(st, 0).find((x) => x.m === 3 && x.s === 2);
    return { net: mv.net, torque: __bd.torqueOf([{ m: 2, s: 3 }, { m: 3, s: -2 }], 0), shifted: __bd.torqueOf([{ m: 2, s: 3 }], 1) };
  });
  check('turning force = mass × distance', rules.torque === 0 && rules.net === 0, JSON.stringify(rules));
  check('moving the pivot changes distances', rules.shifted === 4);
  check('demo starts with CPUs', await p.evaluate(() => Arcade.demo.active) && (await p.inputValue('#name-0')) === 'CPU Orange');
  await p.waitForFunction(() => !document.getElementById('banner').hidden, null, { timeout: 90000 });
  check('demo plays a round to the end', /wins|Balanced/.test(await p.textContent('#banner-title')), await p.textContent('#banner-title'));
  await p.screenshot({ path: 'tests/shots/balance-demo.png' });
  await p.mouse.click(500, 200);
  await p.waitForTimeout(300);
  if (await p.evaluate(() => Arcade.facts.isOpen)) await p.click('#facts-close');
  check('real game vs CPU, names restored', await p.evaluate(() => !Arcade.demo.active && __s.cpu) && (await p.inputValue('#name-0')) === 'Player 1');
  // make sure it's player 1's turn on round 1
  check('player 1 starts round 1', await p.evaluate(() => __s.turn === 0));
  const clickSlot = async (s) => {
    const pt = await p.evaluate((s) => { const r = document.getElementById('cv').getBoundingClientRect(); return { x: r.left + (500 + s * 62) / 1000 * r.width, y: r.top + 280 / 520 * r.height }; }, s);
    await p.mouse.click(pt.x, pt.y);
  };
  // place a safe weight
  const safe = await p.evaluate(() => __bd.safeMoves(__s, 0)[0]);
  await p.click('#hand-0 .weight >> text=' + safe.m + 'kg');
  await clickSlot(safe.s);
  check('weight placed', await p.evaluate(() => __s.beam.some((w) => w.owner === 0)));
  await p.waitForFunction(() => __s.turn === 0 && !__s.cpuBusy || __s.roundOver, null, { timeout: 10000 });
  check('CPU answers with a move', await p.evaluate(() => __s.beam.some((w) => w.owner === 1) || __s.roundOver));
  // pivot trick
  if (!(await p.evaluate(() => __s.roundOver))) {
    await p.click('#pivot-btn'); await answer(p, true);
    check('pivot buttons appear', await p.isVisible('#pivot-left'));
    const dir = await p.evaluate(() => { for (const d of [-1, 1]) { const np = __s.pivot + d; if (!__s.beam.some((w) => w.s === np) && Math.abs(__bd.torqueOf(__s.beam, np)) <= __s.limit) return d; } return 1; });
    const before = await p.evaluate(() => __s.pivot);
    await p.click(dir < 0 ? '#pivot-left' : '#pivot-right');
    check('pivot moved', (await p.evaluate(() => __s.pivot)) === before + dir);
  }
  // force a tip: put the biggest weight at the far end on the side it already leans
  if (!(await p.evaluate(() => __s.roundOver))) {
    await p.evaluate(() => { __s.limit = 1; });
    const m = await p.evaluate(() => Math.max(...__s.hands[0]));
    await p.click('#hand-0 .weight >> text=' + m + 'kg');
    await clickSlot(6);
  }
  await p.waitForFunction(() => !document.getElementById('banner').hidden, null, { timeout: 10000 });
  check('tipping ends the round', /wins/.test(await p.textContent('#banner-title')));
  check('practice enabled after round', await p.isEnabled('#practice-btn'));
  await p.click('#next-btn');
  // rescue: set up a beam with no safe moves for whoever's turn it is (two humans)
  await p.selectOption('#p2-select', 'human');
  await p.evaluate(() => { __s.beam = [{ m: 5, s: 6, owner: 1 }]; __s.pivot = 0; __s.net = 30; __s.limit = 10; __s.hands[__s.turn] = [1]; document.getElementById('name-0').dispatchEvent(new Event('input')); });
  check('rescue unlocks with no safe moves', await p.isEnabled('#rescue-btn'), await p.textContent('#safe-info'));
  await p.click('#rescue-btn');
  for (let i = 0; i < 4; i++) await answer(p, i === 0);
  await p.click('#quiz-next');
  check('one right answer lifts a weight', await p.evaluate(() => __s.beam.length === 0 && __s.net === 0));
  await p.evaluate(() => { game.limit = 99; });
  check('limit hack is visible', (await p.textContent('#limit')) === '99');
  await p.screenshot({ path: 'tests/shots/balance.png' });
  check('no page errors', errors.length === 0, errors.join(' | '));
  await browser.close();
})();
