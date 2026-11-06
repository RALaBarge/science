import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from make_unit import aid, table

HERO = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 200" role="img" aria-label="The pH scale from 0 to 14 as a colored bar: strong acid at the left, neutral 7 in the middle, strong base at the right, with example liquids above it">
  <title>The pH scale with everyday examples</title>
  <desc>A bar runs from pH 0 on the left, red, to pH 14 on the right, yellow-green. Stomach acid sits near 1.5, lemon juice near 2, black coffee near 5, pure water at 7, baking soda solution near 8.3, soap near 10 and household bleach near 12.5.</desc>
  <rect x="8" y="8" width="624" height="184" rx="16" style="fill:var(--surface);stroke:var(--line);stroke-width:2"/>
  <defs><linearGradient id="phg" x1="0" x2="1"><stop offset="0" stop-color="#d7263d"/><stop offset=".25" stop-color="#c1307e"/><stop offset=".45" stop-color="#8a4fb5"/><stop offset=".5" stop-color="#6a56c4"/><stop offset=".6" stop-color="#3f6fd8"/><stop offset=".78" stop-color="#1f9d8f"/><stop offset="1" stop-color="#c9b81c"/></linearGradient></defs>
  <rect x="40" y="96" width="560" height="28" rx="6" fill="url(#phg)" style="stroke:var(--ink);stroke-width:2"/>
  <g style="fill:var(--ink);font-size:13px;text-anchor:middle">
    <text x="40" y="144">0</text><text x="120" y="144">2</text><text x="200" y="144">4</text><text x="280" y="144">6</text><text x="320" y="144" style="font-weight:700">7</text><text x="360" y="144">8</text><text x="440" y="144">10</text><text x="520" y="144">12</text><text x="600" y="144">14</text>
  </g>
  <g style="fill:var(--muted);font-size:12px;text-anchor:middle">
    <text x="82" y="82">stomach acid</text><text x="120" y="66">lemon juice</text><text x="240" y="82">coffee</text><text x="320" y="66">pure water</text><text x="372" y="82">baking soda</text><text x="440" y="66">soap</text><text x="528" y="82">bleach</text>
  </g>
  <text x="40" y="172" style="fill:var(--ink);font-size:14px;font-weight:700">more acidic</text>
  <text x="600" y="172" text-anchor="end" style="fill:var(--ink);font-size:14px;font-weight:700">more basic</text>
  <text x="320" y="172" text-anchor="middle" style="fill:var(--muted);font-size:13px">neutral</text>
