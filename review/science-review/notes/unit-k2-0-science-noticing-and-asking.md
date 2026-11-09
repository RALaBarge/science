# Unit K2.0 Science Noticing and Asking: applied

## What changed (page: k-5/unit-k2-0-science-noticing-and-asking.html)

- Game "Notice Walk Detective" removed (page section and "In this lesson" entry). Its config was moved out of `k5-activities/units/` to `k5-activities/unit-k2-0-notice-walk.removed.json.txt` so `inject.mjs` does not put it back.
- New "By the end, you can" bulleted list (7 items) plus a "For tutors:" call-out (guess before the walk, compare after, "I don't know" is fine). Added to the TOC.
- Concept 1 Data: drawn square tally replaced by one big diffusion picture of the tray (`k20-tray`, pinecone and bark shown), plain-word lead-up for tally/smooth/bumpy, bulleted Smooth (4) / Bumpy (5) list, caption "Sample class tally; yours will be different."
- Concept 1 Try it: Petoskey stone suggestion added.
- Concept 2 Try it: question cards now listed as two bulleted piles ("Can we test it?" / "Cannot test it yet:"). Widget options relabelled "Cannot test it yet" to match.
- Concept 2 Real world: drawn weather watcher replaced by diffusion picture (`k20-sky`), Michigan caption.
- Concept 3: "Evidence" defined in the analogy aid; "fluke" -> "lucky result"; Data block: stage direction deleted, picture/bar graph explained, new dot picture graph (HTML text), "soaked up" -> "held", "These are sample results. Yours may be different." added. Diagram: stage direction replaced by kid-facing line, "lip" defined, drawn boxes replaced by four diffusion pictures with HTML labels (Notice, Ask, Problem, Idea; `k20-step1` to `k20-step4`).
- Hands-on: kid-facing intro, "This addresses K-2-ETS1-1" removed, materials and steps are bulleted lists (times kept), backup-data note no longer mentions "the standard".
- Words to know: capitalised terms, "Compare" definition clearer.
- Tutor notes: summary now "misconceptions and pacing"; standards block, ETS1-2/3 line and "Design choice" line removed (design choice replaced by the methods-unit sentence); Connections are bullets with 3.1/3.2/"6 Unit 1" numbers dropped; "content PEs" reworded.
- Footer: standards sentence removed. Tag list in the hero given spaces.
- Edited blocks now carry `k5b` markers (they were `k5a` blocks written by `k5-images/a/k-c.mjs`; do not rerun that builder for this unit or the old drawings return).

## Defaults taken

1. Q1 top image: hero picture is already a diffusion image (`k20-hero`), kept; prompt 5 not made.
2. Q2 bar graph: kept as a real SVG chart with exact numbers beside the existing towel photo (`k20-towels`); no new towel picture. Added a dot picture graph in the Data block.
3. Q3 Design choice: deleted, replaced by one sentence in Limits and cautions.
4. Q4 numbers in Builds toward: dropped, unit names kept.
5. Q5 goals list and tutor call-out: kept as proposed.
6. Q6 Unit 0 text: kept (Unit 0's own lede says every unit uses its steps).
7. Q7 Check yourself: no change, see below.
8. Q8 cups: removed from materials (no step used them).
9. Q9 Petoskey stone: added to materials text, not in the tally. Verify it is the state stone and from northern Michigan beaches.
10. Q10 Michigan: stone, snow card, Michigan backyard caption. Enough.
11. Q11 steps: bullets.
12. Q12 Try it heading: Hands-on keeps "Try it at home or in class"; TOC entry now matches.

## Report items that were wrong or skipped

- Item 1 (review badges): not in source, ignored.
- Item 10: the cards are shown, in the widget, so the lines were not empty; added the card list anyway.
- Item 19: Check yourself already has 4 working questions in the page script and a live score, so no change.
- Item 16: "Try it" and "What you need" are already separate (tag and h3); no change.
- Item 14: see default 2.

## Images (ids)

`k20-tray` (3 tries, 3rd kept), `k20-sky` (1), `k20-step1`, `k20-step2`, `k20-step3`, `k20-step4` (1 each). Embedded as base64 in the page (not in the unit JSON). Step 1 has the child holding a marker while others roll; acceptable but could be regenerated.

## Needs Ryan

- Verify Petoskey stone fact.
- `unit-k2-0` JSON in `k5-images/units` is unchanged (hero, towel photo, bar chart).
