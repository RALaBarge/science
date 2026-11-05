# Science — lessons and arcade

Science material for kids, all plain HTML that runs in a browser with no install, sign-in, or server. Two halves:

- **Lesson guides** — 58 pages, sorted into grade folders: `k-5/`, `6th/`, `7th/`, `8th/`, `9th/`, plus `extras/`. Most lessons end with a short browser game embedded in the page; the K–5 units are getting one each (5 of 23 so far: K-B, K-C, 1-B, 3.3, 4.4).
- **Science Arcade** — six standalone games (gravity, light, circuits, levers, states of matter, football physics) with a shared bank of 177 science questions.

Open `dist/index.html` for the lesson map, or `dist/arcade.html` for the arcade. Every file in `dist/` is self-contained, so it works from GitHub Pages, a web server, a USB stick, or a `file://` link. No font is fetched from the network: Atkinson Hyperlegible is embedded in each lesson page.

## Lessons by grade

| Folder | Grade | Units | Count |
| --- | --- | --- | --- |
| `k-5/` | K–5 | How Science Works (Unit 0) — origins of science (with the heliocentrism case), the scientific method, hypotheses, fair tests, a data toolbox, reading starlight (spectroscopy), the Cosmic Calendar, CER | 1 |
| `6th/` | 6th | Units 1–14: light and matter, thermal energy, forces and motion, weather, plate tectonics, natural hazards, cells, classifying life, body systems, states of matter, Earth in space, ecosystems, energy resources, and where the solar system is going in the galaxy and how it formed | 14 |
| `7th/` | 7th | Units 7.1–7.9: matter and its properties, chemical reactions, reaction energy, metabolism, photosynthesis, ecosystems, Earth resources, EM spectrum, adaptation and Earth history | 9 |
| `8th/` | 8th | Units 8.1–8.9: collisions, energy transformation, forces at a distance (including simple circuits), sound, light and information, gravity and orbits, stars and galaxies, genetics, natural selection | 9 |
| `9th/` | 9th | 9.1 How AI Works: a reading-comprehension course on language models, context windows, embeddings, diffusion, and warnings now and ahead | 1 |
| `extras/` | any | The Same Shape Everywhere: branching patterns from trees and lightning to neurons and the cosmic web (real photos, credits in the page and `extras/CREDITS.md`); Pick a Trade: hands-on careers in Michigan, with fifteen trades in depth, Washtenaw Community College's programs, and a searchable table of 306 occupations (built by `node docs/trades/build-page.mjs` from `docs/trades/trades-catalog.md`; draft) | 2 |

The K–5 folder holds the method unit and 23 grade-tagged units (K–2: K2.0 optional plus K-A to 2-C; grades 3–5: 3.1 to 5.4). They are text-first lessons: concept cards, a hands-on kit, a check-yourself quiz, vocabulary and tutor notes. All 23 have an activity: 13 Big Sort, 4 Fair Test Lab (2-A, 2-C, 4.1, 4.5), 2 Push Arena (K-A, 3.1), 2 Graph & Sky (1-C, 5.2), 1 Path & Signal (4.2) and 1 Scene & Web (K2.0). Each says it is a model and points back to the real hands-on work. The weakest are K2.0 (about 90 seconds of play, aimed at kindergarten with a grown-up), the Big Sort units that the design table gave to a richer engine, and the 5.2 gravity round, which asks the same question three times. Whether kids find them fun is not yet checked (see `docs/k5-activities-design.md`). Every K–5 lesson now has pictures: 61 text-free images (one hero per unit plus concept and "what it should look like" kit photos), 34 data graphs and 16 labeled diagrams. The graphs are generated from each page's own numbers and the diagrams are hand-built SVG with real text; the images are Z-Image-Turbo output kept as 800 px WebP, with prompts, seeds and accept/reject reasons in `k5-images/manifest.json`. `node k5-images/make-figures.mjs` rebuilds the SVGs and per-page lists, `node k5-images/inject-images.mjs` embeds everything between `k5images` markers (it can run before or after `k5-activities/inject.mjs`), then `node build.mjs`; `node tests/k5-images.test.js` checks alt text, file sizes and one block per page.

