import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getCharacter, updateCharacter } from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import { useLanguage } from '../i18n/LanguageContext'
import ExportModal from './ExportModal'
import { useTheme } from '../context/ThemeContext'
import CatalogSelect from './CatalogSelect'
import { SAV_SHIPS, SAV_SHIP_CATALOG, SAV_REPUTATIONS, SAV_FACTIONS } from '../data/savPlaybooks'

const BLADES_CREW_TYPES = SAV_SHIPS
const BLADES_CREW_TYPE_CATALOG = SAV_SHIP_CATALOG

const FACTIONS = SAV_FACTIONS

const TURF_SLOTS = [
  { name: 'Turf', benefit: '+1 coin per score for each turf claimed', repeatable: true },
  { name: 'Cover Identity', benefit: '+1d to deceive when you leverage your false identity' },
  { name: 'Cover Operation', benefit: '-2 Heat per score' },
  { name: 'Informants', benefit: '+1d to gather info for a score' },
  { name: 'Hagfish Farm', benefit: 'Body disposal. No evidence of murder on your turf.' },
  { name: 'Lookouts', benefit: '+1d to Survey on your turf' },
  { name: 'Personal Quarters', benefit: '+1d to indulge vice during downtime' },
  { name: 'Tavern', benefit: '+1d to Consort and Sway on your turf' },
  { name: 'Warehouse', benefit: 'Stores contraband. +1d to acquire assets during downtime' },
]

const STANDARD_CREW_UPGRADES = [
  'Vault', 'Boat House', 'Carriage House', 'Hidden Lair', 'Mastery', 'Quality', 'Secure Lair', 'Workshop',
]

const FACTION_STATUS_KEYS = {
  '-3': 'bladesFactionWar',
  '-2': 'bladesFactionHostile',
  '-1': 'bladesFactionUnfriendly',
  '0': 'bladesFactionNeutral',
  '1': 'bladesFactionFriendly',
  '2': 'bladesFactionAllied',
  '3': 'bladesFactionAllied',
}

function getFactionStatusColor(status) {
  if (status <= -2) return '#e74c3c'
  if (status === -1) return '#e67e22'
  if (status === 0) return '#888'
  if (status === 1) return '#3498db'
  return '#27ae60'
}

function FactionTracker({ factionData, onChange }) {
  const [customName, setCustomName] = useState('')
  const [customTier, setCustomTier] = useState(1)

  function setStatus(factionName, status) {
    const next = { ...factionData, [factionName]: status }
    onChange(next)
  }

  const allFactions = [...FACTIONS]
  // Add custom factions from data
  for (const key of Object.keys(factionData)) {
    if (!FACTIONS.find(f => f.name === key) && key.startsWith('custom:')) {
      const parts = key.replace('custom:', '').split('|')
      allFactions.push({ name: key, tier: parseInt(parts[1]) || 0, description: parts[2] || '', displayName: parts[0] })
    }
  }

  function addCustomFaction() {
    if (!customName.trim()) return
    const key = `custom:${customName.trim()}|${customTier}|`
    setStatus(key, 0)
    setCustomName('')
    setCustomTier(1)
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        {allFactions.map(faction => {
          const key = faction.name
          const displayName = faction.displayName || faction.name
          const status = factionData[key] || 0
          const color = getFactionStatusColor(status)
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: 'var(--space-xs) 0', borderBottom: '1px solid var(--color-border-subtle, rgba(255,255,255,0.08))' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                  <strong style={{ fontSize: '0.88rem' }}>{displayName}</strong>
                  <span className="muted-hint" style={{ fontSize: '0.75rem' }}>T{faction.tier}</span>
                </div>
                {faction.description && <span className="muted-hint muted-hint--xs" style={{ display: 'block' }}>{faction.description}</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                {[-3, -2, -1, 0, 1, 2, 3].map(v => (
                  <button key={v} type="button"
                    onClick={() => setStatus(key, v)}
                    style={{
                      width: 28, height: 28, borderRadius: 4, border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: status === v ? 700 : 400,
                      background: status === v ? color : 'var(--color-surface-elevated, rgba(255,255,255,0.06))',
                      color: status === v ? '#fff' : 'var(--color-text-secondary, #aaa)',
                    }}
                    title={`${t(FACTION_STATUS_KEYS[String(v)])} (${v > 0 ? '+' : ''}${v})`}
                    aria-label={`${displayName} ${t(FACTION_STATUS_KEYS[String(v)])}`}
                  >
                    {v > 0 ? `+${v}` : v}
                  </button>
                ))}
              </div>
              <span style={{ fontSize: '0.7rem', color, fontWeight: 600, width: 65, textAlign: 'center', flexShrink: 0 }}>
                {t(FACTION_STATUS_KEYS[String(status)])}
              </span>
            </div>
          )
        })}
      </div>
      <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div className="field" style={{ flex: 1, minWidth: 150 }}>
          <label>{t('bladesCustomFaction')}</label>
          <input value={customName} onChange={e => setCustomName(e.target.value)} placeholder="Faction name..." />
        </div>
        <div className="field" style={{ width: 80 }}>
          <label>{t('bladesTier')}</label>
          <input type="number" value={customTier} min={0} max={6} onChange={e => setCustomTier(parseInt(e.target.value) || 0)} />
        </div>
        <button type="button" className="btn btn-secondary" onClick={addCustomFaction} style={{ marginBottom: 2 }}>{t('bladesAddFaction')}</button>
      </div>
    </div>
  )
}

