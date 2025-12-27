import fs from 'fs/promises';
import path from 'path';
import { put, del } from '@vercel/blob';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const isProduction =
  process.env.VERCEL || process.env.NODE_ENV === 'production';
const useBlobStorage = isProduction && process.env.BLOB_READ_WRITE_TOKEN;

// Funciones para sistema de archivos local (desarrollo)
export async function ensureUploadDir() {
  if (useBlobStorage) return; // No necesario en producción con Blob

  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export function getUploadPath(filename: string): string {
  return path.join(UPLOAD_DIR, filename);
}

export function getUploadUrl(filename: string): string {
  return `/uploads/${filename}`;
}

export async function deleteUploadedFile(urlOrFilename: string): Promise<void> {
  try {
    // Si es una URL de Blob (empieza con http/https), usar Blob API
    if (
      useBlobStorage &&
      (urlOrFilename.startsWith('http://') ||
        urlOrFilename.startsWith('https://'))
    ) {
      await del(urlOrFilename);
      return;
    }

    // Si no, usar sistema de archivos local
    const filename = urlOrFilename.split('/').pop() || urlOrFilename;
    const filePath = getUploadPath(filename);
    await fs.unlink(filePath);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}

export function generateFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const ext = path.extname(originalName);
  return `products/${timestamp}-${randomString}${ext}`;
}

// Función para subir archivo (detecta automáticamente si usar Blob o filesystem)
export async function uploadFile(
  filename: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  if (useBlobStorage) {
    // Usar Vercel Blob en producción
    const blob = await put(filename, buffer, {
      access: 'public',
      contentType,
    });
    return blob.url;
  } else {
    // Usar sistema de archivos local en desarrollo
    await ensureUploadDir();
    const filePath = getUploadPath(filename);
    await fs.writeFile(filePath, buffer);
    return getUploadUrl(filename);
  }
}
