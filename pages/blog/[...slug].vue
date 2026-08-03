<script setup lang="ts">
const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug
const parentPath = useParentPath()

const { data: post } = await useAsyncData(`post-${slug}`, () =>
  queryCollection('blog')
    .where('path', '=', `/blog/${slug}`)
    .first()
)

const { data: homeData } = await useAsyncData('home', () =>
  queryCollection('home').first()
)

if (!post.value) {
  throw createError({ statusCode: 404, message: 'Post not found' })
}

const config = useRuntimeConfig()

useSeoMeta({
  title: () => post.value?.title ? `${post.value.title} | Blog` : 'Blog',
  description: () => post.value?.description,
  ogTitle: () => post.value?.title,
  ogDescription: () => post.value?.description,
})

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.value?.title,
      datePublished: post.value?.date,
      description: post.value?.description,
      author: {
        '@type': 'Person',
        name: homeData.value?.name ?? '阿东',
      },
      url: `${config.public.siteUrl}/blog/${slug}`,
    }),
  }],
})

const proseRef = ref<HTMLElement | null>(null)
</script>

<template>
  <article v-if="post" class="page-container slide-enter-content">
    <TableOfContents :prose-element="proseRef" />
    <header>
      <h1>{{ post.title }}</h1>
      <div class="meta">
        <time v-if="post.date">{{ post.date }}</time>
        <div v-if="post.tags" class="tags">
          <TagBadge v-for="tag in post.tags" :key="tag" :tag="tag" />
        </div>
      </div>
    </header>

    <div ref="proseRef" class="prose">
      <ContentRenderer :value="post" />
    </div>

    <div class="cd-link">
      <span class="prompt">> </span>
      <NuxtLink :to="parentPath">
        cd ..
      </NuxtLink>
    </div>
  </article>
</template>
