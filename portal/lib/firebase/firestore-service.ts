import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  type DocumentData,
} from 'firebase/firestore';
import { getFirebaseDb } from './client';
import type { UserListing } from '../storage/my-listings';

export interface FirestoreJob {
  id: string;
  userId: string;
  title: string;
  company: string;
  district: string;
  postcode?: string;
  description: string;
  requirements?: string;
  payText: string;
  hoursLabel: string;
  scheduleSummary?: string;
  employmentForms: string[];
  contactEmail: string;
  contactPhone?: string;
  websiteUrl?: string;
  status: 'active' | 'published' | 'expired' | 'filled';
  tier: 'standard' | 'premium';
  createdAt?: any;
  updatedAt?: any;
  expiresAt?: string;
}

export interface FirestoreHousing {
  id: string;
  userId: string;
  title: string;
  district: string;
  neighborhood?: string;
  postcode: string;
  address?: string;
  listingType: string;
  warmmieteEur: number;
  kaltmieteEur: number;
  nebenkostenEur: number;
  kautionEur?: number;
  roomSqm: number;
  totalRooms: number;
  furnished: 'fully' | 'partially' | 'none';
  anmeldungPossible: boolean;
  moveInDate: string;
  moveOutDate?: string;
  images: string[];
  description: string;
  contactEmail: string;
  contactPhone?: string;
  status: 'active' | 'published' | 'expired' | 'rented';
  tier: 'standard' | 'premium';
  createdAt?: any;
  updatedAt?: any;
  expiresAt?: string;
}

// -------------------------------------------------------------
// JOBS OPERATIONS
// -------------------------------------------------------------

export async function createJobInFirestore(
  jobData: Omit<FirestoreJob, 'id' | 'createdAt' | 'updatedAt'>,
  customId?: string,
): Promise<string | null> {
  const db = getFirebaseDb();
  if (!db) return null;

  const id = customId || `job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const docRef = doc(db, 'jobs', id);

  await setDoc(docRef, {
    ...jobData,
    id,
    status: jobData.status || 'published',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
  });

  return id;
}

export async function getJobsFromFirestore(limitCount = 50): Promise<FirestoreJob[]> {
  const db = getFirebaseDb();
  if (!db) return [];

  try {
    const q = query(
      collection(db, 'jobs'),
      where('status', 'in', ['active', 'published']),
      limit(limitCount),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as FirestoreJob);
  } catch (err) {
    console.error('Error fetching jobs from Firestore:', err);
    return [];
  }
}

// -------------------------------------------------------------
// HOUSING OPERATIONS
// -------------------------------------------------------------

export async function createHousingInFirestore(
  housingData: Omit<FirestoreHousing, 'id' | 'createdAt' | 'updatedAt'>,
  customId?: string,
): Promise<string | null> {
  const db = getFirebaseDb();
  if (!db) return null;

  const id = customId || `housing-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const docRef = doc(db, 'housing_listings', id);

  await setDoc(docRef, {
    ...housingData,
    id,
    status: housingData.status || 'published',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
  });

  return id;
}

export async function getHousingFromFirestore(limitCount = 50): Promise<FirestoreHousing[]> {
  const db = getFirebaseDb();
  if (!db) return [];

  try {
    const q = query(
      collection(db, 'housing_listings'),
      where('status', 'in', ['active', 'published']),
      limit(limitCount),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as FirestoreHousing);
  } catch (err) {
    console.error('Error fetching housing from Firestore:', err);
    return [];
  }
}

// -------------------------------------------------------------
// USER OWNED LISTINGS ("MY LISTINGS")
// -------------------------------------------------------------

