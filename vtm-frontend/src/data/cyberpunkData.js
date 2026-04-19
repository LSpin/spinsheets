// Cyberpunk 2020 - R. Talsorian Games

// ── Roles ──────────────────────────────────────────────────────────────────────

export const CP_ROLES = [
  { value: 'Solo', specialAbility: 'Combat Sense', description: 'Hired assassins, bodyguards, killers, soldiers — combat specialists' },
  { value: 'Netrunner', specialAbility: 'Interface', description: 'Cybernetic hackers who jack into the Net to steal data and programs' },
  { value: 'Techie', specialAbility: 'Jury Rig', description: 'Mechanics, inventors, and builders who keep Night City running' },
  { value: 'Media', specialAbility: 'Credibility', description: 'Journalists, reporters, and media personalities who shape public opinion' },
  { value: 'Cop', specialAbility: 'Authority', description: 'Law enforcement from beat cops to corporate security to MaxTac' },
  { value: 'Corporate', specialAbility: 'Resources', description: 'Corporate executives, fixers, and company men' },
  { value: 'Fixer', specialAbility: 'Streetdeal', description: 'Deal-makers, information brokers, and black market contacts' },
  { value: 'Nomad', specialAbility: 'Family', description: 'Road warriors, smugglers, and clan members of the nomad nations' },
  { value: 'Rockerboy', specialAbility: 'Charismatic Leadership', description: 'Rebel musicians, poets, and performers who fight the system with art' },
  { value: 'MedTechnic', specialAbility: 'Medical Tech', description: 'Doctors, ripperdocs, paramedics, and trauma team medics' },
]

export const CP_ROLE_CATALOG = CP_ROLES.map(r => ({ value: r.value, description: r.description }))

// ── Stats ──────────────────────────────────────────────────────────────────────

export const CP_STATS = [
  { key: 'cpInt', label: 'INT', full: 'Intelligence' },
  { key: 'cpRef', label: 'REF', full: 'Reflexes' },
  { key: 'cpTech', label: 'TECH', full: 'Technical Ability' },
  { key: 'cpCool', label: 'COOL', full: 'Cool/Willpower' },
  { key: 'cpAttr', label: 'ATTR', full: 'Attractiveness' },
  { key: 'cpLuck', label: 'LUCK', full: 'Luck' },
  { key: 'cpMa', label: 'MA', full: 'Movement Allowance' },
  { key: 'cpBody', label: 'BODY', full: 'Body Type' },
  { key: 'cpEmp', label: 'EMP', full: 'Empathy' },
]

// ── Skills by Stat ─────────────────────────────────────────────────────────────

export const CP_SKILLS_BY_STAT = {
  INT: [
    'Accounting', 'Anthropology', 'Awareness/Notice', 'Biology', 'Botany', 'Chemistry',
    'Composition', 'Diagnose Illness', 'Education & Gen. Know', 'Expert', 'Gamble',
    'Geology', 'Hide/Evade', 'History', 'Know Language', 'Library Search',
    'Mathematics', 'Physics', 'Programming', 'Shadow/Track', 'Stock Market',
    'System Knowledge', 'Teaching', 'Wilderness Survival', 'Zoology',
  ],
  REF: [
    'Archery', 'Athletics', 'Brawling', 'Dance', 'Dodge & Escape', 'Driving',
    'Fencing', 'Handgun', 'Heavy Weapons', 'Martial Arts', 'Melee',
    'Motorcycle', 'Operate Heavy Machinery', 'Pilot (Gyro)', 'Pilot (Fixed Wing)',
    'Pilot (Dirigible)', 'Pilot (Vectored Thrust)', 'Rifle', 'Stealth',
    'Submachinegun',
  ],
  TECH: [
    'Aero Tech', 'AV Tech', 'Basic Tech', 'Cryotank Operation', 'Cyberdeck Design',
    'CyberTech', 'Demolitions', 'Disguise', 'Electronics', 'Elect. Security',
    'First Aid', 'Forgery', 'Gyro Tech', 'Paint or Draw', 'Photo & Film',
    'Pharmacuticals', 'Pick Lock', 'Pick Pocket', 'Play Instrument',
    'Weaponsmith',
  ],
  COOL: [
    'Interrogation', 'Intimidate', 'Oratory', 'Resist Torture/Drugs',
    'Streetwise',
  ],
  ATTR: [
    'Personal Grooming', 'Wardrobe & Style',
  ],
  EMP: [
    'Human Perception', 'Interview', 'Leadership', 'Seduction',
    'Social', 'Persuasion & Fast Talk', 'Perform',
  ],
  BODY: [],
  LUCK: [],
  MA: [],
}

// ── Cyberware ──────────────────────────────────────────────────────────────────

