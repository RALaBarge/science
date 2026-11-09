# Unit 4.4 Structures, Senses, and Responses: applied

## What changed (page: k-5/unit-4-4-structures-senses-and-responses.html)

- Deer hears predator: new diffusion picture (`44-deer`) replaces the drawn SVG, alt text updated, arrow chain removed from the block. "Predator" explained under the title. Kid quote kept.
- Reaction data moved from Concept 3 to sit under the Hands-on block ("Try it at home or in class"). Instructions shortened to "Write each catch mark ... Circle the middle mark for each cue." Full procedure stays in the Hands-on block only. "This is a rough comparison..." paragraph deleted. Worked reading fixed ("Compare the middle marks, not single catches"). Backup data says "3 tries for each cue, not 5". Inches added beside every cm value.
- "No time or no good weather?" body replaced by a pointer to the Reaction data block.
- Ruler-drop Try it block deleted; its one-line intro ("One student holds a ruler...") folded into the Hands-on text.
- Hands-on: lead-up for "fair test" and "reaction"; "Fair-test investigation:" lead-in turned into a sentence; "What you need" is now a bulleted list; safety line capitalized.
- Concept 3 intro defines "reaction"; Path model explains "muscles" (and is now a full sentence).
- Concept 1: Structure match table is now a bulleted list. Plain-word lead-up for structure/external/internal. Plant structures and cactus drawn SVGs replaced by diffusion pictures (`44-plant-parts`, `44-cactus`); plant picture has HTML labels (Flower, Leaf, Stem, Roots).
- Concept 2: Inside/outside sort table is now two bulleted lists, names match the card list ("Leaf", "Spine of a cactus", "Root"). Human inside and Plant stem inside SVGs replaced by diffusion pictures with HTML labels (`44-body`, `44-stem`). Lead-up for plant transport tubes. Claim/evidence lead-up before the sentence frame.
- Concept 3 three-row chain: drawn SVG replaced by a small HTML widget (`k5-images/html/w-44-chain.html`, JSON id `w-44-chain`): three small diffusion pictures plus HTML boxes and arrows (stacks on phones). The interactive "Send a message" widget is unchanged.
- Bar graph (`g-44-reaction.svg`) kept as a real chart: y-axis label now "Distance the ruler fell (cm and inches)", inches axis added on the right, caption and text version carry inches.
- Top of page: "A sense organ is a body part that gathers information, like eyes, ears, or skin." added under the intro.
- Near you: robin line reworded to "use their eyes to spot worms and bugs on the ground"; white pine line replaced.
- Standards: "Michigan Science Standards this unit earns" block deleted from the tutor notes, codes deleted from the footer, tutor-notes summary no longer says "standards". Removed text (in case it goes to a teacher file): 4-LS1-1 "Construct an argument that plants and animals have internal and external structures that support survival, growth, behavior, and reproduction." 4-LS1-2 "Use a model to describe that animals receive information through their senses, process it in their brain, and respond to it."
- Limits and cautions: "The unit says all of this." deleted.
- Capitalization/punctuation: fragment lines made sentences (all aid subtitles), curly quotes where I touched text ("now", "This part helps because…"), "an organ that processes information" in Words to know.
- Games untouched.

## Defaults taken for the report's questions

