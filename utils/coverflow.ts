export interface CardState {
  centered: number
  scale: number
  opacity: number
}

export function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

const SCALE_FALLOFF = 0.16
const OPACITY_FALLOFF = 0.22

export function computeCardStates(count: number, scroll: number): CardState[] {
  const states: CardState[] = []
  for (let i = 0; i < count; i++) {
    const rel = mod(i - scroll, count)
    const centered = rel > count / 2 ? rel - count : rel
    const d = Math.abs(centered)
    states.push({
      centered,
      scale: Math.max(0.35, 1 - d * SCALE_FALLOFF),
      opacity: Math.max(0.15, 1 - d * OPACITY_FALLOFF)
    })
  }
  return states
}
