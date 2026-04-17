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
import XpLogSection from './XpLogSection'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import TagInfoPanel from './TagInfoPanel'

// ── Nations with favored trait pairs (pick one for +1) ──
const NATIONS = {
  'Avalon':                  ['Panache', 'Resolve'],
  'Inismore':                ['Brawn', 'Wits'],
  'Highland Marches':        ['Finesse', 'Resolve'],
  'Castille':                ['Finesse', 'Wits'],
  'Eisen':                   ['Brawn', 'Resolve'],
  'Montaigne':               ['Finesse', 'Panache'],
  'Sarmatian Commonwealth':  ['Resolve', 'Wits'],
  'Ussura':                  ['Brawn', 'Resolve'],
  'Vestenmennavenjar':       ['Brawn', 'Wits'],
  'Vodacce':                 ['Finesse', 'Wits'],
  'Crescent Empire':         ['Resolve', 'Wits'],
  'Ifri':                    ['Brawn', 'Panache'],
  'Aztlan':                  ['Finesse', 'Panache'],
}
const NATION_NAMES = Object.keys(NATIONS)

// ── Sorcery types by nation ──
const SORCERIES = {
  'Avalon': 'Glamour', 'Inismore': 'Glamour', 'Highland Marches': 'Glamour',
  'Castille': 'Alquimia', 'Eisen': 'Hexenwerk', 'Montaigne': 'Porté',
  'Sarmatian Commonwealth': 'Sanderis', 'Ussura': 'Dar Matushki',
  'Vestenmennavenjar': 'Galdr', 'Vodacce': 'Sorte',
}

const SORCERY_INFO = {
  'Glamour': { nation: 'Avalon / Inismore / Highland Marches', description: 'The Knights of Avalon channel the power of legendary heroes through the Sidhe. By bonding with a legendary Knight, you gain access to their Glamour — supernatural abilities tied to their legend. At Rank 1, you bond with one Knight; at Rank 2, you bond with a second. Each Knight grants specific powers based on their legend.' },
  'Hexenwerk': { nation: 'Eisen', description: 'Dark alchemy involving Unguents — potions brewed from disturbing ingredients like corpse-parts, blood, and monster ichor. At Rank 1, you know 3 Unguents; at Rank 2, you know 6. Unguents can grant night-vision, inhuman strength, protection from harm, or raise the dead briefly.' },
  'Porté': { nation: 'Montaigne', description: 'Blood magic that tears holes in reality. A Porté sorcerer marks objects with their blood, then rips open a Porte to pull the item through space — or walks through the Porte to travel instantly. At Rank 1, you can pull Blooded objects to you. At Rank 2, you can create Walks (portals for travel). The Walkway between portals is a terrifying void.' },
  'Sanderis': { nation: 'Sarmatian Commonwealth', description: 'Pact magic with Losejai — powerful devils. The sorcerer trades Deals with their Dievas, gaining supernatural abilities in exchange for obligations. You and your Dievas are locked in a quiet war: you seek its true name to destroy it, while it tries to corrupt you. At Rank 1, you have 1 Deal; at Rank 2, you have 3 Deals.' },
  'Dar Matushki': { nation: 'Ussura', description: 'Mother\'s Touch — gifts from Matushka, the living spirit of Ussura. Ussurans who accept Matushka\'s guidance gain the ability to speak with animals, shapeshift, endure any weather, or command the land itself. At Rank 1, you gain 2 Gifts; at Rank 2, you gain 4 Gifts. Matushka\'s power only works on Ussuran soil.' },
  'Sorte': { nation: 'Vodacce', description: 'Fate witchery, practiced only by Vodacce women. Sorte strega can see the Strands of Fate connecting all people — strands of Cups (love), Coins (wealth), Swords (conflict), and Staves (authority). At Rank 1, you can Read strands. At Rank 2, you can Weave them, pulling or pushing fate. Manipulating fate always has consequences.' },
  'Galdr': { nation: 'Vestenmennavenjar', description: 'Rune magic of the ancient Vesten. By inscribing sacred runes on objects, weapons, or living skin, the Galdr sorcerer invokes the power of the old gods. At Rank 1, you know 3 Runes; at Rank 2, you know 6. Runes can be permanent inscriptions or temporary invocations.' },
  'Alquimia': { nation: 'Castille', description: 'The sacred science of transformation. Castillian alchemists study the elements and transmute matter through faith and reason. They create elixirs, transform materials, and channel elemental forces. Purchase as an Advantage.' },
}

