import { useLanguage } from '../i18n/LanguageContext'

export default function LanguageToggle() {
  const { lang, toggle } = useLanguage()

  return (
    <button
      type="button"
      onClick={toggle}
      className="lang-toggle"
    >
      {lang === 'en' ? 'Mudar Idioma' : 'Switch Language'}
    </button>
  )
}
