import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getCharacter } from '../api/characterApi'
import CharacterForm from './CharacterForm'
import WerewolfForm from './WerewolfForm'

export default function CharacterRouter() {
  const { id } = useParams()
  const [splat, setSplat] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await getCharacter(id)
        setSplat(res.data.splat || 'VAMPIRE')
      } catch {
        setSplat('VAMPIRE')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <p className="status-loading">Loading...</p>

  if (splat === 'WEREWOLF') return <WerewolfForm />
  return <CharacterForm />
}
