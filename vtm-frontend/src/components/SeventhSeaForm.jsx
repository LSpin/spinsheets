import { useState, useEffect } from 'react'
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
import XpLogSection from './XpLogSection'
import { useLanguage } from '../i18n/LanguageContext'
import ExportModal from './ExportModal'
import { useTheme } from '../context/ThemeContext'
import TagInfoPanel from './TagInfoPanel'
import RulesReferenceTab from './RulesReferenceTab'
import { SEVEN_SEA_RULES } from '../data/sevenSeaRules'
import SeventhSeaDiceRoller from './SeventhSeaDiceRoller'
import { SEVEN_SEA_HERO_NPCS, SEVEN_SEA_HERO_CATALOG } from '../data/sevenSeaNpcs'

// ── Nations with favored trait pairs (pick one for +1) ──
const NATIONS = {
  'Avalon':                  ['Panache', 'Resolve'],
  'Inismore':                ['Panache', 'Wits'],
  'Highland Marches':        ['Brawn', 'Finesse'],
  'Castille':                ['Finesse', 'Wits'],
  'Eisen':                   ['Brawn', 'Resolve'],
  'Montaigne':               ['Finesse', 'Panache'],
  'Sarmatian Commonwealth':  ['Brawn', 'Panache'],
  'Ussura':                  ['Resolve', 'Wits'],
  'Vestenmennavenjar':       ['Brawn', 'Wits'],
  'Vodacce':                 ['Finesse', 'Resolve'],
  'Crescent Empire':         ['Resolve', 'Wits'],
  'Ifri':                    ['Brawn', 'Panache'],
  'Aztlan':                  ['Finesse', 'Panache'],
}
const NATION_NAMES = Object.keys(NATIONS)

const RELIGION_CATALOG = [
  { value: 'Vaticine Church', description: 'The dominant faith of Théah. Worships Theus and the Prophets. Opposes sorcery.' },
  { value: 'Objectionism', description: 'Protestant reformation of the Vaticine Church. Rejects Papal authority and embraces reason.' },
  { value: 'Ussuran Orthodox', description: 'Ussuran branch of the Vaticine faith. Emphasizes Matushka (Mother Nature) alongside Theus.' },
  { value: 'Die Kreuzritter', description: 'Secretive holy order of monster hunters. Ancient knights fighting supernatural threats.' },
  { value: 'Crescent Faith', description: 'The faith of the Crescent Empire. Monotheistic, scholarly, emphasizes justice and learning.' },
  { value: 'Old Vestenmannavnjar Faith', description: 'Ancient Norse-inspired religion. Worships the old gods through rune magic and sagas.' },
  { value: 'Sidhe Worship', description: 'Avalon folk religion venerating the Sidhe (fae). Tied to Glamour sorcery.' },
  { value: 'Losejas', description: 'Vodacce folk mysticism. Tied to Sorte witchcraft and fate-reading traditions.' },
  { value: 'Agnosticism', description: 'Skeptical of organized religion. Common among scholars and freethinkers.' },
  { value: 'Atheism', description: 'Rejects divine authority entirely. Rare and socially dangerous in most nations.' },
]

const NATION_CATALOG = [
  { value: 'Avalon', description: 'Inspired by Elizabethan England. A land of knights, Sidhe magic, and Glamour sorcery.' },
  { value: 'Inismore', description: 'Inspired by Ireland. Wild and mystical, home to ancient fae bargains.' },
  { value: 'Highland Marches', description: 'Inspired by Scotland. Proud clans united by honor and fierce independence.' },
  { value: 'Castille', description: 'Inspired by Spain. A nation of scholars, duelists, and religious devotion.' },
  { value: 'Eisen', description: 'Inspired by the Holy Roman Empire. War-torn land of iron-willed soldiers and Hexenwerk.' },
  { value: 'Montaigne', description: 'Inspired by France. Decadent nobility wielding Porte sorcery and political intrigue.' },
  { value: 'Sarmatian Commonwealth', description: 'Inspired by Poland-Lithuania. A democratic republic of noble cavaliers.' },
  { value: 'Ussura', description: 'Inspired by Russia. A frozen land where Dar Matushki grants the gift of transformation.' },
  { value: 'Vestenmennavenjar', description: 'Inspired by Scandinavia. Vikings turned merchants with ancient Galdr rune magic.' },
  { value: 'Vodacce', description: 'Inspired by Italy. Scheming merchant princes and Fate Witches who weave Sorte.' },
  { value: 'Crescent Empire', description: 'Inspired by the Ottoman Empire. A diverse land of scholars, warriors, and ancient knowledge.' },
  { value: 'Ifri', description: 'Inspired by Africa. Rich in culture, trade, and powerful spiritual traditions.' },
  { value: 'Aztlan', description: 'Inspired by Mesoamerica. An empire of blood sacrifice and ancient calendar magic.' },
]

// ── Sorcery types by nation ──
const SORCERIES = {
  'Avalon': 'Glamour', 'Inismore': 'Glamour', 'Highland Marches': 'Glamour',
  'Castille': 'Alquimia', 'Eisen': 'Hexenwerk', 'Montaigne': 'Porté',
  'Sarmatian Commonwealth': 'Sanderis', 'Ussura': 'Dar Matushki',
  'Vestenmennavenjar': 'Galdr', 'Vodacce': 'Sorte',
}

const SORCERY_INFO = {
  'Glamour': { nation: 'Avalon / Inismore / Highland Marches', description: 'The Knights of Avalon channel the power of legendary heroes through the Sidhe. By bonding with a legendary Knight, you gain access to their Glamour — supernatural abilities tied to their legend. At Rank 1, you bond with one Knight; at Rank 2, you bond with a second. Each Knight grants specific powers based on their legend.' },
  'Hexenwerk': { nation: 'Eisen', description: 'Dark alchemy involving Unguents — potions brewed from disturbing ingredients like corpse-parts, blood, and monster ichor. At Rank 1, you know 3 Unguents; at Rank 2, you know 6. Unguents can grant night-vision, inhuman strength, protection from harm, or raise the dead briefly.' },
  'Porté': { nation: 'Montaigne', description: 'Blood magic that tears holes in reality. A Porté sorcerer marks objects with their blood, then rips open a Porte to pull the item through space — or walks through the Porte to travel instantly. At Rank 1, you can pull Blooded objects to you. At Rank 2, you can create Walks (portals for travel). The Walkway between portals is a terrifying void.' },
  'Sanderis': { nation: 'Sarmatian Commonwealth', description: 'Pact magic with Losejai — powerful devils. The sorcerer trades Deals with their Dievas, gaining supernatural abilities in exchange for obligations. You and your Dievas are locked in a quiet war: you seek its true name to destroy it, while it tries to corrupt you. At Rank 1, you have 1 Deal; at Rank 2, you have 3 Deals.' },
  'Dar Matushki': { nation: 'Ussura', description: 'Mother\'s Touch — gifts from Matushka, the living spirit of Ussura. Ussurans who accept Matushka\'s guidance gain the ability to speak with animals, shapeshift, endure any weather, or command the land itself. At Rank 1, you gain 2 Gifts; at Rank 2, you gain 4 Gifts. Matushka\'s power only works on Ussuran soil.' },
  'Sorte': { nation: 'Vodacce', description: 'Fate witchery, practiced only by Vodacce women. Sorte strega can see the Strands of Fate connecting all people — strands of Cups (love), Coins (wealth), Swords (conflict), and Staves (authority). At Rank 1, you can Read strands. At Rank 2, you can Weave them, pulling or pushing fate. Manipulating fate always has consequences.' },
  'Galdr': { nation: 'Vestenmennavenjar', description: 'Rune magic of the ancient Vesten. By inscribing sacred runes on objects, weapons, or living skin, the Galdr sorcerer invokes the power of the old gods. At Rank 1, you know 3 Runes; at Rank 2, you know 6. Runes can be permanent inscriptions or temporary invocations.' },
  'Alquimia': { nation: 'Castille', description: 'The sacred science of transformation. Castillian alchemists study the elements and transmute matter through faith and reason. They create elixirs, transform materials, and channel elemental forces. Purchase as an Advantage.' },
}

