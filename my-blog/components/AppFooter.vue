<template>
  <footer class="footer">
    <div class="footer-content">
      <p>© {{ new Date().getFullYear() }} My Blog. Built with Nuxt 3.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid rgba(125, 125, 125, 0.2);
  padding: 2rem 0;
  margin-top: 4rem;
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