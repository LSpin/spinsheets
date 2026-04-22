import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getCharacter, updateCharacter, getDisciplines, addDiscipline, removeDiscipline } from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import DotRating from './DotRating'
import CatalogSelect from './CatalogSelect'
import { useLanguage } from '../i18n/LanguageContext'
import ExportModal from './ExportModal'
import { useTheme } from '../context/ThemeContext'
import TagInfoPanel from './TagInfoPanel'
import SeventhSeaDiceRoller from './SeventhSeaDiceRoller'
import { SEVEN_SEA_NPCS, SEVEN_SEA_NPC_CATALOG } from '../data/sevenSeaNpcs'
import { SEVEN_SEA_ADVANTAGES, DUELING_STYLES, SEVEN_SEA_NATIONS, getAllArcana } from '../data/sevenSeaData'

const SEVEN_SEA_ARCANA = getAllArcana()
const VIRTUES = SEVEN_SEA_ARCANA.map(a => `${a.card} — ${a.virtue.name}`)
const HUBRISES = SEVEN_SEA_ARCANA.map(a => `${a.card} — ${a.hubris.name}`)

const VILLAIN_RANKS = [
  { rank: 1, description: 'Minor nuisance — a bandit captain, petty noble, or small-time crook.' },
  { rank: 2, description: 'Local threat — a corrupt magistrate, smuggler boss, or rogue knight.' },
  { rank: 3, description: 'Regional menace — a pirate captain, cult leader, or ambitious baron.' },
  { rank: 5, description: 'National threat — a master spy, admiral, or dark sorcerer.' },
  { rank: 8, description: 'Continental power — a secret society grandmaster or warlord.' },
  { rank: 10, description: 'Legendary villain — a figure who reshapes nations.' },
  { rank: 15, description: 'Mythic antagonist — the stuff of legend and nightmare.' },
  { rank: 20, description: 'World-ending threat — demigod-level power.' },
]

const MONSTER_QUALITIES = [
  { name: 'Aquatic', description: 'Can breathe and move freely underwater.' },
  { name: 'Armored', description: 'Natural armor. Takes 1 fewer Wound from each hit.' },
  { name: 'Crushing', description: 'Grapple attacks deal extra Wounds.' },
  { name: 'Elemental', description: 'Tied to an element. Immune to it; vulnerable to its opposite.' },
  { name: 'Fear', description: 'Heroes must spend a Hero Point to act against it or flee.' },
  { name: 'Flying', description: 'Melee attacks against it cost 1 extra Raise.' },
  { name: 'Infectious', description: 'Bite or touch spreads disease or curse.' },
  { name: 'Nocturnal', description: 'Gains bonus Strength after dark.' },
  { name: 'Poisonous', description: 'Attacks deliver venom — ongoing Wounds.' },
  { name: 'Regenerating', description: 'Heals Wounds each Round unless killed by a specific method.' },
  { name: 'Shapeshifting', description: 'Can change form to deceive or ambush.' },
  { name: 'Swarming', description: 'Mass of small creatures. Cannot be targeted individually.' },
  { name: 'Tentacled', description: 'Multiple grasping limbs. Can attack multiple targets.' },
  { name: 'Undead', description: 'Immune to fear, poison, and disease.' },
]

// Use SEVEN_SEA_ADVANTAGES from data file for the full catalog
const ADVANTAGES = SEVEN_SEA_ADVANTAGES

const NPC_TYPES = [
  { key: 'villain', label: 'Villain', description: 'A named antagonist with Rank, Traits, Advantages, Schemes, and Arcana. Villains are the main opponents of the Heroes.' },
  { key: 'henchman', label: 'Henchman', description: 'A named but less powerful NPC. Has a Strength rating (dice pool for all actions). Fights individually. No Traits or Advantages.' },
  { key: 'brute', label: 'Brute Squad', description: 'A group of unnamed fighters acting as one. Strength = number of brutes. Each Wound removes one brute. No individual actions.' },
  { key: 'monster', label: 'Monster', description: 'A supernatural creature with special Qualities. Has Strength like a Henchman, plus unique abilities from Monster Qualities.' },
]

