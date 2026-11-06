import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from make_unit import aid, table

HERO = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 210" role="img" aria-label="A dot plot of plant heights with the mean and median marked, and one outlier far to the right">
  <title>Center and spread on a dot plot</title>
  <desc>Dots stack above a number line from 10 to 40 centimeters. Most dots cluster between 14 and 22. One dot sits at 38. A line marks the median near 18 and another marks the mean near 21, pulled right by the outlier.</desc>
  <rect x="8" y="8" width="624" height="194" rx="16" style="fill:var(--surface);stroke:var(--line);stroke-width:2"/>
  <path d="M50 160 H600" style="stroke:var(--ink);stroke-width:2"/>
  <g style="fill:var(--muted);font-size:12px;text-anchor:middle"><text x="50" y="180">10</text><text x="187" y="180">20</text><text x="325" y="180">25</text><text x="462" y="180">30</text><text x="600" y="180">40</text></g>
  <g style="fill:var(--reflect)">
    <circle cx="105" cy="148" r="8"/><circle cx="118" cy="148" r="8"/><circle cx="118" cy="132" r="8"/><circle cx="132" cy="148" r="8"/><circle cx="132" cy="132" r="8"/><circle cx="132" cy="116" r="8"/>
    <circle cx="146" cy="148" r="8"/><circle cx="146" cy="132" r="8"/><circle cx="160" cy="148" r="8"/><circle cx="160" cy="132" r="8"/><circle cx="173" cy="148" r="8"/><circle cx="187" cy="148" r="8"/>
    <circle cx="214" cy="148" r="8"/>
  </g>
  <circle cx="560" cy="148" r="8" style="fill:var(--absorb)"/>
  <path d="M150 40 V160" style="stroke:var(--transmit);stroke-width:3;stroke-dasharray:6 4"/><text x="146" y="34" text-anchor="end" style="fill:var(--transmit);font-size:13px;font-weight:700">median</text>
  <path d="M200 60 V160" style="stroke:var(--beam);stroke-width:3;stroke-dasharray:6 4"/><text x="204" y="54" style="fill:var(--beam);font-size:13px;font-weight:700">mean</text>
  <text x="560" y="124" text-anchor="middle" style="fill:var(--absorb);font-size:13px;font-weight:700">outlier</text>
