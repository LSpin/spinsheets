import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { createCharacter } from '../api/characterApi'
import { joinChronicle } from '../api/chronicleApi'

export default function useAutoCreate(characterId, defaults) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const guidedMode = searchParams.get('mode') === 'guided'
  const chronicleId = searchParams.get('chronicle')
  const isNpc = searchParams.get('npc') === 'true'
  const creating = useRef(false)
  const [error, setError] = useState(null)
  const [joinError, setJoinError] = useState(null)

  useEffect(() => {
    if (characterId) return
    if (creating.current) return
    creating.current = true

    async function autoCreate() {
      try {
        const charData = isNpc ? { ...defaults, npc: true } : defaults
        const res = await createCharacter(charData)
        const newId = res.data.id
        let joinFailed = false
        if (guidedMode && chronicleId) {
          try {
            await joinChronicle(newId, chronicleId)
          } catch (err) {
            joinFailed = true
            setJoinError(err.response?.data?.error || 'Failed to join chronicle')
          }
        }
        const params = new URLSearchParams()
        if (guidedMode) params.set('mode', 'guided')
        if (chronicleId && !joinFailed) params.set('chronicle', chronicleId)
        const qs = params.toString()
        navigate(`/characters/${newId}${qs ? '?' + qs : ''}`, { replace: true })
      } catch (err) {
        setError(err)
        creating.current = false
      }
    }
    autoCreate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { isAutoCreating: !characterId, autoCreateError: error, joinError }
}
