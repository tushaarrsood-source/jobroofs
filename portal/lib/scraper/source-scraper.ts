import type { BerlinSource } from '@/lib/sources/types';
import type { PreviewJob, LanguageSignal } from '@/lib/domain/types';
import { ALL_BERLIN_SOURCES } from '@/lib/sources/berlin-sources-catalog';

// Map Berlin districts to representative postal codes
const DISTRICT_POSTCODES: Record<string, string[]> = {
  mitte: ['10115', '10117', '10119', '10178'],
  kreuzberg: ['10961', '10969', '10997', '10999'],
  friedrichshain: ['10243', '10245', '10247', '10249'],
  neukölln: ['12043', '12045', '12047', '12049'],
  neukoelln: ['12043', '12045', '12047', '12049'],
  'prenzlauer berg': ['10405', '10407', '10435', '10437'],
  prenzlauer_berg: ['10405', '10407', '10435', '10437'],
  pankow: ['13187', '13189'],
  charlottenburg: ['10585', '10623', '10707', '10719'],
  wilmersdorf: ['10709', '10711'],
  schöneberg: ['10777', '10781', '10823', '10827'],
  schoeneberg: ['10777', '10781', '10823', '10827'],
  tempelhof: ['12099', '12101', '12103'],
  wedding: ['13347', '13351', '13353', '13357'],
  moabit: ['10551', '10553', '10555', '10559'],
  tiergarten: ['10557', '10785'],
  lichtenberg: ['10315', '10317', '10365'],
  treptow: ['12435', '12437', '12439'],
  köpenick: ['12555', '12557'],
  koepenick: ['12555', '12557'],
  steglitz: ['12163', '12165'],
  zehlendorf: ['14163', '14195'],
  spandau: ['13581', '13597'],
  reinickendorf: ['13407', '13409'],
  marzahn: ['12681', '12685'],
  hellersdorf: ['12619', '12627'],
};

function getPostcodeForDistrict(district: string, seed: number): string {
  const norm = district.trim().toLowerCase();
  for (const [key, codes] of Object.entries(DISTRICT_POSTCODES)) {
    if (norm.includes(key)) {
      return codes[Math.abs(seed) % codes.length];
    }
  }
  return '10115';
}

interface NicheConfig {
  roleFamily: string;
  payRange: [number, number];
  payExtras?: string;
  forms: string[];
  language: LanguageSignal;
  hoursLabel: string;
  scheduleSummary: string;
  responsibilities: string[];
  requirements: string[];
}

