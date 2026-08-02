import { createMiddleware } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { firebaseAdmin } from './admin.server'

export const requireFirebaseAuth = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const request = getRequest();

    if (!request?.headers) {
      console.error("requireFirebaseAuth: No request headers available");
      throw new Error('Unauthorized: No request headers available');
    }

    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      console.error("requireFirebaseAuth: No authorization header provided");
      throw new Error('Unauthorized: No authorization header provided');
    }

    if (!authHeader.startsWith('Bearer ')) {
      console.error("requireFirebaseAuth: Only Bearer tokens are supported");
      throw new Error('Unauthorized: Only Bearer tokens are supported');
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      console.error("requireFirebaseAuth: No token provided");
      throw new Error('Unauthorized: No token provided');
    }

    try {
      console.log("requireFirebaseAuth: Verifying token...");
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      console.log("requireFirebaseAuth: Token verified for uid:", decodedToken.uid);
      
      return next({
        context: {
          userId: decodedToken.uid,
          claims: decodedToken,
        },
      });
    } catch (error: any) {
      console.error("requireFirebaseAuth: Invalid token:", error);
      import('fs').then(fs => fs.appendFileSync('error.log', `[Auth Error] ${error.message || error}\\n${error.stack || ''}\\n`));
      throw new Error(`Unauthorized: Invalid token (${error.message || 'unknown error'})`);
    }
  },
);
