import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'

export default function HomePage() {
  const { user } = useAuth()
  const { t } = useLanguage()

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
        {user && (
          <div className="homepage-cta">
            <Link to="/characters" className="btn btn-primary">{t('navCharacters')}</Link>
            <Link to="/characters/new" className="btn btn-secondary">{t('newCharBtn')}</Link>
          </div>
        )}
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
            </ul>
          </div>
          <div className="homepage-card">
            <span className="splat-badge splat-badge--mage" style={{ fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>Mage</span>
            <ul className="homepage-list">
              <li>Mage: The Ascension (M20)</li>
              <li>Victorian Age Mage</li>
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

      <footer className="homepage-footer">
        <p>{t('footerText')}</p>
      </footer>
    </div>
  )
}
