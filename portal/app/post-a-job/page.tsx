import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { BreadcrumbJsonLd } from '@/components/json-ld';
import { SimplePostJobForm } from '@/components/simple-post-job-form';

export const metadata: Metadata = {
  title: 'Job schalten — In 2 Minuten online in Berlin | KIEZJOB',
  description:
    'Schalte dein Stellenangebot direkt für tausende Berliner Studierende, Aushilfen und Minijobber. Schnell, direkt und ohne Vermittlungsgebühren.',
  openGraph: {
    title: 'Job schalten · KIEZJOB Berlin',
    description:
      'Erreiche aktive Berliner Bewerber für Minijobs, Teilzeitstellen und flexible Schichten.',
    url: '/post-a-job',
  },
  alternates: {
    canonical: '/post-a-job',
  },
};

export default function PostAJobPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <div>
        <BreadcrumbJsonLd
          items={[
            { name: 'KIEZJOB', href: '/' },
            { name: 'Job schalten', href: '/post-a-job' },
          ]}
        />
        <SiteHeader />
        <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
          <SimplePostJobForm />
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
