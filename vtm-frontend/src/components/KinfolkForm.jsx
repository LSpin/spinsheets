import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  getCharacter, updateCharacter,
  getBackgrounds, addBackground, removeBackground,
  getMeritCatalog, getFlawCatalog,
  getMerits, getFlaws,
  getInventory,
  getXpLog, addXpLogEntry, removeXpLogEntry,
  getDisciplines, addDiscipline, removeDiscipline,
} from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import MeritsFlawsSection from './MeritsFlawsSection'
import InventorySection from './InventorySection'
import DotRating from './DotRating'
import XpLogSection from './XpLogSection'
import { useLanguage } from '../i18n/LanguageContext'
import { WEREWOLF_BACKGROUNDS as BACKGROUNDS } from '../data/backgrounds'
import { ALL_NUMINA, PSYCHIC_NUMINA, HEDGE_MAGIC_NUMINA } from '../data/kinfolkNumina'
import TagInfoPanel from './TagInfoPanel'

const TRIBES = [
  'Black Furies', 'Bone Gnawers', 'Children of Gaia', 'Fianna', 'Get of Fenris',
  'Glass Walkers', 'Red Talons', 'Shadow Lords', 'Silent Striders', 'Silver Fangs',
  'Stargazers', 'Uktena', 'Wendigo',
]

const BREEDS = ['Homid', 'Metis']

const ARCHETYPES = [
  'Architect', 'Autocrat', 'Bon Vivant', 'Bravo', 'Caregiver', 'Celebrant', 'Child',
  'Competitor', 'Conformist', 'Conniver', 'Curmudgeon', 'Deviant', 'Director', 'Enigma',
  'Eye of the Storm', 'Fanatic', 'Gallant', 'Guru', 'Idealist', 'Judge', 'Loner',
  'Martyr', 'Masochist', 'Monster', 'Pedagogue', 'Penitent', 'Perfectionist', 'Rebel',
  'Rogue', 'Sadist', 'Scientist', 'Soldier', 'Survivor', 'Thrill-Seeker',
  'Traditionalist', 'Trickster', 'Visionary',
]

const INITIAL = {
  npc: false, splat: 'KINFOLK',
  name: '', altName: '', concept: '', nature: '', demeanor: '',
  clan: '', sire: '',
  strength: 1, dexterity: 1, stamina: 1,
  charisma: 1, manipulation: 1, appearance: 1,
  perception: 1, intelligence: 1, wits: 1,
  strengthSpec: '', dexteritySpec: '', staminaSpec: '',
  charismaSpec: '', manipulationSpec: '', appearanceSpec: '',
  perceptionSpec: '', intelligenceSpec: '', witsSpec: '',
  alertness: 0, athletics: 0, awareness: 0, brawl: 0, empathy: 0,
  expression: 0, intimidation: 0, leadership: 0, primalUrge: 0, streetwise: 0, subterfuge: 0,
  animalKen: 0, crafts: 0, drive: 0, etiquette: 0, firearms: 0,
  larceny: 0, melee: 0, performance: 0, stealth: 0, survival: 0,
  academics: 0, computer: 0, enigmas: 0, investigation: 0, law: 0,
  medicine: 0, occult: 0, politics: 0, ritualAbility: 0, science: 0, technology: 0,
  willpower: 3, currentWillpower: 3,
  pathRating: 7, pathName: 'Humanity',
  conscience: 1, selfControl: 1, courage: 1,
  woundBashing: 0, woundLethal: 0, woundAgg: 0,
  notes: '', backstory: '', appearanceDesc: '',
}

const TAB_KEYS = ['tabIdentity', 'tabAttributes', 'tabAbilities', 'tabNumina', 'tabAdvantages', 'tabHealth', 'tabBackgrounds', 'tabMeritsFlaws', 'tabInventory', 'tabBackstory', 'tabXpLog']

