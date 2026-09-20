<script setup lang="ts">
export interface PaperCardPost {
  title: string
  summary: string
  date: string
  tags: string[]
  slug: string
}

const props = defineProps<{
  post: PaperCardPost
  index: string
  focused?: boolean
}>()

const href = computed(() => `/posts/${props.post.slug}`)

function onClick(e: MouseEvent) {
  if (!document.startViewTransition) return
  e.preventDefault()
  document.startViewTransition(() => navigateTo(href.value))
}
</script>

<template>
  <NuxtLink
    :to="href"
    class="paper"
    :class="{ focused }"
    :style="{ viewTransitionName: `card-${post.slug}` }"
    @click="onClick"
  >
    <div class="paper-head">
      <span class="file-no">No. {{ index }}</span>
      <span class="paper-line"></span>
    </div>
    <h3 class="paper-title">{{ post.title }}</h3>
    <p class="paper-summary">{{ post.summary }}</p>
    <div class="paper-foot">
      <span class="paper-line"></span>
      <div class="paper-meta">
        <time>{{ post.date }}</time>
        <span class="tags">{{ post.tags.join(' · ') }}</span>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.paper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: var(--paper);
  color: var(--ink);
  border: 1px solid #111;
  border-radius: 2px;
  padding: 18px 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.paper:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.7);
}
.paper-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}
.file-no {
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--grey);
}
.paper-line {
  flex: 1;
  height: 1px;
  background: var(--line);
}
.paper-title {
  font-family: var(--font-serif);
  font-size: 20px;
  line-height: 1.3;
  margin: 0 0 10px;
}
.paper-summary {
  font-size: 12px;
  line-height: 1.6;
  color: var(--grey);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.paper-foot {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.paper-meta {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--grey);
}
.tags { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
