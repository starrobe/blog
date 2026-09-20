<script setup lang="ts">
import { bodyToPlainText, readingMinutes } from '~/utils/plaintext'

const route = useRoute()
const slug = route.params.slug as string

const { data: post } = await useAsyncData(`post-${slug}`, () =>
  queryCollection('posts').path(`/posts/${slug}`).where('hidden', '=', false).first()
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: '文章不存在' })
}

const minutes = computed(() => readingMinutes(bodyToPlainText(post.value?.body)))

// SEO:每篇文章独立的标题与描述
useSeoMeta({
  title: `${post.value.title} · BLOG`,
  description: post.value.summary ?? ''
})

// 滚动 reveal 指令
const revealObservers = new WeakMap<HTMLElement, IntersectionObserver>()
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
    revealObservers.set(el, io)
    io.observe(el)
  },
  unmounted(el: HTMLElement) {
    revealObservers.get(el)?.disconnect()
    revealObservers.delete(el)
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
          <span class="tags">
            <NuxtLink
              v-for="tag in (post.tags ?? [])"
              :key="tag"
              :to="`/tags/${tag}`"
              class="tag"
            >{{ tag }}</NuxtLink>
          </span>
        </div>
      </header>
      <div class="body">
        <ContentRenderer :value="post" />
      </div>
      <footer class="foot">
        <NuxtLink to="/" class="back">> cd ..</NuxtLink>
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
  flex-wrap: wrap;
  gap: 16px;
  font-size: 12px;
  color: var(--grey);
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line);
}
.tags {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px 12px;
}
.tag {
  color: var(--grey);
  text-decoration: none;
  transition: color 0.15s ease;
}
.tag:hover {
  color: var(--ink);
  text-decoration: underline;
}
.body {
  margin-top: 24px;
  line-height: 1.8;
  font-size: 16px;
}
.body :deep(h2) { margin-top: 32px; }
.body :deep(pre) { background: #f5f5f5; padding: 14px; overflow-x: auto; }
.body :deep(pre),
.body :deep(code) {
  font-family: var(--font-mono);
}
.foot {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  padding-top: 16px;
  border-top: 1px solid var(--line);
  font-size: 13px;
}
.back {
  font-family: var(--font-mono);
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
