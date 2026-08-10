<script setup lang="ts">
import { ChevronLeft, ChevronRight, ListVideo } from '@lucide/vue'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DownloadList from '@/components/anime/DownloadList.vue'
import VideoPlayer from '@/components/player/VideoPlayer.vue'
import ResourceState from '@/components/ui/ResourceState.vue'
import { useAsyncResource } from '@/composables/useAsyncResource'
import { useHistory, usePreferences } from '@/composables/useLibrary'
import { endpoints } from '@/lib/api'
import { normalizeDetail } from '@/lib/normalizers'
import type { AnimeDetail } from '@/models/domain'

const route = useRoute(), router = useRouter()
const slug = computed(() => String(route.params.slug))
const { data, loading, error, load } = useAsyncResource<AnimeDetail>()
const { find, save } = useHistory()
const { preferences, setQuality } = usePreferences()
const current = ref(0), duration = ref(0), completed = ref(false), confirmed = ref(false)
const index = computed(() => {
  const max = data.value?.episodes.length ?? 0
  const requested = Number(route.query.episode)
  return Number.isInteger(requested) && requested >= 1 && requested <= max ? requested : max ? 1 : 0
})
const episode = computed(() => index.value ? data.value?.episodes[index.value - 1] : undefined)
const saved = computed(() => data.value ? find(data.value.slug) : undefined)
const resumeTime = computed(() => {
  const record = saved.value
  return record && (record.episodeTitle === episode.value?.title || record.episodeIndex === index.value) ? record.currentTime : 0
})

async function fetchDetail() {
  await load(async (signal) => normalizeDetail(await endpoints.detail(slug.value, signal), slug.value))
  if (data.value?.episodes.length) {
    if (route.query.resume === '1') {
      const record = find(data.value.slug)
      const titleIndex = record ? data.value.episodes.findIndex((item) => item.title === record.episodeTitle) : -1
      const fallbackIndex = record && record.episodeIndex >= 1 && record.episodeIndex <= data.value.episodes.length ? record.episodeIndex : 1
      router.replace({ query: { episode: titleIndex >= 0 ? titleIndex + 1 : fallbackIndex } })
      return
    }
    const requested = Number(route.query.episode)
    if (!Number.isInteger(requested) || requested < 1 || requested > data.value.episodes.length) router.replace({ query: { ...route.query, episode: 1 } })
  }
}
function persist(force = false) {
  if (!data.value || !episode.value || (!confirmed.value && !force)) return
  save({
    slug: data.value.slug,
    title: data.value.title,
    thumb: data.value.thumb,
    episodeTitle: episode.value.title,
    episodeIndex: index.value,
    currentTime: current.value,
    duration: duration.value,
    progress: duration.value > 0 ? current.value / duration.value : 0,
    completed: completed.value || (duration.value > 0 && current.value / duration.value >= .9),
    preferredQuality: preferences.value.quality ? `${preferences.value.quality}p` : undefined,
    updatedAt: new Date().toISOString(),
  })
}
function onProgress(time: number, total: number) { current.value = time; duration.value = total; if (total > 0 && time / total >= .9) completed.value = true }
function onPause(time: number, total: number) { onProgress(time, total); persist() }
function selectEpisode(next: number) {
  persist()
  current.value = 0
  duration.value = 0
  confirmed.value = false
  completed.value = false
  const query = { ...route.query }
  delete query.resume
  router.push({ query: { ...query, episode: next } })
}
function beforeUnload() { persist() }
let interval = 0
watch(slug, fetchDetail)
watch(() => route.query.episode, () => {
  current.value = 0
  duration.value = 0
  confirmed.value = false
  completed.value = false
})
onMounted(() => { fetchDetail(); window.addEventListener('beforeunload', beforeUnload); interval = window.setInterval(() => persist(), 10_000) })
onBeforeUnmount(() => { persist(); window.removeEventListener('beforeunload', beforeUnload); window.clearInterval(interval) })
</script>

