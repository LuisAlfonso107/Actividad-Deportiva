import { ref } from 'vue'

export function useUiFeedback() {
  const successMessage = ref('')
  const errorMessage = ref('')
  const infoMessage = ref('')

  function showSuccess(message: string, duration = 3000) {
    successMessage.value = message
    if (duration > 0) {
      setTimeout(() => {
        successMessage.value = ''
      }, duration)
    }
  }

  function showError(message: string, duration = 5000) {
    errorMessage.value = message
    if (duration > 0) {
      setTimeout(() => {
        errorMessage.value = ''
      }, duration)
    }
  }

  function showInfo(message: string, duration = 4000) {
    infoMessage.value = message
    if (duration > 0) {
      setTimeout(() => {
        infoMessage.value = ''
      }, duration)
    }
  }

  function clearMessages() {
    successMessage.value = ''
    errorMessage.value = ''
    infoMessage.value = ''
  }

  return {
    successMessage,
    errorMessage,
    infoMessage,
    showSuccess,
    showError,
    showInfo,
    clearMessages,
  }
}