function TurfTracker({ turfData, onChange }) {
  const claimed = turfData ? turfData.split(',').map(s => s.trim()).filter(Boolean) : []

  function toggleTurf(name) {
    const next = claimed.includes(name) ? claimed.filter(c => c !== name) : [...claimed, name]
    onChange(next.join(', '))
  }

  // Count turf claims (the repeatable "Turf" entry can appear multiple times)
  const turfCount = claimed.filter(c => c.startsWith('Turf')).length
  const totalClaimed = claimed.length

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-md)', padding: 'var(--space-sm)', borderRadius: 6, background: 'var(--color-surface-elevated, rgba(255,255,255,0.06))' }}>
        <strong>Total Turf Claimed: {totalClaimed}</strong>
        {turfCount > 0 && <span className="muted-hint" style={{ marginLeft: 'var(--space-sm)' }}>({turfCount} turf = +{turfCount} coin per score)</span>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
        {TURF_SLOTS.map((slot, idx) => {
          // For repeatable turf, generate multiple slots
          if (slot.repeatable) {
            return Array.from({ length: 6 }, (_, i) => {
              const name = i === 0 ? slot.name : `${slot.name} ${i + 1}`
              return (
                <label key={name} style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start', cursor: 'pointer', padding: 'var(--space-xs) 0' }}>
                  <input type="checkbox" checked={claimed.includes(name)} onChange={() => toggleTurf(name)} style={{ marginTop: '3px' }} />
                  <div>
                    <strong style={{ fontSize: '0.88rem' }}>{name}</strong>
                    <span className="muted-hint muted-hint--xs" style={{ display: 'block' }}>{slot.benefit}</span>
                  </div>
                </label>
              )
            })
          }
          return (
            <label key={slot.name} style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start', cursor: 'pointer', padding: 'var(--space-xs) 0' }}>
              <input type="checkbox" checked={claimed.includes(slot.name)} onChange={() => toggleTurf(slot.name)} style={{ marginTop: '3px' }} />
              <div>
                <strong style={{ fontSize: '0.88rem' }}>{slot.name}</strong>
                <span className="muted-hint muted-hint--xs" style={{ display: 'block' }}>{slot.benefit}</span>
              </div>
            </label>
          )
        })}
      </div>
      <div style={{ marginTop: 'var(--space-md)' }}>
        <strong style={{ fontSize: '0.85rem' }}>Benefits Summary:</strong>
        <ul style={{ margin: 'var(--space-xs) 0 0 var(--space-md)', fontSize: '0.82rem' }}>
          {claimed.map(c => {
            const slot = TURF_SLOTS.find(s => c === s.name || c.startsWith(s.name))
            return slot ? <li key={c}><strong>{c}:</strong> {slot.benefit}</li> : <li key={c}>{c}</li>
          })}
          {claimed.length === 0 && <li className="muted-hint">No turf claimed yet.</li>}
        </ul>
      </div>
    </div>
  )
}

