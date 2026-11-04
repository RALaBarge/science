// The graphs: one entry per graph, numbers copied from the lesson page's own backup data.
// { id, unit (page basename), after (section id), caption, svg }  svg is built by graphs.mjs.
import { bars, line, squares, dots, C } from './graphs.mjs';

const U = {
  k20: 'unit-k2-0-science-noticing-and-asking',
  ka: 'unit-k-a-pushes-and-pulls',
  kb: 'unit-k-b-sunlight-weather-and-staying-safe',
  kc: 'unit-k-c-living-things-and-their-homes',
  '1a': 'unit-1-a-sound-and-light',
  '1b': 'unit-1-b-parts-parents-and-young',
  '1c': 'unit-1-c-sky-patterns',
  '2a': 'unit-2-a-materials-and-their-uses',
  '2b': 'unit-2-b-plants-animals-and-habitats',
  '2c': 'unit-2-c-land-and-water-fast-and-slow',
  '31': 'unit-3-1-forces-motion-and-magnets',
  '32': 'unit-3-2-weather-climate-and-hazards',
  '33': 'unit-3-3-life-cycles-and-traits',
  '34': 'unit-3-4-survival-fossils-and-change',
  '41': 'unit-4-1-energy-speed-and-collisions',
  '42': 'unit-4-2-circuits-and-energy-conversion',
  '43': 'unit-4-3-waves-light-and-information',
  '44': 'unit-4-4-structures-senses-and-responses',
  '45': 'unit-4-5-earths-surface-rocks-maps-erosion-resources',
  '51': 'unit-5-1-matter-mixtures-and-changes',
  '52': 'unit-5-2-gravity-stars-and-sky-patterns',
  '53': 'unit-5-3-energy-and-matter-in-ecosystems',
  '54': 'unit-5-4-earths-spheres-water-and-communities',
};
export const UNITS = U;

const pairs = (cats, vals, unit) => cats.map((c, i) => `${c} ${vals[i]}${unit ? ' ' + unit : ''}`).join(', ');
const simple = (o) => {
  const alt = o.alt || `Bar graph, ${o.title}. ${pairs(o.cats, o.series[0].values, o.altUnit)}.`;
  return bars({ ...o, alt });
};

