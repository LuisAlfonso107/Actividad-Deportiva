import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as listsApi from '../services/listsApi'
import { useAuthStore } from './auth'

export interface PlayerList {
  id?: string
  userId: string
  name: string
  players: number[]
  createdAt: string
}

export const useListsStore = defineStore('lists', () => {
  const lists = ref<PlayerList[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentList = ref<PlayerList | null>(null)

  /**
   * Loads lists for the authenticated user.
   * Falls back to all lists when the user has no associated records.
   */
  async function fetchLists() {
    const authStore = useAuthStore()
    if (!authStore.user) return

    loading.value = true
    error.value = null

    try {
      // First try filtering by current user (json-server stores ids as strings).
      let data = await listsApi.getLists(String(authStore.user.id))
      // Optional fallback: if no user lists are found, load all lists.
      if (!data.length) {
        data = await listsApi.getAllLists()
      }
      lists.value = data
    } catch (e) {
      error.value = 'No se pudieron cargar las listas'
      lists.value = []
    } finally {
      loading.value = false
    }
  }

  /**
   * Loads a single list by id and stores it as the current active list.
   */
  async function fetchListById(listId: string) {
    loading.value = true
    error.value = null

    try {
      currentList.value = await listsApi.getListById(listId)
    } catch (e) {
      error.value = 'No se pudo cargar la lista'
      currentList.value = null
    } finally {
      loading.value = false
    }
  }

  /**
   * Creates a new empty list for the authenticated user.
   * Returns the created list, or null when creation fails.
   */
  async function createList(name: string) {
    const authStore = useAuthStore()
    if (!authStore.user) return null

    loading.value = true
    error.value = null

    try {
      const newList = await listsApi.createList({
        userId: String(authStore.user.id),
        name,
        players: [],
        createdAt: new Date().toISOString(),
      })
      lists.value = [...lists.value, newList]
      return newList
    } catch (e) {
      error.value = 'No se pudo crear la lista'
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Adds a player id to an existing list.
   * Prevents duplicate player entries and returns success status.
   */
  async function addPlayerToList(listId: string, playerId: number) {
    const list = lists.value.find((l) => l.id === listId)
    if (!list) return false

    if (list.players.includes(playerId)) {
      error.value = 'Este jugador ya está en la lista'
      return false
    }

    loading.value = true
    error.value = null

    try {
      const updatedList = await listsApi.updateList(listId, {
        players: [...list.players, playerId],
      })
      const index = lists.value.findIndex((l) => l.id === listId)
      if (index !== -1) {
        lists.value[index] = updatedList
      }
      if (currentList.value?.id === listId) {
        currentList.value = updatedList
      }
      return true
    } catch (e) {
      error.value = 'No se pudo agregar el jugador'
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Removes a player id from an existing list.
   * Returns true when the update is persisted successfully.
   */
  async function removePlayerFromList(listId: string, playerId: number) {
    const list = lists.value.find((l) => l.id === listId)
    if (!list) return false

    loading.value = true
    error.value = null

    try {
      const updatedList = await listsApi.updateList(listId, {
        players: list.players.filter((p) => p !== playerId),
      })
      const index = lists.value.findIndex((l) => l.id === listId)
      if (index !== -1) {
        lists.value[index] = updatedList
      }
      if (currentList.value?.id === listId) {
        currentList.value = updatedList
      }
      return true
    } catch (e) {
      error.value = 'No se pudo eliminar el jugador'
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Deletes a list by id and keeps local store state in sync.
   */
  async function deleteList(listId: string) {
    loading.value = true
    error.value = null

    try {
      await listsApi.deleteList(listId)
      lists.value = lists.value.filter((l) => l.id !== listId)
      if (currentList.value?.id === listId) {
        currentList.value = null
      }
      return true
    } catch (e) {
      error.value = 'No se pudo eliminar la lista'
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Updates the name of an existing list.
   * Also updates the currently selected list when it matches the same id.
   */
  async function updateListName(listId: string, newName: string) {
    const list = lists.value.find((l) => l.id === listId)
    if (!list) return false

    loading.value = true
    error.value = null

    try {
      const updatedList = await listsApi.updateList(listId, { name: newName })
      const index = lists.value.findIndex((l) => l.id === listId)
      if (index !== -1) {
        lists.value[index] = updatedList
      }
      if (currentList.value?.id === listId) {
        currentList.value = updatedList
      }
      return true
    } catch (e) {
      error.value = 'No se pudo actualizar el nombre'
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Resets the current error message in the store.
   */
  function clearError() {
    error.value = null
  }

  return {
    lists,
    loading,
    error,
    currentList,
    fetchLists,
    fetchListById,
    createList,
    addPlayerToList,
    removePlayerFromList,
    deleteList,
    updateListName,
    clearError,
  }
})
