<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug

const { data: post } = await useAsyncData(`post-${slug}`, () =>
  queryCollection('blog')
    .where('path', '=', `/blog/${slug}`)
    .first()
)

if (!post.value) {
  throw createError({ statusCode: 404, message: 'Post not found' })
}

useSeoMeta({
  title: post.value.title,
  description: post.value.description,
  ogTitle: post.value.title,
  ogDescription: post.value.description,
  ogImage: post.value.image,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <article v-if="post" class="page-container slide-enter-content">
    <TableOfContents :body="post.body" />
    <header>
      <h1>{{ post.title }}</h1>
      <div class="meta">
        <time v-if="post.date">{{ post.date }}</time>
        <div v-if="post.tags" class="tags">
          <TagBadge v-for="tag in post.tags" :key="tag" :tag="tag" />
        </div>
      </div>
    </header>

    <div class="prose">
      <ContentRenderer :value="post" />
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
