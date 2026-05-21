// Web port of mobile's auth_service.dart — keeps the same shape so behaviour
// matches: Firestore "users/{uid}" document, lastLoginAt updates, friendly
// error messages, profile updates routed to both Firebase Auth and Firestore.

import {
  auth,
  db,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
  sendPasswordResetEmail as fbSendPasswordResetEmail,
  sendEmailVerification as fbSendEmailVerification,
  deleteUser as fbDeleteUser,
} from './firebase';
import type { DocumentData } from 'firebase/firestore';

export interface UserModel {
  uid: string;
  email: string;
  displayName: string | null;
  phoneNumber: string | null;
  photoUrl: string | null;
  countryCode: string;
  countryName: string;
  city: string | null;
  createdAt: Date;
  lastLoginAt: Date | null;
  isVerified: boolean;
  isActive: boolean;
}

function fromFirestore(uid: string, data: DocumentData): UserModel {
  return {
    uid,
    email: data.email ?? '',
    displayName: data.displayName ?? null,
    phoneNumber: data.phoneNumber ?? null,
    photoUrl: data.photoUrl ?? null,
    countryCode: data.countryCode ?? 'KE',
    countryName: data.countryName ?? 'Kenya',
    city: data.city ?? null,
    createdAt: (data.createdAt as Timestamp | undefined)?.toDate() ?? new Date(),
    lastLoginAt: (data.lastLoginAt as Timestamp | undefined)?.toDate() ?? null,
    isVerified: data.isVerified ?? false,
    isActive: data.isActive ?? true,
  };
}

// Mirrors mobile's `_handleAuthException` switch
export function authErrorMessage(error: unknown): string {
  const code =
    (error && typeof error === 'object' && 'code' in error && typeof (error as { code: unknown }).code === 'string'
      ? (error as { code: string }).code
      : '') as string;

  switch (code) {
    case 'auth/email-already-in-use':  return 'This email is already registered.';
    case 'auth/invalid-email':         return 'Please enter a valid email address.';
    case 'auth/operation-not-allowed': return 'Email/password sign-in is not enabled.';
    case 'auth/weak-password':         return 'Please enter a stronger password.';
    case 'auth/user-disabled':         return 'This account has been disabled.';
    case 'auth/user-not-found':        return 'No account found with this email.';
    case 'auth/wrong-password':        return 'Incorrect password.';
    case 'auth/invalid-credential':    return 'Invalid email or password.';
    case 'auth/too-many-requests':     return 'Too many attempts. Please try again later.';
    case 'auth/popup-closed-by-user':  return 'Sign-in was cancelled.';
    case 'auth/network-request-failed':return 'Network error. Check your connection and try again.';
    default:
      if (error instanceof Error) return error.message || 'An error occurred. Please try again.';
      return 'An error occurred. Please try again.';
  }
}

export interface SignUpArgs {
  email: string;
  password: string;
  displayName?: string;
  phoneNumber?: string;
  countryCode?: string;
  countryName?: string;
}

export async function signUpWithEmail(args: SignUpArgs): Promise<UserModel> {
  const {
    email, password, displayName,
    phoneNumber = null,
    countryCode = 'KE',
    countryName = 'Kenya',
  } = args;

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const fbUser = credential.user;

  if (displayName) {
    await updateProfile(fbUser, { displayName });
  }

  const profile = {
    email,
    displayName: displayName ?? null,
    phoneNumber,
    photoUrl: null,
    countryCode,
    countryName,
    city: null,
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
    isVerified: false,
    isActive: true,
  };

  await setDoc(doc(db, 'users', fbUser.uid), profile);

  return {
    uid: fbUser.uid,
    email,
    displayName: displayName ?? null,
    phoneNumber,
    photoUrl: null,
    countryCode,
    countryName,
    city: null,
    createdAt: new Date(),
    lastLoginAt: new Date(),
    isVerified: false,
    isActive: true,
  };
}

export async function signInWithEmail(email: string, password: string): Promise<UserModel | null> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const uid = credential.user.uid;

  // Best-effort: bump lastLoginAt. If the user doc doesn't exist yet (older
  // accounts created before this provider was wired up), create it from the
  // Firebase Auth profile so subsequent reads succeed.
  try {
    await updateDoc(doc(db, 'users', uid), { lastLoginAt: serverTimestamp() });
  } catch {
    await setDoc(doc(db, 'users', uid), {
      email: credential.user.email ?? email,
      displayName: credential.user.displayName ?? null,
      phoneNumber: null,
      photoUrl: credential.user.photoURL ?? null,
      countryCode: 'KE',
      countryName: 'Kenya',
      city: null,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      isVerified: credential.user.emailVerified ?? false,
      isActive: true,
    });
  }

  return getUserData(uid);
}

export async function getUserData(uid: string): Promise<UserModel | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    return fromFirestore(snap.id, snap.data());
  } catch {
    return null;
  }
}

export interface UpdateProfileArgs {
  uid: string;
  displayName?: string;
  phoneNumber?: string;
  photoUrl?: string;
  countryCode?: string;
  countryName?: string;
  city?: string;
}

export async function updateUserProfile(args: UpdateProfileArgs): Promise<void> {
  const { uid, displayName, phoneNumber, photoUrl, countryCode, countryName, city } = args;

  const updates: Record<string, unknown> = {};
  if (displayName !== undefined) updates.displayName = displayName;
  if (phoneNumber !== undefined) updates.phoneNumber = phoneNumber;
  if (photoUrl    !== undefined) updates.photoUrl    = photoUrl;
  if (countryCode !== undefined) updates.countryCode = countryCode;
  if (countryName !== undefined) updates.countryName = countryName;
  if (city        !== undefined) updates.city        = city;

  if (Object.keys(updates).length > 0) {
    await updateDoc(doc(db, 'users', uid), updates);
  }

  // Mirror the same changes on the Firebase Auth profile
  if (auth.currentUser) {
    const fbUpdates: { displayName?: string; photoURL?: string } = {};
    if (displayName !== undefined) fbUpdates.displayName = displayName;
    if (photoUrl    !== undefined) fbUpdates.photoURL    = photoUrl;
    if (Object.keys(fbUpdates).length > 0) {
      await updateProfile(auth.currentUser, fbUpdates);
    }
  }
}

export async function sendPasswordResetEmail(email: string): Promise<void> {
  await fbSendPasswordResetEmail(auth, email);
}

export async function sendEmailVerification(): Promise<void> {
  if (!auth.currentUser) throw new Error('Not signed in');
  await fbSendEmailVerification(auth.currentUser);
}

export async function signOut(): Promise<void> {
  await fbSignOut(auth);
}

export async function deleteAccount(): Promise<void> {
  const u = auth.currentUser;
  if (!u) return;
  await deleteDoc(doc(db, 'users', u.uid));
  await fbDeleteUser(u);
}
