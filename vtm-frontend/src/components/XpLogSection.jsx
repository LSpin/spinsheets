import { useState } from 'react'

/* ── category label helper ── */
const catKeyMap = { 'Humanity/Path': 'catHumanity' }
const catLabel = (cat, t) => t(catKeyMap[cat] || `cat${cat}`) || cat

/* ── splat configurations ── */
const configs = {
  vampire: {
    startingFreebies: 15,
    xpCosts: {
      Attribute:      { multiplier: 4 },
      NewAbility:     { flat: 3 },
      Ability:        { multiplier: 2 },
      ClanDisc:       { multiplier: 5 },
      NonClanDisc:    { multiplier: 7 },
      SecondaryPath:  { multiplier: 4 },
      NewPath:        { flat: 7 },
      Background:     { multiplier: 3 },
      Virtue:         { multiplier: 2 },
      Willpower:      { multiplier: 1 },
      'Humanity/Path':{ multiplier: 2 },
    },
    freebieCosts: {
      Attribute: 5, Ability: 2, Discipline: 7, Background: 1,
      Virtue: 2, Willpower: 1, 'Humanity/Path': 2,
    },
    xpRef: [
      ['xpAttrCost', 'xpNewAbilCost', 'xpAbilCost'],
      ['xpClanDiscCost', 'xpNonClanDiscCost'],
      ['xpSecPathCost', 'xpNewPathCost'],
      ['xpVirtueCost', 'xpWpCost', 'xpPathCost'],
    ],
    freebieRef: [
      ['freebieAttrCost', 'freebieAbilCost', 'freebieDiscCost', 'freebieBgCost'],
      ['freebieVirtueCost', 'freebieWpCost', 'freebiePathCost'],
    ],
  },

  'vampire-dark-ages': {
    startingFreebies: 15,
    xpCosts: {
      Attribute:      { multiplier: 4 },
      NewAbility:     { flat: 3 },
      Ability:        { multiplier: 2 },
      ClanDisc:       { multiplier: 5 },
      NonClanDisc:    { multiplier: 7 },
      SecondaryPath:  { multiplier: 4 },
      NewPath:        { flat: 7 },
      Background:     { multiplier: 3 },
      Virtue:         { multiplier: 2 },
      Willpower:      { multiplier: 1 },
      Road:           { multiplier: 2 },
    },
    freebieCosts: {
      Attribute: 5, Ability: 2, Discipline: 7, Background: 1,
      Virtue: 2, Willpower: 1, Road: 2,
    },
    xpRef: [
      ['xpAttrCost', 'xpNewAbilCost', 'xpAbilCost'],
      ['xpClanDiscCost', 'xpNonClanDiscCost'],
      ['xpSecPathCost', 'xpNewPathCost'],
      ['xpVirtueCost', 'xpWpCost', 'xpRoadCost'],
    ],
    freebieRef: [
      ['freebieAttrCost', 'freebieAbilCost', 'freebieDiscCost', 'freebieBgCost'],
      ['freebieVirtueCost', 'freebieWpCost', 'freebieRoadCost'],
    ],
  },

  kote: {
    startingFreebies: 15,
    xpCosts: {
      Attribute:  { multiplier: 4 },
      NewAbility: { flat: 3 },
      Ability:    { multiplier: 2 },
      Discipline: { multiplier: 7 },
      NewDisc:    { flat: 10 },
      Background: { multiplier: 3 },
      Virtue:     { multiplier: 3 },
      Willpower:  { multiplier: 1 },
      Dharma:     { multiplier: 3 },
    },
    freebieCosts: {
      Attribute: 5, Ability: 2, Discipline: 7, Background: 1,
      Virtue: 3, Willpower: 2, Dharma: 3,
    },
    xpRef: [
      ['xpAttrCost', 'xpNewAbilCost', 'xpAbilCost'],
      ['xpDiscCost', 'xpNewDiscCost'],
      ['xpKoteVirtueCost', 'xpWpCost', 'xpDharmaCost'],
    ],
    freebieRef: [
      ['freebieAttrCost', 'freebieAbilCost', 'freebieDiscCost', 'freebieBgCost'],
      ['freebieVirtueKoteCost', 'freebieWpKoteCost', 'freebieDharmaCost'],
    ],
  },

  werewolf: {
    startingFreebies: 15,
    xpCosts: {
      Attribute:  { multiplier: 4 },
      NewAbility: { flat: 3 },
      Ability:    { multiplier: 2 },
      TribalGift: { multiplier: 3, inputLabel: 'giftLevel' },
      OtherGift:  { multiplier: 5, inputLabel: 'giftLevel' },
      Background: { multiplier: 3 },
      Rage:       { multiplier: 1 },
      Gnosis:     { multiplier: 2 },
      Willpower:  { multiplier: 1 },
    },
    freebieCosts: {
      Attribute: 5, Ability: 2, Gift: 7, Background: 1,
      Rage: 1, Gnosis: 2, Willpower: 1,
    },
    xpRef: [
      ['xpAttrCost', 'xpNewAbilCost', 'xpAbilCost'],
      ['xpTribalGiftCost', 'xpOtherGiftCost'],
      ['xpRageCost', 'xpGnosisCost', 'xpWpCost'],
    ],
    freebieRef: [
      ['freebieAttrCost', 'freebieAbilCost', 'freebieGiftCost', 'freebieBgCost'],
      ['freebieRageCost', 'freebieGnosisCost', 'freebieWpCost'],
    ],
  },

  mage: {
    startingFreebies: 15,
    xpCosts: {
      Attribute:      { multiplier: 4 },
      NewAbility:     { flat: 3 },
      Ability:        { multiplier: 2 },
      AffinitySphere: { multiplier: 7 },
      OtherSphere:    { multiplier: 8 },
      Arete:          { multiplier: 8 },
      Background:     { multiplier: 3 },
      Willpower:      { multiplier: 1 },
    },
    freebieCosts: {
      Attribute: 5, Ability: 2, Sphere: 7, Arete: 4,
      Background: 1, Willpower: 1, Quintessence: 0.25,
    },
    xpRef: [
      ['xpAttrCost', 'xpNewAbilCost', 'xpAbilCost'],
      ['xpAffSphereCost', 'xpOtherSphereCost'],
      ['xpAreteCost', 'xpBgCost', 'xpWpCost'],
    ],
    freebieRef: [
      ['freebieAttrCost', 'freebieAbilCost', 'freebieSphereCost', 'freebieAreteCost'],
      ['freebieBgCost', 'freebieWpCost', 'freebieQuintCost'],
    ],
  },

  'seventh-sea': {
    startingFreebies: 0,
    xpCosts: {
      Trait:       { multiplier: 5 },
      Skill:       { multiplier: 2 },
      NewSkill:    { flat: 3 },
      Advantage:   { flat: 5 },
      Earned:      {},
      Other:       {},
    },
    freebieCosts: {
      Trait: 5, Skill: 2, Advantage: 5, Other: 1,
    },
    xpRef: [
      ['xp7sTraitCost', 'xp7sSkillCost', 'xp7sNewSkillCost'],
      ['xp7sAdvCost'],
    ],
    freebieRef: [
      ['freebie7sTraitCost', 'freebie7sSkillCost', 'freebie7sAdvCost'],
    ],
  },

  'l5r': {
    startingFreebies: 40,
    xpCosts: {
      Trait:       { multiplier: 4 },
      Skill:       { multiplier: 1 },
      NewSkill:    { flat: 1 },
      Emphasis:    { flat: 2 },
      Void:        { multiplier: 6 },
      Advantage:   {},
      Earned:      {},
      Other:       {},
    },
    freebieCosts: {
      Trait: 12, Skill: 1, Void: 6, Advantage: 1, Other: 1,
    },
    xpRef: [
      ['xpL5rTraitCost', 'xpL5rSkillCost', 'xpL5rNewSkillCost'],
      ['xpL5rEmphasisCost', 'xpL5rVoidCost'],
    ],
    freebieRef: [
      ['freebieL5rTraitCost', 'freebieL5rSkillCost', 'freebieL5rVoidCost'],
    ],
  },
  dnd: {
    startingFreebies: 0,
    noFreebies: true,
    xpCosts: { Earned: {}, Other: {} },
    freebieCosts: { Other: {} },
    xpRef: [],
    freebieRef: [],
  },
  blades: {
    startingFreebies: 0,
    noFreebies: true,
    xpCosts: { Earned: {}, Other: {} },
    freebieCosts: { Other: {} },
    xpRef: [],
    freebieRef: [],
  },
  uestrpg: {
    startingFreebies: 0,
    noFreebies: true,
    xpCosts: { Earned: {}, Other: {} },
    freebieCosts: { Other: {} },
    xpRef: [],
    freebieRef: [],
  },
  cyberpunk: {
    startingFreebies: 0,
    noFreebies: true,
    xpCosts: {
      Earned: {},
      Skill:       { multiplier: 1, inputLabel: 'currentRating' },
      NewSkill:    { flat: 1 },
      Other:       {},
    },
    freebieCosts: { Other: {} },
    xpRef: [],
    freebieRef: [],
  },
  hunter: {
    startingFreebies: 15,
    xpCosts: {
      Earned: {},
      Attribute: { multiplier: 4 },
      NewAbility: { flat: 3 },
      Ability: { multiplier: 2 },
      Edge: { multiplier: 7 },
      Willpower: { flat: 1 },
      Other: {},
    },
    freebieCosts: {
      Attribute: { flat: 5 },
      Ability: { flat: 2 },
      Edge: { flat: 7 },
      Willpower: { flat: 1 },
      Other: {},
    },
    xpRef: [],
    freebieRef: [],
  },
  wraith: {
    startingFreebies: 15,
    xpCosts: {
      Earned: {},
      Attribute: { multiplier: 4 },
      NewAbility: { flat: 3 },
      Ability: { multiplier: 2 },
      Arcanos: { multiplier: 5 },
      NewArcanos: { flat: 7 },
      Willpower: { flat: 1 },
      Pathos: { flat: 1 },
      Other: {},
    },
    freebieCosts: {
      Attribute: { flat: 5 },
      Ability: { flat: 2 },
      Arcanos: { flat: 5 },
      Willpower: { flat: 1 },
      Pathos: { flat: 1 },
      Other: {},
    },
    xpRef: [],
    freebieRef: [],
  },
  changeling: {
    startingFreebies: 15,
    xpCosts: {
      Earned: {},
      Attribute: { multiplier: 4 },
      NewAbility: { flat: 3 },
      Ability: { multiplier: 2 },
      Art: { multiplier: 5 },
      NewArt: { flat: 7 },
      Realm: { multiplier: 3 },
      NewRealm: { flat: 5 },
      Glamour: { flat: 3 },
      Willpower: { flat: 1 },
      Other: {},
    },
    freebieCosts: {
      Attribute: { flat: 5 },
      Ability: { flat: 2 },
      Art: { flat: 5 },
      Realm: { flat: 3 },
      Glamour: { flat: 3 },
      Willpower: { flat: 1 },
      Other: {},
    },
    xpRef: [],
    freebieRef: [],
  },
  demon: {
    startingFreebies: 15,
    xpCosts: {
      Earned: {},
      Attribute: { multiplier: 4 },
      NewAbility: { flat: 3 },
      Ability: { multiplier: 2 },
      Lore: { multiplier: 5 },
      NewLore: { flat: 7 },
      Faith: { multiplier: 6 },
      Willpower: { flat: 1 },
      Other: {},
    },
    freebieCosts: {
      Attribute: { flat: 5 },
      Ability: { flat: 2 },
      Lore: { flat: 5 },
      Faith: { flat: 6 },
      Willpower: { flat: 1 },
      Other: {},
    },
    xpRef: [],
    freebieRef: [],
  },
  asoiaf: {
    startingFreebies: 0,
    noFreebies: true,
    xpCosts: { Earned: {}, Other: {} },
    freebieCosts: { Other: {} },
    xpRef: [],
    freebieRef: [],
  },
}

