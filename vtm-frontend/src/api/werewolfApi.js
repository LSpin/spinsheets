import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('vtm_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const getGifts = (id) => api.get(`/characters/${id}/gifts`)
export const addGift = (id, data) => api.post(`/characters/${id}/gifts`, data)
export const removeGift = (characterId, giftId) => api.delete(`/characters/${characterId}/gifts/${giftId}`)

export const getRites = (id) => api.get(`/characters/${id}/rites`)
export const addRite = (id, data) => api.post(`/characters/${id}/rites`, data)
export const removeRite = (characterId, riteId) => api.delete(`/characters/${characterId}/rites/${riteId}`)

export const getFetishes = (id) => api.get(`/characters/${id}/fetishes`)
export const addFetish = (id, data) => api.post(`/characters/${id}/fetishes`, data)
export const removeFetish = (characterId, fetishId) => api.delete(`/characters/${characterId}/fetishes/${fetishId}`)
