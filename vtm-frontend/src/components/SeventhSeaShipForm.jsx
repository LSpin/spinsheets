import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getCharacter, updateCharacter } from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import { useLanguage } from '../i18n/LanguageContext'
import ExportModal from './ExportModal'
import { useTheme } from '../context/ThemeContext'

// ── Ship Builder Data (7th Sea 2e) ──
const SHIP_ORIGINS = [
  // ── Core Rulebook ──
  { value: 'Avalon', description: 'Sleek and fast. Bonus: +1 to Sailing rolls for maneuverability.', source: 'Core' },
  { value: 'Castille', description: 'Well-armed galleons. Bonus: +1 Cannon damage.', source: 'Core' },
  { value: 'Eisen', description: 'Iron-reinforced hulls. Bonus: +1 to resist structural damage.', source: 'Core' },
  { value: 'Montaigne', description: 'Elegant and luxurious. Bonus: +1 to social encounters aboard.', source: 'Core' },
  { value: 'Sarmatian Commonwealth', description: 'Versatile river/sea craft. Bonus: can navigate shallow waters.', source: 'Core' },
  { value: 'Ussura', description: 'Ice-hardened and sturdy. Bonus: immune to cold-weather penalties.', source: 'Core' },
  { value: 'Vestenmennavenjar', description: 'Viking-style longships. Bonus: +1 to boarding actions.', source: 'Core' },
  { value: 'Vodacce', description: 'Fast merchant vessels. Bonus: +1 to trade and smuggling rolls.', source: 'Core' },
  { value: 'Crescent Empire', description: 'Dhows with lateen sails. Bonus: +1 to long-distance voyages.', source: 'Core' },
  // ── Pirate Nations ──
  { value: 'Aragosta', description: 'Always gains 1 additional Raise for Crew Risks at sea.', source: 'Pirate Nations' },
  { value: 'Atabean Trading Company', description: 'Once per Episode, can repel all boarders for a single Round.', source: 'Pirate Nations' },
  { value: 'Jaragua', description: 'Earns 1 additional Wealth selling goods in Company ports.', source: 'Pirate Nations' },
  { value: 'La Bucca', description: 'Once per session, present a Letter of Marque from any Nation (forged).', source: 'Pirate Nations' },
  { value: 'Numa', description: 'Whenever a Hero activates a Knack Advantage, any Hero on the Ship can pay the Hero Point cost.', source: 'Pirate Nations' },
  { value: 'Rahuri', description: 'Ship and Crews take 1 fewer Hit/Wound (minimum 1) from Ships or Monsters in the Atabean.', source: 'Pirate Nations' },
]

const SHIP_BACKGROUNDS = [
  // ── Core Rulebook ──
  { value: 'Merchant Vessel', description: 'A trading ship with large cargo holds. Extra cargo capacity.', source: 'Core' },
  { value: 'Military Warship', description: 'A decommissioned naval vessel. Comes with extra cannons.', source: 'Core' },
  { value: 'Pirate Prize', description: 'Captured from enemies. Fast but battle-scarred. +1 Intimidation at sea.', source: 'Core' },
  { value: 'Explorer\'s Ship', description: 'Built for long voyages. Extra supplies and navigation equipment.', source: 'Core' },
  { value: 'Smuggler\'s Craft', description: 'Hidden compartments and shallow draft. +1 to evade customs.', source: 'Core' },
  { value: 'Privateer', description: 'Licensed by a nation. Legal protection in home waters. Letter of marque.', source: 'Core' },
  { value: 'Ghost Ship', description: 'Rumored haunted. Crew is superstitious but enemies fear to approach.', source: 'Core' },
  { value: 'Custom Built', description: 'Purpose-built to your specifications. Choose one extra modification.', source: 'Core' },
  // ── Pirate Nations ──
  { value: 'Black Flag', description: 'Renowned pirate vessel; pirate NPCs treat you with respect.', source: 'Pirate Nations' },
  { value: 'Port of Ghosts', description: 'Visited Soryana; can reforge ties with Lost ancestors aboard.', source: 'Pirate Nations' },
  { value: 'Salacio\'s Favorite', description: 'First Hero Point gain each session grants an additional Hero Point.', source: 'Pirate Nations' },
  { value: 'Smuggler Queen', description: 'Spend a Hero Point to sail into forbidden waters undetected.', source: 'Pirate Nations' },
]

