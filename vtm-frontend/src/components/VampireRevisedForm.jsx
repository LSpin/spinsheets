import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  getCharacter, updateCharacter,
  getDisciplines, addDiscipline, removeDiscipline,
  getBackgrounds, addBackground, removeBackground,
  getMeritCatalog, getFlawCatalog,
  getMerits, getFlaws,
  getInventory,
  getXpLog, addXpLogEntry, removeXpLogEntry,
  getComboDisciplines, addComboDiscipline, removeComboDiscipline,
} from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import MeritsFlawsSection from './MeritsFlawsSection'
import InventorySection from './InventorySection'
import { COMBO_DISCIPLINES } from '../data/comboDisciplines'
import DotRating from './DotRating'
import XpLogSection from './XpLogSection'
import { SECONDARY_TALENTS, SECONDARY_SKILLS, SECONDARY_KNOWLEDGES } from '../data/secondaryAbilities'
import { useLanguage } from '../i18n/LanguageContext'
import { ELDER_POWERS } from '../data/elderPowers'
import { VAMPIRE_DISCIPLINES } from '../data/vampireDisciplines'
import { VAMPIRE_BACKGROUNDS as BACKGROUNDS } from '../data/backgrounds'
import TagInfoPanel from './TagInfoPanel'
import BloodSorcerySection from './BloodSorcerySection'
import DicePoolsTab from './DicePoolsTab'
import StorytellerDiceRoller from './StorytellerDiceRoller'

// ── Constants ──

const TAB_KEYS = ['tabIdentity', 'tabAttributes', 'tabAbilities', 'tabSecondaryAbilities', 'tabAdvantages', 'tabHealth', 'tabDisciplines', 'tabBackgrounds', 'tabMeritsFlaws', 'tabInventory', 'tabBloodSorcery', 'tabBackstory', 'tabXpLog', 'tabDicePools', 'tabDiceRoller']

const CLANS = [
  // ── The 13 Clans ──
  { value: 'Assamite',               curse: 'Under a Tremere curse, Assamite vitae is addictive to other Kindred — those who drink it must make a Willpower roll (Diff 8) or become one step blood bonded. Assamites are also driven to hunt and diablerize other vampires; each month without consuming Kindred vitae they must make a Frenzy check.' },
  { value: 'Brujah',                  curse: 'The difficulty to resist Frenzy and Rötschreck is always 1 higher (maximum 10). Brujah have a hair-trigger temper and are notorious for losing control of their passions at the worst possible moment.' },
  { value: 'Followers of Set',        curse: 'Suffer double damage from sunlight and fire. When confronted with holy symbols or items of their enemies\' faith, they must make Rötschreck checks as if facing fire. Bright light of any kind causes them discomfort.' },
  { value: 'Gangrel',                 curse: 'Each time a Gangrel frenzies, they permanently gain one animalistic feature — claws, slitted pupils, fur, a muzzle, etc. These features can only be removed by spending experience points (1 XP per feature).' },
  { value: 'Giovanni',                curse: 'The Giovanni Kiss is uniquely agonising. Mortals bitten take double the normal damage from blood loss, and receive none of the usual Kiss-induced ecstasy — only pain. This makes feeding discreet and socially invisible all but impossible.' },
  { value: 'Lasombra',                curse: 'Cast no reflection in mirrors or other reflective surfaces and cannot be captured on film, digital cameras, or video. They also suffer +1 difficulty on all Social rolls with non-Lasombra due to their shadow-tainted, unsettling presence.' },
  { value: 'Malkavian',               curse: 'Every Malkavian has at least one permanent derangement woven into the fabric of their Embrace. It can never be fully cured, only managed — and in moments of stress it reasserts itself with full force.' },
  { value: 'Nosferatu',               curse: 'Appearance is permanently 0 and can never be raised. All Social rolls except Intimidation suffer +1 difficulty. Nosferatu cannot walk openly in mortal society without supernatural concealment.' },
  { value: 'Ravnos',                  curse: 'Must indulge a specific vice (determined at Embrace: lying, theft, violence, seduction, etc.) at least once per night. Each night they successfully resist, they suffer a cumulative −1 die penalty to all dice pools until they give in.' },
  { value: 'Toreador',                curse: 'When encountering something of striking beauty — art, music, a face — the Toreador must make a Self-Control roll (Diff 6) or become enraptured and motionless for a full scene, incapable of acting.' },
  { value: 'Tremere',                 curse: 'At the moment of Embrace, every Tremere is blood bonded to the entire Council of Seven. They are also considered one step bonded to all other Tremere. The clan watches its own obsessively; true independence is almost impossible.' },
  { value: 'Tzimisce',                curse: 'Must sleep surrounded by at least two handfuls of earth from their birthplace or long-claimed domain each day. Each night they fail to rest in their earth, they lose one die from all dice pools. After three nights, all pools are reduced to zero.' },
  { value: 'Ventrue',                 curse: 'Can only feed from a specific type of mortal chosen at Embrace (e.g. only redheads, only the wealthy, only soldiers). Blood from any other source is immediately vomited up and provides no nourishment whatsoever.' },
  // ── Bloodlines ──
  { value: 'Ahrimanes',               curse: 'An all-female bloodline. Ahrimanes are unable to create childer through the Embrace; they can only convert existing Gangrel through a painful spiritual ritual. They are also compelled to remain near their territory and suffer dice pool penalties when far from their domain.' },
  { value: 'Baali',                   curse: 'Infernalist taint — any vampire with even one dot of True Faith automatically senses the Baali\'s corruption on sight. Holy ground deals aggravated damage to them and faith-based powers affect them more severely than other Kindred.' },
  { value: 'Blood Brothers',          curse: 'Created in circles of linked minds. Blood Brothers share a hive-mind with their circle — they cannot act independently without effort. Each brother has Appearance 0 and cannot raise it, and they suffer a permanent −1 to all Mental dice pools when separated from their circle.' },
  { value: 'Children of Osiris',      curse: 'Must maintain a strict moral code and meditative discipline at all times. If they ever commit an act of frenzy or fall below Humanity 7, they permanently lose access to their unique Bardo Discipline and revert to their parent clan\'s weaknesses.' },
  { value: 'Daughters of Cacophony',  curse: 'Their own Melpominee powers can turn inward. When using their voice to affect others\' emotions, they must make a Willpower roll (Diff 6) or also experience the emotion they are projecting, potentially losing control.' },
  { value: 'Gargoyle',                curse: 'Bound by Tremere Thaumaturgy as eternal guardians. They suffer a supernatural compulsion to protect Tremere chantries and obey Tremere commands. Breaking free requires an exceptional act of will and story-level sacrifice.' },
  { value: 'Harbingers of Skulls',    curse: 'Like the Giovanni, their Kiss deals double damage and provides no pleasure whatsoever. They also radiate an aura of death; mortals and animals flee from them instinctively and they receive −2 to Social pools in mundane interaction.' },
  { value: 'Kiasyd',                  curse: 'Their fae blood makes them vulnerable to cold iron — it deals aggravated damage on contact. Their alien appearance and disturbing presence imposes −2 to Social dice pools with ordinary mortals and many Kindred.' },
  { value: 'Lamia',                   curse: 'Carriers of a supernatural plague. Their bite inflicts a wasting disease on mortals that slowly kills within weeks. They cannot feed without potentially killing their vessel, making discreet feeding nearly impossible.' },
  { value: 'Nagaraja',                curse: 'Must consume human flesh as well as blood. Without flesh, they suffer cumulative dice pool penalties each night. Their bite tears rather than seduces, providing none of the Kiss\'s social camouflage.' },
  { value: 'Old Clan Tzimisce',       curse: 'Like the Tzimisce, they must sleep with earth from their homeland. However, they also refuse to learn Vicissitude, viewing it as a spiritual corruption. They lack the signature Discipline of their parent clan entirely.' },
  { value: 'Salubri',                 curse: 'A third eye opens in the centre of their forehead whenever they use Disciplines — impossible to hide. Every Kindred feels a Tremere-implanted supernatural compulsion to hunt and diablerize the Salubri on sight.' },
  { value: 'Salubri Antitribu',       curse: 'The warrior caste of the Salubri. They share the third eye curse and are hunted by the Tremere. Additionally, they must pursue and destroy infernalists and other corrupt supernaturals — failing to do so when the opportunity arises causes them to lose Willpower.' },
  { value: 'Samedi',                  curse: 'Appear as rotting, desiccated corpses regardless of age or power. Appearance cannot exceed 0. All Social rolls except Intimidation suffer +1 difficulty, identical to Nosferatu. They cannot pass for living under any normal circumstances.' },
  { value: 'True Brujah',             curse: 'Emotionally dead. True Brujah cannot feel passion or strong emotion. They never frenzy, but they also cannot spend Willpower to gain automatic successes on Social rolls involving genuine emotional appeal. Their cold detachment is obvious and unsettling.' },
  // ── Non-clan ──
  { value: 'Caitiff',                 curse: 'No inherent clan curse, but Caitiff are universally despised. They have no clan Discipline affinities and pay the out-of-clan experience cost for all powers. Status is always treated as 0 when interacting with clanned Kindred who know their lineage.' },
  { value: 'Ghoul',                   curse: 'No Kindred curse. The ghoul is bound to their regnant by the blood bond and must feed on their regnant\'s vitae at least once per month or begin aging and losing their ghoul powers. Severing the bond is psychologically devastating.' },
  { value: 'Mortal',                  curse: 'No supernatural curse. Subject to normal aging, disease, and injury with no supernatural resilience.' },
]

