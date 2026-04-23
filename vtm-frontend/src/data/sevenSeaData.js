// ============================================================================
// 7th Sea 2nd Edition — Comprehensive Game Data (Part 1: Nations & Advantages)
// Sources: Core Rulebook, Nations of Theah V1 & V2, Pirate Nations,
//          Heroes & Villains, Crescent Empire, The New World,
//          Lands of Gold and Fire, Khitai, Land of 1000 Nations
// ============================================================================

// ─── TRAITS ─────────────────────────────────────────────────────────────────
export const SEVEN_SEA_TRAITS = ['Brawn', 'Finesse', 'Resolve', 'Wits', 'Panache'];
export const KHITAI_TRAITS = ['Compassion', 'Honesty', 'Joy', 'Loyalty', 'Peace', 'Respect', 'Wisdom'];

// ─── NATIONS ────────────────────────────────────────────────────────────────
export const SEVEN_SEA_NATIONS = [
  // ── Corebook Thean Nations ──
  { value: 'Avalon', traits: ['Panache', 'Resolve'], sorcery: 'Glamour', region: 'Theah', source: 'Core' },
  { value: 'Castille', traits: ['Finesse', 'Wits'], sorcery: 'Alquimia', region: 'Theah', source: 'Core' },
  { value: 'Eisen', traits: ['Brawn', 'Resolve'], sorcery: 'Hexenwerk', region: 'Theah', source: 'Core' },
  { value: 'Inismore', traits: ['Panache', 'Wits'], sorcery: 'Glamour', region: 'Theah', source: 'Core' },
  { value: 'Highland Marches', traits: ['Brawn', 'Finesse'], sorcery: 'Glamour', region: 'Theah', source: 'Core' },
  { value: 'Montaigne', traits: ['Finesse', 'Panache'], sorcery: 'Porte', region: 'Theah', source: 'Core' },
  { value: 'Sarmatian Commonwealth', traits: ['Brawn', 'Panache'], sorcery: 'Sanderis', region: 'Theah', source: 'Core' },
  { value: 'Ussura', traits: ['Resolve', 'Wits'], sorcery: 'Dar Matushki', region: 'Theah', source: 'Core' },
  { value: 'Vestenmennavenjar', traits: ['Brawn', 'Wits'], sorcery: 'Galdr', region: 'Theah', source: 'Core' },
  { value: 'Vodacce', traits: ['Finesse', 'Resolve'], sorcery: 'Sorte', region: 'Theah', source: 'Core' },

  // ── Pirate Nations (Atabean) ──
  { value: 'Aragosta', traits: ['Panache', 'Finesse'], sorcery: 'Charter Magic', region: 'Atabean', source: 'Pirate Nations' },
  { value: 'Jaragua', traits: ['Brawn', 'Finesse'], sorcery: 'Kap Sevi', region: 'Atabean', source: 'Pirate Nations' },
  { value: 'La Bucca', traits: ['Panache', 'Wits'], sorcery: 'Mohwoo', region: 'Atabean', source: 'Pirate Nations' },
  { value: 'Numa', traits: ['Resolve', 'Wits'], sorcery: 'Mystirios', region: 'Atabean', source: 'Pirate Nations' },
  { value: 'Rahuri', traits: ['Brawn', 'Resolve'], sorcery: null, region: 'Atabean', source: 'Pirate Nations' },

  // ── Crescent Empire ──
  { value: 'Anatol Ayh', traits: ['Panache', 'Wits'], sorcery: 'Art of the Second Prophet', region: 'Crescent Empire', source: 'Crescent Empire' },
  { value: 'Ashur', traits: ['Finesse', 'Wits'], sorcery: 'Nawaru', region: 'Crescent Empire', source: 'Crescent Empire' },
  { value: 'Persis', traits: ['Panache', 'Resolve'], sorcery: 'Khahesh-ahura', region: 'Crescent Empire', source: 'Crescent Empire' },
  { value: 'Sarmion', traits: ['Brawn', 'Finesse'], sorcery: 'Chozeh', region: 'Crescent Empire', source: 'Crescent Empire' },
  { value: 'Tribes of the 8th Sea', traits: ['Brawn', 'Resolve'], sorcery: 'Mithaq Alqadim', region: 'Crescent Empire', source: 'Crescent Empire' },

  // ── New World (Aztlan) ──
  { value: 'Kuraq', traits: ['Brawn', 'Resolve'], sorcery: 'Wanuy Naqay', region: 'New World', source: 'The New World' },
  { value: 'Nahuacan Alliance', traits: ['Finesse', 'Wits'], sorcery: null, region: 'New World', source: 'The New World' },
  { value: 'Tzak K\'an', traits: ['Wits', 'Panache'], sorcery: 'Wayak\' Kan', region: 'New World', source: 'The New World' },

  // ── Lands of Gold and Fire (Ifri) ──
  { value: 'Manden Kurufaba', traits: ['Panache', 'Wits'], sorcery: null, region: 'Ifri', source: 'Lands of Gold and Fire' },
  { value: 'Mbey', traits: ['Brawn', 'Resolve'], sorcery: null, region: 'Ifri', source: 'Lands of Gold and Fire' },
  { value: 'Maghreb', traits: ['Finesse', 'Resolve'], sorcery: 'Heka', region: 'Ifri', source: 'Lands of Gold and Fire' },
  { value: 'Aksum', traits: ['Finesse', 'Wits'], sorcery: 'Melbur', region: 'Ifri', source: 'Lands of Gold and Fire' },
  { value: 'Khemet', traits: ['Brawn', 'Wits'], sorcery: 'The Red Touch', region: 'Ifri', source: 'Lands of Gold and Fire' },

  // ── Khitai (uses different traits: Compassion, Honesty, Joy, Loyalty, Peace, Respect, Wisdom) ──
  { value: 'Agnivarsa', traits: ['Peace', 'Compassion'], sorcery: 'Heritage', region: 'Khitai', source: 'Khitai' },
  { value: 'Fuso', traits: ['Loyalty', 'Respect'], sorcery: 'Shamanism', region: 'Khitai', source: 'Khitai' },
  { value: 'Han', traits: ['Peace', 'Joy'], sorcery: 'Alchemy', region: 'Khitai', source: 'Khitai' },
  { value: 'Khazaria', traits: ['Honesty', 'Respect'], sorcery: null, region: 'Khitai', source: 'Khitai' },
  { value: 'Nagaja', traits: ['Loyalty', 'Wisdom'], sorcery: 'Shamanism', region: 'Khitai', source: 'Khitai' },
  { value: 'Shenzhou', traits: ['Honesty', 'Respect'], sorcery: 'Alchemy', region: 'Khitai', source: 'Khitai' },

  // ── Land of 1000 Nations (Woven Land) ──
  { value: 'Dawn Lands', traits: ['Brawn', 'Resolve'], sorcery: null, region: 'Woven Land', source: 'Land of 1000 Nations' },
  { value: 'Ono\'Enohto\'Yeh', traits: ['Finesse', 'Wits'], sorcery: null, region: 'Woven Land', source: 'Land of 1000 Nations' },
  { value: 'Sertepe Alliance', traits: ['Panache', 'Resolve'], sorcery: null, region: 'Woven Land', source: 'Land of 1000 Nations' },
];

// ─── ADVANTAGES ─────────────────────────────────────────────────────────────
// Every advantage from all 7th Sea 2e supplements, organized by source.
// nation field indicates discounted cost for that nation's heroes.

