export const DND_WEAPONS = [
  // Simple Melee Weapons
  { name: "Club", category: "Simple", type: "Melee", damage: "1d4 bludgeoning", properties: ["Light"], weight: 2, cost: "1 sp" },
  { name: "Dagger", category: "Simple", type: "Melee", damage: "1d4 piercing", properties: ["Finesse", "Light", "Thrown (20/60)"], weight: 1, cost: "2 gp" },
  { name: "Greatclub", category: "Simple", type: "Melee", damage: "1d8 bludgeoning", properties: ["Two-handed"], weight: 10, cost: "2 sp" },
  { name: "Handaxe", category: "Simple", type: "Melee", damage: "1d6 slashing", properties: ["Light", "Thrown (20/60)"], weight: 2, cost: "5 gp" },
  { name: "Javelin", category: "Simple", type: "Melee", damage: "1d6 piercing", properties: ["Thrown (30/120)"], weight: 2, cost: "5 sp" },
  { name: "Light Hammer", category: "Simple", type: "Melee", damage: "1d4 bludgeoning", properties: ["Light", "Thrown (20/60)"], weight: 2, cost: "2 gp" },
  { name: "Mace", category: "Simple", type: "Melee", damage: "1d6 bludgeoning", properties: [], weight: 4, cost: "5 gp" },
  { name: "Quarterstaff", category: "Simple", type: "Melee", damage: "1d6 bludgeoning", properties: ["Versatile (1d8)"], weight: 4, cost: "2 sp" },
  { name: "Sickle", category: "Simple", type: "Melee", damage: "1d4 slashing", properties: ["Light"], weight: 2, cost: "1 gp" },
  { name: "Spear", category: "Simple", type: "Melee", damage: "1d6 piercing", properties: ["Thrown (20/60)", "Versatile (1d8)"], weight: 3, cost: "1 gp" },
  // Simple Ranged Weapons
  { name: "Light Crossbow", category: "Simple", type: "Ranged", damage: "1d8 piercing", properties: ["Ammunition (80/320)", "Loading", "Two-handed"], weight: 5, cost: "25 gp" },
  { name: "Dart", category: "Simple", type: "Ranged", damage: "1d4 piercing", properties: ["Finesse", "Thrown (20/60)"], weight: 0.25, cost: "5 cp" },
  { name: "Shortbow", category: "Simple", type: "Ranged", damage: "1d6 piercing", properties: ["Ammunition (80/320)", "Two-handed"], weight: 2, cost: "25 gp" },
  { name: "Sling", category: "Simple", type: "Ranged", damage: "1d4 bludgeoning", properties: ["Ammunition (30/120)"], weight: 0, cost: "1 sp" },
  // Martial Melee Weapons
  { name: "Battleaxe", category: "Martial", type: "Melee", damage: "1d8 slashing", properties: ["Versatile (1d10)"], weight: 4, cost: "10 gp" },
  { name: "Flail", category: "Martial", type: "Melee", damage: "1d8 bludgeoning", properties: [], weight: 2, cost: "10 gp" },
  { name: "Glaive", category: "Martial", type: "Melee", damage: "1d10 slashing", properties: ["Heavy", "Reach", "Two-handed"], weight: 6, cost: "20 gp" },
  { name: "Greataxe", category: "Martial", type: "Melee", damage: "1d12 slashing", properties: ["Heavy", "Two-handed"], weight: 7, cost: "30 gp" },
  { name: "Greatsword", category: "Martial", type: "Melee", damage: "2d6 slashing", properties: ["Heavy", "Two-handed"], weight: 6, cost: "50 gp" },
  { name: "Halberd", category: "Martial", type: "Melee", damage: "1d10 slashing", properties: ["Heavy", "Reach", "Two-handed"], weight: 6, cost: "20 gp" },
  { name: "Lance", category: "Martial", type: "Melee", damage: "1d12 piercing", properties: ["Reach", "Special"], weight: 6, cost: "10 gp" },
  { name: "Longsword", category: "Martial", type: "Melee", damage: "1d8 slashing", properties: ["Versatile (1d10)"], weight: 3, cost: "15 gp" },
  { name: "Maul", category: "Martial", type: "Melee", damage: "2d6 bludgeoning", properties: ["Heavy", "Two-handed"], weight: 10, cost: "10 gp" },
  { name: "Morningstar", category: "Martial", type: "Melee", damage: "1d8 piercing", properties: [], weight: 4, cost: "15 gp" },
  { name: "Pike", category: "Martial", type: "Melee", damage: "1d10 piercing", properties: ["Heavy", "Reach", "Two-handed"], weight: 18, cost: "5 gp" },
  { name: "Rapier", category: "Martial", type: "Melee", damage: "1d8 piercing", properties: ["Finesse"], weight: 2, cost: "25 gp" },
  { name: "Scimitar", category: "Martial", type: "Melee", damage: "1d6 slashing", properties: ["Finesse", "Light"], weight: 3, cost: "25 gp" },
  { name: "Shortsword", category: "Martial", type: "Melee", damage: "1d6 piercing", properties: ["Finesse", "Light"], weight: 2, cost: "10 gp" },
  { name: "Trident", category: "Martial", type: "Melee", damage: "1d6 piercing", properties: ["Thrown (20/60)", "Versatile (1d8)"], weight: 4, cost: "5 gp" },
  { name: "War Pick", category: "Martial", type: "Melee", damage: "1d8 piercing", properties: [], weight: 2, cost: "5 gp" },
  { name: "Warhammer", category: "Martial", type: "Melee", damage: "1d8 bludgeoning", properties: ["Versatile (1d10)"], weight: 2, cost: "15 gp" },
  { name: "Whip", category: "Martial", type: "Melee", damage: "1d4 slashing", properties: ["Finesse", "Reach"], weight: 3, cost: "2 gp" },
  // Martial Ranged Weapons
  { name: "Blowgun", category: "Martial", type: "Ranged", damage: "1 piercing", properties: ["Ammunition (25/100)", "Loading"], weight: 1, cost: "10 gp" },
  { name: "Hand Crossbow", category: "Martial", type: "Ranged", damage: "1d6 piercing", properties: ["Ammunition (30/120)", "Light", "Loading"], weight: 3, cost: "75 gp" },
  { name: "Heavy Crossbow", category: "Martial", type: "Ranged", damage: "1d10 piercing", properties: ["Ammunition (100/400)", "Heavy", "Loading", "Two-handed"], weight: 18, cost: "50 gp" },
  { name: "Longbow", category: "Martial", type: "Ranged", damage: "1d8 piercing", properties: ["Ammunition (150/600)", "Heavy", "Two-handed"], weight: 2, cost: "50 gp" },
  { name: "Net", category: "Martial", type: "Ranged", damage: "—", properties: ["Special", "Thrown (5/15)"], weight: 3, cost: "1 gp" }
];

