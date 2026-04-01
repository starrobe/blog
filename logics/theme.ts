export function useIsDark() {
  const isDark = useState('isDark', () => false)

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

  return isDark
}

export function toggleDark(event: MouseEvent) {
  if (typeof document === 'undefined' || typeof window === 'undefined') return

  // @ts-expect-error experimental API
  const isAppearanceTransition = document.startViewTransition
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const isDark = useIsDark()

  if (!isAppearanceTransition) {
    toggleColorMode(isDark)
    return
  }

  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )

  const transition = document.startViewTransition(async () => {
    toggleColorMode(isDark)
    await nextTick()
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
}

function toggleColorMode(isDark: { value: boolean }) {
  const html = document.documentElement
  html.classList.remove('dark', 'light')
  isDark.value = !isDark.value
  html.classList.add(isDark.value ? 'dark' : 'light')
  localStorage.setItem('nuxt-color-mode', isDark.value ? 'dark' : 'light')
}
