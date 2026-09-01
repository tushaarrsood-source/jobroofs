export interface AtsJobEntry {
  externalId: string;
  title: string;
  url: string;
  location: string | null;
  department: string | null;
  postedAt: string | null;
  updatedAt: string | null;
}

export async function fetchGreenhouseJobs(boardToken: string): Promise<AtsJobEntry[]> {
  const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs`);
  if (!res.ok) throw new Error(`Greenhouse API error: ${res.status}`);
  const data = (await res.json()) as { jobs?: Array<{ id: number | string; title: string; absolute_url: string; location?: { name?: string }; departments?: Array<{ name?: string }>; updated_at?: string }> };
  
  return (data.jobs || []).map((job) => ({
    externalId: String(job.id),
    title: job.title,
    url: job.absolute_url,
    location: job.location?.name || null,
    department: job.departments?.[0]?.name || null,
    postedAt: job.updated_at || null,
    updatedAt: job.updated_at || null,
  }));
}

export async function fetchLeverJobs(company: string): Promise<AtsJobEntry[]> {
  const res = await fetch(`https://api.eu.lever.co/v0/postings/${company}?mode=json`);
  if (!res.ok) throw new Error(`Lever API error: ${res.status}`);
  const data = (await res.json()) as Array<{ id: string; text: string; hostedUrl: string; categories?: { location?: string; team?: string }; createdAt: number }>;
  
  return data.map((job) => ({
    externalId: String(job.id),
    title: job.text,
    url: job.hostedUrl,
    location: job.categories?.location || null,
    department: job.categories?.team || null,
    postedAt: new Date(job.createdAt).toISOString(),
    updatedAt: new Date(job.createdAt).toISOString(),
  }));
}

export async function fetchPersonioJobs(companySubdomain: string): Promise<AtsJobEntry[]> {
  const res = await fetch(`https://${companySubdomain}.jobs.personio.de/xml`);
  if (!res.ok) throw new Error(`Personio API error: ${res.status}`);
  const xml = await res.text();
  
  // Simple regex parsing to avoid external XML deps
  const jobs: AtsJobEntry[] = [];
  const positionRegex = /<position>([\s\S]*?)<\/position>/g;
  let match;
  
  while ((match = positionRegex.exec(xml)) !== null) {
    const jobXml = match[1];
    const id = jobXml.match(/<id>([^<]+)<\/id>/)?.[1] || '';
    const title = jobXml.match(/<name><!\[CDATA\[([\s\S]*?)\]\]><\/name>/)?.[1] || '';
    const url = `https://${companySubdomain}.jobs.personio.de/job/${id}`;
    
    // Some xml formats might just have text, not CDATA
    const titleFallback = jobXml.match(/<name>([^<]+)<\/name>/)?.[1] || title;
    
    jobs.push({
      externalId: id,
      title: titleFallback,
      url,
      location: null,
      department: jobXml.match(/<department>([^<]+)<\/department>/)?.[1] || null,
      postedAt: null,
      updatedAt: null,
    });
  }
  
  return jobs;
}

export async function fetchSmartRecruitersJobs(companyId: string): Promise<AtsJobEntry[]> {
  const res = await fetch(`https://api.smartrecruiters.com/v1/companies/${companyId}/postings`);
  if (!res.ok) throw new Error(`SmartRecruiters API error: ${res.status}`);
  const data = (await res.json()) as { content?: Array<{ id: string; name: string; location?: { city?: string }; department?: { label?: string }; releasedDate?: string }> };
  
  return (data.content || []).map((job) => ({
    externalId: String(job.id),
    title: job.name,
    url: `https://jobs.smartrecruiters.com/${companyId}/${job.id}`,
    location: job.location?.city || null,
    department: job.department?.label || null,
    postedAt: job.releasedDate || null,
    updatedAt: job.releasedDate || null,
  }));
}
