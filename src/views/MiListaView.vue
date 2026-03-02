<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useListsStore } from '../stores/lists'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'
import { getPlayerFromTheSportsDB } from '../services/playersApi'
import type { ApiPlayerResponse } from '../services/types'
import ModalBuscarJugador from '../components/ModalBuscarJugador.vue'

const router = useRouter()
const route = useRoute()
const listsStore = useListsStore()
const authStore = useAuthStore()
const toastStore = useToastStore()

const showCreateModal = ref(false)
const showAddPlayerModal = ref(false)
const newListName = ref('')
const showDeleteModal = ref(false)
const listToDelete = ref<number | null>(null)
const showEditNameModal = ref(false)
const listToEdit = ref<{ id: string; name: string } | null>(null)
const editName = ref('')

const listPlayers = ref<ApiPlayerResponse[]>([])
const listPlayersLoading = ref(false)
const listPlayersError = ref<string | null>(null)

const isDetailView = computed(() => route.params.id !== undefined)
const listId = computed(() => String(route.params.id ?? ''))

// Cargar listas o detalle según la ruta actual y cuando cambie (sin necesidad de refrescar la página)
watch(
  () => route.params.id,
  async (id) => {
    if (id != null && id !== '') {
      await listsStore.fetchListById(String(id))
    } else {
      await listsStore.fetchLists()
    }
  },
  { immediate: true },
)

watch(
  () => listsStore.currentList?.players.slice() ?? [],
  async (ids) => {
    listPlayers.value = []
    listPlayersError.value = null
    if (!ids || ids.length === 0) return
    try {
      listPlayersLoading.value = true
      const results = await Promise.all(
        ids.map(async (id) => {
          try {
            const res = await getPlayerFromTheSportsDB(id)
            return res.response?.[0] ?? null
          } catch {
            return null
          }
        }),
      )
      listPlayers.value = results.filter((p): p is ApiPlayerResponse => p != null)
    } catch (e) {
      listPlayersError.value = e instanceof Error ? e.message : 'No se pudieron cargar los jugadores de la lista.'
    } finally {
      listPlayersLoading.value = false
    }
  },
  { immediate: true },
)

async function handleCreateList() {
  if (newListName.value.trim().length < 3) return
  
  const result = await listsStore.createList(newListName.value.trim())
  if (result) {
    showCreateModal.value = false
    newListName.value = ''
  }
}

function openDeleteModal(listId: string) {
  listToDelete.value = listId
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (listToDelete.value !== null) {
    await listsStore.deleteList(listToDelete.value)
    showDeleteModal.value = false
    listToDelete.value = null
  }
}

function openEditNameModal(list: { id: number; name: string }) {
  listToEdit.value = list
  editName.value = list.name
  showEditNameModal.value = true
}

async function confirmEditName() {
  if (listToEdit.value && editName.value.trim().length >= 3) {
    await listsStore.updateListName(listToEdit.value.id, editName.value.trim())
    showEditNameModal.value = false
    listToEdit.value = null
    editName.value = ''
  }
}

function goToListDetail(listId: string) {
  router.push(`/mi-lista/${listId}`)
}

async function onPlayerSelected(playerId: number) {
  const id = listId.value
  if (!id || !listsStore.currentList) return
  const ok = await listsStore.addPlayerToList(id, playerId)
  if (ok) {
    await listsStore.fetchListById(id)
    toastStore.showSuccess('Jugador añadido a la lista')
  } else if (listsStore.error) {
    toastStore.showError(listsStore.error)
  }
}

