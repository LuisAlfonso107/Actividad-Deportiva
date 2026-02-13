<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { ApiPlayerResponse } from '../services/footballApi'
import { getInitialPlayers, searchPlayers } from '../services/footballApi'
import { getLaLiga2PlayersWithPhotos, searchPlayersTheSportsDB } from '../services/thesportsdb'
import { useApiErrorStore } from '../stores/apiError'
import { useFavoritesStore } from '../stores/favorites'

const router = useRouter()
const apiErrorStore = useApiErrorStore()
const favoritesStore = useFavoritesStore()

const searchQuery = ref('')
const searching = ref(false)
const initialLoading = ref(true)
const searchError = ref<string | null>(null)
const searchResults = ref<ApiPlayerResponse[]>([])

// Filters
const selectedPosition = ref('Todas las posiciones')
const selectedAge = ref('Cualquier edad')
const selectedLeague = ref('Todas las ligas')

const positions = ['Todas las posiciones', 'Portero', 'Defensa', 'Centrocampista', 'Delantero']
const ages = ['Cualquier edad', 'Sub-17', 'Sub-19', 'Sub-21', 'Sub-23', '23-26', '27-30', '30+']
const leagues = ['Todas las ligas', 'LaLiga', 'LaLiga SmartBank', 'Primera Federación', 'Segunda Federación']

const favorites = computed(() => favoritesStore.favorites)
const hasFavorites = computed(() => favorites.value.length > 0)

