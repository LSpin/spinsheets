// World of Darkness — Backgrounds catalog organized by splat
// Shared backgrounds appear in multiple lists

// ── Shared (available to most splats) ──
const SHARED = [
  { value: 'Allies', description: 'Mortals or organisations that actively support and assist you.',
    levels: ['● A single contact who can provide minor favours.', '●● A small group that assists in limited ways.', '●●● A reliable organisation with significant reach.', '●●●● Multiple groups across several fields.', '●●●●● Powerful allies with broad influence.'] },
  { value: 'Contacts', description: 'A network of information sources across society.',
    levels: ['● One or two people in a single field.', '●● A small network spanning a couple of fields.', '●●● Informants across several areas.', '●●●● Sources in most walks of life.', '●●●●● Extensive intelligence network.'] },
  { value: 'Fame', description: 'Public recognition and celebrity.',
    levels: ['● Known in a small niche.', '●● Known locally.', '●●● Regional celebrity.', '●●●● National prominence.', '●●●●● International fame.'] },
  { value: 'Influence', description: 'Power within mortal institutions — government, media, finance, crime.',
    levels: ['● Minor pull in one institution.', '●● Reliable leverage in a couple of organisations.', '●●● Significant sway in several institutions.', '●●●● Major power across multiple sectors.', '●●●●● Commanding influence across mortal society.'] },
  { value: 'Mentor', description: 'An elder or powerful figure who guides and advises you.',
    levels: ['● Occasional advice, little real power.', '●● Active support and guidance.', '●●● Real political influence.', '●●●● Considerable status, intervenes when needed.', '●●●●● Ancient patron whose favour opens many doors.'] },
  { value: 'Resources', description: 'Wealth, assets, property, and financial power.',
    levels: ['● Modest savings.', '●● Comfortable middle-class.', '●●● Affluent with significant assets.', '●●●● Wealthy with few financial limits.', '●●●●● Vast, effectively unlimited wealth.'] },
  { value: 'Retainers', description: 'Loyal servants who carry out your will.',
    levels: ['● One loyal assistant.', '●● A couple of reliable servants.', '●●● Several capable retainers.', '●●●● A staff covering most needs.', '●●●●● A household of devoted specialists.'] },
]

// ── Vampire (V20, Revised, Dark Ages, Victorian, KotE, Ghoul) ──
const VAMPIRE_SPECIFIC = [
  { value: 'Alternate Identity', description: 'A secondary persona with documentation and history.',
    levels: ['● Basic false name.', '●● Solid identity with ID.', '●●● Thoroughly documented.', '●●●● Deep-cover identity.', '●●●●● Multiple airtight identities.'] },
  { value: 'Domain', description: 'Territory you control with feeding rights.',
    levels: ['● Small, marginal area.', '●● Modest, defensible territory.', '●●● Well-established domain.', '●●●● Substantial territory.', '●●●●● Significant domain with political leverage.'] },
  { value: 'Generation', description: 'Proximity to Caine — thinner blood means more power.',
    levels: ['● 12th gen — blood pool 11.', '●● 11th gen — blood pool 12.', '●●● 10th gen — blood pool 13.', '●●●● 9th gen — blood pool 14, 2/turn.', '●●●●● 8th gen — blood pool 15, 3/turn.'] },
  { value: 'Herd', description: 'Mortals who willingly provide blood regularly.',
    levels: ['● Two or three willing vessels.', '●● Half a dozen reliable vessels.', '●●● About a dozen; feeding is easy.', '●●●● Large herd, consistent access.', '●●●●● Devoted flock; never want for blood.'] },
  { value: 'Haven', description: 'The safety, secrecy, and quality of your resting place.',
    levels: ['● Cramped, insecure space — a squat or car trunk.', '●● Basic private location — rented room, locked basement.', '●●● Comfortable, secure dwelling with controlled access.', '●●●● Well-appointed haven with escape routes and defences.', '●●●●● Fortified, luxurious retreat — virtually impervious.'] },
  { value: 'Status', description: 'Standing within Kindred society (Camarilla).',
    levels: ['● Known and acknowledged locally.', '●● Respected; opinions genuinely heard.', '●●● Significant standing; held recognised office.', '●●●● High esteem; one of the notable Kindred.', '●●●●● Pillar of the sect; your word carries great weight.'] },
  { value: 'Sabbat Status', description: 'Standing within the Sabbat hierarchy — Ductus, Priest, Bishop, Archbishop.',
    levels: ['● Recognised member of a pack.', '●● Pack Ductus or Priest.', '●●● Bishop-level standing.', '●●●● Archbishop or equivalent.', '●●●●● Cardinal or Regent-level influence.'] },
  { value: 'Black Hand Membership', description: 'Standing within the Black Hand (Tal\'Mahe\'Ra).',
    levels: ['● Initiated member.', '●● Trusted operative.', '●●● Officer with specific duties.', '●●●● Senior figure within the Hand.', '●●●●● Inner circle of the organisation.'] },
  { value: 'Pack Recognition', description: 'Reputation within your Sabbat pack. Higher levels mean greater authority.' },
  { value: 'Rituals', description: 'Knowledge of Sabbat auctoritas and ignobilis ritae.',
    levels: ['● Know basic ritae.', '●● Lead common ritae.', '●●● Access to uncommon ritae.', '●●●● Know rare and powerful ritae.', '●●●●● Master of the most secret rites.'] },
  { value: 'Laboratory', description: 'Workspace for blood sorcery, alchemy, or Vicissitude experiments.',
    levels: ['● A closet-sized workspace.', '●● A functional room with basic tools.', '●●● A well-equipped lab.', '●●●● A major facility with rare materials.', '●●●●● A full chantry-grade laboratory.'] },
  { value: 'Spirit Slaves', description: 'Bound wraiths forced to serve through necromancy. (Giovanni/Necromancers)',
    levels: ['● One minor wraith.', '●● A couple of useful spirits.', '●●● Several capable wraiths.', '●●●● Powerful bound spirits.', '●●●●● A host of potent wraiths at your command.'] },
  { value: 'Wraith Contacts', description: 'Connections to the restless dead who provide information. (Necromancers)' },
]