</svg>'''

SPEC = dict(
 out='6th/unit-15-data-and-statistics.html',
 title_tag='Data and Statistics',
 kicker='Sixth grade science · Unit 15',
 h1='Data &amp; Statistics',
 lede='Science runs on numbers, but a pile of numbers says nothing until you summarize and graph it. This unit teaches the tools every other unit leans on: the <b>center</b> of a data set (mean, median, mode), its <b>spread</b>, the right <b>graph</b> for the job, and how <b>sample size</b> changes how much you can trust a result. It can be taught any time after Unit 0.',
 bridge='Unit 0 taught fair tests and repeated trials. This unit is the next step: once you have several measurements, how do you describe them honestly? Later units, like climate (Unit 8.11) and health evidence (Unit 7.11), use these tools.',
 hero_svg=HERO,
 concepts=[
  dict(toc='Center', kicker='Center', h2='Mean, median and mode',
   idea='The <mark>mean</mark> is the sum divided by the count, the <mark>median</mark> is the middle value when the data are in order, and the <mark>mode</mark> is the most common value. An <mark>outlier</mark>, a value far from the rest, drags the mean a lot and the median only a little.',
   aids=[
    aid('analogy', 'A seesaw and a line', '<p class="cap">The mean is the balance point of a seesaw loaded with the data. The median is a line of people sorted by height, with you picking the one in the middle.</p><p>A single very heavy person on the end moves the balance point, but not the person in the middle of the line.</p>'),
    aid('try', 'Add an outlier', '<div class="chips" id="ctChips" role="group" aria-label="Data set"></div><div class="chips" id="ctOut" role="group" aria-label="Outlier"></div><div class="stage"><svg id="ctSvg" viewBox="0 0 480 190" role="img" aria-label="Dot plot with the mean and median marked"></svg></div><p class="readout" id="ctR" aria-live="polite"></p>', True),
    aid('data', 'Which to use', table(['Measure', 'Best for', 'Watch out for'], [['Mean', 'Data without extreme values; uses every number', 'Pulled by outliers'], ['Median', 'Skewed data or outliers, like house prices', 'Ignores how far extremes are'], ['Mode', 'Categories or repeated values, like shoe size', 'May not exist or may not be unique']], 520), True),
    aid('real', 'Mean or median?', '<div class="items" id="mmSort"></div><p class="score" id="mmSortS">0 of 5 correct</p>')]),
  dict(toc='Spread', kicker='Spread', h2='Two sets can share a mean and still differ',
   idea='<mark>Spread</mark> tells how far values are from each other. The <mark>range</mark> is largest minus smallest. The <mark>interquartile range (IQR)</mark> is the width of the middle half. The <mark>mean absolute deviation (MAD)</mark> is the average distance from the mean. Small spread means measurements agree; large spread means more variation or less careful measuring.',
   aids=[
    aid('analogy', 'Archery targets', '<p class="cap">Two archers can average the center of the target. One lands all arrows close together and the other scatters them. The mean is the same; the spread is not.</p>'),
    aid('try', 'Compare two plant groups', '<div class="chips" id="spChips" role="group" aria-label="Group"></div><div class="stage"><svg id="spSvg" viewBox="0 0 480 190" role="img" aria-label="Dot plots of two groups with the same mean"></svg></div><p class="readout" id="spR" aria-live="polite"></p>', True),
    aid('data', 'Computing spread by hand', table(['Step', 'Example: 4, 6, 8, 10, 12'], [['Mean', '(4+6+8+10+12)/5 = 8'], ['Distances from mean', '4, 2, 0, 2, 4'], ['MAD', '(4+2+0+2+4)/5 = 2.4'], ['Range', '12 - 4 = 8'], ['Median', '8; lower half 4, 6 (median 5), upper half 10, 12 (median 11); IQR = 11 - 5 = 6']], 520) +
      '<p class="cap">Quartiles are found by splitting at the median and taking the median of each half.</p>', True),
    aid('real', 'Why spread matters in science', '<p class="cap">When you time a falling ball five times and get 0.62, 0.63, 0.61, 0.62, 0.64 seconds, the spread is small: the measurement is reliable. If you get 0.4, 0.9, 0.6, 1.1, 0.5, you cannot trust the mean to be close to the truth.</p>')]),
  dict(toc='Graphs', kicker='Choosing a graph', h2='The question decides the graph',
   idea='Pick a graph by what you want to show: a <mark>bar graph</mark> compares categories, a <mark>histogram</mark> shows how a number is distributed in bins, a <mark>line graph</mark> shows change over time, a <mark>scatter plot</mark> shows how two numbers relate, and a <mark>dot plot</mark> shows every value in a small set. A graph can mislead if its axis is trimmed or its scale is stretched.',
   aids=[
    aid('analogy', 'Tools in a toolbox', '<p class="cap">A hammer is great for nails and bad for screws. No graph is best for every job.</p>'),
    aid('try', 'Honest or trimmed axis?', '<div class="chips" id="axChips" role="group" aria-label="Axis"></div><div class="stage"><svg id="axSvg" viewBox="0 0 480 220" role="img" aria-label="Bar graph of two values with a full or trimmed vertical axis"></svg></div><p class="readout" id="axR" aria-live="polite"></p>', True),
    aid('data', 'Graph chooser', table(['You want to show', 'Use', 'Example'], [['Compare amounts in categories', 'Bar graph', 'Rainfall in four cities'], ['Show how data spread across ranges', 'Histogram', 'Heights of 30 students in 5 cm bins'], ['Show change over time', 'Line graph', 'Daily temperature for a month'], ['Show if two numbers are related', 'Scatter plot', 'Ramp height versus roll distance'], ['Show every value in a small set', 'Dot plot', 'Five plant heights']], 560), True),
    aid('real', 'Which graph?', '<div class="items" id="gcSort"></div><p class="score" id="gcSortS">0 of 5 correct</p>')]),
  dict(toc='Sample size', kicker='Samples and trials', h2='More trials mean more trust',
   idea='A <mark>sample</mark> is the part you measure. A larger, <mark>random</mark> sample usually gives a result closer to the truth. Repeating a test and averaging smooths out luck. If a value looks like a mistake, find out why before dropping it; never delete numbers just because they are inconvenient.',
   aids=[
    aid('analogy', 'Tasting a soup', '<p class="cap">One spoonful from a well-stirred pot tells you about the pot. One spoonful from the top, before stirring, might not. A random, well-mixed sample represents the whole.</p>'),
    aid('try', 'Flip a coin many times', '<div class="chips" id="smChips" role="group" aria-label="Number of flips"></div><div class="chips" id="smAgain" role="group" aria-label="Run"></div><div class="stage"><svg id="smSvg" viewBox="0 0 480 190" role="img" aria-label="Share of heads for several runs with the chosen number of flips"></svg></div><p class="readout" id="smR" aria-live="polite"></p>', True),
    aid('data', 'What sample size does', table(['Flips per run', 'Typical range for share of heads (about 95% of runs)'], [['10', '20% to 80%'], ['100', '40% to 60%'], ['1,000', '47% to 53%'], ['10,000', '49% to 51%']], 420) +
      '<p class="cap">The range shrinks as the sample size grows, about in proportion to one over the square root of the number of flips. A fair coin has a true share of 50%.</p>', True),
    aid('real', 'Real-world samples', table(['Question', 'Weak sample', 'Better sample'], [['Do students like the lunch menu?', 'Ask three friends', 'Ask a random 10% of each grade'], ['Does fertilizer help plants?', 'One pot each', 'Ten pots each, same soil and light'], ['Is the creek polluted?', 'One scoop on one day', 'Several spots, several days']], 560), True)])
 ],
 explain_q='Two classes tested the same paper airplane. Class A threw it 5 times (mean 8.2 m, range 3 m). Class B threw it 50 times (mean 7.6 m, range 5 m). Which result do you trust more, and what would you do next?',
 explain_a='Class B\'s mean rests on 10 times as many throws, so it is more reliable even though its range is larger (more throws means more chances for extreme throws). I would repeat the test, check that both classes threw the same way, and look at a graph of all the throws before deciding which mean to use.',
 glossary=[('mean', 'The sum of the values divided by how many there are.'), ('median', 'The middle value of a list in order.'), ('mode', 'The most common value.'), ('outlier', 'A value far from the others.'), ('range', 'Largest value minus smallest.'),
   ('interquartile range', 'The width of the middle half of the data.'), ('sample', 'The part of a group you actually measure.'), ('mean absolute deviation', 'The average distance of the values from the mean.')],
 tutor='<p><b>Kit:</b> graph paper, rulers, coins, a stopwatch, bean seeds or paper airplanes, a spreadsheet if available.</p><ul><li><b>Concept 1:</b> Measure the class\'s hand spans; find mean, median and mode; add the teacher as an outlier (or a made-up data point) and recompute.</li><li><b>Concept 2:</b> Time a falling object 10 times; compute range and MAD.</li><li><b>Concept 3:</b> Graph the same data as a bar graph with and without a trimmed axis.</li><li><b>Concept 4:</b> Flip a coin 10 times, then pool the class for 300 flips.</li></ul><p><b>Common misconceptions:</b></p><ul><li>"The mean is always the best average." Not with outliers.</li><li>"A bigger range always means worse data." More trials make the range larger, even when the data are fine.</li><li>"If heads came up 7 times in 10, the coin is unfair." Small samples vary.</li><li>"Delete outliers." Check first.</li></ul><p><b>Pacing:</b> about four 30-minute sessions. <b>Method link:</b> pair with Unit 0 on repeated trials.</p>',
 related_idea='This unit supports every other unit that uses data. Try it with <a href="../8th/unit-8.11-climate-evidence-and-change.html">Unit 8.11: Climate Evidence &amp; Change</a> or <a href="../7th/unit-7.11-nutrition-health-and-disease.html">Unit 7.11: Nutrition, Health &amp; Disease</a>.',
 related=[('../k-5/unit-00-how-science-works.html', 'Unit 0: How Science Works', 'Fair tests and repeated trials.'), ('unit-03-forces-motion-and-energy.html', 'Unit 3: Forces, Motion &amp; Energy', 'Speed from distance and time data.'),
   ('../7th/unit-7.3-chemical-reactions-and-energy.html', 'Unit 7.3: Chemical Reactions &amp; Energy', 'Iterating on a design.'), ('../8th/unit-8.11-climate-evidence-and-change.html', 'Unit 8.11: Climate Evidence &amp; Change', 'Long data records.'),
   ('../7th/unit-7.11-nutrition-health-and-disease.html', 'Unit 7.11: Nutrition, Health &amp; Disease', 'Evidence for health claims.')],
 footer='Built for sixth-grade tutoring. Supports the NGSS science and engineering practice "Analyzing and Interpreting Data" and the grade 6 statistics and probability standards in the Common Core (6.SP). Example numbers are made up for teaching.',
 quiz=[
  dict(q='The mean of 3, 5, 7 and 13 is...', o=['5', '7', '9'], a=1, e='(3 + 5 + 7 + 13) / 4 = 28 / 4 = 7.'),
  dict(q='The median of 2, 3, 5, 9, 11 is...', o=['3', '5', '6'], a=1, e='The middle value of five is the third: 5.'),
  dict(q='A data set has one extreme value. Which measure moves the most?', o=['Median', 'Mean', 'Mode'], a=1, e='The mean uses every value, so an outlier pulls it.'),
  dict(q='Which graph best shows how temperature changed over a week?', o=['Pie chart', 'Line graph', 'Scatter plot of two unrelated things'], a=1, e='A line graph shows change over time.'),
  dict(q='A bar graph starts its vertical axis at 90 instead of 0. This...', o=['Makes differences look bigger than they are', 'Makes the data more accurate', 'Has no effect'], a=0, e='A trimmed axis exaggerates differences.'),
  dict(q='You flip a coin 10 times and get 7 heads. Is the coin unfair?', o=['Yes, definitely', 'Not necessarily; 10 flips is a small sample', 'No, 7 heads is impossible'], a=1, e='Small samples often stray from the true 50%.')],
 js=[
  '''const DS=[{n:'Plant heights (cm)',v:[14,15,15,16,16,16,17,17,18,18,19,20,22]},{n:'Bean seed masses (g)',v:[0.38,0.41,0.42,0.42,0.44,0.45,0.45,0.46,0.48]},{n:'Test times (s)',v:[0.61,0.62,0.62,0.63,0.63,0.64,0.65]}];
