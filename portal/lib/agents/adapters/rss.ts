export async function detectRssChanges(
  feedUrl: string,
  lastCheckedAt: Date
): Promise<Array<{ title: string; url: string; publishedAt: string | null }>> {
  const res = await fetch(feedUrl);
  if (!res.ok) throw new Error(`RSS fetch error: ${res.status}`);
  const xml = await res.text();
  
  const results: Array<{ title: string; url: string; publishedAt: string | null }> = [];
  const checkedTime = lastCheckedAt.getTime();

  if (xml.includes('<rss') || xml.includes('<channel>')) {
    // RSS 2.0
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];
      const titleMatch = itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || itemXml.match(/<title>([^<]+)<\/title>/);
      const linkMatch = itemXml.match(/<link>([^<]+)<\/link>/);
      const pubDateMatch = itemXml.match(/<pubDate>([^<]+)<\/pubDate>/);
      
      if (titleMatch && linkMatch) {
        const publishedAt = pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : null;
        if (!publishedAt || new Date(publishedAt).getTime() > checkedTime) {
          results.push({
            title: titleMatch[1],
            url: linkMatch[1],
            publishedAt
          });
        }
      }
    }
  } else if (xml.includes('<feed') && xml.includes('http://www.w3.org/2005/Atom')) {
    // Atom
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;
    while ((match = entryRegex.exec(xml)) !== null) {
      const entryXml = match[1];
      const titleMatch = entryXml.match(/<title[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || entryXml.match(/<title[^>]*>([^<]+)<\/title>/);
      const linkMatch = entryXml.match(/<link[^>]*href="([^"]+)"[^>]*>/);
      const updatedMatch = entryXml.match(/<updated>([^<]+)<\/updated>/);
      const publishedMatch = entryXml.match(/<published>([^<]+)<\/published>/);
      
      const dateStr = updatedMatch?.[1] || publishedMatch?.[1];
      
      if (titleMatch && linkMatch) {
        const publishedAt = dateStr ? new Date(dateStr).toISOString() : null;
        if (!publishedAt || new Date(publishedAt).getTime() > checkedTime) {
          results.push({
            title: titleMatch[1],
            url: linkMatch[1],
            publishedAt
          });
        }
      }
    }
  }

  return results;
}
