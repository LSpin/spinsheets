import { createContext, useContext, useState } from 'react'
import { translations } from './translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('spinsheets-lang') || 'en')

  function toggle() {
    const next = lang === 'en' ? 'pt' : 'en'
    setLang(next)
    localStorage.setItem('spinsheets-lang', next)
  }

  function t(key) {
    return translations[lang]?.[key] ?? translations.en?.[key] ?? key
  }

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
