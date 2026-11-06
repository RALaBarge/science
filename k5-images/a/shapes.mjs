import { T, R, C, E, L, P, arrow, sun, tree, cloud, INK, MUTED, LINE, S2, SURF, BEAM, BLUE, ORANGE, TEAL, RED, GREEN } from './lib.mjs';
export const BROWN = 'var(--absorb, #8a5a2b)';
export const SAND = 'var(--beam, #F2A900)';
// deer, facing right; (x,y) = ground under body centre. s scale. fawn = spots + smaller
export function deer(x, y, s = 1, spots = false) {
  let o = `<g transform="translate(${x} ${y}) scale(${s})">`;
  o += L(-22, -34, -24, 0, INK, 5) + L(-10, -34, -10, 0, INK, 5) + L(14, -34, 14, 0, INK, 5) + L(26, -34, 28, 0, INK, 5);
  o += E(0, -46, 36, 17, BROWN, INK, 2) + P('M-36 -52 L-44 -62', 'none', INK, 4);
  o += P('M28 -52 L40 -76', 'none', INK, 7) + E(48, -80, 13, 10, BROWN, INK, 2) + P('M40 -88 L36 -104 L46 -92 Z', BROWN, INK, 2) + P('M52 -90 L58 -106 L58 -90 Z', BROWN, INK, 2) + C(52, -82, 2.2, INK);
  if (spots) o += [[-20, -50], [-4, -54], [12, -48], [-12, -40], [4, -42]].map(([a, b]) => C(a, b, 3, SURF)).join('');
  return o + '</g>';
}
export function robin(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">` + L(-4, 10, -6, 28, INK, 3) + L(6, 10, 8, 28, INK, 3) + P('M-30 -4 L-52 -14 L-48 6 Z', INK, INK, 1) + E(0, -4, 30, 20, 'var(--muted, #6b7390)', INK, 2) + P('M10 -2 q18 -6 18 14 q-12 8 -26 0 z', ORANGE, ORANGE, 1) + C(24, -22, 12, 'var(--muted, #6b7390)', INK, 2) + P('M35 -22 L48 -18 L35 -15 Z', BEAM, INK, 1.5) + C(27, -24, 2.2, INK) + '</g>';
}
export function beaver(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">` + P('M-30 -2 q-30 8 -50 -8 q4 -16 22 -10 q18 6 30 12 z', INK, INK, 1) + E(0, -16, 34, 22, BROWN, INK, 2) + C(30, -26, 14, BROWN, INK, 2) + R(34, -22, 8, 8, SURF, INK, 2, 1.5) + C(34, -32, 2.4, INK) + C(24, -40, 4, BROWN, INK, 1.5) + L(-12, 4, -12, 12, INK, 4) + L(16, 4, 16, 12, INK, 4) + '</g>';
}
export function mapleLeaf(x, y, s = 1, fill = GREEN) {
  return `<g transform="translate(${x} ${y}) scale(${s})">` + P('M0 40 L0 -2 M0 -2 L-30 -18 L-22 -4 L-48 -2 L-32 12 L-38 26 L-10 20 L0 40 L10 20 L38 26 L32 12 L48 -2 L22 -4 L30 -18 L0 -2 L0 -46 L-10 -26 L-22 -50 L-24 -22 Z', fill, INK, 2) + '</g>';
}
export function bee(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">` + E(-6, -14, 14, 9, 'var(--surface, #fff)', INK, 1.5) + E(8, -14, 14, 9, 'var(--surface, #fff)', INK, 1.5) + E(0, 0, 20, 12, BEAM, INK, 2) + L(-6, -11, -6, 11, INK, 4) + L(6, -11, 6, 11, INK, 4) + C(-24, 0, 2, INK) + '</g>';
}
export function flower(x, y, s = 1, petal = RED) {
  let o = `<g transform="translate(${x} ${y}) scale(${s})">` + L(0, 0, 0, 44, GREEN, 4);
  for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; o += E(Math.cos(a) * 12, Math.sin(a) * 12, 9, 6, petal, INK, 1).replace('<ellipse', `<ellipse transform="rotate(${i * 60} ${Math.cos(a) * 12} ${Math.sin(a) * 12})"`); }
  return o + C(0, 0, 7, BEAM, INK, 1.5) + '</g>';
}
export function fish(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">` + E(0, 0, 18, 9, ORANGE, INK, 1.5) + P('M16 0 L30 -9 L30 9 Z', ORANGE, INK, 1.5) + C(-9, -2, 2, INK) + '</g>';
}
export const bird = (x, y, s = 1) => P(`M${x - 12 * s} ${y} q${6 * s} ${-9 * s} ${12 * s} 0 q${6 * s} ${-9 * s} ${12 * s} 0`, 'none', INK, 2.5);
// habitat panels, width w height h, origin (x,y)
export function pondPanel(x, y, w = 140, h = 140) {
  return `<g transform="translate(${x} ${y})">` + R(0, 0, w, h, SURF, INK, 10, 2) + R(2, h * 0.45, w - 4, h * 0.55 - 2, BLUE, 'none', 8, 0) + P(`M10 ${h * 0.5} q10 -6 20 0 t20 0 t20 0 t20 0`, 'none', SURF, 2) + fish(w * 0.45, h * 0.72, 0.9) + fish(w * 0.72, h * 0.62, 0.7) + L(30, h * 0.45, 30, h * 0.2, GREEN, 3) + L(22, h * 0.45, 22, h * 0.28, GREEN, 3) + L(w - 24, h * 0.45, w - 24, h * 0.18, GREEN, 3) + sun(w - 22, 22, 9) + '</g>';
}
export function forestPanel(x, y, w = 140, h = 140) {
  return `<g transform="translate(${x} ${y})">` + R(0, 0, w, h, SURF, INK, 10, 2) + R(2, h * 0.78, w - 4, h * 0.22 - 2, 'var(--green, #25904F)', 'none', 8, 0) + tree(w * 0.2, h * 0.8, 1.2) + tree(w * 0.8, h * 0.8, 1.3) + deer(w * 0.5, h * 0.9, 0.5) + '</g>';
}
export function dunePanel(x, y, w = 140, h = 140) {
  return `<g transform="translate(${x} ${y})">` + R(0, 0, w, h, SURF, INK, 10, 2) + R(2, h * 0.55, w - 4, h * 0.2, BLUE, 'none', 0, 0) + P(`M2 ${h * 0.8} q${w * 0.3} ${-h * 0.35} ${w * 0.55} -4 q${w * 0.2} ${h * 0.1} ${w * 0.43} ${h * 0.05} L${w - 2} ${h - 2} L2 ${h - 2} Z`, SAND, INK, 2) + [0.35, 0.45, 0.6].map((f) => L(w * f, h * 0.65 + 6, w * f - 3, h * 0.65 - 18, GREEN, 3) + L(w * f, h * 0.65 + 6, w * f + 4, h * 0.65 - 16, GREEN, 3)).join('') + bird(w * 0.72, h * 0.25, 0.9) + '</g>';
}
