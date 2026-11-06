import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from make_unit import aid, table

HERO = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 220" role="img" aria-label="Two linked rising lines over time, carbon dioxide in the air and global temperature, each with a few labeled dates">
  <title>Carbon dioxide and temperature rising together</title>
  <desc>A chart from 1880 to 2020. One line shows the amount of carbon dioxide in the air climbing from about 285 parts per million to about 415. Another shows global temperature relative to the 1951 to 1980 average, rising from about minus 0.2 degrees C to about 1.0.</desc>
  <rect x="8" y="8" width="624" height="204" rx="16" style="fill:var(--surface);stroke:var(--line);stroke-width:2"/>
  <path d="M60 180 H600 M60 180 V30" style="fill:none;stroke:var(--ink);stroke-width:2"/>
  <path d="M60 168 C200 168 300 160 380 148 C460 122 520 80 600 46" style="fill:none;stroke:var(--absorb);stroke-width:4;stroke-linecap:round"/>
  <path d="M60 150 C140 154 200 160 260 152 C320 140 380 144 440 128 C500 98 550 70 600 40" style="fill:none;stroke:var(--reflect);stroke-width:4;stroke-linecap:round;stroke-dasharray:8 6"/>
  <g style="fill:var(--muted);font-size:12px;text-anchor:middle"><text x="60" y="198">1880</text><text x="195" y="198">1920</text><text x="330" y="198">1960</text><text x="465" y="198">1990</text><text x="600" y="198">2020</text></g>
  <text x="400" y="106" style="fill:var(--absorb);font-size:13px;font-weight:700">CO&#8322; in the air</text>
  <text x="140" y="130" style="fill:var(--reflect);font-size:13px;font-weight:700">global temperature (change)</text>
  <text x="332" y="26" text-anchor="middle" style="fill:var(--ink);font-size:14px;font-weight:700">Two lines, one century and a half</text>
