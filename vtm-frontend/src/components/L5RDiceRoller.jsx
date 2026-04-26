import { useState, useCallback } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

function rollSingleDie() {
  return Math.floor(Math.random() * 10) + 1
}

function rollExplodingDie(exploding) {
  const chain = []
  let value = rollSingleDie()
  chain.push(value)
  while (exploding && value === 10) {
    value = rollSingleDie()
    chain.push(value)
  }
  return { chain, total: chain.reduce((a, b) => a + b, 0) }
}

function applyCapRule(rolled, kept) {
  let effectiveRoll = rolled
  let effectiveKeep = kept
  let bonus = 0

  if (effectiveKeep > 10) {
    bonus += (effectiveKeep - 10) * 2
    effectiveKeep = 10
  }
  if (effectiveRoll > 10) {
    bonus += (effectiveRoll - 10) * 2
    effectiveRoll = 10
  }
  if (effectiveKeep > effectiveRoll) {
    effectiveKeep = effectiveRoll
  }

  return { effectiveRoll, effectiveKeep, bonus }
}

function performRoll(rolled, kept, tn, exploding, emphasis, modifier) {
  const { effectiveRoll, effectiveKeep, bonus } = applyCapRule(rolled, kept)

  let dice = Array.from({ length: effectiveRoll }, () => rollExplodingDie(exploding))

  // Emphasis: reroll any die that initially showed 1 (once)
  if (emphasis) {
    dice = dice.map(die => {
      if (die.chain[0] === 1) {
        return rollExplodingDie(exploding)
      }
      return die
    })
  }

  // Sort descending by total to determine kept dice
  const indexed = dice.map((die, i) => ({ ...die, originalIndex: i }))
  const sorted = [...indexed].sort((a, b) => b.total - a.total)
  const keptIndices = new Set(sorted.slice(0, effectiveKeep).map(d => d.originalIndex))

  const keptTotal = sorted.slice(0, effectiveKeep).reduce((sum, d) => sum + d.total, 0) + bonus + modifier
  const success = keptTotal >= tn

  return {
    dice: indexed.map(d => ({ ...d, kept: keptIndices.has(d.originalIndex) })),
    notation: `${rolled}k${kept}`,
    effectiveRoll,
    effectiveKeep,
    bonus,
    modifier,
    total: keptTotal,
    tn,
    success,
    exploding,
    emphasis
  }
}