function analyseFromList(playerId: number) {
  router.push({ name: 'player-analysis', params: { id: String(playerId) } })
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter((p) => p.length > 0)
  if (parts.length >= 2) {
    const a = parts[0]?.[0]
    const b = parts[parts.length - 1]?.[0]
    if (a && b) return (a + b).toUpperCase()
  }
  if (parts[0] && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase()
  if (parts[0]?.[0]) return parts[0][0].toUpperCase()
  return '?'
}
</script>

<template>
  <div class="font-body bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">Mi Lista</h1>
          <p class="text-slate-600 dark:text-slate-400">Gestiona tus listas personalizadas de jugadores</p>
        </div>
        <button
          v-if="!isDetailView"
          @click="showCreateModal = true"
          class="bg-primary hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
        >
          <span class="material-symbols-rounded">add</span>
          Crear nueva lista
        </button>
        <button
          v-else-if="listsStore.currentList"
          @click="showAddPlayerModal = true"
          class="bg-primary hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
        >
          <span class="material-symbols-rounded">person_add</span>
          Añadir jugador
        </button>
      </div>

      <div v-if="listsStore.loading" class="text-center py-16">
        <span class="material-symbols-rounded text-6xl text-slate-300 animate-spin">sync</span>
        <p class="text-slate-500 mt-4">Cargando listas...</p>
      </div>

      <div v-else-if="!isDetailView && listsStore.lists.length === 0" class="text-center py-16">
        <span class="material-symbols-rounded text-6xl text-slate-300">playlist_add</span>
        <h3 class="text-xl font-semibold text-slate-600 mt-4">Aún no tienes listas</h3>
        <p class="text-slate-500 mt-2">¡Crea tu primera lista para organizar tus jugadores!</p>
        <button
          @click="showCreateModal = true"
          class="mt-6 bg-primary hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Crear nueva lista
        </button>
      </div>

      <div v-else-if="!isDetailView" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="list in listsStore.lists"
          :key="list.id"
          class="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-800 group hover:shadow-md transition-shadow cursor-pointer"
          @click="goToListDetail(list.id!)"
        >
          <div class="p-5">
            <div class="flex items-start justify-between mb-3">
              <div class="bg-primary/10 p-2 rounded-lg">
                <span class="material-symbols-rounded text-primary">folder</span>
              </div>
              <div class="flex gap-1" @click.stop>
                <button
                  @click="openEditNameModal({ id: list.id!, name: list.name })"
                  class="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500"
                >
                  <span class="material-symbols-rounded text-lg">edit</span>
                </button>
                <button
                  @click="openDeleteModal(list.id!)"
                  class="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-500"
                >
                  <span class="material-symbols-rounded text-lg">delete</span>
                </button>
              </div>
            </div>
            <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-1">{{ list.name }}</h3>
            <p class="text-slate-500 dark:text-slate-400 text-sm">
              {{ list.players.length }} jugador{{ list.players.length !== 1 ? 'es' : '' }}
            </p>
          </div>
        </div>
      </div>

      <div v-else-if="isDetailView && listsStore.currentList" class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <button @click="router.push('/mi-lista')" class="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-2 flex items-center gap-1">
              <span class="material-symbols-rounded text-lg">arrow_back</span>
              Volver
            </button>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">{{ listsStore.currentList.name }}</h2>
            <p class="text-slate-500 dark:text-slate-400">
              {{ listsStore.currentList.players.length }} jugador{{ listsStore.currentList.players.length !== 1 ? 'es' : '' }}
            </p>
          </div>
          <button
            @click="showAddPlayerModal = true"
            class="bg-primary hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            <span class="material-symbols-rounded">person_add</span>
            Añadir jugador
          </button>
        </div>

        <div v-if="listsStore.currentList.players.length === 0" class="text-center py-12">
          <span class="material-symbols-rounded text-5xl text-slate-300">person_add</span>
          <p class="text-slate-500 mt-4">Esta lista está vacía. Añade jugadores con el botón de arriba.</p>
          <button
            @click="showAddPlayerModal = true"
            class="mt-4 bg-primary hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <span class="material-symbols-rounded">person_add</span>
            Añadir jugador
          </button>
        </div>

        <div v-else class="mt-6">
          <p class="text-sm text-slate-500 mb-4">
            {{ listPlayers.length }} jugador{{ listPlayers.length !== 1 ? 'es' : '' }} en esta lista
          </p>

          <div v-if="listPlayersLoading" class="text-center py-8 text-slate-500">
            <span class="material-symbols-rounded animate-spin text-4xl">sync</span>
            <p class="mt-2">Cargando jugadores de la lista...</p>
          </div>

          <p v-else-if="listPlayersError" class="text-red-500 text-sm py-4">
            {{ listPlayersError }}
          </p>

          <div
            v-else
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div
              v-for="item in listPlayers"
              :key="item.player.id"
              class="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 transform hover:-translate-y-1 cursor-pointer"
              @click="analyseFromList(item.player.id)"
            >
              <div class="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  v-if="item.player.photo"
                  :src="item.player.photo"
                  :alt="item.player.name"
                  class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800"
                >
                  <span class="text-5xl font-black text-slate-400 dark:text-slate-500">
                    {{ initials(item.player.name) }}
                  </span>
                </div>

                <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div class="absolute bottom-0 left-0 right-0 p-4">
                  <h3 class="text-white font-black text-2xl leading-tight mb-1">
                    {{ item.player.name.toUpperCase() }}
                  </h3>
                  <div class="flex items-center gap-2">
                    <span class="text-primary font-bold text-sm">
                      {{ item.statistics?.[0]?.team?.name || 'La Liga 2' }}
                    </span>
                    <span class="text-white/70 text-xs">• En mi lista</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="listsStore.error" class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p class="text-red-600 dark:text-red-400">{{ listsStore.error }}</p>
      </div>
    </main>

    <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showCreateModal = false">
      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-4">Crear nueva lista</h3>
        <input
          v-model="newListName"
          type="text"
          placeholder="Nombre de la lista (mínimo 3 caracteres)"
          class="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          @keyup.enter="handleCreateList"
        />
        <div class="flex gap-3 mt-6">
          <button
            @click="showCreateModal = false"
            class="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="handleCreateList"
            :disabled="newListName.trim().length < 3"
            class="flex-1 bg-primary hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Crear
          </button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showDeleteModal = false">
      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-4">Eliminar lista</h3>
        <p class="text-slate-600 dark:text-slate-400 mb-6">¿Estás seguro de que quieres eliminar esta lista? Esta acción no se puede deshacer.</p>
        <div class="flex gap-3">
          <button
            @click="showDeleteModal = false"
            class="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="confirmDelete"
            class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <div v-if="showEditNameModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showEditNameModal = false">
      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-4">Editar nombre</h3>
        <input
          v-model="editName"
          type="text"
          placeholder="Nuevo nombre (mínimo 3 caracteres)"
          class="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          @keyup.enter="confirmEditName"
        />
        <div class="flex gap-3 mt-6">
          <button
            @click="showEditNameModal = false"
            class="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="confirmEditName"
            :disabled="editName.trim().length < 3"
            class="flex-1 bg-primary hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>

    <ModalBuscarJugador
      :model-value="showAddPlayerModal"
      @update:model-value="showAddPlayerModal = $event"
      @select="onPlayerSelected"
    />
  </div>
</template>
