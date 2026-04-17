import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { getChronicle } from '../api/chronicleApi'

const ALL_TABS = [
  { key: 'vampire', labelKey: 'splatVampire', category: 'VAMPIRE' },
  { key: 'werewolf', labelKey: 'splatWerewolf', category: 'WEREWOLF' },
  { key: 'mage', labelKey: 'splatMage', category: 'MAGE' },
]

const SPLATS = {
  vampire: [
    { id: 'vampire',           nameKey: 'splatVampire',          subKey: 'splatVampireSub',          descKey: 'splatVampireDesc',          color: '#cc2222' },
    { id: 'vampire-revised',   nameKey: 'splatVampireRevised',   subKey: 'splatVampireRevisedSub',   descKey: 'splatVampireRevisedDesc',   color: '#991111' },
    { id: 'vampire-dark-ages', nameKey: 'splatDarkAges',         subKey: 'splatDarkAgesSub',         descKey: 'splatDarkAgesDesc',         color: '#5a3a1a' },
    { id: 'victorian-vampire', nameKey: 'splatVictorianVampire', subKey: 'splatVictorianVampireSub', descKey: 'splatVictorianVampireDesc', color: '#6b2e3e' },
    { id: 'kote',              nameKey: 'splatKote',             subKey: 'splatKoteSub',             descKey: 'splatKoteDesc',             color: '#c4a32e' },
    { id: 'ghoul',             nameKey: 'splatGhoul',            subKey: 'splatGhoulSub',            descKey: 'splatGhoulDesc',            color: '#884444' },
  ],
  werewolf: [
    { id: 'werewolf',           nameKey: 'splatWerewolf',  subKey: 'splatWerewolfSub',  descKey: 'splatWerewolfDesc',  color: '#7a8b3a' },
    { id: 'wyld-west-werewolf', nameKey: 'splatWyldWest',       subKey: 'splatWyldWestSub',       descKey: 'splatWyldWestDesc',       color: '#8b6914' },
    { id: 'changing-breeds',    nameKey: 'splatChangingBreeds', subKey: 'splatChangingBreedsSub', descKey: 'splatChangingBreedsDesc', color: '#5a7a3a' },
    { id: 'totem',              nameKey: 'splatTotem',            subKey: 'splatTotemSub',            descKey: 'splatTotemDesc',            color: '#4a6a2a' },
  ],
  mage: [
    { id: 'mage',           nameKey: 'splatMage',          subKey: 'splatMageSub',          descKey: 'splatMageDesc',          color: '#6a4caa' },
    { id: 'victorian-mage', nameKey: 'splatVictorianMage', subKey: 'splatVictorianMageSub', descKey: 'splatVictorianMageDesc', color: '#5a3a7a' },
    { id: 'familiar',       nameKey: 'splatFamiliar',      subKey: 'splatFamiliarSub',      descKey: 'splatFamiliarDesc',      color: '#7a5aaa' },
  ],
}

export default function SplatSelectPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useLanguage()
  const mode = searchParams.get('mode')
  const chronicle = searchParams.get('chronicle')
  const suffix = mode ? `?mode=${mode}&chronicle=${chronicle}` : ''

  const [allowedCategories, setAllowedCategories] = useState(null)

  useEffect(() => {
    if (!chronicle) return
    getChronicle(chronicle).then(res => {
      const raw = res.data.chronicle.allowedSplats
      if (raw) setAllowedCategories(new Set(raw.split(',')))
    }).catch(() => {})
  }, [chronicle])

  const TABS = allowedCategories
    ? ALL_TABS.filter(tb => allowedCategories.has(tb.category))
    : ALL_TABS

  const [tab, setTab] = useState('vampire')
  const activeTab = TABS.some(tb => tb.key === tab) ? tab : TABS[0]?.key

  if (!activeTab) return null

  return (
    <section aria-labelledby="splat-heading">
      <div className="character-list-header">
        <h2 id="splat-heading">{t('newCharacter')}</h2>
      </div>
      <p className="muted-hint" style={{ marginBottom: 'var(--space-md)' }}>
        {t('chooseGameLine')}
      </p>
      <div className="tab-list" role="tablist" style={{ marginBottom: 'var(--space-lg)' }}>
        {TABS.map(tb => (
          <button key={tb.key} role="tab" className={`btn btn-secondary${activeTab === tb.key ? ' tab-btn--active' : ''}`}
            onClick={() => setTab(tb.key)} aria-selected={activeTab === tb.key}>{t(tb.labelKey)}</button>
        ))}
      </div>
      <div className="splat-grid">
        {SPLATS[activeTab].map(splat => (
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
