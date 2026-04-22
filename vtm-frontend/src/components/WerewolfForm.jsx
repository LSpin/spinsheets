import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import ExportModal from './ExportModal'
import {
  getCharacter, updateCharacter,
  getDisciplines, addDiscipline, removeDiscipline,
  getBackgrounds, addBackground, removeBackground,
  getMeritCatalog, getFlawCatalog,
  getMerits, getFlaws,
  getInventory,
  getXpLog, addXpLogEntry, removeXpLogEntry,
} from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import MeritsFlawsSection from './MeritsFlawsSection'
import InventorySection from './InventorySection'
import { getGifts, addGift, removeGift, getRites, addRite, removeRite, getFetishes, addFetish, removeFetish } from '../api/werewolfApi'
import DotRating from './DotRating'
import XpLogSection from './XpLogSection'
import { SECONDARY_TALENTS, SECONDARY_SKILLS, SECONDARY_KNOWLEDGES } from '../data/secondaryAbilities'
import { WEREWOLF_GIFTS } from '../data/werewolfGifts'
import { WEREWOLF_RITES } from '../data/werewolfRites'
import { WEREWOLF_TOTEMS } from '../data/werewolfTotems'
import { WEREWOLF_FETISHES, WEREWOLF_TALENS } from '../data/werewolfFetishes'
import { WEREWOLF_BACKGROUNDS as BACKGROUNDS } from '../data/backgrounds'
import CatalogSelect from './CatalogSelect'
import TagInfoPanel from './TagInfoPanel'
import DicePoolsTab from './DicePoolsTab'
import StorytellerDiceRoller from './StorytellerDiceRoller'

// ── Constants ──

const BREEDS = [
  { value: 'Homid', description: 'Born human. Starts with Gnosis 1. Most socially adapted but furthest from the wolf.' },
  { value: 'Metis', description: 'Born of two Garou — forbidden. Starts with Gnosis 3 but bears a deformity. Raised in the sept.' },
  { value: 'Lupus', description: 'Born wolf. Starts with Gnosis 5. Closest to Gaia but struggles with human society.' },
]

const AUSPICES = [
  { value: 'Ragabash', description: 'New Moon — Trickster, scout, questioner of the ways.' },
  { value: 'Theurge', description: 'Crescent Moon — Seer, mystic, speaker to spirits.' },
  { value: 'Philodox', description: 'Half Moon — Judge, mediator, keeper of the Litany.' },
  { value: 'Galliard', description: 'Gibbous Moon — Moon dancer, bard, keeper of tales.' },
  { value: 'Ahroun', description: 'Full Moon — Warrior, champion, protector of the Garou.' },
]

const TRIBES = [
  { value: 'Black Furies', description: 'Matriarchal warriors devoted to Gaia and the Wyld. Defend the sacred feminine and wild places.' },
  { value: 'Bone Gnawers', description: 'Urban scavengers who live among the homeless and outcasts. Masters of survival and street smarts.' },
  { value: 'Children of Gaia', description: 'Peacemakers who seek harmony among the tribes. Mediators and healers of the Garou Nation.' },
  { value: 'Fianna', description: 'Celtic warriors, poets, and revelers. Passionate defenders of art, song, and the fae wilds.' },
  { value: 'Get of Fenris', description: 'Norse berserkers who value strength above all. Fierce warriors who seek glory in battle.' },
  { value: 'Glass Walkers', description: 'Tech-savvy urban wolves who embrace the modern world. Masters of finance and technology.' },
  { value: 'Red Talons', description: 'Lupus-only tribe that despises humanity. Radical defenders of wilderness and wolf-kind.' },
  { value: 'Shadow Lords', description: 'Ambitious schemers who seek to lead the Garou Nation. Masters of politics and manipulation.' },
  { value: 'Silent Striders', description: 'Nomadic wanderers cursed to never find rest. Messengers and scouts who walk between worlds.' },
  { value: 'Silver Fangs', description: 'Noble-blooded rulers of the Garou Nation. Born leaders burdened by madness and inbreeding.' },
  { value: 'Stargazers', description: 'Contemplative mystics seeking inner balance. Masters of enigmas and martial arts.' },
  { value: 'Uktena', description: 'Keepers of dark secrets and forbidden lore. Bind and study the creatures of the Wyrm.' },
  { value: 'Wendigo', description: 'Pure-blooded warriors of the frozen north. Fierce protectors of indigenous peoples and wild lands.' },
  { value: 'Black Spiral Dancers', description: 'Fallen tribe corrupted by the Wyrm. Insane servants of destruction and entropy.' },
  { value: 'Ronin', description: 'Tribeless Garou, outcast and alone. No tribal support but total freedom.' },
  { value: 'Skin Dancers', description: 'Kinfolk who stole the gift of shifting through dark rites. Despised by all true Garou.' },
]

