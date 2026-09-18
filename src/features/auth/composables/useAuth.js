import { ref } from 'vue'
import { authenticate, saveSession, clearSession } from '../services/authService'

export const useAuth = () => {
  const loading = ref(false)
  const error = ref('')

  const login = async (username, password) => {
    loading.value = true
    error.value = ''

    try {
      const response = await authenticate(username, password)
      saveSession(response)
      return response
    } catch (loginError) {
      error.value = loginError.message || 'Unable to sign in'
      throw loginError
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    clearSession()
  }

  return { loading, error, login, logout }
}