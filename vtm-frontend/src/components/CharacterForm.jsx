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
import { useLanguage } from '../i18n/LanguageContext'

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
  { value: 'Brujah',                  curse: 'The difficulty to resist Frenzy and Rötschreck is always 1 higher (maximum 10). Brujah have a hair-trigger temper and are notorious for losing control of their passions at the worst possible moment.' },
  { value: 'Followers of Set',        curse: 'Suffer double damage from sunlight and fire. When confronted with holy symbols or items of their enemies\' faith, they must make Rötschreck checks as if facing fire. Bright light of any kind causes them discomfort.' },
  { value: 'Gangrel',                 curse: 'Each time a Gangrel frenzies, they permanently gain one animalistic feature — claws, slitted pupils, fur, a muzzle, etc. These features can only be removed by spending experience points (1 XP per feature).' },
  { value: 'Giovanni',                curse: 'The Giovanni Kiss is uniquely agonising. Mortals bitten take double the normal damage from blood loss, and receive none of the usual Kiss-induced ecstasy — only pain. This makes feeding discreet and socially invisible all but impossible.' },
  { value: 'Lasombra',                curse: 'Cast no reflection in mirrors or other reflective surfaces and cannot be captured on film, digital cameras, or video. They also suffer +1 difficulty on all Social rolls with non-Lasombra due to their shadow-tainted, unsettling presence.' },
  { value: 'Malkavian',               curse: 'Every Malkavian has at least one permanent derangement woven into the fabric of their Embrace. It can never be fully cured, only managed — and in moments of stress it reasserts itself with full force.' },
  { value: 'Nosferatu',               curse: 'Appearance is permanently 0 and can never be raised. All Social rolls except Intimidation suffer +1 difficulty. Nosferatu cannot walk openly in mortal society without supernatural concealment.' },
  { value: 'Ravnos',                  curse: 'Must indulge a specific vice (determined at Embrace: lying, theft, violence, seduction, etc.) at least once per night. Each night they successfully resist, they suffer a cumulative −1 die penalty to all dice pools until they give in.' },
  { value: 'Toreador',                curse: 'When encountering something of striking beauty — art, music, a face — the Toreador must make a Self-Control roll (Diff 6) or become enraptured and motionless for a full scene, incapable of acting.' },
  { value: 'Tremere',                 curse: 'At the moment of Embrace, every Tremere is blood bonded to the entire Council of Seven. They are also considered one step bonded to all other Tremere. The clan watches its own obsessively; true independence is almost impossible.' },
  { value: 'Tzimisce',                curse: 'Must sleep surrounded by at least two handfuls of earth from their birthplace or long-claimed domain each day. Each night they fail to rest in their earth, they lose one die from all dice pools. After three nights, all pools are reduced to zero.' },
  { value: 'Ventrue',                 curse: 'Can only feed from a specific type of mortal chosen at Embrace (e.g. only redheads, only the wealthy, only soldiers). Blood from any other source is immediately vomited up and provides no nourishment whatsoever.' },
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

// ── Blood Sorcery Catalog ─────────────────────────────────────────────────────

