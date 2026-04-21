import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { getSorceryPaths, addSorceryPath, removeSorceryPath, getRituals, addRitual, removeRitual } from '../api/characterApi'
import { SORCERY_PATHS, RITUALS } from '../data/bloodSorcery'

// ── SearchableInput ──

function SearchableInput({ id, label: labelText, catalog, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  const filtered = catalog.filter(c =>
    c.value.toLowerCase().includes(value.toLowerCase()) ||
    c.description.toLowerCase().includes(value.toLowerCase())
  )
  const matched = catalog.find(c => c.value.toLowerCase() === value.toLowerCase())

  useEffect(() => {
    function handle(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  function select(val) {
    onChange(val)
    setOpen(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') setOpen(false)
    if (e.key === 'Enter' && filtered.length === 1) select(filtered[0].value)
  }

  return (
    <div className="field archetype-field" ref={containerRef}>
      <label htmlFor={id}>{labelText}</label>
      <div className="archetype-combobox">
        <input
          id={id}
          type="text"
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onChange={e => { onChange(e.target.value); setOpen(true) }}
          onKeyDown={handleKeyDown}
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls={`${id}-listbox`}
        />
        {value && (
          <button
            className="archetype-clear"
            onClick={() => { onChange(''); setOpen(false) }}
            aria-label={`Clear ${labelText}`}
            tabIndex={-1}
          >×</button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <ul className="archetype-dropdown" id={`${id}-listbox`} role="listbox">
          {filtered.map(c => (
            <li
              key={c.value}
              role="option"
              aria-selected={c.value === value}
              className={`archetype-option${c.value === value ? ' archetype-option--selected' : ''}`}
              onMouseDown={e => { e.preventDefault(); select(c.value) }}
            >
              <span className="archetype-option-name">{c.value}</span>
              <span className="archetype-option-desc">{c.description}</span>
            </li>
          ))}
        </ul>
      )}

      {matched && !open && (
        <p className="archetype-desc">{matched.description}</p>
      )}
    </div>
  )
}

// ── Helpers ──

function getLevelHint(catalog, name, level) {
  const entry = catalog.find(c => c.value.toLowerCase() === name.toLowerCase())
  return entry?.levels?.[level - 1] ?? ''
}

// ── BloodSorcerySection ──

export default function BloodSorcerySection({ characterId, elderMax = 5 }) {
  const { t } = useLanguage()
  const [sorceryPaths, setSorceryPaths] = useState([])
  const [rituals, setRituals] = useState([])
  const [newPath, setNewPath] = useState({ name: '', level: 1 })
  const [newRitual, setNewRitual] = useState({ name: '', level: 1, notes: '' })
  const [sorcInfo, setSorcInfo] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [traditionFilter, setTraditionFilter] = useState('all')

  const traditions = [...new Set(SORCERY_PATHS.map(p => p.tradition).filter(Boolean))].sort()
  const filteredPaths = traditionFilter === 'all' ? SORCERY_PATHS : SORCERY_PATHS.filter(p => p.tradition === traditionFilter)
  const filteredRituals = traditionFilter === 'all' ? RITUALS : RITUALS.filter(r => r.tradition === traditionFilter)

  useEffect(() => {
    if (!characterId) return
    Promise.all([getSorceryPaths(characterId), getRituals(characterId)])
      .then(([pathRes, ritRes]) => { setSorceryPaths(pathRes.data); setRituals(ritRes.data) })
      .catch(() => { setActionError(t('failedToLoad')) })
  }, [characterId])

  async function handleAddPath() {
    if (!newPath.name.trim() || !characterId) return
    try {
      const res = await addSorceryPath(characterId, newPath)
      setSorceryPaths(prev => [...prev, res.data])
      setNewPath({ name: '', level: 1 })
    } catch { setActionError(t('failedToSave')) }
  }

  async function handleRemovePath(id) {
    try {
      await removeSorceryPath(characterId, id)
      setSorceryPaths(prev => prev.filter(p => p.id !== id))
    } catch { setActionError(t('failedToSave')) }
  }

  async function handleAddRitual() {
    if (!newRitual.name.trim() || !characterId) return
    try {
      const res = await addRitual(characterId, newRitual)
      setRituals(prev => [...prev, res.data])
      setNewRitual({ name: '', level: 1, notes: '' })
    } catch { setActionError(t('failedToSave')) }
  }

  async function handleRemoveRitual(id) {
    try {
      await removeRitual(characterId, id)
      setRituals(prev => prev.filter(r => r.id !== id))
    } catch { setActionError(t('failedToSave')) }
  }

  return (
    <div className="disc-bg-layout">
      <div className="form-section">
        {actionError && <p className="status-error" role="alert">{actionError}</p>}
        <div style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <label htmlFor="tradition-filter" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t('sorceryFilterTradition')}</label>
          <select id="tradition-filter" value={traditionFilter} onChange={e => setTraditionFilter(e.target.value)} style={{ fontSize: '0.85rem' }}>
            <option value="all">{t('filterAll')}</option>
            {traditions.map(tr => <option key={tr} value={tr}>{tr}</option>)}
          </select>
        </div>
        {/* ── Paths ── */}
        <fieldset>
          <legend>{t('sorceryPaths')}</legend>
          <ul className="tag-list" aria-label="Known paths">
            {sorceryPaths.map(p => (
              <li
                key={p.id}
                className={`tag${sorcInfo?.id === p.id ? ' tag--active' : ''}`}
                onClick={() => setSorcInfo(i => i?.id === p.id ? null : { ...p, kind: 'path' })}
                role="button"
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click() } }}
                title={getLevelHint(SORCERY_PATHS, p.name, p.level)}
              >
                {p.name} {p.level}
                <button className="tag-remove" onClick={e => { e.stopPropagation(); handleRemovePath(p.id) }} aria-label={`Remove ${p.name}`}>×</button>
              </li>
            ))}
          </ul>
          <div className="field-row">
            <SearchableInput
              id="path-name"
              label={t('pathNameLabel')}
              catalog={filteredPaths}
              value={newPath.name}
              onChange={val => setNewPath(p => ({ ...p, name: val }))}
              placeholder={t('phPath')}
            />
            <div className="field">
              <label htmlFor="path-level">{t('level')}</label>
              <select id="path-level" value={newPath.level}
                onChange={e => setNewPath(p => ({ ...p, level: parseInt(e.target.value) }))}>
                {Array.from({ length: elderMax }, (_, i) => i + 1).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <button className="btn btn-secondary" onClick={handleAddPath}>{t('add')}</button>
          </div>
          {getLevelHint(SORCERY_PATHS, newPath.name, newPath.level) && (
            <p className="archetype-desc">{getLevelHint(SORCERY_PATHS, newPath.name, newPath.level)}</p>
          )}
        </fieldset>

        <hr className="divider" />

        {/* ── Rituals ── */}
        <fieldset>
          <legend>{t('rituals')}</legend>
          {[1,2,3,4,5,6,7,8].filter(lvl => rituals.some(r => r.level === lvl)).map(lvl => (
            <div key={lvl} style={{ marginBottom: 'var(--space-md)' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xs)', fontWeight: 600 }}>
                {t('level')} {lvl}
              </p>
              <ul className="tag-list" aria-label={`Level ${lvl} rituals`}>
                {rituals.filter(r => r.level === lvl).map(r => (
                  <li
                    key={r.id}
                    className={`tag${sorcInfo?.id === r.id ? ' tag--active' : ''}`}
                    onClick={() => setSorcInfo(i => i?.id === r.id ? null : { ...r, kind: 'ritual' })}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click() } }}
                    title={RITUALS.find(c => c.value === r.name)?.description}
                  >
                    {r.name}
                    <button className="tag-remove" onClick={e => { e.stopPropagation(); handleRemoveRitual(r.id) }} aria-label={`Remove ${r.name}`}>×</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {rituals.length === 0 && <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>{t('noRitualsYet')}</p>}
          <div className="field-row">
            <SearchableInput
              id="ritual-name"
              label={t('ritualNameLabel')}
              catalog={filteredRituals}
              value={newRitual.name}
              onChange={val => {
                const match = RITUALS.find(r => r.value === val)
                setNewRitual(p => ({ ...p, name: val, level: match ? match.level : p.level }))
              }}
              placeholder={t('phRitual')}
            />
            <div className="field">
              <label htmlFor="ritual-level">{t('level')}</label>
              <select id="ritual-level" value={newRitual.level}
                onChange={e => setNewRitual(p => ({ ...p, level: parseInt(e.target.value) }))}>
                {Array.from({ length: elderMax }, (_, i) => i + 1).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <button className="btn btn-secondary" onClick={handleAddRitual}>{t('add')}</button>
          </div>
          {(() => {
            const match = RITUALS.find(r => r.value === newRitual.name)
            return match ? <p className="archetype-desc">{match.description}</p> : null
          })()}
        </fieldset>
      </div>

      {sorcInfo && (() => {
        if (sorcInfo.kind === 'path') {
          const entry = SORCERY_PATHS.find(p => p.value === sorcInfo.name)
          return (
            <aside className="tag-info-panel">
              <button className="tag-info-panel-close" onClick={() => setSorcInfo(null)}>{t('close')}</button>
              <p className="tag-info-panel-name">{sorcInfo.name}</p>
              {entry?.description && <p className="tag-info-panel-desc">{entry.description}</p>}
              {entry?.levels && (
                <ul className="tag-info-levels">
                  {entry.levels.map((lvl, i) => (
                    <li key={i} className={`tag-info-level${i + 1 === sorcInfo.level ? ' tag-info-level--active' : ''}`}>
                      {lvl}
                    </li>
                  ))}
                </ul>
              )}
            </aside>
          )
        }
        const entry = RITUALS.find(r => r.value === sorcInfo.name)
        return (
          <aside className="tag-info-panel">
            <button className="tag-info-panel-close" onClick={() => setSorcInfo(null)}>{t('close')}</button>
            <p className="tag-info-panel-name">{sorcInfo.name}</p>
            <p className="tag-info-panel-desc">{t('level')} {sorcInfo.level}</p>
            {entry?.description && (
              <p style={{ fontSize: '0.82rem', lineHeight: 1.55, color: 'var(--color-text)' }}>
                {entry.description}
              </p>
            )}
            {sorcInfo.notes && (
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic', marginTop: 'var(--space-sm)' }}>
                {sorcInfo.notes}
              </p>
            )}
          </aside>
        )
      })()}
    </div>
  )
}
