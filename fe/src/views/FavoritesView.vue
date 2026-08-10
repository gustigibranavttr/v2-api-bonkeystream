<script setup lang="ts">
import { Heart, Trash2 } from '@lucide/vue'
import ResourceState from '@/components/ui/ResourceState.vue'
import SignalPageFrame from '@/components/ui/SignalPageFrame.vue'
import { useFavorites } from '@/composables/useLibrary'
import { useToast } from '@/composables/useToast'

const { favorites, remove, restore } = useFavorites()
const { show } = useToast()
function removeFavorite(slug: string) {
  const item = favorites.value.find((favorite) => favorite.slug === slug)
  if (!item) return
  remove(slug)
  show('Favorite removed.', { label: 'Undo', run: () => restore(item) })
}
</script>

<template>
  <div class="signal-grid min-h-[70dvh]">
    <SignalPageFrame title="Favorites" context="Local collection" heading-id="favorites-page-title">
      <div class="signal-page-frame__content page-shell relative pb-16 pt-[21rem] md:pt-[18.5rem]">
        <p class="mb-10 max-w-[62ch] text-base font-medium leading-relaxed text-muted md:ms-24">
          Saved only in this browser.
        </p>
        <ResourceState
          v-if="!favorites.length"
          title="Your collection is empty"
          message="Save anime from its detail page and it will appear here."
          action-label="Browse anime"
          @action="$router.push('/browse')"
        /><div v-else class="grid border-t-4 border-foreground sm:grid-cols-2">
          <article v-for="(item, index) in favorites" :key="item.slug" class="group grid grid-cols-[auto_5.5rem_1fr] gap-4 border-b-2 border-border py-5 sm:odd:border-e-2 sm:odd:pe-5 sm:even:ps-5">
            <span class="tabular pt-1 text-xs font-black text-subtle">{{ String(index + 1).padStart(2, '0') }}</span>
            <RouterLink :to="`/anime/${item.slug}`" class="shrink-0">
              <img
                v-if="item.thumb"
                :src="item.thumb"
                :alt="item.title"
                class="poster-cut h-32 w-[5.5rem] object-cover"
                loading="lazy"
              /><div v-else class="poster-cut grid h-32 w-[5.5rem] place-items-center bg-surface-raised p-2 text-center text-xs">
                No image
              </div>
            </RouterLink><div class="flex min-w-0 flex-1 flex-col">
              <Heart :size="17" fill="currentColor" class="mb-3 text-foreground" aria-hidden="true" /><RouterLink :to="`/anime/${item.slug}`" class="line-clamp-3 text-base font-black leading-tight hover:text-muted">
                {{ item.title }}
              </RouterLink><button class="mt-auto inline-flex items-center gap-1.5 self-start text-xs text-subtle hover:text-danger" @click="removeFavorite(item.slug)">
                <Trash2 :size="14" aria-hidden="true" />Remove
              </button>
            </div>
          </article>
        </div>
      </div>
    </SignalPageFrame>
  </div>
</template>
