import { defineConfig, latest } from '@nuxt/eslint-config'

export default defineConfig({
  modules: [latest()],
  rules: {
    'vue/multi-word-component-names': 'off',
  },
})
