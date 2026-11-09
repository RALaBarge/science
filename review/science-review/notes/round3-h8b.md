# Round 3: h8b, 8th/unit-8.6-gravity-orbits-and-the-solar-system.html

Edited only that page (CRLF kept) plus 13 new files `8th-images/webp/86-*.webp`. Did not run inject.mjs/build.mjs; the page's `img8` markers are untouched, so inject.mjs is safe to re-run. The page grew from 1.5 MB to 2.7 MB (images are base64 in the page, ~1 MB of it in a JSON block that only decodes on click).

## Changes
- Hero "Solar System from above": replaced the 640x260 SVG with a new top-down SVG (viewBox 720x720, `width:min(100%,82vh,720px);height:auto`). Squeezed (sqrt) distances, ordered orbits, planets, and both belts as dotted rings of small points (main belt 2.2-3.2 AU, Kuiper belt about 30-50 AU), each labelled.
- New side-view SVG under it (viewBox 900x295): thin flat disk, planets on the plane, asteroids and Kuiper objects scattered slightly above/below (heights exaggerated, said in caption), arrows for the Sun's gravity, Oort cloud mentioned in caption as not drawn. On phones (<=560px) the side view scrolls sideways inside its box (min-width 520px) so labels stay readable; no page-level horizontal scroll.
- Try it "The Solar System from above": the fixed 640x640 canvas is now a responsive SVG (same viewBox/CSS), same controls/table, plus both belts. Orbit of selected planet highlighted, labels for the selected planet and the giants (collision-nudged). Squeezed/true-distance toggle still works (belt radii follow the toggle).
- Try it "Order the story": the dotted SVG sketches are now photos per stage with credit: Barnard 68 (ESO, CC BY 4.0), Pillars of Creation (NASA/ESA Hubble), HH 30 edge-on disk (ESA/Webb/NASA/CSA, Tazaki et al., CC BY 4.0), the Sun by SDO (NASA), artist concept of a disk with gaps (NASA/JPL). Captions say which are artist concepts.
- Try it "Choose a planet": clicking a planet name opens an accessible modal (role=dialog, aria-modal, focus moves to the close button and Tab stays there, Esc / X button / backdrop close, focus returns to the chip, body scroll locked) with the photo and credit. Images (all public domain NASA via Wikimedia Commons, 900 px wide webp): Mercury MESSENGER; Venus Mariner 10 (reprocessed 2020, PIA23791); Earth DSCOVR EPIC "Blue Marble" 2015; Mars Viking orbiters (Valles Marineris hemisphere); Jupiter Hubble June 2019; Saturn Cassini (Saturn during Equinox); Uranus JWST (processing Andrea Luck); Neptune Voyager 2. Chose the newest NASA images that were public domain and seamless; Juno/Magellan/Perseverance not used.
- Concept background paragraphs (2-5 sentences, key terms defined, metric + imperial) added under the idea line of Concepts 1-5.

## Checks
Headless Chrome (Playwright) at 1920, 1280, 768, 390 wide: no page overflow, no console errors, figures scale with the window, modal opens by mouse and keyboard, Esc closes, all 8 images load; checked retro and `?style=classic`. Script syntax and tag balance verified.

## Not done / notes
- Earth is the 2015 DSCOVR image, not the 1972 Apollo "Blue Marble" or Suomi NPP composite (that one had gaps in the swath).
- Jupiter/Saturn/Uranus/Neptune: JWST/Hubble for Jupiter and Uranus, Voyager 2 for Neptune (JWST Neptune is infrared and less photo-like).
- Source tools are in the scratchpad (`h8b/build.py`, `solar.js`); the page edit is applied directly.
