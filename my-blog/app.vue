<template>
  <NuxtLayout>
    <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
  </NuxtLayout>
  <BackgroundEffects />
</template>

<style>
@import '~/assets/css/main.css';
</style>
