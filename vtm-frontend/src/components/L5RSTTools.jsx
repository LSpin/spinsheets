import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import {
  COURT_PETITIONERS, COURT_REQUESTS, COURT_HIDDEN_MOTIVES, COURT_COMPLICATIONS,
  SAMURAI_FAMILY_NAMES, SAMURAI_PERSONALITIES, SAMURAI_DUTIES, SAMURAI_SECRETS,
  SEASONAL_EVENTS,
} from '../data/l5rSTTools'

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

const L5R_CLANS = [
  'Crab', 'Crane', 'Dragon', 'Lion', 'Mantis', 'Phoenix', 'Scorpion', 'Unicorn',
  'Spider', 'Imperial', 'Minor Clan', 'Ronin',
]

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

// ── Tab 1: Court Intrigue ────────────────────────────────────────────────────

function CourtIntrigueTab() {
  const { t } = useLanguage()
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function rollAll() {
    const intrigue = {
      id: Date.now(),
      petitioner: pickRandom(COURT_PETITIONERS),
      request: pickRandom(COURT_REQUESTS),
      hiddenMotive: pickRandom(COURT_HIDDEN_MOTIVES),
      complication: pickRandom(COURT_COMPLICATIONS),
    }
    setResult(intrigue)
    setHistory(prev => [intrigue, ...prev].slice(0, 20))
  }

  function rollSingle(field) {
    const tables = { petitioner: COURT_PETITIONERS, request: COURT_REQUESTS, hiddenMotive: COURT_HIDDEN_MOTIVES, complication: COURT_COMPLICATIONS }
    const value = pickRandom(tables[field])
    const updated = { ...result, id: Date.now(), [field]: value }
    setResult(updated)
  }

  return (
    <div>
      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>{t('l5rSTCourtHint')}</p>
      <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={rollAll}>{t('l5rSTRollIntrigue')}</button>
        {result && (
          <>
            <button className="btn btn-secondary" onClick={() => rollSingle('petitioner')}>{t('l5rSTRerollPetitioner')}</button>
            <button className="btn btn-secondary" onClick={() => rollSingle('request')}>{t('l5rSTRerollRequest')}</button>
            <button className="btn btn-secondary" onClick={() => rollSingle('hiddenMotive')}>{t('l5rSTRerollMotive')}</button>
            <button className="btn btn-secondary" onClick={() => rollSingle('complication')}>{t('l5rSTRerollComplication')}</button>
          </>
        )}
      </div>
      {result && (
        <ResultCard>
          <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
            <div><strong>{t('l5rSTPetitioner')}:</strong> {result.petitioner}</div>
            <div><strong>{t('l5rSTRequest')}:</strong> {result.request}</div>
            <div><strong>{t('l5rSTHiddenMotive')}:</strong> {result.hiddenMotive}</div>
            <div><strong>{t('l5rSTComplication')}:</strong> {result.complication}</div>
          </div>
        </ResultCard>
      )}
      <HistoryPanel items={history} label="Court intrigue history" renderItem={(item) => (
        <div style={{ fontSize: '0.85rem' }}><strong>{item.petitioner.slice(0, 50)}...</strong></div>
      )} />
    </div>
  )
}

// ── Tab 2: NPC Generator ─────────────────────────────────────────────────────

