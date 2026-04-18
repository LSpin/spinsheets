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
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import {
  BLADES_HERITAGES, BLADES_BACKGROUNDS, BLADES_VICES,
  BLADES_PLAYBOOKS, BLADES_PLAYBOOK_CATALOG, BLADES_TRAUMA_CONDITIONS, BLADES_STANDARD_ITEMS,
} from '../data/bladesPlaybooks'

const TAB_KEYS = ['tabIdentity', 'tabBladesActions', 'tabBladesAbilities', 'tabBladesStressHarm', 'tabBladesItems', 'tabBladesContacts', 'tabBackstory', 'tabXpLog', 'tabDiceRoller']

const INITIAL = {
  splat: 'BLADES',
  name: '', bladesAlias: '', concept: '', appearanceDesc: '',
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
  // Shared
  notes: '', backstory: '',
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
  { label: 'Light', value: 3 },
  { label: 'Normal', value: 5 },
  { label: 'Heavy', value: 6 },
]

/* ── Small dot-rating for 0-4 action dots ── */
function BladesDots({ value, max = 4, onChange }) {
  return (
    <span className="blades-dots">
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`blades-dot${i < value ? ' blades-dot--filled' : ''}`}
          onClick={() => onChange(value === i + 1 ? i : i + 1)}
          role="button"
          tabIndex={0}
          aria-label={`${i + 1} dot${i + 1 !== 1 ? 's' : ''}`}
        />
      ))}
    </span>
  )
}

