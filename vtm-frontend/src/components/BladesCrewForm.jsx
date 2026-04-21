import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getCharacter, updateCharacter } from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import { useLanguage } from '../i18n/LanguageContext'
import ExportModal from './ExportModal'
import { useTheme } from '../context/ThemeContext'
import CatalogSelect from './CatalogSelect'
import { BLADES_CREW_TYPES, BLADES_CREW_TYPE_CATALOG } from '../data/bladesPlaybooks'

const TAB_KEYS = ['tabBladesCrewIdentity', 'tabBladesCrewAbilities', 'tabBladesCrewUpgrades', 'tabBladesCrewCoinVault', 'tabBladesCrewContacts', 'tabBackstory']


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
  const [showExport, setShowExport] = useState(false)
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
        <h2>{fields.name || t('bladesNewCrew')}</h2>
        <span className="splat-badge splat-badge--blades">{t('splatBlades')}</span>
        <span className="splat-badge" style={{ background: 'rgba(100,149,237,0.15)', color: '#6495ed' }}>{t('bladesCrewBadge')}</span>
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}

      <div className="tab-list" role="tablist">
        {TAB_KEYS.map((tk, i) => (
          <button key={tk} role="tab" id={`tab-${i}`} className={`btn btn-secondary${tab === i ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(i)} aria-selected={tab === i} aria-controls={`tabpanel-${i}`}>{t(tk)}</button>
        ))}
      </div>

      {/* Tab 0 - Crew Identity */}
      <div role="tabpanel" id="tabpanel-0" aria-labelledby="tab-0" hidden={tab !== 0}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tabBladesCrewIdentity')}</legend>
            <div className="field-row">
              <div className="field" style={{ flex: 2 }}><label>{t('bladesCrewName')} *</label><input name="name" value={fields.name} onChange={handleText} placeholder={t('bladesCrewNamePh')} /></div>
            </div>
            <CatalogSelect id="bladesCrewType" name="bladesCrewType" label={t('bladesCrewType')} value={fields.bladesCrewType} onChange={handleField} catalog={BLADES_CREW_TYPE_CATALOG} placeholder={t('bladesCrewTypePh')} />
            <div className="field-row" style={{ marginTop: 'var(--space-md)' }}>
              <div className="field"><label>{t('concept')}</label><input name="concept" value={fields.concept} onChange={handleText} placeholder={t('bladesCrewConceptPh')} /></div>
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('bladesCrewStatus')}</legend>
            <ClickTrack label={t('bladesReputation')} value={fields.bladesReputation} max={12} onChange={v => handleField('bladesReputation', v)} />
            <div className="field-row" style={{ marginTop: 'var(--space-sm)' }}>
              <div className="field">
                <label>{t('bladesTier')} (0-4)</label>
                <input type="number" name="bladesTier" value={fields.bladesTier} min={0} max={4} onChange={e => handleField('bladesTier', parseInt(e.target.value) || 0)} style={{ width: 80 }} />
              </div>
              <div className="field">
                <label>{t('bladesHold')}</label>
                <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-xs)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                    <input type="radio" name="bladesHold" value="strong" checked={fields.bladesHold === 'strong'} onChange={handleText} /> {t('bladesHoldStrong')}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                    <input type="radio" name="bladesHold" value="weak" checked={fields.bladesHold === 'weak'} onChange={handleText} /> {t('bladesHoldWeak')}
                  </label>
                </div>
              </div>
            </div>
            <div className="field-row" style={{ marginTop: 'var(--space-sm)' }}>
              <ClickTrack label={t('bladesHeat')} value={fields.bladesHeat} max={9} onChange={v => handleField('bladesHeat', v)} />
              <ClickTrack label={t('bladesWanted')} value={fields.bladesWanted} max={4} onChange={v => handleField('bladesWanted', v)} />
            </div>
            <div style={{ marginTop: 'var(--space-sm)' }}>
              <ClickTrack label={t('bladesCrewXp')} value={fields.bladesCrewXp} max={8} onChange={v => handleField('bladesCrewXp', v)} />
            </div>
          </fieldset>
        </div>
      </div>

      {/* Tab 1 - Crew Abilities */}
      <div role="tabpanel" id="tabpanel-1" aria-labelledby="tab-1" hidden={tab !== 1}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tabBladesCrewAbilities')}</legend>
            {crewType ? (
              <CheckboxList items={crewType.abilities} selected={fields.bladesCrewAbilities} onChange={v => handleField('bladesCrewAbilities', v)} />
            ) : (
              <p className="muted-hint">{t('bladesSelectCrewForAbilities')}</p>
            )}
          </fieldset>
        </div>
      </div>

      {/* Tab 2 - Upgrades */}
      <div role="tabpanel" id="tabpanel-2" aria-labelledby="tab-2" hidden={tab !== 2}>
        <div className="form-section">
          <fieldset>
            <legend>{t('bladesCrewUpgradesLegend')}</legend>
            {crewType ? (
              <CheckboxList items={crewType.upgrades} selected={fields.bladesCrewUpgrades} onChange={v => handleField('bladesCrewUpgrades', v)} />
            ) : (
              <p className="muted-hint">{t('bladesSelectCrewForUpgrades')}</p>
            )}
          </fieldset>
          <fieldset>
            <legend>{t('bladesHuntingGrounds')}</legend>
            {crewType && (
              <div style={{ marginBottom: 'var(--space-sm)' }}>
                <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}>{t('bladesPreferredType')}: {crewType.huntingGrounds.join(', ')}</p>
              </div>
            )}
            <div className="field">
              <label>{t('bladesHuntingGroundsDesc')}</label>
              <input name="bladesHuntingGrounds" value={fields.bladesHuntingGrounds} onChange={handleText} placeholder={t('bladesHuntingGroundsPh')} />
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('bladesCohorts')}</legend>
            <textarea name="bladesCohorts" value={fields.bladesCohorts} onChange={handleText} rows={4} style={{ width: '100%' }} placeholder={t('bladesCohortsPh')} />
          </fieldset>
        </div>
      </div>

      {/* Tab 3 - Coin & Vault */}
      <div role="tabpanel" id="tabpanel-3" aria-labelledby="tab-3" hidden={tab !== 3}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tabBladesCrewCoinVault')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              {t('bladesCrewCoinVaultHint')}
            </p>
            <div className="field-row" style={{ alignItems: 'flex-end' }}>
              <div className="field" style={{ width: 100 }}>
                <label>{t('bladesCoin')}</label>
                <input type="number" name="bladesCoin" value={fields.bladesCoin} min={0} onChange={e => handleField('bladesCoin', parseInt(e.target.value) || 0)} style={{ width: 80 }} />
              </div>
              <div className="field" style={{ flex: 1 }}>
                <ClickTrack label={t('bladesVault')} value={fields.bladesVault} max={8} onChange={v => handleField('bladesVault', v)} />
              </div>
            </div>
          </fieldset>
        </div>
      </div>

      {/* Tab 4 - Contacts */}
      <div role="tabpanel" id="tabpanel-4" aria-labelledby="tab-4" hidden={tab !== 4}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tabBladesCrewContacts')}</legend>
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
              <p className="muted-hint">{t('bladesSelectCrewForContacts')}</p>
            )}
          </fieldset>
        </div>
      </div>

      {/* Tab 5 - Notes */}
      <div role="tabpanel" id="tabpanel-5" aria-labelledby="tab-5" hidden={tab !== 5}>
        <div className="form-section">
          <fieldset><legend>{t('notes')}</legend><textarea name="notes" value={fields.notes} onChange={handleText} rows={6} style={{ width: '100%' }} placeholder={t('bladesCrewNotesPh')} /></fieldset>
          <fieldset><legend>{t('tabBackstory')}</legend><textarea name="backstory" value={fields.backstory} onChange={handleText} rows={6} style={{ width: '100%' }} placeholder={t('bladesCrewBackstoryPh')} /></fieldset>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => setShowExport(true)}>{t('exportPdf')}</button>
        <button className="btn btn-secondary" onClick={() => navigate('/blades')}>{t('cancel')}</button>
        <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>{saving ? t('saving') : t('quickSave')}</button>
        <button className="btn btn-primary" onClick={handleDoneEditing} disabled={saving}>{t('doneEditing')}</button>
      </div>
      <ExportModal open={showExport} onClose={() => setShowExport(false)} tabKeys={TAB_KEYS} t={t} />
    </div>
  )
}
