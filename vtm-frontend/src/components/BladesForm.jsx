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

const ALL_TAB_KEYS = ['tabIdentity', 'tabBladesActions', 'tabBladesAbilities', 'tabBladesStressHarm', 'tabBladesCoinStash', 'tabBladesItems', 'tabBladesContacts', 'tabBladesDicePools', 'tabBackstory', 'tabXpLog', 'tabDiceRoller']
const ST_ONLY_TABS = new Set()

const BLADES_DICE_POOL_RULES = [
  {
    title: 'Action Rolls',
    sections: [
      { heading: 'Dice Pool', text: 'Roll a pool of d6s equal to your action rating.' },
      { heading: 'Zero Dice', text: 'Zero dice? Roll 2d6 and take the lowest.' },
      { heading: 'Full Success (6)', text: '6 = Full Success. You accomplish your goal.' },
      { heading: 'Partial Success (4-5)', text: '4-5 = Partial Success. You succeed but with a consequence.' },
      { heading: 'Bad Outcome (1-3)', text: '1-3 = Bad Outcome. Things go wrong.' },
      { heading: 'Critical Success', text: 'Two or more 6s = Critical Success (enhanced effect).' },
    ],
  },
  {
    title: 'Position & Effect',
    sections: [
      { heading: 'Controlled', text: 'You act on your terms. Failure = reduced effect, not disaster.' },
      { heading: 'Risky', text: 'The standard position. Failure = trouble.' },
      { heading: 'Desperate', text: 'You\'re in serious danger. Failure = worst outcome. But desperate actions give bonus XP.' },
      { heading: 'Great Effect', text: 'Exceptional impact. More than you\'d expect.' },
      { heading: 'Standard Effect', text: 'Normal impact. The pointed result.' },
      { heading: 'Limited Effect', text: 'Reduced impact. Less than you\'d hope.' },
      { heading: 'Zero Effect', text: 'No effect. Your action has no meaningful impact.' },
    ],
  },
  {
    title: 'Resistance Rolls',
    sections: [
      { heading: 'How to Roll', text: 'Roll d6s equal to the relevant attribute rating (Insight, Prowess, or Resolve).' },
      { heading: 'Stress Cost', text: 'The highest die determines stress cost: 6 = no stress, 4-5 = 1 stress, 1-3 = 2 stress.' },
      { heading: 'Critical', text: 'Critical = clear 1 stress instead of taking any.' },
    ],
  },
  {
    title: 'Fortune Rolls',
    sections: [
      { heading: 'When to Use', text: 'Used when no PC is directly acting (e.g., NPC actions, random events).' },
      { heading: 'Results', text: 'Same d6 pool mechanic: 1-3 bad, 4-5 mixed, 6 good, crit = exceptional.' },
    ],
  },
  {
    title: 'Engagement Roll',
    sections: [
      { heading: 'When to Roll', text: 'Made at the start of a score to determine the opening position.' },
      { heading: 'Advantages (+1d)', text: '+1d for each advantage: detailed plan, good intel, friends, surprise, etc.' },
      { heading: 'Disadvantages (-1d)', text: '-1d for each disadvantage: enemies aware, bad weather, rival interference, etc.' },
      { heading: 'Result', text: 'The result determines the starting position of the score.' },
    ],
  },
  {
    title: 'Downtime Activities (Deep Cuts)',
    sections: [
      { heading: 'Acquire Asset', text: 'Roll tier. 1-3 = tier-1 quality, 4-5 = tier quality, 6 = tier+1, crit = tier+2.' },
      { heading: 'Long-term Project', text: 'Roll relevant action. Tick a progress clock based on the result.' },
      { heading: 'Recover', text: 'Roll tier. Clear 1 harm level per segment filled.' },
      { heading: 'Reduce Heat', text: 'Roll relevant action. 1-3 = clear 1 heat, 4-5 = clear 2, 6 = clear 3, crit = clear 5.' },
      { heading: 'Train', text: 'Mark XP in an attribute or playbook track.' },
      { heading: 'Indulge Vice', text: 'Roll lowest attribute. Clear stress equal to the result. Over max = overindulgence.' },
    ],
  },
  {
    title: 'Flashbacks',
    sections: [
      { heading: '0 Stress', text: 'Normal action with easy opportunity.' },
      { heading: '1 Stress', text: 'Complex action or unlikely opportunity.' },
      { heading: '2+ Stress', text: 'Elaborate action with special contingencies.' },
    ],
  },
  {
    title: 'XP & Advancement',
    sections: [
      { heading: 'Playbook XP (end of session)', text: 'Mark 1 XP for each: You addressed a challenge using your playbook\'s XP trigger. You expressed your beliefs, drives, heritage, or background. You struggled with issues from your vice or traumas.' },
      { heading: 'Attribute XP (during play)', text: 'When you make a desperate action roll using an Insight action, mark Insight XP. Same for Prowess and Resolve. The riskier you play, the faster you advance.' },
      { heading: 'Spending Playbook XP', text: 'At 8 XP, clear the track and gain a new playbook advance: a special ability, +1 action dot, or a veteran advance from another playbook.' },
      { heading: 'Spending Attribute XP', text: 'At 6 XP on Insight/Prowess/Resolve, clear the track and gain +1 action dot in that attribute\'s category.' },
      { heading: 'Training (Downtime)', text: 'During downtime, you can mark XP in one attribute or playbook track by spending a downtime activity on training.' },
      { heading: 'Crew XP (end of session)', text: 'Mark 1 crew XP for each: The crew successfully completed a score. The crew contended with challenges related to its nature. The crew bolstered its reputation or developed assets.' },
      { heading: 'Coin & Stash', text: 'Each coin earned can be spent on downtime activities or stashed for retirement. Stash fills a 40-segment track — when full, your character retires in safety. Each coin stashed fills 1 segment; larger stashes fill proportionally.' },
    ],
  },
]

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
  { key: 'bladesHunt', label: 'Hunt' },
  { key: 'bladesStudy', label: 'Study' },
  { key: 'bladesSurvey', label: 'Survey' },
  { key: 'bladesTinker', label: 'Tinker' },
]
const PROWESS_ACTIONS = [
  { key: 'bladesFinesse', label: 'Finesse' },
  { key: 'bladesProwl', label: 'Prowl' },
  { key: 'bladesSkirmish', label: 'Skirmish' },
  { key: 'bladesWreck', label: 'Wreck' },
]
const RESOLVE_ACTIONS = [
  { key: 'bladesAttune', label: 'Attune' },
  { key: 'bladesCommand', label: 'Command' },
  { key: 'bladesConsort', label: 'Consort' },
  { key: 'bladesSway', label: 'Sway' },
]

