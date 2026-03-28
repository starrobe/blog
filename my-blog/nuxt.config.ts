export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/color-mode',
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

  colorMode: {
    classSuffix: '',
  },

  image: {
    quality: 80,
    format: ['webp', 'avif'],
  },

  app: {
    baseURL: process.env.NUXT_PUBLIC_BASE_URL || undefined,
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://my-blog.vercel.app',
      siteName: 'My Blog',
      siteDescription: 'A personal blog about technology',
    },
  },
})
