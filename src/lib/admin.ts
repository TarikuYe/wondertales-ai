import { createServerFn } from '@tanstack/react-start';
import { attachFirebaseAuth } from '@/integrations/firebase/auth-attacher';
import { requireFirebaseAuth } from '@/integrations/firebase/auth-middleware';
import { firebaseAdmin } from '@/integrations/firebase/admin.server';
import { FieldValue } from 'firebase-admin/firestore';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AdminStats {
  totalUsers: number;
  parents: number;
  children: number;
  teachers: number;
  storiesToday: number;
  storiesThisMonth: number;
  imagesGenerated: number;
  audioGenerated: number;
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
  revenue: number;
  subscriptions: number;
  apiRequests: number;
  pendingReports: number;
  pendingModeration: number;
  errors: number;
  storageUsage: number;
}

export interface AdminUser {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  organization: string | null;
  created_at: string | null;
  disabled: boolean;
  children_count: number;
  stories_count: number;
}

export interface AdminStory {
  id: string;
  title: string;
  parentId: string;
  childId: string;
  status: string;
  genre: string;
  illustrationStyle: string;
  createdAt: number;
  pageCount: number;
  vocabularyCount: number;
  coverImageUrl?: string;
}

export interface AdminAuditLog {
  id: string;
  action: string;
  actorId: string;
  actorEmail: string;
  targetId: string;
  details: string;
  timestamp: string;
}

export interface ModerationItem {
  id: string;
  type: string;
  content: string;
  storyId: string;
  storyTitle: string;
  status: string;
  flags: string[];
  createdAt: number;
}

// ─── Role Guard ──────────────────────────────────────────────────────────────

const ADMIN_ROLES = ['admin', 'super_admin', 'platform_admin', 'content_moderator', 'customer_support', 'finance_manager', 'developer'];

export const requireAdmin = createServerFn({ method: 'GET' })
  .middleware([attachFirebaseAuth, requireFirebaseAuth])
  .handler(async ({ context }) => {
    const userId = context.userId;
    const db = firebaseAdmin.firestore();

    const roleDoc = await db.collection('user_roles').doc(userId).get();
    const role = roleDoc.exists ? (roleDoc.data()?.role as string) : null;

    if (!role || !ADMIN_ROLES.includes(role)) {
      throw new Error('Forbidden: Admin access required');
    }

    return { userId, role };
  });

// ─── Dashboard Stats ────────────────────────────────────────────────────────

export const getAdminStats = createServerFn({ method: 'GET' })
  .middleware([attachFirebaseAuth, requireFirebaseAuth])
  .handler(async ({ context }) => {
    const userId = context.userId;
    const db = firebaseAdmin.firestore();

    // Verify admin
    const roleDoc = await db.collection('user_roles').doc(userId).get();
    const role = roleDoc.exists ? (roleDoc.data()?.role as string) : null;
    if (!role || !ADMIN_ROLES.includes(role)) {
      throw new Error('Forbidden: Admin access required');
    }

    // Run queries in parallel
    const [usersSnap, parentsSnap, childrenSnap, teachersSnap, storiesSnap, reportsSnap] = await Promise.all([
      db.collection('profiles').get(),
      db.collection('user_roles').where('role', '==', 'parent').get(),
      db.collection('child_profiles').get(),
      db.collection('user_roles').where('role', '==', 'teacher').get(),
      db.collection('stories').get(),
      db.collection('reports').where('status', '==', 'pending').limit(500).get(),
    ]);

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

    let storiesToday = 0;
    let storiesThisMonth = 0;
    let imagesGenerated = 0;
    let audioGenerated = 0;

    storiesSnap.forEach((doc) => {
      const data = doc.data();
      const createdAt = typeof data.createdAt === 'number' ? data.createdAt : 0;
      if (createdAt > oneDayAgo) storiesToday++;
      if (createdAt > oneMonthAgo) storiesThisMonth++;
      if (data.pages) imagesGenerated += (data.pages as any[]).length;
      if (data.vocabularyWords) audioGenerated += (data.vocabularyWords as any[]).length;
    });

    // Calculate DAU/MAU from profiles (using updated_at as last active proxy)
    let dailyActiveUsers = 0;
    let monthlyActiveUsers = 0;
    usersSnap.forEach((doc) => {
      const data = doc.data();
      const updatedAt = data.updated_at;
      let ts = 0;
      if (updatedAt?.toDate) ts = updatedAt.toDate().getTime();
      else if (typeof updatedAt === 'string') ts = new Date(updatedAt).getTime();
      if (ts > oneDayAgo) dailyActiveUsers++;
      if (ts > oneMonthAgo) monthlyActiveUsers++;
    });

    return {
      totalUsers: usersSnap.size,
      parents: parentsSnap.size,
      children: childrenSnap.size,
      teachers: teachersSnap.size,
      storiesToday,
      storiesThisMonth,
      imagesGenerated,
      audioGenerated,
      dailyActiveUsers,
      monthlyActiveUsers,
      revenue: 0,
      subscriptions: 0,
      apiRequests: storiesSnap.size * 10,
      pendingReports: reportsSnap.size,
      pendingModeration: 0,
      errors: 0,
      storageUsage: 0,
    } as AdminStats;
  });

