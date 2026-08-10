<script setup lang="ts">
import { AlertTriangle, FolderOpen, RefreshCw } from '@lucide/vue'

withDefaults(defineProps<{ kind?: 'empty' | 'error'; title: string; message: string; actionLabel?: string }>(), { kind: 'empty' })
defineEmits<{ action: [] }>()
</script>

<template>
  <section class="panel-cut signal-grid relative overflow-hidden bg-surface px-6 py-14 text-center ring-1 ring-black/10">
    <span class="absolute inset-y-0 start-0 w-2 bg-accent" aria-hidden="true" />
    <component
      :is="kind === 'error' ? AlertTriangle : FolderOpen"
      :size="30"
      class="mx-auto mb-4 text-foreground"
      aria-hidden="true"
    />
    <h2 class="text-2xl font-black tracking-[-0.035em]">
      {{ title }}
    </h2>
    <p class="mx-auto mt-2 max-w-lg text-sm text-muted">
      {{ message }}
    </p>
    <button v-if="actionLabel" class="signal-button mt-6" @click="$emit('action')">
      <RefreshCw v-if="kind === 'error'" :size="15" aria-hidden="true" />{{ actionLabel }}
    </button>
  </section>
</template>
