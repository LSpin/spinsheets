import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import {
  FEEDING_SCENES, SPIRIT_ENCOUNTERS, PARADOX_EVENTS,
  FRENZY_TRIGGERS, NPC_TABLES, CITY_EVENTS, SCENE_COMPLICATIONS,
} from '../data/wodSTTools'

// ── Helpers ──────────────────────────────────────────────────────────────────

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function rollD10() {
  return Math.floor(Math.random() * 10) + 1
}

function rollPool(size, difficulty) {
  const dice = Array.from({ length: size }, () => rollD10())
  const successes = dice.filter(d => d >= difficulty).length
  const ones = dice.filter(d => d === 1).length
  const net = successes - ones
  let outcome = 'failure'
  if (net > 0) outcome = 'success'
  else if (successes > 0 && net <= 0) outcome = 'failure'
  else if (ones > 0 && successes === 0) outcome = 'botch'
  return { dice, successes, ones, net, outcome }
}

// ── Collapsible History ─────────────────────────────────────────────────────

function HistoryPanel({ items, renderItem, label }) {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()
  if (items.length === 0) return null
  return (
    <div className="mt-md">
      <button className="btn btn-secondary" onClick={() => setOpen(!open)}
        aria-expanded={open} style={{ fontSize: '0.82rem' }}>
        {open ? t('wodSTHideHistory') : t('wodSTShowHistory')} ({items.length})
      </button>
      {open && (
        <ul aria-label={label} style={{ listStyle: 'none', padding: 0 }} className="mt-sm">
          {items.map((item, i) => (
            <li key={item.id || i} className="character-card mb-xs" style={{ padding: 'var(--space-sm) var(--space-md)' }}>
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
    <div className="character-card mt-md" role="status" aria-live="polite" style={{
      padding: 'var(--space-lg)',
      border: '1px solid var(--accent)',
      ...style,
    }}>
      {children}
    </div>
  )
}

// ── Tab 1: Feeding Scene ────────────────────────────────────────────────────

function FeedingSceneTab() {
  const { t } = useLanguage()
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function rollAll() {
    const scene = {
      id: Date.now(),
      location: pickRandom(FEEDING_SCENES.locations),
      prey: pickRandom(FEEDING_SCENES.preyTypes),
      complication: pickRandom(FEEDING_SCENES.complications),
    }
    setResult(scene)
    setHistory(prev => [scene, ...prev].slice(0, 20))
  }

  function rollSingle(field) {
    const tables = { location: FEEDING_SCENES.locations, prey: FEEDING_SCENES.preyTypes, complication: FEEDING_SCENES.complications }
    const value = pickRandom(tables[field])
    const scene = { ...result, id: Date.now(), [field]: value }
    setResult(scene)
  }

  return (
    <div>
      <p className="muted-hint mb-md">
        {t('wodSTFeedingHint')}
      </p>
      <div className="flex gap-sm flex-wrap">
        <button className="btn btn-primary" onClick={rollAll}>{t('wodSTRollAll')}</button>
        {result && (
          <>
            <button className="btn btn-secondary" onClick={() => rollSingle('location')}>{t('wodSTRerollLocation')}</button>
            <button className="btn btn-secondary" onClick={() => rollSingle('prey')}>{t('wodSTRerollPrey')}</button>
            <button className="btn btn-secondary" onClick={() => rollSingle('complication')}>{t('wodSTRerollComplication')}</button>
          </>
        )}
      </div>

      {result && (
        <ResultCard>
          <div className="grid gap-sm">
            <div><strong>{t('wodSTLocation')}:</strong> {result.location}</div>
            <div><strong>{t('wodSTPrey')}:</strong> {result.prey}</div>
            <div><strong>{t('wodSTComplication')}:</strong> {result.complication}</div>
          </div>
        </ResultCard>
      )}

      <HistoryPanel items={history} label="Feeding scene history" renderItem={(item) => (
        <div className="text-base">
          <strong>{item.location}</strong> — {item.prey}
        </div>
      )} />
    </div>
  )
}

// ── Tab 2: Spirit Encounter ─────────────────────────────────────────────────

function SpiritEncounterTab() {
  const { t } = useLanguage()
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function rollEncounter() {
    const entry = { id: Date.now(), text: pickRandom(SPIRIT_ENCOUNTERS) }
    setResult(entry)
    setHistory(prev => [entry, ...prev].slice(0, 20))
  }

  return (
    <div>
      <p className="muted-hint mb-md">
        {t('wodSTSpiritHint')}
      </p>
      <button className="btn btn-primary" onClick={rollEncounter}>
        {result ? t('wodSTRollAnother') : t('wodSTRollEncounter')}
      </button>

      {result && (
        <ResultCard>
          <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.6 }}>{result.text}</p>
        </ResultCard>
      )}

      <HistoryPanel items={history} label="Spirit encounter history" renderItem={(item) => (
        <div className="text-base">{item.text}</div>
      )} />
    </div>
  )
}

// ── Tab 3: Paradox Backlash ─────────────────────────────────────────────────

function ParadoxBacklashTab() {
  const { t } = useLanguage()
  const [severity, setSeverity] = useState('minor')
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function rollParadox() {
    const entry = {
      id: Date.now(),
      severity,
      text: pickRandom(PARADOX_EVENTS[severity]),
    }
    setResult(entry)
    setHistory(prev => [entry, ...prev].slice(0, 20))
  }

  function severityColor(sev) {
    if (sev === 'minor') return '#fcc419'
    if (sev === 'moderate') return '#fd7e14'
    return '#fa5252'
  }

  return (
    <div>
      <p className="muted-hint mb-md">
        {t('wodSTParadoxHint')}
      </p>
      <div className="flex gap-md flex-wrap items-end mb-md">
        <div className="field" style={{ flex: '0 0 180px' }}>
          <label htmlFor="paradox-severity">{t('wodSTSeverity')}</label>
          <select id="paradox-severity" value={severity} onChange={e => setSeverity(e.target.value)}>
            <option value="minor">{t('wodSTMinor')}</option>
            <option value="moderate">{t('wodSTModerate')}</option>
            <option value="severe">{t('wodSTSevere')}</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={rollParadox}>{t('wodSTRollParadox')}</button>
      </div>

      {result && (
        <ResultCard style={{ borderColor: severityColor(result.severity) }}>
          <div className="uppercase font-bold mb-xs" style={{
            fontSize: '0.75rem',
            color: severityColor(result.severity), letterSpacing: '0.05em',
          }}>
            {t(`wodST${result.severity.charAt(0).toUpperCase() + result.severity.slice(1)}`)} {t('wodSTParadox')}
          </div>
          <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.6 }}>{result.text}</p>
        </ResultCard>
      )}

      <HistoryPanel items={history} label="Paradox history" renderItem={(item) => (
        <div className="text-base">
          <span className="font-bold" style={{ color: severityColor(item.severity) }}
            aria-label={`Severity: ${item.severity}`}>
            [{item.severity}]
          </span>{' '}
          {item.text}
        </div>
      )} />
    </div>
  )
}

// ── Tab 4: NPC Generator ────────────────────────────────────────────────────

function NPCGeneratorTab() {
  const { t } = useLanguage()
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function generateNPC() {
    const npc = {
      id: Date.now(),
      firstName: pickRandom(NPC_TABLES.firstNames),
      lastName: pickRandom(NPC_TABLES.lastNames),
      clanTribe: pickRandom(NPC_TABLES.clanTribes),
      personality: pickRandom(NPC_TABLES.personalityTraits),
      secret: pickRandom(NPC_TABLES.secrets),
      motivation: pickRandom(NPC_TABLES.motivations),
    }
    setResult(npc)
    setHistory(prev => [npc, ...prev].slice(0, 30))
  }

  return (
    <div>
      <p className="muted-hint mb-md">
        {t('wodSTNPCHint')}
      </p>
      <button className="btn btn-primary" onClick={generateNPC}>
        {result ? t('wodSTGenerateAnother') : t('wodSTGenerateNPC')}
      </button>

      {result && (
        <ResultCard>
          <h3 style={{ margin: '0 0 var(--space-sm) 0', color: 'var(--accent)' }}>
            {result.firstName} {result.lastName}
          </h3>
          <div className="grid gap-xs">
            <div><strong>{t('wodSTClanTribe')}:</strong> {result.clanTribe}</div>
            <div><strong>{t('wodSTPersonality')}:</strong> {result.personality}</div>
            <div><strong>{t('wodSTSecret')}:</strong> {result.secret}</div>
            <div><strong>{t('wodSTMotivation')}:</strong> {result.motivation}</div>
          </div>
        </ResultCard>
      )}

      <HistoryPanel items={history} label="NPC history" renderItem={(item) => (
        <div className="text-base">
          <strong>{item.firstName} {item.lastName}</strong> — {item.clanTribe}, {item.personality}
        </div>
      )} />
    </div>
  )
}

// ── Tab 5: City Events ──────────────────────────────────────────────────────

function CityEventsTab() {
  const { t } = useLanguage()
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function rollEvent() {
    const entry = { id: Date.now(), text: pickRandom(CITY_EVENTS) }
    setResult(entry)
    setHistory(prev => [entry, ...prev].slice(0, 20))
  }

  return (
    <div>
      <p className="muted-hint mb-md">
        {t('wodSTCityHint')}
      </p>
      <button className="btn btn-primary" onClick={rollEvent}>
        {result ? t('wodSTRollAnother') : t('wodSTRollCityEvent')}
      </button>

      {result && (
        <ResultCard>
          <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.6 }}>{result.text}</p>
        </ResultCard>
      )}

      <HistoryPanel items={history} label="City event history" renderItem={(item) => (
        <div className="text-base">{item.text}</div>
      )} />
    </div>
  )
}