export const CP_CYBERWARE = [
  // Neuralware
  { name: 'Neural Processor', category: 'Neuralware', humanityCost: 0, costEb: 1000, description: 'Required base for all neuralware — plugs into the brainstem' },
  { name: 'Kerenzikov Boosterware', category: 'Neuralware', humanityCost: 2, costEb: 500, description: '+2 Initiative, enhanced neural speed for combat reflexes' },
  { name: 'Sandevistan Speedware', category: 'Neuralware', humanityCost: 2, costEb: 1600, description: '+3 Initiative, burst of hyper-speed activated on demand' },
  { name: 'Tactile Boost', category: 'Neuralware', humanityCost: 2, costEb: 100, description: 'Enhanced sense of touch for fine detail work' },
  { name: 'Olfactory Boost', category: 'Neuralware', humanityCost: 2, costEb: 100, description: 'Enhanced sense of smell, can identify scents with precision' },
  { name: 'Pain Editor', category: 'Neuralware', humanityCost: 2, costEb: 200, description: 'Suppresses pain signals — ignore wound penalties' },
  { name: 'Cybermodem Link', category: 'Neuralware', humanityCost: 1, costEb: 100, description: 'Direct neural link to a cyberdeck for netrunning' },
  { name: 'Vehicle Link', category: 'Neuralware', humanityCost: 3, costEb: 100, description: 'Direct neural control of a vehicle interface' },
  { name: 'Smartgun Link', category: 'Neuralware', humanityCost: 2, costEb: 100, description: 'Neural link to a smartchipped weapon for +2 accuracy' },
  { name: 'Machine/Tech Link', category: 'Neuralware', humanityCost: 2, costEb: 100, description: 'Direct neural interface with machinery and tech devices' },
  { name: 'DataTerm Link', category: 'Neuralware', humanityCost: 1, costEb: 100, description: 'Allows direct connection to DataTerm public information networks' },
  { name: 'Chipware Socket', category: 'Neuralware', humanityCost: 2, costEb: 200, description: 'Socket for slotting skill and data chips directly into the brain' },
  { name: 'Interface Plugs', category: 'Neuralware', humanityCost: 3, costEb: 200, description: 'Wrist or temple plugs for direct machine interface' },

  // Optics
  { name: 'Cybereyes (Basic)', category: 'Optics', humanityCost: 2, costEb: 500, description: 'Replacement cybernetic eyes — required base for optical options' },
  { name: 'Anti-Dazzle', category: 'Optics', humanityCost: 0, costEb: 200, description: 'Automatic flash compensation, prevents blinding' },
  { name: 'Low Light', category: 'Optics', humanityCost: 0, costEb: 200, description: 'Amplifies available light for near-perfect night vision' },
  { name: 'Thermograph Sensor', category: 'Optics', humanityCost: 0, costEb: 200, description: 'Thermal imaging overlay shows heat signatures' },
  { name: 'Image Enhancement', category: 'Optics', humanityCost: 0, costEb: 300, description: '+2 Awareness for visually-based perception checks' },
  { name: 'Times Square Marquee', category: 'Optics', humanityCost: 1, costEb: 300, description: 'Scrolling text display across the surface of the eye' },
  { name: 'Targeting Scope', category: 'Optics', humanityCost: 0, costEb: 400, description: '+1 to ranged weapon attacks via targeting reticle overlay' },
  { name: 'Teleoptics', category: 'Optics', humanityCost: 0, costEb: 200, description: 'Telescopic zoom up to 20x magnification' },
  { name: 'Infrared', category: 'Optics', humanityCost: 0, costEb: 200, description: 'Infrared spectrum vision for seeing in total darkness' },
  { name: 'Ultraviolet', category: 'Optics', humanityCost: 0, costEb: 200, description: 'Ultraviolet spectrum vision, reveals UV-reactive markers' },
  { name: 'MicroOptics', category: 'Optics', humanityCost: 0, costEb: 150, description: 'Microscopic zoom up to 400x for fine detail inspection' },
  { name: 'Color Shift', category: 'Optics', humanityCost: 0, costEb: 300, description: 'Change eye color at will — cosmetic cyberoptic option' },

  // Audio
  { name: 'Cyberaudio (Basic)', category: 'Audio', humanityCost: 2, costEb: 500, description: 'Replacement cybernetic ear module — required base for audio options' },
  { name: 'Amplified Hearing', category: 'Audio', humanityCost: 0, costEb: 200, description: 'Enhanced hearing range and sensitivity, +2 hearing-based Awareness' },
  { name: 'Sound Editing', category: 'Audio', humanityCost: 0, costEb: 200, description: 'Filter, enhance, and isolate specific sounds from background noise' },
  { name: 'Level Damper', category: 'Audio', humanityCost: 0, costEb: 200, description: 'Automatic volume limiting prevents damage from loud sounds' },
  { name: 'Radio Link', category: 'Audio', humanityCost: 0, costEb: 100, description: 'Built-in radio transceiver for encrypted communications' },
  { name: 'Phone Splice', category: 'Audio', humanityCost: 0, costEb: 150, description: 'Internal cellular phone connected directly to cyberaudio' },
  { name: 'Scrambler/Descrambler', category: 'Audio', humanityCost: 0, costEb: 500, description: 'Encrypt and decrypt audio communications in real time' },
  { name: 'Bug Detector', category: 'Audio', humanityCost: 0, costEb: 200, description: 'Detects surveillance devices and transmitters in a 2m radius' },
  { name: 'Voice Stress Analyzer', category: 'Audio', humanityCost: 0, costEb: 200, description: 'Analyzes vocal stress patterns to detect lies (+2 Human Perception)' },
  { name: 'Enhanced Hearing Range', category: 'Audio', humanityCost: 0, costEb: 150, description: 'Extends hearing into ultrasonic and subsonic frequencies' },
  { name: 'Wearman', category: 'Audio', humanityCost: 0, costEb: 100, description: 'Built-in personal music player wired to cyberaudio' },
  { name: 'Radar Detector', category: 'Audio', humanityCost: 0, costEb: 200, description: 'Detects radar and lidar signals from speed traps and targeting' },

  // Cyberlimbs
  { name: 'Cyberarm (Standard)', category: 'Cyberlimbs', humanityCost: 2, costEb: 3000, description: 'Full cybernetic arm replacement with modular option mounts' },
  { name: 'Cyberleg (Standard)', category: 'Cyberlimbs', humanityCost: 2, costEb: 2000, description: 'Full cybernetic leg replacement with modular option mounts' },
  { name: 'Hydraulic Rams', category: 'Cyberlimbs', humanityCost: 1, costEb: 200, description: '+5 STR for that limb, crushing grip or leaping power' },
  { name: 'Thickened Myomar', category: 'Cyberlimbs', humanityCost: 1, costEb: 250, description: '+2 STR for that limb via enhanced synthetic muscle fibers' },
  { name: 'Quick Change Mount', category: 'Cyberlimbs', humanityCost: 0, costEb: 200, description: 'Snap-on mount for quickly swapping cyberlimb attachments' },
  { name: 'Rippers', category: 'Cyberlimbs', humanityCost: 3, costEb: 400, description: 'Slashing hand razors that extend from fingertips — 2D6+3 damage' },
  { name: 'Scratchers', category: 'Cyberlimbs', humanityCost: 2, costEb: 100, description: 'Light retractable claws — 1D6+2 damage, easily concealed' },
  { name: 'Wolvers', category: 'Cyberlimbs', humanityCost: 3, costEb: 600, description: 'Heavy retractable claws extending from the knuckles — 3D6 damage' },
  { name: 'Big Knucks', category: 'Cyberlimbs', humanityCost: 1, costEb: 500, description: 'Reinforced metal knuckles — 2D6 damage in melee' },
  { name: 'Cyberfinger', category: 'Cyberlimbs', humanityCost: 1, costEb: 100, description: 'Individual cybernetic finger with small option space' },
  { name: 'Grapple Hand', category: 'Cyberlimbs', humanityCost: 1, costEb: 350, description: 'Rocket-propelled grapple that launches from the wrist' },
  { name: 'Buzz Hand', category: 'Cyberlimbs', humanityCost: 2, costEb: 300, description: 'Spinning circular saw built into the palm — 2D6+1 damage' },
  { name: 'Tool Hand', category: 'Cyberlimbs', humanityCost: 1, costEb: 200, description: 'Retractable tool kit built into the fingers and palm' },
  { name: 'Reinforced Joints', category: 'Cyberlimbs', humanityCost: 0, costEb: 300, description: 'Hardened joints resist damage and increase limb durability' },

  // Body Plating
  { name: 'Skinweave', category: 'Body Plating', humanityCost: 2, costEb: 2000, description: 'Woven armor mesh under the skin — SP12, looks natural' },
  { name: 'Subdermal Armor', category: 'Body Plating', humanityCost: 3, costEb: 1200, description: 'Armor plates implanted beneath the skin — SP18' },
  { name: 'Body Plating', category: 'Body Plating', humanityCost: 5, costEb: 5000, description: 'Visible external armor plates bolted to the body — SP25' },

  // Internal
  { name: 'Nasal Filters', category: 'Internal', humanityCost: 2, costEb: 60, description: 'Filters toxins, gases, and biological agents from inhaled air' },
  { name: 'Gill Implant', category: 'Internal', humanityCost: 3, costEb: 400, description: 'Artificial gills allow breathing underwater indefinitely' },
  { name: 'Independent Air Supply', category: 'Internal', humanityCost: 2, costEb: 300, description: 'Internal air tank provides 25 minutes of breathable air' },
  { name: 'Mr. Studd Sexual Implant', category: 'Internal', humanityCost: 1, costEb: 300, description: 'Male performance enhancement implant — "all night, every night"' },
  { name: 'Midnight Lady Sexual Implant', category: 'Internal', humanityCost: 1, costEb: 300, description: 'Female performance enhancement implant — "be the envy of all"' },
  { name: 'Contraceptive Implant', category: 'Internal', humanityCost: 0, costEb: 100, description: 'Subcutaneous hormone implant for reliable contraception' },
  { name: 'Adrenal Booster', category: 'Internal', humanityCost: 1, costEb: 800, description: 'Synthetic adrenal gland boosts REF by +1 in combat situations' },
  { name: 'Motion Detector', category: 'Internal', humanityCost: 2, costEb: 200, description: 'Implanted sensor detects motion within a 20m radius' },
  { name: 'Digital Recorder', category: 'Internal', humanityCost: 1, costEb: 200, description: 'Internal recording device stores up to 100 hours of audio/video' },
  { name: 'Toxin Binders', category: 'Internal', humanityCost: 1, costEb: 150, description: 'Nanotech blood filters that neutralize poisons and drugs' },
  { name: 'Grafted Muscle', category: 'Internal', humanityCost: 2, costEb: 1000, description: '+2 BODY through synthetic muscle fiber enhancement' },
  { name: 'Bone Lace', category: 'Internal', humanityCost: 2, costEb: 1500, description: 'Reinforced skeleton with woven polymer lacing — harder to break' },

  // Fashionware
  { name: 'Biomonitor', category: 'Fashionware', humanityCost: 0, costEb: 150, description: 'Subdermal health monitor — displays vital signs on linked device' },
  { name: 'Skinwatch', category: 'Fashionware', humanityCost: 0, costEb: 50, description: 'LED time display visible beneath the skin of the wrist' },
  { name: 'Light Tattoo', category: 'Fashionware', humanityCost: 0, costEb: 20, description: 'Subcutaneous light-emitting tattoo, programmable patterns' },
  { name: 'Shift-Tacts', category: 'Fashionware', humanityCost: 0, costEb: 400, description: 'Color-changing contact lenses — shift iris color at will' },
  { name: 'ChemSkins', category: 'Fashionware', humanityCost: 0, costEb: 200, description: 'Chemical skin treatment that can change skin color' },
  { name: 'Synthskins', category: 'Fashionware', humanityCost: 0, costEb: 400, description: 'Synthetic skin overlay with custom textures and patterns' },
  { name: 'Techhair', category: 'Fashionware', humanityCost: 0, costEb: 200, description: 'Color-changing and light-emitting fiber optic hair' },

  // Linear Frames
  { name: 'Sigma Frame', category: 'Linear Frames', humanityCost: 4, costEb: 5000, description: 'Exoskeletal frame grafted to body — +2 BODY, enhanced strength' },
  { name: 'Beta Frame', category: 'Linear Frames', humanityCost: 6, costEb: 10000, description: 'Heavy exoskeletal frame — +4 BODY, massive strength enhancement' },

  // Body Weapons
  { name: 'Popup Gun', category: 'Body Weapons', humanityCost: 3, costEb: 600, description: 'Concealed firearm mounted in a cyberlimb, pops out for use' },
  { name: 'Cybersnake', category: 'Body Weapons', humanityCost: 3, costEb: 1200, description: 'Flexible cybernetic tentacle weapon with striking capability' },
  { name: 'Flamethrower Implant', category: 'Body Weapons', humanityCost: 4, costEb: 900, description: 'Concealed wrist-mounted flamethrower — 1D6/turn for 3 turns, 2m range' },
  { name: 'Grenade Launcher (Cyberarm)', category: 'Body Weapons', humanityCost: 4, costEb: 800, description: 'Single-shot grenade launcher mounted in a cyberarm' },
  { name: 'Micromissile Launcher', category: 'Body Weapons', humanityCost: 4, costEb: 1500, description: 'Shoulder or arm-mounted launcher for guided micromissiles — 4D6 damage' },

  // ── Chromebook Supplements ──

  // Neuralware (Chromebook)
  { name: 'Boosterware (Reflex)', category: 'Neuralware', humanityCost: 3, costEb: 2000, description: '+1 REF permanently wired reflex enhancement' },
  { name: 'Speedware', category: 'Neuralware', humanityCost: 3, costEb: 1200, description: '+2 Initiative, military-grade speed enhancement' },
  { name: 'Tactical Computer', category: 'Neuralware', humanityCost: 3, costEb: 2500, description: 'Combat analysis co-processor — +2 to tactical awareness and initiative' },
  { name: 'Memory Chip (MRAM)', category: 'Neuralware', humanityCost: 1, costEb: 300, description: 'External memory storage chip — record and replay memories perfectly' },
  { name: 'Skill Chip Socket', category: 'Neuralware', humanityCost: 2, costEb: 500, description: 'Advanced chipware socket supporting skill-level chip installation' },
  { name: 'Braindance Recorder', category: 'Neuralware', humanityCost: 2, costEb: 800, description: 'Records full sensory experiences for braindance playback' },
  { name: 'Behavioral Co-Processor', category: 'Neuralware', humanityCost: 3, costEb: 1500, description: 'Modifies emotional responses and behavioral patterns — +2 COOL in stress' },
  { name: 'Pain Suppressor', category: 'Neuralware', humanityCost: 1, costEb: 300, description: 'Reduces wound penalties by 1 level without full pain editor' },

  // Optics (Chromebook)
  { name: 'HUD Display', category: 'Optics', humanityCost: 0, costEb: 350, description: 'Heads-up display overlay showing ammo count, compass, and linked data' },
  { name: 'Dartgun (Cyberoptic)', category: 'Optics', humanityCost: 2, costEb: 400, description: 'Concealed dart launcher in cybereye — 1 shot, sleep or poison dart' },
  { name: 'Camera (Cyberoptic)', category: 'Optics', humanityCost: 0, costEb: 300, description: 'Built-in camera recording still images and video through cybereyes' },
  { name: 'Laser (Cyberoptic)', category: 'Optics', humanityCost: 2, costEb: 600, description: 'Low-power cutting laser — 1D6 damage at 1m range, useful as tool' },
  { name: 'Micro-Video', category: 'Optics', humanityCost: 0, costEb: 250, description: 'Miniaturized video playback in cybereye — internal media player' },
  { name: 'Cyberoptic Shield', category: 'Optics', humanityCost: 0, costEb: 500, description: 'Armored covering protects cybereyes from EMP and physical damage' },

  // Audio (Chromebook)
  { name: 'Sound Damper', category: 'Audio', humanityCost: 0, costEb: 300, description: 'Active noise cancellation — reduces ambient sound, protects from sonic weapons' },
  { name: 'Homing Tracer', category: 'Audio', humanityCost: 0, costEb: 250, description: 'Tracking signal receiver — follows planted audio beacons up to 1km' },
  { name: 'Tight Beam Radio', category: 'Audio', humanityCost: 1, costEb: 500, description: 'Directional radio link nearly impossible to intercept or jam' },
  { name: 'Wide Band Scanner', category: 'Audio', humanityCost: 1, costEb: 400, description: 'Scans all radio frequencies in range — eavesdrop on communications' },

  // Cyberlimbs (Chromebook)
  { name: 'Cyberarm (Armored)', category: 'Cyberlimbs', humanityCost: 3, costEb: 4500, description: 'Armored cybernetic arm — SP20 built-in armor plating' },
  { name: 'Cyberleg (Armored)', category: 'Cyberlimbs', humanityCost: 3, costEb: 3500, description: 'Armored cybernetic leg — SP20 built-in armor plating' },
  { name: 'Cyberarm (Superchrome)', category: 'Cyberlimbs', humanityCost: 4, costEb: 6000, description: 'High-end chrome arm with built-in weapon mounts and +3 STR' },
  { name: 'Spike Hand', category: 'Cyberlimbs', humanityCost: 2, costEb: 200, description: 'Retractable spike extending from the palm — 1D6+3 stabbing damage' },
  { name: 'Hammer Hand', category: 'Cyberlimbs', humanityCost: 2, costEb: 350, description: 'Pneumatic piston fist for devastating punches — 2D6+2 crushing damage' },
  { name: 'Shield Arm', category: 'Cyberlimbs', humanityCost: 2, costEb: 800, description: 'Deployable shield from forearm — SP25, covers torso when deployed' },
  { name: 'Extendable Limb', category: 'Cyberlimbs', humanityCost: 1, costEb: 500, description: 'Arm or leg extends by 1m via telescoping sections — extra reach' },
  { name: 'Spring Heels', category: 'Cyberlimbs', humanityCost: 1, costEb: 600, description: 'Spring-loaded legs double leap distance and reduce fall damage' },
  { name: 'Talon Foot', category: 'Cyberlimbs', humanityCost: 2, costEb: 300, description: 'Retractable toe blades — 2D6 kick damage, wall climbing grip' },
  { name: 'Skate Foot', category: 'Cyberlimbs', humanityCost: 0, costEb: 400, description: 'Retractable inline skate wheels in the feet — doubles MA on smooth surfaces' },

  // Body Plating (Chromebook)
  { name: 'FrontBack Skinweave', category: 'Body Plating', humanityCost: 3, costEb: 3000, description: 'Enhanced skinweave covering front and back — SP14' },
  { name: 'Hard Shell (Torso)', category: 'Body Plating', humanityCost: 5, costEb: 4000, description: 'Full torso exo-armor shell — SP30, visually obvious' },
  { name: 'Cowl', category: 'Body Plating', humanityCost: 3, costEb: 2000, description: 'Armored head covering with face plate — SP25 head protection' },

  // Internal (Chromebook)
  { name: 'Adrenaline Surge', category: 'Internal', humanityCost: 2, costEb: 1200, description: 'Activated boost gives +2 REF and +1 BODY for 1D6+1 turns, then crash' },
  { name: 'Implanted Comm', category: 'Internal', humanityCost: 1, costEb: 500, description: 'Internal radio communicator with encrypted channels' },
  { name: 'Implanted Agent', category: 'Internal', humanityCost: 2, costEb: 2000, description: 'Internal AI assistant for data management, scheduling, and research' },
  { name: 'Biomonitor (Internal)', category: 'Internal', humanityCost: 1, costEb: 300, description: 'Internal vital signs monitor — auto-injects medications when critical' },
  { name: 'Blood Pump', category: 'Internal', humanityCost: 2, costEb: 600, description: 'Secondary heart pump — survive 2 extra turns when at Mortal wounds' },
  { name: 'Skinalteration (Camouflage)', category: 'Internal', humanityCost: 2, costEb: 1000, description: 'Chromatophore skin cells change color to match surroundings — +4 Stealth' },
  { name: 'Enhanced Antibodies', category: 'Internal', humanityCost: 1, costEb: 500, description: 'Nanotech immune boost — heal at double rate, resist infection' },
  { name: 'Nanotech Hive', category: 'Internal', humanityCost: 3, costEb: 5000, description: 'Self-repairing nanomachines — heal 1 wound level per 12 hours automatically' },
  { name: 'Subdermal Pocket', category: 'Internal', humanityCost: 1, costEb: 200, description: 'Hidden pouch beneath the skin for concealing small objects' },
  { name: 'Radar/Sonar Implant', category: 'Internal', humanityCost: 2, costEb: 700, description: 'Internal radar — detect movement through walls up to 50m' },

  // Fashionware (Chromebook)
  { name: 'Mr. Studd (Chrome)', category: 'Fashionware', humanityCost: 1, costEb: 600, description: 'Premium version — chrome finish, enhanced performance' },
  { name: 'EMP Threading', category: 'Fashionware', humanityCost: 0, costEb: 500, description: 'EMP-hardened wiring protects all cyberware from electromagnetic pulses' },
  { name: 'Subdermal Clock', category: 'Fashionware', humanityCost: 0, costEb: 100, description: 'Internal atomic clock with alarm, timer, and stopwatch functions' },
  { name: 'Animated Tattoo', category: 'Fashionware', humanityCost: 0, costEb: 100, description: 'Moving animated tattoo using subdermal LED matrix' },
  { name: 'Holographic Tattoo', category: 'Fashionware', humanityCost: 0, costEb: 300, description: 'Projected 3D holographic display from subdermal emitters' },

  // Bioware (Chromebook 2+)
  { name: 'Muscle & Bone Lace', category: 'Bioware', humanityCost: 2, costEb: 3000, description: 'Biological enhancement — +2 BODY, +1 damage in melee, heals naturally' },
  { name: 'Grafted Reflexes', category: 'Bioware', humanityCost: 2, costEb: 4000, description: 'Biological reflex enhancement — +1 REF, lower humanity cost than cyber' },
  { name: 'Enhanced Endorphins', category: 'Bioware', humanityCost: 1, costEb: 500, description: 'Biological pain management — reduce wound penalties by 1' },
  { name: 'Cat Eyes', category: 'Bioware', humanityCost: 1, costEb: 800, description: 'Biological low-light vision — natural-looking, no cybereye required' },
  { name: 'Toxin Extractors', category: 'Bioware', humanityCost: 1, costEb: 600, description: 'Biological liver enhancement — +4 to resist poisons and drugs' },
  { name: 'Biolung', category: 'Bioware', humanityCost: 1, costEb: 700, description: 'Enhanced lung capacity — hold breath 10 minutes, filter mild toxins' },
  { name: 'Bio-Reticle', category: 'Bioware', humanityCost: 1, costEb: 1200, description: 'Biological targeting system grown into the retina — +1 ranged accuracy' },
  { name: 'Nanosurgeons', category: 'Bioware', humanityCost: 2, costEb: 6000, description: 'Permanent nanobot colony — heal 1 wound level per 6 hours, fight infections' },
  { name: 'Skin Weave (Bio)', category: 'Bioware', humanityCost: 1, costEb: 2500, description: 'Biological armor reinforcement — SP10, lower humanity cost than cyber skinweave' },

  // Exotic / Rare (Chromebook 3-4)
  { name: 'Full Body Cyborg Conversion', category: 'Exotic', humanityCost: 16, costEb: 100000, description: 'Complete body replacement — only the brain remains organic. BODY 12+, SP25, massive humanity loss' },
  { name: 'Gemini Body', category: 'Exotic', humanityCost: 8, costEb: 50000, description: 'Second cybernetic body you can transfer consciousness to — ultimate backup' },
  { name: 'Dragoon Body', category: 'Exotic', humanityCost: 14, costEb: 80000, description: 'Military full-body conversion — BODY 14, SP30, built-in heavy weapons' },
  { name: 'Aquatic Body Mod', category: 'Exotic', humanityCost: 6, costEb: 15000, description: 'Full aquatic conversion — gills, webbed hands, pressure resistance, sonar' },
  { name: 'Wings (Cybernetic)', category: 'Exotic', humanityCost: 6, costEb: 12000, description: 'Retractable cybernetic wings — powered flight up to 50 mph' },
  { name: 'Prehensile Tail', category: 'Exotic', humanityCost: 4, costEb: 3000, description: 'Fully articulated cybernetic tail — can grip, strike, and balance' },
  { name: 'Extra Cyberlimb Pair', category: 'Exotic', humanityCost: 6, costEb: 8000, description: 'Additional pair of arms mounted at the shoulders or waist' },
  { name: 'Exoskeleton (Powered)', category: 'Exotic', humanityCost: 4, costEb: 20000, description: 'External powered frame — BODY +6, Lift ×5, heavy weapon mount points' },
]