const OUT=[null,[38,1.2,2.4]];
const chips=$('#ctChips'), oc=$('#ctOut'), svg=$('#ctSvg'), rd=$('#ctR'); mkChips(chips,DS.map(x=>x.n),0); mkChips(oc,['No outlier','Add an outlier'],0); let di=0,oi=0;
const stats=v=>{ const s=[...v].sort((a,b)=>a-b), n=s.length, mean=s.reduce((a,b)=>a+b,0)/n, med=n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2; return {mean,med,s}; };
function dots(svg,vals,lo,hi,marks){ const W=480,L=30,R=450,Y=150,r=7; const X=v=>L+(v-lo)/(hi-lo)*(R-L); const pos={}; let h='';
 h+=`<line x1="${L}" y1="${Y}" x2="${R}" y2="${Y}" style="stroke:var(--ink);stroke-width:2"/>`;
 for(let i=0;i<=4;i++){ const v=lo+(hi-lo)*i/4; h+=`<text x="${X(v)}" y="${Y+18}" font-size="12" text-anchor="middle">${+v.toFixed(2)}</text>`; }
 vals.forEach(v=>{ const k=Math.round(X(v)/(r*1.6)); pos[k]=(pos[k]||0)+1; h+=`<circle cx="${X(v)}" cy="${Y-r-(pos[k]-1)*(r*1.9)}" r="${r}" style="fill:var(--reflect);fill-opacity:.85"/>`; });
 (marks||[]).forEach(m=>{ h+=`<line x1="${X(m[0])}" y1="${Y+2}" x2="${X(m[0])}" y2="${m[3]||20}" style="stroke:${m[2]};stroke-width:3;stroke-dasharray:6 4"/><text x="${X(m[0])+(m[1]==='mean'?6:-6)}" y="${(m[3]||20)+4}" font-size="12" text-anchor="${m[1]==='mean'?'start':'end'}" fill="${m[2]}">${m[1]}</text>`; });
 svg.innerHTML=h; }
