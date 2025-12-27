import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { deleteUploadedFile, getUploadPath } from "@/lib/upload";
import fs from "fs/promises";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    // Extraer solo el nombre del archivo de la ruta completa
    const { filename: filenameParam } = await params;
    const filename = filenameParam.split("/").pop() || filenameParam;
    
    await deleteUploadedFile(filename);

    return NextResponse.json({
      success: true,
      message: "Archivo eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { success: false, error: "Error al eliminar archivo" },
      { status: 500 }
    );
  }
}

