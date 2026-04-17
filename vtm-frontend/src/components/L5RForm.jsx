import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  getCharacter, updateCharacter,
  getBackgrounds, addBackground, removeBackground,
  getXpLog, addXpLogEntry, removeXpLogEntry,
  getDisciplines, addDiscipline, removeDiscipline,
} from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import DotRating from './DotRating'
import { L5R_EQUIPMENT, L5R_EQUIPMENT_CATEGORIES } from '../data/l5rEquipment'
import { L5R_KATA } from '../data/l5rKata'
import { L5R_SPELLS } from '../data/l5rSpells'
import { L5R_SCHOOLS } from '../data/l5rSchools'
import { L5R_SKILL_MASTERIES } from '../data/l5rSkillMasteries'
import XpLogSection from './XpLogSection'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import TagInfoPanel from './TagInfoPanel'

// ── Clans & Families ──
const CLANS = {
  'Crab': { families: ['Hida', 'Hiruma', 'Kaiu', 'Kuni', 'Toritaka', 'Yasuki'], schools: ['Hida Bushi', 'Hiruma Bushi', 'Hiruma Scout', 'Kaiu Engineer', 'Kuni Shugenja', 'Kuni Witch Hunter', 'Toritaka Bushi', 'Yasuki Courtier', 'Hida Pragmatist'] },
  'Crane': { families: ['Asahina', 'Daidoji', 'Doji', 'Kakita'], schools: ['Asahina Shugenja', 'Daidoji Iron Warrior', 'Doji Courtier', 'Doji Magistrate', 'Kakita Bushi', 'Kakita Artisan'] },
  'Dragon': { families: ['Kitsuki', 'Mirumoto', 'Tamori', 'Togashi'], schools: ['Kitsuki Investigator', 'Mirumoto Bushi', 'Tamori Shugenja', 'Togashi Tattooed Order'] },
  'Lion': { families: ['Akodo', 'Ikoma', 'Kitsu', 'Matsu'], schools: ['Akodo Bushi', 'Ikoma Bard', 'Ikoma Lion\'s Shadow', 'Kitsu Shugenja', 'Matsu Berserker'] },
  'Mantis': { families: ['Kitsune', 'Moshi', 'Tsuruchi', 'Yoritomo'], schools: ['Kitsune Shugenja', 'Moshi Shugenja', 'Tsuruchi Archer', 'Tsuruchi Bounty Hunter', 'Yoritomo Bushi', 'Yoritomo Courtier'] },
  'Phoenix': { families: ['Agasha', 'Isawa', 'Shiba'], schools: ['Agasha Shugenja', 'Isawa Shugenja', 'Isawa Tensai', 'Shiba Bushi', 'Asako Loremaster'] },
  'Scorpion': { families: ['Bayushi', 'Shosuro', 'Soshi', 'Yogo'], schools: ['Bayushi Bushi', 'Bayushi Courtier', 'Shosuro Infiltrator', 'Soshi Shugenja', 'Yogo Shugenja'] },
  'Spider': { families: ['Chuda', 'Daigotsu', 'Goju', 'Ninube'], schools: ['Chuda Shugenja', 'Daigotsu Bushi', 'Daigotsu Courtier', 'Goju Ninja', 'Ninube Shugenja'] },
  'Unicorn': { families: ['Horiuchi', 'Ide', 'Iuchi', 'Moto', 'Shinjo', 'Utaku'], schools: ['Ide Emissary', 'Iuchi Shugenja', 'Moto Bushi', 'Moto Vindicator', 'Shinjo Bushi', 'Utaku Battle Maiden'] },
  'Imperial': { families: ['Miya', 'Otomo', 'Seppun'], schools: ['Miya Herald', 'Otomo Courtier', 'Seppun Guardsman', 'Seppun Shugenja'] },
  'Minor Clan': { families: [], schools: [] },
  'Ronin': { families: [], schools: ['Ronin (Various)'] },
}
const CLAN_NAMES = Object.keys(CLANS)

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
  { name: 'Chosen by the Oracles', cost: 6, description: '+1k1 to all Ring Rolls using one chosen Ring.' },
  { name: 'Clear Thinker', cost: 3, description: '+1k0 on Contested Rolls vs. confusion or manipulation.' },
  { name: 'Crab Hands', cost: 3, description: 'Treat unfamiliar Weapon Skills as Rank 1 instead of Unskilled.' },
  { name: 'Crafty', cost: 3, description: 'Treat Low Skills at Rank 0 as Rank 1 (avoid Unskilled penalties).' },
  { name: 'Dangerous Beauty', cost: 3, description: '+1k0 to Temptation rolls against the opposite sex.' },
  { name: 'Daredevil', cost: 3, description: '+3k1 instead of +1k1 when spending Void on Athletics.' },
  { name: 'Darling of the Court', cost: 2, description: 'You are adored by courtiers and gain social advantages at court.' },
  { name: 'Different School', cost: 5, description: 'Attend a school of a different Clan.' },
  { name: 'Elemental Blessing', cost: 4, description: 'Reduce XP cost to raise both Traits of one Ring by 1.' },
  { name: 'Fame', cost: 3, description: 'Your Glory Rank is effectively 1 higher for recognition.' },
  { name: 'Forbidden Knowledge', cost: 5, description: 'You possess dangerous lore. +1k0 to one Lore of your choice.' },
  { name: 'Friend of the Elements', cost: 4, description: 'One element\'s kami are friendlier to you. +1k0 to spells of that element.' },
  { name: 'Great Destiny', cost: 5, description: 'Once per session, survive what would otherwise kill you.' },
  { name: 'Hands of Stone', cost: 6, description: 'Unarmed damage is 0k2 instead of 0k1.' },
  { name: 'Hero of the People', cost: 2, description: 'Peasants love and trust you, providing aid when possible.' },
  { name: 'Higher Purpose', cost: 3, description: '+1k0 to rolls directly related to your chosen cause.' },
  { name: 'Inheritance', cost: 5, description: 'You have inherited a significant item (weapon, armor, etc.).' },
  { name: 'Inner Gift', cost: 7, description: 'You possess a minor supernatural gift (GM approval required).' },
  { name: 'Irreproachable', cost: 2, description: '+1k0 to resist Temptation and Intimidation.' },
  { name: 'Ishiken-Do', cost: 8, description: 'You can cast Void spells. Extremely rare.' },
  { name: 'Kharmic Tie', cost: 1, description: 'Deep spiritual bond with another PC. Shared fate.' },
  { name: 'Large', cost: 4, description: 'Significantly larger than average. +1k0 to damage rolls.' },
  { name: 'Leadership', cost: 6, description: '+1k0 to Battle rolls. Followers have higher morale.' },
  { name: 'Luck', cost: '3/6/9', description: 'Reroll 1/2/3 times per session (keep better result).' },
  { name: 'Magic Resistance', cost: '2/4/6', description: '+5/+10/+15 to TN of all spells targeting you.' },
  { name: 'Multiple Schools', cost: 10, description: 'You have trained in a second School (requires GM approval).' },
  { name: 'Paragon', cost: 7, description: 'Embody a tenet of Bushido. Gain a special benefit related to it.' },
  { name: 'Perceived Honor', cost: 3, description: 'Your Honor appears 1 Rank higher for social purposes.' },
  { name: 'Precise Memory', cost: 3, description: 'You can recall details with near-perfect accuracy.' },
  { name: 'Quick', cost: 6, description: '+1k0 to all Initiative rolls.' },
  { name: 'Quick Healer', cost: 3, description: 'Heal twice as fast as normal.' },
  { name: 'Read Lips', cost: 4, description: 'You can read lips with an Investigation/Perception roll.' },
  { name: 'Sacred Weapon', cost: 'Variable', description: 'A weapon of spiritual significance with special properties.' },
  { name: 'Sage', cost: 4, description: '+1k0 to all Lore Skill Rolls.' },
  { name: 'Sensation', cost: 3, description: '+1k0 to all Artisan and Perform Skill Rolls.' },
  { name: 'Silent', cost: 3, description: '+1k0 to all Stealth Skill Rolls.' },
  { name: 'Social Position', cost: 6, description: 'Status Rank 1 higher than normal for your School/Family.' },
  { name: 'Soul of Artistry', cost: 4, description: 'Pick one Artisan skill. You gain +1k1 with it.' },
  { name: 'Strength of the Earth', cost: 3, description: 'Reduce all Wound TN penalties by 3.' },
  { name: 'Tactician', cost: 4, description: '+1k0 to all Battle Skill Rolls.' },
  { name: 'Touch of the Spirit Realms', cost: 5, description: 'Mystical connection to a spirit realm with minor benefits.' },
  { name: 'Virtuous', cost: 3, description: '+1k0 to resist any temptation to act dishonorably.' },
  { name: 'Voice', cost: 3, description: '+1k0 to any Social Skill Roll involving speaking.' },
  { name: 'Wary', cost: 3, description: '+1k1 to Investigation rolls to detect ambush or surprise.' },
  { name: 'Way of the Land', cost: 2, description: 'You know a specific region intimately. No movement penalties there.' },
  { name: 'Wealthy', cost: '1-5', description: 'Greater starting koku and resources.' },
]

