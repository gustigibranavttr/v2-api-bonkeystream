<script setup lang="ts">
import { ArrowLeft, Play, Star } from '@lucide/vue'
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import DownloadList from '@/components/anime/DownloadList.vue'
import FavoriteButton from '@/components/anime/FavoriteButton.vue'
import LoadingGrid from '@/components/ui/LoadingGrid.vue'
import ResourceState from '@/components/ui/ResourceState.vue'
import { useAsyncResource } from '@/composables/useAsyncResource'
import { useHistory } from '@/composables/useLibrary'
import { endpoints } from '@/lib/api'
import { normalizeDetail } from '@/lib/normalizers'
import type { AnimeDetail } from '@/models/domain'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const { data, loading, error, load } = useAsyncResource<AnimeDetail>()
const { find } = useHistory()
const resumeIndex = computed(() => {
  if (!data.value?.episodes.length) return 1
  const saved = find(slug.value)
  if (!saved || saved.completed) return 1
  const titleIndex = data.value.episodes.findIndex((episode) => episode.title === saved.episodeTitle)
  if (titleIndex >= 0) return titleIndex + 1
  return saved.episodeIndex >= 1 && saved.episodeIndex <= data.value.episodes.length ? saved.episodeIndex : 1
})
const fetchDetail = () => load(async (signal) => normalizeDetail(await endpoints.detail(slug.value, signal), slug.value))
watch(slug, fetchDetail)
onMounted(fetchDetail)
</script>

<template>
  <div class="signal-grid">
    <div class="page-shell page-section">
      <RouterLink to="/" class="ink-button mb-8 min-h-10">
        <ArrowLeft :size="16" aria-hidden="true" />Back to discovery
      </RouterLink><LoadingGrid v-if="loading" :count="6" /><ResourceState
        v-else-if="error"
        kind="error"
        title="Anime file unavailable"
        :message="error"
        action-label="Retry"
        @action="fetchDetail"
      /><template v-else-if="data">
        <section class="grid gap-8 lg:grid-cols-[minmax(14rem,22rem)_1fr] lg:gap-14">
          <div class="lg:sticky lg:top-24 lg:self-start">
            <div class="diagonal-stripes panel-cut p-3 sm:p-4">
              <img
                v-if="data.thumb"
                :src="data.thumb"
                :alt="data.title"
                class="panel-cut aspect-[2/3] w-full object-cover"
              /><div v-else class="panel-cut grid aspect-[2/3] w-full place-items-center bg-surface p-8 text-center text-xl font-black text-foreground">
                {{ data.title }}
              </div>
              <div class="mt-3 flex justify-between text-[0.6rem] font-bold uppercase tracking-[0.14em] text-white/50"><span>Bonkey archive</span><span class="text-accent">FILE / 01</span></div>
            </div>
          </div><div class="min-w-0 py-2">
            <div class="mb-5 flex flex-wrap gap-2">
              <span v-if="data.status" class="cut-corner bg-accent px-3 py-1.5 text-[0.62rem] font-black uppercase text-accent-foreground">{{ data.status }}</span><span v-for="type in data.type" :key="type" class="cut-corner bg-foreground px-3 py-1.5 text-[0.62rem] font-bold uppercase text-background">{{ type }}</span>
            </div><h1 class="text-[clamp(3rem,7vw,6.5rem)] font-black leading-[0.82] tracking-[-0.08em]">
              {{ data.title }}
            </h1><p v-if="data.japaneseTitle" class="mt-3 text-sm text-subtle">
              {{ data.japaneseTitle }}
            </p><div class="mt-7 flex flex-wrap gap-3">
              <RouterLink v-if="data.episodes.length" :to="{ path: `/watch/${data.slug}`, query: { episode: resumeIndex } }" class="signal-button">
                <Play :size="17" fill="currentColor" aria-hidden="true" />{{ find(data.slug) && !find(data.slug)?.completed ? 'Resume' : 'Watch now' }}
              </RouterLink><FavoriteButton :anime="data" />
            </div><dl class="mt-9 grid grid-cols-2 gap-0 border-y-4 border-foreground sm:grid-cols-3">
              <div v-if="data.rating" class="border-b-2 border-e-2 border-border bg-surface p-4">
                <dt class="text-xs text-subtle">
                  Rating
                </dt><dd class="mt-1 flex items-center gap-1 font-display font-semibold">
                  <Star :size="14" fill="currentColor" class="text-gold" aria-hidden="true" />{{ data.rating }}
                </dd>
              </div><div v-if="data.duration" class="border-b-2 border-e-2 border-border bg-surface p-4">
                <dt class="text-xs text-subtle">
                  Duration
                </dt><dd class="mt-1 font-display font-semibold">
                  {{ data.duration }}
                </dd>
              </div><div v-if="data.studio" class="border-b-2 border-e-2 border-border bg-surface p-4">
                <dt class="text-xs text-subtle">
                  Studio
                </dt><dd class="mt-1 font-display font-semibold">
                  {{ data.studio }}
                </dd>
              </div><div v-if="data.releaseDate" class="border-b-2 border-e-2 border-border bg-surface p-4">
                <dt class="text-xs text-subtle">
                  Released
                </dt><dd class="mt-1 font-display font-semibold">
                  {{ data.releaseDate }}
                </dd>
              </div>
            </dl><div v-if="data.synopsis" class="mt-9 max-w-3xl border-s-8 border-accent ps-5">
              <h2 class="mb-3 text-sm font-black uppercase tracking-wider text-foreground">
                Synopsis
              </h2><p class="leading-7 text-muted">
                {{ data.synopsis }}
              </p>
            </div><div v-if="data.genres?.length" class="mt-7 flex flex-wrap gap-2">
              <span v-for="genre in data.genres" :key="genre" class="cut-corner bg-surface-raised px-3 py-1.5 text-xs font-bold text-muted">{{ genre }}</span>
            </div>
          </div>
        </section><section v-if="data.episodes.length" class="mt-16 border-t-4 border-foreground pt-9">
          <div class="mb-6 flex items-end justify-between">
            <div>
              <p class="page-kicker mb-2">
                Playback order
              </p><h2 class="section-title">
                Episodes
              </h2>
            </div><span class="tabular text-xs font-bold text-subtle">{{ data.episodes.length }} FILES</span>
          </div><div class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            <RouterLink
              v-for="(episode,index) in data.episodes"
              :key="`${episode.title}-${index}`"
              :to="{ path: `/watch/${data.slug}`, query: { episode: index + 1 } }"
              class="cut-corner flex min-h-14 items-center gap-3 bg-foreground px-3 text-background transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <span class="tabular text-xs font-black opacity-50">{{ String(index + 1).padStart(2,'0') }}</span><span class="line-clamp-2 text-xs font-bold">{{ episode.title }}</span>
            </RouterLink>
          </div>
        </section><DownloadList class="mt-14" :sections="data.downloads" />
      </template>
    </div>
  </div>
</template>
