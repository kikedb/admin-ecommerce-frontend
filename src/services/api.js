import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://app.admin-ecommerce-backend'

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Accept': 'application/json'
  },
  withCredentials: false
})

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // No establecer Content-Type si es FormData (axios lo hace automáticamente)
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
