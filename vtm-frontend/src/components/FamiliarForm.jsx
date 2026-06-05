import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getCharacter, updateCharacter, getXpLog, addXpLogEntry, removeXpLogEntry, getDisciplines, addDiscipline, removeDiscipline } from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import DotRating from './DotRating'
import XpLogSection from './XpLogSection'
import { useLanguage } from '../i18n/LanguageContext'
import ExportModal from './ExportModal'
import { FAMILIAR_POWERS } from '../data/familiarPowers'
import { WOD_FAMILIAR_NPCS, WOD_FAMILIAR_NPC_CATALOG } from '../data/wodNpcs'
import CatalogSelect from './CatalogSelect'
import TagInfoPanel from './TagInfoPanel'
import DicePoolsTab from './DicePoolsTab'
import StorytellerDiceRoller from './StorytellerDiceRoller'
import SaveButton from './SaveButton'

const FAMILIAR_POWERS_CATALOG = [
  { name: 'Human Speech', description: 'The familiar can speak human languages' },
  { name: 'Spirit Speech', description: 'Can communicate with spirits in the Umbra' },
  { name: 'Unnatural Intelligence', description: 'Possesses human-level reasoning and problem-solving' },
  { name: 'Extra Heads', description: 'Has additional heads, each capable of independent action' },
  { name: 'Size Increase', description: 'Larger than normal for its species' },
  { name: 'Armor', description: 'Has supernatural resistance to damage (+1 soak per level)' },
  { name: 'Claws/Fangs', description: 'Enhanced natural weapons' },
  { name: 'Wings/Flight', description: 'Can fly, either naturally or supernaturally' },
  { name: 'Poison', description: 'Natural venomous attack' },
  { name: 'Camouflage', description: 'Can blend into surroundings, becoming nearly invisible' },
  { name: 'Healing Lick', description: 'Saliva heals minor wounds' },
  { name: 'Immunity to Disease', description: 'Cannot be affected by mundane or supernatural disease' },
  { name: 'Spirit Sight', description: 'Can see spirits and other invisible supernatural entities' },
  { name: 'Quintessence Pool', description: 'Stores Quintessence for its master (1 per level)' },
  { name: 'Paradox Nullification', description: 'Can absorb 1 point of Paradox per story' },
]

const INITIAL = {
  npc: true, splat: 'FAMILIAR',
  name: '', altName: '', concept: '',
  // Attributes
  strength: 1, dexterity: 1, stamina: 1,
  charisma: 1, manipulation: 1, appearance: 1,
  perception: 1, intelligence: 1, wits: 1,
  // Key Abilities
  alertness: 0, athletics: 0, awareness: 0, brawl: 0, empathy: 0,
  stealth: 0, survival: 0, intimidation: 0, subterfuge: 0,
  // Familiar-specific
  willpower: 3, currentWillpower: 3,
  quintessence: 0, paradox: 0,
  // Health
  woundBashing: 0, woundLethal: 0, woundAgg: 0,
  notes: '', backstory: '',
}

const TAB_KEYS = ['tabIdentity', 'tabAttributes', 'tabAbilities', 'tabPowers', 'tabHealth', 'tabBackstory', 'tabXpLog', 'tabDicePools', 'tabDiceRoller']

