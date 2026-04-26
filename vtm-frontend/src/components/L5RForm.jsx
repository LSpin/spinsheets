import { useState, useEffect, Fragment } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  getCharacter, updateCharacter,
  getBackgrounds, addBackground, removeBackground,
  getXpLog, addXpLogEntry, removeXpLogEntry,
  getDisciplines, addDiscipline, removeDiscipline,
} from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import CatalogSelect from './CatalogSelect'
import DotRating from './DotRating'
import { L5R_EQUIPMENT, L5R_EQUIPMENT_CATEGORIES } from '../data/l5rEquipment'
import { L5R_KATA } from '../data/l5rKata'
import { L5R_SPELLS } from '../data/l5rSpells'
import { L5R_SCHOOLS, L5R_ADVANCED_SCHOOLS, L5R_ADVANCED_CATALOG, L5R_ALTERNATIVE_PATHS, L5R_ALTERNATIVE_CATALOG } from '../data/l5rSchools'
import { L5R_SKILL_MASTERIES } from '../data/l5rSkillMasteries'
import XpLogSection from './XpLogSection'
import { useLanguage } from '../i18n/LanguageContext'
import ExportModal from './ExportModal'
import { useTheme } from '../context/ThemeContext'
import TagInfoPanel from './TagInfoPanel'
import RulesReferenceTab from './RulesReferenceTab'
import { L5R_RULES } from '../data/l5rRules'
import L5RDiceRoller from './L5RDiceRoller'
import { L5R_HERO_NPCS, L5R_HERO_CATALOG } from '../data/l5rNpcs'

// ── Clans & Families ──
const CLANS = {
  'Crab': {
    families: [
      { value: 'Hida', description: 'Warriors and defenders of the Wall', trait: '+1 Strength' },
      { value: 'Hiruma', description: 'Scouts and monster hunters', trait: '+1 Agility' },
      { value: 'Kaiu', description: 'Engineers and siege specialists', trait: '+1 Intelligence' },
      { value: 'Kuni', description: 'Witch hunters and Taint experts', trait: '+1 Intelligence' },
      { value: 'Toritaka', description: 'Spirit hunters of the Falcon', trait: '+1 Perception' },
      { value: 'Yasuki', description: 'Merchants and diplomats', trait: '+1 Awareness' },
    ],
    schools: ['Hida Bushi', 'Hiruma Bushi', 'Hiruma Scout', 'Kaiu Engineer', 'Kuni Shugenja', 'Kuni Witch Hunter', 'Toritaka Bushi', 'Yasuki Courtier', 'Hida Pragmatist'],
  },
  'Crane': {
    families: [
      { value: 'Asahina', description: 'Pacifist shugenja and artisans', trait: '+1 Awareness' },
      { value: 'Daidoji', description: 'Iron warriors and bodyguards', trait: '+1 Agility' },
      { value: 'Doji', description: 'Courtiers and politicians', trait: '+1 Awareness' },
      { value: 'Kakita', description: 'Master duelists and artisans', trait: '+1 Reflexes' },
    ],
    schools: ['Asahina Shugenja', 'Daidoji Iron Warrior', 'Doji Courtier', 'Doji Magistrate', 'Kakita Bushi', 'Kakita Artisan'],
  },
  'Dragon': {
    families: [
      { value: 'Kitsuki', description: 'Investigators and magistrates', trait: '+1 Perception' },
      { value: 'Mirumoto', description: 'Two-sword style warriors', trait: '+1 Agility' },
      { value: 'Tamori', description: 'Mountain shugenja and alchemists', trait: '+1 Willpower' },
      { value: 'Togashi', description: 'Tattooed monks', trait: '+1 Reflexes' },
    ],
    schools: ['Kitsuki Investigator', 'Mirumoto Bushi', 'Tamori Shugenja', 'Togashi Tattooed Order'],
  },
  'Lion': {
    families: [
      { value: 'Akodo', description: 'Master strategists and tacticians', trait: '+1 Perception' },
      { value: 'Ikoma', description: 'Historians and storytellers', trait: '+1 Intelligence' },
      { value: 'Kitsu', description: 'Spirit-speaker shugenja', trait: '+1 Intelligence' },
      { value: 'Matsu', description: 'Fearless berserker warriors', trait: '+1 Strength' },
    ],
    schools: ['Akodo Bushi', 'Ikoma Bard', 'Ikoma Lion\'s Shadow', 'Kitsu Shugenja', 'Matsu Berserker'],
  },
  'Mantis': {
    families: [
      { value: 'Kitsune', description: 'Fox spirit shugenja', trait: '+1 Willpower' },
      { value: 'Moshi', description: 'Sun priestesses', trait: '+1 Intelligence' },
      { value: 'Tsuruchi', description: 'Legendary archers', trait: '+1 Reflexes' },
      { value: 'Yoritomo', description: 'Sailors and storm warriors', trait: '+1 Strength' },
    ],
    schools: ['Kitsune Shugenja', 'Moshi Shugenja', 'Tsuruchi Archer', 'Tsuruchi Bounty Hunter', 'Yoritomo Bushi', 'Yoritomo Courtier'],
  },
  'Phoenix': {
    families: [
      { value: 'Agasha', description: 'Crystal and potion masters', trait: '+1 Intelligence' },
      { value: 'Asako', description: 'Monks and scholars', trait: '+1 Awareness' },
      { value: 'Isawa', description: 'Most powerful shugenja in Rokugan', trait: '+1 Willpower' },
      { value: 'Shiba', description: 'Guardian warriors of the Phoenix', trait: '+1 Perception' },
    ],
    schools: ['Agasha Shugenja', 'Isawa Shugenja', 'Isawa Tensai', 'Shiba Bushi', 'Asako Loremaster'],
  },
  'Scorpion': {
    families: [
      { value: 'Bayushi', description: 'Master manipulators and spies', trait: '+1 Agility' },
      { value: 'Shosuro', description: 'Assassins and actors', trait: '+1 Awareness' },
      { value: 'Soshi', description: 'Shadow shugenja', trait: '+1 Intelligence' },
      { value: 'Yogo', description: 'Curse-bearing ward masters', trait: '+1 Willpower' },
    ],
    schools: ['Bayushi Bushi', 'Bayushi Courtier', 'Shosuro Infiltrator', 'Soshi Shugenja', 'Yogo Shugenja'],
  },
  'Spider': {
    families: [
      { value: 'Chuda', description: 'Maho-tsukai blood sorcerers', trait: '+1 Intelligence' },
      { value: 'Daigotsu', description: 'Dark lords of the Spider', trait: '+1 Willpower' },
      { value: 'Goju', description: 'Ninja of the Nothing', trait: '+1 Reflexes' },
      { value: 'Susumu', description: 'Dark courtiers', trait: '+1 Awareness' },
    ],
    schools: ['Chuda Shugenja', 'Daigotsu Bushi', 'Daigotsu Courtier', 'Goju Ninja', 'Ninube Shugenja'],
  },
  'Unicorn': {
    families: [
      { value: 'Horiuchi', description: 'Meishodo name magic', trait: '+1 Willpower' },
      { value: 'Ide', description: 'Diplomats and traders', trait: '+1 Awareness' },
      { value: 'Iuchi', description: 'Desert shugenja', trait: '+1 Willpower' },
      { value: 'Moto', description: 'Fearsome Death Priests', trait: '+1 Agility' },
      { value: 'Shinjo', description: 'Horse lords and explorers', trait: '+1 Reflexes' },
      { value: 'Utaku', description: 'Elite mounted warriors', trait: '+1 Stamina' },
    ],
    schools: ['Ide Emissary', 'Iuchi Shugenja', 'Moto Bushi', 'Moto Vindicator', 'Shinjo Bushi', 'Utaku Battle Maiden'],
  },
  'Imperial': {
    families: [
      { value: 'Miya', description: 'Imperial heralds', trait: '+1 Awareness' },
      { value: 'Otomo', description: 'Imperial politicians', trait: '+1 Intelligence' },
      { value: 'Seppun', description: 'Imperial guard', trait: '+1 Reflexes' },
    ],
    schools: ['Miya Herald', 'Otomo Courtier', 'Seppun Guardsman', 'Seppun Shugenja'],
  },
  'Minor Clan': { families: [], schools: [] },
  'Ronin': { families: [], schools: ['Ronin (Various)'] },
}
const CLAN_NAMES = Object.keys(CLANS)

const CLAN_CATALOG = [
  { value: 'Crab', description: 'The Wall. Defenders of Rokugan against the Shadowlands. Endurance and sacrifice.' },
  { value: 'Crane', description: 'The Left Hand. Masters of politics, art, and court etiquette. Beauty and perfection.' },
  { value: 'Dragon', description: 'The Sword. Enigmatic monks and warriors seeking enlightenment in the mountains.' },
  { value: 'Lion', description: 'The Right Hand. The Emperor\'s chosen army. Honor, bushido, and military tradition.' },
  { value: 'Mantis', description: 'The Storm. Seafaring merchants and pirates who earned Great Clan status through audacity.' },
  { value: 'Phoenix', description: 'The Soul. Scholars and shugenja devoted to mastering the elemental kami.' },
  { value: 'Scorpion', description: 'The Underhand. Spies, saboteurs, and loyal villains who do what others will not.' },
  { value: 'Spider', description: 'The Shadow. Servants of the Shadowlands who infiltrated Rokugan\'s courts. Controversial.' },
  { value: 'Unicorn', description: 'The Wind. Nomadic horse lords who spent centuries exploring the world beyond Rokugan.' },
  { value: 'Imperial', description: 'Servants of the Emperor directly. Above clan politics and devoted to the Throne.' },
  { value: 'Minor Clan', description: 'One of many small clans with specialized roles. Less powerful but fiercely independent.' },
  { value: 'Ronin', description: 'Masterless samurai. Without clan or lord, surviving by skill and wits alone.' },
]

// ── Skill categories with associated traits (from lasthaiku.wikidot.com) ──
const SKILL_CATEGORIES = {
  'High Skills': [
    'Acting (Awareness)', 'Artisan (Awareness)', 'Calligraphy (Intelligence)', 'Courtier (Awareness)',
    'Divination (Intelligence)', 'Etiquette (Awareness)', 'Games (Varies)', 'Investigation (Perception)',
    'Lore (Intelligence)', 'Medicine (Intelligence)', 'Meditation (Void)', 'Perform (Varies)',
    'Sincerity (Awareness)', 'Spellcraft (Intelligence)', 'Tea Ceremony (Void)',
  ],
  'Bugei Skills': [
    'Athletics (Strength)', 'Battle (Perception)', 'Defense (Reflexes)', 'Horsemanship (Agility)',
    'Hunting (Perception)', 'Iaijutsu (Reflexes)', 'Jiujutsu (Agility)',
    'Chain Weapons (Agility)', 'Heavy Weapons (Agility)', 'Kenjutsu (Agility)',
    'Knives (Agility)', 'Kyujutsu (Reflexes)', 'Naginata (Agility)',
    'Polearms (Agility)', 'Spears (Agility)', 'Staves (Agility)', 'War Fan (Agility)',
  ],
  'Merchant Skills': [
    'Animal Handling (Awareness)', 'Commerce (Intelligence)', 'Craft (Varies)',
    'Engineering (Intelligence)', 'Sailing (Agility)',
  ],
  'Low Skills': [
    'Forgery (Agility)', 'Intimidation (Willpower)', 'Sleight of Hand (Agility)',
    'Stealth (Agility)', 'Temptation (Awareness)',
  ],
}

// ── Stances reference ──
const STANCES = [
  { name: 'Attack', ring: 'Water', description: 'Standard stance. No restrictions on Actions. Fluid and versatile.' },
  { name: 'Full Attack', ring: 'Fire', description: '+2k1 to attack rolls, but Armor TN reduced by 10. May only attack or move closer. Cannot use ranged attacks. +5 ft bonus movement.' },
  { name: 'Defense', ring: 'Air', description: 'Add Air Ring + Defense Skill Rank to Armor TN. No restrictions except you may not attack. Useful for casting spells in combat.' },
  { name: 'Full Defense', ring: 'Earth', description: 'Roll Defense/Reflexes and add half (rounded up) to Armor TN until next Turn. This counts as a Complex Action — only Free Actions allowed.' },
  { name: 'Center', ring: 'Void', description: 'Spend a Void Point. Cannot attack. On your next Turn, add a bonus of +1k1+Void Ring to one roll. Cannot be maintained for more than one Round. Cannot be used while in the Down Wound Rank.' },
]

const MANEUVERS = [
  { name: 'Called Shot', raises: 'Variable', description: 'Target a specific body part: limb (1 Raise), hand/foot (2), head (3), eye/finger (4).' },
  { name: 'Disarm', raises: '3', description: 'If attack succeeds, target must roll Reflexes at TN equal to damage dealt or drop weapon.' },
  { name: 'Extra Attack', raises: '5', description: 'Make one additional attack this Turn (max one extra per Turn).' },
  { name: 'Feint', raises: '2', description: 'Ignore target\'s Armor bonus from armor (not Reflexes or other bonuses).' },
  { name: 'Guard', raises: '0', description: 'Simple Action. Protect an adjacent ally — attacks against them must target you instead.' },
  { name: 'Increased Damage', raises: '1 per +1k0', description: 'Each Raise adds +1k0 to your damage roll.' },
  { name: 'Knockdown', raises: '2', description: 'If attack succeeds, target is knocked Prone.' },
]

const L5R_CONDITIONS = [
  { name: 'Prone', effect: '-10 to melee attacks, +10 ATN vs ranged. Stand up = Simple Action.' },
  { name: 'Stunned', effect: 'Cannot take Actions this Turn. ATN reduced by 10.' },
  { name: 'Fatigued', effect: '-2k0 to all physical rolls. Rest 4 hours to recover.' },
  { name: 'Dazed', effect: 'May only take Free Actions this Turn.' },
  { name: 'Grappled', effect: 'Cannot move. Contested Jiujutsu to escape. -10 ATN.' },
  { name: 'Entangled', effect: 'Cannot move or use weapons. Contested Strength or cut free.' },
  { name: 'Blinded', effect: '-3k3 ranged, -1k1 melee. ATN = Reflexes × 5 + 5 only.' },
  { name: 'Mounted', effect: 'Uses Horsemanship for movement. +1k0 melee damage vs unmounted.' },
]

// ── Advantages catalogue ──
const L5R_ADVANTAGES = [
  { name: 'Absolute Direction', cost: 1, description: 'You always know which direction is north.' },
  { name: 'Allies', cost: 'Variable', description: 'Social connections willing to help you. Cost = Influence + Devotion.' },
  { name: 'Balance', cost: 2, description: '+1k0 to resist Intimidation/Temptation when adding Honor.' },
  { name: 'Battle Healing', cost: 5, description: 'Expend spell slots to heal one Wound Rank on a Rokugani you touch.' },
  { name: 'Blackmail', cost: 'Variable', description: 'You possess proof of another\'s dark secret. Cost = their Status.' },
  { name: 'Bland', cost: 2, description: '+10 TN for others to recognize or identify you.' },
  { name: 'Blissful Betrothal', cost: 3, description: 'Happy arranged marriage. Gentry, Social Position, Wealth cost 2 less.' },
  { name: 'Blood of Osano-Wo', cost: 4, description: 'Immune to natural weather damage. Reduce elemental spell damage by 1k1.' },
  { name: 'Broken Wave Citizen', cost: 3, description: 'You are a citizen of Broken Wave City. +1k0 to Commerce rolls in the city.' },
  { name: 'Child of Chikushudo', cost: 7, description: 'Spiritual connection to the realm of animals. Can speak with animals once per day.' },
  { name: 'Chosen by the Oracles', cost: 6, description: '+1k1 to all Ring Rolls using one chosen Ring.' },
  { name: 'Clear Thinker', cost: 3, description: '+1k0 on Contested Rolls vs. confusion or manipulation.' },
  { name: 'Crab Hands', cost: 3, description: 'Treat unfamiliar Weapon Skills as Rank 1 instead of Unskilled.' },
  { name: 'Crafty', cost: 3, description: 'Treat Low Skills at Rank 0 as Rank 1 (avoid Unskilled penalties).' },
  { name: 'Dangerous Beauty', cost: 3, description: '+1k0 to Temptation rolls against the opposite sex.' },
  { name: 'Daredevil', cost: 3, description: '+3k1 instead of +1k1 when spending Void on Athletics.' },
  { name: 'Dark Edge Native', cost: 2, description: 'Native of the Dark Edge Village. +1k0 to Stealth in forests.' },
  { name: 'Dark Paragon', cost: 5, description: 'Embody a dark tenet (Control, Determination, Insight, Knowledge, Perfection, Strength, Will).' },
  { name: 'Darling of the Court', cost: 2, description: 'You are adored by courtiers and gain social advantages at court.' },
  { name: 'Different School', cost: 5, description: 'Attend a school of a different Clan.' },
  { name: 'Elemental Blessing', cost: 4, description: 'Reduce XP cost to raise both Traits of one Ring by 1.' },
  { name: 'Enlightened', cost: 6, description: 'You have achieved a degree of spiritual awakening. +1k0 to Meditation rolls.' },
  { name: 'Fame', cost: 3, description: 'Your Glory Rank is effectively 1 higher for recognition.' },
  { name: 'Forbidden Knowledge', cost: 5, description: 'You possess dangerous lore. +1k0 to one Lore of your choice.' },
  { name: 'Friend of the Brotherhood', cost: 5, description: 'Monks of the Brotherhood trust you. +1k0 to Social rolls with monks.' },
  { name: 'Friend of the Elements', cost: 4, description: 'One element\'s kami are friendlier to you. +1k0 to spells of that element.' },
  { name: 'Friendly Kami', cost: 5, description: 'A particular elemental kami is fond of you. +1k1 to one element\'s spell casting.' },
  { name: 'Gaijin Gear', cost: 5, description: 'You possess a foreign weapon, tool, or device of unusual design.' },
  { name: 'Gentry', cost: 'Variable', description: 'You own land. Village (8), Large Village (15), Town (20), City (25), Province (30).' },
  { name: 'Great Destiny', cost: 5, description: 'Once per session, survive what would otherwise kill you.' },
  { name: 'Great Potential', cost: 5, description: 'Choose one Trait. Its maximum is increased by 1.' },
  { name: 'Hands of Stone', cost: 6, description: 'Unarmed damage is 0k2 instead of 0k1.' },
  { name: 'Heart of Vengeance', cost: 5, description: 'When fighting the target of your vendetta, +1k1 to attack rolls.' },
  { name: 'Heartless', cost: 4, description: '+1k0 to resist Intimidation and Fear. Cannot benefit from Love advantages.' },
  { name: 'Hero of the People', cost: 2, description: 'Peasants love and trust you, providing aid when possible.' },
  { name: 'Higher Purpose', cost: 3, description: '+1k0 to rolls directly related to your chosen cause.' },
  { name: 'Imperial City Citizen', cost: 2, description: 'Familiar with the Imperial City. +1k0 to Lore: Law in the capital.' },
  { name: 'Imperial City Veteran', cost: 2, description: 'Veteran of Imperial City service. +1k0 to Battle rolls in urban environments.' },
  { name: 'Imperial Scribe', cost: 4, description: '+1k1 to Calligraphy rolls. Access to Imperial archives.' },
  { name: 'Imperial Spouse', cost: 5, description: 'Married into the Imperial family. Status +1 and political connections.' },
  { name: 'Inari\'s Blessing', cost: 3, description: '+1k0 to all rolls involving rice, agriculture, or fertility.' },
  { name: 'Inheritance', cost: 5, description: 'You have inherited a significant item (weapon, armor, etc.).' },
  { name: 'Inner Gift', cost: 7, description: 'You possess a minor supernatural gift (GM approval required).' },
  { name: 'Iron Heart Native', cost: 2, description: '+1k0 to Craft rolls when working with iron or steel.' },
  { name: 'Irreproachable', cost: 2, description: '+1k0 to resist Temptation and Intimidation.' },
  { name: 'Ishiken-Do', cost: 8, description: 'You can cast Void spells. Extremely rare.' },
  { name: 'Kharmic Tie', cost: 1, description: 'Deep spiritual bond with another PC. Shared fate.' },
  { name: 'Languages', cost: '1/3', description: 'Speak an additional language (1 pt common, 3 pt rare/ancient).' },
  { name: 'Large', cost: 4, description: 'Significantly larger than average. +1k0 to damage rolls.' },
  { name: 'Laughing Plains Native', cost: 2, description: '+1k0 to Horsemanship on the plains.' },
  { name: 'Leadership', cost: 6, description: '+1k0 to Battle rolls. Followers have higher morale.' },
  { name: 'Luck', cost: '3/6/9', description: 'Reroll 1/2/3 times per session (keep better result).' },
  { name: 'Magic Resistance', cost: '2/4/6', description: '+5/+10/+15 to TN of all spells targeting you.' },
  { name: 'Medium', cost: 4, description: 'Can perceive and communicate with spirits and ghosts.' },
  { name: 'Multiple Schools', cost: 10, description: 'You have trained in a second School (requires GM approval).' },
  { name: 'Naga Ancestry', cost: 7, description: 'Distant Naga bloodline. Can understand the Naga language. Minor physical trait.' },
  { name: 'Naishou Citizen', cost: 3, description: 'Citizen of Naishou Province. +1k0 to Lore: Naishou.' },
  { name: 'Nikesake Citizen', cost: 3, description: 'Citizen of Nikesake. +1k0 to Commerce in the city.' },
  { name: 'Paragon', cost: 7, description: 'Embody a tenet of Bushido. Gain a special benefit related to it.' },
  { name: 'Perceived Honor', cost: 3, description: 'Your Honor appears 1 Rank higher for social purposes.' },
  { name: 'Precise Memory', cost: 3, description: 'You can recall details with near-perfect accuracy.' },
  { name: 'Prodigy', cost: 12, description: 'Choose one Skill. You gain the benefits of all Mastery Abilities for that Skill.' },
  { name: 'Quick', cost: 6, description: '+1k0 to all Initiative rolls.' },
  { name: 'Quick Healer', cost: 3, description: 'Heal twice as fast as normal.' },
  { name: 'Read Lips', cost: 4, description: 'You can read lips with an Investigation/Perception roll.' },
  { name: 'Reincarnated', cost: 6, description: 'Memories of a past life. +1k0 to two Skills from your past life.' },
  { name: 'Ruined City Shadow', cost: 3, description: '+1k0 to Stealth in ruined or abandoned urban areas.' },
  { name: 'Sacred Forest Native', cost: 2, description: '+1k0 to Hunting and Survival in forests.' },
  { name: 'Sacred Weapon', cost: 'Variable', description: 'A weapon of spiritual significance with special properties.' },
  { name: 'Sacrosanct', cost: 4, description: 'Religious protection. Others suffer Honor loss for attacking you unprovoked.' },
  { name: 'Sage', cost: 4, description: '+1k0 to all Lore Skill Rolls.' },
  { name: 'Sage of the Sword and Fan', cost: 7, description: '+1k0 to all rolls involving both combat and courtly knowledge.' },
  { name: 'Sensation', cost: 3, description: '+1k0 to all Artisan and Perform Skill Rolls.' },
  { name: 'Servant', cost: 5, description: 'You have a loyal personal servant (hinin or eta).' },
  { name: 'Seven Fortunes\' Blessing', cost: 4, description: 'Blessed by one of the Seven Fortunes. Choose one for a specific benefit.' },
  { name: 'Shadowed Heart', cost: 5, description: '+1k0 to Intimidation. Your presence unnerves others.' },
  { name: 'Silent', cost: 3, description: '+1k0 to all Stealth Skill Rolls.' },
  { name: 'Social Position', cost: 6, description: 'Status Rank 1 higher than normal for your School/Family.' },
  { name: 'Soul of Artistry', cost: 4, description: 'Pick one Artisan skill. You gain +1k1 with it.' },
  { name: 'Spy Network', cost: 8, description: 'You control a network of informants. +1k1 to Investigation for gathering intel.' },
  { name: 'Stolen Identity', cost: 6, description: 'You have successfully assumed another person\'s identity.' },
  { name: 'Strategist', cost: 5, description: '+1k0 to Battle rolls when commanding troops.' },
  { name: 'Strength of the Earth', cost: 3, description: 'Reduce all Wound TN penalties by 3.' },
  { name: 'Student of Shourido', cost: 9, description: 'Trained in the dark philosophy. Access to Dark Paragon abilities.' },
  { name: 'Tactician', cost: 4, description: '+1k0 to all Battle Skill Rolls.' },
  { name: 'Touch of the Spirit Realms', cost: 5, description: 'Mystical connection to a spirit realm with minor benefits.' },
  { name: 'Virtuous', cost: 3, description: '+1k0 to resist any temptation to act dishonorably.' },
  { name: 'Voice', cost: 3, description: '+1k0 to any Social Skill Roll involving speaking.' },
  { name: 'Void Versatility', cost: 4, description: 'Spend Void Points on Skill Rolls you are not normally allowed to enhance.' },
  { name: 'Wary', cost: 3, description: '+1k1 to Investigation rolls to detect ambush or surprise.' },
  { name: 'Watanu-Trained', cost: 1, description: '+1k0 to Athletics rolls involving climbing.' },
  { name: 'Water Hammer Citizen', cost: 3, description: '+1k0 to Craft rolls in Water Hammer City.' },
  { name: 'Way of the Land', cost: 2, description: 'You know a specific region intimately. No movement penalties there.' },
  { name: 'Wealthy', cost: '1-5', description: 'Greater starting koku and resources.' },
  { name: 'Well-Connected', cost: '3/rank', description: '+1k0 to Social rolls with a specific organization per rank.' },
  { name: 'Zakyo Toshi Citizen', cost: 3, description: '+1k0 to Commerce and Underworld Lore in Zakyo Toshi.' },
]

