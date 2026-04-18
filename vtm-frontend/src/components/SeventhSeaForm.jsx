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
import { useTheme } from '../context/ThemeContext'
import TagInfoPanel from './TagInfoPanel'
import RulesReferenceTab from './RulesReferenceTab'
import { SEVEN_SEA_RULES } from '../data/sevenSeaRules'
import SeventhSeaDiceRoller from './SeventhSeaDiceRoller'

// ── Nations with favored trait pairs (pick one for +1) ──
const NATIONS = {
  'Avalon':                  ['Panache', 'Resolve'],
  'Inismore':                ['Brawn', 'Wits'],
  'Highland Marches':        ['Finesse', 'Resolve'],
  'Castille':                ['Finesse', 'Wits'],
  'Eisen':                   ['Brawn', 'Resolve'],
  'Montaigne':               ['Finesse', 'Panache'],
  'Sarmatian Commonwealth':  ['Resolve', 'Wits'],
  'Ussura':                  ['Brawn', 'Resolve'],
  'Vestenmennavenjar':       ['Brawn', 'Wits'],
  'Vodacce':                 ['Finesse', 'Wits'],
  'Crescent Empire':         ['Resolve', 'Wits'],
  'Ifri':                    ['Brawn', 'Panache'],
  'Aztlan':                  ['Finesse', 'Panache'],
}
const NATION_NAMES = Object.keys(NATIONS)

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

