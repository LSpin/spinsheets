import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('vtm_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const getChronicles = () => api.get('/chronicles')
export const getChronicle = (id) => api.get(`/chronicles/${id}`)
export const createChronicle = (data) => api.post('/chronicles', data)
export const updateChronicle = (id, data) => api.put(`/chronicles/${id}`, data)
export const deleteChronicle = (id) => api.delete(`/chronicles/${id}`)

export const joinChronicle = (characterId, chronicleId) =>
  api.put(`/characters/${characterId}/chronicle/${chronicleId}`)
export const leaveChronicle = (characterId) =>
  api.delete(`/characters/${characterId}/chronicle`)