const TAB_KEYS = ['tabBladesCrewIdentity', 'tabBladesCrewAbilities', 'tabBladesCrewUpgrades', 'tabBladesCrewCoinVault', 'tabBladesCrewContacts', 'tabBladesCrewFactions', 'tabBladesCrewTurf', 'tabBackstory']


const INITIAL = {
  splat: 'SAV_SHIP', npc: true,
  name: '', concept: '',
  bladesCrewType: '',
  bladesReputation: 0, bladesTier: 0, bladesHold: 'strong',
  bladesHeat: 0, bladesWanted: 0,
  bladesCoin: 0, bladesVault: 0,
  bladesCrewAbilities: '', bladesCrewUpgrades: '',
  bladesHuntingGrounds: '', bladesCrewContacts: '',
  bladesCohorts: '', bladesCrewXp: 0,
  bladesFactions: '', bladesTurf: '',
  notes: '', backstory: '',
  havens: '',
}

function ClickTrack({ label, value, max, onChange, showButtons }) {
  return (
    <div className="field">
      <label>{label} ({value}/{max})</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
        {showButtons && (
          <button type="button" style={{ padding: '0 6px', fontSize: '0.85rem', fontWeight: 700, border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'transparent', color: 'var(--color-text-muted)', cursor: 'pointer', opacity: value <= 0 ? 0.3 : 1 }}
            onClick={() => onChange(Math.max(0, value - 1))} disabled={value <= 0}>-</button>
        )}
        <div className="blades-dots" role="group" aria-label={label}>
          {Array.from({ length: max }, (_, i) => (
            <span key={i}
              className={`blades-pip${i < value ? ' blades-pip--filled' : ''}`}
              onClick={() => onChange(i < value ? i : i + 1)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(i < value ? i : i + 1) } }}
              role="button"
              tabIndex={0}
              aria-label={`${label} ${i + 1}`}
              aria-pressed={i < value}
            />
          ))}
        </div>
        {showButtons && (
          <button type="button" style={{ padding: '0 6px', fontSize: '0.85rem', fontWeight: 700, border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'transparent', color: 'var(--color-text-muted)', cursor: 'pointer', opacity: value >= max ? 0.3 : 1 }}
            onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}>+</button>
        )}
      </div>
    </div>
  )
}

function CheckboxList({ items, selected, onChange }) {
  const sel = selected ? selected.split(',').map(s => s.trim()).filter(Boolean) : []
  function toggle(name) {
    const next = sel.includes(name) ? sel.filter(s => s !== name) : [...sel, name]
    onChange(next.join(', '))
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
      {items.map(item => {
        const isObj = typeof item === 'object'
        const name = isObj ? item.name : item
        const desc = isObj ? item.description : null
        return (
          <label key={name} style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start', cursor: 'pointer', padding: 'var(--space-xs) 0' }}>
            <input type="checkbox" checked={sel.includes(name)} onChange={() => toggle(name)} style={{ marginTop: '3px' }} />
            <div>
              <strong style={{ fontSize: '0.88rem' }}>{name}</strong>
              {desc && <span className="muted-hint muted-hint--xs" style={{ display: 'block' }}>{desc}</span>}
            </div>
          </label>
        )
      })}
    </div>
  )
}

