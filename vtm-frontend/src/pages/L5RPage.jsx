import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { getCharacters, deleteCharacter } from '../api/characterApi'
import { getChronicles } from '../api/chronicleApi'
import ChronicleList from './ChronicleList'

export default function L5RPage() {
  const [characters, setCharacters] = useState([])
  const [chronicles, setChronicles] = useState([])
  const [showChronicleSelect, setShowChronicleSelect] = useState(false)
  const [selectedChronicle, setSelectedChronicle] = useState('')
  const [pageTab, setPageTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { user, isST } = useAuth()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()

  useEffect(() => { switchTheme('l5r') }, [])

  useEffect(() => {
    async function load() {
      try {
        const [charRes, chronRes] = await Promise.all([getCharacters(), getChronicles()])
        setCharacters(charRes.data.filter(c => c.splat === 'L5R' || c.splat === 'L5R_ANTAGONIST'))
        setChronicles(chronRes.data.filter(c => (c.gameSystem || 'WOD') === 'L5R'))
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
    <section aria-labelledby="l5r-heading">
      <div className="character-list-header">
        <h2 id="l5r-heading">{t('systemL5R')} — {t('l5rMySamurai')}</h2>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/l5r/new?mode=guided')}>
            {t('l5rNewSamurai')}
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/l5r/new')}>
            {t('l5rBlankSheet')}
          </button>
          {isST && (
            <button className="btn btn-secondary" onClick={() => navigate('/l5r/antagonist/new')}>
              {t('l5rNewAntagonist')}
            </button>
          )}
          {chronicles.length > 0 && (
            <button className="btn btn-secondary" onClick={() => setShowChronicleSelect(true)}>
              {t('forAChronicle')}
            </button>
          )}
        </div>
        {showChronicleSelect && (
          <div style={{ marginTop: 'var(--space-sm)', display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-end' }}>
            <div className="field" style={{ flex: 1 }}>
              <label>{t('selectChronicle')}</label>
              <select value={selectedChronicle} onChange={e => setSelectedChronicle(e.target.value)}>
                <option value="">{t('select')}</option>
                {chronicles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <button className="btn btn-primary" disabled={!selectedChronicle}
              onClick={() => { navigate(`/l5r/new?mode=guided&chronicle=${selectedChronicle}`); setShowChronicleSelect(false) }}>
              {t('proceed')}
            </button>
            <button className="btn btn-secondary" onClick={() => setShowChronicleSelect(false)}>{t('cancel')}</button>
          </div>
        )}
      </div>

      <div className="tab-list" role="tablist" style={{ marginBottom: 'var(--space-lg)' }}>
        <button role="tab" className={`btn btn-secondary${pageTab === 0 ? ' tab-btn--active' : ''}`}
          onClick={() => setPageTab(0)}>{t('navCharacters')}</button>
        <button role="tab" className={`btn btn-secondary${pageTab === 1 ? ' tab-btn--active' : ''}`}
          onClick={() => setPageTab(1)}>{t('navChronicles')}</button>
      </div>

      {pageTab === 1 && (
        <ChronicleList system="L5R" basePath="/l5r/chronicles" />
      )}

      {pageTab === 0 && error && <p className="status-error" role="alert">{error}</p>}
      {pageTab === 0 && loading && <p className="status-loading">{t('loading')}</p>}

      {pageTab === 0 && !loading && (() => {
        const samurai = characters.filter(c => c.splat === 'L5R')
        const antagonists = characters.filter(c => c.splat === 'L5R_ANTAGONIST')
        return (
          <>
            {samurai.length === 0 && antagonists.length === 0 && (
              <div className="empty-state">
                <p>{t('l5rNoSamuraiYet')}</p>
                <p>{t('l5rCreateFirst')}</p>
              </div>
            )}

            {samurai.length > 0 && (
              <ul className="character-list" aria-label={t('l5rMySamurai')}>
                {samurai.map(c => (
                  <li key={c.id} className="character-card">
                    <div className="character-card-info">
                      <h3>{c.name || t('unnamedCharacter')}</h3>
                      <dl className="character-card-meta">
                        <dt className="sr-only">System</dt>
                        <dd className="splat-badge splat-badge--l5r">L5R</dd>
                        {c.l5rClan && <><dt className="sr-only">{t('l5rClan')}</dt><dd>{c.l5rClan}</dd></>}
                        {c.l5rFamily && <><dt className="sr-only">{t('l5rFamily')}</dt><dd>{c.l5rFamily}</dd></>}
                        {c.l5rSchool && <><dt className="sr-only">{t('l5rSchool')}</dt><dd>{c.l5rSchool}</dd></>}
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
                <h3 style={{ marginTop: 'var(--space-xl)', marginBottom: 'var(--space-sm)' }}>{t('splatL5RAntagonist')}s ({antagonists.length})</h3>
                <ul className="character-list" aria-label="Antagonists">
                  {antagonists.map(c => (
                    <li key={c.id} className="character-card">
                      <div className="character-card-info">
                        <h3>{c.name || t('unnamedCharacter')}</h3>
                        <dl className="character-card-meta">
                          <dt className="sr-only">Type</dt>
                          <dd className="splat-badge splat-badge--l5r">Antagonist</dd>
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
    </section>
  )
}
