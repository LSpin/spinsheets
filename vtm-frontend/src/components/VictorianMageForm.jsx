import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  getCharacter, updateCharacter,
  getBackgrounds, addBackground, removeBackground,
  getMeritCatalog, getFlawCatalog,
  getMerits, addMerit, removeMerit,
  getFlaws, addFlaw, removeFlaw,
  getInventory, addInventoryItem, removeInventoryItem,
  getXpLog, addXpLogEntry, removeXpLogEntry,
  getRotes, addRote, removeRote,
} from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import DotRating from './DotRating'
import { SECONDARY_TALENTS, SECONDARY_SKILLS, SECONDARY_KNOWLEDGES } from '../data/secondaryAbilities'
import { MAGE_TRADITIONS } from '../data/mageTraditions'
import { useLanguage } from '../i18n/LanguageContext'

// ── Constants ──

const TRADITIONS = [
  'Akashic Brotherhood', 'Celestial Chorus', 'Cult of Ecstasy', 'Dreamspeakers',
  'Euthanatos', 'Hollow Ones', 'Order of Hermes', 'Sons of Ether', 'Verbena', 'Virtual Adepts',
]

const TECHNOCRACY = [
  'Iteration X', 'New World Order', 'Progenitors', 'Syndicate', 'Void Engineers',
]

const AFFILIATIONS = ['Traditions', 'Technocracy', 'Disparates', 'Orphans', 'Nephandi', 'Marauders']

const ESSENCES = ['Dynamic', 'Pattern', 'Primordial', 'Questing']

const ARCHETYPES = [
  'Architect', 'Autocrat', 'Bon Vivant', 'Bravo', 'Caregiver', 'Celebrant', 'Child',
  'Competitor', 'Conformist', 'Conniver', 'Curmudgeon', 'Deviant', 'Director', 'Enigma',
  'Eye of the Storm', 'Fanatic', 'Gallant', 'Judge', 'Loner', 'Martyr', 'Masochist',
  'Monster', 'Pedagogue', 'Penitent', 'Perfectionist', 'Rebel', 'Rogue', 'Scientist',
  'Survivor', 'Thrill-Seeker', 'Traditionalist', 'Trickster', 'Visionary',
]

const BACKGROUNDS = [
  { value: 'Allies',     description: 'Human friends and contacts who aid the mage.' },
  { value: 'Arcane',     description: 'A supernatural tendency to be overlooked and forgotten.' },
  { value: 'Avatar',     description: 'The strength and presence of your Awakened Avatar.' },
  { value: 'Backup',     description: 'Access to Technocratic or organizational reinforcements.' },
  { value: 'Contacts',   description: 'Informants and sources of information.' },
  { value: 'Destiny',    description: 'A great fate that protects and guides you.' },
  { value: 'Dream',      description: 'Prophetic and insightful dreams from the Tapestry.' },
  { value: 'Fame',       description: 'Public recognition and celebrity status.' },
  { value: 'Influence',  description: 'Political or social pull in mortal society.' },
  { value: 'Library',    description: 'Access to occult texts, research materials, and lore.' },
  { value: 'Mentor',     description: 'An experienced mage who guides and teaches you.' },
  { value: 'Node',       description: 'A place of power that generates Quintessence.' },
  { value: 'Resources',  description: 'Wealth and material assets.' },
  { value: 'Retainers',  description: 'Loyal servants, familiars, or assistants.' },
  { value: 'Sanctum',    description: 'A protected and warded workspace for magical practice.' },
  { value: 'Totem',      description: 'A spirit ally bound to you or your cabal.' },
  { value: 'Wonder',     description: 'A magical item imbued with Awakened power.' },
  { value: 'Haven',      description: 'The safety and secrecy of your primary resting place.' },
  { value: 'Haven Security', description: 'Physical defences and countermeasures protecting your haven.' },
  { value: 'Haven Luxury', description: 'The comfort, amenities, and opulence of your haven.' },
  { value: 'Haven Size', description: 'The physical extent and number of rooms in your haven.' },
  // ── Specialized (Victorian Mage) ──
  { value: 'Chantry', description: 'Membership in a shared Tradition chantry with communal resources and defences.' },
  { value: 'Companion', description: 'A loyal supernatural ally — a familiar spirit, construct, or trained animal.' },
  { value: 'Genius', description: 'Flashes of inspired insight that provide bonus dice on research and invention rolls.' },
  { value: 'Legend', description: 'A mythic reputation among Awakened society that precedes you.' },
  { value: 'Past Lives', description: 'Memories and skills from previous incarnations of your Avatar.' },
  { value: 'Patron', description: 'A powerful entity — spirit, god, or Umbrood — that grants power in exchange for service.' },
  { value: 'Secret Weapons', description: 'Hidden or occult armaments — enchanted blades, alchemical devices, or spirit-bound weapons.' },
  { value: 'Spies', description: 'A covert network of informants planted across Awakened and mortal society.' },
]

