import { prisma } from '@/lib/db/prisma';
import { notFound } from 'next/navigation';
import { ProductImage } from '@/components/ui/ProductImage';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Edit, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  return product;
}

export default async function ProductDetailPage({
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
      <div className="flex items-center justify-between">
        <div>
          <Link href="/products">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a productos
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600 mt-1">Vista previa del producto</p>
        </div>
        <Link href={`/products/${product.id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Imágenes</CardTitle>
          </CardHeader>
          <CardContent>
            {product.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden">
                    <ProductImage
                      src={image}
                      alt={`${product.name} - Imagen ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No hay imágenes</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Precio
              </label>
              <p className="text-2xl font-bold mt-1">{product.price}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Estado
              </label>
              <div className="mt-1">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded ${
                    product.published
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {product.published ? 'Publicado' : 'Borrador'}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Descripción
              </label>
              <p className="mt-1 text-gray-700 whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-gray-500">Creado</label>
                  <p className="font-medium mt-1">
                    {new Date(product.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-gray-500">Actualizado</label>
                  <p className="font-medium mt-1">
                    {new Date(product.updatedAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
