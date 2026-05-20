import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  getCharacter, updateCharacter,
  getXpLog, addXpLogEntry, removeXpLogEntry,
} from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import CatalogSelect from './CatalogSelect'
import XpLogSection from './XpLogSection'
import BladesDiceRoller from './BladesDiceRoller'
import RulesReferenceTab from './RulesReferenceTab'
import { useLanguage } from '../i18n/LanguageContext'
import ExportModal from './ExportModal'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import {
  BLADES_HERITAGES, BLADES_BACKGROUNDS, BLADES_VICES,
  BLADES_PLAYBOOKS, BLADES_PLAYBOOK_CATALOG, BLADES_TRAUMA_CONDITIONS, BLADES_STANDARD_ITEMS,
} from '../data/bladesPlaybooks'

const ALL_TAB_KEYS = ['tabIdentity', 'tabBladesActions', 'tabBladesAbilities', 'tabBladesStressHarm', 'tabBladesLoadout', 'tabBladesProjects', 'tabBladesCoinStash', 'tabBladesContacts', 'tabBladesDicePools', 'tabBackstory', 'tabXpLog', 'tabDiceRoller']
const ST_ONLY_TABS = new Set()

function getBladesRules(t) {
  return [
    { title: t('bladesRulesActionRolls'), sections: [
      { heading: t('bladesRulesPool'), text: t('bladesRulesPoolDesc') },
      { heading: t('bladesRulesZero'), text: t('bladesRulesZeroDesc') },
      { heading: t('bladesRulesFull'), text: t('bladesRulesFullDesc') },
      { heading: t('bladesRulesPartial'), text: t('bladesRulesPartialDesc') },
      { heading: t('bladesRulesBad'), text: t('bladesRulesBadDesc') },
      { heading: t('bladesRulesCrit'), text: t('bladesRulesCritDesc') },
    ]},
    { title: t('bladesRulesPositionEffect'), sections: [
      { heading: t('bladesRulesControlled'), text: t('bladesRulesControlledDesc') },
      { heading: t('bladesRulesRisky'), text: t('bladesRulesRiskyDesc') },
      { heading: t('bladesRulesDesperate'), text: t('bladesRulesDesperateDesc') },
      { heading: t('bladesRulesGreatEffect'), text: t('bladesRulesGreatEffectDesc') },
      { heading: t('bladesRulesStdEffect'), text: t('bladesRulesStdEffectDesc') },
      { heading: t('bladesRulesLtdEffect'), text: t('bladesRulesLtdEffectDesc') },
      { heading: t('bladesRulesZeroEffect'), text: t('bladesRulesZeroEffectDesc') },
    ]},
    { title: t('bladesRulesResistance'), sections: [
      { heading: t('bladesRulesHowToRoll'), text: t('bladesRulesHowToRollDesc') },
      { heading: t('bladesRulesStressCost'), text: t('bladesRulesStressCostDesc') },
      { heading: t('bladesRulesResCrit'), text: t('bladesRulesResCritDesc') },
    ]},
    { title: t('bladesRulesFortune'), sections: [
      { heading: t('bladesRulesWhenToUse'), text: t('bladesRulesWhenToUseDesc') },
      { heading: t('bladesRulesFortuneResults'), text: t('bladesRulesFortuneResultsDesc') },
    ]},
    { title: t('bladesRulesEngagement'), sections: [
      { heading: t('bladesRulesEngWhen'), text: t('bladesRulesEngWhenDesc') },
      { heading: t('bladesRulesEngAdv'), text: t('bladesRulesEngAdvDesc') },
      { heading: t('bladesRulesEngDis'), text: t('bladesRulesEngDisDesc') },
      { heading: t('bladesRulesEngResult'), text: t('bladesRulesEngResultDesc') },
    ]},
    { title: t('bladesRulesDowntime'), sections: [
      { heading: t('bladesRulesAcquire'), text: t('bladesRulesAcquireDesc') },
      { heading: t('bladesRulesLongterm'), text: t('bladesRulesLongtermDesc') },
      { heading: t('bladesRulesRecover'), text: t('bladesRulesRecoverDesc') },
      { heading: t('bladesRulesReduceHeat'), text: t('bladesRulesReduceHeatDesc') },
      { heading: t('bladesRulesTrain'), text: t('bladesRulesTrainDesc') },
      { heading: t('bladesRulesIndulge'), text: t('bladesRulesIndulgeDesc') },
    ]},
    { title: t('bladesRulesFlashbacks'), sections: [
      { heading: t('bladesRulesFB0'), text: t('bladesRulesFB0Desc') },
      { heading: t('bladesRulesFB1'), text: t('bladesRulesFB1Desc') },
      { heading: t('bladesRulesFB2'), text: t('bladesRulesFB2Desc') },
    ]},
    { title: t('bladesRulesXP'), sections: [
      { heading: t('bladesRulesPlaybookXP'), text: t('bladesRulesPlaybookXPDesc') },
      { heading: t('bladesRulesAttrXP'), text: t('bladesRulesAttrXPDesc') },
      { heading: t('bladesRulesSpendPB'), text: t('bladesRulesSpendPBDesc') },
      { heading: t('bladesRulesSpendAttr'), text: t('bladesRulesSpendAttrDesc') },
      { heading: t('bladesRulesTraining'), text: t('bladesRulesTrainingDesc') },
      { heading: t('bladesRulesCrewXP'), text: t('bladesRulesCrewXPDesc') },
      { heading: t('bladesRulesCoinStash'), text: t('bladesRulesCoinStashDesc') },
    ]},
  ]
}

