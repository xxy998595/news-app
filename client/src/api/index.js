import axios from 'axios'
import { useUserStore } from '../stores/user'
import { showToast } from 'vant'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 60000 // Increased timeout for AI requests
})

api.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const message = error.response?.data?.message || 'Network Error'
    showToast(message)
    return Promise.reject(error)
  }
)

export default api
