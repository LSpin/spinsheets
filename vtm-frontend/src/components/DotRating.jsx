export default function DotRating({ label, name, value, onChange, min = 0, max = 5 }) {
  const id = `rating-${name}`
  return (
    <div className="rating-field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value ?? min}
        onChange={e => onChange(name, parseInt(e.target.value))}
      >
        {Array.from({ length: max - min + 1 }, (_, i) => min + i).map(v => (
          <option key={v} value={v}>{v}</option>
        ))}
      </select>
    </div>
  )
}
