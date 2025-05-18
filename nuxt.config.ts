// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false,

  compatibilityDate: '2025-05-18',
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
    }
  },

  modules: [
    '@pinia/nuxt'
  ],

  imports: {
    autoImport: true,
    dirs: [
      'stores',
      'types/*.ts',
      'types/*.d.ts'
    ]
  },

  pinia: {
    autoImports: [
      'defineStore',
      ['defineStore', 'definePiniaStore'],
    ],
  },

  typescript: {
    typeCheck: true,
    strict: true,
    tsConfig: {
      compilerOptions: {
        paths: {
          '~/types/*': ['./types/*'],
          '@/*': ['./*']
        }
      }
    }
  },

  devtools: {
    enabled: true
  }
})