import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'

const GAME_SYSTEMS = [
  { key: 'WOD', labelKey: 'systemWoD', badge: 'splat-badge--vampire', newPath: '/characters/new', gameSystem: 'WOD' },
  { key: 'SEVENTH_SEA', labelKey: 'system7thSea', badge: 'splat-badge--seventh-sea', newPath: '/7thsea/new', gameSystem: 'SEVENTH_SEA' },
  { key: 'L5R', labelKey: 'systemL5R', badge: 'splat-badge--l5r', newPath: '/l5r/new', gameSystem: 'L5R' },
  { key: 'BLADES', labelKey: 'systemBlades', badge: 'splat-badge--blades', newPath: '/blades/new', gameSystem: 'BLADES' },
  { key: 'DND', labelKey: 'systemDnd', badge: 'splat-badge--dnd', newPath: '/dnd/new', gameSystem: 'DND' },
  { key: 'UESTRPG', labelKey: 'systemUestrpg', badge: 'splat-badge--uestrpg', newPath: '/uestrpg/new', gameSystem: 'UESTRPG' },
  { key: 'CYBERPUNK', labelKey: 'systemCyberpunk', badge: 'splat-badge--cyberpunk', newPath: '/cyberpunk/new', gameSystem: 'CYBERPUNK' },
  { key: 'ASOIAF', labelKey: 'systemAsoiaf', badge: 'splat-badge--asoiaf', newPath: '/asoiaf/new', gameSystem: 'ASOIAF' },
]

export default function NewCharacterModal({ open, onClose, chronicles, newCharPath, system }) {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedChronicle, setSelectedChronicle] = useState('')
  const [step, setStep] = useState(newCharPath ? 'chronicle' : 'system')
  const [chosenSystem, setChosenSystem] = useState(null)

  if (!open) return null

  const activePath = chosenSystem?.newPath || newCharPath || '/characters/new'
  const activeGameSystem = chosenSystem?.gameSystem || system || null

  // Filter chronicles to match the selected system
  const filteredChronicles = activeGameSystem
    ? chronicles.filter(c => (c.gameSystem || 'WOD') === activeGameSystem)
    : chronicles

  function handlePickSystem(sys) {
    setChosenSystem(sys)
    setSelectedChronicle('')
    setStep('chronicle')
  }

  function handleForMyself() {
    onClose()
    resetState()
    navigate(activePath)
  }

  function handleForChronicle() {
    if (!selectedChronicle) return
    onClose()
    resetState()
    navigate(`${activePath}?mode=guided&chronicle=${selectedChronicle}`)
  }

  function handleBack() {
    setStep('system')
    setChosenSystem(null)
    setSelectedChronicle('')
  }

  function resetState() {
    setStep(newCharPath ? 'chronicle' : 'system')
    setChosenSystem(null)
    setSelectedChronicle('')
  }

  function handleClose() {
    onClose()
    resetState()
  }

  return (
    <div className="modal-overlay" onClick={handleClose} role="dialog" aria-modal="true" aria-labelledby="newchar-modal-title"
      onKeyDown={e => { if (e.key === 'Escape') handleClose() }}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div aria-live="polite">

        {/* Step 1: Pick a game system (only when opened without a preset system) */}
        {step === 'system' && (
          <>
            <h3 id="newchar-modal-title">{t('pickSystemTitle')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
              {GAME_SYSTEMS.map((sys, idx) => (
                <button
                  key={sys.key}
                  className="modal-option-btn"
                  autoFocus={idx === 0}
                  onClick={() => handlePickSystem(sys)}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md)', textAlign: 'left' }}
                >
                  <span className={`splat-badge ${sys.badge}`} style={{ fontSize: '0.85rem', minWidth: '140px' }}>
                    {t(sys.labelKey)}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 2: For myself or for a chronicle */}
        {step === 'chronicle' && (
          <>
            <h3 id="newchar-modal-title">{t('newCharModalTitle')}</h3>
            {!newCharPath && (
              <p className="muted-hint" style={{ marginBottom: 'var(--space-sm)' }}>
                {t(chosenSystem?.labelKey || 'systemWoD')}
              </p>
            )}
            <div className="modal-options">
              <button className="modal-option-btn" autoFocus onClick={handleForMyself}>
                <span className="modal-option-label">{t('forMyself')}</span>
                <span className="modal-option-desc">{t('forMyselfDesc')}</span>
              </button>

              {filteredChronicles.length > 0 && (
                <>
                  <div className="modal-option-divider">{t('or')}</div>

                  <div className="modal-option-chronicle">
                    <label htmlFor="chronicle-select" className="modal-option-label">{t('forAChronicle')}</label>
                    <span className="modal-option-desc">{t('forAChronicleDesc')}</span>
                    <div className="modal-chronicle-select">
                      <select id="chronicle-select" value={selectedChronicle} onChange={e => setSelectedChronicle(e.target.value)}>
                        <option value="">{t('selectChronicleForAST')}</option>
                        {filteredChronicles.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      <button
                        className="btn btn-primary"
                        disabled={!selectedChronicle}
                        onClick={handleForChronicle}
                      >
                        {t('proceed')}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            {!newCharPath && (
              <button className="btn btn-secondary" onClick={handleBack} style={{ marginTop: 'var(--space-sm)' }}>
                {t('back')}
              </button>
            )}
          </>
        )}

        </div>
        <button className="modal-close" onClick={handleClose}>{t('cancel')}</button>
      </div>
    </div>
  )
}
