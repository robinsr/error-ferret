// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react'
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';


const noExternal = [
  '@errorferret/branding',
  '@errorferret/reviewers',
  '@errorferret/constants',
  '@errorferret/ui-react',
];

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()],
    ssr: { noExternal },
    optimizeDeps: { include: noExternal },
    server: {
      proxy: {
        // everything under /app served by the SPA dev server
        '/app': 'http://localhost:4322'
      }
    },
  },
  integrations: [react()]
});