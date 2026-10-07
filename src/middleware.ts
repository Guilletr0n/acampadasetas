import { defineMiddleware } from "astro:middleware";
import { getCurrentUser } from "./lib/auth";

export const onRequest = defineMiddleware(async (context, next) => {
  const user = await getCurrentUser(context.cookies);
  context.locals.user = user;

  const url = new URL(context.request.url);

  if (url.pathname.startsWith('/admin')) {
    if (!user) {
      return context.redirect(`/login?redirect=${encodeURIComponent(url.pathname)}`);
    }

    if (!user.approved) {
      return context.redirect('/pending-approval');
    }

    if (url.pathname.startsWith('/admin/users') && user.role !== 'admin') {
      return new Response("Acceso Denegado: Exclusivo para administradores", { status: 403 });
    }
  }

  return next();
});
