import { ref } from 'vue'

const toasts = ref([])
let nextToastId = 1

export function useToast() {
  function dismiss(id) {
    toasts.value = toasts.value.filter((item) => item.id !== id)
  }

  function show({ title = '', message, type = 'info', duration = 4000 }) {
    const id = nextToastId++
    toasts.value.push({ id, title, message, type })

    if (duration > 0) {
      setTimeout(() => dismiss(id), duration)
    }

    return id
  }

  return {
    toasts,
    dismiss,
    show,
    success: (message, title = 'Berhasil') => show({ title, message, type: 'success' }),
    error: (message, title = 'Gagal') => show({ title, message, type: 'error', duration: 5000 }),
    warning: (message, title = 'Perhatian') => show({ title, message, type: 'warning' }),
    info: (message, title = 'Informasi') => show({ title, message, type: 'info' }),
  }
}

