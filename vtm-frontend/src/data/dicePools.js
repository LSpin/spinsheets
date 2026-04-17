// WoD Dice Pool reference data — common pools, combat maneuvers, and splat-specific pools

export const COMMON_POOLS = [
  { category: 'combat', pools: [
    { name: 'Initiative', components: ['dexterity', 'wits'], difficulty: '—', description: 'Roll once; highest result acts first. Add 1d10, not a pool' },
    { name: 'Punch', components: ['dexterity', 'brawl'], difficulty: 6, damage: 'Str (B)', description: 'Standard unarmed strike. 1 success needed' },
    { name: 'Kick', components: ['dexterity', 'brawl'], difficulty: 7, damage: 'Str+1 (B)', description: 'Harder to land, hits harder' },
    { name: 'Clinch / Grapple', components: ['strength', 'brawl'], difficulty: 6, damage: 'Str (B)', description: 'Grab and hold. Both combatants immobilized until broken. Contested Str+Brawl to escape' },
    { name: 'Tackle', components: ['strength', 'brawl'], difficulty: 7, damage: 'Str+1 (B)', description: 'Knockdown. Target must spend next action to stand' },
    { name: 'Bite (Supernatural)', components: ['dexterity', 'brawl'], difficulty: 5, damage: 'Str+1 (A)', description: 'Must clinch first. Vampires: each succ = 1 blood drained. Werewolves: aggravated' },
    { name: 'Melee Attack', components: ['dexterity', 'melee'], difficulty: 6, damage: 'Str+weapon', description: 'Weapon strike. Damage rating varies: knife +1, sword +2, axe +3' },
    { name: 'Stake (Heart)', components: ['dexterity', 'melee'], difficulty: 9, damage: 'Str+1', description: '3 successes required to pierce the heart. Target must have 0-3 health remaining or be immobilized. Paralyzes vampire but does not kill' },
    { name: 'Ranged Attack', components: ['dexterity', 'firearms'], difficulty: 6, damage: 'By weapon', description: 'Diff mods: point blank -4, close -2, medium +0, long +2. Pistol = 4L, Rifle = 8L, Shotgun = 8L (close)' },
    { name: 'Throw', components: ['dexterity', 'athletics'], difficulty: 6, damage: 'Str', description: 'Thrown weapon or improvised object' },
    { name: 'Dodge', components: ['dexterity', 'dodge'], difficulty: 6, description: 'Each success removes 1 attacker success. Can split pool to dodge multiple attacks' },
    { name: 'Block / Parry', components: ['dexterity', 'brawl'], difficulty: 6, description: 'Unarmed block. For armed parry use Dex+Melee. Each success removes 1 attacker success' },
    { name: 'Disarm', components: ['dexterity', 'melee'], difficulty: 6, description: 'Contested. Must exceed opponent\'s Str+Melee. 2+ net successes = weapon flies free' },
    { name: 'Sweep', components: ['dexterity', 'brawl'], difficulty: 8, damage: 'Str (B)', description: 'Knockdown on success. Target loses next action standing up' },
    { name: 'Called Shot (Limb)', components: ['dexterity', 'firearms'], difficulty: 8, damage: 'By weapon', description: 'Target specific body part. +2 diff. Arm/leg: cripple on 3+ damage after soak' },
    { name: 'Called Shot (Head)', components: ['dexterity', 'firearms'], difficulty: 9, damage: 'Weapon +2', description: '+3 diff, +2 damage. Can be lethal even to supernaturals' },
    { name: 'Multiple Actions', components: [], description: 'Declare total actions. First pool = full -1 per extra action. Each subsequent pool -1 cumulative. Max = Dexterity rating' },
    { name: 'Soak', components: ['stamina'], difficulty: 6, description: 'Roll Stamina vs diff 6. Each success = 1 damage absorbed. Mortals: bashing only. Vampires: bashing + lethal. Werewolves: bashing + lethal (not silver)' },
    { name: 'Willpower (auto-success)', components: ['willpower'], description: 'Spend 1 Willpower for 1 automatic success. Once per turn. Cannot spend on damage rolls' },
  ]},
  { category: 'social', pools: [
    { name: 'Persuasion', components: ['charisma', 'expression'], difficulty: 6, description: 'Convince through argument. Contested by Willpower or Wits+Subterfuge if resisted' },
    { name: 'Command', components: ['charisma', 'leadership'], difficulty: 6, description: 'Direct and inspire. 1 succ = basic compliance. 3+ = enthusiastic obedience' },
    { name: 'Intimidate (Physical)', components: ['strength', 'intimidation'], difficulty: 6, description: 'Coerce through overt threat. Resisted by Willpower diff 6. 3+ succ = terrified' },
    { name: 'Intimidate (Social)', components: ['manipulation', 'intimidation'], difficulty: 6, description: 'Subtle coercion, veiled threats. Resisted by Willpower or Wits+Subterfuge' },
    { name: 'Lie / Deceive', components: ['manipulation', 'subterfuge'], difficulty: 6, description: 'Contested by Perception+Subterfuge or Empathy. Must exceed their successes to fool them' },
    { name: 'Seduction', components: ['appearance', 'subterfuge'], difficulty: 6, description: 'Charm and entice. Social context may change diff (7-8 hostile, 5 friendly)' },
    { name: 'Detect Lie', components: ['perception', 'empathy'], difficulty: 6, description: 'Contested vs Manipulation+Subterfuge. Net successes reveal deception' },
    { name: 'Etiquette', components: ['charisma', 'etiquette'], difficulty: 6, description: 'Navigate social protocols. Failure may cause offense. Botch = major insult' },
    { name: 'Performance', components: ['charisma', 'performance'], difficulty: 6, description: '1 succ = adequate. 3 = impressive. 5+ = unforgettable. Botch = humiliating' },
    { name: 'Interrogation', components: ['manipulation', 'intimidation'], difficulty: 6, description: 'Extended roll. Contested by target\'s Willpower. 5+ total successes = full confession' },
  ]},
  { category: 'mental', pools: [
    { name: 'Perception Check', components: ['perception', 'alertness'], difficulty: 6, description: 'Spot details passively. Diff 7-9 for well-hidden things. Ambush: diff 7+' },
    { name: 'Investigation', components: ['perception', 'investigation'], difficulty: 6, description: 'Active searching. Extended roll: 1 succ = surface clues, 3+ = hidden details, 5+ = full picture' },
    { name: 'Awareness (Supernatural)', components: ['perception', 'awareness'], difficulty: 6, description: 'Sense the supernatural. Diff varies: 5 for overt magic, 7 for subtle, 9 for concealed' },
    { name: 'Stealth', components: ['dexterity', 'stealth'], difficulty: 6, description: 'Contested by Perception+Alertness. Must exceed watcher\'s successes to remain hidden' },
    { name: 'Shadowing', components: ['perception', 'stealth'], difficulty: 6, description: 'Follow someone without being noticed. Contested vs target\'s Perception+Alertness' },
    { name: 'Tracking', components: ['perception', 'survival'], difficulty: 6, description: 'Follow tracks. Diff 7 in urban, 5 in mud/snow. Rain/time increase diff' },
    { name: 'Research', components: ['intelligence', 'academics'], difficulty: 6, description: 'Extended roll. Each roll = 1 hour. 1 succ = common knowledge, 5+ = obscure secrets' },
    { name: 'Occult Lore', components: ['intelligence', 'occult'], difficulty: 6, description: 'Recall supernatural knowledge. Diff 7-9 for secret or faction-specific lore' },
    { name: 'Medical Treatment', components: ['intelligence', 'medicine'], difficulty: 6, description: 'Heal 1 bashing per success (mortals). Diff 7 for lethal. Requires supplies for lethal+' },
    { name: 'Repair / Craft', components: ['dexterity', 'crafts'], difficulty: 6, description: 'Build or repair. Extended. Diff varies by complexity: simple 5, complex 7, masterwork 9' },
    { name: 'Computer Use', components: ['intelligence', 'computer'], difficulty: 6, description: 'Hacking diff 8-9. 3+ successes to breach security. Each roll = 10 minutes' },
    { name: 'Drive/Ride (Chase)', components: ['dexterity', 'drive'], difficulty: 6, description: 'Contested extended roll. 3+ net successes = escape or catch. Botch = crash' },
    { name: 'Resist Torture', components: ['willpower'], difficulty: 8, description: 'Roll Willpower diff 8 each round. Failure = reveal information or break down' },
  ]},
]

