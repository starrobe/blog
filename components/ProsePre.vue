<script setup lang="ts">
defineProps<{
  code?: string
}>()

const copied = ref(false)
const preRef = ref<HTMLPreElement | null>(null)

async function copyCode() {
  if (!preRef.value) return
  const code = preRef.value.textContent || ''
  try {
    await navigator.clipboard.writeText(code)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<template>
  <div class="code-block-wrapper">
    <pre ref="preRef" :class="$props.class"><slot /></pre>
    <button
      :aria-label="copied ? 'Code copied to clipboard' : 'Copy code to clipboard'"
      :title="copied ? 'Copied!' : 'Copy code'"
      :class="{ copied }"
      class="copy-btn"
      @click="copyCode"
    >
      <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span v-if="copied" class="copy-text">Copied!</span>
    </button>
  </div>
</template>

<style scoped>
.code-block-wrapper {
  position: relative;
}

.code-block-wrapper pre {
  margin: 1em 0;
}

.copy-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.4rem;
  border-radius: 0.375rem;
  background: transparent;
  border: none;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s, background-color 0.2s;
  color: var(--fg-light);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.code-block-wrapper:hover .copy-btn {
  opacity: 0.6;
}

.copy-btn:hover {
  opacity: 1 !important;
  background-color: rgba(125, 125, 125, 0.15);
}

.copy-btn.copied {
  opacity: 1;
  color: var(--fg-light);
}

.copy-text {
  font-size: 0.75rem;
  font-family: 'DM Mono', 'Input Mono', 'Fira Code', ui-monospace, monospace;
}
</style>
