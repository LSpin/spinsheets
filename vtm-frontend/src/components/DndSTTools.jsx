import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import {
  ENCOUNTERS, TREASURE_TABLES, NPC_TABLES,
  TAVERN_SHOP_TABLES, DUNGEON_FEATURES,
} from '../data/dndSTTools'

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
        {open ? t('dndSTHideHistory') : t('dndSTShowHistory')} ({items.length})
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

const ENVIRONMENTS = ['forest', 'urban', 'dungeon', 'wilderness', 'underdark']

function EncounterTab() {
  const { t } = useLanguage()
  const [env, setEnv] = useState('forest')
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function roll() {
    const encounter = pickRandom(ENCOUNTERS[env])
    const entry = { id: Date.now(), environment: env, text: encounter }
    setResult(entry)
    setHistory(prev => [entry, ...prev].slice(0, 20))
  }

  return (
    <div>
      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>
        {t('dndSTEncounterHint')}
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 'var(--space-md)' }}>
        <div className="field" style={{ flex: '0 0 180px' }}>
          <label htmlFor="dnd-env">{t('dndSTEnvironment')}</label>
          <select id="dnd-env" value={env} onChange={e => setEnv(e.target.value)}>
            {ENVIRONMENTS.map(e => (
              <option key={e} value={e}>{t(`dndSTEnv_${e}`)}</option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" onClick={roll}>
          {result ? t('dndSTRollAnother') : t('dndSTRollEncounter')}
        </button>
      </div>

      {result && (
        <ResultCard>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.05em', marginBottom: 'var(--space-xs)' }}>
            {t(`dndSTEnv_${result.environment}`)}
          </div>
          <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.6 }}>{result.text}</p>
        </ResultCard>
      )}

      <HistoryPanel items={history} label="Encounter history" renderItem={(item) => (
        <div style={{ fontSize: '0.85rem' }}>
          <strong>{t(`dndSTEnv_${item.environment}`)}</strong> — {item.text.slice(0, 60)}...
        </div>
      )} />
    </div>
  )
}

// ── Tab 2: Treasure Generator ───────────────────────────────────────────────

const TIER_KEYS = ['tier1', 'tier2', 'tier3', 'tier4']

function TreasureTab() {
  const { t } = useLanguage()
  const [tier, setTier] = useState('tier1')
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function roll() {
    const table = TREASURE_TABLES[tier]
    const treasure = {
      id: Date.now(),
      tier: table.label,
      coins: pickRandom(table.coins),
      gem: pickRandom(table.gems),
      artObject: pickRandom(table.artObjects),
      magicItem: pickRandom(table.magicItems),
    }
    setResult(treasure)
    setHistory(prev => [treasure, ...prev].slice(0, 20))
  }

  return (
    <div>
      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>
        {t('dndSTTreasureHint')}
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 'var(--space-md)' }}>
        <div className="field" style={{ flex: '0 0 200px' }}>
          <label htmlFor="dnd-tier">{t('dndSTTier')}</label>
          <select id="dnd-tier" value={tier} onChange={e => setTier(e.target.value)}>
            {TIER_KEYS.map(k => (
              <option key={k} value={k}>{TREASURE_TABLES[k].label}</option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" onClick={roll}>
          {result ? t('dndSTRollAnother') : t('dndSTRollTreasure')}
        </button>
      </div>

      {result && (
        <ResultCard>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: '#fcc419', letterSpacing: '0.05em', marginBottom: 'var(--space-sm)' }}>
            {result.tier}
          </div>
          <div style={{ display: 'grid', gap: 'var(--space-xs)' }}>
            <div><strong>{t('dndSTCoins')}:</strong> {result.coins}</div>
            <div><strong>{t('dndSTGem')}:</strong> {result.gem}</div>
            <div><strong>{t('dndSTArtObject')}:</strong> {result.artObject}</div>
            <div><strong>{t('dndSTMagicItem')}:</strong> {result.magicItem}</div>
          </div>
        </ResultCard>
      )}

      <HistoryPanel items={history} label="Treasure history" renderItem={(item) => (
        <div style={{ fontSize: '0.85rem' }}>
          <strong>{item.tier}</strong> — {item.magicItem}
        </div>
      )} />
    </div>
  )
}

// ── Tab 3: NPC Generator ────────────────────────────────────────────────────

function NPCTab() {
  const { t } = useLanguage()
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function generate() {
    const npc = {
      id: Date.now(),
      name: pickRandom(NPC_TABLES.names),
      race: pickRandom(NPC_TABLES.races),
      trait: pickRandom(NPC_TABLES.traits),
      ideal: pickRandom(NPC_TABLES.ideals),
      bond: pickRandom(NPC_TABLES.bonds),
      flaw: pickRandom(NPC_TABLES.flaws),
      secret: pickRandom(NPC_TABLES.secrets),
    }
    setResult(npc)
    setHistory(prev => [npc, ...prev].slice(0, 30))
  }

  return (
    <div>
      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>
        {t('dndSTNPCHint')}
      </p>
      <button className="btn btn-primary" onClick={generate}>
        {result ? t('dndSTGenerateAnother') : t('dndSTGenerateNPC')}
      </button>

      {result && (
        <ResultCard>
          <h3 style={{ margin: '0 0 var(--space-xs) 0', color: 'var(--accent)' }}>
            {result.name}
          </h3>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: 'var(--space-sm)' }}>
            {result.race}
          </div>
          <div style={{ display: 'grid', gap: 'var(--space-xs)' }}>
            <div><strong>{t('dndSTTrait')}:</strong> {result.trait}</div>
            <div><strong>{t('dndSTIdeal')}:</strong> {result.ideal}</div>
            <div><strong>{t('dndSTBond')}:</strong> {result.bond}</div>
            <div><strong>{t('dndSTFlaw')}:</strong> {result.flaw}</div>
            <div><strong>{t('dndSTSecret')}:</strong> {result.secret}</div>
          </div>
        </ResultCard>
      )}

      <HistoryPanel items={history} label="NPC history" renderItem={(item) => (
        <div style={{ fontSize: '0.85rem' }}>
          <strong>{item.name}</strong> ({item.race}) — {item.trait.slice(0, 40)}...
        </div>
      )} />
    </div>
  )
}

