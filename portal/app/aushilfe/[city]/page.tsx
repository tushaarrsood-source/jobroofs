import type { Metadata } from 'next';
import { SUPPORTED_CITIES, getCityById } from '@/lib/domain/cities';
import { PROGRAMMATIC_JOB_TYPES, getProgrammaticMetadata } from '@/lib/seo/programmatic-content';
import { getProgrammaticJobs } from '@/lib/jobs/programmatic-fetcher';
import { ProgrammaticLandingPage } from '@/components/programmatic-landing-page';

export function generateStaticParams() {
  return SUPPORTED_CITIES.map((city) => ({ city: city.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  return getProgrammaticMetadata('aushilfe', city);
}

export default async function AushilfeCityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const cityDef = getCityById(city) || SUPPORTED_CITIES[0];
  const jobs = await getProgrammaticJobs('aushilfe', cityDef.id);

  return (
    <ProgrammaticLandingPage
      city={cityDef}
      jobType={PROGRAMMATIC_JOB_TYPES.aushilfe}
      jobs={jobs}
    />
  );
}
