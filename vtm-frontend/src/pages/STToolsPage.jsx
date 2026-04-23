import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'

const ST_TOOLS = [
  { path: '/characters/st-tools', theme: 'wod', cls: 'system-card--wod', nameKey: 'systemWoD', tabs: 7,
    tools: 'Feeding Scenes, Spirit Encounters, Paradox Events, Frenzy Reference, NPC Generator, City Events, Scene Complications' },
  { path: '/7thsea/st-tools', theme: '7thsea', cls: 'system-card--7thsea', nameKey: 'system7thSea', tabs: 3,
    tools: 'Adventure Generator, Ship Encounters, NPC Generator' },
  { path: '/l5r/st-tools', theme: 'l5r', cls: 'system-card--l5r', nameKey: 'systemL5R', tabs: 3,
    tools: 'Court Intrigue, Samurai NPC Generator, Seasonal Events' },
  { path: '/blades/st-tools', theme: 'blades', cls: 'system-card--blades', nameKey: 'systemBlades', tabs: 7,
    tools: 'Score Generator, Entanglements, NPC Generator, Faction Turn, Downtime Events, Devil\'s Bargain, Campaign Clocks' },
  { path: '/dnd/st-tools', theme: 'dnd', cls: 'system-card--dnd', nameKey: 'systemDnd', tabs: 5,
    tools: 'Encounters, Treasure, NPC Generator, Tavern/Shop, Dungeon Rooms' },
  { path: '/cyberpunk/st-tools', theme: 'cyberpunk', cls: 'system-card--cyberpunk', nameKey: 'systemCyberpunk', tabs: 5,
    tools: 'Night City Encounters, Gig Generator, Contacts, Netrunning, Lifepath Events' },
  { path: '/asoiaf/st-tools', theme: 'asoiaf', cls: 'system-card--asoiaf', nameKey: 'systemAsoiaf', tabs: 3,
    tools: 'House Events, Intrigue Generator, NPC Generator' },
]

export default function STToolsPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()

  useEffect(() => { switchTheme('wod') }, [])

  return (
    <section aria-labelledby="st-tools-heading">
      <div className="character-list-header">
        <h2 id="st-tools-heading">{t('stToolsTitle')}</h2>
      </div>
      <p className="muted-hint" style={{ marginBottom: 'var(--space-lg)', maxWidth: '40rem' }}>
        {t('stToolsSubtitle')}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
        {ST_TOOLS.map(tool => (
          <Link
            key={tool.path}
            to={tool.path}
            className={`system-card ${tool.cls}`}
            onClick={() => switchTheme(tool.theme)}
            aria-label={`${t(tool.nameKey)} — ${t('stToolsOpenTools')}`}
            style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', padding: 'var(--space-lg)', borderRadius: 'var(--radius)', minHeight: '160px' }}
          >
            <h3 style={{ margin: '0 0 var(--space-xs) 0', fontSize: '1.1rem' }}>{t(tool.nameKey)}</h3>
            <p style={{ fontSize: '0.85rem', opacity: 0.9, margin: '0 0 var(--space-sm) 0' }}>
              <strong>{tool.tabs}</strong> {t('stToolsTabs')}
            </p>
            <p style={{ fontSize: '0.78rem', opacity: 0.75, lineHeight: 1.5, margin: '0 0 auto 0' }}>
              {tool.tools}
            </p>
            <span className="system-card-cta" style={{ marginTop: 'var(--space-sm)' }}>{t('stToolsOpenTools')}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
