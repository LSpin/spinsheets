import { useState, useEffect, Suspense } from 'react'
import lazyRetry from '../utils/lazyRetry'
import { useParams } from 'react-router-dom'
import { getCharacter } from '../api/characterApi'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'

const CharacterForm = lazyRetry(() => import('./CharacterForm'))
const WerewolfForm = lazyRetry(() => import('./WerewolfForm'))
const MageForm = lazyRetry(() => import('./MageForm'))
const VampireRevisedForm = lazyRetry(() => import('./VampireRevisedForm'))
const KoteForm = lazyRetry(() => import('./KoteForm'))
const VampireDarkAgesForm = lazyRetry(() => import('./VampireDarkAgesForm'))
const VictorianVampireForm = lazyRetry(() => import('./VictorianVampireForm'))
const WyldWestWerewolfForm = lazyRetry(() => import('./WyldWestWerewolfForm'))
const VictorianMageForm = lazyRetry(() => import('./VictorianMageForm'))
const ChangingBreedsForm = lazyRetry(() => import('./ChangingBreedsForm'))
const GhoulForm = lazyRetry(() => import('./GhoulForm'))
const FamiliarForm = lazyRetry(() => import('./FamiliarForm'))
const TotemForm = lazyRetry(() => import('./TotemForm'))
const KinfolkForm = lazyRetry(() => import('./KinfolkForm'))
const HunterForm = lazyRetry(() => import('./HunterForm'))
const WraithForm = lazyRetry(() => import('./WraithForm'))
const ChangelingForm = lazyRetry(() => import('./ChangelingForm'))
const DemonForm = lazyRetry(() => import('./DemonForm'))
const BsdForm = lazyRetry(() => import('./BsdForm'))
const MortalsForm = lazyRetry(() => import('./MortalsForm'))
const SeventhSeaForm = lazyRetry(() => import('./SeventhSeaForm'))
const SeventhSeaVillainForm = lazyRetry(() => import('./SeventhSeaVillainForm'))
const SeventhSeaShipForm = lazyRetry(() => import('./SeventhSeaShipForm'))
const L5RForm = lazyRetry(() => import('./L5RForm'))
const L5RAntagonistForm = lazyRetry(() => import('./L5RAntagonistForm'))
const L5R5eForm = lazyRetry(() => import('./L5R5eForm'))
const BladesForm = lazyRetry(() => import('./BladesForm'))
const BladesCrewForm = lazyRetry(() => import('./BladesCrewForm'))
const BladesAntagonistForm = lazyRetry(() => import('./BladesAntagonistForm'))
const DndForm = lazyRetry(() => import('./DndForm'))
const DndMonsterForm = lazyRetry(() => import('./DndMonsterForm'))
const UestrpgForm = lazyRetry(() => import('./UestrpgForm'))
const UestrpgAntagonistForm = lazyRetry(() => import('./UestrpgAntagonistForm'))
const CyberpunkForm = lazyRetry(() => import('./CyberpunkForm'))
const CyberpunkAntagonistForm = lazyRetry(() => import('./CyberpunkAntagonistForm'))
const AsoiafForm = lazyRetry(() => import('./AsoiafForm'))
const AsoiafAntagonistForm = lazyRetry(() => import('./AsoiafAntagonistForm'))

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
        switchTheme(s === 'SEVENTH_SEA' || s === 'SEVENTH_SEA_SHIP' ? '7thsea' : s === 'L5R' || s === 'L5R_ANTAGONIST' || s === 'L5R_5E' ? 'l5r' : s === 'BLADES' || s === 'BLADES_CREW' || s === 'BLADES_ANTAGONIST' ? 'blades' : s === 'DND' || s === 'DND_MONSTER' ? 'dnd' : s === 'UESTRPG' || s === 'UESTRPG_ANTAGONIST' ? 'uestrpg' : s === 'CYBERPUNK' || s === 'CYBERPUNK_ANTAGONIST' ? 'cyberpunk' : s === 'ASOIAF' || s === 'ASOIAF_ANTAGONIST' ? 'asoiaf' : 'wod')
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
  else if (splat === 'L5R_5E') FormComponent = L5R5eForm
  else if (splat === 'L5R_ANTAGONIST') FormComponent = L5RAntagonistForm
  else if (splat === 'BLADES_ANTAGONIST') FormComponent = BladesAntagonistForm
  else if (splat === 'BLADES') FormComponent = BladesForm
  else if (splat === 'BLADES_CREW') FormComponent = BladesCrewForm
  else if (splat === 'DND') FormComponent = DndForm
  else if (splat === 'DND_MONSTER') FormComponent = DndMonsterForm
  else if (splat === 'UESTRPG_ANTAGONIST') FormComponent = UestrpgAntagonistForm
  else if (splat === 'UESTRPG') FormComponent = UestrpgForm
  else if (splat === 'CYBERPUNK') FormComponent = CyberpunkForm
  else if (splat === 'CYBERPUNK_ANTAGONIST') FormComponent = CyberpunkAntagonistForm
  else if (splat === 'ASOIAF') FormComponent = AsoiafForm
  else if (splat === 'ASOIAF_ANTAGONIST') FormComponent = AsoiafAntagonistForm

  return (
    <Suspense fallback={<p className="status-loading">{t('loading')}</p>}>
      <FormComponent />
    </Suspense>
  )
}
