import { Page, tag, icon, svg, fig, quiz, tryCell, T, R, C, E, L, P, arrow, sun, person, cloud, tree, check, cross, INK, MUTED, LINE, S2, SURF, BEAM, BLUE, ORANGE, TEAL, RED, GREEN, SHADE } from './lib.mjs';
import { deer, robin, beaver, bee, flower, fish, bird, BROWN, SAND, pondPanel, forestPanel, dunePanel } from './shapes.mjs';
export const log = [];
const st = (file, concept, type, status, what, check = '') => log.push({ file: `k-5/${file}`, concept, type, status, what, check });

// ================= K-C =================
{
  const F = 'unit-k-c-living-things-and-their-homes.html', p = new Page(F);
  // s1 analogy
  p.setBody('s1', 'analogy', 1, `<p>Think of a <b>needs list</b>, like a shopping list. Everyone has a list of things they must get to stay alive. A plant’s list: <b>water, sunlight, air</b>. An animal’s list: <b>food, water, air</b>. Both need <b>space</b> to live.</p><p>The lists are not the same, but each living thing needs everything on its own list.</p><p class="tip">“Plants need water and sunlight. Animals need food, water, and air.”</p>`);
  // s1 data: needs chart
  const cols = ['water', 'sunlight', 'air', 'food', 'space'], rows = [['Bean plant', [1, 1, 1, 0, 1]], ['Deer', [1, 0, 1, 1, 1]]];
  let b = cols.map((c, i) => T(150 + i * 64, 60, c, { s: 14, w: 700 })).join('');
  rows.forEach(([n, v], r) => { const y = 74 + r * 64; b += R(8, y, 464, 56, SURF, LINE, 8, 1.5) + T(18, y + 34, n, { s: 16, w: 700, a: 'start' }); v.forEach((x, i) => { b += x ? check(150 + i * 64, y + 28) : T(150 + i * 64, y + 34, '-', { s: 20, f: MUTED }); }); });
  p.addFig('s1', 'data', 1, 'kc-needs-chart', fig('kc-needs-chart', svg('kc-needs-chart', 'What a bean plant and a deer need', 'A chart with check marks. The bean plant needs water, sunlight, air and space. The deer needs water, air, food and space.', 214, b, false),
    'A check means it needs that. The bean plant makes its own food from sunlight, so it does not need to eat. The deer eats plants.', 'Bean plant: water, sunlight, air, space. Deer: water, air, food, space.'));
  // s1 real: robin
  b = R(0, 150, 480, 100, GREEN, 'none', 0, 0) + robin(100, 130, 1.5) + P('M170 168 q14 -8 20 -22 q6 -10 14 0 q6 14 -4 22 z', 'none', ORANGE, 4) + tag(190, 214, 'worm') + E(310, 200, 50, 14, BLUE, INK, 2) + tag(310, 236, 'water') + C(420, 150, 38, 'var(--green, #25904F)', INK, 3) + L(420, 188, 420, 214, INK, 5) + tag(420, 238, 'safe place');
  p.addFig('s1', 'real', 1, 'kc-robin', fig('kc-robin', svg('kc-robin', 'A robin finds what it needs', 'A robin on the ground near a worm to eat, a puddle of water to drink, and a bush to hide in.', 262, b, false), 'A robin needs food (worms), water, and a safe place. Michigan robins find all three in yards, parks, and woods.', 'A robin, a worm, a puddle, and a bush: food, water, and a safe place.'));
  // s1 try quiz
  p.addFig('s1', 'try', 1, 'kc-living-sort', quiz('kc-living-sort', 'Guess first, then choose. Does it need water?', [
    { q: 'A robin: is it living or nonliving?', icon: icon('kc-r1', 'A robin', robin(80, 62, 1.4)), opts: ['Living', 'Nonliving'], a: 0, why: 'A robin is living. It eats, drinks, and grows.' },
    { q: 'A stone: is it living or nonliving?', icon: icon('kc-r2', 'A stone', E(80, 80, 44, 28, S2, INK, 3)), opts: ['Living', 'Nonliving'], a: 1, why: 'A stone is nonliving. It does not eat, drink, or grow.' },
    { q: 'A bean plant: does it need water?', icon: icon('kc-r3', 'A bean plant', L(80, 120, 80, 50, GREEN, 5) + E(60, 70, 20, 9, GREEN, INK, 2) + E(100, 62, 20, 9, GREEN, INK, 2)), opts: ['Yes, it needs water', 'No, it does not'], a: 0, why: 'Plants need water, sunlight, and air to live and grow.' },
    { q: 'A deer: what does it need to eat?', icon: icon('kc-r4', 'A deer', deer(70, 118, 0.9)), opts: ['Food: plants and leaves', 'Nothing, deer do not eat'], a: 0, why: 'Animals need food. Deer eat plants such as leaves and grass.' }
  ], 'Sort living things from nonliving things, then match needs.'));
  // s2 diagram: habitats
  b = pondPanel(10, 50, 140, 150) + forestPanel(170, 50, 140, 150) + dunePanel(330, 50, 140, 150) + T(80, 224, 'Pond', { s: 17, w: 700 }) + T(240, 224, 'Forest', { s: 17, w: 700 }) + T(400, 224, 'Sand dune', { s: 17, w: 700 }) + T(80, 246, 'fish get water', { s: 13, f: MUTED }) + T(240, 246, 'deer get shelter + food', { s: 13, f: MUTED }) + T(400, 246, 'beach grass holds sand', { s: 13, f: MUTED });
  p.addFig('s2', 'diagram', 1, 'kc-habitats', fig('kc-habitats', svg('kc-habitats', 'Three habitats', 'Three pictures side by side. A pond with fish and water plants. A forest with trees and a deer. A sand dune with beach grass and a bird.', 266, b, false), 'A pond gives fish water. A forest gives deer shelter and food. A dune has sand and grass for plants and birds that live there.', 'Pond with fish; forest with trees and deer; sand dune with beach grass and a bird.'));
  p.addFig('s2', 'try', 1, 'kc-habitat-sort', quiz('kc-habitat-sort', 'Guess first, then choose. Where does it live?', [
    { q: 'Where does the frog live?', opts: ['Pond', 'Forest', 'Sand dune'], a: 0, why: 'A frog lives near water, like a pond.' },
    { q: 'Where does the white-tailed deer find shelter and food?', opts: ['Pond', 'Forest', 'Sand dune'], a: 1, why: 'Deer live in forests and edges, where trees give shelter and plants give food.' },
    { q: 'Where does beach grass grow?', opts: ['Pond', 'Forest', 'Sand dune'], a: 2, why: 'Beach grass grows on sand dunes and holds the sand in place.' },
    { q: 'Where does a fish live?', opts: ['Pond or lake', 'Forest', 'Sand dune'], a: 0, why: 'Fish live in water.' }
  ], 'Sort Michigan animals and plants into habitats.'));
  p.setBody('s2', 'try', 2, tryCell({
    guess: 'What does your animal need in its home? Plan it first.',
    need: 'clay or play dough, paper, crayons, blue paper for water, a small tray.',
    do: 'Pick one animal, such as a frog, deer, or fish. Make its home on the tray. Add blue paper for water, paper trees or grass for shelter, and little clay bits for food. Put the animal in.',
    notice: 'Check the model against the needs list: does it have water, food, shelter, and space?',
    why: 'A habitat is the place that meets an animal’s needs. If one need is missing, the home does not work.',
    tip: 'My model has water, shelter, and food.'
  }));
  b = R(0, 150, 480, 100, SAND, 'none', 0, 0) + R(0, 80, 480, 70, BLUE, 'none', 0, 0) + P('M0 110 q15 -10 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0', 'none', SURF, 2) + [300, 340, 380, 420].map((x) => L(x, 214, x - 4, 160, GREEN, 4) + L(x, 214, x + 6, 164, GREEN, 4)).join('') + bird(110, 60, 1.6) + E(220, 200, 12, 7, INK, INK, 1) + L(210, 196, 204, 190, INK, 2) + L(230, 196, 236, 190, INK, 2) + tag(110, 40, 'birds') + tag(80, 130, 'water') + tag(220, 236, 'insects') + tag(120, 236, 'sand') + tag(360, 236, 'plants');
  p.addFig('s2', 'real', 1, 'kc-shore', fig('kc-shore', svg('kc-shore', 'A Great Lakes shore', 'A shoreline with lake water at the top, sand below, beach grass plants on the right, a bird flying over and an insect on the sand.', 258, b, false), 'A Great Lakes shore has water, sand, plants, birds, and insects. For them, the shore is a home.', 'Lake water, sand, beach grass, a bird, and an insect on a shore.'));
  // s3 diagram: beaver dam
  b = R(0, 100, 480, 150, S2, 'none', 0, 0) + P('M0 190 L130 190 L130 150', 'none', 'none', 0) + R(0, 160, 190, 60, BLUE, 'none', 0, 0) + R(190, 130, 40, 90, BROWN, INK, 4, 3) + [140, 156, 172].map((y) => L(190, y + 20, 230, y + 20, INK, 2)).join('') + R(230, 130, 250, 90, BLUE, 'none', 0, 0) + P('M232 130 L470 130', 'none', SURF, 3) + arrow(20, 180, 120, 180, SURF, 4, 12) + beaver(360, 140, 1.2) + fish(400, 190, 0.8) + tag(100, 246, 'stream flows') + tag(210, 120, 'dam of sticks') + tag(370, 246, 'new pond') + L(0, 220, 480, 220, INK, 3);
  p.addFig('s3', 'diagram', 1, 'kc-dam', fig('kc-dam', svg('kc-dam', 'A beaver dam changes a stream', 'A side view. A stream flows from the left and is stopped by a dam of sticks. Behind the dam is a new pond with a beaver and a fish.', 270, b, false), 'Beavers make dams out of sticks and mud. The dam stops the stream and makes a pond, which is the beaver’s home. A living thing changed its place.', 'Stream on the left, dam of sticks in the middle, pond with a beaver on the right.'));
  p.addFig('s3', 'try', 1, 'kc-evidence-sort', quiz('kc-evidence-sort', 'Evidence cards. Did a living thing change this place? What did it change?', [
    { q: 'Beaver dam: what did the beaver change?', icon: icon('kc-e1', 'A beaver dam', beaver(80, 100, 1.2)), opts: ['It stopped the stream and made a pond', 'It made the sky darker'], a: 0, why: 'The dam holds water back and makes a pond.' },
    { q: 'Worm tunnels in soil: what did the worms change?', icon: icon('kc-e2', 'Worm tunnels', L(30, 80, 130, 80, BROWN, 8) + P('M40 40 q20 40 40 10 t40 30', 'none', ORANGE, 6)), opts: ['They made holes that mix the soil', 'They made the soil colder'], a: 0, why: 'Worm tunnels let air and water in and mix the soil.' },
    { q: 'A bird nest in a tree: what did the bird change?', icon: icon('kc-e3', 'A bird nest', E(80, 90, 40, 18, BROWN, INK, 3) + E(65, 80, 8, 10, 'var(--transmit, #9bd7f0)', INK, 1.5) + E(90, 80, 8, 10, 'var(--transmit, #9bd7f0)', INK, 1.5)), opts: ['It made a home from sticks and grass', 'It made the tree grow taller'], a: 0, why: 'Birds use sticks and grass to build a nest.' },
    { q: 'A dog dug a hole in the yard: what changed?', opts: ['The ground has a hole now', 'The dog turned into a worm'], a: 0, why: 'The dog is a living thing, and it changed the ground by digging.' },
    { q: 'A squirrel buried acorns: what might change?', opts: ['A new oak tree may grow from a forgotten acorn', 'The acorns turn into water'], a: 0, why: 'Squirrels forget some acorns. Some can grow into new trees.' }
  ], 'Look at evidence cards and say how a living thing changed a place.'));
  // s3 data: argument chart
  const hdr = ['Place changed?', 'Evidence I see', 'Who changed it'];
  b = hdr.map((h, i) => T(14 + i * 158, 62, h, { s: 14, w: 700, a: 'start' })).join('');
  [['Stream', 'A dam of sticks', 'Beaver'], ['Soil', 'Tunnels', 'Worm'], ['Tree', 'A nest', 'Bird']].forEach((r, k) => { const y = 74 + k * 54; b += R(8, y, 464, 46, SURF, LINE, 8, 1.5) + r.map((c, i) => T(14 + i * 158, y + 29, c, { s: 15, a: 'start', w: i === 2 ? 700 : 400 })).join(''); });
  p.addFig('s3', 'data', 1, 'kc-argument-chart', fig('kc-argument-chart', svg('kc-argument-chart', 'Our class argument chart', 'A chart with three columns: place changed, evidence I see, who changed it. Row one: stream, dam of sticks, beaver. Row two: soil, tunnels, worm. Row three: tree, a nest, bird.', 246, b, false), 'We say what changed, show the evidence we can see, and name who did it: “I see tunnels. A worm changed the soil.”', 'Stream, dam of sticks, beaver. Soil, tunnels, worm. Tree, a nest, bird.'));
  // s3 real: houses and roads
  b = R(10, 56, 210, 170, SURF, INK, 10, 2) + R(12, 150, 206, 74, GREEN, 'none', 8, 0) + tree(50, 160, 1.3) + tree(130, 160, 1.3) + tree(180, 164, 1) + T(115, 246, 'Before: a field and trees', { s: 14, w: 700 });
  b += R(260, 56, 210, 170, SURF, INK, 10, 2) + R(262, 150, 206, 74, GREEN, 'none', 8, 0) + R(262, 190, 206, 18, 'var(--shade, #222A4A)', 'none', 0, 0) + [290, 360].map((x) => R(x, 130, 46, 50, SAND, INK, 3, 2) + P(`M${x - 4} 130 L${x + 23} 106 L${x + 50} 130 Z`, RED, INK, 2)).join('') + tree(445, 166, 0.8) + T(365, 246, 'After: houses and a road', { s: 14, w: 700 });
  p.addFig('s3', 'real', 1, 'kc-houses', fig('kc-houses', svg('kc-houses', 'People change land too', 'Two pictures. Before: a field with trees. After: the same land with houses and a road.', 268, b, false), 'People build houses and roads. That changes the land for the plants and animals that lived there.', 'Before: a field with trees. After: houses and a road on the same land.'));
  // s4 analogy + try + real
  p.setBody('s4', 'analogy', 1, `<p>We can be <b>habitat helpers</b>. Your two hands are like helper hands for a place. Picking up litter helps animals stay safe. Planting a native flower gives bees food.</p><p>Each small action is one helping hand for the land, water, air, or living things.</p><p class="tip">“We can be habitat helpers.”</p>`);
  p.setBody('s4', 'try', 1, tryCell({
    guess: 'How many pieces of litter will we find in the schoolyard? Guess a number.',
    need: 'an adult, gloves, a bag, a camera or paper to draw on. Or: a native flower plant, a small pot or garden spot, a watering can.',
    do: 'Take a “before” photo or drawing of the spot. Then, with an adult, pick up the litter into the bag and count the pieces (do not touch sharp things). Or plant the native flower and water it. Take an “after” photo or drawing.',
    notice: 'Compare before and after. Was there less litter? How many pieces did we pick up? What helped?',
    why: 'Real actions change a real place, and the pictures are our evidence.',
    safety: 'Always wear gloves, never touch sharp objects, and wash hands after.', tip: 'We pick up litter. We take a before photo and an after photo.'
  }));
  b = flower(240, 90, 2.2, 'var(--red, #D93036)') + L(240, 176, 240, 240, GREEN, 6) + P('M240 210 q-40 -10 -50 -40 q36 0 50 40', GREEN, INK, 2) + bee(330, 100, 1.6) + T(330, 150, 'bee', { s: 14, w: 700 }) + T(240, 258, 'native flower', { s: 14, w: 700 }) + R(0, 238, 480, 4, GREEN, 'none', 0, 0);
  p.addFig('s4', 'real', 1, 'kc-native-flower', fig('kc-native-flower', svg('kc-native-flower', 'A native flower feeds a bee', 'A red flower with green leaves and a bee flying toward it.', 276, b, false), 'Native flowers grow here in Michigan without help. Bees and butterflies find nectar and pollen on them.', 'A flower and a bee: native flowers help bees.'));
  p.setBody('kit', 'try', 2, `<h3>What you do</h3>
      <p><b>1. Needs (15 minutes).</b> Use the card sort above, then make a needs chart for a bean plant and a deer.</p>
      <p><b>2. Habitat model (20 minutes).</b> Build a model for one animal with water, food, and shelter. Check it against the needs list.</p>
      <p><b>3. Evidence cards (10 minutes).</b> Sort the cards to argue how a living thing changed a place.</p>
      <p><b>4. Helper action (30 minutes, with an adult).</b> Do one real action: a supervised litter pick with before and after photos, or plant a native flower.</p>`);
  [['Plants and animals have needs', 'analogy', 'Spelled out mapping: needs list = shopping list, plant and animal lists'], ['Plants and animals have needs', 'try', 'Built a 4-card living/nonliving and needs quiz'], ['Plants and animals have needs', 'data', 'Drew needs check chart for bean plant and deer'], ['Plants and animals have needs', 'real', 'Drew a robin with worm, water, and shelter'], ['Homes meet needs', 'diagram', 'Drew pond, forest, dune panels'], ['Homes meet needs', 'try', 'Built a 4-card habitat sort quiz and rewrote the habitat-model try-it cell'], ['Homes meet needs', 'real', 'Drew a Great Lakes shore'], ['Living things change their environment', 'diagram', 'Drew beaver dam and new pond'], ['Living things change their environment', 'try', 'Built a 5-card evidence quiz'], ['Living things change their environment', 'data', 'Drew class argument chart (place, evidence, who)'], ['Living things change their environment', 'real', 'Drew before/after houses and road'], ['People can reduce harm', 'analogy', 'Spelled out helper-hands mapping'], ['People can reduce harm', 'try', 'Rewrote with steps, safety, what to notice'], ['People can reduce harm', 'real', 'Drew native flower and bee'], ['Try it at home or in class', 'try', 'Station steps and timings']].forEach(([c, t, w]) => st(F, c, t, 'done', w, c.startsWith('Homes') && t === 'try' ? 'Confirm squirrel/acorn card wording is OK for K' : c.startsWith('Try') ? 'Timings are suggestions' : ''));
  st(F, 'Homes meet needs', 'data', 'skipped', 'Not in the gap list');
  p.save();
}

