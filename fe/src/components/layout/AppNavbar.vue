<script setup lang="ts">
import { Heart, History, Menu, Search, X } from '@lucide/vue'
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const drawerOpen = ref(false)
const menuButton = ref<HTMLButtonElement>()
const closeButton = ref<HTMLButtonElement>()
const drawer = ref<HTMLElement>()
let previousOverflow = ''

const primaryLinks = [
  { label: 'Homepage', to: '/' },
  { label: 'Browse', to: '/browse' },
  { label: 'Favorites', to: '/favorites' },
  { label: 'History', to: '/history' },
]

const drawerLinks = [
  ...primaryLinks,
  { label: 'Search', to: '/search' },
]

function isActive(path: string) {
  return path === '/' ? route.path === '/' : route.path.startsWith(path)
}

async function openDrawer() {
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  document.querySelector<HTMLElement>('#app')?.setAttribute('inert', '')
  drawerOpen.value = true
  await nextTick()
  closeButton.value?.focus()
}

async function closeDrawer(restoreFocus = true) {
  if (!drawerOpen.value) return
  drawerOpen.value = false
  document.body.style.overflow = previousOverflow
  document.querySelector<HTMLElement>('#app')?.removeAttribute('inert')
  if (restoreFocus) {
    await nextTick()
    menuButton.value?.focus()
  }
}

function onDrawerKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    closeDrawer()
    return
  }

  if (event.key !== 'Tab' || !drawer.value) return
  const focusable = Array.from(drawer.value.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
  if (!focusable.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (!first || !last) return

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(() => route.fullPath, () => closeDrawer(false))
onBeforeUnmount(() => {
  document.body.style.overflow = previousOverflow
  document.querySelector<HTMLElement>('#app')?.removeAttribute('inert')
})
</script>

<template>
  <header class="app-navbar fixed inset-x-0 top-0 hidden border-b border-white/5 bg-black text-white md:block">
    <div class="mx-auto flex h-16 w-[calc(100%-2rem)] max-w-[81rem] items-center gap-4 lg:gap-8">
      <RouterLink to="/" class="group flex shrink-0 items-center gap-2" aria-label="Bonkey StreamV2 home">
        <img src="@/assets/brand-mark.webp" alt="" class="size-10 object-cover transition-transform duration-200 group-hover:-rotate-3 group-hover:scale-105" />
        <span class="hidden text-[0.88rem] font-black leading-[0.8] tracking-[0.08em] sm:block">
          BONKEY<span class="block pt-1 text-[0.58rem] tracking-[0.2em] text-white/70">STREAM V2</span>
        </span>
      </RouterLink>

      <nav class="ms-8 hidden h-full flex-1 items-center justify-start gap-1 md:flex lg:ms-12 lg:gap-2" aria-label="Primary navigation">
        <RouterLink
          v-for="(link, linkIndex) in primaryLinks"
          :key="link.to"
          :to="link.to"
          class="flex min-h-9 items-center rounded-full px-4 text-xs font-bold transition-colors lg:px-5"
          :class="[isActive(link.to) ? 'bg-white text-[#171717]' : 'text-white/60 hover:text-white', linkIndex > 2 ? 'hidden xl:flex' : '']"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="ms-auto flex items-center gap-1.5">
        <RouterLink to="/browse" class="me-2 hidden min-h-9 items-center rounded-full bg-accent px-5 text-xs font-black text-accent-foreground transition-colors hover:bg-accent-hover lg:inline-flex">
          Browse now
        </RouterLink>
        <RouterLink to="/search" class="grid size-10 place-items-center text-white/70 transition-colors hover:text-accent" aria-label="Search anime">
          <Search :size="18" :stroke-width="2.4" aria-hidden="true" />
        </RouterLink>
        <RouterLink to="/favorites" class="hidden size-10 place-items-center text-white/70 transition-colors hover:text-accent sm:grid" aria-label="Favorites">
          <Heart :size="18" :stroke-width="2.4" aria-hidden="true" />
        </RouterLink>
        <RouterLink to="/history" class="hidden size-10 place-items-center text-white/70 transition-colors hover:text-accent sm:grid" aria-label="Viewing history">
          <History :size="18" :stroke-width="2.4" aria-hidden="true" />
        </RouterLink>
      </div>
    </div>
  </header>
  <header class="app-navbar fixed inset-x-0 top-0 h-[4.5rem] border-b border-white/10 bg-black text-white md:hidden">
    <div class="flex h-full items-center gap-2 px-3">
      <RouterLink to="/" class="shrink-0" aria-label="Bonkey StreamV2 home">
        <img src="@/assets/brand-mark.webp" alt="" class="size-11 object-cover" />
      </RouterLink>
      <RouterLink to="/browse" class="ms-auto inline-flex min-h-10 items-center justify-center rounded-full bg-accent px-5 text-xs font-black text-accent-foreground">
        Browse now
      </RouterLink>
      <RouterLink to="/search" class="grid size-10 shrink-0 place-items-center rounded-full border border-white/30 text-white/80" aria-label="Search anime">
        <Search :size="18" :stroke-width="2.4" aria-hidden="true" />
      </RouterLink>
      <button ref="menuButton" class="grid size-11 shrink-0 place-items-center rounded-lg border border-white/35 text-white" aria-label="Open navigation" aria-haspopup="dialog" :aria-expanded="drawerOpen" @click="openDrawer">
        <Menu :size="23" aria-hidden="true" />
      </button>
    </div>
  </header>
  <div class="h-[4.5rem] md:h-16" aria-hidden="true" />

  <Teleport to="body">
    <div v-if="drawerOpen" class="mobile-nav-dialog fixed inset-0 bg-[#202020] text-white md:hidden" @keydown="onDrawerKeydown">
      <aside
        ref="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-navigation-title"
        class="flex min-h-dvh flex-col"
      >
        <div class="flex h-16 items-center justify-between bg-black px-4">
          <img src="@/assets/brand-mark.webp" alt="" class="size-11 object-cover" />
          <h2 id="mobile-navigation-title" class="sr-only">Navigation</h2>
          <button ref="closeButton" class="grid size-11 place-items-center rounded-xl bg-white/10 text-white/70 transition-colors hover:bg-white/15 hover:text-white" aria-label="Close navigation" @click="closeDrawer()">
            <X :size="21" aria-hidden="true" />
          </button>
        </div>
        <nav class="mx-auto flex w-[min(100%-2rem,30rem)] flex-1 flex-col justify-center gap-2 py-8" aria-label="Mobile primary navigation">
          <RouterLink
            v-for="link in drawerLinks"
            :key="link.to"
            :to="link.to"
            class="flex min-h-12 items-center justify-center rounded-full px-5 text-base font-bold transition-colors"
            :class="isActive(link.to) ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'"
            @click="closeDrawer(false)"
          >
            {{ link.label }}
          </RouterLink>
          <RouterLink to="/browse" class="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-6 text-base font-black text-accent-foreground" @click="closeDrawer(false)">
            Browse now
          </RouterLink>
        </nav>
      </aside>
    </div>
  </Teleport>
</template>
