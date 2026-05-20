import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { getChronicles, addAssistantST, removeAssistantST } from '../api/chronicleApi'
import api from '../api/apiClient'

export default function PlayersPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [chronicles, setChronicles] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setLoading(true)
      const [usersRes, chronRes] = await Promise.all([
        api.get('/auth/users'),
        getChronicles()
      ])
      setUsers(usersRes.data)
      setChronicles(chronRes.data)
    } catch {
      setError(t('failedLoadChars'))
    } finally {
      setLoading(false)
    }
  }

  async function handleAssign(username, chronicleId) {
    if (!chronicleId) return
    try {
      await addAssistantST(chronicleId, username)
      load()
    } catch {
      setError(t('failedAddAssistant'))
    }
  }

  async function handleRemoveAST(chronicleId, userId) {
    try {
      await removeAssistantST(chronicleId, userId)
      load()
    } catch {
      setError(t('failedRemoveAssistant'))
    }
  }

  const filtered = users.filter(u => {
    if (u.username === 'admin_temp') return false
    if (!search.trim()) return true
    return u.username.toLowerCase().includes(search.toLowerCase())
  })

  function getASTChronicles(userId) {
    return chronicles.filter(c =>
      c.assistantStorytellers?.some(ast => ast.id === userId)
    )
  }

  function getMyChronicles() {
    return chronicles.filter(c => c.storyteller?.id === user?.userId)
  }

  const myChronicles = getMyChronicles()

  return (
    <section aria-labelledby="players-heading">
      <div className="character-list-header">
        <h2 id="players-heading">{t('playersTitle')}</h2>
      </div>

      {error && <p className="status-error" role="alert">{error}</p>}

      <div className="mb-lg">
        <input
          type="text"
          className="w-full"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('searchPlayers')}
          style={{ maxWidth: 400 }}
        />
      </div>

      {loading && <p className="status-loading">{t('loading')}</p>}

      {!loading && filtered.length === 0 && (
        <div className="empty-state">
          <p>{t('noPlayersFound')}</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <ul className="character-list" aria-label={t('playersTitle')}>
          {filtered.map(u => {
            const astChronicles = getASTChronicles(u.id)
            return (
              <li key={u.id} className="character-card">
                <div className="character-card-info">
                  <h3>{u.username}</h3>
                  <dl className="character-card-meta">
                    <dt className="sr-only">{t('userRole')}</dt>
                    <dd className={`splat-badge splat-badge--${u.role === 'STORYTELLER' ? 'mage' : 'vampire'}`}>
                      {u.role === 'STORYTELLER' ? t('storytellerRole') : t('playerRole')}
                    </dd>
                    <dt className="sr-only">{t('memberSince')}</dt>
                    <dd>{t('memberSince')}: {new Date(u.createdAt).toLocaleDateString()}</dd>
                  </dl>
                  {astChronicles.length > 0 && (
                    <div className="mt-xs">
                      {astChronicles.map(c => (
                        <span key={c.id} className="splat-badge text-xs" style={{ marginRight: '0.3rem' }}>
                          {t('astIn')}: {c.name}
                          <button
                            className="cursor-pointer font-bold"
                            style={{ background: 'none', border: 'none', color: 'inherit', marginLeft: '0.3rem' }}
                            onClick={() => handleRemoveAST(c.id, u.id)}
                            title={t('removeAST')}
                          >✕</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="character-card-actions">
                  {myChronicles.length > 0 && u.id !== user?.userId && (
                    <div className="flex items-center" style={{ gap: '0.3rem' }}>
                      <select
                        id={`ast-select-${u.id}`}
                        defaultValue=""
                        style={{ fontSize: '0.8rem' }}
                        onChange={e => {
                          if (e.target.value) {
                            handleAssign(u.username, e.target.value)
                            e.target.value = ''
                          }
                        }}
                      >
                        <option value="" disabled>{t('assignAsAST')}</option>
                        {myChronicles
                          .filter(c => !c.assistantStorytellers?.some(ast => ast.id === u.id))
                          .map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))
                        }
                      </select>
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
