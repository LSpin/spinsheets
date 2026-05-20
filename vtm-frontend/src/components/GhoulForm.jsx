import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  getCharacter, updateCharacter,
  getXpLog, addXpLogEntry, removeXpLogEntry,
} from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import DotRating from './DotRating'
import XpLogSection from './XpLogSection'
import CatalogSelect from './CatalogSelect'
import { WOD_GHOUL_NPCS, WOD_GHOUL_NPC_CATALOG } from '../data/wodNpcs'
import DicePoolsTab from './DicePoolsTab'
import StorytellerDiceRoller from './StorytellerDiceRoller'
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

const GHOUL_DISCIPLINES = [
  { name: 'Potence', description: 'Supernatural physical strength, allowing feats of raw power beyond mortal limits' },
  { name: 'Fortitude', description: 'Supernatural resilience, reducing or ignoring physical damage' },
  { name: 'Celerity', description: 'Supernatural speed and reflexes' },
  { name: 'Obfuscate', description: 'The ability to hide from sight, clouding minds to become invisible' },
  { name: 'Auspex', description: 'Heightened senses and extrasensory perception' },
  { name: 'Dominate', description: 'Mental control through eye contact and spoken commands' },
  { name: 'Animalism', description: 'Communion with and command over animals and the Beast within' },
  { name: 'Presence', description: 'Supernatural awe and emotional manipulation' },
  { name: 'Protean', description: 'Shapeshifting abilities tied to the Beast' },
  { name: 'Vicissitude', description: 'Flesh and bone crafting, reshaping bodies like clay' },
]

function parseGhoulSorceryDesc(str) {
  if (!str) return { disciplines: {}, notes: '' }
  const [discPart, ...noteParts] = str.split('||')
  const notes = noteParts.join('||')
  const disciplines = {}
  if (discPart) {
    for (const p of discPart.split(',').map(s => s.trim()).filter(Boolean)) {
      const [name, lvl] = p.split(':')
      if (name && lvl !== undefined) disciplines[name.trim()] = parseInt(lvl) || 0
    }
  }
  return { disciplines, notes }
}

function serializeGhoulSorceryDesc(disciplines, notes) {
  const discStr = Object.entries(disciplines).filter(([, v]) => v > 0).map(([k, v]) => `${k}:${v}`).join(', ')
  if (notes) return `${discStr}||${notes}`
  return discStr
}

const CLANS = [
  { value: 'Assamite', description: 'Silent assassins and diablerists from the Middle East.' },
  { value: 'Brujah', description: 'Rebel philosophers and passionate warriors.' },
  { value: 'Caitiff', description: 'Clanless vampires of unknown or thin blood.' },
  { value: 'Followers of Set', description: 'Serpentine corruptors who spread vice and temptation.' },
  { value: 'Gangrel', description: 'Feral shapeshifters close to the Beast.' },
  { value: 'Giovanni', description: 'Incestuous necromancers with Mafia ties.' },
  { value: 'Lasombra', description: 'Shadow-wielding masters of darkness.' },
  { value: 'Malkavian', description: 'Lunatics blessed with prophetic insight.' },
  { value: 'Nosferatu', description: 'Hideously deformed information brokers.' },
  { value: 'Ravnos', description: 'Nomadic tricksters and illusionists.' },
  { value: 'Toreador', description: 'Artists, seducers, and lovers of beauty.' },
  { value: 'Tremere', description: 'Blood sorcerers and occult scholars.' },
  { value: 'Tzimisce', description: 'Flesh-sculpting lords of Eastern Europe.' },
  { value: 'Ventrue', description: 'Blue-blooded aristocrats and power brokers.' },
]

const INITIAL = {
  npc: false, splat: 'GHOUL',
  name: '', altName: '', concept: '', nature: '', demeanor: '',
  clan: '', sire: '',
  strength: 1, dexterity: 1, stamina: 1,
  charisma: 1, manipulation: 1, appearance: 1,
  perception: 1, intelligence: 1, wits: 1,
  strengthSpec: '', dexteritySpec: '', staminaSpec: '',
  charismaSpec: '', manipulationSpec: '', appearanceSpec: '',
  perceptionSpec: '', intelligenceSpec: '', witsSpec: '',
  alertness: 0, athletics: 0, awareness: 0, brawl: 0, empathy: 0,
  expression: 0, intimidation: 0, leadership: 0, streetwise: 0, subterfuge: 0,
  animalKen: 0, crafts: 0, drive: 0, etiquette: 0, firearms: 0,
  larceny: 0, melee: 0, performance: 0, stealth: 0, survival: 0,
  academics: 0, computer: 0, finance: 0, investigation: 0, law: 0,
  medicine: 0, occult: 0, politics: 0, science: 0, technology: 0,
  willpower: 3, currentWillpower: 3,
  currentBlood: 1, pathRating: 7, pathName: 'Humanity',
  conscience: 1, selfControl: 1, courage: 1,
  woundBashing: 0, woundLethal: 0, woundAgg: 0,
  notes: '', backstory: '', appearanceDesc: '',
  sorceryDesc: '',
}

