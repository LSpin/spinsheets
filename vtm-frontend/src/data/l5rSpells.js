// L5R 4th Edition Spell catalog — Core Rulebook only (from lasthaiku.wikidot.com)

export const L5R_SPELLS = [
  // ══════════════════════════════════════
  //  AIR SPELLS
  // ══════════════════════════════════════

  // ── Air Mastery Level 1 ──
  { name: 'Blessed Wind', element: 'Air', mastery: 1, description: 'Creates a barrier of swirling wind that increases your Armor TN.' },
  { name: 'By the Light of the Moon', element: 'Air', mastery: 1, description: 'Reveals illusions and invisible creatures within the area of effect.' },
  { name: 'Cloak of Night', element: 'Air', mastery: 1, description: 'Wraps the target in shadow, adding your Air Ring to Stealth rolls.' },
  { name: 'Legacy of Kaze-no-Kami', element: 'Air', mastery: 1, description: 'Causes a powerful gust of wind that can knock prone or push back targets.' },
  { name: "Nature's Touch", element: 'Air', mastery: 1, description: 'Commune with air kami to learn about weather patterns and recent events in the area.' },
  { name: 'Tempest of Air', element: 'Air', mastery: 1, description: 'Deals 2k2 air damage to a target within range.' },
  { name: 'Token of Memory', element: 'Air', mastery: 1, description: 'Implants a brief mental image or message into an object that can be perceived by another.' },
  { name: 'To Seek the Truth', element: 'Air', mastery: 1, description: 'Detects whether the target is telling the truth by reading subtle air currents.' },
  { name: 'Way of Deception', element: 'Air', mastery: 1, description: 'Adds your Air Ring to a Sincerity (Deceit) roll to conceal your true intentions.' },
  { name: 'Yari of Air', element: 'Air', mastery: 1, description: 'Summons a spear of solidified air that uses your Air Ring for attack and damage rolls.' },

  // ── Air Mastery Level 2 ──
  { name: "Benten's Touch", element: 'Air', mastery: 2, description: 'Enhances the target\'s physical beauty and social grace, adding to social skill rolls.' },
  { name: 'Call Upon the Wind', element: 'Air', mastery: 2, description: 'Allows you to fly for a short duration, moving through the air at your Water speed.' },
  { name: 'Hidden Visage', element: 'Air', mastery: 2, description: 'Makes the target completely forgettable; others cannot recall their face or presence.' },
  { name: "The Kami's Whisper", element: 'Air', mastery: 2, description: 'Sends a short verbal message to a specific person you know, regardless of distance.' },
  { name: 'Mists of Illusion', element: 'Air', mastery: 2, description: 'Creates a visual illusion up to the size of a small building that lasts several minutes.' },
  { name: 'Secrets on the Wind', element: 'Air', mastery: 2, description: 'Eavesdrops on a conversation within a long distance by listening through the air kami.' },
  { name: 'Whispering Wind', element: 'Air', mastery: 2, description: 'Carries a spoken message of up to ten words on the wind to a person you can see.' },
  { name: "Wolf's Proposal", element: 'Air', mastery: 2, description: 'Forces the target to speak honestly for the duration by binding air kami around their throat.' },

  // ── Air Mastery Level 3 ──
  { name: 'Essence of Air', element: 'Air', mastery: 3, description: 'Permanently increases the target\'s Air Ring by one, but can only affect each person once.' },
  { name: 'The Eye Shall Not See', element: 'Air', mastery: 3, description: 'Renders the target invisible for the spell\'s duration; attacking breaks the effect.' },
  { name: 'Mask of Wind', element: 'Air', mastery: 3, description: 'Disguises the target\'s appearance completely, including voice and scent, for several hours.' },
  { name: 'Striking the Storm', element: 'Air', mastery: 3, description: 'Deals 4k4 air damage to all targets in a wide area around the caster.' },
  { name: 'Summoning the Gale', element: 'Air', mastery: 3, description: 'Creates a powerful windstorm that impedes ranged attacks and movement in a large area.' },
  { name: 'Summon Fog', element: 'Air', mastery: 3, description: 'Fills a large area with dense fog, heavily obscuring vision and reducing ranged attack effectiveness.' },
  { name: "Your Heart's Enemy", element: 'Air', mastery: 3, description: 'Creates an illusory duplicate of the target\'s most feared enemy that only they can see.' },

  // ── Air Mastery Level 4 ──
  { name: 'Call the Spirit', element: 'Air', mastery: 4, description: 'Summons an air elemental of considerable power to serve you for a limited time.' },
  { name: 'False Realm', element: 'Air', mastery: 4, description: 'Creates an elaborate illusory environment covering a large area that fools all senses.' },
  { name: 'Gift of Wind', element: 'Air', mastery: 4, description: 'Grants the target the ability to fly freely for the spell\'s duration.' },
  { name: 'Know the Mind', element: 'Air', mastery: 4, description: 'Reads the target\'s surface thoughts for the duration of the spell.' },
  { name: 'Netsuke of Wind', element: 'Air', mastery: 4, description: 'Binds an air spell of Mastery 3 or lower into a small object for later activation.' },
  { name: 'Symbol of Air', element: 'Air', mastery: 4, description: 'Inscribes a ward that triggers an air spell effect when a specified condition is met.' },

  // ── Air Mastery Level 5 ──
  { name: 'Cloud the Mind', element: 'Air', mastery: 5, description: 'Completely controls the target\'s perceptions, making them see, hear, and feel whatever you wish.' },
  { name: 'Draw Back the Shadow', element: 'Air', mastery: 5, description: 'Removes all illusions, invisibility, and magical concealment in a large area.' },
  { name: 'Echoes on the Breeze', element: 'Air', mastery: 5, description: 'Listens to past conversations that occurred in the area within the last several days.' },
  { name: 'Legion of the Moon', element: 'Air', mastery: 5, description: 'Creates multiple illusory duplicates of yourself that mimic your actions in combat.' },
  { name: "Slayer's Knives", element: 'Air', mastery: 5, description: 'Launches a barrage of razor-sharp wind blades dealing 6k6 air damage to a single target.' },

  // ── Air Mastery Level 6 ──
  { name: 'Rise Air', element: 'Air', mastery: 6, description: 'Summons a massive air elemental of tremendous power to serve you.' },
  { name: 'The False Legion', element: 'Air', mastery: 6, description: 'Creates an illusory army of hundreds of soldiers convincing enough to fool scouts and generals.' },
  { name: 'Wrath of Kaze-no-Kami', element: 'Air', mastery: 6, description: 'Summons a devastating tornado that destroys everything in its path across a wide area.' },

  // ══════════════════════════════════════
  //  EARTH SPELLS
  // ══════════════════════════════════════

  // ── Earth Mastery Level 1 ──
  { name: 'Armor of Earth', element: 'Earth', mastery: 1, description: 'Grants the target Reduction equal to your Earth Ring for several rounds.' },
  { name: 'Courage of the Seven Thunders', element: 'Earth', mastery: 1, description: 'Removes or suppresses fear effects on the target, adding your Earth Ring to resist fear.' },
  { name: "Earth's Stagnation", element: 'Earth', mastery: 1, description: 'Reduces the target\'s Water Ring by your Earth Ring for movement purposes, slowing them.' },
  { name: "Earth's Touch", element: 'Earth', mastery: 1, description: 'Learn basic information about an area by communing with local earth kami.' },
  { name: 'Jade Strike', element: 'Earth', mastery: 1, description: 'Deals 2k2 damage, doubled against Tainted creatures and those of the Shadowlands.' },
  { name: "Jurojin's Balm", element: 'Earth', mastery: 1, description: 'Heals the target of a disease or poison by purifying their body through earth kami.' },
  { name: 'Minor Binding', element: 'Earth', mastery: 1, description: 'Binds a target in place by causing earth and stone to grip their legs.' },
  { name: 'Soul of Stone', element: 'Earth', mastery: 1, description: 'Suppresses the target\'s emotions, making them calm and granting a bonus to resist social manipulation.' },
  { name: 'Tetsubo of Earth', element: 'Earth', mastery: 1, description: 'Summons a war club of solid stone that uses your Earth Ring for attack and damage rolls.' },

  // ── Earth Mastery Level 2 ──
  { name: 'Be the Mountain', element: 'Earth', mastery: 2, description: 'Roots yourself in place, becoming nearly impossible to move and gaining bonus Reduction.' },
  { name: 'Earth Becomes Sky', element: 'Earth', mastery: 2, description: 'Launches a stone projectile at a target, dealing 3k3 damage at range.' },
  { name: 'Embrace of Kenro-Ji-Jin', element: 'Earth', mastery: 2, description: 'Target sinks partially into the earth and is immobilized for the duration.' },
  { name: 'Force of Will', element: 'Earth', mastery: 2, description: 'Adds your Earth Ring to all Willpower-based rolls for the duration.' },
  { name: 'Grasp of Earth', element: 'Earth', mastery: 2, description: 'The ground becomes rough and broken in an area, halving movement speed for those within.' },
  { name: 'Hands of Clay', element: 'Earth', mastery: 2, description: 'Shapes earth and clay into simple objects or structures at your command.' },
  { name: "The Mountain's Feet", element: 'Earth', mastery: 2, description: 'Grants sure footing on any terrain; the target cannot be knocked prone.' },
  { name: 'Wholeness of the World', element: 'Earth', mastery: 2, description: 'Detects the presence and general direction of Shadowlands Taint within a large area.' },

  // ── Earth Mastery Level 3 ──
  { name: 'Bonds of Ningen-Do', element: 'Earth', mastery: 3, description: 'Prevents a spirit or extraplanar creature from leaving the mortal realm.' },
  { name: "Earth Kami's Blessing", element: 'Earth', mastery: 3, description: 'Temporarily increases the target\'s Earth Ring by your School Rank for several rounds.' },
  { name: "Earth's Protection", element: 'Earth', mastery: 3, description: 'Creates a barrier of stone around the target that absorbs a large amount of damage before shattering.' },
  { name: 'Groves of Stone', element: 'Earth', mastery: 3, description: 'Raises a ring of stone pillars from the ground that provides cover and blocks movement.' },
  { name: 'Murmur of Earth', element: 'Earth', mastery: 3, description: 'Senses tremors and movement through the ground, detecting hidden creatures within a wide radius.' },
  { name: 'Purge the Taint', element: 'Earth', mastery: 3, description: 'Removes Shadowlands Taint points from a willing target at the cost of your own Wounds.' },
  { name: 'Sharing the Strength of Many', element: 'Earth', mastery: 3, description: 'Distributes damage among multiple willing targets, spreading Wounds evenly across the group.' },
  { name: 'Shelter of the Earth', element: 'Earth', mastery: 3, description: 'Raises a small stone shelter from the ground that protects against weather and attacks.' },
  { name: 'Strength of the Crow', element: 'Earth', mastery: 3, description: 'Temporarily increases the target\'s Stamina by your Earth Ring for the duration.' },
  { name: 'Strike as Stone', element: 'Earth', mastery: 3, description: 'Empowers unarmed strikes to deal increased damage as if the fists were made of stone.' },
  { name: "Time's Deadly Hand", element: 'Earth', mastery: 3, description: 'Rapidly ages an object, causing wood to rot, metal to rust, and stone to crumble.' },
  { name: "The Wolf's Mercy", element: 'Earth', mastery: 3, description: 'Stabilizes a dying target, preventing them from losing further Wounds and keeping them alive.' },
  { name: 'Wooden Prison', element: 'Earth', mastery: 3, description: 'Causes nearby wood or trees to wrap around and restrain a target, immobilizing them.' },

  // ── Earth Mastery Level 4 ──
  { name: 'Armor of the Emperor', element: 'Earth', mastery: 4, description: 'Grants extremely powerful Reduction to the target, rivaling the best heavy armor.' },
  { name: "Earth Dragon's Ward", element: 'Earth', mastery: 4, description: 'Creates a powerful ward that prevents Tainted creatures from entering the protected area.' },
  { name: 'Essence of Earth', element: 'Earth', mastery: 4, description: 'Permanently increases the target\'s Earth Ring by one, but can only affect each person once.' },
  { name: 'Maw of the Earth', element: 'Earth', mastery: 4, description: 'Opens a pit beneath the target, swallowing them into the ground and trapping them.' },
  { name: 'Sapphire Strike', element: 'Earth', mastery: 4, description: 'Deals 5k5 damage that is considered jade for the purpose of harming Tainted creatures.' },
  { name: 'Symbol of Earth', element: 'Earth', mastery: 4, description: 'Inscribes a ward that triggers an earth spell effect when a specified condition is met.' },
  { name: 'The Earth Flows', element: 'Earth', mastery: 4, description: 'Reshapes a large area of terrain, moving earth and stone to create or destroy paths and structures.' },
  { name: 'Tomb of Jade', element: 'Earth', mastery: 4, description: 'Encases a Tainted creature in jade, permanently imprisoning it if it fails to resist.' },
  { name: 'Wall of Earth', element: 'Earth', mastery: 4, description: 'Raises a massive wall of solid stone from the ground to block passage or provide fortification.' },

  // ── Earth Mastery Level 5 ──
  { name: 'Drawing on the Mountain', element: 'Earth', mastery: 5, description: 'Massively increases the target\'s Earth Ring for a short time, granting tremendous resilience.' },
  { name: 'Earthquake', element: 'Earth', mastery: 5, description: 'Creates a devastating earthquake in a large area, damaging structures and knocking creatures prone.' },
  { name: 'Grounding Energy', element: 'Earth', mastery: 5, description: 'Creates a zone where magical effects are suppressed, preventing spells from being cast within.' },
  { name: 'Major Binding', element: 'Earth', mastery: 5, description: 'Binds a powerful spirit or creature to a location, preventing it from leaving for a year and a day.' },
  { name: 'Strike at the Roots', element: 'Earth', mastery: 5, description: 'Reduces the target\'s Earth Ring to 1 for the duration, leaving them extremely vulnerable.' },
  { name: "The Kami's Strength", element: 'Earth', mastery: 5, description: 'Grants the target supernatural physical Strength, adding your Earth Ring to damage rolls.' },
  { name: "The Kami's Will", element: 'Earth', mastery: 5, description: 'Compels earth kami to perform a complex task of your choosing over an extended period.' },

  // ── Earth Mastery Level 6 ──
  { name: 'Essence of Jade', element: 'Earth', mastery: 6, description: 'Transforms the target\'s body into living jade temporarily, granting immense Reduction and Taint immunity.' },
  { name: 'Power of the Earth Dragon', element: 'Earth', mastery: 6, description: 'Channels the full power of the Earth Dragon, granting near-invulnerability for a short time.' },
  { name: 'Prison of Earth', element: 'Earth', mastery: 6, description: 'Permanently imprisons a target deep within the earth in a stone sarcophagus.' },
  { name: 'Rise Earth', element: 'Earth', mastery: 6, description: 'Summons a massive earth elemental of tremendous power to serve you.' },
  { name: 'Soldiers of Clay', element: 'Earth', mastery: 6, description: 'Animates a small army of clay warriors that fight on your behalf for the duration.' },

  // ══════════════════════════════════════
  //  FIRE SPELLS
  // ══════════════════════════════════════

  // ── Fire Mastery Level 1 ──
  { name: 'Biting Steel', element: 'Fire', mastery: 1, description: 'Increases a melee weapon\'s damage roll by your Fire Ring for several rounds.' },
  { name: 'Burning Kiss of Steel', element: 'Fire', mastery: 1, description: 'Sheathes a weapon in flames, adding 1k1 fire damage to each successful strike.' },
  { name: 'Envious Flames', element: 'Fire', mastery: 1, description: 'Causes a target to become consumed with jealousy toward a person or object you specify.' },
  { name: 'Extinguish', element: 'Fire', mastery: 1, description: 'Instantly snuffs out all fires within the area of effect, from candles to bonfires.' },
  { name: 'Fires of Purity', element: 'Fire', mastery: 1, description: 'Wraps the target in purifying flames that deal extra damage to Tainted creatures touching them.' },
  { name: 'The Fires That Cleanse', element: 'Fire', mastery: 1, description: 'Burns away Shadowlands Taint from an object, purifying it with sacred fire.' },
  { name: 'Fury of Osano-Wo', element: 'Fire', mastery: 1, description: 'Calls down a bolt of lightning on a target, dealing 3k3 electricity damage.' },
  { name: 'Katana of Fire', element: 'Fire', mastery: 1, description: 'Summons a flaming sword that uses your Fire Ring for attack and damage rolls.' },
  { name: 'Never Alone', element: 'Fire', mastery: 1, description: 'Inspires courage and determination in the target, granting a bonus to resist fear and intimidation.' },
  { name: 'The Raging Forge', element: 'Fire', mastery: 1, description: 'Heats metal to extreme temperatures, making worn armor or weapons painfully hot to hold.' },

  // ── Fire Mastery Level 2 ──
  { name: 'Disrupt the Aura', element: 'Fire', mastery: 2, description: 'Disrupts the target\'s magical aura, increasing the TN of their spell casting rolls.' },
  { name: 'Enticing the Dance of Flame', element: 'Fire', mastery: 2, description: 'Controls existing flames, shaping and directing fire to move where you command.' },
  { name: 'The Fires From Within', element: 'Fire', mastery: 2, description: 'Deals 3k3 fire damage that ignores Reduction, burning the target from the inside.' },
  { name: 'Hurried Steps', element: 'Fire', mastery: 2, description: 'Increases the target\'s movement speed by adding your Fire Ring to their Water for movement.' },
  { name: 'Mental Quickness', element: 'Fire', mastery: 2, description: 'Boosts the target\'s Intelligence-based rolls by adding your Fire Ring for the duration.' },
  { name: 'Relentless Heat', element: 'Fire', mastery: 2, description: 'Creates an area of intense heat that causes fatigue and Wound penalties to those within.' },
  { name: 'Tail of the Fire Dragon', element: 'Fire', mastery: 2, description: 'Creates a line of fire that deals 4k4 damage to all targets in its path.' },
  { name: 'Ward of Purity', element: 'Fire', mastery: 2, description: 'Creates a ward of purifying fire that damages Tainted creatures attempting to cross it.' },

  // ── Fire Mastery Level 3 ──
  { name: 'Breath of the Fire Dragon', element: 'Fire', mastery: 3, description: 'Unleashes a cone of fire dealing 5k5 damage to all targets in the area.' },
  { name: 'Fiery Wrath', element: 'Fire', mastery: 3, description: 'Surrounds you with a nimbus of flame that damages anyone who strikes you in melee.' },
  { name: 'The Fist of Osano-Wo', element: 'Fire', mastery: 3, description: 'Calls a massive lightning bolt dealing 6k6 damage to a single target.' },
  { name: 'Haze of Battle', element: 'Fire', mastery: 3, description: 'Inflames the target\'s emotions, forcing them to attack the nearest creature indiscriminately.' },
  { name: 'Hungry Blade', element: 'Fire', mastery: 3, description: 'Enchants a weapon so it deals additional rolled damage dice on each successful hit.' },
  { name: 'Ravenous Swarms', element: 'Fire', mastery: 3, description: 'Summons a swarm of biting insects that deal damage and distract targets in an area.' },
  { name: 'Shining Light', element: 'Fire', mastery: 3, description: 'Creates a brilliant burst of light that blinds all targets in the area for several rounds.' },

  // ── Fire Mastery Level 4 ──
  { name: 'Death of Flame', element: 'Fire', mastery: 4, description: 'Completely extinguishes all fire, mundane and magical, in a massive area permanently.' },
  { name: 'Defense of the Firestorm', element: 'Fire', mastery: 4, description: 'Surrounds you with a raging firestorm that deals heavy damage to anyone who approaches.' },
  { name: 'The Mending Forge', element: 'Fire', mastery: 4, description: 'Repairs a broken or damaged object by reforging it with fire kami, restoring it to full condition.' },
  { name: 'Symbol of Fire', element: 'Fire', mastery: 4, description: 'Inscribes a ward that triggers a fire spell effect when a specified condition is met.' },
  { name: 'Wall of Fire', element: 'Fire', mastery: 4, description: 'Creates a barrier of intense flame that deals heavy damage to anyone passing through it.' },
  { name: 'Ward of Thunder', element: 'Fire', mastery: 4, description: 'Creates a protective ward that strikes intruders with lightning dealing 6k6 damage.' },

  // ── Fire Mastery Level 5 ──
  { name: 'Destructive Wave', element: 'Fire', mastery: 5, description: 'Unleashes an expanding ring of fire dealing 7k7 damage to all targets in a large radius.' },
  { name: 'Everburning Rage', element: 'Fire', mastery: 5, description: 'Sets the target ablaze with flames that cannot be extinguished by normal means, dealing ongoing damage.' },
  { name: 'Follow the Flame', element: 'Fire', mastery: 5, description: 'Transforms your body into living fire, allowing you to pass through barriers and deal damage on touch.' },
  { name: 'Light of the Sun', element: 'Fire', mastery: 5, description: 'Creates a miniature sun that illuminates a vast area and deals severe damage to undead and Shadowlands creatures.' },
  { name: 'Wings of the Phoenix', element: 'Fire', mastery: 5, description: 'Grants the target wings of flame that allow flight and deal fire damage to nearby enemies.' },

  // ── Fire Mastery Level 6 ──
  { name: 'Beam of the Inferno', element: 'Fire', mastery: 6, description: 'Fires a concentrated beam of pure fire dealing 10k10 damage to a single target.' },
  { name: 'Globe of the Everlasting Sun', element: 'Fire', mastery: 6, description: 'Creates a massive sphere of sunfire that illuminates and purifies a huge area, devastating Shadowlands creatures.' },
  { name: "The Soul's Blade", element: 'Fire', mastery: 6, description: 'Creates a weapon of pure fire that deals damage directly to the target\'s soul, ignoring all physical defenses.' },

  // ══════════════════════════════════════
  //  WATER SPELLS
  // ══════════════════════════════════════

  // ── Water Mastery Level 1 ──
  { name: 'Bo of Water', element: 'Water', mastery: 1, description: 'Summons a staff of solid water that uses your Water Ring for attack and damage rolls.' },
  { name: 'Clarity of Purpose', element: 'Water', mastery: 1, description: 'Removes confusion, daze, and similar mental impairments from the target.' },
  { name: 'Ebbing Strength', element: 'Water', mastery: 1, description: 'Reduces the target\'s Strength by your Water Ring for the duration.' },
  { name: 'Path to Inner Peace', element: 'Water', mastery: 1, description: 'Heals a number of Wounds equal to your Water Ring plus School Rank.' },
  { name: 'Reflections of Pan Ku', element: 'Water', mastery: 1, description: 'Creates a perfect visual duplicate of a small object made of water.' },
  { name: 'Reversal of Fortunes', element: 'Water', mastery: 1, description: 'Transfers Wound penalties from the target to another creature you designate.' },
  { name: 'Speed of the Waterfall', element: 'Water', mastery: 1, description: 'Increases the target\'s Initiative Score by adding your Water Ring twice.' },
  { name: 'Spirit of the Water', element: 'Water', mastery: 1, description: 'Commune with water kami to learn about recent events near a body of water.' },
  { name: 'Sympathetic Energies', element: 'Water', mastery: 1, description: 'Links two targets so that healing applied to one also partially heals the other.' },
  { name: 'The Rushing Wave', element: 'Water', mastery: 1, description: 'Creates a wave of water that knocks targets prone and pushes them back.' },

  // ── Water Mastery Level 2 ──
  { name: 'Cloak of the Miya', element: 'Water', mastery: 2, description: 'Protects the target from environmental effects like heat, cold, and harsh weather.' },
  { name: "Inari's Blessing", element: 'Water', mastery: 2, description: 'Purifies food and water, removing poisons and spoilage, enough to feed several people.' },
  { name: 'Reflective Pool', element: 'Water', mastery: 2, description: 'Uses a pool of water to scry on a distant location or person you have seen before.' },
  { name: 'Rejuvenating Vapors', element: 'Water', mastery: 2, description: 'Creates a mist that heals all allies within the area for a small amount of Wounds each round.' },
  { name: 'Stand Against the Waves', element: 'Water', mastery: 2, description: 'Increases the target\'s Strength by your Water Ring for the duration.' },
  { name: 'The Ties That Bind', element: 'Water', mastery: 2, description: 'Creates tendrils of water that grapple and restrain a target in place.' },
  { name: 'Wave-Borne Speed', element: 'Water', mastery: 2, description: 'Greatly increases the target\'s movement speed, doubling their Water for movement purposes.' },
  { name: 'Wisdom and Clarity', element: 'Water', mastery: 2, description: 'Enhances the target\'s Perception-based rolls by adding your Water Ring for the duration.' },

  // ── Water Mastery Level 3 ──
  { name: 'Near to Ice', element: 'Water', mastery: 3, description: 'Freezes a body of water or creates an area of ice that causes difficult terrain and slip hazards.' },
  { name: 'Regrow the Wound', element: 'Water', mastery: 3, description: 'Heals severe injuries including broken bones, restoring a large number of Wounds.' },
  { name: 'Silent Waters', element: 'Water', mastery: 3, description: 'Creates a zone of absolute silence where no sound can be made or heard.' },
  { name: 'Strike of the Tsunami', element: 'Water', mastery: 3, description: 'Deals 4k4 water damage and knocks the target prone with a powerful blast of water.' },
  { name: 'Visions of the Future', element: 'Water', mastery: 3, description: 'Grants a brief prophetic vision of possible future events related to a question you ask.' },
  { name: 'Walking Upon the Waves', element: 'Water', mastery: 3, description: 'Allows the target to walk on the surface of water as if it were solid ground.' },
  { name: "Water Kami's Blessing", element: 'Water', mastery: 3, description: 'Temporarily increases the target\'s Water Ring by your School Rank for several rounds.' },

  // ── Water Mastery Level 4 ──
  { name: 'Dominion of Suitengu', element: 'Water', mastery: 4, description: 'Grants complete control over a large body of water, shaping currents and waves at will.' },
  { name: 'Ebb and Flow of Battle', element: 'Water', mastery: 4, description: 'Redistributes Wounds among all willing targets in the area, balancing injuries evenly.' },
  { name: 'Heart of the Water Dragon', element: 'Water', mastery: 4, description: 'Allows the target to breathe underwater and swim at full speed for an extended duration.' },
  { name: 'Strike of the Flowing Waters', element: 'Water', mastery: 4, description: 'Deals 6k6 water damage that ignores Reduction, striking with the unstoppable force of a river.' },
  { name: 'Symbol of Water', element: 'Water', mastery: 4, description: 'Inscribes a ward that triggers a water spell effect when a specified condition is met.' },
  { name: 'The Path Not Taken', element: 'Water', mastery: 4, description: 'Allows the target to reroll a single roll they made this round, taking the new result.' },

  // ── Water Mastery Level 5 ──
  { name: 'Ever-Changing Waves', element: 'Water', mastery: 5, description: 'Transforms the target\'s body into water, granting immunity to physical attacks for the duration.' },
  { name: 'The Final Bond', element: 'Water', mastery: 5, description: 'Links your life force to another; if one would die, Wounds are shared between both.' },
  { name: 'Hands of the Tides', element: 'Water', mastery: 5, description: 'Creates massive hands of water that can grapple, crush, or hurl targets with enormous force.' },
  { name: 'Power of the Ocean', element: 'Water', mastery: 5, description: 'Summons a massive tidal wave that devastates a large area, dealing severe damage to all within.' },
  { name: "Suitengu's Embrace", element: 'Water', mastery: 5, description: 'Fills the target\'s lungs with water, dealing ongoing drowning damage each round.' },

  // ── Water Mastery Level 6 ──
  { name: 'Peace of the Kami', element: 'Water', mastery: 6, description: 'Heals all Wounds on every ally within a large area and removes all status effects.' },
  { name: 'Rise Water', element: 'Water', mastery: 6, description: 'Summons a massive water elemental of tremendous power to serve you.' },
  { name: "Water's Sweet Clarity", element: 'Water', mastery: 6, description: 'Grants perfect awareness of all living creatures and their conditions within a vast area.' },

  // ══════════════════════════════════════
  //  VOID SPELLS
  // ══════════════════════════════════════

  // ── Void Mastery Level 1 ──
  { name: 'Boundless Sight', element: 'Void', mastery: 1, description: 'Extends your senses beyond your body, allowing you to perceive a distant location briefly.' },
  { name: 'Drawing the Void', element: 'Void', mastery: 1, description: 'Recovers a spent Void Point by drawing on the emptiness between all things.' },
  { name: 'Flow Through the Void', element: 'Void', mastery: 1, description: 'Adds your Void Ring to one physical or mental roll as if spending a Void Point.' },
  { name: 'See Through Lies', element: 'Void', mastery: 1, description: 'Perceives falsehood in the target\'s words by sensing the Void\'s disruption when they lie.' },
  { name: 'Sense Void', element: 'Void', mastery: 1, description: 'Detects the presence and relative strength of other Void-attuned beings nearby.' },
  { name: 'Touch the Emptiness', element: 'Void', mastery: 1, description: 'Temporarily suppresses the target\'s ability to spend Void Points for several rounds.' },
  { name: "The Void's Caress", element: 'Void', mastery: 1, description: 'Deals 2k2 Void damage that bypasses Reduction and cannot be healed by magic.' },
  { name: 'Witness the Untold', element: 'Void', mastery: 1, description: 'Reads psychic impressions on an object, sensing the emotions of those who last handled it.' },

  // ── Void Mastery Level 2 ──
  { name: 'Altering the Course', element: 'Void', mastery: 2, description: 'Allows the target to change one decision made this round, undoing and replacing a single action.' },
  { name: 'Drink of Your Essence', element: 'Void', mastery: 2, description: 'Drains a Void Point from the target and transfers it to you.' },
  { name: 'The Empty Voice', element: 'Void', mastery: 2, description: 'Speaks directly into the target\'s mind, bypassing language barriers and deafness.' },
  { name: 'False Whispers', element: 'Void', mastery: 2, description: 'Plants a false thought or impulse in the target\'s mind that they believe is their own.' },
  { name: 'Reach Through the Void', element: 'Void', mastery: 2, description: 'Teleports a small object you can see to your hand across any distance within range.' },
  { name: 'Severed from the Stream', element: 'Void', mastery: 2, description: 'Blocks the target from accessing the Void entirely, preventing Void Point use and Void spells.' },

  // ── Void Mastery Level 3 ──
  { name: 'Echoes in the Void', element: 'Void', mastery: 3, description: 'Views past events that occurred at a location by reading impressions left in the Void.' },
  { name: 'Kharmic Intent', element: 'Void', mastery: 3, description: 'Senses the true intentions and destiny of a target, revealing their Advantages and Disadvantages.' },
  { name: 'Moment of Clarity', element: 'Void', mastery: 3, description: 'Grants a flash of perfect insight, allowing the target to succeed at one roll automatically.' },
  { name: 'Read the Essence', element: 'Void', mastery: 3, description: 'Reveals all of the target\'s Rings, Traits, and current Void Point total.' },
  { name: 'Void Release', element: 'Void', mastery: 3, description: 'Dispels any one magical effect currently active on the target by unraveling its connection to the Void.' },

  // ── Void Mastery Level 4 ──
  { name: 'Draw Closed the Veil', element: 'Void', mastery: 4, description: 'Seals a breach between realms, closing a portal or preventing spirits from crossing over.' },
  { name: 'Fill the Emptiness', element: 'Void', mastery: 4, description: 'Restores all Void Points to the target, filling their spiritual reserves completely.' },
  { name: 'Void Strike', element: 'Void', mastery: 4, description: 'Deals 5k5 Void damage that cannot be reduced or healed by any means except rest.' },

  // ── Void Mastery Level 5 ──
  { name: 'Divide the Soul', element: 'Void', mastery: 5, description: 'Separates the target\'s soul from their body temporarily, leaving them helpless.' },
  { name: 'Reforge', element: 'Void', mastery: 5, description: 'Permanently alters one of the target\'s Traits, raising or lowering it by one rank.' },
  { name: 'Unbound Essence', element: 'Void', mastery: 5, description: 'Strips all magical effects, enchantments, and kami bindings from a target or area.' },

  // ── Void Mastery Level 6 ──
  { name: 'Ring of the Void', element: 'Void', mastery: 6, description: 'Permanently increases the target\'s Void Ring by one, but can only affect each person once.' },
  { name: 'Rise from the Ashes', element: 'Void', mastery: 6, description: 'Brings a recently deceased person back to life, restoring their soul to their body.' },
  { name: 'Unmake the World', element: 'Void', mastery: 6, description: 'Utterly destroys a single target by erasing their existence from reality; no save if successful.' },
]
