import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { addMerit, removeMerit, addFlaw, removeFlaw } from '../api/characterApi'

function CatalogList({ items, getCost, selectedIds, onAdd, onPreview, ariaLabel }) {
  const { t } = useLanguage()
  return (
    <ul className="catalog-list" aria-label={ariaLabel}>
      {items.length === 0 && <li className="catalog-empty">{t('noMatchFound')}</li>}
      {items.map(item => {
        const already = selectedIds?.has(item.id)
        return (
          <li key={item.id} className={`catalog-item${already ? ' catalog-item--added' : ''}`}>
            <button
              className="catalog-item-btn"
              onClick={() => { if (!already) onAdd(item); else onPreview?.(item) }}
              aria-label={already ? `${item.name} — already added` : `Add ${item.name}`}
              aria-pressed={already}
            >
              <div className="catalog-item-main">
                <span className="catalog-item-name">{item.name}</span>
                {item.description && (
                  <span className="catalog-item-desc">{item.description}</span>
                )}
              </div>
              <div className="catalog-item-meta">
                {getCost?.(item) != null && (
                  <span className="catalog-item-cost">{getCost(item)}pt</span>
                )}
                {already
                  ? <span className="catalog-item-check">✓</span>
                  : <span className="catalog-item-add">+</span>
                }
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default function MeritsFlawsSection({ characterId, merits, setMerits, flaws, setFlaws, meritCatalog, flawCatalog }) {
  const { t } = useLanguage()
  const [meritSearch, setMeritSearch] = useState('')
  const [flawSearch, setFlawSearch] = useState('')
  const [mfInfo, setMfInfo] = useState(null)

  const filteredMerits = meritCatalog.filter(m => m.name.toLowerCase().includes(meritSearch.toLowerCase()))
  const filteredFlaws  = flawCatalog.filter(f => f.name.toLowerCase().includes(flawSearch.toLowerCase()))

  async function handleAddMerit(merit) {
    try {
      const res = await addMerit(characterId, { meritId: merit.id, pointsSpent: merit.cost })
      setMerits(prev => [...prev, res.data])
    } catch {}
  }

  async function handleRemoveMerit(id) {
    try {
      await removeMerit(characterId, id)
      setMerits(prev => prev.filter(m => m.id !== id))
    } catch {}
  }

  async function handleAddFlaw(flaw) {
    try {
      const res = await addFlaw(characterId, { flawId: flaw.id, pointsGained: flaw.bonus })
      setFlaws(prev => [...prev, res.data])
    } catch {}
  }

  async function handleRemoveFlaw(id) {
    try {
      await removeFlaw(characterId, id)
      setFlaws(prev => prev.filter(f => f.id !== id))
    } catch {}
  }

  return (
    <div className="form-section">
      <fieldset>
        <legend>{t('merits')}</legend>
        {merits.length > 0 && (
          <ul className="tag-list" aria-label="Selected merits">
            {merits.map(m => (
              <li
                key={m.id}
                className={`tag tag--clickable${m.id === mfInfo?.id ? ' tag--active' : ''}`}
                onClick={() => setMfInfo(i => i?.id === m.id ? null : { ...m, kind: 'merit' })}
              >
                {m.merit?.name ?? t('merits')} ({m.pointsSpent}pt)
                <button
                  className="tag-remove"
                  onClick={e => { e.stopPropagation(); handleRemoveMerit(m.id); if (mfInfo?.id === m.id) setMfInfo(null) }}
                  aria-label={`Remove ${m.merit?.name}`}
                >×</button>
              </li>
            ))}
          </ul>
        )}
        <div className="catalog-search-wrap">
          <input id="merit-search" type="search" value={meritSearch}
            onChange={e => setMeritSearch(e.target.value)}
            placeholder={t('searchMeritsLabel')}
            aria-label={t('searchMeritsLabel')} />
          <span className="catalog-search-count">
            {filteredMerits.length > 30
              ? `30 / ${filteredMerits.length}`
              : filteredMerits.length}
          </span>
        </div>
        <CatalogList
          items={filteredMerits.slice(0, 30)}
          getCost={m => m.cost}
          selectedIds={new Set(merits.map(m => m.merit?.id).filter(Boolean))}
          onAdd={handleAddMerit}
          onPreview={m => setMfInfo({ id: -1, kind: 'merit', merit: m, pointsSpent: m.cost })}
          ariaLabel="Merit catalog"
        />
      </fieldset>

      <hr className="divider" />

      <fieldset>
        <legend>{t('flaws')}</legend>
        {flaws.length > 0 && (
          <ul className="tag-list" aria-label="Selected flaws">
            {flaws.map(f => (
              <li
                key={f.id}
                className={`tag tag--clickable${f.id === mfInfo?.id ? ' tag--active' : ''}`}
                onClick={() => setMfInfo(i => i?.id === f.id ? null : { ...f, kind: 'flaw' })}
              >
                {f.flaw?.name ?? t('flaws')} ({f.pointsGained}pt)
                <button
                  className="tag-remove"
                  onClick={e => { e.stopPropagation(); handleRemoveFlaw(f.id); if (mfInfo?.id === f.id) setMfInfo(null) }}
                  aria-label={`Remove ${f.flaw?.name}`}
                >×</button>
              </li>
            ))}
          </ul>
        )}
        <div className="catalog-search-wrap">
          <input id="flaw-search" type="search" value={flawSearch}
            onChange={e => setFlawSearch(e.target.value)}
            placeholder={t('searchFlawsLabel')}
            aria-label={t('searchFlawsLabel')} />
          <span className="catalog-search-count">
            {filteredFlaws.length > 30
              ? `30 / ${filteredFlaws.length}`
              : filteredFlaws.length}
          </span>
        </div>
        <CatalogList
          items={filteredFlaws.slice(0, 30)}
          getCost={f => f.bonus}
          selectedIds={new Set(flaws.map(f => f.flaw?.id).filter(Boolean))}
          onAdd={handleAddFlaw}
          onPreview={f => setMfInfo({ id: -1, kind: 'flaw', flaw: f, pointsGained: f.bonus })}
          ariaLabel="Flaw catalog"
        />
      </fieldset>

      {mfInfo && (() => {
        const entry  = mfInfo.kind === 'merit' ? mfInfo.merit : mfInfo.flaw
        const points = mfInfo.kind === 'merit' ? `${mfInfo.pointsSpent}pt` : `${mfInfo.pointsGained}pt`
        if (!entry) return null
        return (
          <aside className="tag-info-panel">
            <button className="tag-info-panel-close" onClick={() => setMfInfo(null)}>{t('close')}</button>
            <p className="tag-info-panel-name">{entry.name}</p>
            <p className="tag-info-panel-desc">
              {mfInfo.kind === 'merit' ? t('merit') : t('flaw')} · {points}
              {entry.costObs ? ` (${entry.costObs})` : ''}
              {entry.source ? ` · ${entry.source}${entry.page ? ` p.${entry.page}` : ''}` : ''}
            </p>
            {entry.description && (
              <p style={{ fontSize: '0.82rem', lineHeight: 1.55, color: 'var(--color-text)' }}>
                {entry.description}
              </p>
            )}
          </aside>
        )
      })()}
    </div>
  )
}
