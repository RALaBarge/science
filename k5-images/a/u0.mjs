import { Page, tag, svg, fig, T, R, C, E, L, P, arrow, sun, person, cloud, INK, MUTED, LINE, S2, SURF, BEAM, BLUE, ORANGE, TEAL, RED, GREEN, SHADE } from './lib.mjs';
export const log = [];
const st = (file, concept, type, status, what, check = '') => log.push({ file: `k-5/${file}`, concept, type, status, what, check });
const CSS = `<!--k5a-css-start-->
<style>
figure.k5i{margin:10px 0 0;min-width:0;max-width:min(100%,560px);background:var(--surface,#fff);border:1px solid var(--line,#d0d8e8);border-radius:14px;overflow:hidden}
figure.k5i svg{display:block;width:100%;height:auto}
figure.k5i figcaption{padding:10px 14px 12px;font-size:.95rem;line-height:1.45;color:var(--muted,#47506e)}
figure.k5i details.k5i-alt{margin:0;padding:0 14px 12px;font-size:.9rem;color:var(--muted,#47506e)}
figure.k5i details.k5i-alt summary{cursor:pointer;padding:2px 0}
</style>
<!--k5a-css-end-->
`;
const F = 'unit-00-how-science-works.html', p = new Page(F);
if (!p.h.includes('k5a-css-start')) p.h = p.h.replace('</head>', CSS + '</head>');
// s1 real: Earth-centered vs Sun-centered
let b = R(10, 40, 220, 220, SURF, INK, 12, 2) + R(250, 40, 220, 220, SURF, INK, 12, 2);
b += C(120, 150, 80, 'none', LINE, 2) + C(120, 150, 50, 'none', LINE, 2) + C(120, 150, 14, BLUE, INK, 2) + C(120, 100, 8, BEAM, INK, 1.5) + C(200, 150, 8, ORANGE, INK, 1.5) + C(70, 150, 6, MUTED, INK, 1) + tag(120, 222, 'Earth in the middle', { s: 14 }) + T(120, 60, 'Earth-centered', { s: 15, w: 700 }) + T(120, 244, '(Ptolemy)', { s: 13, f: MUTED });
b += C(360, 150, 80, 'none', LINE, 2) + C(360, 150, 50, 'none', LINE, 2) + C(360, 150, 14, BEAM, INK, 2) + C(410, 150, 8, BLUE, INK, 1.5) + C(360, 70, 7, ORANGE, INK, 1.5) + C(310, 150, 5, MUTED, INK, 1) + tag(360, 222, 'Sun in the middle', { s: 14 }) + T(360, 60, 'Sun-centered', { s: 15, w: 700 }) + T(360, 244, '(Copernicus)', { s: 13, f: MUTED });
b += T(120, 130, 'Earth', { s: 11, f: 'var(--on-color, #fff)', w: 700 }).replace(/<text/, '<text opacity="0"');
p.addFig('s1', 'real', 2, '00-centers', fig('00-centers', svg('00-centers', 'Two ways to model the sky', 'Two diagrams of circles. In the first, Earth is in the middle with the Sun, Moon and planets circling it. In the second, the Sun is in the middle with Earth and other planets circling it.', 280, b, false), 'Both models could predict where planets would be. Evidence like Galileo’s Venus phases decided between them. Simplified: not to scale, real orbits are ovals.', 'Left: Earth in the middle, other objects circle it. Right: Sun in the middle, Earth and planets circle it.'));
// s5 real: lab safety icons
const goggles = (x) => R(x - 30, 90, 26, 18, 'var(--transmit, #9bd7f0)', INK, 8, 3) + R(x + 4, 90, 26, 18, 'var(--transmit, #9bd7f0)', INK, 8, 3) + L(x - 4, 99, x + 4, 99, INK, 3) + L(x - 30, 99, x - 40, 99, INK, 3) + L(x + 30, 99, x + 40, 99, INK, 3);
const hair = (x) => C(x, 92, 16, S2, INK, 2) + P(`M${x + 14} 86 q24 0 14 30`, 'none', ORANGE, 8);
const flask = (x) => P(`M${x - 10} 70 L${x - 10} 94 L${x - 28} 124 L${x + 28} 124 L${x + 10} 94 L${x + 10} 70 Z`, 'var(--transmit, #9bd7f0)', INK, 3) + L(x - 36, 70, x + 36, 130, RED, 5) + L(x - 36, 130, x + 36, 70, RED, 5);
const adult = (x) => C(x, 78, 12, S2, INK, 2) + L(x, 90, x, 124, BLUE, 5) + L(x, 100, x - 18, 86, BLUE, 5) + L(x, 100, x + 18, 80, BLUE, 5) + T(x + 30, 82, '!', { s: 24, w: 800, f: RED });
const wash = (x) => E(x - 8, 104, 16, 10, S2, INK, 2) + E(x + 10, 98, 16, 10, S2, INK, 2) + [0, 1, 2].map((i) => L(x - 14 + i * 14, 120, x - 18 + i * 14, 136, BLUE, 4)).join('');
b = [['Goggles on', goggles], ['Hair tied back', hair], ['No tasting unknowns', flask], ['Tell an adult', adult], ['Wash hands', wash]].map(([t, f], i) => R(6 + i * 94, 50, 88, 150, SURF, INK, 10, 2) + f(50 + i * 94) + T(50 + i * 94, 170, t.split(' ').length > 2 ? [t.split(' ').slice(0, 2).join(' '), t.split(' ').slice(2).join(' ')] : t, { s: 12, w: 700, lh: 15 })).join('');
p.addFig('s5', 'real', 1, '00-lab-safety', fig('00-lab-safety', svg('00-lab-safety', 'Lab safety, quick rules', 'Five small pictures. Goggles on. Hair tied back. No tasting unknown things, shown with a crossed-out flask. Tell an adult about spills. Wash hands.', 216, b, false), 'The five rules in the table, as pictures.', 'Goggles on; hair tied back; do not taste unknown substances; tell an adult; wash hands.'));
// s8 analogy: cosmic year strip
const X0 = 20, X1 = 460, wd = X1 - X0, xy = (f) => X0 + f * wd;
b = T(240, 56, 'The whole year (13.8 billion years)', { s: 14, w: 700 }) + R(X0, 70, wd, 26, S2, INK, 4, 2) + R(xy(264 / 365), 70, xy(1) - xy(264 / 365), 26, GREEN, 'none', 0, 0) + R(xy(349 / 365), 70, xy(1) - xy(349 / 365), 26, ORANGE, 'none', 0, 0) + R(xy(359 / 365), 70, xy(1) - xy(359 / 365), 26, RED, 'none', 0, 0) + R(X0, 70, wd, 26, 'none', INK, 4, 2);
b += T(X0, 116, 'Jan 1: Big Bang', { s: 12, a: 'start' }) + T(xy(264 / 365), 116, 'Sept: life starts', { s: 12, a: 'middle', f: GREEN, w: 700 }) + L(xy(264 / 365), 96, xy(264 / 365), 104, INK, 2) + T(xy(349 / 365) - 6, 134, 'mid-Dec: animals', { s: 12, a: 'end', f: ORANGE, w: 700 }) + L(xy(349 / 365), 96, xy(349 / 365), 124, INK, 2) + T(X1, 152, 'Dec 25 to 30: dinosaurs', { s: 12, a: 'end', f: RED, w: 700 });
b += L(xy(1) - 4, 96, 300, 176, MUTED, 2, '4 4') + L(xy(1), 96, 460, 176, MUTED, 2, '4 4') + T(240, 170, 'zoom in on the last day (Dec 31)', { s: 13, w: 700, a: 'end' }).replace('x="240"', 'x="290"') + R(20, 180, 440, 26, S2, INK, 4, 2) + R(448, 180, 12, 26, RED, 'none', 0, 0) + R(20, 180, 440, 26, 'none', INK, 4, 2) + T(20, 226, 'midnight, start of Dec 31', { s: 12, a: 'start' }) + T(460, 244, 'last 12 minutes: humans', { s: 12, a: 'end', f: RED, w: 700 }) + T(460, 262, 'last 12 seconds: all of written history', { s: 12, a: 'end', f: RED, w: 700 });
p.addFig('s8', 'analogy', 1, '00-cosmic-year', fig('00-cosmic-year', svg('00-cosmic-year', 'Cosmic calendar', 'A bar for one year with markers: Big Bang on January 1, life starting in September, animals in mid-December, dinosaurs from December 25 to 30. A zoom on December 31 shows humans in the last 12 minutes and written history in the last 12 seconds.', 280, b, false), 'The same times as on this page, drawn along one year. Dates are close estimates, and the bar is not drawn to exact scale at the end.', 'Year bar: life in September, animals mid-December, dinosaurs Dec 25 to 30; humans in the last 12 minutes of Dec 31; written history in the last 12 seconds.'));
p.save();
st(F, 'People have always asked "why?"', 'diagram', 'skipped', 'Already has an interactive SVG timeline (tlSvg); audit matched the wrong cell');
st(F, 'People have always asked "why?"', 'real', 'done', 'Added Earth-centered vs Sun-centered diagram to the Ptolemy/Copernicus cell', 'Orbits drawn as circles and not to scale (stated in caption)');
st(F, 'A loop, not a ladder', 'real', 'skipped', 'Recipe-loop SVG already present in the analogy cell of this section');
st(F, 'Change one thing at a time', 'diagram', 'skipped', 'Cookie-test SVG and fair/unfair interactive already present');
st(F, 'Measure, graph, conclude', 'real', 'done', 'Added five lab-safety pictures above the rules table');
st(F, 'The whole universe in one year', 'analogy', 'done', 'Added cosmic-year bar with a Dec 31 zoom', 'Dates used: life Sept, animals mid-Dec, dinosaurs Dec 25-30, humans last 12 minutes, writing last 12 seconds (all taken from the page text)');
st(F, 'The whole universe in one year', 'real', 'partial', 'Same cosmic-year bar covers this section; no separate picture for the Sagan cell');
