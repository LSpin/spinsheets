import { useEffect, useRef } from 'react'

export default function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel }) {
  const confirmRef = useRef(null)

  useEffect(() => {
    if (open && confirmRef.current) {
      confirmRef.current.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleKey(e) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-content"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        style={{ maxWidth: 400, textAlign: 'center' }}
        onClick={e => e.stopPropagation()}
      >
        {title && <h3 id="confirm-dialog-title" style={{ marginBottom: '0.5rem' }}>{title}</h3>}
        <p id="confirm-dialog-message" style={{ margin: '1rem 0', lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={onCancel}>
            {cancelLabel || 'Cancel'}
          </button>
          <button className="btn btn-danger" onClick={onConfirm} ref={confirmRef}>
            {confirmLabel || 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