</svg>'''

SPEC = dict(
 out='8th/unit-8.11-climate-evidence-and-change.html',
 title_tag='Climate Evidence and Change',
 kicker='Eighth grade science · Unit 8.11',
 h1='Climate Evidence &amp; Change',
 lede='Climate is the pattern of weather over decades, and it has been measured carefully for more than a century. This unit asks what the evidence shows, what is causing it, what it means for people and places such as Michigan, and what can be done. Each claim comes with a graph or a table so you can read the evidence yourself.',
 bridge='Unit 6.4 separated weather from climate and Unit 6.13 explained the greenhouse effect and the energy choices that follow from it. This unit goes further: the long records, the evidence that people are changing the climate, and how engineers and communities respond.',
 hero_svg=HERO,
 concepts=[
  dict(toc='Weather and climate', kicker='Weather and climate', h2='Climate is the long-term pattern',
   idea='<mark>Weather</mark> is what the air is doing today. <mark>Climate</mark> is the pattern of weather over many years, usually <b>30 years</b> or more. Climate differs by place because of <mark>latitude</mark>, water, mountains and ocean currents. A cold day does not disprove a warming climate, just as one sunny day does not make a desert.',
   aids=[
    aid('analogy', 'Mood and personality', '<p class="cap">Weather is a mood: it can change within an hour. Climate is personality: it describes what someone is usually like over years.</p><p>It breaks down because climate can change too, when something pushes the whole pattern.</p>'),
    aid('try', 'Compare three climates', '<div class="chips" id="clChips" role="group" aria-label="City"></div><div class="stage"><svg id="clSvg" viewBox="0 0 480 230" role="img" aria-label="Average monthly temperature for the chosen city"></svg></div><p class="readout" id="clR" aria-live="polite"></p>', True),
    aid('data', 'Why the three differ', table(['City', 'Latitude (about)', 'What shapes it'], [['Ann Arbor, Michigan', '42 degrees N', 'Mid-latitude, cold winters, Great Lakes nearby'], ['Phoenix, Arizona', '33 degrees N', 'Desert, dry air, little cloud, far from the ocean'], ['Miami, Florida', '26 degrees N', 'Near the equator, warm ocean']], 520) +
      '<p class="cap">Monthly temperatures are rounded averages for typical conditions. Real values vary from year to year.</p>'),
    aid('real', 'Weather or climate?', '<div class="items" id="wcSort"></div><p class="score" id="wcSortS">0 of 6 correct</p>')]),
  dict(toc='The evidence', kicker='Evidence of change', h2='Several independent measurements agree',
   idea='<mark>Carbon dioxide</mark> in the air has risen from about 280 parts per million (ppm) before the Industrial Revolution to about 420 ppm today. Global average temperature has risen roughly <b>1.1 to 1.2 &deg;C</b> (about 2 &deg;F) since the late 1800s. Sea level, glaciers, sea ice, ocean heat and the timing of seasons also show change. Many independent records pointing the same way is what makes the evidence strong.',
   aids=[
    aid('analogy', 'Many witnesses', '<p class="cap">One witness might be wrong. Thermometers, satellites, ocean buoys, ice cores and tree rings are different witnesses who tell the same story.</p>'),
    aid('try', 'Read two records together', '<div class="chips" id="evChips" role="group" aria-label="Record"></div><div class="stage"><svg id="evSvg" viewBox="0 0 480 230" role="img" aria-label="Chosen record from 1880 or 1960 to 2020"></svg></div><p class="readout" id="evR" aria-live="polite"></p>', True),
    aid('data', 'Selected values', table(['Year', 'CO<sub>2</sub> (ppm, Mauna Loa)', 'Temperature change (&deg;C vs 1951 to 1980)'], [['1960', '317', 'about 0.0'], ['1980', '339', 'about +0.3'], ['2000', '370', 'about +0.4'], ['2010', '390', 'about +0.7'], ['2020', '414', 'about +1.0']], 520) +
      '<p class="cap">CO<sub>2</sub> values are annual means at Mauna Loa, Hawaii. Temperatures are global annual averages, rounded, relative to the 1951 to 1980 average (the baseline is a choice; the trend does not depend on it).</p>', True),
    aid('real', 'Evidence stored in nature', table(['Record', 'What it shows'], [['Ice cores from Antarctica', 'Air bubbles show CO<sub>2</sub> stayed between about 180 and 300 ppm for 800,000 years before the last two centuries.'],
      ['Tide gauges and satellites', 'Global sea level has risen by about 20 cm (8 inches) since 1900 and is rising faster now.'], ['Glaciers and sea ice', 'Most mountain glaciers are shrinking; Arctic sea ice in late summer covers less area than in the 1980s.'],
      ['Great Lakes ice', 'Average winter ice cover has decreased since the 1970s, with large swings from year to year.']], 620), True)]),
  dict(toc='Causes', kicker='Causes', h2='Why the CO&#8322; rise matches human activity',
   idea='Carbon dioxide, methane and water vapor trap heat (the <mark>greenhouse effect</mark> of Unit 6.13). Burning <mark>fossil fuels</mark>, clearing forests and farming add greenhouse gases. About half of the CO<sub>2</sub> we emit stays in the air; the oceans and plants absorb the rest. Natural factors, the Sun, volcanoes and Earth&rsquo;s orbit, do change climate, but they do not explain the warming of the last 50 years.',
   aids=[
    aid('analogy', 'A bathtub filling', '<p class="cap">Emissions are the tap, oceans and forests are a partly open drain, and CO<sub>2</sub> in the air is the water level. If the tap flows faster than the drain, the level rises.</p><p>Even if the tap were cut in half, the level would still rise until the drain catches up.</p>'),
    aid('try', 'Emissions and the air in 2050', '<div class="ctl"><label for="emE">Yearly emissions after 2025: <span id="emEV"></span>% of today (today is about 37 billion tonnes of CO<sub>2</sub> a year)</label><input id="emE" type="range" min="0" max="150" step="10" value="100"></div><div class="stage"><svg id="emSvg" viewBox="0 0 480 230" role="img" aria-label="Projected CO2 level in the air to 2050 for the chosen emissions level"></svg></div><p class="readout" id="emR" aria-live="polite"></p>', True),
    aid('data', 'Natural or human?', table(['Factor', 'Does it explain recent warming?'], [['Sun&rsquo;s output', 'No. Satellites show it flat or slightly down since the 1980s while temperature rose.'], ['Volcanoes', 'No. Eruptions cool Earth for a year or two. They add far less CO<sub>2</sub> than people do.'],
      ['Earth&rsquo;s orbit', 'No. Orbital changes act over thousands of years.'], ['CO<sub>2</sub> from fossil fuels', 'Yes. Its carbon has a chemical signature that matches ancient plants, and the amount matches the rise.']], 620), True),
    aid('real', 'Where emissions come from', '<p class="cap">Energy for electricity and heat, transportation, industry, farming and land use, and buildings are the main sectors. Some of these, like electricity, can change faster than others.</p>')]),
  dict(toc='Effects and responses', kicker='Effects and responses', h2='What it means and what can be done',
   idea='Effects vary by place: <mark>heat waves</mark>, heavier rain, drought, <mark>sea-level rise</mark> and changing growing seasons. In the Great Lakes region, projections show warmer winters, more heavy rainstorms and less lake ice. People respond in two ways: <mark>mitigation</mark> reduces the cause (use less fossil energy, protect forests), and <mark>adaptation</mark> reduces the harm (sea walls, shade trees, cooling centers, drought-tolerant crops).',
   aids=[
    aid('analogy', 'A leaking boat', '<p class="cap">Mitigation is fixing the leak. Adaptation is bailing and building higher sides. A smart crew does both, because fixing the leak takes time.</p>'),
    aid('try', 'Mitigation or adaptation?', '<div class="items" id="maSort"></div><p class="score" id="maSortS">0 of 6 correct</p>'),
    aid('data', 'Comparing solutions (design thinking)', table(['Option', 'Criteria it helps', 'Constraints to check'], [['Rooftop solar', 'Cuts emissions', 'Cost, sunlight, grid connection'], ['Cooling centers', 'Protect people in heat waves', 'Staff, access, funding'],
      ['Planting trees in cities', 'Shade, cooler streets, stores some carbon', 'Water, space, years to grow'], ['Bigger storm drains', 'Reduce flooding', 'Cost, lifespan, cannot handle every storm']], 620) +
      '<p class="cap">Engineers use criteria and constraints (Unit 7.3). There is no single best option; combinations are normal.</p>', True),
    aid('real', 'Choices you can examine', '<p class="cap">Look at your school or home: where does energy come from, how is it used, what could be adapted for heat or heavy rain? Pick one change, write a criterion and a constraint for it, and say how you would measure whether it worked.</p>')])
 ],
 explain_q='Someone says, "It snowed a lot this week, so global warming must be a hoax." Use what you learned to explain the difference between weather and climate and name two kinds of evidence that would be better to look at.',
 explain_a='A week of snow is weather, one sample at one place. Climate is a pattern over 30 years or more, for one place or for the whole planet. Better evidence includes global temperature records over many decades, the long CO2 record, sea-level measurements or glacier and sea-ice records. These agree across many independent measurements.',
 glossary=[('weather', 'The state of the air at a place and time: temperature, rain, wind.'), ('climate', 'The typical pattern of weather over 30 years or more.'), ('greenhouse gas', 'A gas, such as carbon dioxide or methane, that traps heat in the air.'),
   ('fossil fuel', 'Coal, oil or natural gas, made from ancient living things; burning it releases CO<sub>2</sub>.'), ('ppm', 'Parts per million; a way to count a tiny share of the air.'), ('mitigation', 'Reducing the causes of climate change.'),
   ('adaptation', 'Reducing harm from the changes that are happening.'), ('anomaly', 'How far a value is from a chosen average.')],
 tutor='<p><b>Kit (free):</b> printed graphs from NOAA or NASA, graph paper, a calendar of local weather for a month, a thermometer, a few years of local "first frost" or "ice-out" dates if available from a local nature center.</p><ul><li><b>Concept 1:</b> Plot your own weather for a month, then discuss why one month is not climate.</li><li><b>Concept 2:</b> Read a CO2 graph and a temperature graph; write what you see, then what you would need to know.</li><li><b>Concept 3:</b> Use the bathtub model with cups of water: tap, drain, level.</li><li><b>Concept 4:</b> Choose one adaptation or mitigation for your school; list criteria and constraints.</li></ul><p><b>Handling the topic:</b> keep to evidence and let students check sources. Distinguish what is measured (CO2, temperature, sea level) from what is projected (future temperatures, local effects) and from what is a policy choice. Climate anxiety is real: end with things people are doing.</p><p><b>Common misconceptions:</b></p><ul><li>"The ozone hole causes global warming." Different problems.</li><li>"It is just natural cycles." Natural drivers have been checked and do not explain the recent warming.</li><li>"One cold winter proves it is not warming." Weather is not climate.</li></ul><p><b>Pacing:</b> about five 30-minute sessions.</p>',
 related_idea='This is the last unit in the 8th-grade list. For the energy side, see <a href="../6th/unit-13-energy-resources-and-human-impact.html">Unit 13: Energy Resources &amp; Human Impact</a>.',
 related=[('../6th/unit-04-weather-and-the-water-cycle.html', 'Unit 4: Weather &amp; the Water Cycle', 'Weather versus climate.'), ('../6th/unit-13-energy-resources-and-human-impact.html', 'Unit 13: Energy Resources &amp; Human Impact', 'The greenhouse effect and energy choices.'),
   ('../7th/unit-7.7-earth-resources-and-human-impact.html', 'Unit 7.7: Earth Resources &amp; Human Impact', 'People and resources.'), ('../6th/unit-15-data-and-statistics.html', 'Unit 15: Data &amp; Statistics', 'Reading graphs and trends.'),
   ('../k-5/unit-00-how-science-works.html', 'Unit 0: How Science Works', 'Evidence and fair tests.')],
 footer='Built for eighth-grade tutoring. Supports NGSS MS-ESS3-5 (evidence for factors in rising global temperature), MS-ESS3-3 (reduce human impact) and MS-ESS2-6 (regional climates). Values are rounded from NOAA and NASA records and from IPCC summaries; check current figures at noaa.gov and nasa.gov.',
 quiz=[
  dict(q='Climate is usually measured over...', o=['A day', 'A month', '30 years or more'], a=2, e='Climate is the long-term pattern.'),
  dict(q='Which is climate, not weather?', o=['It rained yesterday', 'Phoenix is hot and dry most of the year', 'Today is windy'], a=1, e='A long-term pattern, not a single day.'),
  dict(q='Which is the best evidence that carbon dioxide in the air has risen?', o=['A hot summer', 'A measured record from Mauna Loa and ice cores', 'A friend says it is stuffy'], a=1, e='Direct measurement and old air trapped in ice are strong evidence.'),
  dict(q='Why do volcanoes not explain the warming of the last 50 years?', o=['They never erupt', 'Their eruptions cool Earth briefly and add far less CO2 than humans do', 'They only erupt in winter'], a=1, e='The scale and the timing do not match.'),
  dict(q='Planting shade trees along a hot street is mostly...', o=['Mitigation', 'Adaptation', 'Neither'], a=1, e='It reduces harm from heat. It also stores some carbon, so it can help both.'),
  dict(q='In the emissions model, if yearly emissions fall to half, CO2 in the air...', o=['Still rises, but more slowly', 'Starts falling at once', 'Rises faster'], a=0, e='As long as emissions exceed what the oceans and plants absorb, the level keeps rising.')],
 js=[
  '''const C=[{n:'Ann Arbor, MI',c:'var(--reflect)',T:[23,26,35,47,58,68,72,70,63,51,40,29]},{n:'Phoenix, AZ',c:'var(--absorb)',T:[56,60,65,73,82,91,95,94,88,76,63,55]},{n:'Miami, FL',c:'var(--transmit)',T:[68,70,72,76,80,83,85,85,84,80,74,70]}];
