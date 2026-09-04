import { resolveHousingCoordinates } from '@/lib/domain/berlin-geo';

export function convertHousingSubmissionToListing(
  submission: { id: string; payloadJson: string; submitterEmail: string },
) {
  const payload = JSON.parse(submission.payloadJson);
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const kaltmiete = Number(payload.kaltmieteEur) || 0;
  const nebenkosten = Number(payload.nebenkostenEur) || 0;
  const warmmiete = Number(payload.warmmieteEur) || kaltmiete + nebenkosten;

  const coords = resolveHousingCoordinates({
    latitude: payload.latitude,
    longitude: payload.longitude,
    postcode: payload.postcode || '10115',
    district: payload.district || 'Berlin',
    neighborhood: payload.neighborhood,
    streetAddress: payload.streetAddress,
    warmmieteEur: warmmiete,
  });

  return {
    id: `house_${crypto.randomUUID().slice(0, 20)}`,
    submissionId: submission.id,
    title: payload.title,
    listingType: payload.listingType || 'wg_room',
    district: payload.district || 'Berlin',
    postcode: payload.postcode || '10115',
    neighborhood: payload.neighborhood || null,
    streetAddress: payload.streetAddress || null,
    latitude: coords.lat,
    longitude: coords.lng,
    kaltmieteEur: kaltmiete,
    nebenkostenEur: nebenkosten,
    warmmieteEur: warmmiete,
    kautionEur: Number(payload.kautionEur) || 0,
    roomSqm: Number(payload.roomSqm) || 20,
    totalRooms: Number(payload.totalRooms) || 1,
    floorLevel: payload.floorLevel ? Number(payload.floorLevel) : null,
    furnished: payload.furnished || 'fully',
    anmeldungPossible: payload.anmeldungPossible !== false ? 1 : 0,
    subletAuthorized: payload.subletAuthorized !== false ? 1 : 0,
    contractType: payload.contractType || 'fixed_term',
    moveInDate: payload.moveInDate || now.split('T')[0],
    moveOutDate: payload.moveOutDate || null,
    minStayMonths: payload.minStayMonths ? Number(payload.minStayMonths) : 1,
    energyClass: payload.energyClass || null,
    heatingSource: payload.heatingSource || null,
    buildingYear: payload.buildingYear ? Number(payload.buildingYear) : null,
    imagesJson: JSON.stringify(payload.images || []),
    description: payload.description || '',
    contactMethod: payload.contactMethod || 'email',
    contactEmail: payload.contactEmail || submission.submitterEmail,
    contactName: payload.contactName || null,
    contactPhone: payload.contactPhone || null,
    status: 'active',
    publishedAt: now,
    expiresAt,
    createdAt: now,
    updatedAt: now,
  };
}
