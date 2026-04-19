// UESTRPG - Unofficial Elder Scrolls Tabletop RPG (5e conversion)

export const UESTRPG_RACES = {
  "Altmer (High Elf)": {
    description: "Proud and graceful elves from the Summerset Isles, renowned for their magical aptitude.",
    abilityBonuses: "+2 INT, +1 WIL",
    speed: 30,
    traits: ["Altmer Blood (advantage on saves vs disease)", "Highborn (innate magicka pool)", "Studious Nature (proficiency in two from Arcana, History, Nature, Religion)"],
    subraces: []
  },
  Argonian: {
    description: "Reptilian natives of the Black Marsh with a deep connection to the Hist.",
    abilityBonuses: "+2 AGI, +1 INT",
    speed: "30 (swim 40)",
    traits: ["Argonian Combat Proficiency (Short Blades, Spears)", "Argonian Resilience (advantage vs disease)", "Bite (1d6 + STR piercing)", "Histskin (heal using Hit Dice as action)", "Protective Scales (natural AC 12 + AGI mod)", "Water-breathing"],
    subraces: []
  },
  "Bosmer (Wood Elf)": {
    description: "Elven clan-folk from the forests of Valenwood, skilled archers and scouts.",
    abilityBonuses: "+2 AGI, +1 WIL",
    speed: 35,
    traits: ["Beast Tongue (Speak with Animals)", "Bosmer Blood (advantage vs poison, poison resistance)", "Bosmer Combat Training (Acrobatics, Marksman weapons)", "Y'ffre's Gift (warden cantrip + Animal Friendship)"],
    subraces: []
  },
  Breton: {
    description: "Half-elven people of High Rock, naturally resistant to magic.",
    abilityBonuses: "+1 INT, +1 PER",
    speed: 30,
    traits: ["Breton Ancestry (Willpower proficiency, Arcana, mage cantrip)", "Conjure Familiar (cast Find Familiar once/long rest)", "Dragon Skin (cast Shield as reaction when hit)", "Magic Resistance (reduce spell damage by proficiency mod)"],
    subraces: []
  },
  "Dunmer (Dark Elf)": {
    description: "Ashen-skinned elves from Morrowind, known for their versatility and resilience.",
    abilityBonuses: "+1 STR, +1 AGI, +1 INT",
    speed: 30,
    traits: ["Ancestor Guardian (advantage on saves vs spells as reaction)", "Ashlander (fire resistance)", "Dunmer Combat Training (Long Blade, Marksman, Short Blade)"],
    subraces: []
  },
  Imperial: {
    description: "Educated and disciplined humans from Cyrodiil, skilled diplomats and soldiers.",
    abilityBonuses: "+2 PER, +1 STR",
    speed: 30,
    traits: ["Diplomat (Persuasion proficiency)", "Imperial Cunning (advantage on INT/PER/WIL save as reaction)", "Imperial Luck (two d6 Luck Dice)", "Legion Combat Training (Blunt, Hand-to-Hand, Long Blade)"],
    subraces: [
      { value: "Colovian Imperial", description: "Hardy westerners who push past exhaustion", abilityBonuses: "+1 STR instead" },
      { value: "Nibenese Imperial", description: "Eastern cosmopolitan scholars and merchants", abilityBonuses: "+1 INT instead" }
    ]
  },
  Khajiit: {
    description: "Feline humanoids from Elsweyr, known for their grace, agility, and intellect.",
    abilityBonuses: "+2 AGI",
    speed: 35,
    traits: ["Eye of Fear (Intimidation proficiency)", "Eye of Night (darkvision 60 ft)", "Quick Claws (1d4 + STR slashing, climb speed 20)"],
    subraces: [
      { value: "Cathay", description: "Larger jaguar-like breed with powerful builds", abilityBonuses: "+1 STR" },
      { value: "Dagi", description: "Small forest-dwellers with natural magical talent", abilityBonuses: "+1 INT" },
      { value: "Ohmes", description: "Elven-looking breed, natural ambassadors", abilityBonuses: "+1 PER" },
      { value: "Suthay", description: "Most common breed with feline agility", abilityBonuses: "+1 END" }
    ]
  },
  Nord: {
    description: "Tall and hardy humans from Skyrim, fierce warriors and sailors.",
    abilityBonuses: "+1 STR, +2 END",
    speed: 30,
    traits: ["Battlecry (frighten a creature within 60 ft)", "Nordic Blood (cold resistance)", "Nord Combat Proficiency (Axes, Spears)"],
    subraces: []
  },
  "Orsimer (Orc)": {
    description: "The Pariah Folk, unshakable warriors from the Wrothgarian Mountains.",
    abilityBonuses: "+2 STR",
    speed: 25,
    traits: ["Aggressive (bonus action move toward enemy)", "Berserk (temp HP and advantage for 1 minute)", "Blood-Kin", "Menacing (Intimidation proficiency)", "Powerful Build"],
    subraces: [
      { value: "City Orc", description: "Cosmopolitan orcs with Orcish Resilience (force resistance)", abilityBonuses: "+1 INT" },
      { value: "Wild Orc", description: "Traditional stronghold orcs with powerful builds", abilityBonuses: "+1 END" }
    ]
  },
  Redguard: {
    description: "Natural warriors from Hammerfell, descendants of the Yokudans.",
    abilityBonuses: "+1 STR, +1 AGI, +1 END",
    speed: 30,
    traits: ["Adrenaline Rush (+10 initiative, +10 speed, +d4 to attacks/damage)", "Redguard Combat Training (Long Blade, Short Blade)", "Yokudan Heritage (advantage vs disease)"],
    subraces: []
  }
};