export async function getUserListingsFromFirestore(userId: string): Promise<UserListing[]> {
  const db = getFirebaseDb();
  if (!db || !userId) return [];

  const results: UserListing[] = [];

  try {
    // 1. Fetch user's jobs
    const jobsQuery = query(collection(db, 'jobs'), where('userId', '==', userId));
    const jobsSnap = await getDocs(jobsQuery);
    jobsSnap.forEach((docSnap) => {
      const data = docSnap.data() as FirestoreJob;
      results.push({
        id: data.id,
        type: 'job',
        title: data.title,
        subtitle: `${data.company} · ${data.district}`,
        badgeLabel: data.payText || 'n. V.',
        tier: data.tier || 'standard',
        tierLabel: data.tier === 'premium' ? '⭐ Premium (30 Tage)' : 'Standard (30 Tage)',
        status: (data.status === 'published' ? 'active' : data.status) as any,
        postedAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        expiresAt: data.expiresAt || new Date(Date.now() + 30 * 86400000).toISOString(),
        linkUrl: `/jobs/${data.id}`,
        pricePaidEur: data.tier === 'premium' ? 59 : 29,
      });
    });

    // 2. Fetch user's housing listings
    const housingQuery = query(collection(db, 'housing_listings'), where('userId', '==', userId));
    const housingSnap = await getDocs(housingQuery);
    housingSnap.forEach((docSnap) => {
      const data = docSnap.data() as FirestoreHousing;
      results.push({
        id: data.id,
        type: 'housing',
        title: data.title,
        subtitle: `${data.district} · ${data.roomSqm} m²`,
        badgeLabel: `${data.warmmieteEur} €`,
        tier: data.tier || 'standard',
        tierLabel: data.tier === 'premium' ? '⭐ Premium (30 Tage)' : 'Standard (30 Tage)',
        status: (data.status === 'published' ? 'active' : data.status) as any,
        postedAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        expiresAt: data.expiresAt || new Date(Date.now() + 30 * 86400000).toISOString(),
        linkUrl: `/wohnen/${data.id}`,
        pricePaidEur: data.tier === 'premium' ? 49 : 29,
      });
    });
  } catch (err) {
    console.error('Error fetching user listings from Firestore:', err);
  }

  return results;
}

export async function updateListingStatusInFirestore(
  type: 'job' | 'housing',
  id: string,
  newStatus: 'active' | 'pending' | 'expired',
): Promise<boolean> {
  const db = getFirebaseDb();
  if (!db) return false;

  try {
    const colName = type === 'job' ? 'jobs' : 'housing_listings';
    const docRef = doc(db, colName, id);
    await updateDoc(docRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (err) {
    console.error('Error updating status in Firestore:', err);
    return false;
  }
}

export async function deleteListingFromFirestore(type: 'job' | 'housing', id: string): Promise<boolean> {
  const db = getFirebaseDb();
  if (!db) return false;

  try {
    const colName = type === 'job' ? 'jobs' : 'housing_listings';
    await deleteDoc(doc(db, colName, id));
    return true;
  } catch (err) {
    console.error('Error deleting listing from Firestore:', err);
    return false;
  }
}

/**
 * GDPR / DSGVO Right to erasure (Art. 17 DSGVO)
 * Completely deletes all user-associated documents from Firestore:
 * 1. User profile in /users/{userId}
 * 2. All job postings created by this user
 * 3. All housing listings created by this user
 */
export async function deleteUserDataFromFirestore(userId: string): Promise<boolean> {
  const db = getFirebaseDb();
  if (!db) return false;

  try {
    // 1. Delete user profile document
    const userDocRef = doc(db, 'users', userId);
    await deleteDoc(userDocRef).catch(() => {});

    // 2. Query and delete user jobs
    const jobsQuery = query(collection(db, 'jobs'), where('userId', '==', userId));
    const jobsSnapshot = await getDocs(jobsQuery);
    for (const jobDoc of jobsSnapshot.docs) {
      await deleteDoc(jobDoc.ref).catch(() => {});
    }

    // 3. Query and delete user housing listings
    const housingQuery = query(collection(db, 'housing_listings'), where('userId', '==', userId));
    const housingSnapshot = await getDocs(housingQuery);
    for (const housingDoc of housingSnapshot.docs) {
      await deleteDoc(housingDoc.ref).catch(() => {});
    }

    return true;
  } catch (err) {
    console.error('Error deleting user data from Firestore:', err);
    return false;
  }
}
