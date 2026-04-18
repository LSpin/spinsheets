import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  getCharacter, updateCharacter,
  getBackgrounds, addBackground, removeBackground,
  getMeritCatalog, getFlawCatalog,
  getMerits, getFlaws,
  getInventory,
  getXpLog, addXpLogEntry, removeXpLogEntry,
  getDisciplines, addDiscipline, removeDiscipline,
} from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import MeritsFlawsSection from './MeritsFlawsSection'
import InventorySection from './InventorySection'
import DotRating from './DotRating'
import XpLogSection from './XpLogSection'
import { useLanguage } from '../i18n/LanguageContext'
import { VAMPIRE_BACKGROUNDS as BACKGROUNDS } from '../data/backgrounds'
import { VAMPIRE_DISCIPLINES } from '../data/vampireDisciplines'
import CatalogSelect from './CatalogSelect'
import TagInfoPanel from './TagInfoPanel'
import DicePoolsTab from './DicePoolsTab'
import StorytellerDiceRoller from './StorytellerDiceRoller'

const ARCHETYPES = [
  { value: 'Architect', description: 'Driven to create something of lasting value. Builds structures, organizations, or legacies.' },
  { value: 'Autocrat', description: 'Must be in charge. Seeks control and authority over every situation.' },
  { value: 'Bon Vivant', description: 'Life is for pleasure. Enjoys every moment and spreads joy to others.' },
  { value: 'Bravo', description: 'Might makes right. Uses intimidation and force to get what they want.' },
  { value: 'Caregiver', description: 'Nurtures and protects others. Finds purpose in helping those in need.' },
  { value: 'Celebrant', description: 'Lives for a single passion. Devoted to one cause, art, or pursuit above all.' },
  { value: 'Child', description: 'Innocent and dependent. Needs others to protect and guide them.' },
  { value: 'Competitor', description: 'Must win at everything. Turns every situation into a contest.' },
  { value: 'Conformist', description: 'Follows the group. Finds safety and purpose in belonging to something larger.' },
  { value: 'Conniver', description: 'Why work when others can do it for you? Manipulates others for personal gain.' },
  { value: 'Curmudgeon', description: 'Nothing is ever good enough. Criticizes everything and expects the worst.' },
  { value: 'Deviant', description: 'Rejects the status quo. Finds freedom in being different and breaking norms.' },
  { value: 'Director', description: 'Takes charge of situations. Organizes others and makes things happen.' },
  { value: 'Enigma', description: 'Mysterious and unknowable. Finds meaning in being an unsolvable puzzle.' },
  { value: 'Eye of the Storm', description: 'Calm amid chaos. Thrives in crisis while everything falls apart around them.' },
  { value: 'Fanatic', description: 'The cause is everything. Utterly devoted to a belief, willing to die for it.' },
  { value: 'Gallant', description: 'Seeks attention and admiration. Lives to be the center of attention.' },
  { value: 'Guru', description: 'Teaches and enlightens others. Finds purpose in sharing wisdom and knowledge.' },
  { value: 'Idealist', description: 'Believes in a better world. Strives to make the world match their vision.' },
  { value: 'Judge', description: 'Seeks truth and justice. Evaluates situations fairly and passes judgment.' },
  { value: 'Loner', description: 'Prefers solitude. Self-reliant and uncomfortable in groups.' },
  { value: 'Martyr', description: 'Suffers for others. Finds meaning in sacrifice and self-denial.' },
  { value: 'Masochist', description: 'Tests limits through suffering. Pushes boundaries of endurance and pain.' },
  { value: 'Monster', description: 'Embraces the beast within. Uses cruelty and fear as tools.' },
  { value: 'Pedagogue', description: 'Everyone has something to learn. Teaches whether asked to or not.' },
  { value: 'Penitent', description: 'Atones for past sins. Driven by guilt and the need for redemption.' },
  { value: 'Perfectionist', description: 'Nothing less than flawless. Obsessed with getting every detail right.' },
  { value: 'Rebel', description: 'Fights authority. Opposes the system and those in power on principle.' },
  { value: 'Rogue', description: 'Looks out for number one. Self-interested but not necessarily malicious.' },
  { value: 'Sadist', description: 'Enjoys inflicting pain. Finds pleasure in the suffering of others.' },
  { value: 'Scientist', description: 'Seeks rational explanations. Tests hypotheses and trusts evidence over belief.' },
  { value: 'Sociopath', description: 'Lacks empathy and remorse. Views others as tools or obstacles.' },
  { value: 'Soldier', description: 'Follows orders and fights for a cause. Loyal, disciplined, and duty-bound.' },
  { value: 'Survivor', description: 'Endures at all costs. Nothing matters more than making it through alive.' },
  { value: 'Thrill-Seeker', description: 'Lives for danger and excitement. Bored by safety and routine.' },
  { value: 'Traditionalist', description: 'Values the old ways. Preserves customs, rituals, and established order.' },
  { value: 'Trickster', description: 'Uses humor and mischief. Disrupts the serious and reveals hidden truths through pranks.' },
  { value: 'Visionary', description: 'Sees what could be. Driven by grand ideas and a vision of the future.' },
]