export const SEVEN_SEA_ADVANTAGES = [
  // ════════════════════════════════════════════════════════════════════════════
  // CORE RULEBOOK (79 Advantages)
  // ════════════════════════════════════════════════════════════════════════════

  // ── 1-point Advantages (Core) ──
  { name: 'Able Drinker', cost: 1, description: 'Spend a Hero Point to avoid the effects of alcohol.', source: 'Core' },
  { name: 'Cast Iron Stomach', cost: 1, description: 'Spend a Hero Point to ignore poison effects for a scene.', source: 'Core' },
  { name: 'Direction Sense', cost: 1, description: 'Always know which way is north; never get lost.', source: 'Core' },
  { name: 'Foreign Born', cost: 1, description: 'Choose a second Nation; gain its bonus.', source: 'Core' },
  { name: 'Large', cost: 1, description: '+1 Bonus Die on Intimidate; take hits better but harder to hide.', source: 'Core' },
  { name: 'Linguist', cost: 1, description: 'Speak, read, and write all Thean languages.', source: 'Core' },
  { name: 'Sea Legs', cost: 1, description: 'Never suffer penalties from rough seas or unsteady ground.', source: 'Core' },
  { name: 'Small', cost: 1, description: '+1 Bonus Die on Hide; squeeze through tight spaces.', source: 'Core' },
  { name: 'Survivalist', cost: 1, description: 'Spend a Hero Point to find food/water/shelter in the wild.', source: 'Core' },
  { name: 'Time Sense', cost: 1, description: 'Always know what time it is; excellent internal clock.', source: 'Core' },

  // ── 2-point Advantages (Core) ──
  { name: 'Barterer', cost: 2, description: 'Spend a Hero Point to find a buyer or seller for any item.', source: 'Core', nation: 'Glamour Isles' },
  { name: 'Come Hither', cost: 2, description: 'Spend a Hero Point to charm someone into a private conversation.', source: 'Core' },
  { name: 'Connection', cost: 2, description: 'Spend a Hero Point to reveal a helpful contact in the current area.', source: 'Core' },
  { name: 'Disarming Smile', cost: 2, description: 'Spend a Hero Point to keep someone from attacking for one Round.', source: 'Core' },
  { name: 'Eagle Eyes', cost: 2, description: 'Spend a Hero Point to see fine details at great distance.', source: 'Core' },
  { name: 'Extended Family', cost: 2, description: 'Spend a Hero Point to find a relative in the current area.', source: 'Core' },
  { name: 'Fascinate', cost: 2, description: 'Spend a Hero Point to hold a target\'s attention with performance.', source: 'Core' },
  { name: 'Friend at Court', cost: 2, description: 'Spend a Hero Point to get an audience with a noble.', source: 'Core' },
  { name: 'Got It!', cost: 2, description: 'Spend a Hero Point to reveal you brought a useful mundane item.', source: 'Core' },
  { name: 'Handy', cost: 2, description: 'Spend a Hero Point to repair a broken item temporarily.', source: 'Core' },
  { name: 'Indomitable Will', cost: 2, description: 'Spend a Hero Point to resist fear or intimidation for a scene.', source: 'Core' },
  { name: 'Inspire Generosity', cost: 2, description: 'Spend a Hero Point to convince someone to donate to your cause.', source: 'Core' },
  { name: 'Leadership', cost: 2, description: 'Spend a Hero Point to rally allies, giving them +1 die.', source: 'Core', nation: 'Sarmatian Commonwealth' },
  { name: 'Staredown', cost: 2, description: 'Spend a Hero Point to intimidate an opponent into backing down.', source: 'Core', nation: 'Eisen' },
  { name: 'Streetwise', cost: 2, description: 'Spend a Hero Point to find the local criminal underworld.', source: 'Core' },
  { name: 'Team Player', cost: 2, description: 'Spend a Hero Point to give your Raises to an ally.', source: 'Core' },
  { name: 'Valiant Spirit', cost: 2, description: 'Spend a Hero Point to resist supernatural fear or compulsion.', source: 'Core' },

  // ── 3-point Advantages (Core) ──
  { name: 'An Honest Misunderstanding', cost: 3, description: 'Spend a Hero Point to have been elsewhere when accused.', source: 'Core' },
  { name: 'Bar Fighter', cost: 3, description: 'Spend a Hero Point to improvise a weapon from your surroundings.', source: 'Core' },
  { name: 'Boxer', cost: 3, description: 'Spend a Hero Point to knock out a target with a bare-fisted strike.', source: 'Core' },
  { name: 'Bruiser', cost: 3, description: '+1 Bonus Die when using a heavy melee weapon.', source: 'Core' },
  { name: 'Brush Pass', cost: 3, description: 'Spend a Hero Point to slip a small item to someone unnoticed.', source: 'Core' },
  { name: 'Camaraderie', cost: 3, description: 'Spend a Hero Point to inspire your allies to fight harder.', source: 'Core', nation: 'Montaigne' },
  { name: 'Deadeye', cost: 3, description: '+1 Bonus Die when using a pistol or thrown weapon.', source: 'Core' },
  { name: 'Dynamic Approach', cost: 3, description: 'Spend a Hero Point to change your Approach after seeing results.', source: 'Core' },
  { name: 'Fencer', cost: 3, description: 'Spend a Hero Point to reroll a single die on a Weaponry roll.', source: 'Core' },
  { name: 'Foul Weather Jack', cost: 3, description: 'Gain a second Hero Story.', source: 'Core' },
  { name: 'Masterpiece Crafter', cost: 3, description: 'Create signature items with special properties.', source: 'Core', nation: 'Vestenmennavenjar' },
  { name: 'Opportunist', cost: 3, description: '+1 Bonus Die on attacks against unaware targets.', source: 'Core' },
  { name: 'Ordained', cost: 3, description: 'Sanctuary in churches; +1 Bonus Die on social rolls with faithful.', source: 'Core', nation: 'Castille' },
  { name: 'Patron', cost: 3, description: 'A wealthy patron provides resources and missions.', source: 'Core' },
  { name: 'Perfect Balance', cost: 3, description: 'Spend a Hero Point to keep your footing in any situation.', source: 'Core' },
  { name: 'Poison Immunity', cost: 3, description: 'Immune to all mundane poisons.', source: 'Core', nation: 'Vodacce' },
  { name: 'Psst, Over Here', cost: 3, description: 'Spend a Hero Point to lure a target into an ambush.', source: 'Core' },
  { name: 'Quick Reflexes', cost: 3, description: '+1 Bonus Die on rolls to react to sudden danger.', source: 'Core' },
  { name: 'Reckless Takedown', cost: 3, description: 'Spend a Hero Point to wipe out a Brute Squad, take 1 DW.', source: 'Core' },
  { name: 'Reputation', cost: 3, description: '+1 Bonus Die on social rolls when your reputation precedes you.', source: 'Core' },
  { name: 'Rich', cost: 3, description: 'Start each session with extra Wealth.', source: 'Core' },
  { name: 'Second Story Work', cost: 3, description: 'Spend a Hero Point to find entry to any building.', source: 'Core' },
  { name: 'Signature Item', cost: 3, description: 'A beloved item grants +1 Bonus Die when used.', source: 'Core' },
  { name: 'Slip Free', cost: 3, description: 'Spend a Hero Point to escape bonds, grapples, or cells.', source: 'Core' },
  { name: 'Sniper', cost: 3, description: '+1 Bonus Die when attacking from a hidden position with a ranged weapon.', source: 'Core' },
  { name: 'Specialist', cost: 3, description: 'Choose one Skill; earn 2 Raises instead of 1 on sets of 15+.', source: 'Core' },
  { name: 'Tenure', cost: 3, description: 'Academic position provides resources and social standing.', source: 'Core' },
  { name: 'Trusted Companion', cost: 3, description: 'A loyal NPC ally who aids you.', source: 'Core' },
  { name: 'Virtuoso', cost: 3, description: '+1 Bonus Die on all Perform rolls.', source: 'Core' },

  // ── 4-point Advantages (Core) ──
  { name: 'Academy', cost: 4, description: 'Formal military training; +1 to two Skills.', source: 'Core' },
  { name: 'Alchemist', cost: 4, description: 'Create alchemical concoctions. (Castillian only)', source: 'Core', nation: 'Castille' },
  { name: 'Hard to Kill', cost: 4, description: '+1 Dramatic Wound before becoming Helpless.', source: 'Core' },
  { name: 'Legendary Trait', cost: 4, description: 'Choose a Trait; treat as 1 higher for one roll per scene.', source: 'Core' },
  { name: 'Lyceum', cost: 4, description: 'Studied at the Lyceum; +1 to two Skills.', source: 'Core' },
  { name: 'Miracle Worker', cost: 4, description: 'Spend a Hero Point to heal 1 Dramatic Wound on a target.', source: 'Core' },
  { name: 'Riot Breaker', cost: 4, description: 'Reduce Brute Squad damage by your Resolve.', source: 'Core' },
  { name: 'Seidr', cost: 4, description: 'Skald naming and divination powers. (Vesten only)', source: 'Core', nation: 'Vestenmennavenjar' },
  { name: 'Sorcery', cost: 4, description: 'Access to your nation\'s sorcery tradition.', source: 'Core' },

  // ── 5-point Advantages (Core) ──
  { name: 'Duelist Academy', cost: 5, description: 'Trained in a formal Dueling Style; gain Style Bonus.', source: 'Core' },
  { name: 'I Won\'t Die Here', cost: 5, description: 'Spend a Hero Point to survive lethal damage.', source: 'Core', nation: 'Eisen' },
  { name: 'I\'m Taking You With Me', cost: 5, description: 'Deal extra damage from your Dramatic Wounds.', source: 'Core', nation: 'Vestenmennavenjar' },
  { name: 'Joie de Vivre', cost: 5, description: 'Dice <= Skill rank count as 10s when aiding allies.', source: 'Core', nation: 'Montaigne' },
  { name: 'Spark of Genius', cost: 5, description: 'Spend a Hero Point to gain Raises = Wits.', source: 'Core', nation: 'Castille' },
  { name: 'Strength of Ten', cost: 5, description: 'Spend a Hero Point for +dice = Brawn/Resolve.', source: 'Core', nation: 'Ussura' },
  { name: 'The Devil\'s Own Luck', cost: 5, description: 'Spend a Hero Point to reroll all dice.', source: 'Core', nation: 'Glamour Isles' },
  { name: 'Together We Are Strong', cost: 5, description: 'Allies in the scene add dice to your roll.', source: 'Core', nation: 'Sarmatian Commonwealth' },
  { name: 'University', cost: 5, description: 'Extensive education; +1 to three Skills.', source: 'Core' },
  { name: 'We\'re Not So Different', cost: 5, description: 'Spend a Hero Point to gain a Villain\'s trust.', source: 'Core', nation: 'Vodacce' },

  // ════════════════════════════════════════════════════════════════════════════
  // NATIONS OF THEAH VOL. 1
  // ════════════════════════════════════════════════════════════════════════════
  { name: 'Anything Can Be a Weapon', cost: 1, description: 'Treat any improvised weapon as if it were a proper one with no penalty.', source: 'Nations of Theah V1' },
  { name: 'Fish in a Barrel', cost: 1, description: 'Gain a bonus die when attacking an unaware target at close range.', source: 'Nations of Theah V1' },
  { name: 'Haymaker', cost: 1, description: 'Spend a Hero Point to deal an extra Wound with an unarmed strike.', source: 'Nations of Theah V1' },
  { name: 'Into the Fray', cost: 1, description: 'Gain a bonus die on the first Action Sequence round of any conflict.', source: 'Nations of Theah V1' },
  { name: 'Trigger Control', cost: 1, description: 'Gain a bonus die on firearm attacks when you have time to aim.', source: 'Nations of Theah V1' },
  { name: 'Whirlwind of Steel', cost: 1, description: 'Deal an extra wound when you spend a Raise to attack a Brute Squad.', source: 'Nations of Theah V1' },
  { name: 'Adaptive Duelist', cost: 2, description: 'When facing an opponent using a Dueling Style you know, gain +1 Bonus Die to your next Weaponry roll.', source: 'Nations of Theah V1' },
  { name: 'This Is My Town', cost: 2, description: 'Gain +1 Bonus Die on all social and investigation rolls when in your home city.', source: 'Nations of Theah V1' },
  { name: 'Catch the Wind', cost: 3, description: 'Spend a Hero Point to gain bonus dice equal to your Wits on Sailing rolls.', source: 'Nations of Theah V1' },
  { name: 'Scathing Indictment', cost: 3, description: 'Spend a Hero Point to publicly humiliate a target, inflicting social consequences.', source: 'Nations of Theah V1' },
  { name: 'Student of Combat', cost: 3, description: 'Gain +1 Bonus Die when fighting an opponent whose style you have studied.', source: 'Nations of Theah V1' },
  { name: 'Sweeten the Pot', cost: 3, description: 'Spend a Hero Point to add an extra incentive to a bargain, gaining +1 Bonus Die on Convince.', source: 'Nations of Theah V1' },

  // ════════════════════════════════════════════════════════════════════════════
  // NATIONS OF THEAH VOL. 2
  // ════════════════════════════════════════════════════════════════════════════
  { name: 'Penny Pincher', cost: 1, description: 'Reduce the cost of any purchase by 1 Wealth (minimum 0).', source: 'Nations of Theah V2' },
  { name: 'Personal Motto', cost: 1, description: 'Declare a personal motto; earn a Hero Point when you act in accordance with it under duress.', source: 'Nations of Theah V2' },
  { name: 'Born in the Saddle', cost: 2, description: 'Gain +1 Bonus Die on all Ride rolls; never fall from a mount accidentally.', source: 'Nations of Theah V2' },
  { name: 'Heartfelt Appeal', cost: 2, description: 'Spend a Hero Point to make an emotional plea that stops a fight for one Round.', source: 'Nations of Theah V2' },
  { name: 'Imperious Glare', cost: 2, description: 'Spend a Hero Point to cow a servant or subordinate into immediate obedience.', source: 'Nations of Theah V2' },
  { name: 'O Captain My Captain', cost: 2, description: 'Your crew gains +1 Bonus Die on all rolls when you personally lead them into danger.', source: 'Nations of Theah V2' },
  { name: 'Wrecking Ball', cost: 2, description: 'Spend a Hero Point to smash through a wall, door, or barricade regardless of material.', source: 'Nations of Theah V2' },
  { name: 'Body Blow', cost: 3, description: 'When you deal a Dramatic Wound, the target loses their next action.', source: 'Nations of Theah V2' },
  { name: 'Brains of the Outfit', cost: 3, description: 'Spend a Hero Point to grant an ally bonus dice equal to your Wits on their next roll.', source: 'Nations of Theah V2' },
  { name: 'Fast Draw', cost: 3, description: 'Draw a weapon and attack in the same action with no penalty; gain +1 Bonus Die on the first attack of a scene.', source: 'Nations of Theah V2' },
  { name: 'Flashing Blade', cost: 3, description: 'Gain +1 Bonus Die when making a melee attack immediately after successfully parrying.', source: 'Nations of Theah V2' },
  { name: 'Trusting', cost: 3, description: 'When you trust someone and they betray you, gain 2 Hero Points instead of 1.', source: 'Nations of Theah V2' },
  { name: 'Flirting with Disaster', cost: 4, description: 'Gain bonus dice equal to the number of Dramatic Wounds you have suffered on social rolls.', source: 'Nations of Theah V2' },
  { name: 'Moral Compass', cost: 4, description: 'Spend a Hero Point to sense whether a person or course of action is morally corrupt.', source: 'Nations of Theah V2' },
  { name: 'Dark Gift', cost: 5, description: 'Gain a supernatural dark power at great personal cost; the GM determines the nature and drawback.', source: 'Nations of Theah V2' },

  // ════════════════════════════════════════════════════════════════════════════
  // PIRATE NATIONS
  // ════════════════════════════════════════════════════════════════════════════
  { name: 'Direction Sense (Pirate)', cost: 1, description: 'Always know which way is north; never get lost at sea or on land.', source: 'Pirate Nations' },
  { name: 'Eye for Talent', cost: 1, description: 'Spend a Hero Point to immediately assess a person\'s best Trait and highest Skill.', source: 'Pirate Nations' },
  { name: 'Letter of Marque', cost: 1, description: 'Carry official papers granting you permission to attack enemy ships on behalf of a nation.', source: 'Pirate Nations' },
  { name: 'Tavern Favorite', cost: 1, description: 'Gain +1 Bonus Die on social rolls in taverns, inns, and drinking establishments.', source: 'Pirate Nations' },
  { name: 'Agoge Weapon Mastery', cost: 2, description: 'Choose one weapon type; gain +1 Bonus Die when wielding it in combat.', source: 'Pirate Nations' },
  { name: 'Cross the Palm (Pirate)', cost: 2, description: 'Spend a Hero Point to bribe a minor official or guard to look the other way.', source: 'Pirate Nations' },
  { name: 'Devil Dog', cost: 2, description: 'Gain +1 Bonus Die on Intimidate rolls against sailors and pirates who know your reputation.', source: 'Pirate Nations' },
  { name: 'Indomitable Will (Pirate)', cost: 2, description: 'Spend a Hero Point to resist fear or intimidation for a scene.', source: 'Pirate Nations' },
  { name: 'Insistent', cost: 2, description: 'Spend a Hero Point to force a reluctant NPC to hear your full argument before responding.', source: 'Pirate Nations' },
  { name: 'Married to the Sea', cost: 2, description: 'Gain +1 Bonus Die on all Sailing rolls; suffer -1 die on social rolls when on land for more than a week.', source: 'Pirate Nations' },
  { name: 'Speed Load', cost: 2, description: 'Reload a firearm as a free action once per Round.', source: 'Pirate Nations' },
  { name: 'Atabean Traveler', cost: 3, description: 'Gain +1 Bonus Die on all social and navigation rolls within the Atabean Trading Sea.', source: 'Pirate Nations' },
  { name: 'Dynamic Approach (Pirate)', cost: 3, description: 'Spend a Hero Point to change your Approach after seeing results.', source: 'Pirate Nations' },
  { name: 'Frog Man', cost: 3, description: 'Suffer no penalties for acting in or under water; hold your breath for an extended time.', source: 'Pirate Nations' },
  { name: 'Nerves of Steel', cost: 3, description: 'Never suffer penalties from fear; gain +1 Bonus Die when facing supernatural terror.', source: 'Pirate Nations' },
  { name: 'Powder Monkey', cost: 3, description: 'Gain +1 Bonus Die on all rolls involving cannons and ship-mounted weaponry.', source: 'Pirate Nations' },
  { name: 'Sweeten the Pot (Pirate)', cost: 3, description: 'Spend a Hero Point to add an extra incentive to a deal, gaining +1 Bonus Die on Convince.', source: 'Pirate Nations' },
  { name: 'The Ocean\'s Favorite', cost: 3, description: 'Spend a Hero Point to calm rough seas or summon a favorable current in your immediate area.', source: 'Pirate Nations' },
  { name: 'Wheel Man', cost: 3, description: 'Gain +1 Bonus Die when piloting or steering any vehicle or vessel.', source: 'Pirate Nations' },
  { name: 'The Devil\'s Due', cost: 4, description: 'When an enemy spends a Raise against you, gain a bonus die on your next action against them.', source: 'Pirate Nations' },
  { name: 'Salty Dog', cost: 4, description: 'Ignore the first Dramatic Wound you suffer in any scene at sea.', source: 'Pirate Nations' },
  { name: 'Seeker of Soryana', cost: 4, description: 'Gain visions and clues related to the lost island of Soryana; +1 Bonus Die on related investigation rolls.', source: 'Pirate Nations' },
  { name: 'Whisper to Mother', cost: 4, description: 'Spend a Hero Point to commune with the sea and receive cryptic guidance about your current situation.', source: 'Pirate Nations' },
  { name: 'La Palabra', cost: 4, description: 'Your sworn word carries supernatural weight; those who break a deal with you suffer misfortune.', source: 'Pirate Nations' },
  { name: 'I Cannot Be Broken', cost: 5, description: 'Spend a Hero Point to ignore all wound penalties for the remainder of a scene.', source: 'Pirate Nations' },
  { name: 'My Word Is My Bond', cost: 5, description: 'When you give your word, gain 2 Hero Points; if you break it, lose all Hero Points and gain Corruption.', source: 'Pirate Nations' },
  { name: 'Seize Your Glory', cost: 5, description: 'Once per session, take an extra action during an Action Sequence at no cost.', source: 'Pirate Nations' },
  { name: 'We Share Our Victories', cost: 5, description: 'When you defeat a Villain, all allies in the scene recover 1 Dramatic Wound.', source: 'Pirate Nations' },

  // ════════════════════════════════════════════════════════════════════════════
  // HEROES & VILLAINS
  // ════════════════════════════════════════════════════════════════════════════
  { name: 'Flawless Execution', cost: 2, description: 'Spend a Hero Point to perform a complex maneuver flawlessly, ignoring environmental penalties.', source: 'Heroes & Villains' },
  { name: 'Learned Duelist', cost: 3, description: 'Gain +1 Bonus Die when using a Dueling Style you have studied but not formally trained in.', source: 'Heroes & Villains' },
  { name: 'Student of Combat (H&V)', cost: 3, description: 'Gain +1 Bonus Die when fighting an opponent whose style you have studied.', source: 'Heroes & Villains' },
  { name: 'Savior', cost: 4, description: 'Spend a Hero Point to take a Dramatic Wound meant for an ally within reach.', source: 'Heroes & Villains' },

  // ════════════════════════════════════════════════════════════════════════════
  // CRESCENT EMPIRE
  // ════════════════════════════════════════════════════════════════════════════
  { name: 'The Old Traditions', cost: 1, description: 'Gain +1 Bonus Die when using ancient customs or rituals of the Crescent Empire.', source: 'Crescent Empire' },
  { name: 'Well Read', cost: 1, description: 'Spend a Hero Point to recall an obscure fact from a book you once read.', source: 'Crescent Empire' },
  { name: 'Cover Name', cost: 1, description: 'Maintain a false identity that holds up to casual scrutiny.', source: 'Crescent Empire' },
  { name: 'Delay the Inevitable', cost: 1, description: 'Spend a Hero Point to postpone one consequence of a failed roll until the end of the scene.', source: 'Crescent Empire' },
  { name: 'Triage', cost: 1, description: 'Spend a Hero Point to stabilize a dying character without a roll.', source: 'Crescent Empire' },
  { name: 'Ambuscade', cost: 2, description: 'Gain +2 Bonus Dice on your first attack from a concealed position.', source: 'Crescent Empire' },
  { name: 'Amab Almadaa', cost: 2, description: 'Gain +1 Bonus Die when defending an innocent or unarmed person from harm.', source: 'Crescent Empire' },
  { name: 'Desperate Deflection', cost: 2, description: 'Spend a Hero Point to prevent 1 Dramatic Wound by sacrificing your weapon or shield.', source: 'Crescent Empire' },
  { name: 'Kwa Damu', cost: 2, description: 'Gain +1 Bonus Die on rolls to track or hunt a target you have sworn to find.', source: 'Crescent Empire' },
  { name: 'Rhyme and Verse', cost: 2, description: 'Gain +1 Bonus Die on social rolls when you incorporate poetry or song.', source: 'Crescent Empire' },
  { name: 'Skirmisher', cost: 3, description: 'Gain +1 Bonus Die on attacks made while moving; no penalty for fighting in difficult terrain.', source: 'Crescent Empire' },
  { name: 'Support Lines', cost: 2, description: 'Spend a Hero Point to call for reinforcements or supplies from nearby allies.', source: 'Crescent Empire' },
  { name: 'Experienced Commander', cost: 3, description: 'Brute Squads under your command gain +1 Strength.', source: 'Crescent Empire' },
  { name: 'Heedless Assault', cost: 3, description: 'Deal +1 Wound on melee attacks but suffer +1 Wound from counterattacks this Round.', source: 'Crescent Empire' },
  { name: 'Multi-Tasker', cost: 3, description: 'Perform two different Skill-based actions with the same Raise once per Round.', source: 'Crescent Empire' },
  { name: 'Osda', cost: 3, description: 'Gain +1 Bonus Die when mediating disputes or seeking peaceful resolutions.', source: 'Crescent Empire' },
  { name: 'My Soul Still Shines', cost: 5, description: 'When you suffer Corruption, spend a Hero Point to negate it and inspire allies to recover 1 Hero Point each.', source: 'Crescent Empire' },
  { name: 'My Weakness is Your Strength', cost: 5, description: 'When you fail a roll, an ally may immediately attempt the same action with +2 Bonus Dice.', source: 'Crescent Empire' },
  { name: 'Remember My Name', cost: 5, description: 'Once per session, invoke your reputation to automatically succeed on a social roll against someone who knows you.', source: 'Crescent Empire' },
  { name: 'Step Where I Step', cost: 5, description: 'Allies following your lead through dangerous terrain suffer no penalties or hazard damage.', source: 'Crescent Empire' },
  { name: 'Never Say Die', cost: 4, description: 'When you would become Helpless, spend a Hero Point to remain standing with 1 Wound remaining.', source: 'Crescent Empire' },
  { name: 'Rally to Me', cost: 4, description: 'Spend a Hero Point to let all allies in the scene immediately take one free action.', source: 'Crescent Empire' },
  { name: 'I\'ve Been Waiting for This', cost: 5, description: 'Once per session, declare a Villain as your nemesis; gain +3 Bonus Dice on all rolls against them for the scene.', source: 'Crescent Empire' },

  // ════════════════════════════════════════════════════════════════════════════
  // THE NEW WORLD
  // ════════════════════════════════════════════════════════════════════════════
  { name: 'Adorn with Feathers', cost: 1, description: 'Gain +1 Bonus Die on social rolls when wearing ceremonial feathered attire.', source: 'The New World' },
  { name: 'The High Sign', cost: 1, description: 'Spend a Hero Point to silently communicate a simple message to an ally who can see you.', source: 'The New World' },
  { name: 'Two Bloods', cost: 1, description: 'Choose two Nations of origin; gain cultural knowledge and contacts from both.', source: 'The New World' },
  { name: 'Better Lucky Than Good', cost: 2, description: 'Once per session, reroll a single die that came up as a 1.', source: 'The New World' },
  { name: 'Beyond Sight', cost: 2, description: 'Spend a Hero Point to sense danger or hidden enemies within a short distance.', source: 'The New World' },
  { name: 'Clever Tongue', cost: 2, description: 'Gain +1 Bonus Die on Convince rolls when telling a half-truth or using wordplay.', source: 'The New World' },
  { name: 'Confidant', cost: 2, description: 'Spend a Hero Point to learn a secret from an NPC who trusts you.', source: 'The New World' },
  { name: 'Cross the Palm', cost: 2, description: 'Spend a Hero Point to bribe a minor official or guard to look the other way.', source: 'The New World' },
  { name: 'Go On Without Me', cost: 2, description: 'Spend a Hero Point to hold off pursuers while your allies escape safely.', source: 'The New World' },
  { name: 'Face the Storm', cost: 2, description: 'Gain +1 Bonus Die on rolls to resist or endure natural disasters and extreme weather.', source: 'The New World' },
  { name: 'Forager', cost: 2, description: 'Spend a Hero Point to find enough food and water for your group in any environment.', source: 'The New World' },
  { name: 'Shadow Stalker', cost: 2, description: 'Gain +1 Bonus Die on Hide and stealth-related rolls in natural environments.', source: 'The New World' },
  { name: 'Play Possum', cost: 2, description: 'Spend a Hero Point to convincingly feign death or unconsciousness.', source: 'The New World' },
  { name: 'Soothe the Beast', cost: 2, description: 'Spend a Hero Point to calm a hostile animal, preventing it from attacking for a scene.', source: 'The New World' },
  { name: 'Desperate Effort', cost: 3, description: 'Spend a Hero Point to gain +3 dice on a single roll, but suffer 1 Wound afterward.', source: 'The New World' },
  { name: 'The Last Word', cost: 3, description: 'When you are rendered Helpless, make one final action before going down.', source: 'The New World' },
  { name: 'Silent Takedown', cost: 3, description: 'Spend a Hero Point to incapacitate a single unaware target silently.', source: 'The New World' },
  { name: 'Think on Your Feet', cost: 3, description: 'Spend a Hero Point to retroactively declare you prepared for the current situation.', source: 'The New World' },
  { name: 'Welcome to the Jungle', cost: 3, description: 'Gain +1 Bonus Die on all rolls in jungle, forest, or wilderness environments.', source: 'The New World' },
  { name: 'Rise Up Brothers and Sisters', cost: 5, description: 'Spend a Hero Point to inspire common folk to rebel; create an impromptu Brute Squad that fights for your cause.', source: 'The New World' },
  { name: 'God-Touched', cost: 4, description: 'Gain a minor supernatural gift tied to a New World deity; manifest once per session.', source: 'The New World' },
  { name: 'Parting Shot', cost: 4, description: 'When you disengage from combat, make a free attack against your opponent with +1 Bonus Die.', source: 'The New World' },
  { name: 'The Storm Serves Me', cost: 4, description: 'Spend a Hero Point to direct lightning, wind, or rain to hinder your enemies for one Round.', source: 'The New World' },
  { name: 'Hunter of the Mighty', cost: 5, description: 'Gain +2 Bonus Dice on all rolls against targets with a higher Villain rank than your Hero\'s story progression.', source: 'The New World' },

  // ════════════════════════════════════════════════════════════════════════════
  // KHITAI
  // (Many Khitai advantages share names with Core/other books; tagged with source)
  // ════════════════════════════════════════════════════════════════════════════
  { name: 'Able Drinker', cost: 1, description: 'Spend a Hero Point to avoid the effects of alcohol.', source: 'Khitai' },
  { name: 'Body Language', cost: 1, description: 'Spend a Hero Point to read a person\'s true intentions from their posture and gestures.', source: 'Khitai' },
  { name: 'Direction Sense', cost: 1, description: 'Always know which way is north; never get lost.', source: 'Khitai' },
  { name: 'Everything is a Weapon', cost: 1, description: 'Treat any improvised object as a proper weapon with no penalty.', source: 'Khitai' },
  { name: 'Eye for Talent', cost: 1, description: 'Spend a Hero Point to immediately assess a person\'s best Trait and highest Skill.', source: 'Khitai' },
  { name: 'Fan of Fire', cost: 1, description: 'Gain +1 Bonus Die when using thrown weapons in quick succession.', source: 'Khitai' },
  { name: 'Finishing Blow', cost: 1, description: 'Deal +1 Wound to a target who has already suffered a Dramatic Wound this scene.', source: 'Khitai' },
  { name: 'Internal Clock', cost: 1, description: 'Always know what time it is; can wake at a predetermined hour.', source: 'Khitai' },
  { name: 'Iron Belly', cost: 1, description: 'Spend a Hero Point to ignore the effects of tainted food or drink.', source: 'Khitai' },
  { name: 'Large', cost: 1, description: '+1 Bonus Die on Intimidate; take hits better but harder to hide.', source: 'Khitai' },
  { name: 'Linguist', cost: 1, description: 'Speak, read, and write all languages of Khitai.', source: 'Khitai' },
  { name: 'Small', cost: 1, description: '+1 Bonus Die on Hide; squeeze through tight spaces.', source: 'Khitai' },
  { name: 'Staggering Jab', cost: 1, description: 'Spend a Raise to stun a target briefly with a precise unarmed strike.', source: 'Khitai' },
  { name: 'Steady Hands', cost: 1, description: 'Never suffer penalties from shaking, vibration, or unsteady footing when performing delicate tasks.', source: 'Khitai' },
  { name: 'Survivalist', cost: 1, description: 'Spend a Hero Point to find food/water/shelter in the wild.', source: 'Khitai' },
  { name: 'Whirlwind of Steel', cost: 1, description: 'Deal an extra wound when you spend a Raise to attack a Brute Squad.', source: 'Khitai' },

  // ── 2-point Advantages (Khitai) ──
  { name: 'Adaptive Duelist', cost: 2, description: 'When facing an opponent using a style you know, gain +1 Bonus Die to your next roll.', source: 'Khitai' },
  { name: 'As One!', cost: 2, description: 'Spend a Hero Point to coordinate a group action, granting all participants +1 Bonus Die.', source: 'Khitai' },
  { name: 'Barterer', cost: 2, description: 'Spend a Hero Point to find a buyer or seller for any item.', source: 'Khitai' },
  { name: 'Better Lucky Than Good', cost: 2, description: 'Once per session, reroll a single die that came up as a 1.', source: 'Khitai' },
  { name: 'Beyond Sight', cost: 2, description: 'Spend a Hero Point to sense danger or hidden enemies within a short distance.', source: 'Khitai' },
  { name: 'Big Talker', cost: 2, description: 'Gain +1 Bonus Die on Convince rolls when making exaggerated or boastful claims.', source: 'Khitai' },
  { name: 'Bodyguard', cost: 2, description: 'Spend a Hero Point to intercept an attack aimed at a person you are protecting.', source: 'Khitai' },
  { name: 'Born in the Saddle', cost: 2, description: 'Gain +1 Bonus Die on all Ride rolls; never fall from a mount accidentally.', source: 'Khitai' },
  { name: 'Come Hither', cost: 2, description: 'Spend a Hero Point to charm someone into a private conversation.', source: 'Khitai' },
  { name: 'Connection', cost: 2, description: 'Spend a Hero Point to reveal a helpful contact in the current area.', source: 'Khitai' },
  { name: 'Cross the Palm', cost: 2, description: 'Spend a Hero Point to bribe a minor official or guard to look the other way.', source: 'Khitai' },
  { name: 'Disarming Smile', cost: 2, description: 'Spend a Hero Point to keep someone from attacking for one Round.', source: 'Khitai' },
  { name: 'Eagle Eyes', cost: 2, description: 'Spend a Hero Point to see fine details at great distance.', source: 'Khitai' },
  { name: 'Extended Family', cost: 2, description: 'Spend a Hero Point to find a relative in the current area.', source: 'Khitai' },
  { name: 'Face the Storm', cost: 2, description: 'Gain +1 Bonus Die on rolls to resist or endure natural disasters and extreme weather.', source: 'Khitai' },
  { name: 'Fascinate', cost: 2, description: 'Spend a Hero Point to hold a target\'s attention with performance.', source: 'Khitai' },
  { name: 'Fast Hands', cost: 2, description: 'Gain +1 Bonus Die on Theft and sleight-of-hand rolls.', source: 'Khitai' },
  { name: 'Fleet of Foot', cost: 2, description: 'Spend a Hero Point to outrun any pursuer for the rest of the scene.', source: 'Khitai' },
  { name: 'Friend at Court', cost: 2, description: 'Spend a Hero Point to get an audience with a noble or official.', source: 'Khitai' },
  { name: 'Got It!', cost: 2, description: 'Spend a Hero Point to reveal you brought a useful mundane item.', source: 'Khitai' },
  { name: 'Handy', cost: 2, description: 'Spend a Hero Point to repair a broken item temporarily.', source: 'Khitai' },
  { name: 'Heartfelt Appeal', cost: 2, description: 'Spend a Hero Point to make an emotional plea that stops a fight for one Round.', source: 'Khitai' },
  { name: 'Indomitable Will', cost: 2, description: 'Spend a Hero Point to resist fear or intimidation for a scene.', source: 'Khitai' },
  { name: 'Insistent', cost: 2, description: 'Spend a Hero Point to force a reluctant NPC to hear your full argument before responding.', source: 'Khitai' },
  { name: 'Inspire Generosity', cost: 2, description: 'Spend a Hero Point to convince someone to donate to your cause.', source: 'Khitai' },
  { name: 'Leadership', cost: 2, description: 'Spend a Hero Point to rally allies, giving them +1 die.', source: 'Khitai' },
  { name: 'Lure', cost: 2, description: 'Spend a Hero Point to bait a target into following you to a location of your choosing.', source: 'Khitai' },
  { name: 'Magic', cost: 2, description: 'Access to minor magical abilities from your Khitai tradition.', source: 'Khitai' },
  { name: 'One Against Many', cost: 2, description: 'Gain +1 Bonus Die when fighting multiple opponents simultaneously.', source: 'Khitai' },
  { name: 'Perfect Balance', cost: 2, description: 'Spend a Hero Point to keep your footing in any situation.', source: 'Khitai' },
  { name: 'Reckless Takedown', cost: 2, description: 'Spend a Hero Point to wipe out a Brute Squad, take 1 Dramatic Wound.', source: 'Khitai' },
  { name: 'Second Story Work', cost: 2, description: 'Spend a Hero Point to find entry to any building.', source: 'Khitai' },
  { name: 'Shadow Stalker', cost: 2, description: 'Gain +1 Bonus Die on Hide and stealth-related rolls.', source: 'Khitai' },
  { name: 'Slip Free', cost: 2, description: 'Spend a Hero Point to escape bonds, grapples, or cells.', source: 'Khitai' },
];