const HEALTH_LEVEL_KEYS = [
  { key: 'healthy',        penalty: '' },
  { key: 'bruised',        penalty: '' },
  { key: 'hurt',           penalty: '−1' },
  { key: 'injured',        penalty: '−1' },
  { key: 'wounded',        penalty: '−2' },
  { key: 'mauled',         penalty: '−2' },
  { key: 'crippled',       penalty: '−5' },
  { key: 'incapacitated',  penalty: '' },
]

const INVENTORY_CATEGORIES = ['WEAPON', 'ARMOR', 'VEHICLE', 'EQUIPMENT', 'OTHER']

const INITIAL = {
  npc: false, splat: 'VICTORIAN_MAGE',
  name: '', altName: '', concept: '',
  nature: '', demeanor: '',
  essence: '', affiliation: '',
  clan: '',        // reused for Tradition / Convention name
  mageSection: '',
  // Attributes
  strength: 1, dexterity: 1, stamina: 1,
  charisma: 1, manipulation: 1, appearance: 1,
  perception: 1, intelligence: 1, wits: 1,
  strengthSpec: '', dexteritySpec: '', staminaSpec: '',
  charismaSpec: '', manipulationSpec: '', appearanceSpec: '',
  perceptionSpec: '', intelligenceSpec: '', witsSpec: '',
  // Talents
  alertness: 0, athletics: 0, awareness: 0, brawl: 0, dodge: 0, empathy: 0,
  expression: 0, intimidation: 0, streetwise: 0, subterfuge: 0,
  hobbyTalent1Name: '', hobbyTalent1: 0, hobbyTalent2Name: '', hobbyTalent2: 0, hobbyTalent3Name: '', hobbyTalent3: 0,
  hobbyTalent4Name: '', hobbyTalent4: 0, hobbyTalent5Name: '', hobbyTalent5: 0, hobbyTalent6Name: '', hobbyTalent6: 0,
  hobbyTalent7Name: '', hobbyTalent7: 0, hobbyTalent8Name: '', hobbyTalent8: 0, hobbyTalent9Name: '', hobbyTalent9: 0,
  hobbyTalent10Name: '', hobbyTalent10: 0,
  alertnessSpec: '', athleticsSpec: '', awarenessSpec: '', brawlSpec: '', dodgeSpec: '', empathySpec: '',
  expressionSpec: '', intimidationSpec: '', streetwiseSpec: '', subterfugeSpec: '',
  hobbyTalent1Spec: '', hobbyTalent2Spec: '', hobbyTalent3Spec: '',
  hobbyTalent4Spec: '', hobbyTalent5Spec: '', hobbyTalent6Spec: '',
  hobbyTalent7Spec: '', hobbyTalent8Spec: '', hobbyTalent9Spec: '',
  hobbyTalent10Spec: '',
  // Skills
  crafts: 0, etiquette: 0, firearms: 0, leadership: 0, meditation: 0,
  melee: 0, performance: 0, ride: 0, stealth: 0, technology: 0,
  profSkill1Name: '', profSkill1: 0, profSkill2Name: '', profSkill2: 0, profSkill3Name: '', profSkill3: 0,
  profSkill4Name: '', profSkill4: 0, profSkill5Name: '', profSkill5: 0, profSkill6Name: '', profSkill6: 0,
  profSkill7Name: '', profSkill7: 0, profSkill8Name: '', profSkill8: 0, profSkill9Name: '', profSkill9: 0,
  profSkill10Name: '', profSkill10: 0,
  craftsSpec: '', etiquetteSpec: '', firearmsSpec: '', leadershipSpec: '', meditationSpec: '',
  meleeSpec: '', performanceSpec: '', rideSpec: '', stealthSpec: '', technologySpec: '',
  profSkill1Spec: '', profSkill2Spec: '', profSkill3Spec: '',
  profSkill4Spec: '', profSkill5Spec: '', profSkill6Spec: '',
  profSkill7Spec: '', profSkill8Spec: '', profSkill9Spec: '',
  profSkill10Spec: '',
  // Knowledges
  academics: 0, cosmology: 0, enigmas: 0, investigation: 0,
  law: 0, linguistics: 0, medicine: 0, occult: 0, politics: 0, science: 0,
  expertKnowl1Name: '', expertKnowl1: 0, expertKnowl2Name: '', expertKnowl2: 0, expertKnowl3Name: '', expertKnowl3: 0,
  expertKnowl4Name: '', expertKnowl4: 0, expertKnowl5Name: '', expertKnowl5: 0, expertKnowl6Name: '', expertKnowl6: 0,
  expertKnowl7Name: '', expertKnowl7: 0, expertKnowl8Name: '', expertKnowl8: 0, expertKnowl9Name: '', expertKnowl9: 0,
  expertKnowl10Name: '', expertKnowl10: 0,
  academicsSpec: '', cosmologySpec: '', enigmasSpec: '', investigationSpec: '',
  lawSpec: '', linguisticsSpec: '', medicineSpec: '', occultSpec: '', politicsSpec: '', scienceSpec: '',
  expertKnowl1Spec: '', expertKnowl2Spec: '', expertKnowl3Spec: '',
  expertKnowl4Spec: '', expertKnowl5Spec: '', expertKnowl6Spec: '',
  expertKnowl7Spec: '', expertKnowl8Spec: '', expertKnowl9Spec: '',
  expertKnowl10Spec: '',
  // Spheres
  sphereCorrespondence: 0, sphereEntropy: 0, sphereForces: 0,
  sphereLife: 0, sphereMatter: 0, sphereMind: 0,
  spherePrime: 0, sphereSpirit: 0, sphereTime: 0,
  // Advantages
  arete: 1, quintessence: 0, paradox: 0,
  // Willpower
  willpower: 3, currentWillpower: 3,
  // Health
  woundLevel: 0,
  healthBruised: '', healthHurt: '', healthInjured: '', healthWounded: '', healthMauled: '', healthCrippled: '', healthIncap: '',
  // Focus
  paradigm: '', practice: '', instruments: '',
  // Chantry
  chantryName: '', chantryDescription: '',
  // Notes
  derangement1: '', derangement2: '', notes: '',
  backstory: '', appearanceDesc: '', goals: '', allies: '', enemies: '', havens: '', territories: '',
  personalItems: '',
}

