// ── L5R 5th Edition (FFG) Game Data ──
// Based on the Legend of the Five Rings 5th Edition Core Rulebook

// ── Rings ──
export const L5R5E_RINGS = [
  { key: 'l5r5eAir', label: 'Air', description: 'Grace, cunning, precision, subtlety' },
  { key: 'l5r5eEarth', label: 'Earth', description: 'Resilience, patience, memory, calm' },
  { key: 'l5r5eFire', label: 'Fire', description: 'Passion, invention, candor, ferocity' },
  { key: 'l5r5eWater', label: 'Water', description: 'Flexibility, awareness, efficiency, charm' },
  { key: 'l5r5eVoid', label: 'Void', description: 'Mysticism, intuition, instinct, wisdom' },
]

// ── Skill Groups ──
export const L5R5E_SKILL_GROUPS = {
  Artisan: ['Aesthetics', 'Composition', 'Design', 'Smithing'],
  Social: ['Command', 'Courtesy', 'Games', 'Performance'],
  Scholar: ['Culture', 'Government', 'Medicine', 'Sentiment', 'Theology'],
  Martial: ['Fitness', 'Martial Arts [Melee]', 'Martial Arts [Ranged]', 'Martial Arts [Unarmed]', 'Meditation', 'Tactics'],
  Trade: ['Commerce', 'Labor', 'Seafaring', 'Skulduggery', 'Survival'],
}

// ── Clans ──
export const L5R5E_CLANS = [
  { value: 'Crab', ringIncrease: 'Earth', skillIncrease: 'Fitness', status: 30, description: 'Defenders of the Wall against the Shadowlands.' },
  { value: 'Crane', ringIncrease: 'Air', skillIncrease: 'Culture', status: 35, description: 'Masters of court, art, and dueling.' },
  { value: 'Dragon', ringIncrease: 'Fire', skillIncrease: 'Meditation', status: 30, description: 'Enigmatic seekers of enlightenment.' },
  { value: 'Lion', ringIncrease: 'Water', skillIncrease: 'Tactics', status: 35, description: 'The Emperor\'s military right hand.' },
  { value: 'Phoenix', ringIncrease: 'Void', skillIncrease: 'Theology', status: 30, description: 'Keepers of the Empire\'s spiritual soul.' },
  { value: 'Scorpion', ringIncrease: 'Air', skillIncrease: 'Skulduggery', status: 35, description: 'The Emperor\'s loyal villains.' },
  { value: 'Unicorn', ringIncrease: 'Water', skillIncrease: 'Survival', status: 30, description: 'Wanderers who returned with foreign ways.' },
]
export const L5R5E_CLAN_CATALOG = L5R5E_CLANS.map(c => ({ value: c.value, description: c.description }))

// ── Families ──
export const L5R5E_FAMILIES = {
  Crab: [
    { value: 'Hida', ringOptions: ['Earth', 'Fire'], skills: ['+1 Fitness', '+1 Martial Arts [Melee]'], glory: 40, wealth: 6, description: 'The mightiest warriors on the Wall, descended from Hida himself.' },
    { value: 'Hiruma', ringOptions: ['Air', 'Water'], skills: ['+1 Fitness', '+1 Survival'], glory: 40, wealth: 4, description: 'Scouts and skirmishers who brave the Shadowlands.' },
    { value: 'Kaiu', ringOptions: ['Earth', 'Fire'], skills: ['+1 Design', '+1 Smithing'], glory: 40, wealth: 7, description: 'Brilliant engineers who build and maintain the Wall.' },
    { value: 'Kuni', ringOptions: ['Earth', 'Fire'], skills: ['+1 Medicine', '+1 Theology'], glory: 40, wealth: 5, description: 'Witch hunters who study the Shadowlands to fight it.' },
    { value: 'Yasuki', ringOptions: ['Air', 'Water'], skills: ['+1 Commerce', '+1 Courtesy'], glory: 40, wealth: 7, description: 'Shrewd merchants who keep the Crab supplied.' },
  ],
  Crane: [
    { value: 'Asahina', ringOptions: ['Air', 'Earth'], skills: ['+1 Aesthetics', '+1 Theology'], glory: 44, wealth: 5, description: 'Pacifist shugenja dedicated to beauty and harmony.' },
    { value: 'Daidoji', ringOptions: ['Earth', 'Water'], skills: ['+1 Fitness', '+1 Tactics'], glory: 40, wealth: 5, description: 'The Iron Warriors, selfless defenders of the Crane.' },
    { value: 'Doji', ringOptions: ['Air', 'Fire'], skills: ['+1 Courtesy', '+1 Culture'], glory: 50, wealth: 6, description: 'The heart of the Crane, masters of court and diplomacy.' },
    { value: 'Kakita', ringOptions: ['Air', 'Fire'], skills: ['+1 Aesthetics', '+1 Martial Arts [Melee]'], glory: 44, wealth: 5, description: 'Legendary duelists and artisans of the Crane.' },
  ],
  Dragon: [
    { value: 'Agasha', ringOptions: ['Earth', 'Fire'], skills: ['+1 Medicine', '+1 Smithing'], glory: 40, wealth: 5, description: 'Mystical scholars blending shugenja arts with alchemy.' },
    { value: 'Kitsuki', ringOptions: ['Air', 'Water'], skills: ['+1 Government', '+1 Sentiment'], glory: 44, wealth: 5, description: 'Perceptive investigators who trust evidence over testimony.' },
    { value: 'Mirumoto', ringOptions: ['Fire', 'Water'], skills: ['+1 Martial Arts [Melee]', '+1 Meditation'], glory: 40, wealth: 5, description: 'Masters of the two-sword technique, niten.' },
    { value: 'Togashi', ringOptions: ['Fire', 'Void'], skills: ['+1 Martial Arts [Unarmed]', '+1 Theology'], glory: 30, wealth: 3, description: 'Tattooed monks who seek enlightenment through mystical tattoos.' },
  ],
  Lion: [
    { value: 'Akodo', ringOptions: ['Earth', 'Water'], skills: ['+1 Command', '+1 Tactics'], glory: 44, wealth: 6, description: 'The finest military commanders in the Empire.' },
    { value: 'Ikoma', ringOptions: ['Fire', 'Water'], skills: ['+1 Composition', '+1 Government'], glory: 44, wealth: 5, description: 'Passionate bards and historians of the Lion.' },
    { value: 'Kitsu', ringOptions: ['Earth', 'Void'], skills: ['+1 Culture', '+1 Theology'], glory: 44, wealth: 5, description: 'Shugenja descended from ancient spirit creatures.' },
    { value: 'Matsu', ringOptions: ['Fire', 'Water'], skills: ['+1 Fitness', '+1 Martial Arts [Melee]'], glory: 44, wealth: 5, description: 'Fierce warriors embodying the Lion\'s fury.' },
  ],
  Phoenix: [
    { value: 'Asako', ringOptions: ['Earth', 'Void'], skills: ['+1 Culture', '+1 Government'], glory: 40, wealth: 5, description: 'Scholars and monks dedicated to preserving knowledge.' },
    { value: 'Isawa', ringOptions: ['Fire', 'Void'], skills: ['+1 Theology', '+1 Medicine'], glory: 44, wealth: 6, description: 'The most powerful shugenja in the Empire.' },
    { value: 'Kaito', ringOptions: ['Air', 'Void'], skills: ['+1 Martial Arts [Ranged]', '+1 Theology'], glory: 40, wealth: 4, description: 'Shrine keepers and sacred archers of the Phoenix.' },
    { value: 'Shiba', ringOptions: ['Earth', 'Water'], skills: ['+1 Martial Arts [Melee]', '+1 Theology'], glory: 40, wealth: 5, description: 'Noble warriors sworn to protect the Isawa.' },
  ],
  Scorpion: [
    { value: 'Bayushi', ringOptions: ['Air', 'Fire'], skills: ['+1 Courtesy', '+1 Skulduggery'], glory: 44, wealth: 6, description: 'The masked lords of the Scorpion, masters of manipulation.' },
    { value: 'Shosuro', ringOptions: ['Air', 'Water'], skills: ['+1 Performance', '+1 Skulduggery'], glory: 40, wealth: 5, description: 'Actors, infiltrators, and poisoners without peer.' },
    { value: 'Soshi', ringOptions: ['Air', 'Earth'], skills: ['+1 Courtesy', '+1 Theology'], glory: 40, wealth: 5, description: 'Shugenja who weave illusions and conceal the truth.' },
    { value: 'Yogo', ringOptions: ['Earth', 'Fire'], skills: ['+1 Medicine', '+1 Theology'], glory: 30, wealth: 4, description: 'Cursed shugenja who study wards and blood magic.' },
  ],
  Unicorn: [
    { value: 'Ide', ringOptions: ['Air', 'Water'], skills: ['+1 Commerce', '+1 Courtesy'], glory: 44, wealth: 6, description: 'Diplomats and traders bridging Rokugan and foreign lands.' },
    { value: 'Iuchi', ringOptions: ['Fire', 'Water'], skills: ['+1 Medicine', '+1 Theology'], glory: 40, wealth: 5, description: 'Shugenja who practice meishodo, the art of name magic.' },
    { value: 'Moto', ringOptions: ['Earth', 'Fire'], skills: ['+1 Fitness', '+1 Martial Arts [Melee]'], glory: 30, wealth: 5, description: 'Fierce gaijin-blooded riders of the steppes.' },
    { value: 'Shinjo', ringOptions: ['Fire', 'Water'], skills: ['+1 Fitness', '+1 Tactics'], glory: 40, wealth: 6, description: 'Outriders and explorers descended from Lady Shinjo.' },
    { value: 'Utaku', ringOptions: ['Earth', 'Water'], skills: ['+1 Command', '+1 Survival'], glory: 44, wealth: 6, description: 'Elite battle maidens who ride the finest steeds in the Empire.' },
  ],
}

