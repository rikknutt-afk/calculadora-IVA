import type { APIRoute } from 'astro';
import siteConfig from '../config/site.json';

export const GET: APIRoute = () => {
  const content = `# LLMs.txt for ${siteConfig.siteName}
Site-URL: ${siteConfig.siteUrl}
Contact: ${siteConfig.contactEmail}
Sitemap: ${siteConfig.siteUrl}/sitemap-index.xml

# Description
${siteConfig.defaultDescription}

# AI Policy
Calculadora IVA permits AI indexing, scraping, and summarization of our public calculation formulas, tax guides, and documentation for educational and research purposes.

# Directives
Allow: /
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
