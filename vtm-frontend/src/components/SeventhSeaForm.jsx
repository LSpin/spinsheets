import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  getCharacter, updateCharacter,
  getBackgrounds, addBackground, removeBackground,
  getInventory,
  getXpLog, addXpLogEntry, removeXpLogEntry,
  getDisciplines, addDiscipline, removeDiscipline,
} from '../api/characterApi'
import useAutoCreate from '../hooks/useAutoCreate'
import InventorySection from './InventorySection'
import DotRating from './DotRating'
import XpLogSection from './XpLogSection'
import { useLanguage } from '../i18n/LanguageContext'
import TagInfoPanel from './TagInfoPanel'

const NATIONS = [
  'Avalon', 'Castille', 'Eisen', 'Inismore', 'Highland Marches', 'Montaigne',
  'Sarmatian Commonwealth', 'Ussura', 'Vestenmennavenjar', 'Vodacce',
  'Rahuri', 'Ifri', 'Crescent Empire', 'Aztlan', 'Other',
]

const ADVANTAGES = [
  { name: 'Academy', cost: 4, description: 'You attended a formal military academy.' },
  { name: 'Able Drinker', cost: 1, description: 'Alcohol has little effect on you.' },
  { name: 'An Honest Misunderstanding', cost: 1, description: 'You can replace Raises on social Risk with Raises from another Skill.' },
  { name: 'Bar Fighter', cost: 3, description: 'When you perform a Brawl attack, deal extra wounds equal to your Ranks.' },
  { name: 'Barterer', cost: 3, description: 'Spend a Hero Point to acquire an item through trade.' },
  { name: 'Boxer', cost: 4, description: 'Spend a Hero Point to add your Brawl to your damage.' },
  { name: 'Brush Pass', cost: 3, description: 'Spend a Hero Point to slip a small item to or from someone unnoticed.' },
  { name: 'Cast Iron Stomach', cost: 1, description: 'You eat anything without ill effect.' },
  { name: 'Come Hither', cost: 3, description: 'Spend a Hero Point to tempt a character into leaving with you.' },
  { name: 'Connection', cost: 3, description: 'You know people in a particular organisation or social group.' },
  { name: 'Courageous', cost: 2, description: 'Spend a Hero Point to automatically succeed on Fear rolls.' },
  { name: 'Direction Sense', cost: 1, description: 'You always know which way is north.' },
  { name: 'Disarming Smile', cost: 3, description: 'Spend a Hero Point to keep a character from attacking for one Round.' },
  { name: 'Duelist Academy', cost: 5, description: 'You have trained in a Dueling style, gaining access to special maneuvers.' },
  { name: 'Eagle Eyes', cost: 3, description: 'Spend a Hero Point to notice something important others miss.' },
  { name: 'Extended Family', cost: 1, description: 'You can find a relative in almost any community.' },
  { name: 'Fascinate', cost: 3, description: 'Spend a Hero Point to hold a group transfixed by performance.' },
  { name: 'Fencer', cost: 4, description: 'Spend a Hero Point to add Weaponry to damage.' },
  { name: 'Got It!', cost: 2, description: 'Spend a Hero Point to pick a lock or disable a trap without a Risk.' },
  { name: 'Hard to Kill', cost: 3, description: 'You gain extra Dramatic Wounds before becoming Helpless.' },
  { name: 'Indomitable Will', cost: 3, description: 'Spend a Hero Point to resist mental influence or torture.' },
  { name: 'Inspire Generosity', cost: 3, description: 'Spend a Hero Point to convince someone to give you something.' },
  { name: 'Jack of All Trades', cost: 2, description: 'Spend a Hero Point to gain 1 Rank in a Skill you have 0 Ranks in for one Risk.' },
  { name: 'Keen Senses', cost: 2, description: 'You can notice hidden details others miss.' },
  { name: 'Landsricht', cost: 2, description: 'You have the legal right to settle disputes among commoners.' },
  { name: 'Large', cost: 2, description: 'You are bigger than average, gaining benefits in physical contests.' },
  { name: 'Leadership', cost: 4, description: 'Spend a Hero Point to inspire and lead a group effectively.' },
  { name: 'Left-Handed', cost: 3, description: 'Your unexpected fighting style gives you an edge in combat.' },
  { name: 'Linguist', cost: 2, description: 'You speak, read, and write an additional language.' },
  { name: 'Lyceum', cost: 4, description: 'You attended a school of sorcery.' },
  { name: 'Married to the Sea', cost: 3, description: 'Spend a Hero Point to navigate through dangerous waters safely.' },
  { name: 'Masterpiece Crafter', cost: 5, description: 'Spend a Hero Point to craft an item of exceptional quality.' },
  { name: 'Miracle Worker', cost: 4, description: 'Spend a Hero Point to stabilize a dying character.' },
  { name: 'Opportunist', cost: 4, description: 'Spend a Hero Point to take an action outside your normal turn.' },
  { name: 'Patron', cost: 3, description: 'You have a wealthy patron who provides financial support.' },
  { name: 'Quick Reflexes', cost: 2, description: 'You act first in Action Sequences involving a specific Skill.' },
  { name: 'Rich', cost: 3, description: 'You begin each session with extra Wealth.' },
  { name: 'Rogue', cost: 4, description: 'Spend a Hero Point to add Theft to damage when making a sneak attack.' },
  { name: 'Sea Legs', cost: 2, description: 'You never suffer penalties from rough seas.' },
  { name: 'Sniper', cost: 4, description: 'Spend a Hero Point to add Aim to damage at range.' },
  { name: 'Sorcery', cost: 2, description: 'You have access to a sorcerous tradition.' },
  { name: 'Staredown', cost: 3, description: 'Spend a Hero Point to frighten a single target.' },
  { name: 'Survivalist', cost: 3, description: 'Spend a Hero Point to find food, water, and shelter in the wilderness.' },
  { name: 'Team Player', cost: 4, description: 'Spend a Hero Point to give your Raises to an ally.' },
  { name: 'Tenure', cost: 2, description: 'You hold a position at a university or similar institution.' },
  { name: 'Together We Are Strong', cost: 4, description: 'Spend a Hero Point and add your Ranks in a Skill to an ally\'s Risk.' },
  { name: 'Valiant Spirit', cost: 3, description: 'When facing a Villain, gain bonus dice.' },
  { name: 'Wily', cost: 3, description: 'Spend a Hero Point to escape bonds, grapples, or confinement.' },
]

