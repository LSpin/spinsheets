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
import ExportModal from './ExportModal'
import { useTheme } from '../context/ThemeContext'
import { DND_CLASSES, DND_CLASS_CATALOG } from '../data/dnd5eClasses'
import { DND_RACES, DND_RACE_CATALOG, DND_ALIGNMENTS } from '../data/dnd5eRaces'
import { DND_BACKGROUNDS, DND_SKILLS } from '../data/dnd5eBackgrounds'
import { DND_SPELLS } from '../data/dnd5eSpells'
import { DND_EQUIPMENT_CATALOG } from '../data/dnd5eEquipment'
import { DND_FEATS } from '../data/dnd5eFeats'
import SaveButton from './SaveButton'

const TAB_KEYS = ['tabIdentity', 'tabDndAbilities', 'tabDndSkills', 'tabDndCombat', 'tabDndFeatures', 'tabDndSpells', 'tabDndEquipment', 'tabBackstory', 'tabXpLog', 'tabDiceRoller']

const INITIAL = {
  splat: 'DND', name: '', concept: '', appearanceDesc: '',
  dndRace: '', dndSubrace: '', dndClass: '', dndSubclass: '', dndLevel: 1,
  dndBackground: '', dndAlignment: '', dndXp: 0,
  dndStrength: 10, dndDexterity: 10, dndConstitution: 10,
  dndIntelligence: 10, dndWisdom: 10, dndCharisma: 10,
  dndHpMax: 0, dndHpCurrent: 0, dndHpTemp: 0,
  dndArmorClass: 10, dndSpeed: 30, dndInitiativeBonus: 0,
  dndHitDiceRemaining: 0, dndDeathSaveSuccesses: 0, dndDeathSaveFailures: 0,
  dndExhaustion: 0,
  dndInspiration: false,
  dndSkillProficiencies: '', dndSkillExpertise: '',
  dndSavingThrows: '', dndArmorProf: '', dndWeaponProf: '',
  dndToolProf: '', dndLanguages: '',
  dndSpellcastingAbility: '', dndSpellSlots: '', dndSpellsKnown: '', dndSpellsPrepared: '',
  dndClassFeatures: '', dndRacialTraits: '', dndFeats: '',
  dndCp: 0, dndSp: 0, dndEp: 0, dndGp: 0, dndPp: 0,
  dndEquipment: '',
  dndPersonalityTraits: '', dndIdeals: '', dndBonds: '', dndFlaws: '',
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

const SPELLCASTING_ABILITIES = [
  { value: 'Intelligence', description: 'Wizard, Artificer' },
  { value: 'Wisdom', description: 'Cleric, Druid, Ranger' },
  { value: 'Charisma', description: 'Bard, Paladin, Sorcerer, Warlock' },
]

function abilityMod(score) { return Math.floor((score - 10) / 2) }
function profBonus(level) { return Math.ceil(level / 4) + 1 }
function formatMod(mod) { return mod >= 0 ? `+${mod}` : `${mod}` }

function getAbilityScore(fields, abilityName) {
  const map = { Strength: 'dndStrength', Dexterity: 'dndDexterity', Constitution: 'dndConstitution', Intelligence: 'dndIntelligence', Wisdom: 'dndWisdom', Charisma: 'dndCharisma' }
  return fields[map[abilityName]] || 10
}

const ABILITY_ABBREV_TO_KEY = { STR: 'dndStrength', DEX: 'dndDexterity', CON: 'dndConstitution', INT: 'dndIntelligence', WIS: 'dndWisdom', CHA: 'dndCharisma' }

function parseAbilityBonuses(bonusStr) {
  if (!bonusStr) return {}
  if (bonusStr.includes('+1 to all')) {
    return { dndStrength: 1, dndDexterity: 1, dndConstitution: 1, dndIntelligence: 1, dndWisdom: 1, dndCharisma: 1 }
  }
  const result = {}
  const parts = bonusStr.split(',').map(s => s.trim())
  for (const part of parts) {
    const match = part.match(/([+-]\d+)\s+(STR|DEX|CON|INT|WIS|CHA)/)
    if (match) {
      const key = ABILITY_ABBREV_TO_KEY[match[2]]
      if (key) result[key] = (result[key] || 0) + parseInt(match[1])
    }
  }
  return result
}

function computeSuggestedHp(hitDie, level, conMod) {
  if (!hitDie || level < 1) return 0
  const avgPerLevel = Math.floor(hitDie / 2) + 1
  return hitDie + (avgPerLevel * (level - 1)) + (conMod * level)
}

export default function DndForm() {
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
  const [xpLog, setXpLog] = useState([])
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [spellSearch, setSpellSearch] = useState('')
  const [spellLevelFilter, setSpellLevelFilter] = useState('all')
  const [expandedSpell, setExpandedSpell] = useState(null)
  const [equipSearch, setEquipSearch] = useState('')
  const [equipCategory, setEquipCategory] = useState('all')
  const [featSearch, setFeatSearch] = useState('')
  const [expandedFeat, setExpandedFeat] = useState(null)
  const [appliedRaceBonuses, setAppliedRaceBonuses] = useState(null) // tracks { race, subrace, bonuses }

  useEffect(() => {
    if (characterId) loadCharacter()
  }, [characterId])

  // Race ASI auto-apply: when race/subrace changes, revert old bonuses and apply new ones
  useEffect(() => {
    const raceKey = fields.dndRace
    const subraceKey = fields.dndSubrace
    const raceData = DND_RACES[raceKey]
    if (!raceKey) {
      // Race cleared: revert any applied bonuses
      if (appliedRaceBonuses) {
        setFields(prev => {
          const next = { ...prev }
          for (const [key, val] of Object.entries(appliedRaceBonuses.bonuses)) {
            next[key] = (next[key] || 10) - val
          }
          return next
        })
        setAppliedRaceBonuses(null)
      }
      return
    }
    // Compute new bonuses
    const raceBonuses = raceData ? parseAbilityBonuses(raceData.abilityBonuses) : {}
    const subraceData = raceData?.subraces?.find(s => s.value === subraceKey)
    const subraceBonuses = subraceData ? parseAbilityBonuses(subraceData.abilityBonuses) : {}
    const newBonuses = { ...raceBonuses }
    for (const [key, val] of Object.entries(subraceBonuses)) {
      newBonuses[key] = (newBonuses[key] || 0) + val
    }
    const tag = `${raceKey}||${subraceKey || ''}`
    if (appliedRaceBonuses?.tag === tag) return // same race+subrace, no change
    setFields(prev => {
      const next = { ...prev }
      // Revert old bonuses
      if (appliedRaceBonuses) {
        for (const [key, val] of Object.entries(appliedRaceBonuses.bonuses)) {
          next[key] = (next[key] || 10) - val
        }
      }
      // Apply new bonuses
      for (const [key, val] of Object.entries(newBonuses)) {
        next[key] = (next[key] || 10) + val
      }
      return next
    })
    setAppliedRaceBonuses({ tag, bonuses: newBonuses })
  }, [fields.dndRace, fields.dndSubrace])

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
    catch(e) { setSaveError(t('failedToSave')); throw e }
    finally { setSaving(false) }
  }

  async function handleDoneEditing() { await handleSave(); navigate('/dnd') }

  // ── Derived data ──
  const selectedRace = DND_RACES[fields.dndRace]
  const selectedClass = DND_CLASSES[fields.dndClass]
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

  // Passive Perception
  const perceptionMod = abilityMod(fields.dndWisdom) + (skillProfs.includes('Perception') ? pb : 0) + (skillExpertise.includes('Perception') ? pb : 0)
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

  // Selected feats
  const selectedFeats = csvList(fields.dndFeats)

  // Filtered feats
  const filteredFeats = DND_FEATS.filter(feat => {
    if (!featSearch) return true
    const q = featSearch.toLowerCase()
    return feat.name.toLowerCase().includes(q) || feat.description.toLowerCase().includes(q)
  })

  // Filtered equipment
  const filteredEquip = DND_EQUIPMENT_CATALOG.filter(item => {
    if (equipCategory !== 'all' && item.type !== equipCategory) return false
    if (!equipSearch) return true
    const q = equipSearch.toLowerCase()
    return item.value.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
  })

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/dnd')}>{t('back')}</button>
        <h2>{fields.name || 'D&D Character'}</h2>
        <span className="splat-badge">D&D 5e</span>
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}
      {actionError && <p className="status-error" role="alert">{actionError}</p>}

      <div className="tab-list" role="tablist">
        {TAB_KEYS.map((tk, i) => (
          <button key={tk} role="tab" id={`tab-${i}`} className={`btn btn-secondary${tab === i ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(i)} aria-selected={tab === i} aria-controls={`tabpanel-${i}`}>{t(tk)}</button>
        ))}
      </div>

      {/* ── Tab 0: Identity ── */}
      <div role="tabpanel" id={`tabpanel-0`} aria-labelledby={`tab-0`} hidden={tab !== 0}>
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
                onChange={handleField} catalog={DND_RACE_CATALOG} />
              {selectedRace?.subraces?.length > 0 && (
                <CatalogSelect id="dndSubrace" name="dndSubrace" label={t('dndSubrace')} value={fields.dndSubrace}
                  onChange={handleField} catalog={selectedRace?.subraces || []} />
              )}
            </div>
            {appliedRaceBonuses && Object.keys(appliedRaceBonuses.bonuses).length > 0 && (
              <div className="form-section mt-xs text-base" role="status" aria-live="polite" style={{ padding: 'var(--space-sm) var(--space-md)', background: 'rgba(46,204,113,0.10)', borderLeft: '3px solid #2ecc71' }}>
                <strong>Race ASI Applied:</strong>{' '}
                {Object.entries(appliedRaceBonuses.bonuses).map(([key, val]) => {
                  const ab = ABILITIES.find(a => a.key === key)
                  return ab ? `${ab.label} ${formatMod(val)}` : null
                }).filter(Boolean).join(', ')}
                {selectedRace && <span className="muted-hint muted-hint--xs"> ({selectedRace.abilityBonuses})</span>}
              </div>
            )}
            <div className="field-row">
              <CatalogSelect id="dndClass" name="dndClass" label={t('dndClass')} value={fields.dndClass}
                onChange={handleField} catalog={DND_CLASS_CATALOG} />
              {selectedClass?.subclasses?.length > 0 && (
                <CatalogSelect id="dndSubclass" name="dndSubclass" label={selectedClass?.subclassName || t('dndSubclass')} value={fields.dndSubclass}
                  onChange={handleField} catalog={selectedClass?.subclasses || []} />
              )}
            </div>
            <div className="field-row">
              <CatalogSelect id="dndBackground" name="dndBackground" label={t('dndBackground')} value={fields.dndBackground}
                onChange={handleField} catalog={DND_BACKGROUNDS} />
              <CatalogSelect id="dndAlignment" name="dndAlignment" label={t('dndAlignment')} value={fields.dndAlignment}
                onChange={handleField} catalog={DND_ALIGNMENTS} />
            </div>
            <div className="field-row">
              <div className="field">
                <label>{t('dndXp')}</label>
                <input type="number" name="dndXp" min={0} value={fields.dndXp} onChange={handleNumber} />
              </div>
            </div>
            {selectedClass && (
              <div className="form-section p-md mt-sm" style={{ background: 'rgba(52,152,219,0.08)', borderLeft: '3px solid var(--color-accent-fg)' }}>
                <div className="text-lg font-bold mb-xs" >{fields.dndClass}</div>
                <p className="text-base lh-normal mb-xs" >{selectedClass.description}</p>
                <p className="muted-hint muted-hint--xs"><strong>Hit Die:</strong> d{selectedClass.hitDie} | <strong>Primary:</strong> {selectedClass.primaryAbility} | <strong>Proficiency Bonus:</strong> +{pb}</p>
              </div>
            )}
          </fieldset>
        </div>
      </div>

      {/* ── Tab 1: Abilities ── */}
      <div role="tabpanel" id={`tabpanel-1`} aria-labelledby={`tab-1`} hidden={tab !== 1}>
        <div className="form-section">
          <fieldset>
            <legend>{t('dndAbilityScores')}</legend>
            <p className="muted-hint muted-hint--xs mb-md" >
              Proficiency Bonus: <strong>+{pb}</strong> (Level {fields.dndLevel})
            </p>
            <div className="grid gap-md" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
              {ABILITIES.map(ab => {
                const score = fields[ab.key]
                const mod = abilityMod(score)
                return (
                  <div key={ab.key} className="text-center p-sm border" style={{ borderRadius: '8px' }}>
                    <div className="font-bold text-base" style={{ marginBottom: '4px' }}>{ab.full}</div>
                    <div className="font-bold text-accent" style={{ fontSize: '1.5rem' }}>{formatMod(mod)}</div>
                    <input type="number" name={ab.key} min={1} max={30} value={score}
                      onChange={handleNumber} className="text-center" style={{ width: '60px', marginTop: '4px' }} />
                  </div>
                )
              })}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('dndSavingThrows')}</legend>
            <div className="flex flex-wrap gap-md" >
              {ABILITIES.map(ab => {
                const prof = savingThrowProfs.includes(ab.full)
                const mod = abilityMod(fields[ab.key]) + (prof ? pb : 0)
                return (
                  <label key={ab.key} className="flex items-center text-base" style={{ gap: '4px' }}>
                    <input type="checkbox" checked={prof} onChange={() => toggleCsv('dndSavingThrows', ab.full)} />
                    {ab.label} {formatMod(mod)}
                  </label>
                )
              })}
            </div>
            {selectedClass && (
              <p className="muted-hint muted-hint--xs mt-sm" >
                {fields.dndClass} saving throw proficiencies: {selectedClass.savingThrows.join(', ')}
              </p>
            )}
          </fieldset>
        </div>
      </div>

      {/* ── Tab 2: Skills ── */}
      <div role="tabpanel" id={`tabpanel-2`} aria-labelledby={`tab-2`} hidden={tab !== 2}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tabDndSkills')}</legend>
            <p className="muted-hint muted-hint--xs mb-sm" >
              Proficiency Bonus: +{pb} | Passive Perception: <strong>{passivePerception}</strong>
            </p>
            <label className="flex items-center text-md mb-md font-semibold" style={{ gap: '4px' }}>
              <input type="checkbox" checked={!!fields.dndInspiration} onChange={() => handleCheck('dndInspiration')} />
              {t('dndInspiration')}
            </label>
            <div className="flex-col" style={{ gap: '2px' }}>
              <div className="grid font-bold text-sm border-b" style={{ gridTemplateColumns: '28px 28px 1fr 60px 50px', gap: '4px', padding: '0 0 4px 0' }}>
                <span title="Proficient">Prof</span>
                <span title="Expertise">Exp</span>
                <span>Skill</span>
                <span>Ability</span>
                <span className="text-right" >Mod</span>
              </div>
              {DND_SKILLS.map(skill => {
                const prof = skillProfs.includes(skill.value)
                const expert = skillExpertise.includes(skill.value)
                const abMod = abilityMod(getAbilityScore(fields, skill.ability))
                const total = abMod + (prof ? pb : 0) + (expert ? pb : 0)
                return (
                  <div key={skill.value} className="grid items-center text-base" style={{ gridTemplateColumns: '28px 28px 1fr 60px 50px', gap: '4px', padding: '2px 0' }}>
                    <input type="checkbox" checked={prof} onChange={() => toggleCsv('dndSkillProficiencies', skill.value)} title="Proficient" />
                    <input type="checkbox" checked={expert} onChange={() => toggleCsv('dndSkillExpertise', skill.value)} title="Expertise" disabled={!prof} />
                    <span>{skill.value}</span>
                    <span className="text-sm text-muted" >{skill.ability.slice(0, 3).toUpperCase()}</span>
                    <span className="text-right font-semibold text-accent" >{formatMod(total)}</span>
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
            <div className="field"><label>{t('dndLanguages')}</label><input name="dndLanguages" value={fields.dndLanguages} onChange={handleText} placeholder="Common, ..." /></div>
          </fieldset>
        </div>
      </div>

      {/* ── Tab 3: Combat ── */}
      <div role="tabpanel" id={`tabpanel-3`} aria-labelledby={`tab-3`} hidden={tab !== 3}>
        <div className="form-section">
          <fieldset>
            <legend>{t('dndCombatStats')}</legend>
            <div className="field-row">
              <div className="field">
                <label>{t('dndArmorClass')}</label>
                <input type="number" name="dndArmorClass" value={fields.dndArmorClass} onChange={handleNumber} />
                <span className="muted-hint muted-hint--xs">Unarmored: {10 + abilityMod(fields.dndDexterity)}</span>
              </div>
              <div className="field">
                <label>{t('dndInitiative')}</label>
                <input type="number" name="dndInitiativeBonus" value={fields.dndInitiativeBonus} onChange={handleNumber} />
                <span className="muted-hint muted-hint--xs">DEX mod: {formatMod(abilityMod(fields.dndDexterity))}</span>
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
                {selectedClass && (
                  <span className="muted-hint muted-hint--xs" aria-label="Suggested maximum hit points">
                    Suggested: {computeSuggestedHp(selectedClass.hitDie, fields.dndLevel, abilityMod(fields.dndConstitution))}
                  </span>
                )}
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
            <legend>{t('dndHitDice')}</legend>
            <div className="field-row">
              <div className="field">
                <label>{t('dndHitDie')}</label>
                <span className="text-xl font-semibold" >{selectedClass ? `d${selectedClass.hitDie}` : '--'}</span>
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
            <div className="flex gap-lg items-center" >
              <div>
                <span className="text-base font-semibold mr-sm" >{t('dndSuccesses')}</span>
                {[1, 2, 3].map(i => (
                  <span
                    key={`s${i}`}
                    className={`blades-dot${fields.dndDeathSaveSuccesses >= i ? ' blades-dot--filled' : ''} cursor-pointer`}
                    onClick={() => handleField('dndDeathSaveSuccesses', fields.dndDeathSaveSuccesses === i ? i - 1 : i)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleField('dndDeathSaveSuccesses', fields.dndDeathSaveSuccesses === i ? i - 1 : i) } }}
                    role="button" tabIndex={0}
                    aria-label={`Death save success ${i}`}
                    aria-pressed={fields.dndDeathSaveSuccesses >= i}
                    
                  />
                ))}
              </div>
              <div>
                <span className="text-base font-semibold mr-sm" >{t('dndFailures')}</span>
                {[1, 2, 3].map(i => (
                  <span
                    key={`f${i}`}
                    className={`blades-dot${fields.dndDeathSaveFailures >= i ? ' blades-dot--filled' : ''} cursor-pointer`}
                    onClick={() => handleField('dndDeathSaveFailures', fields.dndDeathSaveFailures === i ? i - 1 : i)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleField('dndDeathSaveFailures', fields.dndDeathSaveFailures === i ? i - 1 : i) } }}
                    role="button" tabIndex={0}
                    aria-label={`Death save failure ${i}`}
                    aria-pressed={fields.dndDeathSaveFailures >= i}
                    
                  />
                ))}
              </div>
            </div>
          </fieldset>
          {/* Exhaustion Tracker */}
          <fieldset>
            <legend>Exhaustion</legend>
            <div className="flex gap-sm items-center mb-sm" >
              <span className="text-base font-semibold" style={{ marginRight: 'var(--space-xs)' }}>Level</span>
              {[0, 1, 2, 3, 4, 5, 6].map(lvl => (
                <span
                  key={lvl}
                  className={`blades-dot${(fields.dndExhaustion || 0) >= lvl && lvl > 0 ? ' blades-dot--filled' : ''} cursor-pointer items-center justify-center text-sm font-bold`}
                  onClick={() => handleField('dndExhaustion', (fields.dndExhaustion || 0) === lvl ? lvl - 1 : lvl)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleField('dndExhaustion', (fields.dndExhaustion || 0) === lvl ? lvl - 1 : lvl) } }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Exhaustion level ${lvl}`}
                  aria-pressed={(fields.dndExhaustion || 0) >= lvl && lvl > 0}
                  style={{ width: '28px', height: '28px', display: 'inline-flex', borderRadius: '50%', border: lvl === 0 ? 'none' : undefined, background: lvl === 0 ? 'transparent' : undefined }}
                >
                  {lvl === 0 ? '' : lvl}
                </span>
              ))}
              <span className="ml-sm text-md font-bold" style={{ color: (fields.dndExhaustion || 0) >= 6 ? '#e74c3c' : (fields.dndExhaustion || 0) >= 4 ? '#e67e22' : (fields.dndExhaustion || 0) >= 1 ? '#f39c12' : 'var(--color-text-muted)' }}>
                {(fields.dndExhaustion || 0) === 0 ? 'None' : `Level ${fields.dndExhaustion}`}
              </span>
            </div>
            {(fields.dndExhaustion || 0) > 0 && (
              <div role="status" aria-live="polite" aria-atomic="true" className="p-sm" style={{ border: '2px solid', borderColor: (fields.dndExhaustion || 0) >= 6 ? '#e74c3c' : (fields.dndExhaustion || 0) >= 4 ? '#e67e22' : '#f39c12', borderRadius: '8px', background: (fields.dndExhaustion || 0) >= 6 ? 'rgba(231,76,60,0.12)' : (fields.dndExhaustion || 0) >= 4 ? 'rgba(230,126,34,0.1)' : 'rgba(243,156,18,0.08)' }}>
                <div className="font-bold mb-xs" style={{ fontSize: '0.95rem', color: (fields.dndExhaustion || 0) >= 6 ? '#e74c3c' : (fields.dndExhaustion || 0) >= 4 ? '#e67e22' : '#f39c12' }}>
                  Active Exhaustion Effects:
                </div>
                <ul className="text-base" style={{ margin: 0, paddingLeft: 'var(--space-md)', lineHeight: 1.8 }}>
                  {(fields.dndExhaustion || 0) >= 1 && <li style={{ fontWeight: (fields.dndExhaustion || 0) === 1 ? 700 : 400 }}>Level 1: Disadvantage on ability checks</li>}
                  {(fields.dndExhaustion || 0) >= 2 && <li style={{ fontWeight: (fields.dndExhaustion || 0) === 2 ? 700 : 400 }}>Level 2: Speed halved</li>}
                  {(fields.dndExhaustion || 0) >= 3 && <li style={{ fontWeight: (fields.dndExhaustion || 0) === 3 ? 700 : 400 }}>Level 3: Disadvantage on attack rolls and saving throws</li>}
                  {(fields.dndExhaustion || 0) >= 4 && <li style={{ fontWeight: (fields.dndExhaustion || 0) === 4 ? 700 : 400 }}>Level 4: HP maximum halved</li>}
                  {(fields.dndExhaustion || 0) >= 5 && <li style={{ fontWeight: (fields.dndExhaustion || 0) === 5 ? 700 : 400 }}>Level 5: Speed reduced to 0</li>}
                  {(fields.dndExhaustion || 0) >= 6 && <li className="font-bold" style={{ color: '#e74c3c' }}>Level 6: Death</li>}
                </ul>
              </div>
            )}
            <p className="muted-hint muted-hint--xs mt-sm" >
              Exhaustion effects are cumulative. Finishing a long rest reduces exhaustion by 1 level (with food and drink).
            </p>
          </fieldset>
        </div>
      </div>

      {/* ── Tab 4: Features ── */}
      <div role="tabpanel" id={`tabpanel-4`} aria-labelledby={`tab-4`} hidden={tab !== 4}>
        <div className="form-section">
          <fieldset>
            <legend>{t('dndClassFeatures')}</legend>
            <textarea name="dndClassFeatures" value={fields.dndClassFeatures} onChange={handleText} rows={8} className="w-full" 
              placeholder="List your class features here..." aria-label={t('dndClassFeatures')} />
          </fieldset>
          <fieldset>
            <legend>{t('dndRacialTraits')}</legend>
            {selectedRace?.traits && (
              <p className="muted-hint muted-hint--xs mb-sm" >
                {fields.dndRace} traits: {selectedRace.traits.join(', ')}
              </p>
            )}
            <textarea name="dndRacialTraits" value={fields.dndRacialTraits} onChange={handleText} rows={5} className="w-full" 
              placeholder="Additional racial trait notes..." aria-label={t('dndRacialTraits')} />
          </fieldset>
          <fieldset>
            <legend>{t('dndFeats')} ({selectedFeats.length})</legend>
            {selectedFeats.length > 0 && (
              <div className="mb-md p-sm" style={{ background: 'rgba(52,152,219,0.08)', borderRadius: '4px' }}>
                <div className="font-semibold text-base" style={{ marginBottom: '4px' }}>{t('dndSelectedFeats')}:</div>
                {selectedFeats.map(featName => {
                  const feat = DND_FEATS.find(f => f.name === featName)
                  return (
                    <div key={featName} className="flex justify-between items-center border-b" style={{ padding: '4px 0' }}>
                      <span className="text-base" >
                        <strong>{featName}</strong>
                        {feat?.prerequisite && <span className="muted-hint muted-hint--xs"> (Prereq: {feat.prerequisite})</span>}
                      </span>
                      <button className="btn btn-secondary text-sm" style={{ padding: '2px 8px' }}
                        onClick={() => toggleCsv('dndFeats', featName)}>Remove</button>
                    </div>
                  )
                })}
              </div>
            )}
            <div className="mb-sm" >
              <input type="text" placeholder={t('dndSearchFeats')} value={featSearch} onChange={e => setFeatSearch(e.target.value)} className="w-full"  />
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {filteredFeats.map(feat => {
                const isSelected = selectedFeats.includes(feat.name)
                const isExpanded = expandedFeat === feat.name
                return (
                  <div key={feat.name} className="border-b" style={{ padding: '6px 0' }}>
                    <div className="flex items-center gap-sm cursor-pointer" 
                      onClick={() => setExpandedFeat(isExpanded ? null : feat.name)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedFeat(isExpanded ? null : feat.name) } }}
                      role="button" tabIndex={0} aria-expanded={isExpanded} aria-label={`${feat.name} details`}>
                      <span className="text-base flex-1" >
                        <strong>{feat.name}</strong>
                        {feat.prerequisite && <span className="muted-hint muted-hint--xs"> (Prereq: {feat.prerequisite})</span>}
                      </span>
                      <button className="btn btn-secondary text-sm" style={{ padding: '2px 8px' }}
                        onClick={e => { e.stopPropagation(); toggleCsv('dndFeats', feat.name) }}>
                        {isSelected ? 'Remove' : 'Add'}
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="p-sm text-sm text-muted" >
                        <p style={{ marginTop: '4px' }}>{feat.description}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Tab 5: Spells ── */}
      <div role="tabpanel" id={`tabpanel-5`} aria-labelledby={`tab-5`} hidden={tab !== 5}>
        <div className="form-section">
          <fieldset>
            <legend>{t('dndSpellcasting')}</legend>
            <div className="field-row">
              <CatalogSelect id="dndSpellcastingAbility" name="dndSpellcastingAbility" label={t('dndSpellcastingAbility')}
                value={fields.dndSpellcastingAbility} onChange={handleField} catalog={SPELLCASTING_ABILITIES} />
            </div>
            {fields.dndSpellcastingAbility && (
              <div className="flex gap-lg mt-sm text-md" >
                <span><strong>Spell Save DC:</strong> {spellSaveDC}</span>
                <span><strong>Spell Attack:</strong> {formatMod(spellAttack)}</span>
                <span><strong>Ability Mod:</strong> {formatMod(spellAbilityMod)}</span>
              </div>
            )}
          </fieldset>
          <fieldset>
            <legend>{t('dndSpellSlots')}</legend>
            <div className="grid gap-sm" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))' }}>
              {getSpellSlots().map((slots, i) => (
                <div key={i} className="field text-center" >
                  <label className="text-sm" >Level {i + 1}</label>
                  <input type="number" min={0} max={9} value={slots} onChange={e => setSpellSlot(i, e.target.value)}
                    className="text-center" style={{ width: '50px' }} />
                </div>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('dndSpellsKnown')} ({knownSpells.length})</legend>
            {knownSpells.length > 0 && (
              <div className="mb-md" >
                {knownSpells.map(spellName => {
                  const spell = DND_SPELLS.find(s => s.name === spellName)
                  return (
                    <div key={spellName} className="flex justify-between items-center border-b" style={{ padding: '4px 0' }}>
                      <span className="text-base" >
                        <strong>{spellName}</strong>
                        {spell && <span className="muted-hint muted-hint--xs"> (Lvl {spell.level}, {spell.school})</span>}
                      </span>
                      <button className="btn btn-secondary text-sm" style={{ padding: '2px 8px' }}
                        onClick={() => toggleCsv('dndSpellsKnown', spellName)}>Remove</button>
                    </div>
                  )
                })}
              </div>
            )}
            <div className="flex gap-sm mb-sm" >
              <input type="text" placeholder="Search spells..." value={spellSearch} onChange={e => setSpellSearch(e.target.value)} className="flex-1"  />
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
                  <div key={spell.name} className="border-b" style={{ padding: '6px 0' }}>
                    <div className="flex items-center gap-sm cursor-pointer" 
                      onClick={() => setExpandedSpell(isExpanded ? null : spell.name)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedSpell(isExpanded ? null : spell.name) } }}
                      role="button" tabIndex={0} aria-expanded={isExpanded} aria-label={`${spell.name} details`}>
                      <span className="text-base flex-1" >
                        <strong>{spell.name}</strong>
                        <span className="muted-hint muted-hint--xs"> {spell.level === 0 ? 'Cantrip' : `Lvl ${spell.level}`} {spell.school}</span>
                      </span>
                      <span className="muted-hint muted-hint--xs">{spell.castingTime} | {spell.range}</span>
                      <button className="btn btn-secondary text-sm" style={{ padding: '2px 8px' }}
                        onClick={e => { e.stopPropagation(); toggleCsv('dndSpellsKnown', spell.name) }}>
                        {isKnown ? 'Remove' : 'Add'}
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="p-sm text-sm text-muted" >
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
      <div role="tabpanel" id={`tabpanel-6`} aria-labelledby={`tab-6`} hidden={tab !== 6}>
        <div className="form-section">
          <fieldset>
            <legend>{t('dndCurrency')}</legend>
            <div className="field-row">
              {['dndCp', 'dndSp', 'dndEp', 'dndGp', 'dndPp'].map(key => (
                <div className="field text-center" key={key} >
                  <label>{t(key)}</label>
                  <input type="number" name={key} min={0} value={fields[key]} onChange={handleNumber} className="text-center" style={{ width: '70px' }} />
                </div>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('dndEquipment')}</legend>
            <div className="flex mb-sm gap-sm items-center flex-wrap" >
              <div>
                <label htmlFor="dnd-equip-category" className="text-base" style={{ marginRight: 'var(--space-xs)' }}>{t('dndFilterCategory')}</label>
                <select id="dnd-equip-category" value={equipCategory} onChange={e => setEquipCategory(e.target.value)} className="text-base" >
                  <option value="all">{t('filterAll')}</option>
                  <option value="weapons">{t('dndFilterWeapons')}</option>
                  <option value="armor">{t('dndFilterArmor')}</option>
                  <option value="gear">{t('dndFilterGear')}</option>
                </select>
              </div>
              <input type="text" placeholder="Search equipment..." value={equipSearch} onChange={e => setEquipSearch(e.target.value)} className="flex-1" style={{ minWidth: '150px' }} />
            </div>
            {equipment.length > 0 && (
              <div className="mb-md p-sm" style={{ background: 'rgba(52,152,219,0.08)', borderRadius: '4px' }}>
                <div className="font-semibold text-base" style={{ marginBottom: '4px' }}>Carried Equipment:</div>
                {equipment.map(item => (
                  <div key={item} className="flex justify-between items-center" style={{ padding: '2px 0' }}>
                    <span className="text-base" >{item}</span>
                    <button className="btn btn-secondary text-sm" style={{ padding: '2px 8px' }}
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
                <div key={item.value} className="flex justify-between items-center border-b" style={{ padding: '4px 0' }}>
                  <span className="text-base" >
                    <strong>{item.value}</strong>
                    <span className="muted-hint muted-hint--xs"> {item.description}</span>
                  </span>
                  <button className="btn btn-secondary text-sm" style={{ padding: '2px 8px' }}
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
      <div role="tabpanel" id={`tabpanel-7`} aria-labelledby={`tab-7`} hidden={tab !== 7}>
        <div className="form-section">
          <fieldset>
            <legend>{t('dndPersonality')}</legend>
            <div className="field"><label>{t('dndPersonalityTraits')}</label><textarea name="dndPersonalityTraits" value={fields.dndPersonalityTraits} onChange={handleText} rows={3} className="w-full"  aria-label={t('dndPersonalityTraits')} /></div>
            <div className="field"><label>{t('dndIdeals')}</label><textarea name="dndIdeals" value={fields.dndIdeals} onChange={handleText} rows={2} className="w-full"  aria-label={t('dndIdeals')} /></div>
            <div className="field"><label>{t('dndBonds')}</label><textarea name="dndBonds" value={fields.dndBonds} onChange={handleText} rows={2} className="w-full"  aria-label={t('dndBonds')} /></div>
            <div className="field"><label>{t('dndFlaws')}</label><textarea name="dndFlaws" value={fields.dndFlaws} onChange={handleText} rows={2} className="w-full"  aria-label={t('dndFlaws')} /></div>
          </fieldset>
          <fieldset>
            <legend>{t('appearanceLabel')}</legend>
            <textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={4} className="w-full"  aria-label={t('appearanceLabel')} />
          </fieldset>
          <fieldset><legend>{t('backstoryLabel')}</legend><textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} className="w-full"  aria-label={t('backstoryLabel')} /></fieldset>
          <fieldset><legend>{t('notes')}</legend><textarea name="notes" value={fields.notes} onChange={handleText} rows={4} className="w-full"  aria-label={t('notes')} /></fieldset>
        </div>
      </div>

      {/* ── Tab 8: XP Log ── */}
      <div role="tabpanel" id={`tabpanel-8`} aria-labelledby={`tab-8`} hidden={tab !== 8}>
        <XpLogSection splat="dnd" xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)} t={t} />
      </div>

      {/* ── Tab 9: Dice Roller ── */}
      <div role="tabpanel" id={`tabpanel-9`} aria-labelledby={`tab-9`} hidden={tab !== 9}>
        <DndDiceRoller />
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => setShowExport(true)}>{t('exportPdf')}</button>
        <button className="btn btn-secondary" onClick={() => navigate('/dnd')}>{t('cancel')}</button>
        <SaveButton onSave={handleSave} disabled={saving} t={t} />
        <button className="btn btn-primary" onClick={handleDoneEditing} disabled={saving}>{t('doneEditing')}</button>
      </div>
      {viewMode && (
        <div className="view-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/dnd')}>{t('back')}</button>
          <button className="btn btn-primary" onClick={() => navigate(`/characters/${characterId}`, { replace: true })}>{t('edit')}</button>
        </div>
      )}
      <ExportModal open={showExport} onClose={() => setShowExport(false)} tabKeys={TAB_KEYS} t={t} />
    </div>
  )
}
