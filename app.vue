<template>
  <div class="site">
    <GrainOverlay />
    <NuxtLink to="/" class="logo" aria-label="回到首页">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path class="logo-path" d="M10 7 L20 16 L10 25" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </NuxtLink>
    <NuxtPage />
  </div>
</template>
