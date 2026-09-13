import type { Metadata } from 'next';
import Link from '@/components/ui/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { BreadcrumbJsonLd } from '@/components/json-ld';
import { SUPPORTED_CITIES } from '@/lib/domain/cities';
import { PROGRAMMATIC_JOB_TYPES } from '@/lib/seo/programmatic-content';
import { MapPin, ArrowRight, Building2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Städteübersicht — Flexible Jobs in 14 deutschen Metropolen | JOBROOFS',
  description:
    'Entdecke Jobs, Minijobs und Teilzeitstellen in Berlin, München, Hamburg, Köln, Frankfurt und 9 weiteren deutschen Großstädten. Unabhängig & direkt.',
  openGraph: {
    title: 'Städteübersicht — Jobs in ganz Deutschland | JOBROOFS',
    description: 'Finde flexible Stellen in deiner Stadt.',
    url: '/stadt',
  },
  alternates: {
    canonical: '/stadt',
  },
};

export default function StadtHubPage() {
  const types = Object.values(PROGRAMMATIC_JOB_TYPES).filter((t) => t.key !== 'stadt');

  return (
    <main className="min-h-screen bg-[#fafaf9] text-zinc-900 flex flex-col justify-between">
      <BreadcrumbJsonLd
        items={[
          { name: 'JOBROOFS', href: '/' },
          { name: 'Städte', href: '/stadt' },
        ]}
      />
      <div>
        <SiteHeader />

        <section className="border-b border-zinc-200/80 bg-white">
          <div className="mx-auto max-w-[1180px] px-5 py-12 md:px-10 md:py-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
              <Building2 className="size-3 text-zinc-600" />
              <span>14 Großstädte deutschlandweit</span>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-5xl md:text-6xl">
              Jobs nach Stadt entdecken
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg">
              Wähle deine Stadt aus, um lokale Stellenanzeigen, Minijobs, Werkstudentenstellen und Teilzeitjobs mit 1-Klick-Direktkontakt zu finden.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-5 py-10 md:px-10 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SUPPORTED_CITIES.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:border-zinc-900 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-zinc-950">{c.name}</h2>
                    <span className="text-[10px] font-mono uppercase bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">
                      {c.state}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
                    {c.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {c.popularDistricts.slice(0, 4).map((d) => (
                      <span
                        key={d}
                        className="rounded bg-zinc-50 border border-zinc-200/80 px-2 py-0.5 text-[10px] text-zinc-600"
                      >
                        {d}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 border-t border-zinc-100 pt-4 space-y-1.5">
                    {types.map((t) => (
                      <Link
                        key={t.key}
                        href={`/${t.slug}/${c.id}`}
                        className="flex items-center justify-between text-xs font-medium text-zinc-700 hover:text-black py-0.5 transition-colors"
                      >
                        <span>{t.namePlural} {c.name}</span>
                        <ArrowRight className="size-3 text-zinc-400" />
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100">
                  <Link
                    href={`/stadt/${c.id}`}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 py-2.5 text-xs font-semibold text-white hover:bg-black transition-colors"
                  >
                    <span>Alle Jobs in {c.name} ansehen</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
