# Unit 4.5 Earth's Surface: Rocks, Maps, Erosion, Resources: applied

## What changed (page: k-5/unit-4-5-earths-surface-rocks-maps-erosion-resources.html)

- Concept 1: stub lines deleted in Soil sort, Property table, Shake and water tray, Michigan copper. Soil sort now says soil from a Michigan yard or Lake Michigan beach (ask a grown-up first). Lead-up "Grain size means how big the bits are." Water measured in milliliters. All You need lines are bulleted lists. Table cells capitalized. Copper SVG replaced by a diffusion picture (`45-copper`).
- Concept 2: "Sandstone is rock made of sand. Shale is rock made of mud." lead-up before the photo. Rock layers: fossil lead-up, new picture (`45-rocklayers`) with HTML chips Oldest and Newest, Michigan fossil coral in the bottom layer (no velociraptor). Make layers: one teaspoon (about 5 milliliters). Petoskey stone: picture from Unit 3.4 (`34-petoskey`), alt from the report. Patterns question: quarry lead-up, new picture (`45-quarry`), clues as a bulleted list.
- Concept 3: US relief map block filled (lead-up, picture `45-usrelief`, figure text, prompt kept). Michigan map block filled (lake-location sentences, picture `45-mimap` with HTML chips for the three lake names, prompt kept). Pattern log backup notes are a bulleted list.
- Concept 4: Energy cards: fuel and natural resource lead-up, four-panel picture (`45-energy`) with HTML chips, caption from the report, "older coal plant" instead of "legacy coal plant". Resource chart: table added. From resource to use: picture (`45-flow`), two-path text, no arrows in the image. Card combine: stub deleted.
- Concept 5: sediment lead-up under the Concept 5 idea line. Helmet: stub deleted, "breakwall". Barrier test: "at least three times", teaspoon metric on first use of spoonfuls. Before/after erosion: data table (No barrier 12, Grass 5, Wall 7), "Your log" line, quote changed. Great Lakes flooding: breakwall lead-up, picture (`45-portaustin`), caption says it is a drawing "like the one at Port Austin".
- Hands-on: What you need is a bulleted list; safety line as sentences; run-on summary deleted; "Repeat each design at least three times"; curly quotes in the claim step. New picture `45-sandpiles` added to the unit JSON before the sediment graph. Graph file `k5-images/svg/g-45-sediment.svg` reordered to No barrier, Grass, Wall; y-axis "Spoonfuls (teaspoons)"; JSON alt and caption updated (spoonfuls, teaspoon about 5 mL). Backup-data paragraph: spoonfuls, "older coal plant", and "the standard expects you to collect your own" reworded to "it is best to collect your own".
- Near you: bulleted list. The two unverified claims (natural gas storage fields; shift from legacy coal toward gas and solar) are gone; the last bullet says people in Michigan get energy from natural gas, coal, wind, and sunlight.
- Words to know: fuel, natural resource, relief map, breakwall, grain size added.
- Standards: "Michigan Science Standards this unit earns" block removed from the tutor notes, codes removed from the footer, tutor-notes summary no longer says "standards". Removed text (for a teacher file): 4-ESS1-1 Identify evidence from the patterns of rock formations and fossils to support explanations of how landscapes changed over time. 4-ESS2-1 Make observations and/or measurements to provide evidence that water, ice, wind, or vegetation cause weathering and/or erosion. 4-ESS2-2 Analyze data from maps to describe patterns of Earth's features. 4-ESS3-1 Obtain and combine information to describe that energy and fuels are derived from natural resources and that their uses affect the environment. 4-ESS3-2 Generate and compare multiple solutions to reduce the impacts of natural Earth processes.
- Title, h1 and intro now use the curly apostrophe. Game untouched.

## Defaults taken for the report's questions

