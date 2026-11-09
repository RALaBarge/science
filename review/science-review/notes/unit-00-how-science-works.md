# Unit 0 How Science Works: applied

## What changed (page: k-5/unit-00-how-science-works.html)

- Lab safety: taste and smell are two table rows (smell row has the waft instruction). Drawn SVG replaced by a six-panel diffusion picture (`00-lab`), caption "The six rules in the table", text version lists six rules.
- Concept 5: new "Back of the envelope: rough conversions" box after the Data toolbox. Units bullet and paper-plane example carry imperial. Metric-lengths block has a plain-word lead-up for log scale and prefixes plus an imperial list for all seven bars. CER example labeled "Example numbers" with inches. Correlation chart: the "0 to 100" note is now in plain words before the chart. Graph quiz got a Lake Michigan water-level item (now 7).
- Deep time: whole year is now the default view of Step 2, which shows at load with a "Showing: January 1 to December 31 (whole cosmic year)" line. Zoom levels are Whole year, July to December, December, December 31, last hour, minute, 15 s. Birthday only moves a marker and never changes the view. Skip button reads "Skip (show the whole year)". Big Bang defined before the picker. Birthday result begins "On [date], the nearest milestone is ..." and adds "Life had not started yet." before the first life milestone (September 21 on this calendar). Step 1 titled optional. Month names in text are full (year bar, event lists, bars). Zoom picture added (`00-zoom`).
- Deep time other: Petoskey stone Real world card (about 350 million years, about December 22). "Demographers" defined. 99% data claim softened to "for the distant past the data are very rough". "The other 93 are people who have died ...". Imperial added to the line of people. Year bar SVG kept as a code chart with full month names.
- Concept 1: timeline has the nine-date text list and a diffusion picture (`00-timeline`); dots/chips stay interactive. Stick Try it has instructions, the Syene/Alexandria reference, picture (`00-stick`), prefilled slider value. Two-model drawn SVG replaced by diffusion picture (`00-centers`) with text version. Venus: "phase" explained, instruction, picture (`00-venus`), chips reordered Earth-centered first. Moons: instruction, picture (`00-jupiter`). Evidence is a bulleted list.
- Concept 2: bean investigation picture (`00-bean`). Not-a-straight-line: drawn three-tests SVG removed, replaced by a bulleted list plus picture (`00-detour`); the three options are a bulleted list. Rømer speeds in miles per second. Penicillin "has saved millions of lives". Semmelweis "chlorinated lime" (also in the bar label).
- Concept 3: "10 °C (50 °F)". Build a hypothesis has an instruction and the sentence frame. Hypothesis/Law/Theory is a bulleted list. Testable quiz got a Lake Michigan item (now 7).
- Concept 4: plain-word variable definitions before the cookie test (idea line reworded to plain words first). Cookie SVG replaced by a picture (`00-cookie`) and a list with cups and mL. Fair vs. unfair: instruction, picture (`00-fair`), the "Yes. Only light changed..." feedback, imperial on mL and bar labels. Why we repeat: instruction, imperial on 20 cm and trial values.
- Tutor notes: birthday optional with whole-year default; hallway strip "1 meter of paper (about 3 feet)".
- Footer: standards sentence removed, audience now "Built for K-5 tutoring", "Overlap alert" sentence deleted.
- Words to know: phase, log scale added. Apostrophes straightened (3 curly ones). Slider values prefilled in the HTML.
- Added `<style id="u00css">` (figure styling) before the hero; the page had no figure CSS of its own. Edited figures use `k5b` markers (`b00-*`); the old `k5a` blocks for centers, lab safety and cosmic year were converted so `k5-images/a/u0.mjs` would overwrite them if re-run: do not re-run it for this unit.
- Games untouched.

## Defaults taken for the report's questions

1. Unlabeled SVGs: there are none. The only SVG at the top is the labeled Question-Idea-Test-Result-Claim loop; kept (it is text-labeled flow with loop arrows). No IP-1 or IP-2 made.
2. Interactive widgets: controls kept as code, diffusion picture added beside (IP-3, 4, 6, 7, 8, 11, 13).
3. Data graphs kept as code charts (correlation, year bar, average simulation, people grid, fair-test bars).
4. Imperial in parentheses everywhere, plus the box.
5. Lab rules: two rows.
6. Birthday privacy: checked, the page code has no storage, network or cookie use for the birthday; the claim is true.
7. Audience line: K-5.
8. "Seven steps at a glance" table: no default given; left as a table (it has four columns of attributes).
9. Quiz items: not missing, they are built by script (6 and 6, now 7 and 7). The report was wrong.
10. Facts: see below.
11. Michigan shadow-stick version: no default; not done.
12. CHECK 2 / banner: not in the source, nothing to remove.
13. Half-year zoom default: July 1 to December 31 for "Zoom in a level", whole year as default.
14. Simulation numbers: left as the page says (teaching simulation).

## Report items that were wrong or not needed

- Item 1 and 53: no review banner or CHECK badges in the source.
- Item 5: sliders were filled by script at load (the blank was in the text dump); now also prefilled in the HTML. "Night: 1" example not followed (slider starts at night 0).
- Item 7: a result text already existed; the new lead line was added to it.
- Items 11, 12: no such SVGs. Item 13: timeline already had chips and a card; list and picture added. Item 20: the seven steps are already in the Next step card (script); kept, no rewrite. Item 25: builder already existed. Items 26, 35: quiz items already exist. Item 32: bars existed; imperial list added with the page's own values (3 mm ant, not 5 mm).
- Item 38: the report says December 21; the page's own calendar math gives December 22 for 350 million years ago.
- Item 47: sentence deleted. Item 51 "keep one style in glossary and tables": no change (glossary terms lowercase on purpose); axis tick labels (Jan, Feb, "Dec 31" style short forms in chart axes) left short.
- Item 55: nothing to change.

## Images made (all first try unless noted)

`00-timeline`, `00-stick`, `00-venus`, `00-jupiter`, `00-bean`, `00-detour`, `00-cookie`, `00-fair`, `00-lab` (all accepted first try), `00-centers` and `00-zoom` (second try; first versions had no Sun on the left, and a comet-like streak). `00-venus` is a crescent plus two near-round dots, not three precise phases.

## Still needing Ryan

- Verify: Petoskey stone age (about 350 million years) and the December 22 calendar date; Mackinac Bridge about 5 miles / 8 km; softened demographic claim against the Population Reference Bureau; Aristarchus about 270 BCE wording; Ann Arbor to Detroit 60 km (page's number, I added 37 miles).
- The "Not a straight line" picture is a general bench scene, not the three-test story (the story is in the list).
- Michigan version of the shadow stick (question 11) not done.
