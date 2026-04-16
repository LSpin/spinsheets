import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import { getCharacters, deleteCharacter } from '../api/characterApi'

const SPLAT_LABEL_KEYS = {
  VAMPIRE: 'splatVampire',
  WEREWOLF: 'splatWerewolf',
  MAGE: 'splatMage',
  VAMPIRE_REVISED: 'splatVampireRevisedSub',
  KOTE: 'splatKote',
}

function splatBadgeClass(splat) {
  return `splat-badge splat-badge--${(splat || 'vampire').toLowerCase().replace('_', '-')}`
}

export default function CharacterList() {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useLanguage()

  useEffect(() => { loadCharacters() }, [])

  async function loadCharacters() {
    try {
      setLoading(true)
      const res = await getCharacters()
      setCharacters(res.data)
    } catch {
      setError(t('failedLoadChars'))
    } finally {
      setLoading(false)
    }
  }

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
    <section aria-labelledby="list-heading">
      <div className="character-list-header">
        <h2 id="list-heading">
          {user?.role === 'STORYTELLER' ? t('allCharactersST') : t('myCharacters')}
        </h2>
        <button className="btn btn-primary" onClick={() => navigate('/characters/new')}>
          {t('newCharBtn')}
        </button>
      </div>

      {error && <p className="status-error" role="alert">{error}</p>}

      {loading && <p className="status-loading" aria-live="polite">{t('loading')}</p>}

      {!loading && characters.length === 0 && (
        <div className="empty-state">
          <p>{t('noCharsYet')}</p>
          <p>{t('createFirstChar')}</p>
        </div>
      )}

      {!loading && characters.length > 0 && (
        <ul className="character-list" aria-label={t('navCharacters')}>
          {characters.map(c => (
            <li key={c.id} className="character-card">
              <div className="character-card-info">
                <h3>{c.name}</h3>
                <dl className="character-card-meta">
                  {c.splat && (
                    <>
                      <dt className="sr-only">Splat</dt>
                      <dd className={splatBadgeClass(c.splat)}>
                        {t(SPLAT_LABEL_KEYS[c.splat]) || c.splat}
                      </dd>
                    </>
                  )}
                  {c.clan && (
                    <>
                      <dt className="sr-only">{t('clan')}</dt>
                      <dd>{c.clan}</dd>
                    </>
                  )}
                  {c.generation && (
                    <>
                      <dt className="sr-only">{t('generation')}</dt>
                      <dd>{c.generation}{t('thGeneration')}</dd>
                    </>
                  )}
                  {c.pathName && (
                    <>
                      <dt className="sr-only">{t('pathName')}</dt>
                      <dd>{c.pathName} {c.pathRating}</dd>
                    </>
                  )}
                  {user?.role === 'STORYTELLER' && c.owner && (
                    <>
                      <dt className="sr-only">{t('playerLabel')}</dt>
                      <dd>{t('playerLabel')}: {c.owner.username}</dd>
                    </>
                  )}
                </dl>
              </div>
              <div className="character-card-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(`/characters/${c.id}`)}
                  aria-label={`${t('edit')} ${c.name}`}
                >
                  {t('edit')}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(c.id, c.name)}
                  aria-label={`${t('deleteBtn')} ${c.name}`}
                >
                  {t('deleteBtn')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
