// Scum and Villainy — Playbook Data
// Based on Scum and Villainy by Stras Acimovic and John LeBoeuf-Little (Evil Hat Productions)

export const SAV_HERITAGES = ['Imperial', 'Spacer', 'Colonist', 'Manufactured', 'Wanderer', 'Xeno']
export const SAV_BACKGROUNDS = ['Academic', 'Labor', 'Cult', 'Guilder', 'Military', 'Noble', 'Syndicate']
export const SAV_VICES = ['Faith', 'Gambling', 'Luxury', 'Obligation', 'Pleasure', 'Stupor', 'Weird']

export const SAV_TRAUMA_CONDITIONS = ['Cold', 'Haunted', 'Obsessed', 'Paranoid', 'Reckless', 'Soft', 'Unstable', 'Vicious']

export const SAV_STANDARD_ITEMS = [
  { name: 'Blaster Pistol', load: 1 },
  { name: '2nd Blaster Pistol', load: 1 },
  { name: 'Melee Weapon', load: 1 },
  { name: 'Heavy Blaster', load: 2 },
  { name: 'Detonator', load: 1 },
  { name: 'Hacking Tools', load: 1 },
  { name: 'Repair Tools', load: 1 },
  { name: 'Medkit', load: 2 },
  { name: 'Spy Gear', load: 1 },
  { name: 'Illicit Drugs', load: 0 },
  { name: 'Communicator', load: 0 },
  { name: 'Armor', load: 2 },
  { name: 'Spacesuit', load: 2 },
]

