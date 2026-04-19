import { useState, useEffect, lazy, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { getCharacter } from '../api/characterApi'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'

const CharacterForm = lazy(() => import('./CharacterForm'))
const WerewolfForm = lazy(() => import('./WerewolfForm'))
const MageForm = lazy(() => import('./MageForm'))
const VampireRevisedForm = lazy(() => import('./VampireRevisedForm'))
const KoteForm = lazy(() => import('./KoteForm'))
const VampireDarkAgesForm = lazy(() => import('./VampireDarkAgesForm'))
const VictorianVampireForm = lazy(() => import('./VictorianVampireForm'))
const WyldWestWerewolfForm = lazy(() => import('./WyldWestWerewolfForm'))
const VictorianMageForm = lazy(() => import('./VictorianMageForm'))
const ChangingBreedsForm = lazy(() => import('./ChangingBreedsForm'))
const GhoulForm = lazy(() => import('./GhoulForm'))
const FamiliarForm = lazy(() => import('./FamiliarForm'))
const TotemForm = lazy(() => import('./TotemForm'))
const KinfolkForm = lazy(() => import('./KinfolkForm'))
const HunterForm = lazy(() => import('./HunterForm'))
const WraithForm = lazy(() => import('./WraithForm'))
const ChangelingForm = lazy(() => import('./ChangelingForm'))
const DemonForm = lazy(() => import('./DemonForm'))
const BsdForm = lazy(() => import('./BsdForm'))
const MortalsForm = lazy(() => import('./MortalsForm'))
const SeventhSeaForm = lazy(() => import('./SeventhSeaForm'))
const SeventhSeaVillainForm = lazy(() => import('./SeventhSeaVillainForm'))
const L5RForm = lazy(() => import('./L5RForm'))
const L5RAntagonistForm = lazy(() => import('./L5RAntagonistForm'))
const BladesForm = lazy(() => import('./BladesForm'))
const BladesCrewForm = lazy(() => import('./BladesCrewForm'))
const BladesAntagonistForm = lazy(() => import('./BladesAntagonistForm'))
const DndForm = lazy(() => import('./DndForm'))
const DndMonsterForm = lazy(() => import('./DndMonsterForm'))
const UestrpgForm = lazy(() => import('./UestrpgForm'))
const UestrpgAntagonistForm = lazy(() => import('./UestrpgAntagonistForm'))

export default function CharacterRouter() {
  const { id } = useParams()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const [splat, setSplat] = useState(null)
  const [isNpc, setIsNpc] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await getCharacter(id)
        const s = res.data.splat || 'VAMPIRE'
        setSplat(s)
        setIsNpc(!!res.data.npc)
        setNotFound(false)
        switchTheme(s === 'SEVENTH_SEA' ? '7thsea' : s === 'L5R' || s === 'L5R_ANTAGONIST' ? 'l5r' : s === 'BLADES' || s === 'BLADES_CREW' || s === 'BLADES_ANTAGONIST' ? 'blades' : s === 'DND' || s === 'DND_MONSTER' ? 'dnd' : s === 'UESTRPG' || s === 'UESTRPG_ANTAGONIST' ? 'uestrpg' : 'wod')
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <p className="status-loading">{t('loading')}</p>
  if (notFound) return (
    <div className="empty-state" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
      <h2>{t('characterNotFound')}</h2>
      <p className="muted-hint">{t('characterNotFoundDesc')}</p>
    </div>
  )

  let FormComponent = CharacterForm
  if (splat === 'WEREWOLF') FormComponent = WerewolfForm
  else if (splat === 'MAGE') FormComponent = MageForm
  else if (splat === 'VAMPIRE_REVISED') FormComponent = VampireRevisedForm
  else if (splat === 'KOTE') FormComponent = KoteForm
  else if (splat === 'VAMPIRE_DARK_AGES') FormComponent = VampireDarkAgesForm
  else if (splat === 'VICTORIAN_VAMPIRE') FormComponent = VictorianVampireForm
  else if (splat === 'WYLD_WEST_WEREWOLF') FormComponent = WyldWestWerewolfForm
  else if (splat === 'VICTORIAN_MAGE') FormComponent = VictorianMageForm
  else if (splat === 'CHANGING_BREEDS') FormComponent = ChangingBreedsForm
  else if (splat === 'GHOUL') FormComponent = GhoulForm
  else if (splat === 'FAMILIAR') FormComponent = FamiliarForm
  else if (splat === 'TOTEM') FormComponent = TotemForm
  else if (splat === 'KINFOLK') FormComponent = KinfolkForm
  else if (splat === 'HUNTER') FormComponent = HunterForm
  else if (splat === 'WRAITH') FormComponent = WraithForm
  else if (splat === 'CHANGELING') FormComponent = ChangelingForm
  else if (splat === 'DEMON') FormComponent = DemonForm
  else if (splat === 'BSD') FormComponent = BsdForm
  else if (splat === 'MORTAL') FormComponent = MortalsForm
  else if (splat === 'SEVENTH_SEA' && isNpc) FormComponent = SeventhSeaVillainForm
  else if (splat === 'SEVENTH_SEA') FormComponent = SeventhSeaForm
  else if (splat === 'L5R' && isNpc) FormComponent = L5RAntagonistForm
  else if (splat === 'L5R') FormComponent = L5RForm
  else if (splat === 'L5R_ANTAGONIST') FormComponent = L5RAntagonistForm
  else if (splat === 'BLADES_ANTAGONIST') FormComponent = BladesAntagonistForm
  else if (splat === 'BLADES') FormComponent = BladesForm
  else if (splat === 'BLADES_CREW') FormComponent = BladesCrewForm
  else if (splat === 'DND') FormComponent = DndForm
  else if (splat === 'DND_MONSTER') FormComponent = DndMonsterForm
  else if (splat === 'UESTRPG_ANTAGONIST') FormComponent = UestrpgAntagonistForm
  else if (splat === 'UESTRPG') FormComponent = UestrpgForm

  return (
    <Suspense fallback={<p className="status-loading">{t('loading')}</p>}>
      <FormComponent />
    </Suspense>
  )
}