export const L5R5E_FAMILY_CATALOG = {}
for (const clan of Object.keys(L5R5E_FAMILIES)) {
  L5R5E_FAMILY_CATALOG[clan] = L5R5E_FAMILIES[clan].map(f => ({ value: f.value, description: f.description }))
}

// ── Schools ──
export const L5R5E_SCHOOLS = [
  // Crab
  {
    value: 'Hida Defender', clan: 'Crab', type: 'Bushi',
    rings: '+1 Earth, +1 Water', skills: '5 from: Fitness, Martial Arts [Melee], Martial Arts [Unarmed], Tactics, Command, Medicine, Survival',
    honor: 35, techniques: 'Kata, Shūji',
    startingTechniques: 'Striking as Earth (Kata), Way of the Crab (School Ability)',
    schoolAbility: 'Way of the Crab: When you perform an Attack action, you may spend 1 Void point to reduce the damage of the next attack that hits you before the start of your next turn by your Earth ring.',
    outfit: 'Traveling clothes, daishō (katana and wakizashi), heavy armor, tetsubō or masakari, traveling pack',
    description: 'The Hida Defender school trains warriors to hold the Wall against the Shadowlands.',
  },
  {
    value: 'Hiruma Scout', clan: 'Crab', type: 'Bushi/Shinobi',
    rings: '+1 Air, +1 Water', skills: '5 from: Fitness, Martial Arts [Melee], Martial Arts [Ranged], Skulduggery, Survival, Tactics, Medicine',
    honor: 30, techniques: 'Kata, Shūji, Ninjutsu',
    startingTechniques: 'Striking as Water (Kata), Way of the Hiruma (School Ability)',
    schoolAbility: 'Way of the Hiruma: During a skirmish, you may spend 1 Void point to move 1 additional range band as part of a Move action.',
    outfit: 'Traveling clothes, daishō (katana and wakizashi), ashigaru armor, yumi with quiver of arrows, knife, traveling pack',
    description: 'Hiruma scouts brave the Shadowlands to gather intelligence and warn of threats.',
  },
  {
    value: 'Kaiu Engineer', clan: 'Crab', type: 'Artisan',
    rings: '+1 Earth, +1 Fire', skills: '5 from: Design, Labor, Martial Arts [Melee], Smithing, Tactics, Fitness, Commerce',
    honor: 40, techniques: 'Kata, Rituals, Shūji',
    startingTechniques: 'Lord Kaiu\'s Sight (School Ability)',
    schoolAbility: 'Lord Kaiu\'s Sight: When you make a Design or Smithing check, you may spend Opportunity to identify a structural weakness in a fortification, mechanism, or object.',
    outfit: 'Traveling clothes, daishō (katana and wakizashi), ashigaru armor, tool kit, traveling pack',
    description: 'The Kaiu school produces the finest engineers and siege architects in the Empire.',
  },
  {
    value: 'Kuni Purifier', clan: 'Crab', type: 'Shugenja',
    rings: '+1 Earth, +1 Fire', skills: '5 from: Martial Arts [Melee], Medicine, Survival, Theology, Culture, Fitness, Sentiment',
    honor: 30, techniques: 'Invocations, Rituals',
    startingTechniques: '3 Invocations, 1 Ritual, Gaze of the Crab (School Ability)',
    schoolAbility: 'Gaze of the Crab: You may spend 1 Void point to determine if a target within range 0-2 is Tainted or otherworldly.',
    outfit: 'Traveling clothes, wakizashi, scroll satchel, jade finger, traveling pack',
    description: 'Kuni shugenja study Shadowlands corruption to purify and destroy it.',
  },
  {
    value: 'Yasuki Merchant', clan: 'Crab', type: 'Courtier',
    rings: '+1 Air, +1 Water', skills: '5 from: Commerce, Courtesy, Culture, Games, Labor, Skulduggery, Survival',
    honor: 30, techniques: 'Kata, Shūji',
    startingTechniques: 'Honest Assessment (Shūji), Way of the Yasuki (School Ability)',
    schoolAbility: 'Way of the Yasuki: Once per scene, when making a Commerce or Courtesy check, you may add kept ring dice equal to your Water ring.',
    outfit: 'Traveling clothes, wakizashi, calligraphy set, 5 koku, traveling pack',
    description: 'Yasuki courtiers and merchants keep the Crab Clan funded and supplied.',
  },
  // Crane
  {
    value: 'Kakita Duelist', clan: 'Crane', type: 'Bushi',
    rings: '+1 Air, +1 Fire', skills: '5 from: Aesthetics, Courtesy, Culture, Martial Arts [Melee], Meditation, Composition, Fitness',
    honor: 50, techniques: 'Kata, Shūji, Rituals',
    startingTechniques: 'Iaijutsu Cut: Rising Blade (Kata), Way of the Crane (School Ability)',
    schoolAbility: 'Way of the Crane: Once per round during a duel, after you resolve an Strike action, you may spend 1 Void point to make a follow-up Strike action.',
    outfit: 'Traveling clothes, daishō (katana and wakizashi), traveling pack',
    description: 'Kakita duelists are the finest single-combat warriors in the Empire, masters of iaijutsu.',
  },
  {
    value: 'Doji Diplomat', clan: 'Crane', type: 'Courtier',
    rings: '+1 Air, +1 Water', skills: '5 from: Aesthetics, Composition, Courtesy, Culture, Government, Performance, Sentiment',
    honor: 50, techniques: 'Kata, Shūji, Rituals',
    startingTechniques: 'Honest Assessment (Shūji), Way of the Doji (School Ability)',
    schoolAbility: 'Way of the Doji: Once per scene during a Social check, you may add kept dice equal to your school rank to your result.',
    outfit: 'Traveling clothes, wakizashi, calligraphy set, traveling pack, 5 koku',
    description: 'Doji courtiers shape the courts of the Empire with grace and political acumen.',
  },
  {
    value: 'Asahina Artificer', clan: 'Crane', type: 'Shugenja',
    rings: '+1 Air, +1 Earth', skills: '5 from: Aesthetics, Composition, Culture, Medicine, Smithing, Theology, Courtesy',
    honor: 50, techniques: 'Invocations, Rituals, Shūji',
    startingTechniques: '3 Invocations, 1 Ritual, Way of the Asahina (School Ability)',
    schoolAbility: 'Way of the Asahina: When you make a check to create a work of art or craft an item, reduce the TN by 1.',
    outfit: 'Traveling clothes, wakizashi, scroll satchel, traveling pack, sanctified robes',
    description: 'Asahina shugenja create fetishes and works of art imbued with spiritual power.',
  },
  {
    value: 'Daidoji Iron Warrior', clan: 'Crane', type: 'Bushi',
    rings: '+1 Earth, +1 Water', skills: '5 from: Fitness, Martial Arts [Melee], Martial Arts [Ranged], Tactics, Survival, Command, Courtesy',
    honor: 40, techniques: 'Kata, Shūji',
    startingTechniques: 'Striking as Earth (Kata), Way of the Daidoji (School Ability)',
    schoolAbility: 'Way of the Daidoji: When defending, after an opponent misses you with an attack, you may immediately perform a Strike action against them as a free action once per round.',
    outfit: 'Traveling clothes, daishō (katana and wakizashi), heavy armor, yari, traveling pack',
    description: 'Daidoji Iron Warriors serve as the Crane Clan\'s stalwart defensive line.',
  },
  // Dragon
  {
    value: 'Mirumoto Two-Heavens Adept', clan: 'Dragon', type: 'Bushi',
    rings: '+1 Fire, +1 Water', skills: '5 from: Fitness, Martial Arts [Melee], Meditation, Tactics, Aesthetics, Sentiment, Design',
    honor: 45, techniques: 'Kata, Kihō, Rituals',
    startingTechniques: 'Striking as Fire (Kata), Way of the Dragon (School Ability)',
    schoolAbility: 'Way of the Dragon: While wielding two weapons, increase your physical resistance by 1. When you perform a Strike action while wielding two weapons, you may spend Opportunity to deal bonus damage equal to your Fire ring.',
    outfit: 'Traveling clothes, daishō (katana and wakizashi), traveling pack',
    description: 'Mirumoto bushi fight with two swords in the niten style unique to the Dragon.',
  },
  {
    value: 'Kitsuki Investigator', clan: 'Dragon', type: 'Courtier',
    rings: '+1 Air, +1 Water', skills: '5 from: Culture, Government, Medicine, Sentiment, Skulduggery, Courtesy, Games',
    honor: 45, techniques: 'Shūji, Rituals',
    startingTechniques: 'Honest Assessment (Shūji), Way of the Kitsuki (School Ability)',
    schoolAbility: 'Way of the Kitsuki: When you succeed on a check to determine if someone is lying or withholding information, you learn one additional piece of information.',
    outfit: 'Traveling clothes, wakizashi, journal, traveling pack, magnifying lens',
    description: 'Kitsuki investigators rely on evidence and deduction rather than testimony.',
  },
  {
    value: 'Agasha Mystic', clan: 'Dragon', type: 'Shugenja',
    rings: '+1 Earth, +1 Fire', skills: '5 from: Aesthetics, Medicine, Smithing, Survival, Theology, Culture, Sentiment',
    honor: 40, techniques: 'Invocations, Rituals, Kihō',
    startingTechniques: '3 Invocations, 1 Ritual, Way of the Agasha (School Ability)',
    schoolAbility: 'Way of the Agasha: When you make a check using an Invocation, you may spend Opportunity to also apply the effects of a potion or elixir you have prepared.',
    outfit: 'Traveling clothes, wakizashi, scroll satchel, traveling pack, alchemy kit',
    description: 'Agasha shugenja blend elemental magic with alchemical experimentation.',
  },
  {
    value: 'Togashi Tattooed Order', clan: 'Dragon', type: 'Monk',
    rings: '+1 Fire, +1 Void', skills: '5 from: Fitness, Martial Arts [Unarmed], Meditation, Theology, Culture, Aesthetics, Sentiment',
    honor: 30, techniques: 'Kihō, Rituals',
    startingTechniques: '2 Kihō, Way of the Togashi (School Ability)',
    schoolAbility: 'Way of the Togashi: You may spend 1 Void point to activate one of your mystical tattoos. Each tattoo grants a unique supernatural benefit.',
    outfit: 'Traveling clothes (simple robes), bō, traveling pack',
    description: 'Togashi monks bear mystical tattoos that grant supernatural abilities.',
  },
  // Lion
  {
    value: 'Akodo Commander', clan: 'Lion', type: 'Bushi',
    rings: '+1 Earth, +1 Water', skills: '5 from: Command, Fitness, Government, Martial Arts [Melee], Tactics, Culture, Courtesy',
    honor: 50, techniques: 'Kata, Shūji, Rituals',
    startingTechniques: 'Striking as Earth (Kata), Way of the Lion (School Ability)',
    schoolAbility: 'Way of the Lion: Once per round, when an ally in your group makes a check, you may spend 1 Void point to allow them to add your Command skill rank in kept dice.',
    outfit: 'Traveling clothes, daishō (katana and wakizashi), ashigaru armor, traveling pack, war fan',
    description: 'Akodo commanders are brilliant tacticians who lead from the front.',
  },
  {
    value: 'Ikoma Bard', clan: 'Lion', type: 'Courtier',
    rings: '+1 Fire, +1 Water', skills: '5 from: Command, Composition, Culture, Government, Performance, Sentiment, Courtesy',
    honor: 45, techniques: 'Shūji, Rituals',
    startingTechniques: 'Honest Assessment (Shūji), Way of the Ikoma (School Ability)',
    schoolAbility: 'Way of the Ikoma: Once per scene, when you make a Social check invoking honor, duty, or history, add kept dice equal to your school rank.',
    outfit: 'Traveling clothes, wakizashi, calligraphy set, traveling pack, Lion war records',
    description: 'Ikoma bards preserve history and inspire through passionate storytelling.',
  },
  {
    value: 'Kitsu Medium', clan: 'Lion', type: 'Shugenja',
    rings: '+1 Earth, +1 Void', skills: '5 from: Culture, Martial Arts [Melee], Medicine, Theology, Sentiment, Fitness, Command',
    honor: 45, techniques: 'Invocations, Rituals',
    startingTechniques: '3 Invocations, 1 Ritual, Way of the Kitsu (School Ability)',
    schoolAbility: 'Way of the Kitsu: You may spend 1 Void point to commune with an ancestor spirit, asking one question that it answers truthfully if it can.',
    outfit: 'Traveling clothes, wakizashi, scroll satchel, traveling pack, ancestral shrine kit',
    description: 'Kitsu shugenja commune with ancestor spirits through their ancient bloodline.',
  },
  {
    value: 'Matsu Berserker', clan: 'Lion', type: 'Bushi',
    rings: '+1 Fire, +1 Water', skills: '5 from: Command, Fitness, Martial Arts [Melee], Martial Arts [Unarmed], Meditation, Tactics, Survival',
    honor: 45, techniques: 'Kata, Kihō',
    startingTechniques: 'Striking as Fire (Kata), Way of the Matsu (School Ability)',
    schoolAbility: 'Way of the Matsu: When you perform an Attack action while you have 3 or more strife, increase the damage of that attack by your Fire ring.',
    outfit: 'Traveling clothes, daishō (katana and wakizashi), ashigaru armor, traveling pack',
    description: 'Matsu berserkers channel their fury into devastating martial prowess.',
  },
  // Phoenix
  {
    value: 'Isawa Elementalist', clan: 'Phoenix', type: 'Shugenja',
    rings: '+1 Fire, +1 Void', skills: '5 from: Aesthetics, Culture, Medicine, Theology, Courtesy, Sentiment, Composition',
    honor: 45, techniques: 'Invocations, Rituals',
    startingTechniques: '3 Invocations, 1 Ritual, Way of the Isawa (School Ability)',
    schoolAbility: 'Way of the Isawa: When you make a check to perform an Invocation, you may reduce the TN by 1 (to a minimum of 1). Once per scene, you may spend 1 Void point to add extra ring dice to an Invocation check.',
    outfit: 'Traveling clothes, wakizashi, scroll satchel, traveling pack, sanctified robes',
    description: 'Isawa shugenja are the most powerful elementalists in Rokugan.',
  },
  {
    value: 'Shiba Guardian', clan: 'Phoenix', type: 'Bushi',
    rings: '+1 Earth, +1 Water', skills: '5 from: Courtesy, Fitness, Martial Arts [Melee], Meditation, Tactics, Theology, Command',
    honor: 45, techniques: 'Kata, Shūji, Rituals',
    startingTechniques: 'Striking as Water (Kata), Way of the Shiba (School Ability)',
    schoolAbility: 'Way of the Shiba: Once per round, when an ally at range 0-1 would suffer a critical strike, you may spend 1 Void point to suffer the critical strike instead.',
    outfit: 'Traveling clothes, daishō (katana and wakizashi), ashigaru armor, traveling pack, yari',
    description: 'Shiba warriors protect the Phoenix shugenja with unwavering loyalty.',
  },
  // Scorpion
  {
    value: 'Bayushi Manipulator', clan: 'Scorpion', type: 'Courtier',
    rings: '+1 Air, +1 Fire', skills: '5 from: Courtesy, Games, Performance, Sentiment, Skulduggery, Culture, Command',
    honor: 25, techniques: 'Kata, Shūji, Ninjutsu',
    startingTechniques: 'Honest Assessment (Shūji), Way of the Bayushi (School Ability)',
    schoolAbility: 'Way of the Bayushi: Once per scene during an intrigue, you may add kept dice set to Opportunity results equal to your Air ring to a Social check.',
    outfit: 'Traveling clothes, wakizashi, calligraphy set, traveling pack, courtier\'s mask',
    description: 'Bayushi courtiers weave webs of deception and blackmail.',
  },
  {
    value: 'Shosuro Infiltrator', clan: 'Scorpion', type: 'Shinobi',
    rings: '+1 Air, +1 Water', skills: '5 from: Fitness, Martial Arts [Melee], Martial Arts [Ranged], Performance, Skulduggery, Courtesy, Medicine',
    honor: 20, techniques: 'Kata, Ninjutsu, Shūji',
    startingTechniques: 'Skulk (Ninjutsu), Way of the Shosuro (School Ability)',
    schoolAbility: 'Way of the Shosuro: When you adopt a disguise or assume a false identity, increase the TN for others to see through it by your school rank.',
    outfit: 'Traveling clothes, daishō (katana and wakizashi), dark clothing, blowgun with darts, traveling pack',
    description: 'Shosuro infiltrators are the Scorpion\'s silent blades.',
  },
  {
    value: 'Soshi Illusionist', clan: 'Scorpion', type: 'Shugenja',
    rings: '+1 Air, +1 Earth', skills: '5 from: Courtesy, Culture, Meditation, Skulduggery, Theology, Sentiment, Government',
    honor: 25, techniques: 'Invocations, Rituals, Shūji',
    startingTechniques: '3 Invocations, 1 Ritual, Way of the Soshi (School Ability)',
    schoolAbility: 'Way of the Soshi: When you perform an Invocation, you may spend Opportunity to make the invocation invisible and silent to observers.',
    outfit: 'Traveling clothes, wakizashi, scroll satchel, traveling pack',
    description: 'Soshi shugenja specialize in illusions and concealment magic.',
  },
  // Unicorn
  {
    value: 'Moto Conqueror', clan: 'Unicorn', type: 'Bushi',
    rings: '+1 Earth, +1 Fire', skills: '5 from: Command, Fitness, Martial Arts [Melee], Survival, Tactics, Martial Arts [Ranged], Martial Arts [Unarmed]',
    honor: 30, techniques: 'Kata, Shūji',
    startingTechniques: 'Striking as Fire (Kata), Way of the Moto (School Ability)',
    schoolAbility: 'Way of the Moto: When you succeed on an Attack action while mounted, increase the damage dealt by your Earth ring.',
    outfit: 'Traveling clothes, daishō (katana and wakizashi), ashigaru armor, scimitar, warhorse, traveling pack',
    description: 'Moto conquerors are fierce mounted warriors from the plains.',
  },
  {
    value: 'Utaku Battle Maiden', clan: 'Unicorn', type: 'Bushi',
    rings: '+1 Earth, +1 Water', skills: '5 from: Command, Courtesy, Fitness, Martial Arts [Melee], Survival, Tactics, Culture',
    honor: 50, techniques: 'Kata, Shūji',
    startingTechniques: 'Striking as Water (Kata), Way of the Utaku (School Ability)',
    schoolAbility: 'Way of the Utaku: While mounted, increase your physical resistance by 1. You may spend 1 Void point to make your steed perform an additional Move action on your turn.',
    outfit: 'Traveling clothes, daishō (katana and wakizashi), lacquered armor, Utaku warhorse, traveling pack',
    description: 'Utaku Battle Maidens are elite cavalry, the finest riders in the Empire.',
  },
  {
    value: 'Iuchi Meishōdō Wielder', clan: 'Unicorn', type: 'Shugenja',
    rings: '+1 Fire, +1 Water', skills: '5 from: Culture, Games, Medicine, Sentiment, Theology, Survival, Martial Arts [Ranged]',
    honor: 35, techniques: 'Invocations, Rituals',
    startingTechniques: '3 Invocations, 1 Ritual, Way of the Iuchi (School Ability)',
    schoolAbility: 'Way of the Iuchi: You may prepare meishōdō talismans. When you activate a talisman, reduce the TN of the associated invocation by 1.',
    outfit: 'Traveling clothes, wakizashi, scroll satchel, traveling pack, meishōdō talisman kit',
    description: 'Iuchi shugenja practice meishōdō, a foreign name magic brought from the gaijin lands.',
  },
  {
    value: 'Ide Trader', clan: 'Unicorn', type: 'Courtier',
    rings: '+1 Air, +1 Water', skills: '5 from: Commerce, Courtesy, Culture, Games, Sentiment, Survival, Seafaring',
    honor: 35, techniques: 'Shūji, Rituals',
    startingTechniques: 'Honest Assessment (Shūji), Way of the Ide (School Ability)',
    schoolAbility: 'Way of the Ide: Once per scene during a trade or negotiation, you may add kept dice set to Opportunity equal to your Water ring.',
    outfit: 'Traveling clothes, wakizashi, calligraphy set, traveling pack, 5 koku, riding horse',
    description: 'Ide traders serve as the Unicorn\'s diplomats and merchants.',
  },
  {
    value: 'Shinjo Outrider', clan: 'Unicorn', type: 'Bushi',
    rings: '+1 Fire, +1 Water', skills: '5 from: Fitness, Martial Arts [Melee], Martial Arts [Ranged], Survival, Tactics, Sentiment, Command',
    honor: 35, techniques: 'Kata, Shūji',
    startingTechniques: 'Striking as Water (Kata), Way of the Shinjo (School Ability)',
    schoolAbility: 'Way of the Shinjo: While mounted, you may perform a Move action as a free action once per round.',
    outfit: 'Traveling clothes, daishō (katana and wakizashi), ashigaru armor, yumi, riding horse, traveling pack',
    description: 'Shinjo outriders scout ahead and engage foes from horseback.',
  },
]

