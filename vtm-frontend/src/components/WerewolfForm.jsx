import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import {
  getCharacter, updateCharacter,
  getDisciplines, addDiscipline, removeDiscipline,
  getBackgrounds, addBackground, removeBackground,
  getMeritCatalog, getFlawCatalog,
  getMerits, addMerit, removeMerit,
  getFlaws, addFlaw, removeFlaw,
  getInventory, addInventoryItem, removeInventoryItem,
  getXpLog, addXpLogEntry, removeXpLogEntry,
} from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import { getGifts, addGift, removeGift, getRites, addRite, removeRite, getFetishes, addFetish, removeFetish } from '../api/werewolfApi'
import DotRating from './DotRating'
import { SECONDARY_TALENTS, SECONDARY_SKILLS, SECONDARY_KNOWLEDGES } from '../data/secondaryAbilities'
import { WEREWOLF_GIFTS } from '../data/werewolfGifts'

// ── Constants ──

const BREEDS = ['Homid', 'Metis', 'Lupus']

const AUSPICES = [
  { value: 'Ragabash', description: 'New Moon — Trickster, scout, questioner of the ways.' },
  { value: 'Theurge', description: 'Crescent Moon — Seer, mystic, speaker to spirits.' },
  { value: 'Philodox', description: 'Half Moon — Judge, mediator, keeper of the Litany.' },
  { value: 'Galliard', description: 'Gibbous Moon — Moon dancer, bard, keeper of tales.' },
  { value: 'Ahroun', description: 'Full Moon — Warrior, champion, protector of the Garou.' },
]

const TRIBES = [
  'Black Furies', 'Bone Gnawers', 'Children of Gaia', 'Fianna', 'Get of Fenris',
  'Glass Walkers', 'Red Talons', 'Shadow Lords', 'Silent Striders', 'Silver Fangs',
  'Stargazers', 'Uktena', 'Wendigo',
  'Black Spiral Dancers', 'Ronin', 'Skin Dancers',
]

const RANKS = ['Cub', 'Cliath', 'Fostern', 'Adren', 'Athro', 'Elder', 'Legend']