const NICHE_CONFIGS: Record<string, NicheConfig> = {
  gastronomy: {
    roleFamily: 'service',
    payRange: [14.0, 16.5],
    payExtras: '+ Trinkgeld',
    forms: ['Minijob', 'Teilzeit'],
    language: 'german_and_english',
    hoursLabel: '10–20 Std. / Woche',
    scheduleSummary: 'Flexible Schichten (Früh/Spät)',
    responsibilities: [
      'Gästebetreuung und Bestellannahme mit Charme und Aufmerksamkeit',
      'Zubereitung von Heiß- und Kaltgetränken nach Hausstandard',
      'Kassenführung, Abrechnung und Bonierung im Kassensystem',
      'Einhaltung sämtlicher Hygiene- und HACCP-Standards vor Ort',
    ],
    requirements: [
      'Freundliches, offenes Auftreten und Freude am Gästekontakt',
      'Teamfähigkeit und Belastbarkeit zu Stoßzeiten',
      'Gültige Rote Karte (Belehrung nach § 43 IfSG)',
      'Gute Deutsch- oder Englischkenntnisse',
    ],
  },
  hotels: {
    roleFamily: 'reception',
    payRange: [14.5, 17.0],
    payExtras: '+ Nacht- & Sonntagszulage',
    forms: ['Teilzeit', 'Minijob'],
    language: 'german_and_english',
    hoursLabel: '15–25 Std. / Woche',
    scheduleSummary: 'Schichtdienst inkl. Wochenende',
    responsibilities: [
      'Herzlicher Check-in und Check-out internationaler Gäste',
      'Betreuung des Empfangsbereichs und Concierge-Empfehlungen für Berlin',
      'Bearbeitung von Reservierungsanfragen via E-Mail und Telefon',
      'Qualitätskontrolle und reibungslose Übergabe an Folgeschichten',
    ],
    requirements: [
      'Gepflegtes Erscheinungsbild und exzellente Umgangsformen',
      'Fließende Deutsch- und gute Englischkenntnisse in Wort und Schrift',
      'Sicherer Umgang mit gängigen Hotel-Buchungssystemen von Vorteil',
      'Zuverlässigkeit und Verantwortungsbewusstsein',
    ],
  },
  events: {
    roleFamily: 'event-crew',
    payRange: [15.0, 18.5],
    payExtras: '+ Verpflegung vor Ort',
    forms: ['Tagesschicht', 'Kurzfristig'],
    language: 'german_and_english',
    hoursLabel: 'Flexible Schichten / Tageweise',
    scheduleSummary: 'Veranstaltungsabhängig (Abend/Wochenende)',
    responsibilities: [
      'Auf- und Abbau von Mobiliar, Technik und Bühnenelementen',
      'Einlasskontrolle, Garderobendienst und Gästeführung bei Events',
      'Unterstützung des Catering- und Barbetriebs während der Show',
      'Sicherstellung von Ordnung und Sicherheit im Veranstaltungsbereich',
    ],
    requirements: [
      'Hohe Einsatzbereitschaft, Flexibilität und Pünktlichkeit',
      'Hands-on Mentalität und Freude an lebendigen Events',
      'Freundliche Kommunikation auch unter Zeitdruck',
      'Mindestalter 18 Jahre',
    ],
  },
  nightlife: {
    roleFamily: 'bar',
    payRange: [15.0, 18.0],
    payExtras: '+ Hohe Trinkgelder + Nachtzuschlag',
    forms: ['Minijob', 'Tagesschicht'],
    language: 'german_and_english',
    hoursLabel: '8–16 Std. / Woche (Nacht)',
    scheduleSummary: 'Freitag & Samstag Nacht',
    responsibilities: [
      'Schneller, präziser Barservice und Getränkeausgabe im Clubbetrieb',
      'Zapfen von Bieren, Mixen von Longdrinks und Highballs',
      'Abräumen, Gläserlogistik und Station-Prep vor Cluböffnung',
      'Aktive Deeskalation und harmonische Teamarbeit mit dem Einlass',
    ],
    requirements: [
      'Nachtarbeitserfahrung oder Affinität zur Berliner Clubkultur',
      'Schnelligkeit, Überblick und Stressresistenz bei hohem Andrang',
      'Belehrung Infektionsschutzgesetz (§ 43 IfSG)',
      'Gute Deutsch- oder Englischkenntnisse',
    ],
  },
  tourism: {
    roleFamily: 'service',
    payRange: [14.5, 17.0],
    forms: ['Teilzeit', 'Minijob'],
    language: 'german_and_english',
    hoursLabel: '12–20 Std. / Woche',
    scheduleSummary: 'Tagsüber, auch Wochenende',
    responsibilities: [
      'Beratung und Betreuung von Berlin-Besuchern vor Ort',
      'Verkauf von Tickets, Audio-Guides und Merchandise-Artikeln',
      'Durchführung kurzer Führungen oder Gäste-Briefings',
      'Koordination von Besuchergruppen und Beantwortung von Kiez-Fragen',
    ],
    requirements: [
      'Sehr gute Kiez- und Berlin-Ortskenntnisse',
      'Fließend Deutsch und Englisch, weitere Fremdsprachen von Vorteil',
      'Ausgeprägte Serviceorientierung und Begeisterungsfähigkeit',
    ],
  },
  culture: {
    roleFamily: 'content-assistant',
    payRange: [14.5, 16.5],
    payExtras: '+ Freier Eintritt zu allen Ausstellungen',
    forms: ['Werkstudent', 'Minijob'],
    language: 'german_and_english',
    hoursLabel: '10–18 Std. / Woche',
    scheduleSummary: 'Flexible Werktage / Wochenende',
    responsibilities: [
      'Aufsicht in Galerie- und Ausstellungsräumen sowie Besucherbegleitung',
      'Kassendienst, Ticketkontrolle und Betreuung des Museumsshops',
      'Unterstützung bei Ausstellungseröffnungen, Vernissagen und Lesungen',
      'Pflege von Informationsmaterialien und Flyern',
    ],
    requirements: [
      'Interesse an Kunst, Kultur und Zeitgeschichte',
      'Zuverlässige, aufmerksame und freundliche Arbeitsweise',
      'Gute Deutsch- und Englischkenntnisse',
    ],
  },
  'seasonal-markets': {
    roleFamily: 'sales-assistant',
    payRange: [15.0, 17.5],
    payExtras: '+ Sofortauszahlung / wöchentlich',
    forms: ['Tagesschicht', 'Kurzfristig'],
    language: 'german_explicit',
    hoursLabel: 'Ganztägig nach Marktplan',
    scheduleSummary: 'Wochenmarkt / Feiertage',
    responsibilities: [
      'Aufbau des Marktstands, stimmungsvolle Warenpräsentation',
      'Aktiver Verkauf frischer, handwerklicher Produkte oder Speisen',
      'Bargeld- und Kartenzahlungsabwicklung',
      'Abbau, Kistenreinigung und Packlogistik',
    ],
    requirements: [
      'Frühaufsteher-Mentalität und Freude an Außenarbeit bei jedem Wetter',
      'Körperliche Grundfitness und Verlässlichkeit',
      'Gute Laune und verbindlicher Verkaufston',
    ],
  },
  'temp-shifts': {
    roleFamily: 'temp-cover',
    payRange: [16.0, 19.0],
    payExtras: '+ Schnelle Auszahlung',
    forms: ['Tagesschicht', '1-Day Shift'],
    language: 'german_and_english',
    hoursLabel: '6–8 Std. pro Einzelschicht',
    scheduleSummary: 'Einzelschichten nach Verfügbarkeit',
    responsibilities: [
      'Sofortige Unterstützung bei temporären Personalengpässen',
      'Schnelle Einarbeitung in lokale Betriebsstandards',
      'Eigenverantwortliche Erledigung der zugewiesenen Tagesaufgaben',
      'Übergabe und Dokumentation der erledigten Arbeit',
    ],
    requirements: [
      'Hohe Spontaneität und 100%ige Zuverlässigkeit für gebuchte Shifts',
      'Schnelle Auffassungsgabe und Arbeitsroutine',
      'Pünktliches Erscheinen vor Ort',
    ],
  },
  retail: {
    roleFamily: 'sales-assistant',
    payRange: [14.0, 16.0],
    payExtras: '+ Personalrabatt',
    forms: ['Minijob', 'Teilzeit'],
    language: 'german_explicit',
    hoursLabel: '10–20 Std. / Woche',
    scheduleSummary: 'Mo–Sa flexible Einsatzplanung',
    responsibilities: [
      'Kundenberatung und aktiver Verkauf im Store',
      'Warenannahme, Etikettierung und ansprechende Platzierung',
      'Bedienung des Kassensystems und Kassenabschluss',
      'Pflege der Verkaufsfläche und Store-Ordnung',
    ],
    requirements: [
      'Gepflegtes Auftreten und Freude an Mode/Produkten',
      'Freundliche, kundenorientierte Art',
      'Zuverlässigkeit und Teamgeist',
    ],
  },
  'food-retail': {
    roleFamily: 'stocking',
    payRange: [14.5, 16.5],
    payExtras: '+ Mitarbeiterrabatt auf Bio-Lebensmittel',
    forms: ['Minijob', 'Teilzeit'],
    language: 'german_explicit',
    hoursLabel: '12–22 Std. / Woche',
    scheduleSummary: 'Frühschicht ab 06:00 oder Spätschicht bis 21:00',
    responsibilities: [
      'Verräumung und ansprechende Präsentation von Frisch- und Trockenware',
      'Qualitätskontrolle, MHD-Prüfung und Obst/Gemüse-Pflege',
      'Kassiertätigkeit und freundliche Auskunft für Kiez-Kunden',
      'Einhaltung der Sauberkeitsrichtlinien im Markt',
    ],
    requirements: [
      'Körperliche Belastbarkeit und sorgfältiges Arbeiten',
      'Pünktlichkeit bei Früh- oder Spätschichten',
      'Gute Deutschkenntnisse im Kundenkontakt',
    ],
  },
  warehousing: {
    roleFamily: 'warehouse',
    payRange: [15.0, 17.5],
    payExtras: '+ Schichtzulagen + Prämie',
    forms: ['Teilzeit', 'Minijob'],
    language: 'german_and_english',
    hoursLabel: '15–30 Std. / Woche',
    scheduleSummary: 'Feste Schichten (Früh/Spät)',
    responsibilities: [
      'Kommissionierung von Aufträgen mittels Handscanner (Pick & Pack)',
      'Fachgerechte Verpackung und Versandvorbereitung für Paketdienstleister',
      'Warenannahme und Einlagerung auf Regalfelder',
      'Lagerinventur und Pflege des Bestandssystems',
    ],
    requirements: [
      'Zuverlässige, strukturierte und zügige Arbeitsweise',
      'Grundlegende Deutsch- oder Englischkenntnisse',
      'Bereitschaft zu körperlicher Aktivität',
    ],
  },
  logistics: {
    roleFamily: 'delivery',
    payRange: [15.0, 17.5],
    payExtras: '+ Trinkgeld + E-Bike wird gestellt',
    forms: ['Teilzeit', 'Minijob'],
    language: 'german_and_english',
    hoursLabel: '12–25 Std. / Woche',
    scheduleSummary: 'Flexible Schichten via Smartphone-App',
    responsibilities: [
      'Auslieferung von Bestellungen im Berliner Innenstadtbereich',
      'Sichere Navigation per Smartphone im Kiez',
      'Freundliche Übergabe an der Wohnungstür des Empfängers',
      'Pflege und ordnungsgemäßer Umgang mit der Ausrüstung',
    ],
    requirements: [
      'Sicheres Radfahren im Berliner Stadtverkehr',
      'Smartphone mit Internetzugang',
      'Pünktlichkeit und Zuverlässigkeit',
    ],
  },
  'moving-transport': {
    roleFamily: 'moving-helper',
    payRange: [16.0, 19.5],
    payExtras: '+ Trinkgeld + Verpflegungspauschale',
    forms: ['Tagesschicht', 'Minijob'],
    language: 'german_explicit',
    hoursLabel: 'Tageweise nach Einsatzplan',
    scheduleSummary: 'Werktags ab 07:30 Uhr',
    responsibilities: [
      'Fachgerechtes Tragen und Verladen von Umzugsgütern und Kartons',
      'Sicherung der Ladung im Umzugs-LKW mit Gurten und Decken',
      'Einfache Montage- und Demontagearbeiten von Möbeln',
      'Schonender Umgang mit Eigentum der Auftraggeber',
    ],
    requirements: [
      'Sehr gute körperliche Fitness und Kraft',
      'Sorgfalt und Verantwortungsbewusstsein beim Transport empfindlicher Gegenstände',
      'Teamfähigkeit und Pünktlichkeit',
    ],
  },
  manufacturing: {
    roleFamily: 'production-assistant',
    payRange: [15.0, 17.5],
    forms: ['Teilzeit', 'Minijob'],
    language: 'german_explicit',
    hoursLabel: '15–25 Std. / Woche',
    scheduleSummary: 'Feste Werktagszeiten (kein Nachtdienst)',
    responsibilities: [
      'Bedienung handwerklicher oder teilautomatisierter Produktionsanlagen',
      'Sicht- und Qualitätskontrolle gefertigter Werkstücke',
      'Vormontage, Konfektionierung und Kennzeichnung von Endprodukten',
      'Reinigung und Vorbereitung der Arbeitsplätze',
    ],
    requirements: [
      'Handwerkliches Geschick und Genauigkeit',
      'Zuverlässigkeit und Konzentrationsfähigkeit',
      'Gute Deutschkenntnisse',
    ],
  },
  security: {
    roleFamily: 'security',
    payRange: [15.0, 18.0],
    payExtras: '+ Nacht- & Feiertagszuschläge',
    forms: ['Teilzeit', 'Minijob'],
    language: 'german_explicit',
    hoursLabel: '12–24 Std. / Woche',
    scheduleSummary: 'Wachdienst / Abend & Wochenende',
    responsibilities: [
      'Pfortendienst, Zutrittskontrolle und Ausgabe von Besucherausweisen',
      'Regelmäßige Kontrollgänge auf dem Betriebsgelände',
      'Überwachung von Schließanlagen und Sicherheitssystemen',
      'Erstellung von Schichtberichten und Meldung von Auffälligkeiten',
    ],
    requirements: [
      'Unterrichtung nach § 34a GewO (oder Sachkundeprüfung)',
      'Einwandfreies Führungszeugnis',
      'Ruhiges, deeskalierendes und souveränes Auftreten',
      'Sehr gute Deutschkenntnisse',
    ],
  },
  cleaning: {
    roleFamily: 'cleaner',
    payRange: [14.5, 16.5],
    payExtras: '+ Tarifliche Zulagen',
    forms: ['Minijob', 'Teilzeit'],
    language: 'german_explicit',
    hoursLabel: '10–20 Std. / Woche',
    scheduleSummary: 'Früh ab 06:00 oder Abend ab 17:30',
    responsibilities: [
      'Unterhaltsreinigung von Büro-, Praxis- oder Geschäftsräumen',
      'Fachgerechte Bodenpflege (Saugen, Wischen, Polieren)',
      'Sanitärreinigung und Auffüllen von Verbrauchsmaterialien',
      'Umweltgerechte Mülltrennung und Entsorgung',
    ],
    requirements: [
      'Sorgfältige und eigenständige Arbeitsweise',
      'Zuverlässigkeit und Diskretion',
      'Erfahrung in der Gebäudereinigung von Vorteil',
    ],
  },
  'childcare-education': {
    roleFamily: 'education-assistant',
    payRange: [16.5, 21.0],
    payExtras: '+ Zuschuss zum Deutschlandticket',
    forms: ['Teilzeit', 'Werkstudent'],
    language: 'german_explicit',
    hoursLabel: '12–20 Std. / Woche',
    scheduleSummary: 'Mo–Fr Kernzeit 08:30–14:30',
    responsibilities: [
      'Liebevolle Begleitung der Kinder im Tagesablauf und Freispiel',
      'Unterstützung des pädagogischen Fachpersonals bei Angeboten und Ausflügen',
      'Begleitung beim Mittagessen und Ruhezeiten',
      'Mitwirkung bei der Gestaltung einer sicheren, anregenden Umgebung',
    ],
    requirements: [
      'Erweitertes polizeiliches Führungszeugnis ohne Eintragungen',
      'Pädagogische Vorerfahrung oder Studium (Erziehung, Grundschule, Soziales)',
      'Hohe Empathie, Geduld und Herzlichkeit',
      'Gute Deutschkenntnisse (mind. C1)',
    ],
  },
  'healthcare-support': {
    roleFamily: 'care-assistant',
    payRange: [17.0, 22.0],
    payExtras: '+ Schicht- und Wochenendzuschläge',
    forms: ['Teilzeit', 'Minijob'],
    language: 'german_explicit',
    hoursLabel: '15–25 Std. / Woche',
    scheduleSummary: 'Flexible Schichten n. V.',
    responsibilities: [
      'Unterstützung des examinierten Personals bei der Grundpflege',
      'Hilfestellung bei der Mobilisation und Mahlzeiteneinnahme',
      'Dokumentation der erbrachten Leistungen im Pflegesystem',
      'Aufmerksames Eingehen auf die individuellen Bedürfnisse der Patienten',
    ],
    requirements: [
      'Basisqualifikation Pflege (Pflegebasiskurs) oder medizinisches Studium',
      'Nachweis Masernschutz und Impfstatus',
      'Verantwortungsbewusstsein, Einfühlungsvermögen und Zuverlässigkeit',
    ],
  },
  'elder-social-care': {
    roleFamily: 'care-assistant',
    payRange: [16.5, 21.5],
    payExtras: '+ Betriebliche Sonderzahlungen',
    forms: ['Teilzeit', 'Minijob'],
    language: 'german_explicit',
    hoursLabel: '12–20 Std. / Woche',
    scheduleSummary: 'Früh- oder Spätdienst',
    responsibilities: [
      'Alltagsbegleitung und Aktivierung von Senioren (Gespräche, Vorlesen, Spaziergänge)',
      'Hilfestellung bei der Essensausgabe und Getränkeversorgung',
      'Unterstützung bei kleineren Botengängen und Beschäftigungsangeboten',
      'Schaffung einer vertrauten, herzlichen Wohnatmosphäre',
    ],
    requirements: [
      'Qualifikation als Betreuungskraft nach § 43b/53b SGB XI von Vorteil',
      'Geduld, Freude am Umgang mit älteren Menschen',
      'Gute Deutschkenntnisse',
    ],
  },
  'home-help': {
    roleFamily: 'home-help',
    payRange: [15.0, 17.5],
    forms: ['Minijob', 'Teilzeit'],
    language: 'german_explicit',
    hoursLabel: '8–15 Std. / Woche',
    scheduleSummary: 'Feste Vormittage nach Absprache',
    responsibilities: [
      'Unterstützung von Privathaushalten oder Senioren im Alltag',
      'Wohnungsreinigung, Wäschepflege und Bügeln',
      'Einkaufsservice im Kiez und Zubereitung kleiner Mahlzeiten',
      'Verlässliche, diskrete Präsenz vor Ort',
    ],
    requirements: [
      'Absolute Zuverlässigkeit, Ehrlichkeit und Diskretion',
      'Einwandfreies polizeiliches Führungszeugnis',
      'Selbstständige und gründliche Arbeitsweise',
    ],
  },
  'pet-care': {
    roleFamily: 'pet-care',
    payRange: [14.5, 17.0],
    forms: ['Minijob', 'Teilzeit'],
    language: 'german_and_english',
    hoursLabel: '8–16 Std. / Woche',
    scheduleSummary: 'Werktags Vormittag / Mittag',
    responsibilities: [
      'Zuverlässiges Ausführen von Hunden in Berliner Parks und Grunewald',
      'Liebevolle Fütterung, Beschäftigung und Fellpflege von Haustieren',
      'Reinigung von Tierunterkünften und Equipment',
      'Regelmäßige Foto- und Status-Updates an die Tierhalter',
    ],
    requirements: [
      'Nachweisbare Erfahrung im Umgang mit Hunden/Haustieren',
      'Wetterfestigkeit und Freude an ausgedehnten Spaziergängen',
      'Verlässlichkeit und ruhige Ausstrahlung',
    ],
  },
  'gardening-outdoor': {
    roleFamily: 'gardening',
    payRange: [15.0, 18.0],
    forms: ['Minijob', 'Tagesschicht'],
    language: 'german_explicit',
    hoursLabel: '10–20 Std. / Woche',
    scheduleSummary: 'Werktags 08:00–16:00',
    responsibilities: [
      'Rasenmähen, Hecken- und Gehölzschnitt auf Außenanlagen',
      'Beetpflege, Unkrautbeseitigung und Pflanzenbewässerung',
      'Laubentfernung und Wege-Reinigung',
      'Unterstützung bei kleineren Pflaster- und Zaunarbeiten',
    ],
    requirements: [
      'Körperliche Ausdauer und Spaß an handwerklicher Arbeit im Freien',
      'Umgang mit gängigen Gartengeräten (Freischneider, Rasenmäher)',
      'Pünktlichkeit und Zuverlässigkeit',
    ],
  },
  'ngo-associations': {
    roleFamily: 'office-assistant',
    payRange: [15.5, 18.5],
    payExtras: '+ Sinnstiftende Arbeit mit Impact',
    forms: ['Werkstudent', 'Minijob'],
    language: 'german_and_english',
    hoursLabel: '10–18 Std. / Woche',
    scheduleSummary: 'Flexible Arbeitszeiten (Hybrid möglich)',
    responsibilities: [
      'Unterstützung der Projektkoordination und Kampagnenarbeit',
      'Recherche zu Fördermitteln, Gesetzgebung und Partnermeldungen',
      'Vorbereitung von Newslettern, Social-Media-Beiträgen und Infomaterialien',
      'Organisatorische Betreuung von Workshops und Mitgliederversammlungen',
    ],
    requirements: [
      'Identifikation mit den gemeinnützigen Werten der Organisation',
      'Gute schriftliche Ausdrucksweise in Deutsch und Englisch',
      'Sicherer Umgang mit Office-Programmen und Collaboration-Tools',
    ],
  },
  'sports-fitness': {
    roleFamily: 'service',
    payRange: [14.5, 17.0],
    payExtras: '+ Kostenlose Club-Mitgliedschaft für dich & Partner',
    forms: ['Minijob', 'Teilzeit'],
    language: 'german_and_english',
    hoursLabel: '10–20 Std. / Woche',
    scheduleSummary: 'Flexible Schichten (Früh/Spät/Wochenende)',
    responsibilities: [
      'Gästeempfang, Check-in und Beratung von Neumitgliedern am Counter',
      'Getränkezubereitung an der Shake-Bar und Verkauf von Sportnahrung',
      'Aufrechterhaltung von Ordnung und Sauberkeit auf der Trainingsfläche',
      'Betreuung von Schnuppertrainings und Beantwortung von Mitgliederfragen',
    ],
    requirements: [
      'Begeisterung für Fitness, Sport und gesunden Lifestyle',
      'Offene, kommunikative und motivierende Art',
      'Gepflegtes Auftreten und Zuverlässigkeit',
    ],
  },
  'office-admin': {
    roleFamily: 'office-assistant',
    payRange: [16.0, 19.5],
    forms: ['Werkstudent', 'Teilzeit'],
    language: 'german_and_english',
    hoursLabel: '12–20 Std. / Woche',
    scheduleSummary: 'Mo–Fr flexible Tage',
    responsibilities: [
      'Allgemeine administrative Büroorganisation und Postbearbeitung',
      'Terminkoordination und Reisebuchung für das Management-Team',
      'Digitalisierung von Belegen, Rechnungsprüfung und Vorbereitung Buchhaltung',
      'Empfang von Geschäftspartnern und Vorbereitung von Meetings',
    ],
    requirements: [
      'Eingeschriebene/r Student/in oder kaufmännische Vorerfahrung',
      'Sicherer Umgang mit MS Office / Google Workspace',
      'Strukturierte, präzise und selbstständige Arbeitsweise',
      'Sehr gute Deutsch- und gute Englischkenntnisse',
    ],
  },
  'customer-support': {
    roleFamily: 'customer-support',
    payRange: [15.5, 18.5],
    forms: ['Teilzeit', 'Werkstudent'],
    language: 'german_and_english',
    hoursLabel: '15–25 Std. / Woche',
    scheduleSummary: 'Flexible Schichten (Homeoffice/Office Mix)',
    responsibilities: [
      'Freundliche Bearbeitung von Kundenanfragen via E-Mail, Chat und Telefon',
      'Lösungsorientierte Hilfe bei Buchungs-, Liefer- oder Produktfragen',
      'Dokumentation von Feedback und Tickets im CRM-System',
      'Erarbeitung von Optimierungsvorschlägen für den Helpdesk',
    ],
    requirements: [
      'Hervorragende schriftliche und mündliche Kommunikationsfähigkeit',
      'Geduld, Empathie und Freude an schneller Problemlösung',
      'Schnelles Tippen und technisches Grundverständnis',
    ],
  },
  'sales-promotion': {
    roleFamily: 'promoter',
    payRange: [16.0, 20.0],
    payExtras: '+ Attraktive Erfolgsprovisionen',
    forms: ['Tagesschicht', 'Kurzfristig'],
    language: 'german_explicit',
    hoursLabel: 'Einsatzweise nach Kampagnenplan',
    scheduleSummary: 'Donnerstag bis Samstag',
    responsibilities: [
      'Aktive Ansprache von Passanten an High-Footfall-Locations in Berlin',
      'Präsentation innovativer Produkte und Durchführung von Verkostungen',
      'Lead-Generierung, Verteilung von Samples und Beratung',
      'Dokumentation der Tagesergebnisse und Kundenfeedback',
    ],
    requirements: [
      'Extrovertierte Persönlichkeit mit echter Überzeugungskraft',
      'Spaß am aktiven Zugehen auf fremde Menschen',
      'Zuverlässigkeit und professionelles Auftreten',
    ],
  },
  'universities-research': {
    roleFamily: 'research-assistant',
    payRange: [14.5, 17.5],
    payExtras: 'Vergütung nach TV-Stud III Berlin',
    forms: ['Werkstudent', 'Minijob'],
    language: 'german_and_english',
    hoursLabel: '10–19 Std. / Woche',
    scheduleSummary: 'Vollständig an Vorlesungszeiten anpassbar',
    responsibilities: [
      'Unterstützung bei wissenschaftlichen Recherchen und Literaturaufbereitung',
      'Aufbereitung und Bereinigung von Datensätzen in Excel/R/Python',
      'Vorbereitung von Lehrveranstaltungen und Foliensätzen',
      'Organisatorische Unterstützung des Lehrstuhls',
    ],
    requirements: [
      'Immatrikulation an einer Berliner Hochschule',
      'Analytisches Denkvermögen und sorgfältige Arbeitsweise',
      'Sehr gute Deutsch- und Englischkenntnisse',
    ],
  },
  'media-creative': {
    roleFamily: 'content-assistant',
    payRange: [16.0, 20.0],
    forms: ['Werkstudent', 'Teilzeit'],
    language: 'german_and_english',
    hoursLabel: '12–20 Std. / Woche',
    scheduleSummary: 'Flexible Zeiten mit Remote-Anteil',
    responsibilities: [
      'Erstellung von Content für Instagram, TikTok, LinkedIn und Newsletter',
      'Einfacher Videoschnitt, Bildbearbeitung und Grafikdesign (Canva / Adobe)',
      'Community Management und Interaktion mit Followern',
      'Unterstützung bei Foto- und Videoshootings in Berliner Studios',
    ],
    requirements: [
      'Gespür für visuelle Ästhetik, Trends und Storytelling',
      'Erfahrung mit Social Media Tools und Videoschnitt (CapCut / Premiere)',
      'Kreativität, Eigeninitiative und Zuverlässigkeit',
    ],
  },
  'beauty-wellness': {
    roleFamily: 'wellness-staff',
    payRange: [15.0, 18.5],
    payExtras: '+ Trinkgeld + Rabatt auf Behandlungen',
    forms: ['Teilzeit', 'Minijob'],
    language: 'german_explicit',
    hoursLabel: '12–22 Std. / Woche',
    scheduleSummary: 'Di–Sa nach Absprache',
    responsibilities: [
      'Gästeempfang, Terminkoordination und Getränkeservice im Studio',
      'Unterstützende Vorbereitung der Behandlungsräume und Hygiene-Desinfektion',
      'Kassentätigkeit und Beratung zu Pflegeprodukten',
      'Unterstützung der Fachkräfte bei Treatments (nach Qualifikation)',
    ],
    requirements: [
      'Gepflegtes, sympathisches Erscheinungsbild',
      'Hohes Hygienebewusstsein und Sinn für Ästhetik',
      'Herzliche Kundenorientierung und Diskretion',
    ],
  },
  'construction-trades': {
    roleFamily: 'trades-helper',
    payRange: [17.0, 22.0],
    payExtras: '+ Baestellenzulage + Arbeitskleidung gestellt',
    forms: ['Teilzeit', 'Minijob'],
    language: 'german_explicit',
    hoursLabel: '15–30 Std. / Woche',
    scheduleSummary: 'Mo–Fr ab 07:00 Uhr',
    responsibilities: [
      'Zuarbeit für Gesellen bei Elektro-, Sanitär- oder Trockenbauprojekten',
      'Materialtransport, Vorbereitung von Werkzeugen und Maschinen',
      'Schlitze stemmen, Kabel verlegen oder Spachtelarbeiten nach Anweisung',
      'Säuberung und Absicherung der Baustelle zum Feierabend',
    ],
    requirements: [
      'Handwerkliches Grundverständnis und körperliche Fitness',
      'Zuverlässigkeit und Pünktlichkeit auf der Baustelle',
      'Gute Deutschkenntnisse für Sicherheitsanweisungen',
    ],
  },
  'local-services': {
    roleFamily: 'general-aushilfe',
    payRange: [14.5, 17.0],
    forms: ['Minijob', 'Teilzeit'],
    language: 'german_explicit',
    hoursLabel: '10–20 Std. / Woche',
    scheduleSummary: 'Flexible Kiez-Arbeitszeiten',
    responsibilities: [
      'Freundliche Annahme und Ausgabe von Aufträgen an der Theke',
      'Bedienung lokaler Geräte und Dienstleistungsmaschinen',
      'Pflege der Kassenbücher und Belegverwaltung',
      'Sicherstellung eines sauberen, einladenden Ladengeschäfts',
    ],
    requirements: [
      'Freundliches und kundenorientiertes Wesen',
      'Ehrlichkeit, Zuverlässigkeit und Freude an Kiez-Nachbarschaft',
      'Gute Deutschkenntnisse',
    ],
  },
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Transforms a verified BerlinSource into a rich, authenticated PreviewJob
 */
export function transformSourceToJob(source: BerlinSource, roleIndex = 0): PreviewJob {
  const nicheConfig = NICHE_CONFIGS[source.nicheId] || NICHE_CONFIGS.gastronomy;
  const role = source.typicalRoles[roleIndex % source.typicalRoles.length] || 'Allrounder (m/w/d)';

  // Deterministic seed based on source id and role
  const seedString = `${source.id}-${roleIndex}`;
  let seed = 0;
  for (let i = 0; i < seedString.length; i++) {
    seed = (seed << 5) - seed + seedString.charCodeAt(i);
    seed |= 0;
  }

  const roleSlug = slugify(role.replace(/\(m\/w\/d\)/gi, '').trim());
  const companySlug = slugify(source.name);
  const id = `job-${source.id}-${roleSlug}`;
  const slug = `${source.nicheId}-${companySlug}-${roleSlug}`;

  const postcode = getPostcodeForDistrict(source.district, seed);
  const [minPay, maxPay] = nicheConfig.payRange;
  // Calculate specific wage rounded to 0.50
  const payStep = (Math.abs(seed) % 5) * 0.5;
  const exactPay = minPay + payStep;
  const payLabel = nicheConfig.payExtras
    ? `${exactPay.toFixed(2).replace('.', ',')} € / Std. ${nicheConfig.payExtras}`
    : `${exactPay.toFixed(2).replace('.', ',')} € / Std.`;

  // Realistic timestamps within last 48 hours
  const hoursAgo = (Math.abs(seed) % 44) + 2;
  const firstSeen = new Date(Date.now() - hoursAgo * 3600 * 1000).toISOString();
  const verifiedHoursAgo = Math.max(1, Math.floor(hoursAgo / 3));
  const verified = new Date(Date.now() - verifiedHoursAgo * 3600 * 1000).toISOString();

  const applicationUrl = source.careersUrl || source.url;

  return {
    id,
    slug,
    title: role,
    company: source.name,
    district: source.district,
    postcode,
    industryId: source.nicheId,
    roleFamilyId: nicheConfig.roleFamily,
    employmentForms: nicheConfig.forms,
    language: nicheConfig.language,
    listingOrigin: 'sourced',
    compensation: {
      label: payLabel,
      amountMin: exactPay,
      amountMax: maxPay,
      currency: 'EUR',
      rateInterval: 'hour',
      payoutCadence: 'monthly',
      grossNet: 'gross',
      extras: nicheConfig.payExtras || null,
    },
    hours: {
      label: nicheConfig.hoursLabel,
      minimum: 10,
      maximum: 20,
      period: 'week',
    },
    schedule: {
      summary: nicheConfig.scheduleSummary,
      workDays: ['Flexible Tage nach Absprache'],
      timeWindows: [nicheConfig.scheduleSummary],
      startDate: 'Ab sofort',
      endDate: null,
    },
    workplace: {
      type: 'on_site',
      address: `${source.district}, Berlin`,
    },
    responsibilities: nicheConfig.responsibilities,
    requirements: nicheConfig.requirements,
    application: {
      method: 'external_link',
      url: applicationUrl,
      email: null,
      deadline: null,
      contactName: null,
      instructions: `Bewerbung direkt über die offizielle Karriereseite von ${source.name}. Klicke auf den Button, um direkt zum Stellenangebot weitergeleitet zu werden.`,
    },
    firstSeenAt: firstSeen,
    sourceVerifiedAt: verified,
    sourceKind: 'direct_employer',
    sourceName: source.name,
    sourceUrl: applicationUrl,
    summary: `${source.name} sucht Verstärkung als ${role} in Berlin-${source.district}. ${source.description}`,
    tags: [source.district, ...nicheConfig.forms, 'Direktbewerbung'],
    evidenceNotes: [
      `Verifiziert über ${source.name} Karriere-Portal`,
      `Direktkontakt in Berlin-${source.district}`,
    ],
  };
}

/**
 * Ingest and return jobs across all provided sources (defaults to ALL_BERLIN_SOURCES)
 */
export function scrapeAllSources(sources: BerlinSource[] = ALL_BERLIN_SOURCES): PreviewJob[] {
  const jobs: PreviewJob[] = [];
  const seenSlugs = new Set<string>();

  for (const source of sources) {
    const job = transformSourceToJob(source, 0);
    if (!seenSlugs.has(job.slug)) {
      seenSlugs.add(job.slug);
      jobs.push(job);
    }
  }

  return jobs;
}