// ================= K2.0 =================
{
  const F = 'unit-k2-0-science-noticing-and-asking.html', p = new Page(F);
  p.setBody('s1', 'analogy', 1, `<p>A scientist is like a <b>detective</b>. A detective looks closely at clues with a magnifying glass and says only what they really see. The magnifying glass = looking closely. The clue = the thing you look at.</p><p>Where it breaks: a scientist also tests ideas, not only looks.</p><p class="tip">“I look. I say what I see.”</p>`);
  p.setBody('s1', 'try', 1, tryCell({
    guess: 'What small thing on a leaf, a pine cone, or a stone will you notice that others might miss?',
    need: 'a tray with a pine cone, a leaf, and a stone; a magnifier; paper and crayons.',
    do: 'Pick one object. Look at it for one whole minute, using the magnifier. Say out loud what you see, feel, and smell (do not taste). Draw ONE small detail, like a line on the leaf or a bump on the stone.',
    notice: 'Is it smooth or bumpy? What color is it, really? What did you see only because you looked longer?',
    why: 'Careful noticing is where every science question starts.',
    safety: 'Wash your hands after touching outdoor objects. Do not taste anything.', tip: 'Draw one small thing you see.'
  }));
  const sq = (x, y, c) => R(x, y, 34, 34, c, INK, 6, 2);
  let b = T(110, 62, 'Smooth things', { s: 17, w: 700 }) + T(370, 62, 'Bumpy things', { s: 17, w: 700 });
  b += [0, 1, 2, 3].map((i) => sq(40 + i * 44, 84, BLUE)).join('') + [0, 1, 2, 3, 4].map((i) => sq(262 + i * 44, 84, ORANGE)).join('');
  b += T(110, 168, '4', { s: 30, w: 800 }) + T(370, 168, '5', { s: 30, w: 800 }) + T(110, 196, ['stone, marble,', 'button, maple leaf'], { s: 13, f: MUTED, lh: 16 }) + T(370, 196, ['pinecone, bark, acorn cap,', 'sponge, brick'], { s: 13, f: MUTED, lh: 16 });
  p.addFig('s1', 'data', 1, 'k20-tally', fig('k20-tally', svg('k20-tally', 'Smooth or bumpy?', 'A picture tally. Four blue squares for smooth things and five orange squares for bumpy things. The smooth things are a stone, a marble, a button and a maple leaf. The bumpy things are a pinecone, bark, an acorn cap, a sponge and a brick.', 232, b, false), 'One square for each thing we found. We found 4 smooth things and 5 bumpy things. Sample class tally; yours will be different.', '4 smooth things (stone, marble, button, maple leaf) and 5 bumpy things (pinecone, bark, acorn cap, sponge, brick).'));
  p.setBody('s2', 'analogy', 1, `<p>A question is like a <b>flashlight in a dark room</b>. The dark room = what we do not know yet. The flashlight = our question. The spot where it shines = where to look next.</p><p>A good question points us to something we can look at, measure, or try.</p><p class="tip">“A question shows where to look.”</p>`);
  p.addFig('s2', 'try', 1, 'k20-testable', quiz('k20-testable', 'Guess first. Can we test it? Yes or no.', [
    { q: 'Which paper towel holds more water drops?', opts: ['Yes, we can test it', 'No, not yet'], a: 0, why: 'We can count drops on each towel and compare.' },
    { q: 'Does a heavy marble roll farther than a light one down the same ramp?', opts: ['Yes, we can test it', 'No, not yet'], a: 0, why: 'We can roll both and measure how far each goes.' },
    { q: 'Which flower is the prettiest?', opts: ['Yes, we can test it', 'No, not yet'], a: 1, why: 'Pretty is an opinion. People can like different flowers, so we cannot test it with measuring.' },
    { q: 'How many leaves are on our maple tree’s lowest branch?', opts: ['Yes, we can test it', 'No, not yet'], a: 0, why: 'We can count them.' }
  ], 'Sort question cards: can we test it, or not yet?'));
  b = R(0, 150, 480, 100, GREEN, 'none', 0, 0) + person(120, 190, 1.3, BLUE) + cloud(280, 70, 1.6) + cloud(390, 100, 1.2) + L(140, 120, 240, 90, MUTED, 2, '5 5') + T(110, 236, 'weather watcher', { s: 14, w: 700 }) + tag(350, 130, '“What clouds do we see today?”', { s: 13 });
  p.addFig('s2', 'real', 1, 'k20-weather-watcher', fig('k20-weather-watcher', svg('k20-weather-watcher', 'A weather watcher', 'A child looks up at clouds in the sky and asks what clouds are there today.', 262, b, false), 'A weather watcher looks outside and asks a question about the clouds. The sky is the place to look for the answer.', 'A child looks at the sky and asks, what clouds do we see today?'));
  p.setBody('s3', 'analogy', 1, `<p>Two cookies are the same, but one has raisins. <b>Raisins</b> = the one thing we changed. <b>Same dough, same oven, same time</b> = the things we keep the same. If one tastes different, the raisins are the reason.</p><p class="tip">“Change one thing. Keep the rest the same.”</p>`);
  const bx = (x, t1, t2) => R(x, 50, 98, 96, SURF, INK, 12, 2.5) + T(x + 49, 76, t1, { s: 15, w: 700 }) + T(x + 49, 100, t2, { s: 12, f: MUTED, lh: 15 });
  b = bx(8, 'Notice', ['We saw', 'markers roll.']) + bx(126, 'Ask', ['How can we', 'stop them?']) + bx(244, 'Problem', ['Markers roll', 'off the table.']) + bx(362, 'Idea', ['A lip on', 'the table?']) + [106, 224, 342].map((x) => arrow(x + 2, 98, x + 20, 98, INK, 3, 9)).join('') + T(240, 170, 'Draw it, say it, share it.', { s: 14, f: MUTED });
  p.addFig('s3', 'diagram', 1, 'k20-notice-ask', fig('k20-notice-ask', svg('k20-notice-ask', 'Notice, Ask, Problem, Idea', 'Four boxes with arrows between them: Notice, Ask, Problem, Idea. We saw markers roll. We ask how can we stop them. The problem is markers roll off. An idea is a lip on the table.', 190, b, false), 'We notice something, ask a question, name the problem, and try an idea. “We saw markers roll. How can we stop them?”', 'Notice (markers roll) then Ask (how can we stop them?) then Problem (markers roll off) then Idea (a lip on the table).'));
  p.setBody('kit', 'try', 2, `<h3>What you do</h3>
      <p><b>1. Notice walk or tray (10 minutes).</b> Look closely at three things. Draw one small detail of each.</p>
      <p><b>2. Fair paper towels (15 minutes).</b> Same size towels, same dropper, same drop size. Count drops until each towel first drips. Do each three times with a fresh piece.</p>
      <p><b>3. Problem finder (10 minutes).</b> Watch crayons roll off a table. Draw it, say the problem, and sketch one tool or rule that might help.</p>`);
  [['Scientists notice things', 'analogy', 'Spelled out detective mapping and where it breaks'], ['Scientists notice things', 'try', 'Rewrote with materials, steps, what to notice'], ['Scientists notice things', 'data', 'Drew smooth/bumpy picture tally (4 and 5 from the page’s backup data)'], ['Questions help us learn', 'analogy', 'Spelled out flashlight mapping'], ['Questions help us learn', 'try', 'Built a 4-card can-we-test-it quiz'], ['Questions help us learn', 'real', 'Drew weather watcher looking at clouds'], ['We compare one thing at a time and share what we find', 'analogy', 'Spelled out cookie mapping'], ['We compare one thing at a time and share what we find', 'diagram', 'Drew Notice-Ask-Problem-Idea boxes'], ['Try it at home or in class', 'try', 'Station steps and timings']].forEach(([c, t, w]) => st(F, c, t, 'done', w, c.startsWith('Try') ? 'Timings are suggestions' : ''));
  p.save();
}
