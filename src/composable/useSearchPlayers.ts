import { ref, watch, onMounted } from 'vue'
import { getInitialPlayers, searchPlayers } from '../services/footballApi'
import { getLaLiga2PlayersWithPhotos, searchPlayersTheSportsDB } from '../services/thesportsdb'
import { useApiErrorStore } from '../stores/apiError'
import type { ApiPlayerResponse } from '../services/footballApi'

const DEBOUNCE_MS = 400

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
  const leagues = ['Todas las ligas', 'LaLiga', 'LaLiga SmartBank', 'Primera Federación', 'Segunda Federación']

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  async function loadInitialPlayers() {
    try {
      console.log('Loading initial players...')
      const allPlayers: ApiPlayerResponse[] = []
      
      const commonSearches = ['Juan', 'Carlos', 'Jose', 'Miguel', 'Antonio', 'Francisco', 'David', 'Javier', 'Daniel', 'Alejandro']
      const leagueIds = [140, 39, 135, 136]
      
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
      
      if (allPlayers.length < 100) {
        console.log('Searching for more players...')
        const searchPromises: Promise<{ response: ApiPlayerResponse[] }>[] = []
        
        for (const search of commonSearches.slice(0, 8)) {
          for (const league of leagueIds.slice(0, 2)) {
            searchPromises.push(
              searchPlayers(search, { league, season: 2024 }).catch(() => ({ response: [] as ApiPlayerResponse[] }))
            )
          }
        }
        
        const searchRes = await Promise.all(searchPromises)
        const mergedResults = searchRes.flatMap(res => res.response ?? [])
        console.log('Search results before dedup:', mergedResults.length)
        
        const uniquePlayers = mergedResults.filter((player, index, self) => 
          index === self.findIndex(p => p.player.id === player.player.id)
        )
        console.log('Unique search results:', uniquePlayers.length)
        
        allPlayers.push(...uniquePlayers)
      }
      
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
  }

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

  function handleSearch() {
    if (debounceTimer) clearTimeout(debounceTimer)
    const trimmed = searchQuery.value.trim()
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

  function getPlayerStats() {
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

  onMounted(() => {
    loadInitialPlayers()
  })

  return {
    searchQuery,
    searching,
    initialLoading,
    searchError,
    searchResults,
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
