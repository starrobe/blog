<script setup lang="ts">
import { sortAndIndex } from '~/utils/posts'
import type { PaperCardPost } from '~/components/PaperCard.vue'

const { data } = await useAsyncData('home-posts', () =>
  queryCollection('posts').where('hidden', '=', false).all()
)

const posts = computed(() => {
  const raw = (data.value ?? []).map((p: any) => ({
    title: p.title,
    summary: p.summary,
    date: p.date,
    tags: p.tags,
    slug: String(p.path).replace(/^\/posts\//, '')
  }))
  return sortAndIndex<PaperCardPost>(raw)
})

const entered = ref(false)
onMounted(() => {
  requestAnimationFrame(() => { entered.value = true })
})
</script>

<template>
  <div class="home" :class="{ entered }">
    <Coverflow :posts="posts" />
  </div>
</template>

<style scoped>
.home {
  opacity: 0;
  transform: scale(0.96);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.home.entered {
  opacity: 1;
  transform: scale(1);
}
</style>
