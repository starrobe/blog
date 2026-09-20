import { describe, it, expect } from 'vitest'
import { mod, computeCardStates } from '../../utils/coverflow'

describe('mod', () => {
  it('处理负数', () => {
    expect(mod(-1, 5)).toBe(4)
  })
  it('处理正数', () => {
    expect(mod(7, 5)).toBe(2)
  })
})

describe('computeCardStates', () => {
  it('scroll=0 时第 0 张居中', () => {
    const states = computeCardStates(5, 0)
    expect(states[0].centered).toBe(0)
    expect(states[0].scale).toBe(1)
    expect(states[0].opacity).toBe(1)
  })

  it('相邻卡片对称分布', () => {
    const states = computeCardStates(5, 0)
    expect(states[1].centered).toBe(1)
    expect(states[4].centered).toBe(-1)
    expect(states[2].centered).toBe(2)
    expect(states[3].centered).toBe(-2)
  })

  it('越远缩放越小、越暗', () => {
    const states = computeCardStates(5, 0)
    expect(states[1].scale).toBeGreaterThan(states[2].scale)
    expect(states[1].opacity).toBeGreaterThan(states[2].opacity)
  })

  it('滚动超出范围后循环回绕', () => {
    // scroll=7 等价于 scroll=2(mod 5)
    const a = computeCardStates(5, 7)
    const b = computeCardStates(5, 2)
    expect(a[0].centered).toBeCloseTo(b[0].centered)
  })
})