// ── Disadvantages catalogue ──
const L5R_DISADVANTAGES = [
  { name: 'Anachronism', cost: 2, description: 'You cling to outdated customs. -1k0 to Social rolls in modern settings.' },
  { name: 'Antisocial', cost: '2/4', description: '-1k0 or -1k1 to all Social Skill Rolls.' },
  { name: 'Ascetic', cost: 2, description: 'No material possessions beyond essentials. Half Glory awards.' },
  { name: 'Bad Eyesight', cost: 3, description: '-1k1 to ranged attacks and Perception-based rolls.' },
  { name: 'Bad Fortune', cost: 3, description: 'Kharma has cursed you (Secret Love, Evil Eye, Unknown Enemy, etc.).' },
  { name: 'Bad Health', cost: 4, description: 'Earth Ring -1 for Wound Ranks and disease resistance.' },
  { name: 'Bitter Betrothal', cost: 2, description: 'Unhappy arranged marriage causing domestic difficulties.' },
  { name: 'Black Sheep', cost: 3, description: 'Your family is disgusted with you. No welcome at home.' },
  { name: 'Blackmailed', cost: 'Variable', description: 'Someone knows your dark secret. Cost = your Status.' },
  { name: 'Blind', cost: 6, description: '-3k3 ranged, -1k1 melee. Armor TN = Reflexes + 5.' },
  { name: 'Bounty', cost: '2/4/6', description: 'Someone has placed a price on your head.' },
  { name: 'Brash', cost: 3, description: 'Must roll Willpower TN 25 or attack when insulted.' },
  { name: 'Broken Wave Stigma', cost: 2, description: 'Associated with Broken Wave City\'s unsavory reputation. -1k0 Social in polite society.' },
  { name: 'Can\'t Lie', cost: 2, description: 'Willpower TN 25 to tell a deliberate lie. Others get +1k0 to detect your deception.' },
  { name: 'Cast Out', cost: '1/3', description: 'Expelled from your family (1) or clan (3). No family/clan support.' },
  { name: 'Compulsion', cost: '2-4', description: 'Hopelessly compelled to partake in an activity.' },
  { name: 'Consumed', cost: 'Variable', description: 'An obsession dominates your thoughts. Willpower TN to resist acting on it.' },
  { name: 'Contrary', cost: 3, description: 'You instinctively disagree with others. -1k0 to Social rolls when agreeing.' },
  { name: 'Cursed by the Realm', cost: 4, description: 'A Spirit Realm has cursed you. Specific penalty based on realm.' },
  { name: 'Dark Edge Reputation', cost: 2, description: 'Known associate of Dark Edge Village. -1k0 to Social with law-abiding.' },
  { name: 'Dark Fate', cost: 3, description: 'Destiny has something terrible in store for you.' },
  { name: 'Dark Secret', cost: 4, description: 'You hide a terrible secret that would destroy you if revealed.' },
  { name: 'Debt', cost: '2/4/8', description: 'You owe a significant debt (financial, social, or spiritual).' },
  { name: 'Dependent', cost: 'Variable', description: 'Someone depends on you for protection or support.' },
  { name: 'Disbeliever', cost: 3, description: 'You question the kami and Fortunes. -1k0 to Theology rolls.' },
  { name: 'Dishonored', cost: 5, description: 'You have been publicly dishonored. Status -1, -1k0 to Social with samurai.' },
  { name: 'Disturbing Countenance', cost: 3, description: 'Something about your appearance is unsettling. -1k0 to Social first impressions.' },
  { name: 'Doubt', cost: 4, description: 'Choose one Skill. You must call one Raise on every roll with it or gain no bonus.' },
  { name: 'Driven', cost: 2, description: 'A strong motivation compels you. Must roll Willpower TN 15 to resist acting on it.' },
  { name: 'Elemental Imbalance', cost: '2/rank', description: 'One element is weakened within you. -1k0 per rank to that element\'s rolls.' },
  { name: 'Enlightened Madness', cost: '4/6', description: 'Your spiritual insight has driven you partially mad.' },
  { name: 'Epilepsy', cost: 4, description: 'Prone to seizures. Roll Earth TN 20 in stressful situations or be incapacitated.' },
  { name: 'Failure of Bushido', cost: 'Variable', description: 'You have failed one tenet of Bushido. Cost = severity.' },
  { name: 'Fascination', cost: 1, description: 'Something mundane fascinates you. -1k0 to resist investigating it.' },
  { name: 'Forced Retirement', cost: 4, description: 'You were forced to retire from active service. Status -2.' },
  { name: 'Frail Mind', cost: 3, description: 'Susceptible to mental manipulation. -1k0 to resist Intimidation and Temptation.' },
  { name: 'Gaijin Name', cost: 1, description: 'Your name sounds foreign. Minor social stigma.' },
  { name: 'Greedy', cost: 3, description: 'You desire wealth above all. Willpower TN 20 to pass up profit.' },
  { name: 'Gullible', cost: 4, description: '-1k1 to Contested Rolls vs. Sincerity (Deceit).' },
  { name: 'Haunted', cost: 3, description: 'A ghost follows you. It may help or hinder at the GM\'s discretion.' },
  { name: 'Hostage', cost: 3, description: 'You are being held as a political hostage. Limited freedom.' },
  { name: 'Idealistic', cost: 2, description: 'You see the best in everyone. -1k0 to detect lies or deception.' },
  { name: 'Imperial City Stigma', cost: 'Variable', description: 'Negative reputation in the Imperial City.' },
  { name: 'Infamous', cost: 2, description: 'Your Glory Rank is effectively 1 lower for negative recognition.' },
  { name: 'Insensitive', cost: 2, description: '-1k0 to Empathy and all Social rolls involving emotional understanding.' },
  { name: 'Jealousy', cost: 3, description: 'Consumed by jealousy toward a specific person or group.' },
  { name: 'Lame', cost: 4, description: 'One leg is injured. Water -1 for movement, -1k0 to Athletics.' },
  { name: 'Lechery', cost: 2, description: 'Weakness for romantic or physical temptation. Willpower TN 15 to resist.' },
  { name: 'Lord Moon\'s Curse', cost: '3/5/7', description: 'Madness strikes during the full moon. Severity varies by cost.' },
  { name: 'Lost Love', cost: 3, description: 'Someone you loved is gone. -1k0 to all rolls when reminded.' },
  { name: 'Low Pain Threshold', cost: 4, description: 'Wound TN penalties are 5 higher than normal.' },
  { name: 'Member of the Chrysanthemum Court', cost: 5, description: 'Obligations to attend court reduce adventuring time.' },
  { name: 'Missing Limb', cost: 6, description: 'One arm or leg is missing. Severe penalties to relevant actions.' },
  { name: 'Momoku', cost: 8, description: 'Spiritually blind. Cannot perceive the spirit world or use Void Points.' },
  { name: 'Nikesake Stigma', cost: 4, description: 'Associated with Nikesake\'s bad reputation.' },
  { name: 'Obligation', cost: '3/6', description: 'You owe service to someone. Must fulfill obligations when called.' },
  { name: 'Obtuse', cost: 3, description: 'You miss social cues. -1k0 to Courtier and Etiquette.' },
  { name: 'Overconfident', cost: 3, description: 'You believe you can do anything. Must make 1 Raise on combat rolls.' },
  { name: 'Permanent Wound', cost: 4, description: 'An old wound never healed. One Wound Rank is always filled.' },
  { name: 'Phobia', cost: '1/2/3', description: 'Fear of something specific. Willpower TN to act normally near it.' },
  { name: 'Ruined City Survivor', cost: 4, description: 'Traumatized by a ruined city. -1k0 in similar environments.' },
  { name: 'Rumormonger', cost: 4, description: 'You can\'t keep secrets. -1k0 to resist sharing gossip.' },
  { name: 'Seven Fortunes\' Curse', cost: 3, description: 'Cursed by one of the Seven Fortunes.' },
  { name: 'Shadowlands Taint', cost: 4, description: 'You carry the Taint. Detectable by magic, worsens over time.' },
  { name: 'Sleeper Agent', cost: 5, description: 'You have been mentally conditioned. A trigger word activates hidden programming.' },
  { name: 'Small', cost: 3, description: 'Significantly smaller than average. -1k0 to damage rolls.' },
  { name: 'Social Disadvantage', cost: 3, description: 'Born into a lower social class. Status -1.' },
  { name: 'Soft-Hearted', cost: 2, description: 'You are deeply empathetic. -1k0 to resist emotional manipulation.' },
  { name: 'Sworn Enemy', cost: 3, description: 'A powerful person or group actively works against you.' },
  { name: 'Touch of the Void', cost: 3, description: 'The Void whispers to you. Occasional hallucinations or visions.' },
  { name: 'True Love', cost: 3, description: 'Deeply in love. Must protect them. -1k0 when separated.' },
  { name: 'Uncentered', cost: '2/4', description: 'Monks only. Difficulty maintaining spiritual balance.' },
  { name: 'Unlucky', cost: '2/rank', description: 'Bad luck follows you. GM can force rerolls (keep worse).' },
  { name: 'Wanderer', cost: 2, description: 'No fixed home. -1k0 to Social rolls in formal court settings.' },
  { name: 'Water Hammer Stigma', cost: 2, description: 'Associated with Water Hammer City\'s reputation.' },
  { name: 'Weakness', cost: 6, description: 'One Trait is treated as if 1 rank lower for all rolls.' },
  { name: 'Wrath of the Kami', cost: 3, description: 'Elemental kami dislike you. +5 TN to all spell casting.' },
  { name: 'Zakyo Toshi Stigma', cost: 3, description: 'Associated with the City of Lies.' },
]

// ── Wound Rank table reference ──
const WOUND_RANKS = [
  { name: 'Healthy', penalty: '+0' },
  { name: 'Nicked', penalty: '+3' },
  { name: 'Grazed', penalty: '+5' },
  { name: 'Hurt', penalty: '+10' },
  { name: 'Injured', penalty: '+15' },
  { name: 'Crippled', penalty: '+20' },
  { name: 'Down', penalty: '+40' },
  { name: 'Out', penalty: 'Cannot act' },
]

const SCHOOL_EQUIPMENT = {
  'Hida Bushi': ['Daisho (Katana & Wakizashi)', 'Heavy Armor', 'Tetsubo or Dai Tsuchi', 'Jade Finger'],
  'Hiruma Bushi': ['Daisho', 'Light Armor or Ashigaru', 'Bow (Yumi)', 'Survival Kit'],
  'Hiruma Scout': ['Daisho', 'Light Armor', 'Bow (Han-kyu or Yumi)', 'Jade Finger', 'Camouflage Face Paint'],
  'Kaiu Engineer': ['Daisho', 'Heavy Armor or Riding Armor', 'Dai Tsuchi or War Fan', 'Engineering Kit', 'Toolkit'],
  'Kuni Shugenja': ['Wakizashi', 'Scroll Satchel', 'Jade Finger', 'Face Paint'],
  'Kuni Witch Hunter': ['Daisho', 'Light Armor', 'Jade Pendant', 'Crystal of Air'],
  'Toritaka Bushi': ['Daisho', 'Light Armor', 'Yari or Yumi', 'Jade Finger'],
  'Yasuki Courtier': ['Wakizashi', 'Calligraphy Set', 'Merchant\'s Scales', 'Fine Clothing'],
  'Hida Pragmatist': ['Daisho', 'Ashigaru Armor', 'Improvised Weapons', 'Rope'],
  'Asahina Shugenja': ['Wakizashi', 'Scroll Satchel', 'Incense', 'Fine Brush Set'],
  'Daidoji Iron Warrior': ['Daisho', 'Heavy Armor', 'Yari', 'Iron Fan'],
  'Doji Courtier': ['Wakizashi', 'Fine Clothing (2 sets)', 'Personal Seal', 'Fan'],
  'Doji Magistrate': ['Daisho', 'Light Armor', 'Jitte', 'Magistrate\'s Badge'],
  'Kakita Bushi': ['Daisho', 'Light Armor or Fine Clothing', 'Dueling Practice Sword'],
  'Kakita Artisan': ['Wakizashi', 'Artisan Tools', 'Fine Clothing', 'Personal Gallery'],
  'Kitsuki Investigator': ['Daisho', 'Light Armor or Fine Clothing', 'Magnifying Lens', 'Calligraphy Set'],
  'Mirumoto Bushi': ['Daisho', 'Light Armor', 'Sturdy Clothing'],
  'Tamori Shugenja': ['Wakizashi', 'Scroll Satchel', 'Alchemical Ingredients', 'Mortar & Pestle'],
  'Togashi Tattooed Order': ['Bo or Tonfa', 'Simple Robes', 'Meditation Beads'],
  'Akodo Bushi': ['Daisho', 'Light Armor or Heavy Armor', 'War Fan', 'Military Text'],
  'Ikoma Bard': ['Wakizashi', 'Fine Clothing (2 sets)', 'Historical Scrolls', 'Musical Instrument'],
  "Ikoma Lion's Shadow": ['Daisho', 'Light Armor', 'Disguise Kit', 'Forgery Kit'],
  'Kitsu Shugenja': ['Wakizashi', 'Scroll Satchel', 'Incense', 'Ancestral Shrine (portable)'],
  'Matsu Berserker': ['Daisho', 'Light Armor', 'War Paint', 'Sturdy Clothing'],
  'Kitsune Shugenja': ['Wakizashi', 'Scroll Satchel', 'Animal Companion (Fox)'],
  'Moshi Shugenja': ['Wakizashi', 'Scroll Satchel', 'Prayer Beads', 'Sunstone'],
  'Tsuruchi Archer': ['Daisho', 'Yumi (Dai-kyu)', 'Arrows (20)', 'Light Armor'],
  'Tsuruchi Bounty Hunter': ['Daisho', 'Yumi', 'Arrows (20)', 'Manacles', 'Traveling Pack'],
  'Yoritomo Bushi': ['Daisho', 'Light Armor', 'Kama or Parangu', 'Sailing Gear'],
  'Yoritomo Courtier': ['Wakizashi', 'Fine Clothing', 'Merchant Ledger', 'Seal of Authority'],
  'Agasha Shugenja': ['Wakizashi', 'Scroll Satchel', 'Alchemical Ingredients'],
  'Isawa Shugenja': ['Wakizashi', 'Scroll Satchel', 'Prayer Beads', 'Elemental Focus'],
  'Isawa Tensai': ['Wakizashi', 'Scroll Satchel', 'Elemental Focus (chosen element)'],
  'Shiba Bushi': ['Daisho', 'Light Armor', 'Naginata or Yari'],
  'Asako Loremaster': ['Wakizashi', 'Fine Clothing', 'Historical Texts (3)', 'Calligraphy Set'],
  'Bayushi Bushi': ['Daisho', 'Light Armor', 'Scorpion Mask', 'Knife (concealed)'],
  'Bayushi Courtier': ['Wakizashi', 'Fine Clothing (2 sets)', 'Scorpion Mask', 'Blackmail Documents'],
  'Shosuro Infiltrator': ['Daisho or Ninja-to', 'Light Armor or Dark Clothing', 'Disguise Kit', 'Poison (1 dose)'],
  'Soshi Shugenja': ['Wakizashi', 'Scroll Satchel', 'Scorpion Mask', 'Cipher Book'],
  'Yogo Shugenja': ['Wakizashi', 'Scroll Satchel', 'Ward Papers', 'Jade Finger'],
  'Chuda Shugenja': ['Wakizashi', 'Scroll Satchel', 'Obsidian Mirror'],
  'Daigotsu Bushi': ['Daisho', 'Light Armor', 'Spider Clan Mon'],
  'Daigotsu Courtier': ['Wakizashi', 'Fine Clothing', 'Coded Correspondence'],
  'Goju Ninja': ['Ninja-to', 'Dark Clothing', 'Shuriken (10)', 'Smoke Bombs'],
  'Ninube Shugenja': ['Wakizashi', 'Scroll Satchel', 'Shadow Talisman'],
  'Ide Emissary': ['Wakizashi', 'Fine Clothing (foreign style)', 'Travel Papers', 'Gift Set'],
  'Iuchi Shugenja': ['Wakizashi', 'Scroll Satchel', 'Riding Horse', 'Travel Supplies'],
  'Moto Bushi': ['Daisho or Scimitar', 'Light Armor or Riding Armor', 'Gaijin Riding Horse', 'War Paint'],
  'Moto Vindicator': ['Daisho', 'Heavy Armor', 'Gaijin Riding Horse', 'Jade Finger'],
  'Shinjo Bushi': ['Daisho', 'Riding Armor', 'Unicorn Riding Horse', 'Yumi'],
  'Utaku Battle Maiden': ['Daisho', 'Riding Armor', 'Utaku Steed', 'Battle Standard'],
  'Miya Herald': ['Wakizashi', 'Fine Clothing', 'Imperial Travel Papers', 'Herald\'s Fan'],
  'Otomo Courtier': ['Wakizashi', 'Fine Clothing (3 sets)', 'Imperial Seal (minor)', 'Calligraphy Set'],
  'Seppun Guardsman': ['Daisho', 'Heavy Armor', 'Yari', 'Imperial Mon'],
  'Seppun Shugenja': ['Wakizashi', 'Scroll Satchel', 'Imperial Prayer Beads'],
}

