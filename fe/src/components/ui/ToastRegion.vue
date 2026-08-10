<script setup lang="ts">
import { X } from '@lucide/vue'
import { useToast } from '@/composables/useToast'
const { toasts, dismiss } = useToast()
</script>

<template>
  <div class="toast-region pointer-events-none fixed inset-x-4 bottom-4 flex flex-col items-end gap-2" role="region" aria-label="Notifications">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="panel-cut pointer-events-auto flex w-full max-w-md items-center gap-3 bg-[#202020] p-4 text-white shadow-xl shadow-black/20"
      role="status"
    >
      <span class="min-w-0 flex-1 text-sm">{{ toast.message }}</span>
      <button v-if="toast.action" class="text-xs font-bold uppercase text-accent" @click="toast.action.run(); dismiss(toast.id)">
        {{ toast.action.label }}
      </button>
      <button class="text-white/55 hover:text-accent" aria-label="Dismiss notification" @click="dismiss(toast.id)">
        <X :size="17" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>
