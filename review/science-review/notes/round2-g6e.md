# Round 2: g6e (6th units 12-15)

## Unit 12 Ecosystems and food webs
- Food web: added a diffusion illustration (id `12-lakeweb`, z-image-turbo, no text) of a Great Lakes food web scene above the interactive web, with an HTML caption.
- Invaders in Michigan waters: replaced the SVG sketch with three real Wikimedia Commons photos (4:3 crops, webp, embedded base64):
  - `12-photo-lamprey`: Sea lamprey eating lake trout (USFWS), public domain. https://commons.wikimedia.org/wiki/File:Sea_lamprey_eating_lake_trout_ca._2022.png
  - `12-photo-zebra`: Zebra mussels collected from Huron River (NOAA GLERL), CC BY-SA 2.0. https://commons.wikimedia.org/wiki/File:Zebra_mussels_collected_from_Huron_River_(14721841699).jpg
  - `12-photo-goby`: Round goby 01 (Eric Engbretson, USFWS), public domain. https://commons.wikimedia.org/wiki/File:Round_goby_01.jpg
  Credits are in the figure captions. Added .photo/.pgrid CSS.

## Unit 13 Energy resources and human impact
- CO2 chart and "More CO2, more warming" chart: tick labels now carry units (e.g. "400 ppm", "3 °C", "500 ppm"), axis titles "CO₂ in parts per million (ppm)", "Year", "Eventual warming (°C)"; larger font (15), wider left margin and taller viewBox so nothing is clipped (checked in a headless Chrome screenshot). Shared `line()` gained optional `fs`, `xf`, `yf` (other charts unchanged).
- Savings vs paycheck analogy: SVG image removed (text kept).
- Hero image: replaced the SVG with diffusion illustration `13-hero` (turbine, solar panels, smokestack, house, power lines; same composition).

## Unit 14 Where we're going
- Interpretation: Ryan's "concept one" did not match the literal Concept 1 (the ride, whose text and animation do match). The "everything is attracted to everything" text with an unrelated picture is Concept 2 (What are we orbiting?), so I reworked that. "Concept three" taken literally = the corkscrew picture; removed entirely (section, nav entry, CSS, canvas JS, quiz question 3, quiz renumbered, later concepts renumbered 3 and 4). If he meant a different concept, restore from git.
- Concept 2: replaced the balance-scale canvas with an interactive top-down sketch (toggle "Black hole only" vs "Everything inside our orbit") showing the pulls on the Sun; intro text now states that gravity pulls between anything with mass. Marked not to scale; numbers kept (4.3 million vs about 100 billion Suns, about 25,000:1).

## Unit 15 Data and statistics
- Seesaw/line analogy rebuilt as an interactive: blocks on a 0-20 number line, a movable triangle fulcrum, beam tilts toward the heavier side and goes level at the mean; buttons Start 2,3,3,4 / Add the 18 / Remove last / Clear / Move triangle to the mean; tap the line to add blocks; live readout (sum, count, mean). Three numbered steps. Median shown separately as a sorted row with the middle value highlighted (replaces the stick-person line).
- Tasting a soup: SVG replaced by two diffusion images `15-soup-unstirred`, `15-soup-stirred` (cartoon, no text) with HTML captions.

## Not done / notes
- Added goby only as a photo, not as a table row. Pages kept CRLF; HTML balance checked (no unclosed tags). dist and review-site untouched; nothing committed.
