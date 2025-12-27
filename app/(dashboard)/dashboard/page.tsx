import { prisma } from '@/lib/db/prisma';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Package, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

async function getStats() {
  const [total, published, drafts] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { published: true } }),
    prisma.product.count({ where: { published: false } }),
  ]);

  return { total, published, drafts };
}

async function getRecentProducts() {
  return prisma.product.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      price: true,
      published: true,
      createdAt: true,
      images: true,
    },
  });
}

export default async function DashboardPage() {
  const stats = await getStats();
  const recentProducts = await getRecentProducts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Bienvenido al panel de administración de Isaju
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Productos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Productos Publicados
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borradores</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.drafts}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Productos Recientes</CardTitle>
              <CardDescription>
                Últimos productos agregados al catálogo
              </CardDescription>
            </div>
            <Link href="/products">
              <Button variant="outline">Ver todos</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No hay productos aún.{' '}
              <Link
                href="/products/new"
                className="text-secondary hover:underline">
                Crear primer producto
              </Link>
            </p>
          ) : (
            <div className="space-y-4">
              {recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    {product.images[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.price}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          product.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {product.published ? 'Publicado' : 'Borrador'}
                      </span>
                    </div>
                  </div>
                  <Link href={`/products/${product.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
