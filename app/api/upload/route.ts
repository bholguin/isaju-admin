import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateFilename, uploadFile } from '@/lib/upload';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No se proporcionaron archivos' },
        { status: 400 }
      );
    }

    if (files.length > 10) {
      return NextResponse.json(
        { success: false, error: 'Máximo 10 imágenes por producto' },
        { status: 400 }
      );
    }

    const uploadedFiles: string[] = [];

    for (const file of files) {
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        return NextResponse.json(
          {
            success: false,
            error: `Tipo de archivo no válido: ${file.name}. Solo se permiten JPG, PNG y WebP`,
          },
          { status: 400 }
        );
      }

      // Validar tamaño (5MB máximo)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return NextResponse.json(
          {
            success: false,
            error: `Archivo demasiado grande: ${file.name}. Máximo 5MB`,
          },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filename = generateFilename(file.name);
      const url = await uploadFile(filename, buffer, file.type);
      uploadedFiles.push(url);
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: 'Archivos subidos exitosamente',
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { success: false, error: 'Error al subir archivos' },
      { status: 500 }
    );
  }
}