export const CP_CYBERWARE_CATALOG = CP_CYBERWARE.map(c => ({
  value: c.name,
  description: `${c.category} — ${c.description} (${c.costEb}eb, ${c.humanityCost} HL)`,
}))

// ── Weapons ────────────────────────────────────────────────────────────────────

export const CP_WEAPONS = [
  // Pistols
  { name: 'Budget Arms C-13', type: 'Light Pistol', accuracy: -1, conceal: 'P', avail: 'E', damage: '1D6+1', shots: 8, rof: 2, rel: 'ST', costEb: 75, description: 'Cheap, mass-produced light pistol — the Saturday Night Special' },
  { name: 'Dai Lung Cybermag 15', type: 'Light Pistol', accuracy: -1, conceal: 'P', avail: 'E', damage: '1D6+1', shots: 10, rof: 2, rel: 'UR', costEb: 50, description: 'Ultra-cheap Chinese knockoff — unreliable but plentiful' },
  { name: 'Federated Arms X-22', type: 'Light Pistol', accuracy: 0, conceal: 'P', avail: 'E', damage: '1D6+1', shots: 10, rof: 2, rel: 'ST', costEb: 150, description: 'Reliable light pistol favored by undercover operatives' },
  { name: 'Militech Arms Avenger', type: 'Medium Pistol', accuracy: 0, conceal: 'J', avail: 'E', damage: '2D6+1', shots: 10, rof: 2, rel: 'VR', costEb: 250, description: 'Workhorse autoloader — standard military sidearm' },
  { name: 'Sternmeyer Type 35', type: 'Medium Pistol', accuracy: 0, conceal: 'J', avail: 'C', damage: '2D6+1', shots: 8, rof: 2, rel: 'VR', costEb: 400, description: 'Heavy-duty corporate security pistol, excellent reliability' },
  { name: 'Medium Pistol (Generic)', type: 'Medium Pistol', accuracy: 0, conceal: 'J', avail: 'C', damage: '2D6+1', shots: 8, rof: 2, rel: 'ST', costEb: 200, description: 'Standard medium-caliber semi-automatic pistol' },
  { name: 'Colt AMT Model 2000', type: 'Heavy Pistol', accuracy: 0, conceal: 'J', avail: 'C', damage: '3D6', shots: 8, rof: 2, rel: 'VR', costEb: 500, description: 'Top-of-the-line heavy pistol with stopping power' },
  { name: 'Heavy Pistol (Generic)', type: 'Heavy Pistol', accuracy: -1, conceal: 'J', avail: 'C', damage: '3D6', shots: 8, rof: 2, rel: 'ST', costEb: 400, description: 'Large-caliber semi-automatic pistol' },
  { name: 'Very Heavy Pistol (Generic)', type: 'Very Heavy Pistol', accuracy: -1, conceal: 'L', avail: 'P', damage: '4D6+1', shots: 8, rof: 1, rel: 'ST', costEb: 450, description: 'Massive hand cannon for maximum damage' },

  // SMGs
  { name: 'Uzi Miniauto 9', type: 'Light SMG', accuracy: 1, conceal: 'J', avail: 'E', damage: '2D6+1', shots: 30, rof: 35, rel: 'VR', costEb: 475, description: 'Compact submachinegun, easily concealed under a jacket' },
  { name: 'Light SMG (Generic)', type: 'Light SMG', accuracy: 1, conceal: 'J', avail: 'E', damage: '2D6+1', shots: 30, rof: 25, rel: 'ST', costEb: 400, description: 'Compact submachinegun for close-quarters combat' },
  { name: 'Medium SMG (Generic)', type: 'Medium SMG', accuracy: 0, conceal: 'L', avail: 'C', damage: '2D6+3', shots: 30, rof: 25, rel: 'ST', costEb: 500, description: 'Standard submachinegun — balanced rate of fire and stopping power' },
  { name: 'Heavy SMG (Generic)', type: 'Heavy SMG', accuracy: -1, conceal: 'N', avail: 'P', damage: '3D6', shots: 40, rof: 20, rel: 'ST', costEb: 700, description: 'Large-frame submachinegun with heavy rounds' },

  // Rifles
  { name: 'FN-RAL', type: 'Assault Rifle', accuracy: 1, conceal: 'N', avail: 'C', damage: '5D6', shots: 30, rof: 30, rel: 'VR', costEb: 450, description: 'Standard NATO assault rifle — reliable and widespread' },
  { name: 'Kalashnikov A-80', type: 'Assault Rifle', accuracy: -1, conceal: 'N', avail: 'C', damage: '5D6', shots: 30, rof: 30, rel: 'ST', costEb: 550, description: 'Updated Kalashnikov design — rugged, dependable, cheap' },
  { name: 'Armalite 44', type: 'Assault Rifle', accuracy: 1, conceal: 'N', avail: 'C', damage: '5D6', shots: 30, rof: 30, rel: 'VR', costEb: 600, description: 'High-quality military assault rifle with excellent accuracy' },
  { name: 'Assault Rifle (Generic)', type: 'Assault Rifle', accuracy: 0, conceal: 'N', avail: 'C', damage: '5D6', shots: 30, rof: 30, rel: 'ST', costEb: 500, description: 'Standard military assault rifle' },
  { name: 'Sniper Rifle (Generic)', type: 'Sniper Rifle', accuracy: 2, conceal: 'N', avail: 'P', damage: '5D6', shots: 5, rof: 1, rel: 'VR', costEb: 700, description: 'Long-range precision rifle with scope mount' },

  // Shotguns
  { name: 'Shotgun (Generic)', type: 'Shotgun', accuracy: -1, conceal: 'N', avail: 'C', damage: '4D6', shots: 8, rof: 2, rel: 'ST', costEb: 500, description: 'Standard pump-action shotgun' },
  { name: 'Heavy Shotgun (Generic)', type: 'Heavy Shotgun', accuracy: -2, conceal: 'N', avail: 'P', damage: '4D6+3', shots: 8, rof: 1, rel: 'ST', costEb: 700, description: 'Military-grade auto-shotgun with devastating close-range power' },

  // Melee Weapons
  { name: 'Knife', type: 'Light Melee', accuracy: 0, conceal: 'P', avail: 'E', damage: '1D6', shots: '-', rof: '-', rel: '-', costEb: 20, description: 'Standard combat knife' },
  { name: 'Sword', type: 'Medium Melee', accuracy: 0, conceal: 'N', avail: 'C', damage: '2D6+2', shots: '-', rof: '-', rel: '-', costEb: 200, description: 'Standard blade — katana, broadsword, or similar' },
  { name: 'Sledgehammer', type: 'Heavy Melee', accuracy: -2, conceal: 'N', avail: 'C', damage: '4D6', shots: '-', rof: '-', rel: '-', costEb: 50, description: 'Heavy two-handed blunt weapon' },
  { name: 'Monoknife', type: 'Light Melee', accuracy: 1, conceal: 'P', avail: 'P', damage: '2D6', shots: '-', rof: '-', rel: '-', costEb: 200, description: 'Monomolecular-edged blade — cuts through almost anything' },
  { name: 'Monokatana', type: 'Medium Melee', accuracy: 1, conceal: 'N', avail: 'R', damage: '4D6', shots: '-', rof: '-', rel: '-', costEb: 600, description: 'Monomolecular-edged katana — the deadliest blade in Night City' },
  { name: 'Kendachi Mono-Three', type: 'Medium Melee', accuracy: 1, conceal: 'L', avail: 'P', damage: '4D6', shots: '-', rof: '-', rel: '-', costEb: 800, description: 'Top-of-the-line Kendachi monokatana with vibro-enhancement' },

  // ── Chromebook Weapons ──

  // Pistols (Chromebook)
  { name: 'Araska WAA Bullpup', type: 'Medium Pistol', accuracy: 0, conceal: 'J', avail: 'C', damage: '2D6+1', shots: 12, rof: 2, rel: 'VR', costEb: 500, description: 'Arasaka compact bullpup pistol — corporate favorite' },
  { name: 'Militech Crusher SSG', type: 'Heavy Pistol', accuracy: 0, conceal: 'L', avail: 'P', damage: '3D6+1', shots: 6, rof: 1, rel: 'VR', costEb: 600, description: 'Heavy revolver with extreme stopping power' },
  { name: 'Constitution Arms Hurricane', type: 'Very Heavy Pistol', accuracy: -1, conceal: 'L', avail: 'P', damage: '4D6+2', shots: 5, rof: 1, rel: 'ST', costEb: 600, description: 'Massive handgun that fires rifle-caliber rounds' },
  { name: 'Techtronica 15 Microwaver', type: 'Exotic Pistol', accuracy: 0, conceal: 'J', avail: 'R', damage: '1D6 (microwave)', shots: 10, rof: 2, rel: 'ST', costEb: 400, description: 'Microwave beam pistol — cooks targets from inside, ignores soft armor' },
  { name: 'Malorian Arms 3516', type: 'Heavy Pistol', accuracy: 1, conceal: 'J', avail: 'R', damage: '4D6', shots: 10, rof: 2, rel: 'VR', costEb: 1500, description: 'Johnny Silverhand\'s signature weapon — the finest handgun in Night City' },
  { name: 'Sternmeyer P-35', type: 'Medium Pistol', accuracy: 0, conceal: 'J', avail: 'C', damage: '2D6+3', shots: 14, rof: 2, rel: 'VR', costEb: 350, description: 'Updated Sternmeyer with extended magazine and improved barrel' },

  // SMGs (Chromebook)
  { name: 'Arasaka Rapid Assault 12', type: 'Medium SMG', accuracy: 1, conceal: 'L', avail: 'P', damage: '2D6+3', shots: 20, rof: 25, rel: 'VR', costEb: 900, description: 'Arasaka military SMG with integrated smartgun link' },
  { name: 'Militech Viper', type: 'Light SMG', accuracy: 1, conceal: 'J', avail: 'P', damage: '2D6+1', shots: 30, rof: 30, rel: 'VR', costEb: 650, description: 'Compact military SMG with folding stock and suppressor threading' },
  { name: 'Ingram MAC 14', type: 'Heavy SMG', accuracy: -1, conceal: 'L', avail: 'C', damage: '3D6', shots: 30, rof: 20, rel: 'ST', costEb: 500, description: 'Updated MAC design — cheap, high-volume, inaccurate' },

  // Rifles (Chromebook)
  { name: 'Militech Ronin Light Assault', type: 'Assault Rifle', accuracy: 2, conceal: 'N', avail: 'P', damage: '5D6', shots: 35, rof: 30, rel: 'VR', costEb: 1000, description: 'Top-tier military assault rifle — best accuracy in class' },
  { name: 'Arasaka WSSE Sniper System', type: 'Sniper Rifle', accuracy: 3, conceal: 'N', avail: 'R', damage: '5D6+3', shots: 6, rof: 1, rel: 'VR', costEb: 1200, description: 'Arasaka military sniper system — devastating at extreme range' },
  { name: 'Barrett-Arasaka Light 20', type: 'Anti-Materiel Rifle', accuracy: 1, conceal: 'N', avail: 'R', damage: '7D10', shots: 3, rof: 1, rel: 'VR', costEb: 3000, description: 'Anti-materiel rifle that destroys vehicles and light armor' },
  { name: 'Militech Mark IV Assault Weapon', type: 'Assault Rifle', accuracy: 1, conceal: 'N', avail: 'P', damage: '5D6', shots: 30, rof: 30, rel: 'VR', costEb: 800, description: 'Caseless ammunition assault rifle with underbarrel grenade launcher' },

  // Shotguns (Chromebook)
  { name: 'Militech Bulldog', type: 'Shotgun', accuracy: 0, conceal: 'N', avail: 'C', damage: '4D6', shots: 8, rof: 2, rel: 'VR', costEb: 450, description: 'Military combat shotgun with drum magazine' },
  { name: 'Arasaka Slugger', type: 'Heavy Shotgun', accuracy: -1, conceal: 'N', avail: 'P', damage: '5D6', shots: 5, rof: 1, rel: 'VR', costEb: 800, description: 'Auto-shotgun firing slugs — devastating anti-personnel weapon' },
  { name: 'Sawed-Off Shotgun', type: 'Shotgun', accuracy: -2, conceal: 'L', avail: 'C', damage: '4D6', shots: 2, rof: 2, rel: 'ST', costEb: 200, description: 'Concealable sawed-off — maximum spread, minimum range' },

  // Heavy Weapons (Chromebook)
  { name: 'Militech RPG-A', type: 'Heavy Weapon', accuracy: -1, conceal: 'N', avail: 'R', damage: '7D10', shots: 1, rof: 1, rel: 'VR', costEb: 2000, description: 'Shoulder-fired anti-armor rocket — single-shot, devastating' },
  { name: 'Arasaka HLR-12X Heavy Laser', type: 'Heavy Weapon', accuracy: 1, conceal: 'N', avail: 'R', damage: '5D6 (laser)', shots: 10, rof: 2, rel: 'VR', costEb: 8000, description: 'Crew-served heavy laser weapon — ignores non-laser armor' },
  { name: 'Grenade Launcher (M-79)', type: 'Heavy Weapon', accuracy: 0, conceal: 'N', avail: 'P', damage: '7D6 (area)', shots: 1, rof: 1, rel: 'VR', costEb: 525, description: 'Single-shot grenade launcher — 5m blast radius' },
  { name: 'Flamethrower', type: 'Heavy Weapon', accuracy: 0, conceal: 'N', avail: 'R', damage: '2D6/turn (fire)', shots: 10, rof: 1, rel: 'ST', costEb: 1500, description: 'Man-portable flamethrower — 10m range, sets targets alight' },
  { name: 'Militech Cowboy U-56 Grenade Launcher', type: 'Heavy Weapon', accuracy: 0, conceal: 'N', avail: 'R', damage: '7D6 (area)', shots: 6, rof: 2, rel: 'VR', costEb: 800, description: 'Revolving grenade launcher — 6 rounds of 40mm explosive' },
  { name: 'Minigun (Microgun)', type: 'Heavy Weapon', accuracy: 0, conceal: 'N', avail: 'R', damage: '5D6', shots: 200, rof: 100, rel: 'VR', costEb: 5000, description: 'Vehicle/cyborg-mounted rotating barrel minigun' },

  // Exotic / Special (Chromebook)
  { name: 'Tsunami Arms Helix', type: 'Exotic', accuracy: 0, conceal: 'J', avail: 'R', damage: '1D6+2 (x4 flechette)', shots: 8, rof: 4, rel: 'ST', costEb: 700, description: 'Flechette pistol firing clusters of needle-thin darts' },
  { name: 'EMP Grenade', type: 'Thrown', accuracy: 0, conceal: 'P', avail: 'R', damage: 'EMP (10m)', shots: 1, rof: 1, rel: '-', costEb: 500, description: 'Electromagnetic pulse grenade — disables electronics and cyberware in radius' },
  { name: 'Flashbang Grenade', type: 'Thrown', accuracy: 0, conceal: 'P', avail: 'C', damage: 'Stun (5m)', shots: 1, rof: 1, rel: '-', costEb: 30, description: 'Non-lethal flash/bang grenade — blinds and deafens for 1D6 turns' },
  { name: 'Frag Grenade', type: 'Thrown', accuracy: 0, conceal: 'P', avail: 'P', damage: '7D6 (5m)', shots: 1, rof: 1, rel: '-', costEb: 30, description: 'Standard fragmentation grenade' },
  { name: 'Smoke Grenade', type: 'Thrown', accuracy: 0, conceal: 'P', avail: 'C', damage: '-', shots: 1, rof: 1, rel: '-', costEb: 15, description: 'Smoke screen grenade — blocks vision in 5m radius for 1D6 turns' },
  { name: 'Taser/Stun Gun', type: 'Exotic', accuracy: 0, conceal: 'J', avail: 'C', damage: 'Stun', shots: 1, rof: 1, rel: 'ST', costEb: 60, description: 'Electrical stun weapon — target must make BODY save or be stunned' },
  { name: 'Paint/Dye Pellet Gun', type: 'Exotic', accuracy: 0, conceal: 'P', avail: 'E', damage: '-', shots: 10, rof: 2, rel: 'VR', costEb: 20, description: 'Non-lethal marker — used for surveillance and tagging targets' },
]

