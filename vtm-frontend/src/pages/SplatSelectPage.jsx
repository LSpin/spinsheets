import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'

const SPLATS = [
  { id: 'vampire',          nameKey: 'splatVampire',         subKey: 'splatVampireSub',         descKey: 'splatVampireDesc',         color: '#cc2222' },
  { id: 'werewolf',         nameKey: 'splatWerewolf',        subKey: 'splatWerewolfSub',        descKey: 'splatWerewolfDesc',        color: '#7a8b3a' },
  { id: 'mage',             nameKey: 'splatMage',            subKey: 'splatMageSub',            descKey: 'splatMageDesc',            color: '#6a4caa' },
  { id: 'vampire-revised',  nameKey: 'splatVampireRevised',  subKey: 'splatVampireRevisedSub',  descKey: 'splatVampireRevisedDesc',  color: '#991111' },
  { id: 'kote',             nameKey: 'splatKote',            subKey: 'splatKoteSub',            descKey: 'splatKoteDesc',            color: '#c4a32e' },
  { id: 'vampire-dark-ages', nameKey: 'splatDarkAges',        subKey: 'splatDarkAgesSub',        descKey: 'splatDarkAgesDesc',        color: '#5a3a1a' },
  { id: 'victorian-vampire', nameKey: 'splatVictorianVampire', subKey: 'splatVictorianVampireSub', descKey: 'splatVictorianVampireDesc', color: '#6b2e3e' },
  { id: 'wyld-west-werewolf', nameKey: 'splatWyldWest',       subKey: 'splatWyldWestSub',        descKey: 'splatWyldWestDesc',        color: '#8b6914' },
  { id: 'victorian-mage',    nameKey: 'splatVictorianMage',   subKey: 'splatVictorianMageSub',   descKey: 'splatVictorianMageDesc',   color: '#5a3a7a' },
]

export default function SplatSelectPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useLanguage()
  const mode = searchParams.get('mode')
  const chronicle = searchParams.get('chronicle')
  const suffix = mode ? `?mode=${mode}&chronicle=${chronicle}` : ''

  return (
    <section aria-labelledby="splat-heading">
      <div className="character-list-header">
        <h2 id="splat-heading">{t('newCharacter')}</h2>
      </div>
      <p className="muted-hint" style={{ marginBottom: 'var(--space-xl)' }}>
        {t('chooseGameLine')}
      </p>
      <div className="splat-grid">
        {SPLATS.map(splat => (
          <button
            key={splat.id}
            className="splat-card"
            onClick={() => navigate(`/characters/new/${splat.id}${suffix}`)}
            style={{ '--splat-color': splat.color }}
          >
            <div className="splat-card-header">
              <h3 className="splat-card-name">{t(splat.nameKey)}</h3>
              <span className="splat-card-subtitle">{t(splat.subKey)}</span>
            </div>
            <p className="splat-card-desc">{t(splat.descKey)}</p>
            <span className="splat-card-cta">{t('createSplat')} {t(splat.nameKey)}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
