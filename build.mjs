// Build: turn each games/<name>.html (which links ../shared/*.css|js and its own .js) into one
// self-contained dist/<name>.html that works from GitHub Pages, a USB stick, or a file:// link.
// Also builds dist/index.html (the arcade hub). Run:  node build.mjs
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const root = dirname(new URL(import.meta.url).pathname);
const out = join(root, 'dist');
mkdirSync(out, { recursive: true });

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

const pages = readdirSync(join(root, 'games')).filter((f) => f.endsWith('.html'));
for (const f of pages) {
  writeFileSync(join(out, f), inline(join(root, 'games', f)));
  console.log('built dist/' + f);
}
try {
  writeFileSync(join(out, 'index.html'), inline(join(root, 'hub', 'index.html')));
  console.log('built dist/index.html');
} catch (e) { if (e.code !== 'ENOENT') throw e; }
