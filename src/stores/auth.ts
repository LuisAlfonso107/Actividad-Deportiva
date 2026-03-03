import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: string
  email: string
  password: string
  name: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  

  //Si existe → lo carga en user.value para que la persona siga "logueada"
  function init() {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch {
        localStorage.removeItem('user')
      }
    }
  }

  // funcion para iniciar sesión

  async function login(email: string, password: string): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}`)
      
      if (!response.ok) {
        throw new Error('Error al conectar con el servidor')
      }

      const users: User[] = await response.json()

      if (users.length === 0) {
        error.value = 'Email o contraseña incorrectos'
        return false
      }

      const foundUser = users[0]

      if (!foundUser || foundUser.password !== password) {
        error.value = 'Email o contraseña incorrectos'
        return false
      }

      user.value = { ...foundUser }
      localStorage.setItem('user', JSON.stringify(foundUser))
      return true
    } catch (e) {
      error.value = 'Error al iniciar sesión. Inténtalo de nuevo.'
      return false
    } finally {
      loading.value = false
    }
  }

  // funcion para cerrar sesión
  function logout() {
    user.value = null
    localStorage.removeItem('user')
  }

  init()

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
  }
})