export const UESTRPG_RACE_CATALOG = Object.entries(UESTRPG_RACES).map(([key, val]) => ({
  value: key,
  description: val.description
}));

export const UESTRPG_CLASSES = {
  Barbarian: {
    description: "A fierce fighter of primitive background who can deflect attacks and deal brutal strikes.",
    hitDie: 12,
    primaryAbility: "Strength",
    savingThrows: ["Strength", "Endurance"],
    subclassName: "Primal Path",
    subclasses: [],
    spellcasting: null
  },
  Bard: {
    description: "An inspiring magician whose power echoes the music of creation.",
    hitDie: 8,
    primaryAbility: "Personality",
    savingThrows: ["Agility", "Personality"],
    subclassName: "Bard College",
    subclasses: [],
    spellcasting: { ability: "Personality" }
  },
  Crusader: {
    description: "A holy warrior devoted to one of the gods.",
    hitDie: 10,
    primaryAbility: "Strength & Willpower",
    savingThrows: ["Personality", "Willpower"],
    subclassName: "Sacred Oath",
    subclasses: [],
    spellcasting: { ability: "Willpower" }
  },
  Mage: {
    description: "A scholarly magic user capable of manipulating the structures of reality.",
    hitDie: 6,
    primaryAbility: "Intelligence",
    savingThrows: ["Intelligence", "Willpower"],
    subclassName: "Arcane School",
    subclasses: [],
    spellcasting: { ability: "Intelligence" }
  },
  Monk: {
    description: "A master of martial arts pursuing physical and spiritual perfection.",
    hitDie: 8,
    primaryAbility: "Agility",
    savingThrows: ["Strength", "Agility"],
    subclassName: "Monastic Tradition",
    subclasses: [],
    spellcasting: null
  },
  Nightblade: {
    description: "A spellcaster using magic to enhance stealth and close combat.",
    hitDie: 8,
    primaryAbility: "Agility & Personality",
    savingThrows: ["Agility", "Intelligence"],
    subclassName: "Shadow Path",
    subclasses: [],
    spellcasting: { ability: "Intelligence" }
  },
  Ranger: {
    description: "An explorer using martial prowess to combat threats on the edges of civilization.",
    hitDie: 10,
    primaryAbility: "Agility",
    savingThrows: ["Agility", "Endurance"],
    subclassName: "Ranger Archetype",
    subclasses: [],
    spellcasting: { ability: "Willpower" }
  },
  Rogue: {
    description: "A scoundrel who uses stealth and expertise to overcome obstacles and enemies.",
    hitDie: 8,
    primaryAbility: "Agility & Intelligence",
    savingThrows: ["Agility", "Intelligence"],
    subclassName: "Roguish Archetype",
    subclasses: [],
    spellcasting: null
  },
  Sorcerer: {
    description: "An innately talented spellcaster who controls the arcane.",
    hitDie: 6,
    primaryAbility: "Willpower",
    savingThrows: ["Endurance", "Willpower"],
    subclassName: "Sorcerous Origin",
    subclasses: [],
    spellcasting: { ability: "Willpower" }
  },
  Spellsword: {
    description: "A spellcasting specialist trained in martial combat and destructive magic.",
    hitDie: 8,
    primaryAbility: "Strength & Willpower",
    savingThrows: ["Endurance", "Willpower"],
    subclassName: "Spellsword Tradition",
    subclasses: [],
    spellcasting: { ability: "Willpower" }
  },
  Thief: {
    description: "A pickpocket and pilferer who chooses stealth and subterfuge over violence.",
    hitDie: 8,
    primaryAbility: "Agility",
    savingThrows: ["Agility", "Endurance"],
    subclassName: "Thief Archetype",
    subclasses: [],
    spellcasting: null
  },
  Warden: {
    description: "Defenders of the Green who wield the powers of nature and guide the elements.",
    hitDie: 8,
    primaryAbility: "Willpower",
    savingThrows: ["Intelligence", "Willpower"],
    subclassName: "Warden Circle",
    subclasses: [],
    spellcasting: { ability: "Willpower" }
  },
  Warrior: {
    description: "A master of martial combat, skilled with a variety of weapons and armor.",
    hitDie: 10,
    primaryAbility: "Strength",
    savingThrows: ["Strength", "Endurance"],
    subclassName: "Martial Archetype",
    subclasses: [],
    spellcasting: null
  }
};

