import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useLanguage()
  const redirect = searchParams.get('redirect')
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
      navigate(redirect || '/')
    } catch (err) {
      setError(err.response?.data?.error || t('loginFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section aria-labelledby="login-heading">
      <h2 id="login-heading">{t('signIn')}</h2>
      <div className="form-section" style={{ maxWidth: 400 }}>
        <form onSubmit={handleSubmit}>
          {error && <p className="status-error" role="alert">{error}</p>}
          <div className="field">
            <label htmlFor="username">{t('username')}</label>
            <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required autoComplete="username" />
          </div>
          <div className="field">
            <label htmlFor="password">{t('password')}</label>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
          </div>
          <div className="form-actions" style={{ borderTop: 'none', paddingTop: 0 }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? t('signingIn') : t('signInBtn')}
            </button>
          </div>
          <p className="muted-hint">
            {t('noAccount')} <Link to="/register">{t('registerHere')}</Link>
          </p>
          <p className="muted-hint">
            <Link to="/reset-password">{t('forgotPassword')}</Link>
          </p>
        </form>
      </div>
    </section>
  )
}