// ── Advantages catalogue ──
const ADVANTAGES = [
  { name: 'Academy', cost: 4, description: 'You attended a formal military academy.' },
  { name: 'Able Drinker', cost: 1, description: 'Alcohol has little effect on you.' },
  { name: 'An Honest Misunderstanding', cost: 1, description: 'Replace Raises on a social Risk with Raises from another Skill.' },
  { name: 'Bar Fighter', cost: 3, description: 'Deal extra Wounds equal to your Brawl Ranks on a Brawl attack.' },
  { name: 'Barterer', cost: 3, description: 'Spend a Hero Point to acquire an item through trade.' },
  { name: 'Boxer', cost: 4, description: 'Spend a Hero Point to add Brawl to your damage.' },
  { name: 'Brush Pass', cost: 3, description: 'Spend a Hero Point to slip a small item to or from someone unnoticed.' },
  { name: 'Camaraderie', cost: 2, description: 'Spend a Hero Point to give another Hero 3 dice on their next Risk.' },
  { name: 'Cast Iron Stomach', cost: 1, description: 'You eat anything without ill effect.' },
  { name: 'Come Hither', cost: 3, description: 'Spend a Hero Point to tempt a character into leaving with you.' },
  { name: 'Connection', cost: 3, description: 'You know people in a particular organisation or social group.' },
  { name: 'Courageous', cost: 2, description: 'Spend a Hero Point to automatically succeed on Fear-based Risks.' },
  { name: 'Direction Sense', cost: 1, description: 'You always know which way is north.' },
  { name: 'Disarming Smile', cost: 3, description: 'Spend a Hero Point to keep a character from attacking for one Round.' },
  { name: 'Duelist Academy', cost: 5, description: 'You have trained in a Dueling style, gaining access to special maneuvers.' },
  { name: 'Dynamic Approach', cost: 4, description: 'Choose a Trait. When you use that Trait for a Risk, Raises cost 1 less die.' },
  { name: 'Eagle Eyes', cost: 2, description: 'Spend a Hero Point to notice something important others miss.' },
  { name: 'Extended Family', cost: 1, description: 'You can find a relative in almost any community.' },
  { name: 'Fascinate', cost: 3, description: 'Spend a Hero Point to hold a group transfixed by your performance.' },
  { name: 'Fencer', cost: 4, description: 'Spend a Hero Point to add Weaponry to your damage.' },
  { name: 'Friend at Court', cost: 4, description: 'You have a noble ally who helps with social and political situations.' },
  { name: 'Got It!', cost: 2, description: 'Spend a Hero Point to pick a lock or disable a trap without a Risk.' },
  { name: 'Hard to Kill', cost: 5, description: 'You can take 1 additional Dramatic Wound before becoming Helpless.' },
  { name: 'I Won\'t Die Here', cost: 5, description: 'Spend all Hero Points to avoid death. You survive but are removed from the scene.' },
  { name: 'Indomitable Will', cost: 3, description: 'Spend a Hero Point to resist mental influence or torture.' },
  { name: 'Inspire Generosity', cost: 3, description: 'Spend a Hero Point to convince someone to give you something.' },
  { name: 'Jack of All Trades', cost: 2, description: 'Spend a Hero Point to gain 1 Rank in a Skill you have 0 Ranks in for one Risk.' },
  { name: 'Keen Senses', cost: 2, description: 'You can notice hidden details others miss.' },
  { name: 'Large', cost: 2, description: 'You are bigger than average, gaining benefits in physical contests.' },
  { name: 'Leadership', cost: 4, description: 'Spend a Hero Point to inspire and lead a group effectively.' },
  { name: 'Left-Handed', cost: 3, description: 'Your unexpected fighting style gives you an edge in combat.' },
  { name: 'Linguist', cost: 2, description: 'You speak, read, and write an additional language.' },
  { name: 'Lyceum', cost: 4, description: 'You attended a school of sorcery.' },
  { name: 'Married to the Sea', cost: 3, description: 'Spend a Hero Point to navigate through dangerous waters safely.' },
  { name: 'Miracle Worker', cost: 4, description: 'Spend a Hero Point to stabilise a dying character.' },
  { name: 'Opportunist', cost: 4, description: 'Spend a Hero Point to act outside your normal turn.' },
  { name: 'Patron', cost: 3, description: 'You have a wealthy patron who provides financial support.' },
  { name: 'Quick Reflexes', cost: 2, description: 'You act first in Action Sequences involving a specific Skill.' },
  { name: 'Rich', cost: 3, description: 'You begin each session with Wealth 3.' },
  { name: 'Rogue', cost: 4, description: 'Spend a Hero Point to add Theft to damage on a sneak attack.' },
  { name: 'Sea Legs', cost: 2, description: 'You never suffer penalties from rough seas.' },
  { name: 'Small', cost: 2, description: 'You are smaller than average, gaining benefits in stealth.' },
  { name: 'Sniper', cost: 4, description: 'Spend a Hero Point to add Aim to damage at range.' },
  { name: 'Sorcery (1 rank)', cost: 2, description: 'You have access to your nation\'s sorcerous tradition at Rank 1.' },
  { name: 'Sorcery (2 ranks)', cost: 4, description: 'You have full mastery of your nation\'s sorcerous tradition.' },
  { name: 'Specialist', cost: 3, description: 'Choose a field. Gain +2 dice on Risks related to your speciality.' },
  { name: 'Staredown', cost: 3, description: 'Spend a Hero Point to frighten a single target.' },
  { name: 'Streetwise', cost: 2, description: 'Spend a Hero Point to find the local criminal underworld contacts.' },
  { name: 'Survivalist', cost: 3, description: 'Spend a Hero Point to find food, water, and shelter in the wilderness.' },
  { name: 'Team Player', cost: 4, description: 'Spend a Hero Point to give your Raises to an ally.' },
  { name: 'Tenure', cost: 2, description: 'You hold a position at a university or similar institution.' },
  { name: 'Time Sense', cost: 1, description: 'You always know approximately what time it is.' },
  { name: 'Together We Are Strong', cost: 4, description: 'Spend a Hero Point to add your Ranks in a Skill to an ally\'s Risk.' },
  { name: 'Trusted Companion', cost: 1, description: 'You have a loyal pet or animal companion.' },
  { name: 'University', cost: 4, description: 'You attended a major university and gained broad academic knowledge.' },
  { name: 'Valiant Spirit', cost: 3, description: 'When facing a Villain, gain bonus dice.' },
  { name: 'Virtuoso', cost: 4, description: 'Choose a Skill. When using that Skill, 10s explode.' },
  { name: 'Wily', cost: 3, description: 'Spend a Hero Point to escape bonds, grapples, or confinement.' },
]

// ── All 20 Arcana (2e Core Book) ──
const VIRTUES = [
  'The Fool — Wily', 'The Road — Willing', 'The Magician — Temperate',
  'Reunion — Triumphant', 'The Lovers — Passionate', 'The Thrones — Commanding',
  'Coins — Adaptable', 'The Witch — Intuitive', 'The War — Victorious',
  'The Hanged Man — Altruistic', 'The Beggar Prince — Insightful',
  'The Devil — Astute', 'The Tower — Humble', 'The Moonless Night — Subtle',
  'The Sun — Glorious', 'The Prophet — Illuminating', 'The Hero — Courageous',
  'The Glyph — Perceptive', 'The Emperor — Proud', 'Swords — Exemplary',
]

