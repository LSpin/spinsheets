import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import { useNewChar } from '../context/NewCharContext'
import { getCharacters, deleteCharacter } from '../api/characterApi'
import { getChronicles, joinChronicle, leaveChronicle } from '../api/chronicleApi'
import { useTheme } from '../context/ThemeContext'

const SPLAT_LABEL_KEYS = {
  VAMPIRE: 'splatVampire',
  WEREWOLF: 'splatWerewolf',
  MAGE: 'splatMage',
  VAMPIRE_REVISED: 'splatVampireRevisedSub',
  KOTE: 'splatKote',
  VAMPIRE_DARK_AGES: 'splatDarkAgesSub',
  VICTORIAN_VAMPIRE: 'splatVictorianVampireSub',
  WYLD_WEST_WEREWOLF: 'splatWyldWestSub',
  VICTORIAN_MAGE: 'splatVictorianMageSub',
  CHANGING_BREEDS: 'splatChangingBreedsSub',
  GHOUL: 'splatGhoul',
  FAMILIAR: 'splatFamiliar',
  TOTEM: 'splatTotem',
  KINFOLK: 'splatKinfolk',
  SEVENTH_SEA: 'splat7thSea',
  L5R: 'splatL5R',
  BLADES: 'splatBlades',
  BLADES_CREW: 'splatBladesCrew',
  DND: 'splatDnd',
}

function splatBadgeClass(splat) {
  return `splat-badge splat-badge--${(splat || 'vampire').toLowerCase().replace('_', '-')}`
}

const WEREWOLF_SPLATS = new Set(['WEREWOLF', 'WYLD_WEST_WEREWOLF', 'CHANGING_BREEDS', 'TOTEM', 'KINFOLK'])
const MAGE_SPLATS = new Set(['MAGE', 'VICTORIAN_MAGE', 'FAMILIAR'])

function CharacterCard({ c, user, isST, t, navigate, onDelete, chronicles, onAssignChronicle }) {
  const isWerewolf = WEREWOLF_SPLATS.has(c.splat)
  const isMage = MAGE_SPLATS.has(c.splat)
  return (
    <li className="character-card">
      <div className="character-card-info">
        <h3>{c.name || t('unnamedCharacter')}</h3>
        <dl className="character-card-meta">
          {c.splat && (
            <>
              <dt className="sr-only">Splat</dt>
              <dd className={splatBadgeClass(c.splat)}>
                {t(SPLAT_LABEL_KEYS[c.splat]) || c.splat}
              </dd>
            </>
          )}
          {c.clan && (
            <>
              <dt className="sr-only">{t('clan')}</dt>
              <dd>{c.clan}</dd>
            </>
          )}
          {isWerewolf && c.rage != null && (
            <>
              <dt className="sr-only">{t('rage')}</dt>
              <dd>{t('rage')}: {c.rage}</dd>
            </>
          )}
          {isMage && c.arete > 0 && (
            <>
              <dt className="sr-only">{t('areteLabel')}</dt>
              <dd>{t('areteLabel')}: {c.arete}</dd>
            </>
          )}
          {!isWerewolf && !isMage && c.generation && (
            <>
              <dt className="sr-only">{t('generation')}</dt>
              <dd>{c.generation}{t('thGeneration')}</dd>
            </>
          )}
          {!isWerewolf && !isMage && c.pathName && (
            <>
              <dt className="sr-only">{t('pathName')}</dt>
              <dd>{c.pathName} {c.pathRating}</dd>
            </>
          )}
          {isST && c.owner && (
            <>
              <dt className="sr-only">{t('playerLabel')}</dt>
              <dd>{t('playerLabel')}: {c.owner.username}</dd>
            </>
          )}
          {isST && c.chronicle && (
            <>
              <dt className="sr-only">{t('chronicle')}</dt>
              <dd style={{ fontStyle: 'italic' }}>{c.chronicle.name}</dd>
            </>
          )}
        </dl>
      </div>
      <div className="character-card-actions">
        {isST && c.npc && chronicles && chronicles.length > 0 && (
          <select
            value={c.chronicle?.id || ''}
            onChange={e => onAssignChronicle(c.id, e.target.value ? Number(e.target.value) : null)}
            style={{ fontSize: '0.78rem', maxWidth: 140 }}
            title={t('assignChronicle')}
            aria-label={t('assignChronicle')}
          >
            <option value="">{t('noChronicle')}</option>
            {chronicles.map(ch => (
              <option key={ch.id} value={ch.id}>{ch.name}</option>
            ))}
          </select>
        )}
        <button
          className="btn btn-secondary"
          onClick={() => navigate(`/characters/${c.id}?mode=view`)}
          aria-label={`${t('viewBtn')} ${c.name}`}
        >
          {t('viewBtn')}
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate(`/characters/${c.id}`)}
          aria-label={`${t('edit')} ${c.name}`}
        >
          {t('edit')}
        </button>
        <button
          className="btn btn-danger"
          onClick={() => onDelete(c.id, c.name)}
          aria-label={`${t('deleteBtn')} ${c.name}`}
        >
          {t('deleteBtn')}
        </button>
      </div>
    </li>
  )
}