export const CP_WEAPONS_CATALOG = CP_WEAPONS.map(w => ({
  value: w.name,
  description: `${w.type} — ${w.description} (${w.damage} dmg, ${w.costEb}eb)`,
}))

// ── Armor ──────────────────────────────────────────────────────────────────────

export const CP_ARMOR = [
  { name: 'T-Shirt or Clothing', type: 'Light', sp: 0, ev: 0, covers: 'Torso', costEb: 5, description: 'Standard clothing — no armor protection' },
  { name: 'Leather Jacket', type: 'Light', sp: 4, ev: 0, covers: 'Torso, Arms', costEb: 50, description: 'Stylish and minimal protection — classic edgerunner look' },
  { name: 'Kevlar T-Shirt', type: 'Light', sp: 10, ev: 0, covers: 'Torso', costEb: 90, description: 'Concealable ballistic fabric shirt — worn under clothing' },
  { name: 'Light Armor Jacket', type: 'Medium', sp: 14, ev: 0, covers: 'Torso, Arms', costEb: 150, description: 'Armored street jacket with concealed ballistic panels' },
  { name: 'Medium Armor Jacket', type: 'Medium', sp: 18, ev: 1, covers: 'Torso, Arms', costEb: 200, description: 'Heavier armored jacket, slightly encumbering' },
  { name: 'Heavy Armor Jacket', type: 'Heavy', sp: 20, ev: 2, covers: 'Torso, Arms', costEb: 250, description: 'Obviously armored coat — serious protection' },
  { name: 'Flak Vest', type: 'Heavy', sp: 20, ev: 1, covers: 'Torso', costEb: 200, description: 'Military-grade ballistic vest' },
  { name: 'Flak Pants', type: 'Heavy', sp: 20, ev: 1, covers: 'Legs', costEb: 200, description: 'Military-grade armored trousers' },
  { name: 'Nylon Helmet', type: 'Heavy', sp: 20, ev: 0, covers: 'Head', costEb: 100, description: 'Reinforced nylon combat helmet' },
  { name: 'Steel Helmet', type: 'Medium', sp: 14, ev: 0, covers: 'Head', costEb: 30, description: 'Standard steel pot helmet' },
  { name: 'MetalGear', type: 'Heavy', sp: 25, ev: 3, covers: 'Full Body', costEb: 600, description: 'Full metal armor suit — maximum protection, very encumbering' },
  { name: 'Body Weight Suit', type: 'Heavy', sp: 18, ev: 2, covers: 'Full Body', costEb: 500, description: 'Lightweight ballistic full-body suit with tactical webbing' },

  // ── Chromebook Armor ──
  { name: 'Armored Trenchcoat', type: 'Medium', sp: 16, ev: 1, covers: 'Torso, Arms, Legs', costEb: 300, description: 'Full-length armored coat — edgerunner classic, decent coverage' },
  { name: 'Kevlar Vest (Tactical)', type: 'Medium', sp: 18, ev: 1, covers: 'Torso', costEb: 250, description: 'Tactical ballistic vest with MOLLE webbing for pouches' },
  { name: 'Riot Shield', type: 'Heavy', sp: 25, ev: 0, covers: 'Frontal', costEb: 200, description: 'Portable ballistic shield — provides cover in one direction' },
  { name: 'Door Gunner Vest', type: 'Heavy', sp: 22, ev: 2, covers: 'Torso', costEb: 350, description: 'Extra-heavy armored vest for vehicle gunners and sentries' },
  { name: 'Corporate Suit (Armored)', type: 'Light', sp: 12, ev: 0, covers: 'Torso, Arms', costEb: 800, description: 'Executive business suit with concealed ballistic lining — looks normal' },
  { name: 'Skinsuit', type: 'Light', sp: 8, ev: 0, covers: 'Full Body', costEb: 500, description: 'Skin-tight bodysuit with ballistic fiber weave — concealable under clothing' },
  { name: 'Arasaka WAM (Powered Armor)', type: 'Powered', sp: 30, ev: 0, covers: 'Full Body', costEb: 15000, description: 'Military powered armor exosuit — SP30, enhanced BODY +4, sealed environment' },
  { name: 'Militech Trooper (Powered Armor)', type: 'Powered', sp: 28, ev: 0, covers: 'Full Body', costEb: 12000, description: 'Militech infantry powered armor — SP28, BODY +3, HUD and comms integrated' },
  { name: 'Hard Shell (Head)', type: 'Heavy', sp: 25, ev: 0, covers: 'Head', costEb: 150, description: 'Heavy ballistic helmet with visor — SP25 head protection' },
  { name: 'Ballistic Face Shield', type: 'Medium', sp: 14, ev: 0, covers: 'Head (face)', costEb: 100, description: 'Transparent ballistic face shield attachment for helmets' },
  { name: 'Armored Boots', type: 'Medium', sp: 14, ev: 0, covers: 'Feet', costEb: 80, description: 'Reinforced boots with steel toe and ballistic sole' },
  { name: 'Netrunner Jumpsuit', type: 'Light', sp: 6, ev: 0, covers: 'Full Body', costEb: 400, description: 'Climate-controlled jumpsuit with minimal armor — optimized for extended netrunning sessions' },
]

