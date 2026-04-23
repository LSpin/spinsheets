import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { getCharacters, deleteCharacter } from '../api/characterApi'
import { getChronicles } from '../api/chronicleApi'
import ChronicleList from './ChronicleList'
import NewCharacterModal from '../components/NewCharacterModal'

export default function AsoiafPage() {
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

  useEffect(() => { switchTheme('asoiaf') }, [])

  useEffect(() => {
    async function load() {
      try {
        const [charRes, chronRes] = await Promise.all([getCharacters(), getChronicles()])
        setCharacters(charRes.data.filter(c => c.splat === 'ASOIAF' || c.splat === 'ASOIAF_ANTAGONIST'))
        setChronicles(chronRes.data.filter(c => (c.gameSystem || 'WOD') === 'ASOIAF'))
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
    <section aria-labelledby="asoiaf-heading">
      <div className="character-list-header">
        <h2 id="asoiaf-heading">{t('asoiafPageTitle')}</h2>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => setShowNewChar(true)}>
            {t('asoiafPageTitle')}
          </button>
          {isST && (
            <>
              <button className="btn btn-secondary" onClick={() => navigate('/asoiaf/antagonist/new')}>
                {t('asoiafNewAntagonistNpc')}
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/asoiaf/st-tools')}
                style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                {t('asoiafSTTools')}
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
        <ChronicleList system="ASOIAF" basePath="/asoiaf/chronicles" />
      )}

      {pageTab === 0 && error && <p className="status-error" role="alert">{error}</p>}
      {pageTab === 0 && loading && <p className="status-loading">{t('loading')}</p>}

      {pageTab === 0 && !loading && (() => {
        const pcs = characters.filter(c => c.splat === 'ASOIAF')
        const antagonists = characters.filter(c => c.splat === 'ASOIAF_ANTAGONIST')
        return (
          <>
            {pcs.length === 0 && antagonists.length === 0 && (
              <div className="empty-state">
                <p>{t('asoiafNoCharsEmpty')}</p>
                <p className="muted-hint">{t('asoiafCreateFirst')}</p>
              </div>
            )}

            {pcs.length > 0 && (
              <ul className="character-list" aria-label={t('asoiafCharactersList')}>
                {pcs.map(c => (
                  <li key={c.id} className="character-card">
                    <div className="character-card-info">
                      <h3>{c.name || t('unnamedCharacter')}</h3>
                      <dl className="character-card-meta">
                        <dt className="sr-only">System</dt>
                        <dd className="splat-badge splat-badge--asoiaf">ASOIAF</dd>
                        {c.asoiafHouse && (
                          <><dt className="sr-only">House</dt><dd>{c.asoiafHouse}</dd></>
                        )}
                        {c.concept && <><dt className="sr-only">{t('concept')}</dt><dd>{c.concept}</dd></>}
                        {isST && c.owner && <><dt className="sr-only">{t('playerLabel')}</dt><dd>{t('playerLabel')}: {c.owner.username}</dd></>}
                      </dl>
                    </div>
                    <div className="character-card-actions">
                      <button className="btn btn-secondary" aria-label={`${t('viewBtn')} ${c.name}`} onClick={() => navigate(`/characters/${c.id}?mode=view`)}>{t('viewBtn')}</button>
                      <button className="btn btn-secondary" aria-label={`${t('edit')} ${c.name}`} onClick={() => navigate(`/characters/${c.id}`)}>{t('edit')}</button>
                      <button className="btn btn-danger" aria-label={`${t('deleteBtn')} ${c.name}`} onClick={() => handleDelete(c.id, c.name)}>{t('deleteBtn')}</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {isST && antagonists.length > 0 && (
              <>
                <h3 style={{ marginTop: 'var(--space-xl)', marginBottom: 'var(--space-sm)' }}>NPCs / Antagonists ({antagonists.length})</h3>
                <ul className="character-list" aria-label={t('asoiafAntagonistsList')}>
                  {antagonists.map(c => (
                    <li key={c.id} className="character-card">
                      <div className="character-card-info">
                        <h3>{c.name || t('unnamedCharacter')}</h3>
                        <dl className="character-card-meta">
                          <dt className="sr-only">Type</dt>
                          <dd className="splat-badge splat-badge--asoiaf">NPC</dd>
                          {c.asoiafRole && <dd>{c.asoiafRole}</dd>}
                          {c.concept && <dd>{c.concept}</dd>}
                        </dl>
                      </div>
                      <div className="character-card-actions">
                        <button className="btn btn-secondary" aria-label={`${t('edit')} ${c.name}`} onClick={() => navigate(`/characters/${c.id}`)}>{t('edit')}</button>
                        <button className="btn btn-danger" aria-label={`${t('deleteBtn')} ${c.name}`} onClick={() => handleDelete(c.id, c.name)}>{t('deleteBtn')}</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )
      })()}
      <NewCharacterModal open={showNewChar} onClose={() => setShowNewChar(false)} chronicles={chronicles} newCharPath="/asoiaf/new" />
    </section>
  )
}
