import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { productSchema } from '@/lib/validations';
import { auth } from '@/lib/auth';

// GET /api/products/[id] - Obtener un producto
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Producto no encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener producto' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Actualizar producto
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = productSchema.parse(body);

    const product = await prisma.product.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({
      success: true,
      product,
      message: 'Producto actualizado exitosamente',
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Producto no encontrado' },
        { status: 404 }
      );
    }
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Error al actualizar producto' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Eliminar producto
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Producto eliminado exitosamente',
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Producto no encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Error al eliminar producto' },
      { status: 500 }
    );
  }
}
