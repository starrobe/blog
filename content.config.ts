import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.string().optional(),
        tags: z.array(z.string()).optional(),
      }),
    }),
    home: defineCollection({
      type: 'page',
      source: 'home.md',
      schema: z.object({
        title: z.string(),
        name: z.string(),
        description: z.string(),
        avatar: z.string().optional(),
        social: z.object({
          github: z.string().optional(),
          email: z.string().optional(),
          bilibili: z.string().optional(),
          qq: z.string().optional(),
          rss: z.string().optional(),
        }).optional(),
      }),
    }),
  },
})
