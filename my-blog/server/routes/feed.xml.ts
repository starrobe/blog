export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.siteUrl || 'http://localhost:3000'
  const siteName = config.public.siteName || 'My Blog'
  const siteDescription = config.public.siteDescription || 'A blog built with Nuxt'

  const posts = await queryCollection(event, 'blog')
    .order('date', 'DESC')
    .limit(20)
    .all()

  const escapeXml = (str = '') => String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>zh-CN</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts.map((post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}${post.path}</link>
      <guid>${baseUrl}${post.path}</guid>
      <description>${escapeXml(post.description || '')}</description>
      <pubDate>${post.date ? new Date(post.date).toUTCString() : ''}</pubDate>
    </item>`).join('')}
  </channel>
</rss>`

  setHeader(event, 'content-type', 'application/xml')
  return rss
})
