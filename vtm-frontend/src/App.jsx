import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom'
import { useState, useRef, useEffect, lazy, Suspense } from 'react'

// Retry failed lazy imports once (handles stale chunk hashes after deploys)
function lazyRetry(fn) {
  return lazy(() => fn().catch(() => {
    const reloaded = sessionStorage.getItem('chunk_reload')
    if (!reloaded) {
      sessionStorage.setItem('chunk_reload', '1')
      window.location.reload()
    }
    sessionStorage.removeItem('chunk_reload')
    return fn()
  }))
}
import { AuthProvider, useAuth } from './context/AuthContext'
import { NewCharProvider } from './context/NewCharContext'
import { LanguageProvider, useLanguage } from './i18n/LanguageContext'
import LanguageToggle from './components/LanguageToggle'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import ErrorBoundary from './components/ErrorBoundary'

// ── Eagerly loaded (small, always needed) ──
import CharacterList from './components/CharacterList'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import HomePage from './pages/HomePage'
import ChronicleList from './pages/ChronicleList'
import ChronicleDetail from './pages/ChronicleDetail'
import ChronicleForm from './pages/ChronicleForm'

// ── Lazily loaded (heavy, per-system) ──
const CharacterRouter = lazyRetry(() => import('./components/CharacterRouter'))
const SplatSelectPage = lazyRetry(() => import('./pages/SplatSelectPage'))
const PlayersPage = lazyRetry(() => import('./pages/PlayersPage'))
const AdminPage = lazyRetry(() => import('./pages/AdminPage'))
const InvitePage = lazyRetry(() => import('./pages/InvitePage'))

// WoD forms
const CharacterForm = lazyRetry(() => import('./components/CharacterForm'))
const WerewolfForm = lazyRetry(() => import('./components/WerewolfForm'))
const MageForm = lazyRetry(() => import('./components/MageForm'))
const VampireRevisedForm = lazyRetry(() => import('./components/VampireRevisedForm'))
const KoteForm = lazyRetry(() => import('./components/KoteForm'))
const VampireDarkAgesForm = lazyRetry(() => import('./components/VampireDarkAgesForm'))
const VictorianVampireForm = lazyRetry(() => import('./components/VictorianVampireForm'))
const WyldWestWerewolfForm = lazyRetry(() => import('./components/WyldWestWerewolfForm'))
const VictorianMageForm = lazyRetry(() => import('./components/VictorianMageForm'))
const ChangingBreedsForm = lazyRetry(() => import('./components/ChangingBreedsForm'))
const GhoulForm = lazyRetry(() => import('./components/GhoulForm'))
const FamiliarForm = lazyRetry(() => import('./components/FamiliarForm'))
const TotemForm = lazyRetry(() => import('./components/TotemForm'))
const KinfolkForm = lazyRetry(() => import('./components/KinfolkForm'))
const HunterForm = lazyRetry(() => import('./components/HunterForm'))
const WraithForm = lazyRetry(() => import('./components/WraithForm'))
const ChangelingForm = lazyRetry(() => import('./components/ChangelingForm'))
const DemonForm = lazyRetry(() => import('./components/DemonForm'))
const BsdForm = lazyRetry(() => import('./components/BsdForm'))
const MortalsForm = lazyRetry(() => import('./components/MortalsForm'))

// 7th Sea
const SeventhSeaForm = lazyRetry(() => import('./components/SeventhSeaForm'))
const SeventhSeaVillainForm = lazyRetry(() => import('./components/SeventhSeaVillainForm'))
const SeventhSeaPage = lazyRetry(() => import('./pages/SeventhSeaPage'))

// L5R
const L5RForm = lazyRetry(() => import('./components/L5RForm'))
const L5RAntagonistForm = lazyRetry(() => import('./components/L5RAntagonistForm'))
const L5RPage = lazyRetry(() => import('./pages/L5RPage'))

// Blades
const BladesForm = lazyRetry(() => import('./components/BladesForm'))
const BladesCrewForm = lazyRetry(() => import('./components/BladesCrewForm'))
const BladesAntagonistForm = lazyRetry(() => import('./components/BladesAntagonistForm'))
const BladesPage = lazyRetry(() => import('./pages/BladesPage'))
const BladesClockManager = lazyRetry(() => import('./pages/BladesClockManager'))

// D&D
const DndForm = lazyRetry(() => import('./components/DndForm'))
const DndMonsterForm = lazyRetry(() => import('./components/DndMonsterForm'))
const DndPage = lazyRetry(() => import('./pages/DndPage'))

// UESTRPG
const UestrpgForm = lazyRetry(() => import('./components/UestrpgForm'))
const UestrpgAntagonistForm = lazyRetry(() => import('./components/UestrpgAntagonistForm'))
const UestrpgPage = lazyRetry(() => import('./pages/UestrpgPage'))

