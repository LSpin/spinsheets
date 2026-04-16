import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('vtm_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('vtm_token')
      localStorage.removeItem('vtm_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const getCharacters = () => api.get('/characters')
export const getCharacter = (id) => api.get(`/characters/${id}`)
export const createCharacter = (data) => api.post('/characters', data)
export const updateCharacter = (id, data) => api.put(`/characters/${id}`, data)
export const deleteCharacter = (id) => api.delete(`/characters/${id}`)

export const getMeritCatalog = () => api.get('/merits')
export const getFlawCatalog = () => api.get('/flaws')

export const getMerits = (id) => api.get(`/characters/${id}/merits`)
export const addMerit = (id, data) => api.post(`/characters/${id}/merits`, data)
export const removeMerit = (characterId, meritId) => api.delete(`/characters/${characterId}/merits/${meritId}`)

export const getFlaws = (id) => api.get(`/characters/${id}/flaws`)
export const addFlaw = (id, data) => api.post(`/characters/${id}/flaws`, data)
export const removeFlaw = (characterId, flawId) => api.delete(`/characters/${characterId}/flaws/${flawId}`)

export const getDisciplines = (id) => api.get(`/characters/${id}/disciplines`)
export const addDiscipline = (id, data) => api.post(`/characters/${id}/disciplines`, data)
export const removeDiscipline = (characterId, disciplineId) => api.delete(`/characters/${characterId}/disciplines/${disciplineId}`)

export const getBackgrounds = (id) => api.get(`/characters/${id}/backgrounds`)
export const addBackground = (id, data) => api.post(`/characters/${id}/backgrounds`, data)
export const removeBackground = (characterId, backgroundId) => api.delete(`/characters/${characterId}/backgrounds/${backgroundId}`)

export const getInventory = (id) => api.get(`/characters/${id}/inventory`)
export const addInventoryItem = (id, data) => api.post(`/characters/${id}/inventory`, data)
export const removeInventoryItem = (characterId, itemId) => api.delete(`/characters/${characterId}/inventory/${itemId}`)

export const getSorceryPaths = (id) => api.get(`/characters/${id}/sorcery-paths`)
export const addSorceryPath = (id, data) => api.post(`/characters/${id}/sorcery-paths`, data)
export const removeSorceryPath = (characterId, pathId) => api.delete(`/characters/${characterId}/sorcery-paths/${pathId}`)

export const getRituals = (id) => api.get(`/characters/${id}/rituals`)
export const addRitual = (id, data) => api.post(`/characters/${id}/rituals`, data)
export const removeRitual = (characterId, ritualId) => api.delete(`/characters/${characterId}/rituals/${ritualId}`)

export const getXpLog = (id) => api.get(`/characters/${id}/xp-log`)
export const addXpLogEntry = (id, data) => api.post(`/characters/${id}/xp-log`, data)
export const removeXpLogEntry = (id, entryId) => api.delete(`/characters/${id}/xp-log/${entryId}`)
