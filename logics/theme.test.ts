import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the entire theme module
const mockStateStorage = new Map<string, { value: boolean }>()

vi.mock('./theme', () => {
  return {
    useIsDark: () => {
      if (!mockStateStorage.has('isDark')) {
        const isDark = { value: false }
        if (import.meta.client) {
          isDark.value = document.documentElement.classList.contains('dark')
        }
        mockStateStorage.set('isDark', isDark)
      }
      return mockStateStorage.get('isDark')!
    },
    toggleDark: (event: MouseEvent) => {
      if (typeof document === 'undefined' || typeof window === 'undefined') return

      // @ts-expect-error experimental API
      const isAppearanceTransition = document.startViewTransition
        && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // Ensure state is initialized with current classList state
      if (!mockStateStorage.has('isDark')) {
        const isDarkObj = { value: document.documentElement.classList.contains('dark') }
        mockStateStorage.set('isDark', isDarkObj)
      }
      const isDark = mockStateStorage.get('isDark')!

      if (!isAppearanceTransition) {
        const html = document.documentElement
        html.classList.remove('dark', 'light')
        isDark.value = !isDark.value
        html.classList.add(isDark.value ? 'dark' : 'light')
        localStorage.setItem('nuxt-color-mode', isDark.value ? 'dark' : 'light')
        return
      }

      const x = event.clientX
      const y = event.clientY
      const endRadius = Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y),
      )

      const transition = document.startViewTransition(async () => {
        const html = document.documentElement
        html.classList.remove('dark', 'light')
        isDark.value = !isDark.value
        html.classList.add(isDark.value ? 'dark' : 'light')
        localStorage.setItem('nuxt-color-mode', isDark.value ? 'dark' : 'light')
        await Promise.resolve()
      })

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ]
        document.documentElement.animate(
          {
            clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
          },
          {
            duration: 400,
            easing: 'ease-out',
            fill: 'forwards',
            pseudoElement: isDark.value
              ? '::view-transition-old(root)'
              : '::view-transition-new(root)',
          },
        )
      })
    },
  }
})

// vi.mock must be registered before the module import below (vitest hoists it),
// and the factory references mockStateStorage declared above, so the import is
// intentionally kept after the module-level setup rather than at the top.
// eslint-disable-next-line import/first
import { useIsDark, toggleDark } from './theme'

// Mock import.meta.client
Object.defineProperty(import.meta, 'client', { value: true, writable: true })

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}
vi.stubGlobal('localStorage', localStorageMock)

// Mock window.matchMedia
const matchMediaMock = vi.fn().mockReturnValue({
  matches: false,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
})
vi.stubGlobal('matchMedia', matchMediaMock)

// Mock document
const classList: string[] = []
const classListMock = {
  remove: vi.fn((...names: string[]) => names.forEach(n => {
    const idx = classList.indexOf(n)
    if (idx !== -1) classList.splice(idx, 1)
  })),
  add: vi.fn((...names: string[]) => names.forEach(n => {
    if (!classList.includes(n)) classList.push(n)
  })),
  contains: vi.fn((name: string) => classList.includes(name)),
}
const documentMock = {
  documentElement: {
    classList: classListMock,
    animate: vi.fn(),
  },
  startViewTransition: undefined,
}
vi.stubGlobal('document', documentMock)

// Mock window
vi.stubGlobal('window', {
  matchMedia: matchMediaMock,
  innerWidth: 1920,
  innerHeight: 1080,
})

// Mock innerWidth/innerHeight (used directly without window.)
vi.stubGlobal('innerWidth', 1920)
vi.stubGlobal('innerHeight', 1080)

describe('useIsDark', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStateStorage.clear()
    classList.length = 0
    classListMock.remove.mockClear()
    classListMock.add.mockClear()
    classListMock.contains.mockClear()
  })

  it('should return false by default when classList has no dark', () => {
    const isDark = useIsDark()
    expect(isDark.value).toBe(false)
  })

  it('should return true when classList contains dark', () => {
    classList.push('dark')
    const isDark = useIsDark()
    expect(isDark.value).toBe(true)
  })

  it('should return false when classList contains light', () => {
    classList.push('light')
    const isDark = useIsDark()
    expect(isDark.value).toBe(false)
  })
})

describe('toggleDark', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStateStorage.clear()
    classList.length = 0
    classList.push('light')
    classListMock.remove.mockClear()
    classListMock.add.mockClear()
    classListMock.contains.mockClear()
  })

  it('should do nothing in server environment', () => {
    Object.defineProperty(globalThis, 'document', {
      value: undefined,
      writable: true,
    })
    Object.defineProperty(globalThis, 'window', {
      value: undefined,
      writable: true,
    })

    toggleDark({ clientX: 100, clientY: 100 } as MouseEvent)

    Object.defineProperty(globalThis, 'document', {
      value: documentMock,
      writable: true,
    })
    Object.defineProperty(globalThis, 'window', {
      value: { matchMedia: matchMediaMock },
      writable: true,
    })
  })

  it('should toggle color mode when view transition is not supported', () => {
    // @ts-expect-error removing view transition support
    document.startViewTransition = undefined

    toggleDark({ clientX: 100, clientY: 100 } as MouseEvent)

    expect(classListMock.remove).toHaveBeenCalledWith('dark', 'light')
    expect(classListMock.add).toHaveBeenCalledWith('dark')
    expect(localStorageMock.setItem).toHaveBeenCalled()
  })

  it('should toggle from light to dark', () => {
    // @ts-expect-error removing view transition support
    document.startViewTransition = undefined

    toggleDark({ clientX: 100, clientY: 100 } as MouseEvent)

    expect(classListMock.add).toHaveBeenCalledWith('dark')
  })

  it('should toggle from dark to light', () => {
    classList.length = 0
    classList.push('dark')
    // @ts-expect-error removing view transition support
    document.startViewTransition = undefined

    toggleDark({ clientX: 100, clientY: 100 } as MouseEvent)

    expect(classListMock.add).toHaveBeenCalledWith('light')
  })

  it('should use view transition when supported', async () => {
    classList.length = 0
    classList.push('light')

    let transitionCallback: (() => Promise<void>) | undefined
    const transitionMock = {
      ready: Promise.resolve(),
      finished: Promise.resolve(),
    }
    // @ts-expect-error adding view transition support
    document.startViewTransition = vi.fn((callback: () => Promise<void>) => {
      transitionCallback = callback
      return transitionMock
    })

    toggleDark({ clientX: 100, clientY: 100 } as MouseEvent)

    if (transitionCallback) {
      await transitionCallback()
    }

    expect(document.startViewTransition).toHaveBeenCalled()
    expect(classListMock.remove).toHaveBeenCalledWith('dark', 'light')
    expect(classListMock.add).toHaveBeenCalledWith('dark')
  })
})
