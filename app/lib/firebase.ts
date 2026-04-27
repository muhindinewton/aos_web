import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDWgcjex2-Tb6x_vE1X3hUIVsmUuVdecoM',
  authDomain: 'africa-online-stores-ef6e6.firebaseapp.com',
  projectId: 'africa-online-stores-ef6e6',
  storageBucket: 'africa-online-stores-ef6e6.firebasestorage.app',
  messagingSenderId: '435214661781',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

export {
  auth,
  googleProvider,
  appleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  type User,
};