// ── Tab 4: Tavern / Shop ────────────────────────────────────────────────────

function TavernShopTab() {
  const { t } = useLanguage()
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function generate() {
    const entry = {
      id: Date.now(),
      tavernName: pickRandom(TAVERN_SHOP_TABLES.tavernNames),
      shopType: pickRandom(TAVERN_SHOP_TABLES.shopTypes),
      proprietor: pickRandom(TAVERN_SHOP_TABLES.proprietorQuirks),
      rumor: pickRandom(TAVERN_SHOP_TABLES.rumors),
    }
    setResult(entry)
    setHistory(prev => [entry, ...prev].slice(0, 20))
  }

  return (
    <div>
      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>
        {t('dndSTTavernHint')}
      </p>
      <button className="btn btn-primary" onClick={generate}>
        {result ? t('dndSTGenerateAnother') : t('dndSTGenerateTavern')}
      </button>

      {result && (
        <ResultCard>
          <h3 style={{ margin: '0 0 var(--space-sm) 0', color: 'var(--accent)' }}>
            {result.tavernName}
          </h3>
          <div style={{ display: 'grid', gap: 'var(--space-xs)' }}>
            <div><strong>{t('dndSTNearbyShop')}:</strong> {result.shopType}</div>
            <div><strong>{t('dndSTProprietor')}:</strong> {result.proprietor}</div>
            <div><strong>{t('dndSTRumor')}:</strong> {result.rumor}</div>
          </div>
        </ResultCard>
      )}

      <HistoryPanel items={history} label="Tavern history" renderItem={(item) => (
        <div style={{ fontSize: '0.85rem' }}>
          <strong>{item.tavernName}</strong> — {item.rumor.slice(0, 50)}...
        </div>
      )} />
    </div>
  )
}

// ── Tab 5: Dungeon Room ─────────────────────────────────────────────────────

function DungeonTab() {
  const { t } = useLanguage()
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  function generate() {
    const entry = {
      id: Date.now(),
      room: pickRandom(DUNGEON_FEATURES.roomTypes),
      hazard: pickRandom(DUNGEON_FEATURES.hazards),
      discovery: pickRandom(DUNGEON_FEATURES.discoveries),
    }
    setResult(entry)
    setHistory(prev => [entry, ...prev].slice(0, 20))
  }

  return (
    <div>
      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>
        {t('dndSTDungeonHint')}
      </p>
      <button className="btn btn-primary" onClick={generate}>
        {result ? t('dndSTGenerateAnother') : t('dndSTGenerateRoom')}
      </button>

      {result && (
        <ResultCard>
          <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
            <div><strong>{t('dndSTRoomType')}:</strong> {result.room}</div>
            <div><strong>{t('dndSTHazard')}:</strong> <span style={{ color: '#fa5252' }} aria-label={`Hazard: ${result.hazard}`}>{result.hazard}</span></div>
            <div><strong>{t('dndSTDiscovery')}:</strong> <span style={{ color: '#51cf66' }} aria-label={`Discovery: ${result.discovery}`}>{result.discovery}</span></div>
          </div>
        </ResultCard>
      )}

      <HistoryPanel items={history} label="Dungeon room history" renderItem={(item) => (
        <div style={{ fontSize: '0.85rem' }}>
          <strong>{item.room.slice(0, 40)}...</strong>
        </div>
      )} />
    </div>
  )
}

// ── Main Component ──────────────────────────────────────────────────────────

const TABS = [
  { key: 'encounter', label: 'dndSTTabEncounter' },
  { key: 'treasure', label: 'dndSTTabTreasure' },
  { key: 'npc', label: 'dndSTTabNPC' },
  { key: 'tavern', label: 'dndSTTabTavern' },
  { key: 'dungeon', label: 'dndSTTabDungeon' },
]

export default function DndSTTools() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('encounter')

  useEffect(() => { switchTheme('dnd') }, [])

  return (
    <section aria-labelledby="dnd-st-tools-heading">
      <div className="character-list-header">
        <div>
          <button className="btn btn-secondary" onClick={() => navigate('/dnd')} style={{ marginRight: 'var(--space-sm)' }}>
            {t('back')}
          </button>
          <h2 id="dnd-st-tools-heading" style={{ display: 'inline' }}>{t('dndSTTools')}</h2>
        </div>
      </div>

      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>{t('dndSTToolsDesc')}</p>

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
        {activeTab === 'treasure' && <TreasureTab />}
        {activeTab === 'npc' && <NPCTab />}
        {activeTab === 'tavern' && <TavernShopTab />}
        {activeTab === 'dungeon' && <DungeonTab />}
      </div>
    </section>
  )
}
