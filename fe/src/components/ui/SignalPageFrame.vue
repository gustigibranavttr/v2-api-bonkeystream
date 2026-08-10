<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  context?: string
  headingId: string
  variant?: 'hero' | 'compact'
}>(), {
  context: '',
  variant: 'compact',
})
</script>

<template>
  <section
    class="signal-page-frame reference-hero relative isolate overflow-hidden"
    :class="`signal-page-frame--${variant}`"
    :aria-labelledby="headingId"
  >
    <div class="signal-page-frame__wedge diagonal-stripes absolute inset-y-0 start-0 -z-10" aria-hidden="true" />
    <div class="signal-page-frame__label absolute start-0 z-10 text-[#191919]">
      <svg
        class="signal-page-frame__label-shape absolute inset-0 size-full"
        viewBox="0 0 232 324"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M0 18H174C197 18 216 36 216 59L0 320V18Z" />
      </svg>
      <h1
        :id="headingId"
        class="signal-page-frame__title font-display font-black uppercase leading-[0.82] tracking-[-0.075em]"
        :class="{
          'signal-page-frame__title--single whitespace-nowrap': !title.trim().includes(' '),
          'signal-page-frame__title--long': title.replaceAll(' ', '').length > 7,
        }"
      >
        {{ title }}<span v-if="context" class="sr-only"> — {{ context }}</span>
      </h1>
    </div>
    <p class="signal-page-frame__watermark font-display absolute font-black italic uppercase leading-none tracking-[-0.075em] text-black/[0.055]" aria-hidden="true">
      {{ title }}
    </p>
    <slot />
  </section>
</template>
