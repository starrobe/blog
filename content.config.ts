import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    posts: defineCollection({
      source: 'posts/*.md',
      type: 'page',
      schema: z.object({
        title: z.string(),
        date: z.string(),
        tags: z.array(z.string()).default([]),
        summary: z.string().default(''),
        hidden: z.boolean().default(false),
        order: z.number().optional()
      })
    })
  }
})
