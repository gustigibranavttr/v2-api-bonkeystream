<script setup lang="ts">
withDefaults(defineProps<{ eyebrow?: string; title: string; index?: string; description?: string }>(), {
  eyebrow: '',
  index: '',
  description: '',
})
</script>

<template>
  <header class="relative max-w-4xl">
    <div v-if="eyebrow || index" class="mb-3 flex items-center gap-3">
      <span v-if="index" class="cut-corner bg-accent px-3 py-1 text-xs font-black text-accent-foreground tabular">{{ index }}</span>
      <p v-if="eyebrow" class="page-kicker">{{ eyebrow }}</p>
    </div>
    <h1 class="display-title">{{ title }}</h1>
    <p v-if="description" class="mt-5 max-w-2xl text-sm leading-6 text-muted sm:text-base sm:leading-7">{{ description }}</p>
  </header>
</template>
