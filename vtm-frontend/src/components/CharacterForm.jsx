import { useState, useEffect, useRef } from 'react'
import { useParams as __useParams, useNavigate as __useNavigate, useSearchParams as __useSearchParams } from 'react-router-dom'
import {
  getCharacter, updateCharacter,
  getDisciplines, addDiscipline, removeDiscipline,
  getBackgrounds, addBackground, removeBackground,
  getMerits, addMerit, removeMerit,
  getFlaws, addFlaw, removeFlaw,
  getMeritCatalog, getFlawCatalog,
  getInventory, addInventoryItem, removeInventoryItem,
  getSorceryPaths, addSorceryPath, removeSorceryPath,
  getRituals, addRitual, removeRitual,
  getXpLog, addXpLogEntry, removeXpLogEntry,
  getComboDisciplines, addComboDiscipline, removeComboDiscipline,
} from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import DotRating from './DotRating'
import { SECONDARY_TALENTS, SECONDARY_SKILLS, SECONDARY_KNOWLEDGES } from '../data/secondaryAbilities'
import { VAMPIRE_DISCIPLINES } from '../data/vampireDisciplines'
import { DERANGEMENTS } from '../data/derangements'
import { COMBO_DISCIPLINES } from '../data/comboDisciplines'
import { ELDER_POWERS } from '../data/elderPowers'
import { BACKGROUNDS } from '../data/backgrounds'
import { SORCERY_PATHS, RITUALS } from '../data/bloodSorcery'
import { useLanguage } from '../i18n/LanguageContext'
import XpLogSection from './XpLogSection'

// ── Constants ─────────────────────────────────────────────────────────────────

const TAB_KEYS = ['tabIdentity', 'tabAttributes', 'tabAbilities', 'tabSecondaryAbilities', 'tabAdvantages', 'tabHealth', 'tabDisciplines', 'tabBackgrounds', 'tabMeritsFlaws', 'tabInventory', 'tabBloodSorcery', 'tabBackstory', 'tabXpLog']

const INVENTORY_CATEGORIES = ['WEAPON', 'ARMOR', 'VEHICLE', 'EQUIPMENT', 'OTHER']

// ── WoD Item Catalog ──────────────────────────────────────────────────────────
// All stats from V20 / M20 core books.
// Concealment: P=Pocket, J=Jacket, T=Trenchcoat, N=Not concealable

const ITEM_CATALOG = [
  // ── Melee Weapons ──
  { value: 'Stake',             category: 'WEAPON', damage: 'Str+1 L',  range: '',      rate: '1',    clip: '—',     concealment: 'P', description: 'Wooden stake. Paralyzes vampires on a hit to the heart (Diff 9).' },
  { value: 'Knife',             category: 'WEAPON', damage: 'Str+1 L',  range: '',      rate: '1',    clip: '—',     concealment: 'P', description: 'Small concealable blade. Can be thrown.' },
  { value: 'Kris Dagger',       category: 'WEAPON', damage: 'Str+1 L',  range: '',      rate: '1',    clip: '—',     concealment: 'P', description: 'Ornate wavy-bladed ritual dagger.' },
  { value: 'Brass Knuckles',    category: 'WEAPON', damage: 'Str+1 B',  range: '',      rate: '1',    clip: '—',     concealment: 'P', description: 'Metal grip that reinforces a punch. Damage becomes bashing.' },
  { value: 'Hatchet',           category: 'WEAPON', damage: 'Str+2 L',  range: '',      rate: '1',    clip: '—',     concealment: 'J', description: 'Small one-handed axe. Can be thrown.' },
  { value: 'Machete',           category: 'WEAPON', damage: 'Str+3 L',  range: '',      rate: '1',    clip: '—',     concealment: 'T', description: 'Heavy brush-cutting blade. Effective and intimidating.' },
  { value: 'Short Sword',       category: 'WEAPON', damage: 'Str+2 L',  range: '',      rate: '1',    clip: '—',     concealment: 'J', description: 'One-handed short blade. Concealable under a jacket.' },
  { value: 'Rapier',            category: 'WEAPON', damage: 'Str+2 L',  range: '',      rate: '1',    clip: '—',     concealment: 'N', description: 'Elegant thrusting blade. +1 die to parry in melee.' },
  { value: 'Long Sword',        category: 'WEAPON', damage: 'Str+3 L',  range: '',      rate: '1',    clip: '—',     concealment: 'N', description: 'Standard one-handed sword. Versatile and common.' },
  { value: 'Katana',            category: 'WEAPON', damage: 'Str+3 L',  range: '',      rate: '1',    clip: '—',     concealment: 'N', description: 'Japanese longsword of exceptional quality. +1 to attack due to fine balance.' },
  { value: 'Broadsword',        category: 'WEAPON', damage: 'Str+4 L',  range: '',      rate: '1',    clip: '—',     concealment: 'N', description: 'Heavy one-handed slashing blade. Significant stopping power.' },
  { value: 'Great Sword',       category: 'WEAPON', damage: 'Str+4 L',  range: '',      rate: '1',    clip: '—',     concealment: 'N', description: 'Two-handed blade. Devastating reach and damage.' },
  { value: 'Claymore',          category: 'WEAPON', damage: 'Str+5 L',  range: '',      rate: '1',    clip: '—',     concealment: 'N', description: 'Massive two-handed Scottish blade. Difficult to wield but catastrophic when it lands.' },
  { value: 'Hand Axe',          category: 'WEAPON', damage: 'Str+3 L',  range: '',      rate: '1',    clip: '—',     concealment: 'T', description: 'Single-bladed combat axe. Common and brutal.' },
  { value: 'Great Axe',         category: 'WEAPON', damage: 'Str+5 L',  range: '',      rate: '1',    clip: '—',     concealment: 'N', description: 'Two-handed war axe. Cleaves armour and bone.' },
  { value: 'Spear',             category: 'WEAPON', damage: 'Str+3 L',  range: '',      rate: '1',    clip: '—',     concealment: 'N', description: 'Polearm. Reach advantage. Can be thrown (Str×5 metres).' },
  { value: 'Club / Nightstick', category: 'WEAPON', damage: 'Str+2 B',  range: '',      rate: '1',    clip: '—',     concealment: 'T', description: 'Blunt baton. Breaks bones without piercing skin.' },
  { value: 'Baseball Bat',      category: 'WEAPON', damage: 'Str+2 B',  range: '',      rate: '1',    clip: '—',     concealment: 'T', description: 'Improvised club. Common and hits hard.' },
  { value: 'Crowbar',           category: 'WEAPON', damage: 'Str+2 B',  range: '',      rate: '1',    clip: '—',     concealment: 'T', description: 'Pry-bar used as a weapon. Doubles as a tool.' },
  { value: 'Quarterstaff',      category: 'WEAPON', damage: 'Str+2 B',  range: '',      rate: '1',    clip: '—',     concealment: 'N', description: 'Two-handed wooden staff. Excellent reach and parry capability.' },
  { value: 'Morningstar',       category: 'WEAPON', damage: 'Str+3 B',  range: '',      rate: '1',    clip: '—',     concealment: 'T', description: 'Spiked metal ball on a chain. Brutal bashing damage.' },
  { value: 'War Hammer',        category: 'WEAPON', damage: 'Str+4 B',  range: '',      rate: '1',    clip: '—',     concealment: 'N', description: 'Two-handed crushing weapon. Can shatter armour.' },
  { value: 'Sledgehammer',      category: 'WEAPON', damage: 'Str+4 B',  range: '',      rate: '1',    clip: '—',     concealment: 'N', description: 'Heavy two-handed blunt instrument. Enormous structural damage.' },
  { value: 'Whip',              category: 'WEAPON', damage: 'Str+1 L',  range: '',      rate: '1',    clip: '—',     concealment: 'T', description: 'Can disarm or entangle targets in addition to inflicting damage.' },
  { value: 'Chainsaw',          category: 'WEAPON', damage: 'Str+4 L',  range: '',      rate: '1',    clip: '—',     concealment: 'N', description: 'Roaring motorised blade. Cannot be concealed. Draws enormous attention.' },
  // ── Ranged / Thrown ──
  { value: 'Hunting Bow',       category: 'WEAPON', damage: 'Str+3 L',  range: '40m',   rate: '1',    clip: '—',     concealment: 'N', description: 'Traditional long bow. Silent. Arrows can carry silver or stakes.' },
  { value: 'Crossbow',          category: 'WEAPON', damage: '5L',       range: '40m',   rate: '1',    clip: '1',     concealment: 'N', description: 'Mechanical bolt launcher. Slow to reload but accurate.' },
  { value: 'Throwing Knife',    category: 'WEAPON', damage: 'Str L',    range: '10m',   rate: '1',    clip: '—',     concealment: 'P', description: 'Balanced blade for throwing. Str+Athletics to hit.' },
  // ── Firearms ──
  { value: 'Holdout Pistol',    category: 'WEAPON', damage: '3L',       range: '5m',    rate: '2',    clip: '6',     concealment: 'P', description: 'Tiny pocket pistol (.22/.25 cal). Minimal stopping power, maximum concealment.' },
  { value: 'Light Pistol',      category: 'WEAPON', damage: '4L',       range: '12m',   rate: '3',    clip: '17+1',  concealment: 'P', description: '9mm semi-automatic. The most common handgun in the World of Darkness.' },
  { value: 'Revolver (.38)',     category: 'WEAPON', damage: '4L',       range: '12m',   rate: '3',    clip: '6',     concealment: 'P', description: '.38 Special revolver. Reliable, no feed jams, minimal maintenance.' },
  { value: 'Revolver (.357)',    category: 'WEAPON', damage: '5L',       range: '15m',   rate: '3',    clip: '6',     concealment: 'J', description: '.357 Magnum. More punch than a 9mm, still concealable.' },
  { value: 'Heavy Pistol',      category: 'WEAPON', damage: '5L',       range: '15m',   rate: '3',    clip: '7+1',   concealment: 'J', description: '.45 ACP semi-automatic. The classic heavy handgun.' },
  { value: 'Revolver (.44 Mag)', category: 'WEAPON', damage: '6L',      range: '15m',   rate: '2',    clip: '6',     concealment: 'J', description: '.44 Magnum. Powerful, slow, and loud. Beloved by those who want certainty.' },
  { value: 'Desert Eagle',      category: 'WEAPON', damage: '6L',       range: '15m',   rate: '3',    clip: '7+1',   concealment: 'J', description: '.50 AE semi-automatic. Ostentatious, heavy, and devastatingly effective.' },
  { value: 'Sawn-Off Shotgun',  category: 'WEAPON', damage: '6L',       range: '10m',   rate: '1',    clip: '2+1',   concealment: 'J', description: 'Shortened shotgun. Wide spread at close range. Concealable under a jacket.' },
  { value: 'Shotgun (Pump)',    category: 'WEAPON', damage: '8L',       range: '20m',   rate: '1',    clip: '5+1',   concealment: 'T', description: 'Pump-action 12-gauge. The most devastating close-quarters firearm available.' },
  { value: 'Shotgun (Semi-Auto)', category: 'WEAPON', damage: '8L',     range: '20m',   rate: '3',    clip: '7+1',   concealment: 'T', description: 'Semi-automatic 12-gauge. Faster follow-up shots than a pump.' },
  { value: 'Submachine Gun',    category: 'WEAPON', damage: '5L',       range: '25m',   rate: '3/20', clip: '32+1',  concealment: 'J', description: 'Uzi or MP5-class weapon. High rate of fire, limited range.' },
  { value: 'Assault Rifle',     category: 'WEAPON', damage: '7L',       range: '150m',  rate: '3/15', clip: '30+1',  concealment: 'N', description: 'AK-47 or M16-class. Intermediate rifle cartridge. Semi or full-auto fire.' },
  { value: 'Semi-Auto Rifle',   category: 'WEAPON', damage: '7L',       range: '200m',  rate: '3',    clip: '10+1',  concealment: 'N', description: 'Semi-automatic hunting or tactical rifle. Accurate at range.' },
  { value: 'Bolt-Action Rifle', category: 'WEAPON', damage: '7L',       range: '200m',  rate: '1',    clip: '5+1',   concealment: 'N', description: 'Precise, slow-firing rifle. Each shot requires manual cycling.' },
  { value: 'Sniper Rifle',      category: 'WEAPON', damage: '8L',       range: '500m',  rate: '1',    clip: '5+1',   concealment: 'N', description: 'High-calibre precision rifle. Effective at extreme range with a scope.' },
  { value: 'Light Machine Gun', category: 'WEAPON', damage: '7L',       range: '200m',  rate: '10',   clip: '100',   concealment: 'N', description: 'Belt-fed or drum-fed automatic weapon. Sustained suppressive fire.' },
  { value: 'Grenade (Frag)',    category: 'WEAPON', damage: '7L',       range: '30m',   rate: '1',    clip: '1',     concealment: 'J', description: 'Fragmentation grenade. Area 5m radius. Athletics to throw accurately.' },
  { value: 'Flamethrower',      category: 'WEAPON', damage: 'Spec.',    range: '15m',   rate: '1',    clip: '10',    concealment: 'N', description: 'Projects burning fuel. Targets ignite and continue burning. Aggravated damage to vampires.' },
  // ── Armour ──
  { value: 'Reinforced Clothing',    category: 'ARMOR', armorRating: 1, handling: 0,  description: 'Heavy leather or dense synthetic weave. Subtle enough to wear socially. +1 die vs bashing only.' },
  { value: 'Leather Jacket',         category: 'ARMOR', armorRating: 1, handling: 0,  description: 'Heavy leather coat. +1 die vs both bashing and lethal. Common and unremarkable.' },
  { value: 'Kevlar Vest',            category: 'ARMOR', armorRating: 2, handling: 0,  description: 'Soft body armour. +2 dice vs bashing and lethal. Concealable under clothing. Standard law enforcement issue.' },
  { value: 'Flak Jacket',            category: 'ARMOR', armorRating: 3, handling: -1, description: 'Rigid ballistic plates over soft armour. +3 dice but −1 to Dexterity-based rolls.' },
  { value: 'Full Combat Armour',     category: 'ARMOR', armorRating: 4, handling: -2, description: 'Military-grade full-body armour with ceramic plates. +4 dice but −2 Dexterity penalty.' },
  { value: 'Riot Gear',              category: 'ARMOR', armorRating: 4, handling: -2, description: 'Police riot armour. Full coverage including helmet and visor. Intimidating to civilians.' },
  { value: 'Ballistic Helmet',       category: 'ARMOR', armorRating: 2, handling: 0,  description: 'Hard ballistic helmet. Protects the head location only. −1 to Perception rolls.' },
  { value: 'Chain Mail',             category: 'ARMOR', armorRating: 3, handling: -2, description: 'Interlocking steel rings. Historical armour. Obvious, heavy, effective. −2 to Dex actions.' },
  { value: 'Plate Armour',           category: 'ARMOR', armorRating: 4, handling: -3, description: 'Full medieval plate. Outstanding protection at the cost of mobility. −3 to Dex, +1 intimidation.' },
  { value: 'Military Exosuit',       category: 'ARMOR', armorRating: 5, handling: -2, description: 'Experimental powered armour. Near-total protection. Requires Str 3+ to wear without the power assist.' },
  // ── Vehicles ──
  { value: 'Motorcycle (Standard)',  category: 'VEHICLE', range: '160 km/h', handling: 4, structure: 15, armorRating: 0, description: 'Street motorcycle. Fast and manoeuvrable. No protection for rider.' },
  { value: 'Motorcycle (Sport)',     category: 'VEHICLE', range: '280 km/h', handling: 5, structure: 12, armorRating: 0, description: 'High-performance sport bike. Extremely fast, fragile.' },
  { value: 'Compact Car',            category: 'VEHICLE', range: '180 km/h', handling: 3, structure: 20, armorRating: 0, description: 'Standard small car. Economical, easy to park, no frills.' },
  { value: 'Mid-Size Sedan',         category: 'VEHICLE', range: '200 km/h', handling: 3, structure: 25, armorRating: 0, description: 'Common family car. Balanced performance and space.' },
  { value: 'Sports Car',             category: 'VEHICLE', range: '280 km/h', handling: 4, structure: 20, armorRating: 0, description: 'High-performance two-door. Fast, responsive, conspicuous.' },
  { value: 'SUV / 4×4',             category: 'VEHICLE', range: '180 km/h', handling: 2, structure: 30, armorRating: 0, description: 'Heavy utility vehicle. Off-road capable. Large cargo and passenger space.' },
  { value: 'Pickup Truck',           category: 'VEHICLE', range: '175 km/h', handling: 2, structure: 30, armorRating: 0, description: 'Light truck with open cargo bed. Rugged and practical.' },
  { value: 'Van / Minivan',          category: 'VEHICLE', range: '160 km/h', handling: 2, structure: 35, armorRating: 0, description: 'Cargo or passenger van. Good capacity, poor handling. Common for coterie transport.' },
  { value: 'Police Cruiser',         category: 'VEHICLE', range: '240 km/h', handling: 3, structure: 25, armorRating: 0, description: 'Pursuit-rated police vehicle. Fast and reinforced. Roll-bar and push bumper standard.' },
  { value: 'Armoured Limousine',     category: 'VEHICLE', range: '175 km/h', handling: 2, structure: 40, armorRating: 3, description: 'Stretched luxury car with ballistic glass and armour plating. Favoured by elder Kindred.' },
  { value: 'Armoured Personnel Carrier', category: 'VEHICLE', range: '80 km/h', handling: 1, structure: 60, armorRating: 5, description: 'Military APC. Near-impervious to small arms. Limited speed and terrible handling.' },
  { value: '18-Wheeler / Semi',      category: 'VEHICLE', range: '130 km/h', handling: 1, structure: 60, armorRating: 0, description: 'Large articulated lorry. Enormous cargo capacity. Devastating in a collision.' },
  { value: 'Helicopter (Light)',     category: 'VEHICLE', range: '240 km/h', handling: 3, structure: 20, armorRating: 0, description: 'Civil helicopter. Fast transit over terrain that would stop ground vehicles.' },
  { value: 'Helicopter (Military)',  category: 'VEHICLE', range: '280 km/h', handling: 3, structure: 30, armorRating: 2, description: 'Armed or armoured military helicopter. Weapons-capable variants available.' },
  { value: 'Speedboat',              category: 'VEHICLE', range: '100 km/h', handling: 3, structure: 20, armorRating: 0, description: 'Fast open motorboat. Excellent for coastal escape or water-based operations.' },
  { value: 'Yacht',                  category: 'VEHICLE', range: '30 km/h',  handling: 1, structure: 50, armorRating: 0, description: 'Large sailing or motor yacht. Comfortable mobile haven on the water.' },
  { value: 'Private Jet',            category: 'VEHICLE', range: '900 km/h', handling: 2, structure: 40, armorRating: 0, description: 'Small executive jet. Climate-controlled cargo hold suitable for coffin transport.' },
]

