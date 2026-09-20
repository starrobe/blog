export function sortAndIndex<T extends { order?: number; date: string }>(
  posts: T[]
): (T & { index: string })[] {
  const sorted = [...posts].sort((a, b) => {
    const ka = a.order ?? new Date(a.date).getTime()
    const kb = b.order ?? new Date(b.date).getTime()
    return ka - kb
  })
  return sorted.map((p, i) => ({ ...p, index: String(i + 1).padStart(2, '0') }))
}
