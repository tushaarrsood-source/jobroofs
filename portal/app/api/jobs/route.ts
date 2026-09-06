import { NextResponse } from 'next/server';
import { ALL_SOURCED_JOBS } from '@/lib/sources/sourced-jobs';
import { isJobSuppressed } from '@/lib/sources/suppression-store';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const q = (url.searchParams.get('q') || '').trim().toLowerCase();
    const district = (url.searchParams.get('district') || 'all').toLowerCase();
    const niche = url.searchParams.get('niche') || 'all';
    const limit = Math.min(2000, Math.max(1, parseInt(url.searchParams.get('limit') || '25', 10)));
    const offset = Math.max(0, parseInt(url.searchParams.get('offset') || '0', 10));

    const filtered = ALL_SOURCED_JOBS.filter((job) => {
      if (isJobSuppressed(job.id) || (job.slug && isJobSuppressed(job.slug))) return false;
      if (niche !== 'all' && job.industryId !== niche) return false;
      if (district !== 'all' && !(job.district || '').toLowerCase().includes(district)) return false;
      if (q) {
        const title = (job.title || '').toLowerCase();
        const company = (job.company || '').toLowerCase();
        const dist = (job.district || '').toLowerCase();
        return title.includes(q) || company.includes(q) || dist.includes(q);
      }
      return true;
    });

    const paged = filtered.slice(offset, offset + limit).map((j) => ({
      id: j.id,
      slug: j.slug,
      title: j.title,
      company: j.company,
      district: j.district,
      postcode: j.postcode,
      industryId: j.industryId,
      employmentForms: j.employmentForms,
      compensation: j.compensation,
      hours: j.hours,
      hoursLabel: j.hoursLabel || j.hours?.label,
      schedule: j.schedule,
      scheduleSummary: j.scheduleSummary || j.schedule?.summary,
      tier: j.tier,
      isFeatured: j.isFeatured,
      listingOrigin: j.listingOrigin,
      tags: j.tags,
    }));

    return NextResponse.json({
      total: filtered.length,
      jobs: paged,
      hasMore: offset + limit < filtered.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
