# Unit 5.4 Earth's Spheres, Water, and Communities: applied

## What changed (page: k-5/unit-5-4-earths-spheres-water-and-communities.html)

- Top picture: new Michigan lakeshore picture (`54-top`, via unit JSON `54-hero`) with a lead-up line ("Rain runs downhill and moves soil...").
- Concept 1: lead-up for the four spheres and the word "sphere" before the diagram. Diagram picture is now diffusion (`54-spheres`, JSON `d-54-hill` changed from svg to image). Diagram block filled with one bullet per sphere. "Stream model" renamed "Stream tray", with sediment lead-up and numbered steps (1 cup = about 240 mL, spoonful = about 1 tablespoon = about 15 mL). Results are a real table (No plants / Grass / Stones). Erosion defined before use. Michigan hill block: lead-up, "A hill in Michigan gets a spring rain", new picture `54-mihill` embedded in the block.
- Concept 2: groundwater defined before the water picture; picture is now diffusion (`54-water`, JSON `d-54-reservoirs` changed to image). Fresh-water share now reads "a little under 3%" (rounding said once). Bar-graph lead-up. Great Lakes block rebuilt: five buttons, each shows a satellite-style picture plus the volume under it in cubic miles and cubic kilometers, labeled "artist's rendering, not real photos"; Lake Michigan sentence added; placeholder text and drop SVG removed. The 100-square graph and both interactive widgets are unchanged.
- Concept 3: case cards are bulleted lists (Sleeping Bear Dunes named); "Read one card at a time". Evidence defined; example row fixed. Rain-garden runoff has a table, the 4-bucket difference, quote changed to "less runoff leave, water looked cleaner", seen-vs-measured note, bucket size in liters. Dune: lead-up and new picture `54-dune` replaces the SVG.
- Hands-on: time line made consistent (30 min tray test, 25 more for graph and cases); What you need and What you do are bullet lists; safety line in sentences; 1 cup metric; "usually" removed from Notice.
- Backup data: STRONG removed, the unverified 4.5 comparison removed, pipe-text replaced with real tables.
- Words to know: added sphere and groundwater, definitions consistent. Standards block and codes removed (tutor notes and footer). Washtenaw County name removed. Apostrophes made curly in body text. Quiz explanation about rain gardens softened ("let it soak in").
- `g-54-sediment.svg` labels now "Stones" and "Grass" (were "... model"); captions and alt match.

## Defaults taken for the report's questions

1. Line 19 top photo: replaced by the P1 Michigan picture (it is the hero); P11 not made.
2. "Concept 2's image" idea: kept as the where-water-is picture (`54-water`).
3. Great Lakes labels: cubic miles + cubic km (item 10 default); one fifth kept as "about one fifth".
4. Data graphs (100 squares, two Hands-on bar graphs): kept as real SVG charts.
5. Rain-garden data: shown as an example ("what a test could show"); 5-gallon bucket given as a conditional (about 19 L).
6. Case-card claims: kept, "water looked cleaner" wording softened; verify.
7. Standards codes: deleted from the page (not moved).
8. Combine-information chart: kept as a four-column chart described in text.
9. Time: about 30 min tray test.
10. "4.5 counts" line: removed.
11. "Style Classic/Retro space": UI control in the source, left alone.
12. Game: untouched.
13. Washtenaw County: removed.

## Report items that were wrong or skipped

- Item 23 (Check yourself empty): the 4 questions are built by script, so the block is not empty. No change except one explanation sentence.
- Item 26 (review overlay) and item 31 "Try itWhat you need" concatenation: review-site chrome, not in source.
- Item 31 kicker "Hands-on · Design or investigate": left with the middle dot, which every kicker uses on this page and the corpus.
- Item 24 asked for a bulleted glossary: left as the existing definition list (the run-together text was build chrome).
- Item 20: the two Hands-on graphs stay SVG charts; no new graph built.

## Images made

`54-top`, `54-spheres`, `54-mihill`, `54-water`, `54-dune`, `54-lake-superior`, `54-lake-michigan`, `54-lake-huron`, `54-lake-erie`, `54-lake-ontario` (in k5-images/webp, logged in images.json).
Tries: all 1 try except Superior and Huron (2 tries each; try 1 looked like the Caribbean and Scandinavia). The lake pictures do not match the real shapes of the lakes (diffusion cannot do that); the page labels them artist's renderings. Michigan, Erie and Ontario are loosely right (long dune coast, long lake, oval).

## Still needing Ryan / verify

- Lake volumes (NOAA GLERL / EPA): Superior 2,900 mi3 (12,100 km3), Michigan 1,180 (4,900), Huron 850 (3,540), Erie 116 (480), Ontario 393 (1,640); "only Great Lake entirely in the United States" (Michigan); "about one fifth of surface fresh water".
- Fresh-water share: wording is "a little under 3 percent"; report suggests 2.5 percent (USGS). Verify.
- Case-card claims (rain garden tests, dune roots, fertilizer water tests) and whether 10 vs 6 buckets is real or an example.
- Lake images are not real shapes: redraw or replace with real public-domain satellite images if wanted.
- The injected figures in the page file are stale until the lead runs `inject-images.mjs` (JSON updated for hero, spheres, water).
