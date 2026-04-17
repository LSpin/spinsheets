import { useState, useCallback } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

function rollD10() {
  return Math.floor(Math.random() * 10) + 1
}

function rollPool(count, exploding) {
  const dice = []
  for (let i = 0; i < count; i++) {
    const val = rollD10()
    dice.push(val)
    if (exploding && val === 10) {
      dice.push(rollD10())
    }
  }
  return dice
}

/**
 * Greedy algorithm to maximize Raises.
 * Sort descending, then pair highest unused with lowest unused to reach 10+.
 * With skilled option, sets summing to 15+ yield 2 Raises.
 */
function groupDice(dice, skilled) {
  const sorted = [...dice].sort((a, b) => b - a)
  const used = new Array(sorted.length).fill(false)
  const sets = []

  // First pass: single dice >= 10 are guaranteed Raises
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i] >= 10) {
      used[i] = true
      const raises = skilled && sorted[i] >= 15 ? 2 : 1
      sets.push({ dice: [sorted[i]], sum: sorted[i], raises })
    }
  }

  // Second pass: pair highest unused with lowest unused
  let lo = sorted.length - 1
  for (let hi = 0; hi < sorted.length; hi++) {
    if (used[hi]) continue
    // Find lowest unused that pairs with hi to reach 10+
    while (lo > hi && used[lo]) lo--
    if (lo <= hi) break

    const sum = sorted[hi] + sorted[lo]
    if (sum >= 10) {
      used[hi] = true
      used[lo] = true
      const raises = skilled && sum >= 15 ? 2 : 1
      sets.push({ dice: [sorted[hi], sorted[lo]], sum, raises })
      lo--
    }
  }

  // Try to pair remaining unused dice with each other (multi-die sets)
  const remaining = []
  for (let i = 0; i < sorted.length; i++) {
    if (!used[i]) remaining.push(sorted[i])
  }

  // Greedy: accumulate remaining into sets of 10+
  if (remaining.length > 0) {
    let current = []
    let currentSum = 0
    for (const die of remaining) {
      current.push(die)
      currentSum += die
      if (currentSum >= 10) {
        const raises = skilled && currentSum >= 15 ? 2 : 1
        sets.push({ dice: [...current], sum: currentSum, raises })
        current = []
        currentSum = 0
      }
    }
    // Whatever is left is unused
    if (current.length > 0) {
      sets.push({ dice: [...current], sum: currentSum, raises: 0 })
    }
  }

  const totalRaises = sets.reduce((s, g) => s + g.raises, 0)
  return { sets, totalRaises }
}

export default function SeventhSeaDiceRoller() {
  const { t } = useLanguage()
  const [poolSize, setPoolSize] = useState(5)
  const [skilled, setSkilled] = useState(false)
  const [exploding, setExploding] = useState(false)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  const handleRoll = useCallback(() => {
    const dice = rollPool(poolSize, exploding)
    const grouped = groupDice(dice, skilled)
    const entry = {
      id: Date.now(),
      poolSize,
      skilled,
      exploding,
      dice,
      sets: grouped.sets,
      totalRaises: grouped.totalRaises,
    }
    setResult(entry)
    setHistory(prev => [entry, ...prev].slice(0, 20))
  }, [poolSize, skilled, exploding])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  return (
    <div className="form-section">
      <fieldset>
        <legend>{t('dice7sResult')}</legend>

        {/* Controls */}
        <div className="dice-roller-controls">
          <div className="field" style={{ maxWidth: 120 }}>
            <label htmlFor="dice7s-pool">{t('dice7sPool')}</label>
            <input
              id="dice7s-pool"
              type="number"
              min={1}
              max={20}
              value={poolSize}
              onChange={e => setPoolSize(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
            />
          </div>

          <label className="dice-roller-checkbox">
            <input type="checkbox" checked={skilled} onChange={e => setSkilled(e.target.checked)} />
            {t('dice7sSkilled')}
          </label>

          <label className="dice-roller-checkbox">
            <input type="checkbox" checked={exploding} onChange={e => setExploding(e.target.checked)} />
            {t('dice7sExploding')}
          </label>

          <button className="btn btn-primary" onClick={handleRoll}>
            {t('dice7sRoll')}
          </button>
        </div>

        {/* Current Result */}
        {result && (
          <div className="dice-roller-result">
            <div className="dice-roller-total">
              {t('dice7sRaises')}: <strong>{result.totalRaises}</strong>
            </div>

            <div className="dice-roller-all-dice">
              {result.dice.map((d, i) => (
                <span key={i} className="dice-roller-die">{d}</span>
              ))}
            </div>

            <div className="dice-roller-sets">
              {result.sets.map((set, i) => (
                <div
                  key={i}
                  className={`dice-roller-set ${set.raises === 0 ? 'dice-roller-set--unused' : ''} ${set.raises === 2 ? 'dice-roller-set--double' : ''}`}
                >
                  <span className="dice-roller-set__label">
                    {set.raises > 0
                      ? `${t('dice7sSet')} (${set.raises} ${t('dice7sRaises')})`
                      : t('dice7sUnused')}
                  </span>
                  <span className="dice-roller-set__dice">
                    {set.dice.map((d, j) => (
                      <span key={j} className={`dice-roller-die ${set.raises === 0 ? 'dice-roller-die--dimmed' : ''}`}>
                        {d}
                      </span>
                    ))}
                  </span>
                  <span className="dice-roller-set__sum">= {set.sum}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </fieldset>

      {/* Roll History */}
      {history.length > 0 && (
        <fieldset>
          <legend>
            {t('dice7sHistory')}
            <button className="btn btn-danger btn-sm" style={{ marginLeft: 'var(--space-sm)' }} onClick={clearHistory}>
              {t('dice7sClear')}
            </button>
          </legend>

          <div className="dice-roller-history">
            {history.map(entry => (
              <div key={entry.id} className="dice-roller-history__entry">
                <span className="dice-roller-history__meta">
                  {entry.poolSize}d10
                  {entry.skilled ? ' [S]' : ''}
                  {entry.exploding ? ' [E]' : ''}
                </span>
                <span className="dice-roller-history__dice">
                  {entry.dice.join(', ')}
                </span>
                <span className="dice-roller-history__raises">
                  {t('dice7sRaises')}: {entry.totalRaises}
                </span>
              </div>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  )
}
