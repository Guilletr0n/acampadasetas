import { defineMiddleware } from "astro:middleware";
import { adminAuth } from "./lib/firebase/admin";

export const onRequest = defineMiddleware(async (context, next) => {
  const sessionCookie = context.cookies.get("session")?.value;
  
  context.locals.user = null;
  
  if (sessionCookie) {
    try {
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
      context.locals.user = {
        uid: decodedClaims.uid,
        email: decodedClaims.email,
        role: decodedClaims.role || "reader", // default role
        approved: decodedClaims.approved === true,
      };
    } catch (error) {
      // Invalid or expired cookie
      context.cookies.delete("session", { path: "/" });
    }
  }

  // Route guarding based on role
  const url = new URL(context.request.url);
  
  if (url.pathname.startsWith('/admin')) {
    if (!context.locals.user) {
      return context.redirect('/login');
    }
    
    if (!context.locals.user.approved) {
      return context.redirect('/pending-approval');
    }

    if (url.pathname.startsWith('/admin/users') && context.locals.user.role !== 'admin') {
      return new Response("Forbidden: Admins only", { status: 403 });
    }
  }

  return next();
});
