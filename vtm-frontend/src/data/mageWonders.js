// M20 Mage Wonders catalogue
// Wonders are magical items created by mages — Devices, Talismans, Artifacts, Inventions, Gadgets

export const WONDER_TYPES = [
  { key: 'talisman', label: 'Talisman', description: 'A permanently enchanted item powered by Quintessence. Created using Prime 4+. Stores effects that activate on command.' },
  { key: 'device', label: 'Device', description: 'A Technocratic Wonder. Appears as advanced technology — a hypertech weapon, medical device, or computing system. Requires Enlightened Science.' },
  { key: 'artifact', label: 'Artifact', description: 'An ancient or legendary Wonder of great power. Usually found rather than created. Often has a will of its own.' },
  { key: 'trinket', label: 'Trinket', description: 'A minor Wonder with a single simple effect. Equivalent to a cantrip in a bottle. Easily created, easily broken.' },
  { key: 'periapt', label: 'Periapt', description: 'A Quintessence battery. Stores Quintessence for later use. Created with Prime 3+.' },
  { key: 'matrix', label: 'Matrix', description: 'A Quintessence-channelling device that can absorb ambient energy from a Node and store it.' },
  { key: 'fetish', label: 'Fetish (Mage)', description: 'A spirit-bound item similar to Garou fetishes. Created by binding a spirit into an object using Spirit 4+.' },
  { key: 'invention', label: 'Invention', description: 'A Son of Ether or Virtual Adept creation. Weird science — ray guns, Tesla coils, AI constructs.' },
  { key: 'gadget', label: 'Gadget', description: 'A single-use Technocratic device. Mass-produced, reliable, disposable. The supernatural equivalent of a grenade.' },
]

