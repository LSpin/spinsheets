import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { SEVEN_SEA_NATIONS } from '../data/sevenSeaData'
import {
  ADVENTURE_HOOKS, ADVENTURE_LOCATIONS, ADVENTURE_COMPLICATIONS, VILLAIN_MOTIVATIONS,
  SHIP_WEATHER, ENEMY_SHIP_TYPES, ENCOUNTER_TYPES,
  THEAN_NAMES, NPC_PERSONALITIES, NPC_SECRETS,
} from '../data/sevenSeaSTTools'

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ── Shared UI ────────────────────────────────────────────────────────────────

function ResultCard({ children, style }) {
  return (
    <div className="character-card mt-md" role="status" aria-live="polite" style={{
      padding: 'var(--space-lg)',
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
    <div className="mt-md">
      <button className="btn btn-secondary" onClick={() => setOpen(!open)}
        aria-expanded={open} style={{ fontSize: '0.82rem' }}>
        {open ? t('bladesSTHideHistory') : t('bladesSTShowHistory')} ({items.length})
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

// ── Tab 1: Adventure Generator ───────────────────────────────────────────────

function AdventureGeneratorTab() {
  const { t } = useLanguage()
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function rollAll() {
    const adv = {
      id: Date.now(),
      hook: pickRandom(ADVENTURE_HOOKS),
      location: pickRandom(ADVENTURE_LOCATIONS),
      complication: pickRandom(ADVENTURE_COMPLICATIONS),
      villainMotive: pickRandom(VILLAIN_MOTIVATIONS),
    }
    setResult(adv)
    setHistory(prev => [adv, ...prev].slice(0, 20))
  }

  function rollSingle(field) {
    const tables = { hook: ADVENTURE_HOOKS, location: ADVENTURE_LOCATIONS, complication: ADVENTURE_COMPLICATIONS, villainMotive: VILLAIN_MOTIVATIONS }
    const value = pickRandom(tables[field])
    const updated = { ...result, id: Date.now(), [field]: value }
    setResult(updated)
  }

  return (
    <div>
      <p className="muted-hint mb-md">{t('sevenSeaSTAdventureHint')}</p>
      <div className="flex gap-sm flex-wrap">
        <button className="btn btn-primary" onClick={rollAll}>{t('sevenSeaSTRollAll')}</button>
        {result && (
          <>
            <button className="btn btn-secondary" onClick={() => rollSingle('hook')}>{t('sevenSeaSTRerollHook')}</button>
            <button className="btn btn-secondary" onClick={() => rollSingle('location')}>{t('sevenSeaSTRerollLocation')}</button>
            <button className="btn btn-secondary" onClick={() => rollSingle('complication')}>{t('sevenSeaSTRerollComplication')}</button>
            <button className="btn btn-secondary" onClick={() => rollSingle('villainMotive')}>{t('sevenSeaSTRerollMotive')}</button>
          </>
        )}
      </div>
      {result && (
        <ResultCard>
          <div className="grid gap-sm">
            <div><strong>{t('sevenSeaSTHook')}:</strong> {result.hook}</div>
            <div><strong>{t('sevenSeaSTLocation')}:</strong> {result.location}</div>
            <div><strong>{t('sevenSeaSTComplication')}:</strong> {result.complication}</div>
            <div><strong>{t('sevenSeaSTVillainMotive')}:</strong> {result.villainMotive}</div>
          </div>
        </ResultCard>
      )}
      <HistoryPanel items={history} label="Adventure history" renderItem={(item) => (
        <div className="text-base"><strong>{item.hook.slice(0, 60)}...</strong></div>
      )} />
    </div>
  )
}

// ── Tab 2: Ship Encounter ────────────────────────────────────────────────────

function ShipEncounterTab() {
  const { t } = useLanguage()
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function rollAll() {
    const enc = {
      id: Date.now(),
      weather: pickRandom(SHIP_WEATHER),
      enemyShip: pickRandom(ENEMY_SHIP_TYPES),
      encounterType: pickRandom(ENCOUNTER_TYPES),
    }
    setResult(enc)
    setHistory(prev => [enc, ...prev].slice(0, 20))
  }

  function rollSingle(field) {
    const tables = { weather: SHIP_WEATHER, enemyShip: ENEMY_SHIP_TYPES, encounterType: ENCOUNTER_TYPES }
    const value = pickRandom(tables[field])
    const updated = { ...result, id: Date.now(), [field]: value }
    setResult(updated)
  }

  return (
    <div>
      <p className="muted-hint mb-md">{t('sevenSeaSTShipHint')}</p>
      <div className="flex gap-sm flex-wrap">
        <button className="btn btn-primary" onClick={rollAll}>{t('sevenSeaSTRollEncounter')}</button>
        {result && (
          <>
            <button className="btn btn-secondary" onClick={() => rollSingle('weather')}>{t('sevenSeaSTRerollWeather')}</button>
            <button className="btn btn-secondary" onClick={() => rollSingle('enemyShip')}>{t('sevenSeaSTRerollShip')}</button>
            <button className="btn btn-secondary" onClick={() => rollSingle('encounterType')}>{t('sevenSeaSTRerollType')}</button>
          </>
        )}
      </div>
      {result && (
        <ResultCard>
          <div className="grid gap-sm">
            <div><strong>{t('sevenSeaSTWeather')}:</strong> {result.weather}</div>
            <div><strong>{t('sevenSeaSTEnemyShip')}:</strong> {result.enemyShip}</div>
            <div><strong>{t('sevenSeaSTEncounterType')}:</strong> {result.encounterType}</div>
          </div>
        </ResultCard>
      )}
      <HistoryPanel items={history} label="Ship encounter history" renderItem={(item) => (
        <div className="text-base"><strong>{item.encounterType.split(' — ')[0]}</strong> — {item.weather.split(' — ')[0]}</div>
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
      name: pickRandom(THEAN_NAMES),
      nation: pickRandom(SEVEN_SEA_NATIONS).value,
      personality: pickRandom(NPC_PERSONALITIES),
      secret: pickRandom(NPC_SECRETS),
    }
    setResult(npc)
    setHistory(prev => [npc, ...prev].slice(0, 30))
  }

  return (
    <div>
      <p className="muted-hint mb-md">{t('sevenSeaSTNPCHint')}</p>
      <button className="btn btn-primary" onClick={generateNPC}>
        {result ? t('bladesSTGenerateAnother') : t('bladesSTGenerateNPC')}
      </button>
      {result && (
        <ResultCard>
          <h3 style={{ margin: '0 0 var(--space-sm) 0', color: 'var(--accent)' }}>{result.name}</h3>
          <div className="grid gap-xs">
            <div><strong>{t('7sNation')}:</strong> {result.nation}</div>
            <div><strong>{t('sevenSeaSTPersonality')}:</strong> {result.personality}</div>
            <div><strong>{t('sevenSeaSTSecret')}:</strong> {result.secret}</div>
          </div>
        </ResultCard>
      )}
      <HistoryPanel items={history} label="NPC history" renderItem={(item) => (
        <div className="text-base"><strong>{item.name}</strong> — {item.nation}</div>
      )} />
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────────────────────

const TABS = [
  { key: 'adventure', label: 'sevenSeaSTTabAdventure' },
  { key: 'ship', label: 'sevenSeaSTTabShip' },
  { key: 'npc', label: 'sevenSeaSTTabNPC' },
]

export default function SeventhSeaSTTools() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('adventure')

  useEffect(() => { switchTheme('7thsea') }, [])

  return (
    <section aria-labelledby="ss-st-tools-heading">
      <div className="character-list-header">
        <div>
          <button className="btn btn-secondary mr-sm" onClick={() => navigate('/7thsea')}>
            {t('back')}
          </button>
          <h2 id="ss-st-tools-heading" style={{ display: 'inline' }}>{t('sevenSeaSTTools')}</h2>
        </div>
      </div>

      <p className="muted-hint mb-md">{t('sevenSeaSTToolsDesc')}</p>

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
        {activeTab === 'adventure' && <AdventureGeneratorTab />}
        {activeTab === 'ship' && <ShipEncounterTab />}
        {activeTab === 'npc' && <NPCGeneratorTab />}
      </div>
    </section>
  )
}