// ─── Users ───────────────────────────────────────────────────────────────────

export const getAdminUsers = createServerFn({ method: 'GET' })
  .middleware([attachFirebaseAuth, requireFirebaseAuth])
  .validator((data: { limit?: number; role?: string }) => data)
  .handler(async ({ data, context }) => {
    const userId = context.userId;
    const db = firebaseAdmin.firestore();

    const roleDoc = await db.collection('user_roles').doc(userId).get();
    const role = roleDoc.exists ? (roleDoc.data()?.role as string) : null;
    if (!role || !ADMIN_ROLES.includes(role)) {
      throw new Error('Forbidden: Admin access required');
    }

    const limit = data.limit ?? 100;
    let q = db.collection('profiles').orderBy('created_at', 'desc').limit(limit);
    const snapshot = await q.get();

    const users: AdminUser[] = [];
    for (const doc of snapshot.docs) {
      const d = doc.data();
      let createdAt: string | null = null;
      if (d.created_at?.toDate) createdAt = d.created_at.toDate().toISOString();
      else if (typeof d.created_at === 'string') createdAt = d.created_at;

      const roleDoc2 = await db.collection('user_roles').doc(doc.id).get();
      const userRole = roleDoc2.exists ? (roleDoc2.data()?.role as string) : 'parent';

      if (data.role && userRole !== data.role) continue;

      users.push({
        id: doc.id,
        email: d.email ?? null,
        full_name: d.full_name ?? null,
        role: userRole,
        organization: d.organization ?? null,
        created_at: createdAt,
        disabled: d.disabled ?? false,
        children_count: 0,
        stories_count: 0,
      });
    }

    return users;
  });

// ─── Stories ─────────────────────────────────────────────────────────────────

export const getAdminStories = createServerFn({ method: 'GET' })
  .middleware([attachFirebaseAuth, requireFirebaseAuth])
  .validator((data: { limit?: number; status?: string }) => data)
  .handler(async ({ data, context }) => {
    const userId = context.userId;
    const db = firebaseAdmin.firestore();

    const roleDoc = await db.collection('user_roles').doc(userId).get();
    const role = roleDoc.exists ? (roleDoc.data()?.role as string) : null;
    if (!role || !ADMIN_ROLES.includes(role)) {
      throw new Error('Forbidden: Admin access required');
    }

    const limit = data.limit ?? 100;
    let q = db.collection('stories').orderBy('createdAt', 'desc').limit(limit);
    const snapshot = await q.get();

    const stories: AdminStory[] = [];
    snapshot.forEach((doc) => {
      const d = doc.data();
      stories.push({
        id: doc.id,
        title: d.title ?? 'Untitled',
        parentId: d.parentId ?? '',
        childId: d.childId ?? '',
        status: d.status ?? 'unknown',
        genre: d.generationOptions?.genre ?? 'Unknown',
        illustrationStyle: d.generationOptions?.illustrationStyle ?? 'Unknown',
        createdAt: typeof d.createdAt === 'number' ? d.createdAt : 0,
        pageCount: Array.isArray(d.pages) ? d.pages.length : 0,
        vocabularyCount: Array.isArray(d.vocabularyWords) ? d.vocabularyWords.length : 0,
        coverImageUrl: d.coverImageUrl,
      });
    });

    return stories;
  });

