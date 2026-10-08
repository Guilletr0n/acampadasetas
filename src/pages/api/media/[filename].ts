import type { APIRoute } from 'astro';
import fs from 'node:fs';
import { getLocalImagePath } from '../../../lib/storage';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const { filename } = params;
  if (!filename) {
    return new Response('Archivo no especificado', { status: 400 });
  }

  const filePath = getLocalImagePath(filename);
  if (!filePath || !fs.existsSync(filePath)) {
    return new Response('Archivo no encontrado', { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  return new Response(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
