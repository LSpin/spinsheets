import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getCharacter, updateCharacter } from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import CatalogSelect from './CatalogSelect'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import {
  BLADES_THREAT_LEVELS, BLADES_ANTAGONIST_TYPES, BLADES_PREMADE_ANTAGONISTS, BLADES_ANTAGONIST_CATALOG,
} from '../data/bladesAntagonists'

const TAB_KEYS = ['tabBladesAntIdentity', 'tabBladesAntTraits', 'tabBackstory']

const INITIAL = {
  splat: 'BLADES_ANTAGONIST', npc: true,
  name: '', concept: '',
  dndMonsterType: '',
  dndChallengeRating: '1',
  dndMonsterActions: '',
  dndMonsterTraits: '',
  notes: '', backstory: '',
}

export default function BladesAntagonistForm() {
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
  const [templateMsg, setTemplateMsg] = useState(null)

  useEffect(() => { if (characterId) loadCharacter() }, [characterId])

  async function loadCharacter() {
    try {
      const res = await getCharacter(characterId)
      const data = res.data
      setFields(prev => { const m = { ...prev }; for (const k in prev) { if (data[k] !== undefined && data[k] !== null) m[k] = data[k] }; return m })
    } catch { setSaveError(t('failedToLoad')) }
    finally { setLoading(false) }
  }

  function handleField(name, value) { setFields(prev => ({ ...prev, [name]: value })) }
  function handleText(e) { setFields(prev => ({ ...prev, [e.target.name]: e.target.value })) }

  async function handleSave() {
    setSaving(true); setSaveError(null)
    try { await updateCharacter(characterId, fields) }
    catch { setSaveError(t('failedToSave')) }
    finally { setSaving(false) }
  }

  async function handleDoneEditing() { await handleSave(); navigate('/blades') }

  function handleLoadTemplate(templateName) {
    const tpl = BLADES_PREMADE_ANTAGONISTS.find(m => m.name === templateName)
    if (!tpl) return
    setFields(prev => ({
      ...prev,
      name: tpl.name,
      concept: tpl.description,
      dndMonsterType: tpl.type,
      dndChallengeRating: tpl.threatLevel,
      dndMonsterActions: tpl.actions,
      dndMonsterTraits: tpl.traits,
      notes: tpl.notes,
    }))
    setTemplateMsg(t('dndTemplateLoaded'))
    setTimeout(() => setTemplateMsg(null), 3000)
  }

  const threatDesc = BLADES_THREAT_LEVELS.find(tl => tl.value === fields.dndChallengeRating)
  const typeDesc = BLADES_ANTAGONIST_TYPES.find(at => at.value === fields.dndMonsterType)

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/blades')}>{t('back')}</button>
        <h2>{fields.name || 'New Antagonist'}</h2>
        <span className="splat-badge splat-badge--blades">Blades</span>
        <span className="splat-badge splat-badge--blades">Antagonist</span>
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}
      {templateMsg && <p className="status-success" role="status">{templateMsg}</p>}

      <div className="tab-list" role="tablist">
        {TAB_KEYS.map((tk, i) => (
          <button key={tk} role="tab" id={`tab-${i}`} className={`btn btn-secondary${tab === i ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(i)} aria-selected={tab === i} aria-controls={`tabpanel-${i}`}>{t(tk)}</button>
        ))}
      </div>

      {/* ── Identity ── */}
      <div role="tabpanel" id="tabpanel-0" aria-labelledby="tab-0" hidden={tab !== 0}>
        <div className="form-section">
          <fieldset>
            <legend>Identity</legend>
            <div className="field-row">
              <div className="field" style={{ flex: 2 }}>
                <label>Name *</label>
                <input name="name" value={fields.name} onChange={handleText} placeholder="Inspector Raith, The Reconciled..." />
              </div>
            </div>
            <div className="field" style={{ marginBottom: 'var(--space-md)' }}>
              <label>{t('dndLoadTemplate')}</label>
              <CatalogSelect
                id="blades-ant-template"
                name="template"
                label={t('dndLoadTemplate')}
                value=""
                onChange={(_, v) => handleLoadTemplate(v)}
                catalog={BLADES_ANTAGONIST_CATALOG}
                placeholder="Search premade antagonists..."
                showDescOnSelect={false}
              />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Type</label>
                <select name="dndMonsterType" value={fields.dndMonsterType} onChange={handleText}>
                  <option value="">Select type...</option>
                  {BLADES_ANTAGONIST_TYPES.map(at => (
                    <option key={at.value} value={at.value}>{at.value}</option>
                  ))}
                </select>
                {typeDesc && <p className="muted-hint muted-hint--xs">{typeDesc.description}</p>}
              </div>
              <div className="field">
                <label>Threat Level</label>
                <select name="dndChallengeRating" value={fields.dndChallengeRating} onChange={handleText}>
                  {BLADES_THREAT_LEVELS.map(tl => (
                    <option key={tl.value} value={tl.value}>Threat {tl.value}</option>
                  ))}
                </select>
                {threatDesc && <p className="muted-hint muted-hint--xs">{threatDesc.description}</p>}
              </div>
            </div>
            <div className="field">
              <label>Description / Concept</label>
              <textarea name="concept" value={fields.concept} onChange={handleText} rows={3} style={{ width: '100%' }}
                placeholder="A brief description of who or what this antagonist is..." />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Traits & Actions ── */}
      <div role="tabpanel" id="tabpanel-1" aria-labelledby="tab-1" hidden={tab !== 1}>
        <div className="form-section">
          <fieldset>
            <legend>Special Traits</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Notable qualities, abilities, and distinguishing features of this antagonist.
            </p>
            <textarea name="dndMonsterTraits" value={fields.dndMonsterTraits} onChange={handleText} rows={6} style={{ width: '100%' }}
              placeholder="Ruthless, commands a squad of thugs, has a clockwork eye that sees in the dark..." />
          </fieldset>
          <fieldset>
            <legend>Actions & Moves</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              What can this antagonist do in a scene? What are their typical moves and responses?
            </p>
            <textarea name="dndMonsterActions" value={fields.dndMonsterActions} onChange={handleText} rows={6} style={{ width: '100%' }}
              placeholder="Order thugs to attack. Flee through secret passages. Call for Bluecoat backup..." />
          </fieldset>
          <details>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>Threat Level Reference</summary>
            <table className="inv-table" style={{ marginTop: 'var(--space-sm)' }}>
              <thead><tr><th>Threat</th><th>Description</th></tr></thead>
              <tbody>
                {BLADES_THREAT_LEVELS.map(tl => (
                  <tr key={tl.value} style={{ background: fields.dndChallengeRating === tl.value ? 'rgba(52,152,219,0.08)' : 'transparent' }}>
                    <td style={{ fontWeight: 600 }}>{tl.value}</td>
                    <td className="inv-notes">{tl.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </div>
      </div>

      {/* ── Notes & Backstory ── */}
      <div role="tabpanel" id="tabpanel-2" aria-labelledby="tab-2" hidden={tab !== 2}>
        <div className="form-section">
          <fieldset>
            <legend>Backstory</legend>
            <textarea name="backstory" value={fields.backstory} onChange={handleText} rows={6} style={{ width: '100%' }}
              placeholder="Where did this antagonist come from? What shaped them?" />
          </fieldset>
          <fieldset>
            <legend>GM Notes</legend>
            <textarea name="notes" value={fields.notes} onChange={handleText} rows={4} style={{ width: '100%' }}
              placeholder="Faction affiliations, clock tracks, weaknesses, session plans..." />
          </fieldset>
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
