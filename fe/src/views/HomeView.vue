<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AnimeRail from '@/components/anime/AnimeRail.vue'
import FeaturedCarousel from '@/components/home/FeaturedCarousel.vue'
import ResourceState from '@/components/ui/ResourceState.vue'
import { useHistory } from '@/composables/useLibrary'
import { endpoints } from '@/lib/api'
import { normalizePaginated, normalizeSummaryList } from '@/lib/normalizers'
import { getAnimeSeason } from '@/lib/season'
import type { AnimeSummary } from '@/models/domain'

const latest = ref<AnimeSummary[]>([])
const popular = ref<AnimeSummary[]>([])
const ongoing = ref<AnimeSummary[]>([])
const seasonTop = ref<AnimeSummary[]>([])
const loading = ref(true)
const failures = ref<Record<string, string>>({})
const { history } = useHistory()
const currentSeason = getAnimeSeason()
const heroItems = computed(() => {
  if (seasonTop.value.length) return seasonTop.value.slice(0, 7)
  const seen = new Set<string>()
  return [...latest.value, ...popular.value, ...ongoing.value].filter((item) => {
    if (!item.thumb || seen.has(item.slug)) return false
    seen.add(item.slug)
    return true
  }).slice(0, 7)
})
const heroLabel = computed(() => seasonTop.value.length ? 'Top rated' : 'Featured')
const heroContext = computed(() => seasonTop.value.length ? currentSeason.label : 'Latest picks')
const enrichedOngoing = computed(() => {
  const artwork = new Map([...seasonTop.value, ...latest.value, ...popular.value].map((item) => [item.slug, item]))
  return ongoing.value.map((item) => ({ ...artwork.get(item.slug), ...item }))
})
const continueItems = computed(() => history.value.filter((item) => !item.completed).slice(0, 12))
const continueLinks = computed(() => Object.fromEntries(continueItems.value.map((item) => [item.slug, {
  path: `/watch/${item.slug}`,
  query: { episode: item.episodeIndex, resume: '1' },
}])))
const failureCount = computed(() => Object.keys(failures.value).length)
const allFailed = computed(() => failureCount.value === 3)
const noDiscoveryItems = computed(() => !latest.value.length && !popular.value.length && !ongoing.value.length && !seasonTop.value.length)

async function load() {
  loading.value = true
  failures.value = {}
  const tasks = [
    ['latest', endpoints.home, latest],
    ['popular', endpoints.popular, popular],
    ['ongoing', endpoints.ongoing, ongoing],
  ] as const
  await Promise.all([
    ...tasks.map(async ([key, request, target]) => {
      try { target.value = normalizeSummaryList(await request()) }
      catch (error) { failures.value[key] = error instanceof Error ? error.message : 'Request failed.' }
    }),
    (async () => {
      try {
        const season = normalizePaginated(await endpoints.catalog('season', currentSeason.slug, 1))
        seasonTop.value = [...season.results].sort((left, right) => Number(right.rating) - Number(left.rating))
      } catch {
        seasonTop.value = []
      }
    })(),
  ])
  loading.value = false
}
onMounted(load)
</script>

<template>
  <div>
    <section v-if="loading" class="page-shell py-8 sm:py-12">
      <div class="skeleton panel-cut min-h-[34rem]" />
    </section>
    <FeaturedCarousel v-else-if="heroItems.length" :items="heroItems" :label="heroLabel" :context="heroContext" />

    <AnimeRail v-if="continueItems.length" title="Continue watching" :links="continueLinks" :items="continueItems.map(item => ({ title: item.title, slug: item.slug, thumb: item.thumb, episode: item.episodeTitle }))" />
    <div v-if="continueItems.length" class="film-strip" aria-hidden="true" />
    <AnimeRail v-if="latest.length" title="Latest releases" :items="latest" />
    <div v-else-if="failures.latest && !allFailed" class="page-shell py-5">
      <ResourceState
        kind="error"
        title="Latest updates are offline"
        :message="failures.latest"
        action-label="Retry"
        @action="load"
      />
    </div>
    <div v-if="popular.length >= 4" class="theme-dark diagonal-stripes border-y-8 border-accent">
      <AnimeRail title="Popular in the archive" :items="popular" />
    </div>
    <div v-else-if="failures.popular && !allFailed" class="page-shell py-5">
      <ResourceState
        kind="error"
        title="Popular titles are offline"
        :message="failures.popular"
        action-label="Retry"
        @action="load"
      />
    </div>
    <AnimeRail v-if="enrichedOngoing.length" title="Currently broadcasting" :items="enrichedOngoing" />
    <div v-else-if="failures.ongoing && !allFailed" class="page-shell py-5">
      <ResourceState
        kind="error"
        title="Ongoing titles are offline"
        :message="failures.ongoing"
        action-label="Retry"
        @action="load"
      />
    </div>
    <div v-if="!loading && noDiscoveryItems && (allFailed || failureCount === 0)" class="page-shell py-16">
      <ResourceState
        :kind="allFailed ? 'error' : 'empty'"
        title="No discovery data available"
        message="The archive did not return any titles right now."
        action-label="Retry"
        @action="load"
      />
    </div>
  </div>
</template>
