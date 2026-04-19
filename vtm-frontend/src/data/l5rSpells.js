// L5R 4th Edition Spell catalog — expanded from lasthaiku.wikidot.com

export const L5R_SPELLS = [
  // ══════════════════════════════════════
  //  AIR SPELLS
  // ══════════════════════════════════════

  // ── Air Mastery Level 1 ──
  { name: "Arrow's Flight", element: 'Air', mastery: 1, description: 'Guides a ranged projectile with air kami, improving accuracy.' },
  { name: 'Blessed Wind', element: 'Air', mastery: 1, description: 'Creates a barrier of swirling wind that increases your Armor TN.' },
  { name: 'By the Light of the Moon', element: 'Air', mastery: 1, description: 'Reveals illusions and invisible creatures within the area of effect.' },
  { name: 'Cloak of Night', element: 'Air', mastery: 1, description: 'Wraps the target in shadow, adding your Air Ring to Stealth rolls.' },
  { name: 'Gathering Swirl', element: 'Air', mastery: 1, description: 'Creates a small whirlwind that gathers loose objects in the area.' },
  { name: 'Legacy of Kaze-no-Kami', element: 'Air', mastery: 1, description: 'Causes a powerful gust of wind that can knock prone or push back targets.' },
  { name: "Nature's Touch", element: 'Air', mastery: 1, description: 'Commune with air kami to learn about weather patterns and recent events in the area.' },
  { name: 'Tempest of Air', element: 'Air', mastery: 1, description: 'Deals 2k2 air damage to a target within range.' },
  { name: 'Token of Memory', element: 'Air', mastery: 1, description: 'Implants a brief mental image or message into an object that can be perceived by another.' },
  { name: 'To Seek the Truth', element: 'Air', mastery: 1, description: 'Detects whether the target is telling the truth by reading subtle air currents.' },
  { name: 'Voice of the Wind', element: 'Air', mastery: 1, description: 'Projects your voice over a great distance carried by the wind.' },
  { name: 'Way of Deception', element: 'Air', mastery: 1, description: 'Adds your Air Ring to a Sincerity (Deceit) roll to conceal your true intentions.' },
  { name: 'Yari of Air', element: 'Air', mastery: 1, description: 'Summons a spear of solidified air that uses your Air Ring for attack and damage rolls.' },

  // ── Air Mastery Level 2 ──
  { name: "Benten's Touch", element: 'Air', mastery: 2, description: 'Enhances the target\'s physical beauty and social grace, adding to social skill rolls.' },
  { name: 'Blessed Wind of Lady Sun', element: 'Air', mastery: 2, description: 'Creates a protective ward of blessed wind against Shadowlands creatures.' },
  { name: 'Call Upon the Wind', element: 'Air', mastery: 2, description: 'Allows you to fly for a short duration, moving through the air at your Water speed.' },
  { name: 'Elemental Cipher', element: 'Air', mastery: 2, description: 'Encodes a written message so only the intended recipient can read it.' },
  { name: 'Flight of Doves', element: 'Air', mastery: 2, description: 'Sends a written message to a distant person via a spirit-guided paper bird.' },
  { name: 'Freedom of the Air', element: 'Air', mastery: 2, description: 'Removes physical restraints and bindings from the target using air kami.' },
  { name: 'Heart Betrays Eyes', element: 'Air', mastery: 2, description: 'Reveals the true emotions of the target despite any attempts to hide them.' },
  { name: 'Hidden Visage', element: 'Air', mastery: 2, description: 'Makes the target completely forgettable; others cannot recall their face or presence.' },
  { name: "The Kami's Whisper", element: 'Air', mastery: 2, description: 'Sends a short verbal message to a specific person you know, regardless of distance.' },
  { name: 'Mists of Illusion', element: 'Air', mastery: 2, description: 'Creates a visual illusion up to the size of a small building that lasts several minutes.' },
  { name: 'Quiescence of Air', element: 'Air', mastery: 2, description: 'Calms strong winds and suppresses air-based effects in the area.' },
  { name: 'Request to Hato-no-Kami', element: 'Air', mastery: 2, description: 'Summons a dove spirit to carry a physical message to a distant location.' },
  { name: 'Secrets on the Wind', element: 'Air', mastery: 2, description: 'Eavesdrops on a conversation within a long distance by listening through the air kami.' },
  { name: 'Whispering Wind', element: 'Air', mastery: 2, description: 'Carries a spoken message of up to ten words on the wind to a person you can see.' },
  { name: 'Wind-Born Slumbers', element: 'Air', mastery: 2, description: 'Lulls the target into a deep magical sleep with soothing air kami.' },
  { name: "Wolf's Proposal", element: 'Air', mastery: 2, description: 'Forces the target to speak honestly for the duration by binding air kami around their throat.' },

  // ── Air Mastery Level 3 ──
  { name: "Air Kami's Blessing", element: 'Air', mastery: 3, description: 'Temporarily increases the target\'s Air Ring for the spell\'s duration.' },
  { name: 'Essence of Air', element: 'Air', mastery: 3, description: 'Permanently increases the target\'s Air Ring by one, but can only affect each person once.' },
  { name: 'The Eye Shall Not See', element: 'Air', mastery: 3, description: 'Renders the target invisible for the spell\'s duration; attacking breaks the effect.' },
  { name: 'Garbled Tongue', element: 'Air', mastery: 3, description: 'Scrambles the target\'s speech so they cannot communicate coherently.' },
  { name: 'Mask of Wind', element: 'Air', mastery: 3, description: 'Disguises the target\'s appearance completely, including voice and scent, for several hours.' },
  { name: "Master Cloud's Eyes", element: 'Air', mastery: 3, description: 'Allows the caster to see through clouds, fog, and other air-based obscurement.' },
  { name: 'Soul of Kaze-no-Kami', element: 'Air', mastery: 3, description: 'Channels the essence of the wind kami to vastly increase movement speed.' },
  { name: 'Striking the Storm', element: 'Air', mastery: 3, description: 'Deals 4k4 air damage to all targets in a wide area around the caster.' },
  { name: 'Summoning the Gale', element: 'Air', mastery: 3, description: 'Creates a powerful windstorm that impedes ranged attacks and movement in a large area.' },
  { name: 'Summon Fog', element: 'Air', mastery: 3, description: 'Fills a large area with dense fog, heavily obscuring vision and reducing ranged attack effectiveness.' },
  { name: "Touch of Air's Grace", element: 'Air', mastery: 3, description: 'Grants supernatural grace and agility, adding to Reflexes-based rolls.' },
  { name: "Your Heart's Enemy", element: 'Air', mastery: 3, description: 'Creates an illusory duplicate of the target\'s most feared enemy that only they can see.' },

  // ── Air Mastery Level 4 ──
  { name: 'Call the Spirit', element: 'Air', mastery: 4, description: 'Summons an air elemental of considerable power to serve you for a limited time.' },
  { name: 'Castle of Air', element: 'Air', mastery: 4, description: 'Creates an illusory fortress that appears completely real to all senses.' },
  { name: 'False Realm', element: 'Air', mastery: 4, description: 'Creates an elaborate illusory environment covering a large area that fools all senses.' },
  { name: 'Funeral Rites', element: 'Air', mastery: 4, description: 'Performs spiritual funeral rites that protect the deceased from being raised as undead.' },
  { name: 'Gift of Wind', element: 'Air', mastery: 4, description: 'Grants the target the ability to fly freely for the spell\'s duration.' },
  { name: 'Howl of Isora', element: 'Air', mastery: 4, description: 'Unleashes a devastating howling wind that deafens and disorients all in the area.' },
  { name: 'Know the Mind', element: 'Air', mastery: 4, description: 'Reads the target\'s surface thoughts for the duration of the spell.' },
  { name: 'Look into the Soul', element: 'Air', mastery: 4, description: 'Reveals the target\'s true nature, spiritual allegiances, and hidden qualities.' },
  { name: 'Netsuke of Wind', element: 'Air', mastery: 4, description: 'Binds an air spell of Mastery 3 or lower into a small object for later activation.' },
  { name: 'Seeking the Way', element: 'Air', mastery: 4, description: 'Guides the caster along the safest or most direct path to a destination.' },
  { name: 'Symbol of Air', element: 'Air', mastery: 4, description: 'Inscribes a ward that triggers an air spell effect when a specified condition is met.' },
  { name: "Tenjin's Ear", element: 'Air', mastery: 4, description: 'Grants the ability to understand and speak any language for the duration.' },
  { name: 'Whispers of the Forgotten', element: 'Air', mastery: 4, description: 'Communicates with the spirits of the dead to learn secrets they carried in life.' },
  { name: 'Wisdom of the Kami', element: 'Air', mastery: 4, description: 'Consults air kami for guidance, gaining insight into a complex problem.' },

  // ── Air Mastery Level 5 ──
  { name: 'Cloud the Mind', element: 'Air', mastery: 5, description: 'Completely controls the target\'s perceptions, making them see, hear, and feel whatever you wish.' },
  { name: 'Defender From Beyond', element: 'Air', mastery: 5, description: 'Summons a powerful spirit guardian to protect the caster in battle.' },
  { name: 'Draw Back the Shadow', element: 'Air', mastery: 5, description: 'Removes all illusions, invisibility, and magical concealment in a large area.' },
  { name: 'Echoes on the Breeze', element: 'Air', mastery: 5, description: 'Listens to past conversations that occurred in the area within the last several days.' },
  { name: 'Facing Your Devils', element: 'Air', mastery: 5, description: 'Forces the target to confront their deepest fears made manifest by illusion.' },
  { name: 'Legion of the Moon', element: 'Air', mastery: 5, description: 'Creates multiple illusory duplicates of yourself that mimic your actions in combat.' },
  { name: "Slayer's Knives", element: 'Air', mastery: 5, description: 'Launches a barrage of razor-sharp wind blades dealing 6k6 air damage to a single target.' },

  // ── Air Mastery Level 6 ──
  { name: 'Rise, Air', element: 'Air', mastery: 6, description: 'Summons a massive air elemental of tremendous power to serve you.' },
  { name: 'The False Legion', element: 'Air', mastery: 6, description: 'Creates an illusory army of hundreds of soldiers convincing enough to fool scouts and generals.' },
  { name: 'Piercing the Heavens', element: 'Air', mastery: 6, description: 'Projects the caster\'s senses beyond the mortal realm into the spirit world.' },
  { name: 'Wind of the Moon', element: 'Air', mastery: 6, description: 'Creates a supernatural moonlit wind that reveals all hidden things in a vast area.' },
  { name: 'The World is Truth', element: 'Air', mastery: 6, description: 'Dispels all illusions and deceptions across a massive area permanently.' },
  { name: 'Wrath of Kaze-no-Kami', element: 'Air', mastery: 6, description: 'Summons a devastating tornado that destroys everything in its path across a wide area.' },

  // ══════════════════════════════════════
  //  EARTH SPELLS
  // ══════════════════════════════════════

  // ── Earth Mastery Level 1 ──
  { name: 'Armor of Earth', element: 'Earth', mastery: 1, description: 'Grants the target Reduction equal to your Earth Ring for several rounds.' },
  { name: 'Courage of the Seven Thunders', element: 'Earth', mastery: 1, description: 'Removes or suppresses fear effects on the target, adding your Earth Ring to resist fear.' },
  { name: "Earth's Stagnation", element: 'Earth', mastery: 1, description: 'Reduces the target\'s Water Ring by your Earth Ring for movement purposes, slowing them.' },
  { name: "Earth's Touch", element: 'Earth', mastery: 1, description: 'Learn basic information about an area by communing with local earth kami.' },
  { name: 'Elemental Ward', element: 'Earth', mastery: 1, description: 'Creates a ward that protects against a specific element, granting Reduction against it.' },
  { name: 'Jade Strike', element: 'Earth', mastery: 1, description: 'Deals 2k2 damage, doubled against Tainted creatures and those of the Shadowlands.' },
  { name: "Jurojin's Balm", element: 'Earth', mastery: 1, description: 'Heals the target of a disease or poison by purifying their body through earth kami.' },
  { name: 'Minor Binding', element: 'Earth', mastery: 1, description: 'Binds a target in place by causing earth and stone to grip their legs.' },
  { name: 'Soul of Stone', element: 'Earth', mastery: 1, description: 'Suppresses the target\'s emotions, making them calm and granting a bonus to resist social manipulation.' },
  { name: "Stone's Endurance", element: 'Earth', mastery: 1, description: 'Grants the target increased stamina and endurance, reducing fatigue effects.' },
  { name: 'Tetsubo of Earth', element: 'Earth', mastery: 1, description: 'Summons a war club of solid stone that uses your Earth Ring for attack and damage rolls.' },

  // ── Earth Mastery Level 2 ──
  { name: 'Be the Mountain', element: 'Earth', mastery: 2, description: 'Roots yourself in place, becoming nearly impossible to move and gaining bonus Reduction.' },
  { name: 'Earth Becomes Sky', element: 'Earth', mastery: 2, description: 'Launches a stone projectile at a target, dealing 3k3 damage at range.' },
  { name: 'Embrace of Kenro-Ji-Jin', element: 'Earth', mastery: 2, description: 'Target sinks partially into the earth and is immobilized for the duration.' },
  { name: 'Force of Will', element: 'Earth', mastery: 2, description: 'Adds your Earth Ring to all Willpower-based rolls for the duration.' },
  { name: 'Grasp of Earth', element: 'Earth', mastery: 2, description: 'The ground becomes rough and broken in an area, halving movement speed for those within.' },
  { name: 'Hands of Clay', element: 'Earth', mastery: 2, description: 'Shapes earth and clay into simple objects or structures at your command.' },
  { name: "Jurojin's Curse", element: 'Earth', mastery: 2, description: 'Inflicts a disease or ailment upon the target by disrupting their body\'s earth kami.' },
  { name: 'Rites of Preservation', element: 'Earth', mastery: 2, description: 'Preserves a corpse or organic material from decay for an extended duration.' },
  { name: 'Taming the Beast', element: 'Earth', mastery: 2, description: 'Calms and pacifies an animal, making it docile and cooperative.' },
  { name: "The Mountain's Feet", element: 'Earth', mastery: 2, description: 'Grants sure footing on any terrain; the target cannot be knocked prone.' },
  { name: 'Wholeness of the World', element: 'Earth', mastery: 2, description: 'Detects the presence and general direction of Shadowlands Taint within a large area.' },
  { name: 'Whispers of the Land', element: 'Earth', mastery: 2, description: 'Communes with earth kami to learn about events that occurred on this ground.' },

  // ── Earth Mastery Level 3 ──
  { name: 'Bonds of Ningen-Do', element: 'Earth', mastery: 3, description: 'Prevents a spirit or extraplanar creature from leaving the mortal realm.' },
  { name: "Earth Kami's Blessing", element: 'Earth', mastery: 3, description: 'Temporarily increases the target\'s Earth Ring by your School Rank for several rounds.' },
  { name: "Earth's Protection", element: 'Earth', mastery: 3, description: 'Creates a barrier of stone around the target that absorbs a large amount of damage before shattering.' },
  { name: 'Earthen Wave', element: 'Earth', mastery: 3, description: 'Sends a wave of earth surging forward, damaging and knocking prone targets in its path.' },
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
  { name: 'Rise, Earth', element: 'Earth', mastery: 6, description: 'Summons a massive earth elemental of tremendous power to serve you.' },
  { name: 'Soldiers of Clay', element: 'Earth', mastery: 6, description: 'Animates a small army of clay warriors that fight on your behalf for the duration.' },

  // ══════════════════════════════════════
  //  FIRE SPELLS
  // ══════════════════════════════════════

  // ── Fire Mastery Level 1 ──
  { name: 'Biting Steel', element: 'Fire', mastery: 1, description: 'Increases a melee weapon\'s damage roll by your Fire Ring for several rounds.' },
  { name: 'Burning Kiss of Steel', element: 'Fire', mastery: 1, description: 'Sheathes a weapon in flames, adding 1k1 fire damage to each successful strike.' },
  { name: 'Elemental Crucible', element: 'Fire', mastery: 1, description: 'Heats a small object to extreme temperature, useful for forging or destroying items.' },
  { name: 'Envious Flames', element: 'Fire', mastery: 1, description: 'Causes a target to become consumed with jealousy toward a person or object you specify.' },
  { name: 'Extinguish', element: 'Fire', mastery: 1, description: 'Instantly snuffs out all fires within the area of effect, from candles to bonfires.' },
  { name: "Fire Kami's Blessing", element: 'Fire', mastery: 1, description: 'Temporarily boosts the target\'s Fire Ring for the spell\'s duration.' },
  { name: 'Fires of Purity', element: 'Fire', mastery: 1, description: 'Wraps the target in purifying flames that deal extra damage to Tainted creatures touching them.' },
  { name: 'The Fires That Cleanse', element: 'Fire', mastery: 1, description: 'Burns away Shadowlands Taint from an object, purifying it with sacred fire.' },
  { name: 'Fury of Osano-Wo', element: 'Fire', mastery: 1, description: 'Calls down a bolt of lightning on a target, dealing 3k3 electricity damage.' },
  { name: 'Gift of Amaterasu', element: 'Fire', mastery: 1, description: 'Creates a bright, warm light that illuminates a large area and comforts allies.' },
  { name: 'Katana of Fire', element: 'Fire', mastery: 1, description: 'Summons a flaming sword that uses your Fire Ring for attack and damage rolls.' },
  { name: 'Never Alone', element: 'Fire', mastery: 1, description: 'Inspires courage and determination in the target, granting a bonus to resist fear and intimidation.' },
  { name: "Osano-Wo's Blessing", element: 'Fire', mastery: 1, description: 'Protects the target from lightning and electrical damage for the duration.' },
  { name: 'The Raging Forge', element: 'Fire', mastery: 1, description: 'Heats metal to extreme temperatures, making worn armor or weapons painfully hot to hold.' },
  { name: 'Warning Flame', element: 'Fire', mastery: 1, description: 'Creates a small flame that alerts the caster when a specified condition occurs nearby.' },

  // ── Fire Mastery Level 2 ──
  { name: 'Disrupt the Aura', element: 'Fire', mastery: 2, description: 'Disrupts the target\'s magical aura, increasing the TN of their spell casting rolls.' },
  { name: 'Enticing the Dance of Flame', element: 'Fire', mastery: 2, description: 'Controls existing flames, shaping and directing fire to move where you command.' },
  { name: 'The Fires From Within', element: 'Fire', mastery: 2, description: 'Deals 3k3 fire damage that ignores Reduction, burning the target from the inside.' },
  { name: 'Hurried Steps', element: 'Fire', mastery: 2, description: 'Increases the target\'s movement speed by adding your Fire Ring to their Water for movement.' },
  { name: 'Mental Quickness', element: 'Fire', mastery: 2, description: 'Boosts the target\'s Intelligence-based rolls by adding your Fire Ring for the duration.' },
  { name: 'Purity of Shinsei', element: 'Fire', mastery: 2, description: 'Purifies food, water, or objects by burning away impurities with sacred fire.' },
  { name: 'Relentless Heat', element: 'Fire', mastery: 2, description: 'Creates an area of intense heat that causes fatigue and Wound penalties to those within.' },
  { name: 'Tail of the Fire Dragon', element: 'Fire', mastery: 2, description: 'Creates a line of fire that deals 4k4 damage to all targets in its path.' },
  { name: 'Ward of Purity', element: 'Fire', mastery: 2, description: 'Creates a ward of purifying fire that damages Tainted creatures attempting to cross it.' },
  { name: 'Wings of Fire', element: 'Fire', mastery: 2, description: 'Grants the target limited flight on wings of flame for a short duration.' },

  // ── Fire Mastery Level 3 ──
  { name: "Agasha's Shield", element: 'Fire', mastery: 3, description: 'Creates a protective shield of fire that grants Reduction and damages melee attackers.' },
  { name: 'Breath of the Fire Dragon', element: 'Fire', mastery: 3, description: 'Unleashes a cone of fire dealing 5k5 damage to all targets in the area.' },
  { name: 'Fiery Wrath', element: 'Fire', mastery: 3, description: 'Surrounds you with a nimbus of flame that damages anyone who strikes you in melee.' },
  { name: 'The Fist of Osano-Wo', element: 'Fire', mastery: 3, description: 'Calls a massive lightning bolt dealing 6k6 damage to a single target.' },
  { name: 'Haze of Battle', element: 'Fire', mastery: 3, description: 'Inflames the target\'s emotions, forcing them to attack the nearest creature indiscriminately.' },
  { name: 'Hungry Blade', element: 'Fire', mastery: 3, description: 'Enchants a weapon so it deals additional rolled damage dice on each successful hit.' },
  { name: 'Oath of the Heavens', element: 'Fire', mastery: 3, description: 'Seals a solemn oath with fire kami; breaking the oath incurs a supernatural punishment.' },
  { name: 'Ravenous Swarms', element: 'Fire', mastery: 3, description: 'Summons a swarm of biting insects that deal damage and distract targets in an area.' },
  { name: 'Shining Light', element: 'Fire', mastery: 3, description: 'Creates a brilliant burst of light that blinds all targets in the area for several rounds.' },
  { name: 'The Breath of Battle', element: 'Fire', mastery: 3, description: 'Inspires allies with the fury of fire, granting bonuses to attack rolls in combat.' },
  { name: 'Whispering Flames', element: 'Fire', mastery: 3, description: 'Allows the caster to communicate through any flame within range.' },

  // ── Fire Mastery Level 4 ──
  { name: 'Blessing of the Sun', element: 'Fire', mastery: 4, description: 'Bathes an area in purifying sunlight that heals allies and harms undead and Tainted creatures.' },
  { name: 'Death of Flame', element: 'Fire', mastery: 4, description: 'Completely extinguishes all fire, mundane and magical, in a massive area permanently.' },
  { name: 'Defense of the Firestorm', element: 'Fire', mastery: 4, description: 'Surrounds you with a raging firestorm that deals heavy damage to anyone who approaches.' },
  { name: 'Essence of Fire', element: 'Fire', mastery: 4, description: 'Permanently increases the target\'s Fire Ring by one, but can only affect each person once.' },
  { name: 'Eyes of the Phoenix', element: 'Fire', mastery: 4, description: 'Grants the ability to see through all deceptions, illusions, and disguises.' },
  { name: 'The Mending Forge', element: 'Fire', mastery: 4, description: 'Repairs a broken or damaged object by reforging it with fire kami, restoring it to full condition.' },
  { name: 'Symbol of Fire', element: 'Fire', mastery: 4, description: 'Inscribes a ward that triggers a fire spell effect when a specified condition is met.' },
  { name: 'Wall of Fire', element: 'Fire', mastery: 4, description: 'Creates a barrier of intense flame that deals heavy damage to anyone passing through it.' },
  { name: 'Ward of Thunder', element: 'Fire', mastery: 4, description: 'Creates a protective ward that strikes intruders with lightning dealing 6k6 damage.' },

  // ── Fire Mastery Level 5 ──
  { name: 'Castle of Fire', element: 'Fire', mastery: 5, description: 'Creates a fortress of solid flame that provides shelter and burns any who attempt to breach it.' },
  { name: 'Consumed by Five Fires', element: 'Fire', mastery: 5, description: 'Engulfs the target in five different types of mystical flame, dealing devastating damage.' },
  { name: 'Destructive Wave', element: 'Fire', mastery: 5, description: 'Unleashes an expanding ring of fire dealing 7k7 damage to all targets in a large radius.' },
  { name: "The Dragon's Talon", element: 'Fire', mastery: 5, description: 'Creates a powerful claw of fire that rends through armor and defenses.' },
  { name: 'Everburning Rage', element: 'Fire', mastery: 5, description: 'Sets the target ablaze with flames that cannot be extinguished by normal means, dealing ongoing damage.' },
  { name: 'Follow the Flame', element: 'Fire', mastery: 5, description: 'Transforms your body into living fire, allowing you to pass through barriers and deal damage on touch.' },
  { name: 'Light of the Sun', element: 'Fire', mastery: 5, description: 'Creates a miniature sun that illuminates a vast area and deals severe damage to undead and Shadowlands creatures.' },
  { name: 'Wings of the Phoenix', element: 'Fire', mastery: 5, description: 'Grants the target wings of flame that allow flight and deal fire damage to nearby enemies.' },

  // ── Fire Mastery Level 6 ──
  { name: 'Beam of the Inferno', element: 'Fire', mastery: 6, description: 'Fires a concentrated beam of pure fire dealing 10k10 damage to a single target.' },
  { name: 'Curse of the Burning Hand', element: 'Fire', mastery: 6, description: 'Curses a target so everything they touch bursts into flame.' },
  { name: 'Globe of the Everlasting Sun', element: 'Fire', mastery: 6, description: 'Creates a massive sphere of sunfire that illuminates and purifies a huge area, devastating Shadowlands creatures.' },
  { name: 'Rise, Fire', element: 'Fire', mastery: 6, description: 'Summons a massive fire elemental of tremendous power to serve you.' },
  { name: "The Elements' Fury", element: 'Fire', mastery: 6, description: 'Unleashes the combined fury of multiple elements in a devastating area attack.' },
  { name: "The Soul's Blade", element: 'Fire', mastery: 6, description: 'Creates a weapon of pure fire that deals damage directly to the target\'s soul, ignoring all physical defenses.' },

  // ══════════════════════════════════════
  //  WATER SPELLS
  // ══════════════════════════════════════

  // ── Water Mastery Level 1 ──
  { name: 'Bo of Water', element: 'Water', mastery: 1, description: 'Summons a staff of solid water that uses your Water Ring for attack and damage rolls.' },
  { name: 'Clarity of Purpose', element: 'Water', mastery: 1, description: 'Removes confusion, daze, and similar mental impairments from the target.' },
  { name: 'Ebbing Strength', element: 'Water', mastery: 1, description: 'Reduces the target\'s Strength by your Water Ring for the duration.' },
  { name: 'Path to Inner Peace', element: 'Water', mastery: 1, description: 'Heals a number of Wounds equal to your Water Ring plus School Rank.' },
  { name: 'Purification of the Kami', element: 'Water', mastery: 1, description: 'Cleanses water or food of impurities and contaminants using water kami.' },
  { name: 'Reflections of Pan Ku', element: 'Water', mastery: 1, description: 'Creates a perfect visual duplicate of a small object made of water.' },
  { name: 'Reversal of Fortunes', element: 'Water', mastery: 1, description: 'Transfers Wound penalties from the target to another creature you designate.' },
  { name: 'Speed of the Waterfall', element: 'Water', mastery: 1, description: 'Increases the target\'s Initiative Score by adding your Water Ring twice.' },
  { name: 'Spirit of the Water', element: 'Water', mastery: 1, description: 'Commune with water kami to learn about recent events near a body of water.' },
  { name: "Suitengu's Curse", element: 'Water', mastery: 1, description: 'Causes the target to become dehydrated and weakened by disrupting their water kami.' },
  { name: 'Sympathetic Energies', element: 'Water', mastery: 1, description: 'Links two targets so that healing applied to one also partially heals the other.' },
  { name: 'The Rushing Wave', element: 'Water', mastery: 1, description: 'Creates a wave of water that knocks targets prone and pushes them back.' },
  { name: 'The Swell of the Storm', element: 'Water', mastery: 1, description: 'Creates rough waters and dangerous swells in a body of water.' },

  // ── Water Mastery Level 2 ──
  { name: 'Cloak of the Miya', element: 'Water', mastery: 2, description: 'Protects the target from environmental effects like heat, cold, and harsh weather.' },
  { name: "Heaven's Tears", element: 'Water', mastery: 2, description: 'Summons a rainstorm in the local area that can extinguish fires and soak the ground.' },
  { name: "Inari's Blessing", element: 'Water', mastery: 2, description: 'Purifies food and water, removing poisons and spoilage, enough to feed several people.' },
  { name: 'Judgment of Yomi', element: 'Water', mastery: 2, description: 'Reveals whether a target has committed a specific transgression by reading their water kami.' },
  { name: 'Reflective Pool', element: 'Water', mastery: 2, description: 'Uses a pool of water to scry on a distant location or person you have seen before.' },
  { name: 'Rejuvenating Vapors', element: 'Water', mastery: 2, description: 'Creates a mist that heals all allies within the area for a small amount of Wounds each round.' },
  { name: 'Stand Against the Waves', element: 'Water', mastery: 2, description: 'Increases the target\'s Strength by your Water Ring for the duration.' },
  { name: 'Strength of the Tsunami', element: 'Water', mastery: 2, description: 'Greatly enhances the target\'s physical power with the force of a tidal wave.' },
  { name: 'Surging Soul', element: 'Water', mastery: 2, description: 'Fills the target with vibrant energy, removing fatigue and exhaustion effects.' },
  { name: 'The Ties That Bind', element: 'Water', mastery: 2, description: 'Creates tendrils of water that grapple and restrain a target in place.' },
  { name: 'Wave-Borne Speed', element: 'Water', mastery: 2, description: 'Greatly increases the target\'s movement speed, doubling their Water for movement purposes.' },
  { name: 'Wisdom and Clarity', element: 'Water', mastery: 2, description: 'Enhances the target\'s Perception-based rolls by adding your Water Ring for the duration.' },
  { name: "Yuki's Touch", element: 'Water', mastery: 2, description: 'Freezes a small area or object with a touch of supernatural cold.' },

  // ── Water Mastery Level 3 ──
  { name: 'Endless Deluge', element: 'Water', mastery: 3, description: 'Creates a torrential downpour that floods an area and hampers movement and visibility.' },
  { name: 'Near to Ice', element: 'Water', mastery: 3, description: 'Freezes a body of water or creates an area of ice that causes difficult terrain and slip hazards.' },
  { name: 'Regrow the Wound', element: 'Water', mastery: 3, description: 'Heals severe injuries including broken bones, restoring a large number of Wounds.' },
  { name: 'Sanctuary of the Waves', element: 'Water', mastery: 3, description: 'Creates a protective dome of water that shields those within from attacks.' },
  { name: 'Silent Waters', element: 'Water', mastery: 3, description: 'Creates a zone of absolute silence where no sound can be made or heard.' },
  { name: 'Strike of the Tsunami', element: 'Water', mastery: 3, description: 'Deals 4k4 water damage and knocks the target prone with a powerful blast of water.' },
  { name: 'The Inner Ocean', element: 'Water', mastery: 3, description: 'Allows the caster to sense and manipulate the water within a living body.' },
  { name: "Typhoon's Surge", element: 'Water', mastery: 3, description: 'Creates a powerful surge of wind and water that devastates an area.' },
  { name: 'Visions of the Future', element: 'Water', mastery: 3, description: 'Grants a brief prophetic vision of possible future events related to a question you ask.' },
  { name: 'Walking Upon the Waves', element: 'Water', mastery: 3, description: 'Allows the target to walk on the surface of water as if it were solid ground.' },
  { name: "Water Kami's Blessing", element: 'Water', mastery: 3, description: 'Temporarily increases the target\'s Water Ring by your School Rank for several rounds.' },

  // ── Water Mastery Level 4 ──
  { name: 'Dominion of Suitengu', element: 'Water', mastery: 4, description: 'Grants complete control over a large body of water, shaping currents and waves at will.' },
  { name: 'Ebb and Flow of Battle', element: 'Water', mastery: 4, description: 'Redistributes Wounds among all willing targets in the area, balancing injuries evenly.' },
  { name: 'Heart of the Water Dragon', element: 'Water', mastery: 4, description: 'Allows the target to breathe underwater and swim at full speed for an extended duration.' },
  { name: 'Master of the Rolling River', element: 'Water', mastery: 4, description: 'Grants complete control over the flow and direction of a river or stream.' },
  { name: "The Mirror's Smile", element: 'Water', mastery: 4, description: 'Creates a water duplicate of the caster that can act independently for a short time.' },
  { name: 'Seed of Qanan', element: 'Water', mastery: 4, description: 'Plants a spiritual seed that grows into a healing spring over time.' },
  { name: 'Steed of the Ebbing Tides', element: 'Water', mastery: 4, description: 'Creates a mount made of water that can travel over any terrain at great speed.' },
  { name: 'Strike of the Flowing Waters', element: 'Water', mastery: 4, description: 'Deals 6k6 water damage that ignores Reduction, striking with the unstoppable force of a river.' },
  { name: 'Symbol of Water', element: 'Water', mastery: 4, description: 'Inscribes a ward that triggers a water spell effect when a specified condition is met.' },
  { name: "The Emperor's Road", element: 'Water', mastery: 4, description: 'Creates a path of solid water that allows rapid travel across any terrain.' },
  { name: 'The Path Not Taken', element: 'Water', mastery: 4, description: 'Allows the target to reroll a single roll they made this round, taking the new result.' },
  { name: 'Within the Waves', element: 'Water', mastery: 4, description: 'Allows the target to merge with and travel through bodies of water.' },

  // ── Water Mastery Level 5 ──
  { name: 'Chi Reversal', element: 'Water', mastery: 5, description: 'Reverses the flow of chi in a target, converting healing into damage and vice versa.' },
  { name: 'Ever-Changing Waves', element: 'Water', mastery: 5, description: 'Transforms the target\'s body into water, granting immunity to physical attacks for the duration.' },
  { name: 'The Final Bond', element: 'Water', mastery: 5, description: 'Links your life force to another; if one would die, Wounds are shared between both.' },
  { name: 'Hands of the Tides', element: 'Water', mastery: 5, description: 'Creates massive hands of water that can grapple, crush, or hurl targets with enormous force.' },
  { name: 'Open the Waves', element: 'Water', mastery: 5, description: 'Parts a body of water, creating a dry path through it for the duration.' },
  { name: 'Power of the Ocean', element: 'Water', mastery: 5, description: 'Summons a massive tidal wave that devastates a large area, dealing severe damage to all within.' },
  { name: "Suitengu's Embrace", element: 'Water', mastery: 5, description: 'Fills the target\'s lungs with water, dealing ongoing drowning damage each round.' },
  { name: 'Whirlpool', element: 'Water', mastery: 5, description: 'Creates a powerful whirlpool in a body of water that drags creatures and objects to its center.' },

  // ── Water Mastery Level 6 ──
  { name: 'Breath of Mist', element: 'Water', mastery: 6, description: 'Transforms the caster into a cloud of mist, granting intangibility and flight.' },
  { name: 'Opening the Veil', element: 'Water', mastery: 6, description: 'Opens a passage between the mortal realm and the spirit world.' },
  { name: 'Peace of the Kami', element: 'Water', mastery: 6, description: 'Heals all Wounds on every ally within a large area and removes all status effects.' },
  { name: 'Rise, Water', element: 'Water', mastery: 6, description: 'Summons a massive water elemental of tremendous power to serve you.' },
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
  { name: 'Balance in All', element: 'Void', mastery: 2, description: 'Balances the elemental forces within a target, curing elemental imbalances and afflictions.' },
  { name: 'Commune with the Void', element: 'Void', mastery: 2, description: 'Opens a direct communion with the Void, granting deep spiritual insight.' },
  { name: 'Drink of Your Essence', element: 'Void', mastery: 2, description: 'Drains a Void Point from the target and transfers it to you.' },
  { name: 'Strengthen the Void', element: 'Void', mastery: 2, description: 'Bolsters the target\'s connection to the Void, granting bonus Void Points temporarily.' },
  { name: 'The Empty Voice', element: 'Void', mastery: 2, description: 'Speaks directly into the target\'s mind, bypassing language barriers and deafness.' },
  { name: 'False Whispers', element: 'Void', mastery: 2, description: 'Plants a false thought or impulse in the target\'s mind that they believe is their own.' },
  { name: 'Reach Through the Void', element: 'Void', mastery: 2, description: 'Teleports a small object you can see to your hand across any distance within range.' },
  { name: 'Severed from the Stream', element: 'Void', mastery: 2, description: 'Blocks the target from accessing the Void entirely, preventing Void Point use and Void spells.' },

  // ── Void Mastery Level 3 ──
  { name: 'Banish the Void', element: 'Void', mastery: 3, description: 'Dispels Void-based effects and suppresses Void magic in an area.' },
  { name: 'Echoes in the Void', element: 'Void', mastery: 3, description: 'Views past events that occurred at a location by reading impressions left in the Void.' },
  { name: 'Kharmic Intent', element: 'Void', mastery: 3, description: 'Senses the true intentions and destiny of a target, revealing their Advantages and Disadvantages.' },
  { name: 'Moment of Clarity', element: 'Void', mastery: 3, description: 'Grants a flash of perfect insight, allowing the target to succeed at one roll automatically.' },
  { name: 'Read the Essence', element: 'Void', mastery: 3, description: 'Reveals all of the target\'s Rings, Traits, and current Void Point total.' },
  { name: 'Void Release', element: 'Void', mastery: 3, description: 'Dispels any one magical effect currently active on the target by unraveling its connection to the Void.' },

  // ── Void Mastery Level 4 ──
  { name: 'Balance of Elements', element: 'Void', mastery: 4, description: 'Negates all Disadvantages on the target and heals Wounds by restoring their pattern.' },
  { name: 'Dart of Void', element: 'Void', mastery: 4, description: 'Launches a bolt of pure Void energy that deals damage and disrupts the target\'s spiritual essence.' },
  { name: 'Draw Closed the Veil', element: 'Void', mastery: 4, description: 'Seals a breach between realms, closing a portal or preventing spirits from crossing over.' },
  { name: 'Essence of Void', element: 'Void', mastery: 4, description: 'Permanently increases the target\'s Void Ring by one, but can only affect each person once.' },
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

  // ══════════════════════════════════════
  //  UNIVERSAL SPELLS
  // ══════════════════════════════════════

  // ── Universal Mastery Level 1 ──
  { name: 'Commune', element: 'Universal', mastery: 1, description: 'Speaks with a local elemental kami, asking it questions which it answers honestly.' },
  { name: 'Sense', element: 'Universal', mastery: 1, description: 'Senses the presence, quantity, and rough location of elemental spirits of a chosen element.' },
  { name: 'Summon', element: 'Universal', mastery: 1, description: 'Summons a modest quantity of a chosen element, creating it from nothing.' },
  { name: 'Command', element: 'Universal', mastery: 1, description: 'Commands elemental kami directly rather than entreating them, forcing them to obey.' },

  // ── Universal Mastery Level 2 ──
  { name: 'Transmute', element: 'Universal', mastery: 2, description: 'Transforms the elements within a physical object into other elements.' },

  // ══════════════════════════════════════
  //  MULTI-ELEMENT SPELLS
  // ══════════════════════════════════════

  // ── Multi Mastery Level 2 ──
  { name: 'Fire and Water', element: 'Multi', mastery: 2, description: 'Unleashes a cloud of scalding steam that deals damage and impairs vision.' },
  { name: 'Water and Air', element: 'Multi', mastery: 2, description: 'Grants long-distance aerial divination through a body of still water.' },
  { name: 'Water and Earth', element: 'Multi', mastery: 2, description: 'Reduces ground to sticky impassable mud, slowing movement and penalizing Agility.' },
  { name: 'Cleansing the Body', element: 'Multi', mastery: 2, description: 'Cleanses the target of filth and grants bonuses to resist disease, poison, and Taint.' },

  // ── Multi Mastery Level 3 ──
  { name: 'Air and Earth', element: 'Multi', mastery: 3, description: 'Blasts a cyclone of wind and stone dealing jade damage and knocking targets prone.' },
  { name: 'Fire and Air', element: 'Multi', mastery: 3, description: 'Combines a blast of flame with air spirits to damage enemies and fly to safety.' },
  { name: 'Wrath of the Sun', element: 'Multi', mastery: 3, description: 'Unleashes searing light and a concussive blast that damages, blinds, and knocks prone.' },
  { name: 'Stifling Wind', element: 'Multi', mastery: 3, description: 'Creates a choking cloud of dust that blinds and suffocates those within.' },

  // ── Multi Mastery Level 4 ──
  { name: 'Earth and Fire', element: 'Multi', mastery: 4, description: 'Blasts searing magma from the ground dealing jade damage and knocking targets prone.' },
  { name: "The Mountain's Wrath", element: 'Multi', mastery: 4, description: 'Sheathes the caster in stone and flame, granting Reduction and burning attackers.' },
  { name: 'Whispering Flames (Multi)', element: 'Multi', mastery: 4, description: 'Creates a transfixing illusion of fire and air that mesmerizes all who see it.' },
  { name: 'Drown the Spirit', element: 'Multi', mastery: 4, description: 'Uses Void to turn the target\'s internal Air and Water kami against them, reducing Strength.' },

  // ── Multi Mastery Level 5 ──
  { name: 'Soul Sword', element: 'Multi', mastery: 5, description: 'Creates a 5k4 katana of pure elemental power that ignores armor and is both jade and crystal.' },

  // ══════════════════════════════════════
  //  MAHO SPELLS
  // ══════════════════════════════════════

  // ── Maho Mastery Level 1 ──
  { name: 'Bleeding', element: 'Maho', mastery: 1, description: 'Causes the target\'s wounds to bleed profusely, preventing natural healing.' },
  { name: 'Blood Rite', element: 'Maho', mastery: 1, description: 'Uses spilled blood to power a dark ritual, fueling other maho spells.' },
  { name: 'Blood and Darkness', element: 'Maho', mastery: 1, description: 'Creates an area of supernatural darkness fueled by blood sacrifice.' },
  { name: 'Disrupt the Limb', element: 'Maho', mastery: 1, description: 'Cripples one of the target\'s limbs, rendering it temporarily useless.' },
  { name: 'Heart of the Damned', element: 'Maho', mastery: 1, description: 'Fills the target\'s heart with dark energy, making them susceptible to corruption.' },
  { name: 'Inspire Fear', element: 'Maho', mastery: 1, description: 'Fills the target with supernatural terror, causing them to flee or cower.' },
  { name: 'Legacy of the Dark One', element: 'Maho', mastery: 1, description: 'Channels the power of Fu Leng to enhance dark magic abilities.' },
  { name: 'Purge the Weak', element: 'Maho', mastery: 1, description: 'Drains the life force of weak or injured targets to fuel the caster\'s power.' },
  { name: 'Sinful Dreams', element: 'Maho', mastery: 1, description: 'Invades the target\'s sleep with nightmares that prevent restful sleep and recovery.' },
  { name: 'Suck the Marrow', element: 'Maho', mastery: 1, description: 'Drains physical vitality from the target, weakening their body.' },
  { name: 'Summon Undead Champion', element: 'Maho', mastery: 1, description: 'Raises a fallen warrior as an undead servant to fight on the caster\'s behalf.' },
  { name: 'Symbol of Blood', element: 'Maho', mastery: 1, description: 'Inscribes a blood ward that triggers a maho effect when a condition is met.' },
  { name: 'Ward of Divine Peace', element: 'Maho', mastery: 1, description: 'Creates a ward that suppresses aggressive impulses in those who enter the area.' },
  { name: 'Written in Blood', element: 'Maho', mastery: 1, description: 'Creates a blood-written message that can only be read by the intended recipient.' },

  // ── Maho Mastery Level 2 ──
  { name: 'Caress of Fu Leng', element: 'Maho', mastery: 2, description: 'Channels the dark touch of Fu Leng to inflict Taint on the target.' },
  { name: 'Curse of the Clan', element: 'Maho', mastery: 2, description: 'Places a curse on a target that brings misfortune to their entire family line.' },
  { name: 'Curse of the Kansen', element: 'Maho', mastery: 2, description: 'Summons kansen to torment the target, disrupting their ability to cast spells.' },
  { name: 'Curse of the Unblinking Eye', element: 'Maho', mastery: 2, description: 'Prevents the target from sleeping, causing mounting fatigue and eventual madness.' },
  { name: 'Curse of Weakness', element: 'Maho', mastery: 2, description: 'Saps the target\'s physical strength, reducing their combat effectiveness.' },
  { name: 'Dark Wings', element: 'Maho', mastery: 2, description: 'Grants the caster dark wings of shadow that allow flight.' },
  { name: 'Drain the Soul', element: 'Maho', mastery: 2, description: 'Drains spiritual energy from the target, stealing their Void Points.' },
  { name: 'Eternal Unrest', element: 'Maho', mastery: 2, description: 'Prevents a corpse from finding peace, causing it to rise as a restless undead.' },
  { name: 'Gift of the Maker', element: 'Maho', mastery: 2, description: 'Grants the target a dark gift from the Shadowlands, enhancing one ability at a terrible cost.' },
  { name: 'Pain', element: 'Maho', mastery: 2, description: 'Inflicts excruciating pain on the target without causing physical damage.' },
  { name: 'Puppet Master', element: 'Maho', mastery: 2, description: 'Takes control of the target\'s body, forcing them to act against their will.' },
  { name: 'Spreading the Darkness', element: 'Maho', mastery: 2, description: 'Extends the Shadowlands Taint to the surrounding area, corrupting the land.' },

  // ── Maho Mastery Level 3 ──
  { name: 'Armor of Obsidian', element: 'Maho', mastery: 3, description: 'Encases the caster in dark obsidian armor that grants powerful Reduction.' },
  { name: 'Dancing with Demons', element: 'Maho', mastery: 3, description: 'Allows the caster to communicate with and bargain with oni and demons.' },
  { name: 'Death Beyond Life', element: 'Maho', mastery: 3, description: 'Creates a powerful undead creature from a corpse with enhanced abilities.' },
  { name: 'Essence of Undeath', element: 'Maho', mastery: 3, description: 'Grants the caster undead traits temporarily, including immunity to pain and fear.' },
  { name: "Hate's Heart", element: 'Maho', mastery: 3, description: 'Fills the target with consuming hatred toward a person or group you designate.' },
  { name: 'Mists of Fear', element: 'Maho', mastery: 3, description: 'Creates a dark mist that causes supernatural terror in all who enter it.' },
  { name: 'Summon Oni', element: 'Maho', mastery: 3, description: 'Summons a lesser oni from Jigoku to serve the caster for a limited time.' },
  { name: 'Symbol of the Bloodspeaker', element: 'Maho', mastery: 3, description: 'Inscribes a powerful blood ward associated with the Bloodspeaker cult.' },

  // ── Maho Mastery Level 4 ──
  { name: 'Burning Blood', element: 'Maho', mastery: 4, description: 'Causes the target\'s blood to boil within their veins, dealing severe internal damage.' },
  { name: 'Chains of Jigoku', element: 'Maho', mastery: 4, description: 'Summons dark chains from Jigoku that bind and restrain the target with supernatural force.' },
  { name: 'No Pure Breaths', element: 'Maho', mastery: 4, description: 'Corrupts the air around the target, making every breath spread the Taint.' },
  { name: 'Stealing the Soul', element: 'Maho', mastery: 4, description: 'Tears the target\'s soul from their body, trapping it in an object.' },
  { name: 'Tomb of Earth', element: 'Maho', mastery: 4, description: 'Buries the target alive beneath corrupted earth that resists escape.' },
  { name: 'Truth is a Scourge', element: 'Maho', mastery: 4, description: 'Forces the target to speak the truth while causing them agonizing pain.' },

  // ── Maho Mastery Level 5 ──
  { name: 'Blood Armor', element: 'Maho', mastery: 5, description: 'Creates nearly impenetrable armor from hardened blood that absorbs massive damage.' },
  { name: 'Fierce Blood of the Earth', element: 'Maho', mastery: 5, description: 'Corrupts the earth itself, causing it to attack the living with tendrils of tainted stone.' },
  { name: 'Possession', element: 'Maho', mastery: 5, description: 'Allows the caster\'s spirit to possess and completely control another person\'s body.' },
  { name: 'Strength of Darkness', element: 'Maho', mastery: 5, description: 'Grants the caster immense physical power drawn from the Shadowlands.' },
  { name: 'Touch of Death', element: 'Maho', mastery: 5, description: 'Kills the target instantly with a touch if they fail to resist the dark magic.' },

  // ── Maho Mastery Level 6 ──
  { name: 'Take the Body', element: 'Maho', mastery: 6, description: 'Permanently transfers the caster\'s soul into another person\'s body, destroying theirs.' },
]
