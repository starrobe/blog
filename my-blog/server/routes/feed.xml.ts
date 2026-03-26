export default defineEventHandler(async (event) => {
  const baseUrl = 'https://my-blog.vercel.app'
  const posts = await queryCollection('blog')
    .order('date', 'DESC')
    .limit(20)
    .all()

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>My Blog</title>
    <link>${baseUrl}</link>
    <description>A personal blog about technology</description>
    <language>zh-CN</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts.map((post) => `
    <item>
      <title>${post.title}</title>
      <link>${baseUrl}${post.path}</link>
      <guid>${baseUrl}${post.path}</guid>
      <description>${post.description || ''}</description>
      <pubDate>${post.date ? new Date(post.date).toUTCString() : ''}</pubDate>
    </item>`).join('')}
  </channel>
</rss>`

  setHeader(event, 'content-type', 'application/xml')
  return rss
})
