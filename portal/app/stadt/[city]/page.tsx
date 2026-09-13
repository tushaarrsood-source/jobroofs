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
  return getProgrammaticMetadata('stadt', city);
}

export default async function StadtCityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const cityDef = getCityById(city) || SUPPORTED_CITIES[0];
  const jobs = await getProgrammaticJobs('stadt', cityDef.id);

  return (
    <ProgrammaticLandingPage
      city={cityDef}
      jobType={PROGRAMMATIC_JOB_TYPES.stadt}
      jobs={jobs}
    />
  );
}