const chips=$('#clChips'), svg=$('#clSvg'), rd=$('#clR'); mkChips(chips,C.map(c=>c.n),0);
const d=i=>{ const x=C[i]; line(svg,{W:480,H:230,L:50,x0:0,x1:11,y0:0,y1:100,yt:[0,25,50,75,100],xt:[[0,'Jan'],[3,'Apr'],[6,'Jul'],[9,'Oct'],[11,'Dec']],xl:'month',yl:'average temperature (\\u00b0F)',series:[{pts:x.T.map((v,k)=>[k,v]),color:x.c}],dots:x.T.map((v,k)=>[k,v])});
 const mx=Math.max(...x.T), mn=Math.min(...x.T); rd.innerHTML=`<b>${x.n}</b>: warmest month about <b>${mx} \\u00b0F</b>, coolest about <b>${mn} \\u00b0F</b>, a swing of <b>${mx-mn} \\u00b0F</b>. That yearly pattern, repeated for decades, is the climate.`; };
chipsOn(chips,d); d(0);''',
  '''quizBox($('#wcSort'),$('#wcSortS'),[
 {n:'A thunderstorm this afternoon',a:0,e:'Today\\u2019s conditions: weather.'},{n:'Winters in Michigan are usually cold and snowy',a:1,e:'A long-term pattern: climate.'},
 {n:'A heat wave next week',a:0,e:'A short event: weather.'},{n:'Rainforests get over 2 meters of rain a year',a:1,e:'A long-term average: climate.'},
 {n:'Fog this morning',a:0,e:'A short event: weather.'},{n:'Average July temperature over 30 years',a:1,e:'A 30-year average: climate.'}],['Weather','Climate']);''',
  '''const CO=[[1960,317],[1970,326],[1980,339],[1990,354],[2000,370],[2010,390],[2020,414]];
