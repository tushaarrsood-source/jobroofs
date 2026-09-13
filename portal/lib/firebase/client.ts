import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
import { getFirebaseConfig, getFirebaseReadiness } from './config';

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;
let analyticsInstance: Analytics | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === 'undefined') {
    // In server environment, initialize only if credentials exist
    const config = getFirebaseConfig();
    if (!config.apiKey || !config.projectId) return null;
    if (getApps().length > 0) return getApp();
    return initializeApp(config);
  }

  if (appInstance) return appInstance;

  const readiness = getFirebaseReadiness();
  if (!readiness.configured) {
    return null;
  }

  const config = getFirebaseConfig();
  appInstance = getApps().length > 0 ? getApp() : initializeApp(config);

  // Initialize analytics strictly with user opt-in consent (DSGVO / TDDDG § 25 compliant)
  if (typeof window !== 'undefined' && config.measurementId) {
    attachConsentListener();
    if (hasAnalyticsConsent()) {
      isSupported().then((supported) => {
        if (supported && appInstance) {
          analyticsInstance = getAnalytics(appInstance);
        }
      }).catch(() => {});
    }
  }

  return appInstance;
}

function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem('jobroofs_cookie_consent_v1');
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return Boolean(parsed.analytics);
  } catch {
    return false;
  }
}

let listenerAttached = false;
function attachConsentListener() {
  if (typeof window === 'undefined' || listenerAttached) return;
  listenerAttached = true;
  window.addEventListener('cookie_consent_updated', (e: any) => {
    if (e.detail?.analytics && appInstance && !analyticsInstance) {
      isSupported().then((supported) => {
        if (supported && appInstance) {
          analyticsInstance = getAnalytics(appInstance);
        }
      }).catch(() => {});
    }
  });
}

export function getFirebaseAuth(): Auth | null {
  if (authInstance) return authInstance;
  const app = getFirebaseApp();
  if (!app) return null;
  authInstance = getAuth(app);
  return authInstance;
}

export function getFirebaseDb(): Firestore | null {
  if (dbInstance) return dbInstance;
  const app = getFirebaseApp();
  if (!app) return null;
  dbInstance = getFirestore(app);
  return dbInstance;
}

export function getFirebaseStorageInstance(): FirebaseStorage | null {
  if (storageInstance) return storageInstance;
  const app = getFirebaseApp();
  if (!app) return null;
  storageInstance = getStorage(app);
  return storageInstance;
}

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === 'undefined') return null;
  if (analyticsInstance) return analyticsInstance;
  const app = getFirebaseApp();
  if (!app) return null;
  try {
    const supported = await isSupported();
    if (supported) {
      analyticsInstance = getAnalytics(app);
      return analyticsInstance;
    }
  } catch {}
  return null;
}
