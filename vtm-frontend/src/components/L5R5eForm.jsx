import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  getCharacter, updateCharacter,
  getXpLog, addXpLogEntry, removeXpLogEntry,
} from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import DotRating from './DotRating'
import CatalogSelect from './CatalogSelect'
import XpLogSection from './XpLogSection'
import RulesReferenceTab from './RulesReferenceTab'
import { useLanguage } from '../i18n/LanguageContext'
import ExportModal from './ExportModal'
import { useTheme } from '../context/ThemeContext'
import {
  L5R5E_RINGS, L5R5E_SKILL_GROUPS, L5R5E_CLANS, L5R5E_CLAN_CATALOG,
  L5R5E_FAMILIES, L5R5E_FAMILY_CATALOG, L5R5E_SCHOOLS, L5R5E_SCHOOL_CATALOG,
  L5R5E_ADVANTAGES, L5R5E_ADVANTAGE_CATALOG,
  L5R5E_DISADVANTAGES, L5R5E_DISADVANTAGE_CATALOG,
  L5R5E_TECHNIQUES, L5R5E_TECHNIQUE_CATALOG,
  L5R5E_WEAPONS, L5R5E_WEAPON_CATALOG,
  L5R5E_ARMOR, L5R5E_ARMOR_CATALOG,
  RING_DIE, SKILL_DIE,
} from '../data/l5r5eData'

const TAB_KEYS = ['tabL5r5eIdentity', 'tabL5r5e20Questions', 'tabL5r5eRings', 'tabL5r5eSkills', 'tabL5r5eTechniques', 'tabL5r5eAdvantages', 'tabL5r5eCombat', 'tabL5r5eSocial', 'tabL5r5eEquipment', 'tabBackstory', 'tabXpLog', 'tabDiceRoller', 'tabL5r5eRulesRef']

const INITIAL = {
  splat: 'L5R_5E',
  name: '', l5r5eClan: '', l5r5eFamily: '', l5r5eSchool: '',
  l5r5eNinjo: '', l5r5eGiri: '', concept: '', appearanceDesc: '',
  l5r5eAir: 1, l5r5eEarth: 1, l5r5eFire: 1, l5r5eWater: 1, l5r5eVoid: 1,
  l5r5eHonor: 40, l5r5eGlory: 40, l5r5eStatus: 30,
  l5r5eEndurance: 0, l5r5eEnduranceCurrent: 0,
  l5r5eComposure: 0, l5r5eComposureCurrent: 0,
  l5r5eFocus: 0, l5r5eVigilance: 0,
  l5r5eStrife: 0, l5r5eVoidPoints: 0, l5r5eSchoolRank: 1,
  l5r5eSkills: '', l5r5eTechniques: '', l5r5eAdvantages: '', l5r5eDisadvantages: '',
  l5r5eWeapons: '', l5r5eArmor: '', l5r5eInventory: '', l5r5eCurriculum: '',
  l5r5eTwentyQuestions: '',
  notes: '', backstory: '',
}

const L5R5E_RULES = [
  { title: 'Making Checks', sections: [
    { heading: 'Step 1: Declare', text: 'Declare your approach (which ring) and action (which skill). The GM sets TN.' },
    { heading: 'Step 2: Roll', text: 'Roll ring dice (d6) equal to ring value + skill dice (d12) equal to skill rank.' },
    { heading: 'Step 3: Keep', text: 'Keep a number of dice up to your ring value. Kept dice with strife add to your strife track.' },
    { heading: 'Step 4: Resolve', text: 'Count successes + explosive successes. If total meets or exceeds TN, you succeed. Spend Opportunity for bonus effects.' },
  ]},
  { title: 'TN Guide', sections: [
    { heading: 'TN 1 — Simple', text: 'Routine tasks that only fail under pressure.' },
    { heading: 'TN 2 — Easy', text: 'Tasks requiring basic training.' },
    { heading: 'TN 3 — Moderate', text: 'Tasks requiring professional skill.' },
    { heading: 'TN 4 — Hard', text: 'Tasks that challenge even experts.' },
    { heading: 'TN 5 — Very Hard', text: 'Feats at the edge of mortal ability.' },
    { heading: 'TN 6+ — Legendary', text: 'Near-impossible feats requiring extraordinary skill and luck.' },
  ]},
  { title: 'Dice Symbols', sections: [
    { heading: 'Success', text: 'Counts as 1 success toward meeting the TN.' },
    { heading: 'Explosive Success', text: 'Counts as 1 success AND you roll an additional die of the same type (ring or skill). The new die may also be kept.' },
    { heading: 'Opportunity', text: 'Does not count as a success, but can be spent for bonus effects (ring-specific or general).' },
    { heading: 'Strife', text: 'If on a kept die, adds 1 strife to your strife track. Strife does not prevent keeping the die.' },
  ]},
  { title: 'Strife & Composure', sections: [
    { heading: 'Composure', text: 'Composure = (Earth + Water) x 2. When strife exceeds composure, you become Compromised.' },
    { heading: 'Compromised', text: 'While Compromised, you cannot keep dice with strife symbols. You must Unmask at the first opportunity.' },
    { heading: 'Unmasking', text: 'When you Unmask, your character displays a powerful emotional outburst. Remove all strife. The GM determines narrative effects.' },
    { heading: 'Removing Strife', text: 'Strife is removed by Unmasking, resting, or certain techniques. At the end of a scene, remove strife equal to your Water ring.' },
  ]},
  { title: 'Conflict Types', sections: [
    { heading: 'Intrigue', text: 'Social conflict. Characters use Social and Scholar skills to sway opinions, uncover secrets, or manipulate others.' },
    { heading: 'Skirmish', text: 'Small-scale combat between individuals or small groups. Uses structured rounds and range bands.' },
    { heading: 'Mass Battle', text: 'Large-scale warfare resolved with Tactics, Command, and Martial skills against the battle\'s progress.' },
    { heading: 'Duel', text: 'Formalized one-on-one combat. Staredown phase (building strife), then a single decisive strike.' },
  ]},
  { title: 'Advancement', sections: [
    { heading: 'XP Awards', text: 'Characters earn XP each session (typically 3-5). XP is spent on skills, techniques, rings, and other improvements.' },
    { heading: 'Curriculum', text: 'Each school has a curriculum. Completing curriculum entries advances your school rank (1-5).' },
    { heading: 'Ring Increase', text: 'Cost = new rank x 3 XP. Rings cannot exceed 5.' },
    { heading: 'Skill Increase', text: 'Cost = new rank XP. Skills cannot exceed 5.' },
    { heading: 'New Technique', text: 'Cost varies by type and rank. Must meet prerequisites.' },
  ]},
  { title: 'Void Points', sections: [
    { heading: 'Maximum', text: 'Your Void Points maximum equals your Void ring value.' },
    { heading: 'Spending', text: 'Spend 1 Void point to: add a kept ring die set to Opportunity, or use a school ability that requires it.' },
    { heading: 'Recovering', text: 'Recover 1 Void point when you have a significant narrative moment or at the start of each session.' },
  ]},
  { title: 'Honor, Glory & Status', sections: [
    { heading: 'Honor', text: 'Measures personal integrity. Rank = tens digit. Loss from dishonorable acts, gain from virtuous ones.' },
    { heading: 'Glory', text: 'Measures fame and reputation. Rank = tens digit. Gain from public accomplishments, lose from public failures.' },
    { heading: 'Status', text: 'Measures social rank within the Celestial Order. Rank = tens digit. Changes based on appointments and deeds.' },
  ]},
]

function parseJson(str, fallback) { try { return JSON.parse(str) || fallback } catch { return fallback } }

// Parse school ring bonus strings like '+1 Earth, +1 Water' into [{ring: 'Earth', amount: 1}, ...]
function parseRingBonuses(ringsStr) {
  if (!ringsStr) return []
  return ringsStr.split(',').map(s => s.trim()).map(s => {
    const match = s.match(/\+(\d+)\s+(\w+)/)
    if (!match) return null
    return { amount: parseInt(match[1]), ring: match[2] }
  }).filter(Boolean)
}

// Resolve a ring label ('Earth') to a field key ('l5r5eEarth')
function ringLabelToKey(label) {
  const r = L5R5E_RINGS.find(r => r.label === label)
  return r ? r.key : null
}

