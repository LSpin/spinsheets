import { useLanguage } from '../i18n/LanguageContext'

/**
 * Reusable detail panel for disciplines, backgrounds, gifts, rotes, etc.
 *
 * Props:
 *   entry  – catalog object with at least { name/value, description? }
 *   level  – current level (for highlighting in levels array)
 *   levels – optional array of level descriptions (index 0 = level 1)
 *   extra  – optional extra metadata string (e.g. "Level 3 · Auspex")
 *   onClose – callback to dismiss the panel
 */
export default function TagInfoPanel({ entry, level, levels, extra, onClose }) {
  const { t } = useLanguage()
  if (!entry) return null

  const name = entry.name || entry.value || ''

  return (
    <aside className="tag-info-panel">
      <button className="tag-info-panel-close" onClick={onClose}>{t('close')}</button>
      <p className="tag-info-panel-name">{name}</p>
      {extra && <p className="tag-info-panel-desc">{extra}</p>}
      {entry.description && <p className="tag-info-panel-desc">{entry.description}</p>}
      {levels && levels.length > 0 && (
        <ul className="tag-info-levels">
          {levels.map((lvl, i) => (
            <li key={i} className={`tag-info-level${i + 1 === level ? ' tag-info-level--active' : ''}`}>
              {lvl}
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}
