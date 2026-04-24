import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import { getCharacters, deleteCharacter } from '../api/characterApi'
import { getChronicles } from '../api/chronicleApi'
import { useTheme } from '../context/ThemeContext'
import NewCharacterModal from '../components/NewCharacterModal'
import ConfirmDialog from '../components/ConfirmDialog'
import useConfirm from '../hooks/useConfirm'

const SYSTEMS = [
  { key: 'ALL', labelKey: 'allSystems', badge: null, charPath: null },
  { key: 'WOD', labelKey: 'systemWoD', badge: 'splat-badge--vampire', charPath: '/characters', theme: 'wod',
    splats: new Set(['VAMPIRE', 'WEREWOLF', 'MAGE', 'VAMPIRE_REVISED', 'KOTE', 'VAMPIRE_DARK_AGES', 'VICTORIAN_VAMPIRE',
      'WYLD_WEST_WEREWOLF', 'VICTORIAN_MAGE', 'CHANGING_BREEDS', 'GHOUL', 'FAMILIAR', 'TOTEM', 'KINFOLK',
      'HUNTER', 'WRAITH', 'CHANGELING', 'DEMON', 'BSD', 'MORTAL']) },
  { key: 'SEVENTH_SEA', labelKey: 'system7thSea', badge: 'splat-badge--seventh-sea', charPath: '/7thsea', theme: '7thsea',
    splats: new Set(['SEVENTH_SEA', 'SEVENTH_SEA_SHIP']) },
  { key: 'L5R', labelKey: 'systemL5R', badge: 'splat-badge--l5r', charPath: '/l5r', theme: 'l5r',
    splats: new Set(['L5R', 'L5R_ANTAGONIST', 'L5R_5E']) },
  { key: 'BLADES', labelKey: 'systemBlades', badge: 'splat-badge--blades', charPath: '/blades', theme: 'blades',
    splats: new Set(['BLADES', 'BLADES_CREW', 'BLADES_ANTAGONIST']) },
  { key: 'DND', labelKey: 'systemDnd', badge: 'splat-badge--dnd', charPath: '/dnd', theme: 'dnd',
    splats: new Set(['DND', 'DND_MONSTER']) },
  { key: 'UESTRPG', labelKey: 'systemUestrpg', badge: 'splat-badge--uestrpg', charPath: '/uestrpg', theme: 'uestrpg',
    splats: new Set(['UESTRPG', 'UESTRPG_ANTAGONIST']) },
  { key: 'CYBERPUNK', labelKey: 'systemCyberpunk', badge: 'splat-badge--cyberpunk', charPath: '/cyberpunk', theme: 'cyberpunk',
    splats: new Set(['CYBERPUNK', 'CYBERPUNK_ANTAGONIST']) },
  { key: 'ASOIAF', labelKey: 'systemAsoiaf', badge: 'splat-badge--asoiaf', charPath: '/asoiaf', theme: 'asoiaf',
    splats: new Set(['ASOIAF', 'ASOIAF_ANTAGONIST']) },
]

const SPLAT_LABELS = {
  VAMPIRE: 'splatVampire', WEREWOLF: 'splatWerewolf', MAGE: 'splatMage',
  VAMPIRE_REVISED: 'splatVampireRevisedSub', KOTE: 'splatKote',
  VAMPIRE_DARK_AGES: 'splatDarkAgesSub', VICTORIAN_VAMPIRE: 'splatVictorianVampireSub',
  WYLD_WEST_WEREWOLF: 'splatWyldWestSub', VICTORIAN_MAGE: 'splatVictorianMageSub',
  CHANGING_BREEDS: 'splatChangingBreedsSub', GHOUL: 'splatGhoul', FAMILIAR: 'splatFamiliar',
  TOTEM: 'splatTotem', KINFOLK: 'splatKinfolk', HUNTER: 'splatHunter',
  WRAITH: 'splatWraith', CHANGELING: 'splatChangeling', DEMON: 'splatDemon',
  BSD: 'splatBsd', MORTAL: 'splatMortal',
  SEVENTH_SEA: 'splat7thSea', SEVENTH_SEA_SHIP: 'splatSeventhSeaShip', L5R: 'splatL5R', L5R_5E: 'splatL5R5e', L5R_ANTAGONIST: 'splatL5RAntagonist',
  BLADES: 'splatBlades', BLADES_CREW: 'splatBladesCrew', BLADES_ANTAGONIST: 'splatBladesAntagonist',
  DND: 'splatDnd', DND_MONSTER: 'splatDndMonster',
  UESTRPG: 'splatUestrpg', UESTRPG_ANTAGONIST: 'splatUestrpgAntagonist',
  CYBERPUNK: 'splatCyberpunk', CYBERPUNK_ANTAGONIST: 'splatCyberpunkAntagonist',
  ASOIAF: 'splatAsoiaf', ASOIAF_ANTAGONIST: 'splatAsoiafAntagonist',
}

function getSystemForSplat(splat) {
  return SYSTEMS.find(s => s.splats && s.splats.has(splat)) || SYSTEMS[1]
}

