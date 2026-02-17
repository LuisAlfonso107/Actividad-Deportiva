import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface RegisterData {
  email: string
  password: string
  confirmPassword: string
}

interface RegisterErrors {
  email?: string
  password?: string
  confirmPassword?: string
}

export function useRegisterForm() {
  const router = useRouter()

  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const loading = ref(false)
  const errors = ref<RegisterErrors>({})
  const successMessage = ref('')
  const errorMessage = ref('')

  function validateEmail(emailValue: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(emailValue)
  }

  function validatePassword(passwordValue: string): boolean {
    return passwordValue.length >= 6
  }

  function validateForm(): boolean {
    errors.value = {}
    
    if (!email.value.trim()) {
      errors.value.email = 'El email es obligatorio'
    } else if (!validateEmail(email.value)) {
      errors.value.email = 'Introduce un email válido'
    }
    
    if (!password.value) {
      errors.value.password = 'La contraseña es obligatoria'
    } else if (!validatePassword(password.value)) {
      errors.value.password = 'La contraseña debe tener al menos 6 caracteres'
    }
    
    if (!confirmPassword.value) {
      errors.value.confirmPassword = 'Debes confirmar la contraseña'
    } else if (password.value !== confirmPassword.value) {
      errors.value.confirmPassword = 'Las contraseñas no coinciden'
    }
    
    return Object.keys(errors.value).length === 0
  }

  async function handleRegister(): Promise<boolean> {
    errorMessage.value = ''
    successMessage.value = ''
    
    if (!validateForm()) {
      return false
    }
    
    loading.value = true
    
    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Error al crear la cuenta')
      }
      
      successMessage.value = 'Cuenta creada correctamente'
      
      setTimeout(() => {
        router.push('/login')
      }, 1500)
      
      return true
      
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('email')) {
          errorMessage.value = 'Este email ya está en uso'
        } else {
          errorMessage.value = error.message
        }
      } else {
        errorMessage.value = 'Error al crear la cuenta. Inténtalo de nuevo.'
      }
      return false
    } finally {
      loading.value = false
    }
  }

  function resetForm() {
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    errors.value = {}
    successMessage.value = ''
    errorMessage.value = ''
  }

  return {
    email,
    password,
    confirmPassword,
    loading,
    errors,
    successMessage,
    errorMessage,
    validateForm,
    handleRegister,
    resetForm,
  }
}
