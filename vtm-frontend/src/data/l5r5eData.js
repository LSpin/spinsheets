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
  // Courts of Stone
  { value: 'Deer', ringIncrease: 'Air', skillIncrease: 'Sentiment', status: 30, description: 'Guardians of balance who weave and sever the threads of fate.', source: 'Courts of Stone' },
  // Mantis DLC
  { value: 'Mantis', ringIncrease: 'Water', skillIncrease: 'Seafaring', status: 25, description: 'Rugged sailors and merchants from the Islands of Silk and Spice.', source: 'Mantis DLC' },
  // Minor Clans (Minor Clans supplement)
  { value: 'Badger', ringIncrease: 'Water', skillIncrease: 'Fitness', status: 25, description: 'Defenders of the northern border, famous wrestlers.', source: 'Minor Clans' },
  { value: 'Bat', ringIncrease: 'Fire', skillIncrease: 'Theology', status: 25, description: 'Spiritual mediums who ferry messages to the dead.', source: 'Minor Clans' },
  { value: 'Bear', ringIncrease: 'Earth', skillIncrease: 'Fitness', status: 25, description: 'Short-lived clan of sumai wrestlers and berserkers.', source: 'Minor Clans' },
  { value: 'Bee', ringIncrease: 'Water', skillIncrease: 'Aesthetics', status: 25, description: 'Sharp-tongued art critics and magistrates of art.', source: 'Minor Clans' },
  { value: 'Boar', ringIncrease: 'Earth', skillIncrease: 'Labor', status: 25, description: 'Vanished miners who struck bargains with mountain spirits.', source: 'Minor Clans' },
  { value: 'Cat', ringIncrease: 'Fire', skillIncrease: 'Skulduggery', status: 25, description: 'Shinobi for hire living on a barren island.', source: 'Minor Clans' },
  { value: 'Dragonfly', ringIncrease: 'Air', skillIncrease: 'Courtesy', status: 25, description: 'Gatekeepers and emissaries of the Dragon Clan.', source: 'Writ of the Wilds' },
  { value: 'Firefly', ringIncrease: 'Water', skillIncrease: 'Seafaring', status: 25, description: 'Naval patrollers of the Phoenix-Imperial shore.', source: 'Minor Clans' },
  { value: 'Fox', ringIncrease: 'Fire', skillIncrease: 'Survival', status: 25, description: 'Nature-attuned descendants of the Kirin Clan.', source: 'Children of the Five Winds' },
  { value: 'Hare', ringIncrease: 'Air', skillIncrease: 'Fitness', status: 25, description: 'Bloodspeaker hunters formed to combat Mahotsukai.', source: 'Minor Clans' },
  { value: 'Monkey', ringIncrease: 'Earth', skillIncrease: 'Sentiment', status: 25, description: 'Clan founded by a heimin who saved the throne.', source: 'Minor Clans' },
  { value: 'Mongoose', ringIncrease: 'Fire', skillIncrease: 'Medicine', status: 25, description: 'Poison experts who root out corruption in Zakyo Toshi.', source: 'Minor Clans' },
  { value: 'Moth', ringIncrease: 'Void', skillIncrease: 'Theology', status: 25, description: 'Dream warriors who combat threats from Yume-do.', source: 'Minor Clans' },
  { value: 'Ox', ringIncrease: 'Earth', skillIncrease: 'Survival', status: 20, description: 'Exiled Utaku sons leading a mercenary band.', source: 'Minor Clans' },
  { value: 'Peacock', ringIncrease: 'Air', skillIncrease: 'Courtesy', status: 25, description: 'Flamboyant courtiers found at courts across the Empire.', source: 'Minor Clans' },
  { value: 'Raven', ringIncrease: 'Earth', skillIncrease: 'Theology', status: 25, description: 'Traveling mercenary monks tied to the Brotherhood.', source: 'Minor Clans' },
  { value: 'Salamander', ringIncrease: 'Void', skillIncrease: 'Calligraphy', status: 25, description: 'Eclectic shugenja experimenting with void magic.', source: 'Minor Clans' },
  { value: 'Shark', ringIncrease: 'Fire', skillIncrease: 'Command', status: 25, description: 'Feared duelists and cold-blooded killers.', source: 'Minor Clans' },
  { value: 'Snake', ringIncrease: 'Water', skillIncrease: 'Theology', status: 25, description: 'Legendary maho hunters, destroyed by the Phoenix.', source: 'Minor Clans' },
  { value: 'Sparrow', ringIncrease: 'Air', skillIncrease: 'Labor', status: 25, description: 'Humble Crane offshoot devoted to the Tao.', source: 'Minor Clans' },
  { value: 'Tanuki', ringIncrease: 'Fire', skillIncrease: 'Performance', status: 25, description: 'Storytellers exploring the secrets of Shinomen forest.', source: 'Minor Clans' },
  { value: 'Wasp', ringIncrease: 'Water', skillIncrease: 'Survival', status: 25, description: 'Mercenary archers from a Lion-Scorpion contested province.', source: 'Minor Clans' },
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
  // Courts of Stone
  Deer: [
    { value: 'Shika', ringOptions: ['Water', 'Fire'], skills: ['+1 Courtesy', '+1 Culture'], glory: 35, wealth: 5, description: 'Descendants of the clan founders, matchmakers and speardancers.', source: 'Courts of Stone' },
  ],
  // Mantis DLC
  Mantis: [
    { value: 'Families of the Fleet', ringOptions: ['Fire', 'Water'], skills: ['+1 Commerce', '+1 Survival'], glory: 36, wealth: 7, description: 'Mantis samurai take their names from the ships they sail with.', source: 'Mantis DLC' },
  ],
  // Minor Clans supplement
  Badger: [
    { value: 'Fureheshu', ringOptions: ['Earth', 'Water'], skills: ['+1 Fitness', '+1 Performance'], glory: 37, wealth: 5, description: 'Famous wrestlers descended from an oni slayer.', source: 'Minor Clans' },
    { value: 'Ichiro', ringOptions: ['Earth', 'Water'], skills: ['+1 Commerce', '+1 Fitness'], glory: 37, wealth: 5, description: 'Reclusive family guarding the northern border.', source: 'Minor Clans' },
    { value: 'Tashimi', ringOptions: ['Air', 'Water'], skills: ['+1 Command', '+1 Sentiment'], glory: 35, wealth: 4, description: 'Teachers and magistrates in the City of the Rich Frog.', source: 'Minor Clans' },
  ],
  Bat: [
    { value: 'Iongi', ringOptions: ['Fire', 'Void'], skills: ['+1 Labor', '+1 Theology'], glory: 36, wealth: 4, description: 'Temple builders and shrine keepers of the Bat.', source: 'Minor Clans' },
    { value: 'Komori', ringOptions: ['Air', 'Void'], skills: ['+1 Composition', '+1 Meditation'], glory: 36, wealth: 4, description: 'Reclusive spiritual mediums on the Isles of Silk and Spice.', source: 'Minor Clans' },
  ],
  Bear: [
    { value: 'Kuma', ringOptions: ['Water', 'Void'], skills: ['+1 Fitness', '+1 Survival'], glory: 32, wealth: 3, description: 'Sumai wrestlers and berserkers bearing a forgotten name.', source: 'Minor Clans' },
  ],
  Bee: [
    { value: 'Hachi', ringOptions: ['Air', 'Fire'], skills: ['+1 Design', '+1 Games'], glory: 37, wealth: 4, description: 'Art critics led by a council of five matriarchs.', source: 'Minor Clans' },
  ],
  Boar: [
    { value: 'Heichi', ringOptions: ['Earth', 'Void'], skills: ['+1 Fitness', '+1 Survival'], glory: 33, wealth: 3, description: 'Vanished miners whose lands are cursed and haunted.', source: 'Minor Clans' },
  ],
  Cat: [
    { value: 'Nekoma', ringOptions: ['Air', 'Water'], skills: ['+1 Courtesy', '+1 Performance'], glory: 33, wealth: 4, description: 'Traveling entertainers and acrobats who are secretly shinobi.', source: 'Minor Clans' },
  ],
  Dragonfly: [
    { value: 'Koshei', ringOptions: ['Earth', 'Void'], skills: ['+1 Meditation', '+1 Tactics'], glory: 36, wealth: 4, description: 'Tragic yojimbo protectors sworn to the Tonbo.', source: 'Minor Clans' },
    { value: 'Senkensha', ringOptions: ['Air', 'Void'], skills: ['+1 Government', '+1 Theology'], glory: 35, wealth: 4, description: 'Seers who foresee the future for the Dragonfly.', source: 'Minor Clans' },
    { value: 'Tonbo', ringOptions: ['Void', 'Water'], skills: ['+1 Sentiment', '+1 Theology'], glory: 37, wealth: 4, description: 'Pacifist courtiers and diplomats of the Dragon.', source: 'Minor Clans' },
  ],
  Firefly: [
    { value: 'Hotaru', ringOptions: ['Fire', 'Void'], skills: ['+1 Command', '+1 Tactics'], glory: 35, wealth: 4, description: 'Diligent lighthouse keepers and naval seamen.', source: 'Minor Clans' },
  ],
  Fox: [
    { value: 'Byako', ringOptions: ['Air', 'Fire'], skills: ['+1 Survival', '+1 Theology'], glory: 36, wealth: 4, description: 'Mystical family said to be descended from a kitsune.', source: 'Minor Clans' },
    { value: 'Kitsune', ringOptions: ['Air', 'Fire'], skills: ['+1 Medicine', '+1 Theology'], glory: 36, wealth: 4, description: 'Nature-attuned shugenja specializing in illusion and trickery.', source: 'Minor Clans' },
    { value: 'Shudo', ringOptions: ['Earth', 'Fire'], skills: ['+1 Command', '+1 Fitness'], glory: 37, wealth: 4, description: 'Warriors trained by the Matsu who protect the Fox.', source: 'Minor Clans' },
  ],
  Hare: [
    { value: 'Ujina', ringOptions: ['Air', 'Fire'], skills: ['+1 Tactics', '+1 Skulduggery'], glory: 33, wealth: 4, description: 'Stealthy hunters who track bloodspeakers.', source: 'Minor Clans' },
    { value: 'Usagi', ringOptions: ['Fire', 'Water'], skills: ['+1 Sentiment', '+1 Fitness'], glory: 35, wealth: 4, description: 'Swift and persistent bloodspeaker hunters.', source: 'Minor Clans' },
  ],
  Monkey: [
    { value: 'Fuzake', ringOptions: ['Air', 'Fire'], skills: ['+1 Performance', '+1 Theology'], glory: 33, wealth: 4, description: 'Comedic performers who bring levity to troubled times.', source: 'Minor Clans' },
    { value: 'Toku', ringOptions: ['Air', 'Earth'], skills: ['+1 Command', '+1 Culture'], glory: 36, wealth: 5, description: 'Cheerful record-keepers and travelers.', source: 'Minor Clans' },
  ],
  Mongoose: [
    { value: 'Noburo', ringOptions: ['Air', 'Fire'], skills: ['+1 Command', '+1 Skulduggery'], glory: 36, wealth: 3, description: 'Magistrates who root out corruption in Zakyo Toshi.', source: 'Minor Clans' },
  ],
  Moth: [
    { value: 'Kaikoga', ringOptions: ['Fire', 'Void'], skills: ['+1 Sentiment', '+1 Theology'], glory: 35, wealth: 4, description: 'Dream-walking shugenja who enter Yume-do.', source: 'Minor Clans' },
  ],
  Ox: [
    { value: 'Morito', ringOptions: ['Fire', 'Water'], skills: ['+1 Culture', '+1 Survival'], glory: 33, wealth: 4, description: 'Boisterous mercenaries who revel in freedom.', source: 'Minor Clans' },
  ],
  Peacock: [
    { value: 'Kujaku', ringOptions: ['Air', 'Water'], skills: ['+1 Design', '+1 Culture'], glory: 35, wealth: 4, description: 'Charming courtiers known for flamboyance and scandal.', source: 'Minor Clans' },
  ],
  Raven: [
    { value: 'Karasu', ringOptions: ['Air', 'Water'], skills: ['+1 Survival', '+1 Tactics'], glory: 35, wealth: 3, description: 'Traveling mercenary monks dedicated to Shinseism.', source: 'Minor Clans' },
  ],
  Salamander: [
    { value: 'Hitokage', ringOptions: ['Fire', 'Void'], skills: ['+1 Courtesy', '+1 Theology'], glory: 35, wealth: 4, description: 'Open-minded shugenja experimenting with void magic.', source: 'Minor Clans' },
  ],
  Shark: [
    { value: 'Jirozame', ringOptions: ['Earth', 'Water'], skills: ['+1 Skulduggery', '+1 Survival'], glory: 32, wealth: 4, description: 'Cold-blooded killers recruited for their viciousness.', source: 'Minor Clans' },
  ],
  Snake: [
    { value: 'Chuda', ringOptions: ['Earth', 'Fire'], skills: ['+1 Courtesy', '+1 Skulduggery'], glory: 32, wealth: 3, description: 'Secretive descendants of the destroyed Snake Clan.', source: 'Minor Clans' },
  ],
  Sparrow: [
    { value: 'Aika', ringOptions: ['Air', 'Void'], skills: ['+1 Sentiment', '+1 Theology'], glory: 34, wealth: 3, description: 'Shape-shifting starling shugenja of the Sparrow.', source: 'Minor Clans' },
    { value: 'Edakumi', ringOptions: ['Air', 'Fire'], skills: ['+1 Aesthetics', '+1 Command'], glory: 35, wealth: 3, description: 'Artisans who bring joy through their masterpieces.', source: 'Minor Clans' },
    { value: 'Suzume', ringOptions: ['Earth', 'Void'], skills: ['+1 Culture', '+1 Sentiment'], glory: 34, wealth: 3, description: 'Famously long-winded storytellers of the Sparrow.', source: 'Minor Clans' },
  ],
  Tanuki: [
    { value: 'Tanuki', ringOptions: ['Air', 'Void'], skills: ['+1 Survival', '+1 Sentiment'], glory: 33, wealth: 3, description: 'Whimsical forest explorers and tale-tellers.', source: 'Minor Clans' },
  ],
  Wasp: [
    { value: 'Kagehisa', ringOptions: ['Air', 'Void'], skills: ['+1 Skulduggery', '+1 Survival'], glory: 33, wealth: 3, description: 'Mercenary archers who failed the Wasp Champion\'s final test.', source: 'Minor Clans' },
    { value: 'Suguru', ringOptions: ['Earth', 'Water'], skills: ['+1 Command', '+1 Theology'], glory: 34, wealth: 3, description: 'Maho-tsukai hunters who serve as Wasp magistrates.', source: 'Minor Clans' },
    { value: 'Tsuruichi', ringOptions: ['Air', 'Earth'], skills: ['+1 Fitness', '+1 Skulduggery'], glory: 34, wealth: 4, description: 'Elite mercenary archers and the Wasp\'s core family.', source: 'Minor Clans' },
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
  // Courts of Stone — New Schools
  {
    value: 'Bayushi Deathdealer', clan: 'Scorpion', type: 'Bushi/Shinobi',
    rings: '+1 Air, +1 Fire', skills: '5 from: Command, Courtesy, Fitness, Martial Arts [Melee], Martial Arts [Ranged], Tactics, Sentiment, Skulduggery',
    honor: 40, techniques: 'Kata, Rituals, Shūji',
    startingTechniques: 'Kata (choose one): Striking as Air or Striking as Fire; Shūji: Assess Strengths; Way of the Scorpion (School Ability)',
    schoolAbility: 'Way of the Scorpion: When you exploit a target\'s disadvantage as part of an Initiative check for a duel or an Attack action, you do not need to spend a Void point, and you may reroll additional dice up to your school rank.',
    outfit: 'Traveling clothes, ashigaru armor, daishō, knife, shinobigatana or folding half bow, traveling pack',
    description: 'Scorpion warriors who train under the principle that it is always better to be underestimated.',
    source: 'Courts of Stone',
  },
  {
    value: 'Daidoji Spymaster', clan: 'Crane', type: 'Courtier/Shinobi',
    rings: '+1 Air, +1 Earth', skills: '5 from: Command, Courtesy, Culture, Government, Performance, Sentiment, Skulduggery',
    honor: 35, techniques: 'Kata, Rituals, Shūji',
    startingTechniques: 'Shūji: Ancestry Unearthed; Ninjutsu (choose one): Like a Ghost, Skulk; Kata (choose one): Striking as Air, Striking as Earth; Incisive Insight (School Ability)',
    schoolAbility: 'Incisive Insight: Once per scene, when making a check for a Scheme action targeting another character, you may receive strife up to your school rank to reduce the TN by that amount (minimum 1).',
    outfit: 'Traveling clothes, ceremonial clothes, wakizashi, sokutoki, disguise kit, opening and closing kit',
    description: 'Crane intelligence agents who infiltrate organizations and gather secrets for the Daidoji.',
    source: 'Courts of Stone',
  },
  {
    value: 'Doji Bureaucrat', clan: 'Crane', type: 'Courtier',
    rings: '+1 Earth, +1 Water', skills: '5 from: Command, Composition, Courtesy, Culture, Games, Government, Meditation',
    honor: 55, techniques: 'Rituals, Shūji',
    startingTechniques: 'Shūji: Courtier\'s Resolve, Stonewall Tactics; Procedure and Protocol (School Ability)',
    schoolAbility: 'Procedure and Protocol: When you cause a character to receive strife as a result of a check using a social approach, that character suffers additional strife equal to your school rank.',
    outfit: 'Ceremonial clothing, wakizashi, legal primer, blank forms, calligraphy kit, scroll of authority',
    description: 'Crane researchers and bureaucrats who outmaneuver opponents through mastery of law and procedure.',
    source: 'Courts of Stone',
  },
  {
    value: 'Ikoma Shadow', clan: 'Lion', type: 'Courtier/Shinobi',
    rings: '+1 Air, +1 Fire', skills: '5 from: Courtesy, Culture, Government, Martial Arts [Melee], Martial Arts [Ranged], Skulduggery, Survival',
    honor: 40, techniques: 'Kata, Rituals, Shūji',
    startingTechniques: 'Shūji: Whispers of Court; Ninjutsu: Skulk; Kata (choose one): Hawk\'s Precision, Warrior\'s Resolve; Victory before Honor (School Ability)',
    schoolAbility: 'Victory before Honor: Once per scene when performing a check, you may stake an amount of honor no greater than your school rank to re-roll a number of dice equal to twice the amount of honor staked. For each re-rolled die without success or explosive, you forfeit one staked honor.',
    outfit: 'Ashigaru armor or ceremonial clothes, daishō or wakizashi and kamayari, yumi, one musical instrument or book of poetry, traveling pack',
    description: 'Hidden among the Ikoma bards, these shinobi infiltrate enemy camps and enemy castles.',
    source: 'Courts of Stone',
  },
  {
    value: 'Shiba Artist', clan: 'Phoenix', type: 'Artisan',
    rings: '+1 Fire, +1 Void', skills: '5 from: Aesthetics, Composition, Courtesy, Culture, Design, Performance, Smithing',
    honor: 50, techniques: 'Kata, Rituals, Shūji',
    startingTechniques: 'Ritual: Tea Ceremony; Shūji (choose two): Assess Strengths, Courtier\'s Resolve, Fun and Games; Architect of Tranquility (School Ability)',
    schoolAbility: 'Architect of Tranquility: Once per scene after you succeed at an Artisan skill check, you may choose a number of characters in the scene equal to your school rank. Each chosen character removes 3 strife.',
    outfit: 'Ceremonial clothes, common clothes, traveling clothes, wakizashi, traveling pack, calligraphy set',
    description: 'Phoenix artisans renowned for deeply spiritual works of art that soothe the soul.',
    source: 'Courts of Stone',
  },
  {
    value: 'Shika Matchmaker', clan: 'Deer', type: 'Courtier/Shugenja',
    rings: '+1 Air, +1 Water', skills: '3 from: Composition, Courtesy, Culture, Sentiment, Theology',
    honor: 50, techniques: 'Air and Water Invocations, Rituals, Shūji',
    startingTechniques: 'Ritual: The Ties that Bind; Invocation: Yari of Air; Invocation (choose two): Blessed Wind, Path to Inner Peace, Sympathetic Energies, Tempest of Air; Gift of Musubi-no-Kami (School Ability)',
    schoolAbility: 'Gift of Musubi-no-Kami: You may perform The Ties that Bind ritual as an action instead of a downtime activity. When you make a check to perform this ritual, you may add kept dice set to Opportunity results equal to your school rank.',
    outfit: 'Traveling clothes, ceremonial clothes, wakizashi, tea set',
    description: 'Deer Clan shugenja guided by Musubi who read the bonds of fate between people.',
    source: 'Courts of Stone',
  },
  {
    value: 'Shika Speardancer', clan: 'Deer', type: 'Bushi/Shinobi',
    rings: '+1 Air, +1 Fire', skills: '5 from: Martial Arts [Melee], Meditation, Skulduggery, Survival, Fitness, Courtesy, Sentiment',
    honor: 35, techniques: 'Kata, Rituals, Shūji',
    startingTechniques: 'Kata: Trip the Leg; Kata (choose 1): Striking as Air, Striking as Fire; Typhoon in the Bamboo Grove (School Ability)',
    schoolAbility: 'Typhoon in the Bamboo Grove: When making a Martial Arts [Melee] or Fitness check, you may spend Opportunity to cause a number of characters no greater than your school rank and within range of your readied weapon to suffer the Dazed condition.',
    outfit: 'Traveling clothes, stealth clothing or ashigaru armor, yari or kamayari, wakizashi, traveling pack',
    description: 'Deer Clan yojimbo and shinobi who fight with acrobatic spear techniques.',
    source: 'Courts of Stone',
  },
  {
    value: 'Togashi Chronicler', clan: 'Dragon', type: 'Courtier/Monk',
    rings: '+1 Earth, +1 Water', skills: '4 from: Culture, Fitness, Martial Arts [Unarmed], Labor, Meditation, Performance',
    honor: 40, techniques: 'Kata, Rituals, Shūji',
    startingTechniques: 'Ritual: Divination; Kihō (choose one): Cleansing Spirit, Ki Protection; Shūji (choose one): Honest Assessment, Truth Burns Through Lies; A Grain of Truth (School Ability)',
    schoolAbility: 'A Grain of Truth: Once per scene after you succeed on a Social skill check, you may choose a kihō with a prerequisite up to your school rank. You gain the benefits of its Enhancement Effect as if you had successfully activated it. This persists until end of scene.',
    outfit: 'Traveling clothes, bō, knife, traveling pack',
    description: 'Dragon monks who collect stories and lore to illuminate patterns in human nature.',
    source: 'Courts of Stone',
  },
  {
    value: 'Yasuki Yōjimbō', clan: 'Crab', type: 'Bushi',
    rings: '+1 Earth, +1 Water', skills: '5 from: Martial Arts [Melee], Martial Arts [Ranged], Tactics, Commerce, Courtesy, Seafaring, Survival',
    honor: 50, techniques: 'Kata, Rituals, Shūji',
    startingTechniques: 'Kata: Crescent Moon Style; Shūji (choose one): Honest Assessment, Well of Desire; Claws of the Crab (School Ability)',
    schoolAbility: 'Claws of the Crab: When you successfully perform the Guard action, when you make a check to perform the Guard action, you may spend Opportunity as follows: If you succeed, you may guard one additional character in range per Opportunity spent, up to your school rank.',
    outfit: 'Crossbow or spear, daishō, pony or ashigaru armor, traveling pack, map of Crab Lands, knife',
    description: 'Crab bodyguards who protect Yasuki Merchants and caravans across Rokugan.',
    source: 'Courts of Stone',
  },
  {
    value: 'Mercenary Ninja Training', clan: 'Rōnin', type: 'Shinobi',
    rings: '+1 Air, +1 any', skills: '5 from: Fitness, Martial Arts [Melee], Martial Arts [Ranged], Martial Arts [Unarmed], Medicine, Skulduggery, Survival',
    honor: 20, techniques: 'Kata, Ninjutsu, Rituals',
    startingTechniques: 'Ninjutsu: Skulk; Shūji (choose one): Cadence, Shallow Waters; Disciple of Darkness (School Ability)',
    schoolAbility: 'Disciple of Darkness: When you perform a check to hide, move stealthily, or deceive others as to your true identity, you may suffer strife up to your school rank to choose that many characters targeted by the check. Treat each chosen character\'s vigilance as 1 lower.',
    outfit: 'Kusarifundo or tekken, kama or ninjatō, 3 shuriken or blowgun, stealth clothes, peasant clothes, 50 feet of rope, tenugui',
    description: 'Mercenary ninja who ply their lethal trade without honor, family, or remorse.',
    source: 'Courts of Stone',
  },
  // Mantis DLC — New Schools
  {
    value: 'Storm Fleet Sailor', clan: 'Mantis', type: 'Bushi',
    rings: '+1 Fire, +1 Water', skills: '5 from: Commerce, Fitness, Games, Labor, Martial Arts [Melee], Martial Arts [Ranged], Seafaring',
    honor: 35, techniques: 'Kata, Rituals, Shūji',
    startingTechniques: 'Kata: Pelting Hail Style; Shūji (choose one): All in Jest, Stirring the Embers; Sailor\'s Fortune (School Ability)',
    schoolAbility: 'Sailor\'s Fortune: Once per round when making a Trade skill check, if you are not Compromised, you may receive a number of strife up to your school rank to reroll that many rolled dice.',
    outfit: 'Sailor\'s garb, wakizashi (short sword), knife, any two weapons of rarity 6 or lower, yumi, quiver of arrows, traveling pack, rope, gambling set, fishing rod and line',
    description: 'Opportunistic Mantis warriors who fight on the rocking decks of kobune.',
    source: 'Mantis DLC',
  },
  {
    value: 'Storm Fleet Tide Seer', clan: 'Mantis', type: 'Shugenja',
    rings: '+1 Air, +1 Water', skills: '3 from: Commerce, Fitness, Games, Labor, Martial Arts [Melee], Seafaring, Theology',
    honor: 40, techniques: 'Air and Water Invocations, Rituals, Shūji',
    startingTechniques: 'Invocations: Dominion of Suijin, Tempest of Air; Invocations (choose one): Bō of Water, Path to Inner Peace, Yari of Air; Rituals: Commune with the Spirits, Divination; Eye of the Storm (School Ability)',
    schoolAbility: 'Eye of the Storm: When an invocation technique you perform would affect "each character" or "each other character" at a specified range, you may exclude a number of characters up to your school rank from all effects of the invocation except spiritual backlash.',
    outfit: 'Sailor\'s garb, wakizashi, knife, any one weapon of rarity 6 or lower, traveling pack, divination set (cards, shells, or dice)',
    description: 'Mantis tenkinja who read the tides, appease sea kami, and protect their fleets from storms.',
    source: 'Mantis DLC',
  },
  // ── Writ of the Wilds — New Schools ──
  {
    value: 'Dragonfly Grace of the Spirits School', clan: 'Dragonfly', type: 'Courtier/Shugenja',
    rings: '+1 Air, +1 Water', skills: '5 from: Command, Courtesy, Culture, Games, Government, Martial Arts [Melee], Theology',
    honor: 40, techniques: 'Invocations, Rituals, Shūji',
    startingTechniques: 'Invocations: Dominion of Suijin, Reflections of P\'an Ku; Rituals (choose three): Cleansing Rite, Commune with the Spirits, Divination, Threshold Barrier',
    schoolAbility: 'May the Spirits Show the Path: Once per scene if you would fail a Social check, you may make a TN 5 Theology (Water) check (TN reduced by school rank, minimum 1). On success, change any kept die on that Social check to Opportunity results.',
    outfit: 'Traveling clothes, sanctified robes, wakizashi, any weapon of rarity 6 or lower, scroll satchel, calligraphy set, list of observations, traveling pack',
    description: 'Dragonfly shugenja known for their tact and patience, calling upon air kami to aid social and political endeavors.',
    source: 'Writ of the Wilds',
  },
  {
    value: 'Laughing Mountain Hearthstone Tradition', clan: 'Dragonfly', type: 'Courtier/Monk',
    rings: '+1 Air, +1 Fire', skills: '5 from: Composition, Courtesy, Games, Martial Arts [Melee], Martial Arts [Unarmed], Performance, Sentiment',
    honor: 28, techniques: 'Kata, Rituals, Shūji',
    startingTechniques: 'Shūji (choose two): Sensational Distraction, Stirring the Embers, Truth Burns Through Lies',
    schoolAbility: 'Laughter Makes the Home: The first time you succeed on a Social check against another character in a scene, reduce the TN of all subsequent Social checks against that character by 1 (minimum 1).',
    outfit: 'Traveling clothes, bō (staff), one weapon of rarity 6 or lower, traveling pack, woolly pony',
    description: 'Hearthstones of the Laughing Mountain people create perfect atmospheres as dedicated hosts and mediators.',
    source: 'Writ of the Wilds',
  },
  {
    value: 'Shinomen Naga Seer Tradition', clan: 'Dragonfly', type: 'Courtier/Bushi',
    rings: '+1 Earth, +1 Water', skills: '5 from: Courtesy, Fitness, Martial Arts [Melee], Martial Arts [Ranged], Meditation, Performance, Survival',
    honor: 55, techniques: 'Kata, Rituals, Shūji',
    startingTechniques: 'Kata (choose one): Crescent Moon Style, Striking as Water; Shūji (choose one): Shallow Waters, Stonewall Tactics, Weight of Duty',
    schoolAbility: 'Bend Perception: Switch between true Naga form and illusory alternate form. Increase tail damage by school rank.',
    outfit: 'Naga armor (Physical 2, Supernatural 1), yumi, quiver, nagi-nata, traveling pack, personal pearl (sacred)',
    description: 'Naga seers who cloak themselves in illusory guises, adept at bending others\' perceptions.',
    source: 'Writ of the Wilds',
  },
  {
    value: 'Nezumi Tattered Ear Explorer Tradition', clan: 'Dragonfly', type: 'Bushi',
    rings: '+1 Earth, +1 Fire', skills: '5 from: Commerce, Fitness, Martial Arts [Melee], Martial Arts [Ranged], Medicine, Skulduggery, Survival',
    honor: 18, techniques: 'Kata, Shūji',
    startingTechniques: 'Kata: Razor Bite; Ninjutsu: Skulk',
    schoolAbility: 'Keen Senses: When you make a check to perceive or investigate, decrease the TN by your school rank (minimum 1).',
    outfit: 'Traveling clothes, nezumi armor (Physical 2), two weapons of rarity 6 or lower, memory stick, small tent, traveling pack',
    description: 'Dexterous nezumi scouts from the Tattered Ear tribe, expert hunters and scavengers of the Shinomen.',
    source: 'Writ of the Wilds',
  },
  {
    value: 'Tengu Mask of Air Tradition', clan: 'Dragonfly', type: 'Monk/Sage',
    rings: '+1 Air, +1 Void', skills: '4 from: Fitness, Martial Arts [Melee], Medicine, Meditation, Survival, Theology',
    honor: 55, techniques: 'Invocations, Kihō, Rituals',
    startingTechniques: 'Kata: Flight; Kihō (choose two): Air Fist, Cloak of Night, Yari of Air; Rituals: Chikushō-dō\'s Guile',
    schoolAbility: 'Mind of Calm: Once per scene make a TN 6 Meditation check to study someone else\'s technique (TN reduced by school rank, minimum 1). On success, replicate that technique until end of scene.',
    outfit: 'Traveling clothes, bō (staff), carving knife, bundle of medicinal herbs, traveling pack, journal of insights',
    description: 'Bird-like yōkai tengu who soar through the air and shroud themselves in realistic illusions.',
    source: 'Writ of the Wilds',
  },
  {
    value: 'Woolen Hooves Trapper Tradition', clan: 'Dragonfly', type: 'Artisan/Bushi',
    rings: '+1 Earth, +1 Fire', skills: '5 from: Command, Fitness, Labor, Martial Arts [Melee], Martial Arts [Ranged], Medicine, Survival',
    honor: 28, techniques: 'Kata, Rituals, Shūji',
    startingTechniques: 'Kata (choose two): Bear\'s Swipe Style, Hawk\'s Precision, Striking as Earth, Striking as Water; Rituals: Guard Against the Elements',
    schoolAbility: 'Evolution of the Wilds: When you employ an unconventional solution (GM discretion) reduce the TN by your school rank.',
    outfit: 'Traveling clothes, yobanjin armor (Physical 2, Subtle), horsebow, masakari, hammer, knife, bowyer\'s kit, medicine kit, resources for two hunting traps',
    description: 'Yobanjin mountain dwellers who breed woolly ponies and are expert trappers.',
    source: 'Writ of the Wilds',
  },
  // ── Children of the Five Winds — New Schools ──
  {
    value: 'Ganzu Guardian Tradition', clan: 'Unicorn', type: 'Bushi',
    rings: '+1 Earth, +1 Water', skills: '5 from: Command, Fitness, Labor, Martial Arts [Melee], Medicine, Sentiment, Tactics',
    honor: 45, techniques: 'Kata, Rituals, Shūji',
    startingTechniques: 'Kata: Slashing Sandstorm Style; Shūji (choose one): Honest Assessment, Shallow Waters',
    schoolAbility: 'Moment of Certainty: Once per scene after defending against damage, roll dice equal to fatigue received. Reserve up to school rank dice. Until end of scene, add one reserved die as a kept die when you Attack.',
    outfit: 'Traveling clothes, concealed armor, Ganzu ring ax, two knives, traveling rations (eight days)',
    description: 'Ganzu warriors from the Hidden Valley who guard an oasis on the Sand Road.',
    source: 'Children of the Five Winds',
  },
  {
    value: 'Ide Emissary School', clan: 'Unicorn', type: 'Courtier/Bushi',
    rings: '+1 Fire, +1 Water', skills: '5 from: Courtesy, Culture, Games, Government, Martial Arts [Unarmed], Sentiment, Survival',
    honor: 50, techniques: 'Kata, Rituals, Shūji',
    startingTechniques: 'Shūji: Glorious Entrance; Shūji (choose one): Stirring the Embers, Well of Desire',
    schoolAbility: 'Disarming Demeanor: On Support action checks, spend Opportunity to reduce a character\'s focus and vigilance by 1 until end of scene.',
    outfit: 'Ceremonial clothes, traveling clothes, wakizashi, knife, journal, calligraphy set, Ide traveling pony',
    description: 'Ide emissaries who retain relationships through trade, learning the customs of every court they visit.',
    source: 'Children of the Five Winds',
  },
  {
    value: 'Iuchi Horse Lord Disciple', clan: 'Unicorn', type: 'Shugenja/Artisan',
    rings: '+1 Air, +1 Water', skills: '3 from: Commerce, Design, Medicine, Sentiment, Survival, Theology',
    honor: 40, techniques: 'Invocations, Rituals, Shūji',
    startingTechniques: 'Invocations (choose one): Jurōjin\'s Balm, Nature\'s Touch, Path to Inner Peace; Rituals: Commune with the Spirits, Protection of the Flock; Shūji (choose one): Call to Ride, Shallow Waters',
    schoolAbility: 'The Horse Lord\'s Favor: When crafting or maintaining items, imprint them with an advantage or disadvantage. Sustain items up to school rank. Add bonus successes equal to school rank on Medicine checks for horses.',
    outfit: 'Sanctified robes, traveling clothes, yumi, quiver, wakizashi, two meishōdō talismans, traveling pack, Iuchi riding steed',
    description: 'Rokugan\'s foremost experts in equine medicine and meishōdō talismans for horses.',
    source: 'Children of the Five Winds',
  },
  {
    value: 'Kitsune Naturalist School', clan: 'Fox', type: 'Shugenja',
    rings: '+1 Air, +1 Earth', skills: '3 from: Courtesy, Fitness, Meditation, Sentiment, Survival, Theology',
    honor: 40, techniques: 'Invocations, Rituals, Shūji',
    startingTechniques: 'Invocations: Nature\'s Touch; Invocations (choose two): Extinguish, Jurōjin\'s Balm, Inari\'s Blessing; Rituals: Commune with the Spirits, Spiritual Survey',
    schoolAbility: 'Natural Balance: When you succeed on an invocation, if it is the first of that element this scene, add bonus dice set to Opportunity equal to school rank.',
    outfit: 'Sanctified robes, wakizashi, knife, scroll satchel, traveling pack, bottle of sake, sweets',
    description: 'Fox Clan shugenja attuned to nature spirits, invoking elements in equal measure.',
    source: 'Children of the Five Winds',
  },
  {
    value: 'Kitsune Mediator School', clan: 'Fox', type: 'Courtier/Sage',
    rings: '+1 Void, +1 Water', skills: '5 from: Command, Courtesy, Martial Arts [Ranged], Medicine, Meditation, Performance, Survival',
    honor: 40, techniques: 'Kata, Rituals, Shūji',
    startingTechniques: 'Rituals: Commune with the Spirits; Shūji (choose one): Appreciate the Scenery, Shallow Waters',
    schoolAbility: 'Calm Counsel: After a friendly character at range 0-4 receives strife, impose the Centered condition. Usable times per scene equal to school rank.',
    outfit: 'Sanctified robes, wakizashi, knife, yumi, quiver, calligraphy set, scroll satchel, traveling pack, bottle of sake, sweets',
    description: 'Fox mediators who negotiate between humans and spirits across Rokugan.',
    source: 'Children of the Five Winds',
  },
  {
    value: 'Sand Road Wayfinder Tradition', clan: 'Unicorn', type: 'Bushi/Shinobi',
    rings: '+1 Earth, +1 any other ring', skills: '5 from: Command, Commerce, Fitness, Labor, Martial Arts [Melee], Martial Arts [Ranged], Survival',
    honor: 35, techniques: 'Kata, Rituals, Shūji',
    startingTechniques: 'Kata (choose one): Striking as Air/Earth/Fire/Water; Rituals (choose one): Traveler\'s Experience, Wayfinder\'s Instincts',
    schoolAbility: 'Dunestrider: At scene start, choose a terrain quality (Dangerous, Entangling, Imbalanced, or Obscuring). Friendly characters within school rank range bands ignore its negative effects.',
    outfit: 'Traveling clothes, one weapon of rarity 7 or lower, two knives, traveling rations (eight days), traveling pack, tent (small)',
    description: 'Guides of the Sand Road who specialize in particular regions, using diverse survival techniques.',
    source: 'Children of the Five Winds',
  },
  {
    value: 'Scholar of al-Zawira Tradition', clan: 'Unicorn', type: 'Courtier',
    rings: '+1 Earth, +1 Fire', skills: '5 from: Courtesy, Culture, Government, Medicine, Sentiment, Survival, Theology',
    honor: 50, techniques: 'Kata, Rituals, Shūji',
    startingTechniques: 'Rituals: Shadow of Days; Shūji (choose one): Ancestry Unearthed, Cite the Facts, Stirring the Embers, Truth Burns through Lies',
    schoolAbility: 'Methodical Observation: Once per scene on a Scholar check, reserve dropped dice up to school rank. Until end of scene, add one reserved die as a kept die on non-Scholar checks.',
    outfit: 'Traveling clothes, ceremonial clothes, one weapon of rarity 6 or lower, knife, calligraphy set, traveling pack, numerous books',
    description: 'Scholars from the Qamarist Caliphate\'s City of Books, pushing the bounds of knowledge.',
    source: 'Children of the Five Winds',
  },
  {
    value: 'Shinjo Mounted Archer', clan: 'Unicorn', type: 'Bushi/Artisan',
    rings: '+1 Air, +1 Fire', skills: '5 from: Culture, Fitness, Martial Arts [Ranged], Meditation, Performance, Smithing, Tactics',
    honor: 40, techniques: 'Kata, Rituals, Shūji',
    startingTechniques: 'Kata: Pelting Hail Style; Kata (choose one): Hawk\'s Precision, Striking as Fire',
    schoolAbility: 'Unity of Horse and Rider: When spending Void during a bow check, negate Opportunity symbols up to school rank. Gain bonus successes equal to negated symbols. While riding, Martial Arts [Ranged] and Performance have unskilled assistance.',
    outfit: 'Lacquered armor, ceremonial clothes, daishō, Shinjo horsebow, quiver with special arrows, knife, traveling pack, bowyer\'s kit, Shinjo courser or Unicorn warhorse',
    description: 'Shinjo horse archers mastering the unity of horse and rider through ritualized archery.',
    source: 'Children of the Five Winds',
  },
  {
    value: 'Utaku Silent Shadow Yōjimbō', clan: 'Unicorn', type: 'Bushi/Courtier',
    rings: '+1 Air, +1 Earth', skills: '5 from: Courtesy, Martial Arts [Melee], Martial Arts [Ranged], Meditation, Sentiment, Survival, Tactics',
    honor: 45, techniques: 'Kata, Rituals, Shūji',
    startingTechniques: 'Kata: Crescent Moon Style; Kata (choose one): Cautious Tread, Warrior\'s Resolve',
    schoolAbility: 'Warden of the Five Winds: Gain bonus success on Guard action if you or target is mounted. On Guard success, spend Opportunity to give target at range 0-3 the Emboldened condition (max Opportunity = school rank).',
    outfit: 'Lacquered armor, traveling clothes, daishō, yari, daikyū, quiver, knife, traveling pack, Unicorn warhorse or Shinjo courser',
    description: 'Young school marrying Utaku and Shinjo traditions to protect Unicorn diplomats anywhere.',
    source: 'Children of the Five Winds',
  },
  {
    value: 'Ujik Nomad Tradition', clan: 'Unicorn', type: 'Bushi',
    rings: '+1 Earth, +1 Water', skills: '5 from: Fitness, Martial Arts [Ranged], Martial Arts [Unarmed], Medicine, Performance, Survival, Tactics',
    honor: 40, techniques: 'Kata, Rituals, Shūji',
    startingTechniques: 'Shūji: Call to Ride; Rituals (choose one): Protection of the Flock, Wayfinder\'s Instincts',
    schoolAbility: 'Move as the Wind: On Movement or travel checks, suffer up to 2 fatigue to add that many bonus successes. After removing fatigue at end of scene, remove additional fatigue up to school rank.',
    outfit: 'Traveling clothes, scimitar or yari, Shinjo horsebow, quiver, knife, tent (yurt), travel rations (eight days), Unicorn warhorse',
    description: 'Ujik nomadic herders from the Plains of Wind and Stone, the finest riders on the continent.',
    source: 'Children of the Five Winds',
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
  // Courts of Stone — New Distinctions
  { value: 'Affect of Harmlessness', type: 'Distinction', ring: 'Air', description: 'You appear earnest and hapless; people underestimate you to your benefit.', source: 'Courts of Stone' },
  { value: 'Famously Neutral', type: 'Distinction', ring: 'Earth', description: 'You are trusted to be unbiased and consulted for fair perspective.', source: 'Courts of Stone' },
  { value: 'Well Connected in [City]', type: 'Distinction', ring: 'Water', description: 'You know people at all levels of society in a particular city.', source: 'Courts of Stone' },
  // Courts of Stone — New Passions
  { value: 'Decorum', type: 'Passion', ring: 'Water', description: 'Polite society is your natural habitat; courtly etiquette is second nature.', source: 'Courts of Stone' },
  { value: 'Local Flare for [Region]', type: 'Passion', ring: 'Earth', description: 'Your knowledge extends beyond the court to scenic locales in a specific region.', source: 'Courts of Stone' },
  { value: 'Pot Stirrer', type: 'Passion', ring: 'Fire', description: 'You can read a room and identify grudges, tension, and exploitable social pressure.', source: 'Courts of Stone' },
  // Mantis DLC — New Distinctions
  { value: 'Blood of Osano-wo', type: 'Distinction', ring: 'Fire', description: 'The Fortune of Storms grants you boldness; you cannot be killed by storms.', source: 'Mantis DLC' },
  { value: 'Sea Legs', type: 'Distinction', ring: 'Water', description: 'You never get seasick and maintain balance on rocking ships.', source: 'Mantis DLC' },
  // Mantis DLC — New Passions
  { value: 'Knotwork', type: 'Passion', ring: 'Air', description: 'You can identify and tie dozens of different consecrated knots.', source: 'Mantis DLC' },
  // Children of the Five Winds — New Distinctions
  { value: 'Affinity with [Animal Type]', type: 'Distinction', ring: 'Void', description: 'Animals of a specific type give you extra consideration, sparing or helping you.', source: 'Children of the Five Winds' },
  { value: 'Legal Scholarship', type: 'Distinction', ring: 'Air', description: 'Your family possesses old legal documents from multiple cultures and legal traditions.', source: 'Children of the Five Winds' },
  { value: 'Syncretic Philosophy', type: 'Distinction', ring: 'Water', description: 'Exposure to many cultures lets you understand the nuances of others\' moral stances.', source: 'Children of the Five Winds' },
  // Children of the Five Winds — New Passions
  { value: 'Horse Racing', type: 'Passion', ring: 'Air', description: 'You enjoy the bond of horse and rider in competition, understanding racing requires skill, perception, and endurance.', source: 'Children of the Five Winds' },
  { value: 'Hot Pot', type: 'Passion', ring: 'Earth', description: 'You know how to prepare hearty communal hot pot meals, recalling strong memories of sharing food.', source: 'Children of the Five Winds' },
  { value: 'Stargazing', type: 'Passion', ring: 'Void', description: 'You use the stars to navigate and tell time; you know many astrological myths.', source: 'Children of the Five Winds' },
  // Writ of the Wilds — New Distinctions
  { value: 'Knowledgeable Wilderness Guide', type: 'Distinction', ring: 'Void', description: 'You are comfortable in a particular wilderness type (Mountain, Forest, Plains, or Coastal).', source: 'Writ of the Wilds' },
  { value: 'Skilled Midwife', type: 'Distinction', ring: 'Fire', description: 'You are exceptionally skilled in pregnancy, childbirth, and common childhood illnesses.', source: 'Writ of the Wilds' },
  { value: 'Thoughtful Arbiter', type: 'Distinction', ring: 'Water', description: 'Others willingly tell you their grievances; you excel at mediating disputes fairly.', source: 'Writ of the Wilds' },
  // Writ of the Wilds — New Passions
  { value: 'Charity', type: 'Passion', ring: 'Water', description: 'Your charitable nature makes others more likely to accept your reasonable requests for aid.', source: 'Writ of the Wilds' },
  { value: 'Kintsugi', type: 'Passion', ring: 'Earth', description: 'You have a fondness for kintsugi, the art of mending broken pottery with gold.', source: 'Writ of the Wilds' },
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
  // Courts of Stone — New Adversities
  { value: 'Overconfidence in [Feature]', type: 'Adversity', ring: 'Various', description: 'You overestimate yourself in a chosen capacity and may be blissfully blind to failure.', source: 'Courts of Stone' },
  { value: 'Lackluster', type: 'Adversity', ring: 'Fire', description: 'You cannot distinguish yourself at court; your talents are hardly noticed.', source: 'Courts of Stone' },
  // Courts of Stone — New Anxieties
  { value: 'Unsavory Past', type: 'Anxiety', ring: 'Water', description: 'Gossip and embarrassing stories of your past haunt you.', source: 'Courts of Stone' },
  // Mantis DLC — New Adversities
  { value: 'Sailor\'s Tongue', type: 'Adversity', ring: 'Air', description: 'Your speech is punctuated by combative idioms others find vulgar.', source: 'Mantis DLC' },
  // Children of the Five Winds — New Adversities
  { value: 'Lost Family History', type: 'Adversity', ring: 'Earth', description: 'Your family lost important historical records; recalling lost history is difficult and painful.', source: 'Children of the Five Winds' },
  { value: 'Penalty', type: 'Adversity', ring: 'Fire', description: 'You or your family have been charged with a minor offense and must pay an ongoing penalty.', source: 'Children of the Five Winds' },
  { value: 'Schism in Status', type: 'Adversity', ring: 'Water', description: 'A specific social group treats you as if your status were 20 points lower.', source: 'Children of the Five Winds' },
  // Children of the Five Winds — New Anxieties
  { value: 'Animal Signs', type: 'Anxiety', ring: 'Void', description: 'You assign supernatural meaning to animal behavior and have broad knowledge of animal superstitions.', source: 'Children of the Five Winds' },
  { value: 'Disdain for Urban Sprawl', type: 'Anxiety', ring: 'Earth', description: 'Dense urban areas bring you no joy due to the crowds, pace of life, or lack of nature.', source: 'Children of the Five Winds' },
  { value: 'Tip of the Tongue', type: 'Anxiety', ring: 'Air', description: 'You know multiple languages so fluently that your mind mixes words, causing social frustration.', source: 'Children of the Five Winds' },
  // Writ of the Wilds — New Adversities
  { value: 'Insomniac', type: 'Adversity', ring: 'Void', description: 'You have difficulty falling and staying asleep, recovering only half the normal rest benefits.', source: 'Writ of the Wilds' },
  { value: 'Out of Shape', type: 'Adversity', ring: 'Earth', description: 'You have neglected your physical fitness and become noticeably winded during exertion.', source: 'Writ of the Wilds' },
  { value: 'Stalked by [Creature]', type: 'Adversity', ring: 'Earth', description: 'You believe a creature is stalking you, making your obsession with hunting dangerous.', source: 'Writ of the Wilds' },
  // Writ of the Wilds — New Anxieties
  { value: 'Fear of [Common Creature]', type: 'Anxiety', ring: 'Earth', description: 'You have an irrational fear of a commonly found creature; its presence unnerves you.', source: 'Writ of the Wilds' },
  { value: 'Fear of Mediocrity', type: 'Anxiety', ring: 'Fire', description: 'Your fear of amounting to nothing causes you to innovate on the fly when faced with the unexpected.', source: 'Writ of the Wilds' },
  { value: 'Fear of Poison', type: 'Anxiety', ring: 'Air', description: 'You fear being poisoned and refuse food or drink from those you do not completely trust.', source: 'Writ of the Wilds' },
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
  // Courts of Stone — New Kata
  { value: 'Pole-Vault', type: 'Kata', ring: 'Air/Water', rank: 3, description: 'Launch yourself into the air with a polearm to strike a distant target.', source: 'Courts of Stone' },
  { value: 'Trip the Leg', type: 'Kata', ring: 'Earth', rank: 1, description: 'Sweep low with a polearm to knock your opponent prone.', source: 'Courts of Stone' },
  { value: 'Pelting Hail Style', type: 'Kata', ring: 'Air', rank: 1, description: 'Rapid ranged strikes that pepper targets with projectiles.', source: 'Courts of Stone' },
  // Courts of Stone — New Ninjutsu
  { value: 'Artful Alibi', type: 'Ninjutsu', ring: 'Air/Water', rank: 3, description: 'When performing clandestine activities, you also count as having done a legitimate downtime action.', source: 'Courts of Stone' },
  { value: 'Deceitful Strike', type: 'Ninjutsu', ring: 'Fire', rank: 1, description: 'Make your attack look like an accident; observers may not realize it was intentional.', source: 'Courts of Stone' },
  { value: 'Like a Ghost', type: 'Ninjutsu', ring: 'Air/Water', rank: 2, description: 'Move quickly and quietly while scaling walls and leaping between buildings.', source: 'Courts of Stone' },
  { value: 'Silent Elimination', type: 'Ninjutsu', ring: 'Earth', rank: 3, description: 'Use a hold or snaring weapon to choke a target into unconsciousness.', source: 'Courts of Stone' },
  { value: 'Slicing Wind Kick', type: 'Ninjutsu', ring: 'Air', rank: 3, description: 'An acrobatic kick attack that disorients the target.', source: 'Courts of Stone' },
  { value: 'Stillness of Death', type: 'Ninjutsu', ring: 'Air', rank: 5, description: 'Increase the TN to resist a critical strike you inflict via ninjutsu techniques.', source: 'Courts of Stone' },
  { value: 'To Float or Sink', type: 'Ninjutsu', ring: 'Water/Earth', rank: 2, description: 'When prone or disoriented, remove the condition as a free action.', source: 'Courts of Stone' },
  { value: 'What\'s Yours Is Mine', type: 'Ninjutsu', ring: 'Fire', rank: 2, description: 'Strike swiftly to steal items from a dazed opponent.', source: 'Courts of Stone' },
  // Courts of Stone — New Rituals
  { value: 'Formal Tea Ceremony', type: 'Ritual', ring: 'Void', rank: 5, description: 'Perform the chaji to remove strife and potentially grant Void points to participants.', source: 'Courts of Stone' },
  { value: 'Treaty Signing', type: 'Ritual', ring: 'Fire/Air', rank: 2, description: 'Formalize a treaty that all parties stake honor on upholding.', source: 'Courts of Stone' },
  { value: 'The Ties that Bind', type: 'Ritual', ring: 'Void', rank: 4, description: 'Learn of a fortuitous match for your target through threads of fate.', source: 'Courts of Stone' },
  // Courts of Stone — New Air Shūji
  { value: 'Assess Strengths', type: 'Shūji', ring: 'Air', rank: 1, description: 'Deduce a target\'s skills in Games, Tactics, or Martial Arts during a game.', source: 'Courts of Stone' },
  { value: 'Hidden in Smoke', type: 'Shūji', ring: 'Air', rank: 4, description: 'Hide your true goal or objective from an opponent in social settings.', source: 'Courts of Stone' },
  // Courts of Stone — New Earth Shūji
  { value: 'Unyielding Terms', type: 'Shūji', ring: 'Earth', rank: 2, description: 'Use knowledge of tradition to dictate the method of battle or stakes of a duel.', source: 'Courts of Stone' },
  // Courts of Stone — New Fire Shūji
  { value: 'All Shall Fear Me', type: 'Shūji', ring: 'Fire', rank: 3, description: 'Dominate a gathering through force of personality, causing strife to those who target you socially.', source: 'Courts of Stone' },
  { value: 'Crackling Laughter', type: 'Shūji', ring: 'Fire', rank: 3, description: 'Humiliate a target through comedy, potentially compromising them.', source: 'Courts of Stone' },
  { value: 'Offend the Sensibilities', type: 'Shūji', ring: 'Fire', rank: 2, description: 'Craft an item that offends a specific individual when they see it.', source: 'Courts of Stone' },
  { value: 'Spiteful Loss', type: 'Shūji', ring: 'Fire', rank: 1, description: 'Be a bad sport in a game, inflicting strife on all participants.', source: 'Courts of Stone' },
  // Courts of Stone — New Water Shūji
  { value: 'Beware The Smallest Mouse', type: 'Shūji', ring: 'Water', rank: 1, description: 'Play up your unimportance so targets lower their guard against you.', source: 'Courts of Stone' },
  // Mantis DLC — New Shūji
  { value: 'Osano-wo\'s Boast', type: 'Shūji', ring: 'Fire', rank: 3, description: 'Boast of a deed you will accomplish; if you succeed, increase composure and endurance by 3.', source: 'Mantis DLC' },
  // ── Children of the Five Winds — New Kata ──
  { value: 'Cautious Tread', type: 'Kata', ring: 'Earth', rank: 1, description: 'While riding, spend Opportunity to ignore a terrain quality\'s effects until your next turn.', source: 'Children of the Five Winds' },
  { value: 'Stalking Leopard Style', type: 'Kata', ring: 'Earth', rank: 2, description: 'Against Disoriented/Prone targets, increase weapon damage and deadliness by Survival ranks.', source: 'Children of the Five Winds' },
  { value: 'Distracting Flurry Style', type: 'Kata', ring: 'Fire', rank: 2, description: 'In difficult terrain, on a failed attack, your target suffers the Disoriented condition.', source: 'Children of the Five Winds' },
  { value: 'Slashing Sandstorm Style', type: 'Kata', ring: 'Fire', rank: 2, description: 'When attacking with an ax, spend Opportunity to deal extra damage equal to deadliness against minions.', source: 'Children of the Five Winds' },
  { value: 'Scouring Wind Style', type: 'Kata', ring: 'Earth', rank: 3, description: 'Wielding a non-Razor-Edged weapon in two hands, spend Opportunity to damage a defensive item.', source: 'Children of the Five Winds' },
  { value: 'Swaying Grass Evasion', type: 'Kata', ring: 'Water', rank: 3, description: 'In difficult terrain, receive fatigue up to Survival ranks to increase Ranged TN against you.', source: 'Children of the Five Winds' },
  { value: 'Sudden Downpour Style', type: 'Kata', ring: 'Water', rank: 3, description: 'While mounted with bow or polearm, spend Opportunity to increase TN of critical strike resistance.', source: 'Children of the Five Winds' },
  { value: 'Descending Swarm Shot', type: 'Kata', ring: 'Air', rank: 3, description: 'With a readied bow, make an attack; allies gain bonus successes against the affected target.', source: 'Children of the Five Winds' },
  { value: 'Thunderbolt Style', type: 'Kata', ring: 'Fire', rank: 4, description: 'When throwing a weapon, spend Opportunity to hit another character at range 0-1 for weapon base damage.', source: 'Children of the Five Winds' },
  // ── Children of the Five Winds — New Rituals ──
  { value: 'Center the World', type: 'Ritual', ring: 'Air', rank: 3, description: 'Find a path to civilization through any terrain using Survival (Air).', source: 'Children of the Five Winds' },
  { value: 'Cultural Exchange', type: 'Ritual', ring: 'Fire', rank: 1, description: 'Establish cultural fundamentals with someone from an unfamiliar culture.', source: 'Children of the Five Winds' },
  { value: 'Protection of the Flock', type: 'Ritual', ring: 'Fire', rank: 2, description: 'Fortify animals against disease and hardship using Survival (Fire).', source: 'Children of the Five Winds' },
  { value: 'Shadow of Days', type: 'Ritual', ring: 'Earth', rank: 3, description: 'Calculate distance between two locations using Culture (Earth).', source: 'Children of the Five Winds' },
  { value: 'Spiritual Survey', type: 'Ritual', ring: 'Void', rank: 2, description: 'Learn about local spirits and supernatural entities using Survival (Void).', source: 'Children of the Five Winds' },
  { value: 'Traveler\'s Experience', type: 'Ritual', ring: 'Earth', rank: 2, description: 'Quickly learn the customs and laws of a new place using Culture (Earth).', source: 'Children of the Five Winds' },
  { value: 'Wayfinder\'s Instincts', type: 'Ritual', ring: 'Water', rank: 2, description: 'Find water, food, or shelter in the wilderness using Survival (Water).', source: 'Children of the Five Winds' },
  // ── Children of the Five Winds — New Shūji ──
  { value: 'Appreciate the Scenery', type: 'Shūji', ring: 'Void', rank: 1, description: 'Support action in difficult terrain: spend Opportunity for effects based on ring chosen.', source: 'Children of the Five Winds' },
  { value: 'Call to Ride', type: 'Shūji', ring: 'Water', rank: 1, description: 'Support action: call your loyal steed to come to you on command.', source: 'Children of the Five Winds' },
  { value: 'Cite the Facts', type: 'Shūji', ring: 'Earth', rank: 2, description: 'Scheme action: silence a target with hard facts using a Scholar skill.', source: 'Children of the Five Winds' },
  { value: 'Glorious Entrance', type: 'Shūji', ring: 'Fire', rank: 2, description: 'When entering a scene, make a Performance (Fire) check to reduce Scheme/Support TNs.', source: 'Children of the Five Winds' },
  { value: 'Solidify Gratitude', type: 'Shūji', ring: 'Earth', rank: 2, description: 'Scheme action: gain the Ally advantage with a character who accepted your gift.', source: 'Children of the Five Winds' },
  { value: 'Trader\'s Intuition', type: 'Shūji', ring: 'Air', rank: 2, description: 'Scheme action: assess an object\'s monetary value and rarity.', source: 'Children of the Five Winds' },
  { value: 'Cunning Omission', type: 'Shūji', ring: 'Air', rank: 3, description: 'Scheme action: draw a target into admitting something they are concealing.', source: 'Children of the Five Winds' },
  { value: 'Entice with Offerings', type: 'Shūji', ring: 'Air', rank: 3, description: 'Scheme action: give up something valued to distract a target for multiple rounds.', source: 'Children of the Five Winds' },
  { value: 'Complementary Experience', type: 'Shūji', ring: 'Water', rank: 3, description: 'Support action: grant mutual assistance with another character.', source: 'Children of the Five Winds' },
  { value: 'Horse Whisperer', type: 'Shūji', ring: 'Water', rank: 3, description: 'Wordlessly request a horse to fulfill a task using Courtesy or Survival.', source: 'Children of the Five Winds' },
  { value: 'Incite Wrath', type: 'Shūji', ring: 'Water', rank: 3, description: 'While mounted, spend Opportunity for your mount to Strike a character at range 0-1.', source: 'Children of the Five Winds' },
  { value: 'Everyone Has a Price', type: 'Shūji', ring: 'Water', rank: 4, description: 'Offer a bribe to make a target accept it and leave or stop opposing you.', source: 'Children of the Five Winds' },
  // ── Children of the Five Winds — New Invocation ──
  { value: 'The World is Not Heavy', type: 'Invocation', ring: 'Water', rank: 2, description: 'Augment a creature\'s body with water kami buoyancy, increasing carrying capacity.', source: 'Children of the Five Winds' },
  // ── Writ of the Wilds — New Kihō ──
  { value: 'Mercy of the Stone Fortune', type: 'Kihō', ring: 'Earth', rank: 2, description: 'Receive fatigue to reduce damage to a nearby ally; spend Void to take their critical strike.', source: 'Writ of the Wilds' },
  { value: 'Rejuvenating Breath', type: 'Kihō', ring: 'Earth', rank: 3, description: 'Increase endurance by Earth ring; burst may remove Heavily Wounded condition.', source: 'Writ of the Wilds' },
  { value: 'Shadow of Ancient Peaks', type: 'Kihō', ring: 'Earth', rank: 4, description: 'After resisting an effect, the source receives strife equal to your bonus successes.', source: 'Writ of the Wilds' },
  { value: 'Cutting Wind Talons', type: 'Kihō', ring: 'Air', rank: 2, description: 'Enhance unarmed strikes to gain Razor-Sharp quality.', source: 'Writ of the Wilds' },
  { value: 'Grace of the Gentle Breeze', type: 'Kihō', ring: 'Air', rank: 3, description: 'Make your presence undetectable; characters treat vigilance as 2 lower against you.', source: 'Writ of the Wilds' },
  { value: 'Step of the Storm', type: 'Kihō', ring: 'Air', rank: 4, description: 'Leap away from harm; while active, gain fatigue to negate Opportunity from attacker checks.', source: 'Writ of the Wilds' },
  { value: 'Blistering Retribution', type: 'Kihō', ring: 'Fire', rank: 2, description: 'After defending against damage, decrease TN of your next Attack/Scheme against that attacker.', source: 'Writ of the Wilds' },
  { value: 'Dance of Fire', type: 'Kihō', ring: 'Fire', rank: 3, description: 'Empower body with fire; on failed checks, roll extra dice and keep them (risking Exhaustion).', source: 'Writ of the Wilds' },
  { value: 'Volcanic Fist', type: 'Kihō', ring: 'Fire', rank: 4, description: 'Empower unstoppable force; increase critical strike TN of unarmed attacks by Fire ring plus Fitness.', source: 'Writ of the Wilds' },
  { value: 'Fist of Spreading Venom', type: 'Kihō', ring: 'Water', rank: 2, description: 'Imbue unarmed strikes with a consumed poison\'s effects.', source: 'Writ of the Wilds' },
  { value: 'River\'s Flowing Stride', type: 'Kihō', ring: 'Water', rank: 3, description: 'Make your body fluid to move through dangerous or narrow terrain safely.', source: 'Writ of the Wilds' },
  { value: 'Seeping Ki', type: 'Kihō', ring: 'Water', rank: 4, description: 'Imbue touch with ki to manipulate another\'s body, forcing them to unmask.', source: 'Writ of the Wilds' },
  { value: 'Aura Awareness', type: 'Kihō', ring: 'Void', rank: 2, description: 'Perceive beings and spirits normally invisible to human sight.', source: 'Writ of the Wilds' },
  { value: 'Essence of Stillness', type: 'Kihō', ring: 'Void', rank: 3, description: 'Ignore Bleeding, Wounded, and Unconscious conditions while active.', source: 'Writ of the Wilds' },
  { value: 'Eternal Mind\'s Gate', type: 'Kihō', ring: 'Void', rank: 4, description: 'Recall traces of past lives; burst allows swapping two skill values.', source: 'Writ of the Wilds' },
  // ── Writ of the Wilds — New Kata ──
  { value: 'Bear\'s Swipe Style', type: 'Kata', ring: 'Earth', rank: 1, description: 'Spend Opportunity to inflict conditions that cannot be removed until your next turn.', source: 'Writ of the Wilds' },
  { value: 'Serpent\'s Twist Style', type: 'Kata', ring: 'Water', rank: 2, description: 'Twist with a blow to exhaust the opponent over a protracted battle.', source: 'Writ of the Wilds' },
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
  // ── Children of the Five Winds — New Weapons ──
  { name: 'Ganzu Ring Ax', category: 'Axe', grip: 'Two-handed', range: '1-2', damage: 4, deadliness: 7, qualities: 'Cumbersome, Hewing, Wargear', description: 'A large disk-bladed battle-ax used by Ganzu warriors of the Sand Road.', source: 'Children of the Five Winds' },
  { name: 'Katar', category: 'Hand Weapon', grip: 'One-handed', range: '0-1', damage: 3, deadliness: 5, qualities: 'Hewing, Razor-Edged', description: 'A triangular punch dagger wielded in an H-shaped grip, standard among the Ganzu.', source: 'Children of the Five Winds' },
  { name: 'Ide Parasol Shield', category: 'Shield', grip: 'Two-handed', range: '0', damage: 2, deadliness: 3, qualities: 'Concealed, Cumbersome', description: 'A folding rattan-cloth parasol hiding thin metal plates for protection.', source: 'Children of the Five Winds' },
  { name: 'Standing Shield', category: 'Shield', grip: 'Two-handed', range: '0', damage: 2, deadliness: 2, qualities: 'Cumbersome, Durable', description: 'A heavy rectangular braced shield providing near-complete protection for bearer and warrior behind.', source: 'Children of the Five Winds' },
  { name: 'Charging Lance', category: 'Polearm', grip: 'Two-handed', range: '1-2', damage: 4, deadliness: 3, qualities: 'Cumbersome, Wargear', description: 'A specialized cavalry spear; after a Move action on horseback: Damage +3, Deadliness 7, gains Hewing.', source: 'Children of the Five Winds' },
  { name: 'Saddle Cutter', category: 'Polearm', grip: 'One-handed', range: '0-1', damage: 4, deadliness: 6, qualities: 'Cumbersome, Wargear', description: 'A flexible serrated blade designed to cut stirrups and sever rider from steed.', source: 'Children of the Five Winds' },
  { name: 'Repeating Crossbow', category: 'Crossbow', grip: 'Two-handed', range: '2-4', damage: 5, deadliness: 3, qualities: 'Cumbersome', description: 'A crossbow with a wooden quarrel stock that reloads after every draw (max 4 bolts).', source: 'Children of the Five Winds' },
  { name: 'Catalpa Bow', category: 'Bow', grip: 'Two-handed', range: '2-5', damage: 5, deadliness: 3, qualities: 'Ceremonial, Sacred', description: 'A yumi made from catalpa wood that banishes ghosts and repels malicious spirits.', source: 'Children of the Five Winds' },
  { name: 'Fire Lance', category: 'Specialist', grip: 'Two-handed', range: '2', damage: 4, deadliness: 3, qualities: 'Cumbersome, Prepare, Wargear', description: 'A polearm with a firework attachment; as ranged: Range 3-5, Damage +3, Deadliness 9.', source: 'Children of the Five Winds' },
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
  // ── Children of the Five Winds — New Armor ──
  { name: 'Mirror Armor', resistance: '3 Physical, 1 Supernatural', qualities: 'Wargear', description: 'Riding armor with polished metal discs that deflect arrows and blind malicious spirits.', source: 'Children of the Five Winds' },
  { name: 'Unicorn Barding', resistance: '2 Physical', qualities: 'Ceremonial, Resplendent, Wargear', description: 'Laminated plate armor for horses with unique face coverings, custom-fitted for comfort.', source: 'Children of the Five Winds' },
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
