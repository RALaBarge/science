import { Page, svg, fig, quiz, tryCell, T, R, C, E, L, P, arrow, sun, person, cloud, tree, check, cross, INK, MUTED, LINE, S2, SURF, BEAM, BLUE, ORANGE, TEAL, RED, GREEN, SHADE, ONC } from './lib.mjs';
export const log = [];
const st = (file, concept, type, status, what, check = '') => log.push({ file: `k-5/${file}`, concept, type, status, what, check });

// ================= K-A =================
{
  const F = 'unit-k-a-pushes-and-pulls.html', p = new Page(F);
  // s1 diagram: push and pull arrows
  let b = '';
  b += T(120, 58, 'PUSH', { s: 22, w: 800, f: ORANGE }) + T(360, 58, 'PULL', { s: 22, w: 800, f: BLUE });
  b += L(240, 44, 240, 232, LINE, 2, '6 6');
  // push: hand left of ball, arrow to the right
  b += R(26, 120, 38, 50, S2, INK, 14) + C(150, 146, 30, ORANGE, INK, 2) + arrow(72, 146, 112, 146, INK, 6, 16) + arrow(190, 146, 232, 146, ORANGE, 8, 20);
  b += T(120, 206, ['A push moves it', 'away from you'], { s: 16 });
  // pull: ball with rope, hand on the left pulls it toward the hand
  b += C(410, 146, 30, BLUE, INK, 2) + L(380, 146, 296, 146, INK, 3) + R(262, 126, 36, 40, S2, INK, 14) + arrow(382, 108, 324, 108, BLUE, 8, 20);
  b += T(360, 206, ['A pull brings it', 'toward you'], { s: 16 });
  const d1 = fig('ka-push-pull', svg('ka-push-pull', 'A push and a pull', 'Two pictures of a ball. On the left a hand pushes the ball and a big arrow points away from the hand. On the right a hand pulls the ball on a rope and a big arrow points toward the hand.', 240, b, false),
    'The arrow shows which way the push or pull goes. A push goes away from you. A pull comes toward you.', 'Left: a hand pushes a ball, arrow points away from the hand. Right: a hand pulls a ball on a rope, arrow points toward the hand.');
  p.addFig('s1', 'diagram', 1, 'ka-push-pull', d1);
  // s1 analogy: swing
  const frame = (cx) => L(cx - 70, 40, cx + 70, 40, INK, 6) + L(cx - 66, 40, cx - 84, 210, INK, 5) + L(cx + 66, 40, cx + 84, 210, INK, 5) + L(cx - 24, 40, cx - 24, 160, INK, 3) + L(cx + 24, 40, cx + 24, 160, INK, 3) + R(cx - 34, 160, 68, 10, ORANGE, INK, 3, 2) + person(cx, 160, 0.8, BLUE);
  b = frame(120) + arrow(14, 110, 72, 110, ORANGE, 7, 16) + T(14, 90, 'push', { s: 15, w: 700, f: ORANGE, a: 'start' }) + T(120, 244, 'A push starts the swing.', { s: 15 });
  b += frame(360) + R(412, 140, 34, 30, S2, INK, 12) + arrow(410, 155, 388, 155, RED, 7, 14) + T(430, 126, 'hand', { s: 15, w: 700, f: RED }) + T(360, 244, 'A hand stops it.', { s: 15 });
  p.addFig('s1', 'analogy', 1, 'ka-swing', fig('ka-swing', svg('ka-swing', 'A child on a swing', 'Two pictures of a child on a swing. In the first, an arrow shows a push starting the swing. In the second, a hand reaches out to stop the swing.', 262, b, false),
    'A push starts the swing moving. A hand pushing against it makes it stop. Pushes and pulls start and stop motion.', 'Left: child on a swing with a push arrow from behind; the swing starts. Right: child on a swing with a hand stopping it.'));
  // s1 real: zipper and door
  b = R(40, 50, 100, 150, S2, INK, 6, 3) + C(122, 128, 6, INK) + arrow(10, 125, 56, 125, ORANGE, 6, 16) + T(90, 224, ['Push a door', 'It swings away from you.'], { s: 14 });
  b += R(310, 50, 56, 160, S2, INK, 6, 2) + L(338, 56, 338, 150, INK, 2, '4 4') + R(322, 150, 32, 24, BEAM, INK, 5, 2) + arrow(338, 180, 338, 226, BLUE, 6, 16) + T(338, 250, ['Pull a zipper', 'It moves the way you pull.'], { s: 14 });
  p.addFig('s1', 'real', 1, 'ka-door-zip', fig('ka-door-zip', svg('ka-door-zip', 'Pushes and pulls every day', 'A door with an arrow showing a push, and a zipper with an arrow showing a pull down.', 280, b, false), 'You push a door open. You pull a zipper down. Pushes and pulls are everywhere.', 'A door with a push arrow pointing in. A zipper with a pull arrow pointing down.'));
  // s1 try
  p.setBody('s1', 'try', 1, tryCell({
    guess: 'If you tap a toy car gently, will it go far or not far?',
    need: 'one toy car, a flat floor or table, a line of tape.',
    do: 'Put the car on the tape line. Give it a gentle push. Watch where it stops. Now roll it back, push again, and this time use your hand to stop it before it goes far.',
    notice: 'The car did not start by itself. Your push made it go. Your hand made it stop.',
    why: 'A push can start motion, and a push from your hand can also stop it.',
    safety: 'Keep small cars away from mouths. Roll on the floor, not near stairs.', tip: 'Make it go. Make it stop.'
  }));
  // s2 real: sailboat and snowplow
  b = R(0, 150, 480, 100, S2, 'none', 0, 0) + P('M0 200 q20 -12 40 0 t40 0 t40 0 t40 0 t40 0', 'none', BLUE, 3) + P('M20 170 L100 170 L84 195 L36 195 Z', ORANGE, INK, 2) + L(60, 170, 60, 60, INK, 3) + P('M60 62 L60 164 L108 164 Z', SURF, INK, 2);
  b += arrow(6, 100, 40, 100, TEAL, 6, 14) + arrow(6, 125, 40, 125, TEAL, 6, 14) + T(8, 40, 'Wind pushes the boat', { s: 14, w: 700, a: 'start' });
  b += R(290, 150, 120, 36, BEAM, INK, 6, 2) + C(312, 192, 12, INK) + C(388, 192, 12, INK) + P('M262 186 L290 150 L290 190 Z', INK, INK, 1);
  b += E(196, 194, 34, 14, SURF, LINE, 2) + arrow(258, 172, 232, 172, ORANGE, 6, 14) + T(250, 40, 'A snowplow pushes snow', { s: 14, w: 700, a: 'start' });
  p.addFig('s2', 'real', 1, 'ka-wind-plow', fig('ka-wind-plow', svg('ka-wind-plow', 'Wind and a snowplow push', 'A sailboat with arrows showing wind pushing its sail, and a snowplow with an arrow showing it pushing a pile of snow.', 250, b, false), 'Wind can push a boat on the Great Lakes. A snowplow pushes snow off the road.', 'Left: sailboat with wind arrows pushing the sail. Right: snowplow pushing snow forward.'));
  // s3 diagram: ramp, stopper
  b = P('M30 120 L250 200 L30 200 Z', S2, INK, 3) + `<g transform="translate(110 149) rotate(20)">${R(-22, -26, 44, 18, BLUE, INK, 5, 2)}${C(-12, -6, 7, INK)}${C(12, -6, 7, INK)}</g>`;
  b += L(250, 200, 440, 200, INK, 3) + R(372, 150, 34, 50, ORANGE, INK, 4, 2) + T(389, 142, 'stopper', { s: 14, w: 700 }) + L(332, 200, 332, 222, RED, 4) + T(332, 242, 'finish line', { s: 14, w: 700, f: RED });
  b += T(60, 100, 'ramp', { s: 14, w: 700 }) + arrow(300, 180, 350, 180, BLUE, 5, 14);
  b += R(30, 262, 120, 34, SURF, INK, 17, 2) + T(90, 285, '1 Draw', { s: 16, w: 700 }) + R(180, 262, 120, 34, SURF, INK, 17, 2) + T(240, 285, '2 Build', { s: 16, w: 700 }) + R(330, 262, 120, 34, SURF, INK, 17, 2) + T(390, 285, '3 Test', { s: 16, w: 700 });
  p.addFig('s3', 'diagram', 1, 'ka-ramp-stopper', fig('ka-ramp-stopper', svg('ka-ramp-stopper', 'A ramp, a car, and a stopper', 'A toy car at the top of a ramp, a flat floor, a finish line and a stopper block at the end. Below, three steps: draw, build, test.', 312, b, false), 'The car rolls down the ramp. The stopper block should stop it at the finish line. First draw it, then build it, then test it.', 'A ramp with a toy car at the top, a floor with a finish line and a stopper block. Three steps below: 1 Draw, 2 Build, 3 Test.'));
  p.setBody('s3', 'try', 1, tryCell({
    guess: 'Will your stopper keep the car from rolling past the line? Draw it first.',
    need: 'toy car, a ramp (a book with cardboard), tape for the finish line, a foam piece, a paper cup, or a cardboard block.',
    do: 'Tape a finish line on the floor. Roll the car down the ramp with no stopper to see where it goes. Then build a stopper and put it on the line. Roll the car again. Did the car stop before the line?',
    notice: 'A soft stopper (foam) can slow the car gently. A hard one can make it bounce back. Change one thing and test again.',
    why: 'A design is an idea you test. If the car rolls past, the design can be fixed.',
    safety: 'Keep small stoppers and cars out of mouths. Wipe up any spills so no one slips.', tip: 'Can your block stop the car?'
  }));
  p.addFig('s3', 'real', 1, 'ka-gate', fig('ka-gate', svg('ka-gate', 'A gate stops a ball', 'A ball rolling toward a fence gate with an arrow, and the gate stopping it.', 230, R(0, 160, 480, 70, S2, 'none', 0, 0) + [150, 190, 230, 270, 310].map((x) => R(x, 90, 14, 90, ORANGE, INK, 3, 2)).join('') + L(140, 110, 330, 110, INK, 4) + L(140, 160, 330, 160, INK, 4) + C(70, 160, 20, BLUE, INK, 2) + arrow(100, 160, 140, 160, BLUE, 6, 14) + T(400, 140, ['The gate stops', 'the ball.'], { s: 15, w: 700 }), false), 'A gate or a bumper is a safe design. It stops things that roll before they get to a road or a person.', 'A ball rolls toward a fence; the gate stops it.'));
  // kit what you do
  p.setBody('kit', 'try', 2, `<h3>What you do</h3>
      <p><b>Station 1, pushes (about 10 minutes).</b> Roll a toy car with a soft push and a strong push. Put a sticker where each one stops. Count floor tiles. Which push went farther?</p>
      <p><b>Station 2, Safe Stopper (about 20 minutes).</b> Draw a ramp and a stopper. Build two different stoppers (for example foam and cardboard). Roll the car 3 times at each and tally how many times it stopped before the line.</p>
      <p><b>Look for:</b> the stopper that works most of the 3 tries. Say: “Foam stopped it ___ times. Cardboard stopped it ___ times.”</p>`);
  st(F, 'Pushes and pulls start, stop, and change motion', 'diagram', 'done', 'Drew push/pull ball diagram with big arrows');
  st(F, 'Pushes and pulls start, stop, and change motion', 'analogy', 'done', 'Drew swing push/stop picture');
  st(F, 'Pushes and pulls start, stop, and change motion', 'try', 'done', 'Rewrote with guess, steps, what to notice, safety');
  st(F, 'Pushes and pulls start, stop, and change motion', 'real', 'done', 'Drew door push and zipper pull');
  st(F, 'Strength and direction matter', 'real', 'done', 'Drew sailboat and snowplow');
  st(F, 'We can design things to change motion safely', 'diagram', 'done', 'Drew ramp, car, stopper, finish line, draw-build-test');
  st(F, 'We can design things to change motion safely', 'try', 'done', 'Rewrote with steps and what to notice');
  st(F, 'We can design things to change motion safely', 'real', 'done', 'Drew gate stopping a ball');
  st(F, 'Try it at home or in class', 'try', 'done', 'Station steps and timing added (timings are estimates)', 'Station timings are suggestions');
  p.save();
}
