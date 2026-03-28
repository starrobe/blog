<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')

function toggle() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <button class="toggle" title="Toggle Color Scheme" @click="toggle">
    <span class="icon-wrapper">
      <!-- Moon icon -->
      <svg v-if="isDark" class="icon moon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
      <!-- Sun icon -->
      <svg v-else class="icon sun" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    </span>
  </button>
</template>

<style scoped>
.toggle {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.toggle:hover {
  opacity: 1;
}

.icon-wrapper {
  position: relative;
  width: 18px;
  height: 18px;
}

.icon {
  position: absolute;
  top: 0;
  left: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.moon {
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
}

.sun {
  opacity: 0;
  transform: rotate(90deg) scale(0.5);
}

:deep(.dark) .moon {
  opacity: 1;
  transform: rotate(0) scale(1);
}

:deep(:not(.dark)) .sun {
  opacity: 1;
  transform: rotate(0) scale(1);
}
</style>
