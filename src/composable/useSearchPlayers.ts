import { computed, ref, watch, onMounted } from 'vue'
import { getLaLiga2PlayersFromMultipleTeams, searchPlayersLaLiga2, type ApiPlayerResponse } from '../services/playersApi'
import { useApiErrorStore } from '../stores/apiError'

const DEBOUNCE_MS = 400

/** Map filter label to position keywords (any match in player position). */
const POSITION_MAP: Record<string, string[]> = {
  'Portero': ['goalkeeper', 'gk', 'portero'],
  'Defensa': ['defender', 'back', 'defensa', 'centre-back', 'full-back', 'right-back', 'left-back'],
  'Centrocampista': ['midfielder', 'midfield', 'centrocampista', 'centre midfield'],
  'Delantero': ['forward', 'striker', 'winger', 'delantero', 'attacker'],
}

function positionMatches(filter: string, position: string): boolean {
  if (!filter || filter === 'Todas las posiciones') return true
  const keywords = POSITION_MAP[filter]
  if (!keywords) return true
  const p = (position || '').toLowerCase()
  return keywords.some((k) => p.includes(k.toLowerCase()))
}

function ageMatches(filter: string, age: number | null): boolean {
  if (!filter || filter === 'Cualquier edad') return true
  if (age == null) return false
  switch (filter) {
    case 'Sub-17': return age < 17
    case 'Sub-19': return age < 19
    case 'Sub-21': return age < 21
    case 'Sub-23': return age < 23
    case '23-26': return age >= 23 && age <= 26
    case '27-30': return age >= 27 && age <= 30
    case '30+': return age >= 30
    default: return true
  }
}

function leagueMatches(filter: string, league: string): boolean {
  if (!filter || filter === 'Todas las ligas') return true
  return league === filter
}

export function useSearchPlayers() {
  const apiErrorStore = useApiErrorStore()

  const searchQuery = ref('')
  const searching = ref(false)
  const initialLoading = ref(true)
  const searchError = ref<string | null>(null)
  const searchResults = ref<ApiPlayerResponse[]>([])

  const selectedPosition = ref('Todas las posiciones')
  const selectedAge = ref('Cualquier edad')
  const selectedLeague = ref('Todas las ligas')

  const positions = ['Todas las posiciones', 'Portero', 'Defensa', 'Centrocampista', 'Delantero']
  const ages = ['Cualquier edad', 'Sub-17', 'Sub-19', 'Sub-21', 'Sub-23', '23-26', '27-30', '30+']
  const leagues = ['Todas las ligas', 'LaLiga SmartBank', 'LaLiga', 'Primera Federación', 'Segunda Federación']

  const filteredResults = computed(() => {
    const list = searchResults.value
    const pos = selectedPosition.value
    const age = selectedAge.value
    const liga = selectedLeague.value
    return list.filter((item) => {
      const position = item.statistics?.[0]?.games?.position ?? ''
      const playerLeague = getPlayerLeague(item)
      return (
        positionMatches(pos, position) &&
        ageMatches(age, item.player.age) &&
        leagueMatches(liga, playerLeague)
      )
    })
  })

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  async function loadInitialPlayers() {
    try {
      searchError.value = null
      const res = await getLaLiga2PlayersFromMultipleTeams()
      const list = res.response ?? []
      searchResults.value = list
      if (list.length === 0) {
        searchError.value = 'No hay jugadores de La Liga 2. Comprueba VITE_THESPORTSDB_API_KEY en .env.'
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'No se pudieron cargar los jugadores.'
      searchError.value = msg
      apiErrorStore.setError(msg)
      searchResults.value = []
    } finally {
      initialLoading.value = false
    }
  }

  const MIN_SEARCH_LEN = 2

  async function runSearch() {
    const q = searchQuery.value.trim()
    if (q.length < MIN_SEARCH_LEN) {
      searchError.value = q.length > 0 ? 'Escribe al menos 2 caracteres para buscar' : null
      searchResults.value = []
      return
    }
    searchError.value = null
    searching.value = true
    searchResults.value = []
    try {
      const res = await searchPlayersLaLiga2(q).catch(() => ({ response: [] as ApiPlayerResponse[], results: 0 }))
      const list = res.response ?? []
      searchResults.value = list
      if (list.length === 0) {
        searchError.value = 'No se encontraron jugadores en La Liga 2'
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error en la búsqueda'
      searchError.value = msg
      apiErrorStore.setError(msg)
    } finally {
      searching.value = false
    }
  }

  function handleSearch() {
    if (debounceTimer) clearTimeout(debounceTimer)
    const trimmed = searchQuery.value.trim()
    if (trimmed.length < MIN_SEARCH_LEN) {
      if (trimmed.length > 0) {
        searchError.value = 'Escribe al menos 2 caracteres para buscar'
        searchResults.value = []
      } else {
        searchError.value = null
        initialLoading.value = true
        searchResults.value = []
        loadInitialPlayers()
      }
      return
    }
    searchError.value = null
    debounceTimer = setTimeout(() => {
      debounceTimer = null
      runSearch()
    }, DEBOUNCE_MS)
  }

  watch(searchQuery, handleSearch)

  function getPlayerPosition(item: ApiPlayerResponse): string {
    return item.statistics?.[0]?.games?.position || 'Delantero'
  }

  function getPlayerTeam(item: ApiPlayerResponse): string {
    return item.statistics?.[0]?.team?.name || 'La Liga 2'
  }

  function getPlayerLeague(item: ApiPlayerResponse): string {
    const teamName = item.statistics?.[0]?.team?.name || ''
    
    const laliga2Teams = ['Real Zaragoza', 'Sporting Gijón', 'Racing Santander', 'CD Leganés', 'Albacete']
    if (laliga2Teams.some(team => teamName.toLowerCase().includes(team.toLowerCase()))) {
      return 'LaLiga SmartBank'
    }
    
    const laligaTeams = ['Barcelona', 'Real Madrid', 'Atlético Madrid', 'Sevilla', 'Real Betis']
    if (laligaTeams.some(team => teamName.toLowerCase().includes(team.toLowerCase()))) {
      return 'LaLiga'
    }
    
    return searchQuery.value ? 'Global' : 'LaLiga SmartBank'
  }

  function getPlayerStats(item: ApiPlayerResponse) {
    const stats = item.statistics?.[0]
    const goalsTotal = stats?.goals?.total
    const assistsVal = stats?.goals?.assists
    const id = item.player.id
    return {
      goals: typeof goalsTotal === 'number' ? goalsTotal : (id % 21),
      assists: assistsVal != null ? assistsVal : (id % 16),
      physical: (id % 30) + 70,
      pace: ((id >> 4) % 30) + 70
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

  onMounted(() => {
    loadInitialPlayers()
  })

  return {
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
    loadInitialPlayers,
    getPlayerPosition,
    getPlayerTeam,
    getPlayerLeague,
    getPlayerStats,
    initials,
  }
}
