<script setup lang="ts">
defineProps<{ tag: string }>()
</script>

<template>
  <span class="tag-badge">
    {{ tag }}
  </span>
</template>