1. Copper and Petoskey: diffusion (copper `45-copper`); Petoskey reuses the Unit 3.4 image.
2. Velociraptor: replaced by a Devonian-type fossil coral in the bottom layer (verify the fossil kind before it ships).
3. "That top thing": read as the empty relief map and the empty Michigan map blocks; both filled.
4. SVGs: all drawn SVGs on the page were replaced, except the sediment bar graph (see 5). There is no page-top SVG in the source.
5. Sediment graph: the report recommends (a) replace the graph with P9 and numbers as text. The apply brief says exact-number graphs stay real charts with a diffusion picture beside them, so I followed the brief: kept the chart (reordered No barrier, Grass, Wall) and added the P9 picture (`45-sandpiles`) before it. The numbers are also in the new data table.
6. Port Austin: diffusion stand-in; the caption says it is a drawing, not a photo. The aerial prompt did not use "facing south" (the report's own note says diffusion cannot reproduce the real layout).
7. Hero, Concept 2 photo, tray and three-people images: all are already diffusion `.webp` files (`45-hero`, `45-layers`, `45-tray`, `45-lab`), so P10 and P11 were not made.
8. Petoskey image reused from Unit 3.4.
9. Spoon: teaspoon, about 5 milliliters. Defined once in Concept 5 and in the graph caption; Make layers says "one teaspoon (about 5 milliliters)".
10. "Breakwall" everywhere.
11. Standards codes removed (see above). No teacher area exists in the page.
12. Check yourself: no change (see below).
13. Game: no change.
14. Michigan facts: removed or softened (see Still needing Ryan).
15. Provided cards: no default. The "provided map cards" and "provided energy-resource cards" wording stays; the Card combine table is the cut-out version.
16. Cross-references (2-C, 3.2, 5.2) kept.

## Report items that did not apply or were changed

- Item 27 (Check yourself empty): wrong. The quiz is built by the page script and already has 4 working questions. No change.
- Items 31 and 35 (review banner, CHECK badges, top SVG): not in the source. Ignored.
- Item 23 "Try itWhat you need" missing spaces: the tag span and h3 are separate elements in the source. No change needed.
- Item 32: the misconception list is already a `<ul>`. Only the standards block was removed.
- Item 22: the stub was deleted; "provided energy-resource cards" kept as is.
- Item 14 order fix done in the graph; the "Real log... Provided dataset" tip text in Before/after erosion was replaced by the table.
- Item 4's "Michigan Petoskey Stone" capital-S check: page already uses "Petoskey stone".
- Item 25 curly quotes: the only straight quotes in kid-facing text were the claim step in What you do; fixed.
- Item 8 caption: image has no text, so the card names (Natural gas, Wind, Sun, Coal) are HTML chips over the picture.

## Images made

`45-copper`, `45-rocklayers`, `45-quarry`, `45-usrelief`, `45-mimap`, `45-energy`, `45-flow`, `45-portaustin`, `45-sandpiles` (files in k5-images/webp, logged in images.json). Also reused `34-petoskey`.
Tries: `45-rocklayers` 2 (try 1 had the coral in the second layer and five layers; kept try 2). `45-usrelief` 3 (kept try 3: greens and brown ridges are clear, but the Rockies read as coast and northern ranges rather than a central band, the Great Lakes are just blue water, and faint state lines show through despite the negative prompt; the figure text was changed to say what is shown). `45-mimap` 2 (kept try 2: mitten, Thumb and Upper Peninsula read correctly; the tan dune strip is along the south edge, not the Lake Michigan shore, so the alt text does not mention dunes). `45-energy` 2 (try 1 repeated the solar panel and the coal plant had cooling towers). Others 1 try.
`45-quarry` is weakish: the shells are small on a gray slab.

## Still needing Ryan

- Verify: Michigan Devonian coral as the fossil in the layers picture; Petoskey stone fossil-coral claim and "warm shallow sea" caption (both from the existing page); natural gas storage in Michigan (removed from the page, so only if you want it back); Michigan's current energy mix.
- Port Austin: if you find a real aerial photo (with license), swap it in for `45-portaustin`. Confirm the Port Austin location.
- US relief map is the weakest picture; ask for a redraw if it matters. The Michigan map outline is acceptable by eye but check it against a real map.
- Provided map and energy-resource cards: confirm they exist.
- Play the game once to close CHECK 2. Standards codes still need comparing with the MDE document and a place to live.

## Process notes

- The `k5images` injector markers contain the old text until the lead runs `inject-images.mjs`; the JSON now has the new `45-sandpiles` figure and updated graph alt and caption. The `pat` strings for those two were tested against the expected caption text, not a built page.
- The `u45css` chip style is added just above `<!--k5images-css-start-->`. Chips for the Michigan map and energy picture are positioned by eye (percent offsets); check them in the built page.
