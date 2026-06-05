import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  getCharacter, updateCharacter,
  getBackgrounds, addBackground, updateBackground, removeBackground,
  getMeritCatalog, getFlawCatalog,
  getMerits, getFlaws,
  getInventory,
  getXpLog, addXpLogEntry, removeXpLogEntry,
} from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import MeritsFlawsSection from './MeritsFlawsSection'
import InventorySection from './InventorySection'
import DotRating from './DotRating'
import XpLogSection from './XpLogSection'
import { useLanguage } from '../i18n/LanguageContext'
import ExportModal from './ExportModal'
import CatalogSelect from './CatalogSelect'
import TagInfoPanel from './TagInfoPanel'
import DicePoolsTab from './DicePoolsTab'
import StorytellerDiceRoller from './StorytellerDiceRoller'
import { SECONDARY_TALENTS, SECONDARY_SKILLS, SECONDARY_KNOWLEDGES } from '../data/secondaryAbilities'
import { CHANGELING_BACKGROUNDS as BACKGROUNDS } from '../data/backgrounds'
import SaveButton from './SaveButton'

// ── Constants ──

const SEELIE_LEGACIES = [
  { value: 'Bumpkin', description: 'Common sense and plain dealing are your way.' },
  { value: 'Courtier', description: 'The whirl of politics and intrigue excites you.' },
  { value: 'Crafter', description: 'Making something you are proud of fires your heart.' },
  { value: 'Dandy', description: 'You love setting trends and gaining attention.' },
  { value: 'Hermit', description: 'At your best in solitude; you would rather be left alone.' },
  { value: 'Orchid', description: 'Purity and delicacy have a beauty all their own.' },
  { value: 'Paladin', description: 'You live for the challenge of proving your skill.' },
  { value: 'Panderer', description: 'Making others happy brings you joy.' },
  { value: 'Regent', description: 'Some are born to rule, and you always take charge.' },
  { value: 'Saint', description: 'You seek to alleviate the suffering of others, even when it costs you.' },
  { value: 'Sage', description: 'You are a natural sidekick, the perfect right hand.' },
  { value: 'Squire', description: 'Waking up is good, but it is even better when it is shared.' },
  { value: 'Troubadour', description: 'Life is an art form, and love is its purest medium.' },
  { value: 'Wayfarer', description: 'Why stay in one place when there is so much to see out there?' },
]

const UNSEELIE_LEGACIES = [
  { value: 'Beast', description: 'Nobody ever doubts you twice.' },
  { value: 'Fatalist', description: 'Nothing matters; why can you not see that?' },
  { value: 'Fool', description: 'To make life less serious, no matter what.' },
  { value: 'Grotesque', description: 'You love the thrill of shocking and appalling others.' },
  { value: 'Knave', description: 'A path by the end; you love to see how far others will go.' },
  { value: 'Outlaw', description: 'Rules only get in the way of getting what you want.' },
  { value: 'Pandora', description: 'You love to uncover secrets, even if it is a dangerous idea.' },
  { value: 'Peacock', description: 'As long as everyone realizes you are the best, everything is fine.' },
  { value: 'Rake', description: 'Your appetites will never be sated, but you love to try.' },
  { value: 'Riddler', description: 'Wisdom easily comes; it is worth nothing; anything is easy to come by.' },
  { value: 'Ringleader', description: 'You are the boss, and you make darn sure everyone knows it.' },
  { value: 'Rogue', description: 'Chance is your favorite tune, and you love to play it.' },
  { value: 'Savage', description: 'The natural order reveals who is truly worthy.' },
  { value: 'Wretch', description: 'You find a certain comfort in knowing you are at the bottom.' },
]

