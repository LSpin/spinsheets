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
]

export const CP_GEAR_CATALOG = CP_GEAR.map(g => ({
  value: g.name,
  description: `${g.description} (${g.costEb}eb)`,
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
