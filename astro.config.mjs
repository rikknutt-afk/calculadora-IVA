import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://calculadoraiva.es',
  trailingSlash: 'always',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404/'),
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-ES',
        }
      }
    }),
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
