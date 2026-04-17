import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  getCharacter, updateCharacter,
  getBackgrounds, addBackground, removeBackground,
  getXpLog, addXpLogEntry, removeXpLogEntry,
  getDisciplines, addDiscipline, removeDiscipline,
} from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import DotRating from './DotRating'
import { L5R_EQUIPMENT, L5R_EQUIPMENT_CATEGORIES } from '../data/l5rEquipment'
import { L5R_KATA } from '../data/l5rKata'
import XpLogSection from './XpLogSection'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import TagInfoPanel from './TagInfoPanel'

// ── Clans & Families ──
const CLANS = {
  'Crab': { families: ['Hida', 'Hiruma', 'Kaiu', 'Kuni', 'Toritaka', 'Yasuki'], schools: ['Hida Bushi', 'Hiruma Bushi', 'Hiruma Scout', 'Kaiu Engineer', 'Kuni Shugenja', 'Kuni Witch Hunter', 'Toritaka Bushi', 'Yasuki Courtier', 'Hida Pragmatist'] },
  'Crane': { families: ['Asahina', 'Daidoji', 'Doji', 'Kakita'], schools: ['Asahina Shugenja', 'Daidoji Iron Warrior', 'Doji Courtier', 'Doji Magistrate', 'Kakita Bushi', 'Kakita Artisan'] },
  'Dragon': { families: ['Kitsuki', 'Mirumoto', 'Tamori', 'Togashi'], schools: ['Kitsuki Investigator', 'Mirumoto Bushi', 'Tamori Shugenja', 'Togashi Tattooed Order'] },
  'Lion': { families: ['Akodo', 'Ikoma', 'Kitsu', 'Matsu'], schools: ['Akodo Bushi', 'Ikoma Bard', 'Ikoma Lion\'s Shadow', 'Kitsu Shugenja', 'Matsu Berserker'] },
  'Mantis': { families: ['Kitsune', 'Moshi', 'Tsuruchi', 'Yoritomo'], schools: ['Kitsune Shugenja', 'Moshi Shugenja', 'Tsuruchi Archer', 'Tsuruchi Bounty Hunter', 'Yoritomo Bushi', 'Yoritomo Courtier'] },
  'Phoenix': { families: ['Agasha', 'Isawa', 'Shiba'], schools: ['Agasha Shugenja', 'Isawa Shugenja', 'Isawa Tensai', 'Shiba Bushi', 'Asako Loremaster'] },
  'Scorpion': { families: ['Bayushi', 'Shosuro', 'Soshi', 'Yogo'], schools: ['Bayushi Bushi', 'Bayushi Courtier', 'Shosuro Infiltrator', 'Soshi Shugenja', 'Yogo Shugenja'] },
  'Spider': { families: ['Chuda', 'Daigotsu', 'Goju', 'Ninube'], schools: ['Chuda Shugenja', 'Daigotsu Bushi', 'Daigotsu Courtier', 'Goju Ninja', 'Ninube Shugenja'] },
  'Unicorn': { families: ['Horiuchi', 'Ide', 'Iuchi', 'Moto', 'Shinjo', 'Utaku'], schools: ['Ide Emissary', 'Iuchi Shugenja', 'Moto Bushi', 'Moto Vindicator', 'Shinjo Bushi', 'Utaku Battle Maiden'] },
  'Imperial': { families: ['Miya', 'Otomo', 'Seppun'], schools: ['Miya Herald', 'Otomo Courtier', 'Seppun Guardsman', 'Seppun Shugenja'] },
  'Minor Clan': { families: [], schools: [] },
  'Ronin': { families: [], schools: ['Ronin (Various)'] },
}
const CLAN_NAMES = Object.keys(CLANS)

// ── Skill categories with associated traits (from lasthaiku.wikidot.com) ──
const SKILL_CATEGORIES = {
  'High Skills': [
    'Acting (Awareness)', 'Artisan (Awareness)', 'Calligraphy (Intelligence)', 'Courtier (Awareness)',
    'Divination (Intelligence)', 'Etiquette (Awareness)', 'Games (Varies)', 'Investigation (Perception)',
    'Lore (Intelligence)', 'Medicine (Intelligence)', 'Meditation (Void)', 'Perform (Varies)',
    'Sincerity (Awareness)', 'Spellcraft (Intelligence)', 'Tea Ceremony (Void)',
  ],
  'Bugei Skills': [
    'Athletics (Strength)', 'Battle (Perception)', 'Defense (Reflexes)', 'Horsemanship (Agility)',
    'Hunting (Perception)', 'Iaijutsu (Reflexes)', 'Jiujutsu (Agility)',
    'Chain Weapons (Agility)', 'Heavy Weapons (Agility)', 'Kenjutsu (Agility)',
    'Knives (Agility)', 'Kyujutsu (Reflexes)', 'Naginata (Agility)',
    'Polearms (Agility)', 'Spears (Agility)', 'Staves (Agility)', 'War Fan (Agility)',
  ],
  'Merchant Skills': [
    'Animal Handling (Awareness)', 'Commerce (Intelligence)', 'Craft (Varies)',
    'Engineering (Intelligence)', 'Sailing (Agility)',
  ],
  'Low Skills': [
    'Forgery (Agility)', 'Intimidation (Willpower)', 'Sleight of Hand (Agility)',
    'Stealth (Agility)', 'Temptation (Awareness)',
  ],
}

// ── Stances reference ──
const STANCES = [
  { name: 'Attack', ring: 'Water', description: 'Standard stance. No restrictions on Actions. Fluid and versatile.' },
  { name: 'Full Attack', ring: 'Fire', description: '+2k1 to attack rolls, but Armor TN reduced by 10. May only attack or move closer. Cannot use ranged attacks. +5 ft bonus movement.' },
  { name: 'Defense', ring: 'Air', description: 'Add Air Ring + Defense Skill Rank to Armor TN. No restrictions except you may not attack. Useful for casting spells in combat.' },
  { name: 'Full Defense', ring: 'Earth', description: 'Roll Defense/Reflexes and add half (rounded up) to Armor TN until next Turn. This counts as a Complex Action — only Free Actions allowed.' },
  { name: 'Center', ring: 'Void', description: 'Spend a Void Point. Cannot attack. On your next Turn, add a bonus of +1k1+Void Ring to one roll. Cannot be maintained for more than one Round. Cannot be used while in the Down Wound Rank.' },
]

