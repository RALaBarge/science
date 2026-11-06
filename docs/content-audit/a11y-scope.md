# Accessibility scope: screen-reader / low-vision support

Survey date 2026-11-05, source pages (not dist/). Counts come from regex scripts over the HTML with `<script>` bodies stripped, plus samples read by hand. No existing file was edited. axe-core is not in `node_modules` (only `playwright`, with Chromium present), so nothing below is from a rendered axe run; that is the first automation item.

Pages: k-5 24, 6th 15, 7th 11, 8th 11, extras 3, root 3 (index, arcade, design-log), games 6.

## 1. Findings

The baseline is better than the TODO assumes. Most remaining gaps are structural and repeat on every page.

| Check | k-5 | 6th | 7th | 8th | extras | root / games |
|---|---|---|---|---|---|---|
| `<img>` total | 69 | 23 | 6 | 16 | 59 | 0 |
| img with no alt attribute | 0 | 0 | 0 | 0 | 0 | - |
| img alt under 5 words | 0 | 0 | 0 | 0 | 5 | - |
| img `alt=""` | 0 | 3 | 0 | 0 | 25 | - |
| inline SVG (visible) | 93 | 210 | 48 | 85 | 0 | 6 (root) |
| SVG with `role="img"` + `aria-label` | 69 | 195 | 37 | 74 | - | - |
| SVG label under 6 words | 0 | 11 | 1 | 5 | - | - |
| SVG with `<desc>` | 52 | 2 | 13 | 10 | - | 0 of 6 |
| `<canvas>` | 0 | ~13 | 0 | ~1 | 7 | 6 (games) |
| canvas with no aria-label | 0 | 0 | 0 | 0 | 0 | 0 |
| range sliders | 7 | 72 | 20 | 38 | 10 | 2 |
| sliders with no accessible name | 0 | 0 | 0 | 0 | 0 | 0 |
| `aria-live` / `role=status` | 16 | 102 | 42 | 59 | 11 | 0 |
| pages with exactly 1 h1 and `<main>` | 24/24 | 15/15 | 11/11 | 11/11 | 2/3 | index, arcade: no `<main>` |
| pages with a heading level jump | 0 | 1 (unit-14, h2 to h4) | 0 | 0 | 0 | index (h2 to h4) |
| skip link | 0 | 0 | 0 | 0 | 0 | 0 |
| `prefers-reduced-motion` handled | 24/24 | 15/15 | 11/11 | 11/11 | 2/3 | 0 of 3 root, 0 of 6 games |
| `:focus-visible` rule | 24/24 | 15/15 | 11/11 | 11/11 | 3/3 | arcade cards set `outline:none` |
| vague link text ("click here", "more", empty) | 0 | 0 | 0 | 0 | 0 | 0 |
| positive `tabindex` | 0 | 0 | 0 | 0 | 0 | 0 |

How to read it:

