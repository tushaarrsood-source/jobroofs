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
            <div className="space-y-3 sm:space-y-3.5">
              {jobs.map((job: any) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.slug || job.id}`}
                  className="apple-press group block p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-zinc-200/80 bg-white hover:border-zinc-300 hover:shadow-md transition-all duration-200 cursor-pointer relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="shrink-0 text-[11px] uppercase bg-black text-white px-2.5 py-0.5 rounded-full font-bold tracking-wider leading-none shadow-2xs">
                          {job.listingOrigin === 'employer_posted'
                            ? '★ DIREKTKONTAKT'
                            : '★ VERIFIZIERT'}
                        </span>
                        {job.whatsapp && (
                          <span className="shrink-0 text-[11px] font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            💬 WhatsApp
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-zinc-950 group-hover:text-black transition-colors tracking-tight line-clamp-1 leading-snug">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-zinc-600 font-normal pt-0.5">
                        <span className="font-bold text-zinc-900">{job.company}</span>
                        <span className="text-zinc-300">&middot;</span>
                        <span className="inline-flex items-center gap-1.5 bg-zinc-100/80 text-zinc-700 px-2.5 py-1 rounded-lg">
                          <MapPin className="size-3.5 text-zinc-500 shrink-0" />
                          <span>{job.district ? `${job.district}, ${city.name}` : city.name}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 bg-zinc-100/80 text-zinc-700 px-2.5 py-1 rounded-lg">
                          <Clock3 className="size-3.5 text-zinc-500 shrink-0" />
                          <span>{job.hours?.label || job.hoursLabel || 'Flexibel'}</span>
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pt-2 sm:pt-0 border-t border-zinc-100 sm:border-t-0">
                      <div className="inline-flex items-baseline px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-zinc-950 text-white shadow-2xs font-mono text-sm sm:text-base font-extrabold tracking-tight">
                        {job.compensation?.label || job.payText || 'Tarif / VB'}
                      </div>
                      <div className="size-9 sm:size-10 rounded-full bg-zinc-100 items-center justify-center text-zinc-400 group-hover:bg-black group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200 shadow-2xs shrink-0 flex">
                        <ArrowRight className="size-4 sm:size-4.5 stroke-[2.5]" />
                      </div>
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