const VIRTUES = [
  'The Road (Willingness)', 'The Moonless Night (Subtle)', 'The Magician (Temperate)',
  'Reunion (Triumphant)', 'The Thrones (Commanding)', 'The War (Victorious)',
  'The Beggar Prince (Insightful)', 'Coins (Adaptable)', 'The Hero (Courageous)',
  'The Prophet (Illuminating)',
]

const HUBRISES = [
  'The Fool (Reckless)', 'Moonlight (Indecisive)', 'The Magician (Ambitious)',
  'The Lovers (Star-Crossed)', 'The Wheel (Unfortunate)', 'The Hanged Man (Stubborn)',
  'Coins (Greedy)', 'The Tower (Arrogant)', 'The Devil (Trusting)', 'Swords (Loyal)',
]

const INITIAL = {
  npc: false, splat: 'SEVENTH_SEA',
  name: '', altName: '', concept: '',
  nation: '', religion: '',
  nature: '', // Background identity
  demeanor: '', // Membership identity
  // Traits
  traitBrawn: 2, traitFinesse: 2, traitResolve: 2, traitWits7s: 2, traitPanache: 2,
  // Skills
  skillAim: 0, skillAthletics7s: 0, skillBrawl7s: 0, skillConvince: 0,
  skillEmpathy7s: 0, skillHide: 0, skillIntimidate7s: 0, skillNotice: 0,
  skillPerform7s: 0, skillRide7s: 0, skillSailing: 0, skillScholarship: 0,
  skillTempt: 0, skillTheft: 0, skillWarfare: 0, skillWeaponry: 0,
  // Arcana
  heroVirtue: '', heroHubris: '',
  // Sorcery
  sorceryDesc: '',
  // Resources
  heroPoints: 0, wealth7s: 0, corruption: 0, dramaticWounds: 0,
  // Willpower
  willpower: 0, currentWillpower: 0,
  // Stories & Notes
  heroStories: '', backstory: '', notes: '', appearanceDesc: '',
}

const TAB_KEYS = ['tabIdentity', 'tab7sTraits', 'tab7sSkills', 'tab7sAdvantages', 'tab7sArcana', 'tab7sBackgrounds', 'tab7sStories', 'tabInventory', 'tabBackstory', 'tabXpLog']

