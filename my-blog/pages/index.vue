<script setup lang="ts">
const { data: page } = await useAsyncData('about', () =>
  queryCollection('about')
    .first()
)

useSeoMeta({
  title: 'About',
  description: 'About me',
})
</script>

<template>
  <div v-if="page" class="page-container slide-enter-content">
    <header>
      <h1>About</h1>
    </header>
    <div class="prose">
      <ContentRenderer :value="page" />
    </div>
  </div>
</template>

<style scoped>
header {
  padding: 3rem 0 1.5rem;
  border-bottom: 1px solid rgba(125, 125, 125, 0.15);
}
</style>