const MANEUVERS = [
  { name: 'Called Shot', raises: 'Variable', description: 'Target a specific body part: limb (1 Raise), hand/foot (2), head (3), eye/finger (4).' },
  { name: 'Disarm', raises: '3', description: 'If attack succeeds, target must roll Reflexes at TN equal to damage dealt or drop weapon.' },
  { name: 'Extra Attack', raises: '5', description: 'Make one additional attack this Turn (max one extra per Turn).' },
  { name: 'Feint', raises: '2', description: 'Ignore target\'s Armor bonus from armor (not Reflexes or other bonuses).' },
  { name: 'Guard', raises: '0', description: 'Simple Action. Protect an adjacent ally — attacks against them must target you instead.' },
  { name: 'Increased Damage', raises: '1 per +1k0', description: 'Each Raise adds +1k0 to your damage roll.' },
  { name: 'Knockdown', raises: '2', description: 'If attack succeeds, target is knocked Prone.' },
]

// ── Advantages catalogue ──
const L5R_ADVANTAGES = [
  { name: 'Absolute Direction', cost: 1, description: 'You always know which direction is north.' },
  { name: 'Allies', cost: 'Variable', description: 'Social connections willing to help you. Cost = Influence + Devotion.' },
  { name: 'Balance', cost: 2, description: '+1k0 to resist Intimidation/Temptation when adding Honor.' },
  { name: 'Battle Healing', cost: 5, description: 'Expend spell slots to heal one Wound Rank on a Rokugani you touch.' },
  { name: 'Blackmail', cost: 'Variable', description: 'You possess proof of another\'s dark secret. Cost = their Status.' },
  { name: 'Bland', cost: 2, description: '+10 TN for others to recognize or identify you.' },
  { name: 'Blissful Betrothal', cost: 3, description: 'Happy arranged marriage. Gentry, Social Position, Wealth cost 2 less.' },
  { name: 'Blood of Osano-Wo', cost: 4, description: 'Immune to natural weather damage. Reduce elemental spell damage by 1k1.' },
  { name: 'Chosen by the Oracles', cost: 6, description: '+1k1 to all Ring Rolls using one chosen Ring.' },
  { name: 'Clear Thinker', cost: 3, description: '+1k0 on Contested Rolls vs. confusion or manipulation.' },
  { name: 'Crab Hands', cost: 3, description: 'Treat unfamiliar Weapon Skills as Rank 1 instead of Unskilled.' },
  { name: 'Crafty', cost: 3, description: 'Treat Low Skills at Rank 0 as Rank 1 (avoid Unskilled penalties).' },
  { name: 'Dangerous Beauty', cost: 3, description: '+1k0 to Temptation rolls against the opposite sex.' },
  { name: 'Daredevil', cost: 3, description: '+3k1 instead of +1k1 when spending Void on Athletics.' },
  { name: 'Darling of the Court', cost: 2, description: 'You are adored by courtiers and gain social advantages at court.' },
  { name: 'Different School', cost: 5, description: 'Attend a school of a different Clan.' },
  { name: 'Elemental Blessing', cost: 4, description: 'Reduce XP cost to raise both Traits of one Ring by 1.' },
  { name: 'Fame', cost: 3, description: 'Your Glory Rank is effectively 1 higher for recognition.' },
  { name: 'Forbidden Knowledge', cost: 5, description: 'You possess dangerous lore. +1k0 to one Lore of your choice.' },
  { name: 'Friend of the Elements', cost: 4, description: 'One element\'s kami are friendlier to you. +1k0 to spells of that element.' },
  { name: 'Great Destiny', cost: 5, description: 'Once per session, survive what would otherwise kill you.' },
  { name: 'Hands of Stone', cost: 6, description: 'Unarmed damage is 0k2 instead of 0k1.' },
  { name: 'Hero of the People', cost: 2, description: 'Peasants love and trust you, providing aid when possible.' },
  { name: 'Higher Purpose', cost: 3, description: '+1k0 to rolls directly related to your chosen cause.' },
  { name: 'Inheritance', cost: 5, description: 'You have inherited a significant item (weapon, armor, etc.).' },
  { name: 'Inner Gift', cost: 7, description: 'You possess a minor supernatural gift (GM approval required).' },
  { name: 'Irreproachable', cost: 2, description: '+1k0 to resist Temptation and Intimidation.' },
  { name: 'Ishiken-Do', cost: 8, description: 'You can cast Void spells. Extremely rare.' },
  { name: 'Kharmic Tie', cost: 1, description: 'Deep spiritual bond with another PC. Shared fate.' },
  { name: 'Large', cost: 4, description: 'Significantly larger than average. +1k0 to damage rolls.' },
  { name: 'Leadership', cost: 6, description: '+1k0 to Battle rolls. Followers have higher morale.' },
  { name: 'Luck', cost: '3/6/9', description: 'Reroll 1/2/3 times per session (keep better result).' },
  { name: 'Magic Resistance', cost: '2/4/6', description: '+5/+10/+15 to TN of all spells targeting you.' },
  { name: 'Multiple Schools', cost: 10, description: 'You have trained in a second School (requires GM approval).' },
  { name: 'Paragon', cost: 7, description: 'Embody a tenet of Bushido. Gain a special benefit related to it.' },
  { name: 'Perceived Honor', cost: 3, description: 'Your Honor appears 1 Rank higher for social purposes.' },
  { name: 'Precise Memory', cost: 3, description: 'You can recall details with near-perfect accuracy.' },
  { name: 'Quick', cost: 6, description: '+1k0 to all Initiative rolls.' },
  { name: 'Quick Healer', cost: 3, description: 'Heal twice as fast as normal.' },
  { name: 'Read Lips', cost: 4, description: 'You can read lips with an Investigation/Perception roll.' },
  { name: 'Sacred Weapon', cost: 'Variable', description: 'A weapon of spiritual significance with special properties.' },
  { name: 'Sage', cost: 4, description: '+1k0 to all Lore Skill Rolls.' },
  { name: 'Sensation', cost: 3, description: '+1k0 to all Artisan and Perform Skill Rolls.' },
  { name: 'Silent', cost: 3, description: '+1k0 to all Stealth Skill Rolls.' },
  { name: 'Social Position', cost: 6, description: 'Status Rank 1 higher than normal for your School/Family.' },
  { name: 'Soul of Artistry', cost: 4, description: 'Pick one Artisan skill. You gain +1k1 with it.' },
  { name: 'Strength of the Earth', cost: 3, description: 'Reduce all Wound TN penalties by 3.' },
  { name: 'Tactician', cost: 4, description: '+1k0 to all Battle Skill Rolls.' },
  { name: 'Touch of the Spirit Realms', cost: 5, description: 'Mystical connection to a spirit realm with minor benefits.' },
  { name: 'Virtuous', cost: 3, description: '+1k0 to resist any temptation to act dishonorably.' },
  { name: 'Voice', cost: 3, description: '+1k0 to any Social Skill Roll involving speaking.' },
  { name: 'Wary', cost: 3, description: '+1k1 to Investigation rolls to detect ambush or surprise.' },
  { name: 'Way of the Land', cost: 2, description: 'You know a specific region intimately. No movement penalties there.' },
  { name: 'Wealthy', cost: '1-5', description: 'Greater starting koku and resources.' },
]

