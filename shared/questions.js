// ===================== QUESTION BANK =====================
// Format: [topic, question, [CORRECT answer first, then 3 wrong answers], explanation]
// Choices are shuffled when shown, so always put the right answer first here.
// Topics match the K-5 foundations doc so results can be tracked by concept later.
window.QUESTION_BANK = [
  // ---- Gravity ----
  ["Gravity", "A shot is twice as far from a planet as before. How strong is the planet's pull now?", ["One quarter as strong", "Half as strong", "Twice as strong", "Exactly the same"], "Gravity weakens with distance squared. Twice as far means 2 × 2 = 4 times weaker."],
  ["Gravity", "A planet's mass doubles. What happens to its pull on your shot?", ["It gets twice as strong", "It gets four times as strong", "It gets half as strong", "It stays the same"], "Pull grows in step with mass. Double the mass, double the pull."],
  ["Gravity", "Which planet pulls harder: a big, light planet or a small planet with much more mass?", ["The small planet with more mass", "The big, light planet", "They pull the same", "Neither one pulls"], "Gravity depends on mass, not size. That's why the dense planets in the game pull so hard."],
  ["Gravity", "Astronauts dropped a hammer and a feather on the moon at the same time. What happened?", ["They landed at the same time", "The hammer landed first", "The feather landed first", "They both floated away"], "With no air to slow the feather, gravity speeds up heavy and light things the same amount."],
  ["Gravity", "On Earth, why does a feather fall slower than a rock?", ["Air pushes against the feather more", "Gravity pulls the feather less", "Feathers have no mass", "Gravity only pulls heavy things"], "Air resistance slows the light, wide feather. Without air they would fall together."],
  ["Gravity", "What keeps the moon going around Earth?", ["Earth's gravity", "Wind in space", "Light from the sun pushing it", "Magnetism"], "The moon is always moving forward, and Earth's gravity keeps bending its path into a circle."],
  ["Gravity", "In space with nothing pulling or pushing on it, a moving object will...", ["Keep moving at the same speed in a straight line", "Slowly come to a stop", "Keep speeding up", "Start to spin"], "This is inertia. Things only slow down on Earth because of friction and air."],
  ["Gravity", "If you stood on the moon, your weight would be...", ["Less, because the moon's gravity is weaker", "More, because the moon is closer to the sun", "Exactly the same", "Zero"], "The moon has much less mass than Earth, so it pulls on you about one sixth as hard."],
  ["Gravity", "When you travel to the moon, what happens to your mass?", ["It stays the same; only your weight changes", "It gets smaller", "It gets bigger", "It disappears"], "Mass is how much stuff you're made of. Weight is how hard gravity pulls on that stuff."],
  ["Gravity", "Which way does Earth's gravity pull, no matter where you stand on Earth?", ["Toward Earth's center", "Toward the North Pole", "Toward the sun", "Away from Earth"], "That's why down in Australia and down in Michigan point in different directions in space."],
  ["Gravity", "What is gravity?", ["A pull between any two objects that have mass", "A push from the air", "A force only Earth has", "A kind of magnetism"], "Everything with mass pulls on everything else. Big masses like planets pull strongly enough to notice."],
  ["Gravity", "In Gravity Duel, why does your shot travel in a curve?", ["Planets pull it sideways as it passes", "Wind blows it off course", "It runs out of fuel", "The wall pushes it"], "Each planet tugs the shot toward its center, bending its path."],

  // ---- Forces ----
  ["Forces", "A box sits still on the floor. What is true about the forces on it?", ["They are balanced", "There are no forces on it", "Only gravity acts on it", "They are unbalanced"], "Gravity pulls it down and the floor pushes it up just as hard, so it doesn't move."],
  ["Forces", "Two kids push a box from opposite sides with exactly the same force. The box...", ["Doesn't move", "Moves left", "Moves right", "Lifts off the floor"], "Equal pushes in opposite directions are balanced forces, so nothing changes."],
  ["Forces", "What force slows down a sled sliding on snow?", ["Friction", "Magnetism", "Inertia", "Electricity"], "Friction between the sled and snow works against the motion."],
  ["Forces", "Which surface has the most friction?", ["Sandpaper", "Ice", "A polished floor", "Wet glass"], "Rough surfaces grab more, so they have more friction."],
  ["Forces", "To make something speed up, slow down or turn, you need...", ["An unbalanced force", "Balanced forces", "No force at all", "A heavier object"], "Only an unbalanced force changes how something moves."],
  ["Forces", "You push a full shopping cart and an empty one with the same force. Which speeds up more?", ["The empty cart", "The full cart", "They speed up the same", "Neither one moves"], "Less mass means the same push changes its speed more."],
  ["Forces", "A seesaw is which kind of simple machine?", ["A lever", "A pulley", "A screw", "A wedge"], "A lever is a bar that turns on a pivot point."],
  ["Forces", "To lift a heavy rock with a lever, where should the pivot go?", ["Close to the rock", "Close to your hands", "Exactly in the middle always", "It doesn't matter"], "A pivot near the load lets a small push on the long end lift a big weight."],
  ["Forces", "How does a ramp help you get a heavy box onto a truck?", ["You push with less force over a longer distance", "It turns gravity off", "It makes the box lighter", "It adds friction to help"], "You trade a longer path for a smaller push."],
  ["Forces", "A heavy kid sits close to the middle of a seesaw and a light kid sits far out. Can they balance?", ["Yes, if weight × distance is the same on both sides", "No, the heavier kid always goes down", "Only if they weigh the same", "Only if they both sit at the ends"], "Distance from the pivot matters as much as weight."],
  ["Forces", "A 2 kg weight sits 3 spaces from the pivot. How much turning force does it make?", ["6", "5", "1.5", "23"], "Turning force = weight × distance, and 2 × 3 = 6."],
  ["Forces", "A 4 kg weight sits 2 spaces left of the pivot. Which of these balances it?", ["A 2 kg weight 4 spaces to the right", "A 4 kg weight 4 spaces to the right", "A 1 kg weight 1 space to the right", "A 2 kg weight 2 spaces to the right"], "4 × 2 = 8 on the left, and 2 × 4 = 8 on the right."],
  ["Forces", "Where should you push a door to open it most easily?", ["Far from the hinges", "Right next to the hinges", "On the hinges", "It doesn't matter"], "Pushing far from the turning point gives the most turning force."],
  ["Forces", "The point a lever turns around is called the...", ["Fulcrum, or pivot", "Load", "Axle", "Ramp"], "A seesaw's fulcrum is the stand in the middle."],
  ["Forces", "Why is it easier to loosen a tight bolt with a long wrench?", ["Your push is farther from the turning point", "Long wrenches are heavier", "Long wrenches are made of stronger metal", "It isn't easier"], "More distance means more turning force for the same push."],
  ["Forces", "A seesaw is tipping down on the left. What would help balance it?", ["Add weight on the right, or move right-side weights farther out", "Add more weight on the left", "Move the right-side weights toward the middle", "Make the seesaw shorter on both sides"], "You need more turning force on the right side."],
  ["Forces", "Which of these tools is a lever?", ["A bottle opener", "A ramp", "A screw", "A wheel"], "The bottle opener turns on the cap's edge, its fulcrum."],
  ["Forces", "Why is it hard to stop a car on ice?", ["Ice has very little friction", "Ice pulls the car forward", "Cars weigh more on ice", "Gravity is weaker on ice"], "Tires need friction to grip, and ice gives them very little."],

  // ---- Motion ----
  ["Motion", "A ball rolls 10 meters in 2 seconds. What is its speed?", ["5 meters per second", "20 meters per second", "12 meters per second", "8 meters per second"], "Speed = distance ÷ time, and 10 ÷ 2 = 5."],
  ["Motion", "How can you make a pendulum swing back and forth faster?", ["Make the string shorter", "Add more weight to the end", "Paint it a brighter color", "Push it with the same string length"], "Only the string length (and gravity) changes the swing time. Shorter swings faster."],
  ["Motion", "Which change does NOT change how long a pendulum takes to swing?", ["Adding more weight to the end", "Making the string shorter", "Making the string longer", "Taking it to the moon"], "Heavy and light pendulums swing in the same time. The moon's weaker gravity would slow it."],
  ["Motion", "On a distance-time graph, a steeper line means the object is...", ["Moving faster", "Moving slower", "Stopped", "Getting smaller"], "Steeper means more distance in the same time."],
  ["Motion", "A ball rolls down a smooth ramp. Where is it moving fastest?", ["At the bottom", "At the top", "Halfway down", "It goes the same speed everywhere"], "Gravity keeps speeding it up the whole way down."],

  // ---- Energy ----
  ["Energy", "Which has the most energy of motion?", ["A fast bowling ball", "A slow bowling ball", "A bowling ball sitting still", "They all have the same"], "Faster objects carry more motion energy."],
  ["Energy", "A ball held high above the ground has stored energy because of its...", ["Height", "Color", "Temperature", "Shape"], "Lifting it against gravity stored energy that turns into motion when it falls."],
  ["Energy", "Rubbing your hands together makes them warm. Motion energy turned into...", ["Heat", "Light", "Electricity", "Mass"], "Friction turns motion energy into heat."],
  ["Energy", "Where did the energy in the food you eat originally come from?", ["The sun", "The soil", "Water", "The refrigerator"], "Plants capture sunlight to make food, and animals get energy by eating plants or other animals."],
  ["Energy", "A flashlight changes energy stored in its batteries into...", ["Light (and some heat)", "Sound", "Motion", "Food energy"], "Batteries store chemical energy; the bulb turns electricity into light and a little heat."],
  ["Energy", "A rolling ball hits a still ball. What happens to the energy?", ["Some moves into the ball that was still", "It disappears", "It doubles", "It all turns into light"], "Energy is never destroyed. It moves from one object to another or changes form."],
  ["Energy", "Which energy source is renewable?", ["Wind", "Coal", "Oil", "Natural gas"], "Wind keeps blowing. Coal, oil and gas take millions of years to form."],
  ["Energy", "A car brakes to a stop. Where did its motion energy go?", ["It became heat in the brakes", "It was destroyed", "It went back into the gas tank", "It turned into extra mass"], "Brakes use friction, which turns motion energy into heat."],
  ["Energy", "You stretch a rubber band and let go. Its stored energy becomes...", ["Motion energy", "Light", "Electricity", "Nothing; it disappears"], "Stretching stores energy, and letting go turns it into motion."],
  ["Energy", "When your shot slams into a planet, its mass times its speed decides how hard it pushes. What is mass × speed called?", ["Momentum", "Kinetic energy", "Gravity", "Friction"], "Momentum is mass × speed. Kinetic energy is close but different: it grows with speed × speed, so doubling the speed gives four times the energy but only twice the momentum."],

  // ---- Matter ----
  ["Matter", "All matter is made of tiny pieces, too small to see, called...", ["Particles (atoms and molecules)", "Cells", "Pixels", "Crystals"], "Everything, including air and water, is made of particles."],
  ["Matter", "Which of these is a gas?", ["Water vapor (steam)", "Ice", "Wood", "Milk"], "Water vapor is water in its gas state."],
  ["Matter", "Liquid water turning into ice is called...", ["Freezing", "Melting", "Evaporation", "Condensation"], "Cooling a liquid until it becomes solid is freezing."],
  ["Matter", "Water drops form on the outside of a glass of ice water. Where did they come from?", ["Water vapor in the air condensed on the cold glass", "Water leaked through the glass", "The glass is melting", "The ice is sweating through"], "Cold surfaces turn water vapor in the air back into liquid."],
  ["Matter", "A puddle disappears on a sunny day. Where did the water go?", ["It evaporated into the air", "It was destroyed", "It froze", "It turned into dirt"], "Heat from the sun turned the liquid water into water vapor."],
  ["Matter", "You dissolve 10 grams of salt in 100 grams of water. What does the mix weigh?", ["110 grams", "100 grams", "90 grams", "10 grams"], "Mass is conserved. The salt is still there, just spread out."],
  ["Matter", "Which change can NOT easily be undone?", ["Burning paper", "Melting ice", "Freezing juice", "Dissolving sugar in water"], "Burning makes new substances like ash and smoke. You can't turn them back into paper."],
  ["Matter", "Which is a sign that a new substance has formed?", ["Gas bubbles appear when two things are mixed", "Ice melts", "Sand is poured into a cup", "A rock breaks in half"], "Bubbles from mixing (like baking soda and vinegar) show a chemical reaction."],
  ["Matter", "How could you separate sand from water?", ["Pour it through a filter", "Use a magnet", "Freeze it", "Stir it faster"], "A filter lets water through but catches the sand."],
  ["Matter", "How could you get salt back out of salt water?", ["Let the water evaporate", "Pour it through a filter", "Use a magnet", "Shake it"], "The water leaves as vapor and the salt stays behind."],
  ["Matter", "Does air have mass?", ["Yes, air is matter and takes up space", "No, air is nothing", "Only when it's windy", "Only cold air does"], "A blown-up balloon weighs a tiny bit more than an empty one."],
  ["Matter", "In a solid, the particles...", ["Are packed close and vibrate in place", "Fly around far apart", "Never move at all", "Slide past each other freely"], "Solid particles still jiggle, but they stay in place."],
  ["Matter", "Which material is best for a raincoat?", ["Plastic, because it is waterproof", "Paper", "A cotton towel", "A sponge"], "Pick materials by their properties. Plastic doesn't soak up water."],

  // ---- Light ----
  ["Light", "We can see a book because...", ["Light bounces off it into our eyes", "Our eyes send out light", "The book makes its own light", "Sound waves hit our eyes"], "Most things don't glow. We see them by the light they reflect."],
  ["Light", "Light travels in...", ["Straight lines", "Circles", "Curves around objects", "Zigzags"], "That's why shadows have sharp edges and you can't see around corners."],
  ["Light", "A shadow forms when...", ["An object blocks light", "Light bends around an object", "An object gives off darkness", "Light reflects off a mirror"], "Light can't pass through the object, so the space behind it is darker."],
  ["Light", "Which material is transparent?", ["Clear glass", "Wood", "Wax paper", "Metal"], "Transparent means light passes straight through so you can see clearly."],
  ["Light", "Wax paper lets some light through, but you can't see clearly through it. It is...", ["Translucent", "Transparent", "Opaque", "Magnetic"], "Translucent things let some light through but scatter it."],
  ["Light", "How does a mirror work?", ["It reflects light", "It absorbs light", "It makes its own light", "It bends sound"], "A smooth, shiny surface bounces light back in an orderly way."],
  ["Light", "Light hits a flat mirror at a slant. How does it bounce off?", ["At the same angle it came in", "Straight back the way it came, every time", "At a random angle", "It doesn't bounce; it goes through"], "Light leaves a mirror at the same angle it arrived. That's how you can aim a laser with mirrors."],
  ["Light", "What is white light made of?", ["All the colors mixed together", "No colors at all", "Only white", "Only yellow and blue"], "A prism or a rainbow spreads white light out into all its colors."],
  ["Light", "White light shines through a red filter. What color comes out?", ["Red", "White", "Blue", "No light at all"], "A red filter lets red light through and soaks up the other colors."],
  ["Light", "Red light shines on a blue filter. What happens?", ["Most of the light is blocked", "It turns blue", "It gets brighter", "It turns white"], "A blue filter only lets blue light through. Red light has no blue in it, so it is stopped."],
  ["Light", "Which tool uses two mirrors to let you see over a wall?", ["A periscope", "A microscope", "A thermometer", "A magnifying glass"], "Each mirror turns the light, so it goes up, across and back down to your eye."],
  ["Light", "Why does a straw look bent in a glass of water?", ["Light changes direction when it passes between water and air", "The water bends the straw", "The straw is actually bent", "Water makes part of the light disappear"], "This bending of light is called refraction."],
  ["Light", "Which of these travels fastest?", ["Light", "Sound", "A jet plane", "A race car"], "Light could circle Earth more than 7 times in one second."],
  ["Light", "Why does an apple look red?", ["It reflects red light and absorbs the other colors", "It makes its own red light", "It absorbs all the red light", "It reflects every color equally"], "The color you see is the light an object bounces back to your eyes."],
  ["Light", "Which of these makes the darkest shadow?", ["A wooden block", "A sheet of clear plastic", "Wax paper", "Thin tissue paper"], "Opaque things like wood block all the light. Translucent things let some through."],
  ["Light", "Why does a prism split white light into a rainbow?", ["Each color bends a different amount", "The prism paints the light", "The prism adds new colors", "Light turns into sound inside it"], "Violet bends the most and red the least, so the colors spread apart."],
  ["Light", "Scientists bounce lasers off mirrors that astronauts left on the Moon. What does that measure?", ["How far away the Moon is", "The Moon's temperature", "How heavy the Moon is", "What the Moon is made of"], "They time how long the light takes to go there and back."],

  // ---- Sound ----
  ["Sound", "Every sound is made by...", ["Vibrations", "Light", "Heat", "Magnets"], "Something moves back and forth quickly and pushes on the air."],
  ["Sound", "Tightening a guitar string makes its note...", ["Higher", "Lower", "Silent", "Change color"], "A tighter string vibrates faster, which makes a higher pitch."],
  ["Sound", "Sound can travel through...", ["Air, water and solids", "Only air", "Only water", "Empty space"], "Sound needs matter to carry its vibrations."],
  ["Sound", "Why is there no sound in space?", ["There's no air to carry the vibrations", "It's too cold", "It's too dark", "Space is too big"], "With nothing to vibrate, sound can't travel."],
  ["Sound", "A louder sound has...", ["Bigger vibrations", "A higher pitch", "A different color", "Less energy"], "Bigger vibrations (more amplitude) carry more energy and sound louder."],

  // ---- Electricity ----
  ["Electricity", "For a bulb to light up, the circuit must be...", ["Complete, with no gaps", "Open", "Cut in half", "Made of plastic"], "Electricity needs a full loop from the battery, through the bulb, and back."],
  ["Electricity", "Which is a good conductor of electricity?", ["Copper wire", "Rubber", "Plastic", "Wood"], "Metals like copper let electricity flow easily."],
  ["Electricity", "Why are wires covered in plastic?", ["Plastic is an insulator that keeps electricity in the wire", "Plastic makes electricity faster", "To make wires heavier", "Plastic conducts best"], "Insulators block electricity, which keeps you safe."],
  ["Electricity", "How does a switch turn a light off?", ["It opens a gap in the circuit", "It uses up the electricity", "It cools the battery", "It blocks the light"], "With a gap, the loop is broken and electricity stops flowing."],
  ["Electricity", "You add more bulbs in one single loop with the same battery. Each bulb gets...", ["Dimmer", "Brighter", "Exactly the same", "A different color"], "In a series circuit, the bulbs share the battery's energy."],
  ["Electricity", "A battery stores energy as...", ["Chemical energy", "Sound energy", "Light energy", "Motion energy"], "Chemicals inside react to push electricity through the circuit."],
  ["Electricity", "What do you call a complete loop that electricity can flow around?", ["A circuit", "A switch", "An insulator", "A magnet"], "Electricity only flows when there's an unbroken loop from the battery and back."],
  ["Electricity", "Two bulbs are on one single loop with a battery. You unscrew one. What happens to the other?", ["It goes out too", "It gets brighter", "It stays exactly the same", "It changes color"], "In a series circuit there's only one path. Break it anywhere and everything stops."],
  ["Electricity", "Two bulbs each have their own path to the battery. You unscrew one. What happens to the other?", ["It stays lit", "It goes out too", "It explodes", "It turns into a switch"], "This is a parallel circuit. Each bulb has its own path, the way homes are wired."],
  ["Electricity", "What is a short circuit?", ["Electricity taking an easy path that skips the bulb or device", "A circuit made with short wires", "A very small battery", "A bulb that is burned out"], "Current rushes through the easy path, so the bulb gets nothing and the wires can get hot."],
  ["Electricity", "Why can a short circuit be dangerous?", ["Too much current flows and the wires get very hot", "It makes the battery bigger", "It makes lights too bright", "It turns wires into magnets forever"], "That's why homes have fuses and circuit breakers to cut the power."],
  ["Electricity", "Which of these is an insulator?", ["A rubber glove", "A copper wire", "A steel nail", "Salt water"], "Rubber blocks electricity. Metals and salt water let it through."],
  ["Electricity", "What does a battery do in a circuit?", ["It gives the push that makes electricity flow", "It makes the light", "It blocks electricity", "It turns the circuit on and off"], "The battery's chemicals push electricity around the loop."],
  ["Electricity", "Electricity in a wire is a flow of tiny particles called...", ["Electrons", "Photons", "Bubbles", "Cells"], "Electrons are tiny particles found in every atom."],
  ["Electricity", "You add a third bulb to a single loop that already has two bulbs. What happens?", ["All three bulbs get dimmer", "All three get brighter", "Only the new bulb lights", "Nothing changes"], "Bulbs in series share the battery's push, so each one gets less."],
  ["Electricity", "Which device turns electricity into motion?", ["A motor", "A light bulb", "A switch", "A wire"], "Motors in fans, cars and toys use electricity and magnets to spin."],

  // ---- Magnets ----
  ["Magnets", "Which will a magnet pick up?", ["A steel paper clip", "An aluminum can", "A plastic spoon", "A wooden pencil"], "Magnets attract iron and steel, but not aluminum, plastic or wood."],
  ["Magnets", "Two north poles of magnets are pushed together. They...", ["Push apart", "Snap together", "Stick forever", "Do nothing"], "Like poles repel and opposite poles attract."],
  ["Magnets", "A magnet moves a paper clip without touching it. That's because magnetic force...", ["Can act at a distance", "Needs friction", "Is a kind of sound", "Only works on paper"], "Magnetism, like gravity, can pull without touching."],
  ["Magnets", "A magnet's pull on a paper clip gets weaker when...", ["The paper clip is farther away", "The paper clip is closer", "The magnet is painted", "The magnet is turned over"], "Magnetic force gets weaker with distance, like gravity does."],

  // ---- Heat ----
  ["Heat", "Which cup best keeps hot cocoa hot?", ["A foam cup", "A thin metal cup", "A thin glass cup", "A paper towel wrapped cup"], "Foam is an insulator, so heat escapes slowly."],
  ["Heat", "Heat always moves from...", ["Warmer things to cooler things", "Cooler things to warmer things", "Big things to small things", "Only upward"], "That's why ice melts in your hand and your hand gets cold."],
  ["Heat", "A metal spoon in hot soup gets hot quickly because metal is a good...", ["Conductor of heat", "Insulator", "Magnet", "Mirror"], "Conductors let heat move through them easily."],
  ["Heat", "Why does a black shirt feel hotter in the sun than a white one?", ["Dark colors absorb more sunlight", "Black shirts make their own heat", "Black shirts are always thicker", "White shirts block air"], "Dark colors soak up light energy; light colors reflect more of it."],
  ["Heat", "At what temperature does pure water boil at sea level?", ["100°C (212°F)", "0°C (32°F)", "50°C (122°F)", "37°C (98.6°F)"], "Above 100°C, liquid water turns into steam (a gas)."],
  ["Heat", "At what temperature does pure water freeze?", ["0°C (32°F)", "100°C (212°F)", "−100°C (−148°F)", "20°C (68°F)"], "Below 0°C, liquid water turns into ice (a solid)."],
  ["Matter", "Ice cubes float in a glass of water. Why?", ["Ice is less dense than liquid water", "Ice is heavier than water", "Ice is full of air bubbles from the freezer", "Cold things always float"], "Water expands when it freezes, so ice takes up more space for the same mass."],
  ["Matter", "In which state do water particles move the fastest?", ["Steam (gas)", "Ice (solid)", "Liquid water", "They all move the same"], "Heating gives particles more energy, so gas particles zoom around."],
  ["Matter", "Steam touches a cold window and turns into drops. What is this called?", ["Condensation", "Evaporation", "Melting", "Freezing"], "Cooling a gas turns it back into a liquid."],
  ["Matter", "What happens to water particles when water freezes?", ["They slow down and lock into place", "They speed up and spread out", "They disappear", "They turn into air"], "In a solid, particles only jiggle in place."],

  // ---- Plants ----
  ["Plants", "Where does most of a tree's wood mass come from?", ["Carbon dioxide from the air, plus water", "The soil", "Fertilizer", "Sunlight itself"], "Plants build themselves mostly from air and water, using sunlight's energy. The soil barely shrinks."],
  ["Plants", "What do plants need to make their own food?", ["Sunlight, water and carbon dioxide", "Soil and sugar", "Oxygen and darkness", "Meat and water"], "This process is called photosynthesis."],
  ["Plants", "Which part of a plant takes in water from the soil?", ["Roots", "Leaves", "Flowers", "Seeds"], "Roots soak up water and hold the plant in place."],
  ["Plants", "How do bees help flowering plants?", ["They carry pollen from flower to flower", "They water them", "They make soil", "They give them sunlight"], "Moving pollen lets the plant make seeds."],
  ["Plants", "A burr sticks to a dog's fur. This helps the plant...", ["Spread its seeds", "Protect the dog", "Make pollen", "Store water"], "The dog carries the seeds somewhere new."],
  ["Plants", "Plants give off which gas that animals need to breathe?", ["Oxygen", "Carbon dioxide", "Helium", "Smoke"], "Photosynthesis takes in carbon dioxide and releases oxygen."],
  ["Plants", "Most leaves are green because of...", ["Chlorophyll, which captures sunlight", "The water inside", "The soil", "Oxygen"], "Chlorophyll absorbs light energy for making food."],

  // ---- Human body and animals ----
  ["Body", "What does your heart do?", ["Pumps blood around your body", "Digests food", "Helps you think", "Fills with air"], "Blood carries oxygen and food to every part of you."],
  ["Body", "Which organs take in oxygen from the air?", ["Lungs", "Stomach", "Heart", "Kidneys"], "Oxygen passes from your lungs into your blood."],
  ["Body", "What is the job of your skeleton?", ["To support and protect your body", "To pump blood", "To digest food", "To help you breathe in"], "Bones hold you up and protect organs like your brain and heart."],
  ["Body", "Where does your body absorb most of the food you digest?", ["Small intestine", "Lungs", "Heart", "Mouth"], "Digested food passes through the small intestine wall into the blood."],
  ["Body", "How do your muscles move your bones?", ["By pulling on them", "By pushing them", "By melting", "By blowing air"], "Muscles can only pull, so they work in pairs."],
  ["Animals", "An owl's very large eyes help it...", ["See in dim light to hunt at night", "Fly faster", "Stay warm", "Smell its prey"], "Big eyes collect more light."],
  ["Animals", "Which animal is a vertebrate (has a backbone)?", ["Frog", "Worm", "Jellyfish", "Spider"], "Fish, frogs, reptiles, birds and mammals all have backbones."],
  ["Animals", "How many legs do all insects have?", ["Six", "Eight", "Four", "Ten"], "Spiders have eight legs, which is one way to tell they aren't insects."],
  ["Animals", "Living things too small to see without a microscope, like bacteria, are called...", ["Microorganisms", "Insects", "Seeds", "Fossils"], "Micro means very small."],

  // ---- Life cycles and heredity ----
  ["Life cycles", "A tadpole changing into a frog is called...", ["Metamorphosis", "Pollination", "Evaporation", "Photosynthesis"], "Metamorphosis is a big change in body form during a life cycle."],
  ["Life cycles", "What is the correct order of a butterfly's life cycle?", ["Egg, caterpillar, chrysalis, adult", "Caterpillar, egg, adult, chrysalis", "Egg, adult, caterpillar, chrysalis", "Chrysalis, egg, caterpillar, adult"], "The caterpillar eats and grows, then changes inside the chrysalis."],
  ["Heredity", "Which trait did you inherit from your parents?", ["Eye color", "A scar on your knee", "Knowing how to ride a bike", "Your favorite food"], "Inherited traits are passed down. Scars and skills come from life experiences."],
  ["Heredity", "Which trait comes from the environment, not the parents?", ["A plant growing taller because it got more sunlight", "A dog's fur color", "A cat's eye color", "A flower's petal shape"], "Sunlight, food and water can change how living things grow."],
  ["Heredity", "Puppies from the same parents all look a little different. This is called...", ["Variation", "Metamorphosis", "Erosion", "Pollination"], "Offspring get different mixes of traits from their parents."],
  ["Life cycles", "Fossils tell us about...", ["Living things and environments from long ago", "Tomorrow's weather", "The center of the sun", "What dinosaurs sounded like"], "A fish fossil on a mountain shows that place was once under water."],

  // ---- Ecosystems and adaptation ----
  ["Ecosystems", "In a food chain, plants are called...", ["Producers", "Consumers", "Decomposers", "Predators"], "Plants produce their own food from sunlight."],
  ["Ecosystems", "Mushrooms and worms that break down dead things are...", ["Decomposers", "Producers", "Predators", "Herbivores"], "Decomposers return nutrients to the soil."],
  ["Ecosystems", "In grass → rabbit → fox, what do the arrows show?", ["Energy moving to the animal that eats", "The rabbit eats the fox", "Which one is biggest", "Which way they walk"], "The arrow points from the food to the eater."],
  ["Ecosystems", "If all the rabbits in a forest disappeared, the foxes would most likely...", ["Have less food, so their numbers drop", "Grow in number", "Turn into plant eaters overnight", "Not be affected"], "Every part of a food web depends on the others."],
  ["Adaptation", "A polar bear's thick fur and fat are adaptations for...", ["Living in the cold", "Swimming in warm water", "Climbing trees", "Hiding in the desert"], "Adaptations are traits that help an animal survive where it lives."],
  ["Adaptation", "Why does a cactus store water in its thick stem?", ["Deserts get very little rain", "It likes being heavy", "Its roots don't work", "It rains every day in the desert"], "Storing water helps it survive long dry times."],
  ["Adaptation", "Animals with traits that help them survive are more likely to...", ["Have babies that inherit those traits", "Change their traits on purpose", "Live forever", "Become a new animal right away"], "Over many generations, helpful traits become more common. This is natural selection."],

  // ---- Weather and Earth ----
  ["Weather", "Weather is ___, while climate is ___.", ["Day-to-day conditions; the long-term pattern", "The long-term pattern; day-to-day conditions", "Rain; snow", "Hot; cold"], "It might snow today (weather) in a place that is usually warm (climate)."],
  ["Weather", "Which tool measures temperature?", ["Thermometer", "Rain gauge", "Ruler", "Wind vane"], "A wind vane shows wind direction and a rain gauge collects rain."],
  ["Earth", "Breaking rock into small pieces is weathering. Carrying the pieces away is...", ["Erosion", "Condensation", "Evaporation", "Photosynthesis"], "Water, wind and ice carry broken rock away. That's erosion."],
  ["Earth", "Which Earth change happens fast?", ["An earthquake", "A canyon forming", "A mountain wearing down", "Sand dunes slowly moving"], "Earthquakes, volcanoes and floods change land quickly. Erosion takes a very long time."],
  ["Earth", "Most of Earth's water is...", ["Salt water in the oceans", "Fresh water in lakes", "Ice in glaciers", "Water vapor in the air"], "About 97 out of every 100 drops are salty ocean water."],
  ["Earth", "What forms clouds?", ["Water vapor cooling into tiny drops", "Smoke from fires", "Salt from the ocean", "Melting ice"], "When water vapor rises and cools, it condenses into tiny drops."],
  ["Earth", "What powers the water cycle?", ["Energy from the sun", "The moon", "Earth's magnetism", "Wind turbines"], "The sun's heat evaporates water, and gravity brings rain back down."],
  ["Earth", "In layers of rock, the layers near the bottom are usually...", ["Older than the layers on top", "Younger than the layers on top", "The same age", "Made only of lava"], "New layers settle on top of older ones."],
  ["Earth", "Why are coal and oil called nonrenewable?", ["They take millions of years to form", "They are expensive", "They are black", "They burn"], "We use them much faster than nature can make more."],
  ["Earth", "A levee or sea wall helps reduce damage from...", ["Floods", "Earthquakes", "Volcanic ash", "Tornado winds"], "Engineers design walls to keep rising water out."],

  // ---- Space ----
  ["Space", "What causes day and night?", ["Earth spinning on its axis", "Earth moving around the sun", "The sun moving around Earth", "Clouds blocking the sun"], "One full spin takes about 24 hours."],
  ["Space", "How long does Earth take to travel once around the sun?", ["About one year", "One day", "One month", "One week"], "That trip is about 365 days."],
  ["Space", "Why does the sun look so much bigger and brighter than other stars?", ["It's much closer to us", "It's the biggest star in the universe", "It's the only real star", "Other stars turn off during the day"], "Many stars are bigger and brighter, but they are much farther away."],
  ["Space", "Why does the moon seem to change shape over a month?", ["We see different amounts of its sunlit side as it orbits", "Earth's shadow covers part of it", "Clouds cover part of it", "The moon actually changes shape"], "Half the moon is always lit. Its position decides how much of that half we see."],
  ["Space", "Why does the moon shine?", ["It reflects sunlight", "It's on fire", "It makes its own light", "It's a star"], "The moon is rock. Sunlight bounces off it."],
  ["Space", "Why does Earth have seasons?", ["Earth's axis is tilted", "Earth gets much closer to the sun in summer", "The sun gets hotter in summer", "The moon blocks the sun in winter"], "The tilt makes sunlight hit us more directly in summer. Earth is actually closest to the sun in January."],
  ["Space", "Which of these is a planet?", ["Mars", "The moon", "The sun", "The North Star"], "The sun and North Star are stars, and the moon orbits Earth."],
  ["Space", "When is your shadow shortest on a sunny day?", ["Around noon", "Early morning", "At sunset", "It never changes"], "The sun is highest in the sky around noon."],
  ["Space", "Why do we see different groups of stars in summer and winter?", ["Earth moves around the sun, so our night side faces different stars", "Stars move away in winter", "Clouds hide them in summer", "The moon hides them"], "As Earth orbits, the night sky points toward a different part of space."],

  // ---- Science skills ----
  ["Skills", "In a fair test, you should change...", ["Only one thing at a time", "Everything at once", "Nothing", "As many things as possible"], "Changing one thing lets you know what caused the result."],
  ["Skills", "Why do scientists repeat an experiment several times?", ["To make sure the results are reliable", "To use up supplies", "Because the first try is always wrong", "To get a different answer"], "If the results match each time, you can trust them more."],
  ["Skills", "Which unit measures mass?", ["Grams", "Meters", "Liters", "Degrees"], "Meters measure length, liters measure volume, and degrees measure temperature."],
  ["Skills", "Which unit measures the volume of a liquid?", ["Milliliters", "Grams", "Centimeters", "Seconds"], "Milliliters and liters measure how much space a liquid fills."],
  ["Skills", "In a claim backed by evidence, the evidence is...", ["Data or observations that support the claim", "Your opinion", "A guess", "The title of your report"], "Evidence is what you measured or saw."],
  ["Skills", "You test whether the surface changes how far a toy car rolls. What must stay the same?", ["The car and the ramp height", "The surface", "The distance rolled", "Nothing needs to stay the same"], "Keep everything the same except the surface."],
  ["Skills", "Which graph best shows how a plant's height changed each week?", ["A line graph", "A pie chart", "A map", "A Venn diagram"], "Line graphs show change over time."]
];
