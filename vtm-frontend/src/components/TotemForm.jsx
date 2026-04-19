import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getCharacter, updateCharacter, getXpLog, addXpLogEntry, removeXpLogEntry, getDisciplines, addDiscipline, removeDiscipline } from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import DotRating from './DotRating'
import XpLogSection from './XpLogSection'
import { useLanguage } from '../i18n/LanguageContext'
import CatalogSelect from './CatalogSelect'
import { WOD_TOTEM_NPCS, WOD_TOTEM_NPC_CATALOG } from '../data/wodNpcs'
import { SPIRIT_CHARMS } from '../data/spiritCharms'
import TagInfoPanel from './TagInfoPanel'
import DicePoolsTab from './DicePoolsTab'
import StorytellerDiceRoller from './StorytellerDiceRoller'

const TOTEM_TYPES = [
  { value: 'Respect', description: 'Totems of honor, dignity, and noble bearing.' },
  { value: 'War', description: 'Totems of battle, strength, and ferocity.' },
  { value: 'Wisdom', description: 'Totems of knowledge, insight, and understanding.' },
  { value: 'Cunning', description: 'Totems of trickery, stealth, and cleverness.' },
]

const INITIAL = {
  npc: true, splat: 'TOTEM',
  name: '', altName: '', concept: '',
  // Spirit Attributes
  rage: 1, currentRage: 1,
  gnosis: 1, currentGnosis: 1,
  willpower: 3, currentWillpower: 3,
  // Essence (uses quintessence field)
  quintessence: 5,
  // Traits stored in text fields
  notes: '', backstory: '',
  // Pack totem cost (uses generation field as totem cost)
  generation: 5,
}

const TAB_KEYS = ['tabIdentity', 'tabTraits', 'tabCharms', 'tabBackstory', 'tabXpLog', 'tabDicePools', 'tabDiceRoller']

