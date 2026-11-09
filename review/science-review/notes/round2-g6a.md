# Round 2 - g6a (6th: units 01, 02, 03)

Method: widened SVG viewBoxes (no CSS/JS logic changes), rendered with headless Chromium (playwright) at 1100 px and 390 px, checked screenshots. CRLF kept; svg/div balance verified.

## unit-02-thermal-energy.html
- rodChart, coolSvg, heatSvg, and the staircase graph: viewBox padded ~10% each side (e.g. 0 0 640 260 -> -40 -28 760 316). Fixes the cut-off line labels (Aluminum/Copper/Steel/Glass/Wood) and the edge-touching "gas warms" label.

## unit-01-light-and-matter.html
- Padded viewBox (~8-10%): pinhole box, red apple/marbles, prism (fixes cut "violet"), spectrum strip spSvg, mystery-star msSvg, sprinkler (JS template), matSvg, shadowSvg, shadowChart, tempSvg.

## unit-03-forces-motion-and-energy.html
- Duplicate readout was the coaster ("Ride the coaster"): the moving car had a "N m high" label under it and the readout under the Ride it button repeated "Height N m". Removed the in-SVG label; the height and speed now appear once in the readout.
- Also widened rcSvg to 510 so the "start" label is no longer clipped. Ride tested in browser, no JS errors.

Not done: none. No images generated.