// ─── Audit Logs ──────────────────────────────────────────────────────────────

export const getAuditLogs = createServerFn({ method: 'GET' })
  .middleware([attachFirebaseAuth, requireFirebaseAuth])
  .validator((data: { limit?: number }) => data)
  .handler(async ({ data, context }) => {
    const userId = context.userId;
    const db = firebaseAdmin.firestore();

    const roleDoc = await db.collection('user_roles').doc(userId).get();
    const role = roleDoc.exists ? (roleDoc.data()?.role as string) : null;
    if (!role || !ADMIN_ROLES.includes(role)) {
      throw new Error('Forbidden: Admin access required');
    }

    const limit = data.limit ?? 50;
    const snapshot = await db.collection('audit_logs').orderBy('timestamp', 'desc').limit(limit).get();

    const logs: AdminAuditLog[] = [];
    snapshot.forEach((doc) => {
      const d = doc.data();
      let ts: string = new Date().toISOString();
      if (d.timestamp?.toDate) ts = d.timestamp.toDate().toISOString();
      else if (typeof d.timestamp === 'string') ts = d.timestamp;
      logs.push({
        id: doc.id,
        action: d.action ?? 'unknown',
        actorId: d.actorId ?? '',
        actorEmail: d.actorEmail ?? '',
        targetId: d.targetId ?? '',
        details: d.details ?? '',
        timestamp: ts,
      });
    });

    return logs;
  });

export const logAdminAction = createServerFn({ method: 'POST' })
  .middleware([attachFirebaseAuth, requireFirebaseAuth])
  .validator((data: { action: string; targetId?: string; details?: string }) => data)
  .handler(async ({ data, context }) => {
    const userId = context.userId;
    const db = firebaseAdmin.firestore();

    const userDoc = await db.collection('profiles').doc(userId).get();
    const email = userDoc.exists ? (userDoc.data()?.email as string) : 'unknown';

    await db.collection('audit_logs').add({
      action: data.action,
      actorId: userId,
      actorEmail: email,
      targetId: data.targetId ?? '',
      details: data.details ?? '',
      timestamp: FieldValue.serverTimestamp(),
    });

    return { success: true };
  });

// ─── User Actions ────────────────────────────────────────────────────────────

export const suspendUser = createServerFn({ method: 'POST' })
  .middleware([attachFirebaseAuth, requireFirebaseAuth])
  .validator((data: { userId: string }) => data)
  .handler(async ({ data, context }) => {
    const adminId = context.userId;
    const db = firebaseAdmin.firestore();

    const roleDoc = await db.collection('user_roles').doc(adminId).get();
    const role = roleDoc.exists ? (roleDoc.data()?.role as string) : null;
    if (!role || !ADMIN_ROLES.includes(role)) {
      throw new Error('Forbidden: Admin access required');
    }

    await db.collection('profiles').doc(data.userId).set(
      { disabled: true, updated_at: new Date().toISOString() },
      { merge: true }
    );

    await db.collection('audit_logs').add({
      action: 'user_suspended',
      actorId: adminId,
      targetId: data.userId,
      details: 'User suspended by admin',
      timestamp: FieldValue.serverTimestamp(),
    });

    return { success: true };
  });

