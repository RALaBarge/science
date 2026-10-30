// Build the publishable dist/ tree:
//   - dist/<game>.html      one self-contained arcade game per game
//   - dist/arcade.html      the arcade hub (self-contained)
//   - dist/index.html       the lesson map / site home (already self-contained)
//   - dist/k-5|6th|7th|8th  the lesson guides, copied as-is (games are embedded in them)
//   - dist/design-log.html  the engineering design log
// Run: node build.mjs
import { readFileSync, writeFileSync, readdirSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

const root = dirname(new URL(import.meta.url).pathname);
const out = join(root, 'dist');
mkdirSync(out, { recursive: true });

const GRADES = ['k-5', '6th', '7th', '8th'];

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
  writeFileSync(join(out, f), inline(join(root, 'games', f)));
  console.log('built dist/' + f);
}

// Arcade hub.
try {
  writeFileSync(join(out, 'arcade.html'), inline(join(root, 'arcade.html')));
  console.log('built dist/arcade.html');
} catch (e) { if (e.code !== 'ENOENT') throw e; }

// Site home (lesson map) and the design log.
for (const f of ['index.html', 'design-log.html']) {
  if (existsSync(join(root, f))) {
    copyFileSync(join(root, f), join(out, f));
    console.log('built dist/' + f);
  }
}

// Lesson guides, kept in their grade folders so cross-grade links stay valid.
for (const grade of GRADES) {
  const dir = join(root, grade);
  if (!existsSync(dir)) continue;
  mkdirSync(join(out, grade), { recursive: true });
  const files = readdirSync(dir).filter((f) => f.endsWith('.html'));
  for (const f of files) copyFileSync(join(dir, f), join(out, grade, f));
  console.log(`built dist/${grade}/ (${files.length} lesson pages)`);
}