const HUBRISES = [
  'The Fool — Reckless', 'The Road — Lost', 'The Magician — Ambitious',
  'Reunion — Beholden', 'The Lovers — Star-Crossed', 'The Thrones — Stubborn',
  'Coins — Greedy', 'The Witch — Manipulative', 'The War — Loyal',
  'The Hanged Man — Indecisive', 'The Beggar Prince — Envious',
  'The Devil — Trusting', 'The Tower — Arrogant', 'The Moonless Night — Rash',
  'The Sun — Proud', 'The Prophet — Overzealous', 'The Hero — Hot-Headed',
  'The Glyph — Curious', 'The Emperor — Imperious', 'Swords — Loyal',
]

// ── Backgrounds (2e Core Book) ──
const BACKGROUND_CATALOG = [
  { name: 'Aristocrat', description: 'Born to privilege. Skills: Empathy, Intimidate, Ride, Scholarship, Weaponry. Quirk: Earn a Hero Point when you prove a noble is your peer.' },
  { name: 'Army Officer', description: 'Military leader. Skills: Aim, Intimidate, Notice, Warfare, Weaponry. Quirk: Earn a Hero Point when you lead soldiers into a dangerous situation.' },
  { name: 'Archaeologist', description: 'Ruins explorer. Skills: Athletics, Empathy, Notice, Scholarship, Theft. Quirk: Earn a Hero Point when you explore ancient ruins.' },
  { name: 'Artist', description: 'Creative soul. Skills: Convince, Empathy, Notice, Perform, Tempt. Quirk: Earn a Hero Point when you create a meaningful work of art.' },
  { name: 'Courtier', description: 'Political player. Skills: Convince, Empathy, Perform, Scholarship, Tempt. Quirk: Earn a Hero Point when you turn the tide of court politics.' },
  { name: 'Criminal', description: 'Underworld figure. Skills: Athletics, Hide, Intimidate, Theft, Weaponry. Quirk: Earn a Hero Point when you break the law for a good reason.' },
  { name: 'Doctor', description: 'Physician and healer. Skills: Convince, Empathy, Notice, Scholarship, Tempt. Quirk: Earn a Hero Point when you tend to the injured or sick.' },
  { name: 'Disenfranchised', description: 'Lost everything. Skills: Athletics, Empathy, Hide, Notice, Theft. Quirk: Earn a Hero Point when you stand up for the downtrodden.' },
  { name: 'Duelist', description: 'Swordfighter. Skills: Athletics, Empathy, Intimidate, Perform, Weaponry. Quirk: Earn a Hero Point when you resort to the blade to resolve conflict.' },
  { name: 'Engineer', description: 'Builder and inventor. Skills: Convince, Notice, Scholarship, Tempt, Warfare. Quirk: Earn a Hero Point when you solve a problem with technology.' },
  { name: 'Explorer', description: 'Globe-trotter. Skills: Athletics, Convince, Notice, Sailing, Scholarship. Quirk: Earn a Hero Point when you venture into uncharted territory.' },
  { name: 'Farmkid', description: 'Rural upbringing. Skills: Athletics, Empathy, Notice, Ride, Survival. Quirk: Earn a Hero Point when you solve a problem with simple common sense.' },
  { name: 'Hexe', description: 'Eisen witch. Skills: Athletics, Convince, Empathy, Intimidate, Notice. Quirk: Earn a Hero Point when you use forbidden knowledge to help others.' },
  { name: 'Hunter', description: 'Tracker and scout. Skills: Aim, Athletics, Hide, Notice, Ride. Quirk: Earn a Hero Point when you track your quarry into danger.' },
  { name: 'Jenny/Jack', description: 'Companion for hire. Skills: Convince, Empathy, Notice, Perform, Tempt. Quirk: Earn a Hero Point when you use your charm to defuse a dangerous situation.' },
  { name: 'Knight Errant', description: 'Wandering warrior. Skills: Athletics, Intimidate, Ride, Warfare, Weaponry. Quirk: Earn a Hero Point when you defend the innocent.' },
  { name: 'Marine', description: 'Ship soldier. Skills: Aim, Athletics, Notice, Sailing, Warfare. Quirk: Earn a Hero Point when you board an enemy vessel.' },
  { name: 'Merchant', description: 'Trader. Skills: Convince, Empathy, Notice, Scholarship, Tempt. Quirk: Earn a Hero Point when you strike a profitable but fair deal.' },
  { name: 'Missionary', description: 'Religious envoy. Skills: Convince, Empathy, Notice, Scholarship, Tempt. Quirk: Earn a Hero Point when you convert someone to your faith.' },
  { name: 'Orphan', description: 'Raised alone. Skills: Athletics, Empathy, Hide, Notice, Theft. Quirk: Earn a Hero Point when you protect someone who cannot protect themselves.' },
  { name: 'Performer', description: 'Entertainer. Skills: Athletics, Convince, Empathy, Perform, Tempt. Quirk: Earn a Hero Point when your performance changes hearts or minds.' },
  { name: 'Pirate', description: 'Sea raider. Skills: Athletics, Intimidate, Notice, Sailing, Theft. Quirk: Earn a Hero Point when you take from the rich and give to the poor.' },
  { name: 'Priest', description: 'Cleric. Skills: Convince, Empathy, Notice, Perform, Scholarship. Quirk: Earn a Hero Point when you tend to the spiritual needs of others.' },
  { name: 'Pugilist', description: 'Bare-knuckle fighter. Skills: Athletics, Brawl, Intimidate, Notice, Perform. Quirk: Earn a Hero Point when you resolve conflict with your fists.' },
  { name: 'Sailor', description: 'Seafarer. Skills: Athletics, Notice, Sailing, Scholarship, Weaponry. Quirk: Earn a Hero Point when you put the safety of your crew before your own.' },
  { name: 'Scholar', description: 'Academic. Skills: Convince, Empathy, Notice, Scholarship, Tempt. Quirk: Earn a Hero Point when you put learning above personal safety.' },
  { name: 'Servant', description: 'In service to others. Skills: Athletics, Empathy, Hide, Notice, Tempt. Quirk: Earn a Hero Point when you go above and beyond for your master.' },
  { name: 'Soldier', description: 'Professional warrior. Skills: Aim, Athletics, Intimidate, Notice, Weaponry. Quirk: Earn a Hero Point when you stick to your orders despite complications.' },
  { name: 'Spy', description: 'Infiltrator. Skills: Convince, Empathy, Hide, Notice, Tempt. Quirk: Earn a Hero Point when you uncover a secret that changes the situation.' },
  { name: 'Touched by Sidhe', description: 'Fae-touched (Avalon). Skills: Athletics, Convince, Empathy, Notice, Perform. Quirk: Earn a Hero Point when you let the Sidhe\'s influence guide your actions.' },
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
  shipData7s: '',
}

