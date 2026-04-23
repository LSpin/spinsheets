// ── ASOIAF ST Tools Data ─────────────────────────────────────────────────────

// ── House Events ─────────────────────────────────────────────────────────────

export const HOUSE_EVENT_TYPES = [
  'War — a neighboring house marches on your borders.',
  'Plague — a sickness sweeps through your lands, decimating the smallfolk.',
  'Feast — a great celebration is held, drawing lords from across the realm.',
  'Tournament — a grand tourney is announced, with glory and gold at stake.',
  'Betrayal — a trusted vassal or ally turns against the house.',
  'Royal Decree — the crown issues an edict that directly affects your holdings.',
  'Drought — crops wither and the people grow desperate and hungry.',
  'Marriage Alliance — a neighboring house proposes a union by marriage.',
  'Bandit Raids — outlaws terrorize the roads and raid outlying villages.',
  'Religious Crisis — the Faith of the Seven demands the house answer for a perceived sin.',
]

export const HOUSE_SEVERITY = [
  { level: 'Minor', description: 'A local matter that can be resolved with modest effort and resources.' },
  { level: 'Moderate', description: 'A serious concern that demands the lord\'s personal attention and significant resources.' },
  { level: 'Severe', description: 'A crisis that threatens the very survival of the house and its people.' },
]

export const HOUSE_CONSEQUENCES = [
  'Loss of wealth — the treasury is depleted dealing with the aftermath.',
  'Loss of influence — the house\'s reputation at court suffers greatly.',
  'Loss of military strength — soldiers are killed, wounded, or desert.',
  'New enemy — the house gains a powerful and vindictive foe.',
  'New ally — an unexpected friendship is forged through shared hardship.',
  'Land gained — the house expands its holdings through the event\'s outcome.',
  'Land lost — a portion of the house\'s territory is seized or destroyed.',
  'Heir endangered — the lord\'s heir is kidnapped, wounded, or compromised.',
  'Smallfolk unrest — the common people grow restless and discontent.',
  'Royal attention — the Iron Throne takes notice, for good or ill.',
]

// ── Intrigue Scenes ──────────────────────────────────────────────────────────

export const INTRIGUE_SETTINGS = [
  'A private solar in a lord\'s keep, lit by guttering candles.',
  'The feast hall during a raucous banquet, conversations hidden by noise.',
  'A godswood beneath the heart tree, where oaths carry weight.',
  'The small council chamber of a regional lord.',
  'A crowded marketplace where whispered deals go unnoticed.',
  'A maester\'s tower, surrounded by books and ravens.',
  'The dungeons beneath the castle, where prisoners trade secrets for freedom.',
  'A tourney pavilion between jousting rounds.',
  'A ship\'s cabin during a voyage along the coast.',
  'A brothel in a port city, where information flows freely.',
]

export const NPC_DISPOSITIONS = [
  'Friendly — genuinely well-disposed toward the player characters.',
  'Cautious — willing to talk but guarded and wary of commitment.',
  'Indifferent — has no strong feelings and must be convinced to care.',
  'Unfriendly — harbors a grudge or suspicion toward the characters.',
  'Hostile — actively working against the characters\' interests.',
  'Scheming — appears friendly but is manipulating the situation.',
  'Desperate — willing to make deals they normally would not consider.',
  'Arrogant — believes themselves superior and expects deference.',
  'Fearful — terrified of someone or something and looking for protection.',
  'Conflicted — torn between duty and desire, easily swayed either way.',
]

export const INTRIGUE_STAKES = [
  'A strategic marriage that could unite or destroy two houses.',
  'Knowledge of a plot to assassinate a powerful lord.',
  'Control of a vital trade route worth a fortune in gold.',
  'A letter that could prove treason — or be used to forge it.',
  'The loyalty of a key bannerman whose support could turn a war.',
  'A seat on a ruling council that grants enormous influence.',
  'The fate of a hostage whose death would spark open conflict.',
  'A secret bastard whose claim could destabilize a noble house.',
  'A cache of wildfire hidden beneath an unsuspecting city.',
  'The truth about a lord\'s death that everyone has agreed to forget.',
]

export const INTRIGUE_TWISTS = [
  'The person they are negotiating with is already dead — replaced by a double.',
  'A hidden observer has been listening to every word.',
  'The information they received was deliberately planted to mislead them.',
  'An unexpected third party arrives and changes the dynamic entirely.',
  'One of the characters\' companions is secretly in league with the opposition.',
  'The stakes turn out to be far higher than anyone initially believed.',
  'A sudden attack interrupts the intrigue and forces unlikely alliances.',
  'The NPC reveals they know a damaging secret about one of the characters.',
  'The real power behind the NPC steps out of the shadows.',
  'Everything was a test — and the characters\' choices have been judged.',
]

// ── Random NPCs ──────────────────────────────────────────────────────────────

export const ASOIAF_NAMES = [
  'Edric Storm', 'Jeyne Westerling', 'Harlan Grandison', 'Myranda Royce',
  'Ronnet Connington', 'Alys Karstark', 'Bonifer Hasty', 'Taena Merryweather',
  'Godric Borrell', 'Wylla Manderly', 'Orton Merryweather', 'Barbrey Dustin',
  'Rodrik Harlaw', 'Leona Woolfield', 'Arstan Selmy', 'Ravella Smallwood',
  'Harys Swyft', 'Jyanna Reed', 'Desmond Grell', 'Myrielle Lannister',
]

export const NPC_STATIONS = [
  'Lord/Lady — head of a minor noble house with modest lands.',
  'Heir — firstborn of a notable house, groomed for leadership.',
  'Knight — a landed knight sworn to a greater lord.',
  'Maester — a chain-bearing scholar serving a noble house.',
  'Septon/Septa — a member of the Faith of the Seven with local influence.',
  'Merchant — a wealthy trader with connections across the realm.',
  'Smallfolk Leader — a village elder or guild master respected by the commons.',
  'Sellsword — a mercenary captain with a company at their command.',
  'Bastard — an unacknowledged natural child of a powerful lord.',
  'Exile — a former noble stripped of lands and title, seeking restoration.',
]

export const NPC_ASOIAF_PERSONALITIES = [
  'Honorable and forthright — their word is their bond.',
  'Ambitious and ruthless — the game of thrones is all that matters.',
  'Pious and zealous — the Faith guides their every action.',
  'Shrewd and cautious — never makes a move without calculating the cost.',
  'Hot-blooded and impulsive — quick to anger and slow to forgive.',
  'Gentle and scholarly — prefers books to battlefields.',
  'Paranoid and suspicious — trusts no one, and perhaps with good reason.',
  'Charismatic and bold — people follow them instinctively.',
  'Melancholic and fatalistic — expects the worst and is rarely disappointed.',
  'Cunning and charming — a smile that hides a dagger.',
]

export const NPC_DESIRES = [
  'Restore their family\'s lost honor and reclaim forfeited lands.',
  'Gain a seat on a ruling council to influence the realm.',
  'Avenge a murdered family member, no matter the cost.',
  'Secure a prestigious marriage for themselves or their child.',
  'Accumulate enough wealth to buy protection from enemies.',
  'Earn a knighthood or lordship through deeds of valor.',
  'Discover the truth about a family mystery or hidden lineage.',
  'Escape an unwanted betrothal or political obligation.',
  'Protect the smallfolk from the cruelty of warring lords.',
  'Find and destroy evidence of a shameful family secret.',
]
