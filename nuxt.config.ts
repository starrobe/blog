export default defineNuxtConfig({
  modules: ['@nuxt/content'],
  content: {
    build: {
      markdown: {
        remarkPlugins: {
          'remark-math': {}
        },
        rehypePlugins: {
          'rehype-katex': {}
        },
        highlight: {
          theme: 'github-dark',
          langs: ['cpp', 'c', 'python', 'bash']
        }
      }
    }
  },
  css: ['~/assets/css/main.css', 'katex/dist/katex.min.css'],
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  }
})
