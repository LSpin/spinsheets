import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getCharacter, updateCharacter, getXpLog, addXpLogEntry, removeXpLogEntry } from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import DotRating from './DotRating'
import XpLogSection from './XpLogSection'
import { useLanguage } from '../i18n/LanguageContext'
import CatalogSelect from './CatalogSelect'
import DicePoolsTab from './DicePoolsTab'
import StorytellerDiceRoller from './StorytellerDiceRoller'

const ARCHETYPES = [
  { value: 'Alpha', description: 'Must lead. Dominates through strength and will.' },
  { value: 'Bravo', description: 'Might makes right. Uses intimidation and force.' },
  { value: 'Caregiver', description: 'Nurtures and protects others.' },
  { value: 'Fanatic', description: 'The cause is everything. Utterly devoted to the Wyrm.' },
  { value: 'Monster', description: 'Embraces the beast within. Cruelty and fear as tools.' },
  { value: 'Rebel', description: 'Fights authority on principle.' },
  { value: 'Sadist', description: 'Enjoys inflicting pain and suffering.' },
  { value: 'Survivor', description: 'Endures at all costs.' },
  { value: 'Thrill-Seeker', description: 'Lives for danger and excitement.' },
  { value: 'Visionary', description: 'Driven by visions of a Wyrm-transformed world.' },
]

const BREEDS = [
  { value: 'Homid', description: 'Born human. Raised among mortals before the First Change.' },
  { value: 'Metis', description: 'Born of two Garou. Deformed but spiritually gifted.' },
  { value: 'Lupus', description: 'Born wolf. Primal and instinct-driven.' },
]

const AUSPICES = [
  { value: 'Ragabash', description: 'New Moon. Trickster and scout.' },
  { value: 'Theurge', description: 'Crescent Moon. Spirit-speaker and mystic.' },
  { value: 'Philodox', description: 'Half Moon. Judge and mediator.' },
  { value: 'Galliard', description: 'Gibbous Moon. Bard and keeper of tales.' },
  { value: 'Ahroun', description: 'Full Moon. Warrior and champion.' },
]

const TAB_KEYS = ['tabIdentity', 'tabAttributes', 'tabAbilities', 'tabGifts', 'tabHealth', 'tabBackstory', 'tabXpLog', 'tabDicePools', 'tabDiceRoller']

const INITIAL = {
  splat: 'BSD', npc: true,
  name: '', concept: '', nature: '', demeanor: '',
  clan: 'Black Spiral Dancers', // Tribe
  sire: '', // Breed
  sect: '', // Auspice
  generation: 1, // Rank
  strength: 1, dexterity: 1, stamina: 1,
  charisma: 1, manipulation: 1, appearance: 1,
  perception: 1, intelligence: 1, wits: 1,
  alertness: 0, athletics: 0, awareness: 0, brawl: 0, empathy: 0,
  expression: 0, intimidation: 0, leadership: 0, streetwise: 0, subterfuge: 0,
  animalKen: 0, crafts: 0, drive: 0, etiquette: 0, firearms: 0,
  larceny: 0, melee: 0, performance: 0, stealth: 0, survival: 0,
  academics: 0, computer: 0, finance: 0, investigation: 0, law: 0,
  linguistics: 0, medicine: 0, occult: 0, politics: 0, science: 0, technology: 0,
  willpower: 3, currentWillpower: 3,
  rage: 5, currentRage: 5,
  gnosis: 3, currentGnosis: 3,
  sorceryDesc: '', // Gifts list
  clanCurse: '', // Wyrm taint / derangements
  notes: '', backstory: '', appearanceDesc: '',
}

export default function BsdForm() {
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

  useEffect(() => {
    if (characterId) loadCharacter()
  }, [characterId])

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

  async function handleDoneEditing() {
    await handleSave()
    navigate('/characters')
  }

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/characters')}>{t('back')}</button>
        <h2>{fields.name || 'New Black Spiral Dancer'}</h2>
        <span className="splat-badge splat-badge--bsd">BSD</span>
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
              <CatalogSelect id="sire" name="sire" label="Breed" value={fields.sire} onChange={handleField} catalog={BREEDS} />
              <CatalogSelect id="sect" name="sect" label="Auspice" value={fields.sect} onChange={handleField} catalog={AUSPICES} />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Rank</label>
                <select name="generation" value={fields.generation} onChange={e => handleField('generation', parseInt(e.target.value))}>
                  {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>Rank {v}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Tribe</label>
                <input name="clan" value={fields.clan} readOnly className="readonly-input" style={{ width: '100%' }} />
              </div>
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

      {/* Gifts & Wyrm Taint */}
      <div hidden={tab !== 3}>
        <div className="form-section">
          <fieldset>
            <legend>Wyrm-Tainted Gifts</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Black Spiral Dancers use corrupted versions of Garou gifts plus unique Wyrm-tainted gifts.
            </p>
            <textarea name="sorceryDesc" value={fields.sorceryDesc} onChange={handleText} rows={10} style={{ width: '100%' }}
              aria-label="Gifts" placeholder="List gifts with levels, e.g.&#10;Wyrm Hide 1&#10;Balefire 3&#10;Toxic Claws 2" />
          </fieldset>
          <fieldset>
            <legend>Wyrm Taint &amp; Derangements</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Describe mutations, derangements, and Wyrm corruption effects.
            </p>
            <textarea name="clanCurse" value={fields.clanCurse} onChange={handleText} rows={6} style={{ width: '100%' }}
              aria-label="Wyrm Taint and Derangements" placeholder="Mutations, derangements, Wyrm taint effects..." />
          </fieldset>
          <fieldset>
            <legend>Rage, Gnosis &amp; Willpower</legend>
            <div className="field-row">
              <DotRating label={t('rage')} name="rage" value={fields.rage} onChange={handleField} min={0} max={10} />
              <DotRating label={t('currentRage')} name="currentRage" value={fields.currentRage} onChange={handleField} min={0} max={10} />
            </div>
            <div className="field-row">
              <DotRating label={t('gnosis')} name="gnosis" value={fields.gnosis} onChange={handleField} min={0} max={10} />
              <DotRating label={t('currentGnosis')} name="currentGnosis" value={fields.currentGnosis} onChange={handleField} min={0} max={10} />
            </div>
            <div className="field-row">
              <DotRating label={t('willpower')} name="willpower" value={fields.willpower} onChange={handleField} min={1} max={10} />
              <DotRating label={t('currentWillpower')} name="currentWillpower" value={fields.currentWillpower} onChange={handleField} min={0} max={10} />
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
              <DotRating label={t('bashing')} name="woundBashing" value={fields.woundBashing ?? 0} onChange={handleField} min={0} max={7} />
              <DotRating label={t('lethal')} name="woundLethal" value={fields.woundLethal ?? 0} onChange={handleField} min={0} max={7} />
              <DotRating label={t('aggravated')} name="woundAgg" value={fields.woundAgg ?? 0} onChange={handleField} min={0} max={7} />
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
        <DicePoolsTab fields={fields} splat="BSD" characterId={characterId} />
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
