import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from make_unit import aid, table

HERO = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 220" role="img" aria-label="A lever, a ramp and a pulley, each lifting a load: all trade a smaller force for a longer distance">
  <title>Three simple machines</title>
  <desc>A seesaw-style lever with the fulcrum close to the load, a ramp that raises a crate over a long slope, and a pulley with two rope sections holding up a load. Each shows a short arrow for the force you push and a long arrow for the distance you move.</desc>
  <rect x="8" y="8" width="624" height="204" rx="16" style="fill:var(--surface);stroke:var(--line);stroke-width:2"/>
  <g transform="translate(24 20)">
    <path d="M10 130 L180 70" style="stroke:var(--ink);stroke-width:6;stroke-linecap:round"/>
    <path d="M60 150 L75 111 L90 150 Z" style="fill:var(--muted)"/>
    <rect x="20" y="86" width="34" height="26" rx="4" style="fill:var(--absorb)"/>
    <path d="M178 24 V64" style="stroke:var(--reflect);stroke-width:4;stroke-linecap:round"/><path d="M178 70 L171 58 L185 58 Z" style="fill:var(--reflect)"/>
    <text x="95" y="178" text-anchor="middle" style="fill:var(--ink);font-size:14px;font-weight:700">Lever</text>
  </g>
  <g transform="translate(230 20)">
    <path d="M10 140 H180 L180 70 Z" style="fill:var(--surface-2);stroke:var(--ink);stroke-width:3;stroke-linejoin:round"/>
    <rect x="52" y="104" width="30" height="26" rx="4" transform="rotate(-22 52 130)" style="fill:var(--absorb)"/>
    <path d="M100 118 L134 100" style="stroke:var(--reflect);stroke-width:4;stroke-linecap:round"/><path d="M142 96 L130 94 L136 106 Z" style="fill:var(--reflect)"/>
    <text x="95" y="178" text-anchor="middle" style="fill:var(--ink);font-size:14px;font-weight:700">Ramp</text>
  </g>
  <g transform="translate(440 20)">
    <path d="M10 14 H170" style="stroke:var(--ink);stroke-width:5;stroke-linecap:round"/>
    <circle cx="90" cy="46" r="16" style="fill:var(--surface);stroke:var(--ink);stroke-width:3"/>
    <path d="M74 14 V46 M106 14 V46" style="stroke:var(--reflect);stroke-width:3"/>
    <path d="M106 46 V124 M74 46 V124" style="stroke:var(--reflect);stroke-width:3"/>
    <rect x="62" y="124" width="56" height="26" rx="4" style="fill:var(--absorb)"/>
    <path d="M106 46 V90" style="stroke:var(--reflect);stroke-width:3"/>
    <text x="95" y="178" text-anchor="middle" style="fill:var(--ink);font-size:14px;font-weight:700">Pulley</text>
  </g>
