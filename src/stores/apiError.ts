import { defineStore } from 'pinia'
import { ref } from 'vue'

//Guardar el último mensaje de error que ocurrió en cualquier llamada a la API
//Detectar si ese error fue por límite de tasa / cuota excedida (rate limit, quota exceeded, 429 Too Many Requests, etc.)

export const useApiErrorStore = defineStore('apiError', () => {
  const message = ref<string | null>(null)
  const isLimitError = ref(false)

  function setError(err: string | null) {
    message.value = err
    isLimitError.value = Boolean(
      err &&
        (err.includes('429') ||
          err.toLowerCase().includes('too many requests') ||
          err.toLowerCase().includes('limit') ||
          err.toLowerCase().includes('quota'))
    )
  }

  function clearError() {
    message.value = null
    isLimitError.value = false
  }

  return { message, isLimitError, setError, clearError }
})
