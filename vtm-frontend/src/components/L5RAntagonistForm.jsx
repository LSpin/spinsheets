import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getCharacter, updateCharacter } from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import CatalogSelect from './CatalogSelect'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import {
  L5R_ANTAGONIST_RANKS, L5R_ANTAGONIST_TYPES, L5R_PREMADE_ANTAGONISTS, L5R_ANTAGONIST_CATALOG,
} from '../data/l5rAntagonists'

const TAB_KEYS = ['tabL5rAntIdentity', 'tabL5rAntStats', 'tabL5rAntAbilities', 'tabBackstory']

const INITIAL = {
  splat: 'L5R_ANTAGONIST', npc: true,
  name: '', concept: '',
  dndMonsterType: '',
  dndChallengeRating: '',
  dndMonsterAC: 10, dndMonsterHP: 10,
  dndStrength: 10, dndDexterity: 10, dndConstitution: 10,
  dndIntelligence: 10, dndWisdom: 10, dndCharisma: 10,
  dndMonsterSpeed: '30 ft.',
  dndMonsterActions: '', dndMonsterTraits: '',
  dndMonsterSenses: '', dndMonsterLanguages: '',
  notes: '', backstory: '',
}

const RINGS = [
  { key: 'dndStrength', label: 'Fire', desc: 'Agility, Passion, Ferocity' },
  { key: 'dndDexterity', label: 'Water', desc: 'Perception, Flexibility, Adaptability' },
  { key: 'dndConstitution', label: 'Earth', desc: 'Stamina, Fortitude, Willpower' },
  { key: 'dndIntelligence', label: 'Air', desc: 'Reflexes, Awareness, Cunning' },
  { key: 'dndWisdom', label: 'Void', desc: 'Intuition, Enlightenment, Self' },
]

