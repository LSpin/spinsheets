// Elder Scrolls RPG data — races, classes, backgrounds, skills, constellations

export const UESTRPG_RACES = {
  Altmer: {
    description: "High Elves of the Summerset Isles, renowned for their mastery of magic and arcane arts.",
    abilityBonuses: "+2 INT",
    speed: 30,
    traits: ["Highborn (Magicka Regeneration)", "Fortify Magicka"],
    subraces: []
  },
  Argonian: {
    description: "Reptilian natives of Black Marsh, resistant to disease and capable of breathing underwater.",
    abilityBonuses: "+2 END, +1 AGI",
    speed: 30,
    traits: ["Histskin (Health Regeneration)", "Resist Disease", "Waterbreathing"],
    subraces: []
  },
  Bosmer: {
    description: "Wood Elves of Valenwood, expert archers and scouts with a deep connection to nature.",
    abilityBonuses: "+2 AGI, +1 END",
    speed: 30,
    traits: ["Command Animal", "Resist Disease", "Resist Poison"],
    subraces: []
  },
  Breton: {
    description: "Manmer of High Rock, gifted with natural magical resistance and aptitude for the arcane.",
    abilityBonuses: "+2 WIL, +1 INT",
    speed: 30,
    traits: ["Dragonskin (Spell Absorption)", "Magic Resistance"],
    subraces: []
  },
  Dunmer: {
    description: "Dark Elves of Morrowind, hardy and intelligent with natural fire resistance.",
    abilityBonuses: "+2 INT, +1 WIL",
    speed: 30,
    traits: ["Ancestor's Wrath (Fire Cloak)", "Resist Fire"],
    subraces: []
  },
  Imperial: {
    description: "Natives of Cyrodiil, charismatic diplomats and disciplined soldiers of the Empire.",
    abilityBonuses: "+2 PER, +1 END",
    speed: 30,
    traits: ["Voice of the Emperor (Calm)", "Imperial Luck"],
    subraces: []
  },
  Khajiit: {
    description: "Feline people of Elsweyr, agile and cunning with keen night vision.",
    abilityBonuses: "+2 AGI, +1 PER",
    speed: 35,
    traits: ["Night Eye", "Claws (Unarmed Bonus)"],
    subraces: []
  },
  Nord: {
    description: "Fierce warriors of Skyrim, resistant to cold and fearless in battle.",
    abilityBonuses: "+2 STR, +1 END",
    speed: 30,
    traits: ["Battle Cry (Fear)", "Resist Frost"],
    subraces: []
  },
  Orc: {
    description: "Orsimer of the Wrothgarian Mountains, powerful warriors with a code of honor.",
    abilityBonuses: "+2 STR, +1 END",
    speed: 30,
    traits: ["Berserker Rage", "Stronghold Kinship"],
    subraces: []
  },
  Redguard: {
    description: "Warriors of Hammerfell, naturally talented swordsmen with incredible stamina.",
    abilityBonuses: "+2 END, +1 STR",
    speed: 30,
    traits: ["Adrenaline Rush (Stamina Regeneration)", "Resist Poison"],
    subraces: []
  }
};

export const UESTRPG_RACE_CATALOG = Object.entries(UESTRPG_RACES).map(([key, val]) => ({
  value: key,
  description: val.description
}));