const SHIP_MODIFICATIONS = [
  { name: 'Extra Cannons', cost: 3, description: '+1 Cannon rating. Heavier armament for ship-to-ship combat.' },
  { name: 'Reinforced Hull', cost: 3, description: '+1 Hull rating. Harder to sink or damage.' },
  { name: 'Extended Cargo Hold', cost: 2, description: 'Double cargo capacity. Essential for trading vessels.' },
  { name: 'Hidden Compartments', cost: 2, description: 'Secret spaces for smuggling. +1d to hide contraband.' },
  { name: 'Ram', cost: 2, description: 'Reinforced prow for ramming. Deals damage equal to your Sailing roll.' },
  { name: 'Speed Refit', cost: 3, description: '+1 to all chase and pursuit rolls. Streamlined hull and rigging.' },
  { name: 'Crow\'s Nest', cost: 1, description: 'Elevated lookout post. +1 to Survey rolls at sea.' },
  { name: 'Sick Bay', cost: 2, description: 'Medical facilities aboard. Crew heals faster during voyages.' },
  { name: 'Luxury Quarters', cost: 2, description: 'Captain\'s quarters fit for nobility. +1 to social rolls aboard.' },
  { name: 'Chain Shot', cost: 1, description: 'Specialized ammunition that targets rigging. Can slow enemy ships.' },
  { name: 'Figurehead', cost: 1, description: 'Carved prow ornament. Crew gains +1 morale in dangerous waters.' },
  { name: 'Swivel Guns', cost: 2, description: 'Small anti-personnel cannons. +1 to repel boarding actions.' },
  { name: 'Armored Gunports', cost: 2, description: 'Reinforced cannon positions. Crew takes less harm during broadsides.' },
  { name: 'Navigator\'s Tools', cost: 1, description: 'Advanced charts and instruments. +1 to navigation rolls.' },
  { name: 'Grappling Hooks', cost: 1, description: 'Specialized boarding equipment. +1 to boarding action rolls.' },
]

const SHIP_CREW_QUALITY = [
  { value: 'Rabble', strength: 1, description: 'Untrained press-ganged crew. Strength 1. Unreliable but cheap.' },
  { value: 'Landlubbers', strength: 3, description: 'Inexperienced but willing sailors. Strength 3. Still learning the ropes.' },
  { value: 'Able Seamen', strength: 5, description: 'Competent professional sailors. Strength 5. Solid and dependable.' },
  { value: 'Veterans', strength: 7, description: 'Experienced old salts. Strength 7. They\'ve survived storms and battles.' },
  { value: 'Elite', strength: 10, description: 'The finest crew on the seas. Strength 10. Legendary sailors and fighters.' },
]

const CREW_QUALITY_STRENGTH = { 'Rabble': 1, 'Landlubbers': 3, 'Able Seamen': 5, 'Veterans': 7, 'Elite': 10 }

const TAB_KEYS = ['tab7sShipIdentity', 'tab7sShipCrew', 'tabBackstory']

const INITIAL = {
  splat: 'SEVENTH_SEA_SHIP', npc: true,
  name: '',
  shipData7s: '',
  notes: '', backstory: '',
}

function decodeHtml(s) {
  if (!s) return s
  return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'")
}

