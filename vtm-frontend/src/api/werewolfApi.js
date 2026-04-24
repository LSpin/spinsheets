import api from './apiClient'

export const getGifts = (id) => api.get(`/characters/${id}/gifts`)
export const addGift = (id, data) => api.post(`/characters/${id}/gifts`, data)
export const removeGift = (characterId, giftId) => api.delete(`/characters/${characterId}/gifts/${giftId}`)

export const getRites = (id) => api.get(`/characters/${id}/rites`)
export const addRite = (id, data) => api.post(`/characters/${id}/rites`, data)
export const removeRite = (characterId, riteId) => api.delete(`/characters/${characterId}/rites/${riteId}`)

export const getFetishes = (id) => api.get(`/characters/${id}/fetishes`)
export const addFetish = (id, data) => api.post(`/characters/${id}/fetishes`, data)
export const removeFetish = (characterId, fetishId) => api.delete(`/characters/${characterId}/fetishes/${fetishId}`)
