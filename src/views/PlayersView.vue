<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchPlayers } from '../composable/useSearchPlayers'
import { useFavoritesStore } from '../stores/favorites'
import type { ApiPlayerResponse } from '../services/playersApi'

const router = useRouter()
const favoritesStore = useFavoritesStore()

const {
  searchQuery,
  searching,
  initialLoading,
  searchError,
  searchResults,
  filteredResults,
  selectedPosition,
  selectedAge,
  selectedLeague,
  positions,
  ages,
  leagues,
  runSearch,
  getPlayerPosition,
  getPlayerTeam,
  getPlayerLeague,
  getPlayerStats,
  initials,
} = useSearchPlayers()

const favorites = computed(() => favoritesStore.favorites)
const hasFavorites = computed(() => favorites.value.length > 0)

function viewPlayer(id: number) {
  router.push({ name: 'player', params: { id: String(id) } })
}

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
</script>

<template>
  <div class="font-body bg-slate-50 text-slate-900">

    <div class="bg-white border-b border-slate-200 shadow-sm sticky top-[113px] z-40">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 py-4">
        <div class="lg:hidden space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-400">Posición</label>
              <select v-model="selectedPosition" class="w-full border-slate-200 rounded-lg text-sm font-semibold focus:ring-primary focus:border-primary">
                <option v-for="position in positions" :key="position" :value="position">{{ position }}</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-400">Edad</label>
              <select v-model="selectedAge" class="w-full border-slate-200 rounded-lg text-sm font-semibold focus:ring-primary focus:border-primary">
                <option v-for="age in ages" :key="age" :value="age">{{ age }}</option>
              </select>
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-400">Buscar</label>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Nombre del jugador..."
                class="w-full border-slate-200 rounded-lg text-sm font-semibold pl-8 pr-3 py-2 focus:ring-primary focus:border-primary"
                @keydown.enter="runSearch"
              />
              <span class="material-symbols-rounded absolute left-2 top-2 text-slate-400 text-sm">search</span>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-400">Liga</label>
              <select v-model="selectedLeague" class="w-full border-slate-200 rounded-lg text-sm font-semibold focus:ring-primary focus:border-primary">
                <option v-for="league in leagues" :key="league" :value="league">{{ league }}</option>
              </select>
            </div>
            <div class="flex items-end">
              <button
                @click="runSearch"
                :disabled="searching"
                class="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {{ searching ? 'BUSCANDO...' : 'BUSCAR' }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="hidden lg:grid grid-cols-5 gap-4">
          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-400">Posición</label>
            <select v-model="selectedPosition" class="w-full border-slate-200 rounded-lg text-sm font-semibold focus:ring-primary focus:border-primary">
              <option v-for="position in positions" :key="position" :value="position">{{ position }}</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-400">Edad</label>
            <select v-model="selectedAge" class="w-full border-slate-200 rounded-lg text-sm font-semibold focus:ring-primary focus:border-primary">
              <option v-for="age in ages" :key="age" :value="age">{{ age }}</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-400">Liga</label>
            <select v-model="selectedLeague" class="w-full border-slate-200 rounded-lg text-sm font-semibold focus:ring-primary focus:border-primary">
              <option v-for="league in leagues" :key="league" :value="league">{{ league }}</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-400">Buscar</label>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Nombre del jugador..."
                class="w-full border-slate-200 rounded-lg text-sm font-semibold pl-8 pr-3 py-2 focus:ring-primary focus:border-primary"
                @keydown.enter="runSearch"
              />
              <span class="material-symbols-rounded absolute left-2 top-2 text-slate-400 text-sm">search</span>
            </div>
          </div>
          <div class="flex items-end">
            <button
              @click="runSearch"
              :disabled="searching"
              class="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {{ searching ? 'BUSCANDO...' : 'BUSCAR' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <main class="max-w-[1440px] mx-auto px-6 py-8">
      <div v-if="searchError" class="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-200 text-sm">
        {{ searchError }}
      </div>
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">
            {{ searchQuery ? `Resultados para "${searchQuery}"` : 'Jugadores La Liga 2' }}
          </h2>
          <p class="text-slate-500 text-sm mt-1">{{ filteredResults.length }} jugadores</p>
        </div>
        <div class="flex items-center gap-4">
          <select class="border-slate-200 rounded-lg text-sm font-semibold">
            <option>Más relevantes</option>
            <option>Nombre A-Z</option>
            <option>Nombre Z-A</option>
            <option>Edad</option>
            <option>Valor</option>
          </select>
        </div>
      </div>

      <div v-if="searching || initialLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <div v-for="i in 8" :key="i" class="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
          <div class="animate-pulse">
            <div class="h-48 bg-slate-200"></div>
            <div class="p-4 space-y-3">
              <div class="h-4 bg-slate-200 rounded w-3/4"></div>
              <div class="h-3 bg-slate-200 rounded w-1/2"></div>
              <div class="flex justify-between">
                <div class="h-6 bg-slate-200 rounded w-16"></div>
                <div class="h-6 bg-slate-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="filteredResults.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <div
          v-for="item in filteredResults"
          :key="item.player.id"
          class="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 hover:shadow-lg transition-all duration-300 group"
        >
          <div class="relative h-48 bg-slate-100 overflow-hidden">
            <img
              v-if="item.player.photo"
              :src="item.player.photo"
              :alt="item.player.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300"
            >
              <span class="text-4xl font-black text-slate-400">{{ initials(item.player.name) }}</span>
            </div>
            
            <div class="absolute top-3 left-3">
              <span class="bg-primary text-white text-xs font-black px-2 py-1 rounded-full uppercase">
                {{ getPlayerPosition(item) }}
              </span>
            </div>
            
            <button
              @click.stop="isFavorite(item.player.id) ? removeFavorite(item.player.id) : addToFavorites(item)"
              class="absolute top-3 right-3 p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm"
              :class="{ 'text-red-500': isFavorite(item.player.id), 'text-slate-400': !isFavorite(item.player.id) }"
            >
              <span class="material-symbols-rounded text-lg">{{ isFavorite(item.player.id) ? 'favorite' : 'favorite_border' }}</span>
            </button>
          </div>
          
          <div class="p-4">
            <h3 class="font-bold text-lg text-slate-900 mb-1">{{ item.player.name }}</h3>
            <div class="flex items-center gap-2 mb-3">
              <span class="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                {{ getPlayerLeague(item) }}
              </span>
              <span class="text-slate-500 text-sm">{{ getPlayerTeam(item) }}</span>
            </div>
            
            <div class="grid grid-cols-3 gap-2 mb-4 text-center">
              <div class="bg-slate-50 rounded-lg p-2">
                <div class="font-black text-lg text-slate-900">{{ getPlayerStats(item).goals }}</div>
                <div class="text-xs text-slate-500">Goles</div>
              </div>
              <div class="bg-slate-50 rounded-lg p-2">
                <div class="font-black text-lg text-slate-900">{{ getPlayerStats(item).assists }}</div>
                <div class="text-xs text-slate-500">Asist.</div>
              </div>
              <div class="bg-slate-50 rounded-lg p-2">
                <div class="font-black text-lg text-slate-900">{{ getPlayerStats(item).physical }}</div>
                <div class="text-xs text-slate-500">Físico</div>
              </div>
            </div>
            
            <div class="flex gap-2">
              <button
                @click="viewPlayer(item.player.id)"
                class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-lg text-sm transition-colors"
              >
                Ver Perfil
              </button>
              <button
                @click="analysePlayer(item.player.id)"
                class="flex-1 bg-primary hover:bg-emerald-600 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-colors"
              >
                Analizar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-16">
        <span class="material-symbols-rounded text-6xl text-slate-300">search_off</span>
        <h3 class="text-xl font-semibold text-slate-600 mt-4">No se encontraron jugadores</h3>
        <p class="text-slate-500 mt-2">Intenta ajustando los filtros o términos de búsqueda</p>
      </div>
    </main>
  </div>
</template>
