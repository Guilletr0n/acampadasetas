import type { APIRoute } from "astro";
import { adminAuth, adminDb } from "../../../lib/firebase/admin";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { idToken, email, name, isRegistration } = await request.json();
    
    if (!idToken) {
      return new Response("No token provided", { status: 400 });
    }

    // Verify token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    if (isRegistration) {
      // First-time registration logic
      // Check if user document exists
      const userDocRef = adminDb.collection("users").doc(decodedToken.uid);
      const userDoc = await userDocRef.get();
      
      if (!userDoc.exists) {
        // Create user document with default permissions
        await userDocRef.set({
          email: email || decodedToken.email,
          name: name || "",
          role: "reader",
          approved: false,
          createdAt: new Date().toISOString()
        });
        
        // Set custom claims in Auth
        await adminAuth.setCustomUserClaims(decodedToken.uid, {
          role: "reader",
          approved: false
        });
      }
    }

    // Create session cookie (expires in 5 days)
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    cookies.set("session", sessionCookie, {
      path: "/",
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "lax",
      maxAge: expiresIn / 1000
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Auth session error:", error);
    return new Response("Unauthorized", { status: 401 });
  }
};