export const L5R5E_SCHOOL_CATALOG = L5R5E_SCHOOLS.map(s => ({
  value: s.value,
  description: `${s.clan} ${s.type} — ${s.description}`,
}))

// ── Advantages & Disadvantages ──
export const L5R5E_ADVANTAGES = [
  // Distinctions
  { value: 'Bishamon\'s Blessing', type: 'Distinction', ring: 'Earth', description: 'You are blessed with great stamina and endurance.' },
  { value: 'Dangerous Allure', type: 'Distinction', ring: 'Air', description: 'Your beauty and grace captivate others.' },
  { value: 'Fame', type: 'Distinction', ring: 'Water', description: 'Your deeds are known throughout the region.' },
  { value: 'Keen Sight', type: 'Distinction', ring: 'Air', description: 'Your vision is exceptionally sharp.' },
  { value: 'Large Stature', type: 'Distinction', ring: 'Water', description: 'You are larger and stronger than most.' },
  { value: 'Paragon of a Virtue', type: 'Distinction', ring: 'Void', description: 'You are widely known as a living example of Bushido.' },
  { value: 'Quick Reflexes', type: 'Distinction', ring: 'Fire', description: 'You react faster than most in battle.' },
  { value: 'Sage', type: 'Distinction', ring: 'Earth', description: 'You are deeply learned in scholarly matters.' },
  { value: 'Silent', type: 'Distinction', ring: 'Air', description: 'You move without making a sound.' },
  { value: 'Spiritual Bearing', type: 'Distinction', ring: 'Void', description: 'Spirits are drawn to your presence.' },
  { value: 'Stolen Knowledge', type: 'Distinction', ring: 'Fire', description: 'You have learned secrets from forbidden sources.' },
  { value: 'Subtle Observer', type: 'Distinction', ring: 'Air', description: 'You notice details that others miss.' },
  // Passions
  { value: 'Daredevil', type: 'Passion', ring: 'Fire', description: 'You thrive in dangerous situations.' },
  { value: 'Driven', type: 'Passion', ring: 'Fire', description: 'An intense goal fuels your every action.' },
  { value: 'Eloquent', type: 'Passion', ring: 'Air', description: 'Your words move hearts and minds.' },
  { value: 'Ferocity', type: 'Passion', ring: 'Fire', description: 'When provoked, you fight with unmatched intensity.' },
  { value: 'Indomitable Will', type: 'Passion', ring: 'Earth', description: 'Your resolve cannot be broken.' },
  { value: 'Karmic Connection', type: 'Passion', ring: 'Void', description: 'You share a profound bond with another person.' },
  { value: 'Kinship', type: 'Passion', ring: 'Water', description: 'Your loyalty to your companions is unwavering.' },
  { value: 'Soul of Artistry', type: 'Passion', ring: 'Fire', description: 'Art flows through you like a divine gift.' },
]

