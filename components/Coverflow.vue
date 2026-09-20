<script setup lang="ts">
import { computeCardStates } from '~/utils/coverflow'
import type { PaperCardPost } from './PaperCard.vue'

const props = defineProps<{ posts: Array<PaperCardPost & { index: string }> }>()

const CARD_H = 360
const SPACING = CARD_H + 40
const LERP = 0.12

const current = ref(0)   // 当前渲染的滚动位置(平滑后)
const target = ref(0)    // 滚动目标(滚轮/触摸累积)
let rafId = 0

function tick() {
  current.value += (target.value - current.value) * LERP
  if (Math.abs(target.value - current.value) > 0.0005) {
    rafId = requestAnimationFrame(tick)
  } else {
    rafId = 0
  }
}

function onWheel(e: WheelEvent) {
  target.value += e.deltaY / SPACING
  if (!rafId) rafId = requestAnimationFrame(tick)
}

let touchStartY = 0
function onTouchStart(e: TouchEvent) {
  touchStartY = e.touches[0].clientY
}
function onTouchMove(e: TouchEvent) {
  const dy = e.touches[0].clientY - touchStartY
  touchStartY = e.touches[0].clientY
  target.value += dy / SPACING
  if (!rafId) rafId = requestAnimationFrame(tick)
}

const states = computed(() => computeCardStates(props.posts.length, current.value))

const cardStyle = (s: { centered: number; scale: number; opacity: number }) => ({
  transform: `translate(-50%, -50%) translateY(${s.centered * SPACING}px) scale(${s.scale})`,
  opacity: s.opacity,
  zIndex: Math.round(100 - Math.abs(s.centered) * 10)
})

onBeforeUnmount(() => cancelAnimationFrame(rafId))
</script>

<template>
  <div class="coverflow" @wheel.prevent="onWheel" @touchstart.passive="onTouchStart" @touchmove.passive="onTouchMove">
    <div
      v-for="(post, i) in posts"
      :key="post.slug"
      class="slot"
      :style="cardStyle(states[i])"
    >
      <PaperCard :post="post" :index="post.index" :focused="Math.abs(states[i].centered) < 0.5" />
    </div>
  </div>
</template>

<style scoped>
.coverflow {
  position: relative;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
  background: var(--bg);
}
.slot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 240px;
  height: 360px;
  will-change: transform, opacity;
}
</style>