const KITHS = [
  // ── Common Kiths ──
  { value: 'Boggan', description: 'Industrious, down-to-earth fae who are swift workers and incredible gossips. Birthright: Craftwork. Frailty: Call of the Needy.' },
  { value: 'Clurichaun', description: 'Leprechaun-kin whose legendary carousing masks fierce Seelie hearts. Birthright: Fighting Finesse. Frailty: Hoard.' },
  { value: 'Eshu', description: 'Storytellers, explorers, and adventurers who always seem to show up just in time. Birthright: Spirit Pathways. Frailty: Recklessness.' },
  { value: 'Nocker', description: 'Eccentric, foul-mouthed inventors who can make whatever they imagine. Birthright: Make It Work. Frailty: Perfect Is the Enemy.' },
  { value: 'Piskie', description: 'Friendly and likeable, if light-fingered fae, with a soft spot for truth. Birthright: Nimble. Frailty: Light Fingers.' },
  { value: 'Pooka', description: 'Masterful shapeshifters and tricksters who never quite tell the whole truth. Birthright: Shapechanging. Frailty: Lies.' },
  { value: 'Redcap', description: 'Menacing and ferocious fighters who can devour literally anything. Birthright: Dark Appetite. Frailty: Bad Attitude.' },
  { value: 'Satyr', description: 'Hedonistic fae spirits who love a good party as well as a good fight. Birthright: Gift of Pan. Frailty: Curse of Pan.' },
  { value: 'Selkie', description: 'Beautiful and charming seal shapeshifters who are closely tied to the sea. Birthright: Seal Form. Frailty: Seal Coat.' },
  { value: 'Sidhe (Arcadian)', description: 'Recently arrived from Arcadia, these regal fae bring majesty and authority but struggle with Banality. Birthright: Awe and Beauty. Frailty: Banality\'s Curse.' },
  { value: 'Sidhe (Autumn)', description: 'Noble leaders who stayed behind when the others fled, earning their place through hardship. Birthright: Awe and Beauty. Frailty: Banality\'s Curse.' },
  { value: 'Sluagh', description: 'Whispering fae who speak with the dead and adore secrets. Birthright: Squirm. Frailty: Whispers.' },
  { value: 'Troll', description: 'Stoic warriors and tireless protectors who will suffer anything to defend those they love. Birthright: Titan\'s Power. Frailty: Bond of Duty.' },
  // ── Rare / Gallain Kiths ──
  { value: 'Ghille Dhu', description: 'Shy forest guardians deeply connected to plant life and the wild places. Reclusive and gentle, they protect nature with fierce devotion. Birthright: Nature\'s Bounty. Frailty: Shyness.' },
  { value: 'Korred', description: 'Stone-skinned fae connected to ancient standing stones and earth magick. Powerful dancers whose stomping shakes the ground. Birthright: Stoneform. Frailty: Stone Curse.' },
  { value: 'Morganed', description: 'Aquatic fae descended from the merfolk of Breton legend. Beautiful and alluring, but bound to the sea. Birthright: Sea\'s Grace. Frailty: Landlocked.' },
  { value: 'Oba', description: 'African fae of regal bearing and spiritual authority. They serve as judges, leaders, and intermediaries with the spirit world. Birthright: Royal Bearing. Frailty: Hubris.' },
  { value: 'Piskies', description: 'Cornish cousins of the Piskies — tiny, mischievous, and irrepressibly curious troublemakers. Birthright: Nimble. Frailty: Light Fingers.' },
  { value: 'River Hag', description: 'Terrifying water fae who haunt rivers and streams. Ancient and fearsome, they guard waterways and drown the unwary. Birthright: River\'s Might. Frailty: Hideousness.' },
  { value: 'Nunnehi', description: 'Native American fae spirits tied to the land itself. They embody the spiritual traditions of many First Nations peoples. Birthright: Spirit Bond. Frailty: Rootbound.' },
  { value: 'Menehune', description: 'Hawaiian nature spirits — tiny, industrious builders who work incredible feats overnight. Masters of craft and construction. Birthright: Night Work. Frailty: Sunlight.' },
  { value: 'Inanimae', description: 'Elemental fae — spirits of stone, water, fire, air, and wood given humanoid form. Ancient and alien in thought. Birthright: Elemental Form. Frailty: Anchor.' },
]

const SEEMINGS = [
  { value: 'Childling', description: 'Young and innocent. Full of wonder. Temper: +1 Glamour.' },
  { value: 'Wilder', description: 'Adolescent fae. Passionate, rebellious, creative. Temper: +1 Glamour or +1 Willpower.' },
  { value: 'Grump', description: 'Adult fae. Experienced but struggling against Banality. Temper: +1 Willpower.' },
]

const COURTS = [
  { value: 'Seelie', description: 'The Court of tradition, honor, and romance.' },
  { value: 'Unseelie', description: 'The Court of change, freedom, and passion.' },
]

const SEELIE_HOUSES = [
  { value: 'Beaumayn', description: 'Haunted seers and monster hunters plagued by visions.' },
  { value: 'Dougal', description: 'Stoic inventors and craftsmen whose bodies become infused with their works.' },
  { value: 'Eiluned', description: 'Talented magicians and investigators whose curiosity often causes trouble.' },
  { value: 'Fiona', description: 'Fearless adventurers and romantics with a notoriously stormy personal lives.' },
  { value: 'Gwydion', description: 'Renowned leaders gifted at detecting lies and ferreting out the truth.' },
  { value: 'Liam', description: 'Tolerant outcasts determined to speak up for commoners and mortals.' },
  { value: 'Scathach', description: 'Mysterious warriors who avoid politics and associate with commoners.' },
]

const UNSEELIE_HOUSES = [
  { value: 'Aesin', description: 'Domineering lords of the wilderness who rule over animals like no others.' },
  { value: 'Ailil', description: 'Master politicians and manipulators, if sometimes too clever for their own good.' },
  { value: 'Balor', description: 'Ruthless warriors and implacable foes marked by Fomorian blood.' },
  { value: 'Daireann', description: 'Consummate hosts and renowned poisoners, prone to ill-timed boasting.' },
  { value: 'Leanhaun', description: 'Fearless artistes and patrons with a vampiric hunger for mortal Glamour.' },
  { value: 'Varich', description: 'Cold and calculating strategists who will get everything on the right plan.' },
]

