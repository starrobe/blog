export function bodyToPlainText(body: unknown): string {
  if (!body) return ''
  const parts: string[] = []
  const walk = (node: any) => {
    if (!node) return
    if (node.type === 'text' && typeof node.value === 'string') parts.push(node.value)
    if (Array.isArray(node.children)) node.children.forEach(walk)
  }
  walk(body)
  return parts.join(' ')
}

export function readingMinutes(text: string, wpm = 400): number {
  const chars = text.replace(/\s/g, '').length
  return Math.max(1, Math.round(chars / wpm))
}