</svg>'''

SPEC = dict(
 out='8th/unit-8.10-simple-machines-and-work.html',
 title_tag='Simple Machines and Work',
 kicker='Eighth grade science · Unit 8.10',
 h1='Simple Machines &amp; Work',
 lede='A crowbar, a ramp, a pulley and a bike gear all do the same job: they let a small force do a big task, at a price. This unit defines <b>work</b> in the physics sense, builds a lever, a ramp and a pulley you can adjust, and shows the price every machine charges. Use the fair-test steps from <b>Unit 0: How Science Works</b> when you compare designs.',
 bridge='Unit 8.1 covered forces and Unit 8.2 covered energy transformation and conservation. Work is how energy is transferred by a force moving something. Machines are where those ideas meet design: how do you do a job with less effort, and what does that cost?',
 hero_svg=HERO,
 concepts=[
  dict(toc='Work', kicker='Work, force and distance', h2='Work is force times distance',
   idea='In physics, <mark>work</mark> is done when a <mark>force</mark> moves an object in the direction of the force: <b>work = force &times; distance</b>. With force in newtons and distance in meters, work is in <mark>joules</mark> (1 N &times; 1 m = 1 J). Holding a heavy box still, or carrying it level, does no work on it in this sense because it does not move in the direction of the force.',
   aids=[
    aid('analogy', 'Money spent', '<p class="cap">Work is like energy spent. Pushing twice as hard over the same distance spends twice as much. Pushing the same hard over twice the distance also spends twice as much.</p><p>It breaks down because people get tired from holding a box too, even though no work is done on it. Muscles use energy to hold tension even when nothing moves.</p>'),
    aid('try', 'Work calculator', '<div class="ctl"><label for="wkF">Force: <span id="wkFV"></span> N</label><input id="wkF" type="range" min="0" max="500" step="10" value="100"></div><div class="ctl"><label for="wkD">Distance moved: <span id="wkDV"></span> m</label><input id="wkD" type="range" min="0" max="10" step="0.5" value="2"></div><div class="stage"><svg id="wkSvg" viewBox="0 0 480 200" role="img" aria-label="A rectangle whose width is distance and height is force; its area is the work"></svg></div><p class="readout" id="wkR" aria-live="polite"></p>', True),
    aid('data', 'Rough amounts of work', table(['Task', 'Force', 'Distance', 'Work'], [
      ['Lift a 1 kg apple 1 m', 'about 10 N (the weight)', '1 m', 'about 10 J'], ['Lift a 20 kg backpack onto a table 0.8 m high', 'about 200 N', '0.8 m', 'about 160 J'],
      ['Climb a 3 m flight of stairs (40 kg student)', 'about 400 N', '3 m', 'about 1,200 J'], ['Hold a 10 kg box still for a minute', 'about 100 N', '0 m', '0 J']], 560) +
      '<p class="cap">Weight is mass times 9.8 N per kg, rounded to 10 N per kg here. Work against gravity equals the weight times the height gained.</p>', True),
    aid('real', 'Work or no work?', '<div class="items" id="wkSort"></div><p class="score" id="wkSortS">0 of 6 correct</p>')]),
  dict(toc='Levers', kicker='Levers', h2='A lever turns a long, light push into a short, strong lift',
   idea='A <mark>lever</mark> is a rigid bar that turns on a <mark>fulcrum</mark>. The farther from the fulcrum you push, the less force you need. Ideal <mark>mechanical advantage</mark> = effort arm / load arm. The three classes differ by which of fulcrum, load and effort is in the middle.',
   aids=[
    aid('analogy', 'A playground seesaw', '<p class="cap">A small child far from the pivot can balance a heavier child close to it. Distance from the fulcrum is as important as the push.</p><p>It matches the torque idea in Unit 8.1 and in the Balance Duel game: force &times; distance from the pivot has to match on both sides.</p>'),
    aid('try', 'Move the fulcrum', '<div class="ctl"><label for="lvX">Fulcrum is <span id="lvXV"></span> m from the load (bar is 3 m long; load weighs 300 N)</label><input id="lvX" type="range" min="0.3" max="2.7" step="0.1" value="0.6"></div><div class="stage"><svg id="lvSvg" viewBox="0 0 480 200" role="img" aria-label="A 3 meter bar on a fulcrum with the load at the left end and the effort at the right end"></svg></div><p class="readout" id="lvR" aria-live="polite"></p>', True),
    aid('data', 'Three classes of lever', table(['Class', 'In the middle', 'Examples', 'Trade'], [
      ['First', 'Fulcrum', 'Seesaw, crowbar, scissors', 'Can give force or distance gain'], ['Second', 'Load', 'Wheelbarrow, nutcracker, bottle opener', 'Always gives force gain'],
      ['Third', 'Effort', 'Tweezers, fishing rod, your forearm', 'Gives speed and distance, needs more force']], 560) +
      '<p class="cap">A third-class lever has a mechanical advantage below 1, so it needs more force than the load, but the load moves farther and faster.</p>', True),
    aid('real', 'Levers in your body', '<p class="cap">Your forearm is a third-class lever: the elbow is the fulcrum, the load is in your hand, and your biceps pulls close to the elbow. The biceps works hard and moves a little, so your hand moves a lot.</p>')]),
  dict(toc='Ramps and pulleys', kicker='Inclined planes and pulleys', h2='A longer path means less force',
   idea='A <mark>ramp</mark> (inclined plane) lets you lift a load with a smaller push over a longer path. A <mark>pulley system</mark> with <b>n</b> rope sections holding the load cuts the force by about n and lengthens the rope you pull by n. The same trade appears in the <mark>wedge</mark> (two ramps back to back), the <mark>screw</mark> (a ramp wrapped around a rod) and the <mark>wheel and axle</mark>.',
   aids=[
    aid('analogy', 'A switchback trail', '<p class="cap">A mountain road zigzags up instead of going straight. The climb is the same height, but each step is gentler. You walk farther and tire less per step.</p>'),
    aid('try', 'Ramp length lab', '<div class="ctl"><label for="rpL">Ramp length: <span id="rpLV"></span> m (the crate weighs 300 N and must rise 1.2 m)</label><input id="rpL" type="range" min="1.2" max="6" step="0.2" value="3"></div><div class="chips" id="rpChips" role="group" aria-label="Friction"></div><div id="rpBars" class="bars"></div><p class="readout" id="rpR" aria-live="polite"></p>', True),
    aid('try', 'Pulley lab', '<div class="ctl"><label for="plN">Rope sections holding the load: <span id="plNV"></span></label><input id="plN" type="range" min="1" max="6" step="1" value="2"></div><div class="stage"><svg id="plSvg" viewBox="0 0 480 160" role="img" aria-label="Bars comparing effort force and rope pulled for the chosen number of rope sections"></svg></div><p class="readout" id="plR" aria-live="polite"></p>', True),
    aid('real', 'Machines around you', table(['Machine', 'Type', 'What it trades'], [
      ['Wheelchair ramp', 'Inclined plane', 'Longer path for gentler push'], ['Axe, knife', 'Wedge', 'Force over a long edge becomes a splitting push'],
      ['Jar lid, bolt, light bulb base', 'Screw', 'Many turns for small, strong forward motion'], ['Flagpole, window blinds', 'Pulley', 'Direction change or force reduction'],
      ['Doorknob, steering wheel', 'Wheel and axle', 'Small turn at the rim for big turn at the axle, or the reverse']], 560), True)]),
  dict(toc='No free work', kicker='Work in, work out, efficiency', h2='Machines change the force, not the total work',
   idea='A machine can make the push smaller, bigger or differently aimed, but it cannot give out more work than you put in. Because of friction, <mark>work out</mark> is always less than <mark>work in</mark>. <mark>Efficiency</mark> = work out / work in. Energy is conserved; the missing work became thermal energy.',
   aids=[
    aid('analogy', 'Currency exchange', '<p class="cap">A machine is like a currency exchange: you can swap one big coin for many small ones, but you always lose a little to the fee. The fee here is friction.</p>'),
    aid('try', 'Where did the work go?', '<div class="chips" id="efChips" role="group" aria-label="Machine"></div><div id="efBars" class="bars"></div><p class="readout" id="efR" aria-live="polite"></p>', True),
    aid('data', 'Typical efficiencies', table(['Machine', 'Efficiency (typical)'], [
      ['Well-oiled bike gears', 'about 95%'], ['Simple pulley with some friction', 'about 70 to 90%'], ['Steep ramp with a smooth board', 'about 80 to 90%'],
      ['Long ramp with rough surface', 'about 40 to 60%'], ['Gasoline car engine', 'about 25 to 30%']], 420) +
      '<p class="cap">Values are rough. They show a pattern: more sliding surface means more friction and lower efficiency.</p>', True),
    aid('real', 'Design challenge', '<p class="cap"><b>Goal:</b> lift a 20 kg crate 1 m into a truck. <b>Criteria:</b> push under 100 N. <b>Constraints:</b> ramp under 5 m long, budget $40. Which machine and what length will you choose, and how will you test it (Unit 0, one change at a time)?</p>')])
 ],
 explain_q='You push a 300 N crate up a 6 m ramp to a platform 1.2 m high. Your friend says the ramp "saves work". Is your friend right? Compare the work needed to lift the crate straight up and the work you put in on the ramp.',
 explain_a='Lifting straight up takes 300 N &times; 1.2 m = 360 J. With no friction the ramp needs a 60 N push over 6 m, which is also 360 J. With friction the push is larger, so the work in is more than 360 J. The ramp reduced the force but did not save work.',
 glossary=[('work', 'Energy transferred when a force moves an object; force times distance in the direction of the force.'), ('joule', 'The unit of work and energy: one newton-meter.'), ('lever', 'A rigid bar that turns on a fulcrum.'),
   ('fulcrum', 'The pivot point of a lever.'), ('mechanical advantage', 'How many times a machine multiplies your force (load force / effort force).'), ('inclined plane', 'A ramp: a sloping surface that lets you raise a load with less force.'),
   ('pulley', 'A wheel with a rope that changes the direction or amount of force.'), ('efficiency', 'Work out divided by work in, often written as a percent.')],
 tutor='<p><b>Kit (about $12):</b> a spring scale (newtons), a ruler, a 1 m board, books, a toy cart or small crate, string, two pulleys or a "pulley" from spools and a dowel, a meter stick fulcrum, small weights.</p><ul><li><b>Concept 1:</b> Lift a known weight with the spring scale; compute work. Compare lifting it slowly and holding it still.</li><li><b>Concept 2:</b> Balance a meter stick on a pencil with weights at different distances; record effort distance and weight for each position.</li><li><b>Concept 3:</b> Pull the cart up ramps of 30, 60 and 120 cm to the same height with the spring scale. Record the force each time.</li><li><b>Concept 4:</b> Compute work in and out for each trial and efficiency.</li></ul><p><b>Common misconceptions:</b></p><ul><li>"Machines make work easier, so they save work." They reduce force; the work is the same or more.</li><li>"Holding a box is work." Not in physics terms, since the box does not move.</li><li>"A machine with a mechanical advantage of 3 triples the energy." It triples the force and reduces distance to a third.</li></ul><p><b>Pacing:</b> about four 30-minute sessions. <b>Method link:</b> change one thing at a time (ramp length, then surface) and repeat trials; see Unit 0.</p>',
 related_idea='Up next: <a href="unit-8.11-climate-evidence-and-change.html">Unit 8.11: Climate Evidence &amp; Change</a>.',
 related=[('unit-8.1-contact-forces-and-collisions.html', 'Unit 8.1: Contact Forces &amp; Collisions', 'Forces and torque.'), ('unit-8.2-energy-transformation-and-conservation.html', 'Unit 8.2: Energy Transformation &amp; Conservation', 'Energy is conserved.'),
   ('../6th/unit-03-forces-motion-and-energy.html', 'Unit 3: Forces, Motion &amp; Energy', 'Speed, force and energy basics.'), ('../k-5/unit-3-1-forces-motion-and-magnets.html', 'K-5 Unit 3.1: Forces, Motion &amp; Magnets', 'Pushes and pulls.'),
   ('../k-5/unit-00-how-science-works.html', 'Unit 0: How Science Works', 'Fair tests and design.')],
 footer='Built for eighth-grade tutoring. Work and simple machines are not named in the NGSS middle-school standards; this unit supports MS-PS2-2 (force and motion), MS-PS3-5 (energy transfer) and MS-ETS1-1 to MS-ETS1-4 (design). Values are rounded; weight uses 10 N per kg for easy arithmetic.',
 quiz=[
  dict(q='You lift a 50 N bag 2 m straight up. The work you do on it is...', o=['25 J', '52 J', '100 J'], a=2, e='Work = 50 N times 2 m = 100 J.'),
  dict(q='A student holds a 10 kg box still for a minute. The work done on the box is...', o=['Large', 'Zero', 'Equal to its weight'], a=1, e='The box does not move, so the distance is zero.'),
  dict(q='A crowbar has 0.2 m on the load side and 1.0 m on the effort side. Its ideal mechanical advantage is...', o=['0.2', '5', '1.2'], a=1, e='Effort arm / load arm = 1.0 / 0.2 = 5.'),
  dict(q='A longer ramp to the same height needs...', o=['A bigger push but less distance', 'A smaller push over a longer distance', 'The same push and distance'], a=1, e='A longer, gentler ramp reduces the force.'),
  dict(q='A pulley system with 4 rope sections holding the load (no friction). To lift a 400 N load you pull with about...', o=['100 N and pull 4 times as much rope', '400 N and pull the same rope', '1600 N'], a=0, e='Force is divided by 4 and rope length multiplied by 4.'),
  dict(q='Why is the work out of a real ramp less than the work in?', o=['Energy is destroyed', 'Friction turns some work into thermal energy', 'Gravity gets weaker'], a=1, e='Friction makes heat. Energy is conserved, not lost.')],
 js=[
  '''const F=$('#wkF'), D=$('#wkD'), svg=$('#wkSvg'), rd=$('#wkR');
