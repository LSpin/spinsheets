import { useState, useCallback } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

function rollDice(count) {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 10) + 1)
}

function evaluateRoll(dice, difficulty, specialty, onesSubtract) {
  let successes = 0
  let ones = 0

  for (const die of dice) {
    if (die === 1 && onesSubtract) {
      ones++
      successes--
    } else if (die === 10) {
      successes += specialty ? 2 : 1
    } else if (die >= difficulty) {
      successes++
    }
  }

  let outcome = 'success'
  if (successes <= 0 && ones > 0) outcome = 'botch'
  else if (successes <= 0) outcome = 'failure'

  return { successes: Math.max(successes, 0), ones, outcome }
}

function dieClass(value, difficulty, specialty) {
  if (value === 1) return 'dice-roller-die dice-roller-die--one'
  if (value === 10) return specialty
    ? 'dice-roller-die dice-roller-die--ten-specialty'
    : 'dice-roller-die dice-roller-die--ten'
  if (value >= difficulty) return 'dice-roller-die dice-roller-die--success'
  return 'dice-roller-die dice-roller-die--fail'
}

export default function StorytellerDiceRoller() {
  const { t } = useLanguage()
  const [pool, setPool] = useState(5)
  const [difficulty, setDifficulty] = useState(6)
  const [specialty, setSpecialty] = useState(false)
  const [onesSubtract, setOnesSubtract] = useState(true)
  const [result, setResult] = useState(null)
  const [rolling, setRolling] = useState(false)
  const [history, setHistory] = useState([])

  const handleRoll = useCallback(() => {
    setRolling(true)
    // Brief animation delay
    setTimeout(() => {
      const dice = rollDice(pool)
      const evaluation = evaluateRoll(dice, difficulty, specialty, onesSubtract)
      const entry = {
        id: Date.now(),
        dice,
        pool,
        difficulty,
        specialty,
        onesSubtract,
        ...evaluation,
        timestamp: new Date().toLocaleTimeString()
      }
      setResult(entry)
      setHistory(prev => [entry, ...prev].slice(0, 20))
      setRolling(false)
    }, 300)
  }, [pool, difficulty, specialty, onesSubtract])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  function outcomeLabel(outcome, successes) {
    if (outcome === 'botch') return t('diceBotch')
    if (outcome === 'failure') return t('diceFailure')
    return `${successes} ${t('diceSuccesses')}`
  }

  return (
    <div className="dice-roller">
      <h3 className="dice-roller-title">{t('diceRoll')}</h3>

      <div className="dice-roller-controls">
        <label className="dice-roller-label">
          {t('dicePool')}
          <input
            className="dice-roller-input"
            type="number"
            min={1}
            max={30}
            value={pool}
            onChange={e => setPool(Math.min(30, Math.max(1, Number(e.target.value) || 1)))}
          />
        </label>

        <label className="dice-roller-label">
          {t('diceDifficulty')}
          <input
            className="dice-roller-input"
            type="number"
            min={2}
            max={10}
            value={difficulty}
            onChange={e => setDifficulty(Math.min(10, Math.max(2, Number(e.target.value) || 6)))}
          />
        </label>

        <label className="dice-roller-checkbox">
          <input
            type="checkbox"
            checked={specialty}
            onChange={e => setSpecialty(e.target.checked)}
          />
          {t('diceSpecialty')}
        </label>

        <label className="dice-roller-checkbox">
          <input
            type="checkbox"
            checked={onesSubtract}
            onChange={e => setOnesSubtract(e.target.checked)}
          />
          {t('diceOnesSubtract')}
        </label>
      </div>

      <button
        className="dice-roller-button"
        onClick={handleRoll}
        disabled={rolling}
      >
        {t('diceRoll')}
      </button>

      {result && (
        <div className="dice-roller-result">
          <div className={`dice-roller-dice ${rolling ? 'dice-roller-dice--rolling' : ''}`}>
            {result.dice.map((die, i) => (
              <span
                key={`${result.id}-${i}`}
                className={dieClass(die, result.difficulty, result.specialty)}
              >
                {die}
              </span>
            ))}
          </div>
          <div className={`dice-roller-outcome dice-roller-outcome--${result.outcome}`}>
            {outcomeLabel(result.outcome, result.successes)}
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
                  {entry.pool}d10 {t('diceDifficulty')} {entry.difficulty}
                </span>
                <span className={`dice-roller-history-result dice-roller-outcome--${entry.outcome}`}>
                  {outcomeLabel(entry.outcome, entry.successes)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
