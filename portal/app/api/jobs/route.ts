import { NextResponse } from 'next/server';
import { getJobsFromFirestore } from '@/lib/firebase/firestore-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const q = (url.searchParams.get('q') || '').trim().toLowerCase();
    const city = (url.searchParams.get('city') || 'all').toLowerCase();
    const district = (url.searchParams.get('district') || 'all').toLowerCase();
    const niche = url.searchParams.get('niche') || 'all';
    const limit = Math.min(2000, Math.max(1, parseInt(url.searchParams.get('limit') || '50', 10)));
    const offset = Math.max(0, parseInt(url.searchParams.get('offset') || '0', 10));

    // Fetch authentic active jobs from Firestore
    const firestoreJobs = await getJobsFromFirestore(limit);

    const filtered = firestoreJobs.filter((job) => {
      if (job.status !== 'active' && job.status !== 'published') return false;
      if (niche !== 'all' && (job as any).industryId !== niche) return false;
      if (city !== 'all' && !(job.city || 'berlin').toLowerCase().includes(city)) return false;
      if (district !== 'all' && !(job.district || '').toLowerCase().includes(district)) return false;
      if (q) {
        const title = (job.title || '').toLowerCase();
        const company = (job.company || '').toLowerCase();
        const dist = (job.district || '').toLowerCase();
        const c = (job.city || 'berlin').toLowerCase();
        return title.includes(q) || company.includes(q) || dist.includes(q) || c.includes(q);
      }
      return true;
    });

    const paged = filtered.slice(offset, offset + limit).map((j: any) => ({
      id: j.id,
      slug: j.slug || j.id,
      title: j.title,
      company: j.company,
      city: j.city || 'Berlin',
      district: j.district,
      postcode: j.postcode,
      industryId: j.industryId || 'other',
      employmentForms: j.employmentForms || [j.employmentType || 'Minijob'],
      compensation: j.compensation || { label: j.payText },
      hours: j.hours,
      hoursLabel: j.hoursLabel || j.hours?.label,
      schedule: j.schedule,
      scheduleSummary: j.scheduleSummary || j.schedule?.summary,
      tier: j.tier,
      isFeatured: j.tier === 'premium',
      listingOrigin: 'employer_posted',
      tags: j.tags || [],
      isIndependentLister: true,
      isUserListing: true,
      whatsapp: j.whatsapp,
      phone: j.contactPhone || j.phone,
      contactEmail: j.contactEmail,
      applyUrl: j.applyUrl,
      payText: j.payText,
      postedAt: j.createdAt
        ? typeof j.createdAt.toDate === 'function'
          ? j.createdAt.toDate().toISOString()
          : j.createdAt
        : undefined,
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