// ── Disadvantages catalogue ──
const L5R_DISADVANTAGES = [
  { name: 'Antisocial', cost: '2/4', description: '-1k0 or -1k1 to all Social Skill Rolls.' },
  { name: 'Ascetic', cost: 2, description: 'No material possessions beyond essentials. Half Glory awards.' },
  { name: 'Bad Eyesight', cost: 3, description: '-1k1 to ranged attacks and Perception-based rolls.' },
  { name: 'Bad Fortune', cost: 3, description: 'Kharma has cursed you (Secret Love, Evil Eye, Unknown Enemy, etc.).' },
  { name: 'Bad Health', cost: 4, description: 'Earth Ring -1 for Wound Ranks and disease resistance.' },
  { name: 'Bitter Betrothal', cost: 2, description: 'Unhappy arranged marriage causing domestic difficulties.' },
  { name: 'Blackmailed', cost: 'Variable', description: 'Someone knows your dark secret. Cost = your Status.' },
  { name: 'Black Sheep', cost: 3, description: 'Your family is disgusted with you. No welcome at home.' },
  { name: 'Blind', cost: 6, description: '-3k3 ranged, -1k1 melee. Armor TN = Reflexes + 5.' },
  { name: 'Brash', cost: 3, description: 'Must roll Willpower TN 25 or attack when insulted.' },
  { name: 'Can\'t Lie', cost: 2, description: 'Psychologically incapable of telling lies.' },
  { name: 'Cast Out', cost: '1/3', description: 'Denounced by monks. They treat your Glory as Infamy.' },
  { name: 'Compulsion', cost: '2-4', description: 'Hopelessly compelled to partake in an activity.' },
  { name: 'Contrary', cost: 3, description: 'Must share opinions and argue in every discussion.' },
  { name: 'Cursed by the Realm', cost: 4, description: 'Penalties when dealing with spirits from a specific realm.' },
  { name: 'Dark Fate', cost: 3, description: 'Destined to die a terrible, specific death.' },
  { name: 'Dark Secret', cost: 4, description: 'You hide a shameful truth that would destroy you if revealed.' },
  { name: 'Disbeliever', cost: 3, description: 'You doubt the spiritual world. -1k0 to interact with spirits/kami.' },
  { name: 'Dishonored', cost: 5, description: 'You have been publicly shamed. Status effectively 0.' },
  { name: 'Disturbing Countenance', cost: 3, description: 'Something unsettling about your appearance. -1k0 to social rolls.' },
  { name: 'Doubt', cost: 4, description: '-1k1 when using one specific Skill.' },
  { name: 'Driven', cost: 2, description: 'Obsessed with a goal. Must pursue it at risk of Honor loss.' },
  { name: 'Epilepsy', cost: 4, description: 'Seizures under stress. Roll Stamina TN 20 or be incapacitated.' },
  { name: 'Failure of Bushido', cost: 'Variable', description: 'Weak in one tenet of Bushido. Specific penalties apply.' },
  { name: 'Fascination', cost: 1, description: 'Obsessed with a specific topic. Must investigate when encountered.' },
  { name: 'Frail Mind', cost: 3, description: '-1k0 to resist Fear effects and Intimidation.' },
  { name: 'Greedy', cost: 3, description: 'Will go to great lengths to acquire wealth and material goods.' },
  { name: 'Gullible', cost: 4, description: '-1k1 to detect lies and resist manipulation.' },
  { name: 'Haunted', cost: 3, description: 'A restless spirit follows you and causes problems.' },
  { name: 'Hostage', cost: 3, description: 'You are a political hostage in another Clan.' },
  { name: 'Idealistic', cost: 2, description: 'Naive about the darker side of the world.' },
  { name: 'Infamous', cost: 2, description: 'Your Glory functions as Infamy. People distrust you.' },
  { name: 'Insensitive', cost: 2, description: '-1k0 to Courtier and Etiquette rolls.' },
  { name: 'Jealousy', cost: 3, description: 'Consumed by envy of another\'s success or possessions.' },
  { name: 'Lame', cost: 4, description: 'Water Ring -1 for movement. -1k0 to Athletics.' },
  { name: 'Lost Love', cost: 3, description: 'Someone you loved is dead or gone. Emotional vulnerability.' },
  { name: 'Low Pain Threshold', cost: 4, description: 'Wound TN penalties are 3 points worse per rank.' },
  { name: 'Obligation', cost: 'Variable', description: 'You owe a significant debt to someone of influence.' },
  { name: 'Obtuse', cost: 3, description: '-1k0 to Investigation and Perception rolls.' },
  { name: 'Overconfident', cost: 3, description: 'You believe you can handle any situation. Reckless behavior.' },
  { name: 'Permanent Wound', cost: 4, description: 'You have a wound that never fully heals. Always at Nicked.' },
  { name: 'Small', cost: 3, description: 'Smaller than average. -1k0 to damage rolls.' },
  { name: 'Sworn Enemy', cost: 'Variable', description: 'Someone of influence wants you ruined or dead.' },
  { name: 'True Love', cost: 3, description: 'In love with someone. Creates vulnerability and obligations.' },
  { name: 'Wrath of the Kami', cost: 3, description: '-1k0 to spell casting with one specific element.' },
]

