'use client';

import { getUserListingsFromFirestore, updateListingStatusInFirestore, deleteListingFromFirestore } from '../firebase/firestore-service';

export interface UserListing {
  id: string;
  type: 'job' | 'housing';
  title: string;
  subtitle: string;
  badgeLabel: string;
  tier: 'standard' | 'premium';
  tierLabel: string;
  status: 'active' | 'pending' | 'expired';
  postedAt: string;
  expiresAt: string;
  linkUrl: string;
  pricePaidEur: number;
}

const STORAGE_KEY = 'jobroofs_my_listings';

export function getMyListings(): UserListing[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read user listings from localStorage', err);
    return [];
  }
}

export async function syncUserListingsWithCloud(userId: string): Promise<UserListing[]> {
  if (typeof window === 'undefined' || !userId) return getMyListings();
  try {
    const cloudListings = await getUserListingsFromFirestore(userId);
    if (cloudListings !== null && cloudListings !== undefined) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudListings));
      window.dispatchEvent(new Event('jobroofs_listings_updated'));
      return cloudListings;
    }
  } catch (err) {
    console.warn('Could not sync with Firestore, using local listings:', err);
  }
  return getMyListings();
}

export function saveMyListing(listing: UserListing): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getMyListings();
    const filtered = current.filter((l) => l.id !== listing.id);
    const updated = [listing, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('jobroofs_listings_updated'));
  } catch (err) {
    console.error('Failed to save listing to localStorage', err);
  }
}

export async function removeMyListing(id: string, type?: 'job' | 'housing'): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const current = getMyListings();
    const target = current.find((l) => l.id === id);
    const targetType = type || target?.type;
    if (targetType && !id.startsWith('demo-')) {
      await deleteListingFromFirestore(targetType, id);
    }
    const updated = current.filter((l) => l.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('jobroofs_listings_updated'));
  } catch (err) {
    console.error('Failed to remove listing', err);
  }
}

export function clearAllMyListings(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('jobroofs_listings_updated'));
  } catch {}
}

export function seedDemoListingsIfEmpty(): UserListing[] {
  // Never reseed artificial listings; return current storage cleanly
  return getMyListings();
}
