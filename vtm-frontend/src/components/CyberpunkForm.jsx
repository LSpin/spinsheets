import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  getCharacter, updateCharacter,
  getXpLog, addXpLogEntry, removeXpLogEntry,
} from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import DotRating from './DotRating'
import CatalogSelect from './CatalogSelect'
import XpLogSection from './XpLogSection'
import RulesReferenceTab from './RulesReferenceTab'
import { useLanguage } from '../i18n/LanguageContext'
import ExportModal from './ExportModal'
import { useTheme } from '../context/ThemeContext'
import {
  CP_ROLES, CP_ROLE_CATALOG, CP_STATS, CP_SKILLS_BY_STAT,
  CP_CYBERWARE, CP_CYBERWARE_CATALOG, CP_WEAPONS, CP_WEAPONS_CATALOG,
  CP_ARMOR_CATALOG, CP_GEAR, CP_GEAR_CATALOG, CP_VEHICLES, CP_VEHICLES_CATALOG, CP_LIFEPATH_TABLES,
} from '../data/cyberpunkData'

const TAB_KEYS = ['tabCpIdentity', 'tabCpStats', 'tabCpSkills', 'tabCpCyberware', 'tabCpCombat', 'tabCpGear', 'tabCpVehicles', 'tabCpLifepath', 'tabBackstory', 'tabXpLog', 'tabDiceRoller', 'tabCpRulesRef']

const INITIAL = {
  splat: 'CYBERPUNK',
  name: '', cpHandle: '', cpRole: '', concept: '', appearanceDesc: '',
  cpInt: 2, cpRef: 2, cpTech: 2, cpCool: 2, cpAttr: 2, cpLuck: 2, cpMa: 2, cpBody: 2, cpEmp: 2,
  cpSpecialAbility: 0,
  cpHumanity: 0, cpCurrentHumanity: 0,
  cpIp: 0, cpEurodollars: 0, cpWoundState: 0,
  cpSkills: '', cpCyberware: '', cpWeapons: '', cpArmor: '', cpGear: '', cpVehicles: '',
  cpLifepath: '', cpContacts: '',
  notes: '', backstory: '',
}

const WOUND_STATES = [
  { level: 0,  label: 'OK',        penalty: 0 },
  { level: 1,  label: 'Light',     penalty: -1 },
  { level: 2,  label: 'Serious',   penalty: -2 },
  { level: 3,  label: 'Critical',  penalty: -3 },
  { level: 4,  label: 'Mortal 0',  penalty: -4 },
  { level: 5,  label: 'Mortal 1',  penalty: -5 },
  { level: 6,  label: 'Mortal 2',  penalty: -6 },
  { level: 7,  label: 'Mortal 3',  penalty: -7 },
  { level: 8,  label: 'Mortal 4',  penalty: -8 },
  { level: 9,  label: 'Mortal 5',  penalty: -9 },
  { level: 10, label: 'Mortal 6',  penalty: -10 },
]

const BODY_LOCATIONS = ['Head', 'Torso', 'R.Arm', 'L.Arm', 'R.Leg', 'L.Leg']

function parseJson(str, fallback) { try { return JSON.parse(str) || fallback } catch { return fallback } }

function getBTM(body) {
  if (body <= 2) return 0
  if (body <= 4) return -1
  if (body <= 7) return -2
  if (body <= 9) return -3
  if (body === 10) return -4
  return -5
}

const CP_RULES = [
  { title: 'Difficulty Table', sections: [
    { heading: 'Easy', text: 'Difficulty 10 — Almost anyone can do this.' },
    { heading: 'Average', text: 'Difficulty 15 — Requires some skill.' },
    { heading: 'Difficult', text: 'Difficulty 20 — Requires professional training.' },
    { heading: 'Very Difficult', text: 'Difficulty 25 — Only highly skilled individuals succeed.' },
    { heading: 'Nearly Impossible', text: 'Difficulty 30 — At the edge of human ability.' },
  ]},
  { title: 'Combat', sections: [
    { heading: 'Initiative', text: 'REF + 1d10 + Combat Sense (if Solo). Highest acts first.' },
    { heading: 'Attack Roll', text: 'REF + Weapon Skill + 1d10 ≥ target\'s Difficulty' },
    { heading: 'Damage', text: 'Roll weapon damage. Subtract target\'s armor SP. Remaining damage is applied.' },
    { heading: 'Armor Ablation', text: 'Each hit reduces armor SP by 1 (for non-hard armors).' },
  ]},
  { title: 'Wound Effects', sections: [
    { heading: 'Light (1-4)', text: '-1 to REF for all actions.' },
    { heading: 'Serious (5-8)', text: '-2 to REF. Must make Stun Save (BODY) or be stunned.' },
    { heading: 'Critical (9-12)', text: '-3 to REF. Stun Save at -1. Must roll on Critical Injury Table.' },
    { heading: 'Mortal (13+)', text: '-4 to -10 to REF. Must make Death Save each turn or die.' },
  ]},
  { title: 'Netrunning', sections: [
    { heading: 'Interface', text: 'INT + Interface + 1d10 vs. system Difficulty.' },
    { heading: 'Speed', text: 'Netrunner moves Interface + 1d10 squares per turn in the Net.' },
    { heading: 'Programs', text: 'Each program has a Strength rating used for opposed rolls.' },
  ]},
  { title: 'Improvement Points', sections: [
    { heading: 'Earning IP', text: 'GM awards 1-7 IP per session based on performance.' },
    { heading: 'Raising Skills', text: 'Cost = New Level × current multiplier (in-role ×1, out ×2).' },
    { heading: 'New Skills', text: 'Start at level 1, cost = 1 IP.' },
  ]},
]

