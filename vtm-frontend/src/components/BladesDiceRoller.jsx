import { useState, useCallback } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

function rollD6() {
  return Math.floor(Math.random() * 6) + 1
}

function performRoll(poolSize) {
  if (poolSize === 0) {
    // Zero dice: roll 2d6, take the lowest
    const dice = [rollD6(), rollD6()]
    const lowest = Math.min(...dice)
    const lowestIndex = dice.indexOf(lowest)
    return { dice, determiningIndex: lowestIndex, determiningValue: lowest, isZeroDice: true }
  }

  const dice = Array.from({ length: poolSize }, () => rollD6())
  const highest = Math.max(...dice)
  const highestIndex = dice.indexOf(highest)
  return { dice, determiningIndex: highestIndex, determiningValue: highest, isZeroDice: false }
}

function evaluateResult(dice, determiningValue, isZeroDice) {
  // Check for critical: two or more 6s (only possible with 2+ dice and not zero-dice mode)
  const sixes = dice.filter(d => d === 6).length
  if (!isZeroDice && sixes >= 2) return 'critical'
  if (determiningValue === 6) return 'success'
  if (determiningValue >= 4) return 'partial'
  return 'failure'
}

function dieClass(value, index, determiningIndex) {
  const base = index === determiningIndex
    ? 'dice-roller-die dice-roller-die--kept'
    : 'dice-roller-die dice-roller-die--unkept'

  if (value >= 6) return `${base} dice-roller-die--success`
  if (value >= 4) return `${base} dice-roller-die--ten`
  return `${base} dice-roller-die--one`
}

export default function BladesDiceRoller() {
  const { t } = useLanguage()
  const [pool, setPool] = useState(2)
  const [position, setPosition] = useState('risky')
  const [effect, setEffect] = useState('standard')
  const [result, setResult] = useState(null)
  const [rolling, setRolling] = useState(false)
  const [history, setHistory] = useState([])

  const handleRoll = useCallback(() => {
    setRolling(true)
    setTimeout(() => {
      const roll = performRoll(pool)
      const outcome = evaluateResult(roll.dice, roll.determiningValue, roll.isZeroDice)
      const entry = {
        id: Date.now(),
        pool,
        position,
        effect,
        dice: roll.dice,
        determiningIndex: roll.determiningIndex,
        determiningValue: roll.determiningValue,
        isZeroDice: roll.isZeroDice,
        outcome,
        timestamp: new Date().toLocaleTimeString(),
      }
      setResult(entry)
      setHistory(prev => [entry, ...prev].slice(0, 20))
      setRolling(false)
    }, 300)
  }, [pool, position, effect])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  function outcomeLabel(outcome) {
    if (outcome === 'critical') return t('bladesCritical')
    if (outcome === 'success') return t('bladesFullSuccess')
    if (outcome === 'partial') return t('bladesPartialSuccess')
    return t('bladesFailure')
  }

  function outcomeClass(outcome) {
    if (outcome === 'critical') return 'dice-roller-outcome dice-roller-outcome--success'
    if (outcome === 'success') return 'dice-roller-outcome dice-roller-outcome--success'
    if (outcome === 'partial') return 'dice-roller-outcome dice-roller-outcome--botch'
    return 'dice-roller-outcome dice-roller-outcome--failure'
  }

  function positionLabel(pos) {
    if (pos === 'controlled') return t('bladesControlled')
    if (pos === 'risky') return t('bladesRisky')
    return t('bladesDesperate')
  }

  function effectLabel(eff) {
    if (eff === 'great') return t('bladesGreatEffect')
    if (eff === 'standard') return t('bladesStandardEffect')
    return t('bladesLimitedEffect')
  }

  return (
    <div className="dice-roller">
      <h3 className="dice-roller-title">{t('bladesDicePool')}</h3>

      <div className="dice-roller-controls">
        <label className="dice-roller-label">
          {t('bladesDicePool')}
          <input
            className="dice-roller-input"
            type="number"
            min={0}
            max={10}
            value={pool}
            onChange={e => setPool(Math.min(10, Math.max(0, Number(e.target.value) || 0)))}
          />
        </label>

        <label className="dice-roller-label">
          {t('bladesPosition')}
          <select
            className="dice-roller-input"
            value={position}
            onChange={e => setPosition(e.target.value)}
          >
            <option value="controlled">{t('bladesControlled')}</option>
            <option value="risky">{t('bladesRisky')}</option>
            <option value="desperate">{t('bladesDesperate')}</option>
          </select>
        </label>

        <label className="dice-roller-label">
          {t('bladesEffect')}
          <select
            className="dice-roller-input"
            value={effect}
            onChange={e => setEffect(e.target.value)}
          >
            <option value="great">{t('bladesGreatEffect')}</option>
            <option value="standard">{t('bladesStandardEffect')}</option>
            <option value="limited">{t('bladesLimitedEffect')}</option>
          </select>
        </label>
      </div>

      {pool === 0 && (
        <div className="dice-roller-notation">
          {t('bladesZeroDice')}
        </div>
      )}

      <button
        className="dice-roller-button"
        onClick={handleRoll}
        disabled={rolling}
      >
        {t('bladesRoll')}
      </button>

      {result && (
        <div className="dice-roller-result">
          <div className="dice-roller-notation">
            {result.pool === 0 ? '0d (2d6 take lowest)' : `${result.pool}d6`}
            {' — '}
            {positionLabel(result.position)} / {effectLabel(result.effect)}
          </div>

          <div className={`dice-roller-dice ${rolling ? 'dice-roller-dice--rolling' : ''}`}>
            {result.dice.map((die, i) => (
              <span
                key={`${result.id}-${i}`}
                className={dieClass(die, i, result.determiningIndex)}
                title={i === result.determiningIndex ? (result.isZeroDice ? 'Lowest' : 'Highest') : ''}
              >
                {die}
              </span>
            ))}
          </div>

          <div className={outcomeClass(result.outcome)}>
            {outcomeLabel(result.outcome)}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="dice-roller-history">
          <div className="dice-roller-history-header">
            <h4>{t('diceHistory')}</h4>
            <button
              className="dice-roller-clear"
              onClick={clearHistory}
            >
              {t('diceClear')}
            </button>
          </div>
          <ul className="dice-roller-history-list">
            {history.map(entry => (
              <li key={entry.id} className="dice-roller-history-item">
                <span className="dice-roller-history-time">{entry.timestamp}</span>
                <span className="dice-roller-history-detail">
                  {entry.pool === 0 ? '0d' : `${entry.pool}d6`}
                  {' '}[{entry.dice.join(', ')}]
                  {' — '}{positionLabel(entry.position)}
                </span>
                <span className={`dice-roller-history-result ${outcomeClass(entry.outcome)}`}>
                  {outcomeLabel(entry.outcome)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