export default function SavShipForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const [searchParams] = useSearchParams()
  const viewMode = searchParams.get('mode') === 'view'
  const characterId = paramId || null

  useEffect(() => { switchTheme('sav') }, [])
  const { isAutoCreating } = useAutoCreate(characterId, INITIAL)

  const [tab, setTab] = useState(0)
  const [fields, setFields] = useState(INITIAL)
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => { if (characterId) loadCharacter() }, [characterId])

  async function loadCharacter() {
    try {
      const res = await getCharacter(characterId)
      const data = res.data
      setFields(prev => { const m = { ...prev }; for (const k in prev) { if (data[k] !== undefined && data[k] !== null) m[k] = data[k] }; return m })
    } catch { setSaveError(t('failedToLoad')) }
    finally { setLoading(false) }
  }

  function handleField(name, value) { setFields(prev => ({ ...prev, [name]: typeof value === 'string' ? value : Number(value) })) }
  function handleText(e) { setFields(prev => ({ ...prev, [e.target.name]: e.target.value })) }
  async function handleSave() { setSaving(true); setSaveError(null); try { await updateCharacter(characterId, fields) } catch { setSaveError(t('failedToSave')) } finally { setSaving(false) } }
  async function handleDoneEditing() { await handleSave(); navigate('/sav') }

  const crewType = BLADES_CREW_TYPES[fields.bladesCrewType] || null

  // Merge standard crew upgrades with crew-type-specific upgrades
  const allUpgrades = crewType
    ? [...new Set([...crewType.upgrades, ...STANDARD_CREW_UPGRADES])]
    : STANDARD_CREW_UPGRADES

  // Vault upgrade bonus: each "Vault" upgrade adds +8 capacity
  const upgradesList = fields.bladesCrewUpgrades ? fields.bladesCrewUpgrades.split(',').map(s => s.trim()).filter(Boolean) : []
  const hasVaultUpgrade = upgradesList.includes('Vault')
  const vaultMax = hasVaultUpgrade ? 16 : 8

  // Parse faction data (stored as JSON string)
  let factionData = {}
  try { if (fields.bladesFactions) factionData = JSON.parse(fields.bladesFactions) } catch { /* ignore parse errors */ }

  function handleFactionChange(data) {
    handleField('bladesFactions', JSON.stringify(data))
  }

  const contactsList = fields.bladesCrewContacts ? fields.bladesCrewContacts.split(',').map(s => s.trim()).filter(Boolean) : []

  function toggleContact(contact) {
    const next = contactsList.includes(contact) ? contactsList.filter(c => c !== contact) : [...contactsList, contact]
    handleField('bladesCrewContacts', next.join(', '))
  }

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/sav')}>{t('back')}</button>
        <h2>{fields.name || t('bladesNewCrew')}</h2>
        <span className="splat-badge splat-badge--blades">{t('splatBlades')}</span>
        <span className="splat-badge" style={{ background: 'rgba(100,149,237,0.15)', color: '#6495ed' }}>{t('bladesCrewBadge')}</span>
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}

      <div className="tab-list" role="tablist">
        {TAB_KEYS.map((tk, i) => (
          <button key={tk} role="tab" id={`tab-${i}`} className={`btn btn-secondary${tab === i ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(i)} aria-selected={tab === i} aria-controls={`tabpanel-${i}`}>{t(tk)}</button>
        ))}
      </div>

      {/* Tab 0 - Crew Identity */}
      <div role="tabpanel" id="tabpanel-0" aria-labelledby="tab-0" hidden={tab !== 0}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tabBladesCrewIdentity')}</legend>
            <div className="field-row">
              <div className="field" style={{ flex: 2 }}><label>{t('bladesCrewName')} *</label><input name="name" value={fields.name} onChange={handleText} placeholder={t('bladesCrewNamePh')} /></div>
            </div>
            <CatalogSelect id="bladesCrewType" name="bladesCrewType" label={t('bladesCrewType')} value={fields.bladesCrewType} onChange={handleField} catalog={BLADES_CREW_TYPE_CATALOG} placeholder={t('bladesCrewTypePh')} />
            <div className="field-row" style={{ marginTop: 'var(--space-md)' }}>
              <div className="field"><label>{t('concept')}</label><input name="concept" value={fields.concept} onChange={handleText} placeholder={t('bladesCrewConceptPh')} /></div>
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('bladesCrewStatus')}</legend>
            <ClickTrack label={t('bladesReputation')} value={fields.bladesReputation} max={12} onChange={v => handleField('bladesReputation', v)} showButtons />
            <div className="field-row" style={{ marginTop: 'var(--space-sm)' }}>
              <div className="field">
                <label>{t('bladesTier')} (0-4)</label>
                <input type="number" name="bladesTier" value={fields.bladesTier} min={0} max={4} onChange={e => handleField('bladesTier', parseInt(e.target.value) || 0)} style={{ width: 80 }} />
              </div>
              <div className="field">
                <label>{t('bladesHold')}</label>
                <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-xs)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                    <input type="radio" name="bladesHold" value="strong" checked={fields.bladesHold === 'strong'} onChange={handleText} /> {t('bladesHoldStrong')}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                    <input type="radio" name="bladesHold" value="weak" checked={fields.bladesHold === 'weak'} onChange={handleText} /> {t('bladesHoldWeak')}
                  </label>
                </div>
              </div>
            </div>
            <div className="field-row" style={{ marginTop: 'var(--space-sm)' }}>
              <ClickTrack label={t('bladesHeat')} value={fields.bladesHeat} max={9} onChange={v => handleField('bladesHeat', v)} showButtons />
              <ClickTrack label={t('bladesWanted')} value={fields.bladesWanted} max={4} onChange={v => handleField('bladesWanted', v)} showButtons />
            </div>
            {fields.bladesWanted > 0 && (
              <p className="muted-hint muted-hint--xs" style={{ marginTop: 'var(--space-xs)', color: fields.bladesWanted >= 3 ? '#e74c3c' : '#f39c12' }}>
                {t(`bladesWanted${fields.bladesWanted}`)}
              </p>
            )}
            <div style={{ marginTop: 'var(--space-sm)' }}>
              <ClickTrack label={t('bladesCrewXp')} value={fields.bladesCrewXp} max={8} onChange={v => handleField('bladesCrewXp', v)} />
            </div>

            {/* Gambit Pool */}
            <div style={{ marginTop: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md)', background: 'var(--color-surface)', borderRadius: 'var(--radius)', border: '2px solid var(--color-accent)' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-accent-fg)' }}>{t('savGambits')}</span>
              <button type="button" className="btn btn-secondary" style={{ minWidth: 36, fontWeight: 700, padding: '0.2rem 0.5rem' }}
                onClick={() => handleField('bladesEdge', Math.max(0, (fields.bladesEdge || 0) - 1))} disabled={(fields.bladesEdge || 0) <= 0}>-</button>
              <span style={{ fontSize: '1.8rem', fontWeight: 700, minWidth: 40, textAlign: 'center' }}>{fields.bladesEdge || 0}</span>
              <button type="button" className="btn btn-secondary" style={{ minWidth: 36, fontWeight: 700, padding: '0.2rem 0.5rem' }}
                onClick={() => handleField('bladesEdge', (fields.bladesEdge || 0) + 1)}>+</button>
              <button type="button" className="dice-roller-clear" onClick={() => handleField('bladesEdge', 2)}>{t('savGambitReset')}</button>
              <span className="muted-hint" style={{ fontSize: '0.75rem' }}>{t('savGambitHint')}</span>
            </div>
          </fieldset>
        </div>
      </div>

      {/* Tab 1 - Crew Abilities */}
      <div role="tabpanel" id="tabpanel-1" aria-labelledby="tab-1" hidden={tab !== 1}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tabBladesCrewAbilities')}</legend>
            {crewType ? (
              <CheckboxList items={crewType.abilities} selected={fields.bladesCrewAbilities} onChange={v => handleField('bladesCrewAbilities', v)} />
            ) : (
              <p className="muted-hint">{t('bladesSelectCrewForAbilities')}</p>
            )}
          </fieldset>
        </div>
      </div>

      {/* Tab 2 - Upgrades */}
      <div role="tabpanel" id="tabpanel-2" aria-labelledby="tab-2" hidden={tab !== 2}>
        <div className="form-section">
          <fieldset>
            <legend>{t('bladesCrewUpgradesLegend')}</legend>
            <CheckboxList items={allUpgrades} selected={fields.bladesCrewUpgrades} onChange={v => handleField('bladesCrewUpgrades', v)} />
            {!crewType && <p className="muted-hint" style={{ marginTop: 'var(--space-xs)' }}>{t('bladesSelectCrewForUpgrades')}</p>}
          </fieldset>

          {/* Ship Systems */}
          <fieldset>
            <legend>{t('savShipSystems')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>{t('savShipSystemsHint')}</p>
            {(() => {
              let systems = { engines: { quality: fields.bladesTier || 0, damaged: false }, hull: { quality: fields.bladesTier || 0, damaged: false }, comms: { quality: fields.bladesTier || 0, damaged: false }, weapons: { quality: fields.bladesTier || 0, damaged: false } }
              try { const parsed = JSON.parse(fields.havens); if (parsed?.systems) systems = { ...systems, ...parsed.systems } } catch {}
              function setSystems(next) {
                let current = {}
                try { current = JSON.parse(fields.havens) || {} } catch {}
                handleField('havens', JSON.stringify({ ...current, systems: next }))
              }
              function updateSystem(key, prop, val) {
                const next = { ...systems, [key]: { ...systems[key], [prop]: val } }
                setSystems(next)
              }
              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-sm)' }}>
                  {[
                    { key: 'engines', labelKey: 'savSystemEngines' },
                    { key: 'hull', labelKey: 'savSystemHull' },
                    { key: 'comms', labelKey: 'savSystemComms' },
                    { key: 'weapons', labelKey: 'savSystemWeapons' },
                  ].map(sys => (
                    <div key={sys.key} style={{
                      padding: 'var(--space-sm)', borderRadius: 'var(--radius)',
                      border: `1px solid ${systems[sys.key].damaged ? 'rgba(231,76,60,0.5)' : 'var(--color-border)'}`,
                      background: systems[sys.key].damaged ? 'rgba(231,76,60,0.06)' : 'var(--color-surface)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{t(sys.labelKey)}</span>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: '#e74c3c', cursor: 'pointer' }}>
                          <input type="checkbox" checked={systems[sys.key].damaged} onChange={e => updateSystem(sys.key, 'damaged', e.target.checked)} />
                          {t('savDamaged')}
                        </label>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{t('savQuality')}:</span>
                        <input type="number" min={0} max={6} value={systems[sys.key].quality} style={{ width: 50 }}
                          onChange={e => updateSystem(sys.key, 'quality', parseInt(e.target.value) || 0)} />
                      </div>
                    </div>
                  ))}
                </div>
              )
            })()}
          </fieldset>

          <fieldset>
            <legend>{t('bladesHuntingGrounds')}</legend>
            {crewType && (
              <div style={{ marginBottom: 'var(--space-sm)' }}>
                <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-xs)' }}>{t('bladesPreferredType')}: {crewType.huntingGrounds.join(', ')}</p>
              </div>
            )}
            <div className="field">
              <label>{t('bladesHuntingGroundsDesc')}</label>
              <input name="bladesHuntingGrounds" value={fields.bladesHuntingGrounds} onChange={handleText} placeholder={t('bladesHuntingGroundsPh')} />
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('bladesCohorts')}</legend>
            {(() => {
              let cohorts = []
              try { cohorts = JSON.parse(fields.bladesCohorts) || [] } catch { /* not JSON, show legacy textarea below */ }
              if (!Array.isArray(cohorts)) cohorts = []

              function setCohorts(next) { handleField('bladesCohorts', JSON.stringify(next)) }
              function addCohort() {
                setCohorts([...cohorts, { name: '', type: 'Gang', quality: fields.bladesTier || 0, edges: '', flaws: '', harm: 0 }])
              }
              function updateCohort(i, key, val) {
                const next = [...cohorts]
                next[i] = { ...next[i], [key]: val }
                setCohorts(next)
              }
              function removeCohort(i) { setCohorts(cohorts.filter((_, j) => j !== i)) }

              // If legacy text data, show textarea with migrate hint
              if (fields.bladesCohorts && cohorts.length === 0 && fields.bladesCohorts.trim()) {
                return (
                  <>
                    <textarea name="bladesCohorts" value={fields.bladesCohorts} onChange={handleText} rows={4} style={{ width: '100%' }} placeholder={t('bladesCohortsPh')} />
                    <button type="button" className="btn btn-secondary" style={{ marginTop: 'var(--space-xs)', fontSize: '0.75rem' }}
                      onClick={() => {
                        const lines = fields.bladesCohorts.split('\n').filter(l => l.trim())
                        const migrated = lines.map(l => ({ name: l.trim(), type: 'Gang', quality: fields.bladesTier || 0, edges: '', flaws: '', harm: 0 }))
                        setCohorts(migrated)
                      }}>{t('bladesCohortMigrate')}</button>
                  </>
                )
              }

              return (
                <>
                  {cohorts.map((c, i) => (
                    <div key={i} style={{ padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', marginBottom: 'var(--space-sm)', background: 'var(--color-surface)' }}>
                      <div className="field-row" style={{ marginBottom: 'var(--space-xs)' }}>
                        <div className="field" style={{ flex: 2 }}>
                          <label>{t('charName')}</label>
                          <input value={c.name} onChange={e => updateCohort(i, 'name', e.target.value)} placeholder={t('bladesCohortNamePh')} />
                        </div>
                        <div className="field">
                          <label>{t('bladesCohortType')}</label>
                          <select value={c.type} onChange={e => updateCohort(i, 'type', e.target.value)}>
                            <option value="Gang">{t('bladesCohortGang')}</option>
                            <option value="Expert">{t('bladesCohortExpert')}</option>
                          </select>
                        </div>
                        <div className="field" style={{ maxWidth: 80 }}>
                          <label>{t('bladesCohortQuality')}</label>
                          <input type="number" min={0} max={6} value={c.quality} onChange={e => updateCohort(i, 'quality', parseInt(e.target.value) || 0)} />
                        </div>
                        <button type="button" className="tag-remove" style={{ alignSelf: 'flex-end', marginBottom: 6 }}
                          onClick={() => removeCohort(i)}>{'\u00d7'}</button>
                      </div>
                      <div className="field-row">
                        <div className="field"><label>{t('bladesCohortEdges')}</label><input value={c.edges || ''} onChange={e => updateCohort(i, 'edges', e.target.value)} placeholder="Fearsome, Loyal..." /></div>
                        <div className="field"><label>{t('bladesCohortFlaws')}</label><input value={c.flaws || ''} onChange={e => updateCohort(i, 'flaws', e.target.value)} placeholder="Principled, Savage..." /></div>
                      </div>
                      {c.type === 'Gang' && (
                        <div style={{ marginTop: 'var(--space-xs)', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          {t('bladesCohortScale')}: {c.quality === 0 ? '1-2' : c.quality === 1 ? '3-6' : c.quality === 2 ? '12' : c.quality === 3 ? '20' : '40+'} {t('bladesCohortMembers')}
                        </div>
                      )}
                    </div>
                  ))}
                  <button type="button" className="btn btn-secondary" onClick={addCohort}>{t('bladesCohortAdd')}</button>
                </>
              )
            })()}
          </fieldset>
        </div>
      </div>

      {/* Tab 3 - Coin & Vault */}
      <div role="tabpanel" id="tabpanel-3" aria-labelledby="tab-3" hidden={tab !== 3}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tabBladesCrewCoinVault')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              {t('bladesCrewCoinVaultHint')}
            </p>
            <div className="field-row" style={{ alignItems: 'flex-end' }}>
              <div className="field" style={{ width: 100 }}>
                <label>{t('bladesCoin')}</label>
                <input type="number" name="bladesCoin" value={fields.bladesCoin} min={0} onChange={e => handleField('bladesCoin', parseInt(e.target.value) || 0)} style={{ width: 80 }} />
              </div>
              <div className="field" style={{ flex: 1 }}>
                <ClickTrack label={t('bladesVault')} value={fields.bladesVault} max={vaultMax} onChange={v => handleField('bladesVault', v)} />
                {hasVaultUpgrade && <span className="muted-hint muted-hint--xs">Vault upgrade: capacity increased to {vaultMax}</span>}
              </div>
            </div>
          </fieldset>
        </div>
      </div>

      {/* Tab 4 - Contacts */}
      <div role="tabpanel" id="tabpanel-4" aria-labelledby="tab-4" hidden={tab !== 4}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tabBladesCrewContacts')}</legend>
            {crewType ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                {crewType.contacts.map(contact => {
                  const active = contactsList.includes(contact)
                  return (
                    <div key={contact} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                      <button type="button" className={`btn btn-secondary`} style={{ minWidth: 36, padding: '2px 8px', background: active ? 'var(--color-accent-fg)' : undefined, color: active ? '#fff' : undefined }}
                        onClick={() => toggleContact(contact)}>
                        {active ? '+' : '-'}
                      </button>
                      <span style={{ fontSize: '0.88rem' }}>{contact}</span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="muted-hint">{t('bladesSelectCrewForContacts')}</p>
            )}
          </fieldset>
        </div>
      </div>

      {/* Tab 5 - Factions */}
      <div role="tabpanel" id="tabpanel-5" aria-labelledby="tab-5" hidden={tab !== 5}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tabBladesCrewFactions')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              {t('bladesFactionTrackerHint')}
            </p>
            <FactionTracker factionData={factionData} onChange={handleFactionChange} />
          </fieldset>
        </div>
      </div>

      {/* Tab 6 - Turf */}
      <div role="tabpanel" id="tabpanel-6" aria-labelledby="tab-6" hidden={tab !== 6}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tabBladesCrewTurf')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              {t('bladesTurfTrackerHint')}
            </p>
            <TurfTracker turfData={fields.bladesTurf} onChange={v => handleField('bladesTurf', v)} />
          </fieldset>
        </div>
      </div>

      {/* Tab 7 - Notes */}
      <div role="tabpanel" id="tabpanel-7" aria-labelledby="tab-7" hidden={tab !== 7}>
        <div className="form-section">
          <fieldset><legend>{t('notes')}</legend><textarea name="notes" value={fields.notes} onChange={handleText} rows={6} style={{ width: '100%' }} placeholder={t('bladesCrewNotesPh')} /></fieldset>
          <fieldset><legend>{t('tabBackstory')}</legend><textarea name="backstory" value={fields.backstory} onChange={handleText} rows={6} style={{ width: '100%' }} placeholder={t('bladesCrewBackstoryPh')} /></fieldset>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => setShowExport(true)}>{t('exportPdf')}</button>
        <button className="btn btn-secondary" onClick={() => navigate('/sav')}>{t('cancel')}</button>
        <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>{saving ? t('saving') : t('quickSave')}</button>
        <button className="btn btn-primary" onClick={handleDoneEditing} disabled={saving}>{t('doneEditing')}</button>
      </div>
      <ExportModal open={showExport} onClose={() => setShowExport(false)} tabKeys={TAB_KEYS} t={t} />
    </div>
  )
}
