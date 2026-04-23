import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  getCharacter, updateCharacter,
  getBackgrounds, addBackground, removeBackground,
  getMeritCatalog, getFlawCatalog,
  getMerits, getFlaws,
  getInventory,
  getXpLog, addXpLogEntry, removeXpLogEntry,
  getRotes, addRote, removeRote,
  getDisciplines, addDiscipline, removeDiscipline,
} from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import MeritsFlawsSection from './MeritsFlawsSection'
import InventorySection from './InventorySection'
import DotRating from './DotRating'
import XpLogSection from './XpLogSection'
import { SECONDARY_TALENTS, SECONDARY_SKILLS, SECONDARY_KNOWLEDGES } from '../data/secondaryAbilities'
import { MAGE_TRADITIONS } from '../data/mageTraditions'
import { MAGE_ROTES } from '../data/mageRotes'
import { SPHERE_INFO, SPHERE_KEYS, SPHERE_FIELD_MAP } from '../data/mageSpheres'
import { useLanguage } from '../i18n/LanguageContext'
import ExportModal from './ExportModal'
import CatalogSelect from './CatalogSelect'
import { MAGE_BACKGROUNDS as BACKGROUNDS } from '../data/backgrounds'
import { WONDER_TYPES, MAGE_WONDERS } from '../data/mageWonders'
import { PARADIGMS, PRACTICES, INSTRUMENTS } from '../data/mageFocus'
import TagInfoPanel from './TagInfoPanel'
import DicePoolsTab from './DicePoolsTab'
import StorytellerDiceRoller from './StorytellerDiceRoller'

// ── Constants ──

const TRADITIONS = [
  { value: 'Akashic Brotherhood', description: 'Martial artists and monks seeking perfection of mind, body, and spirit through the Do.' },
  { value: 'Celestial Chorus', description: 'Faithful singers who channel the divine through prayer, song, and religious devotion.' },
  { value: 'Cult of Ecstasy', description: 'Sensory mystics who expand consciousness through pleasure, pain, and altered states.' },
  { value: 'Dreamspeakers', description: 'Shamans and spirit-talkers who walk the Umbra and commune with the spirit world.' },
  { value: 'Euthanatos', description: 'Death mages who maintain the Wheel of Fate, ending lives that have become corrupt.' },
  { value: 'Hollow Ones', description: 'Gothic orphans who reject tradition and embrace the shadows between factions.' },
  { value: 'Order of Hermes', description: 'Hermetic scholars and ceremonial magicians with ancient lineages and rigid hierarchy.' },
  { value: 'Sons of Ether', description: 'Mad scientists who rejected the Technocracy. Inventors of impossible devices.' },
  { value: 'Verbena', description: 'Blood witches and druids who draw power from life, nature, and primal forces.' },
  { value: 'Virtual Adepts', description: 'Hackers and digital mages who reshape reality through code and information.' },
]

const TECHNOCRACY = [
  { value: 'Iteration X', description: 'Cyborg engineers who perfect the human body through biomechanics and cybernetics.' },
  { value: 'New World Order', description: 'Mind-control specialists who shape public perception and maintain the Consensus.' },
  { value: 'Progenitors', description: 'Bioengineers and geneticists who advance human evolution through biological science.' },
  { value: 'Syndicate', description: 'Financial manipulators who control reality through economics, media, and commerce.' },
  { value: 'Void Engineers', description: 'Explorers of Dimensional Science who patrol the borders of reality against threats.' },
]

const AFFILIATIONS = [
  { value: 'Traditions', description: 'The Council of Nine — mystical willworkers united against the Technocracy.' },
  { value: 'Technocracy', description: 'The Technocratic Union — enforcers of scientific Consensus and static reality.' },
  { value: 'Disparates', description: 'Independent crafts and practices outside the main factions. Fiercely autonomous.' },
  { value: 'Orphans', description: 'Mages who Awakened without guidance. Self-taught and unaffiliated with any faction.' },
  { value: 'Nephandi', description: 'Fallen mages who serve the forces of entropy and cosmic corruption.' },
  { value: 'Marauders', description: 'Insane mages whose madness warps reality around them uncontrollably.' },
]

const ESSENCES = [
  { value: 'Dynamic', description: 'Driven by change and passion. Resonates with the Wyld and creative forces.' },
  { value: 'Pattern', description: 'Drawn to structure and order. Resonates with Stasis and the rational world.' },
  { value: 'Primordial', description: 'Connected to raw elemental forces. Resonates with the fundamental building blocks of reality.' },
  { value: 'Questing', description: 'Seekers of truth and meaning. Resonates with exploration and the search for Ascension.' },
]

