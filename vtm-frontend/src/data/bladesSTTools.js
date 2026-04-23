// Entanglement table (roll 1d6, modified by heat)
export const ENTANGLEMENTS = {
  lowHeat: [ // Heat 0-3
    { roll: '1-3', name: 'Gang Trouble', description: 'One of your cohorts causes trouble. Lose 1 cohort quality or deal with the fallout.' },
    { roll: '4-5', name: 'Rivals', description: 'A rival crew or faction moves against you. They take -1 faction status with you or make a move on your turf.' },
    { roll: '6', name: 'Cooperation', description: 'A +3 faction asks you for a favor. If you decline, lose 1 status with them.' },
  ],
  highHeat: [ // Heat 4+
    { roll: '1-3', name: 'Arrest', description: 'Bluecoats attempt to arrest someone. Pay them off (2 coin per Heat), submit to arrest, or resist.' },
    { roll: '4-5', name: 'Flipped', description: 'One of your contacts, allies, or cohorts is flipped by the Bluecoats. They feed info to the law.' },
    { roll: '6', name: 'Show of Force', description: 'A faction with whom you have negative status makes a pointed show of force. If ignored, they escalate.' },
  ],
  wanted: [ // Additional entanglements when Wanted level is high
    { roll: '1-3', name: 'Demonic Notice', description: 'A demon or dark power takes notice of you. It may offer a bargain or simply watch.' },
    { roll: '4-5', name: 'Unquiet Dead', description: 'A ghost related to a past score haunts one of your members. Deal with it or suffer.' },
    { roll: '6', name: 'Interrogation', description: 'The Bluecoats grab someone close to you for questioning. They may break under pressure.' },
  ],
}

// Score generation tables
export const SCORE_TABLES = {
  clients: [
    'A desperate noble', 'A vengeful shopkeeper', 'A shady fence', 'A corrupt Bluecoat',
    'A mysterious stranger', 'A rival gang member (defector)', 'A spirit or ghost',
    'A Leviathan Hunter captain', 'A Sparkwright engineer', 'An Iruvian diplomat',
    'A Skovlander refugee leader', 'A Dagger Isles pirate', 'A gondolier with secrets',
    'A Church official with doubts', 'A former lover of a crew member',
    'A wealthy merchant in trouble', 'A street urchin who overheard something',
    'An Imperial tax collector', 'A disgraced professor', 'A ghost who cannot rest',
  ],
  targets: [
    'A rival gang\'s stash house', 'A noble\'s estate', 'A Bluecoat evidence lockup',
    'A merchant ship in port', 'A Spirit Warden\'s sanctum', 'A Leviathan blood refinery',
    'An Iruvian embassy', 'A gambling den', 'A Sparkwright laboratory',
    'A derelict building hiding something', 'A noble\'s private coach',
    'A canal boat carrying contraband', 'A theater during a performance',
    'A buried vault beneath the city', 'A train heading to Whitecrown',
    'A prison transport wagon', 'A church reliquary', 'An abandoned factory',
    'The basement of a popular tavern', 'A rooftop garden of a tower block',
  ],
  workTypes: [
    'Assassination', 'Burglary', 'Sabotage', 'Smuggling run', 'Extortion',
    'Protection racket', 'Kidnapping', 'Heist', 'Espionage', 'Arson',
    'Blackmail', 'Bodyguard duty', 'Courier job', 'Rescue operation',
    'Frame job', 'Forgery commission', 'Ghost removal', 'Turf war skirmish',
    'Information theft', 'Artifact acquisition',
  ],
  complications: [
    'A rival crew is after the same target', 'The target is a Spirit Warden trap',
    'An informant has already sold you out', 'The weather turns supernatural',
    'A ghost interferes at the worst moment', 'The Bluecoats are already watching',
    'The target has moved — you need to improvise', 'An unexpected ally complicates things',
    'Someone in the crew has a personal connection to the target',
    'The job is part of a larger conspiracy', 'Electroplasmic barriers activate',
    'A demon has already claimed the prize', 'The client is lying about the real job',
    'A crowd of civilians is present', 'The target fights back harder than expected',
    'An old debt comes due mid-score', 'The escape route is compromised',
    'A fire breaks out', 'The mark has a body double', 'Time limit — it must be done tonight',
  ],
  twists: [
    'The target is already dead', 'The real target is somewhere else entirely',
    'Your client is actually your enemy', 'The item is cursed or haunted',
    'A crew member\'s dark secret is exposed', 'The Bluecoats arrive in force',
    'An explosion rocks the neighborhood', 'The target offers a better deal',
    'A supernatural entity manifests', 'Someone important witnesses the crime',
  ],
}