const CLANS = [
  { value: 'Assamite', description: 'Silent assassins and diablerists from the Middle East. Masters of stealth and death.' },
  { value: 'Brujah', description: 'Rebel philosophers and passionate warriors. Once scholars, now anarchs and firebrands.' },
  { value: 'Caitiff', description: 'Clanless vampires of unknown or thin blood. Scorned by all, beholden to none.' },
  { value: 'Followers of Set', description: 'Serpentine corruptors who worship Set. Spread vice and temptation to free the soul.' },
  { value: 'Gangrel', description: 'Feral shapeshifters close to the Beast. Nomadic survivors at home in the wild.' },
  { value: 'Giovanni', description: 'Incestuous necromancer clan with Mafia ties. Command the dead and mortal wealth alike.' },
  { value: 'Lasombra', description: 'Shadow-wielding masters of darkness. Ruthless leaders of the Sabbat.' },
  { value: 'Malkavian', description: 'Lunatics blessed with prophetic insight. Every one is mad, but their madness hides truth.' },
  { value: 'Nosferatu', description: 'Hideously deformed information brokers. Dwell in sewers but know everyone\'s secrets.' },
  { value: 'Ravnos', description: 'Nomadic tricksters and illusionists of Romani heritage. Masters of chimerstry and deception.' },
  { value: 'Toreador', description: 'Artists, seducers, and lovers of beauty. Entranced by mortal art and passion.' },
  { value: 'Tremere', description: 'Blood sorcerers and occult scholars. Hierarchical mages turned vampire through ritual.' },
  { value: 'Tzimisce', description: 'Flesh-sculpting lords of Eastern Europe. Ancient, alien, and terrifyingly inhuman.' },
  { value: 'Ventrue', description: 'Blue-blooded aristocrats and power brokers. Born to rule the Camarilla and Kindred society.' },
]

const INITIAL = {
  npc: false, splat: 'GHOUL',
  name: '', altName: '', concept: '', nature: '', demeanor: '',
  clan: '', sire: '',
  // Attributes
  strength: 1, dexterity: 1, stamina: 1,
  charisma: 1, manipulation: 1, appearance: 1,
  perception: 1, intelligence: 1, wits: 1,
  strengthSpec: '', dexteritySpec: '', staminaSpec: '',
  charismaSpec: '', manipulationSpec: '', appearanceSpec: '',
  perceptionSpec: '', intelligenceSpec: '', witsSpec: '',
  // Abilities
  alertness: 0, athletics: 0, awareness: 0, brawl: 0, empathy: 0,
  expression: 0, intimidation: 0, leadership: 0, streetwise: 0, subterfuge: 0,
  animalKen: 0, crafts: 0, drive: 0, etiquette: 0, firearms: 0,
  larceny: 0, melee: 0, performance: 0, stealth: 0, survival: 0,
  academics: 0, computer: 0, finance: 0, investigation: 0, law: 0,
  medicine: 0, occult: 0, politics: 0, science: 0, technology: 0,
  // Ghoul-specific
  willpower: 3, currentWillpower: 3,
  currentBlood: 1, pathRating: 7, pathName: 'Humanity',
  conscience: 1, selfControl: 1, courage: 1,
  // Health
  woundBashing: 0, woundLethal: 0, woundAgg: 0,
  notes: '', backstory: '', appearanceDesc: '',
}

