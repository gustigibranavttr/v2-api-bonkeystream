<script setup lang="ts">withDefaults(defineProps<{ count?: number }>(), { count: 10 })</script>
<template>
  <div class="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:gap-x-5 lg:grid-cols-4 xl:grid-cols-5" aria-label="Loading content" aria-busy="true">
    <div v-for="index in count" :key="index">
      <div class="skeleton poster-cut aspect-[2/3] w-full" />
      <div class="skeleton mt-3 h-4 w-4/5" />
      <div class="skeleton mt-2 h-3 w-2/5" />
    </div>
  </div>
</template>
