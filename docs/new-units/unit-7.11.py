import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from make_unit import aid, table

HERO = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 220" role="img" aria-label="Three ways the body stays healthy: food gives fuel and building materials, defenses block and fight germs, and evidence helps people choose what to do">
  <title>Food, defenses and evidence</title>
  <desc>Three panels. The first shows a plate with a share for each nutrient group. The second shows a germ stopped by skin, mucus and white blood cells. The third shows a small bar chart comparing two groups, a way to judge evidence.</desc>
  <rect x="8" y="8" width="624" height="204" rx="16" style="fill:var(--surface);stroke:var(--line);stroke-width:2"/>
  <g transform="translate(40 30)">
    <circle cx="80" cy="80" r="64" style="fill:var(--surface-2);stroke:var(--ink);stroke-width:2"/>
    <path d="M80 80 L80 16 A64 64 0 0 1 144 80 Z" style="fill:var(--absorb);fill-opacity:.8"/>
    <path d="M80 80 L144 80 A64 64 0 0 1 80 144 Z" style="fill:var(--transmit);fill-opacity:.8"/>
    <path d="M80 80 L80 144 A64 64 0 0 1 16 80 Z" style="fill:var(--beam);fill-opacity:.85"/>
    <path d="M80 80 L16 80 A64 64 0 0 1 80 16 Z" style="fill:var(--reflect);fill-opacity:.8"/>
    <text x="80" y="176" text-anchor="middle" style="fill:var(--ink);font-size:14px;font-weight:700">Fuel and building blocks</text>
  </g>
  <g transform="translate(250 30)">
    <path d="M10 60 H140" style="stroke:var(--ink);stroke-width:5;stroke-linecap:round"/>
    <path d="M10 82 H140" style="stroke:var(--reflect);stroke-width:5;stroke-linecap:round;stroke-dasharray:6 6"/>
    <circle cx="150" cy="40" r="12" style="fill:var(--absorb)"/><circle cx="150" cy="40" r="22" style="fill:none;stroke:var(--absorb);stroke-width:2;stroke-dasharray:3 4"/>
    <circle cx="70" cy="125" r="16" style="fill:var(--surface);stroke:var(--transmit);stroke-width:3"/><circle cx="70" cy="125" r="6" style="fill:var(--transmit)"/>
    <text x="80" y="176" text-anchor="middle" style="fill:var(--ink);font-size:14px;font-weight:700">Barriers and defenses</text>
  </g>
  <g transform="translate(450 30)">
    <path d="M18 140 H160 M18 140 V10" style="fill:none;stroke:var(--ink);stroke-width:2"/>
    <rect x="40" y="40" width="38" height="100" style="fill:var(--absorb);fill-opacity:.85"/><rect x="100" y="104" width="38" height="36" style="fill:var(--transmit);fill-opacity:.85"/>
    <text x="59" y="156" text-anchor="middle" style="fill:var(--muted);font-size:12px">no vaccine</text><text x="119" y="156" text-anchor="middle" style="fill:var(--muted);font-size:12px">vaccine</text>
    <text x="85" y="176" text-anchor="middle" style="fill:var(--ink);font-size:14px;font-weight:700">Evidence for choices</text>
  </g>