// ─── HELPER: Get advantages filtered by source ──────────────────────────────
export function getAdvantagesBySource(source) {
  return SEVEN_SEA_ADVANTAGES.filter(a => a.source === source);
}

// ─── HELPER: Get unique advantages (deduped by name, preferring Core) ───────
export function getUniqueAdvantages() {
  const seen = new Map();
  for (const adv of SEVEN_SEA_ADVANTAGES) {
    if (!seen.has(adv.name) || adv.source === 'Core') {
      seen.set(adv.name, adv);
    }
  }
  return Array.from(seen.values()).sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name));
}

// ─── HELPER: Get all advantages (flat list, sorted by cost then name) ───────
export function getAllAdvantages() {
  return [...SEVEN_SEA_ADVANTAGES].sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name));
}

// ─── HELPER: Get nations by region ──────────────────────────────────────────
export function getNationsByRegion(region) {
  return SEVEN_SEA_NATIONS.filter(n => n.region === region);
}

// ─── HELPER: Get all regions ────────────────────────────────────────────────
export function getAllRegions() {
  return [...new Set(SEVEN_SEA_NATIONS.map(n => n.region))];
}

// ─── HELPER: Get all source books ───────────────────────────────────────────
export function getAllSources() {
  return [...new Set(SEVEN_SEA_ADVANTAGES.map(a => a.source))];
}

