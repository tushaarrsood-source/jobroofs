import type { Metadata } from 'next';
import Link from '@/components/ui/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { BreadcrumbJsonLd } from '@/components/json-ld';
import { SUPPORTED_CITIES } from '@/lib/domain/cities';
import { PROGRAMMATIC_JOB_TYPES } from '@/lib/seo/programmatic-content';
import { getProgrammaticJobs } from '@/lib/jobs/programmatic-fetcher';
import { ArrowRight, MapPin, Euro, Clock3 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Minijobs in Deutschland (bis 603 €) — Alle Städte | JOBROOFS',
  description:
    'Aktuelle Minijobs, 603-Euro-Jobs und Nebenjobs in ganz Deutschland. Berlin, München, Hamburg, Köln und 10 weitere Städte. 1-Klick-Kontakt ohne Abo.',
  openGraph: {
    title: 'Minijobs in Deutschland (bis 603 €) | JOBROOFS',
    description: 'Finde flexible Minijobs in deiner Stadt. Direkt bewerben ohne Anschreiben.',
    url: '/minijob',
  },
  alternates: {
    canonical: '/minijob',
  },
};

export default async function MinijobHubPage() {
  const jobs = await getProgrammaticJobs('minijob', 'all');

  return (
    <main className="min-h-screen bg-white text-[#222222] flex flex-col justify-between">
      <BreadcrumbJsonLd
        items={[
          { name: 'JOBROOFS', href: '/' },
          { name: 'Minijobs Deutschland', href: '/minijob' },
        ]}
      />
      <div>
        <SiteHeader />

        <section className="border-b border-zinc-200 bg-white">
          <div className="mx-auto max-w-[1180px] px-5 py-12 md:px-10 md:py-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-sm font-semibold text-emerald-900">
              <span>Gesetzliche Minijob-Grenze 2026: 603 € steuerfrei</span>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-5xl md:text-6xl">
              Minijobs in ganz Deutschland
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg">
              Finde flexible 603-Euro-Jobs, Wochenendschichten und Nebenjobs in den 14 größten deutschen Metropolen. 1-Klick-Kontakt direkt mit den Arbeitgebern vor Ort.
            </p>

            {/* City Grid - Borderless Soft Surfaces */}
            <div className="mt-8">
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-3">
                Wähle deine Stadt
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
                {SUPPORTED_CITIES.map((c) => (
                  <Link
                    key={c.id}
                    href={`/minijob/${c.id}`}
                    className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 transition-colors text-center group"
                  >
                    <span className="text-sm sm:text-base font-bold text-zinc-900 group-hover:text-black">
                      {c.name}
                    </span>
                    <span className="text-xs text-zinc-500 mt-0.5">
                      Minijobs ansehen
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Listings - Open Stream (No Boxes) */}
        <section className="mx-auto max-w-[1180px] px-5 py-10 md:px-10 md:py-14">
          <div className="mb-6 flex items-center justify-between border-b border-zinc-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-black">Neueste Minijob-Angebote</h2>
              <p className="text-sm sm:text-base text-zinc-600 mt-1">
                {jobs.length} {jobs.length === 1 ? 'Angebot gefunden' : 'Angebote gefunden'} · Geprüfte Stellen
              </p>
            </div>
          </div>

          <div className="divide-y divide-zinc-200 border-y border-zinc-200">
            {jobs.map((job: any) => (
              <Link
                key={job.id}
                href={`/jobs/${job.slug || job.id}`}
                className="group block py-5 px-2 hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-800">
                        Minijob
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
                    <span className="flex items-center gap-1.5 font-semibold text-black font-mono">
                      <Euro className="size-4 shrink-0 text-zinc-500" />
                      {job.compensation?.label || job.payText || 'Tarif / VB'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock3 className="size-4 shrink-0 text-zinc-500" />
                      {job.hours?.label || job.hoursLabel || 'Flexibel'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-4 shrink-0 text-zinc-500" />
                      {job.district || job.city || 'Deutschland'}
                    </span>
                    <ArrowRight className="size-4 text-zinc-400 transition group-hover:translate-x-1 group-hover:text-zinc-950 hidden md:inline" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
