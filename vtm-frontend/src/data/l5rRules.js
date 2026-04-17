// Legend of the Five Rings 4th Edition — Quick Rules Reference

export const L5R_RULES = [
  {
    title: 'Roll & Keep — Core Mechanic',
    sections: [
      { heading: 'How to Roll', text: 'Roll Xk Y — roll X dice (d10), keep the highest Y results, sum them. X = Trait + Skill. Y = Trait (usually). A result of 10 explodes: roll again and add.' },
      { heading: 'Target Numbers (TNs)', text: 'Standard difficulties: Easy 10, Average 15, Moderate 20, Hard 25, Very Hard 30, Heroic 40. Each increment of 5 is called a Raise.' },
      { heading: 'Calling Raises', text: 'Before rolling, declare Raises to attempt extra effects (+5 to TN per Raise). If you fail the total TN, the entire roll fails. Free Raises don\'t increase TN.' },
      { heading: 'Unskilled Rolls', text: 'If you have 0 ranks in the skill, roll Trait alone (XkY where X=Y=Trait). Some skills (Lore, Medicine, etc.) cannot be rolled unskilled.' },
      { heading: 'Emphasis', text: 'At Skill rank 1, you choose an Emphasis (specialty). When rolling that Emphasis, you may re-roll any 1s once.' },
    ],
  },
  {
    title: 'Void Points',
    sections: [
      { heading: 'Pool', text: 'You have Void Points equal to your Void Ring. They refresh fully each morning after 8 hours rest, or 1 point per 4 hours of meditation.' },
      { heading: 'Spend 1 Void Point to...', text: 'Add +1k1 to any roll (declare before rolling). Reduce your Wound penalties by 1 category for one round. Temporarily increase a Ring by 1 for one roll. Add 1 Armor TN until your next turn.' },
      { heading: 'Cannot Spend', text: 'You cannot spend Void on damage rolls, or on rolls where another Void Point was already spent. Max 1 Void Point per roll.' },
    ],
  },
  {
    title: 'Combat Stances',
    sections: [
      { heading: 'Choose Each Round', text: 'At the start of your turn, declare your stance. It lasts until your next turn. You cannot change mid-round.' },
      { heading: 'Attack Stance', text: 'Normal combat. You may attack and perform maneuvers normally. No bonuses or penalties.' },
      { heading: 'Full Attack Stance', text: '+2k1 to attack rolls. Your Armor TN is reduced by 10. High risk, high reward — great for finishing blows.' },
      { heading: 'Defense Stance', text: 'Armor TN increased by your Defense Skill + Reflexes. You may not attack. You may still move and perform non-attack actions.' },
      { heading: 'Full Defense Stance', text: 'Roll Defense/Reflexes — add the result to your Armor TN until next turn. You may do nothing else (no movement, no attacks, no other actions).' },
      { heading: 'Center Stance', text: 'Meditate and focus. You may not attack or defend actively. Next round, you gain a bonus: +1k1+Void to your first roll. If struck, the Center is broken.' },
    ],
  },
  {
    title: 'Initiative & Rounds',
    sections: [
      { heading: 'Rolling Initiative', text: 'Roll Reflexes + Insight Rank (keep Reflexes). Highest goes first. Ties: higher Reflexes. Still tied: higher Void.' },
      { heading: 'Actions Per Round', text: 'One Simple Action + one Free Action. OR one Complex Action + one Free Action. Movement is a Free Action (Water Ring x 5 feet per round, or x10 if running as Simple).' },
      { heading: 'Simple Actions', text: 'Attack with a readied weapon, move (run), draw/sheathe weapon, mount/dismount, speak a short phrase, activate a spell (some).' },
      { heading: 'Complex Actions', text: 'Cast most spells, use a skill check, string a bow, pick a lock, full defense, disengage from melee.' },
    ],
  },
  {
    title: 'Attack & Damage',
    sections: [
      { heading: 'To Hit', text: 'Roll [Agility/Reflexes] + [Weapon Skill] (keep Trait) vs. target\'s Armor TN. Meet or exceed = hit.' },
      { heading: 'Armor TN', text: 'Base Armor TN = Reflexes x 5 + 5. Armor adds bonus. Defense Stance adds more. Full Attack reduces by 10.' },
      { heading: 'Damage Roll', text: 'On hit, roll weapon damage (listed as XkY). Add your Strength to the rolled dice (not kept). Armor reduces total damage.' },
      { heading: 'Called Shots', text: '1 Raise = target specific body part. Effects vary: head (+1k1 damage), arm (possible disarm), leg (possible knockdown).' },
      { heading: 'Extra Damage', text: '2 Raises = +1k0 to damage. Can stack multiple times.' },
    ],
  },
  {
    title: 'Wounds & Healing',
    sections: [
      { heading: 'Wound Ranks', text: 'Healthy (Earth x2), Nicked (Earth x2, -3), Grazed (Earth x2, -5), Hurt (Earth x2, -10), Injured (Earth x2, -15), Crippled (Earth x2, -20), Down (Earth x2, -40), Out (0).' },
      { heading: 'Wound Penalties', text: 'The penalty applies to ALL rolls while at that Wound Rank. Void Points can reduce the penalty by one category for one round.' },
      { heading: 'Down & Out', text: 'At Down: you may take 1 Simple Action per round at -40 penalty. At Out: unconscious, dying. You die at the end of the following round unless healed.' },
      { heading: 'Natural Healing', text: 'Heal Stamina x 2 + Insight Rank Wounds per day of rest. Half that if active. A Medicine/Intelligence roll (TN 15) heals additional Wounds equal to successes.' },
    ],
  },
  {
    title: 'Rings & Derived Stats',
    sections: [
      { heading: 'Ring Calculation', text: 'Each Ring = the LOWER of its two Traits. Air = min(Reflexes, Awareness). Earth = min(Stamina, Willpower). Fire = min(Agility, Intelligence). Water = min(Strength, Perception). Void = standalone.' },
      { heading: 'Insight', text: 'Insight = (all Rings x 10) + (all Skill ranks). Determines School Rank: Rank 1 (0), Rank 2 (150), Rank 3 (175), Rank 4 (200), Rank 5 (225+).' },
      { heading: 'Wound Capacity', text: 'Each Wound Rank holds Earth Ring x 2 Wounds. Higher Earth = more punishment before penalties kick in.' },
      { heading: 'Initiative', text: 'Reflexes + Insight Rank, keep Reflexes. Higher Reflexes = act earlier and keep more dice.' },
      { heading: 'Armor TN', text: 'Reflexes x 5 + 5 (base). Add armor bonus and any Defense stance bonuses.' },
    ],
  },
  {
    title: 'Spellcasting',
    sections: [
      { heading: 'Casting a Spell', text: 'Complex Action (or Simple for Mastery Level spells). Roll Ring/Trait (as listed by spell). TN = 5 + (Mastery Level x 5). Plus modifiers.' },
      { heading: 'Raises on Spells', text: 'Called Raises on spells can: increase range, increase duration, increase damage, increase area of effect. Specific options listed per spell.' },
      { heading: 'Spell Slots', text: 'You memorize spells each morning. Slots = School Rank + Ring of the spell\'s element. Once cast, a slot is spent until next morning.' },
      { heading: 'Importune / Sense / Commune', text: 'All shugenja can Sense (detect elements, TN 15), Commune (ask a kami a question, TN 20), and Importune (request a favor, TN 25+) without memorized spells.' },
    ],
  },
  {
    title: 'Honor, Glory & Status',
    sections: [
      { heading: 'Honor', text: 'Measures personal integrity (0.0-10.0). Gain: acts of bushido, self-sacrifice, honesty. Lose: lying, cheating, cowardice, breaking oaths. At 0: considered utterly dishonorable.' },
      { heading: 'Honor Rolls', text: 'Roll Honor (as a Trait) when tempted to act dishonorably. Success = resist temptation. Failure = you may still resist but it\'s harder (GM may impose consequences).' },
      { heading: 'Glory', text: 'Measures fame and reputation (0.0-10.0). Gain: public victories, heroic deeds, tournament wins. Lose: public failures, shameful defeats. High Glory = recognized on sight.' },
      { heading: 'Status', text: 'Measures social rank (0.0-10.0). Set by your lord, clan, and position. Determines who you can command and who commands you. Ronin start at 0.' },
    ],
  },
  {
    title: 'Kata',
    sections: [
      { heading: 'Activation', text: 'Kata are martial techniques. Activate as a Simple Action at the start of combat (or sometimes Free Action). Requires spending a Void Point unless stated otherwise.' },
      { heading: 'Duration', text: 'Most Kata last for the duration of the skirmish. Some last a single round or until triggered.' },
      { heading: 'Requirements', text: 'Each Kata has Ring and Skill requirements. You must meet ALL requirements to learn and use the Kata.' },
    ],
  },
  {
    title: 'School Rank & Techniques',
    sections: [
      { heading: 'Insight Requirements', text: 'Rank 1: start of play. Rank 2: Insight 150. Rank 3: Insight 175. Rank 4: Insight 200. Rank 5: Insight 225. Alternate paths may replace a Rank.' },
      { heading: 'Learning Techniques', text: 'At each new School Rank, you gain your School\'s next Technique automatically. These are permanent and always active unless noted.' },
      { heading: 'Multiple Schools', text: 'Switching schools costs 1.5x XP for new school skills. You restart at Rank 1 in the new school. Your old techniques remain.' },
    ],
  },
  {
    title: 'Grappling',
    sections: [
      { heading: 'Initiate', text: 'Roll Agility + Jiujutsu (or relevant skill) vs. target\'s Armor TN. On hit, both combatants are Grappled.' },
      { heading: 'While Grappled', text: 'Contested Strength roll each round to control. Winner may: deal unarmed damage, throw opponent (prone), pin opponent (immobile), break free.' },
      { heading: 'Escaping', text: 'Contested Strength + Jiujutsu. If you win, you break free. If you fail, the controller maintains the hold.' },
    ],
  },
]
