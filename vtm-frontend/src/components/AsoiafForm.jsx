import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  getCharacter, updateCharacter,
  getXpLog, addXpLogEntry, removeXpLogEntry,
} from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import DotRating from './DotRating'
import CatalogSelect from './CatalogSelect'
import XpLogSection from './XpLogSection'
import RulesReferenceTab from './RulesReferenceTab'
import ExportModal from './ExportModal'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import {
  ASOIAF_ABILITIES, ASOIAF_AGE_CATALOG, ASOIAF_BENEFIT_CATALOG, ASOIAF_BENEFITS,
  ASOIAF_DRAWBACK_CATALOG, ASOIAF_DRAWBACKS, ASOIAF_WEAPON_CATALOG, ASOIAF_WEAPONS,
  ASOIAF_ARMOR_CATALOG, ASOIAF_ARMOR, ASOIAF_HOUSE_RESOURCES,
} from '../data/asoiafData'

const TAB_KEYS = ['tabAsoiafIdentity', 'tabAsoiafAbilities', 'tabAsoiafDestiny', 'tabAsoiafDrawbacks', 'tabAsoiafCombat', 'tabAsoiafIntrigue', 'tabAsoiafEquipment', 'tabAsoiafHouse', 'tabBackstory', 'tabXpLog', 'tabDiceRoller', 'tabAsoiafRulesRef']

const INITIAL = {
  splat: 'ASOIAF',
  name: '', asoiafHouse: '', asoiafAge: 'Adult', asoiafRole: '', concept: '', appearanceDesc: '',
  asoiafAgility: 2, asoiafAnimalHandling: 2, asoiafAthletics: 2, asoiafAwareness: 2,
  asoiafCunning: 2, asoiafDeception: 2, asoiafEndurance: 2, asoiafFighting: 2,
  asoiafHealing: 2, asoiafKnowledge: 2, asoiafLanguage: 2, asoiafMarksmanship: 2,
  asoiafPersuasion: 2, asoiafStatusAbility: 2, asoiafStealth: 2, asoiafSurvival: 2,
  asoiafThievery: 2, asoiafWarfare: 2, asoiafWill: 2,
  asoiafDestinyPoints: 0, asoiafHealthMax: 0, asoiafHealthCurrent: 0,
  asoiafComposureMax: 0, asoiafComposureCurrent: 0,
  asoiafGoldDragons: 0, asoiafSilverStags: 0, asoiafCopperPennies: 0,
  asoiafSpecialties: '', asoiafBenefits: '', asoiafDrawbacks: '',
  asoiafWeapons: '', asoiafArmor: '', asoiafInventory: '',
  asoiafInjuries: '', asoiafHouseData: '',
  notes: '', backstory: '',
}

const DISPOSITIONS = ['Affectionate', 'Friendly', 'Amiable', 'Indifferent', 'Dislike', 'Unfriendly', 'Malicious']

const DIFFICULTIES = [
  { value: 3, label: 'Automatic (3)' },
  { value: 6, label: 'Easy (6)' },
  { value: 9, label: 'Routine (9)' },
  { value: 12, label: 'Challenging (12)' },
  { value: 15, label: 'Hard (15)' },
  { value: 18, label: 'Very Hard (18)' },
  { value: 21, label: 'Heroic (21)' },
]

