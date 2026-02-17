import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

interface UserData {
  id?: number
  email: string
  password?: string
  name?: string
  phone?: string
  birthDate?: string
  favoritePlayers?: number[]
}

export function useProfileForm() {
  const router = useRouter()
  const authStore = useAuthStore()

  const userData = ref<UserData | null>(null)
  const loading = ref(true)
  const saving = ref(false)
  const isEditing = ref(false)
  const successMessage = ref('')
  const errorMessage = ref('')

  const editedData = ref<UserData>({
    email: '',
    name: '',
    phone: '',
    birthDate: '',
  })

  async function loadUserData() {
    if (!authStore.user) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch(`http://localhost:3000/users/${authStore.user.id}`)
      if (!response.ok) throw new Error('Error al cargar datos')
      
      const data = await response.json() as UserData
      userData.value = data
      editedData.value = { 
        email: data.email || '', 
        name: data.name || '', 
        phone: data.phone || '', 
        birthDate: data.birthDate || '' 
      }
    } catch (e) {
      errorMessage.value = 'Error al cargar los datos del usuario'
    } finally {
      loading.value = false
    }
  }

  function startEditing() {
    if (userData.value) {
      editedData.value = { ...userData.value }
    }
    isEditing.value = true
  }

  function cancelEditing() {
    isEditing.value = false
    if (userData.value) {
      editedData.value = { ...userData.value }
    }
  }

  async function saveChanges(): Promise<boolean> {
    if (!authStore.user) return false

    saving.value = true
    errorMessage.value = ''
    successMessage.value = ''

    try {
      const response = await fetch(`http://localhost:3000/users/${authStore.user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedData.value),
      })

      if (!response.ok) throw new Error('Error al guardar')

      userData.value = { ...userData.value, ...editedData.value } as UserData
      authStore.user = { ...authStore.user, ...editedData.value } as typeof authStore.user
      localStorage.setItem('user', JSON.stringify(authStore.user))
      
      isEditing.value = false
      successMessage.value = 'Datos actualizados correctamente'
      
      setTimeout(() => { successMessage.value = '' }, 3000)
      return true
    } catch (e) {
      errorMessage.value = 'Error al guardar los cambios'
      return false
    } finally {
      saving.value = false
    }
  }

  function handleLogout() {
    authStore.logout()
    router.push('/login')
  }

  function initials(name: string): string {
    const parts = name.trim().split(/\s+/)
    const first = parts[0]
    const last = parts[parts.length - 1]
    
    if (parts.length >= 2 && first && last && first[0] && last[0]) {
      return (first[0] + last[0]).toUpperCase()
    }
    if (first && first.length >= 2) return first.slice(0, 2).toUpperCase()
    if (first && first[0]) return first[0].toUpperCase()
    return '?'
  }

  onMounted(() => {
    loadUserData()
  })

  return {
    userData,
    loading,
    saving,
    isEditing,
    successMessage,
    errorMessage,
    editedData,
    startEditing,
    cancelEditing,
    saveChanges,
    handleLogout,
    initials,
    loadUserData,
  }
}
