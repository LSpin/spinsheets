import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  getCharacter, updateCharacter,
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
import { useLanguage } from '../i18n/LanguageContext'
import CatalogSelect from './CatalogSelect'
import TagInfoPanel from './TagInfoPanel'
import DicePoolsTab from './DicePoolsTab'
import StorytellerDiceRoller from './StorytellerDiceRoller'
import { SECONDARY_TALENTS, SECONDARY_SKILLS, SECONDARY_KNOWLEDGES } from '../data/secondaryAbilities'
import { DEMON_BACKGROUNDS as BACKGROUNDS } from '../data/backgrounds'

// ── Constants ──

const ARCHETYPES = [
  { value: 'Architect', description: 'Driven to create something of lasting value.' },
  { value: 'Autocrat', description: 'Must be in charge. Seeks control and authority.' },
  { value: 'Caregiver', description: 'Nurtures and protects others.' },
  { value: 'Conniver', description: 'Manipulates others for personal gain.' },
  { value: 'Fanatic', description: 'Utterly devoted to a belief, willing to die for it.' },
  { value: 'Judge', description: 'Seeks truth and justice.' },
  { value: 'Loner', description: 'Prefers solitude. Self-reliant.' },
  { value: 'Martyr', description: 'Finds meaning in sacrifice and self-denial.' },
  { value: 'Monster', description: 'Embraces the beast within.' },
  { value: 'Penitent', description: 'Atones for past sins. Driven by guilt.' },
  { value: 'Rebel', description: 'Fights authority on principle.' },
  { value: 'Survivor', description: 'Endures at all costs.' },
  { value: 'Visionary', description: 'Driven by grand ideas and a vision of the future.' },
]

const HOUSES = [
  { value: 'Namaru (Devils)', description: 'Leaders and manipulators. The First House.' },
  { value: 'Asharu (Scourges)', description: 'Guardians and protectors. Wind and weather.' },
  { value: 'Annunaki (Malefactors)', description: 'Shapers of matter. Builders and destroyers.' },
  { value: 'Neberu (Fiends)', description: 'Seers of fate and celestial patterns.' },
  { value: 'Lammasu (Defilers)', description: 'Muses of desire and longing.' },
  { value: 'Rabisu (Devourers)', description: 'Wild spirits of nature, red in tooth and claw.' },
  { value: 'Halaku (Slayers)', description: 'Angels of death. Shepherds of the dying.' },
]

const FACTIONS = [
  { value: 'Faustians', description: 'Seek to rebuild their power through mortal pawns.' },
  { value: 'Cryptics', description: 'Seek answers. Why did God abandon them?' },
  { value: 'Luciferans', description: 'Loyal to Lucifer. Seek to continue the war.' },
  { value: 'Raveners', description: 'Nihilists who want to destroy creation.' },
  { value: 'Reconcilers', description: 'Seek forgiveness and redemption from God.' },
]

const HOUSE_LORES = {
  'Namaru (Devils)': { primary: 'Lore of the Celestials', secondary: ['Lore of Flame', 'Lore of Radiance'] },
  'Asharu (Scourges)': { primary: 'Lore of Awakening', secondary: ['Lore of the Firmament', 'Lore of Winds'] },
  'Annunaki (Malefactors)': { primary: 'Lore of the Earth', secondary: ['Lore of Paths', 'Lore of the Forge'] },
  'Neberu (Fiends)': { primary: 'Lore of Patterns', secondary: ['Lore of Portals', 'Lore of Light'] },
  'Lammasu (Defilers)': { primary: 'Lore of Longing', secondary: ['Lore of Storms', 'Lore of Transfiguration'] },
  'Rabisu (Devourers)': { primary: 'Lore of the Wild', secondary: ['Lore of the Flesh', 'Lore of the Fundament'] },
  'Halaku (Slayers)': { primary: 'Lore of Death', secondary: ['Lore of the Realms', 'Lore of the Spirit'] },
}

const COMMON_LORES = ['Lore of the Fundament', 'Lore of Humanity']