const SORCERY_PATHS = [
  { value: 'Path of Blood', description: 'The primary path taught to all Tremere — mastery over vitae itself.',
    levels: [
      '●  A Taste for Blood — Taste a sample of vitae to learn the owner\'s generation, Humanity, and blood pool.',
      '●● Blood Rage — Force a vampire to spend blood against their will, activating powers involuntarily.',
      '●●● Blood of Potency — Temporarily increase the potency of your own vitae, lowering effective generation.',
      '●●●● Theft of Vitae — Draw blood from a victim at range without physical contact.',
      '●●●●● Cauldron of Blood — Boil the blood inside a victim\'s body, inflicting catastrophic aggravated damage.',
    ] },
  { value: 'Lure of Flames', description: 'Command and conjure fire — a Tremere favourite and a fearsome weapon.',
    levels: [
      '●  Hand of Flame — Ignite your palm with a controllable flame you can hold safely.',
      '●● The Torch — Project a sustained jet of fire at a target.',
      '●●● Wall of Flame — Create a roaring barrier of supernatural fire.',
      '●●●● The Conflagration — Engulf a single target completely in a column of flame.',
      '●●●●● Firestorm — Call down a catastrophic firestorm over a wide area.',
    ] },
  { value: 'Movement of the Mind', description: 'Telekinesis — move objects and people with thought alone.',
    levels: [
      '●  Pebble — Move very small objects telekinetically with minor precision.',
      '●● Updraft — Lift and move larger objects; enough force to hurl a person.',
      '●●● Poltergeist — Manipulate multiple objects simultaneously with greater force.',
      '●●●● The Flying Dutchman — Move objects with fine precision at significant speed and force.',
      '●●●●● Control — Lift, carry, and precisely control large objects or restrain people completely.',
    ] },
  { value: 'Path of Conjuring', description: 'Bring objects and eventually living things into existence from nothing.',
    levels: [
      '●  Summon the Simple Form — Conjure a single simple inanimate object.',
      '●● Permanency — Make a conjured object persist indefinitely without upkeep.',
      '●●● Magic of the Smith — Conjure complex, multi-part objects with moving components.',
      '●●●● The Reverse — Deconstruct conjured matter back into nothingness instantly.',
      '●●●●● Power Over Life — Conjure a living creature of up to medium size.',
    ] },
  { value: 'Path of Corruption', description: 'Corrupt, taint, and create dependence in mortals and Kindred.',
    levels: [
      '●  Contaminate — Corrupt a small quantity of food, drink, or blood with a touch.',
      '●● Corrupt the Undead Flesh — Inflict a supernatural wasting disease on a vampire.',
      '●●● Blight — Cause plants and small animals to wither and die with a gesture.',
      '●●●● Addiction — Create a supernatural, obsessive craving in a mortal for a specific thing.',
      '●●●●● Dependence — Establish a blood-bond-like dominance over a target without actually feeding them.',
    ] },
  { value: 'Path of Mars', description: 'Blood magic focused on combat — bolstering allies and cursing enemies.',
    levels: [
      '●  War Cry — Strengthen resolve and combat ability of yourself or an ally.',
      '●● Strike True — Grant extraordinary accuracy to a combatant\'s attacks for a scene.',
      '●●● Malediction — Curse a weapon to malfunction, break, or turn on its wielder.',
      '●●●● Spark of Rage — Induce paranoia and violent aggression in a target.',
      '●●●●● Spur the Homunculus — Animate an inanimate object to fight autonomously on your behalf.',
    ] },
  { value: 'Path of Technomancy', description: 'Apply blood sorcery to modern technology — analyse, control, and destroy electronics.',
    levels: [
      '●  Analyze — Perfectly understand the function and operation of any technological device.',
      '●● Burnout — Destroy a small electronic device with a touch.',
      '●●● Encrypt/Decrypt — Magically secure a digital message or break any encryption.',
      '●●●● Telecommute — Project your consciousness into electronic networks to communicate or gather data.',
      '●●●●● Sys Failure — Crash and permanently destroy complex computer systems at range.',
    ] },
  { value: 'Green Path', description: 'Wicce blood sorcery rooted in nature — plants, beasts, and the living world.',
    levels: [
      '●  Decay — Cause rapid rot in plant matter with a touch.',
      '●● Enrich the Fallow Field — Restore barren land to fertility and promote rapid growth.',
      '●●● Speak with Beasts — Communicate with animals, distinct from Animalism.',
      '●●●● Verdant Haven — Grow a dense, impenetrable barrier of rapid-growing plants.',
      '●●●●● Awaken the Forest Giants — Animate large trees or plants as powerful servants.',
    ] },
  { value: "Neptune's Might", description: 'Dominion over water — sense, shape, and weaponise it against enemies.',
    levels: [
      '●  Eyes of the Sea — Perceive through any connected body of water nearby.',
      '●● Prison of Water — Surround a target with a swirling column of water, restraining them.',
      '●●● Blood to Water — Convert a portion of a target\'s blood to inert water.',
      '●●●● Flowing Wall — Form a solid wall of water as a barrier or shield.',
      '●●●●● Dehydrate — Draw all moisture from a target\'s body, inflicting severe aggravated damage.',
    ] },
  { value: 'Hands of Destruction', description: 'Entropy and dissolution — rot, wither, and unmake.',
    levels: [
      '●  Decay — Rapidly deteriorate organic matter with a touch.',
      '●● Gnarl Wood — Warp, weaken, and render wooden objects useless.',
      '●●● Acidic Touch — Secrete a corrosive substance from your palms that burns through most materials.',
      '●●●● Atrophy — Wither a target\'s limb, rendering it useless until healed.',
      '●●●●● Turn to Dust — Dissolve a target entirely to dry powder and ash.',
    ] },
  { value: 'Spirit Manipulation', description: 'Perceive, empower, and command spirits of the dead and the unseen world.',
    levels: [
      '●  Hermetic Sight — See and detect all spirits present in the immediate area.',
      '●● Élan — Grant a spirit temporary power or a burst of energy.',
      '●●● Materialize — Allow a spirit to manifest a physical form temporarily.',
      '●●●● Rouse — Awaken and enrage a dormant or bound spirit.',
      '●●●●● Bind/Dismiss Spirit — Command a spirit to obey or banish it permanently.',
    ] },
  { value: 'Elemental Mastery', description: 'Commune with, animate, and summon the classic elementals.',
    levels: [
      '●  Elemental Strength — Draw power from earth to temporarily boost physical Attributes.',
      '●● Wooden Tongue — Communicate with and receive information from plants.',
      '●●● Animate the Unmoving — Animate a volume of elemental matter to perform simple tasks.',
      '●●●● Elemental Form — Partially transform your body into a chosen element.',
      '●●●●● Summon Elemental — Call and bind a true elemental to serve you.',
    ] },
  { value: 'Weather Control', description: 'Command the weather — fog, wind, lightning, and storm.',
    levels: [
      '●  Fog — Call up a dense, obscuring supernatural fog over a wide area.',
      '●● Mists of Confusion — Disorient and confuse anyone caught within your fog.',
      '●●● Winds of Change — Direct and strengthen winds to a powerful, damaging degree.',
      '●●●● Lightning Strike — Call down a precise bolt of lightning on a specific target.',
      '●●●●● The Eye of the Storm — Create a full, localised supernatural storm at will.',
    ] },
  { value: 'Path of Shadowcrafting', description: 'Command and inhabit shadows — travel, strike, and vanish through darkness.',
    levels: [
      '●  Shadowstep — Move instantly between two shadows within sight.',
      '●● Shadow Hands — Extend tendrils of shadow to grab, hold, or strike.',
      '●●● Shadow Form — Become partially incorporeal while in darkness, resisting most physical harm.',
      '●●●● Shadow World — Step briefly into a shadow-realm version of your location.',
      '●●●●● The Living Shadow — Transform completely into living shadow; near-impossible to harm.',
    ] },
  { value: "Path of the Father's Vengeance", description: 'Turn vampirism against its bearers — intensify curses, strip generation, and punish Cainites. (Sabbat)',
    levels: [
      "●  Zillah's Litany — Reveal all blood bonds and Vinculi involving the subject.",
      "●● The Crone's Pride — Reduce the target's Appearance to zero for one night.",
      '●●● Feast of Ashes — The victim can no longer consume blood and must eat ashes instead for one week.',
      "●●●● Uriel's Disfavor — Any bright light inflicts aggravated damage on the target for one week.",
      '●●●●● Valediction — Revert the subject to their original generation for one week.',
    ] },
  { value: 'Alchemy', description: 'Hermetic transmutation of elements and compounds — change form and composition of matter.',
    levels: [
      '●  Simple changes in form — solid to liquid, liquid to gas, etc.',
      '●● Complex changes to form — liquid to a specific shape of solid, separate compounds.',
      '●●● Complicated changes to form — water to breathable O₂ and loose H₂, compounds into elements.',
      '●●●● Minor shifts in composition — adjust an element\'s atomic number up to five places.',
      '●●●●● Miraculous shifts in composition — turn lead into gold or nitrogen into radium.',
    ] },
  { value: 'Biothaumaturgy', description: 'Experimental blood sorcery focused on biology — forensics, healing, and animating the dead.',
    levels: [
      '●  Thaumaturgical Forensics — Analyse a tissue sample to learn gender, clan, diablerie traces, etc.',
      '●● Thaumaturgical Surgery — Aid regeneration; each success converts one health level to a lesser type.',
      '●●● Lesser Animation — Animate dead simple creatures (up to 100 lbs) with a one-sentence command.',
      '●●●● Greater Animation — Animate human corpses and large animals with minor physical alterations.',
      '●●●●● Cognizant Construction — Bestow a semblance of intelligence on an animated creation.',
    ] },
  { value: 'The Focused Mind', description: 'Concentration and mental fortitude — sharpen thought, resist influence, and act with perfect clarity.',
    levels: [
      '●  Readiness — Gain bonus dice to Wits-related rolls or boost initiative for the turn.',
      '●● Clarity of Purpose — Target ignores dice pool reductions from wounds, modifiers, and Disciplines.',
      '●●● One-Tracked Mind — Target cannot split dice pools but reduces difficulty of declared action by 1.',
      '●●●● Dual Thought — Gain an extra mental action per turn for Disciplines, Auspex, or problem-solving.',
      '●●●●● Perfect Clarity — All difficulties reduced by 2; immune to frenzy and Rötschreck for one scene.',
    ] },
  { value: 'The Hearth Path', description: 'Ward, protect, and command your haven — alarms, confusion, and awareness within your domain.',
    levels: [
      '●  Secure the Threshold — Place an audible or visual alarm on a door or portal for 24 hours.',
      '●● Empowered Awareness — Know the exact location of all your belongings within your haven for one scene.',
      '●●● Astray — Intruders become hopelessly lost in your haven for 24 hours.',
      '●●●● Redefine — Walk through any doorway and be transported to any room in your haven until sunrise.',
      '●●●●● Awaken the Homunculus — Haven objects gain awareness and can answer questions about events within.',
    ] },
  { value: 'Mastery of the Mortal Shell', description: 'Seize control of a victim\'s body — vertigo, paralysis, seizures, and full puppetry.',
    levels: [
      '●  Vertigo — Touch causes disorientation; +1 difficulty to all victim\'s physical actions.',
      '●● Contortion — Render a specific limb useless with a touch.',
      '●●● Seizure — Cause full-body convulsions; −4 dice penalty to all actions and ongoing damage.',
      '●●●● Body Failure — Cause organ failure at range; −5 dice penalty and lethal damage per turn.',
      '●●●●● Marionette — Seize complete physical control of a victim\'s body within line of sight.',
    ] },
  { value: 'Oneiromancy', description: 'Divination and manipulation through dreams — portents, prophecy, and dream messages.',
    levels: [
      '●  Portents — Read cryptic dream imagery about a forthcoming personal event upon waking.',
      '●● Foresee — Divine future events for a sleeping subject by reading their dreams.',
      '●●● Dreamspeak — Send a static dream message to anyone you have previously met while they sleep.',
      '●●●● Augury — Seek specific answers to questions via directed dream imagery.',
      '●●●●● Revelation of the Soul — Instantly learn a person\'s innermost desire and greatest fear.',
    ] },
  { value: "Path of the Blood's Curse", description: 'Intensify the vampiric curse — provoke frenzy, dull fangs, corrupt bonds, and wither the undead.',
    levels: [
      '●  Provoke the Beast — Force a target to make an immediate frenzy check.',
      '●● Curse of Slumber — Inflict daytime lethargy on the target for one scene per success.',
      '●●● Dull the Fang — Render a victim\'s fangs useless; the Kiss causes no ecstasy.',
      '●●●● Corrupt the Bond — Corrupt blood bonds, turning devotion to hatred for nights equal to successes.',
      '●●●●● Withering — Age the victim to their true age; lose Physical Attributes per decade gained.',
    ] },
  { value: 'Path of Curses', description: 'The Evil Eye — curse a target socially, physically, and supernaturally.',
    levels: [
      '●  The Evil Eye — Victim gains +1 difficulty to all Social rolls until next sunset.',
      '●● Pestilence — Inflict severe illness reducing Str, Dex, and Sta pools for nights equal to Willpower.',
      '●●● Pariah — Those around the victim perceive them as a dire rival, causing antagonism.',
      '●●●● Corrupt Body — Drop one chosen Physical Attribute or Appearance to 1 for a variable duration.',
      '●●●●● Doom — All victim\'s actions gain automatic botch dice and max 2 successes.',
    ] },
  { value: 'Path of Transmutation', description: 'Alter the physical state of matter — fortify, liquefy, solidify, and vaporise.',
    levels: [
      '●  Fortify the Solid Form — Increase an object\'s offensive or defensive capability for one scene.',
      '●● Crystallize the Liquid Form — Solidify liquids; each success converts one blood point to solid form.',
      '●●● Liquefy the Solid Form — Melt solid objects within line of sight for one scene.',
      '●●●● Gaol — Solidify air into an opaque, indestructible barrier for one scene.',
      '●●●●● Vaporize — Turn any nonliving object within line of sight to vapour for one scene.',
    ] },
  { value: 'The Vine of Dionysus', description: 'Supernatural intoxication and ecstasy — stupefy, addict, and overwhelm through blood.',
    levels: [
      '●  Methyskein — Touch causes intoxication; −1 Dexterity and Intelligence for one scene per success.',
      '●● Omophagy — Eye contact gives target the Gluttony derangement for the night.',
      '●●● Hamartia — Dangerous euphoria; −2 all dice pools but +2 Strength for scenes equal to successes.',
      '●●●● Enthousiastmos — 10-foot aura of pheromone stupor; victims become passive and hallucinatory.',
      '●●●●● Blood of Dionysus — Anyone who drinks the caster\'s blood suffers overwhelming ecstatic stupor.',
    ] },
  { value: 'The Faux Path', description: 'Imitate and replicate other Thaumaturgy paths and Disciplines through complex mimicry.',
    levels: [
      '●  Mimic — Reproduce the superficial appearance of a Level One path or Discipline effect.',
      '●● False Resonance — Make your aura appear as though you possess a Discipline you do not have.',
      '●●● Discipline Facade — Convincingly replicate observable effects of any Discipline up to Level Two.',
      '●●●● Steal the Seeming — Temporarily copy the appearance and effects of a witnessed Discipline use.',
      '●●●●● Perfect Forgery — Perfectly replicate any single Discipline power up to Level Three.',
    ] },
  { value: 'Path of the Levinbolt', description: 'Gather and unleash electrical energy — shocks, surges, and devastating lightning.',
    levels: [
      '●  Spark — Generate a small but painful electrical shock through physical contact.',
      '●● Electromagnetic Pulse — Release a localised burst that disrupts and damages nearby electronics.',
      '●●● Lightning Bolt — Hurl a damaging bolt of electricity at a visible target.',
      '●●●● Ball Lightning — Conjure a hovering sphere of electrical energy that can be directed at will.',
      '●●●●● Eye of the Storm — Unleash a devastating barrage of electrical strikes across a wide area.',
    ] },
  { value: 'Soul of the Serpent', description: 'Command and commune with serpents — see through their eyes and draw on their power. (Cairo Tremere)',
    levels: [
      '●  Eyes of the Serpent — Perceive through the senses of any snake within range.',
      '●● Tongue of the Serpent — Communicate with and issue commands to serpents.',
      '●●● Skin of the Adder — Harden your skin to reptilian scales, gaining natural armour.',
      '●●●● Form of the Cobra — Transform into a large supernatural serpent.',
      '●●●●● Heart of the Serpent — Imbue a snake with a portion of your essence, creating a mystical familiar.',
    ] },
  // ── Necromancy Paths ──
  { value: 'The Sepulchre Path', description: 'Witness, summon, and command the spirits of the dead. The most common starting path for necromancers. (Giovanni)',
    levels: [
      '●  Witness of Death — Attune your senses to perceive ghosts as translucent phantoms.',
      '●● Summon Soul — Call a specific ghost back from the Underworld for conversation.',
      '●●● Compel Soul — Command a ghost to obey your will through a contest of wills.',
      '●●●● Haunting — Bind a summoned ghost to a particular location or object.',
      '●●●●● Torment — Strike a wraith as if in the lands of the dead, inflicting damage on its ectoplasmic form.',
    ] },
  { value: 'The Ash Path', description: 'Peer into the lands of the dead, converse with wraiths, and even cross into the Underworld. (Necromancy)',
    levels: [
      '●  Shroudsight — See through the Shroud into the Shadowlands and perceive ghostly structures.',
      '●● Lifeless Tongues — Converse effortlessly with the denizens of the Underworld.',
      '●●● Dead Hand — Reach across the Shroud to affect ghostly objects and interact with wraiths physically.',
      '●●●● Ex Nihilo — Physically enter the Underworld through a chalk-drawn door.',
      '●●●●● Shroud Mastery — Raise or lower the Shroud, aiding or hindering ghosts\' ability to cross.',
    ] },
  { value: 'The Bone Path', description: 'Animate corpses, steal souls from the living, and place spirits into freshly dead bodies. (Necromancy)',
    levels: [
      '●  Tremens — Make a corpse shift or move once — an arm flops, dead eyes open.',
      '●● Apprentice\'s Brooms — Animate dead bodies to perform simple tasks like carrying or digging.',
      '●●● Shambling Hordes — Raise multiple corpses with the ability to attack and follow orders.',
      '●●●● Soul Stealing — Strip a soul from a living mortal body, turning it into a wraith.',
      '●●●●● Daemonic Possession — Insert a willing soul into a freshly dead body, giving it a temporary physical home.',
    ] },
  { value: 'The Cenotaph Path', description: 'Discover or forge links between the living world and the Shadowlands. (Necromancy)',
    levels: [
      '●  A Touch of Death — Sense whether a ghost has exerted power on a person or object.',
      '●● Reveal the Catene — Determine if an object is a fetter to a ghost by handling it.',
      '●●● Tread Upon the Grave — Sense locations where the Shadowlands lie close to the living world.',
      '●●●● Death Knell — Automatically sense when someone dies and becomes a ghost nearby.',
      '●●●●● Ephemeral Binding — Turn a mundane object into a fetter for a wraith using your vitae.',
    ] },
  { value: 'The Corpse in the Monster', description: 'Experience the corpse as a gateway between life and death, enhancing or reducing undead traits. (Cappadocian / Harbinger of Skulls)',
    levels: [
      '●  Masque of Death — Assume a corpselike visage or inflict it on another vampire.',
      '●● Cold of the Grave — Take on the unfeeling semblance of the dead, ignoring wound penalties.',
      '●●● Curse of Life — Inflict the undesirable traits of the living upon an undead target.',
      '●●●● Gift of the Corpse — Temporarily ignore most vampiric weaknesses — sunlight, frenzy, staking.',
      '●●●●● Gift of Life — Experience the best of being alive for a night at an enormous blood cost.',
    ] },
  { value: 'The Grave\'s Decay', description: 'Channel the forces of entropy and decay, withering limbs and dissolving undead flesh. (Cappadocian / Harbinger of Skulls)',
    levels: [
      '●  Destroy the Husk — Turn a human corpse to a pile of unremarkable dust.',
      '●● Rigor Mortis — Freeze a living or undead target in place as if staked.',
      '●●● Wither — Cripple an opponent\'s limb, shriveling muscle and making bone brittle.',
      '●●●● Corrupt the Undead Flesh — Inflict a virulent disease on an undead creature that spreads to others.',
      '●●●●● Dissolve the Flesh — Turn vampiric flesh to dust or ash with charged vitae.',
    ] },
  { value: 'Path of Haunting', description: 'Weave death and shadow into illusions and terrors that haunt victims awake and asleep. (Necromancy)',
    levels: [
      '●  Song of the Dead — Instill an obsession with death in a listener through a haunting chant.',
      '●● Summon Wisp — Conjure a dancing orb of pale light that can mesmerize mortals.',
      '●●● Harrowing — Inflict horrible nightmares that prevent restful sleep and Willpower recovery.',
      '●●●● Phantasms — Create ghostly apparitions and illusions visible to the living.',
      '●●●●● Torment — Reduce the Shroud around a victim, attracting malicious ghosts to torment them.',
    ] },
  { value: 'Path of the Four Humors', description: 'Manipulate the four humors — blood, phlegm, yellow bile, black bile — as weapons of poison and decay. (Harbinger of Skulls / Lamia)',
    levels: [
      '●  Whispers to the Soul — Whisper undead bile into a target\'s ear, causing nightmares and lost dice.',
      '●● Kiss of the Dark Mother — Mix vitae with black bile to double bite damage.',
      '●●● Dark Humors — Exude a poisonous humor onto your skin that afflicts anyone who touches you.',
      '●●●● Clutching the Shroud — Drink dead blood to gain soak dice and sense how close others are to death.',
      '●●●●● Black Breath — Exhale a cloud of despair that drives mortals to suicide and vampires to torpor.',
    ] },
  { value: 'Path of the Twilight Garden', description: 'A martial path of the Lamiae, channeling the Dark Mother\'s power over life and death cycles. (Dark Ages — Lamia)',
    levels: [
      '●  Whispers to the Soul — Whisper a secret name of Lilith to torment a target with nightmares.',
      '●● Kiss of the Dark Mother — Fill your mouth with caustic bile to double bite damage.',
      '●●● Dark Humours — Transubstantiate vitae into one of four corrupted humors to poison foes.',
      '●●●● Caul of the Neverborn — Drink dead blood to gain soak, immunity to wound penalties, and ghost sight.',
      '●●●●● Lament of D\'hainu — Howl to unleash a miasma of despair that drives victims to suicide or torpor.',
    ] },
  { value: 'Vitreous Path', description: 'Control entropic energies pertaining to death — decay objects, feed on ghosts, and unleash chaos. (Nagaraja)',
    levels: [
      '●  Eyes of the Dead — See death\'s markings on the living, divining how and when they will die.',
      '●● Aura of Decay — Radiate entropy to corrode and destroy nonliving objects within a yard.',
      '●●● Soul Feast — Draw sustenance from ambient death energy or feed directly on a ghost\'s essence.',
      '●●●● Breath of Thanatos — Exhale necromantic energy to lure Spectres or inflict wasting illness.',
      '●●●●● Night Cry — Scream pure chaos to either aid allies or inflict aggravated damage on enemies.',
    ] },
  { value: 'The Nightshade Path', description: 'Study natural cycles of life and death, manipulating rot, raising verdant dead, and birthing ghosts. (Tal\'Mahe\'Ra / Bahari / Drakaina)',
    levels: [
      '●  Tend the Body Garden — Speed up or arrest decomposition of a corpse.',
      '●● Witch\'s Fruit — Taint plant matter so the first creature to eat it can see the Shadowlands.',
      '●●● Raise the Green One — Animate a corpse bound and strengthened by plant matter from fertile soil.',
      '●●●● Wails and Whispers — Scream to add lethal damage or whisper to delay injuries on a target.',
      '●●●●● Chthonic Womb — Kill a mortal whose blood you\'ve drunk to trap their soul, later summoning it as a ghost.',
    ] },
  { value: 'Path of Skulls', description: 'Spy through skulls, interrogate the dead, and consume fragments of souls. (Cappadocian — Harbinger, Dark Ages)',
    levels: [
      '●  Calvaria Emissius — See through the eye-sockets of any skull from a creature you personally slew.',
      '●● Consilium Mortuus — Force a decapitated head to answer questions truthfully from vestigial memory.',
      '●●● Ammorsus Vicarius — Animate a toothy skull as a biting weapon that channels blood back to you.',
      '●●●● Exedo Animus — Drink a skull to gain the deceased\'s memories and identity for hours.',
      '●●●●● Degulo — Consume a skull whole to permanently absorb one trait from the deceased.',
    ] },
  { value: 'Path of Woe', description: 'Threaten and destroy ghosts through faith-charged necromancy. (Rosselini, Dark Ages)',
    levels: [
      '●  Finding the Locus — See ectoplasmic glow around a wraith\'s fetters.',
      '●● Expurgate the Damned — Force a hidden wraith into the physical world in a vulnerable form.',
      '●●● Blood Scourge — Whip wraiths with sanctified vitae, inflicting aggravated damage.',
      '●●●● Cursed Eucharist — Feed on a wraith to convert its Passion into temporary Willpower.',
      '●●●●● Purge the Apostate\'s Soul — Scream to inflict aggravated damage on all wraiths nearby, sending them to Oblivion.',
    ] },
]

