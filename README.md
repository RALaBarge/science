# Science: lessons and arcade

Free science material for kids in grades K to 8, built as plain HTML that runs in any browser. There is no install, no sign-in and no server. Open a file and it works, from GitHub Pages, a web server, a USB stick or a `file://` link.

Live site: <https://ralabarge.github.io/science/>

The repo has three parts:

- **Lessons.** 61 lesson guides in grade folders (K-5, 6th, 7th, 8th), listed in teaching order on a lesson map.
- **Science Arcade.** Six standalone browser games that share a bank of 300 science questions, each tagged with a grade so a teacher can cap how hard the questions get.
- **Extras.** Three stand-alone pages: How AI Works, The Same Shape Everywhere and Pick a Trade.

Open `dist/index.html` for the lesson map or `dist/arcade.html` for the arcade. Every file in `dist/` is self-contained, and no font or script is fetched from the network.

## What is where

| Folder | What it holds | Pages |
| --- | --- | --- |
| `k-5/` | How Science Works (Unit 0), then 23 grade-tagged units: K2.0 (optional) and K-A to 2-C for kindergarten to grade 2, 3.1 to 5.4 for grades 3 to 5 | 24 |
| `6th/` | Units 1 to 15: light and matter, thermal energy, forces and motion, weather, plate tectonics, natural hazards, cells, classifying life, body systems, states of matter, Earth in space, ecosystems, energy resources, where the solar system is going, and data and statistics | 15 |
| `7th/` | Units 7.1 to 7.11: matter, chemical reactions, reaction energy, metabolism, photosynthesis, ecosystems, Earth resources, the electromagnetic spectrum, adaptation and Earth history, acids and bases, and nutrition, health and disease | 11 |
| `8th/` | Units 8.1 to 8.11: contact forces and collisions, energy, forces at a distance, sound, light and information, gravity and orbits, stars and galaxies, genetics, natural selection, simple machines and work, and climate evidence and change | 11 |
| `extras/` | How AI Works, The Same Shape Everywhere, Pick a Trade | 3 |
| `games/`, `shared/`, `arcade.html` | The Science Arcade and its shared code | 6 games |
| `dist/` | The built site (committed so Pages and local links work without a build step) | |

## The lessons

Each lesson opens with a short overview and an "In this unit" index, then works through its concepts. A concept has a plain-language idea, then some of these aids, each tagged so students can spot them: **Analogy**, **Diagram**, **Try it** (usually interactive), **Data** and **Real world**. Lessons end with a hands-on kit, a check-yourself quiz, vocabulary and tutor notes (misconceptions, pacing). Most 6th to 8th lessons close with a small embedded game. Pages say where their analogies and models break.

**K-5** is text first and built for a grown-up and child to read together:

- Every unit has a hero image and kit photos (61 images from a local image model, each with its prompt, seed and accept or reject reason in `k5-images/manifest.json`), 34 data graphs drawn from each page's own numbers, 18 hand-built labeled diagrams, and **31 small interactives** (push a car, flick the card, heat a gas of 20 particles, sort Earth's water into 100 squares, and so on). Most interactives ask for a prediction first.
- Every unit also has an **activity**, built on six shared engines: Big Sort (13 units), Fair Test Lab (4), Push Arena (2), Graph & Sky (2), Path & Signal (1) and Scene & Web (1). Each one says it is a model and points back to the real hands-on work. See `docs/k5-activities-design.md`.
- The "Look for the tags" key appears only on the first unit of each grade.

**6th to 8th** carry static SVG diagrams, photos, data charts, engineering challenges (with a printable design log in `design-log.html`), plus interactives such as the flick-the-card inertia demo (6th Unit 3), the heat-a-gas piston for Charles's and Gay-Lussac's laws (6th Unit 10), and the push-back lab and pair-or-balanced sort for Newton's third law (8.1).

### The lesson map

`index.html` lists every unit in teaching order with what it builds on. Each grade is a collapsible section that starts closed, and chips filter by strand (physical, Earth and space, life, method).

### Extras

- **How AI Works** (grade 9 and up): a six-reading comprehension course on language models, context windows, embeddings, diffusion, and warnings now and ahead, with a section on non-transformer designs (hybrids such as Jamba and Granite 4.0, and diffusion language models), evidence questions, interactives and a verify lab.
- **The Same Shape Everywhere**: branching patterns from trees and lightning to neurons and the cosmic web, using real photos (credits in `extras/CREDITS.md`).
- **Pick a Trade**: hands-on careers in Michigan. Fifteen trades in depth, what Washtenaw Community College offers, and a searchable, sortable table of 306 occupations with worker counts, wages and growth from the Bureau of Labor Statistics. Built by `node docs/trades/build-page.mjs` from `docs/trades/trades-catalog.md`. The "find your fit" scoring prototype is in `docs/trades/quiz-prototype/`.