export const SAV_PLAYBOOKS = {
  Mechanic: {
    description: 'A gearhead and hacker.',
    xpTrigger: 'You addressed a tough challenge with technical skill or ingenuity.',
    startingAbility: 'Tinker',
    abilities: [
      { name: 'Tinker', description: 'When you work on a clock with rig or hack, or when you study a schematic, fill +1 segment.', starting: true },
      { name: 'Bailing Wire and Mech-Tape', description: 'You get an extra downtime activity to repair, and the repair activity costs you 0 cred.' },
      { name: 'Construct Whisperer', description: 'Machines speak to you when you study them. The first time you roll a critical while fixing or building a particular machine, you may add a simple modification to it.' },
      { name: 'Junkyard Hunter', description: 'When you acquire parts or equipment during downtime, you may either gain two assets, or one asset at +1 quality.' },
      { name: 'Hacker', description: 'You may expend your special armor to resist the consequences of hacking, or to push yourself when hacking or gathering info electronically.' },
      { name: 'Fixed', description: 'You may expend your special armor to resist a consequence from machines breaking or being damaged, or to push yourself when repairing or building a machine.' },
      { name: "Mechanic's Heart", description: 'When you speak from your heart, your words can reach even the most hardened criminal, and you gain potency.' },
      { name: 'Overclock', description: 'When you spend a gambit on a rig roll to repair or upgrade, treat the system you worked on as 1 quality higher for the remainder of the job.' },
      { name: 'Analyst', description: 'When you hack a system, you may also ask a question about the owner or location of the system as though you had rolled a 6 on gather info. When you resist the consequences of hacking, roll +1d.' },
    ],
    items: [
      { name: 'Fine Hacking Rig', load: 1 },
      { name: 'Fine Ship Repair Tools', load: 2 },
      { name: 'Small Drone', load: 0 },
      { name: 'Vision-Enhancing Goggles', load: 1 },
      { name: 'Spare Parts', load: 1 },
      { name: 'Genius Pet', load: 0 },
    ],
    contacts: ['Slice, a junkyard owner', 'Nisa, a previous employer', 'Stev, a gambler of ill repute', 'Len, a black market dealer', 'Kenn, a family member'],
  },
  Muscle: {
    description: 'A dangerous and intimidating fighter.',
    xpTrigger: 'You addressed a tough challenge with force or threats.',
    startingAbility: 'Unstoppable',
    abilities: [
      { name: 'Unstoppable', description: 'You can push yourself to do one of the following: perform a feat of physical force that verges on the superhuman, engage a small gang on equal footing in close combat.', starting: true },
      { name: 'Wrecking Crew', description: 'Your strength and ferocity are infamous. When striking in melee, you gain +1d. Whenever you spend a gambit in combat, you also gain +1 effect on that action.' },
      { name: 'Backup', description: "An ally's push costs 1 stress on any action you set up or assist." },
      { name: 'Battleborn', description: 'You may expend your special armor to reduce harm from an attack in combat, or to push yourself during a fight.' },
      { name: 'Bodyguard', description: 'When you protect a crewmate, resist with +1d. When you take harm, clear 1 stress.' },
      { name: 'Flesh Wound', description: "If you're wounded at the beginning of downtime, mark +3 segments on your healing clock. When you push yourself to ignore wound penalties, you take only 1 stress (not 2)." },
      { name: 'Predator', description: 'Take +1d to rolls against weakened or vulnerable targets. Whenever you gather information on a weakness or vulnerability, the worst you can get is a 4/5 result.' },
      { name: 'Ready for Anything', description: 'When being ambushed, you gain potency to all actions during a flashback, and your first flashback costs 0 stress.' },
      { name: 'Scary', description: 'You have an air of menace and danger obvious to even the most unobservant. You gain potency when trying to intimidate someone. If done immediately after a show of force, also take +1d.' },
    ],
    items: [
      { name: 'Vera, a Fine Sniper Rifle', load: 2 },
      { name: 'Zmel, a Fine Flamethrower', load: 2 },
      { name: 'Sunder, a Fine Vibro-Blade', load: 1 },
      { name: 'Zarathustra, Detonator Launcher', load: 2 },
      { name: 'Fine Martial Art Style', load: 0 },
      { name: 'Mystic Ammunition', load: 1 },
    ],
    contacts: ['Krieger, a fine blaster pistol', 'Shod, a weapons dealer', 'Chon-zek, a bounty hunter', 'Zarochka, a crooked cop', 'Aya, an assassin'],
  },
  Mystic: {
    description: 'A galactic wanderer in touch with the Way.',
    xpTrigger: 'You addressed a tough challenge with wisdom or the Way.',
    startingAbility: 'The Way',
    abilities: [
      { name: 'The Way', description: 'You can spend a gambit instead of paying any stress cost.', starting: true },
      { name: 'Kinetics', description: 'You can push yourself to do one of the following: use the Way to throw a table-sized object with dangerous force, propel yourself briefly with superhuman speed.' },
      { name: 'Psy-Blade', description: 'You can focus Way energy into your melee weapon. While charged, the weapon can cut through non-shielded materials with ease, and you gain potency on your melee attacks.' },
      { name: 'Center', description: 'You gain Meditation as a vice. When you indulge this vice, clear +1 stress and add Dark Visions as a possible overindulgence.' },
      { name: 'Way Shield', description: 'You can block blaster bolts with the Way (resist with resolve). If you resist a blaster attack, you may spend 1 stress to redirect fire and make an attack of your own with it.' },
      { name: 'Warded', description: 'You may expend your special armor to resist the consequences of a Way attack or artifact use, or push yourself when using mystic powers.' },
      { name: 'Psy-Dancing', description: "You may push yourself to cloud a target's mind and sway them in the face of contradictory evidence. Spend 1 stress for each additional feature: they have only vague memories of the event, it works on a small group." },
      { name: 'Visions', description: 'Spend 1 stress to remotely view a distant place or person tied to you in some intimate way. Spend 1 stress for each extra feature.' },
      { name: 'Sundering', description: 'You may push yourself to attune to the Way and twist it, causing psychic harm to anyone in the area vulnerable to your assault.' },
    ],
    items: [
      { name: 'Fine Melee Weapon', load: 1 },
      { name: 'Offerings', load: 0 },
      { name: 'Trappings of Religion', load: 1 },
      { name: 'Outdated Religious Outfit', load: 1 },
      { name: 'Memento of Your Travels', load: 0 },
      { name: 'Precursor Artifact', load: 1 },
    ],
    contacts: ['Horux, a former teacher', 'Hicks, a mystic goods supplier', 'Laxx, a xeno', 'Rye, an unrequited love', 'Blish, a fellow mystic'],
  },
  Pilot: {
    description: 'A ship-handling wizard and danger addict.',
    xpTrigger: 'You addressed a tough challenge with speed or flair.',
    startingAbility: 'Ace Pilot',
    abilities: [
      { name: 'Ace Pilot', description: 'You have potency on all speed-related rolls. When you roll to resist the consequences of piloting, gain +1d.', starting: true },
      { name: 'Keen Eye', description: 'You have sharp eyes and notice small details many might overlook. Gain +1d when firing ship guns or making trick shots.' },
      { name: 'Side Job', description: 'You may spend a downtime activity in port doing odd jobs. Gain 1 cred. If there are rumors floating about, the GM will tell you of them.' },
      { name: 'Exceed Specs', description: 'While onboard a ship you may damage a ship system you have access to in order to gain +1d or +1 effect to a roll.' },
      { name: 'Leaf on the Wind', description: 'When you push yourself, you may spend +1 stress (3 stress total) to gain both +1 effect and +1d instead of one or the other.' },
      { name: 'Hedonist', description: 'When you indulge your vice, you may adjust the dice outcome by +/-2. An ally who joins you may do the same.' },
      { name: 'Commander', description: 'Whenever you lead a group action, gain +1 scale (for example, a small group counts as a medium group). If you lead a group action in combat, you may count multiple 6s from different rolls as a critical.' },
      { name: 'Traveler', description: "You're comfortable around unusual cultures and xenos. You gain potency when attempting to consort with or sway them." },
      { name: 'Punch It', description: 'When you spend a gambit on a desperate roll, it counts as risky instead.' },
    ],
    items: [
      { name: 'Fine Customized Spaceship', load: 0 },
      { name: 'Fine Small Urbot', load: 0 },
      { name: 'Fine Mechanics Kit', load: 1 },
      { name: 'Grappling Hook', load: 1 },
      { name: 'Guild License', load: 0 },
      { name: 'Victory Cigars', load: 0 },
    ],
    contacts: ['Yattu, a gang boss', 'Triv, a ship mechanic', 'Choss, a professional racer', 'Meris, a scoundrel', 'Mav, a former mentor'],
  },
  Scoundrel: {
    description: 'A scrappy and lucky survivor.',
    xpTrigger: 'You addressed a tough challenge with charm or audacity.',
    startingAbility: 'Serendipitous',
    abilities: [
      { name: 'Serendipitous', description: 'Your crew starts with +1 gambit when the pool resets.', starting: true },
      { name: 'Never Tell Me the Odds', description: 'You generate gambits on desperate rolls. You may also generate gambits even if you spent a gambit.' },
      { name: 'I Know a Guy', description: "When you first dock at a port after being away, pick one and ask the GM about a job: it's not deadly, it pays well enough, it's not a rush job, it comes from a faction you trust, it targets an enemy you have. You may spend 1 cred per additional feature." },
      { name: 'Tenacious', description: 'Penalties from harm are one level less severe (though level 4 harm is still fatal).' },
      { name: 'When the Chips are Down', description: 'You gain a second use of special armor between each downtime.' },
      { name: "Devil's Own Luck", description: 'You may expend your special armor to resist the consequences of blaster fire, or to push yourself when talking your way out of (or running from) trouble.' },
      { name: 'Daredevil', description: 'When you make a desperate roll, you may take +1d. If you do so, do not mark xp in that action\'s attribute.' },
      { name: 'Shoot First', description: "When you attack from hiding or spring a trap, take +1d. When there's a question about who acts first, the answer is you (two characters with Shoot First act simultaneously)." },
      { name: 'Ask Questions Later', description: 'When you consort to gather info, you gain +1 effect and can in addition ask: Who might this benefit?' },
    ],
    items: [
      { name: 'Fine Blaster Pistol (or Pair)', load: 1 },
      { name: 'Fine Coat', load: 0 },
      { name: 'Loaded Dice or Trick Holo-cards', load: 0 },
      { name: 'Forged Documents', load: 0 },
      { name: 'Mystic Ammunition', load: 1 },
      { name: 'Personal Memento', load: 0 },
    ],
    contacts: ['Nyx, a moneylender', 'Ora, an info broker', 'Jal, a ship mechanic', 'Battro, a bounty hunter'],
  },
  Speaker: {
    description: 'A respectable person on the take.',
    xpTrigger: 'You addressed a tough challenge with deception or influence.',
    startingAbility: 'Air of Respectability',
    abilities: [
      { name: 'Air of Respectability', description: 'You get an extra downtime activity to acquire assets or lay low.', starting: true },
      { name: 'Favors Owed', description: 'During downtime, you get +1d when you acquire assets or lay low. Any time you gather info, take +1d.' },
      { name: 'Player', description: 'You always know when someone is lying to you.' },
      { name: 'Infiltrator', description: 'You are not affected by quality or Tier when you bypass security measures.' },
      { name: 'Subterfuge', description: 'You may expend your special armor to resist a consequence of persuasion or suspicion. When you resist with insight, gain +1d.' },
      { name: 'Heart to Heart', description: 'When you provide meaningful insight or heartfelt advice that a crewmate follows, you both clear 1 stress.' },
      { name: 'Old Friends', description: 'Whenever you land in a new location, write down a friend you know there (see Influential Friends below).' },
      { name: 'Disarming', description: 'Whenever you use a gambit while speaking, hostilities and danger also pause while you speak.' },
      { name: 'Purpose', description: 'You may expend your special armor to push yourself when outclassed by your opposition, or when under the effects of wounds. When you resist with resolve, gain +1d.' },
    ],
    items: [
      { name: 'Fine Clothes', load: 0 },
      { name: 'Legitimate ID', load: 0 },
      { name: 'Luxury Item', load: 1 },
      { name: 'Luxury Item', load: 1 },
      { name: 'Large Luxury Item', load: 2 },
      { name: 'Memento of a Past Encounter', load: 0 },
    ],
    contacts: ['Arryn, a Noble', 'Manda, a Guild member', 'Kerry, a doctor', 'Je-zee, a diplomat'],
  },
  Stitch: {
    description: 'A spacefaring healer or scientist.',
    xpTrigger: 'You addressed a tough challenge with insight or compassion.',
    startingAbility: "I'm a Doctor, Not a...",
    abilities: [
      { name: "I'm a Doctor, Not a...", description: 'You can push yourself to roll your doctor rating while performing a different action. Say which patient, research, or posting taught you this trick.', starting: true },
      { name: 'Physicker', description: 'You may study a malady, wounds, or corpse, and gather info from a crime scene. Also, your crew gets +1d to recovery rolls.' },
      { name: 'Patch', description: 'You may doctor someone during a job to allow them to ignore the effects of a harm penalty.' },
      { name: 'Welcome Anywhere', description: 'While wearing your medic garb, you are welcome even in dangerous places. Gain +1d to consort and sway when offering to tend to anyone in need.' },
      { name: 'Under Pressure', description: 'Add a gambit to the pool whenever you or a crew member suffers level 2 or greater harm.' },
      { name: 'Combat Medic', description: 'You may expend your special armor to resist any consequence while tending to a patient. When you doctor someone in combat, clear 1 stress.' },
      { name: 'Moral Compass', description: 'When you do the right thing at cost to yourself, mark xp (any category).' },
      { name: 'Dr. Strange', description: 'Your research and fields of study are fringe, esoteric, and focus on the mystical. You may always handle Precursor artifacts safely. When you study an artifact or doctor a strange substance, you may ask one: what could this do? — why could this be dangerous?' },
      { name: 'Book Learning', description: 'You speak a multitude of languages and are broadly educated. Gain +1d when using study during a downtime activity.' },
    ],
    items: [
      { name: 'Fine Medkit', load: 2 },
      { name: 'Fine Bedside Manner', load: 0 },
      { name: 'Fine Clothing', load: 0 },
      { name: 'Recognizable Medic Garb', load: 1 },
      { name: 'Candies and Treats', load: 0 },
      { name: 'Syringes and Applicators', load: 1 },
    ],
    contacts: ['Jackev, a drug dealer', 'Alben, a former patient', 'Ditha, a family member', 'Juda, a doctor', 'Lynie, a hospital admin'],
  },
}

