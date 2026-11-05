# K-5 quiz audit, 2026-11-04

Scope: the quiz data (inline `const Q=[...]` per page; unit-00 has it as a multi-line list) in all 24 files in k-5/. Format and answer-checking code unchanged. All 4 questions per unit were rewritten except where noted; every unit's correct-answer positions were re-shuffled (mix of A/B/C/D, no run of one letter). Unit-00 also had a stale score label ("0 of 9") for 8 questions; now "0 of 8".

General fixes in every unit: distractors rewritten from silly or absurd ("a robot", "disappears", "not useful") to real misconceptions; correct answer no longer the longest option in nearly all questions; "only/never/all" giveaway wording removed; vague stems made into single-answer scenarios.

- unit-00: hypothesis Q now asks which can be fair-tested (distractors: opinion, many variables changed); trials Q adds "keep going until you get the answer you hoped for"; theory Q adds "a fact that can never change"; correlation Q adds "no connection, just luck"; cosmic calendar Q distractors now March, July, September (was January).
- 1-a: shadow/seeing Q adds "eyes shine a light on the toy"; message Q distractors made non-signalling (steady light).
- 1-b: "External parts" Q was nonsensical ("Matter only for young animals"), rewritten around beak and webbed feet; parent Q restated for robins to remove "some animals leave" ambiguity.
- 1-c: Moon Q now asks why we see it; daylight and stars Q distractors rewritten to common ideas (stars turn off, move away).
- 2-a: "Which sentence is true?" was multi-answer prone; rewritten as a butter scenario. Undo Q now has 3 irreversible cooking distractors. Test Q distractors made plausible.
- 2-b: plant needs Q adds "plants eat soil"; seeds Q "people must plant them"; habitat Q distractors are incomplete lists.
- 2-c: erosion Q adds smoothing/steeper slope; water places Q distractors "ice is not water"; model Q adds "model works exactly the same".
- 3-1: magnet Q uses aluminum and copper (all-metals idea); balloon Q distractors are opinion questions; magnet job Q lists plastic, aluminum, glass.
- 3-2: weather and climate Q turned into example statements (was bare definitions); flood barrier Q now "forever"; Great Lakes Q tied to what the unit says (milder shores, lake snow).
- 3-3: life cycle Q (all start as eggs, all look like small adults); offspring Q adds "traits are all learned"; inheritance data Q uses sunlight and water distractors.
- 3-4: group Q, fossil Q, and deer Q (adds "deer grow fur because they want to"); claim Q no longer has the "no reasons" distractor.
- 4-1: energy Q fixed the "no energy" absurdity; marble Q now "some" moved (the original "moved from marble to block" implied all); heat Q adds "cold flows"; rice Q distractors are wind/lighter.
- 4-2: circuit Q adds one-wire misconception; conductor Q 4 options; switch Q fixed; light-card Q: "used up" misconception kept as a distractor.
- 4-3: waves Q adds "waves carry water"; sound Q adds "air and empty space"; message Q distractors are "light carries voice" etc.
- 4-4: internal structure Q all-external distractors; roots Q uses leaf job; ball path Q reorders arrows; deer Q separates sense from response.
- 4-5: weathering/erosion split into two scenario Qs (unit has no "deposition", so it is not used); energy source Q equalized in length.
- 5-1: air Q, salt Q, new-substance Q (3 non-new-substance changes); sealed bag Q had two identical "goes down" options (fixed).
- 5-2: Sun brightness Q (biggest star); day/night Q; gravity Q unchanged in substance; constellation Q adds "stars move".
- 5-3: tree mass Q (soil, sunlight); lunch energy Q; food web arrows Q now includes "eater to eaten" reversal; decomposer Q.
- 5-4: water Q (the answer "Most is liquid fresh water" was a conflicting distractor, now clean); spheres Q is now short examples; rain garden Q; dune grass Q.
- K-a: pull Q shortened; fair test Q is a scenario.
- K-b: sunlight Q (was "heavier" / "wetter"); shade Q; calendar and forecast Q distractors plausible.
- K-c: plants Q adds "plants eat dirt"; habitat; beaver Q adds a third plausible option; people-help Q adds feeding wild animals or taking babies home.
- K2-0: first-step Q turned into an ants scenario (original "what do scientists do first" was debatable); evidence Q adds "what an adult says".

Could not make single-answer: none. Open for a human science check: 5-4 Q1 (spheres example); 4-1 Q1 ("some" energy moved); 3-2 Q3 (answers based on the unit's "Great Lakes effects" wording).

Method note: edits were applied by a script that read each file and replaced only the quiz data (and the one score label) in the same instant, to avoid colliding with other agents' edits.
