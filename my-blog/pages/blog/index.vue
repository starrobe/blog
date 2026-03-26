<script setup lang="ts">
const { data: posts } = await useAsyncData('posts', () =>
  queryCollection('blog')
    .order('date', 'DESC')
    .all()
)

useSeoMeta({
  title: 'Blog',
  description: 'Blog posts',
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

const getYear = (date: string) => new Date(date).getFullYear()

function isSameYear(a?: string, b?: string) {
  if (!a || !b) return false
  return getYear(a) === getYear(b)
}
</script>

<template>
  <div class="page-container">
    <ul v-if="posts?.length" class="post-list slide-enter-content">
      <template v-for="(post, idx) in posts" :key="post.path">
        <div
          v-if="!isSameYear(post.date, posts[idx - 1]?.date)"
          class="year-marker"
          :style="{ '--enter-stage': idx }"
        >
          <span class="year-text">{{ getYear(post.date) }}</span>
        </div>
        <li class="post-item" :style="{ '--enter-stage': idx }">
          <NuxtLink :to="post.path" class="post-link">
            <div class="title-row">
              <span class="title">{{ post.title }}</span>
            </div>
            <div class="meta-row">
              <span class="date">{{ formatDate(post.date) }}</span>
              <span v-if="post.description" class="description">{{ post.description }}</span>
            </div>
          </NuxtLink>
        </li>
      </template>
    </ul>

    <p v-else class="empty">No posts yet.</p>
  </div>
</template>

<style scoped>
.post-list {
  list-style: none;
  padding: 2rem 0;
  margin: 0;
}

.year-marker {
  position: relative;
  height: 5rem;
  pointer-events: none;
  margin-top: 1rem;
  animation: slide-enter 1s both 1;
  animation-delay: calc(60ms * var(--enter-stage));
}

.year-text {
  position: absolute;
  left: -3rem;
  top: -2rem;
  font-size: 8em;
  font-weight: 700;
  color: transparent;
  -webkit-text-stroke: 2px #aaa;
  opacity: 0.1;
}

.post-item {
  margin-bottom: 0.5rem;
  animation: slide-enter 1s both 1;
  animation-delay: calc(60ms * var(--enter-stage));
}

.post-link {
  display: block;
  text-decoration: none;
  border: none;
  margin-bottom: 0.5rem;
  padding: 0.75rem 0;
  transition: opacity 0.2s;
}

.post-link:hover {
  opacity: 0.6;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title {
  font-size: 1.125rem;
  font-weight: 400;
  color: var(--fg);
  line-height: 1.2;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--fg-light);
}

.date {
  opacity: 0.5;
  white-space: nowrap;
}

.description {
  opacity: 0.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty {
  color: var(--fg-light);
  padding: 2rem 0;
}

@media (max-width: 768px) {
  .year-marker {
    height: 3rem;
  }

  .year-text {
    font-size: 3rem;
    left: 0;
    top: -0.5rem;
  }
}
</style>
