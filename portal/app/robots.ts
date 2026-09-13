import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/control', '/api/', '/profil', '/admin/'],
      },
      {
        userAgent: [
          'Googlebot',
          'Googlebot-Image',
          'Googlebot-Mobile',
          'Googlebot-News',
          'Google-Extended',
          'Bingbot',
          'Applebot',
          'GPTBot',
          'ChatGPT-User',
          'ClaudeBot',
          'PerplexityBot',
          'Bytespider',
          'cohere-ai',
        ],
        allow: '/',
        disallow: ['/control', '/api/', '/profil', '/admin/'],
      },
    ],
    sitemap: 'https://jobroofs.com/sitemap.xml',
    host: 'https://jobroofs.com',
  };
}