const INITIAL = {
  npc: false, splat: 'L5R',
  name: '', altName: '', concept: '',
  nature: '', demeanor: '',
  l5rClan: '', l5rFamily: '', l5rSchool: '',
  l5rAdvancedSchool: '', l5rAlternativePath: '',
  // Traits (Air)
  l5rReflexes: 2, l5rAwareness: 2,
  // Traits (Earth)
  l5rStamina7: 2, l5rWillpower7: 2,
  // Traits (Fire)
  l5rAgility: 2, l5rIntelligence7: 2,
  // Traits (Water)
  l5rStrength7: 2, l5rPerception7: 2,
  // Void
  l5rVoid: 2, l5rCurrentVoid: 2,
  // Derived
  l5rHonor: 0, l5rGlory: 10, l5rStatus: 10,
  l5rInsight: 0, l5rSchoolRank: 1, l5rWounds: 0,
  l5rInitiative: 0, l5rArmorTN: 0,
  // Text fields
  l5rTechniques: '', l5rSkillsText: '', l5rSpells: '', l5rKata: '',
  // Shared
  backstory: '', notes: '', appearanceDesc: '', personalItems: '',
}

const TRAIT_TO_FIELD = {
  'Strength': 'l5rStrength7', 'Stamina': 'l5rStamina7',
  'Willpower': 'l5rWillpower7', 'Intelligence': 'l5rIntelligence7',
  'Perception': 'l5rPerception7', 'Agility': 'l5rAgility',
  'Reflexes': 'l5rReflexes', 'Awareness': 'l5rAwareness',
  'Void': 'l5rVoid',
}

function parseBonusTraits(traitStr) {
  if (!traitStr) return []
  const results = []
  for (const part of traitStr.split(',')) {
    const match = part.trim().match(/\+1\s+(\w+)/)
    if (match) {
      const fieldKey = TRAIT_TO_FIELD[match[1]]
      if (fieldKey) results.push(fieldKey)
    }
  }
  return results
}

const TAB_KEYS = ['tabIdentity', 'tabL5rRings', 'tabL5rSkills', 'tabL5rAdvantages', 'tabL5rTechniques', 'tabL5rSpells', 'tabL5rKata', 'tabL5rEquipment', 'tabL5rCombat', 'tabBackstory', 'tabXpLog', 'tabRulesRef', 'tabDiceRoller']

