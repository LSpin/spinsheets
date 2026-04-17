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
import { MAGE_BACKGROUNDS as BACKGROUNDS } from '../data/backgrounds'
import TagInfoPanel from './TagInfoPanel'

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
  const [rotes, setRotes] = useState([])
  const [newRote, setNewRote] = useState({ name: '', spheres: '', level: 1, description: '' })
  const [xpLog, setXpLog] = useState([])
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
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
        <h2>{fields.name || t('newVictorianMage')}</h2>
        <span className="splat-badge splat-badge--victorian-mage">{t('victorianMage')}</span>
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
                <p className="muted-hint muted-hint--xs">{t('maxPerAbility')}</p>
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
                <p className="muted-hint muted-hint--xs">{t('maxPerAbility')}</p>
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
                <p className="muted-hint muted-hint--xs">{t('maxPerAbility')}</p>
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

      {/* ── Spheres ── */}
      <div hidden={tab !== 4}>
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
            <legend>{t('quintessenceParadox')}</legend>
            <div className="field-row">
              <DotRating label={t('quintessence')} name="quintessence" value={fields.quintessence} onChange={handleField} min={0} max={20} />
              <DotRating label={t('paradox')} name="paradox" value={fields.paradox} onChange={handleField} min={0} max={20} />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── XP Log ── */}
      <div hidden={tab !== 12}>
        <XpLogSection
          splat="mage"
          xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)}
          t={t}
        />
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
