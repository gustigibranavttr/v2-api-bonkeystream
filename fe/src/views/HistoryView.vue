<script setup lang="ts">
import { Play, Trash2 } from '@lucide/vue'
import ResourceState from '@/components/ui/ResourceState.vue'
import SignalPageFrame from '@/components/ui/SignalPageFrame.vue'
import { useHistory } from '@/composables/useLibrary'
import { useToast } from '@/composables/useToast'

const { history, remove, clear, save } = useHistory()
const { show } = useToast()
const percentage = (current: number, duration: number) => duration > 0 ? Math.min(100, Math.round(current / duration * 100)) : 0
const watchedAt = (timestamp: string) => new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(timestamp))
function removeItem(slug: string) { const item = history.value.find((entry) => entry.slug === slug); if (!item) return; remove(slug); show('History item removed.', { label: 'Undo', run: () => save(item) }) }
function clearAll() { if (window.confirm('Clear all viewing history and saved progress from this browser? Favorites will be kept.')) clear() }
</script>

<template>
  <div class="signal-grid min-h-[70dvh]">
    <SignalPageFrame title="History" context="Playback log" heading-id="history-page-title">
      <div class="signal-page-frame__content page-shell relative pb-16 pt-[21rem] md:pt-[18.5rem]">
        <div class="mb-10 flex flex-wrap items-center justify-between gap-6 md:ms-24">
          <p class="max-w-[62ch] text-base font-medium leading-relaxed text-muted">
            Pick up where you stopped. Progress stays in this browser.
          </p>
          <button v-if="history.length" class="inline-flex min-h-11 items-center gap-2 px-2 text-sm font-bold text-muted transition-colors hover:text-danger" @click="clearAll">
            <Trash2 :size="15" aria-hidden="true" />Clear all history
          </button>
        </div><ResourceState
          v-if="!history.length"
          title="No playback records"
          message="Start an episode and your resume position will appear here."
          action-label="Find something to watch"
          @action="$router.push('/')"
        /><div v-else class="grid gap-5 lg:grid-cols-2">
          <article v-for="(item, itemIndex) in history" :key="item.slug" class="panel-cut group relative overflow-hidden bg-surface p-4 ring-1 ring-black/10 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgb(20_20_20/0.1)]">
            <span class="absolute inset-x-0 top-0 h-1 bg-accent" aria-hidden="true" />
            <span class="tabular absolute end-6 top-5 text-xs font-black text-subtle">{{ String(itemIndex + 1).padStart(2, '0') }}</span>
            <div class="flex min-w-0 gap-4 pe-8">
              <img
                v-if="item.thumb"
                :src="item.thumb"
                :alt="item.title"
                class="poster-cut h-36 w-24 shrink-0 object-cover sm:h-40 sm:w-28"
                loading="lazy"
              /><div v-else class="poster-cut grid h-36 w-24 shrink-0 place-items-center bg-surface-raised px-2 text-center text-xs font-bold text-muted sm:h-40 sm:w-28">
                No image
              </div><div class="min-w-0 flex-1 pt-1">
                <span class="inline-flex bg-accent px-2 py-1 text-xs font-black text-accent-foreground tabular">
                  {{ item.completed ? 'COMPLETED' : `${percentage(item.currentTime, item.duration)}% WATCHED` }}
                </span>
                <h2 class="mt-3 line-clamp-2 text-xl font-black leading-tight tracking-[-0.03em]">
                  {{ item.title }}
                </h2><p class="mt-2 line-clamp-2 text-sm font-semibold text-muted">
                  {{ item.episodeTitle }}
                </p><div class="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-raised">
                  <span class="block h-full rounded-full bg-accent" :style="{ width: `${percentage(item.currentTime, item.duration)}%` }" />
                </div><p class="mt-2 text-xs font-medium text-subtle">
                  {{ watchedAt(item.updatedAt) }}
                </p>
              </div>
            </div><div class="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
              <RouterLink :to="{ path: `/watch/${item.slug}`, query: { episode: item.episodeIndex, resume: '1' } }" class="signal-button min-h-10 px-5">
                <Play :size="15" fill="currentColor" aria-hidden="true" />Resume
              </RouterLink><button class="inline-flex min-h-10 items-center gap-2 px-2 text-sm font-bold text-muted transition-colors hover:text-danger" @click="removeItem(item.slug)">
                <Trash2 :size="14" aria-hidden="true" />Remove
              </button>
            </div>
          </article>
        </div>
      </div>
    </SignalPageFrame>
  </div>
</template>
