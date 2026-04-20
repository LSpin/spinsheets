import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getCharacter, updateCharacter } from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import CatalogSelect from './CatalogSelect'
import { useLanguage } from '../i18n/LanguageContext'
import ExportModal from './ExportModal'
import { useTheme } from '../context/ThemeContext'
import { DND_ALIGNMENTS } from '../data/dnd5eRaces'
import {
  DND_MONSTER_SIZES, DND_MONSTER_TYPES, DND_CHALLENGE_RATINGS, DND_PREMADE_MONSTERS,
} from '../data/dnd5eMonsters'

const TAB_KEYS = ['tabDndMonsterIdentity', 'tabDndMonsterStats', 'tabDndMonsterActions', 'tabDndMonsterTraits', 'tabBackstory']

const INITIAL = {
  splat: 'DND_MONSTER', npc: true,
  name: '', concept: '',
  dndMonsterType: '', dndMonsterSize: 'Medium',
  dndChallengeRating: '1', dndAlignment: '',
  dndStrength: 10, dndDexterity: 10, dndConstitution: 10,
  dndIntelligence: 10, dndWisdom: 10, dndCharisma: 10,
  dndMonsterAC: 10, dndMonsterHP: 10,
  dndMonsterSpeed: '30 ft.',
  dndSavingThrows: '', dndSkillProficiencies: '',
  dndMonsterSenses: 'Passive Perception 10',
  dndMonsterLanguages: '',
  dndMonsterImmunities: '', dndMonsterResistances: '', dndMonsterVulnerabilities: '',
  dndMonsterConditionImmunities: '',
  dndMonsterActions: '', dndMonsterTraits: '',
  dndMonsterLegendary: '', dndLairActions: '',
  notes: '', backstory: '',
}

const ABILITIES = [
  { key: 'dndStrength', label: 'STR', full: 'Strength' },
  { key: 'dndDexterity', label: 'DEX', full: 'Dexterity' },
  { key: 'dndConstitution', label: 'CON', full: 'Constitution' },
  { key: 'dndIntelligence', label: 'INT', full: 'Intelligence' },
  { key: 'dndWisdom', label: 'WIS', full: 'Wisdom' },
  { key: 'dndCharisma', label: 'CHA', full: 'Charisma' },
]

const MONSTER_TEMPLATE_CATALOG = DND_PREMADE_MONSTERS.map(m => {
  const cr = DND_CHALLENGE_RATINGS.find(c => c.value === m.cr)
  return { value: m.name, description: `CR ${m.cr} ${m.type} — ${cr ? cr.xp.toLocaleString() + ' XP' : ''}` }
})

function abilityMod(score) { return Math.floor((score - 10) / 2) }
function formatMod(mod) { return mod >= 0 ? `+${mod}` : `${mod}` }

