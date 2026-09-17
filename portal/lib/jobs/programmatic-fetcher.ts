import { getJobsFromFirestore } from '@/lib/firebase/firestore-service';
import { ALL_SOURCED_JOBS } from '@/lib/sources/sourced-jobs';
import { isJobSuppressed } from '@/lib/sources/suppression-store';

export async function getProgrammaticJobs(typeKey: string, cityId: string) {
  let fsJobs: any[] = [];
  try {
    fsJobs = await getJobsFromFirestore(200);
  } catch (e) {
    // Graceful fallback if offline
  }

  // Normalize sourced jobs
  const validSourced = ALL_SOURCED_JOBS.filter(
    (j) => !isJobSuppressed(j.id) && (!j.slug || !isJobSuppressed(j.slug)),
  );

  // Combine
  const all = [...fsJobs, ...validSourced];

  const cityNorm = (cityId || '').toLowerCase().trim();
  let cityNamesToMatch = [cityNorm];
  if (cityNorm && cityNorm !== 'all' && cityNorm !== 'alle') {
    const { getCityById } = await import('@/lib/domain/cities');
    const cityDef = getCityById(cityNorm);
    if (cityDef) {
      const cName = cityDef.name.toLowerCase();
      const cAscii = cName
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss');
      cityNamesToMatch.push(cName, cAscii, cityDef.id);
    }
  }

  // Filter by city
  const cityFiltered = all.filter((job) => {
    if (!cityNorm || cityNorm === 'all' || cityNorm === 'alle') return true;
    const jCity = (job.city || '').toLowerCase().trim();
    const jDistrict = (job.district || '').toLowerCase().trim();
    const jAddress = (job.workplace?.address || '').toLowerCase();
    
    // Match against any variant of the city name
    const matchesCity = cityNamesToMatch.some(
      (cn) => jCity.includes(cn) || cn.includes(jCity) || jDistrict.includes(cn) || jAddress.includes(cn),
    );
    if (matchesCity) return true;

    // Berlin fallback for legacy listings with no city explicitly set
    if (cityNorm === 'berlin' && (!jCity || jCity === 'berlin')) return true;
    return false;
  });

  // Filter by job type
  const typeFiltered = cityFiltered.filter((job) => {
    if (!typeKey || typeKey === 'stadt') return true;

    const title = (job.title || '').toLowerCase();
    const forms = Array.isArray(job.employmentForms)
      ? job.employmentForms.join(' ').toLowerCase()
      : (job.employmentType || '').toLowerCase();
    const desc = (job.description || '').toLowerCase();
    const text = `${title} ${forms} ${desc}`;

    if (typeKey === 'minijob') {
      return text.includes('mini') || text.includes('aushilfe') || text.includes('nebenjob') || text.includes('603') || text.includes('538');
    }
    if (typeKey === 'studentenjob') {
      return text.includes('student') || text.includes('werkstudent') || text.includes('mini') || text.includes('aushilfe') || text.includes('campus');
    }
    if (typeKey === 'teilzeit') {
      return text.includes('teilzeit') || text.includes('part-time') || text.includes('stunden') || text.includes('schicht');
    }
    if (typeKey === 'werkstudent') {
      return text.includes('werkstudent') || text.includes('student') || text.includes('studium');
    }
    if (typeKey === 'aushilfe') {
      return text.includes('aushilfe') || text.includes('kurzfristig') || text.includes('tages') || text.includes('event') || text.includes('helfer');
    }
    return true;
  });

  // If a specific city has zero jobs yet, show city-filtered or relevant high-quality jobs so page is never completely blank
  if (typeFiltered.length === 0) {
    return cityFiltered.slice(0, 8);
  }

  return typeFiltered;
}