export const SAV_PLAYBOOK_CATALOG = Object.keys(SAV_PLAYBOOKS).map(key => ({
  value: key,
  description: SAV_PLAYBOOKS[key].description,
}))

// Ship types
export const SAV_SHIPS = {
  Stardancer: {
    description: 'Smugglers and blockade runners. Looking to do odd jobs, small thefts, and find lost items.',
    abilities: [
      { name: 'Galley', description: 'Meals and comfort boost morale. Reduce crew stress by 1 during downtime.' },
      { name: 'Fake Transponder', description: 'Your ship can mimic legitimate craft. +1d to consort or sway when pretending to be a different ship.' },
      { name: 'Smuggling Compartments', description: 'Hidden cargo bays that are nearly impossible to detect on a standard scan.' },
      { name: 'Slippery', description: '+1d to helm rolls when evading pursuit.' },
    ],
    upgrades: ['Galley', 'Smuggling Compartments', 'Fake Transponder', 'Shuttle', 'Fuel Reserves', 'Crew Quarters', 'Shields', 'Cloaking Device'],
    huntingGrounds: ['Smuggling', 'Odd Jobs', 'Salvage'],
    contacts: ['A merchant lord', 'A rebel contact', 'A guild factor', 'A fence', 'A dockmaster'],
  },
  Cerberus: {
    description: 'Extraction specialists. Looking to find missing people or items and claim bounties.',
    abilities: [
      { name: 'Brig', description: 'A secure holding cell. You can safely transport prisoners or dangerous cargo.' },
      { name: 'Tracking Systems', description: 'Advanced sensors for tracking targets. +1d to study rolls when hunting a target.' },
      { name: 'Heavy Weapons', description: 'Ship-mounted heavy weapons for serious firepower.' },
      { name: 'Interrogation Chamber', description: 'A room designed for getting answers. +1d to command when questioning prisoners.' },
    ],
    upgrades: ['Brig', 'Tracking Systems', 'Heavy Weapons', 'Interrogation Chamber', 'Shields', 'Crew Quarters', 'Med Bay', 'Armory'],
    huntingGrounds: ['Bounty Hunting', 'Extraction', 'Investigation'],
    contacts: ['A bounty board contact', 'A law enforcement ally', 'A rival hunter', 'An informant', 'A fence'],
  },
  Firedrake: {
    description: 'Rebels and criminals. Looking to protect the downtrodden and fight the Hegemony.',
    abilities: [
      { name: 'Armory', description: 'A well-stocked weapons locker. Crew gets +1d on scrap rolls when properly armed.' },
      { name: 'Battle Stations', description: 'The ship is designed for combat. +1d to helm rolls during ship combat.' },
      { name: 'War Room', description: 'A tactical planning center. +1d to the engagement roll.' },
      { name: 'Rebel Network', description: 'Contacts among rebels and dissidents across the sector. +1d to consort when dealing with resistance members.' },
    ],
    upgrades: ['Armory', 'Battle Stations', 'War Room', 'Rebel Network', 'Shields', 'Crew Quarters', 'Med Bay', 'Shuttle'],
    huntingGrounds: ['Rebellion', 'Piracy', 'Liberation'],
    contacts: ['A rebel leader', 'An arms dealer', 'A defector', 'A spy', 'A sympathetic noble'],
  },
}

