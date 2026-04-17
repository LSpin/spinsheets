// 7th Sea 2nd Edition — Quick Rules Reference

export const SEVEN_SEA_RULES = [
  {
    title: 'Raises — Core Mechanic',
    sections: [
      { heading: 'How to Roll', text: 'Roll a pool of d10s equal to Trait + Skill. Group the results into sets that add up to 10 or more — each set is one Raise. Unused dice are lost.' },
      { heading: 'Exploding 10s', text: 'Any die that lands on 10 is kept AND you roll an additional d10, adding it to your pool. This can chain.' },
      { heading: 'Skill Ranks', text: 'At Skill rank 4+, sets of 15+ count as 2 Raises instead of 1. At Skill rank 5, you may re-roll any single die once per roll.' },
    ],
  },
  {
    title: 'Action Sequences',
    sections: [
      { heading: 'Initiative', text: 'Each Hero rolls Trait + Skill (varies by approach). The Hero with the most Raises acts first. Ties: higher Panache goes first.' },
      { heading: 'Spending Raises', text: 'On your turn, spend 1 Raise to perform one action: attack, dodge, activate an Advantage, use the environment, etc. You may spend multiple Raises on your turn.' },
      { heading: 'Dealing Wounds', text: 'Spend 1 Raise to deal 1 Wound to a Villain (or group of Brutes). Weaponry attacks deal Wounds equal to the weapon bonus.' },
      { heading: 'Avoiding Wounds', text: 'Spend 1 Raise to negate 1 Wound incoming. If you have no Raises left, you take the damage.' },
      { heading: 'Improvisation', text: 'Spend 1 Raise to create an Opportunity — a beneficial environmental effect. Spend 1 Raise to use an Opportunity someone else created.' },
    ],
  },
  {
    title: 'Dramatic Sequences',
    sections: [
      { heading: 'How They Work', text: 'Non-combat challenges (chases, negotiations, heists). Roll Trait + Skill. Spend Raises to overcome Consequences and seize Opportunities.' },
      { heading: 'Consequences', text: 'Bad things that happen if not addressed. Each Consequence has a Raise cost to prevent (1-5). Unspent Consequences happen to your Hero.' },
      { heading: 'Opportunities', text: 'Optional benefits. Cost 1-3 Raises. You choose which to pursue — but Consequences must be dealt with first (or you accept them).' },
    ],
  },
  {
    title: 'Wounds & Death',
    sections: [
      { heading: 'Dramatic Wounds', text: 'Every 5 regular Wounds = 1 Dramatic Wound. Each Dramatic Wound gives -1 die on all rolls. Track both.' },
      { heading: 'Helpless', text: 'At 4 Dramatic Wounds, you are Helpless — you cannot act. A Villain may spend a Raise to kill a Helpless Hero (but Heroes get a chance for a dramatic last stand).' },
      { heading: 'Death', text: 'Heroes only die if the player agrees, or if the Hero has been Helpless and no one saves them by the end of the scene. Villains die when the GM decides.' },
      { heading: 'Healing', text: 'After a scene: 1 Dramatic Wound heals naturally. A doctor (Scholarship + Wits, 1 Raise per Wound healed) can heal additional Dramatic Wounds.' },
    ],
  },
  {
    title: 'Hero Points',
    sections: [
      { heading: 'Earning Hero Points', text: 'Start each session with Hero Points equal to unspent at last session (max 3). Earn more by: playing your Quirk (1 HP), activating your Hubris for the GM (1 HP), achieving a Story Step (1 HP).' },
      { heading: 'Spending Hero Points', text: '1 HP = activate an Advantage that costs a Hero Point. 1 HP = add 1d10 to your pool after rolling (before grouping into Raises). 1 HP = change a minor detail in the scene (you have what you need). Multiple per round allowed.' },
    ],
  },
  {
    title: 'Danger Points (GM)',
    sections: [
      { heading: 'What Are They', text: 'The GM\'s currency, equivalent to Hero Points. The GM earns Danger Points when Heroes spend Hero Points. Pool starts at 0.' },
      { heading: 'Spending Danger Points', text: '1 DP = activate a Villain\'s Advantage. 1 DP = add a Brute Squad to the scene. 2 DP = add a Villain to the scene. 1 DP = increase a Consequence\'s Raise cost by 1.' },
    ],
  },
  {
    title: 'Brute Squads',
    sections: [
      { heading: 'How They Work', text: 'A Brute Squad is a group of nameless thugs with a single Strength rating (usually 5-20). They act as one unit with 1 Raise per round.' },
      { heading: 'Dealing Damage', text: 'A Brute Squad deals Wounds equal to its current Strength. Each Wound dealt to the Squad removes 1 Strength. At 0, they\'re defeated.' },
      { heading: 'Vs. Heroes', text: 'Heroes can mow through Brutes — 1 Raise = 1 Wound to the Squad. A strong Hero can eliminate an entire Squad in one round.' },
    ],
  },
  {
    title: 'Villains',
    sections: [
      { heading: 'Villain Ranks', text: 'Villains have a Rank (1-20) determining their Traits, Skills, Advantages, and Wounds. A Rank 5 Villain has 5 in their best Trait, 5 Influence, etc.' },
      { heading: 'Influence', text: 'Villains use Influence to affect the world. Spend Influence to: hire Brute Squads, bribe officials, set traps, acquire resources. Heroes reduce Influence by thwarting schemes.' },
      { heading: 'Dramatic Wounds', text: 'Villains take Dramatic Wounds like Heroes (every 5 regular Wounds = 1 Dramatic). At Rank Dramatic Wounds, the Villain is defeated.' },
    ],
  },
  {
    title: 'Dueling (Summary)',
    sections: [
      { heading: 'Dueling Style', text: 'Duelists use a chosen Style (Aldana, Ambrogia, Boucher, Donovan, Eisenfaust, Leegstra, Mireli, Sabat, Torres, Valroux). Each Style grants unique Maneuvers.' },
      { heading: 'Maneuvers', text: 'Slash (1 Raise, deal Wounds = Weaponry), Parry (1 Raise, prevent Wounds = Weaponry), Lunge (2 Raises, deal Wounds + bonus but no Parry next), Riposte, Feint, Bash — vary by Style.' },
      { heading: 'Improvised Maneuvers', text: 'Spend Raises for creative moves: disarm (contested), trip, throw sand, use terrain. The GM adjudicates based on the fiction.' },
    ],
  },
  {
    title: 'Sorcery (Summary)',
    sections: [
      { heading: 'How It Works', text: 'Each Nation has a unique Sorcery. You must purchase the 2-point "Sorcery" Advantage to use it. Some require a second purchase for major powers.' },
      { heading: 'Porte (Montaigne)', text: 'Mark objects with blood (Blooding), then open portals (Portes) to teleport marked objects or yourself to them. Major: walk through.' },
      { heading: 'Sorte (Vodacce)', text: 'Read and manipulate the strands of Fate connecting people and things. Pull strands to alter luck, sever or tangle destinies.' },
      { heading: 'Glamour (Avalon)', text: 'Channel legendary Knights for powers. Minor: one Knight\'s power. Major: the full Legend (multiple Knights).' },
      { heading: 'Hexenwerk (Eisen)', text: 'Brew unguents from dead things. Apply salves for supernatural effects — corpse-sight, dead-skin armor, ghost-speech.' },
      { heading: 'Sanderis (Sarmatia)', text: 'Make deals with Losejas (devils). Each deal grants a power but extracts a price. The devil always collects.' },
      { heading: 'Mother\'s Touch (Ussura)', text: 'Speak to Matushka (the land). Shapeshift into animals, commune with nature spirits, read the weather.' },
    ],
  },
  {
    title: 'Corruption',
    sections: [
      { heading: 'Gaining Corruption', text: 'Gain 1 Corruption when: you murder someone, you use dark sorcery, you perform a truly villainous act. The GM warns first.' },
      { heading: 'Effects', text: 'At 1+ Corruption: you feel the pull of darkness. At 3+: dark powers tempt you. At 5+: NPC Villains may try to recruit you. At 10: your Hero becomes a Villain — hand them to the GM.' },
    ],
  },
]
