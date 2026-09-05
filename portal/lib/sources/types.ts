export interface BerlinSource {
  id: string;
  name: string;
  nicheId: string;
  url: string;
  careersUrl?: string;
  district: string;
  neighborhood?: string;
  sourceKind: 'direct_employer';
  description: string;
  typicalRoles: string[];
  hiringCadence?: 'continuous' | 'seasonal' | 'shift_based';
}
