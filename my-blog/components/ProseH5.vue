<script setup lang="ts">
defineProps<{
  id?: string
}>()
</script>

<template>
  <h5 :id="id">
    <a v-if="id" :href="'#' + id" class="header-anchor" aria-hidden="true">#</a>
    <slot />
  </h5>
</template>
