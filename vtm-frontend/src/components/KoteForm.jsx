import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
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
import DotRating from './DotRating'
import { SECONDARY_TALENTS, SECONDARY_SKILLS, SECONDARY_KNOWLEDGES } from '../data/secondaryAbilities'
import { useLanguage } from '../i18n/LanguageContext'

// ── Constants ──

const DHARMAS = [
  'The Howl of the Devil-Tiger',
  'The Way of the Resplendent Crane',
  'The Song of the Shadow (Bone Flowers)',
  'The Dance of the Thrashing Dragon',
  'The Path of a Thousand Whispers',
  'The Face of the Gods',
  'The Flame of the Rising Phoenix',
  'The Spirit of the Living Earth',
  'The Tempest of the Inward Focus',
  'Scorpion Eaters',
]

const DIRECTIONS = ['North', 'South', 'East', 'West', 'Center']

const BALANCES = ['Yin', 'Yang', 'Balanced']

const BACKGROUNDS = [
  { value: 'Allies' },
  { value: 'Contacts' },
  { value: 'Horoscope' },
  { value: 'Influence' },
  { value: 'Jade Talisman' },
  { value: 'Magic Artifact' },
  { value: 'Mentor' },
  { value: 'Nushi' },
  { value: 'Resources' },
  { value: 'Retainers' },
  { value: 'Rites' },
  { value: 'Haven' },
  { value: 'Haven Security' },
  { value: 'Haven Luxury' },
  { value: 'Haven Size' },
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
  npc: false, splat: 'KOTE',
  name: '', altName: '', concept: '',
  nature: '', demeanor: '',
  poNature: '', balance: '', direction: '', wu: '',
  // Attributes
  strength: 1, dexterity: 1, stamina: 1,
  charisma: 1, manipulation: 1, appearance: 1,
  perception: 1, intelligence: 1, wits: 1,
  strengthSpec: '', dexteritySpec: '', staminaSpec: '',
  charismaSpec: '', manipulationSpec: '', appearanceSpec: '',
  perceptionSpec: '', intelligenceSpec: '', witsSpec: '',
  // Talents
  alertness: 0, athletics: 0, brawl: 0, dodge: 0, empathy: 0,
  expression: 0, intimidation: 0, leadership: 0, streetwise: 0, subterfuge: 0,
  alertnessSpec: '', athleticsSpec: '', brawlSpec: '', dodgeSpec: '', empathySpec: '',
  expressionSpec: '', intimidationSpec: '', leadershipSpec: '', streetwiseSpec: '', subterfugeSpec: '',
  // Skills
  animalKen: 0, crafts: 0, drive: 0, etiquette: 0, firearms: 0,
  martialArts: 0, melee: 0, performance: 0, stealth: 0, survival: 0,
  animalKenSpec: '', craftsSpec: '', driveSpec: '', etiquetteSpec: '', firearmsSpec: '',
  martialArtsSpec: '', meleeSpec: '', performanceSpec: '', stealthSpec: '', survivalSpec: '',
  // Knowledges
  academics: 0, computer: 0, finance: 0, investigation: 0, law: 0,
  medicine: 0, occult: 0, politics: 0, ritualAbility: 0, science: 0,
  academicsSpec: '', computerSpec: '', financeSpec: '', investigationSpec: '', lawSpec: '',
  medicineSpec: '', occultSpec: '', politicsSpec: '', ritualAbilitySpec: '', scienceSpec: '',
  // Dharma
  dharmaName: '', dharmaRating: 0,
  // Soul
  hun: 0, po: 0,
  // Chi
  yinChi: 0, yangChi: 0, demonChi: 0,
  // Imbalance
  imbalance: '',
  // Virtues
  conscience: 1, selfControl: 1, courage: 1,
  // Willpower
  willpower: 3, currentWillpower: 3,
  // Health
  woundLevel: 0,
  healthBruised: '', healthHurt: '', healthInjured: '', healthWounded: '', healthMauled: '', healthCrippled: '', healthIncap: '',
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
  // Notes
  derangement1: '', derangement2: '', notes: '',
  backstory: '', appearanceDesc: '', goals: '', allies: '', enemies: '', havens: '', territories: '',
  personalItems: '',
}

