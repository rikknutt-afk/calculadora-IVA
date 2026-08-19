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
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          es: 'es-ES',
          hi: 'hi-IN',
          ru: 'ru-RU',
          fr: 'fr-FR',
          de: 'de-DE',
          it: 'it-IT',
          pt: 'pt-PT',
          bn: 'bn-BD',
          ja: 'ja-JP',
          ko: 'ko-KR',
          ms: 'ms-MY',
          pl: 'pl-PL',
          id: 'id-ID',
          ar: 'ar-SA',
          bg: 'bg-BG',
          tr: 'tr-TR',
          sv: 'sv-SE',
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
