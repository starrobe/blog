<script setup lang="ts">
const showSearch = ref(false)
</script>

<template>
  <div class="site">
    <GrainOverlay />
    <SiteNav @open-search="showSearch = true" />
    <NuxtPage />
  </div>
</template>
