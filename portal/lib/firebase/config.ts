/**
 * Firebase Configuration & Initialization Layer
 * Reads credentials from environment variables for Firestore, Storage, and Auth.
 */

export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export function getFirebaseConfig(): FirebaseConfig {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

export function getFirebaseReadiness() {
  const config = getFirebaseConfig();
  const configured = Boolean(config.apiKey && config.projectId);
  return {
    configured,
    projectId: config.projectId || null,
    storageBucket: config.storageBucket || null,
    status: configured ? 'ready' : 'pending_credentials',
  } as const;
}