// ── Disadvantages catalogue ──
const L5R_DISADVANTAGES = [
  { name: 'Antisocial', cost: '2/4', description: '-1k0 or -1k1 to all Social Skill Rolls.' },
  { name: 'Ascetic', cost: 2, description: 'No material possessions beyond essentials. Half Glory awards.' },
  { name: 'Bad Eyesight', cost: 3, description: '-1k1 to ranged attacks and Perception-based rolls.' },
  { name: 'Bad Fortune', cost: 3, description: 'Kharma has cursed you (Secret Love, Evil Eye, Unknown Enemy, etc.).' },
  { name: 'Bad Health', cost: 4, description: 'Earth Ring -1 for Wound Ranks and disease resistance.' },
  { name: 'Bitter Betrothal', cost: 2, description: 'Unhappy arranged marriage causing domestic difficulties.' },
  { name: 'Blackmailed', cost: 'Variable', description: 'Someone knows your dark secret. Cost = your Status.' },
  { name: 'Black Sheep', cost: 3, description: 'Your family is disgusted with you. No welcome at home.' },
  { name: 'Blind', cost: 6, description: '-3k3 ranged, -1k1 melee. Armor TN = Reflexes + 5.' },
  { name: 'Brash', cost: 3, description: 'Must roll Willpower TN 25 or attack when insulted.' },
  { name: 'Can\'t Lie', cost: 2, description: 'Psychologically incapable of telling lies.' },
  { name: 'Cast Out', cost: '1/3', description: 'Denounced by monks. They treat your Glory as Infamy.' },
  { name: 'Compulsion', cost: '2-4', description: 'Hopelessly compelled to partake in an activity.' },
  { name: 'Contrary', cost: 3, description: 'Must share opinions and argue in every discussion.' },
  { name: 'Cursed by the Realm', cost: 4, description: 'Penalties when dealing with spirits from a specific realm.' },
  { name: 'Dark Fate', cost: 3, description: 'Destined to die a terrible, specific death.' },
  { name: 'Dark Secret', cost: 4, description: 'You hide a shameful truth that would destroy you if revealed.' },
  { name: 'Disbeliever', cost: 3, description: 'You doubt the spiritual world. -1k0 to interact with spirits/kami.' },
  { name: 'Dishonored', cost: 5, description: 'You have been publicly shamed. Status effectively 0.' },
  { name: 'Disturbing Countenance', cost: 3, description: 'Something unsettling about your appearance. -1k0 to social rolls.' },
  { name: 'Doubt', cost: 4, description: '-1k1 when using one specific Skill.' },
  { name: 'Driven', cost: 2, description: 'Obsessed with a goal. Must pursue it at risk of Honor loss.' },
  { name: 'Epilepsy', cost: 4, description: 'Seizures under stress. Roll Stamina TN 20 or be incapacitated.' },
  { name: 'Failure of Bushido', cost: 'Variable', description: 'Weak in one tenet of Bushido. Specific penalties apply.' },
  { name: 'Fascination', cost: 1, description: 'Obsessed with a specific topic. Must investigate when encountered.' },
  { name: 'Frail Mind', cost: 3, description: '-1k0 to resist Fear effects and Intimidation.' },
  { name: 'Greedy', cost: 3, description: 'Will go to great lengths to acquire wealth and material goods.' },
  { name: 'Gullible', cost: 4, description: '-1k1 to detect lies and resist manipulation.' },
  { name: 'Haunted', cost: 3, description: 'A restless spirit follows you and causes problems.' },
  { name: 'Hostage', cost: 3, description: 'You are a political hostage in another Clan.' },
  { name: 'Idealistic', cost: 2, description: 'Naive about the darker side of the world.' },
  { name: 'Infamous', cost: 2, description: 'Your Glory functions as Infamy. People distrust you.' },
  { name: 'Insensitive', cost: 2, description: '-1k0 to Courtier and Etiquette rolls.' },
  { name: 'Jealousy', cost: 3, description: 'Consumed by envy of another\'s success or possessions.' },
  { name: 'Lame', cost: 4, description: 'Water Ring -1 for movement. -1k0 to Athletics.' },
  { name: 'Lost Love', cost: 3, description: 'Someone you loved is dead or gone. Emotional vulnerability.' },
  { name: 'Low Pain Threshold', cost: 4, description: 'Wound TN penalties are 3 points worse per rank.' },
  { name: 'Obligation', cost: 'Variable', description: 'You owe a significant debt to someone of influence.' },
  { name: 'Obtuse', cost: 3, description: '-1k0 to Investigation and Perception rolls.' },
  { name: 'Overconfident', cost: 3, description: 'You believe you can handle any situation. Reckless behavior.' },
  { name: 'Permanent Wound', cost: 4, description: 'You have a wound that never fully heals. Always at Nicked.' },
  { name: 'Small', cost: 3, description: 'Smaller than average. -1k0 to damage rolls.' },
  { name: 'Sworn Enemy', cost: 'Variable', description: 'Someone of influence wants you ruined or dead.' },
  { name: 'True Love', cost: 3, description: 'In love with someone. Creates vulnerability and obligations.' },
  { name: 'Wrath of the Kami', cost: 3, description: '-1k0 to spell casting with one specific element.' },
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

const TAB_KEYS = ['tabIdentity', 'tabL5rRings', 'tabL5rSkills', 'tabL5rAdvantages', 'tabL5rTechniques', 'tabL5rSpells', 'tabL5rKata', 'tabL5rEquipment', 'tabL5rCombat', 'tabBackstory', 'tabXpLog']

export default function L5RForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const [searchParams] = useSearchParams()
  const viewMode = searchParams.get('mode') === 'view'
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
  const [tagInfo, setTagInfo] = useState(null)
  const [combatStance, setCombatStance] = useState('Attack')
  const [equippedArmor, setEquippedArmor] = useState('None')
  const [defenseSkill, setDefenseSkill] = useState(0)
  const [equippedWeapon, setEquippedWeapon] = useState('')
  const [equippedArrow, setEquippedArrow] = useState('Willow Leaf')
  const [spellAffinity, setSpellAffinity] = useState('')
  const [spellDeficiency, setSpellDeficiency] = useState('')
  const [activeKata, setActiveKata] = useState('')
  const [advSearch, setAdvSearch] = useState('')
  const [disadvSearch, setDisadvSearch] = useState('')
  const [spellSearch, setSpellSearch] = useState('')
  const [kataSearch, setKataSearch] = useState('')
  const [newSkillName, setNewSkillName] = useState('')
  const [newSkillRank, setNewSkillRank] = useState(1)
  const [newSkillEmphases, setNewSkillEmphases] = useState([])
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
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

  async function handleSave() {
    setSaving(true); setSaveError(null)
    try { await updateCharacter(characterId, fields) }
    catch { setSaveError(t('failedToSave')) }
    finally { setSaving(false) }
  }

  async function handleDoneEditing() { await handleSave(); navigate('/l5r') }

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

  // Families filtered by selected clan
  const selectedFamilies = fields.l5rClan && CLANS[fields.l5rClan] ? CLANS[fields.l5rClan].families : []

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
  const initRoll = `${fields.l5rSchoolRank || 1}k${fields.l5rReflexes}`
  const moveFree = waterRing * 5
  const moveSimple = waterRing * 10
  const moveMax = waterRing * 20

  // ── Weapon computations ──
  const ALL_WEAPONS = [
    ...L5R_EQUIPMENT.swords, ...L5R_EQUIPMENT.polearms, ...L5R_EQUIPMENT.spears,
    ...L5R_EQUIPMENT.heavyWeapons, ...L5R_EQUIPMENT.knives, ...L5R_EQUIPMENT.staves,
    ...L5R_EQUIPMENT.chain, ...L5R_EQUIPMENT.warFans,
  ]
  const selectedWeapon = ALL_WEAPONS.find(w => w.name === equippedWeapon)
  const isBow = L5R_EQUIPMENT.bows.some(b => b.name === equippedWeapon)
  const selectedBow = L5R_EQUIPMENT.bows.find(b => b.name === equippedWeapon)
  const selectedArrow = L5R_EQUIPMENT.arrows.find(a => a.name === equippedArrow)

  // Wound rank from current wounds
  const woundsPerRank = earthRing * 2
  const healthyThreshold = earthRing * 5
  let currentWoundRank = 'Healthy'
  let currentPenalty = 0
  const w = fields.l5rWounds || 0
  if (w <= healthyThreshold) { currentWoundRank = 'Healthy'; currentPenalty = 0 }
  else {
    const pastHealthy = w - healthyThreshold
    const rankIndex = Math.min(Math.floor((pastHealthy - 1) / woundsPerRank), 6)
    const penalties = [3, 5, 10, 15, 20, 40, 999]
    const names = ['Nicked', 'Grazed', 'Hurt', 'Injured', 'Crippled', 'Down', 'Out']
    currentWoundRank = names[rankIndex] || 'Out'
    currentPenalty = penalties[rankIndex] || 999
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

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/l5r')}>{t('back')}</button>
        <h2>{fields.name || t('editL5rCharacter')}</h2>
        <span className="splat-badge splat-badge--l5r">L5R</span>
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}
      {actionError && <p className="status-error" role="alert">{actionError}</p>}

      <div className="tab-list" role="tablist">
        {TAB_KEYS.map((tk, i) => (
          <button key={tk} role="tab" className={`btn btn-secondary${tab === i ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(i)} aria-selected={tab === i}>{t(tk)}</button>
        ))}
      </div>

      {/* ── Identity ── */}
      <div hidden={tab !== 0}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tabIdentity')}</legend>
            <div className="field-row">
              <div className="field"><label>{t('charName')} *</label><input name="name" value={fields.name} onChange={handleText} /></div>
              <div className="field"><label>{t('concept')}</label><input name="concept" value={fields.concept} onChange={handleText} /></div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Clan</label>
                <select name="l5rClan" value={fields.l5rClan} onChange={e => { handleText(e); setFields(prev => ({ ...prev, l5rClan: e.target.value, l5rFamily: '' })) }}>
                  <option value="">{t('select')}</option>
                  {CLAN_NAMES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Family</label>
                {selectedFamilies.length > 0 ? (
                  <select name="l5rFamily" value={fields.l5rFamily} onChange={handleText}>
                    <option value="">{t('select')}</option>
                    {selectedFamilies.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                ) : (
                  <input name="l5rFamily" value={fields.l5rFamily} onChange={handleText} placeholder="Enter family name..." />
                )}
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>School</label>
                {fields.l5rClan && CLANS[fields.l5rClan]?.schools?.length > 0 ? (
                  <select name="l5rSchool" value={fields.l5rSchool} onChange={handleText}>
                    <option value="">{t('select')}</option>
                    {CLANS[fields.l5rClan].schools.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : (
                  <input name="l5rSchool" value={fields.l5rSchool} onChange={handleText} placeholder="Enter school name..." />
                )}
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>{t('type')}</label>
                <div className="role-toggle" role="radiogroup">
                  <button type="button" className={`role-toggle-btn${!fields.npc ? ' role-toggle-btn--active' : ''}`} onClick={() => handleField('npc', false)}>{t('pc')}</button>
                  <button type="button" className={`role-toggle-btn${fields.npc ? ' role-toggle-btn--active' : ''}`} onClick={() => handleField('npc', true)}>{t('npc')}</button>
                </div>
              </div>
            </div>
            <details style={{ marginTop: 'var(--space-md)' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>Heritage Tables (Optional)</summary>
              <p className="muted-hint muted-hint--xs" style={{ padding: 'var(--space-sm) 0' }}>
                Heritage Tables are an optional mechanic. Roll on your clan's Heritage Table during character creation to discover connections to your family's past. Results may grant bonus skills, items, or plot hooks. Consult your GM and the core rulebook for your clan's specific table.
              </p>
            </details>
          </fieldset>
        </div>
      </div>

      {/* ── Rings & Traits ── */}
      <div hidden={tab !== 1}>
        <div className="form-section">
          <fieldset>
            <legend>Rings &amp; Traits</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Each Ring equals the lower of its two Traits. Starting characters begin with all Traits at 2.
            </p>

            {/* Air */}
            <fieldset style={{ marginBottom: 'var(--space-md)' }}>
              <legend>Air Ring: {airRing}</legend>
              <div className="rating-grid">
                <div className="ability-row"><DotRating label="Reflexes (Physical)" name="l5rReflexes" value={fields.l5rReflexes} onChange={handleField} min={2} max={10} /></div>
                <div className="ability-row"><DotRating label="Awareness (Mental)" name="l5rAwareness" value={fields.l5rAwareness} onChange={handleField} min={2} max={10} /></div>
              </div>
            </fieldset>

            {/* Earth */}
            <fieldset style={{ marginBottom: 'var(--space-md)' }}>
              <legend>Earth Ring: {earthRing}</legend>
              <div className="rating-grid">
                <div className="ability-row"><DotRating label="Stamina (Physical)" name="l5rStamina7" value={fields.l5rStamina7} onChange={handleField} min={2} max={10} /></div>
                <div className="ability-row"><DotRating label="Willpower (Mental)" name="l5rWillpower7" value={fields.l5rWillpower7} onChange={handleField} min={2} max={10} /></div>
              </div>
            </fieldset>

            {/* Fire */}
            <fieldset style={{ marginBottom: 'var(--space-md)' }}>
              <legend>Fire Ring: {fireRing}</legend>
              <div className="rating-grid">
                <div className="ability-row"><DotRating label="Agility (Physical)" name="l5rAgility" value={fields.l5rAgility} onChange={handleField} min={2} max={10} /></div>
                <div className="ability-row"><DotRating label="Intelligence (Mental)" name="l5rIntelligence7" value={fields.l5rIntelligence7} onChange={handleField} min={2} max={10} /></div>
              </div>
            </fieldset>

            {/* Water */}
            <fieldset style={{ marginBottom: 'var(--space-md)' }}>
              <legend>Water Ring: {waterRing}</legend>
              <div className="rating-grid">
                <div className="ability-row"><DotRating label="Strength (Physical)" name="l5rStrength7" value={fields.l5rStrength7} onChange={handleField} min={2} max={10} /></div>
                <div className="ability-row"><DotRating label="Perception (Mental)" name="l5rPerception7" value={fields.l5rPerception7} onChange={handleField} min={2} max={10} /></div>
              </div>
            </fieldset>

            {/* Void */}
            <fieldset style={{ marginBottom: 'var(--space-md)' }}>
              <legend>Void Ring: {voidRing}</legend>
              <div className="rating-grid">
                <div className="ability-row"><DotRating label="Void" name="l5rVoid" value={fields.l5rVoid} onChange={handleField} min={2} max={10} /></div>
                <div className="ability-row"><DotRating label="Current Void Points" name="l5rCurrentVoid" value={fields.l5rCurrentVoid} onChange={handleField} min={0} max={fields.l5rVoid} /></div>
              </div>
            </fieldset>
          </fieldset>
        </div>
      </div>

      {/* ── Skills (Interactive) ── */}
      <div hidden={tab !== 2}>
        <div className="form-section">
          {/* Skill Summary */}
          <fieldset>
            <legend>Skill Summary</legend>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: 'var(--space-sm)', flexWrap: 'wrap' }}>
              <div><strong>Total Skill Ranks:</strong> {totalSkillRanks}</div>
              <div><strong>Insight from Skills:</strong> {totalSkillRanks}</div>
              <div><strong>Insight from Rings:</strong> {(airRing + earthRing + fireRing + waterRing + voidRing) * 10}</div>
              <div><strong>Total Insight:</strong> <span style={{ color: 'var(--color-accent-fg)', fontWeight: 700 }}>{(airRing + earthRing + fireRing + waterRing + voidRing) * 10 + totalSkillRanks}</span></div>
            </div>
          </fieldset>

          {/* Add Skill Form */}
          <fieldset>
            <legend>Add Skill</legend>
            <div className="field-row" style={{ alignItems: 'flex-end' }}>
              <div className="field" style={{ flex: 2 }}>
                <label>Skill</label>
                <select value={newSkillName} onChange={e => { setNewSkillName(e.target.value); setNewSkillEmphases([]) }}>
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
              <legend>Active Skills ({parsedSkills.length})</legend>
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
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}><span style={{ color: typeColor, fontSize: '0.7rem', marginRight: '0.3rem' }}>{'\u25CF'}</span>{s.name}</td>
                        <td style={{ fontWeight: 700, textAlign: 'center' }}>{s.rank}</td>
                        <td style={{ fontWeight: 600, color: 'var(--color-accent-fg)' }}>{s.rank > 0 ? roll : '\u2014'}</td>
                        <td style={{ fontSize: '0.78rem' }}>{s.emphases || '\u2014'}</td>
                        <td className="inv-notes" style={{ fontSize: '0.72rem' }}>{activeMasteries.length > 0 ? activeMasteries.join(' | ') : '\u2014'}</td>
                        <td><button className="tag-remove" onClick={() => handleRemoveSkill(i)} aria-label={`Remove ${s.name}`}>{'\u00d7'}</button></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </fieldset>
          )}

          {/* Raw Textarea */}
          <fieldset>
            <legend>Raw Skill Data</legend>
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
                <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{category}</summary>
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
      <div hidden={tab !== 3}>
        <div className="form-section">
          {/* ── Advantages ── */}
          <fieldset>
            <legend>Advantages ({disciplines.length})</legend>
            {disciplines.length > 0 && (
              <ul className="tag-list" style={{ marginBottom: 'var(--space-md)' }}>
                {disciplines.map(d => {
                  const entry = L5R_ADVANTAGES.find(a => a.name.toLowerCase() === d.name.toLowerCase())
                  return (
                    <li key={d.id} className={`tag tag--clickable${d.id === tagInfo?.id ? ' tag--active' : ''}`}
                      onClick={() => setTagInfo(ti => ti?.id === d.id ? null : { ...d, kind: 'advantage' })}>
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
            <legend>Disadvantages ({backgrounds.length})</legend>
            {backgrounds.length > 0 && (
              <ul className="tag-list" style={{ marginBottom: 'var(--space-md)' }}>
                {backgrounds.map(b => (
                  <li key={b.id} className={`tag tag--clickable${b.id === tagInfo?.id ? ' tag--active' : ''}`}
                    onClick={() => setTagInfo(ti => ti?.id === b.id ? null : { ...b, kind: 'disadvantage' })}>
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
      <div hidden={tab !== 4}>
        <div className="form-section">
          {(() => {
            const schoolData = fields.l5rSchool && L5R_SCHOOLS[fields.l5rSchool]
            const schoolRank = fields.l5rSchoolRank || 1
            return (
              <>
                {schoolData ? (
                  <fieldset>
                    <legend>{fields.l5rSchool}</legend>
                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: 'var(--space-md)', flexWrap: 'wrap', fontSize: '0.82rem' }}>
                      <div><strong>Clan:</strong> {schoolData.clan}</div>
                      <div><strong>Type:</strong> {schoolData.type}</div>
                      <div><strong>Trait:</strong> {schoolData.traits}</div>
                      <div><strong>Honor:</strong> {schoolData.honor}</div>
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
                          return (
                            <tr key={tech.rank} style={{ opacity: unlocked ? 1 : 0.4, background: unlocked ? 'rgba(194,145,56,0.05)' : 'transparent' }}>
                              <td style={{ fontWeight: 700, color: unlocked ? 'var(--color-accent-fg)' : 'var(--color-text-muted)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                {tech.rank} {unlocked ? '✓' : ''}
                              </td>
                              <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{tech.name}</td>
                              <td className="inv-notes">{tech.effect}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </fieldset>
                ) : (
                  <fieldset>
                    <legend>School Techniques</legend>
                    <p className="muted-hint" style={{ paddingBottom: 0 }}>
                      Select a School on the Identity tab to see your techniques here.
                    </p>
                  </fieldset>
                )}

                <fieldset>
                  <legend>Technique Notes</legend>
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
      <div hidden={tab !== 5}>
        <div className="form-section">
          {/* ── Casting Dashboard ── */}
          <fieldset>
            <legend>Spell Casting Dashboard</legend>
            <div className="field-row">
              <div className="field">
                <label>Affinity Element</label>
                <select value={spellAffinity} onChange={e => setSpellAffinity(e.target.value)}>
                  <option value="">None</option>
                  {['Air', 'Earth', 'Fire', 'Water', 'Void'].map(el => <option key={el} value={el}>{el}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Deficiency Element</label>
                <select value={spellDeficiency} onChange={e => setSpellDeficiency(e.target.value)}>
                  <option value="">None</option>
                  {['Air', 'Earth', 'Fire', 'Water', 'Void'].map(el => <option key={el} value={el}>{el}</option>)}
                </select>
              </div>
            </div>
            <table className="inv-table" style={{ marginTop: 'var(--space-sm)' }}>
              <thead>
                <tr><th>Element</th><th>Ring</th><th>Casting Roll</th><th>Status</th></tr>
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
                  return (
                    <tr key={el.name} style={{ background: isAff ? 'rgba(136,204,136,0.08)' : isDef ? 'rgba(224,85,85,0.08)' : 'transparent' }}>
                      <td style={{ fontWeight: 600 }}>{el.name}</td>
                      <td>{el.ring}</td>
                      <td style={{ fontWeight: 600 }}>{el.ring + (fields.l5rSchoolRank || 1)}k{el.ring}</td>
                      <td style={{ color: isAff ? '#8c8' : isDef ? '#e55' : 'var(--color-text-muted)' }}>
                        {isAff ? 'Affinity (−1 slot)' : isDef ? 'Deficiency (+1 slot)' : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </fieldset>

          {/* ── Known Spells ── */}
          <fieldset>
            <legend>Known Spells ({parsedSpells.length})</legend>
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
            <legend>Spell Catalogue ({L5R_SPELLS.length} spells)</legend>
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
                    const canCast = s.mastery <= (ringMap[s.element] || 2) + (fields.l5rSchoolRank || 1)
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
                              {s.element} {s.mastery}
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
                const castMax = ring + (fields.l5rSchoolRank || 1)
                const elemSpells = L5R_SPELLS.filter(s => s.element === elem)
                const isAff = spellAffinity === elem
                const isDef = spellDeficiency === elem
                return (
                  <details key={elem} style={{ marginBottom: 'var(--space-sm)' }}>
                    <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: isAff ? '#8c8' : isDef ? '#e55' : 'var(--color-accent-fg)' }}>
                      {elem} ({elemSpells.length}) — Cast {ring + (fields.l5rSchoolRank || 1)}k{ring}
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
                                <span className="catalog-item-cost">ML {s.mastery}</span>
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
      <div hidden={tab !== 6}>
        <div className="form-section">
          {/* ── Active Kata ── */}
          <fieldset>
            <legend>Active Kata</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Executing a Kata is a Simple Action. Only one may be active at a time. Select from your known kata.
            </p>
            <div className="field-row">
              <div className="field" style={{ flex: 2 }}>
                <label>Currently Active</label>
                <select value={activeKata} onChange={e => setActiveKata(e.target.value)}>
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
            <legend>Known Kata ({parsedKata.length})</legend>
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
            <legend>Kata Catalogue ({L5R_KATA.length} kata)</legend>
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
                            <span className="catalog-item-cost">{k.ring} {k.mastery}</span>
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
                                <span className="catalog-item-cost">ML {k.mastery}</span>
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
      <div hidden={tab !== 7}>
        <div className="form-section">
          {/* ── Loadout Dashboard ── */}
          <fieldset>
            <legend>Loadout Dashboard</legend>
            <div className="field-row">
              <div className="field" style={{ flex: 2 }}>
                <label>Equipped Weapon</label>
                <select value={equippedWeapon} onChange={e => setEquippedWeapon(e.target.value)}>
                  <option value="">None</option>
                  <optgroup label="Melee Weapons">
                    {ALL_WEAPONS.map(w => <option key={w.name} value={w.name}>{w.name} ({w.dr})</option>)}
                  </optgroup>
                  <optgroup label="Bows">
                    {L5R_EQUIPMENT.bows.map(b => <option key={b.name} value={b.name}>{b.name} ({b.dr})</option>)}
                  </optgroup>
                </select>
              </div>
              <div className="field">
                <label>Equipped Armor</label>
                <select value={equippedArmor} onChange={e => setEquippedArmor(e.target.value)}>
                  <option value="None">None (No Armor)</option>
                  {L5R_EQUIPMENT.armor.map(a => <option key={a.name} value={a.name}>{a.name} (+{typeof a.atn === 'number' ? a.atn : a.atn} ATN, Red {a.reduction})</option>)}
                </select>
              </div>
              {isBow && (
                <div className="field">
                  <label>Arrow Type</label>
                  <select value={equippedArrow} onChange={e => setEquippedArrow(e.target.value)}>
                    {L5R_EQUIPMENT.arrows.map(a => <option key={a.name} value={a.name}>{a.name} ({a.dr})</option>)}
                  </select>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
              {/* Damage card */}
              <div className="form-section" style={{ padding: 'var(--space-md)', textAlign: 'center', marginBottom: 0 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Damage</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>
                  {(() => {
                    if (isBow && selectedBow && selectedArrow) {
                      const bowStr = parseInt((selectedBow.dr.match(/Str\s*(\d+)/) || [])[1]) || 0
                      const arrowMatch = selectedArrow.dr.match(/(\d+)k(\d+)/)
                      if (arrowMatch) {
                        const arrowRolled = parseInt(arrowMatch[1])
                        const arrowKept = parseInt(arrowMatch[2])
                        return `${bowStr + arrowRolled}k${arrowKept}`
                      }
                      return selectedArrow.dr
                    }
                    if (selectedWeapon) {
                      const drMatch = selectedWeapon.dr.match(/(\d+)k(\d+)/)
                      if (drMatch) {
                        const rolled = parseInt(drMatch[1])
                        const kept = parseInt(drMatch[2])
                        const str = fields.l5rStrength7 || 2
                        return `${rolled + str}k${kept}`
                      }
                      return selectedWeapon.dr
                    }
                    return '\u2014'
                  })()}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                  {(() => {
                    if (isBow && selectedBow && selectedArrow) {
                      const bowStr = parseInt((selectedBow.dr.match(/Str\s*(\d+)/) || [])[1]) || 0
                      return `${selectedBow.name} (Str ${bowStr}) + ${selectedArrow.name} (${selectedArrow.dr})`
                    }
                    if (selectedWeapon) {
                      return `${selectedWeapon.dr} + Str ${fields.l5rStrength7 || 2}`
                    }
                    return 'No weapon equipped'
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
                      return `Xk${ref}`
                    }
                    if (selectedWeapon) {
                      const agi = fields.l5rAgility || 2
                      return `Xk${agi}`
                    }
                    return '\u2014'
                  })()}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                  {(() => {
                    if (isBow) return `Reflexes + Kyujutsu: Xk${fields.l5rReflexes || 2}`
                    if (selectedWeapon) return `Agility + [Weapon Skill]: Xk${fields.l5rAgility || 2}`
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
            <legend>Personal Items</legend>
            <textarea name="personalItems" value={fields.personalItems} onChange={handleText} rows={6} style={{ width: '100%' }} placeholder={
`Katana (3k2, Samurai)
Wakizashi (2k2, Samurai)
Light Armor (+5 ATN, Red 3)
Traveling pack, spare kimono, 10 koku`} />
          </fieldset>

          {L5R_EQUIPMENT_CATEGORIES.map(({ key, label }) => (
            <details key={key} style={{ marginBottom: 'var(--space-sm)' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>{label} Catalogue</summary>
              <div style={{ padding: 'var(--space-sm) 0' }}>
                {key === 'armor' ? (
                  <table className="inv-table">
                    <thead>
                      <tr><th>Name</th><th>ATN Bonus</th><th>Reduction</th><th>Cost</th><th>Notes</th></tr>
                    </thead>
                    <tbody>
                      {L5R_EQUIPMENT[key].map(item => (
                        <tr key={item.name}>
                          <td style={{ fontWeight: 600 }}>{item.name}</td>
                          <td>+{item.atn}</td>
                          <td>{item.reduction}</td>
                          <td>{item.cost}</td>
                          <td className="inv-notes">{item.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : key === 'arrows' ? (
                  <table className="inv-table">
                    <thead>
                      <tr><th>Name</th><th>DR</th><th>Cost</th><th>Notes</th></tr>
                    </thead>
                    <tbody>
                      {L5R_EQUIPMENT[key].map(item => (
                        <tr key={item.name}>
                          <td style={{ fontWeight: 600 }}>{item.name}</td>
                          <td>{item.dr}</td>
                          <td>{item.cost}</td>
                          <td className="inv-notes">{item.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table className="inv-table">
                    <thead>
                      <tr><th>Name</th><th>DR</th><th>Keywords</th><th>Cost</th><th>Notes</th></tr>
                    </thead>
                    <tbody>
                      {L5R_EQUIPMENT[key].map(item => (
                        <tr key={item.name}>
                          <td style={{ fontWeight: 600 }}>{item.name}</td>
                          <td>{item.dr}</td>
                          <td style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{item.keywords}</td>
                          <td>{item.cost}</td>
                          <td className="inv-notes">{item.notes}</td>
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
      <div hidden={tab !== 8}>
        <div className="form-section">
          {/* ── Stance Dashboard ── */}
          <fieldset>
            <legend>Combat Dashboard</legend>
            <div className="field-row">
              <div className="field">
                <label>Current Stance</label>
                <select value={combatStance} onChange={e => setCombatStance(e.target.value)}>
                  {STANCES.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Defense Skill Rank</label>
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
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Insight Rank {fields.l5rSchoolRank || 1} / Reflexes {fields.l5rReflexes}</div>
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
          </fieldset>

          {/* ── Derived Stats (inline) ── */}
          <fieldset>
            <legend>Honor, Glory, Status &amp; Insight</legend>
            <div className="field-row">
              <div className="field">
                <label>Honor ({(fields.l5rHonor / 10).toFixed(1)})</label>
                <input type="number" name="l5rHonor" value={fields.l5rHonor} onChange={handleText} min={0} max={100} />
              </div>
              <div className="field">
                <label>Glory ({(fields.l5rGlory / 10).toFixed(1)})</label>
                <input type="number" name="l5rGlory" value={fields.l5rGlory} onChange={handleText} min={0} max={100} />
              </div>
              <div className="field">
                <label>Status ({(fields.l5rStatus / 10).toFixed(1)})</label>
                <input type="number" name="l5rStatus" value={fields.l5rStatus} onChange={handleText} min={0} max={100} />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Insight (Rings {(airRing + earthRing + fireRing + waterRing + voidRing) * 10} + Skills {totalSkillRanks} = {(airRing + earthRing + fireRing + waterRing + voidRing) * 10 + totalSkillRanks})</label>
                <input type="number" name="l5rInsight" value={fields.l5rInsight} onChange={handleText} min={0} />
              </div>
              <div className="field">
                <label>School Rank</label>
                <input type="number" name="l5rSchoolRank" value={fields.l5rSchoolRank} onChange={handleText} min={1} max={10} />
              </div>
              <div className="field">
                <label>Armor TN (override)</label>
                <input type="number" name="l5rArmorTN" value={fields.l5rArmorTN} onChange={handleText} min={0} />
              </div>
              <div className="field">
                <label>Initiative (override)</label>
                <input type="number" name="l5rInitiative" value={fields.l5rInitiative} onChange={handleText} min={0} />
              </div>
            </div>
          </fieldset>

          {/* ── Wounds Tracker ── */}
          <fieldset>
            <legend>Wounds ({fields.l5rWounds || 0} total)</legend>
            <div className="field-row">
              <div className="field" style={{ maxWidth: 120 }}>
                <label>Current Wounds</label>
                <input type="number" name="l5rWounds" value={fields.l5rWounds} onChange={handleText} min={0} />
              </div>
              <div className="field" style={{ maxWidth: 120 }}>
                <label>Void Points</label>
                <DotRating label="" name="l5rCurrentVoid" value={fields.l5rCurrentVoid} onChange={handleField} min={0} max={fields.l5rVoid} />
              </div>
            </div>
            <table className="inv-table" style={{ marginTop: 'var(--space-sm)' }}>
              <thead>
                <tr><th>Rank</th><th>TN Penalty</th><th>Threshold</th><th></th></tr>
              </thead>
              <tbody>
                <tr style={{ background: w <= healthyThreshold ? 'rgba(136,204,136,0.08)' : 'transparent' }}>
                  <td style={{ fontWeight: 600 }}>Healthy</td><td>+0</td><td>0 – {healthyThreshold}</td>
                  <td>{w <= healthyThreshold && w > 0 ? `${w}/${healthyThreshold}` : ''}</td>
                </tr>
                {WOUND_RANKS.slice(1, -1).map((wr, i) => {
                  const lo = healthyThreshold + i * woundsPerRank + 1
                  const hi = healthyThreshold + (i + 1) * woundsPerRank
                  const inRank = w >= lo && w <= hi
                  return (
                    <tr key={wr.name} style={{ background: inRank ? 'rgba(224,85,85,0.08)' : 'transparent' }}>
                      <td style={{ fontWeight: 600 }}>{wr.name}</td>
                      <td>{wr.penalty}</td>
                      <td>{lo} – {hi}</td>
                      <td>{inRank ? `${w - lo + 1}/${woundsPerRank}` : ''}</td>
                    </tr>
                  )
                })}
                <tr style={{ background: w > healthyThreshold + 6 * woundsPerRank ? 'rgba(224,85,85,0.15)' : 'transparent' }}>
                  <td style={{ fontWeight: 600 }}>Out</td><td>Cannot act</td><td>{healthyThreshold + 6 * woundsPerRank + 1}+</td><td></td>
                </tr>
              </tbody>
            </table>
          </fieldset>

          {/* ── Reference Tables (collapsed) ── */}
          <details style={{ marginBottom: 'var(--space-md)' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>Stance Reference</summary>
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
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>Maneuver Reference</summary>
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
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>Void Point Uses</summary>
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
      <div hidden={tab !== 9}>
        <div className="form-section">
          <fieldset><legend>{t('backstoryLabel')}</legend><textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('appearanceLabel')}</legend><textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('notes')}</legend><textarea name="notes" value={fields.notes} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
        </div>
      </div>

      {/* ── XP Log ── */}
      <div hidden={tab !== 10}>
        <XpLogSection splat="l5r" xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)} t={t} />
      </div>

      <div className="form-actions">
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
    </div>
  )
}