export const UESTRPG_CLASSES = {
  Warrior: {
    description: "A battle-hardened combatant trained in heavy weapons and armor.",
    hitDie: 12,
    primaryAbility: "Strength",
    savingThrows: ["Strength", "Endurance"],
    armorProf: ["Light armor", "Medium armor", "Heavy armor", "Shields"],
    weaponProf: ["Simple weapons", "Martial weapons"],
    subclassName: "Specialization",
    subclasses: [
      { value: "Knight", description: "A disciplined warrior sworn to a lord or cause" },
      { value: "Barbarian", description: "A savage fighter fueled by rage and instinct" },
      { value: "Crusader", description: "A holy warrior who combines combat with restoration magic" }
    ],
    spellcasting: null
  },
  Thief: {
    description: "A cunning rogue who relies on stealth, agility, and guile.",
    hitDie: 8,
    primaryAbility: "Agility",
    savingThrows: ["Agility", "Personality"],
    armorProf: ["Light armor"],
    weaponProf: ["Simple weapons", "Short blades", "Bows"],
    subclassName: "Specialization",
    subclasses: [
      { value: "Agent", description: "A spy and infiltrator skilled in deception" },
      { value: "Assassin", description: "A killer who strikes from the shadows" },
      { value: "Nightblade", description: "A stealthy operative who uses magic to supplement stealth" }
    ],
    spellcasting: null
  },
  Mage: {
    description: "A scholar of the arcane arts who wields powerful magic.",
    hitDie: 6,
    primaryAbility: "Intelligence",
    savingThrows: ["Intelligence", "Willpower"],
    armorProf: ["Robes"],
    weaponProf: ["Staves", "Daggers"],
    subclassName: "School",
    subclasses: [
      { value: "Sorcerer", description: "A mage who focuses on raw destructive power" },
      { value: "Healer", description: "A mage devoted to restoration and protection" },
      { value: "Battlemage", description: "A war mage who combines spellcraft with combat" },
      { value: "Spellsword", description: "A versatile mage who wields blade and spell equally" }
    ],
    spellcasting: { ability: "Intelligence", known: true }
  },
  Scout: {
    description: "A wilderness expert skilled in archery, tracking, and survival.",
    hitDie: 10,
    primaryAbility: "Agility",
    savingThrows: ["Agility", "Endurance"],
    armorProf: ["Light armor", "Medium armor"],
    weaponProf: ["Simple weapons", "Bows", "Short blades"],
    subclassName: "Specialization",
    subclasses: [
      { value: "Ranger", description: "A wilderness protector who patrols the frontier" },
      { value: "Archer", description: "A master marksman with unrivaled precision" },
      { value: "Monk", description: "A disciplined martial artist who channels inner energy" }
    ],
    spellcasting: null
  },
  Templar: {
    description: "A holy warrior who channels divine magic through faith and martial prowess.",
    hitDie: 10,
    primaryAbility: "Willpower",
    savingThrows: ["Willpower", "Personality"],
    armorProf: ["Light armor", "Medium armor", "Heavy armor", "Shields"],
    weaponProf: ["Simple weapons", "Martial weapons"],
    subclassName: "Order",
    subclasses: [
      { value: "Paladin", description: "A holy knight devoted to justice and divine law" },
      { value: "Pilgrim", description: "A wandering priest who spreads faith across the land" },
      { value: "Witchhunter", description: "A specialist trained to track and destroy mages and daedra" }
    ],
    spellcasting: { ability: "Willpower", known: false }
  },
  Nightblade: {
    description: "A shadowy spellcaster who blends magic with stealth and subterfuge.",
    hitDie: 8,
    primaryAbility: "Intelligence",
    savingThrows: ["Intelligence", "Agility"],
    armorProf: ["Light armor"],
    weaponProf: ["Simple weapons", "Short blades"],
    subclassName: "Discipline",
    subclasses: [
      { value: "Shadowmage", description: "A mage who weaves illusion and shadow magic" },
      { value: "Blade", description: "An imperial agent who combines magic with swordplay" }
    ],
    spellcasting: { ability: "Intelligence", known: true }
  }
};

export const UESTRPG_CLASS_CATALOG = Object.entries(UESTRPG_CLASSES).map(([key, val]) => ({
  value: key,
  description: val.description
}));

export const UESTRPG_BACKGROUNDS = [
  { value: "Guild Member", description: "You belong to one of the great guilds: Fighters, Mages, or Thieves.", feature: "Guild Resources" },
  { value: "Soldier", description: "You served in a provincial army or the Imperial Legion.", feature: "Military Rank" },
  { value: "Scholar", description: "You studied at the Arcane University or a similar institution of learning.", feature: "Academic Access" },
  { value: "Noble", description: "You were born into one of Tamriel's great houses or noble families.", feature: "Position of Privilege" },
  { value: "Outlander", description: "You grew up in the wilds, far from the cities and settlements.", feature: "Wanderer" },
  { value: "Criminal", description: "You have ties to the criminal underworld, perhaps the Thieves Guild or Dark Brotherhood.", feature: "Criminal Contact" },
  { value: "Merchant", description: "You are a trader who has traveled the trade routes of Tamriel.", feature: "Trade Connections" },
  { value: "Priest", description: "You serve the Divines, the Tribunal, or another faith of Tamriel.", feature: "Shelter of the Faithful" },
  { value: "Sailor", description: "You sailed the seas of Tamriel, perhaps with the East Empire Company.", feature: "Ship's Passage" },
  { value: "Prisoner", description: "You were imprisoned — your past is dark, but destiny has freed you.", feature: "Streetwise" },
  { value: "Adventurer", description: "You are a wandering sword-for-hire, delving into ruins for treasure and glory.", feature: "Dungeon Delver" },
  { value: "Tribesman", description: "You belong to one of Tamriel's tribal peoples: Ashlanders, Reachmen, or similar.", feature: "Tribal Knowledge" }
];

