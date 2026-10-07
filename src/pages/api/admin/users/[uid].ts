import type { APIRoute } from "astro";
import { adminAuth, adminDb } from "../../../lib/firebase/admin";

export const PATCH: APIRoute = async ({ request, params, locals }) => {
  if (!locals.user || locals.user.role !== 'admin') {
    return new Response("Forbidden", { status: 403 });
  }

  const { uid } = params;
  if (!uid) return new Response("Missing UID", { status: 400 });

  try {
    const data = await request.json();
    
    // Update Firestore
    await adminDb.collection("users").doc(uid).update(data);
    
    // Update Custom Claims
    const user = await adminAuth.getUser(uid);
    const currentClaims = user.customClaims || {};
    
    await adminAuth.setCustomUserClaims(uid, {
      ...currentClaims,
      ...data
    });
    
    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    return new Response("Error updating user", { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  if (!locals.user || locals.user.role !== 'admin') {
    return new Response("Forbidden", { status: 403 });
  }

  const { uid } = params;
  if (!uid) return new Response("Missing UID", { status: 400 });

  try {
    await adminAuth.deleteUser(uid);
    await adminDb.collection("users").doc(uid).delete();
    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    return new Response("Error deleting user", { status: 500 });
  }
};
