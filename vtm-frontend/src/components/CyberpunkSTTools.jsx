import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import {
  NIGHT_CITY_ENCOUNTERS, GIG_TABLES, CONTACT_TABLES,
  NETRUNNING_ENCOUNTERS, LIFEPATH_EVENTS,
} from '../data/cyberpunkSTTools'

// ── Helpers ──────────────────────────────────────────────────────────────────

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ── Shared Components ────────────────────────────────────────────────────────

function HistoryPanel({ items, renderItem, label }) {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()
  if (items.length === 0) return null
  return (
    <div style={{ marginTop: 'var(--space-md)' }}>
      <button className="btn btn-secondary" onClick={() => setOpen(!open)}
        aria-expanded={open} style={{ fontSize: '0.82rem' }}>
        {open ? t('cpSTHideHistory') : t('cpSTShowHistory')} ({items.length})
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

// ── Tab 1: Encounter Generator ──────────────────────────────────────────────

function EncounterTab() {
  const { t } = useLanguage()
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function roll() {
    const enc = pickRandom(NIGHT_CITY_ENCOUNTERS)
    const entry = { id: Date.now(), ...enc }
    setResult(entry)
    setHistory(prev => [entry, ...prev].slice(0, 20))
  }

  function threatColor(threat) {
    if (threat === 'High') return '#fa5252'
    if (threat === 'Medium') return '#fcc419'
    return '#51cf66'
  }

  return (
    <div>
      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>
        {t('cpSTEncounterHint')}
      </p>
      <button className="btn btn-primary" onClick={roll}>
        {result ? t('cpSTRollAnother') : t('cpSTRollEncounter')}
      </button>

      {result && (
        <ResultCard>
          <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
            <div><strong>{t('cpSTLocation')}:</strong> {result.location}</div>
            <div><strong>{t('cpSTSituation')}:</strong> {result.situation}</div>
            <div>
              <strong>{t('cpSTThreat')}:</strong>{' '}
              <span style={{ color: threatColor(result.threat), fontWeight: 700 }} aria-label={`Threat level: ${result.threat}`}>{result.threat}</span>
            </div>
          </div>
        </ResultCard>
      )}

      <HistoryPanel items={history} label="Encounter history" renderItem={(item) => (
        <div style={{ fontSize: '0.85rem' }}>
          <strong>{item.location}</strong> — <span style={{ color: threatColor(item.threat) }} aria-label={`Threat level: ${item.threat}`}>{item.threat}</span>
        </div>
      )} />
    </div>
  )
}

// ── Tab 2: Gig Generator ───────────────────────────────────────────────────

function GigTab() {
  const { t } = useLanguage()
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function rollField(field) {
    return pickRandom(GIG_TABLES[field])
  }

  function rollAll() {
    const gig = {
      id: Date.now(),
      client: rollField('clients'),
      job: rollField('jobs'),
      complication: rollField('complications'),
      payment: rollField('payments'),
    }
    setResult(gig)
    setHistory(prev => [gig, ...prev].slice(0, 20))
  }

  function rollSingle(field) {
    const value = rollField(field)
    const gig = { ...result, id: Date.now(), [field]: value }
    setResult(gig)
  }

  return (
    <div>
      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>
        {t('cpSTGigHint')}
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={rollAll}>{t('cpSTRollGig')}</button>
        {result && (
          <>
            <button className="btn btn-secondary" onClick={() => rollSingle('clients')}>{t('cpSTRerollClient')}</button>
            <button className="btn btn-secondary" onClick={() => rollSingle('jobs')}>{t('cpSTRerollJob')}</button>
            <button className="btn btn-secondary" onClick={() => rollSingle('complications')}>{t('cpSTRerollComplication')}</button>
            <button className="btn btn-secondary" onClick={() => rollSingle('payments')}>{t('cpSTRerollPayment')}</button>
          </>
        )}
      </div>

      {result && (
        <ResultCard>
          <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
            <div><strong>{t('cpSTClient')}:</strong> {result.client}</div>
            <div><strong>{t('cpSTJob')}:</strong> {result.job}</div>
            <div><strong>{t('cpSTComplication')}:</strong> {result.complication}</div>
            <div><strong>{t('cpSTPayment')}:</strong> {result.payment}</div>
          </div>
        </ResultCard>
      )}

      <HistoryPanel items={history} label="Gig history" renderItem={(item) => (
        <div style={{ fontSize: '0.85rem' }}>
          <strong>{item.job?.slice(0, 50)}...</strong>
        </div>
      )} />
    </div>
  )
}

// ── Tab 3: Contact Generator ────────────────────────────────────────────────

function ContactTab() {
  const { t } = useLanguage()
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function generate() {
    const contact = {
      id: Date.now(),
      name: pickRandom(CONTACT_TABLES.names),
      role: pickRandom(CONTACT_TABLES.roles),
      personality: pickRandom(CONTACT_TABLES.personalities),
      want: pickRandom(CONTACT_TABLES.wants),
    }
    setResult(contact)
    setHistory(prev => [contact, ...prev].slice(0, 30))
  }

  return (
    <div>
      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>
        {t('cpSTContactHint')}
      </p>
      <button className="btn btn-primary" onClick={generate}>
        {result ? t('cpSTGenerateAnother') : t('cpSTGenerateContact')}
      </button>

      {result && (
        <ResultCard>
          <h3 style={{ margin: '0 0 var(--space-sm) 0', color: 'var(--accent)' }}>
            {result.name}
          </h3>
          <div style={{ display: 'grid', gap: 'var(--space-xs)' }}>
            <div><strong>{t('cpSTRole')}:</strong> {result.role}</div>
            <div><strong>{t('cpSTPersonality')}:</strong> {result.personality}</div>
            <div><strong>{t('cpSTWant')}:</strong> {result.want}</div>
          </div>
        </ResultCard>
      )}

      <HistoryPanel items={history} label="Contact history" renderItem={(item) => (
        <div style={{ fontSize: '0.85rem' }}>
          <strong>{item.name}</strong> — {item.role}
        </div>
      )} />
    </div>
  )
}

// ── Tab 4: Netrunning ───────────────────────────────────────────────────────

function NetrunningTab() {
  const { t } = useLanguage()
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function roll() {
    const enc = pickRandom(NETRUNNING_ENCOUNTERS)
    const entry = { id: Date.now(), ...enc }
    setResult(entry)
    setHistory(prev => [entry, ...prev].slice(0, 20))
  }

  function typeColor(type) {
    if (type === 'Black ICE' || type === 'Anti-Personnel') return '#fa5252'
    if (type === 'Rogue AI' || type === 'Anomaly') return '#845ef7'
    if (type === 'Trap' || type === 'Stealth ICE') return '#fcc419'
    return '#4dabf7'
  }

  return (
    <div>
      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>
        {t('cpSTNetrunHint')}
      </p>
      <button className="btn btn-primary" onClick={roll}>
        {result ? t('cpSTRollAnother') : t('cpSTRollNetrun')}
      </button>

      {result && (
        <ResultCard>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
            <h3 style={{ margin: 0, color: 'var(--accent)' }}>{result.name}</h3>
            <span style={{
              fontSize: '0.75rem', padding: '2px 8px', borderRadius: '3px',
              background: `${typeColor(result.type)}22`, color: typeColor(result.type), fontWeight: 600,
            }} aria-label={`Encounter type: ${result.type}`}>{result.type}</span>
          </div>
          <p style={{ margin: 0, lineHeight: 1.6 }}>{result.description}</p>
        </ResultCard>
      )}

      <HistoryPanel items={history} label="Netrunning encounter history" renderItem={(item) => (
        <div style={{ fontSize: '0.85rem' }}>
          <strong>{item.name}</strong> — <span style={{ color: typeColor(item.type) }} aria-label={`Encounter type: ${item.type}`}>{item.type}</span>
        </div>
      )} />
    </div>
  )
}

// ── Tab 5: Lifepath Events ──────────────────────────────────────────────────

function LifepathTab() {
  const { t } = useLanguage()
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function roll() {
    const event = pickRandom(LIFEPATH_EVENTS)
    const entry = { id: Date.now(), text: event }
    setResult(entry)
    setHistory(prev => [entry, ...prev].slice(0, 20))
  }

  return (
    <div>
      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>
        {t('cpSTLifepathHint')}
      </p>
      <button className="btn btn-primary" onClick={roll}>
        {result ? t('cpSTRollAnother') : t('cpSTRollLifepath')}
      </button>

      {result && (
        <ResultCard>
          <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.6 }}>{result.text}</p>
        </ResultCard>
      )}

      <HistoryPanel items={history} label="Lifepath event history" renderItem={(item) => (
        <div style={{ fontSize: '0.85rem' }}>{item.text}</div>
      )} />
    </div>
  )
}

