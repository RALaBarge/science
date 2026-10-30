const { open, answer, check } = require('./helpers');
(async () => {
  const { browser, page: p, errors } = await open('arcade.html');
  await p.waitForTimeout(300);
  const links = await p.evaluate(() => [...document.querySelectorAll('.game-card')].map((a) => a.getAttribute('href')));
  check("arcade links all six games", links.length === 6, links.join(', '));
  await p.click('#practice-btn');
  for (let i = 0; i < 4; i++) await answer(p, true);
  check("arcade practice quiz works", (await p.textContent('#quiz-score')) === '4/4');
  await p.click('#quiz-next');
  await p.screenshot({ path: 'tests/shots/arcade.png', fullPage: true });
  for (const href of links) {
    await p.goto(p.url().replace(/[^/]*\?test.*$/, href + '?test'));
    await p.waitForTimeout(400);
    check(href + ' opens and starts its demo', await p.evaluate(() => !!window.Arcade && Arcade.demo.active));
  }
  check('no page errors', errors.length === 0, errors.join(' | '));
  await browser.close();
})();
