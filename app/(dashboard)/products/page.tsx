import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductList } from "@/components/products/ProductList";

async function getProducts() {
  return prisma.product.findMany({
    orderBy: [
      { order: "asc" },
      { createdAt: "desc" },
    ],
  });
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Productos</h1>
          <p className="text-gray-600 mt-1">
            Gestiona el catálogo de productos de Isaju
          </p>
        </div>
        <Link href="/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        </Link>
      </div>

      <ProductList products={products} />
    </div>
  );
}