const INITIAL = {
  splat: 'BLADES',
  name: '', bladesAlias: '', concept: '', appearanceDesc: '', sire: '',
  bladesHeritage: '', bladesBackground: '', bladesVice: '', bladesVicePurveyor: '',
  bladesPlaybook: '',
  // Actions - Insight
  bladesHunt: 0, bladesStudy: 0, bladesSurvey: 0, bladesTinker: 0,
  // Actions - Prowess
  bladesFinesse: 0, bladesProwl: 0, bladesSkirmish: 0, bladesWreck: 0,
  // Actions - Resolve
  bladesAttune: 0, bladesCommand: 0, bladesConsort: 0, bladesSway: 0,
  // Stress & Trauma
  bladesStress: 0, bladesTrauma: '',
  // Harm
  bladesHarm3: '', bladesHarm2a: '', bladesHarm2b: '', bladesHarm1a: '', bladesHarm1b: '',
  bladesHealingClock: 0,
  // Armor
  bladesArmor: false, bladesHeavyArmor: false, bladesSpecialArmor: false,
  // Load & Items
  bladesLoad: 0, bladesItems: '', bladesAbilities: '',
  // XP
  bladesInsightXp: 0, bladesProwessXp: 0, bladesResolveXp: 0, bladesPlaybookXp: 0,
  // Contacts
  bladesContacts: '',
  // Deep Cuts: Economy
  bladesStash: 0, bladesLifestyle: 0, bladesDebt: 0, bladesEdge: 0,
  // Shared
  notes: '', backstory: '',
  // Clocks (stored as JSON in havens field)
  havens: '',
}


const INSIGHT_ACTIONS = [
  { key: 'bladesHunt', labelKey: 'bladesHunt' },
  { key: 'bladesStudy', labelKey: 'bladesStudy' },
  { key: 'bladesSurvey', labelKey: 'bladesSurvey' },
  { key: 'bladesTinker', labelKey: 'bladesTinker' },
]
const PROWESS_ACTIONS = [
  { key: 'bladesFinesse', labelKey: 'bladesFinesse' },
  { key: 'bladesProwl', labelKey: 'bladesProwl' },
  { key: 'bladesSkirmish', labelKey: 'bladesSkirmish' },
  { key: 'bladesWreck', labelKey: 'bladesWreck' },
]
const RESOLVE_ACTIONS = [
  { key: 'bladesAttune', labelKey: 'bladesAttune' },
  { key: 'bladesCommand', labelKey: 'bladesCommand' },
  { key: 'bladesConsort', labelKey: 'bladesConsort' },
  { key: 'bladesSway', labelKey: 'bladesSway' },
]

const LOAD_OPTIONS = [
  { labelKey: 'bladesLoadLight', value: 3 },
  { labelKey: 'bladesLoadNormal', value: 5 },
  { labelKey: 'bladesLoadHeavy', value: 6 },
  { labelKey: 'bladesLoadEncumbered', value: 9 },
]

/* ── Small dot-rating for 0-4 action dots ── */
function BladesDots({ value, max = 4, onChange, label }) {
  return (
    <span className="blades-dots" role="group" aria-label={label || 'Rating'}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`blades-dot${i < value ? ' blades-dot--filled' : ''}`}
          onClick={() => onChange(value === i + 1 ? i : i + 1)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(value === i + 1 ? i : i + 1) } }}
          role="button"
          tabIndex={0}
          aria-label={`Set to ${i + 1}`}
          aria-pressed={i < value}
        />
      ))}
    </span>
  )
}

function XpPips({ value, max, onChange, label }) {
  return (
    <span className="blades-dots" role="group" aria-label={label || 'XP'}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`blades-pip${i < value ? ' blades-pip--filled' : ''}`}
          onClick={() => onChange(value === i + 1 ? i : i + 1)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(value === i + 1 ? i : i + 1) } }}
          role="button"
          tabIndex={0}
          aria-label={`${i + 1} of ${max}`}
          aria-pressed={i < value}
        />
      ))}
    </span>
  )
}

