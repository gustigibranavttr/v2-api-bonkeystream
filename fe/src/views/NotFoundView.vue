<script setup lang="ts">import { ArrowLeft } from '@lucide/vue'</script>
<template>
  <div class="signal-grid page-shell grid min-h-[72dvh] place-items-center py-16">
    <div class="panel-cut diagonal-stripes relative w-full max-w-4xl overflow-hidden px-6 py-14 text-center text-white">
      <span class="absolute inset-x-0 top-0 h-3 bg-accent" aria-hidden="true" />
      <p class="text-xs font-bold uppercase tracking-[0.22em] text-accent">
        Error / Route mismatch
      </p><p class="my-4 text-[clamp(6rem,22vw,15rem)] font-black leading-none tracking-[-0.1em] text-white/10 tabular">
        404
      </p><h1 class="text-3xl font-black">
        This file does not exist.
      </h1><p class="mx-auto mt-3 max-w-md text-white/55">
        The requested route is outside the Bonkey archive.
      </p><RouterLink to="/" class="signal-button mt-7">
        <ArrowLeft :size="16" aria-hidden="true" />Return home
      </RouterLink>
    </div>
  </div>
</template>
