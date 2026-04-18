import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { createChronicle } from '../api/chronicleApi'

const SYSTEM_LABEL_KEYS = {
  WOD: 'systemWoD',
  SEVENTH_SEA: 'system7thSea',
  L5R: 'systemL5R',
  BLADES: 'systemBlades',
  DND: 'systemDnd',
  UESTRPG: 'systemUestrpg',
}

export default function ChronicleForm({ system = 'WOD', basePath = '/chronicles' }) {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const systemLabel = t(SYSTEM_LABEL_KEYS[system] || 'systemWoD')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) { setError(t('nameRequired')); return }
    setSubmitting(true)
    setError(null)
    try {
      const res = await createChronicle({ name: name.trim(), description: description.trim(), gameSystem: system })
      navigate(`${basePath}/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.error || t('failedCreateChronicle'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section aria-labelledby="new-chronicle-heading">
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate(basePath)}>{t('back')}</button>
        <h2 id="new-chronicle-heading">{systemLabel} — {t('newChronicleTitle')}</h2>
      </div>
      <div className="form-section" style={{ maxWidth: 500 }}>
        <form onSubmit={handleSubmit}>
          {error && <p className="status-error" role="alert">{error}</p>}
          <div className="field">
            <label htmlFor="name">{t('chronicleName')}</label>
            <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required autoComplete="off" placeholder={t('chronicleNamePh')} />
          </div>
          <div className="field">
            <label htmlFor="description">{t('chronicleDescLabel')}</label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder={t('chronicleDescPh')} />
          </div>
          <div className="form-actions" style={{ borderTop: 'none', paddingTop: 0 }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? t('creating') : t('createChronicleBtn')}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
