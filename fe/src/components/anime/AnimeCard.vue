<script setup lang="ts">
import { Play, Star } from '@lucide/vue'
import type { RouteLocationRaw } from 'vue-router'
import type { AnimeSummary } from '@/models/domain'
const props = defineProps<{ anime: AnimeSummary; progress?: number; to?: RouteLocationRaw }>()
</script>

<template>
  <RouterLink :to="props.to ?? `/anime/${anime.slug}`" class="group block min-w-0" :aria-label="`View ${anime.title}`">
    <div class="poster-cut relative aspect-[2/3] overflow-hidden bg-surface-raised ring-1 ring-black/10 transition-transform duration-200 group-hover:-translate-y-1">
      <img
        v-if="anime.thumb"
        :src="anime.thumb"
        :alt="anime.title"
        loading="lazy"
        decoding="async"
        class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
      />
      <div v-else class="signal-grid grid h-full place-items-center bg-surface-raised px-5 text-center text-foreground">
        <div>
          <span class="mx-auto mb-3 block h-1 w-10 bg-accent" aria-hidden="true" />
          <span class="line-clamp-4 text-sm font-black leading-snug">{{ anime.title }}</span>
        </div>
      </div>
      <div class="absolute inset-x-0 bottom-0 flex items-end justify-between bg-[#171717]/92 p-2.5 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        <span class="text-xs font-bold uppercase tracking-wider">Open anime</span><Play :size="15" fill="currentColor" aria-hidden="true" />
      </div>
      <div v-if="anime.episode || anime.latestEpisode" class="cut-corner absolute start-2 top-2 bg-accent px-2.5 py-1 text-xs font-black uppercase text-accent-foreground">
        {{ anime.episode || `EP ${anime.latestEpisode}` }}
      </div>
      <div v-if="progress" class="absolute inset-x-0 bottom-0 h-1 bg-black/50">
        <span class="block h-full bg-accent" :style="{ width: `${Math.min(100, progress)}%` }" />
      </div>
    </div>
    <h3 class="mt-2.5 line-clamp-2 text-sm font-extrabold leading-snug text-foreground transition-colors group-hover:text-muted sm:mt-3 sm:text-base">
      {{ anime.title }}
    </h3>
    <div class="mt-1.5 flex min-h-5 items-center gap-2 text-[0.68rem] font-semibold text-muted tabular sm:text-xs">
      <span v-if="anime.rating" class="inline-flex items-center gap-1"><Star
        :size="12"
        fill="currentColor"
        class="text-gold"
        aria-hidden="true"
      />{{ anime.rating }}</span>
      <span v-if="anime.status">{{ anime.status }}</span>
    </div>
  </RouterLink>
</template>
