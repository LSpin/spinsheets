import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import { getChronicles, deleteChronicle } from '../api/chronicleApi'
import ConfirmDialog from '../components/ConfirmDialog'
import useConfirm from '../hooks/useConfirm'

const SYSTEMS = [
  { key: 'ALL', labelKey: 'allSystems', badge: null },
  { key: 'WOD', labelKey: 'systemWoD', badge: 'splat-badge--vampire', basePath: '/chronicles', theme: 'wod' },
  { key: 'SEVENTH_SEA', labelKey: 'system7thSea', badge: 'splat-badge--seventh-sea', basePath: '/7thsea/chronicles', theme: '7thsea' },
  { key: 'L5R', labelKey: 'systemL5R', badge: 'splat-badge--l5r', basePath: '/l5r/chronicles', theme: 'l5r' },
  { key: 'BLADES', labelKey: 'systemBlades', badge: 'splat-badge--blades', basePath: '/blades/chronicles', theme: 'blades' },
  { key: 'DND', labelKey: 'systemDnd', badge: 'splat-badge--dnd', basePath: '/dnd/chronicles', theme: 'dnd' },
  { key: 'UESTRPG', labelKey: 'systemUestrpg', badge: 'splat-badge--uestrpg', basePath: '/uestrpg/chronicles', theme: 'uestrpg' },
  { key: 'CYBERPUNK', labelKey: 'systemCyberpunk', badge: 'splat-badge--cyberpunk', basePath: '/cyberpunk/chronicles', theme: 'cyberpunk' },
  { key: 'ASOIAF', labelKey: 'systemAsoiaf', badge: 'splat-badge--asoiaf', basePath: '/asoiaf/chronicles', theme: 'asoiaf' },
]

const CREATABLE_SYSTEMS = SYSTEMS.filter(s => s.key !== 'ALL')

function getSystemInfo(gameSystem) {
  return SYSTEMS.find(s => s.key === (gameSystem || 'WOD')) || SYSTEMS[1]
}

export default function AllChroniclesPage() {
  const [chronicles, setChronicles] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const navigate = useNavigate()
  const { user, isST } = useAuth()
  const { t } = useLanguage()
  const { confirm, confirmDialogProps } = useConfirm()

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
    const ok = await confirm(t('confirmDeleteChronicle').replace('{0}', name), t('deleteBtn'))
    if (!ok) return
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

  return (
    <section aria-labelledby="all-chronicles-heading">
      <div className="character-list-header">
        <h2 id="all-chronicles-heading">{t('allChronicles')}</h2>
        {isST && (
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            {t('createChronicleBtn')}
          </button>
        )}
      </div>

      {error && <p className="status-error" role="alert">{error}</p>}

      {/* System filter tabs */}
      <div className="tab-list flex-wrap mb-lg" role="tablist">
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

      {!loading && filtered.length > 0 && (
        <ul className="character-list" aria-label={t('chroniclesTitle')}>
          {filtered.map(c => {
            const cInfo = getSystemInfo(c.gameSystem)
            return (
              <li key={c.id} className="character-card">
                <div className="character-card-info">
                  <h3 className="flex items-center gap-sm">
                    {c.name}
                    <span className={`splat-badge ${cInfo.badge || ''} text-sm`}>
                      {t(cInfo.labelKey)}
                    </span>
                  </h3>
                  {c.description && (
                    <p className="character-card-meta mt-xs">{c.description}</p>
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
      )}

      {/* Create Chronicle Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}
          role="dialog" aria-modal="true" aria-labelledby="create-chronicle-title"
          onKeyDown={e => { if (e.key === 'Escape') setShowCreateModal(false) }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 id="create-chronicle-title">{t('selectSystemForChronicle')}</h3>
            <div className="flex-col gap-sm mt-md">
              {CREATABLE_SYSTEMS.map(sys => (
                <button
                  key={sys.key}
                  className="modal-option-btn flex items-center gap-md p-md text-left"
                  onClick={() => { setShowCreateModal(false); navigate(`${sys.basePath}/new`) }}
                >
                  <span className={`splat-badge ${sys.badge || ''} text-base`} style={{ minWidth: '120px' }}>
                    {t(sys.labelKey)}
                  </span>
                </button>
              ))}
            </div>
            <button className="modal-close" onClick={() => setShowCreateModal(false)}>{t('cancel')}</button>
          </div>
        </div>
      )}
      <ConfirmDialog {...confirmDialogProps} confirmLabel={t('deleteBtn')} cancelLabel={t('cancel')} />
    </section>
  )
}
