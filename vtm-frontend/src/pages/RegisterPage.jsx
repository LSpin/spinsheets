import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const { t } = useLanguage()
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
    if (password !== confirm) { setError(t('passwordsMismatch')); return }
    if (password.length < 6) { setError(t('passwordTooShort')); return }
    setSubmitting(true)
    try {
      await register(username, email, password, role)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || t('registrationFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section aria-labelledby="register-heading">
      <h2 id="register-heading">{t('registerTitle')}</h2>
      <div className="form-section" style={{ maxWidth: 400 }}>
        <form onSubmit={handleSubmit}>
          {error && <p className="status-error" role="alert">{error}</p>}

          <fieldset>
            <legend>{t('roleLabel')}</legend>
            <div className="role-toggle" role="radiogroup" aria-label={t('roleLabel')}>
              <button
                type="button"
                className={`role-toggle-btn${role === 'PLAYER' ? ' role-toggle-btn--active' : ''}`}
                onClick={() => setRole('PLAYER')}
                aria-pressed={role === 'PLAYER'}
              >
                {t('playerRole')}
              </button>
              <button
                type="button"
                className={`role-toggle-btn${role === 'STORYTELLER' ? ' role-toggle-btn--active' : ''}`}
                onClick={() => setRole('STORYTELLER')}
                aria-pressed={role === 'STORYTELLER'}
              >
                {t('storytellerRole')}
              </button>
            </div>
            <p className="role-hint">
              {role === 'STORYTELLER' ? t('stHint') : t('playerHint')}
            </p>
          </fieldset>

          <div className="field">
            <label htmlFor="username">{t('username')}</label>
            <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required autoComplete="username" />
          </div>
          <div className="field">
            <label htmlFor="email">{t('email')}</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="password">{t('password')}</label>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password" />
          </div>
          <div className="field">
            <label htmlFor="confirm">{t('confirmPassword')}</label>
            <input id="confirm" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required autoComplete="new-password" />
          </div>
          <div className="form-actions" style={{ borderTop: 'none', paddingTop: 0 }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? t('creatingAccount') : t('createAccount')}
            </button>
          </div>
          <p className="muted-hint">
            {t('alreadyHaveAccount')} <Link to="/login">{t('signInBtn')}</Link>
          </p>
        </form>
      </div>
    </section>
  )
}
