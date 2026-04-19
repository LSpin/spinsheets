import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  getCharacter, updateCharacter,
  getXpLog, addXpLogEntry, removeXpLogEntry,
} from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import CatalogSelect from './CatalogSelect'
import XpLogSection from './XpLogSection'
import DndDiceRoller from './DndDiceRoller'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { UESTRPG_CLASSES, UESTRPG_CLASS_CATALOG } from '../data/uestrpgData'
import { UESTRPG_RACES, UESTRPG_RACE_CATALOG, UESTRPG_ALIGNMENTS } from '../data/uestrpgData'
import { UESTRPG_BACKGROUNDS, UESTRPG_SKILLS, UESTRPG_CONSTELLATION_CATALOG, UESTRPG_SPELLCASTING_ABILITIES } from '../data/uestrpgData'
import { DND_SPELLS } from '../data/dnd5eSpells'
import { DND_EQUIPMENT_CATALOG } from '../data/dnd5eEquipment'

const TAB_KEYS = ['tabIdentity', 'tabUestrpgAbilities', 'tabUestrpgSkills', 'tabUestrpgCombat', 'tabUestrpgFeatures', 'tabDndSpells', 'tabDndEquipment', 'tabBackstory', 'tabXpLog', 'tabDiceRoller']

const INITIAL = {
  splat: 'UESTRPG', name: '', concept: '', appearanceDesc: '',
  dndRace: '', dndSubrace: '', dndClass: '', dndSubclass: '', dndLevel: 1,
  dndBackground: '', dndAlignment: '', dndXp: 0,
  uestrpgBirthsign: '',
  dndStrength: 10, dndDexterity: 10, dndConstitution: 10,
  dndIntelligence: 10, dndWisdom: 10, dndCharisma: 10,
  dndHpMax: 0, dndHpCurrent: 0, dndHpTemp: 0,
  uestrpgMagickaMax: 0, uestrpgMagickaCurrent: 0,
  uestrpgLuck: 0,
  dndArmorClass: 10, dndSpeed: 30, dndInitiativeBonus: 0,
  dndHitDiceRemaining: 0, dndDeathSaveSuccesses: 0, dndDeathSaveFailures: 0,
  dndInspiration: false,
  dndSkillProficiencies: '', dndSkillExpertise: '',
  dndSavingThrows: '', dndArmorProf: '', dndWeaponProf: '',
  dndToolProf: '', dndLanguages: '',
  dndSpellcastingAbility: '', dndSpellSlots: '', dndSpellsKnown: '', dndSpellsPrepared: '',
  dndClassFeatures: '', dndRacialTraits: '', dndFeats: '',
  dndGp: 0, dndEquipment: '',
  dndPersonalityTraits: '', dndIdeals: '', dndBonds: '', dndFlaws: '',
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

function abilityMod(score) { return Math.floor((score - 10) / 2) }
function profBonus(level) { return Math.ceil(level / 4) + 1 }
function formatMod(mod) { return mod >= 0 ? `+${mod}` : `${mod}` }

function getAbilityScore(fields, abilityName) {
  const map = { Strength: 'dndStrength', Agility: 'dndDexterity', Endurance: 'dndConstitution', Intelligence: 'dndIntelligence', Willpower: 'dndWisdom', Personality: 'dndCharisma' }
  return fields[map[abilityName]] || 10
}

export default function UestrpgForm() {
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
  const [xpLog, setXpLog] = useState([])
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [spellSearch, setSpellSearch] = useState('')
  const [spellLevelFilter, setSpellLevelFilter] = useState('all')
  const [expandedSpell, setExpandedSpell] = useState(null)
  const [equipSearch, setEquipSearch] = useState('')

  useEffect(() => {
    if (characterId) loadCharacter()
  }, [characterId])

  async function loadCharacter() {
    try {
      const [charRes, xpRes] = await Promise.all([
        getCharacter(characterId),
        getXpLog(characterId),
      ])
      const data = charRes.data
      setFields(prev => {
        const merged = { ...prev }
        for (const key in prev) { if (data[key] !== undefined && data[key] !== null) merged[key] = data[key] }
        return merged
      })
      setXpLog(xpRes.data)
    } catch { setSaveError(t('failedToLoad')) }
    finally { setLoading(false) }
  }

  function handleField(name, value) { setFields(prev => ({ ...prev, [name]: typeof value === 'string' ? value : Number(value) })) }
  function handleText(e) { setFields(prev => ({ ...prev, [e.target.name]: e.target.value })) }
  function handleCheck(name) { setFields(prev => ({ ...prev, [name]: !prev[name] })) }
  function handleNumber(e) { setFields(prev => ({ ...prev, [e.target.name]: Number(e.target.value) || 0 })) }

  async function handleSave() {
    setSaving(true); setSaveError(null)
    try { await updateCharacter(characterId, fields) }
    catch { setSaveError(t('failedToSave')) }
    finally { setSaving(false) }
  }

  async function handleDoneEditing() { await handleSave(); navigate('/uestrpg') }

  // ── Derived data ──
  const selectedRace = UESTRPG_RACES[fields.dndRace]
  const selectedClass = UESTRPG_CLASSES[fields.dndClass]
  const pb = profBonus(fields.dndLevel)

  // Comma-sep helpers
  function csvList(field) { return field ? field.split(',').map(s => s.trim()).filter(Boolean) : [] }
  function toggleCsv(fieldName, value) {
    const list = csvList(fields[fieldName])
    const next = list.includes(value) ? list.filter(v => v !== value) : [...list, value]
    handleField(fieldName, next.join(', '))
  }

  const skillProfs = csvList(fields.dndSkillProficiencies)
  const skillExpertise = csvList(fields.dndSkillExpertise)
  const savingThrowProfs = csvList(fields.dndSavingThrows)
  const knownSpells = csvList(fields.dndSpellsKnown)
  const equipment = csvList(fields.dndEquipment || '')

  // Spell slots parsing: "4,3,2" = level 1: 4 slots, level 2: 3 slots, etc.
  function getSpellSlots() {
    if (!fields.dndSpellSlots) return Array(9).fill(0)
    const parts = fields.dndSpellSlots.split(',').map(s => Number(s.trim()) || 0)
    while (parts.length < 9) parts.push(0)
    return parts.slice(0, 9)
  }
  function setSpellSlot(idx, val) {
    const slots = getSpellSlots()
    slots[idx] = Math.max(0, Number(val) || 0)
    handleField('dndSpellSlots', slots.join(', '))
  }

  // Spell ability mod
  const spellAbilityMod = fields.dndSpellcastingAbility ? abilityMod(getAbilityScore(fields, fields.dndSpellcastingAbility)) : 0
  const spellSaveDC = 8 + pb + spellAbilityMod
  const spellAttack = pb + spellAbilityMod

  // Passive Perception (using Willpower as the awareness stat in TES)
  const perceptionMod = abilityMod(fields.dndWisdom) + (skillProfs.includes('Sneak') ? pb : 0) + (skillExpertise.includes('Sneak') ? pb : 0)
  const passivePerception = 10 + perceptionMod

  // Filtered spells
  const filteredSpells = DND_SPELLS.filter(spell => {
    if (spellLevelFilter !== 'all' && spell.level !== Number(spellLevelFilter)) return false
    if (spellSearch) {
      const q = spellSearch.toLowerCase()
      return spell.name.toLowerCase().includes(q) || spell.school.toLowerCase().includes(q)
    }
    return true
  })

  // Filtered equipment
  const filteredEquip = DND_EQUIPMENT_CATALOG.filter(item => {
    if (!equipSearch) return true
    const q = equipSearch.toLowerCase()
    return item.value.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
  })

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/uestrpg')}>{t('back')}</button>
        <h2>{fields.name || 'Elder Scrolls Character'}</h2>
        <span className="splat-badge">UESTRPG</span>
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}
      {actionError && <p className="status-error" role="alert">{actionError}</p>}

      <div className="tab-list" role="tablist">
        {TAB_KEYS.map((tk, i) => (
          <button key={tk} role="tab" className={`btn btn-secondary${tab === i ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(i)} aria-selected={tab === i}>{t(tk)}</button>
        ))}
      </div>

      {/* ── Tab 0: Identity ── */}
      <div hidden={tab !== 0}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tabIdentity')}</legend>
            <div className="field-row">
              <div className="field"><label>{t('charName')} *</label><input name="name" value={fields.name} onChange={handleText} /></div>
              <div className="field">
                <label>{t('dndLevel')}</label>
                <select name="dndLevel" value={fields.dndLevel} onChange={e => handleField('dndLevel', parseInt(e.target.value))}>
                  {Array.from({ length: 20 }, (_, i) => i + 1).map(lv => (
                    <option key={lv} value={lv}>{lv}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field-row">
              <CatalogSelect id="dndRace" name="dndRace" label={t('dndRace')} value={fields.dndRace}
                onChange={handleField} catalog={UESTRPG_RACE_CATALOG} />
              {selectedRace?.subraces?.length > 0 && (
                <CatalogSelect id="dndSubrace" name="dndSubrace" label={t('dndSubrace')} value={fields.dndSubrace}
                  onChange={handleField} catalog={selectedRace?.subraces || []} />
              )}
            </div>
            <div className="field-row">
              <CatalogSelect id="dndClass" name="dndClass" label={t('dndClass')} value={fields.dndClass}
                onChange={handleField} catalog={UESTRPG_CLASS_CATALOG} />
              {selectedClass?.subclasses?.length > 0 && (
                <CatalogSelect id="dndSubclass" name="dndSubclass" label={selectedClass?.subclassName || t('dndSubclass')} value={fields.dndSubclass}
                  onChange={handleField} catalog={selectedClass?.subclasses || []} />
              )}
            </div>
            <div className="field-row">
              <CatalogSelect id="dndBackground" name="dndBackground" label={t('dndBackground')} value={fields.dndBackground}
                onChange={handleField} catalog={UESTRPG_BACKGROUNDS} />
              <CatalogSelect id="dndAlignment" name="dndAlignment" label={t('dndAlignment')} value={fields.dndAlignment}
                onChange={handleField} catalog={UESTRPG_ALIGNMENTS} />
            </div>
            <div className="field-row">
              <CatalogSelect id="uestrpgBirthsign" name="uestrpgBirthsign" label={t('uestrpgBirthsign')} value={fields.uestrpgBirthsign}
                onChange={handleField} catalog={UESTRPG_CONSTELLATION_CATALOG} />
            </div>
            <div className="field-row">
              <div className="field">
                <label>{t('dndXp')}</label>
                <input type="number" name="dndXp" min={0} value={fields.dndXp} onChange={handleNumber} />
              </div>
            </div>
            {selectedClass && (
              <div className="form-section" style={{ padding: 'var(--space-md)', marginTop: 'var(--space-sm)', background: 'rgba(52,152,219,0.08)', borderLeft: '3px solid var(--color-accent-fg)' }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-xs)' }}>{fields.dndClass}</div>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 'var(--space-xs)' }}>{selectedClass.description}</p>
                <p className="muted-hint muted-hint--xs"><strong>Hit Die:</strong> d{selectedClass.hitDie} | <strong>Primary:</strong> {selectedClass.primaryAbility} | <strong>Proficiency Bonus:</strong> +{pb}</p>
              </div>
            )}
          </fieldset>
        </div>
      </div>

      {/* ── Tab 1: Abilities ── */}
      <div hidden={tab !== 1}>
        <div className="form-section">
          <fieldset>
            <legend>{t('dndAbilityScores')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-md)' }}>
              Proficiency Bonus: <strong>+{pb}</strong> (Level {fields.dndLevel})
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--space-md)' }}>
              {ABILITIES.map(ab => {
                const score = fields[ab.key]
                const mod = abilityMod(score)
                return (
                  <div key={ab.key} style={{ textAlign: 'center', padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>{ab.full}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-accent-fg)' }}>{formatMod(mod)}</div>
                    <input type="number" name={ab.key} min={1} max={30} value={score}
                      onChange={handleNumber} style={{ width: '60px', textAlign: 'center', marginTop: '4px' }} />
                  </div>
                )
              })}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('dndSavingThrows')}</legend>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
              {ABILITIES.map(ab => {
                const prof = savingThrowProfs.includes(ab.full)
                const mod = abilityMod(fields[ab.key]) + (prof ? pb : 0)
                return (
                  <label key={ab.key} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={prof} onChange={() => toggleCsv('dndSavingThrows', ab.full)} />
                    {ab.label} {formatMod(mod)}
                  </label>
                )
              })}
            </div>
            {selectedClass && (
              <p className="muted-hint muted-hint--xs" style={{ marginTop: 'var(--space-sm)' }}>
                {fields.dndClass} saving throw proficiencies: {selectedClass.savingThrows.join(', ')}
              </p>
            )}
          </fieldset>
        </div>
      </div>

      {/* ── Tab 2: Skills ── */}
      <div hidden={tab !== 2}>
        <div className="form-section">
          <fieldset>
            <legend>{t('skills')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Proficiency Bonus: +{pb} | Passive Awareness: <strong>{passivePerception}</strong>
            </p>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', marginBottom: 'var(--space-md)', fontWeight: 600 }}>
              <input type="checkbox" checked={!!fields.dndInspiration} onChange={() => handleCheck('dndInspiration')} />
              {t('dndInspiration')}
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '28px 28px 1fr 60px 50px', gap: '4px', fontWeight: 700, fontSize: '0.75rem', padding: '0 0 4px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span title="Proficient">Prof</span>
                <span title="Expertise">Exp</span>
                <span>Skill</span>
                <span>Ability</span>
                <span style={{ textAlign: 'right' }}>Mod</span>
              </div>
              {UESTRPG_SKILLS.map(skill => {
                const prof = skillProfs.includes(skill.value)
                const expert = skillExpertise.includes(skill.value)
                const abMod = abilityMod(getAbilityScore(fields, skill.ability))
                const total = abMod + (prof ? pb : 0) + (expert ? pb : 0)
                return (
                  <div key={skill.value} style={{ display: 'grid', gridTemplateColumns: '28px 28px 1fr 60px 50px', gap: '4px', alignItems: 'center', padding: '2px 0', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={prof} onChange={() => toggleCsv('dndSkillProficiencies', skill.value)} title="Proficient" />
                    <input type="checkbox" checked={expert} onChange={() => toggleCsv('dndSkillExpertise', skill.value)} title="Expertise" disabled={!prof} />
                    <span>{skill.value}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{skill.ability.slice(0, 3).toUpperCase()}</span>
                    <span style={{ textAlign: 'right', fontWeight: 600, color: 'var(--color-accent-fg)' }}>{formatMod(total)}</span>
                  </div>
                )
              })}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('dndOtherProf')}</legend>
            <div className="field"><label>{t('dndArmorProf')}</label><input name="dndArmorProf" value={fields.dndArmorProf} onChange={handleText} placeholder={selectedClass?.armorProf?.join(', ') || ''} /></div>
            <div className="field"><label>{t('dndWeaponProf')}</label><input name="dndWeaponProf" value={fields.dndWeaponProf} onChange={handleText} placeholder={selectedClass?.weaponProf?.join(', ') || ''} /></div>
            <div className="field"><label>{t('dndToolProf')}</label><input name="dndToolProf" value={fields.dndToolProf} onChange={handleText} /></div>
            <div className="field"><label>{t('dndLanguages')}</label><input name="dndLanguages" value={fields.dndLanguages} onChange={handleText} placeholder="Tamrielic, ..." /></div>
          </fieldset>
        </div>
      </div>

      {/* ── Tab 3: Combat ── */}
      <div hidden={tab !== 3}>
        <div className="form-section">
          <fieldset>
            <legend>{t('dndCombatStats')}</legend>
            <div className="field-row">
              <div className="field">
                <label>{t('dndArmorClass')}</label>
                <input type="number" name="dndArmorClass" value={fields.dndArmorClass} onChange={handleNumber} />
              </div>
              <div className="field">
                <label>{t('dndInitiative')}</label>
                <input type="number" name="dndInitiativeBonus" value={fields.dndInitiativeBonus} onChange={handleNumber} />
                <span className="muted-hint muted-hint--xs">AGI mod: {formatMod(abilityMod(fields.dndDexterity))}</span>
              </div>
              <div className="field">
                <label>{t('dndSpeed')}</label>
                <input type="number" name="dndSpeed" value={fields.dndSpeed} onChange={handleNumber} />
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('dndHitPoints')}</legend>
            <div className="field-row">
              <div className="field">
                <label>{t('dndHpMax')}</label>
                <input type="number" name="dndHpMax" min={0} value={fields.dndHpMax} onChange={handleNumber} />
              </div>
              <div className="field">
                <label>{t('dndHpCurrent')}</label>
                <input type="number" name="dndHpCurrent" value={fields.dndHpCurrent} onChange={handleNumber} />
              </div>
              <div className="field">
                <label>{t('dndHpTemp')}</label>
                <input type="number" name="dndHpTemp" min={0} value={fields.dndHpTemp} onChange={handleNumber} />
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('uestrpgMagicka')}</legend>
            <div className="field-row">
              <div className="field">
                <label>{t('uestrpgMagickaMax')}</label>
                <input type="number" name="uestrpgMagickaMax" min={0} value={fields.uestrpgMagickaMax} onChange={handleNumber} />
              </div>
              <div className="field">
                <label>{t('uestrpgMagickaCurrent')}</label>
                <input type="number" name="uestrpgMagickaCurrent" value={fields.uestrpgMagickaCurrent} onChange={handleNumber} />
              </div>
            </div>
          </fieldset>
          {fields.uestrpgLuck > 0 && (
            <fieldset>
              <legend>{t('uestrpgLuck')}</legend>
              <div className="field-row">
                <div className="field">
                  <label>{t('uestrpgLuck')}</label>
                  <input type="number" name="uestrpgLuck" min={0} value={fields.uestrpgLuck} onChange={handleNumber} />
                </div>
              </div>
            </fieldset>
          )}
          <fieldset>
            <legend>{t('dndHitDice')}</legend>
            <div className="field-row">
              <div className="field">
                <label>{t('dndHitDie')}</label>
                <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{selectedClass ? `d${selectedClass.hitDie}` : '--'}</span>
              </div>
              <div className="field">
                <label>{t('dndRemaining')}</label>
                <input type="number" name="dndHitDiceRemaining" min={0} max={fields.dndLevel}
                  value={fields.dndHitDiceRemaining} onChange={handleNumber} />
                <span className="muted-hint muted-hint--xs">of {fields.dndLevel}</span>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('dndDeathSaves')}</legend>
            <div style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, marginRight: 'var(--space-sm)' }}>{t('dndSuccesses')}</span>
                {[1, 2, 3].map(i => (
                  <span
                    key={`s${i}`}
                    className={`blades-dot${fields.dndDeathSaveSuccesses >= i ? ' blades-dot--filled' : ''}`}
                    onClick={() => handleField('dndDeathSaveSuccesses', fields.dndDeathSaveSuccesses === i ? i - 1 : i)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleField('dndDeathSaveSuccesses', fields.dndDeathSaveSuccesses === i ? i - 1 : i) } }}
                    role="button" tabIndex={0}
                    aria-label={`Death save success ${i}`}
                    aria-pressed={fields.dndDeathSaveSuccesses >= i}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, marginRight: 'var(--space-sm)' }}>{t('dndFailures')}</span>
                {[1, 2, 3].map(i => (
                  <span
                    key={`f${i}`}
                    className={`blades-dot${fields.dndDeathSaveFailures >= i ? ' blades-dot--filled' : ''}`}
                    onClick={() => handleField('dndDeathSaveFailures', fields.dndDeathSaveFailures === i ? i - 1 : i)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleField('dndDeathSaveFailures', fields.dndDeathSaveFailures === i ? i - 1 : i) } }}
                    role="button" tabIndex={0}
                    aria-label={`Death save failure ${i}`}
                    aria-pressed={fields.dndDeathSaveFailures >= i}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </div>
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Tab 4: Features ── */}
      <div hidden={tab !== 4}>
        <div className="form-section">
          <fieldset>
            <legend>{t('dndClassFeatures')}</legend>
            <textarea name="dndClassFeatures" value={fields.dndClassFeatures} onChange={handleText} rows={8} style={{ width: '100%' }}
              placeholder="List your class features here..." />
          </fieldset>
          <fieldset>
            <legend>{t('dndRacialTraits')}</legend>
            {selectedRace?.traits && (
              <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
                {fields.dndRace} traits: {selectedRace.traits.join(', ')}
              </p>
            )}
            <textarea name="dndRacialTraits" value={fields.dndRacialTraits} onChange={handleText} rows={5} style={{ width: '100%' }}
              placeholder="Additional racial trait notes..." />
          </fieldset>
          <fieldset>
            <legend>{t('uestrpgBirthsignAbilities')}</legend>
            {fields.uestrpgBirthsign && (
              <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
                {fields.uestrpgBirthsign}: {UESTRPG_CONSTELLATION_CATALOG.find(c => c.value === fields.uestrpgBirthsign)?.description || ''}
              </p>
            )}
            <textarea name="dndFeats" value={fields.dndFeats} onChange={handleText} rows={5} style={{ width: '100%' }}
              placeholder="List your birthsign abilities and feats here..." />
          </fieldset>
        </div>
      </div>

      {/* ── Tab 5: Spells ── */}
      <div hidden={tab !== 5}>
        <div className="form-section">
          <fieldset>
            <legend>{t('dndSpellcasting')}</legend>
            <div className="field-row">
              <CatalogSelect id="dndSpellcastingAbility" name="dndSpellcastingAbility" label={t('dndSpellcastingAbility')}
                value={fields.dndSpellcastingAbility} onChange={handleField} catalog={UESTRPG_SPELLCASTING_ABILITIES} />
            </div>
            {fields.dndSpellcastingAbility && (
              <div style={{ display: 'flex', gap: 'var(--space-lg)', marginTop: 'var(--space-sm)', fontSize: '0.9rem' }}>
                <span><strong>Spell Save DC:</strong> {spellSaveDC}</span>
                <span><strong>Spell Attack:</strong> {formatMod(spellAttack)}</span>
                <span><strong>Ability Mod:</strong> {formatMod(spellAbilityMod)}</span>
              </div>
            )}
          </fieldset>
          <fieldset>
            <legend>{t('dndSpellSlots')}</legend>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 'var(--space-sm)' }}>
              {getSpellSlots().map((slots, i) => (
                <div key={i} className="field" style={{ textAlign: 'center' }}>
                  <label style={{ fontSize: '0.75rem' }}>Level {i + 1}</label>
                  <input type="number" min={0} max={9} value={slots} onChange={e => setSpellSlot(i, e.target.value)}
                    style={{ width: '50px', textAlign: 'center' }} />
                </div>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Known Spells ({knownSpells.length})</legend>
            {knownSpells.length > 0 && (
              <div style={{ marginBottom: 'var(--space-md)' }}>
                {knownSpells.map(spellName => {
                  const spell = DND_SPELLS.find(s => s.name === spellName)
                  return (
                    <div key={spellName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid var(--color-border)' }}>
                      <span style={{ fontSize: '0.85rem' }}>
                        <strong>{spellName}</strong>
                        {spell && <span className="muted-hint muted-hint--xs"> (Lvl {spell.level}, {spell.school})</span>}
                      </span>
                      <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                        onClick={() => toggleCsv('dndSpellsKnown', spellName)}>Remove</button>
                    </div>
                  )
                })}
              </div>
            )}
            <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
              <input type="text" placeholder="Search spells..." value={spellSearch} onChange={e => setSpellSearch(e.target.value)} style={{ flex: 1 }} />
              <select value={spellLevelFilter} onChange={e => setSpellLevelFilter(e.target.value)}>
                <option value="all">All Levels</option>
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={i}>{i === 0 ? 'Cantrips' : `Level ${i}`}</option>
                ))}
              </select>
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {filteredSpells.map(spell => {
                const isKnown = knownSpells.includes(spell.name)
                const isExpanded = expandedSpell === spell.name
                return (
                  <div key={spell.name} style={{ borderBottom: '1px solid var(--color-border)', padding: '6px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', cursor: 'pointer' }}
                      onClick={() => setExpandedSpell(isExpanded ? null : spell.name)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedSpell(isExpanded ? null : spell.name) } }}
                      role="button" tabIndex={0} aria-expanded={isExpanded} aria-label={`${spell.name} details`}>
                      <span style={{ fontSize: '0.85rem', flex: 1 }}>
                        <strong>{spell.name}</strong>
                        <span className="muted-hint muted-hint--xs"> {spell.level === 0 ? 'Cantrip' : `Lvl ${spell.level}`} {spell.school}</span>
                      </span>
                      <span className="muted-hint muted-hint--xs">{spell.castingTime} | {spell.range}</span>
                      <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                        onClick={e => { e.stopPropagation(); toggleCsv('dndSpellsKnown', spell.name) }}>
                        {isKnown ? 'Remove' : 'Add'}
                      </button>
                    </div>
                    {isExpanded && (
                      <div style={{ padding: 'var(--space-sm)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        <div><strong>Components:</strong> {spell.components} | <strong>Duration:</strong> {spell.duration}</div>
                        <div><strong>Classes:</strong> {spell.classes.join(', ')}</div>
                        <p style={{ marginTop: '4px' }}>{spell.description}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Tab 6: Equipment ── */}
      <div hidden={tab !== 6}>
        <div className="form-section">
          <fieldset>
            <legend>{t('dndCurrency')}</legend>
            <div className="field-row">
              <div className="field" style={{ textAlign: 'center' }}>
                <label>{t('uestrpgSeptims')}</label>
                <input type="number" name="dndGp" min={0} value={fields.dndGp} onChange={handleNumber} style={{ width: '100px', textAlign: 'center' }} />
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('dndEquipment')}</legend>
            <div style={{ marginBottom: 'var(--space-sm)' }}>
              <input type="text" placeholder="Search equipment..." value={equipSearch} onChange={e => setEquipSearch(e.target.value)} style={{ width: '100%' }} />
            </div>
            {equipment.length > 0 && (
              <div style={{ marginBottom: 'var(--space-md)', padding: 'var(--space-sm)', background: 'rgba(52,152,219,0.08)', borderRadius: '4px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>Carried Equipment:</div>
                {equipment.map(item => (
                  <div key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px 0' }}>
                    <span style={{ fontSize: '0.85rem' }}>{item}</span>
                    <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                      onClick={() => {
                        const list = csvList(fields.dndEquipment || '')
                        handleField('dndEquipment', list.filter(i => i !== item).join(', '))
                      }}>Drop</button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {filteredEquip.map(item => (
                <div key={item.value} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.85rem' }}>
                    <strong>{item.value}</strong>
                    <span className="muted-hint muted-hint--xs"> {item.description}</span>
                  </span>
                  <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                    onClick={() => {
                      const list = csvList(fields.dndEquipment || '')
                      if (!list.includes(item.value)) {
                        handleField('dndEquipment', [...list, item.value].join(', '))
                      }
                    }}>Add</button>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Tab 7: Backstory ── */}
      <div hidden={tab !== 7}>
        <div className="form-section">
          <fieldset>
            <legend>{t('dndPersonality')}</legend>
            <div className="field"><label>{t('dndPersonalityTraits')}</label><textarea name="dndPersonalityTraits" value={fields.dndPersonalityTraits} onChange={handleText} rows={3} style={{ width: '100%' }} /></div>
            <div className="field"><label>{t('dndIdeals')}</label><textarea name="dndIdeals" value={fields.dndIdeals} onChange={handleText} rows={2} style={{ width: '100%' }} /></div>
            <div className="field"><label>{t('dndBonds')}</label><textarea name="dndBonds" value={fields.dndBonds} onChange={handleText} rows={2} style={{ width: '100%' }} /></div>
            <div className="field"><label>{t('dndFlaws')}</label><textarea name="dndFlaws" value={fields.dndFlaws} onChange={handleText} rows={2} style={{ width: '100%' }} /></div>
          </fieldset>
          <fieldset>
            <legend>{t('appearanceLabel')}</legend>
            <textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={4} style={{ width: '100%' }} />
          </fieldset>
          <fieldset><legend>{t('backstoryLabel')}</legend><textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('notes')}</legend><textarea name="notes" value={fields.notes} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
        </div>
      </div>

      {/* ── Tab 8: XP Log ── */}
      <div hidden={tab !== 8}>
        <XpLogSection splat="uestrpg" xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)} t={t} />
      </div>

      {/* ── Tab 9: Dice Roller ── */}
      <div hidden={tab !== 9}>
        <DndDiceRoller />
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => navigate('/uestrpg')}>{t('cancel')}</button>
        <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>{saving ? t('saving') : t('quickSave')}</button>
        <button className="btn btn-primary" onClick={handleDoneEditing} disabled={saving}>{t('doneEditing')}</button>
      </div>
      {viewMode && (
        <div className="view-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/uestrpg')}>{t('back')}</button>
          <button className="btn btn-primary" onClick={() => navigate(`/characters/${characterId}`, { replace: true })}>{t('edit')}</button>
        </div>
      )}
    </div>
  )
}
