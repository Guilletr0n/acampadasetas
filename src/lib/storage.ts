import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { Storage } from '@google-cloud/storage';

const UPLOADS_DIR = path.resolve(process.cwd(), '.data', 'uploads');

export function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

let gcsStorage: Storage | null = null;
const bucketName = process.env.GCS_BUCKET_NAME || 'acampadasetas-media';

try {
  const projectId = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'acampadasetas';
  const defaultKeyPath = path.resolve(process.cwd(), 'service-account.json');
  const envKeyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const keyPath = (envKeyPath && fs.existsSync(envKeyPath)) ? envKeyPath : (fs.existsSync(defaultKeyPath) ? defaultKeyPath : undefined);

  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const credentials = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    gcsStorage = new Storage({ projectId, credentials });
  } else if (keyPath) {
    gcsStorage = new Storage({ projectId, keyFilename: keyPath });
  } else if (process.env.K_SERVICE || process.env.NODE_ENV === 'production') {
    gcsStorage = new Storage({ projectId });
  }
} catch (e) {
  console.warn('GCS Storage initialization notice: Using local filesystem fallback.', e);
}

export async function uploadImage(buffer: Buffer, originalName: string): Promise<string> {
  // Max 5 MB check
  if (buffer.length > 5 * 1024 * 1024) {
    throw new Error('El archivo supera el límite máximo de 5 MB.');
  }

  // Convert to WebP
  const optimizedBuffer = await sharp(buffer)
    .webp({ quality: 85 })
    .toBuffer();

  const uniqueId = crypto.randomUUID();
  const filename = `${uniqueId}.webp`;

  // Try Google Cloud Storage in GCP/Production
  if (gcsStorage) {
    try {
      const bucket = gcsStorage.bucket(bucketName);
      const file = bucket.file(`images/${filename}`);

      await file.save(optimizedBuffer, {
        metadata: {
          contentType: 'image/webp',
          cacheControl: 'public, max-age=31536000',
        },
        resumable: false,
      });

      const publicUrl = `https://storage.googleapis.com/${bucketName}/images/${filename}`;
      return publicUrl;
    } catch (gcsError) {
      console.warn('GCS upload error, saving to local filesystem fallback:', gcsError);
    }
  }

  // Local filesystem fallback
  ensureUploadsDir();
  const filePath = path.join(UPLOADS_DIR, filename);
  fs.writeFileSync(filePath, optimizedBuffer);

  return `/api/media/${filename}`;
}

export function getLocalImagePath(filename: string): string | null {
  ensureUploadsDir();
  const safeFilename = path.basename(filename);
  const filePath = path.join(UPLOADS_DIR, safeFilename);
  if (fs.existsSync(filePath)) {
    return filePath;
  }
  return null;
}
