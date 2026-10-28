const { open, answer, check } = require('./helpers');
(async () => {
  const { browser, page: p, errors } = await open('short-circuit.html', '#COMET-FROG-42');
  const ready = () => p.waitForFunction(() => document.getElementById('busy').hidden && __s.lv, null, { timeout: 60000 });
  await ready();
  // hand-built circuits: battery at (1,1) pointing + right; ring through bulbs
  const physics = await p.evaluate(() => {
    const N = 70, COLS = 10;
    const blank = () => Array.from({ length: N }, () => ({ kind: 'empty', shape: 'I', rot: 0, closed: true }));
    const put = (T, x, y, t) => { T[y * COLS + x] = Object.assign({ shape: 'I', rot: 0, closed: true, plastic: false }, t); };
    // ring: battery(2,1) + right -> (3,1)L down... build a 4x3 rectangle loop with corners
    function ring(extra) {
      const T = blank();
      put(T, 2, 1, { kind: 'battery', rot: 0 });           // + right, − left
      put(T, 3, 1, { kind: 'wire', shape: 'L', rot: 1 });  // left+down
      put(T, 3, 2, { kind: 'bulb', rot: 1 });              // vertical
      put(T, 3, 3, { kind: 'wire', shape: 'L', rot: 2 });  // up+left
      put(T, 2, 3, { kind: 'wire', shape: 'I', rot: 0 });
      put(T, 1, 3, { kind: 'wire', shape: 'L', rot: 3 });  // up+right
      put(T, 1, 2, { kind: 'wire', shape: 'I', rot: 1 });
      put(T, 1, 1, { kind: 'wire', shape: 'L', rot: 0 });  // right+down
      if (extra) extra(T, put);
      return __sc.solveCircuit(T);
    }
    const one = ring();
    const series = ring((T, put) => put(T, 2, 3, { kind: 'bulb', rot: 0 }));
    const open_ = ring((T, put) => put(T, 1, 2, { kind: 'switch', rot: 1, closed: false }));
    const plastic = ring((T, put) => put(T, 1, 2, { kind: 'wire', shape: 'I', rot: 1, plastic: true }));
    return { one: [...one.current.values()], series: [...series.current.values()], open: open_.closed, plastic: plastic.closed };
  });
  check('one bulb gets full current', Math.abs(physics.one[0] - 1) < 1e-9, JSON.stringify(physics.one));
  check('two bulbs in series get half each', physics.series.every((I) => Math.abs(I - 0.5) < 1e-9), JSON.stringify(physics.series));
  check('open switch breaks the circuit', physics.open === false);
  check('plastic breaks the circuit', physics.plastic === false);
  check('demo starts', await p.evaluate(() => Arcade.demo.active));
  await p.waitForFunction(() => !document.getElementById('banner').hidden, null, { timeout: 60000 });
  check('demo wires a level itself', /★/.test(await p.textContent('#banner-title')));
  await p.screenshot({ path: 'tests/shots/circuit-demo.png' });
  await p.mouse.click(500, 300); await ready();
  check('real game starts at level 1', await p.evaluate(() => !Arcade.demo.active && __s.level === 1));
  check('intro facts card', await p.evaluate(() => Arcade.facts.isOpen));
  await p.click('#facts-close');
  const clickCell = async (c, right) => {
    const pt = await p.evaluate((c) => { const r = document.getElementById('cv').getBoundingClientRect(); return { x: r.left + ((c % 10) * 80 + 40) / 800 * r.width, y: r.top + (Math.floor(c / 10) * 80 + 40) / 560 * r.height }; }, c);
    await p.mouse.click(pt.x, pt.y, { button: right ? 'right' : 'left' });
  };
  const solveByClicks = async () => {
    for (let guard = 0; guard < 300; guard++) {
      const c = await p.evaluate(() => { const lv = __s.lv; const sh = { I: 5, L: 3, T: 7, X: 15 }; const rm = (m, r) => { for (let i = 0; i < r; i++) m = ((m << 1) | (m >> 3)) & 15; return m; }; return lv.loop.find((c) => { const t = lv.tiles[c]; return t.kind === 'switch' ? !t.closed : rm(sh[t.shape], t.rot) !== rm(sh[t.shape], t.solRot); }); });
      if (c === undefined || c === null) break;
      await clickCell(c);
    }
  };
  // right-click turns counterclockwise
  const before = await p.evaluate(() => { const c = __s.lv.loop.find((c) => __s.lv.tiles[c].kind === 'wire'); return [c, __s.lv.tiles[c].rot]; });
  await clickCell(before[0], true);
  check('right-click turns back', (await p.evaluate((c) => __s.lv.tiles[c].rot, before[0])) === (before[1] + 3) % 4);
  await solveByClicks();
  await p.waitForFunction(() => !document.getElementById('banner').hidden, null, { timeout: 5000 });
  check('solving lights the bulb and shows stars', /★/.test(await p.textContent('#banner-title')));
  await p.click('#next-btn'); await ready();
  if (await p.evaluate(() => Arcade.facts.isOpen)) await p.click('#facts-close');
  // run out the clock -> bonus quiz
  await p.evaluate(() => { __s.timeLeft = 0.3; });
  await p.waitForFunction(() => Arcade.quiz.isOpen, null, { timeout: 5000 });
  check('out of time opens bonus quiz', /Out of time/.test(await p.textContent('#quiz-who')));
  for (let i = 0; i < 4; i++) await answer(p, i < 2);
  await p.click('#quiz-next');
  check('2 right = +20 seconds', await p.evaluate(() => __s.bonusTime === 20 && __s.timeLeft > 15));
  await p.click('#hint-btn'); await answer(p, true);
  check('hint fixes a tile', await p.evaluate(() => __s.hintUsed));
  await p.evaluate(() => { __s.timeLeft = 0.3; });
  await p.waitForFunction(() => !document.getElementById('banner').hidden, null, { timeout: 5000 });
  check('second time-out fails the level', (await p.textContent('#banner-title')) === 'Out of time' && await p.isVisible('#retry-btn'));
  check('practice enabled after a level ends', await p.isEnabled('#practice-btn'));
  await p.click('#retry-btn'); await ready();
  check('retry reloads the same level', await p.evaluate(() => __s.level === 2 && !__s.failed));
  await p.evaluate(() => { game.timeLeft = 999; });
  await solveByClicks();
  await p.waitForFunction(() => !document.getElementById('banner').hidden, null, { timeout: 5000 });
  check('time hack earns badge', /Time hacker/.test(await p.textContent('#badges')));
  check('game.bulbs readable', await p.evaluate(() => game.bulbs.length >= 1 && game.bulbs[0].current > 0));
  await p.screenshot({ path: 'tests/shots/circuit.png' });
  check('no page errors', errors.length === 0, errors.join(' | '));
  await browser.close();
})();
