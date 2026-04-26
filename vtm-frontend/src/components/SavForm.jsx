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
  SAV_HERITAGES, SAV_BACKGROUNDS, SAV_VICES,
  SAV_PLAYBOOKS, SAV_PLAYBOOK_CATALOG, SAV_TRAUMA_CONDITIONS, SAV_STANDARD_ITEMS,
} from '../data/savPlaybooks'

// S&V reuses blades* entity fields but with different action names
const BLADES_HERITAGES = SAV_HERITAGES
const BLADES_BACKGROUNDS = SAV_BACKGROUNDS
const BLADES_VICES = SAV_VICES
const BLADES_PLAYBOOKS = SAV_PLAYBOOKS
const BLADES_PLAYBOOK_CATALOG = SAV_PLAYBOOK_CATALOG
const BLADES_TRAUMA_CONDITIONS = SAV_TRAUMA_CONDITIONS
const BLADES_STANDARD_ITEMS = SAV_STANDARD_ITEMS

const ALL_TAB_KEYS = ['tabIdentity', 'tabSavActions', 'tabBladesAbilities', 'tabBladesStressHarm', 'tabBladesLoadout', 'tabBladesProjects', 'tabSavCredStash', 'tabBladesContacts', 'tabBladesDicePools', 'tabBackstory', 'tabXpLog', 'tabDiceRoller']
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
  splat: 'SAV',
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


