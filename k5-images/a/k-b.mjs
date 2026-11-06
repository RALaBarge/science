import { Page, icon, svg, fig, quiz, tryCell, T, R, C, E, L, P, arrow, sun, person, cloud, tree, check, cross, INK, MUTED, LINE, S2, SURF, BEAM, BLUE, ORANGE, TEAL, RED, GREEN, SHADE } from './lib.mjs';
import { deer, robin, beaver, bee, flower, fish, bird, BROWN, SAND, pondPanel, forestPanel, dunePanel } from './shapes.mjs';
export const log = [];
const st = (file, concept, type, status, what, check = '') => log.push({ file: `k-5/${file}`, concept, type, status, what, check });
const face = (x, y, r, big) => C(x, y, r, BEAM, INK, 2) + C(x - r * 0.35, y - r * 0.2, r * 0.1, INK) + C(x + r * 0.35, y - r * 0.2, r * 0.1, INK) + P(big ? `M${x - r * 0.5} ${y + r * 0.2} q${r * 0.5} ${r * 0.6} ${r} 0` : `M${x - r * 0.4} ${y + r * 0.35} q${r * 0.4} ${r * 0.2} ${r * 0.8} 0`, 'none', INK, 2);
const heat = (x, y) => P(`M${x} ${y} q-6 -8 0 -16 t0 -16`, 'none', RED, 3) + P(`M${x + 14} ${y} q-6 -8 0 -16 t0 -16`, 'none', RED, 3);
const sunRays = (x, y, x2, y2, n = 4, dx = 20) => Array.from({ length: n }, (_, i) => arrow(x + i * dx, y, x2 + i * dx, y2, BEAM, 3, 10)).join('');

