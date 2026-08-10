<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import AppFooter from '@/components/layout/AppFooter.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import ToastRegion from '@/components/ui/ToastRegion.vue'

const route = useRoute()
const darkTheme = computed(() => route.meta.theme === 'dark')

function skipToContent() {
  const main = document.querySelector<HTMLElement>('#main-content')
  if (!main) return
  main.focus({ preventScroll: true })
  main.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="app-frame min-h-dvh bg-background text-foreground" :class="{ 'theme-dark': darkTheme }">
    <a
      href="#main-content"
      class="skip-link bg-accent px-5 py-3 font-bold text-accent-foreground"
      @click.prevent="skipToContent"
    >
      Skip to content
    </a>

    <AppNavbar />

    <RouterView v-slot="{ Component }">
      <Transition name="route" mode="out-in">
        <main
          id="main-content"
          :key="route.path"
          tabindex="-1"
          class="min-h-[calc(100dvh-4rem)] scroll-mt-[4.5rem] focus:outline-none md:scroll-mt-16"
        >
          <component :is="Component" />
        </main>
      </Transition>
    </RouterView>

    <AppFooter />
    <ToastRegion />
  </div>
</template>
