import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import { getChronicles, deleteChronicle, joinByInviteCode } from '../api/chronicleApi'
import { getCharacters } from '../api/characterApi'

export default function ChronicleList() {
  const [chronicles, setChronicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [inviteCode, setInviteCode] = useState('')
  const [myCharacters, setMyCharacters] = useState([])
  const [selectedCharId, setSelectedCharId] = useState('')
  const [showJoin, setShowJoin] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useLanguage()
  const isST = user?.role === 'STORYTELLER'

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setLoading(true)
      const res = await getChronicles()
      setChronicles(res.data)
    } catch {
      setError(t('failedLoadChronicles'))
    } finally {
      setLoading(false)
    }
  }

  async function handleOpenJoin() {
    setShowJoin(true)
    try {
      const res = await getCharacters()
      const mine = res.data.filter(c => c.ownerId === user.userId && !c.chronicle)
      setMyCharacters(mine)
      if (mine.length > 0) setSelectedCharId(mine[0].id)
    } catch { /* ignore */ }
  }

  async function handleJoinByCode(e) {
    e.preventDefault()
    if (!inviteCode.trim() || !selectedCharId) return
    try {
      const res = await joinByInviteCode(inviteCode.trim(), selectedCharId)
      setInviteCode('')
      setShowJoin(false)
      navigate(`/chronicles/${res.data.chronicleId}`)
    } catch (err) {
      setError(err.response?.data?.error || t('invalidInviteCode'))
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
        <h2 id="chronicles-heading">{t('chroniclesTitle')}</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={handleOpenJoin}>
            {t('joinWithCode')}
          </button>
          {isST && (
            <button className="btn btn-primary" onClick={() => navigate('/chronicles/new')}>
              {t('newChronicle')}
            </button>
          )}
        </div>
      </div>

      {error && <p className="status-error" role="alert">{error}</p>}

      {showJoin && (
        <div className="form-section" style={{ marginBottom: '1rem' }}>
          <form onSubmit={handleJoinByCode} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="field">
              <label>{t('inviteCodeLabel')}</label>
              <input type="text" value={inviteCode} onChange={e => setInviteCode(e.target.value)}
                placeholder={t('phInviteCode')} style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }} />
            </div>
            <div className="field">
              <label>{t('selectCharacter')}</label>
              <select value={selectedCharId} onChange={e => setSelectedCharId(Number(e.target.value))}>
                {myCharacters.length === 0 && <option value="">{t('noAvailableCharacters')}</option>}
                {myCharacters.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-sm" disabled={!inviteCode.trim() || !selectedCharId}>
              {t('joinBtn')}
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowJoin(false)}>
              {t('cancel')}
            </button>
          </form>
        </div>
      )}
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
                  onClick={() => navigate(`/chronicles/${c.id}`)}
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
