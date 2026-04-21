import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'

const SYSTEMS = [
  { path: '/characters', theme: 'wod', cls: 'system-card--wod', nameKey: 'systemWoD', descKey: 'systemWoDDesc' },
  { path: '/7thsea', theme: '7thsea', cls: 'system-card--7thsea', nameKey: 'system7thSea', descKey: 'system7thSeaDesc' },
  { path: '/l5r', theme: 'l5r', cls: 'system-card--l5r', nameKey: 'systemL5R', descKey: 'systemL5RDesc' },
  { path: '/blades', theme: 'blades', cls: 'system-card--blades', nameKey: 'systemBlades', descKey: 'systemBladesDesc' },
  { path: '/dnd', theme: 'dnd', cls: 'system-card--dnd', nameKey: 'systemDnd', descKey: 'systemDndDesc' },
  { path: '/uestrpg', theme: 'uestrpg', cls: 'system-card--uestrpg', nameKey: 'systemUestrpg', descKey: 'systemUestrpgDesc' },
  { path: '/cyberpunk', theme: 'cyberpunk', cls: 'system-card--cyberpunk', nameKey: 'systemCyberpunk', descKey: 'systemCyberpunkDesc' },
  { path: '/asoiaf', theme: 'asoiaf', cls: 'system-card--asoiaf', nameKey: 'systemAsoiaf', descKey: 'systemAsoiafDesc' },
]

function SystemCarousel({ user, t, switchTheme }) {
  const [activeIdx, setActiveIdx] = useState(0)

  function prev() { setActiveIdx(i => Math.max(0, i - 1)) }
  function next() { setActiveIdx(i => Math.min(SYSTEMS.length - 1, i + 1)) }

  return (
    <>
      {/* Desktop: grid */}
      <div className="system-grid system-grid--desktop">
        {SYSTEMS.map(sys => (
          <Link key={sys.path} to={user ? sys.path : '/login'} className={`system-card ${sys.cls}`} onClick={() => switchTheme(sys.theme)}>
            <h4>{t(sys.nameKey)}</h4>
            <p>{t(sys.descKey)}</p>
            <span className="system-card-cta">{t('systemEnter')}</span>
          </Link>
        ))}
      </div>

      {/* Mobile: carousel */}
      <div className="system-carousel" role="region" aria-label={t('chooseSystem')} aria-roledescription="carousel">
        <button className="system-carousel-btn" onClick={prev} disabled={activeIdx === 0}
          aria-label={activeIdx > 0 ? `Previous: ${t(SYSTEMS[activeIdx - 1].nameKey)}` : 'No previous system'}
          type="button">{'\u276E'}</button>

        <div className="system-carousel-track" aria-live="polite">
          <Link to={user ? SYSTEMS[activeIdx].path : '/login'}
            className={`system-card ${SYSTEMS[activeIdx].cls}`}
            onClick={() => switchTheme(SYSTEMS[activeIdx].theme)}>
            <h4>{t(SYSTEMS[activeIdx].nameKey)}</h4>
            <p>{t(SYSTEMS[activeIdx].descKey)}</p>
            <span className="system-card-cta">{t('systemEnter')}</span>
          </Link>
        </div>

        <button className="system-carousel-btn" onClick={next} disabled={activeIdx === SYSTEMS.length - 1}
          aria-label={activeIdx < SYSTEMS.length - 1 ? `Next: ${t(SYSTEMS[activeIdx + 1].nameKey)}` : 'No next system'}
          type="button">{'\u276F'}</button>

        {/* Dot indicators */}
        <div className="system-carousel-dots" role="tablist" aria-label="System indicators">
          {SYSTEMS.map((sys, i) => (
            <button key={sys.path} role="tab" type="button"
              className={`system-carousel-dot${i === activeIdx ? ' system-carousel-dot--active' : ''}`}
              onClick={() => setActiveIdx(i)}
              aria-selected={i === activeIdx}
              aria-label={t(sys.nameKey)} />
          ))}
        </div>
      </div>
    </>
  )
}

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
        <SystemCarousel user={user} t={t} switchTheme={switchTheme} />
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

      <section className="homepage-tutorial">
        <h3>{t('howToUseTitle')}</h3>
        <div className="homepage-grid homepage-grid--tutorial">
          <div className="homepage-card homepage-card--step">
            <span className="step-number">1</span>
            <h4>{t('tutorialStep1Title')}</h4>
            <p>{t('tutorialStep1Desc')}</p>
          </div>
          <div className="homepage-card homepage-card--step">
            <span className="step-number">2</span>
            <h4>{t('tutorialStep2Title')}</h4>
            <p>{t('tutorialStep2Desc')}</p>
          </div>
          <div className="homepage-card homepage-card--step">
            <span className="step-number">3</span>
            <h4>{t('tutorialStep3Title')}</h4>
            <p>{t('tutorialStep3Desc')}</p>
          </div>
          <div className="homepage-card homepage-card--step">
            <span className="step-number">4</span>
            <h4>{t('tutorialStep4Title')}</h4>
            <p>{t('tutorialStep4Desc')}</p>
          </div>
          <div className="homepage-card homepage-card--step">
            <span className="step-number">5</span>
            <h4>{t('tutorialStep5Title')}</h4>
            <p>{t('tutorialStep5Desc')}</p>
          </div>
          <div className="homepage-card homepage-card--step">
            <span className="step-number">6</span>
            <h4>{t('tutorialStep6Title')}</h4>
            <p>{t('tutorialStep6Desc')}</p>
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
