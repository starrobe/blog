<script setup lang="ts">
import { computeCoverflowClones, type CoverflowItem } from '~/utils/coverflow'
import type { PaperCardPost } from './PaperCard.vue'

const props = defineProps<{ posts: Array<PaperCardPost & { index: string }> }>()

const orientation = ref<'vertical' | 'horizontal'>('vertical')
function setOrientation(v: 'vertical' | 'horizontal') {
  if (orientation.value === v) return
  orientation.value = v
  updateSpan()
}

const CARD_W = 312
const CARD_H = 468
const SPACING = CARD_H + 40
const LERP = 0.12
const SNAP_DELAY = 800   // 滚动停止判定时长(ms)

// 卡片尺寸唯一来源:JS 常量,经 CSS 变量传给 .slot(见 template 的 :style)。
const cardVars = { '--card-w': `${CARD_W}px`, '--card-h': `${CARD_H}px` }

const current = ref(0)   // 当前渲染的滚动位置(平滑后)
const target = ref(0)    // 滚动目标(滚轮/触摸累积)
let rafId = 0
let snapTimer: ReturnType<typeof setTimeout> | undefined

function startTick() {
  if (!rafId) rafId = requestAnimationFrame(tick)
}

function tick() {
  current.value += (target.value - current.value) * LERP
  if (Math.abs(target.value - current.value) > 0.0005) {
    rafId = requestAnimationFrame(tick)
  } else {
    rafId = 0
  }
}

// 滚轮没有「结束」事件,只能靠静默时长判定停止后吸附;触摸则在 touchend 时吸附(见 onTouchEnd)。
function scheduleSnap() {
  if (snapTimer) clearTimeout(snapTimer)
  snapTimer = setTimeout(() => {
    snapTimer = undefined
    target.value = Math.round(target.value)
    startTick()
  }, SNAP_DELAY)
}

function onWheel(e: WheelEvent) {
  target.value += e.deltaY / SPACING
  scheduleSnap()
  startTick()
}

let touchStartX = 0
let touchStartY = 0
function onTouchStart(e: TouchEvent) {
  // 清掉可能由滚轮挂起的吸附定时器,避免触摸途中被触发。
  if (snapTimer) {
    clearTimeout(snapTimer)
    snapTimer = undefined
  }
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
  startTick()
}
function onTouchEnd() {
  // 触摸释放即吸附到最近卡片,不依赖定时器,避免慢速滑动中途被强行回正。
  target.value = Math.round(target.value)
  startTick()
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

// 卡片定位:translateY 排布 + 缩放,滚动时由 JS lerp 驱动,不加 CSS 过渡(避免与滚动冲突)
const positionStyle = (s: CoverflowItem) => ({
  transform: `translate(-50%, -50%) translateY(${s.centered * SPACING}px) scale(${s.scale})`,
  opacity: s.opacity,
  zIndex: Math.round(100 - Math.abs(s.centered) * 10)
})

// 容器旋转与卡片反向旋转:两者都用 :style 驱动(同一批响应式更新),保证 transition 同步,
// 使卡片在旋转动画的每一帧都保持垂直。
const coverflowTransform = computed(() => `rotate(${orientation.value === 'horizontal' ? -90 : 0}deg)`)
const rotationStyle = computed(() => ({
  transform: `rotate(${orientation.value === 'horizontal' ? 90 : 0}deg)`
}))

onMounted(() => {
  updateSpan()
  window.addEventListener('resize', updateSpan)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  if (snapTimer) clearTimeout(snapTimer)
  window.removeEventListener('resize', updateSpan)
})
</script>

<template>
  <div class="coverflow-wrap" :style="cardVars">
    <div
      class="coverflow"
      :style="{ transform: coverflowTransform }"
      @wheel.prevent="onWheel"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend.passive="onTouchEnd"
      @touchcancel.passive="onTouchEnd"
    >
      <div
        v-for="c in clones"
        :key="`${posts[c.index].slug}-${c.cloneId}`"
        class="slot"
        :style="positionStyle(c)"
      >
        <div class="slot-rotator" :style="rotationStyle">
          <PaperCard :post="posts[c.index]" :index="posts[c.index].index" :focused="Math.abs(c.centered) < 0.5" />
        </div>
      </div>
    </div>
    <div class="toggle-group">
      <a href="#" class="toggle-item" :class="{ active: orientation === 'vertical' }" @click.prevent="setOrientation('vertical')">Vertical</a>
      <a href="#" class="toggle-item" :class="{ active: orientation === 'horizontal' }" @click.prevent="setOrientation('horizontal')">Horizontal</a>
    </div>
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
.toggle-group {
  position: fixed;
  left: 28px;
  bottom: 28px;
  z-index: 45;
  display: flex;
  gap: 16px;
}
.toggle-item {
  color: var(--grey);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  transition: color 0.2s ease;
}
.toggle-item:hover {
  color: #cccccc;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.toggle-item.active {
  color: #ffffff;
}
.slot {
  position: absolute;
  top: 50%;
  left: 50%;
  /* 尺寸由 JS 常量 CARD_W/CARD_H 经 --card-w/--card-h 注入(见 script 的 cardVars) */
  width: var(--card-w);
  height: var(--card-h);
  will-change: transform, opacity;
}
.slot-rotator {
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}
</style>
