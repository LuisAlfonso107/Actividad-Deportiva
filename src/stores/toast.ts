import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

export const useToastStore = defineStore('toast', () => {
  const message = ref('')
  const type = ref<ToastType>('success')
  const visible = ref(false)
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  function show(msg: string, toastType: ToastType = 'success', duration = 3000) {
    if (timeoutId) clearTimeout(timeoutId)
    message.value = msg
    type.value = toastType
    visible.value = true
    timeoutId = setTimeout(() => {
      visible.value = false
      timeoutId = null
    }, duration)
  }

  function showSuccess(msg: string, duration = 3000) {
    show(msg, 'success', duration)
  }

  function showError(msg: string, duration = 5000) {
    show(msg, 'error', duration)
  }

  function showInfo(msg: string, duration = 4000) {
    show(msg, 'info', duration)
  }

  function hide() {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = null
    visible.value = false
  }

  return { message, type, visible, show, showSuccess, showError, showInfo, hide }
})