const DEMON_LORES = [
  { name: 'Lore of the Fundament', house: 'Common', description: 'Manipulate the fundamental forces of creation — gravity, magnetism, inertia.' },
  { name: 'Lore of Humanity', house: 'Common', description: 'Understand and influence mortal hearts and minds.' },
  { name: 'Lore of the Celestials', house: 'Namaru', description: 'Command and leadership. Inspire or terrify.' },
  { name: 'Lore of Flame', house: 'Namaru', description: 'Create and control fire and light.' },
  { name: 'Lore of the Winds', house: 'Asharu', description: 'Command air, weather, and storms.' },
  { name: 'Lore of Awakening', house: 'Asharu', description: 'Heal, protect, and give life.' },
  { name: 'Lore of the Earth', house: 'Annunaki', description: 'Shape stone, metal, and physical matter.' },
  { name: 'Lore of Paths', house: 'Annunaki', description: 'Create portals and manipulate space.' },
  { name: 'Lore of Patterns', house: 'Neberu', description: 'Read and manipulate fate and probability.' },
  { name: 'Lore of Portals', house: 'Neberu', description: 'Open gateways between realms.' },
  { name: 'Lore of Longing', house: 'Lammasu', description: 'Inspire desire, obsession, and devotion.' },
  { name: 'Lore of Storms', house: 'Lammasu', description: 'Control weather and elemental fury.' },
  { name: 'Lore of the Wild', house: 'Rabisu', description: 'Command animals and plants.' },
  { name: 'Lore of the Flesh', house: 'Rabisu', description: 'Transform and mutate living bodies.' },
  { name: 'Lore of Death', house: 'Halaku', description: 'Control death, decay, and the dead.' },
  { name: 'Lore of the Spirit', house: 'Halaku', description: 'Interact with ghosts and the Underworld.' },
]

const DEMON_LORE_HOUSES = [...new Set(DEMON_LORES.map(l => l.house))]

const DEMON_VISAGE_ABILITIES = [
  { name: 'Wings', type: 'High-Torment', description: 'Massive wings allowing flight.' },
  { name: 'Claws', type: 'High-Torment', description: 'Razor-sharp claws dealing aggravated damage.' },
  { name: 'Extra Limbs', type: 'High-Torment', description: 'Additional arms or tentacles.' },
  { name: 'Enhanced Senses', type: 'Low-Torment', description: 'Superhuman sight, hearing, or smell.' },
  { name: 'Armor', type: 'Low-Torment', description: 'Supernatural toughness reducing damage.' },
  { name: 'Aura of Dread', type: 'High-Torment', description: 'Terrifying presence causing fear.' },
  { name: 'Aura of Inspiration', type: 'Low-Torment', description: 'Uplifting presence boosting allies.' },
  { name: 'Enhanced Strength', type: 'Low-Torment', description: 'Greatly increased physical power.' },
  { name: 'Enhanced Speed', type: 'Low-Torment', description: 'Supernatural quickness and reflexes.' },
  { name: 'Immunity (Fire)', type: 'High-Torment', description: 'Complete immunity to fire damage.' },
  { name: 'Immunity (Cold)', type: 'High-Torment', description: 'Complete immunity to cold damage.' },
  { name: 'Poison', type: 'High-Torment', description: 'Venomous bite or touch.' },
  { name: 'Regeneration', type: 'Low-Torment', description: 'Rapid healing of wounds.' },
  { name: 'Shroud', type: 'Low-Torment', description: 'Become invisible or blend with shadows.' },
]

const HEALTH_LEVELS = [
  { key: 'healthBruised',    label: 'bruised',       penalty: '' },
  { key: 'healthHurt',       label: 'hurt',          penalty: '-1' },
  { key: 'healthInjured',    label: 'injured',       penalty: '-1' },
  { key: 'healthWounded',    label: 'wounded',       penalty: '-2' },
  { key: 'healthMauled',     label: 'mauled',        penalty: '-2' },
  { key: 'healthCrippled',   label: 'crippled',      penalty: '-5' },
  { key: 'healthIncap',      label: 'incapacitated', penalty: '' },
]

