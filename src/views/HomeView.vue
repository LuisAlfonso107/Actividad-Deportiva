<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { ApiPlayerResponse } from '../services/footballApi'
import { getInitialPlayers, searchPlayers } from '../services/footballApi'
import { getLaLiga2PlayersWithPhotos, searchPlayersTheSportsDB } from '../services/thesportsdb'
import { useApiErrorStore } from '../stores/apiError'
import { useFavoritesStore } from '../stores/favorites'

const router = useRouter()
const favoritesStore = useFavoritesStore()
const apiErrorStore = useApiErrorStore()

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
    let res
    try {
      res = await getLaLiga2PlayersWithPhotos()
    } catch {
      res = await getInitialPlayers()
    }
    searchResults.value = res.response ?? []
    if (searchResults.value.length === 0 && !searchQuery.value.trim()) {
      searchError.value = 'Add VITE_FOOTBALL_API_KEY to .env and restart the dev server.'
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to load players'
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
</script>

<template>
  <main class="home">
    <h1>Favorite Football Players - La Liga 2</h1>
    <p class="subtitle">Search La Liga 2 players and analyse your favorites with live API data.</p>

    <section class="search-section">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Start typing a player name (min 4 characters)"
          autocomplete="off"
          @keydown.enter="runSearch"
        />
        <button type="button" class="btn primary" :disabled="searching" @click="runSearch">
          {{ searching ? 'Searching…' : 'Search' }}
        </button>
      </div>
      <p v-if="searchError" class="error">{{ searchError }}</p>

      <div v-if="showResultsList && (searchResults.length > 0 || searching || initialLoading)" class="results">
        <h2 v-if="searchResults.length > 0 || searching || initialLoading" class="results-title">
          {{ initialLoading ? 'Loading players…' : searching ? 'Searching…' : 'Players' }}
        </h2>
        <ul v-if="(searching || initialLoading) && searchResults.length === 0" class="player-list loading-list">
          <li class="loading-item">Loading players…</li>
        </ul>
        <ul v-else-if="searchResults.length > 0" class="player-list">
          <li v-for="item in searchResults" :key="item.player.id" class="player-card">
            <img v-if="item.player.photo" :src="item.player.photo" :alt="item.player.name" class="thumb" />
            <div v-else class="thumb thumb-placeholder" :aria-label="item.player.name">{{ initials(item.player.name) }}</div>
            <div class="details">
              <strong>{{ item.player.name }}</strong>
              <span v-if="item.statistics?.[0]?.team" class="team">
                {{ item.statistics[0].team.name }}
              </span>
            </div>
            <div class="actions">
              <button type="button" class="btn primary" @click="analysePlayer(item.player.id)">
                Analyse this player
              </button>
              <button
                v-if="!isFavorite(item.player.id)"
                type="button"
                class="btn secondary"
                @click="addToFavorites(item)"
              >
                Add to favorites
              </button>
              <button
                v-else
                type="button"
                class="btn secondary"
                @click="removeFavorite(item.player.id)"
              >
                Remove from favorites
              </button>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <section v-if="hasFavorites" class="favorites-section">
      <h2>Your favorite players</h2>
      <ul class="favorites-list">
        <li v-for="p in favorites" :key="p.id" class="favorite-card">
          <img v-if="p.photo" :src="p.photo" :alt="p.name" class="thumb" />
          <div v-else class="thumb thumb-placeholder" :aria-label="p.name">{{ initials(p.name) }}</div>
          <div class="details">
            <strong>{{ p.name }}</strong>
            <span v-if="p.team" class="team">{{ p.team }}</span>
          </div>
          <button type="button" class="btn primary" @click="analyseFavorite(p.id)">
            Analyse this player
          </button>
          <button type="button" class="btn secondary" @click="removeFavorite(p.id)">
            Remove
          </button>
        </li>
      </ul>
    </section>

    <p v-else class="empty-favorites">Add players from search to see them here.</p>
  </main>
</template>

<style scoped>
.home {
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem;
}
h1 {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}
.subtitle {
  color: var(--color-text);
  opacity: 0.85;
  margin-bottom: 1.5rem;
}
.search-section {
  margin-bottom: 2rem;
}
.search-box {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}
.search-box input {
  flex: 1;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
}
.search-box input:focus {
  outline: none;
  border-color: hsla(160, 100%, 37%, 0.6);
}
.error {
  color: #c00;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}
.btn {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  font-size: 0.95rem;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn.primary {
  background: hsla(160, 100%, 37%, 1);
  color: #fff;
}
.btn.primary:hover:not(:disabled) {
  background: hsla(160, 100%, 32%, 1);
}
.btn.secondary {
  background: var(--color-background-mute);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
.btn.secondary:hover {
  background: var(--color-border-hover);
}
.results-title,
.favorites-section h2 {
  font-size: 1.2rem;
  margin: 1rem 0 0.75rem;
}
.player-list,
.favorites-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.loading-list {
  margin-top: 0.5rem;
}
.loading-item {
  padding: 1rem;
  text-align: center;
  color: var(--color-text);
  opacity: 0.8;
}
.player-card,
.favorite-card {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  margin-bottom: 0.75rem;
  background: var(--color-background-soft);
}
.thumb {
  width: 56px;
  height: 56px;
  object-fit: contain;
  border-radius: 8px;
  background: var(--color-background-mute);
}
.thumb-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--color-text);
  opacity: 0.9;
  flex-shrink: 0;
}
.details {
  flex: 1;
  min-width: 120px;
}
.details strong {
  display: block;
}
.team {
  font-size: 0.9rem;
  opacity: 0.85;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.empty-favorites {
  opacity: 0.7;
  font-size: 0.95rem;
}
</style>
