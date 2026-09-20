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
      { threshold: 0 }
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
  color: var(--ink);
}

/* 段落 */
.body :deep(p) { margin: 0 0 1.25em; }

/* 标题:上方大留白、下方紧凑 */
.body :deep(h2) {
  font-family: var(--font-serif);
  font-size: 1.5em;
  line-height: 1.4;
  margin: 2em 0 0.75em;
}
.body :deep(h3) {
  font-family: var(--font-serif);
  font-size: 1.25em;
  line-height: 1.4;
  margin: 1.75em 0 0.6em;
}
.body :deep(h4),
.body :deep(h5),
.body :deep(h6) {
  font-family: var(--font-serif);
  line-height: 1.4;
  margin: 1.5em 0 0.5em;
}

/* 列表 */
.body :deep(ul),
.body :deep(ol) {
  margin: 0 0 1.25em;
  padding-left: 1.5em;
}
.body :deep(li) { margin: 0.3em 0; }
.body :deep(li > p) { margin: 0; }

/* 引用块 */
.body :deep(blockquote) {
  margin: 1.5em 0;
  padding: 0.25em 0 0.25em 1.25em;
  border-left: 2px solid var(--line);
  color: var(--grey);
}

/* 代码块 */
.body :deep(pre) {
  margin: 1.5em 0;
  background: #f5f5f5;
  padding: 14px;
  border-radius: 2px;
  overflow-x: auto;
  font-size: 0.9em;
  line-height: 1.6;
}
.body :deep(pre),
.body :deep(code) {
  font-family: var(--font-mono);
}
.body :deep(pre code) {
  background: none;
  padding: 0;
  font-size: inherit;
}

/* 行内代码 */
.body :deep(code) {
  background: #f0f0f0;
  padding: 0.1em 0.35em;
  border-radius: 2px;
  font-size: 0.9em;
}

/* 分割线 */
.body :deep(hr) {
  border: none;
  border-top: 1px solid var(--line);
  margin: 2em 0;
}

/* 链接 */
.body :deep(a) {
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* 标题内的锚点链接不下划线 */
.body :deep(h2 a),
.body :deep(h3 a),
.body :deep(h4 a),
.body :deep(h5 a),
.body :deep(h6 a) {
  text-decoration: none;
}

/* 图片 */
.body :deep(img) {
  max-width: 100%;
  border-radius: 2px;
}

/* 表格 */
.body :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1.5em 0;
}
.body :deep(th),
.body :deep(td) {
  border: 1px solid var(--line);
  padding: 8px 12px;
  text-align: left;
}
.body :deep(th) { font-weight: 600; }

/* 强调 */
.body :deep(strong) { font-weight: 600; }
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
