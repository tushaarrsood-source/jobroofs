export interface BerlinSource {
  id: string;
  name: string;
  nicheId: string;
  url: string;
  careersUrl?: string;
  district: string;
  neighborhood?: string;
  sourceKind:
    | 'direct_employer'
    | 'public_institution'
    | 'cooperative'
    | 'local_agency'
    | 'specialist_board'
    | 'large_board';
  description: string;
  typicalRoles: string[];
  hiringCadence?: 'continuous' | 'seasonal' | 'shift_based';
}
