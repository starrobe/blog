import { readdirSync, readFileSync } from 'node:fs'

// 静态生成时显式预渲染所有文章路由。
// 首页 Coverflow 在 SSR 只渲染可见窗口内(span≈3)的几篇,`crawlLinks` 爬不到窗口外、
// 且标签唯一的文章(如只有 nvim 标签的 memorandum-nvim),会静默漏生成。
const postSlugs = readdirSync('content/posts')
  .filter((f) => f.endsWith('.md'))
  .filter((f) => !/^hidden:\s*true/m.test(readFileSync(`content/posts/${f}`, 'utf8')))
  .map((f) => f.replace(/\.md$/, ''))

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
      routes: ['/', ...postSlugs.map((s) => `/posts/${s}`)]
    }
  }
})
