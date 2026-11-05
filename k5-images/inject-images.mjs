// Adds pictures, graphs and diagrams to the K-5 lesson pages.
// For every k5-images/units/<page>.json it inserts that page's figures:
//   { id, after, kind: "image" | "svg", file, alt, caption }
//   after = "hero" (just under the page header) or the id of a section (it goes right after the section's idea line).
// Raster files (k5-images/webp/<file>) are embedded as data URIs and SVG files (k5-images/svg/<file>) are inlined,
// so every page stays a single file. Each figure sits between <!--k5images-start id=...--> and <!--k5images-end id=...-->
// markers, and the shared CSS between <!--k5images-css-start--> and <!--k5images-css-end-->, so the script is safe to re-run
// and does not touch the activity block that k5-activities/inject.mjs writes. Run order does not matter.
// Run: node k5-images/inject-images.mjs   (then node build.mjs)
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'k5-images');

const CSS = `<!--k5images-css-start-->
<style>
figure.k5i{margin:0;min-width:0;max-width:min(100%,720px);background:var(--surface,#fff);border:1px solid var(--line,#d0d8e8);border-radius:14px;overflow:hidden}
figure.k5i img,figure.k5i svg{display:block;width:100%;height:auto}
figure.k5i.k5i-hero{margin:4px 0 0}
figure.k5i.k5i-chart{max-width:min(100%,560px)}
figure.k5i .k5w{padding:12px 14px 4px;display:grid;gap:10px}
figure.k5i .k5w p{margin:0;font-size:.98rem;line-height:1.45}
figure.k5i .k5w p.small{font-size:.88rem;color:var(--muted,#47506e)}
figure.k5i .k5w .row{display:flex;flex-wrap:wrap;gap:8px}
figure.k5i .k5w button{font:inherit;font-size:.95rem;padding:8px 14px;min-height:40px;border-radius:999px;border:1.5px solid var(--line,#d0d8e8);background:var(--surface,#fff);color:var(--ink,#12172b);cursor:pointer}
figure.k5i .k5w button[aria-pressed="true"]{background:var(--ink,#12172b);color:var(--bg,#fff);border-color:var(--ink,#12172b)}
figure.k5i .k5w button:focus-visible,figure.k5i .k5w input:focus-visible{outline:3px solid var(--beam,#f2a900);outline-offset:2px}
figure.k5i .k5w label{font-weight:700}
figure.k5i .k5w input[type=range]{width:100%;accent-color:var(--beam,#f2a900);height:32px}
figure.k5i figcaption{padding:10px 14px 12px;font-size:.95rem;line-height:1.45;color:var(--muted,#47506e)}
figure.k5i details.k5i-alt{margin:0;padding:0 14px 12px;font-size:.9rem;color:var(--muted,#47506e)}
figure.k5i details.k5i-alt summary{cursor:pointer;padding:2px 0}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) figure.k5i img{filter:brightness(.92)}}
:root[data-theme="dark"] figure.k5i img{filter:brightness(.92)}
@media (prefers-reduced-motion:reduce){figure.k5i,figure.k5i *{transition:none!important;animation:none!important}}
</style>
<!--k5images-css-end-->
`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function figure(f) {
  let inner;
  if (f.kind === 'image') {
    const b = readFileSync(join(dir, 'webp', f.file));
    inner = `<img src="data:image/webp;base64,${b.toString('base64')}" alt="${esc(f.alt)}" width="800" height="450" loading="lazy" decoding="async">`;
  } else if (f.kind === 'html') {
    inner = readFileSync(join(dir, 'html', f.file), 'utf8').trim();
  } else {
    inner = readFileSync(join(dir, 'svg', f.file), 'utf8').trim();
  }
  const chart = f.kind === 'svg';
  const widget = f.kind === 'html';
  const alt = chart ? `<details class="k5i-alt"><summary>Text version of this ${f.id.startsWith('g-') ? 'graph' : 'diagram'}</summary><p>${esc(f.alt)}</p></details>` : '';
  return `<!--k5images-start id=${f.id}-->\n<figure class="k5i${chart || widget ? ' k5i-chart' : ''}${widget ? ' k5i-widget' : ''}${f.after === 'hero' ? ' k5i-hero' : ''}" id="fig-${f.id}">${inner}<figcaption>${esc(f.caption)}</figcaption>${alt}</figure>\n<!--k5images-end id=${f.id}-->\n`;
}