// ── Advantages catalogue (7th Sea 2e Core Book) ──
const ADVANTAGES = [
  // 1-point Advantages
  { name: 'Able Drinker', cost: 1, description: 'Spend a Hero Point to avoid the effects of alcohol.' },
  { name: 'Cast Iron Stomach', cost: 1, description: 'Spend a Hero Point to ignore poison effects for a scene.' },
  { name: 'Direction Sense', cost: 1, description: 'Always know which way is north; never get lost.' },
  { name: 'Foreign Born', cost: 1, description: 'Choose a second Nation; gain its bonus.' },
  { name: 'Large', cost: 1, description: '+1 Bonus Die on Intimidate; take hits better but harder to hide.' },
  { name: 'Linguist', cost: 1, description: 'Speak, read, and write all Th\u00e9an languages.' },
  { name: 'Sea Legs', cost: 1, description: 'Never suffer penalties from rough seas or unsteady ground.' },
  { name: 'Small', cost: 1, description: '+1 Bonus Die on Hide; squeeze through tight spaces.' },
  { name: 'Survivalist', cost: 1, description: 'Spend a Hero Point to find food/water/shelter in the wild.' },
  { name: 'Time Sense', cost: 1, description: 'Always know what time it is; excellent internal clock.' },
  // 2-point Advantages
  { name: 'Barterer', cost: 2, description: 'Spend a Hero Point to find a buyer or seller for any item. (1 pt if Glamour Isles)' },
  { name: 'Come Hither', cost: 2, description: 'Spend a Hero Point to charm someone into a private conversation.' },
  { name: 'Connection', cost: 2, description: 'Spend a Hero Point to reveal a helpful contact in the current area.' },
  { name: 'Disarming Smile', cost: 2, description: 'Spend a Hero Point to keep someone from attacking for one Round.' },
  { name: 'Eagle Eyes', cost: 2, description: 'Spend a Hero Point to see fine details at great distance.' },
  { name: 'Extended Family', cost: 2, description: 'Spend a Hero Point to find a relative in the current area.' },
  { name: 'Fascinate', cost: 2, description: 'Spend a Hero Point to hold a target\'s attention with performance.' },
  { name: 'Friend at Court', cost: 2, description: 'Spend a Hero Point to get an audience with a noble.' },
  { name: 'Got It!', cost: 2, description: 'Spend a Hero Point to reveal you brought a useful mundane item.' },
  { name: 'Handy', cost: 2, description: 'Spend a Hero Point to repair a broken item temporarily.' },
  { name: 'Indomitable Will', cost: 2, description: 'Spend a Hero Point to resist fear or intimidation for a scene.' },
  { name: 'Inspire Generosity', cost: 2, description: 'Spend a Hero Point to convince someone to donate to your cause.' },
  { name: 'Leadership', cost: 2, description: 'Spend a Hero Point to rally allies, giving them +1 die. (1 pt if Sarmatian)' },
  { name: 'Staredown', cost: 2, description: 'Spend a Hero Point to intimidate an opponent into backing down. (1 pt if Eisen)' },
  { name: 'Streetwise', cost: 2, description: 'Spend a Hero Point to find the local criminal underworld.' },
  { name: 'Team Player', cost: 2, description: 'Spend a Hero Point to give your Raises to an ally.' },
  { name: 'Valiant Spirit', cost: 2, description: 'Spend a Hero Point to resist supernatural fear or compulsion.' },
  // 3-point Advantages
  { name: 'An Honest Misunderstanding', cost: 3, description: 'Spend a Hero Point to have been elsewhere when accused.' },
  { name: 'Bar Fighter', cost: 3, description: 'Spend a Hero Point to improvise a weapon from your surroundings.' },
  { name: 'Boxer', cost: 3, description: 'Spend a Hero Point to knock out a target with a bare-fisted strike.' },
  { name: 'Bruiser', cost: 3, description: '+1 Bonus Die when using a heavy melee weapon.' },
  { name: 'Brush Pass', cost: 3, description: 'Spend a Hero Point to slip a small item to someone unnoticed.' },
  { name: 'Camaraderie', cost: 3, description: 'Spend a Hero Point to inspire your allies to fight harder. (2 pts if Montaigne)' },
  { name: 'Deadeye', cost: 3, description: '+1 Bonus Die when using a pistol or thrown weapon.' },
  { name: 'Dynamic Approach', cost: 3, description: 'Spend a Hero Point to change your Approach after seeing results.' },
  { name: 'Fencer', cost: 3, description: 'Spend a Hero Point to reroll a single die on a Weaponry roll.' },
  { name: 'Foul Weather Jack', cost: 3, description: 'Gain a second Hero Story.' },
  { name: 'Masterpiece Crafter', cost: 3, description: 'Create signature items with special properties. (2 pts if Vesten)' },
  { name: 'Opportunist', cost: 3, description: '+1 Bonus Die on attacks against unaware targets.' },
  { name: 'Ordained', cost: 3, description: 'Sanctuary in churches; +1 Bonus Die on social rolls with faithful. (2 pts if Castillian)' },
  { name: 'Patron', cost: 3, description: 'A wealthy patron provides resources and missions.' },
  { name: 'Perfect Balance', cost: 3, description: 'Spend a Hero Point to keep your footing in any situation.' },
  { name: 'Poison Immunity', cost: 3, description: 'Immune to all mundane poisons. (1 pt if Vodacce)' },
  { name: 'Psst, Over Here', cost: 3, description: 'Spend a Hero Point to lure a target into an ambush.' },
  { name: 'Quick Reflexes', cost: 3, description: '+1 Bonus Die on rolls to react to sudden danger.' },
  { name: 'Reckless Takedown', cost: 3, description: 'Spend a Hero Point to wipe out a Brute Squad, take 1 DW.' },
  { name: 'Reputation', cost: 3, description: '+1 Bonus Die on social rolls when your reputation precedes you.' },
  { name: 'Rich', cost: 3, description: 'Start each session with extra Wealth.' },
  { name: 'Second Story Work', cost: 3, description: 'Spend a Hero Point to find entry to any building.' },
  { name: 'Signature Item', cost: 3, description: 'A beloved item grants +1 Bonus Die when used.' },
  { name: 'Slip Free', cost: 3, description: 'Spend a Hero Point to escape bonds, grapples, or cells.' },
  { name: 'Sniper', cost: 3, description: '+1 Bonus Die when attacking from a hidden position with a ranged weapon.' },
  { name: 'Specialist', cost: 3, description: 'Choose one Skill; earn 2 Raises instead of 1 on sets of 15+.' },
  { name: 'Tenure', cost: 3, description: 'Academic position provides resources and social standing.' },
  { name: 'Trusted Companion', cost: 3, description: 'A loyal NPC ally who aids you.' },
  { name: 'Virtuoso', cost: 3, description: '+1 Bonus Die on all Perform rolls.' },
  // 4-point Advantages
  { name: 'Academy', cost: 4, description: 'Formal military training; +1 to two Skills.' },
  { name: 'Alchemist', cost: 4, description: 'Create alchemical concoctions. (Castillian only)' },
  { name: 'Hard to Kill', cost: 4, description: '+1 Dramatic Wound before becoming Helpless.' },
  { name: 'Legendary Trait', cost: 4, description: 'Choose a Trait; treat as 1 higher for one roll per scene.' },
  { name: 'Lyceum', cost: 4, description: 'Studied at the Lyceum; +1 to two Skills.' },
  { name: 'Miracle Worker', cost: 4, description: 'Spend a Hero Point to heal 1 Dramatic Wound on a target.' },
  { name: 'Riot Breaker', cost: 4, description: 'Reduce Brute Squad damage by your Resolve.' },
  { name: 'Seidr', cost: 4, description: 'Skald naming and divination powers. (Vesten only)' },
  { name: 'Sorcery', cost: 4, description: 'Access to your nation\'s sorcery tradition.' },
  // 5-point Advantages
  { name: 'Duelist Academy', cost: 5, description: 'Trained in a formal Dueling Style; gain Style Bonus.' },
  { name: 'I Won\'t Die Here', cost: 5, description: 'Spend a Hero Point to survive lethal damage. (3 pts if Eisen)' },
  { name: 'I\'m Taking You With Me', cost: 5, description: 'Deal extra damage from your Dramatic Wounds. (3 pts if Vesten)' },
  { name: 'Joie de Vivre', cost: 5, description: 'Dice \u2264 Skill rank count as 10s when aiding allies. (3 pts if Montaigne)' },
  { name: 'Spark of Genius', cost: 5, description: 'Spend a Hero Point to gain Raises = Wits. (3 pts if Castillian)' },
  { name: 'Strength of Ten', cost: 5, description: 'Spend a Hero Point for +dice = Brawn/Resolve. (3 pts if Ussuran)' },
  { name: 'The Devil\'s Own Luck', cost: 5, description: 'Spend a Hero Point to reroll all dice. (3 pts if Glamour Isles)' },
  { name: 'Together We Are Strong', cost: 5, description: 'Allies in the scene add dice to your roll. (3 pts if Sarmatian)' },
  { name: 'University', cost: 5, description: 'Extensive education; +1 to three Skills.' },
  { name: 'We\'re Not So Different', cost: 5, description: 'Spend a Hero Point to gain a Villain\'s trust. (3 pts if Vodacce)' },
]

// ── All 20 Arcana (2e Core Book) ──
const VIRTUES = [
  'The Fool — Wily: Activate when you act on insufficient information. Gain 1 Hero Point.',
  'The Road — Friendly: Activate when you meet someone for the first time. Gain 1 Hero Point.',
  'The Magician — Willful: Activate when you solve a problem through sheer determination. Gain 1 Hero Point.',
  'The Lovers — Passionate: Activate when you put yourself in danger to protect someone you love. Gain 1 Hero Point.',
  'The Wheel — Fortunate: Activate when you stumble upon something that benefits you unexpectedly. Gain 1 Hero Point.',
  'The Devil — Astute: Activate when you uncover a deception. Gain 1 Hero Point.',
  'The Tower — Humble: Activate when you sacrifice something important to help someone in need. Gain 1 Hero Point.',
  'The Beggar — Insightful: Activate when you discover something nobody else noticed. Gain 1 Hero Point.',
  'The War — Victorious: Activate when you defeat a Villain in combat. Gain 1 Hero Point.',
  'The Hanged Man — Altruistic: Activate when you sacrifice something for the greater good with no reward. Gain 1 Hero Point.',
  'The Witch — Intuitive: Activate when you correctly guess a character\'s motivation. Gain 1 Hero Point.',
  'The Thrones — Comforting: Activate when you ease someone\'s suffering. Gain 1 Hero Point.',
  'The Moonless Night — Subtle: Activate when you accomplish a goal without anyone noticing. Gain 1 Hero Point.',
  'Reunion — Exemplary: Activate when you set an example for others to follow. Gain 1 Hero Point.',
  'The Hero — Courageous: Activate when you risk life and limb to save someone. Gain 1 Hero Point.',
  'The Glyph — Temperate: Activate when you resist temptation and choose the difficult path. Gain 1 Hero Point.',
  'The Sun — Glorious: Activate when you achieve an impressive feat witnessed by others. Gain 1 Hero Point.',
  'The Prophet — Illuminating: Activate when you teach someone a valuable lesson. Gain 1 Hero Point.',
  'The Emperor — Commanding: Activate when you lead a group successfully. Gain 1 Hero Point.',
  'Coins — Adaptable: Activate when you turn a setback into an opportunity. Gain 1 Hero Point.',
]

