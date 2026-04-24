import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { getCharacters, deleteCharacter } from '../api/characterApi'
import { getChronicles } from '../api/chronicleApi'
import ChronicleList from './ChronicleList'
import NewCharacterModal from '../components/NewCharacterModal'
import ConfirmDialog from '../components/ConfirmDialog'
import useConfirm from '../hooks/useConfirm'

export default function L5RPage() {
  const [characters, setCharacters] = useState([])
  const [chronicles, setChronicles] = useState([])
  const [showNewChar, setShowNewChar] = useState(false)
  const [showEditionPicker, setShowEditionPicker] = useState(false)
  const [selectedEdition, setSelectedEdition] = useState(null)
  const [pageTab, setPageTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { user, isST } = useAuth()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const { confirm, confirmDialogProps } = useConfirm()

  useEffect(() => { switchTheme('l5r') }, [])

  useEffect(() => {
    async function load() {
      try {
        const [charRes, chronRes] = await Promise.all([getCharacters(), getChronicles()])
        setCharacters(charRes.data.filter(c => c.splat === 'L5R' || c.splat === 'L5R_ANTAGONIST' || c.splat === 'L5R_5E'))
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
    const ok = await confirm(t('confirmDelete').replace('{0}', name), t('deleteBtn'))
    if (!ok) return
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
          <button className="btn btn-primary" onClick={() => setShowEditionPicker(true)}>
            {t('l5rNewSamurai')}
          </button>
          {isST && (
            <>
              <button className="btn btn-secondary" onClick={() => navigate('/l5r/antagonist/new')}>
                {t('l5rNewAntagonist')}
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/l5r/st-tools')}
                style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                {t('l5rSTTools')}
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
        <ChronicleList system="L5R" basePath="/l5r/chronicles" />
      )}

      {pageTab === 0 && error && <p className="status-error" role="alert">{error}</p>}
      {pageTab === 0 && loading && <p className="status-loading">{t('loading')}</p>}

      {pageTab === 0 && !loading && (() => {
        const samurai = characters.filter(c => c.splat === 'L5R')
        const fiveE = characters.filter(c => c.splat === 'L5R_5E')
        const antagonists = characters.filter(c => c.splat === 'L5R_ANTAGONIST')
        return (
          <>
            {samurai.length === 0 && fiveE.length === 0 && antagonists.length === 0 && (
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

            {fiveE.length > 0 && (
              <>
                <h3 style={{ marginTop: 'var(--space-xl)', marginBottom: 'var(--space-sm)' }}>{t('splatL5R5e')} ({fiveE.length})</h3>
                <ul className="character-list" aria-label={t('splatL5R5e')}>
                  {fiveE.map(c => (
                    <li key={c.id} className="character-card">
                      <div className="character-card-info">
                        <h3>{c.name || t('unnamedCharacter')}</h3>
                        <dl className="character-card-meta">
                          <dt className="sr-only">System</dt>
                          <dd className="splat-badge splat-badge--l5r-5e">L5R 5e</dd>
                          {c.l5r5eClan && <><dt className="sr-only">{t('l5r5eClan')}</dt><dd>{c.l5r5eClan}</dd></>}
                          {c.l5r5eFamily && <><dt className="sr-only">{t('l5r5eFamily')}</dt><dd>{c.l5r5eFamily}</dd></>}
                          {c.l5r5eSchool && <><dt className="sr-only">{t('l5r5eSchool')}</dt><dd>{c.l5r5eSchool}</dd></>}
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
              </>
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
      {/* Edition Picker Modal */}
      {showEditionPicker && (
        <div className="modal-overlay" onClick={() => setShowEditionPicker(false)}
          role="dialog" aria-modal="true" aria-labelledby="edition-picker-title"
          onKeyDown={e => { if (e.key === 'Escape') setShowEditionPicker(false) }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <h3 id="edition-picker-title">{t('l5rChooseEdition')}</h3>
            <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>
              {t('l5rChooseEditionDesc')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <button className="modal-option-btn" autoFocus
                onClick={() => { setShowEditionPicker(false); setSelectedEdition('4e'); setShowNewChar(true) }}
                style={{ padding: 'var(--space-lg)', textAlign: 'left' }}>
                <strong style={{ fontSize: '1.1rem' }}>L5R 4th Edition</strong>
                <span className="muted-hint" style={{ display: 'block', marginTop: 'var(--space-xs)' }}>
                  {t('l5r4eDesc')}
                </span>
              </button>
              <button className="modal-option-btn"
                onClick={() => { setShowEditionPicker(false); setSelectedEdition('5e'); setShowNewChar(true) }}
                style={{ padding: 'var(--space-lg)', textAlign: 'left' }}>
                <strong style={{ fontSize: '1.1rem' }}>L5R 5th Edition (FFG)</strong>
                <span className="muted-hint" style={{ display: 'block', marginTop: 'var(--space-xs)' }}>
                  {t('l5r5eDesc')}
                </span>
              </button>
            </div>
            <button className="modal-close" onClick={() => setShowEditionPicker(false)}>{t('cancel')}</button>
          </div>
        </div>
      )}
      <NewCharacterModal open={showNewChar} onClose={() => { setShowNewChar(false); setSelectedEdition(null) }}
        chronicles={chronicles} newCharPath={selectedEdition === '5e' ? '/l5r/5e/new' : '/l5r/new'} />
      <ConfirmDialog {...confirmDialogProps} confirmLabel={t('deleteBtn')} cancelLabel={t('cancel')} />
    </section>
  )
}