// ── Advantages catalogue ──
const ADVANTAGES = [
  { name: 'Academy', cost: 4, description: 'You attended a formal military academy.' },
  { name: 'Able Drinker', cost: 1, description: 'Alcohol has little effect on you.' },
  { name: 'An Honest Misunderstanding', cost: 1, description: 'Replace Raises on a social Risk with Raises from another Skill.' },
  { name: 'Bar Fighter', cost: 3, description: 'Deal extra Wounds equal to your Brawl Ranks on a Brawl attack.' },
  { name: 'Barterer', cost: 3, description: 'Spend a Hero Point to acquire an item through trade.' },
  { name: 'Boxer', cost: 4, description: 'Spend a Hero Point to add Brawl to your damage.' },
  { name: 'Brush Pass', cost: 3, description: 'Spend a Hero Point to slip a small item to or from someone unnoticed.' },
  { name: 'Camaraderie', cost: 2, description: 'Spend a Hero Point to give another Hero 3 dice on their next Risk.' },
  { name: 'Cast Iron Stomach', cost: 1, description: 'You eat anything without ill effect.' },
  { name: 'Come Hither', cost: 3, description: 'Spend a Hero Point to tempt a character into leaving with you.' },
  { name: 'Connection', cost: 3, description: 'You know people in a particular organisation or social group.' },
  { name: 'Courageous', cost: 2, description: 'Spend a Hero Point to automatically succeed on Fear-based Risks.' },
  { name: 'Direction Sense', cost: 1, description: 'You always know which way is north.' },
  { name: 'Disarming Smile', cost: 3, description: 'Spend a Hero Point to keep a character from attacking for one Round.' },
  { name: 'Duelist Academy', cost: 5, description: 'You have trained in a Dueling style, gaining access to special maneuvers.' },
  { name: 'Dynamic Approach', cost: 4, description: 'Choose a Trait. When you use that Trait for a Risk, Raises cost 1 less die.' },
  { name: 'Eagle Eyes', cost: 2, description: 'Spend a Hero Point to notice something important others miss.' },
  { name: 'Extended Family', cost: 1, description: 'You can find a relative in almost any community.' },
  { name: 'Fascinate', cost: 3, description: 'Spend a Hero Point to hold a group transfixed by your performance.' },
  { name: 'Fencer', cost: 4, description: 'Spend a Hero Point to add Weaponry to your damage.' },
  { name: 'Friend at Court', cost: 4, description: 'You have a noble ally who helps with social and political situations.' },
  { name: 'Got It!', cost: 2, description: 'Spend a Hero Point to pick a lock or disable a trap without a Risk.' },
  { name: 'Hard to Kill', cost: 5, description: 'You can take 1 additional Dramatic Wound before becoming Helpless.' },
  { name: 'I Won\'t Die Here', cost: 5, description: 'Spend all Hero Points to avoid death. You survive but are removed from the scene.' },
  { name: 'Indomitable Will', cost: 3, description: 'Spend a Hero Point to resist mental influence or torture.' },
  { name: 'Inspire Generosity', cost: 3, description: 'Spend a Hero Point to convince someone to give you something.' },
  { name: 'Jack of All Trades', cost: 2, description: 'Spend a Hero Point to gain 1 Rank in a Skill you have 0 Ranks in for one Risk.' },
  { name: 'Keen Senses', cost: 2, description: 'You can notice hidden details others miss.' },
  { name: 'Large', cost: 2, description: 'You are bigger than average, gaining benefits in physical contests.' },
  { name: 'Leadership', cost: 4, description: 'Spend a Hero Point to inspire and lead a group effectively.' },
  { name: 'Left-Handed', cost: 3, description: 'Your unexpected fighting style gives you an edge in combat.' },
  { name: 'Linguist', cost: 2, description: 'You speak, read, and write an additional language.' },
  { name: 'Lyceum', cost: 4, description: 'You attended a school of sorcery.' },
  { name: 'Married to the Sea', cost: 3, description: 'Spend a Hero Point to navigate through dangerous waters safely.' },
  { name: 'Miracle Worker', cost: 4, description: 'Spend a Hero Point to stabilise a dying character.' },
  { name: 'Opportunist', cost: 4, description: 'Spend a Hero Point to act outside your normal turn.' },
  { name: 'Patron', cost: 3, description: 'You have a wealthy patron who provides financial support.' },
  { name: 'Quick Reflexes', cost: 2, description: 'You act first in Action Sequences involving a specific Skill.' },
  { name: 'Rich', cost: 3, description: 'You begin each session with Wealth 3.' },
  { name: 'Rogue', cost: 4, description: 'Spend a Hero Point to add Theft to damage on a sneak attack.' },
  { name: 'Sea Legs', cost: 2, description: 'You never suffer penalties from rough seas.' },
  { name: 'Small', cost: 2, description: 'You are smaller than average, gaining benefits in stealth.' },
  { name: 'Sniper', cost: 4, description: 'Spend a Hero Point to add Aim to damage at range.' },
  { name: 'Sorcery (1 rank)', cost: 2, description: 'You have access to your nation\'s sorcerous tradition at Rank 1.' },
  { name: 'Sorcery (2 ranks)', cost: 4, description: 'You have full mastery of your nation\'s sorcerous tradition.' },
  { name: 'Specialist', cost: 3, description: 'Choose a field. Gain +2 dice on Risks related to your speciality.' },
  { name: 'Staredown', cost: 3, description: 'Spend a Hero Point to frighten a single target.' },
  { name: 'Streetwise', cost: 2, description: 'Spend a Hero Point to find the local criminal underworld contacts.' },
  { name: 'Survivalist', cost: 3, description: 'Spend a Hero Point to find food, water, and shelter in the wilderness.' },
  { name: 'Team Player', cost: 4, description: 'Spend a Hero Point to give your Raises to an ally.' },
  { name: 'Tenure', cost: 2, description: 'You hold a position at a university or similar institution.' },
  { name: 'Time Sense', cost: 1, description: 'You always know approximately what time it is.' },
  { name: 'Together We Are Strong', cost: 4, description: 'Spend a Hero Point to add your Ranks in a Skill to an ally\'s Risk.' },
  { name: 'Trusted Companion', cost: 1, description: 'You have a loyal pet or animal companion.' },
  { name: 'University', cost: 4, description: 'You attended a major university and gained broad academic knowledge.' },
  { name: 'Valiant Spirit', cost: 3, description: 'When facing a Villain, gain bonus dice.' },
  { name: 'Virtuoso', cost: 4, description: 'Choose a Skill. When using that Skill, 10s explode.' },
  { name: 'Wily', cost: 3, description: 'Spend a Hero Point to escape bonds, grapples, or confinement.' },
]

