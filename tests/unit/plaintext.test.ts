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
  it('提取 minimark 格式正文(@nuxt/content v3 body)', () => {
    const body = {
      type: 'minimark',
      value: [
        ['h1', { id: '标题' }, '用 Nuxt Content 写文章'],
        ['p', {}, 'Nuxt Content 3 用 ', ['code', {}, 'queryCollection'], ' 查询内容,渲染。'],
        ['style', {}, 'html pre.shiki code { color: red; }']
      ]
    }
    const text = bodyToPlainText(body)
    expect(text).toContain('用 Nuxt Content 写文章')
    expect(text).toContain('queryCollection')
    expect(text).toContain('渲染。')
    expect(text).not.toContain('shiki') // style 节点被剔除
  })
  it('折叠多余空白,避免加倍空格破坏多词短语匹配', () => {
    const body = {
      type: 'minimark',
      value: [
        ['p', {}, 'Hello ', ['strong', {}, 'World'], '  again']
      ]
    }
    const text = bodyToPlainText(body)
    expect(text).not.toContain('  ')
    expect(text).toBe('Hello World again')
  })
})

describe('readingMinutes', () => {
  it('按字数估算阅读时长', () => {
    expect(readingMinutes('a'.repeat(800))).toBe(2)
  })
  it('至少 1 分钟', () => {
    expect(readingMinutes('short')).toBe(1)
  })
  it('向上取整:401 字为 2 分钟', () => {
    expect(readingMinutes('a'.repeat(400))).toBe(1)
    expect(readingMinutes('a'.repeat(401))).toBe(2)
  })
})