// ── Clans & Clan Curses ───────────────────────────────────────────────────────

const CLANS = [
  // ── The 13 Clans ──
  { value: 'Assamite',               curse: 'Under a Tremere curse, Assamite vitae is addictive to other Kindred — those who drink it must make a Willpower roll (Diff 8) or become one step blood bonded. Assamites are also driven to hunt and diablerize other vampires; each month without consuming Kindred vitae they must make a Frenzy check.' },
  { value: 'Assamite Sorcerer',      curse: 'Same Assamite curse. Additionally bound to the sorcerer caste — must tithe knowledge and blood to the elders of Alamut. Dur-An-Ki is their primary blood magic tradition.' },
  { value: 'Assamite Vizier',        curse: 'Same Assamite curse. The Vizier caste is driven to create and perfect — each month without producing a significant work of art, scholarship, or craft, they suffer a cumulative −1 die penalty to Social rolls.' },
  { value: 'Brujah',                  curse: 'The difficulty to resist Frenzy and Rötschreck is always 1 higher (maximum 10). Brujah have a hair-trigger temper and are notorious for losing control of their passions at the worst possible moment.' },
  { value: 'Followers of Set',        curse: 'Suffer double damage from sunlight and fire. When confronted with holy symbols or items of their enemies\' faith, they must make Rötschreck checks as if facing fire. Bright light of any kind causes them discomfort.' },
  { value: 'Setite Sorcerer',        curse: 'Same Setite curse (light sensitivity). Practitioners of Akhu — Egyptian blood sorcery drawing on the power of Set and Apep. Bound to serve the clan\'s temples and serpent cults.' },
  { value: 'Tlacique',               curse: 'Same Setite curse but devoted to Mesoamerican deities rather than Set. Practice Nahuallotl sorcery. Vulnerable to sunlight and obsidian weapons deal aggravated damage.' },
  { value: 'Gangrel',                 curse: 'Each time a Gangrel frenzies, they permanently gain one animalistic feature — claws, slitted pupils, fur, a muzzle, etc. These features can only be removed by spending experience points (1 XP per feature).' },
  { value: 'Giovanni',                curse: 'The Giovanni Kiss is uniquely agonising. Mortals bitten take double the normal damage from blood loss, and receive none of the usual Kiss-induced ecstasy — only pain. This makes feeding discreet and socially invisible all but impossible.' },
  { value: 'Lasombra',                curse: 'Cast no reflection in mirrors or other reflective surfaces and cannot be captured on film, digital cameras, or video. They also suffer +1 difficulty on all Social rolls with non-Lasombra due to their shadow-tainted, unsettling presence.' },
  { value: 'Malkavian',               curse: 'Every Malkavian has at least one permanent derangement woven into the fabric of their Embrace. It can never be fully cured, only managed — and in moments of stress it reasserts itself with full force.' },
  { value: 'Nosferatu',               curse: 'Appearance is permanently 0 and can never be raised. All Social rolls except Intimidation suffer +1 difficulty. Nosferatu cannot walk openly in mortal society without supernatural concealment.' },
  { value: 'Ravnos',                  curse: 'Must indulge a specific vice (determined at Embrace: lying, theft, violence, seduction, etc.) at least once per night. Each night they successfully resist, they suffer a cumulative −1 die penalty to all dice pools until they give in.' },
  { value: 'Toreador',                curse: 'When encountering something of striking beauty — art, music, a face — the Toreador must make a Self-Control roll (Diff 6) or become enraptured and motionless for a full scene, incapable of acting.' },
  { value: 'Tremere',                 curse: 'At the moment of Embrace, every Tremere is blood bonded to the entire Council of Seven. They are also considered one step bonded to all other Tremere. The clan watches its own obsessively; true independence is almost impossible.' },
  { value: 'Tremere Antitribu',      curse: 'Sabbat Tremere who broke the bond to the Council of Seven. They bear a mark of betrayal visible to loyal Tremere and are hunted relentlessly. Cannot benefit from clan support structures.' },
  { value: 'Telyavelic Tremere',     curse: 'Lithuanian pagan Tremere who practice spirit-based blood magic. Same clan bond curse, but they also suffer −1 to all pools when separated from their sacred groves for more than a week.' },
  { value: 'Tzimisce',                curse: 'Must sleep surrounded by at least two handfuls of earth from their birthplace or long-claimed domain each day. Each night they fail to rest in their earth, they lose one die from all dice pools. After three nights, all pools are reduced to zero.' },
  { value: 'Ventrue',                 curse: 'Can only feed from a specific type of mortal chosen at Embrace (e.g. only redheads, only the wealthy, only soldiers). Blood from any other source is immediately vomited up and provides no nourishment whatsoever.' },
  { value: 'Ventrue Antitribu',      curse: 'Same feeding restriction as Ventrue. Sabbat Ventrue are also compelled to prove their superiority — they must lead or they wither. Each week without commanding others, they lose one die from Social pools.' },
  // ── Antitribu & Variants ──
  { value: 'Brujah Antitribu',       curse: 'Same frenzy difficulty increase as Brujah. Sabbat Brujah are even more violent — their frenzy always manifests as destructive rage, never flight.' },
  { value: 'Gangrel Antitribu',      curse: 'Same animalistic feature curse as Gangrel. Country Gangrel Antitribu gain features from the land (horns, bark-like skin); City Gangrel gain urban features (metallic nails, asphalt-grey skin).' },
  { value: 'Lasombra Antitribu',     curse: 'Same no-reflection curse as Lasombra. These rare defectors from the Sabbat are hunted by their own clan and trusted by no one in the Camarilla.' },
  { value: 'Malkavian Antitribu',    curse: 'Same permanent derangement as Malkavian. Sabbat Malkavians tend toward more violent and dangerous madness — their derangements often endanger those around them.' },
  { value: 'Nosferatu Antitribu',    curse: 'Same Appearance 0 curse as Nosferatu. Sabbat Nosferatu often embrace their monstrous appearance, using it to terrorize rather than hide.' },
  { value: 'Ravnos Antitribu',       curse: 'Same vice compulsion as Ravnos. Sabbat Ravnos tend toward more destructive and cruel vices.' },
  { value: 'Serpents of the Light',  curse: 'Defectors from the Followers of Set who joined the Sabbat. Same light sensitivity curse. They oppose Set and his followers, viewing the Antediluvian as a tyrant to be destroyed.' },
  { value: 'Toreador Antitribu',     curse: 'Same entrancement curse as Toreador, but Sabbat Toreador are captivated by ugliness, suffering, and destruction rather than beauty. They create art from pain.' },
  // ── Bloodlines ──
  { value: 'Ahrimanes',               curse: 'An all-female bloodline. Ahrimanes are unable to create childer through the Embrace; they can only convert existing Gangrel through a painful spiritual ritual. They are also compelled to remain near their territory and suffer dice pool penalties when far from their domain.' },
  { value: 'Baali',                   curse: 'Infernalist taint — any vampire with even one dot of True Faith automatically senses the Baali\'s corruption on sight. Holy ground deals aggravated damage to them and faith-based powers affect them more severely than other Kindred.' },
  { value: 'Blood Brothers',          curse: 'Created in circles of linked minds. Blood Brothers share a hive-mind with their circle — they cannot act independently without effort. Each brother has Appearance 0 and cannot raise it, and they suffer a permanent −1 to all Mental dice pools when separated from their circle.' },
  { value: 'Children of Osiris',      curse: 'Must maintain a strict moral code and meditative discipline at all times. If they ever commit an act of frenzy or fall below Humanity 7, they permanently lose access to their unique Bardo Discipline and revert to their parent clan\'s weaknesses.' },
  { value: 'Daughters of Cacophony',  curse: 'Their own Melpominee powers can turn inward. When using their voice to affect others\' emotions, they must make a Willpower roll (Diff 6) or also experience the emotion they are projecting, potentially losing control.' },
  { value: 'Gargoyle',                curse: 'Bound by Tremere Thaumaturgy as eternal guardians. They suffer a supernatural compulsion to protect Tremere chantries and obey Tremere commands. Breaking free requires an exceptional act of will and story-level sacrifice.' },
  { value: 'Harbingers of Skulls',    curse: 'Like the Giovanni, their Kiss deals double damage and provides no pleasure whatsoever. They also radiate an aura of death; mortals and animals flee from them instinctively and they receive −2 to Social pools in mundane interaction.' },
  { value: 'Kiasyd',                  curse: 'Their fae blood makes them vulnerable to cold iron — it deals aggravated damage on contact. Their alien appearance and disturbing presence imposes −2 to Social dice pools with ordinary mortals and many Kindred.' },
  { value: 'Lamia',                   curse: 'Carriers of a supernatural plague. Their bite inflicts a wasting disease on mortals that slowly kills within weeks. They cannot feed without potentially killing their vessel, making discreet feeding nearly impossible.' },
  { value: 'Lhiannan',                curse: 'Bound to the land. A Lhiannan must remain within a specific geographical territory tied to their Embrace. Each night spent outside their domain inflicts a cumulative −1 die penalty to all pools. They cannot establish a new domain easily.' },
  { value: 'Nagaraja',                curse: 'Must consume human flesh as well as blood. Without flesh, they suffer cumulative dice pool penalties each night. Their bite tears rather than seduces, providing none of the Kiss\'s social camouflage.' },
  { value: 'Noiad',                   curse: 'Deeply connected to the spirit world. Noiad constantly perceive echoes of the Umbra overlaid on the physical world. They suffer +2 difficulty on all Perception rolls in urban environments and become disoriented in areas with weak spiritual resonance.' },
  { value: 'Old Clan Tzimisce',       curse: 'Like the Tzimisce, they must sleep with earth from their homeland. However, they also refuse to learn Vicissitude, viewing it as a spiritual corruption. They lack the signature Discipline of their parent clan entirely.' },
  { value: 'Salubri',                 curse: 'A third eye opens in the centre of their forehead whenever they use Disciplines — impossible to hide. Every Kindred feels a Tremere-implanted supernatural compulsion to hunt and diablerize the Salubri on sight.' },
  { value: 'Salubri Antitribu',       curse: 'The warrior caste of the Salubri. They share the third eye curse and are hunted by the Tremere. Additionally, they must pursue and destroy infernalists and other corrupt supernaturals — failing to do so when the opportunity arises causes them to lose Willpower.' },
  { value: 'Samedi',                  curse: 'Appear as rotting, desiccated corpses regardless of age or power. Appearance cannot exceed 0. All Social rolls except Intimidation suffer +1 difficulty, identical to Nosferatu. They cannot pass for living under any normal circumstances.' },
  { value: 'True Brujah',             curse: 'Emotionally dead. True Brujah cannot feel passion or strong emotion. They never frenzy, but they also cannot spend Willpower to gain automatic successes on Social rolls involving genuine emotional appeal. Their cold detachment is obvious and unsettling.' },
  // ── Non-clan ──
  { value: 'Caitiff',                 curse: 'No inherent clan curse, but Caitiff are universally despised. They have no clan Discipline affinities and pay the out-of-clan experience cost for all powers. Status is always treated as 0 when interacting with clanned Kindred who know their lineage.' },
  { value: 'Ghoul',                   curse: 'No Kindred curse. The ghoul is bound to their regnant by the blood bond and must feed on their regnant\'s vitae at least once per month or begin aging and losing their ghoul powers. Severing the bond is psychologically devastating.' },
  { value: 'Mortal',                  curse: 'No supernatural curse. Subject to normal aging, disease, and injury with no supernatural resilience.' },
]

