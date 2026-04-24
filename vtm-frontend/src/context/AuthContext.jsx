import { createContext, useContext, useState, useEffect } from 'react'
import { loginApi, registerApi, deleteAccountApi } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [playerMode, setPlayerMode] = useState(() => localStorage.getItem('vtm_playerMode') === 'true')

  useEffect(() => {
    const stored = localStorage.getItem('vtm_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { localStorage.removeItem('vtm_user') }
    }
    setLoading(false)
  }, [])

  function persist(data) {
    const u = { userId: data.userId, username: data.username, role: data.role }
    localStorage.setItem('vtm_token', data.token)
    if (data.refreshToken) localStorage.setItem('vtm_refresh', data.refreshToken)
    localStorage.setItem('vtm_user', JSON.stringify(u))
    setUser(u)
  }

  async function login(username, password) {
    const res = await loginApi({ username, password })
    persist(res.data)
  }

  async function register(username, email, password, role) {
    const res = await registerApi({ username, email, password, role })
    persist(res.data)
  }

  function logout() {
    localStorage.removeItem('vtm_token')
    localStorage.removeItem('vtm_refresh')
    localStorage.removeItem('vtm_user')
    setUser(null)
  }

  async function deleteAccount() {
    await deleteAccountApi()
    logout()
  }

  function togglePlayerMode() {
    setPlayerMode(prev => {
      const next = !prev
      localStorage.setItem('vtm_playerMode', String(next))
      return next
    })
  }

  // STs in player mode act as players for UI purposes
  const isST = user?.role === 'STORYTELLER' && !playerMode

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, deleteAccount, playerMode, togglePlayerMode, isST }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
