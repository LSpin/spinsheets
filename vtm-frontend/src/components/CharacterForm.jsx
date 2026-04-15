import { useState, useEffect, useRef } from 'react'
import { useParams as __useParams, useNavigate as __useNavigate } from 'react-router-dom'
import {
  getCharacter, createCharacter, updateCharacter,
  getDisciplines, addDiscipline, removeDiscipline,
  getBackgrounds, addBackground, removeBackground,
  getMerits, addMerit, removeMerit,
  getFlaws, addFlaw, removeFlaw,
  getMeritCatalog, getFlawCatalog,
  getInventory, addInventoryItem, removeInventoryItem,
  getSorceryPaths, addSorceryPath, removeSorceryPath,
  getRituals, addRitual, removeRitual,
} from '../api/characterApi'
import DotRating from './DotRating'

// ── Constants ─────────────────────────────────────────────────────────────────

const TABS = ['Identity', 'Attributes', 'Abilities', 'Advantages', 'Disciplines & Backgrounds', 'Merits & Flaws', 'Inventory', 'Blood Sorcery']

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
  { value: 'Baali',                   curse: 'Infernalist taint — any vampire with even one dot of True Faith automatically senses the Baali\'s corruption on sight. Holy ground deals aggravated damage to them and faith-based powers affect them more severely than other Kindred.' },
  { value: 'Daughters of Cacophony',  curse: 'Their own Melpominee powers can turn inward. When using their voice to affect others\' emotions, they must make a Willpower roll (Diff 6) or also experience the emotion they are projecting, potentially losing control.' },
  { value: 'Gargoyle',                curse: 'Bound by Tremere Thaumaturgy as eternal guardians. They suffer a supernatural compulsion to protect Tremere chantries and obey Tremere commands. Breaking free requires an exceptional act of will and story-level sacrifice.' },
  { value: 'Harbingers of Skulls',    curse: 'Like the Giovanni, their Kiss deals double damage and provides no pleasure whatsoever. They also radiate an aura of death; mortals and animals flee from them instinctively and they receive −2 to Social pools in mundane interaction.' },
  { value: 'Kiasyd',                  curse: 'Their fae blood makes them vulnerable to cold iron — it deals aggravated damage on contact. Their alien appearance and disturbing presence imposes −2 to Social dice pools with ordinary mortals and many Kindred.' },
  { value: 'Nagaraja',                curse: 'Must consume human flesh as well as blood. Without flesh, they suffer cumulative dice pool penalties each night. Their bite tears rather than seduces, providing none of the Kiss\'s social camouflage.' },
  { value: 'Salubri',                 curse: 'A third eye opens in the centre of their forehead whenever they use Disciplines — impossible to hide. Every Kindred feels a Tremere-implanted supernatural compulsion to hunt and diablerize the Salubri on sight.' },
  { value: 'Samedi',                  curse: 'Appear as rotting, desiccated corpses regardless of age or power. Appearance cannot exceed 0. All Social rolls except Intimidation suffer +1 difficulty, identical to Nosferatu. They cannot pass for living under any normal circumstances.' },
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
  { label: 'Healthy',       penalty: '' },
  { label: 'Bruised',       penalty: '(no penalty)' },
  { label: 'Hurt',          penalty: '−1' },
  { label: 'Injured',       penalty: '−1' },
  { label: 'Wounded',       penalty: '−2' },
  { label: 'Mauled',        penalty: '−2' },
  { label: 'Crippled',      penalty: '−5' },
  { label: 'Incapacitated', penalty: '' },
  { label: 'Torpor',        penalty: '' },
  { label: 'Final Death',   penalty: '' },
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
  // Skills
  animalKen: 0, crafts: 0, drive: 0, etiquette: 0, firearms: 0,
  larceny: 0, melee: 0, performance: 0, stealth: 0, survival: 0,
  profSkill1Name: '', profSkill1: 0,
  profSkill2Name: '', profSkill2: 0,
  profSkill3Name: '', profSkill3: 0,
  // Knowledges
  academics: 0, computer: 0, finance: 0, investigation: 0, law: 0,
  linguistics: 0, medicine: 0, occult: 0, politics: 0, science: 0, technology: 0,
  expertKnowl1Name: '', expertKnowl1: 0,
  expertKnowl2Name: '', expertKnowl2: 0,
  expertKnowl3Name: '', expertKnowl3: 0,
  // Specialties
  expressionSpec: '', academicsSpec: '', lawSpec: '',
  craftsSpec: '', performanceSpec: '', scienceSpec: '', technologySpec: '',
  // Virtues & Path
  conscience: 1, selfControl: 1, courage: 1,
  pathName: 'Humanity', pathRating: 2,
  willpower: 3, currentWillpower: 3,
  // Blood & Health
  currentBlood: 10, woundLevel: 0,
  // Misc
  derangement1: '', derangement2: '',
  clanCurse: '', notes: '',
}

// ── Validation ────────────────────────────────────────────────────────────────

