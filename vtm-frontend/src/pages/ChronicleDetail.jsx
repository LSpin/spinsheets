import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import { getChronicle } from '../api/chronicleApi'
import { getCharacters } from '../api/characterApi'
import { joinChronicle, leaveChronicle } from '../api/chronicleApi'

export default function ChronicleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useLanguage()
  const isST = user?.role === 'STORYTELLER'

  const [chronicle, setChronicle] = useState(null)
  const [members, setMembers] = useState([])
  const [myCharacters, setMyCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { load() }, [id])

  async function load() {
    try {
      setLoading(true)
      const [chronicleRes, charsRes] = await Promise.all([
        getChronicle(id),
        getCharacters()
      ])
      setChronicle(chronicleRes.data.chronicle)
      setMembers(chronicleRes.data.characters)
      setMyCharacters(charsRes.data)
    } catch {
      setError(t('failedLoadChronicle'))
    } finally {
      setLoading(false)
    }
  }

  async function handleJoin(characterId) {
    try {
      await joinChronicle(characterId, id)
      load()
    } catch {
      setError(t('failedJoin'))
    }
  }

  async function handleLeave(characterId) {
    try {
      await leaveChronicle(characterId)
      load()
    } catch {
      setError(t('failedLeave'))
    }
  }

  if (loading) return <p className="status-loading">{t('loading')}</p>
  if (!chronicle) return <p className="status-error">{t('chronicleNotFound')}</p>

  const memberIds = new Set(members.map(m => m.id))
  const joinable = myCharacters.filter(c => !memberIds.has(c.id))
  const myMembers = myCharacters.filter(c => memberIds.has(c.id))

  return (
    <section>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/chronicles')}>{t('back')}</button>
        <h2>{chronicle.name}</h2>
      </div>

      {error && <p className="status-error" role="alert">{error}</p>}

      {chronicle.description && (
        <div className="form-section">
          <p>{chronicle.description}</p>
        </div>
      )}

      <div className="form-section">
        <fieldset>
          <legend>{t('charsInChronicle')} ({members.length})</legend>
          {members.length === 0 && <p className="muted-hint">{t('noCharsJoined')}</p>}
          {members.length > 0 && (
            <ul className="character-list" aria-label={t('charsInChronicle')}>
              {members.map(c => (
                <li key={c.id} className="character-card">
                  <div className="character-card-info">
                    <h3>{c.name}</h3>
                    <dl className="character-card-meta">
                      {c.clan && <><dt className="sr-only">{t('clan')}</dt><dd>{c.clan}</dd></>}
                      {c.generation && <><dt className="sr-only">{t('generation')}</dt><dd>{c.generation}{t('thGen')}</dd></>}
                      {c.owner && <><dt className="sr-only">{t('playerLabel')}</dt><dd>{t('playerLabel')}: {c.owner.username}</dd></>}
                    </dl>
                  </div>
                  <div className="character-card-actions">
                    {(isST || c.ownerId === user.userId) && (
                      <button className="btn btn-secondary" onClick={() => navigate(`/characters/${c.id}`)}>
                        {t('viewBtn')}
                      </button>
                    )}
                    {c.ownerId === user.userId && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleLeave(c.id)}>
                        {t('leaveBtn')}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </fieldset>
      </div>

      {!isST && joinable.length > 0 && (
        <div className="form-section">
          <fieldset>
            <legend>{t('addACharacter')}</legend>
            <ul className="character-list" aria-label={t('addACharacter')}>
              {joinable.map(c => (
                <li key={c.id} className="character-card">
                  <div className="character-card-info">
                    <h3>{c.name}</h3>
                    <dl className="character-card-meta">
                      {c.clan && <><dt className="sr-only">{t('clan')}</dt><dd>{c.clan}</dd></>}
                      {c.chronicle && <><dt className="sr-only">{t('inChronicle')}</dt><dd>{t('inChronicle')}: {c.chronicle.name}</dd></>}
                    </dl>
                  </div>
                  <div className="character-card-actions">
                    <button className="btn btn-primary btn-sm" onClick={() => handleJoin(c.id)}>
                      {t('joinBtn')}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </fieldset>
        </div>
      )}
    </section>
  )
}
