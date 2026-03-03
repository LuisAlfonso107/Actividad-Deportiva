import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as favoritesApi from '../services/favoritesApi'

export interface FavoritePlayer {
  id: number
  name: string
  photo: string
  team?: string
  teamLogo?: string
  /** Server row id (json-server) for DELETE */
  _rowId?: number
}
// esta funcniones son para guardar y cargar 

const STORAGE_KEY = 'favorite-players'

function loadFromStorage(): FavoritePlayer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as FavoritePlayer[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveToStorage(players: FavoritePlayer[]) {
  const toSave = players.map(({ _rowId, ...p }) => p)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
}

function rowToPlayer(row: { id?: number; playerId: number; name: string; photo: string; team?: string; teamLogo?: string }): FavoritePlayer {
  return {
    id: row.playerId,
    name: row.name,
    photo: row.photo,
    team: row.team,
    teamLogo: row.teamLogo,
    _rowId: row.id,
  }
}

export const useFavoritesStore = defineStore('favorites', () => {
  const list = ref<FavoritePlayer[]>(loadFromStorage())

  const favorites = computed(() => list.value)

  /** Load favorites from server (json-server). Falls back to existing list if server fails. */
  async function fetchFavorites() {
    try {
      const rows = await favoritesApi.getFavorites()
      list.value = rows.map(rowToPlayer)
      saveToStorage(list.value)
    } catch {
      // Keep current list (e.g. from localStorage)
    }
  }

  async function add(player: Omit<FavoritePlayer, '_rowId'>) {
    if (list.value.some((p) => p.id === player.id)) return
    try {
      const row = await favoritesApi.addFavorite(player)
      list.value = [...list.value, rowToPlayer(row)]
      saveToStorage(list.value)
    } catch {
      // Offline/server down: keep local only
      list.value = [...list.value, { ...player }]
      saveToStorage(list.value)
    }
  }

  async function remove(id: number) {
    const item = list.value.find((p) => p.id === id)
    if (item?._rowId != null) {
      try {
        await favoritesApi.removeFavoriteByRowId(item._rowId)
      } catch {
        // continue to remove from list
      }
    }
    list.value = list.value.filter((p) => p.id !== id)
    saveToStorage(list.value)
  }

  function isFavorite(id: number) {
    return list.value.some((p) => p.id === id)
  }

  function toggle(player: FavoritePlayer) {
    if (isFavorite(player.id)) remove(player.id)
    else add(player)
  }

  return { favorites, add, remove, isFavorite, toggle, fetchFavorites }
})
