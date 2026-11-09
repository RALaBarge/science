# Unit 5.1 Matter, Mixtures, and Changes: applied

## What changed (page: k-5/unit-5-1-matter-mixtures-and-changes.html, plus k5-images unit JSON and g-51-mass.svg)

- Intro and Concept 1 idea line: plain definitions of matter, mass, particles.
- Hero: new diffusion picture (`51-hero-b`), caption now says it "spreads out" and is "still in the water, in tiny pieces too small to see".
- Concept 1: LEGO analogy picture replaced (`51-lego`), "model" explained first, caption fixed. Particle boxes picture replaced (`51-boxes`) with a plain lead-up for solid/liquid/gas and sentence-case caption. Air has mass picture replaced (`51-balloons`), caption capitalized. Air takes space block tidied (bullet list, description line removed).
- Concept 2: Three cups picture replaced (`51-cups`), Michigan breath-cloud line added. Safe warming now has materials, 4 steps, what you should see, why it matters. Michigan snow picture replaced (`51-snow`).
- Concept 3: idea line in plain words. Property sort: bulleted materials, steel paper clip, numbered tests, no claim the bead sinks. Property table: eraser and bead "Sinks?" cells say "Test it." Recycling picture replaced (`51-recycle`), Michigan deposit sentence added.
- Concept 4: Mixtures picture replaced (`51-dissolve`, via JSON): clear water after stirring, sand settled, sand on filter, salt crystals in dish. New caption and "evaporate" explained. Trail mix kept as is (description made a sentence). Sand and salt now has a full procedure. Before/after table line is "Draw what you see in each row."
- Concept 5: heading "no matter is lost" (TOC too). Plain definitions of physical and chemical change in the idea block. Mass graph kept as a real SVG chart, relabeled "Sample data (not measured)", ounces added to caption. Physical vs. chemical picture replaced (`51-phys`). Sealed bag: bulleted needs, metric. Balance stays level: fill-in table and sample, "kitchen scale (or a hanger balance)". Rust picture replaced (`51-rust`), road-salt line added. Bread dough and yogurt: new picture (`51-bread`), kid-level text names carbon dioxide and new substances.
- Hands-on: new pictures (`51-sep-b`, `51-lab-b`), Criteria and Constraints as bullets, water limit "1/2 cup, or 120 mL". What you need as bullets (sugar, rubber bands, paper clips removed; added scale, safety glasses, ice cube and tray, iron filings). Safety as bullets with amounts matching the Try it, "stand back, do not hold the bag", soil removed. What you do: bulleted. No-time block: real table (Test / Before / After) with grams and ounces, "Sample data (not measured)", "STRONG" and reviewer wording gone.
- Words to know: added mass, model, evaporate, physical change, chemical change; removed unused "solution".
- Tutor notes: Connections as bullets, standards block replaced by a plain sentence, summary no longer says "standards", "partial path" wording removed. Footer standards codes removed.
- Captions and punctuation: aid description lines that only described a picture were removed or made sentences; serial commas; "sand and salt"; "and" instead of "&".
- Games untouched.

## Defaults taken for the report's questions

1. Air has mass: kept the idea, replaced only the picture.
2. Trail mix: kept as is, no image (Prompt 17 not made).
3. Concept 4 picture: Prompt 8 (clear water after stirring).
4. "[SVG IMAGE]" at top: review-site chrome, not in the source. Nothing changed.
5. Mass graph: kept as a real SVG chart with the Sample data label.
6. Check yourself: no change. The four questions are built by the page script; the report was wrong.
7. Bread dough and yogurt: kept the report's kid-level text. Grade-level check still open (see below).
8. Standards codes: removed from kid text, tutor notes, and footer. Not compared with the MDE document.
9. Baking soda: 2 teaspoons (about 10 mL); vinegar 1/4 cup (about 60 mL).
10. Michigan bottle deposit: kept as "many soda and beer bottles and cans have a 10-cent deposit". Verify.
11. Sugar, rubber bands, paper clips: removed from the kit list (the report's recommendation).
12. Prompts 14 to 20 (placeholders with no image tag): deleted the descriptions, made no images.
13. "Watch 20 particles...": the report was wrong. The page has an interactive widget (`w-51-particles`), so it stays. Caption only got the serial comma.
14. Sample data: labeled "Sample data (not measured)".
15. Play game: untouched.

## Report items that did not apply or were changed

- Item 1 (review banners, CHECK lines, "(jump)" links): none are in the source. Ignored.
- Item 8: the report said there is no simulation. There is one. Kept the widget.
- Item 27 rust caption "A rusty bike.": the picture is a pair of nails, so the caption describes the nails and the road-salt line.
- Item 32: kept a short "Child reads" line and the graph instruction.
- Item 24, 30: "A splash of vinegar" replaced by the Try it's amounts.
- Item 38 captions for aids without a picture: the description lines were removed (default for Question 12) rather than capitalized.
- The "Concept 4 widget" `w-51-salt` still shows its own zoom view; not touched beyond its caption.

## Images made

`51-hero-b`, `51-lego`, `51-boxes`, `51-balloons`, `51-cups`, `51-snow`, `51-recycle`, `51-dissolve`, `51-phys`, `51-rust`, `51-bread`, `51-sep-b`, `51-lab-b` (files in k5-images/webp, logged in images.json).
Tries: `51-balloons` used 3 (first two drew two inflated balloons or the wrong tilt; third is right). `51-dissolve`, `51-phys`, `51-lego` 2 tries each (the retry replaced the first file). The others 1 try.
Imperfect: `51-phys` right panel shows a bag with powder, spoon, and cup, but the bag is not clearly puffed with gas; `51-cups` has a thought-bubble-looking cloud and only part of a kettle; `51-hero-b` includes a spoon and a second sugar cube. The sealed-bag baking soda picture shows a spoon inside the bag (not exactly the procedure).

## Still needing Ryan

- Verify: Michigan 10-cent deposit; yeast "tiny living thing ... carbon dioxide" and yogurt text for grade 5 (science lead check); 82 g and 45 g are sample numbers, not measured; "about 3 ounces" and "about 1 1/2 ounces" conversions.
- Compare the removed standards 5-PS1-1 to 5-PS1-4 with the MDE document before any teacher copy goes out. Removed text: 5-PS1-1 "Develop a model that matter is made of particles too small to see." 5-PS1-2 "Measure and graph quantities to show that total weight is conserved during heating, cooling, or mixing." 5-PS1-3 "Identify materials by properties." 5-PS1-4 "Investigate whether mixing substances makes new substances."
- Decide whether to add pictures for the Try its (Prompts 14 to 20) later.
- The lead runs inject-images.mjs and build.mjs; nothing was built here.
