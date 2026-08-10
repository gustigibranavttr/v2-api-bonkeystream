<script setup lang="ts">
import { ArrowLeft, ArrowRight } from '@lucide/vue'
import { ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import AnimeCard from './AnimeCard.vue'
import type { AnimeSummary } from '@/models/domain'

defineProps<{ title: string; items: AnimeSummary[]; links?: Record<string, RouteLocationRaw> }>()
const rail = ref<HTMLElement>()
const move = (direction: number) => rail.value?.scrollBy({ left: direction * rail.value.clientWidth * 0.82, behavior: 'smooth' })
</script>

<template>
  <section class="page-section relative overflow-hidden">
    <div class="page-shell">
      <div class="mb-7 flex items-end justify-between gap-4">
        <div class="flex items-center gap-3">
          <span class="h-8 w-2 bg-accent" aria-hidden="true" />
          <h2 class="section-title">{{ title }}</h2>
        </div>
        <div class="hidden gap-2 sm:flex">
          <button class="grid size-10 place-items-center rounded-full bg-[#202020] text-white hover:bg-accent hover:text-[#171717]" :aria-label="`Scroll ${title} left`" @click="move(-1)">
            <ArrowLeft :size="18" aria-hidden="true" />
          </button>
          <button class="grid size-10 place-items-center rounded-full bg-[#202020] text-white hover:bg-accent hover:text-[#171717]" :aria-label="`Scroll ${title} right`" @click="move(1)">
            <ArrowRight :size="18" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div ref="rail" class="scrollbar-thin grid auto-cols-[45%] grid-flow-col gap-3 overflow-x-auto overscroll-x-contain pb-4 snap-x snap-mandatory sm:auto-cols-[29%] md:auto-cols-[23%] lg:auto-cols-[19%] xl:auto-cols-[16.5%]">
        <AnimeCard
          v-for="anime in items"
          :key="anime.slug"
          :anime="anime"
          :to="links?.[anime.slug]"
          class="snap-start"
        />
      </div>
    </div>
  </section>
</template>
