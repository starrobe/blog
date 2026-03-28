export interface BackgroundEffectsOptions {
  sakura?: boolean
  noise?: boolean
  gradient?: boolean
  texture?: boolean
}

const defaults: Required<BackgroundEffectsOptions> = {
  sakura: true,
  noise: true,
  gradient: true,
  texture: false,
}

export function useBackgroundEffects() {
  const config = useRuntimeConfig()

  // Use useState for SSR-safe state
  const effects = useState<Required<BackgroundEffectsOptions>>('background-effects', () => {
    if (config.public.backgroundEffects) {
      return { ...defaults, ...(config.public.backgroundEffects as BackgroundEffectsOptions) }
    }
    return { ...defaults }
  })

  function toggleEffect(effect: keyof BackgroundEffectsOptions) {
    effects.value[effect] = !effects.value[effect]
  }

  function setEffect(effect: keyof BackgroundEffectsOptions, enabled: boolean) {
    effects.value[effect] = enabled
  }

  return {
    effects: readonly(effects),
    toggleEffect,
    setEffect,
  }
}
