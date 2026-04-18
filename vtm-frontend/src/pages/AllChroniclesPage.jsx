import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import { getChronicles, deleteChronicle } from '../api/chronicleApi'

const SYSTEMS = [
  { key: 'ALL', labelKey: 'allSystems', badge: null },
  { key: 'WOD', labelKey: 'systemWoD', badge: 'splat-badge--vampire', basePath: '/chronicles', theme: 'wod' },
  { key: 'SEVENTH_SEA', labelKey: 'system7thSea', badge: 'splat-badge--seventh-sea', basePath: '/7thsea/chronicles', theme: '7thsea' },
  { key: 'L5R', labelKey: 'systemL5R', badge: 'splat-badge--l5r', basePath: '/l5r/chronicles', theme: 'l5r' },
  { key: 'BLADES', labelKey: 'systemBlades', badge: 'splat-badge--blades', basePath: '/blades/chronicles', theme: 'blades' },
  { key: 'DND', labelKey: 'systemDnd', badge: 'splat-badge--dnd', basePath: '/dnd/chronicles', theme: 'dnd' },
  { key: 'UESTRPG', labelKey: 'systemUestrpg', badge: 'splat-badge--uestrpg', basePath: '/uestrpg/chronicles', theme: 'uestrpg' },
]

function getSystemInfo(gameSystem) {
  return SYSTEMS.find(s => s.key === (gameSystem || 'WOD')) || SYSTEMS[1]
}

export default function AllChroniclesPage() {
  const [chronicles, setChronicles] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { user, isST } = useAuth()
  const { t } = useLanguage()

  useEffect(() => {
    async function load() {
      try {
        const res = await getChronicles()
        setChronicles(res.data)
      } catch {
        setError(t('failedLoadChronicles'))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleDelete(id, name) {
    if (!confirm(t('confirmDeleteChronicle').replace('{0}', name))) return
    try {
      await deleteChronicle(id)
      setChronicles(prev => prev.filter(c => c.id !== id))
    } catch {
      setError(t('failedDeleteChronicle'))
    }
  }

  const filtered = filter === 'ALL'
    ? chronicles
    : chronicles.filter(c => (c.gameSystem || 'WOD') === filter)

  // Group by system for display
  const grouped = {}
  for (const c of filtered) {
    const sys = c.gameSystem || 'WOD'
    if (!grouped[sys]) grouped[sys] = []
    grouped[sys].push(c)
  }

  return (
    <section aria-labelledby="all-chronicles-heading">
      <div className="character-list-header">
        <h2 id="all-chronicles-heading">{t('allChronicles')}</h2>
      </div>

      {error && <p className="status-error" role="alert">{error}</p>}

      {/* System filter tabs */}
      <div className="tab-list" role="tablist" style={{ marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
        {SYSTEMS.map(sys => {
          const count = sys.key === 'ALL'
            ? chronicles.length
            : chronicles.filter(c => (c.gameSystem || 'WOD') === sys.key).length
          return (
            <button
              key={sys.key}
              role="tab"
              aria-selected={filter === sys.key}
              className={`btn btn-secondary${filter === sys.key ? ' tab-btn--active' : ''}`}
              onClick={() => setFilter(sys.key)}
            >
              {t(sys.labelKey)} ({count})
            </button>
          )
        })}
      </div>

      {loading && <p className="status-loading" aria-live="polite">{t('loading')}</p>}

      {!loading && filtered.length === 0 && (
        <div className="empty-state">
          <p>{t('noChroniclesYet')}</p>
          {isST && <p>{t('stCreateChronicle')}</p>}
        </div>
      )}

      {!loading && Object.entries(grouped).map(([sys, items]) => {
        const info = getSystemInfo(sys)
        return (
          <div key={sys} style={{ marginBottom: 'var(--space-xl)' }}>
            {filter === 'ALL' && (
              <h3 style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <span className={`splat-badge ${info.badge || ''}`} style={{ fontSize: '0.85rem' }}>
                  {t(info.labelKey)}
                </span>
                <span className="muted-hint muted-hint--xs">({items.length})</span>
                {isST && (
                  <button className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}
                    onClick={() => navigate(`${info.basePath}/new`)}>
                    + {t('newChronicle')}
                  </button>
                )}
              </h3>
            )}
            {filter !== 'ALL' && isST && (
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <button className="btn btn-primary" onClick={() => navigate(`${info.basePath}/new`)}>
                  {t(info.labelKey)} — {t('newChronicle')}
                </button>
              </div>
            )}
            <ul className="character-list" aria-label={`${t(info.labelKey)} ${t('chroniclesTitle')}`}>
              {items.map(c => {
                const cInfo = getSystemInfo(c.gameSystem)
                return (
                  <li key={c.id} className="character-card">
                    <div className="character-card-info">
                      <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                        {c.name}
                        <span className={`splat-badge ${cInfo.badge || ''}`} style={{ fontSize: '0.72rem' }}>
                          {t(cInfo.labelKey)}
                        </span>
                      </h3>
                      {c.description && (
                        <p className="character-card-meta" style={{ marginTop: '0.25rem' }}>{c.description}</p>
                      )}
                      <dl className="character-card-meta">
                        {c.storyteller && (
                          <>
                            <dt className="sr-only">{t('storytellerRole')}</dt>
                            <dd>{t('roleST')}: {c.storyteller.username}</dd>
                          </>
                        )}
                      </dl>
                    </div>
                    <div className="character-card-actions">
                      <button className="btn btn-secondary"
                        onClick={() => navigate(`${cInfo.basePath}/${c.id}`)}
                        aria-label={`${t('viewBtn')} ${c.name}`}>
                        {t('viewBtn')}
                      </button>
                      {isST && c.storyteller?.id === user.userId && (
                        <button className="btn btn-danger"
                          onClick={() => handleDelete(c.id, c.name)}
                          aria-label={`${t('deleteBtn')} ${c.name}`}>
                          {t('deleteBtn')}
                        </button>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </section>
  )
}