const ARCHETYPES = [
  { value: 'Architect', description: 'You build something of lasting value, creating structure and order from chaos.' },
  { value: 'Autocrat', description: 'You need control and authority, leading others through strength of will.' },
  { value: 'Bon Vivant', description: 'Life is for pleasure and new experiences. Enjoy every moment to the fullest.' },
  { value: 'Bravo', description: 'Strength and intimidation are your tools. Might makes right.' },
  { value: 'Caregiver', description: 'You protect and nurture others, finding purpose in their wellbeing.' },
  { value: 'Celebrant', description: 'You live for your passion, dedicating yourself fully to a chosen cause or joy.' },
  { value: 'Child', description: 'You depend on others and see the world with innocent or needy eyes.' },
  { value: 'Competitor', description: 'You must be the best. Winning is everything, losing is unacceptable.' },
  { value: 'Conformist', description: 'You follow the group and find safety and identity in belonging.' },
  { value: 'Conniver', description: 'Why work hard when you can trick others into doing it for you?' },
  { value: 'Curmudgeon', description: 'Everything has a flaw. Cynicism and criticism are your default.' },
  { value: 'Deviant', description: 'You reject the mainstream and revel in your outsider status.' },
  { value: 'Director', description: 'You organize and lead, fulfilling your vision through others\' efforts.' },
  { value: 'Enigma', description: 'You are a mystery, even to yourself. Understanding comes through contradiction.' },
  { value: 'Eye of the Storm', description: 'Calm amid chaos. You remain centered while turmoil swirls around you.' },
  { value: 'Fanatic', description: 'Your cause is everything. Nothing else matters beside your fervent belief.' },
  { value: 'Gallant', description: 'You are the dashing hero, living for attention, drama, and romance.' },
  { value: 'Judge', description: 'You seek justice and truth, weighing evidence and rendering fair verdicts.' },
  { value: 'Loner', description: 'You walk alone by choice, relying only on yourself.' },
  { value: 'Martyr', description: 'You suffer so others do not have to, finding meaning in sacrifice.' },
  { value: 'Masochist', description: 'You test your limits through suffering, pushing boundaries of endurance.' },
  { value: 'Monster', description: 'You embrace the darkness within, using cruelty and fear as tools.' },
  { value: 'Pedagogue', description: 'You live to teach and enlighten others, sharing knowledge freely.' },
  { value: 'Penitent', description: 'You seek to atone for past sins through suffering and good works.' },
  { value: 'Perfectionist', description: 'Nothing is ever good enough. You strive for flawless excellence in all things.' },
  { value: 'Rebel', description: 'You defy authority and challenge the status quo at every turn.' },
  { value: 'Rogue', description: 'You look out for yourself first, living by your own rules.' },
  { value: 'Scientist', description: 'You seek rational understanding, testing hypotheses and gathering evidence.' },
  { value: 'Survivor', description: 'You endure no matter what. Nothing can keep you down permanently.' },
  { value: 'Thrill-Seeker', description: 'You live for danger and adrenaline, constantly seeking the next rush.' },
  { value: 'Traditionalist', description: 'The old ways are best. You preserve established customs and values.' },
  { value: 'Trickster', description: 'You use humor, deception, and wit to expose truth and deflate the pompous.' },
  { value: 'Visionary', description: 'You see what could be and inspire others to reach for a better future.' },
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

const INITIAL = {
  npc: false, splat: 'MAGE',
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
  alertness: 0, art: 0, athletics: 0, awareness: 0, brawl: 0, empathy: 0,
  expression: 0, intimidation: 0, leadership: 0, streetwise: 0, subterfuge: 0,
  hobbyTalent1Name: '', hobbyTalent1: 0, hobbyTalent2Name: '', hobbyTalent2: 0, hobbyTalent3Name: '', hobbyTalent3: 0,
  hobbyTalent4Name: '', hobbyTalent4: 0, hobbyTalent5Name: '', hobbyTalent5: 0, hobbyTalent6Name: '', hobbyTalent6: 0,
  hobbyTalent7Name: '', hobbyTalent7: 0, hobbyTalent8Name: '', hobbyTalent8: 0, hobbyTalent9Name: '', hobbyTalent9: 0,
  hobbyTalent10Name: '', hobbyTalent10: 0,
  alertnessSpec: '', artSpec: '', athleticsSpec: '', awarenessSpec: '', brawlSpec: '', empathySpec: '',
  expressionSpec: '', intimidationSpec: '', leadershipSpec: '', streetwiseSpec: '', subterfugeSpec: '',
  hobbyTalent1Spec: '', hobbyTalent2Spec: '', hobbyTalent3Spec: '',
  hobbyTalent4Spec: '', hobbyTalent5Spec: '', hobbyTalent6Spec: '',
  hobbyTalent7Spec: '', hobbyTalent8Spec: '', hobbyTalent9Spec: '',
  hobbyTalent10Spec: '',
  // Skills
  crafts: 0, drive: 0, etiquette: 0, firearms: 0, martialArts: 0, meditation: 0,
  melee: 0, research: 0, stealth: 0, survival: 0, technology: 0,
  profSkill1Name: '', profSkill1: 0, profSkill2Name: '', profSkill2: 0, profSkill3Name: '', profSkill3: 0,
  profSkill4Name: '', profSkill4: 0, profSkill5Name: '', profSkill5: 0, profSkill6Name: '', profSkill6: 0,
  profSkill7Name: '', profSkill7: 0, profSkill8Name: '', profSkill8: 0, profSkill9Name: '', profSkill9: 0,
  profSkill10Name: '', profSkill10: 0,
  craftsSpec: '', driveSpec: '', etiquetteSpec: '', firearmsSpec: '', martialArtsSpec: '', meditationSpec: '',
  meleeSpec: '', researchSpec: '', stealthSpec: '', survivalSpec: '', technologySpec: '',
  profSkill1Spec: '', profSkill2Spec: '', profSkill3Spec: '',
  profSkill4Spec: '', profSkill5Spec: '', profSkill6Spec: '',
  profSkill7Spec: '', profSkill8Spec: '', profSkill9Spec: '',
  profSkill10Spec: '',
  // Knowledges
  academics: 0, computer: 0, cosmology: 0, enigmas: 0, esoterica: 0, investigation: 0,
  law: 0, medicine: 0, occult: 0, politics: 0, science: 0,
  expertKnowl1Name: '', expertKnowl1: 0, expertKnowl2Name: '', expertKnowl2: 0, expertKnowl3Name: '', expertKnowl3: 0,
  expertKnowl4Name: '', expertKnowl4: 0, expertKnowl5Name: '', expertKnowl5: 0, expertKnowl6Name: '', expertKnowl6: 0,
  expertKnowl7Name: '', expertKnowl7: 0, expertKnowl8Name: '', expertKnowl8: 0, expertKnowl9Name: '', expertKnowl9: 0,
  expertKnowl10Name: '', expertKnowl10: 0,
  academicsSpec: '', computerSpec: '', cosmologySpec: '', enigmasSpec: '', esotericaSpec: '', investigationSpec: '',
  lawSpec: '', medicineSpec: '', occultSpec: '', politicsSpec: '', scienceSpec: '',
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

const TAB_KEYS = ['tabIdentity', 'tabAttributes', 'tabAbilities', 'tabSecondaryAbilities', 'tabSpheres', 'tabRotes', 'tabWonders', 'tabHealth', 'tabBackgrounds', 'tabMeritsFlaws', 'tabInventory', 'tabFocusChantry', 'tabBackstory', 'tabXpLog', 'tabDicePools', 'tabDiceRoller']

export default function MageForm() {
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
  const [rotes, setRotes] = useState([])
  const [newRote, setNewRote] = useState({ name: '', spheres: '', level: 1, description: '' })
  const [xpLog, setXpLog] = useState([])
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [tagInfo, setTagInfo] = useState(null)
  const [disciplines, setDisciplines] = useState([])
  const [wonderSearch, setWonderSearch] = useState('')
  const [bgSearch, setBgSearch] = useState('')
  const [newWonder, setNewWonder] = useState({ name: '', level: 1, notes: '' })
  const [roteFilterSphere, setRoteFilterSphere] = useState('')
  const [showGiftRef, setShowGiftRef] = useState(false)

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
    talents: ['alertness', 'art', 'athletics', 'awareness', 'brawl', 'empathy', 'expression', 'intimidation', 'leadership', 'streetwise', 'subterfuge'],
    skills: ['crafts', 'drive', 'etiquette', 'firearms', 'martialArts', 'meditation', 'melee', 'research', 'stealth', 'survival', 'technology'],
    knowledges: ['academics', 'computer', 'cosmology', 'enigmas', 'esoterica', 'investigation', 'law', 'medicine', 'occult', 'politics', 'science'],
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
        {!currentPriority && <span className="priority-hint">{t('unassigned')}</span>}
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
      const [charRes, bgRes, meritRes, flawRes, invRes, xpRes, roteRes, discRes] = await Promise.all([
        getCharacter(characterId),
        getBackgrounds(characterId),
        getMerits(characterId),
        getFlaws(characterId),
        getInventory(characterId),
        getXpLog(characterId),
        getRotes(characterId),
        getDisciplines(characterId),
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
      setDisciplines(discRes.data)
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



  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/characters')}>{t('back')}</button>
        <h2>{fields.name || t('editMage')}</h2>
        <span className="splat-badge splat-badge--mage">{t('mage')}</span>
        {guidedMode && <span className="splat-badge">{t('guidedCreation')}</span>}
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}
      {actionError && <p className="status-error" role="alert">{actionError}</p>}

      {/* Tabs */}
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
              <CatalogSelect id="nature" name="nature" label={t('nature')} value={fields.nature} onChange={handleField} catalog={ARCHETYPES} />
              <CatalogSelect id="demeanor" name="demeanor" label={t('demeanor')} value={fields.demeanor} onChange={handleField} catalog={ARCHETYPES} />
              <CatalogSelect id="essence" name="essence" label={t('essence')} value={fields.essence} onChange={handleField} catalog={ESSENCES} />
            </div>
          </fieldset>

          {fields.essence && (
            <aside className="form-reference-box" role="note" aria-live="polite" style={{ marginBottom: 'var(--space-md)', padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem' }}>Avatar Essence: {fields.essence}</p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                {fields.essence === 'Dynamic' && 'Your Avatar pushes you toward change and action. It rewards bold, transformative deeds and penalizes stagnation.'}
                {fields.essence === 'Pattern' && 'Your Avatar values structure and stability. It rewards methodical progress and penalizes reckless disruption.'}
                {fields.essence === 'Primordial' && 'Your Avatar connects you to primal forces. It rewards communion with fundamental reality and penalizes artificiality.'}
                {fields.essence === 'Questing' && 'Your Avatar drives you to seek and discover. It rewards exploration and new understanding, penalizes complacency.'}
              </p>
            </aside>
          )}

          <fieldset>
            <legend>{t('affiliation')}</legend>
            <div className="field-row">
              <CatalogSelect id="affiliation" name="affiliation" label={t('affiliation')} value={fields.affiliation} onChange={handleField} catalog={AFFILIATIONS} />
              <div className="field">
                <label htmlFor="clan">{factionLabel}</label>
                {factionList.length > 0 ? (
                  <CatalogSelect id="clan" name="clan" value={fields.clan} onChange={handleField} catalog={factionList} showDescOnSelect={true} />
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
      <div role="tabpanel" id={`tabpanel-1`} aria-labelledby={`tab-1`} hidden={tab !== 1}>
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
      <div role="tabpanel" id={`tabpanel-2`} aria-labelledby={`tab-2`} hidden={tab !== 2}>
        <div className="form-section">
          <fieldset>
            <legend>{t('talents')}</legend>
            {guidedMode && (
              <>
                <PrioritySelector group="talents" priorities={abilPriority} setPriorities={setAbilPriority} budgets={ABIL_BUDGETS} />
                <PointsIndicator spent={getAbilSpent('talents')} budget={getAbilBudget('talents')} />
                <p className="muted-hint muted-hint--xs">{t('maxPerAbility')}</p>
              </>
            )}
            <div className="rating-grid">
              {['alertness', 'art', 'athletics', 'awareness', 'brawl', 'empathy', 'expression', 'intimidation', 'leadership', 'streetwise', 'subterfuge'].map(a =>
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
                <p className="muted-hint muted-hint--xs">{t('maxPerAbility')}</p>
              </>
            )}
            <div className="rating-grid">
              {['crafts', 'drive', 'etiquette', 'firearms', 'martialArts', 'meditation', 'melee', 'research', 'stealth', 'survival', 'technology'].map(a =>
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
                <p className="muted-hint muted-hint--xs">{t('maxPerAbility')}</p>
              </>
            )}
            <div className="rating-grid">
              {['academics', 'computer', 'cosmology', 'enigmas', 'esoterica', 'investigation', 'law', 'medicine', 'occult', 'politics', 'science'].map(a =>
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
      <div role="tabpanel" id={`tabpanel-3`} aria-labelledby={`tab-3`} hidden={tab !== 3}>
        <div className="form-section">
          <fieldset>
            <legend>{t('secondaryTalents')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              {t('secondaryAbilitiesHint')}
            </p>
            <div className="rating-grid">
              {Array.from({length: 10}, (_, i) => i + 1).map(i => (
                <CustomAbilityRow
                  key={`hobbyTalent${i}`}
                  nameProp={`hobbyTalent${i}Name`}
                  ratingProp={`hobbyTalent${i}`}
                  placeholder={t('secondaryTalent')}
                  fields={fields}
                  onField={handleField}
                  onText={handleText}
                  catalog={SECONDARY_TALENTS}
                />
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('secondarySkills')}</legend>
            <div className="rating-grid">
              {Array.from({length: 10}, (_, i) => i + 1).map(i => (
                <CustomAbilityRow
                  key={`profSkill${i}`}
                  nameProp={`profSkill${i}Name`}
                  ratingProp={`profSkill${i}`}
                  placeholder={t('secondarySkill')}
                  fields={fields}
                  onField={handleField}
                  onText={handleText}
                  catalog={SECONDARY_SKILLS}
                />
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('secondaryKnowledges')}</legend>
            <div className="rating-grid">
              {Array.from({length: 10}, (_, i) => i + 1).map(i => (
                <CustomAbilityRow
                  key={`expertKnowl${i}`}
                  nameProp={`expertKnowl${i}Name`}
                  ratingProp={`expertKnowl${i}`}
                  placeholder={t('secondaryKnowledge')}
                  fields={fields}
                  onField={handleField}
                  onText={handleText}
                  catalog={SECONDARY_KNOWLEDGES}
                />
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Spheres ── */}
      <div role="tabpanel" id={`tabpanel-4`} aria-labelledby={`tab-4`} hidden={tab !== 4}>
        <div className="form-section">
          <fieldset>
            <legend>{t('areteLabel')}</legend>
            <div className="ability-row">
              <DotRating label={t('areteLabel')} name="arete" value={fields.arete} onChange={handleField} min={1} max={10} />
            </div>
            <p className="muted-hint muted-hint--xs">
              {t('areteHint')}
            </p>
          </fieldset>

          <fieldset>
            <legend>{t('spheres')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              {t('sphereMaxHint').replace('{0}', fields.arete)}
            </p>
            <div className="rating-grid">
              {SPHERE_KEYS.map(key => {
                const field = SPHERE_FIELD_MAP[key]
                const info = SPHERE_INFO[key]
                const val = fields[field] || 0
                const isArchsphere = val >= 6
                return (
                  <div key={key} className="ability-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <DotRating label={info.name} name={field} value={val} onChange={handleField} min={0} max={Math.min(fields.arete || 1, 9)} />
                      {isArchsphere && <span style={{ fontSize: '0.7rem', color: '#c4a35a', fontWeight: 600 }}>ARCH</span>}
                    </div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', margin: 0, paddingLeft: 4 }}>
                      {info.description}
                    </p>
                    {val > 0 && info.levels[val] && (
                      <p style={{ fontSize: '0.72rem', color: val >= 6 ? '#c4a35a' : 'var(--color-text)', margin: 0, paddingLeft: 4, fontStyle: 'italic' }}>
                        {val >= 6 ? `[${val}] ` : `[${val}] `}{info.levels[val]}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend>Resonance</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Resonance reflects how your magic feels and manifests. It colors your Effects and influences how spirits and other mages perceive you.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              {[
                { value: 'Dynamic', desc: 'Energetic, passionate, volatile. Fire, lightning, motion. Magic crackles and surges. Associated with the Wyld.' },
                { value: 'Entropic', desc: 'Decaying, dissolving, darkening. Shadows, cold, entropy. Magic corrodes and unmakes. Associated with the Wyrm.' },
                { value: 'Static', desc: 'Stabilizing, solidifying, ordering. Crystal, geometry, silence. Magic reinforces and binds. Associated with the Weaver.' },
              ].map(res => (
                <div key={res.value} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: 'var(--space-xs)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', minWidth: 70 }}>{res.value}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{res.desc}</span>
                </div>
              ))}
            </div>
            {fields.essence && (
              <p className="muted-hint muted-hint--xs" role="note" aria-live="polite" style={{ marginTop: 'var(--space-xs)' }}>
                Your Essence ({fields.essence}) influences your Resonance.
                {fields.essence === 'Dynamic' && ' Dynamic Essences tend toward Dynamic Resonance.'}
                {fields.essence === 'Pattern' && ' Pattern Essences tend toward Static Resonance.'}
                {fields.essence === 'Primordial' && ' Primordial Essences can lean Dynamic or Entropic.'}
                {fields.essence === 'Questing' && ' Questing Essences vary based on the nature of the quest.'}
              </p>
            )}
          </fieldset>

          <fieldset>
            <legend>{t('quintessenceParadox')}</legend>
            <div className="field-row">
              <DotRating label={t('quintessence')} name="quintessence" value={fields.quintessence} onChange={handleField} min={0} max={20} />
              <DotRating label={t('paradox')} name="paradox" value={fields.paradox} onChange={handleField} min={0} max={20} />
            </div>
            <p className="muted-hint muted-hint--xs" style={{ marginTop: 'var(--space-xs)' }}>
              Quintessence fuels Effects and is stored in your Avatar or a Node. Paradox accumulates from vulgar magic (especially when witnessed by Sleepers).
            </p>
            {fields.paradox >= 5 && fields.paradox < 10 && (
              <p className="status-warning" role="status" aria-live="polite" aria-atomic="true" style={{ marginTop: 'var(--space-xs)', fontSize: '0.8rem' }}>
                Paradox is building up ({fields.paradox}) — risk of Paradox backlash. Quiet may manifest soon.
              </p>
            )}
            {fields.paradox >= 10 && fields.paradox < 15 && (
              <p className="status-error" role="alert" aria-live="assertive" style={{ marginTop: 'var(--space-xs)', fontSize: '0.8rem' }}>
                Dangerous Paradox levels ({fields.paradox}) — severe backlash imminent. Paradox spirits may be drawn to you.
              </p>
            )}
            {fields.paradox >= 15 && (
              <p className="status-error" role="alert" aria-live="assertive" style={{ marginTop: 'var(--space-xs)', fontSize: '0.8rem', fontWeight: 700 }}>
                Critical Paradox ({fields.paradox}) — Paradox Realm or catastrophic backlash likely. Reality is rejecting you.
              </p>
            )}
          </fieldset>
        </div>
      </div>

      {/* ── Rotes ── */}
      <div role="tabpanel" id={`tabpanel-5`} aria-labelledby={`tab-5`} hidden={tab !== 5}>
        <div className="form-section">
          <fieldset>
            <legend>{t('rotes')} ({rotes.length})</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Rotes are tried-and-true magical Effects — specific spells you have practiced and perfected.
            </p>
            {rotes.length > 0 && (
              <>
                <div style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <label htmlFor="rote-filter-sphere" style={{ fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap' }}>Filter by Sphere:</label>
                  <select id="rote-filter-sphere" value={roteFilterSphere} onChange={e => setRoteFilterSphere(e.target.value)}
                    style={{ flex: '0 1 auto', minWidth: 140 }} aria-label="Filter rotes by sphere">
                    <option value="">All Spheres</option>
                    {['Correspondence', 'Entropy', 'Forces', 'Life', 'Matter', 'Mind', 'Prime', 'Spirit', 'Time'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {roteFilterSphere && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }} aria-live="polite" role="status">
                      Showing {rotes.filter(r => (r.spheres || '').toLowerCase().includes(roteFilterSphere.toLowerCase())).length} of {rotes.length} rotes
                    </span>
                  )}
                </div>
                <table className="rote-table" style={{ width: '100%', marginBottom: 'var(--space-md)', fontSize: '0.85rem' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>{t('name')}</th>
                      <th style={{ textAlign: 'left' }}>Spheres</th>
                      <th>Lv</th>
                      <th style={{ textAlign: 'left' }}>{t('description')}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rotes.filter(r => !roteFilterSphere || (r.spheres || '').toLowerCase().includes(roteFilterSphere.toLowerCase())).map(r => (
                      <tr key={r.id}>
                        <td style={{ fontWeight: 600 }}>{r.name}</td>
                        <td style={{ color: 'var(--color-text-muted)' }}>{r.spheres}</td>
                        <td style={{ textAlign: 'center' }}>{r.level}</td>
                        <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{r.description}</td>
                        <td><button className="btn btn-danger btn-sm" onClick={() => handleRemoveRote(r.id)}>×</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            <div className="field-row" style={{ alignItems: 'flex-end', gap: 'var(--space-sm)' }}>
              <div className="field" style={{ flex: 2 }}>
                <label>{t('name')}</label>
                <input type="text" value={newRote.name} onChange={e => setNewRote(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Rote name..." list="rote-catalog-list" />
                <datalist id="rote-catalog-list">
                  {MAGE_ROTES.map(r => <option key={r.name} value={r.name} />)}
                </datalist>
              </div>
              <div className="field" style={{ flex: 1 }}>
                <label>Spheres</label>
                <input type="text" value={newRote.spheres} onChange={e => setNewRote(prev => ({ ...prev, spheres: e.target.value }))}
                  placeholder="e.g. Forces 3, Prime 2" />
              </div>
              <div className="field" style={{ flex: 0, minWidth: 60 }}>
                <label>Lv</label>
                <select value={newRote.level} onChange={e => setNewRote(prev => ({ ...prev, level: parseInt(e.target.value) }))}>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <div className="field" style={{ marginBottom: 'var(--space-sm)' }}>
              <label>{t('description')}</label>
              <textarea value={newRote.description} onChange={e => setNewRote(prev => ({ ...prev, description: e.target.value }))}
                rows={2} style={{ width: '100%' }} placeholder="What does this rote do?" />
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleAddRote}>{t('add')}</button>
          </fieldset>

          <fieldset>
            <legend>Rote Catalogue</legend>
            <details>
              <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>
                Browse {MAGE_ROTES.length} rotes...
              </summary>
              <ul className="catalog-list" style={{ marginTop: 'var(--space-sm)' }}>
                {MAGE_ROTES.map(r => {
                  const already = rotes.some(x => x.name.toLowerCase() === r.name.toLowerCase())
                  return (
                    <li key={r.name} className={`catalog-item${already ? ' catalog-item--added' : ''}`}>
                      <button className="catalog-item-btn" onClick={() => {
                        if (!already) {
                          const entry = { name: r.name, spheres: r.spheres || '', level: r.level || 1, description: r.description || '' }
                          addRote(characterId, entry).then(res => setRotes(prev => [...prev, res.data])).catch(() => {})
                        }
                      }}>
                        <div className="catalog-item-main">
                          <span className="catalog-item-name">{r.name} {r.spheres && <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>— {r.spheres}</span>}</span>
                          <span className="catalog-item-desc">{r.description}</span>
                        </div>
                        <div className="catalog-item-meta">
                          {r.level && <span className="catalog-item-cost">Lv{r.level}</span>}
                          {already ? <span className="catalog-item-check">✓</span> : <span className="catalog-item-add">+</span>}
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </details>
          </fieldset>
        </div>
      </div>

      {/* ── Wonders ── */}
      <div role="tabpanel" id={`tabpanel-6`} aria-labelledby={`tab-6`} hidden={tab !== 6}>
        <div className="form-section">
          <fieldset>
            <legend>Wonders ({disciplines.length})</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Wonders are magical items — Talismans, Devices, Artifacts, Periapts, and more. Created with Prime + other Spheres.
            </p>
            {disciplines.length > 0 && (
              <ul className="tag-list" style={{ marginBottom: 'var(--space-md)' }}>
                {disciplines.map(d => {
                  const entry = MAGE_WONDERS.find(w => w.name.toLowerCase() === d.name.toLowerCase())
                  return (
                    <li key={d.id} className={`tag tag--clickable${d.id === tagInfo?.id ? ' tag--active' : ''}`}
                      onClick={() => setTagInfo(ti => ti?.id === d.id ? null : { ...d, kind: 'wonder' })}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTagInfo(ti => ti?.id === d.id ? null : { ...d, kind: 'wonder' }) } }}
                      role="button"
                      tabIndex={0}>
                      <span>{d.name} (Lv{d.level})</span>
                      <button className="tag-remove" onClick={e => { e.stopPropagation(); removeDiscipline(characterId, d.id); setDisciplines(prev => prev.filter(x => x.id !== d.id)); if (tagInfo?.id === d.id) setTagInfo(null) }}>×</button>
                    </li>
                  )
                })}
              </ul>
            )}
            {tagInfo?.kind === 'wonder' && (() => {
              const entry = MAGE_WONDERS.find(w => w.name.toLowerCase() === tagInfo.name.toLowerCase())
              return (
                <aside className="tag-info-panel" style={{ marginBottom: 'var(--space-md)' }}>
                  <button className="tag-info-panel-close" onClick={() => setTagInfo(null)}>{t('close')}</button>
                  <p className="tag-info-panel-name">{tagInfo.name}</p>
                  <p className="tag-info-panel-desc">Wonder · Level {tagInfo.level}{tagInfo.notes ? ` · ${tagInfo.notes}` : ''}</p>
                  {entry && <p style={{ fontSize: '0.82rem', lineHeight: 1.55 }}>Spheres: {entry.spheres}. {entry.description}</p>}
                </aside>
              )
            })()}
          </fieldset>

          {/* Wonder Types Reference */}
          <fieldset>
            <legend>Wonder Types</legend>
            {WONDER_TYPES.map(wt => (
              <details key={wt.key} style={{ marginBottom: 'var(--space-xs)' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>{wt.label}</summary>
                <p className="muted-hint muted-hint--xs" style={{ padding: 'var(--space-xs) 0' }}>{wt.description}</p>
              </details>
            ))}
          </fieldset>

          {/* Wonder Catalogue */}
          <fieldset>
            <legend>Wonder Catalogue ({MAGE_WONDERS.length})</legend>
            <div className="catalog-search-wrap">
              <input type="search" value={wonderSearch} onChange={e => setWonderSearch(e.target.value)} placeholder="Search wonders by name, type, spheres, or effect..." />
              <span className="catalog-search-count">{MAGE_WONDERS.filter(w => !wonderSearch || w.name.toLowerCase().includes(wonderSearch.toLowerCase()) || w.type.toLowerCase().includes(wonderSearch.toLowerCase()) || w.spheres.toLowerCase().includes(wonderSearch.toLowerCase()) || w.description.toLowerCase().includes(wonderSearch.toLowerCase())).length}</span>
            </div>
            <ul className="catalog-list">
              {MAGE_WONDERS.filter(w => !wonderSearch || w.name.toLowerCase().includes(wonderSearch.toLowerCase()) || w.type.toLowerCase().includes(wonderSearch.toLowerCase()) || w.spheres.toLowerCase().includes(wonderSearch.toLowerCase()) || w.description.toLowerCase().includes(wonderSearch.toLowerCase())).map(w => {
                const already = disciplines.some(d => d.name.toLowerCase() === w.name.toLowerCase())
                return (
                  <li key={w.name} className={`catalog-item${already ? ' catalog-item--added' : ''}`}>
                    <button className="catalog-item-btn" onClick={() => {
                      if (!already) addDiscipline(characterId, { name: w.name, level: w.level, notes: w.type }).then(res => setDisciplines(prev => [...prev, res.data])).catch(() => {})
                    }}>
                      <div className="catalog-item-main">
                        <span className="catalog-item-name">{w.name} <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>— {w.type} · {w.spheres}</span></span>
                        <span className="catalog-item-desc">{w.description}</span>
                      </div>
                      <div className="catalog-item-meta">
                        <span className="catalog-item-cost">Lv{w.level}</span>
                        {already ? <span className="catalog-item-check">✓</span> : <span className="catalog-item-add">+</span>}
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          </fieldset>

          {/* Custom Wonder Creator */}
          <fieldset>
            <legend>Create Custom Wonder</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Design your own Wonder. Give it a name, level, type, and description.
            </p>
            <div className="field-row">
              <div className="field" style={{ flex: 2 }}>
                <label>Wonder Name</label>
                <input type="text" value={newWonder.name} onChange={e => setNewWonder(p => ({ ...p, name: e.target.value }))} placeholder="Name your creation..." />
              </div>
              <div className="field" style={{ width: 70 }}>
                <label>Level</label>
                <select value={newWonder.level} onChange={e => setNewWonder(p => ({ ...p, level: parseInt(e.target.value) }))}>
                  {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Type</label>
                <select value={newWonder.notes} onChange={e => setNewWonder(p => ({ ...p, notes: e.target.value }))}>
                  <option value="">Select type...</option>
                  {WONDER_TYPES.map(wt => <option key={wt.key} value={wt.label}>{wt.label}</option>)}
                </select>
              </div>
            </div>
            <div className="field">
              <label>Spheres Required</label>
              <input type="text" value={newWonder.spheres || ''} onChange={e => setNewWonder(p => ({ ...p, spheres: e.target.value }))} placeholder="e.g. Forces 3, Prime 2" />
            </div>
            <div className="field">
              <label>Description / Powers</label>
              <textarea value={newWonder.description || ''} onChange={e => setNewWonder(p => ({ ...p, description: e.target.value }))} rows={3} style={{ width: '100%' }} placeholder="What does this Wonder do?" />
            </div>
            <button className="btn btn-secondary" onClick={() => {
              if (!newWonder.name.trim()) return
              addDiscipline(characterId, { name: newWonder.name, level: newWonder.level, notes: newWonder.notes || 'Custom' })
                .then(res => { setDisciplines(prev => [...prev, res.data]); setNewWonder({ name: '', level: 1, notes: '' }) })
                .catch(() => setActionError(t('failedToSave')))
            }}>{t('add')}</button>
          </fieldset>
        </div>
      </div>

      {/* ── Health ── */}
      <div role="tabpanel" id={`tabpanel-7`} aria-labelledby={`tab-7`} hidden={tab !== 7}>
        <div className="form-section">
          <fieldset>
            <legend>{t('healthTrack')}</legend>
            <p className="muted-hint muted-hint--sm">{t('healthHint')}</p>
            <table className="health-track">
              <thead>
                <tr>
                  <th>{t('health')}</th>
                  <th>{t('penalty')}</th>
                  <th>{t('damageType')}</th>
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
                    <tr key={h.key}
                      onClick={() => {
                        const cycle = { '': 'B', B: 'L', L: 'A', A: '' }
                        handleField(h.key, cycle[val] || '')
                      }}>
                      <td style={{ fontWeight: val ? 700 : 400 }}>{t(h.label)}</td>
                      <td style={{ color: 'var(--color-text-muted)' }}>{h.penalty || '—'}</td>
                      <td style={{ fontWeight: 600, color: dmgColor }}>{dmgLabel}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </fieldset>

          <fieldset>
            <legend>{t('willpower')}</legend>
            <div className="ability-row">
              <DotRating label={t('willpower')} name="willpower" value={fields.willpower} onChange={handleField} min={1} max={10} />
            </div>
            <div className="ability-row">
              <DotRating label={t('currentWillpower')} name="currentWillpower" value={fields.currentWillpower} onChange={handleField} min={0} max={fields.willpower} />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Backgrounds ── */}
      <div role="tabpanel" id={`tabpanel-8`} aria-labelledby={`tab-8`} hidden={tab !== 8}>
        <div className="form-section">
          <fieldset>
            <legend>{t('backgrounds')} ({backgrounds.length})</legend>
            {backgrounds.length > 0 && (
              <ul className="tag-list" style={{ marginBottom: 'var(--space-md)' }}>
                {backgrounds.map(bg => (
                  <li key={bg.id} className={`tag tag--clickable${bg.id === tagInfo?.id ? ' tag--active' : ''}`}
                    onClick={() => setTagInfo(ti => ti?.id === bg.id ? null : { ...bg, kind: 'background' })}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTagInfo(ti => ti?.id === bg.id ? null : { ...bg, kind: 'background' }) } }}
                    role="button"
                    tabIndex={0}>
                    <span>{bg.name} ({bg.level}){bg.description ? ` — ${bg.description}` : ''}</span>
                    <button className="tag-remove" onClick={e => { e.stopPropagation(); removeBackground(characterId, bg.id); setBackgrounds(prev => prev.filter(x => x.id !== bg.id)); if (tagInfo?.id === bg.id) setTagInfo(null) }}>×</button>
                  </li>
                ))}
              </ul>
            )}
            {tagInfo?.kind === 'background' && (() => {
              const entry = BACKGROUNDS.find(b => b.value.toLowerCase() === tagInfo.name.toLowerCase())
              return (
                <aside className="tag-info-panel" style={{ marginBottom: 'var(--space-md)' }}>
                  <button className="tag-info-panel-close" onClick={() => setTagInfo(null)}>{t('close')}</button>
                  <p className="tag-info-panel-name">{tagInfo.name}</p>
                  <p className="tag-info-panel-desc">Background · Level {tagInfo.level}</p>
                  {entry?.description && <p style={{ fontSize: '0.82rem', lineHeight: 1.55 }}>{entry.description}</p>}
                  {entry?.levels && (
                    <ul className="tag-info-levels">
                      {entry.levels.map((lvl, i) => (
                        <li key={i} className={`tag-info-level${i + 1 === tagInfo.level ? ' tag-info-level--active' : ''}`}>{lvl}</li>
                      ))}
                    </ul>
                  )}
                </aside>
              )
            })()}
          </fieldset>

          <fieldset>
            <legend>Background Catalogue ({BACKGROUNDS.length})</legend>
            <div className="catalog-search-wrap">
              <input type="search" value={bgSearch} onChange={e => setBgSearch(e.target.value)}
                placeholder="Search backgrounds..." aria-label="Search backgrounds" />
              <span className="catalog-search-count">{BACKGROUNDS.filter(b => !bgSearch || b.value.toLowerCase().includes(bgSearch.toLowerCase()) || (b.description || '').toLowerCase().includes(bgSearch.toLowerCase())).length}</span>
            </div>
            <ul className="catalog-list" aria-label="Background catalogue">
              {BACKGROUNDS
                .filter(b => !bgSearch || b.value.toLowerCase().includes(bgSearch.toLowerCase()) || (b.description || '').toLowerCase().includes(bgSearch.toLowerCase()))
                .map(b => {
                  const already = backgrounds.some(bg => bg.name.toLowerCase() === b.value.toLowerCase())
                  return (
                    <li key={b.value} className={`catalog-item${already ? ' catalog-item--added' : ''}`}>
                      <button className="catalog-item-btn" onClick={() => {
                        if (!already) {
                          addBackground(characterId, { name: b.value, level: 1, description: '' })
                            .then(res => setBackgrounds(prev => [...prev, res.data]))
                            .catch(() => setActionError(t('failedToSave')))
                        } else {
                          const bg = backgrounds.find(bg => bg.name.toLowerCase() === b.value.toLowerCase())
                          if (bg) setTagInfo(ti => ti?.id === bg.id ? null : { ...bg, kind: 'background' })
                        }
                      }}>
                        <div className="catalog-item-main">
                          <span className="catalog-item-name">{b.value}</span>
                          {b.description && <span className="catalog-item-desc">{b.description}</span>}
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

      {/* ── Merits & Flaws ── */}
      <div role="tabpanel" id={`tabpanel-9`} aria-labelledby={`tab-9`} hidden={tab !== 9}>
        <MeritsFlawsSection characterId={characterId} merits={merits} setMerits={setMerits} flaws={flaws} setFlaws={setFlaws} meritCatalog={meritCatalog} flawCatalog={flawCatalog} />
      </div>

      {/* ── Inventory ── */}
      <div role="tabpanel" id={`tabpanel-10`} aria-labelledby={`tab-10`} hidden={tab !== 10}>
        <InventorySection characterId={characterId} inventory={inventory} setInventory={setInventory} personalItems={fields.personalItems} onPersonalItemsChange={handleText} />
      </div>

      {/* ── Focus & Chantry ── */}
      <div role="tabpanel" id={`tabpanel-11`} aria-labelledby={`tab-11`} hidden={tab !== 11}>
        <div className="form-section">
          <fieldset>
            <legend>Paradigm</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Your worldview — how you understand reality and magic. Choose from the M20 list or write your own.
            </p>
            <textarea name="paradigm" value={fields.paradigm} onChange={handleText} rows={3} style={{ width: '100%' }} placeholder="Type your paradigm or pick from below..." />
            <details style={{ marginTop: 'var(--space-sm)' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>M20 Paradigms ({PARADIGMS.length})</summary>
              <ul className="catalog-list" style={{ marginTop: 'var(--space-xs)' }}>
                {PARADIGMS.map(p => (
                  <li key={p.name} className="catalog-item">
                    <button className="catalog-item-btn" onClick={() => setFields(prev => ({ ...prev, paradigm: prev.paradigm ? prev.paradigm + '\n' + p.name : p.name }))}>
                      <div className="catalog-item-main">
                        <span className="catalog-item-name">{p.name}</span>
                        <span className="catalog-item-desc">{p.description}</span>
                      </div>
                      <div className="catalog-item-meta"><span className="catalog-item-add">+</span></div>
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          </fieldset>

          <fieldset>
            <legend>Practice</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              The methods you use to work magic. Most mages have one primary practice and may know secondary ones.
            </p>
            <textarea name="practice" value={fields.practice} onChange={handleText} rows={3} style={{ width: '100%' }} placeholder="Type your practice or pick from below..." />
            <details style={{ marginTop: 'var(--space-sm)' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>M20 Practices ({PRACTICES.length})</summary>
              <ul className="catalog-list" style={{ marginTop: 'var(--space-xs)' }}>
                {PRACTICES.map(p => (
                  <li key={p.name} className="catalog-item">
                    <button className="catalog-item-btn" onClick={() => setFields(prev => ({ ...prev, practice: prev.practice ? prev.practice + '\n' + p.name : p.name }))}>
                      <div className="catalog-item-main">
                        <span className="catalog-item-name">{p.name}</span>
                        <span className="catalog-item-desc">{p.description}</span>
                      </div>
                      <div className="catalog-item-meta"><span className="catalog-item-add">+</span></div>
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          </fieldset>

          <fieldset>
            <legend>Paradigm Casting Reference</legend>
            <aside style={{ padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-sm)' }} role="note">
              <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600 }}>Paradigm &amp; Focus Rules</p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                Acting outside your paradigm increases difficulty by +1. Each Arete milestone allows discarding one instrument:
              </p>
              <ul style={{ margin: '0.25rem 0 0', paddingLeft: '1.2rem', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                <li style={{ color: fields.arete >= 3 ? 'var(--color-text)' : undefined, fontWeight: fields.arete >= 3 ? 600 : 400 }}>
                  Arete 3: Discard 1 instrument {fields.arete >= 3 ? '(unlocked)' : `(need Arete 3, currently ${fields.arete})`}
                </li>
                <li style={{ color: fields.arete >= 6 ? 'var(--color-text)' : undefined, fontWeight: fields.arete >= 6 ? 600 : 400 }}>
                  Arete 6: Discard another instrument {fields.arete >= 6 ? '(unlocked)' : `(need Arete 6, currently ${fields.arete})`}
                </li>
                <li style={{ color: fields.arete >= 9 ? 'var(--color-text)' : undefined, fontWeight: fields.arete >= 9 ? 600 : 400 }}>
                  Arete 9: Discard another instrument {fields.arete >= 9 ? '(unlocked)' : `(need Arete 9, currently ${fields.arete})`}
                </li>
              </ul>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.78rem', color: 'var(--color-text-muted)' }} aria-live="polite" role="status">
                At Arete {fields.arete}, you may have discarded up to <strong>{fields.arete >= 9 ? 3 : fields.arete >= 6 ? 2 : fields.arete >= 3 ? 1 : 0}</strong> instrument(s).
                {fields.instruments && (() => {
                  const instrumentList = fields.instruments.split('\n').filter(i => i.trim())
                  return instrumentList.length > 0 ? ` You currently have ${instrumentList.length} instrument(s) listed.` : ''
                })()}
              </p>
            </aside>
          </fieldset>

          <fieldset>
            <legend>Instruments</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              The tools and foci you use. As Arete rises, you may discard instruments. Click to add from the M20 list.
            </p>
            <textarea name="instruments" value={fields.instruments} onChange={handleText} rows={3} style={{ width: '100%' }} placeholder="Type your instruments or pick from below..." />
            <details style={{ marginTop: 'var(--space-sm)' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>M20 Instruments ({INSTRUMENTS.length})</summary>
              <ul className="catalog-list" style={{ marginTop: 'var(--space-xs)' }}>
                {INSTRUMENTS.map(inst => (
                  <li key={inst.name} className="catalog-item">
                    <button className="catalog-item-btn" onClick={() => setFields(prev => ({ ...prev, instruments: prev.instruments ? prev.instruments + '\n' + inst.name : inst.name }))}>
                      <div className="catalog-item-main">
                        <span className="catalog-item-name">{inst.name}</span>
                        <span className="catalog-item-desc">{inst.description}</span>
                      </div>
                      <div className="catalog-item-meta"><span className="catalog-item-add">+</span></div>
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          </fieldset>

          <fieldset>
            <legend>Chantry</legend>
            <div className="field-row">
              <div className="field"><label>Chantry Name</label><input name="chantryName" value={fields.chantryName} onChange={handleText} placeholder="Name of your shared sanctum..." /></div>
            </div>
            <div className="field">
              <label>Chantry Description</label>
              <textarea name="chantryDescription" value={fields.chantryDescription} onChange={handleText} rows={4} style={{ width: '100%' }} placeholder="Location, defenses, Node rating, library, members..." />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Backstory ── */}
      <div role="tabpanel" id={`tabpanel-12`} aria-labelledby={`tab-12`} hidden={tab !== 12}>
        <div className="form-section">
          <fieldset><legend>{t('backstoryLabel')}</legend><textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('appearanceLabel')}</legend><textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('notes')}</legend><textarea name="notes" value={fields.notes} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
        </div>
      </div>

      {/* ── XP Log ── */}
      <div role="tabpanel" id={`tabpanel-13`} aria-labelledby={`tab-13`} hidden={tab !== 13}>
        <XpLogSection
          splat="mage"
          xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)}
          t={t}
        />
      </div>

      {/* ── Dice Pools ── */}
      <div role="tabpanel" id={`tabpanel-14`} aria-labelledby={`tab-14`} hidden={tab !== 14}>
        <DicePoolsTab fields={fields} splat="MAGE" characterId={characterId} />
      </div>

      {/* ── Dice Roller ── */}
      <div role="tabpanel" id={`tabpanel-15`} aria-labelledby={`tab-15`} hidden={tab !== 15}>
        <StorytellerDiceRoller />
      </div>

      {/* ── Save ── */}
      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => setShowExport(true)}>{t('exportPdf')}</button>
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
      <ExportModal open={showExport} onClose={() => setShowExport(false)} tabKeys={TAB_KEYS} t={t} />
    </div>
  )
}