function KoteRatingRow({ abilityKey, specKey, fields, onField, onText, t, max = 5 }) {
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

export default function KoteForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const characterId = paramId ? Number(paramId) : null

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
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, notes: '' })
  const [xpLog, setXpLog] = useState([])
  const [xpSubTab, setXpSubTab] = useState(0)
  const [newXpEntry, setNewXpEntry] = useState({ type: 'XP', amount: 1, category: 'Earned', description: '' })
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [actionError, setActionError] = useState(null)

  const [searchParams] = useSearchParams()
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
    talents: ['alertness', 'athletics', 'brawl', 'dodge', 'empathy', 'expression', 'intimidation', 'leadership', 'streetwise', 'subterfuge'],
    skills: ['animalKen', 'crafts', 'drive', 'etiquette', 'firearms', 'martialArts', 'melee', 'performance', 'stealth', 'survival'],
    knowledges: ['academics', 'computer', 'finance', 'investigation', 'law', 'medicine', 'occult', 'politics', 'ritualAbility', 'science'],
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

  const TAB_KEYS = ['tabIdentity', 'tabAttributes', 'tabAbilities', 'tabSecondaryAbilities', 'tabDharmaChi', 'tabHealth', 'tabDisciplines', 'tabBackgrounds', 'tabMeritsFlaws', 'tabInventory', 'tabBackstory', 'tabXpLog']

  useEffect(() => {
    if (guidedMode) {
      setFields(prev => ({ ...prev, dharmaRating: 1 }))
    }
  }, [guidedMode])

  useEffect(() => {
    if (characterId) loadCharacter()
    loadCatalogs()
  }, [characterId])

  async function loadCharacter() {
    try {
      const [charRes, discRes, bgRes, meritRes, flawRes, invRes, xpRes] = await Promise.all([
        getCharacter(characterId),
        getDisciplines(characterId),
        getBackgrounds(characterId),
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
      setDisciplines(discRes.data)
      setBackgrounds(bgRes.data)
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

  async function handleAddDiscipline() {
    if (!newDiscipline.name.trim() || !characterId) return
    try {
      const res = await addDiscipline(characterId, newDiscipline)
      setDisciplines(prev => [...prev, res.data])
      setNewDiscipline({ name: '', level: 1 })
    } catch {}
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
      setNewItem({ name: '', quantity: 1, notes: '' })
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
    } catch { setActionError(t('failedToSave')) }
  }

  async function handleRemoveXpEntry(entryId) {
    try {
      await removeXpLogEntry(characterId, entryId)
      setXpLog(prev => prev.filter(e => e.id !== entryId))
    } catch { setActionError(t('failedToSave')) }
  }

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/')}>{t('back')}</button>
        <h2>{fields.name || t('editKueiJin')}</h2>
        <span className="splat-badge splat-badge--kote">{t('kindredOfTheEast')}</span>
        {guidedMode && <span className="splat-badge">{t('guidedCreation')}</span>}
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}
      {actionError && <p className="status-error" role="alert">{actionError}</p>}

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
                <input id="nature" name="nature" type="text" value={fields.nature} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="demeanor">{t('demeanor')}</label>
                <input id="demeanor" name="demeanor" type="text" value={fields.demeanor} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="poNature">{t('poNature')}</label>
                <input id="poNature" name="poNature" type="text" value={fields.poNature} onChange={handleText} autoComplete="off" />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('kueiJin')}</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="balance">{t('balance')}</label>
                <select id="balance" name="balance" value={fields.balance} onChange={handleText}>
                  <option value="">{t('select')}</option>
                  {BALANCES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="direction">{t('direction')}</label>
                <select id="direction" name="direction" value={fields.direction} onChange={handleText}>
                  <option value="">{t('select')}</option>
                  {DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="wu">{t('wu')}</label>
                <input id="wu" name="wu" type="text" value={fields.wu} onChange={handleText} autoComplete="off" />
              </div>
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
            <legend>{t('derangements')}</legend>
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
              {['alertness', 'athletics', 'brawl', 'dodge', 'empathy', 'expression', 'intimidation', 'leadership', 'streetwise', 'subterfuge'].map(a =>
                <KoteRatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} t={t} />
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
              {['animalKen', 'crafts', 'drive', 'etiquette', 'firearms', 'martialArts', 'melee', 'performance', 'stealth', 'survival'].map(a =>
                <KoteRatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} t={t} />
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
              {['academics', 'computer', 'finance', 'investigation', 'law', 'medicine', 'occult', 'politics', 'ritualAbility', 'science'].map(a =>
                <KoteRatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} t={t} />
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

      {/* ── Dharma & Chi ── */}
      <div hidden={tab !== 4}>
        <div className="form-section">
          <fieldset>
            <legend>{t('dharma')}</legend>
            <div className="field-row">
              <div className="field" style={{ flex: 2 }}>
                <label htmlFor="dharmaName">{t('dharma')}</label>
                <select id="dharmaName" name="dharmaName" value={fields.dharmaName} onChange={handleText}>
                  <option value="">{t('select')}</option>
                  {DHARMAS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <DotRating label={t('dharmaRating')} name="dharmaRating" value={fields.dharmaRating} onChange={handleField} min={0} max={10} />
          </fieldset>

          <fieldset>
            <legend>{t('soul')}</legend>
            <DotRating label={t('hunHigherSoul')} name="hun" value={fields.hun} onChange={handleField} min={0} max={10} />
            <DotRating label={t('poDemonSoul')} name="po" value={fields.po} onChange={handleField} min={0} max={10} />
          </fieldset>

          <fieldset>
            <legend>{t('chi')}</legend>
            <DotRating label={t('yinChiLabel')} name="yinChi" value={fields.yinChi} onChange={handleField} min={0} max={10} />
            <DotRating label={t('yangChiLabel')} name="yangChi" value={fields.yangChi} onChange={handleField} min={0} max={10} />
            <DotRating label={t('demonChiLabel')} name="demonChi" value={fields.demonChi} onChange={handleField} min={0} max={10} />
          </fieldset>

          <fieldset>
            <legend>{t('imbalance')}</legend>
            <div className="field">
              <textarea id="imbalance" name="imbalance" value={fields.imbalance} onChange={handleText} rows={3} placeholder={t('phImbalance')} />
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('virtues')}</legend>
            <DotRating label={t('conscience')} name="conscience" value={fields.conscience} onChange={handleField} min={1} />
            <DotRating label={t('selfControl')} name="selfControl" value={fields.selfControl} onChange={handleField} min={1} />
            <DotRating label={t('courage')} name="courage" value={fields.courage} onChange={handleField} min={1} />
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

      {/* ── Health ── */}
      <div hidden={tab !== 5}>
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
      <div hidden={tab !== 6}>
        <div className="form-section">
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
                    <input id="disc-name" type="text" value={newDiscipline.name} onChange={e => setNewDiscipline(p => ({ ...p, name: e.target.value }))} autoComplete="off" />
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
                      onChange={e => setNewBackground(p => ({ ...p, name: e.target.value }))} autoComplete="off" placeholder={t('phHoroscope')} />
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
              <legend>{t('tabInventory')} ({inventory.length})</legend>
              {inventory.length > 0 && (
                <ul className="tag-list">
                  {inventory.map(item => (
                    <li key={item.id} className="tag">
                      <span>{item.name}{item.quantity > 1 ? ` x${item.quantity}` : ''}{item.notes ? ` — ${item.notes}` : ''}</span>
                      <button className="tag-remove" onClick={() => { removeInventoryItem(characterId, item.id); setInventory(prev => prev.filter(x => x.id !== item.id)) }}>×</button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="field-row" style={{ alignItems: 'flex-end' }}>
                <div className="field" style={{ flex: 2 }}>
                  <label htmlFor="inv-name">{t('itemName')}</label>
                  <input id="inv-name" type="text" value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))} autoComplete="off" />
                </div>
                <div className="field" style={{ width: '70px' }}>
                  <label htmlFor="inv-qty">{t('qty')}</label>
                  <input id="inv-qty" type="number" min={1} value={newItem.quantity}
                    onChange={e => setNewItem(p => ({ ...p, quantity: parseInt(e.target.value) || 1 }))} />
                </div>
                <div className="field">
                  <label htmlFor="inv-notes">{t('notes')}</label>
                  <input id="inv-notes" type="text" value={newItem.notes} onChange={e => setNewItem(p => ({ ...p, notes: e.target.value }))} autoComplete="off" />
                </div>
                <button className="btn btn-secondary" onClick={handleAddItem}>{t('add')}</button>
              </div>
            </fieldset>
              <fieldset>
                <legend>{t('personalItemsLabel')}</legend>
                <textarea name="personalItems" value={fields.personalItems} onChange={handleText} rows={6} placeholder={t('personalItemsPh')} style={{ width: '100%' }} />
              </fieldset>
        </div>
      </div>

      {/* ── Backstory ── */}
      <div role="tabpanel" id="tabpanel-10" aria-labelledby="tab-10" hidden={tab !== 10}>
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
      <div role="tabpanel" id="tabpanel-11" aria-labelledby="tab-11" hidden={tab !== 11}>
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
                        {t('freebieVirtueKoteCost')} · {t('freebieWpKoteCost')} · {t('freebieDharmaCost')}
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
                          <option value="Dharma">{t('catDharma')}</option>
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
        <button className="btn btn-secondary" onClick={() => navigate('/')}>{t('cancel')}</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? t('saving') : t('saveChanges')}
        </button>
      </div>
    </div>
  )
}
