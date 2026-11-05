// Small interactive widgets for the K-5 lessons. Each entry names a fragment in k5-images/html/ (markup plus a script),
// the lesson page it goes on and the section it follows. make-figures.mjs lists them, inject-images.mjs embeds them.
export const INTERACTIVES = [
  { id: 'w-1c-spin', unit: 'unit-1-c-sky-patterns', after: 's1', file: 'w-1c-spin.html',
    caption: 'Turn the Earth and watch your place go from day to night. The Sun does not turn off: Earth turns.',
    alt: 'Interactive: a slider turns a ball that stands for Earth in front of a lamp, and says whether your place, a red dot, is in day or night.' },
  { id: 'w-41-collision', unit: 'unit-4-1-energy-speed-and-collisions', after: 's2', file: 'w-41-collision.html',
    caption: 'Pick a ball and see that its energy of motion becomes a little heat, sound and bending. The total stays the same.',
    alt: 'Interactive: pick a clay ball, a hard ball or a super ball and see bars for energy before and after a bounce. The total is always 100.' },
  { id: 'w-42-switch', unit: 'unit-4-2-circuits-and-energy-conversion', after: 's3', file: 'w-42-switch.html',
    caption: 'Close the switch to light the bulb, then cut a wire. One gap anywhere breaks the whole loop.',
    alt: 'Interactive: buttons open and close a switch and cut a wire in a circuit with a battery and a bulb. The bulb lights only when the loop is complete.' },
  { id: 'w-52-down', unit: 'unit-5-2-gravity-stars-and-sky-patterns', after: 's2', file: 'w-52-down.html',
    caption: 'Move around the globe and drop the ball from anywhere: it always falls toward the center of Earth.',
    alt: 'Interactive: a slider moves a ball around a globe and a button drops it. The arrow always points to the center of Earth.' },
  { id: 'w-52-shadow', unit: 'unit-5-2-gravity-stars-and-sky-patterns', after: 's3', file: 'w-52-shadow.html',
    caption: 'Slide the time of day and watch the shadow change length and direction while the Sun moves.',
    alt: 'Interactive: a slider sets the time of day from 8:30 am to 3:30 pm and shows the shadow of a 10 centimeter stick in a top view, with its length and direction.' },
];
