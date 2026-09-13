/**
 * Supported German Cities and District Breakdowns
 * Empowers independent listings across entire Germany.
 */

export interface CityDefinition {
  id: string;
  name: string;
  state: string;
  districts: string[];
  popularDistricts: string[];
  description?: string;
}

export const SUPPORTED_CITIES: CityDefinition[] = [
  {
    id: 'berlin',
    name: 'Berlin',
    state: 'Berlin',
    districts: [
      'Mitte',
      'Kreuzberg',
      'Neukölln',
      'Friedrichshain',
      'Prenzlauer Berg',
      'Charlottenburg',
      'Schöneberg',
      'Wedding',
      'Tempelhof',
      'Moabit',
      'Pankow',
      'Lichtenberg',
      'Steglitz',
      'Treptow',
    ],
    popularDistricts: [
      'Mitte',
      'Kreuzberg',
      'Neukölln',
      'Friedrichshain',
      'Prenzlauer Berg',
      'Charlottenburg',
    ],
    description: 'Cafés, Kiez-Läden, Ateliers & Bars in Berlin',
  },
  {
    id: 'hamburg',
    name: 'Hamburg',
    state: 'Hamburg',
    districts: [
      'Altona',
      'St. Pauli',
      'Sternschanze',
      'Winterhude',
      'Eimsbüttel',
      'Hamburg-Mitte',
      'HafenCity',
      'Wandsbek',
      'Eppendorf',
      'St. Georg',
      'Barmbek',
      'Ottensen',
    ],
    popularDistricts: [
      'Altona',
      'St. Pauli',
      'Sternschanze',
      'Winterhude',
      'Eimsbüttel',
      'HafenCity',
    ],
    description: 'Hafen-Gastronomie, Boutiquen & Kiez-Betriebe in Hamburg',
  },
  {
    id: 'muenchen',
    name: 'München',
    state: 'Bayern',
    districts: [
      'Schwabing',
      'Glockenbachviertel',
      'Maxvorstadt',
      'Haidhausen',
      'Sendling',
      'Altstadt-Lehel',
      'Neuhausen',
      'Giesing',
      'Bogenhausen',
      'Ludwigsvorstadt',
      'Westend',
    ],
    popularDistricts: [
      'Schwabing',
      'Glockenbachviertel',
      'Maxvorstadt',
      'Haidhausen',
      'Altstadt-Lehel',
      'Neuhausen',
    ],
    description: 'Traditionsbäckereien, Specialty Coffee & Boutiquen in München',
  },
  {
    id: 'koeln',
    name: 'Köln',
    state: 'Nordrhein-Westfalen',
    districts: [
      'Ehrenfeld',
      'Belgisches Viertel',
      'Südstadt',
      'Nippes',
      'Innenstadt',
      'Lindenthal',
      'Deutz',
      'Mülheim',
      'Sülz',
      'Agnesviertel',
    ],
    popularDistricts: [
      'Ehrenfeld',
      'Belgisches Viertel',
      'Südstadt',
      'Nippes',
      'Innenstadt',
    ],
    description: 'Veedel-Cafés, Ateliers & Kölner Kiez-Kultur',
  },
  {
    id: 'frankfurt',
    name: 'Frankfurt am Main',
    state: 'Hessen',
    districts: [
      'Sachsenhausen',
      'Bornheim',
      'Nordend',
      'Bockenheim',
      'Innenstadt',
      'Westend',
      'Bahnhofsviertel',
      'Gallus',
      'Ostend',
    ],
    popularDistricts: [
      'Sachsenhausen',
      'Bornheim',
      'Nordend',
      'Bockenheim',
      'Innenstadt',
    ],
    description: 'Kreative Gastro, Feinkost & lokale Läden am Main',
  },
  {
    id: 'leipzig',
    name: 'Leipzig',
    state: 'Sachsen',
    districts: [
      'Plagwitz',
      'Connewitz',
      'Südvorstadt',
      'Lindenau',
      'Zentrum',
      'Reudnitz',
      'Gohlis',
      'Schleußig',
    ],
    popularDistricts: [
      'Plagwitz',
      'Connewitz',
      'Südvorstadt',
      'Lindenau',
      'Zentrum',
    ],
    description: 'Spätis, Kunsthandwerk, Kaffeeröstereien & Kultur in Leipzig',
  },
  {
    id: 'stuttgart',
    name: 'Stuttgart',
    state: 'Baden-Württemberg',
    districts: [
      'Stuttgart-Mitte',
      'Stuttgart-West',
      'Stuttgart-Süd',
      'Stuttgart-Ost',
      'Bad Cannstatt',
      'Vaihingen',
      'Degerloch',
    ],
    popularDistricts: [
      'Stuttgart-Mitte',
      'Stuttgart-West',
      'Bad Cannstatt',
      'Stuttgart-Süd',
    ],
    description: 'Werkstätten, Weinbistros & Manufakturen in Stuttgart',
  },
  {
    id: 'duesseldorf',
    name: 'Düsseldorf',
    state: 'Nordrhein-Westfalen',
    districts: [
      'Altstadt',
      'Flingern',
      'Unterbilk',
      'Bilk',
      'Stadtmitte',
      'Pempelfort',
      'Oberkassel',
      'Derendorf',
    ],
    popularDistricts: [
      'Altstadt',
      'Flingern',
      'Unterbilk',
      'Bilk',
      'Pempelfort',
    ],
    description: 'Kreativviertel, Ramen-Spots & Modeboutiquen in Düsseldorf',
  },
  {
    id: 'dresden',
    name: 'Dresden',
    state: 'Sachsen',
    districts: [
      'Äußere Neustadt',
      'Altstadt',
      'Pieschen',
      'Johannstadt',
      'Striesen',
      'Löbtau',
    ],
    popularDistricts: ['Äußere Neustadt', 'Altstadt', 'Pieschen', 'Striesen'],
    description: 'Neustadt-Szene, Kunstwerkstätten & Cafés in Dresden',
  },
  {
    id: 'bremen',
    name: 'Bremen',
    state: 'Bremen',
    districts: [
      'Viertel (Ostertor)',
      'Steintor',
      'Mitte',
      'Neustadt',
      'Findorff',
      'Schwachhausen',
      'Überseestadt',
    ],
    popularDistricts: ['Viertel (Ostertor)', 'Mitte', 'Neustadt', 'Findorff'],
    description: 'Kulturprojekte, Kiezbistros & Hanseatische Macher',
  },
];

export function getAllCities(): CityDefinition[] {
  return SUPPORTED_CITIES;
}

export function getCityById(id: string): CityDefinition | undefined {
  return SUPPORTED_CITIES.find((c) => c.id.toLowerCase() === id.toLowerCase());
}

export function getCityByName(name: string): CityDefinition | undefined {
  if (!name) return undefined;
  return SUPPORTED_CITIES.find(
    (c) =>
      c.name.toLowerCase() === name.toLowerCase() ||
      name.toLowerCase().includes(c.name.toLowerCase()) ||
      c.name.toLowerCase().includes(name.toLowerCase())
  );
}

export function getDistrictsForCity(cityIdOrName: string): string[] {
  const city = getCityById(cityIdOrName) || getCityByName(cityIdOrName);
  return city ? city.districts : [];
}

export function getPopularDistrictsForCity(cityIdOrName: string): string[] {
  const city = getCityById(cityIdOrName) || getCityByName(cityIdOrName);
  return city ? city.popularDistricts : [];
}
