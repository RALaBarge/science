// Builds review-site/: a copy of dist/ with every item that needs Ryan's call highlighted.
// Source pages are never touched. Run after `node build.mjs`:  node review/make-review.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const out = path.join(root, 'review-site');
const spec = JSON.parse(fs.readFileSync(path.join(root, 'review', 'flags.json'), 'utf8'));

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const COLORS = { DECIDE: '#ff00e6', MISSING: '#ff6a00', CHECK: '#00b3ff', READ: '#ff00e6' };

fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(dist, out, { recursive: true });

// Tiny glob: only a "*" in the last path segment.
function expand(pattern) {
  const dir = path.dirname(pattern), base = path.basename(pattern);
  if (!base.includes('*')) return fs.existsSync(path.join(dist, pattern)) ? [pattern.replace(/\\/g, '/')] : [];
  const rx = new RegExp('^' + base.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$');
  const d = path.join(dist, dir);
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter((f) => rx.test(f)).map((f) => (dir === '.' ? f : dir + '/' + f));
}

// True when position i of html is inside a tag, <script> or <style>.
function inMarkup(html, i) {
  if (html.lastIndexOf('<', i) > html.lastIndexOf('>', i)) return true;
  for (const t of ['script', 'style']) {
    const o = html.lastIndexOf('<' + t, i);
    if (o !== -1 && o > html.lastIndexOf('</' + t, i)) return true;
  }
  return false;
}

const perPage = new Map(); // file -> [{kind, note}]
const problems = [];
for (const fl of spec.flags) {
  const files = [...new Set(fl.files.flatMap(expand))];
  if (!files.length) problems.push('no file for ' + fl.files.join(', '));
  for (const f of files) {
    const p = path.join(out, f);
    let html = fs.readFileSync(p, 'utf8');
    const list = perPage.get(f) || [];
    const n = list.length + 1;
    const color = COLORS[fl.kind] || '#ff00e6';
    const badge = `<span class="rv-badge" style="background:${color}">${fl.kind} ${n}: ${esc(fl.banner || fl.note)}</span>`;
    if (fl.banner) {
      list.push({ kind: fl.kind, note: fl.banner });
    } else {
      const rx = new RegExp(fl.pat, 'g');
      let m, hit = null;
      while ((m = rx.exec(html))) {
        if (fl.insert === 'before' ? true : !inMarkup(html, m.index)) { hit = m; break; }
        if (m[0].length === 0) rx.lastIndex++;
      }
      if (!hit && fl.files.some((x) => x.includes('*')) && fl.files.length === 1) continue;
      if (!hit) { problems.push(`${f}: pattern not found: ${fl.pat}`); continue; }
      const repl = fl.insert === 'before'
        ? `${badge.replace('class="rv-badge"', 'class="rv-badge rv-block"')}${hit[0]}`
        : `<mark class="rv" id="rv${n}" style="outline-color:${color}">${hit[0]}</mark>${badge}`;
      html = html.slice(0, hit.index) + repl + html.slice(hit.index + hit[0].length);
      list.push({ kind: fl.kind, note: fl.note, id: 'rv' + n });
    }
    perPage.set(f, list);
    fs.writeFileSync(p, html);
  }
}

const CSS = `<style id="rv-style">
html body mark.rv{background:#39ff14 none!important;background-color:#39ff14!important;background-image:none!important;color:#000!important;-webkit-text-fill-color:#000!important;text-shadow:none!important;outline:3px solid #ff00e6!important;outline-offset:2px;padding:1px 4px;border-radius:3px;box-shadow:0 0 0 2px #39ff14,0 0 12px 4px #39ff14}
.rv-badge{display:inline-block;margin:2px 6px;padding:2px 8px;border-radius:10px;color:#fff;font:700 13px/1.35 system-ui,sans-serif;text-shadow:0 0 2px #000;vertical-align:middle;white-space:normal}
.rv-block{display:block;margin:6px 0}
#rv-banner{position:sticky;top:0;z-index:2147483646;background:#39ff14;color:#000;border-bottom:4px solid #ff00e6;padding:8px 14px;font:700 14px/1.4 system-ui,sans-serif}
#rv-banner a{color:#000;text-decoration:underline}
#rv-banner ol{margin:4px 0 0 20px;padding:0;font-weight:600}
</style>`;

for (const [f, list] of perPage) {
  const p = path.join(out, f);
  let html = fs.readFileSync(p, 'utf8');
  const depth = f.split('/').length - 1;
  const idx = (depth ? '../'.repeat(depth) : '') + 'REVIEW-INDEX.html';
  const items = list.map((x) => `<li>${x.kind}: ${esc(x.note)}${x.id ? ` <a href="#${x.id}">(jump)</a>` : ''}</li>`).join('');
  const banner = `<div id="rv-banner">REVIEW COPY: ${list.length} thing${list.length === 1 ? '' : 's'} on this page need your call (highlighted neon green / badges). <a href="${idx}">All flags</a><ol>${items}</ol></div>`;
  // Built lesson pages have no <head>/<body> wrapper, so put the style and banner right after the viewport meta.
  const top = CSS + banner;
  if (/<body[^>]*>/.test(html)) html = html.replace(/<body[^>]*>/, (m) => m + top);
  else if (/<meta name="viewport"[^>]*>/.test(html)) html = html.replace(/<meta name="viewport"[^>]*>/, (m) => m + top);
  else html = top + html;
  fs.writeFileSync(p, html);
}

// Index
let rows = '';
for (const [f, list] of [...perPage].sort((a, b) => a[0].localeCompare(b[0]))) {
  rows += `<h3><a href="${f}">${f}</a></h3><ul>` + list.map((x) => `<li><b style="color:${COLORS[x.kind] || '#ff00e6'}">${x.kind}</b> ${esc(x.note)}${x.id ? ` <a href="${f}#${x.id}">jump</a>` : ''}</li>`).join('') + '</ul>';
}
fs.writeFileSync(path.join(out, 'REVIEW-INDEX.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Review index</title>
<style>body{font:16px/1.5 system-ui,sans-serif;max-width:60rem;margin:0 auto;padding:16px;background:#fff;color:#111}h1{background:#39ff14;padding:8px 12px;border:3px solid #ff00e6}h3{margin:18px 0 4px}li{margin:3px 0}</style>
<h1>Review index: ${[...perPage.values()].reduce((n, l) => n + l.length, 0)} flags on ${perPage.size} pages</h1>
<p>Open the pages from here (this folder is a copy of the built site with highlights; the real site is untouched). DECIDE = your call, MISSING = something was not made, CHECK = please look, READ = new unit needs a human read.</p>
<h2>General checks (not tied to a spot)</h2><ul>${spec.general.map((g) => `<li>${esc(g)}</li>`).join('')}</ul>
<h2>By page</h2>${rows}</html>`);

console.log(`review-site: ${[...perPage.values()].reduce((n, l) => n + l.length, 0)} flags on ${perPage.size} pages`);
if (problems.length) { console.log('PROBLEMS:\n' + problems.join('\n')); process.exitCode = 1; }
