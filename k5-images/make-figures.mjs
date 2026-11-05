// Builds the per-page figure lists (k5-images/units/*.json) and the SVG files from their sources:
//   figures-src.mjs (raster images), graph-defs.mjs (data graphs), diagram-defs.mjs (labeled diagrams).
// Run: node k5-images/make-figures.mjs   then   node k5-images/inject-images.mjs   then   node build.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RASTER } from './figures-src.mjs';
import { GRAPHS, UNITS } from './graph-defs.mjs';
import { DIAGRAMS } from './diagram-defs.mjs';
import { INTERACTIVES } from './interactive-defs.mjs';

const dir = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(dir, 'svg'), { recursive: true });
mkdirSync(join(dir, 'units'), { recursive: true });
const byPage = {};
const add = (page, fig) => { (byPage[page] ||= []).push(fig); };

for (const [id, key, after, alt, caption] of RASTER) {
  if (!UNITS[key]) throw new Error('unknown page key ' + key);
  if (!existsSync(join(dir, 'webp', id + '.webp'))) throw new Error('missing webp ' + id);
  add(UNITS[key], { id, after, kind: 'image', file: id + '.webp', alt, caption });
}
const svgAlt = (svg) => /<desc id="[^"]*">([^<]*)<\/desc>/.exec(svg)[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
for (const g of [...DIAGRAMS.map((d) => ({ ...d, kind: 'diagram' })), ...GRAPHS]) {
  const svg = g.svg(g.id);
  writeFileSync(join(dir, 'svg', g.id + '.svg'), svg + '\n');
  add(g.unit, { id: g.id, after: g.after, kind: 'svg', file: g.id + '.svg', alt: svgAlt(svg), caption: g.caption });
}
for (const w of INTERACTIVES) {
  if (!existsSync(join(dir, 'html', w.file))) throw new Error('missing html ' + w.file);
  add(w.unit, { id: w.id, after: w.after, kind: 'html', file: w.file, alt: w.alt, caption: w.caption });
}
for (const f of readdirSync(join(dir, 'units'))) unlinkSync(join(dir, 'units', f));
let total = 0;
for (const [page, figures] of Object.entries(byPage)) {
  // images first, then diagrams, then graphs, in a stable order
  const rank = (f) => (f.kind === 'image' ? 0 : f.id.startsWith('g-') ? 2 : 1);
  figures.sort((a, b) => rank(a) - rank(b));
  writeFileSync(join(dir, 'units', page + '.json'), JSON.stringify({ page, figures }, null, 1) + '\n');
  total += figures.length;
}
console.log(total + ' figures on ' + Object.keys(byPage).length + ' pages');
