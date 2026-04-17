import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { getCharacters, deleteCharacter } from '../api/characterApi'
import { getChronicles } from '../api/chronicleApi'

export default function SeventhSeaPage() {
  const [characters, setCharacters] = useState([])
  const [chronicles, setChronicles] = useState([])
  const [showChronicleSelect, setShowChronicleSelect] = useState(false)
  const [selectedChronicle, setSelectedChronicle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { user, isST } = useAuth()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()

  useEffect(() => { switchTheme('7thsea') }, [])

  useEffect(() => {
    async function load() {
      try {
        const [charRes, chronRes] = await Promise.all([getCharacters(), getChronicles()])
        setCharacters(charRes.data.filter(c => c.splat === 'SEVENTH_SEA'))
        setChronicles(chronRes.data.filter(c => (c.gameSystem || 'WOD') === 'SEVENTH_SEA'))
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
    <section aria-labelledby="7s-heading">
      <div className="character-list-header">
        <h2 id="7s-heading">{t('7sMyHeroes')}</h2>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button className="btn btn-primary" onClick={() => navigate('/7thsea/new?mode=guided')}>
            {t('7sNewHero')}
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/7thsea/new')}>
            {t('7sBlankHero')}
          </button>
          {chronicles.length > 0 && (
            <button className="btn btn-secondary" onClick={() => setShowChronicleSelect(true)}>
              {t('forAChronicle')}
            </button>
          )}
          <button className="btn btn-secondary" onClick={() => navigate('/7thsea/chronicles')}>
            {t('navChronicles')}
          </button>
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
              onClick={() => { navigate(`/7thsea/new?mode=guided&chronicle=${selectedChronicle}`); setShowChronicleSelect(false) }}>
              {t('proceed')}
            </button>
            <button className="btn btn-secondary" onClick={() => setShowChronicleSelect(false)}>{t('cancel')}</button>
          </div>
        )}
      </div>

      {error && <p className="status-error" role="alert">{error}</p>}
      {loading && <p className="status-loading">{t('loading')}</p>}

      {/* ── Heroes ── */}
      {!loading && (() => {
        const heroes = characters.filter(c => !c.npc)
        return heroes.length === 0 ? (
          <div className="empty-state">
            <p>{t('7sNoHeroesYet')}</p>
            <p>{t('7sCreateFirst')}</p>
          </div>
        ) : (
          <ul className="character-list" aria-label={t('7sMyHeroes')}>
            {heroes.map(c => (
              <li key={c.id} className="character-card">
                <div className="character-card-info">
                  <h3>{c.name || t('unnamedCharacter')}</h3>
                  <dl className="character-card-meta">
                    <dt className="sr-only">System</dt>
                    <dd className="splat-badge splat-badge--seventh-sea">7th Sea</dd>
                    {c.nation && <><dt className="sr-only">{t('7sNation')}</dt><dd>{c.nation}</dd></>}
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
        )
      })()}

      {/* ── Villains & Monsters (ST only) ── */}
      {!loading && isST && (() => {
        const villains = characters.filter(c => c.npc)
        return (
          <div style={{ marginTop: 'var(--space-xl)' }}>
            <div className="character-list-header">
              <h2>Villains & Monsters</h2>
              <button className="btn btn-primary" style={{ background: '#8b2020' }} onClick={() => navigate('/7thsea/villain/new')}>
                New Villain / Monster
              </button>
            </div>
            {villains.length === 0 ? (
              <div className="empty-state"><p>No villains or monsters yet. Create one to challenge your players.</p></div>
            ) : (
              <ul className="character-list" aria-label="Villains & Monsters">
                {villains.map(c => (
                  <li key={c.id} className="character-card">
                    <div className="character-card-info">
                      <h3>{c.name || 'Unnamed Villain'}</h3>
                      <dl className="character-card-meta">
                        <dt className="sr-only">Type</dt>
                        <dd className="splat-badge" style={{ background: 'rgba(224,85,85,0.15)', color: '#e55' }}>
                          {c.willpower > 0 ? `Villain Rank ${c.willpower}` : 'NPC'}
                        </dd>
                        {c.nation && <><dt className="sr-only">Origin</dt><dd>{c.nation}</dd></>}
                        {c.concept && <><dt className="sr-only">Concept</dt><dd>{c.concept}</dd></>}
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
        )
      })()}
    </section>
  )
}
