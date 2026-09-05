/**
 * Firebase Configuration & Initialization Layer for JOBROOFS
 * Uses production configuration for project 'jobroofs-321c7'
 */

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: 'AIzaSyBN68Y6_n-xxFIB74OuvEtp0lFhPhY9gGI',
  authDomain: 'jobroofs-321c7.firebaseapp.com',
  projectId: 'jobroofs-321c7',
  storageBucket: 'jobroofs-321c7.firebasestorage.app',
  messagingSenderId: '960773392367',
  appId: '1:960773392367:web:c7cb340bf0b0964cbc981a',
  measurementId: 'G-HQ5MDN7Z6P',
};

export function getFirebaseConfig(): FirebaseConfig {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || DEFAULT_FIREBASE_CONFIG.apiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE_CONFIG.authDomain,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_CONFIG.projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE_CONFIG.storageBucket,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE_CONFIG.messagingSenderId,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || DEFAULT_FIREBASE_CONFIG.appId,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || DEFAULT_FIREBASE_CONFIG.measurementId,
  };
}

export function getFirebaseReadiness() {
  const config = getFirebaseConfig();
  const configured = Boolean(config.apiKey && config.projectId);
  return {
    configured,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    status: configured ? 'ready' : 'pending_credentials',
  } as const;
}
