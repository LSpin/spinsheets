import { createContext, useContext, useState, useEffect } from 'react'
import { getChronicles } from '../api/chronicleApi'
import { useAuth } from './AuthContext'
import NewCharacterModal from '../components/NewCharacterModal'

const NewCharContext = createContext()

export function NewCharProvider({ children }) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [chronicles, setChronicles] = useState([])

  useEffect(() => {
    if (user) {
      getChronicles().then(res => setChronicles(res.data)).catch(() => {})
    }
  }, [user])

  return (
    <NewCharContext.Provider value={{ openNewChar: () => setOpen(true) }}>
      {children}
      <NewCharacterModal open={open} onClose={() => setOpen(false)} chronicles={chronicles} />
    </NewCharContext.Provider>
  )
}

export function useNewChar() {
  return useContext(NewCharContext)
}