export const UESTRPG_CLASS_CATALOG = Object.entries(UESTRPG_CLASSES).map(([key, val]) => ({
  value: key,
  description: val.description
}));

export const UESTRPG_CONSTELLATIONS = [
  { value: "The Ritual", month: "Morning Star", description: "Blessed with a variety of abilities depending on the season. Those born under the Ritual can heal themselves, turn undead, and protect themselves from the undead." },
  { value: "The Lover", month: "Sun's Dawn", description: "Those born under the Lover are graceful and passionate. They can paralyze others with a kiss and are naturally more agile." },
  { value: "The Lord", month: "First Seed", description: "Those born under the Lord are stronger and healthier than most. They can regenerate health and resist damage." },
  { value: "The Mage", month: "Rain's Hand", description: "The Mage grants bonus magicka to those born under it. These individuals have larger magicka reserves." },
  { value: "The Shadow", month: "Second Seed", description: "The Shadow grants the ability to become invisible once per day. Shadow-born are naturally stealthy." },
  { value: "The Steed", month: "Mid Year", description: "The Steed grants increased speed to those born under it. They can carry more and move faster than others." },
  { value: "The Apprentice", month: "Sun's Height", description: "The Apprentice grants a large bonus to magicka but also a weakness to magic. A double-edged blessing." },
  { value: "The Warrior", month: "Last Seed", description: "The Warrior grants increased prowess in combat. Those born under it are naturally stronger and more skilled with weapons." },
  { value: "The Lady", month: "Hearthfire", description: "The Lady grants bonus endurance and willpower. Those born under her sign are more resistant to physical and mental hardship." },
  { value: "The Tower", month: "Frostfall", description: "Those born under the Tower can unlock doors and detect nearby objects and creatures." },
  { value: "The Atronach", month: "Sun's Dusk", description: "The Atronach grants the largest magicka bonus but prevents natural magicka regeneration. Spell absorption is possible." },
  { value: "The Thief", month: "Evening Star", description: "The Thief grants increased luck and agility. Once per day, those born under it can make their own luck." },
  { value: "The Serpent", month: "--", description: "The Serpent grants no specific attribute bonuses but provides a powerful poison spell and resistance to poison." }
];

