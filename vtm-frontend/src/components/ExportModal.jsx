import { useState } from 'react'

export default function ExportModal({ open, onClose, tabKeys, t }) {
  const [selected, setSelected] = useState(() => new Set(tabKeys))

  if (!open) return null

  function toggle(key) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function selectAll() { setSelected(new Set(tabKeys)) }
  function selectNone() { setSelected(new Set()) }

  function handleExport() {
    // Build a set of indices to exclude
    const excludeIndices = new Set()
    tabKeys.forEach((tk, i) => {
      if (!selected.has(tk)) excludeIndices.add(i)
    })

    // Find the section element (form wrapper) closest to us
    // All forms render inside a <section> with tab panels as children
    const section = document.querySelector('section[aria-labelledby]')
    if (!section) { window.print(); onClose(); return }

    // Collect all tab panel elements (they have hidden attribute or role="tabpanel")
    // Panels appear in DOM order matching TAB_KEYS order
    const panels = []
    for (const child of section.children) {
      if (child.hasAttribute('hidden') || child.getAttribute('role') === 'tabpanel') {
        panels.push(child)
      }
    }

    // Mark excluded panels
    panels.forEach((panel, i) => {
      if (excludeIndices.has(i)) {
        panel.setAttribute('data-export-exclude', '')
      }
    })

    document.body.classList.add('exporting-pdf')

    setTimeout(() => {
      window.print()
      // Cleanup
      document.body.classList.remove('exporting-pdf')
      panels.forEach(p => p.removeAttribute('data-export-exclude'))
    }, 150)

    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true"
      aria-labelledby="export-modal-title"
      onKeyDown={e => { if (e.key === 'Escape') onClose() }}>
      <div className="modal-content" onClick={e => e.stopPropagation()}
        style={{ maxWidth: '500px' }}>
        <h3 id="export-modal-title">{t('exportTitle')}</h3>
        <p className="muted-hint mb-md">
          {t('exportDesc')}
        </p>

        <div className="flex gap-sm mb-md">
          <button className="btn btn-secondary" onClick={selectAll}
            style={{ fontSize: '0.8rem', padding: '4px 10px' }}>{t('exportSelectAll')}</button>
          <button className="btn btn-secondary" onClick={selectNone}
            style={{ fontSize: '0.8rem', padding: '4px 10px' }}>{t('exportSelectNone')}</button>
        </div>

        <div className="flex-col gap-xs mb-md p-sm border" style={{ maxHeight: '400px', overflowY: 'auto', borderRadius: '6px' }}>
          {tabKeys.map(tk => (
            <label key={tk} className="flex items-center gap-sm py-xs cursor-pointer text-md rounded"
              style={{ background: selected.has(tk) ? 'rgba(var(--accent-rgb, 100,100,255), 0.08)' : 'transparent' }}>
              <input type="checkbox" checked={selected.has(tk)}
                onChange={() => toggle(tk)} />
              <span className={selected.has(tk) ? 'font-semibold' : 'font-normal'}>{t(tk)}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-sm justify-end">
          <button className="btn btn-secondary" onClick={onClose}>{t('cancel')}</button>
          <button className="btn btn-primary" onClick={handleExport}
            disabled={selected.size === 0}>
            {t('exportDownload')} ({selected.size}/{tabKeys.length})
          </button>
        </div>
      </div>
    </div>
  )
}
