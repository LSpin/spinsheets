import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getChronicle } from '../api/chronicleApi'
import { getCharacters } from '../api/characterApi'
import { joinChronicle, leaveChronicle } from '../api/chronicleApi'

export default function ChronicleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
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
      setError('Failed to load chronicle.')
    } finally {
      setLoading(false)
    }
  }

  async function handleJoin(characterId) {
    try {
      await joinChronicle(characterId, id)
      load()
    } catch {
      setError('Failed to join chronicle.')
    }
  }

  async function handleLeave(characterId) {
    try {
      await leaveChronicle(characterId)
      load()
    } catch {
      setError('Failed to leave chronicle.')
    }
  }

  if (loading) return <p className="status-loading">Loading...</p>
  if (!chronicle) return <p className="status-error">Chronicle not found.</p>

  const memberIds = new Set(members.map(m => m.id))
  const joinable = myCharacters.filter(c => !memberIds.has(c.id))
  const myMembers = myCharacters.filter(c => memberIds.has(c.id))

  return (
    <section>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/chronicles')}>Back</button>
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
          <legend>Characters in this Chronicle ({members.length})</legend>
          {members.length === 0 && <p className="muted-hint">No characters have joined yet.</p>}
          {members.length > 0 && (
            <ul className="character-list" aria-label="Chronicle members">
              {members.map(c => (
                <li key={c.id} className="character-card">
                  <div className="character-card-info">
                    <h3>{c.name}</h3>
                    <dl className="character-card-meta">
                      {c.clan && <><dt className="sr-only">Clan</dt><dd>{c.clan}</dd></>}
                      {c.generation && <><dt className="sr-only">Generation</dt><dd>{c.generation}th gen</dd></>}
                      {c.owner && <><dt className="sr-only">Player</dt><dd>Player: {c.owner.username}</dd></>}
                    </dl>
                  </div>
                  <div className="character-card-actions">
                    {(isST || c.ownerId === user.userId) && (
                      <button className="btn btn-secondary" onClick={() => navigate(`/characters/${c.id}`)}>
                        View
                      </button>
                    )}
                    {c.ownerId === user.userId && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleLeave(c.id)}>
                        Leave
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
            <legend>Add a Character</legend>
            <ul className="character-list" aria-label="Available characters">
              {joinable.map(c => (
                <li key={c.id} className="character-card">
                  <div className="character-card-info">
                    <h3>{c.name}</h3>
                    <dl className="character-card-meta">
                      {c.clan && <><dt className="sr-only">Clan</dt><dd>{c.clan}</dd></>}
                      {c.chronicle && <><dt className="sr-only">Current</dt><dd>In: {c.chronicle.name}</dd></>}
                    </dl>
                  </div>
                  <div className="character-card-actions">
                    <button className="btn btn-primary btn-sm" onClick={() => handleJoin(c.id)}>
                      Join
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