// NPC generator tables
export const NPC_TABLES = {
  firstNames: [
    'Adric', 'Bazran', 'Casta', 'Darmot', 'Edlun', 'Fitz', 'Grine', 'Hix',
    'Irimina', 'Jeren', 'Karstas', 'Lydra', 'Morlan', 'Nyrix', 'Odrienne',
    'Phin', 'Quellyn', 'Riven', 'Sethla', 'Theron', 'Uma', 'Veleris',
    'Wicker', 'Xara', 'Yuri', 'Zamira', 'Aria', 'Brogan', 'Corille',
    'Drav', 'Eckerd', 'Florentia', 'Gavriel', 'Helene', 'Isha', 'Jol',
  ],
  lastNames: [
    'Ankhayat', 'Bowmore', 'Clelland', 'Danfield', 'Strangford', 'Hellyers',
    'Keel', 'Lomond', 'Michter', 'Nyryx', 'Penderyn', 'Rowan', 'Slane',
    'Templeton', 'Vale', 'Widdershins', 'Dalmore', 'Strathmill', 'Torren',
    'Sevoy', 'Dunvil', 'Kinclaith', 'Maroden', 'Basran', 'Klev', 'Tyrconnell',
  ],
  traits: [
    'Shrewd', 'Aggressive', 'Charming', 'Paranoid', 'Reckless', 'Patient',
    'Cruel', 'Generous', 'Quiet', 'Boisterous', 'Meticulous', 'Lazy',
    'Ambitious', 'Haunted', 'Devout', 'Cynical', 'Loyal', 'Treacherous',
    'Fearful', 'Bold', 'Bitter', 'Jovial', 'Obsessive', 'Melancholy',
  ],
  professions: [
    'Dock worker', 'Tavern owner', 'Bluecoat sergeant', 'Gondolier', 'Fence',
    'Alchemist', 'Streetwise urchin', 'Noble heir', 'Merchant', 'Smuggler',
    'Sparkwright', 'Physicker', 'Whisper', 'Locksmith', 'Ink Rake journalist',
    'Leviathan Hunter', 'Factory foreman', 'Church acolyte', 'Gambler',
    'Spirit trafficker', 'Pit fighter', 'Courtesan', 'Beggar king', 'Spy',
  ],
  quirks: [
    'Missing two fingers', 'Speaks in whispers', 'Always eating something',
    'Constantly checking over their shoulder', 'Has a pet raven',
    'Wears a mask at all times', 'Covered in ritual scars', 'Never makes eye contact',
    'Laughs at inappropriate moments', 'Carries a leatherbound journal',
    'Smells of electroplasm', 'Has one glass eye', 'Limps from an old wound',
    'Speaks with a Skovlander accent', 'Tattooed from neck to wrist',
    'Hums tunelessly when nervous', 'Always has chalk-dust on their hands',
    'Wears an outdated military uniform', 'Has a nervous tic',
    'Collects something unusual (teeth, buttons, etc.)',
  ],
}

