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
  animalKen: 'Animal Ken', martialArts: 'Martial Arts', primalUrge: 'Primal-Urge',
}

function label(key) {
  return ABILITY_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1)
}

const INVENTORY_CATEGORIES = ['WEAPON', 'ARMOR', 'VEHICLE', 'EQUIPMENT', 'OTHER']

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
  hobbyTalent1: 0, hobbyTalent2: 0, hobbyTalent3: 0,
  alertnessSpec: '', artSpec: '', athleticsSpec: '', awarenessSpec: '', brawlSpec: '', empathySpec: '',
  expressionSpec: '', intimidationSpec: '', leadershipSpec: '', streetwiseSpec: '', subterfugeSpec: '',
  hobbyTalent1Spec: '', hobbyTalent2Spec: '', hobbyTalent3Spec: '',
  // Skills
  crafts: 0, drive: 0, etiquette: 0, firearms: 0, martialArts: 0, meditation: 0,
  melee: 0, research: 0, stealth: 0, survival: 0, technology: 0,
  profSkill1: 0, profSkill2: 0, profSkill3: 0,
  craftsSpec: '', driveSpec: '', etiquetteSpec: '', firearmsSpec: '', martialArtsSpec: '', meditationSpec: '',
  meleeSpec: '', researchSpec: '', stealthSpec: '', survivalSpec: '', technologySpec: '',
  profSkill1Spec: '', profSkill2Spec: '', profSkill3Spec: '',
  // Knowledges
  academics: 0, computer: 0, cosmology: 0, enigmas: 0, esoterica: 0, investigation: 0,
  law: 0, medicine: 0, occult: 0, politics: 0, science: 0,
  expertKnowl1: 0, expertKnowl2: 0, expertKnowl3: 0,
  academicsSpec: '', computerSpec: '', cosmologySpec: '', enigmasSpec: '', esotericaSpec: '', investigationSpec: '',
  lawSpec: '', medicineSpec: '', occultSpec: '', politicsSpec: '', scienceSpec: '',
  expertKnowl1Spec: '', expertKnowl2Spec: '', expertKnowl3Spec: '',
  // Spheres
  sphereCorrespondence: 0, sphereEntropy: 0, sphereForces: 0,
  sphereLife: 0, sphereMatter: 0, sphereMind: 0,
  spherePrime: 0, sphereSpirit: 0, sphereTime: 0,
  // Advantages
  arete: 1, quintessence: 0, paradox: 0,
  // Virtues
  conscience: 1, selfControl: 1, courage: 1,
  // Path
  pathName: 'Humanity', pathRating: 2,
  // Willpower
  willpower: 3, currentWillpower: 3,
  // Health
  woundLevel: 0,
  // Focus
  paradigm: '', practice: '', instruments: '',
  // Chantry
  chantryName: '', chantryDescription: '',
  // Notes
  derangement1: '', derangement2: '', notes: '',
}

function MageRatingRow({ abilityKey, specKey, fields, onField, onText, max = 5 }) {
  return (
    <div className="ability-row">
      <DotRating label={label(abilityKey)} name={abilityKey} value={fields[abilityKey]} onChange={onField} max={max} />
      <input className="spec-input" type="text" name={specKey} value={fields[specKey] ?? ''} onChange={onText}
        placeholder="Specialty" aria-label={`${label(abilityKey)} specialty`} />
    </div>
  )
}

// ── Component ──

