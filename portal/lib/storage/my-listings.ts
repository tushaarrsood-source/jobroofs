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
    if (cloudListings && cloudListings.length > 0) {
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
    if (targetType) {
      await deleteListingFromFirestore(targetType, id);
    }
    const updated = current.filter((l) => l.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('jobroofs_listings_updated'));
  } catch (err) {
    console.error('Failed to remove listing', err);
  }
}

export function seedDemoListingsIfEmpty(): UserListing[] {
  if (typeof window === 'undefined') return [];
  const existing = getMyListings();
  if (existing.length > 0) return existing;

  const demoListings: UserListing[] = [
    {
      id: 'demo-job-1',
      type: 'job',
      title: 'Barista & Servicekraft (m/w/d)',
      subtitle: 'Café Morgenstern · Prenzlauer Berg',
      badgeLabel: '15,50 €/h',
      tier: 'standard',
      tierLabel: 'Standard (30 Tage)',
      status: 'active',
      postedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      expiresAt: new Date(Date.now() + 27 * 86400000).toISOString(),
      linkUrl: '/jobs/barista-servicekraft-prenzlauer-berg',
      pricePaidEur: 29,
    },
    {
      id: 'demo-housing-1',
      type: 'housing',
      title: 'Helles WG-Zimmer am Boxhagener Platz',
      subtitle: 'Friedrichshain · 18 m²',
      badgeLabel: '520 €',
      tier: 'premium',
      tierLabel: '⭐ Premium Plus (60 Tage)',
      status: 'active',
      postedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      expiresAt: new Date(Date.now() + 55 * 86400000).toISOString(),
      linkUrl: '/wohnen',
      pricePaidEur: 49,
    },
  ];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoListings));
    window.dispatchEvent(new Event('jobroofs_listings_updated'));
  } catch {}
  return demoListings;
}
