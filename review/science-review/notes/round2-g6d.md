# Round 2 - g6d (6th: units 09, 10, 11)

## Unit 09 Body systems and homeostasis
- Top hero image removed.
- Hot-stove relay: SVG replaced by diffusion image `g6d-stove` (whole child and stove in frame, hand pulled away from a steaming pot, glowing nerve path fingertip -> spine -> arm drawn inside the body, no text, no injury). Caption now walks the path (sensor, spinal cord, muscle).
- Three layers of defense: SVG replaced by diffusion image `g6d-defense` (three panels: skin wall stopping germs, white blood cell swallowing germs, small defender cells/antibodies targeting a germ). Labels are an HTML list under the image.
- Other diagrams on the page left as the existing inline SVGs (not changed; "all of those" read as the two named images plus the hero).

## Unit 10 States of matter
- "Smells prove particles move": room-sketch SVG replaced by cartoon diffusion image `g6d-smell` (Looney Tunes style pie on windowsill, wavy scent trail, floating dog sniffing it, no text). Added a one-sentence caption naming diffusion.

## Unit 11 Earth in space
- Top hero image removed.
- Concept 1 merry-go-round analogy removed (and the later "same idea as the merry-go-round above" now points at the Spin the Earth slider). Note: Ryan's dictation said "force"; the only force/gravity analogy is the ball-on-string in Concept 5, which I kept because the Concept 5 request needs an analogy card to put the intro above. If he meant that one, delete that article.
- Proof Earth rotates: Foucault pendulum text and SVG removed. Now a pair of photos: `g6d-startrails` (star trails over Atacama cacti, ESO/B. Tafreshi, CC BY 4.0, https://commons.wikimedia.org/wiki/File:Star_trails_over_Atacama_Desert_Cacti_(potw1419a).jpg) and `g6d-nightsky` (normal short-exposure sky with Joshua tree, Joshua Tree National Park, public domain, https://commons.wikimedia.org/wiki/File:Stars_and_Milky_Way_above_a_Joshua_tree_(53433923406).jpg). Credits in captions. Text notes the trails photo is from Chile (circles center on the south pole point; Ann Arbor's center on the North Star).
- Tilted hula hoop (the Moon-orbit/eclipse analogy) is now interactive: Earth moves around the Sun through the year while the Moon's tilted hoop keeps a fixed orientation; nodes, a new-moon marker with a drop line to the Earth-orbit plane, and a readout that says when the node line points at the Sun (eclipse season) vs. when the shadow misses. Slider (native range, keyboard operable, aria-valuetext), Play/Pause button, Back to March button, aria-live readout. Labels moved from SVG to an HTML legend so they stay readable on phones. Tilt is exaggerated and the caption says so; also notes eclipse seasons slide about 19 days earlier each year.
- Concept 5: added intro block above the analogy card (plain-language hook, then force, gravity, motion, orbit, scale model defined).
- Clipped moon value: the "Your weight on other worlds" bars clipped value text inside narrow bars (Moon etc.). The shared `bars()` helper now puts the value beside the bar when the bar is under 55% wide, and text is shortened to "N kg". Checked at 1000 px and 500 px wide (Chrome headless minimum width, so true 390 px phone not verified).

## Images
Generated (ComfyUI, in k5-images\webp, logged in images.json): g6d-stove, g6d-defense, g6d-smell. Real photos (Commons): g6d-startrails, g6d-nightsky. All embedded as base64 webp in the pages, each under 90 KB.

## Not done / caveats
- Real phone width (390 px) check of hula hoop: layout is responsive (SVG scales, buttons wrap) but I only saw it at about 500 px wide.
- Stove child is drawn without a shirt (shorts only) so the nerve path is visible.
- Pages checked: tag balance OK, no console errors on load.