export default function MageForm() {
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
  const [newDiscipline, setNewDiscipline] = useState({ name: '', level: 1, notes: '' })
  const [newBackground, setNewBackground] = useState({ name: '', level: 1, description: '' })
  const [newItem, setNewItem] = useState({ name: '', category: 'EQUIPMENT', quantity: 1, damage: '', concealment: '', range: '', rate: '', clip: '', armorRating: null, handling: null, structure: null, notes: '' })
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  const TABS = ['Identity', 'Attributes', 'Abilities', 'Spheres', 'Disciplines & Backgrounds', 'Merits & Flaws', 'Inventory', 'Focus & Chantry']

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
      setNewDiscipline({ name: '', level: 1, notes: '' })
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
  const factionLabel = fields.affiliation === 'Technocracy' ? 'Convention' : 'Tradition'

  if (loading) return <p className="status-loading">Loading...</p>

  return (
    <div>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/')}>Back</button>
        <h2>{isEdit ? fields.name || 'Edit Mage' : 'New Mage'}</h2>
        <span className="splat-badge splat-badge--mage">Mage</span>
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
                <label htmlFor="altName">Shadow Name</label>
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
                <select id="nature" name="nature" value={fields.nature} onChange={handleText}>
                  <option value="">— Select —</option>
                  {ARCHETYPES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="demeanor">Demeanor</label>
                <select id="demeanor" name="demeanor" value={fields.demeanor} onChange={handleText}>
                  <option value="">— Select —</option>
                  {ARCHETYPES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="essence">Essence</label>
                <select id="essence" name="essence" value={fields.essence} onChange={handleText}>
                  <option value="">— Select —</option>
                  {ESSENCES.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Affiliation</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="affiliation">Affiliation</label>
                <select id="affiliation" name="affiliation" value={fields.affiliation} onChange={handleText}>
                  <option value="">— Select —</option>
                  {AFFILIATIONS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="clan">{factionLabel}</label>
                {factionList.length > 0 ? (
                  <select id="clan" name="clan" value={fields.clan} onChange={handleText}>
                    <option value="">— Select —</option>
                    {factionList.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                ) : (
                  <input id="clan" name="clan" type="text" value={fields.clan} onChange={handleText} autoComplete="off"
                    placeholder={fields.affiliation ? 'Enter faction name' : 'Select affiliation first'} />
                )}
              </div>
              <div className="field">
                <label htmlFor="mageSection">Section / Cabal</label>
                <input id="mageSection" name="mageSection" type="text" value={fields.mageSection} onChange={handleText} autoComplete="off" />
              </div>
            </div>
            <div className="field-row">
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
            <legend>Notes</legend>
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
              {['alertness', 'art', 'athletics', 'awareness', 'brawl', 'empathy', 'expression', 'intimidation', 'leadership', 'streetwise', 'subterfuge'].map(a =>
                <MageRatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} />
              )}
              {['hobbyTalent1', 'hobbyTalent2', 'hobbyTalent3'].map(a =>
                <MageRatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} />
              )}
            </div>
          </fieldset>
          <fieldset>
            <legend>Skills</legend>
            <div className="rating-grid">
              {['crafts', 'drive', 'etiquette', 'firearms', 'martialArts', 'meditation', 'melee', 'research', 'stealth', 'survival', 'technology'].map(a =>
                <MageRatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} />
              )}
              {['profSkill1', 'profSkill2', 'profSkill3'].map(a =>
                <MageRatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} />
              )}
            </div>
          </fieldset>
          <fieldset>
            <legend>Knowledges</legend>
            <div className="rating-grid">
              {['academics', 'computer', 'cosmology', 'enigmas', 'esoterica', 'investigation', 'law', 'medicine', 'occult', 'politics', 'science'].map(a =>
                <MageRatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} />
              )}
              {['expertKnowl1', 'expertKnowl2', 'expertKnowl3'].map(a =>
                <MageRatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} />
              )}
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Spheres ── */}
      <div hidden={tab !== 3}>
        <div className="form-section">
          <fieldset>
            <legend>Spheres</legend>
            <div className="rating-grid">
              {[
                { key: 'sphereCorrespondence', label: 'Correspondence' },
                { key: 'sphereEntropy',        label: 'Entropy' },
                { key: 'sphereForces',         label: 'Forces' },
                { key: 'sphereLife',           label: 'Life' },
                { key: 'sphereMatter',         label: 'Matter' },
                { key: 'sphereMind',           label: 'Mind' },
                { key: 'spherePrime',          label: 'Prime' },
                { key: 'sphereSpirit',         label: 'Spirit' },
                { key: 'sphereTime',           label: 'Time' },
              ].map(s => (
                <DotRating key={s.key} label={s.label} name={s.key} value={fields[s.key]} onChange={handleField} min={0} max={5} />
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Arete</legend>
            <DotRating label="Arete" name="arete" value={fields.arete} onChange={handleField} min={1} max={10} />
          </fieldset>
          <fieldset>
            <legend>Quintessence &amp; Paradox</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="quintessence">Quintessence</label>
                <input id="quintessence" name="quintessence" type="number" min={0} max={20} value={fields.quintessence} onChange={handleText} />
              </div>
              <div className="field">
                <label htmlFor="paradox">Paradox</label>
                <input id="paradox" name="paradox" type="number" min={0} max={20} value={fields.paradox} onChange={handleText} />
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Virtues</legend>
            <div className="rating-grid">
              <DotRating label="Conscience" name="conscience" value={fields.conscience} onChange={handleField} min={1} max={5} />
              <DotRating label="Self-Control" name="selfControl" value={fields.selfControl} onChange={handleField} min={1} max={5} />
              <DotRating label="Courage" name="courage" value={fields.courage} onChange={handleField} min={1} max={5} />
            </div>
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
      <div hidden={tab !== 4}>
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
                      onChange={e => setNewBackground(p => ({ ...p, name: e.target.value }))} autoComplete="off" placeholder="e.g. Avatar" />
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
      <div hidden={tab !== 5}>
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
      <div hidden={tab !== 6}>
        <div className="form-section">
          {!isEdit ? (
            <p className="muted-hint">Save your character first to add inventory.</p>
          ) : (
            <>
              <fieldset>
                <legend>Add Item</legend>
                <div className="field-row">
                  <div className="field" style={{ flex: 2 }}>
                    <label htmlFor="inv-name">Name</label>
                    <input id="inv-name" type="text" value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))} autoComplete="off" placeholder="e.g. Laptop or custom item" />
                  </div>
                  <div className="field">
                    <label htmlFor="inv-cat">Category</label>
                    <select id="inv-cat" value={newItem.category}
                      onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}>
                      {INVENTORY_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>)}
                    </select>
                  </div>
                  <div className="field" style={{ width: '70px' }}>
                    <label htmlFor="inv-qty">Qty</label>
                    <input id="inv-qty" type="number" min={1} value={newItem.quantity}
                      onChange={e => setNewItem(p => ({ ...p, quantity: parseInt(e.target.value) || 1 }))} />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="inv-notes">Notes</label>
                  <input id="inv-notes" type="text" value={newItem.notes}
                    onChange={e => setNewItem(p => ({ ...p, notes: e.target.value }))}
                    placeholder="Optional notes" autoComplete="off" />
                </div>
                <button type="button" className="btn btn-secondary" onClick={handleAddItem}>Add to inventory</button>
              </fieldset>

              {INVENTORY_CATEGORIES.filter(cat => inventory.some(i => i.category === cat)).map(cat => (
                <fieldset key={cat}>
                  <legend>{cat.charAt(0) + cat.slice(1).toLowerCase() + 's'}</legend>
                  <table className="inv-table">
                    <thead>
                      <tr>
                        <th>Name</th><th>Qty</th><th>Notes</th><th></th>
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
              {inventory.length === 0 && <p className="muted-hint">No items yet.</p>}
            </>
          )}
        </div>
      </div>

      {/* ── Focus & Chantry ── */}
      <div hidden={tab !== 7}>
        <div className="form-section">
          <fieldset>
            <legend>Focus</legend>
            <div className="field">
              <label htmlFor="paradigm">Paradigm</label>
              <textarea id="paradigm" name="paradigm" value={fields.paradigm} onChange={handleText} rows={3}
                placeholder="What does your mage believe about reality and how magick works?" />
            </div>
            <div className="field">
              <label htmlFor="practice">Practice</label>
              <textarea id="practice" name="practice" value={fields.practice} onChange={handleText} rows={3}
                placeholder="The methods and style through which your mage works magick..." />
            </div>
            <div className="field">
              <label htmlFor="instruments">Instruments</label>
              <textarea id="instruments" name="instruments" value={fields.instruments} onChange={handleText} rows={3}
                placeholder="Tools and foci used to channel magick (e.g. wand, computer, martial arts forms)..." />
            </div>
          </fieldset>
          <fieldset>
            <legend>Chantry / Construct</legend>
            <div className="field">
              <label htmlFor="chantryName">Name</label>
              <input id="chantryName" name="chantryName" type="text" value={fields.chantryName} onChange={handleText} autoComplete="off" />
            </div>
            <div className="field">
              <label htmlFor="chantryDescription">Description</label>
              <textarea id="chantryDescription" name="chantryDescription" value={fields.chantryDescription} onChange={handleText} rows={4}
                placeholder="Describe the chantry or construct — its location, defenses, resources, and residents..." />
            </div>
          </fieldset>
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
