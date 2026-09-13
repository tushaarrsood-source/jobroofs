import { getCityById, SUPPORTED_CITIES, type CityDefinition } from '@/lib/domain/cities';

export interface JobTypeDefinition {
  key: string;
  slug: string;
  name: string;
  namePlural: string;
  badge: string;
  wageRule: string;
  descriptionTemplate: (cityName: string) => string;
  heroSubtitleTemplate: (cityName: string) => string;
  faqsTemplate: (city: CityDefinition) => Array<{ question: string; answer: string }>;
}

export const PROGRAMMATIC_JOB_TYPES: Record<string, JobTypeDefinition> = {
  minijob: {
    key: 'minijob',
    slug: 'minijob',
    name: 'Minijob',
    namePlural: 'Minijobs',
    badge: 'Bis 603 € / Monat steuerfrei',
    wageRule: 'Ab 2026 gilt die gesetzliche Minijob-Grenze von 603 € monatlich bei einem Mindestlohn von 13,90 € / Stunde.',
    descriptionTemplate: (city) =>
      `Finde die besten Minijobs und 603-Euro-Jobs in ${city}. Steuerfreie Nebenjobs im Café, Kiez-Laden, Event, Gastronomie oder Logistik — 1-Klick-Direktkontakt ohne Abo.`,
    heroSubtitleTemplate: (city) =>
      `Alle aktuellen 603 € Minijobs, Wochenend- und Nebenjobs in ${city}. Direkt bewerben bei echten lokalen Arbeitgebern.`,
    faqsTemplate: (city) => [
      {
        question: `Wie viel darf man 2026 im Minijob in ${city.name} steuerfrei verdienen?`,
        answer: `Die gesetzliche Minijob-Grenze in Deutschland liegt ab 2026 bei 603 € im Monat (dynamisch an den Mindestlohn von 13,90 € / Stunde gekoppelt). Bei 603 € monatlich zahlst du keine Lohnsteuer oder Sozialabgaben.`,
      },
      {
        question: `Welche Stadtteile in ${city.name} haben die meisten Minijobs?`,
        answer: `Besonders viele Minijobs findest du in ${city.popularDistricts.join(', ')} in den Bereichen Gastronomie, Kiez-Boutiquen, Bäckereien und Events.`,
      },
      {
        question: `Wie bewerbe ich mich auf Jobroofs für einen Minijob in ${city.name}?`,
        answer: `Auf Jobroofs entfällt die mühsame Anschreiben-Bürokratie: Du bewirbst dich direkt beim Arbeitgeber per 1-Klick-Mail oder WhatsApp ohne Registrierungszwang.`,
      },
    ],
  },
  studentenjob: {
    key: 'studentenjob',
    slug: 'studentenjob',
    name: 'Studentenjob',
    namePlural: 'Studentenjobs',
    badge: 'Student-friendly & flexibel',
    wageRule: 'Ideal vereinbar mit Vorlesungszeiten: flexible Schichten ab 13,90 € bis 20 € / Stunde.',
    descriptionTemplate: (city) =>
      `Studentenjobs in ${city}: Flexible Schichten, Wochenendjobs und Werkstudentenstellen, perfekt abgestimmt auf dein Studium an den Universitäten in ${city}.`,
    heroSubtitleTemplate: (city) =>
      `Finde faire Studentenjobs in ${city} mit flexiblen Arbeitszeiten neben Vorlesungen und Klausuren.`,
    faqsTemplate: (city) => [
      {
        question: `Welche Studentenjobs in ${city.name} sind am flexibelsten?`,
        answer: `Sehr beliebt bei Studierenden in ${city.name} sind Jobs im Café- und Barbereich, Event-Aufbau, Nachhilfe sowie Promo-Aktionen, da Schichten wöchentlich frei gewählt werden können.`,
      },
      {
        question: `Darf ich als Student in ${city.name} mehr als 20 Stunden die Woche arbeiten?`,
        answer: `Während der Vorlesungszeit gilt das Werkstudentenprivileg bis max. 20 Stunden pro Woche. In den Semesterferien (vorlesungsfreie Zeit) darfst du auch Vollzeit bis zu 40 Stunden arbeiten.`,
      },
    ],
  },
  teilzeit: {
    key: 'teilzeit',
    slug: 'teilzeit',
    name: 'Teilzeit',
    namePlural: 'Teilzeitjobs',
    badge: '15–30 Std. / Woche',
    wageRule: 'Feste Arbeitsverträge mit voller Sozialversicherung und planbaren Dienstplänen.',
    descriptionTemplate: (city) =>
      `Teilzeitjobs in ${city}: Finde Jobs mit 15 bis 30 Wochenstunden in Kiez-Geschäften, Praxen, Büros, Gastronomie und lokalen Unternehmen in ${city}.`,
    heroSubtitleTemplate: (city) =>
      `Planbare Arbeitszeiten, faires Gehalt und lokale Betriebe in ${city}. Jetzt Teilzeit-Angebot entdecken.`,
    faqsTemplate: (city) => [
      {
        question: `Was verdient man in einem Teilzeitjob in ${city.name}?`,
        answer: `Die Vergütung richtet sich nach Branche und Erfahrung, liegt aber mindestens beim gesetzlichen Mindestlohn von 13,90 € / Std., häufig zwischen 15 € und 22 € / Std. im Fach- und Dienstleistungsbereich.`,
      },
      {
        question: `Gibt es in ${city.name} Teilzeitjobs mit flexiblen Arbeitszeiten?`,
        answer: `Ja, viele lokale Arbeitgeber in ${city.name} bieten Vormittags- oder Nachmittagsschichten an, die sich ideal mit Familie oder Weiterbildung vereinbaren lassen.`,
      },
    ],
  },
  werkstudent: {
    key: 'werkstudent',
    slug: 'werkstudent',
    name: 'Werkstudent',
    namePlural: 'Werkstudentenstellen',
    badge: 'Praxiserfahrung & Netzwerk',
    wageRule: 'Werkstudentenstatus: Befreiung von Kranken- und Pflegeversicherungsbeiträgen über den Arbeitgeber bis 20 Std./Woche.',
    descriptionTemplate: (city) =>
      `Werkstudentenjobs in ${city}: Sammle wertvolle Berufserfahrung in Startups, Agenturen und mittelständischen Betrieben in ${city} neben deinem Studium.`,
    heroSubtitleTemplate: (city) =>
      `Praxiserfahrung im Fachbereich, faire Bezahlung und flexible Semesterzeiten in ${city}.`,
    faqsTemplate: (city) => [
      {
        question: `Was sind die Vorteile einer Werkstudentenstelle in ${city.name}?`,
        answer: `Als Werkstudent:in sammelst du fachbezogene Praxiserfahrung für deinen Lebenslauf und profitierst von reduzierten Sozialabgaben (nur Rentenversicherung), wodurch dir mehr Netto vom Brutto bleibt.`,
      },
    ],
  },
  aushilfe: {
    key: 'aushilfe',
    slug: 'aushilfe',
    name: 'Aushilfe',
    namePlural: 'Aushilfsjobs',
    badge: 'Sofortstart möglich',
    wageRule: 'Kurzfristige Beschäftigung oder 1-Tages-Einsätze ohne langfristige Bindung.',
    descriptionTemplate: (city) =>
      `Aushilfsjobs in ${city}: Spontane Schichten, Tagesjobs und kurzfristige Aushilfen in Events, Gastronomie, Messe und Lager in ${city}.`,
    heroSubtitleTemplate: (city) =>
      `Schnell Geld verdienen mit flexiblen Aushilfsjobs in ${city}. Sofortiger Einstieg ohne zeitraubende Bewerbungsprozesse.`,
    faqsTemplate: (city) => [
      {
        question: `Brauche ich Vorerfahrung für Aushilfsjobs in ${city.name}?`,
        answer: `Die meisten Aushilfsstellen in ${city.name} (z.B. im Service, Lager oder Eventbereich) erfordern keine Vorerfahrung, sondern Zuverlässigkeit und Freude an der Arbeit. Eine kurze Einarbeitung erfolgt vor Ort.`,
      },
    ],
  },
  stadt: {
    key: 'stadt',
    slug: 'stadt',
    name: 'Jobs',
    namePlural: 'Jobs & Stellenangebote',
    badge: 'Alle lokalen Stellen',
    wageRule: 'Transparente Vergütung ab Mindestlohn 13,90 € bis überdurchschnittliche Kieztarife.',
    descriptionTemplate: (city) =>
      `Jobs in ${city}: Alle aktuellen Minijobs, Teilzeitstellen, Studentenjobs und Aushilfen in ${city} auf einen Blick. Unabhängig, ohne Scraping, direkter Kontakt.`,
    heroSubtitleTemplate: (city) =>
      `Entdecke offene Stellen in ${city} across Kiez-Cafés, Boutiquen, Handwerk, Logistik und Events.`,
    faqsTemplate: (city) => [
      {
        question: `Wie finde ich schnell einen Job in ${city.name}?`,
        answer: `Nutze die Filter auf Jobroofs nach Stadtteil (${city.popularDistricts.slice(0, 3).join(', ')}) und Jobtyp (Minijob, Teilzeit, Student). Nimm direkt 1-Klick-Kontakt mit dem Inserenten auf.`,
      },
    ],
  },
};

export function getProgrammaticMetadata(typeKey: string, cityId: string) {
  const jobType = PROGRAMMATIC_JOB_TYPES[typeKey] || PROGRAMMATIC_JOB_TYPES.minijob;
  const city = getCityById(cityId) || SUPPORTED_CITIES[0];

  const title = `${jobType.namePlural} in ${city.name} — Aktuelle Stellenangebote & 1-Klick Kontakt`;
  const description = jobType.descriptionTemplate(city.name);
  const path = `/${jobType.slug}/${city.id}`;

  return {
    title: `${title} | JOBROOFS`,
    description,
    openGraph: {
      title,
      description,
      url: path,
      type: 'website',
    },
    alternates: {
      canonical: path,
    },
  };
}