const TAB_KEYS = [
  'tabIdentity', 'tabAttributes', 'tabAbilities', 'tabSecondaryAbilities',
  'tabLore', 'tabApocalypticForm', 'tabAdvantages', 'tabHealth',
  'tabBackgrounds', 'tabMeritsFlaws', 'tabInventory',
  'tabBackstory', 'tabXpLog', 'tabDicePools', 'tabDiceRoller'
]

const INITIAL = {
  splat: 'DEMON', npc: false,
  name: '', altName: '', concept: '', nature: '', demeanor: '',
  clan: '', // House
  sect: '', // Faction
  // Attributes
  strength: 1, dexterity: 1, stamina: 1,
  charisma: 1, manipulation: 1, appearance: 1,
  perception: 1, intelligence: 1, wits: 1,
  strengthSpec: '', dexteritySpec: '', staminaSpec: '',
  charismaSpec: '', manipulationSpec: '', appearanceSpec: '',
  perceptionSpec: '', intelligenceSpec: '', witsSpec: '',
  // Talents
  alertness: 0, athletics: 0, awareness: 0, brawl: 0, empathy: 0,
  expression: 0, intimidation: 0, leadership: 0, streetwise: 0, subterfuge: 0,
  alertnessSpec: '', athleticsSpec: '', awarenessSpec: '', brawlSpec: '', empathySpec: '',
  expressionSpec: '', intimidationSpec: '', leadershipSpec: '', streetwiseSpec: '', subterfugeSpec: '',
  // Skills
  animalKen: 0, crafts: 0, drive: 0, etiquette: 0, firearms: 0,
  larceny: 0, melee: 0, performance: 0, stealth: 0, survival: 0,
  animalKenSpec: '', craftsSpec: '', driveSpec: '', etiquetteSpec: '', firearmsSpec: '',
  larcenySpec: '', meleeSpec: '', performanceSpec: '', stealthSpec: '', survivalSpec: '',
  // Knowledges
  academics: 0, computer: 0, finance: 0, investigation: 0, law: 0,
  linguistics: 0, medicine: 0, occult: 0, politics: 0, science: 0, technology: 0,
  academicsSpec: '', computerSpec: '', financeSpec: '', investigationSpec: '', lawSpec: '',
  linguisticsSpec: '', medicineSpec: '', occultSpec: '', politicsSpec: '', scienceSpec: '', technologySpec: '',
  // Faith, Torment, Willpower
  gnosis: 5, currentGnosis: 5, // Faith
  rage: 0, currentRage: 0, // Torment
  willpower: 3, currentWillpower: 3,
  // Lore powers (stored as comma-separated "Lore:Level" pairs)
  sorceryDesc: '',
  // Apocalyptic Form
  clanCurse: '', // Visage description
  // Health
  healthBruised: '', healthHurt: '', healthInjured: '', healthWounded: '', healthMauled: '', healthCrippled: '', healthIncap: '',
  // Notes
  notes: '', backstory: '', appearanceDesc: '', goals: '', allies: '', enemies: '', havens: '', territories: '',
  personalItems: '',
  // Apocalyptic form extra fields (stored in existing text fields)
  derangement1: '', // Low-Torment form description
  derangement2: '', // High-Torment form description
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

// ── Helpers ──

function parseLores(str) {
  if (!str) return {}
  const map = {}
  str.split(',').forEach(pair => {
    const [name, lvl] = pair.split(':')
    if (name && lvl) map[name.trim()] = parseInt(lvl) || 0
  })
  return map
}

function serializeLores(map) {
  return Object.entries(map).filter(([, v]) => v > 0).map(([k, v]) => `${k}:${v}`).join(',')
}

function parseVisageAbilities(str) {
  if (!str) return []
  return str.split(',').map(s => s.trim()).filter(Boolean)
}

function serializeVisageAbilities(arr) {
  return arr.filter(Boolean).join(',')
}

function RatingRow({ abilityKey, specKey, fields, onField, onText, max = 5, t }) {
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
      <input type="text" name={nameProp} value={fields[nameProp]} onChange={onText}
        placeholder={placeholder} aria-label={`${placeholder} name`} className="custom-ability-name"
        list={`${nameProp}-list`} />
      <datalist id={`${nameProp}-list`}>
        {catalog?.map(c => <option key={c.value} value={c.value} />)}
      </datalist>
      <DotRating label="" name={ratingProp} value={fields[ratingProp]} onChange={onField} max={max} />
      {match && <p className="archetype-desc" style={{ gridColumn: '1 / -1', margin: 0 }}>{match.description}</p>}
    </div>
  )
}

