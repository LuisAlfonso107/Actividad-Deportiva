<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import type { PlayersSearchResponse } from '../services/types'
import { getPlayer, LALIGA2_LEAGUE_ID, searchPlayers } from '../services/footballApi'
import { getPlayerFromTheSportsDB } from '../services/playersApi'
import { useApiErrorStore } from '../stores/apiError'
import { useAuthStore } from '../stores/auth'
import { useFavoritesStore } from '../stores/favorites'
import ModalSelectLista from '../components/ModalSelectLista.vue'

const route = useRoute()
const router = useRouter()
const apiErrorStore = useApiErrorStore()
const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()
const { isAuthenticated } = storeToRefs(authStore)

const showModalSelectLista = ref(false)
const loading = ref(true)
const error = ref<string | null>(null)
const data = ref<PlayersSearchResponse | null>(null)

const playerId = computed(() => Number(route.params.id))
const season = computed(() => Number(route.query.season) || 2024)
const playerNameFromQuery = computed(() => (route.query.name as string) ?? '')

const player = computed(() => data.value?.response?.[0] ?? null)
const p = computed(() => player.value?.player)
const statsList = computed(() => player.value?.statistics ?? [])
const firstStats = computed(() => statsList.value[0] ?? null)

onMounted(async () => {
  const id = playerId.value
  const name = playerNameFromQuery.value.trim()

  if (!id && !name) {
    error.value = 'Invalid player'
    loading.value = false
    return
  }

  try {
    if (id && !isNaN(id)) {
      let res = await getPlayer(id, season.value)
      if (res.response?.length) {
        data.value = res
        loading.value = false
        return
      }
      try {
        res = await getPlayerFromTheSportsDB(id)
        if (res.response?.length) {
          data.value = res
          loading.value = false
          return
        }
      } catch {
        // ignore – try name search next
      }
    }
    if (name.length >= 4) {
      const searchRes = await searchPlayers(name, { league: LALIGA2_LEAGUE_ID, season: season.value })
      if (searchRes.response?.length) {
        const first = searchRes.response[0]
        if (first) {
          data.value = { ...searchRes, response: [first] }
          router.replace({
            name: 'player-analysis',
            params: { id: String(first.player.id) },
            query: { ...route.query, name },
          })
        }
        loading.value = false
        return
      }
      const anyLeague = await searchPlayers(name, { league: 39, season: season.value })
      if (anyLeague.response?.length) {
        const first = anyLeague.response[0]
        if (first) {
          data.value = { ...anyLeague, response: [first] }
          router.replace({
            name: 'player-analysis',
            params: { id: String(first.player.id) },
            query: { ...route.query, name },
          })
        }
        loading.value = false
        return
      }
    }
    error.value = 'Player not found'
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to load player'
    error.value = msg
    apiErrorStore.setError(msg)
  } finally {
    loading.value = false
  }
})

function goBack() {
  router.push('/')
}

function show(val: string | number | null | undefined): string {
  if (val === null || val === undefined || val === '') return '—'
  return String(val)
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(p => p.length > 0)
  if (parts.length >= 2) {
    const first = parts[0]
    const last = parts[parts.length - 1]
    if (first && last && first[0] && last[0]) {
      return (first[0] + last[0]).toUpperCase()
    }
  }
  if (parts[0] && parts[0].length >= 2) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  if (parts[0] && parts[0][0]) {
    return parts[0][0].toUpperCase()
  }
  return '?'
}

function addToFavorites() {
  if (!player.value?.player) return
  const pl = player.value.player
  const team = player.value.statistics?.[0]?.team
  favoritesStore.add({
    id: pl.id,
    name: pl.name,
    photo: pl.photo,
    team: team?.name,
    teamLogo: team?.logo,
  })
}

function removeFromFavorites() {
  if (p.value) favoritesStore.remove(p.value.id)
}

function isFavorite(): boolean {
  return p.value ? favoritesStore.isFavorite(p.value.id) : false
}

function openAddToListModal() {
  showModalSelectLista.value = true
}
</script>

