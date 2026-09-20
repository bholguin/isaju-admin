import sharp from 'sharp';

const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 80;

export async function optimizeProductImage(
  buffer: Buffer,
  originalContentType: string
): Promise<{
  buffer: Buffer;
  contentType: string;
  extension: string;
}> {
  try {
    const image = sharp(buffer, { failOn: 'none' }).rotate();
    const metadata = await image.clone().metadata();
    const width = metadata.width ?? 0;
    const height = metadata.height ?? 0;

    if (width === 0 && height === 0) {
      return {
        buffer,
        contentType: originalContentType,
        extension: '',
      };
    }

    let pipeline = image;
    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      const resize =
        width >= height
          ? { width: MAX_DIMENSION, withoutEnlargement: true }
          : { height: MAX_DIMENSION, withoutEnlargement: true };
      pipeline = pipeline.resize(resize);
    }

    const optimized = await pipeline
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toBuffer();

    return {
      buffer: optimized,
      contentType: 'image/webp',
      extension: '.webp',
    };
  } catch (error) {
    console.error('Error optimizing image, using original:', error);
    return {
      buffer,
      contentType: originalContentType,
      extension: '',
    };
  }
}
