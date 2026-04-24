import api from './apiClient'

export const getChronicles = () => api.get('/chronicles')
export const getChronicle = (id) => api.get(`/chronicles/${id}`)
export const createChronicle = (data) => api.post('/chronicles', data)
export const updateChronicle = (id, data) => api.put(`/chronicles/${id}`, data)
export const deleteChronicle = (id) => api.delete(`/chronicles/${id}`)

export const joinChronicle = (characterId, chronicleId) =>
  api.put(`/characters/${characterId}/chronicle/${chronicleId}`)
export const leaveChronicle = (characterId) =>
  api.delete(`/characters/${characterId}/chronicle`)

export const getInviteInfo = (code) =>
  api.get(`/chronicles/invite/${code}`)
export const generateInviteCode = (chronicleId) =>
  api.post(`/chronicles/${chronicleId}/invite-code`)
export const disableInviteCode = (chronicleId) =>
  api.delete(`/chronicles/${chronicleId}/invite-code`)
export const joinByInviteCode = (code, characterId) =>
  api.post('/chronicles/join', { code, characterId })

export const updateAllowedSplats = (chronicleId, allowedSplats) =>
  api.put(`/chronicles/${chronicleId}/allowed-splats`, { allowedSplats })

export const addAssistantST = (chronicleId, username) =>
  api.post(`/chronicles/${chronicleId}/assistants`, { username })
export const removeAssistantST = (chronicleId, userId) =>
  api.delete(`/chronicles/${chronicleId}/assistants/${userId}`)

export const getSessions = (chronicleId) =>
  api.get(`/chronicles/${chronicleId}/sessions`)
export const addSession = (chronicleId, data) =>
  api.post(`/chronicles/${chronicleId}/sessions`, data)
export const updateSession = (chronicleId, sessionId, data) =>
  api.put(`/chronicles/${chronicleId}/sessions/${sessionId}`, data)
export const deleteSession = (chronicleId, sessionId) =>
  api.delete(`/chronicles/${chronicleId}/sessions/${sessionId}`)
