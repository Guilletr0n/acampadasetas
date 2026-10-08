import type { APIRoute } from 'astro';
import { getSections, getSectionById, saveSectionDraft, publishSection, getSectionHistory, restoreSectionDraft, deleteSection } from '../../../lib/db';
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
    const { action, id, title, navLabel, subtitle, highlight, template, body, illustrationUrl, slug, order, historyId } = data;
    const authorName = locals.user.displayName || locals.user.email || 'Editor';

    const cleanSlug = (slug || (title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : '') || 'seccion').toLowerCase();
    const generateId = () => `sec-${cleanSlug || Math.random().toString(36).substring(2, 7)}`;

    if (action === 'save-draft') {
      let sectionId = (id && id !== 'new') ? id : generateId();
      if (!id || id === 'new') {
        const existing = await getSectionById(sectionId);
        if (existing) {
          sectionId = `${sectionId}-${Date.now().toString().slice(-4)}`;
        }
      }

      const saved = await saveSectionDraft(sectionId, {
        title: title || 'Sin título',
        navLabel: navLabel || '',
        subtitle: subtitle || '',
        highlight: highlight || '',
        template: template || 'single-column',
        body: body || '',
        illustrationUrl: illustrationUrl || '',
      }, cleanSlug, order, authorName);

      const history = await getSectionHistory(sectionId);
      return new Response(JSON.stringify({ success: true, section: saved, history }), { status: 200 });
    }

    if (action === 'publish') {
      let sectionId = (id && id !== 'new') ? id : generateId();
      if (!id || id === 'new') {
        const existing = await getSectionById(sectionId);
        if (existing) {
          sectionId = `${sectionId}-${Date.now().toString().slice(-4)}`;
        }
      }

      if (title || (!id || id === 'new')) {
        await saveSectionDraft(sectionId, {
          title: title || 'Sin título',
          navLabel: navLabel || '',
          subtitle: subtitle || '',
          highlight: highlight || '',
          template: template || 'single-column',
          body: body || '',
          illustrationUrl: illustrationUrl || '',
        }, cleanSlug, order, authorName);
      }

      const published = await publishSection(sectionId, authorName);
      if (!published) {
        return new Response(JSON.stringify({ error: 'No se pudo publicar la sección' }), { status: 500 });
      }
      const history = await getSectionHistory(sectionId);
      return new Response(JSON.stringify({ success: true, section: published, history }), { status: 200 });
    }

    if (action === 'restore') {
      if (!id || !historyId) {
        return new Response(JSON.stringify({ error: 'ID de sección e historial requeridos' }), { status: 400 });
      }
      const restored = await restoreSectionDraft(id, historyId);
      const history = await getSectionHistory(id);
      return new Response(JSON.stringify({ success: true, section: restored, history }), { status: 200 });
    }

    if (action === 'delete') {
      if (!id) return new Response(JSON.stringify({ error: 'ID de sección requerido' }), { status: 400 });
      const ok = await deleteSection(id);
      return new Response(JSON.stringify({ success: ok }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'Acción desconocida' }), { status: 400 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Error en gestión de secciones' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
