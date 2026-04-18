import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getCharacter, updateCharacter } from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import CatalogSelect from './CatalogSelect'
import { BLADES_CREW_TYPES, BLADES_CREW_TYPE_CATALOG } from '../data/bladesPlaybooks'

const TAB_KEYS = ['tabBladesCrewIdentity', 'tabBladesCrewAbilities', 'tabBladesCrewUpgrades', 'tabBladesCrewContacts', 'tabBackstory']

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
}

function ClickTrack({ label, value, max, onChange }) {
  return (
    <div className="field">
      <label>{label} ({value}/{max})</label>
      <div style={{ display: 'flex', gap: 2 }}>
        {Array.from({ length: max }, (_, i) => (
          <button key={i} type="button"
            style={{
              width: 22, height: 22, borderRadius: 3, border: '1px solid var(--color-border)',
              background: i < value ? 'var(--color-accent-fg)' : 'transparent',
              cursor: 'pointer', padding: 0,
            }}
            onClick={() => onChange(i < value ? i : i + 1)}
          />
        ))}
      </div>
    </div>
  )
}

function CheckboxList({ items, selected, onChange }) {
  const sel = selected ? selected.split(',').map(s => s.trim()).filter(Boolean) : []
  function toggle(item) {
    const next = sel.includes(item) ? sel.filter(s => s !== item) : [...sel, item]
    onChange(next.join(', '))
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
      {items.map(item => (
        <label key={item} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', cursor: 'pointer', fontSize: '0.88rem' }}>
          <input type="checkbox" checked={sel.includes(item)} onChange={() => toggle(item)} />
          {item}
        </label>
      ))}
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

      {/* Tab 4 - Notes */}
      <div hidden={tab !== 4}>
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
