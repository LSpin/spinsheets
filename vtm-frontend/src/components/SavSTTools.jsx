import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import {
  ENTANGLEMENTS, SCORE_TABLES, NPC_TABLES, DOWNTIME_EVENTS,
  DEVILS_BARGAINS, ENGAGEMENT_MODIFIERS, FACTION_ACTIONS,
} from '../data/savSTTools'

// ── Helpers ──────────────────────────────────────────────────────────────────

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function rollD6() {
  return Math.floor(Math.random() * 6) + 1
}

function rollPool(size) {
  if (size === 0) {
    const dice = [rollD6(), rollD6()]
    return { dice, best: Math.min(...dice), isZero: true }
  }
  const dice = Array.from({ length: size }, () => rollD6())
  return { dice, best: Math.max(...dice), isZero: false }
}

function evaluateRoll(dice, best, isZero) {
  const sixes = dice.filter(d => d === 6).length
  if (!isZero && sixes >= 2) return 'critical'
  if (best === 6) return 'success'
  if (best >= 4) return 'partial'
  return 'failure'
}

const CLOCK_SIZES = [4, 6, 8, 12]
const ST_CLOCKS_KEY = 'sav-st-clocks'

function loadSTClocks() {
  try { return JSON.parse(localStorage.getItem(ST_CLOCKS_KEY) || '[]') } catch { return [] }
}
function saveSTClocks(clocks) {
  localStorage.setItem(ST_CLOCKS_KEY, JSON.stringify(clocks))
}

// ── Clock SVG (reused from BladesClockManager) ──────────────────────────────

