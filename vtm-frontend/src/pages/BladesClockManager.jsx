import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../context/ThemeContext'

const STORAGE_KEY = 'blades-clocks'
const CLOCK_SIZES = [4, 6, 8, 12]
const CLOCK_TYPES = [
  { value: 'progress', label: 'Progress', color: '#4dabf7' },
  { value: 'danger', label: 'Danger', color: '#fa5252' },
  { value: 'racing', label: 'Racing', color: '#fcc419' },
  { value: 'faction', label: 'Faction', color: '#845ef7' },
  { value: 'project', label: 'Long-term Project', color: '#51cf66' },
  { value: 'custom', label: 'Custom', color: '#868e96' },
]

const TYPE_COLORS = Object.fromEntries(CLOCK_TYPES.map(ct => [ct.value, ct.color]))

function loadClocks() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function saveClocks(clocks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clocks))
}

function ClockSVG({ segments, filled, size = 120, onClick, typeColor }) {
  const r = size / 2 - 3
  const cx = size / 2
  const cy = size / 2
  const slices = []
  for (let i = 0; i < segments; i++) {
    const startAngle = (i / segments) * 2 * Math.PI - Math.PI / 2
    const endAngle = ((i + 1) / segments) * 2 * Math.PI - Math.PI / 2
    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    const largeArc = segments <= 2 ? 1 : 0
    const d = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`
    slices.push(
      <path key={i} d={d}
        fill={i < filled ? (typeColor || 'var(--accent)') : 'var(--surface-2, #1a1a2e)'}
        stroke="var(--text-muted, #555)" strokeWidth="1.5"
        style={{ cursor: 'pointer', transition: 'fill 0.15s' }}
        onClick={() => onClick(i)}
        role="button" tabIndex={0}
        aria-label={`Segment ${i + 1} of ${segments}${i < filled ? ' (filled)' : ' (empty)'}`}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(i) } }}
      />
    )
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
      {slices}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--text-muted, #555)" strokeWidth="2.5" />
    </svg>
  )
}

export default function BladesClockManager() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { switchTheme } = useTheme()

  const [clocks, setClocks] = useState(loadClocks)
  const [newName, setNewName] = useState('')
  const [newSize, setNewSize] = useState(4)
  const [newType, setNewType] = useState('progress')
  const [newGroup, setNewGroup] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterGroup, setFilterGroup] = useState('all')

  useEffect(() => { switchTheme('blades') }, [])
  useEffect(() => { saveClocks(clocks) }, [clocks])

  const groups = [...new Set(clocks.map(c => c.group).filter(Boolean))].sort()

  function addClock() {
    if (!newName.trim()) return
    setClocks(prev => [...prev, {
      id: Date.now(),
      name: newName.trim(),
      segments: newSize,
      filled: 0,
      type: newType,
      group: newGroup.trim() || null,
    }])
    setNewName('')
  }

  function tickClock(id, segmentIndex) {
    setClocks(prev => prev.map(c => {
      if (c.id !== id) return c
      const newFilled = segmentIndex < c.filled ? segmentIndex : segmentIndex + 1
      return { ...c, filled: newFilled }
    }))
  }

  function resetClock(id) {
    setClocks(prev => prev.map(c => c.id === id ? { ...c, filled: 0 } : c))
  }

  function removeClock(id) {
    setClocks(prev => prev.filter(c => c.id !== id))
  }

  function clearCompleted() {
    setClocks(prev => prev.filter(c => c.filled < c.segments))
  }

  function clearAll() {
    if (!confirm(t('bladesClockClearAllConfirm'))) return
    setClocks([])
  }

  const filtered = clocks.filter(c => {
    if (filterType !== 'all' && c.type !== filterType) return false
    if (filterGroup !== 'all' && (c.group || '') !== filterGroup) return false
    return true
  })

  // Group clocks by their group field for display
  const grouped = {}
  for (const c of filtered) {
    const g = c.group || t('bladesClockUngrouped')
    if (!grouped[g]) grouped[g] = []
    grouped[g].push(c)
  }
  const groupNames = Object.keys(grouped).sort((a, b) => {
    if (a === t('bladesClockUngrouped')) return 1
    if (b === t('bladesClockUngrouped')) return -1
    return a.localeCompare(b)
  })

  const completedCount = clocks.filter(c => c.filled >= c.segments).length

  return (
    <section aria-labelledby="clock-heading">
      <div className="character-list-header">
        <div>
          <button className="btn btn-secondary" onClick={() => navigate('/blades')} style={{ marginRight: 'var(--space-sm)' }}>
            {t('back')}
          </button>
          <h2 id="clock-heading" style={{ display: 'inline' }}>{t('bladesClockManagerTitle')}</h2>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          {completedCount > 0 && (
            <button className="btn btn-secondary" onClick={clearCompleted}>
              {t('bladesClockClearCompleted')} ({completedCount})
            </button>
          )}
          {clocks.length > 0 && (
            <button className="btn btn-danger" onClick={clearAll}>
              {t('bladesClockClearAll')}
            </button>
          )}
        </div>
      </div>

      {/* Create clock form */}
      <div className="form-section" style={{ marginBottom: 'var(--space-lg)' }}>
        <fieldset>
          <legend>{t('bladesClockNew')}</legend>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="field" style={{ flex: '1 1 200px' }}>
              <label htmlFor="cm-name">{t('bladesClockName')}</label>
              <input id="cm-name" value={newName} onChange={e => setNewName(e.target.value)}
                placeholder={t('bladesClockNamePh')}
                onKeyDown={e => { if (e.key === 'Enter') addClock() }} />
            </div>
            <div className="field" style={{ flex: '0 0 110px' }}>
              <label htmlFor="cm-size">{t('bladesClockSize')}</label>
              <select id="cm-size" value={newSize} onChange={e => setNewSize(Number(e.target.value))}>
                {CLOCK_SIZES.map(s => <option key={s} value={s}>{s} {t('bladesSegments')}</option>)}
              </select>
            </div>
            <div className="field" style={{ flex: '0 0 160px' }}>
              <label htmlFor="cm-type">{t('bladesClockType')}</label>
              <select id="cm-type" value={newType} onChange={e => setNewType(e.target.value)}>
                {CLOCK_TYPES.map(ct => <option key={ct.value} value={ct.value}>{ct.label}</option>)}
              </select>
            </div>
            <div className="field" style={{ flex: '0 0 160px' }}>
              <label htmlFor="cm-group">{t('bladesClockGroup')}</label>
              <input id="cm-group" value={newGroup} onChange={e => setNewGroup(e.target.value)}
                placeholder={t('bladesClockGroupPh')} list="clock-groups" />
              {groups.length > 0 && (
                <datalist id="clock-groups">
                  {groups.map(g => <option key={g} value={g} />)}
                </datalist>
              )}
            </div>
            <button type="button" className="btn btn-primary" style={{ height: 'fit-content' }} onClick={addClock}>
              {t('bladesAddClock')}
            </button>
          </div>
        </fieldset>
      </div>

      {/* Filters */}
      {clocks.length > 0 && (
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', marginBottom: 'var(--space-md)', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <label htmlFor="filter-type" style={{ fontSize: '0.82rem', fontWeight: 600 }}>{t('bladesClockFilterType')}:</label>
            <select id="filter-type" value={filterType} onChange={e => setFilterType(e.target.value)} style={{ fontSize: '0.82rem' }}>
              <option value="all">{t('allChronicles')}</option>
              {CLOCK_TYPES.map(ct => <option key={ct.value} value={ct.value}>{ct.label}</option>)}
            </select>
          </div>
          {groups.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <label htmlFor="filter-group" style={{ fontSize: '0.82rem', fontWeight: 600 }}>{t('bladesClockFilterGroup')}:</label>
              <select id="filter-group" value={filterGroup} onChange={e => setFilterGroup(e.target.value)} style={{ fontSize: '0.82rem' }}>
                <option value="all">{t('allChronicles')}</option>
                {groups.map(g => <option key={g} value={g}>{g}</option>)}
                <option value="">{t('bladesClockUngrouped')}</option>
              </select>
            </div>
          )}
          <span className="muted-hint" style={{ marginLeft: 'auto' }}>
            {filtered.length} {t('bladesClockOf')} {clocks.length} {t('bladesClockShowing')}
          </span>
        </div>
      )}

      {/* Empty state */}
      {clocks.length === 0 && (
        <div className="empty-state" style={{ padding: 'var(--space-2xl)' }}>
          <h3>{t('bladesClockEmptyTitle')}</h3>
          <p className="muted-hint">{t('bladesClockEmptyDesc')}</p>
        </div>
      )}

      {/* Clock display, grouped */}
      {groupNames.map(groupName => (
        <div key={groupName} style={{ marginBottom: 'var(--space-xl)' }}>
          {groupNames.length > 1 && (
            <h3 style={{ borderBottom: '1px solid var(--text-muted, #555)', paddingBottom: 'var(--space-xs)', marginBottom: 'var(--space-md)', fontSize: '1rem' }}>
              {groupName}
            </h3>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-md)' }}>
            {grouped[groupName].map(clock => {
              const complete = clock.filled >= clock.segments
              return (
                <div key={clock.id} className="character-card" style={{
                  textAlign: 'center',
                  padding: 'var(--space-md)',
                  border: complete ? `2px solid ${TYPE_COLORS[clock.type] || '#868e96'}` : undefined,
                  opacity: complete ? 0.7 : 1,
                  position: 'relative',
                }}>
                  {complete && (
                    <div style={{
                      position: 'absolute', top: 8, right: 10,
                      fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                      color: TYPE_COLORS[clock.type] || '#868e96',
                      letterSpacing: '0.05em',
                    }}>{t('bladesClockComplete')}</div>
                  )}
                  <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.95rem' }}>{clock.name}</h4>
                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.7rem', padding: '1px 6px', borderRadius: '3px',
                      background: `${TYPE_COLORS[clock.type]}22`, color: TYPE_COLORS[clock.type],
                      fontWeight: 600,
                    }}>{clock.type}</span>
                    {clock.group && (
                      <span style={{
                        fontSize: '0.7rem', padding: '1px 6px', borderRadius: '3px',
                        background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)',
                      }}>{clock.group}</span>
                    )}
                  </div>
                  <ClockSVG segments={clock.segments} filled={clock.filled} size={120}
                    typeColor={TYPE_COLORS[clock.type]}
                    onClick={(i) => tickClock(clock.id, i)}
                  />
                  <div style={{ fontSize: '0.85rem', marginTop: '0.4rem', fontWeight: 600 }}>
                    {clock.filled} / {clock.segments}
                  </div>
                  <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                    <button type="button" className="btn btn-secondary" style={{ padding: '3px 10px', fontSize: '0.75rem' }}
                      onClick={() => resetClock(clock.id)}>{t('bladesClockReset')}</button>
                    <button type="button" className="btn btn-danger" style={{ padding: '3px 10px', fontSize: '0.75rem' }}
                      onClick={() => removeClock(clock.id)}>{t('deleteBtn')}</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </section>
  )
}
