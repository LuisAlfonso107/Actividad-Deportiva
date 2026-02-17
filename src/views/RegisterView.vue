<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errors = ref<Record<string, string>>({})
const successMessage = ref('')
const errorMessage = ref('')

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validatePassword(password: string): boolean {
  return password.length >= 6
}

function validateForm(): boolean {
  errors.value = {}
  
  if (!email.value.trim()) {
    errors.value.email = 'El email es obligatorio'
  } else if (!validateEmail(email.value)) {
    errors.value.email = 'Introduce un email válido'
  }
  
  if (!password.value) {
    errors.value.password = 'La contraseña es obligatoria'
  } else if (!validatePassword(password.value)) {
    errors.value.password = 'La contraseña debe tener al menos 6 caracteres'
  }
  
  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Debes confirmar la contraseña'
  } else if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Las contraseñas no coinciden'
  }
  
  return Object.keys(errors.value).length === 0
}

async function handleRegister() {
  errorMessage.value = ''
  successMessage.value = ''
  
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  
  try {
    const response = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    })
    
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || 'Error al crear la cuenta')
    }
    
    successMessage.value = 'Cuenta creada correctamente'
    
    setTimeout(() => {
      router.push('/login')
    }, 1500)
    
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('email')) {
        errorMessage.value = 'Este email ya está en uso'
      } else {
        errorMessage.value = error.message
      }
    } else {
      errorMessage.value = 'Error al crear la cuenta. Inténtalo de nuevo.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full">
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Crear Cuenta
          </h1>
          <p class="text-slate-500 dark:text-slate-400 mt-2">
            Regístrate para acceder a la aplicación
          </p>
        </div>
        
        <form @submit.prevent="handleRegister" class="space-y-6">
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
          
          <div>
            <label for="confirmPassword" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              :class="{ 'border-red-500': errors.confirmPassword }"
            />
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-500">{{ errors.confirmPassword }}</p>
          </div>
          
          <div v-if="successMessage" class="p-4 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-xl">
            <p class="text-green-700 dark:text-green-400 text-sm font-bold">{{ successMessage }}</p>
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
            {{ loading ? 'CREANDO CUENTA...' : 'CREAR CUENTA' }}
          </button>
          
          <div class="text-center">
            <p class="text-slate-600 dark:text-slate-400">
              ¿Ya tienes cuenta?
              <router-link to="/login" class="text-primary font-bold hover:underline">
                Iniciar sesión
              </router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
