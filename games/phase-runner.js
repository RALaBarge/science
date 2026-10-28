// Phase Runner: you are a blob of water. Heat up to steam, cool down to ice, and use each state's
// powers to reach the exit. Science: states of matter, melting/freezing at 0°C, boiling at 100°C,
// evaporation, condensation, ice floating, hot air rising.
(function () {
  'use strict';
  const A = window.Arcade;
  const { $, cleanCode, toast } = A;

  // ---------- world ----------
  const TILE = 40, COLS = 24, ROWS = 14, W = COLS * TILE, H = ROWS * TILE;
  const START_T = 20, MIN_T = -60, MAX_T = 160, PACK = 110;
  // Each state moves differently. Water walks and jumps; ice is heavy and slippery; steam floats up.
  const FORMS = {
    ice: { name: 'Ice', state: 'solid', w: 30, h: 30, accel: 0.25, max: 6, fric: 0.985, air: 0.99, g: 0.55, jump: 7, fall: 12 },
    water: { name: 'Water', state: 'liquid', w: 28, h: 26, accel: 0.6, max: 3.2, fric: 0.75, air: 0.92, g: 0.45, jump: 8.5, fall: 10 },
    steam: { name: 'Steam', state: 'gas', w: 34, h: 24, accel: 0.25, max: 2.2, fric: 0.94, air: 0.94, g: -0.12, jump: 0, fall: 2.5 }
  };
  const formOf = (T) => (T >= 100 ? 'steam' : T <= 0 ? 'ice' : 'water');

  // Tiles. # rock · ^ heater pad · * freezer pad · = grate (gas and liquid pass, ice doesn't)
  // ~ pool (ice floats; water falls in) · X cracked block (fast ice smashes it) · H hot air · C cold air
  // > < vents (push steam) · E exit · K checkpoint · h heat pack · c cold pack · S start
  const LEVELS = [
    { name: 'Rise up', par: 12, packs: [0, 0], lesson: 'evaporate', map: [
      '########################',
      '#...........CCCCCCCCCC.#',
      '#...........CCCCCCCCCC.#',
      '#.......HHH.#..........#',
      '#.......HHH.#..........#',
      '#.......HHH.#..........#',
      '#.......HHH.#..........#',
      '#.......HHH.#..........#',
      '#.......HHH.#..........#',
      '#.......HHH.#..........#',
      '#.......HHH.#..........#',
      '#.S.....HHH.#........E.#',
      '########^^^#############',
      '########################'] },
    { name: 'Through the grate', par: 16, packs: [0, 0], lesson: 'grate', map: [
      '########################',
      '#.................CCCCC#',
      '#.................CCCCC#',
      '#.................CCCCC#',
      '##===############=====##',
      '#.HHH.###########.....##',
      '#.HHH.###########.....##',
      '#.HHH.###########.....##',
      '#.HHH.###########.....##',
      '#.HHH.###########.....##',
      '#.HHH.###########.....##',
      '#SHHH.###########...E.##',
      '##^^^###################',
      '########################'] },
    { name: 'Ice floats', par: 9, packs: [0, 0], lesson: 'float', map: [
      '########################',
      '#..................=...#',
      '#..................=...#',
      '#..................=...#',
      '#..................=...#',
      '#..................=...#',
      '#..................=...#',
      '#..................=...#',
      '#..................=...#',
      '#..................=...#',
      '#..................=...#',
      '#.S.............K..=.E.#',
      '###**####~~~~~~##^^#####',
      '#########~~~~~~#########'] },
    { name: 'Smash!', par: 16, packs: [0, 0], lesson: 'smash', map: [
      '########################',
      '#................CCCCCC#',
      '#................CCCCCC#',
      '#.....................E#',
      '#.............HH########',
      '#.......X.....HH.......#',
      '#.......X.....HH.......#',
      '#.......X.....HH.......#',
      '#.......X.....HH.......#',
      '#.......X.....HH.......#',
      '#.......X.....HH.......#',
      '#S......X.....HH.......#',
      '#**###########^^########',
      '########################'] },
    { name: 'Ride the wind', par: 11, packs: [0, 0], lesson: 'vent', map: [
      '########################',
      '#>>>>>>>>>>>>>>>>>CCCCC#',
      '#>>>>>>>>>>>>>>>>>CCCCC#',
      '#......................#',
      '#......................#',
      '#......................#',
      '#......................#',
      '#......................#',
      '#......................#',
      '#......................#',
      '#......................#',
      '#.S.h................E.#',
      '#####~~~~~~~~~~~~~~#####',
      '#####~~~~~~~~~~~~~~#####'] },
    { name: 'Grand tour', par: 22, packs: [0, 1], lesson: 'tour', map: [
      '########################',
      '#.........>>>>>>>>>CCCC#',
      '#.........>>>>>>>>>CCCC#',
      '#.........>>>>>>>>>CCCC#',
      '#.......====#####=====##',
      '#.......HHHH#.........##',
      '#.......HHHH#.........##',
      '#.......HHHH#.........##',
      '#.......HHHH#.........##',
      '#....X..HHHH#.........##',
      '#....X..HHHH#.........##',
      '#S...X..HHHH#E........##',
      '#**###~~^^^^##~~~~######',
      '######~~######~~~~######'] }
  ];
  LEVELS.forEach((lv, i) => lv.map.forEach((row, r) => { if (row.length !== COLS) throw new Error('level ' + (i + 1) + ' row ' + r + ' is ' + row.length); }));

  function mirrorMap(map) {
    const swap = { '>': '<', '<': '>' };
    return map.map((row) => row.split('').reverse().map((ch) => swap[ch] || ch).join(''));
  }

  // A world is everything the physics needs. step() advances it one 1/60 s tick, using only exact
  // arithmetic, so the same inputs always give the same result (that's what lets a bot play the demo).
  function makeWorld(levelIndex, mirrored) {
    const lv = LEVELS[levelIndex];
    const map = mirrored ? mirrorMap(lv.map) : lv.map;
    const grid = map.map((row) => row.split(''));
    let sx = 0, sy = 0;
    grid.forEach((row, r) => row.forEach((ch, c) => { if (ch === 'S') { sx = c; sy = r; row[c] = '.'; } }));
    const w = {
      level: levelIndex, mirrored, grid, version: 0,
      spawn: { x: sx * TILE + TILE / 2, y: (sy + 1) * TILE },
      p: null, packs: { heat: lv.packs[0], cold: lv.packs[1] },
      frame: 0, deaths: 0, won: false, events: [], gScale: 1
    };
    respawn(w);
    return w;
  }
  function respawn(w) {
    const f = FORMS.water;
    w.p = { x: w.spawn.x - f.w / 2, y: w.spawn.y - f.h, vx: 0, vy: 0, T: START_T, form: 'water', ground: false, onPad: '', face: 1 };
  }
  const cell = (w, c, r) => (c < 0 || c >= COLS || r < 0 ? '#' : r >= ROWS ? '.' : w.grid[r][c]);
  function solidFor(ch, form) {
    if (ch === '#' || ch === '^' || ch === '*' || ch === 'X') return true;
    if (ch === '=' || ch === '~') return form === 'ice';
    return false;
  }
  // Every tile a box touches, for zones and collisions.
  function eachTile(x, y, bw, bh, fn) {
    const c0 = Math.floor(x / TILE), c1 = Math.floor((x + bw - 0.001) / TILE);
    const r0 = Math.floor(y / TILE), r1 = Math.floor((y + bh - 0.001) / TILE);
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) if (fn(c, r) === false) return;
  }
  function overlapsSolid(w, x, y, bw, bh, form) {
    let hit = false;
    eachTile(x, y, bw, bh, (c, r) => { if (solidFor(cell(w, c, r), form)) { hit = true; return false; } });
    return hit;
  }

  function step(w, input) {
    if (w.won) return;
    const p = w.p;
    let f = FORMS[p.form];
    w.frame++;
    // ---- temperature ----
    let rate = 0, zoneH = false, zoneC = false, vent = 0;
    eachTile(p.x, p.y, f.w, f.h, (c, r) => {
      const ch = cell(w, c, r);
      if (ch === 'H') zoneH = true; else if (ch === 'C') zoneC = true;
      else if (ch === '>') vent = 1; else if (ch === '<') vent = -1;
    });
    if (p.onPad === '^') rate += 60;
    if (p.onPad === '*') rate -= 60;
    if (zoneH) rate += 40;
    if (zoneC) rate -= 30;
    if (rate === 0) {
      // nothing heating or cooling: drift toward room temperature (steam condenses, ice melts)
      if (p.form === 'steam') rate = -4;
      else if (p.form === 'ice') rate = 4;
      else if (p.T > START_T + 0.5) rate = -3; else if (p.T < START_T - 0.5) rate = 3;
    }
    if (input.heat) usePack(w, 'heat');
    if (input.cold) usePack(w, 'cold');
    const T0 = p.T;
    p.T = A.clamp(p.T + rate / 60, MIN_T, MAX_T);
    const nf = formOf(p.T);
    if (nf !== p.form) changeForm(w, nf);
    f = FORMS[p.form];
    // ---- movement ----
    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    if (dir) { p.vx += dir * f.accel; p.face = dir; }
    else p.vx *= p.ground ? f.fric : f.air;
    if (Math.abs(p.vx) < 0.01) p.vx = 0;
    const cap = p.form === 'steam' && vent ? 4 : f.max;
    if (vent && p.form === 'steam') p.vx += vent * 0.35;
    p.vx = A.clamp(p.vx, -cap, cap);
    if (input.jump && p.ground && f.jump) { p.vy = -f.jump; p.ground = false; }
    p.vy += f.g * w.gScale;
    p.vy = p.form === 'steam' ? A.clamp(p.vy, -f.fall, f.fall) : Math.min(p.vy, f.fall);
    // horizontal
    p.x += p.vx;
    eachTile(p.x, p.y, f.w, f.h, (c, r) => {
      const ch = cell(w, c, r);
      if (!solidFor(ch, p.form)) return;
      if (ch === 'X' && p.form === 'ice' && Math.abs(p.vx) >= 3.5) { smash(w, c, r); p.vx *= 0.7; return; }
      if (p.vx > 0) p.x = c * TILE - f.w; else if (p.vx < 0) p.x = (c + 1) * TILE;
      p.vx = 0;
      return false;
    });
    // vertical
    p.y += p.vy;
    p.ground = false; p.onPad = '';
    eachTile(p.x, p.y, f.w, f.h, (c, r) => {
      const ch = cell(w, c, r);
      if (!solidFor(ch, p.form)) return;
      if (ch === 'X' && p.form === 'ice' && p.vy >= 6) { smash(w, c, r); p.vy *= 0.5; return; }
      if (p.vy > 0) { p.y = r * TILE - f.h; p.ground = true; } else if (p.vy < 0) p.y = (r + 1) * TILE;
      p.vy = 0;
      return false;
    });
    if (p.ground) {
      // what am I standing on?
      const r = Math.floor((p.y + f.h + 1) / TILE);
      for (const x of [p.x + 2, p.x + f.w - 2]) { const ch = cell(w, Math.floor(x / TILE), r); if (ch === '^' || ch === '*') p.onPad = ch; }
    }
    // ---- touching things ----
    let dead = p.y > H + 40, won = false;
    eachTile(p.x, p.y, f.w, f.h, (c, r) => {
      const ch = cell(w, c, r);
      if (ch === '~' && p.form !== 'ice') dead = true;
      else if (ch === 'E') won = true;
      else if (ch === 'h' || ch === 'c') { w.packs[ch === 'h' ? 'heat' : 'cold']++; w.grid[r][c] = '.'; w.version++; w.events.push({ type: 'pickup', what: ch, x: c * TILE + TILE / 2, y: r * TILE + TILE / 2 }); }
      else if (ch === 'K') { w.spawn = { x: c * TILE + TILE / 2, y: (r + 1) * TILE }; w.grid[r][c] = 'k'; w.version++; w.events.push({ type: 'checkpoint' }); }
    });
    if (won) { w.won = true; w.events.push({ type: 'won' }); return; }
    if (dead) { w.deaths++; w.events.push({ type: 'died', why: p.form === 'water' ? 'pool' : 'fell', x: p.x, y: p.y }); respawn(w); }
    // nothing moving and temperature steady: the page can stop drawing until a key is pressed
    w.resting = !dead && p.ground && p.vx === 0 && p.vy === 0 && p.T === T0 && !dir && !input.jump;
  }

  function usePack(w, kind) {
    if (w.packs[kind] <= 0) { w.events.push({ type: 'nopack', kind }); return; }
    w.packs[kind]--;
    w.p.T = A.clamp(w.p.T + (kind === 'heat' ? PACK : -PACK), MIN_T, MAX_T);
    w.events.push({ type: 'pack', kind });
  }

  // Change state, keeping the blob's bottom center in place, and nudge it out of walls if it grew.
  function changeForm(w, nf) {
    const p = w.p, of = FORMS[p.form], f = FORMS[nf];
    const cx = p.x + of.w / 2, bottom = p.y + of.h;
    w.events.push({ type: 'form', from: p.form, to: nf, x: cx, y: bottom - of.h / 2 });
    p.form = nf;
    p.x = cx - f.w / 2; p.y = bottom - f.h;
    if (overlapsSolid(w, p.x, p.y, f.w, f.h, nf)) {
      for (const [dx, dy] of [[0, -6], [-6, 0], [6, 0], [0, -12], [-12, 0], [12, 0], [0, 6]]) {
        if (!overlapsSolid(w, p.x + dx, p.y + dy, f.w, f.h, nf)) { p.x += dx; p.y += dy; break; }
      }
    }
    if (nf === 'steam') p.vy = Math.min(p.vy, 0);
  }

  function smash(w, c, r) {
    w.grid[r][c] = '.';
    w.version++;
    w.events.push({ type: 'smash', x: c * TILE + TILE / 2, y: r * TILE + TILE / 2 });
  }

  // ---------- demo bots ----------
  // Simple rule-following players for the levels the demo shows. They read the world and press keys.
  function exitX(w) {
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (w.grid[r][c] === 'E') return c * TILE + TILE / 2;
    return W;
  }
  // walk toward the exit, used once a bot has done the level's trick
  const toExit = (w) => { const cx = w.p.x + FORMS[w.p.form].w / 2, ex = exitX(w); return { left: cx > ex + 4, right: cx < ex - 4 }; };
  const BOTS = {
    0: (w, m) => {
      const p = w.p;
      if (p.form === 'steam') { m.wasSteam = true; return { right: p.y < 3 * TILE }; }
      if (!m.wasSteam) return { right: p.x + 14 < 9.5 * TILE };
      return toExit(w);
    },
    2: (w, m) => {
      const p = w.p;
      if (!m.cold) { if (p.T <= -50) m.cold = true; return { right: p.x + 15 < 3.5 * TILE }; }
      return p.form === 'ice' ? { right: true } : toExit(w);
    },
    4: (w, m) => {
      const p = w.p;
      if (!m.got) { if (w.packs.heat > 0) m.got = true; return { right: true }; }
      if (!m.used) { m.used = true; return { heat: true }; }
      return p.form === 'steam' ? {} : toExit(w);
    }
  };
  const DEMO_LEVELS = [0, 2, 4];

  // ---------- page state ----------
  const state = {
    world: null, level: 0, mirrored: false, bot: null, botMem: {},
    keys: { left: false, right: false, jump: false }, pending: { heat: false, cold: false },
    acc: 0, last: 0, quizzed: false, runStart: 0, pausedAt: 0, pausedTotal: 0, finalMs: 0, seen: new Set(), stars: 0, hacked: false, particles: []
  };
  if (/[?&]test\b/.test(location.search)) {
    window.__s = state;
    window.__pr = {
      LEVELS, makeWorld, step, BOTS,
      // run a bot (or a fixed input) headlessly; returns frames to win or null
      exitX, FORMS, TILE,
      run(levelIndex, mirrored, maxFrames, customBot) {
        const w = makeWorld(levelIndex, mirrored), m = {}, bot = customBot || BOTS[levelIndex];
        for (let i = 0; i < maxFrames && !w.won; i++) step(w, bot ? bot(w, m) : {});
        return { won: w.won, frames: w.frame, deaths: w.deaths, T: Math.round(w.p.T), form: w.p.form, x: Math.round(w.p.x), y: Math.round(w.p.y) };
      }
    };
  }

  const game = {
    get temperature() { return state.world ? Math.round(state.world.p.T) : START_T; },
    set temperature(v) { if (state.world) { state.world.p.T = A.clamp(+v || 0, MIN_T, MAX_T); state.hacked = true; } },
    get form() { return state.world ? FORMS[state.world.p.form].name + ' (' + FORMS[state.world.p.form].state + ')' : ''; },
    get packs() { return state.world ? Object.assign({}, state.world.packs) : {}; },
    set packs(v) { if (state.world && v) { state.world.packs.heat = v.heat | 0; state.world.packs.cold = v.cold | 0; state.hacked = true; renderHud(); } },
    get gravity() { return state.world ? state.world.gScale : 1; },
    set gravity(v) { if (state.world) { state.world.gScale = +v || 0; state.hacked = true; } },
    get level() { return state.level + 1; },
    get answers() { return A.answers; }
  };

  // ---------- drawing ----------
  const cv = $('cv'), ctx = cv.getContext('2d');
  const bg = document.createElement('canvas'), bgCtx = bg.getContext('2d', { alpha: false });
  const stage = $('stage');
  let fit = { k: 1 }, bgKey = '';
  const playing = () => !!state.world && !state.world.won && !A.modalOpen();
  const anyKey = () => state.keys.left || state.keys.right || state.keys.jump || state.pending.heat || state.pending.cold;
  // Keep drawing while something moves. A blob at rest with steady temperature lets the page sleep.
  const loop = A.loop(frame, () => (playing() && (!state.world.resting || anyKey() || !!state.bot)) || state.particles.length > 0);
  const wake = loop.wake;
  function resize() { fit = A.fitCanvas(cv, W, H); bgKey = ''; wake(); }
  window.addEventListener('resize', resize);

  function drawTile(g, ch, c, r) {
    const x = c * TILE, y = r * TILE;
    if (ch === '#' || ch === '^' || ch === '*') {
      g.fillStyle = '#28324f'; g.fillRect(x, y, TILE, TILE);
      g.fillStyle = '#323e60'; g.fillRect(x + 2, y + 2, TILE - 4, TILE / 2 - 3);
      g.strokeStyle = '#1b2238'; g.lineWidth = 1; g.strokeRect(x + 0.5, y + 0.5, TILE - 1, TILE - 1);
      if (ch === '^') { g.fillStyle = '#ff7a3d'; g.fillRect(x, y, TILE, 7); g.fillStyle = 'rgba(255,140,60,0.35)'; g.fillRect(x, y - 10, TILE, 10); }
      if (ch === '*') { g.fillStyle = '#9fe0ff'; g.fillRect(x, y, TILE, 7); g.fillStyle = '#e8f8ff'; for (let k = 4; k < TILE; k += 9) g.fillRect(x + k, y + 1, 3, 3); }
    } else if (ch === '=') {
      g.strokeStyle = '#8a94ab'; g.lineWidth = 2;
      for (let k = 4; k < TILE; k += 8) { g.beginPath(); g.moveTo(x + k, y); g.lineTo(x + k, y + TILE); g.stroke(); g.beginPath(); g.moveTo(x, y + k); g.lineTo(x + TILE, y + k); g.stroke(); }
    } else if (ch === '~') {
      g.fillStyle = '#1f5fa8'; g.fillRect(x, y, TILE, TILE);
      if (cellAbove(c, r) !== '~') { g.fillStyle = '#4f9bff'; g.fillRect(x, y, TILE, 5); }
    } else if (ch === 'X') {
      g.fillStyle = '#9cc9e8'; g.fillRect(x + 2, y + 2, TILE - 4, TILE - 4);
      g.strokeStyle = '#335a7a'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(x + 8, y + 6); g.lineTo(x + 20, y + 20); g.lineTo(x + 14, y + 34); g.moveTo(x + 20, y + 20); g.lineTo(x + 34, y + 14); g.stroke();
    } else if (ch === 'H') {
      g.fillStyle = 'rgba(255,110,60,0.10)'; g.fillRect(x, y, TILE, TILE);
      g.strokeStyle = 'rgba(255,140,80,0.25)'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(x + 12, y + 34); g.quadraticCurveTo(x + 4, y + 20, x + 12, y + 6); g.moveTo(x + 28, y + 34); g.quadraticCurveTo(x + 20, y + 20, x + 28, y + 6); g.stroke();
    } else if (ch === 'C') {
      g.fillStyle = 'rgba(120,200,255,0.10)'; g.fillRect(x, y, TILE, TILE);
      g.fillStyle = 'rgba(220,240,255,0.5)'; g.fillRect(x + 9, y + 11, 3, 3); g.fillRect(x + 27, y + 25, 3, 3); g.fillRect(x + 18, y + 31, 2, 2);
    } else if (ch === '>' || ch === '<') {
      g.fillStyle = 'rgba(200,220,255,0.06)'; g.fillRect(x, y, TILE, TILE);
      g.strokeStyle = 'rgba(200,220,255,0.3)'; g.lineWidth = 2;
      const d = ch === '>' ? 1 : -1;
      g.beginPath(); g.moveTo(x + 20 - d * 8, y + 12); g.lineTo(x + 20 + d * 6, y + 20); g.lineTo(x + 20 - d * 8, y + 28); g.stroke();
    } else if (ch === 'E') {
      g.fillStyle = 'rgba(126,224,161,0.18)'; g.fillRect(x, y, TILE, TILE);
      g.strokeStyle = '#7ee0a1'; g.lineWidth = 3; g.strokeRect(x + 4, y + 4, TILE - 8, TILE - 8);
      g.fillStyle = '#7ee0a1'; g.font = '700 12px "IBM Plex Mono", monospace'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('EXIT', x + TILE / 2, y + TILE / 2);
    } else if (ch === 'K' || ch === 'k') {
      g.strokeStyle = '#e7e9f3'; g.lineWidth = 2; g.beginPath(); g.moveTo(x + 12, y + TILE); g.lineTo(x + 12, y + 6); g.stroke();
      g.fillStyle = ch === 'k' ? '#7ee0a1' : '#ffd166'; g.beginPath(); g.moveTo(x + 12, y + 6); g.lineTo(x + 32, y + 12); g.lineTo(x + 12, y + 18); g.closePath(); g.fill();
    }
  }
  const cellAbove = (c, r) => (state.world && r > 0 ? state.world.grid[r - 1][c] : '#');

  function renderBg() {
    const w = state.world;
    const key = (w ? w.level + '|' + w.mirrored + '|' + w.version : 'none') + '|' + cv.width;
    if (key === bgKey) return;
    bgKey = key;
    bg.width = cv.width; bg.height = cv.height;
    const g = bgCtx;
    g.setTransform(1, 0, 0, 1, 0, 0);
    const grd = g.createLinearGradient(0, 0, 0, bg.height);
    grd.addColorStop(0, '#0d1428'); grd.addColorStop(1, '#141c33');
    g.fillStyle = grd; g.fillRect(0, 0, bg.width, bg.height);
    g.setTransform(fit.k, 0, 0, fit.k, 0, 0);
    if (!w) return;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) { const ch = w.grid[r][c]; if (ch !== '.' && ch !== 'h' && ch !== 'c') drawTile(g, ch, c, r); }
  }

  function frame(t) {
    const w = state.world;
    // fixed 60 Hz physics, however fast the screen refreshes
    if (playing()) {
      if (!state.last) state.last = t;
      state.acc = Math.min(state.acc + (t - state.last), 100);
      state.last = t;
      while (state.acc >= 1000 / 60) {
        state.acc -= 1000 / 60;
        const input = state.bot ? state.bot(w, state.botMem) : { left: state.keys.left, right: state.keys.right, jump: state.keys.jump, heat: state.pending.heat, cold: state.pending.cold };
        state.pending.heat = state.pending.cold = false;
        step(w, input);
        handleEvents();
        if (!playing()) break;
      }
    } else state.last = 0;
    renderBg();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(bg, 0, 0);
    ctx.setTransform(fit.k, 0, 0, fit.k, 0, 0);
    if (!w) return;
    // pickups
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const ch = w.grid[r][c];
      if (ch !== 'h' && ch !== 'c') continue;
      const x = c * TILE + TILE / 2, y = r * TILE + TILE / 2;
      ctx.fillStyle = ch === 'h' ? '#ff7a3d' : '#9fe0ff';
      ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#10131f'; ctx.font = '700 13px "Saira Semi Condensed", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(ch === 'h' ? 'HOT' : 'COLD', x, y + 1);
    }
    drawPlayer(w.p, w.frame);
    for (const pt of state.particles) {
      pt.x += pt.vx; pt.y += pt.vy; pt.vy += pt.g; pt.life--;
      ctx.globalAlpha = Math.max(0, pt.life / pt.max); ctx.fillStyle = pt.col;
      ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    state.particles = state.particles.filter((pt) => pt.life > 0);
    updateThermo();
  }

  function drawPlayer(p, fr) {
    const f = FORMS[p.form], cx = p.x + f.w / 2, cy = p.y + f.h / 2;
    ctx.save();
    if (p.form === 'water') {
      const wob = A.reduceMotion ? 0 : (p.ground && Math.abs(p.vx) > 0.3 ? Math.sin(fr * 0.4) * 1.5 : 0);
      ctx.fillStyle = '#3d8bff';
      ctx.beginPath();
      ctx.moveTo(cx, p.y - 6 + wob);
      ctx.quadraticCurveTo(cx + f.w / 2 + 4, cy + 2, cx + f.w / 2 - 2, p.y + f.h - 4);
      ctx.quadraticCurveTo(cx, p.y + f.h + 3, cx - f.w / 2 + 2, p.y + f.h - 4);
      ctx.quadraticCurveTo(cx - f.w / 2 - 4, cy + 2, cx, p.y - 6 + wob);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.beginPath(); ctx.ellipse(cx - 6, cy - 2, 3, 6, -0.4, 0, Math.PI * 2); ctx.fill();
    } else if (p.form === 'ice') {
      ctx.fillStyle = '#bfe8ff'; ctx.fillRect(p.x, p.y, f.w, f.h);
      ctx.fillStyle = '#e9f8ff'; ctx.fillRect(p.x + 3, p.y + 3, f.w - 12, 6);
      ctx.strokeStyle = '#6fb6e0'; ctx.lineWidth = 2; ctx.strokeRect(p.x + 1, p.y + 1, f.w - 2, f.h - 2);
    } else {
      ctx.fillStyle = 'rgba(235,240,250,0.92)';
      for (const [dx, dy, r] of [[-9, 4, 10], [0, -2, 12], [10, 4, 10], [0, 6, 10]]) { ctx.beginPath(); ctx.arc(cx + dx, cy + dy, r, 0, Math.PI * 2); ctx.fill(); }
    }
    // eyes, looking the way it moves
    ctx.fillStyle = p.form === 'steam' ? '#5a6584' : '#10131f';
    const ex = cx + p.face * 3;
    ctx.beginPath(); ctx.arc(ex - 5, cy + 1, 2.2, 0, Math.PI * 2); ctx.arc(ex + 5, cy + 1, 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function puff(x, y, col, n, g) {
    const count = A.reduceMotion ? Math.ceil(n / 4) : n;
    for (let i = 0; i < count; i++) state.particles.push({ x, y, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.7) * 3, g: g || 0.1, r: 2 + Math.random() * 3, life: 30, max: 30, col });
  }

  // ---------- events from the physics ----------
  const FORM_FACTS = {
    'water>steam': ['You evaporated!', 'At 100°C liquid water boils into steam, a gas. Gas particles zoom apart, so steam spreads out and floats up through grates.'],
    'steam>water': ['You condensed!', 'Steam cooled below 100°C and turned back into liquid water. That’s how clouds and dew form.'],
    'water>ice': ['You froze!', 'At 0°C water freezes into ice, a solid. Its particles lock in place, and it expands, so ice floats on water.'],
    'ice>water': ['You melted!', 'Ice warmed above 0°C and turned back into liquid water. The amount of water didn’t change, only its state.'],
    'steam>ice': ['Straight from gas to solid!', 'You cooled so fast you skipped being a liquid. Scientists call that deposition. It’s how frost forms on a freezing window.'],
    'ice>steam': ['Straight from solid to gas!', 'You heated so fast you skipped being a liquid. That’s called sublimation. Dry ice does it at room temperature.']
  };
  function handleEvents() {
    const w = state.world;
    for (const e of w.events) {
      if (e.type === 'form') {
        puff(e.x, e.y, e.to === 'steam' ? 'rgba(235,240,250,0.8)' : e.to === 'ice' ? '#bfe8ff' : '#3d8bff', 14);
        const k = e.from + '>' + e.to;
        if (!A.demo.active && FORM_FACTS[k] && !state.seen.has(k)) {
          state.seen.add(k);
          A.facts.show({ kicker: 'Change of state', title: FORM_FACTS[k][0], sub: FORM_FACTS[k][1], facts: window.SCIENCE_FACTS.matter });
        }
      } else if (e.type === 'smash') { puff(e.x, e.y, '#9cc9e8', 22, 0.3); toast('Smash! Fast ice is hard enough to break the block.'); }
      else if (e.type === 'died') { puff(e.x + 14, e.y + 14, '#3d8bff', 16, 0.25); toast(e.why === 'pool' ? 'Splash! Liquid water mixes into the pool. Ice would float.' : 'Fell off! Back to the checkpoint.'); }
      else if (e.type === 'pickup') { puff(e.x, e.y, e.what === 'h' ? '#ff7a3d' : '#9fe0ff', 12); toast(e.what === 'h' ? 'Got a heat pack. Press H to use it.' : 'Got a cold pack. Press C to use it.'); }
      else if (e.type === 'checkpoint') toast('Checkpoint!');
      else if (e.type === 'pack') puff(w.p.x + 14, w.p.y + 10, e.kind === 'heat' ? '#ff7a3d' : '#9fe0ff', 14);
      else if (e.type === 'nopack') outOfPacks(e.kind);
      else if (e.type === 'won') levelDone();
    }
    w.events.length = 0;
    renderHud();
  }

  // ---------- HUD ----------
  const fmtMs = (ms) => (ms / 1000).toFixed(1) + 's';
  const fmt = (frames) => fmtMs(frames * 1000 / 60);
  // The run clock is real time (minus time spent on quiz and facts cards), so standing still
  // doesn't stop it even though the page stops drawing.
  function runMs() {
    if (!state.runStart) return 0;
    if (state.world && state.world.won) return state.finalMs;
    const now = state.pausedAt || performance.now();
    return now - state.runStart - state.pausedTotal;
  }
  let lastThermo = '';
  function updateThermo() {
    const w = state.world; if (!w) return;
    const T = w.p.T, f = FORMS[w.p.form];
    const key = Math.round(T) + w.p.form;
    if (key === lastThermo) return;
    lastThermo = key;
    $('thermo-fill').style.width = ((T - MIN_T) / (MAX_T - MIN_T) * 100) + '%';
    $('thermo-fill').dataset.form = w.p.form;
    $('thermo-text').textContent = f.name + ' (' + f.state + ') · ' + Math.round(T) + '°C';
    $('time').textContent = fmtMs(runMs());
  }
  setInterval(() => { if (state.world && !state.world.won && !A.modalOpen()) $('time').textContent = fmtMs(runMs()); }, 500);
  function renderHud() {
    const w = state.world;
    if (!w) return;
    $('heat-btn').textContent = 'Heat pack (H) × ' + w.packs.heat;
    $('cold-btn').textContent = 'Cold pack (C) × ' + w.packs.cold;
    $('heat-btn').disabled = $('cold-btn').disabled = A.demo.active || w.won || A.modalOpen();
    $('deaths').textContent = w.deaths;
    $('level-name').textContent = (state.level + 1) + '. ' + LEVELS[state.level].name + (state.mirrored ? ' (mirrored)' : '');
    $('par').textContent = LEVELS[state.level].par + 's';
    $('stars-total').textContent = state.stars;
    $('level-select').value = String(state.level);
    $('mirror-check').checked = state.mirrored;
    $('stage-label').textContent = (A.demo.active ? 'Demo · ' : '') + 'Level ' + (state.level + 1) + (state.mirrored ? ' mirrored' : '');
    $('practice-btn').disabled = !(A.demo.active || w.won) || A.modalOpen();
    const best = A.store.get('phase-best-' + state.level + (state.mirrored ? 'm' : ''), null);
    $('best').textContent = best ? fmtMs(best) : '–';
    lastThermo = '';
    updateThermo();
    wake();
  }
  A.onModal(() => {
    // pause the run clock while a card is open
    if (A.modalOpen() && !state.pausedAt) state.pausedAt = performance.now();
    else if (!A.modalOpen() && state.pausedAt) { state.pausedTotal += performance.now() - state.pausedAt; state.pausedAt = 0; }
    state.last = 0; renderHud();
  });

  // ---------- levels ----------
  function loadLevel(i, mirrored) {
    state.level = A.clamp(i, 0, LEVELS.length - 1);
    state.mirrored = !!mirrored;
    state.world = makeWorld(state.level, state.mirrored);
    state.quizzed = false; state.hacked = false; state.particles = []; state.botMem = {};
    state.acc = 0; state.last = 0;
    state.runStart = performance.now(); state.pausedTotal = 0; state.pausedAt = A.modalOpen() ? performance.now() : 0; state.finalMs = 0;
    $('banner').hidden = true;
    if (!A.demo.active) { try { history.replaceState(null, '', '#LEVEL-' + (state.level + 1) + (state.mirrored ? '-MIRROR' : '')); } catch (e) { /* ignore */ } }
    renderHud();
  }
  function starsFor(w) {
    const par = LEVELS[state.level].par * 1000, t = state.finalMs;
    if (w.deaths === 0 && t <= par) return 3;
    if (w.deaths <= 1 && t <= par * 1.6) return 2;
    return 1;
  }
  function levelDone() {
    const w = state.world;
    // demo bots run on game time; real players on the clock
    state.finalMs = A.demo.active ? w.frame * 1000 / 60 : performance.now() - state.runStart - state.pausedTotal;
    const s = starsFor(w);
    puff(w.p.x + 14, w.p.y + 10, '#7ee0a1', 30);
    const chips = [];
    if (!A.demo.active) {
      state.stars += s;
      const k = 'phase-best-' + state.level + (state.mirrored ? 'm' : '');
      const best = A.store.get(k, null);
      if (!best || state.finalMs < best) { A.store.set(k, state.finalMs); if (best) chips.push('New best time'); }
      if (s === 3) badges.award('Three stars');
      if (w.deaths === 0) chips.push('No splashes');
      if (state.hacked) { chips.push('Hacked physics'); badges.award('Phase hacker'); }
      if (state.level === LEVELS.length - 1) badges.award('Grand tour');
    }
    $('banner-title').textContent = '★'.repeat(s) + '☆'.repeat(3 - s);
    $('banner-text').textContent = LEVELS[state.level].name + ' in ' + fmtMs(state.finalMs) + ' (par ' + LEVELS[state.level].par + 's), ' + w.deaths + (w.deaths === 1 ? ' restart.' : ' restarts.');
    const bc = $('banner-chips'); bc.innerHTML = '';
    chips.forEach((c) => { const sp = document.createElement('span'); sp.className = 'chip gold'; sp.textContent = c; bc.appendChild(sp); });
    $('next-btn').textContent = state.level < LEVELS.length - 1 ? 'Next level' : 'Back to level 1';
    $('banner').hidden = false;
    $('next-btn').focus({ preventScroll: true });
    renderHud();
    if (A.demo.active) scheduleDemo();
  }
  function nextLevel() { loadLevel(state.level < LEVELS.length - 1 ? state.level + 1 : 0, state.mirrored); }

  // ---------- questions ----------
  const TOPICS = ['Matter', 'Heat'];
  function outOfPacks(kind) {
    if (A.demo.active || A.modalOpen()) return;
    if (state.quizzed) { toast('No ' + kind + ' packs left. Look for pads, hot air, cold air, or restart the level.'); return; }
    A.quiz.open({
      game: 'phase-runner', player: 'player', color: kind === 'heat' ? '#ff7a3d' : '#9fe0ff', count: 4, topics: TOPICS,
      title: 'Out of ' + kind + ' packs',
      intro: 'Answer 4 science questions. Every right answer earns one ' + kind + ' pack (once per level).',
      lastLabel: 'See your packs',
      resultScore: (n) => '+' + n,
      resultText: (n) => (n === 0 ? 'No packs this time.' : n + ' ' + kind + (n === 1 ? ' pack.' : ' packs.')),
      doneLabel: () => 'Back to the level',
      onClose: (n) => { state.quizzed = true; state.world.packs[kind] += n; if (n === 4) badges.award('Science ace'); renderHud(); }
    });
  }

  // ---------- demo ----------
  let demoTimer = null, demoIdx = 0;
  function startDemo() {
    A.demo.start({ stage, text: 'Demo · click anywhere or press any key to play', onExit: () => { stopDemo(); loadFromHash(); } });
    demoIdx = 0;
    demoLevel();
  }
  function demoLevel() {
    const i = DEMO_LEVELS[demoIdx % DEMO_LEVELS.length];
    loadLevel(i, false);
    state.bot = BOTS[i];
  }
  function stopDemo() { A.demo.stop(); clearTimeout(demoTimer); state.bot = null; A.quiz.close(); badges.clear(); }
  function scheduleDemo() {
    clearTimeout(demoTimer);
    demoTimer = setTimeout(() => {
      if (!A.demo.active) return;
      if (A.modalOpen()) { scheduleDemo(); return; }
      demoIdx++; demoLevel();
    }, 2200);
  }
  function loadFromHash() {
    const m = /^LEVEL-(\d+)(-MIRROR)?$/.exec(cleanCode(location.hash.slice(1)));
    loadLevel(m ? +m[1] - 1 : 0, m && !!m[2]);
    if (!state.seen.has('intro')) {
      state.seen.add('intro');
      A.facts.show({ kicker: 'Phase Runner', title: 'You are a blob of water', sub: 'Heat up past 100°C and you boil into steam. Cool down to 0°C and you freeze into ice. Each state can do things the others can’t.', facts: window.SCIENCE_FACTS.matter });
    }
  }
  // Daily challenge: one level, sometimes mirrored, picked by the date.
  function daily() {
    const rng = A.rngFor('phase|' + A.todayKey());
    if (A.demo.active) stopDemo();
    loadLevel(Math.floor(rng() * LEVELS.length), rng() < 0.5);
    toast('Daily level for ' + A.todayKey() + '. Beat par!');
  }

  // ---------- input ----------
  const KEYMAP = { ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right', ArrowUp: 'jump', w: 'jump', W: 'jump', ' ': 'jump' };
  window.addEventListener('keydown', (e) => {
    if (A.modalOpen()) return;
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'SELECT') return;
    if (state.world && state.world.won && (e.key === 'Enter' || e.key === ' ')) { if (tag !== 'BUTTON') { nextLevel(); e.preventDefault(); } return; }
    if (KEYMAP[e.key]) { state.keys[KEYMAP[e.key]] = true; e.preventDefault(); wake(); }
    else if (e.key === 'h' || e.key === 'H') { state.pending.heat = true; wake(); }
    else if (e.key === 'c' || e.key === 'C') { state.pending.cold = true; wake(); }
    else if (e.key === 'r' || e.key === 'R') { loadLevel(state.level, state.mirrored); }
  });
  window.addEventListener('keyup', (e) => { if (KEYMAP[e.key]) state.keys[KEYMAP[e.key]] = false; });
  window.addEventListener('blur', () => { state.keys.left = state.keys.right = state.keys.jump = false; });
  // on-screen buttons for touchscreens
  document.querySelectorAll('[data-key]').forEach((b) => {
    const k = b.dataset.key;
    const set = (v) => (e) => { e.preventDefault(); state.keys[k] = v; wake(); };
    b.addEventListener('pointerdown', set(true));
    b.addEventListener('pointerup', set(false));
    b.addEventListener('pointerleave', set(false));
    b.addEventListener('pointercancel', set(false));
  });
  $('heat-btn').addEventListener('click', () => { state.pending.heat = true; wake(); });
  $('cold-btn').addEventListener('click', () => { state.pending.cold = true; wake(); });
  $('restart-btn').addEventListener('click', () => loadLevel(state.level, state.mirrored));
  $('next-btn').addEventListener('click', nextLevel);
  $('level-select').addEventListener('change', (e) => loadLevel(+e.target.value, state.mirrored));
  $('mirror-check').addEventListener('change', (e) => loadLevel(state.level, e.target.checked));
  $('daily-btn').addEventListener('click', daily);
  $('practice-btn').addEventListener('click', () => { if ((A.demo.active || (state.world && state.world.won)) && !A.modalOpen()) A.quiz.practice({ game: 'phase-runner', topics: TOPICS }); });
  const badges = A.makeBadges($('badges'));
  LEVELS.forEach((lv, i) => { const o = document.createElement('option'); o.value = String(i); o.textContent = (i + 1) + '. ' + lv.name; $('level-select').appendChild(o); });

  // ---------- boot ----------
  resize();
  startDemo();
  A.hacker('Phase Runner', game, {
    temperature: 'your temperature in °C (try setting it!)',
    form: 'your state: solid, liquid or gas',
    packs: 'heat and cold packs you hold',
    gravity: 'gravity multiplier (1 is normal)',
    level: 'which level you are on',
    answers: 'every quiz answer so far'
  }, ['game.temperature = 150   (instant steam!)', 'game.gravity = 0.3']);
})();