export default function FamiliarForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const viewMode = searchParams.get('mode') === 'view'
  const characterId = paramId || null

  const { isAutoCreating } = useAutoCreate(characterId, INITIAL)

  const [tab, setTab] = useState(0)
  const [fields, setFields] = useState(INITIAL)
  const [powers, setPowers] = useState([])
  const [newPower, setNewPower] = useState({ name: '', level: 1, notes: '' })
  const [tagInfo, setTagInfo] = useState(null)
  const [xpLog, setXpLog] = useState([])
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [actionError, setActionError] = useState(null)

  useEffect(() => {
    if (characterId) loadCharacter()
  }, [characterId])

  async function loadCharacter() {
    try {
      const [charRes, xpRes, powRes] = await Promise.all([getCharacter(characterId), getXpLog(characterId), getDisciplines(characterId)])
      const data = charRes.data
      setFields(prev => {
        const merged = { ...prev }
        for (const key in prev) { if (data[key] !== undefined && data[key] !== null) merged[key] = data[key] }
        return merged
      })
      setXpLog(xpRes.data)
      setPowers(powRes.data)
    } catch { setSaveError(t('failedToLoad')) }
    finally { setLoading(false) }
  }

  function handleField(name, value) { setFields(prev => ({ ...prev, [name]: typeof value === 'string' ? value : Number(value) })) }
  function handleText(e) { setFields(prev => ({ ...prev, [e.target.name]: e.target.value })) }

  function loadTemplate(templateName) {
    const tmpl = WOD_FAMILIAR_NPCS.find(t => t.name === templateName)
    if (!tmpl) return
    setFields(prev => ({
      ...prev,
      name: tmpl.name,
      concept: tmpl.concept,
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
      notes: tmpl.notes || '',
    }))
  }

  async function handleSave() {
    setSaving(true); setSaveError(null)
    try { await updateCharacter(characterId, fields) }
    catch(e) { setSaveError(t('failedToSave')); throw e }
    finally { setSaving(false) }
  }

  async function handleDoneEditing() { await handleSave(); navigate('/characters') }

  async function handleAddPower() {
    if (!newPower.name.trim()) return
    try {
      const res = await addDiscipline(characterId, newPower)
      setPowers(prev => [...prev, res.data])
      setNewPower({ name: '', level: 1, notes: '' })
    } catch { setActionError(t('failedToSave')) }
  }

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/characters')}>{t('back')}</button>
        <h2>{fields.name || t('editFamiliar')}</h2>
        <span className="splat-badge splat-badge--mage">{t('familiar')}</span>
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}
      {actionError && <p className="status-error" role="alert">{actionError}</p>}

      <div className="tab-list" role="tablist">
        {TAB_KEYS.map((tk, i) => (
          <button key={tk} role="tab" id={`tab-${i}`} className={`btn btn-secondary${tab === i ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(i)} aria-selected={tab === i} aria-controls={`tabpanel-${i}`}>{t(tk)}</button>
        ))}
      </div>

      {/* ── Identity ── */}
      <div role="tabpanel" id="tabpanel-0" aria-labelledby="tab-0" hidden={tab !== 0}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tabIdentity')}</legend>
            {!viewMode && (
              <div className="field-row">
                <CatalogSelect id="familiar-template" name="familiarTemplate" label={t('dndLoadTemplate')}
                  value="" onChange={(_, v) => loadTemplate(v)} catalog={WOD_FAMILIAR_NPC_CATALOG} showDescOnSelect={false} />
              </div>
            )}
            <div className="field-row">
              <div className="field"><label>{t('charName')} *</label><input name="name" value={fields.name} onChange={handleText} /></div>
              <div className="field"><label>{t('familiarType')}</label><input name="altName" value={fields.altName} onChange={handleText} placeholder={t('familiarTypePh')} /></div>
            </div>
            <div className="field-row">
              <div className="field"><label>{t('concept')}</label><input name="concept" value={fields.concept} onChange={handleText} placeholder={t('familiarConceptPh')} /></div>
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Attributes ── */}
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

      {/* ── Abilities ── */}
      <div role="tabpanel" id="tabpanel-2" aria-labelledby="tab-2" hidden={tab !== 2}>
        <div className="form-section">
          <fieldset>
            <legend>{t('familiarAbilities')}</legend>
            <div className="rating-grid">
              {['alertness', 'athletics', 'awareness', 'brawl', 'empathy', 'intimidation', 'stealth', 'subterfuge', 'survival'].map(a =>
                <div key={a} className="ability-row"><DotRating label={t(a)} name={a} value={fields[a]} onChange={handleField} /></div>
              )}
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Powers ── */}
      <div role="tabpanel" id="tabpanel-3" aria-labelledby="tab-3" hidden={tab !== 3}>
        <div className="form-section">
          <fieldset>
            <legend>{t('familiarPowers')}</legend>
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
              <DotRating label={t('quintessence')} name="quintessence" value={fields.quintessence} onChange={handleField} min={0} max={20} />
            </div>
            <p className="muted-hint muted-hint--xs mt-sm">{t('familiarPowerHint')}</p>
            {fields.quintessence === 0 && (
              <p className="status-warning mt-xs text-sm" role="status" aria-live="polite">
                No Quintessence stored. The familiar cannot provide magical energy to its master.
              </p>
            )}
          </fieldset>
          <fieldset>
            <legend>{t('familiarPowersList')}</legend>
            {powers.length > 0 && (
              <ul className="tag-list">
                {powers.map(p => (
                  <li key={p.id} className={`tag tag--clickable${p.id === tagInfo?.id ? ' tag--active' : ''}`}
                    onClick={() => setTagInfo(ti => ti?.id === p.id ? null : { ...p, kind: 'power' })}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTagInfo(ti => ti?.id === p.id ? null : { ...p, kind: 'power' }); } }}
                    role="button" tabIndex={0}>
                    <span>{p.name}</span>
                    <button className="tag-remove" onClick={e => { e.stopPropagation(); removeDiscipline(characterId, p.id); setPowers(prev => prev.filter(x => x.id !== p.id)); if (tagInfo?.id === p.id) setTagInfo(null) }}>x</button>
                  </li>
                ))}
              </ul>
            )}
            <div className="field-row items-end">
              <div className="field" style={{ flex: 2 }}>
                <label>{t('familiarPowerName')}</label>
                <input type="text" list="familiar-power-catalog" value={newPower.name} onChange={e => setNewPower(p => ({ ...p, name: e.target.value }))} placeholder={t('familiarPowerNamePh')} autoComplete="off" />
                <datalist id="familiar-power-catalog">
                  {FAMILIAR_POWERS.map(p => <option key={p.name} value={p.name} />)}
                </datalist>
              </div>
              <button className="btn btn-secondary" onClick={handleAddPower}>{t('add')}</button>
            </div>
          </fieldset>
          {tagInfo?.kind === 'power' && (() => {
            const entry = FAMILIAR_POWERS.find(fp => fp.name.toLowerCase() === tagInfo.name.toLowerCase())
            return <TagInfoPanel entry={entry || { name: tagInfo.name }} onClose={() => setTagInfo(null)} />
          })()}
          <fieldset>
            <legend>{t('familiarQuickPowers')}</legend>
            <p className="muted-hint muted-hint--xs mb-sm">{t('familiarQuickPowersHint')}</p>
            <div className="rating-grid">
              {FAMILIAR_POWERS_CATALOG.map(power => {
                const selectedPowerNames = (fields.notes || '').split('||')[0]?.split(',').map(s => s.trim()).filter(Boolean) || []
                const isChecked = selectedPowerNames.includes(power.name)
                return (
                  <label key={power.name} className="ability-row cursor-pointer gap-xs">
                    <input type="checkbox" checked={isChecked} onChange={() => {
                      const next = isChecked ? selectedPowerNames.filter(n => n !== power.name) : [...selectedPowerNames, power.name]
                      const customNotes = (fields.notes || '').split('||')[1]?.trim() || ''
                      const powersPart = next.join(', ')
                      setFields(prev => ({ ...prev, notes: customNotes ? `${powersPart}||${customNotes}` : powersPart }))
                    }} />
                    <span><strong>{power.name}</strong> — {power.description}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('notes')}</legend>
            <textarea value={(fields.notes || '').split('||')[1]?.trim() || ''} onChange={e => {
              const selectedPowerNames = (fields.notes || '').split('||')[0]?.split(',').map(s => s.trim()).filter(Boolean) || []
              const powersPart = selectedPowerNames.join(', ')
              const custom = e.target.value
              setFields(prev => ({ ...prev, notes: custom ? `${powersPart}||${custom}` : powersPart }))
            }} rows={4} className="w-full" placeholder={t('familiarPowerNotesPh')} />
          </fieldset>
        </div>
      </div>

      {/* ── Health ── */}
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
                Incapacitated. The familiar is out of action{fields.woundAgg >= 7 ? ' and may be destroyed.' : '.'}
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

      {/* ── Backstory ── */}
      <div role="tabpanel" id="tabpanel-5" aria-labelledby="tab-5" hidden={tab !== 5}>
        <div className="form-section">
          <fieldset><legend>{t('backstoryLabel')}</legend><textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} className="w-full" /></fieldset>
        </div>
      </div>

      {/* ── XP Log ── */}
      <div role="tabpanel" id="tabpanel-6" aria-labelledby="tab-6" hidden={tab !== 6}>
        <XpLogSection splat="mage" xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)} t={t} />
      </div>

      {/* ── Dice Pools ── */}
      <div role="tabpanel" id="tabpanel-7" aria-labelledby="tab-7" hidden={tab !== 7}>
        <DicePoolsTab fields={fields} splat="FAMILIAR" characterId={characterId} />
      </div>

      {/* ── Dice Roller ── */}
      <div role="tabpanel" id="tabpanel-8" aria-labelledby="tab-8" hidden={tab !== 8}>
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
