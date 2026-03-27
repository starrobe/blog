<script setup lang="ts">
const { effects } = useBackgroundEffects()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

// Canvas refs
const sakuraCanvasRef = ref<HTMLCanvasElement | null>(null)

// Sakura animation
let sakuraAnimationId: number | null = null

// Sakura petal
interface SakuraPetal {
  x: number
  y: number
  size: number
  speed: number
  rotation: number
  rotationSpeed: number
  wobble: number
  wobbleSpeed: number
  alpha: number
  color: string
}

function initSakura(canvas: HTMLCanvasElement) {
  if (!effects.value.sakura) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const petals: SakuraPetal[] = []
  const count = 12

  // Sakura color palette - pink shades
  const colors = isDark.value
    ? ['#ffb7c5', '#ff9eb5', '#ffc8d5', '#ffdae3']
    : ['#ffcdd9', '#ffbcc8', '#ffd1dc', '#ffe0e8']

  for (let i = 0; i < count; i++) {
    petals.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 6 + 4,
      speed: Math.random() * 0.4 + 0.2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.01,
      alpha: Math.random() * 0.5 + 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
    })
  }

  function drawPetal(p: SakuraPetal) {
    if (!ctx) return
    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.rotate(p.rotation)
    ctx.globalAlpha = p.alpha

    // Draw single cherry blossom leaf (elongated oval)
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.ellipse(0, 0, p.size * 0.4, p.size, 0, 0, Math.PI * 2)
    ctx.fill()

    // Leaf vein
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.moveTo(0, -p.size * 0.8)
    ctx.lineTo(0, p.size * 0.8)
    ctx.stroke()

    ctx.restore()
  }

  function draw() {
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    petals.forEach((p) => {
      // Update position - slow falling with wobble
      p.y += p.speed
      p.x += Math.sin(p.wobble) * 0.3
      p.wobble += p.wobbleSpeed
      p.rotation += p.rotationSpeed

      // Reset when off screen
      if (p.y > canvas.height + 20) {
        p.y = -20
        p.x = Math.random() * canvas.width
      }

      drawPetal(p)
    })

    sakuraAnimationId = requestAnimationFrame(draw)
  }

  draw()

  // Handle resize
  const handleResize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  window.addEventListener('resize', handleResize)

  return () => {
    window.removeEventListener('resize', handleResize)
    if (sakuraAnimationId) cancelAnimationFrame(sakuraAnimationId)
  }
}

// Initialize canvas effects on mount
onMounted(() => {
  let cleanupSakura: (() => void) | undefined

  nextTick(() => {
    if (sakuraCanvasRef.value) {
      cleanupSakura = initSakura(sakuraCanvasRef.value)
    }
  })

  onUnmounted(() => {
    cleanupSakura?.()
    if (sakuraAnimationId) cancelAnimationFrame(sakuraAnimationId)
  })
})
</script>

<template>
  <ClientOnly>
    <!-- Noise layer -->
    <div
      v-if="effects.noise"
      class="bg-layer noise-layer"
    />

    <!-- Gradient layer -->
    <div
      v-if="effects.gradient"
      class="bg-layer gradient-layer"
    />

    <!-- Texture layer -->
    <div
      v-if="effects.texture"
      class="bg-layer texture-layer"
    />

    <!-- Sakura layer -->
    <canvas
      v-if="effects.sakura"
      ref="sakuraCanvasRef"
      class="bg-canvas sakura-canvas"
    />
  </ClientOnly>
</template>

<style scoped>
.bg-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.bg-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

/* Noise layer - SVG filter */
.noise-layer {
  z-index: 1;
  opacity: 0.03;
  background: transparent;
}

.noise-layer::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
}

html:not(.dark) .noise-layer {
  opacity: 0.015;
}

/* Gradient layer - radial gradient */
.gradient-layer {
  z-index: 2;
  background: radial-gradient(
    ellipse at 50% 0%,
    rgba(100, 100, 100, 0.08) 0%,
    transparent 60%
  );
}

html.dark .gradient-layer {
  background: radial-gradient(
    ellipse at 50% 0%,
    rgba(60, 60, 60, 0.15) 0%,
    transparent 50%
  );
}

/* Texture layer - subtle grid pattern */
.texture-layer {
  z-index: 3;
  opacity: 0.02;
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 50px,
    rgba(150, 150, 150, 0.1) 50px,
    rgba(150, 150, 150, 0.1) 51px
  ),
  repeating-linear-gradient(
    90deg,
    transparent,
    transparent 50px,
    rgba(150, 150, 150, 0.1) 50px,
    rgba(150, 150, 150, 0.1) 51px
  );
}

html.dark .texture-layer {
  opacity: 0.03;
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 50px,
    rgba(200, 200, 200, 0.08) 50px,
    rgba(200, 200, 200, 0.08) 51px
  ),
  repeating-linear-gradient(
    90deg,
    transparent,
    transparent 50px,
    rgba(200, 200, 200, 0.08) 50px,
    rgba(200, 200, 200, 0.08) 51px
  );
}

/* Sakura canvas */
.sakura-canvas {
  z-index: 4;
}
</style>
