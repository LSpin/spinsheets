import axios from 'axios'

export const loginApi = (credentials) => axios.post('/api/auth/login', credentials)
export const registerApi = (data) => axios.post('/api/auth/register', data)
