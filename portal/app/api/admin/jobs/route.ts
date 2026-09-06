import { NextResponse } from 'next/server';
import { ALL_SOURCED_JOBS } from '@/lib/sources/sourced-jobs';
import { getSuppressedJobs } from '@/lib/sources/suppression-store';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '25', 10)));
    const q = (url.searchParams.get('q') || '').trim().toLowerCase();
    const niche = url.searchParams.get('niche') || 'all';
    const district = (url.searchParams.get('district') || 'all').toLowerCase();
    const tab = url.searchParams.get('tab') || 'active'; // 'active' or 'deleted'

    const suppressedList = getSuppressedJobs();
    const suppressedSet = new Set(suppressedList);

    const matching = ALL_SOURCED_JOBS.filter((job) => {
      const isSuppressed = suppressedSet.has(job.id) || (job.slug && suppressedSet.has(job.slug));
      if (tab === 'deleted' && !isSuppressed) return false;
      if (tab === 'active' && isSuppressed) return false;

      if (niche !== 'all' && job.industryId !== niche) return false;
      const jobDistrict = (job.district || '').toLowerCase();
      if (district !== 'all' && !jobDistrict.includes(district)) return false;

      if (q) {
        const titleMatch = (job.title || '').toLowerCase().includes(q);
        const companyMatch = (job.company || '').toLowerCase().includes(q);
        const districtMatch = jobDistrict.includes(q);
        return titleMatch || companyMatch || districtMatch;
      }
      return true;
    });

    const total = matching.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const offset = (page - 1) * limit;
    const pagedJobs = matching.slice(offset, offset + limit).map((j) => ({
      id: j.id,
      slug: j.slug,
      title: j.title,
      company: j.company,
      district: j.district,
      industryId: j.industryId,
      compensation: j.compensation,
      application: j.application,
      sourceName: j.sourceName,
      sourceUrl: j.sourceUrl,
      firstSeenAt: j.firstSeenAt,
    }));

    const totalDeleted = ALL_SOURCED_JOBS.filter(
      (j) => suppressedSet.has(j.id) || (j.slug && suppressedSet.has(j.slug)),
    ).length;
    const totalActive = ALL_SOURCED_JOBS.length - totalDeleted;

    return NextResponse.json({
      jobs: pagedJobs,
      page,
      limit,
      total,
      totalPages,
      totalActive,
      totalDeleted,
      totalCatalogJobs: ALL_SOURCED_JOBS.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
