# Claims resolution (104 `check` entries)

Every entry in status-*.json with a `check` now carries `"resolved_by":"claude"`. Entries are grouped; confidence is Claude's own knowledge, no live source lookup.

## Changed

| Claim | Verdict | Action | Conf. |
|---|---|---|---|
| 6th/03 egg crack force 25 N | Model value, not real data | Caption says made-up model, 25 N is a round number, real eggs vary | high |
| 6th/12 25 kg feed per kg beef | Literature ranges widely | Reworded "on the order of 25 kg (published estimates range from under 10 to over 25)" | high |
| 6th/15 coin-flip ranges | Right as 95% approximations (2-8 heads of 10 is about 98%, 40-60 of 100 about 96%) | Labelled "middle 95 percent ... about" | high |
| 8.11 solar curve | Sketch, not data | Axis label "sunlight change (sketch)" | high |
| 8.11 sea level 23 cm (page also said 20 cm) | Inconsistent; IPCC AR6 gives about 20 cm for 1901-2018 | Chart and alt text now "roughly 20 cm", points 0/8/12/21, caption says simplified | medium |

## Verified correct, no change

He D3 587.6 nm and Na D 589.0/589.6 nm; iron floats on mercury (7.87 < 13.5), ice about 92% submerged; Foucault drift 15 x sin(42 deg) = about 10 deg/h, stars 15 deg/h; Moon orbit tilt about 5 deg; scale model (10 cm Sun: Earth 10.8 m, Neptune about 325 m, Earth about 0.9 mm); frost line about 3 AU (2.7-5 stated); pre-industrial seawater pH about 8.2, 0.1 drop = about 26% more H+; FDA sample label numbers and Daily Values (2,300 mg, 28 g, 50 g); core boundaries 2,900 and 5,150 km; size list in 7.1; forearm lever ratio about 8; glacier about -27 m w.e. 1970-2020 (WGMS reference glaciers); temperature anomaly points (NASA, 1951-80 base); emission sectors 34/24/22/15/6 (IPCC AR6 WGIII, 2019); snapdragon 1:2:1; ASCII 65, 66, 72, 105, 32; 23 airway generations; 4.7e22 and 4.7e24 m; ramp 200*(0.25+0.2*0.968) = 89 N; wall near-side positive charge; Kirtland warbler under young jack pine; Great Lakes about 20% of surface fresh water; Orion winter, Scorpius summer, Cygnus late summer; Petoskey stone as fossil coral (page gives no date); Michigan Detroit July high 83 F; heart, xylem/phloem, Keweenaw copper, rust, magnetic vs geographic north; Sun "not the biggest, closest" wording (page does not call it average); Moon formation "tens of millions of years".

## Illustrative / example data (labelled on page, confirmed)

Texture sketches, schematic diagrams, K-5 tallies and weather tables, pump-map dots (stated on figure), station timings, Moon calendar, survival model numbers. No further action.

## Needs a human

- 8.11 sea-level and ice-core outline: shapes are simplified; compare to NOAA/CSIRO and the EPICA record if exact curves are wanted.
- 7.10 anthocyanin "shape change" wording for grade 7: acceptable, but a teacher should confirm level.
- Photos or rasters (not claims): none touched here.
