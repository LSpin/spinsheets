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
import SaveButton from './SaveButton'

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

  // IP calculator state
  const [ipCurrentLevel, setIpCurrentLevel] = useState(0)
  const [ipTargetLevel, setIpTargetLevel] = useState(1)
  const [ipIsCareer, setIpIsCareer] = useState(true)
  const [ipCalcOpen, setIpCalcOpen] = useState(false)

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
    catch(e) { setSaveError(t('failedToSave')); throw e }
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
              <textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={4} className="w-full" 
                placeholder="Describe your character's appearance..." />
            </div>
            {selectedRole && (
              <div className="form-section p-md mt-sm" style={{ background: 'rgba(52,152,219,0.08)', borderLeft: '3px solid var(--color-accent-fg)' }}>
                <div className="text-lg font-bold mb-xs" >{fields.cpRole}</div>
                <p className="text-base lh-normal mb-xs" >{selectedRole.description}</p>
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
            <div className="grid gap-md" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
              {CP_STATS.map(stat => (
                <div key={stat.key} className="text-center p-sm border" style={{ borderRadius: '8px' }}>
                  <div className="font-bold text-base" style={{ marginBottom: '4px' }}>{stat.full}</div>
                  <div className="font-bold text-accent" style={{ fontSize: '1.5rem' }}>{fields[stat.key]}</div>
                  <DotRating label={stat.label} name={stat.key} value={fields[stat.key]} onChange={handleField} min={1} max={10} />
                </div>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('cpDerivedValues')}</legend>
            <div role="status" className="grid gap-sm" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              <div className="p-sm border" style={{ borderRadius: '4px' }}>
                <strong>{t('cpRun')}:</strong> {run} yards/turn
              </div>
              <div className="p-sm border" style={{ borderRadius: '4px' }}>
                <strong>{t('cpLeap')}:</strong> {leap} yards
              </div>
              <div className="p-sm border" style={{ borderRadius: '4px' }}>
                <strong>{t('cpLift')}:</strong> {lift} lbs
              </div>
              <div className="p-sm border" style={{ borderRadius: '4px' }}>
                <strong>{t('cpHumanity')}:</strong> {humanity}
              </div>
              <div className="p-sm border" style={{ borderRadius: '4px' }}>
                <strong>{t('cpSaveNumber')}:</strong> {fields.cpBody}
              </div>
              <div className="p-sm border" style={{ borderRadius: '4px' }}>
                <strong>{t('cpBtm')}:</strong> {btm}
              </div>
            </div>
            <div className="field-row mt-md" >
              <div className="field">
                <label>{t('cpCurrentHumanity')}</label>
                <input type="number" name="cpCurrentHumanity" min={0} max={humanity}
                  value={fields.cpCurrentHumanity} onChange={handleNumber} />
                <span className="muted-hint muted-hint--xs">Max: {humanity} | Lost to cyberware: {totalHumanityLoss}</span>
              </div>
            </div>
            {/* Humanity Remaining Counter */}
            <div role="status" aria-live="polite" aria-atomic="true" className="mt-md p-md" style={{ border: '2px solid var(--color-accent-fg)', borderRadius: '8px', background: 'rgba(52,152,219,0.06)' }}>
              <div className="flex justify-between items-center mb-sm" >
                <span className="text-xl font-bold" >Humanity Remaining: {fields.cpCurrentHumanity} / {humanity}</span>
                <span className="text-base text-muted" >Empathy {fields.cpEmp} x 10 = {humanity}</span>
              </div>
              <div className="w-full bg-raised border" style={{ height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{
                  width: `${humanity > 0 ? Math.max(0, Math.min(100, (fields.cpCurrentHumanity / humanity) * 100)) : 0}%`,
                  height: '100%',
                  borderRadius: '6px',
                  transition: 'width 0.3s ease, background 0.3s ease',
                  background: fields.cpCurrentHumanity <= 0 ? '#e74c3c'
                    : fields.cpCurrentHumanity < 5 ? '#e74c3c'
                    : fields.cpCurrentHumanity < 10 ? '#f39c12'
                    : '#2ecc71',
                }} />
              </div>
              <div className="mt-xs text-base text-muted" >
                {fields.cpCurrentHumanity > 0
                  ? `${fields.cpCurrentHumanity} points of cyberware away from cyberpsychosis threshold.`
                  : 'Cyberpsychosis threshold reached!'}
              </div>
            </div>
            {fields.cpCurrentHumanity <= 0 && fields.cpCurrentHumanity !== undefined && (
              <div role="alert" aria-live="assertive" aria-atomic="true" className="mt-sm p-sm font-bold text-lg text-center" style={{ background: 'rgba(231,76,60,0.2)', border: '2px solid #e74c3c', borderRadius: '6px', color: '#e74c3c' }}>
                CYBERPSYCHO — Character lost
              </div>
            )}
            {fields.cpCurrentHumanity > 0 && fields.cpCurrentHumanity < 3 && (
              <div role="alert" aria-live="assertive" aria-atomic="true" className="mt-sm p-sm font-bold" style={{ background: 'rgba(231,76,60,0.15)', border: '2px solid #e74c3c', borderRadius: '6px', color: '#e74c3c' }}>
                Critical: Extreme cyberpsychosis risk (Humanity {fields.cpCurrentHumanity})
              </div>
            )}
            {fields.cpCurrentHumanity >= 3 && fields.cpCurrentHumanity < 5 && (
              <div role="alert" aria-live="assertive" aria-atomic="true" className="mt-sm p-sm font-semibold" style={{ background: 'rgba(243,156,18,0.15)', border: '2px solid #f39c12', borderRadius: '6px', color: '#f39c12' }}>
                Warning: Cyberpsychosis risk (Humanity {fields.cpCurrentHumanity})
              </div>
            )}
          </fieldset>
          {/* IP Cost Calculator */}
          <details open={ipCalcOpen} onToggle={e => setIpCalcOpen(e.target.open)}>
            <summary className="cursor-pointer font-bold text-accent" style={{ fontSize: '0.95rem', padding: 'var(--space-sm) 0' }}>
              IP Cost Calculator
            </summary>
            <div className="p-md border" style={{ borderRadius: '8px', background: 'rgba(52,152,219,0.04)' }}>
              <div className="mb-sm text-base text-muted" >
                <strong>IP Cost Formula:</strong><br />
                Same career skill: New Level x 1 IP<br />
                Different career skill: New Level x 2 IP
              </div>
              <div className="field-row items-end gap-md" >
                <div className="field">
                  <label htmlFor="ip-current" className="text-base" >Current Level</label>
                  <select id="ip-current" value={ipCurrentLevel} onChange={e => { const v = Number(e.target.value); setIpCurrentLevel(v); if (ipTargetLevel <= v) setIpTargetLevel(v + 1) }}>
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="ip-target" className="text-base" >Target Level</label>
                  <select id="ip-target" value={ipTargetLevel} onChange={e => setIpTargetLevel(Number(e.target.value))}>
                    {Array.from({ length: 10 - ipCurrentLevel }, (_, i) => (
                      <option key={i + ipCurrentLevel + 1} value={i + ipCurrentLevel + 1}>{i + ipCurrentLevel + 1}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label className="text-base" >Skill Type</label>
                  <div className="flex gap-sm" >
                    <label className="flex items-center text-base" style={{ gap: '4px' }}>
                      <input type="radio" name="ipCareer" checked={ipIsCareer} onChange={() => setIpIsCareer(true)} /> Career
                    </label>
                    <label className="flex items-center text-base" style={{ gap: '4px' }}>
                      <input type="radio" name="ipCareer" checked={!ipIsCareer} onChange={() => setIpIsCareer(false)} /> Non-career
                    </label>
                  </div>
                </div>
              </div>
              <div role="status" aria-live="polite" aria-atomic="true" className="mt-md p-sm text-center" style={{ border: '2px solid var(--color-accent-fg)', borderRadius: '8px', background: 'rgba(52,152,219,0.08)' }}>
                <div className="text-base text-muted" style={{ marginBottom: '4px' }}>
                  Level {ipCurrentLevel} → {ipTargetLevel} ({ipIsCareer ? 'Career' : 'Non-career'})
                </div>
                <div className="font-bold text-accent" style={{ fontSize: '1.4rem' }}>
                  {(() => {
                    const mult = ipIsCareer ? 1 : 2
                    let total = 0
                    for (let lvl = ipCurrentLevel + 1; lvl <= ipTargetLevel; lvl++) total += lvl * mult
                    return total
                  })()} IP
                </div>
                <div className="text-sm text-muted" style={{ marginTop: '4px' }}>
                  {(() => {
                    const mult = ipIsCareer ? 1 : 2
                    const parts = []
                    for (let lvl = ipCurrentLevel + 1; lvl <= ipTargetLevel; lvl++) parts.push(`${lvl}x${mult}`)
                    return parts.join(' + ')
                  })()}
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>

      {/* ── Tab 2: Skills ── */}
      <div hidden={tab !== 2} role="tabpanel">
        <div className="form-section">
          {Object.entries(CP_SKILLS_BY_STAT).map(([statLabel, skillList]) => (
            <fieldset key={statLabel}>
              <legend>{statLabel} {t('cpSkillsLabel')}</legend>
              <div className="flex-col" style={{ gap: '2px' }}>
                {skillList.map(skillName => (
                  <div key={skillName} className="flex items-center gap-sm border-b" style={{ padding: '2px 0' }}>
                    <span className="flex-1 text-base" >{skillName}</span>
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
              <div key={s.name} className="flex items-center gap-sm border-b" style={{ padding: '2px 0' }}>
                <span className="flex-1 text-base" >{s.name}</span>
                <DotRating label="" name={s.name} value={s.level}
                  onChange={(_, val) => setSkillLevel(s.name, val)} min={0} max={10} />
                <button className="btn btn-secondary text-sm" style={{ padding: '2px 8px' }}
                  onClick={() => setSkills(skills.filter(sk => sk.name !== s.name))}>Remove</button>
              </div>
            ))}
            <div className="field-row mt-sm" >
              <div className="field flex-1" >
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
            <div className="p-sm mb-md font-semibold" style={{ background: 'rgba(231,76,60,0.1)', borderRadius: '4px' }}>
              {t('cpTotalHumanityLoss')}: <span style={{ color: totalHumanityLoss > 0 ? '#e55' : '#8c8' }}>{totalHumanityLoss}</span>
              {' '} | {t('cpEffectiveHumanity')}: {Math.max(0, humanity - totalHumanityLoss)}
              {' '} | {t('cpCurrentHumanity')}: <span className="font-bold" style={{ color: fields.cpCurrentHumanity < 5 ? '#e55' : '#8c8' }}>{fields.cpCurrentHumanity}</span>
            </div>
            {fields.cpCurrentHumanity <= 0 && (
              <div role="alert" aria-live="assertive" aria-atomic="true" className="p-sm mb-sm font-bold text-center" style={{ background: 'rgba(231,76,60,0.2)', border: '2px solid #e74c3c', borderRadius: '6px', color: '#e74c3c' }}>
                CYBERPSYCHO — Character lost
              </div>
            )}
            {fields.cpCurrentHumanity > 0 && fields.cpCurrentHumanity < 3 && (
              <div role="alert" aria-live="assertive" aria-atomic="true" className="p-sm mb-sm font-bold" style={{ background: 'rgba(231,76,60,0.15)', border: '2px solid #e74c3c', borderRadius: '6px', color: '#e74c3c' }}>
                Critical: Extreme cyberpsychosis risk (Humanity {fields.cpCurrentHumanity})
              </div>
            )}
            {fields.cpCurrentHumanity >= 3 && fields.cpCurrentHumanity < 5 && (
              <div role="alert" aria-live="assertive" aria-atomic="true" className="p-sm mb-sm font-semibold" style={{ background: 'rgba(243,156,18,0.15)', border: '2px solid #f39c12', borderRadius: '6px', color: '#f39c12' }}>
                Warning: Cyberpsychosis risk (Humanity {fields.cpCurrentHumanity})
              </div>
            )}
            <div className="mb-sm" >
              <label htmlFor="cyber-category" className="text-base" style={{ marginRight: 'var(--space-xs)' }}>{t('cpFilterCategory')}</label>
              <select id="cyber-category" value={cyberCategory} onChange={e => setCyberCategory(e.target.value)} className="text-base" >
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
              <div className="mt-md" >
                <div className="grid font-bold text-sm border-b" style={{ gridTemplateColumns: '1fr 120px 80px 60px', gap: '4px', padding: '0 0 4px 0' }}>
                  <span>Name</span><span>Category</span><span>HL Cost</span><span></span>
                </div>
                {cyberware.map((cw, i) => (
                  <div key={i} className="grid items-center border-b text-base" style={{ gridTemplateColumns: '1fr 120px 80px 60px', gap: '4px', padding: '4px 0' }}>
                    <span>{cw.name}</span>
                    <span className="text-muted" >{cw.category}</span>
                    <span className="font-semibold" style={{ color: '#e55' }}>{cw.humanityCost}</span>
                    <button className="btn btn-secondary text-sm" style={{ padding: '2px 8px' }}
                      onClick={() => setCyberware(cyberware.filter((_, j) => j !== i))}>Remove</button>
                  </div>
                ))}
              </div>
            )}
            <div className="field mt-md" >
              <label>{t('cpCyberwareNotes')}</label>
              <textarea name="notes_cyber" value={fields.cpContacts} onChange={e => handleField('cpContacts', e.target.value)}
                rows={3} className="w-full"  placeholder="Options, modifications, notes..." />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Tab 4: Combat ── */}
      <div hidden={tab !== 4} role="tabpanel">
        <div className="form-section">
          <fieldset>
            <legend>{t('cpDerivedValues')} — {t('tabCpCombat')}</legend>
            <div className="grid gap-sm mb-md" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
              <div className="p-sm text-center" style={{ border: '2px solid var(--color-accent-fg)', borderRadius: '8px', background: 'rgba(52,152,219,0.08)' }}>
                <div className="text-sm font-semibold text-muted" >{t('cpBtm')}</div>
                <div className="font-bold text-accent" style={{ fontSize: '1.8rem' }}>{btm}</div>
                <div className="text-xs text-muted" >BODY {fields.cpBody}</div>
              </div>
              <div className="p-sm border text-center" style={{ borderRadius: '8px' }}>
                <div className="text-sm font-semibold text-muted" >{t('cpRun')}</div>
                <div className="font-bold" style={{ fontSize: '1.3rem' }}>{run} yds</div>
              </div>
              <div className="p-sm border text-center" style={{ borderRadius: '8px' }}>
                <div className="text-sm font-semibold text-muted" >{t('cpLeap')}</div>
                <div className="font-bold" style={{ fontSize: '1.3rem' }}>{leap} yds</div>
              </div>
              <div className="p-sm border text-center" style={{ borderRadius: '8px' }}>
                <div className="text-sm font-semibold text-muted" >{t('cpLift')}</div>
                <div className="font-bold" style={{ fontSize: '1.3rem' }}>{lift} lbs</div>
              </div>
              <div className="p-sm border text-center" style={{ borderRadius: '8px' }}>
                <div className="text-sm font-semibold text-muted" >{t('cpSaveNumber')}</div>
                <div className="font-bold" style={{ fontSize: '1.3rem' }}>{fields.cpBody}</div>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('cpArmor')} — {t('cpStoppingPowerByLocation')}</legend>
            <div className="grid gap-sm" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
              {BODY_LOCATIONS.map(loc => (
                <div key={loc} className="field text-center" >
                  <label className="text-sm" >{loc}</label>
                  <input type="number" min={0} value={armor[loc] || 0}
                    onChange={e => setArmorSP(loc, e.target.value)}
                    className="text-center" style={{ width: '60px' }} />
                </div>
              ))}
            </div>
            <p className="muted-hint muted-hint--xs mt-sm" >
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
              <div className="mt-md" style={{ overflowX: 'auto' }}>
                <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr className="border-b text-left" >
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
                      <tr key={i} className="border-b" >
                        <td className="font-semibold" style={{ padding: '0.4rem' }}>{w.name}</td>
                        <td style={{ padding: '0.4rem' }}>{w.type}</td>
                        <td className="text-accent" style={{ padding: '0.4rem' }}>{w.damage}</td>
                        <td style={{ padding: '0.4rem' }}>{w.shots || '-'}</td>
                        <td style={{ padding: '0.4rem' }}>{w.rof || '-'}</td>
                        <td style={{ padding: '0.4rem' }}>{w.range}m</td>
                        <td style={{ padding: '0.4rem' }}>
                          <button className="btn btn-secondary text-sm" style={{ padding: '2px 8px' }}
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
            <div className="flex flex-wrap gap-xs" >
              {WOUND_STATES.map(ws => (
                <button key={ws.level}
                  className={`btn ${fields.cpWoundState === ws.level ? 'btn-primary' : 'btn-secondary'} text-sm`}
                  aria-label={`${ws.label}${ws.penalty !== 0 ? ' ' + ws.penalty : ''}`}
                  aria-pressed={fields.cpWoundState === ws.level}
                  style={{ padding: '6px 12px', background: fields.cpWoundState === ws.level
                      ? (ws.level === 0 ? '#2ecc71' : ws.level <= 2 ? '#f39c12' : '#f44336')
                      : undefined, color: fields.cpWoundState === ws.level ? '#fff' : undefined }}
                  onClick={() => handleField('cpWoundState', ws.level)}
                >
                  {ws.label} {ws.penalty !== 0 ? ws.penalty : ''}
                </button>
              ))}
            </div>
            {fields.cpWoundState > 0 && (
              <div role="status" aria-live="polite" className="mt-sm p-sm" style={{ border: '2px solid', borderColor: fields.cpWoundState >= 4 ? '#e74c3c' : fields.cpWoundState >= 3 ? '#e67e22' : '#f39c12', borderRadius: '8px', background: fields.cpWoundState >= 4 ? 'rgba(231,76,60,0.1)' : fields.cpWoundState >= 3 ? 'rgba(230,126,34,0.1)' : 'rgba(243,156,18,0.1)' }}>
                <div className="text-xl font-bold" style={{ color: fields.cpWoundState >= 4 ? '#e74c3c' : fields.cpWoundState >= 3 ? '#e67e22' : '#f39c12' }}>
                  {WOUND_STATES[fields.cpWoundState]?.label}: {WOUND_STATES[fields.cpWoundState]?.penalty || 0} REF {t('cpToAllActions')}
                </div>
                <div className="text-base text-muted" style={{ marginTop: '4px' }}>
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
              <div className="field text-center" >
                <label>{t('cpEurodollars')} (eb)</label>
                <input type="number" name="cpEurodollars" min={0} value={fields.cpEurodollars} onChange={handleNumber} className="text-center" style={{ width: '120px' }} />
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
              <div className="mt-md" >
                {gear.map((g, i) => (
                  <div key={i} className="flex justify-between items-center border-b" style={{ padding: '4px 0' }}>
                    <span className="text-base" >
                      <strong>{g.name}</strong>
                      <span className="muted-hint muted-hint--xs"> {g.description} {g.cost ? `(${g.cost} eb)` : ''}</span>
                    </span>
                    <button className="btn btn-secondary text-sm" style={{ padding: '2px 8px' }}
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
            {vehicles.length === 0 && <p className="muted-hint mt-sm" >{t('cpNoVehiclesYet')}</p>}
            {vehicles.length > 0 && (
              <div className="mt-sm" >
                {vehicles.map((v, i) => (
                  <div key={i} className="flex items-center gap-sm" style={{ padding: 'var(--space-xs) 0', borderBottom: '1px solid var(--color-border, #333)' }}>
                    <span className="flex-1 font-semibold" style={{ fontSize: '0.88rem' }}>{v.name}</span>
                    <span className="muted-hint muted-hint--xs">{v.type}</span>
                    <span className="muted-hint muted-hint--xs">Speed {v.topSpeed}</span>
                    <span className="muted-hint muted-hint--xs">SP{v.sp}</span>
                    <span className="muted-hint muted-hint--xs">SDP {v.sdp}</span>
                    <span className="muted-hint muted-hint--xs">Seats {v.seats}</span>
                    <span className="muted-hint muted-hint--xs">{v.costEb}eb</span>
                    <button className="btn btn-secondary text-sm" style={{ padding: '2px 8px' }}
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
            <p className="muted-hint muted-hint--xs mb-md" >
              Choose or roll randomly for each lifepath step to flesh out your character's background.
            </p>
            {Object.entries(CP_LIFEPATH_TABLES).map(([key, options]) => (
              <div key={key} className="mb-md p-sm border" style={{ borderRadius: '4px' }}>
                <div className="flex justify-between items-center mb-xs" >
                  <label className="font-bold text-md" >{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim()}</label>
                  <button className="btn btn-secondary text-sm" style={{ padding: '4px 10px' }}
                    onClick={() => rollLifepathStep(key)}>{t('cpRollRandom')}</button>
                </div>
                <select value={lifepath[key] || ''} onChange={e => setLifepathStep(key, e.target.value)}
                  className="w-full" >
                  <option value="">-- Select --</option>
                  {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}
            <button className="btn btn-secondary mt-sm" 
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
            <textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} className="w-full" 
              placeholder="Your character's backstory..." />
          </fieldset>
          <fieldset>
            <legend>{t('notes')}</legend>
            <textarea name="notes" value={fields.notes} onChange={handleText} rows={4} className="w-full" 
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
            <p className="muted-hint muted-hint--xs mb-sm" >
              Standard CP2020 check: STAT + Skill + 1d10 vs. Difficulty. Fumble on 1, Critical on 10 (exploding).
            </p>
            <div className="field-row">
              <div className="field">
                <label htmlFor="dice-stat-val">{t('cpStatValue')}</label>
                <input id="dice-stat-val" type="number" min={0} max={10} value={diceStatVal} onChange={e => setDiceStatVal(Number(e.target.value) || 0)} className="text-center" style={{ width: '70px' }} />
              </div>
              <div className="field">
                <label htmlFor="dice-skill-val">{t('cpSkillValue')}</label>
                <input id="dice-skill-val" type="number" min={0} max={10} value={diceSkillVal} onChange={e => setDiceSkillVal(Number(e.target.value) || 0)} className="text-center" style={{ width: '70px' }} />
              </div>
              <button className="btn btn-primary" style={{ alignSelf: 'flex-end' }} onClick={handleStatSkillRoll}>{t('cpRollD10')}</button>
            </div>
            {diceResult && (
              <div className="mt-md p-md" style={{ border: '2px solid var(--color-accent-fg)', borderRadius: '8px', background: 'rgba(52,152,219,0.08)' }}>
                <div className="font-bold text-accent" style={{ fontSize: '1.5rem' }}>
                  {t('cpTotal')}: {diceResult.total}
                </div>
                <div className="text-base" style={{ marginTop: '4px' }}>
                  Stat ({diceResult.stat}) + Skill ({diceResult.skill}) + Roll ({diceResult.roll}) = {diceResult.total}
                </div>
                {diceResult.note && <div className="font-semibold" style={{ color: diceResult.roll < 0 ? '#e55' : '#2ecc71', marginTop: '4px' }}>{diceResult.note}</div>}
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
              <div className="mt-sm p-sm border" style={{ borderRadius: '4px' }}>
                <strong>{damageResult.expr}:</strong> [{damageResult.rolls.join(', ')}]{damageResult.mod ? (damageResult.mod > 0 ? '+' : '') + damageResult.mod : ''} = <span className="font-bold text-accent" >{damageResult.total}</span>
              </div>
            )}
            {damageResult?.error && (
              <p className="status-error mt-sm" >{damageResult.error}</p>
            )}
          </fieldset>

          <fieldset>
            <legend>{t('cpRollHistory')}</legend>
            {diceHistory.length === 0 && <p className="muted-hint">{t('cpNoRollsYet')}</p>}
            {diceHistory.map((h, i) => (
              <div key={i} className="border-b text-sm" style={{ padding: '4px 0' }}>
                <span className="text-muted" >{h.time}</span>{' '}
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
        <SaveButton onSave={handleSave} disabled={saving} t={t} />
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