const RITUALS = [
  // ——— Level 1 ———
  { value: 'Bind the Accusing Tongue',       level: 1, description: 'Lay a compulsion preventing the subject from speaking ill of the caster until they overcome it with Willpower.' },
  { value: 'Blood Into Water',               level: 1, description: 'Transmute a small quantity of blood into water, rendering it useless as vitae.' },
  { value: 'Blood Mastery',                  level: 1, description: 'Burn a mix of your blood and the victim\'s to guarantee one marginal success in your next contest against them.' },
  { value: 'Blood Rush',                     level: 1, description: 'Create the sensation of drinking blood without feeding, allaying the Beast for one hour.' },
  { value: 'Brand of the Paramour',          level: 1, description: 'Mark a subject with an invisible brand visible only to the caster, allowing tracking.' },
  { value: 'Communicate with Kindred Sire',  level: 1, description: 'Join minds with your sire telepathically over any distance for 10 minutes per success.' },
  { value: 'Dedicate the Chantry',           level: 1, description: 'Walk a counterclockwise circle to consecrate a building, lowering difficulty of all site rituals by one.' },
  { value: 'Defense of the Sacred Haven',    level: 1, description: 'Inscribe sigils to prevent sunlight from entering a 20-foot area while you remain within.' },
  { value: 'Deflection of Wooden Doom',      level: 1, description: 'The first stake used to impale you disintegrates on contact. Lasts until dawn or dusk.' },
  { value: 'Dominoe of Life',                level: 1, description: 'Simulate one human trait for a night — body heat, breathing, skin colour, or eating.' },
  { value: 'Encrypt Missive',                level: 1, description: 'Write a message in blood readable only by the writer and one named recipient.' },
  { value: 'Engaging the Vessel of Transference', level: 1, description: 'Enchant a container to covertly exchange its blood with the blood of anyone who touches it bare-handed.' },
  { value: 'Expedient Paperwork',            level: 1, description: 'Ensure a bureaucratic document is processed swiftly and without complication.' },
  { value: 'Illuminate the Trail of Prey',   level: 1, description: 'The path of a named target glows visibly only to the caster; brighter for fresher tracks.' },
  { value: 'Impressive Visage',              level: 1, description: 'Gain two bonus dice on Appearance-related rolls for a number of hours equal to successes.' },
  { value: 'Incantation of the Shepherd',    level: 1, description: 'Sense the direction and distance to every member of your herd within 10 miles per Herd dot.' },
  { value: 'Learning the Mind Enslumbered',  level: 1, description: 'Study a subject during their daysleep to learn one of their Abilities or Knowledges.' },
  { value: 'Luminous Vitae',                 level: 1, description: 'Cause spilled vitae to glow brightly, revealing traces of blood invisible to the naked eye.' },
  { value: 'Purge the Inner Demon',          level: 1, description: 'Temporarily suppress the Beast, granting calm but dulling predatory instincts.' },
  { value: 'Purify Blood',                   level: 1, description: 'Cleanse one blood point of all poisons, diseases, and foreign substances (only works on extracted blood).' },
  { value: 'Purity of the Flesh',            level: 1, description: 'Purge all foreign material from your body — dirt, drugs, bullets, tattoo ink — leaving only bare flesh.' },
  { value: 'Rebirth of Mortal Vanity',       level: 1, description: 'Temporarily restore minor mortal features such as hair growth or skin blemishes.' },
  { value: 'Rite of Introduction',           level: 1, description: 'Formally present yourself telepathically to the Tremere regent and clan members in a city.' },
  { value: 'Sanguineous Phial',              level: 1, description: 'Enchant a vial of blood to preserve it indefinitely, preventing decay or coagulation.' },
  { value: 'Scent of the Lupine\'s Passing', level: 1, description: 'Sniff an herbal bundle to detect werewolves by scent for one scene.' },
  { value: 'Sense the Mystical',             level: 1, description: 'Detect the presence and rough nature of supernatural forces or enchantments nearby.' },
  { value: 'Serenading the Kami',            level: 1, description: 'Soothe and communicate with nature spirits through ritual chanting.' },
  { value: 'The Imp\'s Affliction',          level: 1, description: 'Curse a target with a minor but persistent supernatural irritation or malady.' },
  { value: 'The Scribe',                     level: 1, description: 'Your spoken words are mystically transcribed onto any chosen surface for the duration of the scene.' },
  { value: 'Wake with Evening\'s Freshness', level: 1, description: 'Awaken instantly at any sign of danger during daysleep, ignoring Humanity dice limits for two turns.' },
  { value: 'Widow\'s Spite',                 level: 1, description: 'Cause a specific pain, itch, or irritation in a subject using a wax or cloth effigy.' },
  // ——— Level 2 ———
  { value: 'Blood Mead',                     level: 2, description: 'Brew a potent blood-infused mead that can intoxicate vampires or strengthen blood bonds.' },
  { value: 'Blood Walk',                     level: 2, description: 'Trace a vampire\'s lineage, generation, clan, and blood bonds by ritually examining their blood.' },
  { value: 'Bureaucratic Condemnation',       level: 2, description: 'Entangle a target in supernatural bureaucratic misfortune — permits denied, records lost, accounts frozen.' },
  { value: 'Burning Blade',                  level: 2, description: 'Enchant a melee weapon to inflict aggravated damage on supernatural creatures; flickers with green flame.' },
  { value: 'Craft Bloodstone',               level: 2, description: 'Create a stone imbued with your vitae that allows you to scry on its location and nearby area.' },
  { value: 'Deny the Intruder',              level: 2, description: 'Ward a chantry entrance so that unauthorised visitors cannot cross the threshold.' },
  { value: 'Donning the Mask of Shadows',    level: 2, description: 'Render subjects translucent and muffled; detectable only by Perception + Awareness or Auspex vs. Obfuscate 3.' },
  { value: 'Enhancing the Curse',            level: 2, description: 'Intensify a vampire\'s clan weakness for a period of time.' },
  { value: 'Extinguish',                     level: 2, description: 'Snuff out all fires within the ritual\'s area of effect instantly.' },
  { value: 'Eyes of the Night Hawk',         level: 2, description: 'See and hear through a predatory bird you control in flight; put out its eyes afterward or suffer blindness.' },
  { value: 'Fire in the Blood',              level: 2, description: 'Cause a vampire\'s vitae to ignite when they spend it, burning them from within.' },
  { value: 'Impassable Trail',               level: 2, description: 'Make your passage impossible to track by mundane or supernatural means for one night.' },
  { value: 'Inscription',                    level: 2, description: 'Magically inscribe a message onto any surface that fades after being read by the intended recipient.' },
  { value: 'Jinx',                           level: 2, description: 'Curse a target with supernaturally bad luck, increasing difficulties on their rolls.' },
  { value: 'Machine Blitz',                  level: 2, description: 'Instantly cause all machines more complex than a pulley to cease functioning while you concentrate.' },
  { value: 'Mourning Life Curse',            level: 2, description: 'Cause a target to experience overwhelming grief and sorrow, hindering all actions.' },
  { value: 'Obscure the Malice',             level: 2, description: 'Mask hostile intent from supernatural detection, appearing benign to Auspex and similar powers.' },
  { value: 'Principal Focus of Vitae Infusion', level: 2, description: 'Imbue a small object with one blood point; release it at a mental command into a pool of usable vitae.' },
  { value: 'Recure of the Homeland',         level: 2, description: 'Mix dirt from your mortal birthplace with blood to create a paste that heals one aggravated wound.' },
  { value: 'Ritual\'s Recognition',          level: 2, description: 'Identify what ritual was cast on an object or area and determine its approximate power.' },
  { value: 'Steps of the Terrified',         level: 2, description: 'Track a fleeing target by following the psychic residue of their fear.' },
  { value: 'The Open Passage',               level: 2, description: 'Open any mundane lock or sealed portal without leaving traces of entry.' },
  { value: 'Trima',                           level: 2, description: 'Create a small blood-infused token that wards the bearer against a specific type of harm.' },
  { value: 'Ward versus Ghouls',             level: 2, description: 'Inscribe a glyph that inflicts three dice of lethal damage on any ghoul who touches the warded object.' },
  { value: 'Warding Circle versus Ghouls',   level: 2, description: 'Create a circle that blocks and burns ghouls who attempt to cross its boundary.' },
  { value: 'Whispers of the Ghost',          level: 2, description: 'Briefly communicate with a recently deceased spirit to ask simple questions.' },
  // ——— Level 3 ———
  { value: 'A Touch of Nightshade',          level: 3, description: 'Coat an object with a supernatural toxin that induces sleep or torpor on contact.' },
  { value: 'Beacon of the Self',             level: 3, description: 'Create a mystical beacon that guides the caster back to a specific location from any distance.' },
  { value: 'Blood Allergy',                  level: 3, description: 'Cause a target to suffer an adverse reaction when consuming blood of a specific type.' },
  { value: 'Cleansing of the Flesh',         level: 3, description: 'Purge diseases, poisons, and foreign substances from a living or unliving body.' },
  { value: 'Clinging of the Insect',         level: 3, description: 'Cling to walls and ceilings like a spider at half normal movement speed for one scene.' },
  { value: 'Craft Dream Catcher',            level: 3, description: 'Create an enchanted object that captures and stores dreams for later examination.' },
  { value: 'Flesh of Fiery Touch',           level: 3, description: 'Anyone who voluntarily touches your skin suffers one aggravated health level of fire damage until next sunset.' },
  { value: 'Incorporeal Passage',            level: 3, description: 'Become completely insubstantial — pass through walls and ignore physical attacks for hours equal to Wits + Survival successes.' },
  { value: 'Inherited Affinity',             level: 3, description: 'Temporarily gain access to a Discipline known by a vampire whose blood you possess.' },
  { value: 'Major Creation',                 level: 3, description: 'Conjure a large, complex object from thin air that persists for one scene.' },
  { value: 'Mirror of Second Sight',         level: 3, description: 'Enchant a mirror to reflect the true forms of supernatural creatures — werewolves, mages, wraiths, and fae.' },
  { value: 'Mirror Walk',                    level: 3, description: 'Step through any mirror larger than your body and emerge from another you have previously seen.' },
  { value: 'Pavis of Foul Presence',         level: 3, description: 'Reverse any Presence power used on you back onto its caster until the next sunrise. Requires a blue silk cord.' },
  { value: 'Power of the Pyramid',           level: 3, description: 'Strengthen the Tremere hierarchy — bolster blood bonds within the clan structure.' },
  { value: 'Rutor\'s Hands',                 level: 3, description: 'Detach your hands and control them independently at a distance for one scene.' },
  { value: 'Sanguine Assistant',             level: 3, description: 'Conjure a one-foot-tall blood construct servant with your Abilities; lasts one night per success.' },
  { value: 'Shaft of Belated Quiescence',    level: 3, description: 'Enchant a rowan stake so the tip burrows toward the victim\'s heart over time after initial penetration.' },
  { value: 'Telecommunication',              level: 3, description: 'Transmit a brief telepathic message to any individual the caster has previously met.' },
  { value: 'Track Transgressor',             level: 3, description: 'Mystically track anyone who has broken a law or oath sworn before the caster.' },
  { value: 'Transubstantiation of Seven',    level: 3, description: 'Perform a ritual communion linking up to seven Tremere in shared awareness and purpose.' },
  { value: 'Ward versus Fae',                level: 3, description: 'Inscribe a ward that inflicts damage on fae creatures who touch the warded object.' },
  { value: 'Ward versus Lupines',            level: 3, description: 'Ward an object with silver dust to inflict three dice of lethal damage on any werewolf who touches it.' },
  // ——— Level 4 ———
  { value: 'Blood Certámen',                 level: 4, description: 'Initiate a formal magical duel between two thaumaturges, with supernatural consequences for the loser.' },
  { value: 'Bone of Lies',                   level: 4, description: 'Enchant a 200-year-old bone to compel truth; absorbs 10 lies before crumbling to uselessness.' },
  { value: 'Firewalker',                     level: 4, description: 'Cut off a fingertip to grant fire resistance — soak fire with Stamina (+ Fortitude if any) for one hour.' },
  { value: 'Heart of Stone',                 level: 4, description: 'Transmute your heart to solid rock — near-impervious to staking but Conscience and Empathy drop to 1.' },
  { value: 'Infirm Inert',                   level: 4, description: 'Render a supernatural object or enchantment temporarily powerless and inert.' },
  { value: 'Innocence of the Child\'s Heart', level: 4, description: 'Appear spiritually innocent to any form of supernatural detection for one night.' },
  { value: 'Mark of Amaranth',               level: 4, description: 'Brand a vampire with a visible mark that reveals them as having committed diablerie.' },
  { value: 'Protean Ward',                   level: 4, description: 'Ward an area against shapeshifters — any who enter take aggravated damage.' },
  { value: 'Rend the Mind',                  level: 4, description: 'Inflict a temporary derangement on a target through concentrated blood magic.' },
  { value: 'Return of the Heart',            level: 4, description: 'Mystically retrieve a heart that has been removed, returning it to the owner\'s body.' },
  { value: 'Scry',                            level: 4, description: 'Observe a distant location or person through a reflective surface using blood as a focus.' },
  { value: 'Soul of the Homunculus',         level: 4, description: 'Create a small, semi-independent homunculus that serves as a scout and spy.' },
  { value: 'Splinter Servant',              level: 4, description: 'Animate a wax-sealed rowan stake that leaps to life, attacks autonomously, and stakes the heart at difficulty 9.' },
  { value: 'Stolen Kisses',                  level: 4, description: 'Experience the sensations and memories from another vampire\'s most recent feeding.' },
  { value: 'The Curse Belated',              level: 4, description: 'Place a delayed curse that activates when specific conditions are met.' },
  { value: 'Unweave Ritual',                 level: 4, description: 'Unravel and dispel another thaumaturge\'s ritual, negating its effects.' },
  { value: 'Ward versus Kindred',            level: 4, description: 'Ward an object with your own blood to inflict three dice of lethal damage on any vampire who touches it.' },
  // ——— Level 5 ———
  { value: 'Abandon the Fetters',            level: 5, description: 'Sever all blood bonds affecting the caster or a willing subject permanently.' },
  { value: 'Blood Contract',                level: 5, description: 'Create an unbreakable blood-signed agreement enforced by supernatural compulsion; only voided by burning the document.' },
  { value: 'Cobra\'s Favor',                 level: 5, description: 'Enchant your blood to act as a deadly poison to anyone who consumes it.' },
  { value: 'Court of Hallowed Truth',        level: 5, description: 'Create a ritual space where no one present can speak falsehoods for the duration.' },
  { value: 'Enchant Talisman',              level: 5, description: 'Enchant a personal staff or weapon over a full moon cycle — grants +2 dice to primary path, +1 to rituals, and magical defence.' },
  { value: 'Escape to a True Friend',       level: 5, description: 'Teleport instantly to the person whose friendship you most value via a charred circle consecrated over six nights.' },
  { value: 'Ghost in the System',            level: 5, description: 'Erase all digital records and traces of a specific individual from electronic systems.' },
  { value: 'Night of the Red Heart',         level: 5, description: 'Perform a powerful ritual that reveals the location and identity of a vampire\'s sire.' },
  { value: 'Paper Flesh',                   level: 5, description: 'Reduce a target\'s Stamina and Fortitude to 1 for one night (higher-generation vampires retain extra points).' },
  { value: 'Sculpting the Perfect Servant',  level: 5, description: 'Create a permanent, loyal ghoul servant sculpted from raw materials and blood.' },
  { value: 'Severed Hand',                   level: 5, description: 'Animate a severed hand as an independent spy or assassin under the caster\'s control.' },
  { value: 'Stone of the True Form',         level: 5, description: 'Create a stone that forces a shapeshifted creature to revert to its true form on contact.' },
  { value: 'Stone Slumber',                  level: 5, description: 'Encase a vampire in stone, forcing them into torpor until the stone is broken.' },
  { value: 'Summon History',                 level: 5, description: 'Re-experience as a vision every event ever witnessed by a physical object.' },
  { value: 'The Bitter Envy',               level: 5, description: 'Curse a target so they are unable to use any Disciplines for one full night.' },
  { value: 'Vires Acquirit Eundo',           level: 5, description: 'A powerful enchantment that grows in strength the longer it persists, compounding its effects over time.' },
  { value: 'Ward versus Spirits',           level: 5, description: 'Ward an object with pure sea salt to inflict damage on spirits, including those given physical form.' },
  // ——— Level 6+ ———
  { value: 'Bone of Contention',             level: 6, description: 'Enchant a bone that sows discord and conflict among all Kindred in its vicinity.' },
  { value: 'Refined Digestion',              level: 6, description: 'Permanently alter your digestive processes to extract more sustenance from each blood point consumed.' },
  { value: 'Bone of Eternal Thirst',         level: 7, description: 'Enchant a bone that inflicts unquenchable supernatural hunger on any vampire who touches it.' },
  { value: 'Eyes of the Ever Vigilant',      level: 7, description: 'Create permanent mystical sentinels that watch over a location and alert the caster to intrusions.' },
  { value: 'Blade of the Forbidden Flower',  level: 8, description: 'Forge a weapon of immense thaumaturgical power capable of destroying even the most resilient supernatural beings.' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── Necromantic Rituals ────────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  // ——— Necromancy Level 1 ———
  { value: 'Call of the Hungry Dead',        level: 1, description: 'Open a channel to the Underworld, allowing whispers of the dead to be heard at a location for one hour.' },
  { value: 'Death\'s Communion',             level: 1, description: 'Commune briefly with the spirit world to receive cryptic answers about the recently deceased.' },
  { value: 'Eldritch Beacon',               level: 1, description: 'Mark a target with a mystical beacon visible to ghosts and spirits, drawing their attention.' },
  { value: 'Final Sight',                   level: 1, description: 'Touch the eyes of a corpse to see the last moments of its life as if through its own eyes.' },
  { value: 'Foxfire',                        level: 1, description: 'Conjure ghostly, cold flames that illuminate an area with eerie pale light visible to all.' },
  { value: 'Insight (Necromantic)',          level: 1, description: 'Meditate near a corpse to divine one fact about the circumstances of its death.' },
  { value: 'Knowing Stone',                 level: 1, description: 'Enchant a stone that grows warm in the presence of ghosts or spiritual disturbances.' },
  { value: 'Minestra di Morte',             level: 1, description: 'Brew a soup from graveyard soil and vitae that reveals secrets of the dead to those who consume it.' },
  { value: 'Preserve Corpse',               level: 1, description: 'Halt the decay of a corpse indefinitely, keeping it in its current state of decomposition.' },
  { value: 'Pull of the Grave',             level: 1, description: 'Weigh a subject down with the pull of death, making movement difficult and sluggish.' },
  { value: 'Ritual of the Smoking Mirror',  level: 1, description: 'Use an obsidian mirror to glimpse through the Shroud and observe the Shadowlands briefly.' },
  { value: 'Word of Insight',               level: 1, description: 'Speak a word of power to force a ghost to reveal one truth about itself or its bindings.' },
  // ——— Necromancy Level 2 ———
  { value: 'Antonius\'s Denial',            level: 2, description: 'Deny a ghost the ability to use one of its powers for the remainder of the night.' },
  { value: 'Clarion Call to the Loyal',     level: 2, description: 'Send a mystical summons to all wraiths bound to the necromancer, calling them to their location.' },
  { value: 'Draining the Well of Life',     level: 2, description: 'Drain the life force from a small area, making plants wilt and living creatures feel uneasy.' },
  { value: 'Eyes of the Grave',             level: 2, description: 'Grant the ability to see ghosts and spiritual entities for one night without using a path power.' },
  { value: 'Generation of the Acheron Vortex', level: 2, description: 'Create a small whirlpool of ghostly energy that pulls nearby wraiths toward it.' },
  { value: 'Hand of Glory (Necromantic)',    level: 2, description: 'Enchant a severed hand to emit a paralyzing aura that freezes mortals who behold its flame.' },
  { value: 'Haunting Breeze',               level: 2, description: 'Summon a cold, moaning wind that disturbs mortals and agitates ghosts in the area.' },
  { value: 'Memento Mori',                  level: 2, description: 'Enchant an object belonging to a dead person so it causes visions of death to those who touch it.' },
  { value: 'Parting the Veil',              level: 2, description: 'Temporarily thin the Shroud in an area, making it easier for ghosts to manifest and interact.' },
  { value: 'Thanatos\' Caress',             level: 2, description: 'Enchant a weapon so its strikes can harm wraiths as well as the living.' },
  { value: 'The Hand of Glory',             level: 2, description: 'Create a candle from a corpse\'s hand that reveals hidden doors and puts mortals to sleep.' },
  { value: 'Occhio d\'Uomo Morto',          level: 2, description: 'Remove and enchant the eye of a corpse to see through the Shroud when held to one\'s own eye.' },
  { value: 'Prepare the Vessel',            level: 2, description: 'Prepare a corpse as a suitable vessel for spiritual inhabitation or necromantic animation.' },
  { value: 'Puppet',                        level: 2, description: 'Animate a corpse as a crude puppet, controllable for basic movements and speech.' },
  { value: 'The Ritual of Pochtli',         level: 2, description: 'A blood sacrifice that creates a mystical anchor, binding a ghost to the mortal world more firmly.' },
  { value: 'Totenpass',                     level: 2, description: 'Create a token that grants safe passage through the Underworld to the bearer.' },
  { value: 'Two Centimes',                  level: 2, description: 'Place enchanted coins on a corpse\'s eyes to prevent its ghost from returning to the mortal world.' },
  { value: 'Witch Eye',                     level: 2, description: 'Enchant an eye to perceive necromantic auras, ghosts, and spiritual residue in the area.' },
  // ——— Necromancy Level 3 ———
  { value: 'Blessing of Valhalla',          level: 3, description: 'Enchant a warrior so their ghost rises as a powerful spirit if they die in battle within the night.' },
  { value: 'Blood Dance',                   level: 3, description: 'Perform a ritual dance with vitae to strengthen the bond between a ghost and its fetter.' },
  { value: 'Death\'s Head',                 level: 3, description: 'Enchant a skull to serve as a mystical alarm, screaming when intruders enter the warded area.' },
  { value: 'Divine Sign',                   level: 3, description: 'Receive a cryptic omen about a future event connected to death or the Underworld.' },
  { value: 'Din of the Damned',             level: 3, description: 'Create a cacophony of ghostly wails that disorients and terrifies everyone in the area.' },
  { value: 'Nightmare Drums',               level: 3, description: 'Beat enchanted drums to send terrifying nightmares to all sleepers within earshot.' },
  { value: 'Ritual of the Unearthed Fetter', level: 3, description: 'Discover a ghost\'s fetters by performing a ritual over its remains or a known fetter.' },
  { value: 'Tempesta Scudo',                level: 3, description: 'Create a mystical shield against the storms of the Underworld, protecting from Spectres.' },
  { value: 'Tempest Prison',                level: 3, description: 'Trap a ghost within a specially prepared object, imprisoning it until the object is destroyed.' },
  // ——— Necromancy Level 4 ———
  { value: 'Baleful Doll',                  level: 4, description: 'Create a voodoo doll linked to a ghost, allowing you to inflict pain and compel obedience.' },
  { value: 'Bastone Diabolico',             level: 4, description: 'Enchant a staff to channel necromantic power, enhancing path abilities when wielded.' },
  { value: 'Cadaver\'s Touch',              level: 4, description: 'Cause a target to feel the cold grip of death, inducing paralysis and terror.' },
  { value: 'Impregnable Soul',              level: 4, description: 'Ward a target\'s soul against possession, ghostly influence, and spiritual attacks.' },
  { value: 'Lure of Elysium',               level: 4, description: 'Draw all wraiths in the area to a specific location, creating an irresistible pull.' },
  { value: 'Peek Past the Shroud',          level: 4, description: 'Tear a small window in the Shroud, allowing physical objects to pass briefly between worlds.' },
  { value: 'Point of the Needle',           level: 4, description: 'Enchant a needle that, when driven into a corpse, forces any attached ghost to appear.' },
  { value: 'Ritual of Xipe Totec',          level: 4, description: 'Wear the skin of the dead to assume their appearance and fool both the living and ghosts.' },
  { value: 'Summon Ethereal Horde',         level: 4, description: 'Call forth a swarm of minor ghosts to overwhelm and distract enemies.' },
  { value: 'Vision of St. Anthony',         level: 4, description: 'Grant a mortal true sight into the Underworld for one scene, at the cost of their sanity.' },
  { value: 'Weighing of the Heart',         level: 4, description: 'Judge a ghost\'s moral weight, determining the strength of its ties to the living world.' },
  // ——— Necromancy Level 5 ———
  { value: 'Chill of Oblivion',             level: 5, description: 'Radiate the cold of the void, inflicting aggravated damage on all living and undead creatures nearby.' },
  { value: 'Dead Man\'s Hand',              level: 5, description: 'Enchant a severed hand to act as a powerful necromantic focus that amplifies all death magic.' },
  { value: 'Enochian Passage',              level: 5, description: 'Open a stable doorway between the mortal world and the Underworld that lasts for one scene.' },
  { value: 'Esilio',                        level: 5, description: 'Banish a ghost to the deepest reaches of the Underworld, possibly destroying it permanently.' },
  { value: 'Grasp the Ghostly',             level: 5, description: 'Grant yourself or another the ability to physically interact with ghosts for one scene.' },
  { value: 'Invocation of the Maelstrom',   level: 5, description: 'Summon a devastating storm in the Underworld that tears at all ghosts and spiritual structures.' },
  { value: 'The Ferryman\'s Recall',        level: 5, description: 'Call back a ghost that has been banished or destroyed, reconstituting it from the void.' },
  { value: 'Orphic Sojourn',                level: 5, description: 'Project your consciousness into the Underworld while your body remains in the mortal world.' },
  { value: 'Restoration of Styx',           level: 5, description: 'Repair damage to the Shroud or reinforce it in an area, blocking ghostly intrusions.' },
  { value: 'Treasures of Hades',            level: 5, description: 'Reach into the Underworld to retrieve ghostly objects and bring them into the mortal world.' },
  // ——— Necromancy Level 6 ———
  { value: 'Ghost Town',                    level: 6, description: 'Transform an entire area into a nexus between worlds where ghosts and the living coexist freely.' },
  { value: 'Lazarus Rises',                 level: 6, description: 'Restore a ghost to full life temporarily, giving it a physical body for one night.' },
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
]

const BACKGROUNDS = [
  { value: 'Allies', description: 'Mortals or organisations that actively support and assist you when called upon.',
    levels: [
      '●  A single contact who can provide minor favours on request.',
      '●● A small group that assists in limited but genuinely useful ways.',
      '●●● A reliable organisation with significant reach and resources.',
      '●●●● Multiple groups across several fields, consistently available to you.',
      '●●●●● Powerful allies with broad influence who answer your call reliably and swiftly.',
    ] },
  { value: 'Alternate Identity', description: 'A secondary persona with documentation, history, and a separate social presence.',
    levels: [
      '●  A basic false name with minimal, barely passable documentation.',
      '●● A solid identity with ID, cards, and a brief but credible history.',
      '●●● A thoroughly documented identity with an established background and references.',
      '●●●● A deep-cover identity indistinguishable from a real person\'s complete life.',
      '●●●●● Multiple airtight identities, each with its own history, contacts, and assets.',
    ] },
  { value: 'Contacts', description: 'A network of information sources spread across mortal and Kindred society.',
    levels: [
      '●  One or two people who share information in a single field.',
      '●● A small network spanning a couple of different fields.',
      '●●● A reliable web of informants across several areas of mortal life.',
      '●●●● A broad network with sources in most walks of life.',
      '●●●●● An extensive intelligence network covering virtually any field you need.',
    ] },
  { value: 'Domain', description: 'Territory you control where you have the right to feed and conduct your affairs.',
    levels: [
      '●  A small, marginal area with limited and contested feeding rights.',
      '●● A modest territory with adequate and defensible feeding grounds.',
      '●●● A well-established domain with recognised Kindred boundaries.',
      '●●●● A substantial territory with strong political recognition in the city.',
      '●●●●● A significant domain granting considerable political leverage over the city.',
    ] },
  { value: 'Fame', description: 'Public recognition and celebrity that opens doors — and attracts attention.',
    levels: [
      '●  Recognised by enthusiasts in a small niche or local community.',
      '●● Known locally; recognised on the street within your city.',
      '●●● Regional celebrity; featured in media and widely known.',
      '●●●● National prominence; your name and face appear in mainstream media.',
      '●●●●● International fame; instantly recognised almost anywhere in the world.',
    ] },
  { value: 'Generation', description: 'The thinness of your blood and your proximity to Caine in the lineage.',
    levels: [
      '●  12th generation — blood pool 11.',
      '●● 11th generation — blood pool 12.',
      '●●● 10th generation — blood pool 13.',
      '●●●● 9th generation — blood pool 14, spend 2 blood per turn.',
      '●●●●● 8th generation — blood pool 15, spend 3 blood per turn.',
    ] },
  { value: 'Herd', description: 'Mortals who willingly provide blood on a regular basis.',
    levels: [
      '●  Two or three mortals who feed you willingly on occasion.',
      '●● A small but reliable group of half a dozen vessels.',
      '●●● A dependable herd of around a dozen; feeding is rarely difficult.',
      '●●●● A large herd providing consistent and convenient access to blood.',
      '●●●●● A devoted flock; you virtually never want for blood.',
    ] },
  { value: 'Influence', description: 'Power within mortal institutions — government, media, finance, crime.',
    levels: [
      '●  Minor pull in one institution; can call in small favours.',
      '●● Reliable leverage in a couple of organisations.',
      '●●● Significant sway in several institutions; shape local policies.',
      '●●●● Major power across multiple sectors; affect regional or national events.',
      '●●●●● Commanding influence across broad swaths of mortal society.',
    ] },
  { value: 'Mentor', description: 'An elder Kindred who guides, advises, and occasionally intervenes on your behalf.',
    levels: [
      '●  An elder who occasionally offers advice but has little real power.',
      '●● A capable Kindred who actively supports and guides you.',
      '●●● A powerful Kindred with real political influence who watches over you.',
      '●●●● An elder of considerable status who intervenes when genuinely needed.',
      '●●●●● An ancient whose favour grants significant protection and opens many doors.',
    ] },
  { value: 'Resources', description: 'Wealth, assets, property, and the financial power to sustain your unlife.',
    levels: [
      '●  Small savings; enough to live modestly without working.',
      '●● Comfortable; equivalent to a solid middle-class income and lifestyle.',
      '●●● Affluent; access to significant cash, property, and investments.',
      '●●●● Wealthy; major assets and a lavish lifestyle with few financial limits.',
      '●●●●● Vast wealth; effectively unlimited financial resources.',
    ] },
  { value: 'Retainers', description: 'Loyal servants — ghouls, thralls, or devoted mortals — who carry out your will.',
    levels: [
      '●  One loyal assistant with basic useful skills.',
      '●● A couple of reliable servants covering different practical needs.',
      '●●● Several capable retainers, at least one skilled in a useful specialty.',
      '●●●● A staff of loyal servants covering most practical needs reliably.',
      '●●●●● A household of devoted retainers including highly skilled specialists.',
    ] },
  { value: 'Status', description: 'Your reputation and standing within the formal hierarchy of Kindred society.',
    levels: [
      '●  Known and acknowledged within the local Kindred community.',
      '●● Respected; your opinions are heard and given genuine consideration.',
      '●●● Significant standing; you hold or have held recognised office.',
      '●●●● High esteem; one of the notable Kindred in the city.',
      '●●●●● Pillar of Kindred society; your word carries great weight across the sect.',
    ] },
  { value: 'Haven', description: 'The safety and secrecy of your primary resting place.',
    levels: [
      '●  A cramped, insecure space — a car trunk, an attic, or a public squat.',
      '●● A basic but private location — a rented room or basement apartment.',
      '●●● A comfortable, secure dwelling with controlled access.',
      '●●●● A well-appointed haven with multiple entry points and escape routes.',
      '●●●●● A fortified, luxurious retreat virtually impervious to casual discovery.',
    ] },
  { value: 'Haven Security', description: 'Physical defences, alarms, and countermeasures protecting your haven.',
    levels: [
      '●  Basic locks and a simple alarm system.',
      '●● Reinforced doors, security cameras, and a monitored alarm.',
      '●●● Armed guards, electronic surveillance, and hardened entry points.',
      '●●●● Military-grade security with redundant systems and rapid response.',
      '●●●●● A fortress — virtually impenetrable to any conventional assault.',
    ] },
  { value: 'Haven Luxury', description: 'The comfort, amenities, and opulence of your haven.',
    levels: [
      '●  Spartan but liveable — running water, basic furniture.',
      '●● Comfortable — decent furnishings, entertainment, and a functional kitchen.',
      '●●● Upscale — stylish décor, quality amenities, and pleasant surroundings.',
      '●●●● Luxurious — fine art, designer furnishings, and every modern convenience.',
      '●●●●● Palatial — a residence of breathtaking opulence and grandeur.',
    ] },
  { value: 'Haven Size', description: 'The physical extent and number of rooms in your haven.',
    levels: [
      '●  A single room — a studio or a converted closet.',
      '●● A small apartment — a couple of rooms and basic facilities.',
      '●●● A spacious home — several rooms, storage, and guest space.',
      '●●●● A large estate — multiple floors, wings, or outbuildings.',
      '●●●●● A compound — a mansion, warehouse complex, or underground network.',
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
  const onBack = () => __navigate('/')
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
  const [xpSubTab, setXpSubTab] = useState(0)
  const [newXpEntry, setNewXpEntry] = useState({ type: 'XP', amount: 1, category: 'Earned', description: '' })
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [actionError, setActionError] = useState(null)

  const [searchParams] = __useSearchParams()
  const guidedMode = searchParams.get('mode') === 'guided'
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

  async function handleAddXpEntry() {
    if (!newXpEntry.description.trim()) return
    try {
      const entry = { ...newXpEntry }
      if (entry.category !== 'Earned') entry.amount = -Math.abs(entry.amount)
      else entry.amount = Math.abs(entry.amount)
      const res = await addXpLogEntry(characterId, entry)
      setXpLog(prev => [res.data, ...prev])
      setNewXpEntry({ type: xpSubTab === 0 ? 'XP' : 'FREEBIE', amount: 1, category: 'Earned', description: '' })
    } catch { setActionError(t('failedToSave')) }
  }

  async function handleRemoveXpEntry(entryId) {
    try {
      await removeXpLogEntry(characterId, entryId)
      setXpLog(prev => prev.filter(e => e.id !== entryId))
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
    <section aria-labelledby="form-heading">
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
                <input id="derangement1" name="derangement1" type="text" value={fields.derangement1} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="derangement2">{t('derangement')}</label>
                <input id="derangement2" name="derangement2" type="text" value={fields.derangement2} onChange={handleText} autoComplete="off" />
              </div>
            </div>
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
                  <input type="text" value={newCombo.name} onChange={e => setNewCombo(p => ({ ...p, name: e.target.value }))} placeholder={t('phComboName')} />
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
        <div className="form-section">
              <div role="tablist" className="tab-list">
                <button role="tab" className={`btn btn-secondary tab-btn${xpSubTab === 0 ? ' tab-btn--active' : ''}`}
                  onClick={() => { setXpSubTab(0); setNewXpEntry(e => ({ ...e, type: 'XP', category: 'Earned' })) }}>
                  {t('xpTab')}
                </button>
                <button role="tab" className={`btn btn-secondary tab-btn${xpSubTab === 1 ? ' tab-btn--active' : ''}`}
                  onClick={() => { setXpSubTab(1); setNewXpEntry(e => ({ ...e, type: 'FREEBIE', category: 'Earned' })) }}>
                  {t('freebieTab')}
                </button>
              </div>

              {/* Summary */}
              {(() => {
                const entries = xpLog.filter(e => e.type === (xpSubTab === 0 ? 'XP' : 'FREEBIE'))
                const starting = xpSubTab === 1 ? 15 : 0
                const totalEarned = entries.filter(e => e.amount > 0).reduce((s, e) => s + e.amount, 0) + starting
                const totalSpent = entries.filter(e => e.amount < 0).reduce((s, e) => s + Math.abs(e.amount), 0)
                const available = totalEarned - totalSpent

                return (
                  <>
                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                      <div><strong>{xpSubTab === 0 ? t('totalXP') : t('totalFreebies')}:</strong> {totalEarned}</div>
                      <div><strong>{t('spent')}:</strong> {totalSpent}</div>
                      <div><strong>{xpSubTab === 0 ? t('availableXP') : t('availableFreebies')}:</strong> <span style={{ color: available >= 0 ? '#8c8' : '#e55', fontWeight: 700 }}>{available}</span></div>
                    </div>

                    {xpSubTab === 1 && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '1rem', lineHeight: 1.8 }}>
                        <strong>{t('freebieStarting')}</strong><br/>
                        {t('freebieAttrCost')} · {t('freebieAbilCost')} · {t('freebieDiscCost')} · {t('freebieBgCost')}<br/>
                        {t('freebieVirtueCost')} · {t('freebieWpCost')} · {t('freebiePathCost')}
                      </div>
                    )}

                    {/* Add entry form */}
                    <div className="field-row" style={{ marginBottom: '1rem' }}>
                      <div className="field" style={{ maxWidth: 80 }}>
                        <label>{t('amount')}</label>
                        <input type="number" min="1" value={newXpEntry.amount} onChange={e => setNewXpEntry(p => ({ ...p, amount: parseInt(e.target.value) || 1 }))} />
                      </div>
                      <div className="field">
                        <label>{t('xpCategory')}</label>
                        <select value={newXpEntry.category} onChange={e => setNewXpEntry(p => ({ ...p, category: e.target.value }))}>
                          <option value="Earned">{t('catEarned')}</option>
                          <option value="Attribute">{t('catAttribute')}</option>
                          <option value="Ability">{t('catAbility')}</option>
                          <option value="Discipline">{t('catDiscipline')}</option>
                          <option value="Background">{t('catBackground')}</option>
                          <option value="Virtue">{t('catVirtue')}</option>
                          <option value="Willpower">{t('catWillpower')}</option>
                          <option value="Humanity/Path">{t('catHumanity')}</option>
                          <option value="Other">{t('catOther')}</option>
                        </select>
                      </div>
                      <div className="field" style={{ flex: 2 }}>
                        <label>{t('xpDescription')}</label>
                        <input type="text" value={newXpEntry.description} onChange={e => setNewXpEntry(p => ({ ...p, description: e.target.value }))} placeholder={xpSubTab === 0 ? 'e.g. Session reward' : 'e.g. +1 Strength'} />
                      </div>
                      <button className="btn btn-secondary" style={{ alignSelf: 'flex-end' }} onClick={handleAddXpEntry}>{t('addEntry')}</button>
                    </div>

                    {/* Entries list */}
                    {entries.length === 0 && <p className="muted-hint">{xpSubTab === 0 ? t('noXpEntries') : t('noFreebieEntries')}</p>}
                    {entries.length > 0 && (
                      <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                            <th style={{ padding: '0.4rem' }}>{t('xpDate')}</th>
                            <th style={{ padding: '0.4rem' }}>{t('xpCategory')}</th>
                            <th style={{ padding: '0.4rem' }}>{t('xpDescription')}</th>
                            <th style={{ padding: '0.4rem', textAlign: 'right' }}>{t('amount')}</th>
                            <th style={{ padding: '0.4rem' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {entries.map(e => (
                            <tr key={e.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                              <td style={{ padding: '0.4rem', whiteSpace: 'nowrap' }}>{new Date(e.createdAt).toLocaleDateString()}</td>
                              <td style={{ padding: '0.4rem' }}>{t(`cat${e.category}`) || e.category}</td>
                              <td style={{ padding: '0.4rem' }}>{e.description}</td>
                              <td style={{ padding: '0.4rem', textAlign: 'right', fontWeight: 600, color: e.amount > 0 ? '#8c8' : '#e55' }}>
                                {e.amount > 0 ? '+' : ''}{e.amount}
                              </td>
                              <td style={{ padding: '0.4rem' }}>
                                <button className="btn btn-danger btn-sm" onClick={() => handleRemoveXpEntry(e.id)} style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}>&#x2715;</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </>
                )
              })()}
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={onBack}>{t('cancel')}</button>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving || validationErrors.length > 0}
          title={validationErrors.length > 0 ? validationErrors.join(' ') : undefined}
        >
          {saving ? t('saving') : t('saveChanges')}
        </button>
      </div>
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
