# How to apply a unit's review report

You are applying one unit's reviewer report to the real page. Ryan approved doing this ("make recommendations and then you can enact them"). Work only on your unit's files so other agents working on other units do not collide.

## Files

- Report to apply: `C:\ai\repos\science-biotech\review\science-review\reports\<slug>.md`
- Ryan's raw feedback (the authority when the report guesses wrong): `...\feedback\<slug>.txt`
- Standing orders: `...\STANDING-ORDERS.md`
- **Page source (edit this):** `C:\ai\repos\science-biotech\k-5\<slug>.html`. A hand-authored single file. Do NOT edit `dist\` or `review-site\`.
- Figure list for the page: `C:\ai\repos\science-biotech\k5-images\units\<slug>.json` (see `k5-images\inject-images.mjs` header). Figures are `kind: image` (raster, `k5-images\webp\<file>`), `svg` (`k5-images\svg\`) or `html` (small interactive widget, `k5-images\html\w-*.html`). `after` is `hero`, a section id (`s1`, `s2`, `kit`...), and the injector inserts the figure after that section's idea line.
- Inline SVGs and other figures that are written directly in the page `.html` are edited in place there.

## Decisions already made (do not ask; do not block)

- Where the report's "Questions for Ryan" has a recommended default, take it. Record each such decision in the card note (below).
- Images: every raster/diagram image is made with diffusion (ComfyUI), **no text inside the image** (labels, titles, numbers are HTML text on the page, never drawn by the model). Exact-number graphs stay real charts (SVG) with a diffusion picture beside them.
- Leave games alone unless the feedback names them.
- Metric alongside imperial, Michigan examples, bulleted lists instead of tables, no standards codes, no empty blocks, consistent capitalization/punctuation, plain-word lead-up before terms.
- Remove review-copy leftovers (the "REVIEW COPY" banner, "CHECK:" lines) only if they are in the source; they are normally added by `review\make-review.mjs` into `review-site\` and are not in `k-5\`. If they are not in the source, ignore that report item.
- Facts you are unsure of: do not assert. Say "verify" in the card note and use safer wording on the page.
- Never push anything. Do not run `node build.mjs`, `inject-images.mjs`, or `make-review.mjs`: the lead runs those once for everyone. Do check your HTML is well formed by eye and with a quick script (balanced tags in the parts you touched).

## Generating images

ComfyUI is running at http://127.0.0.1:8188 (z-image-turbo). Use the helper:

```
python -I C:\ai\repos\science-biotech\review\science-review\tools\comfy_gen.py jobs.json
```

`jobs.json` is a list of `{"id": "<unit>-<name>", "unit": "<slug>", "where": "Concept 2, Diagram", "prompt": "...", "negative": "...", "w": 1024, "h": 576, "seed": 123}`. It prepends the house style (flat vector, muted palette, no text), writes `k5-images\webp\<id>.webp` (800 px wide) and logs to `...\science-review\images.json`. Start from the report's "Image prompts" but sharpen them: describe species/colour explicitly (for example "a brown deer with a white tail", not "white-tailed", which makes a white deer). **Look at every image you make** (convert to PNG with PIL into your scratch folder, then Read it) and regenerate with a new seed if it is wrong (extra limbs, wrong animal, text, scary, wrong proportions). Cap at 3 tries per image; keep the best and say so in the note. One GPU is shared with other agents: submit jobs one at a time, no parallel runs.

Wire each image in by adding a figure to the unit JSON (`kind: image`, `file`, `alt` describing what it shows, `caption`) or, where the report replaces an inline SVG in the page, replace that block in the `.html` with an `<img>`-free reference by removing the SVG and adding the figure through the JSON at the right `after` section. Keep alt text accurate.

## Green call-out ("same green way as before")

For every change you make, add one entry to `C:\ai\repos\science-biotech\review\science-review\updates\<slug>.json`:

```
{ "files": ["k-5/<slug>.html"], "pat": "<regex matching a unique snippet of the NEW text or figure on the built page>", "kind": "UPDATED", "note": "what changed in a few words" }
```

(Same shape as `review\flags.json`. `pat` is a JS regex against the built HTML; pick text that will exist on the page after your change, not inside a tag. For an image, use its caption text.) The review builder highlights each one in neon green with an UPDATED badge.

## Kanzo card

Do not touch Kanzo. Instead write `...\science-review\notes\<slug>.md`: a short list of what you changed, which defaults you took for the report's questions, which images you made (ids), and anything still needing Ryan (facts to verify, tries that failed). The lead puts it on the card.

## Finish

Reply with only: the notes path, and a one-line count of changes and images.

## Lessons from the pilot (unit 4-4): read before starting

- Pages hold two kinds of embedded blocks: `k5images` blocks (rewritten by the injector from the unit JSON, never hand-edit between the `<!--k5images-start-->` markers) and `k5b` blocks (inline SVGs and tables, edited by hand in the page).
- The `[SVG IMAGE]` / `[IMG]` markers in `page-text` are review-site chrome, and some blocks (for example Check yourself questions) are built by script, so a report may wrongly call them empty. Verify each report item against the real source before acting; say in the notes when a report item was wrong.
- The unit JSON `after` can only place a figure after a section's idea line. For images inside an aid block (Diagram, Real world, Analogy), embed a base64 `<img>` directly in the page so lead-up, picture and caption stay together.
- Labels over images: the 4-4 page has a small `<style id="u44css">` overlay-chip pattern. Reuse it (rename the id for your unit) instead of asking the model to draw text.
- Pages use CRLF line endings; keep them.
- `comfy_gen.py` adds "friendly faces" to every prompt; pass `"raw": true` with your own style text when you do not want that.
- Check each image for stray hands, extra limbs and wrong species before accepting it; 3 tries max.
- The unit JSON may also list `html` widgets (`k5images\html\w-*.html`). New widgets go there and are referenced from the JSON.
- Report lines contradicting each other: follow Ryan's raw feedback, then the question default, and note it.
