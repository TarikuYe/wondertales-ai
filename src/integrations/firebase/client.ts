import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || (typeof process !== 'undefined' ? process.env.VITE_FIREBASE_API_KEY : undefined),
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || (typeof process !== 'undefined' ? process.env.VITE_FIREBASE_AUTH_DOMAIN : undefined),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || (typeof process !== 'undefined' ? process.env.VITE_FIREBASE_PROJECT_ID : undefined),
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || (typeof process !== 'undefined' ? process.env.VITE_FIREBASE_STORAGE_BUCKET : undefined),
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || (typeof process !== 'undefined' ? process.env.VITE_FIREBASE_MESSAGING_SENDER_ID : undefined),
  appId: import.meta.env.VITE_FIREBASE_APP_ID || (typeof process !== 'undefined' ? process.env.VITE_FIREBASE_APP_ID : undefined),
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