const HEALTH_LEVELS = [
  { key: 'healthy',       penalty: '' },
  { key: 'bruised',       penalty: 'noPenalty' },
  { key: 'hurt',          penalty: '−1' },
  { key: 'injured',       penalty: '−1' },
  { key: 'wounded',       penalty: '−2' },
  { key: 'mauled',        penalty: '−2' },
  { key: 'crippled',      penalty: '−5' },
  { key: 'incapacitated', penalty: '' },
  { key: 'torpor',        penalty: '' },
  { key: 'finalDeath',    penalty: '' },
]

const BLOOD_TABLE = {
  15: { max: 10, perTurn: 1 }, 14: { max: 10, perTurn: 1 }, 13: { max: 10, perTurn: 1 },
  12: { max: 11, perTurn: 1 }, 11: { max: 12, perTurn: 1 }, 10: { max: 13, perTurn: 1 },
   9: { max: 14, perTurn: 2 },  8: { max: 15, perTurn: 3 },  7: { max: 20, perTurn: 4 },
   6: { max: 30, perTurn: 5 },  5: { max: 40, perTurn: 6 },  4: { max: 50, perTurn: 8 },
}

function bloodStats(gen) {
  return BLOOD_TABLE[gen] ?? { max: 10, perTurn: 1 }
}