const ARTS = [
  { value: 'Autumn', description: 'The Art of fear, shadows, and decay. Commands dread and endings.' },
  { value: 'Chicanery', description: 'Perception and memory manipulation. Tricks and misdirection.' },
  { value: 'Chronos', description: 'Manipulation of time, history, and temporal perception.' },
  { value: 'Contract', description: 'Oaths, deals, and binding agreements enforced by the Dreaming.' },
  { value: 'Dragon\'s Ire', description: 'Spectral force of physical prowess. Battle magic of the fae.' },
  { value: 'Legerdemain', description: 'Illusion, sleight of hand, and trickiness. Manipulation of appearances.' },
  { value: 'Metamorphosis', description: 'Shapeshifting and transformation of self and others.' },
  { value: 'Naming', description: 'True names, power over identity. Mastery over what things truly are.' },
  { value: 'Oneiromancy', description: 'Dreams, sleep, and the border between waking and Dreaming.' },
  { value: 'Primal', description: 'Mastery of the elements and the natural world. Ancient and powerful.' },
  { value: 'Pyretics', description: 'Fire, heat, and purification. Commands the power of the flame.' },
  { value: 'Skycraft', description: 'Wind, thunder, and weather. Commands storms and the sky.' },
  { value: 'Soothsay', description: 'Divination, prophecy, and fate. Seeing past, present, and future.' },
  { value: 'Sovereign', description: 'Command, authority, and nobility. The Art of rulership.' },
  { value: 'Spring', description: 'Growth, life, and protection. Channels nature\'s vitality.' },
  { value: 'Summer', description: 'Energy, passion, and light. The Art of high emotion.' },
  { value: 'Wayfare', description: 'Movement, travel, and journey. The Art of going places.' },
  { value: 'Winter', description: 'Cold, ice, and the death of emotion. The Art of endings.' },
]

const REALMS = [
  { value: 'Actor', description: 'Affects mortals, Krisalin, and Prodigals.' },
  { value: 'Fae', description: 'Affects changelings, chimera, and all things of Glamour.' },
  { value: 'Nature', description: 'Affects animals, plants, and natural phenomena.' },
  { value: 'Prop', description: 'Affects devices and man-made items of all kinds.' },
  { value: 'Scene', description: 'Affects large areas or multiple targets at once.' },
  { value: 'Time', description: 'Affects the duration or triggering of cantrips.' },
]

const HEALTH_LEVELS = [
  { key: 'healthBruised',    label: 'bruised',       penalty: '' },
  { key: 'healthHurt',       label: 'hurt',          penalty: '-1' },
  { key: 'healthInjured',    label: 'injured',       penalty: '-1' },
  { key: 'healthWounded',    label: 'wounded',       penalty: '-2' },
  { key: 'healthMauled',     label: 'mauled',        penalty: '-2' },
  { key: 'healthCrippled',   label: 'crippled',      penalty: '-5' },
  { key: 'healthIncap',      label: 'incapacitated', penalty: '' },
]

const TAB_KEYS = [
  'tabIdentity', 'tabAttributes', 'tabAbilities', 'tabSecondaryAbilities',
  'tabArts', 'tabAdvantages', 'tabHealth',
  'tabBackgrounds', 'tabMeritsFlaws', 'tabInventory',
  'tabBackstory', 'tabXpLog', 'tabDicePools', 'tabDiceRoller'
]

const INITIAL = {
  splat: 'CHANGELING', npc: false,
  name: '', altName: '', concept: '', nature: '', demeanor: '',
  clan: '', // Kith
  sect: '', // Seeming
  // Changeling-specific identity fields (stored in existing text fields)
  domainHaven: '', // Court (Seelie/Unseelie)
  pathName: '', // House (for Sidhe)
  derangement1: '', // Seelie Legacy
  derangement2: '', // Unseelie Legacy
  // Attributes
  strength: 1, dexterity: 1, stamina: 1,
  charisma: 1, manipulation: 1, appearance: 1,
  perception: 1, intelligence: 1, wits: 1,
  strengthSpec: '', dexteritySpec: '', staminaSpec: '',
  charismaSpec: '', manipulationSpec: '', appearanceSpec: '',
  perceptionSpec: '', intelligenceSpec: '', witsSpec: '',
  // Talents (C20: Kenning replaces Awareness)
  alertness: 0, athletics: 0, kenning: 0, brawl: 0, empathy: 0,
  expression: 0, intimidation: 0, leadership: 0, streetwise: 0, subterfuge: 0,
  alertnessSpec: '', athleticsSpec: '', kenningSpec: '', brawlSpec: '', empathySpec: '',
  expressionSpec: '', intimidationSpec: '', leadershipSpec: '', streetwiseSpec: '', subterfugeSpec: '',
  // Skills
  animalKen: 0, crafts: 0, drive: 0, etiquette: 0, firearms: 0,
  larceny: 0, melee: 0, performance: 0, stealth: 0, survival: 0,
  animalKenSpec: '', craftsSpec: '', driveSpec: '', etiquetteSpec: '', firearmsSpec: '',
  larcenySpec: '', meleeSpec: '', performanceSpec: '', stealthSpec: '', survivalSpec: '',
  // Knowledges (C20: Enigmas and Gremayre replace Finance and Linguistics)
  academics: 0, computer: 0, enigmas: 0, gremayre: 0, investigation: 0, law: 0,
  medicine: 0, occult: 0, politics: 0, science: 0, technology: 0,
  academicsSpec: '', computerSpec: '', enigmasSpec: '', gremayreSpec: '', investigationSpec: '', lawSpec: '',
  medicineSpec: '', occultSpec: '', politicsSpec: '', scienceSpec: '', technologySpec: '',
  // Glamour, Banality, Willpower
  gnosis: 5, currentGnosis: 5, // Glamour
  quintessence: 0, // Banality
  willpower: 3, currentWillpower: 3,
  // Arts & Realms (stored as comma-separated "Art:Level" pairs)
  sorceryDesc: '',
  // Health
  healthBruised: '', healthHurt: '', healthInjured: '', healthWounded: '', healthMauled: '', healthCrippled: '', healthIncap: '',
  // Notes
  notes: '', backstory: '', appearanceDesc: '', goals: '', allies: '', enemies: '', havens: '', territories: '',
  personalItems: '',
  // Secondary Abilities
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
}

