const { open } = require('./helpers');
(async () => {
  const { browser, page } = await open('balance-duel.html');
  await page.waitForTimeout(400);
  const out = await page.evaluate(() => { __bd.setStack(+(new URLSearchParams(location.search).get('stack') || 1));
    const res = [];
    for (const [lo, span, h0, h1, EXTRA] of [[8, 7, 4, 5, 0], [8, 7, 4, 5, 1], [8, 7, 5, 6, 1]]) {
      let tips = 0, draws = 0, firstLoses = 0;
      for (let g = 0; g < 600; g++) {
        const r = __bd.buildRound('T' + g);
        const rng = Math.random;
        const hand = []; const hs = h0 + Math.floor(rng() * (h1 - h0 + 1));
        for (let i = 0; i < hs; i++) hand.push(1 + Math.floor(rng() * 5));
        const st = { beam: [], pivot: 0, net: 0, limit: lo + Math.floor(rng() * span), hands: [EXTRA ? hand.slice(0, -1) : hand.slice(), hand.slice()] };
        let turn = 0, ended = false;
        while (!ended) {
          if (!st.hands[0].length && !st.hands[1].length) { draws++; break; }
          if (!st.hands[turn].length) turn = 1 - turn;
          const safe = __bd.safeMoves(st, turn);
          // smart-ish: pick the safe move leaving the opponent fewest safe moves
          let mv = null, best = 1e9;
          for (const m of safe) {
            const hands = st.hands.map((h) => h.slice()); hands[turn].splice(hands[turn].indexOf(m.m), 1);
            const sim = { beam: st.beam.concat([{ m: m.m, s: m.s }]), pivot: 0, net: m.net, limit: st.limit, hands };
            const score = __bd.safeMoves(sim, 1 - turn).length + Math.random();
            if (score < best) { best = score; mv = m; }
          }
          if (!mv) { tips++; if (turn === 0) firstLoses++; ended = true; break; }
          st.hands[turn].splice(st.hands[turn].indexOf(mv.m), 1);
          st.beam.push({ m: mv.m, s: mv.s }); st.net = mv.net;
          turn = 1 - turn;
        }
      }
      res.push({ extra: EXTRA, limit: lo + '-' + (lo + span - 1), hand: h0 + '-' + h1, tipRate: Math.round(100 * tips / (tips + draws)) + '%', firstPlayerLoses: Math.round(100 * firstLoses / Math.max(1, tips)) + '% of tips' });
    }
    return res;
  });
  out.forEach((r) => console.log(JSON.stringify(r)));
  await browser.close();
})();
