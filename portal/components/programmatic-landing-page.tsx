import Link from '@/components/ui/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { BreadcrumbJsonLd } from '@/components/json-ld';
import { SUPPORTED_CITIES, type CityDefinition } from '@/lib/domain/cities';
import { PROGRAMMATIC_JOB_TYPES, type JobTypeDefinition } from '@/lib/seo/programmatic-content';
import { ArrowRight, MapPin, Euro, Clock3, Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';
import Script from 'next/script';

interface ProgrammaticLandingPageProps {
  city: CityDefinition;
  jobType: JobTypeDefinition;
  jobs: any[];
}

export function ProgrammaticLandingPage({
  city,
  jobType,
  jobs,
}: ProgrammaticLandingPageProps) {
  const faqs = jobType.faqsTemplate(city);

  // Schema FAQPage for Google Rich Snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  // Sister job types in same city
  const otherTypes = Object.values(PROGRAMMATIC_JOB_TYPES).filter(
    (t) => t.key !== jobType.key && t.key !== 'stadt',
  );

  // Other cities for same job type
  const otherCities = SUPPORTED_CITIES.filter((c) => c.id !== city.id);

  return (
    <main className="min-h-screen bg-[#fafaf9] text-zinc-900 flex flex-col justify-between">
      {/* JSON-LD Schemas */}
      <BreadcrumbJsonLd
        items={[
          { name: 'JOBROOFS', href: '/' },
          { name: jobType.namePlural, href: `/${jobType.slug}` },
          { name: `${jobType.namePlural} in ${city.name}`, href: `/${jobType.slug}/${city.id}` },
        ]}
      />
      <Script
        id={`faq-schema-${jobType.slug}-${city.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div>
        <SiteHeader />

        {/* Hero Section */}
        <section className="border-b border-zinc-200/80 bg-white">
          <div className="mx-auto max-w-[1180px] px-5 py-10 md:px-10 md:py-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-800">
              <Sparkles className="size-3 text-emerald-600" />
              <span>{jobType.badge}</span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-5xl md:text-6xl">
              {jobType.namePlural} in <span className="underline decoration-emerald-500/40 decoration-wavy underline-offset-8">{city.name}</span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg">
              {jobType.heroSubtitleTemplate(city.name)}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              <span className="font-semibold text-zinc-700">Beliebte Stadtteile:</span>
              {city.popularDistricts.map((d) => (
                <span
                  key={d}
                  className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-zinc-700"
                >
                  {d}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/post-a-job"
                className="apple-btn-primary inline-flex !h-10 !px-5 !text-xs font-semibold"
              >
                <span>Job in {city.name} kostenlos inserieren</span>
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span>1. Inserat 100% kostenlos · Keine Abo-Falle</span>
              </div>
            </div>
          </div>
        </section>

        {/* Jobs Feed */}
        <section className="mx-auto max-w-[1180px] px-5 py-10 md:px-10 md:py-14">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-zinc-950">
                Aktuelle {jobType.namePlural} in {city.name}
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                {jobs.length} {jobs.length === 1 ? 'Angebot gefunden' : 'Angebote gefunden'} · Ohne Scraping
              </p>
            </div>
          </div>

          {jobs.length > 0 ? (
            <div className="space-y-3">
              {jobs.map((job: any) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.slug || job.id}`}
                  className="group grid gap-4 rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-950 hover:shadow-xs md:grid-cols-[minmax(0,1fr)_repeat(3,150px)_auto] md:items-center cursor-pointer"
                >
                  <div>
                    <span className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-700 border border-zinc-200">
                      {job.listingOrigin === 'employer_posted'
                        ? 'Direktkontakt'
                        : 'Verifiziert'}
                    </span>
                    <h3 className="mt-2 text-base font-bold text-zinc-900 group-hover:text-black">
                      {job.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {job.company}
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-600">
                    <Euro className="size-3.5 shrink-0 text-zinc-400" />
                    {job.compensation?.label || job.payText || 'Tarif / VB'}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-600">
                    <Clock3 className="size-3.5 shrink-0 text-zinc-400" />
                    {job.hours?.label || job.hoursLabel || 'Flexibel'}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-600">
                    <MapPin className="size-3.5 shrink-0 text-zinc-400" />
                    {job.district ? `${job.district}, ${city.name}` : city.name}
                  </span>
                  <ArrowRight className="size-4 text-zinc-400 transition group-hover:translate-x-1 group-hover:text-zinc-950" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 md:p-14 text-center">
              <p className="font-bold text-base text-zinc-900">
                Sei der Erste in {city.name}!
              </p>
              <p className="mt-1 text-xs text-zinc-500 max-w-md mx-auto">
                In dieser Kategorie in {city.name} gibt es gerade neue Nachfrage. Inseriere jetzt deine freie Stelle in 60 Sekunden kostenlos.
              </p>
              <div className="mt-5">
                <Link
                  href="/post-a-job"
                  className="apple-btn-primary inline-flex !h-9 !px-4 !text-xs font-semibold"
                >
                  <span>+ Stelle in {city.name} kostenlos inserieren</span>
                </Link>
              </div>
            </div>
          )}

          {/* Local Guide & Legal FAQ Accordion (SEO Magnet) */}
          <div className="mt-14 rounded-2xl border border-zinc-200 bg-white p-6 md:p-10">
            <div className="flex items-center gap-2 text-zinc-900 font-bold text-lg">
              <HelpCircle className="size-5 text-emerald-600" />
              <span>Häufige Fragen zu {jobType.namePlural} in {city.name} (FAQ)</span>
            </div>
            <div className="mt-6 space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-4"
                >
                  <h3 className="text-sm font-semibold text-zinc-900">
                    {faq.question}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Internal Linking Mesh Grid: Other Job Types in Same City */}
          <div className="mt-12">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
              Weitere Job-Optionen in {city.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {otherTypes.map((t) => (
                <Link
                  key={t.key}
                  href={`/${t.slug}/${city.id}`}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-zinc-900 hover:text-zinc-950 transition-colors"
                >
                  {t.namePlural} in {city.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Internal Linking Mesh Grid: Same Job Type in Other Cities */}
          <div className="mt-8">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
              {jobType.namePlural} in anderen deutschen Metropolen
            </h3>
            <div className="flex flex-wrap gap-2">
              {otherCities.map((c) => (
                <Link
                  key={c.id}
                  href={`/${jobType.slug}/${c.id}`}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-zinc-900 hover:text-zinc-950 transition-colors"
                >
                  {jobType.namePlural} {c.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
