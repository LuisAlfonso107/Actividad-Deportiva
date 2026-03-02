<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import { useFavoritesStore } from '../stores/favorites'
import ModalSelectLista from '../components/ModalSelectLista.vue'

const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)
const favorites = computed(() => favoritesStore.favorites)

const showModalSelectLista = ref(false)
const playerIdForListModal = ref(0)
function openAddToListModal(playerId: number) {
  playerIdForListModal.value = playerId
  showModalSelectLista.value = true
}

function removeFavorite(id: number) {
  favoritesStore.remove(id)
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
</script>

<template>
  <div class="font-body bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">Mis Favoritos</h1>
        <p class="text-slate-600 dark:text-slate-400">Jugadores que has guardado para análisis.</p>
      </div>

      <div v-if="favorites.length === 0" class="text-center py-16">
        <span class="material-symbols-rounded text-6xl text-slate-300">favorite_border</span>
        <h3 class="text-xl font-semibold text-slate-600 mt-4">No tienes favoritos guardados</h3>
        <p class="text-slate-500 mt-2">Agrega jugadores a tu lista de favoritos para verlos aquí</p>
        <router-link to="/players" class="inline-block mt-6 bg-primary hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
          Explorar Jugadores
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="player in favorites"
          :key="player.id"
          class="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-800 group"
        >
          <div class="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <img
              v-if="player.photo"
              :src="player.photo"
              :alt="player.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800"
            >
              <span class="text-4xl font-black text-slate-400 dark:text-slate-500">{{ initials(player.name) }}</span>
            </div>
            
            <div class="absolute top-3 left-3">
              <span class="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-black px-2 py-1 rounded-full uppercase">
                FAVORITO
              </span>
            </div>
            
            <button
              @click="removeFavorite(player.id)"
              class="absolute top-3 right-3 p-1.5 bg-white/90 dark:bg-slate-900/90 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm text-red-500"
            >
              <span class="material-symbols-rounded text-lg">favorite</span>
            </button>
          </div>
          
          <div class="p-4">
            <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-1">{{ player.name }}</h3>
            <p class="text-slate-500 dark:text-slate-400 text-sm mb-3">{{ player.team || 'Sin equipo' }}</p>
            
            <div class="flex flex-wrap gap-2">
              <button class="flex-1 min-w-0 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2 px-3 rounded-lg text-sm transition-colors">
                Ver Perfil
              </button>
              <button class="flex-1 min-w-0 bg-primary hover:bg-emerald-600 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-colors">
                Analizar
              </button>
              <button
                v-if="isAuthenticated"
                type="button"
                class="w-full flex items-center justify-center gap-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2 px-3 rounded-lg text-sm transition-colors"
                @click="openAddToListModal(player.id)"
              >
                <span class="material-symbols-rounded text-lg">playlist_add</span>
                Añadir a mi lista
              </button>
            </div>
          </div>
        </div>
      </div>

    <ModalSelectLista
      :model-value="showModalSelectLista"
      :player-id="playerIdForListModal"
      @update:model-value="showModalSelectLista = $event"
    />
    </main>
  </div>
</template>
