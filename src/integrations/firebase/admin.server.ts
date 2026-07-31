import * as admin from 'firebase-admin';

function createFirebaseAdmin() {
  const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!admin.apps.length) {
    if (serviceAccountStr) {
      try {
        const serviceAccount = JSON.parse(serviceAccountStr);
        return admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      } catch (error) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY.", error);
      }
    } else {
      console.warn("FIREBASE_SERVICE_ACCOUNT_KEY is missing. Initializing admin without explicit credentials (requires default credentials in environment).");
      return admin.initializeApp();
    }
  }
  return admin.app();
}

let _firebaseAdmin: ReturnType<typeof createFirebaseAdmin> | undefined;

// Server-side Firebase admin client
// SECURITY: Only use this for trusted server-side operations, never expose to client code
export const firebaseAdmin = new Proxy({} as ReturnType<typeof createFirebaseAdmin>, {
  get(_, prop, receiver) {
    if (!_firebaseAdmin) _firebaseAdmin = createFirebaseAdmin();
    return Reflect.get(_firebaseAdmin, prop, receiver);
  },
});