function validate(fields) {
  const errors = []
  const warnings = []

  if (!fields.name.trim()) errors.push('Name is required.')
  if (!fields.clan.trim()) warnings.push('Clan is not set.')

  const gen = fields.generation
  if (!gen || gen < 4 || gen > 15) errors.push('Generation must be between 4 and 15.')

  const isHumanity = fields.pathName.trim().toLowerCase() === 'humanity'
  if (isHumanity) {
    const expected = fields.conscience + fields.selfControl
    if (fields.pathRating !== expected)
      warnings.push(`Humanity rating should equal Conscience + Self-Control (${expected}).`)
  }

  const { max } = bloodStats(gen)
  if (fields.currentBlood > max) errors.push(`Blood pool cannot exceed ${max} for generation ${gen}.`)
  if (fields.currentWillpower > fields.willpower) errors.push('Current Willpower cannot exceed maximum Willpower.')

  const customAbilities = [
    [fields.hobbyTalent1Name, fields.hobbyTalent1, 'Hobby Talent 1'],
    [fields.hobbyTalent2Name, fields.hobbyTalent2, 'Hobby Talent 2'],
    [fields.hobbyTalent3Name, fields.hobbyTalent3, 'Hobby Talent 3'],
    [fields.profSkill1Name, fields.profSkill1, 'Prof. Skill 1'],
    [fields.profSkill2Name, fields.profSkill2, 'Prof. Skill 2'],
    [fields.profSkill3Name, fields.profSkill3, 'Prof. Skill 3'],
    [fields.expertKnowl1Name, fields.expertKnowl1, 'Expert Knowl. 1'],
    [fields.expertKnowl2Name, fields.expertKnowl2, 'Expert Knowl. 2'],
    [fields.expertKnowl3Name, fields.expertKnowl3, 'Expert Knowl. 3'],
  ]
  for (const [nameVal, rating, label] of customAbilities) {
    if (rating > 0 && !nameVal.trim()) warnings.push(`${label} has a rating but no name.`)
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

// ── Component ─────────────────────────────────────────────────────────────────

export default function CharacterForm() {
  const { id: paramId } = __useParams()
  const __navigate = __useNavigate()
  const characterId = paramId ? Number(paramId) : null
  const onBack = () => __navigate('/')
  const onCreated = (id) => __navigate(`/characters/${id}`)
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
  const [sorceryPaths, setSorceryPaths] = useState([])
  const [rituals, setRituals] = useState([])
  const [newPath, setNewPath] = useState({ name: '', level: 1 })
  const [newRitual, setNewRitual] = useState({ name: '', level: 1, notes: '' })
  const [sorcInfo, setSorcInfo] = useState(null)
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [actionError, setActionError] = useState(null)

  const isEdit = !!characterId
  const { max: maxBlood, perTurn } = bloodStats(fields.generation)
  const isHumanity = fields.pathName.trim().toLowerCase() === 'humanity'
  const computedPath = fields.conscience + fields.selfControl
  const { errors: validationErrors, warnings: validationWarnings } = validate(fields)

  useEffect(() => {
    if (isEdit) loadCharacter()
    loadCatalogs()
  }, [characterId])

  async function loadCharacter() {
    try {
      const [charRes, discRes, bgRes, meritRes, flawRes, invRes, pathRes, ritRes] = await Promise.all([
        getCharacter(characterId),
        getDisciplines(characterId),
        getBackgrounds(characterId),
        getMerits(characterId),
        getFlaws(characterId),
        getInventory(characterId),
        getSorceryPaths(characterId),
        getRituals(characterId),
      ])
      setFields(prev => ({ ...INITIAL, ...charRes.data }))
      setDisciplines(discRes.data)
      setBackgrounds(bgRes.data)
      setMerits(meritRes.data)
      setFlaws(flawRes.data)
      setInventory(invRes.data)
      setSorceryPaths(pathRes.data)
      setRituals(ritRes.data)
    } catch {
      setSaveError('Failed to load character.')
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
      setActionError('Failed to load merit/flaw catalog.')
    }
  }

  function handleField(name, value) {
    setFields(prev => {
      const next = { ...prev, [name]: value }
      // Auto-sync Humanity path rating
      if ((name === 'conscience' || name === 'selfControl') &&
          next.pathName.trim().toLowerCase() === 'humanity') {
        next.pathRating = next.conscience + next.selfControl
      }
      if (name === 'pathName' && value.trim().toLowerCase() === 'humanity') {
        next.pathRating = next.conscience + next.selfControl
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
      if (isEdit) {
        await updateCharacter(characterId, fields)
        onBack()
      } else {
        const res = await createCharacter(fields)
        onCreated(res.data.id)
      }
    } catch {
      setSaveError('Failed to save character.')
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
    } catch { setActionError('Failed to add discipline.') }
  }

  async function handleRemoveDiscipline(id) {
    try {
      await removeDiscipline(characterId, id)
      setDisciplines(prev => prev.filter(d => d.id !== id))
    } catch { setActionError('Failed to remove discipline.') }
  }

  // Background handlers
  async function handleAddBackground() {
    if (!newBackground.name.trim()) return
    try {
      const res = await addBackground(characterId, newBackground)
      setBackgrounds(prev => [...prev, res.data])
      setNewBackground({ name: '', level: 1, description: '' })
    } catch { setActionError('Failed to add background.') }
  }

  async function handleRemoveBackground(id) {
    try {
      await removeBackground(characterId, id)
      setBackgrounds(prev => prev.filter(b => b.id !== id))
    } catch { setActionError('Failed to remove background.') }
  }

  // Merit / Flaw handlers
  async function handleAddMerit(merit) {
    try {
      const res = await addMerit(characterId, { meritId: merit.id, pointsSpent: merit.cost })
      setMerits(prev => [...prev, res.data])
    } catch { setActionError('Failed to add merit.') }
  }

  async function handleRemoveMerit(id) {
    try {
      await removeMerit(characterId, id)
      setMerits(prev => prev.filter(m => m.id !== id))
    } catch { setActionError('Failed to remove merit.') }
  }

  async function handleAddFlaw(flaw) {
    try {
      const res = await addFlaw(characterId, { flawId: flaw.id, pointsGained: flaw.bonus })
      setFlaws(prev => [...prev, res.data])
    } catch { setActionError('Failed to add flaw.') }
  }

  async function handleRemoveFlaw(id) {
    try {
      await removeFlaw(characterId, id)
      setFlaws(prev => prev.filter(f => f.id !== id))
    } catch { setActionError('Failed to remove flaw.') }
  }

  // Inventory handlers
  async function handleAddItem() {
    if (!newItem.name.trim()) return
    try {
      const res = await addInventoryItem(characterId, newItem)
      setInventory(prev => [...prev, res.data])
      setNewItem({ name: '', category: 'EQUIPMENT', quantity: 1, damage: '', concealment: '', range: '', rate: '', clip: '', armorRating: null, handling: null, structure: null, notes: '' })
    } catch { setActionError('Failed to add item.') }
  }

  async function handleRemoveItem(id) {
    try {
      await removeInventoryItem(characterId, id)
      setInventory(prev => prev.filter(i => i.id !== id))
    } catch { setActionError('Failed to remove item.') }
  }

  // Sorcery handlers
  async function handleAddPath() {
    if (!newPath.name.trim()) return
    try {
      const res = await addSorceryPath(characterId, newPath)
      setSorceryPaths(prev => [...prev, res.data])
      setNewPath({ name: '', level: 1 })
    } catch { setActionError('Failed to add path.') }
  }

  async function handleRemovePath(id) {
    try {
      await removeSorceryPath(characterId, id)
      setSorceryPaths(prev => prev.filter(p => p.id !== id))
      if (sorcInfo?.id === id) setSorcInfo(null)
    } catch { setActionError('Failed to remove path.') }
  }

  async function handleAddRitual() {
    if (!newRitual.name.trim()) return
    try {
      const res = await addRitual(characterId, newRitual)
      setRituals(prev => [...prev, res.data])
      setNewRitual({ name: '', level: 1, notes: '' })
    } catch { setActionError('Failed to add ritual.') }
  }

  async function handleRemoveRitual(id) {
    try {
      await removeRitual(characterId, id)
      setRituals(prev => prev.filter(r => r.id !== id))
      if (sorcInfo?.id === id) setSorcInfo(null)
    } catch { setActionError('Failed to remove ritual.') }
  }

  const filteredMerits = meritCatalog.filter(m => m.name.toLowerCase().includes(meritSearch.toLowerCase()))
  const filteredFlaws  = flawCatalog.filter(f => f.name.toLowerCase().includes(flawSearch.toLowerCase()))

  if (loading) return <p className="status-loading" aria-live="polite">Loading…</p>

  // ── Render helpers ─────────────────────────────────────────────────────────

  function RatingRow({ abilityKey, labelText, specKey }) {
    return (
      <div className="ability-row">
        <DotRating label={labelText ?? label(abilityKey)} name={abilityKey} value={fields[abilityKey]} onChange={handleField} />
        {specKey && (fields[abilityKey] >= 4 || specKey) && (
          <input
            className="spec-input"
            type="text"
            name={specKey}
            value={fields[specKey] ?? ''}
            onChange={handleText}
            placeholder="Specialty"
            aria-label={`${labelText ?? label(abilityKey)} specialty`}
          />
        )}
      </div>
    )
  }

  function CustomAbilityRow({ nameProp, ratingProp, placeholder }) {
    return (
      <div className="custom-ability-row">
        <input
          type="text"
          name={nameProp}
          value={fields[nameProp]}
          onChange={handleText}
          placeholder={placeholder}
          aria-label={`${placeholder} name`}
          className="custom-ability-name"
        />
        <DotRating label="" name={ratingProp} value={fields[ratingProp]} onChange={handleField} />
      </div>
    )
  }

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
        <button className="btn btn-secondary" onClick={onBack}>← Back</button>
        <h2 id="form-heading">{isEdit ? `Edit — ${fields.name || 'Character'}` : 'New Character'}</h2>
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}
      {actionError && <p className="status-error" role="alert">{actionError}</p>}

      {validationWarnings.length > 0 && (
        <ul className="status-warning" role="note">
          {validationWarnings.map(w => <li key={w}>{w}</li>)}
        </ul>
      )}

      <div role="tablist" aria-label="Character sheet sections" className="tab-list">
        {TABS.map((t, i) => (
          <button
            key={t} role="tab" id={`tab-${i}`}
            aria-selected={tab === i} aria-controls={`tabpanel-${i}`}
            className={`btn btn-secondary tab-btn${tab === i ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(i)}
          >{t}</button>
        ))}
      </div>

      {/* ── Identity ── */}
      <div role="tabpanel" id="tabpanel-0" aria-labelledby="tab-0" hidden={tab !== 0}>
        <div className="form-section">
          <fieldset>
            <legend>Identity</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="name">Name (True Name) <span aria-hidden="true">*</span></label>
                <input id="name" name="name" type="text" value={fields.name} onChange={handleText} required autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="altName">Alt Name</label>
                <input id="altName" name="altName" type="text" value={fields.altName} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="concept">Concept</label>
                <input id="concept" name="concept" type="text" value={fields.concept} onChange={handleText} autoComplete="off" />
              </div>
            </div>
            <div className="field-row">
              <ArchetypeSelect id="nature" name="nature" label="Nature" value={fields.nature} onChange={handleField} />
              <ArchetypeSelect id="demeanor" name="demeanor" label="Demeanor" value={fields.demeanor} onChange={handleField} />
              <div className="field">
                <label htmlFor="domainHaven">Domain / Haven</label>
                <input id="domainHaven" name="domainHaven" type="text" value={fields.domainHaven} onChange={handleText} autoComplete="off" />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="visibleAge">Visible Age</label>
                <input id="visibleAge" name="visibleAge" type="text" value={fields.visibleAge} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="totalAge">Total Age</label>
                <input id="totalAge" name="totalAge" type="text" value={fields.totalAge} onChange={handleText} autoComplete="off" />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Kindred</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="clan">Clan / Ghoul / Mortal <span aria-hidden="true">*</span></label>
                <select id="clan" name="clan" value={fields.clan} onChange={e => {
                  const val = e.target.value
                  handleField('clan', val)
                  const entry = CLANS.find(c => c.value === val)
                  if (entry) handleField('clanCurse', entry.curse)
                  if (val === 'Nosferatu' || val === 'Samedi') handleField('appearance', 0)
                }}>
                  <option value="">— Select —</option>
                  {CLANS.map(c => <option key={c.value} value={c.value}>{c.value}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="sect">Sect</label>
                <select id="sect" name="sect" value={fields.sect} onChange={handleText}>
                  <option value="">— Select —</option>
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
                <label htmlFor="generation">Generation</label>
                <select id="generation" name="generation" value={fields.generation} onChange={e => handleField('generation', parseInt(e.target.value))}>
                  {Array.from({ length: 12 }, (_, i) => 15 - i).map(g => {
                    const { max, perTurn } = bloodStats(g)
                    return <option key={g} value={g}>{ordinal(g)} (max {max} BP, {perTurn}/turn)</option>
                  })}
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Derangements & Clan Curse</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="derangement1">Derangement</label>
                <input id="derangement1" name="derangement1" type="text" value={fields.derangement1} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="derangement2">Derangement</label>
                <input id="derangement2" name="derangement2" type="text" value={fields.derangement2} onChange={handleText} autoComplete="off" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="clanCurse">Clan Curse / Notes on Weaknesses</label>
              <textarea id="clanCurse" name="clanCurse" value={fields.clanCurse} onChange={handleText} rows={3} />
            </div>
          </fieldset>

          <fieldset>
            <legend>Notes</legend>
            <div className="field">
              <textarea id="notes" name="notes" value={fields.notes} onChange={handleText} rows={5} placeholder="General notes…" />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Attributes ── */}
      <div role="tabpanel" id="tabpanel-1" aria-labelledby="tab-1" hidden={tab !== 1}>
        <div className="form-section">
          {[
            { legend: 'Physical', attrs: ['strength', 'dexterity', 'stamina'] },
            { legend: 'Social',   attrs: ['charisma', 'manipulation', 'appearance'] },
            { legend: 'Mental',   attrs: ['perception', 'intelligence', 'wits'] },
          ].map(({ legend, attrs }) => {
            const zeroAppearance = fields.clan === 'Nosferatu' || fields.clan === 'Samedi'
            return (
              <fieldset key={legend}>
                <legend>{legend}</legend>
                <div className="rating-grid">
                  {attrs.map(a => (
                    <DotRating
                      key={a}
                      label={a === 'appearance' && zeroAppearance ? 'Appearance (0)' : label(a)}
                      name={a}
                      value={a === 'appearance' && zeroAppearance ? 0 : fields[a]}
                      onChange={handleField}
                      min={a === 'appearance' && zeroAppearance ? 0 : 1}
                      max={a === 'appearance' && zeroAppearance ? 0 : 5}
                    />
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
            <legend>Talents</legend>
            <div className="rating-grid">
              {['alertness', 'athletics', 'awareness', 'brawl', 'empathy', 'intimidation', 'leadership', 'streetwise', 'subterfuge'].map(a =>
                <DotRating key={a} label={label(a)} name={a} value={fields[a]} onChange={handleField} />
              )}
              <RatingRow abilityKey="expression" labelText="Expression *" specKey="expressionSpec" />
            </div>
            <div className="custom-abilities">
              <CustomAbilityRow nameProp="hobbyTalent1Name" ratingProp="hobbyTalent1" placeholder="Hobby Talent" />
              <CustomAbilityRow nameProp="hobbyTalent2Name" ratingProp="hobbyTalent2" placeholder="Hobby Talent" />
              <CustomAbilityRow nameProp="hobbyTalent3Name" ratingProp="hobbyTalent3" placeholder="Hobby Talent" />
            </div>
          </fieldset>

          <fieldset>
            <legend>Skills</legend>
            <div className="rating-grid">
              {['animalKen', 'drive', 'etiquette', 'firearms', 'larceny', 'melee', 'stealth', 'survival'].map(a =>
                <DotRating key={a} label={label(a)} name={a} value={fields[a]} onChange={handleField} />
              )}
              <RatingRow abilityKey="crafts"      labelText="Crafts *"      specKey="craftsSpec" />
              <RatingRow abilityKey="performance" labelText="Performance *" specKey="performanceSpec" />
            </div>
            <div className="custom-abilities">
              <CustomAbilityRow nameProp="profSkill1Name" ratingProp="profSkill1" placeholder="Prof. Skill" />
              <CustomAbilityRow nameProp="profSkill2Name" ratingProp="profSkill2" placeholder="Prof. Skill" />
              <CustomAbilityRow nameProp="profSkill3Name" ratingProp="profSkill3" placeholder="Prof. Skill" />
            </div>
          </fieldset>

          <fieldset>
            <legend>Knowledges</legend>
            <div className="rating-grid">
              {['computer', 'finance', 'investigation', 'linguistics', 'medicine', 'occult', 'politics'].map(a =>
                <DotRating key={a} label={label(a)} name={a} value={fields[a]} onChange={handleField} />
              )}
              <RatingRow abilityKey="academics"  labelText="Academics *"  specKey="academicsSpec" />
              <RatingRow abilityKey="law"         labelText="Law *"         specKey="lawSpec" />
              <RatingRow abilityKey="science"     labelText="Science *"     specKey="scienceSpec" />
              <RatingRow abilityKey="technology"  labelText="Technology *"  specKey="technologySpec" />
            </div>
            <div className="custom-abilities">
              <CustomAbilityRow nameProp="expertKnowl1Name" ratingProp="expertKnowl1" placeholder="Expert Knowledge" />
              <CustomAbilityRow nameProp="expertKnowl2Name" ratingProp="expertKnowl2" placeholder="Expert Knowledge" />
              <CustomAbilityRow nameProp="expertKnowl3Name" ratingProp="expertKnowl3" placeholder="Expert Knowledge" />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Advantages ── */}
      <div role="tabpanel" id="tabpanel-3" aria-labelledby="tab-3" hidden={tab !== 3}>
        <div className="form-section">

          <fieldset>
            <legend>Virtues</legend>
            <div className="rating-grid">
              <DotRating label="Conscience"   name="conscience"   value={fields.conscience}   onChange={handleField} min={1} />
              <DotRating label="Self-Control" name="selfControl"  value={fields.selfControl}  onChange={handleField} min={1} />
              <DotRating label="Courage"      name="courage"      value={fields.courage}      onChange={handleField} min={1} />
            </div>
          </fieldset>

          <fieldset>
            <legend>Path of Enlightenment</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="pathName">Path</label>
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
                  Rating {isHumanity && <span className="muted">(Conscience + Self-Control = {computedPath})</span>}
                </label>
                {isHumanity
                  ? <input id="pathRating" type="number" value={computedPath} readOnly className="readonly-input" />
                  : <DotRating label="" name="pathRating" value={fields.pathRating} onChange={handleField} min={0} max={10} />
                }
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Willpower</legend>
            <div className="field-row">
              <DotRating label="Max Willpower"     name="willpower"        value={fields.willpower}        onChange={handleField} min={1} max={10} />
              <DotRating label="Current Willpower" name="currentWillpower" value={fields.currentWillpower} onChange={handleField} min={0} max={fields.willpower} />
            </div>
          </fieldset>

          <fieldset>
            <legend>Blood Pool — {ordinal(fields.generation)} Gen (max {maxBlood}, {perTurn}/turn)</legend>
            <DotRating label="Current Blood" name="currentBlood" value={fields.currentBlood} onChange={handleField} min={0} max={maxBlood} />
          </fieldset>

          <fieldset>
            <legend>Health</legend>
            <div className="field">
              <label htmlFor="woundLevel">Current Wound Level</label>
              <select
                id="woundLevel"
                value={fields.woundLevel}
                onChange={e => handleField('woundLevel', parseInt(e.target.value))}
              >
                {HEALTH_LEVELS.map((h, i) => (
                  <option key={i} value={i}>
                    {h.label}{h.penalty ? ` ${h.penalty}` : ''}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>

        </div>
      </div>

      {/* ── Disciplines & Backgrounds ── */}
      <div role="tabpanel" id="tabpanel-4" aria-labelledby="tab-4" hidden={tab !== 4}>
        <div className="disc-bg-layout">
        <div className="form-section">
          {!isEdit ? (
            <p className="muted-hint">Save the character first to add disciplines and backgrounds.</p>
          ) : (
            <>
              <fieldset>
                <legend>Disciplines</legend>
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
                    label="Discipline name"
                    catalog={DISCIPLINES}
                    value={newDiscipline.name}
                    onChange={val => setNewDiscipline(p => ({ ...p, name: val }))}
                    placeholder="e.g. Protean"
                  />
                  <div className="field">
                    <label htmlFor="disc-level">Level</label>
                    <select id="disc-level" value={newDiscipline.level}
                      onChange={e => setNewDiscipline(p => ({ ...p, level: parseInt(e.target.value) }))}>
                      {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <button className="btn btn-secondary" onClick={handleAddDiscipline}>Add</button>
                </div>
                {getLevelHint(DISCIPLINES, newDiscipline.name, newDiscipline.level) && (
                  <p className="archetype-desc">{getLevelHint(DISCIPLINES, newDiscipline.name, newDiscipline.level)}</p>
                )}
              </fieldset>

              <hr className="divider" />

              <fieldset>
                <legend>Backgrounds</legend>
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
                    label="Background name"
                    catalog={BACKGROUNDS}
                    value={newBackground.name}
                    onChange={val => setNewBackground(p => ({ ...p, name: val }))}
                    placeholder="e.g. Resources"
                  />
                  <div className="field">
                    <label htmlFor="bg-level">Level</label>
                    <select id="bg-level" value={newBackground.level}
                      onChange={e => setNewBackground(p => ({ ...p, level: parseInt(e.target.value) }))}>
                      {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="bg-desc">Description</label>
                    <input id="bg-desc" type="text" value={newBackground.description}
                      onChange={e => setNewBackground(p => ({ ...p, description: e.target.value }))} autoComplete="off" />
                  </div>
                  <button className="btn btn-secondary" onClick={handleAddBackground}>Add</button>
                </div>
                {getLevelHint(BACKGROUNDS, newBackground.name, newBackground.level) && (
                  <p className="archetype-desc">{getLevelHint(BACKGROUNDS, newBackground.name, newBackground.level)}</p>
                )}
              </fieldset>
            </>
          )}
        </div>

        {tagInfo && (() => {
          const entry = tagInfo.catalog.find(c => c.value.toLowerCase() === tagInfo.name.toLowerCase())
          return (
            <aside className="tag-info-panel">
              <button className="tag-info-panel-close" onClick={() => setTagInfo(null)}>✕ close</button>
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
      <div role="tabpanel" id="tabpanel-5" aria-labelledby="tab-5" hidden={tab !== 5}>
        <div className="disc-bg-layout">
          <div className="form-section">
            {!isEdit ? (
              <p className="muted-hint">Save the character first to add merits and flaws.</p>
            ) : (
              <>
                <fieldset>
                  <legend>Merits</legend>
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
                      placeholder="Search merits…"
                      aria-label="Search merits" />
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
                  <legend>Flaws</legend>
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
                      placeholder="Search flaws…"
                      aria-label="Search flaws" />
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
              </>
            )}
          </div>

          {mfInfo && (() => {
            const entry  = mfInfo.kind === 'merit' ? mfInfo.merit : mfInfo.flaw
            const points = mfInfo.kind === 'merit' ? `${mfInfo.pointsSpent}pt` : `${mfInfo.pointsGained}pt`
            return (
              <aside className="tag-info-panel">
                <button className="tag-info-panel-close" onClick={() => setMfInfo(null)}>✕ close</button>
                <p className="tag-info-panel-name">{entry.name}</p>
                <p className="tag-info-panel-desc">
                  {mfInfo.kind === 'merit' ? 'Merit' : 'Flaw'} · {points}
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
      <div role="tabpanel" id="tabpanel-6" aria-labelledby="tab-6" hidden={tab !== 6}>
        <div className="form-section">
          {!isEdit ? (
            <p className="muted-hint">Save the character first to add inventory.</p>
          ) : (
            <>
              {/* Add new item form */}
              <fieldset>
                <legend>Add Item</legend>
                <div className="field-row">
                  <SearchableInput
                    id="inv-name"
                    label="Name"
                    catalog={ITEM_CATALOG}
                    value={newItem.name}
                    placeholder="e.g. Glock 17 or custom item"
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
                    <label htmlFor="inv-cat">Category</label>
                    <select id="inv-cat" value={newItem.category}
                      onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}>
                      {INVENTORY_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>)}
                    </select>
                  </div>
                  <div className="field" style={{ width: '70px' }}>
                    <label htmlFor="inv-qty">Qty</label>
                    <input id="inv-qty" type="number" min={1} value={newItem.quantity}
                      onChange={e => setNewItem(p => ({ ...p, quantity: parseInt(e.target.value) || 1 }))} />
                  </div>
                </div>
                {(newItem.category === 'WEAPON') && (
                  <div className="field-row">
                    <div className="field">
                      <label htmlFor="inv-dmg">Damage</label>
                      <input id="inv-dmg" type="text" value={newItem.damage}
                        onChange={e => setNewItem(p => ({ ...p, damage: e.target.value }))}
                        placeholder="e.g. Str+3 L" autoComplete="off" />
                    </div>
                    <div className="field" style={{ width: '80px' }}>
                      <label htmlFor="inv-range">Range</label>
                      <input id="inv-range" type="text" value={newItem.range}
                        onChange={e => setNewItem(p => ({ ...p, range: e.target.value }))}
                        placeholder="e.g. 20m" autoComplete="off" />
                    </div>
                    <div className="field" style={{ width: '60px' }}>
                      <label htmlFor="inv-rate">Rate</label>
                      <input id="inv-rate" type="text" value={newItem.rate}
                        onChange={e => setNewItem(p => ({ ...p, rate: e.target.value }))}
                        placeholder="e.g. 3" autoComplete="off" />
                    </div>
                    <div className="field" style={{ width: '80px' }}>
                      <label htmlFor="inv-clip">Clip</label>
                      <input id="inv-clip" type="text" value={newItem.clip}
                        onChange={e => setNewItem(p => ({ ...p, clip: e.target.value }))}
                        placeholder="e.g. 17+1" autoComplete="off" />
                    </div>
                    <div className="field" style={{ width: '60px' }}>
                      <label htmlFor="inv-conc">Conc.</label>
                      <input id="inv-conc" type="text" value={newItem.concealment}
                        onChange={e => setNewItem(p => ({ ...p, concealment: e.target.value }))}
                        placeholder="P/J/T/N" autoComplete="off" />
                    </div>
                  </div>
                )}
                {(newItem.category === 'ARMOR') && (
                  <div className="field-row">
                    <div className="field" style={{ width: '100px' }}>
                      <label htmlFor="inv-armor">Armor Rating</label>
                      <input id="inv-armor" type="number" value={newItem.armorRating ?? ''}
                        onChange={e => { const v = parseInt(e.target.value); setNewItem(p => ({ ...p, armorRating: isNaN(v) ? null : v })) }}
                        placeholder="e.g. 2" />
                    </div>
                    <div className="field" style={{ width: '100px' }}>
                      <label htmlFor="inv-penalty">Dex Penalty</label>
                      <input id="inv-penalty" type="number" value={newItem.handling ?? ''}
                        onChange={e => { const v = parseInt(e.target.value); setNewItem(p => ({ ...p, handling: isNaN(v) ? null : v })) }}
                        placeholder="e.g. -1" />
                    </div>
                  </div>
                )}
                {(newItem.category === 'VEHICLE') && (
                  <div className="field-row">
                    <div className="field">
                      <label htmlFor="inv-range-v">Top Speed</label>
                      <input id="inv-range-v" type="text" value={newItem.range}
                        onChange={e => setNewItem(p => ({ ...p, range: e.target.value }))}
                        placeholder="e.g. 200 km/h" autoComplete="off" />
                    </div>
                    <div className="field" style={{ width: '80px' }}>
                      <label htmlFor="inv-handling">Maneuver</label>
                      <input id="inv-handling" type="number" value={newItem.handling ?? ''}
                        onChange={e => { const v = parseInt(e.target.value); setNewItem(p => ({ ...p, handling: isNaN(v) ? null : v })) }}
                        placeholder="e.g. 3" />
                    </div>
                    <div className="field" style={{ width: '90px' }}>
                      <label htmlFor="inv-struct">Structure</label>
                      <input id="inv-struct" type="number" value={newItem.structure ?? ''}
                        onChange={e => { const v = parseInt(e.target.value); setNewItem(p => ({ ...p, structure: isNaN(v) ? null : v })) }}
                        placeholder="e.g. 25" />
                    </div>
                    <div className="field" style={{ width: '80px' }}>
                      <label htmlFor="inv-armor-v">Armor</label>
                      <input id="inv-armor-v" type="number" value={newItem.armorRating ?? ''}
                        onChange={e => { const v = parseInt(e.target.value); setNewItem(p => ({ ...p, armorRating: isNaN(v) ? null : v })) }}
                        placeholder="e.g. 0" />
                    </div>
                  </div>
                )}
                <div className="field">
                  <label htmlFor="inv-notes">Notes</label>
                  <input id="inv-notes" type="text" value={newItem.notes}
                    onChange={e => setNewItem(p => ({ ...p, notes: e.target.value }))}
                    placeholder="Optional notes" autoComplete="off" />
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ position: 'relative', zIndex: 200 }}
                  onClick={handleAddItem}
                >Add to inventory</button>
              </fieldset>

              {/* Item list grouped by category */}
              {INVENTORY_CATEGORIES.filter(cat => inventory.some(i => i.category === cat)).map(cat => (
                <fieldset key={cat}>
                  <legend>{cat.charAt(0) + cat.slice(1).toLowerCase() + 's'}</legend>
                  <table className="inv-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Qty</th>
                        {cat === 'WEAPON' && <><th>Damage</th><th>Range</th><th>Rate</th><th>Clip</th><th>Conc.</th></>}
                        {cat === 'ARMOR' && <><th>Rating</th><th>Dex Penalty</th></>}
                        {cat === 'VEHICLE' && <><th>Top Speed</th><th>Maneuver</th><th>Structure</th><th>Armor</th></>}
                        <th>Notes</th>
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
              {inventory.length === 0 && <p className="muted-hint">No items yet.</p>}
            </>
          )}
        </div>
      </div>

      {/* ── Blood Sorcery ── */}
      <div role="tabpanel" id="tabpanel-7" aria-labelledby="tab-7" hidden={tab !== 7}>
        <div className="disc-bg-layout">
          <div className="form-section">
            {!isEdit ? (
              <p className="muted-hint">Save the character first to add blood sorcery.</p>
            ) : (
              <>
                {/* ── Paths ── */}
                <fieldset>
                  <legend>Thaumaturgy Paths</legend>
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
                      label="Path name"
                      catalog={SORCERY_PATHS}
                      value={newPath.name}
                      onChange={val => setNewPath(p => ({ ...p, name: val }))}
                      placeholder="e.g. Lure of Flames"
                    />
                    <div className="field">
                      <label htmlFor="path-level">Level</label>
                      <select id="path-level" value={newPath.level}
                        onChange={e => setNewPath(p => ({ ...p, level: parseInt(e.target.value) }))}>
                        {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                    <button className="btn btn-secondary" onClick={handleAddPath}>Add</button>
                  </div>
                  {getLevelHint(SORCERY_PATHS, newPath.name, newPath.level) && (
                    <p className="archetype-desc">{getLevelHint(SORCERY_PATHS, newPath.name, newPath.level)}</p>
                  )}
                </fieldset>

                <hr className="divider" />

                {/* ── Rituals ── */}
                <fieldset>
                  <legend>Rituals</legend>
                  {[1,2,3,4,5].filter(lvl => rituals.some(r => r.level === lvl)).map(lvl => (
                    <div key={lvl} style={{ marginBottom: 'var(--space-md)' }}>
                      <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xs)', fontWeight: 600 }}>
                        Level {lvl}
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
                  {rituals.length === 0 && <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>No rituals known yet.</p>}
                  <div className="field-row">
                    <SearchableInput
                      id="ritual-name"
                      label="Ritual name"
                      catalog={RITUALS}
                      value={newRitual.name}
                      onChange={val => {
                        const match = RITUALS.find(r => r.value === val)
                        setNewRitual(p => ({ ...p, name: val, level: match ? match.level : p.level }))
                      }}
                      placeholder="e.g. Blood Walk"
                    />
                    <div className="field">
                      <label htmlFor="ritual-level">Level</label>
                      <select id="ritual-level" value={newRitual.level}
                        onChange={e => setNewRitual(p => ({ ...p, level: parseInt(e.target.value) }))}>
                        {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                    <button className="btn btn-secondary" onClick={handleAddRitual}>Add</button>
                  </div>
                  {(() => {
                    const match = RITUALS.find(r => r.value === newRitual.name)
                    return match ? <p className="archetype-desc">{match.description}</p> : null
                  })()}
                </fieldset>
              </>
            )}
          </div>

          {sorcInfo && (() => {
            if (sorcInfo.kind === 'path') {
              const entry = SORCERY_PATHS.find(p => p.value === sorcInfo.name)
              return (
                <aside className="tag-info-panel">
                  <button className="tag-info-panel-close" onClick={() => setSorcInfo(null)}>✕ close</button>
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
                <button className="tag-info-panel-close" onClick={() => setSorcInfo(null)}>✕ close</button>
                <p className="tag-info-panel-name">{sorcInfo.name}</p>
                <p className="tag-info-panel-desc">Level {sorcInfo.level} ritual</p>
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

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={onBack}>Cancel</button>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving || validationErrors.length > 0}
          title={validationErrors.length > 0 ? validationErrors.join(' ') : undefined}
        >
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create character'}
        </button>
      </div>
    </section>
  )
}

// ── ArchetypeSelect ───────────────────────────────────────────────────────────

function ArchetypeSelect({ id, name, label: labelText, value, onChange }) {
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
          placeholder={value || 'Search archetypes…'}
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
            <li className="archetype-no-results">No match</li>
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
  return (
    <ul className="catalog-list" aria-label={ariaLabel}>
      {items.length === 0 && <li className="catalog-empty">No matches found.</li>}
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
