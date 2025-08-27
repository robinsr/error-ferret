import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/**/*.{astro,ts,tsx}',
    '../../packages/ui-react/src/**/*.{ts,tsx}',
  ],
} satisfies Config