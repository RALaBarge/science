// Adds real photographs to the 8th-grade lesson pages.
// For every entry in 8th-images/figures.json it embeds the picture (WebP or SVG from 8th-images/) into its page as a data URI,
// so each page stays a single file. Figures sit between <!--img8-start id=...--> and <!--img8-end id=...--> markers and the
// shared CSS between <!--img8-css-start--> and <!--img8-css-end-->, so the script is safe to re-run.
//   page   : file name in 8th/
//   after  : "lede" (right under the first big paragraph), "hero" (end of the header), a section id such as "s3"
//            (right under its idea line) or "end:s5" (at the end of that section)
//   items  : one picture {file, alt, caption, credit} or several (they become a captioned grid)
// Run: node 8th-images/inject.mjs   (then node build.mjs)
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, '8th-images');
const figs = JSON.parse(readFileSync(join(dir, 'figures.json'), 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const CSS = `<!--img8-css-start-->
<style>
figure.img8{margin:14px 0;max-width:min(100%,860px);background:var(--surface,#fff);border:1px solid var(--line,#d0d8e8);border-radius:14px;overflow:hidden}
figure.img8 img{display:block;width:100%;height:auto}
figure.img8.sq{max-width:min(100%,560px)}
figure.img8 figcaption{padding:10px 14px 12px;font-size:.95rem;line-height:1.45;color:var(--muted,#47506e)}
figure.img8 .credit{display:block;margin-top:4px;font-size:.8rem;opacity:.85}
.img8-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:12px;margin:14px 0}
.img8-grid figure.img8{margin:0}
.img8-grid .yr{display:block;font-weight:800;color:var(--ink,#12172b);margin-bottom:2px}
</style>
<!--img8-css-end-->
`;
function uri(file) {
  const b = readFileSync(join(dir, file.endsWith('.svg') ? file : 'webp/' + file));
  return (file.endsWith('.svg') ? 'data:image/svg+xml;base64,' : 'data:image/webp;base64,') + b.toString('base64');
}
function one(it, grid) {
  const dim = it.w && it.h ? ` width="${it.w}" height="${it.h}"` : '';
  const cap = (it.year ? `<span class="yr">${esc(it.year)}</span>` : '') + esc(it.caption) + (it.credit ? `<span class="credit">${esc(it.credit)}</span>` : '');
  return `<figure class="img8${it.square ? ' sq' : ''}"${it.maxw ? ` style="max-width:min(100%,${it.maxw}px)"` : ''}><img src="${uri(it.file)}" alt="${esc(it.alt)}"${dim} loading="lazy" decoding="async"><figcaption>${cap}</figcaption></figure>`;
}
function block(f) {
  const body = f.items ? (f.stack ? f.items.map((i) => one(i, false)).join('') : `<div class="img8-grid">${f.items.map((i) => one(i, true)).join('')}</div>`) : one(f, false);
  return `<!--img8-start id=${f.id}-->\n${body}\n<!--img8-end id=${f.id}-->\n`;
}
function strip(html) {
  return html.replace(/\n*<!--img8-start id=[^>]*-->[\s\S]*?<!--img8-end id=[^>]*-->\n?/g, '').replace(/<!--img8-css-start-->[\s\S]*?<!--img8-css-end-->\n?/g, '');
}
function sectionRange(html, id) {
  const m = new RegExp('<section[^>]*\\bid="' + id + '"[^>]*>').exec(html);
  if (!m) throw new Error('no section ' + id);
  const from = m.index + m[0].length;
  return [from, html.indexOf('</section>', from)];
}
function anchor(html, after, page) {
  if (after === 'lede') {
    const m = /<p class="lede">[\s\S]*?<\/p>/.exec(html);
    if (!m) throw new Error(page + ': no lede');
    return m.index + m[0].length;
  }
  if (after === 'hero') return html.indexOf('</header>');
  if (after.startsWith('end:')) return sectionRange(html, after.slice(4))[1];
  const [from, end] = sectionRange(html, after);
  const p = /<p class="idea">[\s\S]*?<\/p>/.exec(html.slice(from, end));
  if (!p) throw new Error(page + ': no idea line in ' + after);
  let at = from + p.index + p[0].length;
  const cx = /^\s*<p class="ctx"[^>]*>[\s\S]*?<\/p>/.exec(html.slice(at, end));
  if (cx) at += cx[0].length; // keep the background paragraph above the figures
  return at;
}
const byPage = {};
for (const f of figs) (byPage[f.page] ||= []).push(f);
for (const [page, list] of Object.entries(byPage)) {
  const path = join(root, '8th', page);
  let html = readFileSync(path, 'utf8');
  const crlf = html.includes('\r\n');
  html = strip(html.replace(/\r\n/g, '\n'));
  const inserts = list.map((f) => ({ at: anchor(html, f.after, page), text: '\n' + block(f) })).sort((a, b) => b.at - a.at);
  for (const i of inserts) html = html.slice(0, i.at) + i.text + html.slice(i.at);
  const head = html.indexOf('<header class="hero">');
  if (head < 0) throw new Error(page + ': no header');
  html = html.slice(0, head) + CSS + html.slice(head);
  writeFileSync(path, crlf ? html.replace(/\n/g, '\r\n') : html);
  console.log(page + ': ' + list.length + ' figure block(s)');
}
