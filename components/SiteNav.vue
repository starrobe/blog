<script setup lang="ts">
const emit = defineEmits<{ openSearch: [] }>()
</script>

<template>
  <header class="nav">
    <NuxtLink to="/" class="brand">BLOG</NuxtLink>
    <button class="search-btn" @click="emit('openSearch')">搜索</button>
  </header>
</template>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 32px;
  color: #ffffff;
  background: linear-gradient(to bottom, rgba(10, 10, 10, 0.7), transparent);
}
.brand {
  font-family: var(--font-serif);
  letter-spacing: 0.2em;
  font-weight: 700;
}
.search-btn {
  color: #ffffff;
  opacity: 0.7;
  transition: opacity 0.2s;
}
.search-btn:hover { opacity: 1; }
</style>
