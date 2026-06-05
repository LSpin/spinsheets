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
import SaveButton from './SaveButton'

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

const CREEDS = [
  { value: 'Avenger', description: 'Destroy the monsters. No mercy, no quarter.' },
  { value: 'Defender', description: 'Protect the innocent from supernatural threats.' },
  { value: 'Innocent', description: 'Seek understanding. Not all monsters are evil.' },
  { value: 'Judge', description: 'Weigh the evidence. Punish the guilty, spare the innocent.' },
  { value: 'Martyr', description: 'Sacrifice yourself to save others.' },
  { value: 'Redeemer', description: 'Save the monsters from themselves.' },
  { value: 'Visionary', description: 'Understand the bigger picture. Guide others.' },
  { value: 'Wayward', description: 'The most dangerous hunters. Driven by an extreme calling.' },
]

const VIRTUES = [
  { value: 'Mercy', description: 'Compassion and healing. Defend and redeem.' },
  { value: 'Vision', description: 'Perception and understanding. See the truth.' },
  { value: 'Zeal', description: 'Righteous fury. Destroy evil wherever it hides.' },
]

const HUNTER_EDGES = [
  // Mercy Edges
  { name: 'Cleave', virtue: 'Mercy', level: 1, description: 'Sense the supernatural. Detect monsters within line of sight.' },
  { name: 'Ward', virtue: 'Mercy', level: 2, description: 'Create a protective barrier against supernatural creatures.' },
  { name: 'Rejuvenate', virtue: 'Mercy', level: 3, description: 'Heal wounds on yourself or others through divine power.' },
  { name: 'Becalm', virtue: 'Mercy', level: 4, description: 'Calm a supernatural creature, suppressing its powers temporarily.' },
  { name: 'Restore', virtue: 'Mercy', level: 5, description: 'Purify corruption and remove supernatural taint.' },
  // Vision Edges
  { name: 'Witness', virtue: 'Vision', level: 1, description: 'See through supernatural disguises and illusions.' },
  { name: 'Pinpoint', virtue: 'Vision', level: 2, description: 'Track a supernatural creature you have witnessed.' },
  { name: 'Discern', virtue: 'Vision', level: 3, description: 'Read the intentions and nature of a supernatural being.' },
  { name: 'Expose', virtue: 'Vision', level: 4, description: 'Force a supernatural creature to reveal its true form.' },
  { name: 'Illuminate', virtue: 'Vision', level: 5, description: 'Reveal all hidden supernatural presences in an area.' },
  // Zeal Edges
  { name: 'Smite', virtue: 'Zeal', level: 1, description: 'Imbue your weapon with divine fire. Extra damage vs. supernatural.' },
  { name: 'Trail', virtue: 'Zeal', level: 2, description: 'Sense the direction of a supernatural creature you seek.' },
  { name: 'Smolder', virtue: 'Zeal', level: 3, description: 'Set supernatural creatures ablaze with holy fire.' },
  { name: 'Surge', virtue: 'Zeal', level: 4, description: 'Boost physical abilities to superhuman levels briefly.' },
  { name: 'Smolder', virtue: 'Zeal', level: 5, description: 'Unleash devastating divine judgment on supernatural evil.' },
]

const HUNTER_BACKGROUNDS = [
  { value: 'Allies', description: 'Mortals who actively support and assist you.', levels: ['One helpful contact.', 'A small group of supporters.', 'A reliable network.', 'Multiple groups across fields.', 'Powerful allies with broad influence.'] },
  { value: 'Arsenal', description: 'Access to weapons and hunter gear.', levels: ['Basic self-defense items.', 'A modest personal armory.', 'Serious weaponry and tactical gear.', 'Military-grade equipment.', 'An extensive arsenal.'] },
  { value: 'Contacts', description: 'Information sources across society.', levels: ['One or two people in a single field.', 'A small network spanning a couple of fields.', 'Informants across several areas.', 'Sources in most walks of life.', 'Extensive intelligence network.'] },
  { value: 'Fame', description: 'Public recognition and celebrity.', levels: ['Known in a small niche.', 'Known locally.', 'Regional celebrity.', 'National prominence.', 'International fame.'] },
  { value: 'Influence', description: 'Power within mortal institutions.', levels: ['Minor pull in one institution.', 'Reliable leverage in a couple of organisations.', 'Significant sway in several institutions.', 'Major power across multiple sectors.', 'Commanding influence.'] },
  { value: 'Mentor', description: 'An experienced hunter who guides you.', levels: ['Occasional advice.', 'Active support and guidance.', 'Real influence in hunter circles.', 'Considerable status, intervenes when needed.', 'Legendary hunter whose favour opens doors.'] },
  { value: 'Resources', description: 'Wealth, assets, property, and financial power.', levels: ['Modest savings.', 'Comfortable middle-class.', 'Affluent with significant assets.', 'Wealthy with few financial limits.', 'Vast, effectively unlimited wealth.'] },
  { value: 'Retainers', description: 'Loyal followers who carry out your will.', levels: ['One loyal assistant.', 'A couple of reliable helpers.', 'Several capable retainers.', 'A staff covering most needs.', 'A household of devoted specialists.'] },
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
      {match && <p className="archetype-desc" style={{ gridColumn: '1 / -1' }}>{match.description}</p>}
    </div>
  )
}

