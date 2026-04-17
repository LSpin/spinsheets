// WoD Dice Pool reference data — common pools, combat maneuvers, and splat-specific pools

export const COMMON_POOLS = [
  { category: 'combat', pools: [
    { name: 'Initiative', components: ['dexterity', 'wits'], description: 'Determines action order each turn' },
    { name: 'Punch', components: ['dexterity', 'brawl'], difficulty: 6, damage: 'Strength (Bashing)', description: 'Standard unarmed strike' },
    { name: 'Kick', components: ['dexterity', 'brawl'], difficulty: 7, damage: 'Strength +1 (Bashing)', description: 'Harder to land, more damage' },
    { name: 'Clinch / Grapple', components: ['strength', 'brawl'], difficulty: 6, damage: 'Strength (Bashing)', description: 'Grab and hold; both combatants immobilized' },
    { name: 'Tackle', components: ['strength', 'brawl'], difficulty: 7, damage: 'Strength +1 (Bashing)', description: 'Knockdown attack' },
    { name: 'Bite', components: ['dexterity', 'brawl'], difficulty: 5, damage: 'Strength +1 (Aggravated)', description: 'Must clinch first (supernatural fangs/claws)' },
    { name: 'Melee Attack', components: ['dexterity', 'melee'], difficulty: 6, damage: 'Strength + weapon', description: 'Melee weapon strike' },
    { name: 'Ranged Attack', components: ['dexterity', 'firearms'], difficulty: 6, damage: 'By weapon', description: 'Firearm or ranged weapon' },
    { name: 'Throw', components: ['dexterity', 'athletics'], difficulty: 6, damage: 'Strength', description: 'Throw an object or weapon' },
    { name: 'Dodge', components: ['dexterity', 'dodge'], difficulty: 6, description: 'Avoid incoming attacks (V20/Revised)' },
    { name: 'Block / Parry', components: ['dexterity', 'brawl'], difficulty: 6, description: 'Deflect with body or weapon (Dex + Melee for armed parry)' },
    { name: 'Disarm', components: ['dexterity', 'melee'], difficulty: 6, description: 'Knock weapon from opponent\'s hand' },
    { name: 'Sweep', components: ['dexterity', 'brawl'], difficulty: 8, damage: 'Strength (Bashing)', description: 'Knockdown; target must spend action to rise' },
    { name: 'Soak', components: ['stamina'], description: 'Resist damage. Supers soak lethal; mortals bashing only' },
  ]},
  { category: 'social', pools: [
    { name: 'Persuasion', components: ['charisma', 'expression'], description: 'Convince through speech or writing' },
    { name: 'Command', components: ['charisma', 'leadership'], description: 'Direct and inspire others' },
    { name: 'Intimidate', components: ['strength', 'intimidation'], description: 'Coerce through overt threat' },
    { name: 'Manipulation', components: ['manipulation', 'subterfuge'], description: 'Deceive, misdirect, or manipulate' },
    { name: 'Seduction', components: ['appearance', 'subterfuge'], description: 'Charm and entice' },
    { name: 'Empathy Read', components: ['perception', 'empathy'], description: 'Sense emotions, detect lies' },
    { name: 'Etiquette', components: ['charisma', 'etiquette'], description: 'Navigate social protocols' },
    { name: 'Performance', components: ['charisma', 'performance'], description: 'Entertain, orate, or perform' },
  ]},
  { category: 'mental', pools: [
    { name: 'Perception Check', components: ['perception', 'alertness'], description: 'Spot details passively' },
    { name: 'Investigation', components: ['perception', 'investigation'], description: 'Active searching and deduction' },
    { name: 'Supernatural Awareness', components: ['perception', 'awareness'], description: 'Sense the supernatural or hidden magic' },
    { name: 'Stealth', components: ['dexterity', 'stealth'], description: 'Move unseen and unheard' },
    { name: 'Tracking', components: ['perception', 'survival'], description: 'Follow tracks and trail prey' },
    { name: 'Research', components: ['intelligence', 'academics'], description: 'Library research, recall lore' },
    { name: 'Occult Lore', components: ['intelligence', 'occult'], description: 'Supernatural knowledge' },
    { name: 'Medical Diagnosis', components: ['intelligence', 'medicine'], description: 'Diagnose and treat injuries/illness' },
    { name: 'Repair / Craft', components: ['dexterity', 'crafts'], description: 'Build or repair physical objects' },
  ]},
]