const d=()=>{ let v=[...DS[di].v]; if(oi) v.push(di===0?38:di===1?0.9:1.2); const st=stats(v); const lo=Math.min(...v), hi=Math.max(...v), pad=(hi-lo)*0.08;
 dots(svg,v,lo-pad,hi+pad,[[st.med,'median','var(--transmit)',30],[st.mean,'mean','var(--beam)',16]]);
 const f=x=>+x.toFixed(2); rd.innerHTML=`Mean <b>${f(st.mean)}</b>, median <b>${f(st.med)}</b>. ${oi? 'With the outlier the mean moved by <b>'+f(st.mean-stats(DS[di].v).mean)+'</b> while the median moved by <b>'+f(st.med-stats(DS[di].v).med)+'</b>.':'Add an outlier to see which one moves more.'}`; };
chipsOn(chips,i=>{di=i;d();}); chipsOn(oc,i=>{oi=i;d();}); d();''',
  '''quizBox($('#mmSort'),$('#mmSortS'),[
 {n:'Typical house price in a town with a few mansions',a:1,e:'The mansions pull the mean up; the median is fairer.'},{n:'Average of five quiz scores that are all close',a:0,e:'No extreme values: the mean works well.'},
 {n:'Typical salary in a company with one very high CEO pay',a:1,e:'One huge value drags the mean; use the median.'},{n:'Average time for a falling ball in 10 careful trials',a:0,e:'Clean, repeated data: mean.'},
 {n:'Most common shoe size in a class',a:2,e:'Most common value: mode.'}],['Mean','Median','Mode']);''',
  '''const G=[{n:'Group A',v:[17,18,19,20,20,21,22,23]},{n:'Group B',v:[10,13,17,20,20,23,27,30]}];
