import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://calculadoraiva.net',
  trailingSlash: 'always',
  build: {
    inlineStylesheets: 'always',
  },
  integrations: [
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        'src/': '/src/',
        'theme/': '/src/',
      },
    },
  },
});
