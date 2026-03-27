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

const effects = ref<Required<BackgroundEffectsOptions>>({ ...defaults })

export function useBackgroundEffects() {
  const config = useRuntimeConfig()

  // Initialize from runtime config if available
  if (config.public.backgroundEffects) {
    effects.value = { ...defaults, ...(config.public.backgroundEffects as BackgroundEffectsOptions) }
  }

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
