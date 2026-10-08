import fs from 'node:fs';
import path from 'node:path';
import type { User, UserRole } from './types';
import { Firestore } from '@google-cloud/firestore';

let firestoreDb: Firestore | null = null;

try {
  const projectId = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'acampadasetas';
  const databaseId = process.env.FIRESTORE_DATABASE_ID || '(default)';
  const defaultKeyPath = path.resolve(process.cwd(), 'service-account.json');
  const envKeyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const keyPath = (envKeyPath && fs.existsSync(envKeyPath)) ? envKeyPath : (fs.existsSync(defaultKeyPath) ? defaultKeyPath : undefined);

  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const credentials = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    firestoreDb = new Firestore({ projectId, credentials, databaseId });
  } else if (keyPath) {
    firestoreDb = new Firestore({ projectId, keyFilename: keyPath, databaseId });
  } else if (process.env.K_SERVICE || process.env.NODE_ENV === 'production') {
    firestoreDb = new Firestore({ projectId, databaseId });
  }
} catch (e) {
  console.warn('Firestore users init notice: using local fallback', e);
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const INITIAL_USERS: User[] = [
  {
    uid: 'user-admin-01',
    email: 'arrendataria@zohomail.com',
    displayName: 'Administración Acampada',
    role: 'admin',
    approved: true,
    password: 'admin123',
    createdAt: '2026-10-01T00:00:00.000Z',
  },
  {
    uid: 'user-editor-01',
    email: 'editor@acampadasetas.org',
    displayName: 'Editora Setas',
    role: 'editor',
    approved: true,
    password: 'editor123',
    createdAt: '2026-10-01T00:00:00.000Z',
  }
];

function ensureUsersFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(INITIAL_USERS, null, 2), 'utf-8');
  }
}

function readLocalUsers(): User[] {
  ensureUsersFile();
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
}

function writeLocalUsers(users: User[]) {
  ensureUsersFile();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

export async function seedUsersIfEmpty(): Promise<void> {
  if (!firestoreDb) return;
  try {
    const snap = await firestoreDb.collection('users').limit(1).get();
    if (snap.empty) {
      console.log('Seeding initial users to Firestore...');
      for (const u of INITIAL_USERS) {
        await firestoreDb.collection('users').doc(u.uid).set(u);
      }
      console.log('Initial users seeded successfully to Firestore.');
    }
  } catch (e) {
    console.warn('Firestore seedUsers notice:', e);
  }
}

export async function getUsers(): Promise<User[]> {
  if (firestoreDb) {
    try {
      await seedUsersIfEmpty();
      const snap = await firestoreDb.collection('users').get();
      if (!snap.empty) {
        return snap.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User));
      }
    } catch (e) {
      console.warn('Firestore getUsers fallback to local:', e);
    }
  }
  return readLocalUsers();
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const cleanEmail = email.trim().toLowerCase();
  if (firestoreDb) {
    try {
      await seedUsersIfEmpty();
      const snap = await firestoreDb.collection('users').where('email', '==', cleanEmail).limit(1).get();
      if (!snap.empty) {
        const doc = snap.docs[0];
        return { uid: doc.id, ...doc.data() } as User;
      }
    } catch (e) {
      console.warn('Firestore getUserByEmail fallback:', e);
    }
  }
  const users = readLocalUsers();
  return users.find(u => u.email.toLowerCase() === cleanEmail) || null;
}

export async function getUserById(uid: string): Promise<User | null> {
  if (firestoreDb) {
    try {
      const doc = await firestoreDb.collection('users').doc(uid).get();
      if (doc.exists) {
        return { uid: doc.id, ...doc.data() } as User;
      }
    } catch (e) {
      console.warn('Firestore getUserById fallback:', e);
    }
  }
  const users = readLocalUsers();
  return users.find(u => u.uid === uid) || null;
}

export async function createUser(data: { email: string; displayName: string; password?: string; role?: UserRole; approved?: boolean }): Promise<User> {
  const uid = 'usr-' + Math.random().toString(36).substring(2, 9);
  const now = new Date().toISOString();
  const newUser: User = {
    uid,
    email: data.email.trim().toLowerCase(),
    displayName: data.displayName.trim(),
    role: data.role || 'reader',
    approved: data.approved ?? false,
    password: data.password,
    createdAt: now,
  };

  if (firestoreDb) {
    try {
      await firestoreDb.collection('users').doc(uid).set(newUser);
    } catch (e) {
      console.warn('Firestore createUser fallback:', e);
    }
  }

  const users = readLocalUsers();
  users.push(newUser);
  writeLocalUsers(users);

  return newUser;
}

export async function updateUser(uid: string, updates: Partial<User>): Promise<User | null> {
  const now = new Date().toISOString();
  if (firestoreDb) {
    try {
      await firestoreDb.collection('users').doc(uid).set({ ...updates, updatedAt: now }, { merge: true });
    } catch (e) {
      console.warn('Firestore updateUser fallback:', e);
    }
  }

  const users = readLocalUsers();
  const index = users.findIndex(u => u.uid === uid);
  if (index === -1) return null;

  users[index] = { ...users[index], ...updates, updatedAt: now };
  writeLocalUsers(users);
  return users[index];
}

export async function deleteUser(uid: string): Promise<boolean> {
  if (firestoreDb) {
    try {
      await firestoreDb.collection('users').doc(uid).delete();
    } catch (e) {
      console.warn('Firestore deleteUser fallback:', e);
    }
  }

  const users = readLocalUsers();
  const filtered = users.filter(u => u.uid !== uid);
  if (filtered.length === users.length) return false;
  writeLocalUsers(filtered);
  return true;
}
