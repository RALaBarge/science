# Unit 4.1 Energy, Speed, and Collisions: applied

## What changed (page: k-5/unit-4-1-energy-speed-and-collisions.html, JSON: k5-images/units/unit-4-1-energy-speed-and-collisions.json)

- Top: Michigan sled lead-up plus plain-word "speed" and "motion energy" before the hero. Hero picture replaced by new diffusion image `41-hero2` (two younger kids, not teenagers); JSON id `41-hero` now points to it.
- Concept 1: Data "Distance moved" now has a table with inches and the 1 inch is about 2.5 cm rule of thumb. Sled SVG replaced by diffusion picture `41-sled` (embedded in the Real world block). Caption and kid quote kept.
- Concept 2: lead-up for "collision" and "heat" before the idea line. Marble target: prediction lead-up, "You need" bulleted, "Energy of motion" changed to "Motion energy". Collision diagram SVG replaced by `41-coll`, caption reworded ("so you may hear a click"). Bumper cars SVG replaced by `41-bumper`; seat-belt sentence deleted. Collision widget label and caption now say "motion energy" (page copy, `k5-images/html/w-41-collision.html` and the JSON caption).
- Concept 3: "Heat is energy that moves from warmer things to cooler things." lead-up. The coat diagram SVG and the cooling line graph are removed (page and JSON). A new wide Diagram block holds two pictures (`41-spoon`, `41-coatheat`), the shared caption and the "A coat does not make heat; it slows the heat leaving." line. Cooling data is a table with degrees F. "Michigan winter coat" block: image brief replaced by a kid-facing paragraph and picture `41-coat`. Cup block "You need" is a list.
- Concept 4: lead-up for vibration, sound and light. Rice and lamp blocks: prediction lead-up and "You need" lists; lamp distance now "20 cm (about 8 inches)". Sunlight on snow SVG replaced by `41-snow`; "Rays are lines of light..." sentence added; the "Light carries energy..." caption sentence removed.
- Hands-on: "fair test" and "variable" lead-up; "graph results" now "record results in a table". Ramp bar graph SVG removed (page and JSON) and replaced by a "Ramp data" table with inches and the report's caption. "What you need" is a bulleted list; safety line made sentences. Backup data text has inches and degrees F; "the standard expects" reworded.
- Words to know: added motion energy, variable, fair test, ray.
- Standards: codes removed from the footer, from the Limits bullet (now "Teacher note: this unit covers part of the energy-transfer standard. Electric current is taught in Unit 4.2."), and the "Michigan Science Standards this unit earns" block deleted. Tutor-notes summary no longer says "standards". Removed text for a teacher page: 4-PS3-1 "Use evidence to relate the speed of an object to its energy." 4-PS3-3 "Ask questions and make predictions about changes in energy transferred when objects collide." 4-PS3-2 "Observe that energy can be transferred by sound, light, heat, and electric currents."
- "Grade 4 does not require kinetic-energy formulas" replaced by "This unit uses speed evidence only. It does not use energy formulas."
- Quiz: "energy of motion" changed to "motion energy" in one option and one explanation.

## Defaults taken for the report's questions

1. Which sled image: replaced both (Concept 1 Real world sled, and the teenage hero). No explicit default; the hero shows teenagers on a K-5 page.
2. Charts: option A, tables (Concept 1 data, cooling data, ramp data). Three SVG charts removed.
3. Concept 3 diagram: two pictures (recommended).
4. Triad: read as the Hands-on section; "What you need" bulleted (recommended). The Try it "You need" lines elsewhere were bulleted too for consistency.
5. Top [SVG IMAGE]: not in the source (review-site chrome), nothing done.
6. Image-brief lines ("a marble rolling into a small block target" and similar): no default given. Left as they are, except the coat Real world line, which the report says to replace. Ryan to decide.
7. Ramp photo: it is already a diffusion image (`41-ramp.webp`), so kept. Alt text now says "Picture". P8 not made.
8. Standards codes: removed now (recommended); text above.
9. MDE facts: not verified (see below).
10. Check yourself: report was wrong, the page already has 4 working questions built by script (the score line is not empty). No questions added.
11. Game: untouched (the game config still says "energy of motion" in its summary text; left alone per standing order).

## Report items that did not apply

- Item 22 (empty Check yourself), item 26 (review badges and CHECK lines), item 27 (run-together tags, table cells and glossary), and the glossary "bullets with colons" part of 23 were review-site chrome; the source already has separate chips, table cells and a definition list. Item 29 lists already bulleted in source; "In this lesson" is an ordered list.
- Item 3 (top SVG) see Q5 above.

## Images made

`41-hero2`, `41-sled`, `41-coll`, `41-bumper`, `41-spoon`, `41-coatheat`, `41-coat`, `41-snow` (files in k5-images/webp, logged in images.json). Not wired through JSON except `41-hero2`; the others are embedded as base64 images in the page blocks (Real world, Diagram) so the picture stays with its lead-up and caption.

Tries: `41-sled` 1, `41-hero2` 1, `41-coat` 1 (snowball beside the child has a smiling face, harmless). `41-coll` 2 (marble and blocks have faces on the blocks; the marble sits left of the first block rather than touching it, so it reads as before-and-after in one row). `41-bumper` 2 (touching, good). `41-snow` 2 (faint faces on fence posts; sun beam is a wide cone). `41-coatheat` 2 (orange lines sit beside the child, only faint ones on the coat, so thin versus thick is weak). `41-spoon` used all 3: the heat lines never run along the spoon, they rise above the mug. Kept try 3; caption and alt say what the picture shows. This one and `41-coatheat` may need a manual redo if Ryan wants the idea shown more clearly.

## Still needs Ryan

- Verify against the MDE document before publishing: the unit name "K-A Pushes and Pulls" (a page with that unit name exists on this site, but not checked against the Michigan list), and the standards text removed above (for the teacher page).
- The ramp and cooling numbers are the page's own provided dataset, not measurements; inch values are rounded (3 cm shown as 1 1/4 inches).
- Diagram pictures (spoon, coat) are weak; see tries above.