const HUBRISES = [
  'The Fool — Curious: Receive a Hero Point when you investigate something dangerous.',
  'The Road — Underconfident: Receive a Hero Point when you doubt yourself at a critical moment.',
  'The Magician — Ambitious: Receive a Hero Point when you chase power at the expense of others.',
  'The Lovers — Star-Crossed: Receive a Hero Point when your romantic entanglement causes problems.',
  'The Wheel — Unfortunate: Receive a Hero Point when bad luck catches up with you.',
  'The Devil — Trusting: Receive a Hero Point when you trust someone you shouldn\'t.',
  'The Tower — Arrogant: Receive a Hero Point when your pride leads you into trouble.',
  'The Beggar — Envious: Receive a Hero Point when you covet what someone else has.',
  'The War — Loyal: Receive a Hero Point when your loyalty to someone gets you in trouble.',
  'The Hanged Man — Indecisive: Receive a Hero Point when you hesitate and miss an opportunity.',
  'The Witch — Manipulative: Receive a Hero Point when you manipulate someone who trusts you.',
  'The Thrones — Stubborn: Receive a Hero Point when you refuse to change your mind when you should.',
  'The Moonless Night — Confusion: Receive a Hero Point when you overthink and make the wrong choice.',
  'Reunion — Bitterness: Receive a Hero Point when your resentment drives your actions.',
  'The Hero — Foolhardy: Receive a Hero Point when you rush into danger without a plan.',
  'The Glyph — Superstitious: Receive a Hero Point when your superstitions cause problems.',
  'The Sun — Proud: Receive a Hero Point when your need for recognition costs you.',
  'The Prophet — Overzealous: Receive a Hero Point when your fervor alienates someone.',
  'The Emperor — Hot-Headed: Receive a Hero Point when your temper makes things worse.',
  'Coins — Relentless: Receive a Hero Point when you refuse to give up when you should.',
]

// ── Backgrounds (2e Core Book) ──
const BACKGROUND_CATALOG = [
  { name: 'Archaeologist', description: 'Ruins explorer. Skills: Athletics, Empathy, Notice, Ride, Scholarship. Advantages: Direction Sense, Linguist. Quirk: Earn a Hero Point when you solve a mystery.', skills: ['Athletics', 'Empathy', 'Notice', 'Ride', 'Scholarship'], advantages: ['Direction Sense', 'Linguist'], quirk: 'Earn a Hero Point when you solve a mystery.' },
  { name: 'Aristocrat', description: 'Born to privilege. Skills: Aim, Convince, Empathy, Ride, Scholarship. Advantages: Rich, Disarming Smile. Quirk: Earn a Hero Point when you prove there is more to you than your noble birth.', skills: ['Aim', 'Convince', 'Empathy', 'Ride', 'Scholarship'], advantages: ['Rich', 'Disarming Smile'], quirk: 'Earn a Hero Point when you prove there is more to you than your noble birth.' },
  { name: 'Army Officer', description: 'Military leader. Skills: Aim, Athletics, Intimidate, Ride, Warfare. Advantages: Leadership, Academy. Quirk: Earn a Hero Point when you lead soldiers into danger.', skills: ['Aim', 'Athletics', 'Intimidate', 'Ride', 'Warfare'], advantages: ['Leadership', 'Academy'], quirk: 'Earn a Hero Point when you lead soldiers into danger.' },
  { name: 'Artist', description: 'Creative soul. Skills: Convince, Empathy, Notice, Perform, Tempt. Advantages: Virtuoso, Fascinate. Quirk: Earn a Hero Point when you express yourself and inspire someone.', skills: ['Convince', 'Empathy', 'Notice', 'Perform', 'Tempt'], advantages: ['Virtuoso', 'Fascinate'], quirk: 'Earn a Hero Point when you express yourself and inspire someone.' },
  { name: 'Assassin', description: 'Silent killer. Skills: Athletics, Empathy, Hide, Intimidate, Weaponry. Advantages: Fencer, Psst Over Here. Quirk: Earn a Hero Point when you kill a target no one thought you could reach.', skills: ['Athletics', 'Empathy', 'Hide', 'Intimidate', 'Weaponry'], advantages: ['Fencer', 'Psst Over Here'], quirk: 'Earn a Hero Point when you kill a target no one thought you could reach.' },
  { name: 'Cavalry', description: 'Mounted warrior. Skills: Intimidate, Notice, Ride, Warfare, Weaponry. Advantages: Bruiser, Indomitable Will. Quirk: Earn a Hero Point when you lead a mounted charge.', skills: ['Intimidate', 'Notice', 'Ride', 'Warfare', 'Weaponry'], advantages: ['Bruiser', 'Indomitable Will'], quirk: 'Earn a Hero Point when you lead a mounted charge.' },
  { name: 'Courtier', description: 'Political player. Skills: Convince, Empathy, Perform, Scholarship, Tempt. Advantages: Friend at Court, Come Hither. Quirk: Earn a Hero Point when you resolve a conflict via social grace.', skills: ['Convince', 'Empathy', 'Perform', 'Scholarship', 'Tempt'], advantages: ['Friend at Court', 'Come Hither'], quirk: 'Earn a Hero Point when you resolve a conflict via social grace.' },
  { name: 'Crafter', description: 'Skilled artisan. Skills: Athletics, Convince, Notice, Perform, Scholarship. Advantages: Masterpiece Crafter, Handy. Quirk: Earn a Hero Point when you create something useful.', skills: ['Athletics', 'Convince', 'Notice', 'Perform', 'Scholarship'], advantages: ['Masterpiece Crafter', 'Handy'], quirk: 'Earn a Hero Point when you create something useful.' },
  { name: 'Criminal', description: 'Underworld figure. Skills: Athletics, Hide, Intimidate, Theft, Weaponry. Advantages: Streetwise, Got It!. Quirk: Earn a Hero Point when you break the law for a good reason.', skills: ['Athletics', 'Hide', 'Intimidate', 'Theft', 'Weaponry'], advantages: ['Streetwise', 'Got It!'], quirk: 'Earn a Hero Point when you break the law for a good reason.' },
  { name: 'Doctor', description: 'Physician and healer. Skills: Convince, Empathy, Notice, Scholarship, Warfare. Advantages: Miracle Worker, Eagle Eyes. Quirk: Earn a Hero Point when you tend to the wounded.', skills: ['Convince', 'Empathy', 'Notice', 'Scholarship', 'Warfare'], advantages: ['Miracle Worker', 'Eagle Eyes'], quirk: 'Earn a Hero Point when you tend to the wounded.' },
  { name: 'Duelist', description: 'Swordfighter. Skills: Athletics, Empathy, Intimidate, Perform, Weaponry. Advantages: Duelist Academy. Quirk: Earn a Hero Point when you resolve a conflict through single combat.', skills: ['Athletics', 'Empathy', 'Intimidate', 'Perform', 'Weaponry'], advantages: ['Duelist Academy'], quirk: 'Earn a Hero Point when you resolve a conflict through single combat.' },
  { name: 'Engineer', description: 'Builder and inventor. Skills: Athletics, Notice, Ride, Scholarship, Warfare. Advantages: Academy, Handy. Quirk: Earn a Hero Point when you solve a problem with engineering.', skills: ['Athletics', 'Notice', 'Ride', 'Scholarship', 'Warfare'], advantages: ['Academy', 'Handy'], quirk: 'Earn a Hero Point when you solve a problem with engineering.' },
  { name: 'Explorer', description: 'Globe-trotter. Skills: Athletics, Notice, Ride, Sailing, Scholarship. Advantages: Connection, Direction Sense. Quirk: Earn a Hero Point when you discover a new place.', skills: ['Athletics', 'Notice', 'Ride', 'Sailing', 'Scholarship'], advantages: ['Connection', 'Direction Sense'], quirk: 'Earn a Hero Point when you discover a new place.' },
  { name: 'Farmkid', description: 'Rural upbringing. Skills: Athletics, Empathy, Hide, Notice, Ride. Advantages: Survivalist, Team Player. Quirk: Earn a Hero Point when you put simple values ahead of politics.', skills: ['Athletics', 'Empathy', 'Hide', 'Notice', 'Ride'], advantages: ['Survivalist', 'Team Player'], quirk: 'Earn a Hero Point when you put simple values ahead of politics.' },
  { name: 'Hunter', description: 'Tracker and scout. Skills: Aim, Athletics, Hide, Notice, Ride. Advantages: Survivalist, Eagle Eyes. Quirk: Earn a Hero Point when you catch your prey.', skills: ['Aim', 'Athletics', 'Hide', 'Notice', 'Ride'], advantages: ['Survivalist', 'Eagle Eyes'], quirk: 'Earn a Hero Point when you catch your prey.' },
  { name: 'Jenny/Jack', description: 'Companion for hire. Skills: Convince, Empathy, Notice, Perform, Tempt. Advantages: Come Hither, Streetwise. Quirk: Earn a Hero Point when you uncover a secret.', skills: ['Convince', 'Empathy', 'Notice', 'Perform', 'Tempt'], advantages: ['Come Hither', 'Streetwise'], quirk: 'Earn a Hero Point when you uncover a secret.' },
  { name: 'Mercenary', description: 'Sword for hire. Skills: Athletics, Brawl, Intimidate, Notice, Weaponry. Advantages: Hard to Kill, Cast Iron Stomach. Quirk: Earn a Hero Point when you complete a dangerous job for pay.', skills: ['Athletics', 'Brawl', 'Intimidate', 'Notice', 'Weaponry'], advantages: ['Hard to Kill', 'Cast Iron Stomach'], quirk: 'Earn a Hero Point when you complete a dangerous job for pay.' },
  { name: 'Merchant', description: 'Trader. Skills: Convince, Notice, Ride, Scholarship, Tempt. Advantages: Barterer, Rich. Quirk: Earn a Hero Point when you negotiate a profitable deal.', skills: ['Convince', 'Notice', 'Ride', 'Scholarship', 'Tempt'], advantages: ['Barterer', 'Rich'], quirk: 'Earn a Hero Point when you negotiate a profitable deal.' },
  { name: 'Naval Officer', description: 'Officer of the fleet. Skills: Intimidate, Notice, Sailing, Warfare, Weaponry. Advantages: Perfect Balance, Sea Legs. Quirk: Earn a Hero Point when you lead sailors through a crisis.', skills: ['Intimidate', 'Notice', 'Sailing', 'Warfare', 'Weaponry'], advantages: ['Perfect Balance', 'Sea Legs'], quirk: 'Earn a Hero Point when you lead sailors through a crisis.' },
  { name: 'Orphan', description: 'Raised alone. Skills: Athletics, Brawl, Hide, Notice, Theft. Advantages: Streetwise, Survivalist. Quirk: Earn a Hero Point when you rely on yourself to solve a problem.', skills: ['Athletics', 'Brawl', 'Hide', 'Notice', 'Theft'], advantages: ['Streetwise', 'Survivalist'], quirk: 'Earn a Hero Point when you rely on yourself to solve a problem.' },
  { name: 'Performer', description: 'Entertainer. Skills: Athletics, Convince, Empathy, Perform, Tempt. Advantages: Fascinate, Virtuoso. Quirk: Earn a Hero Point when you entertain an audience.', skills: ['Athletics', 'Convince', 'Empathy', 'Perform', 'Tempt'], advantages: ['Fascinate', 'Virtuoso'], quirk: 'Earn a Hero Point when you entertain an audience.' },
  { name: 'Pirate', description: 'Sea raider. Skills: Athletics, Brawl, Intimidate, Sailing, Weaponry. Advantages: Sea Legs, Bar Fighter. Quirk: Earn a Hero Point when you rob from the rich.', skills: ['Athletics', 'Brawl', 'Intimidate', 'Sailing', 'Weaponry'], advantages: ['Sea Legs', 'Bar Fighter'], quirk: 'Earn a Hero Point when you rob from the rich.' },
  { name: 'Priest', description: 'Cleric. Skills: Convince, Empathy, Notice, Perform, Scholarship. Advantages: Ordained, Valiant Spirit. Quirk: Earn a Hero Point when you defend the faith.', skills: ['Convince', 'Empathy', 'Notice', 'Perform', 'Scholarship'], advantages: ['Ordained', 'Valiant Spirit'], quirk: 'Earn a Hero Point when you defend the faith.' },
  { name: 'Professor', description: 'Academic teacher. Skills: Convince, Empathy, Perform, Scholarship, Tempt. Advantages: Tenure, Team Player. Quirk: Earn a Hero Point when you teach someone an important lesson.', skills: ['Convince', 'Empathy', 'Perform', 'Scholarship', 'Tempt'], advantages: ['Tenure', 'Team Player'], quirk: 'Earn a Hero Point when you teach someone an important lesson.' },
  { name: 'Pugilist', description: 'Bare-knuckle fighter. Skills: Athletics, Brawl, Intimidate, Notice, Perform. Advantages: Boxer, Bar Fighter. Quirk: Earn a Hero Point when you win a fight with your bare hands.', skills: ['Athletics', 'Brawl', 'Intimidate', 'Notice', 'Perform'], advantages: ['Boxer', 'Bar Fighter'], quirk: 'Earn a Hero Point when you win a fight with your bare hands.' },
  { name: 'Quartermaster', description: 'Ship supplier. Skills: Aim, Brawl, Hide, Sailing, Warfare. Advantages: Handy, Got It!, Sea Legs. Quirk: Earn a Hero Point when you provide for your crew.', skills: ['Aim', 'Brawl', 'Hide', 'Sailing', 'Warfare'], advantages: ['Handy', 'Got It!', 'Sea Legs'], quirk: 'Earn a Hero Point when you provide for your crew.' },
  { name: 'Sailor', description: 'Seafarer. Skills: Athletics, Brawl, Notice, Sailing, Weaponry. Advantages: Sea Legs, Perfect Balance. Quirk: Earn a Hero Point when you put the ship above yourself.', skills: ['Athletics', 'Brawl', 'Notice', 'Sailing', 'Weaponry'], advantages: ['Sea Legs', 'Perfect Balance'], quirk: 'Earn a Hero Point when you put the ship above yourself.' },
  { name: 'Scholar', description: 'Academic. Skills: Convince, Empathy, Notice, Scholarship, Tempt. Advantages: University, Linguist. Quirk: Earn a Hero Point when you use knowledge to solve a problem.', skills: ['Convince', 'Empathy', 'Notice', 'Scholarship', 'Tempt'], advantages: ['University', 'Linguist'], quirk: 'Earn a Hero Point when you use knowledge to solve a problem.' },
  { name: 'Servant', description: 'In service to others. Skills: Athletics, Convince, Empathy, Hide, Notice. Advantages: Got It!, Streetwise. Quirk: Earn a Hero Point when you go unnoticed to help your allies.', skills: ['Athletics', 'Convince', 'Empathy', 'Hide', 'Notice'], advantages: ['Got It!', 'Streetwise'], quirk: 'Earn a Hero Point when you go unnoticed to help your allies.' },
  { name: 'Ship Captain', description: 'Master of a vessel. Skills: Aim, Convince, Notice, Sailing, Warfare. Advantages: Leadership, Sea Legs. Quirk: Earn a Hero Point when your orders save the ship.', skills: ['Aim', 'Convince', 'Notice', 'Sailing', 'Warfare'], advantages: ['Leadership', 'Sea Legs'], quirk: 'Earn a Hero Point when your orders save the ship.' },
  { name: 'Soldier', description: 'Professional warrior. Skills: Aim, Athletics, Brawl, Intimidate, Warfare. Advantages: Academy, Indomitable Will. Quirk: Earn a Hero Point when you follow orders despite danger.', skills: ['Aim', 'Athletics', 'Brawl', 'Intimidate', 'Warfare'], advantages: ['Academy', 'Indomitable Will'], quirk: 'Earn a Hero Point when you follow orders despite danger.' },
  { name: 'Spy', description: 'Infiltrator. Skills: Convince, Hide, Notice, Tempt, Theft. Advantages: Brush Pass, An Honest Misunderstanding. Quirk: Earn a Hero Point when you complete a covert mission.', skills: ['Convince', 'Hide', 'Notice', 'Tempt', 'Theft'], advantages: ['Brush Pass', 'An Honest Misunderstanding'], quirk: 'Earn a Hero Point when you complete a covert mission.' },
]

