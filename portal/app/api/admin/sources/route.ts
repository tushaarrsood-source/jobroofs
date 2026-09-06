import { NextResponse } from 'next/server';
import { ALL_BERLIN_SOURCES } from '@/lib/sources/berlin-sources-catalog';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '25', 10)));
    const q = (url.searchParams.get('q') || '').trim().toLowerCase();
    const niche = url.searchParams.get('niche') || 'all';
    const district = (url.searchParams.get('district') || 'all').toLowerCase();

    const matching = ALL_BERLIN_SOURCES.filter((source) => {
      if (niche !== 'all' && source.nicheId !== niche) return false;
      const sourceDistrict = (source.district || '').toLowerCase();
      if (district !== 'all' && !sourceDistrict.includes(district)) return false;

      if (q) {
        const nameMatch = (source.name || '').toLowerCase().includes(q);
        const districtMatch = sourceDistrict.includes(q);
        const descMatch = (source.description || '').toLowerCase().includes(q);
        return nameMatch || districtMatch || descMatch;
      }
      return true;
    });

    const total = matching.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const offset = (page - 1) * limit;
    const pagedSources = matching.slice(offset, offset + limit).map((s) => ({
      id: s.id,
      name: s.name,
      district: s.district,
      nicheId: s.nicheId,
      description: s.description,
      url: s.url,
      careersUrl: s.careersUrl,
      typicalRoles: s.typicalRoles,
    }));

    return NextResponse.json({
      sources: pagedSources,
      page,
      limit,
      total,
      totalPages,
      totalSources: ALL_BERLIN_SOURCES.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
