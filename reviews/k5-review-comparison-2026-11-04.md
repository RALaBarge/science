# Hy4 versus Grok on the K-5 work (2026-11-04)

Inputs: Grok 4.7 reviewed the original 23 units on 2026-11-03 (`k5-grok-review-2026-11-03.md`). Hy4 (`tencent/hy4`) got the same prompt on 2026-11-04 with the corrected text, the built engines and configs added (`k5-hy4-review-2026-11-04.md`). Because Hy4 saw text that already had Grok's fixes, the two lists are not a like-for-like score. What follows is what each found that the other did not, checked against the files.

## Hy4 findings checked and confirmed

| Finding | Where | Verdict |
|---|---|---|
| K2.0 Try-it says "same number of drops" but the data is "5 drops vs 8 drops": the count is the thing measured | `out_K.md` line 33, page K2.0 | **Real error.** Grok said "none found" for K2.0. Fix the wording. |
| 4.3 provided data is at 5 m, the design criterion says 3 m | `out_4.md` lines 404 and 462 | **Real.** Use one distance. |
| 5.3 child text "Plants use water, air, and light to make food" blurs matter versus energy | `out_5.md` line 403 | **Real.** Say water and air are matter, light is energy. |
| 3.3 bean seed-coat colour offered as offspring trait data | `out_3.md` line 459 | **Real.** Seed coat is maternal tissue. Say "model seed data" or use seedling traits. |
| 4.5 quiz Q3 key is "a sea" for shell fossils | `out_4.md` line 780 | **Real.** Needs "water environment, sea if the shells are marine" or the other-clues idea. |
| 3.4 stage 2 has bins "Survives well / Cannot survive" only; 3-LS4-3 needs "survives less well" | activity config | **Real.** |
| 5.1 stage 2 puts "Trail mix picked apart" under "Same substance" | activity config | **Real.** Trail mix is a mixture. |
| 3.2 puts "A weather-map symbol for snow" under "Measures weather" | activity config | **Real.** A symbol reports weather, it does not measure it. |
| Big Sort bins are `<button>` elements containing `<h4>`, `<ul>`, `<li>` | `bigsort.js` line 112 | **Real accessibility fault** (invalid content in a button; the list changes the button's accessible name). |
| Design doc contradicts itself: "Big Sort ... 2-C skin" while 2-C is Fair Test Lab; "reused in five units" while 13 use it | `docs/k5-activities-design.md` | **Real.** Docs only. |
| Safety notes missing for water trays and drops: 3.2 (keep water away from Chromebooks), 3.1 static demo, 5.2 ball drops | unit pages | Plausible and cheap; add. |
| 3.1 and 4.5 carry heavy loads (3.1 packs CER, balanced forces, dot diagrams, static, field lines, a design problem into six sessions) | unit text | Opinion with merit; 4.5 was already noted. |
| Quiz distractors in K-2 are still easy ("Only using big, expensive tools") | quizzes | Fair. They are plausible-sounding but weak. |
| Engines: no focus management after step changes; CSS variables have no fallbacks; evidence is lost on reload; inlined engine copies can drift | engines | Real, minor. |

## Hy4 findings that are wrong or overstated

- "`cfg.intro` is never rendered" is wrong: the injector prints the intro in the page's `<p class="idea">` above the activity. It is true that the engine itself does not render it.
- "Hints give the bin away" is partly the design (the hint points at the property that decides the bin). It is a fair complaint only where the hint names the answer.
- "Emoji instead of the generated images": a design opinion, not a defect.

## What Grok found that Hy4 did not

Items already fixed before Hy4 saw the text, so they could not recur: 5.4 missing groundwater reservoir, 5.1 sealed-bag conservation, coin cells in K-B/1-A/1-C, 4.2 foil short warning, 5.2 "closer stars look brighter", 2-C blowing sand, 5.3 decomposer mass table. Both reviews flagged the backup-data standards overclaims (2-B, 1-C, K-B) and the tilt-causes-seasons spiral problem.

## The point for the owner

Hy4's honest verdict on the built activities: **none as built would hold a 12-year-old for three minutes**; two (2-C, 5.3) might last three minutes but still read as homework; Big Sort is the wrong tool for 11 of its 13 units (it cannot run a test, animate anything, or let the child build anything). Hy4 asks for one of three things in each: a visible physical replay, a child-made model or graph, or a real choice with consequences. This is an opinion from a model, not a play-test, but it matches the owner's concern and should be put in front of real kids before more engines are built.

## Cost

Hy4 ran at about $0.42 per million input tokens and $1.25 per million output tokens: a single full review is a few cents to well under a dollar, far cheaper than Grok or Kimi at high reasoning.
