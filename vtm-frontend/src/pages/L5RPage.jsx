import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { getCharacters, deleteCharacter } from '../api/characterApi'

export default function L5RPage() {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const isST = user?.role === 'STORYTELLER'

  useEffect(() => { switchTheme('l5r') }, [])

  useEffect(() => {
    async function load() {
      try {
        const res = await getCharacters()
        setCharacters(res.data.filter(c => c.splat === 'L5R'))
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
    <section aria-labelledby="l5r-heading">
      <div className="character-list-header">
        <h2 id="l5r-heading">{t('l5rMySamurai')}</h2>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button className="btn btn-primary" onClick={() => navigate('/l5r/new?mode=guided')}>
            {t('l5rNewSamurai')}
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/l5r/new')}>
            {t('l5rBlankSheet')}
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/l5r/chronicles')}>
            {t('navChronicles')}
          </button>
        </div>
      </div>

      {error && <p className="status-error" role="alert">{error}</p>}
      {loading && <p className="status-loading">{t('loading')}</p>}

      {!loading && characters.length === 0 && (
        <div className="empty-state">
          <p>{t('l5rNoSamuraiYet')}</p>
          <p>{t('l5rCreateFirst')}</p>
        </div>
      )}

      {!loading && characters.length > 0 && (
        <ul className="character-list" aria-label={t('l5rMySamurai')}>
          {characters.map(c => (
            <li key={c.id} className="character-card">
              <div className="character-card-info">
                <h3>{c.name || t('unnamedCharacter')}</h3>
                <dl className="character-card-meta">
                  <dt className="sr-only">System</dt>
                  <dd className="splat-badge splat-badge--l5r">L5R</dd>
                  {c.l5rClan && <><dt className="sr-only">{t('l5rClan')}</dt><dd>{c.l5rClan}</dd></>}
                  {c.l5rFamily && <><dt className="sr-only">{t('l5rFamily')}</dt><dd>{c.l5rFamily}</dd></>}
                  {c.l5rSchool && <><dt className="sr-only">{t('l5rSchool')}</dt><dd>{c.l5rSchool}</dd></>}
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
