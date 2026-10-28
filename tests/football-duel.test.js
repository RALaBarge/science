// Football Duel: physics, determinism, the demo, a full game against the CPU played through the
// real inputs (keys for answers, clicks on the field for throws), the play clock, and the hacker layer.
const { open, check } = require('./helpers');

(async () => {
  const { browser, page, errors } = await open('football-duel.html', '#TEST-FIELD-21');
  await page.setViewportSize({ width: 1366, height: 768 });
  const S = (f, a) => page.evaluate(f, a);
  const seen = new Set();

  // ---- physics ----
  const phys = await S(() => {
    const F = window.__fb, g = F.P.gravity;
    const f = F.flight(0, 20, 20, 20, 1);              // 20 yards at 35°
    const sin35 = Math.sin(35 * Math.PI / 180), cos35 = Math.cos(35 * Math.PI / 180);
    const v = Math.sqrt(20 * g / (2 * sin35 * cos35));
    const far = F.flight(0, 20, 200, 20, 2);           // too far: clamps to the arm's max range at 50°
    const maxR = F.P.arm * F.P.arm * Math.sin(100 * Math.PI / 180) / g;
    const bullet = F.flight(0, 20, 20, 20, 0), lob = F.flight(0, 20, 20, 20, 2);
    return { T: f.T, Tcalc: 2 * v * sin35 / g, R: f.R, farClamped: far.clamped, farR: far.R, maxR, bulletT: bullet.T, lobT: lob.T };
  });
  check('flight time matches 2·v·sin(angle)/g', Math.abs(phys.T - phys.Tcalc) < 0.02, phys.T.toFixed(3) + ' vs ' + phys.Tcalc.toFixed(3));
  check('ball lands where it was aimed', Math.abs(phys.R - 20) < 0.01);
  check('throws past the arm fall short at max range', phys.farClamped && Math.abs(phys.farR - phys.maxR) < 0.1, phys.farR.toFixed(1) + ' yd');
  check('a bullet gets there faster than a lob', phys.bulletT < phys.lobT, phys.bulletT.toFixed(2) + ' s vs ' + phys.lobT.toFixed(2) + ' s');

  // ---- determinism ----
  const det = await S(() => {
    const F = window.__fb;
    const a = JSON.stringify(F.buildPlay('SAME-CODE-7', 3)), b = JSON.stringify(F.buildPlay('SAME-CODE-7', 3));
    const r1 = JSON.stringify(F.autoplay('SAME-CODE-7', 3, 30)), r2 = JSON.stringify(F.autoplay('SAME-CODE-7', 3, 30));
    const tally = {};
    for (let i = 0; i < 300; i++) { const r = F.autoplay('MIX-' + i, i, 20 + (i % 50)); const k = r.first ? r.first.type : 'none'; tally[k] = (tally[k] || 0) + 1; }
    return { same: a === b && r1 === r2, tally };
  });
  check('same code builds the same play and the same result', det.same);
  const t = det.tally, n = 300;
  check('CPU passes: a mix of clean catches, jump balls and picks', (t.catch || 0) > n * 0.3 && (t.race || 0) > n * 0.15 && (t.race || 0) < n * 0.55 && (t.pick || 0) < n * 0.25, JSON.stringify(t));

  // ---- demo ----
  await page.waitForTimeout(6000);
  const demo = await S(() => ({ active: window.Arcade.demo.active, plays: window.__s.playN, practice: !document.getElementById('practice-btn').disabled }));
  check('demo plays on its own', demo.active && demo.plays >= 1, demo.plays + ' plays');
  check('practice quiz open during the demo', demo.practice);
  await page.mouse.click(683, 500);
  await page.waitForTimeout(300);
  const started = await S(() => ({ demo: window.Arcade.demo.active, code: window.__s.code, phase: window.__s.phase, drives: window.__s.drivesEach, practice: !document.getElementById('practice-btn').disabled }));
  check('a click ends the demo and starts the game', !started.demo && started.code === 'TEST-FIELD-21' && started.phase === 'call', JSON.stringify(started));
  check('practice quiz locked during a game', !started.practice);

  // ---- play clock: let it run out once ----
  await S(() => { window.game.playClock = 3; });
  // get to a clock phase where Player 1 is answering
  let guard = 0;
  while (guard++ < 400) {
    const st = await S(() => ({ ph: window.__s.phase, o: window.__s.poss }));
    if (st.ph === 'clock' && st.o === 0) break;
    await drive(st);
    await page.waitForTimeout(100);
  }
  const before = await S(() => window.__s.los);
  await page.waitForTimeout(3600);
  const after = await S(() => ({ los: window.__s.los, banner: document.getElementById('play-banner').textContent }));
  check('play clock runs out: delay of game, back 5 yards', /Delay of game/.test(after.banner) && after.los === Math.max(1, before - 5), before + ' → ' + after.los);
  await S(() => window.game.reset());

  // ---- a full game against the CPU ----
  const t0 = Date.now();
  while (Date.now() - t0 < 360000) {
    const st = await S(() => ({ ph: window.__s.phase, o: window.__s.poss, over: window.__s.over }));
    if (st.over) break;
    seen.add(st.ph);
    await drive(st);
    await page.waitForTimeout(120);
  }
  const end = await S(() => {
    const s = window.__s;
    return { over: s.over, score: s.score, stats: s.stats, answers: window.Arcade.answers.filter((a) => a.game === 'football').length,
      title: document.getElementById('banner-title').textContent, shown: !document.getElementById('banner').hidden,
      practice: !document.getElementById('practice-btn').disabled };
  });
  check('full game reaches the final whistle', end.over && end.shown, end.title + ' ' + end.score.join('-'));
  check('phases seen: call, clock, live, result, facts card', ['call', 'clock', 'live', 'result', 'facts'].every((p) => seen.has(p)), [...seen].join(','));
  check('passes thrown and caught', end.stats[0].att > 0 && end.stats[0].comp <= end.stats[0].att, JSON.stringify(end.stats[0]));
  check('answers logged for the scoreboard', end.answers >= 6, end.answers + ' answers');
  check('practice quiz open after the game', end.practice);
  const hack = await S(() => typeof window.game.help === 'function' && window.game.gravity === 10.7);
  check('console: game.help and physics knobs', hack);
  check('no page errors', errors.length === 0, errors.join(' | '));
  await browser.close();

  // Plays one step for Player 1 through the real inputs. The CPU plays blue.
  async function drive(st) {
    const info = await S(() => {
      const s = window.__s;
      return { ph: s.phase, o: s.poss, q: s.q && s.q.answer, ball: !!(s.sim && s.sim.ball), t: s.sim ? s.sim.t : 0, answered: s.answered, pend: false };
    });
    const r = Math.random();
    if (await S(() => window.Arcade.facts.isOpen)) { seen.add('facts'); await page.click('#facts-close'); return; }
    if (info.ph === 'call' && info.o === 1) await page.keyboard.press(String(1 + Math.floor(r * 3)));
    else if ((info.ph === 'clock' || info.ph === 'pat') && info.o === 0 && info.q !== null) {
      const right = r < 0.8, k = right ? info.q : (info.q + 1) % 4;
      await page.keyboard.press(String(k + 1));
    } else if (info.ph === 'pick' && info.o === 1 && info.q !== null) await page.keyboard.press(String((r < 0.6 ? info.q : (info.q + 2) % 4) + 1));
    else if (info.ph === 'race' && info.q !== null && !info.answered[0]) {
      await page.waitForTimeout(400 + r * 2500);
      const q = await S(() => window.__s.q && window.__s.q.answer);
      if (q !== null && q !== undefined) await page.keyboard.press(String((r < 0.6 ? q : (q + 1) % 4) + 1));
    } else if (info.ph === 'live' && info.o === 0 && !info.ball && info.t > 1.2) {
      // throw where the CPU's own read says the open man will be, by clicking that spot on the field
      const spot = await S(() => {
        const s = window.__s, best = window.__fb.cpuChoose(s.sim);
        if (!best) return null;
        const cv = document.getElementById('cv'), b = cv.getBoundingClientRect();
        document.querySelector('.throw[data-t="' + best.type + '"]').click();
        return { x: b.left + (best.x - s.cam) * 14 / 1000 * b.width, y: b.top + best.y * 14 / 560 * b.height };
      });
      if (spot) await page.mouse.click(spot.x, spot.y);
    } else if (['result', 'reveal'].includes(info.ph)) await S(() => window.__fb.skip());
  }
})();
