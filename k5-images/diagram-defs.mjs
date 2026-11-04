// Hand-built labeled diagrams (SVG). All words are real SVG text, colors come from the lesson page's CSS variables.
// Each entry: { id, unit (page basename), after (section id), caption, svg(id) }.
import { wrap, esc } from './graphs.mjs';

const INK = 'var(--ink, #12172B)';
const MUTED = 'var(--muted, #47506E)';
const LINE = 'var(--line, #D0D8E8)';
const S2 = 'var(--surface-2, #E8EDF6)';
const SURF = 'var(--surface, #fff)';
const BEAM = 'var(--beam, #F2A900)';
const BEAMINK = 'var(--beam-ink, #1A1400)';
const BLUE = 'var(--reflect, #2B66E8)';
const ORANGE = 'var(--absorb, #D6450B)';
const TEAL = 'var(--transmit, #0B7F70)';
const ONC = 'var(--on-color, #fff)';
const RED = 'var(--red, #D93036)';
const GREEN = 'var(--green, #25904F)';
const SHADE = 'var(--shade, #222A4A)';

// text; s may be an array of lines
const T = (x, y, s, o = {}) => {
  const lines = Array.isArray(s) ? s : [s];
  return lines.map((ln, i) => `<text x="${x}" y="${y + i * (o.lh || (o.s || 14) * 1.22)}" text-anchor="${o.a || 'middle'}" font-size="${o.s || 14}" font-weight="${o.w || 400}" fill="${o.f || INK}">${esc(ln)}</text>`).join('');
};
const box = (x, y, w, h, fill = S2, stroke = LINE, rx = 8) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`;
// arrow from (x1,y1) to (x2,y2) with a drawn head
function arrow(x1, y1, x2, y2, col, w = 3, head = 11, dash) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const hx = x2 - Math.cos(a) * head * 0.9, hy = y2 - Math.sin(a) * head * 0.9;
  const px = -Math.sin(a) * head * 0.55, py = Math.cos(a) * head * 0.55;
  return `<line x1="${x1}" y1="${y1}" x2="${hx}" y2="${hy}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>` +
    `<polygon points="${x2},${y2} ${hx + px},${hy + py} ${hx - px},${hy - py}" fill="${col}"/>`;
}
const head = (x, y, a, col, size = 11) => {
  const px = -Math.sin(a) * size * 0.55, py = Math.cos(a) * size * 0.55;
  const bx = x - Math.cos(a) * size, by = y - Math.sin(a) * size;
  return `<polygon points="${x},${y} ${bx + px},${by + py} ${bx - px},${by - py}" fill="${col}"/>`;
};
const circle = (x, y, r, fill, stroke = 'none', w = 1.5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"/>`;
const rays = (x, y, r1, r2, n, col, w = 2.5) => Array.from({ length: n }, (_, i) => {
  const a = (i / n) * Math.PI * 2;
  return `<line x1="${x + Math.cos(a) * r1}" y1="${y + Math.sin(a) * r1}" x2="${x + Math.cos(a) * r2}" y2="${y + Math.sin(a) * r2}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
}).join('');
const num = (x, y, n) => circle(x, y, 11, SURF, INK, 1.5) + T(x, y + 5, String(n), { s: 14, w: 700 });

// ---------- 5.3 matter cycles, energy does not ----------
function matterEnergy(id) {
  let s = '';
  s += T(240, 58, 'Matter goes around in a cycle', { s: 15, w: 700 });
  s += box(30, 78, 130, 46) + T(95, 106, 'Plant', { w: 700 });
  s += box(320, 78, 130, 46) + T(385, 106, 'Animal', { w: 700 });
  s += box(320, 176, 130, 46) + T(385, 204, 'Decomposers', { w: 700, s: 13.5 });
  s += box(30, 176, 130, 46) + T(95, 204, 'Soil and air', { w: 700 });
  s += arrow(95, 176, 95, 126, TEAL) + T(104, 148, ['air, water,', 'minerals'], { a: 'start', s: 12.5, f: MUTED });
  s += arrow(160, 101, 318, 101, TEAL) + T(239, 93, 'eaten', { s: 12.5, f: MUTED });
  s += arrow(385, 124, 385, 174, TEAL) + T(393, 154, 'dies, waste', { a: 'start', s: 12.5, f: MUTED });
  s += arrow(320, 199, 162, 199, TEAL) + T(241, 191, 'breaks down', { s: 12.5, f: MUTED });
  s += T(240, 144, ['Matter is reused,', 'not used up'], { s: 14, w: 700, f: TEAL });
  s += `<line x1="20" x2="460" y1="244" y2="244" stroke="${LINE}"/>`;
  s += T(240, 270, 'Energy goes one way and leaves as heat', { s: 15, w: 700 });
  s += box(14, 290, 104, 46, BEAM, 'none') + T(66, 318, 'Sunlight', { w: 700, f: BEAMINK });
  s += box(148, 290, 92, 46) + T(194, 318, 'Plant', { w: 700 });
  s += box(270, 290, 92, 46) + T(316, 318, 'Animal', { w: 700 });
  s += box(392, 290, 74, 46, ORANGE, 'none') + T(429, 318, 'Heat', { w: 700, f: ONC });
  s += arrow(118, 313, 146, 313, BEAM) + arrow(240, 313, 268, 313, BEAM) + arrow(362, 313, 390, 313, BEAM);
  s += arrow(194, 336, 194, 378, ORANGE, 3) + arrow(316, 336, 316, 378, ORANGE, 3);
  s += T(240, 404, 'Some energy leaves as heat at every step.', { s: 14 });
  s += T(240, 424, 'It does not come back around.', { s: 14, w: 700, f: ORANGE });
  return wrap(id, 'Matter cycles. Energy does not.', 'Two diagrams. Top: matter moves in a loop. Soil and air give air, water and minerals to plants, plants are eaten by animals, animals die or make waste for decomposers, and decomposers break it down into soil and air again. Matter is reused, not used up. Bottom: energy moves one way. Sunlight goes to plants, plants to animals, and heat leaves from the plant and the animal at every step. Energy does not come back around.', 440, s);
}

// ---------- 4.3 light into the eye ----------
function eye(id) {
  let s = '';
  s += rays(62, 86, 24, 36, 10, BEAM) + circle(62, 86, 18, BEAM, INK, 2) + T(62, 134, 'Lamp', { w: 700 });
  s += circle(236, 196, 31, RED, INK, 2) + `<path d="M236 166 q4 -16 18 -18 q-2 14 -18 18z" fill="${GREEN}"/>` + T(236, 250, 'Apple', { w: 700 });
  s += `<path d="M366 192 Q410 154 454 192 Q410 230 366 192Z" fill="${SURF}" stroke="${INK}" stroke-width="2"/>` + circle(410, 192, 14, BLUE, INK, 1.5) + circle(410, 192, 6, INK) + T(410, 244, 'Eye', { w: 700 });
  s += arrow(84, 102, 208, 178, BEAM, 4, 13) + num(146, 138, 1);
  s += arrow(268, 198, 362, 193, BLUE, 4, 13) + num(315, 176, 2);
  s += T(24, 282, '1  Light from the lamp hits the apple.', { a: 'start', s: 14.5 });
  s += T(24, 304, '2  Light bounces off the apple and enters the eye.', { a: 'start', s: 14.5 });
  s += T(24, 326, 'Nothing comes out of the eye. We see because light comes in.', { a: 'start', s: 14.5, w: 700, f: BLUE });
  return wrap(id, 'How we see an apple', 'Diagram of a lamp on the left, an apple in the middle and an eye on the right. Arrow 1 goes from the lamp to the apple. Arrow 2 goes from the apple into the eye. No arrow leaves the eye. Light from the lamp bounces off the apple and enters the eye, which is how we see it.', 340, s);
}

// ---------- 1-C day and night ----------
function spin(id) {
  const earth = (cy, dotX, dotY) => {
    const cx = 230, r = 48;
    let s = '';
    s += rays(40, cy, 30, 40, 12, BEAM) + circle(40, cy, 24, BEAM, INK, 2) + T(40, cy + 62, 'Sun', { w: 700 });
    [-30, 0, 30].forEach((dy) => { s += arrow(82, cy + dy, 176 + (Math.abs(dy) ? 14 : 0), cy + dy, BEAM, 3, 10); });
    s += circle(cx, cy, r, BLUE, INK, 2);
    s += `<path d="M${cx} ${cy - r} A${r} ${r} 0 0 1 ${cx} ${cy + r}Z" fill="${SHADE}" opacity=".78"/>`;
    s += `<path d="M${cx - 62 * Math.cos(Math.PI / 6)} ${cy + 62 * 0.5} A62 62 0 0 0 ${cx + 62 * Math.cos(Math.PI / 6)} ${cy + 62 * 0.5}" fill="none" stroke="${MUTED}" stroke-width="2.5" stroke-linecap="round"/>`;
    s += head(cx + 62 * Math.cos(Math.PI / 6), cy + 31, Math.atan2(-0.866, 0.5), MUTED, 10);
    s += circle(dotX, dotY, 6, RED, SURF, 2);
    s += T(cx, cy - 62, 'Earth', { w: 700, s: 13 });
    return s;
  };
  let s = '';
  s += earth(112, 192, 112) + T(300, 100, 'Day', { a: 'start', w: 700, s: 15 }) + T(300, 120, ['Your place (red dot)', 'faces the Sun.'], { a: 'start', s: 13.5 });
  s += `<line x1="20" x2="460" y1="196" y2="196" stroke="${LINE}"/>`;
  s += earth(282, 268, 282) + T(300, 262, 'Night', { a: 'start', w: 700, s: 15 }) + T(300, 282, ['Earth spun, so your place', 'faces away from the Sun.', 'The Sun did not turn off.'], { a: 'start', s: 13.5 });
  s += T(240, 372, 'The gray arrow shows Earth spinning.', { s: 13, f: MUTED });
  return wrap(id, 'Earth spins: day and night', 'Two pictures of the Sun on the left and Earth in the middle. The Sun lights the half of Earth that faces it. Top picture: a red dot for your place is on the lit side, so it is day. After Earth spins half way, the bottom picture shows the red dot on the dark side, so it is night. The Sun did not turn off, your place turned away from it.', 388, s);
}

// ---------- 3.1 balanced and unbalanced forces ----------
function forces(id) {
  let s = '';
  s += T(240, 58, 'Balanced: equal forces, motion stays the same', { s: 14.5, w: 700 });
  s += arrow(200, 108, 130, 108, ORANGE, 5, 14) + T(160, 90, 'friction', { s: 13 }) + T(160, 134, 'backward', { s: 12, f: MUTED });
  s += box(200, 88, 80, 40, S2, INK) + T(240, 113, 'object', { w: 700, s: 13.5 });
  s += arrow(280, 108, 350, 108, BLUE, 5, 14) + T(320, 90, 'push', { s: 13 }) + T(320, 134, 'forward', { s: 12, f: MUTED });
  s += arrow(212, 72, 268, 72, MUTED, 2, 9, '5 4') + T(280, 76, 'steady speed', { a: 'start', s: 12, f: MUTED });
  s += T(240, 168, 'The arrows are the same length, so the speed does not change.', { s: 13, f: MUTED });
  s += `<line x1="20" x2="460" y1="190" y2="190" stroke="${LINE}"/>`;
  s += T(240, 218, 'Unbalanced: unequal forces, motion changes', { s: 14.5, w: 700 });
  s += arrow(200, 270, 160, 270, ORANGE, 5, 14) + T(168, 252, 'friction', { s: 13 });
  s += box(200, 250, 80, 40, S2, INK) + T(240, 275, 'object', { w: 700, s: 13.5 });
  s += arrow(280, 270, 396, 270, BLUE, 5, 14) + T(338, 252, 'bigger push', { s: 13 });
  s += arrow(212, 234, 268, 234, MUTED, 2, 9, '5 4');
  s += T(240, 322, 'The forward arrow is longer, so the object speeds up.', { s: 13, f: MUTED });
  return wrap(id, 'Balanced and unbalanced forces', 'Two pictures of an object with force arrows. Top: a push forward and friction backward are the same length, so the forces are balanced and the object keeps moving at the same steady speed. Bottom: the push forward is longer than the friction arrow, so the forces are unbalanced and the object speeds up.', 338, s);
}

// ---------- 4.2 closed circuit ----------
function loop(id) {
  const panel = (y0, closed) => {
    const L = 50, R = 250, Tp = y0 + 40, B = y0 + 130;
    let s = '';
    s += `<g fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round">` +
      `<path d="M${L} ${y0 + 66} V${Tp} H${135}"/><path d="M165 ${Tp} H${R} V${closed ? B : y0 + 76}"/>` +
      `<path d="M${L} ${y0 + 92} V${B} H${R}"/>` +
      (closed ? '' : `<path d="M${R} ${B} V${y0 + 104}"/>`) +
      `</g>`;
    // battery: long plate (+) on top, short plate below
    s += `<line x1="${L - 18}" x2="${L + 18}" y1="${y0 + 66}" y2="${y0 + 66}" stroke="${INK}" stroke-width="3"/>`;
    s += `<line x1="${L - 10}" x2="${L + 10}" y1="${y0 + 92}" y2="${y0 + 92}" stroke="${INK}" stroke-width="6"/>`;
    s += T(L - 26, y0 + 70, '+', { s: 15, w: 700 }) + T(L + 44, y0 + 84, 'battery', { s: 12.5, a: 'start', f: MUTED });
    // bulb
    if (closed) s += rays(150, Tp, 19, 30, 10, BEAM, 3);
    s += circle(150, Tp, 15, closed ? BEAM : SURF, INK, 2.5);
    s += `<path d="M139 ${Tp + 8} L145 ${Tp - 4} L150 ${Tp + 3} L155 ${Tp - 4} L161 ${Tp + 8}" fill="none" stroke="${INK}" stroke-width="1.8"/>`;
    s += T(150, closed ? Tp - 36 : Tp - 24, 'bulb', { s: 12.5, f: MUTED });
    if (!closed) s += T(R + 10, y0 + 94, 'gap', { a: 'start', s: 13, w: 700, f: ORANGE });
    if (closed) {
      [[88, Tp, 112, Tp], [192, Tp, 216, Tp], [R, y0 + 62, R, y0 + 88], [200, B, 176, B], [124, B, 100, B], [L, y0 + 124, L, y0 + 104], [L, y0 + 58, L, y0 + 50]].forEach(([a, b, c, d]) => { s += arrow(a, b, c, d, ORANGE, 3, 9); });
    }
    return s;
  };
  let s = '';
  s += panel(44, false) + T(292, 108, 'Open loop', { a: 'start', w: 700, s: 15 }) + T(292, 128, ['There is a gap, so', 'the bulb stays off.'], { a: 'start', s: 13.5 });
  s += `<line x1="20" x2="460" y1="206" y2="206" stroke="${LINE}"/>`;
  s += panel(226, true) + T(292, 290, 'Closed loop', { a: 'start', w: 700, s: 15 }) + T(292, 310, ['The loop is complete.', 'Charges move around it', 'together and the bulb glows.'], { a: 'start', s: 13.5 }) + T(292, 366, 'Orange arrows show the direction.', { a: 'start', s: 12, f: MUTED });
  return wrap(id, 'A circuit is a closed loop', 'Two circuits made of a battery, a bulb and wire. Top: the loop has a gap on the right, so the bulb is off. Bottom: the loop is complete, orange arrows show charges moving around the whole loop together, and the bulb glows with rays around it.', 396, s);
}

// ---------- 5.2 shadow length and direction ----------
function shadow(id) {
  const cx = 240, cy = 266, k = 4.5;
  const spokes = [
    ['8:30 am', 34, 180], ['10:00 am', 20, 225], ['12:00 pm', 9, 270], ['2:00 pm', 18, 315], ['3:30 pm', 30, 360],
  ];
  let s = '';
  s += `<line x1="30" x2="450" y1="${cy}" y2="${cy}" stroke="${LINE}" stroke-dasharray="4 4"/><line x1="${cx}" x2="${cx}" y1="92" y2="${cy}" stroke="${LINE}" stroke-dasharray="4 4"/>`;
  s += T(18, cy + 5, 'W', { w: 700, s: 14, a: 'start' }) + T(462, cy + 5, 'E', { w: 700, s: 14, a: 'end' }) + T(cx, 84, 'N', { w: 700, s: 14 });
  spokes.forEach(([lab, cm, deg]) => {
    const a = (deg * Math.PI) / 180;
    const x = cx + Math.cos(a) * cm * k, y = cy + Math.sin(a) * cm * k;
    s += arrow(cx, cy, x, y, SHADE, 4, 10);
    const lx = deg === 225 ? x - 22 : deg === 315 ? x + 22 : x;
    const ly = deg === 270 ? y - 34 : deg === 225 || deg === 315 ? y - 28 : y - 36;
    s += T(lx, ly, [lab, cm + ' cm'], { s: 12.5, w: 700, lh: 14 });
  });
  s += circle(cx, cy, 6, INK) + T(cx, cy + 24, '10 cm stick (top view)', { s: 12.5, f: MUTED });
  s += T(240, 322, 'The Sun is in the south at noon, so the shortest shadow points north.', { s: 12.5 });
  s += T(240, 340, 'Shadows point away from the Sun and change length all day. Drawn to scale.', { s: 12.5, f: MUTED });
  return wrap(id, 'Shadow of a stick through the day (top view)', 'Top view of a 10 centimeter stick with five shadow arrows to scale. 8:30 am: 34 cm pointing west. 10:00 am: 20 cm northwest. 12:00 pm: 9 cm north, the shortest. 2:00 pm: 18 cm northeast. 3:30 pm: 30 cm pointing east. The shadow points away from the Sun, which is in the south at noon, and is longest when the Sun is low.', 356, s);
}

// ---------- 4.1 heat moves, coat slows it ----------
function coat(id) {
  let s = '';
  s += T(240, 58, 'Heat moves from warmer to cooler', { s: 15, w: 700 });
  s += box(30, 82, 70, 64, ORANGE, 'none') + T(65, 118, ['warm', 'cup'], { f: ONC, w: 700, s: 13.5, lh: 15 });
  s += `<rect x="100" y="104" width="170" height="16" rx="8" fill="${S2}" stroke="${INK}" stroke-width="1.5"/>`;
  s += arrow(110, 94, 262, 94, ORANGE, 4, 12) + T(186, 80, 'heat moves along the spoon', { s: 12.5 });
  s += T(186, 142, 'spoon', { s: 12, f: MUTED, a: 'middle' });
  s += T(292, 100, ['The spoon', 'warms up as the', 'cup cools.'], { a: 'start', s: 13 });
  s += `<line x1="20" x2="460" y1="170" y2="170" stroke="${LINE}"/>`;
  s += T(240, 196, 'Why a coat helps: it slows heat leaving your body', { s: 14.5, w: 700 });
  const row = (y0, label, note, coatOn) => {
    let r = T(24, y0, label, { a: 'start', w: 700, s: 13.5 }) + T(456, y0, note, { a: 'end', s: 13, f: MUTED });
    r += box(24, y0 + 10, 76, 54, ORANGE, 'none') + T(62, y0 + 41, ['warm', 'body'], { f: ONC, w: 700, s: 13, lh: 14 });
    r += box(370, y0 + 10, 86, 54, BLUE, 'none') + T(413, y0 + 41, ['cold', 'air'], { f: ONC, w: 700, s: 13, lh: 14 });
    if (coatOn) {
      r += `<rect x="190" y="${y0 + 10}" width="80" height="54" rx="8" fill="${S2}" stroke="${INK}" stroke-width="1.5"/>`;
      r += T(230, y0 + 41, ['coat', '(trapped air)'], { s: 12, lh: 14 });
      r += arrow(100, y0 + 37, 188, y0 + 37, ORANGE, 2, 8) + arrow(270, y0 + 37, 368, y0 + 37, ORANGE, 2, 8);
    } else r += arrow(100, y0 + 37, 368, y0 + 37, ORANGE, 8, 16);
    return r;
  };
  s += row(224, 'No coat', 'heat leaves fast', false);
  s += row(306, 'With a coat', 'heat leaves slowly', true);
  s += T(240, 398, 'A coat does not make heat. Your body does.', { s: 13.5, w: 700 });
  s += T(240, 418, 'The coat slows the heat on its way out.', { s: 13.5 });
  return wrap(id, 'Heat moves, and a coat slows it', 'Top: a warm cup and a spoon, with a heat arrow along the spoon from the warm cup toward the cooler end. Bottom: two rows with a warm body on the left and cold air on the right. With no coat the heat arrow is thick and heat leaves fast. With a coat in between, the heat arrow is thin, so heat leaves slowly. A coat does not make heat; it slows the heat leaving.', 434, s);
}

// ---------- 1-A materials in a beam ----------
function beam(id) {
  const rows = [
    ['Clear plastic', 'light passes through', 'clear'],
    ['Wax paper', 'some light passes, blurry', 'wax'],
    ['Cardboard', 'blocks the light', 'card'],
    ['Mirror', 'bounces light back', 'mirror'],
  ];
  let s = '';
  rows.forEach(([name, out, kind], i) => {
    const y = 56 + i * 84;
    const m = y + 36;
    s += `<rect x="14" y="${m - 9}" width="34" height="18" rx="4" fill="${MUTED}"/><polygon points="48,${m - 9} 58,${m - 14} 58,${m + 14} 48,${m + 9}" fill="${MUTED}"/>`;
    const my = kind === 'mirror' ? m - 6 : m;
    s += arrow(60, my, 186, my, BEAM, 4, 12);
    const fill = { clear: BLUE, wax: BEAM, card: ORANGE, mirror: SURF }[kind];
    const op = { clear: 0.25, wax: 0.55, card: 1, mirror: 1 }[kind];
    s += `<rect x="190" y="${y + 6}" width="14" height="60" rx="3" fill="${fill}" opacity="${op}" stroke="${INK}" stroke-width="1.5"/>`;
    if (kind === 'clear') s += arrow(206, m, 296, m, BEAM, 4, 12);
    if (kind === 'wax') s += [-22, 0, 22].map((d) => arrow(206, m, 292, m + d, BEAM, 2, 8)).join('');
    if (kind === 'card') s += `<rect x="208" y="${y + 6}" width="88" height="60" rx="4" fill="${SHADE}" opacity=".3"/>` + T(252, m + 5, 'shadow', { s: 12.5, f: MUTED });
    if (kind === 'mirror') s += arrow(186, m + 8, 96, m + 8, BEAM, 4, 12);
    s += T(312, m - 4, name, { a: 'start', w: 700, s: 14 }) + T(312, m + 14, out, { a: 'start', s: 12.5, f: MUTED });
  });
  return wrap(id, 'Four materials in a light beam', 'Four rows. In each, a flashlight on the left sends a beam to a material. Clear plastic: the light passes straight through. Wax paper: some light passes through and spreads out, so it is blurry. Cardboard: the light is blocked and there is a shadow behind it. Mirror: the light bounces back toward the flashlight.', 396, s);
}

// ---------- 3.1 magnet and paper clip kit ----------
function clipKit(id) {
  let s = '';
  s += box(50, 170, 70, 56, S2, INK) + box(360, 170, 70, 56, S2, INK) + T(85, 204, 'books', { s: 12.5, f: MUTED }) + T(395, 204, 'books', { s: 12.5, f: MUTED });
  s += `<rect x="40" y="158" width="400" height="12" rx="3" fill="#C8A46E" stroke="${INK}" stroke-width="1.5"/>`;
  s += `<rect x="124" y="142" width="30" height="12" rx="6" fill="none" stroke="${INK}" stroke-width="2.5"/><rect x="130" y="145" width="18" height="6" rx="3" fill="none" stroke="${INK}" stroke-width="2"/>`;
  s += T(139, 134, 'paper clip', { s: 12.5, w: 700 });
  s += arrow(166, 148, 290, 148, BLUE, 3, 11) + T(228, 134, 'clip moves', { s: 12.5, f: BLUE, w: 700 });
  s += `<path d="M126 176 h28 v18 h-8 v-10 h-12 v10 h-8z" fill="${RED}" stroke="${INK}" stroke-width="1.5"/>`;
  s += arrow(160, 212, 290, 212, ORANGE, 3, 11) + T(225, 232, 'move the magnet under the card', { s: 12.5, f: ORANGE, w: 700 });
  s += T(139, 252, 'magnet', { s: 12.5, w: 700 });
  s += T(400, 152, 'cardboard bridge', { s: 12.5, f: MUTED });
  s += `<line x1="139" x2="139" y1="72" y2="140" stroke="${MUTED}" stroke-dasharray="4 3"/><line x1="339" x2="339" y1="72" y2="150" stroke="${MUTED}" stroke-dasharray="4 3"/>`;
  s += arrow(144, 98, 334, 98, MUTED, 2, 9) + arrow(334, 98, 144, 98, MUTED, 2, 9);
  s += T(240, 90, 'at least 20 cm', { s: 12.5, w: 700 }) + T(139, 62, 'start', { s: 12.5, w: 700 }) + T(339, 62, 'finish', { s: 12.5, w: 700 });
  s += T(240, 278, 'Only the magnet is touched. The clip is moved through the card.', { s: 13, f: MUTED });
  return wrap(id, 'Paper-clip mover kit (side view)', 'Side view. A cardboard sheet rests like a bridge on two stacks of books. A paper clip sits on top of the cardboard at the start line. A magnet is held under the cardboard and moved along, and the clip follows it toward the finish line, at least 20 centimeters away. Nobody touches the clip.', 296, s);
}

export const DIAGRAMS = [
  { id: 'd-53-matter-energy', unit: 'unit-5-3-energy-and-matter-in-ecosystems', after: 's3', svg: matterEnergy,
    caption: 'Matter cycles: plants, animals and decomposers pass it on and it returns to soil and air. Energy does not cycle: it flows from the Sun through the food chain and leaves as heat.' },
  { id: 'd-43-eye', unit: 'unit-4-3-waves-light-and-information', after: 's2', svg: eye,
    caption: 'We see an object when light reflects from it and enters our eyes. The eye only receives light. The apple does not make its own light.' },
  { id: 'd-1c-spin', unit: 'unit-1-c-sky-patterns', after: 's1', svg: spin,
    caption: 'The Sun stays put and Earth spins. A place facing the Sun has day. When Earth turns that place away, it has night.' },
  { id: 'd-31-forces', unit: 'unit-3-1-forces-motion-and-magnets', after: 's1', svg: forces,
    caption: 'Balanced forces do not change motion. An object can be moving and still have balanced forces. Unbalanced forces change the motion.' },
  { id: 'd-42-loop', unit: 'unit-4-2-circuits-and-energy-conversion', after: 's1', svg: loop,
    caption: 'The bulb lights only when the loop is closed all the way around. A gap anywhere stops the current in the whole loop.' },
  { id: 'd-52-shadow', unit: 'unit-5-2-gravity-stars-and-sky-patterns', after: 's3', svg: shadow,
    caption: 'The shadow table from this page drawn from above. Both the length and the direction change through the day.' },
  { id: 'd-41-coat', unit: 'unit-4-1-energy-speed-and-collisions', after: 's3', svg: coat,
    caption: 'Heat always moves from warmer to cooler. A coat does not add cold or heat: it slows the heat leaving your body.' },
  { id: 'd-1a-beam', unit: 'unit-1-a-sound-and-light', after: 's3', svg: beam,
    caption: 'What a beam of light does to four materials: passes through, spreads, is blocked, or bounces.' },
  { id: 'd-31-clip', unit: 'unit-3-1-forces-motion-and-magnets', after: 'kit', svg: clipKit,
    caption: 'What the paper-clip mover kit looks like from the side.' },
];