export const CP_ARMOR_CATALOG = CP_ARMOR.map(a => ({
  value: a.name,
  description: `SP${a.sp}, EV${a.ev} — ${a.description} (${a.costEb}eb)`,
}))

// ── Gear ───────────────────────────────────────────────────────────────────────

export const CP_GEAR = [
  { name: 'Agent (Pocket Computer)', costEb: 100, description: 'Handheld personal digital assistant and communicator' },
  { name: 'Cell Phone', costEb: 100, description: 'Standard cellular phone with encrypted channel option' },
  { name: 'Binoculars', costEb: 20, description: 'Standard optical magnification binoculars' },
  { name: 'Flashlight', costEb: 5, description: 'Heavy-duty tactical flashlight' },
  { name: 'Handcuffs', costEb: 20, description: 'Standard restraint cuffs — steel or plastic' },
  { name: 'Rope (60m)', costEb: 10, description: '60 meters of high-tensile synthetic rope' },
  { name: 'Medkit (Basic)', costEb: 50, description: 'Basic first aid kit with bandages, antiseptic, and painkillers' },
  { name: 'Medkit (Military)', costEb: 200, description: 'Military-grade trauma kit with auto-injectors and surgical tools' },
  { name: 'Tech Tool Kit', costEb: 100, description: 'Portable toolkit for electronics and mechanical repair' },
  { name: 'B&E (Break & Entry) Kit', costEb: 120, description: 'Lock picks, bypass tools, and security cracking equipment' },
  { name: 'Electronics Tool Kit', costEb: 100, description: 'Specialized toolkit for electronic repair and modification' },
  { name: 'Cyberdeck', costEb: 2000, description: 'Portable netrunning deck for jacking into the Net' },
  { name: 'Programs (Basic)', costEb: 50, description: 'Basic utility software package for netrunning' },
  { name: 'Bug/Tap Detector', costEb: 150, description: 'Portable device for detecting surveillance equipment' },
  { name: 'Radar Detector', costEb: 50, description: 'Vehicle-mounted radar and lidar detection device' },
  { name: 'Homing Tracer', costEb: 100, description: 'Small GPS tracking device, transmits location via radio' },
  { name: 'Drugs (Misc.)', costEb: 50, description: 'Street drugs — stim, syncomp, boost, black lace, etc.' },
  { name: 'Sleeping Bag', costEb: 25, description: 'Insulated sleeping bag rated for urban or wilderness survival' },
  { name: 'Tent (2-Person)', costEb: 40, description: 'Lightweight two-person shelter' },
  { name: 'Inflatable Raft', costEb: 250, description: 'Self-inflating watercraft with oars' },
  { name: 'Disposable Cell Phone', costEb: 10, description: 'Untraceable prepaid burner phone' },

  // ── Chromebook Gear ──
  { name: 'Cyberdeck (Military)', costEb: 5000, description: 'Military-grade cyberdeck with enhanced processing and ICE resistance' },
  { name: 'Cyberdeck (Arasaka)', costEb: 8000, description: 'Top-of-the-line Arasaka netrunning deck — fastest on the market' },
  { name: 'Auto-Medic Unit', costEb: 500, description: 'Automated medical unit — diagnoses and treats injuries without a medic' },
  { name: 'Trauma Team Card (Basic)', costEb: 500, description: 'Annual Trauma Team membership — emergency medical extraction and treatment' },
  { name: 'Trauma Team Card (Corporate)', costEb: 5000, description: 'Premium Trauma Team membership — priority response, full coverage' },
  { name: 'Scrambler/Descrambler', costEb: 500, description: 'Portable encryption/decryption unit for radio and phone communications' },
  { name: 'Data Chip (Blank)', costEb: 10, description: 'Blank memory chip for storing data — holds ~100 GB' },
  { name: 'Video Camera', costEb: 150, description: 'Handheld video recording device with zoom and night mode' },
  { name: 'Digital Recorder', costEb: 100, description: 'Pocket-sized audio recording device with 48+ hours of storage' },
  { name: 'Smart Goggles', costEb: 300, description: 'AR-enabled goggles with HUD display, compatible with smartgun link' },
  { name: 'Night Vision Goggles', costEb: 200, description: 'Amplified light goggles for near-perfect darkness vision' },
  { name: 'Thermograph Goggles', costEb: 250, description: 'Thermal imaging goggles — see heat signatures through smoke and darkness' },
  { name: 'Grapple Gun', costEb: 150, description: 'Pneumatic grappling hook launcher with 50m range and motor winch' },
  { name: 'Climbing Gear', costEb: 100, description: 'Harness, carabiners, pitons, and rope for technical climbing' },
  { name: 'Parachute', costEb: 300, description: 'Emergency base-jump or HALO parachute — single use' },
  { name: 'Gas Mask', costEb: 30, description: 'Full-face gas mask with replaceable filter cartridge' },
  { name: 'Armor-Piercing Ammo (box)', costEb: 100, description: 'Box of 50 AP rounds — halves armor SP, -1 damage die' },
  { name: 'Hollow Point Ammo (box)', costEb: 50, description: 'Box of 50 HP rounds — +1 damage die vs. unarmored, useless vs. armor' },
  { name: 'Tracer Ammo (box)', costEb: 60, description: 'Box of 50 tracer rounds — visible streaks help aim (+1 after first hit)' },
  { name: 'Smart Ammo (box)', costEb: 200, description: 'Box of 50 gyrojet smart rounds — guided by smartgun link, +2 accuracy' },
  { name: 'Suppressor', costEb: 200, description: 'Barrel suppressor — reduces weapon sound, -1 damage' },
  { name: 'Laser Sight', costEb: 100, description: 'Weapon-mounted laser pointer — +1 accuracy at close range' },
  { name: 'Extended Magazine', costEb: 50, description: 'Doubles weapon ammo capacity for most firearms' },
  { name: 'Speedloader', costEb: 25, description: 'Quick-load device for revolvers — reload as a single action' },
  { name: 'Tactical Vest', costEb: 100, description: 'MOLLE vest for carrying magazines, grenades, and equipment' },
  { name: 'Sleeping Drugs (dose)', costEb: 20, description: 'Fast-acting sedative — inhaled, injected, or in drink' },
  { name: 'Stim Pack (dose)', costEb: 25, description: 'Combat stimulant — +1 REF for 1 hour, then crash' },
  { name: 'SpeedHeal (dose)', costEb: 100, description: 'Accelerated healing drug — recover 1 wound level in 6 hours' },
  { name: 'Black Lace (dose)', costEb: 50, description: 'Dangerous combat drug — +2 REF, +2 COOL, highly addictive, humanity damage' },
  { name: 'Smash (dose)', costEb: 10, description: 'Street drug — endorphin booster, feel-good high, mildly addictive' },
  { name: 'Synthcoke (dose)', costEb: 20, description: 'Synthetic cocaine — alertness boost, appetite suppressant, moderately addictive' },
]

