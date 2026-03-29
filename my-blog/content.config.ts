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
      }),
    }),
  },
})
