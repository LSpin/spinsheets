import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
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
import DotRating from './DotRating'
import XpLogSection from './XpLogSection'
import { SECONDARY_TALENTS, SECONDARY_SKILLS, SECONDARY_KNOWLEDGES } from '../data/secondaryAbilities'
import { KOTE_DHARMAS } from '../data/koteDharmas'
import { KOTE_SHINTAI } from '../data/koteShintai'
import { useLanguage } from '../i18n/LanguageContext'
import CatalogSelect from './CatalogSelect'
import { VAMPIRE_BACKGROUNDS as BACKGROUNDS } from '../data/backgrounds'
import TagInfoPanel from './TagInfoPanel'
import DicePoolsTab from './DicePoolsTab'
import StorytellerDiceRoller from './StorytellerDiceRoller'

// ── Constants ──

const DHARMAS = [
  { value: 'The Howl of the Devil-Tiger', description: 'Path of righteous cruelty. Embrace the demon within to master and transcend it.' },
  { value: 'The Way of the Resplendent Crane', description: 'Path of heavenly virtue. Seek redemption through discipline, duty, and moral excellence.' },
  { value: 'The Song of the Shadow', description: 'Path of yin and darkness. Understand death and endings to find peace and enlightenment.' },
  { value: 'The Path of a Thousand Whispers', description: 'Path of balance. Live many lives and perspectives to understand the cosmic cycle.' },
  { value: 'The Dance of the Thrashing Dragon', description: 'Path of yang and passion. Channel vital energy through movement and martial prowess.' },
  { value: 'The Flame of the Rising Phoenix', description: 'Path of purification. Burn away corruption through spiritual fire and rebirth.' },
  { value: 'Face of the Gods', description: 'Heretical path. Seek to become a god through worship and spiritual power.' },
  { value: 'Scorpion Eaters', description: 'Heretical path. Consume the corrupt to purify the world through sacrifice.' },
  { value: 'Tempest of Inward Focus', description: 'Heretical path. Turn all energy inward to achieve personal transcendence.' },
  { value: 'Heretical', description: 'Follower of an unorthodox or forbidden dharma outside the accepted five.' },
]

const DIRECTIONS = [
  { value: 'North', description: 'Direction of water and wisdom. Associated with the Ancestor Courts.' },
  { value: 'South', description: 'Direction of fire and war. Associated with the Scarlet Screens.' },
  { value: 'East', description: 'Direction of wood and growth. Associated with the Golden Courts.' },
  { value: 'West', description: 'Direction of metal and death. Associated with the Ivory Courts.' },
  { value: 'Center', description: 'Direction of earth and balance. Associated with the Quincunx and harmony.' },
]

