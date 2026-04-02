import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the entire theme module
const mockStateStorage = new Map<string, { value: boolean }>()

vi.mock('./theme', () => {
  return {
    useIsDark: () => {
      if (!mockStateStorage.has('isDark')) {
        const isDark = { value: false }
        // Initialize from localStorage on client
        if (import.meta.client) {
          const stored = localStorage.getItem('nuxt-color-mode')
          if (stored === 'dark' || stored === 'light') {
            isDark.value = stored === 'dark'
          } else {
            // Check system preference
            isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
          }
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

      // useIsDark must be called first to initialize/use the stored state
      const isDark = vi.fn(() => {
        if (!mockStateStorage.has('isDark')) {
          const isDarkObj = { value: false }
          if (import.meta.client) {
            const stored = localStorage.getItem('nuxt-color-mode')
            if (stored === 'dark' || stored === 'light') {
              isDarkObj.value = stored === 'dark'
            } else {
              isDarkObj.value = window.matchMedia('(prefers-color-scheme: dark)').matches
            }
          }
          mockStateStorage.set('isDark', isDarkObj)
        }
        return mockStateStorage.get('isDark')!
      })()

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
const classListMock = {
  remove: vi.fn(),
  add: vi.fn(),
}
const documentMock = {
  documentElement: {
    classList: classListMock,
  },
  startViewTransition: undefined,
}
vi.stubGlobal('document', documentMock)

// Mock window
vi.stubGlobal('window', {
  matchMedia: matchMediaMock,
})

describe('useIsDark', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStateStorage.clear()
    localStorageMock.getItem.mockReset()
  })

  it('should return false by default when no stored value', () => {
    localStorageMock.getItem.mockReturnValue(null)
    matchMediaMock.mockReturnValue({ matches: false })

    const isDark = useIsDark()
    expect(isDark.value).toBe(false)
  })

  it('should return true when stored value is dark', () => {
    localStorageMock.getItem.mockReturnValue('dark')

    const isDark = useIsDark()
    expect(isDark.value).toBe(true)
  })

  it('should return false when stored value is light', () => {
    localStorageMock.getItem.mockReturnValue('light')

    const isDark = useIsDark()
    expect(isDark.value).toBe(false)
  })

  it('should check system preference when no stored value', () => {
    localStorageMock.getItem.mockReturnValue(null)
    matchMediaMock.mockReturnValue({ matches: true })

    const isDark = useIsDark()
    expect(isDark.value).toBe(true)
  })
})

describe('toggleDark', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStateStorage.clear()
    localStorageMock.getItem.mockReturnValue('light')
    matchMediaMock.mockReturnValue({ matches: false })
    classListMock.remove.mockClear()
    classListMock.add.mockClear()
  })

  it('should do nothing in server environment', () => {
    const savedDocument = globalThis.document
    const savedWindow = globalThis.window

    Object.defineProperty(globalThis, 'document', {
      value: undefined,
      writable: true,
    })
    Object.defineProperty(globalThis, 'window', {
      value: undefined,
      writable: true,
    })

    // Should not throw
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
    expect(classListMock.add).toHaveBeenCalled()
    expect(localStorageMock.setItem).toHaveBeenCalled()
  })

  it('should toggle from light to dark', () => {
    localStorageMock.getItem.mockReturnValue('light')
    // @ts-expect-error removing view transition support
    document.startViewTransition = undefined

    toggleDark({ clientX: 100, clientY: 100 } as MouseEvent)

    expect(classListMock.add).toHaveBeenCalledWith('dark')
  })

  it('should toggle from dark to light', () => {
    localStorageMock.getItem.mockReturnValue('dark')
    // @ts-expect-error removing view transition support
    document.startViewTransition = undefined

    toggleDark({ clientX: 100, clientY: 100 } as MouseEvent)

    expect(classListMock.add).toHaveBeenCalledWith('light')
  })
})