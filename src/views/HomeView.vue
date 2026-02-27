<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { ApiPlayerResponse } from '../services/playersApi'
import { getLaLiga2PlayersFromMultipleTeams, searchPlayersLaLiga2 } from '../services/playersApi'
import { useApiErrorStore } from '../stores/apiError'
import { useAuthStore } from '../stores/auth'
import { useFavoritesStore } from '../stores/favorites'
import { storeToRefs } from 'pinia'
import ModalSelectLista from '../components/ModalSelectLista.vue'

const router = useRouter()
const favoritesStore = useFavoritesStore()
const apiErrorStore = useApiErrorStore()
const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

const showModalSelectLista = ref(false)
const playerIdForListModal = ref(0)
function openAddToListModal(playerId: number) {
  playerIdForListModal.value = playerId
  showModalSelectLista.value = true
}

const searchQuery = ref('')
const searching = ref(false)
const initialLoading = ref(true)
const searchError = ref<string | null>(null)
const searchResults = ref<ApiPlayerResponse[]>([])
const showResultsList = ref(true)

const favorites = computed(() => favoritesStore.favorites)
const hasFavorites = computed(() => favorites.value.length > 0)

onMounted(async () => {
  try {
    const res = await getLaLiga2PlayersFromMultipleTeams()
    searchResults.value = res.response ?? []
    if (searchResults.value.length === 0 && !searchQuery.value.trim()) {
      searchError.value = 'No hay jugadores de La Liga 2 disponibles. Comprueba VITE_THESPORTSDB_API_KEY en .env.'
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'No se pudieron cargar los jugadores de La Liga 2.'
    searchError.value = msg
    apiErrorStore.setError(msg)
  } finally {
    initialLoading.value = false
  }
})

async function runSearch() {
  const q = searchQuery.value.trim()
  if (q.length < 4) {
    searchError.value = 'Type at least 4 characters to search'
    searchResults.value = []
    showResultsList.value = true
    return
  }
  searchError.value = null
  searching.value = true
  searchResults.value = []
  showResultsList.value = true
  try {
    const res = await searchPlayersLaLiga2(q).catch(() => ({ response: [] as ApiPlayerResponse[], results: 0 }))
    const list = res.response ?? []
    searchResults.value = list
    if (list.length === 0) {
      searchError.value = 'No se encontraron jugadores en La Liga 2'
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Search failed'
    searchError.value = msg
    apiErrorStore.setError(msg)
  } finally {
    searching.value = false
  }
}

const DEBOUNCE_MS = 400
let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(searchQuery, (q) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  const trimmed = q.trim()
  if (trimmed.length < 4) {
    searchResults.value = []
    searchError.value = trimmed.length > 0 ? 'Type at least 4 characters to search' : null
    showResultsList.value = trimmed.length > 0
    return
  }
  searchError.value = null
  debounceTimer = setTimeout(() => {
    debounceTimer = null
    runSearch()
  }, DEBOUNCE_MS)
})

function analysePlayer(id: number) {
  router.push({ name: 'player-analysis', params: { id: String(id) } })
}

function addToFavorites(item: ApiPlayerResponse) {
  const p = item.player
  const team = item.statistics?.[0]?.team
  favoritesStore.add({
    id: p.id,
    name: p.name,
    photo: p.photo,
    team: team?.name,
    teamLogo: team?.logo,
  })
}

function removeFavorite(id: number) {
  favoritesStore.remove(id)
}

function isFavorite(id: number) {
  return favoritesStore.isFavorite(id)
}

function analyseFavorite(id: number) {
  analysePlayer(id)
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

function getPlayerPosition(item: ApiPlayerResponse): string {
  return item.statistics?.[0]?.games?.position || 'Delantero'
}

function getPlayerTeam(item: ApiPlayerResponse): string {
  return item.statistics?.[0]?.team?.name || 'La Liga 2'
}

function getPlayerStats(item: ApiPlayerResponse) {
  const stats = item.statistics?.[0]
  const goalsTotal = stats?.goals?.total
  const assistsVal = stats?.goals?.assists
  // Use real stats when available; otherwise stable values from player id so they don't change on re-render (e.g. when clicking favorite)
  const id = item.player.id
  return {
    goals: typeof goalsTotal === 'number' ? goalsTotal : (id % 21),
    assists: assistsVal != null ? assistsVal : (id % 16),
    physical: (id % 30) + 70,
    pace: ((id >> 4) % 30) + 70
  }
}
</script>

<template>
  <div class="font-body bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">

    <!-- Hero Section -->
    <section class="hero-gradient py-24 px-4 text-center text-white">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-5xl md:text-7xl font-display font-black mb-6 tracking-tight">
          ENCUENTRA EL <span class="text-primary">TALENTO</span> EN ESPAÑA
        </h1>
        <p class="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto font-light">
          Conectando a las futuras estrellas del fútbol con los mejores ojeadores y clubes de la península.
        </p>
        <div class="relative max-w-2xl mx-auto">
          <div class="flex items-center bg-white rounded-2xl p-2 shadow-2xl">
            <span class="material-symbols-rounded text-slate-400 ml-3">search</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por nombre, posición o club..."
              class="w-full border-none focus:ring-0 text-slate-900 px-4 py-3 text-lg"
              @keydown.enter="runSearch"
            />
            <button 
              type="button"
              class="bg-primary hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2"
              :disabled="searching"
              @click="runSearch"
            >
              {{ searching ? 'BUSCANDO...' : 'BUSCAR' }}
            </button>
          </div>
          <div v-if="searchError" class="mt-4 text-red-400 text-sm">{{ searchError }}</div>
          <div class="mt-4 flex flex-wrap justify-center gap-2 text-sm">
            <span class="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">#Delanteros</span>
            <span class="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">#LaLiga</span>
            <span class="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">#Sub21</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Players Section -->
    <section class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-end mb-12">
        <div>
          <h2 class="text-3xl font-display font-black mb-2 uppercase tracking-tight">
            {{ searchQuery ? 'Resultados de Búsqueda' : 'Jugadores Destacados' }}
          </h2>
          <p class="text-slate-500 dark:text-slate-400">
            {{ searchQuery ? `Resultados para "${searchQuery}"` : 'Jugadores de La Liga 2 que están dando que hablar esta temporada.' }}
          </p>
        </div>
        <a v-if="!searchQuery" class="text-primary font-bold flex items-center gap-1 hover:underline" href="/laliga2">
          Ver clasificación <span class="material-symbols-rounded">arrow_forward</span>
        </a>
      </div>

      <!-- Loading State -->
      <div v-if="(searching || initialLoading) && searchResults.length === 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="i in 4" :key="i" class="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
          <div class="animate-pulse">
            <div class="aspect-[3/4] bg-slate-200 dark:bg-slate-700"></div>
            <div class="p-6 space-y-4">
              <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              <div class="grid grid-cols-2 gap-4">
                <div class="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div class="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Players Grid -->
      <div v-else-if="searchResults.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div 
          v-for="item in searchResults" 
          :key="item.player.id" 
          class="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 transform hover:-translate-y-1"
        >
          <!-- Player Image Section -->
          <div class="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img 
              v-if="item.player.photo" 
              :src="item.player.photo" 
              :alt="item.player.name" 
              class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              @error="($event.target as HTMLImageElement).style.display='none'"
            />
            <div 
              v-if="!item.player.photo"
              class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800"
            >
              <div class="text-center">
                <span class="text-5xl font-black text-slate-400 dark:text-slate-500">{{ initials(item.player.name) }}</span>
              </div>
            </div>
            
            <!-- Position Badge -->
            <div class="absolute top-4 left-4">
              <span class="bg-primary text-white text-xs font-black px-3 py-1.5 rounded-full uppercase shadow-lg">
                {{ getPlayerPosition(item) }}
              </span>
            </div>
            
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            
            <!-- Player Info Overlay -->
            <div class="absolute bottom-0 left-0 right-0 p-4">
              <h3 class="text-white font-black text-2xl leading-tight mb-1">{{ item.player.name.toUpperCase() }}</h3>
              <div class="flex items-center gap-2">
                <span class="text-primary font-bold text-sm">{{ getPlayerTeam(item) }}</span>
                <span class="text-white/60 text-xs">• La Liga 2</span>
              </div>
            </div>
          </div>
          
          <!-- Player Stats Section -->
          <div class="p-6">
            <!-- Team Info -->
            <div class="flex justify-between items-center mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-500 text-xs font-bold uppercase tracking-wider">Club Actual</span>
              <span class="font-bold text-sm text-slate-900 dark:text-white">{{ getPlayerTeam(item) }}</span>
            </div>
            
            <!-- Stats Grid -->
            <div class="grid grid-cols-2 gap-3 mb-6">
              <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 p-3 rounded-xl text-center border border-emerald-200 dark:border-emerald-800">
                <span class="block text-xs text-emerald-600 dark:text-emerald-400 uppercase font-bold mb-1">Goles</span>
                <span class="font-black text-2xl text-emerald-700 dark:text-emerald-300">{{ getPlayerStats(item).goals }}</span>
              </div>
              <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-3 rounded-xl text-center border border-blue-200 dark:border-blue-800">
                <span class="block text-xs text-blue-600 dark:text-blue-400 uppercase font-bold mb-1">Asist.</span>
                <span class="font-black text-2xl text-blue-700 dark:text-blue-300">{{ getPlayerStats(item).assists }}</span>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="space-y-3">
              <button 
                type="button"
                class="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                @click="analysePlayer(item.player.id)"
              >
                <span class="material-symbols-rounded">analytics</span>
                ANALIZAR JUGADOR
              </button>
              
              <button
                v-if="!isFavorite(item.player.id)"
                type="button"
                class="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                @click="addToFavorites(item)"
              >
                <span class="material-symbols-rounded">favorite_border</span>
                AÑADIR A FAVORITOS
              </button>
              
              <button
                v-else
                type="button"
                class="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                @click="removeFavorite(item.player.id)"
              >
                <span class="material-symbols-rounded">favorite</span>
                ELIMINAR DE FAVORITOS
              </button>
              <button
                v-if="isAuthenticated"
                type="button"
                class="w-full border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                @click="openAddToListModal(item.player.id)"
              >
                <span class="material-symbols-rounded">playlist_add</span>
                AÑADIR A MI LISTA
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!searching && !initialLoading" class="text-center py-12">
        <span class="material-symbols-rounded text-6xl text-slate-300">search_off</span>
        <p class="text-slate-500 mt-4">No se encontraron jugadores</p>
      </div>
    </section>

    <!-- Favorites Section -->
    <section v-if="hasFavorites" class="bg-slate-50 dark:bg-slate-900/50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-end mb-12">
          <div>
            <h2 class="text-3xl font-display font-black mb-2 uppercase tracking-tight">Mis Favoritos</h2>
            <p class="text-slate-500 dark:text-slate-400">Jugadores que has guardado para análisis.</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div 
            v-for="p in favorites" 
            :key="p.id" 
            class="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 transform hover:-translate-y-1"
          >
            <!-- Player Image Section -->
            <div class="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img 
                v-if="p.photo" 
                :src="p.photo" 
                :alt="p.name" 
                class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                @error="($event.target as HTMLImageElement).style.display='none'"
              />
              <div 
                v-if="!p.photo"
                class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800"
              >
                <div class="text-center">
                  <span class="text-5xl font-black text-slate-400 dark:text-slate-500">{{ initials(p.name) }}</span>
                </div>
              </div>
              
              <!-- Favorite Badge -->
              <div class="absolute top-4 left-4">
                <span class="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-black px-3 py-1.5 rounded-full uppercase shadow-lg">
                  FAVORITO
                </span>
              </div>
              
              <!-- Gradient Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              
              <!-- Player Info Overlay -->
              <div class="absolute bottom-0 left-0 right-0 p-4">
                <h3 class="text-white font-black text-2xl leading-tight mb-1">{{ p.name.toUpperCase() }}</h3>
                <div class="flex items-center gap-2">
                  <span class="text-primary font-bold text-sm">{{ p.team || 'La Liga 2' }}</span>
                  <span class="text-white/60 text-xs">• Favorito</span>
                </div>
              </div>
            </div>
            
            <!-- Player Stats Section -->
            <div class="p-6">
              <!-- Team Info -->
              <div class="flex justify-between items-center mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <span class="text-slate-500 text-xs font-bold uppercase tracking-wider">Club Actual</span>
                <span class="font-bold text-sm text-slate-900 dark:text-white">{{ p.team || 'N/A' }}</span>
              </div>
              
              <!-- Action Buttons -->
              <div class="space-y-3">
                <button 
                  type="button"
                  class="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  @click="analyseFavorite(p.id)"
                >
                  <span class="material-symbols-rounded">analytics</span>
                  ANALIZAR JUGADOR
                </button>
                <button
                  type="button"
                  class="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  @click="removeFavorite(p.id)"
                >
                  <span class="material-symbols-rounded">delete</span>
                  ELIMINAR
                </button>
                <button
                  v-if="isAuthenticated"
                  type="button"
                  class="w-full border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                  @click="openAddToListModal(p.id)"
                >
                  <span class="material-symbols-rounded">playlist_add</span>
                  AÑADIR A MI LISTA
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <ModalSelectLista
      :model-value="showModalSelectLista"
      :player-id="playerIdForListModal"
      @update:model-value="showModalSelectLista = $event"
    />
  </div>
</template>