// ── Secret Societies (2e Core Book) ──
const SECRET_SOCIETIES = [
  { value: 'The Brotherhood of the Coast', description: 'Pirate brotherhood dedicated to freedom of the seas.' },
  { value: 'Die Kreuzritter', description: 'Ancient order fighting supernatural threats in the shadows.' },
  { value: "The Explorer's Society", description: 'Seekers of lost knowledge and ancient artifacts.' },
  { value: 'The Invisible College', description: 'Scientists preserving knowledge from Vaticine persecution.' },
  { value: 'Knights of the Rose & Cross', description: 'Champions of justice who protect the innocent.' },
  { value: 'Los Vagabundos', description: 'Masked vigilantes fighting tyranny in Castille.' },
  { value: 'Mociutes Skara', description: 'Sarmatian witches guarding ancient pacts and traditions.' },
  { value: 'Rilasciare', description: 'Revolutionary anarchists seeking to overthrow all tyrants.' },
  { value: "Sophia's Daughters", description: 'Secret sisterhood protecting women across Th\u00e9ah.' },
  { value: 'Novus Ordo Mundi', description: 'Shadowy manipulators seeking to control nations from behind the scenes.' },
]

const INITIAL = {
  npc: false, splat: 'SEVENTH_SEA',
  name: '', altName: '', concept: '',
  nation: '', religion: '',
  nature: '', demeanor: '',
  traitBrawn: 2, traitFinesse: 2, traitResolve: 2, traitWits7s: 2, traitPanache: 2,
  skillAim: 0, skillAthletics7s: 0, skillBrawl7s: 0, skillConvince: 0,
  skillEmpathy7s: 0, skillHide: 0, skillIntimidate7s: 0, skillNotice: 0,
  skillPerform7s: 0, skillRide7s: 0, skillSailing: 0, skillScholarship: 0,
  skillTempt: 0, skillTheft: 0, skillWarfare: 0, skillWeaponry: 0,
  heroVirtue: '', heroHubris: '',
  sorceryDesc: '',
  heroPoints: 1, wealth7s: 0, corruption: 0, dramaticWounds: 0,
  willpower: 0, currentWillpower: 0,
  heroStories: '', backstory: '', notes: '', appearanceDesc: '', personalItems: '',
}

const TAB_KEYS = ['tabIdentity', 'tab7sTraits', 'tab7sSkills', 'tab7sAdvantages', 'tab7sSorcery', 'tab7sDueling', 'tab7sArcana', 'tab7sBackgrounds', 'tab7sStories', 'tab7sBelongings', 'tabBackstory', 'tabXpLog', 'tabRulesRef', 'tabDiceRoller']

