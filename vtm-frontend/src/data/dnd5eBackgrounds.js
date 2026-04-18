export const DND_BACKGROUNDS = [
  {
    value: "Acolyte",
    description: "You have spent your life in service to a temple.",
    skillProficiencies: ["Insight", "Religion"],
    toolProficiencies: [],
    languages: 2,
    feature: "Shelter of the Faithful"
  },
  {
    value: "Charlatan",
    description: "You have always had a way with people and a talent for deception.",
    skillProficiencies: ["Deception", "Sleight of Hand"],
    toolProficiencies: ["Disguise kit", "Forgery kit"],
    languages: 0,
    feature: "False Identity"
  },
  {
    value: "Criminal",
    description: "You have a history of breaking the law and surviving by your wits.",
    skillProficiencies: ["Deception", "Stealth"],
    toolProficiencies: ["One type of gaming set", "Thieves' tools"],
    languages: 0,
    feature: "Criminal Contact"
  },
  {
    value: "Entertainer",
    description: "You thrive in front of an audience, performing to delight crowds.",
    skillProficiencies: ["Acrobatics", "Performance"],
    toolProficiencies: ["Disguise kit", "One type of musical instrument"],
    languages: 0,
    feature: "By Popular Demand"
  },
  {
    value: "Folk Hero",
    description: "You come from a humble background but are destined for greatness.",
    skillProficiencies: ["Animal Handling", "Survival"],
    toolProficiencies: ["One type of artisan's tools", "Vehicles (land)"],
    languages: 0,
    feature: "Rustic Hospitality"
  },
  {
    value: "Guild Artisan",
    description: "You are a member of an artisan's guild, skilled in a particular craft.",
    skillProficiencies: ["Insight", "Persuasion"],
    toolProficiencies: ["One type of artisan's tools"],
    languages: 1,
    feature: "Guild Membership"
  },
  {
    value: "Hermit",
    description: "You lived in seclusion for an extended period, seeking spiritual enlightenment.",
    skillProficiencies: ["Medicine", "Religion"],
    toolProficiencies: ["Herbalism kit"],
    languages: 1,
    feature: "Discovery"
  },
  {
    value: "Noble",
    description: "You were raised in privilege and understand the workings of high society.",
    skillProficiencies: ["History", "Persuasion"],
    toolProficiencies: ["One type of gaming set"],
    languages: 1,
    feature: "Position of Privilege"
  },
  {
    value: "Outlander",
    description: "You grew up in the wilds, far from civilization and its comforts.",
    skillProficiencies: ["Athletics", "Survival"],
    toolProficiencies: ["One type of musical instrument"],
    languages: 1,
    feature: "Wanderer"
  },
  {
    value: "Sage",
    description: "You spent years learning the lore of the multiverse through endless study.",
    skillProficiencies: ["Arcana", "History"],
    toolProficiencies: [],
    languages: 2,
    feature: "Researcher"
  },
  {
    value: "Sailor",
    description: "You sailed on a seagoing vessel, braving storms and sea monsters.",
    skillProficiencies: ["Athletics", "Perception"],
    toolProficiencies: ["Navigator's tools", "Vehicles (water)"],
    languages: 0,
    feature: "Ship's Passage"
  },
  {
    value: "Soldier",
    description: "You served in a military force, trained in the arts of war.",
    skillProficiencies: ["Athletics", "Intimidation"],
    toolProficiencies: ["One type of gaming set", "Vehicles (land)"],
    languages: 0,
    feature: "Military Rank"
  },
  {
    value: "Urchin",
    description: "You grew up on the streets, surviving by your wits and cunning.",
    skillProficiencies: ["Sleight of Hand", "Stealth"],
    toolProficiencies: ["Disguise kit", "Thieves' tools"],
    languages: 0,
    feature: "City Secrets"
  }
];

export const DND_SKILLS = [
  { value: "Acrobatics", ability: "Dexterity", description: "Balance, tumbling, and aerial maneuvers" },
  { value: "Animal Handling", ability: "Wisdom", description: "Calm, control, or intuit the intentions of animals" },
  { value: "Arcana", ability: "Intelligence", description: "Knowledge of spells, magic items, and planes" },
  { value: "Athletics", ability: "Strength", description: "Climbing, jumping, and swimming" },
  { value: "Deception", ability: "Charisma", description: "Misleading others through words or actions" },
  { value: "History", ability: "Intelligence", description: "Knowledge of historical events and civilizations" },
  { value: "Insight", ability: "Wisdom", description: "Determining true intentions of a creature" },
  { value: "Intimidation", ability: "Charisma", description: "Influencing others through threats or hostile actions" },
  { value: "Investigation", ability: "Intelligence", description: "Searching for clues and making deductions" },
  { value: "Medicine", ability: "Wisdom", description: "Stabilizing the dying or diagnosing illness" },
  { value: "Nature", ability: "Intelligence", description: "Knowledge of terrain, plants, animals, and weather" },
  { value: "Perception", ability: "Wisdom", description: "General awareness and detecting hidden things" },
  { value: "Performance", ability: "Charisma", description: "Entertaining an audience with music, dance, or acting" },
  { value: "Persuasion", ability: "Charisma", description: "Influencing others through tact and social graces" },
  { value: "Religion", ability: "Intelligence", description: "Knowledge of deities, rites, and religious traditions" },
  { value: "Sleight of Hand", ability: "Dexterity", description: "Legerdemain, pickpocketing, and manual trickery" },
  { value: "Stealth", ability: "Dexterity", description: "Hiding and moving silently" },
  { value: "Survival", ability: "Wisdom", description: "Tracking, foraging, and navigating the wilderness" }
];