const LOAD_OPTIONS = [
  { label: 'Discreet (4)', value: 4 },
  { label: 'Conspicuous (6)', value: 6 },
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
        <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-accent-fg)' }}>{title}</h4>
        {actions.map(a => (
          <div key={a.key} className="blades-action-row">
            <span className="blades-action-label">{a.label}</span>
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
        <button className="btn btn-secondary" onClick={() => navigate('/blades')}>{t('back')}</button>
        <h2>{fields.name || 'Blades Character'}</h2>
        <span className="splat-badge">Blades in the Dark</span>
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
              <div className="field"><label>{t('bladesAlias')}</label><input name="bladesAlias" value={fields.bladesAlias} onChange={handleText} /></div>
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
                {selectedPlaybook.supernatural && <span className="splat-badge splat-badge--blades" style={{ fontSize: '0.75rem', marginBottom: 'var(--space-xs)', display: 'inline-block' }}>Deep Cuts — Supernatural</span>}
                {selectedPlaybook.description && <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 'var(--space-xs)' }}>{selectedPlaybook.description}</p>}
                {selectedPlaybook.xpTrigger && <p className="muted-hint muted-hint--xs"><strong>XP Trigger:</strong> {selectedPlaybook.xpTrigger}</p>}
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
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-md)' }}>
              {t('bladesActionRatingsHint')}
            </p>
            <div className="blades-actions-grid">
              <ActionColumn title="Insight" actions={INSIGHT_ACTIONS} xpKey="bladesInsightXp" />
              <ActionColumn title="Prowess" actions={PROWESS_ACTIONS} xpKey="bladesProwessXp" />
              <ActionColumn title="Resolve" actions={RESOLVE_ACTIONS} xpKey="bladesResolveXp" />
            </div>
          </fieldset>
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
                  {tc}
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

      {/* ── Coin & Stash ── */}
      <div hidden={tab !== 'tabBladesCoinStash'} role="tabpanel" aria-labelledby="tabBladesCoinStash">
        <div className="form-section">
          <fieldset>
            <legend>{t('bladesCoinStash')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              {t('bladesCoinStashHint')}
            </p>
            <div className="field-row" style={{ alignItems: 'flex-end' }}>
              <div className="field" style={{ width: 100 }}>
                <label>{t('bladesCoin')} (0-4)</label>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4].map(i => (
                    <span key={i} role="button" tabIndex={0}
                      className={`blades-stress-box${i <= (fields.bladesCoin || 0) ? ' blades-stress-box--filled' : ''}`}
                      style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '4px', border: '2px solid var(--color-border)', fontSize: '0.75rem', fontWeight: 700 }}
                      onClick={() => handleField('bladesCoin', (fields.bladesCoin || 0) === i ? i - 1 : i)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleField('bladesCoin', (fields.bladesCoin || 0) === i ? i - 1 : i) } }}
                      aria-label={`Coin ${i}`} aria-pressed={i <= (fields.bladesCoin || 0)}>
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

      {/* ── Items & Load ── */}
      <div hidden={tab !== 'tabBladesItems'} role="tabpanel" aria-labelledby="tabBladesItems">
        <div className="form-section">
          <fieldset>
            <legend>{t('bladesLoad')}</legend>
            <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
              {LOAD_OPTIONS.map(opt => (
                <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                  <input type="radio" name="bladesLoad" checked={fields.bladesLoad === opt.value}
                    onChange={() => handleField('bladesLoad', opt.value)} />
                  {opt.label} ({opt.value})
                </label>
              ))}
            </div>
            <p className="muted-hint muted-hint--xs" role="status" aria-live="polite">
              {t('bladesCurrentLoad')}: <strong>{currentLoad}</strong> / {fields.bladesLoad || '?'}
              {fields.bladesLoad > 0 && currentLoad > fields.bladesLoad && <span style={{ color: 'var(--color-danger)', fontWeight: 600 }}> {t('bladesOverEncumbered')}</span>}
            </p>
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
        <RulesReferenceTab rules={BLADES_DICE_POOL_RULES} title={t('tabBladesDicePools')} />
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
