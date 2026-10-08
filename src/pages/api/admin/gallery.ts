import type { APIRoute } from 'astro';
import { getGalleryItems, addGalleryItem, updateGalleryItem, deleteGalleryItem } from '../../../lib/db';
import { canEditContent } from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async () => {
  const items = await getGalleryItems();
  return new Response(JSON.stringify({ items }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user || !canEditContent(locals.user)) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 403 });
  }

  try {
    const data = await request.json().catch(() => ({}));
    const { id, url, caption, author, social, order } = data;

    if (id) {
      const updates: any = {};
      if (url !== undefined && url !== null) updates.url = String(url).trim();
      if (caption !== undefined && caption !== null) updates.caption = String(caption).trim();
      if (author !== undefined && author !== null) updates.author = String(author).trim();
      if (social !== undefined && social !== null) updates.social = String(social).trim();
      if (order !== undefined && order !== null && order !== '') {
        updates.order = parseInt(String(order), 10) || 1;
      }

      const updated = await updateGalleryItem(id, updates);
      if (!updated) {
        return new Response(JSON.stringify({ error: 'Fotografía no encontrada' }), { status: 404 });
      }
      return new Response(JSON.stringify({ success: true, item: updated }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!url) {
      return new Response(JSON.stringify({ error: 'URL de imagen requerida' }), { status: 400 });
    }

    const newItem = await addGalleryItem({
      url: String(url).trim(),
      caption: caption ? String(caption).trim() : '',
      author: author ? String(author).trim() : 'Anónimo',
      social: social ? String(social).trim() : '',
      order: order !== undefined && order !== '' ? (parseInt(String(order), 10) || 1) : 1,
    });

    return new Response(JSON.stringify({ success: true, item: newItem }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error en galería' }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request, locals, url }) => {
  if (!locals.user || !canEditContent(locals.user)) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    let id = url.searchParams.get('id');
    if (!id) {
      const data = await request.json().catch(() => ({}));
      id = data.id;
    }

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID requerido para eliminar fotografía' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ok = await deleteGalleryItem(id);
    if (!ok) {
      return new Response(JSON.stringify({ error: 'No se pudo eliminar la fotografía' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error al eliminar' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
