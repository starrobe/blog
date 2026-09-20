import { bodyToPlainText } from '../../utils/plaintext'

export default defineEventHandler(async (event) => {
  const posts = await queryCollection(event, 'posts').where('hidden', '=', false).all()
  return posts.map((p: any) => ({
    title: p.title,
    summary: p.summary,
    tags: p.tags ?? [],
    slug: String(p.path).replace(/^\/posts\//, ''),
    text: bodyToPlainText(p.body)
  }))
})