</svg>'''

SPEC = dict(
 out='7th/unit-7.10-acids-and-bases.html',
 title_tag='Acids and Bases',
 kicker='Seventh grade science · Unit 7.10',
 h1='Acids &amp; Bases',
 lede='Lemon juice is sour, soap feels slippery, and red cabbage juice changes color in both. This unit follows one number, <b>pH</b>, from the stomach to the swimming pool: what it measures, how to read it with a color change, why every step on the scale is a tenfold jump, and what happens when an acid meets a base. Use the fair-test steps from <b>Unit 0: How Science Works</b> whenever you compare two liquids.',
 bridge='Unit 7.2 showed that a chemical reaction rearranges atoms into new substances with new properties, and Unit 7.3 followed the energy. Acid-base reactions are one of the most common kinds. This unit gives you a way to measure one property of a liquid, how acidic it is, before and after a reaction.',
 hero_svg=HERO,
 concepts=[
  dict(toc='Acid, base or neutral', kicker='Acids, bases and the pH scale', h2='A scale from 0 to 14',
   idea='Liquids can be sorted by how <mark>acidic</mark> or <mark>basic</mark> they are. The <mark>pH scale</mark> gives that a number: below 7 is acidic, 7 is <mark>neutral</mark> (pure water), above 7 is basic. <b>Never taste or sniff an unknown liquid to find out.</b>',
   aids=[
    aid('analogy', 'A tug-of-war with a flag in the middle', '<p class="cap">Think of pH 7 as a flag at the center of a rope. Acids pull it toward 0 and bases pull it toward 14. Pure water is a tie, so the flag stays at 7.</p><p>The analogy breaks in one way: a liquid is not pulled by two teams. The number comes from how many hydrogen ions it has, which Concept 3 explains.</p>'),
    aid('try', 'Acid, neutral or base?', '<div class="items" id="abSort"></div><p class="score" id="abSortS">0 of 8 correct</p>'),
    aid('data', 'pH of everyday liquids (approximate)', table(['Liquid', 'pH (about)', 'Group'], [
      ['Battery acid', '0', 'Strong acid'], ['Stomach acid', '1.5 to 2', 'Strong acid'], ['Lemon juice', '2', 'Acid'], ['Vinegar', '2.5 to 3', 'Acid'],
      ['Tomato juice', '4.5', 'Weak acid'], ['Black coffee', '5', 'Weak acid'], ['Milk', '6.5', 'Slightly acidic'], ['Pure water', '7', 'Neutral'],
      ['Blood', '7.4', 'Slightly basic'], ['Seawater', '8.1', 'Slightly basic'], ['Baking soda in water', '8.3', 'Weak base'], ['Hand soap', '9 to 10', 'Base'],
      ['Household ammonia', '11 to 12', 'Strong base'], ['Bleach', '12 to 13', 'Strong base'], ['Drain cleaner (lye)', '13 to 14', 'Strong base']], 360) +
      '<p class="cap">Values are typical and vary by brand and by how diluted the liquid is. Strong acids and strong bases burn skin and eyes; some weak ones, like lemon juice, are safe to eat.</p>', True),
    aid('real', 'Properties you can notice (safely)', table(['Property', 'Acids', 'Bases'], [
      ['Taste (foods only)', 'Sour: lemon, vinegar', 'Bitter: baking soda, unsweetened cocoa'], ['Feel', 'Often thin and watery', 'Slippery, like soap'],
      ['With metals', 'Many acids react and make bubbles of hydrogen gas', 'Mostly no reaction'], ['Conducts electricity', 'Yes, when dissolved in water', 'Yes, when dissolved in water']], 400) +
      '<p class="cap">Taste and feel are only listed to explain old names. Test in a lab with an indicator, never with your tongue or fingers.</p>', True)]),
  dict(toc='Indicators', kicker='Indicators', h2='Reading pH with a color change',
   idea='An <mark>indicator</mark> is a dye that changes color with pH. <mark>Litmus</mark> is red in acid and blue in base. <mark>Red cabbage juice</mark> shows a whole rainbow, so it tells you roughly how acidic or basic a liquid is. A pH meter gives a number, and pH paper gives a color you match to a chart.',
   aids=[
    aid('analogy', 'A dye with moods', '<p class="cap">The purple molecules in red cabbage change shape when hydrogen ions are plentiful or scarce, and the new shape absorbs different colors of light. You are seeing the molecule change its shape.</p><p>Not every dye does this. Some food dyes keep the same color at every pH, so they cannot be used as indicators.</p>'),
    aid('try', 'Cabbage juice color lab', '<div class="chips" id="cbChips" role="group" aria-label="Liquid to test"></div><div class="stage"><div id="cbTube" style="height:70px;border-radius:10px;border:2px solid var(--ink)" role="img" aria-label="Color of cabbage juice with the chosen liquid"></div></div><p class="readout" id="cbR" aria-live="polite"></p>', True),
    aid('data', 'Cabbage color against pH (approximate)', table(['pH', 'Color'], [['2', 'Red'], ['4', 'Pink-purple'], ['6', 'Purple'], ['7', 'Blue-violet'], ['8', 'Blue'], ['10', 'Blue-green'], ['12', 'Yellow-green']], 280) +
      '<p class="cap">Colors in a real cup depend on the cabbage, the water and the light. Match against a color chart you make yourself, using liquids of known pH.</p>'),
    aid('real', 'Which indicator for which job', table(['Indicator', 'What you see', 'Used for'], [
      ['Litmus paper', 'Red in acid, blue in base', 'Quick yes/no test'], ['Universal indicator or pH paper', 'A color matched to a chart', 'Estimating pH to the nearest one'],
      ['Phenolphthalein', 'Colorless in acid, pink in base', 'Showing the end of a neutralization'], ['pH meter', 'A number on a screen', 'Pools, aquariums, labs']], 420), True)]),
  dict(toc='What pH measures', kicker='Hydrogen ions', h2='Each step on the scale is ten times',
   idea='In water, an <mark>acid</mark> adds <mark>hydrogen ions (H<sup>+</sup>)</mark> and a <mark>base</mark> adds <mark>hydroxide ions (OH<sup>-</sup>)</mark>. pH counts hydrogen ions on a <mark>logarithmic scale</mark>: a liquid with pH 3 has <b>10 times</b> as many as pH 4 and <b>100 times</b> as many as pH 5.',
   aids=[
    aid('analogy', 'Earthquake scale, again', '<p class="cap">Like the magnitude scale in Unit 6, one step is not one more of the same amount. It is ten times as much. A pH 2 lemon juice does not have 2 times more hydrogen ions than pH 4 vinegar; it has 100 times more.</p><p>Where it breaks: for pH, a lower number means <i>more</i> hydrogen ions, the opposite of how most scales work.</p>'),
    aid('try', 'How many times stronger?', '<div class="ctl"><label for="lgA">First liquid pH: <span id="lgAV"></span></label><input id="lgA" type="range" min="0" max="14" step="1" value="2"></div><div class="ctl"><label for="lgB">Second liquid pH: <span id="lgBV"></span></label><input id="lgB" type="range" min="0" max="14" step="1" value="5"></div><div id="lgBars" class="bars"></div><p class="readout" id="lgR" aria-live="polite"></p>', True),
    aid('data', 'Hydrogen ions per liter (moles)', table(['pH', 'H<sup>+</sup> per liter', 'Example'], [['1', '0.1', 'Stomach acid region'], ['3', '0.001', 'Vinegar region'], ['5', '0.00001', 'Black coffee'], ['7', '0.0000001', 'Pure water'], ['9', '0.000000001', 'Soap region'], ['11', '0.00000000001', 'Ammonia region']], 360) +
      '<p class="cap">A mole is a very large counting number for atoms and ions. Do not worry about the unit; notice that the number gains two zeros every two steps. A pH of 7 means 10<sup>-7</sup>.</p>', True),
    aid('real', 'Why small pH changes matter', '<p class="cap">Blood stays between about 7.35 and 7.45. A drop of only half a unit would be a medical emergency. Ocean surface water is about 8.1, and a fall of 0.1 means about 26% more hydrogen ions. Corals and shellfish notice.</p>')]),
  dict(toc='Neutralization', kicker='Acid + base', h2='Mixing an acid with a base',
   idea='When an acid and a base react, they <mark>neutralize</mark> each other. The hydrogen ions and hydroxide ions join to make <mark>water</mark>, and the other ions make a <mark>salt</mark>. Add a strong base to a strong acid a little at a time and the pH rises slowly, then jumps near 7.',
   aids=[
    aid('analogy', 'Two teams that cancel', '<p class="cap">Think of H<sup>+</sup> as one team and OH<sup>-</sup> as the other. Each pair that meets makes a water molecule and drops out of the game. When the teams are equal, the liquid is neutral. If one team has more players, the leftover ones decide whether the liquid is acidic or basic.</p>'),
    aid('try', 'Add base a little at a time', '<div class="ctl"><label for="tiV">Base added: <span id="tiVV"></span> mL (25 mL of 0.1 M hydrochloric acid in the cup)</label><input id="tiV" type="range" min="0" max="50" step="1" value="0"></div><div class="stage"><svg id="tiSvg" viewBox="0 0 480 230" role="img" aria-label="pH against milliliters of base added"></svg></div><p class="readout" id="tiR" aria-live="polite"></p>', True),
    aid('data', 'The reaction in symbols', '<p class="cap">hydrochloric acid + sodium hydroxide &rarr; sodium chloride (table salt) + water</p><p class="cap">HCl + NaOH &rarr; NaCl + H<sub>2</sub>O. Count the atoms on each side: they match (Unit 7.2).</p>'),
    aid('real', 'Neutralization at work', table(['Where', 'Acid', 'Base', 'Why'], [
      ['Heartburn', 'Stomach acid', 'Antacid tablet (calcium carbonate or magnesium hydroxide)', 'Calms excess acid'],
      ['Garden soil', 'Acidic soil', 'Lime (calcium carbonate)', 'Many plants like a pH near 6 to 7'],
      ['Lakes hit by acid rain', 'Dissolved acids from air pollution', 'Lime added to the water', 'Many fish need a pH of about 6.5 or higher'],
      ['Spill clean-up', 'Battery or lab acid', 'Baking soda', 'Safe, slow neutralizing'],
      ['Toothpaste', 'Acids made by mouth bacteria', 'Mildly basic ingredients', 'Protects enamel']], 520) +
      '<p class="cap">Rain is naturally about 5.6 because it dissolves carbon dioxide. Acid rain is usually below 5. <b>Safety:</b> never mix household cleaners; bleach mixed with acids or with ammonia makes toxic gases.</p>', True)])
 ],
 explain_q='A pool test strip shows a pH of 6. The pool should be 7.2 to 7.8. Is the water acidic or basic, would adding a small amount of baking soda or vinegar help, and how would you check that your fix worked?',
 explain_a='Acidic, since 6 is below 7. A small amount of a base (baking soda, or a pool pH increaser) would neutralize some acid and raise the pH; vinegar would lower it. Add a little, mix, wait, and test again so you change one thing at a time and can see which change worked (Unit 0).',
 glossary=[('acid', 'A substance that adds hydrogen ions (H<sup>+</sup>) when dissolved in water.'), ('base', 'A substance that adds hydroxide ions (OH<sup>-</sup>) or removes hydrogen ions in water.'),
   ('pH', 'A number that tells how acidic or basic a liquid is, on a scale of about 0 to 14.'), ('neutral', 'Neither acidic nor basic; pH 7.'), ('indicator', 'A dye that changes color depending on the pH.'),
   ('neutralization', 'The reaction of an acid with a base that makes water and a salt.'), ('salt', 'The other product of neutralization; table salt is one kind.'), ('logarithmic scale', 'A scale where each step is ten times the one before.')],
 tutor='<p><b>Kit (about $8):</b> half a red cabbage, hot water, clear cups, droppers or spoons, lemon juice, vinegar, club soda, baking soda, hand soap, antacid tablet, distilled water, pH paper (optional), goggles.</p><ul><li><b>Concept 1:</b> Sort labeled household items by predicted pH, then check with cabbage juice. No tasting.</li><li><b>Concept 2:</b> Make cabbage juice (blend or soak, strain). Test each liquid. Build a color chart from the results.</li><li><b>Concept 3:</b> Dilute vinegar 1 part in 10, then 1 in 100, and test each. Compare the color.</li><li><b>Concept 4:</b> Add baking soda solution to vinegar with cabbage juice in the cup and watch the color run from red toward blue. Do it with drops.</li></ul><p><b>Common misconceptions:</b></p><ul><li>"All acids are dangerous." Lemon juice and vinegar are safe to eat; strength matters.</li><li>"Bases are safe because they are not acids." Strong bases such as drain cleaner burn too.</li><li>"pH 6 is a little less acidic than pH 5." It has 10 times fewer hydrogen ions.</li><li>"Neutral means nothing is in it." Salt water can be neutral.</li></ul><p><b>Pacing:</b> about four 30-minute sessions. <b>Method link:</b> in Concept 4, change only one thing per trial (amount of base) and keep the acid the same.</p>',
 related_idea='Up next: <a href="unit-7.11-nutrition-health-and-disease.html">Unit 7.11: Nutrition, Health &amp; Disease</a>.',
 related=[('unit-7.2-chemical-reactions-and-matter.html', 'Unit 7.2: Chemical Reactions &amp; Matter', 'Atoms rearrange; mass is conserved.'), ('unit-7.3-chemical-reactions-and-energy.html', 'Unit 7.3: Chemical Reactions &amp; Energy', 'Reactions that release or absorb energy.'),
   ('unit-7.4-metabolic-reactions-and-the-body.html', 'Unit 7.4: Metabolic Reactions &amp; the Body', 'Digestion happens in an acidic stomach.'), ('../6th/unit-13-energy-resources-and-human-impact.html', 'Unit 13: Energy Resources &amp; Human Impact', 'Burning fuels and acid rain.'),
   ('../k-5/unit-00-how-science-works.html', 'Unit 0: How Science Works', 'The method: variables and fair tests.')],
 footer='Built for seventh-grade tutoring. Supports NGSS MS-PS1-2 (analyze data on properties before and after substances interact) and MS-PS1-5 (atoms are conserved); acids and bases are not named in NGSS, so this unit is an extension. pH values are approximate.',
 quiz=[
  dict(q='A liquid has a pH of 3. It is...', o=['Basic', 'Neutral', 'Acidic'], a=2, e='Below 7 is acidic.'),
  dict(q='Red cabbage juice turns blue-green in a clear liquid. The liquid is probably...', o=['A strong acid', 'Neutral water', 'A base'], a=2, e='Blue and green mean pH above 7.'),
  dict(q='How many times more hydrogen ions does pH 3 have than pH 5?', o=['2 times', '10 times', '100 times'], a=2, e='Each step is 10 times, and two steps make 100.'),
  dict(q='When an acid and a base neutralize each other, the products are...', o=['Hydrogen gas only', 'Water and a salt', 'Two new acids'], a=1, e='H+ and OH- make water; the other ions form a salt.'),
  dict(q='Why can you eat lemon juice but not drain cleaner?', o=['Lemon juice has no pH', 'Strength matters: lemon juice is a weak acid and drain cleaner is a strong base', 'Bases are never dangerous'], a=1, e='How strong a substance is matters as much as which side of 7 it is on.'),
  dict(q='A lake has a pH of 5. Which fix is most sensible?', o=['Add vinegar', 'Add lime (a base) a little at a time', 'Add more rain'], a=1, e='A base raises the pH. Add small amounts and test again.')],
 js=[
  '''quizBox($('#abSort'),$('#abSortS'),[
 {n:'Lemon juice',a:0,e:'pH about 2: acid.'},{n:'Pure water',a:1,e:'pH 7: neutral.'},{n:'Baking soda in water',a:2,e:'pH about 8.3: base.'},{n:'Vinegar',a:0,e:'pH about 2.5 to 3: acid.'},
 {n:'Hand soap',a:2,e:'pH 9 to 10: base.'},{n:'Black coffee',a:0,e:'pH about 5: weak acid.'},{n:'Bleach',a:2,e:'pH 12 to 13: strong base.'},{n:'Milk',a:0,e:'pH about 6.5: slightly acidic.'}],['Acid','Neutral','Base']);''',
  '''const L=[{n:'Lemon juice',p:2,c:'#d7263d'},{n:'Vinegar',p:2.8,c:'#d4305c'},{n:'Black coffee',p:5,c:'#a24a9e'},{n:'Pure water',p:7,c:'#6a56c4'},{n:'Baking soda in water',p:8.3,c:'#3a74d8'},{n:'Hand soap',p:9.5,c:'#2a88b0'},{n:'Household ammonia',p:11.5,c:'#4aa58a'},{n:'Bleach (never test alone)',p:12.5,c:'#c9b81c'}];