1. Ruler-drop Try it block: deleted, intro folded into Hands-on (recommended).
2. Bar graph: kept as a real SVG chart with exact numbers. The two-students-and-ruler diffusion picture (`44-ruler`) already sits above it, so no new picture was needed.
3. Raster photos: left as they are (already diffusion files in `k5-images/webp`). Kept both the top deer and the new Real world deer (no default given).
4. Predator in the image: deer alone, no predator (recommended).
5. Standards codes in tutor notes: no recommended default. Removed them (the page is kid-facing and standing order 6 says no codes). Text preserved above.
6. MDE comparison for the review copy: not done (codes no longer on the page).
7. Cactus or porcupine: cactus kept (the report's default). Note the report contradicts itself here: Changes item 13 says "Recommended swap: porcupine quills", Question 7 says "Keep the cactus (default)". Took the question default. (A cactus does grow wild in Michigan sand dunes, eastern prickly pear, but verify before claiming it on the page.)
8. Check yourself questions: no change. The page already has 4 working questions in its script (the report was written from extracted text that did not include them), so the block is not empty.
9. Top image: see below.
10. Robins and white pine: used the report's safer text. Verify both before this ships.
11. Optional ruler-drop seconds: left out of the tutor notes (optional, no default).

## Report items that did not apply or were changed

- Item 21 hero: the top picture is the existing diffusion deer photo (`44-hero`), not an SVG, so it was not replaced. The "[SVG IMAGE]" before the title in the extracted text is review-site chrome.
- Item 16 (review-copy markers): none are in the source, ignored.
- Item 3b says "Write each catch mark in the table": there is no table (standing order 4), so the wording is "Write each catch mark for 5 tries...".
- Item 3c deletes the whole "rough comparison" paragraph, but that paragraph also held the backup-data conclusion. Kept only that conclusion (one copy, in Reaction data: middle marks 10 cm and 13 cm, gap not bigger than the gap between tries); deleted the "rough comparison / swap roles" sentences, which the Hands-on block and Limits already say.
- Item 6: the worked reading no longer contains cm values (item 4 replaced it), so no inches were needed there.
- Item 20 block-label separators: all kickers already use the middle dot; the odd one was the "Fair-test investigation:" colon lead-in, now a plain sentence.
- Item 22 done as written; item 19 "Words to know" layout is a proper dl, no change besides one wording fix.

## Images made

`44-deer`, `44-plant-parts`, `44-cactus`, `44-body`, `44-stem`, `44-chain-eyes`, `44-chain-skin`, `44-chain-ears` (files in k5-images/webp, logged in images.json).
Tries: deer used all 3 (every try shows a few spots on the flank; kept the antlered buck, the best of three; the alt text says brown deer with antlers). `44-chain-skin` used 3 tries; kept try 2 (a hand held up away from the pan, but another hand grips the pan handle, so it reads as an adult cooking and the child's hand pulling back; weak). `44-cactus` and `44-stem` took 3 tries (earlier tries had smiling faces or a cucumber look). `44-body` and `44-plant-parts` 2 tries. `44-chain-eyes`, `44-chain-ears` 1 try.

## Still needing Ryan

- Verify: robins find food by sight (and hearing); white pine is Michigan's state tree; coyotes and gray wolves are deer predators in Michigan (taken from the report).
- Skin picture is the weakest; ask for a redraw if it matters.
- Where the standards list should live (teacher file?).

## Process notes (brief feedback)

- The brief says the pages in `k-5\` have no injected figures and `[SVG]` blocks are edited in place. In this unit the source already contains injected figure blocks (`k5images-start`) and a second kind of block (`k5b-start`: per-aid SVGs, tables, worked examples) that no script in the brief describes. Say which are safe to edit by hand (k5b are; k5images get rewritten from the JSON).
- The report was written from `page-text`, which comes from the built review site: it shows "[SVG IMAGE]", review banners and "CHECK" lines that are not in the source, and misses script-built content (the Check yourself questions). Reports should say they are from extracted text, and the brief should say to verify each item against the source.
- JSON `after` can only place a figure after a section's idea line, not inside an aid. For pictures that belong inside a Real world / Diagram block (deer, plant, cactus, body, stem) I embedded the image directly in the aid's k5b block as a base64 `<img>` (same single-file approach as the injector) so the lead-up text, picture and caption stay together. The chain picture and graph go through the JSON as the brief says. Tell agents if inline embedding is not allowed.
- "Labels as HTML text over the image" had no mechanism. I added a small CSS block (`<style id="u44css">`) and overlay chips with leader lines. If a shared mechanism is wanted, it should live in `inject-images.mjs`.
- The page uses CRLF line endings; edit scripts must normalize or exact string matches fail.
- `comfy_gen.py` always adds "simple friendly faces", which puts smiley faces on cacti and stems; passing `"raw": true` with your own style text avoids it. Worth documenting in the brief. Also the brief does not say how to restore a previous try: re-running a seed with `force` overwrites the file.
- The brief's "pat matches the built HTML" is easy to test: I ran `injectInto` into a scratch file (not the repo) and checked every pattern. A supplied check script would help.
- Preview of the finished page was rendered with headless Edge from a scratch copy (`injectInto` output), not from the repo; nothing in `dist\`, `review-site\` or the page was built by me.

## Image fixes (second pass)

- `44-chain-skin` fixed (seed 403, try 3): one open hand pulled up above a hot frying pan with steam, handle empty, no second hand. Replaced in the page and in `k5-images/html/w-44-chain.html` (the widget copy), at 320x240. The hand is adult-sized; the model does not draw a clearly child's hand.
