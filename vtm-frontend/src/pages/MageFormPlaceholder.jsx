import { useNavigate } from 'react-router-dom'

export default function MageFormPlaceholder() {
  const navigate = useNavigate()
  return (
    <section>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/characters/new')}>Back</button>
        <h2>Mage: The Ascension</h2>
      </div>
      <div className="empty-state">
        <p style={{ fontSize: '1.2rem', marginBottom: 'var(--space-sm)' }}>Coming Soon</p>
        <p>The Awakened character sheet is under development.</p>
      </div>
    </section>
  )
}
