const { open, answer, check } = require('./helpers');
(async () => {
  const { browser, page: p, errors } = await open('gravity-duel.html', '#NOVA-TACO-17');
  await p.waitForTimeout(1500);
  check('demo starts on load', await p.evaluate(() => Arcade.demo.active));
  check('practice link enabled in demo', await p.isEnabled('#practice-btn'));
  await p.click('#practice-btn');
  check('practice quiz opens without ending demo', await p.evaluate(() => Arcade.quiz.isOpen && Arcade.demo.active));
  for (let i = 0; i < 4; i++) await answer(p, i % 2 === 0);
  check('practice score shown', (await p.textContent('#quiz-score')) === '2/4');
  await p.click('#quiz-next');
  check('demo still running after practice', await p.evaluate(() => Arcade.demo.active));
  check('game.help exists', await p.evaluate(() => typeof game.help === 'function'));
  await p.mouse.click(500, 300);
  await p.waitForFunction(() => document.getElementById('busy').hidden && __s.map && !Arcade.demo.active, null, { timeout: 30000 });
  check('click ends demo and starts real game', true);
  check('names restored', (await p.inputValue('#name-0')) === 'Player 1');
  check('practice disabled mid-round', !(await p.isEnabled('#practice-btn')));
  const aim = await p.evaluate(() => __s.aim[0]);
  check('starting angle 20–60, power 5', aim.angle >= 20 && aim.angle <= 60 && aim.power === 5, JSON.stringify(aim));
  // every round starts with 5 questions per player: 2 shots + 1 per right answer
  await p.waitForFunction(() => Arcade.quiz.isOpen, null, { timeout: 10000 });
  check('round starts with the shot questions', /earn your shots/.test(await p.textContent('#quiz-who')));
  check('fire locked during the questions', await p.isDisabled('#fire'));
  const first = await p.evaluate(() => __s.turn);
  for (let i = 0; i < 5; i++) await answer(p, i < 3);
  check('3 right = 5 shots', /5 shots/.test(await p.textContent('#quiz-score')), await p.textContent('#quiz-score'));
  await p.click('#quiz-next');
  await p.waitForFunction(() => Arcade.quiz.isOpen, null, { timeout: 5000 });
  check('then the other player answers', new RegExp(await p.inputValue('#name-' + (1 - first)) + ': earn').test(await p.textContent('#quiz-who')) || /earn your shots/.test(await p.textContent('#quiz-who')));
  for (let i = 0; i < 5; i++) await answer(p, false);
  await p.click('#quiz-next');
  await p.waitForTimeout(200);
  check('0 right = the base 2 shots', /of 2</.test(await p.innerHTML('#stats-' + (1 - first))) && /of 5</.test(await p.innerHTML('#stats-' + first)));
  check('fire unlocked after both players answer', await p.isEnabled('#fire'));
  const t0 = Date.now();
  while (await p.evaluate(() => document.getElementById('banner').hidden)) {
    if (await p.evaluate(() => !document.getElementById('fire').disabled)) await p.click('#fire');
    await p.waitForTimeout(40);
    if (Date.now() - t0 > 240000) break;
  }
  const shots = await p.evaluate(() => __s.roundShots);
  check('round ends by a hit or after the earned shots (no quiz when out)', !(await p.evaluate(() => Arcade.quiz.isOpen)) && shots[first] <= 5 && shots[1 - first] <= 2, JSON.stringify(shots));
  // pierce straight through the wall with gravity off
  await p.waitForFunction(() => !__s.flying && !__s.settling && !Arcade.quiz.isOpen, null, { timeout: 60000 });
  if (await p.evaluate(() => __s.roundOver)) { await p.click('#next-btn'); await p.waitForFunction(() => document.getElementById('busy').hidden && __s.map, null, { timeout: 30000 }); }
  for (let k = 0; k < 2; k++) { await p.waitForFunction(() => Arcade.quiz.isOpen, null, { timeout: 5000 }); for (let i = 0; i < 5; i++) await answer(p, true); await p.click('#quiz-next'); }
  await p.evaluate(() => { __s.held[__s.turn] = 'pierce'; __s.locked[__s.turn] = false; document.getElementById('name-0').dispatchEvent(new Event('input')); });
  const t = await p.evaluate(() => __s.turn);
  await p.click('#items-' + t + ' .item'); await answer(p, true);
  const ang = await p.evaluate(() => { const i = __s.turn, a = __s.map.ships[i], c = __s.map.ships[1 - i]; __s.map.planets.length = 0; __s.map.pickups.length = 0; game.G = 0; return Math.round(Math.atan2(-(c.y - a.y), Math.abs(c.x - a.x)) * 180 / Math.PI); });
  await p.fill('#angle-num', String(ang)); await p.fill('#power-num', '20');
  await p.click('#fire'); await p.click('#fire');
  await p.waitForFunction(() => !document.getElementById('banner').hidden, null, { timeout: 60000 });
  check('pierce goes through the wall and wins', /wins/.test(await p.textContent('#banner-title')));
  check('practice enabled after round', await p.isEnabled('#practice-btn'));
  check('no page errors', errors.length === 0, errors.join(' | '));
  await browser.close();
})();
