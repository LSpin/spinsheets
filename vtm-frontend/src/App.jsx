import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NewCharProvider } from './context/NewCharContext'
import { LanguageProvider, useLanguage } from './i18n/LanguageContext'
import LanguageToggle from './components/LanguageToggle'
import { ThemeProvider, useTheme } from './context/ThemeContext'
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
import GhoulForm from './components/GhoulForm'
import FamiliarForm from './components/FamiliarForm'
import TotemForm from './components/TotemForm'
import KinfolkForm from './components/KinfolkForm'
import SeventhSeaForm from './components/SeventhSeaForm'
import SeventhSeaVillainForm from './components/SeventhSeaVillainForm'
import SeventhSeaPage from './pages/SeventhSeaPage'
import L5RForm from './components/L5RForm'
import L5RPage from './pages/L5RPage'
import BladesForm from './components/BladesForm'
import BladesCrewForm from './components/BladesCrewForm'
import BladesPage from './pages/BladesPage'
import DndForm from './components/DndForm'
import DndPage from './pages/DndPage'
import AdminPage from './pages/AdminPage'
import InvitePage from './pages/InvitePage'
import ErrorBoundary from './components/ErrorBoundary'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const { t } = useLanguage()
  const location = window.location.pathname + window.location.search
  if (loading) return <p className="status-loading">{t('loading')}</p>
  if (!user) return <Navigate to={`/login?redirect=${encodeURIComponent(location)}`} replace />
  return children
}

