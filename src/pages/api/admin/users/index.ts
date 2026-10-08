import type { APIRoute } from 'astro';
import { createUser, getUserByEmail } from '../../../../lib/users';
import { canManageUsers } from '../../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user || !canManageUsers(locals.user)) {
    return new Response(JSON.stringify({ error: 'Exclusivo para administradores' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const data = await request.json().catch(() => ({}));
    const { displayName, email, password, role, approved } = data;

    if (!displayName || !email || !password) {
      return new Response(JSON.stringify({ error: 'Nombre, email y contraseña son obligatorios' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (password.length < 6) {
      return new Response(JSON.stringify({ error: 'La contraseña debe tener al menos 6 caracteres' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return new Response(JSON.stringify({ error: 'Ya existe un usuario con este correo electrónico' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newUser = await createUser({
      displayName,
      email,
      password,
      role: role || 'editor',
      approved: approved ?? true,
    });

    return new Response(JSON.stringify({ success: true, user: newUser }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error al crear usuario' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