const ASOIAF_RULES = [
  { title: 'Test Resolution', sections: [
    { heading: 'Basic Test', text: 'Roll a number of d6 equal to your Ability rank. Add bonus dice from Specialties. Keep a number of dice equal to your Ability rank, sum the kept dice, and compare to the Difficulty.' },
    { heading: 'Bonus Dice', text: 'Specialties grant bonus dice (B). Roll Ability + Bonus dice, but only keep Ability dice (choose the highest).' },
    { heading: 'Penalty Dice', text: 'Penalty dice (-D) reduce the number of test dice rolled (minimum 1).' },
  ]},
  { title: 'Difficulty Numbers', sections: [
    { heading: 'Automatic (3)', text: 'Trivial tasks anyone can accomplish.' },
    { heading: 'Easy (6)', text: 'Simple tasks requiring minimal competence.' },
    { heading: 'Routine (9)', text: 'Average difficulty for trained individuals.' },
    { heading: 'Challenging (12)', text: 'Requires real skill and effort.' },
    { heading: 'Hard (15)', text: 'Difficult even for experts.' },
    { heading: 'Very Hard (18)', text: 'Extraordinary achievement.' },
    { heading: 'Heroic (21)', text: 'Nearly impossible, legendary feats.' },
  ]},
  { title: 'Combat', sections: [
    { heading: 'Initiative', text: 'Agility test (with Quickness bonus). Highest acts first.' },
    { heading: 'Attack', text: 'Fighting test (or Marksmanship) vs. opponent\'s Combat Defense.' },
    { heading: 'Combat Defense', text: 'Agility + Athletics + Awareness + modifiers (armor penalty, shield bonus).' },
    { heading: 'Damage', text: 'Weapon damage (based on Athletics) minus target\'s Armor Rating (AR). Apply remainder to Health.' },
    { heading: 'Degrees of Success', text: 'For every 5 points above the target\'s defense, gain +1 bonus damage die.' },
  ]},
  { title: 'Intrigue', sections: [
    { heading: 'Intrigue Defense', text: 'Awareness + Cunning + Status.' },
    { heading: 'Composure', text: 'Will x 3. When reduced to 0, you are defeated in the social encounter.' },
    { heading: 'Influence', text: 'Persuasion test vs. target\'s Intrigue Defense to deal composure damage.' },
    { heading: 'Disposition', text: 'Target\'s attitude affects difficulty: Affectionate (-3), Friendly (-2), Amiable (-1), Indifferent (0), Dislike (+1), Unfriendly (+2), Malicious (+3).' },
  ]},
  { title: 'Injuries & Wounds', sections: [
    { heading: 'Health', text: 'Endurance x 3. When reduced to 0, character is defeated/dying.' },
    { heading: 'Injuries', text: 'When you take damage equal to or exceeding your Endurance in a single hit, you suffer an Injury (-1D to all tests).' },
    { heading: 'Wounds', text: 'When at 0 Health, you suffer a Wound. Each wound is -1D to all tests and requires extended healing.' },
    { heading: 'Recovery', text: 'Healing test (Difficulty 9+) to treat injuries. Rest recovers Endurance per day of rest.' },
  ]},
  { title: 'Experience', sections: [
    { heading: 'Earning', text: 'GM awards Experience Points (usually 1-6 per session).' },
    { heading: 'Raising Abilities', text: 'Cost = new rank x 30 experience.' },
    { heading: 'New Specialty', text: 'Cost = 10 experience to gain a new specialty at 1B.' },
    { heading: 'Raising Specialty', text: 'Cost = new bonus x 10 experience.' },
    { heading: 'New Benefit', text: 'Cost = 1 Destiny Point invested permanently.' },
  ]},
]

function parseJson(str, fallback) { try { return JSON.parse(str) || fallback } catch { return fallback } }

