// M20 Example Rotes — organized by primary Sphere
export const MAGE_ROTES = [
  // ── Correspondence ──
  { name: "Landscape of the Mind", level: 1, spheres: "Correspondence 1", description: "Sense the spatial relationships between objects and people in the immediate area. Know exactly where everything is within line of sight." },
  { name: "Whereami", level: 1, spheres: "Correspondence 1", description: "Instantly know your exact geographical location, including coordinates, elevation, and nearest landmarks." },
  { name: "Scrying", level: 2, spheres: "Correspondence 2", description: "Perceive a distant location you have previously visited as if you were physically present." },
  { name: "Hermes Portal", level: 3, spheres: "Correspondence 3", description: "Open a gateway between two locations, allowing physical passage through the intervening space." },
  { name: "Bubble of Reality", level: 4, spheres: "Correspondence 4, Prime 2", description: "Create a pocket of warped space that isolates an area from the outside world." },
  { name: "Co-Location", level: 4, spheres: "Correspondence 4", description: "Exist in two places simultaneously, acting independently in both locations." },

  // ── Entropy ──
  { name: "Ring of Truth", level: 1, spheres: "Entropy 1", description: "Sense whether a statement is true, false, or uncertain. Detects deliberate lies but not self-delusion." },
  { name: "Probability Scan", level: 1, spheres: "Entropy 1", description: "Read the likely outcomes of a situation — which way a coin will land, which card will be drawn." },
  { name: "Bless/Curse", level: 2, spheres: "Entropy 2", description: "Subtly shift probability in someone's favor or against them. Good luck or bad luck for a scene." },
  { name: "Slay Machine", level: 3, spheres: "Entropy 3", description: "Cause a mechanical or electronic device to suffer a critical, cascading failure." },
  { name: "Wither", level: 4, spheres: "Entropy 4, Life 3", description: "Accelerate decay in living tissue, causing rapid aging, necrosis, or organ failure." },
  { name: "Unmaking", level: 5, spheres: "Entropy 5", description: "Dissolve the pattern of an object or creature entirely, reducing it to raw chaos." },

  // ── Forces ──
  { name: "Quantify Energy", level: 1, spheres: "Forces 1", description: "Perceive all forms of energy — electricity, radiation, heat, kinetic force — and measure their intensity." },
  { name: "Flame Bolt", level: 2, spheres: "Forces 2, Prime 2", description: "Project a bolt of concentrated fire at a target. Classic offensive rote." },
  { name: "Lightning Bolt", level: 3, spheres: "Forces 3, Prime 2", description: "Call down or project a devastating bolt of electrical energy." },
  { name: "Invisibility", level: 2, spheres: "Forces 2", description: "Bend light around yourself to become invisible to normal sight." },
  { name: "Telekinesis", level: 2, spheres: "Forces 2", description: "Move objects at a distance using directed kinetic force." },
  { name: "Flight", level: 3, spheres: "Forces 3", description: "Negate gravity's pull on yourself, allowing levitation and true flight." },
  { name: "Tempest", level: 4, spheres: "Forces 4", description: "Summon or control a violent storm over a wide area — wind, rain, lightning." },
  { name: "Nuclear Fire", level: 5, spheres: "Forces 5, Prime 2", description: "Unleash devastating energy equivalent to a small nuclear detonation." },

  // ── Life ──
  { name: "Diagnose", level: 1, spheres: "Life 1", description: "Sense the health and condition of a living being — injuries, diseases, poisons, and general vitality." },
  { name: "Heal Self", level: 2, spheres: "Life 2", description: "Accelerate your own healing, mending wounds and curing diseases." },
  { name: "Heal Other", level: 3, spheres: "Life 3", description: "Heal another person's injuries, cure their diseases, or purge toxins from their system." },
  { name: "Shapechange", level: 3, spheres: "Life 3", description: "Transform your body into another human form — change sex, age, height, features." },
  { name: "Animal Form", level: 4, spheres: "Life 4", description: "Transform into an animal, gaining its physical capabilities while retaining your mind." },
  { name: "Perfect Metamorphosis", level: 4, spheres: "Life 4", description: "Reshape another person's body — heal, transform, or enhance their physical form." },
  { name: "Create Life", level: 5, spheres: "Life 5, Prime 2", description: "Create a living organism from raw Quintessence — from bacteria to complex animals." },

  // ── Matter ──
  { name: "Substance Analysis", level: 1, spheres: "Matter 1", description: "Identify the exact composition, structure, and properties of any material object." },
  { name: "Sculpt", level: 2, spheres: "Matter 2", description: "Reshape solid matter as if it were clay — bend steel, mold stone, reshape glass." },
  { name: "Transmutation", level: 3, spheres: "Matter 3, Prime 2", description: "Transform one substance into another — lead to gold, water to acid, air to stone." },
  { name: "Destroy Object", level: 3, spheres: "Matter 3", description: "Disintegrate a material object, breaking its molecular bonds." },
  { name: "Create Object", level: 4, spheres: "Matter 4, Prime 2", description: "Conjure a material object from raw Quintessence — weapons, tools, vehicles." },

  // ── Mind ──
  { name: "Sense Thoughts", level: 1, spheres: "Mind 1", description: "Read the surface thoughts and emotional state of a nearby target." },
  { name: "Telepathy", level: 2, spheres: "Mind 2", description: "Send and receive thoughts with a willing target at any distance." },
  { name: "Mental Shield", level: 2, spheres: "Mind 2", description: "Erect a psychic barrier that protects against mental intrusion and emotional manipulation." },
  { name: "Domination", level: 3, spheres: "Mind 3", description: "Seize control of a target's thoughts, implanting commands or suppressing memories." },
  { name: "Psychic Assault", level: 3, spheres: "Mind 3", description: "Launch a devastating mental attack that inflicts real damage on the target's psyche." },
  { name: "Mass Hallucination", level: 4, spheres: "Mind 4", description: "Project a complex illusion into the minds of everyone in an area." },
  { name: "Untether", level: 5, spheres: "Mind 5", description: "Project your consciousness permanently into another body, or exist as a disembodied mind." },

  // ── Prime ──
  { name: "Quintessence Perception", level: 1, spheres: "Prime 1", description: "Perceive the flow of Quintessence — see Nodes, Tass, enchanted objects, and magical effects." },
  { name: "Enchant Weapon", level: 2, spheres: "Prime 2", description: "Imbue a weapon with Quintessence, allowing it to harm spirits and supernatural creatures." },
  { name: "Channel Quintessence", level: 3, spheres: "Prime 3", description: "Draw Quintessence from a Node or Tass and direct it into yourself, an object, or another mage." },
  { name: "Enchant Object", level: 3, spheres: "Prime 3", description: "Permanently imbue an object with magical properties, creating a minor Wonder." },
  { name: "Create Tass", level: 4, spheres: "Prime 4", description: "Solidify raw Quintessence into Tass — physical material infused with magical energy." },
  { name: "Fountain of Prime", level: 5, spheres: "Prime 5", description: "Create a temporary Node that generates Quintessence, or supercharge an existing one." },

  // ── Spirit ──
  { name: "Spirit Sight", level: 1, spheres: "Spirit 1", description: "Peer through the Gauntlet to perceive spirits, the Penumbra, and spiritual activity." },
  { name: "Spirit Speech", level: 1, spheres: "Spirit 1", description: "Communicate with spirits across the Gauntlet without crossing over." },
  { name: "Step Sideways", level: 2, spheres: "Spirit 2", description: "Cross the Gauntlet into the Umbra, physically entering the spirit world." },
  { name: "Summon Spirit", level: 3, spheres: "Spirit 3", description: "Call a specific spirit to your location and compel it to appear." },
  { name: "Bind Spirit", level: 3, spheres: "Spirit 3", description: "Trap a spirit in an object, location, or magical circle." },
  { name: "Create Fetish", level: 4, spheres: "Spirit 4, Matter 2", description: "Bind a spirit into a physical object, creating a permanent magical item." },
  { name: "Forge Realm", level: 5, spheres: "Spirit 5", description: "Create a personal pocket Realm in the Umbra, shaping its landscape and laws." },

  // ── Time ──
  { name: "Time Sense", level: 1, spheres: "Time 1", description: "Perceive the flow of time with perfect accuracy. Know exact time, detect temporal disturbances." },
  { name: "Past Sight", level: 2, spheres: "Time 2", description: "Witness events that occurred in a specific location in the past." },
  { name: "Temporal Acceleration", level: 3, spheres: "Time 3", description: "Speed up your personal timeframe, gaining extra actions per turn." },
  { name: "Time Ward", level: 3, spheres: "Time 3", description: "Freeze an area in time — objects and creatures within are suspended until the effect ends." },
  { name: "Future Sight", level: 4, spheres: "Time 4", description: "Peer into possible futures to foresee likely outcomes of current actions." },
  { name: "Time Travel", level: 5, spheres: "Time 5", description: "Physically travel backward or forward through time. Extremely dangerous and paradox-prone." },

  // ── Multi-Sphere Classics ──
  { name: "Ball of Abysmal Flame", level: 3, spheres: "Forces 3, Prime 2", description: "Hurl a sphere of supernatural fire that detonates on impact. The classic Hermetic combat rote." },
  { name: "Polymorph Other", level: 4, spheres: "Life 4, Prime 2", description: "Transform another person into an animal or alien form against their will." },
  { name: "Raise the Dead", level: 5, spheres: "Life 5, Spirit 5, Prime 2", description: "Restore a dead person to life by reuniting their spirit with their healed body." },
  { name: "Rip the Gates", level: 4, spheres: "Spirit 4, Correspondence 3", description: "Tear open a gateway between the physical world and the Umbra large enough for a group to pass." },
  { name: "Aura of Power", level: 2, spheres: "Prime 2, Mind 1", description: "Radiate an aura of supernatural authority that inspires awe or fear in onlookers." },
  { name: "Postcognition", level: 3, spheres: "Time 2, Mind 2", description: "Relive the memories and experiences of a person who was present at a past event." },
]
