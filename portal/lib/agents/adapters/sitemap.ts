export async function detectSitemapChanges(
  sitemapUrl: string,
  lastCheckedAt: Date
): Promise<Array<{ url: string; lastmod: string | null }>> {
  const res = await fetch(sitemapUrl);
  if (!res.ok) throw new Error(`Sitemap fetch error: ${res.status}`);
  const xml = await res.text();
  
  const results: Array<{ url: string; lastmod: string | null }> = [];
  const checkedTime = lastCheckedAt.getTime();

  // Check if it's an index sitemap
  if (xml.includes('<sitemapindex')) {
    const sitemapRegex = /<sitemap>([\s\S]*?)<\/sitemap>/g;
    let match;
    const childSitemaps = [];
    while ((match = sitemapRegex.exec(xml)) !== null) {
      const locMatch = match[1].match(/<loc>([^<]+)<\/loc>/);
      const lastmodMatch = match[1].match(/<lastmod>([^<]+)<\/lastmod>/);
      if (locMatch) {
        const lastmod = lastmodMatch ? lastmodMatch[1] : null;
        if (!lastmod || new Date(lastmod).getTime() > checkedTime) {
          childSitemaps.push(locMatch[1]);
        }
      }
    }
    
    for (const childUrl of childSitemaps) {
      const childResults = await detectSitemapChanges(childUrl, lastCheckedAt);
      results.push(...childResults);
    }
  } else {
    // Regular sitemap
    const urlRegex = /<url>([\s\S]*?)<\/url>/g;
    let match;
    while ((match = urlRegex.exec(xml)) !== null) {
      const locMatch = match[1].match(/<loc>([^<]+)<\/loc>/);
      const lastmodMatch = match[1].match(/<lastmod>([^<]+)<\/lastmod>/);
      if (locMatch) {
        const lastmod = lastmodMatch ? lastmodMatch[1] : null;
        if (!lastmod || new Date(lastmod).getTime() > checkedTime) {
          results.push({ url: locMatch[1], lastmod });
        }
      }
    }
  }

  return results;
}