// ── Tab 6: Frenzy Reference ─────────────────────────────────────────────────

function FrenzyReferenceTab() {
  const { t } = useLanguage()
  const [pool, setPool] = useState(3)
  const [selectedDiff, setSelectedDiff] = useState(null)
  const [rollResult, setRollResult] = useState(null)
  const [history, setHistory] = useState([])

  function handleRoll(difficulty, triggerText) {
    const result = rollPool(pool, difficulty)
    const entry = {
      id: Date.now(),
      trigger: triggerText,
      difficulty,
      pool,
      ...result,
    }
    setRollResult(entry)
    setSelectedDiff(difficulty)
    setHistory(prev => [entry, ...prev].slice(0, 20))
  }

  function outcomeColor(outcome) {
    if (outcome === 'success') return '#51cf66'
    if (outcome === 'botch') return '#fa5252'
    return '#fcc419'
  }

  function outcomeLabel(outcome) {
    if (outcome === 'success') return t('wodSTResisted')
    if (outcome === 'botch') return t('wodSTBotch')
    return t('wodSTFailed')
  }

  return (
    <div>
      <p className="muted-hint mb-md">
        {t('wodSTFrenzyHint')}
      </p>

      <div className="flex gap-sm items-end mb-lg flex-wrap">
        <div className="field" style={{ flex: '0 0 140px' }}>
          <label htmlFor="frenzy-pool">{t('wodSTSelfControlPool')}</label>
          <input id="frenzy-pool" type="number" min={1} max={10} value={pool}
            onChange={e => setPool(Math.max(1, Math.min(10, Number(e.target.value) || 1)))} />
        </div>
      </div>

      <table className="w-full text-base mb-md" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th className="text-left" style={{ padding: 'var(--space-xs)', borderBottom: '1px solid var(--text-muted)' }}>{t('wodSTTrigger')}</th>
            <th className="text-left" style={{ padding: 'var(--space-xs)', borderBottom: '1px solid var(--text-muted)' }}>{t('wodSTType')}</th>
            <th className="text-center" style={{ padding: 'var(--space-xs)', borderBottom: '1px solid var(--text-muted)' }}>{t('wodSTDifficulty')}</th>
            <th className="text-left" style={{ padding: 'var(--space-xs)', borderBottom: '1px solid var(--text-muted)' }}>{t('wodSTNotes')}</th>
            <th className="text-center" style={{ padding: 'var(--space-xs)', borderBottom: '1px solid var(--text-muted)' }}></th>
          </tr>
        </thead>
        <tbody>
          {FRENZY_TRIGGERS.map((row, i) => (
            <tr key={i} style={{ background: selectedDiff === row.difficulty && rollResult?.trigger === row.trigger ? 'var(--surface-2, rgba(255,255,255,0.05))' : undefined }}>
              <td style={{ padding: 'var(--space-xs)' }}>{row.trigger}</td>
              <td className="font-semibold" style={{ padding: 'var(--space-xs)', color: row.type === 'Rotschreck' ? '#fd7e14' : '#fa5252' }}
                aria-label={`Type: ${row.type}`}>{row.type}</td>
              <td className="text-center font-bold" style={{ padding: 'var(--space-xs)' }}>{row.difficulty}</td>
              <td className="text-muted" style={{ padding: 'var(--space-xs)', fontSize: '0.8rem' }}>{row.notes}</td>
              <td className="text-center" style={{ padding: 'var(--space-xs)' }}>
                <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                  onClick={() => handleRoll(row.difficulty, row.trigger)}
                  aria-label={`Roll Self-Control against ${row.trigger}`}>
                  {t('wodSTRoll')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {rollResult && (
        <ResultCard>
          <div className="text-base text-muted mb-xs">
            {rollResult.trigger} — {t('wodSTDifficulty')} {rollResult.difficulty}, {t('wodSTPool')} {rollResult.pool}
          </div>
          <div className="flex gap-sm items-center flex-wrap">
            <span className="font-semibold">{t('wodSTDice')}:</span>
            {rollResult.dice.map((d, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 36, height: 36, borderRadius: 6,
                background: d >= rollResult.difficulty ? '#51cf66' : d === 1 ? '#fa5252' : 'var(--surface-2, #1a1a2e)',
                color: d >= rollResult.difficulty || d === 1 ? '#fff' : 'var(--text)',
                fontWeight: 700, fontSize: '1.1rem',
                border: '2px solid var(--text-muted, #555)',
              }}>{d}</span>
            ))}
            <span className="font-bold text-xl ml-sm" style={{ color: outcomeColor(rollResult.outcome) }}
              aria-label={`Outcome: ${outcomeLabel(rollResult.outcome)}`}>
              {outcomeLabel(rollResult.outcome)} ({rollResult.net} {t('wodSTSuccesses')})
            </span>
          </div>
        </ResultCard>
      )}

      <HistoryPanel items={history} label="Frenzy roll history" renderItem={(item) => (
        <div className="text-base">
          <strong>{item.trigger}</strong> [{item.dice.join(', ')}] — <span style={{ color: outcomeColor(item.outcome) }} aria-label={`Outcome: ${outcomeLabel(item.outcome)}`}>{outcomeLabel(item.outcome)}</span>
        </div>
      )} />
    </div>
  )
}

// ── Tab 7: Scene Complications ──────────────────────────────────────────────

function SceneComplicationsTab() {
  const { t } = useLanguage()
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function rollComplication() {
    const entry = { id: Date.now(), text: pickRandom(SCENE_COMPLICATIONS) }
    setResult(entry)
    setHistory(prev => [entry, ...prev].slice(0, 20))
  }

  return (
    <div>
      <p className="muted-hint mb-md">
        {t('wodSTComplicationHint')}
      </p>
      <button className="btn btn-primary" onClick={rollComplication}>
        {result ? t('wodSTRollAnother') : t('wodSTRollComplicationBtn')}
      </button>

      {result && (
        <ResultCard style={{ borderColor: '#fd7e14' }}>
          <div className="uppercase font-bold mb-xs" style={{
            fontSize: '0.75rem',
            color: '#fd7e14', letterSpacing: '0.05em',
          }}>
            {t('wodSTSceneComplication')}
          </div>
          <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.6 }}>{result.text}</p>
        </ResultCard>
      )}

      <HistoryPanel items={history} label="Scene complication history" renderItem={(item) => (
        <div className="text-base">{item.text}</div>
      )} />
    </div>
  )
}