export const DND_ARMOR = [
  // Light Armor
  { name: "Padded", category: "Light", ac: "11 + DEX", strength: null, stealth: "Disadvantage", weight: 8, cost: "5 gp" },
  { name: "Leather", category: "Light", ac: "11 + DEX", strength: null, stealth: null, weight: 10, cost: "10 gp" },
  { name: "Studded Leather", category: "Light", ac: "12 + DEX", strength: null, stealth: null, weight: 13, cost: "45 gp" },
  // Medium Armor
  { name: "Hide", category: "Medium", ac: "12 + DEX (max 2)", strength: null, stealth: null, weight: 12, cost: "10 gp" },
  { name: "Chain Shirt", category: "Medium", ac: "13 + DEX (max 2)", strength: null, stealth: null, weight: 20, cost: "50 gp" },
  { name: "Scale Mail", category: "Medium", ac: "14 + DEX (max 2)", strength: null, stealth: "Disadvantage", weight: 45, cost: "50 gp" },
  { name: "Breastplate", category: "Medium", ac: "14 + DEX (max 2)", strength: null, stealth: null, weight: 20, cost: "400 gp" },
  { name: "Half Plate", category: "Medium", ac: "15 + DEX (max 2)", strength: null, stealth: "Disadvantage", weight: 40, cost: "750 gp" },
  // Heavy Armor
  { name: "Ring Mail", category: "Heavy", ac: "14", strength: null, stealth: "Disadvantage", weight: 40, cost: "30 gp" },
  { name: "Chain Mail", category: "Heavy", ac: "16", strength: 13, stealth: "Disadvantage", weight: 55, cost: "75 gp" },
  { name: "Splint", category: "Heavy", ac: "17", strength: 15, stealth: "Disadvantage", weight: 60, cost: "200 gp" },
  { name: "Plate", category: "Heavy", ac: "18", strength: 15, stealth: "Disadvantage", weight: 65, cost: "1500 gp" },
  // Shield
  { name: "Shield", category: "Shield", ac: "+2", strength: null, stealth: null, weight: 6, cost: "10 gp" }
];

