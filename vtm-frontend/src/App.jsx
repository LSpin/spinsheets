import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LanguageProvider, useLanguage } from './i18n/LanguageContext'
import LanguageToggle from './components/LanguageToggle'
import CharacterList from './components/CharacterList'
import CharacterForm from './components/CharacterForm'
import CharacterRouter from './components/CharacterRouter'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import SplatSelectPage from './pages/SplatSelectPage'
import WerewolfForm from './components/WerewolfForm'
import MageForm from './components/MageForm'
import VampireRevisedForm from './components/VampireRevisedForm'
import KoteForm from './components/KoteForm'
import ChronicleList from './pages/ChronicleList'
import ChronicleDetail from './pages/ChronicleDetail'
import ChronicleForm from './pages/ChronicleForm'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <p className="status-loading">Loading...</p>
  if (!user) return <Navigate to="/register" replace />
  return children
}

function AppShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header role="banner">
        <div className="header-inner">
          <h1>WoD — Character Sheet</h1>
          {user && (
            <nav aria-label="Primary navigation">
              <Link to="/">
                <button>Characters</button>
              </Link>
              <Link to="/chronicles">
                <button>Chronicles</button>
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
              <LanguageToggle />
            </nav>
          )}
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <CharacterList />
            </ProtectedRoute>
          } />
          <Route path="/characters/new" element={
            <ProtectedRoute>
              <SplatSelectPage />
            </ProtectedRoute>
          } />
          <Route path="/characters/new/vampire" element={
            <ProtectedRoute>
              <CharacterForm />
            </ProtectedRoute>
          } />
          <Route path="/characters/new/werewolf" element={
            <ProtectedRoute>
              <WerewolfForm />
            </ProtectedRoute>
          } />
          <Route path="/characters/new/mage" element={
            <ProtectedRoute>
              <MageForm />
            </ProtectedRoute>
          } />
          <Route path="/characters/new/vampire-revised" element={
            <ProtectedRoute>
              <VampireRevisedForm />
            </ProtectedRoute>
          } />
          <Route path="/characters/new/kote" element={
            <ProtectedRoute>
              <KoteForm />
            </ProtectedRoute>
          } />
          <Route path="/characters/:id" element={
            <ProtectedRoute>
              <CharacterRouter />
            </ProtectedRoute>
          } />
          <Route path="/chronicles" element={
            <ProtectedRoute>
              <ChronicleList />
            </ProtectedRoute>
          } />
          <Route path="/chronicles/new" element={
            <ProtectedRoute>
              <ChronicleForm />
            </ProtectedRoute>
          } />
          <Route path="/chronicles/:id" element={
            <ProtectedRoute>
              <ChronicleDetail />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer role="contentinfo">
        <p>A Fan Project WoD Chronicles Creator</p>
      </footer>
    </>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </BrowserRouter>
    </LanguageProvider>
  )
}