export const L5R5E_ADVANTAGE_CATALOG = L5R5E_ADVANTAGES.map(a => ({
  value: a.value,
  description: `${a.type} (${a.ring}) — ${a.description}`,
}))

export const L5R5E_DISADVANTAGES = [
  // Adversities
  { value: 'Bluntness', type: 'Adversity', ring: 'Air', description: 'You struggle with subtlety and tact.' },
  { value: 'Disfigurement', type: 'Adversity', ring: 'Air', description: 'A visible scar or deformity marks you.' },
  { value: 'Frailty', type: 'Adversity', ring: 'Earth', description: 'You are weaker or less healthy than most.' },
  { value: 'Haunting', type: 'Adversity', ring: 'Void', description: 'A restless spirit torments you.' },
  { value: 'Imbalance', type: 'Adversity', ring: 'Void', description: 'Your connection to the elements is unstable.' },
  { value: 'Low Status', type: 'Adversity', ring: 'Water', description: 'Your social standing is lower than your peers.' },
  { value: 'Meekness', type: 'Adversity', ring: 'Fire', description: 'You struggle to assert yourself.' },
  { value: 'Missing Eye', type: 'Adversity', ring: 'Water', description: 'You have lost the use of one eye.' },
  { value: 'Painful Wound', type: 'Adversity', ring: 'Earth', description: 'An old wound still pains you.' },
  { value: 'Shadowlands Taint', type: 'Adversity', ring: 'Earth', description: 'The corruption of Jigoku has touched your soul.' },
  { value: 'Whispers of Cruelty', type: 'Adversity', ring: 'Fire', description: 'Dark impulses plague your thoughts.' },
  // Anxieties
  { value: 'Bitter Betrothal', type: 'Anxiety', ring: 'Air', description: 'An unwanted betrothal weighs on your heart.' },
  { value: 'Dark Secret', type: 'Anxiety', ring: 'Air', description: 'You harbor a secret that would destroy you if revealed.' },
  { value: 'Doubt', type: 'Anxiety', ring: 'Void', description: 'You question your abilities and purpose.' },
  { value: 'Fear of the Dark', type: 'Anxiety', ring: 'Water', description: 'Darkness fills you with unreasoning terror.' },
  { value: 'Gambling Addiction', type: 'Anxiety', ring: 'Fire', description: 'You cannot resist the thrill of a wager.' },
  { value: 'Irrepressible Flirtation', type: 'Anxiety', ring: 'Air', description: 'You cannot help but pursue romantic interests.' },
  { value: 'Lost Love', type: 'Anxiety', ring: 'Water', description: 'A past love haunts your every thought.' },
  { value: 'Momoku (Spiritual Blindness)', type: 'Anxiety', ring: 'Void', description: 'You cannot sense the spiritual world.' },
  { value: 'Sworn Enemy', type: 'Anxiety', ring: 'Fire', description: 'Someone powerful wants your destruction.' },
  { value: 'Traumatic Flashback', type: 'Anxiety', ring: 'Earth', description: 'A past event triggers moments of paralyzing fear.' },
]

