import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'

export default function HomePage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  useEffect(() => { switchTheme('wod') }, [])

  return (
    <div className="homepage">
      <section className="homepage-hero">
        <h2>{t('heroTitle')}</h2>
        <p className="homepage-subtitle">{t('heroSubtitle')}</p>
        {!user && (
          <div className="homepage-cta">
            <Link to="/register" className="btn btn-primary">{t('getStarted')}</Link>
            <Link to="/login" className="btn btn-secondary">{t('signIn')}</Link>
          </div>
        )}
      </section>

      <section className="homepage-systems">
        <h3>{t('chooseSystem')}</h3>
        <div className="system-grid">
          <Link to={user ? '/characters' : '/login'} className="system-card system-card--wod" onClick={() => switchTheme('wod')}>
            <h4>{t('systemWoD')}</h4>
            <p>{t('systemWoDDesc')}</p>
            <span className="system-card-cta">{t('systemEnter')}</span>
          </Link>
          <Link to={user ? '/7thsea' : '/login'} className="system-card system-card--7thsea" onClick={() => switchTheme('7thsea')}>
            <h4>{t('system7thSea')}</h4>
            <p>{t('system7thSeaDesc')}</p>
            <span className="system-card-cta">{t('systemEnter')}</span>
          </Link>
          <Link to={user ? '/l5r' : '/login'} className="system-card system-card--l5r" onClick={() => switchTheme('l5r')}>
            <h4>{t('systemL5R')}</h4>
            <p>{t('systemL5RDesc')}</p>
            <span className="system-card-cta">{t('systemEnter')}</span>
          </Link>
        </div>
      </section>

      <section className="homepage-features">
        <h3>{t('featuresTitle')}</h3>
        <div className="homepage-grid">
          <div className="homepage-card">
            <h4>{t('featureSheets')}</h4>
            <p>{t('featureSheetsDesc')}</p>
          </div>
          <div className="homepage-card">
            <h4>{t('featureCatalogs')}</h4>
            <p>{t('featureCatalogsDesc')}</p>
          </div>
          <div className="homepage-card">
            <h4>{t('featureChronicles')}</h4>
            <p>{t('featureChroniclesDesc')}</p>
          </div>
          <div className="homepage-card">
            <h4>{t('featureTracking')}</h4>
            <p>{t('featureTrackingDesc')}</p>
          </div>
        </div>
      </section>

      <section className="homepage-splats">
        <h3>{t('supportedGames')}</h3>
        <div className="homepage-grid">
          <div className="homepage-card">
            <span className="splat-badge splat-badge--vampire" style={{ fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>Vampire</span>
            <ul className="homepage-list">
              <li>Vampire: The Masquerade (V20)</li>
              <li>Vampire: The Masquerade (Revised)</li>
              <li>Vampire: The Dark Ages (V20)</li>
              <li>Victorian Age Vampire</li>
              <li>Kindred of the East</li>
            </ul>
          </div>
          <div className="homepage-card">
            <span className="splat-badge splat-badge--werewolf" style={{ fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>Werewolf</span>
            <ul className="homepage-list">
              <li>Werewolf: The Apocalypse (W20)</li>
              <li>Werewolf: The Wyld West (W20)</li>
              <li>Changing Breeds / Fera (W20)</li>
            </ul>
          </div>
          <div className="homepage-card">
            <span className="splat-badge splat-badge--mage" style={{ fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>Mage</span>
            <ul className="homepage-list">
              <li>Mage: The Ascension (M20)</li>
              <li>Victorian Age Mage</li>
            </ul>
          </div>
          <div className="homepage-card">
            <span className="splat-badge splat-badge--seventh-sea" style={{ fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>7th Sea</span>
            <ul className="homepage-list">
              <li>7th Sea 2nd Edition</li>
            </ul>
          </div>
          <div className="homepage-card">
            <span className="splat-badge splat-badge--l5r" style={{ fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>L5R</span>
            <ul className="homepage-list">
              <li>Legend of the Five Rings 4th Edition</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="homepage-sitemap">
        <h3>{t('sitemapTitle')}</h3>
        <div className="homepage-grid">
          <div className="homepage-card">
            <h4>{t('sitemapCharacters')}</h4>
            <ul className="homepage-list">
              <li><Link to="/characters">{t('navCharacters')}</Link></li>
              <li><Link to="/characters/new">{t('newCharBtn')}</Link></li>
            </ul>
          </div>
          <div className="homepage-card">
            <h4>{t('sitemapChronicles')}</h4>
            <ul className="homepage-list">
              <li><Link to="/chronicles">{t('navChronicles')}</Link></li>
            </ul>
          </div>
          <div className="homepage-card">
            <h4>{t('sitemapAccount')}</h4>
            <ul className="homepage-list">
              {!user && <li><Link to="/register">{t('getStarted')}</Link></li>}
              {!user && <li><Link to="/login">{t('signIn')}</Link></li>}
              {user && <li><Link to="/characters">{t('navCharacters')}</Link></li>}
              <li><Link to="/reset-password">{t('resetPasswordTitle')}</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
