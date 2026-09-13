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
    <main className="min-h-screen bg-white text-[#222222] flex flex-col justify-between">
      <BreadcrumbJsonLd
        items={[
          { name: 'JOBROOFS', href: '/' },
          { name: 'Städte', href: '/stadt' },
        ]}
      />
      <div>
        <SiteHeader />

        <section className="border-b border-zinc-200 bg-white">
          <div className="mx-auto max-w-[1180px] px-5 py-12 md:px-10 md:py-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3.5 py-1 text-sm font-semibold text-zinc-800">
              <Building2 className="size-3.5 text-zinc-700" />
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
                className="rounded-3xl bg-zinc-50 hover:bg-zinc-100/80 p-6 sm:p-7 flex flex-col justify-between transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-black">{c.name}</h2>
                    <span className="text-xs font-mono font-bold uppercase bg-zinc-200/80 px-2.5 py-1 rounded-full text-zinc-800">
                      {c.state}
                    </span>
                  </div>
                  <p className="mt-2.5 text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
                    {c.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {c.popularDistricts.slice(0, 4).map((d) => (
                      <span
                        key={d}
                        className="rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-800"
                      >
                        {d}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 border-t border-zinc-200/80 pt-4 space-y-2">
                    {types.map((t) => (
                      <Link
                        key={t.key}
                        href={`/${t.slug}/${c.id}`}
                        className="flex items-center justify-between text-sm sm:text-base font-semibold text-zinc-800 hover:text-black py-1 transition-colors"
                      >
                        <span>{t.namePlural} {c.name}</span>
                        <ArrowRight className="size-4 text-zinc-400" />
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-200/80">
                  <Link
                    href={`/stadt/${c.id}`}
                    className="apple-press inline-flex w-full items-center justify-center rounded-2xl bg-black py-3.5 px-4 text-sm sm:text-base font-semibold text-white hover:bg-zinc-800 transition-colors"
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
