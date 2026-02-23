<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getLaLigaStandings, THESPORTSDB_LALIGA2_LEAGUE_ID, type StandingRow, type StandingsResponse } from '../services/standingsApi'
import { useApiErrorStore } from '../stores/apiError'

const router = useRouter()
const apiErrorStore = useApiErrorStore()
const loading = ref(true)
const error = ref(null as string | null)
const data = ref(null as StandingsResponse | null)

const standings = computed(function () {
  const d = data.value
  if (!d || !d.standings) return []
  return d.standings
})

async function loadStandings() {
  loading.value = true
  error.value = null
  try {
    data.value = await getLaLigaStandings(THESPORTSDB_LALIGA2_LEAGUE_ID)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'No se pudo cargar la clasificación'
    apiErrorStore.setError(error.value)
  } finally {
    loading.value = false
  }
}

onMounted(loadStandings)

function goToTeamTransfers(row: StandingRow) {
  if (!row || !row.team) return
  router.push({
    name: 'team-transfers',
    params: { id: String(row.team.id) },
    state: { teamName: row.team.name, teamLogo: row.team.logo },
  })
}
</script>

<template>
  <main class="min-h-screen bg-background-light dark:bg-background-dark">
    <!-- Hero: league name and season from API only -->
    <section class="hero-gradient py-16 px-4 text-center text-white">
      <div class="max-w-4xl mx-auto">
        <span class="inline-block bg-emerald-500/30 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
          Clasificación en vivo
        </span>
        <h1 class="text-4xl md:text-6xl font-display font-black mb-4 tracking-tight">
          CLASIFICACIÓN <span class="text-primary">LA LIGA 2</span>
        </h1>
        <p class="text-xl text-slate-300 max-w-2xl mx-auto font-light">
          <template v-if="data">{{ data.leagueName }} – Temporada {{ data.season }} · En vivo</template>
          <template v-else>Cargando datos desde API...</template>
        </p>
      </div>
    </section>

    <!-- Standings Section -->
    <section class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <p class="text-slate-500 mt-4">Cargando clasificación...</p>
      </div>
      
      <div v-else-if="error" class="text-center py-12">
        <span class="material-symbols-rounded text-6xl text-red-400">error</span>
        <p class="text-red-500 mt-4">{{ error }}</p>
        <p class="text-slate-500 text-sm mt-2">Comprueba VITE_THESPORTSDB_API_KEY en .env si usas proxy.</p>
        <button
          type="button"
          @click="loadStandings"
          class="mt-4 bg-primary hover:bg-emerald-600 text-white font-semibold py-2 px-6 rounded-xl transition-colors"
        >
          Reintentar
        </button>
      </div>

      <template v-else-if="data">
        <!-- League Header: from API (leagueName, season) -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-8 mb-8 shadow-lg border border-slate-100 dark:border-slate-800">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                <span class="material-symbols-rounded text-white text-3xl">sports_soccer</span>
              </div>
              <div>
                <h2 class="text-2xl font-display font-black text-secondary dark:text-white">{{ data.leagueName }}</h2>
                <p class="text-slate-500 dark:text-slate-400">Temporada {{ data.season }} · En vivo (API)</p>
              </div>
            </div>
            <button
              type="button"
              @click="loadStandings"
              :disabled="loading"
              class="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-2 px-4 rounded-xl transition-colors disabled:opacity-50"
            >
              <span class="material-symbols-rounded text-lg">refresh</span>
              Actualizar
            </button>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800">
          <div v-if="standings.length > 0 && standings.length <= 5" class="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm text-center">
            La Liga 2 (Segunda División) no está incluida en el plan gratuito de football-data.org, por eso se muestran solo <strong>5 equipos</strong> desde TheSportsDB. Para la tabla completa necesitarías un plan de pago en <a href="https://www.football-data.org/pricing" target="_blank" rel="noopener" class="underline">football-data.org</a>.
          </div>
          <div v-if="standings.length === 0" class="p-12 text-center text-slate-500">
            La API no devolvió equipos para esta temporada.
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">#</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Equipo</th>
                  <th class="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">PJ</th>
                  <th class="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">G</th>
                  <th class="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">E</th>
                  <th class="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">P</th>
                  <th class="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">GF</th>
                  <th class="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">GC</th>
                  <th class="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">DG</th>
                  <th class="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Pts</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                <tr
                  v-for="row in standings"
                  :key="row.team.id"
                  class="hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  @click="goToTeamTransfers(row)"
                >
                  <td class="px-6 py-4">{{ row.rank }}</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <img v-if="row.team.logo" :src="row.team.logo" :alt="row.team.name" class="w-8 h-8 rounded-lg object-contain" />
                      <span v-else class="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                        <span class="material-symbols-rounded text-slate-400 text-sm">shield</span>
                      </span>
                      <span class="font-bold">{{ row.team.name }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-center">{{ row.played }}</td>
                  <td class="px-6 py-4 text-center">{{ row.win }}</td>
                  <td class="px-6 py-4 text-center">{{ row.draw }}</td>
                  <td class="px-6 py-4 text-center">{{ row.lose }}</td>
                  <td class="px-6 py-4 text-center">{{ row.goalsFor }}</td>
                  <td class="px-6 py-4 text-center">{{ row.goalsAgainst }}</td>
                  <td class="px-6 py-4 text-center">{{ row.goalsDiff > 0 ? '+' : '' }}{{ row.goalsDiff }}</td>
                  <td class="px-6 py-4 text-center">
                    <span class="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">{{ row.points }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="text-xs text-slate-400 text-center py-2 border-t border-slate-100 dark:border-slate-800">
            TheSportsDB API (en vivo)
          </p>
        </div>

        <!-- Legend -->
        <div class="mt-8 flex flex-wrap justify-center gap-6">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-green-100 dark:bg-green-900/30 rounded"></div>
            <span class="text-sm font-semibold text-slate-600 dark:text-slate-300">Promoción directa</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-yellow-100 dark:bg-yellow-900/30 rounded"></div>
            <span class="text-sm font-semibold text-slate-600 dark:text-slate-300">Play-off</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-red-100 dark:bg-red-900/30 rounded"></div>
            <span class="text-sm font-semibold text-slate-600 dark:text-slate-300">Descenso</span>
          </div>
        </div>
      </template>
    </section>
  </main>
</template>
