export default defineNuxtConfig({
  modules: ['@nuxt/content'],
  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'github-light',
          langs: ['cpp', 'c', 'python', 'bash']
        }
      }
    }
  },
  css: ['~/assets/css/main.css'],
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  }
})