export const CP_GEAR_CATALOG = CP_GEAR.map(g => ({
  value: g.name,
  description: `${g.description} (${g.costEb}eb)`,
}))

// ── Vehicles ──────────────────────────────────────────────────────────────────

export const CP_VEHICLES = [
  // Motorcycles
  { name: 'Motorcycle (Standard)', type: 'Motorcycle', topSpeed: 150, maneuver: 2, sdp: 12, sp: 0, seats: 2, costEb: 2000, description: 'Standard street motorcycle — fast and maneuverable' },
  { name: 'Kawasaki Razorbike', type: 'Motorcycle', topSpeed: 200, maneuver: 3, sdp: 10, sp: 0, seats: 1, costEb: 6000, description: 'Racing motorcycle — extreme speed, minimal protection' },
  { name: 'Harley-Davidson Scorpion', type: 'Motorcycle', topSpeed: 120, maneuver: 1, sdp: 15, sp: 5, seats: 2, costEb: 3500, description: 'Heavy cruiser motorcycle — slower but tougher and more comfortable' },
  { name: 'BMW Blitz', type: 'Motorcycle', topSpeed: 180, maneuver: 2, sdp: 12, sp: 0, seats: 2, costEb: 4000, description: 'Sport touring bike — balanced speed and reliability' },
  { name: 'Off-Road Bike', type: 'Motorcycle', topSpeed: 100, maneuver: 3, sdp: 10, sp: 0, seats: 1, costEb: 1500, description: 'Dirt bike for off-road travel — light, agile, low top speed' },

  // Compact & Economy Cars
  { name: 'Economy Car', type: 'Car', topSpeed: 100, maneuver: 0, sdp: 20, sp: 0, seats: 4, costEb: 2000, description: 'Cheap compact car — basic transportation' },
  { name: 'Volkswagen Electra', type: 'Car', topSpeed: 120, maneuver: 0, sdp: 22, sp: 3, seats: 4, costEb: 4000, description: 'Reliable electric compact with light armor option' },
  { name: 'Toyota-Lexus C-40', type: 'Car', topSpeed: 130, maneuver: 1, sdp: 22, sp: 5, seats: 4, costEb: 6000, description: 'Mid-range sedan with factory armor package' },

  // Sports & Performance Cars
  { name: 'Sports Car (Standard)', type: 'Car', topSpeed: 180, maneuver: 2, sdp: 20, sp: 0, seats: 2, costEb: 8000, description: 'High-performance sports car — speed over protection' },
  { name: 'Porsche 911 Turbo S', type: 'Car', topSpeed: 220, maneuver: 2, sdp: 18, sp: 0, seats: 2, costEb: 35000, description: 'Premium sports car — blistering speed, luxury appointments' },
  { name: 'Lamborghini Countach', type: 'Car', topSpeed: 200, maneuver: 2, sdp: 18, sp: 0, seats: 2, costEb: 30000, description: 'Exotic supercar — statement vehicle for the ultra-rich' },
  { name: 'Quadra Turbo-R V-Tech', type: 'Car', topSpeed: 190, maneuver: 2, sdp: 22, sp: 5, seats: 2, costEb: 15000, description: 'Night City street racer favorite — fast with light armor' },

  // Sedans & Luxury
  { name: 'Corporate Sedan', type: 'Car', topSpeed: 140, maneuver: 0, sdp: 30, sp: 10, seats: 4, costEb: 10000, description: 'Armored corporate sedan — bulletproof glass, run-flat tires' },
  { name: 'Rolls-Royce Silver Shadow', type: 'Car', topSpeed: 120, maneuver: -1, sdp: 35, sp: 15, seats: 4, costEb: 50000, description: 'Ultra-luxury armored limousine — corporate executive transport' },
  { name: 'Arasaka Executive Transport', type: 'Car', topSpeed: 130, maneuver: 0, sdp: 40, sp: 20, seats: 6, costEb: 80000, description: 'Heavily armored corporate vehicle — RPG-resistant, electronic countermeasures' },

  // SUVs & Trucks
  { name: 'SUV (Standard)', type: 'Truck', topSpeed: 110, maneuver: -1, sdp: 30, sp: 5, seats: 6, costEb: 5000, description: 'Sport utility vehicle — good off-road capability' },
  { name: 'Toyota Land Cruiser', type: 'Truck', topSpeed: 100, maneuver: -1, sdp: 35, sp: 8, seats: 6, costEb: 8000, description: 'Rugged off-road SUV — nomad favorite' },
  { name: 'Pickup Truck', type: 'Truck', topSpeed: 100, maneuver: -1, sdp: 30, sp: 3, seats: 3, costEb: 3000, description: 'Standard pickup — useful for hauling gear and mounting weapons' },
  { name: 'Militech Tactical Truck', type: 'Truck', topSpeed: 90, maneuver: -2, sdp: 50, sp: 20, seats: 8, costEb: 25000, description: 'Military armored personnel carrier — transports a squad under fire' },

  // Vans
  { name: 'Van (Standard)', type: 'Van', topSpeed: 100, maneuver: -1, sdp: 25, sp: 3, seats: 8, costEb: 3000, description: 'Standard cargo/passenger van' },
  { name: 'Armored Van', type: 'Van', topSpeed: 90, maneuver: -1, sdp: 35, sp: 15, seats: 6, costEb: 12000, description: 'Armored security van — used by corporate couriers and NCPD' },
  { name: 'Mobile Command Van', type: 'Van', topSpeed: 80, maneuver: -2, sdp: 30, sp: 10, seats: 4, costEb: 15000, description: 'Communications and command center on wheels — full electronics suite' },
  { name: 'Nomad RV', type: 'Van', topSpeed: 70, maneuver: -2, sdp: 40, sp: 10, seats: 6, costEb: 8000, description: 'Nomad-modified recreational vehicle — mobile home with armor and weapons' },

  // Aerial Vehicles
  { name: 'AV-4 (Aerodyne)', type: 'AV', topSpeed: 300, maneuver: 1, sdp: 30, sp: 15, seats: 4, costEb: 50000, description: 'Standard aerodyne VTOL vehicle — the flying car of the future' },
  { name: 'AV-6 (Combat Aerodyne)', type: 'AV', topSpeed: 350, maneuver: 2, sdp: 40, sp: 25, seats: 4, costEb: 120000, description: 'Military combat aerodyne — armed and armored, used by Trauma Team and military' },
  { name: 'AV-9 (Heavy Transport)', type: 'AV', topSpeed: 250, maneuver: 0, sdp: 50, sp: 20, seats: 10, costEb: 200000, description: 'Heavy cargo/troop transport aerodyne — carries a full squad or heavy equipment' },
  { name: 'Osprey III (Hybrid)', type: 'AV', topSpeed: 400, maneuver: 1, sdp: 35, sp: 20, seats: 8, costEb: 150000, description: 'Tiltrotor VTOL aircraft — long range, fast, used for covert insertion' },
  { name: 'Helicopter (Standard)', type: 'AV', topSpeed: 200, maneuver: 1, sdp: 25, sp: 5, seats: 4, costEb: 20000, description: 'Standard helicopter — civilian or converted military surplus' },
  { name: 'Attack Helicopter', type: 'AV', topSpeed: 250, maneuver: 2, sdp: 35, sp: 20, seats: 2, costEb: 80000, description: 'Military attack helicopter with missile pods and chaingun' },

  // Watercraft
  { name: 'Speedboat', type: 'Boat', topSpeed: 80, maneuver: 1, sdp: 20, sp: 0, seats: 4, costEb: 5000, description: 'Fast civilian speedboat for harbor and coastal use' },
  { name: 'Combat Zodiac', type: 'Boat', topSpeed: 50, maneuver: 1, sdp: 15, sp: 3, seats: 6, costEb: 3000, description: 'Inflatable assault craft — used for waterborne insertions' },
  { name: 'Patrol Boat', type: 'Boat', topSpeed: 60, maneuver: 0, sdp: 30, sp: 10, seats: 4, costEb: 15000, description: 'Armed patrol boat with mounted weapon and spotlight' },

  // Nomad Specials
  { name: 'Nomad War Rig', type: 'Truck', topSpeed: 80, maneuver: -3, sdp: 80, sp: 25, seats: 10, costEb: 40000, description: 'Massive armored truck — mobile fortress of the nomad nations. Weapon mounts, crew quarters' },
  { name: 'Nomad Buggy', type: 'Car', topSpeed: 140, maneuver: 2, sdp: 15, sp: 5, seats: 2, costEb: 3000, description: 'Stripped-down dune buggy — fast, off-road, jury-rigged weapons' },
  { name: 'Nomad Bike (Modified)', type: 'Motorcycle', topSpeed: 160, maneuver: 2, sdp: 12, sp: 3, seats: 1, costEb: 3500, description: 'Nomad-modified motorcycle — reinforced, off-road capable, weapon mount' },
]

