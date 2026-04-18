export const DND_CLASSES = {
  Barbarian: {
    description: "A fierce warrior who channels primal rage to devastate foes.",
    hitDie: 12,
    primaryAbility: "Strength",
    savingThrows: ["Strength", "Constitution"],
    armorProf: ["Light armor", "Medium armor", "Shields"],
    weaponProf: ["Simple weapons", "Martial weapons"],
    subclassName: "Primal Path",
    subclasses: [
      { value: "Path of the Berserker", description: "Channels rage into a violent frenzy" },
      { value: "Path of the Totem Warrior", description: "Draws power from animal spirit guides" }
    ],
    spellcasting: null
  },
  Bard: {
    description: "An inspiring magician whose music weaves magic and bolsters allies.",
    hitDie: 8,
    primaryAbility: "Charisma",
    savingThrows: ["Dexterity", "Charisma"],
    armorProf: ["Light armor"],
    weaponProf: ["Simple weapons", "Hand crossbows", "Longswords", "Rapiers", "Shortswords"],
    subclassName: "Bard College",
    subclasses: [
      { value: "College of Lore", description: "Pursues knowledge and collects bits of lore" },
      { value: "College of Valor", description: "Inspires heroism and valor in battle" }
    ],
    spellcasting: { ability: "Charisma", known: true }
  },
  Cleric: {
    description: "A priestly champion who wields divine magic in service of a higher power.",
    hitDie: 8,
    primaryAbility: "Wisdom",
    savingThrows: ["Wisdom", "Charisma"],
    armorProf: ["Light armor", "Medium armor", "Shields"],
    weaponProf: ["Simple weapons"],
    subclassName: "Divine Domain",
    subclasses: [
      { value: "Knowledge Domain", description: "Serves gods of learning and understanding" },
      { value: "Life Domain", description: "Focuses on healing and vitality" },
      { value: "Light Domain", description: "Wields radiant energy against darkness" },
      { value: "Nature Domain", description: "Serves gods of nature and the wild" },
      { value: "Tempest Domain", description: "Commands storms, thunder, and lightning" },
      { value: "Trickery Domain", description: "Employs deception and mischief" },
      { value: "War Domain", description: "Champions martial prowess and conquest" }
    ],
    spellcasting: { ability: "Wisdom", known: false }
  },
  Druid: {
    description: "A priest of the Old Faith who draws power from nature and the elements.",
    hitDie: 8,
    primaryAbility: "Wisdom",
    savingThrows: ["Intelligence", "Wisdom"],
    armorProf: ["Light armor", "Medium armor", "Shields (non-metal)"],
    weaponProf: ["Clubs", "Daggers", "Darts", "Javelins", "Maces", "Quarterstaffs", "Scimitars", "Sickles", "Slings", "Spears"],
    subclassName: "Druid Circle",
    subclasses: [
      { value: "Circle of the Land", description: "Draws magic from the land itself" },
      { value: "Circle of the Moon", description: "Masters Wild Shape for powerful beast forms" }
    ],
    spellcasting: { ability: "Wisdom", known: false }
  },
  Fighter: {
    description: "A master of martial combat skilled with a variety of weapons and armor.",
    hitDie: 10,
    primaryAbility: "Strength or Dexterity",
    savingThrows: ["Strength", "Constitution"],
    armorProf: ["All armor", "Shields"],
    weaponProf: ["Simple weapons", "Martial weapons"],
    subclassName: "Martial Archetype",
    subclasses: [
      { value: "Champion", description: "Focuses on raw physical power and athletic perfection" },
      { value: "Battle Master", description: "Employs martial techniques and combat maneuvers" },
      { value: "Eldritch Knight", description: "Combines martial prowess with arcane magic" }
    ],
    spellcasting: null
  },
  Monk: {
    description: "A martial artist who harnesses the body's inner energy to perform extraordinary feats.",
    hitDie: 8,
    primaryAbility: "Dexterity & Wisdom",
    savingThrows: ["Strength", "Dexterity"],
    armorProf: [],
    weaponProf: ["Simple weapons", "Shortswords"],
    subclassName: "Monastic Tradition",
    subclasses: [
      { value: "Way of the Open Hand", description: "Masters unarmed combat techniques" },
      { value: "Way of Shadow", description: "Follows the path of stealth and darkness" },
      { value: "Way of the Four Elements", description: "Channels ki into elemental magic" }
    ],
    spellcasting: null
  },
  Paladin: {
    description: "A holy warrior bound to a sacred oath who smites evil with divine power.",
    hitDie: 10,
    primaryAbility: "Strength & Charisma",
    savingThrows: ["Wisdom", "Charisma"],
    armorProf: ["All armor", "Shields"],
    weaponProf: ["Simple weapons", "Martial weapons"],
    subclassName: "Sacred Oath",
    subclasses: [
      { value: "Oath of Devotion", description: "Upholds justice, virtue, and order" },
      { value: "Oath of the Ancients", description: "Protects the light against darkness" },
      { value: "Oath of Vengeance", description: "Punishes those who commit grievous sins" }
    ],
    spellcasting: { ability: "Charisma", known: false }
  },
  Ranger: {
    description: "A warrior of the wilderness who hunts enemies on the fringes of civilization.",
    hitDie: 10,
    primaryAbility: "Dexterity & Wisdom",
    savingThrows: ["Strength", "Dexterity"],
    armorProf: ["Light armor", "Medium armor", "Shields"],
    weaponProf: ["Simple weapons", "Martial weapons"],
    subclassName: "Ranger Archetype",
    subclasses: [
      { value: "Hunter", description: "Specializes in hunting the most dangerous prey" },
      { value: "Beast Master", description: "Forms a mystical bond with a beast companion" }
    ],
    spellcasting: { ability: "Wisdom", known: true }
  },
  Rogue: {
    description: "A scoundrel who uses stealth and trickery to overcome obstacles and enemies.",
    hitDie: 8,
    primaryAbility: "Dexterity",
    savingThrows: ["Dexterity", "Intelligence"],
    armorProf: ["Light armor"],
    weaponProf: ["Simple weapons", "Hand crossbows", "Longswords", "Rapiers", "Shortswords"],
    subclassName: "Roguish Archetype",
    subclasses: [
      { value: "Thief", description: "Masters the arts of larceny and agility" },
      { value: "Assassin", description: "Excels at the art of dealing death" },
      { value: "Arcane Trickster", description: "Augments thievery with enchantment and illusion magic" }
    ],
    spellcasting: null
  },
  Sorcerer: {
    description: "A spellcaster who draws on innate magic from a gift or bloodline.",
    hitDie: 6,
    primaryAbility: "Charisma",
    savingThrows: ["Constitution", "Charisma"],
    armorProf: [],
    weaponProf: ["Daggers", "Darts", "Slings", "Quarterstaffs", "Light crossbows"],
    subclassName: "Sorcerous Origin",
    subclasses: [
      { value: "Draconic Bloodline", description: "Magic stems from draconic ancestry" },
      { value: "Wild Magic", description: "Magic surges with unpredictable chaotic energy" }
    ],
    spellcasting: { ability: "Charisma", known: true }
  },
  Warlock: {
    description: "A wielder of magic derived from a bargain with an extraplanar entity.",
    hitDie: 8,
    primaryAbility: "Charisma",
    savingThrows: ["Wisdom", "Charisma"],
    armorProf: ["Light armor"],
    weaponProf: ["Simple weapons"],
    subclassName: "Otherworldly Patron",
    subclasses: [
      { value: "The Archfey", description: "Pact with a powerful lord of the Feywild" },
      { value: "The Fiend", description: "Pact with a fiend of the lower planes" },
      { value: "The Great Old One", description: "Pact with an incomprehensible alien entity" }
    ],
    spellcasting: { ability: "Charisma", known: true }
  },
  Wizard: {
    description: "A scholarly magic-user who commands arcane power through study and mastery.",
    hitDie: 6,
    primaryAbility: "Intelligence",
    savingThrows: ["Intelligence", "Wisdom"],
    armorProf: [],
    weaponProf: ["Daggers", "Darts", "Slings", "Quarterstaffs", "Light crossbows"],
    subclassName: "Arcane Tradition",
    subclasses: [
      { value: "School of Abjuration", description: "Specializes in protective and warding magic" },
      { value: "School of Conjuration", description: "Specializes in summoning and teleportation" },
      { value: "School of Divination", description: "Specializes in foresight and information" },
      { value: "School of Enchantment", description: "Specializes in charm and mind-affecting magic" },
      { value: "School of Evocation", description: "Specializes in destructive energy spells" },
      { value: "School of Illusion", description: "Specializes in deception and trickery magic" },
      { value: "School of Necromancy", description: "Specializes in life, death, and undeath magic" },
      { value: "School of Transmutation", description: "Specializes in altering matter and energy" }
    ],
    spellcasting: { ability: "Intelligence", known: false }
  },
  Artificer: {
    description: "A master of invention who channels magic through crafted objects and infusions.",
    hitDie: 8,
    primaryAbility: "Intelligence",
    savingThrows: ["Constitution", "Intelligence"],
    armorProf: ["Light armor", "Medium armor", "Shields"],
    weaponProf: ["Simple weapons"],
    subclassName: "Artificer Specialist",
    subclasses: [
      { value: "Alchemist", description: "Creates experimental elixirs and potions" },
      { value: "Artillerist", description: "Builds arcane turrets and explosive devices" },
      { value: "Battle Smith", description: "Crafts a steel defender and enchanted weapons" },
      { value: "Armorer", description: "Infuses armor with arcane power" }
    ],
    spellcasting: { ability: "Intelligence", known: false }
  }
};

export const DND_CLASS_CATALOG = Object.entries(DND_CLASSES).map(([key, val]) => ({
  value: key,
  description: val.description
}));
