// W20 Werewolf pack totem catalog
// Each totem: { name, cost, type, description, traits }
// Types: Respect, War, Wisdom, Cunning
export const WEREWOLF_TOTEMS = [
  // ── Totems of Respect ──
  { name: "Falcon", cost: 5, type: "Respect", description: "Totem of the Silver Fangs. Falcon demands honor and integrity from his children.", traits: "+3 Honor, +2 Leadership" },
  { name: "Pegasus", cost: 4, type: "Respect", description: "Totem of the Black Furies. Pegasus teaches grace in battle and respect for sacred places.", traits: "+2 Honor, +2 Expression, may use Persuasion with spirits" },
  { name: "Stag", cost: 6, type: "Respect", description: "Totem of the Fianna. Stag embodies the wild majesty of nature and the thrill of the hunt.", traits: "+3 Honor, +2 Survival, +1 Stamina for long pursuits" },
  { name: "Unicorn", cost: 7, type: "Respect", description: "Totem of the Children of Gaia. Unicorn teaches peace, healing, and compassion.", traits: "+3 Honor, +2 Medicine, pack can sense the approach of Wyrm entities" },
  { name: "Thunderbird", cost: 5, type: "Respect", description: "Great spirit of storms. Thunderbird commands respect through raw elemental power.", traits: "+2 Honor, +2 Intimidation, -1 difficulty on weather-related rites" },

  // ── Totems of War ──
  { name: "Bear", cost: 5, type: "War", description: "Bear teaches endurance and ferocity. His children fight with terrible strength.", traits: "+3 Glory, +2 Medicine, each pack member gains -1 difficulty on Stamina rolls" },
  { name: "Fenris", cost: 5, type: "War", description: "Totem of the Get of Fenris. Fenris demands courage in battle above all else.", traits: "+3 Glory, +2 Intimidation, +1 Strength in battle" },
  { name: "Griffin", cost: 4, type: "War", description: "Totem of the Red Talons. Griffin is the fierce protector of the wild.", traits: "+2 Glory, +2 Alertness, pack can speak with birds of prey" },
  { name: "Rat", cost: 5, type: "War", description: "Totem of the Bone Gnawers. Rat teaches survival against impossible odds.", traits: "+3 Glory, +2 Stealth in urban environments, pack ignored by humans in crowds" },
  { name: "Wendigo", cost: 7, type: "War", description: "Totem of the Wendigo tribe. Wendigo is the spirit of cold winds and fierce vengeance.", traits: "+3 Glory, +2 Intimidation, -1 difficulty on cold-related Survival rolls" },
  { name: "Wolverine", cost: 4, type: "War", description: "Wolverine fights without regard for his own safety and never backs down.", traits: "+2 Glory, +2 Brawl, pack gains Resist Pain gift for free" },
  { name: "Boar", cost: 5, type: "War", description: "Boar is unstoppable once provoked and teaches relentless fury.", traits: "+2 Glory, +1 Stamina, pack members are harder to surprise" },

  // ── Totems of Wisdom ──
  { name: "Chimera", cost: 7, type: "Wisdom", description: "Totem of the Stargazers. Chimera teaches insight through mystery, riddles, and enigmas.", traits: "+3 Wisdom, +2 Enigmas, pack members can enter the Umbra more easily" },
  { name: "Owl", cost: 5, type: "Wisdom", description: "Totem of the Silent Striders. Owl sees what others cannot and teaches patience.", traits: "+3 Wisdom, +2 Occult, pack can see in pitch darkness" },
  { name: "Uktena", cost: 7, type: "Wisdom", description: "Totem of the Uktena tribe. Uktena is the water serpent who guards forbidden lore.", traits: "+3 Wisdom, +2 Occult, -1 difficulty on rites involving binding" },
  { name: "Cockroach", cost: 6, type: "Wisdom", description: "Totem of the Glass Walkers. Cockroach understands the Weaver and technology.", traits: "+3 Wisdom, +2 Technology, pack can communicate through electronic devices" },
  { name: "Raven", cost: 5, type: "Wisdom", description: "Raven is a messenger and keeper of secrets who teaches cunning wisdom.", traits: "+2 Wisdom, +2 Subterfuge, pack gains Umbral sight" },
  { name: "Sphinx", cost: 6, type: "Wisdom", description: "Sphinx teaches patience and demands her children solve riddles before granting aid.", traits: "+2 Wisdom, +3 Enigmas, -1 difficulty on Willpower rolls to resist frenzy" },
  { name: "Grandmother Spider", cost: 6, type: "Wisdom", description: "Weaver of webs and keeper of stories, she teaches the connections between all things.", traits: "+2 Wisdom, +2 Crafts, pack can sense Weaver disturbances" },

  // ── Totems of Cunning ──
  { name: "Coyote", cost: 7, type: "Cunning", description: "The great trickster. Coyote teaches through mischief, laughter, and unpredictability.", traits: "+3 Cunning, +2 Subterfuge, +1 Stealth, spirits find the pack amusing" },
  { name: "Fox", cost: 7, type: "Cunning", description: "Fox is the master of evasion and misdirection, always one step ahead.", traits: "+3 Cunning, +2 Stealth, pack members are harder to track" },
  { name: "Old Man of the Sea", cost: 5, type: "Cunning", description: "Shape-shifting sea spirit who teaches adaptability and perseverance.", traits: "+2 Cunning, +2 Survival near water, pack can hold breath twice as long" },
  { name: "Rabbit", cost: 4, type: "Cunning", description: "Rabbit teaches speed, agility, and the wisdom of knowing when to flee.", traits: "+2 Cunning, +2 Dodge, +1 to initiative" },
  { name: "Trash Heap", cost: 4, type: "Cunning", description: "Urban spirit of waste and recycling. Teaches resourcefulness.", traits: "+2 Cunning, +2 Streetwise, pack can scavenge useful items in urban areas" },
  { name: "Whippoorwill", cost: 5, type: "Cunning", description: "Night bird spirit associated with omens and hidden knowledge.", traits: "+2 Cunning, +2 Awareness at night, pack can sense the recently dead" },
];
