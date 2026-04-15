import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getCharacters, deleteCharacter } from '../api/characterApi'

const SPLAT_LABELS = {
  VAMPIRE: 'Vampire',
  WEREWOLF: 'Werewolf',
  MAGE: 'Mage',
  VAMPIRE_REVISED: 'Vampire (Revised)',
  KOTE: 'Kindred of the East',
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

  useEffect(() => { loadCharacters() }, [])

  async function loadCharacters() {
    try {
      setLoading(true)
      const res = await getCharacters()
      setCharacters(res.data)
    } catch {
      setError('Failed to load characters.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return
    try {
      await deleteCharacter(id)
      setCharacters(prev => prev.filter(c => c.id !== id))
    } catch {
      setError('Failed to delete character.')
    }
  }

  return (
    <section aria-labelledby="list-heading">
      <div className="character-list-header">
        <h2 id="list-heading">
          {user?.role === 'STORYTELLER' ? 'All Characters (Storyteller View)' : 'My Characters'}
        </h2>
        <button className="btn btn-primary" onClick={() => navigate('/characters/new')}>
          New character
        </button>
      </div>

      {error && <p className="status-error" role="alert">{error}</p>}

      {loading && <p className="status-loading" aria-live="polite">Loading...</p>}

      {!loading && characters.length === 0 && (
        <div className="empty-state">
          <p>No characters yet.</p>
          <p>Create your first character to get started.</p>
        </div>
      )}

      {!loading && characters.length > 0 && (
        <ul className="character-list" aria-label="Character list">
          {characters.map(c => (
            <li key={c.id} className="character-card">
              <div className="character-card-info">
                <h3>{c.name}</h3>
                <dl className="character-card-meta">
                  {c.splat && (
                    <>
                      <dt className="sr-only">Splat</dt>
                      <dd className={splatBadgeClass(c.splat)}>
                        {SPLAT_LABELS[c.splat] || c.splat}
                      </dd>
                    </>
                  )}
                  {c.clan && (
                    <>
                      <dt className="sr-only">Clan</dt>
                      <dd>{c.clan}</dd>
                    </>
                  )}
                  {c.generation && (
                    <>
                      <dt className="sr-only">Generation</dt>
                      <dd>{c.generation}th generation</dd>
                    </>
                  )}
                  {c.pathName && (
                    <>
                      <dt className="sr-only">Path</dt>
                      <dd>{c.pathName} {c.pathRating}</dd>
                    </>
                  )}
                  {user?.role === 'STORYTELLER' && c.owner && (
                    <>
                      <dt className="sr-only">Player</dt>
                      <dd>Player: {c.owner.username}</dd>
                    </>
                  )}
                </dl>
              </div>
              <div className="character-card-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(`/characters/${c.id}`)}
                  aria-label={`Edit ${c.name}`}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(c.id, c.name)}
                  aria-label={`Delete ${c.name}`}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
