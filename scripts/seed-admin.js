
import { initializeApp, cert, getApps, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const email = process.argv[2] || "admin@acampadasetas.org";
const password = process.argv[3] || "admin123456";

async function run() {
  const hasEnvKey = !!(process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL);
  
  let app;
  if (hasEnvKey) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    app = initializeApp({
      credential: cert({
        projectId: process.env.GCP_PROJECT_ID || "acampadasetas",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      })
    });
  } else {
    app = initializeApp({
      credential: applicationDefault(),
      projectId: process.env.GCP_PROJECT_ID || "acampadasetas"
    });
  }

  const auth = getAuth(app);
  const db = getFirestore(app);

  try {
    console.log(`Creating user ${email}...`);
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
      console.log("User already exists, updating password...");
      await auth.updateUser(userRecord.uid, { password });
    } catch (e) {
      if (e.code === 'auth/user-not-found') {
        userRecord = await auth.createUser({
          email,
          password,
          displayName: "Admin"
        });
      } else {
        throw e;
      }
    }

    console.log("Setting custom claims to admin...");
    await auth.setCustomUserClaims(userRecord.uid, {
      role: "admin",
      approved: true
    });

    console.log("Creating Firestore user document...");
    await db.collection("users").doc(userRecord.uid).set({
      email,
      name: "Admin",
      role: "admin",
      approved: true,
      createdAt: new Date().toISOString()
    }, { merge: true });

    console.log(`\nSuccess! Admin created.\nEmail: ${email}\nPassword: ${password}`);

  } catch (error) {
    console.error("Error seeding admin:", error);
  }
}

run();
