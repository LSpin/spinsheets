import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button type="button" onClick={toggle} className="theme-toggle">
      {theme === 'wod' ? '7th Sea' : 'WoD'}
    </button>
  )
}