<template>
  <div class="diagonal-stripes min-h-[75dvh] bg-background">
    <div class="page-shell page-section">
      <div v-if="loading" class="skeleton panel-cut aspect-video w-full" /><ResourceState
        v-else-if="error"
        kind="error"
        title="Playback file unavailable"
        :message="error"
        action-label="Retry"
        @action="fetchDetail"
      /><div v-else-if="data && !data.episodes.length">
        <ResourceState title="No playback candidates" message="This anime does not currently include a valid stream URL. Downloads may still be available below." />
        <DownloadList class="mt-14" :sections="data.downloads" />
      </div><template v-else-if="data && episode">
        <div class="mb-5 flex min-w-0 items-center gap-2 text-xs font-bold text-muted">
          <RouterLink :to="`/anime/${data.slug}`" class="truncate hover:text-accent">
            {{ data.title }}
          </RouterLink><ChevronRight :size="14" class="shrink-0" aria-hidden="true" /><span class="truncate text-foreground">{{ episode.title }}</span>
        </div><div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div class="min-w-0">
            <VideoPlayer
              :episode="episode"
              :preferred-quality="preferences.quality ?? 720"
              :resume-time="resumeTime"
              @quality="setQuality"
              @progress="onProgress"
              @pause="onPause"
              @playable="confirmed = true"
              @ended="completed = true; persist(true)"
            /><div class="mt-4 flex items-center justify-between gap-3">
              <button class="line-button min-h-10 px-4" :disabled="index <= 1" @click="selectEpisode(index - 1)">
                <ChevronLeft :size="16" aria-hidden="true" />Previous
              </button><button v-if="completed && index < data.episodes.length" class="signal-button min-h-10 px-4" @click="selectEpisode(index + 1)">
                Play next episode<ChevronRight :size="16" aria-hidden="true" />
              </button><button
                v-else
                class="line-button min-h-10 px-4"
                :disabled="index >= data.episodes.length"
                @click="selectEpisode(index + 1)"
              >
                Next<ChevronRight :size="16" aria-hidden="true" />
              </button>
            </div><section class="mt-10 border-t-4 border-accent pt-7">
              <p class="page-kicker mb-2 text-accent">
                Now playing
              </p><h1 class="text-3xl font-black tracking-[-0.045em] sm:text-5xl">
                {{ data.title }}
              </h1><p class="mt-2 text-sm text-muted">
                {{ episode.title }} · Episode {{ index }} of {{ data.episodes.length }}
              </p><p v-if="data.synopsis" class="mt-5 line-clamp-4 max-w-3xl text-sm leading-6 text-muted">
                {{ data.synopsis }}
              </p>
            </section>
          </div><aside class="panel-cut overflow-hidden bg-surface xl:max-h-[calc(100dvh-7rem)] xl:sticky xl:top-24">
            <div class="flex items-center justify-between border-b-4 border-accent bg-[#111] px-4 py-4 text-white">
              <div class="flex items-center gap-2">
                <ListVideo :size="18" class="text-accent" aria-hidden="true" /><h2 class="text-sm font-black">
                  Episodes
                </h2>
              </div><span class="text-xs text-subtle">{{ index }}/{{ data.episodes.length }}</span>
            </div><div class="scrollbar-thin grid max-h-[28rem] grid-cols-2 gap-px overflow-y-auto bg-border sm:grid-cols-3 xl:max-h-[calc(100dvh-11rem)] xl:grid-cols-1">
              <button
                v-for="(item,itemIndex) in data.episodes"
                :key="`${item.title}-${itemIndex}`"
                class="flex min-h-14 items-center gap-3 bg-surface px-3 text-start text-xs font-bold transition-colors hover:bg-surface-raised"
                :class="itemIndex + 1 === index ? 'border-s-8 border-accent bg-accent text-accent-foreground' : ''"
                @click="selectEpisode(itemIndex + 1)"
              >
                <span class="tabular text-xs font-black opacity-55">{{ String(itemIndex + 1).padStart(2,'0') }}</span><span class="line-clamp-2">{{ item.title }}</span>
              </button>
            </div>
          </aside>
        </div><DownloadList class="mt-14" :sections="data.downloads" />
      </template>
    </div>
  </div>
</template>
