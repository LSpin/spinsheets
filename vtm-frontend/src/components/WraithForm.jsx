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
import DotRating from './DotRating'
import XpLogSection from './XpLogSection'
import CatalogSelect from './CatalogSelect'
import DicePoolsTab from './DicePoolsTab'
import StorytellerDiceRoller from './StorytellerDiceRoller'
import MeritsFlawsSection from './MeritsFlawsSection'
import InventorySection from './InventorySection'
import TagInfoPanel from './TagInfoPanel'
import { SECONDARY_TALENTS, SECONDARY_SKILLS, SECONDARY_KNOWLEDGES } from '../data/secondaryAbilities'
import { useLanguage } from '../i18n/LanguageContext'
import ExportModal from './ExportModal'

const ARCHETYPES = [
  { value: 'Architect', description: 'Driven to create something of lasting value.' },
  { value: 'Autocrat', description: 'Must be in charge. Seeks control and authority.' },
  { value: 'Bon Vivant', description: 'Life is for pleasure. Enjoys every moment.' },
  { value: 'Bravo', description: 'Might makes right. Uses intimidation and force.' },
  { value: 'Caregiver', description: 'Nurtures and protects others.' },
  { value: 'Celebrant', description: 'Lives for a single passion above all.' },
  { value: 'Child', description: 'Innocent and dependent. Needs others to guide them.' },
  { value: 'Competitor', description: 'Must win at everything.' },
  { value: 'Conformist', description: 'Follows the group. Finds safety in belonging.' },
  { value: 'Conniver', description: 'Manipulates others for personal gain.' },
  { value: 'Curmudgeon', description: 'Criticizes everything and expects the worst.' },
  { value: 'Deviant', description: 'Rejects the status quo. Finds freedom in being different.' },
  { value: 'Director', description: 'Takes charge. Organizes others and makes things happen.' },
  { value: 'Fanatic', description: 'The cause is everything. Utterly devoted to a belief.' },
  { value: 'Gallant', description: 'Seeks attention and admiration.' },
  { value: 'Idealist', description: 'Believes in a better world.' },
  { value: 'Judge', description: 'Seeks truth and justice. Evaluates situations fairly.' },
  { value: 'Loner', description: 'Prefers solitude. Self-reliant and independent.' },
  { value: 'Martyr', description: 'Suffers for others. Finds meaning in sacrifice.' },
  { value: 'Pedagogue', description: 'Everyone has something to learn.' },
  { value: 'Penitent', description: 'Atones for past sins. Driven by guilt.' },
  { value: 'Rebel', description: 'Fights authority. Opposes the system on principle.' },
  { value: 'Survivor', description: 'Endures at all costs. Nothing matters more than survival.' },
  { value: 'Thrill-Seeker', description: 'Lives for danger and excitement.' },
  { value: 'Traditionalist', description: 'Values the old ways. Preserves customs.' },
  { value: 'Visionary', description: 'Sees what could be. Driven by grand ideas.' },
]

const LEGIONS = [
  { value: 'Emerald Legion', description: 'Serve the Lady of Fate. Death by happenstance.' },
  { value: 'Grim Legion', description: 'Warriors who died in battle.' },
  { value: 'Iron Legion', description: 'Those who died of old age. Patient and enduring.' },
  { value: 'Legion of Paupers', description: 'Died of madness, disease, or addiction.' },
  { value: 'Penitent Legion', description: 'Those who committed suicide.' },
  { value: 'Silent Legion', description: 'Death by mystery. The unknown.' },
  { value: 'Skeletal Legion', description: 'Died by violence or murder.' },
]

const SHADOW_ARCHETYPES = [
  { value: 'The Abuser', description: 'Torments through cruelty and dominance.' },
  { value: 'The Director', description: 'Manipulates through subtle suggestion.' },
  { value: 'The Freak', description: 'Drives the wraith toward bizarre behavior.' },
  { value: 'The Id', description: 'Pure instinct and desire.' },
  { value: 'The Martinet', description: 'Controls through guilt and obligation.' },
  { value: 'The Parent', description: 'Smothering, overprotective shadow.' },
]