export default function SeventhSeaShipForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const [searchParams] = useSearchParams()
  const viewMode = searchParams.get('mode') === 'view'
  const characterId = paramId || null

  useEffect(() => { switchTheme('7thsea') }, [])
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
  async function handleDoneEditing() { await handleSave(); navigate('/7thsea') }

  // Parse ship data from JSON blob
  const raw = decodeHtml(fields.shipData7s)
  let ship
  try { ship = raw ? JSON.parse(raw) : null } catch { ship = null }
  if (!ship) ship = { origin: '', background: '', crewQuality: '', crewSize: 20, cannons: 1, hull: 1, speed: 1, cargo: 1, modifications: [], notes: '' }

  function updateShip(patch) {
    const next = { ...ship, ...patch }
    handleField('shipData7s', JSON.stringify(next))
  }

  function toggleMod(modName) {
    const mods = ship.modifications || []
    const next = mods.includes(modName) ? mods.filter(m => m !== modName) : [...mods, modName]
    updateShip({ modifications: next })
  }

  const totalModCost = (ship.modifications || []).reduce((sum, name) => {
    const mod = SHIP_MODIFICATIONS.find(m => m.name === name)
    return sum + (mod?.cost || 0)
  }, 0)

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/7thsea')}>{t('back')}</button>
        <h2>{fields.name || t('sevenSeaNewShip')}</h2>
        <span className="splat-badge splat-badge--seventh-sea">{t('seventhSea')}</span>
        <span className="splat-badge splat-badge--seventh-sea-ship">{t('splatSeventhSeaShip')}</span>
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}

      <div className="tab-list" role="tablist">
        {TAB_KEYS.map((tk, i) => (
          <button key={tk} role="tab" id={`tab-${i}`} className={`btn btn-secondary${tab === i ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(i)} aria-selected={tab === i} aria-controls={`tabpanel-${i}`}>{t(tk)}</button>
        ))}
      </div>

      {/* Tab 0 - Identity & Design */}
      <div role="tabpanel" id="tabpanel-0" aria-labelledby="tab-0" hidden={tab !== 0}>
        <div className="form-section">
          <fieldset>
            <legend>{t('ship7sName')}</legend>
            <div className="field-row">
              <div className="field" style={{ flex: 2 }}>
                <label>{t('ship7sName')} *</label>
                <input name="name" value={fields.name} onChange={handleText} placeholder="The Silver Gull" />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>{t('ship7sOrigin')}</label>
                <select value={ship.origin} onChange={e => updateShip({ origin: e.target.value })}>
                  <option value="">{t('select')}</option>
                  {SHIP_ORIGINS.map(o => <option key={o.value} value={o.value}>{o.value}{o.source !== 'Core' ? ` (${o.source})` : ''}</option>)}
                </select>
                {ship.origin && (() => {
                  const o = SHIP_ORIGINS.find(o => o.value === ship.origin)
                  return o && <p className="archetype-desc">{o.description} <span className="muted-hint muted-hint--xs">({o.source})</span></p>
                })()}
              </div>
              <div className="field">
                <label>{t('ship7sBackground')}</label>
                <select value={ship.background} onChange={e => updateShip({ background: e.target.value })}>
                  <option value="">{t('select')}</option>
                  {SHIP_BACKGROUNDS.map(b => <option key={b.value} value={b.value}>{b.value}{b.source !== 'Core' ? ` (${b.source})` : ''}</option>)}
                </select>
                {ship.background && (() => {
                  const b = SHIP_BACKGROUNDS.find(b => b.value === ship.background)
                  return b && <p className="archetype-desc">{b.description} <span className="muted-hint muted-hint--xs">({b.source})</span></p>
                })()}
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('ship7sStats')}</legend>
            <div className="field-row">
              <div className="field" style={{ width: 100 }}>
                <label>{t('ship7sCannons')}</label>
                <input type="number" min={0} max={10} value={ship.cannons} onChange={e => updateShip({ cannons: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="field" style={{ width: 100 }}>
                <label>{t('ship7sHull')}</label>
                <input type="number" min={0} max={10} value={ship.hull} onChange={e => updateShip({ hull: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="field" style={{ width: 100 }}>
                <label>{t('ship7sSpeed')}</label>
                <input type="number" min={0} max={10} value={ship.speed} onChange={e => updateShip({ speed: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="field" style={{ width: 100 }}>
                <label>{t('ship7sCargo')}</label>
                <input type="number" min={0} max={10} value={ship.cargo} onChange={e => updateShip({ cargo: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
          </fieldset>
        </div>
      </div>

      {/* Tab 1 - Crew & Modifications */}
      <div role="tabpanel" id="tabpanel-1" aria-labelledby="tab-1" hidden={tab !== 1}>
        <div className="form-section">
          <fieldset>
            <legend>{t('ship7sCrew')}</legend>
            <div className="field-row">
              <div className="field">
                <label>{t('ship7sCrewQuality')}</label>
                <select value={ship.crewQuality} onChange={e => updateShip({ crewQuality: e.target.value })}>
                  <option value="">{t('select')}</option>
                  {SHIP_CREW_QUALITY.map(c => <option key={c.value} value={c.value}>{c.value}</option>)}
                </select>
                {ship.crewQuality && <p className="archetype-desc">{SHIP_CREW_QUALITY.find(c => c.value === ship.crewQuality)?.description}</p>}
              </div>
              <div className="field" style={{ width: 100 }}>
                <label>{t('ship7sCrewSize')}</label>
                <input type="number" min={1} max={500} value={ship.crewSize} onChange={e => updateShip({ crewSize: parseInt(e.target.value) || 1 })} />
              </div>
            </div>
          </fieldset>

          {ship.crewQuality && ship.crewSize > 0 && (() => {
            const qualityVal = CREW_QUALITY_STRENGTH[ship.crewQuality] || 0
            const crewStrength = qualityVal * ship.crewSize
            return (
              <fieldset>
                <legend>Crew Strength</legend>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-sm)', background: 'rgba(52,152,219,0.08)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--color-accent-fg)' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-accent-fg)', minWidth: 80, textAlign: 'center' }}>
                    {crewStrength}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                      {ship.crewQuality} (quality {qualityVal}) x {ship.crewSize} crew = {crewStrength} Crew Strength
                    </div>
                    <p className="muted-hint muted-hint--xs" style={{ marginTop: '2px' }}>
                      Crew Strength determines combat effectiveness in ship-to-ship boarding and crew actions.
                    </p>
                  </div>
                </div>
              </fieldset>
            )
          })()}

          <fieldset>
            <legend>{t('ship7sMods')} ({t('ship7sModCost')}: {totalModCost})</legend>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-sm)' }}>
              {SHIP_MODIFICATIONS.map(mod => (
                <label key={mod.name} style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start', padding: 'var(--space-xs)', cursor: 'pointer', borderRadius: 'var(--radius)', background: (ship.modifications || []).includes(mod.name) ? 'rgba(52,152,219,0.08)' : 'transparent' }}>
                  <input type="checkbox" checked={(ship.modifications || []).includes(mod.name)} onChange={() => toggleMod(mod.name)} />
                  <div>
                    <strong style={{ fontSize: '0.85rem' }}>{mod.name}</strong>
                    <span className="muted-hint muted-hint--xs" style={{ marginLeft: '0.3rem' }}>({mod.cost} pts)</span>
                    <p className="muted-hint muted-hint--xs" style={{ margin: '2px 0 0' }}>{mod.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('ship7sNotes')}</legend>
            <textarea value={ship.notes} onChange={e => updateShip({ notes: e.target.value })} rows={4} style={{ width: '100%' }}
              placeholder="Notable crew members, ship history, battle scars, special cargo..." />
          </fieldset>
        </div>
      </div>

      {/* Tab 2 - Notes */}
      <div role="tabpanel" id="tabpanel-2" aria-labelledby="tab-2" hidden={tab !== 2}>
        <div className="form-section">
          <fieldset><legend>{t('notes')}</legend><textarea name="notes" value={fields.notes} onChange={handleText} rows={6} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('backstoryLabel')}</legend><textarea name="backstory" value={fields.backstory} onChange={handleText} rows={6} style={{ width: '100%' }} /></fieldset>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => setShowExport(true)}>{t('exportPdf')}</button>
        <button className="btn btn-secondary" onClick={() => navigate('/7thsea')}>{t('cancel')}</button>
        <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>{saving ? t('saving') : t('quickSave')}</button>
        <button className="btn btn-primary" onClick={handleDoneEditing} disabled={saving}>{t('doneEditing')}</button>
      </div>
      <ExportModal open={showExport} onClose={() => setShowExport(false)} tabKeys={TAB_KEYS} t={t} />
    </div>
  )
}
