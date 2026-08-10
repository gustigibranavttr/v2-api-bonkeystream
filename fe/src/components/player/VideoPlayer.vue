<script setup lang="ts">
import { AlertTriangle, RefreshCw } from '@lucide/vue'
import { computed, nextTick, ref, watch } from 'vue'
import { closestFormat } from '@/lib/normalizers'
import { buildResolvedStreamUrl } from '@/lib/streamResolver'
import type { Episode, StreamFormat, StreamSource } from '@/models/domain'

const props = withDefaults(defineProps<{ episode: Episode; preferredQuality?: number; resumeTime?: number }>(), { preferredQuality: 720, resumeTime: 0 })
const emit = defineEmits<{ quality: [value?: number]; progress: [currentTime: number, duration: number]; ended: []; playable: []; pause: [currentTime: number, duration: number] }>()
const video = ref<HTMLVideoElement>()
const selectedFormat = ref<StreamFormat>()
const selectedSource = ref<StreamSource>()
const failedUrls = ref(new Set<string>())
const mediaError = ref('')
const hasResumed = ref(false)

const availableSources = computed(() => selectedFormat.value?.sources.filter((source) => !failedUrls.value.has(source.url)) ?? [])
const playbackUrl = computed(() => selectedSource.value ? buildResolvedStreamUrl(selectedSource.value.url) : undefined)

function resetSelection() {
  failedUrls.value = new Set()
  mediaError.value = ''
  hasResumed.value = false
  selectedFormat.value = closestFormat(props.episode.formats, props.preferredQuality)
  selectedSource.value = selectedFormat.value?.sources[0]
}

function chooseFormat(label: string) {
  selectedFormat.value = props.episode.formats.find((format) => format.label === label) ?? props.episode.formats[0]
  selectedSource.value = selectedFormat.value?.sources.find((source) => !failedUrls.value.has(source.url)) ?? selectedFormat.value?.sources[0]
  mediaError.value = ''
  hasResumed.value = false
  emit('quality', selectedFormat.value?.quality)
}

function chooseSource(url: string) {
  selectedSource.value = selectedFormat.value?.sources.find((source) => source.url === url)
  mediaError.value = ''
  hasResumed.value = false
}

function onMetadata() {
  if (!hasResumed.value && video.value && props.resumeTime > 0 && Number.isFinite(video.value.duration)) {
    video.value.currentTime = Math.min(props.resumeTime, Math.max(0, video.value.duration - 2))
    hasResumed.value = true
  }
  emit('playable')
}

function onError() {
  if (selectedSource.value) failedUrls.value.add(selectedSource.value.url)
  mediaError.value = availableSources.value.length || props.episode.formats.some((format) => format.sources.some((source) => !failedUrls.value.has(source.url)))
    ? 'This source could not be played. Choose another server or quality.'
    : 'No playable source remains for this episode.'
}

async function retry() {
  mediaError.value = ''
  if (selectedSource.value) failedUrls.value.delete(selectedSource.value.url)
  await nextTick()
  video.value?.load()
}

watch(() => props.episode, resetSelection, { immediate: true })
</script>

<template>
  <div>
    <div class="relative aspect-video overflow-hidden bg-black ring-1 ring-white/15">
      <video
        v-if="selectedSource"
        ref="video"
        :key="playbackUrl"
        :src="playbackUrl"
        class="h-full w-full"
        controls
        playsinline
        preload="metadata"
        @loadedmetadata="onMetadata"
        @canplay="emit('playable')"
        @timeupdate="video && emit('progress', video.currentTime, video.duration || 0)"
        @pause="video && emit('pause', video.currentTime, video.duration || 0)"
        @ended="emit('ended')"
        @error="onError"
      />
      <div v-if="mediaError" class="absolute inset-0 grid place-items-center bg-black/95 p-6 text-center text-white">
        <div class="max-w-md">
          <AlertTriangle :size="30" class="mx-auto mb-3 text-warning" aria-hidden="true" /><h2 class="font-display text-lg font-semibold">
            Playback source unavailable
          </h2><p class="mt-2 text-sm text-white/60">
            {{ mediaError }}
          </p><button class="signal-button mt-5" @click="retry">
            <RefreshCw :size="15" aria-hidden="true" />Retry source
          </button>
        </div>
      </div>
    </div>
    <div class="diagonal-stripes flex flex-col gap-3 border-t-4 border-accent px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between">
      <p class="min-w-0 truncate text-sm font-bold">
        {{ episode.title }}
      </p>
      <div class="flex flex-wrap gap-2">
        <label class="sr-only" for="quality">Stream quality</label>
        <select
          id="quality"
          :value="selectedFormat?.label"
          class="cut-corner h-9 border-0 bg-white px-3 text-xs font-bold text-[#1b1b1b]"
          @change="chooseFormat(($event.target as HTMLSelectElement).value)"
        >
          <option v-for="format in episode.formats" :key="format.label" :value="format.label">
            {{ format.label }}
          </option>
        </select>
        <label class="sr-only" for="source">Stream server</label>
        <select
          id="source"
          :value="selectedSource?.url"
          class="cut-corner h-9 border-0 bg-white px-3 text-xs font-bold text-[#1b1b1b]"
          @change="chooseSource(($event.target as HTMLSelectElement).value)"
        >
          <option
            v-for="source in selectedFormat?.sources"
            :key="source.url"
            :value="source.url"
            :disabled="failedUrls.has(source.url)"
          >
            {{ source.label }}{{ failedUrls.has(source.url) ? ' (failed)' : '' }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
