import { prisma } from "@/lib/db/prisma";
import { ProductForm } from "@/components/forms/ProductForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { EditProductClient } from "./EditProductClient";

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  return product;
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Producto</h1>
        <p className="text-gray-600 mt-1">
          Modifica la información del producto
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Producto</CardTitle>
          <CardDescription>
            Modifica los campos que desees actualizar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditProductClient product={product} />
        </CardContent>
      </Card>
    </div>
  );
}

