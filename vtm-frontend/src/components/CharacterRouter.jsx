import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getCharacter } from '../api/characterApi'
import { useLanguage } from '../i18n/LanguageContext'
import CharacterForm from './CharacterForm'
import WerewolfForm from './WerewolfForm'
import MageForm from './MageForm'
import VampireRevisedForm from './VampireRevisedForm'
import KoteForm from './KoteForm'
import VampireDarkAgesForm from './VampireDarkAgesForm'

export default function CharacterRouter() {
  const { id } = useParams()
  const { t } = useLanguage()
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

  if (loading) return <p className="status-loading">{t('loading')}</p>

  if (splat === 'WEREWOLF') return <WerewolfForm />
  if (splat === 'MAGE') return <MageForm />
  if (splat === 'VAMPIRE_REVISED') return <VampireRevisedForm />
  if (splat === 'KOTE') return <KoteForm />
  if (splat === 'VAMPIRE_DARK_AGES') return <VampireDarkAgesForm />
  return <CharacterForm />
}
