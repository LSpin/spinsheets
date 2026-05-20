import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getCharacter, updateCharacter } from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import CatalogSelect from './CatalogSelect'
import DotRating from './DotRating'
import { useLanguage } from '../i18n/LanguageContext'
import ExportModal from './ExportModal'
import { useTheme } from '../context/ThemeContext'
import { CP_PREMADE_NPCS, CP_NPC_CATALOG } from '../data/cyberpunkNpcs'

const TAB_KEYS = ['tabCpAntIdentity', 'tabCpAntStats', 'tabCpAntCombat', 'tabBackstory']

const INITIAL = {
  splat: 'CYBERPUNK_ANTAGONIST', npc: true,
  name: '', cpRole: '', concept: '',
  cpInt: 2, cpRef: 2, cpTech: 2, cpCool: 2,
  cpAttr: 2, cpLuck: 2, cpMa: 2, cpBody: 2, cpEmp: 2,
  cpSpecialAbility: '',
  cpSkills: '', cpCyberware: '', cpWeapons: '', cpArmor: '',
  cpEurodollars: 0,
  notes: '',
}

const STATS = [
  { key: 'cpInt', label: 'INT', full: 'Intelligence' },
  { key: 'cpRef', label: 'REF', full: 'Reflexes' },
  { key: 'cpTech', label: 'TECH', full: 'Technical Ability' },
  { key: 'cpCool', label: 'COOL', full: 'Cool' },
  { key: 'cpAttr', label: 'ATTR', full: 'Attractiveness' },
  { key: 'cpLuck', label: 'LUCK', full: 'Luck' },
  { key: 'cpMa', label: 'MA', full: 'Movement Allowance' },
  { key: 'cpBody', label: 'BODY', full: 'Body Type' },
  { key: 'cpEmp', label: 'EMP', full: 'Empathy' },
]

export default function CyberpunkAntagonistForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const [searchParams] = useSearchParams()
  const viewMode = searchParams.get('mode') === 'view'
  const characterId = paramId || null

  useEffect(() => { switchTheme('cyberpunk') }, [])
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
  async function handleDoneEditing() { await handleSave(); navigate('/cyberpunk') }

  function loadTemplate(npcName) {
    const n = CP_PREMADE_NPCS.find(n => n.name === npcName)
    if (!n) return
    setTemplateName(npcName)
    setFields(prev => ({
      ...prev,
      name: n.name,
      cpRole: n.role || '',
      concept: n.description || '',
      cpInt: n.cpInt, cpRef: n.cpRef, cpTech: n.cpTech,
      cpCool: n.cpCool, cpAttr: n.cpAttr, cpLuck: n.cpLuck,
      cpMa: n.cpMa, cpBody: n.cpBody, cpEmp: n.cpEmp,
      cpSpecialAbility: n.cpSpecialAbility || '',
      cpSkills: n.skills || '',
      cpCyberware: n.cyberware || '',
      cpWeapons: n.weapons || '',
      cpArmor: n.armor || '',
      cpEurodollars: n.cpEurodollars || 0,
      notes: n.notes || '',
    }))
  }

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/cyberpunk')}>{t('back')}</button>
        <h2>{fields.name || 'New NPC'}</h2>
        <span className="splat-badge splat-badge--cyberpunk">CP2020</span>
        <span className="splat-badge splat-badge--cyberpunk">NPC</span>
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
              catalog={CP_NPC_CATALOG} placeholder="Search NPCs..."
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
                <input name="name" value={fields.name} onChange={handleText} placeholder="Solo, Boostergang Punk, MaxTac..." />
              </div>
              <div className="field">
                <label>Role</label>
                <input name="cpRole" value={fields.cpRole} onChange={handleText} placeholder="Solo, Netrunner, Fixer..." />
              </div>
            </div>
            <div className="field">
              <label>Description / Concept</label>
              <input name="concept" value={fields.concept} onChange={handleText} placeholder="A brief description of this NPC..." />
            </div>
            <div className="field">
              <label>Special Ability</label>
              <input name="cpSpecialAbility" value={fields.cpSpecialAbility} onChange={handleText} placeholder="Combat Sense 5, Streetdeal 7..." />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Stats ── */}
      <div hidden={tab !== 1} role="tabpanel">
        <div className="form-section">
          <fieldset>
            <legend>Statistics</legend>
            <div className="grid gap-md" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))' }}>
              {STATS.map(s => (
                <DotRating
                  key={s.key}
                  label={`${s.full} (${s.label})`}
                  name={s.key}
                  value={fields[s.key]}
                  onChange={handleField}
                  min={0}
                  max={12}
                />
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Eurodollars</legend>
            <div className="field" style={{ maxWidth: 200 }}>
              <label>Eurodollars (eb)</label>
              <input type="number" name="cpEurodollars" value={fields.cpEurodollars} onChange={e => handleField('cpEurodollars', parseInt(e.target.value) || 0)} min={0} />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Combat ── */}
      <div hidden={tab !== 2} role="tabpanel">
        <div className="form-section">
          <fieldset>
            <legend>Skills</legend>
            <p className="muted-hint muted-hint--xs mb-sm">
              Key skills and their levels, e.g. <em>Handgun 6, Melee 5, Awareness/Notice 5</em>
            </p>
            <textarea
              name="cpSkills" value={fields.cpSkills} onChange={handleText}
              aria-label="Skills"
              rows={6} className="w-full"
              placeholder="Handgun 6, Rifle 5, Melee 5, Brawling 4, Awareness/Notice 5, Stealth 4, Athletics 3"
            />
          </fieldset>

          <fieldset>
            <legend>Weapons</legend>
            <textarea
              name="cpWeapons" value={fields.cpWeapons} onChange={handleText}
              aria-label="Weapons"
              rows={4} className="w-full"
              placeholder="Sternmeyer Type 35 (11mm, 3d6, P), Monokatana (4d6, AP)"
            />
          </fieldset>

          <fieldset>
            <legend>Armor</legend>
            <textarea
              name="cpArmor" value={fields.cpArmor} onChange={handleText}
              aria-label="Armor"
              rows={3} className="w-full"
              placeholder="Medium Armor Jacket (SP 18), Skinweave (SP 12)"
            />
          </fieldset>

          <fieldset>
            <legend>Cyberware</legend>
            <textarea
              name="cpCyberware" value={fields.cpCyberware} onChange={handleText}
              aria-label="Cyberware"
              rows={5} className="w-full"
              placeholder="Kerenzikov Boosterware Lvl 2, Smartgun Link, Cyberoptic (Targeting Scope, Low-Light)"
            />
          </fieldset>
        </div>
      </div>

      {/* ── Notes ── */}
      <div hidden={tab !== 3} role="tabpanel">
        <div className="form-section">
          <fieldset>
            <legend>GM Notes & Tactics</legend>
            <textarea name="notes" value={fields.notes} onChange={handleText} rows={10} className="w-full" placeholder="Combat tactics, encounter notes, loot, motivations, connections..." />
          </fieldset>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => setShowExport(true)}>{t('exportPdf')}</button>
        <button className="btn btn-secondary" onClick={() => navigate('/cyberpunk')}>{t('cancel')}</button>
        <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>{saving ? t('saving') : t('quickSave')}</button>
        <button className="btn btn-primary" onClick={handleDoneEditing} disabled={saving}>{t('doneEditing')}</button>
      </div>
      <ExportModal open={showExport} onClose={() => setShowExport(false)} tabKeys={TAB_KEYS} t={t} />
    </div>
  )
}
