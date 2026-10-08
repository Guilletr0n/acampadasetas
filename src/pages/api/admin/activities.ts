import type { APIRoute } from 'astro';
import { getActivities, saveActivity, updateActivityStatus, deleteDraftActivities } from '../../../lib/db';
import { canEditContent } from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user || !canEditContent(locals.user)) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 403 });
  }

  const activities = await getActivities(false);
  return new Response(JSON.stringify({ activities }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user || !canEditContent(locals.user)) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 403 });
  }

  try {
    const data = await request.json();
    const { action, id, time, title, description, status, ids } = data;

    if (action === 'add' || action === 'edit') {
      if (!time || !title) {
        return new Response(JSON.stringify({ error: 'La hora y el título son obligatorios' }), { status: 400 });
      }

      const activity = await saveActivity({
        id: id ? String(id).trim() : undefined,
        time: time.trim(),
        title: title.trim(),
        description: (description || '').trim(),
        status: status === 'draft' ? 'draft' : 'published',
      });

      return new Response(JSON.stringify({ success: true, activity }), { status: 200 });
    }

    if (action === 'status') {
      if (!id || (status !== 'published' && status !== 'draft')) {
        return new Response(JSON.stringify({ error: 'ID y estado válidos requeridos' }), { status: 400 });
      }

      const ok = await updateActivityStatus(id, status);
      return new Response(JSON.stringify({ success: ok }), { status: 200 });
    }

    if (action === 'delete-bulk') {
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return new Response(JSON.stringify({ error: 'Selecciona al menos una actividad para borrar' }), { status: 400 });
      }

      const result = await deleteDraftActivities(ids);
      if (result.notAllowed > 0 && result.deleted === 0) {
        return new Response(JSON.stringify({
          error: 'Solo se pueden borrar actividades en estado borrador. Pasa las actividades a borrador primero.',
          ...result,
        }), { status: 400 });
      }

      return new Response(JSON.stringify({ success: true, ...result }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'Acción desconocida' }), { status: 400 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error en gestión de actividades' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