const TAB_KEYS = ['tabIdentity', 'tab7sTraits', 'tab7sSkills', 'tab7sAdvantages', 'tab7sSorcery', 'tab7sDueling', 'tab7sArcana', 'tab7sBackgrounds', 'tab7sStories', 'tab7sBelongings', 'tab7sShip', 'tabBackstory', 'tabXpLog', 'tabRulesRef', 'tabDiceRoller']

// ── Ship Builder Data (7th Sea 2e) ──
const SHIP_ORIGINS = [
  { value: 'Avalon', description: 'Sleek and fast. Bonus: +1 to Sailing rolls for maneuverability.' },
  { value: 'Castille', description: 'Well-armed galleons. Bonus: +1 Cannon damage.' },
  { value: 'Eisen', description: 'Iron-reinforced hulls. Bonus: +1 to resist structural damage.' },
  { value: 'Montaigne', description: 'Elegant and luxurious. Bonus: +1 to social encounters aboard.' },
  { value: 'Sarmatian Commonwealth', description: 'Versatile river/sea craft. Bonus: can navigate shallow waters.' },
  { value: 'Ussura', description: 'Ice-hardened and sturdy. Bonus: immune to cold-weather penalties.' },
  { value: 'Vestenmennavenjar', description: 'Viking-style longships. Bonus: +1 to boarding actions.' },
  { value: 'Vodacce', description: 'Fast merchant vessels. Bonus: +1 to trade and smuggling rolls.' },
  { value: 'Crescent Empire', description: 'Dhows with lateen sails. Bonus: +1 to long-distance voyages.' },
]

