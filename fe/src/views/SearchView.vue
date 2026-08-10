<script setup lang="ts">
import { Search } from '@lucide/vue'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AnimeGrid from '@/components/anime/AnimeGrid.vue'
import LoadingGrid from '@/components/ui/LoadingGrid.vue'
import MechanicalPagination from '@/components/ui/MechanicalPagination.vue'
import ResourceState from '@/components/ui/ResourceState.vue'
import SignalPageFrame from '@/components/ui/SignalPageFrame.vue'
import { useAsyncResource } from '@/composables/useAsyncResource'
import { endpoints } from '@/lib/api'
import { normalizePaginated } from '@/lib/normalizers'
import type { PaginatedAnime } from '@/models/domain'

const route = useRoute(), router = useRouter()
const input = ref('')
const { data, loading, error, load } = useAsyncResource<PaginatedAnime>()
const page = () => Math.max(1, Number(route.query.page) || 1)
function sync() {
  const q = typeof route.query.q === 'string' ? route.query.q.trim() : ''
  input.value = q
  if (q) load(async (signal) => normalizePaginated(await endpoints.search(q, page(), signal)))
}
function submit() { const q = input.value.trim(); if (q) router.push({ path: '/search', query: { q } }) }
function changePage(next: number) { router.push({ query: { q: input.value.trim(), page: next } }) }
watch(() => route.fullPath, sync, { immediate: true })
</script>

<template>
  <div class="signal-grid min-h-[70dvh]">
    <SignalPageFrame title="Search" context="Archive query" heading-id="search-page-title">
      <div class="signal-page-frame__content page-shell relative pb-16 pt-[21rem] md:pt-[18.5rem]">
        <div class="mb-12 border-b-4 border-foreground pb-8">
          <form class="ms-auto flex max-w-[40rem]" role="search" @submit.prevent="submit">
            <label class="sr-only" for="search-page">Search anime</label><input
              id="search-page"
              v-model="input"
              type="search"
              placeholder="Enter an anime title"
              class="min-w-0 flex-1 border-2 border-foreground bg-surface px-4 text-foreground outline-none placeholder:text-subtle focus:border-accent"
            /><button class="grid size-12 shrink-0 place-items-center bg-foreground text-background transition-colors hover:bg-accent hover:text-accent-foreground" aria-label="Search">
              <Search :size="20" aria-hidden="true" />
            </button>
          </form>
        </div>
        <LoadingGrid v-if="loading" />
        <ResourceState
          v-else-if="error"
          kind="error"
          title="Search interrupted"
          :message="error"
          action-label="Retry"
          @action="sync"
        />
        <ResourceState v-else-if="!input.trim()" title="Start with a title" message="Type an anime name to query the Bonkey archive." />
        <ResourceState
          v-else-if="!data?.results.length"
          title="No matching files"
          :message="`Nothing matched “${input}”. Try a shorter or different title.`"
          action-label="Browse archive"
          @action="router.push('/browse')"
        />
        <template v-else>
          <div class="mb-6 flex items-center justify-between">
            <p class="text-sm text-muted">
              Results for <strong class="text-foreground">{{ input }}</strong>
            </p><span class="font-display text-xs text-subtle">PAGE {{ data.pagination.currentPage }}</span>
          </div>
          <AnimeGrid :items="data.results" />
          <MechanicalPagination class="mt-14" :current="page()" :total="data.pagination.totalPages" :has-previous="data.pagination.hasPrevPage" :has-next="data.pagination.hasNextPage" @change="changePage" />
        </template>
      </div>
    </SignalPageFrame>
  </div>
</template>
