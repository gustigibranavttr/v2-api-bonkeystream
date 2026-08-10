import { ref } from 'vue'

export interface Toast { id: number; message: string; action?: { label: string; run: () => void } }
const toasts = ref<Toast[]>([])
let nextId = 1

export function useToast() {
  const show = (message: string, action?: Toast['action']) => {
    const id = nextId++
    toasts.value.push({ id, message, action })
    window.setTimeout(() => dismiss(id), 5000)
  }
  const dismiss = (id: number) => { toasts.value = toasts.value.filter((toast) => toast.id !== id) }
  return { toasts, show, dismiss }
}