const TRAITS = [
  { key: 'traitBrawn', label: '7sBrawn' },
  { key: 'traitFinesse', label: '7sFinesse' },
  { key: 'traitResolve', label: '7sResolve' },
  { key: 'traitWits7s', label: '7sWits' },
  { key: 'traitPanache', label: '7sPanache' },
]

const SKILLS = [
  { key: 'skillAim', label: '7sAim' },
  { key: 'skillAthletics7s', label: '7sAthletics' },
  { key: 'skillBrawl7s', label: '7sBrawl' },
  { key: 'skillConvince', label: '7sConvince' },
  { key: 'skillEmpathy7s', label: '7sEmpathy' },
  { key: 'skillHide', label: '7sHide' },
  { key: 'skillIntimidate7s', label: '7sIntimidate' },
  { key: 'skillNotice', label: '7sNotice' },
  { key: 'skillPerform7s', label: '7sPerform' },
  { key: 'skillRide7s', label: '7sRide' },
  { key: 'skillSailing', label: '7sSailing' },
  { key: 'skillScholarship', label: '7sScholarship' },
  { key: 'skillTempt', label: '7sTempt' },
  { key: 'skillTheft', label: '7sTheft' },
  { key: 'skillWarfare', label: '7sWarfare' },
  { key: 'skillWeaponry', label: '7sWeaponry' },
]

