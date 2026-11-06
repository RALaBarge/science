import { Page, tag, icon, svg, fig, quiz, tryCell, T, R, C, E, L, P, arrow, sun, person, cloud, tree, check, cross, INK, MUTED, LINE, S2, SURF, BEAM, BLUE, ORANGE, TEAL, RED, GREEN, SHADE } from './lib.mjs';
import { deer, robin, beaver, bee, flower, fish, bird, mapleLeaf, BROWN, SAND } from './shapes.mjs';
export const log = [];
const st = (file, concept, type, status, what, check = '') => log.push({ file: `k-5/${file}`, concept, type, status, what, check });
// table helper: header row + rows of strings; cells 'Y'/'N' drawn as marks
function table(x, y, widths, head, rows, o = {}) {
  let b = '', cx = x; const rh = o.rh || 44;
  head.forEach((h, i) => { b += T(cx + (i ? widths[i] / 2 : 8), y + 22, h, { s: 13, w: 700, a: i ? 'middle' : 'start' }); cx += widths[i]; });
  rows.forEach((r, k) => { const yy = y + 32 + k * (rh + 6); cx = x; b += R(x, yy, widths.reduce((a, c) => a + c, 0), rh, SURF, LINE, 8, 1.5);
    r.forEach((c, i) => { if (c === 'Y') b += check(cx + widths[i] / 2, yy + rh / 2 - 2); else if (c === 'N') b += cross(cx + widths[i] / 2, yy + rh / 2); else b += T(cx + (i ? widths[i] / 2 : 8), yy + rh / 2 + 5, c, { s: 14, w: i ? 400 : 700, a: i ? 'middle' : 'start' }); cx += widths[i]; }); });
  return b;
}
const moon = (x, y, r, ph) => C(x, y, r, SHADE, INK, 2) + (ph === 'full' ? C(x, y, r, BEAM, INK, 2) : ph === 'half' ? P(`M${x} ${y - r} A${r} ${r} 0 0 1 ${x} ${y + r} Z`, BEAM, INK, 2) : ph === 'halfL' ? P(`M${x} ${y - r} A${r} ${r} 0 0 0 ${x} ${y + r} Z`, BEAM, INK, 2) : P(`M${x} ${y - r} A${r} ${r} 0 0 1 ${x} ${y + r} A${r * 0.45} ${r} 0 0 0 ${x} ${y - r} Z`, BEAM, INK, 2));

