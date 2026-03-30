<script setup lang="ts">
defineProps<{
  id?: string
}>()
</script>

<template>
  <h2 :id="id">
    <a v-if="id" :href="'#' + id" class="header-anchor" aria-hidden="true">#</a>
    <slot />
  </h2>
</template>
