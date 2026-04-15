import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const navigate = useNavigate()
  const [resetToken, setResetToken] = useState(token)
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (newPassword !== confirm) { setError('Passwords do not match'); return }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return }
    setSubmitting(true)
    try {
      await axios.post('/api/auth/reset-password', { token: resetToken, newPassword })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <section>
        <h2>Password Reset</h2>
        <div className="form-section" style={{ maxWidth: 400 }}>
          <p>Password reset successfully.</p>
          <p className="muted-hint"><Link to="/login">Sign in with your new password</Link></p>
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby="reset-heading">
      <h2 id="reset-heading">Reset Password</h2>
      <div className="form-section" style={{ maxWidth: 400 }}>
        <form onSubmit={handleSubmit}>
          {error && <p className="status-error" role="alert">{error}</p>}
          <div className="field">
            <label htmlFor="resetToken">Reset Token</label>
            <input id="resetToken" type="text" value={resetToken} onChange={e => setResetToken(e.target.value)} required placeholder="Paste token from your Storyteller" autoComplete="off" />
          </div>
          <div className="field">
            <label htmlFor="newPassword">New Password</label>
            <input id="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required autoComplete="new-password" />
          </div>
          <div className="field">
            <label htmlFor="confirm">Confirm New Password</label>
            <input id="confirm" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required autoComplete="new-password" />
          </div>
          <div className="form-actions" style={{ borderTop: 'none', paddingTop: 0 }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Resetting...' : 'Reset password'}
            </button>
          </div>
          <p className="muted-hint"><Link to="/login">Back to sign in</Link></p>
        </form>
      </div>
    </section>
  )
}
