import { describe, it, expect } from 'vitest'
import { sortAndIndex } from '../../utils/posts'

describe('sortAndIndex', () => {
  it('按 date 升序排序并生成两位编号', () => {
    const posts = [
      { title: 'B', date: '2026-09-21', tags: [] },
      { title: 'A', date: '2026-09-20', tags: [] },
      { title: 'C', date: '2026-09-22', tags: [] }
    ]
    const result = sortAndIndex(posts)
    expect(result.map(p => p.title)).toEqual(['A', 'B', 'C'])
    expect(result.map(p => p.index)).toEqual(['01', '02', '03'])
  })

  it('order 字段覆盖 date 排序', () => {
    const posts = [
      { title: 'B', date: '2026-09-20', order: 2 },
      { title: 'A', date: '2026-09-22', order: 1 },
      { title: 'C', date: '2026-09-21' }
    ]
    const result = sortAndIndex(posts)
    // C 无 order,按 date 2026-09-21 排;A(order 1)最前,B(order 2)其次
    expect(result.map(p => p.title)).toEqual(['A', 'B', 'C'])
  })

  it('编号补齐为两位(10 篇以上仍正常)', () => {
    const posts = Array.from({ length: 12 }, (_, i) => ({
      title: `P${i}`,
      date: `2026-01-${String(i + 1).padStart(2, '0')}`
    }))
    const result = sortAndIndex(posts)
    expect(result[0].index).toBe('01')
    expect(result[9].index).toBe('10')
    expect(result[11].index).toBe('12')
  })
})