export const UESTRPG_CONSTELLATION_CATALOG = UESTRPG_CONSTELLATIONS.map(c => ({
  value: c.value,
  description: `${c.month !== "--" ? c.month + " — " : ""}${c.description}`
}));

export const UESTRPG_ALIGNMENTS = [
  { value: "Lawful Good", description: "Acts with compassion and honor, following laws and traditions" },
  { value: "Neutral Good", description: "Does the best they can to help others" },
  { value: "Chaotic Good", description: "Acts as their conscience directs, with little regard for authority" },
  { value: "Lawful Neutral", description: "Acts in accordance with law, tradition, or personal codes" },
  { value: "True Neutral", description: "Prefers to avoid moral questions and doesn't take sides" },
  { value: "Chaotic Neutral", description: "Follows their own whims, valuing personal freedom above all" },
  { value: "Lawful Evil", description: "Methodically takes what they want within the limits of a code" },
  { value: "Neutral Evil", description: "Does whatever they can get away with, without remorse" },
  { value: "Chaotic Evil", description: "Acts with violence and chaos, driven by greed and cruelty" }
];

export const UESTRPG_BACKGROUNDS = [
  { value: "Acolyte", description: "You spent your life in service to a temple or pantheon of gods.", skillProficiencies: ["Insight", "Religion"] },
  { value: "Charlatan", description: "You have always had a way with people and a talent for deception.", skillProficiencies: ["Deception", "Sleight of Hand"] },
  { value: "City Watch", description: "You served the community as its first line of defense against crime.", skillProficiencies: ["Athletics", "Insight"] },
  { value: "Clan Crafter", description: "You trained under an orc master in the ancient traditions of craftsmanship.", skillProficiencies: ["History", "Insight"] },
  { value: "Cloistered Scholar", description: "You studied at one of Tamriel's great institutes of learning.", skillProficiencies: ["History", "plus one from Arcana, Nature, or Religion"] },
  { value: "Courtier", description: "You served as a personage in a noble court or bureaucratic organization.", skillProficiencies: ["Insight", "Persuasion"] },
  { value: "Criminal", description: "You have a history of breaking the law and contacts in the underworld.", skillProficiencies: ["Deception", "Stealth"] },
  { value: "Entertainer", description: "You thrive in front of an audience, using art and performance.", skillProficiencies: ["Acrobatics", "Performance"] },
  { value: "Faction Agent", description: "You served as an agent of a faction such as the Fighters or Mages Guild.", skillProficiencies: ["Insight", "plus one INT/WIL/PER skill"] },
  { value: "Folk Hero", description: "You come from a humble background but are destined for greatness.", skillProficiencies: ["Animal Handling", "Survival"] },
  { value: "Guild Artisan", description: "You are a member of an artisan's guild, skilled in a particular craft.", skillProficiencies: ["Insight", "Persuasion"] },
  { value: "Haunted One", description: "You are haunted by something so terrible you dare not speak of it.", skillProficiencies: ["Choose one from Arcana, Investigation, Religion, or Survival"] },
  { value: "Hermit", description: "You lived in seclusion, seeking quiet, solitude, and spiritual answers.", skillProficiencies: ["Medicine", "Religion"] },
  { value: "Imperial City Noble", description: "A scion of one of the great noble families of the Imperial City.", skillProficiencies: ["History", "Persuasion"] },
  { value: "Inheritor", description: "You are heir to an object of great value entrusted to you alone.", skillProficiencies: ["Survival", "plus one from Arcana, History, or Religion"] },
  { value: "Knight of the Order", description: "You belong to a knightly order sworn to achieve a certain goal.", skillProficiencies: ["Persuasion", "plus one from Arcana, History, Nature, or Religion"] },
  { value: "Mercenary Veteran", description: "A sellsword who fought battles for coin across Tamriel.", skillProficiencies: ["Athletics", "Persuasion"] },
  { value: "Noble", description: "You carry a noble title, wielding privilege and political influence.", skillProficiencies: ["History", "Persuasion"] },
  { value: "Outlander", description: "You grew up in the wilds, far from civilization and its comforts.", skillProficiencies: ["Athletics", "Survival"] },
  { value: "Sage", description: "You spent years learning the lore of Tamriel, studying scrolls and manuscripts.", skillProficiencies: ["Arcana", "History"] },
  { value: "Sailor", description: "You sailed on a seagoing vessel, facing storms and the monsters of the deep.", skillProficiencies: ["Athletics", "Perception"] },
  { value: "Soldier", description: "War has been your life, trained in weapons, armor, and survival.", skillProficiencies: ["Athletics", "Intimidation"] },
  { value: "Urban Bounty Hunter", description: "You made a living tracking down people for pay in the cities.", skillProficiencies: ["Choose two from Deception, Insight, Persuasion, and Stealth"] },
  { value: "Urchin", description: "You grew up on the streets, orphaned and poor, surviving by cunning.", skillProficiencies: ["Sleight of Hand", "Stealth"] }
];

