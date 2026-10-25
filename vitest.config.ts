import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    include: ['tests/unit/**/*.spec.ts'],
    environmentOptions: {
      nuxt: {
        overrides: {
          supabase: { url: 'http://localhost:54321', key: 'test-key' },
        },
      },
    },
  },
})
