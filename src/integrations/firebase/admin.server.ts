import { initializeApp, getApps, getApp, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function createFirebaseAdmin(): App {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0]!;
  }

  const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountStr) {
    try {
      let cleanedStr = serviceAccountStr.trim();
      if (
        (cleanedStr.startsWith("'") && cleanedStr.endsWith("'")) ||
        (cleanedStr.startsWith('"') && cleanedStr.endsWith('"'))
      ) {
        cleanedStr = cleanedStr.slice(1, -1);
      }

      const serviceAccount = JSON.parse(cleanedStr);

      if (serviceAccount.private_key) {
        // Replace all double/single escaped newlines with actual newline characters
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }

      console.log("[Firebase Admin] Initialized with service account for project:", serviceAccount.project_id);
      return initializeApp({
        credential: cert(serviceAccount),
      });
    } catch (error) {
      console.error("[Firebase Admin] Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", error);
    }
  }

  const fallbackProjectId =
    (typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env.VITE_FIREBASE_PROJECT_ID
      : process.env.VITE_FIREBASE_PROJECT_ID) || 'teretverse';

  console.warn("[Firebase Admin] Initializing fallback app with projectId:", fallbackProjectId);
  return initializeApp({
    projectId: fallbackProjectId,
  });
}

let _app: App | undefined;

export const firebaseAdmin = {
  auth: () => {
    if (!_app) _app = createFirebaseAdmin();
    return getAuth(_app);
  },
  firestore: () => {
    if (!_app) _app = createFirebaseAdmin();
    return getFirestore(_app);
  },
};
