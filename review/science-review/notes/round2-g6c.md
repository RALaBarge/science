# Round 2 notes: g6c (6th unit-07 Cells, unit-08 Classifying Life)

Both pages edited in place (CRLF kept, images embedded as base64 webp, total about 240 KB added to unit-07 and 110 KB to unit-08). Checked in headless Chrome at 1100 px and 390 px: no console errors, no horizontal overflow, tags balanced.

## unit-07-cells

- **Hero (nucleus = city hall)**: SVG replaced with a 3D cutaway cell image (`g6c-u7-hero-cell`), with the three analogy labels as HTML pills under it (no more clipped "mitochondria = power pl...").
- **Explore the cell**: the SVG cartoon is replaced by two 3D cutaway images (`g6c-u7-cell-animal`, `g6c-u7-cell-plant`). The part buttons now draw pulsing yellow rings over the picture. Ribosomes and animal-cell vacuoles are too small or absent in the pictures, so the readout says the rings only show roughly where they are.
- **A plant over 24 hours**: viewBox padded at the top (`0 -24 640 284`) so "photosynthesis" is no longer clipped.
- **Osmosis**: the SVG circle is replaced by three celery-in-glass photos (`g6c-u7-celery-fresh/same/salty`) that the salt slider switches between, with a caption. Added the Commons red blood cell diagram below it.
- **School analogy**: all five levels now have a new school image on top (`g6c-u7-school-student/class/dept/ops/whole`) and a new body image underneath (`g6c-u7-body-musclecell/muscletissue/heart/circ/person`). Mobile scrolls sideways within the card.
- **Mitosis**: SVG replaced by four real onion root-tip micrographs, cropped (Commons). The unit has no meiosis content, so no meiosis image was added.
- **Other images replaced** (not in Ryan's list but covered by "replace all"): LEGO brick/wall/castle (3 new images), solar farm / battery / power plant, perfume spray / doorman (diffusion image replaces the bouncer cartoon), and the "Seeing cells yourself" sketches (now real micrographs from Commons).
- **Left as is**: charts, the two-recipes box, the diffusion canvas, the interactive Elodea drawing, and the potato chart. These are data or live interactions, not illustrations.

### Commons images (all embedded and credited on the page)

| Use | File | Author | Licence |
|---|---|---|---|
| Mitosis steps 1-4 | Mitosis in Onion Root - various stages (Prophase, Metaphase, Telophase and Anaphase files; step 3 is cropped from the Telophase file) | Natalierussell77 | CC BY-SA 4.0 |
| Onion skin | Onion Epidermis Cells W.M. 40x - 132.jpg | loganrickert | CC BY 2.0 |
| Cheek cells | Human Cheek Cells (Methylene Blue Stain).jpg | Fritzmann2002 | CC BY-SA 4.0 |
| Blood cell osmosis | Osmotic pressure on blood cells diagram.svg | LadyofHats | Public domain |

I matched the mitosis crops to step names by eye (the stage names in the Commons file titles are loose). A science reviewer may want to look at steps 2 and 3.

## unit-08-classifying-life

- **Kitchen analogy**: three new photos (`g6c-u8-kitchen-farmer`, `-diner`, `-fungi`) replace the cartoon SVGs.
- **Concept 3 analogy ("Guess Who?")**: redrawn as a branching tree. Eight faces sit at the leaves, the questions split the group 8 to 4 to 2 to 1, and the chosen path is highlighted. It shows a branching hierarchy instead of a grid of faces. The old JS that drew the faces is removed.
- **Michigan tree from its leaf**: the drawn leaf shapes are replaced with five diffusion specimen photos (`g6c-u8-leaf-maple/oak/birch/pine/fir`). I checked each one by eye: the maple has pointed lobes, the oak has rounded lobes, the birch is a toothed oval with a pointed tip, the pine has needles in bundles, and the fir has flat single needles. The photo changes with the mystery-leaf chips. The key logic is unchanged. The photo's alt text is generic so it does not give the answer away.
- **Branching tree (analogy) and vertebrate family tree**: both redrawn with curved coloured branches, trait pills with backgrounds, and a circular photo at each tip (`g6c-u8-an-fish/frog/turtle/bird/deer`). The structure and facts are unchanged.
- **Sports team**: the SVG text was clipped and run together. It is now two HTML panels, each with player icons, a bold title and a separate description line.
- **Michigan's living things** (Ryan: leave): untouched.
- **Not touched**: hero tree, mailing-address nested boxes, and the charts.

## Generation notes
All generated images use ComfyUI z-image-turbo with `raw: true` prompts and no text in the image. Everything is logged in `k5-images\images.json` under ids starting `g6c-`, with webp masters in `k5-images\webp\g6c-*.webp`. Regenerated after a first look: the cells (they were cropped tubes), the lego wall, two school images that had garbled sign text, the deer (it came out as a white doe), the pine and oak leaves, and the fish.