// ── All 20 Arcana (2e Core Book) ──
const VIRTUES = [
  'The Fool — Wily', 'The Road — Willing', 'The Magician — Temperate',
  'Reunion — Triumphant', 'The Lovers — Passionate', 'The Thrones — Commanding',
  'Coins — Adaptable', 'The Witch — Intuitive', 'The War — Victorious',
  'The Hanged Man — Altruistic', 'The Beggar Prince — Insightful',
  'The Devil — Astute', 'The Tower — Humble', 'The Moonless Night — Subtle',
  'The Sun — Glorious', 'The Prophet — Illuminating', 'The Hero — Courageous',
  'The Glyph — Perceptive', 'The Emperor — Proud', 'Swords — Exemplary',
]

const HUBRISES = [
  'The Fool — Reckless', 'The Road — Lost', 'The Magician — Ambitious',
  'Reunion — Beholden', 'The Lovers — Star-Crossed', 'The Thrones — Stubborn',
  'Coins — Greedy', 'The Witch — Manipulative', 'The War — Loyal',
  'The Hanged Man — Indecisive', 'The Beggar Prince — Envious',
  'The Devil — Trusting', 'The Tower — Arrogant', 'The Moonless Night — Rash',
  'The Sun — Proud', 'The Prophet — Overzealous', 'The Hero — Hot-Headed',
  'The Glyph — Curious', 'The Emperor — Imperious', 'Swords — Loyal',
]

// ── Backgrounds (2e Core Book) ──
const BACKGROUND_CATALOG = [
  'Aristocrat', 'Army Officer', 'Archaeologist', 'Artist', 'Courtier',
  'Criminal', 'Doctor', 'Disenfranchised', 'Duelist', 'Engineer', 'Explorer',
  'Farmkid', 'Hexe', 'Hunter', 'Jenny/Jack', 'Knight Errant', 'Marine',
  'Merchant', 'Missionary', 'Orphan', 'Performer', 'Pirate', 'Priest',
  'Pugilist', 'Sailor', 'Scholar', 'Servant', 'Soldier', 'Spy', 'Touched by Sidhe',
]

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

