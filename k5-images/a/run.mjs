import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { root } from './lib.mjs';
const mods = process.argv.slice(2);
const all = [];
for (const m of mods) { const x = await import('./' + m + '.mjs'); all.push(...x.log); }
console.log(all.length, 'status entries');
if (process.env.STATUS) writeFileSync(join(root, 'docs/content-audit/status-k5a.json'), JSON.stringify(all, null, 1));
