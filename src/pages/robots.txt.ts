import type { APIRoute } from 'astro';
import siteConfig from '../config/site.json';

export const GET: APIRoute = () => {
  const robots = `User-agent: *
Allow: /

Sitemap: ${siteConfig.siteUrl}/sitemap-index.xml
`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
