import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createChronicle } from '../api/chronicleApi'

export default function ChronicleForm() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) { setError('Name is required'); return }
    setSubmitting(true)
    setError(null)
    try {
      const res = await createChronicle({ name: name.trim(), description: description.trim() })
      navigate(`/chronicles/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create chronicle')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section aria-labelledby="new-chronicle-heading">
      <div className="form-header">
        <button className="btn btn-secondary" onClick={() => navigate('/chronicles')}>Back</button>
        <h2 id="new-chronicle-heading">New Chronicle</h2>
      </div>
      <div className="form-section" style={{ maxWidth: 500 }}>
        <form onSubmit={handleSubmit}>
          {error && <p className="status-error" role="alert">{error}</p>}
          <div className="field">
            <label htmlFor="name">Chronicle Name</label>
            <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required autoComplete="off" placeholder="e.g. Shadows of Stockholm" />
          </div>
          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="A brief overview of your chronicle..." />
          </div>
          <div className="form-actions" style={{ borderTop: 'none', paddingTop: 0 }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create chronicle'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