const d=()=>{ const f=+F.value, x=+D.value; $('#wkFV').textContent=f; $('#wkDV').textContent=x;
 const w=f*x, X0=40, Y0=170, sw=x/10*400, sh=f/500*140;
 svg.innerHTML=`<line x1="${X0}" y1="${Y0}" x2="450" y2="${Y0}" style="stroke:var(--ink);stroke-width:2"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="20" style="stroke:var(--ink);stroke-width:2"/>
 <rect x="${X0}" y="${Y0-sh}" width="${sw}" height="${sh}" style="fill:var(--absorb);fill-opacity:.55;stroke:var(--absorb);stroke-width:2"/>
 <text x="245" y="192" font-size="12" text-anchor="middle">distance (0 to 10 m)</text><text transform="rotate(-90 14 95)" x="14" y="95" font-size="12" text-anchor="middle">force (0 to 500 N)</text>`;
 rd.innerHTML= w? `Work = ${f} N &times; ${x} m = <b>${w.toLocaleString()} J</b>. The shaded area is the work.`: 'Force or distance is zero, so the work done is <b>0 J</b>.'; };
F.addEventListener('input',d); D.addEventListener('input',d); d();''',
  '''quizBox($('#wkSort'),$('#wkSortS'),[
 {n:'Lifting a book from the floor to a shelf',a:0,e:'A force moves the book up: work.'},{n:'Holding a heavy suitcase still',a:1,e:'No movement, no work on the suitcase.'},
 {n:'Carrying a bag level along a hallway',a:1,e:'Your lifting force is up; the bag moves sideways. No work on it by that force.'},{n:'Pushing a stalled car that does not move',a:1,e:'The car does not move, so no work.'},
 {n:'Pushing a shopping cart across a store',a:0,e:'The push moves the cart: work.'},{n:'Pulling a sled along level snow with a rope',a:0,e:'The pull moves the sled along: work.'}],['Work done','No work done']);''',
  '''const X=$('#lvX'), svg=$('#lvSvg'), rd=$('#lvR');