export const SPLAT_POOLS = {
  // ── Vampire (all eras) ──
  vampire: {
    label: 'Vampire',
    pools: [
      { name: 'Frenzy — Hunger', components: ['selfControl'], difficulty: '5-9', description: 'Sight of blood (diff 5), smell (6), taste (7), starving (8), blood in open wound (9). Failure = hunger frenzy; attack nearest blood source' },
      { name: 'Frenzy — Rage', components: ['selfControl'], difficulty: '5-9', description: 'Mild insult (5), public humiliation (7), physical attack (8), loved one harmed (9). Failure = violent frenzy; attack the source' },
      { name: 'Rötschreck — Fire', components: ['courage'], difficulty: '5-9', description: 'Lighter (5), torch (6), bonfire (7), house fire (8), inferno (9). Failure = flee in mindless terror for the scene' },
      { name: 'Rötschreck — Sunlight', components: ['courage'], difficulty: '7-9', description: 'Filtered/indirect (7), overcast sky (8), direct sunlight (9). Failure = flee to darkness. Sunlight deals 1 agg/turn (more if direct)' },
      { name: 'Blood Buff', components: [], description: 'Spend 1 blood/turn to raise Str, Dex, or Sta by +1 for the scene. Max per turn by Gen: 13-8th: 1, 7th: 2, 6th: 3, 5th: 5, 4th: 8' },
      { name: 'Blood Heal', components: [], description: '1 blood = heal 1 bashing or lethal. Aggravated: 5 blood + 1 full day of rest per level. Can spend while staked' },
      { name: 'Blood per Turn (by Gen)', components: [], description: '13th-8th: 1/turn, pool 10-15. 7th: 2/turn, pool 20. 6th: 3/turn, pool 30. 5th: 5/turn, pool 40. 4th: 8/turn, pool 50' },
      { name: 'Resist Dominate', components: ['willpower'], difficulty: '—', description: 'Spend 1 Willpower to resist a single Dominate command. Does not work against elders 2+ generations lower' },
      { name: 'Resist Presence', components: ['willpower'], difficulty: 8, description: 'Roll Willpower diff 8 to resist Presence effects. Spend 1 WP for auto-success. Higher-gen vampires may be immune' },
      { name: 'Diablerie', components: ['strength', 'courage'], difficulty: 9, description: 'Contested by victim\'s Willpower. 3+ successes to drain soul. Lose 1 Humanity. Gain 1 Gen if victim is lower Gen. Visible to Auspex' },
      { name: 'Soak (Vampire)', components: ['stamina'], difficulty: 6, description: 'Soak bashing and lethal (not aggravated unless Fortitude). Aggravated: only Fortitude dice. Fire/sun = aggravated' },
      { name: 'Spend Blood to Wake', components: [], description: 'Spend 1 blood to rise at sunset. If blood pool is 0, roll Humanity diff 6 to avoid torpor' },
    ],
  },
  // ── Werewolf (all eras) ──
  werewolf: {
    label: 'Werewolf',
    pools: [
      { name: 'Rage — Extra Actions', components: ['rage'], difficulty: 6, description: 'Each success = 1 extra action this turn. Cannot spend Willpower same turn. Cannot use Gifts during Rage actions' },
      { name: 'Frenzy Check', components: ['rage'], difficulty: 6, description: 'Triggered by: injury, humiliation, seeing packmate fall, Wyrm taint. If successes > current Willpower = berserk frenzy. Spend 1 WP to delay 1 turn' },
      { name: 'Fox Frenzy (Flight)', components: ['rage'], difficulty: 6, description: 'Triggered by overwhelming danger (silver, fire, overwhelming odds). Successes > Willpower = blind panicked flight' },
      { name: 'Step Sideways', components: ['gnosis'], difficulty: '6-9', description: 'Diff = local Gauntlet: city 8-9, suburbs 7, rural 6, caern 5, deep wilderness 4. 1 success = cross over (takes 1 turn). Mirror helps: -1 diff' },
      { name: 'Gnosis — Activate Fetish', components: ['gnosis'], difficulty: '5-7', description: 'Diff = fetish level + 2 (max 7). 1 success activates. Dedicated fetishes: diff -1' },
      { name: 'Gnosis — Sense Wyrm', components: ['gnosis'], difficulty: 6, description: '1 succ = vague sense of corruption, 3+ = direction and intensity, 5+ = exact source' },
      { name: 'Claw (Crinos/Hispo)', components: ['dexterity', 'brawl'], difficulty: 6, damage: 'Str+1 (A)', description: 'Aggravated damage. +4 Str in Crinos form. All Crinos attacks are aggravated' },
      { name: 'Bite (Crinos/Hispo)', components: ['dexterity', 'brawl'], difficulty: 5, damage: 'Str+2 (A)', description: 'Aggravated. Must clinch first in Crinos. Hispo can bite freely. +3 Str in Hispo' },
      { name: 'Body Slam (Crinos)', components: ['strength', 'brawl'], difficulty: 7, damage: 'Str (B)', description: 'Knockdown. +4 Str in Crinos. Target loses next action. Can pin on 3+ successes' },
      { name: 'Soak (Werewolf)', components: ['stamina'], difficulty: 6, description: 'Soak all damage types EXCEPT silver (aggravated, cannot soak). Crinos: +3 Stamina. Regenerate 1 non-agg level/turn' },
      { name: 'Regeneration', components: [], description: 'Heal 1 bashing or lethal per turn automatically (not in Homid). Aggravated: 1 level per day of rest. Cannot regenerate silver damage in the same scene' },
      { name: 'Delirium', components: [], description: 'Mortals seeing Crinos form must roll Willpower diff 8 or flee/catatonic. 5+ successes = remember. Kinfolk immune. Low-WP mortals may permanently forget' },
    ],
  },
  // ── Mage ──
  mage: {
    label: 'Mage',
    pools: [
      { name: 'Coincidental Effect', components: ['arete'], difficulty: '4-9', description: 'Diff = highest Sphere used + 3 (min 4, max 9). 1 succ = weak effect. 3+ = full power. 5+ = exceptional. Fits within Sleeper reality' },
      { name: 'Vulgar Effect (no witnesses)', components: ['arete'], difficulty: '5-10', description: 'Diff = highest Sphere + 4 (max 9). Generates 1 Paradox per Sphere level on failure. Even on success: 1 Paradox point' },
      { name: 'Vulgar Effect (w/ Sleeper witnesses)', components: ['arete'], difficulty: '6-10', description: 'Diff = highest Sphere + 5 (max 10!). Extra Paradox: +1 per Sphere level. Witnesses strengthen reality\'s resistance' },
      { name: 'Paradox Backlash', components: [], description: 'When Paradox reaches 5+, ST may trigger backlash. Roll Paradox pool diff 6. Each success = 1 point discharged as: 1 bashing per point, Quiet, Paradox Flaw, or Paradox Spirit' },
      { name: 'Countermagick (Defense)', components: ['arete'], difficulty: '—', description: 'React to incoming Effect. Roll Arete, each success cancels 1 of attacker\'s. Any mage can counter with Prime 1+. Without Prime: can only counter own Spheres' },
      { name: 'Unweaving (Dispel)', components: ['arete'], difficulty: '7-8', description: 'Dismantle existing Effect. Need successes = original caster\'s successes. Requires matching Spheres. Diff 7 (own) or 8 (others\')' },
      { name: 'Quintessence Channel', components: ['arete'], difficulty: 6, description: 'Prime 1+ required. Spend Quintessence to: reduce Paradox 1-for-1, add +1 damage per point, fuel Tass-requiring Effects' },
      { name: 'Meditation / Seeking', components: ['perception', 'meditation'], difficulty: 7, description: 'Extended. 5+ total successes = enter meditative trance. Seekings require 10+ successes over multiple sessions' },
      { name: 'Fast-Casting', components: ['arete'], description: 'Reflexive Effect at +1 diff. Must have all required Spheres. Still generates Paradox. Cannot fast-cast extended Effects' },
      { name: 'Ritual Casting', components: ['arete'], description: 'Extended roll. -1 diff for each extra hour spent (min diff 3). Group ritual: each participant adds 1 die per Arete dot' },
    ],
  },
  // ── Kindred of the East ──
  kote: {
    label: 'Kuei-jin',
    pools: [
      { name: 'Dharma Roll', components: ['dharmaRating'], difficulty: 6, description: 'Enlightenment and spiritual tests. 1 succ = glimpse of truth. 3+ = genuine insight. 5+ = moment of transcendence' },
      { name: 'Hun Roll (Composure)', components: ['hun'], difficulty: 6, description: 'Resist P\'o takeover, maintain composure, recall past lives. Contested vs P\'o for soul control' },
      { name: 'P\'o Roll (Shadow)', components: ['po'], difficulty: 6, description: 'ST rolls to see if P\'o asserts. Successes > Hun rating = shadow nature takes over (Wave Soul or Fire Soul)' },
      { name: 'Fire Soul', components: ['hun'], difficulty: 6, description: 'Contested Hun vs P\'o. If P\'o wins: violent frenzy fueled by Demon Chi. Spend 1 WP to suppress for 1 turn. Lasts until Hun wins contested roll' },
      { name: 'Wave Soul', components: ['po'], difficulty: 6, description: 'P\'o overwhelms Hun. Kuei-jin acts on base instinct — feed, hide, or lash out. More subtle than Fire Soul. Harder to detect' },
      { name: 'Shadow Soul', components: ['po'], difficulty: 7, description: 'Deliberate: spend 1 WP + 1 Demon Chi. P\'o takes controlled command. Gain access to Demon Arts at +2 dice but risk permanent P\'o dominance on botch' },
      { name: 'Yin Chi Attune', components: ['yinChi'], difficulty: 6, description: 'Channel Yin: death, cold, ghosts, entropy effects. Spend 1 Yin Chi per use. Imbalance: 3+ Yin over Yang = Yin-aspected derangements' },
      { name: 'Yang Chi Attune', components: ['yangChi'], difficulty: 6, description: 'Channel Yang: life, fire, passion effects. Spend 1 Yang Chi per use. Imbalance: 3+ Yang over Yin = Yang-aspected derangements' },
      { name: 'Chi Absorption', components: ['stamina'], difficulty: 6, description: 'Drain Chi from mortals, tainted areas, or ley lines. 1 succ = 1 Chi point absorbed. Extended. Draining mortals may kill them' },
      { name: 'Demon Arts Activation', components: ['demonChi'], difficulty: 6, description: 'Spend 1+ Demon Chi. Power level = Demon Shintai rating. Each use risks P\'o roll afterward' },
    ],
  },
  // ── Kinfolk ──
  kinfolk: {
    label: 'Kinfolk',
    pools: [
      { name: 'Numina Activation', components: ['willpower'], difficulty: 7, description: 'Most Numina roll Willpower diff 7. Some Numina use specific Attribute + Ability instead. See individual Numina descriptions' },
      { name: 'Resist Delirium', components: [], description: 'Automatic. Kinfolk are immune to the Delirium — they can see Crinos form without fear or memory loss. This is their key advantage' },
      { name: 'Gnosis Sense', components: ['gnosis'], difficulty: 6, description: 'Rare. Some Kinfolk with Gnosis background can sense Wyrm taint (diff 8) or nearby spirits (diff 7)' },
      { name: 'Resist Possession', components: ['willpower'], difficulty: 7, description: 'Contested by spirit\'s Gnosis. If spirit wins, possession lasts until exorcised or spirit leaves voluntarily' },
    ],
  },
  // ── Ghoul ──
  ghoul: {
    label: 'Ghoul',
    pools: [
      { name: 'Frenzy Resist', components: ['selfControl'], difficulty: 6, description: 'Same as vampire frenzy rules. Diff 6 base, +1 per provocation level. Ghouls frenzy more easily than vampires (+1 diff on all frenzy rolls)' },
      { name: 'Blood Buff', components: [], description: 'Spend 1 blood to raise Str, Dex, or Sta by +1 for the scene. Max 1 blood/turn. Cannot exceed domitor\'s generational max' },
      { name: 'Blood Heal', components: [], description: 'Spend 1 blood to heal 1 bashing level. Lethal: requires 1 blood + 1 day rest. Cannot heal aggravated with blood' },
      { name: 'Discipline Use', components: [], description: 'Potence: automatic (add dots to Str for damage). Other disciplines: roll normally. Max level = domitor\'s blood potency allows' },
      { name: 'Resist Domination', components: ['willpower'], difficulty: 8, description: 'Roll Willpower diff 8 vs domitor\'s Dominate. -2 diff if blood bonded to domitor. Spend 1 WP for auto-success' },
      { name: 'Blood Bond Check', components: ['willpower'], difficulty: 8, description: 'After 3 drinks from same vampire: fully bonded. Roll Willpower diff 8 to resist a direct order from regnant. -1 diff per month without feeding' },
    ],
  },
  // ── Familiar ──
  familiar: {
    label: 'Familiar',
    pools: [
      { name: 'Willpower Roll', components: ['willpower'], difficulty: 6, description: 'Resist commands, mental effects, or act independently. Spend 1 WP for auto-success' },
      { name: 'Power Activation', components: ['willpower'], difficulty: 7, description: 'Most familiar powers use Willpower diff 7. Specific powers may vary. See power descriptions' },
      { name: 'Sense Master\'s Danger', components: ['perception', 'alertness'], difficulty: 6, description: 'Automatic if within line of sight. Diff 7 if nearby, diff 9 if distant. Bond allows general sense of master\'s emotional state' },
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
