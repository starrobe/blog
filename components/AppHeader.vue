<script setup lang="ts">
const scroll = ref(0)

const handleScroll = () => {
  scroll.value = window.scrollY
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <header class="header">
    <NuxtLink to="/" class="logo" focusable="false">
      <Logo />
    </NuxtLink>

    <button
      aria-label="Scroll to top"
      title="Scroll to top"
      class="scroll-top-btn"
      :class="scroll > 300 ? 'visible' : 'hidden'"
      @click="toTop"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"/>
        <polyline points="5 12 12 5 19 12"/>
      </svg>
    </button>

    <nav class="nav">
      <div class="right">
        <NuxtLink to="/blog" title="Blog">
          Blog
        </NuxtLink>
        <ThemeToggle />
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header {
  position: relative;
  display: flex;
  align-items: center;
}

.logo {
  position: fixed;
  left: 1.25rem;
  top: 1.25rem;
  z-index: 50;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border: none;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.logo:hover {
  opacity: 1;
}

.nav {
  width: 100%;
  padding: 2rem;
  display: flex;
  justify-content: flex-end;
}

.nav .right {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.nav a {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  opacity: 0.6;
  transition: opacity 0.2s ease;
  border: none;
}

.nav a:hover {
  opacity: 1;
}

.scroll-top-btn {
  position: fixed;
  right: 0.75rem;
  bottom: 0.75rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s, background-color 0.2s;
  color: var(--fg);
  z-index: 100;
}

.scroll-top-btn:hover {
  background-color: rgba(125, 125, 125, 0.15);
}

.scroll-top-btn.visible {
  opacity: 0.7;
  pointer-events: auto;
}

.scroll-top-btn.hidden {
  opacity: 0;
  pointer-events: none;
}

/* Responsive */
@media (max-width: 768px) {
  .logo {
    left: 1rem;
    top: 1rem;
    width: 2.5rem;
    height: 2.5rem;
  }

  .nav {
    padding: 1.5rem 1rem;
  }

  .nav .right {
    gap: 1rem;
  }

  .hide-mobile {
    display: none;
  }
}
</style>
