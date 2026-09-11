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
    <div className="min-h-screen bg-[#fbfbf8] text-[#202a31] flex flex-col justify-between">
      <BreadcrumbJsonLd
        items={[
          { name: 'JOBROOFS', href: '/' },
          { name: 'Job inserieren', href: '/post-a-job' },
        ]}
      />
      <SiteHeader />

      <main className="mx-auto max-w-5xl w-full px-6 md:px-8 flex-1 py-10 sm:py-14">
        <SimplePostJobForm />
      </main>

      <SiteFooter />
    </div>
  );
}
