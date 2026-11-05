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

// Pages were authored as fragments (no doctype, charset, viewport or lang). Wrap them so phones scale the
// page, screen readers get the language and the browser uses standards mode.
function wrap(html) {
  if (/^\s*<!doctype/i.test(html)) return html;
  return '<!doctype html>\n<html lang="en">\n<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' +
    html.replace(/^\uFEFF/, '') + '\n</html>\n';
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