<template>
  <div class="font-body bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
    <!-- Back Button -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <button 
        @click="goBack"
        class="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors font-medium"
      >
        <span class="material-symbols-rounded">arrow_back</span>
        Volver
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center py-16">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p class="mt-4 text-slate-600 dark:text-slate-400">Cargando datos del jugador...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center py-16">
        <span class="material-symbols-rounded text-6xl text-red-400">error</span>
        <h3 class="text-xl font-semibold text-slate-600 mt-4">{{ error }}</h3>
      </div>
    </div>

    <!-- Player Content -->
    <template v-else-if="p">
      <!-- Player Header -->
      <section class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            <!-- Player Photo -->
            <div class="flex-shrink-0">
              <div class="relative w-32 h-32 md:w-48 md:h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden">
                <img
                  v-if="p.photo"
                  :src="p.photo"
                  :alt="p.name"
                  class="w-full h-full object-cover"
                  @error="(e: Event) => { const target = e.target as HTMLImageElement; target.style.display = 'none' }"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800"
                >
                  <span class="text-4xl md:text-6xl font-black text-slate-400 dark:text-slate-500">{{ initials(p.name) }}</span>
                </div>
              </div>
            </div>

            <!-- Player Info -->
            <div class="flex-1">
              <h1 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">{{ p.name }}</h1>
              <div class="space-y-2 text-slate-600 dark:text-slate-400">
                <p v-if="p.display_name && p.display_name !== p.name">
                  Nombre completo: {{ p.display_name }}
                </p>
                <p v-if="p.common_name && p.common_name !== p.name">
                  Nombre común: {{ p.common_name }}
                </p>
                <p v-if="firstStats?.team?.name">
                  Club actual: {{ firstStats.team.name }}
                </p>
                <p v-if="firstStats?.games?.position">
                  Posición: {{ show(firstStats.games.position) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Clubs Section -->
            <section v-if="statsList.length > 0" class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div class="p-6 border-b border-slate-200 dark:border-slate-800">
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">Clubes</h2>
                <p class="text-slate-600 dark:text-slate-400 text-sm mt-1">Clubes actuales y anteriores</p>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    v-for="stat in statsList"
                    :key="stat.team.id"
                    class="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <img
                      v-if="stat.team.logo"
                      :src="stat.team.logo"
                      :alt="stat.team.name"
                      class="w-12 h-12 object-contain"
                      @error="(e: Event) => { const target = e.target as HTMLImageElement; target.style.display = 'none' }"
                    />
                    <div v-else class="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                      <span class="material-symbols-rounded text-slate-400">sports_soccer</span>
                    </div>
                    <div>
                      <h3 class="font-semibold text-slate-900 dark:text-white">{{ stat.team.name || '—' }}</h3>
                      <p class="text-sm text-slate-600 dark:text-slate-400">Temporada 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Statistics Section -->
            <section v-if="firstStats" class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div class="p-6 border-b border-slate-200 dark:border-slate-800">
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">Estadísticas</h2>
                <p class="text-slate-600 dark:text-slate-400 text-sm mt-1">Rendimiento del jugador</p>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
                    <div class="text-2xl font-black text-emerald-700 dark:text-emerald-300">{{ firstStats.games?.appearences ?? '—' }}</div>
                    <div class="text-xs text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wider mt-1">Partidos</div>
                  </div>
                  <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800 text-center">
                    <div class="text-2xl font-black text-blue-700 dark:text-blue-300">{{ firstStats.goals?.total ?? '—' }}</div>
                    <div class="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wider mt-1">Goles</div>
                  </div>
                  <div class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800 text-center">
                    <div class="text-2xl font-black text-purple-700 dark:text-purple-300">{{ firstStats.goals?.assists ?? '—' }}</div>
                    <div class="text-xs text-purple-600 dark:text-purple-400 font-medium uppercase tracking-wider mt-1">Asistencias</div>
                  </div>
                  <div class="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800 text-center">
                    <div class="text-2xl font-black text-orange-700 dark:text-orange-300">{{ show(firstStats.games?.rating) }}</div>
                    <div class="text-xs text-orange-600 dark:text-orange-400 font-medium uppercase tracking-wider mt-1">Rating</div>
                  </div>
                  <div class="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-xl border border-red-200 dark:border-red-800 text-center">
                    <div class="text-2xl font-black text-red-700 dark:text-red-300">{{ firstStats.shots?.total ?? '—' }}</div>
                    <div class="text-xs text-red-600 dark:text-red-400 font-medium uppercase tracking-wider mt-1">Tiros</div>
                  </div>
                  <div class="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 p-4 rounded-xl border border-cyan-200 dark:border-cyan-800 text-center">
                    <div class="text-2xl font-black text-cyan-700 dark:text-cyan-300">{{ firstStats.passes?.total ?? '—' }}</div>
                    <div class="text-xs text-cyan-600 dark:text-cyan-400 font-medium uppercase tracking-wider mt-1">Pases</div>
                  </div>
                  <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800 text-center">
                    <div class="text-2xl font-black text-yellow-700 dark:text-yellow-300">{{ firstStats.tackles?.total ?? '—' }}</div>
                    <div class="text-xs text-yellow-600 dark:text-yellow-400 font-medium uppercase tracking-wider mt-1">Entradas</div>
                  </div>
                  <div class="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 p-4 rounded-xl border border-pink-200 dark:border-pink-800 text-center">
                    <div class="text-2xl font-black text-pink-700 dark:text-pink-300">{{ firstStats.duels?.total ?? '—' }}</div>
                    <div class="text-xs text-pink-600 dark:text-pink-400 font-medium uppercase tracking-wider mt-1">Duelos</div>
                  </div>
                </div>

                <!-- Additional Stats -->
                <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div class="text-sm text-slate-600 dark:text-slate-400 mb-1">Tarjetas (Amarillas / Rojas)</div>
                    <div class="font-semibold text-slate-900 dark:text-white">
                      {{ firstStats.cards?.yellow ?? '0' }} / {{ firstStats.cards?.red ?? '0' }}
                    </div>
                  </div>
                  <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div class="text-sm text-slate-600 dark:text-slate-400 mb-1">Penales (Marcados / Fallados)</div>
                    <div class="font-semibold text-slate-900 dark:text-white">
                      {{ firstStats.penalty?.scored ?? '0' }} / {{ firstStats.penalty?.missed ?? '0' }}
                    </div>
                  </div>
                  <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div class="text-sm text-slate-600 dark:text-slate-400 mb-1">Faltas (Recibidas / Cometidas)</div>
                    <div class="font-semibold text-slate-900 dark:text-white">
                      {{ firstStats.fouls?.drawn ?? '0' }} / {{ firstStats.fouls?.committed ?? '0' }}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- Right Column -->
          <div class="space-y-8">
            <!-- Actions: Favorites + Add to list -->
            <section class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div class="p-6 border-b border-slate-200 dark:border-slate-800">
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">Acciones</h2>
              </div>
              <div class="p-6 space-y-3">
                <button
                  v-if="!isFavorite()"
                  type="button"
                  class="w-full flex items-center justify-center gap-2 bg-primary hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  @click="addToFavorites()"
                >
                  <span class="material-symbols-rounded">favorite_border</span>
                  Añadir a favoritos
                </button>
                <button
                  v-else
                  type="button"
                  class="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  @click="removeFromFavorites()"
                >
                  <span class="material-symbols-rounded">favorite</span>
                  Quitar de favoritos
                </button>
                <button
                  v-if="isAuthenticated"
                  type="button"
                  class="w-full flex items-center justify-center gap-2 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold py-3 px-4 rounded-lg transition-colors"
                  @click="openAddToListModal()"
                >
                  <span class="material-symbols-rounded">playlist_add</span>
                  Añadir a mi lista
                </button>
              </div>
            </section>

            <!-- Personal Information -->
            <section class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div class="p-6 border-b border-slate-200 dark:border-slate-800">
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">Información Personal</h2>
              </div>
              <div class="p-6 space-y-4">
                <div class="flex justify-between">
                  <span class="text-sm text-slate-600 dark:text-slate-400">Nombre</span>
                  <span class="text-sm font-medium text-slate-900 dark:text-white">{{ show(p.firstname) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-slate-600 dark:text-slate-400">Apellido</span>
                  <span class="text-sm font-medium text-slate-900 dark:text-white">{{ show(p.lastname) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-slate-600 dark:text-slate-400">Edad</span>
                  <span class="text-sm font-medium text-slate-900 dark:text-white">{{ show(p.age) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-slate-600 dark:text-slate-400">Fecha de nacimiento</span>
                  <span class="text-sm font-medium text-slate-900 dark:text-white">{{ show(p.birth?.date) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-slate-600 dark:text-slate-400">Lugar de nacimiento</span>
                  <span class="text-sm font-medium text-slate-900 dark:text-white">{{ show(p.birth?.place) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-slate-600 dark:text-slate-400">País</span>
                  <span class="text-sm font-medium text-slate-900 dark:text-white">{{ show(p.birth?.country) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-slate-600 dark:text-slate-400">Nacionalidad</span>
                  <span class="text-sm font-medium text-slate-900 dark:text-white">{{ show(p.nationality) }}</span>
                </div>
              </div>
            </section>

            <!-- Physical Information -->
            <section class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div class="p-6 border-b border-slate-200 dark:border-slate-800">
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">Características Físicas</h2>
              </div>
              <div class="p-6 space-y-4">
                <div class="flex justify-between">
                  <span class="text-sm text-slate-600 dark:text-slate-400">Altura</span>
                  <span class="text-sm font-medium text-slate-900 dark:text-white">{{ show(p.height) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-slate-600 dark:text-slate-400">Peso</span>
                  <span class="text-sm font-medium text-slate-900 dark:text-white">{{ show(p.weight) }}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <ModalSelectLista
        v-if="p"
        :model-value="showModalSelectLista"
        :player-id="p.id"
        @update:model-value="showModalSelectLista = $event"
      />
    </template>
  </div>
</template>

<style scoped>
/* Tailwind CSS handles all styling */
</style>
