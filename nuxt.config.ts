import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  modules: ["@nuxt/content", "@nuxt/image"],

  content: {
    components: {
      prose: true,
    },
    build: {
      markdown: {
        remarkPlugins: {
          "remark-math": { instance: remarkMath },
        },
        rehypePlugins: {
          "rehype-katex": { instance: rehypeKatex },
        },
        highlight: {
          theme: {
            default: "github-light",
            dark: "github-dark",
          },
          langs: [
            "javascript",
            "typescript",
            "vue",
            "bash",
            "json",
            "yaml",
            "markdown",
            "css",
            "html",
          ],
        },
      },
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

  css: ["katex/dist/katex.min.css"],

  image: {
    quality: 80,
    format: ["webp", "avif"],
  },

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
      siteName: process.env.NUXT_PUBLIC_SITE_NAME || "Blog",
      siteDescription:
        process.env.NUXT_PUBLIC_SITE_DESCRIPTION || "A blog built with Nuxt",
      siteLanguage: process.env.NUXT_PUBLIC_SITE_LANGUAGE || "en",
    },
  },

  app: {
    baseURL: process.env.NUXT_PUBLIC_BASE_URL || undefined,
  },

  nitro: {
    prerender: {
      routes: ["/feed.xml"],
    },
  },
});
