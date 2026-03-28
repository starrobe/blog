export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxt/image',
  ],

  content: {
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark',
      },
      langs: ['javascript', 'typescript', 'vue', 'bash', 'json', 'yaml', 'markdown', 'css', 'html'],
    },
  },

  image: {
    quality: 80,
    format: ['webp', 'avif'],
  },

  app: {
    baseURL: process.env.NUXT_PUBLIC_BASE_URL || undefined,
  },

  vite: {
    optimizeDeps: {
      include: [],
    },
  },
})
