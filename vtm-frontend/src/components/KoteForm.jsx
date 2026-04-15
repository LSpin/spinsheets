import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  getCharacter, createCharacter, updateCharacter,
  getDisciplines, addDiscipline, removeDiscipline,
  getBackgrounds, addBackground, removeBackground,
  getMeritCatalog, getFlawCatalog,
  getMerits, addMerit, removeMerit,
  getFlaws, addFlaw, removeFlaw,
  getInventory, addInventoryItem, removeInventoryItem,
} from '../api/characterApi'
import DotRating from './DotRating'
import { SECONDARY_TALENTS, SECONDARY_SKILLS, SECONDARY_KNOWLEDGES } from '../data/secondaryAbilities'

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
]

const HEALTH_LEVELS = [
  { label: 'Healthy',        penalty: '' },
  { label: 'Bruised',        penalty: '' },
  { label: 'Hurt',           penalty: '−1' },
  { label: 'Injured',        penalty: '−1' },
  { label: 'Wounded',        penalty: '−2' },
  { label: 'Mauled',         penalty: '−2' },
  { label: 'Crippled',       penalty: '−5' },
  { label: 'Incapacitated',  penalty: '' },
]

const ABILITY_LABELS = {
  animalKen: 'Animal Ken', martialArts: 'Martial Arts', ritualAbility: 'Rituals',
}

function label(key) {
  return ABILITY_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1)
}

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
  // Secondary Abilities
  hobbyTalent1Name: '', hobbyTalent1: 0,
  hobbyTalent2Name: '', hobbyTalent2: 0,
  hobbyTalent3Name: '', hobbyTalent3: 0,
  profSkill1Name: '', profSkill1: 0,
  profSkill2Name: '', profSkill2: 0,
  profSkill3Name: '', profSkill3: 0,
  expertKnowl1Name: '', expertKnowl1: 0,
  expertKnowl2Name: '', expertKnowl2: 0,
  expertKnowl3Name: '', expertKnowl3: 0,
  // Notes
  derangement1: '', derangement2: '', notes: '',
}

