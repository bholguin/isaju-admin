import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { deleteUploadedFile } from '@/lib/upload';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    // El filename puede ser un nombre de archivo o una URL completa (en producción con Blob)
    // deleteUploadedFile detecta automáticamente si es URL o filename
    let urlOrFilename = params.filename;

    // Si viene en el query string como URL completa, usarla directamente
    const urlParam = request.nextUrl.searchParams.get('url');
    if (urlParam) {
      urlOrFilename = urlParam;
    } else {
      // Si no, extraer solo el nombre del archivo de la ruta
      urlOrFilename = params.filename.split('/').pop() || params.filename;
    }

    await deleteUploadedFile(urlOrFilename);

    return NextResponse.json({
      success: true,
      message: 'Archivo eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar archivo' },
      { status: 500 }
    );
  }
}