function MageRatingRow({ abilityKey, specKey, fields, onField, onText, t, max = 5 }) {
  return (
    <div className="ability-row">
      <DotRating label={t(abilityKey)} name={abilityKey} value={fields[abilityKey]} onChange={onField} max={max} />
      <input className="spec-input" type="text" name={specKey} value={fields[specKey] ?? ''} onChange={onText}
        placeholder={t('specialty')} aria-label={`${t(abilityKey)} ${t('specialty')}`} />
    </div>
  )
}

function CustomAbilityRow({ nameProp, ratingProp, placeholder, fields, onField, onText, catalog, max = 5 }) {
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
      <datalist id={`${nameProp}-list`}>
        {catalog?.map(c => <option key={c.value} value={c.value} />)}
      </datalist>
      <DotRating label="" name={ratingProp} value={fields[ratingProp]} onChange={onField} max={max} />
      {match && <p className="archetype-desc" style={{ gridColumn: '1 / -1', margin: 0 }}>{match.description}</p>}
    </div>
  )
}

// ── Component ──

const TAB_KEYS = ['tabIdentity', 'tabAttributes', 'tabAbilities', 'tabSecondaryAbilities', 'tabSpheres', 'tabRotes', 'tabHealth', 'tabBackgrounds', 'tabMeritsFlaws', 'tabInventory', 'tabFocusChantry', 'tabBackstory', 'tabXpLog']

