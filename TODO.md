# TODO

## Parked until content is finished

**Screen-reader / voiceover support for readers who can't see well.** Start only once the lesson content is final, so the work isn't redone with every edit.

Scope to cover on every lesson page, the lesson map, and the arcade:

- Text alternatives for every image, SVG diagram and canvas picture (say what it shows, not just that it exists).
- Labels and keyboard operation for all sliders, chips, buttons and other controls; `aria-live` on readouts that change.
- A text equivalent for each embedded game and arcade game, or a clear note on what isn't playable without sight.
- Heading order, landmarks, a skip link, descriptive link text.
- Respect reduced-motion; keep focus visible, including in the retro style.
- Test with NVDA and VoiceOver, and record what was checked.

Plan: one lead agent splits the work by grade folder, one sub-agent per folder, then rebuilds `dist/` and runs `node tests/links.test.js`.

## K-5 units (added 2026-11-03)

- Verify every K-5 footer standard against the Michigan Department of Education Science Standards document (codes follow NGSS and are expected to match, not yet checked).
- The 23 new units have no embedded game and no custom SVG illustrations. Add per-unit games (ideas are in the tutor-note text of the source write-ups) and diagrams.
- Quizzes are generated from model-written questions: read each for a single defensible answer and add misconception-based distractors where they are weak.
- K-B (weather calendar), 1-C (daylight log) and 2-B (bean plants) need weeks of lead time; each page offers a provided dataset instead.

### Grok review of the K-5 units (2026-11-03): what is left

Text fixes from the review were applied (5.3 matter vs energy, 5.4 water reservoirs, 1-C seasons wording and quiz, 5.1 sealed-bag safety and salt recovery, no button cells in K-2, 4.5 energy effects, 3.2 wind vane and temperature label, 4.3 wave wording, 4.2 short-circuit warning, false "returns" lines, 2-C glossary and straws, backup-data caveat). Still open from that review:

- 3.1: the frictionless dot table is now labeled as a model; add a moving-object balanced-forces activity.
- 4.5: the map-pattern data still hands over the answer; 4.4 ruler drop needs "farther down = slower" on the scale; 5.2 needs shadow direction, not only length, and a "toward Earth's center" globe diagram; 2-B Concept 3 uses a picture-card count as habitat evidence.
- K-B Concept 3 (lake-effect) is beyond kindergarten; K-C "plants make food" is ahead of the evidence.
- K-2 quiz distractors still restate the misconception.

Game plan (six shared engines, build in this order): Big Sort (tap-bin, match, order), Push Arena (one-variable motion, not a duel), Path & Signal (port Laser Bounce and Short Circuit), Fair Test Lab (copy Mystery Machine), Graph & Sky, Scene & Web. Do not reskin Gravity, Football or Balance Duel for these units. First eight builds: Big Sort with K-B and 2-C skins; 1-C day/night spin with stars under the sky wash; K-A Push Pit; light-into-the-eye path plus four materials in a beam; Fair Test Lab with Dry Note and Guard the Sand; 5.3 two-rail matter/energy board; 4.1 heat-arrow-and-coat diagram; Short Circuit skin for 4.2 (polarity, insulator gap, hot-short stop). Ten highest-value diagrams: 5.3 matter vs energy board, 5.3 matter cycle vs one-way energy, 4.3 light into the eye, 1-C day/night spin, 5.4 water reservoirs (ocean, ice, underground, a dot for lakes and rivers), 3.1 balanced forces on a moving object, 4.2 closed loop, 5.1 dissolve and count, 5.2 shadow length and direction, 4.1 heat arrow and coat.