const SHIP_BACKGROUNDS = [
  { value: 'Merchant Vessel', description: 'A trading ship with large cargo holds. Extra cargo capacity.' },
  { value: 'Military Warship', description: 'A decommissioned naval vessel. Comes with extra cannons.' },
  { value: 'Pirate Prize', description: 'Captured from enemies. Fast but battle-scarred. +1 Intimidation at sea.' },
  { value: 'Explorer\'s Ship', description: 'Built for long voyages. Extra supplies and navigation equipment.' },
  { value: 'Smuggler\'s Craft', description: 'Hidden compartments and shallow draft. +1 to evade customs.' },
  { value: 'Privateer', description: 'Licensed by a nation. Legal protection in home waters. Letter of marque.' },
  { value: 'Ghost Ship', description: 'Rumored haunted. Crew is superstitious but enemies fear to approach.' },
  { value: 'Custom Built', description: 'Purpose-built to your specifications. Choose one extra modification.' },
]

const SHIP_MODIFICATIONS = [
  { name: 'Extra Cannons', cost: 3, description: '+1 Cannon rating. Heavier armament for ship-to-ship combat.' },
  { name: 'Reinforced Hull', cost: 3, description: '+1 Hull rating. Harder to sink or damage.' },
  { name: 'Extended Cargo Hold', cost: 2, description: 'Double cargo capacity. Essential for trading vessels.' },
  { name: 'Hidden Compartments', cost: 2, description: 'Secret spaces for smuggling. +1d to hide contraband.' },
  { name: 'Ram', cost: 2, description: 'Reinforced prow for ramming. Deals damage equal to your Sailing roll.' },
  { name: 'Speed Refit', cost: 3, description: '+1 to all chase and pursuit rolls. Streamlined hull and rigging.' },
  { name: 'Crow\'s Nest', cost: 1, description: 'Elevated lookout post. +1 to Survey rolls at sea.' },
  { name: 'Sick Bay', cost: 2, description: 'Medical facilities aboard. Crew heals faster during voyages.' },
  { name: 'Luxury Quarters', cost: 2, description: 'Captain\'s quarters fit for nobility. +1 to social rolls aboard.' },
  { name: 'Chain Shot', cost: 1, description: 'Specialized ammunition that targets rigging. Can slow enemy ships.' },
  { name: 'Figurehead', cost: 1, description: 'Carved prow ornament. Crew gains +1 morale in dangerous waters.' },
  { name: 'Swivel Guns', cost: 2, description: 'Small anti-personnel cannons. +1 to repel boarding actions.' },
  { name: 'Armored Gunports', cost: 2, description: 'Reinforced cannon positions. Crew takes less harm during broadsides.' },
  { name: 'Navigator\'s Tools', cost: 1, description: 'Advanced charts and instruments. +1 to navigation rolls.' },
  { name: 'Grappling Hooks', cost: 1, description: 'Specialized boarding equipment. +1 to boarding action rolls.' },
]

const SHIP_CREW_QUALITY = [
  { value: 'Rabble', description: 'Untrained press-ganged crew. Strength 1. Unreliable but cheap.' },
  { value: 'Landlubbers', description: 'Inexperienced but willing sailors. Strength 3. Still learning the ropes.' },
  { value: 'Able Seamen', description: 'Competent professional sailors. Strength 5. Solid and dependable.' },
  { value: 'Veterans', description: 'Experienced old salts. Strength 7. They\'ve survived storms and battles.' },
  { value: 'Elite', description: 'The finest crew on the seas. Strength 10. Legendary sailors and fighters.' },
]

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
]

