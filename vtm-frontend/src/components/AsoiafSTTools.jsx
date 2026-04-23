import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import {
  HOUSE_EVENT_TYPES, HOUSE_SEVERITY, HOUSE_CONSEQUENCES,
  INTRIGUE_SETTINGS, NPC_DISPOSITIONS, INTRIGUE_STAKES, INTRIGUE_TWISTS,
  ASOIAF_NAMES, NPC_STATIONS, NPC_ASOIAF_PERSONALITIES, NPC_DESIRES,
} from '../data/asoiafSTTools'

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ── Shared UI ────────────────────────────────────────────────────────────────

function ResultCard({ children, style }) {
  return (
    <div className="character-card" role="status" aria-live="polite" style={{
      padding: 'var(--space-lg)', marginTop: 'var(--space-md)',
      border: '1px solid var(--accent)', ...style,
    }}>
      {children}
    </div>
  )
}

function HistoryPanel({ items, renderItem, label }) {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()
  if (items.length === 0) return null
  return (
    <div style={{ marginTop: 'var(--space-md)' }}>
      <button className="btn btn-secondary" onClick={() => setOpen(!open)}
        aria-expanded={open} style={{ fontSize: '0.82rem' }}>
        {open ? t('bladesSTHideHistory') : t('bladesSTShowHistory')} ({items.length})
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

// ── Tab 1: House Events ──────────────────────────────────────────────────────

function HouseEventsTab() {
  const { t } = useLanguage()
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function rollAll() {
    const event = {
      id: Date.now(),
      eventType: pickRandom(HOUSE_EVENT_TYPES),
      severity: pickRandom(HOUSE_SEVERITY),
      consequence: pickRandom(HOUSE_CONSEQUENCES),
    }
    setResult(event)
    setHistory(prev => [event, ...prev].slice(0, 20))
  }

  function rollSingle(field) {
    const tables = { eventType: HOUSE_EVENT_TYPES, severity: HOUSE_SEVERITY, consequence: HOUSE_CONSEQUENCES }
    const value = pickRandom(tables[field])
    const updated = { ...result, id: Date.now(), [field]: value }
    setResult(updated)
  }

  return (
    <div>
      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>{t('asoiafSTHouseHint')}</p>
      <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={rollAll}>{t('asoiafSTRollEvent')}</button>
        {result && (
          <>
            <button className="btn btn-secondary" onClick={() => rollSingle('eventType')}>{t('asoiafSTRerollEvent')}</button>
            <button className="btn btn-secondary" onClick={() => rollSingle('severity')}>{t('asoiafSTRerollSeverity')}</button>
            <button className="btn btn-secondary" onClick={() => rollSingle('consequence')}>{t('asoiafSTRerollConsequence')}</button>
          </>
        )}
      </div>
      {result && (
        <ResultCard>
          <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
            <div><strong>{t('asoiafSTEventType')}:</strong> {result.eventType}</div>
            <div>
              <strong>{t('asoiafSTSeverity')}:</strong>{' '}
              <span style={{ fontWeight: 700, color: result.severity.level === 'Severe' ? '#fa5252' : result.severity.level === 'Moderate' ? '#fcc419' : '#51cf66' }}>
                {result.severity.level}
              </span>
              {' — '}{result.severity.description}
            </div>
            <div><strong>{t('asoiafSTConsequence')}:</strong> {result.consequence}</div>
          </div>
        </ResultCard>
      )}
      <HistoryPanel items={history} label="House event history" renderItem={(item) => (
        <div style={{ fontSize: '0.85rem' }}><strong>{item.eventType.split(' — ')[0]}</strong> ({item.severity.level})</div>
      )} />
    </div>
  )
}

// ── Tab 2: Intrigue Generator ────────────────────────────────────────────────

function IntrigueGeneratorTab() {
  const { t } = useLanguage()
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function rollAll() {
    const intrigue = {
      id: Date.now(),
      setting: pickRandom(INTRIGUE_SETTINGS),
      disposition: pickRandom(NPC_DISPOSITIONS),
      stakes: pickRandom(INTRIGUE_STAKES),
      twist: pickRandom(INTRIGUE_TWISTS),
    }
    setResult(intrigue)
    setHistory(prev => [intrigue, ...prev].slice(0, 20))
  }

  function rollSingle(field) {
    const tables = { setting: INTRIGUE_SETTINGS, disposition: NPC_DISPOSITIONS, stakes: INTRIGUE_STAKES, twist: INTRIGUE_TWISTS }
    const value = pickRandom(tables[field])
    const updated = { ...result, id: Date.now(), [field]: value }
    setResult(updated)
  }

  return (
    <div>
      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>{t('asoiafSTIntrigueHint')}</p>
      <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={rollAll}>{t('asoiafSTRollIntrigue')}</button>
        {result && (
          <>
            <button className="btn btn-secondary" onClick={() => rollSingle('setting')}>{t('asoiafSTRerollSetting')}</button>
            <button className="btn btn-secondary" onClick={() => rollSingle('disposition')}>{t('asoiafSTRerollDisposition')}</button>
            <button className="btn btn-secondary" onClick={() => rollSingle('stakes')}>{t('asoiafSTRerollStakes')}</button>
            <button className="btn btn-secondary" onClick={() => rollSingle('twist')}>{t('asoiafSTRerollTwist')}</button>
          </>
        )}
      </div>
      {result && (
        <ResultCard>
          <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
            <div><strong>{t('asoiafSTSetting')}:</strong> {result.setting}</div>
            <div><strong>{t('asoiafSTDisposition')}:</strong> {result.disposition}</div>
            <div><strong>{t('asoiafSTStakes')}:</strong> {result.stakes}</div>
            <div><strong>{t('asoiafSTTwist')}:</strong> {result.twist}</div>
          </div>
        </ResultCard>
      )}
      <HistoryPanel items={history} label="Intrigue history" renderItem={(item) => (
        <div style={{ fontSize: '0.85rem' }}><strong>{item.stakes.slice(0, 50)}...</strong></div>
      )} />
    </div>
  )
}

// ── Tab 3: NPC Generator ─────────────────────────────────────────────────────

function NPCGeneratorTab() {
  const { t } = useLanguage()
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function generateNPC() {
    const npc = {
      id: Date.now(),
      name: pickRandom(ASOIAF_NAMES),
      station: pickRandom(NPC_STATIONS),
      personality: pickRandom(NPC_ASOIAF_PERSONALITIES),
      desire: pickRandom(NPC_DESIRES),
    }
    setResult(npc)
    setHistory(prev => [npc, ...prev].slice(0, 30))
  }

  return (
    <div>
      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>{t('asoiafSTNPCHint')}</p>
      <button className="btn btn-primary" onClick={generateNPC}>
        {result ? t('bladesSTGenerateAnother') : t('bladesSTGenerateNPC')}
      </button>
      {result && (
        <ResultCard>
          <h3 style={{ margin: '0 0 var(--space-sm) 0', color: 'var(--accent)' }}>{result.name}</h3>
          <div style={{ display: 'grid', gap: 'var(--space-xs)' }}>
            <div><strong>{t('asoiafSTStation')}:</strong> {result.station}</div>
            <div><strong>{t('asoiafSTPersonality')}:</strong> {result.personality}</div>
            <div><strong>{t('asoiafSTDesire')}:</strong> {result.desire}</div>
          </div>
        </ResultCard>
      )}
      <HistoryPanel items={history} label="NPC history" renderItem={(item) => (
        <div style={{ fontSize: '0.85rem' }}><strong>{item.name}</strong> — {item.station.split(' — ')[0]}</div>
      )} />
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────────────────────

const TABS = [
  { key: 'house', label: 'asoiafSTTabHouse' },
  { key: 'intrigue', label: 'asoiafSTTabIntrigue' },
  { key: 'npc', label: 'asoiafSTTabNPC' },
]

export default function AsoiafSTTools() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('house')

  useEffect(() => { switchTheme('asoiaf') }, [])

  return (
    <section aria-labelledby="asoiaf-st-tools-heading">
      <div className="character-list-header">
        <div>
          <button className="btn btn-secondary" onClick={() => navigate('/asoiaf')} style={{ marginRight: 'var(--space-sm)' }}>
            {t('back')}
          </button>
          <h2 id="asoiaf-st-tools-heading" style={{ display: 'inline' }}>{t('asoiafSTTools')}</h2>
        </div>
      </div>

      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>{t('asoiafSTToolsDesc')}</p>

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
        {activeTab === 'house' && <HouseEventsTab />}
        {activeTab === 'intrigue' && <IntrigueGeneratorTab />}
        {activeTab === 'npc' && <NPCGeneratorTab />}
      </div>
    </section>
  )
}
