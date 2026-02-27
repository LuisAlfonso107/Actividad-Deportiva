<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useListsStore } from '../stores/lists'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const listsStore = useListsStore()
const authStore = useAuthStore()

const showCreateModal = ref(false)
const newListName = ref('')
const showDeleteModal = ref(false)
const listToDelete = ref<number | null>(null)
const showEditNameModal = ref(false)
const listToEdit = ref<{ id: number; name: string } | null>(null)
const editName = ref('')

const isDetailView = computed(() => route.params.id !== undefined)
const listId = computed(() => Number(route.params.id))

onMounted(async () => {
  if (isDetailView.value) {
    await listsStore.fetchListById(listId.value)
  } else {
    await listsStore.fetchLists()
  }
})

async function handleCreateList() {
  if (newListName.value.trim().length < 3) return
  
  const result = await listsStore.createList(newListName.value.trim())
  if (result) {
    showCreateModal.value = false
    newListName.value = ''
  }
}

function openDeleteModal(listId: number) {
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

function goToListDetail(listId: number) {
  router.push(`/mi-lista/${listId}`)
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
          @click="showCreateModal = true"
          class="bg-primary hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
        >
          <span class="material-symbols-rounded">add</span>
          Crear nueva lista
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
        </div>

        <div v-if="listsStore.currentList.players.length === 0" class="text-center py-12">
          <span class="material-symbols-rounded text-5xl text-slate-300">person_add</span>
          <p class="text-slate-500 mt-4">Esta lista está vacía. Agrega jugadores desde la vista de jugadores.</p>
          <router-link to="/players" class="inline-block mt-4 bg-primary hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Explorar Jugadores
          </router-link>
        </div>

        <div v-else class="text-sm text-slate-500">
          IDs de jugadores en esta lista: {{ listsStore.currentList.players.join(', ') }}
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
  </div>
</template>
