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
  city?: string;
  district: string;
  postcode?: string;
  description: string;
  requirements?: string;
  payText: string;
  hoursLabel?: string;
  scheduleSummary?: string;
  employmentForms?: string[];
  employmentType?: string;
  contactEmail?: string;
  contactPhone?: string;
  whatsapp?: string;
  websiteUrl?: string;
  applyUrl?: string;
  slug?: string;
  status: 'active' | 'published' | 'expired' | 'filled';
  tier: 'free' | 'starter' | 'standard' | 'premium';
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

  const durationDays = jobData.tier === 'premium' ? 60 : jobData.tier === 'standard' ? 30 : 15;

  await setDoc(docRef, {
    ...jobData,
    id,
    status: jobData.status || 'published',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    expiresAt: new Date(Date.now() + durationDays * 86400000).toISOString(),
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

export async function getJobBySlugFromFirestore(slugOrId: string): Promise<FirestoreJob | null> {
  const db = getFirebaseDb();
  if (!db || !slugOrId) return null;

  try {
    // 1. Try direct doc ID
    const directRef = doc(db, 'jobs', slugOrId);
    const directSnap = await getDoc(directRef);
    if (directSnap.exists()) {
      return directSnap.data() as FirestoreJob;
    }

    // 2. Query by slug field
    const q = query(
      collection(db, 'jobs'),
      where('slug', '==', slugOrId),
      limit(1)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs[0].data() as FirestoreJob;
    }
  } catch (err) {
    console.error('Error fetching job by slug from Firestore:', err);
  }
  return null;
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
        tierLabel:
          data.tier === 'premium'
            ? 'Extended (60 Tage)'
            : data.tier === 'free'
            ? '🎁 Erstinserat (Gratis)'
            : data.tier === 'standard'
            ? 'Standard (30 Tage)'
            : 'Quick (15 Tage)',
        status: (data.status === 'published' ? 'active' : data.status) as any,
        postedAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        expiresAt: data.expiresAt || new Date(Date.now() + 30 * 86400000).toISOString(),
        linkUrl: `/jobs/${data.id}`,
        pricePaidEur:
          data.tier === 'premium'
            ? 24.99
            : data.tier === 'free'
            ? 0
            : data.tier === 'standard'
            ? 14.99
            : 9.99,
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

/**
 * Checks whether a user account is eligible for the 1st free job listing.
 * Returns true if the user has no existing published jobs and hasn't used the promo yet.
 */
export async function isUserEligibleForFreeJob(userId?: string | null): Promise<boolean> {
  const db = getFirebaseDb();
  if (!db || !userId) return true; // Eligible by default for new accounts

  try {
    const userDocRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      if (data.hasUsedFreeListing || data.firstJobUsed) {
        return false;
      }
    }

    // Check if user has already published any jobs
    const jobsQuery = query(collection(db, 'jobs'), where('userId', '==', userId));
    const jobsSnap = await getDocs(jobsQuery);
    return jobsSnap.empty;
  } catch (err) {
    console.warn('Could not check free job eligibility, defaulting to true:', err);
    return true;
  }
}

/**
 * Marks that a user has used their free listing promotion.
 */
export async function markFreeJobUsed(userId: string): Promise<void> {
  const db = getFirebaseDb();
  if (!db || !userId) return;

  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, { hasUsedFreeListing: true, updatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {
    console.warn('Could not mark free job used:', err);
  }
}

/**
 * Upgrades an existing job to Premium Spotlight.
 */
export async function upgradeJobToSpotlight(jobId: string): Promise<boolean> {
  const db = getFirebaseDb();
  if (!db || !jobId) return false;

  try {
    const docRef = doc(db, 'jobs', jobId);
    await updateDoc(docRef, {
      tier: 'premium',
      expiresAt: new Date(Date.now() + 60 * 86400000).toISOString(),
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (err) {
    console.error('Error upgrading job to spotlight:', err);
    return false;
  }
}

