<script setup lang="ts">
defineProps<{
  post: {
    path: string
    title: string
    description?: string
    date?: string
    tags?: string[]
  }
}>()
</script>

<template>
  <NuxtLink
    :to="post.path"
    class="post-card"
  >
    <h2>
      {{ post.title }}
    </h2>
    <p v-if="post.description">
      {{ post.description }}
    </p>
    <div class="meta">
      <time v-if="post.date">{{ post.date }}</time>
      <div v-if="post.tags" class="tags">
        <TagBadge v-for="tag in post.tags" :key="tag" :tag="tag" />
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.tags {
  display: flex;
  gap: 0.5rem;
}
</style>
