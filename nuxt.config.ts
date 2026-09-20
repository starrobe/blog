export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    function preventContentDumpPrerender(_options, nuxt) {
      // Nuxt Content prerenders a full-collection client database at
      // /__nuxt_content/<collection>/sql_dump.txt — including `hidden: true`
      // drafts. Disable prerendering so the raw dump is never shipped in the
      // static output. Search uses a pre-built, filtered index instead, and
      // page queries are resolved server-side at build time.
      for (const key of Object.keys(nuxt.options.routeRules ?? {})) {
        if (key.includes('/sql_dump.txt')) {
          nuxt.options.routeRules[key] = { prerender: false }
        }
      }
    }
  ],
  css: ['~/assets/css/main.css'],
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/search-index.json']
    }
  }
})
