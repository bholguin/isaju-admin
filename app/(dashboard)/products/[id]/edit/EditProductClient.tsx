"use client";

import { ProductForm } from "@/components/forms/ProductForm";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";

interface EditProductClientProps {
  product: Product;
}

export function EditProductClient({ product }: EditProductClientProps) {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        router.push("/products");
      } else {
        alert(result.error || "Error al actualizar producto");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error al actualizar producto");
    }
  };

  return (
    <ProductForm
      initialData={{
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        images: product.images,
        published: product.published,
        estado: product.estado,
        order: product.order || undefined,
      }}
      onSubmit={handleSubmit}
    />
  );
}

