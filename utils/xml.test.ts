import { describe, it, expect } from 'vitest'
import { escapeXml } from './xml'

describe('escapeXml', () => {
  it('should escape ampersands', () => {
    expect(escapeXml('foo & bar')).toBe('foo &amp; bar')
  })

  it('should escape less than', () => {
    expect(escapeXml('a < b')).toBe('a &lt; b')
  })

  it('should escape greater than', () => {
    expect(escapeXml('a > b')).toBe('a &gt; b')
  })

  it('should escape double quotes', () => {
    expect(escapeXml('say "hello"')).toBe('say &quot;hello&quot;')
  })

  it('should escape single quotes', () => {
    expect(escapeXml("it's")).toBe("it&apos;s")
  })

  it('should escape all special characters together', () => {
    expect(escapeXml('a & b < c > d "e" \'f\'')).toBe(
      'a &amp; b &lt; c &gt; d &quot;e&quot; &apos;f&apos;'
    )
  })

  it('should handle empty string', () => {
    expect(escapeXml('')).toBe('')
  })

  it('should handle undefined-like input', () => {
    expect(escapeXml()).toBe('')
    expect(escapeXml(null as any)).toBe('null')
    expect(escapeXml(undefined as any)).toBe('') // default param kicks in
  })

  it('should not modify plain text', () => {
    expect(escapeXml('hello world')).toBe('hello world')
  })
})