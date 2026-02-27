<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ApiPlayerResponse } from '../services/types'
import { searchPlayersTheSportsDB } from '../services/playersApi'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'select', playerId: number): void
}>()

const query = ref('')
const results = ref<ApiPlayerResponse[]>([])
const searching = ref(false)
const error = ref<string | null>(null)

const MIN_LEN = 2
let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(query, (q) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  const trimmed = q.trim()
  if (trimmed.length < MIN_LEN) {
    results.value = []
    error.value = null
    return
  }
  debounceTimer = setTimeout(() => {
    debounceTimer = null
    doSearch(trimmed)
  }, 350)
})

async function doSearch(q: string) {
  searching.value = true
  error.value = null
  try {
    const res = await searchPlayersTheSportsDB(q)
    results.value = res.response ?? []
    if (results.value.length === 0) {
      error.value = 'No se encontraron jugadores'
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error al buscar'
    results.value = []
  } finally {
    searching.value = false
  }
}

function select(item: ApiPlayerResponse) {
  emit('select', item.player.id)
  close()
}

function close() {
  query.value = ''
  results.value = []
  error.value = null
  emit('update:modelValue', false)
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
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
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    @click.self="close()"
  >
    <div class="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col">
      <div class="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">Añadir jugador</h3>
        <button
          type="button"
          class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          @click="close()"
        >
          <span class="material-symbols-rounded">close</span>
        </button>
      </div>
      <div class="p-4">
        <input
          v-model="query"
          type="text"
          placeholder="Buscar por nombre (mín. 2 caracteres)"
          class="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          autofocus
        />
      </div>
      <div class="flex-1 overflow-y-auto px-4 pb-4">
        <div v-if="searching" class="text-center py-8 text-slate-500">
          <span class="material-symbols-rounded animate-spin text-4xl">sync</span>
          <p class="mt-2">Buscando...</p>
        </div>
        <p v-else-if="error" class="text-red-500 text-sm py-4">{{ error }}</p>
        <ul v-else-if="results.length > 0" class="space-y-2">
          <li
            v-for="item in results"
            :key="item.player.id"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer border border-slate-100 dark:border-slate-800"
            @click="select(item)"
          >
            <img
              v-if="item.player.photo"
              :src="item.player.photo"
              :alt="item.player.name"
              class="w-10 h-10 rounded-full object-cover shrink-0"
            />
            <div
              v-else
              class="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300 shrink-0"
            >
              {{ initials(item.player.name) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-slate-900 dark:text-white truncate">{{ item.player.name }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 truncate">
                {{ item.statistics?.[0]?.team?.name ?? '—' }}
              </p>
            </div>
            <span class="material-symbols-rounded text-primary">add_circle</span>
          </li>
        </ul>
        <p v-else-if="query.trim().length >= MIN_LEN" class="text-slate-500 text-sm py-4">
          Escribe al menos 2 caracteres para buscar
        </p>
      </div>
    </div>
  </div>
</template>