const chips=$('#cbChips'), tube=$('#cbTube'), rd=$('#cbR'); mkChips(chips,L.map(x=>x.n),0);
const d=i=>{ const x=L[i]; tube.style.background=x.c; rd.innerHTML=`<b>${x.n}</b> has a pH of about <b>${x.p}</b>, so the cabbage juice looks about this color. ${x.p<7?'Acidic.':x.p>7?'Basic.':'Neutral.'}`; };
chipsOn(chips,d); d(0);''',
  '''const A=$('#lgA'), B=$('#lgB'), bx=$('#lgBars'), rd=$('#lgR');
const d=()=>{ const a=+A.value, b=+B.value; $('#lgAV').textContent=a; $('#lgBV').textContent=b;
 const ha=Math.pow(10,-a), hb=Math.pow(10,-b), mx=Math.max(ha,hb);
 bars(bx,[['Liquid 1, pH '+a,ha,ha.toExponential(0)+' per L','a'],['Liquid 2, pH '+b,hb,hb.toExponential(0)+' per L','t']],{labW:130,max:mx*1.05});
 const k=Math.abs(a-b); rd.innerHTML= k===0?'Same pH, same amount of hydrogen ions.': `The pH ${Math.min(a,b)} liquid has <b>${Math.pow(10,k).toLocaleString()} times</b> as many hydrogen ions as the pH ${Math.max(a,b)} liquid.`; };
