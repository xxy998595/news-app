import api from './index'

export const login = (data) => {
  return api.post('/auth/login', data)
}

export const register = (data) => {
  return api.post('/auth/register', data)
}

export const resetPassword = (data) => {
  return api.post('/auth/reset-password', data)
}
