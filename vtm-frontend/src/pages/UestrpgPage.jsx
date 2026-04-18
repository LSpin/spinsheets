import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { getCharacters, deleteCharacter } from '../api/characterApi'
import { getChronicles } from '../api/chronicleApi'

export default function UestrpgPage() {
  const [characters, setCharacters] = useState([])
  const [chronicles, setChronicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { user, isST } = useAuth()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()

  useEffect(() => { switchTheme('uestrpg') }, [])

  useEffect(() => {
    async function load() {
      try {
        const [charRes, chronRes] = await Promise.all([getCharacters(), getChronicles()])
        setCharacters(charRes.data.filter(c => c.splat === 'UESTRPG'))
        setChronicles(chronRes.data.filter(c => (c.gameSystem || 'WOD') === 'UESTRPG'))
      } catch {
        setError(t('failedLoadChars'))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleDelete(id, name) {
    if (!confirm(t('confirmDelete').replace('{0}', name))) return
    try {
      await deleteCharacter(id)
      setCharacters(prev => prev.filter(c => c.id !== id))
    } catch {
      setError(t('failedDeleteChar'))
    }
  }

  return (
    <section aria-labelledby="uestrpg-heading">
      <div className="character-list-header">
        <h2 id="uestrpg-heading">{t('systemUestrpg')} — {t('uestrpgMyChars')}</h2>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/uestrpg/new')}>
            {t('systemUestrpg')} — {t('uestrpgNewChar')}
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/uestrpg/chronicles')}>
            {t('systemUestrpg')} {t('navChronicles')}
          </button>
        </div>
      </div>

      {error && <p className="status-error" role="alert">{error}</p>}
      {loading && <p className="status-loading">{t('loading')}</p>}

      {!loading && characters.length === 0 && (
        <div className="empty-state">
          <p>{t('uestrpgNoCharsYet')}</p>
          <p className="muted-hint">{t('uestrpgCreateFirst')}</p>
        </div>
      )}

      {!loading && characters.length > 0 && (
        <ul className="character-list" aria-label={t('uestrpgMyChars')}>
          {characters.map(c => (
            <li key={c.id} className="character-card">
              <div className="character-card-info">
                <h3>{c.name || t('unnamedCharacter')}</h3>
                <dl className="character-card-meta">
                  <dt className="sr-only">System</dt>
                  <dd className="splat-badge splat-badge--uestrpg">UESTRPG</dd>
                  {c.dndRace && (
                    <><dt className="sr-only">Race</dt><dd>{c.dndRace}</dd></>
                  )}
                  {c.dndClass && c.dndLevel && (
                    <><dt className="sr-only">Class & Level</dt><dd>{c.dndClass} {c.dndLevel}</dd></>
                  )}
                  {c.concept && <><dt className="sr-only">{t('concept')}</dt><dd>{c.concept}</dd></>}
                  {isST && c.owner && <><dt className="sr-only">{t('playerLabel')}</dt><dd>{t('playerLabel')}: {c.owner.username}</dd></>}
                </dl>
              </div>
              <div className="character-card-actions">
                <button className="btn btn-secondary" onClick={() => navigate(`/characters/${c.id}?mode=view`)}>{t('viewBtn')}</button>
                <button className="btn btn-secondary" onClick={() => navigate(`/characters/${c.id}`)}>{t('edit')}</button>
                <button className="btn btn-danger" onClick={() => handleDelete(c.id, c.name)}>{t('deleteBtn')}</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
