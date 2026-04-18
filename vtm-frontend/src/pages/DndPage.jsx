import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { getCharacters, deleteCharacter } from '../api/characterApi'
import { getChronicles } from '../api/chronicleApi'
import ChronicleList from './ChronicleList'
import NewCharacterModal from '../components/NewCharacterModal'

export default function DndPage() {
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

  useEffect(() => { switchTheme('dnd') }, [])

  useEffect(() => {
    async function load() {
      try {
        const [charRes, chronRes] = await Promise.all([getCharacters(), getChronicles()])
        setCharacters(charRes.data.filter(c => c.splat === 'DND' || c.splat === 'DND_MONSTER'))
        setChronicles(chronRes.data.filter(c => (c.gameSystem || 'WOD') === 'DND'))
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
    <section aria-labelledby="dnd-heading">
      <div className="character-list-header">
        <h2 id="dnd-heading">{t('systemDnd')} — {t('dndMyCharacters')}</h2>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => setShowNewChar(true)}>
            {t('systemDnd')} — {t('dndNewCharacter')}
          </button>
          {isST && (
            <button className="btn btn-secondary" onClick={() => navigate('/dnd/monster/new')}>
              {t('systemDnd')} — {t('dndNewMonster')}
            </button>
          )}
          {isST && <button className="btn btn-secondary" onClick={() => navigate('/dnd/chronicles/new')}>{t('systemDnd')} — {t('newChronicle')}</button>}
        </div>
      </div>

      <div className="tab-list" role="tablist" style={{ marginBottom: 'var(--space-lg)' }}>
        <button role="tab" className={`btn btn-secondary${pageTab === 0 ? ' tab-btn--active' : ''}`}
          onClick={() => setPageTab(0)}>{t('navCharacters')}</button>
        <button role="tab" className={`btn btn-secondary${pageTab === 1 ? ' tab-btn--active' : ''}`}
          onClick={() => setPageTab(1)}>{t('navChronicles')}</button>
      </div>

      {pageTab === 1 && (
        <ChronicleList system="DND" basePath="/dnd/chronicles" />
      )}

      {pageTab === 0 && error && <p className="status-error" role="alert">{error}</p>}
      {pageTab === 0 && loading && <p className="status-loading">{t('loading')}</p>}

      {pageTab === 0 && (() => {
        const pcs = characters.filter(c => c.splat === 'DND')
        const monsters = characters.filter(c => c.splat === 'DND_MONSTER')
        return (
          <>
            {!loading && pcs.length === 0 && monsters.length === 0 && (
              <div className="empty-state">
                <p>{t('dndNoCharsYet')}</p>
                <p className="muted-hint">{t('dndCreateFirst')}</p>
              </div>
            )}

            {!loading && pcs.length > 0 && (
              <ul className="character-list" aria-label={t('dndMyCharacters')}>
                {pcs.map(c => (
                  <li key={c.id} className="character-card">
                    <div className="character-card-info">
                      <h3>{c.name || t('unnamedCharacter')}</h3>
                      <dl className="character-card-meta">
                        <dt className="sr-only">System</dt>
                        <dd className="splat-badge splat-badge--dnd">D&D</dd>
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

            {!loading && isST && monsters.length > 0 && (
              <>
                <h3 style={{ marginTop: 'var(--space-xl)', marginBottom: 'var(--space-sm)' }}>{t('splatDndMonster')}s ({monsters.length})</h3>
                <ul className="character-list" aria-label="Monsters">
                  {monsters.map(c => (
                    <li key={c.id} className="character-card">
                      <div className="character-card-info">
                        <h3>{c.name || t('unnamedCharacter')}</h3>
                        <dl className="character-card-meta">
                          <dt className="sr-only">Type</dt>
                          <dd className="splat-badge splat-badge--dnd">{c.dndChallengeRating ? `CR ${c.dndChallengeRating}` : 'Monster'}</dd>
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
              </>
            )}
          </>
        )
      })()}
      <NewCharacterModal open={showNewChar} onClose={() => setShowNewChar(false)} chronicles={chronicles} newCharPath="/dnd/new" />
    </section>
  )
}