export const UESTRPG_ALIGNMENTS = [
  { value: "Lawful Good", description: "Upholds law and justice — a true servant of the Divines" },
  { value: "Neutral Good", description: "Does what is right regardless of law or chaos" },
  { value: "Chaotic Good", description: "Values freedom and acts on conscience above all" },
  { value: "Lawful Neutral", description: "Follows codes and traditions without moral bias" },
  { value: "True Neutral", description: "Maintains balance, avoids extremes" },
  { value: "Chaotic Neutral", description: "Follows whims, values personal freedom above all" },
  { value: "Lawful Evil", description: "Uses law and order as tools to dominate others" },
  { value: "Neutral Evil", description: "Does whatever they can get away with" },
  { value: "Chaotic Evil", description: "Spreads destruction and chaos without remorse" }
];

export const UESTRPG_CONSTELLATION_CATALOG = [
  { value: "The Warrior", description: "Those born under the Warrior are skilled with weapons. The Warrior's charges are the Lady, the Steed, and the Lord." },
  { value: "The Mage", description: "Those born under the Mage have increased Magicka. The Mage's charges are the Apprentice, the Atronach, and the Ritual." },
  { value: "The Thief", description: "Those born under the Thief are harder to detect and luckier. The Thief's charges are the Lover, the Shadow, and the Tower." },
  { value: "The Serpent", description: "The Serpent wanders, has no season, and is not guardian. Those born under it can poison others at the cost of their own health." },
  { value: "The Lady", description: "Those born under the Lady gain increased Willpower and Endurance." },
  { value: "The Steed", description: "Those born under the Steed gain increased Speed and carry weight." },
  { value: "The Lord", description: "Those born under the Lord gain a healing spell but are weak to fire." },
  { value: "The Apprentice", description: "Those born under the Apprentice gain a spell absorption power but have increased Magicka weakness." },
  { value: "The Atronach", description: "Those born under the Atronach gain a large Magicka bonus and spell absorption but cannot regenerate Magicka naturally." },
  { value: "The Ritual", description: "Those born under the Ritual can turn undead and restore health once per day." },
  { value: "The Lover", description: "Those born under the Lover can paralyze others with a kiss at the cost of fatigue." },
  { value: "The Shadow", description: "Those born under the Shadow can become invisible once per day." },
  { value: "The Tower", description: "Those born under the Tower can unlock doors and detect nearby objects." }
];

export const UESTRPG_SKILLS = [
  { value: "Acrobatics", ability: "Agility", description: "Tumbling, jumping, and dodging" },
  { value: "Alchemy", ability: "Intelligence", description: "Brewing potions and identifying ingredients" },
  { value: "Alteration", ability: "Willpower", description: "Spells that alter the physical world" },
  { value: "Armorer", ability: "Endurance", description: "Repairing and maintaining weapons and armor" },
  { value: "Athletics", ability: "Strength", description: "Running, swimming, and climbing" },
  { value: "Blade", ability: "Strength", description: "Fighting with swords and daggers" },
  { value: "Block", ability: "Endurance", description: "Deflecting attacks with shields or weapons" },
  { value: "Blunt", ability: "Strength", description: "Fighting with maces, hammers, and axes" },
  { value: "Conjuration", ability: "Intelligence", description: "Summoning Daedra and undead" },
  { value: "Destruction", ability: "Willpower", description: "Spells that deal elemental damage" },
  { value: "Enchanting", ability: "Intelligence", description: "Imbuing items with magical effects" },
  { value: "Hand to Hand", ability: "Strength", description: "Unarmed combat and martial arts" },
  { value: "Heavy Armor", ability: "Endurance", description: "Wearing and moving in heavy armor" },
  { value: "Illusion", ability: "Personality", description: "Spells of charm, fear, and invisibility" },
  { value: "Light Armor", ability: "Agility", description: "Wearing and moving in light armor" },
  { value: "Lockpicking", ability: "Agility", description: "Opening locks without keys" },
  { value: "Marksman", ability: "Agility", description: "Using bows and crossbows" },
  { value: "Mercantile", ability: "Personality", description: "Bartering and trading" },
  { value: "Mysticism", ability: "Intelligence", description: "Spells of soul trapping and teleportation" },
  { value: "Persuasion", ability: "Personality", description: "Influencing and convincing others" },
  { value: "Restoration", ability: "Willpower", description: "Healing and protective spells" },
  { value: "Security", ability: "Agility", description: "Disarming traps and bypassing security" },
  { value: "Sneak", ability: "Agility", description: "Moving silently and remaining undetected" },
  { value: "Speechcraft", ability: "Personality", description: "Rhetoric, intimidation, and performance" },
  { value: "Survival", ability: "Endurance", description: "Tracking, foraging, and navigating the wilderness" }
];

export const UESTRPG_SPELLCASTING_ABILITIES = [
  { value: "Intelligence", description: "Mage, Nightblade, Sorcerer" },
  { value: "Willpower", description: "Templar, Healer, Crusader" },
  { value: "Personality", description: "Bard, Witchhunter" }
];