</svg>'''

SPEC = dict(
 out='7th/unit-7.11-nutrition-health-and-disease.html',
 title_tag='Nutrition, Health and Disease',
 kicker='Seventh grade science · Unit 7.11',
 h1='Nutrition, Health &amp; Disease',
 lede='A body is a system that needs fuel, building materials, rest, and defenses. This unit starts with food and energy, moves to the habits that keep a body working, then follows germs, defenses and vaccines, and finishes with how to tell a good health claim from a weak one. It is science for understanding your body, not medical advice: questions about your own health go to a doctor or nurse.',
 bridge='Unit 6.9 showed body systems working together, and Unit 7.4 followed food through digestion and cellular respiration. This unit uses those ideas to ask what the body needs, what goes wrong when it is missing, and how people have used evidence to fight disease.',
 hero_svg=HERO,
 concepts=[
  dict(toc='Nutrients and energy', kicker='Nutrients and energy', h2='What food is made of and what it does',
   idea='Food supplies <mark>nutrients</mark>: <mark>carbohydrates</mark> and <mark>fats</mark> mostly as fuel, <mark>proteins</mark> mostly as building material, <mark>vitamins</mark> and <mark>minerals</mark> in tiny amounts for body chemistry, plus <mark>water</mark> and <mark>fiber</mark>. Energy in food is counted in <mark>Calories</mark> (kilocalories): carbohydrate and protein give about 4 per gram, fat about 9.',
   aids=[
    aid('analogy', 'A house under repair', '<p class="cap">Fuel is the electricity bill, protein is lumber and nails, and vitamins and minerals are the tools. Skip any of them and the work slows down.</p><p>It breaks down because the body can turn some nutrients into others, and a house cannot turn tools into lumber.</p>'),
    aid('try', 'Calorie counter', '<div class="ctl"><label for="ncC">Carbohydrate: <span id="ncCV"></span> g</label><input id="ncC" type="range" min="0" max="150" step="5" value="60"></div><div class="ctl"><label for="ncP">Protein: <span id="ncPV"></span> g</label><input id="ncP" type="range" min="0" max="80" step="5" value="25"></div><div class="ctl"><label for="ncF">Fat: <span id="ncFV"></span> g</label><input id="ncF" type="range" min="0" max="80" step="5" value="25"></div><div id="ncBars" class="bars"></div><p class="readout" id="ncR" aria-live="polite"></p>', True),
    aid('data', 'Nutrients at a glance', table(['Nutrient', 'Main job', 'Food examples', 'Energy per gram'], [
      ['Carbohydrate', 'Quick fuel', 'Bread, rice, fruit, potatoes', '4 Calories'], ['Fat', 'Stored fuel, cell membranes', 'Oil, nuts, butter, fish', '9 Calories'],
      ['Protein', 'Growth and repair of tissues', 'Beans, eggs, meat, tofu', '4 Calories'], ['Vitamins and minerals', 'Help body chemistry work', 'Fruit, vegetables, dairy, grains', 'None'],
      ['Water', 'Carries nutrients, cools the body', 'Water, milk, fruit', 'None'], ['Fiber', 'Keeps digestion moving', 'Whole grains, beans, vegetables', 'Little']], 520) +
      '<p class="cap">Daily energy needs depend on age, size and activity. For an 11 to 14 year old they run roughly 1,800 to 2,600 Calories.</p>', True),
    aid('real', 'Reading a food label', '<p class="cap">The label lists serving size first; every number is for <b>one serving</b>, not the whole package. Check Calories, then added sugars, sodium and fiber. Ingredients are listed from most to least by weight.</p>')]),
  dict(toc='Staying healthy', kicker='Balance, sleep and activity', h2='What a body needs over time',
   idea='A <mark>balanced diet</mark> includes foods from every group in amounts that match your energy use. Missing a nutrient for a long time causes a <mark>deficiency</mark>. Sleep and physical activity matter too; most health agencies suggest about 9 to 12 hours of sleep for ages 6 to 12 and 8 to 10 for teens, and at least 60 minutes of activity a day.',
   aids=[
    aid('analogy', 'A phone battery', '<p class="cap">Food charges the battery, activity uses it, and sleep is the overnight charge when repairs happen. Running it flat day after day makes everything work badly.</p>'),
    aid('try', 'Missing nutrient detective', '<div class="chips" id="dfChips" role="group" aria-label="Deficiency"></div><p class="readout" id="dfR" aria-live="polite"></p>', True),
    aid('data', 'Deficiency diseases and where the nutrient comes from', table(['Missing nutrient', 'What can go wrong', 'Where it comes from'], [
      ['Vitamin C', 'Scurvy: bleeding gums, slow healing', 'Citrus, strawberries, peppers'], ['Iron', 'Anemia: tired, pale, short of breath', 'Beans, red meat, spinach, fortified cereal'],
      ['Vitamin D', 'Rickets in children: soft, bent bones', 'Sunlight on skin, fortified milk, fish'], ['Iodine', 'Goiter: swollen thyroid in the neck', 'Iodized salt, fish, dairy'],
      ['Calcium', 'Weak bones over the years', 'Dairy, fortified plant milks, greens']], 520) +
      '<p class="cap">Today these are easy to prevent. Iodized salt and vitamin D in milk were added to common foods because the evidence showed they stopped these diseases.</p>', True),
    aid('real', 'Sorting health habits', '<div class="items" id="hbSort"></div><p class="score" id="hbSortS">0 of 6 correct</p>')]),
  dict(toc='Germs and defenses', kicker='Disease and defenses', h2='How infections spread and how the body fights back',
   idea='<mark>Infectious diseases</mark> are caused by <mark>pathogens</mark>: bacteria, viruses, fungi or parasites. <mark>Non-infectious</mark> conditions, such as diabetes or most heart disease, are not caught from others. The body has <mark>barriers</mark> (skin, mucus), then <mark>white blood cells</mark> and <mark>antibodies</mark>. <mark>Vaccines</mark> train that defense in advance.',
   aids=[
    aid('analogy', 'A castle and its guards', '<p class="cap">Skin and mucus are the walls. White blood cells are guards patrolling inside. Antibodies are wanted posters. A vaccine shows the guards the poster before the real invader arrives.</p><p>It breaks down because viruses change, so some wanted posters, like those for the flu, must be updated every year.</p>'),
    aid('try', 'Spread in a group: a made-up model', '<div class="ctl"><label for="spC">Close contacts per sick person: <span id="spCV"></span></label><input id="spC" type="range" min="1" max="8" step="1" value="4"></div><div class="chips" id="spChips" role="group" aria-label="Protection"></div><div class="stage"><svg id="spSvg" viewBox="0 0 480 220" role="img" aria-label="Number of new cases in each round of spread"></svg></div><p class="readout" id="spR" aria-live="polite"></p>', True),
    aid('data', 'Germ types and treatments', table(['Pathogen', 'Example', 'Do antibiotics work?'], [
      ['Bacteria', 'Strep throat, many ear infections', 'Yes, if the right kind and used as directed'], ['Virus', 'Cold, flu, measles', 'No; antibiotics do not work on viruses'],
      ['Fungus', 'Athlete\'s foot, ringworm', 'No; antifungal medicines are used'], ['Parasite', 'Malaria, tapeworm', 'No; antiparasitic medicines are used']], 500) +
      '<p class="cap">Using antibiotics when they are not needed helps bacteria evolve resistance (Unit 8.9).</p>', True),
    aid('real', 'Everyday ways to cut the chain', table(['Action', 'Which step it breaks'], [
      ['Washing hands with soap for 20 seconds', 'Germs moving from hands to mouth, eyes, food'], ['Covering coughs and staying home when sick', 'Spread through the air and by touch'],
      ['Vaccination', 'The germ finding a body with no defense'], ['Clean water and safe food storage', 'Spread through water and food']], 520), True)]),
  dict(toc='Evidence for health claims', kicker='Evidence and choices', h2='How to tell a strong health claim from a weak one',
   idea='People have used <mark>evidence</mark> to beat diseases. A strong claim has a <mark>comparison group</mark>, many people, and a fair test. A weak claim relies on one story, a <mark>correlation</mark> that could have another cause, or an expert who is selling something.',
   aids=[
    aid('analogy', 'Which umbrella works?', '<p class="cap">If everyone who carries a yellow umbrella stays dry, you still do not know if the umbrella did it, unless some people tried it in the rain without one.</p>'),
    aid('try', 'Strong or weak evidence?', '<div class="items" id="evSort"></div><p class="score" id="evSortS">0 of 6 correct</p>'),
    aid('data', 'Famous cases where evidence won', table(['Who and when', 'The question', 'What the evidence showed'], [
      ['John Snow, London, 1854', 'What spread cholera?', 'Cases clustered around one water pump; removing the handle was followed by fewer new cases.'],
      ['Ignaz Semmelweis, Vienna, 1847', 'Why did mothers die more in one maternity ward?', 'Deaths dropped sharply, from roughly 10% to about 2%, after doctors washed hands with chlorinated solution.'],
      ['Polio vaccine trial, USA, 1954', 'Does the vaccine protect children?', 'About 1.8 million children took part; those who got the vaccine had far less polio than those who got a placebo.']], 640) +
      '<p class="cap">Numbers are rounded. Notice what each case had: a comparison, many cases, and a plan to check if the change worked.</p>', True),
    aid('real', 'Checklist for a health claim', table(['Ask', 'Why'], [
      ['Compared with what?', 'Without a comparison group you cannot tell if anything changed because of the treatment.'],
      ['How many people?', 'One or two cases can be luck.'], ['Who paid for it, and who gains?', 'It does not make a claim false, but check for bias.'],
      ['Has someone else repeated it?', 'Repeating is how science catches mistakes.']], 520), True)])
 ],
 explain_q='A friend says a "detox tea" cured their cold, because they felt better after three days. Using what you learned, explain why that is weak evidence and what you would need to test the tea fairly.',
 explain_a='Most colds end in a week or so with no treatment, so feeling better after three days is what would have happened anyway. To test the tea you would need many people, a comparison group (a placebo tea), random assignment, and the same measure of recovery for both groups, ideally repeated by someone else.',
 glossary=[('nutrient', 'A substance in food the body uses for energy, growth or body chemistry.'), ('Calorie', 'A unit for the energy in food (a kilocalorie).'), ('deficiency', 'A health problem caused by too little of a nutrient.'),
   ('pathogen', 'A germ that causes disease.'), ('antibody', 'A protein made by the body that sticks to a specific germ.'), ('vaccine', 'A harmless form of a germ that trains the immune system.'),
   ('correlation', 'Two things that change together; it does not prove one causes the other.'), ('placebo', 'A fake treatment used to compare with a real one.')],
 tutor='<p><b>Kit (about $5):</b> packaged foods with labels, a food scale, graph paper, a calendar for a week-long sleep and activity log, a UV bead or glitter lotion "germ" activity (optional).</p><ul><li><b>Concept 1:</b> Compare labels for two breakfasts and total the Calories from grams (4, 4, 9).</li><li><b>Concept 2:</b> Keep a one-week log of sleep and activity; no food shaming or weighing people.</li><li><b>Concept 3:</b> Glitter or UV-lotion hand test, then wash and compare.</li><li><b>Concept 4:</b> Read three health headlines and apply the checklist.</li></ul><p><b>Sensitive topics:</b> keep to science: food as fuel and materials, not body size, dieting or "good" and "bad" foods. Tell students health questions about themselves belong with a doctor, nurse or parent.</p><p><b>Common misconceptions:</b></p><ul><li>"Antibiotics cure colds." Colds are viruses.</li><li>"Fat is always bad." The body needs some.</li><li>"Cold weather gives you colds." Germs do; people just crowd indoors.</li><li>"A vaccine gives you the disease." Vaccines contain killed or weakened germs or just pieces of one.</li></ul><p><b>Pacing:</b> about four 30-minute sessions.</p>',
 related_idea='Up next: this is the last 7th-grade unit in the map. Pair it with <a href="../6th/unit-15-data-and-statistics.html">Unit 15: Data &amp; Statistics</a> for reading evidence.',
 related=[('../6th/unit-09-body-systems-and-homeostasis.html', 'Unit 9: Body Systems &amp; Homeostasis', 'How body systems work together.'), ('unit-7.4-metabolic-reactions-and-the-body.html', 'Unit 7.4: Metabolic Reactions &amp; the Body', 'What happens to food.'),
   ('unit-7.10-acids-and-bases.html', 'Unit 7.10: Acids &amp; Bases', 'Stomach acid and pH.'), ('../8th/unit-8.9-natural-selection-and-common-ancestry.html', 'Unit 8.9: Natural Selection', 'Antibiotic resistance evolves.'),
   ('../k-5/unit-00-how-science-works.html', 'Unit 0: How Science Works', 'Fair tests and evidence.')],
 footer='Built for seventh-grade tutoring. Supports NGSS MS-LS1-3 (body systems interact) and MS-LS1-7 (food rearranged for energy and growth); health topics are an extension. Not medical advice. Energy, sleep and activity figures are typical guidance and vary by person; historical numbers are rounded.',
 quiz=[
  dict(q='Which nutrient gives the most energy per gram?', o=['Protein', 'Carbohydrate', 'Fat'], a=2, e='Fat gives about 9 Calories per gram; the others about 4.'),
  dict(q='A package says 2.5 servings and 150 Calories per serving. If you eat it all, you eat about...', o=['150 Calories', '375 Calories', '600 Calories'], a=1, e='2.5 times 150 is 375.'),
  dict(q='Antibiotics are useful against...', o=['Bacterial infections', 'Colds and flu', 'Every germ'], a=0, e='They target bacteria, not viruses.'),
  dict(q='Which is a non-infectious condition?', o=['Measles', 'Strep throat', 'Type 1 diabetes'], a=2, e='You cannot catch diabetes from someone.'),
  dict(q='In the spread model, if each sick person passes the germ to fewer than 1 other person, the outbreak...', o=['Grows faster', 'Dies out', 'Stays the same size'], a=1, e='Each round has fewer cases than the last.'),
  dict(q='Which makes the strongest evidence that a treatment works?', o=['One person felt better', 'A trial with thousands of people and a placebo group', 'A famous person recommends it'], a=1, e='A comparison group, many people and a fair test make strong evidence.')],
 js=[
  '''const C=$('#ncC'), P=$('#ncP'), F=$('#ncF'), bx=$('#ncBars'), rd=$('#ncR');
