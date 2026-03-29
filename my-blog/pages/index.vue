<script setup lang="ts">
const { data: about } = await useAsyncData('about', () =>
  queryCollection('home').first()
)
</script>

<template>
  <article v-if="about" class="page-container slide-enter-content">
    <header>
      <h1>{{ about.title }}</h1>
    </header>
    <div class="prose">
      <ContentRenderer :value="about" />
    </div>
  </article>
</template>

<style scoped>
header {
  padding: 3rem 0 1.5rem;
  border-bottom: 1px solid rgba(125, 125, 125, 0.15);
  margin-bottom: 2rem;
}
</style>
