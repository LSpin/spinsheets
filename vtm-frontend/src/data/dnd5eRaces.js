export const DND_RACES = {
  Dwarf: {
    description: "Bold and hardy, dwarves are known as skilled warriors, miners, and workers of stone and metal.",
    abilityBonuses: "+2 CON",
    speed: 25,
    traits: ["Darkvision", "Dwarven Resilience", "Dwarven Combat Training", "Stonecunning"],
    subraces: [
      { value: "Hill Dwarf", description: "Keen senses and deep intuition", abilityBonuses: "+1 WIS" },
      { value: "Mountain Dwarf", description: "Strong and hardy, accustomed to rugged life", abilityBonuses: "+2 STR" }
    ]
  },
  Elf: {
    description: "Elves are a magical people of otherworldly grace, living in places of ethereal beauty.",
    abilityBonuses: "+2 DEX",
    speed: 30,
    traits: ["Darkvision", "Keen Senses", "Fey Ancestry", "Trance"],
    subraces: [
      { value: "High Elf", description: "Keen mind and mastery of basic magic", abilityBonuses: "+1 INT" },
      { value: "Wood Elf", description: "Fleet of foot and stealthy by nature", abilityBonuses: "+1 WIS" },
      { value: "Dark Elf (Drow)", description: "Descended from the dark elves of the Underdark", abilityBonuses: "+1 CHA" }
    ]
  },
  Halfling: {
    description: "Small but resourceful, halflings survive in a world full of larger creatures by avoiding notice.",
    abilityBonuses: "+2 DEX",
    speed: 25,
    traits: ["Lucky", "Brave", "Halfling Nimbleness"],
    subraces: [
      { value: "Lightfoot", description: "Naturally stealthy and social", abilityBonuses: "+1 CHA" },
      { value: "Stout", description: "Hardier than average with resistance to poison", abilityBonuses: "+1 CON" }
    ]
  },
  Human: {
    description: "The most adaptable and ambitious of the common races, humans are widely varied in appearance and culture.",
    abilityBonuses: "+1 to all abilities",
    speed: 30,
    traits: ["Extra Language"],
    subraces: []
  },
  Dragonborn: {
    description: "Born of dragons, dragonborn walk proudly through a world that greets them with fearful incomprehension.",
    abilityBonuses: "+2 STR, +1 CHA",
    speed: 30,
    traits: ["Draconic Ancestry", "Breath Weapon", "Damage Resistance"],
    subraces: []
  },
  Gnome: {
    description: "A gnome's energy and enthusiasm for living shines through every inch of their tiny body.",
    abilityBonuses: "+2 INT",
    speed: 25,
    traits: ["Darkvision", "Gnome Cunning"],
    subraces: [
      { value: "Forest Gnome", description: "Natural illusionist who speaks with small beasts", abilityBonuses: "+1 DEX" },
      { value: "Rock Gnome", description: "Inventive and knowledgeable about devices", abilityBonuses: "+1 CON" }
    ]
  },
  "Half-Elf": {
    description: "Half-elves combine the best qualities of their elf and human parents.",
    abilityBonuses: "+2 CHA, +1 to two other abilities",
    speed: 30,
    traits: ["Darkvision", "Fey Ancestry", "Skill Versatility"],
    subraces: []
  },
  "Half-Orc": {
    description: "Half-orcs combine human versatility with orcish strength and endurance.",
    abilityBonuses: "+2 STR, +1 CON",
    speed: 30,
    traits: ["Darkvision", "Menacing", "Relentless Endurance", "Savage Attacks"],
    subraces: []
  },
  Tiefling: {
    description: "Tieflings are derived from human bloodlines touched by the power of the Nine Hells.",
    abilityBonuses: "+2 CHA, +1 INT",
    speed: 30,
    traits: ["Darkvision", "Hellish Resistance", "Infernal Legacy"],
    subraces: []
  }
};

export const DND_RACE_CATALOG = Object.entries(DND_RACES).map(([key, val]) => ({
  value: key,
  description: val.description
}));

export const DND_ALIGNMENTS = [
  { value: "Lawful Good", description: "Acts with compassion and honor, following rules and traditions" },
  { value: "Neutral Good", description: "Does the best they can to help others" },
  { value: "Chaotic Good", description: "Acts as their conscience directs, with little regard for authority" },
  { value: "Lawful Neutral", description: "Acts in accordance with law, tradition, or personal codes" },
  { value: "True Neutral", description: "Prefers to avoid moral questions and doesn't take sides" },
  { value: "Chaotic Neutral", description: "Follows their own whims, valuing personal freedom above all" },
  { value: "Lawful Evil", description: "Methodically takes what they want within the limits of a code" },
  { value: "Neutral Evil", description: "Does whatever they can get away with, without remorse" },
  { value: "Chaotic Evil", description: "Acts with violence and chaos, driven by greed and cruelty" }
];
