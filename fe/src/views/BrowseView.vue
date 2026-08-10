<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AnimeGrid from '@/components/anime/AnimeGrid.vue'
import MechanicalPagination from '@/components/ui/MechanicalPagination.vue'
import LoadingGrid from '@/components/ui/LoadingGrid.vue'
import ResourceState from '@/components/ui/ResourceState.vue'
import SignalPageFrame from '@/components/ui/SignalPageFrame.vue'
import { useAsyncResource } from '@/composables/useAsyncResource'
import { endpoints } from '@/lib/api'
import { normalizePaginated, normalizeTaxonomy } from '@/lib/normalizers'
import type { PaginatedAnime, TaxonomyItem } from '@/models/domain'

type BrowseKind = 'type' | 'genre' | 'season' | 'movie' | 'bd'
const route = useRoute(), router = useRouter()
const kinds: { key: BrowseKind; label: string }[] = [{ key: 'type', label: 'Type' }, { key: 'genre', label: 'Genre' }, { key: 'season', label: 'Season' }, { key: 'movie', label: 'Movies' }, { key: 'bd', label: 'BD' }]
const taxonomies = ref<Record<string, TaxonomyItem[]>>({})
const taxonomyLoading = ref(false)
const { data, loading, error, load } = useAsyncResource<PaginatedAnime>()
const kind = computed<BrowseKind>(() => kinds.some((item) => item.key === route.query.kind) ? route.query.kind as BrowseKind : 'type')
const activeKindIndex = computed(() => Math.max(0, kinds.findIndex((item) => item.key === kind.value)))
const slug = computed(() => typeof route.query.slug === 'string' ? route.query.slug : '')
const page = computed(() => Math.max(1, Number(route.query.page) || 1))

function defaultTaxonomy(next: BrowseKind) {
  const items = taxonomies.value[next] ?? []
  if (next !== 'type') return items[0]
  return [...items].sort((left, right) => (right.count ?? 0) - (left.count ?? 0))[0]
}

async function sync() {
  if (['type', 'genre', 'season'].includes(kind.value)) {
    if (!taxonomies.value[kind.value]) {
      taxonomyLoading.value = true
      try { taxonomies.value[kind.value] = normalizeTaxonomy(await endpoints.taxonomy(kind.value as 'type' | 'genre' | 'season')) } finally { taxonomyLoading.value = false }
    }
    const initialTaxonomy = defaultTaxonomy(kind.value)
    if (!slug.value && initialTaxonomy) {
      router.replace({ query: { kind: kind.value, slug: initialTaxonomy.slug } })
      return
    }
    if (slug.value) load(async (signal) => normalizePaginated(await endpoints.catalog(kind.value as 'type' | 'genre' | 'season', slug.value, page.value, signal)))
  } else load(async (signal) => normalizePaginated(await endpoints.collection(kind.value as 'movie' | 'bd', page.value, signal)))
}
function selectKind(next: BrowseKind) { router.push({ query: next === 'movie' || next === 'bd' ? { kind: next } : { kind: next, slug: defaultTaxonomy(next)?.slug } }) }
function selectSlug(next: string) { router.push({ query: { kind: kind.value, slug: next } }) }
function changePage(next: number) { router.push({ query: { ...route.query, page: next } }) }
watch(() => route.fullPath, sync, { immediate: true })
</script>

<template>
  <div class="signal-grid relative overflow-hidden">
    <SignalPageFrame title="Browse" context="Catalog control" heading-id="browse-page-title">
      <div class="signal-page-frame__content page-shell relative pb-16 pt-[21rem] md:pt-[18.5rem]">
        <p class="mb-8 max-w-[62ch] text-base font-medium leading-relaxed text-muted md:ms-24">
          Filter the source catalog by type, genre, season, movie, or BD release.
        </p>
        <div class="reference-tab-bar mb-5" role="tablist" aria-label="Browse categories" :style="{ '--active-index': activeKindIndex }">
          <span class="reference-tab-indicator" aria-hidden="true" />
          <button
            v-for="item in kinds"
            :key="item.key"
            class="reference-tab"
            role="tab"
            :aria-selected="kind === item.key"
            @click="selectKind(item.key)"
          >
            {{ item.label }}
          </button>
        </div>
        <div v-if="!['movie','bd'].includes(kind)" class="taxonomy-filter-bar scrollbar-thin mb-10">
          <span v-if="taxonomyLoading" class="text-sm text-muted">Loading filters…</span><button
            v-for="item in taxonomies[kind]"
            :key="item.slug"
            class="taxonomy-filter"
            :aria-pressed="slug === item.slug"
            @click="selectSlug(item.slug)"
          >
            {{ item.name }}<span v-if="item.count" class="ms-1 text-subtle">{{ item.count }}</span>
          </button>
        </div>
        <LoadingGrid v-if="loading" />
        <ResourceState
          v-else-if="error"
          kind="error"
          title="Catalog unavailable"
          :message="error"
          action-label="Retry"
          @action="sync"
        />
        <ResourceState v-else-if="!data?.results.length" title="No titles in this file" message="The selected archive section returned no anime." />
        <template v-else>
          <AnimeGrid :items="data.results" />
          <MechanicalPagination class="mt-14" :current="page" :total="data.pagination.totalPages" :has-previous="data.pagination.hasPrevPage" :has-next="data.pagination.hasNextPage" @change="changePage" />
        </template>
      </div>
    </SignalPageFrame>
  </div>
</template>