onMounted(async () => {
  try {
    console.log('Loading initial players...')
    const allPlayers: ApiPlayerResponse[] = []
    
    // Try multiple leagues and common names to get more players
    const commonSearches = ['Juan', 'Carlos', 'Jose', 'Miguel', 'Antonio', 'Francisco', 'David', 'Javier', 'Daniel', 'Alejandro']
    const leagues = [140, 39, 135, 136] // LaLiga2, LaLiga, Serie A, Premier League
    
    // First try team-specific players
    try {
      console.log('Trying LaLiga2 players...')
      const teamRes = await getLaLiga2PlayersWithPhotos()
      console.log('LaLiga2 players:', teamRes.response?.length || 0)
      allPlayers.push(...(teamRes.response ?? []))
    } catch (e) {
      console.log('LaLiga2 failed, trying Barcelona...')
      try {
        const teamRes = await getInitialPlayers()
        console.log('Barcelona players:', teamRes.response?.length || 0)
        allPlayers.push(...(teamRes.response ?? []))
      } catch (e2) {
        console.log('Team data failed, using broader search')
      }
    }
    
    console.log('Current player count:', allPlayers.length)
    
    // If we still need more players, search for common names across multiple leagues
    if (allPlayers.length < 100) {
      console.log('Searching for more players...')
      const searchPromises: Promise<{ response: ApiPlayerResponse[] }>[] = []
      
      // Search for common names in different leagues
      for (const search of commonSearches.slice(0, 8)) {
        for (const league of leagues.slice(0, 2)) { // Limit to 2 leagues for performance
          searchPromises.push(
            searchPlayers(search, { league, season: 2024 }).catch(() => ({ response: [] as ApiPlayerResponse[] }))
          )
        }
      }
      
      const searchResults = await Promise.all(searchPromises)
      const mergedResults = searchResults.flatMap(res => res.response ?? [])
      console.log('Search results before dedup:', mergedResults.length)
      
      // Remove duplicates by player ID
      const uniquePlayers = mergedResults.filter((player, index, self) => 
        index === self.findIndex(p => p.player.id === player.player.id)
      )
      console.log('Unique search results:', uniquePlayers.length)
      
      allPlayers.push(...uniquePlayers)
    }
    
    // Remove any final duplicates and limit to 100 players
    const finalUniquePlayers = allPlayers.filter((player, index, self) => 
      index === self.findIndex(p => p.player.id === player.player.id)
    )
    
    searchResults.value = finalUniquePlayers.slice(0, 100)
    console.log('Final player count:', searchResults.value.length)
    
    if (searchResults.value.length === 0 && !searchQuery.value.trim()) {
      searchError.value = 'Add VITE_FOOTBALL_API_KEY to .env and restart the dev server.'
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to load players'
    console.error('Error loading players:', e)
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
    return
  }
  searchError.value = null
  searching.value = true
  searchResults.value = []
  try {
    const [resFootball, resTheSportsDB] = await Promise.all([
      searchPlayers(q).catch(() => ({ response: [] as ApiPlayerResponse[], results: 0 })),
      searchPlayersTheSportsDB(q).catch(() => ({ response: [] as ApiPlayerResponse[], results: 0 })),
    ])
    const fromFootball = resFootball.response ?? []
    const fromTheSportsDB = resTheSportsDB.response ?? []
    const merged = [...fromFootball, ...fromTheSportsDB]
    searchResults.value = merged
    if (merged.length === 0) {
      searchError.value = 'No players found'
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
    return
  }
  searchError.value = null
  debounceTimer = setTimeout(() => {
    debounceTimer = null
    runSearch()
  }, DEBOUNCE_MS)
})

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

function getPlayerPosition(item: ApiPlayerResponse): string {
  return item.statistics?.[0]?.games?.position || 'Delantero'
}

function getPlayerTeam(item: ApiPlayerResponse): string {
  return item.statistics?.[0]?.team?.name || 'La Liga 2'
}

function getPlayerLeague(item: ApiPlayerResponse): string {
  // Since league info isn't available in the API response, we'll determine it based on the search context
  // This is a simplified approach - in a real app, you'd want league info in the API response
  const teamName = item.statistics?.[0]?.team?.name || ''
  
  // Known LaLiga 2 teams
  const laliga2Teams = ['Real Zaragoza', 'Sporting Gijón', 'Racing Santander', 'CD Leganés', 'Albacete']
  if (laliga2Teams.some(team => teamName.toLowerCase().includes(team.toLowerCase()))) {
    return 'LaLiga SmartBank'
  }
  
  // Known LaLiga teams
  const laligaTeams = ['Barcelona', 'Real Madrid', 'Atlético Madrid', 'Sevilla', 'Real Betis']
  if (laligaTeams.some(team => teamName.toLowerCase().includes(team.toLowerCase()))) {
    return 'LaLiga'
  }
  
  // Default fallback
  return searchQuery.value ? 'Global' : 'LaLiga SmartBank'
}

function getPlayerStats(item: ApiPlayerResponse) {
  return {
    goals: Math.floor(Math.random() * 20),
    assists: Math.floor(Math.random() * 15),
    physical: Math.floor(Math.random() * 30) + 70,
    pace: Math.floor(Math.random() * 30) + 70
  }
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
  <div class="font-body bg-slate-50 text-slate-900">

    <!-- Filters Bar -->
    <div class="bg-white border-b border-slate-200 shadow-sm sticky top-[113px] z-40">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 py-4">
        <!-- Mobile Filters -->
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
              />
              <span class="material-symbols-outlined absolute left-2 top-2 text-slate-400 text-sm">search</span>
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
        
        <!-- Desktop Filters -->
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
              />
              <span class="material-symbols-outlined absolute left-2 top-2 text-slate-400 text-sm">search</span>
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

    <!-- Main Content -->
    <main class="max-w-[1440px] mx-auto px-6 py-8">
      <!-- Results Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">
            {{ searchQuery ? `Resultados para "${searchQuery}"` : 'Todos los Jugadores' }}
          </h2>
          <p class="text-slate-500 text-sm mt-1">{{ searchResults.length }} jugadores encontrados</p>
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

      <!-- Loading State -->
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

      <!-- Players Grid -->
      <div v-else-if="searchResults.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <div
          v-for="item in searchResults"
          :key="item.player.id"
          class="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 hover:shadow-lg transition-all duration-300 group"
        >
          <!-- Player Image -->
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
            
            <!-- Position Badge -->
            <div class="absolute top-3 left-3">
              <span class="bg-primary text-white text-xs font-black px-2 py-1 rounded-full uppercase">
                {{ getPlayerPosition(item) }}
              </span>
            </div>
            
            <!-- Favorite Button -->
            <button
              @click.stop="isFavorite(item.player.id) ? removeFavorite(item.player.id) : addToFavorites(item)"
              class="absolute top-3 right-3 p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm"
              :class="{ 'text-red-500': isFavorite(item.player.id), 'text-slate-400': !isFavorite(item.player.id) }"
            >
              <span class="material-symbols-outlined text-lg">{{ isFavorite(item.player.id) ? 'favorite' : 'favorite_border' }}</span>
            </button>
          </div>
          
          <!-- Player Info -->
          <div class="p-4">
            <h3 class="font-bold text-lg text-slate-900 mb-1">{{ item.player.name }}</h3>
            <div class="flex items-center gap-2 mb-3">
              <span class="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                {{ getPlayerLeague(item) }}
              </span>
              <span class="text-slate-500 text-sm">{{ getPlayerTeam(item) }}</span>
            </div>
            
            <!-- Quick Stats -->
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
            
            <!-- Actions -->
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

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <span class="material-symbols-outlined text-6xl text-slate-300">search_off</span>
        <h3 class="text-xl font-semibold text-slate-600 mt-4">No se encontraron jugadores</h3>
        <p class="text-slate-500 mt-2">Intenta ajustando los filtros o términos de búsqueda</p>
      </div>
    </main>
  </div>
</template>
