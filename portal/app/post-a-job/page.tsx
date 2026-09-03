import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { EmployerListingForm } from '@/components/employer-listing-form';
import { PostAJobHeader } from '@/components/post-a-job-header';

export const metadata: Metadata = {
  title: 'Job inserieren — Berliner Minijob & Aushilfskräfte finden (ab 29 €)',
  description:
    'Inseriere dein Stellenangebot direkt an tausende Berliner Minijobber, Aushilfen und Werkstudierende. 29 € Einstellgebühr.',
  openGraph: {
    title: 'Job inserieren · KIEZJOB Berlin',
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
    <main className="min-h-screen bg-[#fafafa] text-zinc-900 flex flex-col justify-between">
      <div>
        <SiteHeader />
        <div className="mx-auto max-w-[980px] px-5 py-10 md:px-10 md:py-14">
          <PostAJobHeader />
          <EmployerListingForm />
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