// ── Dueling Styles (2e Core Book) ──
const DUELING_STYLES = [
  { name: 'Aldana', nation: 'Castille', description: 'Fluid and graceful, Aldana focuses on using your opponent\'s aggression against them. Uses Finesse. Maneuvers: Feint (turn a Slash into bonus dice), Riposte (deal damage when you parry).' },
  { name: 'Ambrogia', nation: 'Vodacce', description: 'Dual-wielding style using a main-gauche. Fights with two weapons simultaneously. Uses Finesse. Maneuvers: Slash (basic attack), Feint, Lunge (extra Wounds on hit).' },
  { name: 'Donovan', nation: 'Avalon', description: 'Heavy-hitting and defensive. Uses Resolve. Maneuvers: Bash (knock opponent off-balance), Riposte, Slash.' },
  { name: 'Drexel', nation: 'Eisen', description: 'Two-handed weapon style — greatswords, polearms. Powerful but slow. Uses Brawn. Maneuvers: Slash, Beat (destroy opponent\'s weapon), Lunge.' },
  { name: 'Eisenfaust', nation: 'Eisen', description: 'Panzerhand (iron gauntlet) fighting. Catches blades bare-handed. Uses Resolve. Maneuvers: Slash, Riposte, Iron Reply (catch and counter).' },
  { name: 'Leegstra', nation: 'Vestenmennavenjar', description: 'Berserker fury — fights without regard for personal safety. Uses Brawn. Maneuvers: Slash, Lunge, Rage (take Wounds to deal extra damage).' },
  { name: 'Mantovani', nation: 'Vodacce', description: 'Cloak-and-rapier, deceptive and theatrical. Uses Panache. Maneuvers: Feint, Flourish (distract and reposition), Slash.' },
  { name: 'Mireli', nation: 'Sarmatian Commonwealth', description: 'Sabre style emphasizing speed and mounted combat. Uses Finesse. Maneuvers: Slash, Feint, Lunge.' },
  { name: 'Sabat', nation: 'Crescent Empire', description: 'Scimitar fighting incorporating footwork and misdirection. Uses Panache. Maneuvers: Slash, Feint, Flourish.' },
  { name: 'Torres', nation: 'Castille', description: 'Defensive and patient, waiting for the perfect counter. Uses Wits. Maneuvers: Riposte, Bash, Slash.' },
  { name: 'Valroux', nation: 'Montaigne', description: 'Classic fencing — elegant, precise, and lethal. The quintessential rapier school. Uses Finesse. Maneuvers: Slash, Feint, Lunge.' },
  { name: 'Boucher', nation: 'Montaigne', description: 'A brutal Montaigne street-fighting style. Uses Brawn. Uses overwhelming force and dirty tricks. Style Bonus: Boucher Step — spend a Hero Point to deal wounds equal to Brawn to a Brute Squad.' },
]

const VIRTUE_CATALOG = VIRTUES.map(v => ({ value: v, description: v.split(' — ')[1] || '' }))
const HUBRIS_CATALOG = HUBRISES.map(h => ({ value: h, description: h.split(' — ')[1] || '' }))

const TRAIT_KEYS = ['traitBrawn', 'traitFinesse', 'traitResolve', 'traitWits7s', 'traitPanache']
const TRAIT_LABEL = { traitBrawn: 'Brawn', traitFinesse: 'Finesse', traitResolve: 'Resolve', traitWits7s: 'Wits', traitPanache: 'Panache' }
const TRAIT_NAME_TO_KEY = { 'Brawn': 'traitBrawn', 'Finesse': 'traitFinesse', 'Resolve': 'traitResolve', 'Wits': 'traitWits7s', 'Panache': 'traitPanache' }

// Map dueling style name → primary trait used
const DUELING_STYLE_TRAIT = {
  'Aldana': 'Finesse', 'Ambrogia': 'Finesse', 'Donovan': 'Resolve', 'Drexel': 'Brawn',
  'Eisenfaust': 'Resolve', 'Leegstra': 'Brawn', 'Mantovani': 'Panache', 'Mireli': 'Finesse',
  'Sabat': 'Panache', 'Torres': 'Wits', 'Valroux': 'Finesse', 'Boucher': 'Brawn',
}

// Story step → reward tier mapping
const STORY_REWARD_TIERS = [
  { steps: 1, reward: '1-pt Advantage or new Skill Rank' },
  { steps: 2, reward: '2-pt Advantage' },
  { steps: 3, reward: '3-pt Advantage' },
  { steps: 4, reward: '4-pt Advantage' },
  { steps: 5, reward: '5-pt Advantage or +1 to a Trait' },
]
const SKILL_KEYS = [
  'skillAim', 'skillAthletics7s', 'skillBrawl7s', 'skillConvince',
  'skillEmpathy7s', 'skillHide', 'skillIntimidate7s', 'skillNotice',
  'skillPerform7s', 'skillRide7s', 'skillSailing', 'skillScholarship',
  'skillTempt', 'skillTheft', 'skillWarfare', 'skillWeaponry',
]

// Guided creation budgets (7th Sea 2e: 2 free + 1 from nation = 3 total bonus)
const TRAIT_BUDGET = 2
const SKILL_BUDGET = 10
const ADVANTAGE_BUDGET = 5

