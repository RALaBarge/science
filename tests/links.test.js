// Static link check for the built site: every relative href/src in dist/ must resolve,
// and every grade folder must contain the lessons the map advertises.
const { readFileSync, readdirSync, existsSync, statSync } = require('fs');
const path = require('path');
function check(label, cond, detail = '') {
  console.log((cond ? 'PASS ' : 'FAIL ') + label + (detail ? '  (' + detail + ')' : ''));
  if (!cond) process.exitCode = 1;
}

const ROOT = path.join(__dirname, '..', 'dist');

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p, files);
    else if (name.endsWith('.html')) files.push(p);
  }
  return files;
}

let checked = 0;
const problems = [];
for (const file of walk(ROOT)) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|data:|javascript:|#)/.test(url)) continue;
    const bare = url.split(/[?#]/)[0];
    if (!bare) continue;
    checked++;
    const target = path.resolve(path.dirname(file), decodeURIComponent(bare));
    if (!existsSync(target)) problems.push(`${path.relative(ROOT, file)} -> ${url}`);
  }
}

const count = (grade) => readdirSync(path.join(ROOT, grade)).filter((f) => f.endsWith('.html')).length;
check('site home exists', existsSync(path.join(ROOT, 'index.html')));
check('arcade hub exists', existsSync(path.join(ROOT, 'arcade.html')));
check('k-5 has 1 lesson', count('k-5') === 1, String(count('k-5')));
check('6th has 13 lessons', count('6th') === 13, String(count('6th')));
check('7th has 9 lessons', count('7th') === 9, String(count('7th')));
check('8th has 9 lessons', count('8th') === 9, String(count('8th')));
check('design log published', existsSync(path.join(ROOT, 'design-log.html')));
check(`${checked} relative links resolve`, problems.length === 0, problems.slice(0, 8).join(' | '));
