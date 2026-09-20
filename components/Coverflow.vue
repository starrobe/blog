<script setup lang="ts">
import { computeCoverflowClones, type CoverflowItem } from '~/utils/coverflow'
import type { PaperCardPost } from './PaperCard.vue'

const props = defineProps<{ posts: Array<PaperCardPost & { index: string }> }>()

const orientation = ref<'vertical' | 'horizontal'>('vertical')
function toggleOrientation() {
  orientation.value = orientation.value === 'vertical' ? 'horizontal' : 'vertical'
  updateSpan()
}

const CARD_W = 240
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

let touchStartX = 0
let touchStartY = 0
function onTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
}
function onTouchMove(e: TouchEvent) {
  const t = e.touches[0]
  if (orientation.value === 'horizontal') {
    // 水平模式:容器逆时针旋转 90°,左右滑动对应前进/后退。
    const dx = t.clientX - touchStartX
    touchStartX = t.clientX
    target.value += dx / SPACING
  } else {
    const dy = t.clientY - touchStartY
    touchStartY = t.clientY
    target.value += dy / SPACING
  }
  if (!rafId) rafId = requestAnimationFrame(tick)
}

// 可见范围:卡片完整滚出屏幕所需的最大 centered(按当前排布方向的视口尺寸)
const span = ref(3)
function updateSpan() {
  if (typeof window === 'undefined') return
  const size = orientation.value === 'vertical' ? window.innerHeight : window.innerWidth
  const cardHalf = orientation.value === 'vertical' ? CARD_H / 2 : CARD_W / 2
  span.value = Math.ceil((size / 2 + cardHalf) / SPACING)
}

const clones = computed(() => computeCoverflowClones(props.posts.length, current.value, span.value))

const cardStyle = (s: CoverflowItem) => {
  // 水平模式:容器整体 rotate(-90deg) 排布,卡片反向 rotate(90deg) 抵消,保持内容正向。
  const rotation = orientation.value === 'horizontal' ? 90 : 0
  return {
    transform: `translate(-50%, -50%) translateY(${s.centered * SPACING}px) rotate(${rotation}deg) scale(${s.scale})`,
    opacity: s.opacity,
    zIndex: Math.round(100 - Math.abs(s.centered) * 10)
  }
}

onMounted(() => {
  updateSpan()
  window.addEventListener('resize', updateSpan)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', updateSpan)
})
</script>

<template>
  <div class="coverflow-wrap">
    <div
      class="coverflow"
      :class="{ horizontal: orientation === 'horizontal' }"
      @wheel.prevent="onWheel"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
    >
      <div
        v-for="c in clones"
        :key="`${posts[c.index].slug}-${c.cloneId}`"
        class="slot"
        :style="cardStyle(c)"
      >
        <PaperCard :post="posts[c.index]" :index="posts[c.index].index" :focused="Math.abs(c.centered) < 0.5" />
      </div>
    </div>
    <button class="toggle" @click="toggleOrientation">{{ orientation === 'vertical' ? '⟲ 横向' : '⟳ 纵向' }}</button>
  </div>
</template>

<style scoped>
.coverflow-wrap {
  position: relative;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
}
.coverflow {
  position: absolute;
  inset: 0;
  background: var(--bg);
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.coverflow.horizontal {
  /* 垂直 → 水平:逆时针 90°(不缩放,保持与垂直模式相同的卡片尺寸与间距) */
  transform: rotate(-90deg);
}
.toggle {
  position: fixed;
  bottom: 24px;
  right: 28px;
  z-index: 45;
  color: #ffffff;
  opacity: 0.6;
  border: 1px solid #444;
  padding: 8px 14px;
  border-radius: 2px;
  transition: opacity 0.2s;
}
.toggle:hover { opacity: 1; }
.slot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 240px;
  height: 360px;
  will-change: transform, opacity;
}
</style>
