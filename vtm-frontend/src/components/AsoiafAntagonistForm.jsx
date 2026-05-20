import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getCharacter, updateCharacter } from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import CatalogSelect from './CatalogSelect'
import DotRating from './DotRating'
import { useLanguage } from '../i18n/LanguageContext'
import ExportModal from './ExportModal'
import { useTheme } from '../context/ThemeContext'
import { ASOIAF_PREMADE_NPCS, ASOIAF_NPC_CATALOG } from '../data/asoiafNpcs'
import { ASOIAF_ABILITIES } from '../data/asoiafData'

const TAB_KEYS = ['tabAsoiafAntIdentity', 'tabAsoiafAntAbilities', 'tabAsoiafAntCombat', 'tabNotes']

const INITIAL = {
  splat: 'ASOIAF_ANTAGONIST', npc: true,
  name: '', asoiafHouse: '', asoiafAge: 'Adult', asoiafRole: '', concept: '',
  asoiafAgility: 2, asoiafAnimalHandling: 2, asoiafAthletics: 2,
  asoiafAwareness: 2, asoiafCunning: 2, asoiafDeception: 2,
  asoiafEndurance: 2, asoiafFighting: 2, asoiafHealing: 2,
  asoiafKnowledge: 2, asoiafLanguage: 2, asoiafMarksmanship: 2,
  asoiafPersuasion: 2, asoiafStatusAbility: 2, asoiafStealth: 2,
  asoiafSurvival: 2, asoiafThievery: 2, asoiafWarfare: 2,
  asoiafWill: 2,
  asoiafSpecialties: '', asoiafBenefits: '', asoiafDrawbacks: '',
  asoiafWeapons: '', asoiafArmor: '',
  asoiafHealthMax: 0, asoiafHealthCurrent: 0,
  notes: '',
}

