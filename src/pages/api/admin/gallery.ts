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
    const data = await request.json();
    const { id, url, caption, author, social, order } = data;

    if (id) {
      const updated = await updateGalleryItem(id, { url, caption, author, social, order });
      return new Response(JSON.stringify({ success: true, item: updated }), { status: 200 });
    }

    if (!url) {
      return new Response(JSON.stringify({ error: 'URL de imagen requerida' }), { status: 400 });
    }

    const newItem = await addGalleryItem({
      url,
      caption: caption || '',
      author: author || 'Anónimo',
      social: social || '',
      order: order ?? 1,
    });

    return new Response(JSON.stringify({ success: true, item: newItem }), { status: 201 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error en galería' }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  if (!locals.user || !canEditContent(locals.user)) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 403 });
  }

  try {
    const data = await request.json();
    const { id } = data;
    if (!id) return new Response(JSON.stringify({ error: 'ID requerido' }), { status: 400 });

    const ok = await deleteGalleryItem(id);
    return new Response(JSON.stringify({ success: ok }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error al eliminar' }), { status: 500 });
  }
};