export default function AllCharactersPage() {
  const [characters, setCharacters] = useState([])
  const [chronicles, setChronicles] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showNewChar, setShowNewChar] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortMode, setSortMode] = useState('newest')
  const [npcFilter, setNpcFilter] = useState('all')
  const { confirm, confirmDialogProps } = useConfirm()
  const navigate = useNavigate()
  const { user, isST } = useAuth()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()

  useEffect(() => {
    async function load() {
      try {
        const [charRes, chronRes] = await Promise.all([getCharacters(), getChronicles()])
        setCharacters(charRes.data)
        setChronicles(chronRes.data)
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

  const SORT_OPTIONS = ['newest', 'oldest', 'az']

  const filtered = characters
    .filter(c => {
      if (filter !== 'ALL') {
        const sys = SYSTEMS.find(s => s.key === filter)
        if (!sys?.splats?.has(c.splat)) return false
      }
      if (npcFilter === 'pcs' && c.npc) return false
      if (npcFilter === 'npcs' && !c.npc) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (!(c.name || '').toLowerCase().includes(q)) return false
      }
      return true
    })
    .sort((a, b) => {
      if (sortMode === 'az') return (a.name || '').localeCompare(b.name || '')
      const aKey = a.updatedAt || a.id
      const bKey = b.updatedAt || b.id
      return sortMode === 'oldest'
        ? (aKey > bKey ? 1 : -1)
        : (aKey < bKey ? 1 : -1)
    })

  const sortLabelKey = { newest: 'sortNewest', oldest: 'sortOldest', az: 'sortAZ' }

  function cycleSortMode() {
    setSortMode(prev => SORT_OPTIONS[(SORT_OPTIONS.indexOf(prev) + 1) % SORT_OPTIONS.length])
  }

  return (
    <section aria-labelledby="all-chars-heading">
      <div className="character-list-header">
        <h2 id="all-chars-heading">{t('navCharacters')}</h2>
        <button className="btn btn-primary" onClick={() => setShowNewChar(true)}>
          {t('newCharBtn')}
        </button>
      </div>

      {error && <p className="status-error" role="alert">{error}</p>}

      <div className="tab-list" role="tablist" style={{ marginBottom: 'var(--space-sm)', flexWrap: 'wrap' }}>
        {SYSTEMS.map(sys => {
          const count = sys.key === 'ALL'
            ? characters.length
            : characters.filter(c => sys.splats?.has(c.splat)).length
          return (
            <button
              key={sys.key}
              role="tab"
              aria-selected={filter === sys.key}
              className={`btn btn-secondary${filter === sys.key ? ' tab-btn--active' : ''}`}
              onClick={() => { setFilter(sys.key); if (sys.theme) switchTheme(sys.theme) }}
            >
              {t(sys.labelKey)} ({count})
            </button>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <input
          type="text"
          className="input"
          placeholder={t('searchByName')}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ flex: '1 1 180px', minWidth: '140px' }}
          aria-label={t('searchByName')}
        />
        <button className="btn btn-secondary" onClick={cycleSortMode} aria-label={t(sortLabelKey[sortMode])}>
          {t(sortLabelKey[sortMode])}
        </button>
        {['all', 'pcs', 'npcs'].map(key => (
          <button
            key={key}
            className={`btn btn-secondary${npcFilter === key ? ' tab-btn--active' : ''}`}
            onClick={() => setNpcFilter(key)}
          >
            {t(key === 'all' ? 'filterAll' : key === 'pcs' ? 'filterPCs' : 'filterNPCs')}
          </button>
        ))}
      </div>

      {loading && <p className="status-loading" aria-live="polite">{t('loading')}</p>}

      {!loading && filtered.length === 0 && (
        <div className="empty-state">
          <p>{characters.length === 0 ? t('noCharsYet') : t('noMatchingCharacters')}</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <ul className="character-list" aria-label={t('allCharactersTitle')}>
          {filtered.map(c => {
            const sysInfo = getSystemForSplat(c.splat)
            return (
              <li key={c.id} className="character-card">
                <div className="character-card-info">
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                    {c.name || t('unnamedCharacter')}
                    <span className={`splat-badge ${sysInfo.badge || ''}`} style={{ fontSize: '0.75rem' }}>
                      {t(SPLAT_LABELS[c.splat] || c.splat)}
                    </span>
                  </h3>
                  <dl className="character-card-meta">
                    {c.concept && <><dt className="sr-only">{t('concept')}</dt><dd>{c.concept}</dd></>}
                    {c.clan && <><dt className="sr-only">{t('clan')}</dt><dd>{c.clan}</dd></>}
                    {isST && c.owner && <><dt className="sr-only">{t('playerLabel')}</dt><dd>{t('playerLabel')}: {c.owner.username}</dd></>}
                    {c.npc && <dd className="muted-hint" style={{ fontStyle: 'italic' }}>NPC</dd>}
                  </dl>
                </div>
                <div className="character-card-actions">
                  <button className="btn btn-secondary"
                    onClick={() => navigate(`/characters/${c.id}?mode=view`)}
                    aria-label={`${t('viewBtn')} ${c.name}`}>
                    {t('viewBtn')}
                  </button>
                  <button className="btn btn-secondary"
                    onClick={() => navigate(`/characters/${c.id}`)}
                    aria-label={`${t('edit')} ${c.name}`}>
                    {t('edit')}
                  </button>
                  <button className="btn btn-danger"
                    onClick={() => handleDelete(c.id, c.name)}
                    aria-label={`${t('deleteBtn')} ${c.name}`}>
                    {t('deleteBtn')}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
      <NewCharacterModal open={showNewChar} onClose={() => setShowNewChar(false)} chronicles={chronicles} />
      <ConfirmDialog {...confirmDialogProps} confirmLabel={t('deleteBtn')} cancelLabel={t('cancel')} />
    </section>
  )
}