const TAB_KEYS = ['tabIdentity', 'tabAttributes', 'tabAbilities', 'tabDisciplines', 'tabAdvantages', 'tabHealth', 'tabBackgrounds', 'tabMeritsFlaws', 'tabInventory', 'tabBackstory', 'tabXpLog', 'tabDicePools', 'tabDiceRoller']

export default function GhoulForm() {
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
  const [disciplines, setDisciplines] = useState([])
  const [merits, setMerits] = useState([])
  const [flaws, setFlaws] = useState([])
  const [meritCatalog, setMeritCatalog] = useState([])
  const [flawCatalog, setFlawCatalog] = useState([])
  const [inventory, setInventory] = useState([])
  const [xpLog, setXpLog] = useState([])
  const [newBackground, setNewBackground] = useState({ name: '', level: 1, description: '' })
  const [newDisc, setNewDisc] = useState({ name: '', level: 1, notes: '' })
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
      const [charRes, bgRes, discRes, meritRes, flawRes, mcRes, fcRes, invRes, xpRes] = await Promise.all([
        getCharacter(characterId), getBackgrounds(characterId), getDisciplines(characterId),
        getMerits(characterId), getFlaws(characterId), getMeritCatalog(), getFlawCatalog(),
        getInventory(characterId), getXpLog(characterId),
      ])
      const data = charRes.data
      setFields(prev => {
        const merged = { ...prev }
        for (const key in prev) { if (data[key] !== undefined && data[key] !== null) merged[key] = data[key] }
        return merged
      })
      setBackgrounds(bgRes.data)
      setDisciplines(discRes.data)
      setMerits(meritRes.data); setFlaws(flawRes.data)
      setMeritCatalog(mcRes.data); setFlawCatalog(fcRes.data)
      setInventory(invRes.data); setXpLog(xpRes.data)
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

  async function handleDoneEditing() {
    await handleSave()
    navigate('/characters')
  }

  async function handleAddBackground() {
    if (!newBackground.name.trim()) return
    try {
      const res = await addBackground(characterId, newBackground)
      setBackgrounds(prev => [...prev, res.data])
      setNewBackground({ name: '', level: 1, description: '' })
    } catch { setActionError(t('failedToSave')) }
  }

  async function handleAddDiscipline() {
    if (!newDisc.name.trim()) return
    try {
      const res = await addDiscipline(characterId, newDisc)
      setDisciplines(prev => [...prev, res.data])
      setNewDisc({ name: '', level: 1, notes: '' })
    } catch { setActionError(t('failedToSave')) }
  }

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/characters')}>{t('back')}</button>
        <h2>{fields.name || t('editGhoul')}</h2>
        <span className="splat-badge splat-badge--vampire">{t('ghoul')}</span>
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
              <CatalogSelect id="nature" name="nature" label={t('nature')} value={fields.nature} onChange={handleField} catalog={ARCHETYPES} />
              <CatalogSelect id="demeanor" name="demeanor" label={t('demeanor')} value={fields.demeanor} onChange={handleField} catalog={ARCHETYPES} />
            </div>
            <div className="field-row">
              <CatalogSelect id="clan" name="clan" label={t('ghoulDomitorClan')} value={fields.clan} onChange={handleField} catalog={CLANS} />
              <div className="field"><label>{t('sire')}</label><input name="sire" value={fields.sire} onChange={handleText} placeholder={t('ghoulDomitorName')} /></div>
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

      {/* ── Attributes ── */}
      <div hidden={tab !== 1}>
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
                    <input className="spec-input" type="text" name={a + 'Spec'} value={fields[a + 'Spec'] ?? ''} onChange={handleText} placeholder={t('specialty')} />
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
              {['academics', 'computer', 'finance', 'investigation', 'law', 'medicine', 'occult', 'politics', 'science', 'technology'].map(a =>
                <div key={a} className="ability-row"><DotRating label={t(a)} name={a} value={fields[a]} onChange={handleField} /></div>
              )}
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Disciplines (from Domitor) ── */}
      <div hidden={tab !== 3}>
        <div className="form-section">
          <fieldset>
            <legend>{t('ghoulDisciplines')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>{t('ghoulDiscHint')}</p>
            {disciplines.length > 0 && (
              <ul className="tag-list">
                {disciplines.map(d => (
                  <li key={d.id} className={`tag tag--clickable${d.id === tagInfo?.id ? ' tag--active' : ''}`}
                    onClick={() => setTagInfo(ti => ti?.id === d.id ? null : { ...d, kind: 'discipline' })}>
                    <span>{d.name} (Lv{d.level})</span>
                    <button className="tag-remove" onClick={e => { e.stopPropagation(); removeDiscipline(characterId, d.id); setDisciplines(prev => prev.filter(x => x.id !== d.id)); if (tagInfo?.id === d.id) setTagInfo(null) }}>x</button>
                  </li>
                ))}
              </ul>
            )}
            <div className="field-row" style={{ alignItems: 'flex-end' }}>
              <div className="field" style={{ flex: 2 }}>
                <label>{t('disciplineName')}</label>
                <input type="text" list="ghoul-disc-catalog" value={newDisc.name} onChange={e => setNewDisc(p => ({ ...p, name: e.target.value }))} placeholder={t('phDiscipline')} autoComplete="off" />
                <datalist id="ghoul-disc-catalog">
                  {VAMPIRE_DISCIPLINES.map(d => <option key={d.name} value={d.name} />)}
                </datalist>
              </div>
              <div className="field">
                <label>{t('level')}</label>
                <select value={newDisc.level} onChange={e => setNewDisc(p => ({ ...p, level: parseInt(e.target.value) }))}>
                  {[1, 2, 3].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <button className="btn btn-secondary" onClick={handleAddDiscipline}>{t('add')}</button>
            </div>
          </fieldset>
          {tagInfo?.kind === 'discipline' && (() => {
            const entry = VAMPIRE_DISCIPLINES.find(d => d.name.toLowerCase() === tagInfo.name.toLowerCase())
            return <TagInfoPanel entry={entry ? { name: entry.name, description: entry.clans?.length ? `Clans: ${entry.clans.join(', ')}` : undefined } : { name: tagInfo.name }} level={tagInfo.level} levels={entry?.levels} onClose={() => setTagInfo(null)} />
          })()}
        </div>
      </div>

      {/* ── Advantages ── */}
      <div hidden={tab !== 4}>
        <div className="form-section">
          <fieldset>
            <legend>{t('virtues')}</legend>
            <div className="rating-grid">
              <div className="ability-row"><DotRating label={t('conscience')} name="conscience" value={fields.conscience} onChange={handleField} min={1} /></div>
              <div className="ability-row"><DotRating label={t('selfControl')} name="selfControl" value={fields.selfControl} onChange={handleField} min={1} /></div>
              <div className="ability-row"><DotRating label={t('courage')} name="courage" value={fields.courage} onChange={handleField} min={1} /></div>
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('ghoulVitals')}</legend>
            <div className="field-row">
              <DotRating label={t('willpower')} name="willpower" value={fields.willpower} onChange={handleField} min={1} max={10} />
              <DotRating label={t('currentWillpower')} name="currentWillpower" value={fields.currentWillpower} onChange={handleField} min={0} max={10} />
            </div>
            <div className="field-row">
              <div className="field">
                <label>{t('pathName')}</label>
                <input name="pathName" value={fields.pathName} onChange={handleText} />
              </div>
              <DotRating label={t('humanity')} name="pathRating" value={fields.pathRating} onChange={handleField} min={0} max={10} />
            </div>
            <div className="field-row">
              <DotRating label={t('ghoulBloodPool')} name="currentBlood" value={fields.currentBlood} onChange={handleField} min={0} max={5} />
            </div>
            <p className="muted-hint muted-hint--xs">{t('ghoulBloodHint')}</p>
          </fieldset>
        </div>
      </div>

      {/* ── Health ── */}
      <div hidden={tab !== 5}>
        <div className="form-section">
          <fieldset>
            <legend>{t('health')}</legend>
            <div className="field-row">
              <DotRating label={t('bashing')} name="woundBashing" value={fields.woundBashing} onChange={handleField} min={0} max={7} />
              <DotRating label={t('lethal')} name="woundLethal" value={fields.woundLethal} onChange={handleField} min={0} max={7} />
              <DotRating label={t('aggravated')} name="woundAgg" value={fields.woundAgg} onChange={handleField} min={0} max={7} />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Backgrounds ── */}
      <div hidden={tab !== 6}>
        <div className="form-section">
          <fieldset>
            <legend>{t('backgrounds')}</legend>
            {backgrounds.length > 0 && (
              <ul className="tag-list">
                {backgrounds.map(b => (
                  <li key={b.id} className="tag-item" onClick={() => setTagInfo(ti => ti?.id === b.id ? null : { ...b, kind: 'background' })}>
                    <span>{b.name} ({b.level}){b.description ? ` — ${b.description}` : ''}</span>
                    <button className="tag-remove" onClick={e => { e.stopPropagation(); removeBackground(characterId, b.id); setBackgrounds(prev => prev.filter(x => x.id !== b.id)) }}>x</button>
                  </li>
                ))}
              </ul>
            )}
            <div className="field-row" style={{ alignItems: 'flex-end' }}>
              <div className="field" style={{ flex: 2 }}>
                <label>{t('background')}</label>
                <input type="text" list="bg-suggestions" value={newBackground.name} onChange={e => setNewBackground(p => ({ ...p, name: e.target.value }))} placeholder={t('phBackground')} />
                <datalist id="bg-suggestions">{BACKGROUNDS.map(b => <option key={b.value} value={b.value} />)}</datalist>
              </div>
              <div className="field"><label>{t('level')}</label>
                <select value={newBackground.level} onChange={e => setNewBackground(p => ({ ...p, level: parseInt(e.target.value) }))}>{[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}</select>
              </div>
              <div className="field"><label>{t('description')}</label><input type="text" value={newBackground.description} onChange={e => setNewBackground(p => ({ ...p, description: e.target.value }))} /></div>
              <button className="btn btn-secondary" onClick={handleAddBackground}>{t('add')}</button>
            </div>
          </fieldset>
          {tagInfo?.kind === 'background' && (() => {
            const entry = BACKGROUNDS.find(bg => bg.value.toLowerCase() === tagInfo.name.toLowerCase())
            return <TagInfoPanel entry={entry ? { name: entry.value, description: entry.description } : { name: tagInfo.name }} level={tagInfo.level} levels={entry?.levels} onClose={() => setTagInfo(null)} />
          })()}
        </div>
      </div>

      {/* ── Merits & Flaws ── */}
      <div hidden={tab !== 7}>
        <MeritsFlawsSection characterId={characterId} merits={merits} setMerits={setMerits} flaws={flaws} setFlaws={setFlaws} meritCatalog={meritCatalog} flawCatalog={flawCatalog} />
      </div>

      {/* ── Inventory ── */}
      <div hidden={tab !== 8}>
        <InventorySection characterId={characterId} inventory={inventory} setInventory={setInventory} personalItems={fields.personalItems} onPersonalItemsChange={handleText} />
      </div>

      {/* ── Backstory ── */}
      <div hidden={tab !== 9}>
        <div className="form-section">
          <fieldset><legend>{t('backstoryLabel')}</legend><textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('appearanceLabel')}</legend><textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('notes')}</legend><textarea name="notes" value={fields.notes} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
        </div>
      </div>

      {/* ── XP Log ── */}
      <div hidden={tab !== 10}>
        <XpLogSection splat="vampire" xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)} t={t} />
      </div>

      {/* ── Dice Pools ── */}
      <div hidden={tab !== 11}>
        <DicePoolsTab fields={fields} splat="GHOUL" characterId={characterId} />
      </div>

      {/* ── Dice Roller ── */}
      <div hidden={tab !== 12}>
        <StorytellerDiceRoller />
      </div>

      <div className="form-actions">
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
    </div>
  )
}
