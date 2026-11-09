# Unit 1-A Sound and Light: applied

Page: `k-5/unit-1-a-sound-and-light.html`. Also touched: `k5-images/units/unit-1-a-sound-and-light.json`, `k5-images/html/w-1a-beam.html`, `k5-images/svg/d-1a-beam.svg`, `k5-images/diagram-defs.mjs`. Green call-outs: `updates/unit-1-a-sound-and-light.json` (34 entries; three patterns, the drum caption, the Concept 2 light-path caption and the beam-diagram caption, only exist after the injector runs).

## What changed

- Concept 1, 2 and 4 "Try it" blocks (Station 1, 2, 4 duplicates) are now one pointer line: "Try it: Station N, at the bottom of this page." Concept 3's Try it is kept (short, unique quote).
- The four stations are filled out as numbered steps with times, in the bottom section, now titled "Try it: four stations". "What you need" is a bulleted list. Station 4 holds the moved "Guess first" step. "Rotate through four stations, about 10 minutes each." kept above them.
- Signal Device Challenge: "This earns 1-PS4-4..." sentence deleted. Backup data: heading reworded ("No time, or a material fails?"), two separate bullets, "the standard expects" reworded. "Near you" block deleted (merged into the lighthouse Real world).
- Concept 1: plain-word lead-up for "vibrating" and kid steps for the ruler Diagram. Data log and Concept 2 tally and Concept 4 signal test are bulleted lists with their examples. Drum picture caption fixed (JSON).
- Concept 2: empty Diagram block removed; new picture (`1a-light-path`) sits under the big idea with the report's caption (JSON `after: s2`). Michigan winter lamp text.
- Concept 3: lead-up for "beam" added to the idea line (the injector can only place figures after it). Data table replaced by the four-line bulleted list; the extra Data SVG deleted; empty foil Diagram block deleted. Michigan window text. Mirror changed to foil everywhere (diagram, beam widget, page copy of the widget).
- Concept 4: Analogy rewritten with bold blink/knock/signal/message/partner/decodes and a lead-up for signal, pattern, decode. Lighthouse text replaced with the safer wording (no "send messages", no "dangerous shores").
- Top: teacher line replaced by "New this year: you will test how things shake, what light does, and how to send a message." TOC label updated.
- Standards: tutor-notes standards block deleted, footer codes deleted, "standards" removed from the Tutor notes summary. Removed PE codes in case a teacher file wants them: 1-PS4-1 (vibrating materials make sound; sound makes materials vibrate), 1-PS4-2 (objects seen only when illuminated), 1-PS4-3 (effect of materials in a light beam), 1-PS4-4 (design a device that uses light or sound to communicate over a distance). Not compared with the MDE document.
- Words to know: bulleted "term: definition." with periods. Connections: two bullets, literal `*(optional)*` asterisks removed.
- New small `<style id="u1acss">` for list spacing in blocks.

## Defaults taken

1. Concept 2 "roll together": delete Diagram, one picture under the big idea.
2. Stack diagram: not available to me; used foil, kept the drawn four-material diagram (see below).
3. Lighthouse: safer wording, no specific light looked up.
4. Standards codes: removed from the kid page, not moved anywhere.
5. Check yourself: left as is (see below).
6. "You did this before" line: replaced with a kid line.
8. Hero and drum: left (see below).
9. Concept 4 pointer line only, no short Try it. Item 23 (a Concept 4 Diagram): no default, not added.
11. Unit names in Connections: left as they were.

## Report items that were wrong or skipped

- Item 13 Check yourself: not empty. The four questions are built by the page script (rubber band vibrating, mystery box, cardboard, flashlight pattern). No change; the report's four were not added.
- Item 19: "Look for the tags Analogy Diagram..." is the page's tag legend (same on other units), not an editor leftover. Kept. The REVIEW COPY and CHECK lines are not in the source.
- Item 12: the hero and drum picture are already diffusion webp files (`1a-hero`, `1a-drum`), so IMG-1 and IMG-5 were not made. The drum alt said "Photo"; now "Picture".
- Item 6/15: the Concept 1 and 4 Data pictures are decorative; the real data are the HTML lists.
- Item 16: the child line "A Michigan lighthouse flashes a pattern." was not added (claim unverified).
- Item 21 optional foghorn example: skipped.
- Item 22: "reflect" lead-up not added (word not used in kid text; it is only in Words to know).

## Images made (webp in k5-images/webp)

`1a-ruler`, `1a-hum`, `1a-log`, `1a-seen`, `1a-lamp`, `1a-window`, `1a-lighthouse`, `1a-signals` (1 try each), `1a-light-path` (2 tries; the first had the beam missing the toy). Eight are wired into the page as embedded images replacing the drawn SVGs; `1a-light-path` is wired through the unit JSON.

Minor: a small smile appears on the cup (`1a-log`), the lamp (`1a-lamp`) and the lighthouse lantern; the flashlight in `1a-signals` looks like a megaphone.

## Still needing Ryan

- `1a-beam4` (four-materials picture, IMG-9): failed after 3 tries (beams drawn as the materials, flashlights as megaphones, no wax paper). Not used. The existing drawn diagram stays, with "Foil" instead of "Mirror", so standing order 1 is not met for this one. File `1a-beam4.webp` is unused. If Ryan has the diagram from his stack, use that.
- Verify: lighthouses flash distinct patterns (U.S. Coast Guard Light List); "Unit 1: Light & Matter" and "Unit 3: Forces, Motion & Energy" in Connections; standards codes against MDE (removed from the page).
- Run the injector so `1a-light-path`, the drum caption and the restored beam diagram land (the old beam block was removed from the page and comes back from the JSON).