// Downtime events
export const DOWNTIME_EVENTS = [
  'A fire breaks out in your territory. Lose 1 turf claim or deal with the fallout.',
  'A new gang moves into the district. They want to talk... or fight.',
  'A powerful ghost manifests near your lair. It seems confused but dangerous.',
  'A Bluecoat informant approaches one of your contacts.',
  'A Leviathan Hunter ship returns to port carrying something unusual.',
  'One of your cohorts gets into a bar fight that escalates badly.',
  'A mysterious package is delivered to your lair. Nobody knows who sent it.',
  'An old enemy resurfaces with a grudge and a new crew.',
  'The Spirit Wardens conduct a sweep of your neighborhood.',
  'A noble patron offers a lucrative but morally questionable opportunity.',
  'A strange fog rolls in from the river. People who enter it don\'t come back the same.',
  'One of your fences is arrested. Your stolen goods are in their warehouse.',
  'A street prophet begins preaching against your crew by name.',
  'An earthquake opens a new passage in the underground canal system.',
  'A member of your crew receives a letter from someone they thought was dead.',
  'The price of vice in your territory suddenly doubles. Someone is cornering the market.',
  'A demon whispers your crew\'s name at a seance attended by a noble.',
  'A child shows up at your door claiming one of you is their parent.',
  'Two of your allied factions go to war with each other. Both expect your support.',
  'An ancient Iruvian artifact surfaces in your territory. Everyone wants it.',
]

// Devil's Bargain prompts
export const DEVILS_BARGAINS = [
  'You get what you want, but a friend is put in danger.',
  'You succeed, but you owe a favor to someone dangerous.',
  'It works, but the noise attracts unwanted attention.',
  'You pull it off, but evidence of your involvement is left behind.',
  'Success, but you take 2 stress from the strain.',
  'You manage it, but a cohort or contact is compromised.',
  'It goes your way, but you make a new enemy.',
  'You get the result, but a dark rumor about your crew begins to spread.',
  'Perfect execution, but a demon or ghost takes notice.',
  'You do it, but one of your tools or weapons is damaged beyond repair.',
  'Success, but a personal secret is exposed.',
  'It works, but the Bluecoats add +1 Heat.',
  'You manage it, but a rival gains information about your operations.',
  'Perfect, but you accidentally harm an innocent bystander.',
  'You get it done, but flashbacks reveal an uncomfortable truth about your past.',
  'Success, but a supernatural consequence lingers.',
  'It works, but you\'re forced to make a promise you don\'t want to keep.',
  'You pull it off, but the client changes the terms of the deal.',
  'Success, but a faction you\'re allied with takes offense.',
  'You do it, but time runs out for something else important.',
]

// Engagement roll modifiers reference
export const ENGAGEMENT_MODIFIERS = [
  { modifier: '+1d', condition: 'Bold or daring plan' },
  { modifier: '+1d', condition: 'Unusual or unexpected plan' },
  { modifier: '+1d', condition: 'Detail or setup provides advantage' },
  { modifier: '+1d', condition: 'Allied faction assists' },
  { modifier: '-1d', condition: 'Complex or multi-part plan' },
  { modifier: '-1d', condition: 'Poorly detailed plan' },
  { modifier: '-1d', condition: 'Hostile faction interferes' },
  { modifier: '-1d', condition: 'Target is well-defended or prepared' },
]

// Faction actions for faction turn
export const FACTION_ACTIONS = [
  { name: 'Seize Territory', description: 'The faction takes control of a new area or claim.' },
  { name: 'Defend Territory', description: 'The faction fortifies their position against threats.' },
  { name: 'Gather Information', description: 'The faction spies on enemies or investigates opportunities.' },
  { name: 'Negotiate Alliance', description: 'The faction reaches out to form or strengthen alliances.' },
  { name: 'Undermine Rival', description: 'The faction sabotages, discredits, or weakens an enemy.' },
  { name: 'Acquire Asset', description: 'The faction obtains resources, recruits, or equipment.' },
  { name: 'Launch Assault', description: 'The faction attacks an enemy directly.' },
  { name: 'Lay Low', description: 'The faction takes no action and reduces their profile.' },
  { name: 'Expand Operations', description: 'The faction grows their criminal enterprise or influence.' },
  { name: 'Pursue Project', description: 'The faction advances a long-term project clock.' },
]