export default function DndMonsterForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const [searchParams] = useSearchParams()
  const viewMode = searchParams.get('mode') === 'view'
  const characterId = paramId || null

  useEffect(() => { switchTheme('dnd') }, [])
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
  async function handleDoneEditing() { await handleSave(); navigate('/dnd') }

  function loadTemplate(monsterName) {
    const m = DND_PREMADE_MONSTERS.find(m => m.name === monsterName)
    if (!m) return
    setTemplateName(monsterName)
    setFields(prev => ({
      ...prev,
      name: m.name,
      dndMonsterType: m.type,
      dndMonsterSize: m.size,
      dndAlignment: m.alignment,
      dndChallengeRating: m.cr,
      dndStrength: m.str, dndDexterity: m.dex, dndConstitution: m.con,
      dndIntelligence: m.int, dndWisdom: m.wis, dndCharisma: m.cha,
      dndMonsterAC: m.ac, dndMonsterHP: m.hp,
      dndMonsterSpeed: m.speed,
      dndSavingThrows: m.savingThrows || '',
      dndSkillProficiencies: m.skills || '',
      dndMonsterSenses: m.senses || '',
      dndMonsterLanguages: m.languages || '',
      dndMonsterImmunities: m.immunities || '',
      dndMonsterResistances: m.resistances || '',
      dndMonsterVulnerabilities: m.vulnerabilities || '',
      dndMonsterActions: m.actions || '',
      dndMonsterTraits: m.traits || '',
      dndMonsterLegendary: m.legendary || '',
    }))
  }

  const crEntry = DND_CHALLENGE_RATINGS.find(c => c.value === fields.dndChallengeRating)

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/dnd')}>{t('back')}</button>
        <h2>{fields.name || 'New Monster / BBEG'}</h2>
        <span className="splat-badge splat-badge--dnd">D&D 5e</span>
        <span className="splat-badge splat-badge--dnd">Monster / BBEG</span>
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}

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
              id="monster-template" name="monsterTemplate" label="SRD Monster Template"
              value={templateName} onChange={(_, val) => loadTemplate(val)}
              catalog={MONSTER_TEMPLATE_CATALOG} placeholder="Search monsters..."
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
                <input name="name" value={fields.name} onChange={handleText} placeholder="Ancient Red Dragon, Lord Strahd..." />
              </div>
            </div>
            <div className="field-row">
              <CatalogSelect
                id="monster-type" name="dndMonsterType" label="Type"
                value={fields.dndMonsterType} onChange={handleField}
                catalog={DND_MONSTER_TYPES} placeholder="Select type..."
              />
              <CatalogSelect
                id="monster-size" name="dndMonsterSize" label="Size"
                value={fields.dndMonsterSize} onChange={handleField}
                catalog={DND_MONSTER_SIZES} placeholder="Select size..."
              />
            </div>
            <div className="field-row">
              <CatalogSelect
                id="monster-alignment" name="dndAlignment" label="Alignment"
                value={fields.dndAlignment} onChange={handleField}
                catalog={DND_ALIGNMENTS} placeholder="Select alignment..."
              />
              <div className="field">
                <label>Challenge Rating {crEntry ? `(${crEntry.xp.toLocaleString()} XP)` : ''}</label>
                <select name="dndChallengeRating" value={fields.dndChallengeRating} onChange={handleText}>
                  {DND_CHALLENGE_RATINGS.map(cr => (
                    <option key={cr.value} value={cr.value}>CR {cr.value} ({cr.xp.toLocaleString()} XP)</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field">
              <label>Concept / Description</label>
              <input name="concept" value={fields.concept} onChange={handleText} placeholder="A brief description of this creature..." />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Stats ── */}
      <div role="tabpanel" id={`tabpanel-1`} aria-labelledby={`tab-1`} hidden={tab !== 1}>
        <div className="form-section">
          <fieldset>
            <legend>Ability Scores</legend>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 'var(--space-md)' }}>
              {ABILITIES.map(a => {
                const score = fields[a.key]
                const mod = abilityMod(score)
                return (
                  <div key={a.key} className="form-section" style={{ padding: 'var(--space-md)', textAlign: 'center', marginBottom: 0 }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{a.full}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-accent-fg)', fontWeight: 700 }}>{formatMod(mod)}</div>
                    <input
                      type="number" name={a.key} value={score}
                      onChange={e => handleField(a.key, parseInt(e.target.value) || 0)}
                      style={{ width: '60px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 700, margin: '0.3rem auto', display: 'block' }}
                      min={1} max={30}
                    />
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{a.label}</div>
                  </div>
                )
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend>Defense & Movement</legend>
            <div className="field-row">
              <div className="field">
                <label>Armor Class</label>
                <input type="number" name="dndMonsterAC" value={fields.dndMonsterAC} onChange={e => handleField('dndMonsterAC', parseInt(e.target.value) || 0)} min={0} max={30} />
              </div>
              <div className="field">
                <label>Hit Points</label>
                <input type="number" name="dndMonsterHP" value={fields.dndMonsterHP} onChange={e => handleField('dndMonsterHP', parseInt(e.target.value) || 0)} min={0} />
              </div>
              <div className="field" style={{ flex: 2 }}>
                <label>Speed</label>
                <input name="dndMonsterSpeed" value={fields.dndMonsterSpeed} onChange={handleText} placeholder="30 ft., fly 60 ft." />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Proficiencies</legend>
            <div className="field-row">
              <div className="field" style={{ flex: 1 }}>
                <label>Saving Throws</label>
                <input name="dndSavingThrows" value={fields.dndSavingThrows} onChange={handleText} placeholder="DEX +6, CON +13, WIS +7" />
              </div>
              <div className="field" style={{ flex: 1 }}>
                <label>Skills</label>
                <input name="dndSkillProficiencies" value={fields.dndSkillProficiencies} onChange={handleText} placeholder="Perception +13, Stealth +6" />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Damage Modifiers</legend>
            <div className="field">
              <label>Damage Immunities</label>
              <input name="dndMonsterImmunities" value={fields.dndMonsterImmunities} onChange={handleText} placeholder="Fire, Poison" />
            </div>
            <div className="field">
              <label>Damage Resistances</label>
              <input name="dndMonsterResistances" value={fields.dndMonsterResistances} onChange={handleText} placeholder="Cold; Bludgeoning from nonmagical attacks" />
            </div>
            <div className="field">
              <label>Damage Vulnerabilities</label>
              <input name="dndMonsterVulnerabilities" value={fields.dndMonsterVulnerabilities} onChange={handleText} placeholder="Fire" />
            </div>
            <div className="field">
              <label>Condition Immunities</label>
              <input name="dndMonsterConditionImmunities" value={fields.dndMonsterConditionImmunities} onChange={handleText} placeholder="Charmed, Frightened, Poisoned" />
            </div>
          </fieldset>

          <fieldset>
            <legend>Senses & Languages</legend>
            <div className="field">
              <label>Senses</label>
              <input name="dndMonsterSenses" value={fields.dndMonsterSenses} onChange={handleText} placeholder="Blindsight 60 ft., Darkvision 120 ft., Passive Perception 23" />
            </div>
            <div className="field">
              <label>Languages</label>
              <input name="dndMonsterLanguages" value={fields.dndMonsterLanguages} onChange={handleText} placeholder="Common, Draconic" />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Actions ── */}
      <div role="tabpanel" id={`tabpanel-2`} aria-labelledby={`tab-2`} hidden={tab !== 2}>
        <div className="form-section">
          <fieldset>
            <legend>Actions</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              One action per line. Format: <em>Name: Description with attack bonus, damage, save DC, etc.</em>
            </p>
            <textarea
              name="dndMonsterActions" value={fields.dndMonsterActions} onChange={handleText}
              rows={10} style={{ width: '100%' }}
              placeholder={'Multiattack: The dragon makes three attacks: one with its bite and two with its claws.\nBite: +14 to hit, reach 10 ft., 2d10+8 piercing plus 2d6 fire.\nClaw: +14 to hit, reach 5 ft., 2d6+8 slashing.\nFire Breath (Recharge 5-6): 60-ft. cone, DEX DC 21, 18d6 fire (half on save).'}
            />
          </fieldset>

          <fieldset>
            <legend>Legendary Actions</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Legendary actions are taken at the end of another creature's turn. Most legendary creatures get 3 per round.
            </p>
            <textarea
              name="dndMonsterLegendary" value={fields.dndMonsterLegendary} onChange={handleText}
              rows={6} style={{ width: '100%' }}
              placeholder={'The dragon can take 3 legendary actions.\nDetect: Perception check.\nTail Attack: +14 to hit, reach 15 ft., 2d8+8 bludgeoning.\nWing Attack (2 actions): DEX DC 22, 2d6+8 bludgeoning and knocked prone.'}
            />
          </fieldset>

          <fieldset>
            <legend>Lair Actions</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Lair actions occur on initiative count 20 (losing ties) when the creature is in its lair.
            </p>
            <textarea
              name="dndLairActions" value={fields.dndLairActions} onChange={handleText}
              rows={4} style={{ width: '100%' }}
              placeholder="Describe lair actions available on initiative count 20..."
            />
          </fieldset>
        </div>
      </div>

      {/* ── Traits ── */}
      <div role="tabpanel" id={`tabpanel-3`} aria-labelledby={`tab-3`} hidden={tab !== 3}>
        <div className="form-section">
          <fieldset>
            <legend>Special Traits & Abilities</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              One trait per line. Format: <em>Trait Name: Description.</em> Include passive abilities, spellcasting, resistances, and other special features.
            </p>
            <textarea
              name="dndMonsterTraits" value={fields.dndMonsterTraits} onChange={handleText}
              rows={10} style={{ width: '100%' }}
              placeholder={'Legendary Resistance (3/Day): If the creature fails a saving throw, it can choose to succeed instead.\nMagic Resistance: Advantage on saving throws against spells and magical effects.\nSpellcasting: 18th-level spellcaster...'}
            />
          </fieldset>
        </div>
      </div>

      {/* ── Notes / Backstory ── */}
      <div role="tabpanel" id={`tabpanel-4`} aria-labelledby={`tab-4`} hidden={tab !== 4}>
        <div className="form-section">
          <fieldset>
            <legend>Backstory & Motivation</legend>
            <textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} style={{ width: '100%' }} placeholder="Who is this creature? What drives it? What is its history?" />
          </fieldset>
          <fieldset>
            <legend>DM Notes & Tactics</legend>
            <textarea name="notes" value={fields.notes} onChange={handleText} rows={6} style={{ width: '100%' }} placeholder="Combat tactics, weaknesses, encounter notes, treasure..." />
          </fieldset>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => setShowExport(true)}>{t('exportPdf')}</button>
        <button className="btn btn-secondary" onClick={() => navigate('/dnd')}>{t('cancel')}</button>
        <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>{saving ? t('saving') : t('quickSave')}</button>
        <button className="btn btn-primary" onClick={handleDoneEditing} disabled={saving}>{t('doneEditing')}</button>
      </div>
      <ExportModal open={showExport} onClose={() => setShowExport(false)} tabKeys={TAB_KEYS} t={t} />
    </div>
  )
}
