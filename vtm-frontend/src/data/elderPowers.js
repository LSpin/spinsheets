// V20 Elder Discipline Powers (levels 6-9)
// Only available to 7th generation and below
export const ELDER_POWERS = [
  // ── Animalism ──
  { name: "Species Speech", discipline: "Animalism", level: 6, description: "Communicate with and command entire species of animals simultaneously across a wide area." },
  { name: "Shared Soul", discipline: "Animalism", level: 6, description: "Merge your consciousness with an animal permanently, creating a loyal familiar with supernatural abilities." },
  { name: "Conquer the Beast", discipline: "Animalism", level: 7, description: "Permanently tame the Beast in another vampire, rendering them incapable of frenzy — and stripping them of its power." },
  { name: "Taunt the Caged Beast", discipline: "Animalism", level: 8, description: "Drive a vampire into an uncontrollable, directed frenzy at a target of your choosing." },
  { name: "Unchain the Ferocious Beast", discipline: "Animalism", level: 9, description: "Release your Beast as an independent entity that hunts and fights on your behalf while you remain calm." },

  // ── Auspex ──
  { name: "Clairvoyance", discipline: "Auspex", level: 6, description: "Perceive events at any location you have previously visited, regardless of distance." },
  { name: "Prediction", discipline: "Auspex", level: 6, description: "Brief flashes of the immediate future grant you the ability to anticipate actions before they happen." },
  { name: "Eagle's Sight", discipline: "Auspex", level: 6, description: "Project your senses to any point within several miles, perceiving as if physically present." },
  { name: "The Dreaming", discipline: "Auspex", level: 7, description: "Enter the dreams of a sleeping target and communicate, interrogate, or implant suggestions." },
  { name: "Psychic Assault", discipline: "Auspex", level: 7, description: "Launch a devastating mental attack that inflicts real damage on the target's psyche." },
  { name: "Karmic Sight", discipline: "Auspex", level: 8, description: "Perceive the complete history and karmic threads of any being you observe, including past lives and supernatural bonds." },
  { name: "False Slumber", discipline: "Auspex", level: 9, description: "Maintain full Auspex perception while in torpor, aware of everything around your body." },

  // ── Celerity ──
  { name: "Projectile", discipline: "Celerity", level: 6, description: "Move so fast you can run across water, up walls, or catch bullets out of the air." },
  { name: "Flower of Death", discipline: "Celerity", level: 7, description: "Strike every enemy within melee range simultaneously in a single blur of motion." },
  { name: "Zephyr", discipline: "Celerity", level: 8, description: "Move so fast you become effectively invisible and intangible for brief moments." },
  { name: "Lightning Strike", discipline: "Celerity", level: 9, description: "A single attack delivered at impossible speed — cannot be dodged, blocked, or perceived until after it lands." },

  // ── Chimerstry ──
  { name: "Fatuus Mastery", discipline: "Chimerstry", level: 6, description: "Maintain and direct multiple independent illusions simultaneously across a wide area." },
  { name: "Far Fatuus", discipline: "Chimerstry", level: 7, description: "Create illusions at any location you can visualize, even thousands of miles away." },
  { name: "Suspension of Disbelief", discipline: "Chimerstry", level: 8, description: "Your illusions become so real that even vampires who know they are fake cannot disbelieve them." },
  { name: "Mayaparisatya", discipline: "Chimerstry", level: 9, description: "Your illusions become permanently real — conjured objects persist, conjured beings live and breathe." },

  // ── Dementation ──
  { name: "Confusion of the Eye", discipline: "Dementation", level: 6, description: "Everyone in your presence sees everyone else as someone different — total perceptual chaos." },
  { name: "Kindred Spirits", discipline: "Dementation", level: 7, description: "Link your madness to another's mind permanently. They share your derangements and you share theirs." },
  { name: "Restructure", discipline: "Dementation", level: 8, description: "Completely rewrite a target's personality, memories, and mental architecture from scratch." },
  { name: "Personal Scourge", discipline: "Dementation", level: 9, description: "The target's own mind attacks them — their body suffers real aggravated damage from psychosomatic wounds." },

  // ── Dominate ──
  { name: "Rationalize", discipline: "Dominate", level: 6, description: "Commands implanted via Dominate feel like the target's own ideas — they never realize they were controlled." },
  { name: "Tranquility", discipline: "Dominate", level: 6, description: "Instill absolute calm in a target, suppressing frenzy, Rötschreck, and all strong emotions." },
  { name: "Mass Manipulation", discipline: "Dominate", level: 7, description: "Issue a single Dominate command that affects every mortal within earshot simultaneously." },
  { name: "Far Mastery", discipline: "Dominate", level: 7, description: "Use any Dominate power through electronic media — phone, video, or broadcast." },
  { name: "Still the Mortal Flesh", discipline: "Dominate", level: 8, description: "Command a mortal's autonomic functions — stop their heart, halt their breathing, or induce seizures." },
  { name: "Chain the Psyche", discipline: "Dominate", level: 9, description: "Permanently enslave a target's will. They obey you absolutely and cannot resist even with Willpower." },

  // ── Fortitude ──
  { name: "Personal Armor", discipline: "Fortitude", level: 6, description: "Your skin becomes supernaturally hard — soak aggravated damage from fire, sunlight, and claws with full dice pool." },
  { name: "Shared Strength", discipline: "Fortitude", level: 7, description: "Grant your Fortitude soak dice to any ally you can see for as long as you concentrate." },
  { name: "Adamantine", discipline: "Fortitude", level: 8, description: "Become virtually indestructible — even aggravated damage is downgraded to lethal before soaking." },
  { name: "Aegis", discipline: "Fortitude", level: 9, description: "For one turn, you are completely immune to all damage from any source. Nothing can harm you." },

  // ── Obfuscate ──
  { name: "Conceal", discipline: "Obfuscate", level: 6, description: "Hide a large object — a car, a building entrance, or a group of people — from all observers." },
  { name: "Mind Blank", discipline: "Obfuscate", level: 7, description: "Become completely invisible to Auspex and all supernatural detection. You simply do not exist to the senses." },
  { name: "Soul Mask", discipline: "Obfuscate", level: 7, description: "Alter your aura to display any emotions, Nature, or clan you choose — defeats Aura Perception completely." },
  { name: "Cache", discipline: "Obfuscate", level: 8, description: "Render an entire building or location invisible and undetectable to all senses and technology." },
  { name: "Create Name", discipline: "Obfuscate", level: 9, description: "Forge an entirely new supernatural identity — a different clan, generation, and blood. Even blood sorcery is fooled." },

  // ── Obtenebration ──
  { name: "The Darkness Within", discipline: "Obtenebration", level: 6, description: "Flood your body with the Abyss. Become a living shadow that can squeeze through cracks and resist all physical damage." },
  { name: "Shadow Step", discipline: "Obtenebration", level: 7, description: "Teleport instantly between any two shadows within your line of sight." },
  { name: "Shadow Body", discipline: "Obtenebration", level: 8, description: "Transform fully into a three-dimensional shadow — immune to physical damage, able to fly and pass through solid matter." },
  { name: "Abyss", discipline: "Obtenebration", level: 9, description: "Open a rift to the Abyss itself, consuming everything in the area in absolute darkness and cold." },

  // ── Potence ──
  { name: "Crush", discipline: "Potence", level: 6, description: "Grip and crush any object — steel, stone, bone — with casual ease. One-handed." },
  { name: "Earthshock", discipline: "Potence", level: 7, description: "Strike the ground to send a shockwave that knocks down and damages everyone within 30 feet." },
  { name: "Flick", discipline: "Potence", level: 8, description: "A casual flick of the finger delivers the force of a speeding car. Lethal at range with thrown pebbles." },
  { name: "Imprint", discipline: "Potence", level: 9, description: "Leave a permanent handprint in any surface — steel, diamond, or Fortitude-hardened flesh." },

  // ── Presence ──
  { name: "Love", discipline: "Presence", level: 6, description: "Inspire absolute devotion in a target — they will do anything for you, including die, without any blood bond." },
  { name: "Paralyzing Glance", discipline: "Presence", level: 6, description: "A single look freezes a target in place, unable to move or act until you break eye contact." },
  { name: "Irresistible Voice", discipline: "Presence", level: 7, description: "Your voice carries supernatural weight. Anyone who hears you speak must obey your emotional commands." },
  { name: "Cooperation", discipline: "Presence", level: 8, description: "Force two or more hostile parties into genuine cooperation and goodwill toward each other for a scene." },
  { name: "Star Magnetism", discipline: "Presence", level: 9, description: "Your mere existence draws people to you. Everyone within miles feels compelled to seek you out and serve you." },

  // ── Protean ──
  { name: "Earth Control", discipline: "Protean", level: 6, description: "While merged with the earth, move freely through soil and stone at walking speed." },
  { name: "Shape of the Beast's Wrath", discipline: "Protean", level: 6, description: "Take a massive war-form — a dire wolf or monstrous bat far larger and more powerful than the normal forms." },
  { name: "Homunculus", discipline: "Protean", level: 7, description: "Detach a portion of your body and animate it as an independent, loyal servant." },
  { name: "Dual Form", discipline: "Protean", level: 8, description: "Maintain two physical forms simultaneously — one acts while the other rests or hides." },
  { name: "Body of the Sun", discipline: "Protean", level: 9, description: "Transform into a miniature sun, radiating true sunlight that destroys all vampires nearby." },

  // ── Thaumaturgy ──
  { name: "Cobra's Favor", discipline: "Thaumaturgy", level: 6, description: "Transmute your blood into a supernaturally potent poison that destroys on contact." },
  { name: "Steal the Mind", discipline: "Thaumaturgy", level: 7, description: "Drain a target's memories and knowledge completely, adding them to your own." },
  { name: "Verdant Blade", discipline: "Thaumaturgy", level: 7, description: "Conjure a blade of pure Thaumaturgical energy that cuts through any defense, including Fortitude." },
  { name: "Blood Curse", discipline: "Thaumaturgy", level: 8, description: "Lay a permanent curse on a target's blood — every vampire who feeds from them is poisoned." },
  { name: "Rending the Will", discipline: "Thaumaturgy", level: 9, description: "Completely destroy a target's free will with a touch, turning them into an obedient shell permanently." },

  // ── Vicissitude ──
  { name: "Chiropteran Marauder", discipline: "Vicissitude", level: 6, description: "Transform into a massive bat-like war form with clawed wings, fangs, and sonar." },
  { name: "Cocoon", discipline: "Vicissitude", level: 6, description: "Encase yourself in a nearly indestructible carapace of bone and cartilage for protection during daysleep." },
  { name: "Blood of Acid", discipline: "Vicissitude", level: 7, description: "Transform your vitae into a corrosive acid that destroys anything it touches." },
  { name: "Body Arsenal", discipline: "Vicissitude", level: 8, description: "Transform any part of your body into a weapon — bone blades, acidic spit, or barbed tentacles — at will." },
  { name: "Rend the Unholy Flesh", discipline: "Vicissitude", level: 9, description: "With a touch, reduce any vampire to a puddle of vitae regardless of their Fortitude or generation." },

  // ── Necromancy ──
  { name: "Ghost Storm", discipline: "Necromancy", level: 6, description: "Tear open the Shroud in an area, allowing wraiths to manifest physically and creating a chaos of ghostly activity." },
  { name: "Death Pact", discipline: "Necromancy", level: 7, description: "Bind a wraith to absolute service for a year and a day through a ritual contract sealed in blood." },
  { name: "Withering", discipline: "Necromancy", level: 8, description: "Age a vampire to their true physical age, potentially reducing them to dust." },
  { name: "Dead Dominion", discipline: "Necromancy", level: 9, description: "Command all wraiths within a mile radius simultaneously, creating an army of the dead." },

  // ── Quietus ──
  { name: "Ripples of the Heart", discipline: "Quietus", level: 6, description: "Sense the heartbeat of every living being within a mile, locating them perfectly." },
  { name: "Blood Sweat", discipline: "Quietus", level: 6, description: "Force a target to sweat blood uncontrollably, draining their blood pool rapidly." },
  { name: "Selective Silence", discipline: "Quietus", level: 7, description: "Create a zone of absolute silence around a specific target — they cannot speak, scream, or make any sound." },
  { name: "Songs of Distant Vitae", discipline: "Quietus", level: 8, description: "Drain blood from a target at any distance as long as you can perceive them." },
  { name: "Condemn the Sins of the Father", discipline: "Quietus", level: 9, description: "Destroy a target's blood entirely, reducing them to dust regardless of generation." },

  // ── Serpentis ──
  { name: "Temptation", discipline: "Serpentis", level: 6, description: "Whisper a single desire into a target's ear that becomes their overriding obsession until fulfilled." },
  { name: "Typhonic Beast", discipline: "Serpentis", level: 7, description: "Transform into a massive supernatural serpent of immense size and power." },
  { name: "Corruption", discipline: "Serpentis", level: 8, description: "With a touch, permanently corrupt a target's Nature, twisting their personality toward evil." },
  { name: "Set's Curse", discipline: "Serpentis", level: 9, description: "Lay the curse of Set upon a target — they gain the Setite weakness to light permanently." },

  // ── Dominate-adjacent ──
  { name: "Loyalty", discipline: "Presence", level: 7, description: "Permanently inspire fanatical loyalty in a mortal or ghoul — they would die for you without hesitation." },
]