export default function CyberpunkForm() {
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
  const [xpLog, setXpLog] = useState([])
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [cyberCategory, setCyberCategory] = useState('all')

  // Dice roller state
  const [diceStatVal, setDiceStatVal] = useState(0)
  const [diceSkillVal, setDiceSkillVal] = useState(0)
  const [diceResult, setDiceResult] = useState(null)
  const [diceHistory, setDiceHistory] = useState([])
  const [damageExpr, setDamageExpr] = useState('3d6')
  const [damageResult, setDamageResult] = useState(null)

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
  function handleNumber(e) { setFields(prev => ({ ...prev, [e.target.name]: Number(e.target.value) || 0 })) }

  async function handleSave() {
    setSaving(true); setSaveError(null)
    try { await updateCharacter(characterId, fields) }
    catch { setSaveError(t('failedToSave')) }
    finally { setSaving(false) }
  }

  async function handleDoneEditing() { await handleSave(); navigate('/cyberpunk') }

  // ── Derived data ──
  const selectedRole = CP_ROLES.find(r => r.value === fields.cpRole)
  const run = fields.cpMa * 3
  const leap = Math.floor(run / 4)
  const lift = fields.cpBody * 40
  const humanity = fields.cpEmp * 10
  const btm = getBTM(fields.cpBody)

  // ── Skills ──
  const skills = parseJson(fields.cpSkills, [])
  function setSkills(next) { handleField('cpSkills', JSON.stringify(next)) }
  function getSkillLevel(skillName) {
    const s = skills.find(sk => sk.name === skillName)
    return s ? s.level : 0
  }
  function setSkillLevel(skillName, level) {
    const idx = skills.findIndex(sk => sk.name === skillName)
    if (idx >= 0) {
      const next = [...skills]
      if (level === 0) { next.splice(idx, 1) } else { next[idx] = { ...next[idx], level } }
      setSkills(next)
    } else if (level > 0) {
      setSkills([...skills, { name: skillName, level }])
    }
  }
  const [customSkillName, setCustomSkillName] = useState('')
  function addCustomSkill() {
    if (!customSkillName.trim()) return
    if (!skills.find(s => s.name === customSkillName.trim())) {
      setSkills([...skills, { name: customSkillName.trim(), level: 1 }])
    }
    setCustomSkillName('')
  }
  // Collect custom skills (not in any default list)
  const allDefaultSkills = new Set(Object.values(CP_SKILLS_BY_STAT).flat())
  const customSkills = skills.filter(s => !allDefaultSkills.has(s.name))

  // ── Cyberware ──
  const cyberware = parseJson(fields.cpCyberware, [])
  function setCyberware(next) { handleField('cpCyberware', JSON.stringify(next)) }
  const totalHumanityLoss = cyberware.reduce((sum, cw) => sum + (cw.humanityCost || 0), 0)

  // ── Weapons ──
  const weapons = parseJson(fields.cpWeapons, [])
  function setWeapons(next) { handleField('cpWeapons', JSON.stringify(next)) }

  // ── Armor ──
  const armor = parseJson(fields.cpArmor, { Head: 0, Torso: 0, 'R.Arm': 0, 'L.Arm': 0, 'R.Leg': 0, 'L.Leg': 0 })
  function setArmorSP(location, val) {
    const next = { ...armor, [location]: Math.max(0, Number(val) || 0) }
    handleField('cpArmor', JSON.stringify(next))
  }

  // ── Gear ──
  const gear = parseJson(fields.cpGear, [])
  function setGear(next) { handleField('cpGear', JSON.stringify(next)) }

  // ── Vehicles ──
  const vehicles = parseJson(fields.cpVehicles, [])
  function setVehicles(next) { handleField('cpVehicles', JSON.stringify(next)) }

  // ── Lifepath ──
  const lifepath = parseJson(fields.cpLifepath, {})
  function setLifepath(next) { handleField('cpLifepath', JSON.stringify(next)) }
  function setLifepathStep(key, val) { setLifepath({ ...lifepath, [key]: val }) }
  function rollLifepathStep(key) {
    const options = CP_LIFEPATH_TABLES[key]
    if (!options || !Array.isArray(options)) return
    const pick = options[Math.floor(Math.random() * options.length)]
    setLifepathStep(key, pick)
  }

  // ── Dice Roller ──
  function rollD10() {
    return Math.floor(Math.random() * 10) + 1
  }

  function handleStatSkillRoll() {
    let roll = rollD10()
    let total = diceStatVal + diceSkillVal
    let note = ''
    if (roll === 1) {
      const fumbleRoll = rollD10()
      total = total - fumbleRoll
      note = `FUMBLE! Rolled 1, then ${fumbleRoll} (subtracted). `
      roll = -fumbleRoll
    } else if (roll === 10) {
      let bonus = 0
      let exploding = roll
      let explosionCount = 0
      while (exploding === 10 && explosionCount < 20) {
        exploding = rollD10()
        bonus += exploding
        explosionCount++
      }
      total = total + 10 + bonus
      note = `CRITICAL! Rolled 10, exploded for +${bonus}. `
      roll = 10 + bonus
    } else {
      total = total + roll
    }
    const entry = { stat: diceStatVal, skill: diceSkillVal, roll, total, note, time: new Date().toLocaleTimeString() }
    setDiceResult(entry)
    setDiceHistory(prev => [entry, ...prev].slice(0, 10))
  }

  function handleDamageRoll() {
    const match = damageExpr.match(/^(\d+)d(\d+)([+-]\d+)?$/i)
    if (!match) { setDamageResult({ error: 'Invalid format. Use NdX or NdX+Y' }); return }
    const count = parseInt(match[1])
    const sides = parseInt(match[2])
    const mod = match[3] ? parseInt(match[3]) : 0
    const rolls = []
    for (let i = 0; i < count; i++) rolls.push(Math.floor(Math.random() * sides) + 1)
    const total = rolls.reduce((s, r) => s + r, 0) + mod
    const entry = { expr: damageExpr, rolls, mod, total, time: new Date().toLocaleTimeString() }
    setDamageResult(entry)
    setDiceHistory(prev => [{ ...entry, note: `Damage: ${damageExpr} = [${rolls.join(',')}]${mod ? (mod > 0 ? '+' : '') + mod : ''} = ${total}`, roll: total, total, stat: 0, skill: 0 }, ...prev].slice(0, 10))
  }

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/cyberpunk')}>{t('back')}</button>
        <h2>{fields.cpHandle || fields.name || 'Cyberpunk Character'}</h2>
        <span className="splat-badge">CP2020</span>
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
      <div hidden={tab !== 0} role="tabpanel">
        <div className="form-section">
          <fieldset>
            <legend>{t('tabCpIdentity')}</legend>
            <div className="field-row">
              <div className="field"><label htmlFor="cp-name">{t('charName')} *</label><input id="cp-name" name="name" value={fields.name} onChange={handleText} /></div>
              <div className="field"><label htmlFor="cp-handle">{t('cpHandle')}</label><input id="cp-handle" name="cpHandle" value={fields.cpHandle} onChange={handleText} placeholder="Street name" /></div>
            </div>
            <div className="field-row">
              <CatalogSelect id="cpRole" name="cpRole" label={t('cpRole')} value={fields.cpRole}
                onChange={handleField} catalog={CP_ROLE_CATALOG} />
            </div>
            {selectedRole && (
              <DotRating label={`${t('cpSpecialAbility')} (${selectedRole.specialAbility})`}
                name="cpSpecialAbility" value={fields.cpSpecialAbility} onChange={handleField} min={0} max={10} />
            )}
            <div className="field">
              <label>{t('concept')}</label>
              <input name="concept" value={fields.concept} onChange={handleText} placeholder="Character concept" />
            </div>
            <div className="field">
              <label>{t('appearanceLabel')}</label>
              <textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={4} style={{ width: '100%' }}
                placeholder="Describe your character's appearance..." />
            </div>
            {selectedRole && (
              <div className="form-section" style={{ padding: 'var(--space-md)', marginTop: 'var(--space-sm)', background: 'rgba(52,152,219,0.08)', borderLeft: '3px solid var(--color-accent-fg)' }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-xs)' }}>{fields.cpRole}</div>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 'var(--space-xs)' }}>{selectedRole.description}</p>
                <p className="muted-hint muted-hint--xs"><strong>{t('cpSpecialAbilityLabel')}</strong> {selectedRole.specialAbility}</p>
              </div>
            )}
          </fieldset>
        </div>
      </div>

      {/* ── Tab 1: Stats ── */}
      <div hidden={tab !== 1} role="tabpanel">
        <div className="form-section">
          <fieldset>
            <legend>{t('tabCpStats')}</legend>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 'var(--space-md)' }}>
              {CP_STATS.map(stat => (
                <div key={stat.key} style={{ textAlign: 'center', padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>{stat.full}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-accent-fg)' }}>{fields[stat.key]}</div>
                  <DotRating label={stat.label} name={stat.key} value={fields[stat.key]} onChange={handleField} min={1} max={10} />
                </div>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('cpDerivedValues')}</legend>
            <div role="status" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-sm)' }}>
              <div style={{ padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                <strong>{t('cpRun')}:</strong> {run} yards/turn
              </div>
              <div style={{ padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                <strong>{t('cpLeap')}:</strong> {leap} yards
              </div>
              <div style={{ padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                <strong>{t('cpLift')}:</strong> {lift} lbs
              </div>
              <div style={{ padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                <strong>{t('cpHumanity')}:</strong> {humanity}
              </div>
              <div style={{ padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                <strong>{t('cpSaveNumber')}:</strong> {fields.cpBody}
              </div>
              <div style={{ padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                <strong>{t('cpBtm')}:</strong> {btm}
              </div>
            </div>
            <div className="field-row" style={{ marginTop: 'var(--space-md)' }}>
              <div className="field">
                <label>{t('cpCurrentHumanity')}</label>
                <input type="number" name="cpCurrentHumanity" min={0} max={humanity}
                  value={fields.cpCurrentHumanity} onChange={handleNumber} />
                <span className="muted-hint muted-hint--xs">Max: {humanity} | Lost to cyberware: {totalHumanityLoss}</span>
              </div>
            </div>
            {fields.cpCurrentHumanity <= 0 && fields.cpCurrentHumanity !== undefined && (
              <div role="alert" aria-live="assertive" aria-atomic="true" style={{ marginTop: 'var(--space-sm)', padding: 'var(--space-sm)', background: 'rgba(231,76,60,0.2)', border: '2px solid #e74c3c', borderRadius: '6px', fontWeight: 700, color: '#e74c3c', fontSize: '1rem', textAlign: 'center' }}>
                CYBERPSYCHO — Character lost
              </div>
            )}
            {fields.cpCurrentHumanity > 0 && fields.cpCurrentHumanity < 3 && (
              <div role="alert" aria-live="assertive" aria-atomic="true" style={{ marginTop: 'var(--space-sm)', padding: 'var(--space-sm)', background: 'rgba(231,76,60,0.15)', border: '2px solid #e74c3c', borderRadius: '6px', fontWeight: 700, color: '#e74c3c' }}>
                Critical: Extreme cyberpsychosis risk (Humanity {fields.cpCurrentHumanity})
              </div>
            )}
            {fields.cpCurrentHumanity >= 3 && fields.cpCurrentHumanity < 5 && (
              <div role="alert" aria-live="assertive" aria-atomic="true" style={{ marginTop: 'var(--space-sm)', padding: 'var(--space-sm)', background: 'rgba(243,156,18,0.15)', border: '2px solid #f39c12', borderRadius: '6px', fontWeight: 600, color: '#f39c12' }}>
                Warning: Cyberpsychosis risk (Humanity {fields.cpCurrentHumanity})
              </div>
            )}
          </fieldset>
        </div>
      </div>

      {/* ── Tab 2: Skills ── */}
      <div hidden={tab !== 2} role="tabpanel">
        <div className="form-section">
          {Object.entries(CP_SKILLS_BY_STAT).map(([statLabel, skillList]) => (
            <fieldset key={statLabel}>
              <legend>{statLabel} {t('cpSkillsLabel')}</legend>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {skillList.map(skillName => (
                  <div key={skillName} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: '2px 0', borderBottom: '1px solid var(--color-border)' }}>
                    <span style={{ flex: 1, fontSize: '0.85rem' }}>{skillName}</span>
                    <DotRating label="" name={skillName} value={getSkillLevel(skillName)}
                      onChange={(_, val) => setSkillLevel(skillName, val)} min={0} max={10} />
                  </div>
                ))}
              </div>
            </fieldset>
          ))}
          <fieldset>
            <legend>{t('cpCustomSkills')}</legend>
            {customSkills.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: '2px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ flex: 1, fontSize: '0.85rem' }}>{s.name}</span>
                <DotRating label="" name={s.name} value={s.level}
                  onChange={(_, val) => setSkillLevel(s.name, val)} min={0} max={10} />
                <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                  onClick={() => setSkills(skills.filter(sk => sk.name !== s.name))}>Remove</button>
              </div>
            ))}
            <div className="field-row" style={{ marginTop: 'var(--space-sm)' }}>
              <div className="field" style={{ flex: 1 }}>
                <input type="text" value={customSkillName} onChange={e => setCustomSkillName(e.target.value)}
                  placeholder="Custom skill name..." onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkill() } }} />
              </div>
              <button className="btn btn-secondary" onClick={addCustomSkill}>{t('cpAddSkill')}</button>
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Tab 3: Cyberware ── */}
      <div hidden={tab !== 3} role="tabpanel">
        <div className="form-section">
          <fieldset>
            <legend>{t('tabCpCyberware')}</legend>
            <div style={{ padding: 'var(--space-sm)', marginBottom: 'var(--space-md)', background: 'rgba(231,76,60,0.1)', borderRadius: '4px', fontWeight: 600 }}>
              {t('cpTotalHumanityLoss')}: <span style={{ color: totalHumanityLoss > 0 ? '#e55' : '#8c8' }}>{totalHumanityLoss}</span>
              {' '} | {t('cpEffectiveHumanity')}: {Math.max(0, humanity - totalHumanityLoss)}
              {' '} | {t('cpCurrentHumanity')}: <span style={{ fontWeight: 700, color: fields.cpCurrentHumanity < 5 ? '#e55' : '#8c8' }}>{fields.cpCurrentHumanity}</span>
            </div>
            {fields.cpCurrentHumanity <= 0 && (
              <div role="alert" aria-live="assertive" aria-atomic="true" style={{ padding: 'var(--space-sm)', marginBottom: 'var(--space-sm)', background: 'rgba(231,76,60,0.2)', border: '2px solid #e74c3c', borderRadius: '6px', fontWeight: 700, color: '#e74c3c', textAlign: 'center' }}>
                CYBERPSYCHO — Character lost
              </div>
            )}
            {fields.cpCurrentHumanity > 0 && fields.cpCurrentHumanity < 3 && (
              <div role="alert" aria-live="assertive" aria-atomic="true" style={{ padding: 'var(--space-sm)', marginBottom: 'var(--space-sm)', background: 'rgba(231,76,60,0.15)', border: '2px solid #e74c3c', borderRadius: '6px', fontWeight: 700, color: '#e74c3c' }}>
                Critical: Extreme cyberpsychosis risk (Humanity {fields.cpCurrentHumanity})
              </div>
            )}
            {fields.cpCurrentHumanity >= 3 && fields.cpCurrentHumanity < 5 && (
              <div role="alert" aria-live="assertive" aria-atomic="true" style={{ padding: 'var(--space-sm)', marginBottom: 'var(--space-sm)', background: 'rgba(243,156,18,0.15)', border: '2px solid #f39c12', borderRadius: '6px', fontWeight: 600, color: '#f39c12' }}>
                Warning: Cyberpsychosis risk (Humanity {fields.cpCurrentHumanity})
              </div>
            )}
            <div style={{ marginBottom: 'var(--space-sm)' }}>
              <label htmlFor="cyber-category" style={{ marginRight: 'var(--space-xs)', fontSize: '0.85rem' }}>{t('cpFilterCategory')}</label>
              <select id="cyber-category" value={cyberCategory} onChange={e => setCyberCategory(e.target.value)} style={{ fontSize: '0.85rem' }}>
                <option value="all">{t('filterAll')}</option>
                {[...new Set(CP_CYBERWARE.map(c => c.category))].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <CatalogSelect id="cpCyberwareAdd" name="cpCyberwareAdd" label={t('cpAddCyberware')}
              value="" onChange={(_, val) => {
                if (!val) return
                const item = CP_CYBERWARE.find(c => c.name === val)
                if (item) setCyberware([...cyberware, { name: item.name, category: item.category, humanityCost: item.humanityCost }])
              }} catalog={cyberCategory === 'all' ? CP_CYBERWARE_CATALOG : CP_CYBERWARE_CATALOG.filter((_, i) => CP_CYBERWARE[i].category === cyberCategory)} showDescOnSelect={false} />
            {cyberware.length > 0 && (
              <div style={{ marginTop: 'var(--space-md)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 80px 60px', gap: '4px', fontWeight: 700, fontSize: '0.75rem', padding: '0 0 4px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <span>Name</span><span>Category</span><span>HL Cost</span><span></span>
                </div>
                {cyberware.map((cw, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 80px 60px', gap: '4px', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid var(--color-border)', fontSize: '0.85rem' }}>
                    <span>{cw.name}</span>
                    <span style={{ color: 'var(--color-text-muted)' }}>{cw.category}</span>
                    <span style={{ color: '#e55', fontWeight: 600 }}>{cw.humanityCost}</span>
                    <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                      onClick={() => setCyberware(cyberware.filter((_, j) => j !== i))}>Remove</button>
                  </div>
                ))}
              </div>
            )}
            <div className="field" style={{ marginTop: 'var(--space-md)' }}>
              <label>{t('cpCyberwareNotes')}</label>
              <textarea name="notes_cyber" value={fields.cpContacts} onChange={e => handleField('cpContacts', e.target.value)}
                rows={3} style={{ width: '100%' }} placeholder="Options, modifications, notes..." />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Tab 4: Combat ── */}
      <div hidden={tab !== 4} role="tabpanel">
        <div className="form-section">
          <fieldset>
            <legend>{t('cpDerivedValues')} — {t('tabCpCombat')}</legend>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
              <div style={{ padding: 'var(--space-sm)', border: '2px solid var(--color-accent-fg)', borderRadius: '8px', textAlign: 'center', background: 'rgba(52,152,219,0.08)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>{t('cpBtm')}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-accent-fg)' }}>{btm}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>BODY {fields.cpBody}</div>
              </div>
              <div style={{ padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>{t('cpRun')}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{run} yds</div>
              </div>
              <div style={{ padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>{t('cpLeap')}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{leap} yds</div>
              </div>
              <div style={{ padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>{t('cpLift')}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{lift} lbs</div>
              </div>
              <div style={{ padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>{t('cpSaveNumber')}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{fields.cpBody}</div>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('cpArmor')} — {t('cpStoppingPowerByLocation')}</legend>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 'var(--space-sm)' }}>
              {BODY_LOCATIONS.map(loc => (
                <div key={loc} className="field" style={{ textAlign: 'center' }}>
                  <label style={{ fontSize: '0.8rem' }}>{loc}</label>
                  <input type="number" min={0} value={armor[loc] || 0}
                    onChange={e => setArmorSP(loc, e.target.value)}
                    style={{ width: '60px', textAlign: 'center' }} />
                </div>
              ))}
            </div>
            <p className="muted-hint muted-hint--xs" style={{ marginTop: 'var(--space-sm)' }}>
              Reference: Kevlar T-Shirt SP 10, Light Armor Jacket SP 14, MetalGear SP 25
            </p>
          </fieldset>

          <fieldset>
            <legend>{t('cpWeapons')}</legend>
            <CatalogSelect id="cpWeaponAdd" name="cpWeaponAdd" label={t('cpAddWeapon')}
              value="" onChange={(_, val) => {
                if (!val) return
                const item = CP_WEAPONS.find(w => w.name === val)
                if (item) setWeapons([...weapons, { name: item.name, type: item.type, damage: item.damage, shots: item.shots, rof: item.rof, range: item.range || 0 }])
              }} catalog={CP_WEAPONS_CATALOG} showDescOnSelect={false} />
            {weapons.length > 0 && (
              <div style={{ marginTop: 'var(--space-md)', overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                      <th style={{ padding: '0.4rem' }}>Weapon</th>
                      <th style={{ padding: '0.4rem' }}>Type</th>
                      <th style={{ padding: '0.4rem' }}>Damage</th>
                      <th style={{ padding: '0.4rem' }}>Shots</th>
                      <th style={{ padding: '0.4rem' }}>ROF</th>
                      <th style={{ padding: '0.4rem' }}>Range</th>
                      <th style={{ padding: '0.4rem' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {weapons.map((w, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '0.4rem', fontWeight: 600 }}>{w.name}</td>
                        <td style={{ padding: '0.4rem' }}>{w.type}</td>
                        <td style={{ padding: '0.4rem', color: 'var(--color-accent-fg)' }}>{w.damage}</td>
                        <td style={{ padding: '0.4rem' }}>{w.shots || '-'}</td>
                        <td style={{ padding: '0.4rem' }}>{w.rof || '-'}</td>
                        <td style={{ padding: '0.4rem' }}>{w.range}m</td>
                        <td style={{ padding: '0.4rem' }}>
                          <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                            onClick={() => setWeapons(weapons.filter((_, j) => j !== i))}>Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </fieldset>

          <fieldset>
            <legend>{t('cpWoundState')} — {t('cpWoundTrack')}</legend>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
              {WOUND_STATES.map(ws => (
                <button key={ws.level}
                  className={`btn ${fields.cpWoundState === ws.level ? 'btn-primary' : 'btn-secondary'}`}
                  aria-label={`${ws.label}${ws.penalty !== 0 ? ' ' + ws.penalty : ''}`}
                  aria-pressed={fields.cpWoundState === ws.level}
                  style={{
                    padding: '6px 12px', fontSize: '0.8rem',
                    background: fields.cpWoundState === ws.level
                      ? (ws.level === 0 ? '#2ecc71' : ws.level <= 2 ? '#f39c12' : '#f44336')
                      : undefined,
                    color: fields.cpWoundState === ws.level ? '#fff' : undefined,
                  }}
                  onClick={() => handleField('cpWoundState', ws.level)}
                >
                  {ws.label} {ws.penalty !== 0 ? ws.penalty : ''}
                </button>
              ))}
            </div>
            {fields.cpWoundState > 0 && (
              <div role="status" aria-live="polite" style={{ marginTop: 'var(--space-sm)', padding: 'var(--space-sm)', border: '2px solid', borderColor: fields.cpWoundState >= 4 ? '#e74c3c' : fields.cpWoundState >= 3 ? '#e67e22' : '#f39c12', borderRadius: '8px', background: fields.cpWoundState >= 4 ? 'rgba(231,76,60,0.1)' : fields.cpWoundState >= 3 ? 'rgba(230,126,34,0.1)' : 'rgba(243,156,18,0.1)' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: fields.cpWoundState >= 4 ? '#e74c3c' : fields.cpWoundState >= 3 ? '#e67e22' : '#f39c12' }}>
                  {WOUND_STATES[fields.cpWoundState]?.label}: {WOUND_STATES[fields.cpWoundState]?.penalty || 0} REF {t('cpToAllActions')}
                </div>
                <div style={{ fontSize: '0.85rem', marginTop: '4px', color: 'var(--color-text-muted)' }}>
                  {fields.cpWoundState === 1 && 'Light wound. -1 REF penalty to all actions.'}
                  {fields.cpWoundState === 2 && 'Serious wound. -2 REF penalty to all actions. Must make Stun Save (BODY) or be stunned for 1 round.'}
                  {fields.cpWoundState === 3 && 'Critical wound. -3 REF penalty. Must make Stun Save each round at -1 or be stunned.'}
                  {fields.cpWoundState >= 4 && `Mortal wound. ${WOUND_STATES[fields.cpWoundState]?.penalty} REF penalty. Must make Death Save (BODY) each round or die. Stun Save at -${fields.cpWoundState - 2}.`}
                </div>
              </div>
            )}
          </fieldset>
        </div>
      </div>

      {/* ── Tab 5: Gear ── */}
      <div hidden={tab !== 5} role="tabpanel">
        <div className="form-section">
          <fieldset>
            <legend>{t('cpEurodollars')}</legend>
            <div className="field-row">
              <div className="field" style={{ textAlign: 'center' }}>
                <label>{t('cpEurodollars')} (eb)</label>
                <input type="number" name="cpEurodollars" min={0} value={fields.cpEurodollars} onChange={handleNumber} style={{ width: '120px', textAlign: 'center' }} />
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('cpGear')}</legend>
            <CatalogSelect id="cpGearAdd" name="cpGearAdd" label={t('cpAddGear')}
              value="" onChange={(_, val) => {
                if (!val) return
                const item = CP_GEAR.find(g => g.name === val)
                if (item) setGear([...gear, { name: item.name, description: item.description, cost: item.costEb }])
              }} catalog={CP_GEAR_CATALOG} showDescOnSelect={false} />
            {gear.length > 0 && (
              <div style={{ marginTop: 'var(--space-md)' }}>
                {gear.map((g, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: '0.85rem' }}>
                      <strong>{g.name}</strong>
                      <span className="muted-hint muted-hint--xs"> {g.description} {g.cost ? `(${g.cost} eb)` : ''}</span>
                    </span>
                    <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                      onClick={() => setGear(gear.filter((_, j) => j !== i))}>Drop</button>
                  </div>
                ))}
              </div>
            )}
          </fieldset>
        </div>
      </div>

      {/* ── Tab 6: Vehicles ── */}
      <div hidden={tab !== 6} role="tabpanel">
        <div className="form-section">
          <fieldset>
            <legend>{t('cpVehicles')}</legend>
            <CatalogSelect id="cpVehicleAdd" name="cpVehicleAdd" label={t('cpAddVehicle')}
              value="" onChange={(_, v) => {
                const veh = CP_VEHICLES.find(x => x.name === v)
                if (veh) setVehicles([...vehicles, { name: veh.name, type: veh.type, topSpeed: veh.topSpeed, maneuver: veh.maneuver, sdp: veh.sdp, sp: veh.sp, seats: veh.seats, costEb: veh.costEb }])
              }}
              catalog={CP_VEHICLES_CATALOG} showDescOnSelect={false} />
            {vehicles.length === 0 && <p className="muted-hint" style={{ marginTop: 'var(--space-sm)' }}>{t('cpNoVehiclesYet')}</p>}
            {vehicles.length > 0 && (
              <div style={{ marginTop: 'var(--space-sm)' }}>
                {vehicles.map((v, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: 'var(--space-xs) 0', borderBottom: '1px solid var(--color-border, #333)' }}>
                    <span style={{ flex: 1, fontWeight: 600, fontSize: '0.88rem' }}>{v.name}</span>
                    <span className="muted-hint muted-hint--xs">{v.type}</span>
                    <span className="muted-hint muted-hint--xs">Speed {v.topSpeed}</span>
                    <span className="muted-hint muted-hint--xs">SP{v.sp}</span>
                    <span className="muted-hint muted-hint--xs">SDP {v.sdp}</span>
                    <span className="muted-hint muted-hint--xs">Seats {v.seats}</span>
                    <span className="muted-hint muted-hint--xs">{v.costEb}eb</span>
                    <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                      onClick={() => setVehicles(vehicles.filter((_, j) => j !== i))}>{t('deleteBtn')}</button>
                  </div>
                ))}
              </div>
            )}
          </fieldset>
        </div>
      </div>

      {/* ── Tab 7: Lifepath ── */}
      <div hidden={tab !== 7} role="tabpanel">
        <div className="form-section">
          <fieldset>
            <legend>{t('cpLifepath')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-md)' }}>
              Choose or roll randomly for each lifepath step to flesh out your character's background.
            </p>
            {Object.entries(CP_LIFEPATH_TABLES).map(([key, options]) => (
              <div key={key} style={{ marginBottom: 'var(--space-md)', padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
                  <label style={{ fontWeight: 700, fontSize: '0.9rem' }}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim()}</label>
                  <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    onClick={() => rollLifepathStep(key)}>{t('cpRollRandom')}</button>
                </div>
                <select value={lifepath[key] || ''} onChange={e => setLifepathStep(key, e.target.value)}
                  style={{ width: '100%' }}>
                  <option value="">-- Select --</option>
                  {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}
            <button className="btn btn-secondary" style={{ marginTop: 'var(--space-sm)' }}
              onClick={() => {
                Object.keys(CP_LIFEPATH_TABLES).forEach(key => rollLifepathStep(key))
              }}>{t('cpRollAllRandom')}</button>
          </fieldset>
        </div>
      </div>

      {/* ── Tab 8: Backstory ── */}
      <div hidden={tab !== 8} role="tabpanel">
        <div className="form-section">
          <fieldset>
            <legend>{t('backstoryLabel')}</legend>
            <textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} style={{ width: '100%' }}
              placeholder="Your character's backstory..." />
          </fieldset>
          <fieldset>
            <legend>{t('notes')}</legend>
            <textarea name="notes" value={fields.notes} onChange={handleText} rows={4} style={{ width: '100%' }}
              placeholder="Session notes, contacts, etc..." />
          </fieldset>
        </div>
      </div>

      {/* ── Tab 9: IP Log ── */}
      <div hidden={tab !== 9} role="tabpanel">
        <XpLogSection splat="cyberpunk" xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)} t={t} />
      </div>

      {/* ── Tab 10: Dice Roller ── */}
      <div hidden={tab !== 10} role="tabpanel">
        <div className="form-section">
          <fieldset>
            <legend>{t('cpStatSkillD10')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Standard CP2020 check: STAT + Skill + 1d10 vs. Difficulty. Fumble on 1, Critical on 10 (exploding).
            </p>
            <div className="field-row">
              <div className="field">
                <label htmlFor="dice-stat-val">{t('cpStatValue')}</label>
                <input id="dice-stat-val" type="number" min={0} max={10} value={diceStatVal} onChange={e => setDiceStatVal(Number(e.target.value) || 0)} style={{ width: '70px', textAlign: 'center' }} />
              </div>
              <div className="field">
                <label htmlFor="dice-skill-val">{t('cpSkillValue')}</label>
                <input id="dice-skill-val" type="number" min={0} max={10} value={diceSkillVal} onChange={e => setDiceSkillVal(Number(e.target.value) || 0)} style={{ width: '70px', textAlign: 'center' }} />
              </div>
              <button className="btn btn-primary" style={{ alignSelf: 'flex-end' }} onClick={handleStatSkillRoll}>{t('cpRollD10')}</button>
            </div>
            {diceResult && (
              <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', border: '2px solid var(--color-accent-fg)', borderRadius: '8px', background: 'rgba(52,152,219,0.08)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-accent-fg)' }}>
                  {t('cpTotal')}: {diceResult.total}
                </div>
                <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                  Stat ({diceResult.stat}) + Skill ({diceResult.skill}) + Roll ({diceResult.roll}) = {diceResult.total}
                </div>
                {diceResult.note && <div style={{ color: diceResult.roll < 0 ? '#e55' : '#2ecc71', fontWeight: 600, marginTop: '4px' }}>{diceResult.note}</div>}
              </div>
            )}
          </fieldset>

          <fieldset>
            <legend>{t('cpDamageRoller')}</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="dice-expr">{t('cpDiceExpression')}</label>
                <input id="dice-expr" type="text" value={damageExpr} onChange={e => setDamageExpr(e.target.value)}
                  placeholder="e.g. 3d6+2" style={{ width: '120px' }}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleDamageRoll() } }} />
              </div>
              <button className="btn btn-primary" style={{ alignSelf: 'flex-end' }} onClick={handleDamageRoll}>{t('cpRollDamage')}</button>
            </div>
            {damageResult && !damageResult.error && (
              <div style={{ marginTop: 'var(--space-sm)', padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                <strong>{damageResult.expr}:</strong> [{damageResult.rolls.join(', ')}]{damageResult.mod ? (damageResult.mod > 0 ? '+' : '') + damageResult.mod : ''} = <span style={{ fontWeight: 700, color: 'var(--color-accent-fg)' }}>{damageResult.total}</span>
              </div>
            )}
            {damageResult?.error && (
              <p className="status-error" style={{ marginTop: 'var(--space-sm)' }}>{damageResult.error}</p>
            )}
          </fieldset>

          <fieldset>
            <legend>{t('cpRollHistory')}</legend>
            {diceHistory.length === 0 && <p className="muted-hint">{t('cpNoRollsYet')}</p>}
            {diceHistory.map((h, i) => (
              <div key={i} style={{ padding: '4px 0', borderBottom: '1px solid var(--color-border)', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>{h.time}</span>{' '}
                {h.note || `Stat(${h.stat}) + Skill(${h.skill}) + Roll(${h.roll}) = ${h.total}`}
              </div>
            ))}
          </fieldset>
        </div>
      </div>

      {/* ── Tab 11: Rules Reference ── */}
      <div hidden={tab !== 11} role="tabpanel">
        <RulesReferenceTab rules={CP_RULES} title="Cyberpunk 2020 Rules Reference" />
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => setShowExport(true)}>{t('exportPdf')}</button>
        <button className="btn btn-secondary" onClick={() => navigate('/cyberpunk')}>{t('cancel')}</button>
        <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>{saving ? t('saving') : t('quickSave')}</button>
        <button className="btn btn-primary" onClick={handleDoneEditing} disabled={saving}>{t('doneEditing')}</button>
      </div>
      {viewMode && (
        <div className="view-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/cyberpunk')}>{t('back')}</button>
          <button className="btn btn-primary" onClick={() => navigate(`/characters/${characterId}`, { replace: true })}>{t('edit')}</button>
        </div>
      )}
      <ExportModal open={showExport} onClose={() => setShowExport(false)} tabKeys={TAB_KEYS} t={t} />
    </div>
  )
}