function ordinal(n) {
  const s = ['th','st','nd','rd'], v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

const INITIAL = {
  // Identity
  npc: false, splat: 'VAMPIRE_REVISED',
  name: '', altName: '', concept: '', clan: '', sect: '',
  generation: 8, nature: '', demeanor: '', domainHaven: '',
  visibleAge: '', totalAge: '',
  // Attributes
  strength: 1, dexterity: 1, stamina: 1,
  charisma: 1, manipulation: 1, appearance: 1,
  perception: 1, intelligence: 1, wits: 1,
  strengthSpec: '', dexteritySpec: '', staminaSpec: '',
  charismaSpec: '', manipulationSpec: '', appearanceSpec: '',
  perceptionSpec: '', intelligenceSpec: '', witsSpec: '',
  // Talents (Revised: Dodge instead of Awareness)
  alertness: 0, athletics: 0, brawl: 0, dodge: 0, empathy: 0,
  expression: 0, intimidation: 0, leadership: 0, streetwise: 0, subterfuge: 0,
  alertnessSpec: '', athleticsSpec: '', brawlSpec: '', dodgeSpec: '', empathySpec: '',
  expressionSpec: '', intimidationSpec: '', leadershipSpec: '', streetwiseSpec: '', subterfugeSpec: '',
  hobbyTalent1Name: '', hobbyTalent1: 0,
  hobbyTalent2Name: '', hobbyTalent2: 0,
  hobbyTalent3Name: '', hobbyTalent3: 0,
  hobbyTalent4Name: '', hobbyTalent4: 0,
  hobbyTalent5Name: '', hobbyTalent5: 0,
  hobbyTalent6Name: '', hobbyTalent6: 0,
  hobbyTalent7Name: '', hobbyTalent7: 0,
  hobbyTalent8Name: '', hobbyTalent8: 0,
  hobbyTalent9Name: '', hobbyTalent9: 0,
  hobbyTalent10Name: '', hobbyTalent10: 0,
  // Skills (Revised: Security instead of Larceny)
  animalKen: 0, crafts: 0, drive: 0, etiquette: 0, firearms: 0,
  melee: 0, performance: 0, security: 0, stealth: 0, survival: 0,
  animalKenSpec: '', craftsSpec: '', driveSpec: '', etiquetteSpec: '', firearmsSpec: '',
  meleeSpec: '', performanceSpec: '', securitySpec: '', stealthSpec: '', survivalSpec: '',
  profSkill1Name: '', profSkill1: 0,
  profSkill2Name: '', profSkill2: 0,
  profSkill3Name: '', profSkill3: 0,
  profSkill4Name: '', profSkill4: 0,
  profSkill5Name: '', profSkill5: 0,
  profSkill6Name: '', profSkill6: 0,
  profSkill7Name: '', profSkill7: 0,
  profSkill8Name: '', profSkill8: 0,
  profSkill9Name: '', profSkill9: 0,
  profSkill10Name: '', profSkill10: 0,
  // Knowledges (Revised: no Technology)
  academics: 0, computer: 0, finance: 0, investigation: 0, law: 0,
  linguistics: 0, medicine: 0, occult: 0, politics: 0, science: 0,
  academicsSpec: '', computerSpec: '', financeSpec: '', investigationSpec: '', lawSpec: '',
  linguisticsSpec: '', medicineSpec: '', occultSpec: '', politicsSpec: '', scienceSpec: '',
  expertKnowl1Name: '', expertKnowl1: 0,
  expertKnowl2Name: '', expertKnowl2: 0,
  expertKnowl3Name: '', expertKnowl3: 0,
  expertKnowl4Name: '', expertKnowl4: 0,
  expertKnowl5Name: '', expertKnowl5: 0,
  expertKnowl6Name: '', expertKnowl6: 0,
  expertKnowl7Name: '', expertKnowl7: 0,
  expertKnowl8Name: '', expertKnowl8: 0,
  expertKnowl9Name: '', expertKnowl9: 0,
  expertKnowl10Name: '', expertKnowl10: 0,
  // Virtues & Path
  conscience: 1, selfControl: 1, courage: 1,
  pathName: 'Humanity', pathRating: 2,
  willpower: 3, currentWillpower: 3,
  // Blood & Health
  currentBlood: 10, woundLevel: 0,
  healthBruised: '', healthHurt: '', healthInjured: '', healthWounded: '', healthMauled: '', healthCrippled: '', healthIncap: '',
  // Misc
  derangement1: '', derangement2: '',
  clanCurse: '', notes: '',
  backstory: '', appearanceDesc: '', goals: '', allies: '', enemies: '', havens: '', territories: '',
  personalItems: '',
}

// ── Helper components ──

function RatingRow({ abilityKey, specKey, fields, onField, onText, t, max = 5 }) {
  return (
    <div className="ability-row">
      <DotRating label={t(abilityKey)} name={abilityKey} value={fields[abilityKey]} onChange={onField} max={max} />
      <input className="spec-input" type="text" name={specKey} value={fields[specKey] ?? ''} onChange={onText}
        placeholder={t('specialty')} aria-label={`${t(abilityKey)} ${t('specialty')}`} />
    </div>
  )
}

function CustomAbilityRow({ nameProp, ratingProp, placeholder, fields, onField, onText, catalog, t, max = 5 }) {
  const match = catalog?.find(c => c.value === fields[nameProp])
  return (
    <div className="custom-ability-row">
      <input type="text" name={nameProp} value={fields[nameProp]} onChange={onText}
        placeholder={placeholder} aria-label={`${placeholder} name`} className="custom-ability-name"
        list={`${nameProp}-list`} />
      {catalog && <datalist id={`${nameProp}-list`}>{catalog.map(c => <option key={c.value} value={c.value} />)}</datalist>}
      <DotRating label="" name={ratingProp} value={fields[ratingProp]} onChange={onField} max={max} />
      {match && <p className="archetype-desc" style={{ gridColumn: '1 / -1', margin: 0 }}>{match.description}</p>}
    </div>
  )
}

// ── Component ──

export default function VampireRevisedForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const characterId = paramId ? Number(paramId) : null

  const [tab, setTab] = useState(0)
  const [fields, setFields] = useState(INITIAL)
  const [disciplines, setDisciplines] = useState([])
  const [backgrounds, setBackgrounds] = useState([])
  const [merits, setMerits] = useState([])
  const [flaws, setFlaws] = useState([])
  const [meritCatalog, setMeritCatalog] = useState([])
  const [flawCatalog, setFlawCatalog] = useState([])
  const [inventory, setInventory] = useState([])
  const [comboDisciplines, setComboDisciplines] = useState([])
  const [newCombo, setNewCombo] = useState({ name: '', prerequisites: '', description: '', xpCost: '' })
  const [newDiscipline, setNewDiscipline] = useState({ name: '', level: 1 })
  const [newBackground, setNewBackground] = useState({ name: '', level: 1, description: '' })
  const [xpLog, setXpLog] = useState([])
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [tagInfo, setTagInfo] = useState(null)

  const [searchParams] = useSearchParams()
  const guidedMode = searchParams.get('mode') === 'guided'
  const viewMode = searchParams.get('mode') === 'view'
  const { isAutoCreating } = useAutoCreate(characterId, INITIAL)

  // Guided creation state
  const [attrPriority, setAttrPriority] = useState({ physical: null, social: null, mental: null })
  const [abilPriority, setAbilPriority] = useState({ talents: null, skills: null, knowledges: null })

  const ATTR_BUDGETS = { primary: 7, secondary: 5, tertiary: 3 }
  const ABIL_BUDGETS = { primary: 13, secondary: 9, tertiary: 5 }

  const ATTR_GROUPS = {
    physical: ['strength', 'dexterity', 'stamina'],
    social: ['charisma', 'manipulation', 'appearance'],
    mental: ['perception', 'intelligence', 'wits'],
  }
  const ABIL_GROUPS = {
    talents: ['alertness', 'athletics', 'brawl', 'dodge', 'empathy', 'expression', 'intimidation', 'leadership', 'streetwise', 'subterfuge'],
    skills: ['animalKen', 'crafts', 'drive', 'etiquette', 'firearms', 'melee', 'performance', 'security', 'stealth', 'survival'],
    knowledges: ['academics', 'computer', 'finance', 'investigation', 'law', 'linguistics', 'medicine', 'occult', 'politics', 'science'],
  }

  function getAttrSpent(group) {
    return ATTR_GROUPS[group].reduce((sum, a) => sum + (fields[a] - 1), 0)
  }
  function getAbilSpent(group) {
    return ABIL_GROUPS[group].reduce((sum, a) => sum + fields[a], 0)
  }
  function getAttrBudget(group) {
    const priority = attrPriority[group]
    return priority ? ATTR_BUDGETS[priority] : 0
  }
  function getAbilBudget(group) {
    const priority = abilPriority[group]
    return priority ? ABIL_BUDGETS[priority] : 0
  }

  function PrioritySelector({ group, priorities, setPriorities, budgets }) {
    const currentPriority = priorities[group]
    const usedPriorities = Object.values(priorities).filter(Boolean)

    return (
      <div className="priority-selector">
        {['primary', 'secondary', 'tertiary'].map(p => {
          const isActive = currentPriority === p
          const isTaken = !isActive && usedPriorities.includes(p)
          return (
            <button
              key={p}
              type="button"
              className={`priority-btn${isActive ? ' priority-btn--active' : ''}`}
              disabled={isTaken}
              onClick={() => {
                setPriorities(prev => {
                  const next = { ...prev }
                  for (const k of Object.keys(next)) {
                    if (next[k] === p) next[k] = null
                  }
                  next[group] = isActive ? null : p
                  return next
                })
              }}
            >
              {t(`priority${p.charAt(0).toUpperCase() + p.slice(1)}`).replace('{0}', budgets[p])}
            </button>
          )
        })}
        {!currentPriority && <span className="priority-hint">{t('unassigned')}</span>}
      </div>
    )
  }

  function PointsIndicator({ spent, budget }) {
    const remaining = budget - spent
    const cls = remaining > 0 ? 'points-remaining--ok' : remaining < 0 ? 'points-remaining--over' : 'points-remaining--done'
    const text = remaining >= 0
      ? t('pointsRemaining').replace('{0}', remaining)
      : t('pointsOver').replace('{0}', Math.abs(remaining))
    return budget > 0 ? <span className={`points-remaining ${cls}`}>{text}</span> : null
  }

  const { max: maxBlood, perTurn } = bloodStats(fields.generation)
  const isHumanity = fields.pathName.trim().toLowerCase() === 'humanity'
  const computedPath = fields.conscience + fields.selfControl

  useEffect(() => {
    if (characterId) loadCharacter()
    loadCatalogs()
  }, [characterId])

  async function loadCharacter() {
    try {
      const [charRes, discRes, bgRes, meritRes, flawRes, invRes, xpRes, comboRes] = await Promise.all([
        getCharacter(characterId),
        getDisciplines(characterId),
        getBackgrounds(characterId),
        getMerits(characterId),
        getFlaws(characterId),
        getInventory(characterId),
        getXpLog(characterId),
        getComboDisciplines(characterId),
      ])
      const data = charRes.data
      setFields(prev => {
        const next = { ...prev }
        for (const k of Object.keys(prev)) if (data[k] != null) next[k] = data[k]
        return next
      })
      setDisciplines(discRes.data)
      setBackgrounds(bgRes.data)
      setMerits(meritRes.data)
      setFlaws(flawRes.data)
      setInventory(invRes.data)
      setXpLog(xpRes.data)
      setComboDisciplines(comboRes.data)
    } catch { setSaveError(t('failedToLoad')) }
    finally { setLoading(false) }
  }

  async function loadCatalogs() {
    try {
      const [m, f] = await Promise.all([getMeritCatalog(), getFlawCatalog()])
      setMeritCatalog(m.data)
      setFlawCatalog(f.data)
    } catch {}
  }

  function handleField(name, value) {
    setFields(prev => {
      const next = { ...prev, [name]: value }
      const isHum = next.pathName.trim().toLowerCase() === 'humanity'
      if ((name === 'conscience' || name === 'selfControl') && isHum) {
        next.pathRating = next.conscience + next.selfControl
      }
      if (name === 'pathName' && value.trim().toLowerCase() === 'humanity') {
        next.pathRating = next.conscience + next.selfControl
      }
      if (guidedMode && name === 'courage') {
        next.willpower = value
        next.currentWillpower = value
      }
      return next
    })
  }

  function handleText(e) {
    const { name, value, type } = e.target
    handleField(name, type === 'number' ? (parseInt(value) || 0) : value)
  }

  async function handleSave() {
    setSaving(true)
    setSaveError(null)
    try {
      await updateCharacter(characterId, fields)
    } catch (err) {
      setSaveError(err.response?.data?.message || t('failedToSave'))
    } finally { setSaving(false) }
  }

  async function handleDoneEditing() {
    setSaving(true)
    setSaveError(null)
    try {
      await updateCharacter(characterId, fields)
      navigate('/characters')
    } catch (err) {
      setSaveError(err.response?.data?.message || t('failedToSave'))
    } finally { setSaving(false) }
  }

  // Discipline handlers
  async function handleAddDiscipline() {
    if (!newDiscipline.name.trim() || !characterId) return
    try {
      const res = await addDiscipline(characterId, newDiscipline)
      setDisciplines(prev => [...prev, res.data])
      setNewDiscipline({ name: '', level: 1 })
    } catch {}
  }

  async function handleAddCombo() {
    if (!newCombo.name.trim()) return
    try {
      const data = { ...newCombo, xpCost: newCombo.xpCost ? parseInt(newCombo.xpCost) : null }
      const res = await addComboDiscipline(characterId, data)
      setComboDisciplines(prev => [...prev, res.data])
      setNewCombo({ name: '', prerequisites: '', description: '', xpCost: '' })
    } catch { setSaveError(t('failedToSave')) }
  }

  async function handleRemoveCombo(comboId) {
    try {
      await removeComboDiscipline(characterId, comboId)
      setComboDisciplines(prev => prev.filter(c => c.id !== comboId))
    } catch { setSaveError(t('failedToSave')) }
  }

  // Background handlers
  async function handleAddBackground() {
    if (!newBackground.name.trim() || !characterId) return
    try {
      const res = await addBackground(characterId, newBackground)
      setBackgrounds(prev => [...prev, res.data])
      setNewBackground({ name: '', level: 1, description: '' })
    } catch {}
  }

  // XP Log handlers


  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  const elderMax = fields.generation <= 4 ? 9 : fields.generation === 5 ? 8 : fields.generation === 6 ? 7 : fields.generation === 7 ? 6 : 5
  const isElder = elderMax > 5

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/characters')}>{t('back')}</button>
        <h2>{fields.name || t('newKindredRevised')}</h2>
        <span className="splat-badge splat-badge--vampire-revised">{t('vampireRevised')}</span>
        {guidedMode && <span className="splat-badge">{t('guidedCreation')}</span>}
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}
      {actionError && <p className="status-error" role="alert">{actionError}</p>}

      {/* Tabs */}
      <div className="tab-list" role="tablist">
        {TAB_KEYS.map((tk, i) => (
          <button key={tk} role="tab" className={`btn btn-secondary${tab === i ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(i)} aria-selected={tab === i}>{t(tk)}</button>
        ))}
      </div>

      {/* ── Identity ── */}
      <div hidden={tab !== 0}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tabIdentity')}</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="name">{t('charName')} <span aria-hidden="true">*</span></label>
                <input id="name" name="name" type="text" value={fields.name} onChange={handleText} required autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="altName">{t('altName')}</label>
                <input id="altName" name="altName" type="text" value={fields.altName} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="concept">{t('concept')}</label>
                <input id="concept" name="concept" type="text" value={fields.concept} onChange={handleText} autoComplete="off" />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('kindred')}</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="clan">{t('clan')}</label>
                <select id="clan" name="clan" value={fields.clan} onChange={e => {
                  const val = e.target.value
                  handleField('clan', val)
                  const entry = CLANS.find(c => c.value === val)
                  if (entry) handleField('clanCurse', entry.curse)
                  if (val === 'Nosferatu' || val === 'Samedi') handleField('appearance', 0)
                }}>
                  <option value="">{t('select')}</option>
                  {CLANS.map(c => <option key={c.value} value={c.value}>{t(c.value)}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="sect">{t('sect')}</label>
                <input id="sect" name="sect" type="text" value={fields.sect} onChange={handleText} autoComplete="off" placeholder={t('phSect')} />
              </div>
              <div className="field">
                <label htmlFor="generation">{t('generation')}</label>
                <select id="generation" name="generation" value={fields.generation} onChange={e => handleField('generation', parseInt(e.target.value))}>
                  {Array.from({ length: 12 }, (_, i) => 15 - i).map(g => {
                    const { max, perTurn } = bloodStats(g)
                    return <option key={g} value={g}>{ordinal(g)} (max {max} BP, {perTurn}/turn)</option>
                  })}
                </select>
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="nature">{t('nature')}</label>
                <input id="nature" name="nature" type="text" value={fields.nature} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="demeanor">{t('demeanor')}</label>
                <input id="demeanor" name="demeanor" type="text" value={fields.demeanor} onChange={handleText} autoComplete="off" />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="domainHaven">{t('domainHaven')}</label>
                <input id="domainHaven" name="domainHaven" type="text" value={fields.domainHaven} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="visibleAge">{t('visibleAge')}</label>
                <input id="visibleAge" name="visibleAge" type="text" value={fields.visibleAge} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="totalAge">{t('totalAge')}</label>
                <input id="totalAge" name="totalAge" type="text" value={fields.totalAge} onChange={handleText} autoComplete="off" />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="npc">{t('type')}</label>
                <div className="role-toggle" role="radiogroup" aria-label={t('type')}>
                  <button type="button" className={`role-toggle-btn${!fields.npc ? ' role-toggle-btn--active' : ''}`}
                    onClick={() => handleField('npc', false)}>{t('pc')}</button>
                  <button type="button" className={`role-toggle-btn${fields.npc ? ' role-toggle-btn--active' : ''}`}
                    onClick={() => handleField('npc', true)}>{t('npc')}</button>
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('clanCurseDerangements')}</legend>
            <div className="field">
              <label htmlFor="clanCurse">{t('clanCurseNotes')}</label>
              <textarea id="clanCurse" name="clanCurse" value={fields.clanCurse} onChange={handleText} rows={3} />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="derangement1">{t('derangements')}</label>
                <input id="derangement1" name="derangement1" type="text" value={fields.derangement1} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="derangement2">{t('derangements')}</label>
                <input id="derangement2" name="derangement2" type="text" value={fields.derangement2} onChange={handleText} autoComplete="off" />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('notes')}</legend>
            <div className="field">
              <textarea id="notes" name="notes" value={fields.notes} onChange={handleText} rows={5} placeholder={t('generalNotes')} />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Attributes ── */}
      <div hidden={tab !== 1}>
        <div className="form-section">
          {[
            { legendKey: 'physicalAttr', group: 'physical', attrs: ['strength', 'dexterity', 'stamina'] },
            { legendKey: 'socialAttr',   group: 'social',   attrs: ['charisma', 'manipulation', 'appearance'] },
            { legendKey: 'mentalAttr',   group: 'mental',   attrs: ['perception', 'intelligence', 'wits'] },
          ].map(({ legendKey, group, attrs }) => (
            <fieldset key={legendKey}>
              <legend>{t(legendKey)}</legend>
              {guidedMode && (
                <>
                  <PrioritySelector group={group} priorities={attrPriority} setPriorities={setAttrPriority} budgets={ATTR_BUDGETS} />
                  <PointsIndicator spent={getAttrSpent(group)} budget={getAttrBudget(group)} />
                </>
              )}
              <div className="rating-grid">
                {attrs.map(a => (
                  <div key={a} className="ability-row">
                    <DotRating label={t(a)} name={a} value={fields[a]} onChange={handleField} min={1} />
                    <input className="spec-input" type="text" name={a + 'Spec'} value={fields[a + 'Spec'] ?? ''} onChange={handleText}
                      placeholder={t('specialty')} aria-label={`${t(a)} ${t('specialty')}`} />
                  </div>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </div>

      {/* ── Abilities ── */}
      <div hidden={tab !== 2}>
        <div className="form-section">
          <fieldset>
            <legend>{t('talents')}</legend>
            {guidedMode && (
              <>
                <PrioritySelector group="talents" priorities={abilPriority} setPriorities={setAbilPriority} budgets={ABIL_BUDGETS} />
                <PointsIndicator spent={getAbilSpent('talents')} budget={getAbilBudget('talents')} />
                <p className="muted-hint muted-hint--xs">{t('maxPerAbility')}</p>
              </>
            )}
            <div className="rating-grid">
              {['alertness', 'athletics', 'brawl', 'dodge', 'empathy', 'expression', 'intimidation', 'leadership', 'streetwise', 'subterfuge'].map(a =>
                <RatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} t={t} />
              )}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('skills')}</legend>
            {guidedMode && (
              <>
                <PrioritySelector group="skills" priorities={abilPriority} setPriorities={setAbilPriority} budgets={ABIL_BUDGETS} />
                <PointsIndicator spent={getAbilSpent('skills')} budget={getAbilBudget('skills')} />
                <p className="muted-hint muted-hint--xs">{t('maxPerAbility')}</p>
              </>
            )}
            <div className="rating-grid">
              {['animalKen', 'crafts', 'drive', 'etiquette', 'firearms', 'melee', 'performance', 'security', 'stealth', 'survival'].map(a =>
                <RatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} t={t} />
              )}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('knowledges')}</legend>
            {guidedMode && (
              <>
                <PrioritySelector group="knowledges" priorities={abilPriority} setPriorities={setAbilPriority} budgets={ABIL_BUDGETS} />
                <PointsIndicator spent={getAbilSpent('knowledges')} budget={getAbilBudget('knowledges')} />
                <p className="muted-hint muted-hint--xs">{t('maxPerAbility')}</p>
              </>
            )}
            <div className="rating-grid">
              {['academics', 'computer', 'finance', 'investigation', 'law', 'linguistics', 'medicine', 'occult', 'politics', 'science'].map(a =>
                <RatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} t={t} />
              )}
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Secondary Abilities ── */}
      <div hidden={tab !== 3}>
        <div className="form-section">
          <div className="abilities-group">
            <fieldset>
              <legend>{t('secondaryTalents')}</legend>
              {Array.from({length: 10}, (_, i) => i + 1).map(n =>
                <CustomAbilityRow key={n} nameProp={`hobbyTalent${n}Name`} ratingProp={`hobbyTalent${n}`} placeholder={t('phHobbyTalent')} fields={fields} onField={handleField} onText={handleText} catalog={SECONDARY_TALENTS} t={t} />
              )}
            </fieldset>
            <fieldset>
              <legend>{t('secondarySkills')}</legend>
              {Array.from({length: 10}, (_, i) => i + 1).map(n =>
                <CustomAbilityRow key={n} nameProp={`profSkill${n}Name`} ratingProp={`profSkill${n}`} placeholder={t('phProfSkill')} fields={fields} onField={handleField} onText={handleText} catalog={SECONDARY_SKILLS} t={t} />
              )}
            </fieldset>
            <fieldset>
              <legend>{t('secondaryKnowledges')}</legend>
              {Array.from({length: 10}, (_, i) => i + 1).map(n =>
                <CustomAbilityRow key={n} nameProp={`expertKnowl${n}Name`} ratingProp={`expertKnowl${n}`} placeholder={t('phExpertKnowl')} fields={fields} onField={handleField} onText={handleText} catalog={SECONDARY_KNOWLEDGES} t={t} />
              )}
            </fieldset>
          </div>
        </div>
      </div>

      {/* ── Advantages ── */}
      <div hidden={tab !== 4}>
        <div className="form-section">
          <fieldset>
            <legend>{t('virtues')}</legend>
            <div className="rating-grid">
              <DotRating label={isHumanity ? t('conscience') : t('conviction')}  name="conscience"   value={fields.conscience}   onChange={handleField} min={1} />
              <DotRating label={isHumanity ? t('selfControl') : t('instinct')} name="selfControl"  value={fields.selfControl}  onChange={handleField} min={1} />
              <DotRating label={t('courage')}     name="courage"      value={fields.courage}      onChange={handleField} min={1} />
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('pathOfEnlightenment')}</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="pathName">{t('pathName')}</label>
                <select id="pathName" name="pathName" value={fields.pathName} onChange={handleText}>
                  <option value="Humanity">{t('humanity')}</option>
                  <option value="Path of Blood">{t('pathBlood')}</option>
                  <option value="Path of Bones">{t('pathBones')}</option>
                  <option value="Path of Caine">{t('pathCaine')}</option>
                  <option value="Path of Cathari">{t('pathCathari')}</option>
                  <option value="Path of Death and the Soul">{t('pathDeathSoul')}</option>
                  <option value="Path of Feral Hearts">{t('pathFeralHearts')}</option>
                  <option value="Path of Harmony">{t('pathHarmony')}</option>
                  <option value="Path of Honorable Accord">{t('pathHonorableAccord')}</option>
                  <option value="Path of Lilith">{t('pathLilith')}</option>
                  <option value="Path of Metamorphosis">{t('pathMetamorphosis')}</option>
                  <option value="Path of Night">{t('pathNight')}</option>
                  <option value="Path of Paradox">{t('pathParadox')}</option>
                  <option value="Path of Power and the Inner Voice">{t('pathPowerInnerVoice')}</option>
                  <option value="Path of Typhon-Set">{t('pathTyphonSet')}</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="pathRating">
                  {t('rating')} {isHumanity && <span className="muted">({t('conscience')} + {t('selfControl')} = {computedPath})</span>}
                </label>
                {isHumanity
                  ? <input id="pathRating" type="number" value={computedPath} readOnly className="readonly-input" />
                  : <DotRating label="" name="pathRating" value={fields.pathRating} onChange={handleField} min={0} max={10} />
                }
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('willpower')}</legend>
            <div className="field-row">
              <DotRating label={t('willpower')}        name="willpower"        value={fields.willpower}        onChange={handleField} min={1} max={10} />
              <DotRating label={t('currentWillpower')} name="currentWillpower" value={fields.currentWillpower} onChange={handleField} min={0} max={fields.willpower} />
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('bloodPool')} — {ordinal(fields.generation)} Gen (max {maxBlood}, {perTurn}/turn)</legend>
            <DotRating label={t('currentBlood')} name="currentBlood" value={fields.currentBlood} onChange={handleField} min={0} max={maxBlood} />
          </fieldset>

          <fieldset>
            <legend>{t('health')}</legend>
            <div className="field">
              <label htmlFor="woundLevel">{t('woundLevel')}</label>
              <select id="woundLevel" value={fields.woundLevel} onChange={e => handleField('woundLevel', parseInt(e.target.value))}>
                {HEALTH_LEVELS.map((h, i) => (
                  <option key={i} value={i}>{t(h.key)}{h.penalty ? ` ${/^[a-z]/i.test(h.penalty) ? t(h.penalty) : h.penalty}` : ''}</option>
                ))}
              </select>
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Health ── */}
      <div hidden={tab !== 5}>
        <div className="form-section">
          <fieldset>
            <legend>{t('healthTrack')}</legend>
            <p className="muted-hint muted-hint--sm">{t('healthHint')}</p>
            <table className="health-track">
              <thead>
                <tr>
                  <th>{t('health')}</th>
                  <th>{t('penalty')}</th>
                  <th>{t('damageType')}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { key: 'healthBruised',    label: 'bruised',       penalty: '' },
                  { key: 'healthHurt',       label: 'hurt',          penalty: '-1' },
                  { key: 'healthInjured',    label: 'injured',       penalty: '-1' },
                  { key: 'healthWounded',    label: 'wounded',       penalty: '-2' },
                  { key: 'healthMauled',     label: 'mauled',        penalty: '-2' },
                  { key: 'healthCrippled',   label: 'crippled',      penalty: '-5' },
                  { key: 'healthIncap',      label: 'incapacitated', penalty: '' },
                ].map(h => {
                  const val = fields[h.key] || ''
                  const dmgLabel = val === 'A' ? t('aggDmg') : val === 'L' ? t('lethalDmg') : val === 'B' ? t('bashingDmg') : t('undamaged')
                  const dmgColor = val === 'A' ? '#e55' : val === 'L' ? '#e95' : val === 'B' ? '#8cf' : 'var(--color-text-muted)'
                  return (
                    <tr key={h.key}
                      onClick={() => {
                        const cycle = { '': 'B', B: 'L', L: 'A', A: '' }
                        handleField(h.key, cycle[val] || '')
                      }}>
                      <td style={{ fontWeight: val ? 700 : 400 }}>{t(h.label)}</td>
                      <td style={{ color: 'var(--color-text-muted)' }}>{h.penalty || '—'}</td>
                      <td style={{ fontWeight: 600, color: dmgColor }}>{dmgLabel}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </fieldset>
        </div>
      </div>

      {/* ── Disciplines & Backgrounds ── */}
      <div hidden={tab !== 6}>
        <div className="disc-bg-layout">
        <div className="form-section">
          <fieldset>
                <legend>{t('disciplines')} ({disciplines.length})</legend>
                {disciplines.length > 0 && (
                  <ul className="tag-list">
                    {disciplines.map(d => (
                      <li key={d.id} className={`tag tag--clickable${d.id === tagInfo?.id ? ' tag--active' : ''}`}
                        onClick={() => setTagInfo(ti => ti?.id === d.id ? null : { ...d, kind: 'discipline' })}>
                        <span>{d.name} (Lv{d.level})</span>
                        <button className="tag-remove" onClick={e => { e.stopPropagation(); removeDiscipline(characterId, d.id); setDisciplines(prev => prev.filter(x => x.id !== d.id)); if (tagInfo?.id === d.id) setTagInfo(null) }}>×</button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="field-row" style={{ alignItems: 'flex-end' }}>
                  <div className="field" style={{ flex: 2 }}>
                    <label htmlFor="disc-name">{t('disciplineName')}</label>
                    <input id="disc-name" type="text" value={newDiscipline.name} onChange={e => setNewDiscipline(p => ({ ...p, name: e.target.value }))} autoComplete="off" placeholder={t('phProtean')} />
                  </div>
                  <div className="field">
                    <label htmlFor="disc-level">{t('level')}</label>
                    <select id="disc-level" value={newDiscipline.level} onChange={e => setNewDiscipline(p => ({ ...p, level: parseInt(e.target.value) }))}>
                      {Array.from({ length: elderMax }, (_, i) => i + 1).map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <button className="btn btn-secondary" onClick={handleAddDiscipline}>{t('add')}</button>
                </div>
              </fieldset>
              {isElder && (
                <fieldset>
                  <legend>{t('elderPowers')}</legend>
                  <p className="muted-hint" style={{ marginBottom: 'var(--space-sm)', fontSize: '0.78rem' }}>
                    {t('elderPowersHint')}
                  </p>
                  {(() => {
                    const filterDisc = newDiscipline.name.trim()
                    const filtered = filterDisc
                      ? ELDER_POWERS.filter(p => p.discipline.toLowerCase().includes(filterDisc.toLowerCase()))
                      : ELDER_POWERS
                    const byLevel = [6, 7, 8, 9].map(lv => ({
                      level: lv,
                      powers: filtered.filter(p => p.level === lv),
                    })).filter(g => g.powers.length > 0)
                    return (
                      <>
                        <div className="field" style={{ marginBottom: 'var(--space-sm)' }}>
                          <label htmlFor="elder-filter">{t('filterByDiscipline')}</label>
                          <input id="elder-filter" list="elder-disc-filter" type="text"
                            value={newDiscipline.name}
                            onChange={e => setNewDiscipline(p => ({ ...p, name: e.target.value }))}
                            placeholder={t('allDisciplines')}
                            autoComplete="off" />
                          <datalist id="elder-disc-filter">
                            {[...new Set(ELDER_POWERS.map(p => p.discipline))].sort().map(d => (
                              <option key={d} value={d} />
                            ))}
                          </datalist>
                        </div>
                        {/* Show base levels 1-5 when filtering a specific discipline */}
                        {filterDisc && (() => {
                          const baseEntry = VAMPIRE_DISCIPLINES.find(d => d.name.toLowerCase() === filterDisc.toLowerCase())
                          if (!baseEntry?.levels) return null
                          return (
                            <div style={{ marginBottom: 'var(--space-md)', padding: 'var(--space-sm)', background: 'var(--color-bg)', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)' }}>
                              <strong style={{ fontSize: '0.82rem' }}>{baseEntry.name} — Levels 1-5</strong>
                              <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--space-xs) 0' }}>
                                {baseEntry.levels.map((lvl, i) => (
                                  <li key={i} style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '2px' }}>{lvl}</li>
                                ))}
                              </ul>
                            </div>
                          )
                        })()}
                        {byLevel.map(({ level, powers }) => (
                          <div key={level} style={{ marginBottom: 'var(--space-sm)' }}>
                            <strong style={{ fontSize: '0.82rem' }}>Level {level}</strong>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--space-xs) 0' }}>
                              {powers.map(p => (
                                <li key={p.name} style={{ marginBottom: 'var(--space-xs)', fontSize: '0.78rem' }}>
                                  <strong>{p.name}</strong> <span style={{ color: 'var(--color-text-muted)' }}>({p.discipline})</span>
                                  <br /><span style={{ color: 'var(--color-text-muted)' }}>{p.description}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        {filtered.length === 0 && <p className="muted-hint">{t('noElderPowers')}</p>}
                      </>
                    )
                  })()}
                </fieldset>
              )}
              <hr className="divider" />
              <fieldset>
                <legend>{t('comboDisciplines')} ({comboDisciplines.length})</legend>
                {comboDisciplines.length === 0 && <p className="muted-hint">{t('noCombosYet')}</p>}
                {comboDisciplines.map(c => (
                  <div key={c.id} className="character-card" style={{ marginBottom: 'var(--space-sm)' }}>
                    <div className="character-card-info">
                      <h3 style={{ fontSize: '0.9rem' }}>{c.name}</h3>
                      {c.prerequisites && <p className="detail-sm" style={{ color: 'var(--color-text-muted)' }}>{t('comboPrereqs')}: {c.prerequisites}</p>}
                      {c.description && <p className="detail-sm">{c.description}</p>}
                      {c.xpCost && <p className="detail-xs" style={{ color: 'var(--color-text-muted)' }}>{t('comboXpCost')}: {c.xpCost}</p>}
                    </div>
                    <div className="character-card-actions">
                      <button className="btn btn-danger btn-sm" onClick={() => handleRemoveCombo(c.id)}>✕</button>
                    </div>
                  </div>
                ))}
                <div className="combo-grid">
                  <div className="field">
                    <label>{t('comboName')}</label>
                    <input type="text" list="combo-catalog" value={newCombo.name} onChange={e => {
                      const val = e.target.value
                      const hit = COMBO_DISCIPLINES.find(c => c.name === val)
                      if (hit) {
                        setNewCombo({ name: hit.name, prerequisites: hit.prerequisites, description: hit.description, xpCost: String(hit.xpCost) })
                      } else {
                        setNewCombo(p => ({ ...p, name: val }))
                      }
                    }} placeholder={t('phComboName')} />
                    <datalist id="combo-catalog">
                      {COMBO_DISCIPLINES.map(c => <option key={c.name} value={c.name} />)}
                    </datalist>
                  </div>
                  <div className="field">
                    <label>{t('comboPrereqs')}</label>
                    <input type="text" value={newCombo.prerequisites} onChange={e => setNewCombo(p => ({ ...p, prerequisites: e.target.value }))} placeholder={t('phComboPrereqs')} />
                  </div>
                  <div className="field field--full">
                    <label>{t('comboDesc')}</label>
                    <textarea value={newCombo.description} onChange={e => setNewCombo(p => ({ ...p, description: e.target.value }))} rows={3} placeholder={t('phComboDesc')} style={{ width: '100%' }} />
                  </div>
                  <div className="field field--narrow">
                    <label>{t('comboXpCost')}</label>
                    <input type="number" min="0" value={newCombo.xpCost} onChange={e => setNewCombo(p => ({ ...p, xpCost: e.target.value }))} />
                  </div>
                  <button className="btn btn-secondary" style={{ alignSelf: 'flex-end' }} onClick={handleAddCombo}>{t('add')}</button>
                </div>
              </fieldset>
        </div>
        {tagInfo?.kind === 'discipline' && (() => {
          const entry = VAMPIRE_DISCIPLINES.find(d => d.name.toLowerCase() === tagInfo.name.toLowerCase())
          return <TagInfoPanel entry={entry ? { name: entry.name, description: entry.clans?.length ? `Clans: ${entry.clans.join(', ')}` : undefined } : { name: tagInfo.name }} level={tagInfo.level} levels={entry?.levels} onClose={() => setTagInfo(null)} />
        })()}
        </div>
      </div>

      {/* ── Backgrounds ── */}
      <div hidden={tab !== 7}>
        <div className="disc-bg-layout">
        <div className="form-section">
              <fieldset>
                <legend>{t('backgrounds')} ({backgrounds.length})</legend>
                {backgrounds.length > 0 && (
                  <ul className="tag-list">
                    {backgrounds.map(b => (
                      <li key={b.id} className={`tag tag--clickable${b.id === tagInfo?.id ? ' tag--active' : ''}`}
                        onClick={() => setTagInfo(ti => ti?.id === b.id ? null : { ...b, kind: 'background' })}>
                        <span>{b.name} ({b.level}){b.description ? ` — ${b.description}` : ''}</span>
                        <button className="tag-remove" onClick={e => { e.stopPropagation(); removeBackground(characterId, b.id); setBackgrounds(prev => prev.filter(x => x.id !== b.id)); if (tagInfo?.id === b.id) setTagInfo(null) }}>×</button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="field-row" style={{ alignItems: 'flex-end' }}>
                  <div className="field" style={{ flex: 2 }}>
                    <label htmlFor="bg-name">{t('background')}</label>
                    <input id="bg-name" type="text" list="bg-suggestions" value={newBackground.name}
                      onChange={e => setNewBackground(p => ({ ...p, name: e.target.value }))} autoComplete="off" placeholder={t('phBackground')} />
                    <datalist id="bg-suggestions">
                      {BACKGROUNDS.map(b => <option key={b.value} value={b.value} />)}
                    </datalist>
                  </div>
                  <div className="field">
                    <label htmlFor="bg-level">{t('level')}</label>
                    <select id="bg-level" value={newBackground.level} onChange={e => setNewBackground(p => ({ ...p, level: parseInt(e.target.value) }))}>
                      {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="bg-desc">{t('description')}</label>
                    <input id="bg-desc" type="text" value={newBackground.description} onChange={e => setNewBackground(p => ({ ...p, description: e.target.value }))} autoComplete="off" />
                  </div>
                  <button className="btn btn-secondary" onClick={handleAddBackground}>{t('add')}</button>
                </div>
              </fieldset>
        </div>
        {tagInfo?.kind === 'background' && (() => {
          const entry = BACKGROUNDS.find(bg => bg.value.toLowerCase() === tagInfo.name.toLowerCase())
          return <TagInfoPanel entry={entry ? { name: entry.value, description: entry.description } : { name: tagInfo.name }} level={tagInfo.level} levels={entry?.levels} onClose={() => setTagInfo(null)} />
        })()}
        </div>
      </div>

      {/* ── Merits & Flaws ── */}
      <div hidden={tab !== 8}>
        <MeritsFlawsSection characterId={characterId} merits={merits} setMerits={setMerits} flaws={flaws} setFlaws={setFlaws} meritCatalog={meritCatalog} flawCatalog={flawCatalog} />
      </div>

      {/* ── Inventory ── */}
      <div hidden={tab !== 9}>
        <InventorySection characterId={characterId} inventory={inventory} setInventory={setInventory} personalItems={fields.personalItems} onPersonalItemsChange={handleText} />
      </div>

      {/* ── Blood Sorcery ── */}
      <div hidden={tab !== 10}>
        <BloodSorcerySection characterId={characterId} elderMax={elderMax} />
      </div>

      {/* ── Backstory ── */}
      <div role="tabpanel" id="tabpanel-11" aria-labelledby="tab-11" hidden={tab !== 11}>
        <div className="form-section">
          <fieldset>
            <legend>{t('backstoryLabel')}</legend>
            <textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} placeholder={t('backstoryPh')} style={{ width: '100%' }} />
          </fieldset>
          <fieldset>
            <legend>{t('appearanceLabel')}</legend>
            <textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={4} placeholder={t('appearancePh')} style={{ width: '100%' }} />
          </fieldset>
          <fieldset>
            <legend>{t('goalsLabel')}</legend>
            <textarea name="goals" value={fields.goals} onChange={handleText} rows={4} placeholder={t('goalsPh')} style={{ width: '100%' }} />
          </fieldset>
          <fieldset>
            <legend>{t('alliesLabel')}</legend>
            <textarea name="allies" value={fields.allies} onChange={handleText} rows={4} placeholder={t('alliesPh')} style={{ width: '100%' }} />
          </fieldset>
          <fieldset>
            <legend>{t('enemiesLabel')}</legend>
            <textarea name="enemies" value={fields.enemies} onChange={handleText} rows={4} placeholder={t('enemiesPh')} style={{ width: '100%' }} />
          </fieldset>
          <fieldset>
            <legend>{t('havensLabel')}</legend>
            <textarea name="havens" value={fields.havens} onChange={handleText} rows={4} placeholder={t('havensPh')} style={{ width: '100%' }} />
          </fieldset>
          <fieldset>
            <legend>{t('territoriesLabel')}</legend>
            <textarea name="territories" value={fields.territories} onChange={handleText} rows={4} placeholder={t('territoriesPh')} style={{ width: '100%' }} />
          </fieldset>
        </div>
      </div>

      {/* ── XP Log ── */}
      <div role="tabpanel" id="tabpanel-12" aria-labelledby="tab-12" hidden={tab !== 12}>
        <XpLogSection
          splat="vampire"
          xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)}
          t={t}
        />
      </div>

      {/* ── Dice Pools ── */}
      <div hidden={tab !== 13}>
        <DicePoolsTab fields={fields} splat="VAMPIRE" characterId={characterId} />
      </div>

      {/* ── Dice Roller ── */}
      <div hidden={tab !== 14}>
        <StorytellerDiceRoller />
      </div>

      {/* ── Save ── */}
      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => navigate('/characters')}>{t('cancel')}</button>
        <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>
          {saving ? t('saving') : t('quickSave')}
        </button>
        <button className="btn btn-primary" onClick={handleDoneEditing} disabled={saving}>
          {t('doneEditing')}
        </button>
      </div>
      {viewMode && (
        <div className="view-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/characters')}>{t('back')}</button>
          <button className="btn btn-primary" onClick={() => navigate(`/characters/${characterId}`, { replace: true })}>{t('edit')}</button>
        </div>
      )}
    </div>
  )
}
