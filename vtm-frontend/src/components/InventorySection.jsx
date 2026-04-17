import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { addInventoryItem, removeInventoryItem } from '../api/characterApi'

// ── Constants ──

const INVENTORY_CATEGORIES = ['WEAPON', 'ARMOR', 'VEHICLE', 'EQUIPMENT', 'OTHER']

// ── WoD Item Catalog ──
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

const INITIAL_ITEM = { name: '', category: 'EQUIPMENT', quantity: 1, damage: '', concealment: '', range: '', rate: '', clip: '', armorRating: null, handling: null, structure: null, notes: '' }

// ── SearchableInput ──

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

// ── InventorySection ──

export default function InventorySection({ characterId, inventory, setInventory, personalItems, onPersonalItemsChange, catalog: customCatalog }) {
  const { t } = useLanguage()
  const activeCatalog = customCatalog || ITEM_CATALOG
  const [newItem, setNewItem] = useState(INITIAL_ITEM)
  const [actionError, setActionError] = useState(null)

  async function handleAddItem() {
    if (!newItem.name.trim() || !characterId) return
    try {
      const res = await addInventoryItem(characterId, newItem)
      setInventory(prev => [...prev, res.data])
      setNewItem(INITIAL_ITEM)
    } catch { setActionError(t('failedToSave')) }
  }

  async function handleRemoveItem(id) {
    try {
      await removeInventoryItem(characterId, id)
      setInventory(prev => prev.filter(i => i.id !== id))
    } catch { setActionError(t('failedToSave')) }
  }

  return (
    <div className="form-section">
      {actionError && <p className="status-error" role="alert">{actionError}</p>}
      <fieldset>
        <legend>{t('addItem')}</legend>
        <div className="field-row">
          <SearchableInput
            id="inv-name"
            label={t('name')}
            catalog={activeCatalog}
            value={newItem.name}
            placeholder={t('phInvName')}
            onChange={val => {
              const hit = activeCatalog.find(c => c.value.toLowerCase() === val.toLowerCase())
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
        <textarea name="personalItems" value={personalItems ?? ''} onChange={onPersonalItemsChange} rows={6} placeholder={t('personalItemsPh')} style={{ width: '100%' }} />
      </fieldset>
    </div>
  )
}