const GUILDS = [
  { value: 'Alchemists', description: 'Practitioners of Flux, the art of decay and transformation.' },
  { value: 'Artificers', description: 'Masters of Inhabit, who possess and control machines.' },
  { value: 'Chanteurs', description: 'Practitioners of Keening, the art of emotional manipulation through song.' },
  { value: 'Harbingers', description: 'Masters of Argos, navigators of the Tempest.' },
  { value: 'Masquers', description: 'Practitioners of Moliate, who sculpt Corpus like clay.' },
  { value: 'Monitors', description: 'Masters of Lifeweb, who sense and manipulate the ties between wraiths and the living.' },
  { value: 'Oracles', description: 'Practitioners of Fatalism, who read the strands of fate.' },
  { value: 'Pardoners', description: 'Masters of Castigate, who battle and weaken Shadows.' },
  { value: 'Proctors', description: 'Practitioners of Embody, who manifest in the Skinlands.' },
  { value: 'Puppeteers', description: 'Masters of Puppetry, who possess and control the living.' },
  { value: 'Sandmen', description: 'Practitioners of Phantasm, who shape dreams.' },
  { value: 'Solicitors', description: 'Masters of Intimation, who project emotions onto others.' },
  { value: 'Spooks', description: 'Practitioners of Outrage, the art of poltergeist activity.' },
  { value: 'Usurers', description: 'Masters of Usury, who manipulate Pathos.' },
]

const WRAITH_ARCANOI = [
  { name: 'Argos', description: 'Travel through the Tempest and byways of the Underworld.' },
  { name: 'Castigate', description: 'Battle and control your own Shadow or others.' },
  { name: 'Embody', description: 'Manifest physically in the Skinlands.' },
  { name: 'Fatalism', description: 'Read and manipulate fate and destiny.' },
  { name: 'Inhabit', description: 'Possess and control inanimate objects.' },
  { name: 'Keening', description: 'Use the voice as a weapon — wails that harm or terrify.' },
  { name: 'Lifeweb', description: 'Sense and manipulate connections to the living.' },
  { name: 'Moliate', description: 'Shape and sculpt corpus (wraith flesh).' },
  { name: 'Outrage', description: 'Manifest telekinetic force in the Skinlands.' },
  { name: 'Pandemonium', description: 'Create chaos and confusion in the physical world.' },
  { name: 'Phantasm', description: 'Create illusions and enter dreams.' },
  { name: 'Puppetry', description: 'Possess and control living beings.' },
  { name: 'Usury', description: 'Manipulate Pathos — the emotional energy of wraiths.' },
]

const WRAITH_SHADOW_THORNS = [
  { name: 'Bad Sight', description: 'The Shadow can blur the wraith\'s perceptions.' },
  { name: 'Catspaw', description: 'The Shadow can take brief control of one limb.' },
  { name: 'Death\'s Sigil', description: 'A visible mark of the Shadow appears on the wraith.' },
  { name: 'Devil\'s Dare', description: 'The Shadow tempts with power in exchange for control.' },
  { name: 'Freudian Slip', description: 'The Shadow causes the wraith to say the wrong thing.' },
  { name: 'Infamy', description: 'The Shadow has its own dark reputation.' },
  { name: 'Pact Breaker', description: 'The Shadow breaks promises the wraith makes.' },
  { name: 'Shadow Call', description: 'The Shadow can summon Spectres.' },
  { name: 'Tainted Relic', description: 'One of the wraith\'s Relics is corrupted.' },
  { name: 'Trick of the Light', description: 'The Shadow creates visual hallucinations.' },
]