export const DND_ADVENTURING_GEAR = [
  { name: "Abacus", cost: "2 gp", weight: 2, description: "A calculating tool" },
  { name: "Arcane Focus", cost: "10 gp", weight: 1, description: "An arcane spellcasting focus (crystal, orb, rod, staff, or wand)" },
  { name: "Backpack", cost: "2 gp", weight: 5, description: "Holds up to 30 lbs or 1 cubic foot" },
  { name: "Ball Bearings (bag of 1,000)", cost: "1 gp", weight: 2, description: "Scatter to make area difficult terrain (DEX save or fall prone)" },
  { name: "Bedroll", cost: "1 gp", weight: 7, description: "A portable sleeping pad and blanket" },
  { name: "Bell", cost: "1 gp", weight: 0, description: "A small metal bell" },
  { name: "Blanket", cost: "5 sp", weight: 3, description: "A thick quilted blanket" },
  { name: "Caltrops (bag of 20)", cost: "1 gp", weight: 2, description: "Scatter to damage and slow creatures stepping on them" },
  { name: "Candle", cost: "1 cp", weight: 0, description: "Sheds bright light in 5-ft radius for 1 hour" },
  { name: "Chain (10 feet)", cost: "5 gp", weight: 10, description: "A heavy iron chain; AC 19, 10 HP" },
  { name: "Chalk (1 piece)", cost: "1 cp", weight: 0, description: "For marking surfaces" },
  { name: "Climber's Kit", cost: "25 gp", weight: 12, description: "Pitons, boot tips, gloves, and harness; advantage on climbing checks" },
  { name: "Component Pouch", cost: "25 gp", weight: 2, description: "Holds material components for spellcasting" },
  { name: "Crowbar", cost: "2 gp", weight: 5, description: "Grants advantage on Strength checks to pry things open" },
  { name: "Flask", cost: "2 cp", weight: 1, description: "Holds 1 pint of liquid" },
  { name: "Grappling Hook", cost: "2 gp", weight: 4, description: "Attach to rope for climbing" },
  { name: "Hammer", cost: "1 gp", weight: 3, description: "A standard carpenter's hammer" },
  { name: "Healer's Kit", cost: "5 gp", weight: 3, description: "10 uses; stabilize a dying creature without a Medicine check" },
  { name: "Holy Symbol", cost: "5 gp", weight: 1, description: "A divine spellcasting focus (amulet, emblem, or reliquary)" },
  { name: "Hourglass", cost: "25 gp", weight: 1, description: "Measures one hour of time" },
  { name: "Ink (1 ounce)", cost: "10 gp", weight: 0, description: "A vial of black ink" },
  { name: "Lantern, Bullseye", cost: "10 gp", weight: 2, description: "Bright light 60-ft cone, dim light 60 ft more; burns 6 hours" },
  { name: "Lantern, Hooded", cost: "5 gp", weight: 2, description: "Bright light 30 ft, dim light 30 ft more; burns 6 hours" },
  { name: "Lock", cost: "10 gp", weight: 1, description: "Requires DC 15 Dexterity (thieves' tools) check to pick" },
  { name: "Manacles", cost: "2 gp", weight: 6, description: "DC 20 Strength or DC 15 Dexterity (thieves' tools) to escape" },
  { name: "Mess Kit", cost: "2 sp", weight: 1, description: "Tin box with cup, cutlery, and plates" },
  { name: "Mirror, Steel", cost: "5 gp", weight: 0.5, description: "A small polished steel mirror" },
  { name: "Oil (flask)", cost: "1 sp", weight: 1, description: "Splash or pour; burns for 2 rounds dealing 5 fire damage" },
  { name: "Paper (one sheet)", cost: "2 sp", weight: 0, description: "A sheet of parchment paper" },
  { name: "Piton", cost: "5 cp", weight: 0.25, description: "An iron spike for climbing or anchoring" },
  { name: "Potion of Healing", cost: "50 gp", weight: 0.5, description: "Restores 2d4+2 hit points when consumed" },
  { name: "Rations (1 day)", cost: "5 sp", weight: 2, description: "Dried food sufficient for one day" },
  { name: "Rope, Hempen (50 feet)", cost: "1 gp", weight: 10, description: "2 HP, burst DC 17" },
  { name: "Rope, Silk (50 feet)", cost: "10 gp", weight: 5, description: "2 HP, burst DC 17" },
  { name: "Spellbook", cost: "50 gp", weight: 3, description: "Essential for wizards to record and prepare spells" },
  { name: "Spyglass", cost: "1000 gp", weight: 1, description: "Magnifies distant objects to twice their size" },
  { name: "Tent, Two-Person", cost: "2 gp", weight: 20, description: "A simple canvas shelter for two" },
  { name: "Thieves' Tools", cost: "25 gp", weight: 1, description: "Picks, files, pliers, and probes for picking locks and disarming traps" },
  { name: "Tinderbox", cost: "5 sp", weight: 1, description: "Used to light fires; takes 1 action" },
  { name: "Torch", cost: "1 cp", weight: 1, description: "Bright light 20 ft, dim light 20 ft more; burns 1 hour" },
  { name: "Vial", cost: "1 gp", weight: 0, description: "Holds up to 4 ounces of liquid" },
  { name: "Waterskin", cost: "2 sp", weight: 5, description: "Holds up to 4 pints of liquid" }
];

export const DND_EQUIPMENT_CATALOG = [
  ...DND_WEAPONS.map(w => ({ value: w.name, description: `${w.category} ${w.type} — ${w.damage} ${w.properties || ''}`.trim() })),
  ...DND_ARMOR.map(a => ({ value: a.name, description: `${a.category} — AC ${a.ac}${a.stealth ? ' (stealth disadvantage)' : ''}` })),
  ...DND_ADVENTURING_GEAR.map(g => ({ value: g.name, description: g.description })),
]
