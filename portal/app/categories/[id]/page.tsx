import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, Clock3, Euro, MapPin } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { BreadcrumbJsonLd } from '@/components/json-ld';
import { previewJobs } from '@/lib/domain/preview-data';
import { getIndustry, industryNiches } from '@/lib/domain/taxonomy';
import { getCategoryJobs } from '@/lib/jobs/feeds';

export function generateStaticParams() {
  return industryNiches.map((niche) => ({ id: niche.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const niche = getIndustry(id);
  if (!niche) return { title: 'Category Not Found' };

  return {
    title: `${niche.label} — Minijobs & Flexible Work in Berlin`,
    description: `${niche.description} Browse ${niche.label} (${niche.labelDe}) jobs in Berlin — Minijobs, part-time, temporary shifts. Apply directly on KIEZJOB.`,
    openGraph: {
      title: `${niche.label} — Minijobs & Flexible Work in Berlin · KIEZJOB`,
      description: `${niche.description} Browse and apply directly.`,
      url: `/categories/${id}`,
    },
    alternates: {
      canonical: `/categories/${id}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const niche = getIndustry(id);
  
  const feedsJobs = await getCategoryJobs(id);
  const isDemo = feedsJobs.length === 0;
  const categoryJobs = isDemo ? previewJobs.filter((job) => job.industryId === id) : feedsJobs;

  if (!niche)
    return (
      <main className="min-h-screen bg-[#f4f0e7]">
        <SiteHeader />
        <div className="mx-auto max-w-3xl px-5 py-24 text-center">
          <h1 className="text-3xl font-semibold">Category not found</h1>
          <Link
            href="/#niches"
            className="mt-5 inline-block text-[#385cdd] underline"
          >
            Browse categories
          </Link>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen bg-[#f4f0e7] text-[#18221e]">
      <BreadcrumbJsonLd
        items={[
          { name: 'KIEZJOB', href: '/' },
          { name: niche.label, href: `/categories/${id}` },
        ]}
      />
      <SiteHeader />
      <section className="border-b border-foreground/15">
        <div className="mx-auto max-w-[1180px] px-5 py-10 md:px-10 md:py-14">
          <Link
            href="/#niches"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> All categories
          </Link>
          <p className="mt-8 text-sm font-medium text-[#385cdd]">
            {niche.labelDe}
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
            {niche.label}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            {niche.description}
          </p>
        </div>
      </section>

      <section className="bg-[#fbfaf6]">
        <div className="mx-auto max-w-[1180px] px-5 py-10 md:px-10 md:py-14">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Available jobs</h2>
            <span className="text-sm text-muted-foreground">
              {categoryJobs.length} {isDemo ? 'preview ' : ''}listings
            </span>
          </div>

          {categoryJobs.length > 0 ? (
            <div className="space-y-3">
              {categoryJobs.map((job: any) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.slug || job.id}`}
                  className="group grid gap-5 rounded-xl border border-foreground/15 bg-white p-5 transition hover:border-foreground/35 hover:shadow-[0_10px_28px_rgb(24_34_30/7%)] md:grid-cols-[minmax(0,1fr)_repeat(3,150px)_auto] md:items-center"
                >
                  <div>
                    <span className="rounded-full bg-[#eef0ec] px-2 py-1 text-[10px] font-medium text-[#536057]">
                      {job.listingOrigin === 'employer_posted'
                        ? 'Posted by employer'
                        : 'Found at employer source'}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold group-hover:text-[#385cdd]">
                      {job.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {job.company}
                    </p>
                  </div>
                  <Fact icon={Euro} value={isDemo ? job.compensation.label : (job.payText || 'Not stated')} />
                  <Fact icon={Clock3} value={isDemo ? job.hours.label : (job.hoursLabel || 'Not stated')} />
                  <Fact icon={MapPin} value={`${job.district}, Berlin`} />
                  <ArrowRight className="size-4 text-[#385cdd] transition group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-foreground/25 bg-white p-10 text-center">
              <p className="font-semibold">
                No verified jobs in this category yet.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                New listings will appear here after their source and facts pass
                review.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Fact({ icon: Icon, value }: { icon: typeof Euro; value: string }) {
  return (
    <span className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="size-4 shrink-0" /> {value}
    </span>
  );
}