const TAB_KEYS = ['tabIdentity', 'tabAttributes', 'tabAbilities', 'tabDisciplines', 'tabHealth', 'tabBackstory', 'tabXpLog', 'tabDicePools', 'tabDiceRoller']

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
  const [xpLog, setXpLog] = useState([])
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [actionError, setActionError] = useState(null)

  useEffect(() => { if (characterId) loadCharacter() }, [characterId])

  async function loadCharacter() {
    try {
      const [charRes, xpRes] = await Promise.all([
        getCharacter(characterId), getXpLog(characterId),
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

  function loadTemplate(templateName) {
    const tmpl = WOD_GHOUL_NPCS.find(t => t.name === templateName)
    if (!tmpl) return
    setFields(prev => ({
      ...prev,
      name: tmpl.name,
      concept: tmpl.concept,
      clan: tmpl.clan || '',
      nature: tmpl.nature || prev.nature,
      demeanor: tmpl.demeanor || prev.demeanor,
      strength: tmpl.str || 1,
      dexterity: tmpl.dex || 1,
      stamina: tmpl.sta || 1,
      charisma: tmpl.cha || 1,
      manipulation: tmpl.man || 1,
      appearance: tmpl.app || 1,
      perception: tmpl.per || 1,
      intelligence: tmpl.int || 1,
      wits: tmpl.wits || 1,
      willpower: tmpl.willpower || 3,
      currentWillpower: tmpl.willpower || 3,
      pathRating: tmpl.pathRating || prev.pathRating,
      // Abilities
      alertness: tmpl.alertness || 0, athletics: tmpl.athletics || 0,
      awareness: tmpl.awareness || 0, brawl: tmpl.brawl || 0,
      empathy: tmpl.empathy || 0, expression: tmpl.expression || 0,
      intimidation: tmpl.intimidation || 0, leadership: tmpl.leadership || 0,
      streetwise: tmpl.streetwise || 0, subterfuge: tmpl.subterfuge || 0,
      animalKen: tmpl.animalKen || 0, crafts: tmpl.crafts || 0,
      drive: tmpl.drive || 0, etiquette: tmpl.etiquette || 0,
      firearms: tmpl.firearms || 0, larceny: tmpl.larceny || 0,
      melee: tmpl.melee || 0, performance: tmpl.performance || 0,
      stealth: tmpl.stealth || 0, survival: tmpl.survival || 0,
      academics: tmpl.academics || 0, computer: tmpl.computer || 0,
      finance: tmpl.finance || 0, investigation: tmpl.investigation || 0,
      law: tmpl.law || 0, medicine: tmpl.medicine || 0,
      occult: tmpl.occult || 0, politics: tmpl.politics || 0,
      science: tmpl.science || 0, technology: tmpl.technology || 0,
      // Disciplines & notes
      sorceryDesc: tmpl.disciplines || '',
      notes: tmpl.notes || '',
    }))
  }

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
        <h2>{fields.name || t('editGhoul')}</h2>
        <span className="splat-badge splat-badge--vampire">{t('ghoul')}</span>
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
            {!viewMode && (
              <div className="field-row">
                <CatalogSelect id="ghoul-template" name="ghoulTemplate" label={t('dndLoadTemplate')}
                  value="" onChange={(_, v) => loadTemplate(v)}
                  catalog={WOD_GHOUL_NPC_CATALOG} showDescOnSelect={false} />
              </div>
            )}
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
              {['academics', 'computer', 'finance', 'investigation', 'law', 'medicine', 'occult', 'politics', 'science', 'technology'].map(a =>
                <div key={a} className="ability-row"><DotRating label={t(a)} name={a} value={fields[a]} onChange={handleField} /></div>
              )}
            </div>
          </fieldset>
        </div>
      </div>

      {/* Disciplines & Powers */}
      <div role="tabpanel" id="tabpanel-3" aria-labelledby="tab-3" hidden={tab !== 3}>
        <div className="form-section">
          <fieldset>
            <legend>{t('ghoulDisciplines')}</legend>
            <p className="muted-hint muted-hint--xs mb-sm">{t('ghoulDiscHint')}</p>
            {(() => {
              const { disciplines: discMap, notes: discNotes } = parseGhoulSorceryDesc(fields.sorceryDesc)
              return (
                <>
                  <div className="rating-grid">
                    {GHOUL_DISCIPLINES.map(disc => (
                      <div key={disc.name} className="ability-row">
                        <DotRating label={disc.name} name={disc.name} value={discMap[disc.name] || 0}
                          onChange={(name, val) => {
                            const updated = { ...discMap, [name]: val }
                            setFields(prev => ({ ...prev, sorceryDesc: serializeGhoulSorceryDesc(updated, discNotes) }))
                          }} />
                        <p className="muted-hint muted-hint--xs">{disc.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-sm">
                    <label>{t('notes')}</label>
                    <textarea value={discNotes}
                      onChange={e => setFields(prev => ({ ...prev, sorceryDesc: serializeGhoulSorceryDesc(discMap, e.target.value) }))}
                      rows={3} className="w-full" placeholder={t('ghoulDiscNotesPh')} />
                  </div>
                </>
              )
            })()}
          </fieldset>
          <fieldset>
            <legend>{t('ghoulVitals')}</legend>
            <div className="field-row">
              <DotRating label={t('willpower')} name="willpower" value={fields.willpower} onChange={handleField} min={1} max={10} />
              <DotRating label={t('currentWillpower')} name="currentWillpower" value={fields.currentWillpower} onChange={handleField} min={0} max={fields.willpower} />
            </div>
            {fields.currentWillpower > fields.willpower && (
              <p className="status-warning mt-xs text-sm" role="status" aria-live="polite">
                Temporary Willpower cannot exceed permanent ({fields.willpower}).
              </p>
            )}
            <div className="field-row">
              <DotRating label={t('ghoulBloodPool')} name="currentBlood" value={fields.currentBlood} onChange={handleField} min={0} max={5} />
            </div>
            <p className="muted-hint muted-hint--xs">{t('ghoulBloodHint')}</p>
            {fields.currentBlood === 0 && (
              <p className="status-warning mt-xs text-sm font-bold" role="alert" aria-live="assertive">
                No vitae remaining. The ghoul cannot use Disciplines and will begin aging if blood is not replenished.
              </p>
            )}
            {fields.currentBlood === 1 && (
              <p className="status-warning mt-xs text-sm" role="status" aria-live="polite">
                Blood pool critically low. The ghoul is desperate for vitae.
              </p>
            )}
            <div className="field-row mt-sm">
              <div className="field">
                <label>{t('pathName')}</label>
                <input name="pathName" value={fields.pathName} onChange={handleText} />
              </div>
              <DotRating label={t('humanity')} name="pathRating" value={fields.pathRating} onChange={handleField} min={0} max={10} />
            </div>
          </fieldset>
        </div>
      </div>

      {/* Health */}
      <div role="tabpanel" id="tabpanel-4" aria-labelledby="tab-4" hidden={tab !== 4}>
        <div className="form-section">
          <fieldset>
            <legend>{t('health')}</legend>
            <div className="field-row">
              <DotRating label={t('bashing')} name="woundBashing" value={fields.woundBashing} onChange={handleField} min={0} max={7} />
              <DotRating label={t('lethal')} name="woundLethal" value={fields.woundLethal} onChange={handleField} min={0} max={7} />
              <DotRating label={t('aggravated')} name="woundAgg" value={fields.woundAgg} onChange={handleField} min={0} max={7} />
            </div>
            {(fields.woundBashing + fields.woundLethal + fields.woundAgg) >= 7 && (
              <p className="status-warning mt-xs text-sm font-bold" role="alert" aria-live="assertive">
                Incapacitated. The ghoul is out of action{fields.woundAgg >= 7 ? ' and may be dead.' : '.'}
              </p>
            )}
            {(fields.woundBashing + fields.woundLethal + fields.woundAgg) >= 5 && (fields.woundBashing + fields.woundLethal + fields.woundAgg) < 7 && (
              <p className="status-warning mt-xs text-sm" role="status" aria-live="polite">
                Severely wounded ({fields.woundBashing + fields.woundLethal + fields.woundAgg}/7 health levels filled).
              </p>
            )}
          </fieldset>
        </div>
      </div>

      {/* Backstory */}
      <div role="tabpanel" id="tabpanel-5" aria-labelledby="tab-5" hidden={tab !== 5}>
        <div className="form-section">
          <fieldset><legend>{t('backstoryLabel')}</legend><textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} className="w-full" /></fieldset>
          <fieldset><legend>{t('appearanceLabel')}</legend><textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={4} className="w-full" /></fieldset>
          <fieldset><legend>{t('notes')}</legend><textarea name="notes" value={fields.notes} onChange={handleText} rows={4} className="w-full" /></fieldset>
        </div>
      </div>

      {/* XP Log */}
      <div role="tabpanel" id="tabpanel-6" aria-labelledby="tab-6" hidden={tab !== 6}>
        <XpLogSection splat="vampire" xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)} t={t} />
      </div>

      {/* Dice Pools */}
      <div role="tabpanel" id="tabpanel-7" aria-labelledby="tab-7" hidden={tab !== 7}>
        <DicePoolsTab fields={fields} splat="GHOUL" characterId={characterId} />
      </div>

      {/* Dice Roller */}
      <div role="tabpanel" id="tabpanel-8" aria-labelledby="tab-8" hidden={tab !== 8}>
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