export const L5R5E_DISADVANTAGE_CATALOG = L5R5E_DISADVANTAGES.map(d => ({
  value: d.value,
  description: `${d.type} (${d.ring}) — ${d.description}`,
}))

// ── Techniques Catalog ──
export const L5R5E_TECHNIQUES = [
  // Kata
  { value: 'Crashing Wave Style', type: 'Kata', ring: 'Water', rank: 1, description: 'When you succeed on a Strike, move the target 1 range band.' },
  { value: 'Iaijutsu Cut: Rising Blade', type: 'Kata', ring: 'Air', rank: 1, description: 'Make a devastating opening strike from the sheathed blade.' },
  { value: 'Lord Akodo\'s Grip', type: 'Kata', ring: 'Earth', rank: 1, description: 'You cannot be disarmed while using this stance.' },
  { value: 'Soaring Slice', type: 'Kata', ring: 'Air', rank: 1, description: 'After a successful Strike, move 1 range band for free.' },
  { value: 'Striking as Earth', type: 'Kata', ring: 'Earth', rank: 1, description: 'When you Strike, add your Earth ring to the damage.' },
  { value: 'Striking as Fire', type: 'Kata', ring: 'Fire', rank: 1, description: 'When you Strike with explosive successes, add your Fire ring to the damage.' },
  { value: 'Striking as Water', type: 'Kata', ring: 'Water', rank: 1, description: 'After a successful Strike, you may move 1 range band.' },
  { value: 'Tactical Assessment', type: 'Kata', ring: 'Air', rank: 1, description: 'Learn the target\'s physical/supernatural resistances on a successful check.' },
  { value: 'Heartpiercing Strike', type: 'Kata', ring: 'Fire', rank: 2, description: 'Spend Opportunity to inflict a critical strike on a successful attack.' },
  { value: 'Iron Forest Style', type: 'Kata', ring: 'Earth', rank: 2, description: 'While wielding a polearm, increase physical resistance by your Earth ring.' },
  { value: 'Spinning Blades Style', type: 'Kata', ring: 'Fire', rank: 2, description: 'Make attacks against multiple targets in range.' },
  { value: 'Iaijutsu Cut: Crossing Blade', type: 'Kata', ring: 'Air', rank: 3, description: 'A perfected iaijutsu draw that can end a duel instantly.' },
  // Kihō
  { value: 'Earth Needs No Eyes', type: 'Kihō', ring: 'Earth', rank: 1, description: 'Sense the vibrations in the ground to detect nearby beings.' },
  { value: 'Grasp the Earth Dragon', type: 'Kihō', ring: 'Earth', rank: 1, description: 'Root yourself to the ground, becoming nearly immovable.' },
  { value: 'Ki Protection', type: 'Kihō', ring: 'Void', rank: 1, description: 'Use ki to shield yourself from supernatural effects.' },
  { value: 'Way of the Willow', type: 'Kihō', ring: 'Air', rank: 1, description: 'Dodge attacks with supernatural grace.' },
  { value: 'Breaking Blow', type: 'Kihō', ring: 'Fire', rank: 2, description: 'Shatter objects and armor with a focused strike.' },
  { value: 'Channel the Fire Dragon', type: 'Kihō', ring: 'Fire', rank: 2, description: 'Channel fire through your fists.' },
  // Invocations
  { value: 'Biting Steel', type: 'Invocation', ring: 'Fire', rank: 1, description: 'Imbue a weapon with elemental fire for bonus damage.' },
  { value: 'Blessed Wind', type: 'Invocation', ring: 'Air', rank: 1, description: 'Call upon the wind to deflect ranged attacks.' },
  { value: 'Commune with the Spirits', type: 'Invocation', ring: 'Void', rank: 1, description: 'Speak with local kami to learn about an area.' },
  { value: 'Courage of Seven Thunders', type: 'Invocation', ring: 'Water', rank: 1, description: 'Bolster the courage of allies, removing fear effects.' },
  { value: 'Dominion of Suijin', type: 'Invocation', ring: 'Water', rank: 1, description: 'Control and shape water in your vicinity.' },
  { value: 'Earth Becomes Sky', type: 'Invocation', ring: 'Earth', rank: 1, description: 'Hurl stones at a target using earth kami.' },
  { value: 'Extinguish', type: 'Invocation', ring: 'Water', rank: 1, description: 'Put out fires in the area.' },
  { value: 'Fury of Osano-Wo', type: 'Invocation', ring: 'Fire', rank: 1, description: 'Call down a bolt of lightning on a target.' },
  { value: 'Jade Strike', type: 'Invocation', ring: 'Earth', rank: 1, description: 'Strike a supernatural creature with purifying jade energy.' },
  { value: 'Path to Inner Peace', type: 'Invocation', ring: 'Water', rank: 1, description: 'Heal wounds by channeling water kami.' },
  { value: 'Tempest of Air', type: 'Invocation', ring: 'Air', rank: 1, description: 'Create a gust of wind that pushes targets away.' },
  { value: 'Token of Memory', type: 'Invocation', ring: 'Void', rank: 1, description: 'Imbue an object with a memory that can be experienced later.' },
  { value: 'Grasp of Earth', type: 'Invocation', ring: 'Earth', rank: 2, description: 'Trap a target in a prison of earth and stone.' },
  { value: 'Katana of Fire', type: 'Invocation', ring: 'Fire', rank: 2, description: 'Create a blazing sword of pure fire.' },
  { value: 'Rise, Water', type: 'Invocation', ring: 'Water', rank: 2, description: 'Raise a wave of water to sweep away enemies.' },
  // Rituals
  { value: 'Cleansing Rite', type: 'Ritual', ring: 'Water', rank: 1, description: 'Purify an area or person of spiritual corruption.' },
  { value: 'Divination', type: 'Ritual', ring: 'Void', rank: 1, description: 'Receive vague insights about future events.' },
  { value: 'Threshold Barrier', type: 'Ritual', ring: 'Earth', rank: 1, description: 'Ward an entrance against supernatural creatures.' },
  { value: 'Commune with the Deceased', type: 'Ritual', ring: 'Void', rank: 2, description: 'Speak with the spirit of a dead person.' },
  // Shūji
  { value: 'Honest Assessment', type: 'Shūji', ring: 'Air', rank: 1, description: 'Determine a target\'s honor, glory, or status relative to your own.' },
  { value: 'Civility Foremost', type: 'Shūji', ring: 'Earth', rank: 1, description: 'Maintain composure and force others to remain civil.' },
  { value: 'Cadence', type: 'Shūji', ring: 'Water', rank: 1, description: 'Set the pace of a conversation, controlling who speaks.' },
  { value: 'Stirring the Embers', type: 'Shūji', ring: 'Fire', rank: 1, description: 'Inflame passions in a target, provoking emotional responses.' },
  { value: 'All in Jest', type: 'Shūji', ring: 'Air', rank: 1, description: 'Disguise insults as jokes, making accusations without losing face.' },
  { value: 'Tributaries of Trade', type: 'Shūji', ring: 'Water', rank: 1, description: 'Gain an advantage in mercantile negotiations.' },
  { value: 'Breath of Wind Style', type: 'Shūji', ring: 'Air', rank: 2, description: 'Subtly redirect a conversation to the topic you choose.' },
  // Ninjutsu
  { value: 'Skulk', type: 'Ninjutsu', ring: 'Air', rank: 1, description: 'Move stealthily, reducing the TN to avoid detection.' },
  { value: 'Deadly Sting', type: 'Ninjutsu', ring: 'Fire', rank: 1, description: 'Apply poison to a weapon for your next strike.' },
  { value: 'Shadowed Wings', type: 'Ninjutsu', ring: 'Air', rank: 2, description: 'Scale walls and move through shadows with supernatural ease.' },
  // Mahō
  { value: 'Sinful Whisper', type: 'Mahō', ring: 'Air', rank: 1, description: 'Implant a suggestion in a target\'s mind using blood magic.' },
  { value: 'Dark Resurrection', type: 'Mahō', ring: 'Earth', rank: 2, description: 'Raise a corpse as an undead servant.' },
]