const d=()=>{ const x=+X.value; $('#lvXV').textContent=x.toFixed(1); const L=300, e=3-x, F=L*x/e, MA=e/x;
 const px=m=>40+m/3*400, fx=px(x);
 svg.innerHTML=`<path d="M${px(0)} 110 L${px(3)} 110" style="stroke:var(--ink);stroke-width:8;stroke-linecap:round"/>
 <path d="M${fx-18} 160 L${fx} 114 L${fx+18} 160 Z" style="fill:var(--muted)"/>
 <rect x="${px(0)-4}" y="76" width="36" height="30" rx="4" style="fill:var(--absorb)"/><text x="${px(0)+14}" y="68" font-size="12" text-anchor="middle">load 300 N</text>
 <path d="M${px(3)} 36 V100" style="stroke:var(--reflect);stroke-width:5"/><path d="M${px(3)} 108 L${px(3)-8} 92 L${px(3)+8} 92 Z" style="fill:var(--reflect)"/><text x="${px(3)-4}" y="30" font-size="12" text-anchor="end">effort ${F.toFixed(0)} N</text>
 <text x="${(px(0)+fx)/2}" y="190" font-size="12" text-anchor="middle">${x.toFixed(1)} m</text><text x="${(fx+px(3))/2}" y="190" font-size="12" text-anchor="middle">${e.toFixed(1)} m</text>`;
 rd.innerHTML=`Effort needed: <b>${F.toFixed(0)} N</b> (mechanical advantage <b>${MA.toFixed(1)}</b>). To raise the load 10 cm you must move the effort end <b>${(MA*10).toFixed(0)} cm</b>. ${MA>1?'Less force, more distance.':MA<1?'More force, less distance: this setup is a speed gainer.':'Equal.'}`; };