const chips=$('#spChips'), svg=$('#spSvg'), rd=$('#spR'); mkChips(chips,['Group A','Group B','Both'],2);
const st=v=>{ const m=v.reduce((a,b)=>a+b,0)/v.length; return {m, mad:v.reduce((a,b)=>a+Math.abs(b-m),0)/v.length, rng:Math.max(...v)-Math.min(...v)}; };
const row=(g,y,c)=>{ let h=''; const X=v=>30+(v-8)/24*420; const cnt={}; g.v.forEach(v=>{ cnt[v]=(cnt[v]||0)+1; h+=`<circle cx="${X(v)}" cy="${y-7-(cnt[v]-1)*13}" r="6" style="fill:${c};fill-opacity:.85"/>`; });
 h+=`<line x1="30" y1="${y}" x2="450" y2="${y}" style="stroke:var(--ink);stroke-width:2"/><line x1="${X(st(g.v).m)}" y1="${y+2}" x2="${X(st(g.v).m)}" y2="${y-52}" style="stroke:var(--beam);stroke-width:3;stroke-dasharray:6 4"/><text x="34" y="${y-48}" font-size="12">${g.n}</text>`; return h; };
const d=i=>{ let h='', y=70; if(i===0||i===2){ h+=row(G[0],y,'var(--reflect)'); y+=80; } if(i===1||i===2){ h+=row(G[1],i===1?70:y,'var(--absorb)'); }
 [10,20,30].forEach(v=>{ h+=`<text x="${30+(v-8)/24*420}" y="${i===2?178:90}" font-size="11" text-anchor="middle" fill="var(--muted)">${v}</text>`; });
 svg.innerHTML=h; const a=st(G[0].v), b=st(G[1].v); const f=x=>+x.toFixed(1);
 rd.innerHTML= i===0? `Group A: mean <b>${f(a.m)}</b>, range <b>${a.rng}</b>, MAD <b>${f(a.mad)}</b>.` : i===1? `Group B: mean <b>${f(b.m)}</b>, range <b>${b.rng}</b>, MAD <b>${f(b.mad)}</b>.` :
  `Both groups have a mean of <b>${f(a.m)}</b>. Group A has range <b>${a.rng}</b> and MAD <b>${f(a.mad)}</b>; Group B has range <b>${b.rng}</b> and MAD <b>${f(b.mad)}</b>. Same center, very different spread.`; };
