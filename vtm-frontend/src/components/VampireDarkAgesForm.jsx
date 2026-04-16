import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  getCharacter, createCharacter, updateCharacter,
  getDisciplines, addDiscipline, removeDiscipline,
  getBackgrounds, addBackground, removeBackground,
  getMeritCatalog, getFlawCatalog,
  getMerits, addMerit, removeMerit,
  getFlaws, addFlaw, removeFlaw,
  getInventory, addInventoryItem, removeInventoryItem,
} from '../api/characterApi'
import { joinChronicle } from '../api/chronicleApi'
import DotRating from './DotRating'
import { SECONDARY_TALENTS, SECONDARY_SKILLS, SECONDARY_KNOWLEDGES } from '../data/secondaryAbilities'
import { useLanguage } from '../i18n/LanguageContext'

// ── Constants ──

const TAB_KEYS = ['tabIdentity', 'tabAttributes', 'tabAbilities', 'tabSecondaryAbilities', 'tabAdvantages', 'tabDisciplinesBg', 'tabMeritsFlaws', 'tabInventory']

const CLANS = [
  { value: 'Assamite',          curse: 'The Assamites are compelled to tithe vitae to their elders and are driven to hunt other Cainites. They must make a Willpower roll (Diff 6) each month without consuming Kindred vitae or gain a temporary derangement.' },
  { value: 'Brujah',            curse: 'The difficulty to resist Frenzy is always 1 higher (maximum 10). Brujah are slaves to their passions and rage.' },
  { value: 'Cappadocian',       curse: 'Cappadocians look like corpses. Their Appearance can never exceed 3, and they appear pale and gaunt. Living mortals find their presence deeply unsettling.' },
  { value: 'Followers of Set',  curse: 'Suffer an extra level of damage from sunlight. Add +1 difficulty to all rolls when in bright light of any kind.' },
  { value: 'Gangrel',           curse: 'Each time a Gangrel frenzies, they permanently gain one animalistic feature. These features can only be removed by spending experience points.' },
  { value: 'Giovanni',          curse: 'The Giovanni Kiss is agonizing. Mortals bitten take double damage from blood loss and receive none of the usual Kiss-induced ecstasy.' },
  { value: 'Lasombra',          curse: 'Cast no reflection in mirrors or other reflective surfaces. Their shadow-tainted presence imposes +1 difficulty on Social rolls with non-Lasombra.' },
  { value: 'Malkavian',         curse: 'Every Malkavian has at least one permanent derangement that can never be fully cured.' },
  { value: 'Nosferatu',         curse: 'Appearance is permanently 0 and can never be raised. All Social rolls except Intimidation suffer +1 difficulty.' },
  { value: 'Ravnos',            curse: 'Must indulge a specific vice at least once per night. Each night they resist, they suffer cumulative penalties.' },
  { value: 'Salubri',           curse: 'A third eye opens when using Disciplines. Other Cainites instinctively distrust and hunt the Salubri, believing them soul-stealers.' },
  { value: 'Toreador',          curse: 'When encountering striking beauty, the Toreador must make a Self-Control roll (Diff 6) or become enraptured for a full scene.' },
  { value: 'Tremere',           curse: 'At the moment of Embrace, every Tremere is one step blood bonded to the Council of Seven. The clan watches its own obsessively.' },
  { value: 'Tzimisce',          curse: 'Must sleep surrounded by at least two handfuls of earth from their homeland. Each night without it, they lose one die from all pools.' },
  { value: 'Ventrue',           curse: 'Can only feed from a specific type of mortal chosen at Embrace. Blood from any other source is vomited up.' },
  { value: 'Baali',             curse: 'Infernalist taint — anyone with True Faith senses their corruption. Holy ground deals aggravated damage.' },
  { value: 'Caitiff',           curse: 'No inherent curse, but Caitiff are universally despised. They pay out-of-clan costs for all Disciplines.' },
]

const BACKGROUNDS = [
  { value: 'Allies' },
  { value: 'Contacts' },
  { value: 'Domain' },
  { value: 'Generation' },
  { value: 'Herd' },
  { value: 'Influence' },
  { value: 'Mentor' },
  { value: 'Military Force' },
  { value: 'Resources' },
  { value: 'Retainers' },
  { value: 'Status' },
]

