import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getCharacter, updateCharacter } from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import CatalogSelect from './CatalogSelect'
import { useLanguage } from '../i18n/LanguageContext'
import ExportModal from './ExportModal'
import { useTheme } from '../context/ThemeContext'
import { DND_MONSTER_SIZES, DND_CHALLENGE_RATINGS } from '../data/dnd5eMonsters'
import {
  UESTRPG_CREATURE_TYPES, UESTRPG_PREMADE_ANTAGONISTS, UESTRPG_ANTAGONIST_CATALOG,
} from '../data/uestrpgAntagonists'
import SaveButton from './SaveButton'

const TAB_KEYS = ['tabUestrpgAntIdentity', 'tabUestrpgAntStats', 'tabUestrpgAntActions', 'tabUestrpgAntTraits', 'tabBackstory']

const INITIAL = {
  splat: 'UESTRPG_ANTAGONIST', npc: true,
  name: '', concept: '',
  dndMonsterType: '', dndMonsterSize: 'Medium',
  dndChallengeRating: '1', dndAlignment: '',
  dndStrength: 10, dndDexterity: 10, dndConstitution: 10,
  dndIntelligence: 10, dndWisdom: 10, dndCharisma: 10,
  dndMonsterAC: 10, dndMonsterHP: 10,
  dndMonsterSpeed: '30 ft.',
  dndSavingThrows: '', dndSkillProficiencies: '',
  dndMonsterSenses: '', dndMonsterLanguages: '',
  dndMonsterImmunities: '', dndMonsterResistances: '',
  dndMonsterActions: '', dndMonsterTraits: '',
  dndMonsterLegendary: '',
  notes: '', backstory: '',
}

const ABILITIES = [
  { key: 'dndStrength', label: 'STR', full: 'Strength' },
  { key: 'dndDexterity', label: 'AGI', full: 'Agility' },
  { key: 'dndConstitution', label: 'END', full: 'Endurance' },
  { key: 'dndIntelligence', label: 'INT', full: 'Intelligence' },
  { key: 'dndWisdom', label: 'WIL', full: 'Willpower' },
  { key: 'dndCharisma', label: 'PER', full: 'Personality' },
]

const TEMPLATE_CATALOG = UESTRPG_ANTAGONIST_CATALOG

function abilityMod(score) { return Math.floor((score - 10) / 2) }
function formatMod(mod) { return mod >= 0 ? `+${mod}` : `${mod}` }

