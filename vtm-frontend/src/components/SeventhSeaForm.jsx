import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  getCharacter, updateCharacter,
  getBackgrounds, addBackground, removeBackground,
  getXpLog, addXpLogEntry, removeXpLogEntry,
  getDisciplines, addDiscipline, removeDiscipline,
} from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import CatalogSelect from './CatalogSelect'
import DotRating from './DotRating'
import XpLogSection from './XpLogSection'
import { useLanguage } from '../i18n/LanguageContext'
import ExportModal from './ExportModal'
import { useTheme } from '../context/ThemeContext'
import TagInfoPanel from './TagInfoPanel'
import RulesReferenceTab from './RulesReferenceTab'
import { SEVEN_SEA_RULES } from '../data/sevenSeaRules'
import SeventhSeaDiceRoller from './SeventhSeaDiceRoller'
import { SEVEN_SEA_HERO_NPCS, SEVEN_SEA_HERO_CATALOG } from '../data/sevenSeaNpcs'
import {
  SEVEN_SEA_NATIONS, SEVEN_SEA_ADVANTAGES,
  BACKGROUNDS as SEVEN_SEA_BACKGROUNDS,
  DUELING_STYLES as SEVEN_SEA_DUELING_STYLES,
  SECRET_SOCIETIES as SEVEN_SEA_SECRET_SOCIETIES,
  ARCANA as SEVEN_SEA_ARCANA,
  getAllArcana, getAllRegions, getAllSources,
} from '../data/sevenSeaData'

// ── Derived data from imported data file ──
const NATIONS = Object.fromEntries(SEVEN_SEA_NATIONS.map(n => [n.value, n.traits]))

const RELIGION_CATALOG = [
  { value: 'Vaticine Church', description: 'The dominant faith of Th\u00e9ah. Worships Theus and the Prophets. Opposes sorcery.' },
  { value: 'Objectionism', description: 'Protestant reformation of the Vaticine Church. Rejects Papal authority and embraces reason.' },
  { value: 'Ussuran Orthodox', description: 'Ussuran branch of the Vaticine faith. Emphasizes Matushka (Mother Nature) alongside Theus.' },
  { value: 'Die Kreuzritter', description: 'Secretive holy order of monster hunters. Ancient knights fighting supernatural threats.' },
  { value: 'Crescent Faith', description: 'The faith of the Crescent Empire. Monotheistic, scholarly, emphasizes justice and learning.' },
  { value: 'Old Vestenmannavnjar Faith', description: 'Ancient Norse-inspired religion. Worships the old gods through rune magic and sagas.' },
  { value: 'Sidhe Worship', description: 'Avalon folk religion venerating the Sidhe (fae). Tied to Glamour sorcery.' },
  { value: 'Losejas', description: 'Vodacce folk mysticism. Tied to Sorte witchcraft and fate-reading traditions.' },
  { value: 'Agnosticism', description: 'Skeptical of organized religion. Common among scholars and freethinkers.' },
  { value: 'Atheism', description: 'Rejects divine authority entirely. Rare and socially dangerous in most nations.' },
]

const NATION_CATALOG = SEVEN_SEA_NATIONS.map(n => ({
  value: n.value,
  description: `${n.region}${n.sorcery ? ` \u2014 Sorcery: ${n.sorcery}` : ''}. Traits: +1 ${n.traits[0]} or ${n.traits[1]}.`,
  region: n.region,
  source: n.source,
}))

// ── Sorcery types by nation (derived from imported data) ──
const SORCERIES = Object.fromEntries(
  SEVEN_SEA_NATIONS.filter(n => n.sorcery).map(n => [n.value, n.sorcery])
)

const SORCERY_INFO = {
  'Glamour': { nation: 'Avalon / Inismore / Highland Marches', description: 'The Knights of Avalon channel the power of legendary heroes through the Sidhe. By bonding with a legendary Knight, you gain access to their Glamour \u2014 supernatural abilities tied to their legend. At Rank 1, you bond with one Knight; at Rank 2, you bond with a second. Each Knight grants specific powers based on their legend.' },
  'Hexenwerk': { nation: 'Eisen', description: 'Dark alchemy involving Unguents \u2014 potions brewed from disturbing ingredients like corpse-parts, blood, and monster ichor. At Rank 1, you know 3 Unguents; at Rank 2, you know 6. Unguents can grant night-vision, inhuman strength, protection from harm, or raise the dead briefly.' },
  'Port\u00e9': { nation: 'Montaigne', description: 'Blood magic that tears holes in reality. A Port\u00e9 sorcerer marks objects with their blood, then rips open a Porte to pull the item through space \u2014 or walks through the Porte to travel instantly. At Rank 1, you can pull Blooded objects to you. At Rank 2, you can create Walks (portals for travel). The Walkway between portals is a terrifying void.' },
  'Sanderis': { nation: 'Sarmatian Commonwealth', description: 'Pact magic with Losejai \u2014 powerful devils. The sorcerer trades Deals with their Dievas, gaining supernatural abilities in exchange for obligations. You and your Dievas are locked in a quiet war: you seek its true name to destroy it, while it tries to corrupt you. At Rank 1, you have 1 Deal; at Rank 2, you have 3 Deals.' },
  'Dar Matushki': { nation: 'Ussura', description: 'Mother\'s Touch \u2014 gifts from Matushka, the living spirit of Ussura. Ussurans who accept Matushka\'s guidance gain the ability to speak with animals, shapeshift, endure any weather, or command the land itself. At Rank 1, you gain 2 Gifts; at Rank 2, you gain 4 Gifts. Matushka\'s power only works on Ussuran soil.' },
  'Sorte': { nation: 'Vodacce', description: 'Fate witchery, practiced only by Vodacce women. Sorte strega can see the Strands of Fate connecting all people \u2014 strands of Cups (love), Coins (wealth), Swords (conflict), and Staves (authority). At Rank 1, you can Read strands. At Rank 2, you can Weave them, pulling or pushing fate. Manipulating fate always has consequences.' },
  'Galdr': { nation: 'Vestenmennavenjar', description: 'Rune magic of the ancient Vesten. By inscribing sacred runes on objects, weapons, or living skin, the Galdr sorcerer invokes the power of the old gods. At Rank 1, you know 3 Runes; at Rank 2, you know 6. Runes can be permanent inscriptions or temporary invocations.' },
  'Alquimia': { nation: 'Castille', description: 'The sacred science of transformation. Castillian alchemists study the elements and transmute matter through faith and reason. They create elixirs, transform materials, and channel elemental forces. Purchase as an Advantage.' },
}

// ── Advantages catalogue (from imported data \u2014 all supplements) ──
const ADVANTAGES = SEVEN_SEA_ADVANTAGES
const ALL_ADV_SOURCES = [...new Set(SEVEN_SEA_ADVANTAGES.map(a => a.source))]
const ALL_BG_SOURCES = [...new Set(SEVEN_SEA_BACKGROUNDS.map(b => b.source))]
const ALL_NATION_REGIONS = [...new Set(SEVEN_SEA_NATIONS.map(n => n.region))]

// ── Arcana-derived virtues and hubrises (from imported data \u2014 all supplements) ──
const ALL_ARCANA = getAllArcana()
const VIRTUES = ALL_ARCANA.map(a => `${a.card} \u2014 ${a.virtue.name}: ${a.virtue.effect}`)
const HUBRISES = ALL_ARCANA.map(a => `${a.card} \u2014 ${a.hubris.name}: ${a.hubris.effect}`)

// ── Backgrounds catalogue (from imported data \u2014 all supplements) ──
const BACKGROUND_CATALOG = SEVEN_SEA_BACKGROUNDS

// ── Secret Societies (from imported data \u2014 all supplements) ──
const SECRET_SOCIETIES = SEVEN_SEA_SECRET_SOCIETIES.map(s => ({ value: s.name, description: s.description, hierarchy: s.hierarchy || null, joining: s.joining || null, source: s.source }))

// ── Dueling Styles (from imported data \u2014 all supplements) ──
const DUELING_STYLES = SEVEN_SEA_DUELING_STYLES

const VIRTUE_CATALOG = VIRTUES.map(v => ({ value: v, description: v.split(' \u2014 ')[1] || '' }))
const HUBRIS_CATALOG = HUBRISES.map(h => ({ value: h, description: h.split(' \u2014 ')[1] || '' }))