export const L5R5E_TECHNIQUE_CATALOG = L5R5E_TECHNIQUES.map(t => ({
  value: t.value,
  description: `${t.type} (${t.ring}, Rank ${t.rank}) — ${t.description}`,
}))

// ── Weapons ──
export const L5R5E_WEAPONS = [
  // Swords
  { name: 'Katana', category: 'Sword', grip: 'One-handed', range: '0-1', damage: 4, deadliness: 5, qualities: 'Ceremonial, Razor-Edged', description: 'The soul of the samurai, a curved single-edged blade.' },
  { name: 'Wakizashi', category: 'Sword', grip: 'One-handed', range: '0', damage: 3, deadliness: 5, qualities: 'Ceremonial, Concealable, Razor-Edged', description: 'The companion sword, worn at all times.' },
  { name: 'Nodachi', category: 'Sword', grip: 'Two-handed', range: '1', damage: 6, deadliness: 6, qualities: 'Durable, Razor-Edged', description: 'A massive two-handed field sword.' },
  { name: 'Tachi', category: 'Sword', grip: 'One-handed', range: '1', damage: 5, deadliness: 5, qualities: 'Ceremonial, Razor-Edged', description: 'An older style of curved sword, worn edge-down.' },
  // Polearms
  { name: 'Yari', category: 'Polearm', grip: 'Two-handed', range: '1-2', damage: 5, deadliness: 4, qualities: 'Durable', description: 'A bamboo-hafted spear, the weapon of the ashigaru.' },
  { name: 'Naginata', category: 'Polearm', grip: 'Two-handed', range: '1-2', damage: 6, deadliness: 5, qualities: 'Durable, Razor-Edged', description: 'A curved-blade polearm favored by warrior monks.' },
  { name: 'Bisento', category: 'Polearm', grip: 'Two-handed', range: '1-2', damage: 7, deadliness: 4, qualities: 'Durable', description: 'A heavy-bladed polearm for cleaving through armor.' },
  // Clubs
  { name: 'Bō', category: 'Club', grip: 'Two-handed', range: '1', damage: 4, deadliness: 2, qualities: 'Mundane', description: 'A simple wooden staff used by monks and peasants.' },
  { name: 'Tetsubō', category: 'Club', grip: 'Two-handed', range: '1', damage: 7, deadliness: 3, qualities: 'Durable, Wargear', description: 'An iron-studded war club favored by the Crab.' },
  { name: 'Masakari', category: 'Club', grip: 'One-handed', range: '0-1', damage: 5, deadliness: 4, qualities: 'Durable, Wargear', description: 'A heavy war axe.' },
  { name: 'Ōtsuchi', category: 'Club', grip: 'Two-handed', range: '1', damage: 6, deadliness: 3, qualities: 'Durable, Wargear', description: 'A great hammer used to breach fortifications.' },
  // Ranged
  { name: 'Yumi', category: 'Bow', grip: 'Two-handed', range: '2-5', damage: 5, deadliness: 3, qualities: '', description: 'The asymmetric longbow of the samurai.' },
  { name: 'Daikyū', category: 'Bow', grip: 'Two-handed', range: '3-6', damage: 6, deadliness: 4, qualities: 'Wargear', description: 'A great war bow with exceptional range.' },
  { name: 'Blowgun', category: 'Ranged', grip: 'One-handed', range: '1-3', damage: 1, deadliness: 3, qualities: 'Concealable', description: 'A hidden weapon used to deliver poisons.' },
  { name: 'Knife', category: 'Small', grip: 'One-handed', range: '0', damage: 2, deadliness: 4, qualities: 'Concealable, Mundane', description: 'A simple utilitarian blade.' },
  { name: 'Shuriken', category: 'Ranged', grip: 'One-handed', range: '0-2', damage: 2, deadliness: 5, qualities: 'Concealable', description: 'Throwing blades concealed in the palm.' },
  // Unarmed
  { name: 'Fist', category: 'Unarmed', grip: 'One-handed', range: '0', damage: 1, deadliness: 1, qualities: 'Mundane', description: 'An unarmed strike.' },
]