X.addEventListener('input',d); d();''',
  '''const sl=$('#rpL'), chips=$('#rpChips'), bx=$('#rpBars'), rd=$('#rpR'); mkChips(chips,['No friction','Some friction (smooth board)'],0); let mu=0;
const W=300,H=1.2;
const d=()=>{ const L=+sl.value; $('#rpLV').textContent=L.toFixed(1); const s=H/L, c=Math.sqrt(1-s*s), F=W*(s+mu*c), win=F*L, wout=W*H;
 bars(bx,[['Push needed (N)',F,F.toFixed(0)+' N','a'],['Work in (J)',win,win.toFixed(0)+' J','a'],['Work out (J)',wout,wout.toFixed(0)+' J','t']],{labW:130,max:Math.max(W,win)*1.05});
 rd.innerHTML=`Push <b>${F.toFixed(0)} N</b> over ${L.toFixed(1)} m: work in <b>${win.toFixed(0)} J</b>. Lifting straight up needs ${wout} J. Efficiency <b>${(100*wout/win).toFixed(0)}%</b>. ${mu? 'A longer ramp lowers the push but adds more friction work.':'With no friction the work is the same on every ramp.'}`; };
chipsOn(chips,i=>{mu=i?0.2:0;d();}); sl.addEventListener('input',d); d();''',
  '''const N=$('#plN'), svg=$('#plSvg'), rd=$('#plR');