export default function TotemForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const viewMode = searchParams.get('mode') === 'view'
  const characterId = paramId || null

  const { isAutoCreating } = useAutoCreate(characterId, INITIAL)

  const [tab, setTab] = useState(0)
  const [fields, setFields] = useState(INITIAL)
  const [charms, setCharms] = useState([])
  const [newCharm, setNewCharm] = useState({ name: '', level: 1, notes: '' })
  const [tagInfo, setTagInfo] = useState(null)
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
      const [charRes, xpRes, charmRes] = await Promise.all([getCharacter(characterId), getXpLog(characterId), getDisciplines(characterId)])
      const data = charRes.data
      setFields(prev => {
        const merged = { ...prev }
        for (const key in prev) { if (data[key] !== undefined && data[key] !== null) merged[key] = data[key] }
        return merged
      })
      setXpLog(xpRes.data)
      setCharms(charmRes.data)
    } catch { setSaveError(t('failedToLoad')) }
    finally { setLoading(false) }
  }

  function handleField(name, value) { setFields(prev => ({ ...prev, [name]: typeof value === 'string' ? value : Number(value) })) }
  function handleText(e) { setFields(prev => ({ ...prev, [e.target.name]: e.target.value })) }

  function loadTemplate(templateName) {
    const tmpl = WOD_TOTEM_NPCS.find(t => t.name === templateName)
    if (!tmpl) return
    setFields(prev => ({
      ...prev,
      name: tmpl.name,
      concept: tmpl.concept,
      altName: tmpl.totemType || '',
      rage: tmpl.rage || 1,
      currentRage: tmpl.rage || 1,
      gnosis: tmpl.gnosis || 1,
      currentGnosis: tmpl.gnosis || 1,
      willpower: tmpl.willpower || 3,
      currentWillpower: tmpl.willpower || 3,
      quintessence: tmpl.essence || 5,
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

  async function handleAddCharm() {
    if (!newCharm.name.trim()) return
    try {
      const res = await addDiscipline(characterId, newCharm)
      setCharms(prev => [...prev, res.data])
      setNewCharm({ name: '', level: 1, notes: '' })
    } catch { setActionError(t('failedToSave')) }
  }

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/characters')}>{t('back')}</button>
        <h2>{fields.name || t('editTotem')}</h2>
        <span className="splat-badge splat-badge--werewolf">{t('totem')}</span>
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
              <CatalogSelect id="totem-template" name="totemTemplate" label={t('dndLoadTemplate')}
                value="" onChange={(_, v) => loadTemplate(v)} catalog={WOD_TOTEM_NPC_CATALOG} showDescOnSelect={false} />
            </div>
            <div className="field-row">
              <div className="field"><label>{t('totemName')} *</label><input name="name" value={fields.name} onChange={handleText} placeholder={t('totemNamePh')} /></div>
              <CatalogSelect id="altName" name="altName" label={t('totemType')} value={fields.altName} onChange={handleField} catalog={TOTEM_TYPES} />
            </div>
            <div className="field-row">
              <div className="field"><label>{t('concept')}</label><input name="concept" value={fields.concept} onChange={handleText} placeholder={t('totemConceptPh')} /></div>
              <div className="field">
                <label>{t('totemCost')}</label>
                <DotRating label="" name="generation" value={fields.generation} onChange={handleField} min={1} max={10} />
              </div>
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Traits ── */}
      <div hidden={tab !== 1}>
        <div className="form-section">
          <fieldset>
            <legend>{t('totemTraits')}</legend>
            <div className="rating-grid">
              <div className="ability-row">
                <DotRating label={t('rage')} name="rage" value={fields.rage} onChange={handleField} min={0} max={10} />
                <DotRating label={t('currentRage')} name="currentRage" value={fields.currentRage} onChange={handleField} min={0} max={10} />
              </div>
              <div className="ability-row">
                <DotRating label={t('gnosis')} name="gnosis" value={fields.gnosis} onChange={handleField} min={0} max={10} />
                <DotRating label={t('currentGnosis')} name="currentGnosis" value={fields.currentGnosis} onChange={handleField} min={0} max={10} />
              </div>
              <div className="ability-row">
                <DotRating label={t('willpower')} name="willpower" value={fields.willpower} onChange={handleField} min={0} max={10} />
                <DotRating label={t('currentWillpower')} name="currentWillpower" value={fields.currentWillpower} onChange={handleField} min={0} max={10} />
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('totemEssence')}</legend>
            <DotRating label={t('totemEssence')} name="quintessence" value={fields.quintessence} onChange={handleField} min={0} max={50} />
            <p className="muted-hint muted-hint--xs" style={{ marginTop: 'var(--space-xs)' }}>{t('totemEssenceHint')}</p>
          </fieldset>
          <fieldset>
            <legend>{t('totemBan')}</legend>
            <textarea name="backstory" value={fields.backstory} onChange={handleText} rows={3} style={{ width: '100%' }} placeholder={t('totemBanPh')} />
          </fieldset>
          <fieldset>
            <legend>{t('totemPackBenefits')}</legend>
            <textarea name="concept" value={fields.concept} onChange={handleText} rows={4} style={{ width: '100%' }} placeholder={t('totemBenefitsPh')} />
          </fieldset>
        </div>
      </div>

      {/* ── Charms ── */}
      <div hidden={tab !== 2}>
        <div className="form-section">
          <fieldset>
            <legend>{t('totemCharms')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>{t('totemCharmsHint')}</p>
            {charms.length > 0 && (
              <ul className="tag-list">
                {charms.map(c => (
                  <li key={c.id} className={`tag tag--clickable${c.id === tagInfo?.id ? ' tag--active' : ''}`}
                    onClick={() => setTagInfo(ti => ti?.id === c.id ? null : { ...c, kind: 'charm' })}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTagInfo(ti => ti?.id === c.id ? null : { ...c, kind: 'charm' }); } }}
                    role="button" tabIndex={0}>
                    <span>{c.name}</span>
                    <button className="tag-remove" onClick={e => { e.stopPropagation(); removeDiscipline(characterId, c.id); setCharms(prev => prev.filter(x => x.id !== c.id)); if (tagInfo?.id === c.id) setTagInfo(null) }}>x</button>
                  </li>
                ))}
              </ul>
            )}
            <div className="field-row" style={{ alignItems: 'flex-end' }}>
              <div className="field" style={{ flex: 2 }}>
                <label>{t('totemCharmName')}</label>
                <input type="text" list="spirit-charm-catalog" value={newCharm.name} onChange={e => setNewCharm(p => ({ ...p, name: e.target.value }))} placeholder={t('totemCharmNamePh')} autoComplete="off" />
                <datalist id="spirit-charm-catalog">
                  {SPIRIT_CHARMS.map(c => <option key={c.name} value={c.name} />)}
                </datalist>
              </div>
              <button className="btn btn-secondary" onClick={handleAddCharm}>{t('add')}</button>
            </div>
          </fieldset>
          {tagInfo?.kind === 'charm' && (() => {
            const entry = SPIRIT_CHARMS.find(sc => sc.name.toLowerCase() === tagInfo.name.toLowerCase())
            return <TagInfoPanel entry={entry || { name: tagInfo.name }} onClose={() => setTagInfo(null)} />
          })()}
          <fieldset>
            <legend>{t('notes')}</legend>
            <textarea name="notes" value={fields.notes} onChange={handleText} rows={4} style={{ width: '100%' }} placeholder={t('totemCharmsPh')} />
          </fieldset>
        </div>
      </div>

      {/* ── Backstory ── */}
      <div hidden={tab !== 3}>
        <div className="form-section">
          <fieldset>
            <legend>{t('totemDescription')}</legend>
            <textarea name="appearanceDesc" value={fields.appearanceDesc ?? ''} onChange={handleText} rows={8} style={{ width: '100%' }} placeholder={t('totemDescPh')} />
          </fieldset>
        </div>
      </div>

      {/* ── XP Log ── */}
      <div hidden={tab !== 4}>
        <XpLogSection splat="werewolf" xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)} t={t} />
      </div>

      {/* ── Dice Pools ── */}
      <div hidden={tab !== 5}>
        <DicePoolsTab fields={fields} splat="TOTEM" characterId={characterId} />
      </div>

      {/* ── Dice Roller ── */}
      <div hidden={tab !== 6}>
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
