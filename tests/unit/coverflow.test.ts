import { describe, it, expect } from 'vitest'
import { mod, computeCoverflowClones } from '../../utils/coverflow'

describe('mod', () => {
  it('处理负数', () => {
    expect(mod(-1, 5)).toBe(4)
  })
  it('处理正数', () => {
    expect(mod(7, 5)).toBe(2)
  })
})

describe('computeCoverflowClones', () => {
  it('生成连续无跳变的卡片流(覆盖 ±span)', () => {
    const items = computeCoverflowClones(2, 0, 3)
    expect(items.map(i => i.centered)).toEqual([-3, -2, -1, 0, 1, 2, 3])
  })

  it('每格一张卡片、相邻克隆交替出现', () => {
    const items = computeCoverflowClones(2, 0, 3)
    // centered 从 -3 到 3,index 交替 1,0,1,0...
    expect(items.map(i => i.index)).toEqual([1, 0, 1, 0, 1, 0, 1])
  })

  it('中心卡片最大最亮,越远越小越暗', () => {
    const items = computeCoverflowClones(2, 0, 3)
    const center = items.find(i => i.centered === 0)!
    expect(center.scale).toBe(1)
    expect(center.opacity).toBe(1)
    const near = items.find(i => i.centered === 1)!
    const far = items.find(i => i.centered === 3)!
    expect(near.scale).toBeLessThan(center.scale)
    expect(far.scale).toBeLessThan(near.scale)
    expect(far.opacity).toBeLessThan(near.opacity)
  })

  it('滚动是连续滑动,无跳变', () => {
    // 滚动 0.5 格后,卡片流整体前进 0.5,centered 仍连续
    const items = computeCoverflowClones(2, 0.5, 3)
    const centered = items.map(i => i.centered)
    for (let i = 1; i < centered.length; i++) {
      expect(centered[i] - centered[i - 1]).toBeCloseTo(1)
    }
  })

  it('滚动一整格后卡片交换位置(无限循环)', () => {
    const before = computeCoverflowClones(2, 0, 3)
    const after = computeCoverflowClones(2, 1, 3)
    // 中心卡片(centered=0)在 scroll=0 是 index 0,scroll=1 是 index 1
    expect(before.find(i => i.centered === 0)!.index).toBe(0)
    expect(after.find(i => i.centered === 0)!.index).toBe(1)
  })
})
