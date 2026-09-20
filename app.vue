<script setup lang="ts">
// 描边动画:获取 path 实际长度,写入 CSS 变量供动画使用
onMounted(() => {
  const path = document.querySelector<SVGPathElement>('.logo-path')
  if (path) {
    path.style.setProperty('--len', `${path.getTotalLength()}`)
  }
})
</script>

<template>
  <div class="site">
    <GrainOverlay />
    <NuxtLink to="/" class="logo" aria-label="回到首页">
      <svg class="logo-svg" viewBox="0 0 640 400" fill="none">
        <g transform="translate(0,400) scale(0.1,-0.1)">
          <path
            class="logo-path"
            d="M2899 2494 c-36 -35 -63 -74 -94 -139 -39 -80 -102 -274 -119 -363 -12 -69 41 -135 122 -148 47 -7 120 14 199 57 45 25 56 27 77 17 21 -9 36 -7 82 11 70 26 74 26 74 -3 0 -34 -10 -56 -26 -56 -7 0 -18 -10 -25 -21 -9 -18 -7 -27 10 -50 18 -24 21 -42 21 -126 0 -54 3 -122 6 -150 6 -50 8 -53 35 -53 25 0 29 4 41 58 7 31 13 101 13 154 l0 97 130 47 c201 73 275 114 275 155 0 32 -18 30 -64 -5 -61 -46 -155 -81 -328 -120 -26 -6 -28 -4 -28 26 0 18 20 91 45 163 50 143 55 194 25 243 -26 42 -57 56 -93 43 -37 -14 -121 -93 -173 -164 -35 -47 -44 -69 -50 -115 l-6 -58 -72 -38 c-66 -35 -78 -38 -121 -33 -58 8 -85 30 -85 70 0 22 15 46 64 98 107 116 170 261 164 381 -3 56 -5 63 -25 66 -16 2 -38 -11 -74 -44z m11 -159 c-20 -59 -88 -176 -111 -190 -12 -8 48 162 74 205 53 91 70 84 37 -15z m410 -95 c0 -16 -10 -55 -22 -87 -39 -107 -93 -172 -144 -176 -28 -2 -29 0 -32 45 -5 79 12 120 71 170 103 87 127 96 127 48z"
            stroke="currentColor"
            stroke-width="30"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
      </svg>
    </NuxtLink>
    <NuxtPage />
  </div>
</template>
