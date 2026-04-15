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
import { getGifts, addGift, removeGift, getRites, addRite, removeRite, getFetishes, addFetish, removeFetish } from '../api/werewolfApi'
import DotRating from './DotRating'

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
]

const ABILITY_LABELS = {
  animalKen: 'Animal Ken', primalUrge: 'Primal-Urge', ritualAbility: 'Rituals',
}

function label(key) {
  return ABILITY_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1)
}

const FORM_STATS = [
  { form: 'Homid',  str: '+0', dex: '+0', sta: '+0', man: '+0', app: '+0', diff: 6, note: 'No change' },
  { form: 'Glabro', str: '+2', dex: '+0', sta: '+2', man: '-2', app: '-1', diff: 7, note: '' },
  { form: 'Crinos', str: '+4', dex: '+1', sta: '+3', man: '-3', app: '0',  diff: 6, note: 'Delirium' },
  { form: 'Hispo',  str: '+3', dex: '+2', sta: '+3', man: '-3', app: '—',  diff: 7, note: '+1 Bite dmg' },
  { form: 'Lupus',  str: '+1', dex: '+2', sta: '+2', man: '-3', app: '—',  diff: 6, note: '-2 Perc. diff' },
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
  // Sept
  septName: '', caernLocation: '', caernType: '', septTotem: '', septLeader: '',
  // Notes
  derangement1: '', derangement2: '', notes: '',
}

function WerewolfRatingRow({ abilityKey, specKey, fields, onField, onText, max = 5 }) {
  return (
    <div className="ability-row">
      <DotRating label={label(abilityKey)} name={abilityKey} value={fields[abilityKey]} onChange={onField} max={max} />
      <input className="spec-input" type="text" name={specKey} value={fields[specKey] ?? ''} onChange={onText}
        placeholder="Specialty" aria-label={`${label(abilityKey)} specialty`} />
    </div>
  )
}

// ── Component ──

