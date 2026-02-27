import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as listsApi from '../services/listsApi'
import { useAuthStore } from './auth'

export interface PlayerList {
  id?: number
  userId: number
  name: string
  players: number[]
  createdAt: string
}

export const useListsStore = defineStore('lists', () => {
  const lists = ref<PlayerList[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentList = ref<PlayerList | null>(null)

  async function fetchLists() {
    const authStore = useAuthStore()
    if (!authStore.user) return

    loading.value = true
    error.value = null

    try {
      lists.value = await listsApi.getLists(authStore.user.id)
    } catch (e) {
      error.value = 'No se pudieron cargar las listas'
      lists.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchListById(listId: number) {
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

  async function createList(name: string) {
    const authStore = useAuthStore()
    if (!authStore.user) return null

    loading.value = true
    error.value = null

    try {
      const newList = await listsApi.createList({
        userId: authStore.user.id,
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

  async function addPlayerToList(listId: number, playerId: number) {
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

  async function removePlayerFromList(listId: number, playerId: number) {
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

  async function deleteList(listId: number) {
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

  async function updateListName(listId: number, newName: string) {
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
