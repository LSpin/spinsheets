import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import api from '../api/apiClient'
import ConfirmDialog from '../components/ConfirmDialog'
import useConfirm from '../hooks/useConfirm'

export default function AdminPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { confirm, confirmDialogProps } = useConfirm()

  useEffect(() => {
    if (user?.role !== 'ADMIN') { navigate('/'); return }
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
    const ok = await confirm(t('adminConfirmDelete').replace('{0}', username), t('deleteBtn'))
    if (!ok) return
    try {
      await api.delete(`/admin/users/${userId}`)
      setUsers(prev => prev.filter(u => u.id !== userId))
    } catch (err) {
      setError(err.response?.data?.error || t('adminDeleteFailed'))
    }
  }

  if (user?.role !== 'ADMIN') return null

  return (
    <section>
      <h2>{t('adminTitle')}</h2>

      {error && <p className="status-error" role="alert">{error}</p>}
      {loading && <p className="status-loading">{t('loading')}</p>}

      {!loading && (
        <table className="w-full text-base" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr className="text-left" style={{ borderBottom: '2px solid var(--color-border)' }}>
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
              <tr key={u.id} className="border-b">
                <td style={{ padding: '0.5rem' }}>{u.id}</td>
                <td style={{ padding: '0.5rem', fontWeight: u.role === 'ADMIN' ? 700 : 400 }}>{u.username}</td>
                <td style={{ padding: '0.5rem' }}>{u.email}</td>
                <td style={{ padding: '0.5rem' }}>{u.role}</td>
                <td style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '0.5rem' }}>
                  {u.role !== 'ADMIN' && (
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
      <ConfirmDialog {...confirmDialogProps} confirmLabel={t('deleteBtn')} cancelLabel={t('cancel')} />
    </section>
  )
}
