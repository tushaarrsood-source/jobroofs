import type { Metadata } from 'next';
import Link from '@/components/ui/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { BreadcrumbJsonLd } from '@/components/json-ld';
import { SUPPORTED_CITIES } from '@/lib/domain/cities';
import { getProgrammaticJobs } from '@/lib/jobs/programmatic-fetcher';
import { ArrowRight, MapPin, Euro, Clock3, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Aushilfsjobs in Deutschland — Spontane Einsätze & Tagesjobs | JOBROOFS',
  description:
    'Finde kurzfristige Aushilfsjobs, Event-Einsätze und flexible Schichten bundesweit. Sofortiger Einstieg ohne zeitraubende Bewerbungsprozesse.',
  openGraph: {
    title: 'Aushilfsjobs in Deutschland | JOBROOFS',
    description: 'Aushilfe für Events, Messen, Gastronomie und Lager in deiner Stadt.',
    url: '/aushilfe',
  },
  alternates: {
    canonical: '/aushilfe',
  },
};

export default async function AushilfeHubPage() {
  const jobs = await getProgrammaticJobs('aushilfe', 'all');

  return (
    <main className="min-h-screen bg-[#fafaf9] text-zinc-900 flex flex-col justify-between">
      <BreadcrumbJsonLd
        items={[
          { name: 'JOBROOFS', href: '/' },
          { name: 'Aushilfsjobs Deutschland', href: '/aushilfe' },
        ]}
      />
      <div>
        <SiteHeader />

        <section className="border-b border-zinc-200/80 bg-white">
          <div className="mx-auto max-w-[1180px] px-5 py-12 md:px-10 md:py-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-800">
              <Zap className="size-3 text-rose-600" />
              <span>Sofortstart möglich · Kurzfristige Einsätze</span>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-5xl md:text-6xl">
              Aushilfsjobs in ganz Deutschland
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg">
              Schnell Geld dazuverdienen: Einsätze für Wochenenden, Festivals, Messen, Gastronomie und Lagerunterstützung. Direkt kontaktieren und loslegen.
            </p>

            <div className="mt-8">
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
                Wähle deine Stadt
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
                {SUPPORTED_CITIES.map((c) => (
                  <Link
                    key={c.id}
                    href={`/aushilfe/${c.id}`}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-white hover:border-zinc-950 hover:shadow-xs transition-all text-center group"
                  >
                    <span className="text-sm font-bold text-zinc-900 group-hover:text-black">
                      {c.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 mt-0.5">
                      Aushilfe ansehen
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-5 py-10 md:px-10 md:py-14">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-950">Aktuelle Aushilfsangebote</h2>
            <span className="text-xs text-zinc-500">{jobs.length} Angebote</span>
          </div>

          <div className="space-y-3">
            {jobs.map((job: any) => (
              <Link
                key={job.id}
                href={`/jobs/${job.slug || job.id}`}
                className="group grid gap-4 rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-950 hover:shadow-xs md:grid-cols-[minmax(0,1fr)_repeat(3,150px)_auto] md:items-center cursor-pointer"
              >
                <div>
                  <span className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-700 border border-zinc-200">
                    Aushilfe
                  </span>
                  <h3 className="mt-2 text-base font-bold text-zinc-900 group-hover:text-black">
                    {job.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-zinc-500">{job.company}</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-600">
                  <Euro className="size-3.5 shrink-0 text-zinc-400" />
                  {job.compensation?.label || job.payText || 'Tarif / VB'}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-600">
                  <Clock3 className="size-3.5 shrink-0 text-zinc-400" />
                  {job.hours?.label || job.hoursLabel || 'Kurzfristig'}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-600">
                  <MapPin className="size-3.5 shrink-0 text-zinc-400" />
                  {job.district || job.city || 'Deutschland'}
                </span>
                <ArrowRight className="size-4 text-zinc-400 transition group-hover:translate-x-1 group-hover:text-zinc-950" />
              </Link>
            ))}
          </div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
