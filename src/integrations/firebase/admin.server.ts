import { initializeApp, getApps, getApp, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function createFirebaseAdmin(): App | undefined {
  const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (getApps().length === 0) {
    if (serviceAccountStr) {
      try {
        const serviceAccount = JSON.parse(serviceAccountStr);
        return initializeApp({
          credential: cert(serviceAccount),
        });
      } catch (error) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY.", error);
      }
    } else {
      console.warn("FIREBASE_SERVICE_ACCOUNT_KEY is missing. Initializing admin without explicit credentials (requires default credentials in environment).");
      return initializeApp();
    }
  }
  return getApp();
}

let _app: App | undefined;

// Server-side Firebase admin client
export const firebaseAdmin = {
  auth: () => {
    if (!_app) _app = createFirebaseAdmin();
    return getAuth(_app!);
  },
  firestore: () => {
    if (!_app) _app = createFirebaseAdmin();
    return getFirestore(_app!);
  }
};
