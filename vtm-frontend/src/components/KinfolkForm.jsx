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
import DicePoolsTab from './DicePoolsTab'
import StorytellerDiceRoller from './StorytellerDiceRoller'
import { useLanguage } from '../i18n/LanguageContext'

const TRIBES = [
  { value: 'Black Furies', description: 'Matriarchal warriors devoted to Gaia and the Wyld.' },
  { value: 'Bone Gnawers', description: 'Urban scavengers who live among the homeless and outcasts.' },
  { value: 'Children of Gaia', description: 'Peacemakers who seek harmony among the tribes.' },
  { value: 'Fianna', description: 'Celtic warriors, poets, and revelers.' },
  { value: 'Get of Fenris', description: 'Norse berserkers who value strength above all.' },
  { value: 'Glass Walkers', description: 'Tech-savvy urban wolves who embrace the modern world.' },
  { value: 'Red Talons', description: 'Lupus-only tribe that despises humanity.' },
  { value: 'Shadow Lords', description: 'Ambitious schemers who seek to lead the Garou Nation.' },
  { value: 'Silent Striders', description: 'Nomadic wanderers cursed to never find rest.' },
  { value: 'Silver Fangs', description: 'Noble-blooded rulers of the Garou Nation.' },
  { value: 'Stargazers', description: 'Contemplative mystics seeking inner balance.' },
  { value: 'Uktena', description: 'Keepers of dark secrets and forbidden lore.' },
  { value: 'Wendigo', description: 'Pure-blooded warriors of the frozen north.' },
]

const BREEDS = [
  { value: 'Homid', description: 'Born human. Carries the wolf gene but raised in human society.' },
  { value: 'Metis', description: 'Born of two Garou — forbidden. Bears a deformity but raised among the Garou.' },
]

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

const INITIAL = {
  npc: false, splat: 'KINFOLK',
  name: '', altName: '', concept: '', nature: '', demeanor: '',
  clan: '', sire: '',
  strength: 1, dexterity: 1, stamina: 1,
  charisma: 1, manipulation: 1, appearance: 1,
  perception: 1, intelligence: 1, wits: 1,
  strengthSpec: '', dexteritySpec: '', staminaSpec: '',
  charismaSpec: '', manipulationSpec: '', appearanceSpec: '',
  perceptionSpec: '', intelligenceSpec: '', witsSpec: '',
  alertness: 0, athletics: 0, awareness: 0, brawl: 0, empathy: 0,
  expression: 0, intimidation: 0, leadership: 0, primalUrge: 0, streetwise: 0, subterfuge: 0,
  animalKen: 0, crafts: 0, drive: 0, etiquette: 0, firearms: 0,
  larceny: 0, melee: 0, performance: 0, stealth: 0, survival: 0,
  academics: 0, computer: 0, enigmas: 0, investigation: 0, law: 0,
  medicine: 0, occult: 0, politics: 0, ritualAbility: 0, science: 0, technology: 0,
  willpower: 3, currentWillpower: 3,
  pathRating: 7, pathName: 'Humanity',
  conscience: 1, selfControl: 1, courage: 1,
  woundBashing: 0, woundLethal: 0, woundAgg: 0,
  notes: '', backstory: '', appearanceDesc: '',
  sorceryDesc: '',
}

const TAB_KEYS = ['tabIdentity', 'tabAttributes', 'tabAbilities', 'tabGifts', 'tabHealth', 'tabBackstory', 'tabXpLog', 'tabDicePools', 'tabDiceRoller']

export default function KinfolkForm() {
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
        <h2>{fields.name || t('editKinfolk')}</h2>
        <span className="splat-badge splat-badge--werewolf">{t('kinfolk')}</span>
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}
      {actionError && <p className="status-error" role="alert">{actionError}</p>}

      <div className="tab-list" role="tablist">
        {TAB_KEYS.map((tk, i) => (
          <button key={tk} role="tab" className={`btn btn-secondary${tab === i ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(i)} aria-selected={tab === i}>{t(tk)}</button>
        ))}
      </div>

      {/* Identity */}
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
              <CatalogSelect id="clan" name="clan" label={t('kinfolkTribe')} value={fields.clan} onChange={handleField} catalog={TRIBES} />
              <CatalogSelect id="sire" name="sire" label={t('kinfolkBreed')} value={fields.sire} onChange={handleField} catalog={BREEDS} />
            </div>
          </fieldset>
        </div>
      </div>

      {/* Attributes */}
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
                  </div>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </div>

      {/* Abilities */}
      <div hidden={tab !== 2}>
        <div className="form-section">
          <fieldset>
            <legend>{t('talents')}</legend>
            <div className="rating-grid">
              {['alertness', 'athletics', 'awareness', 'brawl', 'empathy', 'expression', 'intimidation', 'leadership', 'primalUrge', 'streetwise', 'subterfuge'].map(a =>
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
              {['academics', 'computer', 'enigmas', 'investigation', 'law', 'medicine', 'occult', 'politics', 'ritualAbility', 'science', 'technology'].map(a =>
                <div key={a} className="ability-row"><DotRating label={t(a)} name={a} value={fields[a]} onChange={handleField} /></div>
              )}
            </div>
          </fieldset>
        </div>
      </div>

      {/* Gifts & Powers */}
      <div hidden={tab !== 3}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tabGifts')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Kinfolk can learn Gifts that don't require Gnosis to activate. Describe gifts, numina, and fetishes below.
            </p>
            <textarea name="sorceryDesc" value={fields.sorceryDesc} onChange={handleText} rows={8} style={{ width: '100%' }}
              aria-label="Gifts and Numina" placeholder="List gifts, numina, and fetishes here..." />
          </fieldset>
          <fieldset>
            <legend>{t('willpowerAndHumanity')}</legend>
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
          </fieldset>
        </div>
      </div>

      {/* Health */}
      <div hidden={tab !== 4}>
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

      {/* Backstory */}
      <div hidden={tab !== 5}>
        <div className="form-section">
          <fieldset><legend>{t('backstoryLabel')}</legend><textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('appearanceLabel')}</legend><textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('notes')}</legend><textarea name="notes" value={fields.notes} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
        </div>
      </div>

      {/* XP Log */}
      <div hidden={tab !== 6}>
        <XpLogSection splat="werewolf" xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)} t={t} />
      </div>

      {/* Dice Pools */}
      <div hidden={tab !== 7}>
        <DicePoolsTab fields={fields} splat="KINFOLK" characterId={characterId} />
      </div>

      {/* Dice Roller */}
      <div hidden={tab !== 8}>
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