// ══════════════════════════════════════════════════════════════════════════════
// PART 2: Backgrounds, Dueling Styles, Secret Societies, Arcana
// ══════════════════════════════════════════════════════════════════════════════

// ─── BACKGROUNDS ───────────────────────────────────────────────────────────
// Each: { name, description, skills[], advantages[], quirk, nation?, source }

export const BACKGROUNDS = [
  // ── Core Rulebook (32) ──
  { name: 'Archaeologist', description: 'Ruins explorer who uncovers ancient secrets.', skills: ['Athletics', 'Empathy', 'Notice', 'Ride', 'Scholarship'], advantages: ['Direction Sense', 'Linguist'], quirk: 'Earn a Hero Point when you solve a mystery.', source: 'Core Rulebook' },
  { name: 'Aristocrat', description: 'Born to privilege and political power.', skills: ['Aim', 'Convince', 'Empathy', 'Ride', 'Scholarship'], advantages: ['Rich', 'Disarming Smile'], quirk: 'Earn a Hero Point when you prove there is more to you than your noble birth.', source: 'Core Rulebook' },
  { name: 'Army Officer', description: 'Military leader commanding troops.', skills: ['Aim', 'Athletics', 'Intimidate', 'Ride', 'Warfare'], advantages: ['Leadership', 'Academy'], quirk: 'Earn a Hero Point when you lead soldiers into danger.', source: 'Core Rulebook' },
  { name: 'Artist', description: 'Creative soul driven by inspiration.', skills: ['Convince', 'Empathy', 'Notice', 'Perform', 'Tempt'], advantages: ['Virtuoso', 'Fascinate'], quirk: 'Earn a Hero Point when you express yourself and inspire someone.', source: 'Core Rulebook' },
  { name: 'Assassin', description: 'Silent killer striking from the shadows.', skills: ['Athletics', 'Empathy', 'Hide', 'Intimidate', 'Weaponry'], advantages: ['Fencer', 'Psst Over Here'], quirk: 'Earn a Hero Point when you kill a target no one thought you could reach.', source: 'Core Rulebook' },
  { name: 'Cavalry', description: 'Mounted warrior charging into battle.', skills: ['Intimidate', 'Notice', 'Ride', 'Warfare', 'Weaponry'], advantages: ['Bruiser', 'Indomitable Will'], quirk: 'Earn a Hero Point when you lead a mounted charge.', source: 'Core Rulebook' },
  { name: 'Courtier', description: 'Political player navigating courtly intrigue.', skills: ['Convince', 'Empathy', 'Perform', 'Scholarship', 'Tempt'], advantages: ['Friend at Court', 'Come Hither'], quirk: 'Earn a Hero Point when you resolve a conflict via social grace.', source: 'Core Rulebook' },
  { name: 'Crafter', description: 'Skilled artisan creating works of value.', skills: ['Athletics', 'Convince', 'Notice', 'Perform', 'Scholarship'], advantages: ['Masterpiece Crafter', 'Handy'], quirk: 'Earn a Hero Point when you create something useful.', source: 'Core Rulebook' },
  { name: 'Criminal', description: 'Underworld figure operating outside the law.', skills: ['Athletics', 'Hide', 'Intimidate', 'Theft', 'Weaponry'], advantages: ['Streetwise', 'Got It!'], quirk: 'Earn a Hero Point when you break the law for a good reason.', source: 'Core Rulebook' },
  { name: 'Doctor', description: 'Physician and healer tending the wounded.', skills: ['Convince', 'Empathy', 'Notice', 'Scholarship', 'Warfare'], advantages: ['Miracle Worker', 'Eagle Eyes'], quirk: 'Earn a Hero Point when you tend to the wounded.', source: 'Core Rulebook' },
  { name: 'Duelist', description: 'Trained swordfighter seeking worthy opponents.', skills: ['Athletics', 'Empathy', 'Intimidate', 'Perform', 'Weaponry'], advantages: ['Duelist Academy'], quirk: 'Earn a Hero Point when you resolve a conflict through single combat.', source: 'Core Rulebook' },
  { name: 'Engineer', description: 'Builder and inventor solving problems.', skills: ['Athletics', 'Notice', 'Ride', 'Scholarship', 'Warfare'], advantages: ['Academy', 'Handy'], quirk: 'Earn a Hero Point when you solve a problem with engineering.', source: 'Core Rulebook' },
  { name: 'Explorer', description: 'Globe-trotter seeking new horizons.', skills: ['Athletics', 'Notice', 'Ride', 'Sailing', 'Scholarship'], advantages: ['Connection', 'Direction Sense'], quirk: 'Earn a Hero Point when you discover a new place.', source: 'Core Rulebook' },
  { name: 'Farmkid', description: 'Simple rural upbringing with honest values.', skills: ['Athletics', 'Empathy', 'Hide', 'Notice', 'Ride'], advantages: ['Survivalist', 'Team Player'], quirk: 'Earn a Hero Point when you put simple values ahead of politics.', source: 'Core Rulebook' },
  { name: 'Hunter', description: 'Tracker and scout living off the land.', skills: ['Aim', 'Athletics', 'Hide', 'Notice', 'Ride'], advantages: ['Survivalist', 'Eagle Eyes'], quirk: 'Earn a Hero Point when you catch your prey.', source: 'Core Rulebook' },
  { name: 'Jenny/Jack', description: 'Companion for hire who learns everyone\'s secrets.', skills: ['Convince', 'Empathy', 'Notice', 'Perform', 'Tempt'], advantages: ['Come Hither', 'Streetwise'], quirk: 'Earn a Hero Point when you uncover a secret.', source: 'Core Rulebook' },
  { name: 'Mercenary', description: 'Sword for hire fighting for coin.', skills: ['Athletics', 'Brawl', 'Intimidate', 'Notice', 'Weaponry'], advantages: ['Hard to Kill', 'Cast Iron Stomach'], quirk: 'Earn a Hero Point when you complete a dangerous job for pay.', source: 'Core Rulebook' },
  { name: 'Merchant', description: 'Trader seeking profit and opportunity.', skills: ['Convince', 'Notice', 'Ride', 'Scholarship', 'Tempt'], advantages: ['Barterer', 'Rich'], quirk: 'Earn a Hero Point when you negotiate a profitable deal.', source: 'Core Rulebook' },
  { name: 'Naval Officer', description: 'Officer commanding a ship of the fleet.', skills: ['Intimidate', 'Notice', 'Sailing', 'Warfare', 'Weaponry'], advantages: ['Perfect Balance', 'Sea Legs'], quirk: 'Earn a Hero Point when you lead sailors through a crisis.', source: 'Core Rulebook' },
  { name: 'Orphan', description: 'Raised alone on the streets, self-reliant.', skills: ['Athletics', 'Brawl', 'Hide', 'Notice', 'Theft'], advantages: ['Streetwise', 'Survivalist'], quirk: 'Earn a Hero Point when you rely on yourself to solve a problem.', source: 'Core Rulebook' },
  { name: 'Performer', description: 'Entertainer captivating audiences.', skills: ['Athletics', 'Convince', 'Empathy', 'Perform', 'Tempt'], advantages: ['Fascinate', 'Virtuoso'], quirk: 'Earn a Hero Point when you entertain an audience.', source: 'Core Rulebook' },
  { name: 'Pirate', description: 'Sea raider plundering the wealthy.', skills: ['Athletics', 'Brawl', 'Intimidate', 'Sailing', 'Weaponry'], advantages: ['Sea Legs', 'Bar Fighter'], quirk: 'Earn a Hero Point when you rob from the rich.', source: 'Core Rulebook' },
  { name: 'Priest', description: 'Cleric of the Vaticine faith.', skills: ['Convince', 'Empathy', 'Notice', 'Perform', 'Scholarship'], advantages: ['Ordained', 'Valiant Spirit'], quirk: 'Earn a Hero Point when you defend the faith.', source: 'Core Rulebook' },
  { name: 'Professor', description: 'Academic teacher sharing knowledge.', skills: ['Convince', 'Empathy', 'Perform', 'Scholarship', 'Tempt'], advantages: ['Tenure', 'Team Player'], quirk: 'Earn a Hero Point when you teach someone an important lesson.', source: 'Core Rulebook' },
  { name: 'Pugilist', description: 'Bare-knuckle fighter who never backs down.', skills: ['Athletics', 'Brawl', 'Intimidate', 'Notice', 'Perform'], advantages: ['Boxer', 'Bar Fighter'], quirk: 'Earn a Hero Point when you win a fight with your bare hands.', source: 'Core Rulebook' },
  { name: 'Quartermaster', description: 'Ship supplier keeping the crew provisioned.', skills: ['Aim', 'Brawl', 'Hide', 'Sailing', 'Warfare'], advantages: ['Handy', 'Got It!', 'Sea Legs'], quirk: 'Earn a Hero Point when you provide for your crew.', source: 'Core Rulebook' },
  { name: 'Sailor', description: 'Seafarer at home on the open ocean.', skills: ['Athletics', 'Brawl', 'Notice', 'Sailing', 'Weaponry'], advantages: ['Sea Legs', 'Perfect Balance'], quirk: 'Earn a Hero Point when you put the ship above yourself.', source: 'Core Rulebook' },
  { name: 'Scholar', description: 'Academic pursuing knowledge above all.', skills: ['Convince', 'Empathy', 'Notice', 'Scholarship', 'Tempt'], advantages: ['University', 'Linguist'], quirk: 'Earn a Hero Point when you use knowledge to solve a problem.', source: 'Core Rulebook' },
  { name: 'Servant', description: 'In service to others, seeing everything.', skills: ['Athletics', 'Convince', 'Empathy', 'Hide', 'Notice'], advantages: ['Got It!', 'Streetwise'], quirk: 'Earn a Hero Point when you go unnoticed to help your allies.', source: 'Core Rulebook' },
  { name: 'Ship Captain', description: 'Master of a vessel and its crew.', skills: ['Aim', 'Convince', 'Notice', 'Sailing', 'Warfare'], advantages: ['Leadership', 'Sea Legs'], quirk: 'Earn a Hero Point when your orders save the ship.', source: 'Core Rulebook' },
  { name: 'Soldier', description: 'Professional warrior serving in the ranks.', skills: ['Aim', 'Athletics', 'Brawl', 'Intimidate', 'Warfare'], advantages: ['Academy', 'Indomitable Will'], quirk: 'Earn a Hero Point when you follow orders despite danger.', source: 'Core Rulebook' },
  { name: 'Spy', description: 'Infiltrator gathering intelligence.', skills: ['Convince', 'Hide', 'Notice', 'Tempt', 'Theft'], advantages: ['Brush Pass', 'An Honest Misunderstanding'], quirk: 'Earn a Hero Point when you complete a covert mission.', source: 'Core Rulebook' },

  // ── Nations of Theah Volume 1 (17) ──
  { name: 'Sidhe Squire', description: 'Sworn attendant to one of the Sidhe, the fae lords of Avalon.', skills: [], advantages: [], quirk: '', nation: 'Avalon', source: 'Nations of Theah Vol 1' },
  { name: 'Dornalai', description: 'Wandering Avalon storyteller keeping alive the old tales and traditions.', skills: [], advantages: [], quirk: '', nation: 'Avalon', source: 'Nations of Theah Vol 1' },
  { name: 'Royal Conservationist', description: 'Guardian of Avalon\'s wild places and magical creatures.', skills: [], advantages: [], quirk: '', nation: 'Avalon', source: 'Nations of Theah Vol 1' },
  { name: 'Shannagary Runner', description: 'Swift messenger running between Avalon settlements.', skills: [], advantages: [], quirk: '', nation: 'Avalon', source: 'Nations of Theah Vol 1' },
  { name: 'Boticario', description: 'Castillian apothecary and herbalist versed in natural remedies.', skills: [], advantages: [], quirk: '', nation: 'Castille', source: 'Nations of Theah Vol 1' },
  { name: 'La Joven Promesa', description: 'A young Castillian prodigy destined for greatness.', skills: [], advantages: [], quirk: '', nation: 'Castille', source: 'Nations of Theah Vol 1' },
  { name: 'Sabueso Real', description: 'Royal bloodhound — an investigator serving the Castillian crown.', skills: [], advantages: [], quirk: '', nation: 'Castille', source: 'Nations of Theah Vol 1' },
  { name: 'Tercio', description: 'Castillian pikeman trained in the legendary tercio formations.', skills: [], advantages: [], quirk: '', nation: 'Castille', source: 'Nations of Theah Vol 1' },
  { name: 'Balayeur', description: 'Montaigne street sweeper who sees everything from below.', skills: [], advantages: [], quirk: '', nation: 'Montaigne', source: 'Nations of Theah Vol 1' },
  { name: 'Epee Sanglante', description: 'Montaigne duelist of the bloody blade, feared in the salons.', skills: [], advantages: [], quirk: '', nation: 'Montaigne', source: 'Nations of Theah Vol 1' },
  { name: 'La Souris du Marche', description: 'Montaigne market mouse — a resourceful black market dealer.', skills: [], advantages: [], quirk: '', nation: 'Montaigne', source: 'Nations of Theah Vol 1' },
  { name: 'La Voix des Sans-Voix', description: 'The voice of the voiceless — a Montaigne champion of the common people.', skills: [], advantages: [], quirk: '', nation: 'Montaigne', source: 'Nations of Theah Vol 1' },
  { name: 'Walkway Escapee', description: 'A Montaigne peasant who escaped the Empereur\'s Walkway.', skills: [], advantages: [], quirk: '', nation: 'Montaigne', source: 'Nations of Theah Vol 1' },
  { name: 'Hrungnir', description: 'Vesten giant-blooded warrior carrying on ancient traditions.', skills: [], advantages: [], quirk: '', nation: 'Vesten', source: 'Nations of Theah Vol 1' },
  { name: 'Murskaaja', description: 'Vesten crusher — a fearsome berserker of the northern lands.', skills: [], advantages: [], quirk: '', nation: 'Vesten', source: 'Nations of Theah Vol 1' },
  { name: 'Pankkiiri', description: 'Vesten banker leveraging the Vendel economic network.', skills: [], advantages: [], quirk: '', nation: 'Vesten', source: 'Nations of Theah Vol 1' },
  { name: 'Vala', description: 'Vesten seeress communing with the spirits of the land.', skills: [], advantages: [], quirk: '', nation: 'Vesten', source: 'Nations of Theah Vol 1' },

  // ── Nations of Theah Volume 2 (16) ──
  { name: 'Apostat', description: 'Eisen heretic who has rejected the Vaticine Church.', skills: [], advantages: [], quirk: '', nation: 'Eisen', source: 'Nations of Theah Vol 2' },
  { name: 'Befleckte Seele', description: 'Eisen tainted soul bearing the mark of Dracheneisen corruption.', skills: [], advantages: [], quirk: '', nation: 'Eisen', source: 'Nations of Theah Vol 2' },
  { name: 'Eisenblut', description: 'Iron-blooded Eisen warrior forged in the War of the Cross.', skills: [], advantages: [], quirk: '', nation: 'Eisen', source: 'Nations of Theah Vol 2' },
  { name: 'Stratege', description: 'Eisen military strategist and tactician.', skills: [], advantages: [], quirk: '', nation: 'Eisen', source: 'Nations of Theah Vol 2' },
  { name: 'Macher', description: 'Sarmatian fixer who gets things done through connections.', skills: [], advantages: [], quirk: '', nation: 'Sarmatia', source: 'Nations of Theah Vol 2' },
  { name: 'Mowca', description: 'Sarmatian speaker who uses words as weapons.', skills: [], advantages: [], quirk: '', nation: 'Sarmatia', source: 'Nations of Theah Vol 2' },
  { name: 'Rycerz Ludzi', description: 'Sarmatian knight of the people, sworn to defend the common folk.', skills: [], advantages: [], quirk: '', nation: 'Sarmatia', source: 'Nations of Theah Vol 2' },
  { name: 'Rycerz Senatu', description: 'Sarmatian knight of the Senate, navigating political power.', skills: [], advantages: [], quirk: '', nation: 'Sarmatia', source: 'Nations of Theah Vol 2' },
  { name: 'Borets', description: 'Ussuran wrestler and brawler of great strength.', skills: [], advantages: [], quirk: '', nation: 'Ussura', source: 'Nations of Theah Vol 2' },
  { name: 'Doverchivii Dusha', description: 'Ussuran trusting soul — open-hearted despite the harsh land.', skills: [], advantages: [], quirk: '', nation: 'Ussura', source: 'Nations of Theah Vol 2' },
  { name: 'Razrushitel', description: 'Ussuran destroyer — a force of nature on the battlefield.', skills: [], advantages: [], quirk: '', nation: 'Ussura', source: 'Nations of Theah Vol 2' },
  { name: 'Tura\'s Cursed', description: 'Ussuran touched by Matushka\'s dark bargain with Tura.', skills: [], advantages: [], quirk: '', nation: 'Ussura', source: 'Nations of Theah Vol 2' },
  { name: 'Capitano', description: 'Vodacce captain commanding respect through charisma and cunning.', skills: [], advantages: [], quirk: '', nation: 'Vodacce', source: 'Nations of Theah Vol 2' },
  { name: 'Moroso', description: 'Vodacce debtor entangled in webs of obligation and favors.', skills: [], advantages: [], quirk: '', nation: 'Vodacce', source: 'Nations of Theah Vol 2' },
  { name: 'Pistola Nascosta', description: 'Vodacce hidden pistol — a concealed weapon specialist.', skills: [], advantages: [], quirk: '', nation: 'Vodacce', source: 'Nations of Theah Vol 2' },
  { name: 'Wild Strega', description: 'Vodacce untrained Fate Witch living outside society\'s control.', skills: [], advantages: [], quirk: '', nation: 'Vodacce', source: 'Nations of Theah Vol 2' },

  // ── Pirate Nations (25) ──
  { name: 'Atabean Rook', description: 'Con artist and trickster operating across the Atabean Sea.', skills: [], advantages: [], quirk: '', source: 'Pirate Nations' },
  { name: 'Company Escapee', description: 'Former indentured servant who escaped a trading company.', skills: [], advantages: [], quirk: '', source: 'Pirate Nations' },
  { name: 'Seahorse', description: 'Expert swimmer and underwater salvager.', skills: [], advantages: [], quirk: '', source: 'Pirate Nations' },
  { name: 'Thean Outcast', description: 'Exile from Thean society seeking a new life on the seas.', skills: [], advantages: [], quirk: '', source: 'Pirate Nations' },
  { name: 'Lost Soul', description: 'Someone adrift in the world, searching for purpose.', skills: [], advantages: [], quirk: '', source: 'Pirate Nations' },
  { name: 'Freebooter', description: 'Independent pirate beholden to no captain or code.', skills: [], advantages: [], quirk: '', source: 'Pirate Nations' },
  { name: 'Troubleshooter', description: 'Problem solver who handles the jobs nobody else will.', skills: [], advantages: [], quirk: '', source: 'Pirate Nations' },
  { name: 'Rum Runner', description: 'Smuggler specializing in illicit spirits and contraband.', skills: [], advantages: [], quirk: '', source: 'Pirate Nations' },
  { name: 'Nganga', description: 'Jaraguan spiritual healer and keeper of sacred traditions.', skills: [], advantages: [], quirk: '', nation: 'Jaragua', source: 'Pirate Nations' },
  { name: 'Mawon', description: 'Jaraguan freedom fighter who escaped bondage and fights oppression.', skills: [], advantages: [], quirk: '', nation: 'Jaragua', source: 'Pirate Nations' },
  { name: 'Jaraguan Provocateur', description: 'Agitator and rabble-rouser stirring revolt in the Atabean.', skills: [], advantages: [], quirk: '', nation: 'Jaragua', source: 'Pirate Nations' },
  { name: 'Enspekte', description: 'Jaraguan inspector investigating crimes and corruption.', skills: [], advantages: [], quirk: '', nation: 'Jaragua', source: 'Pirate Nations' },
  { name: 'Siren', description: 'La Bucca entertainer whose beauty and voice lure the unwary.', skills: [], advantages: [], quirk: '', nation: 'La Bucca', source: 'Pirate Nations' },
  { name: 'Chapter Member', description: 'Member of one of La Bucca\'s governing chapters.', skills: [], advantages: [], quirk: '', nation: 'La Bucca', source: 'Pirate Nations' },
  { name: 'Sentinel', description: 'La Bucca guardian sworn to protect the pirate haven.', skills: [], advantages: [], quirk: '', nation: 'La Bucca', source: 'Pirate Nations' },
  { name: 'Los Ninos', description: 'Castillian orphan gang member from the pirate ports.', skills: [], advantages: [], quirk: '', source: 'Pirate Nations' },
  { name: 'Docent', description: 'Numan scholar preserving the wisdom of the ancient republic.', skills: [], advantages: [], quirk: '', nation: 'Numa', source: 'Pirate Nations' },
  { name: 'Haimon', description: 'Numan bloodline descendant carrying ancient Numan heritage.', skills: [], advantages: [], quirk: '', nation: 'Numa', source: 'Pirate Nations' },
  { name: 'Mystai', description: 'Numan initiate of the mystery cults.', skills: [], advantages: [], quirk: '', nation: 'Numa', source: 'Pirate Nations' },
  { name: 'Myrmidon', description: 'Numan elite warrior in the tradition of ancient soldiers.', skills: [], advantages: [], quirk: '', nation: 'Numa', source: 'Pirate Nations' },
  { name: 'Boriqua', description: 'Rahuri native of the Atabean islands.', skills: [], advantages: [], quirk: '', nation: 'Rahuri', source: 'Pirate Nations' },
  { name: 'Wave Hunter', description: 'Rahuri ocean hunter skilled in navigating treacherous waters.', skills: [], advantages: [], quirk: '', nation: 'Rahuri', source: 'Pirate Nations' },
  { name: 'Bohiti', description: 'Rahuri spiritual leader and keeper of island traditions.', skills: [], advantages: [], quirk: '', nation: 'Rahuri', source: 'Pirate Nations' },
  { name: 'Horizon Chaser', description: 'Rahuri explorer driven to discover what lies beyond the horizon.', skills: [], advantages: [], quirk: '', nation: 'Rahuri', source: 'Pirate Nations' },

  // ── Crescent Empire — General (4) ──
  { name: 'Castaway', description: 'Shipwreck survivor stranded far from home.', skills: [], advantages: [], quirk: '', source: 'Crescent Empire' },
  { name: 'Poet', description: 'Crescent wordsmith whose verses move hearts and minds.', skills: [], advantages: [], quirk: '', source: 'Crescent Empire' },
  { name: 'Tactician', description: 'Crescent military mind schooled in the art of war.', skills: [], advantages: [], quirk: '', source: 'Crescent Empire' },
  { name: 'Treasure Hunter', description: 'Seeker of lost relics and ancient Crescent wealth.', skills: [], advantages: [], quirk: '', source: 'Crescent Empire' },

  // ── Crescent Empire — National (20) ──
  { name: 'Alharis', description: 'Anatol Ayh guardian and protector of the faith.', skills: [], advantages: [], quirk: '', nation: 'Anatol Ayh', source: 'Crescent Empire' },
  { name: 'Ghazi', description: 'Anatol Ayh holy warrior fighting for the Crescent.', skills: [], advantages: [], quirk: '', nation: 'Anatol Ayh', source: 'Crescent Empire' },
  { name: 'Kurtanoglu', description: 'Anatol Ayh corsair raiding the seas under the Sultan\'s banner.', skills: [], advantages: [], quirk: '', nation: 'Anatol Ayh', source: 'Crescent Empire' },
  { name: 'Yol Seeker', description: 'Anatol Ayh pilgrim searching for spiritual truth.', skills: [], advantages: [], quirk: '', nation: 'Anatol Ayh', source: 'Crescent Empire' },
  { name: 'Climber of the Green Mountain', description: 'Ashur ascetic climbing toward enlightenment.', skills: [], advantages: [], quirk: '', nation: 'Ashur', source: 'Crescent Empire' },
  { name: 'Elohim', description: 'Ashur divine messenger carrying the word of the Creator.', skills: [], advantages: [], quirk: '', nation: 'Ashur', source: 'Crescent Empire' },
  { name: 'Hatapu', description: 'Ashur spiritual guardian protecting sacred sites.', skills: [], advantages: [], quirk: '', nation: 'Ashur', source: 'Crescent Empire' },
  { name: 'Pleroma', description: 'Ashur seeker of the divine fullness and cosmic truth.', skills: [], advantages: [], quirk: '', nation: 'Ashur', source: 'Crescent Empire' },
  { name: 'Immortal', description: 'Persis warrior who has transcended normal human limits.', skills: [], advantages: [], quirk: '', nation: 'Persis', source: 'Crescent Empire' },
  { name: 'Khahesh', description: 'Persis wishgranter entwined with ancient djinn pacts.', skills: [], advantages: [], quirk: '', nation: 'Persis', source: 'Crescent Empire' },
  { name: 'Persic Rebel', description: 'Persis freedom fighter opposing tyranny.', skills: [], advantages: [], quirk: '', nation: 'Persis', source: 'Crescent Empire' },
  { name: 'Student of Firuzeh', description: 'Persis disciple studying the arts of the legendary Firuzeh.', skills: [], advantages: [], quirk: '', nation: 'Persis', source: 'Crescent Empire' },
  { name: 'Chavra', description: 'Sarmion community leader binding people together.', skills: [], advantages: [], quirk: '', nation: 'Sarmion', source: 'Crescent Empire' },
  { name: 'Chayalim', description: 'Sarmion soldier defending the community.', skills: [], advantages: [], quirk: '', nation: 'Sarmion', source: 'Crescent Empire' },
  { name: 'Divine Lyrist', description: 'Sarmion sacred musician whose songs carry divine power.', skills: [], advantages: [], quirk: '', nation: 'Sarmion', source: 'Crescent Empire' },
  { name: 'Yachidi Doctor', description: 'Sarmion healer practicing ancient medicinal traditions.', skills: [], advantages: [], quirk: '', nation: 'Sarmion', source: 'Crescent Empire' },
  { name: 'Khadim', description: 'Crescent servant elevated through loyalty and cunning.', skills: [], advantages: [], quirk: '', source: 'Crescent Empire' },
  { name: 'Murshid', description: 'Crescent spiritual guide and teacher.', skills: [], advantages: [], quirk: '', source: 'Crescent Empire' },
  { name: 'Mustakshaf', description: 'Crescent explorer charting unknown lands.', skills: [], advantages: [], quirk: '', source: 'Crescent Empire' },
  { name: 'Zahrah\'s Cousin', description: 'Crescent Empire noble with ties to the Sultan\'s family.', skills: [], advantages: [], quirk: '', source: 'Crescent Empire' },

  // ── New World — General (4) ──
  { name: 'Athlete', description: 'New World competitor trained in traditional games and sports.', skills: [], advantages: [], quirk: '', source: 'The New World' },
  { name: 'Chartered Tradesman', description: 'Licensed trader operating between New World and Theah.', skills: [], advantages: [], quirk: '', source: 'The New World' },
  { name: 'Thean Immigrant', description: 'Thean settler making a new life in the New World.', skills: [], advantages: [], quirk: '', source: 'The New World' },
  { name: 'Relic Smuggler', description: 'Dealer in stolen antiquities from New World ruins.', skills: [], advantages: [], quirk: '', source: 'The New World' },

  // ── New World — National (12) ──
  { name: 'Awqaylli', description: 'Kuraq warrior-noble serving the empire.', skills: [], advantages: [], quirk: '', nation: 'Kuraq', source: 'The New World' },
  { name: 'Churikuna', description: 'Kuraq knife-fighter and guardian.', skills: [], advantages: [], quirk: '', nation: 'Kuraq', source: 'The New World' },
  { name: 'Pakaykuq', description: 'Kuraq healer using traditional medicine.', skills: [], advantages: [], quirk: '', nation: 'Kuraq', source: 'The New World' },
  { name: 'Tokoyriq', description: 'Kuraq judge and arbiter of disputes.', skills: [], advantages: [], quirk: '', nation: 'Kuraq', source: 'The New World' },
  { name: 'Cuauhmeh', description: 'Nahuacan eagle warrior of great renown.', skills: [], advantages: [], quirk: '', nation: 'Nahuacan Alliance', source: 'The New World' },
  { name: 'Ocelomeh', description: 'Nahuacan jaguar warrior, fierce and stealthy.', skills: [], advantages: [], quirk: '', nation: 'Nahuacan Alliance', source: 'The New World' },
  { name: 'Pochteca', description: 'Nahuacan merchant-spy traversing trade routes.', skills: [], advantages: [], quirk: '', nation: 'Nahuacan Alliance', source: 'The New World' },
  { name: 'Tepantlato', description: 'Nahuacan advocate and speaker for the people.', skills: [], advantages: [], quirk: '', nation: 'Nahuacan Alliance', source: 'The New World' },
  { name: 'Holkanob', description: 'Tzak K\'an warrior defending the jungle cities.', skills: [], advantages: [], quirk: '', nation: 'Tzak K\'an', source: 'The New World' },
  { name: 'La Ventan', description: 'New World Castillian colonist carving out a new life.', skills: [], advantages: [], quirk: '', source: 'The New World' },
  { name: 'Shaman', description: 'New World spiritual leader communing with the spirit world.', skills: [], advantages: [], quirk: '', source: 'The New World' },
  { name: 'Vision Priest', description: 'New World holy figure receiving divine visions.', skills: [], advantages: [], quirk: '', source: 'The New World' },

  // ── Khitai — General (~36) ──
  { name: 'Aristocrat (Khitai)', description: 'Khitai noble born to power and tradition.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Army Officer (Khitai)', description: 'Khitai military commander.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Artist (Khitai)', description: 'Khitai creative soul practicing traditional arts.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Assassin (Khitai)', description: 'Khitai silent killer trained in eastern methods.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Athlete (Khitai)', description: 'Khitai competitor and physical marvel.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Cavalry (Khitai)', description: 'Khitai mounted warrior of the eastern lands.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Concubine', description: 'Khitai companion wielding influence behind the scenes.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Courtier (Khitai)', description: 'Khitai political player navigating eastern courts.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Craftsman', description: 'Khitai artisan creating works of great beauty and skill.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Criminal (Khitai)', description: 'Khitai underworld figure.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Doctor (Khitai)', description: 'Khitai physician practicing traditional medicine.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Engineer (Khitai)', description: 'Khitai builder and inventor.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Escaped Prisoner', description: 'Khitai fugitive who broke free from captivity.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Explorer (Khitai)', description: 'Khitai traveler mapping unknown lands.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Farmkid (Khitai)', description: 'Khitai rural youth with simple values.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Historian', description: 'Khitai keeper of the past and chronicler of events.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Hunter (Khitai)', description: 'Khitai tracker and wilderness expert.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Mercenary (Khitai)', description: 'Khitai sword for hire.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Merchant (Khitai)', description: 'Khitai trader along the eastern routes.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Naval Officer (Khitai)', description: 'Khitai fleet officer commanding eastern warships.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Orphan (Khitai)', description: 'Khitai youth raised without family.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Performer (Khitai)', description: 'Khitai entertainer of traditional arts.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Pirate (Khitai)', description: 'Khitai sea raider of the eastern waters.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Poet (Khitai)', description: 'Khitai wordsmith composing verse and song.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Priest (Khitai)', description: 'Khitai holy figure serving eastern faiths.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Pugilist (Khitai)', description: 'Khitai martial artist fighting bare-handed.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Sailor (Khitai)', description: 'Khitai seafarer of the eastern oceans.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Scholar (Khitai)', description: 'Khitai academic pursuing eastern knowledge.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Servant (Khitai)', description: 'Khitai retainer in service to others.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Ship Captain (Khitai)', description: 'Khitai master of an eastern vessel.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Soldier (Khitai)', description: 'Khitai professional warrior.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Spy (Khitai)', description: 'Khitai infiltrator and intelligence gatherer.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Swordsman', description: 'Khitai blade master devoted to the way of the sword.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Tactician (Khitai)', description: 'Khitai military strategist.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Teacher', description: 'Khitai educator passing on knowledge and tradition.', skills: [], advantages: [], quirk: '', source: 'Khitai' },
  { name: 'Treasure Hunter (Khitai)', description: 'Khitai seeker of lost eastern relics.', skills: [], advantages: [], quirk: '', source: 'Khitai' },

  // ── Khitai — National (~24) ──
  { name: 'Ardhadevata', description: 'Agnivarshan demigod-blooded individual touched by divine power.', skills: [], advantages: [], quirk: '', nation: 'Agnivarsa', source: 'Khitai' },
  { name: 'Asharaph', description: 'Agnivarshan noble of ancient and distinguished lineage.', skills: [], advantages: [], quirk: '', nation: 'Agnivarsa', source: 'Khitai' },
  { name: 'Nartakee', description: 'Agnivarshan dancer whose movement tells sacred stories.', skills: [], advantages: [], quirk: '', nation: 'Agnivarsa', source: 'Khitai' },
  { name: 'Shoorveer Jati', description: 'Agnivarshan warrior caste member born to fight.', skills: [], advantages: [], quirk: '', nation: 'Agnivarsa', source: 'Khitai' },
  { name: 'Heimin', description: 'Fuso commoner navigating a rigid social hierarchy.', skills: [], advantages: [], quirk: '', nation: 'Fuso', source: 'Khitai' },
  { name: 'Nispa', description: 'Fuso indigenous people of the northern islands.', skills: [], advantages: [], quirk: '', nation: 'Fuso', source: 'Khitai' },
  { name: 'Off the Wheel', description: 'Fuso outcast who has stepped outside the cycle of rebirth.', skills: [], advantages: [], quirk: '', nation: 'Fuso', source: 'Khitai' },
  { name: 'Samurai', description: 'Fuso warrior bound by duty and honor.', skills: [], advantages: [], quirk: '', nation: 'Fuso', source: 'Khitai' },
  { name: 'Daesa', description: 'Han scholar-official serving the bureaucracy.', skills: [], advantages: [], quirk: '', nation: 'Han', source: 'Khitai' },
  { name: 'Yeon-Yein', description: 'Han entertainer and artist of the courts.', skills: [], advantages: [], quirk: '', nation: 'Han', source: 'Khitai' },
  { name: 'Sin-Dong', description: 'Han child prodigy of extraordinary talent.', skills: [], advantages: [], quirk: '', nation: 'Han', source: 'Khitai' },
  { name: 'Uibyeong', description: 'Han righteous army volunteer fighting for justice.', skills: [], advantages: [], quirk: '', nation: 'Han', source: 'Khitai' },
  { name: 'Deeremchin', description: 'Khazari mounted archer of the steppes.', skills: [], advantages: [], quirk: '', nation: 'Khazaria', source: 'Khitai' },
  { name: 'Teeverlegch', description: 'Khazari camel herder of the vast grasslands.', skills: [], advantages: [], quirk: '', nation: 'Khazaria', source: 'Khitai' },
  { name: 'Shulam', description: 'Khazari shaman communicating with ancestral spirits.', skills: [], advantages: [], quirk: '', nation: 'Khazaria', source: 'Khitai' },
  { name: 'Kharvaach', description: 'Khazari raider striking swift and vanishing into the steppe.', skills: [], advantages: [], quirk: '', nation: 'Khazaria', source: 'Khitai' },
  { name: 'Thephsing', description: 'Pinya mountain warrior of the highland kingdoms.', skills: [], advantages: [], quirk: '', nation: 'Nagaja', source: 'Khitai' },
  { name: 'Tng-bab Na', description: 'Pinya spirit medium channeling ancestral voices.', skills: [], advantages: [], quirk: '', nation: 'Nagaja', source: 'Khitai' },
  { name: 'Muni', description: 'Pinya sage and ascetic pursuing enlightenment.', skills: [], advantages: [], quirk: '', nation: 'Nagaja', source: 'Khitai' },
  { name: 'Yam Sephan', description: 'Pinya river trader navigating the waterways.', skills: [], advantages: [], quirk: '', nation: 'Nagaja', source: 'Khitai' },
  { name: 'Fangshi', description: 'Shenzhou alchemist and seeker of immortality.', skills: [], advantages: [], quirk: '', nation: 'Shenzhou', source: 'Khitai' },
  { name: 'Haidao', description: 'Shenzhou pirate lord of the eastern seas.', skills: [], advantages: [], quirk: '', nation: 'Shenzhou', source: 'Khitai' },
  { name: 'Seng', description: 'Shenzhou monk devoted to spiritual discipline.', skills: [], advantages: [], quirk: '', nation: 'Shenzhou', source: 'Khitai' },
  { name: 'Zhaofen Zhe', description: 'Shenzhou troublemaker and revolutionary agitator.', skills: [], advantages: [], quirk: '', nation: 'Shenzhou', source: 'Khitai' },
];