const RANKS = [
  { value: 'Cub', description: 'Newly changed. Not yet a full member of the sept. Must complete a Rite of Passage.' },
  { value: 'Cliath', description: 'Full Garou. Has completed their Rite of Passage and proven worthy of the Nation.' },
  { value: 'Fostern', description: 'Proven warrior. Has earned respect through deeds and shown leadership potential.' },
  { value: 'Adren', description: 'Experienced leader. Commands respect and may lead packs or hold sept positions.' },
  { value: 'Athro', description: 'Elder warrior. A pillar of the sept with decades of service and wisdom.' },
  { value: 'Elder', description: 'Venerated sage. One of the most powerful and respected Garou alive.' },
  { value: 'Legend', description: 'Mythic hero. Spoken of in tales for generations. Nearly unheard-of in modern times.' },
]

const FORM_STATS = [
  { formKey: 'homid',  str: '+0', dex: '+0', sta: '+0', man: '+0', app: '+0', diff: 6, noteKey: 'noChange' },
  { formKey: 'glabro', str: '+2', dex: '+0', sta: '+2', man: '-2', app: '-1', diff: 7, noteKey: '' },
  { formKey: 'crinos', str: '+4', dex: '+1', sta: '+3', man: '-3', app: '0',  diff: 6, noteKey: 'delirium' },
  { formKey: 'hispo',  str: '+3', dex: '+2', sta: '+3', man: '-3', app: '—',  diff: 7, noteKey: 'biteDmg' },
  { formKey: 'lupus',  str: '+1', dex: '+2', sta: '+2', man: '-3', app: '—',  diff: 6, noteKey: 'percDiff' },
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

const AUSPICE_RAGE = { Ragabash: 1, Theurge: 2, Philodox: 3, Galliard: 4, Ahroun: 5 }
const BREED_GNOSIS = { Homid: 1, Metis: 3, Lupus: 5 }
const TRIBE_WP = { 'Black Furies': 3, 'Bone Gnawers': 4, 'Children of Gaia': 4, Fianna: 3, 'Get of Fenris': 3, 'Glass Walkers': 3, 'Red Talons': 3, 'Shadow Lords': 3, 'Silent Striders': 3, 'Silver Fangs': 3, Stargazers: 4, Uktena: 3, Wendigo: 4, 'Black Spiral Dancers': 3, Ronin: 1, 'Skin Dancers': 3 }

const INITIAL = {
  npc: false, splat: 'WEREWOLF',
  name: '', altName: '', concept: '',
  breed: '', auspice: '', tribe: '',
  packName: '', packTotem: '', rank: 'Cub',
  nature: '', demeanor: '',
  // Attributes
  strength: 1, dexterity: 1, stamina: 1,
  charisma: 1, manipulation: 1, appearance: 1,
  perception: 1, intelligence: 1, wits: 1,
  strengthSpec: '', dexteritySpec: '', staminaSpec: '',
  charismaSpec: '', manipulationSpec: '', appearanceSpec: '',
  perceptionSpec: '', intelligenceSpec: '', witsSpec: '',
  // Talents
  alertness: 0, athletics: 0, brawl: 0, empathy: 0, expression: 0,
  intimidation: 0, leadership: 0, primalUrge: 0, streetwise: 0, subterfuge: 0,
  alertnessSpec: '', athleticsSpec: '', brawlSpec: '', empathySpec: '', expressionSpec: '',
  intimidationSpec: '', leadershipSpec: '', primalUrgeSpec: '', streetwiseSpec: '', subterfugeSpec: '',
  // Skills
  animalKen: 0, crafts: 0, drive: 0, etiquette: 0, firearms: 0,
  larceny: 0, melee: 0, performance: 0, stealth: 0, survival: 0,
  animalKenSpec: '', craftsSpec: '', driveSpec: '', etiquetteSpec: '', firearmsSpec: '',
  larcenySpec: '', meleeSpec: '', performanceSpec: '', stealthSpec: '', survivalSpec: '',
  // Knowledges
  academics: 0, computer: 0, enigmas: 0, investigation: 0, law: 0,
  medicine: 0, occult: 0, ritualAbility: 0, science: 0, technology: 0,
  academicsSpec: '', computerSpec: '', enigmasSpec: '', investigationSpec: '', lawSpec: '',
  medicineSpec: '', occultSpec: '', ritualAbilitySpec: '', scienceSpec: '', technologySpec: '',
  // Rage, Gnosis, Willpower
  rage: 1, currentRage: 1,
  gnosis: 1, currentGnosis: 1,
  willpower: 3, currentWillpower: 3,
  // Renown
  glory: 0, currentGlory: 0,
  honor: 0, currentHonor: 0,
  wisdomRenown: 0, currentWisdomRenown: 0,
  // Health
  woundLevel: 0,
  healthBruised: '', healthHurt: '', healthInjured: '', healthWounded: '', healthMauled: '', healthCrippled: '', healthIncap: '',
  // Sept
  septName: '', caernLocation: '', caernType: '', septTotem: '', septLeader: '',
  // Notes
  derangement1: '', derangement2: '', notes: '',
  backstory: '', appearanceDesc: '', goals: '', allies: '', enemies: '', havens: '', territories: '',
  personalItems: '',
  // Secondary Abilities
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
}

function WerewolfRatingRow({ abilityKey, specKey, fields, onField, onText, max = 5, t }) {
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

export default function WerewolfForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const characterId = paramId ? Number(paramId) : null

  const [searchParams] = useSearchParams()
  const guidedMode = searchParams.get('mode') === 'guided'
  const viewMode = searchParams.get('mode') === 'view'

  const { isAutoCreating } = useAutoCreate(characterId, INITIAL)

  const [tab, setTab] = useState(0)
  const [selectedForm, setSelectedForm] = useState('homid')
  const [fields, setFields] = useState(INITIAL)
  const [backgrounds, setBackgrounds] = useState([])
  const [gifts, setGifts] = useState([])
  const [rites, setRites] = useState([])
  const [fetishes, setFetishes] = useState([])
  const [merits, setMerits] = useState([])
  const [flaws, setFlaws] = useState([])
  const [meritCatalog, setMeritCatalog] = useState([])
  const [flawCatalog, setFlawCatalog] = useState([])
  const [inventory, setInventory] = useState([])
  const [newBackground, setNewBackground] = useState({ name: '', level: 1, description: '' })
  const [newGift, setNewGift] = useState({ name: '', level: 1, notes: '' })
  const [newRite, setNewRite] = useState({ name: '', level: 1, notes: '' })
  const [newFetish, setNewFetish] = useState({ name: '', level: 1, gnosisRating: 1, power: '' })
  const [xpLog, setXpLog] = useState([])
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [tagInfo, setTagInfo] = useState(null)

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
    talents: ['alertness', 'athletics', 'brawl', 'empathy', 'expression', 'intimidation', 'leadership', 'primalUrge', 'streetwise', 'subterfuge'],
    skills: ['animalKen', 'crafts', 'drive', 'etiquette', 'firearms', 'larceny', 'melee', 'performance', 'stealth', 'survival'],
    knowledges: ['academics', 'computer', 'enigmas', 'investigation', 'law', 'medicine', 'occult', 'ritualAbility', 'science', 'technology'],
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

  const [fetishSearch, setFetishSearch] = useState('')
  const [bgSearch, setBgSearch] = useState('')

  const TAB_KEYS = ['tabIdentity', 'tabAttributes', 'tabAbilities', 'tabSecondaryAbilities', 'tabGiftsRites', 'tabFetishes', 'tabAdvantages', 'tabHealth', 'tabBackgrounds', 'tabMeritsFlaws', 'tabInventory', 'tabBackstory', 'tabXpLog', 'tabDicePools', 'tabDiceRoller']

  useEffect(() => {
    if (characterId) loadCharacter()
    loadCatalogs()
  }, [characterId])

  async function loadCharacter() {
    try {
      const [charRes, bgRes, giftRes, riteRes, fetishRes, meritRes, flawRes, invRes, xpRes] = await Promise.all([
        getCharacter(characterId),
        getBackgrounds(characterId),
        getGifts(characterId),
        getRites(characterId),
        getFetishes(characterId),
        getMerits(characterId),
        getFlaws(characterId),
        getInventory(characterId),
        getXpLog(characterId),
      ])
      const data = charRes.data
      setFields(prev => {
        const next = { ...prev }
        for (const k of Object.keys(prev)) if (data[k] != null) next[k] = data[k]
        return next
      })
      setBackgrounds(bgRes.data)
      setGifts(giftRes.data)
      setRites(riteRes.data)
      setFetishes(fetishRes.data)
      setMerits(meritRes.data)
      setFlaws(flawRes.data)
      setInventory(invRes.data)
      setXpLog(xpRes.data)
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
    setFields(prev => {
      const next = { ...prev, [name]: value }
      if (name === 'auspice' && AUSPICE_RAGE[value] !== undefined) {
        next.rage = AUSPICE_RAGE[value]
        next.currentRage = AUSPICE_RAGE[value]
      }
      if (name === 'breed' && BREED_GNOSIS[value] !== undefined) {
        next.gnosis = BREED_GNOSIS[value]
        next.currentGnosis = BREED_GNOSIS[value]
      }
      if (name === 'tribe' && TRIBE_WP[value] !== undefined) {
        next.willpower = TRIBE_WP[value]
        next.currentWillpower = TRIBE_WP[value]
      }
      return next
    })
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

  async function handleAddGift() {
    if (!newGift.name.trim() || !characterId) return
    try {
      const res = await addGift(characterId, newGift)
      setGifts(prev => [...prev, res.data])
      setNewGift({ name: '', level: 1, notes: '' })
    } catch {}
  }

  async function handleAddRite() {
    if (!newRite.name.trim() || !characterId) return
    try {
      const res = await addRite(characterId, newRite)
      setRites(prev => [...prev, res.data])
      setNewRite({ name: '', level: 1, notes: '' })
    } catch {}
  }

  async function handleAddFetish() {
    if (!newFetish.name.trim() || !characterId) return
    try {
      const res = await addFetish(characterId, newFetish)
      setFetishes(prev => [...prev, res.data])
      setNewFetish({ name: '', level: 1, gnosisRating: 1, power: '' })
    } catch {}
  }



  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/characters')}>{t('back')}</button>
        <h2>{fields.name || t('newGarou')}</h2>
        <span className="splat-badge splat-badge--werewolf">Werewolf</span>
        {guidedMode && <span className="splat-badge">{t('guidedCreation')}</span>}
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}
      {actionError && <p className="status-error" role="alert">{actionError}</p>}

      {/* Tabs */}
      <div className="tab-list" role="tablist">
        {TAB_KEYS.map((key, i) => (
          <button key={key} role="tab" className={`btn btn-secondary${tab === i ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(i)} aria-selected={tab === i}>{t(key)}</button>
        ))}
      </div>

      {/* ── Identity ── */}
      <div hidden={tab !== 0}>
        <div className="form-section">
          <fieldset>
            <legend>{t('identity')}</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="name">{t('charName')} <span aria-hidden="true">*</span></label>
                <input id="name" name="name" type="text" value={fields.name} onChange={handleText} required autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="altName">{t('deedName')}</label>
                <input id="altName" name="altName" type="text" value={fields.altName} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="concept">{t('concept')}</label>
                <input id="concept" name="concept" type="text" value={fields.concept} onChange={handleText} autoComplete="off" />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('garou')}</legend>
            <div className="field-row">
              <CatalogSelect id="breed" name="breed" label={t('breed')} value={fields.breed} onChange={handleField} catalog={BREEDS} />
              <CatalogSelect id="auspice" name="auspice" label={t('auspice')} value={fields.auspice} onChange={handleField} catalog={AUSPICES} />
              <CatalogSelect id="tribe" name="tribe" label={t('tribe')} value={fields.tribe} onChange={handleField} catalog={TRIBES} />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="packName">{t('packName')}</label>
                <input id="packName" name="packName" type="text" value={fields.packName} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="packTotem">{t('packTotem')}</label>
                <input id="packTotem" name="packTotem" type="text" list="totem-catalog" value={fields.packTotem} onChange={handleText} autoComplete="off" />
                <datalist id="totem-catalog">
                  {WEREWOLF_TOTEMS.map(t => <option key={t.name} value={t.name} />)}
                </datalist>
              </div>
              <CatalogSelect id="rank" name="rank" label={t('rank')} value={fields.rank} onChange={handleField} catalog={RANKS} />
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('sept')}</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="septName">{t('septName')}</label>
                <input id="septName" name="septName" type="text" value={fields.septName} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="caernLocation">{t('caernLocation')}</label>
                <input id="caernLocation" name="caernLocation" type="text" value={fields.caernLocation} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="caernType">{t('caernType')}</label>
                <input id="caernType" name="caernType" type="text" value={fields.caernType} onChange={handleText} autoComplete="off" />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="septTotem">{t('septTotem')}</label>
                <input id="septTotem" name="septTotem" type="text" value={fields.septTotem} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="septLeader">{t('septLeader')}</label>
                <input id="septLeader" name="septLeader" type="text" value={fields.septLeader} onChange={handleText} autoComplete="off" />
              </div>
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
      <div hidden={tab !== 1}>
        <div className="form-section">
          <fieldset>
            <legend>{t('shapeshiftingForms')}</legend>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              {FORM_STATS.map(f => (
                <button key={f.formKey} type="button"
                  className={`btn btn-secondary btn-sm${selectedForm === f.formKey ? ' tab-btn--active' : ''}`}
                  onClick={() => setSelectedForm(f.formKey)}>
                  {t(f.formKey)}
                </button>
              ))}
            </div>
            {(() => {
              const form = FORM_STATS.find(f => f.formKey === selectedForm)
              if (!form || selectedForm === 'homid') return (
                <p className="muted-hint muted-hint--xs">{t('homidNoMods')}</p>
              )
              const FORM_ATTR_MAP = [
                { attr: 'strength', modKey: 'str', label: t('strength') },
                { attr: 'dexterity', modKey: 'dex', label: t('dexterity') },
                { attr: 'stamina', modKey: 'sta', label: t('stamina') },
                { attr: 'manipulation', modKey: 'man', label: t('manipulation') },
                { attr: 'appearance', modKey: 'app', label: t('appearance') },
              ]
              return (
                <div className="form-stat-mods" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
                    {FORM_ATTR_MAP.map(({ attr, modKey, label: attrLabel }) => {
                      const modStr = form[modKey]
                      const base = fields[attr] || 0
                      if (modStr === '0' || modStr === '+0') return null
                      if (modStr === '—') return (
                        <span key={attr} style={{ fontSize: '0.82rem' }}>
                          <strong>{attrLabel}:</strong> <span style={{ color: '#e55' }}>N/A in {t(form.formKey)}</span>
                        </span>
                      )
                      const modVal = parseInt(modStr)
                      if (isNaN(modVal)) return null
                      const effective = modStr === '0' ? 0 : Math.max(0, base + modVal)
                      return (
                        <span key={attr} style={{ fontSize: '0.82rem' }}>
                          <strong>{attrLabel}:</strong> {base} {modVal >= 0 ? '+' : ''}{modVal} = <strong style={{ color: modVal > 0 ? '#6c6' : '#e95' }}>{effective}</strong>
                        </span>
                      )
                    })}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    Difficulty: {form.diff}
                    {form.noteKey && <> · {t(form.noteKey)}</>}
                  </span>
                  {selectedForm === 'crinos' && (
                    <span style={{ fontSize: '0.78rem', color: '#e95', fontWeight: 600 }}>
                      Cannot speak human language in Crinos form. Appearance is 0.
                    </span>
                  )}
                </div>
              )
            })()}
          </fieldset>

          {[
            { legendKey: 'physicalAttr', group: 'physical', attrs: ['strength', 'dexterity', 'stamina'] },
            { legendKey: 'socialAttr',   group: 'social',   attrs: ['charisma', 'manipulation', 'appearance'] },
            { legendKey: 'mentalAttr',   group: 'mental',   attrs: ['perception', 'intelligence', 'wits'] },
          ].map(({ legendKey, group, attrs }) => {
            const form = FORM_STATS.find(f => f.formKey === selectedForm)
            const MOD_MAP = { strength: 'str', dexterity: 'dex', stamina: 'sta', manipulation: 'man', appearance: 'app' }
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
                  {attrs.map(a => {
                    const modKey = MOD_MAP[a]
                    const modStr = form && modKey ? form[modKey] : null
                    const modVal = modStr && modStr !== '—' ? parseInt(modStr) : null
                    const effective = modVal && selectedForm !== 'homid' ? Math.max(0, (fields[a] || 0) + modVal) : null
                    const isZeroed = modStr === '—' && selectedForm !== 'homid'
                    return (
                      <div key={a} className="ability-row">
                        <DotRating label={t(a)} name={a} value={fields[a]} onChange={handleField} min={1} />
                        {effective !== null && effective !== fields[a] && (
                          <span className={`attr-mod ${modVal > 0 ? 'attr-mod--buff' : 'attr-mod--nerf'}`}>
                            = {effective} ({modStr})
                          </span>
                        )}
                        {isZeroed && (
                          <span className="attr-mod attr-mod--nerf">= N/A</span>
                        )}
                        <input className="spec-input" type="text" name={a + 'Spec'} value={fields[a + 'Spec'] ?? ''} onChange={handleText}
                          placeholder={t('specialty')} aria-label={`${t(a)} ${t('specialty')}`} />
                      </div>
                    )
                  })}
                </div>
              </fieldset>
            )
          })}
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
                <p className="muted-hint muted-hint--xs">{t('maxPerAbility')}</p>
              </>
            )}
            <div className="rating-grid">
              {['alertness', 'athletics', 'brawl', 'empathy', 'expression', 'intimidation', 'leadership', 'primalUrge', 'streetwise', 'subterfuge'].map(a =>
                <WerewolfRatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} t={t} />
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
              {['animalKen', 'crafts', 'drive', 'etiquette', 'firearms', 'larceny', 'melee', 'performance', 'stealth', 'survival'].map(a =>
                <WerewolfRatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} t={t} />
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
              {['academics', 'computer', 'enigmas', 'investigation', 'law', 'medicine', 'occult', 'ritualAbility', 'science', 'technology'].map(a =>
                <WerewolfRatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} t={t} />
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

      {/* ── Gifts & Rites ── */}
      <div hidden={tab !== 4}>
        <div className="form-section">
            <>
              <fieldset>
                <legend>{t('gifts')} ({gifts.length})</legend>
                {gifts.length > 0 && (
                  <ul className="tag-list">
                    {gifts.map(g => (
                      <li key={g.id} className="tag">
                        <span>{g.name} (Lv{g.level})</span>
                        <button className="tag-remove" onClick={() => { removeGift(characterId, g.id); setGifts(prev => prev.filter(x => x.id !== g.id)) }}>×</button>
                      </li>
                    ))}
                  </ul>
                )}
                {(() => {
                  const breed = fields.breed || ''
                  const auspice = fields.auspice || ''
                  const tribe = fields.tribe || ''
                  const filtered = WEREWOLF_GIFTS.filter(g =>
                    g.level === newGift.level && (
                      g.breeds.includes(breed) ||
                      g.auspices.includes(auspice) ||
                      g.tribes.includes(tribe) ||
                      (g.breeds.length === 0 && g.auspices.length === 0 && g.tribes.length === 0)
                    )
                  )
                  return (
                    <div className="field-row" style={{ alignItems: 'flex-end' }}>
                      <div className="field">
                        <label htmlFor="gift-level">{t('level')}</label>
                        <select id="gift-level" value={newGift.level} onChange={e => setNewGift(p => ({ ...p, level: parseInt(e.target.value), name: '' }))}>
                          {[1,2,3,4,5,6].map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                      <div className="field" style={{ flex: 2 }}>
                        <label htmlFor="gift-name">{t('giftName')}</label>
                        <input id="gift-name" list="gift-catalog" type="text" value={newGift.name} onChange={e => setNewGift(p => ({ ...p, name: e.target.value }))} autoComplete="off" placeholder={`${filtered.length} gifts available`} />
                        <datalist id="gift-catalog">
                          {filtered.map(g => <option key={g.name} value={g.name} />)}
                        </datalist>
                      </div>
                      <button className="btn btn-secondary" onClick={handleAddGift}>{t('add')}</button>
                    </div>
                  )
                })()}
              </fieldset>

              <fieldset>
                <legend>{t('rites')} ({rites.length})</legend>
                {rites.length > 0 && (
                  <ul className="tag-list">
                    {rites.map(r => (
                      <li key={r.id} className="tag">
                        <span>{r.name} (Lv{r.level})</span>
                        <button className="tag-remove" onClick={() => { removeRite(characterId, r.id); setRites(prev => prev.filter(x => x.id !== r.id)) }}>×</button>
                      </li>
                    ))}
                  </ul>
                )}
                {(() => {
                  const filtered = WEREWOLF_RITES.filter(r => r.level === newRite.level)
                  return (
                    <div className="field-row" style={{ alignItems: 'flex-end' }}>
                      <div className="field">
                        <label htmlFor="rite-level">{t('level')}</label>
                        <select id="rite-level" value={newRite.level} onChange={e => setNewRite(p => ({ ...p, level: parseInt(e.target.value), name: '' }))}>
                          {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                      <div className="field" style={{ flex: 2 }}>
                        <label htmlFor="rite-name">{t('riteName')}</label>
                        <input id="rite-name" list="rite-catalog" type="text" value={newRite.name} onChange={e => setNewRite(p => ({ ...p, name: e.target.value }))} autoComplete="off" placeholder={`${filtered.length} rites available`} />
                        <datalist id="rite-catalog">
                          {filtered.map(r => <option key={r.name} value={r.name} />)}
                        </datalist>
                      </div>
                      <button className="btn btn-secondary" onClick={handleAddRite}>{t('add')}</button>
                    </div>
                  )
                })()}
              </fieldset>

            </>
        </div>
      </div>

      {/* ── Fetishes & Talens ── */}
      <div hidden={tab !== 5}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tabFetishes')} ({fetishes.length})</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Fetishes are permanent spirit-bound items. Talens are single-use. Activating a fetish requires a Gnosis roll.
            </p>
            {fetishes.length > 0 && (
              <table className="inv-table" style={{ marginBottom: 'var(--space-md)' }}>
                <thead><tr><th>Name</th><th>Level</th><th>Gnosis</th><th>Power</th><th></th></tr></thead>
                <tbody>
                  {fetishes.map(f => (
                    <tr key={f.id}>
                      <td style={{ fontWeight: 600 }}>{f.name}</td>
                      <td>{f.level}</td>
                      <td>{f.gnosisRating}</td>
                      <td className="inv-notes">{f.power}</td>
                      <td><button className="tag-remove" onClick={() => { removeFetish(characterId, f.id); setFetishes(prev => prev.filter(x => x.id !== f.id)) }} aria-label={`Remove ${f.name}`}>×</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="field-row" style={{ alignItems: 'flex-end' }}>
              <div className="field" style={{ flex: 2 }}>
                <label>Name</label>
                <input type="text" list="fetish-catalog" value={newFetish.name} onChange={e => {
                  const val = e.target.value
                  const hit = WEREWOLF_FETISHES.find(f => f.name === val)
                  if (hit) setNewFetish(p => ({ ...p, name: hit.name, level: hit.level, gnosisRating: hit.gnosis, power: hit.description }))
                  else setNewFetish(p => ({ ...p, name: val }))
                }} autoComplete="off" placeholder="Search fetish catalogue..." />
                <datalist id="fetish-catalog">
                  {WEREWOLF_FETISHES.map(f => <option key={f.name} value={f.name} />)}
                </datalist>
              </div>
              <div className="field" style={{ width: 70 }}><label>Level</label>
                <select value={newFetish.level} onChange={e => setNewFetish(p => ({ ...p, level: parseInt(e.target.value) }))}>{[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}</select>
              </div>
              <div className="field" style={{ width: 80 }}><label>Gnosis</label>
                <input type="number" min={1} max={10} value={newFetish.gnosisRating} onChange={e => setNewFetish(p => ({ ...p, gnosisRating: parseInt(e.target.value) || 1 }))} />
              </div>
              <button className="btn btn-secondary" onClick={handleAddFetish}>{t('add')}</button>
            </div>
            <div className="field" style={{ marginTop: 'var(--space-sm)' }}>
              <label>Power / Description</label>
              <input type="text" value={newFetish.power} onChange={e => setNewFetish(p => ({ ...p, power: e.target.value }))} placeholder="Describe the fetish's power..." />
            </div>
          </fieldset>

          {/* Fetish Catalogue */}
          <details>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>Fetish Catalogue ({WEREWOLF_FETISHES.length})</summary>
            <div className="catalog-search-wrap" style={{ marginTop: 'var(--space-sm)' }}>
              <input type="search" value={fetishSearch} onChange={e => setFetishSearch(e.target.value)} placeholder="Search fetishes..." />
            </div>
            <table className="inv-table" style={{ marginTop: 'var(--space-xs)' }}>
              <thead><tr><th>Lv</th><th>Name</th><th>Gnosis</th><th>Effect</th></tr></thead>
              <tbody>
                {WEREWOLF_FETISHES.filter(f => !fetishSearch || f.name.toLowerCase().includes(fetishSearch.toLowerCase()) || f.description.toLowerCase().includes(fetishSearch.toLowerCase())).map(f => (
                  <tr key={f.name}>
                    <td style={{ fontWeight: 600, color: 'var(--color-accent-fg)' }}>{f.level}</td>
                    <td style={{ fontWeight: 600 }}>{f.name}</td>
                    <td>{f.gnosis}</td>
                    <td className="inv-notes">{f.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>

          {/* Talen Catalogue */}
          <details style={{ marginTop: 'var(--space-md)' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>Talen Catalogue ({WEREWOLF_TALENS.length})</summary>
            <table className="inv-table" style={{ marginTop: 'var(--space-xs)' }}>
              <thead><tr><th>Name</th><th>Gnosis</th><th>Effect</th></tr></thead>
              <tbody>
                {WEREWOLF_TALENS.map(tl => (
                  <tr key={tl.name}>
                    <td style={{ fontWeight: 600 }}>{tl.name}</td>
                    <td>{tl.gnosis}</td>
                    <td className="inv-notes">{tl.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </div>
      </div>

      {/* ── Renown & Rage ── */}
      <div hidden={tab !== 6}>
        <div className="form-section">
          <fieldset>
            <legend>{t('rage')}</legend>
            <div className="field-row">
              <DotRating label={t('permanentRage')} name="rage" value={fields.rage} onChange={handleField} min={fields.auspice && AUSPICE_RAGE[fields.auspice] ? AUSPICE_RAGE[fields.auspice] : 0} max={10} />
              <DotRating label={t('temporaryRage')} name="currentRage" value={fields.currentRage} onChange={handleField} min={0} max={10} />
            </div>
            {fields.auspice && AUSPICE_RAGE[fields.auspice] !== undefined && (
              <p className="muted-hint muted-hint--xs" style={{ marginTop: 'var(--space-xs)' }}>
                Starting Rage {AUSPICE_RAGE[fields.auspice]} — set by Auspice ({fields.auspice}). Cannot be reduced below this value.
              </p>
            )}
          </fieldset>
          <fieldset>
            <legend>{t('gnosis')}</legend>
            <div className="field-row">
              <DotRating label={t('permanentGnosis')} name="gnosis" value={fields.gnosis} onChange={handleField} min={fields.breed && BREED_GNOSIS[fields.breed] ? BREED_GNOSIS[fields.breed] : 0} max={10} />
              <DotRating label={t('temporaryGnosis')} name="currentGnosis" value={fields.currentGnosis} onChange={handleField} min={0} max={10} />
            </div>
            {fields.breed && BREED_GNOSIS[fields.breed] !== undefined && (
              <p className="muted-hint muted-hint--xs" style={{ marginTop: 'var(--space-xs)' }}>
                Starting Gnosis {BREED_GNOSIS[fields.breed]} — set by Breed ({fields.breed}). Cannot be reduced below this value.
              </p>
            )}
          </fieldset>
          <fieldset>
            <legend>{t('willpower')}</legend>
            <div className="field-row">
              <DotRating label={t('permanent')} name="willpower" value={fields.willpower} onChange={handleField} min={fields.tribe && TRIBE_WP[fields.tribe] ? TRIBE_WP[fields.tribe] : 1} max={10} />
              <DotRating label={t('temporary')} name="currentWillpower" value={fields.currentWillpower} onChange={handleField} min={0} max={fields.willpower} />
            </div>
            {fields.tribe && TRIBE_WP[fields.tribe] !== undefined && (
              <p className="muted-hint muted-hint--xs" style={{ marginTop: 'var(--space-xs)' }}>
                Starting Willpower {TRIBE_WP[fields.tribe]} — set by Tribe ({fields.tribe}). Cannot be reduced below this value.
              </p>
            )}
          </fieldset>
          <fieldset>
            <legend>{t('renown')}</legend>
            <div className="field-row">
              <DotRating label={t('gloryPerm')} name="glory" value={fields.glory} onChange={handleField} min={0} max={10} />
              <DotRating label={t('gloryTemp')} name="currentGlory" value={fields.currentGlory} onChange={handleField} min={0} max={10} />
            </div>
            <div className="field-row">
              <DotRating label={t('honorPerm')} name="honor" value={fields.honor} onChange={handleField} min={0} max={10} />
              <DotRating label={t('honorTemp')} name="currentHonor" value={fields.currentHonor} onChange={handleField} min={0} max={10} />
            </div>
            <div className="field-row">
              <DotRating label={t('wisdomPerm')} name="wisdomRenown" value={fields.wisdomRenown} onChange={handleField} min={0} max={10} />
              <DotRating label={t('wisdomTemp')} name="currentWisdomRenown" value={fields.currentWisdomRenown} onChange={handleField} min={0} max={10} />
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

      {/* ── Health ── */}
      <div hidden={tab !== 7}>
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
        </div>
      </div>

      {/* ── Backgrounds ── */}
      <div hidden={tab !== 8}>
        <div className="form-section">
          <fieldset>
            <legend>{t('backgrounds')} ({backgrounds.length})</legend>
            {backgrounds.length > 0 && (
              <ul className="tag-list" style={{ marginBottom: 'var(--space-md)' }}>
                {backgrounds.map(b => (
                  <li key={b.id} className={`tag tag--clickable${b.id === tagInfo?.id ? ' tag--active' : ''}`}
                    onClick={() => setTagInfo(ti => ti?.id === b.id ? null : { ...b, kind: 'background' })}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTagInfo(ti => ti?.id === b.id ? null : { ...b, kind: 'background' }) } }}
                    role="button"
                    tabIndex={0}>
                    <span>{b.name} ({b.level}){b.description ? ` — ${b.description}` : ''}</span>
                    <button className="tag-remove" onClick={e => { e.stopPropagation(); removeBackground(characterId, b.id); setBackgrounds(prev => prev.filter(x => x.id !== b.id)); if (tagInfo?.id === b.id) setTagInfo(null) }}>×</button>
                  </li>
                ))}
              </ul>
            )}
            {tagInfo?.kind === 'background' && (() => {
              const entry = BACKGROUNDS.find(bg => bg.value.toLowerCase() === tagInfo.name.toLowerCase())
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
      <div hidden={tab !== 9}>
        <MeritsFlawsSection characterId={characterId} merits={merits} setMerits={setMerits} flaws={flaws} setFlaws={setFlaws} meritCatalog={meritCatalog} flawCatalog={flawCatalog} />
      </div>

      {/* ── Inventory ── */}
      <div hidden={tab !== 10}>
        <InventorySection characterId={characterId} inventory={inventory} setInventory={setInventory} personalItems={fields.personalItems} onPersonalItemsChange={handleText} />
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
        <XpLogSection
          splat="werewolf"
          xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)}
          t={t}
        />
      </div>

      {/* ── Dice Pools ── */}
      <div hidden={tab !== 13}>
        <DicePoolsTab fields={fields} splat="WEREWOLF" characterId={characterId} />
      </div>

      {/* ── Dice Roller ── */}
      <div hidden={tab !== 14}>
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
