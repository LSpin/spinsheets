// L5R 4th Edition - Skill Mastery Abilities
// Source: lasthaiku.wikidot.com

export const L5R_SKILL_MASTERIES = {
  // ==================== HIGH SKILLS ====================
  'Acting': {
    trait: 'Awareness', type: 'High',
    emphases: ['Clan', 'Gender', 'Profession'],
    masteries: {
      3: 'Disguise TN reduced by 5.',
      5: 'Disguise TN reduced by 10 (total).',
      7: 'Disguise TN reduced by 15 (total).',
    }
  },
  'Artisan': {
    trait: 'Awareness', type: 'High',
    emphases: ['Bonsai', 'Gardening', 'Ikebana', 'Origami', 'Painting', 'Poetry', 'Sculpture', 'Tattooing'],
    masteries: {}
  },
  'Calligraphy': {
    trait: 'Intelligence', type: 'High',
    emphases: ['Cipher', 'High Rokugani'],
    masteries: {
      5: '+10 bonus when breaking ciphers.',
    }
  },
  'Courtier': {
    trait: 'Awareness', type: 'High',
    emphases: ['Gossip', 'Manipulation', 'Rhetoric'],
    masteries: {
      3: '+3 Insight.',
      5: '+1k0 to Contested Courtier rolls.',
      7: '+7 Insight (stacks with Rank 3 bonus).',
    }
  },
  'Divination': {
    trait: 'Intelligence', type: 'High',
    emphases: ['Astrology', 'Kawaru'],
    masteries: {
      5: 'Second roll without spending a Void Point.',
    }
  },
  'Etiquette': {
    trait: 'Awareness', type: 'High',
    emphases: ['Bureaucracy', 'Conversation', 'Courtesy'],
    masteries: {
      3: '+3 Insight.',
      5: '+1k0 to Contested Etiquette rolls.',
      7: '+7 Insight (stacks with Rank 3 bonus).',
    }
  },
  'Games': {
    trait: 'Various', type: 'High',
    emphases: ['Go', 'Kemari', 'Letters', 'Sadane', 'Shogi'],
    masteries: {
      3: '+1k0 in chosen game type.',
      5: '+1k0 in all Games rolls.',
      7: 'Re-roll a single die in any Games roll.',
    }
  },
  'Investigation': {
    trait: 'Perception', type: 'High',
    emphases: ['Interrogation', 'Notice', 'Search'],
    masteries: {
      3: 'Second Search attempt without TN increase.',
      5: '+5 to Contested Investigation rolls.',
      7: 'Third Search attempt allowed.',
    }
  },
  'Lore': {
    trait: 'Intelligence', type: 'High',
    emphases: ['Bushido', 'Heraldry', 'History', 'Shadowlands', 'Spirit Realms', 'Theology', 'War'],
    masteries: {}
  },
  'Medicine': {
    trait: 'Intelligence', type: 'High',
    emphases: ['Antidotes', 'Disease', 'Herbalism', 'Non-Humans', 'Wound Treatment'],
    masteries: {
      5: 'Heal +1k0 additional Wounds on a successful roll.',
    }
  },
  'Meditation': {
    trait: 'Void', type: 'High',
    emphases: ['Fasting', 'Void Recovery'],
    masteries: {
      3: 'Restores 2 Void Points.',
      5: 'Fasting TN reduced by 5.',
      7: 'Restores 3 Void Points.',
    }
  },
  'Perform': {
    trait: 'Varies', type: 'High',
    emphases: ['Biwa', 'Dance', 'Drums', 'Flute', 'Oratory', 'Singing', 'Storytelling'],
    masteries: {}
  },
  'Sincerity': {
    trait: 'Awareness', type: 'High',
    emphases: ['Honesty', 'Deceit'],
    masteries: {
      5: '+5 to Contested Sincerity rolls.',
    }
  },
  'Spellcraft': {
    trait: 'Intelligence', type: 'High',
    emphases: ['Importune', 'Spell Research'],
    masteries: {
      5: '+1k0 on Spell Casting Rolls.',
    }
  },
  'Tea Ceremony': {
    trait: 'Void', type: 'High',
    emphases: [],
    masteries: {
      5: 'All participants regain 2 Void Points instead of 1.',
    }
  },

  // ==================== BUGEI SKILLS ====================
  'Athletics': {
    trait: 'Strength', type: 'Bugei',
    emphases: ['Climbing', 'Running', 'Swimming', 'Throwing'],
    masteries: {
      3: 'Moderate terrain movement penalty reduced by 1.',
      5: '+1k0 on Athletics rolls for movement.',
      7: 'Difficult terrain treated as Moderate.',
    }
  },
  'Battle': {
    trait: 'Perception', type: 'Bugei',
    emphases: ['Mass Combat', 'Skirmish'],
    masteries: {
      5: '+1k0 on Battle rolls to determine winning side.',
      7: 'Gain a Free Raise on first round after winning mass battle roll.',
    }
  },
  'Defense': {
    trait: 'Reflexes', type: 'Bugei',
    emphases: [],
    masteries: {
      3: '+1k0 to Armor TN when in Defense stance.',
      5: 'Retain Defense bonus for 1 round after leaving Defense stance.',
      7: '+2k0 to Armor TN in Defense stance (replaces Rank 3 bonus).',
    }
  },
  'Horsemanship': {
    trait: 'Agility', type: 'Bugei',
    emphases: ['Gaijin Riding Horse', 'Rokugani Pony', 'Utaku Steed'],
    masteries: {
      3: 'Mount damage reduced by 1k0.',
      5: 'Mount to or dismount as a Free Action.',
      7: 'Full Attack allowed while mounted.',
    }
  },
  'Hunting': {
    trait: 'Perception', type: 'Bugei',
    emphases: ['Survival', 'Tracking', 'Trailblazing'],
    masteries: {
      3: '+1k0 on Stealth rolls in wilderness.',
      5: '+1k0 on Survival rolls for tracking.',
      7: 'No movement penalty in natural terrain.',
    }
  },
  'Iaijutsu': {
    trait: 'Reflexes', type: 'Bugei',
    emphases: ['Assessment', 'Focus'],
    masteries: {
      3: '+5 to Assessment rolls.',
      5: 'Draw and attack as a Simple Action.',
      7: '+10 total to Assessment rolls.',
    }
  },
  'Jiujutsu': {
    trait: 'Agility', type: 'Bugei',
    emphases: ['Grappling', 'Improvised Weapons', 'Martial Arts'],
    masteries: {
      3: 'Unarmed damage +0k1 (total 0k2).',
      5: '+1k0 on grapple rolls.',
      7: 'Unarmed damage +1k0 (total 1k2).',
    }
  },
  'Kenjutsu': {
    trait: 'Agility', type: 'Bugei',
    emphases: ['Katana', 'Ninja-to', 'No-dachi', 'Parangu', 'Scimitar', 'Wakizashi'],
    masteries: {
      3: '+1k0 damage with swords.',
      5: 'Ready a sword as a Free Action.',
      7: '+1k0 attack rolls with swords.',
    }
  },
  'Kyujutsu': {
    trait: 'Reflexes', type: 'Bugei',
    emphases: ['Dai-kyu', 'Han-kyu', 'Yumi'],
    masteries: {
      3: '+1 Strength for bow damage.',
      5: 'String/unstring bow as a Free Action.',
      7: '+1 additional Strength for bow damage.',
    }
  },
  'Heavy Weapons': {
    trait: 'Agility', type: 'Bugei',
    emphases: ['Dai Tsuchi', 'Masakari', 'Ono', 'Tetsubo'],
    masteries: {
      3: 'Ignore 2 Reduction on targets.',
      5: '+1k0 damage with heavy weapons.',
      7: 'Ignore 4 Reduction on targets.',
    }
  },
  'Knives': {
    trait: 'Agility', type: 'Bugei',
    emphases: ['Aiguchi', 'Jitte', 'Kama', 'Sai', 'Tanto'],
    masteries: {
      3: '+2 to TN to be Disarmed.',
      5: 'Ready a knife as a Free Action.',
      7: 'Off-hand penalty reduced by 3.',
    }
  },
  'Chain Weapons': {
    trait: 'Agility', type: 'Bugei',
    emphases: ['Kusarigama', 'Kyoketsu-shogi', 'Manrikikusari'],
    masteries: {
      3: '+1k0 to grapple attempts.',
      5: '+5 to TN to be Disarmed.',
    }
  },
  'Naginata': {
    trait: 'Agility', type: 'Bugei',
    emphases: ['Bisento', 'Nagamaki', 'Naginata', 'Sasumata'],
    masteries: {
      3: '+1k0 damage while in Defense stance.',
      5: '+2 ATN while wielding naginata.',
    }
  },
  'Polearms': {
    trait: 'Agility', type: 'Bugei',
    emphases: ['Bisento', 'Nagamaki', 'Naginata', 'Sasumata', 'Sodegarami'],
    masteries: {
      3: '+3 ATN against charges.',
      5: '+1k0 damage vs mounted opponents.',
    }
  },
  'Spears': {
    trait: 'Agility', type: 'Bugei',
    emphases: ['Mai Chong', 'Kumade', 'Lance', 'Nage-yari', 'Yari'],
    masteries: {
      3: '+5 to thrown attack range.',
      5: '+1k0 to damage on charge attacks.',
    }
  },
  'Staves': {
    trait: 'Agility', type: 'Bugei',
    emphases: ['Bo', 'Jo', 'Tonfa'],
    masteries: {
      3: '+3 ATN while wielding staff.',
      5: "Opponent's maneuver Raises cost +1 each.",
    }
  },
  'War Fan': {
    trait: 'Agility', type: 'Bugei',
    emphases: [],
    masteries: {
      3: '+3 ATN while wielding war fan.',
      5: 'Can parry ranged attacks (TN 25).',
    }
  },

  // ==================== MERCHANT SKILLS ====================
  'Animal Handling': {
    trait: 'Awareness', type: 'Merchant',
    emphases: ['Dogs', 'Horses', 'Falcons'],
    masteries: {
      3: 'Commonly domesticated animals may be trained.',
      5: 'Animals can attack on command.',
      7: 'Non-verbal commands.',
    }
  },
  'Commerce': {
    trait: 'Intelligence', type: 'Merchant',
    emphases: ['Appraisal', 'Mathematics'],
    masteries: {
      3: '+1k0 on Commerce rolls for appraising.',
      5: 'Always know approximate value of goods.',
    }
  },
  'Craft': {
    trait: 'Varies', type: 'Merchant',
    emphases: ['Armorsmithing', 'Blacksmithing', 'Bowyer', 'Brewing', 'Carpentry', 'Cartography', 'Cooking', 'Farming', 'Fishing', 'Mining', 'Pottery', 'Shipbuilding', 'Tailoring', 'Weaponsmithing', 'Weaving'],
    masteries: {
      3: '+5 to crafting TN when creating items for trade.',
    }
  },
  'Engineering': {
    trait: 'Intelligence', type: 'Merchant',
    emphases: ['Construction', 'Siege'],
    masteries: {
      5: 'Construction time reduced by 10%.',
    }
  },
  'Sailing': {
    trait: 'Agility', type: 'Merchant',
    emphases: ['Knot-work', 'Navigation'],
    masteries: {
      3: '+5 to Sailing rolls in rough weather.',
      5: '+1k0 on Sailing rolls for combat maneuvers.',
    }
  },

  // ==================== LOW SKILLS ====================
  'Forgery': {
    trait: 'Agility', type: 'Low',
    emphases: ['Artwork', 'Documents', 'Personal Seals'],
    masteries: {
      3: '+1k0 to Forgery result for detection TN.',
      5: '+1k0 detecting others\' forgeries.',
      7: '+0k1 (total +1k1) to detection TN.',
    }
  },
  'Intimidation': {
    trait: 'Willpower', type: 'Low',
    emphases: ['Bullying', 'Control', 'Torture'],
    masteries: {
      3: '+5 to Contested Intimidation rolls.',
      5: 'Use Intimidation to demoralize groups.',
    }
  },
  'Sleight of Hand': {
    trait: 'Agility', type: 'Low',
    emphases: ['Conceal', 'Escape', 'Pick Pocket', 'Prestidigitation'],
    masteries: {
      3: '+1k0 to Sleight of Hand when concealing.',
      5: 'Concealed items provide no evidence when searched.',
    }
  },
  'Stealth': {
    trait: 'Agility', type: 'Low',
    emphases: ['Ambush', 'Shadowing', 'Sneaking', 'Spell Casting'],
    masteries: {
      3: '+1k0 when using Stealth at night.',
      5: 'May use Stealth in moderate cover.',
      7: 'No penalty in Simple Move stealth.',
    }
  },
  'Temptation': {
    trait: 'Awareness', type: 'Low',
    emphases: ['Bribery', 'Seduction'],
    masteries: {
      3: '+1k0 to Contested Temptation rolls.',
      5: '+5 to seduction/bribery attempts.',
    }
  },
};
