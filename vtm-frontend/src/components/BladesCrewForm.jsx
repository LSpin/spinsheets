import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getCharacter, updateCharacter } from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import CatalogSelect from './CatalogSelect'
import { BLADES_CREW_TYPES, BLADES_CREW_TYPE_CATALOG } from '../data/bladesPlaybooks'

const TAB_KEYS = ['tabBladesCrewIdentity', 'tabBladesCrewAbilities', 'tabBladesCrewUpgrades', 'tabBladesCrewContacts', 'tabBladesClocks', 'tabBackstory']

const CLOCK_SIZES = [4, 6, 8, 12]
const CLOCK_TYPES = [
  { value: 'progress', label: 'Progress' },
  { value: 'danger', label: 'Danger' },
  { value: 'racing', label: 'Racing' },
  { value: 'faction', label: 'Faction' },
  { value: 'project', label: 'Long-term Project' },
  { value: 'custom', label: 'Custom' },
]

function parseClocks(str) {
  if (!str) return []
  try { return JSON.parse(str) } catch { return [] }
}

function ClockSVG({ segments, filled, size = 80, onClick }) {
  const r = size / 2 - 2
  const cx = size / 2
  const cy = size / 2
  const slices = []
  for (let i = 0; i < segments; i++) {
    const startAngle = (i / segments) * 2 * Math.PI - Math.PI / 2
    const endAngle = ((i + 1) / segments) * 2 * Math.PI - Math.PI / 2
    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    const largeArc = segments <= 2 ? 1 : 0
    const d = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`
    slices.push(
      <path key={i} d={d}
        fill={i < filled ? 'var(--accent)' : 'var(--surface-2, #2a2a2a)'}
        stroke="var(--text-muted, #888)" strokeWidth="1.5"
        style={{ cursor: 'pointer' }}
        onClick={() => onClick(i)}
        role="button" tabIndex={0}
        aria-label={`Segment ${i + 1} of ${segments}${i < filled ? ' (filled)' : ' (empty)'}`}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(i) } }}
      />
    )
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      {slices}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--text-muted, #888)" strokeWidth="2" />
    </svg>
  )
}

const INITIAL = {
  splat: 'BLADES_CREW', npc: true,
  name: '', concept: '',
  bladesCrewType: '',
  bladesReputation: 0, bladesTier: 0, bladesHold: 'strong',
  bladesHeat: 0, bladesWanted: 0,
  bladesCoin: 0, bladesVault: 0,
  bladesCrewAbilities: '', bladesCrewUpgrades: '',
  bladesHuntingGrounds: '', bladesCrewContacts: '',
  bladesCohorts: '', bladesCrewXp: 0,
  notes: '', backstory: '',
  havens: '',
}

function ClickTrack({ label, value, max, onChange }) {
  return (
    <div className="field">
      <label>{label} ({value}/{max})</label>
      <div className="blades-dots" role="group" aria-label={label}>
        {Array.from({ length: max }, (_, i) => (
          <span key={i}
            className={`blades-pip${i < value ? ' blades-pip--filled' : ''}`}
            onClick={() => onChange(i < value ? i : i + 1)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(i < value ? i : i + 1) } }}
            role="button"
            tabIndex={0}
            aria-label={`${label} ${i + 1}`}
            aria-pressed={i < value}
          />
        ))}
      </div>
    </div>
  )
}

function CheckboxList({ items, selected, onChange }) {
  const sel = selected ? selected.split(',').map(s => s.trim()).filter(Boolean) : []
  function toggle(name) {
    const next = sel.includes(name) ? sel.filter(s => s !== name) : [...sel, name]
    onChange(next.join(', '))
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
      {items.map(item => {
        const isObj = typeof item === 'object'
        const name = isObj ? item.name : item
        const desc = isObj ? item.description : null
        return (
          <label key={name} style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start', cursor: 'pointer', padding: 'var(--space-xs) 0' }}>
            <input type="checkbox" checked={sel.includes(name)} onChange={() => toggle(name)} style={{ marginTop: '3px' }} />
            <div>
              <strong style={{ fontSize: '0.88rem' }}>{name}</strong>
              {desc && <span className="muted-hint muted-hint--xs" style={{ display: 'block' }}>{desc}</span>}
            </div>
          </label>
        )
      })}
    </div>
  )
}

export default function BladesCrewForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const [searchParams] = useSearchParams()
  const viewMode = searchParams.get('mode') === 'view'
  const characterId = paramId || null

  useEffect(() => { switchTheme('blades') }, [])
  const { isAutoCreating } = useAutoCreate(characterId, INITIAL)

  const [tab, setTab] = useState(0)
  const [fields, setFields] = useState(INITIAL)
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [newClockName, setNewClockName] = useState('')
  const [newClockSize, setNewClockSize] = useState(4)
  const [newClockType, setNewClockType] = useState('progress')

  useEffect(() => { if (characterId) loadCharacter() }, [characterId])

  async function loadCharacter() {
    try {
      const res = await getCharacter(characterId)
      const data = res.data
      setFields(prev => { const m = { ...prev }; for (const k in prev) { if (data[k] !== undefined && data[k] !== null) m[k] = data[k] }; return m })
    } catch { setSaveError(t('failedToLoad')) }
    finally { setLoading(false) }
  }

  function handleField(name, value) { setFields(prev => ({ ...prev, [name]: typeof value === 'string' ? value : Number(value) })) }
  function handleText(e) { setFields(prev => ({ ...prev, [e.target.name]: e.target.value })) }
  async function handleSave() { setSaving(true); setSaveError(null); try { await updateCharacter(characterId, fields) } catch { setSaveError(t('failedToSave')) } finally { setSaving(false) } }
  async function handleDoneEditing() { await handleSave(); navigate('/blades') }

  const crewType = BLADES_CREW_TYPES[fields.bladesCrewType] || null
  const contactsList = fields.bladesCrewContacts ? fields.bladesCrewContacts.split(',').map(s => s.trim()).filter(Boolean) : []

  function toggleContact(contact) {
    const next = contactsList.includes(contact) ? contactsList.filter(c => c !== contact) : [...contactsList, contact]
    handleField('bladesCrewContacts', next.join(', '))
  }

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/blades')}>{t('back')}</button>
        <h2>{fields.name || 'New Crew'}</h2>
        <span className="splat-badge splat-badge--blades">Blades</span>
        <span className="splat-badge" style={{ background: 'rgba(100,149,237,0.15)', color: '#6495ed' }}>Crew</span>
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}

      <div className="tab-list" role="tablist">
        {TAB_KEYS.map((tk, i) => (
          <button key={tk} role="tab" className={`btn btn-secondary${tab === i ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(i)} aria-selected={tab === i}>{t(tk)}</button>
        ))}
      </div>

      {/* Tab 0 - Crew Identity */}
      <div hidden={tab !== 0}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tabBladesCrewIdentity')}</legend>
            <div className="field-row">
              <div className="field" style={{ flex: 2 }}><label>Crew Name *</label><input name="name" value={fields.name} onChange={handleText} placeholder="The Red Sashes, The Lampblacks..." /></div>
            </div>
            <CatalogSelect id="bladesCrewType" name="bladesCrewType" label="Crew Type" value={fields.bladesCrewType} onChange={handleField} catalog={BLADES_CREW_TYPE_CATALOG} placeholder="Select crew type..." />
            <div className="field-row" style={{ marginTop: 'var(--space-md)' }}>
              <div className="field"><label>Concept</label><input name="concept" value={fields.concept} onChange={handleText} placeholder="What drives this crew?" /></div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Crew Status</legend>
            <ClickTrack label="Reputation" value={fields.bladesReputation} max={12} onChange={v => handleField('bladesReputation', v)} />
            <div className="field-row" style={{ marginTop: 'var(--space-sm)' }}>
              <div className="field">
                <label>Tier (0-4)</label>
                <input type="number" name="bladesTier" value={fields.bladesTier} min={0} max={4} onChange={e => handleField('bladesTier', parseInt(e.target.value) || 0)} style={{ width: 80 }} />
              </div>
              <div className="field">
                <label>Hold</label>
                <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-xs)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                    <input type="radio" name="bladesHold" value="strong" checked={fields.bladesHold === 'strong'} onChange={handleText} /> Strong
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                    <input type="radio" name="bladesHold" value="weak" checked={fields.bladesHold === 'weak'} onChange={handleText} /> Weak
                  </label>
                </div>
              </div>
            </div>
            <div className="field-row" style={{ marginTop: 'var(--space-sm)' }}>
              <ClickTrack label="Heat" value={fields.bladesHeat} max={9} onChange={v => handleField('bladesHeat', v)} />
              <ClickTrack label="Wanted Level" value={fields.bladesWanted} max={4} onChange={v => handleField('bladesWanted', v)} />
            </div>
            <div className="field-row" style={{ marginTop: 'var(--space-sm)' }}>
              <div className="field">
                <label>Coin</label>
                <input type="number" name="bladesCoin" value={fields.bladesCoin} min={0} onChange={e => handleField('bladesCoin', parseInt(e.target.value) || 0)} style={{ width: 80 }} />
              </div>
              <ClickTrack label="Vault" value={fields.bladesVault} max={8} onChange={v => handleField('bladesVault', v)} />
            </div>
            <div style={{ marginTop: 'var(--space-sm)' }}>
              <ClickTrack label="Crew XP" value={fields.bladesCrewXp} max={8} onChange={v => handleField('bladesCrewXp', v)} />
            </div>
          </fieldset>
        </div>
      </div>

      {/* Tab 1 - Crew Abilities */}
      <div hidden={tab !== 1}>
        <div className="form-section">
          <fieldset>
            <legend>Crew Abilities</legend>
            {crewType ? (
              <CheckboxList items={crewType.abilities} selected={fields.bladesCrewAbilities} onChange={v => handleField('bladesCrewAbilities', v)} />
            ) : (
              <p className="muted-hint">Select a crew type on the Identity tab to see available abilities.</p>
            )}
          </fieldset>
        </div>
      </div>

      {/* Tab 2 - Upgrades */}
      <div hidden={tab !== 2}>
        <div className="form-section">
          <fieldset>
            <legend>Crew Upgrades</legend>
            {crewType ? (
              <CheckboxList items={crewType.upgrades} selected={fields.bladesCrewUpgrades} onChange={v => handleField('bladesCrewUpgrades', v)} />
            ) : (
              <p className="muted-hint">Select a crew type on the Identity tab to see available upgrades.</p>
            )}
          </fieldset>
          <fieldset>
            <legend>Hunting Grounds</legend>
            {crewType && (
              <div style={{ marginBottom: 'var(--space-sm)' }}>
                <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}>Preferred type: {crewType.huntingGrounds.join(', ')}</p>
              </div>
            )}
            <div className="field">
              <label>Hunting Grounds Description</label>
              <input name="bladesHuntingGrounds" value={fields.bladesHuntingGrounds} onChange={handleText} placeholder="Describe your crew's hunting grounds..." />
            </div>
          </fieldset>
          <fieldset>
            <legend>Cohorts</legend>
            <textarea name="bladesCohorts" value={fields.bladesCohorts} onChange={handleText} rows={4} style={{ width: '100%' }} placeholder="Describe your crew's cohorts (gangs, experts)..." />
          </fieldset>
        </div>
      </div>

      {/* Tab 3 - Contacts */}
      <div hidden={tab !== 3}>
        <div className="form-section">
          <fieldset>
            <legend>Crew Contacts</legend>
            {crewType ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                {crewType.contacts.map(contact => {
                  const active = contactsList.includes(contact)
                  return (
                    <div key={contact} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                      <button type="button" className={`btn btn-secondary`} style={{ minWidth: 36, padding: '2px 8px', background: active ? 'var(--color-accent-fg)' : undefined, color: active ? '#fff' : undefined }}
                        onClick={() => toggleContact(contact)}>
                        {active ? '+' : '-'}
                      </button>
                      <span style={{ fontSize: '0.88rem' }}>{contact}</span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="muted-hint">Select a crew type on the Identity tab to see contacts.</p>
            )}
          </fieldset>
        </div>
      </div>

      {/* Tab 4 - Clocks */}
      <div hidden={tab !== 4}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tabBladesClocks')}</legend>
            <p className="muted-hint" style={{ marginBottom: 'var(--space-sm)' }}>{t('bladesClockDesc')}</p>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 'var(--space-md)' }}>
              <div className="field" style={{ flex: '1 1 180px' }}>
                <label htmlFor="new-clock-name">{t('bladesClockName')}</label>
                <input id="new-clock-name" value={newClockName} onChange={e => setNewClockName(e.target.value)} placeholder={t('bladesClockNamePh')} />
              </div>
              <div className="field" style={{ flex: '0 0 100px' }}>
                <label htmlFor="new-clock-size">{t('bladesClockSize')}</label>
                <select id="new-clock-size" value={newClockSize} onChange={e => setNewClockSize(Number(e.target.value))}>
                  {CLOCK_SIZES.map(s => <option key={s} value={s}>{s} {t('bladesSegments')}</option>)}
                </select>
              </div>
              <div className="field" style={{ flex: '0 0 140px' }}>
                <label htmlFor="new-clock-type">{t('bladesClockType')}</label>
                <select id="new-clock-type" value={newClockType} onChange={e => setNewClockType(e.target.value)}>
                  {CLOCK_TYPES.map(ct => <option key={ct.value} value={ct.value}>{ct.label}</option>)}
                </select>
              </div>
              <button type="button" className="btn btn-primary" style={{ height: 'fit-content' }}
                onClick={() => {
                  if (!newClockName.trim()) return
                  const clocks = parseClocks(fields.havens)
                  clocks.push({ id: Date.now(), name: newClockName.trim(), segments: newClockSize, filled: 0, type: newClockType })
                  handleField('havens', JSON.stringify(clocks))
                  setNewClockName('')
                }}>{t('bladesAddClock')}</button>
            </div>
          </fieldset>

          {parseClocks(fields.havens).length === 0 && (
            <div className="empty-state"><p>{t('bladesNoClocksYet')}</p></div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
            {parseClocks(fields.havens).map(clock => (
              <fieldset key={clock.id} style={{ textAlign: 'center', padding: 'var(--space-sm)' }}>
                <legend style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  {clock.name}
                  <span className="muted-hint muted-hint--xs" style={{ marginLeft: '0.4rem' }}>({clock.type})</span>
                </legend>
                <ClockSVG segments={clock.segments} filled={clock.filled} size={100}
                  onClick={(i) => {
                    const clocks = parseClocks(fields.havens)
                    const c = clocks.find(x => x.id === clock.id)
                    if (c) {
                      c.filled = i < c.filled ? i : i + 1
                      handleField('havens', JSON.stringify(clocks))
                    }
                  }}
                />
                <div style={{ fontSize: '0.8rem', marginTop: '0.3rem' }}>{clock.filled} / {clock.segments}</div>
                <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'center', marginTop: '0.4rem' }}>
                  <button type="button" className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                    onClick={() => {
                      const clocks = parseClocks(fields.havens)
                      const c = clocks.find(x => x.id === clock.id)
                      if (c) { c.filled = 0; handleField('havens', JSON.stringify(clocks)) }
                    }}>{t('bladesClockReset')}</button>
                  <button type="button" className="btn btn-danger" style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                    onClick={() => {
                      const clocks = parseClocks(fields.havens).filter(x => x.id !== clock.id)
                      handleField('havens', JSON.stringify(clocks))
                    }}>{t('deleteBtn')}</button>
                </div>
              </fieldset>
            ))}
          </div>
        </div>
      </div>

      {/* Tab 5 - Notes */}
      <div hidden={tab !== 5}>
        <div className="form-section">
          <fieldset><legend>Notes</legend><textarea name="notes" value={fields.notes} onChange={handleText} rows={6} style={{ width: '100%' }} placeholder="Session notes, plans, etc." /></fieldset>
          <fieldset><legend>Backstory</legend><textarea name="backstory" value={fields.backstory} onChange={handleText} rows={6} style={{ width: '100%' }} placeholder="The crew's origin story..." /></fieldset>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => navigate('/blades')}>{t('cancel')}</button>
        <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>{saving ? t('saving') : t('quickSave')}</button>
        <button className="btn btn-primary" onClick={handleDoneEditing} disabled={saving}>{t('doneEditing')}</button>
      </div>
    </div>
  )
}
