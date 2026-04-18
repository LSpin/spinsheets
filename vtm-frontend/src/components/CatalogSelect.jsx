import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

/**
 * Searchable dropdown with descriptions for game term catalogues.
 *
 * @param {string}   id          - HTML id for the input
 * @param {string}   name        - Field name (passed to onChange)
 * @param {string}   label       - Display label
 * @param {string}   value       - Currently selected value (English key stored in DB)
 * @param {Function} onChange     - Called as onChange(name, value) or onChange(value) depending on mode
 * @param {Array}    catalog      - Array of { value, description } objects
 * @param {string}   [placeholder] - Placeholder text
 * @param {boolean}  [directOnChange] - If true, calls onChange(value) instead of onChange(name, value)
 * @param {boolean}  [showDescOnSelect] - If true, shows description below input when an item is selected
 */
export default function CatalogSelect({
  id, name, label: labelText, value, onChange, catalog,
  placeholder, directOnChange, showDescOnSelect = true,
}) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef(null)

  const selected = catalog.find(c => c.value === value)
  const filtered = catalog.filter(c => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return c.value.toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q)
  })

  useEffect(() => {
    function handle(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  function select(val) {
    if (directOnChange) onChange(val)
    else onChange(name, val)
    setOpen(false)
    setSearch('')
  }

  const [highlight, setHighlight] = useState(-1)

  function handleKeyDown(e) {
    if (e.key === 'Escape') { setOpen(false); setSearch(''); setHighlight(-1) }
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight(h => Math.min(h + 1, filtered.length - 1)); if (!open) setOpen(true) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight(h => Math.max(h - 1, 0)) }
    if (e.key === 'Enter') {
      e.preventDefault()
      if (highlight >= 0 && highlight < filtered.length) select(filtered[highlight].value)
      else if (filtered.length === 1) select(filtered[0].value)
    }
  }

  return (
    <div className="field archetype-field" ref={containerRef}>
      {labelText && <label htmlFor={id}>{labelText}</label>}
      <div className="archetype-combobox">
        <input
          id={id}
          type="text"
          autoComplete="off"
          placeholder={value ? t(value) : (placeholder || t('select'))}
          value={open ? search : (value ? t(value) : '')}
          onFocus={() => { setOpen(true); setSearch('') }}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls={`${id}-listbox`}
        />
        {value && !open && (
          <button
            className="archetype-clear"
            onClick={() => select('')}
            aria-label={`Clear ${labelText}`}
            tabIndex={-1}
          >×</button>
        )}
      </div>

      {open && (
        <ul className="archetype-dropdown" id={`${id}-listbox`} role="listbox">
          {filtered.length === 0 && (
            <li className="archetype-no-results">{t('noMatch')}</li>
          )}
          {filtered.map((c, idx) => (
            <li
              key={c.value}
              role="option"
              aria-selected={c.value === value}
              className={`archetype-option${c.value === value ? ' archetype-option--selected' : ''}${idx === highlight ? ' archetype-option--highlight' : ''}`}
              onMouseDown={() => select(c.value)}
              onMouseEnter={() => setHighlight(idx)}
            >
              <span className="archetype-option-name">{t(c.value)}</span>
              {c.description && (
                <span className="archetype-option-desc">{c.description}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {showDescOnSelect && selected?.description && !open && (
        <p className="archetype-desc">{selected.description}</p>
      )}
    </div>
  )
}