const TRAIT_KEYS = ['traitBrawn', 'traitFinesse', 'traitResolve', 'traitWits7s', 'traitPanache']
const TRAIT_LABEL = { traitBrawn: 'Brawn', traitFinesse: 'Finesse', traitResolve: 'Resolve', traitWits7s: 'Wits', traitPanache: 'Panache' }
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

  async function handleDoneEditing() { await handleSave(); navigate('/7thsea') }

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
              <CatalogSelect id="nation" name="nation" label={t('7sNation')} value={fields.nation}
                onChange={handleField} catalog={NATION_CATALOG} />
              <div className="field"><label>{t('7sReligion')}</label><input name="religion" value={fields.religion} onChange={handleText} /></div>
            </div>
            {nationTraits && (
              <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
                {fields.nation}: +1 to {nationTraits[0]} or {nationTraits[1]}.
                {nationSorcery && ` Sorcery: ${nationSorcery}.`}
              </p>
            )}
            <div className="field-row">
              <div className="field"><label>{t('7sMembership')}</label><input name="demeanor" value={fields.demeanor} onChange={handleText} placeholder="Secret Society, guild, order..." /></div>
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
      <div hidden={tab !== 1}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tab7sTraits')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              {t('traitsHint')} {nationTraits && `${fields.nation} grants +1 to ${nationTraits[0]} or ${nationTraits[1]} (apply manually).`}
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
      <div hidden={tab !== 2}>
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
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>Risk Roll Calculator</summary>
            <fieldset>
              <legend>Risk Roll Calculator</legend>
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
      <div hidden={tab !== 3}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tab7sAdvantages')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>{t('7sAdvantagesHint')}</p>
            {guidedMode && <PointsBudget spent={advSpent} budget={ADVANTAGE_BUDGET} />}
            {disciplines.length > 0 && (
              <ul className="tag-list">
                {disciplines.map(d => (
                  <li key={d.id} className={`tag tag--clickable${d.id === tagInfo?.id ? ' tag--active' : ''}`}
                    onClick={() => setTagInfo(ti => ti?.id === d.id ? null : { ...d, kind: 'advantage' })}>
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
            <legend>Advantage Catalogue ({ADVANTAGES.length})</legend>
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
                      <button className="catalog-item-btn" onClick={() => {
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
        </div>
      </div>

      {/* ── Sorcery ── */}
      <div hidden={tab !== 4}>
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
      <div hidden={tab !== 5}>
        <div className="form-section">
          <fieldset>
            <legend>Your Dueling Style</legend>
            <div className="field-row">
              <div className="field" style={{ flex: 2 }}>
                <label>Active Style</label>
                <select value={activeDuelStyle} onChange={e => setActiveDuelStyle(e.target.value)}>
                  <option value="">None (not a Duelist)</option>
                  {DUELING_STYLES.map(s => <option key={s.name} value={s.name}>{t(s.name)} ({t(s.nation)})</option>)}
                </select>
              </div>
            </div>
            {activeDuelStyle && (() => {
              const style = DUELING_STYLES.find(s => s.name === activeDuelStyle)
              if (!style) return null
              return (
                <div className="form-section" style={{ padding: 'var(--space-md)', marginTop: 'var(--space-sm)', marginBottom: 0, background: 'rgba(52,152,219,0.08)', borderLeft: '3px solid var(--color-accent-fg)' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-xs)' }}>{style.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xs)' }}>{style.nation}</div>
                  <div style={{ fontSize: '0.9rem' }}>{style.description}</div>
                </div>
              )
            })()}
          </fieldset>
          <details style={{ marginTop: 'var(--space-sm)' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)', marginBottom: 'var(--space-sm)' }}>Style Reference</summary>
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
      <div hidden={tab !== 6}>
        <div className="form-section">
          <fieldset>
            <legend>{t('7sArcana')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>{t('arcanaHint')}</p>
            <div className="field-row">
              <div className="field">
                <label>{t('7sVirtue')}</label>
                <select name="heroVirtue" value={fields.heroVirtue} onChange={handleText}>
                  <option value="">{t('select')}</option>
                  {VIRTUES.map(v => <option key={v} value={v}>{t(v)}</option>)}
                </select>
              </div>
              <div className="field">
                <label>{t('7sHubris')}</label>
                <select name="heroHubris" value={fields.heroHubris} onChange={handleText}>
                  <option value="">{t('select')}</option>
                  {HUBRISES.map(h => <option key={h} value={h}>{t(h)}</option>)}
                </select>
              </div>
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

          {/* Villain/Monster creation is now a separate form at /7thsea/villain/new */}
        </div>
      </div>

      {/* ── Backgrounds ── */}
      <div hidden={tab !== 7}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tab7sBackgrounds')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Choose 2 Backgrounds. Each provides a Quirk, Skills, and Advantages.
            </p>
            {backgrounds.length > 0 && (
              <ul className="tag-list">
                {backgrounds.map(b => (
                  <li key={b.id} className={`tag tag--clickable${b.id === tagInfo?.id ? ' tag--active' : ''}`} onClick={() => setTagInfo(ti => ti?.id === b.id ? null : { ...b, kind: 'background' })}>
                    <span>{b.name}{b.description ? ` — ${b.description}` : ''}</span>
                    <button className="tag-remove" onClick={e => { e.stopPropagation(); removeBackground(characterId, b.id); setBackgrounds(prev => prev.filter(x => x.id !== b.id)); if (tagInfo?.id === b.id) setTagInfo(null) }}>x</button>
                  </li>
                ))}
              </ul>
            )}
          </fieldset>
          {tagInfo?.kind === 'background' && (() => {
            const entry = BACKGROUND_CATALOG.find(bg => bg.name.toLowerCase() === tagInfo.name.toLowerCase())
            return <TagInfoPanel entry={entry ? { name: entry.name, description: entry.description } : { name: tagInfo.name, description: tagInfo.description ? `Quirk: ${tagInfo.description}` : undefined }} onClose={() => setTagInfo(null)} />
          })()}
          <fieldset>
            <legend>Background Catalogue ({BACKGROUND_CATALOG.length})</legend>
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
                      <button className="catalog-item-btn" onClick={() => {
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
      <div hidden={tab !== 8}>
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
              <legend>Active Stories</legend>
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
            <legend>New Story</legend>
            <div className="field-row">
              <div className="field" style={{ flex: 2 }}>
                <label>Story Title</label>
                <input type="text" value={newStory.title} onChange={e => setNewStory(p => ({ ...p, title: e.target.value }))} placeholder="The Lost Heir of Castille..." />
              </div>
              <div className="field" style={{ flex: 2 }}>
                <label>Reward</label>
                <input type="text" value={newStory.reward} onChange={e => setNewStory(p => ({ ...p, reward: e.target.value }))} placeholder="+1 Resolve, 3-pt Advantage, etc." />
              </div>
            </div>
            <div className="field">
              <label>Goal / Ending</label>
              <input type="text" value={newStory.goal} onChange={e => setNewStory(p => ({ ...p, goal: e.target.value }))} placeholder="What does the ending of this story look like?" />
            </div>
            <div className="field">
              <label>Steps (one per line)</label>
              <textarea value={newStory.steps} onChange={e => setNewStory(p => ({ ...p, steps: e.target.value }))} rows={3} style={{ width: '100%' }} placeholder={"Find the old map in the library\nSail to the island\nConfront the usurper"} />
            </div>
            <button className="btn btn-secondary" onClick={handleAddStory}>{t('add')}</button>
          </fieldset>

          {/* Raw Data */}
          <details>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>Raw Story Data</summary>
            <textarea name="heroStories" value={fields.heroStories} onChange={handleText} rows={8} style={{ width: '100%', marginTop: 'var(--space-sm)' }} placeholder="Stories are added from the form above. Edit directly here if needed." />
          </details>

          {/* Story Rewards Reference */}
          <details style={{ marginTop: 'var(--space-md)' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>Story Rewards Reference</summary>
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
      <div hidden={tab !== 9}>
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

      {/* ── Ship Builder ── */}
      <div hidden={tab !== 10}>
        <ShipBuilder fields={fields} handleField={handleField} t={t} />
      </div>

      {/* ── Backstory ── */}
      <div hidden={tab !== 11}>
        <div className="form-section">
          <fieldset><legend>{t('backstoryLabel')}</legend><textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('appearanceLabel')}</legend><textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('notes')}</legend><textarea name="notes" value={fields.notes} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
        </div>
      </div>

      {/* ── XP Log ── */}
      <div hidden={tab !== 12}>
        <XpLogSection splat="seventh-sea" xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)} t={t} />
      </div>

      {/* ── Rules Reference ── */}
      <div hidden={tab !== 13}>
        <RulesReferenceTab rules={SEVEN_SEA_RULES} title="7th Sea Rules Reference" />
      </div>

      {/* ── Dice Roller ── */}
      <div hidden={tab !== 14}>
        <SeventhSeaDiceRoller />
      </div>

      <div className="form-actions">
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
    </div>
  )
}

// ── Ship Builder ──

function decodeHtml(s) {
  if (!s) return s
  return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'")
}

function ShipBuilder({ fields, handleField, t }) {
  const raw = decodeHtml(fields.shipData7s)
  let ship
  try { ship = raw ? JSON.parse(raw) : null } catch { ship = null }
  if (!ship) ship = { name: '', origin: '', background: '', crewQuality: '', crewSize: 20, cannons: 1, hull: 1, speed: 1, cargo: 1, modifications: [], notes: '' }

  function update(patch) {
    const next = { ...ship, ...patch }
    handleField('shipData7s', JSON.stringify(next))
  }

  function toggleMod(modName) {
    const mods = ship.modifications || []
    const next = mods.includes(modName) ? mods.filter(m => m !== modName) : [...mods, modName]
    update({ modifications: next })
  }

  const totalModCost = (ship.modifications || []).reduce((sum, name) => {
    const mod = SHIP_MODIFICATIONS.find(m => m.name === name)
    return sum + (mod?.cost || 0)
  }, 0)

  return (
    <div className="form-section">
      <fieldset>
        <legend>{t('ship7sName')}</legend>
        <div className="field-row">
          <div className="field" style={{ flex: 2 }}>
            <label>{t('ship7sName')}</label>
            <input value={ship.name} onChange={e => update({ name: e.target.value })} placeholder="The Silver Gull" />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label>{t('ship7sOrigin')}</label>
            <select value={ship.origin} onChange={e => update({ origin: e.target.value })}>
              <option value="">{t('select')}</option>
              {SHIP_ORIGINS.map(o => <option key={o.value} value={o.value}>{t(o.value)}</option>)}
            </select>
            {ship.origin && <p className="archetype-desc">{SHIP_ORIGINS.find(o => o.value === ship.origin)?.description}</p>}
          </div>
          <div className="field">
            <label>{t('ship7sBackground')}</label>
            <select value={ship.background} onChange={e => update({ background: e.target.value })}>
              <option value="">{t('select')}</option>
              {SHIP_BACKGROUNDS.map(b => <option key={b.value} value={b.value}>{b.value}</option>)}
            </select>
            {ship.background && <p className="archetype-desc">{SHIP_BACKGROUNDS.find(b => b.value === ship.background)?.description}</p>}
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>{t('ship7sStats')}</legend>
        <div className="field-row">
          <div className="field" style={{ width: 100 }}>
            <label>{t('ship7sCannons')}</label>
            <input type="number" min={0} max={10} value={ship.cannons} onChange={e => update({ cannons: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="field" style={{ width: 100 }}>
            <label>{t('ship7sHull')}</label>
            <input type="number" min={0} max={10} value={ship.hull} onChange={e => update({ hull: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="field" style={{ width: 100 }}>
            <label>{t('ship7sSpeed')}</label>
            <input type="number" min={0} max={10} value={ship.speed} onChange={e => update({ speed: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="field" style={{ width: 100 }}>
            <label>{t('ship7sCargo')}</label>
            <input type="number" min={0} max={10} value={ship.cargo} onChange={e => update({ cargo: parseInt(e.target.value) || 0 })} />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>{t('ship7sCrew')}</legend>
        <div className="field-row">
          <div className="field">
            <label>{t('ship7sCrewQuality')}</label>
            <select value={ship.crewQuality} onChange={e => update({ crewQuality: e.target.value })}>
              <option value="">{t('select')}</option>
              {SHIP_CREW_QUALITY.map(c => <option key={c.value} value={c.value}>{c.value}</option>)}
            </select>
            {ship.crewQuality && <p className="archetype-desc">{SHIP_CREW_QUALITY.find(c => c.value === ship.crewQuality)?.description}</p>}
          </div>
          <div className="field" style={{ width: 100 }}>
            <label>{t('ship7sCrewSize')}</label>
            <input type="number" min={1} max={500} value={ship.crewSize} onChange={e => update({ crewSize: parseInt(e.target.value) || 1 })} />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>{t('ship7sMods')} ({t('ship7sModCost')}: {totalModCost})</legend>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-sm)' }}>
          {SHIP_MODIFICATIONS.map(mod => (
            <label key={mod.name} style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start', padding: 'var(--space-xs)', cursor: 'pointer', borderRadius: 'var(--radius)', background: (ship.modifications || []).includes(mod.name) ? 'rgba(52,152,219,0.08)' : 'transparent' }}>
              <input type="checkbox" checked={(ship.modifications || []).includes(mod.name)} onChange={() => toggleMod(mod.name)} />
              <div>
                <strong style={{ fontSize: '0.85rem' }}>{mod.name}</strong>
                <span className="muted-hint muted-hint--xs" style={{ marginLeft: '0.3rem' }}>({mod.cost} pts)</span>
                <p className="muted-hint muted-hint--xs" style={{ margin: '2px 0 0' }}>{mod.description}</p>
              </div>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>{t('ship7sNotes')}</legend>
        <textarea value={ship.notes} onChange={e => update({ notes: e.target.value })} rows={4} style={{ width: '100%' }}
          placeholder="Notable crew members, ship history, battle scars, special cargo..." />
      </fieldset>
    </div>
  )
}
