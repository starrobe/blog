import { describe, it, expect } from 'vitest'
import { bodyToPlainText, readingMinutes } from '../../utils/plaintext'

describe('bodyToPlainText', () => {
  it('递归提取文本节点', () => {
    const body = {
      type: 'root',
      children: [
        { type: 'heading', children: [{ type: 'text', value: '标题' }] },
        { type: 'paragraph', children: [{ type: 'text', value: '正文内容' }] }
      ]
    }
    expect(bodyToPlainText(body)).toBe('标题 正文内容')
  })
  it('空 body 返回空串', () => {
    expect(bodyToPlainText(null)).toBe('')
  })
})

describe('readingMinutes', () => {
  it('按字数估算阅读时长', () => {
    expect(readingMinutes('a'.repeat(800))).toBe(2)
  })
  it('至少 1 分钟', () => {
    expect(readingMinutes('short')).toBe(1)
  })
})