// Remove every figure block and the CSS block this script wrote earlier.
function strip(html) {
  html = html.replace(/\n*<!--k5images-start id=[^>]*-->[\s\S]*?<!--k5images-end id=[^>]*-->\n?/g, '');
  html = html.replace(/<!--k5images-css-start-->[\s\S]*?<!--k5images-css-end-->\n?/g, '');
  return html;
}

// Index just past the idea line of the section with this id (or past its title block).
function sectionAnchor(html, id, file) {
  const m = new RegExp('<section[^>]*\\bid="' + id + '"[^>]*>').exec(html);
  if (!m) throw new Error(file + ': no section with id "' + id + '"');
  const from = m.index + m[0].length;
  const end = html.indexOf('</section>', from);
  const body = html.slice(from, end);
  const p = /<p class="idea">[\s\S]*?<\/p>/.exec(body);
  if (p) return from + p.index + p[0].length;
  const d = body.indexOf('</div>');
  if (d < 0) throw new Error(file + ': cannot place figures in section ' + id);
  return from + d + 6;
}

export function injectInto(html, figs, file) {
  const crlf = html.includes('\r\n');
  html = strip(html.replace(/\r\n/g, '\n'));
  const groups = new Map();
  for (const f of figs) {
    if (!groups.has(f.after)) groups.set(f.after, []);
    groups.get(f.after).push(f);
  }
  const inserts = [];
  for (const [after, list] of groups) {
    let at;
    if (after === 'hero') {
      const h = html.indexOf('</header>');
      if (h < 0) throw new Error(file + ': no </header>');
      at = h; // inside the header, so the figure lines up with the title and text
    } else at = sectionAnchor(html, after, file);
    inserts.push({ at, text: '\n' + list.map(figure).join('') });
  }
  inserts.sort((a, b) => b.at - a.at);
  for (const i of inserts) html = html.slice(0, i.at) + i.text + html.slice(i.at);
  // The lesson pages have no <head> tag, so the CSS goes just before the page header.
  const head = html.indexOf('<header class="hero">');
  if (head < 0) throw new Error(file + ': no page header to put the CSS before');
  const helper = figs.some((f) => f.kind === 'html') ? '<script>' + readFileSync(join(dir, 'html', '_k5w.js'), 'utf8') + '</script>' : '';
  html = html.slice(0, head) + CSS.replace('<!--k5images-css-end-->', helper + '<!--k5images-css-end-->') + html.slice(head);
  return crlf ? html.replace(/\n/g, '\r\n') : html;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  let n = 0, figs = 0;
  for (const f of readdirSync(join(dir, 'units')).filter((x) => x.endsWith('.json'))) {
    const page = join(root, 'k-5', f.replace(/\.json$/, '.html'));
    if (!existsSync(page)) { console.error('no page for ' + f); process.exitCode = 1; continue; }
    const cfg = JSON.parse(readFileSync(join(dir, 'units', f), 'utf8'));
    try {
      const html = injectInto(readFileSync(page, 'utf8'), cfg.figures, f);
      writeFileSync(page, html);
      n++; figs += cfg.figures.length;
      console.log(f.replace(/\.json$/, '') + ': ' + cfg.figures.length + ' figures');
    } catch (e) { console.error(e.message); process.exitCode = 1; }
  }
  console.log(figs + ' figures on ' + n + ' pages');
}
