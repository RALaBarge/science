// Checks the K-5 pictures, graphs and diagrams: every config entry has alt text and an existing file,
// no embedded image is over 120 KB, each figure appears exactly once on its page (in k-5/ and dist/k-5/),
// the CSS block appears once, a section anchor exists for each figure, and the pages still build.
// Run: node tests/k5-images.test.js
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const root = path.join(__dirname, '..');
const dir = path.join(root, 'k5-images');
let fail = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fail = 1; };

const units = fs.readdirSync(path.join(dir, 'units')).filter((f) => f.endsWith('.json'));
ok(units.length === 23, '23 units have a figure list (' + units.length + ')');

const ids = new Set();
let figs = 0, maxData = 0;
for (const f of units) {
  const cfg = JSON.parse(fs.readFileSync(path.join(dir, 'units', f), 'utf8'));
  const base = f.replace(/\.json$/, '');
  const page = path.join(root, 'k-5', base + '.html');
  ok(fs.existsSync(page), base + ' has a lesson page');
  ok(cfg.figures.some((x) => x.after === 'hero'), base + ' has a hero image');
  const html = fs.existsSync(page) ? fs.readFileSync(page, 'utf8') : '';
  for (const fig of cfg.figures) {
    figs++;
    const where = base + ' ' + fig.id;
    ok(!ids.has(fig.id), where + ' id is unique');
    ids.add(fig.id);
    ok(typeof fig.alt === 'string' && fig.alt.trim().length >= 25, where + ' has alt text');
    ok(typeof fig.caption === 'string' && fig.caption.trim().length > 0, where + ' has a caption');
    const file = path.join(dir, fig.kind === 'image' ? 'webp' : fig.kind === 'html' ? 'html' : 'svg', fig.file);
    ok(fs.existsSync(file), where + ' file exists');
    ok(fig.after === 'hero' || new RegExp('<section[^>]*\\bid="' + fig.after + '"').test(html), where + ' has its anchor "' + fig.after + '"');
    const count = (html.match(new RegExp('<!--k5images-start id=' + fig.id + '-->', 'g')) || []).length;
    ok(count === 1, where + ' appears once in the page (' + count + ')');
    const endc = (html.match(new RegExp('<!--k5images-end id=' + fig.id + '-->', 'g')) || []).length;
    ok(endc === 1, where + ' end marker once');
    if (fig.kind === 'image' && fs.existsSync(file)) {
      const size = fs.statSync(file).size;
      maxData = Math.max(maxData, Math.ceil(size / 3) * 4);
      ok(Math.ceil(size / 3) * 4 <= 120 * 1024, where + ' data URI is at most 120 KB (' + Math.round(size / 1024) + ' KB file)');
    }
    if (fig.kind === 'svg' && fs.existsSync(file)) {
      const svg = fs.readFileSync(file, 'utf8');
      ok(/<title id=/.test(svg) && /<desc id=/.test(svg) && /role="img"/.test(svg), where + ' svg has role, title and description');
      ok(!/<image\b/.test(svg), where + ' svg has no embedded raster');
    }
  }
  ok((html.match(/<!--k5images-css-start-->/g) || []).length === 1, base + ' has the figure CSS once');
  ok(html.includes('<!--k5images-start id=') && !/<!--k5images-start id=[^>]*-->(?:(?!<!--k5images-end)[\s\S])*<!--k5images-start/.test(html), base + ' figure blocks are not nested');
  // The built copy matches the source copy.
  const built = path.join(root, 'dist', 'k-5', base + '.html');
  // The build wraps each page with a doctype, lang and viewport, so strip that before comparing.
  const unwrap = (s) => s.replace(/^<!doctype html>\n<html lang="en">\n<meta charset="utf-8">\n<meta name="viewport"[^\n]*\n/, '').replace(/\n<\/html>\n$/, '');
  if (fs.existsSync(built)) ok(unwrap(fs.readFileSync(built, 'utf8')) === html, base + ' dist copy is current');
}
console.log('  ' + figs + ' figures, largest data URI about ' + Math.round(maxData / 1024) + ' KB');

// No text in raster images is a manual rule; the manifest must at least list every raster image as accepted with a reason.
const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
const raster = fs.readdirSync(path.join(dir, 'webp')).filter((f) => f.endsWith('.webp')).map((f) => f.replace('.webp', ''));
for (const id of raster) {
  const m = manifest.images.find((x) => x.id === id);
  ok(!!m && m.accepted === true && m.reason && m.prompt && typeof m.seed === 'number', 'manifest has accepted ' + id + ' with prompt, seed and reason');
}

// Every page still builds, and injecting is idempotent.
try {
  execFileSync(process.execPath, [path.join(root, 'build.mjs')], { cwd: root, stdio: 'pipe' });
  ok(true, 'node build.mjs succeeds');
  const before = fs.readdirSync(path.join(root, 'k-5')).filter((f) => f.endsWith('.html')).map((f) => fs.readFileSync(path.join(root, 'k-5', f), 'utf8'));
  execFileSync(process.execPath, [path.join(dir, 'inject-images.mjs')], { cwd: root, stdio: 'pipe' });
  const after = fs.readdirSync(path.join(root, 'k-5')).filter((f) => f.endsWith('.html')).map((f) => fs.readFileSync(path.join(root, 'k-5', f), 'utf8'));
  ok(before.every((h, i) => h === after[i]), 'inject-images.mjs is idempotent');
} catch (e) {
  ok(false, 'build or inject failed: ' + e.message.split('\n')[0]);
}
process.exit(fail);