// ================= 1-A =================
{
  const F = 'unit-1-a-sound-and-light.html', p = new Page(F);
  // ruler
  let b = R(0, 190, 150, 60, BROWN, INK, 4, 3) + R(100, 168, 200, 18, BEAM, INK, 3, 2) + R(106, 160, 40, 30, SURF, 'none', 0, 0);
  b = R(0, 190, 160, 56, BROWN, INK, 4, 3) + R(110, 170, 220, 18, BEAM, INK, 3, 2) + P('M330 172 q18 -18 0 -36', 'none', INK, 3) + P('M330 188 q22 20 0 40', 'none', INK, 3) + T(300, 126, 'shakes', { s: 15, w: 700 });
  b += person(430, 240, 1.1, BLUE) + P('M398 184 q-14 12 0 26', 'none', ORANGE, 4) + P('M380 176 q-22 20 0 44', 'none', ORANGE, 4) + P('M362 168 q-30 28 0 62', 'none', ORANGE, 4) + T(380, 258, 'sound', { s: 15, w: 700, f: ORANGE }) + T(430, 100, 'ear', { s: 14, w: 700 }) + L(430, 108, 430, 148, MUTED, 2, '4 4') + L(60, 160, 60, 160, INK, 1) + T(60, 224, 'table', { s: 14, w: 700, f: SURF });
  p.addFig('s1', 'diagram', 1, '1a-ruler', fig('1a-ruler', svg('1a-ruler', 'A shaking ruler makes sound', 'A ruler stuck out over the edge of a table. Curved lines show it shaking up and down. Curved sound lines travel from the ruler to a child’s ear.', 280, b, false),
    'Hold one end of a ruler on a table and flick the other end. The ruler shakes (vibrates). The shaking makes sound that travels to your ear.', 'A ruler over a table edge, shaking; sound lines reach a child’s ear.'));
  // hum
  b = person(150, 220, 2) + P('M150 160 q-14 8 0 14', 'none', INK, 0) + R(120, 162, 24, 12, SURF, 'none', 0, 0) + P('M170 160 q28 -10 30 20', 'none', 'none', 0) + E(172, 140, 14, 8, ORANGE, INK, 2) + L(160, 150, 150, 170, INK, 4);
  b += [0, 1, 2].map((i) => P(`M${200 + i * 26} ${118 - i * 4} q${14} ${22 + i * 4} 0 ${44 + i * 8}`, 'none', ORANGE, 4)).join('') + tag(290, 100, 'the buzz', { s: 15 }) + tag(150, 212, 'fingers on throat', { s: 13 });
  p.addFig('s1', 'real', 1, '1a-hum', fig('1a-hum', svg('1a-hum', 'Feel the buzz when you hum', 'A child with fingers touching their throat while humming. Wavy lines come from the mouth.', 276, b, false), 'Hum a song and rest your fingers on your throat. You feel a buzz. That buzz is a vibration, and it makes the sound you hear.', 'A child with a hand on the throat, humming: sound lines come out.'));
  // observation log
  b = table(8, 44, [200, 130, 130], ['Thing', 'Did it shake?', 'Did it make sound?'], [['Rubber band, plucked', 'Y', 'Y'], ['Drum skin, tapped', 'Y', 'Y'], ['Throat, humming', 'Y', 'Y'], ['Rubber band, held still', 'N', 'N']], { rh: 40 });
  p.addFig('s1', 'data', 1, '1a-log', fig('1a-log', svg('1a-log', 'Our observation log', 'A table with three columns: thing, did it shake, did it make sound. A plucked rubber band, a tapped drum skin and a humming throat all shake and make sound. A rubber band held still does neither.', 262, b, false), 'Example log. When it shakes, there is sound. When it is still, there is none. Fill in your own log as you test.', 'Plucked rubber band: shakes yes, sound yes. Drum: yes, yes. Humming throat: yes, yes. Held still: no, no.'));
  // s2 real: lamp
  const room = (x, lit) => R(x, 50, 210, 160, lit ? BEAM : 'var(--shade, #222A4A)', INK, 10, 3) + R(x + 14, 150, 110, 40, lit ? BLUE : 'var(--shade, #151a30)', INK, 4, 2) + (lit ? C(x + 70, 134, 14, ORANGE, INK, 2) + C(x + 62, 130, 2, INK) + C(x + 78, 130, 2, INK) : '') + R(x + 150, 70, 8, 80, INK, INK, 2, 1) + P(`M${x + 134} 70 L${x + 174} 70 L${x + 166} 52 L${x + 142} 52 Z`, lit ? BEAM : 'var(--muted, #6b7390)', INK, 2) + (lit ? [0, 1, 2].map((i) => L(x + 154, 76, x + 110 + i * 24, 128, BEAM, 2)).join('') : '');
  b = room(8, false) + room(262, true) + T(113, 236, 'Lamp off: dark', { s: 15, w: 700 }) + T(367, 236, 'Lamp on: I see my toy', { s: 15, w: 700 }).replace('x="367"', 'x="367"');
  p.addFig('s2', 'real', 1, '1a-lamp', fig('1a-lamp', svg('1a-lamp', 'A lamp helps you find your toy', 'Left: a dark bedroom with the lamp off, so the toy cannot be seen. Right: the lamp is on, light fills the room, and the toy on the bed can be seen.', 262, b, false), 'In the dark you cannot see the toy. Turn the lamp on and light bounces off the toy into your eyes, so you can find it.', 'Dark room with lamp off, no toy visible; lit room with lamp on, toy visible.'));
  // s2 data: tally
  b = table(8, 44, [190, 135, 135], ['Thing', 'Seen in the dark?', 'Seen with light?'], [['Toy', 'N', 'Y'], ['Book', 'N', 'Y'], ['Lamp (makes its own light)', 'Y', 'Y']], { rh: 44 });
  p.addFig('s2', 'data', 1, '1a-seen', fig('1a-seen', svg('1a-seen', 'What can we see?', 'A table. Toy: not seen in the dark, seen with light. Book: not seen in the dark, seen with light. Lamp that makes its own light: seen in both.', 224, b, false), 'Example tally. Things that only reflect light need a light on to be seen. A lit lamp makes its own light, so we can see it even in the dark.', 'Toy: no/yes. Book: no/yes. Lamp (makes its own light): yes/yes.'));
  // s3 data: materials table with beams
  const mrow = (y, name, pass, res) => R(8, y, 464, 56, SURF, LINE, 8, 1.5) + T(18, y + 33, name, { s: 15, w: 700, a: 'start' }) + R(190, y + 8, 14, 40, S2, INK, 2, 2) + R(190, y + 8, 14, 40, pass === 0 ? INK : pass === 1 ? 'var(--surface, #fff)' : 'var(--transmit, #9bd7f0)', INK, 2, 2) + L(140, y + 28, 190, y + 28, BEAM, 5) + (pass > 0 ? L(204, y + 28, 204 + pass * 60, y + 28, BEAM, pass === 1 ? 3 : 6) : '') + T(400, y + 33, res, { s: 15, w: 700 });
  b = mrow(44, 'Clear plastic', 2, 'light goes through') + mrow(106, 'Wax paper', 1, 'a little, blurry') + mrow(168, 'Cardboard', 0, 'light is blocked');
  b = b.replace(/T\(400,/g, 'T(380,');
  p.addFig('s3', 'data', 1, '1a-materials', fig('1a-materials', svg('1a-materials', 'What the light did', 'A results table with a flashlight beam hitting three materials. Clear plastic: light goes through. Wax paper: a little light goes through, blurry. Cardboard: light is blocked.', 238, b, false), 'The beam is the yellow line. It goes right through clear plastic, partly through wax paper, and stops at cardboard.', 'Clear plastic: through. Wax paper: some, blurry. Cardboard: blocked.'));
  // s3 real: window and curtain
  b = R(20, 50, 190, 160, BEAM, INK, 6, 3) + L(115, 50, 115, 210, INK, 3) + L(20, 130, 210, 130, INK, 3) + R(260, 50, 190, 160, 'var(--shade, #3a2f55)', INK, 6, 3) + [276, 304, 332, 360, 388, 416].map((x) => L(x, 56, x, 206, INK, 3)).join('');
  b += T(115, 236, 'Window: bright', { s: 15, w: 700 }) + T(355, 236, 'Curtain: darker', { s: 15, w: 700 });
  p.addFig('s3', 'real', 1, '1a-window', fig('1a-window', svg('1a-window', 'A window and a curtain', 'A bright window letting light in, and a closed curtain letting only a little light in so the room is darker.', 258, b, false), 'A window is clear, so light passes through and the room is bright. A curtain blocks most of the light, so the room is darker.', 'Window: bright. Curtain: darker.'));
  // s4
  p.setBody('s4', 'analogy', 1, `<p>A flashlight blink is like a <b>knock on a door</b>. <b>Knock or blink</b> = the signal. <b>The pattern of knocks or blinks</b> = the message. <b>The person at the door</b> = your partner who decodes it.</p><p>Where it breaks: a door knock is usually not a secret code, but your partner and you agree on one.</p><p class="tip">“A pattern can say something.”</p>`);
  p.setBody('s4', 'try', 1, tryCell({
    guess: 'Can your partner understand your message from across the room? Guess how many of 4 they will get.',
    need: 'a ready-made flashlight or LED lamp, or a pencil and a hard surface for tapping; paper and crayons for the code.',
    do: 'Make a code with your partner. Example: flash-flash-pause = “hello”. Tap-tap-stop = “stop”. Pick 4 messages. Send each one. Your partner watches or listens and writes what they decode. Then compare.',
    notice: 'Which messages did your partner get right? Were short patterns easier than long ones?',
    why: 'A pattern of flashes or beats can carry a message even when no one talks.',
    safety: 'Never shine a light into anyone’s eyes. Do not open the flashlight.', tip: 'My partner watches or listens.'
  }));
  b = [0, 1, 2, 3].map((i) => R(20 + i * 112, 56, 96, 96, SURF, INK, 12, 2) + T(68 + i * 112, 82, 'Message ' + (i + 1), { s: 14, w: 700 }) + (i < 3 ? check(68 + i * 112, 124) : cross(68 + i * 112, 122))).join('') + T(240, 190, 'My partner got 3 of 4 messages.', { s: 17, w: 700 });
  p.addFig('s4', 'data', 1, '1a-signals', fig('1a-signals', svg('1a-signals', 'Signal test', 'Four boxes for four messages. Messages one, two and three have a check mark because the partner decoded them. Message four has a cross because it was missed.', 216, b, false), 'Example signal test. A check means the partner decoded it. Three of four messages got through. Count your own.', 'Messages 1, 2, 3 decoded; message 4 missed. 3 of 4.'));
  b = R(0, 220, 480, 40, BLUE, 'none', 0, 0) + P('M200 220 L214 90 L266 90 L280 220 Z', SURF, INK, 3) + R(204, 130, 72, 24, RED, INK, 0, 2) + R(214, 62, 52, 28, 'var(--shade, #222A4A)', INK, 3, 2) + P('M210 62 L240 40 L270 62 Z', RED, INK, 2) + C(240, 76, 8, BEAM, INK, 1.5) + [0, 1, 2].map((i) => L(262 + i * 0, 76 - i * 0, 300 + i * 54, 60 + i * 12 - (i === 1 ? 4 : 0), BEAM, 4 - i)).join('') + [0, 1, 2].map((i) => L(218, 76, 180 - i * 54, 60 + i * 12, BEAM, 4 - i)).join('') + T(240, 30, 'flash . pause . flash flash', { s: 14, w: 700 });
  b = b.replace(/<text[^>]*>flash \. pause[^<]*<\/text>/, T(240, 28, 'a pattern of flashes', { s: 15, w: 700 }));
  p.addFig('s4', 'real', 1, '1a-lighthouse', fig('1a-lighthouse', svg('1a-lighthouse', 'A lighthouse sends a pattern', 'A lighthouse on the shore at night with beams of light going out to the left and to the right over the water.', 270, b, false), 'A lighthouse flashes its own pattern of light so boats know where they are. Michigan has many lighthouses on the Great Lakes.', 'Lighthouse with beams of light over the water.'));
  p.setBody('kit', 'try', 2, `<h3>What you do</h3>
      <p>Rotate through four stations, about 10 minutes each.</p>
      <p><b>1. Sound makers.</b> Pluck a rubber band over a cup. Tap a drum with rice on top. Hum with fingers on your throat. Mark: did it shake? did it make sound?</p>
      <p><b>2. Mystery box.</b> Peek in with the light port closed, then open a flashlight port. What changed?</p>
      <p><b>3. Light beam.</b> Shine a flashlight on clear plastic, wax paper, cardboard, and foil. Write: through, some, blocked, or bounces.</p>
      <p><b>4. Signal device.</b> Make a code, send four messages, and count how many your partner decodes.</p>`);
  [['Vibrations make sound; sound makes things vibrate', 'diagram', 'Drew ruler shaking with sound reaching ear'], ['Vibrations make sound; sound makes things vibrate', 'real', 'Drew humming child with hand on throat'], ['Vibrations make sound; sound makes things vibrate', 'data', 'Drew observation log table'], ['We see only what is lit', 'data', 'Drew seen-in-dark / seen-with-light table'], ['We see only what is lit', 'real', 'Drew dark vs lit bedroom'], ['Materials in a light beam', 'data', 'Drew results table with beam through each material'], ['Materials in a light beam', 'real', 'Drew window and curtain'], ['Sending messages with light or sound', 'analogy', 'Spelled out knock/blink mapping'], ['Sending messages with light or sound', 'try', 'Rewrote with code example, steps, what to notice'], ['Sending messages with light or sound', 'data', 'Drew 3-of-4 signal test'], ['Sending messages with light or sound', 'real', 'Drew lighthouse (SVG, not the raster hero)'], ['Try it at home or in class', 'try', 'Station steps and timings']].forEach(([c, t, w]) => st(F, c, t, 'done', w, c.startsWith('Try') ? 'Timings are suggestions' : (t === 'data' ? 'Tables are labelled as example results' : '')));
  p.save();
}

// ================= 1-B =================
{
  const F = 'unit-1-b-parts-parents-and-young.html', p = new Page(F);
  let b = R(10, 44, 150, 176, SURF, INK, 12, 2) + R(165, 44, 150, 176, SURF, INK, 12, 2) + R(320, 44, 150, 176, SURF, INK, 12, 2);
  b += beaver(85, 150, 1.1) + tag(85, 76, 'flat tail', { s: 14 }) + L(30, 90, 36, 140, ORANGE, 3) + deer(240, 200, 0.9) + tag(240, 76, 'big ears', { s: 14 }) + L(262, 84, 272, 106, ORANGE, 3) + mapleLeaf(395, 140, 1.1) + tag(395, 76, 'leaf', { s: 14 }) + L(395, 84, 395, 92, ORANGE, 3);
  b += T(85, 244, 'helps it swim', { s: 14 }) + T(240, 244, 'hear danger', { s: 14 }) + T(395, 244, 'catches sunlight', { s: 14 });
  p.addFig('s1', 'diagram', 1, '1b-parts', fig('1b-parts', svg('1b-parts', 'Parts with jobs', 'Three pictures. A beaver with a flat tail that helps it swim. A deer with big ears that hear danger. A maple leaf that catches sunlight.', 262, b, false), 'Each part has a job. A beaver’s flat tail helps it swim. A deer’s big ears help it hear danger. A leaf catches sunlight to make food for the plant.', 'Beaver with flat tail (swims), deer with big ears (hears danger), maple leaf (catches sunlight).'));
  p.addFig('s1', 'try', 1, '1b-part-match', quiz('1b-part-match', 'Guess first, then choose the job for each part.', [
    { q: 'Which beak picks up seeds?', icon: icon('1b-q1', 'A short, thick bird beak', P('M30 60 q60 -40 100 10 q-60 30 -100 -10 Z', BEAM, INK, 3) + C(60, 52, 3, INK)), opts: ['A short, thick beak', 'A long, thin beak', 'A flat beak like a duck'], a: 0, why: 'A short, thick beak cracks and picks up seeds.' },
    { q: 'What do webbed feet help a duck do?', icon: icon('1b-q2', 'A webbed duck foot', P('M80 30 L80 70 M80 70 L40 110 L120 110 L80 70 M80 70 L60 112 M80 70 L100 112', ORANGE, INK, 3)), opts: ['Swim', 'Climb trees', 'Dig tunnels'], a: 0, why: 'Webbed feet push against the water like paddles.' },
    { q: 'What do roots do for a plant?', icon: icon('1b-q3', 'A plant with roots', L(80, 20, 80, 70, GREEN, 6) + P('M80 70 q-30 20 -40 50 M80 70 q0 30 4 54 M80 70 q30 20 42 46', 'none', BROWN, 4)), opts: ['Hold it in place and take in water', 'Make it sing', 'Catch the wind'], a: 0, why: 'Roots hold the plant in the soil and soak up water.' },
    { q: 'What do a deer’s big ears help it do?', icon: icon('1b-q4', 'A deer', deer(70, 118, 0.9)), opts: ['Hear danger', 'Fly', 'Dig for food'], a: 0, why: 'Big ears help deer listen for danger.' }
  ], 'Match beak, foot, or root cards to their jobs.'));
  b = deer(150, 214, 1.8) + [0, 1, 2].map((i) => P(`M${210 + i * 18} ${48 + i * 2} q${10 + i * 2} ${16} 0 ${34 + i * 4}`, 'none', ORANGE, 3)).join('') + tag(310, 120, 'sounds', { s: 14 });
  b = deer(130, 220, 1.9) + [0, 1, 2].map((i) => P(`M${224 + i * 20} ${40 + i * 2} q${12 + i * 3} 18 0 ${40 + i * 4}`, 'none', ORANGE, 4)).join('') + tag(330, 90, 'sounds come in', { s: 15 });
  p.addFig('s1', 'real', 1, '1b-deer-ears', fig('1b-deer-ears', svg('1b-deer-ears', 'Deer ears hear danger', 'A white-tailed deer standing still with sound lines arriving at its big ears.', 244, b, false), 'White-tailed deer have big ears that can turn toward a sound. They help the deer hear danger.', 'A deer with sound lines reaching its ears.'));
  b = table(8, 40, [220, 240], ['Part', 'Job'], [['Webbed feet', 'swim'], ['Big ears', 'hear danger'], ['Flat tail', 'helps swim'], ['Roots', 'hold and drink water'], ['Leaf', 'catches sunlight']], { rh: 34 });
  p.addFig('s1', 'data', 1, '1b-part-chart', fig('1b-part-chart', svg('1b-part-chart', 'Part and job', 'A two-column chart. Webbed feet: swim. Big ears: hear danger. Flat tail: helps swim. Roots: hold and drink water. Leaf: catches sunlight.', 290, b, false), 'Our class chart: each part and the job it does.', 'Webbed feet swim; big ears hear danger; flat tail helps swim; roots hold the plant and take in water; leaf catches sunlight.'));
  // s2
  p.setBody('s2', 'analogy', 1, `<p>A burr is like a <b>sticky strap</b> (hook-and-loop fastener). <b>Burr’s tiny hooks</b> = the hooks on the strap. <b>Fur or a sock</b> = the loops it grabs. People copied the burr’s hooks to make the strap.</p><p class="tip">“A burr grabs. We can copy it.”</p>`);
  p.setBody('s2', 'try', 1, tryCell({
    guess: 'Which part of a plant or animal could help you solve a problem? Pick one.',
    need: 'picture cards, paper, tape, fabric scraps, cotton balls, paper clips, pipe cleaners, a small tray.',
    do: 'Choose a problem: stay dry, carry seeds, or stay warm. Pick a part to copy: a leaf (stays dry), fur (stays warm), or a burr (grabs). Build a model helper. Test it: sprinkle water, hold it on your hand, or try to pick up paper “seeds”.',
    notice: 'Did the helper work? What part of nature did it copy? What would you change?',
    why: 'People get ideas from nature’s parts. This is called biomimicry.',
    safety: 'Small pieces need an adult close by. Do not use live wild animals.', tip: 'I copied a part from nature. I tested it.'
  }));
  b = table(8, 40, [150, 150, 160], ['My helper', 'Part I copied', 'Did it help?'], [['Burr hook', 'burr', 'Y'], ['Cotton hat', 'fur', 'Y'], ['Paper roof', 'leaf', 'N']], { rh: 40 });
  p.addFig('s2', 'data', 1, '1b-test-table', fig('1b-test-table', svg('1b-test-table', 'Did it help?', 'A test table with three helpers. The burr hook copied a burr and picked up paper seeds, so it helped. The cotton hat copied fur and kept a hand warm, so it helped. The paper roof copied a leaf but got soggy, so it did not help.', 216, b, false), 'Example results to practice with. A “no” is useful: it tells us what to change and test again.', 'Burr hook: helped. Cotton hat: helped. Paper roof: did not help. Example results.'));
  // s3
  p.setBody('s3', 'analogy', 1, `<p>Parent care is like a <b>helper blanket</b>. <b>The blanket</b> = what the parent does (feeds, guards, guides). <b>The one under the blanket</b> = the baby animal. A blanket keeps you warm and safe, and care keeps young animals safe.</p><p>Where it breaks: not every animal parent cares for its young.</p><p class="tip">“Care keeps young safe.”</p>`);
  p.addFig('s3', 'try', 1, '1b-parent-match', quiz('1b-parent-match', 'Guess first. What does the parent do?', [
    { q: 'A robin brings worms to the nest. What does the parent do?', icon: icon('1b-p1', 'A robin', robin(80, 64, 1.4)), opts: ['Feeds the chicks', 'Hides the chicks', 'Teaches them to swim'], a: 0, why: 'Robins feed their chicks until the chicks can find food.' },
    { q: 'Ducklings follow mother duck in a line. What does the parent do?', opts: ['Guides the ducklings', 'Feeds them worms', 'Leaves them alone'], a: 0, why: 'Mother duck leads the ducklings to water and food, and they stay close for safety.' },
    { q: 'A mother deer leaves her fawn lying quietly in tall grass. How does that help the fawn?', icon: icon('1b-p3', 'A deer', deer(70, 118, 0.9)), opts: ['The fawn stays hidden', 'The fawn gets fed', 'The fawn learns to run'], a: 0, why: 'The fawn’s spots and stillness help it hide from animals that hunt.' }
  ], 'Read-aloud cards: robin feeding chicks, ducklings following, deer hiding fawns.'));
  b = table(8, 40, [120, 170, 170], ['Parent', 'What it does', 'How it helps the young'], [['Robin', 'feeds', 'gets food'], ['Duck', 'leads', 'stays close and safe'], ['Deer', 'hides fawn', 'stays hidden']], { rh: 42 });
  p.addFig('s3', 'data', 1, '1b-pattern-chart', fig('1b-pattern-chart', svg('1b-pattern-chart', 'Parent, action, help', 'A chart with three rows. Robin feeds, so the chicks get food. Duck leads, so ducklings stay close and safe. Deer hides its fawn, so the fawn stays hidden.', 224, b, false), 'The pattern: a parent does something, and it helps the young survive.', 'Robin feeds: chicks get food. Duck leads: ducklings stay safe. Deer hides fawn: fawn stays hidden.'));
  b = R(0, 200, 480, 50, GREEN, 'none', 0, 0) + E(330, 200, 70, 22, BROWN, INK, 3) + [0, 1].map((i) => E(300 + i * 60, 184, 18, 14, 'var(--muted, #6b7390)', INK, 2) + P(`M${288 + i * 60} 174 l24 0 l-12 -4 z`, BEAM, INK, 2)).join('') + robin(110, 150, 1.6) + P('M156 126 q40 -4 94 52', 'none', ORANGE, 4) + tag(110, 236, 'parent', { s: 14 }) + tag(330, 236, 'chicks', { s: 14 });
  p.addFig('s3', 'real', 1, '1b-robin-feeding', fig('1b-robin-feeding', svg('1b-robin-feeding', 'A robin feeds its chicks', 'A robin carrying a worm toward a nest where two chicks have their beaks open.', 258, b, false), 'In spring, Michigan robins feed their chicks again and again, bringing worms and insects to the nest.', 'A robin with a worm at a nest with two hungry chicks.'));
  // s4
  p.addFig('s4', 'try', 1, '1b-young-match', quiz('1b-young-match', 'Guess first. Match the grown-up to its young.', [
    { q: 'Which is the young of a deer?', icon: icon('1b-y1', 'An adult deer', deer(70, 118, 0.9)), opts: ['Fawn', 'Chick', 'Seedling'], a: 0, why: 'A fawn is a young deer. It looks like a deer, but smaller and with spots.' },
    { q: 'Which is the young of a robin?', icon: icon('1b-y2', 'An adult robin', robin(80, 64, 1.4)), opts: ['Chick', 'Fawn', 'Seedling'], a: 0, why: 'A robin’s young is a chick.' },
    { q: 'Which is the young of a maple tree?', icon: icon('1b-y3', 'A maple tree', tree(80, 120, 2.2)), opts: ['Seedling', 'Fawn', 'Chick'], a: 0, why: 'A maple seedling is a tiny maple tree.' }
  ], 'Match adults and young: deer and fawn, robin and chick, maple and seedling.'));
  const sq = (x, y, c) => R(x, y, 30, 30, c, INK, 5, 2);
  b = T(130, 62, 'Alike', { s: 17, w: 700, f: GREEN }) + T(350, 62, 'Different', { s: 17, w: 700, f: ORANGE });
  b += T(24, 100, ['Both have four legs.', 'Both have ears.', 'Both have a tail.'], { s: 15, a: 'start', lh: 26 }) + T(264, 100, ['Spots are different.', 'The fawn is smaller.', 'Its legs are shorter.'], { s: 15, a: 'start', lh: 26 });
  p.addFig('s4', 'data', 1, '1b-same-diff', fig('1b-same-diff', svg('1b-same-diff', 'Same and different traits', 'Two lists. Alike: both have four legs, ears and a tail. Different: spots are different, the fawn is smaller, and its legs are shorter.', 196, b, false), 'Example tally for a deer and a fawn. Young are like their parents, but not exactly like them.', 'Alike: four legs, ears, tail. Different: spots, size, leg length.'));
  b = deer(120, 200, 1.5) + deer(330, 200, 0.95, true) + tag(120, 66, 'deer', { s: 15 }) + tag(330, 66, 'fawn', { s: 15 }) + arrow(190, 150, 270, 150, GREEN, 5, 14) + T(230, 134, 'like', { s: 15, w: 700, f: GREEN }) + arrow(190, 180, 270, 180, ORANGE, 5, 14) + T(230, 210, 'different', { s: 14, w: 700, f: ORANGE });
  p.addFig('s4', 'diagram', 1, '1b-like-diff', fig('1b-like-diff', svg('1b-like-diff', 'Like, but not exactly like', 'A big adult deer on the left and a smaller spotted fawn on the right. Arrows between them say like and different.', 232, b, false), 'The fawn is like the deer: same body shape. It is different too: smaller, with spots.', 'Adult deer and smaller spotted fawn with arrows for like and different.'));
  b = tree(120, 210, 3) + R(300, 190, 6, 20, ORANGE, INK, 1, 1) + C(303, 178, 14, GREEN, INK, 2) + L(0, 210, 480, 210, INK, 3) + tag(120, 60, 'maple tree', { s: 15 }) + tag(303, 150, 'maple seedling', { s: 15 });
  p.addFig('s4', 'real', 1, '1b-seedling', fig('1b-seedling', svg('1b-seedling', 'A tiny maple', 'A tall maple tree next to a tiny maple seedling that looks like a small tree.', 244, b, false), 'A maple seedling looks like a small maple tree. It will grow up to look like its parent.', 'A tall maple and a tiny seedling that looks like it.'));
  p.setBody('kit', 'try', 2, `<h3>What you do</h3>
      <p><b>1. Parts and jobs (10 minutes).</b> Play the match game above. Make a class chart: part and job.</p>
      <p><b>2. Biomimicry helper (25 minutes).</b> Pick a problem and a natural part, build a helper, test it, and record whether it worked.</p>
      <p><b>3. Parent care (10 minutes).</b> Listen to a read-aloud or look at picture cards. Fill in: parent, action, how it helps the young.</p>
      <p><b>4. Alike and different (10 minutes).</b> Look at adult and young pairs. List what is alike and what is different.</p>`);
  [['External parts help survival', 'diagram', 'Drew beaver tail, deer ears, maple leaf with jobs'], ['External parts help survival', 'try', 'Built a 4-card part-to-job match quiz'], ['External parts help survival', 'real', 'Drew deer with sound reaching its ears'], ['External parts help survival', 'data', 'Drew part-to-job chart'], ['Biomimicry design', 'analogy', 'Spelled out burr/strap mapping'], ['Biomimicry design', 'try', 'Rewrote with problem, parts, steps, what to notice'], ['Biomimicry design', 'data', 'Drew test table (example results, includes a failure)'], ['Parent-offspring behavior', 'analogy', 'Spelled out blanket mapping and where it breaks'], ['Parent-offspring behavior', 'try', 'Built a 3-card what-does-the-parent-do quiz'], ['Parent-offspring behavior', 'data', 'Drew parent-action-help chart'], ['Parent-offspring behavior', 'real', 'Drew robin feeding chicks at nest'], ['Young are like, but not exactly like, parents', 'try', 'Built a 3-card adult-young match quiz'], ['Young are like, but not exactly like, parents', 'data', 'Drew alike/different lists for deer and fawn'], ['Young are like, but not exactly like, parents', 'diagram', 'Drew deer and spotted fawn with like/different arrows'], ['Young are like, but not exactly like, parents', 'real', 'Drew maple tree and seedling'], ['Try it at home or in class', 'try', 'Station steps and timings']].forEach(([c, t, w]) => st(F, c, t, 'done', w, c.startsWith('Try') ? 'Timings are suggestions' : (c.startsWith('Parent') && t === 'try' ? 'Claim: a mother deer leaves her fawn hidden for hours and returns to feed it (standard wildlife fact)' : '')));
  p.save();
}

// ================= 1-C =================
{
  const F = 'unit-1-c-sky-patterns.html', p = new Page(F);
  p.setBody('s1', 'data', 1, tryCell({
    guess: 'What will you see in the sky in the daytime, and what at night?',
    need: 'two sheets of paper, crayons.',
    do: 'Fold a paper in half. On one side draw the day sky: the Sun, clouds, blue. On the other side draw the night sky: dark, the Moon, stars. Use the example below to check your drawing.',
    notice: 'Which things are only in the day sky? Which are only in the night sky?',
    why: 'The sky has a pattern: Sun in the day, Moon and stars at night.',
    tip: 'Sun in day. Stars at night.'
  }));
  let b = R(10, 44, 220, 170, 'var(--transmit, #9bd7f0)', INK, 12, 3) + sun(170, 100, 20) + cloud(80, 110, 1.2) + R(10, 180, 220, 34, GREEN, INK, 0, 2) + R(250, 44, 220, 170, 'var(--shade, #151a30)', INK, 12, 3) + moon(380, 100, 22, 'crescent') + [[290, 80], [320, 120], [430, 70], [440, 130], [350, 160], [300, 60]].map(([x, y]) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="18" fill="${BEAM}">*</text>`).join('') + R(250, 180, 220, 34, 'var(--green, #14562f)', INK, 0, 2) + T(120, 240, 'Day: Sun and clouds', { s: 15, w: 700 }) + T(360, 240, 'Night: Moon and stars', { s: 15, w: 700 });
  p.addFig('s1', 'data', 1, '1c-day-night', fig('1c-day-night', svg('1c-day-night', 'Day sky and night sky', 'Two drawings. The day sky is blue with the Sun and a cloud. The night sky is dark with the Moon and stars.', 262, b, false), 'An example drawing. In the day we see the Sun. At night we see the Moon and stars.', 'Day sky: Sun, cloud. Night sky: Moon, stars.'));
  const clock = (x, y, h) => C(x, y, 24, SURF, INK, 3) + L(x, y, x, y - 16, INK, 3) + L(x, y, x + (h ? 0 : 0), y + (h ? 0 : 0), INK, 3);
  b = R(10, 44, 220, 170, 'var(--transmit, #9bd7f0)', INK, 12, 3) + sun(120, 90, 24) + R(10, 176, 220, 38, GREEN, INK, 0, 2) + tag(120, 150, 'noon: light', { s: 16 }) + R(250, 44, 220, 170, 'var(--shade, #151a30)', INK, 12, 3) + R(250, 176, 220, 38, 'var(--green, #14562f)', INK, 0, 2) + [[300, 80], [350, 110], [430, 70]].map(([x, y]) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="18" fill="${BEAM}">*</text>`).join('') + tag(360, 150, 'midnight: dark', { s: 16 });
  b += T(120, 240, '12 o’clock in the day', { s: 14 }) + T(360, 240, '12 o’clock at night', { s: 14 });
  p.addFig('s1', 'real', 1, '1c-noon-midnight', fig('1c-noon-midnight', svg('1c-noon-midnight', 'Noon and midnight', 'Two pictures of the same place. At noon the sky is bright with the Sun high up. At midnight the sky is dark with stars.', 262, b, false), 'In Michigan, noon is bright because our side of Earth faces the Sun. At midnight our side faces away, so it is dark.', 'Noon: bright sky with Sun. Midnight: dark sky with stars.'));
  // s2 diagram: moon lit by sun
  b = sun(60, 130, 24) + [100, 130, 160].map((y) => arrow(96, y, 230, 130 + (y - 130) * 0.3, BEAM, 4, 11)).join('') + C(280, 130, 56, SHADE, INK, 3) + P('M280 74 A56 56 0 0 0 280 186 Z', BEAM, INK, 3) + tag(280, 212, 'Moon', { s: 15 }) + tag(60, 190, 'Sun', { s: 15 }) + T(358, 108, ['The lit side', 'faces the Sun.'], { s: 13, w: 700, a: 'start' }) + T(358, 156, ['The other side', 'is dark.'], { s: 13, a: 'start' });
  p.addFig('s2', 'diagram', 1, '1c-moon-light', fig('1c-moon-light', svg('1c-moon-light', 'The Moon does not make its own light', 'The Sun on the left sends arrows of light to the Moon. The side of the Moon facing the Sun is bright and the far side is dark.', 238, b, false), 'The Moon only reflects sunlight. The half facing the Sun is lit. From Earth we see different amounts of the lit half as the Moon moves around us, so its shape seems to change.', 'Sun, with light arrows to the Moon; the side facing the Sun is lit.'));
  p.addFig('s2', 'try', 1, '1c-moon-sort', quiz('1c-moon-sort', 'Guess first. Which Moon shape is it?', [
    { q: 'What shape is this Moon?', icon: icon('1c-m1', 'A thin crescent moon', moon(80, 65, 50, 'crescent')), opts: ['Thin crescent', 'Half', 'Round'], a: 0, why: 'A thin crescent is a small sliver of the lit Moon.' },
    { q: 'What shape is this Moon?', icon: icon('1c-m2', 'A half moon', moon(80, 65, 50, 'half')), opts: ['Thin crescent', 'Half', 'Round'], a: 1, why: 'A half Moon shows half of the lit side.' },
    { q: 'What shape is this Moon?', icon: icon('1c-m3', 'A full moon', moon(80, 65, 50, 'full')), opts: ['Thin crescent', 'Half', 'Round'], a: 2, why: 'A round Moon (full Moon) shows the whole lit side.' }
  ], 'Sort Moon-phase cards: thin crescent, half, round.'));
  const cell = (x, y, ph, t) => R(x, y, 100, 130, SURF, INK, 10, 2) + moon(x + 50, y + 50, 30, ph) + T(x + 50, y + 108, t, { s: 14, w: 700 });
  b = [['crescent', 'Week 1'], ['half', 'Week 2'], ['full', 'Week 3'], ['halfL', 'Week 4']].map(([ph, t], i) => cell(14 + i * 116, 50, ph, t)).join('') + T(240, 214, 'The Moon looked different after 2 weeks.', { s: 16, w: 700 });
  p.addFig('s2', 'data', 1, '1c-moon-calendar', fig('1c-moon-calendar', svg('1c-moon-calendar', 'Our Moon calendar', 'Four Moon pictures one week apart: a thin crescent, a half Moon, a round Moon, and a half Moon on the other side.', 240, b, false), 'An example Moon calendar. The Moon’s shape changes over time and then repeats about every month. Draw what you really see.', 'Four weekly pictures: crescent, half, round, half on the other side.'));
  b = R(10, 44, 220, 160, 'var(--transmit, #9bd7f0)', INK, 12, 3) + sun(170, 90, 20) + [[60, 80], [100, 120], [40, 140]].map(([x, y]) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="16" fill="${INK}" opacity="0.35">*</text>`).join('') + T(120, 190, 'Day: stars are still there', { s: 13 }) + R(250, 44, 220, 160, 'var(--shade, #151a30)', INK, 12, 3) + [[290, 80], [330, 120], [400, 70], [440, 120], [360, 160], [300, 150]].map(([x, y]) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="22" fill="${BEAM}">*</text>`).join('') + T(360, 190, 'Night: we can see them', { s: 13 }) + T(240, 232, 'The bright daytime sky hides the stars.', { s: 15, w: 700 });
  p.addFig('s2', 'real', 1, '1c-stars-day', fig('1c-stars-day', svg('1c-stars-day', 'Stars are always there', 'Two skies. In the day, faint stars are hidden by the bright blue sky. At night the stars shine clearly.', 252, b, false), 'Stars are very far away suns. They are still in the sky in the daytime, but our Sun’s light is so bright that it hides them.', 'Day sky hides faint stars; night sky shows them.'));
  p.setBody('s3', 'try', 1, tryCell({
    guess: 'In which month is the Sun up longer in Michigan, June or December?',
    need: 'two pictures of the same Michigan place: one in June and one in December, or paper strips and a ruler.',
    do: 'Look at the two pictures. Where is the Sun? Is it light or dark? Next, cut a long strip for June and a short strip for December (the page’s graph shows about 15 and 9 squares of daylight).',
    notice: 'In June it is light late in the evening. In December it gets dark early.',
    why: 'Summer days have more daylight than winter days.',
    tip: 'June: light late. December: dark early.'
  }));
  p.setBody('kit', 'try', 2, `<h3>What you do</h3>
      <p><b>1. Lamp and ball (10 minutes).</b> Turn the ball slowly in front of the lamp. Which side is lit (day)? Which is dark (night)?</p>
      <p><b>2. Moon cards (10 minutes).</b> Put the Moon-phase cards in order: crescent, half, round.</p>
      <p><b>3. Daylight strips (10 minutes).</b> Make a long strip for June and a short strip for December.</p>
      <p><b>4. Sundial (30 minutes, sunny day).</b> Mark the straw’s shadow in the morning, at noon, and in the afternoon. Notice that the shadow moves.</p>`);
  [['Day and night repeat', 'data', 'Rewrote with steps and drew example day and night sky'], ['Day and night repeat', 'real', 'Drew noon (bright) and midnight (dark)'], ['The Moon and stars have patterns', 'diagram', 'Drew Sun lighting one side of the Moon'], ['The Moon and stars have patterns', 'try', 'Built 3-card moon-phase quiz'], ['The Moon and stars have patterns', 'data', 'Drew four-week Moon calendar (example)'], ['The Moon and stars have patterns', 'real', 'Drew day sky hiding stars, night sky showing them'], ['Seasons change the amount of daylight', 'try', 'Rewrote with guess, steps, what to notice'], ['Try it at home or in class', 'try', 'Station steps and timings']].forEach(([c, t, w]) => st(F, c, t, 'done', w, c.startsWith('The Moon') && t === 'data' ? 'Moon calendar phases are a simplified example (weekly steps of a roughly 29.5-day cycle)' : c.startsWith('Try') ? 'Timings are suggestions' : ''));
  p.save();
}