const DISCIPLINES = [
  { value: 'Animalism', description: 'Command animals and commune with the Beast within all living things.',
    levels: [
      '●  Feral Whispers — Communicate with and issue simple commands to a single animal.',
      '●● Beckoning — Summon all animals of a chosen type from the surrounding area.',
      '●●● Quell the Beast — Stifle the Beast in a mortal or vampire, inducing calm or torpor-like sleep.',
      '●●●● Subsume the Spirit — Project your consciousness into an animal, riding its senses and body.',
      '●●●●● Drawing Out the Beast — Expel your own frenzy into another being, forcing them to frenzy in your place.',
    ] },
  { value: 'Auspex', description: 'Heightened senses, clairvoyance, and psychic perception beyond mortal limits.',
    levels: [
      '●  Heightened Senses — All senses sharpened to supernatural levels; detect hidden or concealed things.',
      '●● Aura Perception — Read the swirling emotional auras of living beings and undead.',
      '●●● The Spirit\'s Touch — Receive psychic impressions from objects or locations by touch.',
      '●●●● Telepathy — Probe the surface thoughts of a target within line of sight.',
      '●●●●● Psychic Projection — Send your consciousness out of your body as an invisible astral form.',
    ] },
  { value: 'Celerity', description: 'Supernatural speed and reflexes — move faster than the eye can follow.',
    levels: [
      '●  Gain 1 extra action per turn when spending a blood point.',
      '●● Gain 2 extra actions per turn when spending blood; blur of motion.',
      '●●● Gain 3 extra actions per turn; effectively invisible at full sprint.',
      '●●●● Gain 4 extra actions per turn; superhuman reaction and evasion.',
      '●●●●● Gain 5 extra actions per turn; nearly impossible to hit or catch.',
    ] },
  { value: 'Chimerstry', description: 'Craft vivid illusions and hallucinations indistinguishable from reality. (Ravnos)',
    levels: [
      '●  Ignis Fatuus — Create a simple static illusion affecting one sense.',
      '●● Fata Morgana — Create complex static illusions engaging all five senses.',
      '●●● Apparition — Grant your illusions movement, making them dynamic and interactive.',
      '●●●● Permanency — Illusions persist indefinitely without requiring concentration.',
      '●●●●● Horrid Reality — Illusions become tactile and lethal; victims take real damage from imaginary harm.',
    ] },
  { value: 'Dementation', description: 'Shatter minds and unleash madness in mortals and Kindred alike. (Malkavian)',
    levels: [
      '●  Passion — Inflame or deaden a target\'s emotions dramatically.',
      '●● The Haunting — Plant persistent sensory hallucinations that stalk the victim.',
      '●●● Eyes of Chaos — See the fracture lines of a target\'s psyche; read their derangements and insights.',
      '●●●● Voice of Madness — Trigger immediate frenzy or Rötschreck in mortals and Kindred.',
      '●●●●● Total Insanity — Simultaneously inflict five derangements on a target.',
    ] },
  { value: 'Dominate', description: 'Overwrite the will of others — command minds, plant memories, erase thoughts.',
    levels: [
      '●  Command — Issue a single-word order through eye contact that must be obeyed immediately.',
      '●● Mesmerism — Implant a simple suggestion or instruction through eye contact and spoken words.',
      '●●● The Forgetful Mind — Rewrite, alter, or erase specific memories.',
      '●●●● Conditioning — Break down a victim\'s will through repeated use, making them wholly dependent.',
      '●●●●● Possession — Displace a victim\'s mind entirely and inhabit their body.',
    ] },
  { value: 'Fortitude', description: 'Supernatural resilience — shrug off wounds, fire, and sunlight that would destroy others.',
    levels: [
      '●  Add 1 die to all soak rolls, including fire, sunlight, and aggravated damage.',
      '●● Add 2 dice to all soak rolls; shrug off blows that would stagger a normal vampire.',
      '●●● Add 3 dice; routine aggravated damage is treated more like lethal.',
      '●●●● Add 4 dice; near-immunity to mundane harm; supernatural attacks barely register.',
      '●●●●● Add 5 dice; you are effectively indestructible against most physical threats.',
    ] },
  { value: 'Melpominee', description: 'Weaponise the voice to inspire, destroy, or control. (Daughters of Cacophony)',
    levels: [
      '●  The Missing Voice — Throw your voice to any visible location or speak without moving your lips.',
      '●● Phantom Speaker — Project your voice to any location you have visited before.',
      '●●● Madrigal — Affect the emotions of all who hear your performance.',
      '●●●● Siren\'s Beckoning — Incite a target to harmful or self-destructive action through song.',
      '●●●●● The Voice of Pan — Trigger mass hysteria and frenzy in all who hear you sing.',
    ] },
  { value: 'Mortis', description: 'Wield the power of death itself — decay, plague, and the stillness of the grave. (Giovanni-adjacent)',
    levels: [
      '●  Masque of Death — Assume the appearance of a corpse; mortals sense only death.',
      '●● Blight — Wither living tissue with a touch, inflicting aggravated damage.',
      '●●● Soul Stealing — Temporarily separate a mortal\'s soul from their body.',
      '●●●● Corruption — Inflict a supernatural wasting disease that erodes Attributes over time.',
      '●●●●● Army of the Dead — Reanimate nearby corpses as temporary, obedient undead servants.',
    ] },
  { value: 'Necromancy', description: 'Summon, interrogate, and command the spirits of the dead. (Giovanni)',
    levels: [
      '●  Insight — Hear and speak with the ghost of someone recently deceased.',
      '●● Summon Soul — Call a specific ghost from wherever it resides.',
      '●●● Compel Soul — Force a ghost to answer questions truthfully and obey commands.',
      '●●●● Haunting — Bind a ghost to a location, object, or person.',
      '●●●●● Torment — Inflict agonising spiritual pain on ghosts or strip them of their essence.',
    ] },
  { value: 'Obfuscate', description: 'Cloak yourself from sight and mind — become invisible, unnoticed, forgotten.',
    levels: [
      '●  Cloak of Shadows — Become near-invisible while motionless in shadow.',
      '●● Unseen Presence — Move about undetected as long as you do not draw direct attention.',
      '●●● Mask of a Thousand Faces — Alter your perceived appearance; others see a forgettable stranger.',
      '●●●● Vanish from the Mind\'s Eye — Disappear from sight even while being actively watched.',
      '●●●●● Cloak the Gathering — Extend Obfuscate to conceal a group of people around you.',
    ] },
  { value: 'Obtenebration', description: 'Command living darkness and shadows as weapons and shields. (Lasombra)',
    levels: [
      '●  Shadow Play — Animate shadows for minor effects; inflict unease on those who witness it.',
      '●● Shroud of Night — Create a cloud of supernatural darkness that blocks all light and most senses.',
      '●●● Arms of the Abyss — Conjure tentacles of living darkness to grab, constrict, and damage.',
      '●●●● Black Metamorphosis — Partially transform into a creature of darkness; gain tentacles and resistances.',
      '●●●●● Tenebrous Form — Dissolve completely into living shadow; become nearly impossible to harm.',
    ] },
  { value: 'Potence', description: 'Supernatural physical strength — hit harder, lift more, destroy utterly.',
    levels: [
      '●  Add 1 automatic success to all Strength-based rolls.',
      '●● Add 2 automatic successes; bend steel, punch through walls.',
      '●●● Add 3 automatic successes; lift cars, demolish structures barehanded.',
      '●●●● Add 4 automatic successes; devastating force capable of levelling masonry.',
      '●●●●● Add 5 automatic successes; near-mythic physical might; almost no physical object can resist you.',
    ] },
  { value: 'Presence', description: 'Supernatural charisma — inspire awe, love, or terror with a glance.',
    levels: [
      '●  Awe — Inspire fascination and admiration in those around you.',
      '●● Dread Gaze — Terrify a target with a burst of supernatural fear and revulsion.',
      '●●● Entrancement — Cause a target to become deeply infatuated and devoted to you.',
      '●●●● Summon — Irresistibly call a specific person to your location across any distance.',
      '●●●●● Majesty — Radiate overwhelming awe that prevents anyone from taking hostile action against you.',
    ] },
  { value: 'Protean', description: 'Reshape your body — grow claws, become mist, merge with the earth. (Gangrel)',
    levels: [
      '●  Eyes of the Beast — See perfectly in total darkness; eyes glow red or gold.',
      '●● Feral Claws — Grow razor-sharp claws that inflict aggravated damage.',
      '●●● Earth Meld — Sink into natural earth to hide or sleep safely during the day.',
      '●●●● Shape of the Beast — Transform into a wolf or a large bat.',
      '●●●●● Mist Form — Dissolve into a nearly insubstantial cloud of mist.',
    ] },
  { value: 'Quietus', description: 'Assassination through blood — silence, poison, and lethal precision. (Assamite)',
    levels: [
      '●  Silence of Death — Create a zone of supernatural, absolute silence around yourself.',
      '●● Scorpion\'s Touch — Transmute your vitae into a contact poison that weakens or kills.',
      '●●● Dagon\'s Call — Cause a victim\'s blood to boil from within their veins at range.',
      '●●●● Baal\'s Caress — Coat weapons in your blood, causing them to inflict aggravated damage.',
      '●●●●● Taste of Death — Spit your vitae as a stream of caustic acid that burns through anything.',
    ] },
  { value: 'Sanguinus', description: 'Share senses and abilities through a blood link with others. (Blood Brothers)',
    levels: [
      '●  Brother\'s Blood — Share sensory perceptions with blood-linked partners.',
      '●● Coordinate Attacks — Perfectly synchronise combat actions with linked partners.',
      '●●● Shared Strength — Channel your own physical Attributes to bolster a linked partner.',
      '●●●● Gestalt — Partially merge minds with all blood-linked partners, sharing knowledge and intent.',
      '●●●●● Walk Together — Allow the entire linked group to act and move as a single coordinated entity.',
    ] },
  { value: 'Serpentis', description: 'Serpentine powers of transformation and corruption. (Followers of Set)',
    levels: [
      '●  Eyes of the Serpent — Hypnotise with your gaze; eyes become gold with vertical pupils.',
      '●● The Tongue of the Asp — Extend your tongue to a metre\'s length; deliver lethal venomous bites.',
      '●●● The Skin of the Adder — Become supple and scaly; increase Stamina and Dexterity.',
      '●●●● The Form of the Cobra — Transform fully into a large cobra.',
      '●●●●● The Heart of Darkness — Remove your heart from your body and store it safely elsewhere.',
    ] },
  { value: 'Spiritus', description: 'Bind, command, and commune with spirits of the wild. (Ahrimanes)',
    levels: [
      '●  Aspect of the Beast — Temporarily take on the traits of your personal animal spirit.',
      '●● The Voice — Communicate freely with the spirits inhabiting animals and wild places.',
      '●●● Rouse the Spirit — Awaken dormant spirits in animals and nature.',
      '●●●● Bind the Spirit — Compel a nature spirit to serve you for a period of time.',
      '●●●●● Grasp Beyond — Reach into the spirit world to perceive or directly affect events there.',
    ] },
  { value: 'Thanatosis', description: 'Powers of rot, decay, and the walking dead. (Samedi)',
    levels: [
      '●  Ashes and Dust — Cause flesh to dry and wither with a touch, dealing lethal damage.',
      '●● Withering — Age a target\'s body dramatically, reducing their physical Attributes.',
      '●●● Putrefaction — Cause rapid, visible rot in living or undead tissue.',
      '●●●● Necrosis — Inflict instant gangrenous decay on a specific limb, destroying it.',
      '●●●●● Dust to Dust — Reduce a target to ash and desiccated powder with a touch.',
    ] },
  { value: 'Thaumaturgy', description: 'Blood sorcery — rituals, paths of magic, and arcane power. (Tremere)',
    levels: [
      '●  A Taste for Blood — Taste vitae to learn the drinker\'s generation, clan, and current blood pool.',
      '●● Blood Rage — Force a vampire to spend blood against their will.',
      '●●● Blood of Potency — Temporarily increase the potency of your own vitae.',
      '●●●● Theft of Vitae — Draw blood from a victim at range without physical contact.',
      '●●●●● Cauldron of Blood — Boil the blood inside a victim\'s body, inflicting massive aggravated damage.',
    ] },
  { value: 'Valeren', description: 'Heal, sense souls, and inflict agonising pain. (Salubri)',
    levels: [
      '●  Sense the Sin — Detect the spiritual state, derangements, and recent sins of another.',
      '●● Anoint the Sick — Heal mortal ailments, diseases, and injuries with a touch.',
      '●●● Burning Touch — Inflict searing spiritual and physical pain with your hands.',
      '●●●● Merciful Blow — Strike someone unconscious with a precise blow that leaves no lasting harm.',
      '●●●●● Ending the Struggle — Grant a mortal or vampire instant death or final peace with a touch.',
    ] },
  { value: 'Vicissitude', description: 'Sculpt flesh and bone like clay — reshape bodies, your own or others\'. (Tzimisce)',
    levels: [
      '●  Malleable Visage — Reshape your own facial features and superficial body at will.',
      '●● Fleshcraft — Sculpt the flesh of yourself or other beings like clay.',
      '●●● Bonecraft — Reshape, reposition, and weaponise bones.',
      '●●●● Horrid Form — Transform into a monstrous combat form with enhanced physical Attributes.',
      '●●●●● Inner Essence — Remove, reposition, or destroy internal organs without surgery.',
    ] },
  { value: 'Visceratika', description: 'Stone-like resilience and gargoyle powers. (Gargoyle)',
    levels: [
      '●  Skin of the Chameleon — Blend seamlessly into stone or brick surfaces, becoming nearly invisible.',
      '●● Clinging of the Fly — Cling to and travel along vertical surfaces and ceilings.',
      '●●● Razored Hide — Grow a coat of stone-like spines; attackers who strike you bare-handed take damage.',
      '●●●● The Flow Within the Stone — Merge with and pass through stone as if it were water.',
      '●●●●● Armor of Terra — Transform your skin into an invulnerable shell of living stone.',
    ] },
  { value: 'Daimoinon', description: 'Infernal powers of sin, hellfire, and dark pacts. (Baali)',
    levels: [
      '●  Sense the Sin — Detect a target\'s greatest vice or spiritual weakness.',
      '●● Conflagration — Summon flames from the fires of Hell.',
      '●●● Flames of the Netherworld — Call down infernal fire on an area.',
      '●●●● Psychomachia — Force a target to confront their inner darkness.',
      '●●●●● Conduit — Open a channel to dark infernal powers.',
    ] },
  { value: 'Mytherceria', description: 'Fey sight and faerie riddles that trap the mind. (Kiasyd)',
    levels: [
      '●  Fey Sight — Perceive faerie enchantments and supernatural auras.',
      '●● Darkling Trickery — Create minor faerie-like magical effects.',
      '●●● Goblinism — Reshape small objects with faerie magic.',
      '●●●● Chanjelin Ward — Create a magical barrier against intrusion.',
      '●●●●● Riddle Phantastique — Pose a riddle that traps the target\'s mind.',
    ] },
  { value: 'Obeah', description: 'Healing, cleansing, and spiritual protection. (Salubri)',
    levels: [
      '●  Sense Vitality — Assess the health and vital condition of a target.',
      '●● Anesthetic Touch — Numb a target\'s pain with a touch.',
      '●●● Corpore Sano — Heal aggravated wounds in a living target.',
      '●●●● Shepherd\'s Watch — Protect a target from supernatural influence.',
      '●●●●● Unburdening the Bestial Soul — Draw out and cleanse corruption.',
    ] },
  { value: 'Temporis', description: 'Manipulation of time itself — freeze, slow, and age. (True Brujah)',
    levels: [
      '●  Sense the Fleeting — Perceive temporal distortions and the passage of time.',
      '●● Rampart — Create a personal temporal barrier against attacks.',
      '●●● Nights of Belated Regret — Age an object or target rapidly.',
      '●●●● Domain of Evernight — Slow or freeze time in an area.',
      '●●●●● Outside the Hourglass — Step outside the flow of time entirely.',
    ] },
]