/* ── Clickable pips for XP tracks ── */
function XpPips({ value, max, onChange }) {
  return (
    <span className="blades-dots">
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`blades-pip${i < value ? ' blades-pip--filled' : ''}`}
          onClick={() => onChange(value === i + 1 ? i : i + 1)}
          role="button"
          tabIndex={0}
          aria-label={`${i + 1} xp`}
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
  const [searchParams] = useSearchParams()
  const viewMode = searchParams.get('mode') === 'view'
  const characterId = paramId || null

  useEffect(() => { switchTheme('blades') }, [])

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

  function setContactRel(contactName, rel) {
    const contacts = parseContacts()
    const existing = contacts.find(c => c.name === contactName)
    if (existing) {
      existing.rel = existing.rel === rel ? '' : rel
    } else {
      contacts.push({ name: contactName, rel })
    }
    handleField('bladesContacts', contacts.map(c => `${c.name}:${c.rel}`).join(', '))
  }

  function getContactRel(contactName) {
    const contacts = parseContacts()
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

      <div className="tab-list" role="tablist">
        {TAB_KEYS.map((tk, i) => (
          <button key={tk} role="tab" className={`btn btn-secondary${tab === i ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(i)} aria-selected={tab === i}>{t(tk)}</button>
        ))}
      </div>

      {/* ── Tab 0: Identity ── */}
      <div hidden={tab !== 0}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tabIdentity')}</legend>
            <div className="field-row">
              <div className="field"><label>{t('charName')} *</label><input name="name" value={fields.name} onChange={handleText} /></div>
              <div className="field"><label>Alias</label><input name="bladesAlias" value={fields.bladesAlias} onChange={handleText} /></div>
            </div>
            <div className="field">
              <label>Look / Appearance</label>
              <textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={3} style={{ width: '100%' }} />
            </div>
            <div className="field-row">
              <CatalogSelect id="bladesHeritage" name="bladesHeritage" label="Heritage" value={fields.bladesHeritage}
                onChange={handleField} catalog={BLADES_HERITAGES} />
              <CatalogSelect id="bladesBackground" name="bladesBackground" label="Background" value={fields.bladesBackground}
                onChange={handleField} catalog={BLADES_BACKGROUNDS} />
            </div>
            <div className="field-row">
              <CatalogSelect id="bladesVice" name="bladesVice" label="Vice" value={fields.bladesVice}
                onChange={handleField} catalog={BLADES_VICES} />
              <div className="field"><label>Vice Purveyor</label><input name="bladesVicePurveyor" value={fields.bladesVicePurveyor} onChange={handleText} placeholder="Who supplies your vice?" /></div>
            </div>
            <div className="field-row">
              <CatalogSelect id="bladesPlaybook" name="bladesPlaybook" label="Playbook" value={fields.bladesPlaybook}
                onChange={handleField}
                catalog={BLADES_PLAYBOOK_CATALOG} />
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

      {/* ── Tab 1: Actions ── */}
      <div hidden={tab !== 1}>
        <div className="form-section">
          <fieldset>
            <legend>Action Ratings</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-md)' }}>
              Click dots to set action ratings (0-4). Click XP pips to track attribute experience.
            </p>
            <div className="blades-actions-grid">
              <ActionColumn title="Insight" actions={INSIGHT_ACTIONS} xpKey="bladesInsightXp" />
              <ActionColumn title="Prowess" actions={PROWESS_ACTIONS} xpKey="bladesProwessXp" />
              <ActionColumn title="Resolve" actions={RESOLVE_ACTIONS} xpKey="bladesResolveXp" />
            </div>
          </fieldset>
          <fieldset>
            <legend>Playbook XP</legend>
            <div className="blades-xp-row">
              <span className="blades-action-label">Playbook XP</span>
              <XpPips value={fields.bladesPlaybookXp} max={8} onChange={v => handleField('bladesPlaybookXp', v)} />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Tab 2: Abilities ── */}
      <div hidden={tab !== 2}>
        <div className="form-section">
          <fieldset>
            <legend>Special Abilities{selectedPlaybook ? ` - ${fields.bladesPlaybook}` : ''}</legend>
            {!selectedPlaybook && (
              <p className="muted-hint">Select a playbook on the Identity tab to see available abilities.</p>
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
              <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-accent-fg)' }}>Veteran Abilities (from other playbooks)</summary>
              <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
                Pick abilities from other playbooks as a veteran advance.
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

      {/* ── Tab 3: Stress & Harm ── */}
      <div hidden={tab !== 3}>
        <div className="form-section">
          <fieldset>
            <legend>Stress</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Click to set stress level (0-9). At 9+ you suffer trauma.
            </p>
            <div className="blades-stress-track">
              {Array.from({ length: 9 }, (_, i) => (
                <span
                  key={i}
                  className={`blades-stress-box${i < fields.bladesStress ? ' blades-stress-box--filled' : ''}`}
                  onClick={() => handleField('bladesStress', fields.bladesStress === i + 1 ? i : i + 1)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Stress ${i + 1}`}
                />
              ))}
              <span style={{ marginLeft: 'var(--space-sm)', fontSize: '0.85rem', fontWeight: 600 }}>{fields.bladesStress}/9</span>
            </div>
          </fieldset>
          <fieldset>
            <legend>Trauma</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Check trauma conditions. Max 4 trauma — a character is retired at 4.
              {selectedTrauma.length >= 4 && <span style={{ color: 'var(--color-danger)', fontWeight: 600 }}> Warning: character has 4 trauma!</span>}
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
            <legend>Harm</legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <div className="field-row">
                <span style={{ minWidth: '80px', fontWeight: 600, fontSize: '0.85rem' }}>Level 3 (Fatal)</span>
                <div className="field" style={{ flex: 1 }}><input name="bladesHarm3" value={fields.bladesHarm3} onChange={handleText} placeholder="Need fatal" /></div>
              </div>
              <div className="field-row">
                <span style={{ minWidth: '80px', fontWeight: 600, fontSize: '0.85rem' }}>Level 2 (Severe)</span>
                <div className="field" style={{ flex: 1 }}><input name="bladesHarm2a" value={fields.bladesHarm2a} onChange={handleText} placeholder="-1d" /></div>
                <div className="field" style={{ flex: 1 }}><input name="bladesHarm2b" value={fields.bladesHarm2b} onChange={handleText} placeholder="-1d" /></div>
              </div>
              <div className="field-row">
                <span style={{ minWidth: '80px', fontWeight: 600, fontSize: '0.85rem' }}>Level 1 (Lesser)</span>
                <div className="field" style={{ flex: 1 }}><input name="bladesHarm1a" value={fields.bladesHarm1a} onChange={handleText} placeholder="Less effect" /></div>
                <div className="field" style={{ flex: 1 }}><input name="bladesHarm1b" value={fields.bladesHarm1b} onChange={handleText} placeholder="Less effect" /></div>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Healing Clock</legend>
            <div className="blades-xp-row">
              <span className="blades-action-label">Healing</span>
              <XpPips value={fields.bladesHealingClock} max={4} onChange={v => handleField('bladesHealingClock', v)} />
            </div>
          </fieldset>
          <fieldset>
            <legend>Armor</legend>
            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={!!fields.bladesArmor} onChange={() => handleCheck('bladesArmor')} /> Armor
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={!!fields.bladesHeavyArmor} onChange={() => handleCheck('bladesHeavyArmor')} /> Heavy
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={!!fields.bladesSpecialArmor} onChange={() => handleCheck('bladesSpecialArmor')} /> Special
              </label>
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Tab 4: Items & Load ── */}
      <div hidden={tab !== 4}>
        <div className="form-section">
          <fieldset>
            <legend>Load</legend>
            <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
              {LOAD_OPTIONS.map(opt => (
                <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                  <input type="radio" name="bladesLoad" checked={fields.bladesLoad === opt.value}
                    onChange={() => handleField('bladesLoad', opt.value)} />
                  {opt.label} ({opt.value})
                </label>
              ))}
            </div>
            <p className="muted-hint muted-hint--xs">
              Current load: <strong>{currentLoad}</strong> / {fields.bladesLoad || '?'}
              {fields.bladesLoad > 0 && currentLoad > fields.bladesLoad && <span style={{ color: 'var(--color-danger)', fontWeight: 600 }}> Over encumbered!</span>}
            </p>
          </fieldset>
          <fieldset>
            <legend>Standard Items</legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              {BLADES_STANDARD_ITEMS.map(item => (
                <label key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', fontSize: '0.85rem' }}>
                  <input type="checkbox" checked={selectedItems.includes(item.name)} onChange={() => toggleItem(item.name)} />
                  <span><strong>{item.name}</strong> ({item.load || 1} load){item.description ? ` - ${item.description}` : ''}</span>
                </label>
              ))}
            </div>
          </fieldset>
          {selectedPlaybook?.items?.length > 0 && (
            <fieldset>
              <legend>{fields.bladesPlaybook} Items</legend>
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

      {/* ── Tab 5: Contacts ── */}
      <div hidden={tab !== 5}>
        <div className="form-section">
          <fieldset>
            <legend>Contacts{selectedPlaybook ? ` - ${fields.bladesPlaybook}` : ''}</legend>
            {!selectedPlaybook && (
              <p className="muted-hint">Select a playbook on the Identity tab to see your contacts.</p>
            )}
            {selectedPlaybook?.contacts?.map(contact => {
              const rel = getContactRel(contact)
              return (
                <div key={contact} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: 'var(--space-xs) 0', fontSize: '0.9rem' }}>
                  <button
                    type="button"
                    className={`btn btn-secondary${rel === '+' ? ' tab-btn--active' : ''}`}
                    style={{ minWidth: '32px', padding: '2px 8px', fontSize: '0.85rem' }}
                    onClick={() => setContactRel(contact, '+')}
                    title="Friendly"
                  >+</button>
                  <button
                    type="button"
                    className={`btn btn-secondary${rel === '-' ? ' tab-btn--active' : ''}`}
                    style={{ minWidth: '32px', padding: '2px 8px', fontSize: '0.85rem' }}
                    onClick={() => setContactRel(contact, '-')}
                    title="Rival"
                  >-</button>
                  <span style={{ fontWeight: 600 }}>{contact}</span>
                </div>
              )
            })}
          </fieldset>
        </div>
      </div>

      {/* ── Tab 6: Backstory ── */}
      <div hidden={tab !== 6}>
        <div className="form-section">
          <fieldset><legend>{t('backstoryLabel')}</legend><textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('notes')}</legend><textarea name="notes" value={fields.notes} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
        </div>
      </div>

      {/* ── Tab 7: XP Log ── */}
      <div hidden={tab !== 7}>
        <XpLogSection splat="blades" xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)} t={t} />
      </div>

      {/* ── Tab 8: Dice Roller ── */}
      <div hidden={tab !== 8}>
        <BladesDiceRoller />
      </div>

      <div className="form-actions">
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
    </div>
  )
}