const d=()=>{ const c=+C.value,p=+P.value,f=+F.value; $('#ncCV').textContent=c; $('#ncPV').textContent=p; $('#ncFV').textContent=f;
 const kc=c*4,kp=p*4,kf=f*9,t=kc+kp+kf;
 bars(bx,[['Carbohydrate',kc,kc+' Cal','a'],['Protein',kp,kp+' Cal','t'],['Fat',kf,kf+' Cal','r']],{labW:110,max:Math.max(kc,kp,kf,100)*1.05});
 rd.innerHTML=t? `Total <b>${t} Calories</b>. Share: carbohydrate ${(100*kc/t).toFixed(0)}%, protein ${(100*kp/t).toFixed(0)}%, fat ${(100*kf/t).toFixed(0)}%. Notice that ${f} g of fat gives ${kf} Calories, ${f? (kf/(f*4)).toFixed(2)+' times':'no'} what the same grams of carbohydrate would.`:'Move a slider.'; };
[C,P,F].forEach(x=>x.addEventListener('input',d)); d();''',
  '''const D=[{n:'Scurvy',t:'Missing vitamin C. Sailors on long voyages without fresh fruit got bleeding gums and slow-healing wounds. Citrus fixed it.'},{n:'Anemia',t:'Often missing iron. Red blood cells carry too little oxygen, so a person feels tired and looks pale. Beans, meat and fortified cereal help; a doctor should confirm the cause.'},{n:'Rickets',t:'Missing vitamin D (or calcium). Children have soft, bent bones. Sunlight on skin makes vitamin D; milk is often fortified.'},{n:'Goiter',t:'Missing iodine. The thyroid gland swells in the neck. Iodized salt largely ended it in many countries.'}];
