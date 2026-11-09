# Unit 3.3 Life Cycles and Traits: applied

## Changed (page `k-5/unit-3-3-life-cycles-and-traits.html`, unit JSON, 26 green entries)
- Lede: plain definitions of trait and life cycle.
- Hero caption fixed (a frog starts as an egg; green frog, Michigan). Alt text and caption also changed in the unit JSON.
- Concept 1 diagram: the drawn frog SVG is replaced by four diffusion pictures (egg, tadpole, froglet, adult frog) with HTML labels and arrows, embedded in the page. Froglet definition added before it. Caption says the arrows go left to right and the adult lays new eggs.
- Cards to copy: table changed to a bulleted list. Larva, mealworm, pupa and sprout defined first.
- Shared stages chart: the drawn SVG is replaced by a real HTML table (Begin, Grow, Reproduce, Die) and a diffusion picture.
- Concept 2: offspring/inherit lead-up; trait survey "You need" and steps are bullets (Michigan dry beans; 1.5 cm with "about half an inch"); parent-offspring data is now a table with a diffusion picture and "Sample numbers from one test."; trait chart text added and the sample-number sentence moved to its own line; Dogs and farm plants has concrete wording.
- Concept 3: environment and fair-test lead-ups; plant-height data is now a table (cm with inches); Michigan garden has concrete wording; "dark cupboard" changed to "a shelf in shade, away from the window"; "same cup" changed to "same kind of cup"; "in the dark" changed to "in shade" in the Notice line; sun/shade graph caption has inches and "sample numbers" (JSON).
- Hands-on: What you need, What you do, and the backup data are bulleted lists with capital letters. The "What is new here (2-B)" text moved to Tutor notes.
- Tutor notes: standards codes removed ("What you will learn" bulleted goals); "guarantees" changed to "gives"; footer codes removed. Connections unit labels kept.
- Words to know: definitions start with a capital letter.

## Report items that were wrong or not needed
- The hero, the frog photo, the bean photo and the lab image are already diffusion webps (not SVG). Hero image not regenerated; only the caption was fixed.
- Stages chart already held an SVG table, and the page had no "[SVG IMAGE]" markers; the Check yourself quiz is built by script and has 4 questions, so item 28 was skipped.
- Words to know: dt/dd are separate elements, so the "life cyclestages" run-together is a text-extraction effect; no colon added.
- No REVIEW COPY banner or CHECK badges in the source; nothing to remove.

## Defaults taken for the report's questions
1. Data graphs: kept as real SVG charts (brief overrides); added diffusion pictures beside them (seeds picture beside the table; the existing bean photo covers sun/shade).
2. Raster images: all diffusion already; no change.
3. Plain-language goals kept (in Tutor notes); K-C, 1-B, 2-B and unit numbers kept.
4. Trait Family game untouched.
5. Michigan dry bean sentence softened to "Plant scientists who work on Michigan dry beans also pick the plants that do well to grow the next year." Verify against MSU Extension.
6. Green frog as the Michigan example: verify.
7. "Birth" kept in the idea line and tutor notes (matches the standard wording).
8. Shade (shelf away from the window), not total darkness.
9. Quiz exists; skipped.
10. Triad blocks read as Diagram, Try it, Data, Real world and Hands-on.
11. Words to know: no colon (see above).

## Images made (6, diffusion)
- 33-frog-egg, 33-frog-tadpole, 33-frog-froglet, 33-frog-adult (one try each). Froglet looks like a small frog with a barely visible tail stub; accepted.
- 33-three-cycles (stages picture): shows a frog, a bean plant and a mealworm larva but no adult beetle; the caption says "mealworm (the young stage of a beetle)". One try.
- 33-bean-seeds (beside the parent-offspring table): illustrative only, not the counts. One try.
All embedded as base64 in the page (small webp). New CSS: `<style id="u33css">`.

## Still needs Ryan
- Verify: green frog in Michigan; Michigan dry bean breeding sentence.
- The hero and sun/shade caption edits live in the unit JSON; they appear in the built page after the injector runs (hero caption also edited in the page).
- Inches added to the sun/shade numbers (about 7 in, about 9 in) and the 1.5 cm bean length: approximate conversions.
