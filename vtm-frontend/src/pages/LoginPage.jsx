import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(username, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section aria-labelledby="login-heading">
      <h2 id="login-heading">Sign In</h2>
      <div className="form-section" style={{ maxWidth: 400 }}>
        <form onSubmit={handleSubmit}>
          {error && <p className="status-error" role="alert">{error}</p>}
          <div className="field">
            <label htmlFor="username">Username</label>
            <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required autoComplete="username" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
          </div>
          <div className="form-actions" style={{ borderTop: 'none', paddingTop: 0 }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          <p className="muted-hint">
            No account? <Link to="/register">Register here</Link>
          </p>
        </form>
      </div>
    </section>
  )
}
