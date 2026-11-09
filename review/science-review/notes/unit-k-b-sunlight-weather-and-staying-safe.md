# Unit K-B Sunlight, Weather, and Staying Safe: applied

Page: `k-5/unit-k-b-sunlight-weather-and-staying-safe.html`. Figure list: `k5-images/units/unit-k-b-sunlight-weather-and-staying-safe.json`.

## What changed

- Concept 1: analogy line and caption reworded (safety line added), new sun-and-lamp picture. Data block points to the game, has a bulleted example and "Example, not measured numbers", and a new grandmother-and-child picture. Try it: thermometer explained, "What you need" list, safety line. Real world: Michigan hot-road example, new picture.
- Concept 2: lead-up for shade and melt. New cubes Diagram picture. Try it: "Wait 10 minutes, then look" and a "What you need" list. Data: example 5 and 12 drops. Real world: wording fixed, Lake Michigan, new picture.
- Concept 3: Data written out (8, 6, 4, 2, total 20, labeled example); quote now says "In this 20-day sample". Weather-symbols picture replaced, the four names are page text under it. Real world example added. Lead-up for pattern, list for What you need. New calendar picture sits beside the existing bar graph.
- Concept 4: lead-ups for forecast, thunderstorm, tornado, blizzard. Try it: What you need list, tornado wording "a basement or an inside room with no windows". Data: questions as a bulleted list, metric plus imperial forecast, F-to-C trick, "ask a grown-up to print a real forecast", new picture. Real world: heading "watch or warning", watch versus warning in plain words, two pictures with their own captions.
- Hands-on: image replaced (shade over the cube, control, toy beach helper), What you need and Look for are bulleted lists, flashlight line removed, backup-data standards sentences removed.
- Standards: footer line deleted, "Michigan Science Standards this unit earns" block deleted from the tutor notes, codes removed from the cautions, tutor-notes summary no longer says "standards". Removed text is at the end of this note. "&" changed to "and" in Connections.
- Paper widget caption now says "compare the thermometers".

## Defaults taken

1. Data charts: kept the two bar graphs as real SVG charts (the brief says exact-number graphs stay charts). Added a diffusion calendar picture (I7) beside the 20-day graph. I13 (melt trays) not made: the new Hands-on picture and the cubes Diagram already show the same thing beside the melt graph.
2. "We do that in the game": applied to Concept 1 Data only.
3. Concept 1 Data cartoon: new picture (I3), not the hero.
4. Hands-on image: shade over the cube plus beach helper, as the report guessed.
5. Watch/warning wording as in the report.
6. Lists: What you need, Look for, Concept 3 and 4 data and Try it lists. The report's small table in Concept 1 Data is a bulleted list (no tables).
7. Tutor-notes standards: removed entirely (kid-facing page). This also settles DECIDE 1 (K-ESS2-1): the condition survives as a plain-word caution.
8. Check yourself: no change.
9. Flashlight removed. Fall sample labeled as example data. MDE wording not checked (codes gone).

## Report items that were wrong or skipped

- Item 23: Check yourself already has 4 working questions built by script; not empty.
- Items 27, 28, I1: the top picture is already the diffusion grandmother-and-umbrella image (`kb-hero`) and the snowman is diffusion too. Kept both.
- Item 24 review badges: not in the source.
- Item 31, game: untouched.
- Quote style: page already uses curly quotes.

## Images (in `k5-images/webp`)

kb-sun-lamp, kb-warm-kids (2 tries), kb-road (2 tries; heat lines are faint), kb-shade-cubes (2 tries), kb-beach-shade, kb-calendar, kb-weather-row, kb-forecast (2 tries), kb-watch, kb-warning, kb-shade-test (replaces `kb-shade` in the JSON; the calendar is a new JSON figure `kb-calendar`).

The others are base64 `<img>` figures inside `<!--k5b-start/end-->` blocks in the page, replacing the old `k5a` SVG blocks, so `k5-images/a/run.mjs` will not bring the SVGs back (do not run it for this unit). CSS in `<style id="kbcss">`.

## Needs Ryan

- Verify against weather.gov: winter storm watch and warning wording, tornado shelter wording.
- F-to-C trick (subtract 30, halve) is rough: 68 F gives 19 C, page says 20 C. Check it reads as "about".
- Forecast, tally and melt numbers are labeled as example data.
- Standards lines are gone from the page; a teacher file needs them if wanted.

## Removed standards text

See `C:\Users\ryana\AppData\Local\Temp\claude\d10b0b31f374240f\f0c884d0-8481-4998-99a4-be711074b220\scratchpad\kb\rs.txt` is scratch only; the text was:

K-PS3-1: Make observations to determine the effect of sunlight on Earth's surface. K-PS3-2: Use tools and materials to design and build a structure that reduces the warming effect of sunlight. K-ESS2-1: Use and share local weather observations to describe patterns. (Earned by a weather calendar kept over several weeks; the 20-day sample alone does not earn it.) K-ESS3-2: Ask questions and obtain information about weather forecasting and severe-weather preparation. Footer: "Michigan Science Standards (performance expectations earned by this unit): K-PS3-1, K-PS3-2, K-ESS2-1, K-ESS3-2."