const INITIAL = {
  npc: true, splat: 'SEVENTH_SEA',
  name: '', altName: '', concept: '',
  nation: '', nature: '', demeanor: '',
  traitBrawn: 2, traitFinesse: 2, traitResolve: 2, traitWits7s: 2, traitPanache: 2,
  heroVirtue: '', heroHubris: '',
  sorceryDesc: '',
  willpower: 0, currentWillpower: 0,
  heroPoints: 0, wealth7s: 0, corruption: 0, dramaticWounds: 0,
  heroStories: '', backstory: '', notes: '', appearanceDesc: '', personalItems: '',
  activeScheme: '', schemeSteps: 3, schemeProgress: 0, schemeDesc: '',
}


const TAB_KEYS = ['tabIdentity', 'tab7sVillainStats', 'tab7sTraits', 'tab7sAdvantages', 'tab7sSchemes', 'tabBackstory', 'tabDiceRoller']

export default function SeventhSeaVillainForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const [searchParams] = useSearchParams()
  const viewMode = searchParams.get('mode') === 'view'
  const characterId = paramId || null

  useEffect(() => { switchTheme('7thsea') }, [])
  const { isAutoCreating } = useAutoCreate(characterId, INITIAL)

  const [tab, setTab] = useState(0)
  const [fields, setFields] = useState(INITIAL)
  const [disciplines, setDisciplines] = useState([])
  const [newAdv, setNewAdv] = useState({ name: '', level: 1, notes: '' })
  const [advSearch, setAdvSearch] = useState('')
  const [tagInfo, setTagInfo] = useState(null)
  const [npcType, setNpcType] = useState('villain')
  const [duelingStyle, setDuelingStyle] = useState('')
  const [templateName, setTemplateName] = useState('')
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [actionError, setActionError] = useState(null)

  useEffect(() => { if (characterId) loadCharacter() }, [characterId])

  async function loadCharacter() {
    try {
      const [charRes, discRes] = await Promise.all([getCharacter(characterId), getDisciplines(characterId)])
      const data = charRes.data
      setFields(prev => { const m = { ...prev }; for (const k in prev) { if (data[k] !== undefined && data[k] !== null) m[k] = data[k] }; return m })
      setDisciplines(discRes.data)
    } catch { setSaveError(t('failedToLoad')) }
    finally { setLoading(false) }
  }

  function handleField(name, value) { setFields(prev => ({ ...prev, [name]: typeof value === 'string' ? value : Number(value) })) }
  function handleText(e) { setFields(prev => ({ ...prev, [e.target.name]: e.target.value })) }
  async function handleSave() { setSaving(true); setSaveError(null); try { await updateCharacter(characterId, fields) } catch { setSaveError(t('failedToSave')) } finally { setSaving(false) } }
  async function handleDoneEditing() { await handleSave(); navigate('/7thsea') }

  function loadTemplate(templateNameVal) {
    const tmpl = SEVEN_SEA_NPCS.find(t => t.name === templateNameVal)
    if (!tmpl) return
    setTemplateName(templateNameVal)
    setFields(prev => ({
      ...prev,
      name: tmpl.name,
      concept: tmpl.description || '',
      nation: tmpl.nation || '',
      willpower: tmpl.rank || 0,
      traitBrawn: tmpl.brawn || 2,
      traitFinesse: tmpl.finesse || 2,
      traitResolve: tmpl.resolve || 2,
      traitWits7s: tmpl.wits || 2,
      traitPanache: tmpl.panache || 2,
      notes: tmpl.notes || '',
    }))
    setNpcType(tmpl.type || 'villain')
  }

  async function handleAddAdvantage() {
    if (!newAdv.name.trim()) return
    try {
      const hit = ADVANTAGES.find(a => a.name === newAdv.name)
      const adv = hit ? { name: hit.name, level: hit.cost, notes: '' } : newAdv
      const res = await addDiscipline(characterId, adv)
      setDisciplines(prev => [...prev, res.data])
      setNewAdv({ name: '', level: 1, notes: '' })
    } catch { setActionError(t('failedToSave')) }
  }

  const vRank = fields.willpower || 0
  const strength = vRank
  const influence = vRank
  const danger = Math.ceil(vRank / 2)
  const vDesc = VILLAIN_RANKS.reduce((best, v) => v.rank <= vRank ? v : best, VILLAIN_RANKS[0])

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/7thsea')}>{t('back')}</button>
        <h2>{fields.name || 'New Villain'}</h2>
        <span className="splat-badge splat-badge--seventh-sea">7th Sea</span>
        <span className="splat-badge splat-badge--seventh-sea">Villain / Monster</span>
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}
      {actionError && <p className="status-error" role="alert">{actionError}</p>}

      <div className="tab-list" role="tablist">
        {TAB_KEYS.map((tk, i) => (
          <button key={tk} role="tab" id={`tab-${i}`} className={`btn btn-secondary${tab === i ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(i)} aria-selected={tab === i} aria-controls={`tabpanel-${i}`}>{t(tk)}</button>
        ))}
      </div>

      {/* ── Identity ── */}
      <div role="tabpanel" id={`tabpanel-0`} aria-labelledby={`tab-0`} hidden={tab !== 0}>
        <div className="form-section">
          <fieldset>
            <legend>Load Template</legend>
            <CatalogSelect
              id="npc-template" name="npcTemplate" label="Premade NPC"
              value={templateName} onChange={(_, val) => loadTemplate(val)}
              catalog={SEVEN_SEA_NPC_CATALOG} placeholder="Search NPC templates..."
              showDescOnSelect={false}
            />
            {templateName && (
              <p className="muted-hint muted-hint--xs" style={{ marginTop: 'var(--space-xs)', color: 'var(--color-accent-fg)' }}>
                Loaded from template: <strong>{templateName}</strong> — customize freely below.
              </p>
            )}
          </fieldset>

          <fieldset>
            <legend>Identity</legend>
            <div className="field-row">
              <div className="field" style={{ flex: 2 }}><label>Name *</label><input name="name" value={fields.name} onChange={handleText} placeholder="El Vagabundo, The Drachen..." /></div>
              <div className="field">
                <label>NPC Type</label>
                <select value={npcType} onChange={e => setNpcType(e.target.value)}>
                  {NPC_TYPES.map(nt => <option key={nt.key} value={nt.key}>{t(nt.label)}</option>)}
                </select>
              </div>
            </div>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-md)' }}>
              {NPC_TYPES.find(nt => nt.key === npcType)?.description}
            </p>
            <div className="field-row">
              <div className="field">
                <label>Nation / Origin</label>
                <select name="nation" value={fields.nation} onChange={handleText}>
                  <option value="">Select or type below</option>
                  {SEVEN_SEA_NATIONS.map(n => <option key={n.value} value={n.value}>{n.value} ({n.source})</option>)}
                </select>
                {!SEVEN_SEA_NATIONS.some(n => n.value === fields.nation) && (
                  <input name="nation" value={fields.nation} onChange={handleText} placeholder="Custom nation..." style={{ marginTop: 'var(--space-xs)' }} />
                )}
              </div>
              <div className="field"><label>Concept</label><input name="concept" value={fields.concept} onChange={handleText} placeholder="Ruthless pirate queen, cursed knight..." /></div>
            </div>
            {(npcType === 'villain') && (
              <div className="field-row">
                <div className="field">
                  <label>Virtue (Arcana)</label>
                  <select name="heroVirtue" value={fields.heroVirtue} onChange={handleText}>
                    <option value="">None</option>
                    {VIRTUES.map(v => <option key={v} value={v}>{t(v)}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Hubris (Arcana)</label>
                  <select name="heroHubris" value={fields.heroHubris} onChange={handleText}>
                    <option value="">None</option>
                    {HUBRISES.map(h => <option key={h} value={h}>{t(h)}</option>)}
                  </select>
                </div>
              </div>
            )}
            {(npcType === 'villain') && (
              <div className="field-row">
                <div className="field">
                  <label>Dueling Style</label>
                  <select value={duelingStyle} onChange={e => setDuelingStyle(e.target.value)}>
                    <option value="">None</option>
                    {DUELING_STYLES.map(ds => <option key={ds.name} value={ds.name}>{ds.name} ({ds.nation})</option>)}
                  </select>
                  {duelingStyle && (() => {
                    const ds = DUELING_STYLES.find(d => d.name === duelingStyle)
                    return ds && (
                      <div className="archetype-desc" style={{ marginTop: 'var(--space-xs)' }}>
                        <strong>{ds.name}</strong> ({ds.nation}) — {ds.trait}
                        <p className="muted-hint muted-hint--xs" style={{ margin: '2px 0' }}>{ds.description}</p>
                        <p style={{ fontSize: '0.82rem', fontWeight: 600 }}>Style Bonus: {ds.styleBonus}</p>
                        <span className="muted-hint muted-hint--xs">Source: {ds.source}</span>
                      </div>
                    )
                  })()}
                </div>
              </div>
            )}
            {fields.nation && (() => {
              const nationData = SEVEN_SEA_NATIONS.find(n => n.value === fields.nation)
              if (!nationData || !nationData.sorcery) return null
              return (
                <div style={{ padding: 'var(--space-sm)', background: 'rgba(52,152,219,0.08)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--color-accent-fg)', marginTop: 'var(--space-sm)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Sorcery Tradition: {nationData.sorcery}</div>
                  <p className="muted-hint muted-hint--xs" style={{ margin: '2px 0 0' }}>
                    Available to characters from {nationData.value} ({nationData.region}). Source: {nationData.source}
                  </p>
                </div>
              )
            })()}
          </fieldset>
        </div>
      </div>

      {/* ── Villain / Monster Stats ── */}
      <div role="tabpanel" id={`tabpanel-1`} aria-labelledby={`tab-1`} hidden={tab !== 1}>
        <div className="form-section">
          <fieldset>
            <legend>Strength & Rank</legend>
            {(npcType === 'villain') && (
              <>
                <div className="field">
                  <label>Villain Rank</label>
                  <select name="willpower" value={fields.willpower} onChange={e => handleField('willpower', parseInt(e.target.value))}>
                    {[1,2,3,4,5,6,7,8,9,10,12,15,20].map(r => <option key={r} value={r}>{t('rank')} {r}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
                  <div className="form-section" style={{ padding: 'var(--space-md)', textAlign: 'center', marginBottom: 0 }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Strength</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{strength}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>dice rolled</div>
                  </div>
                  <div className="form-section" style={{ padding: 'var(--space-md)', textAlign: 'center', marginBottom: 0 }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Influence</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{influence}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>social dice</div>
                  </div>
                  <div className="form-section" style={{ padding: 'var(--space-md)', textAlign: 'center', marginBottom: 0 }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Danger Pts</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{danger}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>per scene</div>
                  </div>
                </div>
                <p className="muted-hint muted-hint--xs" style={{ marginTop: 'var(--space-sm)' }}>{vDesc?.description}</p>
              </>
            )}
            {(npcType === 'henchman' || npcType === 'brute' || npcType === 'monster') && (
              <div className="field-row">
                <DotRating label={npcType === 'brute' ? 'Brute Squad Size (Strength)' : 'Strength'} name="willpower" value={fields.willpower} onChange={handleField} min={1} max={20} />
              </div>
            )}
          </fieldset>

          {(npcType === 'villain') && (
            <fieldset>
              <legend>Dramatic Wounds & Corruption</legend>
              <div className="rating-grid">
                <div className="ability-row"><DotRating label="Dramatic Wounds" name="dramaticWounds" value={fields.dramaticWounds} onChange={handleField} min={0} max={5} /></div>
                <div className="ability-row"><DotRating label="Corruption" name="corruption" value={fields.corruption} onChange={handleField} min={0} max={10} /></div>
              </div>
            </fieldset>
          )}

          {(npcType === 'monster') && (
            <fieldset>
              <legend>Monster Qualities</legend>
              <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
                Select qualities that apply. Describe unique abilities in the notes.
              </p>
              {MONSTER_QUALITIES.map(q => (
                <details key={q.name} style={{ marginBottom: 'var(--space-xs)' }}>
                  <summary style={{ cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-accent-fg)', padding: '0.2rem 0.5rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', display: 'inline-block', marginRight: 'var(--space-xs)' }}>
                    {q.name}
                  </summary>
                  <p className="muted-hint muted-hint--xs" style={{ padding: 'var(--space-xs)', maxWidth: 400 }}>{q.description}</p>
                </details>
              ))}
              <div className="field" style={{ marginTop: 'var(--space-md)' }}>
                <label>Active Qualities & Special Abilities</label>
                <textarea name="sorceryDesc" value={fields.sorceryDesc} onChange={handleText} rows={4} style={{ width: '100%' }} placeholder="List active monster qualities and unique abilities..." />
              </div>
            </fieldset>
          )}

          <details>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>Villain Rank Reference</summary>
            <table className="inv-table" style={{ marginTop: 'var(--space-sm)' }}>
              <thead><tr><th>Rank</th><th>Str</th><th>Inf</th><th>DP</th><th>Description</th></tr></thead>
              <tbody>
                {VILLAIN_RANKS.map(v => (
                  <tr key={v.rank} style={{ background: fields.willpower === v.rank ? 'rgba(52,152,219,0.08)' : 'transparent' }}>
                    <td style={{ fontWeight: 600 }}>{v.rank}</td>
                    <td>{v.rank}</td>
                    <td>{v.rank}</td>
                    <td>{Math.ceil(v.rank / 2)}</td>
                    <td className="inv-notes">{v.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </div>
      </div>

      {/* ── Traits (Villains only) ── */}
      <div role="tabpanel" id={`tabpanel-2`} aria-labelledby={`tab-2`} hidden={tab !== 2}>
        <div className="form-section">
          <fieldset>
            <legend>Traits</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              {npcType === 'villain' ? 'Villains have Traits like Heroes. They can exceed 5.' : 'Henchmen/Brutes use Strength for all rolls. Traits are optional for flavor.'}
            </p>
            <div className="rating-grid">
              {['traitBrawn', 'traitFinesse', 'traitResolve', 'traitWits7s', 'traitPanache'].map(key => (
                <div key={key} className="ability-row">
                  <DotRating label={t(key)} name={key} value={fields[key]} onChange={handleField} min={0} max={10} />
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Advantages ── */}
      <div role="tabpanel" id={`tabpanel-3`} aria-labelledby={`tab-3`} hidden={tab !== 3}>
        <div className="form-section">
          <fieldset>
            <legend>Advantages ({disciplines.length})</legend>
            {disciplines.length > 0 && (
              <ul className="tag-list" style={{ marginBottom: 'var(--space-md)' }}>
                {disciplines.map(d => (
                  <li key={d.id} className={`tag tag--clickable${d.id === tagInfo?.id ? ' tag--active' : ''}`}
                    onClick={() => setTagInfo(ti => ti?.id === d.id ? null : { ...d, kind: 'advantage' })}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTagInfo(ti => ti?.id === d.id ? null : { ...d, kind: 'advantage' }); } }}
                    role="button" tabIndex={0}>
                    <span>{d.name} ({d.level}pt)</span>
                    <button className="tag-remove" onClick={e => { e.stopPropagation(); removeDiscipline(characterId, d.id); setDisciplines(prev => prev.filter(x => x.id !== d.id)); if (tagInfo?.id === d.id) setTagInfo(null) }}>x</button>
                  </li>
                ))}
              </ul>
            )}
            {tagInfo?.kind === 'advantage' && (() => {
              const entry = ADVANTAGES.find(a => a.name.toLowerCase() === tagInfo.name.toLowerCase())
              return (
                <aside className="tag-info-panel" style={{ marginBottom: 'var(--space-md)' }}>
                  <button className="tag-info-panel-close" onClick={() => setTagInfo(null)}>{t('close')}</button>
                  <p className="tag-info-panel-name">{tagInfo.name}</p>
                  <p className="tag-info-panel-desc">Advantage · {tagInfo.level}pt</p>
                  {entry && <p style={{ fontSize: '0.82rem', lineHeight: 1.55 }}>{entry.description}</p>}
                </aside>
              )
            })()}
            <div className="catalog-search-wrap">
              <input type="search" value={advSearch} onChange={e => setAdvSearch(e.target.value)}
                placeholder="Search villain advantages..." />
              <span className="catalog-search-count">{ADVANTAGES.filter(a => !advSearch || a.name.toLowerCase().includes(advSearch.toLowerCase()) || a.description.toLowerCase().includes(advSearch.toLowerCase())).length}</span>
            </div>
            <ul className="catalog-list">
              {ADVANTAGES.filter(a => !advSearch || a.name.toLowerCase().includes(advSearch.toLowerCase()) || a.description.toLowerCase().includes(advSearch.toLowerCase()))
                .map(a => {
                  const already = disciplines.some(d => d.name.toLowerCase() === a.name.toLowerCase())
                  return (
                    <li key={a.name} className={`catalog-item${already ? ' catalog-item--added' : ''}`}>
                      <button className="catalog-item-btn" onClick={() => {
                        if (!already) addDiscipline(characterId, { name: a.name, level: a.cost, notes: '' }).then(res => setDisciplines(prev => [...prev, res.data])).catch(() => setActionError(t('failedToSave')))
                      }}>
                        <div className="catalog-item-main">
                          <span className="catalog-item-name">{a.name}</span>
                          <span className="catalog-item-desc">{a.description}{a.source && a.source !== 'Core' ? ` [${a.source}]` : ''}</span>
                        </div>
                        <div className="catalog-item-meta">
                          <span className="catalog-item-cost">{a.cost}pt</span>
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

      {/* ── Schemes ── */}
      <div role="tabpanel" id={`tabpanel-4`} aria-labelledby={`tab-4`} hidden={tab !== 4}>
        <div className="form-section">
          <fieldset>
            <legend>Active Scheme</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Villains have Schemes — multi-step evil plans. The Villain completes one step per session unless the Heroes intervene. Influence ({influence}) dice for social/political schemes, Strength ({strength}) dice for combat schemes.
            </p>
            <div className="field-row">
              <div className="field" style={{ flex: 2 }}>
                <label>Active Scheme</label>
                <input name="activeScheme" value={fields.activeScheme} onChange={handleText} placeholder="Seize the Throne of Castille..." />
              </div>
            </div>
            <div className="field">
              <label>Scheme Description</label>
              <textarea name="schemeDesc" value={fields.schemeDesc} onChange={handleText} rows={3} style={{ width: '100%' }} placeholder="What is this villain trying to accomplish and why?" />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Total Scheme Steps (1-5)</label>
                <select name="schemeSteps" value={fields.schemeSteps} onChange={e => handleField('schemeSteps', parseInt(e.target.value))}>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} step{n !== 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Steps Completed</label>
                <select name="schemeProgress" value={fields.schemeProgress} onChange={e => handleField('schemeProgress', parseInt(e.target.value))}>
                  {Array.from({ length: (fields.schemeSteps || 3) + 1 }, (_, i) => i).map(n => <option key={n} value={n}>{n} of {fields.schemeSteps || 3}</option>)}
                </select>
              </div>
            </div>
            {fields.activeScheme && (
              <div style={{ padding: 'var(--space-sm)', background: 'rgba(52,152,219,0.08)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--color-accent-fg)', marginTop: 'var(--space-sm)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Scheme Progress</div>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  {Array.from({ length: fields.schemeSteps || 3 }, (_, i) => (
                    <div key={i} style={{
                      width: 28, height: 28, borderRadius: 'var(--radius-sm)',
                      background: i < (fields.schemeProgress || 0) ? 'var(--color-accent-fg)' : 'var(--color-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700, color: i < (fields.schemeProgress || 0) ? '#fff' : 'var(--color-text-muted)',
                    }}>{i + 1}</div>
                  ))}
                </div>
                <div className="muted-hint muted-hint--xs">
                  {(fields.schemeProgress || 0) >= (fields.schemeSteps || 3)
                    ? 'Scheme complete! The villain has achieved their goal.'
                    : `${(fields.schemeSteps || 3) - (fields.schemeProgress || 0)} step${(fields.schemeSteps || 3) - (fields.schemeProgress || 0) !== 1 ? 's' : ''} remaining. Heroes must intervene!`}
                </div>
              </div>
            )}
          </fieldset>
          <fieldset>
            <legend>All Schemes (Notes)</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Document all villain schemes here -- past, present, and future plans.
            </p>
            <textarea name="heroStories" value={fields.heroStories} onChange={handleText} rows={10} style={{ width: '100%' }} placeholder={
`Scheme 1: Seize the Throne of Castille
Objective: Crown himself King
Steps:
  1. Bribe the Inquisition generals
  2. Discredit the true heir
  3. Arrange a "tragic accident"
  4. March on San Cristobal
Consequence if unchecked: Civil war engulfs Castille`} />
          </fieldset>
          <fieldset>
            <legend>Sorcery / Special Abilities</legend>
            <textarea name="sorceryDesc" value={fields.sorceryDesc} onChange={handleText} rows={4} style={{ width: '100%' }} placeholder="Describe sorcerous abilities, supernatural powers, or unique villain mechanics..." />
          </fieldset>
        </div>
      </div>

      {/* ── Backstory ── */}
      <div role="tabpanel" id={`tabpanel-5`} aria-labelledby={`tab-5`} hidden={tab !== 5}>
        <div className="form-section">
          <fieldset><legend>Backstory & Motivation</legend><textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} style={{ width: '100%' }} placeholder="Why does this villain do what they do?" /></fieldset>
          <fieldset><legend>Appearance</legend><textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>ST Notes</legend><textarea name="notes" value={fields.notes} onChange={handleText} rows={4} style={{ width: '100%' }} placeholder="Session plans, player interactions, weaknesses..." /></fieldset>
        </div>
      </div>

      {/* ── Dice Roller ── */}
      <div role="tabpanel" id={`tabpanel-6`} aria-labelledby={`tab-6`} hidden={tab !== 6}>
        <SeventhSeaDiceRoller />
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => setShowExport(true)}>{t('exportPdf')}</button>
        <button className="btn btn-secondary" onClick={() => navigate('/7thsea')}>{t('cancel')}</button>
        <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>{saving ? t('saving') : t('quickSave')}</button>
        <button className="btn btn-primary" onClick={handleDoneEditing} disabled={saving}>{t('doneEditing')}</button>
      </div>
      <ExportModal open={showExport} onClose={() => setShowExport(false)} tabKeys={TAB_KEYS} t={t} />
    </div>
  )
}