// ── Main Component ──────────────────────────────────────────────────────────

const TABS = [
  { key: 'encounter', label: 'cpSTTabEncounter' },
  { key: 'gig', label: 'cpSTTabGig' },
  { key: 'contact', label: 'cpSTTabContact' },
  { key: 'netrunning', label: 'cpSTTabNetrunning' },
  { key: 'lifepath', label: 'cpSTTabLifepath' },
]

export default function CyberpunkSTTools() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('encounter')

  useEffect(() => { switchTheme('cyberpunk') }, [])

  return (
    <section aria-labelledby="cp-st-tools-heading">
      <div className="character-list-header">
        <div>
          <button className="btn btn-secondary" onClick={() => navigate('/cyberpunk')} style={{ marginRight: 'var(--space-sm)' }}>
            {t('back')}
          </button>
          <h2 id="cp-st-tools-heading" style={{ display: 'inline' }}>{t('cpSTTools')}</h2>
        </div>
      </div>

      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>{t('cpSTToolsDesc')}</p>

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
        {activeTab === 'encounter' && <EncounterTab />}
        {activeTab === 'gig' && <GigTab />}
        {activeTab === 'contact' && <ContactTab />}
        {activeTab === 'netrunning' && <NetrunningTab />}
        {activeTab === 'lifepath' && <LifepathTab />}
      </div>
    </section>
  )
}
