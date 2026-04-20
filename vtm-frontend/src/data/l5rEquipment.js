// L5R 4th Edition equipment catalog (from lasthaiku.wikidot.com)
// DR = Damage Rating, ATN = Armor TN bonus, Red = Damage Reduction

export const L5R_EQUIPMENT = {
  armor: [
    { name: 'Ashigaru Armor', atn: 3, reduction: 1, cost: '5 koku', notes: 'Basic foot-soldier armor.' },
    { name: 'Light Armor', atn: 5, reduction: 3, cost: '25 koku', notes: '+5 TN to Athletics and Stealth rolls.' },
    { name: 'Heavy Armor', atn: 10, reduction: 5, cost: '40 koku', notes: '+5 TN to all Agility/Reflexes rolls.' },
    { name: 'Riding Armor', atn: '12/4', reduction: 4, cost: '55 koku', notes: 'ATN 12 on horseback, 4 on foot. +5 TN Agility/Reflexes except mounted.' },
    { name: 'Tatami Armor', atn: 4, reduction: 1, cost: '10 koku', notes: 'Foldable armor, easy to transport.' },
  ],
  swords: [
    { name: 'Katana', dr: '3k2', keywords: 'Medium, Samurai', cost: '—', notes: 'Spend Void Point for +1k1 damage.' },
    { name: 'Wakizashi', dr: '2k2', keywords: 'Medium, Samurai', cost: '15 koku', notes: 'Can be thrown 20 ft.' },
    { name: 'No-dachi', dr: '3k3', keywords: 'Large', cost: '30 koku', notes: 'Two-handed sword.' },
    { name: 'Bokken', dr: '0k2', keywords: 'Samurai', cost: '—', notes: 'Wooden practice sword. Armor reduction doubled.' },
    { name: 'Ninja-to', dr: '3k2', keywords: 'Medium, Ninja', cost: '—', notes: 'Counts as Small for concealment. Breaks at 40+ dmg.' },
    { name: 'Parangu', dr: '2k2', keywords: 'Medium, Peasant', cost: '10 bu', notes: 'Breaks at 30+ damage.' },
    { name: 'Scimitar', dr: '2k3', keywords: 'Medium', cost: '20 koku', notes: 'Foreign curved blade.' },
  ],
  polearms: [
    { name: 'Naginata', dr: '3k2', keywords: 'Large, Samurai', cost: '10 koku', notes: 'Classic samurai polearm.' },
    { name: 'Bisento', dr: '3k3', keywords: 'Large', cost: '12 koku', notes: 'Heavy bladed polearm.' },
    { name: 'Nagamaki', dr: '2k3', keywords: 'Large', cost: '8 koku', notes: 'Long-gripped sword-polearm hybrid.' },
    { name: 'Sasumata', dr: '0k2', keywords: 'Large', cost: '6 koku', notes: 'Can initiate a grapple.' },
  ],
  spears: [
    { name: 'Yari', dr: '2k2', keywords: 'Large', cost: '5 koku', notes: 'Can be thrown 50 ft (1k2 thrown).' },
    { name: 'Nage-yari', dr: '1k2', keywords: 'Large', cost: '3 koku', notes: 'Throwing spear, 50 ft range.' },
    { name: 'Lance', dr: '3k4', keywords: 'Large', cost: '20 koku', notes: '1k2 when not charging mounted. Breaks at 30+ dmg.' },
    { name: 'Mai Chong', dr: '0k3', keywords: 'Large', cost: '20 koku', notes: 'Can be thrown 25 ft.' },
  ],
  heavyWeapons: [
    { name: 'Tetsubo', dr: '3k3', keywords: 'Large', cost: '20 koku', notes: 'Iconic Crab weapon. Iron-studded club.' },
    { name: 'Ono', dr: '0k4', keywords: 'Large', cost: '20 koku', notes: 'War axe.' },
    { name: 'Dai-tsuchi', dr: '5k2', keywords: 'Large', cost: '15 koku', notes: 'Great war hammer.' },
    { name: 'Masakiri', dr: '2k3', keywords: 'Medium', cost: '8 koku', notes: 'Hand axe.' },
  ],
  knives: [
    { name: 'Aiguchi / Tanto', dr: '1k1', keywords: 'Small', cost: '1 koku', notes: 'Concealed blade or utility knife.' },
    { name: 'Jitte / Sai', dr: '1k1', keywords: 'Small', cost: '5 bu', notes: 'Magistrate\'s weapon, can trap blades.' },
    { name: 'Kama', dr: '0k2', keywords: 'Small', cost: '5 bu', notes: 'Sickle.' },
  ],
  staves: [
    { name: 'Bo', dr: '1k2', keywords: 'Large', cost: '2 bu', notes: 'Full-length staff.' },
    { name: 'Jo', dr: '0k2', keywords: 'Medium', cost: '1 bu', notes: 'Short staff.' },
    { name: 'Tonfa', dr: '0k3', keywords: 'Medium, Peasant', cost: '5 bu', notes: 'Side-handle baton.' },
    { name: 'Nunchaku', dr: '1k2', keywords: 'Small, Peasant', cost: '3 bu', notes: 'Chained flails.' },
  ],
  bows: [
    { name: 'Yumi', dr: 'Str 3', keywords: 'Large', cost: '20 koku', notes: 'Standard bow. Range 250 ft. +10 TN mounted.' },
    { name: 'Dai-kyu', dr: 'Str 4', keywords: 'Small', cost: '25 koku', notes: 'Great bow. Range 500 ft. Min Str 3. +10 TN on foot.' },
    { name: 'Han-kyu', dr: 'Str 1', keywords: 'Small', cost: '6 koku', notes: 'Short bow. Range 100 ft. +10 TN mounted.' },
  ],
  arrows: [
    { name: 'Willow Leaf', dr: '2k2', cost: '1 bu', notes: 'Standard arrow.' },
    { name: 'Armor-Piercing', dr: '1k1', cost: '2 bu', notes: 'Ignores Armor TN bonus.' },
    { name: 'Flesh Cutter', dr: '2k3', cost: '5 bu', notes: 'Doubles armor bonus; half range.' },
    { name: 'Humming Bulb', dr: '0k1', cost: '5 bu', notes: 'Signal arrow, makes whistling sound.' },
    { name: 'Rope-Cutter', dr: '1k1', cost: '3 bu', notes: '2 Free Raises vs. inanimate objects; half range.' },
  ],
  chain: [
    { name: 'Kusarigama', dr: '0k2/0k1', keywords: 'Large', cost: '5 koku', notes: 'Kama end / weighted end.' },
    { name: 'Manrikikusari', dr: '1k1', keywords: 'Large', cost: '3 koku', notes: 'Weighted chain.' },
    { name: 'Kyoketsu-shogi', dr: '0k1', keywords: 'Large', cost: '9 bu', notes: 'Doubles armor bonus.' },
  ],
  warFans: [
    { name: 'War Fan (Tessen)', dr: '0k1', keywords: 'Small', cost: '5 koku', notes: 'Concealed weapon. Symbol of authority.' },
  ],
  schoolWeapons: [
    // Crab Clan
    { name: 'Kaiu Blade', dr: '3k2', keywords: 'Medium, Samurai', cost: '—', notes: 'Masterwork Crab katana. Ignores 3 points of Reduction from Shadowlands creatures. Unbreakable by normal means.' },
    { name: 'Jade-Infused Tetsubo', dr: '3k3', keywords: 'Large, Jade', cost: '—', notes: 'Heavy weapon infused with jade. Deals full damage to Shadowlands creatures regardless of Invulnerability.' },
    // Crane Clan
    { name: 'Kakita Blade', dr: '4k2', keywords: 'Medium, Samurai', cost: '—', notes: 'Legendary Crane dueling katana. +1k0 to Iaijutsu Focus rolls. Passed down through the Kakita dojo.' },
    { name: 'Daidoji Blade', dr: '3k2', keywords: 'Medium, Samurai', cost: '—', notes: 'Iron Crane katana. +5 to the TN of any Disarm attempt against the wielder.' },
    // Dragon Clan
    { name: 'Mirumoto Blade (Paired)', dr: '3k2 / 2k2', keywords: 'Medium, Samurai', cost: '—', notes: 'Matched pair of katana and wakizashi. When wielding both: +1k0 to one attack per round.' },
    { name: 'Tamori Blade', dr: '3k2', keywords: 'Medium, Samurai', cost: '—', notes: 'Forged by Tamori smiths using earth kami. +1k0 damage vs. creatures with the Shadowlands taint.' },
    // Lion Clan
    { name: 'Akodo Blade', dr: '4k2', keywords: 'Medium, Samurai', cost: '—', notes: 'Ancestral Lion katana. +1k1 to all attack rolls when defending another Lion samurai. Symbol of Akodo leadership.' },
    { name: 'Matsu Blade', dr: '3k2', keywords: 'Medium, Samurai', cost: '—', notes: 'Lion berserker katana. +1k0 damage while in Full Attack posture. Cannot be wielded in Defense posture.' },
    // Mantis Clan
    { name: 'Yoritomo Kama (Paired)', dr: '0k2 / 0k2', keywords: 'Small', cost: '—', notes: 'Matched pair of kama. When wielding both: extra attack per round at -2k0 on all attacks.' },
    { name: 'Tsuruchi Longbow', dr: 'Str 5', keywords: 'Large', cost: '—', notes: 'Specially crafted Tsuruchi bow. Range 400 ft. +1k0 to Kyujutsu rolls. Min Str 3.' },
    // Phoenix Clan
    { name: 'Shiba Blade', dr: '3k2', keywords: 'Medium, Samurai', cost: '—', notes: 'Phoenix guardian katana. Spend a Void Point: gain +10 to ATN until your next turn.' },
    { name: 'Isawa Staff', dr: '1k2', keywords: 'Large', cost: '—', notes: 'Staff imbued with elemental kami. +1k0 to Spell Casting Rolls of one element (chosen at creation).' },
    // Scorpion Clan
    { name: 'Bayushi Blade', dr: '3k2', keywords: 'Medium, Samurai', cost: '—', notes: 'Scorpion katana with hidden groove. Can deliver contact poison on a successful hit (1 dose per battle).' },
    { name: 'Shosuro Blade', dr: '3k2', keywords: 'Medium, Ninja', cost: '—', notes: 'Counts as Small for concealment. Lacquered black — +5 to Stealth rolls while wielding at night.' },
    // Unicorn Clan
    { name: 'Moto Scimitar', dr: '2k3', keywords: 'Medium', cost: '—', notes: 'Unicorn cavalry blade. +1k0 damage on mounted charge attacks.' },
    { name: 'Utaku Blade', dr: '3k2', keywords: 'Medium, Samurai', cost: '—', notes: 'Utaku battle maiden katana. +1k0 to attack while mounted on an Utaku warhorse.' },
    // Spider Clan
    { name: 'Daigotsu Blade', dr: '3k2', keywords: 'Medium, Samurai, Tainted', cost: '—', notes: 'Dark forged blade. Gains +0k1 damage against targets with Honor 5+. Wielder gains 0.1 Taint per month.' },
    // Minor Clan / Ronin
    { name: 'Ancestral Katana', dr: '4k2', keywords: 'Medium, Samurai', cost: '—', notes: 'Blade of your ancestors, passed down for generations. Choose one: +1k0 attack, +1k0 damage, or +5 ATN.' },
    { name: 'Nemuranai Blade', dr: '3k2', keywords: 'Medium, Samurai, Awakened', cost: '—', notes: 'A katana containing an awakened spirit. Grants one Free Raise per day on a roll the spirit favors (GM discretion).' },
    // Unique / Named Blades (from supplements)
    { name: 'Ofushikai (Ancestral Sword of the Crane)', dr: '5k3', keywords: 'Large, Samurai, Nemuranai', cost: '—', notes: 'The Crane Clan Champion\'s ancestral blade. +3k0 to Iaijutsu. Only the Champion may wield it.' },
    { name: 'Kunshu (Ancestral Sword of the Lion)', dr: '5k3', keywords: 'Medium, Samurai, Nemuranai', cost: '—', notes: 'The Lion Clan Champion\'s blade. +2k0 to Battle skill. Inspires all allied Lion within sight (+1k0 attack).' },
    { name: 'Chikara (Ancestral Sword of the Crab)', dr: '5k4', keywords: 'Large, Samurai, Jade, Nemuranai', cost: '—', notes: 'The Crab Champion\'s tetsubo-blade. Ignores all Reduction. Deals aggravated damage to Shadowlands creatures.' },
    { name: 'Sansetsukon (Three-Section Staff)', dr: '2k2', keywords: 'Large', cost: '8 koku', notes: 'Versatile monk weapon. Can be used at reach or close range. +1 Free Raise to Disarm.' },
    // Specialized Arrows
    { name: 'Jade-Tipped Arrow', dr: '2k2', keywords: 'Jade', cost: '1 koku', notes: 'Deals full damage to Shadowlands creatures. Consumed on use.' },
    { name: 'Crystal Arrow', dr: '2k2', keywords: 'Crystal', cost: '5 koku', notes: 'Ignores all magical defenses. Extremely rare.' },
  ],
}

export const L5R_EQUIPMENT_CATEGORIES = [
  { key: 'armor', label: 'Armor' },
  { key: 'swords', label: 'Swords' },
  { key: 'schoolWeapons', label: 'School & Ancestral Weapons' },
  { key: 'polearms', label: 'Polearms' },
  { key: 'spears', label: 'Spears' },
  { key: 'heavyWeapons', label: 'Heavy Weapons' },
  { key: 'knives', label: 'Knives' },
  { key: 'staves', label: 'Staves' },
  { key: 'bows', label: 'Bows' },
  { key: 'arrows', label: 'Arrows' },
  { key: 'chain', label: 'Chain Weapons' },
  { key: 'warFans', label: 'War Fans' },
]