export default function KinfolkForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const viewMode = searchParams.get('mode') === 'view'
  const characterId = paramId || null

  const { isAutoCreating } = useAutoCreate(characterId, INITIAL)

  const [tab, setTab] = useState(0)
  const [fields, setFields] = useState(INITIAL)
  const [backgrounds, setBackgrounds] = useState([])
  const [merits, setMerits] = useState([])
  const [flaws, setFlaws] = useState([])
  const [meritCatalog, setMeritCatalog] = useState([])
  const [flawCatalog, setFlawCatalog] = useState([])
  const [inventory, setInventory] = useState([])
  const [xpLog, setXpLog] = useState([])
  const [newBackground, setNewBackground] = useState({ name: '', level: 1, description: '' })
  const [disciplines, setDisciplines] = useState([])
  const [numinaSearch, setNuminaSearch] = useState('')
  const [tagInfo, setTagInfo] = useState(null)
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [actionError, setActionError] = useState(null)

  useEffect(() => { if (characterId) loadCharacter() }, [characterId])

  async function loadCharacter() {
    try {
      const [charRes, bgRes, discRes, meritRes, flawRes, mcRes, fcRes, invRes, xpRes] = await Promise.all([
        getCharacter(characterId), getBackgrounds(characterId), getDisciplines(characterId),
        getMerits(characterId), getFlaws(characterId), getMeritCatalog(), getFlawCatalog(),
        getInventory(characterId), getXpLog(characterId),
      ])
      const data = charRes.data
      setFields(prev => { const m = { ...prev }; for (const k in prev) { if (data[k] !== undefined && data[k] !== null) m[k] = data[k] }; return m })
      setBackgrounds(bgRes.data); setDisciplines(discRes.data)
      setMerits(meritRes.data); setFlaws(flawRes.data)
      setMeritCatalog(mcRes.data); setFlawCatalog(fcRes.data)
      setInventory(invRes.data); setXpLog(xpRes.data)
    } catch { setSaveError(t('failedToLoad')) }
    finally { setLoading(false) }
  }

  function handleField(name, value) { setFields(prev => ({ ...prev, [name]: typeof value === 'string' ? value : Number(value) })) }
  function handleText(e) { setFields(prev => ({ ...prev, [e.target.name]: e.target.value })) }
  async function handleSave() { setSaving(true); setSaveError(null); try { await updateCharacter(characterId, fields) } catch { setSaveError(t('failedToSave')) } finally { setSaving(false) } }
  async function handleDoneEditing() { await handleSave(); navigate('/characters') }

  async function handleAddBackground() {
    if (!newBackground.name.trim()) return
    try {
      const res = await addBackground(characterId, newBackground)
      setBackgrounds(prev => [...prev, res.data])
      setNewBackground({ name: '', level: 1, description: '' })
    } catch { setActionError(t('failedToSave')) }
  }

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/characters')}>{t('back')}</button>
        <h2>{fields.name || t('editKinfolk')}</h2>
        <span className="splat-badge splat-badge--werewolf">{t('kinfolk')}</span>
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}
      {actionError && <p className="status-error" role="alert">{actionError}</p>}

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
              <div className="field"><label>{t('charName')} *</label><input name="name" value={fields.name} onChange={handleText} /></div>
              <div className="field"><label>{t('concept')}</label><input name="concept" value={fields.concept} onChange={handleText} /></div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>{t('nature')}</label>
                <select name="nature" value={fields.nature} onChange={handleText}>
                  <option value="">{t('select')}</option>
                  {ARCHETYPES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="field">
                <label>{t('demeanor')}</label>
                <select name="demeanor" value={fields.demeanor} onChange={handleText}>
                  <option value="">{t('select')}</option>
                  {ARCHETYPES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>{t('kinfolkTribe')}</label>
                <select name="clan" value={fields.clan} onChange={handleText}>
                  <option value="">{t('select')}</option>
                  {TRIBES.map(tr => <option key={tr} value={tr}>{tr}</option>)}
                </select>
              </div>
              <div className="field">
                <label>{t('kinfolkBreed')}</label>
                <select name="sire" value={fields.sire} onChange={handleText}>
                  <option value="">{t('select')}</option>
                  {BREEDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>{t('type')}</label>
                <div className="role-toggle" role="radiogroup">
                  <button type="button" className={`role-toggle-btn${!fields.npc ? ' role-toggle-btn--active' : ''}`} onClick={() => handleField('npc', false)}>{t('pc')}</button>
                  <button type="button" className={`role-toggle-btn${fields.npc ? ' role-toggle-btn--active' : ''}`} onClick={() => handleField('npc', true)}>{t('npc')}</button>
                </div>
              </div>
            </div>
            <p className="muted-hint muted-hint--xs" style={{ marginTop: 'var(--space-sm)' }}>
              Kinfolk are the mortal relatives of the Garou. They carry the wolf gene but cannot shift. Some develop Numina — psychic or minor magical abilities.
            </p>
          </fieldset>
        </div>
      </div>

      {/* ── Attributes ── */}
      <div hidden={tab !== 1}>
        <div className="form-section">
          {[
            { legend: 'physicalAttr', attrs: ['strength', 'dexterity', 'stamina'] },
            { legend: 'socialAttr', attrs: ['charisma', 'manipulation', 'appearance'] },
            { legend: 'mentalAttr', attrs: ['perception', 'intelligence', 'wits'] },
          ].map(({ legend, attrs }) => (
            <fieldset key={legend}>
              <legend>{t(legend)}</legend>
              <div className="rating-grid">
                {attrs.map(a => (
                  <div key={a} className="ability-row">
                    <DotRating label={t(a)} name={a} value={fields[a]} onChange={handleField} min={1} />
                    <input className="spec-input" type="text" name={a + 'Spec'} value={fields[a + 'Spec'] ?? ''} onChange={handleText} placeholder={t('specialty')} />
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
              {['alertness', 'athletics', 'awareness', 'brawl', 'empathy', 'expression', 'intimidation', 'leadership', 'primalUrge', 'streetwise', 'subterfuge'].map(a =>
                <div key={a} className="ability-row"><DotRating label={t(a)} name={a} value={fields[a]} onChange={handleField} /></div>
              )}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('skills')}</legend>
            <div className="rating-grid">
              {['animalKen', 'crafts', 'drive', 'etiquette', 'firearms', 'larceny', 'melee', 'performance', 'stealth', 'survival'].map(a =>
                <div key={a} className="ability-row"><DotRating label={t(a)} name={a} value={fields[a]} onChange={handleField} /></div>
              )}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('knowledges')}</legend>
            <div className="rating-grid">
              {['academics', 'computer', 'enigmas', 'investigation', 'law', 'medicine', 'occult', 'politics', 'ritualAbility', 'science', 'technology'].map(a =>
                <div key={a} className="ability-row"><DotRating label={t(a)} name={a} value={fields[a]} onChange={handleField} /></div>
              )}
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Numina (Expanded Catalogue with Levels) ── */}
      <div hidden={tab !== 3}>
        <div className="form-section">
          <fieldset>
            <legend>Active Numina ({disciplines.length})</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Kinfolk Numina have 5 levels each. Psychic Phenomena and Hedge Magic are separate categories — having both is extremely rare.
            </p>
            {disciplines.length > 0 && (
              <table className="inv-table" style={{ marginBottom: 'var(--space-md)' }}>
                <thead><tr><th>Numina</th><th>Level</th><th>Type</th><th>Current Ability</th><th></th></tr></thead>
                <tbody>
                  {disciplines.map(d => {
                    const entry = ALL_NUMINA.find(n => n.name.toLowerCase() === d.name.toLowerCase())
                    const levelDesc = entry?.levels?.[d.level - 1] || ''
                    return (
                      <tr key={d.id} style={{ cursor: 'pointer', background: d.id === tagInfo?.id ? 'rgba(224,85,85,0.08)' : 'transparent' }}
                        onClick={() => setTagInfo(ti => ti?.id === d.id ? null : { ...d, kind: 'numina' })}>
                        <td style={{ fontWeight: 600 }}>{d.name}</td>
                        <td style={{ textAlign: 'center' }}>
                          <select value={d.level} onClick={e => e.stopPropagation()} onChange={e => {
                            const newLevel = parseInt(e.target.value)
                            removeDiscipline(characterId, d.id).then(() =>
                              addDiscipline(characterId, { name: d.name, level: newLevel, notes: d.notes || '' }).then(res =>
                                setDisciplines(prev => [...prev.filter(x => x.id !== d.id), res.data])
                              )
                            ).catch(() => setActionError(t('failedToSave')))
                          }}>
                            {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{entry?.category || '—'}</td>
                        <td className="inv-notes" style={{ fontSize: '0.78rem' }}>{levelDesc}</td>
                        <td><button className="tag-remove" onClick={e => { e.stopPropagation(); removeDiscipline(characterId, d.id); setDisciplines(prev => prev.filter(x => x.id !== d.id)); if (tagInfo?.id === d.id) setTagInfo(null) }} aria-label={`Remove ${d.name}`}>×</button></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
            {tagInfo?.kind === 'numina' && (() => {
              const entry = ALL_NUMINA.find(n => n.name.toLowerCase() === tagInfo.name.toLowerCase())
              return (
                <aside className="tag-info-panel" style={{ marginBottom: 'var(--space-md)' }}>
                  <button className="tag-info-panel-close" onClick={() => setTagInfo(null)}>{t('close')}</button>
                  <p className="tag-info-panel-name">{tagInfo.name}</p>
                  <p className="tag-info-panel-desc">{entry?.category || 'Numina'} · Level {tagInfo.level}/5</p>
                  {entry && <p style={{ fontSize: '0.82rem', lineHeight: 1.55 }}>{entry.description}</p>}
                  {entry?.levels && (
                    <ul className="tag-info-levels">
                      {entry.levels.map((lvl, i) => (
                        <li key={i} className={`tag-info-level${i + 1 === tagInfo.level ? ' tag-info-level--active' : ''}`}>
                          {i + 1}. {lvl}
                        </li>
                      ))}
                    </ul>
                  )}
                </aside>
              )
            })()}
          </fieldset>

          {/* Psychic Phenomena Catalogue */}
          <fieldset>
            <legend>Psychic Phenomena ({PSYCHIC_NUMINA.length})</legend>
            <div className="catalog-search-wrap">
              <input type="search" value={numinaSearch} onChange={e => setNuminaSearch(e.target.value)}
                placeholder="Search all numina..." aria-label="Search numina" />
              <span className="catalog-search-count">
                {ALL_NUMINA.filter(n => !numinaSearch || n.name.toLowerCase().includes(numinaSearch.toLowerCase()) || n.description.toLowerCase().includes(numinaSearch.toLowerCase())).length}
              </span>
            </div>
            <ul className="catalog-list" aria-label="Psychic phenomena catalog">
              {PSYCHIC_NUMINA
                .filter(n => !numinaSearch || n.name.toLowerCase().includes(numinaSearch.toLowerCase()) || n.description.toLowerCase().includes(numinaSearch.toLowerCase()))
                .map(n => {
                  const already = disciplines.some(d => d.name.toLowerCase() === n.name.toLowerCase())
                  return (
                    <li key={n.name} className={`catalog-item${already ? ' catalog-item--added' : ''}`}>
                      <button className="catalog-item-btn" onClick={() => {
                        if (!already) {
                          addDiscipline(characterId, { name: n.name, level: 1, notes: n.category })
                            .then(res => setDisciplines(prev => [...prev, res.data]))
                            .catch(() => setActionError(t('failedToSave')))
                        } else {
                          const d = disciplines.find(d => d.name.toLowerCase() === n.name.toLowerCase())
                          if (d) setTagInfo(ti => ti?.id === d.id ? null : { ...d, kind: 'numina' })
                        }
                      }}>
                        <div className="catalog-item-main">
                          <span className="catalog-item-name">{n.name}</span>
                          <span className="catalog-item-desc">{n.description}</span>
                        </div>
                        <div className="catalog-item-meta">
                          <span className="catalog-item-cost">1-5</span>
                          {already ? <span className="catalog-item-check">{'\u2713'}</span> : <span className="catalog-item-add">+</span>}
                        </div>
                      </button>
                    </li>
                  )
                })}
            </ul>
          </fieldset>

          {/* Hedge Magic Catalogue */}
          <fieldset>
            <legend>Hedge Magic ({HEDGE_MAGIC_NUMINA.length})</legend>
            <ul className="catalog-list" aria-label="Hedge magic catalog">
              {HEDGE_MAGIC_NUMINA
                .filter(n => !numinaSearch || n.name.toLowerCase().includes(numinaSearch.toLowerCase()) || n.description.toLowerCase().includes(numinaSearch.toLowerCase()))
                .map(n => {
                  const already = disciplines.some(d => d.name.toLowerCase() === n.name.toLowerCase())
                  return (
                    <li key={n.name} className={`catalog-item${already ? ' catalog-item--added' : ''}`}>
                      <button className="catalog-item-btn" onClick={() => {
                        if (!already) {
                          addDiscipline(characterId, { name: n.name, level: 1, notes: n.category })
                            .then(res => setDisciplines(prev => [...prev, res.data]))
                            .catch(() => setActionError(t('failedToSave')))
                        } else {
                          const d = disciplines.find(d => d.name.toLowerCase() === n.name.toLowerCase())
                          if (d) setTagInfo(ti => ti?.id === d.id ? null : { ...d, kind: 'numina' })
                        }
                      }}>
                        <div className="catalog-item-main">
                          <span className="catalog-item-name">{n.name} <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>— Hedge Magic</span></span>
                          <span className="catalog-item-desc">{n.description}</span>
                        </div>
                        <div className="catalog-item-meta">
                          <span className="catalog-item-cost">1-5</span>
                          {already ? <span className="catalog-item-check">{'\u2713'}</span> : <span className="catalog-item-add">+</span>}
                        </div>
                      </button>
                    </li>
                  )
                })}
            </ul>
          </fieldset>

          <details>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>Numina Notes</summary>
            <textarea name="notes" value={fields.notes} onChange={handleText} rows={4} style={{ width: '100%', marginTop: 'var(--space-sm)' }} placeholder="Additional notes on your Numina abilities..." />
          </details>
        </div>
      </div>

      {/* ── Advantages (Virtues, Willpower, Humanity) ── */}
      <div hidden={tab !== 4}>
        <div className="form-section">
          <fieldset>
            <legend>{t('virtues')}</legend>
            <div className="rating-grid">
              <div className="ability-row"><DotRating label={t('conscience')} name="conscience" value={fields.conscience} onChange={handleField} min={1} /></div>
              <div className="ability-row"><DotRating label={t('selfControl')} name="selfControl" value={fields.selfControl} onChange={handleField} min={1} /></div>
              <div className="ability-row"><DotRating label={t('courage')} name="courage" value={fields.courage} onChange={handleField} min={1} /></div>
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('willpowerAndHumanity')}</legend>
            <div className="field-row">
              <DotRating label={t('willpower')} name="willpower" value={fields.willpower} onChange={handleField} min={1} max={10} />
              <DotRating label={t('currentWillpower')} name="currentWillpower" value={fields.currentWillpower} onChange={handleField} min={0} max={10} />
            </div>
            <div className="field-row">
              <div className="field">
                <label>{t('pathName')}</label>
                <input name="pathName" value={fields.pathName} onChange={handleText} />
              </div>
              <DotRating label={t('humanity')} name="pathRating" value={fields.pathRating} onChange={handleField} min={0} max={10} />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Health ── */}
      <div hidden={tab !== 5}>
        <div className="form-section">
          <fieldset>
            <legend>{t('health')}</legend>
            <div className="field-row">
              <DotRating label={t('bashing')} name="woundBashing" value={fields.woundBashing} onChange={handleField} min={0} max={7} />
              <DotRating label={t('lethal')} name="woundLethal" value={fields.woundLethal} onChange={handleField} min={0} max={7} />
              <DotRating label={t('aggravated')} name="woundAgg" value={fields.woundAgg} onChange={handleField} min={0} max={7} />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Backgrounds ── */}
      <div hidden={tab !== 6}>
        <div className="form-section">
          <fieldset>
            <legend>{t('backgrounds')}</legend>
            {backgrounds.length > 0 && (
              <ul className="tag-list">
                {backgrounds.map(b => (
                  <li key={b.id} className={`tag tag--clickable${b.id === tagInfo?.id ? ' tag--active' : ''}`}
                    onClick={() => setTagInfo(ti => ti?.id === b.id ? null : { ...b, kind: 'background' })}>
                    <span>{b.name} ({b.level}){b.description ? ` — ${b.description}` : ''}</span>
                    <button className="tag-remove" onClick={e => { e.stopPropagation(); removeBackground(characterId, b.id); setBackgrounds(prev => prev.filter(x => x.id !== b.id)) }}>x</button>
                  </li>
                ))}
              </ul>
            )}
            <div className="field-row" style={{ alignItems: 'flex-end' }}>
              <div className="field" style={{ flex: 2 }}>
                <label>{t('background')}</label>
                <input type="text" list="kinfolk-bg" value={newBackground.name} onChange={e => setNewBackground(p => ({ ...p, name: e.target.value }))} placeholder={t('phBackground')} />
                <datalist id="kinfolk-bg">{BACKGROUNDS.map(b => <option key={b.value} value={b.value} />)}</datalist>
              </div>
              <div className="field"><label>{t('level')}</label>
                <select value={newBackground.level} onChange={e => setNewBackground(p => ({ ...p, level: parseInt(e.target.value) }))}>{[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}</select>
              </div>
              <div className="field"><label>{t('description')}</label><input type="text" value={newBackground.description} onChange={e => setNewBackground(p => ({ ...p, description: e.target.value }))} /></div>
              <button className="btn btn-secondary" onClick={handleAddBackground}>{t('add')}</button>
            </div>
          </fieldset>
          {tagInfo?.kind === 'background' && (() => {
            const entry = BACKGROUNDS.find(bg => bg.value.toLowerCase() === tagInfo.name.toLowerCase())
            return <TagInfoPanel entry={entry ? { name: entry.value, description: entry.description } : { name: tagInfo.name }} level={tagInfo.level} levels={entry?.levels} onClose={() => setTagInfo(null)} />
          })()}
        </div>
      </div>

      {/* ── Merits & Flaws ── */}
      <div hidden={tab !== 7}>
        <MeritsFlawsSection characterId={characterId} merits={merits} setMerits={setMerits} flaws={flaws} setFlaws={setFlaws} meritCatalog={meritCatalog} flawCatalog={flawCatalog} />
      </div>

      {/* ── Inventory ── */}
      <div hidden={tab !== 8}>
        <InventorySection characterId={characterId} inventory={inventory} setInventory={setInventory} personalItems={fields.personalItems} onPersonalItemsChange={handleText} />
      </div>

      {/* ── Backstory ── */}
      <div hidden={tab !== 9}>
        <div className="form-section">
          <fieldset><legend>{t('backstoryLabel')}</legend><textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('appearanceLabel')}</legend><textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
        </div>
      </div>

      {/* ── XP Log ── */}
      <div hidden={tab !== 10}>
        <XpLogSection splat="werewolf" xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)} t={t} />
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => navigate('/characters')}>{t('cancel')}</button>
        <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>{saving ? t('saving') : t('quickSave')}</button>
        <button className="btn btn-primary" onClick={handleDoneEditing} disabled={saving}>{t('doneEditing')}</button>
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
