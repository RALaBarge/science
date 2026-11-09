# Unit 2-A notes

## Changed
- Concept 1: Michigan Petoskey opener and property/bendy/waterproof lead-up; Analogy and Data blocks removed; new draggable bin sort (3 bins, 6 cards, wrong drop slides back, tap-then-tap fallback); old tap widget `w-2a-bins` removed from unit JSON.
- Concept 2: Michigan opener; Try it with 30 cm / 6 x 9 cm sizes and bullets; Data table (example results); Real world rewritten with one raincoat + helmet picture (SVG removed).
- Concept 3: Michigan snowman opener; Try it block removed; Diagram filled (lead-up, picture, caption); Real world picture replaces SVG; widget and captions now five blocks (`w-2a-pieces.html` edited: five blocks, "Plus sign" instead of "Square").
- Concept 4: physical vs chemical intro with melting/freezing lead-up; Analogy replaced; Try it with Name it, bullets, egg/toast picture; Data table with physical/chemical column (SVG removed); Real world expanded; photo caption fixed (unit JSON caption updated too).
- Bottom: Rainproof SVG removed from page and unit JSON (`g-2a-rainproof`); backup tables, bulleted needs/safety, "not waterproof" wording, standards codes removed (heading, footer, Tutor notes, 2-PS1-4 line).
- Words to know: added physical change, chemical change, fair test, bendy (flexible). Fair test defined at top. "heating/cooling" and "dry/wet" fixed. Connections made a bulleted list.
- Report items not needed: no CHECK banners or "REVIEW COPY" in source; Check yourself has 4 questions in source script (report wrong).

## Defaults taken
Q1 triad read as proposed; Q2 physical/chemical kept; Q3 optional triad skipped, only melting/freezing named; Q4 Concept 1 Data removed; Q5 same table in both places, labelled example; Q6 general helmet wording ("most bike helmets have holes"); Q7 game untouched; Q8 codes removed from Tutor notes; Q10 hero and ice are raster, kept; Q11 Connections kept; Q12 distance/size kept; Q13 Mackinac Bridge not used (unverified), Michigan snowman used instead; Q14 SVG removed.

## Images made (ids)
2a-bin-blue/green/orange, 2a-card-boot/paper-t3/wrap/band/block/stone, 2a-raincoat-helmet, 2a-blocks-before-after-t4, 2a-blocks-house-car-t3, 2a-egg-toast-t2. (Unused tries remain in webp: 2a-card-paper, 2a-blocks-*, 2a-blocks-*-t2/t4, 2a-egg-toast.)

## Needs Ryan
- Block images: diffusion does not count reliably; chosen ones show five pieces (4 cubes + roof triangle) but the diagram shows 5 cubes left vs house right, and no car appears. Real-world text now says "five blocks make a house; the same blocks can make a car". After 3-4 tries I kept the best.
- Helmet wording: verify with a helmet maker.
- Dragging not tested in a browser; hand-checked only.
- Skipped IP-7/IP-9/IP-10/IP-11 (optional).

## Image fixes (second pass)

- Diagram image (`2a-blocks-before-after-t4`) fixed (seed 202, retouched): five cubes spread apart on the left, a five-cube house (three below, two on top) on the right. The diffusion roof triangle was painted out to keep the count at five, so the cube tops are cut flat.
- House image (`2a-blocks-house-car-t3`) fixed in a different way (seed 302): it now shows a house and a car made of toy blocks. Diffusion cannot count blocks reliably (the house has a roof and the car has wheels), so the Real world sentence no longer says "five": "Blocks can make a house. Take them apart, and the same blocks can make a car." The five-block count lives in the Diagram and the pieces widget only.