const TWENTY_QUESTIONS = [
  { num: 1, part: 'Part I: Core Identity', question: 'What clan does your character belong to?', hint: 'Select your clan on the Identity tab. Grants +1 ring, +1 skill, and sets Status.' },
  { num: 2, part: 'Part I: Core Identity', question: 'What family does your character belong to?', hint: 'Select your family on the Identity tab. Grants +1 ring, +2 skills, sets Glory and Starting Wealth.' },
  { num: 3, part: 'Part II: Role and School', question: 'What is your character\'s school, and what roles does that school fall into?', hint: 'Select your school on the Identity tab. Grants +2 rings, starting skills, techniques, Honor, and outfit.' },
  { num: 4, part: 'Part II: Role and School', question: 'How does your character stand out within their school?', hint: 'Choose: Creativity/passion (+1 Fire), Grace/eloquence (+1 Air), Adaptability/friendliness (+1 Water), Thoroughness/patience (+1 Earth), or Self-awareness/insight (+1 Void).' },
  { num: 5, part: 'Part III: Honor and Glory', question: 'Who is your lord and what is your character\'s duty to them?', hint: 'Record your answer as your Giri on the Identity tab.' },
  { num: 6, part: 'Part III: Honor and Glory', question: 'What does your character long for, and how might this impede their duty?', hint: 'Record your answer as your Ninj\u014d on the Identity tab.' },
  { num: 7, part: 'Part III: Honor and Glory', question: 'What is your character\'s relationship with their clan?', hint: 'Orthodox: +5 Glory. Divergent: +1 rank in a skill you have at 0.' },
  { num: 8, part: 'Part III: Honor and Glory', question: 'What does your character think of Bushid\u014d?', hint: 'Staunch believer: +10 Honor. Divergent views: +1 rank in Commerce, Labor, Medicine, Seafaring, Skulduggery, or Survival.' },
  { num: 9, part: 'Part IV: Strengths and Weaknesses', question: 'What is your character\'s greatest accomplishment so far?', hint: 'Choose one Distinction advantage (see Advantages tab).' },
  { num: 10, part: 'Part IV: Strengths and Weaknesses', question: 'What holds your character back the most in life?', hint: 'Choose one Adversity disadvantage (see Advantages tab).' },
  { num: 11, part: 'Part IV: Strengths and Weaknesses', question: 'What activity most makes your character feel at peace?', hint: 'Choose one Passion advantage (see Advantages tab).' },
  { num: 12, part: 'Part IV: Strengths and Weaknesses', question: 'What concern, fear, or foible troubles your character the most?', hint: 'Choose one Anxiety disadvantage (see Advantages tab).' },
  { num: 13, part: 'Part IV: Strengths and Weaknesses', question: 'Who has your character learned the most from during their life?', hint: 'Record mentor name and relationship. Choose: 1 advantage related to them, OR 1 disadvantage + 1 skill rank.' },
  { num: 14, part: 'Part V: Personality and Behavior', question: 'What do people notice first upon encountering your character?', hint: 'Choose one distinctive aesthetic accoutrement (scarf, hair ornament, engraved scabbard, etc.).' },
  { num: 15, part: 'Part V: Personality and Behavior', question: 'How does your character react to stressful situations?', hint: 'Describe your stress behavior and unmasking style. Record under Personality on the Backstory tab.' },
  { num: 16, part: 'Part VI: Ancestry and Family', question: 'What are your character\'s preexisting relationships with other clans, families, organizations, and traditions?', hint: 'Record relationships. Choose one item of rarity 7 or lower for your starting outfit.' },
  { num: 17, part: 'Part VI: Ancestry and Family', question: 'How would your character\'s parents describe them?', hint: 'Gain +1 rank in a skill you have at 0.' },
  { num: 18, part: 'Part VI: Ancestry and Family', question: 'Who was your character named to honor?', hint: 'Roll on Samurai Heritage table or choose an ancestor. Narrative only.' },
  { num: 19, part: 'Part VI: Ancestry and Family', question: 'What is your character\'s personal name?', hint: 'Choose your personal name. Record on the Identity tab.' },
  { num: 20, part: 'Part VII: Death', question: 'How should your character die?', hint: 'No mechanical effect \u2014 but your GM will remember this answer.' },
]

