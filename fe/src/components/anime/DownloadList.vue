<script setup lang="ts">
import { ArrowUpRight, Download } from '@lucide/vue'
import type { DownloadSection } from '@/models/domain'
defineProps<{ sections: DownloadSection[] }>()
</script>

<template>
  <section v-if="sections.length" class="border-t-4 border-foreground pt-8" aria-labelledby="downloads-title">
    <div class="mb-6 flex items-center gap-3">
      <span class="grid size-9 place-items-center bg-accent text-accent-foreground"><Download :size="18" aria-hidden="true" /></span><h2 id="downloads-title" class="section-title">
        Downloads
      </h2>
    </div>
    <div class="divide-y-2 divide-border border-y-2 border-border">
      <div v-for="(section, sectionIndex) in sections" :key="`${section.title}-${sectionIndex}`" class="grid gap-4 py-5 md:grid-cols-[minmax(10rem,1fr)_3fr]">
        <h3 class="text-sm font-black">
          {{ section.title || `Download group ${sectionIndex + 1}` }}
        </h3>
        <div class="grid gap-3">
          <div v-for="(quality, qualityIndex) in section.qualities" :key="`${quality.quality}-${qualityIndex}`" class="flex flex-wrap items-center gap-2">
            <span class="w-16 shrink-0 text-xs font-bold text-muted tabular">{{ quality.quality || 'Source' }}</span>
            <a
              v-for="link in quality.links"
              :key="link.url"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="cut-corner inline-flex items-center gap-1.5 bg-foreground px-3 py-2 text-xs font-bold text-background transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {{ link.name }}<ArrowUpRight :size="13" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
    <p class="mt-3 text-xs text-subtle">
      Download links open an external provider in a new tab.
    </p>
  </section>
</template>
