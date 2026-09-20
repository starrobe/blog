export function bodyToPlainText(body: unknown): string {
  if (!body) return ''
  const parts: string[] = []
  const walk = (node: any) => {
    if (node == null) return
    // bare text (minimark children are plain strings)
    if (typeof node === 'string') {
      parts.push(node)
      return
    }
    // hast text node
    if (node.type === 'text' && typeof node.value === 'string') {
      parts.push(node.value)
      return
    }
    // minimark element: [tag, props, ...children]
    if (Array.isArray(node)) {
      const tag = typeof node[0] === 'string' ? node[0] : ''
      // skip shiki's injected style/script so they don't pollute the index
      if (tag === 'style' || tag === 'script') return
      for (let i = 2; i < node.length; i++) walk(node[i])
      return
    }
    // hast element children
    if (Array.isArray(node.children)) node.children.forEach(walk)
    // minimark wrapper { type: 'minimark' | 'minimal', value: [...] }
    if (Array.isArray(node.value)) node.value.forEach(walk)
  }
  walk(body)
  return parts.join(' ').replace(/\s+/g, ' ').trim()
}

export function readingMinutes(text: string, wpm = 400): number {
  const chars = text.replace(/\s/g, '').length
  return Math.max(1, Math.ceil(chars / wpm))
}
