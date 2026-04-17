import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NewCharProvider } from './context/NewCharContext'
import { LanguageProvider, useLanguage } from './i18n/LanguageContext'
import LanguageToggle from './components/LanguageToggle'
import CharacterList from './components/CharacterList'
import CharacterForm from './components/CharacterForm'
import CharacterRouter from './components/CharacterRouter'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import SplatSelectPage from './pages/SplatSelectPage'
import PlayersPage from './pages/PlayersPage'
import WerewolfForm from './components/WerewolfForm'
import MageForm from './components/MageForm'
import VampireRevisedForm from './components/VampireRevisedForm'
import KoteForm from './components/KoteForm'
import VampireDarkAgesForm from './components/VampireDarkAgesForm'
import VictorianVampireForm from './components/VictorianVampireForm'
import WyldWestWerewolfForm from './components/WyldWestWerewolfForm'
import VictorianMageForm from './components/VictorianMageForm'
import ChangingBreedsForm from './components/ChangingBreedsForm'
import ChronicleList from './pages/ChronicleList'
import ChronicleDetail from './pages/ChronicleDetail'
import ChronicleForm from './pages/ChronicleForm'
import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const { t } = useLanguage()
  if (loading) return <p className="status-loading">{t('loading')}</p>
  if (!user) return <Navigate to="/" replace />
  return children
}

function UserMenu() {
  const { user, logout, deleteAccount } = useAuth()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (!user) return null

  async function handleDeleteAccount() {
    try {
      await deleteAccount()
      navigate('/login')
    } catch {
      alert(t('deleteAccountFailed'))
    }
  }

  return (
    <div className="user-menu" ref={ref}>
      <button className="user-menu-trigger" onClick={() => setOpen(o => !o)}>
        {user.username} ({user.role === 'STORYTELLER' ? t('roleST') : t('rolePlayer')})
        <span className="user-menu-arrow">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="user-menu-dropdown">
          <button onClick={() => { setOpen(false); logout(); navigate('/login') }}>
            {t('navSignOut')}
          </button>
          <button
            style={{ color: '#e55' }}
            onClick={() => { setConfirmDelete(true); setOpen(false) }}
          >
            {t('deleteAccount')}
          </button>
        </div>
      )}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <h3>{t('deleteAccountTitle')}</h3>
            <p style={{ margin: '1rem 0', lineHeight: 1.5 }}>{t('deleteAccountWarning')}</p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(false)}>
                {t('cancel')}
              </button>
              <button className="btn btn-danger" onClick={handleDeleteAccount}>
                {t('deleteAccountConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AppShell() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const isST = user?.role === 'STORYTELLER'

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header role="banner">
        <div className="header-inner">
          <h1>{t('appTitle')}</h1>
          {user && (
            <nav aria-label="Primary navigation">
              <Link to="/">
                <button>{t('navHome')}</button>
              </Link>
              <Link to="/characters">
                <button>{t('navCharacters')}</button>
              </Link>
              <Link to="/chronicles">
                <button>{t('navChronicles')}</button>
              </Link>
              {isST && (
                <Link to="/players">
                  <button>{t('navPlayers')}</button>
                </Link>
              )}
              {user?.username === 'spin' && (
                <Link to="/admin">
                  <button>{t('navAdmin')}</button>
                </Link>
              )}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <UserMenu />
                <LanguageToggle />
              </div>
            </nav>
          )}
          {!user && (
            <nav aria-label="Primary navigation">
              <Link to="/"><button>{t('navHome')}</button></Link>
              <Link to="/login"><button>{t('signIn')}</button></Link>
              <Link to="/register"><button>{t('getStarted')}</button></Link>
              <div style={{ marginLeft: 'auto' }}><LanguageToggle /></div>
            </nav>
          )}
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/characters" element={
            <ProtectedRoute><CharacterList /></ProtectedRoute>
          } />
          <Route path="/characters/new" element={
            <ProtectedRoute><SplatSelectPage /></ProtectedRoute>
          } />
          <Route path="/characters/new/vampire" element={
            <ProtectedRoute><CharacterForm /></ProtectedRoute>
          } />
          <Route path="/characters/new/werewolf" element={
            <ProtectedRoute><WerewolfForm /></ProtectedRoute>
          } />
          <Route path="/characters/new/mage" element={
            <ProtectedRoute><MageForm /></ProtectedRoute>
          } />
          <Route path="/characters/new/vampire-revised" element={
            <ProtectedRoute><VampireRevisedForm /></ProtectedRoute>
          } />
          <Route path="/characters/new/kote" element={
            <ProtectedRoute><KoteForm /></ProtectedRoute>
          } />
          <Route path="/characters/new/vampire-dark-ages" element={
            <ProtectedRoute><VampireDarkAgesForm /></ProtectedRoute>
          } />
          <Route path="/characters/new/victorian-vampire" element={
            <ProtectedRoute><VictorianVampireForm /></ProtectedRoute>
          } />
          <Route path="/characters/new/wyld-west-werewolf" element={
            <ProtectedRoute><WyldWestWerewolfForm /></ProtectedRoute>
          } />
          <Route path="/characters/new/victorian-mage" element={
            <ProtectedRoute><VictorianMageForm /></ProtectedRoute>
          } />
          <Route path="/characters/new/changing-breeds" element={
            <ProtectedRoute><ChangingBreedsForm /></ProtectedRoute>
          } />
          <Route path="/characters/:id" element={
            <ProtectedRoute><CharacterRouter /></ProtectedRoute>
          } />
          <Route path="/chronicles" element={
            <ProtectedRoute><ChronicleList /></ProtectedRoute>
          } />
          <Route path="/chronicles/new" element={
            <ProtectedRoute><ChronicleForm /></ProtectedRoute>
          } />
          <Route path="/chronicles/:id" element={
            <ProtectedRoute><ChronicleDetail /></ProtectedRoute>
          } />
          {isST && (
            <Route path="/players" element={
              <ProtectedRoute><PlayersPage /></ProtectedRoute>
            } />
          )}
          <Route path="/admin" element={
            <ProtectedRoute><AdminPage /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer role="contentinfo">
        <p>{t('footerText')}</p>
        <a href="https://ko-fi.com/spinsheets" target="_blank" rel="noopener noreferrer" className="kofi-btn">
          ☕ {t('buyMeACoffee')}
        </a>
      </footer>
    </>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AuthProvider>
          <NewCharProvider>
            <AppShell />
          </NewCharProvider>
        </AuthProvider>
      </BrowserRouter>
    </LanguageProvider>
  )
}