const WRAITH_BACKGROUNDS = [
  { value: 'Allies', description: 'Other wraiths who actively support you.', levels: ['One helpful contact.', 'A small circle of supporters.', 'A reliable network in the Shadowlands.', 'Multiple groups across the Necropolis.', 'Powerful allies with broad influence.'] },
  { value: 'Contacts', description: 'Information sources across the Underworld.', levels: ['One or two wraiths in a single faction.', 'A small network.', 'Informants across several guilds.', 'Sources throughout the Necropolis.', 'Extensive intelligence network.'] },
  { value: 'Eidolon', description: 'The strength of your higher self, opposing the Shadow.', levels: ['Faint guidance.', 'Occasional helpful nudges.', 'Regular intervention.', 'Strong protective presence.', 'Powerful guardian angel.'] },
  { value: 'Haunt', description: 'A location in the Shadowlands you control.', levels: ['A small, neglected corner.', 'A modest space.', 'A well-established haunt.', 'A substantial territory.', 'A significant domain.'] },
  { value: 'Legacy', description: 'Impact your living deeds still have on the Quick.', levels: ['Minor lasting impression.', 'Fondly remembered.', 'A local legend.', 'Widely known legacy.', 'Legendary impact on the living world.'] },
  { value: 'Memoriam', description: 'How strongly the living remember you.', levels: ['Barely remembered.', 'A few people still think of you.', 'Regularly remembered.', 'Many mourn or honor your memory.', 'You are unforgettable to the living.'] },
  { value: 'Mentor', description: 'An elder wraith who guides you.', levels: ['Occasional advice.', 'Active guidance.', 'Influential mentor.', 'Powerful patron.', 'Ancient and formidable guide.'] },
  { value: 'Notoriety', description: 'Your reputation in the Hierarchy or Renegade circles.', levels: ['Known locally.', 'Recognized in the Necropolis.', 'Regional reputation.', 'Known throughout the Dark Kingdom.', 'Legendary status.'] },
  { value: 'Relic', description: 'Artifacts that crossed the Shroud with you.', levels: ['A minor trinket.', 'A useful item.', 'A significant relic.', 'A powerful artifact.', 'A legendary relic of great power.'] },
  { value: 'Status', description: 'Your standing in the Hierarchy.', levels: ['Recognized citizen.', 'Minor official.', 'Established functionary.', 'Important leader.', 'Pillar of the Hierarchy.'] },
]

function CustomAbilityRow({ nameProp, ratingProp, placeholder, fields, onField, onText, catalog, max = 5 }) {
  const match = catalog?.find(c => c.value === fields[nameProp])
  return (
    <div className="custom-ability-row">
      <input
        type="text"
        name={nameProp}
        value={fields[nameProp]}
        onChange={onText}
        placeholder={placeholder}
        aria-label={`${placeholder} name`}
        className="custom-ability-name"
        list={`${nameProp}-list`}
      />
      <datalist id={`${nameProp}-list`}>
        {catalog?.map(c => <option key={c.value} value={c.value} />)}
      </datalist>
      <DotRating label="" name={ratingProp} value={fields[ratingProp]} onChange={onField} max={max} />
      {match && <p className="archetype-desc" style={{ gridColumn: '1 / -1', margin: 0 }}>{match.description}</p>}
    </div>
  )
}

const INITIAL = {
  splat: 'WRAITH', npc: false,
  name: '', altName: '', concept: '', nature: '', demeanor: '',
  clan: '', // Legion
  sect: '', // Shadow archetype
  guild: '', // Guild
  strength: 1, dexterity: 1, stamina: 1,
  charisma: 1, manipulation: 1, appearance: 1,
  perception: 1, intelligence: 1, wits: 1,
  alertness: 0, athletics: 0, awareness: 0, brawl: 0, empathy: 0,
  expression: 0, intimidation: 0, leadership: 0, streetwise: 0, subterfuge: 0,
  animalKen: 0, crafts: 0, drive: 0, etiquette: 0, firearms: 0,
  larceny: 0, melee: 0, performance: 0, stealth: 0, survival: 0,
  academics: 0, computer: 0, finance: 0, investigation: 0, law: 0,
  linguistics: 0, medicine: 0, occult: 0, politics: 0, science: 0, technology: 0,
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
  willpower: 3, currentWillpower: 3,
  rage: 5, currentRage: 5, // Corpus
  gnosis: 5, currentGnosis: 5, // Pathos
  quintessence: 0, // Angst
  sorceryDesc: '', // Arcanoi
  clanCurse: '', // Passions & Fetters
  shadowDesc: '', // Shadow's Dark Passions & Thorns
  // Health
  healthBruised: '', healthHurt: '', healthInjured: '', healthWounded: '', healthMauled: '', healthCrippled: '', healthIncap: '',
  notes: '', backstory: '', appearanceDesc: '',
  goals: '', allies: '', enemies: '',
  personalItems: '',
}

