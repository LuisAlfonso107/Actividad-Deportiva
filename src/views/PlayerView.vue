<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPlayerFromTheSportsDB, type ApiPlayerResponse } from '../services/playersApi'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const error = ref<string | null>(null)
const playerData = ref<ApiPlayerResponse | null>(null)

const playerId = computed(() => route.params.id as string)

async function loadPlayer() {
  const id = playerId.value
  if (!id) {
    error.value = 'ID de jugador no válido'
    loading.value = false
    return
  }
  loading.value = true
  error.value = null
  playerData.value = null
  try {
    const res = await getPlayerFromTheSportsDB(id)
    const list = res.response ?? []
    playerData.value = list[0] ?? null
    if (!playerData.value) {
      error.value = 'Jugador no encontrado'
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'No se pudo cargar el perfil'
  } finally {
    loading.value = false
  }
}

onMounted(loadPlayer)
watch(playerId, loadPlayer)

const player = computed(() => playerData.value?.player)
const team = computed(() => playerData.value?.statistics?.[0]?.team)
const position = computed(() => playerData.value?.statistics?.[0]?.games?.position ?? '—')

function goToAnalysis() {
  router.push({ name: 'player-analysis', params: { id: playerId.value } })
}
</script>

<template>
  <div class="font-body bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <p class="mt-4 text-slate-500">Cargando perfil...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-16">
        <span class="material-symbols-rounded text-6xl text-slate-300">person_off</span>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white mt-4">Error</h1>
        <p class="text-slate-600 dark:text-slate-400 mt-2">{{ error }}</p>
        <router-link
          to="/players"
          class="inline-block mt-6 bg-primary hover:bg-emerald-600 text-white font-semibold py-2 px-6 rounded-xl transition-colors"
        >
          Volver a Jugadores
        </router-link>
      </div>

      <!-- Player profile -->
      <div v-else-if="player" class="bg-white dark:bg-slate-900 rounded-3xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-800">
        <div class="flex flex-col md:flex-row">
          <div class="md:w-2/5 relative aspect-[3/4] md:aspect-auto md:min-h-[400px] bg-slate-100 dark:bg-slate-800">
            <img
              v-if="player.photo"
              :src="player.photo"
              :alt="player.name"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-6xl font-black text-slate-400"
            >
              {{ player.name?.charAt(0) ?? '?' }}
            </div>
            <div class="absolute bottom-4 left-4 right-4">
              <span class="inline-block bg-primary text-white text-sm font-bold px-3 py-1.5 rounded-full uppercase">
                {{ position }}
              </span>
            </div>
          </div>
          <div class="md:w-3/5 p-6 md:p-8 flex flex-col justify-center">
            <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
              {{ player.name }}
            </h1>
            <div class="space-y-2 text-slate-600 dark:text-slate-400">
              <p v-if="team?.name" class="flex items-center gap-2">
                <span class="material-symbols-rounded text-lg">groups</span>
                <span class="font-semibold">{{ team.name }}</span>
              </p>
              <p v-if="player.age != null" class="flex items-center gap-2">
                <span class="material-symbols-rounded text-lg">cake</span>
                {{ player.age }} años
              </p>
              <p v-if="player.nationality" class="flex items-center gap-2">
                <span class="material-symbols-rounded text-lg">flag</span>
                {{ player.nationality }}
              </p>
            </div>
            <div class="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                @click="goToAnalysis"
                class="bg-primary hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-colors inline-flex items-center gap-2"
              >
                <span class="material-symbols-rounded">analytics</span>
                Analizar jugador
              </button>
              <router-link
                to="/players"
                class="inline-flex items-center gap-2 border-2 border-slate-300 dark:border-slate-600 hover:border-slate-400 text-slate-700 dark:text-slate-300 font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                <span class="material-symbols-rounded">arrow_back</span>
                Volver a Jugadores
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
