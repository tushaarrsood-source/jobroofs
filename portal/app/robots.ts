import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/control', '/api/'],
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'ClaudeBot',
          'PerplexityBot',
          'Google-Extended',
          'Applebot',
          'Googlebot',
          'Bingbot',
        ],
        allow: '/',
        disallow: ['/control', '/api/'],
      },
    ],
    sitemap: 'https://jobroofs.com/sitemap.xml',
    host: 'https://jobroofs.com',
  };
}
