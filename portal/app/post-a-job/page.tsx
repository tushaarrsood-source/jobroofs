import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { BreadcrumbJsonLd } from '@/components/json-ld';
import { SimplePostJobForm } from '@/components/simple-post-job-form';

export const metadata: Metadata = {
  title: 'Job inserieren — In 2 Minuten online in Berlin | JOBROOFS',
  description:
    'Schalte dein Stellenangebot direkt für Berliner Talente, Aushilfen und Minijobber auf JOBROOFS — The portal for Temp Jobs.',
  openGraph: {
    title: 'Job inserieren · JOBROOFS — The portal for Temp Jobs',
    description:
      'Erreiche aktive Berliner Bewerber für Minijobs, Teilzeitstellen und flexible Schichten ohne Vermittler.',
    url: '/post-a-job',
  },
  alternates: {
    canonical: '/post-a-job',
  },
};

export default function PostAJobPage() {
  return (
    <div className="min-h-screen text-[#202a31] flex flex-col justify-between relative z-10">
      <BreadcrumbJsonLd
        items={[
          { name: 'JOBROOFS', href: '/' },
          { name: 'Job inserieren', href: '/post-a-job' },
        ]}
      />
      <SiteHeader />

      <main className="mx-auto max-w-3xl w-full px-4 sm:px-6 flex-1 py-4 sm:py-6">
        <SimplePostJobForm />
      </main>

      <SiteFooter />
    </div>
  );
}
