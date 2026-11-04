// Adds the interactive activities to the K-5 lesson pages.
// For every k5-activities/units/<page>.json it puts the unit's engine (Big Sort by default, or the one named
// in "engine") plus that config into k-5/<page>.html, just before the "More lessons" section.
// Safe to re-run: it replaces its own block.
// Run after the pages are regenerated: node k5-activities/inject.mjs   (then node build.mjs)
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
// engine name in a unit config -> [source file, mount function]
const ENGINES = {
  bigsort: ['bigsort.js', 'k5BigSort'],
  fairtest: ['fairtest.js', 'k5FairTest'],
  pusharena: ['pusharena.js', 'k5PushArena'],
  graphsky: ['graphsky.js', 'k5GraphSky'],
};
const source = {};
for (const [name, [file]] of Object.entries(ENGINES)) {
  source[name] = readFileSync(join(root, 'k5-activities', file), 'utf8')
    .replace(/\r\n/g, '\n')
    .replace(/\nif \(typeof module[^\n]*\n?$/, '\n')
    .replace(/<\/script/gi, '<\\/script');
}
const START = '<!--k5-activity-start-->';
const END = '<!--k5-activity-end-->';
const MORE = '<section class="sec related" id="more">';

let n = 0;
for (const f of readdirSync(join(root, 'k5-activities', 'units')).filter((x) => x.endsWith('.json'))) {
  const page = join(root, 'k-5', f.replace(/\.json$/, '.html'));
  if (!existsSync(page)) { console.error('no page for ' + f); process.exitCode = 1; continue; }
  const cfg = JSON.parse(readFileSync(join(root, 'k5-activities', 'units', f), 'utf8'));
  const eng = cfg.engine || 'bigsort';
  if (!ENGINES[eng]) { console.error('unknown engine ' + eng + ' in ' + f); process.exitCode = 1; continue; }
  const json = JSON.stringify(cfg).replace(/</g, '\\u003c');
  const block = START + '\n<section class="sec lesson-game-sec" id="activity"><div><p class="kicker">After the lesson · Activity</p><h2>Play: ' +
    cfg.title.replace(/&/g, '&amp;') + '</h2></div><p class="idea">' + cfg.intro.replace(/&/g, '&amp;') +
    '</p><div id="k5-activity"></div>\n<script>\n' + source[eng] + '\n' + ENGINES[eng][1] + '(document.getElementById("k5-activity"), ' + json + ');\n</script>\n</section>\n' + END + '\n';
  let html = readFileSync(page, 'utf8');
  const crlf = html.includes('\r\n');
  html = html.replace(/\r\n/g, '\n');
  const a = html.indexOf(START), b = html.indexOf(END);
  if (a >= 0 && b > a) html = html.slice(0, a) + html.slice(b + END.length + 1);
  const at = html.indexOf(MORE);
  if (at < 0) { console.error('no "more" section in ' + f); process.exitCode = 1; continue; }
  html = html.slice(0, at) + block + '\n' + html.slice(at);
  writeFileSync(page, crlf ? html.replace(/\n/g, '\r\n') : html);
  n++;
  console.log('activity added: ' + f.replace(/\.json$/, ''));
}
console.log(n + ' pages updated');
