export type HousingListingType =
  | 'wg_room'
  | 'entire_apartment'
  | 'sublet'
  | 'nachmieter'
  | 'exchange';

export type FurnishingStatus = 'unfurnished' | 'partially' | 'fully';

export type ContractDurationType = 'fixed_term' | 'open_ended';

export type EnergyEfficiencyClass =
  | 'A+'
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H';

export interface HousingListing {
  id: string;
  title: string;
  listingType: HousingListingType;
  district: string;
  postcode: string;
  neighborhood?: string | null;
  streetAddress?: string | null;
  kaltmieteEur: number;
  nebenkostenEur: number;
  warmmieteEur: number;
  kautionEur: number;
  roomSqm: number;
  totalRooms: number;
  floorLevel?: number | null;
  furnished: FurnishingStatus;
  anmeldungPossible: boolean;
  subletAuthorized: boolean;
  contractType: ContractDurationType;
  moveInDate: string;
  moveOutDate?: string | null;
  minStayMonths?: number | null;
  energyClass?: EnergyEfficiencyClass | string | null;
  heatingSource?: string | null;
  buildingYear?: number | null;
  images: string[];
  description: string;
  contactMethod: 'email' | 'in_platform';
  contactEmail: string;
  contactName?: string | null;
  contactPhone?: string | null;
  publicationState: 'published' | 'draft' | 'expired' | 'suppressed';
  firstSeenAt: string;
  expiresAt: string;
  isDemo?: boolean;
}

export const housingTypeLabels: Record<
  HousingListingType,
  { de: string; en: string; descriptionDe: string; descriptionEn: string }
> = {
  wg_room: {
    de: 'WG-Zimmer',
    en: 'Flatshare / WG Room',
    descriptionDe: 'Zimmer in einer geteilten Wohnung',
    descriptionEn: 'Room in a shared flat with flatmates',
  },
  entire_apartment: {
    de: 'Ganze Wohnung',
    en: 'Entire Apartment',
    descriptionDe: 'Eigene Wohnung zur Miete',
    descriptionEn: 'Whole apartment for rent',
  },
  sublet: {
    de: 'Zwischenmiete / Befristet',
    en: 'Temporary Sublet',
    descriptionDe: 'Befristete Untermiete mit festem Auszugsdatum',
    descriptionEn: 'Sublet with fixed move-in and move-out dates',
  },
  nachmieter: {
    de: 'Nachmiete',
    en: 'Successor Tenant (Nachmieter)',
    descriptionDe: 'Übernahme eines bestehenden Mietvertrags',
    descriptionEn: 'Takeover of an existing permanent lease contract',
  },
  exchange: {
    de: 'Wohnungstausch',
    en: 'Apartment Exchange',
    descriptionDe: 'Tausch gegen eine andere Wohnung in Berlin',
    descriptionEn: 'Direct apartment swap with another Berlin tenant',
  },
};

export const furnishingLabels: Record<
  FurnishingStatus,
  { de: string; en: string }
> = {
  fully: { de: 'Voll möbliert', en: 'Fully furnished' },
  partially: { de: 'Teilmöbliert', en: 'Partially furnished' },
  unfurnished: { de: 'Unmöbliert', en: 'Unfurnished' },
};