const BALANCES = [
  { value: 'Yin', description: 'Attuned to dark, cold, and passive energy. Death, shadow, and the spirit world.' },
  { value: 'Yang', description: 'Attuned to bright, hot, and active energy. Life, passion, and the physical world.' },
  { value: 'Balanced', description: 'Equal attunement to both Yin and Yang forces. Rare equilibrium.' },
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
  const [xpLog, setXpLog] = useState([])
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [tagInfo, setTagInfo] = useState(null)

  const [searchParams] = useSearchParams()
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

  const TAB_KEYS = ['tabIdentity', 'tabAttributes', 'tabAbilities', 'tabSecondaryAbilities', 'tabDharmaChi', 'tabHealth', 'tabShintai', 'tabBackgrounds', 'tabMeritsFlaws', 'tabInventory', 'tabBackstory', 'tabXpLog', 'tabDicePools', 'tabDiceRoller']

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



  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/characters')}>{t('back')}</button>
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
              <CatalogSelect id="balance" name="balance" label={t('balance')} value={fields.balance} onChange={handleField} catalog={BALANCES} />
              <CatalogSelect id="direction" name="direction" label={t('direction')} value={fields.direction} onChange={handleField} catalog={DIRECTIONS} />
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
                <p className="muted-hint muted-hint--xs">{t('maxPerAbility')}</p>
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
                <p className="muted-hint muted-hint--xs">{t('maxPerAbility')}</p>
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
                <p className="muted-hint muted-hint--xs">{t('maxPerAbility')}</p>
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
      <div hidden={tab !== 3}>
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

      {/* ── Dharma & Chi ── */}
      <div hidden={tab !== 4}>
        <div className="form-section">
          <fieldset>
            <legend>{t('dharma')}</legend>
            <div className="field-row">
              <div className="field" style={{ flex: 2 }}>
                <CatalogSelect id="dharmaName" name="dharmaName" label={t('dharma')} value={fields.dharmaName} onChange={handleField} catalog={DHARMAS} />
              </div>
              <div className="field">
                <DotRating label={t('dharmaRating')} name="dharmaRating" value={fields.dharmaRating} onChange={handleField} min={0} max={10} />
              </div>
            </div>
            {fields.dharmaName && (() => {
              const dharmaInfo = KOTE_DHARMAS.find(d => fields.dharmaName.toLowerCase().includes(d.name.toLowerCase()))
              return dharmaInfo ? (
                <div style={{ marginTop: 'var(--space-sm)' }}>
                  <p className="archetype-desc">{dharmaInfo.description}</p>
                  <p className="archetype-desc" style={{ marginTop: '0.25rem' }}><strong>Training:</strong> {dharmaInfo.training}</p>
                </div>
              ) : null
            })()}
          </fieldset>

          <fieldset>
            <legend>{t('hunPo')}</legend>
            <div className="field-row">
              <DotRating label="Hun" name="hun" value={fields.hun} onChange={handleField} min={0} max={10} />
              <DotRating label="P'o" name="po" value={fields.po} onChange={handleField} min={0} max={10} />
            </div>
          </fieldset>

          <fieldset>
            <legend>Chi</legend>
            <div className="field-row">
              <DotRating label="Yin Chi" name="yinChi" value={fields.yinChi} onChange={handleField} min={0} max={10} />
              <DotRating label="Yang Chi" name="yangChi" value={fields.yangChi} onChange={handleField} min={0} max={10} />
              <DotRating label="Demon Chi" name="demonChi" value={fields.demonChi} onChange={handleField} min={0} max={10} />
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('virtues')}</legend>
            <div className="field-row">
              <DotRating label={t('conscience')} name="conscience" value={fields.conscience} onChange={handleField} min={0} max={5} />
              <DotRating label={t('selfControl')} name="selfControl" value={fields.selfControl} onChange={handleField} min={0} max={5} />
              <DotRating label={t('courage')} name="courage" value={fields.courage} onChange={handleField} min={0} max={5} />
            </div>
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

      {/* ── Health ── */}
      <div hidden={tab !== 5}>
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

      {/* ── Shintai ── */}
      <div hidden={tab !== 6}>
        <div className="form-section">
          <fieldset>
            <legend>Disciplines & Shintai ({disciplines.length})</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Kuei-jin powers are divided into Demon Arts, Soul Arts, Shintai transformations, and other disciplines.
            </p>
            {disciplines.length > 0 && (
              <ul className="tag-list" style={{ marginBottom: 'var(--space-md)' }}>
                {disciplines.map(d => (
                  <li key={d.id} className={`tag tag--clickable${d.id === tagInfo?.id ? ' tag--active' : ''}`}
                    onClick={() => setTagInfo(ti => ti?.id === d.id ? null : { ...d, kind: 'discipline' })}>
                    <span>{d.name} ({d.level})</span>
                    <button className="tag-remove" onClick={e => { e.stopPropagation(); removeDiscipline(characterId, d.id); setDisciplines(prev => prev.filter(x => x.id !== d.id)); if (tagInfo?.id === d.id) setTagInfo(null) }}>×</button>
                  </li>
                ))}
              </ul>
            )}
            {tagInfo?.kind === 'discipline' && (() => {
              const entry = KOTE_SHINTAI.find(s => s.name.toLowerCase() === tagInfo.name.toLowerCase())
              return (
                <aside className="tag-info-panel" style={{ marginBottom: 'var(--space-md)' }}>
                  <button className="tag-info-panel-close" onClick={() => setTagInfo(null)}>{t('close')}</button>
                  <p className="tag-info-panel-name">{tagInfo.name}</p>
                  <p className="tag-info-panel-desc">Level {tagInfo.level}{entry ? ` · ${entry.category}` : ''}</p>
                  {entry && <p style={{ fontSize: '0.82rem', lineHeight: 1.55 }}>{entry.description}</p>}
                </aside>
              )
            })()}
          </fieldset>

          {/* Add custom discipline */}
          <fieldset>
            <legend>Add Discipline</legend>
            <div className="field-row" style={{ alignItems: 'flex-end', gap: 'var(--space-sm)' }}>
              <div className="field" style={{ flex: 2 }}>
                <label>{t('name')}</label>
                <input type="text" value={newDiscipline.name} onChange={e => setNewDiscipline(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Discipline name..." list="kote-disc-list" />
                <datalist id="kote-disc-list">
                  {KOTE_SHINTAI.map(s => <option key={s.name} value={s.name} />)}
                </datalist>
              </div>
              <div className="field" style={{ width: 70 }}>
                <label>Level</label>
                <select value={newDiscipline.level} onChange={e => setNewDiscipline(prev => ({ ...prev, level: parseInt(e.target.value) }))}>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <button className="btn btn-primary btn-sm" onClick={handleAddDiscipline}>{t('add')}</button>
            </div>
          </fieldset>

          {/* Shintai Catalogue */}
          <fieldset>
            <legend>Shintai & Discipline Catalogue ({KOTE_SHINTAI.length})</legend>
            {['Demon', 'Soul', 'Shintai', 'Other'].map(cat => {
              const items = KOTE_SHINTAI.filter(s => s.category === cat)
              return (
                <details key={cat} style={{ marginBottom: 'var(--space-xs)' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>
                    {cat} Arts ({items.length})
                  </summary>
                  <ul className="catalog-list" style={{ marginTop: 'var(--space-xs)' }}>
                    {items.map(s => {
                      const already = disciplines.some(d => d.name.toLowerCase() === s.name.toLowerCase())
                      return (
                        <li key={s.name} className={`catalog-item${already ? ' catalog-item--added' : ''}`}>
                          <button className="catalog-item-btn" onClick={() => {
                            if (!already) addDiscipline(characterId, { name: s.name, level: 1 }).then(res => setDisciplines(prev => [...prev, res.data])).catch(() => {})
                          }}>
                            <div className="catalog-item-main">
                              <span className="catalog-item-name">{s.name}</span>
                              <span className="catalog-item-desc">{s.description}</span>
                            </div>
                            <div className="catalog-item-meta">
                              {already ? <span className="catalog-item-check">✓</span> : <span className="catalog-item-add">+</span>}
                            </div>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </details>
              )
            })}
          </fieldset>
        </div>
      </div>

      {/* ── Backgrounds ── */}
      <div hidden={tab !== 7}>
        <div className="form-section">
          <fieldset>
            <legend>{t('backgrounds')} ({backgrounds.length})</legend>
            {backgrounds.length > 0 && (
              <ul className="tag-list" style={{ marginBottom: 'var(--space-md)' }}>
                {backgrounds.map(bg => (
                  <li key={bg.id} className={`tag tag--clickable${bg.id === tagInfo?.id ? ' tag--active' : ''}`}
                    onClick={() => setTagInfo(ti => ti?.id === bg.id ? null : { ...bg, kind: 'background' })}>
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
            <div className="field-row" style={{ alignItems: 'flex-end', gap: 'var(--space-sm)' }}>
              <div className="field" style={{ flex: 2 }}>
                <label>{t('name')}</label>
                <input type="text" value={newBackground.name} onChange={e => setNewBackground(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Background name..." list="bg-catalog-list" />
                <datalist id="bg-catalog-list">
                  {BACKGROUNDS.map(b => <option key={b.value} value={b.value} />)}
                </datalist>
              </div>
              <div className="field" style={{ width: 70 }}>
                <label>Level</label>
                <select value={newBackground.level} onChange={e => setNewBackground(prev => ({ ...prev, level: parseInt(e.target.value) }))}>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <button className="btn btn-primary btn-sm" onClick={handleAddBackground}>{t('add')}</button>
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Merits & Flaws ── */}
      <div hidden={tab !== 8}>
        <MeritsFlawsSection characterId={characterId} merits={merits} setMerits={setMerits} flaws={flaws} setFlaws={setFlaws} meritCatalog={meritCatalog} flawCatalog={flawCatalog} />
      </div>

      {/* ── Inventory ── */}
      <div hidden={tab !== 9}>
        <InventorySection characterId={characterId} inventory={inventory} setInventory={setInventory} personalItems={fields.personalItems} onPersonalItemsChange={handleText} />
      </div>

      {/* ── Backstory ── */}
      <div hidden={tab !== 10}>
        <div className="form-section">
          <fieldset><legend>{t('backstoryLabel')}</legend><textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('appearanceLabel')}</legend><textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('goalsLabel')}</legend><textarea name="goals" value={fields.goals} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('alliesLabel')}</legend><textarea name="allies" value={fields.allies} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('enemiesLabel')}</legend><textarea name="enemies" value={fields.enemies} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('havensLabel')}</legend><textarea name="havens" value={fields.havens} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('territoriesLabel')}</legend><textarea name="territories" value={fields.territories} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
        </div>
      </div>

      {/* ── XP Log ── */}
      <div hidden={tab !== 11}>
        <XpLogSection
          splat="kote"
          xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)}
          t={t}
        />
      </div>

      {/* ── Dice Pools ── */}
      <div hidden={tab !== 12}>
        <DicePoolsTab fields={fields} splat="KOTE" characterId={characterId} />
      </div>

      {/* ── Dice Roller ── */}
      <div hidden={tab !== 13}>
        <StorytellerDiceRoller />
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
