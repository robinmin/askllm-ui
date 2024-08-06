// composables/useToast.ts

import { ref, computed } from 'vue'

export interface ToastOptions {
  title: string
  description?: string
  duration?: number
  variant?: 'default' | 'success' | 'warning' | 'destructive'
  action?: {
    label: string
    onClick: () => void
  }
}

interface Toast extends ToastOptions {
  id: number
}

const toasts = ref<Toast[]>([])
let idCounter = 0

export function useToast() {
  const activeToasts = computed(() => toasts.value.slice(-5)) // Show max 5 toasts at a time

  function addToast(options: ToastOptions) {
    const id = ++idCounter
    const toast: Toast = {
      id,
      title: options.title,
      description: options.description,
      duration: options.duration ?? 5000, // Default 5 seconds
      variant: options.variant ?? 'default',
      action: options.action
    }

    toasts.value.push(toast)

    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration)
    }

    return id
  }

  function removeToast(id: number) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  function clearAllToasts() {
    toasts.value = []
  }

  return {
    toasts: activeToasts,
    addToast,
    removeToast,
    clearAllToasts
  }
}

// Create a global instance
const globalToast = useToast()

// Export a Vue plugin
export const ToastPlugin = {
  install(app: any) {
    app.config.globalProperties.$toast = globalToast.addToast
    app.provide('toast', globalToast)
  }
}

// Export the global instance for Composition API usage
export { globalToast as toast }

// Type declaration for the global property
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $toast: (options: ToastOptions) => number
  }
}