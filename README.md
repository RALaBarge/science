# Science: lessons and arcade

Version 3. Free science lessons for kids in grades K to 8, plus a set of science games. It is plain HTML that runs in any browser: no install, no sign-in, no server. Open a file and it works.

Live site: <https://ralabarge.github.io/science/>

## What is here

- **Lessons.** 61 lesson guides in grade folders (K-5, 6th, 7th, 8th), listed in teaching order on a lesson map (`dist/index.html`).
- **Science Arcade.** Six browser games that share a bank of science questions, each tagged by grade so a teacher can cap how hard the questions get (`dist/arcade.html`).
- **Extras.** How AI Works, The Same Shape Everywhere, and Pick a Trade (hands-on careers in Michigan).

| Folder | Content | Pages |
| --- | --- | --- |
| `k-5/` | How Science Works, then units for kindergarten to grade 2 and grades 3 to 5 (including simple machines and work) | 25 |
| `6th/` | Light and matter, thermal energy, forces and motion, weather, plate tectonics, natural hazards, cells, classifying life, body systems, states of matter, Earth in space, ecosystems, energy resources, where the solar system is going, data and statistics | 15 |
| `7th/` | Matter, chemical reactions, reaction energy, metabolism, photosynthesis, ecosystems, Earth resources, the electromagnetic spectrum, adaptation and Earth history, acids and bases, nutrition and health | 11 |
| `8th/` | Contact forces, energy, forces at a distance, sound, light and information, gravity and orbits, stars and galaxies, genetics, natural selection, climate evidence and change | 10 |
| `extras/` | How AI Works, The Same Shape Everywhere, Pick a Trade | 3 |

`dist/` holds the built site, so GitHub Pages and local `file://` links work without a build step.

## How a lesson reads

Each lesson opens with a short overview, then works through its concepts. A concept starts with a plain-language explanation, then uses some of these aids, each labeled: **Analogy**, **Diagram**, **Try it** (usually interactive), **Data** and **Real world**. A lesson ends with a hands-on kit, a check-yourself quiz, vocabulary and tutor notes (common misconceptions, pacing). Pages say where their analogies and models stop being accurate. K-5 pages are written for a grown-up and child to read together; Michigan examples are used throughout.

## Science Arcade

| Game | Science |
| --- | --- |
| Gravity Duel | Gravity, momentum, magnets, orbits |
| Laser Bounce | Reflection, transparent and opaque materials, color filters |
| Short Circuit | Complete circuits, conductors and insulators, series and shorts |
| Balance Duel | Levers, torque, balanced forces |
| Phase Runner | States of matter and changes of state |
| Football Duel | Projectile motion, speed and time, plus every topic in the question bank |

Levels come from a seed code (like `COMET-FROG-42`) so kids can share them, and there is a daily challenge. Questions unlock extra help in the games, and a Practice quiz is always available. A **Questions up to** picker limits questions to a grade, or use `arcade.html?maxgrade=3`. The question bank is in `shared/questions.js`.

The games simplify on purpose: Gravity Duel's masses are game-scaled, Laser Bounce beams turn exactly 90 degrees, Short Circuit bulbs are 1-ohm resistors, and Phase Runner changes temperature far faster than real water. The lessons note where each analogy breaks.

## Building and testing

Needs Node.

```
node build.mjs            build dist/
./tests/run-all.sh        build, then run every test (needs Playwright with Chromium)
```

To change content, edit the lesson HTML in its grade folder, or add a row to `shared/questions.js` (right answer first, a short explanation, the earliest grade that can answer it).

## Feedback

If something looks wrong or you want an update, open an issue or send a pull request.

## License

MIT, see `LICENSE`. Photographs in `extras/` and images credited in lesson captions keep their own licenses (for example Wikimedia Commons and NASA); `extras/CREDITS.md` lists the extras credits.