const chips=$('#dfChips'), rd=$('#dfR'); mkChips(chips,D.map(x=>x.n),0);
const d=i=>{ rd.innerHTML=`<b>${D[i].n}.</b> ${D[i].t}`; }; chipsOn(chips,d); d(0);''',
  '''quizBox($('#hbSort'),$('#hbSortS'),[
 {n:'Eating fruit and vegetables most days',a:0,e:'Supplies vitamins, minerals and fiber.'},{n:'Sleeping 4 hours most nights',a:1,e:'Far below what growing bodies need.'},
 {n:'An hour of active play or sport',a:0,e:'Meets the common guideline of 60 minutes.'},{n:'Skipping handwashing before eating',a:1,e:'Lets germs from hands reach the mouth.'},
 {n:'Drinking water through the day',a:0,e:'Water carries nutrients and helps cool the body.'},{n:'Never eating any protein',a:1,e:'The body needs protein to build and repair tissue.'}],['Helps health','Hurts health']);''',
  '''const sl=$('#spC'), chips=$('#spChips'), svg=$('#spSvg'), rd=$('#spR');
const O=[{n:'No protection',p:0.35},{n:'Wash hands (-40%)',p:0.35*0.6},{n:'Wash hands + stay home when sick (-70%)',p:0.35*0.3},{n:'Vaccinated: 3 in 4 protected',p:0.35*0.25}];
mkChips(chips,O.map(o=>o.n),0); let k=0;
const d=()=>{ const c=+sl.value; $('#spCV').textContent=c; const R=c*O[k].p, rows=[]; let cases=1; for(let g=0;g<=5;g++){ rows.push([g,Math.min(cases,200)]); cases*=R; }
 line(svg,{W:480,H:220,L:50,x0:0,x1:5,y0:0,y1:Math.max(10,Math.ceil(Math.max(...rows.map(r=>r[1]))/10)*10),yt:[0,Math.max(10,Math.ceil(Math.max(...rows.map(r=>r[1]))/10)*10)/2,Math.max(10,Math.ceil(Math.max(...rows.map(r=>r[1]))/10)*10)],xt:[0,1,2,3,4,5],xl:'round of spread',yl:'new cases',series:[{pts:rows,color:'var(--absorb)'}],dots:rows});
 rd.innerHTML=`Each sick person passes it to about <b>${R.toFixed(1)}</b> others. ${R<1?'That is under 1, so the outbreak <b>dies out</b>.':R===1?'Exactly 1: it neither grows nor shrinks.':'That is over 1, so each round has <b>more</b> cases than the last.'} <i>Made-up numbers to show the idea, capped at 200 on the chart; real diseases differ.</i>`; };
chipsOn(chips,i=>{k=i;d();}); sl.addEventListener('input',d); d();''',
  '''quizBox($('#evSort'),$('#evSortS'),[
 {n:'"My uncle tried it and it worked."',a:1,e:'One story, no comparison.'},{n:'A trial of 20,000 people, half with a placebo, results repeated by another team',a:0,e:'Large, compared and repeated.'},
 {n:'"Everyone who eats breakfast is thin, so breakfast makes you thin."',a:1,e:'Correlation, not cause: other habits could explain it.'},{n:'A lab test run three times with the same result, with a control',a:0,e:'Repeated with a control.'},
 {n:'An ad quoting a "doctor" paid by the company',a:1,e:'Possible bias, and no data.'},{n:'Cases mapped around one water pump, then falling after it was shut',a:0,e:'Pattern plus a change that was checked.'}],['Strong evidence','Weak evidence']);''']
)
