import { createConfigForNuxt } from '@nuxt/eslint-config'

export default createConfigForNuxt({
  features: {
    typescript: true,
  },
}, {
  rules: {
    'vue/multi-word-component-names': 'off',
  },
})
