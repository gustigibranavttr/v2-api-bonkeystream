<script setup lang="ts">
import { ArrowLeft, ArrowRight } from '@lucide/vue'
import { computed } from 'vue'

const props = defineProps<{
  current: number
  total?: number
  hasPrevious: boolean
  hasNext: boolean
}>()

const emit = defineEmits<{ change: [page: number] }>()

const pages = computed<number[]>(() => {
  const total = props.total
  if (!total || total < 1) return [props.current]
  if (total <= 5) return Array.from({ length: total }, (_, index) => index + 1)

  const start = Math.max(1, Math.min(props.current - 2, total - 4))
  return Array.from({ length: 5 }, (_, index) => start + index)
})
</script>

<template>
  <nav class="mechanical-bar mx-auto flex h-11 w-fit max-w-full items-center gap-0.5 p-1" aria-label="Pagination">
    <button
      class="grid size-9 shrink-0 place-items-center rounded-full bg-white text-[#1b1b1b] transition-colors hover:bg-accent disabled:bg-white/35"
      :disabled="!hasPrevious"
      aria-label="Previous page"
      @click="emit('change', current - 1)"
    >
      <ArrowLeft :size="18" :stroke-width="3" aria-hidden="true" />
    </button>
    <button
      v-for="page in pages"
      :key="page"
      class="grid h-8 min-w-11 place-items-center px-3 text-xs font-bold tabular transition-colors"
      :class="page === current ? 'cut-corner bg-white text-[#1b1b1b]' : 'text-white/80 hover:text-accent'"
      :aria-current="page === current ? 'page' : undefined"
      :aria-label="`Page ${page}`"
      @click="emit('change', page)"
    >
      {{ page }}
    </button>
    <button
      class="grid size-9 shrink-0 place-items-center rounded-full bg-white text-[#1b1b1b] transition-colors hover:bg-accent disabled:bg-white/35"
      :disabled="!hasNext"
      aria-label="Next page"
      @click="emit('change', current + 1)"
    >
      <ArrowRight :size="18" :stroke-width="3" aria-hidden="true" />
    </button>
  </nav>
</template>
