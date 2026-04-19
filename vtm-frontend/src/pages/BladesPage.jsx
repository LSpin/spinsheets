import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { getCharacters, deleteCharacter } from '../api/characterApi'
import { getChronicles } from '../api/chronicleApi'
import ChronicleList from './ChronicleList'
import NewCharacterModal from '../components/NewCharacterModal'

export default function BladesPage() {
  const [characters, setCharacters] = useState([])
  const [chronicles, setChronicles] = useState([])
  const [showNewChar, setShowNewChar] = useState(false)
  const [pageTab, setPageTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { user, isST } = useAuth()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()

  useEffect(() => { switchTheme('blades') }, [])

  useEffect(() => {
    async function load() {
      try {
        const [charRes, chronRes] = await Promise.all([getCharacters(), getChronicles()])
        setCharacters(charRes.data.filter(c => c.splat === 'BLADES' || c.splat === 'BLADES_CREW' || c.splat === 'BLADES_ANTAGONIST'))
        setChronicles(chronRes.data.filter(c => (c.gameSystem || 'WOD') === 'BLADES'))
      } catch {
        setError(t('failedLoadChars'))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleDelete(id, name) {
    if (!confirm(t('confirmDelete').replace('{0}', name))) return
    try {
      await deleteCharacter(id)
      setCharacters(prev => prev.filter(c => c.id !== id))
    } catch {
      setError(t('failedDeleteChar'))
    }
  }

  const scoundrels = characters.filter(c => c.splat === 'BLADES')
  const crews = characters.filter(c => c.splat === 'BLADES_CREW')
  const antagonists = characters.filter(c => c.splat === 'BLADES_ANTAGONIST')

  return (
    <section aria-labelledby="blades-heading">
      <div className="character-list-header">
        <h2 id="blades-heading">{t('systemBlades')} — {t('bladesMyScoundrels')}</h2>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button className="btn btn-primary" onClick={() => setShowNewChar(true)}>
            {t('bladesNewScoundrel')}
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/blades/crew/new')}>
            {t('bladesNewCrew')}
          </button>
          {isST && (
            <>
              <button className="btn btn-secondary" onClick={() => navigate('/blades/antagonist/new')}>
                {t('bladesNewAntagonist')}
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/blades/clocks')}
                style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                {t('bladesClockManagerBtn')}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="tab-list" role="tablist" style={{ marginBottom: 'var(--space-lg)' }}>
        <button role="tab" className={`btn btn-secondary${pageTab === 0 ? ' tab-btn--active' : ''}`}
          onClick={() => setPageTab(0)}>{t('navCharacters')}</button>
        <button role="tab" className={`btn btn-secondary${pageTab === 1 ? ' tab-btn--active' : ''}`}
          onClick={() => setPageTab(1)}>{t('navChronicles')}</button>
      </div>

      {pageTab === 1 && (
        <ChronicleList system="BLADES" basePath="/blades/chronicles" />
      )}

      {pageTab === 0 && error && <p className="status-error" role="alert">{error}</p>}
      {pageTab === 0 && loading && <p className="status-loading">{t('loading')}</p>}

      {/* Scoundrels */}
      {pageTab === 0 && !loading && scoundrels.length === 0 && crews.length === 0 && (
        <div className="empty-state">
          <p>{t('bladesNoCharsYet')}</p>
        </div>
      )}

      {pageTab === 0 && !loading && scoundrels.length > 0 && (
        <ul className="character-list" aria-label={t('bladesMyScoundrels')}>
          {scoundrels.map(c => (
            <li key={c.id} className="character-card">
              <div className="character-card-info">
                <h3>{c.name || t('unnamedCharacter')}</h3>
                <dl className="character-card-meta">
                  <dt className="sr-only">System</dt>
                  <dd className="splat-badge splat-badge--blades">Blades</dd>
                  {c.concept && <><dt className="sr-only">{t('concept')}</dt><dd>{c.concept}</dd></>}
                  {isST && c.owner && <><dt className="sr-only">{t('playerLabel')}</dt><dd>{t('playerLabel')}: {c.owner.username}</dd></>}
                </dl>
              </div>
              <div className="character-card-actions">
                <button className="btn btn-secondary" onClick={() => navigate(`/characters/${c.id}?mode=view`)}>{t('viewBtn')}</button>
                <button className="btn btn-secondary" onClick={() => navigate(`/characters/${c.id}`)}>{t('edit')}</button>
                <button className="btn btn-danger" onClick={() => handleDelete(c.id, c.name)}>{t('deleteBtn')}</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Crews */}
      {pageTab === 0 && !loading && (
        <div style={{ marginTop: 'var(--space-xl)' }}>
          <div className="character-list-header">
            <h2>{t('bladesCrews')}</h2>
          </div>
          {crews.length === 0 ? (
            <div className="empty-state"><p>{t('bladesNoCrewYet')}</p></div>
          ) : (
            <ul className="character-list" aria-label={t('bladesCrews')}>
              {crews.map(c => (
                <li key={c.id} className="character-card">
                  <div className="character-card-info">
                    <h3>{c.name || t('bladesUnnamedCrew')}</h3>
                    <dl className="character-card-meta">
                      <dt className="sr-only">Type</dt>
                      <dd className="splat-badge splat-badge--blades">Crew</dd>
                      {c.bladesCrewType && <><dt className="sr-only">Crew Type</dt><dd>{c.bladesCrewType}</dd></>}
                      {c.concept && <><dt className="sr-only">{t('concept')}</dt><dd>{c.concept}</dd></>}
                    </dl>
                  </div>
                  <div className="character-card-actions">
                    <button className="btn btn-secondary" onClick={() => navigate(`/characters/${c.id}`)}>{t('edit')}</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(c.id, c.name)}>{t('deleteBtn')}</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Antagonists */}
      {pageTab === 0 && !loading && isST && antagonists.length > 0 && (
        <div style={{ marginTop: 'var(--space-xl)' }}>
          <h3 style={{ marginBottom: 'var(--space-sm)' }}>{t('splatBladesAntagonist')}s ({antagonists.length})</h3>
          <ul className="character-list" aria-label="Antagonists">
            {antagonists.map(c => (
              <li key={c.id} className="character-card">
                <div className="character-card-info">
                  <h3>{c.name || t('unnamedCharacter')}</h3>
                  <dl className="character-card-meta">
                    <dt className="sr-only">Type</dt>
                    <dd className="splat-badge splat-badge--blades">{c.dndChallengeRating ? `Threat ${c.dndChallengeRating}` : 'Antagonist'}</dd>
                    {c.dndMonsterType && <dd>{c.dndMonsterType}</dd>}
                    {c.concept && <dd>{c.concept}</dd>}
                  </dl>
                </div>
                <div className="character-card-actions">
                  <button className="btn btn-secondary" onClick={() => navigate(`/characters/${c.id}`)}>{t('edit')}</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(c.id, c.name)}>{t('deleteBtn')}</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <NewCharacterModal open={showNewChar} onClose={() => setShowNewChar(false)} chronicles={chronicles} newCharPath="/blades/new" />
    </section>
  )
}
