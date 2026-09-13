import Link from '@/components/ui/link';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, Clock3, Euro, MapPin } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { BreadcrumbJsonLd } from '@/components/json-ld';
import { previewJobs } from '@/lib/domain/preview-data';
import { getIndustry, industryNiches } from '@/lib/domain/taxonomy';
import { getCategoryJobs } from '@/lib/jobs/feeds';
import { isJobSuppressed } from '@/lib/sources/suppression-store';
import { getSourcedJobsByNiche } from '@/lib/sources/sourced-jobs';

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
    description: `${niche.description} Browse ${niche.label} (${niche.labelDe}) jobs in Berlin — Minijobs, part-time, temporary shifts. Apply directly on JOBROOFS.`,
    openGraph: {
      title: `${niche.label} — Minijobs & Flexible Work in Berlin · JOBROOFS`,
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
  const sourcedJobs = getSourcedJobsByNiche(id).filter(
    (job) =>
      !isJobSuppressed(job.id) &&
      (!job.slug || !isJobSuppressed(job.slug)),
  );
  const categoryJobs = feedsJobs.length > 0 ? feedsJobs : sourcedJobs;

  if (!niche)
    return (
      <main className="min-h-screen bg-white text-[#222222] flex flex-col justify-between">
        <div>
          <SiteHeader />
          <div className="mx-auto max-w-3xl px-5 py-24 text-center">
            <h1 className="text-2xl font-bold text-zinc-950">Kategorie nicht gefunden</h1>
            <Link
              href="/#niches"
              className="mt-4 inline-block text-xs font-semibold text-zinc-900 underline"
            >
              Alle Kategorien durchsuchen
            </Link>
          </div>
        </div>
        <SiteFooter />
      </main>
    );

  return (
    <main className="min-h-screen bg-white text-[#222222] flex flex-col justify-between">
      <div>
        <BreadcrumbJsonLd
          items={[
            { name: 'JOBROOFS', href: '/' },
            { name: niche.label, href: `/categories/${id}` },
          ]}
        />
        <SiteHeader />
        <section className="border-b border-zinc-200 bg-white">
          <div className="mx-auto max-w-[1180px] px-5 py-10 md:px-10 md:py-14">
            <Link
              href="/#niches"
              className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-black transition-colors"
            >
              <ArrowLeft className="size-4" /> Alle Kategorien
            </Link>
            <p className="mt-6 text-xs font-mono uppercase tracking-wider text-zinc-500">
              {niche.labelDe}
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-zinc-950 md:text-5xl">
              {niche.label}
            </h1>
            <p className="mt-3 max-w-2xl text-base sm:text-lg leading-relaxed text-zinc-600">
              {niche.description}
            </p>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-[1180px] px-5 py-10 md:px-10 md:py-14">
            <div className="mb-6 flex items-center justify-between border-b border-zinc-200 pb-4">
              <h2 className="text-2xl font-bold text-black">Verfügbare Stellen</h2>
              <span className="text-sm sm:text-base text-zinc-600">
                {categoryJobs.length} {categoryJobs.length === 1 ? 'Angebot gefunden' : 'Angebote gefunden'}
              </span>
            </div>

            {categoryJobs.length > 0 ? (
              <div className="divide-y divide-zinc-200 border-y border-zinc-200">
                {categoryJobs.map((job: any) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.slug || job.id}`}
                    className="group block py-5 px-2 hover:bg-zinc-50 transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-800">
                            {job.listingOrigin === 'employer_posted'
                              ? 'Direktkontakt'
                              : 'Verifiziert'}
                          </span>
                          <h3 className="text-lg font-bold text-black group-hover:text-zinc-800">
                            {job.title}
                          </h3>
                        </div>
                        <p className="mt-1 text-sm sm:text-base text-zinc-600 font-medium">
                          {job.company}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base text-zinc-600">
                        <Fact icon={Euro} value={job.compensation?.label || job.payText || 'Tarif / VB'} />
                        <Fact icon={Clock3} value={job.hours?.label || job.hoursLabel || 'Flexibel'} />
                        <Fact icon={MapPin} value={`${job.district || 'Berlin'}, Berlin`} />
                        <ArrowRight className="size-4 text-zinc-400 transition group-hover:translate-x-1 group-hover:text-zinc-950 hidden md:inline" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-zinc-50 p-10 md:p-14 text-center">
                <p className="font-bold text-lg text-black">
                  Noch keine Angebote in dieser Kategorie.
                </p>
                <p className="mt-2 text-sm sm:text-base text-zinc-600 max-w-sm mx-auto">
                  Sobald neue Inserate geprüft sind, erscheinen sie hier. Sei der Erste und inseriere eine Stelle!
                </p>
                <div className="mt-6">
                  <Link
                    href="/post-a-job"
                    className="apple-press inline-flex items-center justify-center rounded-2xl bg-black px-7 py-4 text-base font-semibold text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <span>+ Job in dieser Kategorie inserieren</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}

function Fact({ icon: Icon, value }: { icon: typeof Euro; value: string }) {
  return (
    <span className="flex items-center gap-1.5 font-medium text-zinc-600">
      <Icon className="size-4 shrink-0 text-zinc-500" /> {value}
    </span>
  );
}
