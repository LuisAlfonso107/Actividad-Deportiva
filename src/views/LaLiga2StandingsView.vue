<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { StandingRow, StandingsResponse } from '../services/footballApi'
import { getLaLigaStandings } from '../services/thesportsdb'
import { useApiErrorStore } from '../stores/apiError'

const router = useRouter()
const apiErrorStore = useApiErrorStore()
const loading = ref(true)
const error = ref<string | null>(null)
const data = ref<StandingsResponse | null>(null)

onMounted(async () => {
  try {
    data.value = await getLaLigaStandings()
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to load standings'
    error.value = msg
    apiErrorStore.setError(msg)
  } finally {
    loading.value = false
  }
})

function goToTeamTransfers(row: StandingRow) {
  router.push({
    name: 'team-transfers',
    params: { id: String(row.team.id) },
    state: { teamName: row.team.name, teamLogo: row.team.logo },
  })
}
</script>

<template>
  <main class="min-h-screen bg-background-light dark:bg-background-dark">
    <!-- Hero Section -->
    <section class="hero-gradient py-16 px-4 text-center text-white">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl md:text-6xl font-display font-black mb-4 tracking-tight">
          CLASIFICACIÓN <span class="text-primary">LA LIGA 2</span>
        </h1>
        <p class="text-xl text-slate-300 max-w-2xl mx-auto font-light">
          {{ data?.leagueName ?? 'Segunda División' }} – Temporada {{ data?.season ?? new Date().getFullYear() }}
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
      </div>

      <template v-else-if="data">
        <!-- League Header -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-8 mb-8 shadow-lg border border-slate-100 dark:border-slate-800">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <span class="material-symbols-rounded text-white text-3xl">sports_soccer</span>
            </div>
            <div>
              <h2 class="text-2xl font-display font-black text-secondary dark:text-white">{{ data.leagueName }}</h2>
              <p class="text-slate-500 dark:text-slate-400">Temporada {{ data.season }}</p>
            </div>
          </div>
        </div>

        <!-- Standings Table -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">#</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Equipo</th>
                  <th class="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">PJ</th>
                  <th class="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">G</th>
                  <th class="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">E</th>
                  <th class="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">P</th>
                  <th class="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">GF</th>
                  <th class="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">GC</th>
                  <th class="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">DG</th>
                  <th class="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Pts</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                <tr
                  v-for="row in data.standings"
                  :key="row.team.id"
                  :class="{ 
                    'bg-green-50 dark:bg-green-900/20': row.rank <= 2, 
                    'bg-yellow-50 dark:bg-yellow-900/20': row.rank >= 3 && row.rank <= 6, 
                    'bg-red-50 dark:bg-red-900/20': row.rank >= 19 
                  }"
                  class="hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  @click="goToTeamTransfers(row)"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-lg font-black" :class="{
                      'text-green-600': row.rank <= 2,
                      'text-yellow-600': row.rank >= 3 && row.rank <= 6,
                      'text-red-600': row.rank >= 19
                    }">{{ row.rank }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <img
                        v-if="row.team.logo"
                        :src="row.team.logo"
                        :alt="row.team.name"
                        class="w-8 h-8 mr-3 rounded-lg object-contain"
                      />
                      <div v-else class="w-8 h-8 mr-3 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                        <span class="material-symbols-rounded text-slate-400 text-sm">shield</span>
                      </div>
                      <span class="font-bold text-secondary dark:text-white">{{ row.team.name }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center font-semibold">{{ row.played }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center font-semibold text-green-600">{{ row.win }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center font-semibold text-yellow-600">{{ row.draw }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center font-semibold text-red-600">{{ row.lose }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center font-semibold">{{ row.goalsFor }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center font-semibold">{{ row.goalsAgainst }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center font-bold" :class="{ 
                    'text-green-600': row.goalsDiff > 0, 
                    'text-red-600': row.goalsDiff < 0 
                  }">
                    {{ row.goalsDiff > 0 ? '+' : '' }}{{ row.goalsDiff }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span class="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-black">
                      {{ row.points }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