export default function L5RAntagonistForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const [searchParams] = useSearchParams()
  const viewMode = searchParams.get('mode') === 'view'
  const characterId = paramId || null

  useEffect(() => { switchTheme('l5r') }, [])
  const { isAutoCreating } = useAutoCreate(characterId, INITIAL)

  const [tab, setTab] = useState(0)
  const [fields, setFields] = useState(INITIAL)
  const [templateName, setTemplateName] = useState('')
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
  async function handleDoneEditing() { await handleSave(); navigate('/l5r') }

  function loadTemplate(antName) {
    const a = L5R_PREMADE_ANTAGONISTS.find(m => m.name === antName)
    if (!a) return
    setTemplateName(antName)
    setFields(prev => ({
      ...prev,
      name: a.name,
      concept: a.description || '',
      dndMonsterType: a.type,
      dndChallengeRating: a.rank,
      dndMonsterAC: a.armorTN || 15,
      dndMonsterHP: a.wounds || 10,
      dndStrength: a.fire || 2,
      dndDexterity: a.water || 2,
      dndConstitution: a.earth || 2,
      dndIntelligence: a.air || 2,
      dndWisdom: a.void || 1,
      dndMonsterSpeed: a.initiative || '',
      dndMonsterActions: a.actions || '',
      dndMonsterTraits: a.abilities || '',
      dndMonsterSenses: a.skills || '',
      dndMonsterLanguages: '',
      notes: a.notes || '',
    }))
  }

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/l5r')}>{t('back')}</button>
        <h2>{fields.name || 'New Antagonist'}</h2>
        <span className="splat-badge splat-badge--l5r">L5R</span>
        <span className="splat-badge" style={{ background: 'rgba(224,85,85,0.15)', color: '#e55' }}>Antagonist</span>
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}

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
            <legend>Load Template</legend>
            <CatalogSelect
              id="ant-template" name="antTemplate" label="Premade Antagonist"
              value={templateName} onChange={(_, val) => loadTemplate(val)}
              catalog={L5R_ANTAGONIST_CATALOG} placeholder="Search antagonists..."
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
              <div className="field" style={{ flex: 2 }}>
                <label>Name *</label>
                <input name="name" value={fields.name} onChange={handleText} placeholder="Akodo the Fallen, Shadowlands Warlord..." />
              </div>
            </div>
            <div className="field-row">
              <CatalogSelect
                id="ant-type" name="dndMonsterType" label="Creature Type"
                value={fields.dndMonsterType} onChange={handleField}
                catalog={L5R_ANTAGONIST_TYPES} placeholder="Select type..."
              />
              <CatalogSelect
                id="ant-rank" name="dndChallengeRating" label="Rank"
                value={fields.dndChallengeRating} onChange={handleField}
                catalog={L5R_ANTAGONIST_RANKS} placeholder="Select rank..."
              />
            </div>
            <div className="field">
              <label>Description</label>
              <textarea name="concept" value={fields.concept} onChange={handleText} rows={3} style={{ width: '100%' }}
                placeholder="A brief description of this antagonist..." />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Stats ── */}
      <div hidden={tab !== 1}>
        <div className="form-section">
          <fieldset>
            <legend>Rings</legend>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 'var(--space-md)' }}>
              {RINGS.map(r => (
                <div key={r.key} className="form-section" style={{ padding: 'var(--space-md)', textAlign: 'center', marginBottom: 0 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-accent-fg)', textTransform: 'uppercase' }}>{r.label}</div>
                  <input
                    type="number" name={r.key} value={fields[r.key]}
                    onChange={e => handleField(r.key, parseInt(e.target.value) || 0)}
                    style={{ width: '60px', textAlign: 'center', fontSize: '1.4rem', fontWeight: 700, margin: '0.3rem auto', display: 'block' }}
                    min={1} max={10}
                  />
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{r.desc}</div>
                </div>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Defense & Combat</legend>
            <div className="field-row">
              <div className="field">
                <label>Armor TN</label>
                <input type="number" name="dndMonsterAC" value={fields.dndMonsterAC}
                  onChange={e => handleField('dndMonsterAC', parseInt(e.target.value) || 0)} min={0} max={60} />
              </div>
              <div className="field">
                <label>Wounds</label>
                <input type="number" name="dndMonsterHP" value={fields.dndMonsterHP}
                  onChange={e => handleField('dndMonsterHP', parseInt(e.target.value) || 0)} min={0} />
              </div>
              <div className="field" style={{ flex: 2 }}>
                <label>Initiative</label>
                <input name="dndMonsterSpeed" value={fields.dndMonsterSpeed} onChange={handleText}
                  placeholder="5k3" />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Skills</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              List skills and their ranks. Format: <em>Skill Name Rank, Skill Name Rank</em>
            </p>
            <textarea
              name="dndMonsterSenses" value={fields.dndMonsterSenses} onChange={handleText}
              rows={5} style={{ width: '100%' }}
              placeholder="Kenjutsu 5, Defense 4, Battle 3, Intimidation 3"
            />
          </fieldset>
        </div>
      </div>

      {/* ── Abilities ── */}
      <div hidden={tab !== 2}>
        <div className="form-section">
          <fieldset>
            <legend>Special Abilities & Techniques</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              One ability per line. Include school techniques, kiho, maho spells, supernatural powers, etc.
            </p>
            <textarea
              name="dndMonsterTraits" value={fields.dndMonsterTraits} onChange={handleText}
              rows={8} style={{ width: '100%' }}
              placeholder={'Invulnerability: Cannot be harmed by non-jade weapons.\nFear Aura: All within 30 ft. must roll Willpower (TN 20) or be Shaken.\nRegeneration: Heals 5 Wounds per round unless dealt jade damage.'}
            />
          </fieldset>

          <fieldset>
            <legend>Attacks & Actions</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              One attack per line. Format: <em>Weapon: Roll to hit, DR damage roll</em>
            </p>
            <textarea
              name="dndMonsterActions" value={fields.dndMonsterActions} onChange={handleText}
              rows={6} style={{ width: '100%' }}
              placeholder={'Katana: 8k3, DR 5k2\nBite: 7k4, DR 8k3\nFire Breath: 8k5 damage, 30 ft. cone, Reflexes TN 25 for half'}
            />
          </fieldset>
        </div>
      </div>

      {/* ── Notes / Backstory ── */}
      <div hidden={tab !== 3}>
        <div className="form-section">
          <fieldset>
            <legend>Backstory & Motivation</legend>
            <textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} style={{ width: '100%' }}
              placeholder="Who is this antagonist? What drives them? What is their history in Rokugan?" />
          </fieldset>
          <fieldset>
            <legend>GM Notes & Tactics</legend>
            <textarea name="notes" value={fields.notes} onChange={handleText} rows={6} style={{ width: '100%' }}
              placeholder="Combat tactics, weaknesses, encounter notes, jade vulnerability..." />
          </fieldset>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => navigate('/l5r')}>{t('cancel')}</button>
        <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>{saving ? t('saving') : t('quickSave')}</button>
        <button className="btn btn-primary" onClick={handleDoneEditing} disabled={saving}>{t('doneEditing')}</button>
      </div>
    </div>
  )
}
