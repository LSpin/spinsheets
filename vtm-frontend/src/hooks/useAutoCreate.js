import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { createCharacter } from '../api/characterApi'
import { joinChronicle } from '../api/chronicleApi'

export default function useAutoCreate(characterId, defaults) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const guidedMode = searchParams.get('mode') === 'guided'
  const chronicleId = searchParams.get('chronicle')
  const creating = useRef(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (characterId) return
    if (creating.current) return
    creating.current = true

    async function autoCreate() {
      try {
        const res = await createCharacter(defaults)
        const newId = res.data.id
        if (guidedMode && chronicleId) {
          try { await joinChronicle(newId, chronicleId) } catch {}
        }
        const params = new URLSearchParams()
        if (guidedMode) params.set('mode', 'guided')
        if (chronicleId) params.set('chronicle', chronicleId)
        const qs = params.toString()
        navigate(`/characters/${newId}${qs ? '?' + qs : ''}`, { replace: true })
      } catch (err) {
        setError(err)
        creating.current = false
      }
    }
    autoCreate()
  }, [])

  return { isAutoCreating: !characterId, autoCreateError: error }
}