### Look and style

All lesson pages, the extras, the lesson map and Pick a Trade open in **Retro space**, a dark theme with a Classic option. Use the switch at the top of a page, or add `?style=classic` to the address. Links to other pages in the site carry the page's whole query string forward, so any extra parameter you add travels with the reader. Headings and body text use Atkinson Hyperlegible, embedded as base64 so nothing is fetched. The arcade games keep their own look, and the design log stays black on white because it is a print worksheet.

## Science Arcade

| Game | What you do | Science |
| --- | --- | --- |
| **Gravity Duel** | Two-player artillery around planets (Classic, Moon, Magnet, Orbit Golf) | Gravity, momentum, magnets, orbits |
| **Laser Bounce** | Place mirrors to steer a laser into every target | Reflection, transparent, translucent and opaque, color filters |
| **Short Circuit** | Turn wire tiles to light every bulb before time runs out | Complete circuits, conductors and insulators, series dimming, shorts |
| **Balance Duel** | Place weights on a seesaw without tipping it | Levers, torque = mass x distance, balanced forces |
| **Phase Runner** | Platformer as a water blob that turns to ice or steam | States of matter, melting, freezing, boiling, condensation |
| **Football Duel** | Defense picks a topic, offense answers on a 15-second clock, close catches are jump-ball question races | Projectile motion, speed x time, plus every topic in the bank |

Every game has:

- **Seeded levels and daily challenges.** A code like `COMET-FROG-42` always builds the same map, so kids can share codes. The Daily button gives everyone the same one each day.
- **Levels checked before you see them.** Gravity Duel test-fires 1,800+ shots a side so both players can win, Laser Bounce runs a solver for par, Short Circuit verifies its solution with real circuit math, Phase Runner's levels are proven finishable by test bots.
- **Questions that unlock things.** In Gravity Duel each round starts with 5 questions per player. In the other games, running out of mirrors, time or heat packs lets you answer 4 questions for more. A **Practice quiz** is always one click away.
- **Fact cards** the first time something new happens.
- **A hacker layer.** Open the browser console: each game puts itself in `window.game` and `game.help()` lists every value. Winning with hacked values earns a badge.
- **Low CPU.** Pages redraw only when something changes. At a 4x slowdown (about a school Chromebook), an idle game uses 0 to 2 % of a core. The numbers are in `tests/bench-all.js`.

### Question bank and levels

`shared/questions.js` holds 346 questions. Each row is `[topic, question, [right answer, wrong, wrong, wrong], explanation, grade]`, where grade is 0 for kindergarten and 1 to 8 for grades 1 to 8. The games shuffle the choices.

| Grade | K | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Questions | 10 | 17 | 23 | 48 | 63 | 45 | 50 | 46 | 44 |

Each game and the hub have a **Questions up to** picker next to the Practice quiz button. A game asks only questions up to the chosen grade, so a kindergarten group never meets grade 8 questions. The choice is saved in the browser; `?maxgrade=N` in the address sets it too (for example `arcade.html?maxgrade=3`). Questions are tagged with the earliest grade whose lessons teach the idea, and the 6th to 8th questions mirror the lessons in this repo. Every quiz answer is recorded in `Arcade.answers` with the game, topic and whether it was right, ready for a scoreboard.

The bank grew from 177 to 300 questions in November 2026, then to 346 when the five newest units (6th Unit 15, 7.10, 7.11, 8.10, 8.11) got 9 to 10 questions each. The new ones were drafted from the lesson material (Hy4 for grades 3 to 8, written by hand for kindergarten to grade 2) and every one was read for accuracy. A second blind pass, where Hy4 answered the 95 Hy4-written questions without seeing the marked answer, matched every key; its wording flags were fixed. `tests/question-bank.test.js` guards the format and makes sure each grade ceiling has enough questions.

## Build, deploy and test

Everything uses Node and works on Windows, macOS and Linux.

```
node build.mjs                      build dist/ (lessons into grade folders, the arcade inlined)
./tests/run-all.sh                  build, then run every test (needs Playwright with Chromium)
node tests/links.test.js            every relative link in dist/ resolves
node tests/question-bank.test.js    the question bank is well formed and graded
node tests/k5-images.test.js        K-5 figures, alt text, file sizes, interactive scripts parse
node tests/k5-activities.test.js    K-5 activity configs (and a browser play-through when Playwright is present)
node tests/bench-all.js             CPU benchmarks for the games
```

