import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface FavoritePlayer {
  id: number
  name: string
  photo: string
  team?: string
  teamLogo?: string
}

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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(players))
}

export const useFavoritesStore = defineStore('favorites', () => {
  const list = ref<FavoritePlayer[]>(loadFromStorage())

  const favorites = computed(() => list.value)

  function add(player: FavoritePlayer) {
    if (list.value.some((p) => p.id === player.id)) return
    list.value = [...list.value, player]
    saveToStorage(list.value)
  }

  function remove(id: number) {
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

  return { favorites, add, remove, isFavorite, toggle }
})