function NPCGeneratorTab() {
  const { t } = useLanguage()
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function generateNPC() {
    const npc = {
      id: Date.now(),
      clan: pickRandom(L5R_CLANS),
      familyName: pickRandom(SAMURAI_FAMILY_NAMES),
      personality: pickRandom(SAMURAI_PERSONALITIES),
      duty: pickRandom(SAMURAI_DUTIES),
      secret: pickRandom(SAMURAI_SECRETS),
    }
    setResult(npc)
    setHistory(prev => [npc, ...prev].slice(0, 30))
  }

  return (
    <div>
      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>{t('l5rSTNPCHint')}</p>
      <button className="btn btn-primary" onClick={generateNPC}>
        {result ? t('bladesSTGenerateAnother') : t('bladesSTGenerateNPC')}
      </button>
      {result && (
        <ResultCard>
          <h3 style={{ margin: '0 0 var(--space-sm) 0', color: 'var(--accent)' }}>{result.familyName}</h3>
          <div style={{ display: 'grid', gap: 'var(--space-xs)' }}>
            <div><strong>{t('l5rClan')}:</strong> {result.clan}</div>
            <div><strong>{t('l5rSTPersonality')}:</strong> {result.personality}</div>
            <div><strong>{t('l5rSTDuty')}:</strong> {result.duty}</div>
            <div><strong>{t('l5rSTSecret')}:</strong> {result.secret}</div>
          </div>
        </ResultCard>
      )}
      <HistoryPanel items={history} label="NPC history" renderItem={(item) => (
        <div style={{ fontSize: '0.85rem' }}><strong>{item.familyName}</strong> — {item.clan} Clan</div>
      )} />
    </div>
  )
}

// ── Tab 3: Seasonal Events ───────────────────────────────────────────────────

function SeasonalEventsTab() {
  const { t } = useLanguage()
  const [season, setSeason] = useState('spring')
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function rollEvent() {
    const event = pickRandom(SEASONAL_EVENTS[season])
    const entry = { id: Date.now(), season, text: event }
    setResult(entry)
    setHistory(prev => [entry, ...prev].slice(0, 20))
  }

  return (
    <div>
      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>{t('l5rSTSeasonalHint')}</p>
      <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 'var(--space-md)' }}>
        <div className="field" style={{ flex: '0 0 160px' }}>
          <label htmlFor="season-select">{t('l5rSTSeason')}</label>
          <select id="season-select" value={season} onChange={e => setSeason(e.target.value)}>
            <option value="spring">{t('l5rSTSpring')}</option>
            <option value="summer">{t('l5rSTSummer')}</option>
            <option value="autumn">{t('l5rSTAutumn')}</option>
            <option value="winter">{t('l5rSTWinter')}</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={rollEvent}>{t('l5rSTRollEvent')}</button>
      </div>
      {result && (
        <ResultCard>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.05em', marginBottom: 'var(--space-xs)' }}>
            {t(`l5rST${result.season.charAt(0).toUpperCase() + result.season.slice(1)}`)}
          </div>
          <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.6 }}>{result.text}</p>
        </ResultCard>
      )}
      <HistoryPanel items={history} label="Seasonal event history" renderItem={(item) => (
        <div style={{ fontSize: '0.85rem' }}>
          <strong>{item.season.charAt(0).toUpperCase() + item.season.slice(1)}:</strong> {item.text.slice(0, 60)}...
        </div>
      )} />
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────────────────────

const TABS = [
  { key: 'court', label: 'l5rSTTabCourt' },
  { key: 'npc', label: 'l5rSTTabNPC' },
  { key: 'seasonal', label: 'l5rSTTabSeasonal' },
]

export default function L5RSTTools() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('court')

  useEffect(() => { switchTheme('l5r') }, [])

  return (
    <section aria-labelledby="l5r-st-tools-heading">
      <div className="character-list-header">
        <div>
          <button className="btn btn-secondary" onClick={() => navigate('/l5r')} style={{ marginRight: 'var(--space-sm)' }}>
            {t('back')}
          </button>
          <h2 id="l5r-st-tools-heading" style={{ display: 'inline' }}>{t('l5rSTTools')}</h2>
        </div>
      </div>

      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>{t('l5rSTToolsDesc')}</p>

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
        {activeTab === 'court' && <CourtIntrigueTab />}
        {activeTab === 'npc' && <NPCGeneratorTab />}
        {activeTab === 'seasonal' && <SeasonalEventsTab />}
      </div>
    </section>
  )
}
