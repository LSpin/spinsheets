import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import { getChronicle, addAssistantST, removeAssistantST, getSessions, addSession, updateSession, deleteSession, generateInviteCode, disableInviteCode, updateAllowedSplats } from '../api/chronicleApi'
import { getCharacters } from '../api/characterApi'
import { joinChronicle, leaveChronicle } from '../api/chronicleApi'
import { useTheme } from '../context/ThemeContext'
import { SPLAT_TO_CATEGORY } from '../data/splatCategories'

export default function ChronicleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isST } = useAuth()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()

  const [chronicle, setChronicle] = useState(null)
  const [members, setMembers] = useState([])
  const [myCharacters, setMyCharacters] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [assistantUsername, setAssistantUsername] = useState('')
  const [tab, setTab] = useState(0)
  const [newSession, setNewSession] = useState({ title: '', sessionDate: '', summary: '', notes: '', sessionNumber: '' })
  const [editingSession, setEditingSession] = useState(null)

  useEffect(() => { load() }, [id])

  async function load() {
    try {
      setLoading(true)
      const [chronicleRes, charsRes, sessionsRes] = await Promise.all([
        getChronicle(id),
        getCharacters(),
        getSessions(id),
      ])
      setChronicle(chronicleRes.data.chronicle)
      setMembers(chronicleRes.data.characters)
      setMyCharacters(charsRes.data)
      setSessions(sessionsRes.data)
    } catch {
      setError(t('failedLoadChronicle'))
    } finally {
      setLoading(false)
    }
  }

  async function handleJoin(characterId) {
    try {
      await joinChronicle(characterId, id)
      load()
    } catch {
      setError(t('failedJoin'))
    }
  }

  async function handleLeave(characterId) {
    try {
      await leaveChronicle(characterId)
      load()
    } catch {
      setError(t('failedLeave'))
    }
  }

  async function handleAddAssistant(e) {
    e.preventDefault()
    if (!assistantUsername.trim()) return
    try {
      await addAssistantST(id, assistantUsername.trim())
      setAssistantUsername('')
      load()
    } catch {
      setError(t('failedAddAssistant'))
    }
  }

  async function handleRemoveAssistant(userId) {
    try {
      await removeAssistantST(id, userId)
      load()
    } catch {
      setError(t('failedRemoveAssistant'))
    }
  }

  async function handleGenerateInviteCode() {
    try {
      const res = await generateInviteCode(id)
      setChronicle(prev => ({ ...prev, inviteCode: res.data.inviteCode }))
    } catch {
      setError(t('failedToSave'))
    }
  }

  async function handleDisableInviteCode() {
    try {
      await disableInviteCode(id)
      setChronicle(prev => ({ ...prev, inviteCode: null }))
    } catch {
      setError(t('failedToSave'))
    }
  }

  const gameSystem = chronicle?.gameSystem || 'WOD'
  const SYSTEM_THEMES = { WOD: 'wod', SEVENTH_SEA: '7thsea', L5R: 'l5r', BLADES: 'blades', DND: 'dnd', UESTRPG: 'uestrpg' }
  const SYSTEM_PATHS = { WOD: '/chronicles', SEVENTH_SEA: '/7thsea/chronicles', L5R: '/l5r/chronicles', BLADES: '/blades/chronicles', DND: '/dnd/chronicles', UESTRPG: '/uestrpg/chronicles' }
  const SYSTEM_NEW_CHAR = { WOD: '/characters/new', SEVENTH_SEA: '/7thsea/new', L5R: '/l5r/new', BLADES: '/blades/new', DND: '/dnd/new', UESTRPG: '/uestrpg/new' }
  const SYSTEM_SPLAT_CATEGORIES = {
    WOD: ['VAMPIRE', 'WEREWOLF', 'MAGE', 'HUNTER', 'WRAITH', 'CHANGELING', 'DEMON'],
    SEVENTH_SEA: ['SEVENTH_SEA'],
    L5R: ['L5R'],
    BLADES: ['BLADES'],
    DND: ['DND'],
    UESTRPG: ['UESTRPG'],
  }
  const SPLAT_LABEL_MAP = {
    VAMPIRE: 'splatVampire', WEREWOLF: 'splatWerewolf', MAGE: 'splatMage',
    HUNTER: 'splatHunter', WRAITH: 'splatWraith', CHANGELING: 'splatChangeling', DEMON: 'splatDemon',
    SEVENTH_SEA: 'splat7thSea', L5R: 'splatL5R', BLADES: 'splatBlades', DND: 'splatDnd', UESTRPG: 'splatUestrpg',
  }
  useEffect(() => { if (chronicle) switchTheme(SYSTEM_THEMES[gameSystem] || 'wod') }, [chronicle])
  const chronicleBasePath = SYSTEM_PATHS[gameSystem] || '/chronicles'
  const SPLAT_CATEGORIES = SYSTEM_SPLAT_CATEGORIES[gameSystem] || ['VAMPIRE', 'WEREWOLF', 'MAGE', 'HUNTER', 'WRAITH', 'CHANGELING', 'DEMON']

  function getAllowedSet() {
    const raw = chronicle?.allowedSplats
    if (!raw) return new Set(SPLAT_CATEGORIES)
    return new Set(raw.split(','))
  }

  async function handleToggleSplat(category) {
    const current = getAllowedSet()
    if (current.has(category)) {
      if (current.size <= 1) return
      current.delete(category)
    } else {
      current.add(category)
    }
    const value = current.size === SPLAT_CATEGORIES.length ? null : [...current].join(',')
    try {
      await updateAllowedSplats(id, value)
      setChronicle(prev => ({ ...prev, allowedSplats: value }))
    } catch {
      setError(t('failedToSave'))
    }
  }

  async function handleAddSession() {
    if (!newSession.title.trim()) return
    try {
      const data = {
        ...newSession,
        sessionNumber: newSession.sessionNumber ? parseInt(newSession.sessionNumber) : null,
        sessionDate: newSession.sessionDate || null,
      }
      const res = await addSession(id, data)
      setSessions(prev => [res.data, ...prev])
      setNewSession({ title: '', sessionDate: '', summary: '', notes: '', sessionNumber: '' })
    } catch {
      setError(t('failedToSave'))
    }
  }

  async function handleUpdateSession(sessionId) {
    if (!editingSession) return
    try {
      const data = {
        ...editingSession,
        sessionNumber: editingSession.sessionNumber ? parseInt(editingSession.sessionNumber) : null,
        sessionDate: editingSession.sessionDate || null,
      }
      const res = await updateSession(id, sessionId, data)
      setSessions(prev => prev.map(s => s.id === sessionId ? res.data : s))
      setEditingSession(null)
    } catch {
      setError(t('failedToSave'))
    }
  }

  async function handleDeleteSession(sessionId) {
    if (!confirm(t('confirmDeleteSession'))) return
    try {
      await deleteSession(id, sessionId)
      setSessions(prev => prev.filter(s => s.id !== sessionId))
    } catch {
      setError(t('failedToSave'))
    }
  }

  if (loading) return <p className="status-loading">{t('loading')}</p>
  if (!chronicle) return <p className="status-error">{t('chronicleNotFound')}</p>

  const isOwner = chronicle.storyteller?.id === user?.userId
  const isAST = chronicle.assistantStorytellers?.some(a => a.id === user?.userId)
  const canManage = isOwner || isAST
  // SPLAT_TO_CATEGORY imported at top of file
  const memberIds = new Set(members.map(m => m.id))
  const allowedSet = chronicle.allowedSplats ? new Set(chronicle.allowedSplats.split(',')) : null
  const systemCategories = new Set(SPLAT_CATEGORIES)
  const joinable = myCharacters.filter(c => {
    if (memberIds.has(c.id)) return false
    const charCategory = SPLAT_TO_CATEGORY[c.splat] || c.splat
    // Character must belong to this chronicle's game system
    if (!systemCategories.has(charCategory)) return false
    // Then filter by allowed splats within the system (WoD sub-categories)
    if (allowedSet && !allowedSet.has(charCategory)) return false
    return true
  })

  return (
    <section>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate(chronicleBasePath)}>{t('back')}</button>
        <h2>{chronicle.name}</h2>
      </div>

      {error && <p className="status-error" role="alert">{error}</p>}

      {chronicle.description && (
        <div className="form-section">
          <p>{chronicle.description}</p>
        </div>
      )}

      <div className="tab-list" role="tablist" style={{ marginBottom: 'var(--space-lg)' }}>
        <button role="tab" className={`btn btn-secondary${tab === 0 ? ' tab-btn--active' : ''}`}
          onClick={() => setTab(0)}>{t('tabChronicleMembers')}</button>
        <button role="tab" className={`btn btn-secondary${tab === 1 ? ' tab-btn--active' : ''}`}
          onClick={() => setTab(1)}>{t('tabSessions')} ({sessions.length})</button>
        {isOwner && (
          <button role="tab" className={`btn btn-secondary${tab === 2 ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(2)}>{t('tabManage')}</button>
        )}
      </div>

      {/* ── Members Tab ── */}
      <div hidden={tab !== 0}>
        <div className="form-section">
          <fieldset>
            <legend>{t('charsInChronicle')} ({members.length})</legend>
            {members.length === 0 && <p className="muted-hint">{t('noCharsJoined')}</p>}
            {members.length > 0 && (
              <ul className="character-list" aria-label={t('charsInChronicle')}>
                {members.map(c => (
                  <li key={c.id} className="character-card">
                    <div className="character-card-info">
                      <h3>{c.name || t('unnamedCharacter')}</h3>
                      <dl className="character-card-meta">
                        {c.clan && <><dt className="sr-only">{t('clan')}</dt><dd>{c.clan}</dd></>}
                        {c.generation && <><dt className="sr-only">{t('generation')}</dt><dd>{c.generation}{t('thGen')}</dd></>}
                        {c.owner && <><dt className="sr-only">{t('playerLabel')}</dt><dd>{t('playerLabel')}: {c.owner.username}</dd></>}
                      </dl>
                    </div>
                    <div className="character-card-actions">
                      {(isST || c.ownerId === user.userId) && (
                        <button className="btn btn-secondary" onClick={() => navigate(`/characters/${c.id}`)}>
                          {t('viewBtn')}
                        </button>
                      )}
                      {c.ownerId === user.userId && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleLeave(c.id)}>
                          {t('leaveBtn')}
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </fieldset>
        </div>

        {!isST && joinable.length > 0 && (
          <div className="form-section">
            <fieldset>
              <legend>{t('addACharacter')}</legend>
              <ul className="character-list" aria-label={t('addACharacter')}>
                {joinable.map(c => (
                  <li key={c.id} className="character-card">
                    <div className="character-card-info">
                      <h3>{c.name || t('unnamedCharacter')}</h3>
                      <dl className="character-card-meta">
                        {c.clan && <><dt className="sr-only">{t('clan')}</dt><dd>{c.clan}</dd></>}
                        {c.chronicle && <><dt className="sr-only">{t('inChronicle')}</dt><dd>{t('inChronicle')}: {c.chronicle.name}</dd></>}
                      </dl>
                    </div>
                    <div className="character-card-actions">
                      <button className="btn btn-primary btn-sm" onClick={() => handleJoin(c.id)}>
                        {t('joinBtn')}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </fieldset>
          </div>
        )}

        {!isST && joinable.length === 0 && myCharacters.length > 0 && (
          <p className="muted-hint" style={{ color: 'var(--color-text-muted)' }}>
            {t('noMatchingChars')}
          </p>
        )}

        {!isST && (
          <div style={{ marginTop: 'var(--space-md)' }}>
            <button className="btn btn-primary" onClick={() => navigate(`${SYSTEM_NEW_CHAR[gameSystem] || '/characters/new'}?mode=guided&chronicle=${id}`)}>
              {t('createCharForChronicle')}
            </button>
          </div>
        )}

        {canManage && (
          <div style={{ marginTop: 'var(--space-md)' }}>
            <button className="btn btn-secondary" onClick={() => navigate(`/characters/new?npc=true&mode=guided&chronicle=${id}`)}>
              {t('createNpcForChronicle')}
            </button>
          </div>
        )}
      </div>

      {/* ── Sessions Tab ── */}
      <div hidden={tab !== 1}>
        <div className="form-section">
          {canManage && (
            <fieldset>
              <legend>{t('addSession')}</legend>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
                <div className="field">
                  <label>{t('sessionTitle')}</label>
                  <input type="text" value={newSession.title} onChange={e => setNewSession(p => ({ ...p, title: e.target.value }))} placeholder={t('phSessionTitle')} />
                </div>
                <div className="field-row" style={{ gap: 'var(--space-sm)' }}>
                  <div className="field">
                    <label>{t('sessionDate')}</label>
                    <input type="date" value={newSession.sessionDate} onChange={e => setNewSession(p => ({ ...p, sessionDate: e.target.value }))} />
                  </div>
                  <div className="field" style={{ maxWidth: 80 }}>
                    <label>#</label>
                    <input type="number" min="1" value={newSession.sessionNumber} onChange={e => setNewSession(p => ({ ...p, sessionNumber: e.target.value }))} placeholder="#" />
                  </div>
                </div>
                <div className="field" style={{ gridColumn: '1 / -1' }}>
                  <label>{t('sessionSummary')}</label>
                  <textarea value={newSession.summary} onChange={e => setNewSession(p => ({ ...p, summary: e.target.value }))} rows={3} placeholder={t('phSessionSummary')} style={{ width: '100%' }} />
                </div>
                <div className="field" style={{ gridColumn: '1 / -1' }}>
                  <label>{t('sessionNotes')}</label>
                  <textarea value={newSession.notes} onChange={e => setNewSession(p => ({ ...p, notes: e.target.value }))} rows={3} placeholder={t('phSessionNotes')} style={{ width: '100%' }} />
                </div>
              </div>
              <button className="btn btn-secondary" style={{ marginTop: 'var(--space-sm)' }} onClick={handleAddSession}>{t('add')}</button>
            </fieldset>
          )}

          {sessions.length === 0 && <p className="muted-hint">{t('noSessionsYet')}</p>}
          {sessions.map(s => (
            <div key={s.id} className="character-card" style={{ marginBottom: 'var(--space-sm)' }}>
              {editingSession?.id === s.id ? (
                <div style={{ flex: 1, padding: 'var(--space-sm)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                    <input type="text" value={editingSession.title} onChange={e => setEditingSession(p => ({ ...p, title: e.target.value }))} />
                    <input type="date" value={editingSession.sessionDate || ''} onChange={e => setEditingSession(p => ({ ...p, sessionDate: e.target.value }))} />
                    <input type="number" min="1" style={{ width: 60 }} value={editingSession.sessionNumber || ''} onChange={e => setEditingSession(p => ({ ...p, sessionNumber: e.target.value }))} placeholder="#" />
                  </div>
                  <textarea value={editingSession.summary || ''} onChange={e => setEditingSession(p => ({ ...p, summary: e.target.value }))} rows={3} placeholder={t('sessionSummary')} style={{ width: '100%', marginBottom: 'var(--space-xs)' }} />
                  <textarea value={editingSession.notes || ''} onChange={e => setEditingSession(p => ({ ...p, notes: e.target.value }))} rows={3} placeholder={t('sessionNotes')} style={{ width: '100%', marginBottom: 'var(--space-xs)' }} />
                  <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                    <button className="btn btn-primary btn-sm" onClick={() => handleUpdateSession(s.id)}>{t('saveChanges')}</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditingSession(null)}>{t('cancel')}</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="character-card-info">
                    <h3 style={{ fontSize: '0.9rem' }}>
                      {s.sessionNumber && <span style={{ color: 'var(--color-text-muted)' }}>#{s.sessionNumber} — </span>}
                      {s.title}
                    </h3>
                    {s.sessionDate && <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{s.sessionDate}</p>}
                    {s.summary && <p style={{ fontSize: '0.82rem', marginTop: 'var(--space-xs)' }}>{s.summary}</p>}
                    {s.notes && <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-xs)', fontStyle: 'italic' }}>{s.notes}</p>}
                  </div>
                  {canManage && (
                    <div className="character-card-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => setEditingSession({ ...s })}>{t('edit')}</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteSession(s.id)} aria-label={`${t('deleteBtn')} ${s.title}`}>✕</button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Manage Tab (Owner only) ── */}
      {isOwner && (
        <div hidden={tab !== 2}>
          <div className="form-section">
            {SPLAT_CATEGORIES.length > 1 && (
              <fieldset>
                <legend>{t('allowedCharTypes')}</legend>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                  {t('allowedCharTypesHint')}
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {SPLAT_CATEGORIES.map(cat => {
                    const checked = getAllowedSet().has(cat)
                    return (
                      <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={checked} onChange={() => handleToggleSplat(cat)} />
                        {t(SPLAT_LABEL_MAP[cat] || cat)}
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            )}

            <fieldset>
              <legend>{t('inviteLink')}</legend>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                {t('inviteLinkHint')}
              </p>
              {chronicle.inviteCode ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <input type="text" readOnly
                      value={`${window.location.origin}/invite/${chronicle.inviteCode}`}
                      style={{ flex: 1, minWidth: 220, fontSize: '0.9rem', fontFamily: 'monospace' }}
                      onClick={e => e.target.select()}
                    />
                    <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/invite/${chronicle.inviteCode}`)}>
                      {t('copyLink')}
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={handleGenerateInviteCode}>
                      {t('regenerateLink')}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={handleDisableInviteCode}>
                      {t('disableLink')}
                    </button>
                  </div>
                </>
              ) : (
                <button className="btn btn-primary btn-sm" onClick={handleGenerateInviteCode}>
                  {t('generateInviteLink')}
                </button>
              )}
            </fieldset>

            <fieldset>
              <legend>{t('assistantStorytellers')}</legend>
              {(!chronicle.assistantStorytellers || chronicle.assistantStorytellers.length === 0) && (
                <p className="muted-hint">{t('noAssistantSTs')}</p>
              )}
              {chronicle.assistantStorytellers && chronicle.assistantStorytellers.length > 0 && (
                <ul className="character-list" aria-label={t('assistantStorytellers')}>
                  {chronicle.assistantStorytellers.map(ast => (
                    <li key={ast.id} className="character-card">
                      <div className="character-card-info">
                        <h3>{ast.username}</h3>
                      </div>
                      <div className="character-card-actions">
                        <button className="btn btn-danger btn-sm" onClick={() => handleRemoveAssistant(ast.id)}>
                          {t('remove')}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <form onSubmit={handleAddAssistant} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input
                  type="text"
                  value={assistantUsername}
                  onChange={e => setAssistantUsername(e.target.value)}
                  placeholder={t('phAssistantUsername')}
                  className="input"
                />
                <button type="submit" className="btn btn-primary btn-sm">{t('addAssistantST')}</button>
              </form>
            </fieldset>
          </div>
        </div>
      )}
    </section>
  )
}