export default function SeventhSeaForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const [searchParams] = useSearchParams()
  const viewMode = searchParams.get('mode') === 'view'
  const guidedMode = searchParams.get('mode') === 'guided'
  const characterId = paramId || null

  useEffect(() => { switchTheme('7thsea') }, [])

  const { isAutoCreating } = useAutoCreate(characterId, INITIAL)

  const [tab, setTab] = useState(0)
  const [fields, setFields] = useState(INITIAL)
  const [backgrounds, setBackgrounds] = useState([])
  const [disciplines, setDisciplines] = useState([])
  const [xpLog, setXpLog] = useState([])
  const [newBackground, setNewBackground] = useState({ name: '', level: 1, description: '' })
  const [newAdv, setNewAdv] = useState({ name: '', level: 1, notes: '' })
  const [tagInfo, setTagInfo] = useState(null)
  const [advSearch, setAdvSearch] = useState('')
  const [bgSearch, setBgSearch] = useState('')
  const [activeDuelStyle, setActiveDuelStyle] = useState('')
  const [newStory, setNewStory] = useState({ title: '', goal: '', reward: '', steps: '' })
  const [templateName, setTemplateName] = useState('')
  const [nationBonusTrait, setNationBonusTrait] = useState(null) // which trait got the +1
  const [wounds, setWounds] = useState(0) // regular wounds counter
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

  function handleField(name, value) {
    // When nation changes, revert old bonus and clear picker
    if (name === 'nation') {
      if (nationBonusTrait) {
        const key = TRAIT_NAME_TO_KEY[nationBonusTrait]
        if (key) setFields(prev => ({ ...prev, [key]: Math.max(2, prev[key] - 1), [name]: typeof value === 'string' ? value : Number(value) }))
        else setFields(prev => ({ ...prev, [name]: typeof value === 'string' ? value : Number(value) }))
        setNationBonusTrait(null)
        return
      }
    }
    setFields(prev => ({ ...prev, [name]: typeof value === 'string' ? value : Number(value) }))
  }
  function handleText(e) { setFields(prev => ({ ...prev, [e.target.name]: e.target.value })) }

  // Apply national trait bonus
  function applyNationBonus(traitName) {
    // Revert old bonus if any
    if (nationBonusTrait) {
      const oldKey = TRAIT_NAME_TO_KEY[nationBonusTrait]
      if (oldKey) setFields(prev => ({ ...prev, [oldKey]: Math.max(2, prev[oldKey] - 1) }))
    }
    // Apply new bonus
    const newKey = TRAIT_NAME_TO_KEY[traitName]
    if (newKey) {
      setFields(prev => ({ ...prev, [newKey]: Math.min(5, prev[newKey] + 1) }))
      setNationBonusTrait(traitName)
    }
  }

  async function handleSave() {
    setSaving(true); setSaveError(null)
    try { await updateCharacter(characterId, fields) }
    catch { setSaveError(t('failedToSave')) }
    finally { setSaving(false) }
  }

  async function handleDoneEditing() { await handleSave(); navigate('/7thsea') }

  function loadTemplate(templateNameVal) {
    const tmpl = SEVEN_SEA_HERO_NPCS.find(t => t.name === templateNameVal)
    if (!tmpl) return
    setTemplateName(templateNameVal)
    setFields(prev => ({
      ...prev,
      name: tmpl.name,
      concept: tmpl.description || '',
      nation: tmpl.nation || '',
      traitBrawn: tmpl.brawn || 2,
      traitFinesse: tmpl.finesse || 2,
      traitResolve: tmpl.resolve || 2,
      traitWits7s: tmpl.wits || 2,
      traitPanache: tmpl.panache || 2,
      heroVirtue: tmpl.virtue || '',
      heroHubris: tmpl.hubris || '',
      notes: tmpl.notes || '',
    }))
  }

  async function handleAddBackground() {
    if (!newBackground.name.trim()) return
    try {
      const res = await addBackground(characterId, newBackground)
      setBackgrounds(prev => [...prev, res.data])
      setNewBackground({ name: '', level: 1, description: '' })
    } catch { setActionError(t('failedToSave')) }
  }

  async function handleAddAdvantage() {
    if (!newAdv.name.trim()) return
    try {
      const hit = ADVANTAGES.find(a => a.name === newAdv.name)
      const adv = hit ? { name: hit.name, level: hit.cost, notes: '' } : newAdv
      const res = await addDiscipline(characterId, adv)
      setDisciplines(prev => [...prev, res.data])
      setNewAdv({ name: '', level: 1, notes: '' })
    } catch { setActionError(t('failedToSave')) }
  }

  // ── Story helpers ──
  function parseStories(text) {
    if (!text) return []
    const stories = []
    let current = null
    for (const line of text.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed) continue
      if (trimmed.match(/^Story \d+:|^###|^---/) || (!current && trimmed)) {
        if (current) stories.push(current)
        current = { title: trimmed.replace(/^Story \d+:\s*/, '').replace(/^###\s*/, ''), lines: [] }
      } else if (current) {
        current.lines.push(trimmed)
      }
    }
    if (current) stories.push(current)
    return stories
  }
  const parsedStories = parseStories(fields.heroStories)

  function handleAddStory() {
    if (!newStory.title.trim()) return
    const stepLines = newStory.steps ? newStory.steps.split('\n').filter(s => s.trim()).map((s, i) => `  Step ${i + 1}: ${s.trim()}`).join('\n') : ''
    const block = `Story ${parsedStories.length + 1}: ${newStory.title}\nGoal: ${newStory.goal}\nReward: ${newStory.reward}${stepLines ? '\n' + stepLines : ''}`
    const current = fields.heroStories || ''
    setFields(prev => ({ ...prev, heroStories: current ? current + '\n\n' + block : block }))
    setNewStory({ title: '', goal: '', reward: '', steps: '' })
  }

  function handleRemoveStory(index) {
    const blocks = (fields.heroStories || '').split(/\n\n+/)
    blocks.splice(index, 1)
    setFields(prev => ({ ...prev, heroStories: blocks.join('\n\n') }))
  }

  // ── Guided mode budget trackers ──
  const traitSpent = TRAIT_KEYS.reduce((sum, k) => sum + (fields[k] - 2), 0)
  const skillSpent = SKILL_KEYS.reduce((sum, k) => sum + fields[k], 0)
  const advSpent = disciplines.reduce((sum, d) => sum + (d.level || 0), 0)

  function PointsBudget({ spent, budget }) {
    const remaining = budget - spent
    const cls = remaining > 0 ? 'points-remaining--ok' : remaining < 0 ? 'points-remaining--over' : 'points-remaining--done'
    const text = remaining >= 0
      ? t('pointsRemaining').replace('{0}', remaining)
      : t('pointsOver').replace('{0}', Math.abs(remaining))
    return budget > 0 ? <span className={`points-remaining ${cls}`}>{text}</span> : null
  }

  // Nation trait bonus info
  const nationTraits = fields.nation && NATIONS[fields.nation] ? NATIONS[fields.nation] : null
  const nationSorcery = fields.nation && SORCERIES[fields.nation] ? SORCERIES[fields.nation] : null

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/7thsea')}>{t('back')}</button>
        <h2>{fields.name || t('edit7sHero')}</h2>
        <span className="splat-badge splat-badge--seventh-sea">{t('seventhSea')}</span>
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
          <fieldset>
            <legend>{t('7sLoadTemplate')}</legend>
            <CatalogSelect
              id="hero-template" name="heroTemplate" label={t('7sPremadeHero')}
              value={templateName} onChange={(_, val) => loadTemplate(val)}
              catalog={SEVEN_SEA_HERO_CATALOG} placeholder="Search hero templates..."
              showDescOnSelect={false}
            />
            {templateName && (
              <p className="muted-hint muted-hint--xs" style={{ marginTop: 'var(--space-xs)', color: 'var(--color-accent-fg)' }}>
                Loaded from template: <strong>{templateName}</strong> — customize freely below.
              </p>
            )}
          </fieldset>

          <fieldset>
            <legend>{t('tabIdentity')}</legend>
            <div className="field-row">
              <div className="field"><label>{t('charName')} *</label><input name="name" value={fields.name} onChange={handleText} /></div>
              <div className="field"><label>{t('concept')}</label><input name="concept" value={fields.concept} onChange={handleText} /></div>
            </div>
            <div className="field-row">
              <CatalogSelect id="nation" name="nation" label={t('7sNation')} value={fields.nation}
                onChange={handleField} catalog={NATION_CATALOG} />
              <CatalogSelect id="religion" name="religion" label={t('7sReligion')} value={fields.religion}
                onChange={handleField} catalog={RELIGION_CATALOG} />
            </div>
            {nationTraits && (
              <div style={{ marginBottom: 'var(--space-sm)' }}>
                <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}>
                  {fields.nation}: +1 to {nationTraits[0]} or {nationTraits[1]}.
                  {nationSorcery && ` Sorcery: ${nationSorcery}.`}
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Apply national +1:</span>
                  {nationTraits.map(trait => (
                    <button key={trait} type="button"
                      className={`btn btn-secondary${nationBonusTrait === trait ? ' tab-btn--active' : ''}`}
                      style={{ fontSize: '0.78rem', padding: '2px 10px' }}
                      aria-pressed={nationBonusTrait === trait}
                      onClick={() => applyNationBonus(trait)}>
                      {trait}{nationBonusTrait === trait ? ' (applied)' : ''}
                    </button>
                  ))}
                  {nationBonusTrait && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-accent-fg)' }}>
                      +1 {nationBonusTrait} applied
                    </span>
                  )}
                </div>
              </div>
            )}
            <div className="field-row">
              <CatalogSelect id="secretSociety" name="demeanor" label={t('7sMembership')} value={fields.demeanor}
                onChange={handleField} catalog={SECRET_SOCIETIES} placeholder="Search secret societies..." />
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
          </fieldset>
        </div>
      </div>

      {/* ── Traits ── */}
      <div role="tabpanel" id={`tabpanel-1`} aria-labelledby={`tab-1`} hidden={tab !== 1}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tab7sTraits')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              {t('traitsHint')} {nationTraits && (nationBonusTrait
                ? `${fields.nation}: +1 ${nationBonusTrait} applied via Identity tab.`
                : `${fields.nation} grants +1 to ${nationTraits[0]} or ${nationTraits[1]} -- select on the Identity tab.`)}
            </p>
            {guidedMode && <PointsBudget spent={traitSpent} budget={TRAIT_BUDGET} />}
            <div className="rating-grid">
              {TRAIT_KEYS.map(key => (
                <div key={key} className="ability-row">
                  <DotRating label={t(key)} name={key} value={fields[key]} onChange={handleField} min={2} max={5} />
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Skills ── */}
      <div role="tabpanel" id={`tabpanel-2`} aria-labelledby={`tab-2`} hidden={tab !== 2}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tab7sSkills')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              {t('skillsHint')} {guidedMode && 'Max 3 per skill at creation. Rank 3 grants a reroll.'}
            </p>
            {guidedMode && <PointsBudget spent={skillSpent} budget={SKILL_BUDGET} />}
            <div className="rating-grid">
              {SKILL_KEYS.map(key => (
                <div key={key} className="ability-row">
                  <DotRating label={t(key)} name={key} value={fields[key]} onChange={handleField} max={guidedMode ? 3 : 5} />
                </div>
              ))}
            </div>
          </fieldset>
          <details style={{ marginTop: 'var(--space-sm)' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>{t('7sRiskRollCalc')}</summary>
            <fieldset>
              <legend>{t('7sRiskRollCalc')}</legend>
              <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
                Risks are resolved by rolling Trait + Skill in d10s, making sets of 10.
              </p>
              <table className="inv-table">
                <thead><tr><th>Skill</th><th>Rank</th><th>Brawn</th><th>Finesse</th><th>Resolve</th><th>Wits</th><th>Panache</th></tr></thead>
                <tbody>
                  {SKILL_KEYS.map(key => {
                    const rank = fields[key] || 0
                    if (rank === 0) return null
                    return (
                      <tr key={key}>
                        <td style={{ fontWeight: 600 }}>{t(key)}</td>
                        <td style={{ textAlign: 'center' }}>{rank}</td>
                        {TRAIT_KEYS.map(tk => (
                          <td key={tk} style={{ textAlign: 'center', color: 'var(--color-accent-fg)', fontWeight: 600 }}>
                            {rank + fields[tk]}d10
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </fieldset>
          </details>
        </div>
      </div>

      {/* ── Advantages ── */}
      <div role="tabpanel" id={`tabpanel-3`} aria-labelledby={`tab-3`} hidden={tab !== 3}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tab7sAdvantages')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>{t('7sAdvantagesHint')}</p>
            {guidedMode && <PointsBudget spent={advSpent} budget={ADVANTAGE_BUDGET} />}
            {disciplines.length > 0 && (
              <ul className="tag-list">
                {disciplines.map(d => (
                  <li key={d.id} className={`tag tag--clickable${d.id === tagInfo?.id ? ' tag--active' : ''}`}
                    onClick={() => setTagInfo(ti => ti?.id === d.id ? null : { ...d, kind: 'advantage' })}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTagInfo(ti => ti?.id === d.id ? null : { ...d, kind: 'advantage' }); } }}
                    role="button" tabIndex={0}>
                    <span>{d.name} ({d.level} pt{d.level !== 1 ? 's' : ''})</span>
                    <button className="tag-remove" onClick={e => { e.stopPropagation(); removeDiscipline(characterId, d.id); setDisciplines(prev => prev.filter(x => x.id !== d.id)); if (tagInfo?.id === d.id) setTagInfo(null) }}>x</button>
                  </li>
                ))}
              </ul>
            )}
          </fieldset>
          {tagInfo?.kind === 'advantage' && (() => {
            const entry = ADVANTAGES.find(a => a.name.toLowerCase() === tagInfo.name.toLowerCase())
            return <TagInfoPanel entry={entry ? { name: entry.name, description: `Cost: ${entry.cost}. ${entry.description}` } : { name: tagInfo.name }} onClose={() => setTagInfo(null)} />
          })()}
          <fieldset>
            <legend>{t('7sAdvCatalogue')} ({ADVANTAGES.length})</legend>
            <div className="catalog-search-wrap">
              <input type="search" value={advSearch} onChange={e => setAdvSearch(e.target.value)}
                placeholder="Search advantages..." aria-label="Search advantages" />
              <span className="catalog-search-count">{ADVANTAGES.filter(a => a.name.toLowerCase().includes(advSearch.toLowerCase()) || a.description.toLowerCase().includes(advSearch.toLowerCase())).length}</span>
            </div>
            <ul className="catalog-list" aria-label="Advantage catalog">
              {ADVANTAGES
                .filter(a => a.name.toLowerCase().includes(advSearch.toLowerCase()) || a.description.toLowerCase().includes(advSearch.toLowerCase()))
                .slice(0, 30)
                .map(a => {
                  const already = disciplines.some(d => d.name.toLowerCase() === a.name.toLowerCase())
                  return (
                    <li key={a.name} className={`catalog-item${already ? ' catalog-item--added' : ''}`}>
                      {(() => {
                        const wouldExceed = guidedMode && !already && (advSpent + a.cost) > ADVANTAGE_BUDGET
                        return (
                          <button className="catalog-item-btn" disabled={wouldExceed && !already} onClick={() => {
                            if (!already) {
                              addDiscipline(characterId, { name: a.name, level: a.cost, notes: '' })
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
                              {wouldExceed && (
                                <span className="muted-hint muted-hint--xs" style={{ color: 'var(--color-danger)', display: 'block', marginTop: '2px' }}>
                                  Exceeds {ADVANTAGE_BUDGET}-point budget ({advSpent} + {a.cost} = {advSpent + a.cost})
                                </span>
                              )}
                            </div>
                            <div className="catalog-item-meta">
                              <span className="catalog-item-cost">{a.cost}pt</span>
                              {already ? <span className="catalog-item-check">{'\u2713'}</span> : <span className="catalog-item-add">+</span>}
                            </div>
                          </button>
                        )
                      })()}
                    </li>
                  )
                })}
            </ul>
          </fieldset>
        </div>
      </div>

      {/* ── Sorcery ── */}
      <div role="tabpanel" id={`tabpanel-4`} aria-labelledby={`tab-4`} hidden={tab !== 4}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tab7sSorcery')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-md)' }}>
              Sorcery is purchased as an Advantage (2 pts for Rank 1, 4 pts for Rank 2). Your nation determines which tradition you can learn.
            </p>
            {nationSorcery ? (
              <div className="form-section" style={{ marginBottom: 'var(--space-md)' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-sm)', color: 'var(--color-accent-fg)' }}>{nationSorcery}</h3>
                <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}><strong>{SORCERY_INFO[nationSorcery]?.nation}</strong></p>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>{SORCERY_INFO[nationSorcery]?.description}</p>
              </div>
            ) : (
              <p className="muted-hint" style={{ paddingBottom: 0 }}>Select a nation on the Identity tab to see your available sorcery tradition.</p>
            )}
            {!nationSorcery && Object.entries(SORCERY_INFO).map(([name, info]) => (
              <details key={name} style={{ marginBottom: 'var(--space-sm)' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>{name} <span style={{ fontWeight: 400, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>— {info.nation}</span></summary>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6, padding: 'var(--space-sm) 0' }}>{info.description}</p>
              </details>
            ))}
          </fieldset>
          <fieldset>
            <legend>{t('7sSorceryNotes')}</legend>
            <textarea name="sorceryDesc" value={fields.sorceryDesc} onChange={handleText} rows={5} style={{ width: '100%' }} placeholder="Describe your sorcerous abilities, Deals, Knights, Unguents, Runes, Strands, etc." />
          </fieldset>
        </div>
      </div>

      {/* ── Dueling ── */}
      <div role="tabpanel" id={`tabpanel-5`} aria-labelledby={`tab-5`} hidden={tab !== 5}>
        <div className="form-section">
          <fieldset>
            <legend>{t('7sYourDuelingStyle')}</legend>
            <div className="field-row">
              <div className="field" style={{ flex: 2 }}>
                <label>{t('7sActiveStyle')}</label>
                <select value={activeDuelStyle} onChange={e => setActiveDuelStyle(e.target.value)} aria-label={t('7sActiveStyle')}>
                  <option value="">None (not a Duelist)</option>
                  {DUELING_STYLES.map(s => <option key={s.name} value={s.name}>{t(s.name)} ({t(s.nation)})</option>)}
                </select>
              </div>
            </div>
            {activeDuelStyle && (() => {
              const style = DUELING_STYLES.find(s => s.name === activeDuelStyle)
              if (!style) return null
              const requiredTrait = DUELING_STYLE_TRAIT[style.name]
              const traitKey = requiredTrait ? TRAIT_NAME_TO_KEY[requiredTrait] : null
              const traitVal = traitKey ? fields[traitKey] : 0
              const traitLow = requiredTrait && traitVal < 3
              return (
                <div className="form-section" style={{ padding: 'var(--space-md)', marginTop: 'var(--space-sm)', marginBottom: 0, background: 'rgba(52,152,219,0.08)', borderLeft: '3px solid var(--color-accent-fg)' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-xs)' }}>{style.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xs)' }}>{style.nation}</div>
                  <div style={{ fontSize: '0.9rem' }}>{style.description}</div>
                  {traitLow && (
                    <p className="muted-hint muted-hint--xs" role="status" aria-live="polite" style={{ marginTop: 'var(--space-sm)', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                      Your {requiredTrait} is {traitVal} -- this style works best with {requiredTrait} 3+.
                    </p>
                  )}
                </div>
              )
            })()}
          </fieldset>
          <details style={{ marginTop: 'var(--space-sm)' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)', marginBottom: 'var(--space-sm)' }}>{t('7sStyleRef')}</summary>
            <fieldset>
              <legend>{t('tab7sDueling')}</legend>
              <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-md)' }}>
                Purchase the "Duelist Academy" Advantage (5 pts) to learn a style. Each style uses a specific Trait and grants unique Maneuvers.
              </p>
              {DUELING_STYLES.map(s => (
                <details key={s.name} style={{ marginBottom: 'var(--space-sm)' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>{s.name} <span style={{ fontWeight: 400, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>— {s.nation}</span></summary>
                  <p style={{ fontSize: '0.85rem', lineHeight: 1.6, padding: 'var(--space-sm) 0' }}>{s.description}</p>
                </details>
              ))}
            </fieldset>
          </details>
          <fieldset>
            <legend>{t('7sDuelingNotes')}</legend>
            <textarea name="altName" value={fields.altName} onChange={handleText} rows={4} style={{ width: '100%' }} placeholder="Your dueling style, maneuvers learned, and notes..." />
          </fieldset>
        </div>
      </div>

      {/* ── Arcana & Resources ── */}
      <div role="tabpanel" id={`tabpanel-6`} aria-labelledby={`tab-6`} hidden={tab !== 6}>
        <div className="form-section">
          <fieldset>
            <legend>{t('7sArcana')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>{t('arcanaHint')}</p>
            <div className="field-row">
              <CatalogSelect id="heroVirtue" name="heroVirtue" label={t('7sVirtue')} value={fields.heroVirtue}
                onChange={handleField} catalog={VIRTUE_CATALOG} />
              <CatalogSelect id="heroHubris" name="heroHubris" label={t('7sHubris')} value={fields.heroHubris}
                onChange={handleField} catalog={HUBRIS_CATALOG} />
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('7sResources')}</legend>
            <div className="rating-grid">
              <div className="ability-row"><DotRating label={t('7sHeroPoints')} name="heroPoints" value={fields.heroPoints} onChange={handleField} min={0} max={10} /></div>
              <div className="ability-row"><DotRating label={t('7sWealth')} name="wealth7s" value={fields.wealth7s} onChange={handleField} min={0} max={10} /></div>
              <div className="ability-row"><DotRating label={t('7sDramaticWounds')} name="dramaticWounds" value={fields.dramaticWounds} onChange={handleField} min={0} max={5} /></div>
              <div className="ability-row"><DotRating label={t('7sCorruption')} name="corruption" value={fields.corruption} onChange={handleField} min={0} max={10} /></div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Wound Tracker</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Each Dramatic Wound equals your Resolve in regular wounds. Track regular wounds here and Dramatic Wounds are calculated automatically.
            </p>
            <div className="field-row" style={{ alignItems: 'center' }}>
              <div className="field" style={{ width: 140 }}>
                <label>Regular Wounds</label>
                <input type="number" min={0} max={99} value={wounds} onChange={e => setWounds(Math.max(0, parseInt(e.target.value) || 0))} />
              </div>
              <div role="status" aria-live="polite" aria-atomic="true" style={{ flex: 1, padding: 'var(--space-sm)', background: 'rgba(52,152,219,0.08)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--color-accent-fg)' }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '2px' }}>
                  {wounds} regular wound{wounds !== 1 ? 's' : ''} = {Math.floor(wounds / (fields.traitResolve || 1))} Dramatic Wound{Math.floor(wounds / (fields.traitResolve || 1)) !== 1 ? 's' : ''}
                </div>
                <div className="muted-hint muted-hint--xs">
                  Resolve {fields.traitResolve} = {fields.traitResolve} wound{fields.traitResolve !== 1 ? 's' : ''} per Dramatic Wound level
                  {wounds > 0 && ` | ${wounds % (fields.traitResolve || 1)} wound${wounds % (fields.traitResolve || 1) !== 1 ? 's' : ''} toward next`}
                </div>
              </div>
            </div>
          </fieldset>

          {/* Villain/Monster creation is now a separate form at /7thsea/villain/new */}
        </div>
      </div>

      {/* ── Backgrounds ── */}
      <div role="tabpanel" id={`tabpanel-7`} aria-labelledby={`tab-7`} hidden={tab !== 7}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tab7sBackgrounds')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Choose 2 Backgrounds. Each provides a Quirk, Skills, and Advantages.
            </p>
            {guidedMode && backgrounds.length >= 2 && (
              <p className="points-remaining points-remaining--done" style={{ marginBottom: 'var(--space-sm)' }}>
                Background limit reached (2/2). Remove one to add a different background.
              </p>
            )}
            {backgrounds.length > 0 && (
              <ul className="tag-list">
                {backgrounds.map(b => (
                  <li key={b.id} className={`tag tag--clickable${b.id === tagInfo?.id ? ' tag--active' : ''}`} onClick={() => setTagInfo(ti => ti?.id === b.id ? null : { ...b, kind: 'background' })}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTagInfo(ti => ti?.id === b.id ? null : { ...b, kind: 'background' }); } }}
                    role="button" tabIndex={0}>
                    <span>{b.name}{b.description ? ` — ${b.description}` : ''}</span>
                    <button className="tag-remove" onClick={e => { e.stopPropagation(); removeBackground(characterId, b.id); setBackgrounds(prev => prev.filter(x => x.id !== b.id)); if (tagInfo?.id === b.id) setTagInfo(null) }}>x</button>
                  </li>
                ))}
              </ul>
            )}
          </fieldset>
          {tagInfo?.kind === 'background' && (() => {
            const entry = BACKGROUND_CATALOG.find(bg => bg.name.toLowerCase() === tagInfo.name.toLowerCase())
            const desc = entry
              ? `Skills: ${entry.skills.join(', ')}.\nAdvantages: ${entry.advantages.join(', ')}.\nQuirk: ${entry.quirk}`
              : tagInfo.description ? `Quirk: ${tagInfo.description}` : undefined
            return <TagInfoPanel entry={{ name: entry?.name || tagInfo.name, description: desc }} onClose={() => setTagInfo(null)} />
          })()}
          <fieldset>
            <legend>{t('7sBgCatalogue')} ({BACKGROUND_CATALOG.length})</legend>
            <div className="catalog-search-wrap">
              <input type="search" value={bgSearch} onChange={e => setBgSearch(e.target.value)}
                placeholder="Search backgrounds..." aria-label="Search backgrounds" />
              <span className="catalog-search-count">{BACKGROUND_CATALOG.filter(b => b.name.toLowerCase().includes(bgSearch.toLowerCase()) || b.description.toLowerCase().includes(bgSearch.toLowerCase())).length}</span>
            </div>
            <ul className="catalog-list" aria-label="Background catalog">
              {BACKGROUND_CATALOG
                .filter(b => b.name.toLowerCase().includes(bgSearch.toLowerCase()) || b.description.toLowerCase().includes(bgSearch.toLowerCase()))
                .map(b => {
                  const already = backgrounds.some(bg => bg.name.toLowerCase() === b.name.toLowerCase())
                  return (
                    <li key={b.name} className={`catalog-item${already ? ' catalog-item--added' : ''}`}>
                      <button className="catalog-item-btn" disabled={!already && guidedMode && backgrounds.length >= 2} onClick={() => {
                        if (!already) {
                          addBackground(characterId, { name: b.name, level: 1, description: '' })
                            .then(res => setBackgrounds(prev => [...prev, res.data]))
                            .catch(() => setActionError(t('failedToSave')))
                        } else {
                          const bg = backgrounds.find(bg => bg.name.toLowerCase() === b.name.toLowerCase())
                          if (bg) setTagInfo(ti => ti?.id === bg.id ? null : { ...bg, kind: 'background' })
                        }
                      }}>
                        <div className="catalog-item-main">
                          <span className="catalog-item-name">{b.name}</span>
                          <span className="catalog-item-desc">{b.description}</span>
                        </div>
                        <div className="catalog-item-meta">
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

      {/* ── Stories (advancement system) ── */}
      <div role="tabpanel" id={`tabpanel-8`} aria-labelledby={`tab-8`} hidden={tab !== 8}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tab7sStories')} ({parsedStories.length})</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Stories replace XP. Define a Goal, a Reward, and Steps. The number of steps determines the reward value: 1 step = 1-pt Advantage or Skill Rank, 3 steps = 3-pt Advantage, 5 steps = +1 Trait.
            </p>
          </fieldset>

          {/* Active Stories */}
          {parsedStories.length > 0 && (
            <fieldset>
              <legend>{t('7sActiveStories')}</legend>
              {parsedStories.map((story, i) => (
                <div key={i} className="form-section" style={{ padding: 'var(--space-md)', marginBottom: 'var(--space-sm)', borderLeft: '3px solid var(--color-accent-fg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-xs)' }}>{story.title}</div>
                    <button className="tag-remove" onClick={() => handleRemoveStory(i)}>{'\u00d7'}</button>
                  </div>
                  {story.lines.map((line, j) => (
                    <p key={j} className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}>{line}</p>
                  ))}
                </div>
              ))}
            </fieldset>
          )}

          {/* Add Story Form */}
          <fieldset>
            <legend>{t('7sNewStory')}</legend>
            <div className="field-row">
              <div className="field" style={{ flex: 2 }}>
                <label>{t('7sStoryTitle')}</label>
                <input type="text" value={newStory.title} onChange={e => setNewStory(p => ({ ...p, title: e.target.value }))} placeholder="The Lost Heir of Castille..." />
              </div>
              <div className="field" style={{ flex: 2 }}>
                <label>{t('7sReward')}</label>
                <input type="text" value={newStory.reward} onChange={e => setNewStory(p => ({ ...p, reward: e.target.value }))} placeholder="+1 Resolve, 3-pt Advantage, etc." />
              </div>
            </div>
            <div className="field">
              <label>{t('7sGoalEnding')}</label>
              <input type="text" value={newStory.goal} onChange={e => setNewStory(p => ({ ...p, goal: e.target.value }))} placeholder="What does the ending of this story look like?" />
            </div>
            <div className="field">
              <label>{t('7sSteps')}</label>
              <textarea value={newStory.steps} onChange={e => setNewStory(p => ({ ...p, steps: e.target.value }))} rows={3} style={{ width: '100%' }} placeholder={"Find the old map in the library\nSail to the island\nConfront the usurper"} />
            </div>
            {(() => {
              const stepCount = newStory.steps ? newStory.steps.split('\n').filter(s => s.trim()).length : 0
              if (stepCount === 0) return null
              const tier = STORY_REWARD_TIERS.find(t => t.steps === Math.min(stepCount, 5)) || STORY_REWARD_TIERS[STORY_REWARD_TIERS.length - 1]
              return (
                <p role="status" aria-live="polite" className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)', padding: 'var(--space-xs) var(--space-sm)', background: 'rgba(52,152,219,0.08)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--color-accent-fg)' }}>
                  <strong>{stepCount} step{stepCount !== 1 ? 's' : ''}</strong> = <strong>{tier.reward}</strong>
                  {stepCount > 5 && ' (capped at 5-step reward tier)'}
                </p>
              )
            })()}
            <button className="btn btn-secondary" onClick={handleAddStory}>{t('add')}</button>
          </fieldset>

          {/* Raw Data */}
          <details>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>{t('7sRawStoryData')}</summary>
            <textarea name="heroStories" value={fields.heroStories} onChange={handleText} rows={8} style={{ width: '100%', marginTop: 'var(--space-sm)' }} placeholder="Stories are added from the form above. Edit directly here if needed." />
          </details>

          {/* Story Rewards Reference */}
          <details style={{ marginTop: 'var(--space-md)' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>{t('7sRewardsRef')}</summary>
            <table className="inv-table" style={{ marginTop: 'var(--space-sm)' }}>
              <thead><tr><th>Steps</th><th>Reward</th></tr></thead>
              <tbody>
                <tr><td style={{ fontWeight: 600 }}>1</td><td>1-pt Advantage or new Skill Rank</td></tr>
                <tr><td style={{ fontWeight: 600 }}>2</td><td>2-pt Advantage</td></tr>
                <tr><td style={{ fontWeight: 600 }}>3</td><td>3-pt Advantage</td></tr>
                <tr><td style={{ fontWeight: 600 }}>4</td><td>4-pt Advantage</td></tr>
                <tr><td style={{ fontWeight: 600 }}>5</td><td>5-pt Advantage or +1 to a Trait</td></tr>
              </tbody>
            </table>
          </details>
        </div>
      </div>

      {/* ── Belongings ── */}
      <div role="tabpanel" id={`tabpanel-9`} aria-labelledby={`tab-9`} hidden={tab !== 9}>
        <div className="form-section">
          <fieldset>
            <legend>{t('7sBelongings')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              7th Sea uses abstract Wealth rather than detailed inventories. List notable possessions: signature weapons, ships, heirlooms, and other meaningful items.
            </p>
            <textarea name="personalItems" value={fields.personalItems} onChange={handleText} rows={10} style={{ width: '100%' }} placeholder={
`Signature sword (Castillian rapier, family heirloom)
Ship: The Silver Gull (brigantine, 20 crew)
Porté-marked locket (blooded to my mother)
Eisen dracheneisen pauldron (left shoulder)
Coded journal of trade routes`} />
          </fieldset>
        </div>
      </div>

      {/* ── Backstory ── */}
      <div role="tabpanel" id={`tabpanel-10`} aria-labelledby={`tab-10`} hidden={tab !== 10}>
        <div className="form-section">
          <fieldset><legend>{t('backstoryLabel')}</legend><textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('appearanceLabel')}</legend><textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('notes')}</legend><textarea name="notes" value={fields.notes} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
        </div>
      </div>

      {/* ── XP Log ── */}
      <div role="tabpanel" id={`tabpanel-11`} aria-labelledby={`tab-11`} hidden={tab !== 11}>
        <XpLogSection splat="seventh-sea" xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)} t={t} />
      </div>

      {/* ── Rules Reference ── */}
      <div role="tabpanel" id={`tabpanel-12`} aria-labelledby={`tab-12`} hidden={tab !== 12}>
        <RulesReferenceTab rules={SEVEN_SEA_RULES} title="7th Sea Rules Reference" />
      </div>

      {/* ── Dice Roller ── */}
      <div role="tabpanel" id={`tabpanel-13`} aria-labelledby={`tab-13`} hidden={tab !== 13}>
        <SeventhSeaDiceRoller />
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => setShowExport(true)}>{t('exportPdf')}</button>
        <button className="btn btn-secondary" onClick={() => navigate('/7thsea')}>{t('cancel')}</button>
        <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>{saving ? t('saving') : t('quickSave')}</button>
        <button className="btn btn-primary" onClick={handleDoneEditing} disabled={saving}>{t('doneEditing')}</button>
      </div>
      {viewMode && (
        <div className="view-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/7thsea')}>{t('back')}</button>
          <button className="btn btn-primary" onClick={() => navigate(`/characters/${characterId}`, { replace: true })}>{t('edit')}</button>
        </div>
      )}
      <ExportModal open={showExport} onClose={() => setShowExport(false)} tabKeys={TAB_KEYS} t={t} />
    </div>
  )
}