// ─── HELPER: Get backgrounds by source ─────────────────────────────────────
export function getBackgroundsBySource(source) {
  return BACKGROUNDS.filter(b => b.source === source);
}

// ─── HELPER: Get backgrounds by nation ─────────────────────────────────────
export function getBackgroundsByNation(nation) {
  return BACKGROUNDS.filter(b => b.nation === nation);
}

// ─── DUELING STYLES ────────────────────────────────────────────────────────
// Each: { name, nation, trait, description, styleBonus, source }

export const DUELING_STYLES = [
  // ── Core Rulebook (12) ──
  { name: 'Aldana', nation: 'Castille', trait: 'Finesse', description: 'Fluid and graceful, Aldana focuses on using your opponent\'s aggression against them.', styleBonus: 'Feint (turn a Slash into bonus dice), Riposte (deal damage when you parry).', source: 'Core Rulebook' },
  { name: 'Ambrogia', nation: 'Vodacce', trait: 'Finesse', description: 'Dual-wielding style using a main-gauche. Fights with two weapons simultaneously.', styleBonus: 'Slash, Feint, Lunge (extra Wounds on hit).', source: 'Core Rulebook' },
  { name: 'Boucher', nation: 'Montaigne', trait: 'Brawn', description: 'A brutal Montaigne street-fighting style using overwhelming force and dirty tricks.', styleBonus: 'Boucher Step: spend a Hero Point to deal Wounds equal to Brawn to a Brute Squad.', source: 'Core Rulebook' },
  { name: 'Donovan', nation: 'Avalon', trait: 'Resolve', description: 'Heavy-hitting and defensive. Built around patience and devastating counters.', styleBonus: 'Bash (knock opponent off-balance), Riposte, Slash.', source: 'Core Rulebook' },
  { name: 'Drexel', nation: 'Eisen', trait: 'Brawn', description: 'Two-handed weapon style for greatswords and polearms. Powerful but slow.', styleBonus: 'Slash, Beat (destroy opponent\'s weapon), Lunge.', source: 'Core Rulebook' },
  { name: 'Eisenfaust', nation: 'Eisen', trait: 'Resolve', description: 'Panzerhand (iron gauntlet) fighting. Catches blades bare-handed.', styleBonus: 'Slash, Riposte, Iron Reply (catch and counter).', source: 'Core Rulebook' },
  { name: 'Leegstra', nation: 'Vestenmennavenjar', trait: 'Brawn', description: 'Berserker fury — fights without regard for personal safety.', styleBonus: 'Slash, Lunge, Rage (take Wounds to deal extra damage).', source: 'Core Rulebook' },
  { name: 'Mantovani', nation: 'Vodacce', trait: 'Panache', description: 'Cloak-and-rapier, deceptive and theatrical.', styleBonus: 'Feint, Flourish (distract and reposition), Slash.', source: 'Core Rulebook' },
  { name: 'Mireli', nation: 'Sarmatian Commonwealth', trait: 'Finesse', description: 'Sabre style emphasizing speed and mounted combat.', styleBonus: 'Slash, Feint, Lunge.', source: 'Core Rulebook' },
  { name: 'Sabat', nation: 'Crescent Empire', trait: 'Panache', description: 'Scimitar fighting incorporating footwork and misdirection.', styleBonus: 'Slash, Feint, Flourish.', source: 'Core Rulebook' },
  { name: 'Torres', nation: 'Castille', trait: 'Wits', description: 'Defensive and patient, waiting for the perfect counter.', styleBonus: 'Riposte, Bash, Slash.', source: 'Core Rulebook' },
  { name: 'Valroux', nation: 'Montaigne', trait: 'Finesse', description: 'Classic fencing — elegant, precise, and lethal. The quintessential rapier school.', styleBonus: 'Slash, Feint, Lunge.', source: 'Core Rulebook' },

  // ── Nations of Theah Vol 1 (4) ──
  { name: 'Skatha\'s Cleasa', nation: 'Avalon', trait: 'Athletics', description: 'Ancient Avalon style taught by the legendary warrior-woman Skatha. Emphasizes acrobatic movement and unconventional attacks.', styleBonus: 'Use Athletics instead of Weaponry for dueling maneuvers.', source: 'Nations of Theah Vol 1' },
  { name: 'Siqueira', nation: 'Castille', trait: 'Finesse', description: 'Castillian naval fencing style developed for fighting on the deck of a ship.', styleBonus: 'Bonus when fighting in confined or unsteady spaces.', source: 'Nations of Theah Vol 1' },
  { name: 'De Vore', nation: 'Montaigne', trait: 'Finesse', description: 'Montaigne noble dueling style emphasizing precision and elegant lethality.', styleBonus: 'Precision strikes targeting specific weaknesses.', source: 'Nations of Theah Vol 1' },
  { name: 'Hallbjorn', nation: 'Vesten', trait: 'Brawn', description: 'Vesten axe-and-shield style honoring the ancient warrior traditions of the north.', styleBonus: 'Shield-based defense and powerful axe strikes.', source: 'Nations of Theah Vol 1' },

  // ── Nations of Theah Vol 2 (4) ──
  { name: 'Kummerholt', nation: 'Eisen', trait: 'Weaponry', description: 'Eisen military swordsmanship focused on efficient, disciplined bladework.', styleBonus: 'Disciplined strikes that punish opponents who overextend.', source: 'Nations of Theah Vol 2' },
  { name: 'Szybowanie', nation: 'Sarmatian Commonwealth', trait: 'Ride', description: 'Sarmatian mounted combat style — the art of fighting from horseback with lance and sabre.', styleBonus: 'Use Ride instead of Weaponry for mounted dueling maneuvers.', source: 'Nations of Theah Vol 2' },
  { name: 'Kulachniy Boi', nation: 'Ussura', trait: 'Brawl', description: 'Ussuran bare-knuckle boxing tradition. Raw power and endurance over finesse.', styleBonus: 'Use Brawl instead of Weaponry for dueling maneuvers.', source: 'Nations of Theah Vol 2' },
  { name: 'Le Strade', nation: 'Vodacce', trait: 'Finesse', description: 'Vodacce street-fighting style born in the back alleys, using knives and dirty tricks.', styleBonus: 'Bonus when using improvised weapons or fighting dirty.', source: 'Nations of Theah Vol 2' },

  // ── Pirate Nations (3) ──
  { name: 'Bugu Takobi', nation: 'Jaragua', trait: 'Weaponry', description: 'Jaraguan machete fighting style combining powerful cuts with spiritual resolve.', styleBonus: 'Powerful slashing attacks channeling spiritual energy.', source: 'Pirate Nations' },
  { name: 'Jogo de Dentro', nation: 'La Bucca', trait: 'Brawl', description: 'La Bucca capoeira-inspired style blending dance, acrobatics, and devastating kicks.', styleBonus: 'Use Brawl for dueling; acrobatic movement as defense.', source: 'Pirate Nations' },
  { name: 'Lakedaimon Agoge', nation: 'Numa', trait: 'Varies', description: 'Numan martial discipline based on the ancient Agoge training. Adaptable to any weapon.', styleBonus: 'Choose a Trait at the start of each duel; disciplined versatility.', source: 'Pirate Nations' },

  // ── Crescent Empire (2) ──
  { name: 'Badayah', nation: '8th Sea', trait: 'Finesse', description: 'A fluid, water-inspired fighting art from the 8th Sea tradition of the Crescent.', styleBonus: 'Flowing defense that redirects enemy attacks.', source: 'Crescent Empire' },
  { name: 'Fa\'tahib', nation: 'Crescent Empire', trait: 'Panache', description: 'Crescent dueling art emphasizing misdirection, flourishes, and sudden strikes.', styleBonus: 'Dazzling footwork and misdirection in combat.', source: 'Crescent Empire' },

  // ── Khitai (8) ──
  { name: 'Calis', nation: 'Agnivarsa', trait: 'Finesse', description: 'Agnivarshan weapon art using flexible blades and spinning techniques.', styleBonus: 'Flexible weapon maneuvers with spinning strikes.', source: 'Khitai' },
  { name: 'Coreeda', nation: 'Khitai', trait: 'Brawn', description: 'Traditional wrestling style emphasizing grappling and throws.', styleBonus: 'Grappling maneuvers that control the opponent.', source: 'Khitai' },
  { name: 'Mori Naiz', nation: 'Fuso', trait: 'Resolve', description: 'Fuso blade art focused on the single perfect cut — iaijutsu-inspired.', styleBonus: 'Devastating single-strike techniques from the draw.', source: 'Khitai' },
  { name: 'Gang Yu Qiang', nation: 'Shenzhou', trait: 'Finesse', description: 'Shenzhou spear fighting art emphasizing reach and precision.', styleBonus: 'Superior reach and precise thrusting attacks.', source: 'Khitai' },
  { name: 'Mateenatya', nation: 'Agnivarsa', trait: 'Panache', description: 'Agnivarshan dance-fighting art blending performance and combat.', styleBonus: 'Dance-based movement that doubles as offense and defense.', source: 'Khitai' },
  { name: 'Okada-ryu Kenjutsu', nation: 'Fuso', trait: 'Finesse', description: 'Fuso classical sword school emphasizing kata and discipline.', styleBonus: 'Precise katana techniques honed through endless practice.', source: 'Khitai' },
  { name: 'Ssang Geom', nation: 'Han', trait: 'Finesse', description: 'Han dual-sword art using paired blades in fluid combination.', styleBonus: 'Twin-blade offense creating overlapping attack patterns.', source: 'Khitai' },
  { name: 'Yuthakun Khom', nation: 'Nagaja', trait: 'Brawn', description: 'Southeast Asian striking art using elbows, knees, and clinch fighting.', styleBonus: 'Devastating close-range strikes with elbows and knees.', source: 'Khitai' },
];