const TAB_KEYS = [
  'tabIdentity', 'tabAttributes', 'tabAbilities', 'tabSecondaryAbilities',
  'tabArcanoi', 'tabShadow', 'tabAdvantages', 'tabHealth',
  'tabBackgrounds', 'tabMeritsFlaws', 'tabInventory',
  'tabBackstory', 'tabXpLog', 'tabDicePools', 'tabDiceRoller'
]

export default function WraithForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const viewMode = searchParams.get('mode') === 'view'
  const characterId = paramId || null

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
        const merged = { ...prev }
        for (const key in prev) { if (data[key] !== undefined && data[key] !== null) merged[key] = data[key] }
        return merged
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

  function handleField(name, value) { setFields(prev => ({ ...prev, [name]: typeof value === 'string' ? value : Number(value) })) }
  function handleText(e) { setFields(prev => ({ ...prev, [e.target.name]: e.target.value })) }

  async function handleSave() {
    setSaving(true); setSaveError(null)
    try { await updateCharacter(characterId, fields) }
    catch { setSaveError(t('failedToSave')) }
    finally { setSaving(false) }
  }

  async function handleDoneEditing() { await handleSave(); navigate('/characters') }

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/characters')}>{t('back')}</button>
        <h2>{fields.name || t('editWraith')}</h2>
        <span className="splat-badge splat-badge--wraith">{t('wraith')}</span>
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}
      {actionError && <p className="status-error" role="alert">{actionError}</p>}

      <div className="tab-list" role="tablist">
        {TAB_KEYS.map((tk, i) => (
          <button key={tk} role="tab" id={`tab-${i}`} className={`btn btn-secondary${tab === i ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(i)} aria-selected={tab === i} aria-controls={`tabpanel-${i}`}>{t(tk)}</button>
        ))}
      </div>

      {/* Identity */}
      <div role="tabpanel" id="tabpanel-0" aria-labelledby="tab-0" hidden={tab !== 0}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tabIdentity')}</legend>
            <div className="field-row">
              <div className="field"><label>{t('charName')} *</label><input name="name" value={fields.name} onChange={handleText} /></div>
              <div className="field"><label>{t('wraithShadowName')}</label><input name="altName" value={fields.altName} onChange={handleText} placeholder={t('wraithShadowNameHint')} /></div>
            </div>
            <div className="field-row">
              <div className="field"><label>{t('concept')}</label><input name="concept" value={fields.concept} onChange={handleText} /></div>
            </div>
            <div className="field-row">
              <CatalogSelect id="nature" name="nature" label={t('nature')} value={fields.nature} onChange={handleField} catalog={ARCHETYPES} />
              <CatalogSelect id="demeanor" name="demeanor" label={t('demeanor')} value={fields.demeanor} onChange={handleField} catalog={ARCHETYPES} />
            </div>
            <div className="field-row">
              <CatalogSelect id="clan" name="clan" label={t('wraithLegion')} value={fields.clan} onChange={handleField} catalog={LEGIONS} />
              <CatalogSelect id="guild" name="guild" label={t('wraithGuild') || 'Guild'} value={fields.guild} onChange={handleField} catalog={GUILDS} />
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('wraithPassions')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>{t('wraithPassionsHint')}</p>
            <textarea name="clanCurse" value={fields.clanCurse} onChange={handleText} rows={6} style={{ width: '100%' }}
              aria-label="Passions and Fetters" placeholder={t('wraithPassionsPlaceholder')} />
          </fieldset>
        </div>
      </div>

      {/* Attributes */}
      <div role="tabpanel" id="tabpanel-1" aria-labelledby="tab-1" hidden={tab !== 1}>
        <div className="form-section">
          {[
            { legend: 'physicalAttr', attrs: ['strength', 'dexterity', 'stamina'] },
            { legend: 'socialAttr', attrs: ['charisma', 'manipulation', 'appearance'] },
            { legend: 'mentalAttr', attrs: ['perception', 'intelligence', 'wits'] },
          ].map(({ legend, attrs }) => (
            <fieldset key={legend}>
              <legend>{t(legend)}</legend>
              <div className="rating-grid">
                {attrs.map(a => (
                  <div key={a} className="ability-row">
                    <DotRating label={t(a)} name={a} value={fields[a]} onChange={handleField} min={1} />
                  </div>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </div>

      {/* Abilities */}
      <div role="tabpanel" id="tabpanel-2" aria-labelledby="tab-2" hidden={tab !== 2}>
        <div className="form-section">
          <fieldset>
            <legend>{t('talents')}</legend>
            <div className="rating-grid">
              {['alertness', 'athletics', 'awareness', 'brawl', 'empathy', 'expression', 'intimidation', 'leadership', 'streetwise', 'subterfuge'].map(a =>
                <div key={a} className="ability-row"><DotRating label={t(a)} name={a} value={fields[a]} onChange={handleField} /></div>
              )}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('skills')}</legend>
            <div className="rating-grid">
              {['animalKen', 'crafts', 'drive', 'etiquette', 'firearms', 'larceny', 'melee', 'performance', 'stealth', 'survival'].map(a =>
                <div key={a} className="ability-row"><DotRating label={t(a)} name={a} value={fields[a]} onChange={handleField} /></div>
              )}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('knowledges')}</legend>
            <div className="rating-grid">
              {['academics', 'computer', 'finance', 'investigation', 'law', 'linguistics', 'medicine', 'occult', 'politics', 'science', 'technology'].map(a =>
                <div key={a} className="ability-row"><DotRating label={t(a)} name={a} value={fields[a]} onChange={handleField} /></div>
              )}
            </div>
          </fieldset>
        </div>
      </div>

      {/* Secondary Abilities */}
      <div role="tabpanel" id="tabpanel-3" aria-labelledby="tab-3" hidden={tab !== 3}>
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

      {/* Arcanoi */}
      <div role="tabpanel" id="tabpanel-4" aria-labelledby="tab-4" hidden={tab !== 4}>
        <div className="form-section">
          <fieldset>
            <legend>{t('wraithArcanoi')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>{t('wraithArcanoiHint')}</p>
            {(() => {
              const parsed = {}
              ;(fields.sorceryDesc || '').split(',').map(s => s.trim()).filter(Boolean).forEach(entry => {
                const [name, val] = entry.split(':')
                if (name) parsed[name.trim()] = Number(val) || 0
              })
              function updateArcanoi(arcName, newVal) {
                const next = { ...parsed, [arcName]: newVal }
                const str = WRAITH_ARCANOI
                  .filter(a => (next[a.name] || 0) > 0)
                  .map(a => `${a.name}:${next[a.name]}`)
                  .join(', ')
                handleField('sorceryDesc', str)
              }
              return (
                <div className="rating-grid">
                  {WRAITH_ARCANOI.map(arc => (
                    <div key={arc.name} className="ability-row">
                      <DotRating label={arc.name} name={`arcanoi_${arc.name}`} value={parsed[arc.name] || 0}
                        onChange={(_, val) => updateArcanoi(arc.name, val)} min={0} max={5} />
                      <p className="archetype-desc" style={{ margin: '0 0 var(--space-xs) 0', gridColumn: '1 / -1' }}>{arc.description}</p>
                    </div>
                  ))}
                </div>
              )
            })()}
          </fieldset>
        </div>
      </div>

      {/* Shadow */}
      <div role="tabpanel" id="tabpanel-5" aria-labelledby="tab-5" hidden={tab !== 5}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tabShadow')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              {t('wraithShadowHint') || 'The Shadow is the dark half of every wraith, seeking to drag it into Oblivion.'}
            </p>
            <div className="field-row">
              <CatalogSelect id="sect" name="sect" label={t('wraithShadow')} value={fields.sect} onChange={handleField} catalog={SHADOW_ARCHETYPES} />
            </div>
            <div className="field-row">
              <DotRating label={t('wraithAngst')} name="quintessence" value={fields.quintessence} onChange={handleField} min={0} max={10} />
            </div>
            {fields.sect && (() => {
              const thornsPart = (fields.shadowDesc || '').split('||')[0].split(',').map(s => s.trim()).filter(Boolean)
              return thornsPart.length === 0 ? (
                <p className="status-warning" role="status" aria-live="polite" style={{ marginTop: 'var(--space-xs)', fontSize: '0.8rem' }}>
                  Shadow Archetype "{fields.sect}" selected but no Thorns chosen. Every Shadow should have at least one Thorn.
                </p>
              ) : null
            })()}
          </fieldset>
          <fieldset>
            <legend>{t('wraithDarkPassions') || 'Dark Passions & Thorns'}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              {t('wraithDarkPassionsHint') || 'Dark Passions fuel the Shadow. Thorns are powers the Shadow can use against the wraith.'}
            </p>
            {(() => {
              const parts = (fields.shadowDesc || '').split('||')
              const thornsPart = (parts[0] || '').split(',').map(s => s.trim()).filter(Boolean)
              const passionsPart = parts[1] || ''
              function updateShadow(nextThorns, notes) {
                const val = nextThorns.join(', ') + (notes ? '||' + notes : '')
                handleField('shadowDesc', val)
              }
              return (
                <>
                  <h4 style={{ margin: '0 0 var(--space-xs) 0' }}>Thorns</h4>
                  <ul className="catalog-list" aria-label="Shadow thorns">
                    {WRAITH_SHADOW_THORNS.map(thorn => {
                      const isChecked = thornsPart.includes(thorn.name)
                      return (
                        <li key={thorn.name} className={`catalog-item${isChecked ? ' catalog-item--added' : ''}`}>
                          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-xs)', padding: 'var(--space-xs) var(--space-sm)', cursor: 'pointer', width: '100%' }}>
                            <input type="checkbox" checked={isChecked} onChange={() => {
                              const next = isChecked ? thornsPart.filter(n => n !== thorn.name) : [...thornsPart, thorn.name]
                              updateShadow(next, passionsPart)
                            }} style={{ marginTop: '3px' }} />
                            <div>
                              <span className="catalog-item-name" style={{ fontWeight: 600 }}>{thorn.name}</span>
                              <p className="catalog-item-desc" style={{ margin: '2px 0 0', fontSize: '0.82rem' }}>{thorn.description}</p>
                            </div>
                          </label>
                        </li>
                      )
                    })}
                  </ul>
                  <div style={{ marginTop: 'var(--space-md)' }}>
                    <label style={{ fontWeight: 600, display: 'block', marginBottom: 'var(--space-xs)' }}>Dark Passions & Notes</label>
                    <textarea value={passionsPart} onChange={e => updateShadow(thornsPart, e.target.value)} rows={6} style={{ width: '100%' }}
                      aria-label="Dark Passions and notes"
                      placeholder={'Dark Passions (emotion + rating):\nDestroy my family\'s legacy (Spite 3)\nBetray my Circle (Treachery 2)'} />
                  </div>
                </>
              )
            })()}
          </fieldset>
        </div>
      </div>

      {/* Advantages */}
      <div role="tabpanel" id="tabpanel-6" aria-labelledby="tab-6" hidden={tab !== 6}>
        <div className="form-section">
          <fieldset>
            <legend>{t('willpower')}</legend>
            <div className="field-row">
              <DotRating label={t('permanent')} name="willpower" value={fields.willpower} onChange={handleField} min={1} max={10} />
              <DotRating label={t('temporary')} name="currentWillpower" value={fields.currentWillpower} onChange={handleField} min={0} max={fields.willpower} />
            </div>
            {fields.currentWillpower > fields.willpower && (
              <p className="status-warning" role="status" aria-live="polite" style={{ marginTop: 'var(--space-xs)', fontSize: '0.8rem' }}>
                Temporary Willpower cannot exceed permanent ({fields.willpower}).
              </p>
            )}
          </fieldset>
          <fieldset>
            <legend>{t('wraithPathos')}</legend>
            <div className="field-row">
              <DotRating label={t('permanent')} name="gnosis" value={fields.gnosis} onChange={handleField} min={0} max={10} />
              <DotRating label={t('temporary')} name="currentGnosis" value={fields.currentGnosis} onChange={handleField} min={0} max={fields.gnosis} />
            </div>
            {fields.currentGnosis === 0 && (
              <p className="status-warning" role="status" aria-live="polite" style={{ marginTop: 'var(--space-xs)', fontSize: '0.8rem' }}>
                No Pathos remaining. The wraith cannot fuel Arcanoi.
              </p>
            )}
          </fieldset>
          <fieldset>
            <legend>{t('wraithCorpus')}</legend>
            <div className="field-row">
              <DotRating label={t('permanent')} name="rage" value={fields.rage} onChange={handleField} min={0} max={10} />
              <DotRating label={t('temporary')} name="currentRage" value={fields.currentRage} onChange={handleField} min={0} max={fields.rage} />
            </div>
            {fields.currentRage <= 2 && fields.currentRage > 0 && (
              <p className="status-warning" role="status" aria-live="polite" style={{ marginTop: 'var(--space-xs)', fontSize: '0.8rem' }}>
                Corpus critically low ({fields.currentRage}/{fields.rage}). Risk of dissolution.
              </p>
            )}
            {fields.currentRage === 0 && (
              <p className="status-warning" role="alert" aria-live="assertive" style={{ marginTop: 'var(--space-xs)', fontSize: '0.8rem', fontWeight: 700 }}>
                Corpus destroyed. The wraith has been dissolved into the Tempest.
              </p>
            )}
          </fieldset>
          <fieldset>
            <legend>{t('wraithAngst')}</legend>
            <div className="field-row">
              <DotRating label={t('permanent')} name="quintessence" value={fields.quintessence} onChange={handleField} min={0} max={10} />
            </div>
            {fields.quintessence >= 7 && fields.quintessence < 10 && (
              <p className="status-warning" role="status" aria-live="polite" style={{ marginTop: 'var(--space-xs)', fontSize: '0.8rem' }}>
                High Angst ({fields.quintessence}). The Shadow grows powerful and may attempt to seize control.
              </p>
            )}
            {fields.quintessence >= 10 && (
              <p className="status-warning" role="alert" aria-live="assertive" style={{ marginTop: 'var(--space-xs)', fontSize: '0.8rem', fontWeight: 700 }}>
                Angst at maximum. The Shadow dominates -- Spectre transformation imminent.
              </p>
            )}
          </fieldset>
        </div>
      </div>

      {/* Health */}
      <div role="tabpanel" id="tabpanel-7" aria-labelledby="tab-7" hidden={tab !== 7}>
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
                      <td style={{ color: 'var(--color-text-muted)' }}>{h.penalty || '\u2014'}</td>
                      <td style={{ fontWeight: 600, color: dmgColor }}>{dmgLabel}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </fieldset>
        </div>
      </div>

      {/* Backgrounds */}
      <div role="tabpanel" id="tabpanel-8" aria-labelledby="tab-8" hidden={tab !== 8}>
        <div className="form-section">
          <fieldset>
            <legend>{t('backgrounds')} ({backgrounds.length})</legend>
            {backgrounds.length > 0 && (
              <ul className="tag-list" style={{ marginBottom: 'var(--space-md)' }}>
                {backgrounds.map(b => (
                  <li key={b.id} className={`tag tag--clickable${b.id === tagInfo?.id ? ' tag--active' : ''}`}
                    onClick={() => setTagInfo(ti => ti?.id === b.id ? null : { ...b, kind: 'background' })}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTagInfo(ti => ti?.id === b.id ? null : { ...b, kind: 'background' }) } }}
                    role="button"
                    tabIndex={0}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
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
              const entry = WRAITH_BACKGROUNDS.find(bg => bg.value.toLowerCase() === tagInfo.name.toLowerCase())
              return (
                <aside className="tag-info-panel" style={{ marginBottom: 'var(--space-md)' }}>
                  <button className="tag-info-panel-close" onClick={() => setTagInfo(null)}>{t('close')}</button>
                  <p className="tag-info-panel-name">{tagInfo.name}</p>
                  <p className="tag-info-panel-desc">Background \u00b7 Level {tagInfo.level}</p>
                  {entry?.description && <p style={{ fontSize: '0.82rem', lineHeight: 1.55 }}>{entry.description}</p>}
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
            <legend>Background Catalogue ({WRAITH_BACKGROUNDS.length})</legend>
            <div className="catalog-search-wrap">
              <input type="search" value={bgSearch} onChange={e => setBgSearch(e.target.value)}
                placeholder="Search backgrounds..." aria-label="Search backgrounds" />
              <span className="catalog-search-count">{WRAITH_BACKGROUNDS.filter(b => !bgSearch || b.value.toLowerCase().includes(bgSearch.toLowerCase()) || (b.description || '').toLowerCase().includes(bgSearch.toLowerCase())).length}</span>
            </div>
            <ul className="catalog-list" aria-label="Background catalogue">
              {WRAITH_BACKGROUNDS
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

      {/* Merits & Flaws */}
      <div role="tabpanel" id="tabpanel-9" aria-labelledby="tab-9" hidden={tab !== 9}>
        <MeritsFlawsSection characterId={characterId} merits={merits} setMerits={setMerits} flaws={flaws} setFlaws={setFlaws} meritCatalog={meritCatalog} flawCatalog={flawCatalog} />
      </div>

      {/* Inventory */}
      <div role="tabpanel" id="tabpanel-10" aria-labelledby="tab-10" hidden={tab !== 10}>
        <InventorySection characterId={characterId} inventory={inventory} setInventory={setInventory} personalItems={fields.personalItems} onPersonalItemsChange={handleText} />
      </div>

      {/* Backstory */}
      <div role="tabpanel" id="tabpanel-11" aria-labelledby="tab-11" hidden={tab !== 11}>
        <div className="form-section">
          <fieldset><legend>{t('backstoryLabel')}</legend><textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('appearanceLabel')}</legend><textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('goalsLabel')}</legend><textarea name="goals" value={fields.goals} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('alliesLabel')}</legend><textarea name="allies" value={fields.allies} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('enemiesLabel')}</legend><textarea name="enemies" value={fields.enemies} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('notes')}</legend><textarea name="notes" value={fields.notes} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
        </div>
      </div>

      {/* XP Log */}
      <div role="tabpanel" id="tabpanel-12" aria-labelledby="tab-12" hidden={tab !== 12}>
        <XpLogSection splat="wraith" xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)} t={t} />
      </div>

      {/* Dice Pools */}
      <div role="tabpanel" id="tabpanel-13" aria-labelledby="tab-13" hidden={tab !== 13}>
        <DicePoolsTab fields={fields} splat="WRAITH" characterId={characterId} />
      </div>

      {/* Dice Roller */}
      <div role="tabpanel" id="tabpanel-14" aria-labelledby="tab-14" hidden={tab !== 14}>
        <StorytellerDiceRoller />
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => setShowExport(true)}>{t('exportPdf')}</button>
        <button className="btn btn-secondary" onClick={() => navigate('/characters')}>{t('cancel')}</button>
        <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>{saving ? t('saving') : t('quickSave')}</button>
        <button className="btn btn-primary" onClick={handleDoneEditing} disabled={saving}>{t('doneEditing')}</button>
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
