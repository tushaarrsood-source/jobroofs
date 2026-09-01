import { industryNiches } from '@/lib/domain/taxonomy';

const nicheSearchTerms: Record<string, string[]> = {
  gastronomy: [
    'Servicekraft Restaurant',
    'Küchenhilfe Café',
    'Gastro Aushilfe',
  ],
  hotels: ['Hotel Aushilfe', 'Housekeeping Teilzeit', 'Hostel Rezeption'],
  events: ['Eventhelfer', 'Veranstaltung Aushilfe', 'Messehostess Eventcrew'],
  retail: ['Verkäufer Aushilfe', 'Shop Teilzeit', 'Einzelhandel Minijob'],
  'food-retail': ['Supermarkt Aushilfe', 'Kasse Minijob', 'Warenverräumung'],
  warehousing: [
    'Lagerhelfer',
    'Kommissionierer Teilzeit',
    'Fulfilment Aushilfe',
  ],
  logistics: [
    'Kurier Fahrer Minijob',
    'Lieferdienst Teilzeit',
    'Logistik Aushilfe',
  ],
  cleaning: [
    'Reinigungskraft Minijob',
    'Housekeeping Aushilfe',
    'Gebäudereinigung Teilzeit',
  ],
  'office-admin': ['Bürohilfe Teilzeit', 'Office Aushilfe', 'Empfang Minijob'],
  'customer-support': [
    'Kundenservice Teilzeit',
    'Call Center Aushilfe',
    'Support Werkstudent',
  ],
  'sales-promotion': [
    'Promoter Aushilfe',
    'Brand Ambassador',
    'Verkauf Promotion Minijob',
  ],
  tourism: [
    'Tourismus Aushilfe',
    'Gästebetreuung Teilzeit',
    'Ticketing Minijob',
  ],
  culture: [
    'Museum Aushilfe',
    'Theater Abenddienst',
    'Besucherservice Teilzeit',
  ],
  nightlife: ['Club Aushilfe', 'Bar Nacht Minijob', 'Einlass Abendjob'],
  'sports-fitness': [
    'Fitnessstudio Minijob',
    'Sport Aushilfe',
    'Freizeitbad Teilzeit',
  ],
  'childcare-education': [
    'Kinderbetreuung Minijob',
    'Nachhilfe Teilzeit',
    'Schulbegleitung Aushilfe',
  ],
  'healthcare-support': [
    'Praxis Aushilfe',
    'Klinik Service Teilzeit',
    'Patientenservice Minijob',
  ],
  'elder-social-care': [
    'Alltagsbegleitung Teilzeit',
    'Sozialdienst Aushilfe',
    'Pflegehelfer Minijob',
  ],
  security: [
    'Sicherheitsmitarbeiter Minijob',
    'Ordner Event',
    'Einlasskontrolle Aushilfe',
  ],
  'construction-trades': [
    'Bauhelfer Aushilfe',
    'Handwerkerhelfer Teilzeit',
    'Werkstatt Minijob',
  ],
  manufacturing: [
    'Produktionshelfer Teilzeit',
    'Montage Aushilfe',
    'Verpackung Minijob',
  ],
  'moving-transport': [
    'Umzugshelfer',
    'Transport Aushilfe',
    'Ladehelfer Minijob',
  ],
  'universities-research': [
    'Studentische Hilfskraft',
    'HiWi Berlin',
    'Research Assistant Teilzeit',
  ],
  'ngo-associations': [
    'NGO Werkstudent',
    'Verein Aushilfe',
    'Campaigner Teilzeit',
  ],
  'media-creative': [
    'Produktionsassistenz',
    'Social Media Werkstudent',
    'Studio Aushilfe',
  ],
  'beauty-wellness': [
    'Salon Aushilfe',
    'Spa Teilzeit',
    'Kosmetik Empfang Minijob',
  ],
  'pet-care': [
    'Tierbetreuung Minijob',
    'Hundebetreuung Aushilfe',
    'Tierheim Teilzeit',
  ],
  'gardening-outdoor': [
    'Gartenhelfer',
    'Grünpflege Aushilfe',
    'Saisonarbeit draußen',
  ],
  'seasonal-markets': [
    'Saisonarbeit Berlin',
    'Weihnachtsmarkt Aushilfe',
    'Festival Minijob',
  ],
  'local-services': [
    'Aushilfe Berlin direkt',
    'Minijob lokaler Betrieb',
    'Teilzeit Quereinsteiger',
  ],
};

export type NicheAgentProfile = {
  id: string;
  agentKey: string;
  label: string;
  searchTerms: string[];
  sourceTarget: number;
  discoveryIntervalMinutes: number;
  monitoringIntervalMinutes: number;
  directSourceShareTarget: number;
  instructions: string[];
};

export const nicheAgentProfiles: NicheAgentProfile[] = industryNiches.map(
  (niche) => ({
    id: niche.id,
    agentKey: `niche:${niche.id}`,
    label: niche.label,
    searchTerms: nicheSearchTerms[niche.id] ?? [niche.label],
    sourceTarget: niche.sourceTarget,
    discoveryIntervalMinutes: 7 * 24 * 60,
    monitoringIntervalMinutes:
      niche.priority === 'launch'
        ? 180
        : niche.priority === 'expand'
          ? 360
          : 720,
    directSourceShareTarget: 0.6,
    instructions: [
      `Accept only work whose primary activity fits ${niche.label}.`,
      'Prefer direct employer career pages and small local sources over large boards.',
      'A search result is a candidate, never an approved source or a publishable job.',
      'Do not borrow facts, evidence, or classifications from another niche queue.',
      'Route ambiguous cross-category jobs to review instead of duplicating them.',
    ],
  }),
);

export function getNicheAgentProfile(id: string) {
  return nicheAgentProfiles.find((profile) => profile.id === id) ?? null;
}

export function chooseDiscoveryTerm(
  profile: NicheAgentProfile,
  now = new Date(),
) {
  const week = Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000));
  return profile.searchTerms[week % profile.searchTerms.length];
}