const HEALTH_LEVELS = [
  { key: 'healthy',       penalty: '' },
  { key: 'bruised',       penalty: 'noPenalty' },
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

function ordinal(n) {
  const s = ['th','st','nd','rd'], v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

const INITIAL = {
  // Identity
  npc: false, splat: 'VAMPIRE_DARK_AGES',
  name: '', altName: '', concept: '', clan: '', sect: '',
  generation: 8, nature: '', demeanor: '', domainHaven: '',
  visibleAge: '', totalAge: '',
  // Attributes
  strength: 1, dexterity: 1, stamina: 1,
  charisma: 1, manipulation: 1, appearance: 1,
  perception: 1, intelligence: 1, wits: 1,
  strengthSpec: '', dexteritySpec: '', staminaSpec: '',
  charismaSpec: '', manipulationSpec: '', appearanceSpec: '',
  perceptionSpec: '', intelligenceSpec: '', witsSpec: '',
  // Talents (Dark Ages)
  alertness: 0, athletics: 0, awareness: 0, brawl: 0, empathy: 0,
  expression: 0, intimidation: 0, leadership: 0, legerdemain: 0, subterfuge: 0,
  alertnessSpec: '', athleticsSpec: '', awarenessSpec: '', brawlSpec: '', empathySpec: '',
  expressionSpec: '', intimidationSpec: '', leadershipSpec: '', legerdemainSpec: '', subterfugeSpec: '',
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
  // Skills (Dark Ages)
  animalKen: 0, archery: 0, crafts: 0, etiquette: 0, melee: 0,
  performance: 0, ride: 0, stealth: 0, survival: 0, larceny: 0,
  animalKenSpec: '', archerySpec: '', craftsSpec: '', etiquetteSpec: '', meleeSpec: '',
  performanceSpec: '', rideSpec: '', stealthSpec: '', survivalSpec: '', larcenySpec: '',
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
  // Knowledges (Dark Ages)
  academics: 0, enigmas: 0, hearthWisdom: 0, investigation: 0, law: 0,
  medicine: 0, occult: 0, politics: 0, seneschal: 0, theology: 0,
  academicsSpec: '', enigmasSpec: '', hearthWisdomSpec: '', investigationSpec: '', lawSpec: '',
  medicineSpec: '', occultSpec: '', politicsSpec: '', seneschalSpec: '', theologySpec: '',
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
  // Virtues & Road
  conscience: 1, selfControl: 1, courage: 1,
  pathName: 'Road of Humanity', pathRating: 2,
  willpower: 3, currentWillpower: 3,
  // Blood & Health
  currentBlood: 10, woundLevel: 0,
  // Misc
  derangement1: '', derangement2: '',
  clanCurse: '', notes: '',
}

// ── Helper components ──

function RatingRow({ abilityKey, specKey, fields, onField, onText, t, max = 5 }) {
  return (
    <div className="ability-row">
      <DotRating label={t(abilityKey)} name={abilityKey} value={fields[abilityKey]} onChange={onField} max={max} />
      <input className="spec-input" type="text" name={specKey} value={fields[specKey] ?? ''} onChange={onText}
        placeholder={t('specialty')} aria-label={`${t(abilityKey)} ${t('specialty')}`} />
    </div>
  )
}

function CustomAbilityRow({ nameProp, ratingProp, placeholder, fields, onField, onText, catalog, t, max = 5 }) {
  const match = catalog?.find(c => c.value === fields[nameProp])
  return (
    <div className="custom-ability-row">
      <input type="text" name={nameProp} value={fields[nameProp]} onChange={onText}
        placeholder={placeholder} aria-label={`${placeholder} name`} className="custom-ability-name"
        list={`${nameProp}-list`} />
      {catalog && <datalist id={`${nameProp}-list`}>{catalog.map(c => <option key={c.value} value={c.value} />)}</datalist>}
      <DotRating label="" name={ratingProp} value={fields[ratingProp]} onChange={onField} max={max} />
      {match && <p className="archetype-desc" style={{ gridColumn: '1 / -1', margin: 0 }}>{match.description}</p>}
    </div>
  )
}

// ── Component ──

export default function VampireDarkAgesForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const characterId = paramId ? Number(paramId) : null
  const isEdit = !!characterId

  const [tab, setTab] = useState(0)
  const [fields, setFields] = useState(INITIAL)
  const [disciplines, setDisciplines] = useState([])
  const [backgrounds, setBackgrounds] = useState([])
  const [merits, setMerits] = useState([])
  const [flaws, setFlaws] = useState([])
  const [meritCatalog, setMeritCatalog] = useState([])
  const [flawCatalog, setFlawCatalog] = useState([])
  const [inventory, setInventory] = useState([])
  const [newDiscipline, setNewDiscipline] = useState({ name: '', level: 1 })
  const [newBackground, setNewBackground] = useState({ name: '', level: 1, description: '' })
  const [newItem, setNewItem] = useState({ name: '', notes: '' })
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  const [searchParams] = useSearchParams()
  const guidedMode = searchParams.get('mode') === 'guided'
  const chronicleId = searchParams.get('chronicle')

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
    talents: ['alertness', 'athletics', 'awareness', 'brawl', 'empathy', 'expression', 'intimidation', 'leadership', 'legerdemain', 'subterfuge'],
    skills: ['animalKen', 'archery', 'crafts', 'etiquette', 'melee', 'performance', 'ride', 'stealth', 'survival', 'larceny'],
    knowledges: ['academics', 'enigmas', 'hearthWisdom', 'investigation', 'law', 'medicine', 'occult', 'politics', 'seneschal', 'theology'],
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
  const isHumanity = fields.pathName.trim().toLowerCase() === 'road of humanity'
  const computedPath = fields.conscience + fields.selfControl

  useEffect(() => {
    if (isEdit) loadCharacter()
    loadCatalogs()
  }, [characterId])

  async function loadCharacter() {
    try {
      const [charRes, discRes, bgRes, meritRes, flawRes, invRes] = await Promise.all([
        getCharacter(characterId),
        getDisciplines(characterId),
        getBackgrounds(characterId),
        getMerits(characterId),
        getFlaws(characterId),
        getInventory(characterId),
      ])
      const data = charRes.data
      setFields(prev => {
        const next = { ...prev }
        for (const k of Object.keys(prev)) if (data[k] != null) next[k] = data[k]
        return next
      })
      setDisciplines(discRes.data)
      setBackgrounds(bgRes.data)
      setMerits(meritRes.data)
      setFlaws(flawRes.data)
      setInventory(invRes.data)
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
      // Auto-sync Road of Humanity rating
      if ((name === 'conscience' || name === 'selfControl') &&
          next.pathName.trim().toLowerCase() === 'road of humanity') {
        next.pathRating = next.conscience + next.selfControl
      }
      if (name === 'pathName' && value.trim().toLowerCase() === 'road of humanity') {
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
    if (!fields.name.trim()) { setSaveError(t('nameRequired')); return }
    setSaving(true)
    setSaveError(null)
    try {
      if (isEdit) {
        await updateCharacter(characterId, fields)
      } else {
        const res = await createCharacter(fields)
        // Auto-join chronicle in guided mode
        if (guidedMode && chronicleId) {
          try {
            await joinChronicle(res.data.id, chronicleId)
          } catch { /* chronicle join failed but character was created */ }
        }
        navigate(`/characters/${res.data.id}`, { replace: true })
      }
    } catch (err) {
      setSaveError(err.response?.data?.message || t('failedToSave'))
    } finally { setSaving(false) }
  }

  // Discipline handlers
  async function handleAddDiscipline() {
    if (!newDiscipline.name.trim() || !characterId) return
    try {
      const res = await addDiscipline(characterId, newDiscipline)
      setDisciplines(prev => [...prev, res.data])
      setNewDiscipline({ name: '', level: 1 })
    } catch {}
  }

  // Background handlers
  async function handleAddBackground() {
    if (!newBackground.name.trim() || !characterId) return
    try {
      const res = await addBackground(characterId, newBackground)
      setBackgrounds(prev => [...prev, res.data])
      setNewBackground({ name: '', level: 1, description: '' })
    } catch {}
  }

  // Inventory handlers
  async function handleAddItem() {
    if (!newItem.name.trim() || !characterId) return
    try {
      const res = await addInventoryItem(characterId, { name: newItem.name, category: 'EQUIPMENT', quantity: 1, notes: newItem.notes })
      setInventory(prev => [...prev, res.data])
      setNewItem({ name: '', notes: '' })
    } catch {}
  }

  if (loading) return <p className="status-loading">{t('loading')}</p>

  return (
    <div>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/')}>{t('back')}</button>
        <h2>{isEdit ? fields.name || t('editCainite') : t('newCainite')}</h2>
        <span className="splat-badge splat-badge--vampire-dark-ages">{t('vampireDarkAges')}</span>
        {guidedMode && !isEdit && <span className="splat-badge">{t('guidedCreation')}</span>}
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
          </fieldset>

          <fieldset>
            <legend>{t('cainite')}</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="clan">{t('clan')}</label>
                <select id="clan" name="clan" value={fields.clan} onChange={e => {
                  const val = e.target.value
                  handleField('clan', val)
                  const entry = CLANS.find(c => c.value === val)
                  if (entry) handleField('clanCurse', entry.curse)
                  if (val === 'Nosferatu') handleField('appearance', 0)
                }}>
                  <option value="">{t('select')}</option>
                  {CLANS.map(c => <option key={c.value} value={c.value}>{c.value}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="sect">{t('sect')}</label>
                <input id="sect" name="sect" type="text" value={fields.sect} onChange={handleText} autoComplete="off" placeholder={t('phSectDA')} />
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
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="nature">{t('nature')}</label>
                <input id="nature" name="nature" type="text" value={fields.nature} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="demeanor">{t('demeanor')}</label>
                <input id="demeanor" name="demeanor" type="text" value={fields.demeanor} onChange={handleText} autoComplete="off" />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="domainHaven">{t('domainDA')}</label>
                <input id="domainHaven" name="domainHaven" type="text" value={fields.domainHaven} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="visibleAge">{t('visibleAge')}</label>
                <input id="visibleAge" name="visibleAge" type="text" value={fields.visibleAge} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="totalAge">{t('totalAge')}</label>
                <input id="totalAge" name="totalAge" type="text" value={fields.totalAge} onChange={handleText} autoComplete="off" />
              </div>
            </div>
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
            <legend>{t('clanCurseDerangements')}</legend>
            <div className="field">
              <label htmlFor="clanCurse">{t('clanCurseNotes')}</label>
              <textarea id="clanCurse" name="clanCurse" value={fields.clanCurse} onChange={handleText} rows={3} />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="derangement1">{t('derangements')}</label>
                <input id="derangement1" name="derangement1" type="text" value={fields.derangement1} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="derangement2">{t('derangements')}</label>
                <input id="derangement2" name="derangement2" type="text" value={fields.derangement2} onChange={handleText} autoComplete="off" />
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
              {guidedMode && !isEdit && (
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
            {guidedMode && !isEdit && (
              <>
                <PrioritySelector group="talents" priorities={abilPriority} setPriorities={setAbilPriority} budgets={ABIL_BUDGETS} />
                <PointsIndicator spent={getAbilSpent('talents')} budget={getAbilBudget('talents')} />
                <p className="muted-hint" style={{ fontSize: '0.72rem' }}>{t('maxPerAbility')}</p>
              </>
            )}
            <div className="rating-grid">
              {['alertness', 'athletics', 'awareness', 'brawl', 'empathy', 'expression', 'intimidation', 'leadership', 'legerdemain', 'subterfuge'].map(a =>
                <RatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} t={t} />
              )}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('skills')}</legend>
            {guidedMode && !isEdit && (
              <>
                <PrioritySelector group="skills" priorities={abilPriority} setPriorities={setAbilPriority} budgets={ABIL_BUDGETS} />
                <PointsIndicator spent={getAbilSpent('skills')} budget={getAbilBudget('skills')} />
                <p className="muted-hint" style={{ fontSize: '0.72rem' }}>{t('maxPerAbility')}</p>
              </>
            )}
            <div className="rating-grid">
              {['animalKen', 'archery', 'crafts', 'etiquette', 'melee', 'performance', 'ride', 'stealth', 'survival', 'larceny'].map(a =>
                <RatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} t={t} />
              )}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('knowledges')}</legend>
            {guidedMode && !isEdit && (
              <>
                <PrioritySelector group="knowledges" priorities={abilPriority} setPriorities={setAbilPriority} budgets={ABIL_BUDGETS} />
                <PointsIndicator spent={getAbilSpent('knowledges')} budget={getAbilBudget('knowledges')} />
                <p className="muted-hint" style={{ fontSize: '0.72rem' }}>{t('maxPerAbility')}</p>
              </>
            )}
            <div className="rating-grid">
              {['academics', 'enigmas', 'hearthWisdom', 'investigation', 'law', 'medicine', 'occult', 'politics', 'seneschal', 'theology'].map(a =>
                <RatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} t={t} />
              )}
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Secondary Abilities ── */}
      <div hidden={tab !== 3}>
        <div className="form-section">
          <div className="abilities-group">
            <fieldset>
              <legend>{t('secondaryTalents')}</legend>
              {Array.from({length: 10}, (_, i) => i + 1).map(n =>
                <CustomAbilityRow key={n} nameProp={`hobbyTalent${n}Name`} ratingProp={`hobbyTalent${n}`} placeholder={t('phHobbyTalent')} fields={fields} onField={handleField} onText={handleText} catalog={SECONDARY_TALENTS} t={t} />
              )}
            </fieldset>
            <fieldset>
              <legend>{t('secondarySkills')}</legend>
              {Array.from({length: 10}, (_, i) => i + 1).map(n =>
                <CustomAbilityRow key={n} nameProp={`profSkill${n}Name`} ratingProp={`profSkill${n}`} placeholder={t('phProfSkill')} fields={fields} onField={handleField} onText={handleText} catalog={SECONDARY_SKILLS} t={t} />
              )}
            </fieldset>
            <fieldset>
              <legend>{t('secondaryKnowledges')}</legend>
              {Array.from({length: 10}, (_, i) => i + 1).map(n =>
                <CustomAbilityRow key={n} nameProp={`expertKnowl${n}Name`} ratingProp={`expertKnowl${n}`} placeholder={t('phExpertKnowl')} fields={fields} onField={handleField} onText={handleText} catalog={SECONDARY_KNOWLEDGES} t={t} />
              )}
            </fieldset>
          </div>
        </div>
      </div>

      {/* ── Advantages ── */}
      <div hidden={tab !== 4}>
        <div className="form-section">
          <fieldset>
            <legend>{t('virtues')}</legend>
            <div className="rating-grid">
              <DotRating label={t('conscience')}  name="conscience"   value={fields.conscience}   onChange={handleField} min={1} />
              <DotRating label={t('selfControl')} name="selfControl"  value={fields.selfControl}  onChange={handleField} min={1} />
              <DotRating label={t('courage')}     name="courage"      value={fields.courage}      onChange={handleField} min={1} />
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('roadOfEnlightenment')}</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="pathName">{t('roadName')}</label>
                <select id="pathName" name="pathName" value={fields.pathName} onChange={handleText}>
                  <option value="Road of Humanity">{t('roadHumanity')}</option>
                  <option value="Road of the Beast">{t('roadBeast')}</option>
                  <option value="Road of Heaven">{t('roadHeaven')}</option>
                  <option value="Road of Kings">{t('roadKings')}</option>
                  <option value="Road of Sin">{t('roadSin')}</option>
                  <option value="Road of Bones">{t('roadBones')}</option>
                  <option value="Road of Blood">{t('roadBlood')}</option>
                  <option value="Road of Night">{t('roadNight')}</option>
                  <option value="Road of the Serpent">{t('roadSerpent')}</option>
                  <option value="Road of Paradox">{t('roadParadox')}</option>
                  <option value="Road of Lilith">{t('roadLilith')}</option>
                  <option value="Road of Metamorphosis">{t('roadMetamorphosis')}</option>
                  <option value="Road of the Devil">{t('roadDevil')}</option>
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
              <select id="woundLevel" value={fields.woundLevel} onChange={e => handleField('woundLevel', parseInt(e.target.value))}>
                {HEALTH_LEVELS.map((h, i) => (
                  <option key={i} value={i}>{t(h.key)}{h.penalty ? ` ${/^[a-z]/i.test(h.penalty) ? t(h.penalty) : h.penalty}` : ''}</option>
                ))}
              </select>
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Disciplines & Backgrounds ── */}
      <div hidden={tab !== 5}>
        <div className="form-section">
          {!isEdit && <p className="muted-hint">{t('saveCharFirstDiscBg')}</p>}
          {isEdit && (
            <>
              <fieldset>
                <legend>{t('disciplines')} ({disciplines.length})</legend>
                {disciplines.length > 0 && (
                  <ul className="tag-list">
                    {disciplines.map(d => (
                      <li key={d.id} className="tag">
                        <span>{d.name} (Lv{d.level})</span>
                        <button className="tag-remove" onClick={() => { removeDiscipline(characterId, d.id); setDisciplines(prev => prev.filter(x => x.id !== d.id)) }}>×</button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="field-row" style={{ alignItems: 'flex-end' }}>
                  <div className="field" style={{ flex: 2 }}>
                    <label htmlFor="disc-name">{t('disciplineName')}</label>
                    <input id="disc-name" type="text" value={newDiscipline.name} onChange={e => setNewDiscipline(p => ({ ...p, name: e.target.value }))} autoComplete="off" placeholder={t('phDiscipline')} />
                  </div>
                  <div className="field">
                    <label htmlFor="disc-level">{t('level')}</label>
                    <select id="disc-level" value={newDiscipline.level} onChange={e => setNewDiscipline(p => ({ ...p, level: parseInt(e.target.value) }))}>
                      {[1,2,3,4,5,6,7,8,9,10].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <button className="btn btn-secondary" onClick={handleAddDiscipline}>{t('add')}</button>
                </div>
              </fieldset>

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
            </>
          )}
        </div>
      </div>

      {/* ── Merits & Flaws ── */}
      <div hidden={tab !== 6}>
        <div className="form-section">
          {!isEdit && <p className="muted-hint">{t('saveCharFirstMeritsFlaw')}</p>}
          {isEdit && (
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
          )}
        </div>
      </div>

      {/* ── Inventory ── */}
      <div hidden={tab !== 7}>
        <div className="form-section">
          {!isEdit && <p className="muted-hint">{t('saveCharFirstInventory')}</p>}
          {isEdit && (
            <fieldset>
              <legend>{t('tabInventory')} ({inventory.length})</legend>
              {inventory.length > 0 && (
                <ul className="tag-list">
                  {inventory.map(item => (
                    <li key={item.id} className="tag">
                      <span>{item.name}{item.notes ? ` — ${item.notes}` : ''}</span>
                      <button className="tag-remove" onClick={() => { removeInventoryItem(characterId, item.id); setInventory(prev => prev.filter(x => x.id !== item.id)) }}>×</button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="field-row" style={{ alignItems: 'flex-end' }}>
                <div className="field" style={{ flex: 2 }}>
                  <label htmlFor="item-name">{t('itemName')}</label>
                  <input id="item-name" type="text" value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))} autoComplete="off" />
                </div>
                <div className="field" style={{ flex: 2 }}>
                  <label htmlFor="item-notes">{t('notes')}</label>
                  <input id="item-notes" type="text" value={newItem.notes} onChange={e => setNewItem(p => ({ ...p, notes: e.target.value }))} autoComplete="off" />
                </div>
                <button className="btn btn-secondary" onClick={handleAddItem}>{t('add')}</button>
              </div>
            </fieldset>
          )}
        </div>
      </div>

      {/* ── Save ── */}
      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => navigate('/')}>{t('cancel')}</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? t('saving') : isEdit ? t('saveChanges') : t('createCharacter')}
        </button>
      </div>
    </div>
  )
}