const BACKGROUNDS = [
  { value: 'Allies', description: 'Human friends and contacts who aid the Garou.' },
  { value: 'Ancestors', description: 'Access to the wisdom and memories of past lives.' },
  { value: 'Contacts', description: 'Informants and sources of information.' },
  { value: 'Fetish', description: 'Spirit-bound objects of power.' },
  { value: 'Kinfolk', description: 'Human or wolf relatives aware of the Garou.' },
  { value: 'Mentor', description: 'An elder who guides and teaches.' },
  { value: 'Pure Breed', description: 'The purity of your Garou bloodline.' },
  { value: 'Resources', description: 'Wealth and material assets.' },
  { value: 'Rites', description: 'Knowledge and access to Garou rites.' },
  { value: 'Totem', description: 'The pack\'s patron spirit.' },
  { value: 'Haven', description: 'The safety and secrecy of your primary resting place.' },
  { value: 'Haven Security', description: 'Physical defences and countermeasures protecting your haven.' },
  { value: 'Haven Luxury', description: 'The comfort, amenities, and opulence of your haven.' },
  { value: 'Haven Size', description: 'The physical extent and number of rooms in your haven.' },
  // ── Specialized (Werewolf) ──
  { value: 'Spirit Heritage', description: 'A connection to a powerful spirit lineage that grants spiritual favours and recognition.' },
  { value: 'Numen', description: 'Raw spiritual power that can be channelled into rites, gifts, or spirit interactions.' },
  { value: 'Den-Realm', description: 'A personal pocket realm within the Umbra tied to your identity.' },
  { value: 'Fate', description: 'A prophesied destiny that draws events toward you — for good or ill.' },
  { value: 'Past Life', description: 'Vivid memories of a previous incarnation that grant knowledge and skills from another era.' },
  { value: 'Territory', description: 'Land you patrol and defend — hunting grounds, bawn, or urban turf.' },
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

  const { isAutoCreating } = useAutoCreate(characterId, INITIAL)

  const [tab, setTab] = useState(0)
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

  const TAB_KEYS = ['tabIdentity', 'tabAttributes', 'tabAbilities', 'tabSecondaryAbilities', 'tabGiftsRites', 'tabAdvantages', 'tabHealth', 'tabBackgrounds', 'tabMeritsFlaws', 'tabForms', 'tabBackstory', 'tabXpLog']

  useEffect(() => {
    if (characterId) loadCharacter()
    loadCatalogs()
  }, [characterId])

  async function loadCharacter() {
    try {
      const [charRes, bgRes, giftRes, riteRes, fetishRes, meritRes, flawRes, xpRes] = await Promise.all([
        getCharacter(characterId),
        getBackgrounds(characterId),
        getGifts(characterId),
        getRites(characterId),
        getFetishes(characterId),
        getMerits(characterId),
        getFlaws(characterId),
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
      if (guidedMode) {
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
    <div>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/')}>{t('back')}</button>
        <h2>{fields.name || t('newGarou')}</h2>
        <span className="splat-badge splat-badge--werewolf">Werewolf</span>
        {guidedMode && <span className="splat-badge">{t('guidedCreation')}</span>}
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}

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
              <div className="field">
                <label htmlFor="breed">{t('breed')}</label>
                <select id="breed" name="breed" value={fields.breed} onChange={handleText}>
                  <option value="">{t('select')}</option>
                  {BREEDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="auspice">{t('auspice')}</label>
                <select id="auspice" name="auspice" value={fields.auspice} onChange={handleText}>
                  <option value="">{t('select')}</option>
                  {AUSPICES.map(a => <option key={a.value} value={a.value}>{a.value}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="tribe">{t('tribe')}</label>
                <select id="tribe" name="tribe" value={fields.tribe} onChange={handleText}>
                  <option value="">{t('select')}</option>
                  {TRIBES.map(tr => <option key={tr} value={tr}>{tr}</option>)}
                </select>
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="packName">{t('packName')}</label>
                <input id="packName" name="packName" type="text" value={fields.packName} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="packTotem">{t('packTotem')}</label>
                <input id="packTotem" name="packTotem" type="text" value={fields.packTotem} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="rank">{t('rank')}</label>
                <select id="rank" name="rank" value={fields.rank} onChange={handleText}>
                  {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="npc">{t('type')}</label>
                <div className="role-toggle" role="radiogroup" aria-label="Character type">
                  <button type="button" className={`role-toggle-btn${!fields.npc ? ' role-toggle-btn--active' : ''}`}
                    onClick={() => handleField('npc', false)}>PC</button>
                  <button type="button" className={`role-toggle-btn${fields.npc ? ' role-toggle-btn--active' : ''}`}
                    onClick={() => handleField('npc', true)}>{t('npc')}</button>
                </div>
              </div>
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
          {[
            { legendKey: 'physicalAttr', group: 'physical', attrs: ['strength', 'dexterity', 'stamina'] },
            { legendKey: 'socialAttr',   group: 'social',   attrs: ['charisma', 'manipulation', 'appearance'] },
            { legendKey: 'mentalAttr',   group: 'mental',   attrs: ['perception', 'intelligence', 'wits'] },
          ].map(({ legendKey, group, attrs }) => (
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
                <p className="muted-hint" style={{ fontSize: '0.72rem' }}>{t('maxPerAbility')}</p>
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
                <p className="muted-hint" style={{ fontSize: '0.72rem' }}>{t('maxPerAbility')}</p>
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
                <div className="field-row" style={{ alignItems: 'flex-end' }}>
                  <div className="field" style={{ flex: 2 }}>
                    <label htmlFor="rite-name">{t('riteName')}</label>
                    <input id="rite-name" type="text" value={newRite.name} onChange={e => setNewRite(p => ({ ...p, name: e.target.value }))} autoComplete="off" />
                  </div>
                  <div className="field">
                    <label htmlFor="rite-level">{t('level')}</label>
                    <select id="rite-level" value={newRite.level} onChange={e => setNewRite(p => ({ ...p, level: parseInt(e.target.value) }))}>
                      {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <button className="btn btn-secondary" onClick={handleAddRite}>{t('add')}</button>
                </div>
              </fieldset>

              <fieldset>
                <legend>{t('fetishes')} ({fetishes.length})</legend>
                {fetishes.length > 0 && (
                  <ul className="tag-list">
                    {fetishes.map(f => (
                      <li key={f.id} className="tag">
                        <span>{f.name} (Lv{f.level}, {t('gnosis')} {f.gnosisRating})</span>
                        <button className="tag-remove" onClick={() => { removeFetish(characterId, f.id); setFetishes(prev => prev.filter(x => x.id !== f.id)) }}>×</button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="field-row" style={{ alignItems: 'flex-end' }}>
                  <div className="field" style={{ flex: 2 }}>
                    <label htmlFor="fetish-name">{t('fetishName')}</label>
                    <input id="fetish-name" type="text" value={newFetish.name} onChange={e => setNewFetish(p => ({ ...p, name: e.target.value }))} autoComplete="off" />
                  </div>
                  <div className="field">
                    <label htmlFor="fetish-level">{t('level')}</label>
                    <select id="fetish-level" value={newFetish.level} onChange={e => setNewFetish(p => ({ ...p, level: parseInt(e.target.value) }))}>
                      {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="fetish-gnosis">{t('gnosis')}</label>
                    <select id="fetish-gnosis" value={newFetish.gnosisRating} onChange={e => setNewFetish(p => ({ ...p, gnosisRating: parseInt(e.target.value) }))}>
                      {[1,2,3,4,5,6,7,8,9,10].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <button className="btn btn-secondary" onClick={handleAddFetish}>{t('add')}</button>
                </div>
              </fieldset>
            </>
        </div>
      </div>

      {/* ── Renown & Rage ── */}
      <div hidden={tab !== 5}>
        <div className="form-section">
          <fieldset>
            <legend>{t('rage')}</legend>
            <div className="field-row">
              <DotRating label={t('permanentRage')} name="rage" value={fields.rage} onChange={handleField} min={0} max={10} />
              <DotRating label={t('temporaryRage')} name="currentRage" value={fields.currentRage} onChange={handleField} min={0} max={10} />
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('gnosis')}</legend>
            <div className="field-row">
              <DotRating label={t('permanentGnosis')} name="gnosis" value={fields.gnosis} onChange={handleField} min={0} max={10} />
              <DotRating label={t('temporaryGnosis')} name="currentGnosis" value={fields.currentGnosis} onChange={handleField} min={0} max={10} />
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
            <>
              <fieldset>
                <legend>{t('merits')} ({merits.length})</legend>
                {merits.length > 0 && (
                  <ul className="tag-list">
                    {merits.map(m => (
                      <li key={m.id} className="tag">
                        <span>{m.merit?.name ?? t('merits')} ({m.pointsSpent} pt)</span>
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
                        <span>{f.flaw?.name ?? t('flaws')} (+{f.pointsGained} pt)</span>
                        <button className="tag-remove" onClick={() => { removeFlaw(characterId, f.id); setFlaws(prev => prev.filter(x => x.id !== f.id)) }}>×</button>
                      </li>
                    ))}
                  </ul>
                )}
              </fieldset>
            </>
        </div>
      </div>

      {/* ── Forms ── */}
      <div hidden={tab !== 9}>
        <div className="form-section">
          <fieldset>
            <legend>{t('shapeshiftingForms')}</legend>
            <div style={{ overflowX: 'auto' }}>
              <table className="inv-table">
                <thead>
                  <tr>
                    <th>{t('form')}</th><th>{t('strength')}</th><th>{t('dexterity')}</th><th>{t('stamina')}</th><th>{t('manipulation')}</th><th>{t('appearance')}</th><th>{t('diff')}</th><th>{t('notes')}</th>
                  </tr>
                </thead>
                <tbody>
                  {FORM_STATS.map(f => (
                    <tr key={f.formKey}>
                      <td style={{ fontWeight: 600 }}>{t(f.formKey)}</td>
                      <td>{f.str}</td><td>{f.dex}</td><td>{f.sta}</td>
                      <td>{f.man}</td><td>{f.app}</td><td>{f.diff}</td>
                      <td className="inv-notes">{f.noteKey ? t(f.noteKey) : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="muted-hint" style={{ marginTop: 'var(--space-sm)' }}>
              {t('formsHint')}
            </p>
          </fieldset>
        </div>
      </div>

      {/* ── Backstory ── */}
      <div hidden={tab !== 10}>
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
      <div hidden={tab !== 11}>
        <div className="form-section">
            <>
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
                        {t('freebieAttrCost')} · {t('freebieAbilCost')} · {t('freebieGiftCost')} · {t('freebieBgCost')}<br/>
                        {t('freebieRageCost')} · {t('freebieGnosisCost')} · {t('freebieWpCost')}
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
                          <option value="Gift">{t('catGift')}</option>
                          <option value="Background">{t('catBackground')}</option>
                          <option value="Rage">{t('catRage')}</option>
                          <option value="Gnosis">{t('catGnosis')}</option>
                          <option value="Willpower">{t('catWillpower')}</option>
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
            </>
        </div>
      </div>

      {/* ── Save ── */}
      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => navigate('/')}>{t('cancel')}</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? t('saving') : t('saveChanges')}
        </button>
      </div>
    </div>
  )
}
