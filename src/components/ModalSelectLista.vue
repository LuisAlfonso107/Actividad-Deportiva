<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useListsStore } from '../stores/lists'
import { useToastStore } from '../stores/toast'

const props = defineProps<{
  modelValue: boolean
  playerId: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'added'): void
}>()

const router = useRouter()
const listsStore = useListsStore()
const toastStore = useToastStore()

const addingToListId = ref<number | null>(null)

watch(
  () => props.modelValue,
  (open) => {
    // Solo recargar desde servidor si aún no hay listas en memoria,
    // así respetamos las listas recién creadas en otras vistas.
    if (open && listsStore.lists.length === 0) {
      void listsStore.fetchLists()
    }
  },
)

async function addToList(listId: number) {
  const list = listsStore.lists.find((l) => l.id === listId)
  if (!list) return
  if (list.players.includes(props.playerId)) {
    toastStore.showInfo('Ya está en esta lista')
    return
  }
  addingToListId.value = listId
  listsStore.clearError()
  const ok = await listsStore.addPlayerToList(listId, props.playerId)
  addingToListId.value = null
  if (ok) {
    toastStore.showSuccess('Jugador añadido a la lista')
    emit('added')
    close()
  } else if (listsStore.error) {
    toastStore.showError(listsStore.error)
  }
}

function goToMiLista() {
  close()
  router.push('/mi-lista')
}

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    @click.self="close()"
  >
    <div class="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md">
      <div class="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">Añadir a mi lista</h3>
        <button
          type="button"
          class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          @click="close()"
        >
          <span class="material-symbols-rounded">close</span>
        </button>
      </div>
      <div class="p-4 max-h-[60vh] overflow-y-auto">
        <div v-if="listsStore.loading && listsStore.lists.length === 0" class="text-center py-8 text-slate-500">
          <span class="material-symbols-rounded animate-spin text-4xl">sync</span>
          <p class="mt-2">Cargando listas...</p>
        </div>
        <template v-else-if="listsStore.lists.length === 0">
          <p class="text-slate-600 dark:text-slate-400 text-center py-4">Aún no tienes listas. Crea una ahora.</p>
          <button
            type="button"
            class="w-full bg-primary hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            @click="goToMiLista()"
          >
            Ir a Mi Lista
          </button>
        </template>
        <ul v-else class="space-y-2">
          <li
            v-for="list in listsStore.lists"
            :key="list.id"
            class="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
          >
            <div class="min-w-0 flex-1">
              <p class="font-semibold text-slate-900 dark:text-white truncate">{{ list.name }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                {{ list.players.length }} jugador{{ list.players.length !== 1 ? 'es' : '' }}
              </p>
            </div>
            <button
              type="button"
              :disabled="addingToListId === list.id || (list.players.includes(playerId))"
              class="shrink-0 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-primary hover:bg-emerald-600 text-white text-sm"
              @click="addToList(list.id!)"
            >
              <template v-if="list.players.includes(playerId)">Ya en lista</template>
              <template v-else-if="addingToListId === list.id">Añadiendo...</template>
              <template v-else>Añadir</template>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