// ─── HELPER: Get dueling styles by source ──────────────────────────────────
export function getDuelingStylesBySource(source) {
  return DUELING_STYLES.filter(s => s.source === source);
}

// ─── SECRET SOCIETIES ──────────────────────────────────────────────────────
// Each: { name, description, source }

export const SECRET_SOCIETIES = [
  // ── Core Rulebook (10) ──
  { name: 'Brotherhood of the Coast', description: 'A pirate democracy dedicated to freedom of the seas. They protect sailors and fight tyranny on the waves, governed by a Charter that carries actual sorcery — signers receive a Blessing of good fortune and a Curse that brings ruination upon betrayers.', hierarchy: 'Queen of Pirates → Council of Captains → all Brotherhood members (democratic)', joining: 'Travel to Aragosta and sign the Charter in blood at the Bucket o\' Blood tavern.', source: 'Core Rulebook / Secret Societies' },
  { name: 'Die Kreuzritter', description: 'An ancient monster-hunting knightly order fighting supernatural threats in the shadows. They guard humanity against dark forces through rigorous training and an unyielding code of three obligations: Loyalty, Charity, and Peace.', hierarchy: 'Magister → Lehrer (chapter leaders) → Der Brüder/Die Schwestern (full knights) → Laie (lay members) → Scripta (neophytes)', joining: 'Three obligations — Loyalty (study and oath), Charity (community service), Peace (solo monster hunt and kill). Induction involves a branding ceremony.', source: 'Core Rulebook / Secret Societies' },
  { name: "Explorer's Society", description: 'Seekers of lost knowledge and ancient artifacts organized into three branches: Curators, Scholars, and Explorers. They fund expeditions, study Syrneth ruins, and preserve dangerous artifacts from falling into the wrong hands.', hierarchy: 'Three branches (Curators, Scholars, Explorers). Ranks: Apprentice → Journeyman → Master', joining: 'Apply at a local chapter house and serve as an Apprentice under a Master\'s guidance.', source: 'Core Rulebook / Secret Societies' },
  { name: 'Invisible College', description: 'A secret scientific network hunted by the Inquisition, preserving knowledge and advancing free thought. Organized into three divisions that handle field operations, research, and leadership respectively.', hierarchy: 'Pars Primi (Sensus/field agents) · Pars Secundi (Scientia/researchers) · Pars Tertii (Sapientia/leaders)', joining: 'Recruited by existing members after demonstrating scientific aptitude and commitment to free inquiry.', source: 'Core Rulebook / Secret Societies' },
  { name: 'Knights of the Rose & Cross', description: 'Champions of justice who protect the innocent and fight for the oppressed regardless of nation or faith. Their training involves rigorous martial and intellectual education, and the Great Secret and the Black Stone are central mysteries of the order.', hierarchy: 'Grand Master → Knight Commanders → Knights', joining: 'Recruited and trained by the order; must pass rigorous graduation trials combining martial and intellectual tests.', source: 'Core Rulebook / Secret Societies' },
  { name: 'Los Vagabundos', description: 'Masked vigilantes of Castille fighting tyranny and opposing the Inquisition. Members "don the mask" to become anonymous justice-seekers, using a secret flower language for covert communication among their ranks.', hierarchy: 'Decentralized — each Vagabundo operates independently under a shared code of justice', joining: 'Must earn a mask by proving dedication to justice and the protection of Castille\'s people.', source: 'Core Rulebook / Secret Societies' },
  { name: 'Močiutės Skara', description: 'Sarmatian witches guarding ancient pacts and traditions, preserving the old ways and protecting the Commonwealth. Their organization is based on the Sylwa Rerum, ancient records that guide local groups in maintaining supernatural pacts.', hierarchy: 'Local groups organized around the Sylwa Rerum (ancient records), each maintaining their own pacts and traditions', joining: 'Must be invited by an existing member and demonstrate a genuine connection to the old ways.', source: 'Core Rulebook / Secret Societies' },
  { name: 'Rilasciare', description: 'Revolutionary anarchists seeking to overthrow all tyrants and unjust authority. Organized into factions with different approaches to liberation, they operate printing presses for propaganda and use elaborate codes and ciphers for communication.', hierarchy: 'Loosely organized into factions with different philosophical approaches to revolution', joining: 'Open to anyone who opposes tyranny, but trust must be earned through demonstrated commitment to the cause.', source: 'Core Rulebook / Secret Societies' },
  { name: "Sophia's Daughters", description: 'Secret sisterhood protecting women across Theah. They work behind the scenes to empower women and oppose patriarchal tyranny.', hierarchy: null, joining: null, source: 'Core Rulebook' },
  { name: 'Novus Ordo Mundi', description: 'Shadow manipulators seeking to control nations from behind the scenes through a vast conspiracy of power brokers. Highly secretive with compartmentalized operations, most members never know the full scope of the organization they serve.', hierarchy: 'Highly secretive with compartmentalized cells — most members only know their immediate contacts', joining: 'Recruited (often unknowingly) through front organizations and intermediaries.', source: 'Core Rulebook / Secret Societies' },

  // ── Pirate Nations (2) ──
  { name: 'La Cosca', description: 'Organized crime syndicate operating across the Atabean, combining pirate muscle with merchant cunning.', source: 'Pirate Nations' },
  { name: 'The Riroco', description: 'Secret society of freed slaves and their allies fighting against the slave trade in the Atabean.', source: 'Pirate Nations' },

  // ── Crescent Empire (2) ──
  { name: 'Alnniqabat Lilnnusr', description: 'The Veils of Victory — Crescent secret society working to protect the faithful and preserve sacred knowledge.', source: 'Crescent Empire' },
  { name: "Angel's Hand", description: 'Crescent society of healers and protectors guided by divine visions to aid those in need.', source: 'Crescent Empire' },

  // ── New World (3) ──
  { name: 'Guardians of Aztlan', description: 'Protectors of the Nahuacan homeland, working to preserve their civilization against Thean colonization.', source: 'The New World' },
  { name: "Jaguar's Heirs", description: 'Warriors and scholars preserving the ancient jaguar warrior traditions and resisting foreign influence.', source: 'The New World' },
  { name: 'Pochteca (Society)', description: 'Nahuacan merchant-spies using trade networks to gather intelligence and protect New World interests.', source: 'The New World' },

  // ── Lands of Gold & Fire (4) ──
  { name: 'Atoka-ona Farasin', description: 'Ifrian mounted warriors preserving the ancient traditions of the horsemen of the savanna.', source: 'Lands of Gold and Fire' },
  { name: "Ch'ewi", description: 'Ifrian society dedicated to the old games — using competition and sport to resolve disputes and build alliances.', source: 'Lands of Gold and Fire' },
  { name: 'Children of Esu', description: 'Trickster society honoring the spirit Esu, using cunning and misdirection to fight oppression.', source: 'Lands of Gold and Fire' },
  { name: 'Keepers of the Sun', description: 'Ifrian society guarding ancient solar knowledge and the sacred astronomical traditions of their ancestors.', source: 'Lands of Gold and Fire' },

  // ── Khitai (5) ──
  { name: 'Unen Dain', description: 'Khazari society of truth-seekers devoted to uncovering lies and fighting corruption across the steppes.', source: 'Khitai' },
  { name: 'Shambhala', description: 'Mystical society seeking the hidden paradise of Shambhala and the enlightenment it promises.', source: 'Khitai' },
  { name: 'Silver Institute', description: 'Shenzhou scholarly society preserving forbidden knowledge and advancing science in secret.', source: 'Khitai' },
  { name: 'The 108', description: 'Band of 108 outlaws united against tyranny, inspired by legendary heroes who fought corrupt officials.', source: 'Khitai' },
  { name: 'Tongyi Society', description: 'Pan-Khitai unification movement working to bring the eastern nations together against common threats.', source: 'Khitai' },
];

