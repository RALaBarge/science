// Sanity tests for the quiz scoring. Run: node docs/trades/quiz-prototype/test.js
const path = require('path');
const Q = require('./quiz.js');
const data = require('./data.json');
const ctx = Q.prepare(data);
let fail = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fail = 1; };
const by = Object.fromEntries(data.map((o) => [o.soc, o]));

const show = (label, a) => {
  const r = Q.recommend(a, ctx, 5);
  console.log('\n' + label + '\n  ' + r.map((x) => x.name + ' [' + x.family + ']' + (x.relaxed ? ' (relaxed)' : '')).join('\n  '));
  return r;
};
const names = (r) => r.map((x) => x.name.toLowerCase()).join(' | ');

// Personas: each should get a sensible set, and never something the student ruled out.
const P = {
  outdoorsBuilder: { setting: 'outdoors', social: 'crew', physical: 'heavy', focus: ['build', 'operate'], brain: ['math'], avoid: [], training: 'long', priority: ['pay'] },
  caregiver: { setting: 'indoors', social: 'public', physical: 'light', focus: ['care'], brain: ['judgment', 'detail'], avoid: ['dirty', 'danger'], training: 'long', priority: ['growth'] },
  fixer: { setting: 'indoors', social: 'crew', physical: 'moderate', focus: ['fix'], brain: ['troubleshoot', 'tech'], avoid: ['heights', 'hot-cold'], training: 'mid', priority: ['safeFromAI'] },
  driver: { setting: 'vehicle', social: 'solo', physical: 'light', focus: ['operate'], brain: [], avoid: ['heights'], training: 'short', priority: [] },
  cook: { setting: 'indoors', social: 'public', physical: 'moderate', focus: ['serve'], brain: ['creative'], avoid: [], training: 'short', priority: [] },
  outdoorsGrower: { setting: 'outdoors', social: 'any', physical: 'moderate', focus: ['grow'], brain: [], avoid: [], training: 'short', priority: [] },
  noRules: { setting: 'any', social: 'any', physical: 'any', focus: [], brain: [], avoid: [], training: 'any', priority: [] },
  avoidsEverything: { setting: 'indoors', social: 'solo', physical: 'light', focus: ['make'], brain: ['detail'], avoid: ['heights', 'tight-spaces', 'dirty', 'hot-cold', 'irregular-hours', 'travel', 'danger', 'noise'], training: 'short', priority: [] },
};
for (const [k, a] of Object.entries(P)) {
  const r = show(k, a);
  ok(r.length === 5, k + ': returns 5 matches');
  ok(new Set(r.map((x) => x.soc)).size === r.length, k + ': no duplicates');
  const fams = {}; r.forEach((x) => { fams[x.family] = (fams[x.family] || 0) + 1; });
  ok(Object.values(fams).every((n) => n <= 2), k + ': at most two from one family');
  if (!r.some((x) => x.relaxed)) {
    ok(r.every((x) => !by[x.soc].tags.cond.some((c) => (a.avoid || []).includes(c))), k + ': nothing the student ruled out');
  }
  ok(r.every((x) => x.because.length > 0 || a.focus.length + a.brain.length === 0), k + ': every match says why');
}
ok(/electric|operating|construction|lineworker|power-line|iron|crane|carpenter|pipe|welder|mason|laborer|equipment/.test(names(Q.recommend(P.outdoorsBuilder, ctx, 5))), 'outdoors builder: a building or equipment trade is in the top five');
ok(Q.recommend(P.caregiver, ctx, 5).every((x) => ['Health technicians and care', 'Public safety', 'Personal care and service', 'Food and hospitality'].includes(x.family) || x.because.includes('looking after people\'s health or safety')), 'caregiver: care work comes up');
ok(/driver|operator|pilot|conductor|engineer|hostler|transport|bus|taxi|chauffeur|tractor|locomotive/.test(names(Q.recommend(P.driver, ctx, 5))), 'driver: a driving or operating job comes up');

// Coverage sweep: over many random profiles, how many of the 306 ever appear, and are the deep-dive trades reachable?
let seed = 12345;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const pick = (a) => a[Math.floor(rnd() * a.length)];
const many = (a, k) => a.filter(() => rnd() < k / a.length);
const opt = (id) => Q.QUESTIONS.find((q) => q.id === id).options.map((o) => o[0]);
const seen = new Map();
let relaxedCount = 0, total = 6000;
for (let i = 0; i < total; i++) {
  const a = {
    setting: pick(opt('setting')), social: pick(opt('social')), physical: pick(opt('physical')),
    focus: many(opt('focus'), 1.5).slice(0, 2), brain: many(opt('brain'), 1.5).slice(0, 2),
    avoid: many(opt('avoid'), 1.5), training: pick(opt('training')), priority: many(opt('priority'), 1).slice(0, 2),
  };
  const r = Q.recommend(a, ctx, 5);
  if (r.some((x) => x.relaxed)) relaxedCount++;
  r.forEach((x) => seen.set(x.soc, (seen.get(x.soc) || 0) + 1));
}
const never = data.filter((o) => !seen.has(o.soc));
console.log('\nCoverage over ' + total + ' random profiles: ' + seen.size + ' of ' + data.length + ' occupations appear; ' + never.length + ' never do; relaxed filters in ' + (100 * relaxedCount / total).toFixed(1) + '% of runs');
const nf = {}; never.forEach((o) => { nf[o.family] = (nf[o.family] || 0) + 1; });
console.log('Never recommended, by family: ' + JSON.stringify(nf));
const top = [...seen.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([s, n]) => by[s].name + ' ' + n);
console.log('Most recommended: ' + top.join('; '));
ok(seen.size >= 0.5 * data.length, 'at least half of all occupations are reachable');
ok(data.filter((o) => o.deepDive).every((o) => seen.has(o.soc)), 'every deep-dive trade is reachable');
process.exit(fail);
