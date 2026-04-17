import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'

export default function NewCharacterModal({ open, onClose, chronicles }) {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedChronicle, setSelectedChronicle] = useState('')

  if (!open) return null

  function handleForMyself() {
    onClose()
    navigate('/characters/new')
  }

  function handleForChronicle() {
    if (!selectedChronicle) return
    onClose()
    navigate(`/characters/new?mode=guided&chronicle=${selectedChronicle}`)
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="newchar-modal-title"
      onKeyDown={e => { if (e.key === 'Escape') onClose() }}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3 id="newchar-modal-title">{t('newCharModalTitle')}</h3>
        <div className="modal-options">
          <button className="modal-option-btn" onClick={handleForMyself}>
            <span className="modal-option-icon">🎭</span>
            <span className="modal-option-label">{t('forMyself')}</span>
            <span className="modal-option-desc">{t('forMyselfDesc')}</span>
          </button>

          <div className="modal-option-divider">{t('or')}</div>

          <div className="modal-option-chronicle">
            <span className="modal-option-icon">📜</span>
            <span className="modal-option-label">{t('forAChronicle')}</span>
            <span className="modal-option-desc">{t('forAChronicleDesc')}</span>
            <div className="modal-chronicle-select">
              <select value={selectedChronicle} onChange={e => setSelectedChronicle(e.target.value)}>
                <option value="">{t('selectChronicleForAST')}</option>
                {chronicles.map(c => (
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
        </div>
        <button className="modal-close" onClick={onClose}>{t('cancel')}</button>
      </div>
    </div>
  )
}