function CharacterGrid({ chars, user, isST, t, navigate, onDelete, emptyMsg, chronicles, onAssignChronicle }) {
  if (chars.length === 0) {
    return (
      <div className="empty-state">
        <p>{emptyMsg}</p>
      </div>
    )
  }
  return (
    <ul className="character-list" aria-label={t('navCharacters')}>
      {chars.map(c => (
        <CharacterCard key={c.id} c={c} user={user} isST={isST} t={t} navigate={navigate} onDelete={onDelete}
          chronicles={chronicles} onAssignChronicle={onAssignChronicle} />
      ))}
    </ul>
  )
}

export default function CharacterList() {
  const [characters, setCharacters] = useState([])
  const [chronicles, setChronicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [subTab, setSubTab] = useState(0)
  const [chronicleFilter, setChronicleFilter] = useState('all')
  const navigate = useNavigate()
  const { user, isST } = useAuth()
  const { t } = useLanguage()
  const { openNewChar } = useNewChar()
  const { switchTheme } = useTheme()

  useEffect(() => { switchTheme('wod') }, [])
  useEffect(() => { loadCharacters() }, [])

  async function loadCharacters() {
    try {
      setLoading(true)
      const [charsRes, chronRes] = await Promise.all([
        getCharacters(),
        isST ? getChronicles() : Promise.resolve({ data: [] }),
      ])
      setCharacters(charsRes.data.filter(c => c.splat !== 'SEVENTH_SEA' && c.splat !== 'L5R'))
      setChronicles(chronRes.data)
    } catch {
      setError(t('failedLoadChars'))
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(t('confirmDelete').replace('{0}', name))) return
    try {
      await deleteCharacter(id)
      setCharacters(prev => prev.filter(c => c.id !== id))
    } catch {
      setError(t('failedDeleteChar'))
    }
  }

  async function handleAssignChronicle(characterId, chronicleId) {
    try {
      if (chronicleId) {
        const res = await joinChronicle(characterId, chronicleId)
        setCharacters(prev => prev.map(c => c.id === characterId ? res.data : c))
      } else {
        const res = await leaveChronicle(characterId)
        setCharacters(prev => prev.map(c => c.id === characterId ? res.data : c))
      }
    } catch {
      setError(t('failedToSave'))
    }
  }

  const pcs = characters.filter(c => !c.npc)
  const npcs = characters.filter(c => c.npc)

  const filteredNpcs = chronicleFilter === 'all'
    ? npcs
    : chronicleFilter === 'unassigned'
      ? npcs.filter(c => !c.chronicle)
      : npcs.filter(c => c.chronicle?.id === Number(chronicleFilter))

  return (
    <section aria-labelledby="list-heading">
      <div className="character-list-header">
        <h2 id="list-heading">
          {isST ? t('allCharactersST') : t('myCharacters')}
        </h2>
        <button className="btn btn-primary" onClick={openNewChar}>
          {t('newCharBtn')}
        </button>
      </div>

      {error && <p className="status-error" role="alert">{error}</p>}
      {loading && <p className="status-loading" aria-live="polite">{t('loading')}</p>}

      {!loading && isST && (
        <>
          <div role="tablist" aria-label={t('navCharacters')} className="tab-list">
            <button role="tab" aria-selected={subTab === 0} onClick={() => setSubTab(0)}
              className={`btn btn-secondary tab-btn${subTab === 0 ? ' tab-btn--active' : ''}`}>
              {t('playerCharacters')} ({pcs.length})
            </button>
            <button role="tab" aria-selected={subTab === 1} onClick={() => setSubTab(1)}
              className={`btn btn-secondary tab-btn${subTab === 1 ? ' tab-btn--active' : ''}`}>
              {t('npcs')} ({npcs.length})
            </button>
          </div>

          {subTab === 0 && (
            <CharacterGrid chars={pcs} user={user} isST={isST} t={t} navigate={navigate} onDelete={handleDelete}
              emptyMsg={t('noPcsYet')} chronicles={chronicles} onAssignChronicle={handleAssignChronicle} />
          )}
          {subTab === 1 && (
            <>
              {chronicles.length > 0 && (
                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label htmlFor="chronicle-filter" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t('filterByChronicle')}:</label>
                  <select id="chronicle-filter" value={chronicleFilter} onChange={e => setChronicleFilter(e.target.value)}
                    style={{ fontSize: '0.85rem' }}>
                    <option value="all">{t('allChronicles')}</option>
                    <option value="unassigned">{t('unassigned')}</option>
                    {chronicles.map(ch => (
                      <option key={ch.id} value={ch.id}>{ch.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <CharacterGrid chars={filteredNpcs} user={user} isST={isST} t={t} navigate={navigate} onDelete={handleDelete}
                emptyMsg={t('noNpcsYet')} chronicles={chronicles} onAssignChronicle={handleAssignChronicle} />
            </>
          )}
        </>
      )}

      {!loading && !isST && (
        characters.length === 0 ? (
          <div className="empty-state">
            <p>{t('noCharsYet')}</p>
            <p>{t('createFirstChar')}</p>
          </div>
        ) : (
          <ul className="character-list" aria-label={t('navCharacters')}>
            {characters.map(c => (
              <CharacterCard key={c.id} c={c} user={user} isST={isST} t={t} navigate={navigate} onDelete={handleDelete} />
            ))}
          </ul>
        )
      )}
    </section>
  )
}
