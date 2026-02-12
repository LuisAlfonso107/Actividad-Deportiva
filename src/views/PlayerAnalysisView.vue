<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApiErrorStore } from '../stores/apiError'
import { getPlayer, searchPlayers, LALIGA2_LEAGUE_ID } from '../services/footballApi'
import { getPlayerFromTheSportsDB } from '../services/thesportsdb'
import type { ApiPlayerResponse, PlayersSearchResponse } from '../services/footballApi'

const route = useRoute()
const router = useRouter()
const apiErrorStore = useApiErrorStore()
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
        data.value = { ...searchRes, response: [first] }
        router.replace({
          name: 'player-analysis',
          params: { id: String(first.player.id) },
          query: { ...route.query, name },
        })
        loading.value = false
        return
      }
      const anyLeague = await searchPlayers(name, { league: 39, season: season.value })
      if (anyLeague.response?.length) {
        const first = anyLeague.response[0]
        data.value = { ...anyLeague, response: [first] }
        router.replace({
          name: 'player-analysis',
          params: { id: String(first.player.id) },
          query: { ...route.query, name },
        })
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
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  if (parts[0]?.length >= 2) return parts[0].slice(0, 2).toUpperCase()
  return parts[0]?.[0]?.toUpperCase() ?? '?'
}
</script>