// ── Component ──

export default function DemonForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const viewMode = searchParams.get('mode') === 'view'
  const characterId = paramId ? Number(paramId) : null

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
  const [xpLog, setXpLog] = useState([])
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [tagInfo, setTagInfo] = useState(null)
  const [bgSearch, setBgSearch] = useState('')

  useEffect(() => {
    if (characterId) loadCharacter()
    loadCatalogs()
  }, [characterId])

  async function loadCharacter() {
    try {
      const [charRes, bgRes, meritRes, flawRes, invRes, xpRes] = await Promise.all([
        getCharacter(characterId),
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
    setFields(prev => ({ ...prev, [name]: typeof value === 'string' ? value : Number(value) }))
  }

  function handleText(e) {
    const { name, value, type } = e.target
    handleField(name, type === 'number' ? (parseInt(value) || 0) : value)
  }

  function handleLore(loreName, level) {
    const current = parseLores(fields.sorceryDesc)
    current[loreName] = level
    const serialized = serializeLores(current)
    setFields(prev => ({ ...prev, sorceryDesc: serialized }))
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

  const loresMap = parseLores(fields.sorceryDesc)
  const houseLoreInfo = HOUSE_LORES[fields.clan] || null

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/characters')}>{t('back')}</button>
        <h2>{fields.name || 'New Demon'}</h2>
        <span className="splat-badge splat-badge--demon">Demon</span>
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}
      {actionError && <p className="status-error" role="alert">{actionError}</p>}

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
                <input id="name" name="name" type="text" value={fields.name} onChange={handleText} required autoComplete="off" placeholder="Mortal host name" />
              </div>
              <div className="field">
                <label htmlFor="altName">Celestial Name</label>
                <input id="altName" name="altName" type="text" value={fields.altName} onChange={handleText} autoComplete="off" placeholder="True angelic name" />
              </div>
              <div className="field">
                <label htmlFor="concept">{t('concept')}</label>
                <input id="concept" name="concept" type="text" value={fields.concept} onChange={handleText} autoComplete="off" />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Demon</legend>
            <div className="field-row">
              <CatalogSelect id="clan" name="clan" label="House" value={fields.clan} onChange={handleField} catalog={HOUSES} />
              <CatalogSelect id="sect" name="sect" label="Faction" value={fields.sect} onChange={handleField} catalog={FACTIONS} />
            </div>
            <div className="field-row">
              <CatalogSelect id="nature" name="nature" label={t('nature')} value={fields.nature} onChange={handleField} catalog={ARCHETYPES} />
              <CatalogSelect id="demeanor" name="demeanor" label={t('demeanor')} value={fields.demeanor} onChange={handleField} catalog={ARCHETYPES} />
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
            { legendKey: 'physicalAttr', attrs: ['strength', 'dexterity', 'stamina'] },
            { legendKey: 'socialAttr', attrs: ['charisma', 'manipulation', 'appearance'] },
            { legendKey: 'mentalAttr', attrs: ['perception', 'intelligence', 'wits'] },
          ].map(({ legendKey, attrs }) => (
            <fieldset key={legendKey}>
              <legend>{t(legendKey)}</legend>
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
            <div className="rating-grid">
              {['alertness', 'athletics', 'awareness', 'brawl', 'empathy', 'expression', 'intimidation', 'leadership', 'streetwise', 'subterfuge'].map(a =>
                <RatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} t={t} />
              )}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('skills')}</legend>
            <div className="rating-grid">
              {['animalKen', 'crafts', 'drive', 'etiquette', 'firearms', 'larceny', 'melee', 'performance', 'stealth', 'survival'].map(a =>
                <RatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} t={t} />
              )}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('knowledges')}</legend>
            <div className="rating-grid">
              {['academics', 'computer', 'finance', 'investigation', 'law', 'linguistics', 'medicine', 'occult', 'politics', 'science', 'technology'].map(a =>
                <RatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} t={t} />
              )}
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Secondary Abilities ── */}
      <div role="tabpanel" hidden={tab !== 3}>
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

      {/* ── Lore ── */}
      <div hidden={tab !== 4}>
        <div className="form-section">
          {houseLoreInfo && (
            <>
              <fieldset>
                <legend>{t('primaryLore')}</legend>
                <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
                  Your House determines your primary Lore. This is the Lore you learn most easily.
                </p>
                <div className="rating-grid">
                  <div className="ability-row">
                    <DotRating label={houseLoreInfo.primary} name={`lore-primary`} value={loresMap[houseLoreInfo.primary] || 0}
                      onChange={(_, val) => handleLore(houseLoreInfo.primary, val)} max={5} />
                    <p className="muted-hint muted-hint--xs" style={{ margin: 0, gridColumn: '1 / -1' }}>
                      {DEMON_LORES.find(l => l.name === houseLoreInfo.primary)?.description}
                    </p>
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend>{t('secondaryLores')}</legend>
                <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
                  Each House has access to two secondary Lores in addition to their primary Lore.
                </p>
                <div className="rating-grid">
                  {houseLoreInfo.secondary.map(lore => {
                    const info = DEMON_LORES.find(l => l.name === lore)
                    return (
                      <div key={lore} className="ability-row">
                        <DotRating label={lore} name={`lore-${lore}`} value={loresMap[lore] || 0}
                          onChange={(_, val) => handleLore(lore, val)} max={5} />
                        {info && <p className="muted-hint muted-hint--xs" style={{ margin: 0, gridColumn: '1 / -1' }}>{info.description}</p>}
                      </div>
                    )
                  })}
                </div>
              </fieldset>
            </>
          )}

          {!houseLoreInfo && (
            <fieldset>
              <legend>{t('demonLores')}</legend>
              <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
                Select a House on the Identity tab to see your primary and secondary Lores.
              </p>
            </fieldset>
          )}

          {DEMON_LORE_HOUSES.map(house => {
            const loresInHouse = DEMON_LORES.filter(l => l.house === house)
            return (
              <fieldset key={house}>
                <legend>{house === 'Common' ? t('commonLores') : `${house} Lores`}</legend>
                {house === 'Common' && (
                  <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
                    Common Lores available to all Fallen, regardless of House.
                  </p>
                )}
                <div className="rating-grid">
                  {loresInHouse.map(lore => (
                    <div key={lore.name} className="ability-row">
                      <DotRating label={lore.name} name={`lore-${lore.name}`} value={loresMap[lore.name] || 0}
                        onChange={(_, val) => handleLore(lore.name, val)} max={5} />
                      <p className="muted-hint muted-hint--xs" style={{ margin: 0, gridColumn: '1 / -1' }}>{lore.description}</p>
                    </div>
                  ))}
                </div>
              </fieldset>
            )
          })}
        </div>
      </div>

      {/* ── Apocalyptic Form ── */}
      <div hidden={tab !== 5}>
        <div className="form-section">
          {['Low-Torment', 'High-Torment'].map(tormentType => {
            const abilities = DEMON_VISAGE_ABILITIES.filter(a => a.type === tormentType)
            const selected = parseVisageAbilities(fields.clanCurse)
            return (
              <fieldset key={tormentType}>
                <legend>{tormentType} Abilities</legend>
                <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
                  {tormentType === 'Low-Torment'
                    ? 'Visage abilities that manifest when the demon maintains low Torment.'
                    : 'Visage abilities that manifest when the demon succumbs to high Torment.'}
                </p>
                <div className="catalog-list" style={{ listStyle: 'none', padding: 0 }}>
                  {abilities.map(ability => {
                    const checked = selected.includes(ability.name)
                    return (
                      <label key={ability.name} className="catalog-item" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)', padding: 'var(--space-xs) 0', cursor: 'pointer' }}>
                        <input type="checkbox" checked={checked} onChange={() => {
                          const next = checked
                            ? selected.filter(n => n !== ability.name)
                            : [...selected, ability.name]
                          setFields(prev => ({ ...prev, clanCurse: serializeVisageAbilities(next) }))
                        }} />
                        <div>
                          <strong>{ability.name}</strong>
                          <p className="muted-hint muted-hint--xs" style={{ margin: 0 }}>{ability.description}</p>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            )
          })}

          <fieldset>
            <legend>{t('visageDescription')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Describe the demon's true, terrifying visage when it reveals its celestial nature.
            </p>
            <textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={6} style={{ width: '100%' }}
              aria-label="Visage description" placeholder={t('visageDescPh')} />
          </fieldset>

          <fieldset>
            <legend>{t('lowTormentForm')}</legend>
            <textarea name="derangement1" value={fields.derangement1} onChange={handleText} rows={4} style={{ width: '100%' }}
              aria-label="Low-Torment form" placeholder={t('lowTormentFormPh')} />
          </fieldset>

          <fieldset>
            <legend>{t('highTormentForm')}</legend>
            <textarea name="derangement2" value={fields.derangement2} onChange={handleText} rows={4} style={{ width: '100%' }}
              aria-label="High-Torment form" placeholder={t('highTormentFormPh')} />
          </fieldset>
        </div>
      </div>

      {/* ── Advantages (Faith, Torment, Willpower) ── */}
      <div hidden={tab !== 6}>
        <div className="form-section">
          <fieldset>
            <legend>{t('faith')}</legend>
            <div className="field-row">
              <DotRating label={t('faith')} name="gnosis" value={fields.gnosis} onChange={handleField} min={0} max={10} />
              <DotRating label={t('currentFaith')} name="currentGnosis" value={fields.currentGnosis} onChange={handleField} min={0} max={10} />
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('torment')}</legend>
            <div className="field-row">
              <DotRating label={t('torment')} name="rage" value={fields.rage} onChange={handleField} min={0} max={10} />
              <DotRating label={t('currentTorment')} name="currentRage" value={fields.currentRage} onChange={handleField} min={0} max={10} />
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('willpower')}</legend>
            <div className="field-row">
              <DotRating label={t('permanent')} name="willpower" value={fields.willpower} onChange={handleField} min={1} max={10} />
              <DotRating label={t('temporary')} name="currentWillpower" value={fields.currentWillpower} onChange={handleField} min={0} max={fields.willpower} />
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
                {HEALTH_LEVELS.map(h => {
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
                      <td style={{ color: 'var(--color-text-muted)' }}>{h.penalty || '\u2014'}</td>
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
                    role="button" tabIndex={0}>
                    <span>{b.name} ({b.level}){b.description ? ` \u2014 ${b.description}` : ''}</span>
                    <button className="tag-remove" onClick={e => { e.stopPropagation(); removeBackground(characterId, b.id); setBackgrounds(prev => prev.filter(x => x.id !== b.id)); if (tagInfo?.id === b.id) setTagInfo(null) }}>\u00d7</button>
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
                  <p className="tag-info-panel-desc">Background \u00b7 Level {tagInfo.level}</p>
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
          splat="demon"
          xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)}
          t={t}
        />
      </div>

      {/* ── Dice Pools ── */}
      <div hidden={tab !== 13}>
        <DicePoolsTab fields={fields} splat="DEMON" characterId={characterId} />
      </div>

      {/* ── Dice Roller ── */}
      <div hidden={tab !== 14}>
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