// Cyberpunk 2020
const CyberpunkForm = lazyRetry(() => import('./components/CyberpunkForm'))
const CyberpunkAntagonistForm = lazyRetry(() => import('./components/CyberpunkAntagonistForm'))
const CyberpunkPage = lazyRetry(() => import('./pages/CyberpunkPage'))
const AllChroniclesPage = lazyRetry(() => import('./pages/AllChroniclesPage'))
const AllCharactersPage = lazyRetry(() => import('./pages/AllCharactersPage'))

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

const THEME_TO_CHARACTERS_PATH = { wod: '/characters', '7thsea': '/7thsea', l5r: '/l5r', blades: '/blades', dnd: '/dnd', uestrpg: '/uestrpg', cyberpunk: '/cyberpunk' }

function AppShell() {
  const { user, isST } = useAuth()
  const { t } = useLanguage()
  const { theme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const charactersPath = THEME_TO_CHARACTERS_PATH[theme] || '/characters'

  // Close menu on navigation
  const navTo = () => { setMenuOpen(false) }

  // Close menu on Escape key
  useEffect(() => {
    if (!menuOpen) return
    const handleKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [menuOpen])

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  // Mobile tab-list: toggle expanded on tap, collapse after selecting a tab
  // Also inject prev/next carousel buttons around tab-lists
  useEffect(() => {
    const isMobile = () => window.innerWidth <= 640

    function injectCarousel(tabList) {
      if (tabList.parentElement?.classList.contains('tab-carousel')) return
      if (!isMobile()) return
      const wrapper = document.createElement('div')
      wrapper.className = 'tab-carousel'
      const prevBtn = document.createElement('button')
      prevBtn.className = 'tab-carousel-btn'
      prevBtn.setAttribute('aria-label', 'Previous tab')
      prevBtn.textContent = '\u276E'
      prevBtn.type = 'button'
      const nextBtn = document.createElement('button')
      nextBtn.className = 'tab-carousel-btn'
      nextBtn.setAttribute('aria-label', 'Next tab')
      nextBtn.textContent = '\u276F'
      nextBtn.type = 'button'

      function getTabButtons() {
        return [...tabList.querySelectorAll('[role="tab"], .btn')]
      }
      function getActiveIndex() {
        const tabs = getTabButtons()
        return tabs.findIndex(t => t.classList.contains('tab-btn--active') || t.getAttribute('aria-selected') === 'true')
      }

      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        const tabs = getTabButtons()
        const idx = getActiveIndex()
        if (idx > 0) tabs[idx - 1].click()
      })
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        const tabs = getTabButtons()
        const idx = getActiveIndex()
        if (idx < tabs.length - 1) tabs[idx + 1].click()
      })

      tabList.parentNode.insertBefore(wrapper, tabList)
      wrapper.appendChild(prevBtn)
      wrapper.appendChild(tabList)
      wrapper.appendChild(nextBtn)
    }

    function injectAll() {
      if (!isMobile()) return
      document.querySelectorAll('.tab-list[role="tablist"]').forEach(injectCarousel)
    }

    // Inject on initial load and on DOM changes (for lazy-loaded forms)
    const observer = new MutationObserver(() => { setTimeout(injectAll, 100) })
    observer.observe(document.body, { childList: true, subtree: true })
    setTimeout(injectAll, 200)

    function handleTabListClick(e) {
      const tabList = e.target.closest('.tab-list')
      if (!tabList) return
      if (e.target.closest('.tab-carousel-btn')) return
      const isTab = e.target.closest('[role="tab"]') || e.target.closest('.btn')
      if (!isTab) return
      const isActive = isTab.classList.contains('tab-btn--active') || isTab.getAttribute('aria-selected') === 'true'
      if (isActive && !tabList.classList.contains('tab-list--expanded')) {
        e.preventDefault()
        tabList.classList.add('tab-list--expanded')
      } else {
        tabList.classList.remove('tab-list--expanded')
      }
    }
    function handleOutsideClick(e) {
      if (!e.target.closest('.tab-list') && !e.target.closest('.tab-carousel-btn')) {
        document.querySelectorAll('.tab-list--expanded').forEach(el => el.classList.remove('tab-list--expanded'))
      }
    }
    document.addEventListener('click', handleTabListClick, true)
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      observer.disconnect()
      document.removeEventListener('click', handleTabListClick, true)
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header role="banner" ref={menuRef}>
        <div className="header-inner">
          <div className="header-title-row">
            <h1>{t('appTitle')}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <LanguageToggle />
              <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? t('closeMenu') : t('openMenu')} aria-expanded={menuOpen}>
                <span className={`hamburger-icon${menuOpen ? ' hamburger-icon--open' : ''}`} />
              </button>
            </div>
          </div>
          {user && (
            <nav aria-label="Primary navigation" className={`nav-menu${menuOpen ? ' nav-menu--open' : ''}`}>
              <Link to="/" onClick={navTo}>
                <button>{t('navHome')}</button>
              </Link>
              <Link to="/all-characters" onClick={navTo}>
                <button>{t('navCharacters')}</button>
              </Link>
              <Link to="/all-chronicles" onClick={navTo}>
                <button>{t('navChronicles')}</button>
              </Link>
              {isST && (
                <Link to="/players" onClick={navTo}>
                  <button>{t('navPlayers')}</button>
                </Link>
              )}
              {user?.username === 'spin' && (
                <Link to="/admin" onClick={navTo}>
                  <button>{t('navAdmin')}</button>
                </Link>
              )}
              <div className="nav-utils">
                <UserMenu />
              </div>
            </nav>
          )}
          {!user && (
            <nav aria-label="Primary navigation" className={`nav-menu${menuOpen ? ' nav-menu--open' : ''}`}>
              <Link to="/" onClick={navTo}><button>{t('navHome')}</button></Link>
              <Link to="/login" onClick={navTo}><button>{t('signIn')}</button></Link>
              <Link to="/register" onClick={navTo}><button>{t('getStarted')}</button></Link>
            </nav>
          )}
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <ErrorBoundary>
        <Suspense fallback={<p className="status-loading" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>}>
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
          <Route path="/characters/new/hunter" element={
            <ProtectedRoute><HunterForm /></ProtectedRoute>
          } />
          <Route path="/characters/new/wraith" element={
            <ProtectedRoute><WraithForm /></ProtectedRoute>
          } />
          <Route path="/characters/new/changeling" element={
            <ProtectedRoute><ChangelingForm /></ProtectedRoute>
          } />
          <Route path="/characters/new/demon" element={
            <ProtectedRoute><DemonForm /></ProtectedRoute>
          } />
          <Route path="/characters/new/bsd" element={
            <ProtectedRoute><BsdForm /></ProtectedRoute>
          } />
          <Route path="/characters/new/mortal" element={
            <ProtectedRoute><MortalsForm /></ProtectedRoute>
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
          <Route path="/l5r/antagonist/new" element={
            <ProtectedRoute><L5RAntagonistForm /></ProtectedRoute>
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
          <Route path="/blades/antagonist/new" element={
            <ProtectedRoute><BladesAntagonistForm /></ProtectedRoute>
          } />
          <Route path="/blades/clocks" element={
            <ProtectedRoute><BladesClockManager /></ProtectedRoute>
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
          <Route path="/dnd/monster/new" element={
            <ProtectedRoute><DndMonsterForm /></ProtectedRoute>
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
          <Route path="/uestrpg" element={
            <ProtectedRoute><UestrpgPage /></ProtectedRoute>
          } />
          <Route path="/uestrpg/new" element={
            <ProtectedRoute><UestrpgForm /></ProtectedRoute>
          } />
          <Route path="/uestrpg/antagonist/new" element={
            <ProtectedRoute><UestrpgAntagonistForm /></ProtectedRoute>
          } />
          <Route path="/uestrpg/chronicles" element={
            <ProtectedRoute><ChronicleList system="UESTRPG" basePath="/uestrpg/chronicles" /></ProtectedRoute>
          } />
          <Route path="/uestrpg/chronicles/new" element={
            <ProtectedRoute><ChronicleForm system="UESTRPG" basePath="/uestrpg/chronicles" /></ProtectedRoute>
          } />
          <Route path="/uestrpg/chronicles/:id" element={
            <ProtectedRoute><ChronicleDetail /></ProtectedRoute>
          } />
          <Route path="/cyberpunk" element={
            <ProtectedRoute><CyberpunkPage /></ProtectedRoute>
          } />
          <Route path="/cyberpunk/new" element={
            <ProtectedRoute><CyberpunkForm /></ProtectedRoute>
          } />
          <Route path="/cyberpunk/antagonist/new" element={
            <ProtectedRoute><CyberpunkAntagonistForm /></ProtectedRoute>
          } />
          <Route path="/cyberpunk/chronicles" element={
            <ProtectedRoute><ChronicleList system="CYBERPUNK" basePath="/cyberpunk/chronicles" /></ProtectedRoute>
          } />
          <Route path="/cyberpunk/chronicles/new" element={
            <ProtectedRoute><ChronicleForm system="CYBERPUNK" basePath="/cyberpunk/chronicles" /></ProtectedRoute>
          } />
          <Route path="/cyberpunk/chronicles/:id" element={
            <ProtectedRoute><ChronicleDetail /></ProtectedRoute>
          } />
          <Route path="/all-characters" element={
            <ProtectedRoute><AllCharactersPage /></ProtectedRoute>
          } />
          <Route path="/all-chronicles" element={
            <ProtectedRoute><AllChroniclesPage /></ProtectedRoute>
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
        </Suspense>
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
