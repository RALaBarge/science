// Football Duel: two players (or one and the CPU) take turns on offense. Every play starts with a
// science question: the defense picks the topic, the offense answers before the 15-second play clock
// runs out. A right answer snaps the ball; the quarterback throws to a spot on the field. If a receiver
// and a defender both reach the ball, both players race to answer the same question for it.
// Science: projectile motion. Flight time = 2·v·sin(angle)/g, range = v²·sin(2·angle)/g.
(function () {
  'use strict';
  const A = window.Arcade;
  const { $, rngFor, randomCode, cleanCode, toast } = A;
  const dailyCode = () => A.dailyCode('football');
  const TEST = /[?&]test\b/.test(location.search);

  // ---------- constants (field units are yards, time is seconds) ----------
  const W = 1000, H = 560;     // canvas logical size
  const PX = 14;               // pixels per yard
  const FW = 40;               // field width in yards (a 7-on-7 field)
  const VIEW = W / PX;         // yards visible across the canvas
  const DT = 1 / 60;           // fixed physics step
  const COLORS = ['#ff8a5c', '#5cc8ff'];
  const THROWS = [{ name: 'Bullet', deg: 20 }, { name: 'Touch', deg: 35 }, { name: 'Lob', deg: 50 }];
  const REACH = 1.3;           // how far a player can reach for the ball (yards)
  const CONTEST = 1.5;         // a second player this close turns a catch into a jump ball
  const REACT = 0.35;          // seconds a defender needs to react to a cut or a throw
  const LAG = Math.round(REACT / (1 / 60));
  const REACH_H = 2.4;         // the ball is catchable below this height (yards)
  const QB_DEPTH = 5;          // shotgun: the quarterback stands 5 yards behind the line
  const DEFAULTS = { gravity: 10.7, arm: 25, receiverSpeed: 6.4, defenderSpeed: 1, playClock: 15, pocketTime: 1 };
  const P = Object.assign({}, DEFAULTS); // hackable from the console
  const counts = A.topicCounts();
  const TOPIC_POOL = ['Motion', 'Forces', 'Gravity', 'Energy', 'Matter', 'Light', 'Electricity', 'Heat', 'Sound', 'Space', 'Earth', 'Plants', 'Skills']
    .filter((t) => (counts[t] || 0) >= 5);

  // Routes: waypoints as [yards forward, yards toward the middle of the field] from where the receiver lines up.
  const ROUTES = {
    go: { pts: [[34, 0]] },
    seam: { pts: [[30, 2]] },
    slant: { pts: [[3, 0], [16, 11]] },
    out: { pts: [[8, 0], [9, -14]] },
    dig: { pts: [[11, 0], [11, 16]] },
    post: { pts: [[10, 0], [26, 10]] },
    corner: { pts: [[10, 0], [24, -9]] },
    curl: { pts: [[11, 0], [9, 1]], stop: true },
    flat: { pts: [[1, 0], [3, -12]] }
  };
  const SHORT = ['slant', 'curl', 'flat', 'out'], DEEP = ['go', 'post', 'corner', 'seam'], MID = ['dig', 'out', 'slant', 'curl', 'post'];
  const LINEUP = [5, 13, 35]; // receivers' starting spots across the field

  const clampY = (y) => (y < 1 ? 1 : y > FW - 1 ? FW - 1 : y);

  // ---------- a play, built from the game code ----------
  // Same code + same play number = same routes, coverage, topic cards and CPU behavior.
  function buildPlay(code, n) {
    const rng = rngFor(code + '|play|' + n);
    const routes = A.shuffled([A.pick(rng, SHORT), A.pick(rng, DEEP), A.pick(rng, MID)], rng);
    const cover = LINEUP.map(() => ({ cushion: 2.5 + rng() * 5, speed: 5.2 + rng() * 1.1 }));
    const cards = A.shuffled(TOPIC_POOL, rng).slice(0, 3);
    const err = () => (rng() - 0.5) * 1.8;
    return {
      n, routes, cover, cards,
      pocket: 3.4 + rng() * 1.4,
      cpu: {
        throwAt: 1.1 + rng() * 1.4, aim: [err(), err()],
        ansDelay: 1.8 + rng() * 4.5, ansRight: rng() < 0.72,
        raceDelay: [2.5 + rng() * 5, 2.5 + rng() * 5], raceRight: [rng() < 0.7, rng() < 0.7],
        pickDelay: 2 + rng() * 4, pickRight: rng() < 0.6, demoRight: rng() < 0.88
      }
    };
  }

  // ---------- physics of a throw ----------
  // Given where the ball should land and the launch angle, find the speed it needs. If that's more
  // than the quarterback's arm, the ball falls short at the farthest the arm can throw at that angle.
  function flight(qx, qy, tx, ty, type) {
    A.sincos(THROWS[type].deg * A.DEG);
    const s = A.sc.sin, c = A.sc.cos, sin2 = 2 * s * c;
    let dx = tx - qx, dy = ty - qy, R = A.dist(dx, dy);
    if (R < 1) { dx = 1; dy = 0; R = 1; }
    let v = Math.sqrt(R * P.gravity / sin2), clamped = false;
    if (v > P.arm) {
      v = P.arm;
      const Rmax = v * v * sin2 / P.gravity;
      dx = dx * Rmax / R; dy = dy * Rmax / R; R = Rmax; clamped = true;
    }
    const vz = v * s, T = 2 * vz / P.gravity;
    return { x0: qx, y0: qy, dx, dy, R, T, vz, v, clamped, tx: qx + dx, ty: qy + dy, type };
  }
  const ballAt = (b, t) => ({ x: b.x0 + b.dx * t / b.T, y: b.y0 + b.dy * t / b.T, h: b.vz * t - P.gravity * t * t / 2 });

  // ---------- the field simulation (no DOM, so tests can run it) ----------
  function makeSim(play, los) {
    const recs = LINEUP.map((y0, i) => {
      const sgn = y0 < FW / 2 ? 1 : -1;
      const r = ROUTES[play.routes[i]];
      const pts = r.pts.map(([f, inw]) => [los + f, clampY(y0 + inw * sgn)]);
      return { x: los, y: y0, vx: 0, vy: 0, pts, wp: 0, stop: !!r.stop, route: play.routes[i], target: null, hx: [], hy: [] };
    });
    const defs = recs.map((r, i) => {
      const c = play.cover[i];
      return { x: los + c.cushion, y: r.y + (r.y < FW / 2 ? 1 : -1), vx: 0, vy: 0, man: i, c0: c.cushion, v: c.speed * P.defenderSpeed, hawk: false };
    });
    const qb = { x: los - QB_DEPTH, y: FW / 2 };
    const rusher = { x: los + 1, y: FW / 2 + 3, vx: 0, vy: 0 };
    const pocket = play.pocket * P.pocketTime;
    rusher.v = A.dist(rusher.x - qb.x, rusher.y - qb.y) / pocket;
    return { t: 0, los, qb, recs, defs, rusher, ball: null, bt: 0, carrier: -1, done: false, cpuWaited: false, throwAt: play.cpu.throwAt };
  }

  function moveToward(o, tx, ty, v) {
    const dx = tx - o.x, dy = ty - o.y, d = A.dist(dx, dy), step = v * DT;
    if (d <= step || d === 0) { o.vx = d === 0 ? 0 : dx / DT; o.vy = d === 0 ? 0 : dy / DT; o.x = tx; o.y = ty; return true; }
    o.vx = dx / d * v; o.vy = dy / d * v;
    o.x += o.vx * DT; o.y += o.vy * DT;
    return false;
  }

  function runRoute(r) {
    if (r.target) { if (moveToward(r, r.target.x, r.target.y, P.receiverSpeed)) { r.vx = 0; r.vy = 0; } return; }
    if (r.wp >= r.pts.length) {
      if (r.stop) { r.vx = 0; r.vy = 0; return; }
      // keep running the way the route ends
      const a = r.pts.length > 1 ? r.pts[r.pts.length - 2] : [r.pts[0][0] - 1, r.pts[0][1]];
      const b = r.pts[r.pts.length - 1];
      const dx = b[0] - a[0], dy = b[1] - a[1], d = A.dist(dx, dy) || 1;
      r.pts.push([Math.min(118, b[0] + dx / d * 40), clampY(b[1] + dy / d * 40)]);
    }
    const p = r.pts[r.wp];
    if (moveToward(r, p[0], p[1], P.receiverSpeed)) r.wp++;
    r.y = clampY(r.y);
  }

  // One physics step. Returns an event when the play reaches a decision, or null.
  function stepSim(sim) {
    if (sim.done) return null;
    sim.t += DT;
    const t = sim.t;
    if (sim.carrier >= 0) return stepRun(sim);
    for (const r of sim.recs) {
      runRoute(r);
      r.hx.push(r.x); r.hy.push(r.y);
      if (r.hx.length > LAG + 2) { r.hx.shift(); r.hy.shift(); }
    }
    // Defenders cover their receiver, but they react to where he was a moment ago, so a sharp cut gains
    // a step. After a throw, the ones who can get to the ball in time go for it.
    if (sim.ball && !sim.hawked && sim.bt >= REACT) {
      sim.hawked = true;
      const left = sim.ball.T - sim.bt;
      for (const d of sim.defs) if (A.dist(d.x - sim.ball.tx, d.y - sim.ball.ty) < d.v * left + 1) d.hawk = true;
    }
    for (const d of sim.defs) {
      if (d.hawk) { moveToward(d, sim.ball.tx, sim.ball.ty, d.v); continue; }
      if (t < REACT) { d.x += 2 * DT; d.vx = 2; d.vy = 0; continue; } // read the play: backpedal
      const r = sim.recs[d.man], n = r.hx.length;
      const lx = r.hx[0], ly = r.hy[0], vx = n > 1 ? (r.hx[1] - r.hx[0]) / DT : 0, vy = n > 1 ? (r.hy[1] - r.hy[0]) / DT : 0;
      const k = 1 - t / 2.5, c = d.c0 * (k > 0 ? k : 0) + 0.6;
      moveToward(d, lx + vx * 0.6 + c, ly + vy * 0.6, d.v);
    }
    if (!sim.ball) {
      moveToward(sim.rusher, sim.qb.x, sim.qb.y, sim.rusher.v);
      if (A.dist(sim.rusher.x - sim.qb.x, sim.rusher.y - sim.qb.y) < 1) { sim.done = true; return { type: 'sack', x: sim.qb.x }; }
      return null;
    }
    // the ball is in the air
    sim.bt += DT;
    const b = sim.ball, p = ballAt(b, sim.bt);
    sim.rusher.vx = 0; sim.rusher.vy = 0;
    if (p.h <= REACH_H && A.dist(p.x - b.x0, p.y - b.y0) > 3) {
      let dr = 99, ri = -1, dd = 99, di = -1;
      sim.recs.forEach((r, i) => { const d = A.dist(r.x - p.x, r.y - p.y); if (d < dr) { dr = d; ri = i; } });
      sim.defs.forEach((o, i) => { const d = A.dist(o.x - p.x, o.y - p.y); if (d < dd) { dd = d; di = i; } });
      const at = { x: p.x, y: p.y };
      if ((dr <= REACH && dd <= CONTEST) || (dd <= REACH && dr <= CONTEST)) { sim.done = true; return { type: 'race', r: ri, d: di, at }; }
      if (dr <= REACH) {
        if (p.y < 0 || p.y > FW || p.x > 110) { sim.done = true; return { type: 'incomplete', why: 'out' }; }
        sim.carrier = ri; sim.catchAt = at; sim.carrierStart = sim.t;
        const r = sim.recs[ri]; r.x = p.x; r.y = clampY(p.y);
        if (p.x >= 100) { sim.done = true; return { type: 'td', x: p.x, at, r: ri }; }
        return { type: 'catch', r: ri, at };
      }
      if (dd <= REACH) { sim.done = true; return { type: 'pick', d: di, at }; }
    }
    if (p.h < 0) { sim.done = true; return { type: 'incomplete', at: { x: p.x, y: p.y } }; }
    return null;
  }

  // After a clean catch the receiver runs for the end zone and the defenders chase.
  function stepRun(sim) {
    const c = sim.recs[sim.carrier];
    const cv = P.receiverSpeed * 0.88; // slower with the ball
    c.vx = cv; c.vy = 0; c.x += cv * DT;
    for (const d of sim.defs) {
      moveToward(d, c.x + cv * 0.5, c.y, d.v * 1.25); // pursuit angle: aim ahead of the runner
      if (A.dist(d.x - c.x, d.y - c.y) < 1) { sim.done = true; return { type: 'tackle', x: c.x }; }
    }
    if (c.x >= 100) { sim.done = true; return { type: 'td', x: c.x }; }
    if (sim.t - sim.carrierStart > 3) { sim.done = true; return { type: 'tackle', x: c.x }; }
    return null;
  }

  function throwBall(sim, tx, ty, type) {
    if (sim.ball || sim.done) return null;
    const f = flight(sim.qb.x, sim.qb.y, tx, ty, type);
    sim.ball = f; sim.bt = 0;
    // the receiver closest to where it will land goes for it; defenders who can get there do too
    let best = -1, bd = 1e9;
    sim.recs.forEach((r, i) => { const d = A.dist(r.x - f.tx, r.y - f.ty); if (d < bd) { bd = d; best = i; } });
    if (bd < P.receiverSpeed * f.T + 4) sim.recs[best].target = { x: f.tx, y: f.ty };
    sim.hawked = false;
    return f;
  }

  // The CPU quarterback: for each receiver and each throw, predict where they meet and how close
  // the nearest defender could get by then. Throw to the most open spot, a bit deeper if it can.
  function cpuChoose(sim) {
    let best = null;
    for (let ri = 0; ri < sim.recs.length; ri++) for (let ty = 0; ty < 3; ty++) {
      const r = sim.recs[ri];
      let lx = r.x + r.vx * 1.2, ly = r.y + r.vy * 1.2, f = null;
      for (let it = 0; it < 3; it++) {
        f = flight(sim.qb.x, sim.qb.y, lx, ly, ty);
        lx = r.x + r.vx * f.T; ly = clampY(r.y + r.vy * f.T);
      }
      f = flight(sim.qb.x, sim.qb.y, lx, ly, ty);
      if (f.clamped) continue;
      let sep = 99;
      for (const d of sim.defs) { const s = A.dist(d.x - f.tx, d.y - f.ty) - d.v * (f.T - REACT); if (s < sep) sep = s; }
      const score = sep + 0.05 * (f.tx - sim.los) - 0.6 * f.T;
      if (!best || score > best.score) best = { score, sep, x: lx, y: ly, type: ty };
    }
    return best;
  }
  function cpuMaybeThrow(sim, play) {
    if (sim.ball || sim.t < sim.throwAt) return null;
    const best = cpuChoose(sim);
    if (!best) return null;
    if (best.sep < 0 && !sim.cpuWaited && sim.t < play.pocket * P.pocketTime - 0.8) { sim.cpuWaited = true; sim.throwAt += 0.5; return null; }
    return throwBall(sim, best.x + play.cpu.aim[0], clampY(best.y + play.cpu.aim[1]), best.type);
  }

  // ---------- game state ----------
  const S = {
    code: '', drivesEach: 3, drive: 0, poss: 0, score: [0, 0],
    los: 25, down: 1, fd: 35, playN: 0, play: null, sim: null,
    phase: 'idle', pat: false, q: null, answered: [false, false], qWho: -1, clockLeft: 15,
    throwType: [1, 1], cam: 13, aim: null, gen: 0, over: false, hacked: false,
    driveClean: true, factsShown: false, raceTimers: [],
    stats: [newStats(), newStats()], topicRec: [{}, {}], p2cpu: true
  };
  function newStats() { return { att: 0, comp: 0, yds: 0, int: 0, td: 0, qr: 0, qt: 0, races: 0 }; }
  const isCpu = (p) => A.demo.active || (p === 1 && S.p2cpu);
  const offense = () => S.poss, defense = () => 1 - S.poss;
  const later = (fn, ms) => { const g = S.gen; setTimeout(() => { if (g === S.gen) fn(); }, ms); };
  const pace = (ms) => (A.demo.active ? ms * 0.6 : ms);

  // ---------- DOM ----------
  const cv = $('cv'), ctx = cv.getContext('2d'), stage = $('stage');
  const names = [$('name-0'), $('name-1')];
  const nameOf = (p) => names[p].value.trim() || (p === 1 && S.p2cpu ? 'CPU' : 'Player ' + (p + 1));
  const badges = A.makeBadges($('badges'));
  let dpr = 1, scale = 1;
  const animating = () => S.phase === 'live' || Math.abs(S.cam - camTarget()) > 0.02;
  const loop = A.loop(frame, animating);
  const wake = loop.wake;

  function resize() {
    const top = stage.getBoundingClientRect().top + window.scrollY;
    const room = window.innerHeight - top - 64;
    stage.style.maxWidth = Math.max(420, Math.floor(room * W / H)) + 'px';
    const cssW = stage.clientWidth;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.style.height = cssW * (H / W) + 'px';
    cv.width = Math.round(cssW * dpr);
    cv.height = Math.round(cssW * (H / W) * dpr);
    scale = cssW / W;
    wake();
  }
  window.addEventListener('resize', resize);

  // ---------- drawing ----------
  function camTarget() {
    const base = S.los - 12;
    const sim = S.sim;
    if (!sim || S.phase === 'call' || S.phase === 'clock') return base;
    let x = base;
    if (sim.carrier >= 0) x = Math.max(base, sim.recs[sim.carrier].x - VIEW + 14);
    else if (sim.ball) x = Math.max(base, sim.ball.tx - VIEW + 12);
    return Math.min(x, 110 + 2 - VIEW);
  }
  const sx = (x) => (x - S.cam) * PX, sy = (y) => y * PX;

  function frame(now) {
    // physics: fixed steps, paced by real time
    if (S.phase === 'live' && !A.modalOpen()) {
      const last = frame.last || now;
      let acc = (frame.acc || 0) + Math.min(0.1, (now - last) / 1000);
      while (acc >= DT && S.phase === 'live') { acc -= DT; tick(); }
      frame.acc = acc;
    }
    frame.last = now;
    const tgt = camTarget();
    S.cam += (tgt - S.cam) * (A.reduceMotion ? 1 : 0.12);
    if (Math.abs(tgt - S.cam) < 0.02) S.cam = tgt;
    draw();
  }

  function draw() {
    const k = dpr * scale;
    ctx.setTransform(k, 0, 0, k, 0, 0);
    const own = COLORS[offense()], opp = COLORS[defense()];
    // ground: 5-yard stripes, end zones in each team's color
    const first = Math.floor(S.cam / 5) * 5;
    for (let x = first; x < S.cam + VIEW + 5; x += 5) {
      let col;
      if (x < -10 || x >= 110) col = '#0d1a12';
      else if (x < 0) col = mix(own);
      else if (x >= 100) col = mix(opp);
      else col = (x / 5) % 2 === 0 ? '#2e6e3a' : '#2a6535';
      ctx.fillStyle = col;
      ctx.fillRect(sx(x), 0, 5 * PX + 1, H);
    }
    // yard lines, numbers, hash marks
    ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '700 22px "Saira Semi Condensed", sans-serif'; ctx.textAlign = 'center';
    for (let x = Math.max(0, first); x <= Math.min(100, S.cam + VIEW); x += 5) {
      ctx.beginPath(); ctx.moveTo(sx(x), 0); ctx.lineTo(sx(x), H); ctx.stroke();
      if (x % 10 === 0 && x > 0 && x < 100) {
        const n = String(x <= 50 ? x : 100 - x);
        ctx.fillText(n, sx(x), 52); ctx.fillText(n, sx(x), H - 34);
      }
    }
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    for (let x = Math.ceil(Math.max(0, S.cam)); x < Math.min(100, S.cam + VIEW); x++) {
      ctx.fillRect(sx(x) - 1, sy(FW / 3) - 4, 2, 8); ctx.fillRect(sx(x) - 1, sy(FW * 2 / 3) - 4, 2, 8);
    }
    // end zone names
    ctx.save(); ctx.font = '800 30px "Saira Semi Condensed", sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.35)';
    for (const [x, p] of [[-5, offense()], [105, defense()]]) {
      if (sx(x) < -40 || sx(x) > W + 40) continue;
      ctx.save(); ctx.translate(sx(x), H / 2); ctx.rotate(x < 0 ? -Math.PI / 2 : Math.PI / 2);
      ctx.fillText(nameOf(p).toUpperCase(), 0, 10); ctx.restore();
    }
    ctx.restore();
    // line of scrimmage and the first-down line
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#6fb6ff'; ctx.beginPath(); ctx.moveTo(sx(S.los), 0); ctx.lineTo(sx(S.los), H); ctx.stroke();
    if (S.fd < 100) { ctx.strokeStyle = '#ffd166'; ctx.beginPath(); ctx.moveTo(sx(S.fd), 0); ctx.lineTo(sx(S.fd), H); ctx.stroke(); }

    const sim = S.sim;
    if (!sim) return;
    // route art: before the snap, and faintly until the throw so the quarterback can lead the receiver
    const pre = S.phase === 'call' || S.phase === 'clock' || S.phase === 'presnap' || S.phase === 'reveal';
    if (pre || (S.phase === 'live' && !sim.ball)) {
      ctx.setLineDash([6, 6]); ctx.lineWidth = 2; ctx.strokeStyle = pre ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.34)';
      for (const r of sim.recs) {
        ctx.beginPath(); ctx.moveTo(sx(r.x), sy(r.y));
        for (let i = r.wp; i < r.pts.length; i++) ctx.lineTo(sx(r.pts[i][0]), sy(r.pts[i][1]));
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }
    // aim helper for a human quarterback
    if (S.phase === 'live' && !sim.ball && S.aim && !isCpu(offense())) {
      const f = flight(sim.qb.x, sim.qb.y, S.aim.x, S.aim.y, S.throwType[offense()]);
      ctx.setLineDash([4, 6]); ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(sx(sim.qb.x), sy(sim.qb.y)); ctx.lineTo(sx(f.tx), sy(f.ty)); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = f.clamped ? '#ff6b81' : '#ffd166'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(sx(f.tx), sy(f.ty), REACH * PX, 0, Math.PI * 2); ctx.stroke();
      label(f.tx, f.ty - 2.2, (f.clamped ? 'Max range · ' : '') + f.T.toFixed(1) + ' s in the air', f.clamped ? '#ff6b81' : '#ffd166');
    }
    // players: offense are circles, defense are X's (like a coach's chalkboard)
    drawPlayer(sim.qb.x, sim.qb.y, own, 'QB', false);
    sim.recs.forEach((r, i) => drawPlayer(r.x, r.y, own, String(i + 1), false, sim.carrier === i));
    sim.defs.forEach((d) => drawPlayer(d.x, d.y, opp, '', true));
    drawPlayer(sim.rusher.x, sim.rusher.y, opp, '', true);
    // the ball: a shadow on the grass and the ball raised by its height
    if (sim.ball && sim.carrier < 0 && !sim.frozenAt) {
      const p = ballAt(sim.ball, sim.bt);
      drawBall(p.x, p.y, p.h > 0 ? p.h : 0);
    } else if (sim.frozenAt) drawBall(sim.frozenAt.x, sim.frozenAt.y, 1.2);
  }
  const mixCache = {};
  function mix(c) { return mixCache[c] || (mixCache[c] = c + '55'); }
  function label(x, y, text, color) {
    ctx.font = '600 13px "IBM Plex Mono", monospace'; ctx.textAlign = 'center';
    const w = ctx.measureText(text).width + 12;
    ctx.fillStyle = 'rgba(10,15,31,0.82)'; ctx.fillRect(sx(x) - w / 2, sy(y) - 13, w, 19);
    ctx.fillStyle = color; ctx.fillText(text, sx(x), sy(y) + 1);
  }
  function drawPlayer(x, y, color, text, isX, carrier) {
    const X = sx(x), Y = sy(y), r = 0.85 * PX;
    if (X < -20 || X > W + 20) return;
    if (isX) {
      ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(X - r * 0.8, Y - r * 0.8); ctx.lineTo(X + r * 0.8, Y + r * 0.8);
      ctx.moveTo(X + r * 0.8, Y - r * 0.8); ctx.lineTo(X - r * 0.8, Y + r * 0.8); ctx.stroke();
      return;
    }
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(X, Y, r, 0, Math.PI * 2); ctx.fill();
    if (carrier) { ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 3; ctx.stroke(); }
    ctx.fillStyle = '#10131f'; ctx.font = '700 12px "IBM Plex Mono", monospace'; ctx.textAlign = 'center';
    ctx.fillText(text, X, Y + 4);
  }
  function drawBall(x, y, h) {
    const X = sx(x), Y = sy(y);
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(X, Y, 7, 4, 0, 0, Math.PI * 2); ctx.fill();
    const lift = h * PX * 0.55, s = 1 + h / 10;
    ctx.fillStyle = '#9a5b2e'; ctx.beginPath(); ctx.ellipse(X, Y - lift, 8 * s, 5 * s, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#f3e6d0'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X - 3 * s, Y - lift - 1); ctx.lineTo(X + 3 * s, Y - lift + 1); ctx.stroke();
  }

  // ---------- play flow ----------
  function tick() {
    const sim = S.sim;
    if (isCpu(offense()) && !sim.ball) { const f = cpuMaybeThrow(sim, S.play); if (f) onThrow(f); }
    const ev = stepSim(sim);
    if (ev) onEvent(ev);
  }

  function startGame(code, keepDemo) {
    S.gen++; stopClock(); pending = null;
    S.code = cleanCode(code) || dailyCode();
    $('seed-input').value = S.code;
    S.drivesEach = A.demo.active ? 2 : +$('length-select').value || 3;
    S.drive = 0; S.score = [0, 0]; S.over = false; S.playN = 0;
    S.stats = [newStats(), newStats()]; S.topicRec = [{}, {}];
    S.poss = rngFor(S.code + '|coin')() < 0.5 ? 0 : 1;
    $('banner').hidden = true;
    if (!keepDemo) S.hacked = Object.keys(DEFAULTS).some((k) => P[k] !== DEFAULTS[k]);
    if (!A.demo.active) { try { history.replaceState(null, '', '#' + S.code); } catch (e) { /* ignore */ } }
    startDrive(25);
  }
  function startDrive(los) {
    S.los = los; S.down = 1; S.fd = Math.min(100, los + 10); S.driveClean = true;
    S.cam = camTargetFor(los);
    nextPlay();
  }
  const camTargetFor = (los) => los - 12;

  function nextPlay(pat) {
    stopClock();
    S.pat = !!pat;
    S.play = buildPlay(S.code, S.playN++);
    S.sim = makeSim(S.play, S.los);
    S.aim = null;
    S.phase = 'call';
    renderHud();
    openCall();
    wake();
  }

  // The defense picks the topic.
  function openCall() {
    const d = defense(), o = offense();
    showPanel(COLORS[d]);
    $('panel-title').textContent = (S.pat ? 'Extra point · ' : '') + nameOf(d) + ': pick the topic';
    const keys = d === 0 ? '1–3' : '7–9';
    $('panel-sub').textContent = nameOf(o) + ' has to answer a question from it' + (S.pat ? ' for the extra point.' : ' to snap the ball.') +
      (isCpu(d) ? '' : ' (keys ' + keys + ')');
    $('panel-clock').textContent = '';
    const box = $('topic-cards'); box.innerHTML = ''; box.hidden = false;
    S.play.cards.forEach((t, i) => {
      const b = document.createElement('button'); b.type = 'button';
      const rec = S.topicRec[o][t];
      b.innerHTML = '<span></span><small></small>';
      b.firstChild.textContent = t;
      b.lastChild.textContent = rec ? nameOf(o) + ' ' + rec[0] + '/' + rec[1] + ' right' : 'no ' + t + ' questions yet';
      b.disabled = isCpu(d);
      b.addEventListener('click', () => pickTopic(i));
      box.appendChild(b);
    });
    $('panel-topic').hidden = true; $('panel-q').hidden = true; $('panel-choices').innerHTML = ''; $('panel-explain').hidden = true;
    if (isCpu(d)) later(() => { if (S.phase === 'call') pickTopic(cpuTopic(o)); }, pace(1100));
  }
  // The CPU defense goes after the offense's weakest topic so far.
  function cpuTopic(o) {
    let best = 0, worst = 2;
    S.play.cards.forEach((t, i) => { const r = S.topicRec[o][t] || [0, 0]; const rate = (r[0] + 1) / (r[1] + 2); if (rate < worst) { worst = rate; best = i; } });
    return best;
  }

  function pickTopic(i) {
    if (S.phase !== 'call') return;
    S.topic = S.play.cards[i];
    askSingle(offense(), S.pat ? 'pat' : 'clock');
  }

  // One player answers on the play clock: the offense before the snap or the extra point,
  // or the defense trying to hold on to an interception.
  function askSingle(p, phase) {
    S.phase = phase; S.qWho = p; S.answered = [false, false];
    S.q = A.drawQuestion([phase === 'pick' ? A.pick(Math.random, S.play.cards) : S.topic], true);
    S.clockLeft = P.playClock;
    showPanel(COLORS[p]);
    const titles = { clock: nameOf(p) + ': answer to snap the ball', pat: nameOf(p) + ': answer for the extra point', pick: nameOf(p) + ': answer to hold on for the interception' };
    $('panel-title').textContent = titles[phase];
    $('panel-sub').textContent = phase === 'clock' ? 'Right: the ball is snapped. Wrong: sacked for a 5-yard loss. Out of time: delay of game.' :
      phase === 'pat' ? 'Right answer: 1 more point.' : 'Right: it’s an interception. Wrong: the ball pops loose, incomplete.';
    $('topic-cards').hidden = true;
    renderQ([p]);
    startClock();
    if (isCpu(p)) {
      const c = S.play.cpu;
      const delay = phase === 'pick' ? c.pickDelay : c.ansDelay;
      const right = A.demo.active ? c.demoRight : phase === 'pick' ? c.pickRight : c.ansRight;
      cpuAnswer(p, pace(delay * 1000), right);
    }
  }

  // Both players race to answer the same question for a ball in the air.
  function askRace(ev) {
    S.phase = 'race'; S.answered = [false, false]; S.qWho = -1;
    S.q = A.drawQuestion(S.play.cards, true);
    S.raceAt = ev.at;
    S.clockLeft = P.playClock;
    showPanel('#ffd166');
    $('panel-title').textContent = 'Jump ball!';
    $('panel-sub').textContent = 'First right answer wins it. ' + nameOf(offense()) + ' catches it; ' + nameOf(defense()) + ' intercepts it. A wrong answer locks you out.';
    $('topic-cards').hidden = true;
    renderQ([0, 1]);
    startClock();
    const c = S.play.cpu;
    [0, 1].forEach((p) => { if (isCpu(p)) cpuAnswer(p, pace(c.raceDelay[p] * 1000), c.raceRight[p]); });
  }
  function cpuAnswer(p, ms, right) {
    later(function go() {
      if (A.modalOpen()) { later(go, 300); return; }
      if (!S.q || S.answered[p] || !['clock', 'pat', 'pick', 'race'].includes(S.phase)) return;
      const k = right ? S.q.answer : (S.q.answer + 1 + Math.floor(Math.random() * 3)) % 4;
      answer(p, k);
    }, ms);
  }

  function renderQ(players) {
    const q = S.q;
    $('panel-topic').textContent = q.topic; $('panel-topic').hidden = false;
    $('panel-q').textContent = q.q; $('panel-q').hidden = false;
    $('panel-explain').hidden = true;
    const box = $('panel-choices'); box.innerHTML = '';
    q.choices.forEach((c, k) => {
      if (players.length === 1) {
        const p = players[0];
        const b = document.createElement('button'); b.type = 'button'; b.className = 'choice';
        b.innerHTML = '<span class="k">' + keyFor(p, k) + '</span><span></span>';
        b.lastChild.textContent = c;
        b.disabled = isCpu(p);
        b.addEventListener('click', () => answer(p, k));
        box.appendChild(b);
      } else {
        const row = document.createElement('div'); row.className = 'fb-row';
        const tab = (p) => {
          const t = document.createElement('button'); t.type = 'button'; t.className = 'fb-tab'; t.dataset.p = p;
          t.textContent = keyFor(p, k); t.disabled = isCpu(p);
          t.setAttribute('aria-label', nameOf(p) + ' answers ' + c);
          t.addEventListener('click', () => answer(p, k));
          return t;
        };
        const mid = document.createElement('div'); mid.className = 'choice'; mid.textContent = c;
        row.append(tab(0), mid, tab(1));
        box.appendChild(row);
      }
    });
  }
  const keyFor = (p, k) => (p === 0 ? String(k + 1) : String((k + 7) % 10));

  function answer(p, k) {
    const ph = S.phase;
    if (!S.q || S.answered[p]) return;
    if (ph === 'race') { if (S.answered[1 - p] === 'right') return; }
    else if (!['clock', 'pat', 'pick'].includes(ph) || p !== S.qWho) return;
    const right = k === S.q.answer;
    S.answered[p] = right ? 'right' : 'wrong';
    A.answers.push({ game: 'football', player: nameOf(p), topic: S.q.topic, question: S.q.q, correct: right, at: Date.now() });
    if (!A.demo.active) {
      const st = S.stats[p]; st.qt++; if (right) st.qr++;
      const rec = S.topicRec[p][S.q.topic] || (S.topicRec[p][S.q.topic] = [0, 0]); rec[1]++; if (right) rec[0]++;
      if (!right && p === offense()) S.driveClean = false;
    }
    markChoice(p, k, right);
    if (ph === 'race') {
      if (right) return finishQ(() => raceWon(p), true);
      if (S.answered[1 - p] === 'wrong') return finishQ(() => resolve({ kind: 'incomplete', text: 'Nobody came down with it', sub: 'Both answers were wrong. Incomplete.' }), false);
      return; // the other player can still answer
    }
    finishQ(() => singleDone(ph, right), right);
  }
  function markChoice(p, k, right) {
    const box = $('panel-choices');
    if (S.phase === 'race') {
      const tab = box.children[k].querySelector('.fb-tab[data-p="' + p + '"]');
      tab.classList.add('mark');
      box.querySelectorAll('.fb-tab[data-p="' + p + '"]').forEach((t) => { t.disabled = true; });
      if (right) box.children[k].querySelector('.choice').classList.add('right');
      else box.children[k].querySelector('.choice').classList.add('wrong');
    } else {
      [...box.children].forEach((b, j) => { b.disabled = true; if (j === S.q.answer) b.classList.add('right'); else if (j === k) b.classList.add('wrong'); });
    }
  }
  // Show the explanation for a moment, then move on. Wrong answers stay up longer so there's time to read.
  function finishQ(next, right) {
    stopClock();
    if (S.phase === 'race') {
      $('panel-choices').querySelectorAll('.fb-tab').forEach((t) => { t.disabled = true; });
      $('panel-choices').children[S.q.answer].querySelector('.choice').classList.add('right');
    }
    const ex = $('panel-explain');
    ex.innerHTML = right ? '<b>Right.</b> ' : '<b class="miss">Not quite.</b> ';
    ex.appendChild(document.createTextNode(S.q.explain));
    ex.hidden = false;
    S.phase = 'reveal';
    S.q = null;
    continueAfter(next, right ? 1300 : 2800);
  }
  // Pauses that a click on the field, the panel, or Enter can skip.
  let pending = null;
  function continueAfter(fn, ms) {
    const g = S.gen;
    pending = () => { if (g !== S.gen) return; pending = null; fn(); };
    const mine = pending;
    setTimeout(() => { if (pending === mine && !A.modalOpen()) mine(); else if (pending === mine) continueAfter(fn, 400); }, pace(ms));
  }
  function skip() { if (pending) pending(); }

  function singleDone(ph, right) {
    hidePanel();
    if (ph === 'clock') {
      if (right) return snap();
      return resolve({ kind: 'sack', x: S.los - QB_DEPTH, text: 'Sacked!', sub: 'Wrong answer. Loss of ' + QB_DEPTH + ' yards.' });
    }
    if (ph === 'pat') {
      if (right) { S.score[offense()] += 1; renderHud(); }
      banner(right ? 'Extra point is good!' : 'Extra point missed', right ? '+1 point' : 'No extra point', COLORS[offense()]);
      return continueAfter(() => endDrive(25), 1500);
    }
    if (ph === 'pick') {
      if (right) return resolve({ kind: 'int', x: S.raceAt.x, text: 'Intercepted!', sub: nameOf(defense()) + ' held on.' });
      return resolve({ kind: 'incomplete', text: 'Dropped!', sub: 'The defender couldn’t hold on. Incomplete.' });
    }
  }
  function raceWon(p) {
    hidePanel();
    if (!A.demo.active) S.stats[p].races++;
    if (p === offense()) {
      if (!A.demo.active && !isCpu(p)) badges.award('Jump ball winner');
      return resolve({ kind: 'complete', x: S.raceAt.x, air: S.raceAt.x - S.los, text: 'Caught it!', sub: nameOf(p) + ' won the jump ball.' });
    }
    if (!A.demo.active && !isCpu(p)) badges.award('Ball hawk');
    return resolve({ kind: 'int', x: S.raceAt.x, text: 'Intercepted!', sub: nameOf(p) + ' won the jump ball.' });
  }

  function snap() {
    S.phase = 'presnap'; renderHud();
    banner('Hut, hut!', isCpu(offense()) ? '' : 'Click where the ball should come down', COLORS[offense()]);
    later(() => {
      if (S.phase !== 'presnap') return;
      S.phase = 'live'; frame.last = 0; frame.acc = 0; hideBanner(); renderHud(); wake();
    }, pace(800));
  }

  function onThrow(f) {
    if (!A.demo.active) S.stats[offense()].att++;
    renderHud();
  }
  function onEvent(ev) {
    const sim = S.sim;
    if (ev.type === 'catch') { banner('Caught!', 'Run!', COLORS[offense()]); return; }
    S.phase = 'resolving';
    if (ev.type === 'sack') return resolve({ kind: 'sack', x: ev.x, text: 'Sacked!', sub: 'Throw before the rusher gets there.' });
    if (ev.type === 'incomplete') return resolve({ kind: 'incomplete', text: 'Incomplete', sub: ev.why === 'out' ? 'Caught out of bounds.' : 'The ball hit the grass.' });
    if (ev.type === 'tackle') return resolve({ kind: 'complete', x: ev.x, air: sim.catchAt.x - S.los, text: 'Complete!', sub: '' });
    if (ev.type === 'td') return resolve({ kind: 'complete', x: Math.max(100, ev.x), air: (sim.catchAt || ev.at || { x: ev.x }).x - S.los, text: 'Touchdown!', sub: '' });
    if (ev.type === 'race') { sim.frozenAt = ev.at; wake(); return askRace(ev); }
    if (ev.type === 'pick') { sim.frozenAt = ev.at; S.raceAt = ev.at; wake(); return askSingle(defense(), 'pick'); }
  }

  // Apply a play's result to the down, distance and score, then set up what comes next.
  function resolve(r) {
    S.phase = 'result';
    hidePanel();
    const o = offense(), d = defense(), st = S.stats[o], demo = A.demo.active;
    let next = null, sub = r.sub || '';
    if (r.kind === 'complete') {
      const x = Math.min(100, r.x), gain = Math.round(x - S.los);
      if (!demo) { st.comp++; st.yds += gain; }
      if (r.air >= 30 && !demo && !isCpu(o)) badges.award('Deep threat');
      if (x >= 100) return touchdown(r);
      S.los = x;
      sub = (gain >= 0 ? 'Gain of ' + gain : 'Loss of ' + -gain) + (gain === 1 || gain === -1 ? ' yard' : ' yards') + (sub ? '. ' + sub : '');
      if (x >= S.fd) { S.down = 1; S.fd = Math.min(100, Math.ceil(x) + 10); sub += ' · First down!'; } else S.down++;
      if (!demo && !S.factsShown && !isCpu(o)) { S.factsShown = true; next = 'facts'; }
    } else if (r.kind === 'incomplete') {
      S.down++;
    } else if (r.kind === 'sack') {
      S.los = r.x;
      if (S.los <= 0) {
        S.score[d] += 2; renderHud();
        banner('Safety!', nameOf(d) + ' scores 2 points.', COLORS[d]);
        return continueAfter(() => endDrive(25), 2000);
      }
      S.down++;
    } else if (r.kind === 'int') {
      if (!demo) S.stats[d].int++;
      const spot = r.x >= 100 ? 20 : Math.max(1, Math.round(100 - r.x));
      banner(r.text, sub + ' ' + nameOf(d) + ' takes over' + (r.x >= 100 ? ' at the 20 (touchback).' : '.'), COLORS[d]);
      return continueAfter(() => endDrive(spot), 2400);
    }
    S.los = Math.max(1, Math.round(S.los));
    if (S.down > 4) {
      banner(r.text, 'Turnover on downs. ' + nameOf(d) + ' takes over.', COLORS[d]);
      const spot = 100 - S.los;
      return continueAfter(() => endDrive(spot), 2400);
    }
    banner(r.text, sub, r.kind === 'complete' ? COLORS[o] : r.kind === 'incomplete' ? '#8f99b8' : COLORS[d]);
    renderHud();
    if (next === 'facts') {
      return continueAfter(() => A.facts.show({
        kicker: 'Football physics', title: 'Why passes fly the way they do', color: COLORS[o],
        sub: 'You just completed a pass. Here’s the science behind it.',
        facts: (window.SCIENCE_FACTS && window.SCIENCE_FACTS.football) || [], onClose: () => nextPlay()
      }), 1600);
    }
    continueAfter(() => nextPlay(), 2200);
  }

  function touchdown(r) {
    const o = offense();
    S.score[o] += 6;
    if (!A.demo.active) {
      S.stats[o].td++;
      if (!isCpu(o)) {
        badges.award('Touchdown!');
        if (S.driveClean) badges.award('Perfect drive');
        if (S.hacked) badges.award('Field hacker');
      }
    }
    S.los = 100; renderHud();
    banner('Touchdown!', nameOf(o) + ' scores 6. Answer one more for the extra point.', COLORS[o]);
    continueAfter(() => { S.los = 97; S.fd = 100; nextPlay(true); }, 2400);
  }

  function endDrive(nextLos) {
    hideBanner();
    S.drive++;
    if (S.drive >= S.drivesEach * 2) return gameOver();
    S.poss = 1 - S.poss;
    startDrive(nextLos);
  }

  function gameOver() {
    S.phase = 'over'; S.over = true; S.sim = null;
    hidePanel(); hideBanner(); renderHud();
    if (A.demo.active) { later(() => { if (A.demo.active) startGame(randomCode(), true); }, 2500); }
    const [a, b] = S.score;
    $('banner-title').textContent = a === b ? 'Tie game!' : nameOf(a > b ? 0 : 1) + ' wins!';
    $('banner-title').style.color = a === b ? '' : COLORS[a > b ? 0 : 1];
    $('banner-text').textContent = nameOf(0) + ' ' + a + ' · ' + nameOf(1) + ' ' + b + ' · code ' + S.code;
    const chips = $('banner-chips'); chips.innerHTML = '';
    [0, 1].forEach((p) => {
      const st = S.stats[p], c = document.createElement('span'); c.className = 'chip';
      c.textContent = nameOf(p) + ': passes ' + st.comp + '/' + st.att + ', questions ' + st.qr + '/' + st.qt;
      chips.appendChild(c);
    });
    $('banner').hidden = A.demo.active;
    wake();
  }

  // ---------- play clock ----------
  let clockId = 0, clockLast = 0;
  function startClock() {
    stopClock(); clockLast = performance.now(); renderClock();
    clockId = setInterval(() => {
      const now = performance.now(), el = (now - clockLast) / 1000; clockLast = now;
      if (A.modalOpen()) return;
      S.clockLeft -= el;
      renderClock();
      if (S.clockLeft <= 0) { stopClock(); timeout(); }
    }, 100);
  }
  function stopClock() { if (clockId) clearInterval(clockId); clockId = 0; }
  function renderClock() {
    const s = Math.max(0, Math.ceil(S.clockLeft)), low = s <= 5;
    $('clock').textContent = s; $('clock').classList.toggle('low', low);
    $('panel-clock').textContent = s + 's'; $('panel-clock').classList.toggle('low', low);
  }
  function timeout() {
    const ph = S.phase;
    S.q = null; hidePanel();
    if (ph === 'clock') {
      if (!A.demo.active) S.driveClean = false;
      S.los = Math.max(1, S.los - 5);
      banner('Delay of game', '5-yard penalty. Replay the down.', '#ff6b81');
      return continueAfter(() => nextPlay(), 2000);
    }
    if (ph === 'pat') { banner('Extra point missed', 'Out of time.', '#ff6b81'); return continueAfter(() => endDrive(25), 1800); }
    if (ph === 'pick') return resolve({ kind: 'incomplete', text: 'Dropped!', sub: 'Out of time. Incomplete.' });
    if (ph === 'race') return resolve({ kind: 'incomplete', text: 'Nobody came down with it', sub: 'Out of time. Incomplete.' });
  }

  // ---------- HUD and panels ----------
  function showPanel(color) { $('panel').hidden = false; $('panel-card').style.setProperty('--qc', color); $('panel-q').hidden = false; }
  function hidePanel() { $('panel').hidden = true; }
  function banner(title, sub, color) {
    const b = $('play-banner');
    b.innerHTML = ''; b.textContent = title;
    if (sub) { const s = document.createElement('small'); s.textContent = sub; b.appendChild(s); }
    b.style.setProperty('--bc', color || '#ffd166');
    b.hidden = false;
  }
  function hideBanner() { $('play-banner').hidden = true; }
  const ORD = ['', '1st', '2nd', '3rd', '4th'];
  function spotText(x) {
    x = Math.round(x);
    return x === 50 ? 'Ball on the 50' : x < 50 ? 'Ball on own ' + x : 'Ball on their ' + (100 - x);
  }
  function renderHud() {
    const o = offense();
    document.documentElement.style.setProperty('--turn', COLORS[o]);
    [0, 1].forEach((p) => {
      $('score-' + p).textContent = S.score[p];
      $('role-' + p).textContent = S.over ? 'final' : p === o ? 'offense' : 'defense';
      $('card-' + p).classList.toggle('active', !S.over && p === o);
      const st = S.stats[p];
      $('stats-' + p).innerHTML = '<span>Passes <b>' + st.comp + '/' + st.att + '</b> · <b>' + st.yds + '</b> yds</span>' +
        '<span>TD <b>' + st.td + '</b> · INT <b>' + st.int + '</b></span>' +
        '<span>Questions <b>' + st.qr + '/' + st.qt + '</b></span>';
    });
    const toGo = S.fd >= 100 ? 'Goal' : Math.max(1, Math.ceil(S.fd - S.los));
    $('turn-label').textContent = S.over ? 'Final' : S.pat ? 'Extra point' : ORD[Math.min(4, S.down)] + ' & ' + toGo;
    $('spot-label').textContent = S.over ? 'code ' + S.code : spotText(S.los);
    $('drive-label').textContent = 'Drive ' + Math.min(S.drive + 1, S.drivesEach * 2) + ' of ' + S.drivesEach * 2;
    if (!clockId) { $('clock').textContent = Math.round(P.playClock); $('clock').classList.remove('low'); }
    document.querySelectorAll('.throw').forEach((b) => {
      b.classList.toggle('on', +b.dataset.t === S.throwType[o]);
      b.disabled = isCpu(o);
    });
    $('practice-btn').disabled = !(A.demo.active || S.over);
    $('stage-label').textContent = (A.demo.active ? 'Demo · ' : '') + nameOf(o) + ' on offense';
  }

  // ---------- input ----------
  function setThrow(t) { const o = offense(); if (isCpu(o)) return; S.throwType[o] = t; renderHud(); wake(); }
  document.querySelectorAll('.throw').forEach((b) => b.addEventListener('click', () => setThrow(+b.dataset.t)));
  stage.addEventListener('pointermove', (e) => {
    if (S.phase !== 'live' || !S.sim || S.sim.ball) return;
    const p = A.toLogical(cv, e, W, H);
    S.aim = { x: S.cam + p.x / PX, y: p.y / PX };
    wake();
  });
  stage.addEventListener('pointerdown', (e) => {
    if (A.demo.active) return;
    if (pending && !e.target.closest('button')) { skip(); return; }
    if (S.phase !== 'live' || !S.sim || S.sim.ball || isCpu(offense()) || e.target !== cv) return;
    const p = A.toLogical(cv, e, W, H);
    const f = throwBall(S.sim, S.cam + p.x / PX, p.y / PX, S.throwType[offense()]);
    if (f) onThrow(f);
    wake();
  });
  window.addEventListener('keydown', (e) => {
    if (A.modalOpen() || A.demo.active || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    const key = e.key.toLowerCase();
    let p = -1, k = -1;
    if (/^[1-4]$/.test(key)) { p = 0; k = +key - 1; }
    else if (/^[7890]$/.test(key)) { p = 1; k = (+key + 3) % 10; }
    if (p >= 0) {
      e.preventDefault();
      if (S.phase === 'call' && p === defense() && !isCpu(p) && k < 3) pickTopic(k);
      else if (!isCpu(p)) answer(p, k);
      return;
    }
    const t = { z: 0, x: 1, c: 2 }[key];
    if (t !== undefined) { setThrow(t); e.preventDefault(); return; }
    if ((key === 'enter' || key === ' ') && pending) { skip(); e.preventDefault(); }
  });
  $('panel').addEventListener('pointerdown', (e) => { if (pending && !e.target.closest('button')) skip(); });

  // header controls
  const seedInput = $('seed-input');
  function save() { A.store.set('football', { names: names.map((n) => n.value), p2: $('p2-select').value, len: $('length-select').value }); }
  function fresh(code) { A.demo.stop(); startGame(code); save(); }
  $('load-btn').addEventListener('click', () => fresh(seedInput.value));
  $('new-btn').addEventListener('click', () => fresh(randomCode()));
  $('daily-btn').addEventListener('click', () => fresh(dailyCode()));
  seedInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') fresh(seedInput.value); });
  $('again-btn').addEventListener('click', () => fresh(S.code));
  $('length-select').addEventListener('change', () => { save(); if (!A.demo.active) fresh(S.code); });
  $('p2-select').addEventListener('change', () => { S.p2cpu = $('p2-select').value === 'cpu'; names[1].placeholder = S.p2cpu ? 'CPU' : 'Player 2'; save(); if (!A.demo.active) fresh(S.code); });
  names.forEach((n) => n.addEventListener('change', () => { save(); renderHud(); }));
  $('practice-btn').addEventListener('click', () => A.quiz.practice({ game: 'football', topics: ['Motion', 'Forces'] }));
  A.onModal(renderHud);

  // ---------- console hacker layer ----------
  const knob = (k, lo, hi, note) => ({
    get() { return P[k]; },
    set(v) { v = +v; if (!(v >= lo && v <= hi)) { console.log(k + ' must be between ' + lo + ' and ' + hi); return; } P[k] = v; S.hacked = true; console.log(k + ' = ' + v + (note ? '  (' + note + ')' : '')); }
  });
  const game = {};
  Object.defineProperties(game, {
    gravity: Object.assign(knob('gravity', 0.5, 100, 'Earth is 10.7 yd/s². The moon is about 1.8.'), { enumerable: true }),
    arm: Object.assign(knob('arm', 5, 80, 'fastest throw, yards per second'), { enumerable: true }),
    receiverSpeed: Object.assign(knob('receiverSpeed', 1, 20), { enumerable: true }),
    defenderSpeed: Object.assign(knob('defenderSpeed', 0.1, 3, 'multiplier, applies next play'), { enumerable: true }),
    playClock: Object.assign(knob('playClock', 3, 120, 'seconds'), { enumerable: true }),
    pocketTime: Object.assign(knob('pocketTime', 0.3, 5, 'multiplier: how long until the rusher gets you'), { enumerable: true }),
    score: { get() { return S.score.slice(); }, enumerable: true },
    code: { get() { return S.code; }, enumerable: true },
    answers: { get() { return A.answers; }, enumerable: true }
  });
  game.reset = () => { Object.assign(P, DEFAULTS); console.log('Physics back to normal.'); };
  game.maxRange = (deg) => { A.sincos((deg || 45) * A.DEG); return Math.round(P.arm * P.arm * 2 * A.sc.sin * A.sc.cos / P.gravity * 10) / 10 + ' yards'; };
  A.hacker('Football Duel', game, {
    gravity: 'how hard the ball is pulled down (yards per second per second)',
    arm: 'the quarterback\'s fastest throw',
    receiverSpeed: 'yards per second', defenderSpeed: 'defender speed multiplier',
    playClock: 'seconds to answer', pocketTime: 'pass-rush time multiplier',
    score: 'read only', code: 'this game\'s code', answers: 'every question answered so far',
    reset: 'puts the physics back to normal', maxRange: 'how far the arm can throw at an angle: game.maxRange(45)'
  }, ['game.gravity = 1.8   (moon gravity: watch the lobs hang)', 'game.maxRange(20) vs game.maxRange(45)', 'game.playClock = 60']);

  if (TEST) {
    window.__s = S;
    window.__fb = {
      buildPlay, makeSim, stepSim, throwBall, cpuChoose, cpuMaybeThrow, flight, P, answer, pickTopic, skip, askRace, onEvent,
      // run a whole play with the CPU quarterback and no questions: returns the deciding event
      autoplay(code, n, los) {
        const play = buildPlay(code, n), sim = makeSim(play, los || 25);
        let ev = null, guard = 0, firstEv = null;
        while (!sim.done && guard++ < 2000) {
          if (!sim.ball) cpuMaybeThrow(sim, play);
          ev = stepSim(sim);
          if (ev && !firstEv) firstEv = ev;
        }
        return { first: firstEv, last: ev, ball: sim.ball && { T: sim.ball.T, type: sim.ball.type, R: sim.ball.R }, t: sim.t };
      }
    };
  }

  // ---------- boot ----------
  const saved = A.store.get('football', {});
  if (saved.names) saved.names.forEach((n, i) => { if (n) names[i].value = n; });
  if (saved.p2) $('p2-select').value = saved.p2;
  if (saved.len) $('length-select').value = saved.len;
  S.p2cpu = $('p2-select').value === 'cpu';
  names[1].placeholder = S.p2cpu ? 'CPU' : 'Player 2';
  resize();
  const fromHash = cleanCode(location.hash.slice(1));
  A.demo.start({ stage, text: 'Demo game · click anywhere or press any key to play', onExit: () => { startGame(fromHash || dailyCode()); save(); } });
  startGame(randomCode(), true);
  setTimeout(resize, 300);
})();