export const CP_VEHICLES_CATALOG = CP_VEHICLES.map(v => ({
  value: v.name,
  description: `${v.type} — ${v.description} (${v.costEb}eb, Speed ${v.topSpeed}, SP${v.sp})`,
}))

// ── Lifepath Tables ────────────────────────────────────────────────────────────

export const CP_LIFEPATH_TABLES = {
  dressStyle: [
    'Biker Leathers', 'Blue Jeans', 'Corporate Suits', 'Jumpsuits',
    'Mini Skirts/Shorts', 'High Fashion', 'Camouflage', 'Normal Clothes',
    'Bag Lady Chic', 'Nude',
  ],
  hairstyle: [
    'Mohawk', 'Long & Ratty', 'Short & Spiked', 'Wild & All Over',
    'Bald', 'Striped', 'Tinted', 'Neat & Short',
    'Short & Curly', 'Long & Straight',
  ],
  affectation: [
    'Tattoos', 'Mirrorshades', 'Ritual Scars', 'Spiked Gloves',
    'Nose Rings', 'Tongue or Cheek Studs', 'Strange Fingernail Implants',
    'Earrings', 'Long Fingernails', 'Unusual Contacts',
  ],
  ethnicOrigin: [
    'Anglo-American', 'African', 'Japanese/Korean', 'Central European/Soviet',
    'Pacific Islander', 'Chinese/Southeast Asian', 'Black American',
    'Hispanic American', 'Central/South American', 'European',
  ],
  familyBackground: [
    'Corporate Execs', 'Corporate Managers', 'Corporate Technicians',
    'Nomad Pack', 'Ganger Family', 'Combat Zoners',
    'Urban Homeless', 'Megacorp Beaverville', 'Arcology Family',
    'Pirate Fleet',
  ],
  familyMembersLost: [
    'None', 'One lost', 'Two lost', 'Three lost',
    'Four or more lost', 'Entire family lost',
  ],
  childhoodEnvironment: [
    'Spent on the street with no adult supervision',
    'Spent in a safe suburban environment',
    'In a Nomad pack moving from town to town',
    'In a decaying, once-upscale neighborhood',
    'In a defended corporate zone in the central city',
    'In the heart of the Combat Zone',
    'In a small village or town far from the city',
    'In a large, arcology-style city complex',
    'In an orbital or space habitat',
    'In a overseas conflict zone',
  ],
  personalityTraits: [
    'Shy and secretive', 'Rebellious, antisocial, violent',
    'Arrogant, proud, aloof', 'Moody, rash, headstrong',
    'Picky, fussy, nervous', 'Stable and serious',
    'Silly and fluff-headed', 'Sneaky and deceptive',
    'Intellectual and detached', 'Friendly and outgoing',
  ],
  mostValuedPerson: [
    'A parent', 'A brother or sister', 'A lover', 'A friend',
    'Yourself', 'A pet', 'A teacher or mentor', 'A public figure',
    'A personal hero', 'No one',
  ],
  mostValuedThing: [
    'Money', 'Honor', 'Your word', 'Honesty',
    'Knowledge', 'Vengeance', 'Love', 'Power',
    'Having a good time', 'Friendship',
  ],
  feelingsAboutPeople: [
    'I stay neutral', 'I like almost everyone',
    'I hate almost everyone', 'People are tools to be used',
    'Every person is a valuable individual',
    'People are obstacles in my way',
    'People are untrustworthy — watch your back',
    'Wipe \'em all out and let God sort \'em out',
    'People are wonderful', 'I am the center of the universe',
  ],
  originalBackground: [
    'Military (discharged or deserted)',
    'Corporate employee (laid off or fled)',
    'Criminal (served time or escaped)',
    'Street kid (always been on the street)',
    'Nomad (left your pack)',
    'Techie (abandoned or lost your shop)',
    'Student (dropped out or graduated)',
    'Media (lost your job or went freelance)',
    'Cop (quit or was fired)',
    'Medical (lost your license or clinic)',
  ],
}