export const SAV_SHIP_CATALOG = Object.keys(SAV_SHIPS).map(key => ({
  value: key,
  description: SAV_SHIPS[key].description,
}))

export const SAV_REPUTATIONS = ['Ambitious', 'Brutal', 'Daring', 'Honorable', 'Professional', 'Savvy', 'Strange', 'Subtle']

// Faction list for the sector
export const SAV_FACTIONS = [
  { name: 'The Hegemony', tier: 5, description: 'The galaxy-spanning government. Bureaucratic, powerful, corrupt.' },
  { name: 'Guild of Engineers', tier: 4, description: 'Controls most technology and manufacturing.' },
  { name: "Counters' Guild", tier: 4, description: 'Banking and finance across the sector.' },
  { name: 'Starsmith Guild', tier: 4, description: 'Shipbuilders and spaceport operators.' },
  { name: "Draxler's Raiders", tier: 3, description: 'Notorious pirate fleet preying on shipping lanes.' },
  { name: 'Cobalt Syndicate', tier: 3, description: 'Crime syndicate dealing in smuggling and vice.' },
  { name: 'Maelstrom', tier: 3, description: 'Mystic order studying the Way and Precursor artifacts.' },
  { name: 'Scarlet Wolves', tier: 2, description: 'Mercenary company taking jobs across the sector.' },
  { name: 'Church of Stellar Flame', tier: 3, description: 'Fanatical religious movement spreading through the sector.' },
  { name: 'Nightspeakers', tier: 2, description: 'Secretive mystic cult operating in the shadows.' },
  { name: '51st Legion', tier: 3, description: 'Elite Hegemony military unit.' },
  { name: 'Agony', tier: 2, description: 'Xeno crime syndicate. Alien and inscrutable.' },
  { name: 'Wreckers', tier: 1, description: 'Salvage crews working the debris fields.' },
  { name: 'Yaru', tier: 2, description: 'Nomadic xeno traders. Neutral and well-connected.' },
  { name: 'Concordiat Knights', tier: 2, description: 'Mystic warrior order. Remnants of a bygone age.' },
]
