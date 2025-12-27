"use client";

import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        router.refresh();
      } else {
        alert(data.error || "Error al eliminar producto");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error al eliminar producto");
    } finally {
      setDeletingId(null);
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-gray-500 mb-4">No hay productos aún.</p>
        <Link href="/products/new">
          <Button>Crear primer producto</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Imagen
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.images[0] ? (
                    <div className="relative w-16 h-16">
                      <ProductImage
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Sin imagen</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {product.name}
                  </div>
                  <div className="text-sm text-gray-500 line-clamp-2">
                    {product.description.substring(0, 100)}...
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      product.published
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {product.published ? "Publicado" : "Borrador"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(product.createdAt).toLocaleDateString("es-ES")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/products/${product.id}`}>
                      <Button variant="ghost" size="icon" title="Ver">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/products/${product.id}/edit`}>
                      <Button variant="ghost" size="icon" title="Editar">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product.id, product.name)}
                      disabled={deletingId === product.id}
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