- **Images.** Alt text exists on every real image and the sampled ones describe content. The `alt=""` hits are false positives: 6th unit-05 stacks three images inside a `role="img"` wrapper, and `extras/same-shape-everywhere.html` has 25 in a hidden `#bank` that the visible gallery copies with real alt text. The 5 short extras alts need a read. Real weak spot: the unit-05 rock wrapper has one static label covering all three states ("obsidian, basalt, or granite"); it should name the rock the cooling slider currently shows.
- **SVG.** Nearly all diagrams have `role="img"` and a sentence-length `aria-label`. Missing: `<title>`/`<desc>` for dense or data-carrying diagrams (6th has it on 2 of 210), and 17 labels under 6 words that need rewriting. Dynamic SVGs in the K-5 engines rebuild `aria-label` per state, which is the right pattern.
- **Canvas.** Every canvas has a static `aria-label`; a few also have `tabindex="0"` and arrow keys (Moon orbit, H-R diagram, beetle selection). Most labels describe the picture once and do not change when sliders or drags change it. The change is only heard if the nearby readout is a live region.
- **Controls.** All 149 lesson sliders are wrapped in `<label>` or use `for=`. Chips and buttons are real `<button>` with `aria-pressed`; 0 clickable divs found. Gap: sliders have no `aria-valuetext` or `<output>`, so a screen reader says a bare number ("120") without the unit; readouts are separate `aria-live="polite"` paragraphs that may chatter on every drag step. Pointer-drag with no key handler: 2 of 15 6th pages, 1 of 11 8th pages, extras/how-ai-works. Keyboard-operable canvas drags exist on only a few pages (6th unit-11, 8th unit-8.9, 6th unit-03).
- **Landmarks.** Lesson pages have `<header>`, `<nav>`, `<main>`. No skip link anywhere. `index.html` and `arcade.html` have no `<main>`. Source fragments have no `lang`, but `build.mjs` `wrap()` adds `<html lang="en">`, so dist/ is correct (checked).
- **Reduced motion.** Lessons handle it (CSS, and the lesson-game JS reads `matchMedia`). The arcade hub, lesson map and all six games do not.
- **Focus.** One rule, pasted per page: `:focus-visible{outline:3px solid var(--reflect)}`. In Retro `--reflect` is `#6EC9FF`, 9.2:1 on the surface. Failures: `arcade.html` `.game-card:focus-visible` sets `outline:none` and relies on a border colour change; `shared/core.css` covers only `button`, `input`, `summary`, not links, selects or canvas; the Retro `h1` is transparent text over a clipped gradient, which can vanish in Windows forced-colors mode.
- **Contrast (WCAG 2.x, computed).** Retro passes for text: ink 16.5, muted 9.6, accent 12.9, kicker teal 12.9, pink 7.6. Retro borders are low (`#4B2F94` 1.9:1, `#6E4BC8` 3.1:1), a problem only where a border is the sole cue. Classic: ink 16.2, muted 7.3 pass. Classic tokens that fail 4.5:1 if used as normal text: absorb `#D6450B` 4.08, green `#25904F` 3.71, red `#D93036` 4.34, transmit `#0B7F70` 4.49. Focus ring `#2B66E8` is 4.61 on bg, 4.29 on surface-2 (passes the 3:1 non-text rule). Slider accent `#F2A900` on `#F2F5FA` is 1.84:1, so Classic slider fill and thumb fail 3:1. Classic card borders `#D0D8E8` 1.31:1. Arcade `core.css` muted text 6.1 passes. Whether the failing tokens are used as text needs a per-use check (axe will find it).
- **K-5 activities (`k5-activities/*.js`, 6 engines, shadow DOM, 23 unit configs).** Strong: real `<button>`, `role="status"` with `aria-live`, `aria-pressed`, state-specific `role="img"` labels, focus moved to the first new control each round, and drag-and-drop in bigsort and pathsignal has a "Put card here" click alternative. No `keydown` handlers, which is fine if everything is a button. Gaps: reduced-motion missing in graphsky and sceneweb; confirm the `div`-built choice cards in pusharena (19 div creates) and fairtest (7) are focusable buttons; heading level of the `<h4>` inside the shadow root against the host page; `aria-live="off"` lists in bigsort.
- **Lesson games (`__mountLessonGame`, shadow DOM, canvas, on all 6th/7th/8th pages and k-5 unit-00).** Static canvas label, partial keyboard play. The frame code is pasted per page.
- **Arcade (`games/`, 6 canvas games).** Each canvas has a static `aria-label` and a few keys (Enter, arrows, Space); no live region, no reduced-motion, no text state. The `core.js` quiz and facts dialogs are `role="dialog" aria-modal`, move focus in and take Esc; verify focus returns to the opener on close.

## 2. Arcade games: text equivalent or honest note

