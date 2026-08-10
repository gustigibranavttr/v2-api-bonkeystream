<script setup lang="ts">
import { Heart } from '@lucide/vue'
import { computed } from 'vue'
import { useFavorites } from '@/composables/useLibrary'
import type { AnimeSummary } from '@/models/domain'

const props = defineProps<{ anime: AnimeSummary }>()
const { has, toggle } = useFavorites()
const saved = computed(() => has(props.anime.slug))
function act() { toggle(props.anime) }
</script>

<template>
  <button class="line-button" :class="saved ? 'bg-foreground text-background' : ''" :aria-pressed="saved" @click="act">
    <Heart :size="17" :fill="saved ? 'currentColor' : 'none'" aria-hidden="true" />{{ saved ? 'Saved' : 'Favorite' }}
  </button>
</template>
