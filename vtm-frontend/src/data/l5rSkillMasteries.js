// L5R 4th Edition - Skill Mastery Abilities
// Source: lasthaiku.wikidot.com

export const L5R_SKILL_MASTERIES = {
  // ==================== HIGH SKILLS ====================
  'Acting': {
    trait: 'Awareness', type: 'High',
    masteries: {
      3: 'Disguise TN reduced by 5.',
      5: 'Disguise TN reduced by 10 (total).',
      7: 'Disguise TN reduced by 15 (total).',
    }
  },
  'Artisan': {
    trait: 'Awareness', type: 'High',
    masteries: {}
  },
  'Calligraphy': {
    trait: 'Intelligence', type: 'High',
    masteries: {
      5: '+10 bonus when breaking ciphers.',
    }
  },
  'Courtier': {
    trait: 'Awareness', type: 'High',
    masteries: {
      3: '+3 Insight.',
      5: '+1k0 to Contested Courtier rolls.',
      7: '+7 Insight (stacks with Rank 3 bonus).',
    }
  },
  'Divination': {
    trait: 'Intelligence', type: 'High',
    masteries: {
      5: 'Second roll without spending a Void Point.',
    }
  },
  'Etiquette': {
    trait: 'Awareness', type: 'High',
    masteries: {
      3: '+3 Insight.',
      5: '+1k0 to Contested Etiquette rolls.',
      7: '+7 Insight (stacks with Rank 3 bonus).',
    }
  },
  'Games': {
    trait: 'Various', type: 'High',
    masteries: {
      3: '+1k0 in chosen game type.',
      5: '+1k0 in all Games rolls.',
      7: 'Re-roll a single die in any Games roll.',
    }
  },
  'Investigation': {
    trait: 'Perception', type: 'High',
    masteries: {
      3: 'Second Search attempt without TN increase.',
      5: '+5 to Contested Investigation rolls.',
      7: 'Third Search attempt allowed.',
    }
  },
  'Lore': {
    trait: 'Intelligence', type: 'High',
    masteries: {}
  },
  'Medicine': {
    trait: 'Intelligence', type: 'High',
    masteries: {
      5: 'Heal +1k0 additional Wounds on a successful roll.',
    }
  },
  'Meditation': {
    trait: 'Void', type: 'High',
    masteries: {
      3: 'Restores 2 Void Points.',
      5: 'Fasting TN reduced by 5.',
      7: 'Restores 3 Void Points.',
    }
  },
  'Perform': {
    trait: 'Varies', type: 'High',
    masteries: {}
  },
  'Sincerity': {
    trait: 'Awareness', type: 'High',
    masteries: {
      5: '+5 to Contested Sincerity rolls.',
    }
  },
  'Spellcraft': {
    trait: 'Intelligence', type: 'High',
    masteries: {
      5: '+1k0 on Spell Casting Rolls.',
    }
  },
  'Tea Ceremony': {
    trait: 'Void', type: 'High',
    masteries: {
      5: 'All participants regain 2 Void Points instead of 1.',
    }
  },

  // ==================== BUGEI SKILLS ====================
  'Athletics': {
    trait: 'Strength', type: 'Bugei',
    masteries: {
      3: 'Moderate terrain movement penalty reduced by 1.',
      5: '+1k0 on Athletics rolls for movement.',
      7: 'Difficult terrain treated as Moderate.',
    }
  },
  'Battle': {
    trait: 'Perception', type: 'Bugei',
    masteries: {
      5: '+1k0 on Battle rolls to determine winning side.',
      7: 'Gain a Free Raise on first round after winning mass battle roll.',
    }
  },
  'Defense': {
    trait: 'Reflexes', type: 'Bugei',
    masteries: {
      3: '+1k0 to Armor TN when in Defense stance.',
      5: 'Retain Defense bonus for 1 round after leaving Defense stance.',
      7: '+2k0 to Armor TN in Defense stance (replaces Rank 3 bonus).',
    }
  },
  'Horsemanship': {
    trait: 'Agility', type: 'Bugei',
    masteries: {
      3: 'Mount damage reduced by 1k0.',
      5: 'Mount to or dismount as a Free Action.',
      7: 'Full Attack allowed while mounted.',
    }
  },
  'Hunting': {
    trait: 'Perception', type: 'Bugei',
    masteries: {
      3: '+1k0 on Stealth rolls in wilderness.',
      5: '+1k0 on Survival rolls for tracking.',
      7: 'No movement penalty in natural terrain.',
    }
  },
  'Iaijutsu': {
    trait: 'Reflexes', type: 'Bugei',
    masteries: {
      3: '+5 to Assessment rolls.',
      5: 'Draw and attack as a Simple Action.',
      7: '+10 total to Assessment rolls.',
    }
  },
  'Jiujutsu': {
    trait: 'Agility', type: 'Bugei',
    masteries: {
      3: 'Unarmed damage +0k1 (total 0k2).',
      5: '+1k0 on grapple rolls.',
      7: 'Unarmed damage +1k0 (total 1k2).',
    }
  },
  'Kenjutsu': {
    trait: 'Agility', type: 'Bugei',
    masteries: {
      3: '+1k0 damage with swords.',
      5: 'Ready a sword as a Free Action.',
      7: '+1k0 attack rolls with swords.',
    }
  },
  'Kyujutsu': {
    trait: 'Reflexes', type: 'Bugei',
    masteries: {
      3: '+1 Strength for bow damage.',
      5: 'String/unstring bow as a Free Action.',
      7: '+1 additional Strength for bow damage.',
    }
  },
  'Heavy Weapons': {
    trait: 'Agility', type: 'Bugei',
    masteries: {
      3: 'Ignore 2 Reduction on targets.',
      5: '+1k0 damage with heavy weapons.',
      7: 'Ignore 4 Reduction on targets.',
    }
  },
  'Knives': {
    trait: 'Agility', type: 'Bugei',
    masteries: {
      3: '+2 to TN to be Disarmed.',
      5: 'Ready a knife as a Free Action.',
      7: 'Off-hand penalty reduced by 3.',
    }
  },
  'Chain Weapons': {
    trait: 'Agility', type: 'Bugei',
    masteries: {
      3: '+1k0 to grapple attempts.',
      5: '+5 to TN to be Disarmed.',
    }
  },
  'Naginata': {
    trait: 'Agility', type: 'Bugei',
    masteries: {
      3: '+1k0 damage while in Defense stance.',
      5: '+2 ATN while wielding naginata.',
    }
  },
  'Polearms': {
    trait: 'Agility', type: 'Bugei',
    masteries: {
      3: '+3 ATN against charges.',
      5: '+1k0 damage vs mounted opponents.',
    }
  },
  'Spears': {
    trait: 'Agility', type: 'Bugei',
    masteries: {
      3: '+5 to thrown attack range.',
      5: '+1k0 to damage on charge attacks.',
    }
  },
  'Staves': {
    trait: 'Agility', type: 'Bugei',
    masteries: {
      3: '+3 ATN while wielding staff.',
      5: "Opponent's maneuver Raises cost +1 each.",
    }
  },
  'War Fan': {
    trait: 'Agility', type: 'Bugei',
    masteries: {
      3: '+3 ATN while wielding war fan.',
      5: 'Can parry ranged attacks (TN 25).',
    }
  },

  // ==================== MERCHANT SKILLS ====================
  'Animal Handling': {
    trait: 'Awareness', type: 'Merchant',
    masteries: {
      3: 'Commonly domesticated animals may be trained.',
      5: 'Animals can attack on command.',
      7: 'Non-verbal commands.',
    }
  },
  'Commerce': {
    trait: 'Intelligence', type: 'Merchant',
    masteries: {
      3: '+1k0 on Commerce rolls for appraising.',
      5: 'Always know approximate value of goods.',
    }
  },
  'Craft': {
    trait: 'Varies', type: 'Merchant',
    masteries: {
      3: '+5 to crafting TN when creating items for trade.',
    }
  },
  'Engineering': {
    trait: 'Intelligence', type: 'Merchant',
    masteries: {
      5: 'Construction time reduced by 10%.',
    }
  },
  'Sailing': {
    trait: 'Agility', type: 'Merchant',
    masteries: {
      3: '+5 to Sailing rolls in rough weather.',
      5: '+1k0 on Sailing rolls for combat maneuvers.',
    }
  },

  // ==================== LOW SKILLS ====================
  'Forgery': {
    trait: 'Agility', type: 'Low',
    masteries: {
      3: '+1k0 to Forgery result for detection TN.',
      5: '+1k0 detecting others\' forgeries.',
      7: '+0k1 (total +1k1) to detection TN.',
    }
  },
  'Intimidation': {
    trait: 'Willpower', type: 'Low',
    masteries: {
      3: '+5 to Contested Intimidation rolls.',
      5: 'Use Intimidation to demoralize groups.',
    }
  },
  'Sleight of Hand': {
    trait: 'Agility', type: 'Low',
    masteries: {
      3: '+1k0 to Sleight of Hand when concealing.',
      5: 'Concealed items provide no evidence when searched.',
    }
  },
  'Stealth': {
    trait: 'Agility', type: 'Low',
    masteries: {
      3: '+1k0 when using Stealth at night.',
      5: 'May use Stealth in moderate cover.',
      7: 'No penalty in Simple Move stealth.',
    }
  },
  'Temptation': {
    trait: 'Awareness', type: 'Low',
    masteries: {
      3: '+1k0 to Contested Temptation rolls.',
      5: '+5 to seduction/bribery attempts.',
    }
  },
};
