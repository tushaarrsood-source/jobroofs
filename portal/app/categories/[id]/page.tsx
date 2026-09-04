import Link from '@/components/ui/link';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, Clock3, Euro, MapPin } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
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
  const isDemo = feedsJobs.length === 0;
  const categoryJobs = isDemo ? previewJobs.filter((job) => job.industryId === id) : feedsJobs;

  if (!niche)
    return (
      <main className="min-h-screen bg-[#fafafa] flex flex-col justify-between">
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
    <main className="min-h-screen bg-[#fafafa] text-zinc-900 flex flex-col justify-between">
      <div>
        <BreadcrumbJsonLd
          items={[
            { name: 'JOBROOFS', href: '/' },
            { name: niche.label, href: `/categories/${id}` },
          ]}
        />
        <SiteHeader />
        <section className="border-b border-zinc-200/80 bg-white">
          <div className="mx-auto max-w-[1180px] px-5 py-10 md:px-10 md:py-14">
            <Link
              href="/#niches"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-950 transition-colors"
            >
              <ArrowLeft className="size-3.5" /> Alle Kategorien
            </Link>
            <p className="mt-6 text-xs font-mono uppercase tracking-wider text-zinc-400">
              {niche.labelDe}
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-950 md:text-5xl">
              {niche.label}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600">
              {niche.description}
            </p>
          </div>
        </section>

        <section className="bg-[#fafafa]">
          <div className="mx-auto max-w-[1180px] px-5 py-8 md:px-10 md:py-12">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-950">Verfügbare Stellen</h2>
              <span className="text-xs text-zinc-500">
                {categoryJobs.length} {isDemo ? 'Vorschau-' : ''}Angebote
              </span>
            </div>

            {categoryJobs.length > 0 ? (
              <div className="space-y-3">
                {categoryJobs.map((job: any) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.slug || job.id}`}
                    className="group grid gap-4 rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-950 hover:shadow-2xs md:grid-cols-[minmax(0,1fr)_repeat(3,150px)_auto] md:items-center cursor-pointer"
                  >
                    <div>
                      <span className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-700 border border-zinc-200">
                        {job.listingOrigin === 'employer_posted'
                          ? 'Direktkontakt'
                          : 'Verifiziert'}
                      </span>
                      <h3 className="mt-2 text-base font-bold text-zinc-900 group-hover:text-black">
                        {job.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        {job.company}
                      </p>
                    </div>
                    <Fact icon={Euro} value={isDemo ? job.compensation.label : (job.payText || 'Not stated')} />
                    <Fact icon={Clock3} value={isDemo ? job.hours.label : (job.hoursLabel || 'Not stated')} />
                    <Fact icon={MapPin} value={`${job.district}, Berlin`} />
                    <ArrowRight className="size-4 text-zinc-400 transition group-hover:translate-x-1 group-hover:text-zinc-950" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center">
                <p className="font-bold text-sm text-zinc-900">
                  Noch keine Angebote in dieser Kategorie.
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Sobald neue Inserate geprüft sind, erscheinen sie hier.
                </p>
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
    <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-600">
      <Icon className="size-3.5 shrink-0 text-zinc-400" /> {value}
    </span>
  );
}
