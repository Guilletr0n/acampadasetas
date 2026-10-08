// @ts-check
import { defineConfig } from 'astro/config';

import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: 'standalone'
  }),

  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            let cleanName = (assetInfo.names?.[0] || assetInfo.name || 'asset').replace(/^\.+/, '');
            cleanName = cleanName.replace(/\.[^/.]+$/, '');
            return `_astro/${cleanName || 'style'}.[hash][extname]`;
          }
        }
      }
    }
  }
});