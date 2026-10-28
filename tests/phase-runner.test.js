const { open, answer, check } = require('./helpers');
(async () => {
  const { browser, page: p, errors } = await open('phase-runner.html');
  await p.waitForTimeout(500);
  check('demo starts on level 1 with a bot', await p.evaluate(() => Arcade.demo.active && __s.level === 0 && !!__s.bot));
  await p.waitForFunction(() => !document.getElementById('banner').hidden, null, { timeout: 30000 });
  check('demo bot finishes the level', /★/.test(await p.textContent('#banner-title')));
  await p.screenshot({ path: 'tests/shots/phase-demo.png' });
  await p.click('#practice-btn');
  check('practice quiz during demo', await p.evaluate(() => Arcade.quiz.isOpen && Arcade.demo.active));
  for (let i = 0; i < 4; i++) await answer(p, true);
  await p.click('#quiz-next');
  await p.mouse.click(400, 300);
  await p.waitForTimeout(200);
  check('real game starts at level 1 with intro card', await p.evaluate(() => !Arcade.demo.active && __s.level === 0 && Arcade.facts.isOpen));
  await p.click('#facts-close');
  // walk right onto the heater by holding the key
  await p.keyboard.down('ArrowRight');
  await p.waitForFunction(() => __s.world.p.x > 8.3 * 40, null, { timeout: 10000 });
  await p.keyboard.up('ArrowRight');
  await p.waitForFunction(() => __s.world.p.form === 'steam' || Arcade.facts.isOpen, null, { timeout: 10000 });
  check('heater turns water to steam, with a facts card', await p.evaluate(() => Arcade.facts.isOpen) && /evaporated/.test(await p.textContent('#facts-title')));
  await p.click('#facts-close');
  check('thermometer says gas', /Steam \(gas\)/.test(await p.textContent('#thermo-text')), await p.textContent('#thermo-text'));
  // out of cold packs -> quiz
  await p.keyboard.press('c');
  await p.waitForFunction(() => Arcade.quiz.isOpen, null, { timeout: 5000 });
  check('no packs opens the quiz', /Out of cold packs/.test(await p.textContent('#quiz-who')));
  for (let i = 0; i < 4; i++) await answer(p, i < 2);
  await p.click('#quiz-next');
  check('2 right = 2 cold packs', await p.evaluate(() => __s.world.packs.cold === 2));
  await p.keyboard.press('c');
  await p.waitForTimeout(300);
  check('cold pack drops the temperature by 110', await p.evaluate(() => __s.world.p.T < 60));
  if (await p.evaluate(() => Arcade.facts.isOpen)) { check('state change shows its facts card', /froze|condensed|Straight from/.test(await p.textContent('#facts-title')), await p.textContent('#facts-title')); await p.click('#facts-close'); }
  // console hack + finish by teleporting next to the exit
  await p.evaluate(() => { game.temperature = 30; const w = __s.world; w.p.x = 20 * 40 + 6; w.p.y = 11 * 40 + 14; w.p.vx = 2; });
  await p.keyboard.down('ArrowRight');
  for (let i = 0; i < 100 && await p.evaluate(() => document.getElementById('banner').hidden); i++) {
    if (await p.evaluate(() => Arcade.facts.isOpen)) await p.click('#facts-close');
    await p.waitForTimeout(100);
  }
  await p.keyboard.up('ArrowRight');
  check('reaching the exit finishes the level', /★/.test(await p.textContent('#banner-title')));
  check('hack earns badge', /Phase hacker/.test(await p.textContent('#badges')));
  check('practice enabled after finishing', await p.isEnabled('#practice-btn'));
  await p.click('#next-btn');
  check('next level loads', await p.evaluate(() => __s.level === 1));
  await p.selectOption('#level-select', '2');
  await p.check('#mirror-check');
  check('mirrored level 3 loads', await p.evaluate(() => __s.level === 2 && __s.mirrored && __s.world.grid[11].join('').includes('E')));
  await p.click('#restart-btn');
  check('restart keeps level', await p.evaluate(() => __s.level === 2));
  await p.click('#daily-btn');
  check('daily picks a level', await p.evaluate(() => __s.level >= 0 && __s.level < 6));
  await p.screenshot({ path: 'tests/shots/phase.png' });
  check('no page errors', errors.length === 0, errors.join(' | '));
  await browser.close();
})();
