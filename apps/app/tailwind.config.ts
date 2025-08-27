import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    // shared components
    '../../packages/ui-react/src/**/*.{ts,tsx}',
  ],
  // theme, plugins, etc. (optional)
} satisfies Config