chipsOn(chips,d); d(2);''',
  '''const chips=$('#axChips'), svg=$('#axSvg'), rd=$('#axR'); mkChips(chips,['Starts at 0 (honest)','Starts at 90 (trimmed)'],0);
const d=i=>{ const lo=i?90:0, hi=i?100:100, A=92, B=96, Y=lo=>0; const H=150, y=v=>180-(v-lo)/(hi-lo)*H;
 svg.innerHTML=`<line x1="50" y1="180" x2="440" y2="180" style="stroke:var(--ink);stroke-width:2"/><line x1="50" y1="25" x2="50" y2="180" style="stroke:var(--ink);stroke-width:2"/>
 <text x="44" y="${y(lo)+4}" font-size="12" text-anchor="end">${lo}</text><text x="44" y="${y(hi)+4}" font-size="12" text-anchor="end">${hi}</text>
 <rect x="110" y="${y(A)}" width="90" height="${180-y(A)}" style="fill:var(--reflect)"/><rect x="270" y="${y(B)}" width="90" height="${180-y(B)}" style="fill:var(--absorb)"/>
 <text x="155" y="198" font-size="12" text-anchor="middle">Brand A: 92</text><text x="315" y="198" font-size="12" text-anchor="middle">Brand B: 96</text>`;
 rd.innerHTML= i? 'With the axis starting at 90, Brand B\\u2019s bar looks <b>three times</b> as tall as A\\u2019s, even though 96 is only about 4% more than 92.' : 'With the axis starting at 0, the bars look nearly the same height, which matches the real difference of 96 versus 92.'; };
chipsOn(chips,d); d(0);''',
  '''quizBox($('#gcSort'),$('#gcSortS'),[
 {n:'Daily temperature for a month',a:2,e:'Change over time: line graph.'},{n:'Number of students choosing each lunch option',a:0,e:'Categories: bar graph.'},
 {n:'Ramp height against how far the cart rolled',a:3,e:'Two numbers that may be related: scatter plot.'},{n:'Heights of 30 students grouped in 5 cm bins',a:1,e:'How a number is spread across ranges: histogram.'},
 {n:'Five plant heights',a:4,e:'A few values, all shown: dot plot.'}],['Bar graph','Histogram','Line graph','Scatter plot','Dot plot']);''',
  '''function rng(seed){ let s=seed>>>0; return ()=>{ s=(s+0x6D2B79F5)>>>0; let t=s; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }; }
const N=[10,100,1000], chips=$('#smChips'), again=$('#smAgain'), svg=$('#smSvg'), rd=$('#smR'); mkChips(chips,N.map(n=>n+' flips'),0); mkChips(again,['New runs'],0); let ni=0, seed=7;
const d=()=>{ const r=rng(seed*997+ni), n=N[ni], runs=[]; for(let k=0;k<12;k++){ let h=0; for(let i=0;i<n;i++) if(r()<0.5) h++; runs.push(h/n*100); }
 const lo=0,hi=100,X=v=>30+(v-lo)/(hi-lo)*420; let h=`<line x1="30" y1="150" x2="450" y2="150" style="stroke:var(--ink);stroke-width:2"/><line x1="${X(50)}" y1="20" x2="${X(50)}" y2="150" style="stroke:var(--beam);stroke-width:3;stroke-dasharray:6 4"/><text x="${X(50)+4}" y="30" font-size="12">true 50%</text>`;
 [0,25,50,75,100].forEach(v=>{ h+=`<text x="${X(v)}" y="170" font-size="12" text-anchor="middle">${v}%</text>`; });
 const c={}; runs.forEach(v=>{ const k=Math.round(v); c[k]=(c[k]||0)+1; h+=`<circle cx="${X(v)}" cy="${142-(c[k]-1)*13}" r="6" style="fill:var(--reflect);fill-opacity:.85"/>`; });
 svg.innerHTML=h; const mn=Math.min(...runs), mx=Math.max(...runs);
 rd.innerHTML=`Twelve runs of <b>${n}</b> flips: the share of heads ranged from <b>${mn.toFixed(0)}%</b> to <b>${mx.toFixed(0)}%</b>. Press <b>New runs</b> to try again.`; };
chipsOn(chips,i=>{ni=i;d();}); again.addEventListener('click',()=>{seed++;d();}); d();''']
)
