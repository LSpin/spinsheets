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

export default function SavPage() {
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
  const { confirm, confirmDialogProps } = useConfirm()

  useEffect(() => { switchTheme('sav') }, [])

  useEffect(() => {
    async function load() {
      try {
        const charRes = await getCharacters()
        setCharacters(charRes.data.filter(c => c.splat === 'SAV' || c.splat === 'SAV_SHIP'))
      } catch {
        setError(t('failedLoadChars'))
      }
      try {
        const chronRes = await getChronicles()
        setChronicles(chronRes.data.filter(c => (c.gameSystem || 'WOD') === 'SAV'))
      } catch { /* chronicles failing shouldn't block */ }
      setLoading(false)
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

  const scoundrels = characters.filter(c => c.splat === 'SAV')
  const ships = characters.filter(c => c.splat === 'SAV_SHIP')

  return (
    <section aria-labelledby="sav-heading">
      <div className="character-list-header">
        <h2 id="sav-heading">{t('systemSav')} — {t('savMyCrew')}</h2>
        <div className="flex flex-wrap gap-sm">
          <button className="btn btn-primary" onClick={() => setShowNewChar(true)}>
            {t('savNewScoundrel')}
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/sav/ship/new')}>
            {t('savNewShip')}
          </button>
          {isST && (
            <button className="btn btn-secondary btn-outline-accent" onClick={() => navigate('/sav/st-tools')}>
              {t('savSTTools')}
            </button>
          )}
        </div>
      </div>

      <div className="tab-list mb-lg" role="tablist">
        <button role="tab" className={`btn btn-secondary${pageTab === 0 ? ' tab-btn--active' : ''}`}
          onClick={() => setPageTab(0)}>{t('navCharacters')}</button>
        <button role="tab" className={`btn btn-secondary${pageTab === 1 ? ' tab-btn--active' : ''}`}
          onClick={() => setPageTab(1)}>{t('navChronicles')}</button>
      </div>

      {pageTab === 1 && (
        <ChronicleList system="SAV" basePath="/sav/chronicles" />
      )}

      {pageTab === 0 && error && <p className="status-error" role="alert">{error}</p>}
      {pageTab === 0 && loading && <p className="status-loading">{t('loading')}</p>}

      {/* Scoundrels */}
      {pageTab === 0 && !loading && scoundrels.length === 0 && ships.length === 0 && (
        <div className="empty-state">
          <p>{t('savNoCharsYet')}</p>
        </div>
      )}

      {pageTab === 0 && !loading && scoundrels.length > 0 && (
        <ul className="character-list" aria-label={t('savMyCrew')}>
          {scoundrels.map(c => (
            <li key={c.id} className="character-card">
              <div className="character-card-info">
                <h3>{c.name || t('unnamedCharacter')}</h3>
                <dl className="character-card-meta">
                  <dt className="sr-only">System</dt>
                  <dd className="splat-badge splat-badge--sav">S&V</dd>
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

      {/* Ships */}
      {pageTab === 0 && !loading && (
        <div className="mt-xl">
          <div className="character-list-header">
            <h2>{t('savShips')}</h2>
          </div>
          {ships.length === 0 ? (
            <div className="empty-state"><p>{t('savNoShipYet')}</p></div>
          ) : (
            <ul className="character-list" aria-label={t('savShips')}>
              {ships.map(c => (
                <li key={c.id} className="character-card">
                  <div className="character-card-info">
                    <h3>{c.name || t('savUnnamedShip')}</h3>
                    <dl className="character-card-meta">
                      <dt className="sr-only">Type</dt>
                      <dd className="splat-badge splat-badge--sav">Ship</dd>
                      {c.bladesCrewType && <><dt className="sr-only">Ship Type</dt><dd>{c.bladesCrewType}</dd></>}
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

      <NewCharacterModal open={showNewChar} onClose={() => setShowNewChar(false)} chronicles={chronicles} />
      <ConfirmDialog {...confirmDialogProps} confirmLabel={t('deleteBtn')} cancelLabel={t('cancel')} />
    </section>
  )
}