export default function L5RDiceRoller() {
  const { t } = useLanguage()
  const [rolled, setRolled] = useState(6)
  const [kept, setKept] = useState(3)
  const [tn, setTn] = useState(15)
  const [exploding, setExploding] = useState(true)
  const [emphasis, setEmphasis] = useState(false)
  const [result, setResult] = useState(null)
  const [modifier, setModifier] = useState(0)
  const [rolling, setRolling] = useState(false)
  const [history, setHistory] = useState([])

  const handleRoll = useCallback(() => {
    setRolling(true)
    setTimeout(() => {
      const entry = {
        id: Date.now(),
        ...performRoll(rolled, kept, tn, exploding, emphasis, modifier),
        timestamp: new Date().toLocaleTimeString()
      }
      setResult(entry)
      setHistory(prev => [entry, ...prev].slice(0, 20))
      setRolling(false)
    }, 300)
  }, [rolled, kept, tn, exploding, emphasis, modifier])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  const handleRolledChange = e => {
    const val = Math.min(15, Math.max(1, Number(e.target.value) || 1))
    setRolled(val)
    if (kept > val) setKept(Math.min(val, 10))
  }

  const handleKeptChange = e => {
    const val = Math.min(10, Math.max(1, Number(e.target.value) || 1))
    setKept(Math.min(val, rolled))
  }

  function formatDieChain(chain) {
    if (chain.length === 1) return String(chain[0])
    return chain.join(' + ') + ' = ' + chain.reduce((a, b) => a + b, 0)
  }

  return (
    <div className="dice-roller">
      <h3 className="dice-roller-title">{t('diceL5rRoll')}</h3>

      <div className="dice-roller-controls">
        <label className="dice-roller-label">
          {t('diceL5rRolled')}
          <input
            className="dice-roller-input"
            type="number"
            min={1}
            max={15}
            value={rolled}
            onChange={handleRolledChange}
          />
        </label>

        <label className="dice-roller-label">
          {t('diceL5rKept')}
          <input
            className="dice-roller-input"
            type="number"
            min={1}
            max={10}
            value={kept}
            onChange={handleKeptChange}
          />
        </label>

        <label className="dice-roller-label">
          {t('diceL5rTN')}
          <input
            className="dice-roller-input"
            type="number"
            min={5}
            max={100}
            value={tn}
            onChange={e => setTn(Math.min(100, Math.max(5, Number(e.target.value) || 15)))}
          />
        </label>

        <label className="dice-roller-label">
          {t('diceL5rModifier')}
          <input
            className="dice-roller-input"
            type="number"
            min={-50}
            max={50}
            value={modifier}
            onChange={e => setModifier(Math.min(50, Math.max(-50, Number(e.target.value) || 0)))}
          />
        </label>

        <label className="dice-roller-checkbox">
          <input
            type="checkbox"
            checked={exploding}
            onChange={e => setExploding(e.target.checked)}
          />
          {t('diceL5rExplodes')}
        </label>

        <label className="dice-roller-checkbox">
          <input
            type="checkbox"
            checked={emphasis}
            onChange={e => setEmphasis(e.target.checked)}
          />
          {t('diceL5rEmphasis')}
        </label>
      </div>

      <button
        className="dice-roller-button"
        onClick={handleRoll}
        disabled={rolling}
      >
        {t('diceL5rRoll')}
      </button>

      {result && (
        <div className="dice-roller-result" aria-live="polite">
          <div className="dice-roller-notation">
            {result.notation}
            {result.bonus > 0 && (
              <span className="dice-roller-bonus">
                {' '}(+{result.bonus} {t('diceL5rBonus')})
              </span>
            )}
            {result.modifier !== 0 && (
              <span className="dice-roller-bonus">
                {' '}{result.modifier >= 0 ? `+${result.modifier}` : result.modifier}
              </span>
            )}
          </div>

          <div className={`dice-roller-dice ${rolling ? 'dice-roller-dice--rolling' : ''}`}>
            {result.dice.map((die, i) => (
              <span
                key={`${result.id}-${i}`}
                className={
                  die.kept
                    ? 'dice-roller-die dice-roller-die--kept'
                    : 'dice-roller-die dice-roller-die--unkept'
                }
                title={formatDieChain(die.chain)}
              >
                {die.chain.length > 1 ? formatDieChain(die.chain) : die.total}
              </span>
            ))}
          </div>

          <div className="dice-roller-total">
            {t('diceL5rTotal')}: {result.total} vs {t('diceL5rTN')} {result.tn}
          </div>

          <div className={`dice-roller-outcome dice-roller-outcome--${result.success ? 'success' : 'failure'}`}>
            {result.success ? t('diceL5rSuccess') : t('diceL5rFailure')}
            {result.success && result.total >= result.tn + 5 && (
              <span className="dice-roller-bonus"> — {Math.floor((result.total - result.tn) / 5)} {t('diceL5rFreeRaises')}</span>
            )}
          </div>

          {/* Raise thresholds */}
          <div style={{ marginTop: 'var(--space-sm)', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            {[0, 1, 2, 3, 4, 5].map(r => {
              const threshold = result.tn + r * 5
              const met = result.total >= threshold
              return (
                <span key={r} style={{
                  display: 'inline-block', marginRight: 'var(--space-sm)', padding: '0.15rem 0.4rem',
                  borderRadius: 'var(--radius)', fontSize: '0.75rem',
                  background: met ? 'rgba(42,140,58,0.15)' : 'transparent',
                  color: met ? '#2a8c3a' : 'var(--color-text-muted)',
                  fontWeight: met ? 600 : 400,
                  border: `1px solid ${met ? 'rgba(42,140,58,0.3)' : 'var(--color-border)'}`
                }}>
                  {r === 0 ? `TN ${threshold}` : `+${r}R: ${threshold}`}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="dice-roller-history">
          <div className="dice-roller-history-header">
            <h4>{t('diceL5rHistory')}</h4>
            <button
              className="dice-roller-clear"
              onClick={clearHistory}
            >
              {t('diceL5rClear')}
            </button>
          </div>
          <ul className="dice-roller-history-list">
            {history.map(entry => (
              <li key={entry.id} className="dice-roller-history-item">
                <span className="dice-roller-history-time">{entry.timestamp}</span>
                <span className="dice-roller-history-detail">
                  {entry.notation}
                  {entry.bonus > 0 && ` (+${entry.bonus})`}
                  {entry.modifier !== 0 && (entry.modifier > 0 ? ` +${entry.modifier}` : ` ${entry.modifier}`)}
                  {' → '}{entry.total}
                </span>
                <span className={`dice-roller-history-result dice-roller-outcome--${entry.success ? 'success' : 'failure'}`}>
                  vs {entry.tn}: {entry.success ? t('diceL5rSuccess') : t('diceL5rFailure')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
