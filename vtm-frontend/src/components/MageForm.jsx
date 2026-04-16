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
import { useLanguage } from '../i18n/LanguageContext'

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

const TAB_KEYS = ['tabIdentity', 'tabAttributes', 'tabAbilities', 'tabSecondaryAbilities', 'tabSpheres', 'tabDisciplinesBg', 'tabMeritsFlaws', 'tabInventory', 'tabFocusChantry']

export default function MageForm() {
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
  const [newDiscipline, setNewDiscipline] = useState({ name: '', level: 1, notes: '' })
  const [newBackground, setNewBackground] = useState({ name: '', level: 1, description: '' })
  const [newItem, setNewItem] = useState({ name: '', category: 'EQUIPMENT', quantity: 1, damage: '', concealment: '', range: '', rate: '', clip: '', armorRating: null, handling: null, structure: null, notes: '' })
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

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
    setFields(prev => ({ ...prev, [name]: value }))
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
        navigate(`/characters/${res.data.id}`, { replace: true })
      }
    } catch (err) {
      setSaveError(err.response?.data?.message || t('failedToSave'))
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
  const factionLabel = fields.affiliation === 'Technocracy' ? t('convention') : t('tradition')

  if (loading) return <p className="status-loading">{t('loading')}</p>

  return (
    <div>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/')}>{t('back')}</button>
        <h2>{isEdit ? fields.name || t('editMage') : t('newMage')}</h2>
        <span className="splat-badge splat-badge--mage">{t('mage')}</span>
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
                  <input id="clan" name="clan" type="text" value={fields.clan} onChange={handleText} autoComplete="off"
                    placeholder={fields.affiliation ? t('phFaction') : t('phSelectAffFirst')} />
                )}
              </div>
              <div className="field">
                <label htmlFor="mageSection">{t('sectionCabal')}</label>
                <input id="mageSection" name="mageSection" type="text" value={fields.mageSection} onChange={handleText} autoComplete="off" />
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
            { legend: 'physicalAttr', attrs: ['strength', 'dexterity', 'stamina'] },
            { legend: 'socialAttr',   attrs: ['charisma', 'manipulation', 'appearance'] },
            { legend: 'mentalAttr',   attrs: ['perception', 'intelligence', 'wits'] },
          ].map(({ legend, attrs }) => (
            <fieldset key={legend}>
              <legend>{t(legend)}</legend>
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

      {/* ── Spheres ── */}
      <div hidden={tab !== 4}>
        <div className="form-section">
          <fieldset>
            <legend>{t('spheres')}</legend>
            <div className="rating-grid">
              {[
                { key: 'sphereCorrespondence', tKey: 'correspondence' },
                { key: 'sphereEntropy',        tKey: 'entropy' },
                { key: 'sphereForces',         tKey: 'forces' },
                { key: 'sphereLife',           tKey: 'life' },
                { key: 'sphereMatter',         tKey: 'matter' },
                { key: 'sphereMind',           tKey: 'mind' },
                { key: 'spherePrime',          tKey: 'prime' },
                { key: 'sphereSpirit',         tKey: 'spirit' },
                { key: 'sphereTime',           tKey: 'time' },
              ].map(s => (
                <DotRating key={s.key} label={t(s.tKey)} name={s.key} value={fields[s.key]} onChange={handleField} min={0} max={5} />
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('arete')}</legend>
            <DotRating label={t('arete')} name="arete" value={fields.arete} onChange={handleField} min={1} max={10} />
          </fieldset>
          <fieldset>
            <legend>{t('quintessenceParadox')}</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="quintessence">{t('quintessence')}</label>
                <input id="quintessence" name="quintessence" type="number" min={0} max={20} value={fields.quintessence} onChange={handleText} />
              </div>
              <div className="field">
                <label htmlFor="paradox">{t('paradox')}</label>
                <input id="paradox" name="paradox" type="number" min={0} max={20} value={fields.paradox} onChange={handleText} />
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('virtues')}</legend>
            <div className="rating-grid">
              <DotRating label={t('conscience')} name="conscience" value={fields.conscience} onChange={handleField} min={1} max={5} />
              <DotRating label={t('selfControl')} name="selfControl" value={fields.selfControl} onChange={handleField} min={1} max={5} />
              <DotRating label={t('courage')} name="courage" value={fields.courage} onChange={handleField} min={1} max={5} />
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
            </>
          )}
        </div>
      </div>

      {/* ── Inventory ── */}
      <div hidden={tab !== 7}>
        <div className="form-section">
          {!isEdit ? (
            <p className="muted-hint">{t('saveCharFirstInventory')}</p>
          ) : (
            <>
              <fieldset>
                <legend>{t('addItem')}</legend>
                <div className="field-row">
                  <div className="field" style={{ flex: 2 }}>
                    <label htmlFor="inv-name">{t('name')}</label>
                    <input id="inv-name" type="text" value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))} autoComplete="off" placeholder={t('phInvItem')} />
                  </div>
                  <div className="field">
                    <label htmlFor="inv-cat">{t('category')}</label>
                    <select id="inv-cat" value={newItem.category}
                      onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}>
                      {INVENTORY_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>)}
                    </select>
                  </div>
                  <div className="field" style={{ width: '70px' }}>
                    <label htmlFor="inv-qty">{t('qty')}</label>
                    <input id="inv-qty" type="number" min={1} value={newItem.quantity}
                      onChange={e => setNewItem(p => ({ ...p, quantity: parseInt(e.target.value) || 1 }))} />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="inv-notes">{t('notes')}</label>
                  <input id="inv-notes" type="text" value={newItem.notes}
                    onChange={e => setNewItem(p => ({ ...p, notes: e.target.value }))}
                    placeholder={t('phOptionalNotes')} autoComplete="off" />
                </div>
                <button type="button" className="btn btn-secondary" onClick={handleAddItem}>{t('addToInventory')}</button>
              </fieldset>

              {INVENTORY_CATEGORIES.filter(cat => inventory.some(i => i.category === cat)).map(cat => (
                <fieldset key={cat}>
                  <legend>{cat.charAt(0) + cat.slice(1).toLowerCase() + 's'}</legend>
                  <table className="inv-table">
                    <thead>
                      <tr>
                        <th>{t('name')}</th><th>{t('qty')}</th><th>{t('notes')}</th><th></th>
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
              {inventory.length === 0 && <p className="muted-hint">{t('noItemsYet')}</p>}
            </>
          )}
        </div>
      </div>

      {/* ── Focus & Chantry ── */}
      <div hidden={tab !== 8}>
        <div className="form-section">
          <fieldset>
            <legend>{t('focus')}</legend>
            <div className="field">
              <label htmlFor="paradigm">{t('paradigm')}</label>
              <textarea id="paradigm" name="paradigm" value={fields.paradigm} onChange={handleText} rows={3}
                placeholder={t('phParadigm')} />
            </div>
            <div className="field">
              <label htmlFor="practice">{t('practice')}</label>
              <textarea id="practice" name="practice" value={fields.practice} onChange={handleText} rows={3}
                placeholder={t('phPractice')} />
            </div>
            <div className="field">
              <label htmlFor="instruments">{t('instruments')}</label>
              <textarea id="instruments" name="instruments" value={fields.instruments} onChange={handleText} rows={3}
                placeholder={t('phInstruments')} />
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('chantryConstruct')}</legend>
            <div className="field">
              <label htmlFor="chantryName">{t('name')}</label>
              <input id="chantryName" name="chantryName" type="text" value={fields.chantryName} onChange={handleText} autoComplete="off" />
            </div>
            <div className="field">
              <label htmlFor="chantryDescription">{t('chantryDescription')}</label>
              <textarea id="chantryDescription" name="chantryDescription" value={fields.chantryDescription} onChange={handleText} rows={4}
                placeholder={t('phChantryDesc')} />
            </div>
          </fieldset>
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
