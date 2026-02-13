<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApiErrorStore } from '../stores/apiError'
import { getLaLigaStandings } from '../services/thesportsdb'
import type { StandingsResponse, StandingRow } from '../services/footballApi'

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
  <main class="standings-page">
    <h1>Clasificación La Liga 2</h1>
    <p class="subtitle">{{ data?.leagueName ?? 'Segunda División' }} – Temporada {{ data?.season ?? new Date().getFullYear() }}</p>

    <div v-if="loading" class="loading">Cargando clasificación…</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <template v-else-if="data">
      <div class="league-header">
        <img
          v-if="data.leagueLogo"
          :src="data.leagueLogo"
          :alt="data.leagueName"
          class="league-logo"
        />
        <h2>{{ data.leagueName }}</h2>
      </div>

      <div class="table-wrap">
        <table class="standings-table">
          <thead>
            <tr>
              <th class="col-pos">#</th>
              <th class="col-team">Equipo</th>
              <th class="col-num">PJ</th>
              <th class="col-num">G</th>
              <th class="col-num">E</th>
              <th class="col-num">P</th>
              <th class="col-num">GF</th>
              <th class="col-num">GC</th>
              <th class="col-num">DG</th>
              <th class="col-pts">Pts</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in data.standings"
              :key="row.team.id"
              :class="{ 'promotion': row.rank <= 2, 'playoff': row.rank >= 3 && row.rank <= 6, 'relegation': row.rank >= 19 }"
              @click="goToTeamTransfers(row)"
            >
              <td class="col-pos">{{ row.rank }}</td>
              <td class="col-team clickable">
                <img
                  v-if="row.team.logo"
                  :src="row.team.logo"
                  :alt="row.team.name"
                  class="team-logo"
                />
                <span>{{ row.team.name }}</span>
              </td>
              <td class="col-num">{{ row.played }}</td>
              <td class="col-num">{{ row.win }}</td>
              <td class="col-num">{{ row.draw }}</td>
              <td class="col-num">{{ row.lose }}</td>
              <td class="col-num">{{ row.goalsFor }}</td>
              <td class="col-num">{{ row.goalsAgainst }}</td>
              <td class="col-num" :class="{ positive: row.goalsDiff > 0, negative: row.goalsDiff < 0 }">
                {{ row.goalsDiff > 0 ? '+' : '' }}{{ row.goalsDiff }}
              </td>
              <td class="col-pts"><strong>{{ row.points }}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="legend">
        <span class="legend-item promotion">Promoción directa</span>
        <span class="legend-item playoff">Play-off</span>
        <span class="legend-item relegation">Descenso</span>
      </div>
    </template>
  </main>
</template>

<style scoped>
.standings-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem;
}
h1 {
  font-size: 1.75rem;
  margin-bottom: 0.25rem;
}
.subtitle {
  color: var(--color-text);
  opacity: 0.85;
  margin-bottom: 1.5rem;
}
.loading,
.error {
  text-align: center;
  padding: 2rem;
}
.error {
  color: #c00;
}
.league-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.league-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
.league-header h2 {
  font-size: 1.2rem;
  margin: 0;
}
.table-wrap {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  background: var(--color-background-soft);
}
.standings-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}
.standings-table th,
.standings-table td {
  padding: 0.6rem 0.5rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}
.standings-table th {
  font-weight: 600;
  background: var(--color-background-mute);
  color: var(--color-heading);
}
.standings-table tbody tr:last-child td {
  border-bottom: 0;
}
.standings-table tbody tr {
  cursor: pointer;
}
.standings-table tbody tr:hover {
  background: var(--color-background-mute);
}
.col-team.clickable {
  cursor: pointer;
}
.col-pos {
  width: 2.5rem;
  text-align: center;
}
.col-team {
  min-width: 180px;
}
.col-team .team-logo {
  width: 24px;
  height: 24px;
  object-fit: contain;
  vertical-align: middle;
  margin-right: 0.5rem;
}
.col-num {
  width: 2.5rem;
  text-align: center;
}
.col-num.positive {
  color: #0a7;
}
.col-num.negative {
  color: #c00;
}
.col-pts {
  width: 3rem;
  text-align: center;
  font-weight: 600;
}
tr.promotion {
  background: rgba(0, 160, 100, 0.08);
}
tr.playoff {
  background: rgba(255, 180, 0, 0.08);
}
tr.relegation {
  background: rgba(200, 50, 50, 0.08);
}
.legend {
  margin-top: 1rem;
  font-size: 0.85rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}
.legend-item.promotion::before {
  content: '';
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: rgba(0, 160, 100, 0.35);
}
.legend-item.playoff::before {
  content: '';
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: rgba(255, 180, 0, 0.35);
}
.legend-item.relegation::before {
  content: '';
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: rgba(200, 50, 50, 0.35);
}
</style>
