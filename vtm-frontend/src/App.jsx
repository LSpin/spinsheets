import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import CharacterList from './components/CharacterList'
import CharacterForm from './components/CharacterForm'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <p className="status-loading">Loading...</p>
  if (!user) return <Navigate to="/register" replace />
  return children
}

function AppShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header role="banner">
        <div className="header-inner">
          <h1>VtM — Character Sheet</h1>
          {user && (
            <nav aria-label="Primary navigation">
              <Link to="/">
                <button>Characters</button>
              </Link>
              <Link to="/characters/new">
                <button>New character</button>
              </Link>
              <span className="muted" style={{ alignSelf: 'center', marginLeft: 'auto' }}>
                {user.username} ({user.role === 'STORYTELLER' ? 'ST' : 'Player'})
              </span>
              <button onClick={() => { logout(); navigate('/login') }}>
                Sign out
              </button>
            </nav>
          )}
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <CharacterList />
            </ProtectedRoute>
          } />
          <Route path="/characters/new" element={
            <ProtectedRoute>
              <CharacterForm />
            </ProtectedRoute>
          } />
          <Route path="/characters/:id" element={
            <ProtectedRoute>
              <CharacterForm />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer role="contentinfo">
        <p>VtM Character Sheet — Mind's Eye Theatre</p>
      </footer>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  )
}
