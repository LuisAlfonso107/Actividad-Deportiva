import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'

const SESSION_KEY = 'kaboomfot_registerAlertShown'

export function useRegisterAlert() {
  const router = useRouter()
  const authStore = useAuthStore()
  const { isAuthenticated, user } = storeToRefs(authStore)

  const showRegisterAlert = ref(false)

  function closeAlert() {
    showRegisterAlert.value = false
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      // ignore
    }
  }

  function maybeShowAlert() {
    if (isAuthenticated.value) return
    try {
      if (sessionStorage.getItem(SESSION_KEY) === '1') return
    } catch {
      // ignore
    }
    showRegisterAlert.value = true
  }

  function goToRegister() {
    closeAlert()
    router.push('/register')
  }

  function goToLogin() {
    closeAlert()
    router.push('/login')
  }

  watch(isAuthenticated, (loggedIn) => {
    if (loggedIn) {
      showRegisterAlert.value = false
    } else {
      maybeShowAlert()
    }
  })

  onMounted(() => {
    if (!isAuthenticated.value) {
      maybeShowAlert()
    }
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
