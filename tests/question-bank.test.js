// Checks the Science Arcade question bank (shared/questions.js): every row is well formed, graded,
// and free of obvious duplicates, and each grade has enough questions for a game to use as its ceiling.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
function check(label, cond, detail = '') {
  console.log((cond ? 'PASS ' : 'FAIL ') + label + (detail ? '  (' + detail + ')' : ''));
  if (!cond) process.exitCode = 1;
}

const win = {};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'shared', 'questions.js'), 'utf8'), { window: win });
const B = win.QUESTION_BANK;
check('bank loads', Array.isArray(B) && B.length > 0, String(B && B.length));

let shape = 0, grade = 0, dupChoice = 0, empty = 0, long = 0, answerLeak = 0;
const stems = new Map();
for (const [i, r] of B.entries()) {
  if (r.length !== 5) shape++;
  const [topic, q, ch, why, g] = r;
  if (!Number.isInteger(g) || g < 0 || g > 8) grade++;
  if (!topic || !q || !why || !Array.isArray(ch) || ch.length !== 4 || ch.some((c) => typeof c !== 'string' || !c.trim())) { empty++; continue; }
  if (new Set(ch.map((c) => c.trim().toLowerCase())).size !== 4) dupChoice++;
  if (q.length > 200 || ch.some((c) => c.length > 100) || why.length > 380) long++;
  if (ch.slice(1).some((c) => /all of the above|none of the above/i.test(c)) || /all of the above|none of the above/i.test(ch[0])) answerLeak++;
  const key = q.trim().toLowerCase().replace(/[^a-z0-9 ]/g, '');
  if (stems.has(key)) console.log('  duplicate stem: rows ' + stems.get(key) + ' and ' + i); else stems.set(key, i);
}
check('every row is [topic, question, 4 choices, explanation, grade]', shape === 0, shape + ' rows off');
check('every grade is an integer from 0 to 8', grade === 0, grade + ' rows off');
check('every row has text, 4 choices and an explanation', empty === 0, empty + ' rows off');
check('the four choices are distinct', dupChoice === 0, dupChoice + ' rows with repeats');
check('no "all/none of the above" choices', answerLeak === 0, answerLeak + ' rows');
check('question and choice lengths are reasonable', long === 0, long + ' rows too long');
check('no duplicate questions', stems.size === B.length, B.length - stems.size + ' duplicates');

const per = {};
for (const r of B) per[r[4]] = (per[r[4]] || 0) + 1;
// A game capped at grade g draws from every question up to g, so the running totals matter.
let run = 0;
const floors = { 0: 8, 1: 18, 2: 30, 3: 50, 4: 75, 5: 105, 6: 150, 7: 200, 8: 280 };
for (let g = 0; g <= 8; g++) {
  run += per[g] || 0;
  check('grade ' + g + ' ceiling has enough questions', run >= floors[g], run + ' available, need ' + floors[g]);
}
console.log('  per grade: ' + JSON.stringify(per) + '; total ' + B.length);
