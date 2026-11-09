# Unit 3.1 Forces, Motion, and Magnets: applied

## What changed (k-5/unit-3-1-forces-motion-and-magnets.html, k5-images/units JSON)
- Intro: force defined; tag line fixed, Analogy dropped. Words to know is a bulleted list (+ Friction, Magnetic field, Constraint).
- Concept 1: Analogy deleted, quote moved to lead-in; friction defined; Push the car is top-level with bullets, picture, marble extra; CER heading spelled out; Force arrows has real text and a picture; balanced/unbalanced SVG replaced by a diffusion picture (`31-forces`); puck widget caption says hockey puck.
- Concept 2: dot tape SVG and both backup graphs removed from the unit JSON (injector drops them on next run); lead-up for speed and distance; ruler picture (`31-ruler`); tape widget reworded from dots to marks; Rolling ball track filled; both Data blocks now real tables (as bullets) with inches.
- Concept 3: lead-up for magnet and static electricity; sorting-tray picture (`31-sorting`) replaces the horseshoe photo; Magnet explorer removed; thinned Force Track sits here (dots reworded to marks); Static demo filled; Magnet field and Compass get lead-up and pictures (`31-field`, `31-compass`), N/E/S/W as HTML chips, "magnetic north" wording. The old magnet-pull widget is no longer listed (its job moved to the sandbox).
- Concept 4: lead-up, picture with HTML Criterion/Constraint chips (`31-crit`), inches, prediction wording.
- Hands-on: bulleted lists, "you" not "Students", ceramic or ferrite magnets, new side-view picture (`31-clip`), full-sentence caption, backup data as bullets, Near you line safer.
- Bottom activity: new Magnet sandbox (`k5-images/html/w-31-sandbox.html`, JSON id `w-31-sandbox`, after `activity`). Pointer events, touch-safe (magnet rides above the fingertip), arrow keys, pull falls off with distance (zero past 170 px), light filings jump first, aria-live readout, Reset, reduced motion snaps instead of gliding. Objects: paper clip, steel nail, steel key, iron filings (pulled); wooden block, plastic cap, penny, eraser, aluminum foil, Petoskey stone, copper (not pulled). Logic tested in Node (falloff, no non-magnetic movement, sticking, reset, reduced motion).
- Standards block, footer codes, "3-PS2-3" removed. Games: old Force Track config moved to `k5-activities/units-moved/` so `k5-activities/inject.mjs` no longer rewrites the bottom activity; its engine and config are inlined in Concept 3.

## Defaults taken
Q1 Concept 2 diagram; Q2 Backup set 2 removed with set 1 (data kept in the bulleted backup); Q3 Push the car got the picture; Q4 data graphs: removed, tables used instead; Q5 hero tug-of-war kept (already diffusion); Q6 top SVG: not touched (review chrome); Q7 Check yourself: page already has 4 working questions, report wrong; Q8 codes deleted (text: 3-PS2-1..4, 3-5-ETS1-1..3); Q9 Force Track thinned to a quick round using the existing config (full-steps text not needed); Q12 magnets as stated; Q14 default is the magnet follows your hand and objects jump to it (no option added, one user).
Report items that did not apply: REVIEW COPY and CHECK lines are not in source; Option C chosen for the picture.

## Needs Ryan
- Verify: UP iron ore claim, Petoskey and copper being non-magnetic (true as far as known), Michigan declination (no number added).
- Pictures with imperfect results (3 tries max): `31-arrows` (bottom green arrow longer than red, but only modestly), `31-clip` (magnet and hand under the cardboard look rough), `31-compass` (blue arrow loose). `31-magnets-a` (Option A) was generated but is unused.
- "Unit 3 Forces, Motion and Energy" under Builds toward is still unchecked.
- Run inject-images.mjs then build; the injected figure ids d-31-*, g-31-*, 31-magnets, w-31-magnet are gone from the JSON (w-31-magnet no longer listed; file kept).