export default function BladesForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const { isST } = useAuth()
  const [searchParams] = useSearchParams()
  const viewMode = searchParams.get('mode') === 'view'
  const characterId = paramId || null

  useEffect(() => { switchTheme('blades') }, [])

  const { isAutoCreating } = useAutoCreate(characterId, INITIAL)

  const [tab, setTab] = useState('tabIdentity')
  const tabKeys = ALL_TAB_KEYS.filter(tk => !ST_ONLY_TABS.has(tk) || isST)
  const [fields, setFields] = useState(INITIAL)
  const [xpLog, setXpLog] = useState([])
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [deepCuts, setDeepCuts] = useState(() => localStorage.getItem('blades-deep-cuts') !== 'false')
  function toggleDeepCuts() {
    const next = !deepCuts
    setDeepCuts(next)
    localStorage.setItem('blades-deep-cuts', String(next))
  }

  // Long-term project clocks (stored in havens field as JSON)
  const clocks = (() => { try { return JSON.parse(fields.havens) || [] } catch { return [] } })()
  function setClocks(next) { handleField('havens', JSON.stringify(next)) }
  const [newClockName, setNewClockName] = useState('')
  const [newClockSegments, setNewClockSegments] = useState(4)

  const filteredPlaybookCatalog = deepCuts ? BLADES_PLAYBOOK_CATALOG : BLADES_PLAYBOOK_CATALOG.filter(p => !BLADES_PLAYBOOKS[p.value]?.supernatural)
  const filteredStandardItems = deepCuts ? BLADES_STANDARD_ITEMS : BLADES_STANDARD_ITEMS.filter(i => !i.deepCuts)

  useEffect(() => {
    if (characterId) loadCharacter()
  }, [characterId])

  async function loadCharacter() {
    try {
      const [charRes, xpRes] = await Promise.all([
        getCharacter(characterId),
        getXpLog(characterId),
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
  function handleCheck(name) { setFields(prev => ({ ...prev, [name]: !prev[name] })) }

  async function handleSave() {
    setSaving(true); setSaveError(null)
    try { await updateCharacter(characterId, fields) }
    catch { setSaveError(t('failedToSave')) }
    finally { setSaving(false) }
  }

  async function handleDoneEditing() { await handleSave(); navigate('/blades') }

  // ── Derived data ──
  const selectedPlaybook = fields.bladesPlaybook ? BLADES_PLAYBOOKS[fields.bladesPlaybook] : null
  const selectedAbilities = fields.bladesAbilities ? fields.bladesAbilities.split(',').map(s => s.trim()).filter(Boolean) : []
  const selectedItems = fields.bladesItems ? fields.bladesItems.split(',').map(s => s.trim()).filter(Boolean) : []
  const selectedTrauma = fields.bladesTrauma ? fields.bladesTrauma.split(',').map(s => s.trim()).filter(Boolean) : []

  function toggleAbility(name) {
    const next = selectedAbilities.includes(name)
      ? selectedAbilities.filter(a => a !== name)
      : [...selectedAbilities, name]
    handleField('bladesAbilities', next.join(', '))
  }

  function toggleItem(name) {
    const next = selectedItems.includes(name)
      ? selectedItems.filter(i => i !== name)
      : [...selectedItems, name]
    handleField('bladesItems', next.join(', '))
  }

  function toggleTrauma(name) {
    const next = selectedTrauma.includes(name)
      ? selectedTrauma.filter(t => t !== name)
      : [...selectedTrauma, name]
    handleField('bladesTrauma', next.join(', '))
  }

  // Contact parsing: "Name:+", "Name:-", or "Name:"
  function parseContacts() {
    if (!fields.bladesContacts) return []
    return fields.bladesContacts.split(',').map(s => s.trim()).filter(Boolean).map(entry => {
      const [name, rel] = entry.split(':')
      return { name: name?.trim() || '', rel: rel?.trim() || '' }
    })
  }

  const contacts = parseContacts()

  function setContactRel(contactName, rel) {
    const all = parseContacts()
    const existing = all.find(c => c.name === contactName)
    if (existing) {
      existing.rel = existing.rel === rel ? '' : rel
    } else {
      all.push({ name: contactName, rel })
    }
    handleField('bladesContacts', all.map(c => `${c.name}:${c.rel}`).join(', '))
  }

  function getContactRel(contactName) {
    const c = contacts.find(c => c.name === contactName)
    return c ? c.rel : ''
  }

  // Load calculation
  const currentLoad = selectedItems.reduce((sum, itemName) => {
    const std = BLADES_STANDARD_ITEMS.find(i => i.name === itemName)
    if (std) return sum + (std.load || 1)
    if (selectedPlaybook) {
      const pbItem = selectedPlaybook.items?.find(i => i.name === itemName)
      if (pbItem) return sum + (pbItem.load || 1)
    }
    return sum + 1
  }, 0)

  // Action column renderer
  function ActionColumn({ title, actions, xpKey, xpMax = 6 }) {
    return (
      <div className="blades-action-column">
        <h4 className="mb-sm text-accent">{title}</h4>
        {actions.map(a => (
          <div key={a.key} className="blades-action-row">
            <span className="blades-action-label">{t(a.labelKey)}</span>
            <BladesDots value={fields[a.key]} onChange={v => handleField(a.key, v)} />
          </div>
        ))}
        <div className="blades-xp-row mt-sm">
          <span className="blades-action-label" style={{ fontSize: '0.8rem' }}>{title} XP</span>
          <XpPips value={fields[xpKey]} max={xpMax} onChange={v => handleField(xpKey, v)} />
        </div>
      </div>
    )
  }

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/blades')}>{t('back')}</button>
        <h2>{fields.name || t('bladesCharacter')}</h2>
        <span className="splat-badge">{t('splatBlades')}</span>
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}
      {actionError && <p className="status-error" role="alert">{actionError}</p>}

      <div className="flex items-center gap-sm mb-sm">
        <label className="flex items-center cursor-pointer" style={{ gap: '0.4rem', fontSize: '0.82rem' }}>
          <input type="checkbox" checked={deepCuts} onChange={toggleDeepCuts} />
          <strong>{t('bladesDeepCuts')}</strong>
          <span className="muted-hint muted-hint--xs">{t('bladesDeepCutsHint')}</span>
        </label>
      </div>

      <div className="tab-list" role="tablist">
        {tabKeys.map(tk => (
          <button key={tk} id={tk} role="tab" className={`btn btn-secondary${tab === tk ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(tk)} aria-selected={tab === tk}>{t(tk)}</button>
        ))}
      </div>

      {/* ── Identity ── */}
      <div hidden={tab !== 'tabIdentity'} role="tabpanel" aria-labelledby="tabIdentity">
        <div className="form-section">
          <fieldset>
            <legend>{t('tabIdentity')}</legend>
            <div className="field-row">
              <div className="field"><label>{t('charName')} *</label><input name="name" value={fields.name} onChange={handleText} /></div>
              <div className="field"><label>{t('bladesAlias')}</label><input name="bladesAlias" value={fields.bladesAlias} onChange={handleText} /></div>
            </div>
            <div className="field">
              <label>{t('appearanceLabel')}</label>
              <textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={3} className="w-full" aria-label={t('appearanceLabel')} />
            </div>
            <div className="field-row">
              <CatalogSelect id="bladesHeritage" name="bladesHeritage" label={t('bladesHeritage')} value={fields.bladesHeritage}
                onChange={handleField} catalog={BLADES_HERITAGES} />
            </div>
            {fields.bladesHeritage && (
              <div className="field">
                <label>{t('bladesHeritage')} — {t('details')}</label>
                <input name="concept" value={fields.concept} onChange={handleText}
                  placeholder={t('bladesHeritageDetailsPh')} aria-label={t('bladesHeritageDetails')} />
              </div>
            )}
            <div className="field-row">
              <CatalogSelect id="bladesBackground" name="bladesBackground" label={t('bladesBackground')} value={fields.bladesBackground}
                onChange={handleField} catalog={BLADES_BACKGROUNDS} />
            </div>
            <div className="field-row">
              <CatalogSelect id="bladesVice" name="bladesVice" label={t('bladesVice')} value={fields.bladesVice}
                onChange={handleField} catalog={BLADES_VICES} />
            </div>
            {fields.bladesVice && (
              <div className="field-row">
                <div className="field"><label>{t('bladesVicePurveyor')}</label><input name="bladesVicePurveyor" value={fields.bladesVicePurveyor} onChange={handleText} placeholder={t('bladesVicePurveyorPh')} /></div>
                <div className="field"><label>{t('bladesVice')} — {t('details')}</label><input name="sire" value={fields.sire || ''} onChange={handleText} placeholder={t('bladesViceDetailsPh')} aria-label={t('bladesViceDetails')} /></div>
              </div>
            )}
            <div className="field-row">
              <CatalogSelect id="bladesPlaybook" name="bladesPlaybook" label={t('bladesPlaybook')} value={fields.bladesPlaybook}
                onChange={handleField}
                catalog={filteredPlaybookCatalog} />
            </div>
            {selectedPlaybook && (
              <div className="form-section p-md mt-sm" style={{ background: 'rgba(52,152,219,0.08)', borderLeft: '3px solid var(--color-accent-fg)' }}>
                <div className="text-lg font-bold mb-xs">{t(fields.bladesPlaybook)}</div>
                {selectedPlaybook.supernatural && <span className="splat-badge splat-badge--blades mb-xs" style={{ fontSize: '0.75rem', display: 'inline-block' }}>{t('bladesDeepCutsSupernatural')}</span>}
                {selectedPlaybook.description && <p className="text-base lh-normal mb-xs">{selectedPlaybook.description}</p>}
                {selectedPlaybook.xpTrigger && <p className="muted-hint muted-hint--xs"><strong>{t('bladesXpTrigger')}:</strong> {t(selectedPlaybook.xpTriggerKey) || selectedPlaybook.xpTrigger}</p>}
              </div>
            )}
          </fieldset>
        </div>
      </div>

      {/* ── Actions ── */}
      <div hidden={tab !== 'tabBladesActions'} role="tabpanel" aria-labelledby="tabBladesActions">
        <div className="form-section">
          <fieldset>
            <legend>{t('bladesActionRatings')}</legend>
            <p className="muted-hint muted-hint--xs mb-md">
              {t('bladesActionRatingsHint')}
            </p>
            <div className="blades-actions-grid">
              <ActionColumn title={t('bladesInsight')} actions={INSIGHT_ACTIONS} xpKey="bladesInsightXp" />
              <ActionColumn title={t('bladesProwess')} actions={PROWESS_ACTIONS} xpKey="bladesProwessXp" />
              <ActionColumn title={t('bladesResolve')} actions={RESOLVE_ACTIONS} xpKey="bladesResolveXp" />
            </div>
          </fieldset>

          {/* XP Trigger Reminder */}
          {selectedPlaybook?.xpTrigger && (
            <div className="mb-md rounded" style={{ padding: 'var(--space-sm) var(--space-md)', background: 'rgba(243,156,18,0.08)', border: '1px solid rgba(243,156,18,0.25)', fontSize: '0.82rem' }}>
              <strong style={{ color: '#f39c12' }}>{t('bladesXpTrigger')}:</strong>{' '}
              <span className="text-muted">{selectedPlaybook.xpTrigger}</span>
            </div>
          )}

          <fieldset>
            <legend>{t('bladesPlaybookXp')}</legend>
            <div className="blades-xp-row">
              <span className="blades-action-label">{t('bladesPlaybookXp')}</span>
              <XpPips value={fields.bladesPlaybookXp} max={8} onChange={v => handleField('bladesPlaybookXp', v)} />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Abilities ── */}
      <div hidden={tab !== 'tabBladesAbilities'} role="tabpanel" aria-labelledby="tabBladesAbilities">
        <div className="form-section">
          <fieldset>
            <legend>{t('bladesSpecialAbilities')}{selectedPlaybook ? ` - ${fields.bladesPlaybook}` : ''}</legend>
            {!selectedPlaybook && (
              <p className="muted-hint">{t('bladesSelectPlaybookHint')}</p>
            )}
            {selectedPlaybook?.abilities?.map(ability => (
              <label key={ability.name} className="blades-ability-row flex gap-sm items-start py-xs">
                <input type="checkbox" checked={selectedAbilities.includes(ability.name)}
                  onChange={() => toggleAbility(ability.name)} />
                <div>
                  <strong>{ability.nameKey ? t(ability.nameKey) : ability.name}</strong>
                  {ability.description && <span className="muted-hint muted-hint--xs" style={{ display: 'block' }}>{ability.descKey ? t(ability.descKey) : ability.description}</span>}
                </div>
              </label>
            ))}
            <hr className="opacity-30" style={{ margin: 'var(--space-md) 0' }} />
            <details>
              <summary className="cursor-pointer font-semibold text-md text-accent">{t('bladesVeteranAbilities')}</summary>
              <p className="muted-hint muted-hint--xs mb-sm">
                {t('bladesVeteranAbilitiesHint')}
              </p>
              {Object.entries(BLADES_PLAYBOOKS).filter(([name]) => name !== fields.bladesPlaybook).map(([name, pb]) => (
                <details key={name} className="mb-xs">
                  <summary className="cursor-pointer text-base text-muted">{t(name)}</summary>
                  {pb.abilities?.map(ability => (
                    <label key={ability.name} className="flex gap-sm items-start" style={{ padding: 'var(--space-xs) 0 var(--space-xs) var(--space-md)' }}>
                      <input type="checkbox" checked={selectedAbilities.includes(ability.name)}
                        onChange={() => toggleAbility(ability.name)} />
                      <div>
                        <strong className="text-base">{ability.nameKey ? t(ability.nameKey) : ability.name}</strong>
                        {ability.description && <span className="muted-hint muted-hint--xs" style={{ display: 'block' }}>{ability.descKey ? t(ability.descKey) : ability.description}</span>}
                      </div>
                    </label>
                  ))}
                </details>
              ))}
            </details>
          </fieldset>
        </div>
      </div>

      {/* ── Stress & Harm ── */}
      <div hidden={tab !== 'tabBladesStressHarm'} role="tabpanel" aria-labelledby="tabBladesStressHarm">
        <div className="form-section">
          <fieldset>
            <legend>{t('bladesStress')}</legend>
            <p className="muted-hint muted-hint--xs mb-sm">
              {t('bladesStressHint')}
            </p>
            <div className="blades-stress-track">
              {Array.from({ length: 9 }, (_, i) => (
                <span
                  key={i}
                  className={`blades-stress-box${i < fields.bladesStress ? ' blades-stress-box--filled' : ''}`}
                  onClick={() => handleField('bladesStress', fields.bladesStress === i + 1 ? i : i + 1)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleField('bladesStress', fields.bladesStress === i + 1 ? i : i + 1) } }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Stress ${i + 1}`}
                  aria-pressed={i < fields.bladesStress}
                />
              ))}
              <span className="ml-sm text-base font-semibold">{fields.bladesStress}/9</span>
            </div>
            {fields.bladesStress >= 9 && (
              <div role="alert" aria-live="assertive" className="mt-sm p-sm font-bold text-center" style={{ background: 'rgba(231,76,60,0.2)', border: '2px solid #e74c3c', borderRadius: '6px', color: '#e74c3c' }}>
                {t('bladesTraumaAlert')}
              </div>
            )}
            {fields.bladesStress >= 8 && fields.bladesStress < 9 && (
              <div role="alert" aria-live="polite" className="mt-sm p-sm font-semibold" style={{ background: 'rgba(243,156,18,0.15)', border: '2px solid #f39c12', borderRadius: '6px', color: '#f39c12' }}>
                {t('bladesStressWarning')}
              </div>
            )}
          </fieldset>
          <fieldset>
            <legend>{t('bladesTrauma')}</legend>
            <p className="muted-hint muted-hint--xs mb-sm">
              {t('bladesTraumaHint')}
              {selectedTrauma.length >= 4 && <span role="alert" className="text-danger font-semibold"> {t('bladesTraumaWarning')}</span>}
            </p>
            <div className="flex flex-wrap gap-sm">
              {BLADES_TRAUMA_CONDITIONS.map(tc => (
                <label key={tc} className="inline-label">
                  <input type="checkbox" checked={selectedTrauma.includes(tc)} onChange={() => toggleTrauma(tc)} />
                  {t(`bladesTrauma${tc}`)}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('bladesHarm')}</legend>
            <div className="blades-harm-track">
              <div className="blades-harm-row blades-harm-row--fatal">
                <div className="blades-harm-level">
                  <span className="blades-harm-num">3</span>
                  <span className="blades-harm-label">{t('bladesHarmLevel3')}</span>
                </div>
                <div className="blades-harm-slots">
                  <input name="bladesHarm3" value={fields.bladesHarm3} onChange={handleText} placeholder={t('bladesHarm3Ph')} className="blades-harm-input" />
                </div>
              </div>
              <div className="blades-harm-row blades-harm-row--severe">
                <div className="blades-harm-level">
                  <span className="blades-harm-num">2</span>
                  <span className="blades-harm-label">{t('bladesHarmLevel2')}</span>
                </div>
                <div className="blades-harm-slots">
                  <input name="bladesHarm2a" value={fields.bladesHarm2a} onChange={handleText} placeholder={t('bladesHarm2Ph')} className="blades-harm-input" />
                  <input name="bladesHarm2b" value={fields.bladesHarm2b} onChange={handleText} placeholder={t('bladesHarm2Ph')} className="blades-harm-input" />
                </div>
              </div>
              <div className="blades-harm-row blades-harm-row--lesser">
                <div className="blades-harm-level">
                  <span className="blades-harm-num">1</span>
                  <span className="blades-harm-label">{t('bladesHarmLevel1')}</span>
                </div>
                <div className="blades-harm-slots">
                  <input name="bladesHarm1a" value={fields.bladesHarm1a} onChange={handleText} placeholder={t('bladesHarm1Ph')} className="blades-harm-input" />
                  <input name="bladesHarm1b" value={fields.bladesHarm1b} onChange={handleText} placeholder={t('bladesHarm1Ph')} className="blades-harm-input" />
                </div>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('bladesHealingClock')}</legend>
            <div className="blades-xp-row">
              <span className="blades-action-label">{t('bladesHealing')}</span>
              <XpPips value={fields.bladesHealingClock} max={4} onChange={v => handleField('bladesHealingClock', v)} />
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('bladesArmorLabel')}</legend>
            <div className="flex gap-md">
              <label className="inline-label">
                <input type="checkbox" checked={!!fields.bladesArmor} onChange={() => handleCheck('bladesArmor')} /> {t('bladesArmorLabel')}
              </label>
              <label className="inline-label">
                <input type="checkbox" checked={!!fields.bladesHeavyArmor} onChange={() => handleCheck('bladesHeavyArmor')} /> {t('bladesHeavyArmorLabel')}
              </label>
              <label className="inline-label">
                <input type="checkbox" checked={!!fields.bladesSpecialArmor} onChange={() => handleCheck('bladesSpecialArmor')} /> {t('bladesSpecialArmorLabel')}
              </label>
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Loadout ── */}
      <div hidden={tab !== 'tabBladesLoadout'} role="tabpanel" aria-labelledby="tabBladesLoadout">
        <div className="form-section">
          <fieldset>
            <legend>{t('bladesLoad')}</legend>
            <div className="flex gap-md items-center mb-sm">
              {LOAD_OPTIONS.map(opt => (
                <label key={opt.value} className="inline-label">
                  <input type="radio" name="bladesLoad" checked={fields.bladesLoad === opt.value}
                    onChange={() => handleField('bladesLoad', opt.value)} />
                  {t(opt.labelKey)} ({opt.value})
                </label>
              ))}
            </div>
            <div role="status" aria-live="polite" className="mt-sm p-sm border" style={{ borderRadius: '6px', background: 'rgba(52,152,219,0.05)' }}>
              <div className="text-md font-semibold">
                {t('bladesCurrentLoad')}: <strong>{currentLoad}</strong> / {fields.bladesLoad || '?'}
                {fields.bladesLoad > 0 && (
                  <span className="ml-sm" style={{ color: currentLoad > fields.bladesLoad ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>
                    ({fields.bladesLoad - currentLoad >= 0 ? `${fields.bladesLoad - currentLoad} ${t('bladesSlotsRemaining')}` : `${currentLoad - fields.bladesLoad} ${t('bladesOverCapacity')}`})
                  </span>
                )}
              </div>
              {fields.bladesLoad > 0 && currentLoad > fields.bladesLoad && (
                <div className="text-danger font-semibold text-base" style={{ marginTop: '4px' }}>{t('bladesOverEncumbered')}</div>
              )}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('bladesStandardItems')}</legend>
            <div className="flex-col gap-xs">
              {filteredStandardItems.map(item => (
                <label key={item.name} className="flex items-center gap-sm text-base">
                  <input type="checkbox" checked={selectedItems.includes(item.name)} onChange={() => toggleItem(item.name)} />
                  <span><strong>{item.nameKey ? t(item.nameKey) : item.name}</strong> ({item.load || 1} {t('bladesLoadUnit')}){item.descKey ? ` - ${t(item.descKey)}` : item.description ? ` - ${item.description}` : ''}</span>
                </label>
              ))}
            </div>
          </fieldset>
          {selectedPlaybook?.items?.length > 0 && (
            <fieldset>
              <legend>{t(fields.bladesPlaybook)} {t('bladesItemsSuffix')}</legend>
              <div className="flex-col gap-xs">
                {selectedPlaybook?.items?.map(item => (
                  <label key={item.name} className="flex items-center gap-sm text-base">
                    <input type="checkbox" checked={selectedItems.includes(item.name)} onChange={() => toggleItem(item.name)} />
                    <span><strong>{item.nameKey ? t(item.nameKey) : item.name}</strong> ({item.load || 1} {t('bladesLoadUnit')}){item.descKey ? ` - ${t(item.descKey)}` : item.description ? ` - ${item.description}` : ''}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}
        </div>
      </div>

      {/* ── Projects ── */}
      <div hidden={tab !== 'tabBladesProjects'} role="tabpanel" aria-labelledby="tabBladesProjects">
        <div className="form-section">
          <fieldset>
            <legend>{t('tabBladesProjects')}</legend>
            <p className="muted-hint muted-hint--xs mb-sm">
              {t('bladesProjectsHint')}
            </p>
            <div className="field-row mb-md items-end">
              <div className="field flex-1">
                <label htmlFor="new-clock-name">{t('bladesClockName')}</label>
                <input id="new-clock-name" type="text" value={newClockName} onChange={e => setNewClockName(e.target.value)}
                  placeholder={t('bladesClockNamePh')}
                  onKeyDown={e => { if (e.key === 'Enter' && newClockName.trim()) { e.preventDefault(); setClocks([...clocks, { name: newClockName.trim(), total: newClockSegments, filled: 0 }]); setNewClockName('') } }} />
              </div>
              <div className="field">
                <label htmlFor="new-clock-segs">{t('bladesSegments')}</label>
                <select id="new-clock-segs" value={newClockSegments} onChange={e => setNewClockSegments(Number(e.target.value))}>
                  <option value={4}>4</option>
                  <option value={6}>6</option>
                  <option value={8}>8</option>
                </select>
              </div>
              <button className="btn btn-secondary" onClick={() => {
                if (!newClockName.trim()) return
                setClocks([...clocks, { name: newClockName.trim(), total: newClockSegments, filled: 0 }])
                setNewClockName('')
              }}>{t('bladesAddClock')}</button>
            </div>
            {clocks.length === 0 && <p className="muted-hint">{t('bladesNoClocksYet')}</p>}
            <div role="list" aria-live="polite" className="flex-col gap-md">
              {clocks.map((clock, ci) => (
                <div key={ci} role="listitem" className="p-sm border" style={{ borderRadius: '8px', background: 'rgba(52,152,219,0.04)' }}>
                  <div className="flex justify-between items-center mb-xs">
                    <span className="font-bold text-md">{clock.name}</span>
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>{clock.filled}/{clock.total}</span>
                  </div>
                  {/* Pie-chart style clock */}
                  <div className="flex items-center gap-md">
                    <svg width="64" height="64" viewBox="0 0 64 64" role="img" aria-label={`${clock.name}: ${clock.filled} of ${clock.total} segments filled`}>
                      <circle cx="32" cy="32" r="30" fill="none" stroke="var(--color-border)" strokeWidth="2" />
                      {Array.from({ length: clock.total }, (_, si) => {
                        const angle = (360 / clock.total)
                        const startAngle = (si * angle - 90) * (Math.PI / 180)
                        const endAngle = ((si + 1) * angle - 90) * (Math.PI / 180)
                        const x1 = 32 + 28 * Math.cos(startAngle)
                        const y1 = 32 + 28 * Math.sin(startAngle)
                        const x2 = 32 + 28 * Math.cos(endAngle)
                        const y2 = 32 + 28 * Math.sin(endAngle)
                        const largeArc = angle > 180 ? 1 : 0
                        const d = `M32,32 L${x1},${y1} A28,28 0 ${largeArc},1 ${x2},${y2} Z`
                        return (
                          <path key={si} d={d}
                            fill={si < clock.filled ? 'var(--color-accent-fg)' : 'transparent'}
                            stroke="var(--color-border)" strokeWidth="1"
                            style={{ cursor: 'pointer', opacity: si < clock.filled ? 0.85 : 0.3 }}
                            onClick={() => {
                              const next = [...clocks]
                              next[ci] = { ...clock, filled: clock.filled === si + 1 ? si : Math.min(si + 1, clock.total) }
                              setClocks(next)
                            }}
                            role="button"
                            tabIndex={0}
                            aria-label={`Segment ${si + 1}${si < clock.filled ? ' (filled)' : ''}`}
                            onKeyDown={e => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                const next = [...clocks]
                                next[ci] = { ...clock, filled: clock.filled === si + 1 ? si : Math.min(si + 1, clock.total) }
                                setClocks(next)
                              }
                            }}
                          />
                        )
                      })}
                    </svg>
                    <div className="flex-1">
                      {clock.filled >= clock.total && (
                        <div role="alert" aria-live="assertive" className="font-bold text-md" style={{ color: '#2ecc71' }}>
                          {t('bladesClockComplete')}
                        </div>
                      )}
                    </div>
                    <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                      onClick={() => setClocks(clocks.filter((_, j) => j !== ci))} aria-label={`${t('remove')} ${clock.name}`}>{t('remove')}</button>
                  </div>
                </div>
              ))}
            </div>
          </fieldset>

          {/* ── Downtime Activity Helpers ── */}
          <details className="mt-sm">
            <summary className="cursor-pointer font-semibold text-md text-accent">
              {t('bladesDowntimeHelpers')}
            </summary>
            <div className="grid-auto mt-sm" style={{ gap: 'var(--space-sm)' }}>
              {[
                { key: 'acquire', labelKey: 'bladesRulesAcquire', descKey: 'bladesRulesAcquireDesc' },
                { key: 'longterm', labelKey: 'bladesRulesLongterm', descKey: 'bladesRulesLongtermDesc' },
                { key: 'recover', labelKey: 'bladesRulesRecover', descKey: 'bladesRulesRecoverDesc' },
                { key: 'reduceHeat', labelKey: 'bladesRulesReduceHeat', descKey: 'bladesRulesReduceHeatDesc' },
                { key: 'train', labelKey: 'bladesRulesTrain', descKey: 'bladesRulesTrainDesc' },
                { key: 'indulge', labelKey: 'bladesRulesIndulge', descKey: 'bladesRulesIndulgeDesc' },
              ].map(act => (
                <div key={act.key} className="p-sm border rounded bg-surface">
                  <div className="font-semibold text-base" style={{ marginBottom: '0.2rem' }}>{t(act.labelKey)}</div>
                  <div className="text-muted lh-snug" style={{ fontSize: '0.75rem' }}>{t(act.descKey)}</div>
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>

      {/* ── Coin & Stash ── */}
      <div hidden={tab !== 'tabBladesCoinStash'} role="tabpanel" aria-labelledby="tabBladesCoinStash">
        <div className="form-section">
          <fieldset>
            <legend>{t('bladesCoinStash')}</legend>
            <p className="muted-hint muted-hint--xs mb-sm">
              {t('bladesCoinStashHint')}
            </p>
            <div className="field-row items-end">
              <div className="field" style={{ width: 100 }}>
                <label>{t('bladesCoin')} (0-4)</label>
                <div className="flex" style={{ gap: '4px' }}>
                  {[1, 2, 3, 4].map(i => (
                    <span key={i} role="button" tabIndex={0}
                      className={`blades-stress-box${i <= (fields.bladesCoin || 0) ? ' blades-stress-box--filled' : ''}`}
                      className="flex items-center justify-center cursor-pointer font-bold"
                      style={{ width: 28, height: 28, borderRadius: '4px', border: '2px solid var(--color-border)', fontSize: '0.75rem' }}
                      onClick={() => handleField('bladesCoin', (fields.bladesCoin || 0) === i ? i - 1 : i)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleField('bladesCoin', (fields.bladesCoin || 0) === i ? i - 1 : i) } }}
                      aria-label={`Coin ${i}`} aria-pressed={i <= (fields.bladesCoin || 0)}>
                      {i <= (fields.bladesCoin || 0) ? '\u25CF' : ''}
                    </span>
                  ))}
                </div>
              </div>
              <div className="field flex-1">
                <label>{t('bladesStash')} ({fields.bladesStash || 0}/40)</label>
                <div className="flex flex-wrap" style={{ gap: '2px' }}>
                  {Array.from({ length: 40 }, (_, i) => (
                    <span key={i} role="button" tabIndex={0}
                      style={{
                        width: 14, height: 14, borderRadius: '2px', cursor: 'pointer',
                        background: i < (fields.bladesStash || 0) ? 'var(--color-accent-fg)' : 'var(--color-surface-raised)',
                        border: '1px solid var(--color-border)',
                        opacity: i < (fields.bladesStash || 0) ? 1 : 0.5,
                      }}
                      onClick={() => handleField('bladesStash', (fields.bladesStash || 0) === i + 1 ? i : i + 1)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleField('bladesStash', (fields.bladesStash || 0) === i + 1 ? i : i + 1) } }}
                      aria-label={`Stash ${i + 1} of 40`} aria-pressed={i < (fields.bladesStash || 0)} />
                  ))}
                </div>
                {(fields.bladesStash || 0) >= 40 && (
                  <p className="text-accent font-bold mt-xs" style={{ fontSize: '0.82rem' }}>
                    {t('bladesStashRetire')}
                  </p>
                )}
              </div>
            </div>
          </fieldset>
          {deepCuts && (
            <fieldset>
              <legend>{t('bladesEconomy')}</legend>
              <div className="field-row">
                <div className="field" style={{ width: 80 }}>
                  <label>{t('bladesLifestyle')}</label>
                  <input type="number" min={0} value={fields.bladesLifestyle || 0} onChange={e => handleField('bladesLifestyle', parseInt(e.target.value) || 0)} />
                </div>
                <div className="field" style={{ width: 80 }}>
                  <label>{t('bladesDebt')}</label>
                  <input type="number" min={0} value={fields.bladesDebt || 0} onChange={e => handleField('bladesDebt', parseInt(e.target.value) || 0)} />
                </div>
                <div className="field" style={{ width: 80 }}>
                  <label>{t('bladesEdge')}</label>
                  <input type="number" min={0} value={fields.bladesEdge || 0} onChange={e => handleField('bladesEdge', parseInt(e.target.value) || 0)} />
                </div>
              </div>
            </fieldset>
          )}
        </div>
      </div>

      {/* ── Contacts ── */}
      <div hidden={tab !== 'tabBladesContacts'} role="tabpanel" aria-labelledby="tabBladesContacts">
        <div className="form-section">
          {selectedPlaybook?.contacts?.length > 0 && (
            <fieldset>
              <legend>{t('tabBladesContacts')}{selectedPlaybook ? ` — ${fields.bladesPlaybook}` : ''}</legend>
              {selectedPlaybook.contacts.map((contact, idx) => {
                const rel = getContactRel(contact)
                const contactLabel = selectedPlaybook.contactKeys?.[idx] ? t(selectedPlaybook.contactKeys[idx]) : contact
                return (
                  <div key={contact} className="flex items-center gap-sm py-xs text-md">
                    <button type="button" className={`btn btn-secondary${rel === '+' ? ' tab-btn--active' : ''}`}
                      style={{ minWidth: '32px', padding: '2px 8px', fontSize: '0.85rem' }}
                      onClick={() => setContactRel(contact, '+')} title={t('bladesFriendly')}
                      aria-label={`${contactLabel} - friend`} aria-pressed={rel === '+'}>+</button>
                    <button type="button" className={`btn btn-secondary${rel === '-' ? ' tab-btn--active' : ''}`}
                      style={{ minWidth: '32px', padding: '2px 8px', fontSize: '0.85rem' }}
                      onClick={() => setContactRel(contact, '-')} title={t('bladesRival')}
                      aria-label={`${contactLabel} - rival`} aria-pressed={rel === '-'}>-</button>
                    <span className="font-semibold">{contactLabel}</span>
                  </div>
                )
              })}
            </fieldset>
          )}
          <fieldset>
            <legend>{t('bladesCustomContacts')}</legend>
            <p className="muted-hint muted-hint--xs mb-sm">
              {t('bladesCustomContactsHint')}
            </p>
            <div className="field-row mb-sm">
              <div className="field" style={{ flex: 2 }}>
                <input id="new-contact-name" type="text" placeholder={t('bladesContactPh')}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      const name = e.target.value.trim()
                      setContactRel(name, '+')
                      e.target.value = ''
                    }
                  }}
                  aria-label="New contact name" />
              </div>
              <button type="button" className="btn btn-secondary" onClick={() => {
                const input = document.getElementById('new-contact-name')
                if (input?.value.trim()) {
                  setContactRel(input.value.trim(), '+')
                  input.value = ''
                }
              }}>{t('add')}</button>
            </div>
            {contacts.filter(c => !selectedPlaybook?.contacts?.includes(c.name)).map(c => (
              <div key={c.name} className="flex items-center gap-sm py-xs text-md">
                <button type="button" className={`btn btn-secondary${c.rel === '+' ? ' tab-btn--active' : ''}`}
                  style={{ minWidth: '32px', padding: '2px 8px', fontSize: '0.85rem' }}
                  onClick={() => setContactRel(c.name, '+')} title={t('bladesFriendly')}
                  aria-label={`${c.name} - friend`} aria-pressed={c.rel === '+'}>+</button>
                <button type="button" className={`btn btn-secondary${c.rel === '-' ? ' tab-btn--active' : ''}`}
                  style={{ minWidth: '32px', padding: '2px 8px', fontSize: '0.85rem' }}
                  onClick={() => setContactRel(c.name, '-')} title={t('bladesRival')}
                  aria-label={`${c.name} - rival`} aria-pressed={c.rel === '-'}>-</button>
                <span className="font-semibold">{c.name}</span>
                <button type="button" className="btn btn-danger" style={{ padding: '2px 6px', fontSize: '0.75rem', marginLeft: 'auto' }}
                  onClick={() => {
                    const updated = contacts.filter(x => x.name !== c.name)
                    handleField('bladesContacts', updated.map(x => `${x.name}:${x.rel}`).join(', '))
                  }} aria-label={`Remove ${c.name}`}>✕</button>
              </div>
            ))}
          </fieldset>
        </div>
      </div>

      {/* ── Dice Pools Reference ── */}
      <div hidden={tab !== 'tabBladesDicePools'} role="tabpanel" aria-labelledby="tabBladesDicePools">
        <RulesReferenceTab rules={getBladesRules(t)} title={t('tabBladesDicePools')} />
      </div>

      {/* ── Backstory ── */}
      <div hidden={tab !== 'tabBackstory'} role="tabpanel" aria-labelledby="tabBackstory">
        <div className="form-section">
          <fieldset><legend>{t('backstoryLabel')}</legend><textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} className="w-full" aria-label={t('backstoryLabel')} /></fieldset>
          <fieldset><legend>{t('notes')}</legend><textarea name="notes" value={fields.notes} onChange={handleText} rows={4} className="w-full" aria-label={t('notes')} /></fieldset>
        </div>
      </div>

      {/* ── XP Log ── */}
      <div hidden={tab !== 'tabXpLog'} role="tabpanel" aria-labelledby="tabXpLog">
        <XpLogSection splat="blades" xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)} t={t} />
      </div>

      {/* ── Dice Roller ── */}
      <div hidden={tab !== 'tabDiceRoller'} role="tabpanel" aria-labelledby="tabDiceRoller">
        <details className="mb-md p-sm border" style={{ borderRadius: '8px', background: 'rgba(243,156,18,0.06)' }}>
          <summary className="cursor-pointer font-bold text-md" style={{ color: '#f39c12' }}>
            {t('bladesDevilsBargain')}
          </summary>
          <div role="note" aria-live="polite" className="text-base lh-normal text-muted py-sm">
            {t('bladesDevilsBargainDesc')}
          </div>
        </details>
        <BladesDiceRoller />
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => setShowExport(true)}>{t('exportPdf')}</button>
        <button className="btn btn-secondary" onClick={() => navigate('/blades')}>{t('cancel')}</button>
        <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>{saving ? t('saving') : t('quickSave')}</button>
        <button className="btn btn-primary" onClick={handleDoneEditing} disabled={saving}>{t('doneEditing')}</button>
      </div>
      {viewMode && (
        <div className="view-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/blades')}>{t('back')}</button>
          <button className="btn btn-primary" onClick={() => navigate(`/characters/${characterId}`, { replace: true })}>{t('edit')}</button>
        </div>
      )}
      <ExportModal open={showExport} onClose={() => setShowExport(false)} tabKeys={tabKeys} t={t} />
    </div>
  )
}
