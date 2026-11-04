# K–5 activities: design

Status (2026-11-04): two engines built, Big Sort and Fair Test Lab. 17 of 23 units have an activity. Big Sort: K-B, K-C, 1-A, 1-B, 2-B, 3.2, 3.3, 3.4, 4.3, 4.4, 5.1, 5.3, 5.4. Fair Test Lab (backup data from the page, one or more rounds): 2-A, 2-C, 4.1, 4.5. No activity yet: K2.0, K-A, 1-C, 3.1, 4.2, 5.2. Push Arena, Path & Signal, Graph & Sky and Scene & Web are not built, and further games are on hold until the existing ones get a check that kids find them fun. Units 1-A, 2-B, 3.2, 3.4, 4.3, 4.4, 5.1, 5.3 and 5.4 use Big Sort where the table below names another engine; they are stand-ins until a richer game is decided.

## Goal

Every K–5 unit gets one short interactive activity that sits in the lesson page, after the check-yourself quiz, the way the 6th–8th lessons already end with a game. The activity has to teach or test the unit's science, not decorate it.

## Scope

- Add an activity to all 23 grade-tagged K–5 units. Unit 0 (How Science Works) already has one.
- No activity, by design, for pages that are readings or explorables: 6th Unit 14, 9th 9.1 How AI Works, and `extras/same-shape-everywhere`. This matches how the site is built today (those three have no game block). No written rationale for the exemption was found in the repo, so this document assumes it still holds.
- The six arcade games stay as they are. Do not reskin Gravity Duel, Football Duel or Balance Duel for these units: they are duels with a 15-second clock, and K–5 units need calm, untimed work.

## Constraints

- Single-file HTML per lesson, no network, no install. The engine code is inlined into each page. Expect +15–30 KB per page on pages that are now about 80 KB.
- Runs on a school Chromebook. Redraw only when something changes (the arcade rule: idle 0–2% of a core at 4× slowdown).
- Mounting follows the existing lesson-game pattern: a `<section class="sec lesson-game-sec" id="game">` containing a host `div`, with the game in a shadow root so lesson CSS and game CSS never collide. Honors `prefers-reduced-motion`.
- Deterministic: any generated level uses a seed (like `COMET-FROG-42`), so a class can share a code.
- K–2: no timer, no lives, no reading beyond a word or two per item (icons plus the word). Wrong answers show a one-line reason, never just a buzzer. A try-again is always free.
- Grades 3–5: short written prompts are fine; still no timer and no duel.
- Michigan content, such as the dune, the lake, the maple and the deer, matches the unit it sits in.

## Engines

Six engines, each driven by a small per-unit config (items, bins, targets, the correct answers and the one-line reasons). Building the engine once and writing 3–5 configs is much cheaper than 23 games, and every config is reviewed for science as text before it ships.

| Engine | Interaction | Based on |
|---|---|---|
| **Big Sort** | Tap or drag items into bins; match pairs; put cards in order | new |
| **Push Arena** | Choose one variable (push strength, direction, ramp, surface), predict, release, see a replay and a data row | new, one-variable only |
| **Path & Signal** | Build a path that light, current or a message follows; fix a broken one | ports Laser Bounce and Short Circuit logic |
| **Fair Test Lab** | Pick which one thing to change, hold the rest, run trials, read a bar graph, write a claim | copies the Mystery Machine pattern |
| **Graph & Sky** | Drag the Sun or place cards to build a graph or sky pattern; read values off it | new |
| **Scene & Web** | Place organisms or pieces in a scene; trigger a change; watch which connections grow or shrink | new |

## Unit assignments

Each activity records what the student did (choices, trials, the claim) and shows it back as a short "what you found" line. Nothing is sent anywhere.

