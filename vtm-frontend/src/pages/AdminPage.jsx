import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import axios from 'axios'

const api = axios.create({ baseURL: '/api' })
api.interceptors.request.use(config => {
  const token = localStorage.getItem('vtm_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default function AdminPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user?.username !== 'spin') { navigate('/'); return }
    loadUsers()
  }, [user])

  async function loadUsers() {
    try {
      const res = await api.get('/admin/users')
      setUsers(res.data)
    } catch {
      setError(t('adminLoadFailed'))
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(userId, username) {
    if (!confirm(t('adminConfirmDelete').replace('{0}', username))) return
    try {
      await api.delete(`/admin/users/${userId}`)
      setUsers(prev => prev.filter(u => u.id !== userId))
    } catch (err) {
      setError(err.response?.data?.error || t('adminDeleteFailed'))
    }
  }

  if (user?.username !== 'spin') return null

  return (
    <section>
      <h2>{t('adminTitle')}</h2>

      {error && <p className="status-error" role="alert">{error}</p>}
      {loading && <p className="status-loading">{t('loading')}</p>}

      {!loading && (
        <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>ID</th>
              <th style={{ padding: '0.5rem' }}>{t('adminUsername')}</th>
              <th style={{ padding: '0.5rem' }}>{t('adminEmail')}</th>
              <th style={{ padding: '0.5rem' }}>{t('adminRole')}</th>
              <th style={{ padding: '0.5rem' }}>{t('adminCreated')}</th>
              <th style={{ padding: '0.5rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '0.5rem' }}>{u.id}</td>
                <td style={{ padding: '0.5rem', fontWeight: u.username === 'spin' ? 700 : 400 }}>{u.username}</td>
                <td style={{ padding: '0.5rem' }}>{u.email}</td>
                <td style={{ padding: '0.5rem' }}>{u.role}</td>
                <td style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '0.5rem' }}>
                  {u.username !== 'spin' && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id, u.username)}>
                      {t('deleteBtn')}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