const TAB_KEYS = ['tabIdentity', 'tab7sTraits', 'tab7sSkills', 'tab7sAdvantages', 'tab7sSorcery', 'tab7sDueling', 'tab7sArcana', 'tab7sBackgrounds', 'tab7sStories', 'tab7sBelongings', 'tabBackstory', 'tabXpLog']

// ── Dueling Styles (2e Core Book) ──
const DUELING_STYLES = [
  { name: 'Aldana', nation: 'Castille', description: 'Fluid and graceful, Aldana focuses on using your opponent\'s aggression against them. Uses Finesse. Maneuvers: Feint (turn a Slash into bonus dice), Riposte (deal damage when you parry).' },
  { name: 'Ambrogia', nation: 'Vodacce', description: 'Dual-wielding style using a main-gauche. Fights with two weapons simultaneously. Uses Finesse. Maneuvers: Slash (basic attack), Feint, Lunge (extra Wounds on hit).' },
  { name: 'Donovan', nation: 'Avalon', description: 'Heavy-hitting and defensive. Uses Resolve. Maneuvers: Bash (knock opponent off-balance), Riposte, Slash.' },
  { name: 'Drexel', nation: 'Eisen', description: 'Two-handed weapon style — greatswords, polearms. Powerful but slow. Uses Brawn. Maneuvers: Slash, Beat (destroy opponent\'s weapon), Lunge.' },
  { name: 'Eisenfaust', nation: 'Eisen', description: 'Panzerhand (iron gauntlet) fighting. Catches blades bare-handed. Uses Resolve. Maneuvers: Slash, Riposte, Iron Reply (catch and counter).' },
  { name: 'Leegstra', nation: 'Vestenmennavenjar', description: 'Berserker fury — fights without regard for personal safety. Uses Brawn. Maneuvers: Slash, Lunge, Rage (take Wounds to deal extra damage).' },
  { name: 'Mantovani', nation: 'Vodacce', description: 'Cloak-and-rapier, deceptive and theatrical. Uses Panache. Maneuvers: Feint, Flourish (distract and reposition), Slash.' },
  { name: 'Mireli', nation: 'Sarmatian Commonwealth', description: 'Sabre style emphasizing speed and mounted combat. Uses Finesse. Maneuvers: Slash, Feint, Lunge.' },
  { name: 'Sabat', nation: 'Crescent Empire', description: 'Scimitar fighting incorporating footwork and misdirection. Uses Panache. Maneuvers: Slash, Feint, Flourish.' },
  { name: 'Torres', nation: 'Castille', description: 'Defensive and patient, waiting for the perfect counter. Uses Wits. Maneuvers: Riposte, Bash, Slash.' },
  { name: 'Valroux', nation: 'Montaigne', description: 'Classic fencing — elegant, precise, and lethal. The quintessential rapier school. Uses Finesse. Maneuvers: Slash, Feint, Lunge.' },
]