export default function VictorianMageForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const characterId = paramId ? Number(paramId) : null

  const [searchParams] = useSearchParams()
  const guidedMode = searchParams.get('mode') === 'guided'
  const viewMode = searchParams.get('mode') === 'view'
  const { isAutoCreating } = useAutoCreate(characterId, INITIAL)

  const [tab, setTab] = useState(0)
  const [fields, setFields] = useState(INITIAL)
  const [backgrounds, setBackgrounds] = useState([])
  const [merits, setMerits] = useState([])
  const [flaws, setFlaws] = useState([])
  const [meritCatalog, setMeritCatalog] = useState([])
  const [flawCatalog, setFlawCatalog] = useState([])
  const [inventory, setInventory] = useState([])
  const [newBackground, setNewBackground] = useState({ name: '', level: 1, description: '' })
  const [newItem, setNewItem] = useState({ name: '', category: 'EQUIPMENT', quantity: 1, damage: '', concealment: '', range: '', rate: '', clip: '', armorRating: null, handling: null, structure: null, notes: '' })
  const [rotes, setRotes] = useState([])
  const [newRote, setNewRote] = useState({ name: '', spheres: '', level: 1, description: '' })
  const [xpLog, setXpLog] = useState([])
  const [xpSubTab, setXpSubTab] = useState(0)
  const [newXpEntry, setNewXpEntry] = useState({ type: 'XP', amount: 1, category: 'Earned', description: '' })
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

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
    talents: ['alertness', 'athletics', 'awareness', 'brawl', 'dodge', 'empathy', 'expression', 'intimidation', 'streetwise', 'subterfuge'],
    skills: ['crafts', 'etiquette', 'firearms', 'leadership', 'meditation', 'melee', 'performance', 'ride', 'stealth', 'technology'],
    knowledges: ['academics', 'cosmology', 'enigmas', 'investigation', 'law', 'linguistics', 'medicine', 'occult', 'politics', 'science'],
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

  useEffect(() => {
    if (guidedMode) {
      setFields(prev => ({ ...prev, willpower: 5, currentWillpower: 5 }))
    }
  }, [guidedMode])

  useEffect(() => {
    if (characterId) loadCharacter()
    loadCatalogs()
  }, [characterId])

  async function loadCharacter() {
    try {
      const [charRes, bgRes, meritRes, flawRes, invRes, xpRes, roteRes] = await Promise.all([
        getCharacter(characterId),
        getBackgrounds(characterId),
        getMerits(characterId),
        getFlaws(characterId),
        getInventory(characterId),
        getXpLog(characterId),
        getRotes(characterId),
      ])
      const data = charRes.data
      setFields(prev => {
        const next = { ...prev }
        for (const k of Object.keys(prev)) if (data[k] != null) next[k] = data[k]
        return next
      })
      setBackgrounds(bgRes.data)
      setMerits(meritRes.data)
      setFlaws(flawRes.data)
      setInventory(invRes.data)
      setXpLog(xpRes.data)
      setRotes(roteRes.data)
    } catch { setSaveError(t('failedToLoad')) }
    finally { setLoading(false) }
  }

  async function loadCatalogs() {
    try {
      const [m, f] = await Promise.all([getMeritCatalog(), getFlawCatalog()])
      setMeritCatalog(m.data)
      setFlawCatalog(f.data)
    } catch {}
  }

  function handleField(name, value) {
    setFields(prev => ({ ...prev, [name]: value }))
  }

  function handleText(e) {
    const { name, value, type } = e.target
    handleField(name, type === 'number' ? (parseInt(value) || 0) : value)
  }

  async function handleSave() {
    setSaving(true)
    setSaveError(null)
    try {
      await updateCharacter(characterId, fields)
    } catch (err) {
      setSaveError(err.response?.data?.message || t('failedToSave'))
    } finally { setSaving(false) }
  }

  async function handleDoneEditing() {
    setSaving(true)
    setSaveError(null)
    try {
      await updateCharacter(characterId, fields)
      navigate('/characters')
    } catch (err) {
      setSaveError(err.response?.data?.message || t('failedToSave'))
    } finally { setSaving(false) }
  }

  async function handleAddBackground() {
    if (!newBackground.name.trim() || !characterId) return
    try {
      const res = await addBackground(characterId, newBackground)
      setBackgrounds(prev => [...prev, res.data])
      setNewBackground({ name: '', level: 1, description: '' })
    } catch {}
  }

  async function handleAddItem() {
    if (!newItem.name.trim() || !characterId) return
    try {
      const res = await addInventoryItem(characterId, newItem)
      setInventory(prev => [...prev, res.data])
      setNewItem({ name: '', category: 'EQUIPMENT', quantity: 1, damage: '', concealment: '', range: '', rate: '', clip: '', armorRating: null, handling: null, structure: null, notes: '' })
    } catch {}
  }

  async function handleRemoveItem(id) {
    try {
      await removeInventoryItem(characterId, id)
      setInventory(prev => prev.filter(i => i.id !== id))
    } catch {}
  }

  // Determine Tradition/Convention list based on affiliation
  const factionList = fields.affiliation === 'Traditions' ? TRADITIONS
    : fields.affiliation === 'Technocracy' ? TECHNOCRACY
    : []
  const factionLabel = fields.affiliation === 'Technocracy' ? t('convention') : t('tradition')

  async function handleAddRote() {
    if (!newRote.name.trim()) return
    try {
      const res = await addRote(characterId, newRote)
      setRotes(prev => [...prev, res.data])
      setNewRote({ name: '', spheres: '', level: 1, description: '' })
    } catch { setSaveError(t('failedToSave')) }
  }

  async function handleRemoveRote(roteId) {
    try {
      await removeRote(characterId, roteId)
      setRotes(prev => prev.filter(r => r.id !== roteId))
    } catch { setSaveError(t('failedToSave')) }
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
    } catch { setSaveError(t('failedToSave')) }
  }

  async function handleRemoveXpEntry(entryId) {
    try {
      await removeXpLogEntry(characterId, entryId)
      setXpLog(prev => prev.filter(e => e.id !== entryId))
    } catch { setSaveError(t('failedToSave')) }
  }

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/characters')}>{t('back')}</button>
        <h2>{fields.name || t('newVictorianMage')}</h2>
        <span className="splat-badge splat-badge--victorian-mage">{t('victorianMage')}</span>
        {guidedMode && <span className="splat-badge">{t('guidedCreation')}</span>}
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}

      {/* Tabs */}
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
              <div className="field">
                <label htmlFor="name">{t('charName')} <span aria-hidden="true">*</span></label>
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
              <div className="field">
                <label htmlFor="nature">{t('nature')}</label>
                <select id="nature" name="nature" value={fields.nature} onChange={handleText}>
                  <option value="">{t('select')}</option>
                  {ARCHETYPES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="demeanor">{t('demeanor')}</label>
                <select id="demeanor" name="demeanor" value={fields.demeanor} onChange={handleText}>
                  <option value="">{t('select')}</option>
                  {ARCHETYPES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="essence">{t('essence')}</label>
                <select id="essence" name="essence" value={fields.essence} onChange={handleText}>
                  <option value="">{t('select')}</option>
                  {ESSENCES.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('affiliation')}</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="affiliation">{t('affiliation')}</label>
                <select id="affiliation" name="affiliation" value={fields.affiliation} onChange={handleText}>
                  <option value="">{t('select')}</option>
                  {AFFILIATIONS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="clan">{factionLabel}</label>
                {factionList.length > 0 ? (
                  <select id="clan" name="clan" value={fields.clan} onChange={handleText}>
                    <option value="">{t('select')}</option>
                    {factionList.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                ) : (
                  <>
                    <input id="clan" name="clan" type="text" value={fields.clan} onChange={handleText} autoComplete="off"
                      placeholder={fields.affiliation ? t('phFaction') : t('phSelectAffFirst')} list="tradition-suggestions" />
                    <datalist id="tradition-suggestions">
                      {MAGE_TRADITIONS.map(mt => <option key={mt.name} value={mt.name} />)}
                    </datalist>
                  </>
                )}
              </div>
              <div className="field">
                <label htmlFor="mageSection">{t('sectionCabal')}</label>
                <input id="mageSection" name="mageSection" type="text" value={fields.mageSection} onChange={handleText} autoComplete="off" />
              </div>
            </div>
            {(() => {
              const tradEntry = MAGE_TRADITIONS.find(mt => mt.name === fields.clan)
              return tradEntry ? (
                <div style={{ marginBottom: 'var(--space-sm)' }}>
                  <p className="archetype-desc">{tradEntry.description}</p>
                  {tradEntry.focus && <p className="archetype-desc" style={{ marginTop: '0.25rem' }}><strong>{t('focus')}:</strong> {tradEntry.focus}</p>}
                </div>
              ) : null
            })()}
            <div className="field-row">
              <div className="field">
                <label htmlFor="npc">{t('type')}</label>
                <div className="role-toggle" role="radiogroup" aria-label={t('type')}>
                  <button type="button" className={`role-toggle-btn${!fields.npc ? ' role-toggle-btn--active' : ''}`}
                    onClick={() => handleField('npc', false)}>{t('pc')}</button>
                  <button type="button" className={`role-toggle-btn${fields.npc ? ' role-toggle-btn--active' : ''}`}
                    onClick={() => handleField('npc', true)}>{t('npc')}</button>
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('notes')}</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="derangement1">{t('derangements')} 1</label>
                <input id="derangement1" name="derangement1" type="text" value={fields.derangement1} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="derangement2">{t('derangements')} 2</label>
                <input id="derangement2" name="derangement2" type="text" value={fields.derangement2} onChange={handleText} autoComplete="off" />
              </div>
            </div>
            <div className="field">
              <textarea id="notes" name="notes" value={fields.notes} onChange={handleText} rows={5} placeholder={t('phNotes')} />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Attributes ── */}
      <div hidden={tab !== 1}>
        <div className="form-section">
          {[
            { legend: 'physicalAttr', group: 'physical', attrs: ['strength', 'dexterity', 'stamina'] },
            { legend: 'socialAttr',   group: 'social',   attrs: ['charisma', 'manipulation', 'appearance'] },
            { legend: 'mentalAttr',   group: 'mental',   attrs: ['perception', 'intelligence', 'wits'] },
          ].map(({ legend, group, attrs }) => (
            <fieldset key={legend}>
              <legend>{t(legend)}</legend>
              {guidedMode && (
                <>
                  <PrioritySelector group={group} priorities={attrPriority} setPriorities={setAttrPriority} budgets={ATTR_BUDGETS} />
                  <PointsIndicator spent={getAttrSpent(group)} budget={getAttrBudget(group)} />
                </>
              )}
              <div className="rating-grid">
                {attrs.map(a => (
                  <div key={a} className="ability-row">
                    <DotRating label={t(a)} name={a} value={fields[a]} onChange={handleField} min={1} />
                    <input className="spec-input" type="text" name={a + 'Spec'} value={fields[a + 'Spec'] ?? ''} onChange={handleText}
                      placeholder={t('specialty')} aria-label={`${t(a)} ${t('specialty')}`} />
                  </div>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </div>

      {/* ── Abilities ── */}
      <div hidden={tab !== 2}>
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
              {['alertness', 'athletics', 'awareness', 'brawl', 'dodge', 'empathy', 'expression', 'intimidation', 'streetwise', 'subterfuge'].map(a =>
                <MageRatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} t={t} />
              )}
              {Array.from({length: 10}, (_, i) => `hobbyTalent${i + 1}`).map(a =>
                <MageRatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} t={t} />
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
              {['crafts', 'etiquette', 'firearms', 'leadership', 'meditation', 'melee', 'performance', 'ride', 'stealth', 'technology'].map(a =>
                <MageRatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} t={t} />
              )}
              {Array.from({length: 10}, (_, i) => `profSkill${i + 1}`).map(a =>
                <MageRatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} t={t} />
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
              {['academics', 'cosmology', 'enigmas', 'investigation', 'law', 'linguistics', 'medicine', 'occult', 'politics', 'science'].map(a =>
                <MageRatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} t={t} />
              )}
              {Array.from({length: 10}, (_, i) => `expertKnowl${i + 1}`).map(a =>
                <MageRatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} t={t} />
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
                <CustomAbilityRow key={n} nameProp={`hobbyTalent${n}Name`} ratingProp={`hobbyTalent${n}`} placeholder={t('phHobbyTalent')} fields={fields} onField={handleField} onText={handleText} catalog={SECONDARY_TALENTS} />
              )}
            </fieldset>
            <fieldset>
              <legend>{t('secondarySkills')}</legend>
              {Array.from({length: 10}, (_, i) => i + 1).map(n =>
                <CustomAbilityRow key={n} nameProp={`profSkill${n}Name`} ratingProp={`profSkill${n}`} placeholder={t('phProfSkill')} fields={fields} onField={handleField} onText={handleText} catalog={SECONDARY_SKILLS} />
              )}
            </fieldset>
            <fieldset>
              <legend>{t('secondaryKnowledges')}</legend>
              {Array.from({length: 10}, (_, i) => i + 1).map(n =>
                <CustomAbilityRow key={n} nameProp={`expertKnowl${n}Name`} ratingProp={`expertKnowl${n}`} placeholder={t('phExpertKnowl')} fields={fields} onField={handleField} onText={handleText} catalog={SECONDARY_KNOWLEDGES} />
              )}
            </fieldset>
          </div>
        </div>
      </div>

      {/* ── Spheres ── */}
      <div hidden={tab !== 4}>
        <div className="form-section">
          <fieldset>
            <legend>{t('spheres')}</legend>
            <div className="rating-grid">
              {[
                { key: 'sphereCorrespondence', tKey: 'correspondence' },
                { key: 'sphereEntropy',        tKey: 'entropy' },
                { key: 'sphereForces',         tKey: 'forces' },
                { key: 'sphereLife',           tKey: 'life' },
                { key: 'sphereMatter',         tKey: 'matter' },
                { key: 'sphereMind',           tKey: 'mind' },
                { key: 'spherePrime',          tKey: 'prime' },
                { key: 'sphereSpirit',         tKey: 'spirit' },
                { key: 'sphereTime',           tKey: 'time' },
              ].map(s => (
                <DotRating key={s.key} label={t(s.tKey)} name={s.key} value={fields[s.key]} onChange={handleField} min={0} max={5} />
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('arete')}</legend>
            <DotRating label={t('arete')} name="arete" value={fields.arete} onChange={handleField} min={1} max={10} />
          </fieldset>
          <fieldset>
            <legend>{t('quintessenceParadox')}</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="quintessence">{t('quintessence')}</label>
                <input id="quintessence" name="quintessence" type="number" min={0} max={20} value={fields.quintessence} onChange={handleText} />
              </div>
              <div className="field">
                <label htmlFor="paradox">{t('paradox')}</label>
                <input id="paradox" name="paradox" type="number" min={0} max={20} value={fields.paradox} onChange={handleText} />
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('willpower')}</legend>
            <div className="field-row">
              <DotRating label={t('permanent')} name="willpower" value={fields.willpower} onChange={handleField} min={1} max={10} />
              <DotRating label={t('temporary')} name="currentWillpower" value={fields.currentWillpower} onChange={handleField} min={0} max={fields.willpower} />
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('health')}</legend>
            <div className="field">
              <label htmlFor="woundLevel">{t('woundLevel')}</label>
              <select id="woundLevel" value={fields.woundLevel} onChange={e => handleField('woundLevel', parseInt(e.target.value))}>
                {HEALTH_LEVEL_KEYS.map((h, i) => (
                  <option key={i} value={i}>{t(h.key)}{h.penalty ? ` (${h.penalty})` : ''}</option>
                ))}
              </select>
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Rotes ── */}
      <div hidden={tab !== 5}>
        <div className="form-section">
            <fieldset>
              <legend>{t('rotesLegend')} ({rotes.length})</legend>
              {rotes.length === 0 && <p className="muted-hint">{t('noRotesYet')}</p>}
              {rotes.map(r => (
                <div key={r.id} className="character-card" style={{ marginBottom: 'var(--space-sm)' }}>
                  <div className="character-card-info">
                    <h3 style={{ fontSize: '0.9rem' }}>{r.name} <span style={{ fontWeight: 400, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>({t('roteLevel')} {r.level})</span></h3>
                    {r.spheres && <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{t('roteSpheres')}: {r.spheres}</p>}
                    {r.description && <p style={{ fontSize: '0.78rem' }}>{r.description}</p>}
                  </div>
                  <div className="character-card-actions">
                    <button className="btn btn-danger btn-sm" onClick={() => handleRemoveRote(r.id)}>✕</button>
                  </div>
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
                <div className="field">
                  <label>{t('roteName')}</label>
                  <input type="text" value={newRote.name} onChange={e => setNewRote(p => ({ ...p, name: e.target.value }))} placeholder={t('phRoteName')} />
                </div>
                <div className="field">
                  <label>{t('roteSpheres')}</label>
                  <input type="text" value={newRote.spheres} onChange={e => setNewRote(p => ({ ...p, spheres: e.target.value }))} placeholder={t('phRoteSpheres')} />
                </div>
                <div className="field" style={{ maxWidth: 100 }}>
                  <label>{t('roteLevel')}</label>
                  <select value={newRote.level} onChange={e => setNewRote(p => ({ ...p, level: parseInt(e.target.value) }))}>
                    {[1,2,3,4,5,6,7,8,9].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div className="field" style={{ gridColumn: '1 / -1' }}>
                  <label>{t('roteDesc')}</label>
                  <textarea value={newRote.description} onChange={e => setNewRote(p => ({ ...p, description: e.target.value }))} rows={3} placeholder={t('phRoteDesc')} style={{ width: '100%' }} />
                </div>
                <button className="btn btn-secondary" onClick={handleAddRote}>{t('add')}</button>
              </div>
            </fieldset>
        </div>
      </div>

      {/* ── Health ── */}
      <div hidden={tab !== 6}>
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

      {/* ── Backgrounds ── */}
      <div hidden={tab !== 7}>
        <div className="form-section">
              <fieldset>
                <legend>{t('backgrounds')} ({backgrounds.length})</legend>
                {backgrounds.length > 0 && (
                  <ul className="tag-list">
                    {backgrounds.map(b => (
                      <li key={b.id} className="tag">
                        <span>{b.name} ({b.level}){b.description ? ` — ${b.description}` : ''}</span>
                        <button className="tag-remove" onClick={() => { removeBackground(characterId, b.id); setBackgrounds(prev => prev.filter(x => x.id !== b.id)) }}>×</button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="field-row" style={{ alignItems: 'flex-end' }}>
                  <div className="field" style={{ flex: 2 }}>
                    <label htmlFor="bg-name">{t('background')}</label>
                    <input id="bg-name" type="text" list="bg-suggestions" value={newBackground.name}
                      onChange={e => setNewBackground(p => ({ ...p, name: e.target.value }))} autoComplete="off" placeholder={t('phBackground')} />
                    <datalist id="bg-suggestions">
                      {BACKGROUNDS.map(b => <option key={b.value} value={b.value} />)}
                    </datalist>
                  </div>
                  <div className="field">
                    <label htmlFor="bg-level">{t('level')}</label>
                    <select id="bg-level" value={newBackground.level} onChange={e => setNewBackground(p => ({ ...p, level: parseInt(e.target.value) }))}>
                      {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="bg-desc">{t('description')}</label>
                    <input id="bg-desc" type="text" value={newBackground.description} onChange={e => setNewBackground(p => ({ ...p, description: e.target.value }))} autoComplete="off" />
                  </div>
                  <button className="btn btn-secondary" onClick={handleAddBackground}>{t('add')}</button>
                </div>
              </fieldset>
        </div>
      </div>

      {/* ── Merits & Flaws ── */}
      <div hidden={tab !== 8}>
        <div className="form-section">
              <fieldset>
                <legend>{t('merits')} ({merits.length})</legend>
                {merits.length > 0 && (
                  <ul className="tag-list">
                    {merits.map(m => (
                      <li key={m.id} className="tag">
                        <span>{m.merit?.name ?? t('merit')} ({m.pointsSpent} pt)</span>
                        <button className="tag-remove" onClick={() => { removeMerit(characterId, m.id); setMerits(prev => prev.filter(x => x.id !== m.id)) }}>×</button>
                      </li>
                    ))}
                  </ul>
                )}
              </fieldset>
              <fieldset>
                <legend>{t('flaws')} ({flaws.length})</legend>
                {flaws.length > 0 && (
                  <ul className="tag-list">
                    {flaws.map(f => (
                      <li key={f.id} className="tag">
                        <span>{f.flaw?.name ?? t('flaw')} (+{f.pointsGained} pt)</span>
                        <button className="tag-remove" onClick={() => { removeFlaw(characterId, f.id); setFlaws(prev => prev.filter(x => x.id !== f.id)) }}>×</button>
                      </li>
                    ))}
                  </ul>
                )}
              </fieldset>
        </div>
      </div>

      {/* ── Inventory ── */}
      <div hidden={tab !== 9}>
        <div className="form-section">
              <fieldset>
                <legend>{t('addItem')}</legend>
                <div className="field-row">
                  <div className="field" style={{ flex: 2 }}>
                    <label htmlFor="inv-name">{t('name')}</label>
                    <input id="inv-name" type="text" value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))} autoComplete="off" placeholder={t('phInvItem')} />
                  </div>
                  <div className="field">
                    <label htmlFor="inv-cat">{t('category')}</label>
                    <select id="inv-cat" value={newItem.category}
                      onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}>
                      {INVENTORY_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>)}
                    </select>
                  </div>
                  <div className="field" style={{ width: '70px' }}>
                    <label htmlFor="inv-qty">{t('qty')}</label>
                    <input id="inv-qty" type="number" min={1} value={newItem.quantity}
                      onChange={e => setNewItem(p => ({ ...p, quantity: parseInt(e.target.value) || 1 }))} />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="inv-notes">{t('notes')}</label>
                  <input id="inv-notes" type="text" value={newItem.notes}
                    onChange={e => setNewItem(p => ({ ...p, notes: e.target.value }))}
                    placeholder={t('phOptionalNotes')} autoComplete="off" />
                </div>
                <button type="button" className="btn btn-secondary" onClick={handleAddItem}>{t('addToInventory')}</button>
              </fieldset>

              {INVENTORY_CATEGORIES.filter(cat => inventory.some(i => i.category === cat)).map(cat => (
                <fieldset key={cat}>
                  <legend>{cat.charAt(0) + cat.slice(1).toLowerCase() + 's'}</legend>
                  <table className="inv-table">
                    <thead>
                      <tr>
                        <th>{t('name')}</th><th>{t('qty')}</th><th>{t('notes')}</th><th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.filter(i => i.category === cat).map(item => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td className="inv-notes">{item.notes}</td>
                          <td><button className="tag-remove" onClick={() => handleRemoveItem(item.id)}>×</button></td>
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

      {/* ── Focus & Chantry ── */}
      <div hidden={tab !== 10}>
        <div className="form-section">
          <fieldset>
            <legend>{t('focus')}</legend>
            <div className="field">
              <label htmlFor="paradigm">{t('paradigm')}</label>
              <textarea id="paradigm" name="paradigm" value={fields.paradigm} onChange={handleText} rows={3}
                placeholder={t('phParadigm')} />
            </div>
            <div className="field">
              <label htmlFor="practice">{t('practice')}</label>
              <textarea id="practice" name="practice" value={fields.practice} onChange={handleText} rows={3}
                placeholder={t('phPractice')} />
            </div>
            <div className="field">
              <label htmlFor="instruments">{t('instruments')}</label>
              <textarea id="instruments" name="instruments" value={fields.instruments} onChange={handleText} rows={3}
                placeholder={t('phInstruments')} />
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('chantryConstruct')}</legend>
            <div className="field">
              <label htmlFor="chantryName">{t('name')}</label>
              <input id="chantryName" name="chantryName" type="text" value={fields.chantryName} onChange={handleText} autoComplete="off" />
            </div>
            <div className="field">
              <label htmlFor="chantryDescription">{t('chantryDescription')}</label>
              <textarea id="chantryDescription" name="chantryDescription" value={fields.chantryDescription} onChange={handleText} rows={4}
                placeholder={t('phChantryDesc')} />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Backstory ── */}
      <div hidden={tab !== 11}>
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
      <div hidden={tab !== 12}>
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
                        {t('freebieAttrCost')} · {t('freebieAbilCost')} · {t('freebieSphereCost')} · {t('freebieAreteCost')}<br/>
                        {t('freebieBgCost')} · {t('freebieWpCost')} · {t('freebieQuintCost')}
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
                          <option value="Sphere">{t('catSphere')}</option>
                          <option value="Arete">{t('catArete')}</option>
                          <option value="Background">{t('catBackground')}</option>
                          <option value="Willpower">{t('catWillpower')}</option>
                          <option value="Quintessence">{t('catQuintessence')}</option>
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

      {/* ── Save ── */}
      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => navigate('/characters')}>{t('cancel')}</button>
        <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>
          {saving ? t('saving') : t('quickSave')}
        </button>
        <button className="btn btn-primary" onClick={handleDoneEditing} disabled={saving}>
          {t('doneEditing')}
        </button>
      </div>
      {viewMode && (
        <div className="view-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/characters')}>{t('back')}</button>
          <button className="btn btn-primary" onClick={() => navigate(`/characters/${characterId}`, { replace: true })}>{t('edit')}</button>
        </div>
      )}
    </div>
  )
}
