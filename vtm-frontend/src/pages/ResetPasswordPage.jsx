import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import axios from 'axios'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [resetToken, setResetToken] = useState(token)
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (newPassword !== confirm) { setError(t('passwordsMismatch')); return }
    if (newPassword.length < 6) { setError(t('passwordTooShort')); return }
    setSubmitting(true)
    try {
      await axios.post('/api/auth/reset-password', { token: resetToken, newPassword })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error || t('resetFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <section>
        <h2>{t('resetPasswordTitle')}</h2>
        <div className="form-section" style={{ maxWidth: 400 }}>
          <p>{t('passwordResetSuccess')}</p>
          <p className="muted-hint"><Link to="/login">{t('signInNewPassword')}</Link></p>
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby="reset-heading">
      <h2 id="reset-heading">{t('resetPasswordTitle')}</h2>
      <div className="form-section" style={{ maxWidth: 400 }}>
        <form onSubmit={handleSubmit}>
          {error && <p className="status-error" role="alert">{error}</p>}
          <div className="field">
            <label htmlFor="resetToken">{t('resetToken')}</label>
            <input id="resetToken" type="text" value={resetToken} onChange={e => setResetToken(e.target.value)} required placeholder={t('resetTokenPlaceholder')} autoComplete="off" />
          </div>
          <div className="field">
            <label htmlFor="newPassword">{t('newPassword')}</label>
            <input id="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required autoComplete="new-password" />
          </div>
          <div className="field">
            <label htmlFor="confirm">{t('confirmNewPassword')}</label>
            <input id="confirm" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required autoComplete="new-password" />
          </div>
          <div className="form-actions" style={{ borderTop: 'none', paddingTop: 0 }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? t('resetting') : t('resetPasswordBtn')}
            </button>
          </div>
          <p className="muted-hint"><Link to="/login">{t('backToSignIn')}</Link></p>
        </form>
      </div>
    </section>
  )
}