<template>
  <div class="analysis">
    <button type="button" class="back" @click="goBack">← Back to Home</button>

    <div v-if="loading" class="loading">Loading player data…</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <template v-else-if="p">
      <header class="player-header">
        <img
          v-if="p.photo"
          :src="p.photo"
          :alt="p.name"
          class="photo"
          @error="(e) => (e.currentTarget!.style.display = 'none')"
        />
        <div v-else class="photo photo-placeholder" :aria-label="p.name">{{ initials(p.name) }}</div>
        <div class="info">
          <h1>{{ p.name }}</h1>
          <p v-if="p.display_name && p.display_name !== p.name" class="meta">
            Display name: {{ p.display_name }}
          </p>
          <p v-if="p.common_name && p.common_name !== p.name" class="meta">
            Common name: {{ p.common_name }}
          </p>
        </div>
      </header>

      <!-- Club(s) – e.g. Barcelona, Liverpool (from teams or transfer history) -->
      <section v-if="statsList.length > 0" class="section club-section">
        <h2>Club(s)</h2>
        <p class="club-intro">Current / former clubs:</p>
        <ul class="clubs-list">
          <li v-for="stat in statsList" :key="stat.team.id" class="club-card">
            <img
              v-if="stat.team.logo"
              :src="stat.team.logo"
              :alt="stat.team.name"
              class="club-logo"
              @error="(e) => (e.currentTarget!.style.display = 'none')"
            />
            <span class="club-name">{{ stat.team.name || '—' }}</span>
          </li>
        </ul>
      </section>

      <section class="section">
        <h2>Personal information</h2>
        <dl class="info-grid">
          <dt>First name</dt>
          <dd>{{ show(p.firstname) }}</dd>
          <dt>Last name</dt>
          <dd>{{ show(p.lastname) }}</dd>
          <dt>Age</dt>
          <dd>{{ show(p.age) }}</dd>
          <dt>Date of birth</dt>
          <dd>{{ show(p.birth?.date) }}</dd>
          <dt>Place of birth</dt>
          <dd>{{ show(p.birth?.place) }}</dd>
          <dt>Country of birth</dt>
          <dd>{{ show(p.birth?.country) }}</dd>
          <dt>Nationality</dt>
          <dd>{{ show(p.nationality) }}</dd>
          <dt>Gender</dt>
          <dd>{{ show(p.gender) }}</dd>
        </dl>
      </section>

      <section class="section">
        <h2>Physical</h2>
        <dl class="info-grid">
          <dt>Height</dt>
          <dd>{{ show(p.height) }}</dd>
          <dt>Weight</dt>
          <dd>{{ show(p.weight) }}</dd>
        </dl>
      </section>

      <section v-if="firstStats" class="section">
        <h2>Statistics</h2>
        <div class="stats-grid">
          <div class="stat">
            <span class="label">Position</span>
            <span class="value">{{ show(firstStats.games?.position) }}</span>
          </div>
          <div class="stat">
            <span class="label">Appearances</span>
            <span class="value">{{ firstStats.games?.appearences ?? '—' }}</span>
          </div>
          <div class="stat">
            <span class="label">Minutes</span>
            <span class="value">{{ firstStats.games?.minutes ?? '—' }}</span>
          </div>
          <div class="stat">
            <span class="label">Rating</span>
            <span class="value">{{ show(firstStats.games?.rating) }}</span>
          </div>
          <div v-if="firstStats.goals != null" class="stat">
            <span class="label">Goals</span>
            <span class="value">{{ firstStats.goals.total }}</span>
          </div>
          <div v-if="firstStats.goals?.assists != null" class="stat">
            <span class="label">Assists</span>
            <span class="value">{{ firstStats.goals.assists }}</span>
          </div>
          <div v-if="firstStats.shots != null" class="stat">
            <span class="label">Shots</span>
            <span class="value">{{ firstStats.shots.total }}</span>
          </div>
          <div v-if="firstStats.passes != null" class="stat">
            <span class="label">Passes</span>
            <span class="value">{{ firstStats.passes.total }}</span>
          </div>
          <div v-if="firstStats.tackles != null" class="stat">
            <span class="label">Tackles</span>
            <span class="value">{{ firstStats.tackles.total }}</span>
          </div>
          <div v-if="firstStats.duels != null" class="stat">
            <span class="label">Duels</span>
            <span class="value">{{ firstStats.duels.total }}</span>
          </div>
          <div v-if="firstStats.dribbles != null" class="stat">
            <span class="label">Dribbles</span>
            <span class="value">{{ firstStats.dribbles.attempts }}</span>
          </div>
          <div v-if="firstStats.fouls != null" class="stat">
            <span class="label">Fouls (drawn / committed)</span>
            <span class="value">{{ firstStats.fouls.drawn }} / {{ firstStats.fouls.committed }}</span>
          </div>
          <div v-if="firstStats.cards != null" class="stat">
            <span class="label">Cards (yellow / red)</span>
            <span class="value">{{ firstStats.cards.yellow }} / {{ firstStats.cards.red }}</span>
          </div>
          <div v-if="firstStats.penalty != null" class="stat">
            <span class="label">Penalties (scored / missed)</span>
            <span class="value">{{ firstStats.penalty.scored }} / {{ firstStats.penalty.missed }}</span>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.analysis {
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem;
}
.back {
  background: var(--color-background-mute);
  border: 1px solid var(--color-border);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1.5rem;
  color: var(--color-text);
}
.back:hover {
  background: var(--color-border-hover);
}
.loading,
.error {
  text-align: center;
  padding: 2rem;
}
.error {
  color: #c00;
}
.player-header {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}
.photo {
  width: 140px;
  height: 140px;
  object-fit: contain;
  border-radius: 12px;
  background: var(--color-background-mute);
}
.photo-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 2.5rem;
  color: var(--color-text);
  opacity: 0.9;
}
.info h1 {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}
.meta {
  margin: 0.25rem 0;
  color: var(--color-text);
  opacity: 0.9;
}
.section {
  margin-bottom: 2rem;
}
.section h2 {
  font-size: 1.15rem;
  margin-bottom: 0.75rem;
  color: var(--color-heading);
}
.info-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.35rem 1.5rem;
  margin: 0;
}
.info-grid dt {
  font-weight: 500;
  opacity: 0.9;
}
.info-grid dd {
  margin: 0;
}
.club-section {
  background: var(--color-background-mute);
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid var(--color-border);
}
.club-intro {
  margin: 0 0 0.75rem 0;
  font-size: 0.95rem;
  opacity: 0.9;
}
.clubs-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.club-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--color-background);
  border-radius: 10px;
  border: 1px solid var(--color-border);
  min-width: 160px;
}
.club-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
}
.club-name {
  font-weight: 600;
  font-size: 1.05rem;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
}
.stat {
  background: var(--color-background-mute);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}
.stat .label {
  display: block;
  font-size: 0.85rem;
  opacity: 0.8;
  margin-bottom: 0.25rem;
}
.stat .value {
  font-weight: 600;
  font-size: 1.1rem;
}
</style>