const TE=[[1880,-0.17],[1900,-0.09],[1920,-0.27],[1940,0.04],[1960,-0.01],[1980,0.26],[2000,0.39],[2010,0.72],[2020,0.98]];
const chips=$('#evChips'), svg=$('#evSvg'), rd=$('#evR'); mkChips(chips,['CO\\u2082 in the air (Mauna Loa)','Global temperature change'],0);
const d=i=>{ if(i===0){ line(svg,{W:480,H:230,L:50,x0:1960,x1:2020,y0:300,y1:440,yt:[300,340,380,420],xt:[1960,1980,2000,2020],xl:'year',yl:'CO\\u2082 (ppm)',series:[{pts:CO,color:'var(--absorb)'}],dots:CO});
  rd.innerHTML='Annual carbon dioxide in the air rose from about <b>317 ppm</b> in 1960 to about <b>414 ppm</b> in 2020, and the line curves upward: the rise is speeding up.'; }
 else { line(svg,{W:480,H:230,L:50,x0:1880,x1:2020,y0:-0.5,y1:1.2,yt:[-0.5,0,0.5,1.0],xt:[1880,1920,1960,2000],xl:'year',yl:'change vs 1951-1980 (\\u00b0C)',series:[{pts:TE,color:'var(--reflect)'}],dots:TE,hl:[[0,'1951-1980 average','var(--ink)']]});
  rd.innerHTML='Global average temperature moved from about <b>\\u22120.2 \\u00b0C</b> in 1880 to about <b>+1.0 \\u00b0C</b> in 2020 against the 1951 to 1980 average. It goes up and down year to year, but the long trend is up.'; } };
