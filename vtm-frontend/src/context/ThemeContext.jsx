import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('spinsheets-theme') || 'wod')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  function switchTheme(t) {
    setTheme(t)
    localStorage.setItem('spinsheets-theme', t)
  }

  function toggle() {
    switchTheme(theme === 'wod' ? '7thsea' : 'wod')
  }

  return (
    <ThemeContext.Provider value={{ theme, switchTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
