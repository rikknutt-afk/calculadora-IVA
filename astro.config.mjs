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
          en: 'en-US',
          fr: 'fr-FR',
          de: 'de-DE',
          it: 'it-IT',
          pt: 'pt-PT',
          ru: 'ru-RU',
          hi: 'hi-IN',
          bn: 'bn-BD',
          ja: 'ja-JP',
          ko: 'ko-KR',
          ms: 'ms-MY',
          id: 'id-ID',
          pl: 'pl-PL',
          tr: 'tr-TR',
          sv: 'sv-SE',
          bg: 'bg-BG',
          ar: 'ar-SA',
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
