import type { APIRoute } from 'astro';
import {
  getPageData,
  savePageBlock,
  togglePageBlockVisibility,
  savePageListItem,
  togglePageListItemVisibility,
  addPageListItem,
  togglePageListVisibility,
} from '../../../lib/db';
import { canEditContent, getCurrentUser } from '../../../lib/auth';

export const prerender = false;

async function checkAuth(locals: App.Locals, cookies: any) {
  const user = locals.user || (await getCurrentUser(cookies));
  return user && canEditContent(user) ? user : null;
}

export const GET: APIRoute = async ({ request, locals, cookies }) => {
  const user = await checkAuth(locals, cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = new URL(request.url);
  const pageId = url.searchParams.get('pageId');

  if (!pageId) {
    return new Response(JSON.stringify({ error: 'Falta parámetro pageId' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const pageData = await getPageData(pageId);
  return new Response(JSON.stringify({ pageData }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request, locals, cookies }) => {
  const user = await checkAuth(locals, cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const data = await request.json();
    const { action, pageId, blockKey, listKey, itemId, text, defaultText, fallbackItems } = data;

    if (!pageId) {
      return new Response(JSON.stringify({ error: 'Falta parámetro pageId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    switch (action) {
      case 'save-block': {
        if (!blockKey || text === undefined) {
          return new Response(JSON.stringify({ error: 'Faltan parámetros blockKey o text' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        const block = await savePageBlock(pageId, blockKey, text);
        return new Response(JSON.stringify({ success: true, block }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'toggle-block-visibility': {
        if (!blockKey) {
          return new Response(JSON.stringify({ error: 'Falta parámetro blockKey' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        const block = await togglePageBlockVisibility(pageId, blockKey, defaultText || '');
        return new Response(JSON.stringify({ success: true, block }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'save-list-item': {
        if (!listKey || !itemId || text === undefined) {
          return new Response(JSON.stringify({ error: 'Faltan parámetros listKey, itemId o text' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        const item = await savePageListItem(pageId, listKey, itemId, text, fallbackItems);
        return new Response(JSON.stringify({ success: true, item }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'toggle-list-item-visibility': {
        if (!listKey || !itemId) {
          return new Response(JSON.stringify({ error: 'Faltan parámetros listKey o itemId' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        const item = await togglePageListItemVisibility(pageId, listKey, itemId, fallbackItems);
        return new Response(JSON.stringify({ success: true, item }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'add-list-item': {
        if (!listKey || text === undefined) {
          return new Response(JSON.stringify({ error: 'Faltan parámetros listKey o text' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        const item = await addPageListItem(pageId, listKey, text, fallbackItems);
        return new Response(JSON.stringify({ success: true, item }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'toggle-list-visibility': {
        if (!listKey) {
          return new Response(JSON.stringify({ error: 'Falta parámetro listKey' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        const list = await togglePageListVisibility(pageId, listKey);
        return new Response(JSON.stringify({ success: true, list }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Acción no válida' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
    }
  } catch (err: any) {
    console.error('Error in /api/admin/page-content:', err);
    return new Response(JSON.stringify({ error: err.message || 'Error del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