// ================= K-B =================
{
  const F = 'unit-k-b-sunlight-weather-and-staying-safe.html', p = new Page(F);
  // s1 analogy: Sun like a faraway lamp
  let b = sun(70, 70, 22) + sunRays(36, 112, 36, 160, 5, 18) + R(10, 168, 200, 24, GREEN, INK, 4, 2) + T(110, 222, ['The Sun is far away.', 'It lights and warms the ground.'], { s: 14 });
  b += L(240, 40, 240, 230, LINE, 2, '6 6');
  b += P('M330 70 L360 70 L370 100 L320 100 Z', BEAM, INK, 3) + L(345, 100, 345, 160, INK, 4) + sunRays(318, 108, 300, 160, 3, 28) + R(280, 168, 190, 24, S2, INK, 4, 2) + R(310, 164, 130, 6, SURF, INK, 2, 1.5) + T(375, 222, ['A lamp is close.', 'It lights and warms the paper.'], { s: 14 });
  p.addFig('s1', 'analogy', 1, 'kb-sun-lamp', fig('kb-sun-lamp', svg('kb-sun-lamp', 'The Sun is like a faraway lamp', 'Left: the Sun far above shining arrows of light down onto the ground. Right: a table lamp shining arrows of light down onto a sheet of paper.', 250, b, false),
    'The Sun and a lamp both send out light. The Sun is much, much farther away, but its light still reaches us and warms what it shines on.', 'Left: the Sun with rays of light reaching the ground. Right: a lamp with rays of light reaching paper.'));
  // s1 data: warm chart
  b = T(120, 36, 'Black paper', { s: 17, w: 700 }) + T(360, 36, 'White paper', { s: 17, w: 700 });
  b += R(60, 110, 120, 60, 'var(--shade, #222A4A)', INK, 6, 3) + R(300, 110, 120, 60, SURF, INK, 6, 3) + heat(100, 104) + heat(136, 104);
  b += face(120, 214, 26, true) + face(360, 214, 26, false) + T(120, 262, 'warm', { s: 18, w: 700, f: ORANGE }) + T(360, 262, 'cooler', { s: 18, w: 700, f: BLUE });
  p.addFig('s1', 'data', 1, 'kb-warm-chart', fig('kb-warm-chart', svg('kb-warm-chart', 'Which paper felt warmer?', 'A picture chart. Black paper in the sun has heat lines above it and a big smiling face, labeled warm. White paper has a small smile, labeled cooler.', 282, b, false),
    'Example result. Black paper felt warm. White paper felt cooler. Your own hands might feel it differently, so write down what you feel.', 'Black paper: warm (big smile). White paper: cooler (small smile). Example, not measured numbers.'));
  // s1 real: pavement and grass
  b = R(10, 70, 210, 40, 'var(--shade, #222A4A)', INK, 4, 3) + heat(60, 62) + heat(110, 62) + heat(160, 62) + sun(50, 36, 12) + T(115, 140, ['Dark road', 'feels hot'], { s: 16, w: 700, f: ORANGE });
  b += R(260, 70, 210, 40, GREEN, INK, 4, 3) + sun(300, 36, 12) + T(365, 140, ['Grass', 'feels cooler'], { s: 16, w: 700, f: BLUE });
  p.addFig('s1', 'real', 1, 'kb-pavement', fig('kb-pavement', svg('kb-pavement', 'Dark road and grass in the sun', 'A dark road with heat lines rising from it, labeled feels hot. A strip of grass, labeled feels cooler.', 176, b, false), 'On a sunny day a dark road can feel hot. Grass stays cooler. Never walk on hot pavement in bare feet.', 'Dark road in the sun feels hot; grass feels cooler.'));
  // s2 diagram: shade ice cubes
  const cube = (x, y) => R(x, y, 44, 40, 'var(--transmit, #9bd7f0)', INK, 6, 2.5) + T(x + 22, y + 26, 'ice', { s: 13, w: 700 });
  b = sun(60, 62, 16) + sun(300, 62, 16);
  b += sunRays(100, 62, 170, 120, 1, 0) + arrow(104, 76, 150, 128, BEAM, 3, 10) + L(110, 150, 110, 190, INK, 3) + L(210, 150, 210, 190, INK, 3) + R(100, 136, 120, 12, SHADE, INK, 3, 2) + cube(138, 194) + R(80, 238, 160, 8, S2, INK, 2, 1.5);
  b += arrow(320, 86, 340, 140, BEAM, 4, 11) + arrow(350, 78, 370, 140, BEAM, 4, 11) + arrow(380, 70, 398, 140, BEAM, 4, 11) + cube(350, 194) + R(300, 238, 160, 8, S2, INK, 2, 1.5);
  b += T(160, 270, 'Shade: sunlight is blocked', { s: 15, w: 700, f: BLUE }) + T(380, 270, 'No shade: sunlight hits it', { s: 15, w: 700, f: ORANGE });
  p.addFig('s2', 'diagram', 1, 'kb-shade-cubes', fig('kb-shade-cubes', svg('kb-shade-cubes', 'Ice cube with shade and without', 'Two ice cubes. The left one sits under a card held on sticks, so the sunlight arrows stop at the card. The right one has sunlight arrows landing right on it.', 296, b, false),
    'The card blocks the sunlight. The shaded ice cube gets less warming, so it should melt more slowly.', 'Left: ice cube under a shade card, sunlight blocked. Right: ice cube in direct sunlight.'));
  p.setBody('s2', 'try', 1, tryCell({
    guess: 'Two ice cubes are in the same sunny spot. One gets a shade. Which one melts slower?',
    need: '2 ice cubes of the same size, 2 trays, a paper card and craft sticks (or a paper cup turned over) for the shade, a sunny window or a lamp.',
    do: 'Put one ice cube on each tray in the sun. Build a small shade over only one. Count slowly to 60, or wait 10 minutes, then look. Draw how big each cube is now. Do it again if you can.',
    notice: 'The shaded cube is bigger and has fewer drops of water around it.',
    why: 'Shade blocks sunlight, so less warming happens. That is why a shady spot feels cooler.',
    safety: 'An adult handles any warm lamp. Wipe up water so no one slips.', tip: 'Which ice cube melts slower?'
  }));
  b = R(250, 130, 12, 100, INK, INK, 2, 1) + P('M170 130 Q256 40 342 130 Z', RED, INK, 3) + P('M200 130 Q256 60 256 130', 'none', SURF, 3) + sun(60, 50, 16) + arrow(86, 56, 176, 106, BEAM, 3, 10) + P('M174 130 L174 232 L338 232 L338 130', 'none', 'none', 0) + R(130, 232, 250, 8, SAND, INK, 2, 1.5) + person(210, 232, 0.8, BLUE) + T(300, 190, 'shade', { s: 14, w: 700 }) + L(180, 232, 336, 232, SHADE, 4, '2 4');
  p.addFig('s2', 'real', 1, 'kb-umbrella', fig('kb-umbrella', svg('kb-umbrella', 'A beach umbrella makes shade', 'A beach umbrella with the Sun on the left. The umbrella blocks the sunlight and makes a shaded spot on the sand where a person stands.', 262, b, false), 'The umbrella blocks sunlight and makes a shady spot. On a Michigan beach, shade helps people stay cooler.', 'A beach umbrella blocks sunlight from the Sun and makes shade where a person stands.'));
  // s3 try
  p.setBody('s3', 'try', 1, tryCell({
    guess: 'What will the weather be like today: sun, cloud, rain, or snow?',
    need: 'a class calendar, weather stickers or crayons (sun, cloud, rain, snow).',
    do: 'Each morning, look out the window together. Say what you see. Put the matching sticker or drawing on today’s square. Do this for many days.',
    notice: 'After a few weeks, count each kind. Which kind came most? Did the weather change when the seasons changed?',
    why: 'One day does not show a pattern. Many days written down do.',
    tip: 'Sun, cloud, rain, snow. Mark today.'
  }));
  const wx = (x, kind) => {
    let o = '';
    if (kind === 'sun') o += sun(x, 108, 24);
    if (kind === 'cloud') o += cloud(x, 108, 1.4);
    if (kind === 'rain') o += cloud(x, 92, 1.3) + [-20, 0, 20].map((d) => L(x + d, 120, x + d - 5, 142, BLUE, 4)).join('');
    if (kind === 'snow') o += cloud(x, 92, 1.3) + [-20, 0, 20].map((d, i) => `<text x="${x + d}" y="${142 - (i % 2) * 6}" text-anchor="middle" font-size="22" fill="${INK}">*</text>`).join('');
    return o + T(x, 186, { sun: 'sunny', cloud: 'cloudy', rain: 'rainy', snow: 'snowy' }[kind], { s: 17, w: 700 });
  };
  b = ['sun', 'cloud', 'rain', 'snow'].map((k, i) => R(12 + i * 116, 52, 104, 160, SURF, INK, 12, 2) + wx(64 + i * 116, k)).join('');
  p.addFig('s3', 'diagram', 1, 'kb-weather-row', fig('kb-weather-row', svg('kb-weather-row', 'Weather symbols', 'Four weather pictures in a row with their names: a sun for sunny, a cloud for cloudy, a cloud with raindrops for rainy, and a cloud with snowflakes for snowy.', 236, b, false), 'These pictures stand for the weather. Use them to mark the calendar and to sort days: sunny, cloudy, rainy, snowy.', 'Row of four symbols: sunny, cloudy, rainy, snowy.'));
  // s4 analogy
  p.setBody('s4', 'analogy', 1, `<p>A forecast is like a helper note about tomorrow. <b>Forecast</b> = the note. <b>Weather coming</b> = what the note tells you. <b>Your coat or boots</b> = what you do because of it.</p><p>A note cannot be perfect, because weather can change, so we check the forecast again.</p><p class="tip">“A forecast helps you choose a coat.”</p>`);
  // s4 data: sample forecast card
  const day = (x, nm, kind, tmp) => R(x, 50, 140, 170, SURF, INK, 12, 2) + T(x + 70, 78, nm, { s: 16, w: 700 }) + (kind === 'sun' ? sun(x + 70, 130, 22) : kind === 'rain' ? cloud(x + 70, 122, 1.2) + [-14, 4, 22].map((d) => L(x + 70 + d, 140, x + 66 + d, 160, BLUE, 4)).join('') : cloud(x + 70, 122, 1.2) + [-14, 4, 22].map((d) => `<text x="${x + 70 + d}" y="160" text-anchor="middle" font-size="20" fill="${INK}">*</text>`).join('')) + T(x + 70, 200, tmp, { s: 16 });
  b = day(8, 'Today', 'sun', 'sunny, 68°F') + day(170, 'Tomorrow', 'rain', 'rain, 55°F') + day(332, 'Next day', 'snow', 'snow, 30°F');
  p.addFig('s4', 'data', 1, 'kb-forecast', fig('kb-forecast', svg('kb-forecast', 'A forecast for three days', 'A made-up forecast card for three days. Today is sunny and 68 degrees Fahrenheit, tomorrow is rainy and 55, and the day after is snowy and 30.', 244, b, false),
    'A made-up example forecast to read together. Ask: What will tomorrow be like? What should we wear? What will we need on the next day?', 'Today: sunny 68 F. Tomorrow: rain 55 F. Next day: snow 30 F. Example numbers, not a real forecast.'));
  // s4 real: winter storm watch
  b = R(20, 50, 440, 150, SURF, INK, 14, 3) + R(20, 50, 440, 38, ORANGE, INK, 14, 3) + T(240, 76, 'WINTER STORM WATCH', { s: 19, w: 800, f: 'var(--on-color, #fff)' }) + cloud(86, 132, 1.3) + [66, 86, 106].map((x, i) => `<text x="${x}" y="${176 - (i % 2) * 8}" text-anchor="middle" font-size="22" fill="${INK}">*</text>`).join('') + T(290, 124, ['Heavy snow may come.', 'It is a “get ready” note.'], { s: 16, w: 700 }) + T(290, 168, 'Warm coat. Food at home. Stay off the roads.', { s: 14 });
  p.addFig('s4', 'real', 1, 'kb-storm-watch', fig('kb-storm-watch', svg('kb-storm-watch', 'A winter storm watch', 'A warning card that says winter storm watch, with a snow cloud, saying heavy snow may come and families should get ready: warm coat, food at home, stay off the roads.', 224, b, false), 'A watch means a storm is possible. It gives families time to get ready.', 'Card: Winter storm watch. Heavy snow may come. Get ready: warm coat, food at home, stay off the roads.'));
  // s4 try: picture sort quiz
  p.addFig('s4', 'try', 1, 'kb-what-do-we-do', quiz('kb-what-do-we-do', 'Guess first, then choose. What do we do?', [
    { q: 'Thunderstorm: lightning and loud thunder. What do we do?', icon: icon('kb-q1', 'A dark cloud with a lightning bolt.', cloud(80, 66, 1.8, 'var(--surface-2, #E8EDF6)') + P('M80 80 L66 106 L82 106 L70 128', 'none', BEAM, 5)), opts: ['Go inside', 'Play in the open field', 'Climb a tree'], a: 0, why: 'Thunderstorm: go inside a safe building.' },
    { q: 'Tornado warning: a tornado may be near. What do we do?', icon: icon('kb-q2', 'A funnel-shaped tornado cloud.', cloud(80, 34, 1.8) + P('M34 52 L126 52 L108 74 L100 74 L90 98 L82 98 L84 116 L76 116 L78 78 Z', 'var(--muted, #6b7390)', INK, 2)), opts: ['Watch it from the window', 'Go to the safe room', 'Run outside'], a: 1, why: 'Tornado: go to the safe room, low in the building and away from windows.' },
    { q: 'Blizzard: lots of snow and wind. What do we do?', icon: icon('kb-q3', 'A snow cloud with many snowflakes.', cloud(80, 40, 1.8) + [44, 66, 88, 110, 56, 100].map((x, i) => `<text x="${x}" y="${88 + (i % 3) * 14}" text-anchor="middle" font-size="22" fill="var(--ink, #12172B)">*</text>`).join('')), opts: ['Stay off the roads', 'Go for a long drive', 'Go sledding alone'], a: 0, why: 'Blizzard: stay home and stay off the roads until it is safe.' }
  ], 'Picture sort: pick the safe thing to do for each kind of weather. A grown-up reads each card out loud.'));
  // kit what you do
  p.setBody('kit', 'try', 2, `<h3>What you do</h3>
      <p><b>1. Black and white paper (10 minutes).</b> Lay both papers in the sun or under a lamp. Guess first: which will feel warmer? Wait a few minutes, then touch each.</p>
      <p><b>2. Shade for an ice cube (15 minutes).</b> Build a shade over one ice cube, leave the other uncovered, and compare the melting. Run it two times.</p>
      <p><b>3. Weather calendar (2 minutes a day).</b> Mark the weather each day for a few weeks. Count the days at the end.</p>
      <p><b>4. Safety sort.</b> Use the picture sort above for thunderstorm, tornado, and blizzard.</p>
      <p><b>Look for:</b> black paper warmer than white; shaded ice melting slower; which weather came most days.</p>`);
  const fl = [['Sunlight warms and lights surfaces', 'analogy', 'Drew Sun-as-lamp comparison'], ['Sunlight warms and lights surfaces', 'data', 'Drew picture chart of black vs white paper (qualitative, no invented numbers)'], ['Sunlight warms and lights surfaces', 'real', 'Drew dark road vs grass'], ['Shade can keep things cooler', 'diagram', 'Drew shaded and unshaded ice cubes'], ['Shade can keep things cooler', 'try', 'Rewrote with guess, materials, steps, result'], ['Shade can keep things cooler', 'real', 'Drew beach umbrella shade'], ['Weather has patterns over time', 'try', 'Rewrote with steps'], ['Weather has patterns over time', 'diagram', 'Drew four weather symbols'], ['Forecasts help us get ready and stay safe', 'analogy', 'Spelled out the mapping (forecast = note)'], ['Forecasts help us get ready and stay safe', 'try', 'Built a 3-card picture-sort quiz (go inside / safe room / stay off roads)'], ['Forecasts help us get ready and stay safe', 'data', 'Added a made-up three-day forecast card, labelled as an example'], ['Forecasts help us get ready and stay safe', 'real', 'Drew a winter storm watch card'], ['Try it at home or in class', 'try', 'Station steps and timings added']];
  fl.forEach(([c, t, w]) => st(F, c, t, 'done', w, t === 'try' && c.startsWith('Try') ? 'Timings are suggestions' : (c.startsWith('Forecasts') && t === 'data' ? 'Example temperatures are made up and labelled so' : '')));
  p.save();
}
