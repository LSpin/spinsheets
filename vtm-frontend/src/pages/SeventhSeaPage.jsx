import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { getCharacters, deleteCharacter } from '../api/characterApi'

export default function SeventhSeaPage() {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const isST = user?.role === 'STORYTELLER'

  useEffect(() => { switchTheme('7thsea') }, [])

  useEffect(() => {
    async function load() {
      try {
        const res = await getCharacters()
        setCharacters(res.data.filter(c => c.splat === 'SEVENTH_SEA'))
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
    <section aria-labelledby="7s-heading">
      <div className="character-list-header">
        <h2 id="7s-heading">{t('7sMyHeroes')}</h2>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button className="btn btn-primary" onClick={() => navigate('/7thsea/new?mode=guided')}>
            {t('7sNewHero')}
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/7thsea/new')}>
            {t('7sBlankHero')}
          </button>
        </div>
      </div>

      {error && <p className="status-error" role="alert">{error}</p>}
      {loading && <p className="status-loading">{t('loading')}</p>}

      {!loading && characters.length === 0 && (
        <div className="empty-state">
          <p>{t('7sNoHeroesYet')}</p>
          <p>{t('7sCreateFirst')}</p>
        </div>
      )}

      {!loading && characters.length > 0 && (
        <ul className="character-list" aria-label={t('7sMyHeroes')}>
          {characters.map(c => (
            <li key={c.id} className="character-card">
              <div className="character-card-info">
                <h3>{c.name || t('unnamedCharacter')}</h3>
                <dl className="character-card-meta">
                  <dt className="sr-only">System</dt>
                  <dd className="splat-badge splat-badge--seventh-sea">7th Sea</dd>
                  {c.nation && <><dt className="sr-only">{t('7sNation')}</dt><dd>{c.nation}</dd></>}
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
