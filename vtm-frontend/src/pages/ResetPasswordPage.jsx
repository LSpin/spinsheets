import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import axios from 'axios'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const tokenFromUrl = searchParams.get('token') || ''
  const { t } = useLanguage()

  // Step 1: Request reset (enter email)
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [requestError, setRequestError] = useState(null)
  const [requesting, setRequesting] = useState(false)

  // Step 2: Reset password (enter token + new password)
  const [showResetForm, setShowResetForm] = useState(!!tokenFromUrl)
  const [resetToken, setResetToken] = useState(tokenFromUrl)
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [resetError, setResetError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleRequestReset(e) {
    e.preventDefault()
    setRequestError(null)
    if (!email.trim()) { setRequestError(t('emailRequired')); return }
    setRequesting(true)
    try {
      await axios.post('/api/auth/forgot-password', { email: email.trim() })
      setEmailSent(true)
    } catch (err) {
      setRequestError(err.response?.data?.error || t('resetRequestFailed'))
    } finally {
      setRequesting(false)
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault()
    setResetError(null)
    if (newPassword !== confirm) { setResetError(t('passwordsMismatch')); return }
    if (newPassword.length < 6) { setResetError(t('passwordTooShort')); return }
    setSubmitting(true)
    try {
      await axios.post('/api/auth/reset-password', { token: resetToken, newPassword })
      setSuccess(true)
    } catch (err) {
      setResetError(err.response?.data?.error || t('resetFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  // Success state
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

  // Step 2: Reset form (shown when token is provided or user clicks "I have a token")
  if (showResetForm) {
    return (
      <section aria-labelledby="reset-heading">
        <h2 id="reset-heading">{t('resetPasswordTitle')}</h2>
        <div className="form-section" style={{ maxWidth: 400 }}>
          <form onSubmit={handleResetPassword}>
            {resetError && <p className="status-error" role="alert">{resetError}</p>}
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

  // Step 1: Request reset (default view)
  return (
    <section aria-labelledby="forgot-heading">
      <h2 id="forgot-heading">{t('forgotPasswordTitle')}</h2>
      <div className="form-section" style={{ maxWidth: 400 }}>
        {emailSent ? (
          <>
            <p>{t('resetEmailSent')}</p>
            <p className="muted-hint">{t('resetEmailSentHint')}</p>
            <div style={{ marginTop: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <button className="btn btn-secondary" onClick={() => setShowResetForm(true)}>
                {t('iHaveAToken')}
              </button>
              <Link to="/login" className="muted-hint">{t('backToSignIn')}</Link>
            </div>
          </>
        ) : (
          <form onSubmit={handleRequestReset}>
            {requestError && <p className="status-error" role="alert">{requestError}</p>}
            <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>
              {t('forgotPasswordHint')}
            </p>
            <div className="field">
              <label htmlFor="email">{t('email')}</label>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" placeholder={t('enterYourEmail')} />
            </div>
            <div className="form-actions" style={{ borderTop: 'none', paddingTop: 0 }}>
              <button type="submit" className="btn btn-primary" disabled={requesting}>
                {requesting ? t('sending') : t('sendResetLink')}
              </button>
            </div>
            <div style={{ marginTop: 'var(--space-sm)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              <button type="button" className="muted-hint" style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, textDecoration: 'underline', color: 'var(--color-text-muted)' }}
                onClick={() => setShowResetForm(true)}>
                {t('iHaveAToken')}
              </button>
              <Link to="/login" className="muted-hint">{t('backToSignIn')}</Link>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
