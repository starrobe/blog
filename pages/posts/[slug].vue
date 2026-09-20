<script setup lang="ts">
import { bodyToPlainText, readingMinutes } from '~/utils/plaintext'
import { sortAndIndex } from '~/utils/posts'

const route = useRoute()
const slug = route.params.slug as string

const { data: post } = await useAsyncData(`post-${slug}`, () =>
  queryCollection('posts').path(`/posts/${slug}`).where('hidden', '=', false).first()
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: '文章不存在' })
}

const minutes = computed(() => readingMinutes(bodyToPlainText(post.value?.body)))
const plain = computed(() => bodyToPlainText(post.value?.body))

// 上一篇/下一篇:基于同一排序
const { data: all } = await useAsyncData('post-all', () =>
  queryCollection('posts').where('hidden', '=', false).all()
)
const siblings = computed(() => {
  const list = sortAndIndex((all.value ?? []).map((p: any) => ({
    title: p.title,
    date: p.date,
    slug: String(p.path).replace(/^\/posts\//, '')
  })))
  const i = list.findIndex((p: any) => p.slug === slug)
  return {
    prev: i > 0 ? list[i - 1] : null,
    next: i >= 0 && i < list.length - 1 ? list[i + 1] : null
  }
})

// 滚动 reveal 指令
const vReveal = {
  mounted(el: HTMLElement) {
    el.classList.add('reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('reveal-visible')
            io.unobserve(el)
          }
        })
      },
      { threshold: 0.1 }
    )
    io.observe(el)
  }
}
</script>

<template>
  <article class="article">
    <div class="paper" v-reveal :style="{ viewTransitionName: `card-${slug}` }">
      <header class="paper-head">
        <h1 class="title">{{ post.title }}</h1>
        <div class="meta">
          <time>{{ post.date }}</time>
          <span>{{ minutes }} 分钟</span>
          <span class="tags">{{ (post.tags ?? []).join(' · ') }}</span>
        </div>
      </header>
      <div class="body">
        <ContentRenderer :value="post" />
      </div>
      <footer class="foot">
        <NuxtLink v-if="siblings.prev" :to="`/posts/${siblings.prev.slug}`">← {{ siblings.prev.title }}</NuxtLink>
        <NuxtLink v-else to="/">返回首页</NuxtLink>
        <NuxtLink v-if="siblings.next" :to="`/posts/${siblings.next.slug}`">{{ siblings.next.title }} →</NuxtLink>
      </footer>
    </div>
  </article>
</template>

<style scoped>
.article {
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  padding: 96px 16px 64px;
  background: var(--bg);
}
.paper {
  width: 100%;
  max-width: 680px;
  background: var(--paper);
  color: var(--ink);
  padding: 48px 48px;
  border-radius: 2px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
}
.title {
  font-family: var(--font-serif);
  font-size: 32px;
  margin: 0 0 16px;
  line-height: 1.3;
}
.meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--grey);
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line);
}
.body {
  margin-top: 24px;
  line-height: 1.8;
  font-size: 16px;
}
.body :deep(h2) { margin-top: 32px; }
.body :deep(pre) { background: #f5f5f5; padding: 14px; overflow-x: auto; }
.foot {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  padding-top: 16px;
  border-top: 1px solid var(--line);
  font-size: 13px;
}
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
