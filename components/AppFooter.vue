<script setup lang="ts">
const { data: homeData } = await useAsyncData('footer-home', () =>
  queryCollection('home').first()
)

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <p>© {{ year }} {{ homeData?.name ?? 'Adon' }}</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 2rem 0;
}

.footer-content {
  max-width: 65ch;
  margin: 0 auto;
  padding: 0 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: rgba(136, 136, 136, 0.8);
}
</style>