import { useState, useCallback } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

function rollD(sides) {
  return Math.floor(Math.random() * sides) + 1
}

function performD20Roll(mode) {
  if (mode === 'advantage') {
    const dice = [rollD(20), rollD(20)]
    return { dice, value: Math.max(...dice) }
  }
  if (mode === 'disadvantage') {
    const dice = [rollD(20), rollD(20)]
    return { dice, value: Math.min(...dice) }
  }
  const die = rollD(20)
  return { dice: [die], value: die }
}

function performDamageRoll(dieType, numDice) {
  const sides = Number(dieType.replace('d', ''))
  const dice = Array.from({ length: numDice }, () => rollD(sides))
  const total = dice.reduce((a, b) => a + b, 0)
  return { dice, total }
}

export default function DndDiceRoller() {
  const { t } = useLanguage()

  // d20 state
  const [mode, setMode] = useState('normal')
  const [modifier, setModifier] = useState(0)
  const [dc, setDc] = useState('')
  const [d20Result, setD20Result] = useState(null)
  const [rolling, setRolling] = useState(false)

  // Damage state
  const [dieType, setDieType] = useState('d6')
  const [numDice, setNumDice] = useState(1)
  const [dmgModifier, setDmgModifier] = useState(0)
  const [dmgResult, setDmgResult] = useState(null)
  const [dmgRolling, setDmgRolling] = useState(false)

  const [history, setHistory] = useState([])

  const handleD20Roll = useCallback(() => {
    setRolling(true)
    setTimeout(() => {
      const roll = performD20Roll(mode)
      const total = roll.value + modifier
      const isNat20 = roll.value === 20
      const isNat1 = roll.value === 1
      const dcNum = dc !== '' ? Number(dc) : null
      const passed = dcNum !== null ? total >= dcNum : null

      const entry = {
        id: Date.now(),
        type: 'd20',
        mode,
        dice: roll.dice,
        raw: roll.value,
        modifier,
        total,
        dc: dcNum,
        passed,
        isNat20,
        isNat1,
        timestamp: new Date().toLocaleTimeString(),
      }
      setD20Result(entry)
      setHistory(prev => [entry, ...prev].slice(0, 20))
      setRolling(false)
    }, 300)
  }, [mode, modifier, dc])

  const handleDamageRoll = useCallback(() => {
    setDmgRolling(true)
    setTimeout(() => {
      const roll = performDamageRoll(dieType, numDice)
      const total = roll.total + dmgModifier

      const entry = {
        id: Date.now(),
        type: 'damage',
        dieType,
        numDice,
        dice: roll.dice,
        modifier: dmgModifier,
        total,
        timestamp: new Date().toLocaleTimeString(),
      }
      setDmgResult(entry)
      setHistory(prev => [entry, ...prev].slice(0, 20))
      setDmgRolling(false)
    }, 300)
  }, [dieType, numDice, dmgModifier])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  function d20OutcomeClass(entry) {
    if (entry.isNat20) return 'dice-roller-outcome dice-roller-outcome--success'
    if (entry.isNat1) return 'dice-roller-outcome dice-roller-outcome--failure'
    if (entry.passed === true) return 'dice-roller-outcome dice-roller-outcome--success'
    if (entry.passed === false) return 'dice-roller-outcome dice-roller-outcome--failure'
    return 'dice-roller-outcome'
  }

  function d20OutcomeLabel(entry) {
    const parts = []
    if (entry.isNat20) parts.push(t('dndNat20'))
    if (entry.isNat1) parts.push(t('dndNat1'))
    parts.push(`${t('dndTotal')}: ${entry.total}`)
    if (entry.dc !== null) {
      parts.push(entry.passed ? 'Pass' : 'Fail')
    }
    return parts.join(' — ')
  }

  function historyLabel(entry) {
    if (entry.type === 'd20') {
      const modeStr = entry.mode === 'advantage' ? ' (Adv)' : entry.mode === 'disadvantage' ? ' (Dis)' : ''
      return `d20${modeStr} [${entry.dice.join(', ')}] +${entry.modifier} = ${entry.total}${entry.dc !== null ? ` DC ${entry.dc}` : ''}`
    }
    return `${entry.numDice}${entry.dieType} [${entry.dice.join(', ')}] +${entry.modifier} = ${entry.total}`
  }

  function historyOutcome(entry) {
    if (entry.type === 'd20') {
      if (entry.isNat20) return t('dndNat20')
      if (entry.isNat1) return t('dndNat1')
      if (entry.passed === true) return 'Pass'
      if (entry.passed === false) return 'Fail'
      return `${entry.total}`
    }
    return `${entry.total} dmg`
  }

  function historyOutcomeClass(entry) {
    if (entry.type === 'd20') {
      if (entry.isNat20 || entry.passed === true) return 'dice-roller-history-result dice-roller-outcome--success'
      if (entry.isNat1 || entry.passed === false) return 'dice-roller-history-result dice-roller-outcome--failure'
    }
    return 'dice-roller-history-result'
  }

  return (
    <div className="dice-roller">
      {/* d20 Roll Section */}
      <h3 className="dice-roller-title">{t('dndD20Roll')}</h3>

      <div className="dice-roller-controls">
        <label className="dice-roller-label">
          {t('dndD20Roll')}
          <select
            className="dice-roller-input"
            value={mode}
            onChange={e => setMode(e.target.value)}
          >
            <option value="normal">{t('dndNormal')}</option>
            <option value="advantage">{t('dndAdvantage')}</option>
            <option value="disadvantage">{t('dndDisadvantage')}</option>
          </select>
        </label>

        <label className="dice-roller-label">
          {t('dndModifier')}
          <input
            className="dice-roller-input"
            type="number"
            min={-5}
            max={15}
            value={modifier}
            onChange={e => setModifier(Math.min(15, Math.max(-5, Number(e.target.value) || 0)))}
          />
        </label>

        <label className="dice-roller-label">
          {t('dndDC')}
          <input
            className="dice-roller-input"
            type="number"
            min={1}
            max={30}
            value={dc}
            onChange={e => setDc(e.target.value === '' ? '' : Math.min(30, Math.max(1, Number(e.target.value) || 1)))}
            placeholder="—"
          />
        </label>
      </div>

      <button
        className="dice-roller-button"
        onClick={handleD20Roll}
        disabled={rolling}
      >
        {t('dndD20Roll')}
      </button>

      {d20Result && (
        <div className="dice-roller-result" aria-live="polite">
          <div className="dice-roller-notation">
            {d20Result.mode === 'advantage' ? '2d20 (Advantage)' : d20Result.mode === 'disadvantage' ? '2d20 (Disadvantage)' : '1d20'}
            {d20Result.modifier >= 0 ? ` +${d20Result.modifier}` : ` ${d20Result.modifier}`}
            {d20Result.dc !== null ? ` vs DC ${d20Result.dc}` : ''}
          </div>

          <div className={`dice-roller-dice ${rolling ? 'dice-roller-dice--rolling' : ''}`}>
            {d20Result.dice.map((die, i) => {
              const isKept = die === d20Result.raw
              const isNat20 = die === 20
              const isNat1 = die === 1
              let cls = 'dice-roller-die'
              if (isKept) cls += ' dice-roller-die--kept'
              else cls += ' dice-roller-die--unkept'
              if (isNat20) cls += ' dice-roller-die--success'
              else if (isNat1) cls += ' dice-roller-die--one'
              return (
                <span key={`${d20Result.id}-${i}`} className={cls}>
                  {die}
                </span>
              )
            })}
          </div>

          <div className={d20OutcomeClass(d20Result)}>
            {d20OutcomeLabel(d20Result)}
          </div>
        </div>
      )}

      {/* Damage Roll Section */}
      <h3 className="dice-roller-title" style={{ marginTop: 'var(--space-xl)' }}>{t('dndDamageRoll')}</h3>

      <div className="dice-roller-controls">
        <label className="dice-roller-label">
          {t('dndDieType')}
          <select
            className="dice-roller-input"
            value={dieType}
            onChange={e => setDieType(e.target.value)}
          >
            <option value="d4">d4</option>
            <option value="d6">d6</option>
            <option value="d8">d8</option>
            <option value="d10">d10</option>
            <option value="d12">d12</option>
            <option value="d20">d20</option>
          </select>
        </label>

        <label className="dice-roller-label">
          {t('dndNumDice')}
          <input
            className="dice-roller-input"
            type="number"
            min={1}
            max={10}
            value={numDice}
            onChange={e => setNumDice(Math.min(10, Math.max(1, Number(e.target.value) || 1)))}
          />
        </label>

        <label className="dice-roller-label">
          {t('dndModifier')}
          <input
            className="dice-roller-input"
            type="number"
            min={-5}
            max={15}
            value={dmgModifier}
            onChange={e => setDmgModifier(Math.min(15, Math.max(-5, Number(e.target.value) || 0)))}
          />
        </label>
      </div>

      <button
        className="dice-roller-button"
        onClick={handleDamageRoll}
        disabled={dmgRolling}
      >
        {t('dndDamageRoll')}
      </button>

      {dmgResult && (
        <div className="dice-roller-result" aria-live="polite">
          <div className="dice-roller-notation">
            {dmgResult.numDice}{dmgResult.dieType}
            {dmgResult.modifier >= 0 ? ` +${dmgResult.modifier}` : ` ${dmgResult.modifier}`}
          </div>

          <div className={`dice-roller-dice ${dmgRolling ? 'dice-roller-dice--rolling' : ''}`}>
            {dmgResult.dice.map((die, i) => (
              <span key={`${dmgResult.id}-${i}`} className="dice-roller-die dice-roller-die--kept">
                {die}
              </span>
            ))}
          </div>

          <div className="dice-roller-outcome">
            {t('dndTotal')}: {dmgResult.total}
          </div>
        </div>
      )}

      {/* Roll History */}
      {history.length > 0 && (
        <div className="dice-roller-history">
          <div className="dice-roller-history-header">
            <h4>{t('diceHistory')}</h4>
            <button className="dice-roller-clear" onClick={clearHistory}>
              {t('diceClear')}
            </button>
          </div>
          <ul className="dice-roller-history-list">
            {history.map(entry => (
              <li key={entry.id} className="dice-roller-history-item">
                <span className="dice-roller-history-time">{entry.timestamp}</span>
                <span className="dice-roller-history-detail">
                  {historyLabel(entry)}
                </span>
                <span className={historyOutcomeClass(entry)}>
                  {historyOutcome(entry)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