const INITIAL = {
  splat: 'HUNTER', npc: false,
  name: '', concept: '', nature: '', demeanor: '',
  clan: '', // Creed
  sect: '', // Primary Virtue
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
  rage: 0, currentRage: 0, // Conviction
  gnosis: 0, currentGnosis: 0, // Edge points
  // Health
  healthBruised: '', healthHurt: '', healthInjured: '', healthWounded: '', healthMauled: '', healthCrippled: '', healthIncap: '',
  notes: '', backstory: '', appearanceDesc: '',
  sorceryDesc: '', // Edges description
  goals: '', allies: '', enemies: '',
  personalItems: '',
}

const TAB_KEYS = [
  'tabIdentity', 'tabAttributes', 'tabAbilities', 'tabSecondaryAbilities',
  'tabEdges', 'tabAdvantages', 'tabHealth',
  'tabBackgrounds', 'tabMeritsFlaws', 'tabInventory',
  'tabBackstory', 'tabXpLog', 'tabDicePools', 'tabDiceRoller'
]

export default function HunterForm() {
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
    catch(e) { setSaveError(t('failedToSave')); throw e }
    finally { setSaving(false) }
  }

  async function handleDoneEditing() { await handleSave(); navigate('/characters') }

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/characters')}>{t('back')}</button>
        <h2>{fields.name || t('editHunter')}</h2>
        <span className="splat-badge splat-badge--hunter">{t('hunter')}</span>
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
              <div className="field"><label>{t('concept')}</label><input name="concept" value={fields.concept} onChange={handleText} /></div>
            </div>
            <div className="field-row">
              <CatalogSelect id="nature" name="nature" label={t('nature')} value={fields.nature} onChange={handleField} catalog={ARCHETYPES} />
              <CatalogSelect id="demeanor" name="demeanor" label={t('demeanor')} value={fields.demeanor} onChange={handleField} catalog={ARCHETYPES} />
            </div>
            <div className="field-row">
              <CatalogSelect id="clan" name="clan" label={t('hunterCreed')} value={fields.clan} onChange={handleField} catalog={CREEDS} />
              <CatalogSelect id="sect" name="sect" label={t('hunterVirtue')} value={fields.sect} onChange={handleField} catalog={VIRTUES} />
            </div>
            {fields.clan && !fields.sect && (
              <p className="status-warning mt-xs text-sm" role="status" aria-live="polite" >
                Creed "{fields.clan}" selected but no primary Virtue chosen. Select a Virtue to determine available Edges.
              </p>
            )}
            {fields.sect && (
              <div role="status" aria-live="polite" className="mt-sm p-sm border text-base" style={{ background: 'rgba(52,152,219,0.08)', borderRadius: '6px' }}>
                <p style={{ margin: 0 }}>
                  <strong>{fields.sect}</strong> Virtue selected. Primary Edges available: {HUNTER_EDGES.filter(e => e.virtue === fields.sect).map(e => e.name).filter((v, i, arr) => arr.indexOf(v) === i).join(', ')}.
                </p>
              </div>
            )}
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

      {/* Edges */}
      <div role="tabpanel" id="tabpanel-4" aria-labelledby="tab-4" hidden={tab !== 4}>
        <div className="form-section">
          <fieldset>
            <legend>{t('hunterEdges')}</legend>
            <p className="muted-hint muted-hint--xs mb-sm" >{t('hunterEdgesHint')}</p>
            <div className="field-row">
              <DotRating label={t('hunterConviction')} name="rage" value={fields.rage} onChange={handleField} min={0} max={10} />
              <DotRating label={t('hunterCurrentConviction')} name="currentRage" value={fields.currentRage} onChange={handleField} min={0} max={10} />
            </div>
            {(() => {
              const parts = (fields.sorceryDesc || '').split('||')
              const edgesPart = (parts[0] || '').split(',').map(s => s.trim()).filter(Boolean)
              const notesPart = parts[1] || ''
              function updateEdges(nextEdges, notes) {
                const val = nextEdges.join(', ') + (notes ? '||' + notes : '')
                handleField('sorceryDesc', val)
              }
              return (
                <>
                  {['Mercy', 'Vision', 'Zeal'].map(virtue => (
                    <div key={virtue} className="mb-md" >
                      <h4 style={{ margin: '0 0 var(--space-xs) 0' }}>{virtue} Edges</h4>
                      <ul className="catalog-list" aria-label={`${virtue} edges`}>
                        {HUNTER_EDGES.filter(e => e.virtue === virtue).map(edge => {
                          const isChecked = edgesPart.includes(edge.name)
                          return (
                            <li key={`${edge.virtue}-${edge.name}-${edge.level}`} className={`catalog-item${isChecked ? ' catalog-item--added' : ''}`}>
                              <label className="flex items-start gap-xs cursor-pointer w-full" style={{ padding: 'var(--space-xs) var(--space-sm)' }}>
                                <input type="checkbox" checked={isChecked} onChange={() => {
                                  const next = isChecked ? edgesPart.filter(n => n !== edge.name) : [...edgesPart, edge.name]
                                  updateEdges(next, notesPart)
                                }} style={{ marginTop: '3px' }} />
                                <div>
                                  <span className="catalog-item-name font-semibold" >{edge.name}</span>
                                  <span className="text-muted text-sm" > (Level {edge.level})</span>
                                  <p className="catalog-item-desc text-sm" style={{ margin: '2px 0 0' }}>{edge.description}</p>
                                </div>
                              </label>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  ))}
                  <div className="mt-md" >
                    <label className="font-semibold mb-xs" style={{ display: 'block' }}>Edge Notes</label>
                    <textarea value={notesPart} onChange={e => updateEdges(edgesPart, e.target.value)} rows={4} className="w-full" 
                      aria-label="Custom edge notes" placeholder="Additional edge notes..." />
                  </div>
                </>
              )
            })()}
          </fieldset>
        </div>
      </div>

      {/* Advantages */}
      <div role="tabpanel" id="tabpanel-5" aria-labelledby="tab-5" hidden={tab !== 5}>
        <div className="form-section">
          <fieldset>
            <legend>{t('willpower')}</legend>
            <div className="field-row">
              <DotRating label={t('permanent')} name="willpower" value={fields.willpower} onChange={handleField} min={1} max={10} />
              <DotRating label={t('temporary')} name="currentWillpower" value={fields.currentWillpower} onChange={handleField} min={0} max={fields.willpower} />
            </div>
            {fields.currentWillpower > fields.willpower && (
              <p className="status-warning mt-xs text-sm" role="status" aria-live="polite" >
                Temporary Willpower cannot exceed permanent ({fields.willpower}).
              </p>
            )}
          </fieldset>
          <fieldset>
            <legend>{t('hunterConviction')}</legend>
            <div className="field-row">
              <DotRating label={t('permanent')} name="rage" value={fields.rage} onChange={handleField} min={0} max={10} />
              <DotRating label={t('temporary')} name="currentRage" value={fields.currentRage} onChange={handleField} min={0} max={fields.rage} />
            </div>
            {fields.currentRage > fields.rage && (
              <p className="status-warning mt-xs text-sm" role="status" aria-live="polite" >
                Current Conviction cannot exceed permanent ({fields.rage}).
              </p>
            )}
            {fields.rage === 0 && (
              <p className="status-warning mt-xs text-sm" role="status" aria-live="polite" >
                No Conviction. The hunter has lost their calling and cannot use Edges.
              </p>
            )}
          </fieldset>
        </div>
      </div>

      {/* Health */}
      <div role="tabpanel" id="tabpanel-6" aria-labelledby="tab-6" hidden={tab !== 6}>
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

      {/* Backgrounds */}
      <div role="tabpanel" id="tabpanel-7" aria-labelledby="tab-7" hidden={tab !== 7}>
        <div className="form-section">
          <fieldset>
            <legend>{t('backgrounds')} ({backgrounds.length})</legend>
            {backgrounds.length > 0 && (
              <ul className="tag-list mb-md" >
                {backgrounds.map(b => (
                  <li key={b.id} className={`tag tag--clickable${b.id === tagInfo?.id ? ' tag--active' : ''}`}
                    onClick={() => setTagInfo(ti => ti?.id === b.id ? null : { ...b, kind: 'background' })}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTagInfo(ti => ti?.id === b.id ? null : { ...b, kind: 'background' }) } }}
                    role="button"
                    tabIndex={0}>
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
              const entry = HUNTER_BACKGROUNDS.find(bg => bg.value.toLowerCase() === tagInfo.name.toLowerCase())
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
            <legend>Background Catalogue ({HUNTER_BACKGROUNDS.length})</legend>
            <div className="catalog-search-wrap">
              <input type="search" value={bgSearch} onChange={e => setBgSearch(e.target.value)}
                placeholder="Search backgrounds..." aria-label="Search backgrounds" />
              <span className="catalog-search-count">{HUNTER_BACKGROUNDS.filter(b => !bgSearch || b.value.toLowerCase().includes(bgSearch.toLowerCase()) || (b.description || '').toLowerCase().includes(bgSearch.toLowerCase())).length}</span>
            </div>
            <ul className="catalog-list" aria-label="Background catalogue">
              {HUNTER_BACKGROUNDS
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
      <div role="tabpanel" id="tabpanel-8" aria-labelledby="tab-8" hidden={tab !== 8}>
        <MeritsFlawsSection characterId={characterId} merits={merits} setMerits={setMerits} flaws={flaws} setFlaws={setFlaws} meritCatalog={meritCatalog} flawCatalog={flawCatalog} />
      </div>

      {/* Inventory */}
      <div role="tabpanel" id="tabpanel-9" aria-labelledby="tab-9" hidden={tab !== 9}>
        <InventorySection characterId={characterId} inventory={inventory} setInventory={setInventory} personalItems={fields.personalItems} onPersonalItemsChange={handleText} />
      </div>

      {/* Backstory */}
      <div role="tabpanel" id="tabpanel-10" aria-labelledby="tab-10" hidden={tab !== 10}>
        <div className="form-section">
          <fieldset><legend>{t('backstoryLabel')}</legend><textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} className="w-full"  /></fieldset>
          <fieldset><legend>{t('appearanceLabel')}</legend><textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={4} className="w-full"  /></fieldset>
          <fieldset><legend>{t('goalsLabel')}</legend><textarea name="goals" value={fields.goals} onChange={handleText} rows={4} className="w-full"  /></fieldset>
          <fieldset><legend>{t('alliesLabel')}</legend><textarea name="allies" value={fields.allies} onChange={handleText} rows={4} className="w-full"  /></fieldset>
          <fieldset><legend>{t('enemiesLabel')}</legend><textarea name="enemies" value={fields.enemies} onChange={handleText} rows={4} className="w-full"  /></fieldset>
          <fieldset><legend>{t('notes')}</legend><textarea name="notes" value={fields.notes} onChange={handleText} rows={4} className="w-full"  /></fieldset>
        </div>
      </div>

      {/* XP Log */}
      <div role="tabpanel" id="tabpanel-11" aria-labelledby="tab-11" hidden={tab !== 11}>
        <XpLogSection splat="hunter" xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)} t={t} />
      </div>

      {/* Dice Pools */}
      <div role="tabpanel" id="tabpanel-12" aria-labelledby="tab-12" hidden={tab !== 12}>
        <DicePoolsTab fields={fields} splat="HUNTER" characterId={characterId} />
      </div>

      {/* Dice Roller */}
      <div role="tabpanel" id="tabpanel-13" aria-labelledby="tab-13" hidden={tab !== 13}>
        <StorytellerDiceRoller />
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => setShowExport(true)}>{t('exportPdf')}</button>
        <button className="btn btn-secondary" onClick={() => navigate('/characters')}>{t('cancel')}</button>
        <SaveButton onSave={handleSave} disabled={saving} t={t} />
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