function KoteRatingRow({ abilityKey, specKey, fields, onField, onText, max = 5 }) {
  return (
    <div className="ability-row">
      <DotRating label={label(abilityKey)} name={abilityKey} value={fields[abilityKey]} onChange={onField} max={max} />
      <input className="spec-input" type="text" name={specKey} value={fields[specKey] ?? ''} onChange={onText}
        placeholder="Specialty" aria-label={`${label(abilityKey)} specialty`} />
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
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, notes: '' })
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  const TABS = ['Identity', 'Attributes', 'Abilities', 'Secondary Abilities', 'Dharma & Chi', 'Disciplines & Backgrounds', 'Merits & Flaws', 'Inventory']

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
    } catch { setSaveError('Failed to load character.') }
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
    if (!fields.name.trim()) { setSaveError('Name is required.'); return }
    setSaving(true)
    setSaveError(null)
    try {
      if (isEdit) {
        await updateCharacter(characterId, fields)
      } else {
        const res = await createCharacter(fields)
        navigate(`/characters/${res.data.id}`, { replace: true })
      }
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Failed to save.')
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

  if (loading) return <p className="status-loading">Loading...</p>

  return (
    <div>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/')}>Back</button>
        <h2>{isEdit ? fields.name || 'Edit Kuei-jin' : 'New Kuei-jin'}</h2>
        <span className="splat-badge splat-badge--kote">Kindred of the East</span>
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}

      {/* Tabs */}
      <div className="tab-list" role="tablist">
        {TABS.map((t, i) => (
          <button key={t} role="tab" className={`btn btn-secondary${tab === i ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(i)} aria-selected={tab === i}>{t}</button>
        ))}
      </div>

      {/* ── Identity ── */}
      <div hidden={tab !== 0}>
        <div className="form-section">
          <fieldset>
            <legend>Identity</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="name">Name <span aria-hidden="true">*</span></label>
                <input id="name" name="name" type="text" value={fields.name} onChange={handleText} required autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="altName">Alt Name</label>
                <input id="altName" name="altName" type="text" value={fields.altName} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="concept">Concept</label>
                <input id="concept" name="concept" type="text" value={fields.concept} onChange={handleText} autoComplete="off" />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="nature">Nature</label>
                <input id="nature" name="nature" type="text" value={fields.nature} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="demeanor">Demeanor</label>
                <input id="demeanor" name="demeanor" type="text" value={fields.demeanor} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="poNature">P'o Nature</label>
                <input id="poNature" name="poNature" type="text" value={fields.poNature} onChange={handleText} autoComplete="off" />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Kuei-jin</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="balance">Balance</label>
                <select id="balance" name="balance" value={fields.balance} onChange={handleText}>
                  <option value="">— Select —</option>
                  {BALANCES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="direction">Direction</label>
                <select id="direction" name="direction" value={fields.direction} onChange={handleText}>
                  <option value="">— Select —</option>
                  {DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="wu">Wu</label>
                <input id="wu" name="wu" type="text" value={fields.wu} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="npc">Type</label>
                <div className="role-toggle" role="radiogroup" aria-label="Character type">
                  <button type="button" className={`role-toggle-btn${!fields.npc ? ' role-toggle-btn--active' : ''}`}
                    onClick={() => handleField('npc', false)}>PC</button>
                  <button type="button" className={`role-toggle-btn${fields.npc ? ' role-toggle-btn--active' : ''}`}
                    onClick={() => handleField('npc', true)}>NPC</button>
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Derangements</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="derangement1">Derangement 1</label>
                <input id="derangement1" name="derangement1" type="text" value={fields.derangement1} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="derangement2">Derangement 2</label>
                <input id="derangement2" name="derangement2" type="text" value={fields.derangement2} onChange={handleText} autoComplete="off" />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Notes</legend>
            <div className="field">
              <textarea id="notes" name="notes" value={fields.notes} onChange={handleText} rows={5} placeholder="General notes..." />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Attributes ── */}
      <div hidden={tab !== 1}>
        <div className="form-section">
          {[
            { legend: 'Physical', attrs: ['strength', 'dexterity', 'stamina'] },
            { legend: 'Social',   attrs: ['charisma', 'manipulation', 'appearance'] },
            { legend: 'Mental',   attrs: ['perception', 'intelligence', 'wits'] },
          ].map(({ legend, attrs }) => (
            <fieldset key={legend}>
              <legend>{legend}</legend>
              <div className="rating-grid">
                {attrs.map(a => (
                  <div key={a} className="ability-row">
                    <DotRating label={label(a)} name={a} value={fields[a]} onChange={handleField} min={1} />
                    <input className="spec-input" type="text" name={a + 'Spec'} value={fields[a + 'Spec'] ?? ''} onChange={handleText}
                      placeholder="Specialty" aria-label={`${label(a)} specialty`} />
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
            <legend>Talents</legend>
            <div className="rating-grid">
              {['alertness', 'athletics', 'brawl', 'dodge', 'empathy', 'expression', 'intimidation', 'leadership', 'streetwise', 'subterfuge'].map(a =>
                <KoteRatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} />
              )}
            </div>
          </fieldset>
          <fieldset>
            <legend>Skills</legend>
            <div className="rating-grid">
              {['animalKen', 'crafts', 'drive', 'etiquette', 'firearms', 'martialArts', 'melee', 'performance', 'stealth', 'survival'].map(a =>
                <KoteRatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} />
              )}
            </div>
          </fieldset>
          <fieldset>
            <legend>Knowledges</legend>
            <div className="rating-grid">
              {['academics', 'computer', 'finance', 'investigation', 'law', 'medicine', 'occult', 'politics', 'ritualAbility', 'science'].map(a =>
                <KoteRatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} />
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
              <legend>Secondary Talents</legend>
              <CustomAbilityRow nameProp="hobbyTalent1Name" ratingProp="hobbyTalent1" placeholder="Hobby Talent" fields={fields} onField={handleField} onText={handleText} catalog={SECONDARY_TALENTS} />
              <CustomAbilityRow nameProp="hobbyTalent2Name" ratingProp="hobbyTalent2" placeholder="Hobby Talent" fields={fields} onField={handleField} onText={handleText} catalog={SECONDARY_TALENTS} />
              <CustomAbilityRow nameProp="hobbyTalent3Name" ratingProp="hobbyTalent3" placeholder="Hobby Talent" fields={fields} onField={handleField} onText={handleText} catalog={SECONDARY_TALENTS} />
            </fieldset>
            <fieldset>
              <legend>Secondary Skills</legend>
              <CustomAbilityRow nameProp="profSkill1Name" ratingProp="profSkill1" placeholder="Prof. Skill" fields={fields} onField={handleField} onText={handleText} catalog={SECONDARY_SKILLS} />
              <CustomAbilityRow nameProp="profSkill2Name" ratingProp="profSkill2" placeholder="Prof. Skill" fields={fields} onField={handleField} onText={handleText} catalog={SECONDARY_SKILLS} />
              <CustomAbilityRow nameProp="profSkill3Name" ratingProp="profSkill3" placeholder="Prof. Skill" fields={fields} onField={handleField} onText={handleText} catalog={SECONDARY_SKILLS} />
            </fieldset>
            <fieldset>
              <legend>Secondary Knowledges</legend>
              <CustomAbilityRow nameProp="expertKnowl1Name" ratingProp="expertKnowl1" placeholder="Expert Knowledge" fields={fields} onField={handleField} onText={handleText} catalog={SECONDARY_KNOWLEDGES} />
              <CustomAbilityRow nameProp="expertKnowl2Name" ratingProp="expertKnowl2" placeholder="Expert Knowledge" fields={fields} onField={handleField} onText={handleText} catalog={SECONDARY_KNOWLEDGES} />
              <CustomAbilityRow nameProp="expertKnowl3Name" ratingProp="expertKnowl3" placeholder="Expert Knowledge" fields={fields} onField={handleField} onText={handleText} catalog={SECONDARY_KNOWLEDGES} />
            </fieldset>
          </div>
        </div>
      </div>

      {/* ── Dharma & Chi ── */}
      <div hidden={tab !== 4}>
        <div className="form-section">
          <fieldset>
            <legend>Dharma</legend>
            <div className="field-row">
              <div className="field" style={{ flex: 2 }}>
                <label htmlFor="dharmaName">Dharma</label>
                <select id="dharmaName" name="dharmaName" value={fields.dharmaName} onChange={handleText}>
                  <option value="">— Select —</option>
                  {DHARMAS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <DotRating label="Dharma Rating" name="dharmaRating" value={fields.dharmaRating} onChange={handleField} min={0} max={10} />
          </fieldset>

          <fieldset>
            <legend>Soul</legend>
            <DotRating label="Hun (Higher Soul)" name="hun" value={fields.hun} onChange={handleField} min={0} max={10} />
            <DotRating label="P'o (Demon Soul)" name="po" value={fields.po} onChange={handleField} min={0} max={10} />
          </fieldset>

          <fieldset>
            <legend>Chi</legend>
            <DotRating label="Yin Chi" name="yinChi" value={fields.yinChi} onChange={handleField} min={0} max={10} />
            <DotRating label="Yang Chi" name="yangChi" value={fields.yangChi} onChange={handleField} min={0} max={10} />
            <DotRating label="Demon Chi" name="demonChi" value={fields.demonChi} onChange={handleField} min={0} max={10} />
          </fieldset>

          <fieldset>
            <legend>Imbalance</legend>
            <div className="field">
              <textarea id="imbalance" name="imbalance" value={fields.imbalance} onChange={handleText} rows={3} placeholder="Describe any chi imbalance effects..." />
            </div>
          </fieldset>

          <fieldset>
            <legend>Virtues</legend>
            <DotRating label="Conscience" name="conscience" value={fields.conscience} onChange={handleField} min={1} />
            <DotRating label="Self-Control" name="selfControl" value={fields.selfControl} onChange={handleField} min={1} />
            <DotRating label="Courage" name="courage" value={fields.courage} onChange={handleField} min={1} />
          </fieldset>

          <fieldset>
            <legend>Willpower</legend>
            <div className="field-row">
              <DotRating label="Permanent" name="willpower" value={fields.willpower} onChange={handleField} min={1} max={10} />
              <DotRating label="Temporary" name="currentWillpower" value={fields.currentWillpower} onChange={handleField} min={0} max={fields.willpower} />
            </div>
          </fieldset>

          <fieldset>
            <legend>Health</legend>
            <div className="field">
              <label htmlFor="woundLevel">Current Wound Level</label>
              <select id="woundLevel" value={fields.woundLevel} onChange={e => handleField('woundLevel', parseInt(e.target.value))}>
                {HEALTH_LEVELS.map((h, i) => (
                  <option key={i} value={i}>{h.label}{h.penalty ? ` (${h.penalty})` : ''}</option>
                ))}
              </select>
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Disciplines & Backgrounds ── */}
      <div hidden={tab !== 5}>
        <div className="form-section">
          {!isEdit && <p className="muted-hint">Save your character first to add disciplines and backgrounds.</p>}
          {isEdit && (
            <>
              <fieldset>
                <legend>Disciplines ({disciplines.length})</legend>
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
                    <label htmlFor="disc-name">Discipline Name</label>
                    <input id="disc-name" type="text" value={newDiscipline.name} onChange={e => setNewDiscipline(p => ({ ...p, name: e.target.value }))} autoComplete="off" />
                  </div>
                  <div className="field">
                    <label htmlFor="disc-level">Level</label>
                    <select id="disc-level" value={newDiscipline.level} onChange={e => setNewDiscipline(p => ({ ...p, level: parseInt(e.target.value) }))}>
                      {[1,2,3,4,5,6,7,8,9,10].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <button className="btn btn-secondary" onClick={handleAddDiscipline}>Add</button>
                </div>
              </fieldset>

              <fieldset>
                <legend>Backgrounds ({backgrounds.length})</legend>
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
                    <label htmlFor="bg-name">Background</label>
                    <input id="bg-name" type="text" list="bg-suggestions" value={newBackground.name}
                      onChange={e => setNewBackground(p => ({ ...p, name: e.target.value }))} autoComplete="off" placeholder="e.g. Horoscope" />
                    <datalist id="bg-suggestions">
                      {BACKGROUNDS.map(b => <option key={b.value} value={b.value} />)}
                    </datalist>
                  </div>
                  <div className="field">
                    <label htmlFor="bg-level">Level</label>
                    <select id="bg-level" value={newBackground.level} onChange={e => setNewBackground(p => ({ ...p, level: parseInt(e.target.value) }))}>
                      {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="bg-desc">Description</label>
                    <input id="bg-desc" type="text" value={newBackground.description} onChange={e => setNewBackground(p => ({ ...p, description: e.target.value }))} autoComplete="off" />
                  </div>
                  <button className="btn btn-secondary" onClick={handleAddBackground}>Add</button>
                </div>
              </fieldset>
            </>
          )}
        </div>
      </div>

      {/* ── Merits & Flaws ── */}
      <div hidden={tab !== 6}>
        <div className="form-section">
          {!isEdit && <p className="muted-hint">Save your character first to add merits and flaws.</p>}
          {isEdit && (
            <>
              <fieldset>
                <legend>Merits ({merits.length})</legend>
                {merits.length > 0 && (
                  <ul className="tag-list">
                    {merits.map(m => (
                      <li key={m.id} className="tag">
                        <span>{m.merit?.name ?? 'Merit'} ({m.pointsSpent} pt)</span>
                        <button className="tag-remove" onClick={() => { removeMerit(characterId, m.id); setMerits(prev => prev.filter(x => x.id !== m.id)) }}>×</button>
                      </li>
                    ))}
                  </ul>
                )}
              </fieldset>
              <fieldset>
                <legend>Flaws ({flaws.length})</legend>
                {flaws.length > 0 && (
                  <ul className="tag-list">
                    {flaws.map(f => (
                      <li key={f.id} className="tag">
                        <span>{f.flaw?.name ?? 'Flaw'} (+{f.pointsGained} pt)</span>
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
          {!isEdit && <p className="muted-hint">Save your character first to add inventory.</p>}
          {isEdit && (
            <fieldset>
              <legend>Inventory ({inventory.length})</legend>
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
                  <label htmlFor="inv-name">Item Name</label>
                  <input id="inv-name" type="text" value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))} autoComplete="off" />
                </div>
                <div className="field" style={{ width: '70px' }}>
                  <label htmlFor="inv-qty">Qty</label>
                  <input id="inv-qty" type="number" min={1} value={newItem.quantity}
                    onChange={e => setNewItem(p => ({ ...p, quantity: parseInt(e.target.value) || 1 }))} />
                </div>
                <div className="field">
                  <label htmlFor="inv-notes">Notes</label>
                  <input id="inv-notes" type="text" value={newItem.notes} onChange={e => setNewItem(p => ({ ...p, notes: e.target.value }))} autoComplete="off" />
                </div>
                <button className="btn btn-secondary" onClick={handleAddItem}>Add</button>
              </div>
            </fieldset>
          )}
        </div>
      </div>

      {/* ── Save ── */}
      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => navigate('/')}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Create character'}
        </button>
      </div>
    </div>
  )
}
