<script setup lang="ts">
import { sortAndIndex } from '~/utils/posts'

const route = useRoute()
const tag = route.params.tag as string

const router = useRouter()
function goBack() {
  // cd ..:返回上一页;若无历史(直接落地此页)则回首页
  if (window.history.length > 1) router.back()
  else router.push('/')
}

const { data } = await useAsyncData(`tag-${tag}`, () =>
  queryCollection('posts').where('hidden', '=', false).all()
)

const posts = computed(() => {
  const list = (data.value ?? [])
    .filter((p: any) => (p.tags ?? []).includes(tag))
    .map((p: any) => ({
      title: p.title,
      date: p.date,
      tags: p.tags,
      summary: p.summary,
      slug: String(p.path).replace(/^\/posts\//, '')
    }))
  return sortAndIndex(list)
})
</script>

<template>
  <div class="tag-page">
    <h1 class="tag-title">#{{ tag }}</h1>
    <ul class="list">
      <li v-for="p in posts" :key="p.slug">
        <NuxtLink :to="`/posts/${p.slug}`">
          <span class="idx">{{ p.index }}</span>
          <span class="t">{{ p.title }}</span>
          <time>{{ p.date }}</time>
        </NuxtLink>
      </li>
    </ul>
    <span class="back">
      <svg class="back-icon" width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M6 3 L11 8 L6 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <a href="#" class="back-link" @click.prevent="goBack">cd ..</a>
    </span>
  </div>
</template>

<style scoped>
.tag-page {
  min-height: 100dvh;
  background: var(--bg);
  color: #ffffff;
  padding: 120px 32px 64px;
  max-width: 640px;
  margin: 0 auto;
}
.tag-title { font-family: var(--font-serif); font-size: 28px; margin-bottom: 32px; }
.list { list-style: none; padding: 0; margin: 0; }
.list li a {
  display: flex;
  gap: 16px;
  align-items: baseline;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
}
.idx { color: var(--grey); font-size: 12px; }
.t { flex: 1; }
time { color: var(--grey); font-size: 12px; }
.back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 32px;
  font-family: var(--font-mono);
  color: #8b949e;
}
.back-icon { flex-shrink: 0; }
.back-link { transition: color 0.2s ease; }
.back-link:hover {
  color: #e6edf3;
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