const ARCHETYPES = [
  { value: 'Architect',      description: 'You create things of lasting value. You believe in structure and order, and need to leave a permanent mark on the world.' },
  { value: 'Autocrat',       description: 'You need to be in control. You crave power and authority and are not satisfied unless you are in charge of every situation.' },
  { value: 'Bon Vivant',     description: 'Unlife is for indulgence. You seek pleasure, excess, and the finer things — whatever that means to one of the damned.' },
  { value: 'Bravo',          description: 'You are a bully who uses force and intimidation to get your way. Strength is the only language you truly respect.' },
  { value: 'Caregiver',      description: 'You nurture and protect others. Compassion and empathy guide your actions, even amid the darkness of the night.' },
  { value: 'Celebrant',      description: 'You have a single passion or cause that fuels everything. That obsession gives unlife its meaning and fire.' },
  { value: 'Child',          description: 'You are innocent and dependent, expecting others to care for and protect you from a world that has always been too cruel.' },
  { value: 'Competitor',     description: 'You must win at everything. Competition and the drive to be the best push your every decision and action.' },
  { value: 'Conformist',     description: 'You follow the group and need to belong. You thrive on consensus, shared identity, and fitting in with your peers.' },
  { value: 'Conniver',       description: 'You manipulate to get what you want. Working angles and pulling strings is simply second nature to you.' },
  { value: 'Curmudgeon',     description: 'You find fault in everything. Cynicism and biting criticism are your shields against disappointment and attachment.' },
  { value: 'Deviant',        description: 'You reject society\'s norms and revel in your abnormality. You define yourself entirely by what you refuse to be.' },
  { value: 'Director',       description: 'You take charge and get things done. Without your guidance, you are certain, everything would fall apart.' },
  { value: 'Enigma',         description: 'Your motives are unfathomable even to yourself. You are delightfully unpredictable and confound everyone around you.' },
  { value: 'Eye of the Storm', description: 'Chaos and violence seem to follow you everywhere, yet you remain eerily calm and composed at the center of it all.' },
  { value: 'Fanatic',        description: 'You are utterly devoted to a cause or belief. Nothing else matters as much as serving that ideal, no matter the cost.' },
  { value: 'Gallant',        description: 'You are a showoff — charming, flamboyant, and always playing to the crowd. Style is never separate from substance.' },
  { value: 'Judge',          description: 'You seek balance and justice. Fair outcomes matter deeply to you, and you hold yourself to the very same standard.' },
  { value: 'Loner',          description: 'You prefer solitude and distrust others. You work best alone and feel genuine resentment when forced to rely on anyone.' },
  { value: 'Martyr',         description: 'You sacrifice yourself for others or your beliefs. Suffering in service of a higher purpose is what gives you meaning.' },
  { value: 'Masochist',      description: 'You test your limits through pain and adversity. Only by pushing yourself to breaking do you feel truly real.' },
  { value: 'Monster',        description: 'You have fully embraced your predatory nature. You are what you are — a creature of darkness — and you revel in it.' },
  { value: 'Pedagogue',      description: 'You teach and preach relentlessly. Spreading knowledge and correcting ignorance is your calling in unlife.' },
  { value: 'Penitent',       description: 'You are wracked with guilt for your sins and your very existence. You seek redemption, though you doubt you deserve it.' },
  { value: 'Perfectionist',  description: 'You demand excellence from yourself and everyone around you. Failure and sloppiness are simply unacceptable.' },
  { value: 'Rebel',          description: 'You fight against authority and convention on principle. Rules are constraints created by others to control people like you.' },
  { value: 'Rogue',          description: 'Your own benefit is your only real concern. You look out for yourself above all else, always and without apology.' },
  { value: 'Scientist',      description: 'You approach everything analytically and with detachment. Data, method, and evidence are the only gods you trust.' },
  { value: 'Survivor',       description: 'You endure no matter the cost. Survival is not merely instinct — it is your identity, your purpose, your entire self.' },
  { value: 'Thrill-Seeker',  description: 'You crave excitement and danger. The rush of real risk is the only thing that makes unlife feel worth living.' },
  { value: 'Traditionalist', description: 'You respect established ways and time-honoured custom. Stability and continuity matter far more to you than change.' },
  { value: 'Trickster',      description: 'You find humour in everything, even at others\' expense. Laughter, chaos, and mischief are your favourite tools.' },
  { value: 'Visionary',      description: 'You dream of something beyond the mundane and work obsessively toward it, however impossible it may seem to others.' },
]

const HEALTH_LEVELS = [
  { key: 'healthy',       penalty: '' },
  { key: 'bruised',       penaltyKey: 'noPenalty' },
  { key: 'hurt',          penalty: '−1' },
  { key: 'injured',       penalty: '−1' },
  { key: 'wounded',       penalty: '−2' },
  { key: 'mauled',        penalty: '−2' },
  { key: 'crippled',      penalty: '−5' },
  { key: 'incapacitated', penalty: '' },
  { key: 'torpor',        penalty: '' },
  { key: 'finalDeath',    penalty: '' },
]

const BLOOD_TABLE = {
  15: { max: 10, perTurn: 1 }, 14: { max: 10, perTurn: 1 }, 13: { max: 10, perTurn: 1 },
  12: { max: 11, perTurn: 1 }, 11: { max: 12, perTurn: 1 }, 10: { max: 13, perTurn: 1 },
   9: { max: 14, perTurn: 2 },  8: { max: 15, perTurn: 3 },  7: { max: 20, perTurn: 4 },
   6: { max: 30, perTurn: 5 },  5: { max: 40, perTurn: 6 },  4: { max: 50, perTurn: 8 },
}

function bloodStats(gen) {
  return BLOOD_TABLE[gen] ?? { max: 10, perTurn: 1 }
}

const INITIAL = {
  // Identity
  npc: false, splat: 'VAMPIRE',
  name: '', altName: '', concept: '', clan: '', sect: '',
  generation: 8, nature: '', demeanor: '', domainHaven: '',
  visibleAge: '', totalAge: '',
  // Attributes
  strength: 1, dexterity: 1, stamina: 1,
  charisma: 1, manipulation: 1, appearance: 1,
  perception: 1, intelligence: 1, wits: 1,
  // Talents
  alertness: 0, athletics: 0, awareness: 0, brawl: 0, empathy: 0,
  expression: 0, intimidation: 0, leadership: 0, streetwise: 0, subterfuge: 0,
  hobbyTalent1Name: '', hobbyTalent1: 0,
  hobbyTalent2Name: '', hobbyTalent2: 0,
  hobbyTalent3Name: '', hobbyTalent3: 0,
  hobbyTalent4Name: '', hobbyTalent4: 0,
  hobbyTalent5Name: '', hobbyTalent5: 0,
  hobbyTalent6Name: '', hobbyTalent6: 0,
  hobbyTalent7Name: '', hobbyTalent7: 0,
  hobbyTalent8Name: '', hobbyTalent8: 0,
  hobbyTalent9Name: '', hobbyTalent9: 0,
  hobbyTalent10Name: '', hobbyTalent10: 0,
  // Skills
  animalKen: 0, crafts: 0, drive: 0, etiquette: 0, firearms: 0,
  larceny: 0, melee: 0, performance: 0, stealth: 0, survival: 0,
  profSkill1Name: '', profSkill1: 0,
  profSkill2Name: '', profSkill2: 0,
  profSkill3Name: '', profSkill3: 0,
  profSkill4Name: '', profSkill4: 0,
  profSkill5Name: '', profSkill5: 0,
  profSkill6Name: '', profSkill6: 0,
  profSkill7Name: '', profSkill7: 0,
  profSkill8Name: '', profSkill8: 0,
  profSkill9Name: '', profSkill9: 0,
  profSkill10Name: '', profSkill10: 0,
  // Knowledges
  academics: 0, computer: 0, finance: 0, investigation: 0, law: 0,
  linguistics: 0, medicine: 0, occult: 0, politics: 0, science: 0, technology: 0,
  expertKnowl1Name: '', expertKnowl1: 0,
  expertKnowl2Name: '', expertKnowl2: 0,
  expertKnowl3Name: '', expertKnowl3: 0,
  expertKnowl4Name: '', expertKnowl4: 0,
  expertKnowl5Name: '', expertKnowl5: 0,
  expertKnowl6Name: '', expertKnowl6: 0,
  expertKnowl7Name: '', expertKnowl7: 0,
  expertKnowl8Name: '', expertKnowl8: 0,
  expertKnowl9Name: '', expertKnowl9: 0,
  expertKnowl10Name: '', expertKnowl10: 0,
  // Specialties — Attributes
  strengthSpec: '', dexteritySpec: '', staminaSpec: '',
  charismaSpec: '', manipulationSpec: '', appearanceSpec: '',
  perceptionSpec: '', intelligenceSpec: '', witsSpec: '',
  // Specialties — Talents
  alertnessSpec: '', athleticsSpec: '', awarenessSpec: '', brawlSpec: '', empathySpec: '',
  expressionSpec: '', intimidationSpec: '', leadershipSpec: '', streetwiseSpec: '', subterfugeSpec: '',
  // Specialties — Skills
  animalKenSpec: '', craftsSpec: '', driveSpec: '', etiquetteSpec: '', firearmsSpec: '',
  larcenySpec: '', meleeSpec: '', performanceSpec: '', stealthSpec: '', survivalSpec: '',
  // Specialties — Knowledges
  academicsSpec: '', computerSpec: '', financeSpec: '', investigationSpec: '', lawSpec: '',
  linguisticsSpec: '', medicineSpec: '', occultSpec: '', politicsSpec: '', scienceSpec: '', technologySpec: '',
  // Virtues & Path
  conscience: 1, selfControl: 1, courage: 1,
  pathName: 'Humanity', pathRating: 2,
  willpower: 3, currentWillpower: 3,
  // Blood & Health
  currentBlood: 10, woundLevel: 0,
  healthBruised: '', healthHurt: '', healthInjured: '', healthWounded: '', healthMauled: '', healthCrippled: '', healthIncap: '',
  // Misc
  derangement1: '', derangement2: '',
  clanCurse: '', notes: '',
  backstory: '', appearanceDesc: '', goals: '', allies: '', enemies: '', havens: '', territories: '',
  personalItems: '',
}

// ── Validation ────────────────────────────────────────────────────────────────

function validate(fields, t) {
  const errors = []
  const warnings = []

  if (!fields.clan.trim()) warnings.push(t('clanNotSet'))

  const gen = fields.generation
  if (!gen || gen < 4 || gen > 15) errors.push(t('genRange'))

  const isHumanity = fields.pathName.trim().toLowerCase() === 'humanity'
  if (isHumanity) {
    const expected = fields.conscience + fields.selfControl
    if (fields.pathRating !== expected)
      warnings.push(t('humanityHint').replace('{0}', expected))
  }

  const { max } = bloodStats(gen)
  if (fields.currentBlood > max) errors.push(t('bloodPoolExceed').replace('{0}', max).replace('{1}', gen))
  if (fields.currentWillpower > fields.willpower) errors.push(t('wpExceed'))

  const customAbilities = [
    ...Array.from({length: 10}, (_, i) => i + 1).map(n => [fields[`hobbyTalent${n}Name`], fields[`hobbyTalent${n}`], `${t('phHobbyTalent')} ${n}`]),
    ...Array.from({length: 10}, (_, i) => i + 1).map(n => [fields[`profSkill${n}Name`], fields[`profSkill${n}`], `${t('phProfSkill')} ${n}`]),
    ...Array.from({length: 10}, (_, i) => i + 1).map(n => [fields[`expertKnowl${n}Name`], fields[`expertKnowl${n}`], `${t('phExpertKnowl')} ${n}`]),
  ]
  for (const [nameVal, rating, lbl] of customAbilities) {
    if (rating > 0 && !nameVal.trim()) warnings.push(t('ratingNoName').replace('{0}', lbl))
  }

  return { errors, warnings }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getLevelHint(catalog, name, level) {
  const entry = catalog.find(c => c.value.toLowerCase() === name.trim().toLowerCase())
  return entry?.levels?.[level - 1] ?? null
}

const ABILITY_LABELS = { animalKen: 'Animal Ken' }
function label(key) {
  return ABILITY_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1)
}

