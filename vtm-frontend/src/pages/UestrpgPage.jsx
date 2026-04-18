import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { getCharacters, deleteCharacter } from '../api/characterApi'
import { getChronicles } from '../api/chronicleApi'
import ChronicleList from './ChronicleList'
import NewCharacterModal from '../components/NewCharacterModal'

export default function UestrpgPage() {
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

  useEffect(() => { switchTheme('uestrpg') }, [])

  useEffect(() => {
    async function load() {
      try {
        const [charRes, chronRes] = await Promise.all([getCharacters(), getChronicles()])
        setCharacters(charRes.data.filter(c => c.splat === 'UESTRPG' || c.splat === 'UESTRPG_ANTAGONIST'))
        setChronicles(chronRes.data.filter(c => (c.gameSystem || 'WOD') === 'UESTRPG'))
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

  return (
    <section aria-labelledby="uestrpg-heading">
      <div className="character-list-header">
        <h2 id="uestrpg-heading">{t('systemUestrpg')} — {t('uestrpgMyChars')}</h2>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => setShowNewChar(true)}>
            {t('systemUestrpg')} — {t('uestrpgNewChar')}
          </button>
          {isST && (
            <button className="btn btn-secondary" onClick={() => navigate('/uestrpg/antagonist/new')}>
              {t('uestrpgNewAntagonist')}
            </button>
          )}
          {isST && <button className="btn btn-secondary" onClick={() => navigate('/uestrpg/chronicles/new')}>{t('systemUestrpg')} — {t('newChronicle')}</button>}
        </div>
      </div>

      <div className="tab-list" role="tablist" style={{ marginBottom: 'var(--space-lg)' }}>
        <button role="tab" className={`btn btn-secondary${pageTab === 0 ? ' tab-btn--active' : ''}`}
          onClick={() => setPageTab(0)}>{t('navCharacters')}</button>
        <button role="tab" className={`btn btn-secondary${pageTab === 1 ? ' tab-btn--active' : ''}`}
          onClick={() => setPageTab(1)}>{t('navChronicles')}</button>
      </div>

      {pageTab === 1 && (
        <ChronicleList system="UESTRPG" basePath="/uestrpg/chronicles" />
      )}

      {pageTab === 0 && error && <p className="status-error" role="alert">{error}</p>}
      {pageTab === 0 && loading && <p className="status-loading">{t('loading')}</p>}

      {pageTab === 0 && !loading && (() => {
        const pcs = characters.filter(c => c.splat === 'UESTRPG')
        const antagonists = characters.filter(c => c.splat === 'UESTRPG_ANTAGONIST')
        return (
          <>
            {pcs.length === 0 && antagonists.length === 0 && (
              <div className="empty-state">
                <p>{t('uestrpgNoCharsYet')}</p>
                <p className="muted-hint">{t('uestrpgCreateFirst')}</p>
              </div>
            )}

            {pcs.length > 0 && (
              <ul className="character-list" aria-label={t('uestrpgMyChars')}>
                {pcs.map(c => (
                  <li key={c.id} className="character-card">
                    <div className="character-card-info">
                      <h3>{c.name || t('unnamedCharacter')}</h3>
                      <dl className="character-card-meta">
                        <dt className="sr-only">System</dt>
                        <dd className="splat-badge splat-badge--uestrpg">UESTRPG</dd>
                        {c.dndRace && (
                          <><dt className="sr-only">Race</dt><dd>{c.dndRace}</dd></>
                        )}
                        {c.dndClass && c.dndLevel && (
                          <><dt className="sr-only">Class & Level</dt><dd>{c.dndClass} {c.dndLevel}</dd></>
                        )}
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

            {isST && antagonists.length > 0 && (
              <>
                <h3 style={{ marginTop: 'var(--space-xl)', marginBottom: 'var(--space-sm)' }}>{t('splatUestrpgAntagonist')}s ({antagonists.length})</h3>
                <ul className="character-list" aria-label="Antagonists">
                  {antagonists.map(c => (
                    <li key={c.id} className="character-card">
                      <div className="character-card-info">
                        <h3>{c.name || t('unnamedCharacter')}</h3>
                        <dl className="character-card-meta">
                          <dt className="sr-only">Type</dt>
                          <dd className="splat-badge splat-badge--uestrpg">Antagonist</dd>
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
              </>
            )}
          </>
        )
      })()}
      <NewCharacterModal open={showNewChar} onClose={() => setShowNewChar(false)} chronicles={chronicles} newCharPath="/uestrpg/new" />
    </section>
  )
}
