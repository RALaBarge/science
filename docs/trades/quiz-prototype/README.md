# Find-your-fit quiz: scoring prototype

Status: logic only, no page yet. `quiz.js` holds the eight questions and the scoring; `data.json` is the 306 occupations with their tags (built from `../bls-trades-data.csv`, the model-written tags and blurbs); `test.js` runs sample students and a sweep of 6,000 random answer sets.

Run: `node docs/trades/quiz-prototype/test.js`

How it scores an occupation: hard filters first (anything the student said they want to avoid, training longer than they will do, heavy work if they said light), then points for matching setting, social, physical level, what they want to do (weighted most) and the kind of thinking, then small nudges from their priorities (pay, growth, hard to hand to software, many Michigan jobs), a size bonus so common trades beat obscure ones, and a bonus for the 15 in-depth trades. At most two results from one family. Catch-all rows ("all other", "miscellaneous", "helpers") are never recommended. If too few survive the filters, it relaxes them and marks the result.

The quiz asks nothing about gender, race, family or appearance.

What the test shows (2026-11-04):
- Each sample student gets five sensible results with reasons, nothing they ruled out, and no more than two from one family.
- Across 6,000 random students 244 of the 306 occupations are recommended at least once; 62 never are (mostly production, metalworking and some building-trade rows that the tags make look alike).
- It is weakest where the tags are weakest: only two occupations are tagged "grow" (plants, land, trees), and 72% are tagged "crew", so the social question does little. A student who wants to work with plants gets two relevant results and three weak ones.
- The tags are a language model's judgment, not measured. Before this goes in front of students, have a person read the tags for the roughly 60 occupations that carry the most weight.
- Nobody has tried it with real students. The scoring weights were tuned by eye on eight sample profiles.
