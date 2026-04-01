<script setup lang="ts">
defineProps<{
  id?: string
  level: 2 | 3 | 4 | 5 | 6
}>()
</script>

<template>
  <component :is="`h${level}`" :id="id">
    <a v-if="id" :href="'#' + id" class="header-anchor" aria-hidden="true">#</a>
    <slot />
  </component>
</template>
