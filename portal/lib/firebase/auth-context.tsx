'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  deleteUser,
} from 'firebase/auth';
import { getFirebaseAuth, getFirebaseDb } from './client';
import { deleteUserDataFromFirestore } from './firestore-service';
import { doc, setDoc } from 'firebase/firestore';
import { isMasterAccount } from '@/lib/domain/master-accounts';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<User | null>;
  signInWithEmail: (email: string, pass: string) => Promise<User | null>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<User | null>;
  signOutUser: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => null,
  signInWithEmail: async () => null,
  signUpWithEmail: async () => null,
  signOutUser: async () => {},
  deleteAccount: async () => {},
  clearError: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);

        if (currentUser?.email && isMasterAccount(currentUser.email)) {
          const db = getFirebaseDb();
          if (db) {
            setDoc(
              doc(db, 'users', currentUser.uid),
              {
                userId: currentUser.uid,
                email: currentUser.email,
                role: 'master',
                isMaster: true,
                plan: 'annual_unlimited',
                unlimitedPro: true,
                bypassStripe: true,
                subscriptionExpiresAt: '2099-12-31T23:59:59.999Z',
              },
              { merge: true }
            ).catch(console.error);
          }
        }
      },
      (err) => {
        console.error('Firebase onAuthStateChanged error:', err);
        setError(err.message);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const clearError = () => setError(null);

  const signInWithGoogle = async (): Promise<User | null> => {
    setError(null);
    const auth = getFirebaseAuth();
    if (!auth) {
      setError('Firebase ist noch nicht mit Anmeldedaten konfiguriert.');
      return null;
    }
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      return result.user;
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      setError(err.message || 'Google Anmeldung fehlgeschlagen');
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string): Promise<User | null> => {
    setError(null);
    const auth = getFirebaseAuth();
    if (!auth) {
      setError('Firebase ist noch nicht mit Anmeldedaten konfiguriert.');
      return null;
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      setUser(result.user);
      return result.user;
    } catch (err: any) {
      console.error('Email Sign-In error:', err);
      setError(err.message || 'E-Mail Anmeldung fehlgeschlagen');
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string): Promise<User | null> => {
    setError(null);
    const auth = getFirebaseAuth();
    if (!auth) {
      setError('Firebase ist noch nicht mit Anmeldedaten konfiguriert.');
      return null;
    }
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      if (name && result.user) {
        await updateProfile(result.user, { displayName: name });
      }
      setUser(result.user);
      return result.user;
    } catch (err: any) {
      console.error('Email Sign-Up error:', err);
      setError(err.message || 'Registrierung fehlgeschlagen');
      throw err;
    }
  };

  const signOutUser = async (): Promise<void> => {
    setError(null);
    const auth = getFirebaseAuth();
    if (auth) {
      await signOut(auth);
    }
    setUser(null);
  };

  const deleteAccount = async (): Promise<void> => {
    setError(null);
    const auth = getFirebaseAuth();
    if (!auth || !auth.currentUser) {
      throw new Error('Kein angemeldeter Benutzer gefunden.');
    }

    const currentUser = auth.currentUser;
    const uid = currentUser.uid;

    try {
      // 1. Delete user data from Firestore while still authenticated
      await deleteUserDataFromFirestore(uid);

      // 2. Delete user account from Firebase Auth
      await deleteUser(currentUser);

      // 3. Clear local listings and dispatch update
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('jobroofs_my_listings');
          window.dispatchEvent(new Event('jobroofs_listings_updated'));
        } catch {}
      }

      setUser(null);
    } catch (err: any) {
      console.error('Account deletion error:', err);
      if (err.code === 'auth/requires-recent-login') {
        setError(
          'Aus Sicherheitsgründen musst du dich erneut anmelden, bevor dein Konto gelöscht werden kann.',
        );
      } else {
        setError(err.message || 'Konto konnte nicht gelöscht werden.');
      }
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOutUser,
        deleteAccount,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
