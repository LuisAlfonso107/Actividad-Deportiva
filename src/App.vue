<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouterLink, RouterView } from 'vue-router'
import AppFooter from './components/AppFooter.vue'
import { useApiErrorStore } from './stores/apiError'

const apiError = useApiErrorStore()
const { message: apiErrorMessage, isLimitError } = storeToRefs(apiError)
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
            <span class="text-sm font-semibold hidden md:block">Mi Perfil</span>
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

  <main class="min-h-screen bg-background-light dark:bg-background-dark">
    <RouterView />
  </main>
  <AppFooter />
</template>

<style scoped>
.router-link-active {
  color: #10b981 !important;
  border-bottom: 2px solid #10b981 !important;
}
</style>