// ── Wound Rank table reference ──
const WOUND_RANKS = [
  { name: 'Healthy', penalty: '+0' },
  { name: 'Nicked', penalty: '+3' },
  { name: 'Grazed', penalty: '+5' },
  { name: 'Hurt', penalty: '+10' },
  { name: 'Injured', penalty: '+15' },
  { name: 'Crippled', penalty: '+20' },
  { name: 'Down', penalty: '+40' },
  { name: 'Out', penalty: 'Cannot act' },
]

const INITIAL = {
  npc: false, splat: 'L5R',
  name: '', altName: '', concept: '',
  nature: '', demeanor: '',
  l5rClan: '', l5rFamily: '', l5rSchool: '',
  // Traits (Air)
  l5rReflexes: 2, l5rAwareness: 2,
  // Traits (Earth)
  l5rStamina7: 2, l5rWillpower7: 2,
  // Traits (Fire)
  l5rAgility: 2, l5rIntelligence7: 2,
  // Traits (Water)
  l5rStrength7: 2, l5rPerception7: 2,
  // Void
  l5rVoid: 2, l5rCurrentVoid: 2,
  // Derived
  l5rHonor: 0, l5rGlory: 10, l5rStatus: 10,
  l5rInsight: 0, l5rSchoolRank: 1, l5rWounds: 0,
  l5rInitiative: 0, l5rArmorTN: 0,
  // Text fields
  l5rTechniques: '', l5rSkillsText: '', l5rSpells: '', l5rKata: '',
  // Shared
  backstory: '', notes: '', appearanceDesc: '', personalItems: '',
}

const TAB_KEYS = ['tabIdentity', 'tabL5rRings', 'tabL5rSkills', 'tabL5rAdvantages', 'tabL5rTechniques', 'tabL5rSpells', 'tabL5rKata', 'tabL5rCombat', 'tabL5rDerived', 'tabL5rEquipment', 'tabBackstory', 'tabXpLog']

