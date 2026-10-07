import type { APIRoute } from "astro";
import { adminStorage } from "../../lib/firebase/admin";
import sharp from "sharp";
import crypto from "crypto";

export const POST: APIRoute = async ({ request, locals }) => {
  // Authentication check
  if (!locals.user || !locals.user.approved || !['admin', 'editor'].includes(locals.user.role)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), { status: 400 });
    }

    // Size limit check (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: "File exceeds 5MB limit" }), { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Optimize image and convert to WebP
    const optimizedBuffer = await sharp(buffer)
      .webp({ quality: 80 })
      .toBuffer();

    // Generate unique ID
    const uniqueId = crypto.randomUUID();
    const fileName = `uploads/${uniqueId}.webp`;

    // Upload to Firebase Storage using Admin SDK
    const bucket = adminStorage.bucket();
    const fileRef = bucket.file(fileName);
    
    await fileRef.save(optimizedBuffer, {
      metadata: {
        contentType: 'image/webp',
        metadata: {
          originalName: file.name,
          uploadedBy: locals.user.uid
        }
      },
      public: true
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    return new Response(JSON.stringify({ url: publicUrl, id: uniqueId }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error: any) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ error: error.message || "Upload failed" }), { status: 500 });
  }
};
