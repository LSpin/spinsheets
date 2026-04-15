import { useNavigate } from 'react-router-dom'

const SPLATS = [
  {
    id: 'vampire',
    name: 'Vampire',
    subtitle: 'The Masquerade',
    description: 'Play as one of the Kindred — an immortal predator hiding among mortals, bound by the traditions of the Camarilla, the chaos of the Sabbat, or the freedom of the Anarchs.',
    color: '#cc2222',
  },
  {
    id: 'werewolf',
    name: 'Werewolf',
    subtitle: 'The Apocalypse',
    description: 'Play as one of the Garou — a shapeshifting warrior born to defend Gaia against the corruption of the Wyrm, torn between Rage and the spirit world.',
    color: '#7a8b3a',
  },
  {
    id: 'mage',
    name: 'Mage',
    subtitle: 'The Ascension',
    description: 'Play as one of the Awakened — a mortal who has glimpsed the true nature of reality and wields the power to reshape it through will, belief, and paradigm.',
    color: '#6a4caa',
  },
  {
    id: 'vampire-revised',
    name: 'Vampire',
    subtitle: 'The Masquerade (Revised)',
    description: 'Play as one of the Kindred using the classic Revised Edition rules — the definitive 1998 edition of Vampire: The Masquerade.',
    color: '#991111',
  },
  {
    id: 'kote',
    name: 'Kindred of the East',
    subtitle: 'The Turning',
    description: 'Play as one of the Kuei-jin — a risen soul returned from the spirit world, balancing Yin and Yang while walking the path of Dharma.',
    color: '#c4a32e',
  },
]

export default function SplatSelectPage() {
  const navigate = useNavigate()

  return (
    <section aria-labelledby="splat-heading">
      <div className="character-list-header">
        <h2 id="splat-heading">New Character</h2>
      </div>
      <p className="muted-hint" style={{ marginBottom: 'var(--space-xl)' }}>
        Choose your World of Darkness game line.
      </p>
      <div className="splat-grid">
        {SPLATS.map(splat => (
          <button
            key={splat.id}
            className="splat-card"
            onClick={() => navigate(`/characters/new/${splat.id}`)}
            style={{ '--splat-color': splat.color }}
          >
            <div className="splat-card-header">
              <h3 className="splat-card-name">{splat.name}</h3>
              <span className="splat-card-subtitle">{splat.subtitle}</span>
            </div>
            <p className="splat-card-desc">{splat.description}</p>
            <span className="splat-card-cta">Create {splat.name}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
