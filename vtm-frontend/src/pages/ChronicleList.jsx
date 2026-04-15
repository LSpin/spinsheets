import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getChronicles, deleteChronicle } from '../api/chronicleApi'

export default function ChronicleList() {
  const [chronicles, setChronicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { user } = useAuth()
  const isST = user?.role === 'STORYTELLER'

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setLoading(true)
      const res = await getChronicles()
      setChronicles(res.data)
    } catch {
      setError('Failed to load chronicles.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete chronicle "${name}"? Characters will be removed from it but not deleted.`)) return
    try {
      await deleteChronicle(id)
      setChronicles(prev => prev.filter(c => c.id !== id))
    } catch {
      setError('Failed to delete chronicle.')
    }
  }

  return (
    <section aria-labelledby="chronicles-heading">
      <div className="character-list-header">
        <h2 id="chronicles-heading">Chronicles</h2>
        {isST && (
          <button className="btn btn-primary" onClick={() => navigate('/chronicles/new')}>
            New chronicle
          </button>
        )}
      </div>

      {error && <p className="status-error" role="alert">{error}</p>}
      {loading && <p className="status-loading" aria-live="polite">Loading...</p>}

      {!loading && chronicles.length === 0 && (
        <div className="empty-state">
          <p>No chronicles yet.</p>
          {isST
            ? <p>Create a chronicle for your players to join.</p>
            : <p>Your Storyteller hasn't created a chronicle yet.</p>}
        </div>
      )}

      {!loading && chronicles.length > 0 && (
        <ul className="character-list" aria-label="Chronicle list">
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
                      <dt className="sr-only">Storyteller</dt>
                      <dd>ST: {c.storyteller.username}</dd>
                    </>
                  )}
                </dl>
              </div>
              <div className="character-card-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(`/chronicles/${c.id}`)}
                  aria-label={`View ${c.name}`}
                >
                  View
                </button>
                {isST && c.storyteller?.id === user.userId && (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(c.id, c.name)}
                    aria-label={`Delete ${c.name}`}
                  >
                    Delete
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
