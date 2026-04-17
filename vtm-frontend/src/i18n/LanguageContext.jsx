import { createContext, useContext, useState } from 'react'
import { translations } from './translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('spinsheets-lang') || 'en'
    document.documentElement.lang = saved
    return saved
  })

  function toggle() {
    const next = lang === 'en' ? 'pt' : 'en'
    setLang(next)
    localStorage.setItem('spinsheets-lang', next)
    document.documentElement.lang = next
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