// ── Werewolf (W20) ──
const WEREWOLF_SPECIFIC = [
  { value: 'Ancestors', description: 'Connection to past lives and ancestral memories.',
    levels: ['● Vague impressions.', '●● Occasional clear memories.', '●●● Reliable access to ancestor skills.', '●●●● Deep communion, borrow abilities.', '●●●●● Past lives feel like your own.'] },
  { value: 'Fetish', description: 'A spirit-bound object with supernatural powers.',
    levels: ['● Level 1 fetish.', '●● Level 2 fetish.', '●●● Level 3 fetish.', '●●●● Level 4 fetish.', '●●●●● Level 5 fetish.'] },
  { value: 'Kinfolk', description: 'Relatives who carry the wolf gene but cannot change.',
    levels: ['● A few distant relatives.', '●● A small family group.', '●●● An extended family.', '●●●● A large family network.', '●●●●● A vast kinfolk community.'] },
  { value: 'Pure Breed', description: 'The purity and nobility of your Garou lineage.',
    levels: ['● Hints of good breeding.', '●● Clearly from a noble line.', '●●● Unmistakably pure lineage.', '●●●● Descended from legendary heroes.', '●●●●● The purest blood in generations.'] },
  { value: 'Rites', description: 'Knowledge of Garou rites — spiritual ceremonies.',
    levels: ['● One Level 1 rite.', '●● One Level 2 rite.', '●●● One Level 3 rite.', '●●●● One Level 4 rite.', '●●●●● One Level 5 rite.'] },
  { value: 'Spirit Heritage', description: 'Spiritual connections that make spirits friendlier to you.' },
  { value: 'Totem', description: 'Your pack\'s totem spirit — shared spiritual patron.',
    levels: ['● Minor totem.', '●● Moderate totem.', '●●● Significant totem.', '●●●● Powerful totem.', '●●●●● Legendary totem.'] },
  { value: 'Territory', description: 'The land your pack claims and defends.',
    levels: ['● A small urban patch.', '●● A neighbourhood or park.', '●●● A significant area.', '●●●● A large territory.', '●●●●● A vast wilderness domain.'] },
]

