<script setup lang="ts">
import { Suspense } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import AppFooter from './components/AppFooter.vue'
import { useApiErrorStore } from './stores/apiError'
import { useAuthStore } from './stores/auth'

const apiError = useApiErrorStore()
const authStore = useAuthStore()
const { user, isAuthenticated } = storeToRefs(authStore)
const router = useRouter()

const { message: apiErrorMessage, isLimitError } = storeToRefs(apiError)

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

const profileText = ref('Mi Perfil')

watch([isAuthenticated, user], () => {
  if (isAuthenticated.value && user.value?.name) {
    profileText.value = `HOLA, ${user.value.name}`
  } else {
    profileText.value = 'Iniciar sesión'
  }
}, { immediate: true })

onMounted(() => {
  if (!isAuthenticated.value) {
    startAlertTimer()
  }
})

onUnmounted(() => {
  stopAlertTimer()
})

watch(isAuthenticated, (newValue) => {
  if (newValue) {
    stopAlertTimer()
    showRegisterAlert.value = false
  } else {
    startAlertTimer()
  }
})
</script>

<template>
  <div v-if="apiErrorMessage" class="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-4 text-center">
    <span class="mr-4">{{ apiErrorMessage }}</span>
    <button type="button" class="bg-white/20 hover:bg-white/30 px-3 py-1 rounded" @click="apiError.clearError">×</button>
  </div>

  <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex-shrink-0 flex items-center gap-2">
          <RouterLink to="/" class="text-2xl font-black font-display tracking-tighter text-secondary dark:text-white">
            KABOOM<span class="text-primary">FOT</span>
          </RouterLink>
        </div>
        <div class="flex items-center space-x-6">
          <RouterLink to="/favorites" class="text-slate-500 hover:text-primary transition-colors">
            <span class="material-symbols-rounded">favorite</span>
          </RouterLink>
          <RouterLink to="/profile" class="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 pr-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <span class="material-symbols-rounded text-3xl text-secondary dark:text-white">account_circle</span>
            <span class="text-sm font-semibold hidden md:block">{{ profileText }}</span>
          </RouterLink>
        </div>
      </div>
    </div>
    <nav class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-12">
          <div class="hidden md:flex space-x-8">
            <RouterLink 
              to="/" 
              class="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors h-12 flex items-center"
              active-class="text-primary border-b-2 border-primary"
            >
              INICIO
            </RouterLink>
            <RouterLink 
              to="/players" 
              class="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors h-12 flex items-center"
              active-class="text-primary border-b-2 border-primary"
            >
              JUGADORES
            </RouterLink>
            <RouterLink 
              to="/market" 
              class="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors h-12 flex items-center"
              active-class="text-primary border-b-2 border-primary"
            >
              MERCADO
            </RouterLink>
            <RouterLink 
              to="/news" 
              class="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors h-12 flex items-center"
              active-class="text-primary border-b-2 border-primary"
            >
              NOTICIAS
            </RouterLink>
            <RouterLink 
              to="/laliga2" 
              class="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors h-12 flex items-center"
              active-class="text-primary border-b-2 border-primary"
            >
              CLASIFICACIÓN
            </RouterLink>
          </div>
          <div class="flex items-center space-x-4">
            <RouterLink to="/settings" class="hidden md:flex text-sm font-semibold text-slate-600 dark:text-slate-300 items-center gap-2 hover:text-primary transition-colors">
              CONFIGURACIÓN
              <span class="material-symbols-rounded text-lg">settings</span>
            </RouterLink>
            <!-- Mobile menu button -->
            <button class="md:hidden p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700">
              <span class="material-symbols-rounded">menu</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  </header>

  <div v-if="showRegisterAlert" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60" @click.self="closeAlert">
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 max-w-md mx-4 text-center transform animate-fade-in">
      <div class="mb-4">
        <span class="material-symbols-rounded text-5xl text-primary">sports_soccer</span>
      </div>
      <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-2">¡Únete a KABOOMFOT!</h2>
      <p class="text-slate-600 dark:text-slate-300 mb-6">Regístrate o inicia sesión para acceder a todas las funcionalidades exclusivas</p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button @click="goToRegister" class="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
          Registrarse
        </button>
        <button @click="goToLogin" class="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-semibold py-2 px-6 rounded-lg transition-colors">
          Iniciar Sesión
        </button>
      </div>
      <button @click="closeAlert" class="mt-4 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm">
        Cerrar
      </button>
    </div>
  </div>

  <main class="min-h-screen bg-background-light dark:bg-background-dark">
    <Suspense>
      <template #default>
        <RouterView />
      </template>
      <template #fallback>
        <div class="suspense-loading">Cargando vista…</div>
      </template>
    </Suspense>
  </main>
  <AppFooter />
</template>

<style scoped>
.router-link-active {
  color: #10b981 !important;
  border-bottom: 2px solid #10b981 !important;
}

.suspense-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  font-weight: 600;
  color: var(--color-text);
  opacity: 0.7;
}
</style>