export default function L5R5eForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const [searchParams] = useSearchParams()
  const viewMode = searchParams.get('mode') === 'view'
  const characterId = paramId || null

  useEffect(() => { switchTheme('l5r') }, [])

  const { isAutoCreating } = useAutoCreate(characterId, INITIAL)

  const [tab, setTab] = useState(0)
  const [fields, setFields] = useState(INITIAL)
  const [techFilter, setTechFilter] = useState('all')
  const [advFilter, setAdvFilter] = useState('all')
  const [disFilter, setDisFilter] = useState('all')
  const [weaponFilter, setWeaponFilter] = useState('all')
  const [xpLog, setXpLog] = useState([])
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [actionError, setActionError] = useState(null)

  // Dice roller state
  const [diceRingCount, setDiceRingCount] = useState(1)
  const [diceSkillCount, setDiceSkillCount] = useState(0)
  const [diceRolled, setDiceRolled] = useState(null)
  const [diceKept, setDiceKept] = useState([])
  const [diceHistory, setDiceHistory] = useState([])

  useEffect(() => {
    if (characterId) loadCharacter()
  }, [characterId])

  async function loadCharacter() {
    try {
      const [charRes, xpRes] = await Promise.all([
        getCharacter(characterId),
        getXpLog(characterId),
      ])
      const data = charRes.data
      setFields(prev => {
        const merged = { ...prev }
        for (const key in prev) { if (data[key] !== undefined && data[key] !== null) merged[key] = data[key] }
        return merged
      })
      setXpLog(xpRes.data)
    } catch { setSaveError(t('failedToLoad')) }
    finally { setLoading(false) }
  }

  function handleField(name, value) { setFields(prev => ({ ...prev, [name]: typeof value === 'string' ? value : Number(value) })) }
  function handleText(e) { setFields(prev => ({ ...prev, [e.target.name]: e.target.value })) }
  function handleNumber(e) { setFields(prev => ({ ...prev, [e.target.name]: Number(e.target.value) || 0 })) }

  async function handleSave() {
    setSaving(true); setSaveError(null)
    try { await updateCharacter(characterId, fields) }
    catch { setSaveError(t('failedToSave')) }
    finally { setSaving(false) }
  }

  async function handleDoneEditing() { await handleSave(); navigate('/l5r5e') }

  // ── Derived values ──
  const endurance = (fields.l5r5eEarth + fields.l5r5eFire) * 2
  const composure = (fields.l5r5eEarth + fields.l5r5eWater) * 2
  const focus = fields.l5r5eFire + fields.l5r5eAir
  const vigilance = Math.ceil((fields.l5r5eAir + fields.l5r5eWater) / 2)
  const voidPointsMax = fields.l5r5eVoid

  // ── Skills ──
  const skills = parseJson(fields.l5r5eSkills, {})
  function setSkills(next) { handleField('l5r5eSkills', JSON.stringify(next)) }
  function getSkillLevel(name) { return skills[name] || 0 }
  function setSkillLevel(name, val) {
    const next = { ...skills }
    if (val === 0) { delete next[name] } else { next[name] = val }
    setSkills(next)
  }

  // ── Techniques ──
  const techniques = parseJson(fields.l5r5eTechniques, [])
  function setTechniques(next) { handleField('l5r5eTechniques', JSON.stringify(next)) }

  // ── Advantages ──
  const advantages = parseJson(fields.l5r5eAdvantages, [])
  function setAdvantages(next) { handleField('l5r5eAdvantages', JSON.stringify(next)) }

  // ── Disadvantages ──
  const disadvantages = parseJson(fields.l5r5eDisadvantages, [])
  function setDisadvantages(next) { handleField('l5r5eDisadvantages', JSON.stringify(next)) }

  // ── Weapons ──
  const weapons = parseJson(fields.l5r5eWeapons, [])
  function setWeapons(next) { handleField('l5r5eWeapons', JSON.stringify(next)) }

  // ── Armor ──
  const armorList = parseJson(fields.l5r5eArmor, [])
  function setArmorList(next) { handleField('l5r5eArmor', JSON.stringify(next)) }

  // ── Inventory ──
  const inventory = parseJson(fields.l5r5eInventory, { items: [], koku: 0, bu: 0, zeni: 0 })
  function setInventory(next) { handleField('l5r5eInventory', JSON.stringify(next)) }
  const [newItem, setNewItem] = useState('')

  // ── Twenty Questions ──
  const twentyQ = parseJson(fields.l5r5eTwentyQuestions, {})
  function setTwentyQ(next) { handleField('l5r5eTwentyQuestions', JSON.stringify(next)) }
  function handleQAnswer(num, value) { setTwentyQ({ ...twentyQ, [`q${num}`]: value }) }

  // Q4: Stand out within school — +1 to a ring
  const Q4_OPTIONS = [
    { label: 'Creativity, passion, or drive', ring: 'l5r5eFire', ringLabel: 'Fire' },
    { label: 'Grace, eloquence, or empathy', ring: 'l5r5eAir', ringLabel: 'Air' },
    { label: 'Adaptability, friendliness, or awareness', ring: 'l5r5eWater', ringLabel: 'Water' },
    { label: 'Thoroughness, patience, or calm', ring: 'l5r5eEarth', ringLabel: 'Earth' },
    { label: 'Self-awareness, insight, or mysticism', ring: 'l5r5eVoid', ringLabel: 'Void' },
  ]

  function handleQ4(ringLabel) {
    const option = Q4_OPTIONS.find(o => o.ringLabel === ringLabel)
    if (!option) return
    const prevRing = twentyQ.q4_ring
    setFields(prev => {
      const next = { ...prev }
      // Revert previous bonus
      if (prevRing && prevRing !== option.ring) {
        next[prevRing] = Math.max(1, (next[prevRing] || 1) - 1)
      }
      // Apply new bonus (skip if same ring already applied)
      if (prevRing !== option.ring) {
        next[option.ring] = Math.min(5, (next[option.ring] || 1) + 1)
      }
      next.l5r5eTwentyQuestions = JSON.stringify({ ...twentyQ, q4: ringLabel, q4_ring: option.ring })
      return next
    })
  }

  // Q7: Relationship with clan — Orthodox (+5 Glory) or Divergent (+1 skill rank)
  function handleQ7(choice, skillName) {
    const prevChoice = twentyQ.q7
    setFields(prev => {
      const next = { ...prev }
      // Revert previous bonus
      if (prevChoice === 'orthodox' && choice !== 'orthodox') {
        next.l5r5eGlory = Math.max(0, (next.l5r5eGlory || 0) - 5)
      }
      // Apply new bonus
      if (choice === 'orthodox' && prevChoice !== 'orthodox') {
        next.l5r5eGlory = Math.min(100, (next.l5r5eGlory || 0) + 5)
      }
      const qData = { ...twentyQ, q7: choice }
      if (choice === 'divergent') { qData.q7_skill = skillName || '' } else { delete qData.q7_skill }
      next.l5r5eTwentyQuestions = JSON.stringify(qData)
      return next
    })
  }

  // Q8: Bushido — Staunch (+10 Honor) or Divergent (+1 skill rank)
  function handleQ8(choice, skillName) {
    const prevChoice = twentyQ.q8
    setFields(prev => {
      const next = { ...prev }
      // Revert previous bonus
      if (prevChoice === 'staunch' && choice !== 'staunch') {
        next.l5r5eHonor = Math.max(0, (next.l5r5eHonor || 0) - 10)
      }
      // Apply new bonus
      if (choice === 'staunch' && prevChoice !== 'staunch') {
        next.l5r5eHonor = Math.min(100, (next.l5r5eHonor || 0) + 10)
      }
      const qData = { ...twentyQ, q8: choice }
      if (choice === 'divergent') { qData.q8_skill = skillName || '' } else { delete qData.q8_skill }
      next.l5r5eTwentyQuestions = JSON.stringify(qData)
      return next
    })
  }

  const answeredCount = TWENTY_QUESTIONS.filter(q => {
    const val = twentyQ[`q${q.num}`]
    if (val === undefined || val === null) return false
    if (typeof val === 'string') return val.trim().length > 0
    return true // non-string truthy values (e.g. from radio selections)
  }).length

  // ── Family catalog filtered by clan ──
  const familyCatalog = fields.l5r5eClan && L5R5E_FAMILY_CATALOG[fields.l5r5eClan]
    ? L5R5E_FAMILY_CATALOG[fields.l5r5eClan]
    : []

  // ── School catalog filtered by clan ──
  const schoolCatalog = fields.l5r5eClan
    ? L5R5E_SCHOOL_CATALOG.filter((_, i) => {
        const school = L5R5E_SCHOOLS[i]
        return school && (school.clan === fields.l5r5eClan || school.clan === 'Ronin')
      })
    : L5R5E_SCHOOL_CATALOG

  // ── Filtered catalogs ──
  const techTypes = [...new Set(L5R5E_TECHNIQUES.map(t => t.type).filter(Boolean))].sort()
  const filteredTechCatalog = techFilter === 'all'
    ? L5R5E_TECHNIQUE_CATALOG
    : L5R5E_TECHNIQUE_CATALOG.filter((_, i) => L5R5E_TECHNIQUES[i]?.type === techFilter)

  const advTypes = [...new Set(L5R5E_ADVANTAGES.map(a => a.type).filter(Boolean))].sort()
  const filteredAdvCatalog = advFilter === 'all'
    ? L5R5E_ADVANTAGE_CATALOG
    : L5R5E_ADVANTAGE_CATALOG.filter((_, i) => L5R5E_ADVANTAGES[i]?.type === advFilter)

  const disTypes = [...new Set(L5R5E_DISADVANTAGES.map(d => d.type).filter(Boolean))].sort()
  const filteredDisCatalog = disFilter === 'all'
    ? L5R5E_DISADVANTAGE_CATALOG
    : L5R5E_DISADVANTAGE_CATALOG.filter((_, i) => L5R5E_DISADVANTAGES[i]?.type === disFilter)

  const weaponCategories = [...new Set(L5R5E_WEAPONS.map(w => w.category).filter(Boolean))].sort()
  const filteredWeaponCatalog = weaponFilter === 'all'
    ? L5R5E_WEAPON_CATALOG
    : L5R5E_WEAPON_CATALOG.filter((_, i) => L5R5E_WEAPONS[i]?.category === weaponFilter)

  const selectedClan = L5R5E_CLANS.find(c => c.value === fields.l5r5eClan)
  const selectedFamily = fields.l5r5eClan && fields.l5r5eFamily
    ? (L5R5E_FAMILIES[fields.l5r5eClan] || []).find(f => f.value === fields.l5r5eFamily)
    : null
  const selectedSchool = L5R5E_SCHOOLS.find(s => s.value === fields.l5r5eSchool)

  // ── Dice Roller ──
  function rollDie(faces) {
    const idx = Math.floor(Math.random() * faces.length)
    return { index: idx, face: faces[idx] }
  }

  function handleRoll() {
    const ringResults = []
    for (let i = 0; i < diceRingCount; i++) {
      const r = rollDie(RING_DIE)
      ringResults.push({ type: 'ring', ...r })
    }
    const skillResults = []
    for (let i = 0; i < diceSkillCount; i++) {
      const r = rollDie(SKILL_DIE)
      skillResults.push({ type: 'skill', ...r })
    }
    const allDice = [...ringResults, ...skillResults]
    setDiceRolled(allDice)
    setDiceKept([])
  }

  function toggleKeep(idx) {
    setDiceKept(prev => {
      if (prev.includes(idx)) return prev.filter(i => i !== idx)
      if (prev.length >= diceRingCount) return prev
      return [...prev, idx]
    })
  }

  function resolveRoll() {
    if (!diceRolled || diceKept.length === 0) return
    let successes = 0, opportunities = 0, strife = 0
    const explosions = []

    function tallyFace(face) {
      if (!face) return false
      successes += (face.success || 0) + (face.explosive || 0)
      opportunities += (face.opportunity || 0)
      strife += (face.strife || 0)
      if (face.explosive) return true
      return false
    }

    for (const idx of diceKept) {
      const die = diceRolled[idx]
      if (tallyFace(die.face)) {
        explosions.push(die.type)
      }
    }

    // Roll explosions
    let explosionDice = [...explosions]
    let safetyCounter = 0
    while (explosionDice.length > 0 && safetyCounter < 50) {
      safetyCounter++
      const nextExplosions = []
      for (const dType of explosionDice) {
        const faces = dType === 'ring' ? RING_DIE : SKILL_DIE
        const r = rollDie(faces)
        if (r.face) {
          successes += (r.face.success || 0) + (r.face.explosive || 0)
          opportunities += (r.face.opportunity || 0)
          strife += (r.face.strife || 0)
          if (r.face.explosive) nextExplosions.push(dType)
        }
      }
      explosionDice = nextExplosions
    }

    const entry = {
      ringCount: diceRingCount, skillCount: diceSkillCount,
      kept: diceKept.length, successes, opportunities, strife,
      time: new Date().toLocaleTimeString(),
    }
    setDiceHistory(prev => [entry, ...prev].slice(0, 15))
    setDiceRolled(null)
    setDiceKept([])
  }

  function dieFaceLabel(face) {
    if (!face) return 'Blank'
    const parts = []
    if (face.success) parts.push('Success')
    if (face.explosive) parts.push('Explosive')
    if (face.opportunity) parts.push('Opportunity')
    if (face.strife) parts.push('Strife')
    return parts.join(' + ') || 'Blank'
  }

  function dieFaceSymbols(face) {
    if (!face) return '-'
    const parts = []
    if (face.success) parts.push('\u25cf')
    if (face.explosive) parts.push('\u25cf!')
    if (face.opportunity) parts.push('\u2740')
    if (face.strife) parts.push('\ud83c\udf38')
    return parts.join(' ') || '-'
  }

  // ── Technique type badge color ──
  function techBadgeColor(type) {
    const colors = {
      Kata: '#e74c3c', 'Kih\u014d': '#27ae60', Invocation: '#2980b9',
      Ritual: '#8e44ad', 'Sh\u016bji': '#f39c12', 'Mah\u014d': '#2c3e50',
      Ninjutsu: '#7f8c8d',
    }
    return colors[type] || '#555'
  }

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/l5r5e')}>{t('back')}</button>
        <h2>{fields.name || 'L5R 5e Character'}</h2>
        <span className="splat-badge">L5R 5e</span>
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}
      {actionError && <p className="status-error" role="alert">{actionError}</p>}

      <div className="tab-list" role="tablist">
        {TAB_KEYS.map((tk, i) => (
          <button key={tk} role="tab" className={`btn btn-secondary${tab === i ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(i)} aria-selected={tab === i}>{t(tk)}</button>
        ))}
      </div>

      {/* ── Tab 0: Identity ── */}
      <div hidden={tab !== 0} role="tabpanel">
        <div className="form-section">
          <fieldset>
            <legend>{t('tabL5r5eIdentity')}</legend>
            <div className="field-row">
              <div className="field"><label htmlFor="l5r5e-name">{t('charName')} *</label><input id="l5r5e-name" name="name" value={fields.name} onChange={handleText} /></div>
              <div className="field"><label htmlFor="l5r5e-concept">{t('concept')}</label><input id="l5r5e-concept" name="concept" value={fields.concept} onChange={handleText} placeholder="Character concept" /></div>
            </div>
            <div className="field-row">
              <CatalogSelect id="l5r5eClan" name="l5r5eClan" label="Clan" value={fields.l5r5eClan}
                onChange={(name, val) => {
                  setFields(prev => {
                    const prevQ = parseJson(prev.l5r5eTwentyQuestions, {})
                    const next = { ...prev, [name]: val, l5r5eFamily: '', l5r5eSchool: '' }
                    // Revert old clan ring bonus
                    if (prevQ.clan_ring) {
                      next[prevQ.clan_ring] = Math.max(1, (next[prevQ.clan_ring] || 1) - 1)
                    }
                    // Revert old family ring bonus
                    if (prevQ.family_ring) {
                      next[prevQ.family_ring] = Math.max(1, (next[prevQ.family_ring] || 1) - 1)
                    }
                    // Revert old school ring bonuses
                    if (prevQ.school_rings && Array.isArray(prevQ.school_rings)) {
                      for (const rk of prevQ.school_rings) {
                        next[rk] = Math.max(1, (next[rk] || 1) - 1)
                      }
                    }
                    // Apply new clan bonuses
                    const newClan = L5R5E_CLANS.find(c => c.value === val)
                    const qData = { ...prevQ, clan_ring: null, family_ring: null, school_rings: null }
                    if (newClan) {
                      next.l5r5eStatus = newClan.status
                      const ringKey = ringLabelToKey(newClan.ringIncrease)
                      if (ringKey) {
                        next[ringKey] = Math.min(5, (next[ringKey] || 1) + 1)
                        qData.clan_ring = ringKey
                      }
                    }
                    next.l5r5eTwentyQuestions = JSON.stringify(qData)
                    return next
                  })
                }}
                catalog={L5R5E_CLAN_CATALOG} />
            </div>
            {selectedClan && (
              <div className="form-section p-md mt-xs mb-sm" style={{ background: 'rgba(52,152,219,0.08)', borderLeft: '3px solid var(--color-accent-fg)' }}>
                <div className="text-base lh-normal" >
                  <strong>Ring:</strong> +1 {selectedClan.ringIncrease} | <strong>Skill:</strong> +1 {selectedClan.skillIncrease} | <strong>Status:</strong> {selectedClan.status}
                </div>
              </div>
            )}
            <div className="field-row">
              <CatalogSelect id="l5r5eFamily" name="l5r5eFamily" label="Family" value={fields.l5r5eFamily}
                onChange={(name, val) => {
                  setFields(prev => {
                    const prevQ = parseJson(prev.l5r5eTwentyQuestions, {})
                    const next = { ...prev, [name]: val }
                    // Revert old family ring bonus
                    if (prevQ.family_ring) {
                      next[prevQ.family_ring] = Math.max(1, (next[prevQ.family_ring] || 1) - 1)
                    }
                    // Apply new family bonuses
                    const clanFamilies = L5R5E_FAMILIES[prev.l5r5eClan] || []
                    const family = clanFamilies.find(f => f.value === val)
                    const qData = { ...prevQ, family_ring: null }
                    if (family) {
                      next.l5r5eGlory = family.glory
                      // Apply first ring option automatically
                      const ringKey = ringLabelToKey(family.ringOptions?.[0])
                      if (ringKey) {
                        next[ringKey] = Math.min(5, (next[ringKey] || 1) + 1)
                        qData.family_ring = ringKey
                      }
                    }
                    next.l5r5eTwentyQuestions = JSON.stringify(qData)
                    return next
                  })
                }}
                catalog={familyCatalog} />
            </div>
            {selectedFamily && (
              <div className="form-section p-md mt-xs mb-sm" style={{ background: 'rgba(52,152,219,0.08)', borderLeft: '3px solid var(--color-accent-fg)' }}>
                <div className="text-base lh-normal" >
                  <strong>Ring (auto):</strong> +1 {selectedFamily.ringOptions[0]} (of {selectedFamily.ringOptions.join('/')}) | <strong>Skills (manual):</strong> {selectedFamily.skills.join(', ')} | <strong>Glory:</strong> {selectedFamily.glory} | <strong>Wealth:</strong> {selectedFamily.wealth} koku
                </div>
              </div>
            )}
            <div className="field-row">
              <CatalogSelect id="l5r5eSchool" name="l5r5eSchool" label="School" value={fields.l5r5eSchool}
                onChange={(name, val) => {
                  setFields(prev => {
                    const prevQ = parseJson(prev.l5r5eTwentyQuestions, {})
                    const next = { ...prev, [name]: val }
                    // Revert old school ring bonuses
                    if (prevQ.school_rings && Array.isArray(prevQ.school_rings)) {
                      for (const rk of prevQ.school_rings) {
                        next[rk] = Math.max(1, (next[rk] || 1) - 1)
                      }
                    }
                    // Apply new school bonuses
                    const school = L5R5E_SCHOOLS.find(s => s.value === val)
                    const qData = { ...prevQ, school_rings: null }
                    if (school) {
                      next.l5r5eHonor = school.honor
                      const bonuses = parseRingBonuses(school.rings)
                      const appliedKeys = []
                      for (const b of bonuses) {
                        const ringKey = ringLabelToKey(b.ring)
                        if (ringKey) {
                          next[ringKey] = Math.min(5, (next[ringKey] || 1) + b.amount)
                          appliedKeys.push(ringKey)
                        }
                      }
                      if (appliedKeys.length) qData.school_rings = appliedKeys
                    }
                    next.l5r5eTwentyQuestions = JSON.stringify(qData)
                    return next
                  })
                }}
                catalog={schoolCatalog} />
            </div>
            {selectedSchool && (
              <div className="form-section p-md mt-xs mb-sm" style={{ background: 'rgba(52,152,219,0.08)', borderLeft: '3px solid var(--color-accent-fg)' }}>
                <div className="text-base lh-normal" >
                  <strong>Type:</strong> {selectedSchool.type} | <strong>Rings:</strong> {selectedSchool.rings} | <strong>Honor:</strong> {selectedSchool.honor}<br/>
                  <strong>Techniques Available:</strong> {selectedSchool.techniques}<br/>
                  <strong>Starting:</strong> {selectedSchool.startingTechniques}<br/>
                  <strong>School Ability:</strong> {selectedSchool.schoolAbility}
                </div>
              </div>
            )}
            <div className="field-row">
              <div className="field">
                <label>School Rank</label>
                <input type="number" name="l5r5eSchoolRank" min={1} max={5} value={fields.l5r5eSchoolRank} onChange={handleNumber} className="text-center" style={{ width: '60px' }} />
              </div>
            </div>
            <div className="field-row">
              <div className="field flex-1" >
                <label>Ninj&#x14d; (Personal Desire)</label>
                <input name="l5r5eNinjo" value={fields.l5r5eNinjo} onChange={handleText} placeholder="What does your character want?" />
              </div>
              <div className="field flex-1" >
                <label>Giri (Duty)</label>
                <input name="l5r5eGiri" value={fields.l5r5eGiri} onChange={handleText} placeholder="What is your character obligated to do?" />
              </div>
            </div>
            <div className="field">
              <label>{t('appearanceLabel')}</label>
              <textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={4} className="w-full"
                placeholder="Describe your character's appearance..." />
            </div>
          </fieldset>
          {(selectedClan || selectedFamily || selectedSchool) && (
            <fieldset>
              <legend>{t('l5r5eCreationSummary')}</legend>
              <p className="muted-hint muted-hint--xs mb-sm">
                Ring bonuses are auto-applied when you select clan, family, and school. Skill bonuses are listed for reference — apply them on the Skills tab.
              </p>
              <div className="text-base" style={{ lineHeight: 1.8 }}>
                {selectedClan && (
                  <p style={{ margin: 0 }}><strong>{selectedClan.value} Clan:</strong> +1 {selectedClan.ringIncrease} <span className="text-accent text-sm" >(auto)</span>, +1 {selectedClan.skillIncrease} <span className="text-sm" style={{ color: 'var(--color-muted)' }}>(manual)</span>, Status {selectedClan.status} <span className="text-accent text-sm" >(auto)</span></p>
                )}
                {selectedFamily && (
                  <p style={{ margin: 0 }}><strong>{selectedFamily.value} Family:</strong> +1 {selectedFamily.ringOptions[0]} <span className="text-accent text-sm" >(auto — first option)</span>, {selectedFamily.skills.join(', ')} <span className="text-sm" style={{ color: 'var(--color-muted)' }}>(manual)</span>, Glory {selectedFamily.glory} <span className="text-accent text-sm" >(auto)</span>, {selectedFamily.wealth} koku</p>
                )}
                {selectedSchool && (
                  <p style={{ margin: 0 }}><strong>{selectedSchool.value}:</strong> Rings: {selectedSchool.rings} <span className="text-accent text-sm" >(auto)</span>, Starting Skills: {selectedSchool.skills} <span className="text-sm" style={{ color: 'var(--color-muted)' }}>(manual)</span>, Honor {selectedSchool.honor} <span className="text-accent text-sm" >(auto)</span></p>
                )}
              </div>
            </fieldset>
          )}
        </div>
      </div>

      {/* ── Tab 1: Twenty Questions ── */}
      <div hidden={tab !== 1} role="tabpanel">
        <div className="form-section">
          <fieldset>
            <legend>Game of Twenty Questions</legend>
            <p className="muted-hint mb-md">
              Walk through the 20 Questions from the L5R 5e corebook to build your character step by step.
              Answer each question to flesh out your character's identity, abilities, and story.
            </p>
            <div className="mb-lg" style={{ padding: 'var(--space-sm) var(--space-md)', background: 'rgba(52,152,219,0.08)', borderRadius: '8px' }}>
              <div className="flex items-center gap-sm" style={{ marginBottom: '4px' }}>
                <strong className="text-md" >Progress: {answeredCount}/20</strong>
                <span className="muted-hint muted-hint--xs">questions answered</span>
              </div>
              <div className="w-full" style={{ height: '8px', background: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(answeredCount / 20) * 100}%`, height: '100%', background: 'var(--color-accent-fg)', borderRadius: '4px', transition: 'width 0.3s ease' }} />
              </div>
            </div>
          </fieldset>
          {(() => {
            const parts = []
            let currentPart = null
            const identityQs = [1, 2, 3]
            const advantageQs = [9, 10, 11, 12]
            for (const q of TWENTY_QUESTIONS) {
              if (q.part !== currentPart) {
                currentPart = q.part
                parts.push(
                  <div key={`part-${q.part}`} className="mb-sm" style={{ marginTop: parts.length > 0 ? 'var(--space-lg)' : 0, padding: 'var(--space-sm) var(--space-md)', background: 'rgba(52,152,219,0.12)', borderLeft: '4px solid var(--color-accent-fg)', borderRadius: '0 4px 4px 0' }}>
                    <strong className="text-lg" >{q.part}</strong>
                  </div>
                )
              }

              // Questions 1-3: Identity tab references
              if (identityQs.includes(q.num)) {
                const displayVal = q.num === 1 ? fields.l5r5eClan : q.num === 2 ? fields.l5r5eFamily : fields.l5r5eSchool
                parts.push(
                  <fieldset key={`q-${q.num}`} className="mb-sm" >
                    <legend className="text-md" >Q{q.num}. {q.question}</legend>
                    <p className="muted-hint muted-hint--xs mb-xs font-italic">{q.hint}</p>
                    <div className="text-base" style={{ padding: 'var(--space-sm) var(--space-md)', background: 'rgba(52,152,219,0.06)', borderRadius: '4px' }}>
                      <em>Set on the Identity tab.</em>
                      {displayVal && <span className="ml-sm font-semibold" >Current: {displayVal}</span>}
                    </div>
                  </fieldset>
                )
              }
              // Question 4: Ring bonus radio buttons
              else if (q.num === 4) {
                parts.push(
                  <fieldset key={`q-${q.num}`} className="mb-sm" >
                    <legend className="text-md" >Q{q.num}. {q.question}</legend>
                    <p className="muted-hint muted-hint--xs mb-xs font-italic">{q.hint}</p>
                    <div className="flex-col" style={{ gap: '6px' }}>
                      {Q4_OPTIONS.map(opt => (
                        <label key={opt.ringLabel} className="flex items-center gap-sm cursor-pointer" style={{ padding: '4px 8px', borderRadius: '4px', background: twentyQ.q4 === opt.ringLabel ? 'rgba(52,152,219,0.12)' : 'transparent' }}>
                          <input type="radio" name="q4_ring" checked={twentyQ.q4 === opt.ringLabel}
                            onChange={() => handleQ4(opt.ringLabel)} />
                          <span className="text-base">{opt.label} <strong>(+1 {opt.ringLabel})</strong></span>
                        </label>
                      ))}
                    </div>
                    {twentyQ.q4 && (
                      <p className="mt-xs text-sm text-accent font-semibold" >
                        Applied: +1 {twentyQ.q4} Ring
                      </p>
                    )}
                  </fieldset>
                )
              }
              // Question 7: Clan relationship — Orthodox / Divergent
              else if (q.num === 7) {
                parts.push(
                  <fieldset key={`q-${q.num}`} className="mb-sm" >
                    <legend className="text-md" >Q{q.num}. {q.question}</legend>
                    <p className="muted-hint muted-hint--xs mb-xs font-italic">{q.hint}</p>
                    <div className="flex-col" style={{ gap: '6px' }}>
                      <label className="flex items-center gap-sm cursor-pointer" style={{ padding: '4px 8px', borderRadius: '4px', background: twentyQ.q7 === 'orthodox' ? 'rgba(52,152,219,0.12)' : 'transparent' }}>
                        <input type="radio" name="q7_choice" checked={twentyQ.q7 === 'orthodox'}
                          onChange={() => handleQ7('orthodox')} />
                        <span className="text-base">Orthodox <strong>(+5 Glory)</strong></span>
                      </label>
                      <label className="flex items-center gap-sm cursor-pointer" style={{ padding: '4px 8px', borderRadius: '4px', background: twentyQ.q7 === 'divergent' ? 'rgba(52,152,219,0.12)' : 'transparent' }}>
                        <input type="radio" name="q7_choice" checked={twentyQ.q7 === 'divergent'}
                          onChange={() => handleQ7('divergent', twentyQ.q7_skill || '')} />
                        <span className="text-base">Divergent <strong>(+1 rank in a skill you have at 0)</strong></span>
                      </label>
                      {twentyQ.q7 === 'divergent' && (
                        <div style={{ marginLeft: '28px' }}>
                          <input type="text" value={twentyQ.q7_skill || ''}
                            onChange={e => {
                              const qData = { ...twentyQ, q7_skill: e.target.value }
                              handleField('l5r5eTwentyQuestions', JSON.stringify(qData))
                            }}
                            placeholder="Which skill? (e.g. Commerce)"
                            className="text-base" style={{ width: '250px' }} />
                        </div>
                      )}
                    </div>
                    {twentyQ.q7 === 'orthodox' && (
                      <p className="mt-xs text-sm text-accent font-semibold" >
                        Applied: +5 Glory
                      </p>
                    )}
                    {twentyQ.q7 === 'divergent' && twentyQ.q7_skill && (
                      <p className="mt-xs text-sm text-accent font-semibold" >
                        Note: +1 rank in {twentyQ.q7_skill} (apply manually on Skills tab)
                      </p>
                    )}
                  </fieldset>
                )
              }
              // Question 8: Bushido — Staunch / Divergent
              else if (q.num === 8) {
                const Q8_SKILLS = ['Commerce', 'Labor', 'Medicine', 'Seafaring', 'Skulduggery', 'Survival']
                parts.push(
                  <fieldset key={`q-${q.num}`} className="mb-sm" >
                    <legend className="text-md" >Q{q.num}. {q.question}</legend>
                    <p className="muted-hint muted-hint--xs mb-xs font-italic">{q.hint}</p>
                    <div className="flex-col" style={{ gap: '6px' }}>
                      <label className="flex items-center gap-sm cursor-pointer" style={{ padding: '4px 8px', borderRadius: '4px', background: twentyQ.q8 === 'staunch' ? 'rgba(52,152,219,0.12)' : 'transparent' }}>
                        <input type="radio" name="q8_choice" checked={twentyQ.q8 === 'staunch'}
                          onChange={() => handleQ8('staunch')} />
                        <span className="text-base">Staunch believer <strong>(+10 Honor)</strong></span>
                      </label>
                      <label className="flex items-center gap-sm cursor-pointer" style={{ padding: '4px 8px', borderRadius: '4px', background: twentyQ.q8 === 'divergent' ? 'rgba(52,152,219,0.12)' : 'transparent' }}>
                        <input type="radio" name="q8_choice" checked={twentyQ.q8 === 'divergent'}
                          onChange={() => handleQ8('divergent', twentyQ.q8_skill || '')} />
                        <span className="text-base">Divergent views <strong>(+1 rank in a skill)</strong></span>
                      </label>
                      {twentyQ.q8 === 'divergent' && (
                        <div style={{ marginLeft: '28px' }}>
                          <select value={twentyQ.q8_skill || ''}
                            onChange={e => {
                              const qData = { ...twentyQ, q8_skill: e.target.value }
                              handleField('l5r5eTwentyQuestions', JSON.stringify(qData))
                            }}
                            className="text-base" style={{ width: '250px' }}>
                            <option value="">Select a skill...</option>
                            {Q8_SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      )}
                    </div>
                    {twentyQ.q8 === 'staunch' && (
                      <p className="mt-xs text-sm text-accent font-semibold" >
                        Applied: +10 Honor
                      </p>
                    )}
                    {twentyQ.q8 === 'divergent' && twentyQ.q8_skill && (
                      <p className="mt-xs text-sm text-accent font-semibold" >
                        Note: +1 rank in {twentyQ.q8_skill} (apply manually on Skills tab)
                      </p>
                    )}
                  </fieldset>
                )
              }
              // Questions 9-12: Advantages tab references
              else if (advantageQs.includes(q.num)) {
                const advLabel = q.num <= 10
                  ? (q.num === 9 ? 'Distinction' : 'Adversity')
                  : (q.num === 11 ? 'Passion' : 'Anxiety')
                const relevantList = q.num === 9 || q.num === 11 ? advantages : disadvantages
                const matching = relevantList.filter(a => a.type === advLabel)
                parts.push(
                  <fieldset key={`q-${q.num}`} className="mb-sm" >
                    <legend className="text-md" >Q{q.num}. {q.question}</legend>
                    <p className="muted-hint muted-hint--xs mb-xs font-italic">{q.hint}</p>
                    <div className="text-base" style={{ padding: 'var(--space-sm) var(--space-md)', background: 'rgba(52,152,219,0.06)', borderRadius: '4px' }}>
                      <em>Select on the Advantages tab.</em>
                      {matching.length > 0 && (
                        <span className="ml-sm font-semibold" >
                          Selected: {matching.map(a => a.value).join(', ')}
                        </span>
                      )}
                    </div>
                  </fieldset>
                )
              }
              // All other questions: plain textarea
              else {
                parts.push(
                  <fieldset key={`q-${q.num}`} className="mb-sm" >
                    <legend className="text-md" >Q{q.num}. {q.question}</legend>
                    <p className="muted-hint muted-hint--xs mb-xs font-italic">{q.hint}</p>
                    <textarea
                      value={twentyQ[`q${q.num}`] || ''}
                      onChange={e => handleQAnswer(q.num, e.target.value)}
                      rows={3}
                      className="w-full"
                      placeholder="Write your answer here..."
                    />
                  </fieldset>
                )
              }
            }
            return parts
          })()}
        </div>
      </div>

      {/* ── Tab 2: Rings ── */}
      <div hidden={tab !== 2} role="tabpanel">
        <div className="form-section">
          <fieldset>
            <legend>Rings</legend>
            <div className="grid gap-md" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
              {L5R5E_RINGS.map(ring => (
                <div key={ring.key} className="text-center p-sm border" style={{ borderRadius: '8px' }}>
                  <div className="font-bold text-lg" style={{ marginBottom: '2px' }}>{ring.label}</div>
                  <div className="text-sm text-muted" style={{ marginBottom: '4px' }}>{ring.description}</div>
                  <div className="font-bold text-accent" style={{ fontSize: '1.5rem' }}>{fields[ring.key]}</div>
                  <DotRating label="" name={ring.key} value={fields[ring.key]} onChange={handleField} min={1} max={5} />
                </div>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Derived Attributes</legend>
            <div className="grid gap-sm" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              <div className="p-sm border" style={{ borderRadius: '4px' }}>
                <strong>Endurance:</strong> {endurance} <span className="muted-hint muted-hint--xs">(Earth+Fire) x 2</span>
              </div>
              <div className="p-sm border" style={{ borderRadius: '4px' }}>
                <strong>Composure:</strong> {composure} <span className="muted-hint muted-hint--xs">(Earth+Water) x 2</span>
              </div>
              <div className="p-sm border" style={{ borderRadius: '4px' }}>
                <strong>Focus:</strong> {focus} <span className="muted-hint muted-hint--xs">Fire + Air</span>
              </div>
              <div className="p-sm border" style={{ borderRadius: '4px' }}>
                <strong>Vigilance:</strong> {vigilance} <span className="muted-hint muted-hint--xs">ceil((Air+Water) / 2)</span>
              </div>
              <div className="p-sm border" style={{ borderRadius: '4px' }}>
                <strong>Void Points Max:</strong> {voidPointsMax} <span className="muted-hint muted-hint--xs">= Void Ring</span>
              </div>
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Tab 3: Skills ── */}
      <div hidden={tab !== 3} role="tabpanel">
        <div className="form-section">
          {Object.entries(L5R5E_SKILL_GROUPS).map(([group, skillList]) => (
            <fieldset key={group}>
              <legend>{group} Skills</legend>
              <div className="flex-col" style={{ gap: '2px' }}>
                {skillList.map(skillName => (
                  <div key={skillName} className="flex items-center gap-sm border-b" style={{ padding: '2px 0' }}>
                    <span className="flex-1 text-base" >{skillName}</span>
                    <DotRating label="" name={skillName} value={getSkillLevel(skillName)}
                      onChange={(_, val) => setSkillLevel(skillName, val)} min={0} max={5} />
                  </div>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </div>

      {/* ── Tab 4: Techniques ── */}
      <div hidden={tab !== 4} role="tabpanel">
        <div className="form-section">
          <fieldset>
            <legend>Techniques</legend>
            <div className="mb-sm flex items-center gap-sm">
              <label htmlFor="tech-filter" className="text-base font-semibold">{t('l5r5eFilterType')}</label>
              <select id="tech-filter" value={techFilter} onChange={e => setTechFilter(e.target.value)} className="text-base">
                <option value="all">{t('filterAll')}</option>
                {techTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <CatalogSelect id="l5r5eTechAdd" name="l5r5eTechAdd" label="Add Technique"
              value="" onChange={(_, val) => {
                if (!val) return
                const tech = L5R5E_TECHNIQUES.find(tc => tc.value === val)
                if (tech && !techniques.find(tc => tc.value === tech.value)) {
                  setTechniques([...techniques, { value: tech.value, type: tech.type, ring: tech.ring, rank: tech.rank }])
                }
              }} catalog={filteredTechCatalog} showDescOnSelect={false} />
            {techniques.length === 0 && <p className="muted-hint mt-sm">No techniques learned yet.</p>}
            {techniques.length > 0 && (
              <div className="mt-md">
                {techniques.map((tech, i) => {
                  const full = L5R5E_TECHNIQUES.find(tc => tc.value === tech.value)
                  return (
                    <div key={i} className="flex items-center gap-sm border-b" style={{ padding: '6px 0' }}>
                      <span className="font-bold" style={{ background: techBadgeColor(tech.type), color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                        {tech.type}
                      </span>
                      <span className="flex-1 text-base font-semibold" >{tech.value}</span>
                      <span className="muted-hint muted-hint--xs">{tech.ring} R{tech.rank}</span>
                      {full && <span className="muted-hint muted-hint--xs" style={{ maxWidth: '300px' }}>{full.description}</span>}
                      <button className="btn btn-secondary text-sm" style={{ padding: '2px 8px' }}
                        onClick={() => setTechniques(techniques.filter((_, j) => j !== i))}>Remove</button>
                    </div>
                  )
                })}
              </div>
            )}
          </fieldset>
          {selectedSchool && (
            <fieldset>
              <legend>Curriculum Notes</legend>
              <textarea name="l5r5eCurriculum" value={fields.l5r5eCurriculum} onChange={handleText} rows={4} className="w-full"
                placeholder="Track your school curriculum progress here..." />
            </fieldset>
          )}
        </div>
      </div>

      {/* ── Tab 5: Advantages / Disadvantages ── */}
      <div hidden={tab !== 5} role="tabpanel">
        <div className="form-section">
          <fieldset>
            <legend>Advantages (Distinctions & Passions)</legend>
            <div className="mb-sm flex items-center gap-sm">
              <label htmlFor="adv-filter" className="text-base font-semibold">{t('l5r5eFilterType')}</label>
              <select id="adv-filter" value={advFilter} onChange={e => setAdvFilter(e.target.value)} className="text-base">
                <option value="all">{t('filterAll')}</option>
                {advTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <CatalogSelect id="l5r5eAdvAdd" name="l5r5eAdvAdd" label="Add Advantage"
              value="" onChange={(_, val) => {
                if (!val) return
                const adv = L5R5E_ADVANTAGES.find(a => a.value === val)
                if (adv && !advantages.find(a => a.value === adv.value)) {
                  setAdvantages([...advantages, { value: adv.value, type: adv.type, ring: adv.ring }])
                }
              }} catalog={filteredAdvCatalog} showDescOnSelect={false} />
            {advantages.length === 0 && <p className="muted-hint mt-sm">No advantages selected.</p>}
            {advantages.map((adv, i) => (
              <div key={i} className="flex items-center gap-sm border-b" style={{ padding: '4px 0' }}>
                <span className="font-bold" style={{ background: adv.type === 'Distinction' ? '#2980b9' : '#e67e22', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>
                  {adv.type}
                </span>
                <span className="flex-1 text-base font-semibold" >{adv.value}</span>
                <span className="muted-hint muted-hint--xs">{adv.ring}</span>
                <button className="btn btn-secondary text-sm" style={{ padding: '2px 8px' }}
                  onClick={() => setAdvantages(advantages.filter((_, j) => j !== i))}>Remove</button>
              </div>
            ))}
          </fieldset>

          <fieldset>
            <legend>Disadvantages (Adversities & Anxieties)</legend>
            <div className="mb-sm flex items-center gap-sm">
              <label htmlFor="dis-filter" className="text-base font-semibold">{t('l5r5eFilterType')}</label>
              <select id="dis-filter" value={disFilter} onChange={e => setDisFilter(e.target.value)} className="text-base">
                <option value="all">{t('filterAll')}</option>
                {disTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <CatalogSelect id="l5r5eDisAdd" name="l5r5eDisAdd" label="Add Disadvantage"
              value="" onChange={(_, val) => {
                if (!val) return
                const dis = L5R5E_DISADVANTAGES.find(d => d.value === val)
                if (dis && !disadvantages.find(d => d.value === dis.value)) {
                  setDisadvantages([...disadvantages, { value: dis.value, type: dis.type, ring: dis.ring }])
                }
              }} catalog={filteredDisCatalog} showDescOnSelect={false} />
            {disadvantages.length === 0 && <p className="muted-hint mt-sm">No disadvantages selected.</p>}
            {disadvantages.map((dis, i) => (
              <div key={i} className="flex items-center gap-sm border-b" style={{ padding: '4px 0' }}>
                <span className="font-bold" style={{ background: dis.type === 'Adversity' ? '#c0392b' : '#8e44ad', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>
                  {dis.type}
                </span>
                <span className="flex-1 text-base font-semibold" >{dis.value}</span>
                <span className="muted-hint muted-hint--xs">{dis.ring}</span>
                <button className="btn btn-secondary text-sm" style={{ padding: '2px 8px' }}
                  onClick={() => setDisadvantages(disadvantages.filter((_, j) => j !== i))}>Remove</button>
              </div>
            ))}
          </fieldset>
        </div>
      </div>

      {/* ── Tab 6: Combat ── */}
      <div hidden={tab !== 6} role="tabpanel">
        <div className="form-section">
          <fieldset>
            <legend>Endurance & Composure</legend>
            <div className="grid gap-md" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
              <div className="p-md border" style={{ borderRadius: '8px' }}>
                <div className="font-bold mb-xs" >Endurance</div>
                <div className="text-base text-muted mb-xs" >Max: {endurance}</div>
                <div className="field">
                  <label>Current</label>
                  <input type="number" name="l5r5eEnduranceCurrent" min={0} max={endurance}
                    value={fields.l5r5eEnduranceCurrent} onChange={handleNumber} className="text-center" style={{ width: '80px' }} />
                </div>
                {fields.l5r5eEnduranceCurrent >= endurance && (
                  <p className="font-semibold text-base" style={{ color: '#e55', marginTop: '4px' }}>Incapacitated!</p>
                )}
              </div>
              <div className="p-md border" style={{ borderRadius: '8px' }}>
                <div className="font-bold mb-xs" >Composure</div>
                <div className="text-base text-muted mb-xs" >Max: {composure}</div>
                <div className="field">
                  <label>Current</label>
                  <input type="number" name="l5r5eComposureCurrent" min={0} max={composure}
                    value={fields.l5r5eComposureCurrent} onChange={handleNumber} className="text-center" style={{ width: '80px' }} />
                </div>
                {fields.l5r5eComposureCurrent >= composure && (
                  <p className="font-semibold text-base" style={{ color: '#e55', marginTop: '4px' }}>Unmasked!</p>
                )}
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Strife & Void Points</legend>
            <div className="field-row">
              <div className="field">
                <label>Strife</label>
                <input type="number" name="l5r5eStrife" min={0} value={fields.l5r5eStrife} onChange={handleNumber} className="text-center" style={{ width: '80px' }} />
                {fields.l5r5eStrife >= composure && (
                  <span className="font-semibold text-base" style={{ color: '#e55', marginLeft: '8px' }}>Compromised!</span>
                )}
              </div>
              <div className="field">
                <label>Void Points ({voidPointsMax} max)</label>
                <input type="number" name="l5r5eVoidPoints" min={0} max={voidPointsMax}
                  value={fields.l5r5eVoidPoints} onChange={handleNumber} className="text-center" style={{ width: '80px' }} />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Combat Reference</legend>
            <div className="grid gap-sm" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
              <div className="p-sm border text-center" style={{ borderRadius: '4px' }}>
                <strong>Focus</strong><br/><span className="font-bold text-accent" style={{ fontSize: '1.2rem' }}>{focus}</span>
              </div>
              <div className="p-sm border text-center" style={{ borderRadius: '4px' }}>
                <strong>Vigilance</strong><br/><span className="font-bold text-accent" style={{ fontSize: '1.2rem' }}>{vigilance}</span>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Equipped Weapons</legend>
            {weapons.length === 0 && <p className="muted-hint">No weapons equipped. Add weapons in the Equipment tab.</p>}
            {weapons.length > 0 && (
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr className="border-b text-left" >
                    <th style={{ padding: '0.4rem' }}>Weapon</th>
                    <th style={{ padding: '0.4rem' }}>Category</th>
                    <th style={{ padding: '0.4rem' }}>Damage</th>
                    <th style={{ padding: '0.4rem' }}>Deadliness</th>
                    <th style={{ padding: '0.4rem' }}>Range</th>
                    <th style={{ padding: '0.4rem' }}>Grip</th>
                  </tr>
                </thead>
                <tbody>
                  {weapons.map((w, i) => (
                    <tr key={i} className="border-b" >
                      <td className="font-semibold" style={{ padding: '0.4rem' }}>{w.name}</td>
                      <td style={{ padding: '0.4rem' }}>{w.category}</td>
                      <td className="text-accent" style={{ padding: '0.4rem' }}>{w.damage}</td>
                      <td style={{ padding: '0.4rem' }}>{w.deadliness}</td>
                      <td style={{ padding: '0.4rem' }}>{w.range}</td>
                      <td style={{ padding: '0.4rem' }}>{w.grip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </fieldset>

          <fieldset>
            <legend>Worn Armor</legend>
            {armorList.length === 0 && <p className="muted-hint">No armor worn. Add armor in the Equipment tab.</p>}
            {armorList.map((a, i) => (
              <div key={i} className="border-b text-base" style={{ padding: '4px 0' }}>
                <strong>{a.name}</strong> — Physical Resistance {a.resistance} | {a.qualities}
              </div>
            ))}
          </fieldset>
        </div>
      </div>

      {/* ── Tab 7: Social ── */}
      <div hidden={tab !== 7} role="tabpanel">
        <div className="form-section">
          <fieldset>
            <legend>Honor, Glory & Status</legend>
            <p className="muted-hint muted-hint--xs mb-md">
              Values range from 0-100. Your rank equals the tens digit (e.g., Honor 45 = Rank 4).
            </p>
            <div className="grid gap-md" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              {[
                { label: 'Honor', name: 'l5r5eHonor', val: fields.l5r5eHonor },
                { label: 'Glory', name: 'l5r5eGlory', val: fields.l5r5eGlory },
                { label: 'Status', name: 'l5r5eStatus', val: fields.l5r5eStatus },
              ].map(stat => (
                <div key={stat.name} className="p-md border text-center" style={{ borderRadius: '8px' }}>
                  <div className="font-bold text-lg" style={{ marginBottom: '4px' }}>{stat.label}</div>
                  <div className="font-bold text-accent" style={{ fontSize: '2rem' }}>
                    {Math.floor(stat.val / 10)}
                  </div>
                  <div className="text-sm text-muted" style={{ marginBottom: '4px' }}>Rank {Math.floor(stat.val / 10)}</div>
                  <div className="field">
                    <input type="number" name={stat.name} min={0} max={100}
                      value={stat.val} onChange={handleNumber} className="text-center" style={{ width: '80px' }} />
                  </div>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Tab 8: Equipment ── */}
      <div hidden={tab !== 8} role="tabpanel">
        <div className="form-section">
          <fieldset>
            <legend>Weapons</legend>
            <div className="mb-sm flex items-center gap-sm">
              <label htmlFor="weapon-filter" className="text-base font-semibold">{t('l5r5eFilterCategory')}</label>
              <select id="weapon-filter" value={weaponFilter} onChange={e => setWeaponFilter(e.target.value)} className="text-base">
                <option value="all">{t('filterAll')}</option>
                {weaponCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <CatalogSelect id="l5r5eWeaponAdd" name="l5r5eWeaponAdd" label="Add Weapon"
              value="" onChange={(_, val) => {
                if (!val) return
                const item = L5R5E_WEAPONS.find(w => w.name === val)
                if (item) setWeapons([...weapons, { name: item.name, category: item.category, grip: item.grip, range: item.range, damage: item.damage, deadliness: item.deadliness, qualities: item.qualities }])
              }} catalog={filteredWeaponCatalog} showDescOnSelect={false} />
            {weapons.length > 0 && (
              <div className="mt-md" style={{ overflowX: 'auto' }}>
                <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr className="border-b text-left" >
                      <th style={{ padding: '0.4rem' }}>Weapon</th>
                      <th style={{ padding: '0.4rem' }}>Cat.</th>
                      <th style={{ padding: '0.4rem' }}>Grip</th>
                      <th style={{ padding: '0.4rem' }}>Range</th>
                      <th style={{ padding: '0.4rem' }}>Dmg</th>
                      <th style={{ padding: '0.4rem' }}>DL</th>
                      <th style={{ padding: '0.4rem' }}>Qualities</th>
                      <th style={{ padding: '0.4rem' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {weapons.map((w, i) => (
                      <tr key={i} className="border-b" >
                        <td className="font-semibold" style={{ padding: '0.4rem' }}>{w.name}</td>
                        <td style={{ padding: '0.4rem' }}>{w.category}</td>
                        <td style={{ padding: '0.4rem' }}>{w.grip}</td>
                        <td style={{ padding: '0.4rem' }}>{w.range}</td>
                        <td className="text-accent" style={{ padding: '0.4rem' }}>{w.damage}</td>
                        <td style={{ padding: '0.4rem' }}>{w.deadliness}</td>
                        <td className="text-sm" style={{ padding: '0.4rem' }}>{w.qualities}</td>
                        <td style={{ padding: '0.4rem' }}>
                          <button className="btn btn-secondary text-sm" style={{ padding: '2px 8px' }}
                            onClick={() => setWeapons(weapons.filter((_, j) => j !== i))}>Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </fieldset>

          <fieldset>
            <legend>Armor</legend>
            <CatalogSelect id="l5r5eArmorAdd" name="l5r5eArmorAdd" label="Add Armor"
              value="" onChange={(_, val) => {
                if (!val) return
                const item = L5R5E_ARMOR.find(a => a.name === val)
                if (item) setArmorList([...armorList, { name: item.name, resistance: item.resistance, qualities: item.qualities }])
              }} catalog={L5R5E_ARMOR_CATALOG} showDescOnSelect={false} />
            {armorList.length > 0 && (
              <div className="mt-md">
                {armorList.map((a, i) => (
                  <div key={i} className="flex justify-between items-center border-b" style={{ padding: '4px 0' }}>
                    <span className="text-base">
                      <strong>{a.name}</strong> — Resistance {a.resistance} | {a.qualities}
                    </span>
                    <button className="btn btn-secondary text-sm" style={{ padding: '2px 8px' }}
                      onClick={() => setArmorList(armorList.filter((_, j) => j !== i))}>Remove</button>
                  </div>
                ))}
              </div>
            )}
          </fieldset>

          <fieldset>
            <legend>Currency</legend>
            <div className="field-row">
              <div className="field text-center" >
                <label>Koku</label>
                <input type="number" min={0} value={inventory.koku}
                  onChange={e => setInventory({ ...inventory, koku: Number(e.target.value) || 0 })}
                  className="text-center" style={{ width: '80px' }} />
              </div>
              <div className="field text-center" >
                <label>Bu</label>
                <input type="number" min={0} value={inventory.bu}
                  onChange={e => setInventory({ ...inventory, bu: Number(e.target.value) || 0 })}
                  className="text-center" style={{ width: '80px' }} />
              </div>
              <div className="field text-center" >
                <label>Zeni</label>
                <input type="number" min={0} value={inventory.zeni}
                  onChange={e => setInventory({ ...inventory, zeni: Number(e.target.value) || 0 })}
                  className="text-center" style={{ width: '80px' }} />
              </div>
            </div>
            <p className="muted-hint muted-hint--xs">1 koku = 5 bu = 50 zeni</p>
          </fieldset>

          <fieldset>
            <legend>Inventory</legend>
            <div className="field-row mb-sm" >
              <div className="field flex-1" >
                <input type="text" value={newItem} onChange={e => setNewItem(e.target.value)}
                  placeholder="Add item..." onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      if (newItem.trim()) {
                        setInventory({ ...inventory, items: [...inventory.items, newItem.trim()] })
                        setNewItem('')
                      }
                    }
                  }} />
              </div>
              <button className="btn btn-secondary" onClick={() => {
                if (newItem.trim()) {
                  setInventory({ ...inventory, items: [...inventory.items, newItem.trim()] })
                  setNewItem('')
                }
              }}>Add</button>
            </div>
            {inventory.items.length === 0 && <p className="muted-hint">No items in inventory.</p>}
            {inventory.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center border-b" style={{ padding: '4px 0' }}>
                <span className="text-base">{item}</span>
                <button className="btn btn-secondary text-sm" style={{ padding: '2px 8px' }}
                  onClick={() => setInventory({ ...inventory, items: inventory.items.filter((_, j) => j !== i) })}>Drop</button>
              </div>
            ))}
          </fieldset>
        </div>
      </div>

      {/* ── Tab 9: Backstory ── */}
      <div hidden={tab !== 9} role="tabpanel">
        <div className="form-section">
          <fieldset>
            <legend>Ninj&#x14d; & Giri</legend>
            <div className="field">
              <label>Ninj&#x14d; (Personal Desire)</label>
              <textarea name="l5r5eNinjo" value={fields.l5r5eNinjo} onChange={handleText} rows={3} className="w-full"
                placeholder="What does your character want most?" />
            </div>
            <div className="field">
              <label>Giri (Duty)</label>
              <textarea name="l5r5eGiri" value={fields.l5r5eGiri} onChange={handleText} rows={3} className="w-full"
                placeholder="What obligation must your character fulfill?" />
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('backstoryLabel')}</legend>
            <textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} className="w-full"
              placeholder="Your character's backstory..." />
          </fieldset>
          <fieldset>
            <legend>{t('notes')}</legend>
            <textarea name="notes" value={fields.notes} onChange={handleText} rows={4} className="w-full"
              placeholder="Session notes, contacts, etc..." />
          </fieldset>
        </div>
      </div>

      {/* ── Tab 10: XP Log ── */}
      <div hidden={tab !== 10} role="tabpanel">
        <XpLogSection splat="l5r5e" xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)} t={t} />
      </div>

      {/* ── Tab 11: Dice Roller ── */}
      <div hidden={tab !== 11} role="tabpanel">
        <div className="form-section">
          <fieldset>
            <legend>L5R 5e Narrative Dice Roller</legend>
            <p className="muted-hint muted-hint--xs mb-sm">
              Roll Ring dice (d6) + Skill dice (d12). Keep up to your Ring value. Explosive successes roll additional dice.
            </p>
            <div className="field-row">
              <div className="field">
                <label htmlFor="dice-ring-count">Ring Dice (d6)</label>
                <input id="dice-ring-count" type="number" min={1} max={10} value={diceRingCount}
                  onChange={e => setDiceRingCount(Number(e.target.value) || 1)} className="text-center" style={{ width: '70px' }} />
              </div>
              <div className="field">
                <label htmlFor="dice-skill-count">Skill Dice (d12)</label>
                <input id="dice-skill-count" type="number" min={0} max={10} value={diceSkillCount}
                  onChange={e => setDiceSkillCount(Number(e.target.value) || 0)} className="text-center" style={{ width: '70px' }} />
              </div>
              <button className="btn btn-primary" style={{ alignSelf: 'flex-end' }} onClick={handleRoll}>Roll</button>
            </div>

            <p className="muted-hint muted-hint--xs mt-xs" >
              Symbols: Success = &#x25cf; | Explosive = &#x25cf;! | Opportunity = &#x2740; | Strife = &#x1f338;
            </p>
          </fieldset>

          {diceRolled && (
            <fieldset>
              <legend>Roll Results — Keep up to {diceRingCount} dice</legend>
              <div className="flex flex-wrap gap-sm mb-md" >
                {diceRolled.map((die, idx) => (
                  <button key={idx}
                    className={`btn ${diceKept.includes(idx) ? 'btn-primary' : 'btn-secondary'} text-md`}
                    onClick={() => toggleKeep(idx)}
                    aria-pressed={diceKept.includes(idx)}
                    style={{ padding: '8px 12px', minWidth: '80px', border: `2px solid ${die.type === 'ring' ? '#2980b9' : '#27ae60'}`, background: diceKept.includes(idx)
                        ? (die.type === 'ring' ? '#2980b9' : '#27ae60')
                        : 'transparent', color: diceKept.includes(idx) ? '#fff' : undefined }}
                    title={`${die.type === 'ring' ? 'Ring' : 'Skill'} die: ${dieFaceLabel(die.face)}`}
                  >
                    <div className="font-bold uppercase" style={{ fontSize: '0.65rem' }}>
                      {die.type === 'ring' ? 'Ring' : 'Skill'}
                    </div>
                    <div className="text-xl" >{dieFaceSymbols(die.face)}</div>
                  </button>
                ))}
              </div>
              <div className="flex gap-sm items-center" >
                <span className="muted-hint muted-hint--xs">Kept: {diceKept.length}/{diceRingCount}</span>
                <button className="btn btn-primary" onClick={resolveRoll} disabled={diceKept.length === 0}>
                  Resolve ({diceKept.length} kept)
                </button>
                <button className="btn btn-secondary" onClick={() => { setDiceRolled(null); setDiceKept([]) }}>
                  Cancel
                </button>
              </div>
            </fieldset>
          )}

          <fieldset>
            <legend>Roll History</legend>
            {diceHistory.length === 0 && <p className="muted-hint">No rolls yet.</p>}
            {diceHistory.map((h, i) => (
              <div key={i} className="border-b text-sm" style={{ padding: '4px 0' }}>
                <span className="text-muted" >{h.time}</span>{' '}
                <strong>{h.ringCount}r + {h.skillCount}s</strong> (kept {h.kept})
                {' \u2192 '}
                <span className="text-accent font-semibold" >{h.successes} successes</span>,{' '}
                <span>{h.opportunities} opportunity</span>,{' '}
                <span style={{ color: '#e55' }}>{h.strife} strife</span>
              </div>
            ))}
          </fieldset>
        </div>
      </div>

      {/* ── Tab 12: Rules Reference ── */}
      <div hidden={tab !== 12} role="tabpanel">
        <RulesReferenceTab rules={L5R5E_RULES} title="L5R 5th Edition Rules Reference" />
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => setShowExport(true)}>{t('exportPdf')}</button>
        <button className="btn btn-secondary" onClick={() => navigate('/l5r5e')}>{t('cancel')}</button>
        <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>{saving ? t('saving') : t('quickSave')}</button>
        <button className="btn btn-primary" onClick={handleDoneEditing} disabled={saving}>{t('doneEditing')}</button>
      </div>
      {viewMode && (
        <div className="view-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/l5r5e')}>{t('back')}</button>
          <button className="btn btn-primary" onClick={() => navigate(`/characters/${characterId}`, { replace: true })}>{t('edit')}</button>
        </div>
      )}
      <ExportModal open={showExport} onClose={() => setShowExport(false)} tabKeys={TAB_KEYS} t={t} />
    </div>
  )
}
