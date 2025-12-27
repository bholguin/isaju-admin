import fs from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function ensureUploadDir() {
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

export async function deleteUploadedFile(filename: string): Promise<void> {
  try {
    const filePath = getUploadPath(filename);
    await fs.unlink(filePath);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
}

export function generateFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const ext = path.extname(originalName);
  return `${timestamp}-${randomString}${ext}`;
}