// ─── HELPER: Get secret societies by source ────────────────────────────────
export function getSecretSocietiesBySource(source) {
  return SECRET_SOCIETIES.filter(s => s.source === source);
}

// ─── ARCANA ────────────────────────────────────────────────────────────────
// Virtues and Hubris from all sources

export const ARCANA = {
  // ── Core Rulebook — Sorte Deck (20 cards, each with Virtue + Hubris) ──
  corebook: [
    { card: 'The Fool', virtue: { name: 'Wily', effect: 'Activate when you act on insufficient information. Gain 1 Hero Point.' }, hubris: { name: 'Curious', effect: 'Receive a Hero Point when you investigate something dangerous.' } },
    { card: 'The Road', virtue: { name: 'Friendly', effect: 'Activate when you meet someone for the first time. Gain 1 Hero Point.' }, hubris: { name: 'Underconfident', effect: 'Receive a Hero Point when you doubt yourself at a critical moment.' } },
    { card: 'The Magician', virtue: { name: 'Willful', effect: 'Activate when you solve a problem through sheer determination. Gain 1 Hero Point.' }, hubris: { name: 'Ambitious', effect: 'Receive a Hero Point when you chase power at the expense of others.' } },
    { card: 'The Lovers', virtue: { name: 'Passionate', effect: 'Activate when you put yourself in danger to protect someone you love. Gain 1 Hero Point.' }, hubris: { name: 'Star-Crossed', effect: 'Receive a Hero Point when your romantic entanglement causes problems.' } },
    { card: 'The Wheel', virtue: { name: 'Fortunate', effect: 'Activate when you stumble upon something that benefits you unexpectedly. Gain 1 Hero Point.' }, hubris: { name: 'Unfortunate', effect: 'Receive a Hero Point when bad luck catches up with you.' } },
    { card: 'The Devil', virtue: { name: 'Astute', effect: 'Activate when you uncover a deception. Gain 1 Hero Point.' }, hubris: { name: 'Trusting', effect: 'Receive a Hero Point when you trust someone you shouldn\'t.' } },
    { card: 'The Tower', virtue: { name: 'Humble', effect: 'Activate when you sacrifice something important to help someone in need. Gain 1 Hero Point.' }, hubris: { name: 'Arrogant', effect: 'Receive a Hero Point when your pride leads you into trouble.' } },
    { card: 'The Beggar', virtue: { name: 'Insightful', effect: 'Activate when you discover something nobody else noticed. Gain 1 Hero Point.' }, hubris: { name: 'Envious', effect: 'Receive a Hero Point when you covet what someone else has.' } },
    { card: 'The War', virtue: { name: 'Victorious', effect: 'Activate when you defeat a Villain in combat. Gain 1 Hero Point.' }, hubris: { name: 'Loyal', effect: 'Receive a Hero Point when your loyalty to someone gets you in trouble.' } },
    { card: 'The Hanged Man', virtue: { name: 'Altruistic', effect: 'Activate when you sacrifice something for the greater good with no reward. Gain 1 Hero Point.' }, hubris: { name: 'Indecisive', effect: 'Receive a Hero Point when you hesitate and miss an opportunity.' } },
    { card: 'The Witch', virtue: { name: 'Intuitive', effect: 'Activate when you correctly guess a character\'s motivation. Gain 1 Hero Point.' }, hubris: { name: 'Manipulative', effect: 'Receive a Hero Point when you manipulate someone who trusts you.' } },
    { card: 'The Thrones', virtue: { name: 'Comforting', effect: 'Activate when you ease someone\'s suffering. Gain 1 Hero Point.' }, hubris: { name: 'Stubborn', effect: 'Receive a Hero Point when you refuse to change your mind when you should.' } },
    { card: 'The Moonless Night', virtue: { name: 'Subtle', effect: 'Activate when you accomplish a goal without anyone noticing. Gain 1 Hero Point.' }, hubris: { name: 'Confusion', effect: 'Receive a Hero Point when you overthink and make the wrong choice.' } },
    { card: 'Reunion', virtue: { name: 'Exemplary', effect: 'Activate when you set an example for others to follow. Gain 1 Hero Point.' }, hubris: { name: 'Bitterness', effect: 'Receive a Hero Point when your resentment drives your actions.' } },
    { card: 'The Hero', virtue: { name: 'Courageous', effect: 'Activate when you risk life and limb to save someone. Gain 1 Hero Point.' }, hubris: { name: 'Foolhardy', effect: 'Receive a Hero Point when you rush into danger without a plan.' } },
    { card: 'The Glyph', virtue: { name: 'Temperate', effect: 'Activate when you resist temptation and choose the difficult path. Gain 1 Hero Point.' }, hubris: { name: 'Superstitious', effect: 'Receive a Hero Point when your superstitions cause problems.' } },
    { card: 'The Sun', virtue: { name: 'Glorious', effect: 'Activate when you achieve an impressive feat witnessed by others. Gain 1 Hero Point.' }, hubris: { name: 'Proud', effect: 'Receive a Hero Point when your need for recognition costs you.' } },
    { card: 'The Prophet', virtue: { name: 'Illuminating', effect: 'Activate when you teach someone a valuable lesson. Gain 1 Hero Point.' }, hubris: { name: 'Overzealous', effect: 'Receive a Hero Point when your fervor alienates someone.' } },
    { card: 'The Emperor', virtue: { name: 'Commanding', effect: 'Activate when you lead a group successfully. Gain 1 Hero Point.' }, hubris: { name: 'Hot-Headed', effect: 'Receive a Hero Point when your temper makes things worse.' } },
    { card: 'Coins', virtue: { name: 'Adaptable', effect: 'Activate when you turn a setback into an opportunity. Gain 1 Hero Point.' }, hubris: { name: 'Relentless', effect: 'Receive a Hero Point when you refuse to give up when you should.' } },
  ],

  // ── New World — Nahuacan Calendar Cards (9) ──
  newWorld: [
    { card: 'Mountain', virtue: { name: 'Steadfast', effect: 'Activate when you hold your ground against overwhelming odds. Gain 1 Hero Point.' }, hubris: { name: 'Immovable', effect: 'Receive a Hero Point when your refusal to adapt causes problems.' } },
    { card: 'River', virtue: { name: 'Flowing', effect: 'Activate when you find a way around an obstacle rather than through it. Gain 1 Hero Point.' }, hubris: { name: 'Eroding', effect: 'Receive a Hero Point when your persistence wears down a relationship.' } },
    { card: 'Great Cycle', virtue: { name: 'Renewed', effect: 'Activate when you begin again after a great failure. Gain 1 Hero Point.' }, hubris: { name: 'Fatalistic', effect: 'Receive a Hero Point when you accept a bad outcome as inevitable.' } },
    { card: 'Scholar', virtue: { name: 'Wise', effect: 'Activate when your knowledge saves someone from harm. Gain 1 Hero Point.' }, hubris: { name: 'Pedantic', effect: 'Receive a Hero Point when your need to be right alienates others.' } },
    { card: 'Skywatcher', virtue: { name: 'Prophetic', effect: 'Activate when you predict an event before it happens. Gain 1 Hero Point.' }, hubris: { name: 'Dreaming', effect: 'Receive a Hero Point when you miss what is right in front of you.' } },
    { card: 'Explorer (Card)', virtue: { name: 'Daring', effect: 'Activate when you venture into the unknown and discover something valuable. Gain 1 Hero Point.' }, hubris: { name: 'Reckless', effect: 'Receive a Hero Point when your need to explore puts others at risk.' } },
    { card: 'Morning Star', virtue: { name: 'Hopeful', effect: 'Activate when you inspire hope in a dark situation. Gain 1 Hero Point.' }, hubris: { name: 'Naive', effect: 'Receive a Hero Point when your optimism blinds you to danger.' } },
    { card: 'Evening Star', virtue: { name: 'Reflective', effect: 'Activate when you learn from a past mistake. Gain 1 Hero Point.' }, hubris: { name: 'Melancholy', effect: 'Receive a Hero Point when dwelling on the past prevents action.' } },
    { card: 'Ceiba', virtue: { name: 'Rooted', effect: 'Activate when you draw on your heritage to solve a problem. Gain 1 Hero Point.' }, hubris: { name: 'Hidebound', effect: 'Receive a Hero Point when tradition prevents you from trying something new.' } },
  ],

  // ── Pirate Nations — Pirate Cards (3) ──
  pirateNations: [
    { card: 'Devil Jonah', virtue: { name: 'Defiant', effect: 'Activate when you spit in the face of certain doom. Gain 1 Hero Point.' }, hubris: { name: 'Cursed', effect: 'Receive a Hero Point when your bad luck spreads to those around you.' } },
    { card: 'Drowned Man', virtue: { name: 'Reborn', effect: 'Activate when you survive something that should have killed you. Gain 1 Hero Point.' }, hubris: { name: 'Obsessed', effect: 'Receive a Hero Point when your fixation on death leads you into trouble.' } },
    { card: 'Fisherman', virtue: { name: 'Patient', effect: 'Activate when your patience and planning pay off. Gain 1 Hero Point.' }, hubris: { name: 'Passive', effect: 'Receive a Hero Point when you wait too long and miss your chance.' } },
  ],

  // ── Khitai — Zodiac Signs (12) ──
  khitai: [
    { card: 'The Dragon', virtue: { name: 'Majestic', effect: 'Activate when you awe others with your presence or authority. Gain 1 Hero Point.' }, hubris: { name: 'Tyrannical', effect: 'Receive a Hero Point when you impose your will on others unjustly.' } },
    { card: 'The Tiger', virtue: { name: 'Fierce', effect: 'Activate when you protect the weak with ferocity. Gain 1 Hero Point.' }, hubris: { name: 'Savage', effect: 'Receive a Hero Point when your aggression causes collateral damage.' } },
    { card: 'The Crane', virtue: { name: 'Graceful', effect: 'Activate when you resolve a conflict through elegance and diplomacy. Gain 1 Hero Point.' }, hubris: { name: 'Vain', effect: 'Receive a Hero Point when your concern for appearances leads you astray.' } },
    { card: 'The Monkey', virtue: { name: 'Clever', effect: 'Activate when you outwit a more powerful opponent. Gain 1 Hero Point.' }, hubris: { name: 'Mischievous', effect: 'Receive a Hero Point when your pranks and tricks cause real harm.' } },
    { card: 'The Serpent', virtue: { name: 'Perceptive', effect: 'Activate when you see through a lie or hidden threat. Gain 1 Hero Point.' }, hubris: { name: 'Deceitful', effect: 'Receive a Hero Point when your lies catch up with you.' } },
    { card: 'The Horse', virtue: { name: 'Swift', effect: 'Activate when speed and quick action save the day. Gain 1 Hero Point.' }, hubris: { name: 'Restless', effect: 'Receive a Hero Point when your inability to stay still causes problems.' } },
    { card: 'The Ox', virtue: { name: 'Enduring', effect: 'Activate when you persevere through hardship to protect others. Gain 1 Hero Point.' }, hubris: { name: 'Obstinate', effect: 'Receive a Hero Point when your stubbornness makes things worse.' } },
    { card: 'The Phoenix', virtue: { name: 'Transcendent', effect: 'Activate when you transform a loss into a victory. Gain 1 Hero Point.' }, hubris: { name: 'Self-Destructive', effect: 'Receive a Hero Point when you burn yourself out to achieve a goal.' } },
    { card: 'The Tortoise', virtue: { name: 'Wise Elder', effect: 'Activate when age and experience prove more valuable than youth and vigor. Gain 1 Hero Point.' }, hubris: { name: 'Slow', effect: 'Receive a Hero Point when your caution causes you to act too late.' } },
    { card: 'The Fox', virtue: { name: 'Cunning', effect: 'Activate when you escape a trap through cleverness. Gain 1 Hero Point.' }, hubris: { name: 'Cowardly', effect: 'Receive a Hero Point when you flee from a fight you should have stayed in.' } },
    { card: 'The Rooster', virtue: { name: 'Vigilant', effect: 'Activate when you sound the alarm and prevent disaster. Gain 1 Hero Point.' }, hubris: { name: 'Boastful', effect: 'Receive a Hero Point when your bragging draws unwanted attention.' } },
    { card: 'The Dog', virtue: { name: 'Faithful', effect: 'Activate when your loyalty to a friend saves them from danger. Gain 1 Hero Point.' }, hubris: { name: 'Blind Loyalty', effect: 'Receive a Hero Point when following someone leads you into disaster.' } },
  ],
};

// ─── HELPER: Get all arcana as flat array ──────────────────────────────────
export function getAllArcana() {
  return [
    ...ARCANA.corebook,
    ...ARCANA.newWorld,
    ...ARCANA.pirateNations,
    ...ARCANA.khitai,
  ];
}

// ─── HELPER: Get all virtues ───────────────────────────────────────────────
export function getAllVirtues() {
  return getAllArcana().map(a => ({ card: a.card, ...a.virtue }));
}

// ─── HELPER: Get all hubrises ──────────────────────────────────────────────
export function getAllHubrises() {
  return getAllArcana().map(a => ({ card: a.card, ...a.hubris }));
}
