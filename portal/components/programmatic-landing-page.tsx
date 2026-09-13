import Link from '@/components/ui/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { BreadcrumbJsonLd } from '@/components/json-ld';
import { SUPPORTED_CITIES, type CityDefinition } from '@/lib/domain/cities';
import { PROGRAMMATIC_JOB_TYPES, type JobTypeDefinition } from '@/lib/seo/programmatic-content';
import { ArrowRight, MapPin, Euro, Clock3, HelpCircle, CheckCircle2 } from 'lucide-react';
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
    <main className="min-h-screen bg-white text-[#222222] flex flex-col justify-between">
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
        <section className="mx-auto max-w-[1180px] px-5 pt-8 pb-4 md:px-10 md:pt-14 md:pb-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl">
              {jobType.namePlural} in {city.name}
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-zinc-600">
              {jobType.description} Finde geprüfte, aktuelle Stellen von lokalen Betrieben in {city.name} – mit direktem WhatsApp-Kontakt und garantiert ohne Zeitarbeit.
            </p>

            {/* District Quick Tags */}
            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-zinc-600">
              <span className="font-semibold text-black">Beliebte Stadtteile:</span>
              {city.popularDistricts.map((d) => (
                <span
                  key={d}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-800"
                >
                  {d}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/post-a-job"
                className="apple-press inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-7 py-4 text-base font-semibold text-white hover:bg-zinc-800 transition-colors"
              >
                <span>Job in {city.name} kostenlos inserieren</span>
              </Link>
              <div className="flex items-center gap-2 text-sm sm:text-base text-zinc-600">
                <CheckCircle2 className="size-5 text-emerald-600" />
                <span>1. Inserat 100% kostenlos · Keine Abo-Falle</span>
              </div>
            </div>
          </div>
        </section>

        {/* Jobs Feed */}
        <section className="mx-auto max-w-[1180px] px-5 py-10 md:px-10 md:py-14">
          <div className="mb-6 flex items-center justify-between border-b border-zinc-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-black">
                Aktuelle {jobType.namePlural} in {city.name}
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 mt-1">
                {jobs.length} {jobs.length === 1 ? 'Angebot gefunden' : 'Angebote gefunden'} · Ohne Scraping
              </p>
            </div>
          </div>

          {jobs.length > 0 ? (
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
                          {job.listingOrigin === 'employer_posted'
                            ? 'Direktkontakt'
                            : 'Verifiziert'}
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
                        {job.district ? `${job.district}, ${city.name}` : city.name}
                      </span>
                      <ArrowRight className="size-4 text-zinc-400 transition group-hover:translate-x-1 group-hover:text-black" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-14 text-center">
              <p className="font-bold text-xl text-black">
                Sei der Erste in {city.name}!
              </p>
              <p className="mt-2 text-base text-zinc-600 max-w-md mx-auto">
                In dieser Kategorie in {city.name} gibt es gerade neue Nachfrage. Inseriere jetzt deine freie Stelle in 60 Sekunden kostenlos.
              </p>
              <div className="mt-6">
                <Link
                  href="/post-a-job"
                  className="apple-press inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-7 py-4 text-base font-semibold text-white hover:bg-zinc-800 transition-colors"
                >
                  <span>+ Stelle in {city.name} kostenlos inserieren</span>
                </Link>
              </div>
            </div>
          )}

          {/* Local Guide & Legal FAQ Accordion (SEO Magnet) */}
          <div className="mt-14 pt-10 border-t border-zinc-200">
            <div className="flex items-center gap-2.5 text-black font-bold text-xl">
              <HelpCircle className="size-6 text-emerald-600" />
              <span>Häufige Fragen zu {jobType.namePlural} in {city.name} (FAQ)</span>
            </div>
            <div className="mt-6 space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-zinc-50 p-5 sm:p-6"
                >
                  <h3 className="text-base sm:text-lg font-bold text-black">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-zinc-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Internal Linking Mesh Grid: Other Job Types in Same City */}
          <div className="mt-12 pt-8 border-t border-zinc-200">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">
              Weitere Job-Optionen in {city.name}
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {otherTypes.map((t) => (
                <Link
                  key={t.key}
                  href={`/${t.slug}/${city.id}`}
                  className="rounded-full bg-zinc-100 hover:bg-zinc-200 px-4 py-2 text-sm sm:text-base font-semibold text-black transition-colors"
                >
                  {t.namePlural} in {city.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Internal Linking Mesh Grid: Same Job Type in Other Cities */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">
              {jobType.namePlural} in anderen deutschen Metropolen
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {otherCities.map((c) => (
                <Link
                  key={c.id}
                  href={`/${jobType.slug}/${c.id}`}
                  className="rounded-full bg-zinc-100 hover:bg-zinc-200 px-4 py-2 text-sm sm:text-base font-semibold text-black transition-colors"
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