export default function WerewolfForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const characterId = paramId ? Number(paramId) : null
  const isEdit = !!characterId

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
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  const TABS = ['Identity', 'Attributes', 'Abilities', 'Gifts & Rites', 'Renown & Rage', 'Backgrounds', 'Merits & Flaws', 'Forms']

  useEffect(() => {
    if (isEdit) loadCharacter()
    loadCatalogs()
  }, [characterId])

  async function loadCharacter() {
    try {
      const [charRes, bgRes, giftRes, riteRes, fetishRes, meritRes, flawRes] = await Promise.all([
        getCharacter(characterId),
        getBackgrounds(characterId),
        getGifts(characterId),
        getRites(characterId),
        getFetishes(characterId),
        getMerits(characterId),
        getFlaws(characterId),
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

  if (loading) return <p className="status-loading">Loading...</p>

  return (
    <div>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/')}>Back</button>
        <h2>{isEdit ? fields.name || 'Edit Garou' : 'New Garou'}</h2>
        <span className="splat-badge splat-badge--werewolf">Werewolf</span>
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
                <label htmlFor="altName">Deed Name</label>
                <input id="altName" name="altName" type="text" value={fields.altName} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="concept">Concept</label>
                <input id="concept" name="concept" type="text" value={fields.concept} onChange={handleText} autoComplete="off" />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Garou</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="breed">Breed</label>
                <select id="breed" name="breed" value={fields.breed} onChange={handleText}>
                  <option value="">— Select —</option>
                  {BREEDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="auspice">Auspice</label>
                <select id="auspice" name="auspice" value={fields.auspice} onChange={handleText}>
                  <option value="">— Select —</option>
                  {AUSPICES.map(a => <option key={a.value} value={a.value}>{a.value}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="tribe">Tribe</label>
                <select id="tribe" name="tribe" value={fields.tribe} onChange={handleText}>
                  <option value="">— Select —</option>
                  {TRIBES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="packName">Pack Name</label>
                <input id="packName" name="packName" type="text" value={fields.packName} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="packTotem">Pack Totem</label>
                <input id="packTotem" name="packTotem" type="text" value={fields.packTotem} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="rank">Rank</label>
                <select id="rank" name="rank" value={fields.rank} onChange={handleText}>
                  {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
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
            <legend>Sept</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="septName">Sept Name</label>
                <input id="septName" name="septName" type="text" value={fields.septName} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="caernLocation">Caern Location</label>
                <input id="caernLocation" name="caernLocation" type="text" value={fields.caernLocation} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="caernType">Caern Type</label>
                <input id="caernType" name="caernType" type="text" value={fields.caernType} onChange={handleText} autoComplete="off" />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="septTotem">Sept Totem</label>
                <input id="septTotem" name="septTotem" type="text" value={fields.septTotem} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="septLeader">Sept Leader</label>
                <input id="septLeader" name="septLeader" type="text" value={fields.septLeader} onChange={handleText} autoComplete="off" />
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
              {['alertness', 'athletics', 'brawl', 'empathy', 'expression', 'intimidation', 'leadership', 'primalUrge', 'streetwise', 'subterfuge'].map(a =>
                <WerewolfRatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} />
              )}
            </div>
          </fieldset>
          <fieldset>
            <legend>Skills</legend>
            <div className="rating-grid">
              {['animalKen', 'crafts', 'drive', 'etiquette', 'firearms', 'larceny', 'melee', 'performance', 'stealth', 'survival'].map(a =>
                <WerewolfRatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} />
              )}
            </div>
          </fieldset>
          <fieldset>
            <legend>Knowledges</legend>
            <div className="rating-grid">
              {['academics', 'computer', 'enigmas', 'investigation', 'law', 'medicine', 'occult', 'ritualAbility', 'science', 'technology'].map(a =>
                <WerewolfRatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} />
              )}
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Gifts & Rites ── */}
      <div hidden={tab !== 3}>
        <div className="form-section">
          {!isEdit && <p className="muted-hint">Save your character first to add gifts, rites, and fetishes.</p>}
          {isEdit && (
            <>
              <fieldset>
                <legend>Gifts ({gifts.length})</legend>
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
                <div className="field-row" style={{ alignItems: 'flex-end' }}>
                  <div className="field" style={{ flex: 2 }}>
                    <label htmlFor="gift-name">Gift Name</label>
                    <input id="gift-name" type="text" value={newGift.name} onChange={e => setNewGift(p => ({ ...p, name: e.target.value }))} autoComplete="off" />
                  </div>
                  <div className="field">
                    <label htmlFor="gift-level">Level</label>
                    <select id="gift-level" value={newGift.level} onChange={e => setNewGift(p => ({ ...p, level: parseInt(e.target.value) }))}>
                      {[1,2,3,4,5,6].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <button className="btn btn-secondary" onClick={handleAddGift}>Add</button>
                </div>
              </fieldset>

              <fieldset>
                <legend>Rites ({rites.length})</legend>
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
                    <label htmlFor="rite-name">Rite Name</label>
                    <input id="rite-name" type="text" value={newRite.name} onChange={e => setNewRite(p => ({ ...p, name: e.target.value }))} autoComplete="off" />
                  </div>
                  <div className="field">
                    <label htmlFor="rite-level">Level</label>
                    <select id="rite-level" value={newRite.level} onChange={e => setNewRite(p => ({ ...p, level: parseInt(e.target.value) }))}>
                      {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <button className="btn btn-secondary" onClick={handleAddRite}>Add</button>
                </div>
              </fieldset>

              <fieldset>
                <legend>Fetishes ({fetishes.length})</legend>
                {fetishes.length > 0 && (
                  <ul className="tag-list">
                    {fetishes.map(f => (
                      <li key={f.id} className="tag">
                        <span>{f.name} (Lv{f.level}, Gnosis {f.gnosisRating})</span>
                        <button className="tag-remove" onClick={() => { removeFetish(characterId, f.id); setFetishes(prev => prev.filter(x => x.id !== f.id)) }}>×</button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="field-row" style={{ alignItems: 'flex-end' }}>
                  <div className="field" style={{ flex: 2 }}>
                    <label htmlFor="fetish-name">Fetish Name</label>
                    <input id="fetish-name" type="text" value={newFetish.name} onChange={e => setNewFetish(p => ({ ...p, name: e.target.value }))} autoComplete="off" />
                  </div>
                  <div className="field">
                    <label htmlFor="fetish-level">Level</label>
                    <select id="fetish-level" value={newFetish.level} onChange={e => setNewFetish(p => ({ ...p, level: parseInt(e.target.value) }))}>
                      {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="fetish-gnosis">Gnosis</label>
                    <select id="fetish-gnosis" value={newFetish.gnosisRating} onChange={e => setNewFetish(p => ({ ...p, gnosisRating: parseInt(e.target.value) }))}>
                      {[1,2,3,4,5,6,7,8,9,10].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <button className="btn btn-secondary" onClick={handleAddFetish}>Add</button>
                </div>
              </fieldset>
            </>
          )}
        </div>
      </div>

      {/* ── Renown & Rage ── */}
      <div hidden={tab !== 4}>
        <div className="form-section">
          <fieldset>
            <legend>Rage</legend>
            <div className="field-row">
              <DotRating label="Permanent Rage" name="rage" value={fields.rage} onChange={handleField} min={0} max={10} />
              <DotRating label="Temporary Rage" name="currentRage" value={fields.currentRage} onChange={handleField} min={0} max={10} />
            </div>
          </fieldset>
          <fieldset>
            <legend>Gnosis</legend>
            <div className="field-row">
              <DotRating label="Permanent Gnosis" name="gnosis" value={fields.gnosis} onChange={handleField} min={0} max={10} />
              <DotRating label="Temporary Gnosis" name="currentGnosis" value={fields.currentGnosis} onChange={handleField} min={0} max={10} />
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
            <legend>Renown</legend>
            <div className="field-row">
              <DotRating label="Glory (Perm)" name="glory" value={fields.glory} onChange={handleField} min={0} max={10} />
              <DotRating label="Glory (Temp)" name="currentGlory" value={fields.currentGlory} onChange={handleField} min={0} max={10} />
            </div>
            <div className="field-row">
              <DotRating label="Honor (Perm)" name="honor" value={fields.honor} onChange={handleField} min={0} max={10} />
              <DotRating label="Honor (Temp)" name="currentHonor" value={fields.currentHonor} onChange={handleField} min={0} max={10} />
            </div>
            <div className="field-row">
              <DotRating label="Wisdom (Perm)" name="wisdomRenown" value={fields.wisdomRenown} onChange={handleField} min={0} max={10} />
              <DotRating label="Wisdom (Temp)" name="currentWisdomRenown" value={fields.currentWisdomRenown} onChange={handleField} min={0} max={10} />
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

      {/* ── Backgrounds ── */}
      <div hidden={tab !== 5}>
        <div className="form-section">
          {!isEdit && <p className="muted-hint">Save your character first to add backgrounds.</p>}
          {isEdit && (
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
                    onChange={e => setNewBackground(p => ({ ...p, name: e.target.value }))} autoComplete="off" placeholder="e.g. Ancestors" />
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

      {/* ── Forms ── */}
      <div hidden={tab !== 7}>
        <div className="form-section">
          <fieldset>
            <legend>Shapeshifting Forms</legend>
            <div style={{ overflowX: 'auto' }}>
              <table className="inv-table">
                <thead>
                  <tr>
                    <th>Form</th><th>Str</th><th>Dex</th><th>Sta</th><th>Man</th><th>App</th><th>Diff</th><th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {FORM_STATS.map(f => (
                    <tr key={f.form}>
                      <td style={{ fontWeight: 600 }}>{f.form}</td>
                      <td>{f.str}</td><td>{f.dex}</td><td>{f.sta}</td>
                      <td>{f.man}</td><td>{f.app}</td><td>{f.diff}</td>
                      <td className="inv-notes">{f.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="muted-hint" style={{ marginTop: 'var(--space-sm)' }}>
              Modifiers are applied to your base attributes. Crinos form induces Delirium in humans.
            </p>
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
