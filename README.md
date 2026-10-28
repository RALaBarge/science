# Science Arcade

Five browser games that teach K–6 physical science, built to run on locked-down school Chromebooks: no installs, no sign-in, no server. Each game plays a demo on its own until someone clicks, and uses a shared bank of 165 science questions to unlock bonuses.

| Game | What you do | Science |
| --- | --- | --- |
| **Gravity Duel** | Two-player artillery around planets. Modes: Classic, Moon, Magnet, Orbit Golf | Gravity (mass, distance), momentum, magnets, orbits |
| **Laser Bounce** | Place mirrors to steer a laser into every target | Reflection, transparent / translucent / opaque, color filters |
| **Short Circuit** | Turn wire tiles to light every bulb before time runs out | Complete circuits, conductors / insulators, series dimming, shorts |
| **Balance Duel** | Place weights on a seesaw without tipping it (vs a friend or CPU) | Levers, torque = mass × distance, balanced forces |
| **Phase Runner** | Platformer as a water blob that turns to ice or steam | States of matter, melting/freezing at 0 °C, boiling at 100 °C, condensation |

## Play it

Open `dist/index.html` (the arcade hub) or any `dist/<game>.html`. Every file in `dist/` is fully self-contained, so it works from GitHub Pages, a web server, a USB stick, or a `file://` link.

### Put it on GitHub Pages

1. Push this repo to GitHub.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The workflow in `.github/workflows/pages.yml` builds and publishes `dist/` on every push to `main`.

Before relying on it at the community center, open the Pages link on one of the Chromebooks: school filters sometimes block whole hosting domains. If it's blocked, ask whoever manages the devices to allow it.

## What every game has

- **Seeded levels and daily challenges.** A code like `COMET-FROG-42` always builds the same map or puzzle, so kids can share codes and compare scores. The Daily button gives everyone the same one each day.
- **Checked before you see it.** Gravity Duel test-fires 1,800+ shots per side so both players can win; Laser Bounce runs a solver to set par; Short Circuit's solution is verified with real circuit math; Phase Runner's levels are proven finishable by test bots.
- **Questions that unlock things.** Run out of shots, mirrors, time or heat packs and you can answer 4 questions for more (once per round). Power-ups and hints cost one right answer; a miss locks them until the next round. A **Practice quiz** link is open during the demo and between rounds.
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

Active-play numbers are mostly pixel drawing, which real Chromebooks hand to the graphics chip; the test browser draws in software, so these are worst-case.

## Editing content

- **Questions:** `shared/questions.js`. One line per question: `[topic, question, [right answer, wrong, wrong, wrong], explanation]`. Always put the right answer first; the games shuffle choices. Topics let each game lean toward its subject (about half its questions come from its topics, half from everything).
- **Facts:** `shared/facts.js`. `SPACE_FACTS` (Resize power-up objects) and `SCIENCE_FACTS` (magnets, light, electricity, levers, matter). Plain sentences.
- **Phase Runner levels:** the `LEVELS` array in `games/phase-runner.js`. Each level is 14 rows of 24 characters; the legend is in the comment above it. Run `node tests/phase-bots.test.js` after editing to check your levels can still be finished (add a bot for a new level).

Every quiz answer is recorded in `Arcade.answers` with the game, topic and whether it was right, ready for a scoreboard database to store per student.

## Working on the code

```
shared/core.css      look and layout for every game
shared/core.js       the Arcade core: seeded randomness, exact math, work slicing, frame loop,
                     quiz and facts cards, demo mode, console hacker layer
shared/questions.js  the question bank
shared/facts.js      the fact decks
games/<name>.html    page markup (links the shared files)
games/<name>.js      the game
hub/index.html       arcade hub
build.mjs            inlines everything into dist/
tests/               Playwright tests and benchmarks
```

- Develop by editing `games/` and `shared/`, then `node build.mjs`.
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

## Known limits

- Balance Duel: with careful play, the player who goes second wins about 70 % of decided rounds. Who goes first alternates every round, so a match evens out over pairs of rounds.
- Determinism has been checked in Chrome only (Firefox and Safari weren't available to test).
- There is no shared scoreboard yet; scores and best times live in each browser.