// ── Derived Stat Helpers ───────────────────────────────────────────────────────

export const CP_BODY_TYPE_MODIFIER = {
  1:  { label: 'Very Weak', modifier: -2 },
  2:  { label: 'Very Weak', modifier: -2 },
  3:  { label: 'Weak', modifier: -1 },
  4:  { label: 'Weak', modifier: -1 },
  5:  { label: 'Average', modifier: 0 },
  6:  { label: 'Average', modifier: 0 },
  7:  { label: 'Average', modifier: 0 },
  8:  { label: 'Strong', modifier: 1 },
  9:  { label: 'Strong', modifier: 1 },
  10: { label: 'Very Strong', modifier: 2 },
  11: { label: 'Superhuman', modifier: 3 },
  12: { label: 'Superhuman', modifier: 3 },
}

export const CP_FUMBLE_TABLE = [
  'No fumble — loss of action only',
  'Weapon jams — loss of next turn',
  'Weapon dropped — must retrieve',
  'Weapon discharges — random direction',
  'Weapon explodes — take 1D6 damage',
  'Weapon strikes self — roll normal damage',
]

export const CP_HIT_LOCATION_TABLE = [
  { roll: '1', location: 'Head', damageMultiplier: 2 },
  { roll: '2-4', location: 'Torso', damageMultiplier: 1 },
  { roll: '5', location: 'Right Arm', damageMultiplier: 1 },
  { roll: '6', location: 'Left Arm', damageMultiplier: 1 },
  { roll: '7-8', location: 'Right Leg', damageMultiplier: 0.5 },
  { roll: '9-10', location: 'Left Leg', damageMultiplier: 0.5 },
]
