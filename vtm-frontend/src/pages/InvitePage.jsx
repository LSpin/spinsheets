import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import { getInviteInfo, joinByInviteCode } from '../api/chronicleApi'
import { getCharacters } from '../api/characterApi'

const SPLAT_TO_CATEGORY = {
  VAMPIRE: 'VAMPIRE', VAMPIRE_REVISED: 'VAMPIRE', VAMPIRE_DARK_AGES: 'VAMPIRE',
  VICTORIAN_VAMPIRE: 'VAMPIRE', KOTE: 'VAMPIRE', GHOUL: 'VAMPIRE',
  WEREWOLF: 'WEREWOLF', WYLD_WEST_WEREWOLF: 'WEREWOLF', CHANGING_BREEDS: 'WEREWOLF', TOTEM: 'WEREWOLF',
  MAGE: 'MAGE', VICTORIAN_MAGE: 'MAGE', FAMILIAR: 'MAGE',
}

export default function InvitePage() {
  const { code } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useLanguage()

  const [invite, setInvite] = useState(null)
  const [myCharacters, setMyCharacters] = useState([])
  const [selectedCharId, setSelectedCharId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [inviteRes, charsRes] = await Promise.all([
          getInviteInfo(code),
          getCharacters(),
        ])
        setInvite(inviteRes.data)
        const allowedRaw = inviteRes.data.allowedSplats
        const allowedSet = allowedRaw ? new Set(allowedRaw.split(',')) : null
        const available = charsRes.data.filter(c => {
          if (c.ownerId !== user?.userId || c.chronicle) return false
          if (allowedSet) {
            const cat = SPLAT_TO_CATEGORY[c.splat] || c.splat
            if (!allowedSet.has(cat)) return false
          }
          return true
        })
        setMyCharacters(available)
        if (available.length > 0) setSelectedCharId(available[0].id)
      } catch {
        setError(t('inviteLinkInvalid'))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [code])

  async function handleAccept() {
    if (!selectedCharId) return
    setJoining(true)
    try {
      const res = await joinByInviteCode(code, selectedCharId)
      navigate(`/chronicles/${res.data.chronicleId}`)
    } catch (err) {
      setError(err.response?.data?.error || t('inviteJoinFailed'))
      setJoining(false)
    }
  }

  if (loading) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 440, textAlign: 'center' }}>
        {error ? (
          <>
            <h3>{t('inviteErrorTitle')}</h3>
            <p style={{ margin: '1rem 0', color: '#e55' }}>{error}</p>
            <button className="btn btn-secondary" onClick={() => navigate('/chronicles')}>
              {t('back')}
            </button>
          </>
        ) : invite && (
          <>
            <h3 style={{ marginBottom: '0.5rem' }}>{t('inviteTitle')}</h3>
            <p style={{ fontSize: '1.1rem', margin: '1rem 0', lineHeight: 1.6 }}>
              <strong>{invite.storyteller}</strong> {t('invitedYouTo')} <strong>{invite.chronicleName}</strong>
            </p>

            {myCharacters.length > 0 ? (
              <>
                <div className="field" style={{ textAlign: 'left', marginBottom: '1rem' }}>
                  <label>{t('selectCharacter')}</label>
                  <select value={selectedCharId} onChange={e => setSelectedCharId(Number(e.target.value))}>
                    {myCharacters.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <button className="btn btn-secondary" onClick={() => navigate('/chronicles')}>
                    {t('decline')}
                  </button>
                  <button className="btn btn-primary" onClick={handleAccept} disabled={joining}>
                    {joining ? t('joining') : t('acceptInvite')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p style={{ color: 'var(--color-text-muted)', margin: '1rem 0' }}>
                  {t('noCharactersToJoin')}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <button className="btn btn-secondary" onClick={() => navigate('/chronicles')}>
                    {t('decline')}
                  </button>
                  <button className="btn btn-primary" onClick={() => navigate('/characters')}>
                    {t('createCharacterFirst')}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