// ── Helpers ──

function parseArtsRealms(str) {
  if (!str) return {}
  const map = {}
  str.split(',').forEach(pair => {
    const [name, lvl] = pair.split(':')
    if (name && lvl) map[name.trim()] = parseInt(lvl) || 0
  })
  return map
}

function serializeArtsRealms(map) {
  return Object.entries(map).filter(([, v]) => v > 0).map(([k, v]) => `${k}:${v}`).join(',')
}

function RatingRow({ abilityKey, specKey, fields, onField, onText, max = 5, t }) {
  return (
    <div className="ability-row">
      <DotRating label={t(abilityKey)} name={abilityKey} value={fields[abilityKey]} onChange={onField} max={max} />
      <input className="spec-input" type="text" name={specKey} value={fields[specKey] ?? ''} onChange={onText}
        placeholder={t('specialty')} aria-label={`${t(abilityKey)} ${t('specialty')}`} />
    </div>
  )
}

function CustomAbilityRow({ nameProp, ratingProp, placeholder, fields, onField, onText, catalog, max = 5 }) {
  const match = catalog?.find(c => c.value === fields[nameProp])
  return (
    <div className="custom-ability-row">
      <input type="text" name={nameProp} value={fields[nameProp]} onChange={onText}
        placeholder={placeholder} aria-label={`${placeholder} name`} className="custom-ability-name"
        list={`${nameProp}-list`} />
      <datalist id={`${nameProp}-list`}>
        {catalog?.map(c => <option key={c.value} value={c.value} />)}
      </datalist>
      <DotRating label="" name={ratingProp} value={fields[ratingProp]} onChange={onField} max={max} />
      {match && <p className="archetype-desc" style={{ gridColumn: '1 / -1' }}>{match.description}</p>}
    </div>
  )
}

// ── Component ──

