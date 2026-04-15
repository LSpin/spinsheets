import { useNavigate } from 'react-router-dom'

export default function WerewolfFormPlaceholder() {
  const navigate = useNavigate()
  return (
    <section>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/characters/new')}>Back</button>
        <h2>Werewolf: The Apocalypse</h2>
      </div>
      <div className="empty-state">
        <p style={{ fontSize: '1.2rem', marginBottom: 'var(--space-sm)' }}>Coming Soon</p>
        <p>The Garou character sheet is under development.</p>
      </div>
    </section>
  )
}