export const SPLAT_POOLS = {
  // ── Vampire (all eras) ──
  vampire: {
    label: 'Vampire',
    pools: [
      { name: 'Frenzy Resist (Hunger)', components: ['selfControl'], description: 'Resist hunger frenzy. Diff varies by stimulus (5-9)' },
      { name: 'Frenzy Resist (Rage)', components: ['conscience'], description: 'Resist anger frenzy. Diff varies by provocation' },
      { name: 'Rötschreck (Fire/Sun)', components: ['courage'], description: 'Resist terror frenzy from fire or sunlight. Diff by intensity' },
      { name: 'Blood Buff', components: [], description: 'Spend 1 blood/turn to raise a Physical Attribute by 1 (max by Generation)' },
      { name: 'Spend Blood to Heal', components: [], description: '1 blood heals 1 Bashing/Lethal. Aggravated: 5 blood + 1 day rest per level' },
      { name: 'Blood per Turn', components: [], description: 'Gen 13-8: 1/turn. Gen 7: 2. Gen 6: 3. Gen 5: 5. Gen 4: 8' },
    ],
  },
  // ── Werewolf (all eras) ──
  werewolf: {
    label: 'Werewolf',
    pools: [
      { name: 'Rage Roll', components: ['rage'], description: 'Roll to gain extra actions or enter frenzy. Each success = 1 extra action' },
      { name: 'Frenzy Check', components: ['rage'], description: 'Diff 6. If successes exceed Willpower rating, frenzy occurs' },
      { name: 'Step Sideways', components: ['gnosis'], description: 'Enter the Umbra. Diff = local Gauntlet rating (6-9 typical)' },
      { name: 'Gnosis Roll', components: ['gnosis'], description: 'Activate fetishes, sense the supernatural, spiritual tasks' },
      { name: 'Claw (Crinos)', components: ['dexterity', 'brawl'], difficulty: 6, damage: 'Strength +1 (Aggravated)', description: 'Crinos/Hispo claw attack' },
      { name: 'Bite (Crinos)', components: ['dexterity', 'brawl'], difficulty: 5, damage: 'Strength +2 (Aggravated)', description: 'Crinos/Hispo bite — must clinch first or in Hispo' },
      { name: 'Body Slam (Crinos)', components: ['strength', 'brawl'], difficulty: 7, damage: 'Strength (Bashing)', description: 'Massive knockdown in war form' },
      { name: 'Soak (Crinos)', components: ['stamina'], description: 'Werewolves soak lethal. +2 Stamina in Crinos. Cannot soak silver (aggravated)' },
    ],
  },
  // ── Mage ──
  mage: {
    label: 'Mage',
    pools: [
      { name: 'Arete Roll (Coincidental)', components: ['arete'], description: 'Cast a coincidental Effect. Diff = highest Sphere level + 3 (max 9)' },
      { name: 'Arete Roll (Vulgar)', components: ['arete'], description: 'Cast a vulgar Effect. Diff = highest Sphere + 4 (max 9). +1 if Sleeper witnesses' },
      { name: 'Paradox Soak', components: ['willpower'], description: 'Optional: roll Willpower to reduce Paradox gained. Diff 6' },
      { name: 'Quintessence Channel', components: ['arete'], description: 'Channel Quintessence through Prime 1+ effects' },
      { name: 'Countermagick', components: ['arete'], description: 'React to oppose another mage\'s Effect. Diff = opponent\'s successes' },
      { name: 'Meditation (Seeking)', components: ['perception', 'meditation'], description: 'Enter meditative trance for Seekings or focus' },
    ],
  },
  // ── Kindred of the East ──
  kote: {
    label: 'Kuei-jin',
    pools: [
      { name: 'Dharma Roll', components: ['dharmaRating'], description: 'Roll Dharma for enlightenment checks and spiritual tests' },
      { name: 'Hun Roll', components: ['hun'], description: 'Higher Soul — resist manipulation, maintain composure, recall past lives' },
      { name: 'P\'o Roll', components: ['po'], description: 'Demon Soul — shadow nature asserts itself. ST typically rolls this' },
      { name: 'Yin Chi Attune', components: ['yinChi'], description: 'Channel Yin Chi for death, cold, and ghost-related effects' },
      { name: 'Yang Chi Attune', components: ['yangChi'], description: 'Channel Yang Chi for life, fire, and vitality effects' },
      { name: 'Demon Chi', components: ['demonChi'], description: 'Fuel Demon Arts and P\'o-driven powers' },
      { name: 'Fire Soul', components: ['hun'], description: 'Resist shadow nature taking over (Hun vs P\'o contested)' },
      { name: 'Wave Soul', components: ['po'], description: 'P\'o overwhelms — ST may roll to trigger wave soul' },
    ],
  },
  // ── Kinfolk ──
  kinfolk: {
    label: 'Kinfolk',
    pools: [
      { name: 'Numina Activation', components: ['willpower'], description: 'Most Numina are activated with a Willpower roll' },
      { name: 'Resist Delirium', components: ['willpower'], description: 'Kinfolk are immune to the Delirium (a key advantage)' },
      { name: 'Gnosis (if any)', components: ['gnosis'], description: 'Some Kinfolk with Gnosis can sense the supernatural or use minor rites' },
    ],
  },
  // ── Ghoul ──
  ghoul: {
    label: 'Ghoul',
    pools: [
      { name: 'Frenzy Resist', components: ['selfControl'], description: 'Ghouls frenzy like vampires when provoked. Roll Self-Control diff 6+' },
      { name: 'Blood Buff', components: [], description: 'Spend 1 blood to raise a Physical Attribute by 1 for the scene' },
      { name: 'Discipline Use', components: [], description: 'Use Potence (automatic), others vary. Max discipline level = domitor\'s generation limits' },
      { name: 'Blood Remaining', components: [], description: 'Ghouls typically hold 1-2 blood points. Must feed from domitor monthly' },
    ],
  },
  // ── Familiar ──
  familiar: {
    label: 'Familiar',
    pools: [
      { name: 'Willpower Roll', components: ['willpower'], description: 'Resist commands, mental effects, or act independently' },
      { name: 'Power Activation', components: ['willpower'], description: 'Most familiar powers use Willpower as the activation pool' },
    ],
  },
}

// Maps splat constants to pool keys
export const SPLAT_POOL_MAP = {
  VAMPIRE: 'vampire',
  DARK_AGES_VAMPIRE: 'vampire',
  VICTORIAN_VAMPIRE: 'vampire',
  WEREWOLF: 'werewolf',
  WYLD_WEST_WEREWOLF: 'werewolf',
  CHANGING_BREEDS: 'werewolf',
  MAGE: 'mage',
  VICTORIAN_MAGE: 'mage',
  KOTE: 'kote',
  KINFOLK: 'kinfolk',
  GHOUL: 'ghoul',
  FAMILIAR: 'familiar',
}
