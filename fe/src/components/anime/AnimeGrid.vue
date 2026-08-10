<script setup lang="ts">
import AnimeCard from './AnimeCard.vue'
import type { AnimeSummary } from '@/models/domain'
defineProps<{ items: AnimeSummary[] }>()
</script>
<template>
  <div class="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:gap-x-5 lg:grid-cols-4 xl:grid-cols-5">
    <AnimeCard v-for="anime in items" :key="anime.slug" :anime="anime" />
  </div>
</template>
