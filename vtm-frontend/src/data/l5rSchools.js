// L5R 4th Edition School Techniques
// Each school entry matches the CLANS constant in L5RForm.jsx

export const L5R_SCHOOLS = {
  // ══════════════════════════════════════
  //  CRAB CLAN
  // ══════════════════════════════════════

  'Hida Bushi': {
    clan: 'Crab',
    type: 'Bushi',
    traits: '+1 Stamina',
    honor: 3.5,
    skills: 'Athletics, Defense, Heavy Weapons (Tetsubo), Intimidation, Kenjutsu, Lore: Shadowlands, any one Bugei skill',
    techniques: [
      { rank: 1, name: 'The Way of the Crab', effect: 'Ignore TN penalties for heavy armor (except Stealth). +1k0 damage with Heavy Weapons.' },
      { rank: 2, name: 'The Mountain Does Not Move', effect: 'Gain Reduction equal to your Earth Ring.' },
      { rank: 3, name: 'Two Pincers, One Mind', effect: 'Attacks as Simple Action with Heavy Weapons or Samurai keyword weapons.' },
      { rank: 4, name: 'Devastating Blow', effect: 'Once per encounter with Heavy Weapon: reduce enemy Reduction by 4 and Daze on hit. Target may roll Earth to recover.' },
      { rank: 5, name: 'The Mountain Does Not Fall', effect: 'Spend Void Point during Reactions: act as Healthy, ignore Dazed/Fatigued/Stunned until next Reactions.' },
    ]
  },

  'Hiruma Bushi': {
    clan: 'Crab',
    type: 'Bushi',
    traits: '+1 Agility',
    honor: 4.5,
    skills: 'Athletics, Defense, Hunting (Tracking), Kenjutsu, Kyujutsu, Lore: Shadowlands, any one Bugei skill',
    techniques: [
      { rank: 1, name: "Torch's Flame Flickers", effect: '+1k0 to attack rolls in Attack Stance. Make food/water/jade rations last twice as long for up to Hunting Rank people.' },
      { rank: 2, name: "Wolf's Little Lesson", effect: 'In Attack Stance, +5 Armor TN each time you hit with melee (stacks up to School Rank times per skirmish).' },
      { rank: 3, name: 'Hummingbird Wings', effect: 'Once per Round when targeted, gain +2x School Rank to Armor TN for that attack.' },
      { rank: 4, name: 'Shark Smells Blood', effect: 'Attacks as Simple Action with Samurai keyword weapons.' },
      { rank: 5, name: 'Daylight Wastes No Movement', effect: 'Excess Wounds beyond killing a target carry over to the next target you hit (once, same skirmish).' },
    ]
  },

  'Hiruma Scout': {
    clan: 'Crab',
    type: 'Scout',
    traits: '+1 Reflexes',
    honor: 2.5,
    skills: 'Athletics, Hunting, Kenjutsu, Kyujutsu, Lore: Shadowlands, Stealth (Sneaking), any one Bugei skill',
    techniques: [
      { rank: 1, name: "Dance the Razor's Edge", effect: 'Gain bonus to attack and Armor TN while in the Shadowlands. (Core Book)' },
      { rank: 2, name: 'Run Like the Wind', effect: 'Increased movement speed; bonus to Athletics rolls for running. (Core Book)' },
      { rank: 3, name: 'Veil of the Spirits', effect: 'Spend Void Point while in cover and stationary: add School Rank in kept dice to Stealth roll until you move or make noise.' },
      { rank: 4, name: 'Harness the Wind', effect: 'Attacks as Simple Action with Samurai weapons, knives, or bows. Also Simple Action vs. any Shadowlands creature.' },
      { rank: 5, name: 'Strike of the Stalker', effect: 'Against surprised/unaware foes: Raises not limited by Void, ignore 10 points of Reduction.' },
    ]
  },

  'Kaiu Engineer': {
    clan: 'Crab',
    type: 'Artisan',
    traits: '+1 Intelligence',
    honor: 4.5,
    skills: 'Artisan: Architecture, Defense, Engineering, Kenjutsu, Lore: Architecture, War Fan, any one Skill',
    techniques: [
      { rank: 1, name: 'The Kaiu Method', effect: '+1k0 to all School Skill rolls. Spending Void on School Skills grants +2k2 instead of +1k1 (not cumulative).' },
      { rank: 2, name: 'The Path of Stone', effect: 'Engineering TN 25: add School Rank x100 Wounds to large structures. Re-roll siege engine damage dice below School Rank.' },
      { rank: 3, name: 'The Path of the Shell', effect: 'When crafting armor (double time/cost): add School Rank to Reduction and half School Rank to Armor TN bonus.' },
      { rank: 4, name: 'The Path of War', effect: 'Modify Mass Battle roll by half School Rank. Attacks as Simple Action with katana, dai tsuchi, or war fan.' },
      { rank: 5, name: 'The Path of Steel', effect: 'Crafted weapons gain +1k0 attack or +0k1 damage. Katana: spend all Void Points to make blade unbreakable.' },
    ]
  },

  'Kuni Shugenja': {
    clan: 'Crab',
    type: 'Shugenja',
    traits: '+1 Willpower',
    honor: 2.5,
    skills: 'Calligraphy (Cipher), Defense, Lore: Shadowlands, Lore: Theology, Spellcraft, any one Skill',
    techniques: [
      { rank: 1, name: 'Gaze Into Shadow', effect: 'Affinity: Earth. Deficiency: Air. Sense Taint within Earth Ring x5 feet by concentrating. +1k0 to Spellcasting vs. Tainted targets. (Core Book)' },
      { rank: 2, name: 'Touch of Desecration', effect: '+1k1 to Earth spell damage against Tainted creatures. Can identify type and rough strength of Taint. (Core Book)' },
      { rank: 3, name: 'Jade Strike', effect: 'Earth spells count as jade for overcoming Invulnerability. +1 Free Raise on Earth spells targeting Shadowlands creatures. (Core Book)' },
      { rank: 4, name: 'Purging the Darkness', effect: 'May spend Void Point to make any spell count as jade. Earth spells against Tainted targets gain +0k1 damage. (Core Book)' },
      { rank: 5, name: 'Doom of Fu Leng', effect: 'Once per day: Contested Earth roll vs. Tainted target to purge Taint Ranks equal to Raises called. (Core Book)' },
    ]
  },

  'Kuni Witch Hunter': {
    clan: 'Crab',
    type: 'Bushi',
    traits: '+1 Willpower',
    honor: 3.5,
    skills: 'Athletics, Defense, Hunting, Intimidation, Investigation (Interrogation), Kenjutsu, Lore: Shadowlands',
    techniques: [
      { rank: 1, name: 'To See the Darkness', effect: 'Contested Investigation/Awareness vs. Sincerity/Willpower to detect Taint (bonus per Taint Rank). +1k1 to resist Taint and attack Tainted/Shadowlands foes.' },
      { rank: 2, name: 'To Ride the Darkness', effect: 'Free Action Lore: Shadowlands TN 20 to recall one strength or weakness of a Shadowlands creature. Raise for more info.' },
      { rank: 3, name: 'To Strike the Darkness', effect: 'Melee attacks as Simple Action vs. Shadowlands creatures or known Tainted opponents.' },
      { rank: 4, name: 'To Repel the Darkness', effect: '+3k0 to Taint detection and creature knowledge rolls. May learn one Kiho.' },
      { rank: 5, name: 'To Shatter the Darkness', effect: '+4k1 to attack and damage rolls vs. Shadowlands creatures and known Tainted foes (stacks with Rank 1).' },
    ]
  },

  'Toritaka Bushi': {
    clan: 'Crab',
    type: 'Bushi',
    traits: '+1 Perception',
    honor: 4.5,
    skills: 'Athletics, Defense, Hunting, Kenjutsu, Lore: Spirit Realms, Spears, any one Bugei skill',
    techniques: [
      { rank: 1, name: "The Falcon's Eyes", effect: '+1k0 to all Perception-based Skill and Trait rolls. +1k0 damage vs. creatures from other Spirit Realms.' },
      { rank: 2, name: 'The Falcon Takes Flight', effect: 'Detect creatures from other Spirit Realms by Perception roll vs. TN of creature Air Ring x5.' },
      { rank: 3, name: "The Falcon's Wings", effect: 'Attacks as Simple Action with spears or Samurai keyword weapons.' },
      { rank: 4, name: 'Vigilant and Strong', effect: 'Spend Void Point to negate darkness or blinding penalties.' },
      { rank: 5, name: 'Claws of the Falcon', effect: 'Attacks ignore 5 points of Reduction. Vs. Spirit Realm creatures: spend Void to reduce their Reduction by 10 for one Round.' },
    ]
  },

  'Yasuki Courtier': {
    clan: 'Crab',
    type: 'Courtier',
    traits: '+1 Awareness',
    honor: 2.5,
    skills: 'Commerce (Appraisal), Courtier, Defense, Etiquette, Intimidation, Sincerity (Deceit), any one Merchant skill',
    techniques: [
      { rank: 1, name: 'The Way of the Carp', effect: 'Free Raise on Commerce; no Honor/Glory loss for using Commerce. Contested Commerce/Perception vs. Etiquette/Awareness to learn what someone wants.' },
      { rank: 2, name: 'Do As We Say', effect: 'Use Commerce in place of Courtier for negotiations involving material goods or services. (Core Book)' },
      { rank: 3, name: 'Treasures of the Carp', effect: 'Once per session per target: offer a gift to shift attitude favorably. Commerce/Awareness roll vs. TN based on target Status. (Core Book)' },
      { rank: 4, name: 'The Kolat Merchant', effect: 'Gain a network of commercial contacts. Void Point + Commerce roll TN 25 to acquire any non-magical item within a day. (Core Book)' },
      { rank: 5, name: 'What Is Yours Is Mine', effect: 'Once per session: Contested Commerce/Awareness to convince target to part with a specific possession or grant a major favor. (Core Book)' },
    ]
  },

  'Hida Pragmatist': {
    clan: 'Crab',
    type: 'Bushi',
    traits: '+1 Stamina',
    honor: 2.5,
    skills: 'Athletics, Defense, Jiujutsu, Hunting, Intimidation, Knives, any one Bugei skill',
    techniques: [
      { rank: 1, name: 'The Eternal Stone Unleashed', effect: '+1k0 to resist Intimidation/Fear. +1k0 attack and damage unarmed/improvised (must keep high dice).' },
      { rank: 2, name: 'Wearing Down the Mountain', effect: 'Extra Attack Maneuver costs only 3 Raises (instead of 5) when unarmed or with improvised weapons.' },
      { rank: 3, name: 'Fury of the Avalanche', effect: 'Attacks as Simple Action when unarmed, with improvised weapons, or with Samurai keyword weapons.' },
      { rank: 4, name: 'Stone Turns Steel Aside', effect: 'Times per skirmish equal to Void: after being attacked in melee, Free Action Contested Jiujutsu/Agility to strike back with enemy\'s weapon.' },
      { rank: 5, name: 'Fight to the End', effect: 'Spend Void Point: Complex Action attack ignoring Wound penalties, status effects, and physical Disadvantages. +3k1 damage.' },
    ]
  },

  // ══════════════════════════════════════
  //  CRANE CLAN
  // ══════════════════════════════════════

  'Asahina Shugenja': {
    clan: 'Crane',
    type: 'Shugenja',
    traits: '+1 Awareness',
    honor: 4.5,
    skills: 'Calligraphy (Cipher), Etiquette, Lore: Theology, Meditation, Sincerity, Spellcraft, any one High skill',
    techniques: [
      { rank: 1, name: 'The Soul of Purity', effect: 'Affinity: Air. Deficiency: Fire. Free Raise on all spells with the Ward keyword. +1k0 to Spellcasting when spell has no damage component. (Core Book)' },
      { rank: 2, name: 'Shield of Air', effect: 'Air spells that protect or heal gain +1 Free Raise. Ward spells last twice as long. (Core Book)' },
      { rank: 3, name: 'Breath of Purity', effect: 'May spend Void Point to add Honor Rank to Spellcasting roll for protective/healing spells. (Core Book)' },
      { rank: 4, name: 'Heart of the Ward', effect: 'Ward spells may affect a number of additional targets equal to School Rank. +2k0 to defensive spell rolls. (Core Book)' },
      { rank: 5, name: 'Purity of Spirit', effect: 'Once per day: cast any Air or Ward spell without expending a spell slot. Non-damage spells gain +2k2 to Spellcasting. (Core Book)' },
    ]
  },

  'Daidoji Iron Warrior': {
    clan: 'Crane',
    type: 'Bushi',
    traits: '+1 Stamina',
    honor: 6.5,
    skills: 'Athletics, Battle, Defense, Iaijutsu, Kenjutsu, Kyujutsu, any one Bugei skill',
    techniques: [
      { rank: 1, name: 'The Force of Honor', effect: 'Gain (Honor Rank - 4, min 1) bonus Wounds at each Wound Rank. +1k0 attack rolls in Attack Stance.' },
      { rank: 2, name: 'The Shield of Faith', effect: 'Guard Maneuver lasts an extra Round and grants +5 additional Armor TN (no self-penalty, target gets +15).' },
      { rank: 3, name: 'Strike Beneath the Veil', effect: 'Melee attacks as Simple Action in Attack Stance.' },
      { rank: 4, name: 'Vigilance of Mind', effect: 'Spend Void Point during Reactions: +2k1 to attack and damage vs. an opponent who attacked you or your Guard target.' },
      { rank: 5, name: 'To Tread on the Sword', effect: 'Spend 2 Void Points to redirect an action targeting your Guard charge to yourself, plus gain a Free Move Action toward them.' },
    ]
  },

  'Doji Courtier': {
    clan: 'Crane',
    type: 'Courtier',
    traits: '+1 Awareness',
    honor: 6.5,
    skills: 'Courtier (Manipulation), Etiquette (Courtesy), Perform: Storytelling, Sincerity, Tea Ceremony, any two High skills',
    techniques: [
      { rank: 1, name: 'The Soul of Honor', effect: 'At Honor 6.0+: Free Raise on Courtier, Sincerity, and Etiquette. Contested Courtier/Awareness to learn if someone needs a favor.' },
      { rank: 2, name: 'Speaking in Silence', effect: 'Courtier/Intelligence TN 15 to communicate simple ideas via Cadence gestures to other trained Crane.' },
      { rank: 3, name: 'The Perfect Gift', effect: 'Courtier/Awareness TN 20 in court to provide a gift/favor. Success can gain target as 1-Devotion Ally for free.' },
      { rank: 4, name: 'Voice of Honor', effect: 'Contested Courtier/Awareness: force target to concede a point in a political argument or lose face. (Core Book)' },
      { rank: 5, name: 'The Gift of the Lady', effect: 'Contested Courtier/Awareness vs. Etiquette/Willpower to permanently shift someone\'s attitude toward your clan favorably.' },
    ]
  },

  'Doji Magistrate': {
    clan: 'Crane',
    type: 'Bushi',
    traits: '+1 Awareness',
    honor: 6.5,
    skills: 'Defense, Etiquette, Investigation (Notice), Jiujutsu, Kenjutsu, Sincerity, any one skill',
    techniques: [
      { rank: 1, name: 'Temper Steel With Honor', effect: 'Add Air Ring to Armor TN. +1k0 attack with jitte or sasumata.' },
      { rank: 2, name: 'Flowing Like Water', effect: 'When controlling a Grapple or resolving Disarm, may use opponent\'s Strength instead of own.' },
      { rank: 3, name: 'Breath of the Law', effect: 'Successful Grapple or Disarm also Dazes the opponent.' },
      { rank: 4, name: 'Flowing Like Air', effect: 'Attacks as Simple Action unarmed or with jitte, sasumata, or Samurai keyword weapons.' },
      { rank: 5, name: 'The Willow in the Storm', effect: 'Spend Void Point in Reactions: attackers next Round subtract their Air Ring from each die rolled against you.' },
    ]
  },

  'Kakita Bushi': {
    clan: 'Crane',
    type: 'Bushi',
    traits: '+1 Reflexes',
    honor: 6.5,
    skills: 'Etiquette, Iaijutsu (Focus), Kenjutsu, Kyujutsu, Sincerity, Tea Ceremony, any one High or Bugei skill',
    techniques: [
      { rank: 1, name: 'The Way of the Crane', effect: 'Add 2x Iaijutsu to Initiative. +1k1+School Rank to attack and Focus rolls in Center Stance (and the following Round).' },
      { rank: 2, name: 'Speed of Lightning', effect: '+2k0 attack rolls against opponents with lower Initiative.' },
      { rank: 3, name: 'First and Last Strike', effect: 'Strike first in a duel if you win Iaijutsu/Void by 3+. Free Raise per additional margin of 3 (instead of 5).' },
      { rank: 4, name: 'One Strike, Two Cuts', effect: 'Attacks as Simple Action with Samurai keyword weapons.' },
      { rank: 5, name: 'Strike With No Thought', effect: 'May take one Simple Action in Center Stance. Center benefits apply immediately. May remain in Center Stance indefinitely.' },
    ]
  },

  'Kakita Artisan': {
    clan: 'Crane',
    type: 'Artisan',
    traits: '+1 Awareness',
    honor: 5.5,
    skills: 'Acting, Artisan: choice, Courtier, Etiquette, Perform: choice, Sincerity, any one High skill',
    techniques: [
      { rank: 1, name: 'Soul of the Artisan', effect: 'Choose one art as focus: +2k0 to rolls, Raises not limited by Void with chosen art.' },
      { rank: 2, name: "The Soul's Dream", effect: 'Contested art/Awareness vs. Etiquette/Willpower: shift audience emotions in desired direction for Insight Rank hours.' },
      { rank: 3, name: 'Free the Spirit', effect: 'Select a second chosen art; all bonuses apply to both. Chosen art bonus increases to +2k1.' },
      { rank: 4, name: 'Undying Name', effect: 'Art roll vs. TN 20+5x Glory Rank: increase or decrease target\'s Glory by 5+ points. Two extra Raises for Infamy.' },
      { rank: 5, name: 'A Gift Beyond Price', effect: 'Once per month: gift of art + Contested roll to permanently shift target\'s attitude toward your clan favorably (or hostilely on failure).' },
    ]
  },

  // ══════════════════════════════════════
  //  DRAGON CLAN
  // ══════════════════════════════════════

  'Kitsuki Investigator': {
    clan: 'Dragon',
    type: 'Courtier',
    traits: '+1 Perception',
    honor: 6.5,
    skills: 'Courtier, Etiquette, Investigation (Notice), Kenjutsu, Meditation, Sincerity, any one High skill',
    techniques: [
      { rank: 1, name: "Kitsuki's Method", effect: 'Free Raise on all Investigation rolls. Add Perception to Armor TN in skirmishes.' },
      { rank: 2, name: 'Wisdom the Wind Brings', effect: 'Anyone lying to you or using Feint/Disarm against you adds +5 per School Rank to their TN.' },
      { rank: 3, name: 'Know the Rhythm of the Heart', effect: 'Investigation (Notice)/Perception vs. Intelligence x5: gain an accurate read of someone\'s personality and motivations.' },
      { rank: 4, name: 'Finding the Path', effect: 'Contested Investigation/Intelligence vs. Etiquette/Intelligence: identify one ally or enemy of the target. Raise for more.' },
      { rank: 5, name: 'The Eyes Betray the Heart', effect: 'Automatic Contested Roll to detect lies. If you know someone is lying: +5k0 bonus and Raises to extract more info.' },
    ]
  },

  'Mirumoto Bushi': {
    clan: 'Dragon',
    type: 'Bushi',
    traits: '+1 Agility',
    honor: 4.5,
    skills: 'Athletics, Defense, Iaijutsu, Kenjutsu (Katana), Lore: Shugenja, Meditation, any one Bugei skill',
    techniques: [
      { rank: 1, name: 'Way of the Dragon', effect: 'No dual-wield penalties with katana+wakizashi. +School Rank Armor TN (stacks with dual-wield bonus). May adjust spell TN targeting you by 5.' },
      { rank: 2, name: 'The Calm in Midst of Thunder', effect: 'In Center Stance: add Kenjutsu Rank to Iaijutsu rolls.' },
      { rank: 3, name: 'Strong and Swift', effect: 'Attacks as Simple Action with Samurai keyword weapons.' },
      { rank: 4, name: 'Furious Retaliation', effect: 'During Reactions: choose one attacker. +3k0 to all attack rolls against that target next Turn.' },
      { rank: 5, name: 'Heart of the Dragon', effect: 'When attacking twice per Turn with katana+wakizashi, make one additional off-hand attack as a Free Action.' },
    ]
  },

  'Tamori Shugenja': {
    clan: 'Dragon',
    type: 'Shugenja',
    traits: '+1 Stamina',
    honor: 4.5,
    skills: 'Athletics, Calligraphy (Cipher), Defense, Lore: Theology, Meditation, Spellcraft, any one Skill',
    techniques: [
      { rank: 1, name: 'Flesh of the Elements', effect: 'Affinity: Earth. Deficiency: Air. May craft potions/salves replicating Earth spell effects. Potions last School Rank days. (Core Book)' },
      { rank: 2, name: 'Body of Stone', effect: 'Spend Void Point to gain Reduction equal to Earth Ring for a number of Rounds equal to School Rank. (Core Book)' },
      { rank: 3, name: 'Blood of the Mountain', effect: '+1k0 to all Earth Spellcasting rolls. Earth defensive spells grant an extra +5 Armor TN to targets. (Core Book)' },
      { rank: 4, name: 'Embrace of the Elements', effect: 'May expend Earth spell slot as Free Action to heal Wounds equal to Earth Ring + School Rank on touch. (Core Book)' },
      { rank: 5, name: 'Heart of the Mountain', effect: 'Earth spells cost one fewer spell slot (minimum 1). Once per day: cast Earth spell without slot expenditure. (Core Book)' },
    ]
  },

  'Togashi Tattooed Order': {
    clan: 'Dragon',
    type: 'Monk',
    traits: '+1 Reflexes',
    honor: 4.5,
    skills: 'Athletics, Jiujutsu, Lore: Theology, Meditation, any three Skills',
    techniques: [
      { rank: 1, name: 'Blood of the Kami', effect: 'Gain two Tattoos.' },
      { rank: 2, name: 'Body of Stone', effect: '+1k1 to all unarmed attack and damage rolls.' },
      { rank: 3, name: 'Blessing of the Kami', effect: 'Gain two additional Tattoos.' },
      { rank: 4, name: 'Will of Stone', effect: 'Unarmed attacks as Simple Action.' },
      { rank: 5, name: 'Touch of the Kami', effect: 'Gain two additional Tattoos.' },
    ]
  },

  // ══════════════════════════════════════
  //  LION CLAN
  // ══════════════════════════════════════

  'Akodo Bushi': {
    clan: 'Lion',
    type: 'Bushi',
    traits: '+1 Agility',
    honor: 6.5,
    skills: 'Battle (Mass Combat), Defense, Kenjutsu, Kyujutsu, Lore: History, Sincerity, any one Bugei skill',
    techniques: [
      { rank: 1, name: 'The Way of the Lion', effect: 'Ignore opponent armor TN bonus OR gain a Free Raise on attacks. +1k0 on first melee attack or vs. opponent who Raised against you.' },
      { rank: 2, name: 'Strength of Purity', effect: 'Add Honor Rank to one roll per Turn (not damage, not in Center Stance).' },
      { rank: 3, name: 'Strength of My Ancestors', effect: 'Attacks as Simple Action with Samurai keyword weapons.' },
      { rank: 4, name: 'Triumph Before Battle', effect: 'Once per skirmish during Reactions: designate opponent, ignore their Stance Armor TN bonuses next Round.' },
      { rank: 5, name: "Akodo's Final Lesson", effect: 'When Raising on Bugei Skill rolls: if you meet base TN but not Raised TN, succeed without Raise benefits.' },
    ]
  },

  'Ikoma Bard': {
    clan: 'Lion',
    type: 'Courtier',
    traits: '+1 Awareness',
    honor: 6.5,
    skills: 'Courtier, Etiquette, Lore: History, Perform: Storytelling, Sincerity, any two High skills',
    techniques: [
      { rank: 1, name: 'The Herald of Glory', effect: 'Gain Precise Memory for free. Perform: Storytelling TN 20 to grant Glory equal to School Rank to another (School Rank times per month per person).' },
      { rank: 2, name: 'The Heart of the Lion', effect: 'No Honor/Glory loss for showing emotion for Lion or honorable causes. Others add +5 per School Rank to Intimidation/Temptation TNs against you.' },
      { rank: 3, name: 'The Voice of the Ancestors', effect: 'Perform: Oratory/Awareness to inspire allies: each may add Honor Rank to one Skill Roll during the battle.' },
      { rank: 4, name: 'The Strength of Tradition', effect: 'School Rank times per session: Simple Action Perform: Storytelling TN 25 to let ally re-roll a failed roll with added Honor Rank unkept dice.' },
      { rank: 5, name: 'Every Lion is Your Brother', effect: 'Five times per session on Contested Social Rolls: add Perform: Storytelling Rank in unkept dice by citing precedent.' },
    ]
  },

  "Ikoma Lion's Shadow": {
    clan: 'Lion',
    type: 'Bushi',
    traits: '+1 Awareness',
    honor: 3.5,
    skills: 'Acting, Athletics, Courtier, Kenjutsu, Sincerity (Deceit), Stealth, any one Low skill',
    techniques: [
      { rank: 1, name: 'No Boundaries', effect: 'Half Honor loss for Low Skills used for Lion Clan. Free Action: +1k0 attack/Contested rolls vs. up to School Rank opponents (School Rank uses/day).' },
      { rank: 2, name: 'The Lion Cannot Fail', effect: '+1k0 to all School Skill rolls.' },
      { rank: 3, name: 'The Spirit of Ikoma', effect: 'Once per Round: lose 3 Honor as Free Action to gain +2k1 to attack, damage, and Contested Social rolls until end of Round.' },
      { rank: 4, name: "The Quiet Lion's Claws", effect: 'Melee weapon attacks as Simple Action.' },
      { rank: 5, name: 'Ferocious Determination', effect: 'Spend Void Point: Contested Courtier/Awareness to shake opponent\'s resolve, penalizing their rolls against you for hours.' },
    ]
  },

  'Kitsu Shugenja': {
    clan: 'Lion',
    type: 'Shugenja',
    traits: '+1 Perception',
    honor: 4.5,
    skills: 'Calligraphy (Cipher), Etiquette, Lore: History, Lore: Theology, Meditation, Spellcraft, any one High skill',
    techniques: [
      { rank: 1, name: 'Senses of the Kitsu', effect: 'Affinity: Water. Deficiency: Fire. Detect spirit portals within School Rank x10 miles. Previous School Rank +1 for casting. (Core Book)' },
      { rank: 2, name: 'Hand of the Kitsu', effect: 'Unarmed damage +0k1 (spiritual talons). Meditation TN 30 to project soul into Meido or Yomi to interact with ancestors.' },
      { rank: 3, name: 'Soul of the Kitsu', effect: 'May take a passenger when projecting into spirit realms (they must also pass Meditation roll). Previous School Rank +1 for casting.' },
      { rank: 4, name: 'Eyes of the Ancestors', effect: 'May communicate with ancestral spirits once per day without entering the spirit realm. Gain +1k1 to Social rolls when invoking ancestors. (Core Book)' },
      { rank: 5, name: 'Bridge Between Worlds', effect: 'May physically open a portal to Meido or Yomi for up to School Rank people. Duration equals Void Ring in minutes. (Core Book)' },
    ]
  },

  'Matsu Berserker': {
    clan: 'Lion',
    type: 'Bushi',
    traits: '+1 Strength',
    honor: 6.5,
    skills: 'Athletics, Battle, Jiujutsu, Kenjutsu, Kyujutsu, Lore: History, any one Bugei skill',
    techniques: [
      { rank: 1, name: "The Lion's Roar", effect: 'Add Honor Rank to all damage rolls. In Full Attack Stance: +5 feet additional movement.' },
      { rank: 2, name: "Matsu's Fury", effect: 'Intimidate opponents in combat; enemies who fail resist are shaken. Does not work against Fear-immune opponents.' },
      { rank: 3, name: "The Lion's Charge", effect: 'Melee attacks as Simple Action.' },
      { rank: 4, name: "Matsu's Courage", effect: 'Ignore Wound TN penalties equal to Honor Rank (or 2x Honor Rank in Full Attack Stance).' },
      { rank: 5, name: "The Lion's Victory", effect: 'Once per encounter: spend Void Point after rolling damage to make all kept dice explode.' },
    ]
  },

  // ══════════════════════════════════════
  //  MANTIS CLAN
  // ══════════════════════════════════════

  'Kitsune Shugenja': {
    clan: 'Mantis',
    type: 'Shugenja',
    traits: '+1 Willpower',
    honor: 4.5,
    skills: 'Athletics, Calligraphy (Cipher), Hunting, Lore: Spirit Realms, Medicine, Spellcraft, any one Skill',
    techniques: [
      { rank: 1, name: 'Friend of the Spirits', effect: 'Affinity: Earth. Deficiency: Fire. +1k0 on all spell rolls targeting or interacting with animal spirits. Can communicate with animal spirits. (Core Book)' },
      { rank: 2, name: 'Kitsune\'s Gift', effect: 'May summon a minor fox spirit once per day as an ally. Spirit has Earth/Water 3. Lasts School Rank hours. (Core Book)' },
      { rank: 3, name: 'The Spirit\'s Blessing', effect: '+1 Free Raise on Earth spells. May sense the presence of Spirit Realm portals within School Rank miles. (Core Book)' },
      { rank: 4, name: 'Walk Between Worlds', effect: 'May spend 2 Void Points to physically enter Chikushudo for up to School Rank hours. Gain +2k0 to all spell rolls there. (Core Book)' },
      { rank: 5, name: 'Master of the Spirit Wilds', effect: 'Animal spirits will not attack you. May command animal spirits with Contested Willpower roll. Earth spells gain +2k1 in natural settings. (Core Book)' },
    ]
  },

  'Moshi Shugenja': {
    clan: 'Mantis',
    type: 'Shugenja',
    traits: '+1 Awareness',
    honor: 4.5,
    skills: 'Calligraphy (Cipher), Lore: Theology, Meditation, Perform: Song, Spellcraft, any two Skills',
    techniques: [
      { rank: 1, name: 'Daughter of the Sun', effect: 'Affinity: Fire. Deficiency: Earth. In sunlight: +1k1 to Fire spell rolls. May re-roll one die on Fire spells cast outdoors during the day. (Core Book)' },
      { rank: 2, name: 'The Sun\'s Guidance', effect: '+1 Free Raise on Fire spells during daytime. Fire spells deal +1k0 damage in direct sunlight. (Core Book)' },
      { rank: 3, name: 'Lady Sun\'s Fury', effect: 'Fire spells ignore 5 points of target Reduction. May spend Void Point to ignore 10 instead. (Core Book)' },
      { rank: 4, name: 'The Sun Never Sets', effect: 'May treat nighttime as day for school technique purposes by spending a Void Point (lasts School Rank Rounds). Fire spells +0k1 damage. (Core Book)' },
      { rank: 5, name: 'Amaterasu\'s Blessing', effect: 'Once per day: cast one Fire spell as a Free Action. Fire spells gain +2k2 in direct sunlight. (Core Book)' },
    ]
  },

  'Tsuruchi Archer': {
    clan: 'Mantis',
    type: 'Bushi',
    traits: '+1 Reflexes',
    honor: 3.5,
    skills: 'Athletics, Defense, Hunting, Investigation, Kyujutsu (Yumi), any two Bugei skills',
    techniques: [
      { rank: 1, name: 'Always Be Ready', effect: '+1k0 to all bow attack rolls. +3 Initiative.' },
      { rank: 2, name: 'The Arrow Knows the Way', effect: 'One Free Raise for Called Shot only. +2k0 damage with bows.' },
      { rank: 3, name: "The Wasp's Sting", effect: 'Bow attacks as Simple Action.' },
      { rank: 4, name: 'Flight of No-Mind', effect: 'Once per skirmish: spend Void Point as Complex Action for a perfect shot ignoring armor, Wound penalties, and visibility penalties.' },
      { rank: 5, name: "Tsuruchi's Eye", effect: 'Complex Action ranged attack: +4k1 to attack and damage. Cannot combine with Flight of No-Mind.' },
    ]
  },

  'Tsuruchi Bounty Hunter': {
    clan: 'Mantis',
    type: 'Bushi',
    traits: '+1 Perception',
    honor: 3.5,
    skills: 'Athletics, Hunting (Tracking), Intimidation, Investigation, Kenjutsu, Kyujutsu, any one Skill',
    techniques: [
      { rank: 1, name: "A Hunter's Sense", effect: '+1k1 Intimidation vs. lower caste; +1k0 Social rolls vs. samurai seeking quarry. Add School Rank unkept dice to Hunting/Investigation for tracking.' },
      { rank: 2, name: 'No Prey Escapes', effect: 'Spend Void to auto-succeed Lore: Underworld to find local criminals who can help find your prey.' },
      { rank: 3, name: 'Justice of the Wasp', effect: 'Vs. declared criminals: Disarm/Knockdown for 1 less Raise, and success also Dazes.' },
      { rank: 4, name: 'Twin Sting Strike', effect: 'Ranged attacks as Simple Action with yumi. Vs. declared criminals: melee attacks also Simple Action with katana/knife.' },
      { rank: 5, name: 'Eyes of the Wasp', effect: 'Lore: Heraldry reveals Honor Rank and all Social/Mental Disadvantages. Declared criminals are auto-Dazed on any hit.' },
    ]
  },

  'Yoritomo Bushi': {
    clan: 'Mantis',
    type: 'Bushi',
    traits: '+1 Strength',
    honor: 3.5,
    skills: 'Athletics, Commerce, Defense, Kenjutsu, Knives, Sailing, any one Bugei skill',
    techniques: [
      { rank: 1, name: 'The Way of the Mantis', effect: 'No terrain movement penalties. No Honor/Glory loss for Peasant weapons. No off-hand penalty with Peasant weapons. +1k0 attack rolls.' },
      { rank: 2, name: 'Voice of the Storm', effect: 'Each melee hit reduces target Armor TN by 5 (stacks up to School Rank times, lasts 2 Rounds, resets duration on reapplication).' },
      { rank: 3, name: 'Strike of the Mantis', effect: 'Attacks as Simple Action with Samurai or Peasant keyword weapons.' },
      { rank: 4, name: 'The Rolling Wave', effect: 'Moving 5+ feet grants +10 Armor TN until next Turn. May sacrifice bonus for 2 Free Raises on Knockdown.' },
      { rank: 5, name: 'Hand of Osano-Wo', effect: 'Spend Void Point: keep additional damage dice equal to Strength. +0k2 damage vs. Prone targets.' },
    ]
  },

  'Yoritomo Courtier': {
    clan: 'Mantis',
    type: 'Courtier',
    traits: '+1 Willpower',
    honor: 2.5,
    skills: 'Commerce, Courtier, Etiquette, Intimidation (Control), Sincerity, Temptation, any one Merchant skill',
    techniques: [
      { rank: 1, name: 'Duty Before Honor', effect: 'No Glory/Honor loss for Commerce or Intimidation (Control). Free Raises equal to School Rank on Social rolls vs. ronin, criminals, pirates, etc.' },
      { rank: 2, name: 'Storm Heart', effect: 'Spend Void Point: +2k2 on Intimidation rolls this Turn. Opponents in court find you unpredictable. (Core Book)' },
      { rank: 3, name: 'Command the Winds', effect: 'School Rank times per session: re-roll failed Sincerity as Intimidation (Control) instead.' },
      { rank: 4, name: 'Will of the Storm', effect: 'Contested Intimidation/Willpower vs. Etiquette/Willpower: target cannot spend Void vs. you and suffers -3k0 on Social rolls against you for one hour.' },
      { rank: 5, name: 'Strength in All Things', effect: '+5k0 to all Intimidation rolls and rolls to resist Intimidation, Temptation, or Fear.' },
    ]
  },

  // ══════════════════════════════════════
  //  PHOENIX CLAN
  // ══════════════════════════════════════

  'Agasha Shugenja': {
    clan: 'Phoenix',
    type: 'Shugenja',
    traits: '+1 Intelligence',
    honor: 4.5,
    skills: 'Calligraphy (Cipher), Craft: Alchemy, Etiquette, Lore: Theology, Medicne, Spellcraft, any one High skill',
    techniques: [
      { rank: 1, name: 'Elements of All Things', effect: 'Affinity: Fire. Deficiency: Air. May craft potions using spell slots. Potion replicates a spell with Mastery Level up to School Rank. (Core Book)' },
      { rank: 2, name: 'The Agasha Flame', effect: 'Fire spell damage +1k0. Potions last twice as long. (Core Book)' },
      { rank: 3, name: 'Secrets of the Forge', effect: '+1 Free Raise on Fire spells. Potions may now replicate spells from any element (still uses Fire slot). (Core Book)' },
      { rank: 4, name: 'Heart of the Forge', effect: 'May create permanent minor magical items. Fire spells gain +0k1 damage. (Core Book)' },
      { rank: 5, name: 'The Dragon\'s Fire', effect: 'Fire spells may be cast as Simple Actions. Once per day: craft a potion without spell slot cost. (Core Book)' },
    ]
  },

  'Isawa Shugenja': {
    clan: 'Phoenix',
    type: 'Shugenja',
    traits: '+1 Intelligence',
    honor: 4.5,
    skills: 'Calligraphy (Cipher), Etiquette, Lore: Theology, Meditation, Sincerity, Spellcraft, any one High skill',
    techniques: [
      { rank: 1, name: 'Isawa\'s Gift', effect: 'Choose Affinity and Deficiency freely (not Void, opposing elements). +1 Free Raise on Affinity spells. (Core Book)' },
      { rank: 2, name: 'Embrace the Elements', effect: 'Gain a second Affinity (no associated Deficiency). +1k0 to all Spellcasting rolls. (Core Book)' },
      { rank: 3, name: 'The Kami\'s Will', effect: 'May spend Void to cast Affinity spells one Mastery Level higher than normally allowed. (Core Book)' },
      { rank: 4, name: 'The Inner Eye', effect: 'All spell slot costs reduced by 1 (minimum 1) for Affinity elements. Gain +1k1 to Spellcasting. (Core Book)' },
      { rank: 5, name: 'The Last Master', effect: 'Once per day: cast any one spell without expending a slot. All Affinity spells gain +2k0 to Spellcasting. (Core Book)' },
    ]
  },

  'Isawa Tensai': {
    clan: 'Phoenix',
    type: 'Shugenja',
    traits: '+1 Willpower',
    honor: 4.0,
    skills: 'Calligraphy (Cipher), Defense, Lore: Theology, Meditation, Spellcraft, any two Skills',
    techniques: [
      { rank: 1, name: 'Embrace of the Elements', effect: 'Choose one Element as specialization. Affinity with that Element. Gain +1k1 on all Spellcasting rolls for that Element. (Core Book)' },
      { rank: 2, name: 'The Fury of the Kami', effect: 'Specialized element spells deal +1k1 damage. May spend Void Point to add +1 Free Raise on specialized element. (Core Book)' },
      { rank: 3, name: 'One With the Element', effect: 'Gain supernatural resistance equal to School Rank x5 against effects of your specialized element (fire burns, water drowning, etc.). (Core Book)' },
      { rank: 4, name: 'Command the Element', effect: 'Specialized element spells may be cast as Simple Actions. Gain +2k0 to Spellcasting with specialized element. (Core Book)' },
      { rank: 5, name: 'Avatar of the Element', effect: 'Once per day: transform into an avatar of your element for School Rank Rounds. Gain massive trait bonuses and immunity to your element. (Core Book)' },
    ]
  },

  'Shiba Bushi': {
    clan: 'Phoenix',
    type: 'Bushi',
    traits: '+1 Agility',
    honor: 5.5,
    skills: 'Defense, Kenjutsu, Kyujutsu, Meditation, Polearms, Theology, any one Bugei or High skill',
    techniques: [
      { rank: 1, name: 'The Way of the Phoenix', effect: 'May spend 2 Void Points for +2k2 on a roll. Guard as Free Action (target gets +5 Armor TN instead of +10).' },
      { rank: 2, name: 'Dancing With the Elements', effect: 'Choose target within 30\' when taking Stance: increase or decrease spell TNs targeting them by 5. Same applies when you are targeted.' },
      { rank: 3, name: 'One With the Void', effect: 'Automatically regain 1 Void Point during Reactions if anyone spent a Void Point this Round (twice per skirmish, may exceed max).' },
      { rank: 4, name: 'Move With the World', effect: 'Attacks as Simple Action with Polearms, Spears, or Samurai keyword weapons.' },
      { rank: 5, name: 'Touch of the Void', effect: 'Each Void Point spent counts as two. May spend Void Points on enhancements twice per Turn.' },
    ]
  },

  'Asako Loremaster': {
    clan: 'Phoenix',
    type: 'Courtier',
    traits: '+1 Intelligence',
    honor: 6.5,
    skills: 'Courtier, Etiquette (Courtesy), Lore: History, Lore: Theology, Meditation, Sincerity, any one Lore skill',
    techniques: [
      { rank: 1, name: 'Temple of the Soul', effect: 'Free Raise on all Lore Skill rolls. Spending Void on Etiquette gives +3k1 instead of +1k1.' },
      { rank: 2, name: 'From the Ashes', effect: 'After one day observing a court: Lore: History/Perception TN 20 for +2k0 to Social rolls in that court for two days.' },
      { rank: 3, name: 'Voice of the Universe', effect: 'Hour of conversation + Lore: History/Intelligence TN 25: ally adds your Lore: History Rank to Social rolls for 24 hours.' },
      { rank: 4, name: 'Invincible Mind', effect: 'When failing Contested Social roll to resist influence: re-roll using Intelligence instead of the original Trait.' },
      { rank: 5, name: 'Wisdom of the Ages', effect: '+5k0 to all Lore Skill rolls, including those used for other Techniques.' },
    ]
  },

  // ══════════════════════════════════════
  //  SCORPION CLAN
  // ══════════════════════════════════════

  'Bayushi Bushi': {
    clan: 'Scorpion',
    type: 'Bushi',
    traits: '+1 Agility',
    honor: 2.5,
    skills: 'Defense, Etiquette, Iaijutsu, Kenjutsu, Kyujutsu, Sincerity, any one Bugei or Low skill',
    techniques: [
      { rank: 1, name: 'The Way of the Scorpion', effect: '+1k1 Initiative. +5 Armor TN against opponents with lower Initiative.' },
      { rank: 2, name: 'Pincers and Tail', effect: 'Feint Maneuver costs only 1 Raise instead of 2.' },
      { rank: 3, name: 'Strike at the Tail', effect: 'Choose target within 30\' when taking Stance: on hit, target is Fatigued. Earth TN 25 to resist during Reactions.' },
      { rank: 4, name: 'Strike From Above, Strike From Below', effect: 'Melee attacks as Simple Action.' },
      { rank: 5, name: 'The Pincers Hold, The Tail Strikes', effect: 'Once per encounter: spend Void Point as Complex Action melee attack; success Stuns target. Earth roll at TN = damage to resist.' },
    ]
  },

  'Bayushi Courtier': {
    clan: 'Scorpion',
    type: 'Courtier',
    traits: '+1 Awareness',
    honor: 2.5,
    skills: 'Calligraphy, Courtier (Gossip), Etiquette, Investigation, Sincerity (Deceit), Temptation, any one Skill',
    techniques: [
      { rank: 1, name: 'Weakness is My Strength', effect: 'On Contested Social rolls: gain 1 Free Raise per 3 points of target\'s Mental/Social Disadvantages (max 5 Raises).' },
      { rank: 2, name: 'Shallow Waters', effect: 'Contested Investigation/Awareness vs. Etiquette/Awareness: learn target\'s lowest Mental Trait and Social Skill.' },
      { rank: 3, name: 'Secrets are Birthmarks', effect: 'Contested Courtier/Awareness: force target to reveal a Mental/Social Disadvantage. May gain 2-point Blackmail free.' },
      { rank: 4, name: "Scrutiny's Sweet Sting", effect: 'Vs. Blackmail targets: their dice cannot explode. Spend Void to force opponent to use a Mental Trait of your choice on Contested Social rolls.' },
      { rank: 5, name: 'No More Masks', effect: 'School Rank times per session: Contested Courtier (Gossip)/Awareness to inflict a Social Disadvantage on target for one month.' },
    ]
  },

  'Shosuro Infiltrator': {
    clan: 'Scorpion',
    type: 'Bushi',
    traits: '+1 Agility',
    honor: 1.5,
    skills: 'Acting, Athletics, Ninjutsu, Sincerity, Stealth (Sneaking), any two Low or Bugei skills',
    techniques: [
      { rank: 1, name: 'The Path of Shadows', effect: 'No Honor loss for Low Skills/Ninjutsu Weapons used for Scorpion Clan. +2k0 to all Stealth rolls.' },
      { rank: 2, name: 'Strike From Darkness', effect: 'Vs. unaware targets: Raises not limited by Void and add School Rank dice to attack. Half bonus vs. targets with Conditions.' },
      { rank: 3, name: 'Steel Within Silk', effect: 'Melee attacks as Simple Action from ambush or with Ninja keyword weapons. Shuriken: Complex Action for School Rank ranged attacks.' },
      { rank: 4, name: 'Whisper of Steel', effect: 'After a single attack, opponents must win Contested Investigation/Perception vs. Stealth/Agility to detect you.' },
      { rank: 5, name: 'The Final Silence', effect: 'After rolling damage: spend Void Points to set up to 2 dice per Point to 10 (non-exploding).' },
    ]
  },

  'Soshi Shugenja': {
    clan: 'Scorpion',
    type: 'Shugenja',
    traits: '+1 Awareness',
    honor: 2.5,
    skills: 'Calligraphy (Cipher), Courtier, Etiquette, Lore: Theology, Sincerity, Spellcraft, any one Skill',
    techniques: [
      { rank: 1, name: 'The Kami\'s Whisper', effect: 'Affinity: Air. Deficiency: Earth. May cast spells with no visible signs (only spiritual perception can detect). +1k0 to Stealth while spell is active. (Core Book)' },
      { rank: 2, name: 'Secrets on the Wind', effect: 'Air spells that spy, conceal, or deceive gain +1 Free Raise. May spend Void for +2k0 on Air Spellcasting. (Core Book)' },
      { rank: 3, name: 'Hidden Within the Breeze', effect: 'May cast Air spells targeting self as Free Actions (Mastery Level 3 or lower). +1k1 to all illusion spell rolls. (Core Book)' },
      { rank: 4, name: 'The Wind Listens', effect: 'Gain awareness of conversations within Air Ring x10 feet once per day. Air spells cost one fewer slot (min 1). (Core Book)' },
      { rank: 5, name: 'The Shadow\'s Voice', effect: 'Once per day: cast any Air spell as a Free Action regardless of Mastery Level. All Air spells gain +2k2. (Core Book)' },
    ]
  },

  'Yogo Shugenja': {
    clan: 'Scorpion',
    type: 'Shugenja',
    traits: '+1 Intelligence',
    honor: 2.5,
    skills: 'Calligraphy (Cipher), Defense, Investigation, Lore: Shadowlands, Spellcraft, any two Skills',
    techniques: [
      { rank: 1, name: 'The Curse of Yogo', effect: 'Affinity: Earth. Deficiency: Air. Free Raise on Ward spells. +1k0 to Earth Spellcasting when protecting or warding. (Core Book)' },
      { rank: 2, name: 'Guarded by Stone', effect: 'Ward spells last twice as long. May spend Void Point to extend a Ward\'s radius by 10 feet. (Core Book)' },
      { rank: 3, name: 'Yogo\'s Binding', effect: 'Earth spells that bind or restrain gain +1k1 to Spellcasting. Target suffers +5 TN to escape. (Core Book)' },
      { rank: 4, name: 'The Stone\'s Embrace', effect: 'May maintain one additional Ward spell simultaneously. Earth binding spells ignore target Reduction. (Core Book)' },
      { rank: 5, name: 'The Final Seal', effect: 'Once per day: create a permanent Ward requiring no spell slot. Ward spells gain +3k0 to Spellcasting. (Core Book)' },
    ]
  },

  // ══════════════════════════════════════
  //  SPIDER CLAN
  // ══════════════════════════════════════

  'Chuda Shugenja': {
    clan: 'Spider',
    type: 'Shugenja',
    traits: '+1 Willpower',
    honor: 1.5,
    skills: 'Calligraphy (Cipher), Hunting, Intimidation, Lore: Shadowlands, Spellcraft, Stealth, any one Skill',
    techniques: [
      { rank: 1, name: 'Dark Knowledge', effect: 'Affinity: Earth. Deficiency: Air. May use Taint Rank in place of Void on Spellcasting rolls. Maho spells do not cost Honor. (Core Book)' },
      { rank: 2, name: 'Secrets of Blood', effect: 'Maho spells gain +1k0 to Spellcasting per point of Taint Rank. May use blood (Wounds) in place of spell slots. (Core Book)' },
      { rank: 3, name: 'Dark Sacrifice', effect: 'May sacrifice an unwilling target\'s blood to fuel Maho: each Wound taken by target counts as 2 spell slots. (Core Book)' },
      { rank: 4, name: 'Embrace of Jigoku', effect: 'Taint no longer causes physical deformities. Maho spells gain +2k0 to Spellcasting. (Core Book)' },
      { rank: 5, name: 'Lord of the Taint', effect: 'May cast Maho spells as Simple Actions. Gain +1k1 to all Spellcasting rolls. Immune to Taint detection below Mastery Level 5. (Core Book)' },
    ]
  },

  'Daigotsu Bushi': {
    clan: 'Spider',
    type: 'Bushi',
    traits: '+1 Strength',
    honor: 1.5,
    skills: 'Athletics, Defense, Heavy Weapons, Intimidation, Kenjutsu, Lore: Shadowlands, any one Bugei skill',
    techniques: [
      { rank: 1, name: 'The Way of the Spider', effect: 'Each Round: reduce Wound penalties by Strength+Taint Rank OR add same to damage. TN to detect your Taint increased by 10.' },
      { rank: 2, name: 'Aura of Blood', effect: 'Spend Void Point as Simple Action: you and allies within 30\' add +2k0 damage for Taint Rank + Strength Rounds.' },
      { rank: 3, name: "Ashura's Wing", effect: 'Melee attacks as Simple Action.' },
      { rank: 4, name: 'Devouring Wrath', effect: 'On melee hit: regain 5 Wounds immediately (up to 20 bonus Wounds above max, lost after skirmish).' },
      { rank: 5, name: 'Inhuman Assault', effect: 'Once per skirmish: Complex Action melee attack ignoring armor, Reduction, and Stance effects. Hit strips armor/Stance bonuses for Taint+Strength Rounds.' },
    ]
  },

  'Daigotsu Courtier': {
    clan: 'Spider',
    type: 'Courtier',
    traits: '+1 Awareness',
    honor: 1.5,
    skills: 'Courtier (Manipulation), Etiquette, Intimidation, Investigation, Sincerity (Deceit), Temptation, any one Skill',
    techniques: [
      { rank: 1, name: 'Insidious Whispers', effect: 'Free Raise on Sincerity (Deceit). Taint detection TN increased by 5x School Rank. Add School Rank to apparent Honor Rank.' },
      { rank: 2, name: 'Cracks in the Wall', effect: 'Spend Void + Courtier/Awareness TN 25: everyone within 20\' suffers -1k1 to Etiquette and Perform for one hour.' },
      { rank: 3, name: 'Darkness Cannot be Trapped', effect: 'When accused: spend Void + Contested Sincerity (Deceit)/Awareness to shift blame to someone else present.' },
      { rank: 4, name: 'The Touch of Sin', effect: 'School Rank times/session: Contested Courtier/Willpower to inflict a Consumed by Shourido Disadvantage for School Rank hours.' },
      { rank: 5, name: 'The Embrace of Darkness', effect: 'After 15 min conversation + Contested Sincerity/Awareness: convince target to treat someone as their enemy (cannot target lord/Emperor).' },
    ]
  },

  'Goju Ninja': {
    clan: 'Spider',
    type: 'Other',
    traits: '+1 Reflexes',
    honor: 0.0,
    skills: 'Athletics, Hunting, Knives, Ninjutsu, Stealth (Sneaking), any two Low or Bugei skills',
    techniques: [
      { rank: 1, name: 'The Cloak of Night', effect: 'Increase Armor TN up to School Rank x5, but same amount added as penalty to all non-Athletics/Defense/Stealth rolls.' },
      { rank: 2, name: 'Melting into Shadow', effect: 'Add School Rank dice to Stealth rolls. Uncontested detection TNs increased by School Rank x5. +1 Free Raise on attacks vs. unaware targets.' },
      { rank: 3, name: 'The Shadowed Blade', effect: 'Attacks as Simple Action with knives or Ninjutsu weapons. Shuriken: Complex Action for School Rank ranged attacks.' },
      { rank: 4, name: 'Step Within Shadow', effect: 'Simple Move Action: enter one shadow and emerge from another within School Rank x100 feet.' },
      { rank: 5, name: 'Shadow upon the Moon', effect: 'Permanently lose facial features. May dissolve into incorporeal shadow (Simple Action): immune to non-crystal damage, pass through matter.' },
    ]
  },

  'Ninube Shugenja': {
    clan: 'Spider',
    type: 'Shugenja',
    traits: '+1 Awareness',
    honor: 0.0,
    skills: 'Calligraphy, Intimidation, Lore: Shadowlands, Sincerity (Deceit), Spellcraft, Stealth, any one Skill',
    techniques: [
      { rank: 1, name: 'Shadows of the Mind', effect: 'Affinity: Air. Deficiency: Earth. May cast illusion spells without verbal/somatic components. +1k0 to Stealth while any spell is active. (Core Book)' },
      { rank: 2, name: 'Embrace of Nothing', effect: 'Air illusion spells gain +1k1. May spend Void Point to make illusions undetectable by mundane senses. (Core Book)' },
      { rank: 3, name: 'The Void Between Stars', effect: 'May cast Air spells targeting others\' minds as Simple Actions. Targets suffer +5 TN to resist illusions. (Core Book)' },
      { rank: 4, name: 'Darkness Made Real', effect: 'Illusions can cause real physical effects (damage, restraint). Illusion spells gain +2k0 to Spellcasting. (Core Book)' },
      { rank: 5, name: 'Lord of Shadows', effect: 'Once per day: create a shadow realm within 100 feet; all within suffer -3k0 to all rolls except yours. Lasts School Rank Rounds. (Core Book)' },
    ]
  },

  // ══════════════════════════════════════
  //  UNICORN CLAN
  // ══════════════════════════════════════

  'Ide Emissary': {
    clan: 'Unicorn',
    type: 'Courtier',
    traits: '+1 Awareness',
    honor: 5.5,
    skills: 'Courtier, Etiquette (Courtesy), Horsemanship, Investigation, Lore: Culture, Sincerity (Honesty), any one High skill',
    techniques: [
      { rank: 1, name: 'The Heart Speaks', effect: 'Etiquette/Awareness TN 20 to avoid giving inadvertent offense. Free Raise on Sincerity (Honesty), but +5 TN on Sincerity (Deceit).' },
      { rank: 2, name: 'Piercing the Veils', effect: 'Contested Investigation/Perception to discern the true emotions behind someone\'s words, bypassing cultural masks. (Core Book)' },
      { rank: 3, name: 'The Heart Listens', effect: 'Spend Void Point to mediate disputes: Contested Courtier/Awareness to calm both parties and open negotiations. (Core Book)' },
      { rank: 4, name: 'Answering the Heart', effect: 'When using Rank 2 and 3 techniques: roll additional unkept dice equal to School Rank.' },
      { rank: 5, name: 'The Immovable Hand of Peace', effect: 'Spend Void: Contested Sincerity (Honesty)/Awareness: target cannot take hostile action against you for 2x School Rank hours (if they also refrain). Requires Honor 2.0+.' },
    ]
  },

  'Iuchi Shugenja': {
    clan: 'Unicorn',
    type: 'Shugenja',
    traits: '+1 Intelligence',
    honor: 4.5,
    skills: 'Calligraphy (Cipher), Defense, Horsemanship, Lore: Theology, Medicine, Spellcraft, any one Skill',
    techniques: [
      { rank: 1, name: 'The Kami\'s Steed', effect: 'Affinity: Water. Deficiency: Fire. May cast spells while mounted without penalty. +1k0 to Spellcasting while on horseback. (Core Book)' },
      { rank: 2, name: 'Riding the Waves', effect: 'Water spells gain +1 Free Raise. May deliver touch-range spells through mount\'s touch. (Core Book)' },
      { rank: 3, name: 'The Path of Water', effect: 'Water spells cast while mounted gain +1k1 to Spellcasting. Mount gains bonus Wounds equal to School Rank x5. (Core Book)' },
      { rank: 4, name: 'Bonds of the Kami', effect: 'May create meishodo (name magic talismans). Talismans store one spell for later activation. May maintain School Rank talismans. (Core Book)' },
      { rank: 5, name: 'Master of the Rolling Waves', effect: 'Water spells cost one fewer slot (min 1). Once per day: cast Water spell as Free Action. Mount gains +10 Armor TN. (Core Book)' },
    ]
  },

  'Moto Bushi': {
    clan: 'Unicorn',
    type: 'Bushi',
    traits: '+1 Agility',
    honor: 3.5,
    skills: 'Athletics, Defense, Horsemanship, Hunting, Kenjutsu, any two Bugei skills',
    techniques: [
      { rank: 1, name: 'The Way of the Unicorn', effect: 'Wield two-handed weapons one-handed (except bows). +1k0 damage while mounted, with scimitar, or with two-handed melee (no stacking). Scimitars have Samurai keyword.' },
      { rank: 2, name: "Shinsei's Smile", effect: 'Gain attack roll bonus equal to half of target\'s Wound Rank TN penalties.' },
      { rank: 3, name: 'Desert Wind Strike', effect: 'Melee attacks as Simple Action with any melee weapon.' },
      { rank: 4, name: 'The Charge of Madness', effect: 'Once per skirmish: if you reduce a target to Out, immediately make a Free Action attack against a different target (no Raises).' },
      { rank: 5, name: 'Moto Cannot Yield', effect: 'While mounted or in Full Attack: keep additional damage dice equal to half Strength (rounded down) with two-handed or Samurai weapons.' },
    ]
  },

  'Moto Vindicator': {
    clan: 'Unicorn',
    type: 'Bushi',
    traits: '+1 Willpower',
    honor: 5.5,
    skills: 'Athletics, Defense, Horsemanship, Hunting, Kenjutsu, Lore: Shadowlands, any one Bugei skill',
    techniques: [
      { rank: 1, name: 'Purity of the Breath', effect: 'Each Round choose: reduce Wound TN penalties by School Rank + Willpower, OR add same to Armor TN.' },
      { rank: 2, name: 'Facing the Dark Within', effect: '+2k0 to Investigation rolls (+2k1 when detecting Taint).' },
      { rank: 3, name: 'Justice of Our Ancestors', effect: 'Melee attacks as Simple Action.' },
      { rank: 4, name: 'Avenging Our Own', effect: '+2k0 attack and damage vs. enemies who attacked you this skirmish and vs. any Tainted creatures.' },
      { rank: 5, name: 'Bloodied but Unbowed', effect: 'Once per skirmish (Free Action): add your current Wound TN penalties as a bonus to melee damage for 2 Rounds. Extend 1 Round by taking 10 Wounds.' },
    ]
  },

  'Shinjo Bushi': {
    clan: 'Unicorn',
    type: 'Bushi',
    traits: '+1 Reflexes',
    honor: 5.5,
    skills: 'Athletics, Defense, Horsemanship, Kenjutsu, Kyujutsu, any two Bugei skills',
    techniques: [
      { rank: 1, name: 'The Way of the Ki-Rin', effect: 'When spending Void on School Skill rolls: also add Horsemanship Rank to the total (not in Center Stance).' },
      { rank: 2, name: 'Dance of the Blade', effect: 'In Full Defense: Contested Agility roll to negate a successful attack against you (School Rank times per Round).' },
      { rank: 3, name: 'The Four Winds Strike', effect: 'Attacks as Simple Action with Samurai keyword weapons. While mounted: also Simple Action with bows.' },
      { rank: 4, name: 'Spirit of the Blade Unleashed', effect: 'In Defense/Full Defense: Free Action melee counterattack after being targeted (switches to Attack Stance). School Rank times per skirmish, once per Round.' },
      { rank: 5, name: 'Dancing With the Fortunes', effect: 'While mounted: Void Ring TN 20 as Free Action to gain Void Point benefit without spending one. Uses per skirmish limited to starting Void Points.' },
    ]
  },

  'Utaku Battle Maiden': {
    clan: 'Unicorn',
    type: 'Bushi',
    traits: '+1 Agility',
    honor: 6.5,
    skills: 'Battle, Defense, Horsemanship, Kenjutsu, Polearms, Sincerity, any one Bugei skill',
    techniques: [
      { rank: 1, name: 'Riding in Harmony', effect: 'Add Honor Rank to one attack per Round. While mounted: may apply to damage instead. Add Honor Rank to all Horsemanship rolls.' },
      { rank: 2, name: 'The Void of War', effect: 'Each Round: add 5 to either Initiative or Armor TN (lasts until changed or skirmish ends).' },
      { rank: 3, name: 'Sensing the Breeze', effect: 'While mounted: attacks as Simple Action.' },
      { rank: 4, name: 'Wind Never Stops', effect: 'While mounted: spend Void Point for a charge attack (Simple Action move + attack). +2k1 damage this Turn on hit.' },
      { rank: 5, name: "Otaku's Blessing", effect: 'Spend Void Point as Free Action: add Honor Rank to all damage rolls and Bugei Skill rolls this Turn (stacks with Rank 1).' },
    ]
  },

  // ══════════════════════════════════════
  //  IMPERIAL FAMILIES
  // ══════════════════════════════════════

  'Miya Herald': {
    clan: 'Imperial',
    type: 'Courtier',
    traits: '+1 Awareness',
    honor: 6.5,
    skills: 'Calligraphy, Courtier, Etiquette (Courtesy), Horsemanship, Lore: Heraldry, Sincerity, any one High skill',
    techniques: [
      { rank: 1, name: 'Voice of the Emperor', effect: 'Spend Void for Way of the Land in current province (until sleep). Anyone who knowingly attacks you loses 2x School Rank Honor.' },
      { rank: 2, name: 'Eyes of the Emperor', effect: 'Add Honor Rank to Etiquette (Courtesy) rolls to resist influence.' },
      { rank: 3, name: 'Hand of the Emperor', effect: 'Spend Void: Rokugani who revere the Emperor cannot harm you until next Reactions (only while you are not fighting).' },
      { rank: 4, name: 'Blessing of the Emperor', effect: 'School Rank times/session: Complex Action Contested Courtier (Rhetoric)/Awareness to force honorable samurai to cease aggression for 1 minute.' },
      { rank: 5, name: 'Glory of the Emperor', effect: '+5k0 to Courtier/Etiquette rolls against targets with Honor 1.0+.' },
    ]
  },

  'Otomo Courtier': {
    clan: 'Imperial',
    type: 'Courtier',
    traits: '+1 Awareness',
    honor: 4.5,
    skills: 'Calligraphy, Courtier (Manipulation), Etiquette, Intimidation (Control), Lore: Law, Sincerity, any one High skill',
    techniques: [
      { rank: 1, name: 'The Voice of Heaven', effect: 'No Honor loss for Intimidation (Control). Contested Courtier/Awareness vs. Etiquette/Awareness to provoke conflict between clan members and another faction.' },
      { rank: 2, name: 'Destiny Has No Secrets', effect: 'Spend Void: Courtier/Awareness TN 25 to learn one critical piece of information from your network.' },
      { rank: 3, name: "My Master's Voice", effect: 'Obiesaseru: Complex Action Contested Intimidation/Willpower vs. Etiquette/Willpower. Target cannot obstruct you next Turn (vs. honorable samurai only).' },
      { rank: 4, name: "The Emperor's Protection", effect: 'Gain +3k0 to Social rolls against members of Great Clans. Contested Courtier/Awareness to impose Imperial censure. (Core Book)' },
      { rank: 5, name: 'The Virtues of Command', effect: '+5k0 to Contested Social rolls against those who revere Imperial authority.' },
    ]
  },

  'Seppun Guardsman': {
    clan: 'Imperial',
    type: 'Bushi',
    traits: '+1 Reflexes',
    honor: 6.5,
    skills: 'Battle, Defense, Etiquette, Iaijutsu, Investigation (Notice), Kenjutsu, any one Bugei skill',
    techniques: [
      { rank: 1, name: 'Never in Darkness', effect: 'Add School Rank unkept dice to resist Social rolls that could lead you from duty. +1k1 to Investigation to detect ambush/surprise.' },
      { rank: 2, name: 'The Clouds Part', effect: 'Spend Void at start of Turn: add Honor Rank to attack and damage rolls until next Turn.' },
      { rank: 3, name: "Sun's Light Reveals", effect: 'Add School Rank to Perception for detecting hidden threats. +1k0 to attack rolls vs. dishonorable opponents. (Core Book)' },
      { rank: 4, name: 'Speed of Heaven', effect: 'Attacks as Simple Action with Samurai keyword weapons.' },
      { rank: 5, name: 'Heaven Never Falls', effect: 'Within 20\' of charge: spend Void to intercept any blow/spell targeting them. If still standing after damage, gain an extra Simple Action.' },
    ]
  },

  'Seppun Shugenja': {
    clan: 'Imperial',
    type: 'Shugenja',
    traits: '+1 Awareness',
    honor: 4.5,
    skills: 'Calligraphy (Cipher), Defense, Etiquette, Lore: Theology, Meditation, Spellcraft, any one Skill',
    techniques: [
      { rank: 1, name: 'Voice of the Emperor', effect: 'Affinity: Air. Deficiency: None (no free Deficiency). +1k0 to all defensive/protective spell rolls. May sense spiritual disturbances within School Rank x10 feet. (Core Book)' },
      { rank: 2, name: 'Shield of the Kami', effect: 'Protective spells gain +1 Free Raise. May extend duration of protective spells by spending additional spell slot. (Core Book)' },
      { rank: 3, name: 'Heaven\'s Wrath', effect: 'May spend Void Point to add Honor Rank to Spellcasting roll for spells targeting dishonorable or nonhuman foes. (Core Book)' },
      { rank: 4, name: 'Ward of the Emperor', effect: 'Ward and protective spells may affect additional targets equal to School Rank. +2k0 to all defensive Spellcasting. (Core Book)' },
      { rank: 5, name: 'Grace of the Heavens', effect: 'Once per day: cast any protective/Ward spell without slot expenditure. All Spellcasting rolls gain +1k1. (Core Book)' },
    ]
  },
}