Since the first release the lessons have grown: the 9th-grade AI course, Unit 14 (the solar system's motion), and the branching-patterns extra were added; Unit 0 was expanded; the 7th- and 8th-grade static figures were replaced with new SVG diagrams, photos and a Hubble image; 6th-grade Units 2–6 and 10 got new interactives, photos and data charts; and wording was revised after a claim-by-claim fact-check triage and an outside review.

The map at `index.html` lists every unit in teaching order, with what each one builds on, and filters by strand (physical, Earth and space, life, method).

## Science Arcade

| Game | What you do | Science |
| --- | --- | --- |
| **Gravity Duel** | Two-player artillery around planets. Modes: Classic, Moon, Magnet, Orbit Golf | Gravity (mass, distance), momentum, magnets, orbits |
| **Laser Bounce** | Place mirrors to steer a laser into every target | Reflection, transparent / translucent / opaque, color filters |
| **Short Circuit** | Turn wire tiles to light every bulb before time runs out | Complete circuits, conductors / insulators, series dimming, shorts |
| **Balance Duel** | Place weights on a seesaw without tipping it (vs a friend or CPU) | Levers, torque = mass × distance, balanced forces |
| **Phase Runner** | Platformer as a water blob that turns to ice or steam | States of matter, melting/freezing at 0 °C, boiling at 100 °C, condensation |
| **Football Duel** | The defense picks a topic, the offense answers on a 15-second play clock to snap, then throws; close catches are jump-ball question races (vs a friend or CPU) | Projectile motion (launch angle, hang time, range), speed × time, plus every topic in the bank |

### What every game has

- **Seeded levels and daily challenges.** A code like `COMET-FROG-42` always builds the same map or puzzle, so kids can share codes and compare scores. The Daily button gives everyone the same one each day.
- **Checked before you see it.** Gravity Duel test-fires 1,800+ shots per side so both players can win; Laser Bounce runs a solver to set par; Short Circuit's solution is verified with real circuit math; Phase Runner's levels are proven finishable by test bots; Football Duel's flight times are checked against 2·v·sin(angle)/g.
- **Questions that unlock things.** In Gravity Duel each round starts with 5 questions per player: you get 2 shots plus one for every right answer. In the other games, run out of mirrors, time or heat packs (or Orbit Golf strokes) and you can answer 4 questions for more (once per round). Power-ups and hints cost one right answer; a miss locks them until the next round. A **Practice quiz** link is open during the demo and between rounds.
- **Facts cards** the first time something new happens (a new material, a change of state, a short circuit).
- **A hacker layer.** Open the browser console: each game puts itself in `window.game`, prints things to try, and `game.help()` lists every value. Winning with hacked values earns a badge. (Console access depends on how the Chromebooks are managed.)
- **Low CPU.** Pages only redraw when something changes. Measured with Chrome slowed 4× to mimic a school Chromebook, a game sitting idle uses 0–2 % of a core.

| Game (Chrome at 4× slowdown) | Idle | Demo / active play |
| --- | --- | --- |
| Gravity Duel | 0.1 % | 58 % |
| Laser Bounce | 1 % | 3 % |
| Short Circuit | 2 % | 21 % |
| Balance Duel | 0 % | 27 % |
| Phase Runner | 2 % | 85 % |
| Football Duel | 0 % | 39 % |

Active-play numbers are mostly pixel drawing, which real Chromebooks hand to the graphics chip; the test browser draws in software, so these are worst-case.

## Put it on GitHub Pages

1. Push this repo to GitHub.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The workflow in `.github/workflows/pages.yml` runs `node build.mjs` and publishes `dist/` on every push to `main`.

Before relying on it at the community center, open the Pages link on one of the Chromebooks: school filters sometimes block whole hosting domains. If it's blocked, ask whoever manages the devices to allow it.

## Repository layout

```
index.html           lesson map / site home (links every unit and the arcade)
design-log.html      engineering design log for the lessons
arcade.html          Science Arcade hub (self-contained once built)
k-5/                 24 lessons (Unit 0 plus 23 grade-tagged units)
6th/                 14 lessons (Units 1–14)
7th/                 9 lessons (Units 7.1–7.9)
8th/                 9 lessons (Units 8.1–8.9)
9th/                 1 lesson  (9.1, How AI Works)
extras/              1 page    (The Same Shape Everywhere)
dist/                built site (committed); regenerate with node build.mjs
games/<name>.html    arcade page markup (links the shared files)
games/<name>.js      arcade game logic
shared/core.css      look and layout for every arcade game
shared/core.js       Arcade core: seeded randomness, exact math, work slicing, frame loop,
                     quiz and facts cards, demo mode, console hacker layer
shared/questions.js  the question bank
shared/facts.js      the fact decks
build.mjs            inlines the arcade and copies the lessons into dist/
tests/               Playwright tests, link check, and benchmarks
```

## Page style and URL parameters

Every lesson page has a **Style: Classic / Retro space** switch at the top. The choice lives in the URL as `?style=retro` (Classic is the default and adds nothing), so a link shares the style and a reload keeps it.

- **Params pass through.** On every lesson page and on the lesson map, links to other pages in the site get the page's whole query string appended, not just `style`. Any other parameter you add (for example `?style=retro&kid=ava`) travels with the reader from page to page, so it can be used later for per-reader settings. Links to other sites and `#anchor` links are left alone.
- **Fonts:** headings and body text are Atkinson Hyperlegible (chosen for legibility), embedded in each page as a base64 `@font-face` (Latin subset, regular and bold). Small labels, tags and numeric readouts use the device's own monospace font (`ui-monospace`, Cascadia Mono, SF Mono, Menlo, Consolas). Key terms in the big sentences are bold and colored, with no highlighter background.
- **Where it lives:** each lesson page carries one `<style id="v2">` block and one script just above `<header class="hero">`. The retro palette is a set of overrides under `html[data-style="retro"]`. The arcade games have their own look and are not part of this.
- **Not yet:** the 9th-grade course and the extras page have their own light/dark toggle, which may conflict with the retro theme once used (untested). The arcade games ignore `style`.

## Editing content

- **Lessons:** edit the HTML directly in its grade folder. Lesson pages link to each other with relative paths (`unit-02-thermal-energy.html` in the same folder, `../7th/unit-7.2-…html` across grades, `../design-log.html`). The embedded game lives in a `LESSON GAME` block inside the lesson, so each lesson page is self-contained.
- **Moving or adding a lesson:** put it in the matching grade folder and point its "builds on" and "related" links at `../<grade>/<file>.html`. Then run `node tests/links.test.js` to catch broken paths.
- **Questions:** `shared/questions.js`. One line per question: `[topic, question, [right answer, wrong, wrong, wrong], explanation]`. Always put the right answer first; the games shuffle choices. Topics let each game lean toward its subject (about half its questions come from its topics, half from everything).
- **Facts:** `shared/facts.js`. `SPACE_FACTS` (Resize power-up objects) and `SCIENCE_FACTS` (magnets, light, electricity, levers, matter). Plain sentences.
- **Phase Runner levels:** the `LEVELS` array in `games/phase-runner.js`. Each level is 14 rows of 24 characters; the legend is in the comment above it. Run `node tests/phase-bots.test.js` after editing to check your levels can still be finished (add a bot for a new level).

Every quiz answer is recorded in `Arcade.answers` with the game, topic and whether it was right, ready for a scoreboard database to store per student.

## Working on the code

- Develop by editing `games/`, `shared/`, or the grade folders, then `node build.mjs` (works on Windows, macOS and Linux). The build writes `dist/` (committed so Pages and local links work without a build step).
- Tests: `./tests/run-all.sh` (needs Node and Playwright with Chromium). Benchmarks: `node tests/bench-all.js`.
- Tests open pages with `?test`, which exposes internal state as `window.__s`. Nothing else changes.
- **Determinism:** anything that decides an outcome uses only `+ − × ÷` and `Math.sqrt`, which JavaScript guarantees are identical in every browser. Use `Arcade.sincos` and `Arcade.dist` instead of `Math.sin`, `Math.cos`, `Math.hypot` or `**`. This is what makes map codes and replays match across machines.
- **Heavy work** (fairness checks, solvers, CPU players) is written as generators and run with `Arcade.runSliced`, so the page never freezes.
- **Adding a game:** copy one of the smaller games (Laser Bounce or Short Circuit) as a template. Use `Arcade.quiz.open`, `Arcade.facts.show`, `Arcade.demo.start`, `Arcade.hacker`, and `Arcade.loop`.

## Science simplifications, on purpose

The games are honest about where they bend reality, and the how-to sections say so:

- Gravity Duel's masses are game-scaled (the Sun is really ~333,000 Earths). Knocked planets slow down so the map stays playable. Each magnet planet is a single pole (real magnets always have two).
- Laser Bounce's beams turn exactly 90° and frosted glass halves the light.
- Short Circuit models bulbs as identical 1-ohm resistors on a 1-volt battery.
- Phase Runner's temperature changes much faster than real water would.
- Football Duel ignores air resistance (so 45° throws farthest; real footballs do best a bit lower) and players run slower than real ones.

The lesson guides carry their own teaching simplifications; each unit notes where the analogy breaks.

## Known limits

- Football Duel: in a game for two people at one keyboard, both see the question during a jump ball; Orange answers with 1–4 and Blue with 7–0, so whoever is faster wins it fairly.
- Balance Duel: with careful play, the player who goes second wins about 70 % of decided rounds. Who goes first alternates every round, so a match evens out over pairs of rounds.
- Determinism has been checked in Chrome only (Firefox and Safari weren't available to test).
- There is no shared scoreboard yet; scores and best times live in each browser.