const d=()=>{ const n=+N.value; $('#plNV').textContent=n; const load=600, h=0.5, F=load/n, rope=h*n;
 const bw=(v,m)=>Math.round(v/m*300);
 svg.innerHTML=`<text x="10" y="30" font-size="12">Effort force (N)</text><rect x="150" y="14" width="${bw(F,600)}" height="22" style="fill:var(--reflect)"/><text x="${160+bw(F,600)}" y="31" font-size="12">${F.toFixed(0)} N</text>
 <text x="10" y="80" font-size="12">Rope you pull (m)</text><rect x="150" y="64" width="${bw(rope,3)}" height="22" style="fill:var(--absorb)"/><text x="${160+bw(rope,3)}" y="81" font-size="12">${rope.toFixed(1)} m</text>
 <text x="10" y="130" font-size="12">Work in (J)</text><rect x="150" y="114" width="${bw(F*rope,600)}" height="22" style="fill:var(--transmit)"/><text x="${160+bw(F*rope,600)}" y="131" font-size="12">${(F*rope).toFixed(0)} J</text>`;
 rd.innerHTML=`Lifting a 600 N load 0.5 m with ${n} rope section${n>1?'s':''}: pull with about <b>${F.toFixed(0)} N</b> over <b>${rope.toFixed(1)} m</b> of rope. The work is the same <b>${(F*rope).toFixed(0)} J</b> in every case (friction ignored).`; };
N.addEventListener('input',d); d();''',
  '''const M=[{n:'Ramp (smooth board)',win:420,wout:360,t:'Some of your work is lost sliding against the board.'},{n:'Pulley (some friction)',win:380,wout:300,t:'Friction in the wheel bearings and the rope bends takes some work.'},{n:'Bike gears (oiled)',win:316,wout:300,t:'Very little is lost: a clean, oiled chain is efficient.'},{n:'Rough ramp (carpet)',win:700,wout:360,t:'Lots of sliding friction: about half the work is lost.'}];
const chips=$('#efChips'), bx=$('#efBars'), rd=$('#efR'); mkChips(chips,M.map(m=>m.n),0);
const d=i=>{ const m=M[i]; bars(bx,[['Work in',m.win,m.win+' J','a'],['Work out',m.wout,m.wout+' J','t'],['Lost as heat',m.win-m.wout,(m.win-m.wout)+' J','r']],{labW:110,max:m.win*1.05});
 rd.innerHTML=`${m.t} Efficiency <b>${(100*m.wout/m.win).toFixed(0)}%</b>. The "lost" work was not destroyed; it became thermal energy. Example values for teaching.`; };
chipsOn(chips,d); d(0);''']
)
