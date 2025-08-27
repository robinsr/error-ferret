// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react'
import node from '@astrojs/node'
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';


const noExternal = [
  '@errorferret/branding',
  '@errorferret/reviewers',
  '@errorferret/constants',
  '@errorferret/env-node',
];

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [
    react()
  ],
  vite: {
    plugins: [
      tailwindcss()
    ],
    ssr: {
      noExternal
    },
    optimizeDeps: {
      exclude: noExternal
    },
    server: {
      fs: {
        allow: [
          fileURLToPath(new URL('.', import.meta.url)),           // apps/web
          fileURLToPath(new URL('../../', import.meta.url)),      // monorepo root (gives access to packages/*)
        ],
      },
    },
    resolve: {
      alias: {
        // Nice local aliases for your moved React code
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@react': fileURLToPath(new URL('./src/react', import.meta.url)),
        '@react-components': fileURLToPath(new URL('./src/react/components', import.meta.url)),
      },
    },
  },
});