export default function L5RForm() {
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
  const [backgrounds, setBackgrounds] = useState([])
  const [disciplines, setDisciplines] = useState([])
  const [xpLog, setXpLog] = useState([])
  const [newBackground, setNewBackground] = useState({ name: '', level: 1, description: '' })
  const [newAdv, setNewAdv] = useState({ name: '', level: 1, notes: '' })
  const [tagInfo, setTagInfo] = useState(null)
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [actionError, setActionError] = useState(null)

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

  function handleField(name, value) { setFields(prev => ({ ...prev, [name]: typeof value === 'string' ? value : Number(value) })) }
  function handleText(e) { setFields(prev => ({ ...prev, [e.target.name]: e.target.value })) }

  async function handleSave() {
    setSaving(true); setSaveError(null)
    try { await updateCharacter(characterId, fields) }
    catch { setSaveError(t('failedToSave')) }
    finally { setSaving(false) }
  }

  async function handleDoneEditing() { await handleSave(); navigate('/l5r') }

  async function handleAddAdvantage() {
    if (!newAdv.name.trim()) return
    try {
      const hit = L5R_ADVANTAGES.find(a => a.name === newAdv.name)
      const adv = hit ? { name: hit.name, level: typeof hit.cost === 'number' ? hit.cost : newAdv.level, notes: '' } : newAdv
      const res = await addDiscipline(characterId, adv)
      setDisciplines(prev => [...prev, res.data])
      setNewAdv({ name: '', level: 1, notes: '' })
    } catch { setActionError(t('failedToSave')) }
  }

  async function handleAddDisadvantage() {
    if (!newBackground.name.trim()) return
    try {
      const hit = L5R_DISADVANTAGES.find(d => d.name === newBackground.name)
      const disadv = hit
        ? { name: hit.name, level: typeof hit.cost === 'number' ? hit.cost : (newBackground.level || 1), description: '' }
        : newBackground
      const res = await addBackground(characterId, disadv)
      setBackgrounds(prev => [...prev, res.data])
      setNewBackground({ name: '', level: 1, description: '' })
    } catch { setActionError(t('failedToSave')) }
  }

  // ── Computed Ring values ──
  const airRing = Math.min(fields.l5rReflexes, fields.l5rAwareness)
  const earthRing = Math.min(fields.l5rStamina7, fields.l5rWillpower7)
  const fireRing = Math.min(fields.l5rAgility, fields.l5rIntelligence7)
  const waterRing = Math.min(fields.l5rStrength7, fields.l5rPerception7)
  const voidRing = fields.l5rVoid

  // Families filtered by selected clan
  const selectedFamilies = fields.l5rClan && CLANS[fields.l5rClan] ? CLANS[fields.l5rClan].families : []

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/l5r')}>{t('back')}</button>
        <h2>{fields.name || t('editL5rCharacter')}</h2>
        <span className="splat-badge splat-badge--l5r">L5R</span>
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}
      {actionError && <p className="status-error" role="alert">{actionError}</p>}

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
              <div className="field"><label>{t('charName')} *</label><input name="name" value={fields.name} onChange={handleText} /></div>
              <div className="field"><label>{t('concept')}</label><input name="concept" value={fields.concept} onChange={handleText} /></div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Clan</label>
                <select name="l5rClan" value={fields.l5rClan} onChange={e => { handleText(e); setFields(prev => ({ ...prev, l5rClan: e.target.value, l5rFamily: '' })) }}>
                  <option value="">{t('select')}</option>
                  {CLAN_NAMES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Family</label>
                {selectedFamilies.length > 0 ? (
                  <select name="l5rFamily" value={fields.l5rFamily} onChange={handleText}>
                    <option value="">{t('select')}</option>
                    {selectedFamilies.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                ) : (
                  <input name="l5rFamily" value={fields.l5rFamily} onChange={handleText} placeholder="Enter family name..." />
                )}
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>School</label>
                {fields.l5rClan && CLANS[fields.l5rClan]?.schools?.length > 0 ? (
                  <select name="l5rSchool" value={fields.l5rSchool} onChange={handleText}>
                    <option value="">{t('select')}</option>
                    {CLANS[fields.l5rClan].schools.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : (
                  <input name="l5rSchool" value={fields.l5rSchool} onChange={handleText} placeholder="Enter school name..." />
                )}
              </div>
            </div>
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

      {/* ── Rings & Traits ── */}
      <div hidden={tab !== 1}>
        <div className="form-section">
          <fieldset>
            <legend>Rings &amp; Traits</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Each Ring equals the lower of its two Traits. Starting characters begin with all Traits at 2.
            </p>

            {/* Air */}
            <fieldset style={{ marginBottom: 'var(--space-md)' }}>
              <legend>Air Ring: {airRing}</legend>
              <div className="rating-grid">
                <div className="ability-row"><DotRating label="Reflexes (Physical)" name="l5rReflexes" value={fields.l5rReflexes} onChange={handleField} min={2} max={10} /></div>
                <div className="ability-row"><DotRating label="Awareness (Mental)" name="l5rAwareness" value={fields.l5rAwareness} onChange={handleField} min={2} max={10} /></div>
              </div>
            </fieldset>

            {/* Earth */}
            <fieldset style={{ marginBottom: 'var(--space-md)' }}>
              <legend>Earth Ring: {earthRing}</legend>
              <div className="rating-grid">
                <div className="ability-row"><DotRating label="Stamina (Physical)" name="l5rStamina7" value={fields.l5rStamina7} onChange={handleField} min={2} max={10} /></div>
                <div className="ability-row"><DotRating label="Willpower (Mental)" name="l5rWillpower7" value={fields.l5rWillpower7} onChange={handleField} min={2} max={10} /></div>
              </div>
            </fieldset>

            {/* Fire */}
            <fieldset style={{ marginBottom: 'var(--space-md)' }}>
              <legend>Fire Ring: {fireRing}</legend>
              <div className="rating-grid">
                <div className="ability-row"><DotRating label="Agility (Physical)" name="l5rAgility" value={fields.l5rAgility} onChange={handleField} min={2} max={10} /></div>
                <div className="ability-row"><DotRating label="Intelligence (Mental)" name="l5rIntelligence7" value={fields.l5rIntelligence7} onChange={handleField} min={2} max={10} /></div>
              </div>
            </fieldset>

            {/* Water */}
            <fieldset style={{ marginBottom: 'var(--space-md)' }}>
              <legend>Water Ring: {waterRing}</legend>
              <div className="rating-grid">
                <div className="ability-row"><DotRating label="Strength (Physical)" name="l5rStrength7" value={fields.l5rStrength7} onChange={handleField} min={2} max={10} /></div>
                <div className="ability-row"><DotRating label="Perception (Mental)" name="l5rPerception7" value={fields.l5rPerception7} onChange={handleField} min={2} max={10} /></div>
              </div>
            </fieldset>

            {/* Void */}
            <fieldset style={{ marginBottom: 'var(--space-md)' }}>
              <legend>Void Ring: {voidRing}</legend>
              <div className="rating-grid">
                <div className="ability-row"><DotRating label="Void" name="l5rVoid" value={fields.l5rVoid} onChange={handleField} min={2} max={10} /></div>
                <div className="ability-row"><DotRating label="Current Void Points" name="l5rCurrentVoid" value={fields.l5rCurrentVoid} onChange={handleField} min={0} max={fields.l5rVoid} /></div>
              </div>
            </fieldset>
          </fieldset>
        </div>
      </div>

      {/* ── Skills ── */}
      <div hidden={tab !== 2}>
        <div className="form-section">
          <fieldset>
            <legend>Skills</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              List your skills with ranks and emphases. Format: &quot;Kenjutsu (Katana) 3, Etiquette 2, Lore: Bushido 2&quot;
            </p>
            <textarea name="l5rSkillsText" value={fields.l5rSkillsText} onChange={handleText} rows={10} style={{ width: '100%' }} placeholder={
`Kenjutsu (Katana) 3
Etiquette 2
Investigation 3
Lore: Bushido 2
Iaijutsu (Focus) 3
Sincerity 2
Defense 2`} />
          </fieldset>

          <fieldset>
            <legend>Skill Reference</legend>
            {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
              <details key={category} style={{ marginBottom: 'var(--space-sm)' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>{category}</summary>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6, padding: 'var(--space-sm) 0' }}>{skills.join(', ')}</p>
              </details>
            ))}
          </fieldset>
        </div>
      </div>

      {/* ── Advantages / Disadvantages ── */}
      <div hidden={tab !== 3}>
        <div className="form-section">
          {/* Advantages */}
          <fieldset>
            <legend>Advantages</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Advantages are purchased with Experience Points during character creation. Select from the catalogue or add custom entries.
            </p>
            {disciplines.length > 0 && (
              <ul className="tag-list">
                {disciplines.map(d => (
                  <li key={d.id} className={`tag tag--clickable${d.id === tagInfo?.id ? ' tag--active' : ''}`}
                    onClick={() => setTagInfo(ti => ti?.id === d.id ? null : { ...d, kind: 'advantage' })}>
                    <span>{d.name} ({d.level} pt{d.level !== 1 ? 's' : ''})</span>
                    <button className="tag-remove" onClick={e => { e.stopPropagation(); removeDiscipline(characterId, d.id); setDisciplines(prev => prev.filter(x => x.id !== d.id)); if (tagInfo?.id === d.id) setTagInfo(null) }}>x</button>
                  </li>
                ))}
              </ul>
            )}
            <div className="field-row" style={{ alignItems: 'flex-end' }}>
              <div className="field" style={{ flex: 2 }}>
                <label>Advantage</label>
                <input type="text" list="l5r-adv-catalog" value={newAdv.name}
                  onChange={e => {
                    const val = e.target.value
                    const hit = L5R_ADVANTAGES.find(a => a.name === val)
                    if (hit) setNewAdv({ name: hit.name, level: typeof hit.cost === 'number' ? hit.cost : 1, notes: '' })
                    else setNewAdv(p => ({ ...p, name: val }))
                  }}
                  placeholder="Select or type advantage..." autoComplete="off" />
                <datalist id="l5r-adv-catalog">
                  {L5R_ADVANTAGES.map(a => <option key={a.name} value={a.name} />)}
                </datalist>
              </div>
              <div className="field">
                <label>Cost (XP)</label>
                <select value={newAdv.level} onChange={e => setNewAdv(p => ({ ...p, level: parseInt(e.target.value) }))}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <button className="btn btn-secondary" onClick={handleAddAdvantage}>{t('add')}</button>
            </div>
          </fieldset>
          {tagInfo?.kind === 'advantage' && (() => {
            const entry = L5R_ADVANTAGES.find(a => a.name.toLowerCase() === tagInfo.name.toLowerCase())
            return <TagInfoPanel entry={entry ? { name: entry.name, description: `Cost: ${entry.cost} XP. ${entry.description}` } : { name: tagInfo.name }} onClose={() => setTagInfo(null)} />
          })()}

          {/* Disadvantages */}
          <fieldset>
            <legend>Disadvantages</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Disadvantages grant bonus Experience Points during character creation. They represent flaws, obligations, and weaknesses.
            </p>
            {backgrounds.length > 0 && (
              <ul className="tag-list">
                {backgrounds.map(b => (
                  <li key={b.id} className={`tag tag--clickable${b.id === tagInfo?.id ? ' tag--active' : ''}`}
                    onClick={() => setTagInfo(ti => ti?.id === b.id ? null : { ...b, kind: 'disadvantage' })}>
                    <span>{b.name} ({b.level} pt{b.level !== 1 ? 's' : ''}){b.description ? ` — ${b.description}` : ''}</span>
                    <button className="tag-remove" onClick={e => { e.stopPropagation(); removeBackground(characterId, b.id); setBackgrounds(prev => prev.filter(x => x.id !== b.id)); if (tagInfo?.id === b.id) setTagInfo(null) }}>x</button>
                  </li>
                ))}
              </ul>
            )}
            <div className="field-row" style={{ alignItems: 'flex-end' }}>
              <div className="field" style={{ flex: 2 }}>
                <label>Disadvantage</label>
                <input type="text" list="l5r-disadv-catalog" value={newBackground.name}
                  onChange={e => {
                    const val = e.target.value
                    const hit = L5R_DISADVANTAGES.find(d => d.name === val)
                    if (hit) setNewBackground({ name: hit.name, level: typeof hit.cost === 'number' ? hit.cost : 1, description: '' })
                    else setNewBackground(p => ({ ...p, name: val }))
                  }}
                  placeholder="Select or type disadvantage..." autoComplete="off" />
                <datalist id="l5r-disadv-catalog">
                  {L5R_DISADVANTAGES.map(d => <option key={d.name} value={d.name} />)}
                </datalist>
              </div>
              <div className="field">
                <label>Cost (XP)</label>
                <select value={newBackground.level} onChange={e => setNewBackground(p => ({ ...p, level: parseInt(e.target.value) }))}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="field" style={{ flex: 2 }}>
                <label>Notes</label>
                <input type="text" value={newBackground.description} onChange={e => setNewBackground(p => ({ ...p, description: e.target.value }))} placeholder="Specify details..." />
              </div>
              <button className="btn btn-secondary" onClick={handleAddDisadvantage}>{t('add')}</button>
            </div>
          </fieldset>
          {tagInfo?.kind === 'disadvantage' && (() => {
            const entry = L5R_DISADVANTAGES.find(d => d.name.toLowerCase() === tagInfo.name.toLowerCase())
            return <TagInfoPanel entry={entry ? { name: entry.name, description: `Cost: ${entry.cost} XP. ${entry.description}` } : { name: tagInfo.name, description: tagInfo.description || undefined }} onClose={() => setTagInfo(null)} />
          })()}
        </div>
      </div>

      {/* ── Techniques ── */}
      <div hidden={tab !== 4}>
        <div className="form-section">
          <fieldset>
            <legend>School Techniques</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Techniques are gained as you advance in School Rank (based on Insight). Record each technique with its rank and effect.
            </p>
            <textarea name="l5rTechniques" value={fields.l5rTechniques} onChange={handleText} rows={12} style={{ width: '100%' }} placeholder={
`Rank 1: The Way of the Crane
  +1k1+School Rank to Initiative. Ready katana as a Free Action. Add Iaijutsu/Assessment...

Rank 2: ...
Rank 3: ...`} />
          </fieldset>
        </div>
      </div>

      {/* ── Spells ── */}
      <div hidden={tab !== 5}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tabL5rSpells')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Record spells by element and mastery level. All shugenja know Sense, Commune, and Summon for their affinity element. Spell Casting Roll = Ring + School Rank.
            </p>
            <textarea name="l5rSpells" value={fields.l5rSpells} onChange={handleText} rows={12} style={{ width: '100%' }} placeholder={
`— Air (Affinity) —
Tempest of Air (ML 1, Range 300', TN 15) — 2k2 damage
By the Light of the Moon (ML 1, TN 10) — See invisible

— Earth —
Jade Strike (ML 1, Range 300', TN 15) — 2k2 vs Tainted

— Water —
Path to Inner Peace (ML 1, TN 15) — Heal Wound Rank x 2

— Fire (Deficiency) —
— Void —`} />
          </fieldset>
          <fieldset>
            <legend>Spell Elements Reference</legend>
            {['Air — Illusion, misdirection, wind, sound. Casting: Air + School Rank.',
              'Earth — Protection, endurance, jade, stone. Casting: Earth + School Rank.',
              'Fire — Destruction, knowledge, light, heat. Casting: Fire + School Rank.',
              'Water — Healing, movement, perception, cold. Casting: Water + School Rank.',
              'Void — Enlightenment, self, anti-magic. Casting: Void + School Rank.',
            ].map(line => (
              <p key={line} className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}>{line}</p>
            ))}
          </fieldset>
          <details style={{ marginBottom: 'var(--space-md)' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>Kiho Reference (Monks)</summary>
            <div style={{ padding: 'var(--space-sm) 0' }}>
              <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}><strong>Cost:</strong> Mastery Level in XP. Requires Ring + School Rank ≥ Mastery Level.</p>
              <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}><strong>Types:</strong> Internal (self-buff), Kharmic (non-offensive), Martial (via unarmed strike), Mystical (supernatural).</p>
              <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}><strong>Limits:</strong> One each of Internal/Kharmic/Mystical active. Multiple Martial allowed but one per strike.</p>
              <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}><strong>Non-Brotherhood:</strong> Tattoo orders pay 1.5x cost. Shugenja pay 2x and use Ring only (no School Rank).</p>
              <p className="muted-hint muted-hint--xs"><strong>Atemi:</strong> Nerve-cluster attacks deal no damage but deliver Kiho effects. Must touch bare skin; armor doubles ATN against atemi.</p>
            </div>
          </details>
        </div>
      </div>

      {/* ── Kata Catalogue ── */}
      <div hidden={tab !== 6}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tabL5rKata')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Kata cost XP equal to their Mastery Level. Executing a Kata is a Simple Action. Only one Kata may be active at a time.
            </p>
            <textarea name="l5rKata" value={fields.l5rKata} onChange={handleText} rows={5} style={{ width: '100%' }} placeholder="List your known kata here..." />
          </fieldset>
          {['Air', 'Earth', 'Fire', 'Water', 'Void'].map(ring => {
            const katas = L5R_KATA.filter(k => k.ring === ring)
            if (katas.length === 0) return null
            return (
              <fieldset key={ring}>
                <legend>{ring} Kata</legend>
                <table className="inv-table">
                  <thead>
                    <tr><th>Name</th><th>{ring}</th><th>Schools</th><th>Effect</th></tr>
                  </thead>
                  <tbody>
                    {katas.map(k => (
                      <tr key={k.name}>
                        <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{k.name}</td>
                        <td>{k.mastery}</td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{k.schools}</td>
                        <td className="inv-notes">{k.effect}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </fieldset>
            )
          })}
        </div>
      </div>

      {/* ── Combat & Stances ── */}
      <div hidden={tab !== 7}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tabL5rCombat')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Choose a Stance at the start of combat, then change it at the beginning of each Turn. Initiative = Insight Rank / Reflexes (keep Reflexes). Armor TN = Reflexes × 5 + 5 + armor.
            </p>
          </fieldset>

          <fieldset>
            <legend>Stances</legend>
            <table className="inv-table">
              <thead>
                <tr><th>Stance</th><th>Ring</th><th>Effect</th></tr>
              </thead>
              <tbody>
                {STANCES.map(s => (
                  <tr key={s.name}>
                    <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{s.name}</td>
                    <td style={{ color: 'var(--color-accent-fg)' }}>{s.ring}</td>
                    <td className="inv-notes">{s.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </fieldset>

          <fieldset>
            <legend>Maneuvers</legend>
            <table className="inv-table">
              <thead>
                <tr><th>Maneuver</th><th>Raises</th><th>Effect</th></tr>
              </thead>
              <tbody>
                {MANEUVERS.map(m => (
                  <tr key={m.name}>
                    <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{m.name}</td>
                    <td>{m.raises}</td>
                    <td className="inv-notes">{m.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </fieldset>

          <fieldset>
            <legend>Movement</legend>
            <p className="muted-hint muted-hint--xs">Free Action: Water × 5 ft. Simple Action: Water × 10 ft. Max per round: Water × 20 ft.</p>
            <p className="muted-hint muted-hint--xs">Basic terrain: no penalty. Moderate: Water -1. Difficult: Water -2.</p>
          </fieldset>

          <fieldset>
            <legend>Void Point Uses</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}>+1k1 to a Skill, Trait, Ring, or Spell Casting roll (not damage)</p>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}>Temporarily treat a Skill Rank 0 as Rank 1</p>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}>Reduce Wounds from one source by 10</p>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}>Increase Armor TN by 10 for one Round</p>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}>Increase Initiative Score by 10 for the skirmish</p>
            <p className="muted-hint muted-hint--xs">Exchange Initiative Score with a willing target</p>
          </fieldset>
        </div>
      </div>

      {/* ── Derived Stats ── */}
      <div hidden={tab !== 8}>
        <div className="form-section">
          <fieldset>
            <legend>Honor, Glory &amp; Status</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Values stored as 0-100. Displayed as X.X (divide by 10). Starting Honor depends on school; Glory and Status default to 1.0.
            </p>
            <div className="field-row">
              <div className="field">
                <label>Honor ({(fields.l5rHonor / 10).toFixed(1)})</label>
                <input type="number" name="l5rHonor" value={fields.l5rHonor} onChange={handleText} min={0} max={100} />
              </div>
              <div className="field">
                <label>Glory ({(fields.l5rGlory / 10).toFixed(1)})</label>
                <input type="number" name="l5rGlory" value={fields.l5rGlory} onChange={handleText} min={0} max={100} />
              </div>
              <div className="field">
                <label>Status ({(fields.l5rStatus / 10).toFixed(1)})</label>
                <input type="number" name="l5rStatus" value={fields.l5rStatus} onChange={handleText} min={0} max={100} />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Insight &amp; School Rank</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Insight = (All Rings x 10) + total skill ranks. School Rank advances at Insight thresholds: 150 (R2), 175 (R3), 200 (R4), 225 (R5).
            </p>
            <div className="field-row">
              <div className="field">
                <label>Rings Total: {airRing + earthRing + fireRing + waterRing + voidRing}</label>
                <p className="muted-hint muted-hint--xs">
                  Air {airRing} + Earth {earthRing} + Fire {fireRing} + Water {waterRing} + Void {voidRing}
                </p>
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Insight</label>
                <input type="number" name="l5rInsight" value={fields.l5rInsight} onChange={handleText} min={0} />
              </div>
              <div className="field">
                <label>School Rank</label>
                <input type="number" name="l5rSchoolRank" value={fields.l5rSchoolRank} onChange={handleText} min={1} max={10} />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Combat Stats</legend>
            <div className="field-row">
              <div className="field">
                <label>Initiative</label>
                <input type="number" name="l5rInitiative" value={fields.l5rInitiative} onChange={handleText} min={0} />
              </div>
              <div className="field">
                <label>Armor TN (Reflexes x 5 + 5 = {fields.l5rReflexes * 5 + 5})</label>
                <input type="number" name="l5rArmorTN" value={fields.l5rArmorTN} onChange={handleText} min={0} />
              </div>
              <div className="field">
                <label>Current Wounds</label>
                <input type="number" name="l5rWounds" value={fields.l5rWounds} onChange={handleText} min={0} />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Wound Rank Reference</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Each Wound Rank holds Earth Ring x 2 Wounds. Total Wounds per rank = Stamina x 2 (or Earth x 2).
            </p>
            <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: 'var(--space-xs)', borderBottom: '1px solid var(--color-border)' }}>Wound Rank</th>
                  <th style={{ textAlign: 'left', padding: 'var(--space-xs)', borderBottom: '1px solid var(--color-border)' }}>TN Penalty</th>
                  <th style={{ textAlign: 'left', padding: 'var(--space-xs)', borderBottom: '1px solid var(--color-border)' }}>Wounds ({earthRing * 2} per rank)</th>
                </tr>
              </thead>
              <tbody>
                {WOUND_RANKS.map((wr, i) => (
                  <tr key={wr.name}>
                    <td style={{ padding: 'var(--space-xs)', borderBottom: '1px solid var(--color-border)' }}>{wr.name}</td>
                    <td style={{ padding: 'var(--space-xs)', borderBottom: '1px solid var(--color-border)' }}>{wr.penalty}</td>
                    <td style={{ padding: 'var(--space-xs)', borderBottom: '1px solid var(--color-border)' }}>{i < WOUND_RANKS.length - 1 ? `${earthRing * 2 * (i + 1)}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </fieldset>
        </div>
      </div>

      {/* ── Equipment ── */}
      <div hidden={tab !== 9}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tabL5rEquipment')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              {t('l5rEquipmentHint')}
            </p>
            <textarea name="personalItems" value={fields.personalItems} onChange={handleText} rows={6} style={{ width: '100%' }} placeholder={
`Katana (3k2, Samurai)
Wakizashi (2k2, Samurai)
Light Armor (+5 ATN, Red 3)
Traveling pack, spare kimono, 10 koku`} />
          </fieldset>

          {L5R_EQUIPMENT_CATEGORIES.map(({ key, label }) => (
            <fieldset key={key}>
              <legend>{label}</legend>
              {key === 'armor' ? (
                <table className="inv-table">
                  <thead>
                    <tr><th>Name</th><th>ATN Bonus</th><th>Reduction</th><th>Cost</th><th>Notes</th></tr>
                  </thead>
                  <tbody>
                    {L5R_EQUIPMENT[key].map(item => (
                      <tr key={item.name}>
                        <td style={{ fontWeight: 600 }}>{item.name}</td>
                        <td>+{item.atn}</td>
                        <td>{item.reduction}</td>
                        <td>{item.cost}</td>
                        <td className="inv-notes">{item.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : key === 'arrows' ? (
                <table className="inv-table">
                  <thead>
                    <tr><th>Name</th><th>DR</th><th>Cost</th><th>Notes</th></tr>
                  </thead>
                  <tbody>
                    {L5R_EQUIPMENT[key].map(item => (
                      <tr key={item.name}>
                        <td style={{ fontWeight: 600 }}>{item.name}</td>
                        <td>{item.dr}</td>
                        <td>{item.cost}</td>
                        <td className="inv-notes">{item.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="inv-table">
                  <thead>
                    <tr><th>Name</th><th>DR</th><th>Keywords</th><th>Cost</th><th>Notes</th></tr>
                  </thead>
                  <tbody>
                    {L5R_EQUIPMENT[key].map(item => (
                      <tr key={item.name}>
                        <td style={{ fontWeight: 600 }}>{item.name}</td>
                        <td>{item.dr}</td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{item.keywords}</td>
                        <td>{item.cost}</td>
                        <td className="inv-notes">{item.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </fieldset>
          ))}
        </div>
      </div>

      {/* ── Backstory ── */}
      <div hidden={tab !== 10}>
        <div className="form-section">
          <fieldset><legend>{t('backstoryLabel')}</legend><textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('appearanceLabel')}</legend><textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('notes')}</legend><textarea name="notes" value={fields.notes} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
        </div>
      </div>

      {/* ── XP Log ── */}
      <div hidden={tab !== 11}>
        <XpLogSection splat="l5r" xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)} t={t} />
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => navigate('/l5r')}>{t('cancel')}</button>
        <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>{saving ? t('saving') : t('quickSave')}</button>
        <button className="btn btn-primary" onClick={handleDoneEditing} disabled={saving}>{t('doneEditing')}</button>
      </div>
      {viewMode && (
        <div className="view-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/l5r')}>{t('back')}</button>
          <button className="btn btn-primary" onClick={() => navigate(`/characters/${characterId}`, { replace: true })}>{t('edit')}</button>
        </div>
      )}
    </div>
  )
}