export const UESTRPG_SKILLS = [
  { value: "Acrobatics", ability: "Agility", description: "Balance, tumbling, and aerial maneuvers" },
  { value: "Animal Handling", ability: "Willpower", description: "Calm, control, or intuit the intentions of animals" },
  { value: "Arcana", ability: "Intelligence", description: "Knowledge of spells, magic items, and magical traditions" },
  { value: "Athletics", ability: "Strength", description: "Climbing, jumping, swimming, and feats of strength" },
  { value: "Deception", ability: "Personality", description: "Misleading others through words or actions" },
  { value: "History", ability: "Intelligence", description: "Knowledge of historical events, people, and cultures" },
  { value: "Insight", ability: "Willpower", description: "Determining the true intentions of a creature" },
  { value: "Intimidation", ability: "Personality", description: "Influencing others through threats and hostile actions" },
  { value: "Investigation", ability: "Intelligence", description: "Searching for clues and making deductions" },
  { value: "Medicine", ability: "Willpower", description: "Stabilizing the dying and diagnosing ailments" },
  { value: "Nature", ability: "Intelligence", description: "Knowledge of terrain, plants, animals, and weather" },
  { value: "Perception", ability: "Willpower", description: "Awareness of surroundings through senses" },
  { value: "Performance", ability: "Personality", description: "Entertaining others through music, dance, or oration" },
  { value: "Persuasion", ability: "Personality", description: "Influencing others through tact and good nature" },
  { value: "Religion", ability: "Intelligence", description: "Knowledge of deities, rites, and religious traditions" },
  { value: "Sleight of Hand", ability: "Agility", description: "Pickpocketing, concealing objects, and manual trickery" },
  { value: "Stealth", ability: "Agility", description: "Hiding and moving silently to avoid detection" },
  { value: "Survival", ability: "Willpower", description: "Tracking, foraging, navigating, and avoiding hazards" }
];

export const UESTRPG_SPELLCASTING_ABILITIES = [
  { value: 'Intelligence', description: 'Used by Mages, Nightblades, and Sorcerers.' },
  { value: 'Willpower', description: 'Used by Crusaders, Wardens, and Spellswords.' },
  { value: 'Personality', description: 'Used by Bards.' },
];