// S&V action mapping: reuses blades* entity fields with different labels
const INSIGHT_ACTIONS = [
  { key: 'bladesHunt', labelKey: 'savDoctor' },
  { key: 'bladesStudy', labelKey: 'savHack' },
  { key: 'bladesSurvey', labelKey: 'savRig' },
  { key: 'bladesTinker', labelKey: 'savStudy' },
]
const PROWESS_ACTIONS = [
  { key: 'bladesFinesse', labelKey: 'savHelm' },
  { key: 'bladesProwl', labelKey: 'savScramble' },
  { key: 'bladesSkirmish', labelKey: 'savScrap' },
  { key: 'bladesWreck', labelKey: 'savSkulk' },
]
const RESOLVE_ACTIONS = [
  { key: 'bladesAttune', labelKey: 'savAttune' },
  { key: 'bladesCommand', labelKey: 'savCommand' },
  { key: 'bladesConsort', labelKey: 'savConsort' },
  { key: 'bladesSway', labelKey: 'savSway' },
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

export default function SavForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const { isST } = useAuth()
  const [searchParams] = useSearchParams()
  const viewMode = searchParams.get('mode') === 'view'
  const characterId = paramId || null

  useEffect(() => { switchTheme('sav') }, [])

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
  const [gambits, setGambits] = useState(2)
  const [deepCuts, setDeepCuts] = useState(() => localStorage.getItem('sav-deep-cuts') !== 'false')
  function toggleDeepCuts() {
    const next = !deepCuts
    setDeepCuts(next)
    localStorage.setItem('sav-deep-cuts', String(next))
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

  async function handleDoneEditing() { await handleSave(); navigate('/sav') }

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
        <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-accent-fg)' }}>{title}</h4>
        {actions.map(a => (
          <div key={a.key} className="blades-action-row">
            <span className="blades-action-label">{t(a.labelKey)}</span>
            <BladesDots value={fields[a.key]} onChange={v => handleField(a.key, v)} />
          </div>
        ))}
        <div className="blades-xp-row" style={{ marginTop: 'var(--space-sm)' }}>
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
        <button className="btn btn-secondary" onClick={() => navigate('/sav')}>{t('back')}</button>
        <h2>{fields.name || 'Blades Character'}</h2>
        <span className="splat-badge">Scum & Villainy</span>
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}
      {actionError && <p className="status-error" role="alert">{actionError}</p>}

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer' }}>
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
              <div className="field"><label>{fields.bladesPlaybook === 'Pilot' ? t('savCallSign') : t('bladesAlias')}</label><input name="bladesAlias" value={fields.bladesAlias} onChange={handleText} /></div>
            </div>
            <div className="field">
              <label>{t('appearanceLabel')}</label>
              <textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={3} style={{ width: '100%' }} aria-label={t('appearanceLabel')} />
            </div>
            <div className="field-row">
              <CatalogSelect id="bladesHeritage" name="bladesHeritage" label={t('bladesHeritage')} value={fields.bladesHeritage}
                onChange={handleField} catalog={BLADES_HERITAGES} />
            </div>
            {fields.bladesHeritage && (
              <div className="field">
                <label>{t('bladesHeritage')} — {t('details')}</label>
                <input name="concept" value={fields.concept} onChange={handleText}
                  placeholder="Family, homeland, cultural details..." aria-label="Heritage details" />
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
                <div className="field"><label>{t('bladesVicePurveyor')}</label><input name="bladesVicePurveyor" value={fields.bladesVicePurveyor} onChange={handleText} placeholder="Name, location..." /></div>
                <div className="field"><label>{t('bladesVice')} — {t('details')}</label><input name="sire" value={fields.sire || ''} onChange={handleText} placeholder="What does your vice look like?" aria-label="Vice details" /></div>
              </div>
            )}
            <div className="field-row">
              <CatalogSelect id="bladesPlaybook" name="bladesPlaybook" label={t('bladesPlaybook')} value={fields.bladesPlaybook}
                onChange={handleField}
                catalog={filteredPlaybookCatalog} />
            </div>
            {selectedPlaybook && (
              <div className="form-section" style={{ padding: 'var(--space-md)', marginTop: 'var(--space-sm)', background: 'rgba(52,152,219,0.08)', borderLeft: '3px solid var(--color-accent-fg)' }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-xs)' }}>{t(fields.bladesPlaybook)}</div>
                {selectedPlaybook.supernatural && <span className="splat-badge splat-badge--sav" style={{ fontSize: '0.75rem', marginBottom: 'var(--space-xs)', display: 'inline-block' }}>Deep Cuts — Supernatural</span>}
                {selectedPlaybook.description && <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 'var(--space-xs)' }}>{selectedPlaybook.description}</p>}
                {selectedPlaybook.xpTrigger && <p className="muted-hint muted-hint--xs"><strong>XP Trigger:</strong> {selectedPlaybook.xpTrigger}</p>}
              </div>
            )}
          </fieldset>
        </div>
      </div>

      {/* ── Actions ── */}
      <div hidden={tab !== 'tabSavActions'} role="tabpanel" aria-labelledby="tabBladesActions">
        <div className="form-section">
          {/* Gambit Pool */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)', padding: 'var(--space-md)', background: 'var(--color-surface)', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-accent-fg)' }}>{t('savGambits')}</span>
            <button type="button" className="btn btn-secondary" style={{ minWidth: 36, fontWeight: 700, padding: '0.2rem 0.5rem' }}
              onClick={() => setGambits(Math.max(0, gambits - 1))} disabled={gambits <= 0}>-</button>
            <span style={{ fontSize: '1.8rem', fontWeight: 700, minWidth: 40, textAlign: 'center' }}>{gambits}</span>
            <button type="button" className="btn btn-secondary" style={{ minWidth: 36, fontWeight: 700, padding: '0.2rem 0.5rem' }}
              onClick={() => setGambits(gambits + 1)}>+</button>
            <button type="button" className="dice-roller-clear" onClick={() => setGambits(2)}>{t('savGambitReset')}</button>
          </div>

          <fieldset>
            <legend>{t('bladesActionRatings')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-md)' }}>
              {t('bladesActionRatingsHint')}
            </p>
            <div className="blades-actions-grid">
              <ActionColumn title={t('savInsight')} actions={INSIGHT_ACTIONS} xpKey="bladesInsightXp" />
              <ActionColumn title={t('savProwess')} actions={PROWESS_ACTIONS} xpKey="bladesProwessXp" />
              <ActionColumn title={t('savResolve')} actions={RESOLVE_ACTIONS} xpKey="bladesResolveXp" />
            </div>
          </fieldset>

          {/* XP Trigger Reminder */}
          {selectedPlaybook?.xpTrigger && (
            <div style={{ padding: 'var(--space-sm) var(--space-md)', marginBottom: 'var(--space-md)', background: 'rgba(243,156,18,0.08)', border: '1px solid rgba(243,156,18,0.25)', borderRadius: 'var(--radius)', fontSize: '0.82rem' }}>
              <strong style={{ color: '#f39c12' }}>{t('bladesXpTrigger')}:</strong>{' '}
              <span style={{ color: 'var(--color-text-muted)' }}>{selectedPlaybook.xpTrigger}</span>
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
              <label key={ability.name} className="blades-ability-row" style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start', padding: 'var(--space-xs) 0' }}>
                <input type="checkbox" checked={selectedAbilities.includes(ability.name)}
                  onChange={() => toggleAbility(ability.name)} />
                <div>
                  <strong>{ability.name}</strong>
                  {ability.description && <span className="muted-hint muted-hint--xs" style={{ display: 'block' }}>{ability.description}</span>}
                </div>
              </label>
            ))}
            <hr style={{ margin: 'var(--space-md) 0', opacity: 0.3 }} />
            <details>
              <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>{t('bladesVeteranAbilities')}</summary>
              <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
                {t('bladesVeteranAbilitiesHint')}
              </p>
              {Object.entries(BLADES_PLAYBOOKS).filter(([name]) => name !== fields.bladesPlaybook).map(([name, pb]) => (
                <details key={name} style={{ marginBottom: 'var(--space-xs)' }}>
                  <summary style={{ cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{t(name)}</summary>
                  {pb.abilities?.map(ability => (
                    <label key={ability.name} style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start', padding: 'var(--space-xs) 0 var(--space-xs) var(--space-md)' }}>
                      <input type="checkbox" checked={selectedAbilities.includes(ability.name)}
                        onChange={() => toggleAbility(ability.name)} />
                      <div>
                        <strong style={{ fontSize: '0.85rem' }}>{ability.name}</strong>
                        {ability.description && <span className="muted-hint muted-hint--xs" style={{ display: 'block' }}>{ability.description}</span>}
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
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
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
              <span style={{ marginLeft: 'var(--space-sm)', fontSize: '0.85rem', fontWeight: 600 }}>{fields.bladesStress}/9</span>
            </div>
            {fields.bladesStress >= 9 && (
              <div role="alert" aria-live="assertive" style={{ marginTop: 'var(--space-sm)', padding: 'var(--space-sm)', background: 'rgba(231,76,60,0.2)', border: '2px solid #e74c3c', borderRadius: '6px', fontWeight: 700, color: '#e74c3c', textAlign: 'center' }}>
                {t('bladesTraumaAlert')}
              </div>
            )}
            {fields.bladesStress >= 8 && fields.bladesStress < 9 && (
              <div role="alert" aria-live="polite" style={{ marginTop: 'var(--space-sm)', padding: 'var(--space-sm)', background: 'rgba(243,156,18,0.15)', border: '2px solid #f39c12', borderRadius: '6px', fontWeight: 600, color: '#f39c12' }}>
                {t('bladesStressWarning')}
              </div>
            )}
          </fieldset>
          <fieldset>
            <legend>{t('bladesTrauma')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              {t('bladesTraumaHint')}
              {selectedTrauma.length >= 4 && <span role="alert" style={{ color: 'var(--color-danger)', fontWeight: 600 }}> {t('bladesTraumaWarning')}</span>}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
              {BLADES_TRAUMA_CONDITIONS.map(tc => (
                <label key={tc} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                  <input type="checkbox" checked={selectedTrauma.includes(tc)} onChange={() => toggleTrauma(tc)} />
                  {t(`bladesTrauma${tc}`)}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('bladesHarm')}</legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <div className="field-row">
                <span style={{ minWidth: '80px', fontWeight: 600, fontSize: '0.85rem' }}>{t('bladesHarmLevel3')}</span>
                <div className="field" style={{ flex: 1 }}><input name="bladesHarm3" value={fields.bladesHarm3} onChange={handleText} placeholder="Need fatal" /></div>
              </div>
              <div className="field-row">
                <span style={{ minWidth: '80px', fontWeight: 600, fontSize: '0.85rem' }}>{t('bladesHarmLevel2')}</span>
                <div className="field" style={{ flex: 1 }}><input name="bladesHarm2a" value={fields.bladesHarm2a} onChange={handleText} placeholder="-1d" /></div>
                <div className="field" style={{ flex: 1 }}><input name="bladesHarm2b" value={fields.bladesHarm2b} onChange={handleText} placeholder="-1d" /></div>
              </div>
              <div className="field-row">
                <span style={{ minWidth: '80px', fontWeight: 600, fontSize: '0.85rem' }}>{t('bladesHarmLevel1')}</span>
                <div className="field" style={{ flex: 1 }}><input name="bladesHarm1a" value={fields.bladesHarm1a} onChange={handleText} placeholder="Less effect" /></div>
                <div className="field" style={{ flex: 1 }}><input name="bladesHarm1b" value={fields.bladesHarm1b} onChange={handleText} placeholder="Less effect" /></div>
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
            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={!!fields.bladesArmor} onChange={() => handleCheck('bladesArmor')} /> {t('bladesArmorLabel')}
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={!!fields.bladesHeavyArmor} onChange={() => handleCheck('bladesHeavyArmor')} /> {t('bladesHeavyArmorLabel')}
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
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
            <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
              {LOAD_OPTIONS.map(opt => (
                <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                  <input type="radio" name="bladesLoad" checked={fields.bladesLoad === opt.value}
                    onChange={() => handleField('bladesLoad', opt.value)} />
                  {t(opt.labelKey)} ({opt.value})
                </label>
              ))}
            </div>
            <div role="status" aria-live="polite" style={{ marginTop: 'var(--space-sm)', padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: '6px', background: 'rgba(52,152,219,0.05)' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                {t('bladesCurrentLoad')}: <strong>{currentLoad}</strong> / {fields.bladesLoad || '?'}
                {fields.bladesLoad > 0 && (
                  <span style={{ marginLeft: 'var(--space-sm)', color: currentLoad > fields.bladesLoad ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>
                    ({fields.bladesLoad - currentLoad >= 0 ? `${fields.bladesLoad - currentLoad} slots remaining` : `${currentLoad - fields.bladesLoad} over capacity`})
                  </span>
                )}
              </div>
              {fields.bladesLoad > 0 && currentLoad > fields.bladesLoad && (
                <div style={{ color: 'var(--color-danger)', fontWeight: 600, fontSize: '0.85rem', marginTop: '4px' }}>{t('bladesOverEncumbered')}</div>
              )}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('bladesStandardItems')}</legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              {filteredStandardItems.map(item => (
                <label key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', fontSize: '0.85rem' }}>
                  <input type="checkbox" checked={selectedItems.includes(item.name)} onChange={() => toggleItem(item.name)} />
                  <span><strong>{item.name}</strong> ({item.load || 1} load){item.description ? ` - ${item.description}` : ''}</span>
                </label>
              ))}
            </div>
          </fieldset>
          {selectedPlaybook?.items?.length > 0 && (
            <fieldset>
              <legend>{fields.bladesPlaybook} {t('bladesItemsSuffix')}</legend>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                {selectedPlaybook?.items?.map(item => (
                  <label key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={selectedItems.includes(item.name)} onChange={() => toggleItem(item.name)} />
                    <span><strong>{item.name}</strong> ({item.load || 1} load){item.description ? ` - ${item.description}` : ''}</span>
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
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              {t('bladesProjectsHint')}
            </p>
            <div className="field-row" style={{ marginBottom: 'var(--space-md)', alignItems: 'flex-end' }}>
              <div className="field" style={{ flex: 1 }}>
                <label htmlFor="new-clock-name">{t('bladesClockName')}</label>
                <input id="new-clock-name" type="text" value={newClockName} onChange={e => setNewClockName(e.target.value)}
                  placeholder="e.g. Research arcane artifact..."
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
            <div role="list" aria-live="polite" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {clocks.map((clock, ci) => (
                <div key={ci} role="listitem" style={{ padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: '8px', background: 'rgba(52,152,219,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{clock.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{clock.filled}/{clock.total}</span>
                  </div>
                  {/* Pie-chart style clock */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
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
                    <div style={{ flex: 1 }}>
                      {clock.filled >= clock.total && (
                        <div role="alert" aria-live="assertive" style={{ fontWeight: 700, color: '#2ecc71', fontSize: '0.9rem' }}>
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
          <details style={{ marginTop: 'var(--space-sm)' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>
              {t('bladesDowntimeHelpers')}
            </summary>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
              {[
                { key: 'acquire', labelKey: 'bladesRulesAcquire', descKey: 'bladesRulesAcquireDesc' },
                { key: 'longterm', labelKey: 'bladesRulesLongterm', descKey: 'bladesRulesLongtermDesc' },
                { key: 'recover', labelKey: 'bladesRulesRecover', descKey: 'bladesRulesRecoverDesc' },
                { key: 'reduceHeat', labelKey: 'bladesRulesReduceHeat', descKey: 'bladesRulesReduceHeatDesc' },
                { key: 'train', labelKey: 'bladesRulesTrain', descKey: 'bladesRulesTrainDesc' },
                { key: 'indulge', labelKey: 'bladesRulesIndulge', descKey: 'bladesRulesIndulgeDesc' },
              ].map(act => (
                <div key={act.key} style={{ padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-surface)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.2rem' }}>{t(act.labelKey)}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{t(act.descKey)}</div>
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>

      {/* ── Cred & Stash ── */}
      <div hidden={tab !== 'tabSavCredStash'} role="tabpanel" aria-labelledby="tabSavCredStash">
        <div className="form-section">
          <fieldset>
            <legend>{t('savCredStash')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              {t('savCredStashHint')}
            </p>
            <div className="field-row" style={{ alignItems: 'flex-end' }}>
              <div className="field" style={{ width: 100 }}>
                <label>{t('savCred')} (0-4)</label>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4].map(i => (
                    <span key={i} role="button" tabIndex={0}
                      className={`blades-stress-box${i <= (fields.bladesCoin || 0) ? ' blades-stress-box--filled' : ''}`}
                      style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '4px', border: '2px solid var(--color-border)', fontSize: '0.75rem', fontWeight: 700 }}
                      onClick={() => handleField('bladesCoin', (fields.bladesCoin || 0) === i ? i - 1 : i)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleField('bladesCoin', (fields.bladesCoin || 0) === i ? i - 1 : i) } }}
                      aria-label={`Cred ${i}`} aria-pressed={i <= (fields.bladesCoin || 0)}>
                      {i <= (fields.bladesCoin || 0) ? '\u25CF' : ''}
                    </span>
                  ))}
                </div>
              </div>
              <div className="field" style={{ flex: 1 }}>
                <label>{t('bladesStash')} ({fields.bladesStash || 0}/40)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
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
                  <p style={{ color: 'var(--color-accent-fg)', fontWeight: 700, fontSize: '0.82rem', marginTop: 'var(--space-xs)' }}>
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
              {selectedPlaybook.contacts.map(contact => {
                const rel = getContactRel(contact)
                return (
                  <div key={contact} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: 'var(--space-xs) 0', fontSize: '0.9rem' }}>
                    <button type="button" className={`btn btn-secondary${rel === '+' ? ' tab-btn--active' : ''}`}
                      style={{ minWidth: '32px', padding: '2px 8px', fontSize: '0.85rem' }}
                      onClick={() => setContactRel(contact, '+')} title={t('bladesFriendly')}
                      aria-label={`${contact} - friend`} aria-pressed={rel === '+'}>+</button>
                    <button type="button" className={`btn btn-secondary${rel === '-' ? ' tab-btn--active' : ''}`}
                      style={{ minWidth: '32px', padding: '2px 8px', fontSize: '0.85rem' }}
                      onClick={() => setContactRel(contact, '-')} title={t('bladesRival')}
                      aria-label={`${contact} - rival`} aria-pressed={rel === '-'}>-</button>
                    <span style={{ fontWeight: 600 }}>{contact}</span>
                  </div>
                )
              })}
            </fieldset>
          )}
          <fieldset>
            <legend>{t('bladesCustomContacts')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              {t('bladesCustomContactsHint')}
            </p>
            <div className="field-row" style={{ marginBottom: 'var(--space-sm)' }}>
              <div className="field" style={{ flex: 2 }}>
                <input id="new-contact-name" type="text" placeholder="Name, title, description..."
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
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: 'var(--space-xs) 0', fontSize: '0.9rem' }}>
                <button type="button" className={`btn btn-secondary${c.rel === '+' ? ' tab-btn--active' : ''}`}
                  style={{ minWidth: '32px', padding: '2px 8px', fontSize: '0.85rem' }}
                  onClick={() => setContactRel(c.name, '+')} title={t('bladesFriendly')}
                  aria-label={`${c.name} - friend`} aria-pressed={c.rel === '+'}>+</button>
                <button type="button" className={`btn btn-secondary${c.rel === '-' ? ' tab-btn--active' : ''}`}
                  style={{ minWidth: '32px', padding: '2px 8px', fontSize: '0.85rem' }}
                  onClick={() => setContactRel(c.name, '-')} title={t('bladesRival')}
                  aria-label={`${c.name} - rival`} aria-pressed={c.rel === '-'}>-</button>
                <span style={{ fontWeight: 600 }}>{c.name}</span>
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
          <fieldset><legend>{t('backstoryLabel')}</legend><textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} style={{ width: '100%' }} aria-label={t('backstoryLabel')} /></fieldset>
          <fieldset><legend>{t('notes')}</legend><textarea name="notes" value={fields.notes} onChange={handleText} rows={4} style={{ width: '100%' }} aria-label={t('notes')} /></fieldset>
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
        <details style={{ marginBottom: 'var(--space-md)', padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: '8px', background: 'rgba(243,156,18,0.06)' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', color: '#f39c12' }}>
            {t('bladesDevilsBargain')}
          </summary>
          <div role="note" aria-live="polite" style={{ padding: 'var(--space-sm) 0', fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--color-text-muted)' }}>
            {t('bladesDevilsBargainDesc')}
          </div>
        </details>
        <BladesDiceRoller />
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => setShowExport(true)}>{t('exportPdf')}</button>
        <button className="btn btn-secondary" onClick={() => navigate('/sav')}>{t('cancel')}</button>
        <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>{saving ? t('saving') : t('quickSave')}</button>
        <button className="btn btn-primary" onClick={handleDoneEditing} disabled={saving}>{t('doneEditing')}</button>
      </div>
      {viewMode && (
        <div className="view-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/sav')}>{t('back')}</button>
          <button className="btn btn-primary" onClick={() => navigate(`/characters/${characterId}`, { replace: true })}>{t('edit')}</button>
        </div>
      )}
      <ExportModal open={showExport} onClose={() => setShowExport(false)} tabKeys={tabKeys} t={t} />
    </div>
  )
}
