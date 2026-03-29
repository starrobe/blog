<template>
  <footer class="footer">
    <div class="footer-content">
      <p>© {{ new Date().getFullYear() }} Adon</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
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