export default function L5RForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const [searchParams] = useSearchParams()
  const viewMode = searchParams.get('mode') === 'view'
  const guidedMode = searchParams.get('mode') === 'guided'
  const characterId = paramId || null

  useEffect(() => { switchTheme('l5r') }, [])

  const { isAutoCreating } = useAutoCreate(characterId, INITIAL)

  const [tab, setTab] = useState(0)
  const [fields, setFields] = useState(INITIAL)
  const [backgrounds, setBackgrounds] = useState([])
  const [disciplines, setDisciplines] = useState([])
  const [xpLog, setXpLog] = useState([])
  const [newBackground, setNewBackground] = useState({ name: '', level: 1, description: '' })
  const [newAdv, setNewAdv] = useState({ name: '', level: 1, notes: '' })
  const [templateName, setTemplateName] = useState('')
  const [tagInfo, setTagInfo] = useState(null)
  const [combatStance, setCombatStance] = useState('Attack')
  const [equippedArmor, setEquippedArmor] = useState('None')
  const [defenseSkill, setDefenseSkill] = useState(0)
  const [equippedWeapon, setEquippedWeapon] = useState('')
  const [equippedArrow, setEquippedArrow] = useState('Willow Leaf')
  const [spellAffinity, setSpellAffinity] = useState('')
  const [spellDeficiency, setSpellDeficiency] = useState('')
  const [activeKata, setActiveKata] = useState('')
  const [weaponLoadouts, setWeaponLoadouts] = useState([])
  const [equipFilter, setEquipFilter] = useState('all')
  const [advSearch, setAdvSearch] = useState('')
  const [disadvSearch, setDisadvSearch] = useState('')
  const [spellSlotsUsed, setSpellSlotsUsed] = useState({ Air: 0, Earth: 0, Fire: 0, Water: 0, Void: 0 })
  const [spellSearch, setSpellSearch] = useState('')
  const [kataSearch, setKataSearch] = useState('')
  const [conditions, setConditions] = useState(new Set())
  const [newSkillName, setNewSkillName] = useState('')
  const [newSkillRank, setNewSkillRank] = useState(1)
  const [newSkillEmphases, setNewSkillEmphases] = useState([])
  const [editingSkillEmphasis, setEditingSkillEmphasis] = useState(null)
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [actionError, setActionError] = useState(null)

  useEffect(() => {
    if (characterId) loadCharacter()
  }, [characterId])

  async function loadCharacter() {
    try {
      const [charRes, bgRes, discRes, xpRes] = await Promise.all([
        getCharacter(characterId), getBackgrounds(characterId), getDisciplines(characterId),
        getXpLog(characterId),
      ])
      const data = charRes.data
      setFields(prev => {
        const merged = { ...prev }
        for (const key in prev) { if (data[key] !== undefined && data[key] !== null) merged[key] = data[key] }
        return merged
      })
      setBackgrounds(bgRes.data)
      setDisciplines(discRes.data)
      setXpLog(xpRes.data)
    } catch { setSaveError(t('failedToLoad')) }
    finally { setLoading(false) }
  }

  function handleField(name, value) { setFields(prev => ({ ...prev, [name]: typeof value === 'string' ? value : Number(value) })) }
  function handleText(e) { setFields(prev => ({ ...prev, [e.target.name]: e.target.value })) }
  function addToInventory(text) {
    setFields(prev => ({
      ...prev,
      personalItems: prev.personalItems ? prev.personalItems + '\n' + text : text
    }))
  }

  async function handleSave() {
    setSaving(true); setSaveError(null)
    try { await updateCharacter(characterId, fields) }
    catch { setSaveError(t('failedToSave')) }
    finally { setSaving(false) }
  }

  async function handleDoneEditing() { await handleSave(); navigate('/l5r') }

  function loadTemplate(heroName) {
    const h = L5R_HERO_NPCS.find(t => t.name === heroName)
    if (!h) return
    setTemplateName(heroName)
    setFields(prev => ({
      ...prev,
      name: h.name,
      l5rClan: h.clan || '',
      l5rFamily: h.family || '',
      l5rSchool: h.school || '',
      // Fire ring traits
      l5rAgility: h.fire || 2,
      l5rIntelligence7: h.fire || 2,
      // Water ring traits
      l5rStrength7: h.water || 2,
      l5rPerception7: h.water || 2,
      // Earth ring traits
      l5rStamina7: h.earth || 2,
      l5rWillpower7: h.earth || 2,
      // Air ring traits
      l5rReflexes: h.air || 2,
      l5rAwareness: h.air || 2,
      // Void
      l5rVoid: h.void || 2,
      l5rCurrentVoid: h.void || 2,
      // Honor, Glory, Status (stored as tenths in L5R)
      l5rHonor: h.honor != null ? Math.round(h.honor * 10) : 0,
      l5rGlory: h.glory != null ? Math.round(h.glory * 10) : 10,
      l5rStatus: h.status != null ? Math.round(h.status * 10) : 10,
      // Text
      l5rSkillsText: h.skills || '',
      notes: h.notes || '',
    }))
  }

  async function handleAddAdvantage() {
    if (!newAdv.name.trim()) return
    try {
      const hit = L5R_ADVANTAGES.find(a => a.name === newAdv.name)
      const adv = hit ? { name: hit.name, level: typeof hit.cost === 'number' ? hit.cost : newAdv.level, notes: '' } : newAdv
      const res = await addDiscipline(characterId, adv)
      setDisciplines(prev => [...prev, res.data])
      setNewAdv({ name: '', level: 1, notes: '' })
    } catch { setActionError(t('failedToSave')) }
  }

  async function handleAddDisadvantage() {
    if (!newBackground.name.trim()) return
    try {
      const hit = L5R_DISADVANTAGES.find(d => d.name === newBackground.name)
      const disadv = hit
        ? { name: hit.name, level: typeof hit.cost === 'number' ? hit.cost : (newBackground.level || 1), description: '' }
        : newBackground
      const res = await addBackground(characterId, disadv)
      setBackgrounds(prev => [...prev, res.data])
      setNewBackground({ name: '', level: 1, description: '' })
    } catch { setActionError(t('failedToSave')) }
  }

  // ── Computed Ring values ──
  const airRing = Math.min(fields.l5rReflexes, fields.l5rAwareness)
  const earthRing = Math.min(fields.l5rStamina7, fields.l5rWillpower7)
  const fireRing = Math.min(fields.l5rAgility, fields.l5rIntelligence7)
  const waterRing = Math.min(fields.l5rStrength7, fields.l5rPerception7)
  const voidRing = fields.l5rVoid

  // Families filtered by selected clan (catalog format for CatalogSelect)
  const familyCatalog = fields.l5rClan && CLANS[fields.l5rClan] ? CLANS[fields.l5rClan].families : []
  const selectedFamilyData = familyCatalog.find(f => f.value === fields.l5rFamily)
  const selectedSchoolData = fields.l5rSchool ? L5R_SCHOOLS[fields.l5rSchool] : null

  // Schools filtered by selected clan — or ALL schools if "Different School" advantage is taken
  const hasDifferentSchool = disciplines.some(d => d.name === 'Different School')
  const schoolCatalog = (() => {
    if (hasDifferentSchool) {
      // Show all schools from all clans, grouped by clan
      const entries = []
      for (const [clanName, clanData] of Object.entries(CLANS)) {
        for (const s of clanData.schools) {
          const schoolData = L5R_SCHOOLS[s]
          const tag = clanName === fields.l5rClan ? '' : ` [${clanName}]`
          entries.push({
            value: s,
            description: schoolData
              ? `${schoolData.type} — ${schoolData.traits}. Skills: ${schoolData.skills}${tag}`
              : `${s}${tag}`,
          })
        }
      }
      return entries
    }
    return ((fields.l5rClan && CLANS[fields.l5rClan]?.schools) || []).map(s => {
      const schoolData = L5R_SCHOOLS[s]
      return {
        value: s,
        description: schoolData
          ? `${schoolData.type} — ${schoolData.traits}. Skills: ${schoolData.skills}`
          : s,
      }
    })
  })()

  // ── Combat computations ──
  const armorData = L5R_EQUIPMENT.armor.find(a => a.name === equippedArmor)
  const armorATN = armorData ? (typeof armorData.atn === 'number' ? armorData.atn : parseInt(armorData.atn) || 0) : 0
  const armorReduction = armorData ? armorData.reduction : 0
  const baseATN = fields.l5rReflexes * 5 + 5

  let stanceATNmod = 0
  let stanceAttackMod = ''
  let stanceNotes = ''
  if (combatStance === 'Defense') {
    stanceATNmod = airRing + defenseSkill
    stanceNotes = 'Cannot attack. Add Air Ring + Defense Skill to ATN.'
  } else if (combatStance === 'Full Defense') {
    stanceATNmod = Math.ceil((defenseSkill + fields.l5rReflexes) * 2.5)
    stanceNotes = 'Complex Action (roll Defense/Reflexes, add half). Only Free Actions.'
  } else if (combatStance === 'Full Attack') {
    stanceATNmod = -10
    stanceAttackMod = '+2k1'
    stanceNotes = 'May only attack/move closer. +5 ft movement. Cannot use ranged.'
  } else if (combatStance === 'Center') {
    stanceNotes = 'Spend Void Point. Cannot attack. Next turn: +1k1+Void to one roll.'
  }

  const totalATN = baseATN + armorATN + stanceATNmod
  // initRoll is set below after computedSchoolRank is calculated
  const moveFree = waterRing * 5
  const moveSimple = waterRing * 10
  const moveMax = waterRing * 20

  // ── Weapon computations ──
  const ALL_WEAPONS = [
    ...L5R_EQUIPMENT.swords, ...L5R_EQUIPMENT.schoolWeapons,
    ...L5R_EQUIPMENT.polearms, ...L5R_EQUIPMENT.spears,
    ...L5R_EQUIPMENT.heavyWeapons, ...L5R_EQUIPMENT.knives, ...L5R_EQUIPMENT.staves,
    ...L5R_EQUIPMENT.chain, ...L5R_EQUIPMENT.warFans,
  ]
  const selectedWeapon = ALL_WEAPONS.find(w => w.name === equippedWeapon)
  const isBow = L5R_EQUIPMENT.bows.some(b => b.name === equippedWeapon)
  const selectedBow = L5R_EQUIPMENT.bows.find(b => b.name === equippedWeapon)
  const selectedArrow = L5R_EQUIPMENT.arrows.find(a => a.name === equippedArrow)

  // ── Advantage/Disadvantage mechanical effects ──
  const hasAdvantage = name => disciplines.some(d => d.name === name)
  const hasBadHealth = hasAdvantage('Bad Health')
  const hasStrengthOfEarth = hasAdvantage('Strength of the Earth')
  const hasLowPainThreshold = hasAdvantage('Low Pain Threshold')
  const hasQuick = hasAdvantage('Quick')
  const hasLarge = hasAdvantage('Large')
  const hasSmall = hasAdvantage('Small')
  const hasFame = hasAdvantage('Fame')
  const hasInfamous = hasAdvantage('Infamous')
  const hasPerceivedHonor = hasAdvantage('Perceived Honor')
  const hasHandsOfStone = hasAdvantage('Hands of Stone')

  // Wound rank from current wounds
  // Bad Health: Earth Ring treated as 1 lower for wound thresholds
  const woundEarth = hasBadHealth ? Math.max(1, earthRing - 1) : earthRing
  const woundsPerRank = woundEarth * 2
  const healthyThreshold = woundEarth * 5
  const totalWoundCapacity = healthyThreshold + 6 * woundsPerRank
  let currentWoundRank = 'Healthy'
  let currentPenalty = 0
  const w = fields.l5rWounds || 0
  // Strength of the Earth: reduce wound penalties by 3; Low Pain Threshold: increase by 5
  const penaltyMod = (hasStrengthOfEarth ? -3 : 0) + (hasLowPainThreshold ? 5 : 0)
  if (w <= healthyThreshold) { currentWoundRank = 'Healthy'; currentPenalty = 0 }
  else {
    const pastHealthy = w - healthyThreshold
    const rankIndex = Math.min(Math.floor((pastHealthy - 1) / woundsPerRank), 6)
    const basePenalties = [3, 5, 10, 15, 20, 40, 999]
    const names = ['Nicked', 'Grazed', 'Hurt', 'Injured', 'Crippled', 'Down', 'Out']
    currentWoundRank = names[rankIndex] || 'Out'
    const base = basePenalties[rankIndex] || 999
    currentPenalty = base === 999 ? 999 : Math.max(0, base + penaltyMod)
  }

  function adjustWounds(delta) {
    setFields(prev => ({ ...prev, l5rWounds: Math.max(0, (prev.l5rWounds || 0) + delta) }))
  }

  // ── Skill parsing & computations ──
  function parseSkills(text) {
    if (!text) return []
    return text.split('\n').filter(l => l.trim()).map(line => {
      const match = line.match(/^([A-Za-z :'\-]+?)(?:\s*\(([^)]*)\))?\s*(\d+)?\s*$/)
      if (!match) return { raw: line, name: '', emphases: '', rank: 0 }
      return { raw: line, name: match[1].trim(), emphases: match[2] || '', rank: parseInt(match[3]) || 0 }
    }).filter(s => s.name)
  }

  const parsedSkills = parseSkills(fields.l5rSkillsText)
  const totalSkillRanks = parsedSkills.reduce((sum, s) => sum + s.rank, 0)

  function updateSkillEmphases(skillIndex, newEmphases) {
    const lines = (fields.l5rSkillsText || '').split('\n')
    const skill = parsedSkills[skillIndex]
    if (!skill) return
    const lineIndex = lines.findIndex(l => l.trim() === skill.raw.trim())
    if (lineIndex === -1) return
    const emphStr = newEmphases.length > 0 ? ` (${newEmphases.join(', ')})` : ''
    lines[lineIndex] = `${skill.name}${emphStr} ${skill.rank}`
    setFields(prev => ({ ...prev, l5rSkillsText: lines.join('\n') }))
  }

  const TRAIT_VALUES = {
    'Awareness': fields.l5rAwareness, 'Reflexes': fields.l5rReflexes,
    'Stamina': fields.l5rStamina7, 'Willpower': fields.l5rWillpower7,
    'Agility': fields.l5rAgility, 'Intelligence': fields.l5rIntelligence7,
    'Strength': fields.l5rStrength7, 'Perception': fields.l5rPerception7,
    'Void': fields.l5rVoid, 'Various': fields.l5rAwareness, 'Varies': fields.l5rAwareness,
  }

  function handleAddSkill() {
    if (!newSkillName) return
    const emphStr = newSkillEmphases.length > 0 ? ` (${newSkillEmphases.join(', ')})` : ''
    const line = `${newSkillName}${emphStr} ${newSkillRank}`
    const current = fields.l5rSkillsText
    const updated = current ? current + '\n' + line : line
    setFields(prev => ({ ...prev, l5rSkillsText: updated }))
    setNewSkillName('')
    setNewSkillRank(1)
    setNewSkillEmphases([])
  }

  // ── Spell parsing (same pattern as skills) ──
  function parseSpells(text) {
    if (!text) return []
    return text.split('\n').filter(l => l.trim() && !l.trim().startsWith('—')).map(line => {
      const match = line.match(/^(.+?)\s*(?:\(([^)]*)\))?\s*$/)
      if (!match) return { raw: line, name: line.trim(), details: '' }
      return { raw: line, name: match[1].trim(), details: match[2] || '' }
    }).filter(s => s.name)
  }
  const parsedSpells = parseSpells(fields.l5rSpells)

  function handleAddSpell(spell) {
    const line = `${spell.name} (ML ${spell.mastery}, ${spell.element})`
    const current = fields.l5rSpells || ''
    setFields(prev => ({ ...prev, l5rSpells: current ? current + '\n' + line : line }))
  }

  function handleRemoveSpell(index) {
    const lines = (fields.l5rSpells || '').split('\n')
    // Count non-header lines to find the right one
    let nonHeaderIdx = -1
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() && !lines[i].trim().startsWith('—')) {
        nonHeaderIdx++
        if (nonHeaderIdx === index) { lines.splice(i, 1); break }
      }
    }
    setFields(prev => ({ ...prev, l5rSpells: lines.join('\n') }))
  }

  // ── Kata parsing (same pattern) ──
  function parseKata(text) {
    if (!text) return []
    return text.split('\n').filter(l => l.trim()).map(line => line.trim()).filter(Boolean)
  }
  const parsedKata = parseKata(fields.l5rKata)

  function handleAddKata(kata) {
    const line = `${kata.name} (${kata.ring} ${kata.mastery})`
    const current = fields.l5rKata || ''
    setFields(prev => ({ ...prev, l5rKata: current ? current + '\n' + line : line }))
  }

  function handleRemoveKata(index) {
    const lines = (fields.l5rKata || '').split('\n').filter(l => l.trim())
    lines.splice(index, 1)
    setFields(prev => ({ ...prev, l5rKata: lines.join('\n') }))
  }

  function handleRemoveSkill(index) {
    const lines = (fields.l5rSkillsText || '').split('\n')
    lines.splice(index, 1)
    setFields(prev => ({ ...prev, l5rSkillsText: lines.join('\n') }))
  }

  // ── Guided mode XP tracking ──
  const XP_BUDGET = 40
  const advXpSpent = disciplines.reduce((sum, d) => sum + (d.level || 0), 0)
  const disadvXpGained = backgrounds.reduce((sum, b) => sum + (b.level || 0), 0)
  const traitXpSpent = [
    fields.l5rReflexes, fields.l5rAwareness, fields.l5rStamina7, fields.l5rWillpower7,
    fields.l5rAgility, fields.l5rIntelligence7, fields.l5rStrength7, fields.l5rPerception7,
  ].reduce((sum, v) => { let cost = 0; for (let r = 3; r <= (v || 2); r++) cost += r * 4; return sum + cost }, 0)
  const voidXpSpent = (() => { let cost = 0; for (let r = 3; r <= (fields.l5rVoid || 2); r++) cost += r * 6; return cost })()
  const totalXpSpent = traitXpSpent + voidXpSpent + totalSkillRanks + advXpSpent
  const totalXpAvailable = XP_BUDGET + disadvXpGained
  const xpRemaining = totalXpAvailable - totalXpSpent

  // ── Validation warnings ──
  const warnings = []
  const traitFields = ['l5rReflexes', 'l5rAwareness', 'l5rStamina7', 'l5rWillpower7', 'l5rAgility', 'l5rIntelligence7', 'l5rStrength7', 'l5rPerception7']
  for (const f of traitFields) {
    if ((fields[f] || 0) < 2) warnings.push(`${f.replace('l5r', '').replace('7', '')} is below minimum (2)`)
  }
  if ((fields.l5rVoid || 0) < 2) warnings.push('Void is below minimum (2)')
  if (fields.l5rSchool && !fields.l5rClan) warnings.push('School selected without a clan')
  if (fields.l5rClan && !hasDifferentSchool && fields.l5rSchool && CLANS[fields.l5rClan] && !CLANS[fields.l5rClan].schools.includes(fields.l5rSchool)) {
    warnings.push(`${fields.l5rSchool} is not a ${fields.l5rClan} school (need Different School advantage)`)
  }
  for (const s of parsedSkills) {
    if (s.rank > 10) warnings.push(`${s.name} exceeds max skill rank (10)`)
  }

  // ── Auto-computed Insight & School Rank ──
  const computedInsight = (airRing + earthRing + fireRing + waterRing + voidRing) * 10 + totalSkillRanks
  const computedSchoolRank = computedInsight >= 250 ? 5 : computedInsight >= 225 ? 4 : computedInsight >= 200 ? 3 : computedInsight >= 175 ? 2 : 1
  const nextRankInsight = computedSchoolRank === 1 ? 175 : computedSchoolRank === 2 ? 200 : computedSchoolRank === 3 ? 225 : computedSchoolRank === 4 ? 250 : null
  const initRoll = hasQuick
    ? `${computedSchoolRank + 1}k${fields.l5rReflexes}`
    : `${computedSchoolRank}k${fields.l5rReflexes}`

  // ── Skill rank-up/down ──
  function changeSkillRank(skillIndex, delta) {
    const lines = (fields.l5rSkillsText || '').split('\n')
    const skill = parsedSkills[skillIndex]
    if (!skill) return
    const lineIndex = lines.findIndex(l => l.trim() === skill.raw.trim())
    if (lineIndex === -1) return
    const newRank = Math.max(0, Math.min(10, skill.rank + delta))
    const emphStr = skill.emphases ? ` (${skill.emphases})` : ''
    if (newRank === 0) { lines.splice(lineIndex, 1) }
    else { lines[lineIndex] = `${skill.name}${emphStr} ${newRank}` }
    setFields(prev => ({ ...prev, l5rSkillsText: lines.join('\n') }))
  }

  // ── Heritage roll table ──
  const HERITAGE_TABLE = [
    { roll: 1, name: 'Famous Deed', effect: 'Glory +3, heirloom item' },
    { roll: 2, name: 'Glorious Sacrifice', effect: 'Honor +5, Glory +5, lost heirloom' },
    { roll: 3, name: 'Wondrous Work', effect: 'Glory +5, Artisan skill +1' },
    { roll: 4, name: 'Dynasty Builder', effect: 'Glory -3, Social skill +1' },
    { roll: 5, name: 'Discovery', effect: 'Glory +3, Scholar skill +1' },
    { roll: 6, name: 'Ruthless Victor', effect: 'Honor -5, Martial skill +1' },
    { roll: 7, name: 'Elevated for Service', effect: 'Glory -3, Honor +3, Trade skill +1' },
    { roll: 8, name: 'Stolen Knowledge', effect: 'Honor -5, extra technique' },
    { roll: 9, name: 'Imperial Heritage', effect: 'Status +10' },
    { roll: 10, name: 'Unusual Name Origin', effect: 'Glory -3, ring swap or item' },
  ]
  const [heritageResult, setHeritageResult] = useState(null)
  function rollHeritage() {
    const d10a = Math.floor(Math.random() * 10) + 1
    const d10b = Math.floor(Math.random() * 10) + 1
    const entry = HERITAGE_TABLE.find(h => h.roll === d10a)
    setHeritageResult({ roll1: d10a, roll2: d10b, entry })
  }

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/l5r')}>{t('back')}</button>
        <h2>{fields.name || t('editL5rCharacter')}</h2>
        <span className="splat-badge splat-badge--l5r">L5R</span>
        {guidedMode && <span className="splat-badge">{t('guidedCreation')}</span>}
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}
      {actionError && <p className="status-error" role="alert">{actionError}</p>}

      <div className="tab-list" role="tablist">
        {TAB_KEYS.map((tk, i) => (
          <button key={tk} role="tab" id={`tab-${i}`} className={`btn btn-secondary${tab === i ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(i)} aria-selected={tab === i} aria-controls={`tabpanel-${i}`}>{t(tk)}</button>
        ))}
      </div>

      {/* ── Identity ── */}
      <div role="tabpanel" id={`tabpanel-0`} aria-labelledby={`tab-0`} hidden={tab !== 0}>
        <div className="form-section">
          {!viewMode && (
            <fieldset>
              <legend>{t('l5rLoadTemplate')}</legend>
              <CatalogSelect
                id="hero-template" name="heroTemplate" label={t('l5rPremadeSamurai')}
                value={templateName} onChange={(_, val) => loadTemplate(val)}
                catalog={L5R_HERO_CATALOG} placeholder="Search samurai templates..."
                showDescOnSelect={false}
              />
              {templateName && (
                <p className="muted-hint muted-hint--xs" style={{ marginTop: 'var(--space-xs)', color: 'var(--color-accent-fg)' }}>
                  Loaded from template: <strong>{templateName}</strong> — customize freely below.
                </p>
              )}
            </fieldset>
          )}

          <fieldset>
            <legend>{t('tabIdentity')}</legend>
            <div className="field-row">
              <div className="field"><label>{t('charName')} *</label><input name="name" value={fields.name} onChange={handleText} /></div>
              <div className="field"><label>{t('concept')}</label><input name="concept" value={fields.concept} onChange={handleText} /></div>
            </div>
            <div className="field-row">
              <CatalogSelect id="l5rClan" name="l5rClan" label={t('l5rClan')} value={fields.l5rClan}
                onChange={(name, val) => {
                  setFields(prev => {
                    const next = { ...prev, l5rClan: val, l5rFamily: '', l5rSchool: '' }
                    // Revert old family trait bonus
                    const oldFamData = (CLANS[prev.l5rClan]?.families || []).find(f => f.value === prev.l5rFamily)
                    for (const fk of parseBonusTraits(oldFamData?.trait)) {
                      next[fk] = Math.max(2, (prev[fk] || 2) - 1)
                    }
                    // Revert old school trait bonuses
                    const oldSchool = prev.l5rSchool && L5R_SCHOOLS[prev.l5rSchool]
                    for (const fk of parseBonusTraits(oldSchool?.traits)) {
                      next[fk] = Math.max(2, (next[fk] || 2) - 1)
                    }
                    return next
                  })
                }}
                catalog={CLAN_CATALOG} />
              {familyCatalog.length > 0 ? (
                <CatalogSelect id="l5rFamily" name="l5rFamily" label={t('l5rFamily')} value={fields.l5rFamily}
                  onChange={(name, val) => {
                    setFields(prev => {
                      const next = { ...prev, l5rFamily: val }
                      // Revert old family trait bonus
                      const oldFamData = (CLANS[prev.l5rClan]?.families || []).find(f => f.value === prev.l5rFamily)
                      for (const fk of parseBonusTraits(oldFamData?.trait)) {
                        next[fk] = Math.max(2, (prev[fk] || 2) - 1)
                      }
                      // Apply new family trait bonus
                      const newFamData = (CLANS[prev.l5rClan]?.families || []).find(f => f.value === val)
                      for (const fk of parseBonusTraits(newFamData?.trait)) {
                        next[fk] = (next[fk] || 2) + 1
                      }
                      return next
                    })
                  }}
                  catalog={familyCatalog} />
              ) : (
                <div className="field">
                  <label>{t('l5rFamily')}</label>
                  <input name="l5rFamily" value={fields.l5rFamily} onChange={handleText} placeholder="Enter family name..." />
                </div>
              )}
            </div>
            <div className="field-row">
              {schoolCatalog.length > 0 ? (
                <CatalogSelect id="l5rSchool" name="l5rSchool" label={t('l5rSchool')} value={fields.l5rSchool}
                  onChange={(name, val) => {
                    setFields(prev => {
                      const next = { ...prev, l5rSchool: val }
                      // Revert old school trait bonuses
                      const oldSchool = prev.l5rSchool && L5R_SCHOOLS[prev.l5rSchool]
                      for (const fk of parseBonusTraits(oldSchool?.traits)) {
                        next[fk] = Math.max(2, (prev[fk] || 2) - 1)
                      }
                      // Apply new school trait bonuses
                      const newSchool = val && L5R_SCHOOLS[val]
                      for (const fk of parseBonusTraits(newSchool?.traits)) {
                        next[fk] = (next[fk] || 2) + 1
                      }
                      // Auto-fill outfit
                      if (newSchool?.outfit && !prev.personalItems?.trim()) {
                        next.personalItems = newSchool.outfit
                      }
                      // Auto-set honor
                      if (newSchool?.honor != null) {
                        next.l5rHonor = Math.round(newSchool.honor * 10)
                      }
                      return next
                    })
                  }}
                  catalog={schoolCatalog} />
              ) : (
                <div className="field">
                  <label>{t('l5rSchool')}</label>
                  <input name="l5rSchool" value={fields.l5rSchool} onChange={handleText} placeholder="Enter school name..." />
                </div>
              )}
            </div>
            <div className="field-row" style={{ marginTop: 'var(--space-md)' }}>
              <CatalogSelect id="l5rAdvancedSchool" name="l5rAdvancedSchool"
                label={t('l5rAdvancedSchool')} value={fields.l5rAdvancedSchool}
                onChange={handleField} catalog={L5R_ADVANCED_CATALOG}
                placeholder={t('l5rAdvancedSchoolPh')} />
            </div>
            <div className="field-row">
              <CatalogSelect id="l5rAlternativePath" name="l5rAlternativePath"
                label={t('l5rAlternativePath')} value={fields.l5rAlternativePath}
                onChange={handleField} catalog={L5R_ALTERNATIVE_CATALOG}
                placeholder={t('l5rAlternativePathPh')} />
            </div>
            <details style={{ marginTop: 'var(--space-md)' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>Heritage Tables (Optional)</summary>
              <p className="muted-hint muted-hint--xs" style={{ padding: 'var(--space-sm) 0' }}>
                Heritage Tables are an optional mechanic. Roll on your clan's Heritage Table during character creation to discover connections to your family's past. Results may grant bonus skills, items, or plot hooks. Consult your GM and the core rulebook for your clan's specific table.
              </p>
            </details>
          </fieldset>

          {(selectedFamilyData?.trait || selectedSchoolData) && (
            <fieldset>
              <legend>{t('l5rCreationSummary')}</legend>
              <div style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
                {selectedFamilyData?.trait && (
                  <p><strong>{fields.l5rFamily}:</strong> {selectedFamilyData.trait}</p>
                )}
                {selectedSchoolData && (
                  <>
                    <p><strong>{fields.l5rSchool}:</strong> {selectedSchoolData.traits}</p>
                    <p><strong>Starting Skills:</strong> {selectedSchoolData.skills}</p>
                    <p><strong>Honor:</strong> {selectedSchoolData.honor}</p>
                    <p><strong>Starting Outfit:</strong> {selectedSchoolData.outfit}</p>
                  </>
                )}
              </div>
            </fieldset>
          )}
        </div>
      </div>

      {/* ── Rings & Traits ── */}
      <div role="tabpanel" id={`tabpanel-1`} aria-labelledby={`tab-1`} hidden={tab !== 1}>
        <div className="form-section">
          <fieldset>
            <legend>{t('l5rRingsTraits')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Each Ring equals the lower of its two Traits. Starting characters begin with all Traits at 2.
            </p>
            {guidedMode && (
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: 'var(--space-md)', flexWrap: 'wrap', fontSize: '0.85rem', padding: 'var(--space-sm)', background: 'var(--color-surface-raised)', borderRadius: 'var(--radius-sm)' }}>
                <div><strong>XP Budget:</strong> {totalXpAvailable}</div>
                <div><strong>Traits:</strong> <span style={{ color: '#e95' }}>-{traitXpSpent}</span></div>
                <div><strong>Void:</strong> <span style={{ color: '#e95' }}>-{voidXpSpent}</span></div>
                <div><strong>Skills:</strong> <span style={{ color: '#e95' }}>-{totalSkillRanks}</span></div>
                <div><strong>Advantages:</strong> <span style={{ color: '#e95' }}>-{advXpSpent}</span></div>
                <div><strong>Disadvantages:</strong> <span style={{ color: '#8c8' }}>+{disadvXpGained}</span></div>
                <div><strong>Remaining:</strong> <span style={{ color: xpRemaining >= 0 ? '#8c8' : '#e55', fontWeight: 700 }}>{xpRemaining} XP</span></div>
              </div>
            )}
            {guidedMode && (
              <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
                Trait cost: new rank {'\u00d7'} 4 XP (e.g. 2{'\u2192'}3 = 12 XP). Void cost: new rank {'\u00d7'} 6 XP.
              </p>
            )}

            {/* Air */}
            <fieldset style={{ marginBottom: 'var(--space-md)' }}>
              <legend>{t('l5rAir')}: {airRing}</legend>
              <div className="rating-grid">
                <div className="ability-row"><DotRating label={t('l5rReflexes')} name="l5rReflexes" value={fields.l5rReflexes} onChange={handleField} min={2} max={10} /></div>
                <div className="ability-row"><DotRating label={t('l5rAwareness')} name="l5rAwareness" value={fields.l5rAwareness} onChange={handleField} min={2} max={10} /></div>
              </div>
            </fieldset>

            {/* Earth */}
            <fieldset style={{ marginBottom: 'var(--space-md)' }}>
              <legend>{t('l5rEarth')}: {earthRing}</legend>
              <div className="rating-grid">
                <div className="ability-row"><DotRating label={t('l5rStamina')} name="l5rStamina7" value={fields.l5rStamina7} onChange={handleField} min={2} max={10} /></div>
                <div className="ability-row"><DotRating label={t('l5rWillpower')} name="l5rWillpower7" value={fields.l5rWillpower7} onChange={handleField} min={2} max={10} /></div>
              </div>
            </fieldset>

            {/* Fire */}
            <fieldset style={{ marginBottom: 'var(--space-md)' }}>
              <legend>{t('l5rFire')}: {fireRing}</legend>
              <div className="rating-grid">
                <div className="ability-row"><DotRating label={t('l5rAgility')} name="l5rAgility" value={fields.l5rAgility} onChange={handleField} min={2} max={10} /></div>
                <div className="ability-row"><DotRating label={t('l5rIntelligence')} name="l5rIntelligence7" value={fields.l5rIntelligence7} onChange={handleField} min={2} max={10} /></div>
              </div>
            </fieldset>

            {/* Water */}
            <fieldset style={{ marginBottom: 'var(--space-md)' }}>
              <legend>{t('l5rWater')}: {waterRing}</legend>
              <div className="rating-grid">
                <div className="ability-row"><DotRating label={t('l5rStrength')} name="l5rStrength7" value={fields.l5rStrength7} onChange={handleField} min={2} max={10} /></div>
                <div className="ability-row"><DotRating label={t('l5rPerception')} name="l5rPerception7" value={fields.l5rPerception7} onChange={handleField} min={2} max={10} /></div>
              </div>
            </fieldset>

            {/* Void */}
            <fieldset style={{ marginBottom: 'var(--space-md)' }}>
              <legend>{t('l5rVoidRing')}: {voidRing}</legend>
              <div className="rating-grid">
                <div className="ability-row"><DotRating label={t('l5rVoidRing')} name="l5rVoid" value={fields.l5rVoid} onChange={handleField} min={2} max={10} /></div>
                <div className="ability-row"><DotRating label={t('l5rCurrentVoid')} name="l5rCurrentVoid" value={fields.l5rCurrentVoid} onChange={handleField} min={0} max={fields.l5rVoid} /></div>
              </div>
            </fieldset>

            {/* Auto-computed Insight & Rank */}
            <fieldset style={{ marginBottom: 'var(--space-md)', background: 'var(--color-surface-raised)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-md)' }}>
              <legend>Insight & School Rank (Auto-Calculated)</legend>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-md)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Insight</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-accent-fg)' }}>{computedInsight}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Rings {(airRing + earthRing + fireRing + waterRing + voidRing) * 10} + Skills {totalSkillRanks}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>School Rank</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-accent-fg)' }}>{computedSchoolRank}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                    {nextRankInsight ? `Next rank at ${nextRankInsight} insight (need ${nextRankInsight - computedInsight} more)` : 'Maximum rank reached'}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Base ATN</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700 }}>{baseATN}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Reflexes {fields.l5rReflexes} x5 + 5{armorATN > 0 ? ` (+${armorATN} armor) = ${baseATN + armorATN}` : ''}</div>
                </div>
              </div>
            </fieldset>
          </fieldset>
        </div>
      </div>

      {/* ── Skills (Interactive) ── */}
      <div role="tabpanel" id={`tabpanel-2`} aria-labelledby={`tab-2`} hidden={tab !== 2}>
        <div className="form-section">
          {/* Skill Summary */}
          <fieldset>
            <legend>{t('l5rSkillSummary')}</legend>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: 'var(--space-sm)', flexWrap: 'wrap' }}>
              <div><strong>Total Skill Ranks:</strong> {totalSkillRanks}</div>
              <div><strong>Insight from Skills:</strong> {totalSkillRanks}</div>
              <div><strong>Insight from Rings:</strong> {(airRing + earthRing + fireRing + waterRing + voidRing) * 10}</div>
              <div><strong>Total Insight:</strong> <span style={{ color: 'var(--color-accent-fg)', fontWeight: 700 }}>{computedInsight}</span></div>
              <div><strong>School Rank:</strong> <span style={{ color: 'var(--color-accent-fg)', fontWeight: 700 }}>{computedSchoolRank}</span></div>
              {nextRankInsight && <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Next rank at {nextRankInsight} (need {nextRankInsight - computedInsight} more)</div>}
              {guidedMode && <div><strong>Skill XP:</strong> <span style={{ color: '#e95' }}>-{totalSkillRanks}</span> · <strong>Remaining:</strong> <span style={{ color: xpRemaining >= 0 ? '#8c8' : '#e55', fontWeight: 700 }}>{xpRemaining} XP</span></div>}
            </div>
          </fieldset>

          {/* Add Skill Form */}
          <fieldset>
            <legend>{t('l5rAddSkill')}</legend>
            <div className="field-row" style={{ alignItems: 'flex-end' }}>
              <div className="field" style={{ flex: 2 }}>
                <label>{t('skills')}</label>
                <select value={newSkillName} onChange={e => { setNewSkillName(e.target.value); setNewSkillEmphases([]) }} aria-label={t('skills')}>
                  <option value="">Select skill...</option>
                  {Object.entries(L5R_SKILL_MASTERIES).map(([name, data]) => (
                    <option key={name} value={name}>{name} ({data.trait}) — {data.type}</option>
                  ))}
                </select>
              </div>
              <div className="field" style={{ width: 80 }}>
                <label>Rank</label>
                <select value={newSkillRank} onChange={e => setNewSkillRank(parseInt(e.target.value))}>
                  {[1,2,3,4,5,6,7,8,9,10].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <button className="btn btn-secondary" onClick={handleAddSkill}>{t('add')}</button>
            </div>
            {newSkillName && L5R_SKILL_MASTERIES[newSkillName]?.emphases?.length > 0 && (
              <div style={{ marginTop: 'var(--space-sm)' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Emphases (click to add):</label>
                <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap', marginTop: 'var(--space-xs)' }}>
                  {L5R_SKILL_MASTERIES[newSkillName].emphases.map(emp => {
                    const active = newSkillEmphases.includes(emp)
                    return (
                      <button key={emp} type="button"
                        className={`tag${active ? ' tag--active' : ''}`}
                        style={{ cursor: 'pointer', fontSize: '0.78rem', padding: '0.2rem 0.5rem' }}
                        onClick={() => setNewSkillEmphases(prev => active ? prev.filter(e => e !== emp) : [...prev, emp])}>
                        {emp}{active ? ' \u2713' : ''}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </fieldset>

          {/* Active Skills Table */}
          {parsedSkills.length > 0 && (
            <fieldset>
              <legend>{t('l5rActiveSkills')} ({parsedSkills.length})</legend>
              <table className="inv-table">
                <thead>
                  <tr><th>Skill</th><th>Rank</th><th>Roll</th><th>Emphases</th><th>Mastery Unlocked</th><th></th></tr>
                </thead>
                <tbody>
                  {parsedSkills.map((s, i) => {
                    const data = L5R_SKILL_MASTERIES[s.name]
                    const trait = data?.trait || 'Various'
                    const traitVal = TRAIT_VALUES[trait] || 2
                    const roll = `${s.rank + traitVal}k${traitVal}`
                    const typeColor = data?.type === 'High' ? '#6af' : data?.type === 'Bugei' ? 'var(--color-accent-fg)' : data?.type === 'Low' ? '#e55' : 'var(--color-text-muted)'
                    const activeMasteries = []
                    if (data?.masteries) {
                      for (const [rank, desc] of Object.entries(data.masteries)) {
                        if (s.rank >= parseInt(rank)) activeMasteries.push(`R${rank}: ${desc}`)
                      }
                    }
                    return (
                      <Fragment key={i}>
                      <tr>
                        <td style={{ fontWeight: 600 }}><span style={{ color: typeColor, fontSize: '0.7rem', marginRight: '0.3rem' }}>{'\u25CF'}</span>{s.name}</td>
                        <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                          <button onClick={() => changeSkillRank(i, -1)} style={{ padding: '0 4px', fontSize: '0.8rem', cursor: 'pointer', border: 'none', background: 'transparent', color: 'var(--color-text-muted)' }} title="Decrease rank">{'\u2212'}</button>
                          <span style={{ fontWeight: 700, margin: '0 4px' }}>{s.rank}</span>
                          <button onClick={() => changeSkillRank(i, 1)} style={{ padding: '0 4px', fontSize: '0.8rem', cursor: 'pointer', border: 'none', background: 'transparent', color: 'var(--color-text-muted)' }} title="Increase rank">+</button>
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--color-accent-fg)' }}>{s.rank > 0 ? roll : '\u2014'}</td>
                        <td style={{ fontSize: '0.78rem', cursor: 'pointer' }}
                          onClick={() => setEditingSkillEmphasis(editingSkillEmphasis === i ? null : i)}>
                          {s.emphases || <span className="muted-hint">+ Add emphasis</span>}
                        </td>
                        <td className="inv-notes" style={{ fontSize: '0.72rem' }}>{activeMasteries.length > 0 ? activeMasteries.join(' | ') : '\u2014'}</td>
                        <td><button className="tag-remove" onClick={() => handleRemoveSkill(i)} aria-label={`Remove ${s.name}`}>{'\u00d7'}</button></td>
                      </tr>
                      {editingSkillEmphasis === i && (
                        <tr>
                          <td colSpan={6} style={{ background: 'var(--color-surface-raised)', padding: 'var(--space-sm)' }}>
                            {data?.emphases?.length > 0 && (
                              <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
                                {data.emphases.map(emp => {
                                  const currentEmphases = s.emphases ? s.emphases.split(', ').map(e => e.trim()) : []
                                  const active = currentEmphases.includes(emp)
                                  return (
                                    <button key={emp} type="button"
                                      className={`tag${active ? ' tag--active' : ''}`}
                                      style={{ cursor: 'pointer', fontSize: '0.78rem', padding: '0.2rem 0.5rem' }}
                                      onClick={() => {
                                        const updated = active
                                          ? currentEmphases.filter(e => e !== emp)
                                          : [...currentEmphases, emp]
                                        updateSkillEmphases(i, updated)
                                      }}>
                                      {emp}{active ? ' \u2713' : ''}
                                    </button>
                                  )
                                })}
                              </div>
                            )}
                            <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center', marginTop: 'var(--space-xs)' }}>
                              <input type="text" placeholder="Custom emphasis..." style={{ fontSize: '0.78rem', width: '140px' }}
                                onKeyDown={e => {
                                  if (e.key === 'Enter' && e.target.value.trim()) {
                                    const currentEmphases = s.emphases ? s.emphases.split(', ').map(em => em.trim()) : []
                                    updateSkillEmphases(i, [...currentEmphases, e.target.value.trim()])
                                    e.target.value = ''
                                  }
                                }} />
                              <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '2px 8px' }}
                                onClick={() => setEditingSkillEmphasis(null)}>Done</button>
                            </div>
                          </td>
                        </tr>
                      )}
                      </Fragment>
                    )
                  })}
                </tbody>
              </table>
            </fieldset>
          )}

          {/* Raw Textarea */}
          <fieldset>
            <legend>{t('l5rRawSkillData')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}>
              Format: &quot;SkillName (Emphasis1, Emphasis2) Rank&quot;. One per line. Use the Add Skill form above or edit directly.
            </p>
            <textarea name="l5rSkillsText" value={fields.l5rSkillsText} onChange={handleText} rows={8} style={{ width: '100%' }} placeholder={`Kenjutsu (Katana) 3\nEtiquette 2\nInvestigation (Notice) 3\nLore: Bushido 2\nIaijutsu (Focus) 3`} />
          </fieldset>

          {/* Reference (collapsed) */}
          <details>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>Skill Reference & Mastery Abilities</summary>
            {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
              <details key={category} style={{ marginBottom: 'var(--space-sm)', marginLeft: 'var(--space-md)' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{t(category)}</summary>
                <table className="inv-table" style={{ marginTop: 'var(--space-xs)' }}>
                  <thead><tr><th>Skill</th><th>Emphases</th><th>R3</th><th>R5</th><th>R7</th></tr></thead>
                  <tbody>
                    {skills.map(skillLine => {
                      const skillName = skillLine.replace(/ \(.*\)/, '')
                      const data = L5R_SKILL_MASTERIES[skillName]
                      return (
                        <tr key={skillLine}>
                          <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{skillLine}</td>
                          <td className="inv-notes" style={{ fontSize: '0.72rem' }}>{data?.emphases?.join(', ') || '\u2014'}</td>
                          <td className="inv-notes" style={{ fontSize: '0.72rem' }}>{data?.masteries?.[3] || '\u2014'}</td>
                          <td className="inv-notes" style={{ fontSize: '0.72rem' }}>{data?.masteries?.[5] || '\u2014'}</td>
                          <td className="inv-notes" style={{ fontSize: '0.72rem' }}>{data?.masteries?.[7] || '\u2014'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </details>
            ))}
          </details>
        </div>
      </div>

      {/* ── Advantages / Disadvantages ── */}
      <div role="tabpanel" id={`tabpanel-3`} aria-labelledby={`tab-3`} hidden={tab !== 3}>
        <div className="form-section">
          {/* ── Advantages ── */}
          <fieldset>
            <legend>{t('l5rAdvantages')} ({disciplines.length})</legend>
            {guidedMode && (
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: 'var(--space-md)', fontSize: '0.85rem', padding: 'var(--space-sm)', background: 'var(--color-surface-raised)', borderRadius: 'var(--radius-sm)' }}>
                <div><strong>Advantage XP:</strong> <span style={{ color: '#e95' }}>-{advXpSpent}</span></div>
                <div><strong>Disadvantage XP:</strong> <span style={{ color: '#8c8' }}>+{disadvXpGained}</span></div>
                <div><strong>Total Remaining:</strong> <span style={{ color: xpRemaining >= 0 ? '#8c8' : '#e55', fontWeight: 700 }}>{xpRemaining} XP</span></div>
              </div>
            )}
            {disciplines.length > 0 && (
              <ul className="tag-list" style={{ marginBottom: 'var(--space-md)' }}>
                {disciplines.map(d => {
                  const entry = L5R_ADVANTAGES.find(a => a.name.toLowerCase() === d.name.toLowerCase())
                  return (
                    <li key={d.id} className={`tag tag--clickable${d.id === tagInfo?.id ? ' tag--active' : ''}`}
                      onClick={() => setTagInfo(ti => ti?.id === d.id ? null : { ...d, kind: 'advantage' })}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTagInfo(ti => ti?.id === d.id ? null : { ...d, kind: 'advantage' }); } }}
                      role="button" tabIndex={0}>
                      <span>{d.name} ({d.level}pt)</span>
                      <button className="tag-remove" onClick={e => { e.stopPropagation(); removeDiscipline(characterId, d.id); setDisciplines(prev => prev.filter(x => x.id !== d.id)); if (tagInfo?.id === d.id) setTagInfo(null) }}>x</button>
                    </li>
                  )
                })}
              </ul>
            )}
            {tagInfo?.kind === 'advantage' && (() => {
              const entry = L5R_ADVANTAGES.find(a => a.name.toLowerCase() === tagInfo.name.toLowerCase())
              return (
                <aside className="tag-info-panel" style={{ marginBottom: 'var(--space-md)' }}>
                  <button className="tag-info-panel-close" onClick={() => setTagInfo(null)}>{t('close')}</button>
                  <p className="tag-info-panel-name">{tagInfo.name}</p>
                  <p className="tag-info-panel-desc">Advantage · {tagInfo.level} XP</p>
                  {entry && <p style={{ fontSize: '0.82rem', lineHeight: 1.55, color: 'var(--color-text)' }}>{entry.description}</p>}
                </aside>
              )
            })()}
            <div className="catalog-search-wrap">
              <input type="search" value={advSearch} onChange={e => setAdvSearch(e.target.value)}
                placeholder="Search advantages..." aria-label="Search advantages" />
              <span className="catalog-search-count">{L5R_ADVANTAGES.filter(a => a.name.toLowerCase().includes(advSearch.toLowerCase()) || a.description.toLowerCase().includes(advSearch.toLowerCase())).length}</span>
            </div>
            <ul className="catalog-list" aria-label="Advantage catalog">
              {L5R_ADVANTAGES
                .filter(a => a.name.toLowerCase().includes(advSearch.toLowerCase()) || a.description.toLowerCase().includes(advSearch.toLowerCase()))
                .slice(0, 30)
                .map(a => {
                  const already = disciplines.some(d => d.name.toLowerCase() === a.name.toLowerCase())
                  return (
                    <li key={a.name} className={`catalog-item${already ? ' catalog-item--added' : ''}`}>
                      <button className="catalog-item-btn" onClick={() => {
                        if (!already) {
                          const cost = typeof a.cost === 'number' ? a.cost : 1
                          addDiscipline(characterId, { name: a.name, level: cost, notes: '' })
                            .then(res => setDisciplines(prev => [...prev, res.data]))
                            .catch(() => setActionError(t('failedToSave')))
                        } else {
                          const d = disciplines.find(d => d.name.toLowerCase() === a.name.toLowerCase())
                          if (d) setTagInfo(ti => ti?.id === d.id ? null : { ...d, kind: 'advantage' })
                        }
                      }}>
                        <div className="catalog-item-main">
                          <span className="catalog-item-name">{a.name}</span>
                          <span className="catalog-item-desc">{a.description}</span>
                        </div>
                        <div className="catalog-item-meta">
                          <span className="catalog-item-cost">{a.cost}pt</span>
                          {already ? <span className="catalog-item-check">{'\u2713'}</span> : <span className="catalog-item-add">+</span>}
                        </div>
                      </button>
                    </li>
                  )
                })}
            </ul>
          </fieldset>

          <hr className="divider" />

          {/* ── Disadvantages ── */}
          <fieldset>
            <legend>{t('l5rDisadvantages')} ({backgrounds.length})</legend>
            {backgrounds.length > 0 && (
              <ul className="tag-list" style={{ marginBottom: 'var(--space-md)' }}>
                {backgrounds.map(b => (
                  <li key={b.id} className={`tag tag--clickable${b.id === tagInfo?.id ? ' tag--active' : ''}`}
                    onClick={() => setTagInfo(ti => ti?.id === b.id ? null : { ...b, kind: 'disadvantage' })}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTagInfo(ti => ti?.id === b.id ? null : { ...b, kind: 'disadvantage' }); } }}
                    role="button" tabIndex={0}>
                    <span>{b.name} ({b.level}pt){b.description ? ` — ${b.description}` : ''}</span>
                    <button className="tag-remove" onClick={e => { e.stopPropagation(); removeBackground(characterId, b.id); setBackgrounds(prev => prev.filter(x => x.id !== b.id)); if (tagInfo?.id === b.id) setTagInfo(null) }}>x</button>
                  </li>
                ))}
              </ul>
            )}
            {tagInfo?.kind === 'disadvantage' && (() => {
              const entry = L5R_DISADVANTAGES.find(d => d.name.toLowerCase() === tagInfo.name.toLowerCase())
              return (
                <aside className="tag-info-panel" style={{ marginBottom: 'var(--space-md)' }}>
                  <button className="tag-info-panel-close" onClick={() => setTagInfo(null)}>{t('close')}</button>
                  <p className="tag-info-panel-name">{tagInfo.name}</p>
                  <p className="tag-info-panel-desc">Disadvantage · {tagInfo.level} XP{tagInfo.description ? ` · ${tagInfo.description}` : ''}</p>
                  {entry && <p style={{ fontSize: '0.82rem', lineHeight: 1.55, color: 'var(--color-text)' }}>{entry.description}</p>}
                </aside>
              )
            })()}
            <div className="catalog-search-wrap">
              <input type="search" value={disadvSearch} onChange={e => setDisadvSearch(e.target.value)}
                placeholder="Search disadvantages..." aria-label="Search disadvantages" />
              <span className="catalog-search-count">{L5R_DISADVANTAGES.filter(d => d.name.toLowerCase().includes(disadvSearch.toLowerCase()) || d.description.toLowerCase().includes(disadvSearch.toLowerCase())).length}</span>
            </div>
            <ul className="catalog-list" aria-label="Disadvantage catalog">
              {L5R_DISADVANTAGES
                .filter(d => d.name.toLowerCase().includes(disadvSearch.toLowerCase()) || d.description.toLowerCase().includes(disadvSearch.toLowerCase()))
                .slice(0, 30)
                .map(d => {
                  const already = backgrounds.some(b => b.name.toLowerCase() === d.name.toLowerCase())
                  return (
                    <li key={d.name} className={`catalog-item${already ? ' catalog-item--added' : ''}`}>
                      <button className="catalog-item-btn" onClick={() => {
                        if (!already) {
                          const cost = typeof d.cost === 'number' ? d.cost : 1
                          addBackground(characterId, { name: d.name, level: cost, description: '' })
                            .then(res => setBackgrounds(prev => [...prev, res.data]))
                            .catch(() => setActionError(t('failedToSave')))
                        } else {
                          const b = backgrounds.find(b => b.name.toLowerCase() === d.name.toLowerCase())
                          if (b) setTagInfo(ti => ti?.id === b.id ? null : { ...b, kind: 'disadvantage' })
                        }
                      }}>
                        <div className="catalog-item-main">
                          <span className="catalog-item-name">{d.name}</span>
                          <span className="catalog-item-desc">{d.description}</span>
                        </div>
                        <div className="catalog-item-meta">
                          <span className="catalog-item-cost">{d.cost}pt</span>
                          {already ? <span className="catalog-item-check">{'\u2713'}</span> : <span className="catalog-item-add">+</span>}
                        </div>
                      </button>
                    </li>
                  )
                })}
            </ul>
          </fieldset>
        </div>
      </div>

      {/* ── Techniques ── */}
      <div role="tabpanel" id={`tabpanel-4`} aria-labelledby={`tab-4`} hidden={tab !== 4}>
        <div className="form-section">
          {(() => {
            const schoolData = fields.l5rSchool && L5R_SCHOOLS[fields.l5rSchool]
            const schoolRank = computedSchoolRank
            return (
              <>
                {schoolData ? (
                  <fieldset>
                    <legend>{fields.l5rSchool} — Rank {schoolRank}</legend>
                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: 'var(--space-md)', flexWrap: 'wrap', fontSize: '0.82rem' }}>
                      <div><strong>Clan:</strong> {schoolData.clan}</div>
                      <div><strong>Type:</strong> {schoolData.type}</div>
                      <div><strong>Trait:</strong> {schoolData.traits}</div>
                      <div><strong>Honor:</strong> {schoolData.honor}</div>
                      <div><strong>Insight:</strong> <span style={{ color: 'var(--color-accent-fg)', fontWeight: 700 }}>{computedInsight}</span></div>
                      {nextRankInsight && <div style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Next rank at {nextRankInsight} insight ({nextRankInsight - computedInsight} more needed)</div>}
                    </div>
                    <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-md)' }}>
                      <strong>Skills:</strong> {schoolData.skills}
                    </p>
                    <table className="inv-table">
                      <thead>
                        <tr><th>Rank</th><th>Technique</th><th>Effect</th></tr>
                      </thead>
                      <tbody>
                        {schoolData.techniques.map(tech => {
                          const unlocked = tech.rank <= schoolRank
                          const isNext = tech.rank === schoolRank + 1
                          const insightNeeded = tech.rank === 2 ? 175 : tech.rank === 3 ? 200 : tech.rank === 4 ? 225 : tech.rank === 5 ? 250 : null
                          return (
                            <tr key={tech.rank} style={{ opacity: unlocked ? 1 : isNext ? 0.6 : 0.3, background: unlocked ? 'rgba(194,145,56,0.05)' : isNext ? 'rgba(194,145,56,0.02)' : 'transparent' }}>
                              <td style={{ fontWeight: 700, color: unlocked ? 'var(--color-accent-fg)' : 'var(--color-text-muted)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                {tech.rank} {unlocked ? '\u2713' : ''}
                              </td>
                              <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                                {tech.name}
                                {isNext && insightNeeded && <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 400, marginLeft: '0.5rem' }}>Unlocks at Insight {insightNeeded}</span>}
                              </td>
                              <td className="inv-notes">{unlocked || isNext ? tech.effect : <span style={{ fontStyle: 'italic' }}>Locked</span>}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </fieldset>
                ) : (
                  <fieldset>
                    <legend>{t('l5rTechniques')}</legend>
                    <p className="muted-hint" style={{ paddingBottom: 0 }}>
                      Select a School on the Identity tab to see your techniques here.
                    </p>
                  </fieldset>
                )}

                {fields.l5rAdvancedSchool && L5R_ADVANCED_SCHOOLS[fields.l5rAdvancedSchool] && (() => {
                  const adv = L5R_ADVANCED_SCHOOLS[fields.l5rAdvancedSchool]
                  return (
                    <fieldset>
                      <legend>{fields.l5rAdvancedSchool} (Advanced School)</legend>
                      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: 'var(--space-md)', flexWrap: 'wrap', fontSize: '0.82rem' }}>
                        <div><strong>Clan:</strong> {adv.clan}</div>
                        <div><strong>Type:</strong> {adv.type}</div>
                        <div><strong>Requirements:</strong> {adv.requirements}</div>
                        <div><strong>Honor:</strong> {adv.honor}</div>
                      </div>
                      <table className="inv-table">
                        <thead><tr><th>Rank</th><th>Technique</th><th>Effect</th></tr></thead>
                        <tbody>
                          {adv.techniques.map(tech => (
                            <tr key={tech.rank} style={{ background: 'rgba(194,145,56,0.05)' }}>
                              <td style={{ fontWeight: 700, color: 'var(--color-accent-fg)', textAlign: 'center' }}>{tech.rank}</td>
                              <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{tech.name}</td>
                              <td className="inv-notes">{tech.effect}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </fieldset>
                  )
                })()}

                {fields.l5rAlternativePath && L5R_ALTERNATIVE_PATHS[fields.l5rAlternativePath] && (() => {
                  const alt = L5R_ALTERNATIVE_PATHS[fields.l5rAlternativePath]
                  return (
                    <fieldset>
                      <legend>{fields.l5rAlternativePath} (Alternative Path)</legend>
                      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: 'var(--space-md)', flexWrap: 'wrap', fontSize: '0.82rem' }}>
                        <div><strong>Clan:</strong> {alt.clan}</div>
                        <div><strong>Type:</strong> {alt.type}</div>
                        <div><strong>Requirements:</strong> {alt.requirements}</div>
                        <div><strong>Honor:</strong> {alt.honor}</div>
                        {alt.traits !== 'None' && <div><strong>Trait:</strong> {alt.traits}</div>}
                        {alt.skills !== 'None' && <div><strong>Skills:</strong> {alt.skills}</div>}
                      </div>
                      <table className="inv-table">
                        <thead><tr><th>Rank</th><th>Technique</th><th>Effect</th></tr></thead>
                        <tbody>
                          {alt.techniques.map(tech => (
                            <tr key={tech.rank} style={{ background: 'rgba(194,145,56,0.05)' }}>
                              <td style={{ fontWeight: 700, color: 'var(--color-accent-fg)', textAlign: 'center' }}>{tech.rank}</td>
                              <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{tech.name}</td>
                              <td className="inv-notes">{tech.effect}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </fieldset>
                  )
                })()}

                <fieldset>
                  <legend>{t('l5rTechNotes')}</legend>
                  <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}>
                    Record additional details, house-ruled modifications, or techniques from alternate/advanced schools.
                  </p>
                  <textarea name="l5rTechniques" value={fields.l5rTechniques} onChange={handleText} rows={6} style={{ width: '100%' }} placeholder="Additional technique notes..." />
                </fieldset>

                {!schoolData && (
                  <details>
                    <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>Browse All Schools</summary>
                    {CLAN_NAMES.filter(c => CLANS[c].schools.length > 0).map(clan => (
                      <details key={clan} style={{ marginLeft: 'var(--space-md)', marginBottom: 'var(--space-xs)' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{clan} ({CLANS[clan].schools.length})</summary>
                        {CLANS[clan].schools.map(s => {
                          const sd = L5R_SCHOOLS[s]
                          if (!sd) return null
                          return (
                            <details key={s} style={{ marginLeft: 'var(--space-md)', marginBottom: 'var(--space-xs)' }}>
                              <summary style={{ cursor: 'pointer', fontSize: '0.82rem' }}>{s} — {sd.type} ({sd.traits}, Honor {sd.honor})</summary>
                              <table className="inv-table" style={{ marginTop: 'var(--space-xs)', marginBottom: 'var(--space-sm)' }}>
                                <tbody>
                                  {sd.techniques.map(t => (
                                    <tr key={t.rank}>
                                      <td style={{ fontWeight: 700, color: 'var(--color-accent-fg)', width: 30 }}>{t.rank}</td>
                                      <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{t.name}</td>
                                      <td className="inv-notes" style={{ fontSize: '0.72rem' }}>{t.effect}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </details>
                          )
                        })}
                      </details>
                    ))}
                  </details>
                )}
              </>
            )
          })()}
        </div>
      </div>

      {/* ── Spells (Interactive) ── */}
      <div role="tabpanel" id={`tabpanel-5`} aria-labelledby={`tab-5`} hidden={tab !== 5}>
        <div className="form-section">
          {/* ── Casting Dashboard ── */}
          <fieldset>
            <legend>{t('l5rSpellCastDash')}</legend>
            <div className="field-row">
              <div className="field">
                <label>{t('l5rAffinityElement')}</label>
                <select value={spellAffinity} onChange={e => setSpellAffinity(e.target.value)} aria-label={t('l5rAffinityElement')}>
                  <option value="">None</option>
                  {['Air', 'Earth', 'Fire', 'Water', 'Void'].map(el => <option key={el} value={el}>{t(el)}</option>)}
                </select>
              </div>
              <div className="field">
                <label>{t('l5rDeficiencyElement')}</label>
                <select value={spellDeficiency} onChange={e => setSpellDeficiency(e.target.value)} aria-label={t('l5rDeficiencyElement')}>
                  <option value="">None</option>
                  {['Air', 'Earth', 'Fire', 'Water', 'Void'].map(el => <option key={el} value={el}>{t(el)}</option>)}
                </select>
              </div>
            </div>
            <table className="inv-table" style={{ marginTop: 'var(--space-sm)' }}>
              <thead>
                <tr><th>Element</th><th>Ring</th><th>Casting</th><th>Slots</th><th>Used</th><th></th></tr>
              </thead>
              <tbody>
                {[
                  { name: 'Air', ring: airRing },
                  { name: 'Earth', ring: earthRing },
                  { name: 'Fire', ring: fireRing },
                  { name: 'Water', ring: waterRing },
                  { name: 'Void', ring: voidRing },
                ].map(el => {
                  const isAff = spellAffinity === el.name
                  const isDef = spellDeficiency === el.name
                  const totalSlots = el.ring + computedSchoolRank + (isAff ? 1 : 0) + (isDef ? -1 : 0)
                  const used = spellSlotsUsed[el.name] || 0
                  const remaining = Math.max(0, totalSlots - used)
                  return (
                    <tr key={el.name} style={{ background: isAff ? 'rgba(136,204,136,0.08)' : isDef ? 'rgba(224,85,85,0.08)' : 'transparent' }}>
                      <td style={{ fontWeight: 600 }}>
                        {el.name}
                        {isAff && <span style={{ color: '#8c8', fontSize: '0.7rem' }}> ★</span>}
                        {isDef && <span style={{ color: '#e55', fontSize: '0.7rem' }}> ✗</span>}
                      </td>
                      <td>{el.ring}</td>
                      <td style={{ fontWeight: 600 }}>{el.ring + computedSchoolRank}k{el.ring}</td>
                      <td style={{ fontWeight: 600, color: remaining === 0 && used > 0 ? '#e55' : 'var(--color-text)' }}>
                        {remaining}/{totalSlots}
                      </td>
                      <td style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                        <button type="button" className="tag-remove" style={{ opacity: used <= 0 ? 0.3 : 1 }}
                          onClick={() => setSpellSlotsUsed(prev => ({ ...prev, [el.name]: Math.max(0, prev[el.name] - 1) }))}
                          disabled={used <= 0}>-</button>
                        <span style={{ minWidth: 20, textAlign: 'center', fontSize: '0.85rem', fontWeight: 600 }}>{used}</span>
                        <button type="button" className="tag-remove" style={{ opacity: remaining <= 0 ? 0.3 : 1 }}
                          onClick={() => setSpellSlotsUsed(prev => ({ ...prev, [el.name]: prev[el.name] + 1 }))}
                          disabled={remaining <= 0}>+</button>
                      </td>
                      <td></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-xs)' }}>
              <button type="button" className="dice-roller-clear" onClick={() => setSpellSlotsUsed({ Air: 0, Earth: 0, Fire: 0, Water: 0, Void: 0 })}>
                Reset Slots
              </button>
            </div>
          </fieldset>

          {/* ── Known Spells ── */}
          <fieldset>
            <legend>{t('l5rKnownSpells')} ({parsedSpells.length})</legend>
            {parsedSpells.length > 0 ? (
              <table className="inv-table">
                <thead><tr><th>Spell</th><th>Details</th><th></th></tr></thead>
                <tbody>
                  {parsedSpells.map((s, i) => {
                    const catalogMatch = L5R_SPELLS.find(sp => s.name.toLowerCase().includes(sp.name.toLowerCase()))
                    return (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>
                          {catalogMatch && <span style={{ color: 'var(--color-accent-fg)', fontSize: '0.7rem', marginRight: '0.3rem' }}>{'\u25CF'}</span>}
                          {s.name}
                        </td>
                        <td className="inv-notes" style={{ fontSize: '0.78rem' }}>
                          {s.details || (catalogMatch ? `ML ${catalogMatch.mastery}, ${catalogMatch.element} — ${catalogMatch.description}` : '')}
                        </td>
                        <td><button className="tag-remove" onClick={() => handleRemoveSpell(i)} aria-label={`Remove ${s.name}`}>{'\u00d7'}</button></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <p className="muted-hint muted-hint--xs">No spells added yet. Use the catalogue below to add spells, or edit the raw data directly.</p>
            )}
          </fieldset>

          {/* ── Spell Catalogue (searchable, click to add) ── */}
          <fieldset>
            <legend>{t('l5rSpellCatalogue')} ({L5R_SPELLS.length})</legend>
            <div className="catalog-search-wrap">
              <input type="search" value={spellSearch} onChange={e => setSpellSearch(e.target.value)}
                placeholder="Search spells by name, element, or effect..." aria-label="Search spells" />
              <span className="catalog-search-count">
                {L5R_SPELLS.filter(s => {
                  const q = spellSearch.toLowerCase()
                  return !q || s.name.toLowerCase().includes(q) || s.element.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
                }).length}
              </span>
            </div>

            {spellSearch ? (
              <ul className="catalog-list" aria-label="Spell search results">
                {L5R_SPELLS
                  .filter(s => {
                    const q = spellSearch.toLowerCase()
                    return s.name.toLowerCase().includes(q) || s.element.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
                  })
                  .slice(0, 30)
                  .map(s => {
                    const ringMap = { Air: airRing, Earth: earthRing, Fire: fireRing, Water: waterRing, Void: voidRing }
                    const canCast = s.mastery <= (ringMap[s.element] || 2) + (computedSchoolRank)
                    const already = parsedSpells.some(p => p.name.toLowerCase().includes(s.name.toLowerCase()))
                    const isAff = spellAffinity === s.element
                    const isDef = spellDeficiency === s.element
                    return (
                      <li key={s.name} className={`catalog-item${already ? ' catalog-item--added' : ''}`}>
                        <button className="catalog-item-btn" onClick={() => { if (!already) handleAddSpell(s) }}>
                          <div className="catalog-item-main">
                            <span className="catalog-item-name">
                              {s.name}
                              {!canCast && <span style={{ color: '#e55', fontSize: '0.72rem', marginLeft: '0.3rem' }}>(too high)</span>}
                            </span>
                            <span className="catalog-item-desc">{s.description}</span>
                          </div>
                          <div className="catalog-item-meta">
                            <span className="catalog-item-cost" style={{ color: isAff ? '#8c8' : isDef ? '#e55' : undefined }}>
                              {s.element} {s.mastery} — {s.mastery} XP
                            </span>
                            {already ? <span className="catalog-item-check">{'\u2713'}</span> : <span className="catalog-item-add">+</span>}
                          </div>
                        </button>
                      </li>
                    )
                  })}
              </ul>
            ) : (
              ['Air', 'Earth', 'Fire', 'Water', 'Void'].map(elem => {
                const ringMap = { Air: airRing, Earth: earthRing, Fire: fireRing, Water: waterRing, Void: voidRing }
                const ring = ringMap[elem]
                const castMax = ring + (computedSchoolRank)
                const elemSpells = L5R_SPELLS.filter(s => s.element === elem)
                const isAff = spellAffinity === elem
                const isDef = spellDeficiency === elem
                return (
                  <details key={elem} style={{ marginBottom: 'var(--space-sm)' }}>
                    <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: isAff ? '#8c8' : isDef ? '#e55' : 'var(--color-accent-fg)' }}>
                      {elem} ({elemSpells.length}) — Cast {ring + (computedSchoolRank)}k{ring}
                      {isAff && ' ★ Affinity'}{isDef && ' ✗ Deficiency'}
                    </summary>
                    <ul className="catalog-list" aria-label={`${elem} spells`}>
                      {elemSpells.map(s => {
                        const canCast = s.mastery <= castMax
                        const already = parsedSpells.some(p => p.name.toLowerCase().includes(s.name.toLowerCase()))
                        return (
                          <li key={s.name} className={`catalog-item${already ? ' catalog-item--added' : ''}`} style={{ opacity: canCast ? 1 : 0.5 }}>
                            <button className="catalog-item-btn" onClick={() => { if (!already) handleAddSpell(s) }}>
                              <div className="catalog-item-main">
                                <span className="catalog-item-name">{s.name}</span>
                                <span className="catalog-item-desc">{s.description}</span>
                              </div>
                              <div className="catalog-item-meta">
                                <span className="catalog-item-cost">ML {s.mastery} — {s.mastery} XP</span>
                                {already ? <span className="catalog-item-check">{'\u2713'}</span> : canCast ? <span className="catalog-item-add">+</span> : <span style={{ color: '#e55', fontSize: '0.7rem' }}>{'\u2717'}</span>}
                              </div>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </details>
                )
              })
            )}
          </fieldset>

          {/* ── Raw Data ── */}
          <details>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>Raw Spell Data</summary>
            <textarea name="l5rSpells" value={fields.l5rSpells} onChange={handleText} rows={8} style={{ width: '100%', marginTop: 'var(--space-sm)' }} placeholder="Spells are added from the catalogue above. You can also edit directly here." />
          </details>

          {/* ── References (collapsed) ── */}
          <details style={{ marginTop: 'var(--space-md)' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>Kiho Reference (Monks)</summary>
            <div style={{ padding: 'var(--space-sm) 0' }}>
              <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}><strong>Cost:</strong> Mastery Level in XP. Requires Ring + School Rank {'\u2265'} Mastery Level.</p>
              <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}><strong>Types:</strong> Internal (self-buff), Kharmic (non-offensive), Martial (via unarmed strike), Mystical (supernatural).</p>
              <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}><strong>Limits:</strong> One each of Internal/Kharmic/Mystical active. Multiple Martial allowed but one per strike.</p>
              <p className="muted-hint muted-hint--xs"><strong>Non-Brotherhood:</strong> Tattoo orders pay 1.5x. Shugenja pay 2x, use Ring only.</p>
            </div>
          </details>

          <details>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: '#e55' }}>Maho — Blood Magic (Forbidden)</summary>
            <div style={{ padding: 'var(--space-sm) 0' }}>
              <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}><strong>Casting:</strong> Inflict Wounds = ML {'\u00d7'} 5 on self or target. No spell slots needed.</p>
              <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}><strong>Taint:</strong> +1 Shadowlands Taint per casting. Cumulative, cannot be removed.</p>
              <p className="muted-hint muted-hint--xs"><strong>Consequences:</strong> Capital offense. Immediate execution on discovery.</p>
            </div>
          </details>
        </div>
      </div>

      {/* ── Kata Catalogue ── */}
      <div role="tabpanel" id={`tabpanel-6`} aria-labelledby={`tab-6`} hidden={tab !== 6}>
        <div className="form-section">
          {/* ── Active Kata ── */}
          <fieldset>
            <legend>{t('l5rActiveKata')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Executing a Kata is a Simple Action. Only one may be active at a time. Select from your known kata.
            </p>
            <div className="field-row">
              <div className="field" style={{ flex: 2 }}>
                <label>{t('l5rCurrentlyActive')}</label>
                <select value={activeKata} onChange={e => setActiveKata(e.target.value)} aria-label={t('l5rActiveKata')}>
                  <option value="">None</option>
                  {parsedKata.map((line, i) => {
                    const match = L5R_KATA.find(k => line.toLowerCase().includes(k.name.toLowerCase()))
                    return <option key={i} value={match?.name || line}>{line}</option>
                  })}
                </select>
              </div>
            </div>
            {activeKata && (() => {
              const kata = L5R_KATA.find(k => k.name === activeKata)
              if (!kata) return null
              return (
                <div className="form-section" style={{ padding: 'var(--space-md)', marginTop: 'var(--space-sm)', marginBottom: 0, background: 'rgba(194,145,56,0.08)', borderLeft: '3px solid var(--color-accent-fg)' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-xs)' }}>{kata.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xs)' }}>{kata.ring} {kata.mastery} | {kata.schools}</div>
                  <div style={{ fontSize: '0.9rem' }}>{kata.effect}</div>
                </div>
              )
            })()}
          </fieldset>

          {/* ── Known Kata List ── */}
          <fieldset>
            <legend>{t('l5rKnownKata')} ({parsedKata.length})</legend>
            {parsedKata.length > 0 ? (
              <table className="inv-table">
                <thead><tr><th>Kata</th><th>Details</th><th></th></tr></thead>
                <tbody>
                  {parsedKata.map((line, i) => {
                    const match = L5R_KATA.find(k => line.toLowerCase().includes(k.name.toLowerCase()))
                    return (
                      <tr key={i} style={{ background: activeKata === match?.name ? 'rgba(194,145,56,0.08)' : 'transparent' }}>
                        <td style={{ fontWeight: 600 }}>
                          {match && <span style={{ color: 'var(--color-accent-fg)', fontSize: '0.7rem', marginRight: '0.3rem' }}>{'\u25CF'}</span>}
                          {match?.name || line}
                        </td>
                        <td className="inv-notes" style={{ fontSize: '0.78rem' }}>
                          {match ? `${match.ring} ${match.mastery} — ${match.effect}` : ''}
                        </td>
                        <td><button className="tag-remove" onClick={() => handleRemoveKata(i)}>{'\u00d7'}</button></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <p className="muted-hint muted-hint--xs">No kata learned yet. Browse the catalogue below to add kata.</p>
            )}
          </fieldset>

          {/* ── Kata Catalogue (searchable) ── */}
          <fieldset>
            <legend>{t('l5rKataCatalogue')} ({L5R_KATA.length})</legend>
            <div className="catalog-search-wrap">
              <input type="search" value={kataSearch} onChange={e => setKataSearch(e.target.value)}
                placeholder="Search kata by name, ring, school, or effect..." aria-label="Search kata" />
              <span className="catalog-search-count">
                {L5R_KATA.filter(k => {
                  const q = kataSearch.toLowerCase()
                  return !q || k.name.toLowerCase().includes(q) || k.ring.toLowerCase().includes(q) || k.schools.toLowerCase().includes(q) || k.effect.toLowerCase().includes(q)
                }).length}
              </span>
            </div>

            {kataSearch ? (
              <ul className="catalog-list" aria-label="Kata search results">
                {L5R_KATA
                  .filter(k => {
                    const q = kataSearch.toLowerCase()
                    return k.name.toLowerCase().includes(q) || k.ring.toLowerCase().includes(q) || k.schools.toLowerCase().includes(q) || k.effect.toLowerCase().includes(q)
                  })
                  .slice(0, 30)
                  .map(k => {
                    const ringVal = k.ring === 'Air' ? airRing : k.ring === 'Earth' ? earthRing : k.ring === 'Fire' ? fireRing : k.ring === 'Water' ? waterRing : voidRing
                    const qualified = ringVal >= k.mastery
                    const already = parsedKata.some(line => line.toLowerCase().includes(k.name.toLowerCase()))
                    return (
                      <li key={k.name} className={`catalog-item${already ? ' catalog-item--added' : ''}`} style={{ opacity: qualified ? 1 : 0.5 }}>
                        <button className="catalog-item-btn" onClick={() => { if (!already && qualified) handleAddKata(k) }}>
                          <div className="catalog-item-main">
                            <span className="catalog-item-name">{k.name} <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>— {k.schools}</span></span>
                            <span className="catalog-item-desc">{k.effect}</span>
                          </div>
                          <div className="catalog-item-meta">
                            <span className="catalog-item-cost">{k.ring} {k.mastery} — {k.mastery} XP</span>
                            {already ? <span className="catalog-item-check">{'\u2713'}</span> : qualified ? <span className="catalog-item-add">+</span> : <span style={{ color: '#e55', fontSize: '0.7rem' }}>{'\u2717'}</span>}
                          </div>
                        </button>
                      </li>
                    )
                  })}
              </ul>
            ) : (
              ['Air', 'Earth', 'Fire', 'Water', 'Void'].map(ringName => {
                const katas = L5R_KATA.filter(k => k.ring === ringName)
                if (katas.length === 0) return null
                const ringVal = ringName === 'Air' ? airRing : ringName === 'Earth' ? earthRing : ringName === 'Fire' ? fireRing : ringName === 'Water' ? waterRing : voidRing
                return (
                  <details key={ringName} style={{ marginBottom: 'var(--space-sm)' }}>
                    <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>
                      {ringName} Kata ({katas.length}) — Ring: {ringVal}
                    </summary>
                    <ul className="catalog-list" aria-label={`${ringName} kata`}>
                      {katas.map(k => {
                        const qualified = ringVal >= k.mastery
                        const already = parsedKata.some(line => line.toLowerCase().includes(k.name.toLowerCase()))
                        return (
                          <li key={k.name} className={`catalog-item${already ? ' catalog-item--added' : ''}`} style={{ opacity: qualified ? 1 : 0.5 }}>
                            <button className="catalog-item-btn" onClick={() => { if (!already && qualified) handleAddKata(k) }}>
                              <div className="catalog-item-main">
                                <span className="catalog-item-name">{k.name} <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>— {k.schools}</span></span>
                                <span className="catalog-item-desc">{k.effect}</span>
                              </div>
                              <div className="catalog-item-meta">
                                <span className="catalog-item-cost">ML {k.mastery} — {k.mastery} XP</span>
                                {already ? <span className="catalog-item-check">{'\u2713'}</span> : qualified ? <span className="catalog-item-add">+</span> : <span style={{ color: '#e55', fontSize: '0.7rem' }}>{'\u2717'}</span>}
                              </div>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </details>
                )
              })
            )}
          </fieldset>

          {/* ── Raw Data ── */}
          <details>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>Raw Kata Data</summary>
            <textarea name="l5rKata" value={fields.l5rKata} onChange={handleText} rows={5} style={{ width: '100%', marginTop: 'var(--space-sm)' }} placeholder="Kata are added from the catalogue above. Edit directly here if needed." />
          </details>
        </div>
      </div>

      {/* ── Equipment (tab 7) ── */}
      <div role="tabpanel" id={`tabpanel-7`} aria-labelledby={`tab-7`} hidden={tab !== 7}>
        <div className="form-section">
          {/* ── Loadout Dashboard ── */}
          <fieldset>
            <legend>{t('l5rLoadoutDash')}</legend>
            <div className="field-row">
              <div className="field" style={{ flex: 2 }}>
                <label>{t('l5rEquippedWeapon')}</label>
                <select value={equippedWeapon} onChange={e => setEquippedWeapon(e.target.value)} aria-label={t('l5rEquippedWeapon')}>
                  <option value="">None</option>
                  <optgroup label="School & Ancestral Weapons">
                    {L5R_EQUIPMENT.schoolWeapons.map(w => <option key={w.name} value={w.name}>{w.name} ({w.dr})</option>)}
                  </optgroup>
                  <optgroup label="Swords">
                    {L5R_EQUIPMENT.swords.map(w => <option key={w.name} value={w.name}>{w.name} ({w.dr})</option>)}
                  </optgroup>
                  <optgroup label="Polearms & Spears">
                    {[...L5R_EQUIPMENT.polearms, ...L5R_EQUIPMENT.spears].map(w => <option key={w.name} value={w.name}>{w.name} ({w.dr})</option>)}
                  </optgroup>
                  <optgroup label="Heavy Weapons">
                    {L5R_EQUIPMENT.heavyWeapons.map(w => <option key={w.name} value={w.name}>{w.name} ({w.dr})</option>)}
                  </optgroup>
                  <optgroup label="Other Melee">
                    {[...L5R_EQUIPMENT.knives, ...L5R_EQUIPMENT.staves, ...L5R_EQUIPMENT.chain, ...L5R_EQUIPMENT.warFans].map(w => <option key={w.name} value={w.name}>{w.name} ({w.dr})</option>)}
                  </optgroup>
                  <optgroup label="Bows">
                    {L5R_EQUIPMENT.bows.map(b => <option key={b.name} value={b.name}>{b.name} ({b.dr})</option>)}
                  </optgroup>
                </select>
              </div>
              <div className="field">
                <label>{t('l5rEquippedArmor')}</label>
                <select value={equippedArmor} onChange={e => setEquippedArmor(e.target.value)} aria-label={t('l5rEquippedArmor')}>
                  <option value="None">None (No Armor)</option>
                  {L5R_EQUIPMENT.armor.map(a => <option key={a.name} value={a.name}>{a.name} (+{typeof a.atn === 'number' ? a.atn : a.atn} ATN, Red {a.reduction})</option>)}
                </select>
              </div>
              {isBow && (
                <div className="field">
                  <label>{t('l5rArrowType')}</label>
                  <select value={equippedArrow} onChange={e => setEquippedArrow(e.target.value)} aria-label={t('l5rArrowType')}>
                    {L5R_EQUIPMENT.arrows.map(a => <option key={a.name} value={a.name}>{a.name} ({a.dr})</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Quick-Swap Loadouts */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', alignItems: 'center', marginTop: 'var(--space-sm)' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Loadouts:</span>
              {[0, 1, 2].map(i => {
                const loadout = weaponLoadouts[i]
                const isCurrent = loadout && loadout.weapon === equippedWeapon && loadout.armor === equippedArmor
                return (
                  <button key={i} type="button"
                    style={{
                      padding: '0.25rem 0.6rem', fontSize: '0.75rem', borderRadius: 'var(--radius)',
                      cursor: 'pointer', border: '1px solid',
                      borderColor: isCurrent ? 'var(--color-accent)' : 'var(--color-border)',
                      background: isCurrent ? 'rgba(194,145,56,0.12)' : 'transparent',
                      color: loadout ? 'var(--color-text)' : 'var(--color-text-muted)',
                      fontWeight: isCurrent ? 600 : 400,
                    }}
                    onClick={() => {
                      if (loadout) {
                        setEquippedWeapon(loadout.weapon)
                        setEquippedArmor(loadout.armor)
                        if (loadout.arrow) setEquippedArrow(loadout.arrow)
                      }
                    }}
                    title={loadout ? `${loadout.weapon || 'Unarmed'} / ${loadout.armor}` : 'Empty slot — save current loadout'}>
                    {loadout ? (loadout.weapon ? loadout.weapon.split(' ')[0] : 'Unarmed') : `Slot ${i + 1}`}
                  </button>
                )
              })}
              <button type="button" className="dice-roller-clear"
                onClick={() => {
                  const empty = weaponLoadouts.findIndex((l, i) => i < 3 && !l)
                  const idx = empty >= 0 ? empty : weaponLoadouts.length < 3 ? weaponLoadouts.length : 2
                  setWeaponLoadouts(prev => {
                    const next = [...prev]
                    next[idx] = { weapon: equippedWeapon, armor: equippedArmor, arrow: equippedArrow }
                    return next.slice(0, 3)
                  })
                }}>
                Save Current
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
              {/* Damage card */}
              <div className="form-section" style={{ padding: 'var(--space-md)', textAlign: 'center', marginBottom: 0 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Damage</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>
                  {(() => {
                    const sizeMod = (hasLarge ? 1 : 0) + (hasSmall ? -1 : 0)
                    if (isBow && selectedBow && selectedArrow) {
                      const bowStr = parseInt((selectedBow.dr.match(/Str\s*(\d+)/) || [])[1]) || 0
                      const arrowMatch = selectedArrow.dr.match(/(\d+)k(\d+)/)
                      if (arrowMatch) {
                        const arrowRolled = parseInt(arrowMatch[1])
                        const arrowKept = parseInt(arrowMatch[2])
                        return `${Math.max(0, bowStr + arrowRolled + sizeMod)}k${arrowKept}`
                      }
                      return selectedArrow.dr
                    }
                    if (selectedWeapon) {
                      const drMatch = selectedWeapon.dr.match(/(\d+)k(\d+)/)
                      if (drMatch) {
                        const rolled = parseInt(drMatch[1])
                        const kept = parseInt(drMatch[2])
                        const str = fields.l5rStrength7 || 2
                        return `${Math.max(0, rolled + str + sizeMod)}k${kept}`
                      }
                      return selectedWeapon.dr
                    }
                    // Unarmed damage
                    const unarmedKeep = hasHandsOfStone ? 2 : 1
                    return `${fields.l5rStrength7 || 2}k${unarmedKeep}`
                  })()}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                  {(() => {
                    const mods = [hasLarge && '+1k0 Large', hasSmall && '-1k0 Small'].filter(Boolean).join(', ')
                    if (isBow && selectedBow && selectedArrow) {
                      const bowStr = parseInt((selectedBow.dr.match(/Str\s*(\d+)/) || [])[1]) || 0
                      return `${selectedBow.name} (Str ${bowStr}) + ${selectedArrow.name} (${selectedArrow.dr})${mods ? ` ${mods}` : ''}`
                    }
                    if (selectedWeapon) {
                      return `${selectedWeapon.dr} + Str ${fields.l5rStrength7 || 2}${mods ? ` ${mods}` : ''}`
                    }
                    return `Unarmed${hasHandsOfStone ? ' (Hands of Stone: 0k2)' : ' (0k1)'}${mods ? ` ${mods}` : ''}`
                  })()}
                </div>
              </div>

              {/* Attack Roll card */}
              <div className="form-section" style={{ padding: 'var(--space-md)', textAlign: 'center', marginBottom: 0 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Attack Roll</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>
                  {(() => {
                    if (isBow) {
                      const ref = fields.l5rReflexes || 2
                      const kyujutsu = parsedSkills.find(s => s.name.toLowerCase().includes('kyujutsu'))?.rank || 0
                      const rolled = ref + kyujutsu
                      return `${rolled}k${ref}`
                    }
                    if (selectedWeapon) {
                      const agi = fields.l5rAgility || 2
                      const keywords = (selectedWeapon.keywords || '').toLowerCase()
                      let skillName = 'kenjutsu'
                      if (keywords.includes('large') && !keywords.includes('samurai')) skillName = 'heavy weapons'
                      else if (keywords.includes('chain')) skillName = 'chain weapons'
                      else if (keywords.includes('small') && !keywords.includes('samurai')) skillName = 'knives'
                      else if (keywords.includes('staves') || selectedWeapon.name?.toLowerCase().includes('bo')) skillName = 'staves'
                      const skill = parsedSkills.find(s => s.name.toLowerCase().includes(skillName))?.rank || 0
                      const rolled = agi + skill
                      return `${rolled}k${agi}`
                    }
                    return '\u2014'
                  })()}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                  {(() => {
                    if (isBow) {
                      const kyujutsu = parsedSkills.find(s => s.name.toLowerCase().includes('kyujutsu'))?.rank || 0
                      return `Reflexes ${fields.l5rReflexes || 2} + Kyujutsu ${kyujutsu}`
                    }
                    if (selectedWeapon) {
                      const keywords = (selectedWeapon.keywords || '').toLowerCase()
                      let skillName = 'Kenjutsu'
                      if (keywords.includes('large') && !keywords.includes('samurai')) skillName = 'Heavy Weapons'
                      else if (keywords.includes('chain')) skillName = 'Chain Weapons'
                      else if (keywords.includes('small') && !keywords.includes('samurai')) skillName = 'Knives'
                      const skill = parsedSkills.find(s => s.name.toLowerCase().includes(skillName.toLowerCase()))?.rank || 0
                      return `Agility ${fields.l5rAgility || 2} + ${skillName} ${skill}`
                    }
                    return 'No weapon equipped'
                  })()}
                </div>
              </div>

              {/* Armor card (display only) */}
              <div className="form-section" style={{ padding: 'var(--space-md)', textAlign: 'center', marginBottom: 0 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Armor</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>
                  {armorData ? `+${armorATN} ATN` : 'None'}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                  {armorData ? `${armorData.name}, Red ${armorReduction}` : 'No armor equipped'}
                </div>
              </div>

              {/* Weapon info card */}
              {(selectedWeapon || isBow) && (
                <div className="form-section" style={{ padding: 'var(--space-md)', textAlign: 'center', marginBottom: 0 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Keywords</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: 'var(--space-xs)' }}>
                    {selectedWeapon ? selectedWeapon.keywords : selectedBow ? selectedBow.keywords : ''}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-xs)' }}>
                    {selectedWeapon ? selectedWeapon.notes : selectedBow ? selectedBow.notes : ''}
                  </div>
                </div>
              )}
            </div>
          </fieldset>

          {/* ── School Equipment ── */}
          {fields.l5rSchool && SCHOOL_EQUIPMENT[fields.l5rSchool] && (
            <fieldset>
              <legend>Starting Equipment — {fields.l5rSchool}</legend>
              <ul style={{ listStyle: 'disc', paddingLeft: 'var(--space-lg)', fontSize: '0.85rem' }}>
                {SCHOOL_EQUIPMENT[fields.l5rSchool].map(item => <li key={item} style={{ marginBottom: 'var(--space-xs)' }}>{item}</li>)}
              </ul>
            </fieldset>
          )}

          <fieldset>
            <legend>{t('l5rPersonalItems')}</legend>
            <textarea name="personalItems" value={fields.personalItems} onChange={handleText} rows={6} style={{ width: '100%' }} placeholder={
`Katana (3k2, Samurai)
Wakizashi (2k2, Samurai)
Light Armor (+5 ATN, Red 3)
Traveling pack, spare kimono, 10 koku`} />
          </fieldset>

          <div style={{ marginBottom: 'var(--space-md)' }}>
            <label htmlFor="equip-filter" style={{ marginRight: 'var(--space-sm)' }}>{t('l5rFilterCategory')}</label>
            <select id="equip-filter" value={equipFilter} onChange={e => setEquipFilter(e.target.value)} style={{ fontSize: '0.85rem' }}>
              <option value="all">{t('filterAll')}</option>
              <option value="weapons">{t('l5rFilterWeapons')}</option>
              <option value="ranged">{t('l5rFilterRanged')}</option>
              <option value="armor">{t('l5rFilterArmor')}</option>
              <option value="gear">{t('l5rFilterGear')}</option>
            </select>
          </div>

          {L5R_EQUIPMENT_CATEGORIES
            .filter(({ key }) => {
              if (equipFilter === 'all') return true
              const EQUIP_FILTER_MAP = {
                weapons: new Set(['swords', 'schoolWeapons', 'polearms', 'spears', 'heavyWeapons', 'knives', 'staves', 'chain', 'warFans']),
                ranged: new Set(['bows', 'arrows']),
                armor: new Set(['armor']),
                gear: new Set(['adventuringGear', 'siegeWeapons']),
              }
              return EQUIP_FILTER_MAP[equipFilter]?.has(key)
            })
            .map(({ key, label }) => (
            <details key={key} style={{ marginBottom: 'var(--space-sm)' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>{label} Catalogue</summary>
              <div style={{ padding: 'var(--space-sm) 0' }}>
                {key === 'armor' ? (
                  <table className="inv-table">
                    <thead>
                      <tr><th>Name</th><th>ATN Bonus</th><th>Reduction</th><th>Cost</th><th>Notes</th><th></th></tr>
                    </thead>
                    <tbody>
                      {L5R_EQUIPMENT[key].map(item => (
                        <tr key={item.name}>
                          <td style={{ fontWeight: 600 }}>{item.name}</td>
                          <td>+{item.atn}</td>
                          <td>{item.reduction}</td>
                          <td>{item.cost}</td>
                          <td className="inv-notes">{item.notes}</td>
                          <td><button type="button" className="btn btn-sm" style={{ padding: '2px 6px' }}
                            onClick={() => addToInventory(`${item.name} (+${item.atn} ATN, Red ${item.reduction})`)}>+</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : key === 'arrows' ? (
                  <table className="inv-table">
                    <thead>
                      <tr><th>Name</th><th>DR</th><th>Cost</th><th>Notes</th><th></th></tr>
                    </thead>
                    <tbody>
                      {L5R_EQUIPMENT[key].map(item => (
                        <tr key={item.name}>
                          <td style={{ fontWeight: 600 }}>{item.name}</td>
                          <td>{item.dr}</td>
                          <td>{item.cost}</td>
                          <td className="inv-notes">{item.notes}</td>
                          <td><button type="button" className="btn btn-sm" style={{ padding: '2px 6px' }}
                            onClick={() => addToInventory(`${item.name} (${item.dr})`)}>+</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : key === 'adventuringGear' || key === 'siegeWeapons' ? (
                  <table className="inv-table">
                    <thead>
                      <tr><th>Name</th><th>Cost</th><th>Notes</th><th></th></tr>
                    </thead>
                    <tbody>
                      {L5R_EQUIPMENT[key].map(item => (
                        <tr key={item.name}>
                          <td style={{ fontWeight: 600 }}>{item.name}</td>
                          <td>{item.cost}</td>
                          <td className="inv-notes">{item.notes}</td>
                          <td><button type="button" className="btn btn-sm" style={{ padding: '2px 6px' }}
                            onClick={() => addToInventory(`${item.name} \u2014 ${item.notes}`)}>+</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table className="inv-table">
                    <thead>
                      <tr><th>Name</th><th>DR</th><th>Keywords</th><th>Cost</th><th>Notes</th><th></th></tr>
                    </thead>
                    <tbody>
                      {L5R_EQUIPMENT[key].map(item => (
                        <tr key={item.name}>
                          <td style={{ fontWeight: 600 }}>{item.name}</td>
                          <td>{item.dr}</td>
                          <td style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{item.keywords}</td>
                          <td>{item.cost}</td>
                          <td className="inv-notes">{item.notes}</td>
                          <td><button type="button" className="btn btn-sm" style={{ padding: '2px 6px' }}
                            onClick={() => addToInventory(key === 'schoolWeapons'
                              ? `${item.name} (${item.dr}, ${item.keywords}) \u2014 ${item.notes}`
                              : `${item.name} (${item.dr}, ${item.keywords})`)}>+</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* ── Combat & Derived Stats (tab 8) ── */}
      <div role="tabpanel" id={`tabpanel-8`} aria-labelledby={`tab-8`} hidden={tab !== 8}>
        <div className="form-section">
          {/* ── Stance Dashboard ── */}
          <fieldset>
            <legend>{t('l5rCombatDash')}</legend>
            <div className="field-row">
              <div className="field">
                <label>{t('l5rCurrentStance')}</label>
                <select value={combatStance} onChange={e => setCombatStance(e.target.value)} aria-label={t('l5rCurrentStance')}>
                  {STANCES.map(s => <option key={s.name} value={s.name}>{t(s.name)}</option>)}
                </select>
              </div>
              <div className="field">
                <label>{t('l5rDefenseSkill')}</label>
                <select value={defenseSkill} onChange={e => setDefenseSkill(parseInt(e.target.value))}>
                  {[0,1,2,3,4,5,6,7,8,9,10].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>

            {stanceNotes && (
              <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)', fontStyle: 'italic' }}>
                {combatStance}: {stanceNotes}
              </p>
            )}

            {/* Active Conditions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: 'var(--space-md)' }}>
              {L5R_CONDITIONS.map(c => {
                const active = conditions.has(c.name)
                return (
                  <button key={c.name} type="button"
                    onClick={() => setConditions(prev => {
                      const next = new Set(prev)
                      if (next.has(c.name)) next.delete(c.name); else next.add(c.name)
                      return next
                    })}
                    title={c.effect}
                    style={{
                      padding: '0.2rem 0.5rem', fontSize: '0.75rem', fontWeight: active ? 700 : 400,
                      borderRadius: 'var(--radius)', cursor: 'pointer', border: '1px solid',
                      borderColor: active ? 'rgba(224,85,85,0.5)' : 'var(--color-border)',
                      background: active ? 'rgba(224,85,85,0.12)' : 'transparent',
                      color: active ? '#e55' : 'var(--color-text-muted)',
                    }}>
                    {c.name}
                  </button>
                )
              })}
            </div>
            {conditions.size > 0 && (
              <div style={{ marginBottom: 'var(--space-md)', fontSize: '0.78rem' }}>
                {L5R_CONDITIONS.filter(c => conditions.has(c.name)).map(c => (
                  <p key={c.name} style={{ margin: '0.15rem 0', color: '#e55' }}>
                    <strong>{c.name}:</strong> <span style={{ color: 'var(--color-text-muted)' }}>{c.effect}</span>
                  </p>
                ))}
              </div>
            )}

            {/* Live stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
              <div className="form-section" style={{ padding: 'var(--space-md)', textAlign: 'center', marginBottom: 0 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Armor TN</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: stanceATNmod < 0 ? '#e55' : stanceATNmod > 0 ? '#8c8' : 'var(--color-text)' }}>{totalATN}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                  {baseATN} base{armorATN > 0 ? ` + ${armorATN} armor` : ''}{stanceATNmod !== 0 ? ` ${stanceATNmod > 0 ? '+' : ''}${stanceATNmod} stance` : ''}
                </div>
              </div>
              <div className="form-section" style={{ padding: 'var(--space-md)', textAlign: 'center', marginBottom: 0 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Initiative</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{initRoll}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Insight Rank {computedSchoolRank} / Reflexes {fields.l5rReflexes}{hasQuick ? ' (+1k0 Quick)' : ''}</div>
              </div>
              <div className="form-section" style={{ padding: 'var(--space-md)', textAlign: 'center', marginBottom: 0 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Reduction</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{armorReduction}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{armorData ? armorData.name : 'No armor'}</div>
              </div>
              {stanceAttackMod && (
                <div className="form-section" style={{ padding: 'var(--space-md)', textAlign: 'center', marginBottom: 0 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Attack Bonus</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#8c8' }}>{stanceAttackMod}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Full Attack stance</div>
                </div>
              )}
              <div className="form-section" style={{ padding: 'var(--space-md)', textAlign: 'center', marginBottom: 0 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Wound Status</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: currentPenalty === 0 ? '#8c8' : currentPenalty >= 40 ? '#e55' : '#e95' }}>{currentWoundRank}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                  {currentPenalty === 999 ? 'Incapacitated' : currentPenalty > 0 ? `+${currentPenalty} TN penalty` : 'No penalty'}
                </div>
              </div>
              <div className="form-section" style={{ padding: 'var(--space-md)', textAlign: 'center', marginBottom: 0 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Movement</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{moveFree}'{combatStance === 'Full Attack' ? ` +5'` : ''}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Free / {moveSimple}' Simple / {moveMax}' Max</div>
              </div>
            </div>

            {/* Quick Roll Reference */}
            {(equippedWeapon || true) && (
              <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', background: 'var(--color-surface)', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, marginBottom: 'var(--space-sm)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)' }}>Quick Roll Reference</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-sm)', fontSize: '0.82rem' }}>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)' }}>Attack: </span>
                    <strong>{(() => {
                      if (isBow) {
                        const ref = fields.l5rReflexes || 2
                        const kyujutsu = parsedSkills.find(s => s.name.toLowerCase().includes('kyujutsu'))?.rank || 0
                        return `${ref + kyujutsu}k${ref}`
                      }
                      if (selectedWeapon) {
                        const agi = fields.l5rAgility || 2
                        const keywords = (selectedWeapon.keywords || '').toLowerCase()
                        let skillName = 'kenjutsu'
                        if (keywords.includes('large') && !keywords.includes('samurai')) skillName = 'heavy weapons'
                        else if (keywords.includes('chain')) skillName = 'chain weapons'
                        else if (keywords.includes('small') && !keywords.includes('samurai')) skillName = 'knives'
                        const skill = parsedSkills.find(s => s.name.toLowerCase().includes(skillName))?.rank || 0
                        return `${agi + skill}k${agi}`
                      }
                      const agi = fields.l5rAgility || 2
                      const jiujutsu = parsedSkills.find(s => s.name.toLowerCase().includes('jiujutsu'))?.rank || 0
                      return `${agi + jiujutsu}k${agi}`
                    })()}</strong>
                    {currentPenalty > 0 && currentPenalty !== 999 && <span style={{ color: '#e55' }}> (+{currentPenalty} TN)</span>}
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)' }}>Damage: </span>
                    <strong>{(() => {
                      const sizeMod = (hasLarge ? 1 : 0) + (hasSmall ? -1 : 0)
                      if (isBow && selectedBow && selectedArrow) {
                        const bowStr = parseInt((selectedBow.dr.match(/Str\s*(\d+)/) || [])[1]) || 0
                        const arrowMatch = selectedArrow.dr.match(/(\d+)k(\d+)/)
                        if (arrowMatch) return `${Math.max(0, bowStr + parseInt(arrowMatch[1]) + sizeMod)}k${arrowMatch[2]}`
                      }
                      if (selectedWeapon) {
                        const drMatch = selectedWeapon.dr.match(/(\d+)k(\d+)/)
                        if (drMatch) return `${Math.max(0, parseInt(drMatch[1]) + (fields.l5rStrength7 || 2) + sizeMod)}k${drMatch[2]}`
                      }
                      return `${(fields.l5rStrength7 || 2) + sizeMod}k${hasHandsOfStone ? 2 : 1}`
                    })()}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)' }}>Weapon: </span>
                    <span>{equippedWeapon || 'Unarmed'}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)' }}>Initiative: </span>
                    <strong>{initRoll}</strong>
                  </div>
                </div>
              </div>
            )}
          </fieldset>

          {/* ── Derived Stats (inline) ── */}
          <fieldset>
            <legend>{t('l5rHonorGloryStatus')}</legend>
            <div className="field-row">
              <div className="field">
                <label>{t('l5rHonor')} ({(fields.l5rHonor / 10).toFixed(1)}{hasPerceivedHonor ? `, ${t('l5rEffective')}: ${((fields.l5rHonor / 10) + 1).toFixed(1)}` : ''})</label>
                <input type="number" name="l5rHonor" value={fields.l5rHonor} onChange={handleText} min={0} max={100} />
              </div>
              <div className="field">
                <label>{t('l5rGlory')} ({(fields.l5rGlory / 10).toFixed(1)}{(hasFame || hasInfamous) ? `, ${t('l5rEffective')}: ${((fields.l5rGlory / 10) + (hasFame ? 1 : 0) + (hasInfamous ? -1 : 0)).toFixed(1)}` : ''})</label>
                <input type="number" name="l5rGlory" value={fields.l5rGlory} onChange={handleText} min={0} max={100} />
              </div>
              <div className="field">
                <label>{t('l5rStatus')} ({(fields.l5rStatus / 10).toFixed(1)})</label>
                <input type="number" name="l5rStatus" value={fields.l5rStatus} onChange={handleText} min={0} max={100} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
              <div className="form-section" style={{ padding: 'var(--space-md)', textAlign: 'center', marginBottom: 0 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Insight</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-accent-fg)' }}>{computedInsight}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Rings {(airRing + earthRing + fireRing + waterRing + voidRing) * 10} + Skills {totalSkillRanks}</div>
              </div>
              <div className="form-section" style={{ padding: 'var(--space-md)', textAlign: 'center', marginBottom: 0 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>School Rank</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-accent-fg)' }}>{computedSchoolRank}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                  {nextRankInsight ? `Next at ${nextRankInsight} (${nextRankInsight - computedInsight} more)` : 'Max rank'}
                </div>
              </div>
              <div className="form-section" style={{ padding: 'var(--space-md)', textAlign: 'center', marginBottom: 0 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Base ATN</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{baseATN}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Ref {fields.l5rReflexes} x5 + 5{armorATN > 0 ? ` (+${armorATN} armor) = ${baseATN + armorATN}` : ''}</div>
              </div>
              <div className="form-section" style={{ padding: 'var(--space-md)', textAlign: 'center', marginBottom: 0 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Initiative</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{initRoll}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Rank {computedSchoolRank}k Ref {fields.l5rReflexes}</div>
              </div>
            </div>
          </fieldset>

          {/* ── Wounds Tracker ── */}
          <fieldset>
            <legend>{t('l5rWounds')} ({w} / {totalWoundCapacity})</legend>

            {/* Wound Penalty Banner */}
            <div style={{
              textAlign: 'center', padding: 'var(--space-md)', marginBottom: 'var(--space-md)',
              borderRadius: 'var(--radius)',
              background: currentPenalty === 0 ? 'rgba(136,204,136,0.08)' : currentPenalty >= 40 ? 'rgba(224,85,85,0.15)' : 'rgba(233,149,85,0.1)',
              border: `2px solid ${currentPenalty === 0 ? 'rgba(136,204,136,0.4)' : currentPenalty >= 40 ? 'rgba(224,85,85,0.5)' : 'rgba(233,149,85,0.4)'}`
            }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)' }}>
                {t('l5rCurrentPenalty')}
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: currentPenalty === 0 ? '#88cc88' : currentPenalty >= 40 ? '#ee5555' : '#e9954c' }}>
                {currentPenalty === 999 ? t('l5rIncapacitated') : currentPenalty > 0 ? `+${currentPenalty}` : t('l5rNoPenalty')}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{currentWoundRank}</div>
            </div>

            {/* +/- Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)', flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-secondary" style={{ minWidth: 44, fontWeight: 700 }} onClick={() => adjustWounds(-5)} disabled={w <= 0}>-5</button>
              <button type="button" className="btn btn-secondary" style={{ minWidth: 44, fontWeight: 700, fontSize: '1.1rem' }} onClick={() => adjustWounds(-1)} disabled={w <= 0}>-1</button>
              <input type="number" name="l5rWounds" value={fields.l5rWounds} onChange={handleText} min={0}
                style={{ width: 70, textAlign: 'center', fontSize: '1.1rem', fontWeight: 700 }} />
              <button type="button" className="btn btn-secondary" style={{ minWidth: 44, fontWeight: 700, fontSize: '1.1rem' }} onClick={() => adjustWounds(1)}>+1</button>
              <button type="button" className="btn btn-secondary" style={{ minWidth: 44, fontWeight: 700 }} onClick={() => adjustWounds(5)}>+5</button>
            </div>

            {/* Void Points */}
            <div className="field-row" style={{ justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
              <div className="field" style={{ maxWidth: 200 }}>
                <label>{t('l5rCurrentVoid')}</label>
                <DotRating label="" name="l5rCurrentVoid" value={fields.l5rCurrentVoid} onChange={handleField} min={0} max={fields.l5rVoid} />
              </div>
            </div>

            {/* Wound Table with Progress Bars */}
            <table className="inv-table" style={{ marginTop: 'var(--space-sm)' }}>
              <thead>
                <tr><th>Rank</th><th>Penalty</th><th>Range</th><th style={{ width: '30%' }}>Filled</th></tr>
              </thead>
              <tbody>
                <tr style={{ background: w > 0 && w <= healthyThreshold ? 'rgba(136,204,136,0.08)' : 'transparent' }}>
                  <td style={{ fontWeight: 600 }}>Healthy</td><td>+0</td><td>0 – {healthyThreshold}</td>
                  <td>{healthyThreshold > 0 && (
                    <div className="l5r-wound-bar">
                      <div className="l5r-wound-bar__fill l5r-wound-bar__fill--healthy"
                        style={{ width: `${Math.min(100, (Math.min(w, healthyThreshold) / healthyThreshold) * 100)}%` }} />
                    </div>
                  )}</td>
                </tr>
                {WOUND_RANKS.slice(1, -1).map((wr, i) => {
                  const lo = healthyThreshold + i * woundsPerRank + 1
                  const hi = healthyThreshold + (i + 1) * woundsPerRank
                  const inRank = w >= lo && w <= hi
                  const filled = w >= hi ? woundsPerRank : (w >= lo ? w - lo + 1 : 0)
                  const pct = woundsPerRank > 0 ? (filled / woundsPerRank) * 100 : 0
                  const severity = i < 2 ? 'light' : i < 4 ? 'medium' : 'severe'
                  const basePen = [3, 5, 10, 15, 20, 40][i]
                  const modPen = Math.max(0, basePen + penaltyMod)
                  return (
                    <tr key={wr.name} style={{ background: inRank ? 'rgba(224,85,85,0.08)' : 'transparent' }}>
                      <td style={{ fontWeight: 600 }}>{wr.name}</td>
                      <td>{penaltyMod !== 0 ? `+${modPen}` : wr.penalty}</td>
                      <td>{lo} – {hi}</td>
                      <td>
                        <div className="l5r-wound-bar">
                          <div className={`l5r-wound-bar__fill l5r-wound-bar__fill--${severity}`}
                            style={{ width: `${pct}%` }} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
                <tr style={{ background: w > totalWoundCapacity ? 'rgba(224,85,85,0.15)' : 'transparent' }}>
                  <td style={{ fontWeight: 600 }}>Out</td><td>Cannot act</td><td>{totalWoundCapacity + 1}+</td><td></td>
                </tr>
              </tbody>
            </table>

            {/* Recovery Rate */}
            {w > 0 && (
              <div style={{ marginTop: 'var(--space-sm)', padding: 'var(--space-sm) var(--space-md)', background: 'var(--color-surface)', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)', fontSize: '0.78rem' }}>
                <strong style={{ color: 'var(--color-accent-fg)' }}>Recovery:</strong>{' '}
                <span style={{ color: 'var(--color-text-muted)' }}>
                  {(fields.l5rStamina7 || 2) * 2 + computedSchoolRank} wounds/day at rest
                  {' '}({Math.ceil(((fields.l5rStamina7 || 2) * 2 + computedSchoolRank) / 2)} if active).
                  {' '}Medicine TN 15: +{'{'}successes{'}'} wounds.
                  {hasAdvantage('Quick Healer') && <span style={{ color: '#8c8' }}> Quick Healer: doubled.</span>}
                </span>
              </div>
            )}
          </fieldset>

          {/* ── Reference Tables (collapsed) ── */}
          <details style={{ marginBottom: 'var(--space-md)' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>{t('l5rStanceRef')}</summary>
            <table className="inv-table" style={{ marginTop: 'var(--space-sm)' }}>
              <thead><tr><th>Stance</th><th>Ring</th><th>Effect</th></tr></thead>
              <tbody>
                {STANCES.map(s => (
                  <tr key={s.name} style={{ background: combatStance === s.name ? 'rgba(194,145,56,0.1)' : 'transparent' }}>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td style={{ color: 'var(--color-accent-fg)' }}>{s.ring}</td>
                    <td className="inv-notes">{s.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>

          <details style={{ marginBottom: 'var(--space-md)' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>{t('l5rManeuverRef')}</summary>
            <table className="inv-table" style={{ marginTop: 'var(--space-sm)' }}>
              <thead><tr><th>Maneuver</th><th>Raises</th><th>Effect</th></tr></thead>
              <tbody>
                {MANEUVERS.map(m => (
                  <tr key={m.name}>
                    <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{m.name}</td>
                    <td>{m.raises}</td>
                    <td className="inv-notes">{m.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>

          <details>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>{t('l5rVoidPointUses')}</summary>
            <div style={{ padding: 'var(--space-sm) 0' }}>
              <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}>+1k1 to a Skill, Trait, Ring, or Spell Casting roll (not damage)</p>
              <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}>Temporarily treat a Skill Rank 0 as Rank 1</p>
              <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}>Reduce Wounds from one source by 10</p>
              <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}>Increase Armor TN by 10 for one Round</p>
              <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}>Increase Initiative Score by 10 for the skirmish</p>
              <p className="muted-hint muted-hint--xs">Exchange Initiative Score with a willing target</p>
            </div>
          </details>
        </div>
      </div>

      {/* ── Backstory ── */}
      <div role="tabpanel" id={`tabpanel-9`} aria-labelledby={`tab-9`} hidden={tab !== 9}>
        <div className="form-section">
          <fieldset><legend>{t('backstoryLabel')}</legend><textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('appearanceLabel')}</legend><textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('notes')}</legend><textarea name="notes" value={fields.notes} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>

          {/* Heritage Roll */}
          <fieldset>
            <legend>Heritage Roll Table</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Roll on the Heritage Table from the L5R 4th Edition corebook to determine your family&apos;s history.
            </p>
            <button className="btn btn-secondary" onClick={rollHeritage} style={{ marginBottom: 'var(--space-sm)' }}>Roll Heritage (2d10)</button>
            {heritageResult && (
              <div style={{ background: 'var(--color-surface-raised)', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-sm)' }}>
                <div style={{ fontSize: '0.85rem', marginBottom: 'var(--space-xs)' }}>
                  <strong>First d10:</strong> {heritageResult.roll1} — <strong>Second d10:</strong> {heritageResult.roll2}
                </div>
                {heritageResult.entry && (
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-accent-fg)' }}>{heritageResult.entry.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{heritageResult.entry.effect}</div>
                  </div>
                )}
              </div>
            )}
            <details>
              <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-accent-fg)' }}>Full Heritage Table</summary>
              <table className="inv-table" style={{ marginTop: 'var(--space-xs)' }}>
                <thead><tr><th>Roll</th><th>Result</th><th>Effect</th></tr></thead>
                <tbody>
                  {HERITAGE_TABLE.map(h => (
                    <tr key={h.roll} style={{ background: heritageResult?.roll1 === h.roll ? 'rgba(194,145,56,0.1)' : 'transparent' }}>
                      <td style={{ fontWeight: 700, textAlign: 'center' }}>{h.roll}</td>
                      <td style={{ fontWeight: 600 }}>{h.name}</td>
                      <td className="inv-notes">{h.effect}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          </fieldset>
        </div>
      </div>

      {/* ── XP Log ── */}
      <div role="tabpanel" id={`tabpanel-10`} aria-labelledby={`tab-10`} hidden={tab !== 10}>
        <XpLogSection splat="l5r" xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)} t={t} />
      </div>

      {/* ── Rules Reference ── */}
      <div role="tabpanel" id={`tabpanel-11`} aria-labelledby={`tab-11`} hidden={tab !== 11}>
        <RulesReferenceTab rules={L5R_RULES} title="L5R Rules Reference" />
      </div>

      {/* ── Dice Roller ── */}
      <div role="tabpanel" id={`tabpanel-12`} aria-labelledby={`tab-12`} hidden={tab !== 12}>
        <L5RDiceRoller />
      </div>

      {warnings.length > 0 && (
        <div style={{ margin: 'var(--space-md) 0', padding: 'var(--space-sm) var(--space-md)', background: 'rgba(233,149,85,0.1)', border: '1px solid rgba(233,149,85,0.3)', borderRadius: 'var(--radius)', fontSize: '0.78rem' }}>
          <strong style={{ color: '#e95' }}>Warnings:</strong>
          {warnings.map((w, i) => <span key={i} style={{ color: 'var(--color-text-muted)', marginLeft: 'var(--space-sm)' }}>{w}{i < warnings.length - 1 ? ',' : ''}</span>)}
        </div>
      )}
      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => setShowExport(true)}>{t('exportPdf')}</button>
        <button className="btn btn-secondary" onClick={() => navigate('/l5r')}>{t('cancel')}</button>
        <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>{saving ? t('saving') : t('quickSave')}</button>
        <button className="btn btn-primary" onClick={handleDoneEditing} disabled={saving}>{t('doneEditing')}</button>
      </div>
      {viewMode && (
        <div className="view-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/l5r')}>{t('back')}</button>
          <button className="btn btn-primary" onClick={() => navigate(`/characters/${characterId}`, { replace: true })}>{t('edit')}</button>
        </div>
      )}
      <ExportModal open={showExport} onClose={() => setShowExport(false)} tabKeys={TAB_KEYS} t={t} />
    </div>
  )
}