export default function AsoiafForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()
  const [searchParams] = useSearchParams()
  const viewMode = searchParams.get('mode') === 'view'
  const characterId = paramId || null

  useEffect(() => { switchTheme('asoiaf') }, [])

  const { isAutoCreating } = useAutoCreate(characterId, INITIAL)

  const [tab, setTab] = useState(0)
  const [fields, setFields] = useState(INITIAL)
  const [xpLog, setXpLog] = useState([])
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [actionError, setActionError] = useState(null)

  // Dice roller state
  const [diceTestDice, setDiceTestDice] = useState(3)
  const [diceBonusDice, setDiceBonusDice] = useState(0)
  const [diceDifficulty, setDiceDifficulty] = useState(9)
  const [diceResult, setDiceResult] = useState(null)
  const [diceHistory, setDiceHistory] = useState([])

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
  function handleNumber(e) { setFields(prev => ({ ...prev, [e.target.name]: Number(e.target.value) || 0 })) }

  async function handleSave() {
    setSaving(true); setSaveError(null)
    try { await updateCharacter(characterId, fields) }
    catch { setSaveError(t('failedToSave')) }
    finally { setSaving(false) }
  }

  async function handleDoneEditing() { await handleSave(); navigate('/asoiaf') }

  // ── Derived stats ──
  const combatDefense = fields.asoiafAgility + fields.asoiafAthletics + fields.asoiafAwareness
  const health = fields.asoiafEndurance * 3
  const composure = fields.asoiafWill * 3
  const intrigueDefense = fields.asoiafAwareness + fields.asoiafCunning + fields.asoiafStatusAbility

  // ── Specialties ──
  const specialties = parseJson(fields.asoiafSpecialties, [])
  function setSpecialties(next) { handleField('asoiafSpecialties', JSON.stringify(next)) }
  function getSpecialtyBonus(ability, specialty) {
    const s = specialties.find(sp => sp.ability === ability && sp.specialty === specialty)
    return s ? s.bonus : 0
  }
  function setSpecialtyBonus(ability, specialty, bonus) {
    const idx = specialties.findIndex(sp => sp.ability === ability && sp.specialty === specialty)
    if (idx >= 0) {
      const next = [...specialties]
      if (bonus === 0) { next.splice(idx, 1) } else { next[idx] = { ...next[idx], bonus } }
      setSpecialties(next)
    } else if (bonus > 0) {
      setSpecialties([...specialties, { ability, specialty, bonus }])
    }
  }

  // ── Benefits ──
  const benefits = parseJson(fields.asoiafBenefits, [])
  function setBenefits(next) { handleField('asoiafBenefits', JSON.stringify(next)) }

  // ── Drawbacks ──
  const drawbacks = parseJson(fields.asoiafDrawbacks, [])
  function setDrawbacks(next) { handleField('asoiafDrawbacks', JSON.stringify(next)) }

  // ── Weapons ──
  const weapons = parseJson(fields.asoiafWeapons, [])
  function setWeapons(next) { handleField('asoiafWeapons', JSON.stringify(next)) }

  // ── Armor ──
  const armorList = parseJson(fields.asoiafArmor, [])
  function setArmorList(next) { handleField('asoiafArmor', JSON.stringify(next)) }

  // ── Injuries ──
  const injuries = parseJson(fields.asoiafInjuries, [])
  function setInjuries(next) { handleField('asoiafInjuries', JSON.stringify(next)) }
  const [newInjury, setNewInjury] = useState('')

  // ── Inventory ──
  const inventory = parseJson(fields.asoiafInventory, [])
  function setInventory(next) { handleField('asoiafInventory', JSON.stringify(next)) }
  const [newItem, setNewItem] = useState('')

  // ── House ──
  const houseData = parseJson(fields.asoiafHouseData, { name: '', motto: '', holdings: '', resources: {} })
  function setHouseData(next) { handleField('asoiafHouseData', JSON.stringify(next)) }

  // ── Intrigue disposition ──
  const [disposition, setDisposition] = useState('Indifferent')

  // ── Dice Roller ──
  function rollD6Pool() {
    const totalDice = diceTestDice + diceBonusDice
    const rolls = []
    for (let i = 0; i < totalDice; i++) rolls.push(Math.floor(Math.random() * 6) + 1)
    rolls.sort((a, b) => b - a)
    const kept = rolls.slice(0, diceTestDice)
    const sum = kept.reduce((s, r) => s + r, 0)
    const success = sum >= diceDifficulty
    const entry = {
      totalDice, testDice: diceTestDice, bonusDice: diceBonusDice,
      rolls, kept, sum, difficulty: diceDifficulty, success,
      time: new Date().toLocaleTimeString(),
    }
    setDiceResult(entry)
    setDiceHistory(prev => [entry, ...prev].slice(0, 10))
  }

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/asoiaf')}>{t('back')}</button>
        <h2>{fields.name || 'ASOIAF Character'}</h2>
        <span className="splat-badge">ASOIAF</span>
      </div>

      {saveError && <p className="status-error" role="alert">{saveError}</p>}
      {actionError && <p className="status-error" role="alert">{actionError}</p>}

      <div className="tab-list" role="tablist">
        {TAB_KEYS.map((tk, i) => (
          <button key={tk} role="tab" id={`tab-${tk}`} className={`btn btn-secondary${tab === i ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(i)} aria-selected={tab === i}>{t(tk)}</button>
        ))}
      </div>

      {/* ── Tab 0: Identity ── */}
      <div hidden={tab !== 0} role="tabpanel" id="panel-tabAsoiafIdentity" aria-labelledby="tab-tabAsoiafIdentity">
        <div className="form-section">
          <fieldset>
            <legend>{t('tabAsoiafIdentity')}</legend>
            <div className="field-row">
              <div className="field"><label htmlFor="asoiaf-name">{t('charName')} *</label><input id="asoiaf-name" name="name" value={fields.name} onChange={handleText} /></div>
              <div className="field"><label htmlFor="asoiaf-house">House</label><input id="asoiaf-house" name="asoiafHouse" value={fields.asoiafHouse} onChange={handleText} placeholder="e.g. Stark, Lannister..." /></div>
            </div>
            <div className="field-row">
              <CatalogSelect id="asoiafAge" name="asoiafAge" label="Age Category" value={fields.asoiafAge}
                onChange={handleField} catalog={ASOIAF_AGE_CATALOG} />
              <div className="field"><label htmlFor="asoiaf-role">Role</label><input id="asoiaf-role" name="asoiafRole" value={fields.asoiafRole} onChange={handleText} placeholder="e.g. Knight, Maester, Lord..." /></div>
            </div>
            <div className="field">
              <label>{t('concept')}</label>
              <input name="concept" value={fields.concept} onChange={handleText} placeholder="Character concept" />
            </div>
            <div className="field">
              <label>{t('appearanceLabel')}</label>
              <textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={4} style={{ width: '100%' }}
                placeholder="Describe your character's appearance..." />
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Tab 1: Abilities ── */}
      <div hidden={tab !== 1} role="tabpanel" id="panel-tabAsoiafAbilities" aria-labelledby="tab-tabAsoiafAbilities">
        <div className="form-section">
          <fieldset>
            <legend>Derived Stats</legend>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-sm)' }}>
              <div style={{ padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                <strong>Combat Defense:</strong> {combatDefense}
              </div>
              <div style={{ padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                <strong>Health:</strong> {health}
              </div>
              <div style={{ padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                <strong>Composure:</strong> {composure}
              </div>
              <div style={{ padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                <strong>Intrigue Defense:</strong> {intrigueDefense}
              </div>
            </div>
          </fieldset>
          {ASOIAF_ABILITIES.map(ability => (
            <fieldset key={ability.key}>
              <legend>{ability.label}</legend>
              <DotRating label={ability.label} name={ability.key} value={fields[ability.key]} onChange={handleField} min={1} max={7} />
              {ability.specialties && ability.specialties.length > 0 && (
                <div style={{ marginTop: 'var(--space-xs)', paddingLeft: 'var(--space-md)' }}>
                  {ability.specialties.map(spec => {
                    const bonus = getSpecialtyBonus(ability.key, spec)
                    return (
                      <div key={spec} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: '2px 0' }}>
                        <input type="checkbox" checked={bonus > 0}
                          onChange={e => setSpecialtyBonus(ability.key, spec, e.target.checked ? 1 : 0)} />
                        <span style={{ flex: 1, fontSize: '0.85rem' }}>{spec}</span>
                        {bonus > 0 && (
                          <input type="number" min={1} max={5} value={bonus}
                            onChange={e => setSpecialtyBonus(ability.key, spec, Number(e.target.value) || 0)}
                            style={{ width: '50px', textAlign: 'center', fontSize: '0.8rem' }} />
                        )}
                        {bonus > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>B</span>}
                      </div>
                    )
                  })}
                </div>
              )}
            </fieldset>
          ))}
        </div>
      </div>

      {/* ── Tab 2: Destiny & Benefits ── */}
      <div hidden={tab !== 2} role="tabpanel" id="panel-tabAsoiafDestiny" aria-labelledby="tab-tabAsoiafDestiny">
        <div className="form-section">
          <fieldset>
            <legend>Destiny Points</legend>
            <div className="field" style={{ maxWidth: '200px' }}>
              <label htmlFor="asoiaf-destiny">Current Destiny Points</label>
              <input id="asoiaf-destiny" type="number" name="asoiafDestinyPoints" min={0} max={10}
                value={fields.asoiafDestinyPoints} onChange={handleNumber} style={{ textAlign: 'center' }} />
            </div>
          </fieldset>
          <fieldset>
            <legend>Benefits</legend>
            <CatalogSelect id="asoiafBenefitAdd" name="asoiafBenefitAdd" label="Add Benefit"
              value="" onChange={(_, val) => {
                if (!val) return
                const item = ASOIAF_BENEFITS.find(b => b.name === val)
                if (item && !benefits.find(b => b.name === item.name)) {
                  setBenefits([...benefits, { name: item.name, description: item.description }])
                }
              }} catalog={ASOIAF_BENEFIT_CATALOG} showDescOnSelect={false} />
            {benefits.length > 0 && (
              <div style={{ marginTop: 'var(--space-md)' }}>
                {benefits.map((b, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: '0.85rem' }}>
                      <strong>{b.name}</strong>
                      <span className="muted-hint muted-hint--xs"> {b.description}</span>
                    </span>
                    <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                      onClick={() => setBenefits(benefits.filter((_, j) => j !== i))}>Remove</button>
                  </div>
                ))}
              </div>
            )}
          </fieldset>
        </div>
      </div>

      {/* ── Tab 3: Drawbacks ── */}
      <div hidden={tab !== 3} role="tabpanel" id="panel-tabAsoiafDrawbacks" aria-labelledby="tab-tabAsoiafDrawbacks">
        <div className="form-section">
          <fieldset>
            <legend>Drawbacks</legend>
            <CatalogSelect id="asoiafDrawbackAdd" name="asoiafDrawbackAdd" label="Add Drawback"
              value="" onChange={(_, val) => {
                if (!val) return
                const item = ASOIAF_DRAWBACKS.find(d => d.name === val)
                if (item && !drawbacks.find(d => d.name === item.name)) {
                  setDrawbacks([...drawbacks, { name: item.name, description: item.description }])
                }
              }} catalog={ASOIAF_DRAWBACK_CATALOG} showDescOnSelect={false} />
            {drawbacks.length > 0 && (
              <div style={{ marginTop: 'var(--space-md)' }}>
                {drawbacks.map((d, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: '0.85rem' }}>
                      <strong>{d.name}</strong>
                      <span className="muted-hint muted-hint--xs"> {d.description}</span>
                    </span>
                    <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                      onClick={() => setDrawbacks(drawbacks.filter((_, j) => j !== i))}>Remove</button>
                  </div>
                ))}
              </div>
            )}
          </fieldset>
        </div>
      </div>

      {/* ── Tab 4: Combat ── */}
      <div hidden={tab !== 4} role="tabpanel" id="panel-tabAsoiafCombat" aria-labelledby="tab-tabAsoiafCombat">
        <div className="form-section">
          <fieldset>
            <legend>Health Tracker</legend>
            <div className="field-row">
              <div className="field" style={{ textAlign: 'center' }}>
                <label>Maximum Health</label>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-accent-fg)' }}>{health}</div>
                <span className="muted-hint muted-hint--xs">Endurance ({fields.asoiafEndurance}) x 3</span>
              </div>
              <div className="field" style={{ textAlign: 'center' }}>
                <label htmlFor="asoiaf-health-current">Current Health</label>
                <input id="asoiaf-health-current" type="number" name="asoiafHealthCurrent" min={0} max={health}
                  value={fields.asoiafHealthCurrent} onChange={handleNumber} style={{ width: '80px', textAlign: 'center' }} />
              </div>
              <div className="field" style={{ textAlign: 'center' }}>
                <label>Combat Defense</label>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{combatDefense}</div>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Weapons</legend>
            <CatalogSelect id="asoiafWeaponAdd" name="asoiafWeaponAdd" label="Add Weapon"
              value="" onChange={(_, val) => {
                if (!val) return
                const item = ASOIAF_WEAPONS.find(w => w.name === val)
                if (item) setWeapons([...weapons, { name: item.name, training: item.training, damage: item.damage, qualities: item.qualities }])
              }} catalog={ASOIAF_WEAPON_CATALOG} showDescOnSelect={false} />
            {weapons.length > 0 && (
              <div style={{ marginTop: 'var(--space-md)', overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                      <th style={{ padding: '0.4rem' }}>Weapon</th>
                      <th style={{ padding: '0.4rem' }}>Training</th>
                      <th style={{ padding: '0.4rem' }}>Damage</th>
                      <th style={{ padding: '0.4rem' }}>Qualities</th>
                      <th style={{ padding: '0.4rem' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {weapons.map((w, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '0.4rem', fontWeight: 600 }}>{w.name}</td>
                        <td style={{ padding: '0.4rem' }}>{w.training}</td>
                        <td style={{ padding: '0.4rem', color: 'var(--color-accent-fg)' }}>{w.damage}</td>
                        <td style={{ padding: '0.4rem' }}>{Array.isArray(w.qualities) ? w.qualities.join(', ') : (w.qualities || '-')}</td>
                        <td style={{ padding: '0.4rem' }}>
                          <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                            onClick={() => setWeapons(weapons.filter((_, j) => j !== i))}>Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </fieldset>

          <fieldset>
            <legend>Armor</legend>
            <CatalogSelect id="asoiafArmorAdd" name="asoiafArmorAdd" label="Add Armor"
              value="" onChange={(_, val) => {
                if (!val) return
                const item = ASOIAF_ARMOR.find(a => a.name === val)
                if (item) setArmorList([...armorList, { name: item.name, ar: item.ar, ap: item.ap, bulk: item.bulk }])
              }} catalog={ASOIAF_ARMOR_CATALOG} showDescOnSelect={false} />
            {armorList.length > 0 && (
              <div style={{ marginTop: 'var(--space-sm)' }}>
                {armorList.map((a, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: '0.85rem' }}>
                      <strong>{a.name}</strong>
                      <span className="muted-hint muted-hint--xs"> AR {a.ar} | AP {a.ap} | Bulk {a.bulk}</span>
                    </span>
                    <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                      onClick={() => setArmorList(armorList.filter((_, j) => j !== i))}>Remove</button>
                  </div>
                ))}
              </div>
            )}
          </fieldset>

          <fieldset>
            <legend>Injuries</legend>
            {injuries.map((inj, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '0.85rem' }}>{inj}</span>
                <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                  onClick={() => setInjuries(injuries.filter((_, j) => j !== i))}>Remove</button>
              </div>
            ))}
            <div className="field-row" style={{ marginTop: 'var(--space-sm)' }}>
              <div className="field" style={{ flex: 1 }}>
                <input type="text" value={newInjury} onChange={e => setNewInjury(e.target.value)}
                  placeholder="Describe injury..." onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (newInjury.trim()) { setInjuries([...injuries, newInjury.trim()]); setNewInjury('') } } }} />
              </div>
              <button className="btn btn-secondary" onClick={() => { if (newInjury.trim()) { setInjuries([...injuries, newInjury.trim()]); setNewInjury('') } }}>Add Injury</button>
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Tab 5: Intrigue ── */}
      <div hidden={tab !== 5} role="tabpanel" id="panel-tabAsoiafIntrigue" aria-labelledby="tab-tabAsoiafIntrigue">
        <div className="form-section">
          <fieldset>
            <legend>Composure Tracker</legend>
            <div className="field-row">
              <div className="field" style={{ textAlign: 'center' }}>
                <label>Maximum Composure</label>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-accent-fg)' }}>{composure}</div>
                <span className="muted-hint muted-hint--xs">Will ({fields.asoiafWill}) x 3</span>
              </div>
              <div className="field" style={{ textAlign: 'center' }}>
                <label htmlFor="asoiaf-composure-current">Current Composure</label>
                <input id="asoiaf-composure-current" type="number" name="asoiafComposureCurrent" min={0} max={composure}
                  value={fields.asoiafComposureCurrent} onChange={handleNumber} style={{ width: '80px', textAlign: 'center' }} />
              </div>
              <div className="field" style={{ textAlign: 'center' }}>
                <label>Intrigue Defense</label>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{intrigueDefense}</div>
                <span className="muted-hint muted-hint--xs">Awareness + Cunning + Status</span>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Disposition</legend>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
              {DISPOSITIONS.map(d => (
                <label key={d} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', background: disposition === d ? 'var(--color-accent-fg)' : undefined, color: disposition === d ? '#fff' : undefined }}>
                  <input type="radio" name="disposition" value={d} checked={disposition === d}
                    onChange={() => setDisposition(d)} style={{ display: 'none' }} />
                  {d}
                </label>
              ))}
            </div>
            <p className="muted-hint muted-hint--xs" style={{ marginTop: 'var(--space-sm)' }}>
              Disposition modifier to Intrigue Defense: Affectionate (-3), Friendly (-2), Amiable (-1), Indifferent (0), Dislike (+1), Unfriendly (+2), Malicious (+3)
            </p>
          </fieldset>
        </div>
      </div>

      {/* ── Tab 6: Equipment & Wealth ── */}
      <div hidden={tab !== 6} role="tabpanel" id="panel-tabAsoiafEquipment" aria-labelledby="tab-tabAsoiafEquipment">
        <div className="form-section">
          <fieldset>
            <legend>Wealth</legend>
            <div className="field-row">
              <div className="field" style={{ textAlign: 'center' }}>
                <label htmlFor="asoiaf-gold">Gold Dragons</label>
                <input id="asoiaf-gold" type="number" name="asoiafGoldDragons" min={0}
                  value={fields.asoiafGoldDragons} onChange={handleNumber} style={{ width: '100px', textAlign: 'center' }} />
              </div>
              <div className="field" style={{ textAlign: 'center' }}>
                <label htmlFor="asoiaf-silver">Silver Stags</label>
                <input id="asoiaf-silver" type="number" name="asoiafSilverStags" min={0}
                  value={fields.asoiafSilverStags} onChange={handleNumber} style={{ width: '100px', textAlign: 'center' }} />
              </div>
              <div className="field" style={{ textAlign: 'center' }}>
                <label htmlFor="asoiaf-copper">Copper Pennies</label>
                <input id="asoiaf-copper" type="number" name="asoiafCopperPennies" min={0}
                  value={fields.asoiafCopperPennies} onChange={handleNumber} style={{ width: '100px', textAlign: 'center' }} />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Inventory</legend>
            {inventory.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '0.85rem' }}>{item}</span>
                <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                  onClick={() => setInventory(inventory.filter((_, j) => j !== i))}>Remove</button>
              </div>
            ))}
            <div className="field-row" style={{ marginTop: 'var(--space-sm)' }}>
              <div className="field" style={{ flex: 1 }}>
                <input type="text" value={newItem} onChange={e => setNewItem(e.target.value)}
                  placeholder="Add item..." onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (newItem.trim()) { setInventory([...inventory, newItem.trim()]); setNewItem('') } } }} />
              </div>
              <button className="btn btn-secondary" onClick={() => { if (newItem.trim()) { setInventory([...inventory, newItem.trim()]); setNewItem('') } }}>Add Item</button>
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Tab 7: House ── */}
      <div hidden={tab !== 7} role="tabpanel" id="panel-tabAsoiafHouse" aria-labelledby="tab-tabAsoiafHouse">
        <div className="form-section">
          <fieldset>
            <legend>House Information</legend>
            <div className="field-row">
              <div className="field" style={{ flex: 1 }}>
                <label htmlFor="house-name">House Name</label>
                <input id="house-name" type="text" value={houseData.name || ''}
                  onChange={e => setHouseData({ ...houseData, name: e.target.value })} placeholder="e.g. House Stark" />
              </div>
              <div className="field" style={{ flex: 1 }}>
                <label htmlFor="house-motto">Motto / Words</label>
                <input id="house-motto" type="text" value={houseData.motto || ''}
                  onChange={e => setHouseData({ ...houseData, motto: e.target.value })} placeholder="e.g. Winter Is Coming" />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>House Resources (0-70)</legend>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-sm)' }}>
              {ASOIAF_HOUSE_RESOURCES.map(res => (
                <div key={res.key} className="field" style={{ textAlign: 'center' }}>
                  <label>{res.label}</label>
                  <input type="number" min={0} max={70}
                    value={(houseData.resources && houseData.resources[res.key]) || 0}
                    onChange={e => setHouseData({ ...houseData, resources: { ...houseData.resources, [res.key]: Number(e.target.value) || 0 } })}
                    style={{ width: '80px', textAlign: 'center' }} />
                  <span className="muted-hint muted-hint--xs">{res.description}</span>
                </div>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Holdings</legend>
            <textarea value={houseData.holdings || ''} onChange={e => setHouseData({ ...houseData, holdings: e.target.value })}
              rows={4} style={{ width: '100%' }} placeholder="Describe your house's castles, lands, and holdings..." />
          </fieldset>
        </div>
      </div>

      {/* ── Tab 8: Backstory ── */}
      <div hidden={tab !== 8} role="tabpanel" id="panel-tabBackstory" aria-labelledby="tab-tabBackstory">
        <div className="form-section">
          <fieldset>
            <legend>{t('backstoryLabel')}</legend>
            <textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} style={{ width: '100%' }}
              placeholder="Your character's backstory..." />
          </fieldset>
          <fieldset>
            <legend>{t('notes')}</legend>
            <textarea name="notes" value={fields.notes} onChange={handleText} rows={4} style={{ width: '100%' }}
              placeholder="Session notes, house politics, etc..." />
          </fieldset>
        </div>
      </div>

      {/* ── Tab 9: XP Log ── */}
      <div hidden={tab !== 9} role="tabpanel" id="panel-tabXpLog" aria-labelledby="tab-tabXpLog">
        <XpLogSection splat="asoiaf" xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)} t={t} />
      </div>

      {/* ── Tab 10: Dice Roller ── */}
      <div hidden={tab !== 10} role="tabpanel" id="panel-tabDiceRoller" aria-labelledby="tab-tabDiceRoller">
        <div className="form-section">
          <fieldset>
            <legend>ASOIAF d6 Pool Roller</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
              Roll (Test Dice + Bonus Dice) d6, sort descending, keep Test Dice count, sum kept dice vs. Difficulty.
            </p>
            <div className="field-row">
              <div className="field">
                <label htmlFor="dice-test">Test Dice (Ability Rank)</label>
                <input id="dice-test" type="number" min={1} max={10} value={diceTestDice}
                  onChange={e => setDiceTestDice(Number(e.target.value) || 1)} style={{ width: '70px', textAlign: 'center' }} />
              </div>
              <div className="field">
                <label htmlFor="dice-bonus">Bonus Dice (Specialty)</label>
                <input id="dice-bonus" type="number" min={0} max={10} value={diceBonusDice}
                  onChange={e => setDiceBonusDice(Number(e.target.value) || 0)} style={{ width: '70px', textAlign: 'center' }} />
              </div>
              <div className="field">
                <label htmlFor="dice-diff">Difficulty</label>
                <select id="dice-diff" value={diceDifficulty} onChange={e => setDiceDifficulty(Number(e.target.value))}>
                  {DIFFICULTIES.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
              <button className="btn btn-primary" style={{ alignSelf: 'flex-end' }} onClick={rollD6Pool}>Roll</button>
            </div>
            {diceResult && (
              <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', border: '2px solid var(--color-accent-fg)', borderRadius: '8px', background: 'rgba(52,152,219,0.08)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: diceResult.success ? '#2ecc71' : '#e55' }}>
                  {diceResult.sum} vs {diceResult.difficulty} — {diceResult.success ? 'SUCCESS' : 'FAILURE'}
                </div>
                <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                  All dice: [{diceResult.rolls.join(', ')}] | Kept: [{diceResult.kept.join(', ')}] = {diceResult.sum}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  {diceResult.testDice}D + {diceResult.bonusDice}B, keep {diceResult.testDice}
                </div>
              </div>
            )}
          </fieldset>

          <fieldset>
            <legend>Roll History</legend>
            {diceHistory.length === 0 && <p className="muted-hint">No rolls yet.</p>}
            {diceHistory.map((h, i) => (
              <div key={i} style={{ padding: '4px 0', borderBottom: '1px solid var(--color-border)', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>{h.time}</span>{' '}
                <span style={{ color: h.success ? '#2ecc71' : '#e55', fontWeight: 600 }}>{h.success ? 'SUCCESS' : 'FAIL'}</span>{' '}
                {h.sum} vs {h.difficulty} ({h.testDice}D+{h.bonusDice}B kept [{h.kept.join(',')}])
              </div>
            ))}
          </fieldset>
        </div>
      </div>

      {/* ── Tab 11: Rules Reference ── */}
      <div hidden={tab !== 11} role="tabpanel" id="panel-tabAsoiafRulesRef" aria-labelledby="tab-tabAsoiafRulesRef">
        <RulesReferenceTab rules={ASOIAF_RULES} title="A Song of Ice and Fire RPG Rules Reference" />
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => setShowExport(true)}>{t('exportPdf')}</button>
        <button className="btn btn-secondary" onClick={() => navigate('/asoiaf')}>{t('cancel')}</button>
        <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>{saving ? t('saving') : t('quickSave')}</button>
        <button className="btn btn-primary" onClick={handleDoneEditing} disabled={saving}>{t('doneEditing')}</button>
      </div>
      {viewMode && (
        <div className="view-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/asoiaf')}>{t('back')}</button>
          <button className="btn btn-primary" onClick={() => navigate(`/characters/${characterId}`, { replace: true })}>{t('edit')}</button>
        </div>
      )}
      <ExportModal open={showExport} onClose={() => setShowExport(false)} tabKeys={TAB_KEYS} t={t} />
    </div>
  )
}