Pages: **Settings, Pages, Source: GitHub Actions**. The workflow in `.github/workflows/pages.yml` runs `node build.mjs` and publishes `dist/` on every push to `main`. Before relying on it somewhere with a school filter, open the link on one real device; filters sometimes block whole hosting domains.

The old address `9th/unit-9.1-how-ai-works.html` still works: the build writes a redirect to `extras/how-ai-works.html`.

### Generated pieces

Some content is generated from data. Re-run these after editing their sources, then `node build.mjs`:

| Command | Does |
| --- | --- |
| `node k5-activities/inject.mjs` | puts each K-5 activity engine and config (`k5-activities/units/*.json`) into its lesson page |
| `node k5-images/make-figures.mjs` | rebuilds the K-5 graph and diagram SVGs and the per-page figure lists from `graph-defs.mjs`, `diagram-defs.mjs`, `figures-src.mjs` and `interactive-defs.mjs` |
| `node k5-images/inject-images.mjs` | embeds the images, SVGs and interactives (`k5-images/html/*.html`) into the K-5 pages |
| `node 8th-images/inject.mjs` | embeds the real photographs listed in `8th-images/figures.json` (with credits) into the 8th-grade pages; re-runnable |
| `node shared/apply-retro.mjs` | gives the lesson map the Retro look and writes the snippet Pick a Trade reuses |
| `node docs/trades/build-page.mjs` | rebuilds `extras/pick-a-trade.html` from the trades catalog |

Both injectors replace only their own marked blocks, so they are safe to re-run in any order.

## Editing content

- **A lesson:** edit its HTML in the grade folder. Lessons link with relative paths (`unit-02-thermal-energy.html` within a folder, `../7th/unit-7.2-....html` across grades). After moving or adding one, run `node tests/links.test.js`.
- **A question:** add a row to `shared/questions.js`. Put the right answer first, give a one or two sentence explanation, and tag the earliest grade that can answer it. Keep questions standalone, with one defensible answer and wrong choices that are real misconceptions.
- **A K-5 figure or interactive:** add it to `k5-images/` (see the table above), then rebuild.
- **A fact card:** `shared/facts.js`. `SPACE_FACTS` and `SCIENCE_FACTS` are plain sentences.
- **A Phase Runner level:** the `LEVELS` array in `games/phase-runner.js` (14 rows of 24 characters, legend in the comment above it). Run `node tests/phase-bots.test.js` afterwards.
- **A new game:** copy a small one (Laser Bounce or Short Circuit) and use `Arcade.quiz.open`, `Arcade.facts.show`, `Arcade.demo.start`, `Arcade.hacker` and `Arcade.loop`.

## How the code works

- **Determinism.** Anything that decides an outcome uses only `+ - x /` and `Math.sqrt`, which JavaScript guarantees are identical in every browser. Use `Arcade.sincos` and `Arcade.dist` rather than `Math.sin`, `Math.cos`, `Math.hypot` or `**`. This is what makes map codes and replays match across machines. It has been checked in Chrome only.
- **Heavy work** (fairness checks, solvers, CPU players) is written as generators and run with `Arcade.runSliced`, so a page never freezes.
- **Tests** open pages with `?test`, which exposes internal state as `window.__s`. Nothing else changes.
- **Shared arcade code** is in `shared/core.js` (seeded randomness, exact math, frame loop, quiz and fact cards, demo mode, the question level) and `shared/core.css`.

## Science simplifications, on purpose

The games say where they bend reality: Gravity Duel's masses are game-scaled and its magnet planets have a single pole; Laser Bounce's beams turn exactly 90 degrees; Short Circuit treats every bulb as a 1-ohm resistor on a 1-volt battery; Phase Runner changes temperature much faster than real water; Football Duel ignores air resistance. The lessons note where each analogy breaks, and the K-5 interactives label made-up numbers as made up.

## Known limits and open work

- Football Duel: during a jump ball both players see the question; Orange answers with 1 to 4 and Blue with 7 to 0.
- Balance Duel: the second player wins about 70 % of decided rounds with careful play; the first move alternates each round so a match evens out.
- There is no shared scoreboard yet. Scores and best times live in each browser.
- The unit pages are checked in Chrome and headless Edge only.
- What is not built yet is in `TODO.md`, mainly a screen-reader pass planned for when the content is final.
- `reviews/` holds the saved outside reviews (Grok, Hy4, Phi-4) of the K-5 units and quizzes, and `docs/` the design notes.

## License

MIT, see `LICENSE`. Photographs in `extras/` keep their own licenses, listed in `extras/CREDITS.md`.
