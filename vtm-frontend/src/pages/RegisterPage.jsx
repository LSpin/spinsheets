import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [role, setRole] = useState('PLAYER')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setSubmitting(true)
    try {
      await register(username, email, password, role)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section aria-labelledby="register-heading">
      <h2 id="register-heading">Register</h2>
      <div className="form-section" style={{ maxWidth: 400 }}>
        <form onSubmit={handleSubmit}>
          {error && <p className="status-error" role="alert">{error}</p>}

          <fieldset>
            <legend>Role</legend>
            <div className="role-toggle" role="radiogroup" aria-label="Account role">
              <button
                type="button"
                className={`role-toggle-btn${role === 'PLAYER' ? ' role-toggle-btn--active' : ''}`}
                onClick={() => setRole('PLAYER')}
                aria-pressed={role === 'PLAYER'}
              >
                Player
              </button>
              <button
                type="button"
                className={`role-toggle-btn${role === 'STORYTELLER' ? ' role-toggle-btn--active' : ''}`}
                onClick={() => setRole('STORYTELLER')}
                aria-pressed={role === 'STORYTELLER'}
              >
                Storyteller
              </button>
            </div>
            <p className="role-hint">
              {role === 'STORYTELLER'
                ? 'Storytellers can view and manage all player characters.'
                : 'Players create and manage their own characters.'}
            </p>
          </fieldset>

          <div className="field">
            <label htmlFor="username">Username</label>
            <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required autoComplete="username" />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password" />
          </div>
          <div className="field">
            <label htmlFor="confirm">Confirm Password</label>
            <input id="confirm" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required autoComplete="new-password" />
          </div>
          <div className="form-actions" style={{ borderTop: 'none', paddingTop: 0 }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating account...' : 'Create account'}
            </button>
          </div>
          <p className="muted-hint">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </section>
  )
}