function ordinal(n) {
  const s = ['th','st','nd','rd'], v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

function RatingRow({ abilityKey, specKey, fields, onField, onText, max, t }) {
  const displayLabel = t ? t(abilityKey) : label(abilityKey)
  const specPlaceholder = t ? t('specialty') : 'Specialty'
  return (
    <div className="ability-row">
      <DotRating label={displayLabel} name={abilityKey} value={fields[abilityKey]} onChange={onField} max={max} />
      <input
        className="spec-input"
        type="text"
        name={specKey}
        value={fields[specKey] ?? ''}
        onChange={onText}
        placeholder={specPlaceholder}
        aria-label={`${displayLabel} specialty`}
      />
    </div>
  )
}

function CustomAbilityRow({ nameProp, ratingProp, placeholder, fields, onField, onText, catalog, max }) {
  const match = catalog?.find(c => c.value === fields[nameProp])
  return (
    <div className="custom-ability-row">
      <input
        type="text"
        name={nameProp}
        value={fields[nameProp]}
        onChange={onText}
        placeholder={placeholder}
        aria-label={`${placeholder} name`}
        className="custom-ability-name"
        list={`${nameProp}-list`}
      />
      {catalog && <datalist id={`${nameProp}-list`}>{catalog.map(c => <option key={c.value} value={c.value} />)}</datalist>}
      <DotRating label="" name={ratingProp} value={fields[ratingProp]} onChange={onField} max={max} />
      {match && <p className="archetype-desc" style={{ gridColumn: '1 / -1', margin: 0 }}>{match.description}</p>}
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CharacterForm() {
  const { t, lang } = useLanguage()
  const { id: paramId } = __useParams()
  const __navigate = __useNavigate()
  const characterId = paramId ? Number(paramId) : null
  const onBack = () => __navigate('/characters')
  const [tab, setTab] = useState(0)
  const [fields, setFields] = useState(INITIAL)
  const [disciplines, setDisciplines] = useState([])
  const [backgrounds, setBackgrounds] = useState([])
  const [merits, setMerits] = useState([])
  const [flaws, setFlaws] = useState([])
  const [meritCatalog, setMeritCatalog] = useState([])
  const [flawCatalog, setFlawCatalog] = useState([])
  const [meritSearch, setMeritSearch] = useState('')
  const [flawSearch, setFlawSearch] = useState('')
  const [newDiscipline, setNewDiscipline] = useState({ name: '', level: 1 })
  const [newBackground, setNewBackground] = useState({ name: '', level: 1, description: '' })
  const [tagInfo, setTagInfo] = useState(null)   // discipline / background panel
  const [mfInfo,  setMfInfo]  = useState(null)   // merit / flaw panel
  const [inventory, setInventory] = useState([])
  const [newItem, setNewItem] = useState({ name: '', category: 'EQUIPMENT', quantity: 1, damage: '', concealment: '', range: '', rate: '', clip: '', armorRating: null, handling: null, structure: null, notes: '' })
  const [comboDisciplines, setComboDisciplines] = useState([])
  const [newCombo, setNewCombo] = useState({ name: '', prerequisites: '', description: '', xpCost: '' })
  const [sorceryPaths, setSorceryPaths] = useState([])
  const [rituals, setRituals] = useState([])
  const [newPath, setNewPath] = useState({ name: '', level: 1 })
  const [newRitual, setNewRitual] = useState({ name: '', level: 1, notes: '' })
  const [sorcInfo, setSorcInfo] = useState(null)
  const [xpLog, setXpLog] = useState([])
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [actionError, setActionError] = useState(null)

  const [searchParams] = __useSearchParams()
  const guidedMode = searchParams.get('mode') === 'guided'
  const viewMode = searchParams.get('mode') === 'view'
  const { isAutoCreating } = useAutoCreate(characterId, INITIAL)

  // Guided creation state
  const [attrPriority, setAttrPriority] = useState({ physical: null, social: null, mental: null })
  const [abilPriority, setAbilPriority] = useState({ talents: null, skills: null, knowledges: null })

  const ATTR_BUDGETS = { primary: 7, secondary: 5, tertiary: 3 }
  const ABIL_BUDGETS = { primary: 13, secondary: 9, tertiary: 5 }

  const ATTR_GROUPS = {
    physical: ['strength', 'dexterity', 'stamina'],
    social: ['charisma', 'manipulation', 'appearance'],
    mental: ['perception', 'intelligence', 'wits'],
  }
  const ABIL_GROUPS = {
    talents: ['alertness', 'athletics', 'awareness', 'brawl', 'empathy', 'expression', 'intimidation', 'leadership', 'streetwise', 'subterfuge'],
    skills: ['animalKen', 'crafts', 'drive', 'etiquette', 'firearms', 'larceny', 'melee', 'performance', 'stealth', 'survival'],
    knowledges: ['academics', 'computer', 'finance', 'investigation', 'law', 'linguistics', 'medicine', 'occult', 'politics', 'science', 'technology'],
  }

  function getAttrSpent(group) {
    return ATTR_GROUPS[group].reduce((sum, a) => sum + (fields[a] - 1), 0)
  }
  function getAbilSpent(group) {
    return ABIL_GROUPS[group].reduce((sum, a) => sum + fields[a], 0)
  }
  function getAttrBudget(group) {
    const priority = attrPriority[group]
    return priority ? ATTR_BUDGETS[priority] : 0
  }
  function getAbilBudget(group) {
    const priority = abilPriority[group]
    return priority ? ABIL_BUDGETS[priority] : 0
  }

  function PrioritySelector({ group, priorities, setPriorities, budgets }) {
    const currentPriority = priorities[group]
    const usedPriorities = Object.values(priorities).filter(Boolean)

    return (
      <div className="priority-selector">
        {['primary', 'secondary', 'tertiary'].map(p => {
          const isActive = currentPriority === p
          const isTaken = !isActive && usedPriorities.includes(p)
          return (
            <button
              key={p}
              type="button"
              className={`priority-btn${isActive ? ' priority-btn--active' : ''}`}
              disabled={isTaken}
              onClick={() => {
                setPriorities(prev => {
                  const next = { ...prev }
                  for (const k of Object.keys(next)) {
                    if (next[k] === p) next[k] = null
                  }
                  next[group] = isActive ? null : p
                  return next
                })
              }}
            >
              {t(`priority${p.charAt(0).toUpperCase() + p.slice(1)}`).replace('{0}', budgets[p])}
            </button>
          )
        })}
        {!currentPriority && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{t('unassigned')}</span>}
      </div>
    )
  }

  function PointsIndicator({ spent, budget }) {
    const remaining = budget - spent
    const cls = remaining > 0 ? 'points-remaining--ok' : remaining < 0 ? 'points-remaining--over' : 'points-remaining--done'
    const text = remaining >= 0
      ? t('pointsRemaining').replace('{0}', remaining)
      : t('pointsOver').replace('{0}', Math.abs(remaining))
    return budget > 0 ? <span className={`points-remaining ${cls}`}>{text}</span> : null
  }

  const { max: maxBlood, perTurn } = bloodStats(fields.generation)
  const isHumanity = fields.pathName.trim().toLowerCase() === 'humanity'
  const computedPath = fields.conscience + fields.selfControl
  const isElder = fields.generation <= 7
  const elderMax = isElder ? 9 : 5
  const { errors: validationErrors, warnings: validationWarnings } = validate(fields, t)

  useEffect(() => {
    if (characterId) loadCharacter()
    loadCatalogs()
  }, [characterId])

  async function loadCharacter() {
    try {
      const [charRes, discRes, bgRes, meritRes, flawRes, invRes, pathRes, ritRes, xpRes, comboRes] = await Promise.all([
        getCharacter(characterId),
        getDisciplines(characterId),
        getBackgrounds(characterId),
        getMerits(characterId),
        getFlaws(characterId),
        getInventory(characterId),
        getSorceryPaths(characterId),
        getRituals(characterId),
        getXpLog(characterId),
        getComboDisciplines(characterId),
      ])
      setFields(prev => ({ ...INITIAL, ...charRes.data }))
      setDisciplines(discRes.data)
      setBackgrounds(bgRes.data)
      setMerits(meritRes.data)
      setFlaws(flawRes.data)
      setInventory(invRes.data)
      setSorceryPaths(pathRes.data)
      setRituals(ritRes.data)
      setXpLog(xpRes.data)
      setComboDisciplines(comboRes.data)
    } catch {
      setSaveError(t('failedToLoad'))
    } finally {
      setLoading(false)
    }
  }

  async function loadCatalogs() {
    try {
      const [mRes, fRes] = await Promise.all([getMeritCatalog(), getFlawCatalog()])
      setMeritCatalog(mRes.data)
      setFlawCatalog(fRes.data)
    } catch {
      setActionError(t('failedToLoad'))
    }
  }

  function handleField(name, value) {
    setFields(prev => {
      const next = { ...prev, [name]: value }
      const isHum = next.pathName.trim().toLowerCase() === 'humanity'
      // Auto-sync Humanity path rating
      if ((name === 'conscience' || name === 'selfControl') && isHum) {
        next.pathRating = next.conscience + next.selfControl
      }
      if (name === 'pathName' && value.trim().toLowerCase() === 'humanity') {
        next.pathRating = next.conscience + next.selfControl
      }
      // Auto-sync Willpower = Courage during guided creation
      if (guidedMode && name === 'courage') {
        next.willpower = value
        next.currentWillpower = value
      }
      return next
    })
  }

  function handleText(e) {
    const { name, value, type } = e.target
    handleField(name, type === 'number' ? (parseInt(value) || 0) : value)
  }

  async function handleSave() {
    if (validationErrors.length > 0) {
      setSaveError(validationErrors.join(' '))
      return
    }
    setSaving(true)
    setSaveError(null)
    try {
      await updateCharacter(characterId, fields)
      onBack()
    } catch {
      setSaveError(t('failedToSave'))
    } finally {
      setSaving(false)
    }
  }

  async function handleDoneEditing() {
    setSaving(true)
    setSaveError(null)
    try {
      await updateCharacter(characterId, fields)
      __navigate('/characters')
    } catch (err) {
      setSaveError(err.response?.data?.message || t('failedToSave'))
    } finally { setSaving(false) }
  }

  // Discipline handlers
  async function handleAddDiscipline() {
    if (!newDiscipline.name.trim()) return
    try {
      const res = await addDiscipline(characterId, newDiscipline)
      setDisciplines(prev => [...prev, res.data])
      setNewDiscipline({ name: '', level: 1 })
    } catch { setActionError(t('failedToSave')) }
  }

  async function handleRemoveDiscipline(id) {
    try {
      await removeDiscipline(characterId, id)
      setDisciplines(prev => prev.filter(d => d.id !== id))
    } catch { setActionError(t('failedToSave')) }
  }

  async function handleAddCombo() {
    if (!newCombo.name.trim()) return
    try {
      const data = { ...newCombo, xpCost: newCombo.xpCost ? parseInt(newCombo.xpCost) : null }
      const res = await addComboDiscipline(characterId, data)
      setComboDisciplines(prev => [...prev, res.data])
      setNewCombo({ name: '', prerequisites: '', description: '', xpCost: '' })
    } catch { setActionError(t('failedToSave')) }
  }

  async function handleRemoveCombo(comboId) {
    try {
      await removeComboDiscipline(characterId, comboId)
      setComboDisciplines(prev => prev.filter(c => c.id !== comboId))
    } catch { setActionError(t('failedToSave')) }
  }

  // Background handlers
  async function handleAddBackground() {
    if (!newBackground.name.trim()) return
    try {
      const res = await addBackground(characterId, newBackground)
      setBackgrounds(prev => [...prev, res.data])
      setNewBackground({ name: '', level: 1, description: '' })
    } catch { setActionError(t('failedToSave')) }
  }

  async function handleRemoveBackground(id) {
    try {
      await removeBackground(characterId, id)
      setBackgrounds(prev => prev.filter(b => b.id !== id))
    } catch { setActionError(t('failedToSave')) }
  }

  // Merit / Flaw handlers
  async function handleAddMerit(merit) {
    try {
      const res = await addMerit(characterId, { meritId: merit.id, pointsSpent: merit.cost })
      setMerits(prev => [...prev, res.data])
    } catch { setActionError(t('failedToSave')) }
  }

  async function handleRemoveMerit(id) {
    try {
      await removeMerit(characterId, id)
      setMerits(prev => prev.filter(m => m.id !== id))
    } catch { setActionError(t('failedToSave')) }
  }

  async function handleAddFlaw(flaw) {
    try {
      const res = await addFlaw(characterId, { flawId: flaw.id, pointsGained: flaw.bonus })
      setFlaws(prev => [...prev, res.data])
    } catch { setActionError(t('failedToSave')) }
  }

  async function handleRemoveFlaw(id) {
    try {
      await removeFlaw(characterId, id)
      setFlaws(prev => prev.filter(f => f.id !== id))
    } catch { setActionError(t('failedToSave')) }
  }

  // Inventory handlers
  async function handleAddItem() {
    if (!newItem.name.trim()) return
    try {
      const res = await addInventoryItem(characterId, newItem)
      setInventory(prev => [...prev, res.data])
      setNewItem({ name: '', category: 'EQUIPMENT', quantity: 1, damage: '', concealment: '', range: '', rate: '', clip: '', armorRating: null, handling: null, structure: null, notes: '' })
    } catch { setActionError(t('failedToSave')) }
  }

  async function handleRemoveItem(id) {
    try {
      await removeInventoryItem(characterId, id)
      setInventory(prev => prev.filter(i => i.id !== id))
    } catch { setActionError(t('failedToSave')) }
  }

  // Sorcery handlers
  async function handleAddPath() {
    if (!newPath.name.trim()) return
    try {
      const res = await addSorceryPath(characterId, newPath)
      setSorceryPaths(prev => [...prev, res.data])
      setNewPath({ name: '', level: 1 })
    } catch { setActionError(t('failedToSave')) }
  }

  async function handleRemovePath(id) {
    try {
      await removeSorceryPath(characterId, id)
      setSorceryPaths(prev => prev.filter(p => p.id !== id))
      if (sorcInfo?.id === id) setSorcInfo(null)
    } catch { setActionError(t('failedToSave')) }
  }

  async function handleAddRitual() {
    if (!newRitual.name.trim()) return
    try {
      const res = await addRitual(characterId, newRitual)
      setRituals(prev => [...prev, res.data])
      setNewRitual({ name: '', level: 1, notes: '' })
    } catch { setActionError(t('failedToSave')) }
  }

  async function handleRemoveRitual(id) {
    try {
      await removeRitual(characterId, id)
      setRituals(prev => prev.filter(r => r.id !== id))
      if (sorcInfo?.id === id) setSorcInfo(null)
    } catch { setActionError(t('failedToSave')) }
  }


  const filteredMerits = meritCatalog.filter(m => m.name.toLowerCase().includes(meritSearch.toLowerCase()))
  const filteredFlaws  = flawCatalog.filter(f => f.name.toLowerCase().includes(flawSearch.toLowerCase()))

  if (loading || isAutoCreating) return <p className="status-loading" aria-live="polite">{t('loading')}</p>

  // ── Render helpers ─────────────────────────────────────────────────────────

  // RatingRow and CustomAbilityRow are defined outside the component to prevent focus loss

  function TagList({ items, getLabel, getTooltip, onSelect, activeId, onRemove, ariaLabel }) {
    if (!items.length) return null
    return (
      <ul className="tag-list" aria-label={ariaLabel}>
        {items.map(item => (
          <li
            key={item.id}
            className={`tag${onSelect ? ' tag--clickable' : ''}${item.id === activeId ? ' tag--active' : ''}`}
            title={getTooltip?.(item)}
            onClick={() => onSelect?.(item)}
          >
            {getLabel(item)}
            <button
              className="tag-remove"
              onClick={e => { e.stopPropagation(); onRemove(item.id) }}
              aria-label={`Remove ${getLabel(item)}`}
            >×</button>
          </li>
        ))}
      </ul>
    )
  }

  // ── JSX ───────────────────────────────────────────────────────────────────

  return (
    <section aria-labelledby="form-heading" className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={onBack}>← {t('back')}</button>
        <h2 id="form-heading">{fields.name || t('charName')}</h2>
        {guidedMode && <span className="splat-badge">{t('guidedCreation')}</span>}
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}
      {actionError && <p className="status-error" role="alert">{actionError}</p>}

      {validationWarnings.length > 0 && (
        <ul className="status-warning" role="note">
          {validationWarnings.map(w => <li key={w}>{w}</li>)}
        </ul>
      )}

      <div role="tablist" aria-label="Character sheet sections" className="tab-list">
        {TAB_KEYS.map((key, i) => (
          <button
            key={key} role="tab" id={`tab-${i}`}
            aria-selected={tab === i} aria-controls={`tabpanel-${i}`}
            className={`btn btn-secondary tab-btn${tab === i ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(i)}
          >{t(key)}</button>
        ))}
      </div>

      {/* ── Identity ── */}
      <div role="tabpanel" id="tabpanel-0" aria-labelledby="tab-0" hidden={tab !== 0}>
        <div className="form-section">
          <fieldset>
            <legend>{t('identity')}</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="name">{t('nameTrueName')} <span aria-hidden="true">*</span></label>
                <input id="name" name="name" type="text" value={fields.name} onChange={handleText} required autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="altName">{t('altName')}</label>
                <input id="altName" name="altName" type="text" value={fields.altName} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="concept">{t('concept')}</label>
                <input id="concept" name="concept" type="text" value={fields.concept} onChange={handleText} autoComplete="off" />
              </div>
            </div>
            <div className="field-row">
              <ArchetypeSelect id="nature" name="nature" label={t('nature')} value={fields.nature} onChange={handleField} t={t} />
              <ArchetypeSelect id="demeanor" name="demeanor" label={t('demeanor')} value={fields.demeanor} onChange={handleField} t={t} />
              <div className="field">
                <label htmlFor="domainHaven">{t('domainHaven')}</label>
                <input id="domainHaven" name="domainHaven" type="text" value={fields.domainHaven} onChange={handleText} autoComplete="off" />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="visibleAge">{t('visibleAge')}</label>
                <input id="visibleAge" name="visibleAge" type="text" value={fields.visibleAge} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="totalAge">{t('totalAge')}</label>
                <input id="totalAge" name="totalAge" type="text" value={fields.totalAge} onChange={handleText} autoComplete="off" />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('kindred')}</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="clan">{t('clan')} <span aria-hidden="true">*</span></label>
                <select id="clan" name="clan" value={fields.clan} onChange={e => {
                  const val = e.target.value
                  handleField('clan', val)
                  const entry = CLANS.find(c => c.value === val)
                  if (entry) handleField('clanCurse', entry.curse)
                  if (val === 'Nosferatu' || val === 'Samedi') handleField('appearance', 0)
                }}>
                  <option value="">{t('select')}</option>
                  {CLANS.map(c => <option key={c.value} value={c.value}>{c.value}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="sect">{t('sect')}</label>
                <select id="sect" name="sect" value={fields.sect} onChange={handleText}>
                  <option value="">{t('select')}</option>
                  <option value="Camarilla">Camarilla</option>
                  <option value="Sabbat">Sabbat</option>
                  <option value="Anarch">Anarch</option>
                  <option value="Independent">Independent</option>
                  <option value="Autarkis">Autarkis</option>
                  <option value="Tal'Mahe'Ra">Tal'Mahe'Ra</option>
                  <option value="Inconnu">Inconnu</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="generation">{t('generation')}</label>
                <select id="generation" name="generation" value={fields.generation} onChange={e => handleField('generation', parseInt(e.target.value))}>
                  {Array.from({ length: 12 }, (_, i) => 15 - i).map(g => {
                    const { max, perTurn } = bloodStats(g)
                    return <option key={g} value={g}>{ordinal(g)} (max {max} BP, {perTurn}/turn)</option>
                  })}
                </select>
              </div>
              <div className="field">
                <label htmlFor="npc">{t('type')}</label>
                <div className="role-toggle" role="radiogroup" aria-label={t('type')}>
                  <button type="button" className={`role-toggle-btn${!fields.npc ? ' role-toggle-btn--active' : ''}`}
                    onClick={() => handleField('npc', false)} aria-pressed={!fields.npc}>PC</button>
                  <button type="button" className={`role-toggle-btn${fields.npc ? ' role-toggle-btn--active' : ''}`}
                    onClick={() => handleField('npc', true)} aria-pressed={fields.npc}>{t('npc')}</button>
                </div>
              </div>
            </div>
            {isElder && (
              <p className="role-hint" style={{ marginTop: 'var(--space-sm)' }}>
                {t('elderHint').replace('{0}', elderMax)}
              </p>
            )}
          </fieldset>

          <fieldset>
            <legend>{t('clanCurseDerangements')}</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="derangement1">{t('derangement')}</label>
                <input id="derangement1" name="derangement1" type="text" list="derangement-catalog" value={fields.derangement1} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="derangement2">{t('derangement')}</label>
                <input id="derangement2" name="derangement2" type="text" list="derangement-catalog" value={fields.derangement2} onChange={handleText} autoComplete="off" />
              </div>
            </div>
            <datalist id="derangement-catalog">
              {DERANGEMENTS.map(d => <option key={d.name} value={d.name} />)}
            </datalist>
            <div className="field">
              <label htmlFor="clanCurse">{t('clanCurseNotes')}</label>
              <textarea id="clanCurse" name="clanCurse" value={fields.clanCurse} onChange={handleText} rows={3} />
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('notes')}</legend>
            <div className="field">
              <textarea id="notes" name="notes" value={fields.notes} onChange={handleText} rows={5} placeholder={t('generalNotes')} />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Attributes ── */}
      <div role="tabpanel" id="tabpanel-1" aria-labelledby="tab-1" hidden={tab !== 1}>
        <div className="form-section">
          {[
            { legendKey: 'physicalAttr', group: 'physical', attrs: ['strength', 'dexterity', 'stamina'] },
            { legendKey: 'socialAttr',   group: 'social',   attrs: ['charisma', 'manipulation', 'appearance'] },
            { legendKey: 'mentalAttr',   group: 'mental',   attrs: ['perception', 'intelligence', 'wits'] },
          ].map(({ legendKey, group, attrs }) => {
            const zeroAppearance = fields.clan === 'Nosferatu' || fields.clan === 'Samedi'
            return (
              <fieldset key={legendKey}>
                <legend>{t(legendKey)}</legend>
                {guidedMode && (
                  <>
                    <PrioritySelector group={group} priorities={attrPriority} setPriorities={setAttrPriority} budgets={ATTR_BUDGETS} />
                    <PointsIndicator spent={getAttrSpent(group)} budget={getAttrBudget(group)} />
                  </>
                )}
                <div className="rating-grid">
                  {attrs.map(a => (
                    <div key={a} className="ability-row">
                      <DotRating
                        label={a === 'appearance' && zeroAppearance ? `${t('appearance')} (0)` : t(a)}
                        name={a}
                        value={a === 'appearance' && zeroAppearance ? 0 : fields[a]}
                        onChange={handleField}
                        min={a === 'appearance' && zeroAppearance ? 0 : 1}
                        max={a === 'appearance' && zeroAppearance ? 0 : elderMax}
                      />
                      <input
                        className="spec-input"
                        type="text"
                        name={a + 'Spec'}
                        value={fields[a + 'Spec'] ?? ''}
                        onChange={handleText}
                        placeholder={t('specialty')}
                        aria-label={`${t(a)} ${t('specialty')}`}
                      />
                    </div>
                  ))}
                </div>
              </fieldset>
            )
          })}
        </div>
      </div>

      {/* ── Abilities ── */}
      <div role="tabpanel" id="tabpanel-2" aria-labelledby="tab-2" hidden={tab !== 2}>
        <div className="form-section">
          <fieldset>
            <legend>{t('talents')}</legend>
            {guidedMode && (
              <>
                <PrioritySelector group="talents" priorities={abilPriority} setPriorities={setAbilPriority} budgets={ABIL_BUDGETS} />
                <PointsIndicator spent={getAbilSpent('talents')} budget={getAbilBudget('talents')} />
                <p className="muted-hint" style={{ fontSize: '0.72rem' }}>{t('maxPerAbility')}</p>
              </>
            )}
            <div className="rating-grid">
              {['alertness', 'athletics', 'awareness', 'brawl', 'empathy', 'expression', 'intimidation', 'leadership', 'streetwise', 'subterfuge'].map(a =>
                <RatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} max={elderMax} t={t} />
              )}
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('skills')}</legend>
            {guidedMode && (
              <>
                <PrioritySelector group="skills" priorities={abilPriority} setPriorities={setAbilPriority} budgets={ABIL_BUDGETS} />
                <PointsIndicator spent={getAbilSpent('skills')} budget={getAbilBudget('skills')} />
                <p className="muted-hint" style={{ fontSize: '0.72rem' }}>{t('maxPerAbility')}</p>
              </>
            )}
            <div className="rating-grid">
              {['animalKen', 'crafts', 'drive', 'etiquette', 'firearms', 'larceny', 'melee', 'performance', 'stealth', 'survival'].map(a =>
                <RatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} max={elderMax} t={t} />
              )}
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('knowledges')}</legend>
            {guidedMode && (
              <>
                <PrioritySelector group="knowledges" priorities={abilPriority} setPriorities={setAbilPriority} budgets={ABIL_BUDGETS} />
                <PointsIndicator spent={getAbilSpent('knowledges')} budget={getAbilBudget('knowledges')} />
                <p className="muted-hint" style={{ fontSize: '0.72rem' }}>{t('maxPerAbility')}</p>
              </>
            )}
            <div className="rating-grid">
              {['academics', 'computer', 'finance', 'investigation', 'law', 'linguistics', 'medicine', 'occult', 'politics', 'science', 'technology'].map(a =>
                <RatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} max={elderMax} t={t} />
              )}
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Secondary Abilities ── */}
      <div role="tabpanel" id="tabpanel-3" aria-labelledby="tab-3" hidden={tab !== 3}>
        <div className="form-section">
          <div className="abilities-group">
            <fieldset>
              <legend>{t('secondaryTalents')}</legend>
              {Array.from({length: 10}, (_, i) => i + 1).map(n =>
                <CustomAbilityRow key={n} nameProp={`hobbyTalent${n}Name`} ratingProp={`hobbyTalent${n}`} placeholder={t('phHobbyTalent')} fields={fields} onField={handleField} onText={handleText} catalog={SECONDARY_TALENTS} max={elderMax} />
              )}
            </fieldset>
            <fieldset>
              <legend>{t('secondarySkills')}</legend>
              {Array.from({length: 10}, (_, i) => i + 1).map(n =>
                <CustomAbilityRow key={n} nameProp={`profSkill${n}Name`} ratingProp={`profSkill${n}`} placeholder={t('phProfSkill')} fields={fields} onField={handleField} onText={handleText} catalog={SECONDARY_SKILLS} max={elderMax} />
              )}
            </fieldset>
            <fieldset>
              <legend>{t('secondaryKnowledges')}</legend>
              {Array.from({length: 10}, (_, i) => i + 1).map(n =>
                <CustomAbilityRow key={n} nameProp={`expertKnowl${n}Name`} ratingProp={`expertKnowl${n}`} placeholder={t('phExpertKnowl')} fields={fields} onField={handleField} onText={handleText} catalog={SECONDARY_KNOWLEDGES} max={elderMax} />
              )}
            </fieldset>
          </div>
        </div>
      </div>

      {/* ── Advantages ── */}
      <div role="tabpanel" id="tabpanel-4" aria-labelledby="tab-4" hidden={tab !== 4}>
        <div className="form-section">

          <fieldset>
            <legend>{t('virtues')}</legend>
            <div className="rating-grid">
              <DotRating label={isHumanity ? t('conscience') : t('conviction')}  name="conscience"   value={fields.conscience}   onChange={handleField} min={1} />
              <DotRating label={isHumanity ? t('selfControl') : t('instinct')} name="selfControl"  value={fields.selfControl}  onChange={handleField} min={1} />
              <DotRating label={t('courage')}     name="courage"      value={fields.courage}      onChange={handleField} min={1} />
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('pathOfEnlightenment')}</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="pathName">{t('pathName')}</label>
                <select id="pathName" name="pathName" value={fields.pathName} onChange={handleText}>
                  <option value="Humanity">Humanity</option>
                  <option value="Path of Blood">Path of Blood</option>
                  <option value="Path of Bones">Path of Bones</option>
                  <option value="Path of Caine">Path of Caine</option>
                  <option value="Path of Cathari">Path of Cathari</option>
                  <option value="Path of Death and the Soul">Path of Death and the Soul</option>
                  <option value="Path of Feral Hearts">Path of Feral Hearts</option>
                  <option value="Path of Harmony">Path of Harmony</option>
                  <option value="Path of Honorable Accord">Path of Honorable Accord</option>
                  <option value="Path of Lilith">Path of Lilith</option>
                  <option value="Path of Metamorphosis">Path of Metamorphosis</option>
                  <option value="Path of Night">Path of Night</option>
                  <option value="Path of Paradox">Path of Paradox</option>
                  <option value="Path of Power and the Inner Voice">Path of Power and the Inner Voice</option>
                  <option value="Path of Typhon-Set">Path of Typhon-Set</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="pathRating">
                  {t('rating')} {isHumanity && <span className="muted">({t('conscience')} + {t('selfControl')} = {computedPath})</span>}
                </label>
                {isHumanity
                  ? <input id="pathRating" type="number" value={computedPath} readOnly className="readonly-input" />
                  : <DotRating label="" name="pathRating" value={fields.pathRating} onChange={handleField} min={0} max={10} />
                }
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('willpower')}</legend>
            <div className="field-row">
              <DotRating label={t('willpower')}        name="willpower"        value={fields.willpower}        onChange={handleField} min={1} max={10} />
              <DotRating label={t('currentWillpower')} name="currentWillpower" value={fields.currentWillpower} onChange={handleField} min={0} max={fields.willpower} />
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('bloodPool')} — {ordinal(fields.generation)} Gen (max {maxBlood}, {perTurn}/turn)</legend>
            <DotRating label={t('currentBlood')} name="currentBlood" value={fields.currentBlood} onChange={handleField} min={0} max={maxBlood} />
          </fieldset>

          <fieldset>
            <legend>{t('health')}</legend>
            <div className="field">
              <label htmlFor="woundLevel">{t('woundLevel')}</label>
              <select
                id="woundLevel"
                value={fields.woundLevel}
                onChange={e => handleField('woundLevel', parseInt(e.target.value))}
              >
                {HEALTH_LEVELS.map((h, i) => (
                  <option key={i} value={i}>
                    {t(h.key)}{h.penaltyKey ? ` ${t(h.penaltyKey)}` : h.penalty ? ` ${h.penalty}` : ''}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>

        </div>
      </div>

      {/* ── Health ── */}
      <div role="tabpanel" id="tabpanel-5" aria-labelledby="tab-5" hidden={tab !== 5}>
        <div className="form-section">
          <fieldset>
            <legend>{t('healthTrack')}</legend>
            <p className="muted-hint" style={{ marginBottom: 'var(--space-md)', fontSize: '0.75rem' }}>{t('healthHint')}</p>
            <table style={{ width: '100%', maxWidth: 500, fontSize: '0.85rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>{t('health')}</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center' }}>{t('penalty')}</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center' }}>{t('damageType')}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { key: 'healthBruised',    label: 'bruised',       penalty: '' },
                  { key: 'healthHurt',       label: 'hurt',          penalty: '-1' },
                  { key: 'healthInjured',    label: 'injured',       penalty: '-1' },
                  { key: 'healthWounded',    label: 'wounded',       penalty: '-2' },
                  { key: 'healthMauled',     label: 'mauled',        penalty: '-2' },
                  { key: 'healthCrippled',   label: 'crippled',      penalty: '-5' },
                  { key: 'healthIncap',      label: 'incapacitated', penalty: '' },
                ].map(h => {
                  const val = fields[h.key] || ''
                  const dmgLabel = val === 'A' ? t('aggDmg') : val === 'L' ? t('lethalDmg') : val === 'B' ? t('bashingDmg') : t('undamaged')
                  const dmgColor = val === 'A' ? '#e55' : val === 'L' ? '#e95' : val === 'B' ? '#8cf' : 'var(--color-text-muted)'
                  return (
                    <tr key={h.key} style={{ borderBottom: '1px solid var(--color-border)', cursor: 'pointer' }}
                      onClick={() => {
                        const cycle = { '': 'B', B: 'L', L: 'A', A: '' }
                        handleField(h.key, cycle[val] || '')
                      }}>
                      <td style={{ padding: '0.5rem', fontWeight: val ? 700 : 400 }}>{t(h.label)}</td>
                      <td style={{ padding: '0.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>{h.penalty || '—'}</td>
                      <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 600, color: dmgColor }}>{dmgLabel}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </fieldset>
        </div>
      </div>

      {/* ── Disciplines & Backgrounds ── */}
      <div role="tabpanel" id="tabpanel-6" aria-labelledby="tab-6" hidden={tab !== 6}>
        <div className="disc-bg-layout">
        <div className="form-section">
              <fieldset>
                <legend>{t('disciplines')}</legend>
                <TagList
                  items={disciplines}
                  getLabel={d => `${d.name} ${d.level}`}
                  getTooltip={d => getLevelHint(DISCIPLINES, d.name, d.level)}
                  onSelect={d => setTagInfo(ti => ti?.id === d.id ? null : { ...d, catalog: DISCIPLINES })}
                  activeId={tagInfo?.id}
                  onRemove={id => { handleRemoveDiscipline(id); if (tagInfo?.id === id) setTagInfo(null) }}
                  ariaLabel="Current disciplines"
                />
                <div className="field-row">
                  <SearchableInput
                    id="disc-name"
                    label={t('disciplineName')}
                    catalog={DISCIPLINES}
                    value={newDiscipline.name}
                    onChange={val => setNewDiscipline(p => ({ ...p, name: val }))}
                    placeholder={t('phDiscipline')}
                  />
                  <div className="field">
                    <label htmlFor="disc-level">{t('level')}</label>
                    <select id="disc-level" value={newDiscipline.level}
                      onChange={e => setNewDiscipline(p => ({ ...p, level: parseInt(e.target.value) }))}>
                      {Array.from({ length: elderMax }, (_, i) => i + 1).map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <button className="btn btn-secondary" onClick={handleAddDiscipline}>{t('add')}</button>
                </div>
                {getLevelHint(DISCIPLINES, newDiscipline.name, newDiscipline.level) && (
                  <p className="archetype-desc">{getLevelHint(DISCIPLINES, newDiscipline.name, newDiscipline.level)}</p>
                )}
              </fieldset>
              {isElder && (
                <fieldset>
                  <legend>{t('elderPowers')}</legend>
                  <p className="muted-hint" style={{ marginBottom: 'var(--space-sm)', fontSize: '0.78rem' }}>
                    {t('elderPowersHint')}
                  </p>
                  {(() => {
                    const filterDisc = newDiscipline.name.trim()
                    const filtered = filterDisc
                      ? ELDER_POWERS.filter(p => p.discipline.toLowerCase().includes(filterDisc.toLowerCase()))
                      : ELDER_POWERS
                    const byLevel = [6, 7, 8, 9].map(lv => ({
                      level: lv,
                      powers: filtered.filter(p => p.level === lv),
                    })).filter(g => g.powers.length > 0)
                    return (
                      <>
                        <div className="field" style={{ marginBottom: 'var(--space-sm)' }}>
                          <label htmlFor="elder-filter">{t('filterByDiscipline')}</label>
                          <input id="elder-filter" list="elder-disc-filter" type="text"
                            value={newDiscipline.name}
                            onChange={e => setNewDiscipline(p => ({ ...p, name: e.target.value }))}
                            placeholder={t('allDisciplines')}
                            autoComplete="off" />
                          <datalist id="elder-disc-filter">
                            {[...new Set(ELDER_POWERS.map(p => p.discipline))].sort().map(d => (
                              <option key={d} value={d} />
                            ))}
                          </datalist>
                        </div>
                        {/* Show base levels 1-5 when filtering a specific discipline */}
                        {filterDisc && (() => {
                          const baseEntry = DISCIPLINES.find(d => d.value.toLowerCase() === filterDisc.toLowerCase())
                          if (!baseEntry?.levels) return null
                          return (
                            <div style={{ marginBottom: 'var(--space-md)', padding: 'var(--space-sm)', background: 'var(--color-bg)', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)' }}>
                              <strong style={{ fontSize: '0.82rem' }}>{baseEntry.value} — Levels 1–5</strong>
                              <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--space-xs) 0' }}>
                                {baseEntry.levels.map((lvl, i) => (
                                  <li key={i} style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '2px' }}>{lvl}</li>
                                ))}
                              </ul>
                            </div>
                          )
                        })()}
                        {byLevel.map(({ level, powers }) => (
                          <div key={level} style={{ marginBottom: 'var(--space-sm)' }}>
                            <strong style={{ fontSize: '0.82rem' }}>Level {level}</strong>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--space-xs) 0' }}>
                              {powers.map(p => (
                                <li key={p.name} style={{ marginBottom: 'var(--space-xs)', fontSize: '0.78rem' }}>
                                  <strong>{p.name}</strong> <span style={{ color: 'var(--color-text-muted)' }}>({p.discipline})</span>
                                  <br /><span style={{ color: 'var(--color-text-muted)' }}>{p.description}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        {filtered.length === 0 && <p className="muted-hint">{t('noElderPowers')}</p>}
                      </>
                    )
                  })()}
                </fieldset>
              )}
        </div>

        {tagInfo && (() => {
          const entry = tagInfo.catalog.find(c => c.value.toLowerCase() === tagInfo.name.toLowerCase())
          return (
            <aside className="tag-info-panel">
              <button className="tag-info-panel-close" onClick={() => setTagInfo(null)}>{t('close')}</button>
              <p className="tag-info-panel-name">{tagInfo.name}</p>
              {entry?.description && <p className="tag-info-panel-desc">{entry.description}</p>}
              {entry?.levels && (
                <ul className="tag-info-levels">
                  {entry.levels.map((lvl, i) => (
                    <li key={i} className={`tag-info-level${i + 1 === tagInfo.level ? ' tag-info-level--active' : ''}`}>
                      {lvl}
                    </li>
                  ))}
                </ul>
              )}
            </aside>
          )
        })()}
        </div>
            <hr className="divider" />
            <fieldset>
              <legend>{t('comboDisciplines')} ({comboDisciplines.length})</legend>
              {comboDisciplines.length === 0 && <p className="muted-hint">{t('noCombosYet')}</p>}
              {comboDisciplines.map(c => (
                <div key={c.id} className="character-card" style={{ marginBottom: 'var(--space-sm)' }}>
                  <div className="character-card-info">
                    <h3 style={{ fontSize: '0.9rem' }}>{c.name}</h3>
                    {c.prerequisites && <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{t('comboPrereqs')}: {c.prerequisites}</p>}
                    {c.description && <p style={{ fontSize: '0.78rem' }}>{c.description}</p>}
                    {c.xpCost && <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{t('comboXpCost')}: {c.xpCost}</p>}
                  </div>
                  <div className="character-card-actions">
                    <button className="btn btn-danger btn-sm" onClick={() => handleRemoveCombo(c.id)}>✕</button>
                  </div>
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                <div className="field">
                  <label>{t('comboName')}</label>
                  <input type="text" list="combo-catalog" value={newCombo.name} onChange={e => {
                    const val = e.target.value
                    const hit = COMBO_DISCIPLINES.find(c => c.name === val)
                    if (hit) {
                      setNewCombo({ name: hit.name, prerequisites: hit.prerequisites, description: hit.description, xpCost: String(hit.xpCost) })
                    } else {
                      setNewCombo(p => ({ ...p, name: val }))
                    }
                  }} placeholder={t('phComboName')} />
                  <datalist id="combo-catalog">
                    {COMBO_DISCIPLINES.map(c => <option key={c.name} value={c.name} />)}
                  </datalist>
                </div>
                <div className="field">
                  <label>{t('comboPrereqs')}</label>
                  <input type="text" value={newCombo.prerequisites} onChange={e => setNewCombo(p => ({ ...p, prerequisites: e.target.value }))} placeholder={t('phComboPrereqs')} />
                </div>
                <div className="field" style={{ gridColumn: '1 / -1' }}>
                  <label>{t('comboDesc')}</label>
                  <textarea value={newCombo.description} onChange={e => setNewCombo(p => ({ ...p, description: e.target.value }))} rows={3} placeholder={t('phComboDesc')} style={{ width: '100%' }} />
                </div>
                <div className="field" style={{ maxWidth: 120 }}>
                  <label>{t('comboXpCost')}</label>
                  <input type="number" min="0" value={newCombo.xpCost} onChange={e => setNewCombo(p => ({ ...p, xpCost: e.target.value }))} />
                </div>
                <button className="btn btn-secondary" style={{ alignSelf: 'flex-end' }} onClick={handleAddCombo}>{t('add')}</button>
              </div>
            </fieldset>
      </div>

      {/* ── Backgrounds ── */}
      <div role="tabpanel" id="tabpanel-7" aria-labelledby="tab-7" hidden={tab !== 7}>
        <div className="disc-bg-layout">
        <div className="form-section">
              <fieldset>
                <legend>{t('backgrounds')}</legend>
                <TagList
                  items={backgrounds}
                  getLabel={b => `${b.name} ${b.level}`}
                  getTooltip={b => getLevelHint(BACKGROUNDS, b.name, b.level)}
                  onSelect={b => setTagInfo(ti => ti?.id === b.id ? null : { ...b, catalog: BACKGROUNDS })}
                  activeId={tagInfo?.id}
                  onRemove={id => { handleRemoveBackground(id); if (tagInfo?.id === id) setTagInfo(null) }}
                  ariaLabel="Current backgrounds"
                />
                <div className="field-row">
                  <SearchableInput
                    id="bg-name"
                    label={t('backgroundName')}
                    catalog={BACKGROUNDS}
                    value={newBackground.name}
                    onChange={val => setNewBackground(p => ({ ...p, name: val }))}
                    placeholder={t('phBackground')}
                  />
                  <div className="field">
                    <label htmlFor="bg-level">{t('level')}</label>
                    <select id="bg-level" value={newBackground.level}
                      onChange={e => setNewBackground(p => ({ ...p, level: parseInt(e.target.value) }))}>
                      {Array.from({ length: elderMax }, (_, i) => i + 1).map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="bg-desc">{t('description')}</label>
                    <input id="bg-desc" type="text" value={newBackground.description}
                      onChange={e => setNewBackground(p => ({ ...p, description: e.target.value }))} autoComplete="off" />
                  </div>
                  <button className="btn btn-secondary" onClick={handleAddBackground}>{t('add')}</button>
                </div>
                {getLevelHint(BACKGROUNDS, newBackground.name, newBackground.level) && (
                  <p className="archetype-desc">{getLevelHint(BACKGROUNDS, newBackground.name, newBackground.level)}</p>
                )}
              </fieldset>
        </div>

        {tagInfo && (() => {
          const entry = tagInfo.catalog.find(c => c.value.toLowerCase() === tagInfo.name.toLowerCase())
          return (
            <aside className="tag-info-panel">
              <button className="tag-info-panel-close" onClick={() => setTagInfo(null)}>{t('close')}</button>
              <p className="tag-info-panel-name">{tagInfo.name}</p>
              {entry?.description && <p className="tag-info-panel-desc">{entry.description}</p>}
              {entry?.levels && (
                <ul className="tag-info-levels">
                  {entry.levels.map((lvl, i) => (
                    <li key={i} className={`tag-info-level${i + 1 === tagInfo.level ? ' tag-info-level--active' : ''}`}>
                      {lvl}
                    </li>
                  ))}
                </ul>
              )}
            </aside>
          )
        })()}
        </div>
      </div>

      {/* ── Merits & Flaws ── */}
      <div role="tabpanel" id="tabpanel-8" aria-labelledby="tab-8" hidden={tab !== 8}>
        <div className="disc-bg-layout">
          <div className="form-section">
                <fieldset>
                  <legend>{t('merits')}</legend>
                  <TagList
                    items={merits}
                    getLabel={m => `${m.merit.name} (${m.pointsSpent}pt)`}
                    onSelect={m => setMfInfo(i => i?.id === m.id ? null : { ...m, kind: 'merit' })}
                    activeId={mfInfo?.id}
                    onRemove={id => { handleRemoveMerit(id); if (mfInfo?.id === id) setMfInfo(null) }}
                    ariaLabel="Selected merits"
                  />
                  <div className="catalog-search-wrap">
                    <input id="merit-search" type="search" value={meritSearch}
                      onChange={e => setMeritSearch(e.target.value)}
                      placeholder={t('searchMeritsLabel')}
                      aria-label={t('searchMeritsLabel')} />
                    <span className="catalog-search-count">
                      {filteredMerits.length > 30
                        ? `30 / ${filteredMerits.length}`
                        : filteredMerits.length}
                    </span>
                  </div>
                  <CatalogList
                    items={filteredMerits.slice(0, 30)}
                    getCost={m => m.cost}
                    selectedIds={new Set(merits.map(m => m.merit.id))}
                    onAdd={handleAddMerit}
                    onPreview={m => setMfInfo({ id: -1, kind: 'merit', merit: m, pointsSpent: m.cost })}
                    ariaLabel="Merit catalog"
                  />
                </fieldset>

                <hr className="divider" />

                <fieldset>
                  <legend>{t('flaws')}</legend>
                  <TagList
                    items={flaws}
                    getLabel={f => `${f.flaw.name} (${f.pointsGained}pt)`}
                    onSelect={f => setMfInfo(i => i?.id === f.id ? null : { ...f, kind: 'flaw' })}
                    activeId={mfInfo?.id}
                    onRemove={id => { handleRemoveFlaw(id); if (mfInfo?.id === id) setMfInfo(null) }}
                    ariaLabel="Selected flaws"
                  />
                  <div className="catalog-search-wrap">
                    <input id="flaw-search" type="search" value={flawSearch}
                      onChange={e => setFlawSearch(e.target.value)}
                      placeholder={t('searchFlawsLabel')}
                      aria-label={t('searchFlawsLabel')} />
                    <span className="catalog-search-count">
                      {filteredFlaws.length > 30
                        ? `30 / ${filteredFlaws.length}`
                        : filteredFlaws.length}
                    </span>
                  </div>
                  <CatalogList
                    items={filteredFlaws.slice(0, 30)}
                    getCost={f => f.bonus}
                    selectedIds={new Set(flaws.map(f => f.flaw.id))}
                    onAdd={handleAddFlaw}
                    onPreview={f => setMfInfo({ id: -1, kind: 'flaw', flaw: f, pointsGained: f.bonus })}
                    ariaLabel="Flaw catalog"
                  />
                </fieldset>
          </div>

          {mfInfo && (() => {
            const entry  = mfInfo.kind === 'merit' ? mfInfo.merit : mfInfo.flaw
            const points = mfInfo.kind === 'merit' ? `${mfInfo.pointsSpent}pt` : `${mfInfo.pointsGained}pt`
            return (
              <aside className="tag-info-panel">
                <button className="tag-info-panel-close" onClick={() => setMfInfo(null)}>{t('close')}</button>
                <p className="tag-info-panel-name">{entry.name}</p>
                <p className="tag-info-panel-desc">
                  {mfInfo.kind === 'merit' ? t('merit') : t('flaw')} · {points}
                  {entry.costObs ? ` (${entry.costObs})` : ''}
                  {entry.source ? ` · ${entry.source}${entry.page ? ` p.${entry.page}` : ''}` : ''}
                </p>
                {entry.description && (
                  <p style={{ fontSize: '0.82rem', lineHeight: 1.55, color: 'var(--color-text)' }}>
                    {entry.description}
                  </p>
                )}
              </aside>
            )
          })()}
        </div>
      </div>

      {/* ── Inventory ── */}
      <div role="tabpanel" id="tabpanel-9" aria-labelledby="tab-9" hidden={tab !== 9}>
        <div className="form-section">
              {/* Add new item form */}
              <fieldset>
                <legend>{t('addItem')}</legend>
                <div className="field-row">
                  <SearchableInput
                    id="inv-name"
                    label={t('name')}
                    catalog={ITEM_CATALOG}
                    value={newItem.name}
                    placeholder={t('phInvName')}
                    onChange={val => {
                      const hit = ITEM_CATALOG.find(c => c.value.toLowerCase() === val.toLowerCase())
                      if (hit) {
                        setNewItem(p => ({
                          ...p,
                          name: hit.value,
                          category: hit.category ?? p.category,
                          damage: hit.damage ?? '',
                          range: hit.range ?? '',
                          rate: hit.rate ?? '',
                          clip: hit.clip ?? '',
                          concealment: hit.concealment ?? '',
                          armorRating: hit.armorRating ?? null,
                          handling: hit.handling ?? null,
                          structure: hit.structure ?? null,
                        }))
                      } else {
                        setNewItem(p => ({ ...p, name: val }))
                      }
                    }}
                  />
                  <div className="field">
                    <label htmlFor="inv-cat">{t('category')}</label>
                    <select id="inv-cat" value={newItem.category}
                      onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}>
                      {INVENTORY_CATEGORIES.map(c => <option key={c} value={c}>{t(c.toLowerCase())}</option>)}
                    </select>
                  </div>
                  <div className="field" style={{ width: '70px' }}>
                    <label htmlFor="inv-qty">{t('qty')}</label>
                    <input id="inv-qty" type="number" min={1} value={newItem.quantity}
                      onChange={e => setNewItem(p => ({ ...p, quantity: parseInt(e.target.value) || 1 }))} />
                  </div>
                </div>
                {(newItem.category === 'WEAPON') && (
                  <div className="field-row">
                    <div className="field">
                      <label htmlFor="inv-dmg">{t('damage')}</label>
                      <input id="inv-dmg" type="text" value={newItem.damage}
                        onChange={e => setNewItem(p => ({ ...p, damage: e.target.value }))}
                        placeholder={t('phDamage')} autoComplete="off" />
                    </div>
                    <div className="field" style={{ width: '80px' }}>
                      <label htmlFor="inv-range">{t('range')}</label>
                      <input id="inv-range" type="text" value={newItem.range}
                        onChange={e => setNewItem(p => ({ ...p, range: e.target.value }))}
                        placeholder={t('phRangeWeapon')} autoComplete="off" />
                    </div>
                    <div className="field" style={{ width: '60px' }}>
                      <label htmlFor="inv-rate">{t('rate')}</label>
                      <input id="inv-rate" type="text" value={newItem.rate}
                        onChange={e => setNewItem(p => ({ ...p, rate: e.target.value }))}
                        placeholder={t('phRateWeapon')} autoComplete="off" />
                    </div>
                    <div className="field" style={{ width: '80px' }}>
                      <label htmlFor="inv-clip">{t('clip')}</label>
                      <input id="inv-clip" type="text" value={newItem.clip}
                        onChange={e => setNewItem(p => ({ ...p, clip: e.target.value }))}
                        placeholder={t('phClipWeapon')} autoComplete="off" />
                    </div>
                    <div className="field" style={{ width: '60px' }}>
                      <label htmlFor="inv-conc">{t('concLabel')}</label>
                      <input id="inv-conc" type="text" value={newItem.concealment}
                        onChange={e => setNewItem(p => ({ ...p, concealment: e.target.value }))}
                        placeholder={t('phConcWeapon')} autoComplete="off" />
                    </div>
                  </div>
                )}
                {(newItem.category === 'ARMOR') && (
                  <div className="field-row">
                    <div className="field" style={{ width: '100px' }}>
                      <label htmlFor="inv-armor">{t('armorRatingLabel')}</label>
                      <input id="inv-armor" type="number" value={newItem.armorRating ?? ''}
                        onChange={e => { const v = parseInt(e.target.value); setNewItem(p => ({ ...p, armorRating: isNaN(v) ? null : v })) }}
                        placeholder={t('phArmorRating')} />
                    </div>
                    <div className="field" style={{ width: '100px' }}>
                      <label htmlFor="inv-penalty">{t('dexPenaltyLabel')}</label>
                      <input id="inv-penalty" type="number" value={newItem.handling ?? ''}
                        onChange={e => { const v = parseInt(e.target.value); setNewItem(p => ({ ...p, handling: isNaN(v) ? null : v })) }}
                        placeholder={t('phDexPenalty')} />
                    </div>
                  </div>
                )}
                {(newItem.category === 'VEHICLE') && (
                  <div className="field-row">
                    <div className="field">
                      <label htmlFor="inv-range-v">{t('topSpeed')}</label>
                      <input id="inv-range-v" type="text" value={newItem.range}
                        onChange={e => setNewItem(p => ({ ...p, range: e.target.value }))}
                        placeholder={t('phTopSpeed')} autoComplete="off" />
                    </div>
                    <div className="field" style={{ width: '80px' }}>
                      <label htmlFor="inv-handling">{t('maneuverLabel')}</label>
                      <input id="inv-handling" type="number" value={newItem.handling ?? ''}
                        onChange={e => { const v = parseInt(e.target.value); setNewItem(p => ({ ...p, handling: isNaN(v) ? null : v })) }}
                        placeholder={t('phManeuver')} />
                    </div>
                    <div className="field" style={{ width: '90px' }}>
                      <label htmlFor="inv-struct">{t('structureLabel')}</label>
                      <input id="inv-struct" type="number" value={newItem.structure ?? ''}
                        onChange={e => { const v = parseInt(e.target.value); setNewItem(p => ({ ...p, structure: isNaN(v) ? null : v })) }}
                        placeholder={t('phStructure')} />
                    </div>
                    <div className="field" style={{ width: '80px' }}>
                      <label htmlFor="inv-armor-v">{t('armor')}</label>
                      <input id="inv-armor-v" type="number" value={newItem.armorRating ?? ''}
                        onChange={e => { const v = parseInt(e.target.value); setNewItem(p => ({ ...p, armorRating: isNaN(v) ? null : v })) }}
                        placeholder={t('phArmorVehicle')} />
                    </div>
                  </div>
                )}
                <div className="field">
                  <label htmlFor="inv-notes">{t('notes')}</label>
                  <input id="inv-notes" type="text" value={newItem.notes}
                    onChange={e => setNewItem(p => ({ ...p, notes: e.target.value }))}
                    placeholder={t('phNotes')} autoComplete="off" />
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ position: 'relative', zIndex: 200 }}
                  onClick={handleAddItem}
                >{t('addToInventory')}</button>
              </fieldset>

              {/* Item list grouped by category */}
              {INVENTORY_CATEGORIES.filter(cat => inventory.some(i => i.category === cat)).map(cat => (
                <fieldset key={cat}>
                  <legend>{t(cat.toLowerCase()) + 's'}</legend>
                  <table className="inv-table">
                    <thead>
                      <tr>
                        <th>{t('name')}</th>
                        <th>{t('qty')}</th>
                        {cat === 'WEAPON' && <><th>{t('damage')}</th><th>{t('range')}</th><th>{t('rate')}</th><th>{t('clip')}</th><th>{t('concLabel')}</th></>}
                        {cat === 'ARMOR' && <><th>{t('rating')}</th><th>{t('dexPenaltyLabel')}</th></>}
                        {cat === 'VEHICLE' && <><th>{t('topSpeed')}</th><th>{t('maneuverLabel')}</th><th>{t('structureLabel')}</th><th>{t('armor')}</th></>}
                        <th>{t('notes')}</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.filter(i => i.category === cat).map(item => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          {cat === 'WEAPON' && <><td>{item.damage || '—'}</td><td>{item.range || '—'}</td><td>{item.rate || '—'}</td><td>{item.clip || '—'}</td><td>{item.concealment || '—'}</td></>}
                          {cat === 'ARMOR' && <><td>{item.armorRating ?? '—'}</td><td>{item.handling ?? '—'}</td></>}
                          {cat === 'VEHICLE' && <><td>{item.range || '—'}</td><td>{item.handling ?? '—'}</td><td>{item.structure ?? '—'}</td><td>{item.armorRating ?? '—'}</td></>}
                          <td className="inv-notes">{item.notes || '—'}</td>
                          <td>
                            <button className="tag-remove" onClick={() => handleRemoveItem(item.id)} aria-label={`Remove ${item.name}`}>×</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </fieldset>
              ))}
              {inventory.length === 0 && <p className="muted-hint">{t('noItemsYet')}</p>}
              <fieldset>
                <legend>{t('personalItemsLabel')}</legend>
                <textarea name="personalItems" value={fields.personalItems} onChange={handleText} rows={6} placeholder={t('personalItemsPh')} style={{ width: '100%' }} />
              </fieldset>
        </div>
      </div>

      {/* ── Blood Sorcery ── */}
      <div role="tabpanel" id="tabpanel-10" aria-labelledby="tab-10" hidden={tab !== 10}>
        <div className="disc-bg-layout">
          <div className="form-section">
                {/* ── Paths ── */}
                <fieldset>
                  <legend>{t('sorceryPaths')}</legend>
                  <TagList
                    items={sorceryPaths}
                    getLabel={p => `${p.name} ${p.level}`}
                    getTooltip={p => getLevelHint(SORCERY_PATHS, p.name, p.level)}
                    onSelect={p => setSorcInfo(i => i?.id === p.id ? null : { ...p, kind: 'path' })}
                    activeId={sorcInfo?.id}
                    onRemove={handleRemovePath}
                    ariaLabel="Known paths"
                  />
                  <div className="field-row">
                    <SearchableInput
                      id="path-name"
                      label={t('pathNameLabel')}
                      catalog={SORCERY_PATHS}
                      value={newPath.name}
                      onChange={val => setNewPath(p => ({ ...p, name: val }))}
                      placeholder={t('phPath')}
                    />
                    <div className="field">
                      <label htmlFor="path-level">{t('level')}</label>
                      <select id="path-level" value={newPath.level}
                        onChange={e => setNewPath(p => ({ ...p, level: parseInt(e.target.value) }))}>
                        {Array.from({ length: elderMax }, (_, i) => i + 1).map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                    <button className="btn btn-secondary" onClick={handleAddPath}>{t('add')}</button>
                  </div>
                  {getLevelHint(SORCERY_PATHS, newPath.name, newPath.level) && (
                    <p className="archetype-desc">{getLevelHint(SORCERY_PATHS, newPath.name, newPath.level)}</p>
                  )}
                </fieldset>

                <hr className="divider" />

                {/* ── Rituals ── */}
                <fieldset>
                  <legend>{t('rituals')}</legend>
                  {[1,2,3,4,5,6,7,8].filter(lvl => rituals.some(r => r.level === lvl)).map(lvl => (
                    <div key={lvl} style={{ marginBottom: 'var(--space-md)' }}>
                      <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xs)', fontWeight: 600 }}>
                        {t('level')} {lvl}
                      </p>
                      <TagList
                        items={rituals.filter(r => r.level === lvl)}
                        getLabel={r => r.name}
                        getTooltip={r => RITUALS.find(c => c.value === r.name)?.description}
                        onSelect={r => setSorcInfo(i => i?.id === r.id ? null : { ...r, kind: 'ritual' })}
                        activeId={sorcInfo?.id}
                        onRemove={handleRemoveRitual}
                        ariaLabel={`Level ${lvl} rituals`}
                      />
                    </div>
                  ))}
                  {rituals.length === 0 && <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>{t('noRitualsYet')}</p>}
                  <div className="field-row">
                    <SearchableInput
                      id="ritual-name"
                      label={t('ritualNameLabel')}
                      catalog={RITUALS}
                      value={newRitual.name}
                      onChange={val => {
                        const match = RITUALS.find(r => r.value === val)
                        setNewRitual(p => ({ ...p, name: val, level: match ? match.level : p.level }))
                      }}
                      placeholder={t('phRitual')}
                    />
                    <div className="field">
                      <label htmlFor="ritual-level">{t('level')}</label>
                      <select id="ritual-level" value={newRitual.level}
                        onChange={e => setNewRitual(p => ({ ...p, level: parseInt(e.target.value) }))}>
                        {Array.from({ length: elderMax }, (_, i) => i + 1).map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                    <button className="btn btn-secondary" onClick={handleAddRitual}>{t('add')}</button>
                  </div>
                  {(() => {
                    const match = RITUALS.find(r => r.value === newRitual.name)
                    return match ? <p className="archetype-desc">{match.description}</p> : null
                  })()}
                </fieldset>
          </div>

          {sorcInfo && (() => {
            if (sorcInfo.kind === 'path') {
              const entry = SORCERY_PATHS.find(p => p.value === sorcInfo.name)
              return (
                <aside className="tag-info-panel">
                  <button className="tag-info-panel-close" onClick={() => setSorcInfo(null)}>{t('close')}</button>
                  <p className="tag-info-panel-name">{sorcInfo.name}</p>
                  {entry?.description && <p className="tag-info-panel-desc">{entry.description}</p>}
                  {entry?.levels && (
                    <ul className="tag-info-levels">
                      {entry.levels.map((lvl, i) => (
                        <li key={i} className={`tag-info-level${i + 1 === sorcInfo.level ? ' tag-info-level--active' : ''}`}>
                          {lvl}
                        </li>
                      ))}
                    </ul>
                  )}
                </aside>
              )
            }
            const entry = RITUALS.find(r => r.value === sorcInfo.name)
            return (
              <aside className="tag-info-panel">
                <button className="tag-info-panel-close" onClick={() => setSorcInfo(null)}>{t('close')}</button>
                <p className="tag-info-panel-name">{sorcInfo.name}</p>
                <p className="tag-info-panel-desc">{t('level')} {sorcInfo.level}</p>
                {entry?.description && (
                  <p style={{ fontSize: '0.82rem', lineHeight: 1.55, color: 'var(--color-text)' }}>
                    {entry.description}
                  </p>
                )}
                {sorcInfo.notes && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic', marginTop: 'var(--space-sm)' }}>
                    {sorcInfo.notes}
                  </p>
                )}
              </aside>
            )
          })()}
        </div>
      </div>

      {/* ── Backstory ── */}
      <div role="tabpanel" id="tabpanel-11" aria-labelledby="tab-11" hidden={tab !== 11}>
        <div className="form-section">
          <fieldset>
            <legend>{t('backstoryLabel')}</legend>
            <textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} placeholder={t('backstoryPh')} style={{ width: '100%' }} />
          </fieldset>
          <fieldset>
            <legend>{t('appearanceLabel')}</legend>
            <textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={4} placeholder={t('appearancePh')} style={{ width: '100%' }} />
          </fieldset>
          <fieldset>
            <legend>{t('goalsLabel')}</legend>
            <textarea name="goals" value={fields.goals} onChange={handleText} rows={4} placeholder={t('goalsPh')} style={{ width: '100%' }} />
          </fieldset>
          <fieldset>
            <legend>{t('alliesLabel')}</legend>
            <textarea name="allies" value={fields.allies} onChange={handleText} rows={4} placeholder={t('alliesPh')} style={{ width: '100%' }} />
          </fieldset>
          <fieldset>
            <legend>{t('enemiesLabel')}</legend>
            <textarea name="enemies" value={fields.enemies} onChange={handleText} rows={4} placeholder={t('enemiesPh')} style={{ width: '100%' }} />
          </fieldset>
          <fieldset>
            <legend>{t('havensLabel')}</legend>
            <textarea name="havens" value={fields.havens} onChange={handleText} rows={4} placeholder={t('havensPh')} style={{ width: '100%' }} />
          </fieldset>
          <fieldset>
            <legend>{t('territoriesLabel')}</legend>
            <textarea name="territories" value={fields.territories} onChange={handleText} rows={4} placeholder={t('territoriesPh')} style={{ width: '100%' }} />
          </fieldset>
        </div>
      </div>

      {/* ── XP Log ── */}
      <div role="tabpanel" id="tabpanel-12" aria-labelledby="tab-12" hidden={tab !== 12}>
        <XpLogSection
          splat="vampire"
          xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)}
          t={t}
        />
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={onBack}>{t('cancel')}</button>
        <button
          className="btn btn-secondary"
          onClick={handleSave}
          disabled={saving || validationErrors.length > 0}
          title={validationErrors.length > 0 ? validationErrors.join(' ') : undefined}
        >
          {saving ? t('saving') : t('quickSave')}
        </button>
        <button className="btn btn-primary" onClick={handleDoneEditing} disabled={saving}>
          {t('doneEditing')}
        </button>
      </div>
      {viewMode && (
        <div className="view-actions">
          <button className="btn btn-secondary" onClick={() => __navigate('/characters')}>{t('back')}</button>
          <button className="btn btn-primary" onClick={() => __navigate(`/characters/${characterId}`, { replace: true })}>{t('edit')}</button>
        </div>
      )}
    </section>
  )
}

// ── ArchetypeSelect ───────────────────────────────────────────────────────────

function ArchetypeSelect({ id, name, label: labelText, value, onChange, t }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  const archetype = ARCHETYPES.find(a => a.value === value)
  const filtered = ARCHETYPES.filter(a =>
    a.value.toLowerCase().includes(search.toLowerCase()) ||
    a.description.toLowerCase().includes(search.toLowerCase())
  )

  // Close on outside click
  useEffect(() => {
    function handle(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  function select(val) {
    onChange(name, val)
    setOpen(false)
    setSearch('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') { setOpen(false); setSearch('') }
    if (e.key === 'Enter' && filtered.length === 1) select(filtered[0].value)
  }

  return (
    <div className="field archetype-field" ref={containerRef}>
      <label htmlFor={id}>{labelText}</label>
      <div className="archetype-combobox">
        <input
          ref={inputRef}
          id={id}
          type="text"
          autoComplete="off"
          placeholder={value || (t ? t('searchArchetypes') : 'Search archetypes…')}
          value={open ? search : (value || '')}
          onFocus={() => { setOpen(true); setSearch('') }}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls={`${id}-listbox`}
        />
        {value && !open && (
          <button
            className="archetype-clear"
            onClick={() => { onChange(name, ''); setSearch('') }}
            aria-label={`Clear ${labelText}`}
            tabIndex={-1}
          >×</button>
        )}
      </div>

      {open && (
        <ul className="archetype-dropdown" id={`${id}-listbox`} role="listbox">
          {filtered.length === 0 && (
            <li className="archetype-no-results">{t ? t('noMatch') : 'No match'}</li>
          )}
          {filtered.map(a => (
            <li
              key={a.value}
              role="option"
              aria-selected={a.value === value}
              className={`archetype-option${a.value === value ? ' archetype-option--selected' : ''}`}
              onMouseDown={() => select(a.value)}
            >
              <span className="archetype-option-name">{a.value}</span>
              <span className="archetype-option-desc">{a.description}</span>
            </li>
          ))}
        </ul>
      )}

      {archetype && !open && (
        <p className="archetype-desc">{archetype.description}</p>
      )}
    </div>
  )
}

// ── SearchableInput ───────────────────────────────────────────────────────────
// Free-text input with optional catalog suggestions + description tooltip.

function SearchableInput({ id, label: labelText, catalog, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  const filtered = catalog.filter(c =>
    c.value.toLowerCase().includes(value.toLowerCase()) ||
    c.description.toLowerCase().includes(value.toLowerCase())
  )
  const matched = catalog.find(c => c.value.toLowerCase() === value.toLowerCase())

  useEffect(() => {
    function handle(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  function select(val) {
    onChange(val)
    setOpen(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') setOpen(false)
    if (e.key === 'Enter' && filtered.length === 1) select(filtered[0].value)
  }

  return (
    <div className="field archetype-field" ref={containerRef}>
      <label htmlFor={id}>{labelText}</label>
      <div className="archetype-combobox">
        <input
          id={id}
          type="text"
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onChange={e => { onChange(e.target.value); setOpen(true) }}
          onKeyDown={handleKeyDown}
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls={`${id}-listbox`}
        />
        {value && (
          <button
            className="archetype-clear"
            onClick={() => { onChange(''); setOpen(false) }}
            aria-label={`Clear ${labelText}`}
            tabIndex={-1}
          >×</button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <ul className="archetype-dropdown" id={`${id}-listbox`} role="listbox">
          {filtered.map(c => (
            <li
              key={c.value}
              role="option"
              aria-selected={c.value === value}
              className={`archetype-option${c.value === value ? ' archetype-option--selected' : ''}`}
              onMouseDown={e => { e.preventDefault(); select(c.value) }}
            >
              <span className="archetype-option-name">{c.value}</span>
              <span className="archetype-option-desc">{c.description}</span>
            </li>
          ))}
        </ul>
      )}

      {matched && !open && (
        <p className="archetype-desc">{matched.description}</p>
      )}
    </div>
  )
}

// ── CatalogList ───────────────────────────────────────────────────────────────

function CatalogList({ items, getCost, selectedIds, onAdd, onPreview, ariaLabel }) {
  const { t } = useLanguage()
  return (
    <ul className="catalog-list" aria-label={ariaLabel}>
      {items.length === 0 && <li className="catalog-empty">{t('noMatchFound')}</li>}
      {items.map(item => {
        const already = selectedIds?.has(item.id)
        return (
          <li key={item.id} className={`catalog-item${already ? ' catalog-item--added' : ''}`}>
            <button
              className="catalog-item-btn"
              onClick={() => { if (!already) onAdd(item); else onPreview?.(item) }}
              aria-label={already ? `${item.name} — already added` : `Add ${item.name}`}
              aria-pressed={already}
            >
              <div className="catalog-item-main">
                <span className="catalog-item-name">{item.name}</span>
                {item.description && (
                  <span className="catalog-item-desc">{item.description}</span>
                )}
              </div>
              <div className="catalog-item-meta">
                {getCost?.(item) != null && (
                  <span className="catalog-item-cost">{getCost(item)}pt</span>
                )}
                {already
                  ? <span className="catalog-item-check">✓</span>
                  : <span className="catalog-item-add">+</span>
                }
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