function UserMenu() {
  const { user, logout, deleteAccount, playerMode, togglePlayerMode } = useAuth()
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
        {user.username} ({user.role === 'STORYTELLER' ? (playerMode ? t('rolePlayer') : t('roleST')) : t('rolePlayer')})
        <span className="user-menu-arrow">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="user-menu-dropdown">
          {user.role === 'STORYTELLER' && (
            <button onClick={() => { togglePlayerMode(); setOpen(false) }}>
              {playerMode ? t('switchToST') : t('switchToPlayer')}
            </button>
          )}
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
        <div className="modal-overlay" onClick={() => setConfirmDelete(false)} role="dialog" aria-modal="true" aria-labelledby="delete-modal-title"
          onKeyDown={e => { if (e.key === 'Escape') setConfirmDelete(false) }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <h3 id="delete-modal-title">{t('deleteAccountTitle')}</h3>
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

const THEME_TO_CHARACTERS_PATH = { wod: '/characters', '7thsea': '/7thsea', l5r: '/l5r', blades: '/blades', dnd: '/dnd' }

function AppShell() {
  const { user, isST } = useAuth()
  const { t } = useLanguage()
  const { theme } = useTheme()
  const charactersPath = THEME_TO_CHARACTERS_PATH[theme] || '/characters'

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
              <Link to={charactersPath}>
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
              <div style={{ marginLeft: 'auto' }}>
                <LanguageToggle />
              </div>
            </nav>
          )}
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <ErrorBoundary>
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
          <Route path="/characters/new/ghoul" element={
            <ProtectedRoute><GhoulForm /></ProtectedRoute>
          } />
          <Route path="/characters/new/familiar" element={
            <ProtectedRoute><FamiliarForm /></ProtectedRoute>
          } />
          <Route path="/characters/new/totem" element={
            <ProtectedRoute><TotemForm /></ProtectedRoute>
          } />
          <Route path="/characters/new/kinfolk" element={
            <ProtectedRoute><KinfolkForm /></ProtectedRoute>
          } />
          <Route path="/characters/:id" element={
            <ProtectedRoute><CharacterRouter /></ProtectedRoute>
          } />
          <Route path="/7thsea" element={
            <ProtectedRoute><SeventhSeaPage /></ProtectedRoute>
          } />
          <Route path="/7thsea/new" element={
            <ProtectedRoute><SeventhSeaForm /></ProtectedRoute>
          } />
          <Route path="/7thsea/villain/new" element={
            <ProtectedRoute><SeventhSeaVillainForm /></ProtectedRoute>
          } />
          <Route path="/7thsea/chronicles" element={
            <ProtectedRoute><ChronicleList system="SEVENTH_SEA" basePath="/7thsea/chronicles" /></ProtectedRoute>
          } />
          <Route path="/7thsea/chronicles/new" element={
            <ProtectedRoute><ChronicleForm system="SEVENTH_SEA" basePath="/7thsea/chronicles" /></ProtectedRoute>
          } />
          <Route path="/7thsea/chronicles/:id" element={
            <ProtectedRoute><ChronicleDetail /></ProtectedRoute>
          } />
          <Route path="/l5r" element={
            <ProtectedRoute><L5RPage /></ProtectedRoute>
          } />
          <Route path="/l5r/new" element={
            <ProtectedRoute><L5RForm /></ProtectedRoute>
          } />
          <Route path="/l5r/chronicles" element={
            <ProtectedRoute><ChronicleList system="L5R" basePath="/l5r/chronicles" /></ProtectedRoute>
          } />
          <Route path="/l5r/chronicles/new" element={
            <ProtectedRoute><ChronicleForm system="L5R" basePath="/l5r/chronicles" /></ProtectedRoute>
          } />
          <Route path="/l5r/chronicles/:id" element={
            <ProtectedRoute><ChronicleDetail /></ProtectedRoute>
          } />
          <Route path="/blades" element={
            <ProtectedRoute><BladesPage /></ProtectedRoute>
          } />
          <Route path="/blades/new" element={
            <ProtectedRoute><BladesForm /></ProtectedRoute>
          } />
          <Route path="/blades/crew/new" element={
            <ProtectedRoute><BladesCrewForm /></ProtectedRoute>
          } />
          <Route path="/blades/chronicles" element={
            <ProtectedRoute><ChronicleList system="BLADES" basePath="/blades/chronicles" /></ProtectedRoute>
          } />
          <Route path="/blades/chronicles/new" element={
            <ProtectedRoute><ChronicleForm system="BLADES" basePath="/blades/chronicles" /></ProtectedRoute>
          } />
          <Route path="/blades/chronicles/:id" element={
            <ProtectedRoute><ChronicleDetail /></ProtectedRoute>
          } />
          <Route path="/dnd" element={
            <ProtectedRoute><DndPage /></ProtectedRoute>
          } />
          <Route path="/dnd/new" element={
            <ProtectedRoute><DndForm /></ProtectedRoute>
          } />
          <Route path="/dnd/chronicles" element={
            <ProtectedRoute><ChronicleList system="DND" basePath="/dnd/chronicles" /></ProtectedRoute>
          } />
          <Route path="/dnd/chronicles/new" element={
            <ProtectedRoute><ChronicleForm system="DND" basePath="/dnd/chronicles" /></ProtectedRoute>
          } />
          <Route path="/dnd/chronicles/:id" element={
            <ProtectedRoute><ChronicleDetail /></ProtectedRoute>
          } />
          <Route path="/chronicles" element={
            <ProtectedRoute><ChronicleList system="WOD" basePath="/chronicles" /></ProtectedRoute>
          } />
          <Route path="/chronicles/new" element={
            <ProtectedRoute><ChronicleForm system="WOD" basePath="/chronicles" /></ProtectedRoute>
          } />
          <Route path="/chronicles/:id" element={
            <ProtectedRoute><ChronicleDetail /></ProtectedRoute>
          } />
          {isST && (
            <Route path="/players" element={
              <ProtectedRoute><PlayersPage /></ProtectedRoute>
            } />
          )}
          <Route path="/invite/:code" element={
            <ProtectedRoute><InvitePage /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute><AdminPage /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </ErrorBoundary>
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
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <NewCharProvider>
              <AppShell />
            </NewCharProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </LanguageProvider>
  )
}
