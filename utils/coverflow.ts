export interface CoverflowItem {
  index: number
  cloneId: number
  centered: number
  scale: number
  opacity: number
}

export function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

const SCALE_FALLOFF = 0.16
const OPACITY_FALLOFF = 0.22

/**
 * 生成 coverflow 的「连续卡片流」:每张卡片在可见范围 [-span, span] 内克隆多份
 * (相邻克隆间隔 count 格),使卡片流在屏幕上连续、无跳变,卡片可完整滚出屏幕。
 * cloneId 标识克隆编号,滚动时稳定,供组件用作稳定的 DOM key。
 */
export function computeCoverflowClones(
  count: number,
  scroll: number,
  span: number
): CoverflowItem[] {
  const items: CoverflowItem[] = []
  for (let i = 0; i < count; i++) {
    const base = mod(i - scroll, count)
    const kMin = Math.ceil((-span - base) / count)
    const kMax = Math.floor((span - base) / count)
    for (let k = kMin; k <= kMax; k++) {
      const centered = base + k * count
      const d = Math.abs(centered)
      items.push({
        index: i,
        cloneId: k,
        centered,
        scale: Math.max(0.35, 1 - d * SCALE_FALLOFF),
        opacity: Math.max(0.15, 1 - d * OPACITY_FALLOFF)
      })
    }
  }
  return items.sort((a, b) => a.centered - b.centered)
}