A.addEventListener('input',d); B.addEventListener('input',d); d();''',
  '''const sl=$('#tiV'), svg=$('#tiSvg'), rd=$('#tiR');
const ph=v=>{ const d=(25*0.1-v*0.1)/(25+v); if(Math.abs(d)<1e-9) return 7; return d>0?-Math.log10(d):14+Math.log10(-d); };
const d=()=>{ const v=+sl.value; $('#tiVV').textContent=v; const pts=[]; for(let x=0;x<=50;x+=0.5) pts.push([x,ph(x)]);
 line(svg,{W:480,H:230,L:50,x0:0,x1:50,y0:0,y1:14,yt:[0,3.5,7,10.5,14],xt:[0,10,20,30,40,50],xl:'mL of base added',yl:'pH',series:[{pts,color:'var(--absorb)'}],hl:[[7,'neutral','var(--reflect)']],mark:[v,ph(v)]});
 const p=ph(v); rd.innerHTML= v===25? `Exactly equal amounts: <b>pH 7</b>, neutral. Hydrogen ions and hydroxide ions have paired off completely.`: `After <b>${v} mL</b> the pH is about <b>${p.toFixed(1)}</b> (${p<7?'still acidic: acid left over':'basic: base left over'}). Notice how little it moves at first and how fast it jumps near 25 mL.`; };
sl.addEventListener('input',d); d();''']
)
