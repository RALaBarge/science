// Builds extras/pick-a-trade.html from the trades catalog.
//   Parts 1 to 3 of docs/trades/trades-catalog.md are converted to HTML.
//   The comparison table is built in the browser from docs/trades/quiz-prototype/data.json.
// Run from the repo root: node docs/trades/build-page.mjs   (then node build.mjs)
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const md = readFileSync(join(root, 'docs', 'trades', 'trades-catalog.md'), 'utf8').replace(/\r\n/g, '\n');
const data = JSON.parse(readFileSync(join(root, 'docs', 'trades', 'quiz-prototype', 'data.json'), 'utf8'));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slug = (s) => s.toLowerCase().replace(/&amp;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function inline(s) {
  let t = esc(s);
  t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" rel="noopener">$1</a>');
  t = t.replace(/(^|[\s(;,])(https?:\/\/[^\s<)|;,]+[^\s<)|;,.])/g, '$1<a href="$2" rel="noopener">$2</a>');
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/(^|[^*])\*([^*\s][^*]*)\*(?!\*)/g, '$1<em>$2</em>');
  t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
  return t;
}

function convert(text, { h1 = 1 } = {}) {
  const lines = text.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    let m;
    if ((m = l.match(/^(#{1,4})\s+(.*)$/))) {
      const lvl = Math.min(6, m[1].length + h1 - 1);
      const label = m[2].trim();
      out.push('<h' + lvl + ' id="' + slug(label) + '">' + inline(label) + '</h' + lvl + '>');
      i++; continue;
    }
    if (l.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) { rows.push(lines[i]); i++; }
      const cells = (r) => r.replace(/^\||\|\s*$/g, '').split('|').map((c) => c.trim());
      const head = cells(rows[0]);
      const body = rows.slice(2).map(cells);
      out.push('<div class="tw"><table><thead><tr>' + head.map((c) => '<th scope="col">' + inline(c) + '</th>').join('') + '</tr></thead><tbody>' +
        body.map((r) => '<tr>' + r.map((c) => '<td>' + inline(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>');
      continue;
    }
    if (/^\s*-\s+/.test(l)) {
      const items = [];
      while (i < lines.length && /^\s*-\s+/.test(lines[i])) {
        let item = lines[i].replace(/^\s*-\s+/, '');
        i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*-\s+/.test(lines[i])) { item += ' ' + lines[i].trim(); i++; }
        items.push('<li>' + inline(item) + '</li>');
      }
      out.push('<ul>' + items.join('') + '</ul>');
      continue;
    }
    if (/^\d+\.\s+/.test(l)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) { items.push('<li>' + inline(lines[i].replace(/^\d+\.\s+/, '')) + '</li>'); i++; }
      out.push('<ol>' + items.join('') + '</ol>');
      continue;
    }
    const para = [];
    para.push(lines[i].trim()); i++;
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|\||\s*-\s+|\d+\.\s+|\*\*)/.test(lines[i])) { para.push(lines[i].trim()); i++; }
    out.push('<p>' + inline(para.join(' ')) + '</p>');
  }
  return out.join('\n');
}

// ---- split the catalog into its parts
const parts = md.split(/^# (?=Part \d|Appendix)/m);
const find = (prefix) => parts.find((p) => p.startsWith(prefix));
// The catalog was written from internal research notes; on the public page those references read oddly, so rephrase them.
const REFS = [
  [/the report names IBEW Local 252/g, 'locally, IBEW Local 252'],
  [/the report names Apprentice Completion \(CTAC\) and Journeyman Industrial \(APJPIM\) for apprenticeship credit/g, 'the credit pathways are Apprentice Completion (CTAC) and Journeyman Industrial (APJPIM)'],
  [/the report names Greater Michigan/g, 'locally, Greater Michigan'],
  [/The report also names a Michigan Regional Council of Carpenters and Millwrights apprenticeship for millwrights/g, 'The Michigan Regional Council of Carpenters and Millwrights runs an apprenticeship for millwrights'],
  [/The union lists do not (?:name|enumerate) a /g, 'We did not find a '],
  [/The report also notes a proposed Marine Structural Welding and Ship Repair certificate, but it is not yet in the catalog\./g, 'A proposed Marine Structural Welding and Ship Repair certificate has been announced but is not yet in the catalog.'],
  [/Other Michigan routes named in the report:/g, 'Other Michigan routes:'],
  [/Other routes named in the report:/g, 'Other routes:'],
  [/; the report says the status of these options should be verified/g, '; check that these options still run'],
  [/The inputs do not name another Michigan school route for this trade\./g, 'We did not find another Michigan school route for this trade.'],
  [/The report mentions Local 36 but notes that detail was not confirmed\./g, 'IUEC Local 36 (Detroit) is mentioned, but we could not confirm details.'],
  [/the report names IUOE Local 324 apprenticeship/g, 'locally, IUOE Local 324 runs an apprenticeship'],
  [/the report names Oakland NEXT/g, 'examples include Oakland NEXT'],
  [/I did not search non-credit continuing-education offerings\./g, 'Non-credit continuing-education offerings were not searched.'],
];
const cleanRefs = (t) => REFS.reduce((a, [re, to]) => a.replace(re, to), t);
const part1 = cleanRefs(find('Part 1').replace(/^Part 1:[^\n]*\n/, ''));
const part2raw = find('Part 2').replace(/^Part 2:[^\n]*\n/, '');
const part2 = cleanRefs(part2raw);
const part3 = find('Part 3').replace(/^Part 3:[^\n]*\n/, '');

// Part 1: wrap each trade in an article with its own anchor.
const trades = part1.split(/^(?=### )/m);
const intro1 = trades.shift();
const tradeNav = [];
const articles = trades.map((t) => {
  const title = t.match(/^### (.*)$/m)[1];
  const id = slug(title.replace(/\s*\(\d{2}-\d{4}\)/, ''));
  tradeNav.push('<a href="#' + id + '">' + esc(title.replace(/\s*\(\d{2}-\d{4}\)/, '')) + '</a>');
  return '<article class="trade" id="' + id + '">' + convert(t, { h1: 1 }) + '</article>';
});

// Part 3: one collapsible block per family; the leading text and the "cannot count" list stay open.
const p3 = part3.split(/^(?=## )/m);
const p3intro = convert(p3.shift());
const p3html = p3.map((blk) => {
  const title = blk.match(/^## (.*)$/m)[1];
  const body = blk.replace(/^## .*\n/, '');
  if (/cannot count/i.test(title)) return '<section class="cant"><h3>' + esc(title) + '</h3>' + convert(body) + '</section>';
  return '<details class="fam"><summary><span>' + esc(title.replace(/\s*\(\d+\)$/, '')) + '</span> <small>' + (title.match(/\((\d+)\)$/) || ['', ''])[1] + '</small></summary>' + convert(body) + '</details>';
}).join('\n');

const rows = data.map((o) => [o.soc, o.name, o.family, o.blurb, o.tags, o.path, o.miWorkers, o.wage, o.growth, o.ai, o.deepDive ? 1 : 0]);

const PATHS = { 'onjob-short': 'On the job (days to months)', 'onjob-mid': 'On the job (months)', 'onjob-long': 'On the job (a year or more)', certificate: 'Certificate or short program', apprenticeship: 'Apprenticeship', associate: '2-year degree', college: 'College degree', unknown: 'Varies' };

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Pick a Trade: hands-on careers in Michigan</title>
<meta name="description" content="A guide to 306 hands-on careers with Michigan worker counts, wages and growth, fifteen trades in depth, and what Washtenaw Community College offers.">
<style>
:root{--bg:#f6f4ee;--surface:#fffdf8;--ink:#1d2433;--muted:#5b6475;--line:#d9d4c6;--accent:#b4531c;--soft:#efe9da;--font:'Inter','Segoe UI',system-ui,-apple-system,Roboto,sans-serif}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#141922;--surface:#1c2330;--ink:#eef0f5;--muted:#a3adbf;--line:#313b4d;--accent:#f09a62;--soft:#232c3b;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#141922;--surface:#1c2330;--ink:#eef0f5;--muted:#a3adbf;--line:#313b4d;--accent:#f09a62;--soft:#232c3b;color-scheme:dark}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
[id]{scroll-margin-top:70px}
body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.6 var(--font);padding:0 max(16px,env(safe-area-inset-right,0px)) 64px max(16px,env(safe-area-inset-left,0px))}
.wrap{max-width:900px;margin:0 auto}
a{color:var(--accent);overflow-wrap:anywhere}
p,li,summary{overflow-wrap:anywhere}
:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
.top{padding-top:20px;font-size:.9rem}
.kicker{text-transform:uppercase;letter-spacing:.08em;font-size:.78rem;color:var(--accent);font-weight:700;margin:18px 0 0}
h1{font-size:clamp(1.9rem,5.5vw,2.8rem);line-height:1.08;margin:.2em 0 .3em;text-wrap:balance}
h2{font-size:1.55rem;margin:2.2em 0 .4em;line-height:1.2;text-wrap:balance}
h3{font-size:1.15rem;margin:1.4em 0 .3em}
h4{font-size:1rem;margin:1.2em 0 .2em}
.lede{font-size:1.1rem;color:var(--muted);max-width:62ch}
.note{background:var(--soft);border:1px solid var(--line);border-radius:10px;padding:12px 16px;margin:18px 0;font-size:.95rem}
.note b{color:var(--accent)}
nav.jump{position:sticky;top:0;z-index:5;background:var(--bg);border-bottom:1px solid var(--line);margin:18px -4px 0;padding:8px 4px;display:flex;gap:6px;flex-wrap:wrap}
nav.jump a{display:inline-block;padding:6px 12px;border:1px solid var(--line);border-radius:999px;background:var(--surface);text-decoration:none;color:var(--ink);font-size:.92rem}
nav.jump a:hover{border-color:var(--accent)}
.tradenav{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0 0}
.tradenav a{padding:4px 10px;border:1px solid var(--line);border-radius:8px;background:var(--surface);text-decoration:none;color:var(--ink);font-size:.9rem}
article.trade{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:6px 20px 14px;margin:18px 0}
article.trade h3{font-size:1.3rem;margin-top:.9em}
article.trade p{margin:.5em 0}
article.trade ul{margin:.3em 0 .6em;padding-left:1.2em}
.tw{overflow-x:auto;margin:10px 0;border:1px solid var(--line);border-radius:10px;background:var(--surface)}
table{border-collapse:collapse;width:100%;font-size:.88rem}
th,td{padding:7px 9px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}
th{background:var(--soft);position:sticky;top:0;white-space:nowrap}
td{min-width:80px}
details.fam{background:var(--surface);border:1px solid var(--line);border-radius:10px;margin:8px 0;padding:0 14px}
details.fam summary{cursor:pointer;padding:10px 0;font-weight:700;display:flex;justify-content:space-between;gap:10px}
details.fam summary small{color:var(--muted);font-weight:400}
details.fam ul{margin:0 0 12px;padding-left:1.1em}
details.fam li{margin:.35em 0}
.cant{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:2px 16px 10px;margin:16px 0}
.filters{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(170px,100%),1fr));gap:8px;margin:12px 0}
.filters label{font-size:.82rem;color:var(--muted);display:grid;gap:3px;min-width:0}
.filters input,.filters select{width:100%;max-width:100%;font:inherit;padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--ink);min-height:40px}
#cmp th button{font:inherit;font-weight:700;background:none;border:0;color:inherit;cursor:pointer;padding:0;text-align:left}
#cmp td.num{text-align:right;white-space:nowrap}
#cmp .sub{display:block;color:var(--muted);font-size:.8rem;max-width:46ch}
#cmp .tg{color:var(--muted);font-size:.78rem}
.pill{display:inline-block;font-size:.72rem;border:1px solid var(--accent);color:var(--accent);border-radius:999px;padding:0 7px;margin-left:4px}
#count{color:var(--muted);font-size:.9rem;margin:6px 0}
footer{margin-top:3em;color:var(--muted);font-size:.9rem;border-top:1px solid var(--line);padding-top:14px}
</style>
</head>
<body>
<div class="wrap">
<p class="top"><a href="../index.html">&larr; All lessons</a></p>
<p class="kicker">Careers &middot; Michigan</p>
<h1>Pick a Trade</h1>
<p class="lede">Hands-on careers that do not depend on a screen: what the work is like, how people get in, and what Michigan numbers say about pay and demand. Fifteen trades in depth, what Washtenaw Community College (WCC) offers, and a short description of every other occupation we could count.</p>
<div class="note"><b>Draft.</b> The numbers come from the U.S. Bureau of Labor Statistics. The descriptions, the "AI exposure" labels and the tags were written by a language model without web access and have not been checked line by line. WCC information comes from a survey of its 2026&ndash;27 catalog and may have changed. Check anything you act on with the school, union or employer. Last built 2026-11-04.</div>
<nav class="jump" aria-label="Sections"><a href="#in-depth">Fifteen in depth</a><a href="#wcc">Washtenaw CC</a><a href="#more">More trades</a><a href="#compare">Compare all ${data.length}</a></nav>

<h2 id="in-depth">Fifteen trades in depth</h2>
${convert(intro1.replace('Health technician careers are in Part 3 and the appendix.', 'Health technician careers are in More trades and the comparison table.'))}
<div class="tradenav">${tradeNav.join('')}</div>
${articles.join('\n')}

<h2 id="wcc">Washtenaw Community College (WCC)</h2>
${convert(part2, { h1: 2 })}

<h2 id="more">More trades, one line each</h2>
${p3intro}
${p3html}

<h2 id="compare">Compare all ${data.length} occupations</h2>
<p>Search, filter and sort. Worker counts are for Michigan where BLS publishes them. The wage is the Michigan median, or the U.S. median where Michigan is not published. Projected change is the national 2025 to 2035 estimate.</p>
<div class="filters">
<label>Search<input id="q" type="search" placeholder="electrician, outdoors, fix&hellip;" autocomplete="off"></label>
<label>Family<select id="fam"><option value="">All families</option></select></label>
<label>Way in<select id="path"><option value="">Any</option></select></label>
<label>Setting<select id="set"><option value="">Any</option><option>outdoors</option><option>indoors</option><option>mixed</option><option>vehicle</option></select></label>
</div>
<p id="count" aria-live="polite"></p>
<div class="tw"><table id="cmp"><thead><tr>
<th scope="col" aria-sort="none"><button data-k="n">Occupation</button></th>
<th scope="col" aria-sort="none"><button data-k="w">MI workers</button></th>
<th scope="col" aria-sort="none"><button data-k="wg">Median wage</button></th>
<th scope="col" aria-sort="none"><button data-k="g">Change 2025&ndash;35</button></th>
<th scope="col">Way in</th><th scope="col">AI (model's judgment)</th><th scope="col">Tags</th>
</tr></thead><tbody></tbody></table></div>

<footer>
<p>Sources: BLS Employment Projections 2025&ndash;35 and Occupational Employment and Wage Statistics (May 2025 and May 2024), pulled from bls.gov; WCC catalog and union-partnership pages (wccnet.edu); North America's Building Trades Unions and AFL-CIO affiliate pages. Worker counts (wage-and-salary jobs) and projections (which include the self-employed) are different measures and will not match. Michigan figures are blank where BLS does not publish them for small occupations.</p>
<p>Part of <a href="../index.html">Science Lessons</a>.</p>
</footer>
</div>
<script>
(function(){
var PATHS=${JSON.stringify(PATHS)};
var D=${JSON.stringify(rows)};
var body=document.querySelector('#cmp tbody'),q=document.getElementById('q'),fam=document.getElementById('fam'),pth=document.getElementById('path'),set=document.getElementById('set'),count=document.getElementById('count');
var sortKey='w',dir=-1;
function opts(sel,vals,label){vals.forEach(function(v){var o=document.createElement('option');o.value=v[0];o.textContent=v[1];sel.appendChild(o);});}
var fams=[];D.forEach(function(r){if(fams.indexOf(r[2])<0)fams.push(r[2]);});fams.sort();
opts(fam,fams.map(function(f){return[f,f];}));
var ps=[];D.forEach(function(r){if(ps.indexOf(r[5])<0)ps.push(r[5]);});
opts(pth,ps.map(function(p){return[p,PATHS[p]||p];}));
function tagText(t){var a=[t.setting,t.social,t.physical+' work','focus: '+t.focus.join('+')];if(t.brain.length)a.push('uses '+t.brain.join(', '));if(t.cond.length)a.push(t.cond.join(', '));return a.join(' · ');}
function fmt(n){return n==null?'n/a':n.toLocaleString('en-US');}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function render(){
 var s=q.value.trim().toLowerCase(),f=fam.value,p=pth.value,st=set.value;
 var rows=D.filter(function(r){
  if(f&&r[2]!==f)return false; if(p&&r[5]!==p)return false; if(st&&r[4].setting!==st)return false;
  if(!s)return true; return (r[1]+' '+r[2]+' '+r[3]+' '+tagText(r[4])+' '+(PATHS[r[5]]||'')).toLowerCase().indexOf(s)>=0;});
 var idx={n:1,w:6,wg:7,g:8}[sortKey];
 rows.sort(function(a,b){var x=a[idx],y=b[idx];if(sortKey==='n')return dir*String(x).localeCompare(y);
  if(x==null&&y==null)return 0;if(x==null)return 1;if(y==null)return -1;return dir*(x-y);});
 body.innerHTML=rows.map(function(r){
  return '<tr><td><strong>'+esc(r[1])+'</strong>'+(r[10]?'<span class="pill">in depth</span>':'')+'<span class="sub">'+esc(r[3])+'</span><span class="sub">'+esc(r[2])+'</span></td>'
   +'<td class="num">'+fmt(r[6])+'</td><td class="num">'+(r[7]==null?'n/a':'$'+fmt(r[7]))+'</td>'
   +'<td class="num">'+(r[8]==null?'n/a':(r[8]>0?'+':'')+r[8]+'%')+'</td><td>'+esc(PATHS[r[5]]||r[5])+'</td><td>'+esc(r[9]||'')+'</td><td class="tg">'+esc(tagText(r[4]))+'</td></tr>';}).join('');
 count.textContent=rows.length+' of '+D.length+' occupations';
 document.querySelectorAll('#cmp th[aria-sort]').forEach(function(th){var b=th.querySelector('button');th.setAttribute('aria-sort',b.dataset.k===sortKey?(dir>0?'ascending':'descending'):'none');});
}
[q,fam,pth,set].forEach(function(e){e.addEventListener('input',render);});
document.querySelectorAll('#cmp th button').forEach(function(b){b.addEventListener('click',function(){var k=b.dataset.k;if(sortKey===k)dir=-dir;else{sortKey=k;dir=k==='n'?1:-1;}render();});});
render();
})();
</script>
</body>
</html>
`;
writeFileSync(join(root, 'extras', 'pick-a-trade.html'), html);
console.log('wrote extras/pick-a-trade.html', html.length, 'bytes;', articles.length, 'trades;', data.length, 'rows');
