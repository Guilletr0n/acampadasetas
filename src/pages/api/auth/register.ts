import type { APIRoute } from 'astro';
import { getUserByEmail, createUser } from '../../../lib/users';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json().catch(() => ({}));
    const { name, email, password } = data;

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: 'Todos los campos son obligatorios (Nombre, Email y Contraseña).' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (password.length < 6) {
      return new Response(JSON.stringify({ error: 'La contraseña debe tener al menos 6 caracteres.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return new Response(JSON.stringify({ error: 'Ya existe una cuenta con este correo electrónico.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Default reader role and pending approval status
    const newUser = await createUser({
      email,
      displayName: name,
      password,
      role: 'reader',
      approved: false,
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Solicitud recibida. Tu cuenta está pendiente de revisión por el equipo de administración.'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error en el registro.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
