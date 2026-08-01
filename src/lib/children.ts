import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { firebaseAdmin } from '../integrations/firebase/admin.server';
import { requireFirebaseAuth } from '../integrations/firebase/auth-middleware';
import { attachFirebaseAuth } from '../integrations/firebase/auth-attacher';
import * as bcrypt from 'bcryptjs';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

const db = firebaseAdmin.firestore();

// Types
export const ChildProfileSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  avatar: z.string().optional(),
  age: z.number().min(1).max(18),
  favoriteAnimal: z.string().optional(),
  favoriteColor: z.string().optional(),
  readingLevel: z.string().optional(),
  theme: z.string().optional(),
});

// Create Child
export const createChild = createServerFn({ method: 'POST' })
  .middleware([attachFirebaseAuth, requireFirebaseAuth])
  .validator((data: z.infer<typeof ChildProfileSchema>) => ChildProfileSchema.parse(data))
  .handler(async ({ data, context }) => {
    if (!context || !context.userId) throw new Error("Unauthorized");
    const userId = context.userId;
    const newChildRef = db.collection('child_profiles').doc();
    
    const childData = {
      ...data,
      id: newChildRef.id,
      owner_id: userId,
      pinEnabled: false,
      failedAttempts: 0,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    };

    await newChildRef.set(childData);
    
    // Add reference to users collection
    await db.collection('users').doc(userId).set({
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });

    const { created_at, updated_at, ...safeData } = childData;
    return { ...safeData, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  });

// Get Children
export const getChildren = createServerFn({ method: 'GET' })
  .middleware([attachFirebaseAuth, requireFirebaseAuth])
  .handler(async ({ context }) => {
    if (!context || !context.userId) throw new Error("Unauthorized");
    const userId = context.userId;
    
    const snapshot = await db.collection('child_profiles')
      .where('owner_id', '==', userId)
      .get();
      
    const children = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      // Don't leak the pinHash to the client
      const { pinHash, ...safeData } = data;
      return { id: doc.id, ...safeData };
    });
    
    return children;
  });

// Set PIN
export const SetPinSchema = z.object({
  childId: z.string(),
  pin: z.string().regex(/^\d{4,6}$/, "PIN must be 4 to 6 digits"),
});

export const setChildPin = createServerFn({ method: 'POST' })
  .middleware([attachFirebaseAuth, requireFirebaseAuth])
  .validator((data: z.infer<typeof SetPinSchema>) => SetPinSchema.parse(data))
  .handler(async ({ data, context }) => {
    try {
      console.log("setChildPin handler started for childId:", data.childId);
      if (!context || !context.userId) throw new Error("Unauthorized");
      const userId = context.userId;
      console.log("userId from context:", userId);
      const childRef = db.collection('child_profiles').doc(data.childId);
      
      const childDoc = await childRef.get();
      console.log("childDoc exists:", childDoc.exists);
      if (!childDoc.exists || childDoc.data()?.owner_id !== userId) {
        throw new Error("Unauthorized or Child not found");
      }

      console.log("Generating salt...");
      const salt = await bcrypt.genSalt(10);
      console.log("Hashing pin...");
      const pinHash = await bcrypt.hash(data.pin, salt);

      console.log("Updating child document...");
      await childRef.update({
        pinHash,
        pinEnabled: true,
        pinLength: data.pin.length,
        updated_at: FieldValue.serverTimestamp(),
      });
      console.log("Update successful");

      return { success: true };
    } catch (error) {
      console.error("Error inside setChildPin handler:", error);
      throw error;
    }
  });

// Verify PIN
export const VerifyPinSchema = z.object({
  childId: z.string(),
  pin: z.string(),
});

export const verifyChildPin = createServerFn({ method: 'POST' })
  .middleware([attachFirebaseAuth, requireFirebaseAuth])
  .validator((data: z.infer<typeof VerifyPinSchema>) => VerifyPinSchema.parse(data))
  .handler(async ({ data, context }) => {
    if (!context || !context.userId) throw new Error("Unauthorized");
    const userId = context.userId;
    const childRef = db.collection('child_profiles').doc(data.childId);
    
    const childDoc = await childRef.get();
    if (!childDoc.exists || childDoc.data()?.owner_id !== userId) {
      throw new Error("Unauthorized or Child not found");
    }

    const child = childDoc.data()!;
    
    // Check if locked
    if (child.lockedUntil && child.lockedUntil.toDate() > new Date()) {
      throw new Error("Profile is temporarily locked. Please try again later.");
    }

    if (!child.pinEnabled || !child.pinHash) {
      return { success: true }; // No PIN required
    }

    const isValid = await bcrypt.compare(data.pin, child.pinHash);

    if (!isValid) {
      const failedAttempts = (child.failedAttempts || 0) + 1;
      const updates: any = { failedAttempts };
      
      if (failedAttempts >= 5) {
        // Lock for 5 minutes
        const lockUntil = new Date();
        lockUntil.setMinutes(lockUntil.getMinutes() + 5);
        updates.lockedUntil = Timestamp.fromDate(lockUntil);
      }
      
      await childRef.update(updates);
      throw new Error(failedAttempts >= 5 ? "Too many failed attempts. Profile locked for 5 minutes." : "Incorrect PIN");
    }

    // Reset failed attempts on success
    if (child.failedAttempts > 0 || child.lockedUntil) {
      await childRef.update({
        failedAttempts: 0,
        lockedUntil: FieldValue.delete(),
      });
    }

    return { success: true, childId: data.childId };
  });
