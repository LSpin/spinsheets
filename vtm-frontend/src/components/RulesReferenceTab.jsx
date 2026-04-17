import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

export default function RulesReferenceTab({ rules, title }) {
  const { t } = useLanguage()
  const [filter, setFilter] = useState('')

  const q = filter.toLowerCase()
  const filtered = filter
    ? rules.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.sections.some(s =>
          s.heading.toLowerCase().includes(q) ||
          s.text.toLowerCase().includes(q)
        )
      )
    : rules

  return (
    <div className="form-section">
      <fieldset>
        <legend>{title || t('tabRulesRef')}</legend>
        <p className="muted-hint muted-hint--xs" style={{ marginBottom: 'var(--space-sm)' }}>
          {t('rulesRefHint')}
        </p>
        <div className="catalog-search-wrap" style={{ marginBottom: 'var(--space-md)' }}>
          <input type="search" value={filter} onChange={e => setFilter(e.target.value)}
            placeholder={t('rulesRefSearch')} aria-label={t('rulesRefSearch')} />
        </div>
      </fieldset>

      {filtered.length === 0 && (
        <p className="muted-hint">{t('noMatchFound')}</p>
      )}

      {filtered.map(rule => (
        <fieldset key={rule.title}>
          <details open={!!filter}>
            <summary className="rules-ref-summary">{rule.title}</summary>
            <dl className="rules-ref-content">
              {rule.sections
                .filter(s => !filter || s.heading.toLowerCase().includes(q) || s.text.toLowerCase().includes(q) || rule.title.toLowerCase().includes(q))
                .map(s => (
                  <div key={s.heading} className="rules-ref-entry">
                    <dt className="rules-ref-term">{s.heading}</dt>
                    <dd className="rules-ref-desc">{s.text}</dd>
                  </div>
                ))
              }
            </dl>
          </details>
        </fieldset>
      ))}
    </div>
  )
}
