<script setup lang="ts">
import { bodyToPlainText } from '~/utils/plaintext'

const open = defineModel<boolean>({ default: false })
const q = ref('')

const { data } = await useAsyncData('search-index', () =>
  queryCollection('posts').where('hidden', '=', false).all()
)

const index = computed(() =>
  (data.value ?? []).map((p: any) => ({
    title: p.title,
    summary: p.summary,
    tags: p.tags ?? [],
    slug: String(p.path).replace(/^\/posts\//, ''),
    text: bodyToPlainText(p.body)
  }))
)

const results = computed(() => {
  const k = q.value.trim().toLowerCase()
  if (!k) return []
  return index.value.filter((p) =>
    [p.title, p.summary, p.tags.join(' '), p.text].join(' ').toLowerCase().includes(k)
  ).slice(0, 10)
})

function onSelect() {
  q.value = ''
  open.value = false
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="overlay" @click.self="open = false">
      <div class="modal">
        <input v-model="q" class="input" placeholder="搜索文章…" autofocus />
        <ul class="results">
          <li v-for="p in results" :key="p.slug">
            <NuxtLink :to="`/posts/${p.slug}`" @click="onSelect">
              <span class="rt">{{ p.title }}</span>
              <span class="rs">{{ p.summary }}</span>
            </NuxtLink>
          </li>
          <li v-if="q && results.length === 0" class="empty">无结果</li>
        </ul>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  padding-top: 12vh;
}
.modal {
  width: 100%;
  max-width: 560px;
  height: fit-content;
  background: var(--paper);
  border-radius: 2px;
  padding: 16px;
}
.input {
  width: 100%;
  padding: 12px 14px;
  font-size: 16px;
  border: 1px solid var(--line);
  border-radius: 2px;
}
.results { list-style: none; margin: 12px 0 0; padding: 0; }
.results li a {
  display: block;
  padding: 10px 4px;
  border-bottom: 1px solid #eee;
}
.rt { font-weight: 600; display: block; }
.rs { font-size: 12px; color: var(--grey); }
.empty { padding: 12px 4px; color: var(--grey); font-size: 13px; }
</style>