| Game | Kind | Recommendation |
|---|---|---|
| short-circuit | tile-turning puzzle | Text-playable. Per-tile buttons ("row 2, column 3: wire, bent, connected") plus a live "bulb lit / not lit" status. |
| laser-bounce | place-materials puzzle | Text-playable. Cell list with material, and a text trace of the beam result. |
| balance-duel | turn-based weights on slots | Text-playable. Slots as buttons, live "left torque X, right torque Y". |
| football-duel, gravity-duel, phase-runner | real-time reflex | Not playable without sight. Visible note at the top ("This game depends on seeing the screen"), plus a link to the lesson that teaches the same physics. No fake text mode. |

Put the same statement on the arcade hub card so it is heard before entering.

## 3. Work breakdown

The 61 lesson pages do not share a template: each carries its own CSS copy, focus rule and game frame. The single points are `build.mjs` `wrap()` and `shared/*`. "Fix once" means either `build.mjs` or a one-shot codemod run over the pages. Sizes: S under half a day, M about a day, L several days.

Shared, fix once:

| Component | Work | Size |
|---|---|---|
| `build.mjs` wrap() | Inject skip link, `id="main"` on `<main>`, a reduced-motion / forced-colors / focus CSS block into every built page. | S |
| `shared/core.css` | Focus ring for `a`, `select`, `[tabindex]`, `canvas`; forced-colors fallbacks; reduced-motion for arcade animation. | S |
| `shared/core.js` | Return focus to opener after quiz/facts close; shared `announce()` live region for games; check Tab containment. | S |
| Retro snippet / `apply-retro.mjs` | Forced-colors fix for the gradient `h1`; confirm focus colour on every surface. | S |
| Slider pattern | Codemod adding `aria-valuetext` (or `<output>`) from the existing readout text; 149 sliders. | M |
| Classic tokens | Darken absorb/green/red/transmit for text use, slider accent, control borders. | S |
| `index.html`, `arcade.html`, `design-log.html` | `<main>`, heading order, drop `outline:none` on cards, reduced-motion, "playable without sight" labels. | S |
| `k5-activities/*.js` (6 engines) | Reduced-motion in graphsky and sceneweb; div vs button; shadow heading level. Flows to 23 units via `inject.mjs` then `build.mjs`. | S |
| Lesson-game frame | Per-game key map, live status, reduced-motion. Codemod or move into `shared/`. | M |
| Arcade games (6) | 3 text modes (about 1 day each) + 3 honest notes (S) + live state region in each. | L |

Per grade folder (content-dependent):

| Folder | Work | Size |
|---|---|---|
| k-5 (24) | `<desc>` on data-carrying diagrams among the 41 without; re-read alts; unit-00 lesson game. | M |
| 6th (15) | 208 SVGs without `<desc>` (choose which need it), 11 short labels, unit-05 rock label, unit-14 heading jump, keyboard on 2 drag pages, ~13 canvas labels per state. | L (about 2 days) |
| 7th (11) | 35 SVGs without `<desc>`, 1 short label. | M |
| 8th (11) | 75 SVGs without `<desc>`, 5 short labels, 1 drag page, 1 canvas. | M-L |
| extras (3) | `<main>` and reduced-motion on the missing page, 5 short alts, how-ai-works canvas drag by keyboard, 7 canvases. | M |

Not every SVG needs `<desc>`: leave a one-sentence label where the sentence is the whole picture, and add a long description only where the diagram carries data or a process.

## 4. Recommended order

1. Shared, safe now: `build.mjs` skip link and CSS block, `core.css`/Retro focus and forced-colors, `core.js` focus return, index/arcade landmarks and heading, Classic token contrast, K-5 engine fixes, arcade notes.
2. Slider `aria-valuetext` codemod. It reads existing readout text, so it survives content edits; re-run it after content changes.
3. Arcade text modes for short-circuit, laser-bounce, balance-duel, then the lesson-game frame.
4. Run axe over dist/ (see section 6) to get the true per-page list.
5. After content freezes: per-folder SVG `<desc>`, short-label rewrites, per-state canvas labels, unit-05 and unit-14 fixes, extras alts. Give authors of new diagrams and Try-it blocks a checklist now (role="img" plus sentence label, label every input, `aria-live` on the readout, alt on images) so new content arrives clean.
6. NVDA and VoiceOver pass once, after the last content change; fix; retest the failures.

