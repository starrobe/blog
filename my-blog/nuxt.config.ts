import { remarkMath } from 'remark-math'
import { rehypeKatex } from 'rehype-katex'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxt/image',
  ],

  content: {
    build: {
      markdown: {
        remarkPlugins: {
          'remark-math': { instance: remarkMath },
        },
        rehypePlugins: {
          'rehype-katex': { instance: rehypeKatex },
        },
      },
    },
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark',
      },
      langs: ['javascript', 'typescript', 'vue', 'bash', 'json', 'yaml', 'markdown', 'css', 'html'],
    },
    components: {
      prose: true,
    },
    renderer: {
      anchorLinks: {
        h1: false,
        h2: true,
        h3: true,
        h4: true,
      },
    },
  },

  css: ['katex/dist/katex.min.css'],

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
