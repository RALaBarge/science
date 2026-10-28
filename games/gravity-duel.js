(function () {
  'use strict';
  const A = window.Arcade; // shared core: randomness, math, slicing, quiz, facts, demo, console
  const { $, rngFor, randomCode, cleanCode, dist, DEG, sincos, sc, runSliced, toast } = A;
  const dailyCode = () => A.dailyCode('gravity');

  // ---------- constants ----------
  const W = 1000, H = 600;
  const DEFAULT_G = 0.08;
  const SHIP_R = 12;
  const POWER_MAX = 20;
  const MIN_SPEED = 0.6, MAX_SPEED = 3.4;
  const MAX_STEPS = 6000;
  const CHECK_STEPS = 3000;
  const STEPS_PER_FRAME = 2, FAST_STEPS = 6, FAST_AFTER = 1500, SKIP_STEPS = 30, SETTLE_STEPS = 4;
  const MASS_GROWTH = 500, MASS_CAP = 4;
  // The shot sweeps up space dust: its mass grows the longer it flies. Mass never changes its path
  // (gravity accelerates light and heavy things the same), only how hard it shoves a planet.
  const massFactor = (steps) => Math.min(MASS_CAP, 1 + steps / MASS_GROWTH);
  const WALL_W = 14;
  const SHOT_MASS = 160;
  const PLANET_DRAG = 0.99;
  const SETTLE_MAX = 2000;
  const SHOTS_PER_ROUND = 10;
  let MOON_G = 0.5;          // Moon mode gravity, as a fraction of normal (tuned so maps stay winnable)
  let MAGNET_K = 3.5;         // magnet strength compared with gravity (tuned so maps stay winnable)
  const reduceMotion = A.reduceMotion;

  const COLORS = ['#ff8a5c', '#5cc8ff'];

  // ---------- modes ----------
  // The mode is part of the map code (MOON-COMET-FROG-42), so sharing a code shares the mode.
  const MODES = {
    classic: { key: 'classic', prefix: '', name: 'Classic', g: 1 },
    moon: { key: 'moon', prefix: 'MOON-', name: 'Moon', g: MOON_G },
    magnet: { key: 'magnet', prefix: 'MAGNET-', name: 'Magnet', g: 1 },
    golf: { key: 'golf', prefix: 'GOLF-', name: 'Orbit Golf', g: 1 }
  };
  const MODE_LIST = [MODES.classic, MODES.moon, MODES.magnet, MODES.golf];
  function modeOf(code) {
    for (const m of MODE_LIST) if (m.prefix && code.startsWith(m.prefix)) return m;
    return MODES.classic;
  }
  const baseCode = (code) => code.slice(modeOf(code).prefix.length);
  const POLES = { N: 1, S: -1 };
  const GOLF_HOLES = 9;
  const PLANET_TONES = ['#c9784f', '#7f9c6b', '#b58bd1', '#d4b06a', '#6f9fb8', '#c96a7a', '#8aa38f', '#a98c6e'];

  // ---------- physics ----------
  // The hot loops write results into these shared variables instead of returning new arrays,
  // so a flying shot creates no garbage for the browser to clean up.
  let AX = 0, AY = 0, QX = 0, QY = 0;

  // pol = 0: gravity, always pulls. pol = ±1 (Magnet mode): each planet is a magnetic pole; opposite
  // poles pull and like poles push, with the same distance rule as gravity.
  function accel(x, y, planets, G, pol) {
    let ax = 0, ay = 0;
    for (let i = 0; i < planets.length; i++) {
      const p = planets[i];
      const dx = p.x - x, dy = p.y - y;
      const d2 = dx * dx + dy * dy;
      const d = Math.sqrt(d2);
      // Outside a planet: G·M/r². Inside (only a piercing shot gets there): the pull shrinks
      // steadily to zero at the center, as it would inside a real solid planet.
      let k = d < p.r ? G * p.m / (p.r * p.r * p.r) : G * p.m / (d2 * d);
      if (pol) k *= -MAGNET_K * p.pole * pol;
      ax += dx * k; ay += dy * k;
    }
    AX = ax; AY = ay;
  }

  function closestOnSeg(px, py, w) {
    const vx = w.x2 - w.x1, vy = w.y2 - w.y1;
    let t = ((px - w.x1) * vx + (py - w.y1) * vy) / (vx * vx + vy * vy);
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    QX = w.x1 + vx * t; QY = w.y1 + vy * t;
  }

  function makeShot(map, shooter, angle, power, G, pol) {
    pol = pol || 0;
    const s = map.ships[shooter];
    sincos(angle * DEG);
    const ux = sc.cos * (shooter === 0 ? 1 : -1), uy = -sc.sin;
    const sp = MIN_SPEED + ((power - 1) / (POWER_MAX - 1)) * (MAX_SPEED - MIN_SPEED);
    const x = s.x + ux * (SHIP_R + 6), y = s.y + uy * (SHIP_R + 6);
    accel(x, y, map.planets, G, pol);
    return { x, y, vx: ux * sp, vy: uy * sp, ax: AX, ay: AY, steps: 0, shooter, pol, near: -1, closest: Infinity, pierce: 0, ghost: -2, pierced: false, path: null };
  }

  // Result codes from stepShot (0 = still flying). Planet hits return PLANET + index.
  const HIT = 1, WALL = 2, SELF = 3, OUT = 4, LOST = 5, PLANET = 10;
  const GHOST_WALL = -1, NO_GHOST = -2;

  // One fixed-size step of velocity Verlet.
  function stepShot(sh, map, G, maxSteps) {
    sh.x += sh.vx + 0.5 * sh.ax;
    sh.y += sh.vy + 0.5 * sh.ay;
    accel(sh.x, sh.y, map.planets, G, sh.pol);
    sh.vx += 0.5 * (sh.ax + AX);
    sh.vy += 0.5 * (sh.ay + AY);
    sh.ax = AX; sh.ay = AY;
    sh.steps++;
    const ps = map.planets;
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];
      const dx = sh.x - p.x, dy = sh.y - p.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < p.r * p.r) {
        if (sh.ghost === i) continue;
        if (sh.pierce > 0) { sh.pierce--; sh.ghost = i; sh.pierced = true; continue; }
        return PLANET + i;
      }
      if (sh.ghost === i) sh.ghost = NO_GHOST;
      const ratio = Math.sqrt(d2) / p.r;
      if (ratio < sh.closest) { sh.closest = ratio; sh.near = i; }
    }
    closestOnSeg(sh.x, sh.y, map.wall);
    const wr = WALL_W / 2 + 2, wx = sh.x - QX, wy = sh.y - QY;
    if (wx * wx + wy * wy < wr * wr) {
      if (sh.ghost !== GHOST_WALL) {
        if (sh.pierce > 0) { sh.pierce--; sh.ghost = GHOST_WALL; sh.pierced = true; }
        else return WALL;
      }
    } else if (sh.ghost === GHOST_WALL) sh.ghost = NO_GHOST;
    const hr = (SHIP_R + 3) * (SHIP_R + 3);
    const t = map.ships[1 - sh.shooter], tx = sh.x - t.x, ty = sh.y - t.y;
    if (tx * tx + ty * ty < hr) return HIT;
    const o = map.ships[sh.shooter], ox = sh.x - o.x, oy = sh.y - o.y;
    if (!map.solo && sh.steps > 20 && ox * ox + oy * oy < hr) return SELF;
    if (sh.x < -250 || sh.x > W + 250 || sh.y < -250 || sh.y > H + 250) return OUT;
    if (sh.steps >= maxSteps) return LOST;
    return 0;
  }

  // Run a test shot to the end and report how it ended.
  function simulate(map, shooter, angle, power, G, maxSteps, pol) {
    const sh = makeShot(map, shooter, angle, power, G, pol);
    let res = 0;
    while (!res) res = stepShot(sh, map, G, maxSteps);
    return res;
  }

  const isMoving = (p) => p.vx !== 0 || p.vy !== 0;

  // Planets knocked by a shot slide, bounce off edges, the wall and each other.
  // Returns the index of a ship a moving planet ran into, or -1.
  function stepWorld(map) {
    const ps = map.planets;
    let any = false;
    for (const p of ps) {
      if (!isMoving(p)) continue;
      any = true;
      p.x += p.vx; p.y += p.vy;
      p.vx *= PLANET_DRAG; p.vy *= PLANET_DRAG;
      if (p.vx * p.vx + p.vy * p.vy < 0.0004) { p.vx = 0; p.vy = 0; }
      if (p.x < p.r) { p.x = p.r; p.vx = Math.abs(p.vx); }
      if (p.x > W - p.r) { p.x = W - p.r; p.vx = -Math.abs(p.vx); }
      if (p.y < p.r) { p.y = p.r; p.vy = Math.abs(p.vy); }
      if (p.y > H - p.r) { p.y = H - p.r; p.vy = -Math.abs(p.vy); }
      closestOnSeg(p.x, p.y, map.wall);
      const dx = p.x - QX, dy = p.y - QY;
      const d = dist(dx, dy), minD = p.r + WALL_W / 2;
      if (d < minD && d > 0) {
        const nx = dx / d, ny = dy / d;
        p.x = QX + nx * minD; p.y = QY + ny * minD;
        const vn = p.vx * nx + p.vy * ny;
        if (vn < 0) { p.vx -= 2 * vn * nx; p.vy -= 2 * vn * ny; }
      }
    }
    if (!any) return -1;
    // planet-planet: elastic collision, momentum conserved
    for (let i = 0; i < ps.length; i++) {
      for (let j = i + 1; j < ps.length; j++) {
        const a = ps[i], b = ps[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = dist(dx, dy), minD = a.r + b.r;
        if (d >= minD || d === 0) continue;
        const nx = dx / d, ny = dy / d;
        const overlap = minD - d;
        const ia = 1 / a.m, ib = 1 / b.m;
        a.x -= nx * overlap * ia / (ia + ib); a.y -= ny * overlap * ia / (ia + ib);
        b.x += nx * overlap * ib / (ia + ib); b.y += ny * overlap * ib / (ia + ib);
        const vrel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (vrel < 0) {
          const jimp = -2 * vrel / (ia + ib);
          a.vx -= jimp * ia * nx; a.vy -= jimp * ia * ny;
          b.vx += jimp * ib * nx; b.vy += jimp * ib * ny;
        }
      }
    }
    for (const p of ps) {
      if (!isMoving(p)) continue;
      for (let s = 0; s < 2; s++) {
        const sh = map.ships[s];
        if (dist(p.x - sh.x, p.y - sh.y) < p.r + SHIP_R) return s;
      }
    }
    return -1;
  }

  // ---------- map generation ----------
  function buildMap(rng, mode) {
    const solo = mode.key === 'golf';
    // In Orbit Golf the second "ship" is the hole: a target anywhere on the right side.
    const ships = [
      { x: 50, y: 80 + rng() * 440 },
      solo ? { x: 720 + rng() * 230, y: 60 + rng() * 480 } : { x: 950, y: 80 + rng() * 440 }
    ];
    // A wall across the straight line between the ships, so every hit has to bend.
    const cx = 500 + (rng() - 0.5) * 120;
    const losY = ships[0].y + (ships[1].y - ships[0].y) * ((cx - ships[0].x) / (ships[1].x - ships[0].x));
    const half = 110 + rng() * 110;
    const tilt = (rng() - 0.5) * 0.6;
    const off = (rng() - 0.5) * 2 * (half - 70);
    sincos(tilt);
    const ux = sc.sin, uy = sc.cos;
    const wcx = cx + ux * off, wcy = losY + uy * off;
    const wall = { x1: wcx - ux * half, y1: wcy - uy * half, x2: wcx + ux * half, y2: wcy + uy * half };
    const n = 2 + Math.floor(rng() * 5);
    const planets = [];
    let tries = 0;
    while (planets.length < n && tries < 300) {
      tries++;
      const dense = rng() < 0.22;
      const r = dense ? 16 + rng() * 14 : 20 + rng() * 42;
      const x = 210 + rng() * 580;
      const y = r + 16 + rng() * (H - 2 * r - 32);
      const tone = PLANET_TONES[Math.floor(rng() * PLANET_TONES.length)];
      let ok = true;
      for (const s of ships) if (dist(s.x - x, s.y - y) < r + (solo ? 70 : 110)) ok = false;
      for (const p of planets) if (dist(p.x - x, p.y - y) < p.r + r + 34) ok = false;
      closestOnSeg(x, y, wall);
      if (dist(x - QX, y - QY) < r + WALL_W / 2 + 26) ok = false;
      if (!ok) continue;
      planets.push({ x, y, r, dense, m: r * r * (dense ? 3.2 : 1), tone, vx: 0, vy: 0, pole: 0 });
    }
    if (mode.key === 'magnet') {
      // random poles, but always at least one of each
      planets.forEach((p, i) => { p.pole = i === 0 ? 1 : i === 1 ? -1 : (rng() < 0.5 ? 1 : -1); });
    }
    const stars = [];
    for (let i = 0; i < 150; i++) stars.push({ x: rng() * W, y: rng() * H, s: rng() < 0.12 ? 1.6 : 0.9, a: 0.25 + rng() * 0.6 });
    return { ships, planets, stars, wall, solo, mode: mode.key };
  }

  // Map generation is a generator: it yields after every test shot, so runSliced can spread the
  // work across frames and the page never freezes, even on a slow Chromebook.
  // Fairness: every angle (4° steps) and power is test-fired from each side; both players need at
  // least 4 winning shots and neither may have more than about 3× the other's. In Magnet mode both
  // shot poles are tested (6° steps). Orbit Golf only tests the one player and sets par from the count.
  function* genMapSteps(levelKey, mode) {
    mode = mode || MODES.classic;
    const G = DEFAULT_G * mode.g;
    const pols = mode.key === 'magnet' ? [1, -1] : [0];
    const step = mode.key === 'magnet' ? 6 : 4;
    const sides = mode.key === 'golf' ? 1 : 2;
    let best = null;
    for (let attempt = 0; attempt < 40; attempt++) {
      const map = buildMap(rngFor(levelKey + '|' + attempt), mode);
      const hits = [0, 0];
      let tested = 0;
      for (let side = 0; side < sides; side++) {
        for (const pol of pols) {
          for (let angle = -180; angle < 180; angle += step) {
            for (let power = 1; power <= POWER_MAX; power++) {
              if (simulate(map, side, angle, power, G, CHECK_STEPS, pol) === HIT) hits[side]++;
              if (side === 0) tested++;
              yield;
            }
          }
        }
        if (hits[side] < 4) break; // this map can't pass, so skip testing the other side
      }
      const lo = sides === 1 ? hits[0] : Math.min(hits[0], hits[1]);
      const hi = sides === 1 ? hits[0] : Math.max(hits[0], hits[1]);
      map.hits = hits;
      map.rate = (hits[0] + hits[1]) / (tested * sides);
      map.par = hits[0] >= 16 ? 3 : hits[0] >= 8 ? 4 : 5;
      if (lo >= 4 && lo / hi >= 0.35) return map;
      if (!best || lo > (best.solo ? best.hits[0] : Math.min(best.hits[0], best.hits[1]))) best = map;
    }
    return best;
  }
  function genMap(levelKey, mode) { // all at once (used by tests)
    const g = genMapSteps(levelKey, mode);
    let r;
    while (!(r = g.next()).done);
    return r.value;
  }
  function difficultyLabel(rate) {
    // rate = share of 3,600 test shots (both sides) that hit; thresholds split typical maps into thirds
    if (rate > 0.0037) return 'Easy';
    if (rate > 0.0031) return 'Medium';
    return 'Hard';
  }

  // ---------- state ----------
  const state = {
    code: '',
    mode: MODES.classic,
    golf: { strokes: [], pars: [] },
    round: 1,
    turn: 0,
    wins: [0, 0],
    draws: 0,
    totalShots: [0, 0],
    roundShots: [0, 0],
    slingshots: [0, 0],
    aim: [{ angle: 20, power: 5, pol: 1 }, { angle: 20, power: 5, pol: 1 }],
    settling: false,
    settleSteps: 0,
    shooter: 0,
    bonus: [0, 0],
    quizzed: [false, false],
    held: [null, null],
    locked: [false, false],
    armed: { arc: false, pierce: false },
    resizeMode: false,
    resizeSel: -1,
    last: [null, null],
    trails: [[], []],
    trailVer: 0,
    map: null,
    flying: null,
    roundOver: false,
    particles: [],
    message: ''
  };

  // Exposed on purpose (see A.hacker at boot). Kids who poke at this are doing physics too.
  const game = {
    G: DEFAULT_G,
    get planets() { return state.map ? state.map.planets : []; },
    get ships() { return state.map ? state.map.ships : []; },
    get code() { return state.code; },
    get answers() { return A.answers; },
    showField: true
  };

  // ---------- DOM ----------
  const cv = $('cv'), mainCtx = cv.getContext('2d');
  let ctx = mainCtx; // the drawing functions use ctx; renderBg points it at the off-screen layer
  const bg = document.createElement('canvas'), bgCtx = bg.getContext('2d', { alpha: false });
  const stage = $('stage');
  const seedInput = $('seed-input');
  const angleRange = $('angle-range'), angleNum = $('angle-num');
  const powerRange = $('power-range'), powerNum = $('power-num');
  const fireBtn = $('fire');
  const names = [$('name-0'), $('name-1')];
  const nameOf = (i) => (names[i].value.trim() || ('Player ' + (i + 1)));

  let scale = 1, dpr = 1;
  function resize() {
    const cssW = stage.clientWidth;
    const cssH = cssW * (H / W);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.style.height = cssH + 'px';
    cv.width = Math.round(cssW * dpr);
    cv.height = Math.round(cssH * dpr);
    scale = cssW / W;
    wake();
  }
  window.addEventListener('resize', resize);

  if (/[?&]test\b/.test(location.search)) { // test hooks only
    window.__s = state;
    window.__phys = { genMap: (k, m) => genMap(k, MODES[m]), MODES, tune(moon, mag) { MOON_G = moon; MODES.moon.g = moon; MAGNET_K = mag; } };
  }
  const badges = A.makeBadges($('badges'));
  const award = badges.award;

  function syncAimInputs() {
    const a = state.aim[state.turn];
    angleRange.value = a.angle; angleNum.value = a.angle;
    powerRange.value = a.power; powerNum.value = a.power;
  }

  function golfTotal() {
    let strokes = 0, par = 0;
    state.golf.strokes.forEach((n, i) => { strokes += n; par += state.golf.pars[i]; });
    return { strokes, diff: strokes - par };
  }
  const vsPar = (d) => (d === 0 ? 'E' : d > 0 ? '+' + d : String(d));

  function renderGolfHud() {
    const hole = state.round, map = state.map, t = golfTotal();
    const par = map ? map.par : '–';
    $('wins-0').textContent = vsPar(t.diff);
    $('wins-label-0').textContent = 'vs par';
    $('card-0').classList.toggle('active', !state.roundOver);
    const last = state.last[0];
    $('stats-0').innerHTML =
      '<span>Hole <b>' + hole + ' of ' + GOLF_HOLES + '</b> · par <b>' + par + '</b></span>' +
      '<span>Strokes this hole <b>' + state.roundShots[0] + ' of ' + (SHOTS_PER_ROUND + state.bonus[0]) + '</b>' + (state.bonus[0] ? ' (+' + state.bonus[0] + ' bonus)' : '') + '</span>' +
      '<span>Course strokes <b>' + t.strokes + '</b></span>' +
      '<span>Last shot <b>' + (last ? (last.angle + '°, power ' + last.power) : '–') + '</b></span>';
    $('wins-1').textContent = t.strokes;
    $('wins-label-1').textContent = 'strokes';
    $('card-1').classList.remove('active');
    let card = '';
    for (let h = 0; h < GOLF_HOLES; h++) {
      const n = state.golf.strokes[h];
      card += '<span>Hole ' + (h + 1) + ' <b>' + (n === undefined ? '–' : n + ' (' + vsPar(n - state.golf.pars[h]) + ')') + '</b></span>';
    }
    $('stats-1').innerHTML = card;
    $('stats-1').classList.add('scorecard');
  }

  function renderHud() {
    document.documentElement.style.setProperty('--turn', COLORS[state.turn]);
    const golf = solo();
    names[1].hidden = golf;
    $('card-title-1').hidden = !golf;
    $('round-word').textContent = golf ? 'Hole' : 'Round';
    $('draws-wrap').hidden = golf;
    $('pole-btn').hidden = !magnets();
    if (magnets()) {
      const pol = state.aim[state.turn].pol;
      $('pole-btn').textContent = 'Shot pole: ' + (pol > 0 ? 'N' : 'S');
      $('pole-btn').dataset.pole = pol > 0 ? 'N' : 'S';
    }
    $('mode-select').value = state.mode.key;
    if (golf) renderGolfHud();
    for (let i = 0; i < 2 && !golf; i++) {
      $('wins-label-' + i).textContent = 'rounds';
      $('stats-' + i).classList.remove('scorecard');
      $('wins-' + i).textContent = state.wins[i];
      $('card-' + i).classList.toggle('active', state.turn === i && !state.roundOver);
      const last = state.last[i];
      const acc = state.totalShots[i] ? Math.round(100 * state.wins[i] / state.totalShots[i]) : 0;
      $('stats-' + i).innerHTML =
        '<span>Shots this round <b>' + state.roundShots[i] + ' of ' + (SHOTS_PER_ROUND + state.bonus[i]) + '</b>' +
          (state.bonus[i] ? ' (+' + state.bonus[i] + ' bonus)' : '') + '</span>' +
        '<span>Total shots <b>' + state.totalShots[i] + '</b> · hit rate <b>' + acc + '%</b></span>' +
        '<span>Slingshots <b>' + state.slingshots[i] + '</b></span>' +
        '<span>Last shot <b>' + (last ? (last.angle + '°, power ' + last.power) : '–') + '</b></span>';
    }
    $('turn-label').textContent = state.roundOver ? (golf ? 'Hole over' : 'Round over')
      : golf && !state.flying && !state.settling && !A.quiz.isOpen ? 'Hole ' + state.round + ' · stroke ' + (state.roundShots[0] + 1)
      : A.quiz.isOpen ? (nameOf(state.turn) + ' answering questions')
      : state.settling ? 'Planets moving…'
      : state.flying ? (nameOf(state.turn) + '’s shot in flight')
      : (nameOf(state.turn) + ' to fire');
    fireBtn.disabled = (!!state.flying && state.ffwd) || state.settling || A.quiz.isOpen || state.roundOver || !state.map;
    fireBtn.textContent = state.flying ? 'Fast-forward' : 'Fire';
    $('round-num').textContent = state.round;
    $('draws').textContent = state.draws;
    if (state.map) {
      $('difficulty').textContent = golf ? 'Par ' + state.map.par : difficultyLabel(state.map.rate);
      $('planet-count').textContent = state.map.planets.length;
    }
    $('stage-label').textContent = (A.demo.active ? 'Demo' : state.code) + ' · ' + (golf ? 'hole ' : 'round ') + state.round + (state.message ? ' · ' + state.message : '');
    renderItems();
    $('practice-btn').disabled = !(A.demo.active || state.roundOver) || A.modalOpen();
    wake();
  }

  // ---------- power-ups ----------
  const POWERUPS = {
    arc: { name: 'Arc Scope', label: 'arc', help: 'shows where your next shot will curve' },
    pierce: { name: 'Pierce', label: 'pierce', help: 'your next shot passes through one planet or the wall' },
    resize: { name: 'Resize', label: 'resize', help: 'turn one planet into a different space object' },
    flip: { name: 'Flip', label: 'flip', help: 'switch one magnet between north and south' }
  };
  // Game-scale stand-ins. Real masses differ by millions of times (the sun is about 333,000 Earths),
  // so these keep the order right while staying playable.
  const BODY_TYPES = [
    { key: 'moon', name: 'Moon-like', r: 14, m: 300, tone: '#a7a9b4', blurb: 'small and rocky' },
    { key: 'earth', name: 'Earth-like', r: 24, m: 1100, tone: '#4f8fcf', blurb: 'rocky, with oceans' },
    { key: 'jupiter', name: 'Jupiter-like', r: 50, m: 3500, tone: '#d4a373', blurb: 'a giant ball of gas' },
    { key: 'sun', name: 'Sun-like star', r: 60, m: 8000, tone: '#ffcc4d', blurb: 'huge, hot and heavy' },
    { key: 'neutron', name: 'Neutron star', r: 9, m: 10000, tone: '#cfe8ff', blurb: 'a dead star crushed city-sized' },
    { key: 'quasar', name: 'Quasar', r: 30, m: 12000, tone: '#bfe3ff', blurb: 'a galaxy’s blazing core' }
  ];
  const bodyBtns = {};
  BODY_TYPES.forEach((t) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = '<span></span><small></small>';
    b.firstChild.textContent = t.name;
    b.lastChild.textContent = 'mass ' + Math.round(t.m / 100) + ' · ' + t.blurb;
    b.addEventListener('click', () => setBodyType(t));
    $('body-types').appendChild(b);
    bodyBtns[t.key] = b;
  });
  const PICKUP_R = 15;
  const PREVIEW_STEPS = 700;

  function makePickups(map, rng) {
    const types = map.mode === 'magnet' ? ['arc', 'pierce', 'flip'] : ['arc', 'pierce', 'resize'];
    const out = [];
    let tries = 0;
    while (out.length < 3 && tries < 400) {
      tries++;
      const x = 170 + rng() * 660, y = 40 + rng() * 520;
      let ok = true;
      for (const p of map.planets) if (dist(p.x - x, p.y - y) < p.r + 32) ok = false;
      for (const s of map.ships) if (dist(s.x - x, s.y - y) < 130) ok = false;
      for (const o of out) if (dist(o.x - x, o.y - y) < 90) ok = false;
      closestOnSeg(x, y, map.wall);
      if (dist(x - QX, y - QY) < 34) ok = false;
      if (!ok) continue;
      out.push({ x, y, type: types[Math.floor(rng() * types.length)], taken: false });
    }
    return out;
  }

  const solo = () => state.mode.key === 'golf';
  const magnets = () => state.mode.key === 'magnet';
  const modeG = () => DEFAULT_G * state.mode.g;
  const shotPol = (i) => (magnets() ? state.aim[i].pol : 0);
  const idle = () => !!state.map && !state.flying && !state.settling && !A.modalOpen() && !state.roundOver;

  // ---------- space facts pop-up (shared facts card from the core) ----------
  function showFacts(t) {
    A.facts.show({
      kicker: 'Space facts',
      title: 'You made a ' + t.name + '!',
      sub: 'Mass ' + Math.round(t.m / 100) + ' in the game · ' + t.blurb,
      facts: (window.SPACE_FACTS && window.SPACE_FACTS[t.key]) || [],
      color: COLORS[state.turn]
    });
  }

  function renderItems() {
    for (let i = 0; i < 2; i++) {
      const box = $('items-' + i);
      box.innerHTML = '';
      const key = state.held[i];
      if (!key) {
        const s = document.createElement('span');
        s.className = 'none';
        s.textContent = 'No power-up. Fly a shot through a gold token to grab one.';
        box.appendChild(s);
        continue;
      }
      const mine = state.turn === i && idle();
      const active = mine && (state.armed[key] || ((key === 'resize' || key === 'flip') && state.resizeMode));
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'item' + (active ? ' armed' : '');
      b.textContent = POWERUPS[key].name + (state.locked[i] ? ' · locked until next round' : active ? ' · ready' : ' · answer to use');
      b.title = POWERUPS[key].name + ': ' + POWERUPS[key].help;
      b.disabled = !mine || state.locked[i] || active;
      b.addEventListener('click', () => useItem(i));
      box.appendChild(b);
    }
    $('resize-bar').hidden = !state.resizeMode;
    const room = state.resizeSel >= 0 && state.map ? maxRadius(state.map, state.resizeSel) : 0;
    BODY_TYPES.forEach((t) => {
      const b = bodyBtns[t.key];
      b.disabled = state.resizeSel < 0 || t.r > room;
      b.title = state.resizeSel >= 0 && t.r > room ? 'No room for this one here' : t.name + ': ' + t.blurb;
    });
    const flipping = state.held[state.turn] === 'flip';
    $('body-types').hidden = flipping;
    $('resize-msg').textContent = flipping ? 'Click a magnet to flip it.'
      : state.resizeSel < 0 ? 'Click a planet to change it.' : 'What should it become? Grayed-out ones won’t fit there.';
  }

  function useItem(p) {
    if (p !== state.turn || !idle() || !state.held[p] || state.locked[p]) return;
    startQuiz(p, 'powerup');
  }

  // Called after a right answer. Arc Scope and Pierce apply to the next shot; Resize starts picking a planet.
  function activateHeld(p) {
    const key = state.held[p];
    if (!key) return;
    if (key === 'resize' || key === 'flip') { state.resizeMode = true; state.resizeSel = -1; }
    else state.armed[key] = true;
    toast(POWERUPS[key].name + ' ready: ' + POWERUPS[key].help + '.');
    renderHud();
  }

  function maxRadius(map, idx) {
    const p = map.planets[idx];
    let m = 75;
    map.planets.forEach((o, j) => { if (j !== idx) m = Math.min(m, dist(o.x - p.x, o.y - p.y) - o.r - 8); });
    for (const s of map.ships) m = Math.min(m, dist(s.x - p.x, s.y - p.y) - SHIP_R - 40);
    closestOnSeg(p.x, p.y, map.wall);
    m = Math.min(m, dist(p.x - QX, p.y - QY) - WALL_W / 2 - 6);
    m = Math.min(m, p.x, W - p.x, p.y, H - p.y);
    return m;
  }

  function flipMagnet(i) {
    const p = state.map.planets[i];
    p.pole = -p.pole;
    state.held[state.turn] = null;
    state.resizeMode = false;
    state.resizeSel = -1;
    toast('Flipped to ' + (p.pole > 0 ? 'north' : 'south') + '. Now it ' + (p.pole === state.aim[state.turn].pol ? 'pushes' : 'pulls') + ' your current shot.');
    renderHud();
  }

  function setBodyType(t) {
    if (state.resizeSel < 0 || !idle()) return;
    if (t.r > maxRadius(state.map, state.resizeSel)) { toast('No room for a ' + t.name + ' there.'); return; }
    const p = state.map.planets[state.resizeSel];
    const before = p.m;
    p.r = t.r; p.m = t.m; p.kind = t.key; p.tone = t.tone; p.dense = false;
    state.held[state.turn] = null;
    state.resizeMode = false;
    state.resizeSel = -1;
    const ratio = p.m / before;
    toast('Now a ' + t.name + '. Mass ' + Math.round(before / 100) + ' → ' + Math.round(p.m / 100) +
      ', so its pull is ' + (ratio >= 1 ? ratio.toFixed(1) + '× stronger.' : (1 / ratio).toFixed(1) + '× weaker.'));
    renderHud();
    showFacts(t);
  }
  $('resize-cancel').addEventListener('click', () => { state.resizeMode = false; state.resizeSel = -1; renderHud(); });

  function collectPickups(sh) {
    if (!state.map.pickups) return;
    for (const pu of state.map.pickups) {
      if (pu.taken) continue;
      if (dist(sh.x - pu.x, sh.y - pu.y) < PICKUP_R + 4) {
        if (state.held[sh.shooter]) {
          if (!sh.fullWarned) { sh.fullWarned = true; toast(nameOf(sh.shooter) + ' already holds a power-up. Use it to make room.'); }
          continue;
        }
        pu.taken = true;
        state.held[sh.shooter] = pu.type;
        state.locked[sh.shooter] = false;
        burst(pu.x, pu.y, '#ffd166', 20);
        toast(nameOf(sh.shooter) + ' grabbed ' + POWERUPS[pu.type].name + '!');
        renderHud();
      }
    }
  }

  let previewKey = '', previewPts = [];
  function previewPath() {
    const i = state.turn, a = state.aim[i];
    const key = i + '|' + a.angle + '|' + a.power + '|' + a.pol + '|' + state.armed.pierce + '|' + bgKey();
    if (key === previewKey) return previewPts;
    const sh = makeShot(state.map, i, a.angle, a.power, game.G, shotPol(i));
    sh.pierce = state.armed.pierce ? 1 : 0;
    const pts = [];
    for (let k = 0; k < PREVIEW_STEPS; k++) {
      const res = stepShot(sh, state.map, game.G, MAX_STEPS);
      if (k % 4 === 0) pts.push(sh.x, sh.y);
      if (res) break;
    }
    previewKey = key; previewPts = pts;
    return pts;
  }

  // ---------- rounds ----------
  let genToken = 0;
  function loadRound() {
    state.flying = null;
    state.settling = false;
    state.bonus = [0, 0];
    state.quizzed = [false, false];
    A.quiz.close();
    A.facts.close();
    state.armed = { arc: false, pierce: false };
    state.locked = [false, false];
    state.resizeMode = false;
    state.resizeSel = -1;
    state.roundOver = false;
    state.trails = [[], []];
    state.trailVer++;
    state.last = [null, null];
    state.roundShots = [0, 0];
    state.particles = [];
    state.message = '';
    state.turn = solo() ? 0 : (state.round - 1) % 2;
    $('banner').hidden = true;
    $('busy').hidden = false;
    state.map = null;
    renderHud();
    const token = ++genToken;
    const key = state.code + '-R' + state.round;
    runSliced(genMapSteps(key, state.mode), (map) => {
      map.id = token;
      map.pickups = makePickups(map, rngFor(key + '|pickups'));
      state.map = map;
      $('busy').hidden = true;
      syncAimInputs();
      renderHud();
    }, () => token !== genToken);
  }

  function resetAims() {
    const angle = 20 + Math.floor(Math.random() * 41);
    state.aim = [{ angle, power: 5, pol: 1 }, { angle, power: 5, pol: 1 }];
  }

  function setCode(code, resetScores) {
    if (A.demo.active) stopDemo();
    code = cleanCode(code) || randomCode();
    const prevMode = state.mode;
    state.code = code;
    state.mode = modeOf(code);
    game.G = modeG();
    seedInput.value = code;
    try { history.replaceState(null, '', '#' + code); } catch (e) { /* ignore */ }
    if (resetScores) {
      resetAims();
      state.round = 1;
      state.wins = [0, 0];
      state.draws = 0;
      state.held = [null, null];
      state.totalShots = [0, 0];
      state.slingshots = [0, 0];
      state.golf = { strokes: [], pars: [] };
    }
    loadRound();
    if (state.mode !== prevMode) modeIntro();
  }

  // A facts card the first time a player switches into Moon or Magnet mode.
  function modeIntro() {
    if (state.mode.key === 'moon') {
      A.facts.show({
        kicker: 'Moon mode', title: 'Gravity is weaker here',
        sub: 'Planets pull at half their usual strength, so shots curve less. On the real Moon, gravity is about one sixth of Earth’s.',
        facts: (window.SPACE_FACTS && window.SPACE_FACTS.moon) || []
      });
    } else if (state.mode.key === 'magnet') {
      A.facts.show({
        kicker: 'Magnet mode', title: 'Opposites attract',
        sub: 'Red planets are north poles, blue are south. Pick your shot’s pole: opposite poles pull it in, matching poles push it away.',
        facts: (window.SCIENCE_FACTS && window.SCIENCE_FACTS.magnets) || []
      });
    } else if (state.mode.key === 'golf') {
      A.toast('Orbit Golf: sink your shot in the gold ring. ' + GOLF_HOLES + ' holes, fewest strokes wins.');
    }
  }

  function fire() {
    if (state.flying) { state.ffwd = true; renderHud(); return; }
    if (state.settling || A.quiz.isOpen || A.facts.isOpen || state.roundOver || state.resizeMode || !state.map) return;
    const p = state.turn;
    state.shooter = p;
    state.ffwd = false;
    const a = state.aim[p];
    state.flying = makeShot(state.map, p, a.angle, a.power, game.G, shotPol(p));
    if (state.armed.pierce) { state.flying.pierce = 1; state.held[p] = null; }
    if (state.armed.arc) state.held[p] = null;
    state.armed = { arc: false, pierce: false };
    state.flying.path = [state.flying.x, state.flying.y];
    state.flying.aim = { angle: a.angle, power: a.power };
    state.roundShots[p]++;
    state.totalShots[p]++;
    state.message = '';
    renderHud();
  }

  function burst(x, y, color, n) {
    const count = reduceMotion ? Math.ceil(n / 4) : n;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2, s = 0.5 + Math.random() * 3;
      state.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 40 + Math.random() * 30, color });
    }
    wake();
  }

  function endShot(res) {
    const sh = state.flying;
    const p = sh.shooter;
    state.trails[p] = sh.path;
    state.trailVer++;
    state.last[p] = sh.aim;
    state.flying = null;
    if (res === HIT && solo()) {
      burst(state.map.ships[1].x, state.map.ships[1].y, '#ffd166', 60);
      const chips = [];
      if (sh.closest < 1.8) { state.slingshots[0]++; chips.push('Slingshot'); award('Slingshot'); }
      if (state.roundShots[0] === 1) { chips.push('Hole in one'); award('Hole in one'); }
      finishHole(state.roundShots[0], chips);
    } else if (res === HIT) {
      const target = state.map.ships[1 - p];
      burst(target.x, target.y, COLORS[1 - p], 60);
      const chips = [];
      if (sh.closest < 1.8) { state.slingshots[p]++; chips.push('Slingshot'); award('Slingshot'); }
      if (state.roundShots[p] === 1) { chips.push('First-shot hit'); award('Sharpshooter'); }
      winRound(p, 'Round ' + state.round + ' in ' + state.roundShots[p] + (state.roundShots[p] === 1 ? ' shot' : ' shots') + '.', chips);
    } else {
      if (res >= PLANET) {
        const pl = state.map.planets[res - PLANET];
        // momentum: the shot's mass × velocity, divided by the planet's mass
        const mf = massFactor(sh.steps);
        pl.vx += SHOT_MASS * mf * sh.vx / pl.m;
        pl.vy += SHOT_MASS * mf * sh.vy / pl.m;
        burst(sh.x, sh.y, pl.tone, Math.round(14 * mf));
        state.message = 'hit a planet at mass ' + mf.toFixed(1) + '× and pushed it';
      } else if (res === WALL) {
        burst(sh.x, sh.y, '#b9a6ff', 14);
        state.message = 'hit the wall';
      } else if (res === SELF) {
        burst(sh.x, sh.y, COLORS[p], 24);
        state.message = 'came back and hit its own ship';
      } else if (res === OUT) {
        state.message = 'flew off the map';
      } else {
        state.message = 'stuck in orbit';
      }
      state.settling = true;
      state.settleSteps = 0;
    }
    renderHud();
  }

  function showBanner(title, color, text, chips) {
    $('banner-title').textContent = title;
    $('banner-title').style.color = color;
    $('banner-text').textContent = text;
    const bc = $('banner-chips');
    bc.innerHTML = '';
    chips.forEach((c) => { const s = document.createElement('span'); s.className = 'chip gold'; s.textContent = c; bc.appendChild(s); });
    $('banner').hidden = false;
    $('next-btn').textContent = solo() ? 'Next hole' : 'Next round';
    $('next-btn').focus({ preventScroll: true });
    renderHud();
  }

  function winRound(p, text, chips) {
    state.flying = null;
    state.settling = false;
    state.wins[p]++;
    state.roundOver = true;
    if (game.G !== modeG()) { chips.push('Hacked gravity'); award('Gravity hacker'); }
    showBanner(nameOf(p) + ' wins', COLORS[p], text, chips);
    if (A.demo.active) scheduleDemoRound();
  }

  const GOLF_NAMES = { '-3': 'Albatross', '-2': 'Eagle', '-1': 'Birdie', '0': 'Par', '1': 'Bogey', '2': 'Double bogey' };
  // Record a finished hole. Missing all strokes counts as strokes taken + 2.
  function finishHole(strokes, chips, failed) {
    state.flying = null;
    state.settling = false;
    state.roundOver = true;
    const par = state.map.par;
    state.golf.strokes[state.round - 1] = strokes;
    state.golf.pars[state.round - 1] = par;
    const d = strokes - par;
    const t = golfTotal();
    const last = state.round >= GOLF_HOLES;
    const title = failed ? 'Missed the hole' : strokes === 1 ? 'Hole in one!' : (GOLF_NAMES[String(d)] || (d < 0 ? 'Amazing' : vsPar(d))) + '!';
    const text = (failed ? 'Out of strokes, so it counts as ' + strokes + '. ' : 'Hole ' + state.round + ' in ' + strokes + (strokes === 1 ? ' stroke' : ' strokes') + ', par ' + par + '. ') +
      (last ? 'Course finished: ' + t.strokes + ' strokes, ' + vsPar(t.diff) + ' vs par.' : 'Course so far: ' + vsPar(t.diff) + '.');
    if (last && t.diff <= 0) award('Under par');
    if (game.G !== modeG()) { chips.push('Hacked gravity'); award('Gravity hacker'); }
    showBanner(title, '#ffd166', text, chips);
    if (last) $('next-btn').textContent = 'New course';
  }

  function drawRound() {
    if (solo()) { finishHole(state.roundShots[0] + 2, [], true); return; }
    state.flying = null;
    state.settling = false;
    state.draws++;
    state.roundOver = true;
    const anyBonus = state.bonus[0] + state.bonus[1] > 0;
    showBanner('Draw', '#e7e9f3', anyBonus ? 'Nobody hit, even with bonus shots.' : 'Nobody hit in ' + SHOTS_PER_ROUND + ' shots each.', []);
    if (A.demo.active) scheduleDemoRound();
  }

  // ---------- demo mode: the game plays itself until someone clicks or presses a key ----------
  let demoTimer = null;

  function startDemo() {
    A.demo.start({
      stage,
      text: 'Demo match · click anywhere or press any key to play',
      onExit: () => { stopDemo(); setCode(cleanCode(location.hash.slice(1)) || dailyCode(), true); }
    });
    names[0].dataset.real = names[0].value; names[1].dataset.real = names[1].value;
    names[0].value = 'CPU Orange'; names[1].value = 'CPU Blue';
    state.code = 'DEMO-' + randomCode();
    state.mode = MODES.classic;
    game.G = DEFAULT_G;
    state.round = 1;
    state.wins = [0, 0]; state.draws = 0; state.totalShots = [0, 0]; state.slingshots = [0, 0];
    state.held = [null, null];
    resetAims();
    loadRound();
    demoTick();
  }

  function stopDemo() {
    A.demo.stop();
    clearTimeout(demoTimer);
    names.forEach((n) => { if (n.dataset.real !== undefined) { n.value = n.dataset.real; delete n.dataset.real; } });
    state.flying = null;
    state.settling = false;
    $('banner').hidden = true;
    A.quiz.close();
    A.facts.close();
    badges.clear();
  }

  function scheduleDemoRound() {
    clearTimeout(demoTimer);
    demoTimer = setTimeout(() => {
      if (!A.demo.active) return;
      if (A.quiz.isOpen) { scheduleDemoRound(); return; }
      state.round++; loadRound(); demoTick();
    }, 2600);
  }

  // Search the angle/power grid for shots that hit right now, then usually fumble one a little,
  // so the CPUs look like they're learning instead of hitting every time.
  function* demoSearch() {
    const p = state.turn, map = state.map, hits = [];
    for (let angle = -180; angle < 180; angle += 4) {
      for (let power = 1; power <= POWER_MAX; power += 2) {
        if (simulate(map, p, angle, power, game.G, CHECK_STEPS) === HIT) hits.push({ angle, power });
        yield;
      }
    }
    if (!hits.length) return { angle: 10 + Math.floor(Math.random() * 50), power: 3 + Math.floor(Math.random() * 10) };
    const pick = hits[Math.floor(Math.random() * hits.length)];
    if (Math.random() < 0.4) return pick;
    const off = (2 + Math.floor(Math.random() * 6)) * (Math.random() < 0.5 ? -1 : 1);
    return { angle: pick.angle + off, power: Math.max(1, Math.min(POWER_MAX, pick.power + Math.floor(Math.random() * 3) - 1)) };
  }

  function demoTick() {
    clearTimeout(demoTimer);
    if (!A.demo.active) return;
    if (!idle()) { demoTimer = setTimeout(demoTick, 250); return; }
    const map = state.map;
    runSliced(demoSearch(), (choice) => demoSwing(choice), () => !A.demo.active || state.map !== map);
  }

  function demoSwing(choice) {
    if (!A.demo.active || !idle()) { demoTimer = setTimeout(demoTick, 250); return; }
    // swing the aim arrow over to the new angle so viewers can see the CPU "decide"
    const a = state.aim[state.turn];
    const from = { angle: a.angle, power: a.power }, steps = 18;
    let k = 0;
    const swing = () => {
      if (!A.demo.active) return;
      k++;
      setAim(from.angle + (choice.angle - from.angle) * k / steps, from.power + (choice.power - from.power) * k / steps);
      if (k < steps) demoTimer = setTimeout(swing, 40);
      else demoTimer = setTimeout(() => { if (A.demo.active && idle()) fire(); demoTimer = setTimeout(demoTick, 400); }, 450);
    };
    swing();
  }

  const shotsLeft = (p) => SHOTS_PER_ROUND + state.bonus[p] - state.roundShots[p];

  // Give the turn to `pref` if they have shots; if they're out, quiz them once per round; then try the other player.
  function goNext(pref) {
    for (const p of solo() ? [0] : [pref, 1 - pref]) {
      if (shotsLeft(p) > 0) { state.turn = p; syncAimInputs(); renderHud(); return; }
      if (!state.quizzed[p]) { state.turn = p; startQuiz(p); return; }
    }
    drawRound();
  }

  // ---------- quizzes (shared quiz card from the core) ----------
  // 'bonus': out of shots, 4 questions, one extra shot per right answer (once per round).
  // 'powerup': one question to unlock the held power-up; a miss locks it until next round.
  // 'practice': the practice link; nothing at stake.
  const QUIZ_LEN = 4;
  const TOPICS = ['Gravity', 'Forces', 'Motion', 'Energy', 'Space'];
  function startQuiz(p, mode) {
    mode = mode || 'bonus';
    if (mode === 'practice') { A.quiz.practice({ game: 'gravity-duel', topics: TOPICS }); return; }
    if (A.demo.active) { if (mode === 'bonus') { state.quizzed[p] = true; goNext(1 - p); } return; }
    if (mode === 'powerup') {
      const name = POWERUPS[state.held[p]].name;
      A.quiz.open({
        game: 'gravity-duel', player: nameOf(p), color: COLORS[p], count: 1, topics: TOPICS,
        title: nameOf(p) + ' unlocks ' + name,
        intro: 'Answer right to use ' + name + '. Miss, and it stays locked until next round.',
        singleLabel: (right) => (right ? 'Use ' + name : 'Back to the game'),
        onClose: (n) => {
          if (n) activateHeld(p);
          else { state.locked[p] = true; toast(name + ' is locked until next round.'); }
          renderHud();
        }
      });
      return;
    }
    A.quiz.open({
      game: 'gravity-duel', player: nameOf(p), color: COLORS[p], count: QUIZ_LEN, topics: TOPICS,
      title: nameOf(p) + ' is out of shots',
      intro: 'Answer ' + QUIZ_LEN + ' science questions. Every right answer earns one more shot.',
      lastLabel: 'See your bonus',
      resultScore: (n) => '+' + n,
      resultText: (n) => (n === 0 ? 'No bonus shots this time.' : n === QUIZ_LEN ? 'Perfect! ' + n + ' bonus shots.' : n + ' right, so ' + n + (n === 1 ? ' bonus shot.' : ' bonus shots.')),
      doneLabel: (n) => (n > 0 ? 'Take your shots' : 'Continue'),
      onClose: (n) => {
        state.quizzed[p] = true;
        state.bonus[p] += n;
        if (n === QUIZ_LEN) award('Science ace');
        goNext(p);
      }
    });
  }
  A.onModal(renderHud);
  $('practice-btn').addEventListener('click', () => {
    if ((A.demo.active || state.roundOver) && !A.modalOpen()) startQuiz(state.turn, 'practice');
  });

  function crush(victim) {
    if (solo()) {
      if (state.flying) { state.trails[0] = state.flying.path; state.trailVer++; state.last[0] = state.flying.aim; }
      if (victim === 1) { burst(state.map.ships[1].x, state.map.ships[1].y, '#ffd166', 60); award('Planet bowler'); finishHole(state.roundShots[0], ['Planet putt']); return; }
      // knocked a planet into your own ship: one penalty stroke, the planets stop, keep playing
      for (const pl of state.map.planets) { pl.vx = 0; pl.vy = 0; }
      state.flying = null;
      state.roundShots[0]++;
      state.message = 'a planet hit your ship: +1 penalty stroke';
      burst(state.map.ships[0].x, state.map.ships[0].y, COLORS[0], 30);
      state.settling = false;
      goNext(0);
      return;
    }
    const winner = 1 - victim;
    const s = state.map.ships[victim];
    burst(s.x, s.y, COLORS[victim], 70);
    if (state.flying) { state.trails[state.flying.shooter] = state.flying.path; state.trailVer++; state.last[state.flying.shooter] = state.flying.aim; }
    const chips = ['Planet crush'];
    let text;
    if (winner === state.shooter) { award('Planet bowler'); text = nameOf(winner) + ' knocked a planet into ' + nameOf(victim) + '.'; }
    else text = nameOf(victim) + ' knocked a planet into their own ship.';
    winRound(winner, text, chips);
  }

  function finishTurn() {
    for (const p of state.map.planets) { p.vx = 0; p.vy = 0; }
    state.settling = false;
    goNext(1 - state.shooter);
  }

  // ---------- drawing ----------
  function drawField(G, pol) {
    ctx.save();
    ctx.lineWidth = 1.2;
    for (let gx = 20; gx < W; gx += 40) {
      for (let gy = 20; gy < H; gy += 40) {
        let inside = false;
        for (const p of state.map.planets) if (dist(gx - p.x, gy - p.y) < p.r + 4) inside = true;
        if (inside) continue;
        accel(gx, gy, state.map.planets, G, pol);
        const mag = dist(AX, AY);
        if (mag < 1e-6) continue;
        const len = Math.min(16, 4 + Math.log10(1 + mag * 4000) * 4);
        const ux = AX / mag, uy = AY / mag;
        const alpha = Math.min(0.55, 0.12 + mag * 6);
        ctx.strokeStyle = 'rgba(180,195,255,' + alpha + ')';
        ctx.beginPath();
        ctx.moveTo(gx - ux * len / 2, gy - uy * len / 2);
        ctx.lineTo(gx + ux * len / 2, gy + uy * len / 2);
        ctx.lineTo(gx + ux * len / 2 - (ux * 4 - uy * 3), gy + uy * len / 2 - (uy * 4 + ux * 3));
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawPlanet(p) {
    if (p.kind === 'sun') {
      const glow = ctx.createRadialGradient(p.x, p.y, p.r * 0.8, p.x, p.y, p.r * 1.6);
      glow.addColorStop(0, 'rgba(255,190,70,0.45)'); glow.addColorStop(1, 'rgba(255,190,70,0)');
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 1.6, 0, Math.PI * 2); ctx.fill();
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      g.addColorStop(0, '#fff6d5'); g.addColorStop(0.55, '#ffcc4d'); g.addColorStop(1, '#ff8c2a');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    } else if (p.kind === 'neutron') {
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.5);
      glow.addColorStop(0, 'rgba(200,230,255,0.7)'); glow.addColorStop(1, 'rgba(200,230,255,0)');
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f2f8ff'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    } else if (p.kind === 'quasar') {
      ctx.save();
      // jets from the poles
      const jet = ctx.createLinearGradient(p.x, p.y - p.r * 3.2, p.x, p.y + p.r * 3.2);
      jet.addColorStop(0, 'rgba(150,200,255,0)'); jet.addColorStop(0.5, 'rgba(190,225,255,0.75)'); jet.addColorStop(1, 'rgba(150,200,255,0)');
      ctx.strokeStyle = jet; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(p.x, p.y - p.r * 3.2); ctx.lineTo(p.x, p.y + p.r * 3.2); ctx.stroke();
      // glowing disk
      const glow = ctx.createRadialGradient(p.x, p.y, p.r * 0.3, p.x, p.y, p.r * 1.8);
      glow.addColorStop(0, 'rgba(200,230,255,0.55)'); glow.addColorStop(1, 'rgba(200,230,255,0)');
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(200,230,255,0.4)'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
      const disk = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      disk.addColorStop(0, '#ffffff'); disk.addColorStop(0.35, '#dff0ff'); disk.addColorStop(0.7, '#8fbfff'); disk.addColorStop(1, '#5b6fd6');
      ctx.fillStyle = disk;
      ctx.beginPath(); ctx.ellipse(p.x, p.y, p.r, p.r * 0.55, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.ellipse(p.x, p.y, p.r * 0.7, p.r * 0.38, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    } else if (p.kind === 'jupiter') {
      const g = ctx.createRadialGradient(p.x - p.r * 0.4, p.y - p.r * 0.4, p.r * 0.1, p.x, p.y, p.r);
      g.addColorStop(0, '#f1d2a8'); g.addColorStop(1, '#a8703f');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      ctx.save();
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.clip();
      ctx.fillStyle = 'rgba(120,70,40,0.35)';
      [-0.5, -0.15, 0.25, 0.55].forEach((f, k) => ctx.fillRect(p.x - p.r, p.y + f * p.r, p.r * 2, p.r * (k % 2 ? 0.12 : 0.18)));
      ctx.fillStyle = 'rgba(190,80,50,0.7)';
      ctx.beginPath(); ctx.ellipse(p.x + p.r * 0.3, p.y + p.r * 0.35, p.r * 0.18, p.r * 0.1, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    } else if (p.kind === 'earth') {
      const g = ctx.createRadialGradient(p.x - p.r * 0.4, p.y - p.r * 0.4, p.r * 0.1, p.x, p.y, p.r);
      g.addColorStop(0, '#9fd0ff'); g.addColorStop(0.6, '#3f7fc4'); g.addColorStop(1, '#1d3f6e');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      ctx.save();
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.clip();
      ctx.fillStyle = 'rgba(110,170,90,0.85)';
      ctx.beginPath(); ctx.ellipse(p.x - p.r * 0.3, p.y - p.r * 0.1, p.r * 0.35, p.r * 0.5, 0.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(p.x + p.r * 0.45, p.y + p.r * 0.35, p.r * 0.25, p.r * 0.2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    } else if (p.dense) {
      const g = ctx.createRadialGradient(p.x - p.r * 0.35, p.y - p.r * 0.35, p.r * 0.1, p.x, p.y, p.r);
      g.addColorStop(0, '#4a4466');
      g.addColorStop(1, '#1c1930');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(185,166,255,0.85)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r + 4, 0, Math.PI * 2); ctx.stroke();
    } else {
      const g = ctx.createRadialGradient(p.x - p.r * 0.4, p.y - p.r * 0.4, p.r * 0.1, p.x, p.y, p.r);
      g.addColorStop(0, shade(p.tone, 0.35));
      g.addColorStop(0.65, p.tone);
      g.addColorStop(1, shade(p.tone, -0.45));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
    if (p.pole) {
      // Magnet mode: red ring for north, blue for south
      ctx.save();
      ctx.strokeStyle = p.pole > 0 ? '#ff5d5d' : '#4f9bff';
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r + 4, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
    const label = (p.pole ? (p.pole > 0 ? 'N' : 'S') : 'M') + Math.round(p.m / 100);
    ctx.font = '600 ' + (p.r > 26 ? 13 : 11) + 'px "IBM Plex Mono", monospace';
    ctx.textBaseline = 'middle';
    if (p.r < 16) {
      // too small to hold its label: write it beside the object
      ctx.fillStyle = '#e7e9f3';
      ctx.textAlign = 'left';
      ctx.fillText(label, p.x + p.r + (p.kind === 'neutron' ? p.r * 2 : 6), p.y);
    } else {
      ctx.fillStyle = p.dense ? '#d9d0ff' : 'rgba(10,15,31,0.75)';
      ctx.textAlign = 'center';
      ctx.fillText(label, p.x, p.y);
    }
  }

  function drawPickups() {
    const t = performance.now() / 1000;
    for (const pu of state.map.pickups || []) {
      if (pu.taken) continue;
      const pulse = reduceMotion ? 0 : Math.sin(t * 3 + pu.x) * 2;
      ctx.save();
      ctx.translate(pu.x, pu.y);
      ctx.fillStyle = 'rgba(255,209,102,0.18)';
      ctx.beginPath(); ctx.arc(0, 0, PICKUP_R + 5 + pulse, 0, Math.PI * 2); ctx.fill();
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = '#ffd166';
      ctx.fillRect(-8, -8, 16, 16);
      ctx.restore();
      ctx.fillStyle = '#ffd166';
      ctx.font = '600 11px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(POWERUPS[pu.type].label, pu.x, pu.y + PICKUP_R + 6);
    }
  }

  function drawWall(w) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(185,166,255,0.22)';
    ctx.lineWidth = WALL_W + 10;
    ctx.beginPath(); ctx.moveTo(w.x1, w.y1); ctx.lineTo(w.x2, w.y2); ctx.stroke();
    ctx.strokeStyle = '#3b3266';
    ctx.lineWidth = WALL_W;
    ctx.beginPath(); ctx.moveTo(w.x1, w.y1); ctx.lineTo(w.x2, w.y2); ctx.stroke();
    ctx.strokeStyle = '#b9a6ff';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 8]);
    ctx.beginPath(); ctx.moveTo(w.x1, w.y1); ctx.lineTo(w.x2, w.y2); ctx.stroke();
    ctx.restore();
  }

  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const f = (c) => Math.round(amt >= 0 ? c + (255 - c) * amt : c * (1 + amt));
    return 'rgb(' + f(r) + ',' + f(g) + ',' + f(b) + ')';
  }

  function drawHole(s) {
    // Orbit Golf target: a gold ring with a little flag
    ctx.save();
    ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(s.x, s.y, SHIP_R + 2, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(255,209,102,0.25)';
    ctx.beginPath(); ctx.arc(s.x, s.y, SHIP_R - 2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#e7e9f3'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(s.x, s.y - SHIP_R - 2); ctx.lineTo(s.x, s.y - SHIP_R - 26); ctx.stroke();
    ctx.fillStyle = '#ff8a5c';
    ctx.beginPath(); ctx.moveTo(s.x, s.y - SHIP_R - 26); ctx.lineTo(s.x + 14, s.y - SHIP_R - 21); ctx.lineTo(s.x, s.y - SHIP_R - 16); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function drawShip(i) {
    const s = state.map.ships[i];
    if (i === 1 && state.map.solo) { drawHole(s); return; }
    const col = COLORS[i];
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(0, 0, SHIP_R, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(10,15,31,0.55)';
    ctx.beginPath(); ctx.arc(0, -2, SHIP_R * 0.45, Math.PI, 0); ctx.fill();
    ctx.restore();
    ctx.fillStyle = col;
    ctx.font = '700 13px "Saira Semi Condensed", sans-serif';
    ctx.textAlign = i === 0 ? 'left' : 'right';
    ctx.textBaseline = 'middle';
    const label = nameOf(i);
    const lx = i === 0 ? s.x - SHIP_R : s.x + SHIP_R;
    const ly = s.y > 40 ? s.y - SHIP_R - 12 : s.y + SHIP_R + 14;
    ctx.fillText(label, lx, ly);
  }

  function drawAim() {
    if (state.flying || state.settling || state.roundOver) return;
    const i = state.turn;
    const s = state.map.ships[i];
    const a = state.aim[i];
    const dir = i === 0 ? 1 : -1;
    const rad = a.angle * Math.PI / 180;
    const ux = Math.cos(rad) * dir, uy = -Math.sin(rad);
    const len = 22 + a.power * 3;
    const x0 = s.x + ux * (SHIP_R + 4), y0 = s.y + uy * (SHIP_R + 4);
    const x1 = s.x + ux * (SHIP_R + 4 + len), y1 = s.y + uy * (SHIP_R + 4 + len);
    ctx.strokeStyle = COLORS[i];
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 5]);
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = COLORS[i];
    ctx.beginPath();
    ctx.moveTo(x1 + ux * 8, y1 + uy * 8);
    ctx.lineTo(x1 - uy * 5, y1 + ux * 5);
    ctx.lineTo(x1 + uy * 5, y1 - ux * 5);
    ctx.closePath(); ctx.fill();
  }

  function drawTrail(path, color, alpha) {
    if (!path || path.length < 4) return;
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    for (let k = 0; k < path.length; k += 6) { ctx.moveTo(path[k] + 1.6, path[k + 1]); ctx.arc(path[k], path[k + 1], 1.6, 0, Math.PI * 2); }
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ---------- frame loop ----------
  // The canvas only redraws when something changes, so an idle game costs almost nothing.
  // Everything that sits still between shots (stars, gravity field, old trails, wall, planets) is
  // drawn once into an off-screen layer and copied onto the screen each frame. (Tested against two
  // stacked canvases: the single copy used less CPU.)
  let rafId = 0, bgDrawnKey = '';
  function wake() { if (!rafId) rafId = requestAnimationFrame(frame); }
  const animating = () => !!(state.flying || state.settling || state.particles.length || dragging);

  // Anything that changes the background layer must change this key. Console hacks included,
  // which is why a slow watcher (below) re-checks it a few times a second.
  function bgKey() {
    const m = state.map;
    if (!m) return 'none|' + cv.width;
    let k = m.id + '|' + cv.width + 'x' + cv.height + '|' + game.G + '|' + game.showField + '|' + state.trailVer + '|' + shotPol(state.turn);
    for (const p of m.planets) k += '|' + p.x + ',' + p.y + ',' + p.r + ',' + p.m + ',' + p.kind + ',' + p.pole;
    return k;
  }

  function renderBg(key) {
    if (bg.width !== cv.width || bg.height !== cv.height) { bg.width = cv.width; bg.height = cv.height; }
    ctx = bgCtx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#0a0f1f';
    ctx.fillRect(0, 0, bg.width, bg.height);
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
    const m = state.map;
    if (m) {
      for (const st of m.stars) {
        ctx.fillStyle = 'rgba(220,226,255,' + st.a + ')';
        ctx.fillRect(st.x, st.y, st.s, st.s);
      }
      if (game.showField) drawField(game.G, shotPol(state.turn));
      drawTrail(state.trails[0], COLORS[0], 0.4);
      drawTrail(state.trails[1], COLORS[1], 0.4);
      drawWall(m.wall);
      for (const p of m.planets) drawPlanet(p);
    }
    ctx = mainCtx;
    bgDrawnKey = key;
  }

  function frame() {
    rafId = 0;
    // advance the shot and any moving planets
    if (state.map && (state.flying || state.settling)) {
      const n = !state.flying ? SETTLE_STEPS
        : state.ffwd ? SKIP_STEPS
        : A.demo.active ? FAST_STEPS
        : state.flying.steps > FAST_AFTER ? FAST_STEPS : STEPS_PER_FRAME;
      for (let k = 0; k < n; k++) {
        const c = stepWorld(state.map);
        if (c >= 0) { crush(c); break; }
        if (state.flying) {
          const sh = state.flying;
          const res = stepShot(sh, state.map, game.G, MAX_STEPS);
          if (sh.steps % 2 === 0) sh.path.push(sh.x, sh.y);
          if (res) endShot(res);
          else collectPickups(sh);
        } else if (state.settling) {
          state.settleSteps++;
          if (!state.map.planets.some(isMoving) || state.settleSteps > SETTLE_MAX) { finishTurn(); break; }
        } else break;
      }
    }
    if (state.particles.length) {
      for (const pt of state.particles) { pt.x += pt.vx; pt.y += pt.vy; pt.vx *= 0.97; pt.vy *= 0.97; pt.life--; }
      state.particles = state.particles.filter((pt) => pt.life > 0);
    }

    const key = bgKey();
    if (key !== bgDrawnKey) renderBg(key);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(bg, 0, 0);
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);

    const m = state.map;
    if (m) {
      drawPickups();
      if (state.resizeMode && state.resizeSel >= 0) {
        const sp = m.planets[state.resizeSel];
        ctx.save();
        ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 2; ctx.setLineDash([6, 5]);
        ctx.beginPath(); ctx.arc(sp.x, sp.y, sp.r + 7, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }
      if (state.armed.arc && idle()) {
        const pts = previewPath(), n = pts.length / 2;
        ctx.fillStyle = '#ffd166';
        for (let k = 0; k < n; k++) {
          ctx.globalAlpha = 0.9 * (1 - k / n) + 0.1;
          ctx.beginPath(); ctx.arc(pts[2 * k], pts[2 * k + 1], 2.2, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      drawShip(0); drawShip(1);
      drawAim();
      const sh = state.flying;
      if (sh) {
        const path = sh.path;
        ctx.strokeStyle = COLORS[sh.shooter];
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        const start = Math.max(0, path.length - 240);
        ctx.moveTo(path[start], path[start + 1]);
        for (let k = start + 2; k < path.length; k += 2) ctx.lineTo(path[k], path[k + 1]);
        ctx.stroke();
        ctx.globalAlpha = 1;
        const mf = massFactor(sh.steps);
        const br = 3 * Math.sqrt(mf);
        if (sh.pierce > 0) {
          ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(sh.x, sh.y, br + 4, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(sh.x, sh.y, br, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffd166';
        ctx.font = '600 11px "IBM Plex Mono", monospace';
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText('m ' + mf.toFixed(1) + '×', sh.x + br + 5, sh.y - br - 4);
      }
    }
    for (const pt of state.particles) {
      ctx.globalAlpha = Math.max(0, pt.life / 70);
      ctx.fillStyle = pt.color;
      ctx.fillRect(pt.x - 1.5, pt.y - 1.5, 3, 3);
    }
    ctx.globalAlpha = 1;
    if (animating()) wake();
  }
  // Catches changes made from outside the game's own controls (the console, mostly).
  setInterval(() => { if (bgKey() !== bgDrawnKey) wake(); }, 250);

  // ---------- input ----------
  function setAim(angle, power) {
    const a = state.aim[state.turn];
    if (angle !== undefined) {
      angle = Math.round(angle);
      if (angle > 180) angle -= 360;
      if (angle < -180) angle += 360;
      a.angle = Math.max(-180, Math.min(180, angle));
    }
    if (power !== undefined) a.power = Math.max(1, Math.min(POWER_MAX, Math.round(power)));
    syncAimInputs();
    wake();
  }

  angleRange.addEventListener('input', () => setAim(+angleRange.value));
  angleNum.addEventListener('input', () => { if (angleNum.value !== '' && !isNaN(+angleNum.value)) setAim(+angleNum.value); });
  powerRange.addEventListener('input', () => setAim(undefined, +powerRange.value));
  powerNum.addEventListener('input', () => { if (powerNum.value !== '' && !isNaN(+powerNum.value)) setAim(undefined, +powerNum.value); });
  fireBtn.addEventListener('click', fire);
  function nextRound() {
    if (solo() && state.round >= GOLF_HOLES) { setCode(MODES.golf.prefix + randomCode(), true); return; }
    state.round++;
    loadRound();
  }
  $('next-btn').addEventListener('click', nextRound);
  $('load-btn').addEventListener('click', () => setCode(seedInput.value, true));
  seedInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') setCode(seedInput.value, true); });
  $('new-btn').addEventListener('click', () => setCode(state.mode.prefix + randomCode(), true));
  $('daily-btn').addEventListener('click', () => { setCode(state.mode.prefix + dailyCode(), true); toast('Daily map for ' + A.todayKey()); });
  $('mode-select').addEventListener('change', (e) => {
    const m = MODES[e.target.value] || MODES.classic;
    setCode(m.prefix + baseCode(state.code.startsWith('DEMO-') ? dailyCode() : state.code), true);
  });
  function togglePole() {
    if (!magnets() || !idle()) return;
    const a = state.aim[state.turn];
    a.pol = -a.pol;
    renderHud();
  }
  $('pole-btn').addEventListener('click', togglePole);
  $('field-toggle').addEventListener('change', (e) => { game.showField = e.target.checked; wake(); });
  names.forEach((n) => n.addEventListener('input', renderHud));

  // drag on the field to aim from the current ship
  let dragging = false;
  function aimFromPointer(e) {
    if (!state.map || state.flying || state.settling || state.roundOver) return;
    const rect = cv.getBoundingClientRect();
    const wx = (e.clientX - rect.left) / rect.width * W;
    const wy = (e.clientY - rect.top) / rect.height * H;
    const s = state.map.ships[state.turn];
    const dx = wx - s.x, dy = s.y - wy;
    const theta = Math.atan2(dy, dx) * 180 / Math.PI;
    const angle = state.turn === 0 ? theta : 180 - theta;
    setAim(angle, (dist(dx, dy) - SHIP_R - 20) / 6);
  }
  cv.addEventListener('pointerdown', (e) => {
    if (state.resizeMode) {
      const rect = cv.getBoundingClientRect();
      const wx = (e.clientX - rect.left) / rect.width * W;
      const wy = (e.clientY - rect.top) / rect.height * H;
      let best = -1, bd = Infinity;
      state.map.planets.forEach((p, i) => { const d = dist(p.x - wx, p.y - wy) - p.r; if (d < 14 && d < bd) { bd = d; best = i; } });
      state.resizeSel = best;
      if (best >= 0 && state.held[state.turn] === 'flip') { flipMagnet(best); return; }
      renderHud();
      return;
    }
    dragging = true; try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } aimFromPointer(e); });
  cv.addEventListener('pointermove', (e) => { if (dragging) aimFromPointer(e); });
  cv.addEventListener('pointerup', () => { dragging = false; });
  cv.addEventListener('pointercancel', () => { dragging = false; });

  window.addEventListener('keydown', (e) => {
    if (A.modalOpen()) return;
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' && e.target.type !== 'range') return;
    const step = e.shiftKey ? 5 : 1;
    const a = state.aim[state.turn];
    if (e.key === 'p' || e.key === 'P') { togglePole(); e.preventDefault(); return; }
    if (e.key === 'ArrowUp') { setAim(a.angle + step); e.preventDefault(); }
    else if (e.key === 'ArrowDown') { setAim(a.angle - step); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { setAim(undefined, a.power + step); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { setAim(undefined, a.power - step); e.preventDefault(); }
    else if (e.key === ' ' || e.key === 'Enter') {
      if (tag === 'BUTTON') return;
      if (state.roundOver) nextRound(); else fire();
      e.preventDefault();
    }
  });

  window.addEventListener('hashchange', () => {
    const c = cleanCode(location.hash.slice(1));
    if (c && c !== state.code) setCode(c, true);
  });

  // ---------- boot ----------
  function start(saved) {
    saved = saved || {};
    resize();
    if (saved.names) saved.names.forEach((n, i) => { if (n) names[i].value = n; });
    const fromHash = cleanCode(location.hash.slice(1));
    const code = saved.code || fromHash || dailyCode();
    state.code = cleanCode(code);
    seedInput.value = state.code;
    if (saved.wins) {
      state.round = saved.round || 1;
      state.wins = saved.wins;
      state.draws = saved.draws || 0;
      state.totalShots = saved.totalShots || [0, 0];
      state.slingshots = saved.slingshots || [0, 0];
      badges.load(saved.badges);
    }
    if (saved.wins) loadRound();
    else startDemo();
    wake();
    A.hacker('Gravity Duel', game, {
      G: 'gravity strength (normal is ' + DEFAULT_G + ')',
      planets: 'every planet: x, y, r = radius, m = mass, vx/vy = speed',
      ships: 'where the two ships are',
      code: 'the map code',
      answers: 'every quiz answer so far',
      showField: 'gravity arrows on (true) or off (false)'
    }, ['game.G = 0.3        (what does stronger gravity do?)', 'game.planets[0].m = 20000   (make one planet super heavy)', 'game.showField = false']);
  }

  if (window.claude && window.claude.hot && typeof window.claude.hot.snapshot === 'function') {
    try {
      window.claude.hot.snapshot(() => A.demo.active ? {} : ({
        code: state.code, round: state.round, wins: state.wins, draws: state.draws, totalShots: state.totalShots,
        slingshots: state.slingshots, badges: badges.list(), names: names.map((n) => n.value)
      }));
    } catch (e) { /* ignore */ }
  }
  if (window.claude && window.claude.hot && window.claude.hot.ready) window.claude.hot.ready(start);
  else start((window.claude && window.claude.hot && window.claude.hot.data) || {});
})();
