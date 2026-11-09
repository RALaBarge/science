# Unit 4.2 Circuits and Energy Conversion: applied

## What changed (page: k-5/unit-4-2-circuits-and-energy-conversion.html)

- All kit builds cut: Light the LED, Material tester, Paper clip switch, Light-up card Try it, the "Try it at home or in class" section (What you need, What you do, backup data) and the drawn tester table picture. The LED stays in pictures, the Data block, the widget and Words to know.
- Triad layout removed: each concept keeps only the blocks listed in the report (C1: Train track, Open vs closed, LED log; C2: Conductor table, Safe wiring; C3: Switch open and closed, Flashlight; C4: Energy conversion, Light-up card, Where the rest goes, Doorbell).
- New "Before you play" bulleted list above Circuit Builder; game intro line simplified (page and `k5-activities/units` JSON). Game itself untouched.
- Intros rewritten as short plain-word paragraphs with the lead-up definitions (current, coin cell, terminal, conductor/insulator, switch open/closed, energy forms). Michigan-first opening. "motion" dropped.
- LED log and Conductor table are reading tables. Open vs closed and LED log have lead-up sentences and pictures.
- Waste heat section added ("Where the rest goes") with a Michigan porch-light example and picture; no percentage given (verify any number before adding).
- Near you is Michigan-specific. Words to know has six new terms. Standards codes removed (footer, tutor notes, Limits line). Plastic/wood wording now "dry wood block almost all current". LED-on-coin-cell safety claim removed with the kit section. "Electrical energy" used throughout.
- + and - on the energy picture and light-up card are HTML overlay chips (style `u42css`).

## Defaults taken

Q1 light-up card plus energy picture both get - labels. Q2 triad read as the report did. Q3 cut all builds. Q4 waste heat (not e-waste). Q5 tutor notes stay on the page, codes removed. Q6 wording avoids "flat side". Q7 only closed loop/open loop/switch tasks named. Q8 hero left as is (already a picture). Q9 no top SVG found in source. Q10 no train picture added. Q11 pacing line left as is. Q12 overlays approved. Q13 CHECK badges are not in source; ignored.

## Report items that were wrong or skipped

- "Check yourself" is not empty: the quiz is built by script (4 questions). Not changed.
- CHECK 1/CHECK 2 badges and "[IMG]" markers are not in the source.
- Words to know separators exist in the HTML (dt/dd); only the review text lost them.
- IMG-5 (Concept 3 main switch picture) not made: that slot is the interactive switch widget, kept. IMG-12 not needed.
- The Concept 1 main picture is wired through the unit JSON (`42-loop`, replaces `d-42-loop`); kit and tester figures removed from the JSON.

## Images (ids, all in k5-images/webp)

42-img1 (C1 main, JSON), 42-img2 (open loop), 42-img3 (LED), 42-img4 (wire), 42-img6 (switch), 42-img7 (flashlight), 42-img8 (energy), 42-img9 (card), 42-img10 (doorbell), 42-img11 (porch light heat). 3 tries used on img1, img2, img3, img8, img6, img9.

## Needs Ryan

- 42-img1: battery sits inside the loop without clear wire joins. 42-img8: single wire only; the + and - chips sit on the battery ends, picture is weak. 42-img9: loop is not fully drawn and the LED is a bulb shape. 42-img2 and 42-img6 show only the open state. Regenerate if wanted.
- Verify: whether to give a heat percentage for porch bulbs; coin cell + face on real cells.
