<script setup lang="ts">
import { useAuthForm } from '../composable/useAuthForm'

const {
  email,
  password,
  errors,
  loading,
  errorMessage,
  handleLogin,
} = useAuthForm()
</script>

<template>
  <div class="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full">
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Iniciar Sesión
          </h1>
          <p class="text-slate-500 dark:text-slate-400 mt-2">
            Accede a tu área personal
          </p>
        </div>
        
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="tu@email.com"
              class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              :class="{ 'border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
          </div>
          
          <div>
            <label for="password" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              :class="{ 'border-red-500': errors.password }"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-500">{{ errors.password }}</p>
          </div>
          
          <div v-if="errorMessage" class="p-4 bg-red-100 dark:bg-red-900/30 border border-red-500 rounded-xl">
            <p class="text-red-700 dark:text-red-400 text-sm font-bold">{{ errorMessage }}</p>
          </div>
          
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-primary hover:bg-emerald-600 disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="material-symbols-rounded animate-spin">sync</span>
            {{ loading ? 'INICIANDO...' : 'INICIAR SESIÓN' }}
          </button>
          
          <div class="text-center space-y-2">
            <p class="text-slate-600 dark:text-slate-400">
              ¿No tienes cuenta?
              <router-link to="/register" class="text-primary font-bold hover:underline">
                Regístrate
              </router-link>
            </p>
            <button
              type="button"
              class="text-sm text-slate-500 hover:text-primary transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