export default function AsoiafAntagonistForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const [searchParams] = useSearchParams()
  const viewMode = searchParams.get('mode') === 'view'
  const characterId = paramId || null

  useEffect(() => { switchTheme('asoiaf') }, [])
  const { isAutoCreating } = useAutoCreate(characterId, INITIAL)

  const [tab, setTab] = useState(0)
  const [fields, setFields] = useState(INITIAL)
  const [templateName, setTemplateName] = useState('')
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
  async function handleDoneEditing() { await handleSave(); navigate('/asoiaf') }

  function loadTemplate(npcName) {
    const n = ASOIAF_PREMADE_NPCS.find(n => n.name === npcName)
    if (!n) return
    setTemplateName(npcName)
    setFields(prev => ({
      ...prev,
      name: n.name,
      asoiafHouse: n.house || '',
      asoiafAge: n.age || 'Adult',
      asoiafRole: n.role || '',
      concept: n.description || '',
      asoiafAgility: n.asoiafAgility, asoiafAnimalHandling: n.asoiafAnimalHandling,
      asoiafAthletics: n.asoiafAthletics, asoiafAwareness: n.asoiafAwareness,
      asoiafCunning: n.asoiafCunning, asoiafDeception: n.asoiafDeception,
      asoiafEndurance: n.asoiafEndurance, asoiafFighting: n.asoiafFighting,
      asoiafHealing: n.asoiafHealing, asoiafKnowledge: n.asoiafKnowledge,
      asoiafLanguage: n.asoiafLanguage, asoiafMarksmanship: n.asoiafMarksmanship,
      asoiafPersuasion: n.asoiafPersuasion, asoiafStatusAbility: n.asoiafStatusAbility,
      asoiafStealth: n.asoiafStealth, asoiafSurvival: n.asoiafSurvival,
      asoiafThievery: n.asoiafThievery, asoiafWarfare: n.asoiafWarfare,
      asoiafWill: n.asoiafWill,
      asoiafSpecialties: n.specialties || '',
      asoiafBenefits: n.benefits || '',
      asoiafDrawbacks: n.drawbacks || '',
      asoiafWeapons: n.weapons || '',
      asoiafArmor: n.armor || '',
      asoiafHealthMax: n.healthMax || 0,
      asoiafHealthCurrent: n.healthCurrent || 0,
      notes: n.notes || '',
    }))
  }

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/asoiaf')}>{t('back')}</button>
        <h2>{fields.name || 'New NPC'}</h2>
        <span className="splat-badge splat-badge--asoiaf">ASOIAF</span>
        <span className="splat-badge splat-badge--asoiaf">NPC</span>
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}

      <div className="tab-list" role="tablist">
        {TAB_KEYS.map((tk, i) => (
          <button key={tk} role="tab" className={`btn btn-secondary${tab === i ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(i)} aria-selected={tab === i}>{t(tk)}</button>
        ))}
      </div>

      {/* ── Identity ── */}
      <div hidden={tab !== 0} role="tabpanel">
        <div className="form-section">
          <fieldset>
            <legend>Load Template</legend>
            <CatalogSelect
              id="npc-template" name="npcTemplate" label="Premade NPC"
              value={templateName} onChange={(_, val) => loadTemplate(val)}
              catalog={ASOIAF_NPC_CATALOG} placeholder="Search NPCs..."
              showDescOnSelect={false}
            />
            {templateName && (
              <p className="muted-hint muted-hint--xs mt-xs text-accent">
                Loaded from template: <strong>{templateName}</strong> — customize freely below.
              </p>
            )}
          </fieldset>

          <fieldset>
            <legend>Identity</legend>
            <div className="field-row">
              <div className="field" style={{ flex: 2 }}>
                <label>Name *</label>
                <input name="name" value={fields.name} onChange={handleText} placeholder="Ser Gregor, Petyr Baelish..." />
              </div>
              <div className="field">
                <label>House</label>
                <input name="asoiafHouse" value={fields.asoiafHouse} onChange={handleText} placeholder="Stark, Lannister, Targaryen..." />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Age</label>
                <select name="asoiafAge" value={fields.asoiafAge} onChange={handleText}>
                  <option value="Youth">Youth</option>
                  <option value="Adolescent">Adolescent</option>
                  <option value="Adult">Adult</option>
                  <option value="Middle-Aged">Middle-Aged</option>
                  <option value="Old">Old</option>
                  <option value="Very Old">Very Old</option>
                </select>
              </div>
              <div className="field">
                <label>Role</label>
                <input name="asoiafRole" value={fields.asoiafRole} onChange={handleText} placeholder="Warrior, Schemer, Scholar..." />
              </div>
            </div>
            <div className="field">
              <label>Description / Concept</label>
              <input name="concept" value={fields.concept} onChange={handleText} placeholder="A brief description of this NPC..." />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Abilities ── */}
      <div hidden={tab !== 1} role="tabpanel">
        <div className="form-section">
          <fieldset>
            <legend>Abilities</legend>
            <div className="grid gap-md" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
              {ASOIAF_ABILITIES.map(a => (
                <DotRating
                  key={a.key}
                  label={a.label}
                  name={a.key}
                  value={fields[a.key]}
                  onChange={handleField}
                  min={1}
                  max={7}
                />
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Health</legend>
            <div className="field-row">
              <div className="field" style={{ maxWidth: '150px' }}>
                <label>Max Health</label>
                <input type="number" name="asoiafHealthMax" value={fields.asoiafHealthMax} onChange={e => handleField('asoiafHealthMax', parseInt(e.target.value) || 0)} min={0} />
              </div>
              <div className="field" style={{ maxWidth: '150px' }}>
                <label>Current Health</label>
                <input type="number" name="asoiafHealthCurrent" value={fields.asoiafHealthCurrent} onChange={e => handleField('asoiafHealthCurrent', parseInt(e.target.value) || 0)} min={0} />
              </div>
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Combat ── */}
      <div hidden={tab !== 2} role="tabpanel">
        <div className="form-section">
          <fieldset>
            <legend>Specialties</legend>
            <textarea
              name="asoiafSpecialties" value={fields.asoiafSpecialties} onChange={handleText}
              aria-label="Specialties"
              rows={4} className="w-full"
              placeholder="Long Blades 2B, Shields 1B, Dodge 1B..."
            />
          </fieldset>

          <fieldset>
            <legend>Benefits</legend>
            <textarea
              name="asoiafBenefits" value={fields.asoiafBenefits} onChange={handleText}
              aria-label="Benefits"
              rows={4} className="w-full"
              placeholder="Long Blade Fighter I, Tough, Blood of the Andals..."
            />
          </fieldset>

          <fieldset>
            <legend>Drawbacks</legend>
            <textarea
              name="asoiafDrawbacks" value={fields.asoiafDrawbacks} onChange={handleText}
              aria-label="Drawbacks"
              rows={3} className="w-full"
              placeholder="Honor Bound, Nemesis, Bastard Born..."
            />
          </fieldset>

          <fieldset>
            <legend>Weapons</legend>
            <textarea
              name="asoiafWeapons" value={fields.asoiafWeapons} onChange={handleText}
              aria-label="Weapons"
              rows={4} className="w-full"
              placeholder="Longsword (4D+1B, Athletics 3), Shield (Defensive +2)..."
            />
          </fieldset>

          <fieldset>
            <legend>Armor</legend>
            <textarea
              name="asoiafArmor" value={fields.asoiafArmor} onChange={handleText}
              aria-label="Armor"
              rows={3} className="w-full"
              placeholder="Mail (AR 5, AP -3, Bulk 2), Shield..."
            />
          </fieldset>
        </div>
      </div>

      {/* ── Notes ── */}
      <div hidden={tab !== 3} role="tabpanel">
        <div className="form-section">
          <fieldset>
            <legend>GM Notes & Tactics</legend>
            <textarea name="notes" value={fields.notes} onChange={handleText} rows={10} className="w-full" placeholder="Combat tactics, encounter notes, motivations, alliances..." />
          </fieldset>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => setShowExport(true)}>{t('exportPdf')}</button>
        <button className="btn btn-secondary" onClick={() => navigate('/asoiaf')}>{t('cancel')}</button>
        <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>{saving ? t('saving') : t('quickSave')}</button>
        <button className="btn btn-primary" onClick={handleDoneEditing} disabled={saving}>{t('doneEditing')}</button>
      </div>
      <ExportModal open={showExport} onClose={() => setShowExport(false)} tabKeys={TAB_KEYS} t={t} />
    </div>
  )
}