chipsOn(chips,d); d(0);''',
  '''const E=$('#emE'), svg=$('#emSvg'), rd=$('#emR');
const d=()=>{ const f=+E.value/100; $('#emEV').textContent=+E.value; const pts=[], base=420, k=0.45/7.8; let c=base; for(let y=2025;y<=2050;y++){ pts.push([y,c]); c+=k*37*f; }
 const ref=[]; c=base; for(let y=2025;y<=2050;y++){ ref.push([y,c]); c+=k*37; }
 line(svg,{W:480,H:230,L:50,x0:2025,x1:2050,y0:400,y1:520,yt:[400,440,480,520],xt:[2025,2035,2045,2050],xl:'year',yl:'CO\\u2082 (ppm)',series:[{pts:ref,color:'var(--line)',w:3,dash:'6 5'},{pts,color:'var(--absorb)'}]});
 const end=pts[pts.length-1][1]; rd.innerHTML=`At <b>${Math.round(f*100)}%</b> of today\\u2019s emissions the air reaches about <b>${end.toFixed(0)} ppm</b> by 2050 (dashed line: emissions stay the same). About 45% of each tonne emitted stays in the air; 7.8 billion tonnes of CO\\u2082 raise the level about 1 ppm. <i>A simple model: it ignores changes in how much land and oceans absorb.</i>`; };
E.addEventListener('input',d); d();''',
  '''quizBox($('#maSort'),$('#maSortS'),[
 {n:'Building wind and solar farms',a:0,e:'Cuts emissions: mitigation.'},{n:'Building a sea wall',a:1,e:'Protects against rising water: adaptation.'},
 {n:'Making buildings need less heating',a:0,e:'Cuts the energy and emissions: mitigation.'},{n:'Opening cooling centers during heat waves',a:1,e:'Helps people cope: adaptation.'},
 {n:'Protecting forests',a:0,e:'Keeps carbon stored: mitigation.'},{n:'Planting crops that tolerate drought',a:1,e:'Copes with the change: adaptation.'}],['Mitigation','Adaptation']);''']
)