function ClockSVG({ segments, filled, size = 120, onClick, color }) {
  const r = size / 2 - 3
  const cx = size / 2
  const cy = size / 2
  const slices = []
  for (let i = 0; i < segments; i++) {
    const startAngle = (i / segments) * 2 * Math.PI - Math.PI / 2
    const endAngle = ((i + 1) / segments) * 2 * Math.PI - Math.PI / 2
    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    const largeArc = segments <= 2 ? 1 : 0
    const d = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`
    slices.push(
      <path key={i} d={d}
        fill={i < filled ? (color || 'var(--accent)') : 'var(--surface-2, #1a1a2e)'}
        stroke="var(--text-muted, #555)" strokeWidth="1.5"
        style={{ cursor: onClick ? 'pointer' : 'default', transition: 'fill 0.15s' }}
        onClick={() => onClick && onClick(i)}
        role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}
        aria-label={`Segment ${i + 1} of ${segments}${i < filled ? ' (filled)' : ' (empty)'}`}
        onKeyDown={onClick ? (e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(i) } }) : undefined}
      />
    )
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
      {slices}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--text-muted, #555)" strokeWidth="2.5" />
    </svg>
  )
}

// ── Collapsible History ─────────────────────────────────────────────────────

function HistoryPanel({ items, renderItem, label }) {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()
  if (items.length === 0) return null
  return (
    <div style={{ marginTop: 'var(--space-md)' }}>
      <button className="btn btn-secondary" onClick={() => setOpen(!open)}
        aria-expanded={open} style={{ fontSize: '0.82rem' }}>
        {open ? t('savSTHideHistory') : t('savSTShowHistory')} ({items.length})
      </button>
      {open && (
        <ul aria-label={label} style={{ listStyle: 'none', padding: 0, marginTop: 'var(--space-sm)' }}>
          {items.map((item, i) => (
            <li key={item.id || i} className="character-card" style={{ padding: 'var(--space-sm) var(--space-md)', marginBottom: 'var(--space-xs)' }}>
              {renderItem(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ── Result Card ─────────────────────────────────────────────────────────────

function ResultCard({ children, style }) {
  return (
    <div className="character-card" role="status" aria-live="polite" style={{
      padding: 'var(--space-lg)',
      marginTop: 'var(--space-md)',
      border: '1px solid var(--accent)',
      ...style,
    }}>
      {children}
    </div>
  )
}

// ── Tab 1: Score Generator ──────────────────────────────────────────────────

function ScoreGeneratorTab() {
  const { t } = useLanguage()
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function rollField(field) {
    return pickRandom(SCORE_TABLES[field])
  }

  function rollAll() {
    const score = {
      id: Date.now(),
      client: rollField('clients'),
      target: rollField('targets'),
      workType: rollField('workTypes'),
      complication: rollField('complications'),
      twist: rollField('twists'),
    }
    setResult(score)
    setHistory(prev => [score, ...prev].slice(0, 20))
  }

  function rollSingle(field) {
    const value = rollField(field)
    const score = { ...result, id: Date.now(), [field]: value }
    setResult(score)
  }

  return (
    <div>
      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>
        {t('savSTScoreHint')}
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={rollAll}>{t('savSTRollAll')}</button>
        {result && (
          <>
            <button className="btn btn-secondary" onClick={() => rollSingle('clients')}>{t('savSTRerollClient')}</button>
            <button className="btn btn-secondary" onClick={() => rollSingle('targets')}>{t('savSTRerollTarget')}</button>
            <button className="btn btn-secondary" onClick={() => rollSingle('workTypes')}>{t('savSTRerollWork')}</button>
            <button className="btn btn-secondary" onClick={() => rollSingle('complications')}>{t('savSTRerollComplication')}</button>
            <button className="btn btn-secondary" onClick={() => rollSingle('twists')}>{t('savSTRerollTwist')}</button>
          </>
        )}
      </div>

      {result && (
        <ResultCard>
          <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
            <div><strong>{t('savSTClient')}:</strong> {result.client}</div>
            <div><strong>{t('savSTTarget')}:</strong> {result.target}</div>
            <div><strong>{t('savSTWorkType')}:</strong> {result.workType}</div>
            <div><strong>{t('savSTComplication')}:</strong> {result.complication}</div>
            <div><strong>{t('savSTTwist')}:</strong> {result.twist}</div>
          </div>
        </ResultCard>
      )}

      <HistoryPanel items={history} label="Score history" renderItem={(item) => (
        <div style={{ fontSize: '0.85rem' }}>
          <strong>{item.workType}</strong> — {item.client} vs {item.target}
        </div>
      )} />
    </div>
  )
}

// ── Tab 2: Entanglement Roller ──────────────────────────────────────────────

function EntanglementTab() {
  const { t } = useLanguage()
  const [heat, setHeat] = useState(0)
  const [wantedLevel, setWantedLevel] = useState(0)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function rollEntanglement() {
    const roll = rollD6()
    let table
    if (wantedLevel >= 4) {
      table = ENTANGLEMENTS.wanted
    } else if (heat >= 4) {
      table = ENTANGLEMENTS.highHeat
    } else {
      table = ENTANGLEMENTS.lowHeat
    }

    const rollNum = roll
    let entry
    if (rollNum <= 3) entry = table[0]
    else if (rollNum <= 5) entry = table[1]
    else entry = table[2]

    const res = { id: Date.now(), roll, heat, wantedLevel, ...entry }
    setResult(res)
    setHistory(prev => [res, ...prev].slice(0, 20))
  }

  return (
    <div>
      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>
        {t('savSTEntanglementHint')}
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 'var(--space-md)' }}>
        <div className="field" style={{ flex: '0 0 120px' }}>
          <label htmlFor="ent-heat">{t('bladesHeat')}</label>
          <input id="ent-heat" type="number" min={0} max={9} value={heat}
            onChange={e => setHeat(Math.max(0, Math.min(9, Number(e.target.value) || 0)))} />
        </div>
        <div className="field" style={{ flex: '0 0 120px' }}>
          <label htmlFor="ent-wanted">{t('bladesWanted')}</label>
          <input id="ent-wanted" type="number" min={0} max={4} value={wantedLevel}
            onChange={e => setWantedLevel(Math.max(0, Math.min(4, Number(e.target.value) || 0)))} />
        </div>
        <button className="btn btn-primary" onClick={rollEntanglement}>{t('savSTRollEntanglement')}</button>
      </div>

      <div style={{ fontSize: '0.82rem', marginBottom: 'var(--space-sm)', color: 'var(--text-muted)' }}>
        {t('savSTTableUsed')}: {wantedLevel >= 4 ? t('savSTWantedTable') : heat >= 4 ? t('savSTHighHeat') : t('savSTLowHeat')}
      </div>

      {result && (
        <ResultCard>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-xs)' }}>
            {t('bladesRoll')}: {result.roll} | {t('bladesHeat')}: {result.heat} | {t('bladesWanted')}: {result.wantedLevel}
          </div>
          <h3 style={{ margin: '0 0 var(--space-xs) 0', color: 'var(--accent)' }}>{result.name}</h3>
          <p style={{ margin: 0, lineHeight: 1.5 }}>{result.description}</p>
        </ResultCard>
      )}

      <HistoryPanel items={history} label="Entanglement history" renderItem={(item) => (
        <div style={{ fontSize: '0.85rem' }}>
          <strong>{item.name}</strong> (roll {item.roll}, heat {item.heat})
        </div>
      )} />
    </div>
  )
}

// ── Tab 3: NPC Generator ────────────────────────────────────────────────────

function NPCGeneratorTab() {
  const { t } = useLanguage()
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function generateNPC() {
    const npc = {
      id: Date.now(),
      firstName: pickRandom(NPC_TABLES.firstNames),
      lastName: pickRandom(NPC_TABLES.lastNames),
      trait: pickRandom(NPC_TABLES.traits),
      profession: pickRandom(NPC_TABLES.professions),
      quirk: pickRandom(NPC_TABLES.quirks),
    }
    setResult(npc)
    setHistory(prev => [npc, ...prev].slice(0, 30))
  }

  return (
    <div>
      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>
        {t('savSTNPCHint')}
      </p>
      <button className="btn btn-primary" onClick={generateNPC}>
        {result ? t('savSTGenerateAnother') : t('savSTGenerateNPC')}
      </button>

      {result && (
        <ResultCard>
          <h3 style={{ margin: '0 0 var(--space-sm) 0', color: 'var(--accent)' }}>
            {result.firstName} {result.lastName}
          </h3>
          <div style={{ display: 'grid', gap: 'var(--space-xs)' }}>
            <div><strong>{t('savSTTrait')}:</strong> {result.trait}</div>
            <div><strong>{t('bladeSTProfession')}:</strong> {result.profession}</div>
            <div><strong>{t('savSTQuirk')}:</strong> {result.quirk}</div>
          </div>
        </ResultCard>
      )}

      <HistoryPanel items={history} label="NPC history" renderItem={(item) => (
        <div style={{ fontSize: '0.85rem' }}>
          <strong>{item.firstName} {item.lastName}</strong> — {item.trait} {item.profession}
        </div>
      )} />
    </div>
  )
}

// ── Tab 4: Faction Turn ─────────────────────────────────────────────────────

function FactionTurnTab() {
  const { t } = useLanguage()
  const [pool, setPool] = useState(1)
  const [rollResult, setRollResult] = useState(null)
  const [history, setHistory] = useState([])

  function handleFortuneRoll() {
    const roll = rollPool(pool)
    const outcome = evaluateRoll(roll.dice, roll.best, roll.isZero)
    const entry = {
      id: Date.now(),
      pool,
      dice: roll.dice,
      best: roll.best,
      outcome,
    }
    setRollResult(entry)
    setHistory(prev => [entry, ...prev].slice(0, 20))
  }

  function outcomeLabel(outcome) {
    if (outcome === 'critical') return t('bladesCritical')
    if (outcome === 'success') return t('bladesFullSuccess')
    if (outcome === 'partial') return t('bladesPartialSuccess')
    return t('bladesFailure')
  }

  function outcomeColor(outcome) {
    if (outcome === 'critical' || outcome === 'success') return '#51cf66'
    if (outcome === 'partial') return '#fcc419'
    return '#fa5252'
  }

  return (
    <div>
      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>
        {t('savSTFactionHint')}
      </p>

      {/* Fortune Roll */}
      <fieldset className="form-section" style={{ marginBottom: 'var(--space-lg)' }}>
        <legend>{t('savSTFortuneRoll')}</legend>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="field" style={{ flex: '0 0 100px' }}>
            <label htmlFor="faction-pool">{t('bladesDicePool')}</label>
            <input id="faction-pool" type="number" min={0} max={10} value={pool}
              onChange={e => setPool(Math.max(0, Math.min(10, Number(e.target.value) || 0)))} />
          </div>
          <button className="btn btn-primary" onClick={handleFortuneRoll}>{t('bladesRoll')}</button>
        </div>

        {rollResult && (
          <div aria-live="polite" style={{ marginTop: 'var(--space-md)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 600 }}>{t('savSTDice')}:</span>
              {rollResult.dice.map((d, i) => (
                <span key={i} style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 36, height: 36, borderRadius: 6,
                  background: d === rollResult.best ? 'var(--accent)' : 'var(--surface-2, #1a1a2e)',
                  color: d === rollResult.best ? '#fff' : 'var(--text)',
                  fontWeight: 700, fontSize: '1.1rem',
                  border: '2px solid var(--text-muted, #555)',
                }}>{d}</span>
              ))}
              <span style={{ fontWeight: 700, color: outcomeColor(rollResult.outcome), marginLeft: 'var(--space-sm)', fontSize: '1.1rem' }}
                aria-label={`Outcome: ${outcomeLabel(rollResult.outcome)}`}>
                {outcomeLabel(rollResult.outcome)}
              </span>
            </div>
            <p style={{ marginTop: 'var(--space-xs)', fontSize: '0.82rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
              {t(`bladesFortuneOut_${rollResult.outcome}`)}
            </p>
          </div>
        )}

        {/* Roll History */}
        {history.length > 0 && (
          <div style={{ marginTop: 'var(--space-md)', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
              <strong>{t('diceHistory')}</strong>
              <button className="dice-roller-clear" onClick={() => setHistory([])}>{t('diceClear')}</button>
            </div>
            {history.map(h => (
              <div key={h.id} style={{ padding: '0.2rem 0', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
                <span>{h.pool}d6 [{h.dice.join(', ')}]</span>
                <span style={{ fontWeight: 600, color: outcomeColor(h.outcome) }}>{outcomeLabel(h.outcome)}</span>
              </div>
            ))}
          </div>
        )}
      </fieldset>

      {/* Engagement Modifiers Reference */}
      <fieldset className="form-section" style={{ marginBottom: 'var(--space-lg)' }}>
        <legend>{t('savSTEngagementMods')}</legend>
        <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 'var(--space-xs)', borderBottom: '1px solid var(--text-muted)' }}>{t('savSTModifier')}</th>
              <th style={{ textAlign: 'left', padding: 'var(--space-xs)', borderBottom: '1px solid var(--text-muted)' }}>{t('savSTCondition')}</th>
            </tr>
          </thead>
          <tbody>
            {ENGAGEMENT_MODIFIERS.map((mod, i) => (
              <tr key={i}>
                <td style={{ padding: 'var(--space-xs)', fontWeight: 700, color: mod.modifier.startsWith('+') ? '#51cf66' : '#fa5252' }}
                  aria-label={`${mod.modifier.startsWith('+') ? 'Bonus' : 'Penalty'}: ${mod.modifier}`}>{mod.modifier}</td>
                <td style={{ padding: 'var(--space-xs)' }}>{mod.condition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </fieldset>

      {/* Faction Actions Reference */}
      <fieldset className="form-section">
        <legend>{t('savSTFactionActions')}</legend>
        <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
          {FACTION_ACTIONS.map((action, i) => (
            <div key={i} style={{ fontSize: '0.85rem' }}>
              <strong>{action.name}:</strong> {action.description}
            </div>
          ))}
        </div>
      </fieldset>

      <HistoryPanel items={history} label="Fortune roll history" renderItem={(item) => (
        <div style={{ fontSize: '0.85rem' }}>
          <strong>{item.pool}d6</strong> [{item.dice.join(', ')}] — <span style={{ color: outcomeColor(item.outcome) }} aria-label={`Outcome: ${outcomeLabel(item.outcome)}`}>{outcomeLabel(item.outcome)}</span>
        </div>
      )} />
    </div>
  )
}

// ── Tab 5: Downtime Events ──────────────────────────────────────────────────

function DowntimeEventsTab() {
  const { t } = useLanguage()
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function rollEvent() {
    const event = pickRandom(DOWNTIME_EVENTS)
    const entry = { id: Date.now(), text: event }
    setResult(entry)
    setHistory(prev => [entry, ...prev].slice(0, 20))
  }

  return (
    <div>
      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>
        {t('savSTDowntimeHint')}
      </p>
      <button className="btn btn-primary" onClick={rollEvent}>
        {result ? t('savSTRollAnother') : t('savSTRollEvent')}
      </button>

      {result && (
        <ResultCard>
          <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.6 }}>{result.text}</p>
        </ResultCard>
      )}

      <HistoryPanel items={history} label="Downtime event history" renderItem={(item) => (
        <div style={{ fontSize: '0.85rem' }}>{item.text}</div>
      )} />
    </div>
  )
}

// ── Tab 6: Devil's Bargain ──────────────────────────────────────────────────

function DevilsBargainTab() {
  const { t } = useLanguage()
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function rollBargain() {
    const bargain = pickRandom(DEVILS_BARGAINS)
    const entry = { id: Date.now(), text: bargain }
    setResult(entry)
    setHistory(prev => [entry, ...prev].slice(0, 20))
  }

  return (
    <div>
      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>
        {t('savSTBargainHint')}
      </p>
      <button className="btn btn-primary" onClick={rollBargain}>
        {result ? t('savSTAnotherBargain') : t('savSTRollBargain')}
      </button>

      {result && (
        <ResultCard style={{ borderColor: '#fa5252' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: '#fa5252', letterSpacing: '0.05em', marginBottom: 'var(--space-xs)' }}>
            {t('savSTDevilsBargain')}
          </div>
          <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.6 }}>{result.text}</p>
        </ResultCard>
      )}

      <HistoryPanel items={history} label="Devil's Bargain history" renderItem={(item) => (
        <div style={{ fontSize: '0.85rem' }}>{item.text}</div>
      )} />
    </div>
  )
}

// ── Tab 7: Campaign Clocks ──────────────────────────────────────────────────

const CLOCK_COLORS = {
  progress: '#4dabf7',
  danger: '#fa5252',
  faction: '#845ef7',
  project: '#51cf66',
  custom: '#868e96',
}

function CampaignClocksTab() {
  const { t } = useLanguage()
  const [clocks, setClocks] = useState(loadSTClocks)
  const [newName, setNewName] = useState('')
  const [newSize, setNewSize] = useState(4)
  const [newType, setNewType] = useState('progress')

  useEffect(() => { saveSTClocks(clocks) }, [clocks])

  function addClock() {
    if (!newName.trim()) return
    setClocks(prev => [...prev, {
      id: Date.now(),
      name: newName.trim(),
      segments: newSize,
      filled: 0,
      type: newType,
    }])
    setNewName('')
  }

  function tickClock(id, segmentIndex) {
    setClocks(prev => prev.map(c => {
      if (c.id !== id) return c
      const newFilled = segmentIndex < c.filled ? segmentIndex : segmentIndex + 1
      return { ...c, filled: newFilled }
    }))
  }

  function resetClock(id) {
    setClocks(prev => prev.map(c => c.id === id ? { ...c, filled: 0 } : c))
  }

  function removeClock(id) {
    setClocks(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div>
      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>
        {t('savSTClocksHint')}
      </p>

      <div className="form-section" style={{ marginBottom: 'var(--space-lg)' }}>
        <fieldset>
          <legend>{t('bladesClockNew')}</legend>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="field" style={{ flex: '1 1 200px' }}>
              <label htmlFor="stc-name">{t('bladesClockName')}</label>
              <input id="stc-name" value={newName} onChange={e => setNewName(e.target.value)}
                placeholder={t('bladesClockNamePh')}
                onKeyDown={e => { if (e.key === 'Enter') addClock() }} />
            </div>
            <div className="field" style={{ flex: '0 0 110px' }}>
              <label htmlFor="stc-size">{t('bladesClockSize')}</label>
              <select id="stc-size" value={newSize} onChange={e => setNewSize(Number(e.target.value))}>
                {CLOCK_SIZES.map(s => <option key={s} value={s}>{s} {t('bladesSegments')}</option>)}
              </select>
            </div>
            <div className="field" style={{ flex: '0 0 150px' }}>
              <label htmlFor="stc-type">{t('bladesClockType')}</label>
              <select id="stc-type" value={newType} onChange={e => setNewType(e.target.value)}>
                <option value="progress">{t('bladesClockProgress')}</option>
                <option value="danger">{t('bladesClockDanger')}</option>
                <option value="faction">{t('bladesClockFaction')}</option>
                <option value="project">{t('bladesClockProject')}</option>
                <option value="custom">{t('bladesClockCustom')}</option>
              </select>
            </div>
            <button type="button" className="btn btn-primary" style={{ height: 'fit-content' }} onClick={addClock}>
              {t('bladesAddClock')}
            </button>
          </div>
        </fieldset>
      </div>

      {clocks.length === 0 && (
        <div className="empty-state" style={{ padding: 'var(--space-2xl)' }}>
          <h3>{t('bladesClockEmptyTitle')}</h3>
          <p className="muted-hint">{t('savSTClocksEmpty')}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
        {clocks.map(clock => {
          const complete = clock.filled >= clock.segments
          const color = CLOCK_COLORS[clock.type] || CLOCK_COLORS.custom
          return (
            <div key={clock.id} className="character-card" style={{
              textAlign: 'center', padding: 'var(--space-md)',
              border: complete ? `2px solid ${color}` : undefined,
              opacity: complete ? 0.7 : 1,
              position: 'relative',
            }}>
              {complete && (
                <div style={{
                  position: 'absolute', top: 8, right: 10,
                  fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                  color, letterSpacing: '0.05em',
                }}>{t('bladesClockComplete')}</div>
              )}
              <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.95rem' }}>{clock.name}</h4>
              <div style={{ marginBottom: '0.4rem' }}>
                <span style={{
                  fontSize: '0.7rem', padding: '1px 6px', borderRadius: '3px',
                  background: `${color}22`, color, fontWeight: 600,
                }} aria-label={`Clock type: ${clock.type}`}>{clock.type}</span>
              </div>
              <ClockSVG segments={clock.segments} filled={clock.filled} size={110}
                color={color} onClick={(i) => tickClock(clock.id, i)} />
              <div style={{ fontSize: '0.85rem', marginTop: '0.4rem', fontWeight: 600 }}>
                {clock.filled} / {clock.segments}
              </div>
              <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" style={{ padding: '3px 10px', fontSize: '0.75rem' }}
                  onClick={() => resetClock(clock.id)}>{t('bladesClockReset')}</button>
                <button type="button" className="btn btn-danger" style={{ padding: '3px 10px', fontSize: '0.75rem' }}
                  onClick={() => removeClock(clock.id)}>{t('deleteBtn')}</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main Component ──────────────────────────────────────────────────────────

const TABS = [
  { key: 'score', label: 'savSTTabScore' },
  { key: 'entanglement', label: 'savSTTabEntanglement' },
  { key: 'npc', label: 'savSTTabNPC' },
  { key: 'faction', label: 'savSTTabFaction' },
  { key: 'downtime', label: 'savSTTabDowntime' },
  { key: 'bargain', label: 'savSTTabBargain' },
  { key: 'clocks', label: 'savSTTabClocks' },
]

export default function SavSTTools() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('score')

  useEffect(() => { switchTheme('sav') }, [])

  return (
    <section aria-labelledby="st-tools-heading">
      <div className="character-list-header">
        <div>
          <button className="btn btn-secondary" onClick={() => navigate('/sav')} style={{ marginRight: 'var(--space-sm)' }}>
            {t('back')}
          </button>
          <h2 id="st-tools-heading" style={{ display: 'inline' }}>{t('savSTTools')}</h2>
        </div>
      </div>

      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>{t('savSTToolsDesc')}</p>

      <div className="tab-list" role="tablist" aria-label="ST Tools tabs" style={{ marginBottom: 'var(--space-lg)' }}>
        {TABS.map(tab => (
          <button key={tab.key} role="tab"
            className={`btn btn-secondary${activeTab === tab.key ? ' tab-btn--active' : ''}`}
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}>
            {t(tab.label)}
          </button>
        ))}
      </div>

      <div role="tabpanel" aria-label={t(TABS.find(tb => tb.key === activeTab)?.label || '')}>
        {activeTab === 'score' && <ScoreGeneratorTab />}
        {activeTab === 'entanglement' && <EntanglementTab />}
        {activeTab === 'npc' && <NPCGeneratorTab />}
        {activeTab === 'faction' && <FactionTurnTab />}
        {activeTab === 'downtime' && <DowntimeEventsTab />}
        {activeTab === 'bargain' && <DevilsBargainTab />}
        {activeTab === 'clocks' && <CampaignClocksTab />}
      </div>
    </section>
  )
}
