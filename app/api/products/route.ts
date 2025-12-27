import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { productSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";

// GET /api/products - Listar productos (público para GET)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const published = searchParams.get("published");

    const where: any = {};
    if (published === "true") {
      where.published = true;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

// POST /api/products - Crear producto (requiere autenticación)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = productSchema.parse(body);

    const product = await prisma.product.create({
      data: validatedData,
    });

    return NextResponse.json({
      success: true,
      product,
      message: "Producto creado exitosamente",
    });
  } catch (error: any) {
    console.error("Error creating product:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Error al crear producto" },
      { status: 500 }
    );
  }
}

