// Build the publishable dist/ tree:
//   - dist/<game>.html      one self-contained arcade game per game
//   - dist/arcade.html      the arcade hub (self-contained)
//   - dist/index.html       the lesson map / site home (already self-contained)
//   - dist/k-5|6th|7th|8th|extras  the lesson guides, copied as-is (games are embedded in them)
//   - dist/design-log.html  the engineering design log
// Run: node build.mjs
import { readFileSync, writeFileSync, readdirSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, 'dist');
mkdirSync(out, { recursive: true });

const GRADES = ['k-5', '6th', '7th', '8th', 'extras'];

// Shared accessibility layer (shared/a11y.css, shared/a11y.js): a skip link, a focus target for it, the Classic
// contrast tokens, reduced-motion and forced-colors rules, and aria-valuetext on sliders. Added to every built page
// here so the 60+ lesson pages do not each carry a copy.
const A11Y_CSS = readFileSync(join(root, 'shared', 'a11y.css'), 'utf8');
const A11Y_JS = readFileSync(join(root, 'shared', 'a11y.js'), 'utf8').replace(/<\/script/gi, '<\/script');
const SKIP = '<a class="skip-link" href="#main">Skip to main content</a>\n';

function a11y(html) {
  if (html.includes('class="skip-link"')) return html;
  // Walk the markup, skipping script and style bodies, to find the first <header>, <main> and <h1>.
  const at = {};
  const re = /<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<(header|main|h1)\b[^>]*>/gi;
  for (let m; (m = re.exec(html)); ) if (m[1] && !at[m[1].toLowerCase()]) at[m[1].toLowerCase()] = m;
  // The skip target: <main>, or the h1 when a page has no <main>.
  const t = at.main || at.h1;
  if (!t) return html;
  let tag = t[0];
  if (!/\sid=/.test(tag)) tag = tag.replace(/>$/, ' id="main">');
  if (!/\stabindex=/.test(tag)) tag = tag.replace(/>$/, ' tabindex="-1">');
  if (!/\sid="main"/.test(tag)) return html; // the target already has a different id
  html = html.slice(0, t.index) + tag + html.slice(t.index + t[0].length);
  const body = /<body\b[^>]*>/i.exec(html);
  if (body) html = html.slice(0, body.index + body[0].length) + '\n' + SKIP + html.slice(body.index + body[0].length);
  else {
    // Insert before the first <header> or <main> (or the target), whichever comes first.
    let a = Math.min(...[at.header, at.main, at.h1].filter(Boolean).map((x) => x.index));
    html = html.slice(0, a) + SKIP + html.slice(a);
  }
  const tail = '<style id="a11y-shared">\n' + A11Y_CSS + '</style>\n<script>\n' + A11Y_JS + '</script>\n';
  const end = html.lastIndexOf('</body>');
  return end >= 0 ? html.slice(0, end) + tail + html.slice(end) : html + '\n' + tail;
}

// Pages were authored as fragments (no doctype, charset, viewport or lang). Wrap them so phones scale the
// page, screen readers get the language and the browser uses standards mode.
function wrap(html) {
  html = a11y(html);
  if (/^\s*<!doctype/i.test(html)) return html;
  return '<!doctype html>\n<html lang="en">\n<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' +
    html.replace(/^﻿/, '') + '\n</html>\n';
}

function inline(file) {
  const dir = dirname(file);
  let html = readFileSync(file, 'utf8');
  html = html.replace(/<link rel="stylesheet" href="([^"]+\.css)">/g, (m, href) => {
    if (href.startsWith('http')) return m;
    return '<style>\n' + readFileSync(join(dir, href), 'utf8') + '</style>';
  });
  html = html.replace(/<script src="([^"]+\.js)"><\/script>/g, (m, src) => {
    if (src.startsWith('http')) return m;
    // keep "</script>" inside the code from closing the tag early
    return '<script>\n' + readFileSync(join(dir, src), 'utf8').replace(/<\/script/gi, '<\\/script') + '</script>';
  });
  return html;
}

// Arcade games: dist/<name>.html, flat so the hub can link to them by bare filename.
const pages = readdirSync(join(root, 'games')).filter((f) => f.endsWith('.html'));
for (const f of pages) {
  writeFileSync(join(out, f), wrap(inline(join(root, 'games', f))));
  console.log('built dist/' + f);
}

// Arcade hub.
try {
  writeFileSync(join(out, 'arcade.html'), wrap(inline(join(root, 'arcade.html'))));
  console.log('built dist/arcade.html');
} catch (e) { if (e.code !== 'ENOENT') throw e; }

// Site home (lesson map) and the design log.
for (const f of ['index.html', 'design-log.html']) {
  if (existsSync(join(root, f))) {
    writeFileSync(join(out, f), wrap(readFileSync(join(root, f), 'utf8')));
    console.log('built dist/' + f);
  }
}

// How AI Works used to live at 9th/unit-9.1-how-ai-works.html; keep the old address working.
mkdirSync(join(out, '9th'), { recursive: true });
writeFileSync(join(out, '9th', 'unit-9.1-how-ai-works.html'), '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Moved: How AI Works</title><meta http-equiv="refresh" content="0; url=../extras/how-ai-works.html"><link rel="canonical" href="../extras/how-ai-works.html"></head><body><p>This lesson moved: <a href="../extras/how-ai-works.html">How AI Works</a>.</p></body></html>\n');

// Lesson guides, kept in their grade folders so cross-grade links stay valid.
for (const grade of GRADES) {
  const dir = join(root, grade);
  if (!existsSync(dir)) continue;
  mkdirSync(join(out, grade), { recursive: true });
  const files = readdirSync(dir).filter((f) => f.endsWith('.html'));
  for (const f of files) writeFileSync(join(out, grade, f), wrap(readFileSync(join(dir, f), 'utf8')));
  console.log(`built dist/${grade}/ (${files.length} lesson pages)`);
}