export const L5R5E_WEAPON_CATALOG = L5R5E_WEAPONS.map(w => ({
  value: w.name,
  description: `${w.category} — Dmg ${w.damage}, DL ${w.deadliness}, Range ${w.range}. ${w.qualities || 'No special qualities.'}`,
}))

// ── Armor ──
export const L5R5E_ARMOR = [
  { name: 'Ashigaru Armor', resistance: 3, qualities: 'Durable, Mundane, Wargear', description: 'Light armor worn by foot soldiers.' },
  { name: 'Lacquered Armor', resistance: 4, qualities: 'Ceremonial, Cumbersome, Durable, Wargear', description: 'Fine samurai armor, lacquered and decorated.' },
  { name: 'Heavy Armor', resistance: 5, qualities: 'Cumbersome, Durable, Wargear', description: 'The heaviest battlefield armor.' },
  { name: 'Riding Armor', resistance: 3, qualities: 'Durable, Wargear', description: 'Light armor designed for mounted combat.' },
  { name: 'Robes', resistance: 1, qualities: 'Ceremonial, Mundane', description: 'Priestly or courtly robes offering minimal protection.' },
  { name: 'Traveling Clothes', resistance: 0, qualities: 'Mundane', description: 'Ordinary traveling garb.' },
]

export const L5R5E_ARMOR_CATALOG = L5R5E_ARMOR.map(a => ({
  value: a.name,
  description: `Physical Resistance ${a.resistance}. ${a.qualities}. ${a.description}`,
}))

// ── Dice Face Distributions ──

// Ring Die (d6): faces indexed 0-5
export const RING_DIE = [
  null, // blank
  { strife: 1, opportunity: 1 }, // strife + opportunity
  { opportunity: 1 }, // opportunity
  { success: 1, strife: 1 }, // success + strife
  { success: 1 }, // success
  { explosive: 1, strife: 1 }, // explosive success + strife
]

// Skill Die (d12): faces indexed 0-11
export const SKILL_DIE = [
  null, // blank
  null, // blank
  { opportunity: 1 }, // opportunity
  { opportunity: 1 }, // opportunity
  { success: 1 }, // success
  { success: 1, strife: 1 }, // success + strife
  { success: 1, strife: 1 }, // success + strife
  { success: 1, opportunity: 1 }, // success + opportunity
  { explosive: 1 }, // explosive
  { success: 1, opportunity: 1 }, // success + opportunity
  { explosive: 1, strife: 1 }, // explosive + strife
  { explosive: 1 }, // explosive
]
