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
      </section>

      {!user && (
        <section className="homepage-auth-cta">
          <h3>{t('joinCta')}</h3>
          <div className="homepage-cta">
            <Link to="/register" className="btn btn-primary btn-lg">{t('getStarted')}</Link>
            <Link to="/login" className="btn btn-secondary btn-lg">{t('signIn')}</Link>
          </div>
        </section>
      )}

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
          <Link to={user ? '/blades' : '/login'} className="system-card system-card--blades" onClick={() => switchTheme('blades')}>
            <h4>{t('systemBlades')}</h4>
            <p>{t('systemBladesDesc')}</p>
            <span className="system-card-cta">{t('systemEnter')}</span>
          </Link>
          <Link to={user ? '/dnd' : '/login'} className="system-card system-card--dnd" onClick={() => switchTheme('dnd')}>
            <h4>{t('systemDnd')}</h4>
            <p>{t('systemDndDesc')}</p>
            <span className="system-card-cta">{t('systemEnter')}</span>
          </Link>
          <Link to={user ? '/uestrpg' : '/login'} className="system-card system-card--uestrpg" onClick={() => switchTheme('uestrpg')}>
            <h4>{t('systemUestrpg')}</h4>
            <p>{t('systemUestrpgDesc')}</p>
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
          <div className="homepage-card">
            <h4>{t('featureInteractive')}</h4>
            <p>{t('featureInteractiveDesc')}</p>
          </div>
          <div className="homepage-card">
            <h4>{t('featureVillains')}</h4>
            <p>{t('featureVillainsDesc')}</p>
          </div>
        </div>
      </section>

      <section className="homepage-splats">
        <h3>{t('supportedGames')}</h3>
        <div className="homepage-grid">
          <div className="homepage-card">
            <span className="splat-badge splat-badge--vampire" style={{ fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>Vampire</span>
            <ul className="homepage-list">
              <li>V: The Masquerade (V20)</li>
              <li>V: The Masquerade (Revised)</li>
              <li>V: The Dark Ages (V20)</li>
              <li>Victorian Age Vampire</li>
              <li>Kindred of the East</li>
              <li>Ghouls & Mortals</li>
            </ul>
          </div>
          <div className="homepage-card">
            <span className="splat-badge splat-badge--werewolf" style={{ fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>Werewolf</span>
            <ul className="homepage-list">
              <li>W: The Apocalypse (W20)</li>
              <li>W: The Wyld West (W20)</li>
              <li>Changing Breeds / Fera</li>
              <li>Totems & Kinfolk</li>
              <li>Black Spiral Dancers</li>
            </ul>
          </div>
          <div className="homepage-card">
            <span className="splat-badge splat-badge--mage" style={{ fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>Mage</span>
            <ul className="homepage-list">
              <li>M: The Ascension (M20)</li>
              <li>Victorian Age Mage</li>
              <li>Familiars</li>
            </ul>
          </div>
          <div className="homepage-card">
            <span className="splat-badge splat-badge--hunter" style={{ fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>Hunter</span>
            <ul className="homepage-list">
              <li>Hunter: The Reckoning</li>
              <li>8 Creeds · 3 Virtues</li>
              <li>Edges & Conviction</li>
            </ul>
          </div>
          <div className="homepage-card">
            <span className="splat-badge splat-badge--wraith" style={{ fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>Wraith</span>
            <ul className="homepage-list">
              <li>Wraith: The Oblivion</li>
              <li>7 Legions · Shadow System</li>
              <li>Arcanoi & Passions</li>
            </ul>
          </div>
          <div className="homepage-card">
            <span className="splat-badge splat-badge--changeling" style={{ fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>Changeling</span>
            <ul className="homepage-list">
              <li>Changeling: The Dreaming</li>
              <li>9 Kiths · 3 Seemings</li>
              <li>Arts, Realms & Glamour</li>
            </ul>
          </div>
          <div className="homepage-card">
            <span className="splat-badge splat-badge--demon" style={{ fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>Demon</span>
            <ul className="homepage-list">
              <li>Demon: The Fallen</li>
              <li>7 Houses · 5 Factions</li>
              <li>Lore, Faith & Apocalyptic Form</li>
            </ul>
          </div>
          <div className="homepage-card">
            <span className="splat-badge splat-badge--seventh-sea" style={{ fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>7th Sea</span>
            <ul className="homepage-list">
              <li>7th Sea 2nd Edition</li>
              <li>Heroes, Villains & Ship Builder</li>
              <li>8 Sorceries · 11 Dueling Styles</li>
            </ul>
          </div>
          <div className="homepage-card">
            <span className="splat-badge splat-badge--l5r" style={{ fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>L5R</span>
            <ul className="homepage-list">
              <li>L5R 4th Edition</li>
              <li>55 Schools (9 Clans)</li>
              <li>197 Spells · 26 Kata</li>
              <li>Interactive Combat</li>
            </ul>
          </div>
          <div className="homepage-card">
            <span className="splat-badge splat-badge--blades" style={{ fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>Blades in the Dark</span>
            <ul className="homepage-list">
              <li>Blades + Deep Cuts</li>
              <li>11 Playbooks · 6 Crew Types</li>
              <li>Deep Cuts Toggle</li>
              <li>d6 Pool Dice Roller</li>
            </ul>
          </div>
          <div className="homepage-card">
            <span className="splat-badge splat-badge--dnd" style={{ fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>D&D 5e</span>
            <ul className="homepage-list">
              <li>D&D 5th Edition (SRD)</li>
              <li>13 Classes · 9 Races</li>
              <li>233 Spells · 49 Monsters</li>
              <li>d20 Dice Roller</li>
            </ul>
          </div>
          <div className="homepage-card">
            <span className="splat-badge splat-badge--uestrpg" style={{ fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>UESTRPG</span>
            <ul className="homepage-list">
              <li>Elder Scrolls RPG (D&D 5e)</li>
              <li>10 Races · 13 Classes</li>
              <li>13 Constellations</li>
              <li>Magicka System</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