const TRAIT_KEYS = ['traitBrawn', 'traitFinesse', 'traitResolve', 'traitWits7s', 'traitPanache']
const TRAIT_LABEL = { traitBrawn: 'Brawn', traitFinesse: 'Finesse', traitResolve: 'Resolve', traitWits7s: 'Wits', traitPanache: 'Panache' }
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

  async function handleDoneEditing() { await handleSave(); navigate('/7thsea') }

  async function handleAddBackground() {
    if (!newBackground.name.trim()) return
    try {
      const res = await addBackground(characterId, newBackground)
      setBackgrounds(prev => [...prev, res.data])
      setNewBackground({ name: '', level: 1, description: '' })
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
                <label>{t('7sNation')}</label>
                <select name="nation" value={fields.nation} onChange={handleText}>
                  <option value="">{t('select')}</option>
                  {NATION_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="field"><label>{t('7sReligion')}</label><input name="religion" value={fields.religion} onChange={handleText} /></div>
            </div>
            {nationTraits && (
              <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
                {fields.nation}: +1 to {nationTraits[0]} or {nationTraits[1]}.
                {nationSorcery && ` Sorcery: ${nationSorcery}.`}
              </p>
            )}
            <div className="field-row">
              <div className="field"><label>{t('7sMembership')}</label><input name="demeanor" value={fields.demeanor} onChange={handleText} placeholder="Secret Society, guild, order..." /></div>
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

      {/* ── Traits ── */}
      <div hidden={tab !== 1}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tab7sTraits')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              {t('traitsHint')} {nationTraits && `${fields.nation} grants +1 to ${nationTraits[0]} or ${nationTraits[1]} (apply manually).`}
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

      {/* ── Skills ── */}
      <div hidden={tab !== 2}>
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
        </div>
      </div>

      {/* ── Advantages ── */}
      <div hidden={tab !== 3}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tab7sAdvantages')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>{t('7sAdvantagesHint')}</p>
            {guidedMode && <PointsBudget spent={advSpent} budget={ADVANTAGE_BUDGET} />}
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
                <label>{t('7sAdvantageName')}</label>
                <input type="text" list="seventh-sea-adv-catalog" value={newAdv.name}
                  onChange={e => {
                    const val = e.target.value
                    const hit = ADVANTAGES.find(a => a.name === val)
                    if (hit) setNewAdv({ name: hit.name, level: hit.cost, notes: '' })
                    else setNewAdv(p => ({ ...p, name: val }))
                  }}
                  placeholder={t('7sPhAdvantage')} autoComplete="off" />
                <datalist id="seventh-sea-adv-catalog">
                  {ADVANTAGES.map(a => <option key={a.name} value={a.name} />)}
                </datalist>
              </div>
              <div className="field">
                <label>{t('7sCost')}</label>
                <select value={newAdv.level} onChange={e => setNewAdv(p => ({ ...p, level: parseInt(e.target.value) }))}>
                  {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <button className="btn btn-secondary" onClick={handleAddAdvantage}>{t('add')}</button>
            </div>
          </fieldset>
          {tagInfo?.kind === 'advantage' && (() => {
            const entry = ADVANTAGES.find(a => a.name.toLowerCase() === tagInfo.name.toLowerCase())
            return <TagInfoPanel entry={entry ? { name: entry.name, description: `Cost: ${entry.cost}. ${entry.description}` } : { name: tagInfo.name }} onClose={() => setTagInfo(null)} />
          })()}
        </div>
      </div>

      {/* ── Sorcery ── */}
      <div hidden={tab !== 4}>
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
              </div>
            ) : (
              <p className="muted-hint" style={{ paddingBottom: 0 }}>Select a nation on the Identity tab to see your available sorcery tradition.</p>
            )}
            {!nationSorcery && Object.entries(SORCERY_INFO).map(([name, info]) => (
              <details key={name} style={{ marginBottom: 'var(--space-sm)' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>{name} <span style={{ fontWeight: 400, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>— {info.nation}</span></summary>
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

      {/* ── Dueling ── */}
      <div hidden={tab !== 5}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tab7sDueling')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-md)' }}>
              Purchase the "Duelist Academy" Advantage (5 pts) to learn a style. Each style uses a specific Trait and grants unique Maneuvers.
            </p>
            {DUELING_STYLES.map(s => (
              <details key={s.name} style={{ marginBottom: 'var(--space-sm)' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>{s.name} <span style={{ fontWeight: 400, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>— {s.nation}</span></summary>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6, padding: 'var(--space-sm) 0' }}>{s.description}</p>
              </details>
            ))}
          </fieldset>
          <fieldset>
            <legend>{t('7sDuelingNotes')}</legend>
            <textarea name="altName" value={fields.altName} onChange={handleText} rows={4} style={{ width: '100%' }} placeholder="Your dueling style, maneuvers learned, and notes..." />
          </fieldset>
        </div>
      </div>

      {/* ── Arcana & Resources ── */}
      <div hidden={tab !== 6}>
        <div className="form-section">
          <fieldset>
            <legend>{t('7sArcana')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>{t('arcanaHint')}</p>
            <div className="field-row">
              <div className="field">
                <label>{t('7sVirtue')}</label>
                <select name="heroVirtue" value={fields.heroVirtue} onChange={handleText}>
                  <option value="">{t('select')}</option>
                  {VIRTUES.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="field">
                <label>{t('7sHubris')}</label>
                <select name="heroHubris" value={fields.heroHubris} onChange={handleText}>
                  <option value="">{t('select')}</option>
                  {HUBRISES.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('7sResources')}</legend>
            <div className="rating-grid">
              <div className="ability-row"><DotRating label={t('7sHeroPoints')} name="heroPoints" value={fields.heroPoints} onChange={handleField} min={0} max={10} /></div>
              <div className="ability-row"><DotRating label={t('7sWealth')} name="wealth7s" value={fields.wealth7s} onChange={handleField} min={0} max={10} /></div>
              <div className="ability-row"><DotRating label={t('7sDramaticWounds')} name="dramaticWounds" value={fields.dramaticWounds} onChange={handleField} min={0} max={5} /></div>
              <div className="ability-row"><DotRating label={t('7sCorruption')} name="corruption" value={fields.corruption} onChange={handleField} min={0} max={10} /></div>
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Backgrounds ── */}
      <div hidden={tab !== 7}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tab7sBackgrounds')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Choose 2 Backgrounds. Each provides a Quirk, Skills, and Advantages. Use the description field for your Quirk.
            </p>
            {backgrounds.length > 0 && (
              <ul className="tag-list">
                {backgrounds.map(b => (
                  <li key={b.id} className={`tag tag--clickable${b.id === tagInfo?.id ? ' tag--active' : ''}`} onClick={() => setTagInfo(ti => ti?.id === b.id ? null : { ...b, kind: 'background' })}>
                    <span>{b.name}{b.description ? ` — ${b.description}` : ''}</span>
                    <button className="tag-remove" onClick={e => { e.stopPropagation(); removeBackground(characterId, b.id); setBackgrounds(prev => prev.filter(x => x.id !== b.id)); if (tagInfo?.id === b.id) setTagInfo(null) }}>x</button>
                  </li>
                ))}
              </ul>
            )}
            <div className="field-row" style={{ alignItems: 'flex-end' }}>
              <div className="field" style={{ flex: 2 }}>
                <label>{t('background')}</label>
                <input type="text" list="bg-7s-catalog" value={newBackground.name} onChange={e => setNewBackground(p => ({ ...p, name: e.target.value }))} placeholder="Aristocrat, Pirate, Sailor..." autoComplete="off" />
                <datalist id="bg-7s-catalog">
                  {BACKGROUND_CATALOG.map(b => <option key={b} value={b} />)}
                </datalist>
              </div>
              <div className="field" style={{ flex: 2 }}>
                <label>Quirk</label>
                <input type="text" value={newBackground.description} onChange={e => setNewBackground(p => ({ ...p, description: e.target.value }))} placeholder="Earn a Hero Point when you..." />
              </div>
              <button className="btn btn-secondary" onClick={handleAddBackground}>{t('add')}</button>
            </div>
          </fieldset>
          {tagInfo?.kind === 'background' && (
            <TagInfoPanel entry={{ name: tagInfo.name, description: tagInfo.description ? `Quirk: ${tagInfo.description}` : undefined }} onClose={() => setTagInfo(null)} />
          )}
        </div>
      </div>

      {/* ── Stories (advancement system) ── */}
      <div hidden={tab !== 8}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tab7sStories')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>{t('7sStoriesHint')}</p>
            <textarea name="heroStories" value={fields.heroStories} onChange={handleText} rows={12} style={{ width: '100%' }} placeholder={
`Story 1: [Title]
Goal: What do you want to achieve?
Reward: (e.g. +1 Skill Rank, a 3-pt Advantage, +1 Trait)
Steps (number determines reward value):
  Step 1: ...
  Step 2: ...
  Step 3: ...

Story 2: [Title]
...`} />
          </fieldset>
        </div>
      </div>

      {/* ── Belongings ── */}
      <div hidden={tab !== 9}>
        <div className="form-section">
          <fieldset>
            <legend>{t('7sBelongings')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              7th Sea uses abstract Wealth rather than detailed inventories. List notable possessions: signature weapons, ships, heirlooms, and other meaningful items.
            </p>
            <textarea name="personalItems" value={fields.personalItems} onChange={handleText} rows={10} style={{ width: '100%' }} placeholder={
`Signature sword (Castillian rapier, family heirloom)
Ship: The Silver Gull (brigantine, 20 crew)
Porté-marked locket (blooded to my mother)
Eisen dracheneisen pauldron (left shoulder)
Coded journal of trade routes`} />
          </fieldset>
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
        <XpLogSection splat="seventh-sea" xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)} t={t} />
      </div>

      <div className="form-actions">
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
    </div>
  )
}
