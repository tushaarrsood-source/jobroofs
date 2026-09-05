/**
 * Firebase Configuration & Initialization Layer for JOBROOFS
 * Uses production configuration for project 'jobroofs'
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
  apiKey: 'AIzaSyDk9N-oCOV4p94G3Kf5bSDJ8wCQL_EOO3A',
  authDomain: 'jobroofs.firebaseapp.com',
  projectId: 'jobroofs',
  storageBucket: 'jobroofs.firebasestorage.app',
  messagingSenderId: '641516566892',
  appId: '1:641516566892:web:1133140f6a0b99bb121b49',
  measurementId: 'G-07SCW673KM',
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