## 5. NVDA and VoiceOver testing

Pairs: NVDA with Firefox and Chrome on Windows; VoiceOver with Safari on macOS and iOS. Test built `dist/` files.

Sample set: a K-5 lesson with an activity (unit-1-c), 6th unit-01 (slider and canvas), 6th unit-11 (canvas drag), 6th unit-05 (rock label), 8th unit-8.9, extras/how-ai-works, index, arcade, all six games, the quiz overlay and the facts card.

Checks:

1. Title, language, landmark list, skip link works and moves focus.
2. Heading list is sensible; h1 is announced.
3. Each image and diagram: could the lesson question be answered from the description alone?
4. Each slider: name, value with unit, arrow/Home/End work, one announcement per step.
5. Each button and chip: name, pressed state, Space/Enter.
6. Each drag: a keyboard alternative exists and is announced.
7. Live readouts: polite, not stuttering.
8. Dialogs: focus moves in, Esc closes, focus returns.
9. Focus visible at 200% zoom, Classic and Retro, dark mode, forced-colors.
10. OS reduced-motion on: no auto-animation.
11. K-5 activity: complete one round by keyboard only.
12. Games: the three text modes can be won by ear; the three real-time games show the "not playable without sight" note.

Test log template (one block per page and tool):

```
Page: ____________   Build/commit: ______   Tester: ______   Date: ______
Tool / browser / OS: NVDA x.y / Firefox / Win11   |   VoiceOver / Safari / macOS or iOS
Style: Classic | Retro    Zoom: 100% | 200%    Forced-colors: n | y
#   Check                      Result (pass/fail/n.a.)   What was heard or seen   Severity (blocker/major/minor)   Issue
1
2
...
Lesson completable without sight?  yes | partly | no     Notes:
```

## 6. Automation versus a human

Automate (Playwright is already in the repo; add axe with `npm install --no-save axe-core` and inject `axe.min.js`):

- axe-core on every dist page, in Classic and Retro, light and dark. Covers names, roles, contrast, landmarks, heading order, duplicate IDs, ARIA validity. Run it again inside each K-5 activity after mounting (axe handles open shadow roots) and with a lesson game mounted.
- A static regression test next to `tests/links.test.js`: every img has alt, every `role="img"` SVG has a label, every canvas has a label, every range has a name, each page has one h1, `<main>`, skip link, and reduced-motion.
- Keyboard walk: Tab through each page, assert a visible focus indicator (outline width above 0) on each stop and no trap; press Space/Enter on every button.
- `emulateMedia({reducedMotion:'reduce', forcedColors:'active'})` screenshots to confirm text stays visible.
- Accessibility-tree snapshot diffs to catch lost slider names and values.
- The contrast script over the token tables.

Needs a human:

- Whether an alt or diagram description is good enough to learn from, and whether it is pitched at the grade.
- Live-region chattiness, announcement order, verbosity in real NVDA and VoiceOver.
- Whether the text modes are actually playable by ear.
- iOS VoiceOver gestures (slider adjust, canvas drag).
- Ideally a daily screen-reader user.

## 7. Safe now versus wait

Safe now (no content dependency): all of section 4 steps 1 to 3, axe setup, and the static regression test.

Wait for the content freeze: per-page SVG descriptions and short-label rewrites, per-state canvas labels, new Try-it widgets (apply the author checklist now), unit-05 and unit-14 fixes if those pages are still being edited, and the full NVDA/VoiceOver pass.
