# Standing orders: apply to every K-5 unit page

Source: Ryan's `finalreview.txt` (Desktop). These apply to the whole K-5 corpus, not just the unit that mentions them.

1. **Images.** Every image on every page is made with diffusion (ComfyUI), not hand-drawn SVG. It need not be photoreal. Exceptions Ryan named: pages where he said to keep specific images (for example the two large images in Plants, Animals, and Habitats concept 2).
2. **Empty blocks.** Every Data, Diagram, Try it, Real world, Analogy, and triad block must have content. An empty block, or one that only asks for an image, is a defect: say what should fill it.
3. **Lead-up before images and terms.** Readers may be kindergartners who have never heard the word (for example "wave", "amplitude"). Introduce a term in plain words before an image or diagram uses it.
4. **Triad sections that ask for a list of items.** Format as a bulleted list (not a table, not a run-on paragraph). A short story is the only alternative.
5. **Consistent capitalization and punctuation** across all blocks on a page (labels, bullets, headings).
6. **Standards codes.** Remove every "Addresses K-2-ETS1-1" style line and any NGSS/standards code text from the kid-facing pages.
7. **Metric alongside imperial** wherever a unit appears, with back-of-the-envelope conversions kids can remember.
8. **Michigan context** first: use Michigan examples, Great Lakes, local places (Port Austin, Petoskey stones, the Upper Peninsula copper) where the unit allows.
9. **Games.** Leave a game alone unless the feedback names it. Where the feedback says a game is fine, report no change.
10. **Do not invent.** If a fact is uncertain (for example whether lighthouses signal in Morse code), say so and recommend checking, instead of asserting.

## Output conventions for reviewer agents

- Write one Markdown file per unit. Sections: `## Changes`, `## Image prompts (ComfyUI)`, `## Questions for Ryan`.
- `## Changes`: a numbered list. Each item names the page section (for example "Concept 2, Data block"), what is wrong now, and the exact recommended change or replacement text.
- `## Image prompts (ComfyUI)`: one entry per image Ryan asked for or that standing order 1 requires. Each has: where it goes, a one-paragraph positive prompt, a short negative prompt, and the size (default 1024x768).
- Never edit the page. Recommend only.
