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
} from 'firebase/auth';
import { getFirebaseAuth } from './client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<User | null>;
  signInWithEmail: (email: string, pass: string) => Promise<User | null>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<User | null>;
  signOutUser: () => Promise<void>;
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