export default function XpLogSection({ splat, xpLog, onAdd, onRemove, onError, t }) {
  const [subTab, setSubTab] = useState(0)
  const [category, setCategory] = useState('Earned')
  const [rating, setRating] = useState(1)
  const [description, setDescription] = useState('')
  const [manualAmount, setManualAmount] = useState(1)

  const cfg = configs[splat]
  const isXp = subTab === 0
  const costTable = isXp ? cfg.xpCosts : cfg.freebieCosts
  const costCategories = Object.keys(costTable)

  const costDef = costTable[category]
  const isManual = category === 'Earned' || category === 'Other' || !costDef || (isXp && costDef.flat == null && costDef.multiplier == null)

  let calculatedCost = 0
  let showRatingInput = false
  let ratingLabel = isXp ? t('currentRating') : t('dots')

  if (isManual) {
    calculatedCost = manualAmount
  } else if (isXp) {
    if (costDef.flat != null) {
      calculatedCost = costDef.flat
    } else {
      calculatedCost = rating * costDef.multiplier
      showRatingInput = true
      if (costDef.inputLabel) ratingLabel = t(costDef.inputLabel)
    }
  } else {
    calculatedCost = Math.ceil(rating * costDef)
    showRatingInput = true
  }

  const entries = xpLog.filter(e => e.type === (isXp ? 'XP' : 'FREEBIE'))
  const totalEarned = entries.filter(e => e.amount > 0).reduce((s, e) => s + e.amount, 0) + (isXp ? 0 : cfg.startingFreebies)
  const totalSpent  = entries.filter(e => e.amount < 0).reduce((s, e) => s + Math.abs(e.amount), 0)
  const available   = totalEarned - totalSpent

  function handleCategoryChange(val) {
    setCategory(val)
    setRating(1)
    setManualAmount(1)
  }

  function handleTabSwitch(tab) {
    setSubTab(tab)
    setCategory('Earned')
    setRating(1)
    setDescription('')
    setManualAmount(1)
  }

  async function handleAdd() {
    if (!description.trim()) return
    const amount = category === 'Earned' ? Math.abs(calculatedCost) : -Math.abs(calculatedCost)
    try {
      await onAdd({ type: isXp ? 'XP' : 'FREEBIE', amount, category, description })
      setCategory('Earned')
      setRating(1)
      setDescription('')
      setManualAmount(1)
    } catch {
      onError?.(t('failedToSave'))
    }
  }

  async function handleRemove(id) {
    try { await onRemove(id) }
    catch { onError?.(t('failedToSave')) }
  }

  const refLines = isXp ? cfg.xpRef : cfg.freebieRef

  return (
    <div className="form-section">
      <div role="tablist" className="tab-list">
        <button role="tab" className={`btn btn-secondary tab-btn${subTab === 0 ? ' tab-btn--active' : ''}`}
          onClick={() => handleTabSwitch(0)}>{t('xpTab')}</button>
        {!cfg.noFreebies && (
          <button role="tab" className={`btn btn-secondary tab-btn${subTab === 1 ? ' tab-btn--active' : ''}`}
            onClick={() => handleTabSwitch(1)}>{t('freebieTab')}</button>
        )}
      </div>

      {/* Summary */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div><strong>{isXp ? t('totalXP') : t('totalFreebies')}:</strong> {totalEarned}</div>
        <div><strong>{t('spent')}:</strong> {totalSpent}</div>
        <div><strong>{isXp ? t('availableXP') : t('availableFreebies')}:</strong>{' '}
          <span style={{ color: available >= 0 ? '#8c8' : '#e55', fontWeight: 700 }}>{available}</span>
        </div>
      </div>

      {/* Cost reference */}
      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', lineHeight: 1.8 }}>
        <strong>{isXp ? t('xpCostsHeader') : t('freebieStarting')}</strong><br/>
        {refLines.map((line, i) => (
          <span key={i}>{line.map(k => t(k)).join(' \u00b7 ')}<br/></span>
        ))}
      </div>
      <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '1rem', fontStyle: 'italic' }}>
        {isXp ? t('xpHelpEarned') : t('freebieHelpEarned')}
      </p>

      {/* Add entry form */}
      <div className="field-row" style={{ marginBottom: '1rem' }}>
        <div className="field">
          <label>{t('xpCategory')}</label>
          <select value={category} onChange={e => handleCategoryChange(e.target.value)}>
            <option value="Earned">{t('catEarned')}</option>
            {costCategories.map(cat => (
              <option key={cat} value={cat}>{catLabel(cat, t)}</option>
            ))}
            <option value="Other">{t('catOther')}</option>
          </select>
        </div>

        {isManual && (
          <div className="field" style={{ maxWidth: 80 }}>
            <label>{t('amount')}</label>
            <input type="number" min="1" value={manualAmount}
              onChange={e => setManualAmount(parseInt(e.target.value) || 1)} />
          </div>
        )}

        {!isManual && showRatingInput && (
          <div className="field" style={{ maxWidth: 100 }}>
            <label>{ratingLabel}</label>
            <input type="number" min="1" max="10" value={rating}
              onChange={e => setRating(parseInt(e.target.value) || 1)} />
          </div>
        )}

        {!isManual && (
          <div className="field" style={{ maxWidth: 80 }}>
            <label>{t('xpCost')}</label>
            <input type="number" value={calculatedCost} readOnly tabIndex={-1}
              style={{ fontWeight: 700, color: '#e55', background: 'transparent', border: '1px solid var(--color-border)' }} />
          </div>
        )}

        <div className="field" style={{ flex: 2 }}>
          <label>{t('xpDescription')}</label>
          <input type="text" value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder={category === 'Earned'
              ? (isXp ? 'e.g. Session reward' : 'e.g. Bonus freebies')
              : 'e.g. Strength 3\u21924'} />
        </div>
        <button className="btn btn-secondary" style={{ alignSelf: 'flex-end' }} onClick={handleAdd}>
          {t('addEntry')}
        </button>
      </div>

      {/* Entries table */}
      {entries.length === 0 && <p className="muted-hint">{isXp ? t('noXpEntries') : t('noFreebieEntries')}</p>}
      {entries.length > 0 && (
        <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
              <th style={{ padding: '0.4rem' }}>{t('xpDate')}</th>
              <th style={{ padding: '0.4rem' }}>{t('xpCategory')}</th>
              <th style={{ padding: '0.4rem' }}>{t('xpDescription')}</th>
              <th style={{ padding: '0.4rem', textAlign: 'right' }}>{t('amount')}</th>
              <th style={{ padding: '0.4rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {entries.map(e => (
              <tr key={e.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '0.4rem', whiteSpace: 'nowrap' }}>{new Date(e.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '0.4rem' }}>{catLabel(e.category, t)}</td>
                <td style={{ padding: '0.4rem' }}>{e.description}</td>
                <td style={{ padding: '0.4rem', textAlign: 'right', fontWeight: 600, color: e.amount > 0 ? '#8c8' : '#e55' }}>
                  {e.amount > 0 ? '+' : ''}{e.amount}
                </td>
                <td style={{ padding: '0.4rem' }}>
                  <button className="btn btn-danger btn-sm" onClick={() => handleRemove(e.id)}
                    style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}>&#x2715;</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