export default function SeventhSeaForm() {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const viewMode = searchParams.get('mode') === 'view'
  const characterId = paramId || null

  const { isAutoCreating } = useAutoCreate(characterId, INITIAL)

  const [tab, setTab] = useState(0)
  const [fields, setFields] = useState(INITIAL)
  const [backgrounds, setBackgrounds] = useState([])
  const [disciplines, setDisciplines] = useState([]) // used for Advantages
  const [inventory, setInventory] = useState([])
  const [xpLog, setXpLog] = useState([])
  const [newBackground, setNewBackground] = useState({ name: '', level: 1, description: '' })
  const [newAdv, setNewAdv] = useState({ name: '', level: 1, notes: '' })
  const [tagInfo, setTagInfo] = useState(null)
  const [loading, setLoading] = useState(!!characterId)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [actionError, setActionError] = useState(null)

  useEffect(() => {
    if (characterId) loadCharacter()
  }, [characterId])

  async function loadCharacter() {
    try {
      const [charRes, bgRes, discRes, invRes, xpRes] = await Promise.all([
        getCharacter(characterId), getBackgrounds(characterId), getDisciplines(characterId),
        getInventory(characterId), getXpLog(characterId),
      ])
      const data = charRes.data
      setFields(prev => {
        const merged = { ...prev }
        for (const key in prev) { if (data[key] !== undefined && data[key] !== null) merged[key] = data[key] }
        return merged
      })
      setBackgrounds(bgRes.data)
      setDisciplines(discRes.data)
      setInventory(invRes.data); setXpLog(xpRes.data)
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

  async function handleAddBackground() {
    if (!newBackground.name.trim()) return
    try {
      const res = await addBackground(characterId, newBackground)
      setBackgrounds(prev => [...prev, res.data])
      setNewBackground({ name: '', level: 1, description: '' })
    } catch { setActionError(t('failedToSave')) }
  }

  async function handleAddAdvantage() {
    if (!newAdv.name.trim()) return
    try {
      const res = await addDiscipline(characterId, newAdv)
      setDisciplines(prev => [...prev, res.data])
      setNewAdv({ name: '', level: 1, notes: '' })
    } catch { setActionError(t('failedToSave')) }
  }

  if (loading || isAutoCreating) return <p className="status-loading">{t('loading')}</p>

  return (
    <div className={viewMode ? 'form-view-mode' : ''}>
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/characters')}>{t('back')}</button>
        <h2>{fields.name || t('edit7sHero')}</h2>
        <span className="splat-badge splat-badge--seventh-sea">{t('seventhSea')}</span>
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
              <div className="field"><label>{t('charName')} *</label><input name="name" value={fields.name} onChange={handleText} /></div>
              <div className="field"><label>{t('concept')}</label><input name="concept" value={fields.concept} onChange={handleText} /></div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>{t('7sNation')}</label>
                <select name="nation" value={fields.nation} onChange={handleText}>
                  <option value="">{t('select')}</option>
                  {NATIONS.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="field"><label>{t('7sReligion')}</label><input name="religion" value={fields.religion} onChange={handleText} /></div>
            </div>
            <div className="field-row">
              <div className="field"><label>{t('7sBackground')}</label><input name="nature" value={fields.nature} onChange={handleText} /></div>
              <div className="field"><label>{t('7sMembership')}</label><input name="demeanor" value={fields.demeanor} onChange={handleText} /></div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>{t('type')}</label>
                <div className="role-toggle" role="radiogroup">
                  <button type="button" className={`role-toggle-btn${!fields.npc ? ' role-toggle-btn--active' : ''}`} onClick={() => handleField('npc', false)}>{t('pc')}</button>
                  <button type="button" className={`role-toggle-btn${fields.npc ? ' role-toggle-btn--active' : ''}`} onClick={() => handleField('npc', true)}>{t('npc')}</button>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Traits ── */}
      <div hidden={tab !== 1}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tab7sTraits')}</legend>
            <div className="rating-grid">
              {TRAITS.map(({ key, label }) => (
                <div key={key} className="ability-row">
                  <DotRating label={t(label)} name={key} value={fields[key]} onChange={handleField} min={1} max={5} />
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Skills ── */}
      <div hidden={tab !== 2}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tab7sSkills')}</legend>
            <div className="rating-grid">
              {SKILLS.map(({ key, label }) => (
                <div key={key} className="ability-row">
                  <DotRating label={t(label)} name={key} value={fields[key]} onChange={handleField} max={5} />
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Advantages ── */}
      <div hidden={tab !== 3}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tab7sAdvantages')}</legend>
            <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>{t('7sAdvantagesHint')}</p>
            {disciplines.length > 0 && (
              <ul className="tag-list">
                {disciplines.map(d => (
                  <li key={d.id} className={`tag tag--clickable${d.id === tagInfo?.id ? ' tag--active' : ''}`}
                    onClick={() => setTagInfo(ti => ti?.id === d.id ? null : { ...d, kind: 'advantage' })}>
                    <span>{d.name} ({t('7sCost')}: {d.level})</span>
                    <button className="tag-remove" onClick={e => { e.stopPropagation(); removeDiscipline(characterId, d.id); setDisciplines(prev => prev.filter(x => x.id !== d.id)); if (tagInfo?.id === d.id) setTagInfo(null) }}>x</button>
                  </li>
                ))}
              </ul>
            )}
            <div className="field-row" style={{ alignItems: 'flex-end' }}>
              <div className="field" style={{ flex: 2 }}>
                <label>{t('7sAdvantageName')}</label>
                <input type="text" list="seventh-sea-adv-catalog" value={newAdv.name} onChange={e => setNewAdv(p => ({ ...p, name: e.target.value }))} placeholder={t('7sPhAdvantage')} autoComplete="off" />
                <datalist id="seventh-sea-adv-catalog">
                  {ADVANTAGES.map(a => <option key={a.name} value={a.name} />)}
                </datalist>
              </div>
              <div className="field">
                <label>{t('7sCost')}</label>
                <select value={newAdv.level} onChange={e => setNewAdv(p => ({ ...p, level: parseInt(e.target.value) }))}>
                  {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <button className="btn btn-secondary" onClick={handleAddAdvantage}>{t('add')}</button>
            </div>
          </fieldset>
          {tagInfo?.kind === 'advantage' && (() => {
            const entry = ADVANTAGES.find(a => a.name.toLowerCase() === tagInfo.name.toLowerCase())
            return <TagInfoPanel entry={entry ? { name: entry.name, description: `${t('7sCost')}: ${entry.cost}. ${entry.description}` } : { name: tagInfo.name }} level={tagInfo.level} onClose={() => setTagInfo(null)} />
          })()}
        </div>
      </div>

      {/* ── Arcana & Resources ── */}
      <div hidden={tab !== 4}>
        <div className="form-section">
          <fieldset>
            <legend>{t('7sArcana')}</legend>
            <div className="field-row">
              <div className="field">
                <label>{t('7sVirtue')}</label>
                <select name="heroVirtue" value={fields.heroVirtue} onChange={handleText}>
                  <option value="">{t('select')}</option>
                  {VIRTUES.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="field">
                <label>{t('7sHubris')}</label>
                <select name="heroHubris" value={fields.heroHubris} onChange={handleText}>
                  <option value="">{t('select')}</option>
                  {HUBRISES.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('7sResources')}</legend>
            <div className="rating-grid">
              <div className="ability-row"><DotRating label={t('7sHeroPoints')} name="heroPoints" value={fields.heroPoints} onChange={handleField} min={0} max={3} /></div>
              <div className="ability-row"><DotRating label={t('7sWealth')} name="wealth7s" value={fields.wealth7s} onChange={handleField} min={0} max={5} /></div>
              <div className="ability-row"><DotRating label={t('7sCorruption')} name="corruption" value={fields.corruption} onChange={handleField} min={0} max={3} /></div>
              <div className="ability-row"><DotRating label={t('7sDramaticWounds')} name="dramaticWounds" value={fields.dramaticWounds} onChange={handleField} min={0} max={4} /></div>
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('7sSorcery')}</legend>
            <textarea name="sorceryDesc" value={fields.sorceryDesc} onChange={handleText} rows={4} style={{ width: '100%' }} placeholder={t('7sPhSorcery')} />
          </fieldset>
        </div>
      </div>

      {/* ── Backgrounds ── */}
      <div hidden={tab !== 5}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tab7sBackgrounds')}</legend>
            {backgrounds.length > 0 && (
              <ul className="tag-list">
                {backgrounds.map(b => (
                  <li key={b.id} className="tag-item" onClick={() => setTagInfo(ti => ti?.id === b.id ? null : { ...b, kind: 'background' })}>
                    <span>{b.name} ({b.level}){b.description ? ` — ${b.description}` : ''}</span>
                    <button className="tag-remove" onClick={e => { e.stopPropagation(); removeBackground(characterId, b.id); setBackgrounds(prev => prev.filter(x => x.id !== b.id)) }}>x</button>
                  </li>
                ))}
              </ul>
            )}
            <div className="field-row" style={{ alignItems: 'flex-end' }}>
              <div className="field" style={{ flex: 2 }}>
                <label>{t('background')}</label>
                <input type="text" value={newBackground.name} onChange={e => setNewBackground(p => ({ ...p, name: e.target.value }))} placeholder={t('7sPhBackground')} />
              </div>
              <div className="field"><label>{t('level')}</label>
                <select value={newBackground.level} onChange={e => setNewBackground(p => ({ ...p, level: parseInt(e.target.value) }))}>{[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}</select>
              </div>
              <div className="field"><label>{t('description')}</label><input type="text" value={newBackground.description} onChange={e => setNewBackground(p => ({ ...p, description: e.target.value }))} /></div>
              <button className="btn btn-secondary" onClick={handleAddBackground}>{t('add')}</button>
            </div>
          </fieldset>
          {tagInfo?.kind === 'background' && (
            <TagInfoPanel entry={{ name: tagInfo.name, description: tagInfo.description }} level={tagInfo.level} onClose={() => setTagInfo(null)} />
          )}
        </div>
      </div>

      {/* ── Stories ── */}
      <div hidden={tab !== 6}>
        <div className="form-section">
          <fieldset>
            <legend>{t('tab7sStories')}</legend>
            <textarea name="heroStories" value={fields.heroStories} onChange={handleText} rows={10} style={{ width: '100%' }} placeholder={t('7sPhStories')} />
          </fieldset>
        </div>
      </div>

      {/* ── Inventory ── */}
      <div hidden={tab !== 7}>
        <InventorySection characterId={characterId} inventory={inventory} setInventory={setInventory} personalItems={fields.personalItems} onPersonalItemsChange={handleText} />
      </div>

      {/* ── Backstory ── */}
      <div hidden={tab !== 8}>
        <div className="form-section">
          <fieldset><legend>{t('backstoryLabel')}</legend><textarea name="backstory" value={fields.backstory} onChange={handleText} rows={8} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('appearanceLabel')}</legend><textarea name="appearanceDesc" value={fields.appearanceDesc} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
          <fieldset><legend>{t('notes')}</legend><textarea name="notes" value={fields.notes} onChange={handleText} rows={4} style={{ width: '100%' }} /></fieldset>
        </div>
      </div>

      {/* ── XP Log ── */}
      <div hidden={tab !== 9}>
        <XpLogSection splat="seventh-sea" xpLog={xpLog}
          onAdd={async (entry) => { const res = await addXpLogEntry(characterId, entry); setXpLog(prev => [res.data, ...prev]) }}
          onRemove={async (id) => { await removeXpLogEntry(characterId, id); setXpLog(prev => prev.filter(e => e.id !== id)) }}
          onError={msg => setActionError(msg)} t={t} />
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