// Map dueling style name to primary trait used (from imported data)
const DUELING_STYLE_TRAIT = Object.fromEntries(SEVEN_SEA_DUELING_STYLES.map(s => [s.name, s.trait]))

// ── Skill name → field key mapping (for background auto-apply) ──
const SKILL_NAME_TO_KEY = {
  'Aim': 'skillAim', 'Athletics': 'skillAthletics7s', 'Brawl': 'skillBrawl7s',
  'Convince': 'skillConvince', 'Empathy': 'skillEmpathy7s', 'Hide': 'skillHide',
  'Intimidate': 'skillIntimidate7s', 'Notice': 'skillNotice', 'Perform': 'skillPerform7s',
  'Ride': 'skillRide7s', 'Sailing': 'skillSailing', 'Scholarship': 'skillScholarship',
  'Tempt': 'skillTempt', 'Theft': 'skillTheft', 'Warfare': 'skillWarfare', 'Weaponry': 'skillWeaponry',
}

// ── Nation → Religion mapping (for auto-suggest) ──
const NATION_RELIGIONS = {
  'Avalon': ['Objectionism', 'Sidhe Worship'],
  'Inismore': ['Sidhe Worship', 'Vaticine Church'],
  'Highland Marches': ['Objectionism', 'Sidhe Worship'],
  'Castille': ['Vaticine Church'],
  'Montaigne': ['Vaticine Church', 'Objectionism'],
  'Eisen': ['Objectionism', 'Vaticine Church'],
  'Vodacce': ['Vaticine Church', 'Losejas'],
  'Ussura': ['Ussuran Orthodox'],
  'Vestenmennavenjar': ['Old Vestenmannavnjar Faith', 'Vaticine Church'],
  'Sarmatian Commonwealth': ['Vaticine Church', 'Objectionism'],
  'Numa': ['Vaticine Church', 'Agnosticism'],
  'Pirate Nations': ['Agnosticism', 'Vaticine Church'],
  'Atabean Trading Company': ['Vaticine Church', 'Crescent Faith'],
  'Rahuri': ['Crescent Faith'],
  'Ifrian': ['Crescent Faith'],
}

const INITIAL = {
  npc: false, splat: 'SEVENTH_SEA',
  name: '', altName: '', concept: '',
  nation: '', religion: '',
  nature: '', demeanor: '',
  traitBrawn: 2, traitFinesse: 2, traitResolve: 2, traitWits7s: 2, traitPanache: 2,
  skillAim: 0, skillAthletics7s: 0, skillBrawl7s: 0, skillConvince: 0,
  skillEmpathy7s: 0, skillHide: 0, skillIntimidate7s: 0, skillNotice: 0,
  skillPerform7s: 0, skillRide7s: 0, skillSailing: 0, skillScholarship: 0,
  skillTempt: 0, skillTheft: 0, skillWarfare: 0, skillWeaponry: 0,
  heroVirtue: '', heroHubris: '',
  sorceryDesc: '',
  heroPoints: 1, wealth7s: 0, corruption: 0, dramaticWounds: 0,
  willpower: 0, currentWillpower: 0,
  heroStories: '', backstory: '', notes: '', appearanceDesc: '', personalItems: '',
}

const TAB_KEYS = ['tabIdentity', 'tab7sTraits', 'tab7sSkills', 'tab7sAdvantages', 'tab7sSorcery', 'tab7sDueling', 'tab7sArcana', 'tab7sResources', 'tab7sBackgrounds', 'tab7sSecretSocieties', 'tab7sStories', 'tab7sBelongings', 'tabBackstory', 'tabXpLog', 'tabRulesRef', 'tabDiceRoller']

const TRAIT_KEYS = ['traitBrawn', 'traitFinesse', 'traitResolve', 'traitWits7s', 'traitPanache']
const TRAIT_LABEL = { traitBrawn: 'Brawn', traitFinesse: 'Finesse', traitResolve: 'Resolve', traitWits7s: 'Wits', traitPanache: 'Panache' }
const TRAIT_NAME_TO_KEY = { 'Brawn': 'traitBrawn', 'Finesse': 'traitFinesse', 'Resolve': 'traitResolve', 'Wits': 'traitWits7s', 'Panache': 'traitPanache' }

// Story step \u2192 reward tier mapping
const STORY_REWARD_TIERS = [
  { steps: 1, reward: '1-pt Advantage or new Skill Rank' },
  { steps: 2, reward: '2-pt Advantage' },
  { steps: 3, reward: '3-pt Advantage' },
  { steps: 4, reward: '4-pt Advantage' },
  { steps: 5, reward: '5-pt Advantage or +1 to a Trait' },
]
const SKILL_KEYS = [
  'skillAim', 'skillAthletics7s', 'skillBrawl7s', 'skillConvince',
  'skillEmpathy7s', 'skillHide', 'skillIntimidate7s', 'skillNotice',
  'skillPerform7s', 'skillRide7s', 'skillSailing', 'skillScholarship',
  'skillTempt', 'skillTheft', 'skillWarfare', 'skillWeaponry',
]

// Guided creation budgets (7th Sea 2e: 2 free + 1 from nation = 3 total bonus)
const TRAIT_BUDGET = 2
const SKILL_BUDGET = 10
const ADVANTAGE_BUDGET = 5

