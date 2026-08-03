<script setup lang="ts">
interface Heading {
  id: string
  text: string
  depth: number
}

const props = defineProps<{
  proseElement?: HTMLElement | null
}>()

const headings = ref<Heading[]>([])
const route = useRoute()

const MAX_RETRIES = 20
let retryCount = 0
let timeoutId: ReturnType<typeof setTimeout> | null = null

/** CJK-friendly slug used only as a fallback when a heading has no id. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '')
    .replace(/-+/g, '-')
}

/** Generate a unique id, appending -1/-2… on collision. */
function generateHeadingId(text: string, used: Set<string>): string {
  const base = slugify(text) || 'heading'
  let id = base
  let n = 1
  while (used.has(id)) {
    id = `${base}-${n++}`
  }
  used.add(id)
  return id
}

/**
 * Extract the heading's visible text, excluding the "#" anchor link that Nuxt
 * Content inserts into headings (its text would otherwise leak into the TOC).
 */
function getHeadingText(el: Element): string {
  const clone = el.cloneNode(true) as HTMLElement
  clone.querySelectorAll('.header-anchor').forEach((anchor) => anchor.remove())
  return clone.textContent?.trim() || ''
}

function clearRetry() {
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
  retryCount = 0
}

function updateHeadings() {
  const prose = props.proseElement
  if (!prose) {
    if (retryCount < MAX_RETRIES) {
      retryCount++
      timeoutId = setTimeout(updateHeadings, 50)
    }
    return
  }

  clearRetry()

  const els = prose.querySelectorAll('h2, h3')
  if (els.length === 0) {
    headings.value = []
    return
  }

  const usedIds = new Set<string>()
  const extracted: Heading[] = []
  els.forEach((el) => {
    const text = getHeadingText(el)
    // Prefer the id already assigned by Nuxt Content; only fall back when missing.
    if (!el.id) {
      el.id = generateHeadingId(text, usedIds)
    } else {
      usedIds.add(el.id)
    }
    extracted.push({
      id: el.id,
      text,
      depth: parseInt(el.tagName[1]),
    })
  })

  headings.value = extracted
}

onMounted(() => {
  nextTick(updateHeadings)
})

onUnmounted(clearRetry)

watch(() => route.path, () => {
  // Cancel any pending retry and clear headings immediately when the route changes
  clearRetry()
  headings.value = []
  nextTick(updateHeadings)
})

watch(() => props.proseElement, () => {
  updateHeadings()
})
</script>

<template>
  <ClientOnly>
    <div v-if="headings.length > 0" class="table-of-contents">
      <div class="table-of-contents-anchor">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <line x1="3" y1="5" x2="21" y2="5"/>
          <line x1="3" y1="12" x2="15" y2="12"/>
          <line x1="3" y1="19" x2="21" y2="19"/>
        </svg>
      </div>
      <ul class="toc-list">
        <li v-for="h in headings" :key="h.id" :class="`toc-h${h.depth}`">
          <a :href="`#${h.id}`">{{ h.text }}</a>
        </li>
      </ul>
    </div>
  </ClientOnly>
</template>

<style scoped>
.table-of-contents {
  position: fixed;
  top: 90px;
  bottom: 0;
  left: 20px;
  z-index: 200;
  overflow: hidden;
  width: 100px;
}

@media (min-width: 1280px) {
  .table-of-contents {
    width: 200px;
  }
}

@media (min-width: 1536px) {
  .table-of-contents {
    width: 300px;
  }
}

.table-of-contents-anchor {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  font-size: 1rem;
  background: var(--c-bg);
  border-radius: 0.375rem;
  color: rgba(136, 136, 136, 0.7);
  border: 1px solid rgba(125, 125, 125, 0.2);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.4s;
  cursor: pointer;
  margin: 0 0.5rem;
}

@media (min-width: 768px) {
  .table-of-contents-anchor {
    border-color: transparent;
    box-shadow: none;
  }
}

.table-of-contents:hover .table-of-contents-anchor {
  color: var(--fg);
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0.25rem 0 0 0;
  text-overflow: ellipsis;
  height: calc(100vh - 120px);
  overflow-y: auto;
  opacity: 0;
  transition: opacity 0.7s;
  padding-bottom: 2rem;
}

.table-of-contents:hover .toc-list {
  opacity: 0.75;
}

.toc-list li {
  padding-left: 0.8rem;
  line-height: 1.5em;
  margin-top: 0.5em;
}

.toc-list li a {
  display: block;
  font-size: 0.8rem;
  color: var(--fg);
  text-decoration: none !important;
  border-bottom: none !important;
  opacity: 0.75;
  transition: opacity 0.2s;
}

.toc-list li a:hover {
  opacity: 1;
}

.toc-h3 {
  padding-left: 1.2rem;
  font-size: 0.75rem;
}

/* Scrollbar */
.toc-list::-webkit-scrollbar {
  width: 4px;
}

.toc-list::-webkit-scrollbar-thumb {
  background: var(--c-scrollbar);
  border-radius: 4px;
}

.toc-list::-webkit-scrollbar-thumb:hover {
  background: var(--c-scrollbar-hover);
}
</style>