// ── Mage (M20) ──
const MAGE_SPECIFIC = [
  { value: 'Arcane', description: 'Supernatural anonymity — people forget you, records lose your name.',
    levels: ['● Slightly hard to remember.', '●● People forget meeting you.', '●●● Records mysteriously vanish.', '●●●● Cameras glitch, witnesses forget.', '●●●●● You barely exist in any record.'] },
  { value: 'Avatar', description: 'The strength of your Avatar — the spark of Awakened magic.',
    levels: ['● Faint whispers of guidance.', '●● Clear intuitions.', '●●● Vivid visions and dreams.', '●●●● Powerful spiritual connection.', '●●●●● Avatar is a constant, powerful presence.'] },
  { value: 'Backup', description: 'Support from your Tradition or Convention in emergencies.' },
  { value: 'Blessing', description: 'A permanent magical benefit from a spirit or Umbrood.' },
  { value: 'Certification', description: 'Official status within the Technocracy or Traditions.' },
  { value: 'Chantry', description: 'Membership in a shared magical workspace.',
    levels: ['● Access to a small shared space.', '●● A functional chantry with basic resources.', '●●● A well-equipped chantry.', '●●●● A major chantry with extensive resources.', '●●●●● A legendary chantry of great power.'] },
  { value: 'Demesne', description: 'A personal magical sanctum you\'ve shaped to your will.' },
  { value: 'Destiny', description: 'A prophesied fate that grants supernatural luck — but binds you.',
    levels: ['● Minor prophetic hints.', '●● Fate nudges events in your favour.', '●●● Clearly destined for something.', '●●●● Powerful fate that shapes your life.', '●●●●● An epic destiny that cannot be denied.'] },
  { value: 'Dream', description: 'Access to the Dreaming — prophetic visions and Umbral insight.',
    levels: ['● Occasional prophetic dreams.', '●● Regular useful visions.', '●●● Vivid controllable dreams.', '●●●● Dream-walk at will.', '●●●●● Master of the Dream Realms.'] },
  { value: 'Enhancement', description: 'Permanent Technocratic augmentation — cybernetics, bioware, or nanites.' },
  { value: 'Genius', description: 'Extraordinary natural intelligence or creative capacity.' },
  { value: 'Hypercram', description: 'Ability to learn and absorb information at superhuman speed.' },
  { value: 'Legend', description: 'Your magical reputation precedes you — for good or ill.' },
  { value: 'Library', description: 'A collection of occult texts, grimoires, and research materials.',
    levels: ['● A few useful books.', '●● A solid occult library.', '●●● An extensive collection.', '●●●● A rare and valuable library.', '●●●●● One of the great occult libraries.'] },
  { value: 'Node', description: 'A place where Quintessence pools — a source of magical energy.',
    levels: ['● A trickle of Quintessence.', '●● A modest flow.', '●●● A reliable source.', '●●●● A powerful node.', '●●●●● A legendary wellspring.'] },
  { value: 'Past Lives', description: 'Memories from previous incarnations that inform the present.' },
  { value: 'Patron', description: 'A powerful spirit, Umbrood, or entity that sponsors you.' },
  { value: 'Requisitions', description: 'Technocratic resource allocation for equipment and support.' },
  { value: 'Sanctum', description: 'A personal magical workspace separate from a chantry.' },
  { value: 'Secret Weapons', description: 'Hidden magical items or devices for emergencies.' },
  { value: 'Totem (Mage)', description: 'A spirit guide associated with your magical practice.' },
  { value: 'Wonder', description: 'A magical item — a talisman, device, or artifact.',
    levels: ['● Minor trinket.', '●● Useful magical tool.', '●●● Significant enchanted item.', '●●●● Powerful magical artifact.', '●●●●● Legendary wonder of great power.'] },
]

// ── Composed exports per splat category ──
export const VAMPIRE_BACKGROUNDS = [...SHARED, ...VAMPIRE_SPECIFIC]
export const WEREWOLF_BACKGROUNDS = [...SHARED, ...WEREWOLF_SPECIFIC]
export const MAGE_BACKGROUNDS = [...SHARED, ...MAGE_SPECIFIC]

// Default export for backwards compatibility (all combined)
export const BACKGROUNDS = [...SHARED, ...VAMPIRE_SPECIFIC, ...WEREWOLF_SPECIFIC, ...MAGE_SPECIFIC]

// Helper to get the right backgrounds for a splat
export function getBackgroundsForSplat(splat) {
  if (!splat) return VAMPIRE_BACKGROUNDS
  const s = splat.toUpperCase()
  if (s === 'WEREWOLF' || s === 'WYLD_WEST_WEREWOLF' || s === 'CHANGING_BREEDS' || s === 'TOTEM') return WEREWOLF_BACKGROUNDS
  if (s === 'MAGE' || s === 'VICTORIAN_MAGE' || s === 'FAMILIAR') return MAGE_BACKGROUNDS
  return VAMPIRE_BACKGROUNDS
}
