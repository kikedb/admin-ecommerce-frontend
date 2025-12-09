import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  async function login(email, password) {
    isLoading.value = true
    error.value = null
    try {
      console.log('[Auth] Iniciando login con:', { email })
      const response = await authService.login(email, password)
      console.log('[Auth] Respuesta del servidor:', response)
      
      // El backend devuelve {data: {token, user, ...}}
      const loginData = response.data.data || response.data
      const receivedToken = loginData.token
      const receivedUser = loginData.user
      
      console.log('[Auth] Token:', receivedToken)
      console.log('[Auth] Usuario:', receivedUser)
      
      if (!receivedToken) {
        throw new Error('Token no recibido del servidor')
      }
      
      token.value = receivedToken
      user.value = receivedUser
      localStorage.setItem('token', receivedToken)
      localStorage.setItem('user', JSON.stringify(receivedUser))
      console.log('[Auth] Login exitoso, token guardado')
      return response
    } catch (err) {
      console.error('[Auth] Error en login:', err)
      error.value = err.response?.data?.message || err.message || 'Error al iniciar sesión'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    try {
      await authService.logout()
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  function loadFromStorage() {
    try {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      
      if (storedToken && storedToken !== 'undefined') {
        token.value = storedToken
        if (storedUser && storedUser !== 'undefined') {
          try {
            user.value = JSON.parse(storedUser)
          } catch (e) {
            // Si el JSON es inválido, limpiamos el storage
            localStorage.removeItem('user')
            user.value = null
          }
        }
      } else {
        // Limpiar localStorage si contiene 'undefined'
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    } catch (error) {
      console.error('Error loading from storage:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  return {
    token,
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    loadFromStorage
  }
})