// ── Main Component ──────────────────────────────────────────────────────────

const TABS = [
  { key: 'feeding', label: 'wodSTTabFeeding' },
  { key: 'spirit', label: 'wodSTTabSpirit' },
  { key: 'paradox', label: 'wodSTTabParadox' },
  { key: 'npc', label: 'wodSTTabNPC' },
  { key: 'city', label: 'wodSTTabCity' },
  { key: 'frenzy', label: 'wodSTTabFrenzy' },
  { key: 'complication', label: 'wodSTTabComplication' },
]

export default function WoDSTTools() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('feeding')

  useEffect(() => { switchTheme('wod') }, [])

  return (
    <section aria-labelledby="wod-st-tools-heading">
      <div className="character-list-header">
        <div>
          <button className="btn btn-secondary mr-sm" onClick={() => navigate('/characters')}>
            {t('back')}
          </button>
          <h2 id="wod-st-tools-heading" style={{ display: 'inline' }}>{t('wodSTTools')}</h2>
        </div>
      </div>

      <p className="muted-hint mb-md">{t('wodSTToolsDesc')}</p>

      <div className="tab-list mb-lg" role="tablist" aria-label="ST Tools tabs">
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
        {activeTab === 'feeding' && <FeedingSceneTab />}
        {activeTab === 'spirit' && <SpiritEncounterTab />}
        {activeTab === 'paradox' && <ParadoxBacklashTab />}
        {activeTab === 'npc' && <NPCGeneratorTab />}
        {activeTab === 'city' && <CityEventsTab />}
        {activeTab === 'frenzy' && <FrenzyReferenceTab />}
        {activeTab === 'complication' && <SceneComplicationsTab />}
      </div>
    </section>
  )
}
