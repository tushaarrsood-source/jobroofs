import { EditorialHero } from '@/components/editorial-hero';
import { JobFeed } from '@/components/job-feed';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { WebSiteJsonLd, LocalBusinessJsonLd } from '@/components/json-ld';
import { getJobsFromFirestore } from '@/lib/firebase/firestore-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  let firestoreJobs: any[] = [];
  try {
    firestoreJobs = await getJobsFromFirestore(50);
  } catch (e) {
    console.error('Error fetching jobs for Home page:', e);
  }

  const initialJobs = firestoreJobs.map((job) => ({
    id: job.id,
    slug: job.slug || job.id,
    title: job.title,
    company: job.company,
    city: job.city || 'Berlin',
    district: job.district,
    postcode: job.postcode,
    industryId: job.industryId || 'other',
    employmentForms: job.employmentForms || [job.employmentType || 'Minijob'],
    compensation: job.compensation || { label: job.payText },
    hours: job.hours,
    hoursLabel: job.hoursLabel || job.hours?.label,
    schedule: job.schedule,
    scheduleSummary: job.scheduleSummary || job.schedule?.summary,
    tier: job.tier,
    isFeatured: job.tier === 'premium',
    listingOrigin: 'employer_posted',
    tags: job.tags || [],
    payText: job.payText,
    isIndependentLister: true,
    isUserListing: true,
    whatsapp: job.whatsapp,
    phone: job.contactPhone || job.phone,
    contactEmail: job.contactEmail,
    applyUrl: job.applyUrl,
    postedAt: job.createdAt
      ? typeof job.createdAt.toDate === 'function'
        ? job.createdAt.toDate().toISOString()
        : job.createdAt
      : undefined,
  }));

  // Initial verified direct employer jobs (only real submissions, no scraped jobs)
  const initialDirectJobs: any[] = [];

  return (
    <div className="min-h-screen text-black flex flex-col justify-between relative z-10 bg-[#fafaf9]">
      <WebSiteJsonLd />
      <LocalBusinessJsonLd />
      <SiteHeader />

      <main className="mx-auto max-w-5xl w-full px-6 md:px-8 flex-1">
        {/* Signature Editorial Hero with Direct Listings */}
        <EditorialHero />

        {/* Full Interactive Job Feed with Direct Employer Listings Above Search Bar */}
        <div className="pt-2 pb-16">
          <JobFeed initialJobs={initialJobs} initialDirectJobs={initialDirectJobs} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
