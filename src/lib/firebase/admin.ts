import { initializeApp, getApps, cert, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import fs from "node:fs";

// Check if we have credentials available
const hasEnvKey = !!(import.meta.env.FIREBASE_PRIVATE_KEY && import.meta.env.FIREBASE_CLIENT_EMAIL);
const hasGoogleCreds = !!process.env.GOOGLE_APPLICATION_CREDENTIALS;
const hasGcloudDefault = fs.existsSync(
  process.env.HOME + '/.config/gcloud/application_default_credentials.json'
) || fs.existsSync(
  process.env.APPDATA + '/gcloud/application_default_credentials.json'
);

const canInitialize = hasEnvKey || hasGoogleCreds || hasGcloudDefault || import.meta.env.PROD;

let adminApp: any;
let adminAuthInstance: any;
let adminDbInstance: any;
let adminStorageInstance: any;

if (canInitialize) {
  try {
    if (getApps().length > 0) {
      adminApp = getApps()[0];
    } else if (hasEnvKey) {
      const privateKey = import.meta.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
      adminApp = initializeApp({
        credential: cert({
          projectId: import.meta.env.GCP_PROJECT_ID || "acampadasetas",
          clientEmail: import.meta.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
        storageBucket: (import.meta.env.GCP_PROJECT_ID || "acampadasetas") + ".firebasestorage.app"
      });
    } else {
      adminApp = initializeApp({
        credential: applicationDefault(),
        projectId: import.meta.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || "acampadasetas",
        storageBucket: (import.meta.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || "acampadasetas") + ".firebasestorage.app"
      });
    }

    adminAuthInstance = getAuth(adminApp);
    adminDbInstance = getFirestore(adminApp);
    adminStorageInstance = getStorage(adminApp);
  } catch (error) {
    console.warn("⚠️ Firebase Admin initialization failed despite finding credentials:", error);
  }
} 

// If initialization failed or we have no credentials, provide safe mock instances for local dev
if (!adminApp) {
  console.warn("⚠️ No Firebase Admin credentials found or initialization failed.");
  console.warn("⚠️ Using MOCK Firebase Admin SDK for local development.");
  console.warn("⚠️ To fix: provide FIREBASE_PRIVATE_KEY in .env, or run 'gcloud auth application-default login'");

  adminAuthInstance = {
    verifyIdToken: async () => ({ uid: "mock-uid", email: "mock@example.com" }),
    verifySessionCookie: async () => ({ uid: "mock-uid", role: "admin", approved: true }),
    createSessionCookie: async () => "mock-session-cookie",
    getUser: async () => ({ customClaims: {} }),
    setCustomUserClaims: async () => {},
    deleteUser: async () => {}
  } as any;

  adminDbInstance = {
    collection: (name: string) => ({
      orderBy: () => adminDbInstance.collection(name),
      get: async () => ({ docs: [] }),
      doc: (id: string) => ({
        get: async () => ({ exists: false, data: () => ({}) }),
        set: async () => {},
        update: async () => {},
        delete: async () => {}
      })
    })
  } as any;

  adminStorageInstance = {
    bucket: () => ({
      file: () => ({
        save: async () => {}
      }),
      name: "mock-bucket"
    })
  } as any;
}

export const adminAuth = adminAuthInstance;
export const adminDb = adminDbInstance;
export const adminStorage = adminStorageInstance;