export default function SeventhSeaForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const [searchParams] = useSearchParams()
  const viewMode = searchParams.get('mode') === 'view'
  const guidedMode = searchParams.get('mode') === 'guided'
  const characterId = paramId || null

  useEffect(() => { switchTheme('7thsea') }, [])

  const { isAutoCreating } = useAutoCreate(characterId, INITIAL)

  const [tab, setTab] = useState(0)
  const [fields, setFields] = useState(INITIAL)
  const [backgrounds, setBackgrounds] = useState([])
  const [disciplines, setDisciplines] = useState([])
  const [xpLog, setXpLog] = useState([])
  const [newBackground, setNewBackground] = useState({ name: '', level: 1, description: '' })
  const [newAdv, setNewAdv] = useState({ name: '', level: 1, notes: '' })
  const [tagInfo, setTagInfo] = useState(null)
  const [advSearch, setAdvSearch] = useState('')
  const [bgSearch, setBgSearch] = useState('')
  const [activeDuelStyle, setActiveDuelStyle] = useState('')
  const [newStory, setNewStory] = useState({ title: '', goal: '', reward: '', steps: '' })
  const [templateName, setTemplateName] = useState('')
  const [nationBonusTrait, setNationBonusTrait] = useState(null) // which trait got the +1
  const [wounds, setWounds] = useState(0) // regular wounds counter
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [advSourceFilter, setAdvSourceFilter] = useState('')
  const [bgSourceFilter, setBgSourceFilter] = useState('')
  const [nationRegionFilter, setNationRegionFilter] = useState('')
  const [bgAutoApplyMsg, setBgAutoApplyMsg] = useState(null)

  useEffect(() => {
    if (characterId) loadCharacter()
  }, [characterId])

  async function loadCharacter() {
    try {
      const [charRes, bgRes, discRes, xpRes] = await Promise.all([
        getCharacter(characterId), getBackgrounds(characterId), getDisciplines(characterId),
        getXpLog(characterId),
      ])
      const data = charRes.data
      setFields(prev => {
        const merged = { ...prev }
        for (const key in prev) { if (data[key] !== undefined && data[key] !== null) merged[key] = data[key] }
        return merged
      })
      setBackgrounds(bgRes.data)
      setDisciplines(discRes.data)
      setXpLog(xpRes.data)
    } catch { setSaveError(t('failedToLoad')) }
    finally { setLoading(false) }
  }

  function handleField(name, value) {
    // When nation changes, revert old bonus and clear picker
    if (name === 'nation') {
      if (nationBonusTrait) {
        const key = TRAIT_NAME_TO_KEY[nationBonusTrait]
        if (key) setFields(prev => ({ ...prev, [key]: Math.max(2, prev[key] - 1), [name]: typeof value === 'string' ? value : Number(value) }))
        else setFields(prev => ({ ...prev, [name]: typeof value === 'string' ? value : Number(value) }))
        setNationBonusTrait(null)
        return
      }
    }
    setFields(prev => ({ ...prev, [name]: typeof value === 'string' ? value : Number(value) }))
  }
  function handleText(e) { setFields(prev => ({ ...prev, [e.target.name]: e.target.value })) }

  // Apply national trait bonus
  function applyNationBonus(traitName) {
    // Revert old bonus if any
    if (nationBonusTrait) {
      const oldKey = TRAIT_NAME_TO_KEY[nationBonusTrait]
      if (oldKey) setFields(prev => ({ ...prev, [oldKey]: Math.max(2, prev[oldKey] - 1) }))
    }
    // Apply new bonus
    const newKey = TRAIT_NAME_TO_KEY[traitName]
    if (newKey) {
      setFields(prev => ({ ...prev, [newKey]: Math.min(5, prev[newKey] + 1) }))
      setNationBonusTrait(traitName)
    }
  }

  async function handleSave() {
    setSaving(true); setSaveError(null)
    try { await updateCharacter(characterId, fields) }
    catch { setSaveError(t('failedToSave')) }
    finally { setSaving(false) }
  }

  async function handleDoneEditing() { await handleSave(); navigate('/7thsea') }

  function loadTemplate(templateNameVal) {
    const tmpl = SEVEN_SEA_HERO_NPCS.find(t => t.name === templateNameVal)
    if (!tmpl) return
    setTemplateName(templateNameVal)
    setFields(prev => ({
      ...prev,
      name: tmpl.name,
      concept: tmpl.description || '',
      nation: tmpl.nation || '',
      traitBrawn: tmpl.brawn || 2,
      traitFinesse: tmpl.finesse || 2,
      traitResolve: tmpl.resolve || 2,
      traitWits7s: tmpl.wits || 2,
      traitPanache: tmpl.panache || 2,
      heroVirtue: tmpl.virtue || '',
      heroHubris: tmpl.hubris || '',
      backstory: tmpl.backstory || '',
      notes: tmpl.notes || '',
    }))
  }

  async function handleAddBackground() {
    if (!newBackground.name.trim()) return
    try {
      const res = await addBackground(characterId, newBackground)
      setBackgrounds(prev => [...prev, res.data])
      setNewBackground({ name: '', level: 1, description: '' })
    } catch { setActionError(t('failedToSave')) }
  }

  // Background auto-apply: add advantages and increment skills
  async function handleAddBackgroundFromCatalog(bgEntry) {
    try {
      const res = await addBackground(characterId, { name: bgEntry.name, level: 1, description: '' })
      setBackgrounds(prev => [...prev, res.data])

      const applied = { skills: [], advantages: [] }

      // Auto-increment skills (cap at 5)
      if (bgEntry.skills && bgEntry.skills.length > 0) {
        setFields(prev => {
          const updated = { ...prev }
          for (const skillName of bgEntry.skills) {
            const key = SKILL_NAME_TO_KEY[skillName]
            if (key && updated[key] < 5) {
              updated[key] = updated[key] + 1
              applied.skills.push(skillName)
            }
          }
          return updated
        })
      }

      // Auto-add advantages
      if (bgEntry.advantages && bgEntry.advantages.length > 0) {
        for (const advName of bgEntry.advantages) {
          const hit = ADVANTAGES.find(a => a.name.toLowerCase() === advName.toLowerCase())
          if (hit) {
            try {
              const advRes = await addDiscipline(characterId, { name: hit.name, level: hit.cost, notes: '' })
              setDisciplines(prev => [...prev, advRes.data])
              applied.advantages.push(`${hit.name} (${hit.cost}pt)`)
            } catch { /* skip duplicates silently */ }
          }
        }
        // Reload disciplines to ensure sync
        try {
          const discRes = await getDisciplines(characterId)
          setDisciplines(discRes.data)
        } catch { /* non-critical */ }
      }

      // Show confirmation message
      const parts = []
      if (applied.skills.length > 0) parts.push(`Skills +1: ${applied.skills.join(', ')}`)
      if (applied.advantages.length > 0) parts.push(`Advantages: ${applied.advantages.join(', ')}`)
      if (parts.length > 0) {
        setBgAutoApplyMsg(`${bgEntry.name} applied -- ${parts.join('. ')}`)
        setTimeout(() => setBgAutoApplyMsg(null), 6000)
      }
    } catch { setActionError(t('failedToSave')) }
  }

  async function handleAddAdvantage() {
    if (!newAdv.name.trim()) return
    try {
      const hit = ADVANTAGES.find(a => a.name === newAdv.name)
      const adv = hit ? { name: hit.name, level: hit.cost, notes: '' } : newAdv
      const res = await addDiscipline(characterId, adv)
      setDisciplines(prev => [...prev, res.data])
      setNewAdv({ name: '', level: 1, notes: '' })
    } catch { setActionError(t('failedToSave')) }
  }

  // ── Story helpers ──
  function parseStories(text) {
    if (!text) return []
    const stories = []
    let current = null
    for (const line of text.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed) continue
      if (trimmed.match(/^Story \d+:|^###|^---/) || (!current && trimmed)) {
        if (current) stories.push(current)
        current = { title: trimmed.replace(/^Story \d+:\s*/, '').replace(/^###\s*/, ''), lines: [] }
      } else if (current) {
        current.lines.push(trimmed)
      }
    }
    if (current) stories.push(current)
    return stories
  }
  const parsedStories = parseStories(fields.heroStories)

  function handleAddStory() {
    if (!newStory.title.trim()) return
    const stepLines = newStory.steps ? newStory.steps.split('\n').filter(s => s.trim()).map((s, i) => `  Step ${i + 1}: ${s.trim()}`).join('\n') : ''
    const block = `Story ${parsedStories.length + 1}: ${newStory.title}\nGoal: ${newStory.goal}\nReward: ${newStory.reward}${stepLines ? '\n' + stepLines : ''}`
    const current = fields.heroStories || ''
    setFields(prev => ({ ...prev, heroStories: current ? current + '\n\n' + block : block }))
    setNewStory({ title: '', goal: '', reward: '', steps: '' })
  }

  function handleRemoveStory(index) {
    const blocks = (fields.heroStories || '').split(/\n\n+/)
    blocks.splice(index, 1)
    setFields(prev => ({ ...prev, heroStories: blocks.join('\n\n') }))
  }

  // ── Guided mode budget trackers ──
  const traitSpent = TRAIT_KEYS.reduce((sum, k) => sum + (fields[k] - 2), 0)
  const skillSpent = SKILL_KEYS.reduce((sum, k) => sum + fields[k], 0)
  const advSpent = disciplines.reduce((sum, d) => sum + (d.level || 0), 0)

  function PointsBudget({ spent, budget }) {
    const remaining = budget - spent
    const cls = remaining > 0 ? 'points-remaining--ok' : remaining < 0 ? 'points-remaining--over' : 'points-remaining--done'
    const text = remaining >= 0
      ? t('pointsRemaining').replace('{0}', remaining)
      : t('pointsOver').replace('{0}', Math.abs(remaining))
    return budget > 0 ? <span className={`points-remaining ${cls}`}>{text}</span> : null
  }

  // Nation trait bonus info
  const nationTraits = fields.nation && NATIONS[fields.nation] ? NATIONS[fields.nation] : null
  const nationSorcery = fields.nation && SORCERIES[fields.nation] ? SORCERIES[fields.nation] : null

  // Filtered catalogs based on source/region filters
  const filteredNationCatalog = nationRegionFilter
    ? NATION_CATALOG.filter(n => n.region === nationRegionFilter)
    : NATION_CATALOG
  const filteredAdvantages = advSourceFilter
    ? ADVANTAGES.filter(a => a.source === advSourceFilter)
    : ADVANTAGES
  const filteredBackgrounds = bgSourceFilter
    ? BACKGROUND_CATALOG.filter(b => b.source === bgSourceFilter)
    : BACKGROUND_CATALOG

  // ── Religion auto-suggest: reorder based on nation ──
  const recommendedReligions = fields.nation && NATION_RELIGIONS[fields.nation] ? NATION_RELIGIONS[fields.nation] : []
  const sortedReligionCatalog = recommendedReligions.length > 0
    ? [
        ...RELIGION_CATALOG.filter(r => recommendedReligions.includes(r.value)).map(r => ({ ...r, recommended: true })),
        ...RELIGION_CATALOG.filter(r => !recommendedReligions.includes(r.value)),
      ]
    : RELIGION_CATALOG

  // ── Background → Advantage synergy: collect recommended advantages from selected backgrounds ──
  const bgRecommendedAdvantages = new Set()
  for (const bg of backgrounds) {
    const entry = BACKGROUND_CATALOG.find(b => b.name.toLowerCase() === bg.name.toLowerCase())
    if (entry?.advantages) entry.advantages.forEach(a => bgRecommendedAdvantages.add(a.toLowerCase()))
  }

  // ── Virtue / Hubris effect parsing ──
  const virtueEffect = fields.heroVirtue ? fields.heroVirtue.split(' \u2014 ')[1] || '' : ''
  const hubrisEffect = fields.heroHubris ? fields.heroHubris.split(' \u2014 ')[1] || '' : ''

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/7thsea')}>{t('back')}</button>
        <h2>{fields.name || t('edit7sHero')}</h2>
        <span className="splat-badge splat-badge--seventh-sea">{t('seventhSea')}</span>
        {guidedMode && <span className="splat-badge">{t('guidedCreation')}</span>}
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}
      {actionError && <p className="status-error" role="alert">{actionError}</p>}

      <div className="tab-list" role="tablist">
        {TAB_KEYS.map((tk, i) => (
          <button key={tk} role="tab" id={`tab-${i}`} className={`btn btn-secondary${tab === i ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(i)} aria-selected={tab === i} aria-controls={`tabpanel-${i}`}>{t(tk)}</button>
        ))}
      </div>

      {/* \u2500\u2500 Identity \u2500\u2500 */}
      <div role="tabpanel" id={`tabpanel-0`} aria-labelledby={`tab-0`} hidden={tab !== 0}>
        <div className="form-section">
          {!viewMode && (
            <fieldset>
              <legend>{t('7sLoadTemplate')}</legend>
              <CatalogSelect
                id="hero-template" name="heroTemplate" label={t('7sPremadeHero')}
                value={templateName} onChange={(_, val) => loadTemplate(val)}
                catalog={SEVEN_SEA_HERO_CATALOG} placeholder="Search hero templates..."
                showDescOnSelect={false}
              />
              {templateName && (
                <p className="muted-hint muted-hint--xs" style={{ marginTop: 'var(--space-xs)', color: 'var(--color-accent-fg)' }}>
                  Loaded from template: <strong>{templateName}</strong> \u2014 customize freely below.
                </p>
              )}
            </fieldset>
          )}

          <fieldset>
            <legend>{t('tabIdentity')}</legend>
            <div className="field-row">
              <div className="field"><label>{t('charName')} *</label><input name="name" value={fields.name} onChange={handleText} /></div>
              <div className="field"><label>{t('concept')}</label><input name="concept" value={fields.concept} onChange={handleText} /></div>
            </div>
            <div className="field-row" style={{ alignItems: 'flex-end' }}>
              <CatalogSelect id="nation" name="nation" label={t('7sNation')} value={fields.nation}
                onChange={handleField} catalog={filteredNationCatalog} />
              <div className="field" style={{ maxWidth: 180 }}>
                <label style={{ fontSize: '0.78rem' }}>Region</label>
                <select value={nationRegionFilter} onChange={e => setNationRegionFilter(e.target.value)} style={{ fontSize: '0.82rem' }}>
                  <option value="">All Regions ({NATION_CATALOG.length})</option>
                  {ALL_NATION_REGIONS.map(r => <option key={r} value={r}>{r} ({NATION_CATALOG.filter(n => n.region === r).length})</option>)}
                </select>
              </div>
            </div>
            <div className="field-row">
              <CatalogSelect id="religion" name="religion" label={t('7sReligion')} value={fields.religion}
                onChange={handleField} catalog={sortedReligionCatalog.map(r => ({
                  ...r,
                  description: r.recommended ? `[Recommended for ${fields.nation}] ${r.description}` : r.description,
                }))} />
              {recommendedReligions.length > 0 && !fields.religion && (
                <p className="muted-hint muted-hint--xs" style={{ marginTop: 'var(--space-xs)', color: 'var(--color-accent-fg)' }}>
                  Recommended for {fields.nation}: {recommendedReligions.join(', ')}
                </p>
              )}
            </div>
            {nationTraits && (
              <div style={{ marginBottom: 'var(--space-sm)' }}>
                <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}>
                  {fields.nation}: +1 to {nationTraits[0]} or {nationTraits[1]}.
                  {nationSorcery && ` Sorcery: ${nationSorcery}.`}
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Apply national +1:</span>
                  {nationTraits.map(trait => (
                    <button key={trait} type="button"
                      className={`btn btn-secondary${nationBonusTrait === trait ? ' tab-btn--active' : ''}`}
                      style={{ fontSize: '0.78rem', padding: '2px 10px' }}
                      aria-pressed={nationBonusTrait === trait}
                      onClick={() => applyNationBonus(trait)}>
                      {trait}{nationBonusTrait === trait ? ' (applied)' : ''}
                    </button>
                  ))}
                  {nationBonusTrait && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-accent-fg)' }}>
                      +1 {nationBonusTrait} applied
                    </span>
                  )}
                </div>
              </div>
            )}
            <div className="field-row">
              <div className="field">
                <label>{t('type')}</label>
                <div className="role-toggle" role="radiogroup">
                  <button type="button" className={`role-toggle-btn${!fields.npc ? ' role-toggle-btn--active' : ''}`} onClick={() => handleField('npc', false)}>{t('pc')}</button>
                  <button type="button" className={`role-toggle-btn${fields.npc ? ' role-toggle-btn--active' : ''}`} onClick={() => handleField('npc', true)}>{t('npc')}</button>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
      </div>

      {/* \u2500\u2500 Traits \u2500\u2500 */}
      <div role="tabpanel" id={`tabpanel-1`} aria-labelledby={`tab-1`} hidden={tab !== 1}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tab7sTraits')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              {t('traitsHint')} {nationTraits && (nationBonusTrait
                ? `${fields.nation}: +1 ${nationBonusTrait} applied via Identity tab.`
                : `${fields.nation} grants +1 to ${nationTraits[0]} or ${nationTraits[1]} -- select on the Identity tab.`)}
            </p>
            {guidedMode && <PointsBudget spent={traitSpent} budget={TRAIT_BUDGET} />}
            <div className="rating-grid">
              {TRAIT_KEYS.map(key => (
                <div key={key} className="ability-row">
                  <DotRating label={t(key)} name={key} value={fields[key]} onChange={handleField} min={2} max={5} />
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      {/* \u2500\u2500 Skills \u2500\u2500 */}
      <div role="tabpanel" id={`tabpanel-2`} aria-labelledby={`tab-2`} hidden={tab !== 2}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tab7sSkills')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              {t('skillsHint')} {guidedMode && 'Max 3 per skill at creation. Rank 3 grants a reroll.'}
            </p>
            {guidedMode && <PointsBudget spent={skillSpent} budget={SKILL_BUDGET} />}
            <div className="rating-grid">
              {SKILL_KEYS.map(key => (
                <div key={key} className="ability-row">
                  <DotRating label={t(key)} name={key} value={fields[key]} onChange={handleField} max={guidedMode ? 3 : 5} />
                </div>
              ))}
            </div>
          </fieldset>
          <details style={{ marginTop: 'var(--space-sm)' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>{t('7sRiskRollCalc')}</summary>
            <fieldset>
              <legend>{t('7sRiskRollCalc')}</legend>
              <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
                Risks are resolved by rolling Trait + Skill in d10s, making sets of 10.
              </p>
              <table className="inv-table">
                <thead><tr><th>Skill</th><th>Rank</th><th>Brawn</th><th>Finesse</th><th>Resolve</th><th>Wits</th><th>Panache</th></tr></thead>
                <tbody>
                  {SKILL_KEYS.map(key => {
                    const rank = fields[key] || 0
                    if (rank === 0) return null
                    return (
                      <tr key={key}>
                        <td style={{ fontWeight: 600 }}>{t(key)}</td>
                        <td style={{ textAlign: 'center' }}>{rank}</td>
                        {TRAIT_KEYS.map(tk => {
                          const isStrong = rank >= 2 && fields[tk] >= 3
                          return (
                            <td key={tk} style={{ textAlign: 'center', color: 'var(--color-accent-fg)', fontWeight: 600, background: isStrong ? 'rgba(46,204,113,0.15)' : undefined }}>
                              {rank + fields[tk]}d10
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </fieldset>
          </details>
        </div>
      </div>

      {/* \u2500\u2500 Advantages \u2500\u2500 */}
      <div role="tabpanel" id={`tabpanel-3`} aria-labelledby={`tab-3`} hidden={tab !== 3}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tab7sAdvantages')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>{t('7sAdvantagesHint')}</p>
            {guidedMode && <PointsBudget spent={advSpent} budget={ADVANTAGE_BUDGET} />}
            {disciplines.length > 0 && (
              <ul className="tag-list">
                {disciplines.map(d => (
                  <li key={d.id} className={`tag tag--clickable${d.id === tagInfo?.id ? ' tag--active' : ''}`}
                    onClick={() => setTagInfo(ti => ti?.id === d.id ? null : { ...d, kind: 'advantage' })}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTagInfo(ti => ti?.id === d.id ? null : { ...d, kind: 'advantage' }); } }}
                    role="button" tabIndex={0}>
                    <span>{d.name} ({d.level} pt{d.level !== 1 ? 's' : ''})</span>
                    <button className="tag-remove" onClick={e => { e.stopPropagation(); removeDiscipline(characterId, d.id); setDisciplines(prev => prev.filter(x => x.id !== d.id)); if (tagInfo?.id === d.id) setTagInfo(null) }}>x</button>
                  </li>
                ))}
              </ul>
            )}
          </fieldset>
          {tagInfo?.kind === 'advantage' && (() => {
            const entry = ADVANTAGES.find(a => a.name.toLowerCase() === tagInfo.name.toLowerCase())
            return <TagInfoPanel entry={entry ? { name: entry.name, description: `Cost: ${entry.cost}. ${entry.description}${entry.source ? ` (${entry.source})` : ''}` } : { name: tagInfo.name }} onClose={() => setTagInfo(null)} />
          })()}
          <fieldset>
            <legend>{t('7sAdvCatalogue')} ({filteredAdvantages.length})</legend>
            {guidedMode && (
              <div style={{ padding: 'var(--space-sm) var(--space-md)', marginBottom: 'var(--space-sm)', background: advSpent > ADVANTAGE_BUDGET ? 'rgba(231,76,60,0.12)' : advSpent === ADVANTAGE_BUDGET ? 'rgba(46,204,113,0.12)' : 'rgba(52,152,219,0.10)', borderLeft: `3px solid ${advSpent > ADVANTAGE_BUDGET ? '#e74c3c' : advSpent === ADVANTAGE_BUDGET ? '#2ecc71' : 'var(--color-accent-fg)'}`, borderRadius: 'var(--radius)', fontSize: '0.9rem', fontWeight: 600 }}>
                Spent: {advSpent}/{ADVANTAGE_BUDGET} pts -- {ADVANTAGE_BUDGET - advSpent >= 0 ? `${ADVANTAGE_BUDGET - advSpent} remaining` : `${advSpent - ADVANTAGE_BUDGET} over budget`}
              </div>
            )}
            <div className="catalog-search-wrap" style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', alignItems: 'center' }}>
              <input type="search" value={advSearch} onChange={e => setAdvSearch(e.target.value)}
                placeholder="Search advantages..." aria-label="Search advantages" style={{ flex: 1, minWidth: 180 }} />
              <select value={advSourceFilter} onChange={e => setAdvSourceFilter(e.target.value)} style={{ fontSize: '0.82rem', maxWidth: 200 }} aria-label="Filter by source book">
                <option value="">All Sources ({ADVANTAGES.length})</option>
                {ALL_ADV_SOURCES.map(s => <option key={s} value={s}>{s} ({ADVANTAGES.filter(a => a.source === s).length})</option>)}
              </select>
              <span className="catalog-search-count">{filteredAdvantages.filter(a => a.name.toLowerCase().includes(advSearch.toLowerCase()) || a.description.toLowerCase().includes(advSearch.toLowerCase())).length}</span>
            </div>
            <ul className="catalog-list" aria-label="Advantage catalog">
              {filteredAdvantages
                .filter(a => a.name.toLowerCase().includes(advSearch.toLowerCase()) || a.description.toLowerCase().includes(advSearch.toLowerCase()))
                .slice(0, 30)
                .map(a => {
                  const already = disciplines.some(d => d.name.toLowerCase() === a.name.toLowerCase())
                  return (
                    <li key={`${a.name}-${a.source}`} className={`catalog-item${already ? ' catalog-item--added' : ''}`}>
                      {(() => {
                        const wouldExceed = guidedMode && !already && (advSpent + a.cost) > ADVANTAGE_BUDGET
                        return (
                          <button className="catalog-item-btn" disabled={wouldExceed && !already} onClick={() => {
                            if (!already) {
                              addDiscipline(characterId, { name: a.name, level: a.cost, notes: '' })
                                .then(res => setDisciplines(prev => [...prev, res.data]))
                                .catch(() => setActionError(t('failedToSave')))
                            } else {
                              const d = disciplines.find(d => d.name.toLowerCase() === a.name.toLowerCase())
                              if (d) setTagInfo(ti => ti?.id === d.id ? null : { ...d, kind: 'advantage' })
                            }
                          }}>
                            <div className="catalog-item-main">
                              <span className="catalog-item-name">
                                {a.name}
                                {bgRecommendedAdvantages.has(a.name.toLowerCase()) && !already && (
                                  <span style={{ marginLeft: '6px', fontSize: '0.7rem', fontWeight: 700, color: '#fff', background: 'var(--color-accent-fg)', padding: '1px 6px', borderRadius: '8px', verticalAlign: 'middle' }}>Recommended</span>
                                )}
                              </span>
                              <span className="catalog-item-desc">{a.description}</span>
                              {a.source && <span className="muted-hint muted-hint--xs" style={{ display: 'block', marginTop: '2px', fontStyle: 'italic' }}>{a.source}</span>}
                              {wouldExceed && (
                                <span className="muted-hint muted-hint--xs" style={{ color: 'var(--color-danger)', display: 'block', marginTop: '2px' }}>
                                  Exceeds {ADVANTAGE_BUDGET}-point budget ({advSpent} + {a.cost} = {advSpent + a.cost})
                                </span>
                              )}
                            </div>
                            <div className="catalog-item-meta">
                              <span className="catalog-item-cost">{a.cost}pt</span>
                              {already ? <span className="catalog-item-check">{'\u2713'}</span> : <span className="catalog-item-add">+</span>}
                            </div>
                          </button>
                        )
                      })()}
                    </li>
                  )
                })}
            </ul>
          </fieldset>
        </div>
      </div>

      {/* \u2500\u2500 Sorcery \u2500\u2500 */}
      <div role="tabpanel" id={`tabpanel-4`} aria-labelledby={`tab-4`} hidden={tab !== 4}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tab7sSorcery')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-md)' }}>
              Sorcery is purchased as an Advantage (2 pts for Rank 1, 4 pts for Rank 2). Your nation determines which tradition you can learn.
            </p>
            {nationSorcery ? (
              <div className="form-section" style={{ marginBottom: 'var(--space-md)' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-sm)', color: 'var(--color-accent-fg)' }}>{nationSorcery}</h3>
                <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}><strong>{SORCERY_INFO[nationSorcery]?.nation}</strong></p>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>{SORCERY_INFO[nationSorcery]?.description}</p>
                {(() => {
                  const hasSorcery = disciplines.some(d => d.name === 'Sorcery' && d.notes === nationSorcery)
                  const wouldExceed = guidedMode && (advSpent + 4) > ADVANTAGE_BUDGET
                  return !hasSorcery ? (
                    <button className="btn btn-secondary" style={{ marginTop: 'var(--space-sm)' }}
                      disabled={guidedMode && wouldExceed}
                      onClick={() => {
                        addDiscipline(characterId, { name: 'Sorcery', level: 4, notes: nationSorcery })
                          .then(res => setDisciplines(prev => [...prev, res.data]))
                          .catch(() => setActionError(t('failedToSave')))
                      }}>
                      Add {nationSorcery} (4 pts)
                      {guidedMode && wouldExceed && ' -- exceeds budget'}
                    </button>
                  ) : (
                    <p className="muted-hint muted-hint--xs" style={{ marginTop: 'var(--space-sm)', color: 'var(--color-accent-fg)' }}>
                      {nationSorcery} already added as an advantage.
                    </p>
                  )
                })()}
              </div>
            ) : (
              <p className="muted-hint" style={{ paddingBottom: 0 }}>Select a nation on the Identity tab to see your available sorcery tradition.</p>
            )}
            {!nationSorcery && Object.entries(SORCERY_INFO).map(([name, info]) => (
              <details key={name} style={{ marginBottom: 'var(--space-sm)' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>{name} <span style={{ fontWeight: 400, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>\u2014 {info.nation}</span></summary>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6, padding: 'var(--space-sm) 0' }}>{info.description}</p>
              </details>
            ))}
          </fieldset>
          <fieldset>
            <legend>{t('7sSorceryNotes')}</legend>
            <textarea name="sorceryDesc" value={fields.sorceryDesc} onChange={handleText} rows={5} style={{ width: '100%' }} placeholder="Describe your sorcerous abilities, Deals, Knights, Unguents, Runes, Strands, etc." />
          </fieldset>
        </div>
      </div>

      {/* \u2500\u2500 Dueling \u2500\u2500 */}
      <div role="tabpanel" id={`tabpanel-5`} aria-labelledby={`tab-5`} hidden={tab !== 5}>
        <div className="form-section">
          <fieldset>
            <legend>{t('7sYourDuelingStyle')}</legend>
            <div className="field-row">
              <div className="field" style={{ flex: 2 }}>
                <label>{t('7sActiveStyle')}</label>
                <select value={activeDuelStyle} onChange={e => setActiveDuelStyle(e.target.value)} aria-label={t('7sActiveStyle')}>
                  <option value="">None (not a Duelist)</option>
                  {DUELING_STYLES.map(s => <option key={s.name} value={s.name}>{t(s.name)} ({t(s.nation)})</option>)}
                </select>
              </div>
            </div>
            {activeDuelStyle && (() => {
              const style = DUELING_STYLES.find(s => s.name === activeDuelStyle)
              if (!style) return null
              const requiredTrait = DUELING_STYLE_TRAIT[style.name]
              const traitKey = requiredTrait ? TRAIT_NAME_TO_KEY[requiredTrait] : null
              const traitVal = traitKey ? fields[traitKey] : 0
              const traitLow = requiredTrait && traitVal < 3
              return (
                <div className="form-section" style={{ padding: 'var(--space-md)', marginTop: 'var(--space-sm)', marginBottom: 0, background: 'rgba(52,152,219,0.08)', borderLeft: '3px solid var(--color-accent-fg)' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-xs)' }}>{style.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xs)' }}>{style.nation}{style.source ? ` \u2014 ${style.source}` : ''}</div>
                  <div style={{ fontSize: '0.9rem' }}>{style.description}</div>
                  {traitLow && (
                    <p className="muted-hint muted-hint--xs" role="status" aria-live="polite" style={{ marginTop: 'var(--space-sm)', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                      Your {requiredTrait} is {traitVal} -- this style works best with {requiredTrait} 3+.
                    </p>
                  )}
                </div>
              )
            })()}
          </fieldset>
          <details style={{ marginTop: 'var(--space-sm)' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)', marginBottom: 'var(--space-sm)' }}>{t('7sStyleRef')}</summary>
            <fieldset>
              <legend>{t('tab7sDueling')}</legend>
              <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-md)' }}>
                Purchase the "Duelist Academy" Advantage (5 pts) to learn a style. Each style uses a specific Trait and grants unique Maneuvers.
              </p>
              {DUELING_STYLES.map(s => (
                <details key={s.name} style={{ marginBottom: 'var(--space-sm)' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>{s.name} <span style={{ fontWeight: 400, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>\u2014 {s.nation}{s.source ? ` (${s.source})` : ''}</span></summary>
                  <p style={{ fontSize: '0.85rem', lineHeight: 1.6, padding: 'var(--space-sm) 0' }}>{s.description}</p>
                </details>
              ))}
            </fieldset>
          </details>
          <fieldset>
            <legend>{t('7sDuelingNotes')}</legend>
            <textarea name="altName" value={fields.altName} onChange={handleText} rows={4} style={{ width: '100%' }} placeholder="Your dueling style, maneuvers learned, and notes..." />
          </fieldset>
        </div>
      </div>

      {/* \u2500\u2500 Arcana \u2500\u2500 */}
      <div role="tabpanel" id={`tabpanel-6`} aria-labelledby={`tab-6`} hidden={tab !== 6}>
        <div className="form-section">
          <fieldset>
            <legend>{t('7sArcana')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>{t('arcanaHint')}</p>
            <div className="field-row">
              <CatalogSelect id="heroVirtue" name="heroVirtue" label={t('7sVirtue')} value={fields.heroVirtue}
                onChange={handleField} catalog={VIRTUE_CATALOG} />
              <CatalogSelect id="heroHubris" name="heroHubris" label={t('7sHubris')} value={fields.heroHubris}
                onChange={handleField} catalog={HUBRIS_CATALOG} />
            </div>
            {(virtueEffect || hubrisEffect) && (
              <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', marginTop: 'var(--space-sm)' }}>
                {virtueEffect && (
                  <div style={{ flex: 1, minWidth: 200, padding: 'var(--space-sm) var(--space-md)', background: 'rgba(46,204,113,0.10)', borderLeft: '3px solid #2ecc71', borderRadius: 'var(--radius)', fontSize: '0.85rem' }}>
                    <strong style={{ color: '#2ecc71' }}>Virtue:</strong> {virtueEffect}
                  </div>
                )}
                {hubrisEffect && (
                  <div style={{ flex: 1, minWidth: 200, padding: 'var(--space-sm) var(--space-md)', background: 'rgba(231,76,60,0.10)', borderLeft: '3px solid #e74c3c', borderRadius: 'var(--radius)', fontSize: '0.85rem' }}>
                    <strong style={{ color: '#e74c3c' }}>Hubris:</strong> {hubrisEffect}
                  </div>
                )}
              </div>
            )}
          </fieldset>
        </div>
      </div>

      {/* ── Resources ── */}
      <div role="tabpanel" id={`tabpanel-7`} aria-labelledby={`tab-7`} hidden={tab !== 7}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tab7sResources')}</legend>
            <div className="rating-grid">
              <div className="ability-row">
                {guidedMode ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <DotRating label={t('7sHeroPoints')} name="heroPoints" value={1} onChange={() => {}} min={1} max={1} />
                    <span className="muted-hint muted-hint--xs" style={{ color: 'var(--color-accent-fg)', whiteSpace: 'nowrap' }}>Auto-set for character creation</span>
                  </div>
                ) : (
                  <DotRating label={t('7sHeroPoints')} name="heroPoints" value={fields.heroPoints} onChange={handleField} min={0} max={10} />
                )}
              </div>
              <div className="ability-row"><DotRating label={t('7sWealth')} name="wealth7s" value={fields.wealth7s} onChange={handleField} min={0} max={10} /></div>
              <div className="ability-row"><DotRating label={t('7sDramaticWounds')} name="dramaticWounds" value={fields.dramaticWounds} onChange={handleField} min={0} max={5} /></div>
              <div className="ability-row"><DotRating label={t('7sCorruption')} name="corruption" value={fields.corruption} onChange={handleField} min={0} max={10} /></div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Wound Tracker</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Each Dramatic Wound equals your Resolve in regular wounds. Track regular wounds here and Dramatic Wounds are calculated automatically.
            </p>
            <div className="field-row" style={{ alignItems: 'center' }}>
              <div className="field" style={{ width: 140 }}>
                <label>Regular Wounds</label>
                <input type="number" min={0} max={99} value={wounds} onChange={e => setWounds(Math.max(0, parseInt(e.target.value) || 0))} />
              </div>
              <div role="status" aria-live="polite" aria-atomic="true" style={{ flex: 1, padding: 'var(--space-sm)', background: 'rgba(52,152,219,0.08)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--color-accent-fg)' }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '2px' }}>
                  {wounds} regular wound{wounds !== 1 ? 's' : ''} = {Math.floor(wounds / (fields.traitResolve || 1))} Dramatic Wound{Math.floor(wounds / (fields.traitResolve || 1)) !== 1 ? 's' : ''}
                </div>
                <div className="muted-hint muted-hint--xs">
                  Resolve {fields.traitResolve} = {fields.traitResolve} wound{fields.traitResolve !== 1 ? 's' : ''} per Dramatic Wound level
                  {wounds > 0 && ` | ${wounds % (fields.traitResolve || 1)} wound${wounds % (fields.traitResolve || 1) !== 1 ? 's' : ''} toward next`}
                </div>
              </div>
            </div>
          </fieldset>

          {/* Villain/Monster creation is now a separate form at /7thsea/villain/new */}
        </div>
      </div>

      {/* \u2500\u2500 Backgrounds \u2500\u2500 */}
      <div role="tabpanel" id={`tabpanel-8`} aria-labelledby={`tab-8`} hidden={tab !== 8}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tab7sBackgrounds')}{guidedMode ? ` -- Backgrounds: ${backgrounds.length}/2` : ''}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Choose 2 Backgrounds. Each provides a Quirk, Skills, and Advantages.
            </p>
            {guidedMode && (
              <span className={`points-remaining ${backgrounds.length < 2 ? 'points-remaining--ok' : backgrounds.length === 2 ? 'points-remaining--done' : 'points-remaining--over'}`}
                style={{ display: 'inline-block', marginBottom: 'var(--space-sm)' }}>
                Backgrounds: {backgrounds.length}/2{backgrounds.length < 2 ? ` -- ${2 - backgrounds.length} remaining` : ''}
              </span>
            )}
            {bgAutoApplyMsg && (
              <div role="status" aria-live="polite" style={{ padding: 'var(--space-sm) var(--space-md)', marginBottom: 'var(--space-sm)', background: 'rgba(46,204,113,0.12)', borderLeft: '3px solid #2ecc71', borderRadius: 'var(--radius)', fontSize: '0.85rem', color: 'var(--color-text)' }}>
                {bgAutoApplyMsg}
              </div>
            )}
            {guidedMode && backgrounds.length >= 2 && (
              <p className="points-remaining points-remaining--done" style={{ marginBottom: 'var(--space-sm)' }}>
                Background limit reached (2/2). Remove one to add a different background.
              </p>
            )}
            {backgrounds.length > 0 && (
              <ul className="tag-list">
                {backgrounds.map(b => (
                  <li key={b.id} className={`tag tag--clickable${b.id === tagInfo?.id ? ' tag--active' : ''}`} onClick={() => setTagInfo(ti => ti?.id === b.id ? null : { ...b, kind: 'background' })}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTagInfo(ti => ti?.id === b.id ? null : { ...b, kind: 'background' }); } }}
                    role="button" tabIndex={0}>
                    <span>{b.name}{b.description ? ` \u2014 ${b.description}` : ''}</span>
                    <button className="tag-remove" onClick={e => { e.stopPropagation(); removeBackground(characterId, b.id); setBackgrounds(prev => prev.filter(x => x.id !== b.id)); if (tagInfo?.id === b.id) setTagInfo(null) }}>x</button>
                  </li>
                ))}
              </ul>
            )}
          </fieldset>
          {tagInfo?.kind === 'background' && (() => {
            const entry = BACKGROUND_CATALOG.find(bg => bg.name.toLowerCase() === tagInfo.name.toLowerCase())
            if (!entry) {
              const desc = tagInfo.description ? `Quirk: ${tagInfo.description}` : undefined
              return <TagInfoPanel entry={{ name: tagInfo.name, description: desc }} onClose={() => setTagInfo(null)} />
            }
            return (
              <aside className="tag-info-panel">
                <button className="tag-info-panel-close" onClick={() => setTagInfo(null)}>{t('close')}</button>
                <p className="tag-info-panel-name">{entry.name}</p>
                <p className="tag-info-panel-desc" style={{ marginBottom: 'var(--space-xs)' }}>
                  <strong>Skills:</strong> {entry.skills.join(', ')}
                </p>
                <p className="tag-info-panel-desc" style={{ marginBottom: 'var(--space-xs)' }}>
                  <strong>Advantages:</strong> {entry.advantages.join(', ')}
                </p>
                <div style={{ padding: 'var(--space-sm) var(--space-md)', marginTop: 'var(--space-sm)', background: 'rgba(241,196,15,0.12)', borderLeft: '3px solid #f1c40f', borderRadius: 'var(--radius)' }}>
                  <span style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: 700, color: '#fff', background: '#f1c40f', padding: '1px 8px', borderRadius: '8px', marginRight: '6px', verticalAlign: 'middle' }}>Hero Point</span>
                  <span style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>{entry.quirk}</span>
                </div>
              </aside>
            )
          })()}
          <fieldset>
            <legend>{t('7sBgCatalogue')} ({filteredBackgrounds.length})</legend>
            <div className="catalog-search-wrap" style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', alignItems: 'center' }}>
              <input type="search" value={bgSearch} onChange={e => setBgSearch(e.target.value)}
                placeholder="Search backgrounds..." aria-label="Search backgrounds" style={{ flex: 1, minWidth: 180 }} />
              <select value={bgSourceFilter} onChange={e => setBgSourceFilter(e.target.value)} style={{ fontSize: '0.82rem', maxWidth: 200 }} aria-label="Filter backgrounds by source">
                <option value="">All Sources ({BACKGROUND_CATALOG.length})</option>
                {ALL_BG_SOURCES.map(s => <option key={s} value={s}>{s} ({BACKGROUND_CATALOG.filter(b => b.source === s).length})</option>)}
              </select>
              <span className="catalog-search-count">{filteredBackgrounds.filter(b => b.name.toLowerCase().includes(bgSearch.toLowerCase()) || b.description.toLowerCase().includes(bgSearch.toLowerCase())).length}</span>
            </div>
            <ul className="catalog-list" aria-label="Background catalog">
              {filteredBackgrounds
                .filter(b => b.name.toLowerCase().includes(bgSearch.toLowerCase()) || b.description.toLowerCase().includes(bgSearch.toLowerCase()))
                .map(b => {
                  const already = backgrounds.some(bg => bg.name.toLowerCase() === b.name.toLowerCase())
                  return (
                    <li key={b.name} className={`catalog-item${already ? ' catalog-item--added' : ''}`}>
                      <button className="catalog-item-btn" disabled={!already && guidedMode && backgrounds.length >= 2} onClick={() => {
                        if (!already) {
                          handleAddBackgroundFromCatalog(b)
                        } else {
                          const bg = backgrounds.find(bg => bg.name.toLowerCase() === b.name.toLowerCase())
                          if (bg) setTagInfo(ti => ti?.id === bg.id ? null : { ...bg, kind: 'background' })
                        }
                      }}>
                        <div className="catalog-item-main">
                          <span className="catalog-item-name">{b.name}</span>
                          <span className="catalog-item-desc">{b.description}</span>
                          {b.source && <span className="muted-hint muted-hint--xs" style={{ display: 'block', marginTop: '2px', fontStyle: 'italic' }}>{b.source}</span>}
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

      {/* \u2500\u2500 Stories (advancement system) \u2500\u2500 */}
      {/* ── Secret Societies ── */}
      <div role="tabpanel" id={`tabpanel-9`} aria-labelledby={`tab-9`} hidden={tab !== 9}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tab7sSecretSocieties')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-md)' }}>
              Your Hero can join one Secret Society. Membership grants access to resources, allies, and missions — but also obligations and enemies.
            </p>
            <CatalogSelect id="secretSociety" name="demeanor" label="Select Society"
              value={fields.demeanor} onChange={handleField}
              catalog={SECRET_SOCIETIES} placeholder="Search secret societies..." />
          </fieldset>

          {/* Show selected society details */}
          {fields.demeanor && (() => {
            const sel = SECRET_SOCIETIES.find(s => s.value === fields.demeanor)
            if (!sel) return null
            return (
              <fieldset style={{ background: 'var(--color-surface-raised)', borderRadius: 'var(--radius)', padding: 'var(--space-md)' }}>
                <legend>{sel.value}</legend>
                <p style={{ fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 'var(--space-md)' }}>{sel.description}</p>
                {sel.hierarchy && (
                  <div style={{ marginBottom: 'var(--space-sm)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-xs)' }}>Hierarchy</div>
                    <p style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>{sel.hierarchy}</p>
                  </div>
                )}
                {sel.joining && (
                  <div style={{ marginBottom: 'var(--space-sm)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-xs)' }}>How to Join</div>
                    <p style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>{sel.joining}</p>
                  </div>
                )}
                {sel.source && (
                  <p className="muted-hint muted-hint--xs" style={{ fontStyle: 'italic', marginTop: 'var(--space-sm)' }}>Source: {sel.source}</p>
                )}
              </fieldset>
            )
          })()}

          {/* Reference: All Secret Societies */}
          <details style={{ marginTop: 'var(--space-md)' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>
              All Secret Societies Reference ({SECRET_SOCIETIES.length})
            </summary>
            <div style={{ marginTop: 'var(--space-sm)' }}>
              {SECRET_SOCIETIES.map(s => (
                <div key={s.value} style={{ padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px' }}>{s.value}</div>
                  <p className="muted-hint muted-hint--xs" style={{ marginBottom: '4px' }}>{s.description}</p>
                  {s.hierarchy && <p className="muted-hint muted-hint--xs"><strong>Ranks:</strong> {s.hierarchy}</p>}
                  {s.source && <p className="muted-hint muted-hint--xs" style={{ fontStyle: 'italic' }}>{s.source}</p>}
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>

      {/* ── Stories (advancement system) ── */}
      <div role="tabpanel" id={`tabpanel-10`} aria-labelledby={`tab-10`} hidden={tab !== 10}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tab7sStories')} ({parsedStories.length})</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Stories replace XP. Define a Goal, a Reward, and Steps. The number of steps determines the reward value: 1 step = 1-pt Advantage or Skill Rank, 3 steps = 3-pt Advantage, 5 steps = +1 Trait.
            </p>
          </fieldset>

          {/* Active Stories */}
          {parsedStories.length > 0 && (
            <fieldset>
              <legend>{t('7sActiveStories')}</legend>
              {parsedStories.map((story, i) => (
                <div key={i} className="form-section" style={{ padding: 'var(--space-md)', marginBottom: 'var(--space-sm)', borderLeft: '3px solid var(--color-accent-fg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-xs)' }}>{story.title}</div>
                    <button className="tag-remove" onClick={() => handleRemoveStory(i)}>{'\u00d7'}</button>
                  </div>
                  {story.lines.map((line, j) => (
                    <p key={j} className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}>{line}</p>
                  ))}
                </div>
              ))}
            </fieldset>
          )}

          {/* Add Story Form */}
          <fieldset>
            <legend>{t('7sNewStory')}</legend>
            <div className="field-row">
              <div className="field" style={{ flex: 2 }}>
                <label>{t('7sStoryTitle')}</label>
                <input type="text" value={newStory.title} onChange={e => setNewStory(p => ({ ...p, title: e.target.value }))} placeholder="The Lost Heir of Castille..." />
              </div>
              <div className="field" style={{ flex: 2 }}>
                <label>{t('7sReward')}</label>
                <input type="text" value={newStory.reward} onChange={e => setNewStory(p => ({ ...p, reward: e.target.value }))} placeholder="+1 Resolve, 3-pt Advantage, etc." />
              </div>
            </div>
            <div className="field">
              <label>{t('7sGoalEnding')}</label>
              <input type="text" value={newStory.goal} onChange={e => setNewStory(p => ({ ...p, goal: e.target.value }))} placeholder="What does the ending of this story look like?" />
            </div>
            <div className="field">
              <label>{t('7sSteps')}</label>
              <textarea value={newStory.steps} onChange={e => setNewStory(p => ({ ...p, steps: e.target.value }))} rows={3} style={{ width: '100%' }} placeholder={"Find the old map in the library\nSail to the island\nConfront the usurper"} />
            </div>
            {(() => {
              const stepCount = newStory.steps ? newStory.steps.split('\n').filter(s => s.trim()).length : 0
              if (stepCount === 0) return null
              const tier = STORY_REWARD_TIERS.find(t => t.steps === Math.min(stepCount, 5)) || STORY_REWARD_TIERS[STORY_REWARD_TIERS.length - 1]
              return (
                <p role="status" aria-live="polite" className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)', padding: 'var(--space-xs) var(--space-sm)', background: 'rgba(52,152,219,0.08)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--color-accent-fg)' }}>
                  <strong>{stepCount} step{stepCount !== 1 ? 's' : ''}</strong> = <strong>{tier.reward}</strong>
                  {stepCount > 5 && ' (capped at 5-step reward tier)'}
                </p>
              )
            })()}
            <button className="btn btn-secondary" onClick={handleAddStory}>{t('add')}</button>
          </fieldset>

          {/* Raw Data */}
          <details>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>{t('7sRawStoryData')}</summary>
            <textarea name="heroStories" value={fields.heroStories} onChange={handleText} rows={8} style={{ width: '100%', marginTop: 'var(--space-sm)' }} placeholder="Stories are added from the form above. Edit directly here if needed." />
          </details>

          {/* Story Rewards Reference */}
          <details style={{ marginTop: 'var(--space-md)' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>{t('7sRewardsRef')}</summary>
            <table className="inv-table" style={{ marginTop: 'var(--space-sm)' }}>
              <thead><tr><th>Steps</th><th>Reward</th></tr></thead>
              <tbody>
                <tr><td style={{ fontWeight: 600 }}>1</td><td>1-pt Advantage or new Skill Rank</td></tr>
                <tr><td style={{ fontWeight: 600 }}>2</td><td>2-pt Advantage</td></tr>
                <tr><td style={{ fontWeight: 600 }}>3</td><td>3-pt Advantage</td></tr>
                <tr><td style={{ fontWeight: 600 }}>4</td><td>4-pt Advantage</td></tr>
                <tr><td style={{ fontWeight: 600 }}>5</td><td>5-pt Advantage or +1 to a Trait</td></tr>
              </tbody>
            </table>
          </details>
        </div>
      </div>

      {/* \u2500\u2500 Belongings \u2500\u2500 */}
      <div role="tabpanel" id={`tabpanel-11`} aria-labelledby={`tab-11`} hidden={tab !== 11}>
        <div className="form-section">
          <fieldset>
            <legend>{t('7sBelongings')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              7th Sea uses abstract Wealth rather than detailed inventories. List notable possessions: signature weapons, ships, heirlooms, and other meaningful items.
            </p>
            <textarea name="personalItems" value={fields.personalItems} onChange={handleText} rows={10} style={{ width: '100%' }} placeholder={
`Signature sword (Castillian rapier, family heirloom)
Ship: The Silver Gull (brigantine, 20 crew)
Port\u00e9-marked locket (blooded to my mother)
Eisen dracheneisen pauldron (left shoulder)
Coded journal of trade routes`} />
          </fieldset>
        </div>
      </div>

      {/* \u2500\u2500 Backstory \u2500\u2500 */}
      <div role="tabpanel" id={`tabpanel-12`} aria-labelledby={`tab-12`} hidden={tab !== 12}>
        <div className="form-section">
          <fieldset><legend>{t('backstoryLabel')}</legend><textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('appearanceLabel')}</legend><textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('notes')}</legend><textarea name="notes" value={fields.notes} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
        </div>
      </div>

      {/* \u2500\u2500 XP Log \u2500\u2500 */}
      <div role="tabpanel" id={`tabpanel-13`} aria-labelledby={`tab-13`} hidden={tab !== 13}>
        <XpLogSection splat="seventh-sea" xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)} t={t} />
      </div>

      {/* \u2500\u2500 Rules Reference \u2500\u2500 */}
      <div role="tabpanel" id={`tabpanel-14`} aria-labelledby={`tab-14`} hidden={tab !== 14}>
        <RulesReferenceTab rules={SEVEN_SEA_RULES} title="7th Sea Rules Reference" />
      </div>

      {/* \u2500\u2500 Dice Roller \u2500\u2500 */}
      <div role="tabpanel" id={`tabpanel-15`} aria-labelledby={`tab-15`} hidden={tab !== 15}>
        <SeventhSeaDiceRoller />
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => setShowExport(true)}>{t('exportPdf')}</button>
        <button className="btn btn-secondary" onClick={() => navigate('/7thsea')}>{t('cancel')}</button>
        <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>{saving ? t('saving') : t('quickSave')}</button>
        <button className="btn btn-primary" onClick={handleDoneEditing} disabled={saving}>{t('doneEditing')}</button>
      </div>
      {viewMode && (
        <div className="view-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/7thsea')}>{t('back')}</button>
          <button className="btn btn-primary" onClick={() => navigate(`/characters/${characterId}`, { replace: true })}>{t('edit')}</button>
        </div>
      )}
      <ExportModal open={showExport} onClose={() => setShowExport(false)} tabKeys={TAB_KEYS} t={t} />
    </div>
  )
}
