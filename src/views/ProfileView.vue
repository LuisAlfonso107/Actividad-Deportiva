<script setup lang="ts">
import { computed } from 'vue'
import { useProfileForm } from '../composable/useProfileForm'
import { useFavoritesStore } from '../stores/favorites'

const {
  userData,
  loading,
  saving,
  isEditing,
  successMessage,
  errorMessage,
  editedData,
  startEditing,
  cancelEditing,
  saveChanges,
  handleLogout,
  initials,
} = useProfileForm()

const favoritesStore = useFavoritesStore()
const favorites = computed(() => favoritesStore.favorites)

function removeFavorite(id: number) {
  favoritesStore.remove(id)
}
</script>

<template>
  <div class="font-body bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading" class="flex justify-center py-16">
        <span class="material-symbols-rounded animate-spin text-4xl text-primary">sync</span>
      </div>

      <div v-else-if="!userData" class="text-center py-16">
        <span class="material-symbols-rounded text-6xl text-slate-300">error</span>
        <p class="text-slate-600 dark:text-slate-400 mt-4">Error al cargar los datos</p>
      </div>

      <div v-else class="space-y-8">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-black uppercase tracking-tight">Mi Perfil</h1>
            <button
              v-if="!isEditing"
              @click="startEditing"
              class="bg-primary hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-xl transition-all flex items-center gap-2"
            >
              <span class="material-symbols-rounded">edit</span>
              Editar Perfil
            </button>
          </div>

          <div v-if="successMessage" class="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-xl">
            <p class="text-green-700 dark:text-green-400 text-sm font-bold">{{ successMessage }}</p>
          </div>

          <div v-if="errorMessage" class="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-500 rounded-xl">
            <p class="text-red-700 dark:text-red-400 text-sm font-bold">{{ errorMessage }}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <p v-if="!isEditing" class="text-slate-900 dark:text-white">{{ userData.email }}</p>
                <input
                  v-else
                  v-model="editedData.email"
                  type="email"
                  class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre</label>
                <p v-if="!isEditing" class="text-slate-900 dark:text-white">{{ userData.name || 'No especificado' }}</p>
                <input
                  v-else
                  v-model="editedData.name"
                  type="text"
                  placeholder="Tu nombre"
                  class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Teléfono</label>
                <p v-if="!isEditing" class="text-slate-900 dark:text-white">{{ userData.phone || 'No especificado' }}</p>
                <input
                  v-else
                  v-model="editedData.phone"
                  type="tel"
                  placeholder="Tu teléfono"
                  class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Fecha de Nacimiento</label>
                <p v-if="!isEditing" class="text-slate-900 dark:text-white">{{ userData.birthDate || 'No especificada' }}</p>
                <input
                  v-else
                  v-model="editedData.birthDate"
                  type="date"
                  class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div class="flex flex-col justify-between">
              <div class="text-center p-6 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div class="w-24 h-24 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
                  <span class="text-3xl font-black text-white">{{ userData.name ? initials(userData.name) : 'U' }}</span>
                </div>
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">{{ userData.name || 'Usuario' }}</h2>
                <p class="text-slate-500 dark:text-slate-400">{{ userData.email }}</p>
              </div>

              <div v-if="isEditing" class="flex gap-3 mt-6">
                <button
                  @click="cancelEditing"
                  class="flex-1 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold py-3 px-4 rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  @click="saveChanges"
                  :disabled="saving"
                  class="flex-1 bg-primary hover:bg-emerald-600 disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <span v-if="saving" class="material-symbols-rounded animate-spin">sync</span>
                  {{ saving ? 'Guardando...' : 'Guardar' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-black uppercase tracking-tight mb-6">Jugadores Favoritos</h2>
          
          <div v-if="favorites.length === 0" class="text-center py-8">
            <span class="material-symbols-rounded text-5xl text-slate-300">favorite_border</span>
            <p class="text-slate-500 dark:text-slate-400 mt-4">No tienes jugadores favoritos aún</p>
            <router-link to="/" class="text-primary font-bold hover:underline mt-2 inline-block">
              Explora jugadores
            </router-link>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="player in favorites"
              :key="player.id"
              class="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl"
            >
              <div class="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img v-if="player.photo" :src="player.photo" :alt="player.name" class="w-full h-full object-cover" />
                <span v-else class="text-lg font-bold text-slate-500">{{ initials(player.name) }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-slate-900 dark:text-white truncate">{{ player.name }}</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400">{{ player.team || 'La Liga 2' }}</p>
              </div>
              <button
                @click="removeFavorite(player.id)"
                class="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                title="Quitar de favoritos"
              >
                <span class="material-symbols-rounded">delete</span>
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-black uppercase tracking-tight mb-6">Cuenta</h2>
          
          <button
            @click="handleLogout"
            class="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span class="material-symbols-rounded">logout</span>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </main>
  </div>
</template>