export default function ChangelingForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const viewMode = searchParams.get('mode') === 'view'
  const characterId = paramId ? Number(paramId) : null

  const { isAutoCreating } = useAutoCreate(characterId, INITIAL)

  const [tab, setTab] = useState(0)
  const [fields, setFields] = useState(INITIAL)
  const [backgrounds, setBackgrounds] = useState([])
  const [merits, setMerits] = useState([])
  const [flaws, setFlaws] = useState([])
  const [meritCatalog, setMeritCatalog] = useState([])
  const [flawCatalog, setFlawCatalog] = useState([])
  const [inventory, setInventory] = useState([])
  const [newBackground, setNewBackground] = useState({ name: '', level: 1, description: '' })
  const [xpLog, setXpLog] = useState([])
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [tagInfo, setTagInfo] = useState(null)
  const [bgSearch, setBgSearch] = useState('')

  useEffect(() => {
    if (characterId) loadCharacter()
    loadCatalogs()
  }, [characterId])

  async function loadCharacter() {
    try {
      const [charRes, bgRes, meritRes, flawRes, invRes, xpRes] = await Promise.all([
        getCharacter(characterId),
        getBackgrounds(characterId),
        getMerits(characterId),
        getFlaws(characterId),
        getInventory(characterId),
        getXpLog(characterId),
      ])
      const data = charRes.data
      setFields(prev => {
        const next = { ...prev }
        for (const k of Object.keys(prev)) if (data[k] != null) next[k] = data[k]
        return next
      })
      setBackgrounds(bgRes.data)
      setMerits(meritRes.data)
      setFlaws(flawRes.data)
      setInventory(invRes.data)
      setXpLog(xpRes.data)
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
    setFields(prev => ({ ...prev, [name]: typeof value === 'string' ? value : Number(value) }))
  }

  function handleText(e) {
    const { name, value, type } = e.target
    handleField(name, type === 'number' ? (parseInt(value) || 0) : value)
  }

  function handleArtRealm(artOrRealm, level) {
    const current = parseArtsRealms(fields.sorceryDesc)
    current[artOrRealm] = level
    const serialized = serializeArtsRealms(current)
    setFields(prev => ({ ...prev, sorceryDesc: serialized }))
  }

  async function handleSave() {
    setSaving(true)
    setSaveError(null)
    try {
      await updateCharacter(characterId, fields)
    } catch (err) {
      setSaveError(err.response?.data?.message || t('failedToSave'))
      throw err
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
      throw err
    } finally { setSaving(false) }
  }

  async function handleAddBackground() {
    if (!newBackground.name.trim() || !characterId) return
    try {
      const res = await addBackground(characterId, newBackground)
      setBackgrounds(prev => [...prev, res.data])
      setNewBackground({ name: '', level: 1, description: '' })
    } catch {}
  }

  const artsRealmsMap = parseArtsRealms(fields.sorceryDesc)

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/characters')}>{t('back')}</button>
        <h2>{fields.name || 'New Changeling'}</h2>
        <span className="splat-badge splat-badge--changeling">Changeling</span>
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}
      {actionError && <p className="status-error" role="alert">{actionError}</p>}

      <div className="tab-list" role="tablist">
        {TAB_KEYS.map((key, i) => (
          <button key={key} role="tab" className={`btn btn-secondary${tab === i ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(i)} aria-selected={tab === i}>{t(key)}</button>
        ))}
      </div>

      {/* ── Identity ── */}
      <div hidden={tab !== 0}>
        <div className="form-section">
          <fieldset>
            <legend>{t('identity')}</legend>
            <div className="field-row">
              <div className="field">
                <label htmlFor="name">{t('charName')} <span aria-hidden="true">*</span></label>
                <input id="name" name="name" type="text" value={fields.name} onChange={handleText} required autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="altName">Fae Name</label>
                <input id="altName" name="altName" type="text" value={fields.altName} onChange={handleText} autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="concept">{t('concept')}</label>
                <input id="concept" name="concept" type="text" value={fields.concept} onChange={handleText} autoComplete="off" />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Changeling</legend>
            <div className="field-row">
              <CatalogSelect id="clan" name="clan" label="Kith" value={fields.clan} onChange={handleField} catalog={KITHS} />
              <CatalogSelect id="sect" name="sect" label="Seeming" value={fields.sect} onChange={handleField} catalog={SEEMINGS} />
              <CatalogSelect id="domainHaven" name="domainHaven" label="Court" value={fields.domainHaven} onChange={handleField} catalog={COURTS} />
            </div>
            {(fields.clan === 'Sidhe (Arcadian)' || fields.clan === 'Sidhe (Autumn)') && (
              <div className="field-row">
                <CatalogSelect id="pathName" name="pathName" label="House" value={fields.pathName} onChange={handleField}
                  catalog={[...SEELIE_HOUSES, ...UNSEELIE_HOUSES]} />
              </div>
            )}
          </fieldset>

          <fieldset>
            <legend>Legacies</legend>
            <p className="muted-hint muted-hint--xs mb-sm" >
              Legacies guide your character's fae personality. Your dominant Legacy is determined by your current Court.
            </p>
            <div className="field-row">
              <CatalogSelect id="derangement1" name="derangement1" label="Seelie Legacy" value={fields.derangement1} onChange={handleField} catalog={SEELIE_LEGACIES} />
              <CatalogSelect id="derangement2" name="derangement2" label="Unseelie Legacy" value={fields.derangement2} onChange={handleField} catalog={UNSEELIE_LEGACIES} />
            </div>
            <div className="field-row">
              <CatalogSelect id="nature" name="nature" label={t('nature')} value={fields.nature} onChange={handleField} catalog={[...SEELIE_LEGACIES, ...UNSEELIE_LEGACIES]} />
              <CatalogSelect id="demeanor" name="demeanor" label={t('demeanor')} value={fields.demeanor} onChange={handleField} catalog={[...SEELIE_LEGACIES, ...UNSEELIE_LEGACIES]} />
            </div>
          </fieldset>

          {fields.sect && (
            <fieldset>
              <legend>{t('seemingEffects')}</legend>
              <p className="muted-hint muted-hint--sm">
                {fields.sect === 'Childling' && t('childlingEffects')}
                {fields.sect === 'Wilder' && t('wilderEffects')}
                {fields.sect === 'Grump' && t('grumpEffects')}
              </p>
            </fieldset>
          )}

          {fields.domainHaven && (
            <fieldset>
              <legend>Court</legend>
              <p className="muted-hint muted-hint--sm">
                {fields.domainHaven === 'Seelie' && 'Your dominant Legacy is your Seelie Legacy. The Seelie Court values tradition, honor, and the preservation of the Dreaming. Your primary Quest and Ban come from your Seelie Legacy.'}
                {fields.domainHaven === 'Unseelie' && 'Your dominant Legacy is your Unseelie Legacy. The Unseelie Court values change, freedom, and passion. Your primary Quest and Ban come from your Unseelie Legacy.'}
              </p>
            </fieldset>
          )}

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
            { legendKey: 'physicalAttr', attrs: ['strength', 'dexterity', 'stamina'] },
            { legendKey: 'socialAttr', attrs: ['charisma', 'manipulation', 'appearance'] },
            { legendKey: 'mentalAttr', attrs: ['perception', 'intelligence', 'wits'] },
          ].map(({ legendKey, attrs }) => (
            <fieldset key={legendKey}>
              <legend>{t(legendKey)}</legend>
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
            <div className="rating-grid">
              {['alertness', 'athletics', 'brawl', 'empathy', 'expression', 'intimidation', 'kenning', 'leadership', 'streetwise', 'subterfuge'].map(a =>
                <RatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} t={t} />
              )}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('skills')}</legend>
            <div className="rating-grid">
              {['animalKen', 'crafts', 'drive', 'etiquette', 'firearms', 'larceny', 'melee', 'performance', 'stealth', 'survival'].map(a =>
                <RatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} t={t} />
              )}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('knowledges')}</legend>
            <div className="rating-grid">
              {['academics', 'computer', 'enigmas', 'gremayre', 'investigation', 'law', 'medicine', 'occult', 'politics', 'science', 'technology'].map(a =>
                <RatingRow key={a} abilityKey={a} specKey={a + 'Spec'} fields={fields} onField={handleField} onText={handleText} t={t} />
              )}
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Secondary Abilities ── */}
      <div role="tabpanel" hidden={tab !== 3}>
        <div className="form-section">
          <div className="abilities-group">
            <fieldset>
              <legend>{t('secondaryTalents')}</legend>
              {Array.from({length: 10}, (_, i) => i + 1).map(n =>
                <CustomAbilityRow key={n} nameProp={`hobbyTalent${n}Name`} ratingProp={`hobbyTalent${n}`} placeholder={t('phHobbyTalent')} fields={fields} onField={handleField} onText={handleText} catalog={SECONDARY_TALENTS} />
              )}
            </fieldset>
            <fieldset>
              <legend>{t('secondarySkills')}</legend>
              {Array.from({length: 10}, (_, i) => i + 1).map(n =>
                <CustomAbilityRow key={n} nameProp={`profSkill${n}Name`} ratingProp={`profSkill${n}`} placeholder={t('phProfSkill')} fields={fields} onField={handleField} onText={handleText} catalog={SECONDARY_SKILLS} />
              )}
            </fieldset>
            <fieldset>
              <legend>{t('secondaryKnowledges')}</legend>
              {Array.from({length: 10}, (_, i) => i + 1).map(n =>
                <CustomAbilityRow key={n} nameProp={`expertKnowl${n}Name`} ratingProp={`expertKnowl${n}`} placeholder={t('phExpertKnowl')} fields={fields} onField={handleField} onText={handleText} catalog={SECONDARY_KNOWLEDGES} />
              )}
            </fieldset>
          </div>
        </div>
      </div>

      {/* ── Arts & Realms ── */}
      <div hidden={tab !== 4}>
        <div className="form-section">
          <fieldset>
            <legend>{t('changelingArts')} ({ARTS.filter(a => (artsRealmsMap[a.value] || 0) > 0).length})</legend>
            <p className="muted-hint muted-hint--xs mb-sm" >
              Arts are the magical abilities of the Kithain. Each Art allows cantrips that affect the world through the Dreaming.
            </p>
            <div className="rating-grid">
              {ARTS.map(art => (
                <div key={art.value} className="ability-row" title={art.description}>
                  <DotRating label={art.value} name={`art-${art.value}`} value={artsRealmsMap[art.value] || 0}
                    onChange={(_, val) => handleArtRealm(art.value, val)} max={5} />
                  {(artsRealmsMap[art.value] || 0) === 0 && (
                    <span className="muted-hint text-sm" style={{ marginLeft: 'var(--space-xs)' }}>{art.description}</span>
                  )}
                </div>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('changelingRealms')}</legend>
            <p className="muted-hint muted-hint--xs mb-sm" >
              Realms determine who or what your Arts can affect. You must have an appropriate Realm to target a cantrip.
            </p>
            <div className="rating-grid">
              {REALMS.map(realm => (
                <div key={realm.value} className="ability-row" title={realm.description}>
                  <DotRating label={realm.value} name={`realm-${realm.value}`} value={artsRealmsMap[realm.value] || 0}
                    onChange={(_, val) => handleArtRealm(realm.value, val)} max={5} />
                  {(artsRealmsMap[realm.value] || 0) === 0 && (
                    <span className="muted-hint text-sm" style={{ marginLeft: 'var(--space-xs)' }}>{realm.description}</span>
                  )}
                </div>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('changelingCustomNotes')}</legend>
            <textarea name="sorceryDesc" value={fields.sorceryDesc} onChange={handleText} rows={4} className="w-full" 
              aria-label="Arts and Realms raw data" placeholder="Raw data (auto-managed by dot ratings above). You may also add custom notes here." />
          </fieldset>
        </div>
      </div>

      {/* ── Advantages (Glamour, Banality, Willpower) ── */}
      <div hidden={tab !== 5}>
        <div className="form-section">
          <fieldset>
            <legend>{t('glamour')}</legend>
            <div className="field-row">
              <DotRating label={t('glamour')} name="gnosis" value={fields.gnosis} onChange={handleField} min={0} max={10} />
              <DotRating label={t('currentGlamour')} name="currentGnosis" value={fields.currentGnosis} onChange={handleField} min={0} max={10} />
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('banality')}</legend>
            <div className="field-row">
              <DotRating label={t('banality')} name="quintessence" value={fields.quintessence} onChange={handleField} min={0} max={10} />
            </div>
            {fields.quintessence >= 10 && (
              <div role="alert" aria-live="assertive" aria-atomic="true" className="mt-sm p-sm font-bold text-center" style={{ background: 'rgba(231,76,60,0.2)', border: '2px solid #e74c3c', borderRadius: '6px', color: '#e74c3c' }}>
                Undone — Character becomes fully mortal. The Dreaming is lost forever.
              </div>
            )}
            {fields.quintessence >= 8 && fields.quintessence < 10 && (
              <div role="alert" aria-live="assertive" aria-atomic="true" className="mt-sm p-sm font-bold" style={{ background: 'rgba(231,76,60,0.15)', border: '2px solid #e74c3c', borderRadius: '6px', color: '#e74c3c' }}>
                Severe — Glamour recovery greatly reduced (Banality {fields.quintessence})
              </div>
            )}
            {fields.quintessence === 7 && (
              <div role="status" aria-live="polite" className="mt-sm p-sm font-semibold" style={{ background: 'rgba(243,156,18,0.15)', border: '2px solid #f39c12', borderRadius: '6px', color: '#f39c12' }}>
                High Banality — Difficulty creating cantrips increased (Banality {fields.quintessence})
              </div>
            )}
          </fieldset>
          <fieldset>
            <legend>{t('willpower')}</legend>
            <div className="field-row">
              <DotRating label={t('permanent')} name="willpower" value={fields.willpower} onChange={handleField} min={1} max={10} />
              <DotRating label={t('temporary')} name="currentWillpower" value={fields.currentWillpower} onChange={handleField} min={0} max={fields.willpower} />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Health ── */}
      <div hidden={tab !== 6}>
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
                {HEALTH_LEVELS.map(h => {
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
                      <td className="text-muted" >{h.penalty || '\u2014'}</td>
                      <td className="font-semibold" style={{ color: dmgColor }}>{dmgLabel}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </fieldset>
        </div>
      </div>

      {/* ── Backgrounds ── */}
      <div hidden={tab !== 7}>
        <div className="form-section">
          <fieldset>
            <legend>{t('backgrounds')} ({backgrounds.length})</legend>
            {backgrounds.length > 0 && (
              <ul className="tag-list mb-md" >
                {backgrounds.map(b => (
                  <li key={b.id} className={`tag tag--clickable${b.id === tagInfo?.id ? ' tag--active' : ''}`}
                    onClick={() => setTagInfo(ti => ti?.id === b.id ? null : { ...b, kind: 'background' })}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTagInfo(ti => ti?.id === b.id ? null : { ...b, kind: 'background' }) } }}
                    role="button" tabIndex={0}>
                    <span className="flex items-center gap-xs flex-wrap" >
                      <strong>{b.name}</strong>
                      <span onClick={e => e.stopPropagation()} style={{ display: 'inline-flex' }}>
                        <DotRating label="" name={`bg-${b.id}`} value={b.level} min={1} max={5}
                          onChange={(_, val) => {
                            updateBackground(characterId, b.id, { level: val }).then(() =>
                              setBackgrounds(prev => prev.map(x => x.id === b.id ? { ...x, level: val } : x))
                            ).catch(() => {})
                          }} />
                      </span>
                    </span>
                    <button className="tag-remove" onClick={e => { e.stopPropagation(); removeBackground(characterId, b.id); setBackgrounds(prev => prev.filter(x => x.id !== b.id)); if (tagInfo?.id === b.id) setTagInfo(null) }}>\u00d7</button>
                  </li>
                ))}
              </ul>
            )}
            {tagInfo?.kind === 'background' && (() => {
              const entry = BACKGROUNDS.find(bg => bg.value.toLowerCase() === tagInfo.name.toLowerCase())
              return (
                <aside className="tag-info-panel mb-md" >
                  <button className="tag-info-panel-close" onClick={() => setTagInfo(null)}>{t('close')}</button>
                  <p className="tag-info-panel-name">{tagInfo.name}</p>
                  <p className="tag-info-panel-desc">Background \u00b7 Level {tagInfo.level}</p>
                  {entry?.description && <p className="text-sm" style={{ lineHeight: 1.55 }}>{entry.description}</p>}
                  {entry?.levels && (
                    <ul className="tag-info-levels">
                      {entry.levels.map((lvl, i) => (
                        <li key={i} className={`tag-info-level${i + 1 === tagInfo.level ? ' tag-info-level--active' : ''}`}>{lvl}</li>
                      ))}
                    </ul>
                  )}
                </aside>
              )
            })()}
          </fieldset>

          <fieldset>
            <legend>Background Catalogue ({BACKGROUNDS.length})</legend>
            <div className="catalog-search-wrap">
              <input type="search" value={bgSearch} onChange={e => setBgSearch(e.target.value)}
                placeholder="Search backgrounds..." aria-label="Search backgrounds" />
              <span className="catalog-search-count">{BACKGROUNDS.filter(b => !bgSearch || b.value.toLowerCase().includes(bgSearch.toLowerCase()) || (b.description || '').toLowerCase().includes(bgSearch.toLowerCase())).length}</span>
            </div>
            <ul className="catalog-list" aria-label="Background catalogue">
              {BACKGROUNDS
                .filter(b => !bgSearch || b.value.toLowerCase().includes(bgSearch.toLowerCase()) || (b.description || '').toLowerCase().includes(bgSearch.toLowerCase()))
                .map(b => {
                  const already = backgrounds.some(bg => bg.name.toLowerCase() === b.value.toLowerCase())
                  return (
                    <li key={b.value} className={`catalog-item${already ? ' catalog-item--added' : ''}`}>
                      <button className="catalog-item-btn" onClick={() => {
                        if (!already) {
                          addBackground(characterId, { name: b.value, level: 1, description: '' })
                            .then(res => setBackgrounds(prev => [...prev, res.data]))
                            .catch(() => setActionError(t('failedToSave')))
                        } else {
                          const bg = backgrounds.find(bg => bg.name.toLowerCase() === b.value.toLowerCase())
                          if (bg) setTagInfo(ti => ti?.id === bg.id ? null : { ...bg, kind: 'background' })
                        }
                      }}>
                        <div className="catalog-item-main">
                          <span className="catalog-item-name">{b.value}</span>
                          {b.description && <span className="catalog-item-desc">{b.description}</span>}
                        </div>
                        <div className="catalog-item-meta">
                          {already ? <span className="catalog-item-check">{'\u2713'}</span> : <span className="catalog-item-add">+</span>}
                        </div>
                      </button>
                    </li>
                  )
                })}
            </ul>
          </fieldset>
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

      {/* ── Backstory ── */}
      <div hidden={tab !== 10}>
        <div className="form-section">
          <fieldset>
            <legend>{t('backstoryLabel')}</legend>
            <textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} placeholder={t('backstoryPh')} className="w-full"  />
          </fieldset>
          <fieldset>
            <legend>{t('appearanceLabel')}</legend>
            <textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={4} placeholder={t('appearancePh')} className="w-full"  />
          </fieldset>
          <fieldset>
            <legend>{t('goalsLabel')}</legend>
            <textarea name="goals" value={fields.goals} onChange={handleText} rows={4} placeholder={t('goalsPh')} className="w-full"  />
          </fieldset>
          <fieldset>
            <legend>{t('alliesLabel')}</legend>
            <textarea name="allies" value={fields.allies} onChange={handleText} rows={4} placeholder={t('alliesPh')} className="w-full"  />
          </fieldset>
          <fieldset>
            <legend>{t('enemiesLabel')}</legend>
            <textarea name="enemies" value={fields.enemies} onChange={handleText} rows={4} placeholder={t('enemiesPh')} className="w-full"  />
          </fieldset>
          <fieldset>
            <legend>{t('havensLabel')}</legend>
            <textarea name="havens" value={fields.havens} onChange={handleText} rows={4} placeholder={t('havensPh')} className="w-full"  />
          </fieldset>
          <fieldset>
            <legend>{t('territoriesLabel')}</legend>
            <textarea name="territories" value={fields.territories} onChange={handleText} rows={4} placeholder={t('territoriesPh')} className="w-full"  />
          </fieldset>
        </div>
      </div>

      {/* ── XP Log ── */}
      <div hidden={tab !== 11}>
        <XpLogSection
          splat="changeling"
          xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)}
          t={t}
        />
      </div>

      {/* ── Dice Pools ── */}
      <div hidden={tab !== 12}>
        <DicePoolsTab fields={fields} splat="CHANGELING" characterId={characterId} />
      </div>

      {/* ── Dice Roller ── */}
      <div hidden={tab !== 13}>
        <StorytellerDiceRoller />
      </div>

      {/* ── Save ── */}
      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => setShowExport(true)}>{t('exportPdf')}</button>
        <button className="btn btn-secondary" onClick={() => navigate('/characters')}>{t('cancel')}</button>
        <SaveButton onSave={handleSave} disabled={saving} t={t} />
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
      <ExportModal open={showExport} onClose={() => setShowExport(false)} tabKeys={TAB_KEYS} t={t} />
    </div>
  )
}
