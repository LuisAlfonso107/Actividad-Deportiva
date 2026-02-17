import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'

export function useRegisterAlert() {
  const router = useRouter()
  const authStore = useAuthStore()
  const { isAuthenticated, user } = storeToRefs(authStore)

  const showRegisterAlert = ref(false)
  let alertInterval: ReturnType<typeof setInterval> | null = null

  function startAlertTimer() {
    if (alertInterval) return
    alertInterval = setInterval(() => {
      if (!isAuthenticated.value) {
        showRegisterAlert.value = true
      }
    }, 10000)
  }

  function stopAlertTimer() {
    if (alertInterval) {
      clearInterval(alertInterval)
      alertInterval = null
    }
  }

  function closeAlert() {
    showRegisterAlert.value = false
  }

  function goToRegister() {
    closeAlert()
    router.push('/register')
  }

  function goToLogin() {
    closeAlert()
    router.push('/login')
  }

  watch(isAuthenticated, (newValue) => {
    if (newValue) {
      stopAlertTimer()
      showRegisterAlert.value = false
    } else {
      startAlertTimer()
    }
  })

  onMounted(() => {
    if (!isAuthenticated.value) {
      startAlertTimer()
    }
  })

  onUnmounted(() => {
    stopAlertTimer()
  })

  return {
    showRegisterAlert,
    closeAlert,
    goToRegister,
    goToLogin,
    isAuthenticated,
    user,
  }
}
