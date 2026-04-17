import { useState, useEffect } from 'react'
import { COMMON_POOLS, SPLAT_POOLS, SPLAT_POOL_MAP } from '../data/dicePools'
import { useLanguage } from '../i18n/LanguageContext'

function poolTotal(components, fields) {
  return components.reduce((sum, key) => sum + (Number(fields[key]) || 0), 0)
}

export default function DicePoolsTab({ fields, splat, characterId }) {
  const { t } = useLanguage()
  const splatKey = SPLAT_POOL_MAP[splat] || null
  const splatData = splatKey ? SPLAT_POOLS[splatKey] : null

  // Custom pools stored in localStorage
  const storageKey = `dicePools_${characterId}`
  const [customPools, setCustomPools] = useState([])
  const [newPool, setNewPool] = useState({ name: '', comp1: '', comp2: '', notes: '' })
  const [filter, setFilter] = useState('')

  useEffect(() => {
    if (!characterId) return
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) setCustomPools(JSON.parse(saved))
    } catch {}
  }, [characterId])

  function saveCustomPools(pools) {
    setCustomPools(pools)
    try { localStorage.setItem(storageKey, JSON.stringify(pools)) } catch {}
  }

  function addCustomPool() {
    if (!newPool.name.trim() || !newPool.comp1) return
    const components = [newPool.comp1]
    if (newPool.comp2) components.push(newPool.comp2)
    const pool = { name: newPool.name, components, notes: newPool.notes, custom: true }
    saveCustomPools([...customPools, pool])
    setNewPool({ name: '', comp1: '', comp2: '', notes: '' })
  }

  function removeCustomPool(idx) {
    saveCustomPools(customPools.filter((_, i) => i !== idx))
  }

  // All available stat fields for the custom pool builder
  const STAT_OPTIONS = [
    { group: t('physicalAttr'), options: [
      { value: 'strength', label: t('strength') },
      { value: 'dexterity', label: t('dexterity') },
      { value: 'stamina', label: t('stamina') },
    ]},
    { group: t('socialAttr'), options: [
      { value: 'charisma', label: t('charisma') },
      { value: 'manipulation', label: t('manipulation') },
      { value: 'appearance', label: t('appearance') },
    ]},
    { group: t('mentalAttr'), options: [
      { value: 'perception', label: t('perception') },
      { value: 'intelligence', label: t('intelligence') },
      { value: 'wits', label: t('wits') },
    ]},
    { group: t('talents'), options: [
      { value: 'alertness', label: t('alertness') },
      { value: 'athletics', label: t('athletics') },
      { value: 'awareness', label: t('awareness') },
      { value: 'brawl', label: t('brawl') },
      { value: 'dodge', label: t('dodge') },
      { value: 'empathy', label: t('empathy') },
      { value: 'expression', label: t('expression') },
      { value: 'intimidation', label: t('intimidation') },
      { value: 'leadership', label: t('leadership') },
      { value: 'streetwise', label: t('streetwise') },
      { value: 'subterfuge', label: t('subterfuge') },
    ]},
    { group: t('skills'), options: [
      { value: 'animalKen', label: t('animalKen') },
      { value: 'crafts', label: t('crafts') },
      { value: 'drive', label: t('drive') },
      { value: 'etiquette', label: t('etiquette') },
      { value: 'firearms', label: t('firearms') },
      { value: 'martialArts', label: t('martialArts') },
      { value: 'meditation', label: t('meditation') },
      { value: 'melee', label: t('melee') },
      { value: 'performance', label: t('performance') },
      { value: 'ride', label: t('ride') },
      { value: 'stealth', label: t('stealth') },
      { value: 'survival', label: t('survival') },
      { value: 'technology', label: t('technology') },
    ]},
    { group: t('knowledges'), options: [
      { value: 'academics', label: t('academics') },
      { value: 'computer', label: t('computer') },
      { value: 'cosmology', label: t('cosmology') },
      { value: 'enigmas', label: t('enigmas') },
      { value: 'investigation', label: t('investigation') },
      { value: 'law', label: t('law') },
      { value: 'medicine', label: t('medicine') },
      { value: 'occult', label: t('occult') },
      { value: 'politics', label: t('politics') },
      { value: 'science', label: t('science') },
    ]},
    { group: t('other'), options: [
      { value: 'willpower', label: t('willpower') },
      { value: 'conscience', label: t('conscience') },
      { value: 'selfControl', label: t('selfControl') },
      { value: 'courage', label: t('courage') },
      { value: 'rage', label: t('rage') },
      { value: 'gnosis', label: t('gnosis') },
      { value: 'arete', label: t('areteLabel') },
      { value: 'dharmaRating', label: t('dharmaRating') },
      { value: 'hun', label: 'Hun' },
      { value: 'po', label: "P'o" },
      { value: 'yinChi', label: 'Yin Chi' },
      { value: 'yangChi', label: 'Yang Chi' },
      { value: 'demonChi', label: 'Demon Chi' },
    ]},
  ]

  const categoryLabels = {
    combat: t('dpCombat'),
    social: t('dpSocial'),
    mental: t('dpMentalPerception'),
  }

  function matchesFilter(pool) {
    if (!filter) return true
    const q = filter.toLowerCase()
    return pool.name.toLowerCase().includes(q) ||
      (pool.description || '').toLowerCase().includes(q) ||
      pool.components.some(c => (t(c) || c).toLowerCase().includes(q))
  }

  function PoolRow({ pool, onRemove }) {
    const total = poolTotal(pool.components, fields)
    const compLabels = pool.components.map(c => {
      const val = Number(fields[c]) || 0
      const label = t(c) || c
      return { label, val }
    })
    return (
      <tr className={total === 0 ? 'dice-pool-row--zero' : ''}>
        <td className="dice-pool-name">
          {pool.name}
          {pool.custom && onRemove && (
            <button className="btn btn-danger btn-sm" style={{ marginLeft: '0.4rem', padding: '0 0.3rem', fontSize: '0.7rem' }}
              onClick={onRemove}>×</button>
          )}
        </td>
        <td className="dice-pool-components">
          {compLabels.length > 0
            ? compLabels.map((c, i) => (
                <span key={i}>
                  {i > 0 && ' + '}
                  <span className="dice-pool-stat">{c.label}</span>
                  <span className="dice-pool-val"> ({c.val})</span>
                </span>
              ))
            : <span className="dice-pool-special">—</span>
          }
        </td>
        <td className="dice-pool-total">
          {pool.components.length > 0 ? <strong>{total}</strong> : '—'}
        </td>
        <td className="dice-pool-diff">
          {pool.difficulty || '—'}
        </td>
        <td className="dice-pool-damage">{pool.damage || '—'}</td>
        <td className="dice-pool-desc">{pool.description || pool.notes || ''}</td>
      </tr>
    )
  }

  function PoolTable({ title, pools, showRemove }) {
    const filtered = pools.filter(matchesFilter)
    if (filtered.length === 0) return null
    return (
      <fieldset>
        <legend>{title} ({filtered.length})</legend>
        <div style={{ overflowX: 'auto' }}>
          <table className="dice-pool-table">
            <thead>
              <tr>
                <th>{t('dpPool')}</th>
                <th>{t('dpComponents')}</th>
                <th>{t('dpTotal')}</th>
                <th>{t('dpDiff')}</th>
                <th>{t('dpDamage')}</th>
                <th>{t('dpNotes')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <PoolRow key={p.name + i} pool={p}
                  onRemove={showRemove ? () => removeCustomPool(i) : undefined} />
              ))}
            </tbody>
          </table>
        </div>
      </fieldset>
    )
  }

  return (
    <div className="form-section">
      <fieldset>
        <legend>{t('tabDicePools')}</legend>
        <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
          {t('dpHint')}
        </p>
        <div className="catalog-search-wrap" style={{ marginBottom: 'var(--space-md)' }}>
          <input type="search" value={filter} onChange={e => setFilter(e.target.value)}
            placeholder={t('dpSearch')} aria-label={t('dpSearch')} />
        </div>
      </fieldset>

      {/* Common pools by category */}
      {COMMON_POOLS.map(cat => (
        <PoolTable key={cat.category} title={categoryLabels[cat.category] || cat.category} pools={cat.pools} />
      ))}

      {/* Splat-specific pools */}
      {splatData && (
        <PoolTable title={splatData.label} pools={splatData.pools} />
      )}

      {/* Custom pools */}
      {customPools.length > 0 && (
        <PoolTable title={t('dpCustomPools')} pools={customPools} showRemove />
      )}

      {/* Add custom pool */}
      <fieldset>
        <legend>{t('dpAddCustom')}</legend>
        <div className="field-row" style={{ alignItems: 'flex-end', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          <div className="field" style={{ flex: 2, minWidth: 140 }}>
            <label>{t('name')}</label>
            <input type="text" value={newPool.name} onChange={e => setNewPool(p => ({ ...p, name: e.target.value }))}
              placeholder={t('dpPoolName')} />
          </div>
          <div className="field" style={{ flex: 1, minWidth: 120 }}>
            <label>{t('dpStat')} 1</label>
            <select value={newPool.comp1} onChange={e => setNewPool(p => ({ ...p, comp1: e.target.value }))}>
              <option value="">{t('select')}</option>
              {STAT_OPTIONS.map(g => (
                <optgroup key={g.group} label={g.group}>
                  {g.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="field" style={{ flex: 1, minWidth: 120 }}>
            <label>{t('dpStat')} 2 ({t('optional')})</label>
            <select value={newPool.comp2} onChange={e => setNewPool(p => ({ ...p, comp2: e.target.value }))}>
              <option value="">{t('none')}</option>
              {STAT_OPTIONS.map(g => (
                <optgroup key={g.group} label={g.group}>
                  {g.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="field" style={{ flex: 2, minWidth: 140 }}>
            <label>{t('dpNotes')}</label>
            <input type="text" value={newPool.notes} onChange={e => setNewPool(p => ({ ...p, notes: e.target.value }))}
              placeholder={t('optional')} />
          </div>
          <button className="btn btn-primary btn-sm" onClick={addCustomPool}>{t('add')}</button>
        </div>
      </fieldset>
    </div>
  )
}
