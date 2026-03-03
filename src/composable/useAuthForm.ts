import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

interface LoginErrors {
  email?: string
  password?: string
}

/**
 * Provides reactive state and actions for the login form.
 */
export function useAuthForm() {
  const router = useRouter()
  const authStore = useAuthStore()

  const email = ref('')
  const password = ref('')
  const errors = ref<LoginErrors>({})

  const loading = computed(() => authStore.loading)
  const errorMessage = computed(() => authStore.error)

  /**
   * Validates required login fields and stores field-level errors.
   * Returns true when the form is valid.
   */
  function validateForm(): boolean {
    errors.value = {}
    
    if (!email.value.trim()) {
      errors.value.email = 'El email es obligatorio'
    }
    
    if (!password.value) {
      errors.value.password = 'La contraseña es obligatoria'
    }
    
    return Object.keys(errors.value).length === 0
  }

  /**
   * Submits credentials through the auth store.
   * Redirects to the settings page after a successful login.
   */
  async function handleLogin(): Promise<boolean> {
    if (!validateForm()) {
      return false
    }
    
    const success = await authStore.login(email.value, password.value)
    
    if (success) {
      router.push('/settings')
    }
    
    return success
  }

  /**
   * Clears all form inputs and validation errors.
   */
  function resetForm() {
    email.value = ''
    password.value = ''
    errors.value = {}
  }

  return {
    email,
    password,
    errors,
    loading,
    errorMessage,
    validateForm,
    handleLogin,
    resetForm,
  }
}
