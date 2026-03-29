<script setup lang="ts">
const code = 'printf("Hello World!");'
const displayText = ref('')
const isDeleting = ref(false)
let timer: ReturnType<typeof setTimeout>

function type() {
  if (!isDeleting.value) {
    displayText.value = code.slice(0, displayText.value.length + 1)
    if (displayText.value === code) {
      isDeleting.value = true
      timer = setTimeout(type, 2000)
      return
    }
  } else {
    displayText.value = code.slice(0, displayText.value.length - 1)
    if (displayText.value === '') {
      isDeleting.value = false
      timer = setTimeout(type, 500)
      return
    }
  }
  timer = setTimeout(type, isDeleting.value ? 50 : 100)
}

onMounted(() => {
  timer = setTimeout(type, 500)
})

onUnmounted(() => {
  clearTimeout(timer)
})
</script>

<template>
  <div class="typewriter">
    <code>{{ displayText }}<span class="cursor">&nbsp;</span></code>
  </div>
</template>

<style scoped>
.typewriter {
  margin-top: 1.5rem;
  font-family: 'DM Mono', 'Input Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 0.9rem;
  color: var(--fg-light);
}

.cursor {
  background-color: var(--fg-light);
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  50.01%, 100% { opacity: 0; }
}
</style>
