import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'

const ALERT_INTERVAL_MS = 10000

/**
 * Manages the register/login alert visibility for unauthenticated users.
 */
export function useRegisterAlert() {
  const router = useRouter()
  const authStore = useAuthStore()
  const { isAuthenticated, user } = storeToRefs(authStore)

  const showRegisterAlert = ref(false)
  let intervalId: ReturnType<typeof setInterval> | null = null

  /**
   * Hides the alert modal.
   */
  function closeAlert() {
    showRegisterAlert.value = false
  }

  /**
   * Shows the alert only when the user is not authenticated.
   */
  function maybeShowAlert() {
    if (isAuthenticated.value) return
    showRegisterAlert.value = true
  }

  /**
   * Starts a periodic reminder that reopens the alert every 10 seconds
   * while the user remains unauthenticated.
   */
  function startAlertInterval() {
    if (intervalId) return
    intervalId = setInterval(() => {
      if (!isAuthenticated.value) {
        maybeShowAlert()
      }
    }, ALERT_INTERVAL_MS)
  }

  /**
   * Stops the periodic reminder interval.
   */
  function stopAlertInterval() {
    if (!intervalId) return
    clearInterval(intervalId)
    intervalId = null
  }

  /**
   * Closes the alert and navigates to the register page.
   */
  function goToRegister() {
    closeAlert()
    router.push('/register')
  }

  /**
   * Closes the alert and navigates to the login page.
   */
  function goToLogin() {
    closeAlert()
    router.push('/login')
  }

  watch(isAuthenticated, (loggedIn) => {
    if (loggedIn) {
      showRegisterAlert.value = false
      stopAlertInterval()
    } else {
      startAlertInterval()
    }
  })

  onMounted(() => {
    if (!isAuthenticated.value) {
      startAlertInterval()
    }
  })

  onUnmounted(() => {
    stopAlertInterval()
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
