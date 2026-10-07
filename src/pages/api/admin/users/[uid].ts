import type { APIRoute } from 'astro';
import { updateUser, deleteUser } from '../../../../lib/users';
import { canManageUsers } from '../../../../lib/auth';

export const prerender = false;

export const PATCH: APIRoute = async ({ params, request, locals }) => {
  if (!locals.user || !canManageUsers(locals.user)) {
    return new Response(JSON.stringify({ error: 'Exclusivo para administradores' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { uid } = params;
  if (!uid) {
    return new Response(JSON.stringify({ error: 'UID no proporcionado' }), { status: 400 });
  }

  try {
    const data = await request.json();
    const updated = await updateUser(uid, data);
    return new Response(JSON.stringify({ success: true, user: updated }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error al actualizar usuario' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  if (!locals.user || !canManageUsers(locals.user)) {
    return new Response(JSON.stringify({ error: 'Exclusivo para administradores' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { uid } = params;
  if (!uid) {
    return new Response(JSON.stringify({ error: 'UID no proporcionado' }), { status: 400 });
  }

  try {
    const ok = await deleteUser(uid);
    return new Response(JSON.stringify({ success: ok }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error al eliminar usuario' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
