<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref } from 'vue'

import SignalPageFrame from '@/components/ui/SignalPageFrame.vue'
import type { AnimeSummary } from '@/models/domain'

const props = withDefaults(defineProps<{ items: AnimeSummary[]; label?: string; context?: string }>(), {
  label: 'Featured',
  context: '',
})

const viewport = ref<HTMLElement>()
const activeIndex = ref(0)
const dragging = ref(false)
let dragOriginX = 0
let dragOriginScroll = 0
let dragMoved = false
let scrollFrame = 0

function syncActiveIndex() {
  const root = viewport.value
  if (!root) return
  const cards = [...root.querySelectorAll<HTMLElement>('[data-hero-index]')]
  if (!cards.length) return
  const rootLeft = root.getBoundingClientRect().left

  const closest = cards.reduce((best, card) => (
    Math.abs(card.getBoundingClientRect().left - rootLeft) < Math.abs(best.getBoundingClientRect().left - rootLeft) ? card : best
  ))
  activeIndex.value = Number(closest.dataset.heroIndex) || 0
}

function onScroll() {
  window.cancelAnimationFrame(scrollFrame)
  scrollFrame = window.requestAnimationFrame(syncActiveIndex)
}

function startDrag(event: PointerEvent) {
  if (event.pointerType !== 'mouse' || event.button !== 0 || !viewport.value) return
  dragging.value = true
  dragMoved = false
  dragOriginX = event.clientX
  dragOriginScroll = viewport.value.scrollLeft
  viewport.value.setPointerCapture?.(event.pointerId)
}

function moveDrag(event: PointerEvent) {
  if (!dragging.value || !viewport.value) return
  const movement = event.clientX - dragOriginX
  if (Math.abs(movement) > 4) dragMoved = true
  viewport.value.scrollLeft = dragOriginScroll - movement
  event.preventDefault()
}

function endDrag(event: PointerEvent) {
  if (!dragging.value || !viewport.value) return
  dragging.value = false
  viewport.value.releasePointerCapture?.(event.pointerId)
  syncActiveIndex()
  if (dragMoved) window.setTimeout(() => { dragMoved = false }, 0)
}

function openCard(event: MouseEvent, index: number) {
  if (dragMoved) {
    event.preventDefault()
    dragMoved = false
    return
  }
  activeIndex.value = index
}

async function select(index: number) {
  const total = props.items.length
  if (!total) return

  activeIndex.value = (index + total) % total
  await nextTick()

  const target = viewport.value?.querySelector<HTMLElement>(`[data-hero-index="${activeIndex.value}"]`)
  if (!target || !viewport.value) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const targetLeft = target.getBoundingClientRect().left - viewport.value.getBoundingClientRect().left + viewport.value.scrollLeft
  viewport.value.scrollTo({
    left: targetLeft,
    behavior: reduceMotion ? 'auto' : 'smooth',
  })
}

onBeforeUnmount(() => window.cancelAnimationFrame(scrollFrame))
</script>

<template>
  <SignalPageFrame :title="label" :context="context" heading-id="featured-videos-title" variant="hero">
    <div class="relative pb-10 pt-[17rem] sm:pt-56 lg:pb-12 lg:pt-[18.5rem]">
      <div
        ref="viewport"
        class="hero-carousel-viewport ms-4 w-[calc(100%-1rem)] overflow-x-auto sm:ms-[18vw] sm:w-[82vw] lg:ms-[25vw] lg:w-[75vw]"
        :class="dragging ? 'is-dragging' : ''"
        @scroll="onScroll"
        @pointerdown="startDrag"
        @pointermove="moveDrag"
        @pointerup="endDrag"
        @pointercancel="endDrag"
        @pointerleave="endDrag"
      >
        <div class="flex w-max gap-4 pe-[25vw] sm:gap-8 lg:gap-[3.35rem]">
          <RouterLink
            v-for="(item, itemIndex) in items"
            :key="item.slug"
            :to="`/anime/${item.slug}`"
            :data-hero-index="itemIndex"
            class="group relative block w-[min(82vw,30.625rem)] shrink-0 overflow-hidden rounded-[1.45rem] bg-[#202020]"
            :aria-label="`Open ${item.title}`"
            @focus="select(itemIndex)"
            @click="openCard($event, itemIndex)"
            @dragstart.prevent
          >
            <img
              v-if="item.thumb"
              :src="item.thumb"
              :alt="item.title"
              :fetchpriority="itemIndex === 0 ? 'high' : 'auto'"
              :draggable="false"
              class="aspect-[1.85/1] w-full object-cover"
            />
            <div v-else class="grid aspect-[1.85/1] place-items-center p-8 text-center text-xl font-black text-white">
              {{ item.title }}
            </div>
            <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-black/85 px-5 py-3 text-white">
              <div class="min-w-0">
                <p class="line-clamp-1 text-base font-black">
                  {{ item.title }}
                </p>
                <p v-if="item.episode || item.status" class="mt-0.5 line-clamp-1 text-xs font-semibold text-white/75">
                  {{ item.episode || item.status }}
                </p>
              </div>
              <span class="shrink-0 text-xs font-black text-accent tabular">{{ String(itemIndex + 1).padStart(2, '0') }}</span>
            </div>
          </RouterLink>
        </div>
      </div>

      <div class="ms-4 mt-7 flex items-center sm:ms-[18vw] lg:ms-[calc(25vw+2.5rem)]">
        <div class="flex items-center gap-3" role="group" aria-label="Choose featured video">
          <button
            v-for="(item, itemIndex) in items"
            :key="`${item.slug}-dot`"
            class="size-3 rounded-full border-[3px] border-[#202020] transition-colors"
            :class="itemIndex === activeIndex ? 'bg-accent' : 'bg-[#202020]'"
            :aria-label="`Show featured video ${itemIndex + 1}`"
            :aria-current="itemIndex === activeIndex ? 'true' : undefined"
            @click="select(itemIndex)"
          />
        </div>
      </div>
    </div>
  </SignalPageFrame>
</template>
