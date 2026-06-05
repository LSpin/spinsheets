import { useState, useRef, useEffect } from 'react'

export default function SaveButton({ onSave, disabled, t, validationErrors }) {
  const [state, setState] = useState('idle') // idle | saving | saved
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  async function handleClick() {
    if (state === 'saving') return
    setState('saving')
    try {
      await onSave()
      setState('saved')
      timerRef.current = setTimeout(() => setState('idle'), 2000)
    } catch {
      setState('idle')
    }
  }

  const label = state === 'saving' ? t('saving')
    : state === 'saved' ? t('saved')
    : t('quickSave')

  return (
    <button
      className={`btn btn-secondary${state === 'saved' ? ' btn-save-success' : ''}`}
      onClick={handleClick}
      disabled={disabled || state === 'saving' || (validationErrors?.length > 0)}
      title={validationErrors?.length > 0 ? validationErrors.join(' ') : undefined}
    >
      {label}
    </button>
  )
}
