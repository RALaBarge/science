// Laser Bounce: place mirrors to steer a laser into every target.
// Science: light travels in straight lines, mirrors reflect at equal angles, transparent / translucent /
// opaque materials, colored filters, beam splitters.
(function () {
  'use strict';
  const A = window.Arcade;
  const { $, rngFor, randomCode, cleanCode, runSliced, toast } = A;
  const dailyCode = () => A.dailyCode('laser');

  // ---------- board ----------
  const COLS = 12, ROWS = 8, CELL = 80, W = COLS * CELL, H = ROWS * CELL, N = COLS * ROWS;
  const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]]; // right, down, left, up
  // '/' turns right↔up and down↔left; '\' turns right↔down and left↔up
  const SLASH = [3, 2, 1, 0], BACK = [1, 0, 3, 2];
  const EMPTY = 0, WOOD = 1, GLASS = 2, FROST = 3, FILTER_R = 4, FILTER_B = 5, SPLIT_SLASH = 6, SPLIT_BACK = 7,
    FIX_SLASH = 8, FIX_BACK = 9, TARGET = 10, EMITTER = 11;
  const MIRROR_SLASH = 1, MIRROR_BACK = 2; // player mirrors
  const COLOR_INDEX = { w: 0, r: 1, b: 2 };
  const BEAM_RGB = { w: '255,244,214', r: '255,90,90', b: '90,160,255' };
  const NEED = 0.5; // a target lights only if the beam reaching it is at least half strength

  // What each material does, shown in the legend and the facts cards.
  const MATERIALS = {
    [WOOD]: { key: 'wood', name: 'Wood', kind: 'Opaque', text: 'blocks light completely' },
    [GLASS]: { key: 'glass', name: 'Clear glass', kind: 'Transparent', text: 'lets light straight through' },
    [FROST]: { key: 'frost', name: 'Frosted glass', kind: 'Translucent', text: 'lets light through at half strength' },
    [FILTER_R]: { key: 'filter', name: 'Red filter', kind: 'Filter', text: 'only red light gets through' },
    [FILTER_B]: { key: 'filter', name: 'Blue filter', kind: 'Filter', text: 'only blue light gets through' },
    [SPLIT_SLASH]: { key: 'split', name: 'Beam splitter', kind: 'Half mirror', text: 'reflects half, lets half through' },
    [SPLIT_BACK]: { key: 'split', name: 'Beam splitter', kind: 'Half mirror', text: 'reflects half, lets half through' },
    [FIX_SLASH]: { key: 'fixed', name: 'Bolted mirror', kind: 'Mirror', text: 'reflects light; can’t be moved' },
    [FIX_BACK]: { key: 'fixed', name: 'Bolted mirror', kind: 'Mirror', text: 'reflects light; can’t be moved' }
  };

  const cx = (c) => (c % COLS) * CELL + CELL / 2;
  const cy = (c) => ((c / COLS) | 0) * CELL + CELL / 2;
  function step(c, d) {
    const x = (c % COLS) + DIRS[d][0], y = ((c / COLS) | 0) + DIRS[d][1];
    return x < 0 || y < 0 || x >= COLS || y >= ROWS ? -1 : y * COLS + x;
  }

  // ---------- beam tracing ----------
  // Follows every beam from every emitter, cell by cell. Returns the drawn segments, which targets
  // are lit, why unlit targets failed, and the empty cells the beams cross (where a mirror could matter).
  function trace(lv, mirrors) {
    const segs = [], path = [], onPath = new Uint8Array(N), seen = new Set();
    const lit = lv.targets.map(() => false), why = lv.targets.map(() => '');
    const queue = lv.emitters.map((e) => ({ c: e.c, d: e.d, col: 'w', inten: 1, x: cx(e.c), y: cy(e.c) }));
    let guard = 0;
    const seg = (x1, y1, x2, y2, col, inten) => segs.push({ x1, y1, x2, y2, col, inten });
    while (queue.length && guard++ < 300) {
      const b = queue.pop();
      let c = b.c, d = b.d, col = b.col, inten = b.inten, sx = b.x, sy = b.y;
      for (;;) {
        const n = step(c, d);
        if (n < 0) { seg(sx, sy, cx(c) + DIRS[d][0] * CELL / 2, cy(c) + DIRS[d][1] * CELL / 2, col, inten); break; }
        const dim = inten === 1 ? 0 : inten === 0.5 ? 1 : inten === 0.25 ? 2 : 3;
        const key = ((n * 4 + d) * 3 + COLOR_INDEX[col]) * 4 + dim;
        if (seen.has(key)) { seg(sx, sy, cx(n), cy(n), col, inten); break; } // a loop of mirrors
        seen.add(key);
        c = n;
        const t = lv.cells[c];
        const turnHere = () => { seg(sx, sy, cx(c), cy(c), col, inten); sx = cx(c); sy = cy(c); };
        const stopAtEdge = () => seg(sx, sy, cx(c) - DIRS[d][0] * CELL / 2, cy(c) - DIRS[d][1] * CELL / 2, col, inten);
        if (t === EMPTY) {
          if (!onPath[c]) { onPath[c] = 1; path.push(c); }
          const m = mirrors.get(c);
          if (m) { turnHere(); d = m === MIRROR_SLASH ? SLASH[d] : BACK[d]; }
          continue;
        }
        if (t === GLASS) continue;
        if (t === WOOD || t === EMITTER) { stopAtEdge(); break; }
        if (t === FROST) { turnHere(); inten *= 0.5; continue; }
        if (t === FILTER_R || t === FILTER_B) {
          const fc = t === FILTER_R ? 'r' : 'b';
          if (col !== 'w' && col !== fc) { stopAtEdge(); break; }
          turnHere(); col = fc; continue;
        }
        if (t === FIX_SLASH || t === FIX_BACK) { turnHere(); d = t === FIX_SLASH ? SLASH[d] : BACK[d]; continue; }
        if (t === SPLIT_SLASH || t === SPLIT_BACK) {
          turnHere(); inten *= 0.5;
          queue.push({ c, d: t === SPLIT_SLASH ? SLASH[d] : BACK[d], col, inten, x: sx, y: sy });
          continue;
        }
        if (t === TARGET) {
          seg(sx, sy, cx(c), cy(c), col, inten);
          const ti = lv.targetAt[c], tg = lv.targets[ti];
          if (inten < NEED) why[ti] = why[ti] || 'too dim';
          else if (tg.color !== 'w' && tg.color !== col) why[ti] = why[ti] || 'wrong color';
          else lit[ti] = true;
          break;
        }
      }
    }
    return { segs, lit, why, path, solved: lit.every(Boolean) };
  }

  // ---------- solver ----------
  // A mirror only matters if a beam reaches it, and the first mirror a beam meets must sit on the path
  // the beam takes without it. So: trace, try each orientation on each empty cell along the current
  // beams, repeat. Iterative deepening means the first solution found uses the fewest mirrors: par.
  function* solveGen(lv, maxDepth, nodeLimit) {
    const mirrors = new Map();
    let nodes = 0;
    function* dfs(left) {
      if (++nodes > nodeLimit) return 'abort';
      if (nodes % 30 === 0) yield;
      const tr = trace(lv, mirrors);
      if (tr.solved) return true;
      if (!left) return false;
      for (const c of tr.path) {
        if (mirrors.has(c)) continue;
        for (const m of [MIRROR_SLASH, MIRROR_BACK]) {
          mirrors.set(c, m);
          const r = yield* dfs(left - 1);
          if (r) return r;
          mirrors.delete(c);
        }
      }
      return false;
    }
    for (let depth = 0; depth <= maxDepth; depth++) {
      const r = yield* dfs(depth);
      if (r === 'abort') return null;
      if (r) return { par: depth, solution: Array.from(mirrors) };
    }
    return null;
  }

  // ---------- level generation ----------
  // Walk a beam from an emitter, turning at spots where the player will need a mirror, and end at a
  // target. Put a few materials on the walk (glass, one frosted pane, a matching color filter), then
  // fill the rest of the board with decoys. The solver confirms it's solvable and sets par.
  function walkPath(rng, cells, used, turns, side) {
    const along = side % 2 === 0 ? ROWS : COLS;
    const pos = 1 + Math.floor(rng() * (along - 2));
    const start = side === 0 ? pos * COLS : side === 1 ? pos : side === 2 ? pos * COLS + COLS - 1 : (ROWS - 1) * COLS + pos;
    if (used.has(start)) return null;
    let c = start, d = [0, 1, 2, 3][side];
    const cellsOnPath = [start], straight = [], solution = [];
    for (let t = 0; t <= turns; t++) {
      const run = 1 + Math.floor(rng() * 4);
      for (let k = 0; k < run; k++) {
        const n = step(c, d);
        if (n < 0 || used.has(n) || cellsOnPath.includes(n)) return null;
        c = n; cellsOnPath.push(c);
        if (k < run - 1) straight.push(c);
      }
      if (t < turns) {
        const nd = (d + (rng() < 0.5 ? 1 : 3)) % 4;
        solution.push([c, SLASH[d] === nd ? MIRROR_SLASH : MIRROR_BACK]);
        d = nd;
      }
    }
    return { emitter: { c: start, d: [0, 1, 2, 3][side] }, target: c, cellsOnPath, straight, solution };
  }

  function buildLevel(rng, level) {
    const cells = new Int8Array(N);
    const used = new Set();
    const turns = Math.min(4, 1 + (level >> 1));
    const paths = [];
    const twoBeams = level >= 5 && rng() < 0.5;
    const first = walkPath(rng, cells, used, twoBeams ? Math.max(1, turns - 1) : turns, Math.floor(rng() * 4));
    if (!first) return null;
    paths.push(first);
    first.cellsOnPath.forEach((c) => used.add(c));
    if (twoBeams) {
      const second = walkPath(rng, cells, used, Math.max(1, turns - 2), Math.floor(rng() * 4));
      if (!second) return null;
      paths.push(second);
      second.cellsOnPath.forEach((c) => used.add(c));
    }
    const emitters = [], targets = [], targetAt = {};
    for (const p of paths) {
      cells[p.emitter.c] = EMITTER;
      emitters.push(p.emitter);
      cells[p.target] = TARGET;
      let color = 'w';
      const free = A.shuffled(p.straight, rng);
      if (level >= 3 && free.length && rng() < 0.55) { color = rng() < 0.5 ? 'r' : 'b'; cells[free.pop()] = color === 'r' ? FILTER_R : FILTER_B; }
      if (level >= 2 && free.length && rng() < 0.5) cells[free.pop()] = FROST;
      if (free.length && rng() < 0.5) cells[free.pop()] = GLASS;
      targetAt[p.target] = targets.length;
      targets.push({ c: p.target, color });
    }
    // decoys everywhere else
    const pWood = Math.min(0.3, 0.14 + 0.025 * level);
    for (let c = 0; c < N; c++) {
      if (used.has(c) || cells[c] !== EMPTY) continue;
      const r = rng();
      let acc = pWood;
      if (r < acc) { cells[c] = WOOD; continue; }
      if (r < (acc += 0.04)) { cells[c] = GLASS; continue; }
      if (level >= 2 && r < (acc += 0.04)) { cells[c] = FROST; continue; }
      if (level >= 3 && r < (acc += 0.03)) { cells[c] = rng() < 0.5 ? FILTER_R : FILTER_B; continue; }
      if (level >= 2 && r < (acc += 0.03)) { cells[c] = rng() < 0.5 ? FIX_SLASH : FIX_BACK; continue; }
      if (level >= 4 && r < (acc += 0.025)) { cells[c] = rng() < 0.5 ? SPLIT_SLASH : SPLIT_BACK; continue; }
    }
    return { cells, emitters, targets, targetAt, walkMirrors: paths.reduce((n, p) => n + p.solution.length, 0), turns };
  }

  function* genLevelGen(key, level) {
    for (let attempt = 0; attempt < 80; attempt++) {
      const rng = rngFor(key + '|' + attempt);
      const lv = buildLevel(rng, level);
      if (!lv) continue;
      const res = yield* solveGen(lv, lv.walkMirrors, 60000);
      if (!res) continue;
      if (res.par < Math.max(1, lv.walkMirrors - 1)) continue; // a shortcut makes it too easy
      lv.par = res.par;
      lv.solution = res.solution;
      lv.budget = res.par + 1;
      return lv;
    }
    return null;
  }

  // ---------- state ----------
  const state = {
    code: '',
    level: 1,
    lv: null,
    mirrors: new Map(),
    tr: null,
    moves: 0,
    bonus: 0,
    quizzed: false,   // took the "more mirrors" quiz this level
    hint: null,       // [cell, mirror] shown as a hint
    hintUsed: false,
    hintLocked: false,
    solved: false,
    startedAt: 0,
    elapsed: 0,
    stars: 0,
    starsByLevel: [],
    hover: -1,
    cursor: -1,
    budgetHacked: false,
    seenMaterials: new Set()
  };
  if (/[?&]test\b/.test(location.search)) { window.__s = state; window.__lb = { trace, genLevel: (k, l) => A.runNow(genLevelGen(k, l)) }; }

  const game = {
    get level() { return state.level; },
    get budget() { return state.lv ? state.lv.budget + state.bonus : 0; },
    set budget(v) { if (state.lv) { state.lv.budget = Math.max(0, (v | 0) - state.bonus); state.budgetHacked = true; renderHud(); } },
    get par() { return state.lv ? state.lv.par : 0; },
    get grid() {
      if (!state.lv) return [];
      const name = (t, c) => t === EMPTY ? (state.mirrors.get(c) === 1 ? '/' : state.mirrors.get(c) === 2 ? '\\' : '.') : ['.', 'wood', 'glass', 'frost', 'redF', 'blueF', 'split/', 'split\\', 'fix/', 'fix\\', 'target', 'laser'][t];
      const rows = [];
      for (let y = 0; y < ROWS; y++) { const r = []; for (let x = 0; x < COLS; x++) { const c = y * COLS + x; r.push(name(state.lv.cells[c], c)); } rows.push(r.join(' ')); }
      return rows;
    },
    get code() { return state.code; },
    get answers() { return A.answers; }
  };

  // ---------- DOM and drawing ----------
  const cv = $('cv'), ctx = cv.getContext('2d');
  const bg = document.createElement('canvas'), bgCtx = bg.getContext('2d', { alpha: false });
  const stage = $('stage');
  let fit = { k: 1 }, bgKey = '';
  const loop = A.loop(frame, () => false);
  const wake = loop.wake;
  function resize() { fit = A.fitCanvas(cv, W, H); bgKey = ''; wake(); }
  window.addEventListener('resize', resize);

  function drawCellArt(g, t, c) {
    const x = (c % COLS) * CELL, y = ((c / COLS) | 0) * CELL, m = 8;
    g.save();
    if (t === WOOD) {
      g.fillStyle = '#6b4a2f'; g.fillRect(x + m, y + m, CELL - 2 * m, CELL - 2 * m);
      g.strokeStyle = 'rgba(40,24,12,0.6)'; g.lineWidth = 2;
      for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(x + m, y + m + k * 16); g.bezierCurveTo(x + 30, y + m + k * 16 - 5, x + 50, y + m + k * 16 + 5, x + CELL - m, y + m + k * 16); g.stroke(); }
    } else if (t === GLASS) {
      g.fillStyle = 'rgba(160,220,255,0.12)'; g.fillRect(x + m, y + m, CELL - 2 * m, CELL - 2 * m);
      g.strokeStyle = 'rgba(160,220,255,0.7)'; g.lineWidth = 2; g.strokeRect(x + m, y + m, CELL - 2 * m, CELL - 2 * m);
      g.strokeStyle = 'rgba(255,255,255,0.6)'; g.beginPath(); g.moveTo(x + 18, y + 30); g.lineTo(x + 30, y + 18); g.moveTo(x + 18, y + 44); g.lineTo(x + 44, y + 18); g.stroke();
    } else if (t === FROST) {
      g.fillStyle = 'rgba(225,235,245,0.45)'; g.fillRect(x + m, y + m, CELL - 2 * m, CELL - 2 * m);
      g.fillStyle = 'rgba(255,255,255,0.5)';
      for (let k = 0; k < 18; k++) { const px = x + m + ((k * 37) % 60), py = y + m + ((k * 23) % 60); g.fillRect(px, py, 2, 2); }
      g.strokeStyle = 'rgba(225,235,245,0.8)'; g.lineWidth = 2; g.strokeRect(x + m, y + m, CELL - 2 * m, CELL - 2 * m);
    } else if (t === FILTER_R || t === FILTER_B) {
      const rgb = t === FILTER_R ? '255,90,90' : '90,160,255';
      g.fillStyle = 'rgba(' + rgb + ',0.35)'; g.fillRect(x + m, y + m, CELL - 2 * m, CELL - 2 * m);
      g.strokeStyle = 'rgba(' + rgb + ',0.9)'; g.lineWidth = 3; g.strokeRect(x + m, y + m, CELL - 2 * m, CELL - 2 * m);
    } else if (t === FIX_SLASH || t === FIX_BACK || t === SPLIT_SLASH || t === SPLIT_BACK) {
      const slash = t === FIX_SLASH || t === SPLIT_SLASH, split = t === SPLIT_SLASH || t === SPLIT_BACK;
      g.strokeStyle = split ? 'rgba(200,220,255,0.85)' : '#c9d3e6'; g.lineWidth = split ? 4 : 7;
      if (split) g.setLineDash([8, 6]);
      g.beginPath();
      if (slash) { g.moveTo(x + 14, y + CELL - 14); g.lineTo(x + CELL - 14, y + 14); } else { g.moveTo(x + 14, y + 14); g.lineTo(x + CELL - 14, y + CELL - 14); }
      g.stroke(); g.setLineDash([]);
      if (!split) { g.fillStyle = '#5a6584'; [[16, 16], [CELL - 16, CELL - 16], [16, CELL - 16], [CELL - 16, 16]].forEach(([a, b]) => { g.beginPath(); g.arc(x + a, y + b, 3, 0, Math.PI * 2); g.fill(); }); }
    } else if (t === EMITTER) {
      const e = state.lv.emitters.find((q) => q.c === c);
      g.fillStyle = '#2b3556'; g.fillRect(x + 12, y + 12, CELL - 24, CELL - 24);
      g.strokeStyle = '#ffd166'; g.lineWidth = 2; g.strokeRect(x + 12, y + 12, CELL - 24, CELL - 24);
      const [dx, dy] = DIRS[e.d];
      g.fillStyle = '#ffd166';
      g.beginPath(); g.moveTo(x + 40 + dx * 22, y + 40 + dy * 22); g.lineTo(x + 40 - dy * 10, y + 40 + dx * 10); g.lineTo(x + 40 + dy * 10, y + 40 - dx * 10); g.closePath(); g.fill();
    }
    g.restore();
  }

  function renderBg() {
    const key = (state.lv ? state.lv.id : 'none') + '|' + cv.width;
    if (key === bgKey) return;
    bgKey = key;
    bg.width = cv.width; bg.height = cv.height;
    const g = bgCtx;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.fillStyle = '#0b1020'; g.fillRect(0, 0, bg.width, bg.height);
    g.setTransform(fit.k, 0, 0, fit.k, 0, 0);
    g.strokeStyle = 'rgba(120,140,190,0.12)'; g.lineWidth = 1;
    for (let x = 0; x <= COLS; x++) { g.beginPath(); g.moveTo(x * CELL, 0); g.lineTo(x * CELL, H); g.stroke(); }
    for (let y = 0; y <= ROWS; y++) { g.beginPath(); g.moveTo(0, y * CELL); g.lineTo(W, y * CELL); g.stroke(); }
    if (!state.lv) return;
    for (let c = 0; c < N; c++) { const t = state.lv.cells[c]; if (t !== EMPTY && t !== TARGET) drawCellArt(g, t, c); }
  }

  function drawMirror(c, m, alpha, color) {
    const x = (c % COLS) * CELL, y = ((c / COLS) | 0) * CELL;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color || '#f2f6ff'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath();
    if (m === MIRROR_SLASH) { ctx.moveTo(x + 12, y + CELL - 12); ctx.lineTo(x + CELL - 12, y + 12); } else { ctx.moveTo(x + 12, y + 12); ctx.lineTo(x + CELL - 12, y + CELL - 12); }
    ctx.stroke();
    ctx.restore();
  }

  function frame() {
    renderBg();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(bg, 0, 0);
    ctx.setTransform(fit.k, 0, 0, fit.k, 0, 0);
    const lv = state.lv;
    if (!lv) return;
    // hover / keyboard cursor
    for (const [c, col] of [[state.hover, 'rgba(255,209,102,0.18)'], [state.cursor, 'rgba(255,209,102,0.35)']]) {
      if (c < 0 || lv.cells[c] !== EMPTY) continue;
      ctx.fillStyle = col; ctx.fillRect((c % COLS) * CELL + 2, ((c / COLS) | 0) * CELL + 2, CELL - 4, CELL - 4);
    }
    if (state.hint) {
      const [c, m] = state.hint;
      ctx.save(); ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 3; ctx.setLineDash([7, 6]);
      ctx.strokeRect((c % COLS) * CELL + 4, ((c / COLS) | 0) * CELL + 4, CELL - 8, CELL - 8); ctx.restore();
      if (state.mirrors.get(c) !== m) drawMirror(c, m, 0.35, '#ffd166');
    }
    state.mirrors.forEach((m, c) => drawMirror(c, m, 1));
    // beams: soft glow under a bright core
    const tr = state.tr;
    if (tr) {
      ctx.lineCap = 'round';
      for (const pass of [0, 1]) {
        for (const s of tr.segs) {
          const a = Math.max(0.2, s.inten);
          ctx.strokeStyle = 'rgba(' + BEAM_RGB[s.col] + ',' + (pass ? a : a * 0.25) + ')';
          ctx.lineWidth = pass ? 3 : 11;
          ctx.beginPath(); ctx.moveTo(s.x1, s.y1); ctx.lineTo(s.x2, s.y2); ctx.stroke();
        }
      }
    }
    // targets on top of the beams
    lv.targets.forEach((t, i) => {
      const x = cx(t.c), y = cy(t.c), on = tr && tr.lit[i];
      const rgb = t.color === 'w' ? '255,209,102' : BEAM_RGB[t.color];
      if (on) { ctx.fillStyle = 'rgba(' + rgb + ',0.35)'; ctx.beginPath(); ctx.arc(x, y, 32, 0, Math.PI * 2); ctx.fill(); }
      ctx.strokeStyle = 'rgb(' + rgb + ')'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fillStyle = on ? 'rgb(' + rgb + ')' : '#1a2140'; ctx.fill(); ctx.stroke();
      if (tr && tr.why[i] && !on) {
        ctx.fillStyle = '#e7e9f3'; ctx.font = '600 12px "IBM Plex Mono", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText(tr.why[i], x, y + 26);
      }
    });
  }

  // ---------- HUD ----------
  const mirrorsLeft = () => (state.lv ? state.lv.budget + state.bonus - state.mirrors.size : 0);
  const fmtTime = (ms) => { const s = Math.floor(ms / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  function starsFor() {
    const used = state.mirrors.size, par = state.lv.par;
    let s = used <= par ? 3 : used === par + 1 ? 2 : 1;
    if (state.hintUsed) s = Math.max(1, s - 1);
    return s;
  }
  function renderHud() {
    const lv = state.lv;
    $('level-num').textContent = state.level;
    $('level-meta').textContent = state.level;
    $('stars-total').textContent = state.stars;
    $('stage-label').textContent = (A.demo.active ? 'Demo' : state.code) + ' · level ' + state.level;
    if (lv) {
      $('stats').innerHTML =
        '<span>Mirrors left <b>' + mirrorsLeft() + ' of ' + (lv.budget + state.bonus) + '</b>' + (state.bonus ? ' (+' + state.bonus + ' bonus)' : '') + '</span>' +
        '<span>Par <b>' + lv.par + (lv.par === 1 ? ' mirror' : ' mirrors') + '</b> for 3 stars</span>' +
        '<span>Moves <b>' + state.moves + '</b> · time <b id="clock">' + fmtTime(state.elapsed) + '</b></span>' +
        '<span>Targets lit <b>' + (state.tr ? state.tr.lit.filter(Boolean).length : 0) + ' of ' + lv.targets.length + '</b></span>';
      renderLegend();
    }
    const busy = !lv || state.solved || A.modalOpen();
    $('turn-label').textContent = !lv ? 'Building a level…' : state.solved ? 'Level solved!' : 'Light every target';
    $('clear-btn').disabled = busy || !state.mirrors.size;
    $('hint-btn').disabled = busy || state.hintUsed || state.hintLocked;
    $('hint-btn').textContent = state.hintLocked ? 'Hint locked until next level' : state.hintUsed ? 'Hint used' : 'Hint (answer 1 question)';
    $('more-btn').disabled = busy || state.quizzed || mirrorsLeft() > 0;
    $('more-btn').textContent = state.quizzed ? 'Bonus mirrors used' : 'More mirrors (answer 4)';
    $('practice-btn').disabled = !(A.demo.active || state.solved) || A.modalOpen();
    wake();
  }
  function renderLegend() {
    const lv = state.lv, seen = new Map();
    for (let c = 0; c < N; c++) { const m = MATERIALS[lv.cells[c]]; if (m && !seen.has(m.name)) seen.set(m.name, m); }
    let html = '<span><b>Mirror</b> (yours): click an empty square to place, click again to turn, a third time to remove</span>';
    seen.forEach((m) => { html += '<span><b>' + m.name + '</b> · ' + m.kind.toLowerCase() + ': ' + m.text + '</span>'; });
    if (lv.targets.some((t) => t.color !== 'w')) html += '<span><b>Colored target</b>: needs light of its color</span>';
    html += '<span><b>Target</b>: needs at least half-strength light</span>';
    $('legend').innerHTML = html;
  }
  A.onModal(renderHud);

  // ---------- levels ----------
  let genToken = 0, clockTimer = null;
  function loadLevel() {
    const token = ++genToken;
    state.lv = null; state.tr = null; state.mirrors = new Map(); state.moves = 0; state.bonus = 0;
    state.quizzed = false; state.hint = null; state.hintUsed = false; state.hintLocked = false; state.solved = false;
    state.elapsed = 0; state.budgetHacked = false;
    $('banner').hidden = true;
    $('busy').hidden = false;
    renderHud();
    const key = state.code + '-L' + state.level;
    runSliced(genLevelGen(key, state.level), (lv) => {
      if (!lv) { toast('Could not build that level. Trying the next code.'); setCode(randomCode()); return; }
      lv.id = token;
      state.lv = lv;
      state.tr = trace(lv, state.mirrors);
      state.startedAt = performance.now();
      $('busy').hidden = true;
      renderHud();
      introduceMaterials();
    }, () => token !== genToken);
  }
  clearInterval(clockTimer);
  clockTimer = setInterval(() => {
    if (!state.lv || state.solved || A.demo.active || A.modalOpen()) return;
    state.elapsed = performance.now() - state.startedAt;
    const el = $('clock'); if (el) el.textContent = fmtTime(state.elapsed);
  }, 1000);

  // The first time a material shows up, a facts card explains it.
  function introduceMaterials() {
    if (A.demo.active) return;
    const lv = state.lv;
    for (let c = 0; c < N; c++) {
      const m = MATERIALS[lv.cells[c]];
      if (!m || state.seenMaterials.has(m.key) || m.key === 'wood') continue;
      state.seenMaterials.add(m.key);
      A.facts.show({ kicker: 'New: ' + m.name, title: m.name + ' is ' + m.kind.toLowerCase(), sub: 'In this game it ' + m.text + '.', facts: (window.SCIENCE_FACTS && window.SCIENCE_FACTS.light) || [] });
      return;
    }
  }

  function setCode(code, keepLevel) {
    if (A.demo.active) stopDemo();
    state.code = cleanCode(code) || randomCode();
    $('seed-input').value = state.code;
    try { history.replaceState(null, '', '#' + state.code); } catch (e) { /* ignore */ }
    if (!keepLevel) { state.level = 1; state.stars = 0; state.starsByLevel = []; }
    loadLevel();
  }

  function retrace() {
    state.tr = trace(state.lv, state.mirrors);
    if (state.tr.solved && !state.solved) solvedLevel();
    renderHud();
  }

  // Click an empty square: place '/', then '\', then remove.
  function cycleCell(c) {
    if (!state.lv || state.solved || A.modalOpen() || c < 0 || state.lv.cells[c] !== EMPTY) return;
    const cur = state.mirrors.get(c);
    if (!cur) {
      if (mirrorsLeft() <= 0) { toast(state.quizzed ? 'Out of mirrors. Move one you already placed.' : 'Out of mirrors. Answer questions for more, or move one you placed.'); renderHud(); return; }
      state.mirrors.set(c, MIRROR_SLASH);
    } else if (cur === MIRROR_SLASH) state.mirrors.set(c, MIRROR_BACK);
    else state.mirrors.delete(c);
    state.moves++;
    retrace();
  }

  function solvedLevel() {
    state.solved = true;
    state.elapsed = performance.now() - state.startedAt;
    const s = starsFor();
    state.starsByLevel[state.level - 1] = s;
    state.stars += s;
    const chips = [];
    if (state.mirrors.size <= state.lv.par) { chips.push('Par'); }
    if (state.mirrors.size < state.lv.par) { chips.push('Under par!'); badges.award('Beat the solver'); }
    if (state.budgetHacked) { chips.push('Hacked budget'); badges.award('Light hacker'); }
    if (s === 3) badges.award('Three stars');
    $('banner-title').textContent = '★'.repeat(s) + '☆'.repeat(3 - s);
    $('banner-text').textContent = 'Level ' + state.level + ' in ' + state.mirrors.size + (state.mirrors.size === 1 ? ' mirror' : ' mirrors') + ' (par ' + state.lv.par + '), ' + fmtTime(state.elapsed) + ', ' + state.moves + ' moves.' + (state.hintUsed ? ' Hint used, so one star off.' : '');
    const bc = $('banner-chips'); bc.innerHTML = '';
    chips.forEach((c) => { const sp = document.createElement('span'); sp.className = 'chip gold'; sp.textContent = c; bc.appendChild(sp); });
    $('banner').hidden = false;
    $('next-btn').focus({ preventScroll: true });
    if (A.demo.active) scheduleDemoLevel();
  }

  function nextLevel() { state.level++; loadLevel(); }

  // ---------- questions ----------
  const TOPICS = ['Light'];
  function moreMirrors() {
    if (state.quizzed || mirrorsLeft() > 0 || state.solved) return;
    A.quiz.open({
      game: 'laser-bounce', player: 'player', color: '#ffd166', count: 4, topics: TOPICS,
      title: 'Out of mirrors',
      intro: 'Answer 4 science questions. Every right answer earns one more mirror.',
      lastLabel: 'See your bonus',
      resultScore: (n) => '+' + n,
      resultText: (n) => (n === 0 ? 'No bonus mirrors this time.' : n + (n === 1 ? ' bonus mirror.' : ' bonus mirrors.')),
      doneLabel: () => 'Back to the puzzle',
      onClose: (n) => { state.quizzed = true; state.bonus += n; if (n === 4) badges.award('Science ace'); renderHud(); }
    });
  }
  function askHint() {
    if (state.hintUsed || state.hintLocked || state.solved) return;
    A.quiz.open({
      game: 'laser-bounce', player: 'player', color: '#ffd166', count: 1, topics: TOPICS,
      title: 'Unlock a hint',
      intro: 'Answer right to see where one mirror goes (costs one star). Miss, and hints lock until the next level.',
      singleLabel: (right) => (right ? 'Show the hint' : 'Back to the puzzle'),
      onClose: (n) => {
        if (n) {
          state.hintUsed = true;
          state.hint = state.lv.solution.find(([c, m]) => state.mirrors.get(c) !== m) || state.lv.solution[0];
        } else state.hintLocked = true;
        renderHud();
      }
    });
  }

  // ---------- demo: the solver plays ----------
  let demoTimer = null;
  function startDemo() {
    A.demo.start({ stage, text: 'Demo · click anywhere or press any key to play', onExit: () => { stopDemo(); setCode(cleanCode(location.hash.slice(1)) || dailyCode()); } });
    state.code = 'DEMO-' + randomCode();
    state.level = 1 + Math.floor(Math.random() * 3);
    loadLevel();
    demoTick();
  }
  function stopDemo() {
    A.demo.stop();
    clearTimeout(demoTimer);
    A.quiz.close();
    badges.clear();
  }
  function demoTick() {
    clearTimeout(demoTimer);
    if (!A.demo.active) return;
    if (!state.lv || state.solved || A.modalOpen()) { demoTimer = setTimeout(demoTick, 300); return; }
    const next = state.lv.solution.find(([c, m]) => state.mirrors.get(c) !== m);
    if (!next) return;
    const [c, m] = next;
    state.hover = c;
    cycleCell(c);
    if (m === MIRROR_BACK && state.mirrors.get(c) !== m) { demoTimer = setTimeout(() => { if (A.demo.active) { cycleCell(c); demoTimer = setTimeout(demoTick, 900); } }, 450); return; }
    demoTimer = setTimeout(demoTick, 900);
  }
  function scheduleDemoLevel() {
    clearTimeout(demoTimer);
    demoTimer = setTimeout(() => {
      if (!A.demo.active) return;
      if (A.modalOpen()) { scheduleDemoLevel(); return; }
      state.level = state.level >= 6 ? 1 : state.level + 1;
      loadLevel(); demoTick();
    }, 2400);
  }

  // ---------- input ----------
  const cellAt = (e) => { const p = A.toLogical(cv, e, W, H); const x = Math.floor(p.x / CELL), y = Math.floor(p.y / CELL); return x >= 0 && y >= 0 && x < COLS && y < ROWS ? y * COLS + x : -1; };
  cv.addEventListener('pointerdown', (e) => { state.cursor = -1; cycleCell(cellAt(e)); });
  cv.addEventListener('pointermove', (e) => { const c = cellAt(e); if (c !== state.hover) { state.hover = c; wake(); } });
  cv.addEventListener('pointerleave', () => { state.hover = -1; wake(); });
  window.addEventListener('keydown', (e) => {
    if (A.modalOpen()) return;
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'SELECT') return;
    if (state.solved && (e.key === 'Enter' || e.key === ' ')) { if (tag !== 'BUTTON') { nextLevel(); e.preventDefault(); } return; }
    const moves = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: COLS, ArrowUp: -COLS };
    if (moves[e.key] !== undefined) {
      if (state.cursor < 0) state.cursor = Math.floor(ROWS / 2) * COLS + Math.floor(COLS / 2);
      const n = state.cursor + moves[e.key];
      if (n >= 0 && n < N && !(Math.abs(moves[e.key]) === 1 && Math.floor(n / COLS) !== Math.floor(state.cursor / COLS))) state.cursor = n;
      wake(); e.preventDefault();
    } else if ((e.key === ' ' || e.key === 'Enter') && state.cursor >= 0 && tag !== 'BUTTON') { cycleCell(state.cursor); e.preventDefault(); }
  });
  $('clear-btn').addEventListener('click', () => { if (!state.solved) { state.mirrors.clear(); state.moves++; retrace(); } });
  $('hint-btn').addEventListener('click', askHint);
  $('more-btn').addEventListener('click', moreMirrors);
  $('next-btn').addEventListener('click', nextLevel);
  $('load-btn').addEventListener('click', () => setCode($('seed-input').value));
  $('seed-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') setCode($('seed-input').value); });
  $('new-btn').addEventListener('click', () => setCode(randomCode()));
  $('daily-btn').addEventListener('click', () => { setCode(dailyCode()); toast('Daily puzzle for ' + A.todayKey()); });
  $('practice-btn').addEventListener('click', () => { if ((A.demo.active || state.solved) && !A.modalOpen()) A.quiz.practice({ game: 'laser-bounce', topics: TOPICS }); });
  const badges = A.makeBadges($('badges'));

  // ---------- boot ----------
  resize();
  $('seed-input').value = cleanCode(location.hash.slice(1)) || dailyCode();
  startDemo();
  A.hacker('Laser Bounce', game, {
    level: 'which level you are on',
    budget: 'how many mirrors you may place (try changing it!)',
    par: 'fewest mirrors the solver needed',
    grid: 'the board, row by row: / and \\ are your mirrors',
    code: 'the puzzle code',
    answers: 'every quiz answer so far'
  }, ['game.grid', 'game.budget = 10   (more mirrors... but the game notices)']);
})();
