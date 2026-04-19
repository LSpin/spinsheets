import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import { getChronicles, deleteChronicle } from '../api/chronicleApi'
import { useTheme } from '../context/ThemeContext'

const SYSTEM_LABEL_KEYS = {
  WOD: 'systemWoD',
  SEVENTH_SEA: 'system7thSea',
  L5R: 'systemL5R',
  BLADES: 'systemBlades',
  DND: 'systemDnd',
  UESTRPG: 'systemUestrpg',
}

export default function ChronicleList({ system = 'WOD', basePath = '/chronicles' }) {
  const [chronicles, setChronicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { user, isST } = useAuth()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const systemLabel = t(SYSTEM_LABEL_KEYS[system] || 'systemWoD')

  const SYSTEM_THEME = { WOD: 'wod', SEVENTH_SEA: '7thsea', L5R: 'l5r', BLADES: 'blades', DND: 'dnd', UESTRPG: 'uestrpg' }
  useEffect(() => { switchTheme(SYSTEM_THEME[system] || 'wod') }, [])
  useEffect(() => { load() }, [])

  async function load() {
    try {
      setLoading(true)
      const res = await getChronicles()
      setChronicles(res.data.filter(c => (c.gameSystem || 'WOD') === system))
    } catch {
      setError(t('failedLoadChronicles'))
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(t('confirmDeleteChronicle').replace('{0}', name))) return
    try {
      await deleteChronicle(id)
      setChronicles(prev => prev.filter(c => c.id !== id))
    } catch {
      setError(t('failedDeleteChronicle'))
    }
  }

  return (
    <section aria-labelledby="chronicles-heading">
      <div className="character-list-header">
        <h2 id="chronicles-heading">{systemLabel} — {t('chroniclesTitle')}</h2>
        {isST && (
          <button className="btn btn-primary" onClick={() => navigate(`${basePath}/new`)}>
            {systemLabel} — {t('newChronicle')}
          </button>
        )}
      </div>

      {error && <p className="status-error" role="alert">{error}</p>}
      {loading && <p className="status-loading" aria-live="polite">{t('loading')}</p>}

      {!loading && chronicles.length === 0 && (
        <div className="empty-state">
          <p>{t('noChroniclesYet')}</p>
          {isST
            ? <p>{t('stCreateChronicle')}</p>
            : <p>{t('playerNoChronicle')}</p>}
        </div>
      )}

      {!loading && chronicles.length > 0 && (
        <ul className="character-list" aria-label={t('chroniclesTitle')}>
          {chronicles.map(c => (
            <li key={c.id} className="character-card">
              <div className="character-card-info">
                <h3>{c.name}</h3>
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
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(`${basePath}/${c.id}`)}
                  aria-label={`${t('viewBtn')} ${c.name}`}
                >
                  {t('viewBtn')}
                </button>
                {isST && c.storyteller?.id === user.userId && (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(c.id, c.name)}
                    aria-label={`${t('deleteBtn')} ${c.name}`}
                  >
                    {t('deleteBtn')}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