export const GRAPHS = [
  { id: 'g-k20-towels', unit: U.k20, after: 'kit',
    caption: 'Towel A held 5 drops and Towel B held 8 drops. Same dropper, same amount: the towels are what is different.',
    svg: (id) => simple({ id, title: 'Drops each towel held', ylabel: 'Drops held', cats: ['Towel A', 'Towel B'], series: [{ name: 'Drops', values: [5, 8], color: C.a }], max: 10, step: 2, altUnit: 'drops' }) },
  { id: 'g-ka-push', unit: U.ka, after: 'kit',
    caption: 'A soft push sent the car 2 floor tiles. A strong push sent it 6 tiles.',
    svg: (id) => simple({ id, title: 'How far the car rolled', ylabel: 'Floor tiles', cats: ['Soft push', 'Strong push'], series: [{ name: 'Tiles', values: [2, 6], color: C.a }], max: 8, step: 2, altUnit: 'floor tiles' }) },
  { id: 'g-ka-stopper', unit: U.ka, after: 'kit',
    caption: 'The foam stopper stopped the car 3 times out of 3. The cardboard stopper stopped it 1 time out of 3.',
    svg: (id) => simple({ id, title: 'Times the car was stopped (3 tries)', ylabel: 'Stops out of 3', cats: ['Foam stopper', 'Cardboard stopper'], series: [{ name: 'Stops', values: [3, 1], color: C.c }], max: 3, step: 1, altUnit: 'stops out of 3 tries' }) },
  { id: 'g-kb-weather', unit: U.kb, after: 's3',
    caption: 'A 20-day Michigan fall sample: 8 sunny, 6 cloudy, 4 rainy and 2 snowy days. Sunny days were the most common.',
    svg: (id) => simple({ id, title: 'Weather over 20 days (Michigan fall sample)', ylabel: 'Number of days', cats: ['Sunny', 'Cloudy', 'Rainy', 'Snowy'], series: [{ name: 'Days', values: [8, 6, 4, 2], color: C.d }], max: 10, step: 2, altUnit: 'days' }) },
  { id: 'g-kb-melt', unit: U.kb, after: 'kit',
    caption: 'The ice cube in the shade left 5 drops of melt. The ice cube in the sun left 12 drops.',
    svg: (id) => simple({ id, title: 'Melt drops after the same time', ylabel: 'Drops of melt', cats: ['Shaded ice', 'Uncovered ice'], series: [{ name: 'Drops', values: [5, 12], color: C.a }], max: 14, step: 2, altUnit: 'drops' }) },
  { id: 'g-kc-habitats', unit: U.kc, after: 'kit',
    caption: 'Picture counts: the pond had 4 kinds of living things, the forest 6 and the sand dune 3.',
    svg: (id) => simple({ id, title: 'Kinds of living things in each habitat', ylabel: 'Kinds', cats: ['Pond', 'Forest', 'Sand dune'], series: [{ name: 'Kinds', values: [4, 6, 3], color: C.c }], max: 8, step: 2, altUnit: 'kinds' }) },
  { id: 'g-kc-litter', unit: U.kc, after: 'kit',
    caption: 'Litter pieces before the clean-up: 10. After: 0.',
    svg: (id) => simple({ id, title: 'Litter pieces before and after', ylabel: 'Pieces of litter', cats: ['Before', 'After'], series: [{ name: 'Pieces', values: [10, 0], color: C.b }], max: 12, step: 2, altUnit: 'pieces' }) },
  { id: 'g-1c-daylight', unit: U['1c'], after: 's3',
    caption: 'Michigan daylight strips, about 9 squares of light in December, 12 in March and 15 in June. Summer days have more daylight.',
    svg: (id) => simple({ id, title: 'About how much daylight (squares of light)', ylabel: 'Squares of daylight', cats: ['December', 'March', 'June'], series: [{ name: 'Squares', values: [9, 12, 15], color: C.d }], max: 16, step: 4, altUnit: 'squares', note: 'Numbers are approximate' }) },
  { id: 'g-2a-rainproof', unit: U['2a'], after: 'kit',
    caption: 'Rainproof Note backup data. Plastic wrap and foil stayed dry all 3 tries; cloth got damp then wet; paper was wet every time.',
    svg: (id) => {
      const P = { Dry: { fill: 'var(--transmit,#0B7F70)', text: 'var(--on-color,#fff)' }, Damp: { fill: 'var(--beam,#F2A900)', text: 'var(--beam-ink,#1A1400)' }, Wet: { fill: 'var(--absorb,#D6450B)', text: 'var(--on-color,#fff)' } };
      const row = (label, a) => ({ label, cells: a.map((t) => ({ v: t, t: t.toLowerCase() })) });
      return dots({ id, title: 'Rainproof Note: did the paper stay dry?', cols: ['Try 1', 'Try 2', 'Try 3'], palette: P,
        rows: [row('Plastic wrap', ['Dry', 'Dry', 'Dry']), row('Foil', ['Dry', 'Dry', 'Dry']), row('Cloth', ['Damp', 'Wet', 'Wet']), row('Paper', ['Wet', 'Wet', 'Wet'])],
        alt: 'Table drawn with colored dots. Plastic wrap: dry, dry, dry. Foil: dry, dry, dry. Cloth: damp, wet, wet. Paper: wet, wet, wet.' });
    } },
  { id: 'g-2b-beans', unit: U['2b'], after: 's1',
    caption: 'Bean heights in paper clips on day 7 and day 14. Sun + water grew most (9). No sun + water grew to 7 but was pale yellow and floppy. Without water the beans stayed at 1.',
    svg: (id) => bars({ id, title: 'Bean height (paper clips)', ylabel: 'Paper clips tall', cats: ['Sun + water', 'No sun + water', 'Sun + no water', 'No sun + no water'], series: [{ name: 'Day 7', values: [4, 4, 1, 1], color: C.a }, { name: 'Day 14', values: [9, 7, 1, 1], color: C.c }], max: 10, step: 2,
      alt: 'Grouped bar graph of bean height in paper clips. Sun and water: 4 on day 7, 9 on day 14. No sun, water: 4 and 7. Sun, no water: 1 and 1. No sun, no water: 1 and 1.' }) },
  { id: 'g-2b-habitats', unit: U['2b'], after: 's3',
    caption: 'The forest picture set had 6 kinds of living things. The dune picture set had 3 kinds.',
    svg: (id) => simple({ id, title: 'Kinds of living things counted', ylabel: 'Kinds', cats: ['Forest', 'Dune'], series: [{ name: 'Kinds', values: [6, 3], color: C.c }], max: 8, step: 2, altUnit: 'kinds' }) },
  { id: 'g-2c-guard', unit: U['2c'], after: 'kit',
    caption: 'Sand moved in 3 tries for each guard. Grass moved the least sand. With no guard the sand moved 4 to 5 finger widths.',
    svg: (id) => bars({ id, title: 'How far the sand moved', ylabel: 'Finger widths', cats: ['No guard', 'Grass', 'Stones', 'Paper barrier'], series: [{ name: 'Try 1', values: [4, 1, 2, 3], color: C.a }, { name: 'Try 2', values: [5, 1, 1, 3], color: C.b }, { name: 'Try 3', values: [4, 2, 2, 2], color: C.c }], max: 6, step: 1, h: 340,
      alt: 'Grouped bar graph of sand moved in finger widths over 3 tries. No guard: 4, 5, 4. Grass: 1, 1, 2. Stones: 2, 1, 2. Paper barrier: 3, 3, 2.' }) },
  { id: 'g-31-dots-a', unit: U['31'], after: 's2',
    caption: 'Backup set 1 for a model ball with no friction: 0, 10, 20 and 30 cm at 0, 1, 2 and 3 seconds. The open dot is the prediction, 40 cm at 4 seconds. A real ball on a floor slows down, so its dots would bunch closer.',
    svg: (id) => line({ id, title: 'Model ball position (no friction)', xlabel: 'Time (seconds)', ylabel: 'Position (cm)', xs: [0, 1, 2, 3, 4], series: [{ name: 'Position', ys: [0, 10, 20, 30, 40], color: C.a, hollowLast: true }], ymin: 0, ymax: 50, ystep: 10,
      alt: 'Line graph of a model ball with no friction. Position is 0 cm at 0 s, 10 at 1 s, 20 at 2 s, 30 at 3 s, in a straight line. The prediction for 4 s is 40 cm, shown as an open dot.' }) },
  { id: 'g-31-dots-b', unit: U['31'], after: 's2',
    caption: 'Backup set 2: 0, 8, 16 and 24 cm at 0, 1, 2 and 3 seconds. The open dot predicts 32 cm at 4 seconds.',
    svg: (id) => line({ id, title: 'Second set: position over time', xlabel: 'Time (seconds)', ylabel: 'Position (cm)', xs: [0, 1, 2, 3, 4], series: [{ name: 'Position', ys: [0, 8, 16, 24, 32], color: C.b, hollowLast: true }], ymin: 0, ymax: 40, ystep: 10,
      alt: 'Line graph. Position is 0 cm at 0 s, 8 at 1 s, 16 at 2 s, 24 at 3 s, in a straight line. The prediction for 4 s is 32 cm, shown as an open dot.' }) },
  { id: 'g-32-temp', unit: U['32'], after: 's3',
    caption: 'Typical average daily HIGH temperature by month for Detroit, rounded to the nearest degree. A given year can differ by several degrees. July is the warmest at 83 F and January the coldest at 32 F.',
    svg: (id) => {
      const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const v = [32, 35, 45, 58, 69, 79, 83, 81, 74, 62, 50, 38];
      return bars({ id, title: 'Detroit typical daily high by month', ylabel: 'Degrees F', cats: m, series: [{ name: 'High', values: v, color: C.b }], max: 90, step: 10, h: 330,
        alt: 'Bar graph of typical average daily high temperature in Detroit by month, in degrees F. ' + pairs(m, v) + '. Summer months are tall, winter months are short.' });
    } },
  { id: 'g-32-rain', unit: U['32'], after: 's3',
    caption: 'Typical precipitation by month for Detroit, in inches. It is fairly even through the year, from about 1.9 inches in February to 3.2 in June and August.',
    svg: (id) => {
      const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const v = [2.0, 1.9, 2.4, 3.0, 3.0, 3.2, 3.1, 3.2, 3.0, 2.6, 2.7, 2.2];
      return bars({ id, title: 'Detroit typical precipitation by month', ylabel: 'Inches', cats: m, series: [{ name: 'Precipitation', values: v, color: C.a }], max: 4, step: 1, h: 330,
        alt: 'Bar graph of typical precipitation in Detroit by month, in inches. ' + pairs(m, v) + '. Every month is between about 1.9 and 3.2 inches.' });
    } },
  { id: 'g-32-barrier', unit: U['32'], after: 'kit',
    caption: 'Spoonfuls of sediment moved: no barrier 8, cardboard fence 5, grass model 2.',
    svg: (id) => simple({ id, title: 'Sediment moved by flood water', ylabel: 'Spoonfuls', cats: ['No barrier', 'Cardboard fence', 'Grass model'], series: [{ name: 'Spoonfuls', values: [8, 5, 2], color: C.b }], max: 10, step: 2, altUnit: 'spoonfuls' }) },
  { id: 'g-33-parents', unit: U['33'], after: 's2',
    caption: 'Each parent bean made 10 offspring seeds. Most look like the parent, but not all.',
    svg: (id) => bars({ id, title: 'Offspring seeds compared with the parent', ylabel: 'Seeds (out of 10)', cats: ['Yellow parent', 'Green parent', 'Spotted parent'], series: [{ name: 'Like the parent', values: [8, 9, 6], color: C.c }, { name: 'Different', values: [2, 1, 4], color: C.d }], max: 10, step: 2,
      alt: 'Grouped bar graph of 10 offspring seeds per parent. Yellow parent: 8 yellow, 2 green. Green parent: 9 green, 1 yellow. Spotted parent: 6 spotted, 4 yellow.' }) },
  { id: 'g-33-sunshade', unit: U['33'], after: 's3',
    caption: 'After two weeks the shade plant was taller (22 cm) than the sun plant (18 cm), but thin, pale and with small leaves. The sun plant had a thick green stem and wide leaves.',
    svg: (id) => simple({ id, title: 'Bean height after two weeks', ylabel: 'Height (cm)', cats: ['Sun plant', 'Shade plant'], series: [{ name: 'cm', values: [18, 22], color: C.c }], max: 25, step: 5, altUnit: 'cm' }) },
  { id: 'g-34-fur', unit: U['34'], after: 'kit',
    caption: 'In a model herd, 8 animals with thick fur survived and 2 animals with thin fur survived. It is a made-up model, not wildlife data.',
    svg: (id) => simple({ id, title: 'Model herd: how many survived', ylabel: 'Survived', cats: ['Thick fur', 'Thin fur'], series: [{ name: 'Survived', values: [8, 2], color: C.c }], max: 10, step: 2, altUnit: 'survived', note: 'Made-up model numbers' }) },
  { id: 'g-41-ramp', unit: U['41'], after: 'kit',
    caption: 'The target moved 2, 2 and 3 cm from the low ramp, and 7, 8 and 8 cm from the high ramp. Same marble, same target: only the ramp height changed.',
    svg: (id) => bars({ id, title: 'How far the target moved', ylabel: 'Distance (cm)', cats: ['Try 1', 'Try 2', 'Try 3'], series: [{ name: 'Low ramp', values: [2, 2, 3], color: C.a }, { name: 'High ramp', values: [7, 8, 8], color: C.b }], max: 10, step: 2,
      alt: 'Grouped bar graph of target distance in cm. Low ramp: 2, 2, 3. High ramp: 7, 8, 8.' }) },
  { id: 'g-41-cool', unit: U['41'], after: 's3',
    caption: 'A warm object cooled from 40 C to 37 C to 35 C over three readings, as heat moved to the cooler air around it.',
    svg: (id) => line({ id, title: 'Cooling data', xlabel: 'Reading', ylabel: 'Temperature (C)', xs: [1, 2, 3], xlabels: ['1', '2', '3'], series: [{ name: 'Temp', ys: [40, 37, 35], color: C.b }], ymin: 30, ymax: 45, ystep: 5,
      alt: 'Line graph of temperature in degrees C over three readings: 40, 37 and 35. The line slopes down.' }) },
  { id: 'g-42-tester', unit: U['42'], after: 'kit',
    caption: 'Material tester: paper clip and foil let the bulb light. String, plastic and wood did not. The switch closed lit the bulb and open did not.',
    svg: (id) => {
      const P = { yes: { fill: 'var(--transmit,#0B7F70)', text: 'var(--on-color,#fff)' }, no: { fill: 'var(--surface-2,#E8EDF6)', stroke: 'var(--muted,#47506E)', text: 'var(--ink,#12172B)' } };
      const r = (label, v) => ({ label, cells: [{ v, t: v }] });
      return dots({ id, title: 'Did the bulb light?', cols: ['Bulb lit?'], palette: P,
        rows: [r('Paper clip', 'yes'), r('Foil', 'yes'), r('String', 'no'), r('Plastic', 'no'), r('Wood', 'no'), r('Switch closed', 'yes'), r('Switch open', 'no')],
        alt: 'Table drawn with dots. Bulb lit with paper clip: yes. Foil: yes. String: no. Plastic: no. Wood: no. Switch closed: yes. Switch open: no.' });
    } },
  { id: 'g-43-wave', unit: U['43'], after: 's1',
    caption: 'A small wave moved the floating object 1 cm. A large wave moved it 3 cm. Bigger waves carry more energy.',
    svg: (id) => simple({ id, title: 'How far a wave moved an object', ylabel: 'Movement (cm)', cats: ['Small wave', 'Large wave'], series: [{ name: 'cm', values: [1, 3], color: C.a }], max: 4, step: 1, altUnit: 'cm' }) },
  { id: 'g-43-signal', unit: U['43'], after: 'kit',
    caption: 'Messages decoded correctly out of 5 tries: flashlight code 4, drum code 3.',
    svg: (id) => simple({ id, title: 'Signal accuracy at 3 meters', ylabel: 'Correct out of 5', cats: ['Flashlight code', 'Drum code'], series: [{ name: 'Correct', values: [4, 3], color: C.d }], max: 5, step: 1, altUnit: 'out of 5' }) },
  { id: 'g-44-reaction', unit: U['44'], after: 'kit',
    caption: 'Distance the ruler fell before it was caught. Farther down means slower. Sight: 12, 10, 9 cm. Sound cue: 14, 12, 13 cm.',
    svg: (id) => bars({ id, title: 'Reaction distance (farther = slower)', ylabel: 'Ruler fell (cm)', cats: ['Try 1', 'Try 2', 'Try 3'], series: [{ name: 'Sight', values: [12, 10, 9], color: C.a }, { name: 'Sound cue', values: [14, 12, 13], color: C.b }], max: 16, step: 4,
      alt: 'Grouped bar graph of how far the ruler fell in cm. Sight: 12, 10, 9. Sound cue: 14, 12, 13. Farther means a slower reaction.' }) },
  { id: 'g-45-sediment', unit: U['45'], after: 'kit',
    caption: 'Sediment lost in the shoreline tray: no barrier 12 spoons, wall 7 spoons, grass 5 spoons.',
    svg: (id) => simple({ id, title: 'Sediment moved by waves', ylabel: 'Spoonfuls', cats: ['No barrier', 'Wall', 'Grass'], series: [{ name: 'Spoons', values: [12, 7, 5], color: C.b }], max: 14, step: 2, altUnit: 'spoonfuls' }) },
  { id: 'g-51-mass', unit: U['51'], after: 's5',
    caption: 'Mass before and after. The sealed cup of melting ice stays 82 g. The sealed bag with baking soda and vinegar stays 45 g. Each pair of bars is the same height: matter did not disappear.',
    svg: (id) => bars({ id, title: 'Mass before and after (sealed)', ylabel: 'Mass (g)', cats: ['Sealed cup of ice melting', 'Sealed bag: baking soda + vinegar'], series: [{ name: 'Before', values: [82, 45], color: C.a }, { name: 'After', values: [82, 45], color: C.c }], max: 100, step: 20,
      alt: 'Grouped bar graph of mass in grams. Sealed cup of ice melting: 82 before, 82 after. Sealed bag with baking soda and vinegar: 45 before, 45 after. Each pair is the same height.' }) },
  { id: 'g-52-shadow', unit: U['52'], after: 's3',
    caption: 'Shadow of a 10 cm stick on a sunny day in about March or September. The shadow is shortest at noon (9 cm, pointing north) and long in the morning and afternoon. It points west in the morning and east in the afternoon, away from the Sun.',
    svg: (id) => {
      const c = ['8:30 am points west', '10:00 am points northwest', '12:00 pm points north', '2:00 pm points northeast', '3:30 pm points east'];
      const v = [34, 20, 9, 18, 30];
      return bars({ id, title: 'Shadow of a 10 cm stick', ylabel: 'Shadow length (cm)', cats: c, series: [{ name: 'Length', values: v, color: C.d }], max: 40, step: 10, h: 350,
        alt: 'Bar graph of shadow length of a 10 cm stick with direction. 8:30 am: 34 cm, west. 10:00 am: 20 cm, northwest. 12:00 pm: 9 cm, north. 2:00 pm: 18 cm, northeast. 3:30 pm: 30 cm, east. Shortest at noon.' });
    } },
  { id: 'g-53-beans', unit: U['53'], after: 'kit',
    caption: 'Height after 10 days. The two light plants (A, B) were 12 and 11 cm, green and sturdy. The two dark plants (C, D) were 14 and 13 cm, pale and thin. Light matters for energy; this graph does not show where the plant’s mass comes from.',
    svg: (id) => bars({ id, title: 'Bean height after 10 days', ylabel: 'Height (cm)', cats: ['Plant A', 'Plant B', 'Plant C', 'Plant D'], series: [{ name: 'Grown in light (green, sturdy)', values: [12, 11, null, null], color: C.c }, { name: 'Grown in dark (pale, thin)', values: [null, null, 14, 13], color: C.d }], max: 16, step: 4, h: 350,
      alt: 'Bar graph of bean height after 10 days. Plant A, light: 12 cm, green and sturdy. Plant B, light: 11 cm. Plant C, dark: 14 cm, pale and thin. Plant D, dark: 13 cm, pale and thin.' }) },
  { id: 'g-53-treesoil', unit: U['53'], after: 's1',
    caption: 'A tree grew from 2 kg to 50 kg. The soil went from 100 kg to 99.9 kg. The plant changed a lot and the soil barely changed, so the tree’s matter did not come mostly from the soil.',
    svg: (id) => bars({ id, title: 'Tree mass and soil mass', ylabel: 'Mass (kg)', cats: ['Tree', 'Soil'], series: [{ name: 'Start', values: [2, 100], color: C.a }, { name: 'Later', values: [50, 99.9], color: C.c }], max: 100, step: 20,
      alt: 'Grouped bar graph of mass in kilograms. Tree: 2 at the start, 50 later. Soil: 100 at the start, 99.9 later. The tree bar grows a lot; the soil bars look the same height.' }) },
  { id: 'g-54-sediment', unit: U['54'], after: 'kit',
    caption: 'Stream-tray test, sediment moved: no plants 12 spoonfuls, stones model 7, grass model 4.',
    svg: (id) => simple({ id, title: 'Sediment moved in the stream tray', ylabel: 'Spoonfuls', cats: ['No plants', 'Stones model', 'Grass model'], series: [{ name: 'Spoonfuls', values: [12, 7, 4], color: C.b }], max: 14, step: 2, altUnit: 'spoonfuls' }) },
  { id: 'g-54-water', unit: U['54'], after: 's2',
    caption: 'If all of Earth’s water were 100 squares: about 97 are salty ocean, 2 are frozen fresh water, about 1 is fresh water underground, and lakes and rivers are less than one square, a tiny dot. Almost no liquid fresh water is easy to reach.',
    svg: (id) => squares({ id, title: 'Earth’s water as 100 squares', total: 100, per: 10,
      groups: [{ name: 'Salty ocean water: about 97 squares', count: 97, color: 'var(--reflect,#2B66E8)' }, { name: 'Frozen fresh water: about 2 squares', count: 2, color: 'var(--beam,#F2A900)' }, { name: 'Fresh water underground: about 1 square', count: 1, color: 'var(--transmit,#0B7F70)' }],
      dotLast: { name: 'Lakes and rivers: less than 1 square (tiny dot)', color: 'var(--absorb,#D6450B)' },
      alt: 'A grid of 100 squares. 97 are blue for salty ocean water, 2 are yellow for frozen fresh water, 1 is green for fresh water underground. Lakes and rivers are less than one square, shown as a tiny dot.' }) },
  { id: 'g-54-garden', unit: U['54'], after: 'kit',
    caption: 'Runoff after a storm: parking lot 10 buckets, rain garden 6 buckets. A rain garden reduces runoff but does not stop all of it.',
    svg: (id) => simple({ id, title: 'Runoff after a storm', ylabel: 'Buckets of runoff', cats: ['Parking lot', 'Rain garden'], series: [{ name: 'Buckets', values: [10, 6], color: C.a }], max: 12, step: 2, altUnit: 'buckets' }) },
];
