'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  googleProvider,
  appleProvider,
  signInWithPopup,
  onAuthStateChanged,
  type User as FirebaseUser,
} from '../lib/firebase';
import {
  signUpWithEmail,
  signInWithEmail,
  signOut as serviceSignOut,
  sendPasswordResetEmail as serviceSendPasswordResetEmail,
  sendEmailVerification as serviceSendEmailVerification,
  deleteAccount as serviceDeleteAccount,
  getUserData,
  updateUserProfile as serviceUpdateUserProfile,
  authErrorMessage,
  type UserModel,
  type UpdateProfileArgs,
} from '../lib/auth-service';
import { db, doc, setDoc, serverTimestamp } from '../lib/firebase';

// Lightweight view of the currently-signed-in user, hydrated from both
// Firebase Auth (cheap, sync once auth state resolves) and Firestore
// (richer fields like phoneNumber / countryCode that mobile relies on).
export interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  countryCode: string | null;
  countryName: string | null;
  city: string | null;
}

interface SignupArgs {
  email: string;
  password: string;
  name: string;
  countryCode?: string;
  countryName?: string;
  phoneNumber?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (args: SignupArgs) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  updateProfile: (args: Omit<UpdateProfileArgs, 'uid'>) => Promise<void>;
  deleteAccount: () => Promise<void>;
  errorMessage: (e: unknown) => string;
}

const noop = async () => {};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  loading: true,
  login: noop,
  signup: noop,
  loginWithGoogle: noop,
  loginWithApple: noop,
  logout: noop,
  sendPasswordReset: noop,
  sendEmailVerification: noop,
  updateProfile: noop,
  deleteAccount: noop,
  errorMessage: authErrorMessage,
});

function mergeUser(fb: FirebaseUser, profile: UserModel | null): User {
  return {
    id: fb.uid,
    email: fb.email,
    displayName: profile?.displayName ?? fb.displayName,
    photoURL: profile?.photoUrl ?? fb.photoURL,
    phoneNumber: profile?.phoneNumber ?? fb.phoneNumber ?? null,
    countryCode: profile?.countryCode ?? null,
    countryName: profile?.countryName ?? null,
    city: profile?.city ?? null,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fb) => {
      if (!fb) {
        setUser(null);
        setLoading(false);
        return;
      }
      // Hydrate from Firestore so phoneNumber / countryCode etc. are available
      let profile = await getUserData(fb.uid);

      // First-time social sign-in: create a Firestore record so Google/Apple
      // accounts have the same shape as email/password ones.
      if (!profile) {
        try {
          await setDoc(doc(db, 'users', fb.uid), {
            email: fb.email ?? '',
            displayName: fb.displayName ?? null,
            phoneNumber: fb.phoneNumber ?? null,
            photoUrl: fb.photoURL ?? null,
            countryCode: 'KE',
            countryName: 'Kenya',
            city: null,
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
            isVerified: fb.emailVerified ?? false,
            isActive: true,
          });
          profile = await getUserData(fb.uid);
        } catch {
          // ignore — we still render with whatever auth gave us
        }
      }

      setUser(mergeUser(fb, profile));
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmail(email, password);
  };

  const signup = async (args: SignupArgs) => {
    await signUpWithEmail({
      email:        args.email,
      password:     args.password,
      displayName:  args.name,
      phoneNumber:  args.phoneNumber,
      countryCode:  args.countryCode,
      countryName:  args.countryName,
    });
  };

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
    // onAuthStateChanged will hydrate the profile next tick
  };

  const loginWithApple = async () => {
    await signInWithPopup(auth, appleProvider);
  };

  const logout = async () => {
    await serviceSignOut();
  };

  const sendPasswordReset = async (email: string) => {
    await serviceSendPasswordResetEmail(email);
  };

  const sendEmailVerification = async () => {
    await serviceSendEmailVerification();
  };

  const updateProfile = async (args: Omit<UpdateProfileArgs, 'uid'>) => {
    if (!user) throw new Error('Not signed in');
    await serviceUpdateUserProfile({ uid: user.id, ...args });
    // Refresh local state from Firestore
    const fresh = await getUserData(user.id);
    if (fresh && auth.currentUser) setUser(mergeUser(auth.currentUser, fresh));
  };

  const deleteAccount = async () => {
    await serviceDeleteAccount();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loading,
        login,
        signup,
        loginWithGoogle,
        loginWithApple,
        logout,
        sendPasswordReset,
        sendEmailVerification,
        updateProfile,
        deleteAccount,
        errorMessage: authErrorMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
