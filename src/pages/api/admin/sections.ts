import type { APIRoute } from 'astro';
import { getSections, getSectionById, saveSectionDraft, publishSection, getSectionHistory, restoreSectionDraft } from '../../../lib/db';
import { canEditContent } from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  if (!locals.user || !canEditContent(locals.user)) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 403 });
  }

  const url = new URL(request.url);
  const sectionId = url.searchParams.get('id');

  if (sectionId) {
    const section = await getSectionById(sectionId);
    const history = await getSectionHistory(sectionId);
    return new Response(JSON.stringify({ section, history }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const sections = await getSections(false);
  return new Response(JSON.stringify({ sections }), {
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
    const { action, id, title, subtitle, highlight, template, body, illustrationUrl, slug, order, historyId } = data;

    if (action === 'save-draft') {
      const sectionId = id || ('sec-' + (slug || title.toLowerCase().replace(/[^a-z0-9]/g, '-')));
      const saved = await saveSectionDraft(sectionId, {
        title,
        subtitle: subtitle || '',
        highlight: highlight || '',
        template: template || 'single-column',
        body: body || '',
        illustrationUrl: illustrationUrl || '',
      }, slug, order);

      return new Response(JSON.stringify({ success: true, section: saved }), { status: 200 });
    }

    if (action === 'publish') {
      if (!id) return new Response(JSON.stringify({ error: 'ID de sección requerido' }), { status: 400 });
      // First save draft if payload provided
      if (title) {
        await saveSectionDraft(id, {
          title,
          subtitle: subtitle || '',
          highlight: highlight || '',
          template: template || 'single-column',
          body: body || '',
          illustrationUrl: illustrationUrl || '',
        }, slug, order);
      }

      const published = await publishSection(id, locals.user.displayName || locals.user.email);
      return new Response(JSON.stringify({ success: true, section: published }), { status: 200 });
    }

    if (action === 'restore') {
      if (!id || !historyId) {
        return new Response(JSON.stringify({ error: 'ID de sección e historial requeridos' }), { status: 400 });
      }
      const restored = await restoreSectionDraft(id, historyId);
      return new Response(JSON.stringify({ success: true, section: restored }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'Acción desconocida' }), { status: 400 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error en gestión de secciones' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