| Unit | Activity | Engine | What the student does | Standard it supports |
|---|---|---|---|---|
| K2.0 | Notice Walk Detective | Scene & Web | Tap things in a Michigan backyard, tally them, pick which question can be tested | method |
| K-A | Push-Pull Bowling | Push Arena | Choose push strength and direction into a safe zone, read the replay | K-PS2-1, K-PS2-2 |
| K-B | Sun and Weather Sort | Big Sort | Sort surfaces warmer or cooler in sun; sort clothes and actions by forecast | K-PS3-1, K-PS3-2, K-ESS3-2 |
| K-C | Habitat Helper | Big Sort | Match animals to habitats, then to the need the habitat meets | K-LS1-1, K-ESS3-1 |
| 1-A | Signal Sender | Path & Signal | Send a flash or tap pattern to a partner; sort materials that pass, block or bounce light | 1-PS4-1 to 1-PS4-4 |
| 1-B | Part Match Safari | Big Sort | Match parts to jobs, parent behavior to young, and one nature part to copy | 1-LS1-1, 1-LS1-2, 1-LS3-1 |
| 1-C | Sky Pattern Sort | Graph & Sky | Spin day and night, place stars, order Moon cards, match daylight strips to seasons | 1-ESS1-1, 1-ESS1-2 |
| 2-A | Dry Note | Fair Test Lab | Choose materials, test with the same water, pick a second criterion when results tie | 2-PS1-1 to 2-PS1-4 |
| 2-B | Seed Rider | Scene & Web | Move seeds and pollinators to habitats, count kinds of living things | 2-LS2-1, 2-LS2-2, 2-LS4-1 |
| 2-C | Guard the Sand | Fair Test Lab | Place rocks and grass against wind and water, compare sediment moved | 2-ESS1-1, 2-ESS2-1 to 2-ESS2-3 |
| 3.1 | Magnet Maze | Push Arena | Pull a clip along a path, thicker barriers and longer distances in later levels | 3-PS2-1 to 3-PS2-4 |
| 3.2 | Weather Grapher | Graph & Sky | Build a bar graph of Detroit temperature or rain, match it to a season | 3-ESS2-1, 3-ESS2-2, 3-ESS3-1 |
| 3.3 | Trait Family | Big Sort | Match parent and offspring; sort inherited traits from environment-changed traits | 3-LS3-1, 3-LS3-2 |
| 3.4 | Habitat Change Defender | Scene & Web | Change a habitat, pick a solution, compare who is helped | 3-LS2-1, 3-LS4-1 to 3-LS4-4 |
| 4.1 | Collision Energy Lab | Push Arena | Choose ramp height or marble size, predict, test, one variable at a time | 4-PS3-1 to 4-PS3-4 |
| 4.2 | Circuit Builder | Path & Signal | Build loops with cell, switch and bulb; polarity, insulator gap, short | 4-PS3-2, 4-PS3-4 |
| 4.3 | Light and Signal | Path & Signal | Light into the eye; four materials in a beam; encode a message | 4-PS4-1 to 4-PS4-3 |
| 4.4 | Body Part Match | Big Sort | Match structures to jobs, build sense, brain, response paths for animal scenes | 4-LS1-1, 4-LS1-2 |
| 4.5 | Shoreline Defender | Fair Test Lab | Place rocks, plants and barriers, compare sediment loss, defend with data | 4-ESS2-1, 4-ESS3-2 |
| 5.1 | Particle Dance | Scene & Web | Switch states, sort materials by property, balance total matter through a change | 5-PS1-1 to 5-PS1-4 |
| 5.2 | Shadow Tracker | Graph & Sky | Move the Sun, read shadow length and direction, match stars to seasons | 5-ESS1-1, 5-ESS1-2, 5-PS2-1 |
| 5.3 | Food Web Builder | Scene & Web | Place producers, consumers and decomposers; a two-rail board separates matter and energy | 5-LS1-1, 5-LS2-1, 5-PS3-1 |
| 5.4 | Resource Guardian | Scene & Web | Choose rain gardens, dune grass and rules for a town, compare runoff and clarity | 5-ESS2-1, 5-ESS2-2, 5-ESS3-1 |

## Cross-cutting rules

- **One single defensible answer per item.** Distractors are real misconceptions the unit names, written short; they never restate the misconception with a "because" clause.
- **Data in an activity must match the unit's data.** If 2-B's bean table says dark plants are tall, pale and thin, the Fair Test Lab bean config says the same. Configs are reviewed alongside the unit, not separately.
- **A simulation is not an observation.** Where an activity stands in for a real observation (sky, weather, plants, schoolyard habitats), the page says it is a model and still points to the real activity. This matters for the standards whose backup path is weak: 2-LS2-1, K-ESS2-1, 1-ESS1-1/2 and 2-LS4-1. The activity may help the student plan and read data, but it does not replace the real step.
- **Recorded evidence.** Each activity ends with a one-sentence claim the student builds from choices (claim frame: "We changed ___. ___ happened. So ___."), reusing the CER pattern from Unit 0.
- **No scores that reward guessing.** Progress is shown as levels completed; a hint costs nothing.
- **Screen-reader and keyboard support** is a separate parked task. Build with real buttons and labels now so that task does not mean rewriting the activities.

## Build order

1. **Big Sort**, with K-B and 2-C skins first, since it is the simplest and reused in five units.
2. **Graph & Sky**, starting with the 1-C day/night spin (stars under the sky wash).
3. **Push Arena**, starting with K-A.
4. **Path & Signal**, starting with light into the eye plus four materials in a beam, then the Short Circuit skin for 4.2.
5. **Fair Test Lab**, starting with Dry Note and Guard the Sand.
6. **Scene & Web**, starting with the 5.3 matter and energy board.

Each engine ships with one unit, then the other configs are added one at a time. A custom SVG diagram, from the Grok list, ships with each unit where it is the clearer teaching tool than a game.

## Tests and done

- A Node test per engine (like the arcade games): every generated level is solvable, each correct answer in a config is the only correct one, and a fixed seed always rebuilds the same level.
- Link test and build: `node build.mjs` and `node tests/links.test.js` pass; every K-5 lesson count is unchanged.
- Idle CPU measured at 4× slowdown, reported in the README's table.
- A unit is done when its config has been read against the unit's data and the reasoning lines have been checked by someone other than the person who wrote them.

## Open questions

- Inlining each into every page is simplest but duplicates it; a shared file would break the single-file rule. Default: duplicate.
- K–2 read-aloud: the browser's speech feature varies on Chromebooks. Default: icons and one-word labels, with no spoken audio until the screen-reader pass.
