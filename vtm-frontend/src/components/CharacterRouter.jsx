import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getCharacter } from '../api/characterApi'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import CharacterForm from './CharacterForm'
import WerewolfForm from './WerewolfForm'
import MageForm from './MageForm'
import VampireRevisedForm from './VampireRevisedForm'
import KoteForm from './KoteForm'
import VampireDarkAgesForm from './VampireDarkAgesForm'
import VictorianVampireForm from './VictorianVampireForm'
import WyldWestWerewolfForm from './WyldWestWerewolfForm'
import VictorianMageForm from './VictorianMageForm'
import ChangingBreedsForm from './ChangingBreedsForm'
import GhoulForm from './GhoulForm'
import FamiliarForm from './FamiliarForm'
import TotemForm from './TotemForm'
import SeventhSeaForm from './SeventhSeaForm'
import L5RForm from './L5RForm'

export default function CharacterRouter() {
  const { id } = useParams()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const [splat, setSplat] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await getCharacter(id)
        const s = res.data.splat || 'VAMPIRE'
        setSplat(s)
        switchTheme(s === 'SEVENTH_SEA' ? '7thsea' : s === 'L5R' ? 'l5r' : 'wod')
      } catch {
        setSplat('VAMPIRE')
        switchTheme('wod')
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
  if (splat === 'VICTORIAN_VAMPIRE') return <VictorianVampireForm />
  if (splat === 'WYLD_WEST_WEREWOLF') return <WyldWestWerewolfForm />
  if (splat === 'VICTORIAN_MAGE') return <VictorianMageForm />
  if (splat === 'CHANGING_BREEDS') return <ChangingBreedsForm />
  if (splat === 'GHOUL') return <GhoulForm />
  if (splat === 'FAMILIAR') return <FamiliarForm />
  if (splat === 'TOTEM') return <TotemForm />
  if (splat === 'SEVENTH_SEA') return <SeventhSeaForm />
  if (splat === 'L5R') return <L5RForm />
  return <CharacterForm />
}