export const banUser = createServerFn({ method: 'POST' })
  .middleware([attachFirebaseAuth, requireFirebaseAuth])
  .validator((data: { userId: string }) => data)
  .handler(async ({ data, context }) => {
    const adminId = context.userId;
    const db = firebaseAdmin.firestore();

    const roleDoc = await db.collection('user_roles').doc(adminId).get();
    const role = roleDoc.exists ? (roleDoc.data()?.role as string) : null;
    if (!role || !ADMIN_ROLES.includes(role)) {
      throw new Error('Forbidden: Admin access required');
    }

    await db.collection('profiles').doc(data.userId).set(
      { banned: true, disabled: true, updated_at: new Date().toISOString() },
      { merge: true }
    );

    await db.collection('audit_logs').add({
      action: 'user_banned',
      actorId: adminId,
      targetId: data.userId,
      details: 'User banned by admin',
      timestamp: FieldValue.serverTimestamp(),
    });

    return { success: true };
  });

export const reinstateUser = createServerFn({ method: 'POST' })
  .middleware([attachFirebaseAuth, requireFirebaseAuth])
  .validator((data: { userId: string }) => data)
  .handler(async ({ data, context }) => {
    const adminId = context.userId;
    const db = firebaseAdmin.firestore();

    const roleDoc = await db.collection('user_roles').doc(adminId).get();
    const role = roleDoc.exists ? (roleDoc.data()?.role as string) : null;
    if (!role || !ADMIN_ROLES.includes(role)) {
      throw new Error('Forbidden: Admin access required');
    }

    await db.collection('profiles').doc(data.userId).set(
      { disabled: false, banned: false, updated_at: new Date().toISOString() },
      { merge: true }
    );

    await db.collection('audit_logs').add({
      action: 'user_reinstated',
      actorId: adminId,
      targetId: data.userId,
      details: 'User reinstated by admin',
      timestamp: FieldValue.serverTimestamp(),
    });

    return { success: true };
  });

// ─── Story Actions ───────────────────────────────────────────────────────────

export const deleteStory = createServerFn({ method: 'POST' })
  .middleware([attachFirebaseAuth, requireFirebaseAuth])
  .validator((data: { storyId: string }) => data)
  .handler(async ({ data, context }) => {
    const adminId = context.userId;
    const db = firebaseAdmin.firestore();

    const roleDoc = await db.collection('user_roles').doc(adminId).get();
    const role = roleDoc.exists ? (roleDoc.data()?.role as string) : null;
    if (!role || !ADMIN_ROLES.includes(role)) {
      throw new Error('Forbidden: Admin access required');
    }

    await db.collection('stories').doc(data.storyId).delete();

    await db.collection('audit_logs').add({
      action: 'story_deleted',
      actorId: adminId,
      targetId: data.storyId,
      details: 'Story deleted by admin',
      timestamp: FieldValue.serverTimestamp(),
    });

    return { success: true };
  });

export const updateStoryStatus = createServerFn({ method: 'POST' })
  .middleware([attachFirebaseAuth, requireFirebaseAuth])
  .validator((data: { storyId: string; status: string }) => data)
  .handler(async ({ data, context }) => {
    const adminId = context.userId;
    const db = firebaseAdmin.firestore();

    const roleDoc = await db.collection('user_roles').doc(adminId).get();
    const role = roleDoc.exists ? (roleDoc.data()?.role as string) : null;
    if (!role || !ADMIN_ROLES.includes(role)) {
      throw new Error('Forbidden: Admin access required');
    }

    await db.collection('stories').doc(data.storyId).set(
      { status: data.status, moderatedAt: FieldValue.serverTimestamp() },
      { merge: true }
    );

    await db.collection('audit_logs').add({
      action: 'story_status_changed',
      actorId: adminId,
      targetId: data.storyId,
      details: `Status changed to ${data.status}`,
      timestamp: FieldValue.serverTimestamp(),
    });

    return { success: true };
  });