export const MAGE_WONDERS = [
  // ── Talismans ──
  { name: 'Enchanted Blade', type: 'talisman', level: 2, spheres: 'Forces 2, Prime 2', description: 'A blade that channels magical force. Deals aggravated damage to supernatural creatures.' },
  { name: 'Amulet of Warding', type: 'talisman', level: 2, spheres: 'Prime 2, Spirit 2', description: 'Provides magical protection. +2 dice to resist supernatural effects.' },
  { name: 'Ring of Mind Shielding', type: 'talisman', level: 3, spheres: 'Mind 3, Prime 2', description: 'Protects the wearer from telepathy, mind reading, and mental influence.' },
  { name: 'Cloak of Shadows', type: 'talisman', level: 3, spheres: 'Forces 3, Prime 2', description: 'Bends light around the wearer, granting near-invisibility.' },
  { name: 'Healing Stone', type: 'talisman', level: 3, spheres: 'Life 3, Prime 2', description: 'A smooth stone that heals one health level of damage when pressed to a wound. Requires 1 Quintessence per use.' },
  { name: 'Crystal Ball', type: 'talisman', level: 4, spheres: 'Correspondence 3, Prime 2', description: 'Allows remote viewing of distant locations. Requires 2 Quintessence per use.' },
  { name: 'Staff of the Elements', type: 'talisman', level: 5, spheres: 'Forces 4, Prime 3', description: 'A staff that channels elemental forces — fire, lightning, wind, ice. Devastating in combat.' },

  // ── Devices ──
  { name: 'Neural Disruptor', type: 'device', level: 2, spheres: 'Mind 2, Forces 2', description: 'A pistol-like device that stuns targets with focused neural interference.' },
  { name: 'Probability Compiler', type: 'device', level: 3, spheres: 'Entropy 3', description: 'A tablet-sized device that calculates probable outcomes with supernatural accuracy.' },
  { name: 'Dimensional Stabiliser', type: 'device', level: 3, spheres: 'Spirit 3, Correspondence 2', description: 'Reinforces or weakens the Gauntlet in an area. Technocratic tool for dimensional operations.' },
  { name: 'Med-Kit Alpha', type: 'device', level: 2, spheres: 'Life 2', description: 'An advanced medical kit with nanite-enhanced healing capability. Heals 2 health levels.' },
  { name: 'Cloaking Module', type: 'device', level: 4, spheres: 'Forces 3, Mind 2', description: 'A belt-mounted device that renders the wearer invisible and mentally undetectable.' },

  // ── Periapts ──
  { name: 'Quintessence Crystal', type: 'periapt', level: 1, spheres: 'Prime 3', description: 'A small crystal that stores up to 5 points of Quintessence.' },
  { name: 'Tass Vessel', type: 'periapt', level: 2, spheres: 'Prime 3', description: 'A container that can hold up to 10 points of Quintessence in solid Tass form.' },
  { name: 'Node Anchor', type: 'periapt', level: 3, spheres: 'Prime 4', description: 'A large crystal that anchors to a Node and collects Quintessence automatically. Stores up to 20 points.' },

  // ── Trinkets ──
  { name: 'Lucky Coin', type: 'trinket', level: 1, spheres: 'Entropy 1', description: 'A coin that tips probability slightly in the owner\'s favour. +1 die on one roll per day.' },
  { name: 'Mood Ring', type: 'trinket', level: 1, spheres: 'Mind 1', description: 'Changes colour to reflect the emotional state of nearby people.' },
  { name: 'Compass of Seeking', type: 'trinket', level: 1, spheres: 'Correspondence 1', description: 'Points toward a person or place the owner has previously visited.' },
  { name: 'Firefly Jar', type: 'trinket', level: 1, spheres: 'Forces 1, Prime 1', description: 'A jar that produces bright light on command. Never runs out.' },

  // ── Inventions ──
  { name: 'Etheric Goggles', type: 'invention', level: 2, spheres: 'Spirit 2, Forces 1', description: 'Brass goggles that allow the wearer to see spirits, Umbral entities, and magical auras.' },
  { name: 'Tesla Gauntlet', type: 'invention', level: 3, spheres: 'Forces 3, Prime 2', description: 'A wrist-mounted device that fires bolts of electricity. Deals aggravated damage.' },
  { name: 'Difference Engine', type: 'invention', level: 4, spheres: 'Correspondence 3, Mind 2', description: 'A mechanical computer that can access the Digital Web and process information at superhuman speed.' },

  // ── Artifacts (legendary) ──
  { name: 'Orb of the Seer', type: 'artifact', level: 5, spheres: 'Time 4, Correspondence 3', description: 'An ancient orb that grants visions of the future and past. Extremely dangerous to overuse.' },
  { name: 'Book of Shadows', type: 'artifact', level: 4, spheres: 'Spirit 4, Mind 3', description: 'A grimoire that contains the bound knowledge of dead mages. Can teach rotes but may have its own agenda.' },

  // ── M20 Core Book — Mystic Wonders ──
  { name: 'Trashades', type: 'trinket', level: 1, spheres: 'Forces 2, Prime 1', description: 'Enchanted glasses or goggles modified with perception-enhancing Effects — night vision, aura reading, or spirit sight. A simple yet potentially powerful variation on the classic "keep eyes" concept.' },
  { name: 'Bafflejack', type: 'device', level: 2, spheres: 'Forces 2, Mind 2', description: 'A cloaking device that shifts light, sound, and electronic spectra around the user while filtering the perceptions of nearby observers. Essentially portable, wearable invisibility for the modern age.' },
  { name: 'Bulletproof Hoodie', type: 'trinket', level: 2, spheres: 'Forces 2, Matter 2', description: 'Crafted in reaction to increasing violence, these enchanted garments deflect bullets, blades, and blunt trauma. The hoodie absorbs kinetic energy while looking like ordinary streetwear.' },

  // ── M20 Core Book — Technocratic Hardware ──
  { name: 'Falcon & Associates Elite Business Attire', type: 'device', level: 4, spheres: 'Forces 2, Life 2, Mind 1', description: 'High-fashion business suits with integrated armor, environmental control, and social enhancement. Provides protection against bashing and lethal damage while boosting social presence.' },
  { name: 'VDAS', type: 'device', level: 3, spheres: 'Correspondence 3, Mind 1', description: 'Visual Data Assessment Spectrum — a Technocratic field agent\'s connection to the Union\'s databases. A faint green data crawl rendered in abbreviations provides real-time intelligence and tactical information.' },
  { name: 'Alanson R-25 Hardsuit', type: 'device', level: 5, spheres: 'Forces 3, Life 2, Matter 3', description: 'Standard Iteration X power armor. Provides three additional health levels, reduces lethal damage from firearms, and integrates modular weapon systems. The gold standard of Technocratic field protection.' },
  { name: 'Primium Countermeasures', type: 'device', level: 4, spheres: 'Prime 3, Matter 2', description: 'Subdermal Primium implants that disrupt hostile magickal effects. After decades of experimentation, the Technocracy developed this anti-magick deterrent. Implanted agents gain resistance to Reality Deviation.' },

  // ── M20 Book of Secrets — Selected Wonders ──
  { name: 'Bond Fine Tobacco Products', type: 'gadget', level: 1, spheres: 'Mind 1, Life 1', description: 'Technocratic cigarettes and cigars that calm nerves and sharpen focus. Each smoke session grants +1 to Perception rolls for a scene. Mass-produced gadget-level items widely available among field agents.' },
  { name: 'Kismet Bindi', type: 'periapt', level: 2, spheres: 'Prime 3, Entropy 1', description: 'A decorative forehead jewel that serves as a Quintessence battery and minor fortune-enhancer. Stores up to 5 points of Quintessence and grants subtle luck to Entropy-related perception.' },
  { name: 'Ectoplasmic Disruption Rounds', type: 'gadget', level: 3, spheres: 'Spirit 3, Forces 2', description: 'Specialized ammunition that affects spiritual entities. These rounds deal aggravated damage to spirits, ghosts, and other ephemeral creatures, even those in the Penumbra.' },
  { name: 'Energy Drinks (Primal)', type: 'gadget', level: 1, spheres: 'Prime 2, Life 1', description: 'Mass-produced energy beverages laced with refined Quintessence. Each drink restores one point of Quintessence, but no more than three points per day before side effects manifest.' },
  { name: 'Ginger Dragons', type: 'trinket', level: 1, spheres: 'Forces 1, Matter 1', description: 'Small origami-style paper dragons enchanted with minor Forces effects. When activated, they produce bursts of flame, light, or heat — useful as distractions, fire-starters, or signal devices.' },
  { name: 'Oracle: The Essence', type: 'trinket', level: 4, spheres: 'Correspondence 3, Time 2, Mind 1', description: 'A crystal ball, scrying mirror, or computerized divination system of remarkable power. Allows observation of distant events, glimpses into the past, and prophetic impressions of probable futures.' },
  { name: 'Wolf-Paw Amulet', type: 'talisman', level: 3, spheres: 'Life 3, Spirit 2', description: 'Crafted from wolf components and bound with nature spirits. Grants enhanced senses, physical prowess, and lupine instinct — a partial shapeshifting effect connecting the wearer to the wild.' },
  { name: 'Totem Tattoo', type: 'talisman', level: 3, spheres: 'Spirit 3, Life 2', description: 'A living tattoo infused with spirit essence serving as a permanent connection to a totem spirit. The design shifts and moves on the wearer\'s skin, granting minor spiritual benefits and basic communication.' },
  { name: 'SPECM', type: 'matrix', level: 4, spheres: 'Prime 4, Matter 3', description: 'Standardized Primal Energy Containment Matrix — the Technocratic standard for Quintessence storage. These crystalline matrices hold up to 20 points of Primal Energy for safe transport and controlled field release.' },
  { name: 'Implanted Plasma Assault Unit', type: 'device', level: 5, spheres: 'Forces 4, Prime 3', description: 'A cybernetic weapon implanted in the arm that generates focused plasma blasts. Deals significant aggravated damage but consumes Quintessence per shot. Constitutes a vulgar Effect when witnessed.' },
]