export default function UestrpgAntagonistForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const [searchParams] = useSearchParams()
  const viewMode = searchParams.get('mode') === 'view'
  const characterId = paramId || null

  useEffect(() => { switchTheme('uestrpg') }, [])
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
  async function handleSave() { setSaving(true); setSaveError(null); try { await updateCharacter(characterId, fields) } catch(e) { setSaveError(t('failedToSave')); throw e } finally { setSaving(false) } }
  async function handleDoneEditing() { await handleSave(); navigate('/uestrpg') }

  function loadTemplate(monsterName) {
    const m = UESTRPG_PREMADE_ANTAGONISTS.find(m => m.name === monsterName)
    if (!m) return
    setTemplateName(monsterName)
    setFields(prev => ({
      ...prev,
      name: m.name,
      concept: m.description || '',
      dndMonsterType: m.type,
      dndMonsterSize: m.size || 'Medium',
      dndAlignment: m.alignment || '',
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
        <button className="btn btn-secondary" onClick={() => navigate('/uestrpg')}>{t('back')}</button>
        <h2>{fields.name || 'New Antagonist'}</h2>
        <span className="splat-badge splat-badge--uestrpg">UESTRPG</span>
        <span className="splat-badge splat-badge--uestrpg">Antagonist</span>
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
              id="ant-template" name="antTemplate" label="Premade Antagonist"
              value={templateName} onChange={(_, val) => loadTemplate(val)}
              catalog={TEMPLATE_CATALOG} placeholder="Search antagonists..."
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
                <input name="name" value={fields.name} onChange={handleText} placeholder="Draugr Deathlord, Alduin..." />
              </div>
            </div>
            <div className="field-row">
              <CatalogSelect
                id="ant-type" name="dndMonsterType" label="Creature Type"
                value={fields.dndMonsterType} onChange={handleField}
                catalog={UESTRPG_CREATURE_TYPES} placeholder="Select type..."
              />
              <CatalogSelect
                id="ant-size" name="dndMonsterSize" label="Size"
                value={fields.dndMonsterSize} onChange={handleField}
                catalog={DND_MONSTER_SIZES} placeholder="Select size..."
              />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Challenge Rating {crEntry ? `(${crEntry.xp.toLocaleString()} XP)` : ''}</label>
                <select name="dndChallengeRating" value={fields.dndChallengeRating} onChange={handleText}>
                  {DND_CHALLENGE_RATINGS.map(cr => (
                    <option key={cr.value} value={cr.value}>CR {cr.value} ({cr.xp.toLocaleString()} XP)</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Alignment</label>
                <input name="dndAlignment" value={fields.dndAlignment} onChange={handleText} placeholder="Neutral Evil, Chaotic Evil..." />
              </div>
            </div>
            <div className="field">
              <label>Description</label>
              <input name="concept" value={fields.concept} onChange={handleText} placeholder="A brief description of this creature..." />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Stats ── */}
      <div role="tabpanel" id={`tabpanel-1`} aria-labelledby={`tab-1`} hidden={tab !== 1}>
        <div className="form-section">
          <fieldset>
            <legend>Attributes</legend>
            <div className="grid gap-md" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))' }}>
              {ABILITIES.map(a => {
                const score = fields[a.key]
                const mod = abilityMod(score)
                return (
                  <div key={a.key} className="form-section p-md text-center" style={{ marginBottom: 0 }}>
                    <div className="text-xs text-muted uppercase font-semibold">{a.full}</div>
                    <div className="text-sm text-accent font-bold" >{formatMod(mod)}</div>
                    <input
                      type="number" name={a.key} value={score}
                      onChange={e => handleField(a.key, parseInt(e.target.value) || 0)}
                      className="text-center font-bold" style={{ width: '60px', fontSize: '1.2rem', margin: '0.3rem auto', display: 'block' }}
                      min={1} max={30}
                    />
                    <div className="text-xs text-muted">{a.label}</div>
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
              <div className="field flex-1" >
                <label>Saving Throws</label>
                <input name="dndSavingThrows" value={fields.dndSavingThrows} onChange={handleText} placeholder="END +6, WIL +9, PER +5" />
              </div>
              <div className="field flex-1" >
                <label>Skills</label>
                <input name="dndSkillProficiencies" value={fields.dndSkillProficiencies} onChange={handleText} placeholder="Perception +8, Stealth +6" />
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
          </fieldset>

          <fieldset>
            <legend>Senses & Languages</legend>
            <div className="field">
              <label>Senses</label>
              <input name="dndMonsterSenses" value={fields.dndMonsterSenses} onChange={handleText} placeholder="Darkvision 120 ft., Passive Perception 18" />
            </div>
            <div className="field">
              <label>Languages</label>
              <input name="dndMonsterLanguages" value={fields.dndMonsterLanguages} onChange={handleText} placeholder="Tamrielic (Common), Dragon Language" />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Actions ── */}
      <div role="tabpanel" id={`tabpanel-2`} aria-labelledby={`tab-2`} hidden={tab !== 2}>
        <div className="form-section">
          <fieldset>
            <legend>Actions</legend>
            <p className="muted-hint muted-hint--xs mb-sm">
              One action per line. Format: <em>Name: Description with attack bonus, damage, save DC, etc.</em>
            </p>
            <textarea
              name="dndMonsterActions" value={fields.dndMonsterActions} onChange={handleText}
              rows={10} className="w-full"
              placeholder={'Multiattack: The dragon makes three attacks: one with its bite and two with its claws.\nBite: +14 to hit, reach 10 ft., 2d10+8 piercing plus 2d6 fire.\nFire Breath (Recharge 5-6): 60-ft. cone, DEX DC 21, 18d6 fire (half on save).\nUnrelenting Force: 90-ft. line, STR DC 21, 6d6 force and pushed 30 ft.'}
            />
          </fieldset>

          <fieldset>
            <legend>Legendary Actions</legend>
            <p className="muted-hint muted-hint--xs mb-sm">
              Legendary actions are taken at the end of another creature's turn. Powerful bosses typically get 3 per round.
            </p>
            <textarea
              name="dndMonsterLegendary" value={fields.dndMonsterLegendary} onChange={handleText}
              rows={6} className="w-full"
              placeholder={'The dragon can take 3 legendary actions.\nDetect: Perception check.\nTail Attack: +14 to hit, reach 15 ft., 2d8+8 bludgeoning.\nShout (2 Actions): The dragon uses one of its Thu\'um abilities.'}
            />
          </fieldset>
        </div>
      </div>

      {/* ── Traits ── */}
      <div role="tabpanel" id={`tabpanel-3`} aria-labelledby={`tab-3`} hidden={tab !== 3}>
        <div className="form-section">
          <fieldset>
            <legend>Special Traits & Abilities</legend>
            <p className="muted-hint muted-hint--xs mb-sm">
              One trait per line. Format: <em>Trait Name: Description.</em> Include passive abilities, shouts, spellcasting, and other special features.
            </p>
            <textarea
              name="dndMonsterTraits" value={fields.dndMonsterTraits} onChange={handleText}
              rows={10} className="w-full"
              placeholder={'Legendary Resistance (3/Day): If the creature fails a saving throw, it can choose to succeed instead.\nThu\'um Master: Can use Dragon Shouts as legendary actions.\nRegeneration: Regains 10 HP at the start of its turn unless it takes fire damage.'}
            />
          </fieldset>
        </div>
      </div>

      {/* ── Notes / Backstory ── */}
      <div role="tabpanel" id={`tabpanel-4`} aria-labelledby={`tab-4`} hidden={tab !== 4}>
        <div className="form-section">
          <fieldset>
            <legend>Backstory & Motivation</legend>
            <textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} className="w-full" placeholder="Who is this creature? What drives it? What is its history in Tamriel?" />
          </fieldset>
          <fieldset>
            <legend>GM Notes & Tactics</legend>
            <textarea name="notes" value={fields.notes} onChange={handleText} rows={6} className="w-full" placeholder="Combat tactics, weaknesses, encounter notes, loot..." />
          </fieldset>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => setShowExport(true)}>{t('exportPdf')}</button>
        <button className="btn btn-secondary" onClick={() => navigate('/uestrpg')}>{t('cancel')}</button>
        <SaveButton onSave={handleSave} disabled={saving} t={t} />
        <button className="btn btn-primary" onClick={handleDoneEditing} disabled={saving}>{t('doneEditing')}</button>
      </div>
      <ExportModal open={showExport} onClose={() => setShowExport(false)} tabKeys={TAB_KEYS} t={t} />
    </div>
  )
}
